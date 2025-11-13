use anyhow::Result;
use ring::{
    aead::{self, Aead, LessSafeKey, Nonce, UnboundKey},
    digest::{self, Digest},
    pbkdf2,
    rand::{SecureRandom, SystemRandom},
};
use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, HashSet},
    net::IpAddr,
    path::PathBuf,
    sync::Arc,
};
use tokio::{
    fs,
    sync::RwLock,
    time::{Duration, Instant},
};
use ed25519_dalek::{PublicKey, SecretKey, Signature, Signer, Verifier};

/// Security manager for enterprise-grade terminal security
pub struct SecurityManager {
    config: SecurityConfig,
    auth_store: Arc<RwLock<AuthStore>>,
    session_tokens: Arc<RwLock<HashMap<String, SessionToken>>>,
    rate_limiter: Arc<RwLock<RateLimiter>>,
    audit_log: Arc<RwLock<AuditLog>>,
    encryption_key: Option<LessSafeKey>,
    signing_key: Option<SecretKey>,
}

impl SecurityManager {
    pub fn new(config: &SecurityConfig) -> Result<Self> {
        let auth_store = Arc::new(RwLock::new(AuthStore::new()));
        let session_tokens = Arc::new(RwLock::new(HashMap::new()));
        let rate_limiter = Arc::new(RwLock::new(RateLimiter::new(
            config.rate_limit_requests,
            config.rate_limit_window_secs,
        )));
        let audit_log = Arc::new(RwLock::new(AuditLog::new(&config.audit_log_path)?));
        
        // Initialize encryption key if enabled
        let encryption_key = if config.encryption_enabled {
            Some(Self::derive_encryption_key(&config.master_key)?)
        } else {
            None
        };
        
        // Initialize signing key if enabled
        let signing_key = if config.signing_enabled {
            Some(Self::generate_signing_key())
        } else {
            None
        };
        
        Ok(Self {
            config: config.clone(),
            auth_store,
            session_tokens,
            rate_limiter,
            audit_log,
            encryption_key,
            signing_key,
        })
    }
    
    /// Authenticate a user
    pub async fn authenticate(&self, username: &str, password: &str) -> Result<AuthToken> {
        // Check rate limiting
        if !self.rate_limiter.write().await.check_and_update(username) {
            self.audit_log.write().await.log(AuditEvent::AuthenticationFailed {
                username: username.to_string(),
                reason: "Rate limited".to_string(),
            }).await?;
            
            return Err(anyhow::anyhow!("Too many authentication attempts"));
        }
        
        // Verify credentials
        let auth_store = self.auth_store.read().await;
        let user = auth_store.get_user(username)
            .ok_or_else(|| anyhow::anyhow!("Invalid credentials"))?;
        
        if !Self::verify_password(password, &user.password_hash)? {
            self.audit_log.write().await.log(AuditEvent::AuthenticationFailed {
                username: username.to_string(),
                reason: "Invalid password".to_string(),
            }).await?;
            
            return Err(anyhow::anyhow!("Invalid credentials"));
        }
        
        // Check if user requires MFA
        if user.mfa_enabled {
            // Would implement MFA verification here
            tracing::info!("MFA required for user: {}", username);
        }
        
        // Generate session token
        let token = self.generate_session_token(username).await?;
        
        // Log successful authentication
        self.audit_log.write().await.log(AuditEvent::AuthenticationSuccess {
            username: username.to_string(),
            token_id: token.id.clone(),
        }).await?;
        
        Ok(token)
    }
    
    /// Validate a session token
    pub async fn validate_token(&self, token: &str) -> Result<bool> {
        let tokens = self.session_tokens.read().await;
        
        if let Some(session) = tokens.get(token) {
            // Check expiration
            if session.expires_at > Instant::now() {
                // Update last used
                drop(tokens);
                if let Some(session) = self.session_tokens.write().await.get_mut(token) {
                    session.last_used = Instant::now();
                }
                
                return Ok(true);
            }
        }
        
        Ok(false)
    }
    
    /// Revoke a session token
    pub async fn revoke_token(&self, token: &str) -> Result<()> {
        self.session_tokens.write().await.remove(token);
        
        self.audit_log.write().await.log(AuditEvent::TokenRevoked {
            token_id: token.to_string(),
        }).await?;
        
        Ok(())
    }
    
    /// Validate remote connection
    pub fn validate_remote_connection(&self, url: &str) -> Result<()> {
        // Parse URL
        let parsed = url::Url::parse(url)
            .map_err(|e| anyhow::anyhow!("Invalid URL: {}", e))?;
        
        // Check protocol
        if !self.config.allowed_protocols.contains(&parsed.scheme().to_string()) {
            return Err(anyhow::anyhow!("Protocol not allowed: {}", parsed.scheme()));
        }
        
        // Check host allowlist/blocklist
        if let Some(host) = parsed.host_str() {
            if !self.is_host_allowed(host) {
                return Err(anyhow::anyhow!("Host not allowed: {}", host));
            }
        }
        
        // Check port
        let port = parsed.port().unwrap_or(match parsed.scheme() {
            "https" | "wss" => 443,
            "http" | "ws" => 80,
            "ssh" => 22,
            _ => 0,
        });
        
        if !self.config.allowed_ports.contains(&port) {
            return Err(anyhow::anyhow!("Port not allowed: {}", port));
        }
        
        Ok(())
    }
    
    /// Encrypt data
    pub fn encrypt(&self, data: &[u8]) -> Result<Vec<u8>> {
        if let Some(ref key) = self.encryption_key {
            let rng = SystemRandom::new();
            
            // Generate nonce
            let mut nonce_bytes = [0u8; 12];
            rng.fill(&mut nonce_bytes)?;
            let nonce = Nonce::assume_unique_for_key(nonce_bytes);
            
            // Encrypt
            let mut encrypted = data.to_vec();
            key.seal_in_place_append_tag(nonce, aead::Aad::empty(), &mut encrypted)?;
            
            // Prepend nonce
            let mut result = nonce_bytes.to_vec();
            result.extend(encrypted);
            
            Ok(result)
        } else {
            Err(anyhow::anyhow!("Encryption not enabled"))
        }
    }
    
    /// Decrypt data
    pub fn decrypt(&self, data: &[u8]) -> Result<Vec<u8>> {
        if let Some(ref key) = self.encryption_key {
            if data.len() < 12 {
                return Err(anyhow::anyhow!("Invalid encrypted data"));
            }
            
            // Extract nonce
            let nonce = Nonce::assume_unique_for_key(data[..12].try_into()?);
            
            // Decrypt
            let mut decrypted = data[12..].to_vec();
            key.open_in_place(nonce, aead::Aad::empty(), &mut decrypted)?;
            
            // Remove tag
            decrypted.truncate(decrypted.len() - 16);
            
            Ok(decrypted)
        } else {
            Err(anyhow::anyhow!("Encryption not enabled"))
        }
    }
    
    /// Sign data
    pub fn sign(&self, data: &[u8]) -> Result<Vec<u8>> {
        if let Some(ref key) = self.signing_key {
            let keypair = ed25519_dalek::Keypair {
                secret: key.clone(),
                public: PublicKey::from(key),
            };
            
            let signature = keypair.sign(data);
            Ok(signature.to_bytes().to_vec())
        } else {
            Err(anyhow::anyhow!("Signing not enabled"))
        }
    }
    
    /// Verify signature
    pub fn verify(&self, data: &[u8], signature: &[u8]) -> Result<bool> {
        if let Some(ref key) = self.signing_key {
            let public_key = PublicKey::from(key);
            let signature = Signature::from_bytes(signature)?;
            
            Ok(public_key.verify(data, &signature).is_ok())
        } else {
            Err(anyhow::anyhow!("Signing not enabled"))
        }
    }
    
    /// Add user
    pub async fn add_user(&self, username: &str, password: &str, role: UserRole) -> Result<()> {
        let password_hash = Self::hash_password(password)?;
        
        let user = User {
            username: username.to_string(),
            password_hash,
            role,
            mfa_enabled: false,
            created_at: chrono::Utc::now(),
            last_login: None,
        };
        
        self.auth_store.write().await.add_user(user)?;
        
        self.audit_log.write().await.log(AuditEvent::UserCreated {
            username: username.to_string(),
            role,
        }).await?;
        
        Ok(())
    }
    
    /// Remove user
    pub async fn remove_user(&self, username: &str) -> Result<()> {
        self.auth_store.write().await.remove_user(username)?;
        
        self.audit_log.write().await.log(AuditEvent::UserRemoved {
            username: username.to_string(),
        }).await?;
        
        Ok(())
    }
    
    /// Get audit logs
    pub async fn get_audit_logs(&self, limit: usize) -> Result<Vec<AuditEntry>> {
        self.audit_log.read().await.get_recent(limit).await
    }
    
    // Private helper methods
    
    fn derive_encryption_key(master_key: &str) -> Result<LessSafeKey> {
        let rng = SystemRandom::new();
        
        // Generate salt
        let mut salt = [0u8; 16];
        rng.fill(&mut salt)?;
        
        // Derive key using PBKDF2
        let mut key_bytes = [0u8; 32];
        pbkdf2::derive(
            pbkdf2::PBKDF2_HMAC_SHA256,
            std::num::NonZeroU32::new(100_000).unwrap(),
            &salt,
            master_key.as_bytes(),
            &mut key_bytes,
        );
        
        let unbound_key = UnboundKey::new(&aead::AES_256_GCM, &key_bytes)?;
        Ok(LessSafeKey::new(unbound_key))
    }
    
    fn generate_signing_key() -> SecretKey {
        let mut rng = rand::thread_rng();
        SecretKey::generate(&mut rng)
    }
    
    fn hash_password(password: &str) -> Result<String> {
        let rng = SystemRandom::new();
        
        // Generate salt
        let mut salt = [0u8; 16];
        rng.fill(&mut salt)?;
        
        // Hash with PBKDF2
        let mut hash = [0u8; 32];
        pbkdf2::derive(
            pbkdf2::PBKDF2_HMAC_SHA256,
            std::num::NonZeroU32::new(100_000).unwrap(),
            &salt,
            password.as_bytes(),
            &mut hash,
        );
        
        // Encode as base64
        Ok(format!("{}:{}", 
            base64::encode(&salt),
            base64::encode(&hash)
        ))
    }
    
    fn verify_password(password: &str, hash: &str) -> Result<bool> {
        let parts: Vec<&str> = hash.split(':').collect();
        if parts.len() != 2 {
            return Ok(false);
        }
        
        let salt = base64::decode(parts[0])?;
        let stored_hash = base64::decode(parts[1])?;
        
        // Verify with PBKDF2
        pbkdf2::verify(
            pbkdf2::PBKDF2_HMAC_SHA256,
            std::num::NonZeroU32::new(100_000).unwrap(),
            &salt,
            password.as_bytes(),
            &stored_hash,
        ).is_ok()
    }
    
    async fn generate_session_token(&self, username: &str) -> Result<AuthToken> {
        let rng = SystemRandom::new();
        
        // Generate random token
        let mut token_bytes = [0u8; 32];
        rng.fill(&mut token_bytes)?;
        let token_str = base64::encode(&token_bytes);
        
        let token = AuthToken {
            id: token_str.clone(),
            username: username.to_string(),
            created_at: chrono::Utc::now(),
            expires_at: chrono::Utc::now() + chrono::Duration::hours(24),
        };
        
        let session = SessionToken {
            token: token_str.clone(),
            username: username.to_string(),
            created_at: Instant::now(),
            expires_at: Instant::now() + Duration::from_secs(86400),
            last_used: Instant::now(),
        };
        
        self.session_tokens.write().await.insert(token_str, session);
        
        Ok(token)
    }
    
    fn is_host_allowed(&self, host: &str) -> bool {
        // Check blocklist first
        if self.config.host_blocklist.contains(&host.to_string()) {
            return false;
        }
        
        // Check allowlist if configured
        if !self.config.host_allowlist.is_empty() {
            return self.config.host_allowlist.contains(&host.to_string());
        }
        
        true
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityConfig {
    pub encryption_enabled: bool,
    pub signing_enabled: bool,
    pub master_key: String,
    pub allowed_protocols: HashSet<String>,
    pub allowed_ports: HashSet<u16>,
    pub host_allowlist: HashSet<String>,
    pub host_blocklist: HashSet<String>,
    pub rate_limit_requests: u32,
    pub rate_limit_window_secs: u64,
    pub audit_log_path: PathBuf,
}

impl Default for SecurityConfig {
    fn default() -> Self {
        let mut allowed_protocols = HashSet::new();
        allowed_protocols.insert("https".to_string());
        allowed_protocols.insert("wss".to_string());
        allowed_protocols.insert("ssh".to_string());
        
        let mut allowed_ports = HashSet::new();
        allowed_ports.insert(22);    // SSH
        allowed_ports.insert(443);   // HTTPS/WSS
        allowed_ports.insert(8080);  // Development
        
        let mut host_blocklist = HashSet::new();
        host_blocklist.insert("0.0.0.0".to_string());
        
        Self {
            encryption_enabled: true,
            signing_enabled: true,
            master_key: "change-this-master-key".to_string(),
            allowed_protocols,
            allowed_ports,
            host_allowlist: HashSet::new(),
            host_blocklist,
            rate_limit_requests: 10,
            rate_limit_window_secs: 60,
            audit_log_path: PathBuf::from("/var/log/katalyst-terminal/audit.log"),
        }
    }
}

#[derive(Debug, Clone)]
struct AuthStore {
    users: HashMap<String, User>,
}

impl AuthStore {
    fn new() -> Self {
        Self {
            users: HashMap::new(),
        }
    }
    
    fn add_user(&mut self, user: User) -> Result<()> {
        if self.users.contains_key(&user.username) {
            return Err(anyhow::anyhow!("User already exists"));
        }
        
        self.users.insert(user.username.clone(), user);
        Ok(())
    }
    
    fn remove_user(&mut self, username: &str) -> Result<()> {
        self.users.remove(username)
            .ok_or_else(|| anyhow::anyhow!("User not found"))?;
        Ok(())
    }
    
    fn get_user(&self, username: &str) -> Option<&User> {
        self.users.get(username)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct User {
    username: String,
    password_hash: String,
    role: UserRole,
    mfa_enabled: bool,
    created_at: chrono::DateTime<chrono::Utc>,
    last_login: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum UserRole {
    Admin,
    Developer,
    Viewer,
}

#[derive(Debug, Clone)]
pub struct AuthToken {
    pub id: String,
    pub username: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub expires_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone)]
struct SessionToken {
    token: String,
    username: String,
    created_at: Instant,
    expires_at: Instant,
    last_used: Instant,
}

struct RateLimiter {
    max_requests: u32,
    window_secs: u64,
    requests: HashMap<String, Vec<Instant>>,
}

impl RateLimiter {
    fn new(max_requests: u32, window_secs: u64) -> Self {
        Self {
            max_requests,
            window_secs,
            requests: HashMap::new(),
        }
    }
    
    fn check_and_update(&mut self, key: &str) -> bool {
        let now = Instant::now();
        let window = Duration::from_secs(self.window_secs);
        
        // Clean old requests
        if let Some(requests) = self.requests.get_mut(key) {
            requests.retain(|&t| now.duration_since(t) < window);
            
            if requests.len() >= self.max_requests as usize {
                return false;
            }
            
            requests.push(now);
        } else {
            self.requests.insert(key.to_string(), vec![now]);
        }
        
        true
    }
}

struct AuditLog {
    path: PathBuf,
    entries: Vec<AuditEntry>,
}

impl AuditLog {
    fn new(path: &PathBuf) -> Result<Self> {
        // Create directory if it doesn't exist
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        
        Ok(Self {
            path: path.clone(),
            entries: Vec::new(),
        })
    }
    
    async fn log(&mut self, event: AuditEvent) -> Result<()> {
        let entry = AuditEntry {
            timestamp: chrono::Utc::now(),
            event,
        };
        
        self.entries.push(entry.clone());
        
        // Write to file
        let json = serde_json::to_string(&entry)?;
        let mut file = fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&self.path)
            .await?;
        
        use tokio::io::AsyncWriteExt;
        file.write_all(format!("{}\n", json).as_bytes()).await?;
        
        Ok(())
    }
    
    async fn get_recent(&self, limit: usize) -> Result<Vec<AuditEntry>> {
        let start = self.entries.len().saturating_sub(limit);
        Ok(self.entries[start..].to_vec())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AuditEntry {
    timestamp: chrono::DateTime<chrono::Utc>,
    event: AuditEvent,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
enum AuditEvent {
    AuthenticationSuccess { username: String, token_id: String },
    AuthenticationFailed { username: String, reason: String },
    TokenRevoked { token_id: String },
    UserCreated { username: String, role: UserRole },
    UserRemoved { username: String },
    ConnectionEstablished { remote_addr: String },
    ConnectionClosed { remote_addr: String },
}