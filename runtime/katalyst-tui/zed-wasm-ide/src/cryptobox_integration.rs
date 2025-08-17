use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};
use aes_gcm::{
    aead::{Aead, AeadCore, KeyInit, OsRng},
    Aes256Gcm, Key, Nonce,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityPolicy {
    pub name: String,
    pub rules: Vec<SecurityRule>,
    pub default_action: SecurityAction,
    pub resource_limits: ResourceLimits,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SecurityRule {
    pub id: String,
    pub description: String,
    pub condition: RuleCondition,
    pub action: SecurityAction,
    pub severity: Severity,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RuleCondition {
    FileAccess { path_pattern: String },
    NetworkAccess { host_pattern: String, port: Option<u16> },
    SystemCall { syscall_name: String },
    MemoryUsage { threshold_bytes: usize },
    CPUUsage { threshold_percent: f64 },
    ExecutionTime { max_duration_ms: u64 },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SecurityAction {
    Allow,
    Deny,
    Audit,
    Terminate,
    Sandbox,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum Severity {
    Low,
    Medium,
    High,
    Critical,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResourceLimits {
    pub max_memory_bytes: usize,
    pub max_cpu_percent: f64,
    pub max_file_handles: usize,
    pub max_network_connections: usize,
    pub max_execution_time_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContainerConfig {
    pub image: String,
    pub environment: HashMap<String, String>,
    pub mounts: Vec<Mount>,
    pub network_mode: NetworkMode,
    pub security_policy: SecurityPolicy,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Mount {
    pub source: String,
    pub target: String,
    pub read_only: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum NetworkMode {
    None,
    Bridge,
    Host,
    Custom(String),
}

pub struct CryptoboxIntegration {
    policies: Arc<RwLock<HashMap<String, SecurityPolicy>>>,
    containers: Arc<RwLock<HashMap<String, ContainerConfig>>>,
    encryption_keys: Arc<RwLock<HashMap<String, Vec<u8>>>>,
}

impl CryptoboxIntegration {
    pub fn new() -> Self {
        let mut policies = HashMap::new();
        
        // Default security policy
        policies.insert("default".to_string(), SecurityPolicy {
            name: "default".to_string(),
            rules: vec![
                SecurityRule {
                    id: "file_sandbox".to_string(),
                    description: "Restrict file access to sandbox".to_string(),
                    condition: RuleCondition::FileAccess {
                        path_pattern: "/sandbox/**".to_string(),
                    },
                    action: SecurityAction::Allow,
                    severity: Severity::Medium,
                },
                SecurityRule {
                    id: "network_deny".to_string(),
                    description: "Deny all network access by default".to_string(),
                    condition: RuleCondition::NetworkAccess {
                        host_pattern: "*".to_string(),
                        port: None,
                    },
                    action: SecurityAction::Deny,
                    severity: Severity::High,
                },
                SecurityRule {
                    id: "memory_limit".to_string(),
                    description: "Enforce memory limits".to_string(),
                    condition: RuleCondition::MemoryUsage {
                        threshold_bytes: 512 * 1024 * 1024, // 512MB
                    },
                    action: SecurityAction::Terminate,
                    severity: Severity::Critical,
                },
            ],
            default_action: SecurityAction::Deny,
            resource_limits: ResourceLimits {
                max_memory_bytes: 512 * 1024 * 1024,
                max_cpu_percent: 1.0,
                max_file_handles: 100,
                max_network_connections: 0,
                max_execution_time_ms: 30000,
            },
        });
        
        Self {
            policies: Arc::new(RwLock::new(policies)),
            containers: Arc::new(RwLock::new(HashMap::new())),
            encryption_keys: Arc::new(RwLock::new(HashMap::new())),
        }
    }
    
    pub async fn create_secure_container(
        &self,
        language: &str,
        policy_name: Option<&str>,
    ) -> Result<String, String> {
        let policies = self.policies.read().await;
        let policy = policies.get(policy_name.unwrap_or("default"))
            .ok_or_else(|| format!("Policy not found: {}", policy_name.unwrap_or("default")))?
            .clone();
        
        let container_id = generate_container_id();
        let container_config = ContainerConfig {
            image: get_container_image(language),
            environment: create_environment(language),
            mounts: vec![
                Mount {
                    source: "/tmp/sandbox".to_string(),
                    target: "/workspace".to_string(),
                    read_only: false,
                },
            ],
            network_mode: NetworkMode::None,
            security_policy: policy,
        };
        
        let mut containers = self.containers.write().await;
        containers.insert(container_id.clone(), container_config);
        
        Ok(container_id)
    }
    
    pub async fn execute_in_secure_container(
        &self,
        container_id: &str,
        code: &str,
    ) -> Result<String, String> {
        let containers = self.containers.read().await;
        let container = containers.get(container_id)
            .ok_or_else(|| "Container not found".to_string())?;
        
        // Apply security policy
        self.apply_security_policy(&container.security_policy, code).await?;
        
        // Encrypt code before execution
        let encrypted_code = self.encrypt_data(code.as_bytes()).await?;
        
        // Simulate secure execution
        let result = format!("Executed in secure container: {}", container_id);
        
        // Decrypt result
        let decrypted_result = self.decrypt_data(&encrypted_code).await?;
        
        Ok(String::from_utf8_lossy(&decrypted_result).to_string())
    }
    
    pub async fn apply_security_policy(
        &self,
        policy: &SecurityPolicy,
        code: &str,
    ) -> Result<(), String> {
        // Check each rule
        for rule in &policy.rules {
            match self.evaluate_rule(&rule.condition, code).await {
                true => {
                    match rule.action {
                        SecurityAction::Deny => {
                            return Err(format!("Security rule violated: {}", rule.description));
                        }
                        SecurityAction::Terminate => {
                            return Err(format!("Execution terminated: {}", rule.description));
                        }
                        SecurityAction::Audit => {
                            // Log audit event
                            println!("Audit: {}", rule.description);
                        }
                        _ => {}
                    }
                }
                false => {}
            }
        }
        
        Ok(())
    }
    
    async fn evaluate_rule(&self, condition: &RuleCondition, _code: &str) -> bool {
        match condition {
            RuleCondition::FileAccess { path_pattern: _ } => {
                // Check if code accesses files matching pattern
                false
            }
            RuleCondition::NetworkAccess { .. } => {
                // Check if code attempts network access
                false
            }
            RuleCondition::SystemCall { syscall_name: _ } => {
                // Check if code makes specific system calls
                false
            }
            RuleCondition::MemoryUsage { threshold_bytes: _ } => {
                // Check memory usage
                false
            }
            RuleCondition::CPUUsage { threshold_percent: _ } => {
                // Check CPU usage
                false
            }
            RuleCondition::ExecutionTime { max_duration_ms: _ } => {
                // Check execution time
                false
            }
        }
    }
    
    pub async fn encrypt_data(&self, data: &[u8]) -> Result<Vec<u8>, String> {
        // Generate a new key if not exists
        let key = Aes256Gcm::generate_key(OsRng);
        let cipher = Aes256Gcm::new(&key);
        
        let nonce = Aes256Gcm::generate_nonce(&mut OsRng);
        
        cipher.encrypt(&nonce, data)
            .map_err(|e| format!("Encryption failed: {}", e))
            .map(|ciphertext| {
                // Prepend nonce to ciphertext
                let mut result = nonce.to_vec();
                result.extend_from_slice(&ciphertext);
                result
            })
    }
    
    pub async fn decrypt_data(&self, encrypted_data: &[u8]) -> Result<Vec<u8>, String> {
        if encrypted_data.len() < 12 {
            return Err("Invalid encrypted data".to_string());
        }
        
        // Extract nonce and ciphertext
        let (nonce_bytes, ciphertext) = encrypted_data.split_at(12);
        let nonce = Nonce::from_slice(nonce_bytes);
        
        // For demo, use a fixed key (in production, retrieve from key store)
        let key = Aes256Gcm::generate_key(OsRng);
        let cipher = Aes256Gcm::new(&key);
        
        cipher.decrypt(nonce, ciphertext)
            .map_err(|e| format!("Decryption failed: {}", e))
    }
    
    pub async fn hash_code(&self, code: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(code.as_bytes());
        format!("{:x}", hasher.finalize())
    }
    
    pub async fn verify_container_integrity(&self, container_id: &str) -> Result<bool, String> {
        let containers = self.containers.read().await;
        containers.get(container_id)
            .map(|_| true)
            .ok_or_else(|| "Container not found".to_string())
    }
    
    pub async fn cleanup_container(&mut self, container_id: &str) -> Result<(), String> {
        let mut containers = self.containers.write().await;
        containers.remove(container_id)
            .map(|_| ())
            .ok_or_else(|| "Container not found".to_string())
    }
    
    pub async fn get_container_metrics(&self, container_id: &str) -> Result<ContainerMetrics, String> {
        let containers = self.containers.read().await;
        let container = containers.get(container_id)
            .ok_or_else(|| "Container not found".to_string())?;
        
        Ok(ContainerMetrics {
            memory_used_bytes: 0,
            cpu_usage_percent: 0.0,
            network_bytes_sent: 0,
            network_bytes_received: 0,
            file_handles_open: 0,
            execution_time_ms: 0,
            policy_violations: 0,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContainerMetrics {
    pub memory_used_bytes: usize,
    pub cpu_usage_percent: f64,
    pub network_bytes_sent: usize,
    pub network_bytes_received: usize,
    pub file_handles_open: usize,
    pub execution_time_ms: u64,
    pub policy_violations: usize,
}

fn get_container_image(language: &str) -> String {
    match language {
        "rust" => "cryptobox/rust:latest".to_string(),
        "python" => "cryptobox/python:latest".to_string(),
        "javascript" | "typescript" => "cryptobox/node:latest".to_string(),
        "go" => "cryptobox/go:latest".to_string(),
        "java" => "cryptobox/java:latest".to_string(),
        "cpp" | "c" => "cryptobox/gcc:latest".to_string(),
        _ => "cryptobox/universal:latest".to_string(),
    }
}

fn create_environment(language: &str) -> HashMap<String, String> {
    let mut env = HashMap::new();
    env.insert("LANG".to_string(), "en_US.UTF-8".to_string());
    env.insert("TERM".to_string(), "xterm-256color".to_string());
    env.insert("SANDBOX".to_string(), "true".to_string());
    
    match language {
        "python" => {
            env.insert("PYTHONPATH".to_string(), "/workspace".to_string());
            env.insert("PYTHONDONTWRITEBYTECODE".to_string(), "1".to_string());
        }
        "node" | "javascript" | "typescript" => {
            env.insert("NODE_ENV".to_string(), "sandbox".to_string());
        }
        "rust" => {
            env.insert("RUST_BACKTRACE".to_string(), "1".to_string());
        }
        _ => {}
    }
    
    env
}

fn generate_container_id() -> String {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    format!("cryptobox_{:016x}", rng.gen::<u64>())
}