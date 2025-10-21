use anyhow::Result;
use ed25519_dalek::{Keypair, PublicKey, SecretKey, Signature, Signer};
use openssh_keys::{PublicKey as OpenSshPublicKey, PrivateKey as OpenSshPrivateKey};
use ring::digest;
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    path::{Path, PathBuf},
    sync::Arc,
};
use tokio::{
    fs,
    io::{AsyncReadExt, AsyncWriteExt},
    process::Command,
    sync::RwLock,
};

/// SSH key management system
pub struct SshManager {
    config: super::SshConfig,
    keys: Arc<RwLock<HashMap<String, SshKey>>>,
    agent: Option<SshAgent>,
}

impl SshManager {
    pub async fn new(config: &super::SshConfig) -> Result<Self> {
        // Ensure SSH directory exists
        fs::create_dir_all(&config.keys_dir).await?;
        
        let mut manager = Self {
            config: config.clone(),
            keys: Arc::new(RwLock::new(HashMap::new())),
            agent: None,
        };
        
        // Load existing keys
        manager.load_existing_keys().await?;
        
        // Initialize SSH agent if available
        if config.agent_forwarding {
            manager.agent = SshAgent::connect().await.ok();
        }
        
        Ok(manager)
    }
    
    /// Generate a new SSH key pair
    pub async fn generate_key(&self, name: &str, key_type: &str) -> Result<PathBuf> {
        let key_path = self.config.keys_dir.join(format!("katalyst_{}", name));
        
        match key_type {
            "ed25519" => {
                self.generate_ed25519_key(&key_path, name).await?;
            }
            "rsa" => {
                self.generate_rsa_key(&key_path, name).await?;
            }
            _ => {
                return Err(anyhow::anyhow!("Unsupported key type: {}", key_type));
            }
        }
        
        // Add to managed keys
        self.add_key(&key_path).await?;
        
        Ok(key_path)
    }
    
    /// List all managed SSH keys
    pub async fn list_keys(&self) -> Result<Vec<SshKeyInfo>> {
        let keys = self.keys.read().await;
        
        let mut key_list = Vec::new();
        for (name, key) in keys.iter() {
            key_list.push(SshKeyInfo {
                name: name.clone(),
                key_type: key.key_type.clone(),
                fingerprint: Some(key.fingerprint.clone()),
                path: key.path.clone(),
                public_key: key.public_key.clone(),
            });
        }
        
        Ok(key_list)
    }
    
    /// Add an existing SSH key
    pub async fn add_key(&self, path: &Path) -> Result<SshKeyInfo> {
        // Read private key
        let private_key_content = fs::read_to_string(path).await?;
        
        // Read public key
        let public_key_path = PathBuf::from(format!("{}.pub", path.display()));
        let public_key_content = if public_key_path.exists() {
            fs::read_to_string(&public_key_path).await?
        } else {
            // Generate public key from private key
            self.derive_public_key(&private_key_content).await?
        };
        
        // Calculate fingerprint
        let fingerprint = self.calculate_fingerprint(&public_key_content)?;
        
        // Determine key type
        let key_type = if private_key_content.contains("BEGIN OPENSSH PRIVATE KEY") {
            "ed25519"
        } else if private_key_content.contains("BEGIN RSA PRIVATE KEY") {
            "rsa"
        } else {
            "unknown"
        }.to_string();
        
        // Extract name from path
        let name = path.file_stem()
            .and_then(|s| s.to_str())
            .unwrap_or("unknown")
            .to_string();
        
        let ssh_key = SshKey {
            name: name.clone(),
            path: path.to_path_buf(),
            public_key: public_key_content,
            private_key: Some(private_key_content),
            key_type: key_type.clone(),
            fingerprint: fingerprint.clone(),
            encrypted: self.is_key_encrypted(&private_key_content),
        };
        
        self.keys.write().await.insert(name.clone(), ssh_key);
        
        // Add to SSH agent if available
        if let Some(ref agent) = self.agent {
            agent.add_key(path).await.ok();
        }
        
        Ok(SshKeyInfo {
            name,
            key_type,
            fingerprint: Some(fingerprint),
            path: path.to_path_buf(),
            public_key: public_key_content,
        })
    }
    
    /// Remove an SSH key
    pub async fn remove_key(&self, name: &str) -> Result<()> {
        let mut keys = self.keys.write().await;
        
        if let Some(key) = keys.remove(name) {
            // Remove from SSH agent if available
            if let Some(ref agent) = self.agent {
                agent.remove_key(&key.path).await.ok();
            }
            
            Ok(())
        } else {
            Err(anyhow::anyhow!("Key not found: {}", name))
        }
    }
    
    /// Load a specific key by path
    pub async fn load_key(&self, path: &Path) -> Result<()> {
        self.add_key(path).await?;
        Ok(())
    }
    
    /// Load a key by name
    pub async fn load_key_by_name(&self, name: &str) -> Result<()> {
        let keys = self.keys.read().await;
        
        if let Some(key) = keys.get(name) {
            // Key already loaded
            Ok(())
        } else {
            // Try to find key in keys directory
            let key_path = self.config.keys_dir.join(name);
            if key_path.exists() {
                drop(keys);
                self.add_key(&key_path).await?;
                Ok(())
            } else {
                Err(anyhow::anyhow!("Key not found: {}", name))
            }
        }
    }
    
    /// Get a key's content for use in connections
    pub async fn get_key_content(&self, name: &str) -> Result<(String, String)> {
        let keys = self.keys.read().await;
        
        if let Some(key) = keys.get(name) {
            Ok((
                key.private_key.clone().unwrap_or_default(),
                key.public_key.clone(),
            ))
        } else {
            Err(anyhow::anyhow!("Key not found: {}", name))
        }
    }
    
    /// Decrypt an encrypted key
    pub async fn decrypt_key(&self, name: &str, passphrase: &str) -> Result<String> {
        let keys = self.keys.read().await;
        
        if let Some(key) = keys.get(name) {
            if !key.encrypted {
                return Ok(key.private_key.clone().unwrap_or_default());
            }
            
            // Decrypt using OpenSSL or similar
            // This is a placeholder - actual implementation would use proper crypto
            tracing::warn!("Key decryption not yet implemented");
            Ok(key.private_key.clone().unwrap_or_default())
        } else {
            Err(anyhow::anyhow!("Key not found: {}", name))
        }
    }
    
    // Private helper methods
    
    async fn generate_ed25519_key(&self, path: &Path, name: &str) -> Result<()> {
        // Generate keypair
        let mut rng = rand::thread_rng();
        let keypair = Keypair::generate(&mut rng);
        
        // Convert to OpenSSH format
        let private_key = self.keypair_to_openssh_private(&keypair)?;
        let public_key = self.keypair_to_openssh_public(&keypair, name)?;
        
        // Write private key
        let mut private_file = fs::File::create(path).await?;
        private_file.write_all(private_key.as_bytes()).await?;
        
        // Set permissions (600)
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            let metadata = private_file.metadata().await?;
            let mut permissions = metadata.permissions();
            permissions.set_mode(0o600);
            fs::set_permissions(path, permissions).await?;
        }
        
        // Write public key
        let public_path = PathBuf::from(format!("{}.pub", path.display()));
        fs::write(&public_path, public_key).await?;
        
        Ok(())
    }
    
    async fn generate_rsa_key(&self, path: &Path, name: &str) -> Result<()> {
        // Use ssh-keygen command for RSA keys
        let output = Command::new("ssh-keygen")
            .args(&[
                "-t", "rsa",
                "-b", "4096",
                "-f", path.to_str().unwrap(),
                "-N", "", // No passphrase
                "-C", &format!("katalyst@{}", name),
            ])
            .output()
            .await?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to generate RSA key: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        Ok(())
    }
    
    fn keypair_to_openssh_private(&self, keypair: &Keypair) -> Result<String> {
        // Convert Ed25519 keypair to OpenSSH private key format
        // This is a simplified version - real implementation would follow OpenSSH spec
        let private_bytes = keypair.secret.to_bytes();
        let public_bytes = keypair.public.to_bytes();
        
        let mut key_data = Vec::new();
        key_data.extend_from_slice(&private_bytes);
        key_data.extend_from_slice(&public_bytes);
        
        let encoded = base64::encode(&key_data);
        
        Ok(format!(
            "-----BEGIN OPENSSH PRIVATE KEY-----\n{}\n-----END OPENSSH PRIVATE KEY-----\n",
            encoded
        ))
    }
    
    fn keypair_to_openssh_public(&self, keypair: &Keypair, comment: &str) -> Result<String> {
        let public_bytes = keypair.public.to_bytes();
        let encoded = base64::encode(&public_bytes);
        
        Ok(format!("ssh-ed25519 {} {}\n", encoded, comment))
    }
    
    async fn derive_public_key(&self, private_key: &str) -> Result<String> {
        // Use ssh-keygen to derive public key
        let temp_file = tempfile::NamedTempFile::new()?;
        fs::write(temp_file.path(), private_key).await?;
        
        let output = Command::new("ssh-keygen")
            .args(&["-y", "-f", temp_file.path().to_str().unwrap()])
            .output()
            .await?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to derive public key"));
        }
        
        Ok(String::from_utf8(output.stdout)?)
    }
    
    fn calculate_fingerprint(&self, public_key: &str) -> Result<String> {
        // Calculate SHA256 fingerprint
        let parts: Vec<&str> = public_key.split_whitespace().collect();
        if parts.len() < 2 {
            return Err(anyhow::anyhow!("Invalid public key format"));
        }
        
        let key_data = base64::decode(parts[1])?;
        let hash = digest::digest(&digest::SHA256, &key_data);
        let fingerprint = base64::encode(hash.as_ref());
        
        Ok(format!("SHA256:{}", fingerprint.trim_end_matches('=')))
    }
    
    fn is_key_encrypted(&self, private_key: &str) -> bool {
        private_key.contains("Proc-Type: 4,ENCRYPTED") ||
        private_key.contains("encrypted")
    }
    
    async fn load_existing_keys(&mut self) -> Result<()> {
        let mut entries = fs::read_dir(&self.config.keys_dir).await?;
        
        while let Some(entry) = entries.next_entry().await? {
            let path = entry.path();
            
            // Skip public keys and non-files
            if path.extension() == Some(std::ffi::OsStr::new("pub")) || !path.is_file() {
                continue;
            }
            
            // Try to load as SSH key
            if let Ok(_) = self.add_key(&path).await {
                tracing::debug!("Loaded SSH key: {}", path.display());
            }
        }
        
        Ok(())
    }
}

/// SSH Agent integration
struct SshAgent {
    socket_path: String,
}

impl SshAgent {
    async fn connect() -> Result<Self> {
        let socket_path = std::env::var("SSH_AUTH_SOCK")
            .map_err(|_| anyhow::anyhow!("SSH_AUTH_SOCK not set"))?;
        
        Ok(Self { socket_path })
    }
    
    async fn add_key(&self, path: &Path) -> Result<()> {
        Command::new("ssh-add")
            .arg(path)
            .output()
            .await?;
        
        Ok(())
    }
    
    async fn remove_key(&self, path: &Path) -> Result<()> {
        Command::new("ssh-add")
            .arg("-d")
            .arg(path)
            .output()
            .await?;
        
        Ok(())
    }
}

#[derive(Debug, Clone)]
struct SshKey {
    name: String,
    path: PathBuf,
    public_key: String,
    private_key: Option<String>,
    key_type: String,
    fingerprint: String,
    encrypted: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SshKeyInfo {
    pub name: String,
    pub key_type: String,
    pub fingerprint: Option<String>,
    pub path: PathBuf,
    pub public_key: String,
}