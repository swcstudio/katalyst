use anyhow::Result;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    path::PathBuf,
    sync::Arc,
    time::{Duration, Instant},
};
use tokio::{
    fs,
    net::TcpStream,
    sync::RwLock,
    time::timeout,
};

/// Server configuration storage and management
pub struct ServerStore {
    config: super::ServerConfig,
    servers: Arc<RwLock<HashMap<String, ServerInfo>>>,
    connections: Arc<RwLock<HashMap<String, ServerConnection>>>,
}

impl ServerStore {
    pub async fn new(config: &super::ServerConfig) -> Result<Self> {
        let mut store = Self {
            config: config.clone(),
            servers: Arc::new(RwLock::new(HashMap::new())),
            connections: Arc::new(RwLock::new(HashMap::new())),
        };
        
        // Load saved servers
        store.load_servers().await?;
        
        Ok(store)
    }
    
    /// Add a new server configuration
    pub async fn add_server(&self, name: &str, url: &str, default_key: Option<&str>) -> Result<()> {
        let server = ServerInfo {
            name: name.to_string(),
            url: url.to_string(),
            default_key: default_key.map(String::from),
            tags: Vec::new(),
            environment: HashMap::new(),
            last_connected: None,
            connection_count: 0,
            notes: String::new(),
            auto_connect: false,
            health_check_enabled: false,
        };
        
        self.servers.write().await.insert(name.to_string(), server);
        
        // Save to disk
        self.save_servers().await?;
        
        Ok(())
    }
    
    /// Get server configuration
    pub async fn get_server(&self, name: &str) -> Result<ServerInfo> {
        self.servers
            .read()
            .await
            .get(name)
            .cloned()
            .ok_or_else(|| anyhow::anyhow!("Server not found: {}", name))
    }
    
    /// List all servers
    pub async fn list_servers(&self) -> Result<Vec<ServerInfo>> {
        Ok(self.servers.read().await.values().cloned().collect())
    }
    
    /// Remove a server
    pub async fn remove_server(&self, name: &str) -> Result<()> {
        let removed = self.servers.write().await.remove(name).is_some();
        
        if removed {
            self.save_servers().await?;
            Ok(())
        } else {
            Err(anyhow::anyhow!("Server not found: {}", name))
        }
    }
    
    /// Update server configuration
    pub async fn update_server(&self, name: &str, updates: ServerUpdate) -> Result<()> {
        let mut servers = self.servers.write().await;
        
        if let Some(server) = servers.get_mut(name) {
            if let Some(url) = updates.url {
                server.url = url;
            }
            if let Some(key) = updates.default_key {
                server.default_key = Some(key);
            }
            if let Some(tags) = updates.tags {
                server.tags = tags;
            }
            if let Some(env) = updates.environment {
                server.environment = env;
            }
            if let Some(notes) = updates.notes {
                server.notes = notes;
            }
            if let Some(auto) = updates.auto_connect {
                server.auto_connect = auto;
            }
            
            drop(servers);
            self.save_servers().await?;
            Ok(())
        } else {
            Err(anyhow::anyhow!("Server not found: {}", name))
        }
    }
    
    /// Test connection to a server
    pub async fn test_connection(&self, name: &str) -> Result<f64> {
        let server = self.get_server(name).await?;
        
        // Parse connection URL
        let (protocol, host, port) = self.parse_connection_url(&server.url)?;
        
        let start = Instant::now();
        
        match protocol.as_str() {
            "ssh" => {
                // Test SSH connection
                self.test_ssh_connection(&host, port).await?;
            }
            "https" | "wss" => {
                // Test HTTPS/WSS connection
                self.test_tcp_connection(&host, port).await?;
            }
            _ => {
                return Err(anyhow::anyhow!("Unsupported protocol: {}", protocol));
            }
        }
        
        let latency = start.elapsed().as_millis() as f64;
        Ok(latency)
    }
    
    /// Update last connected time
    pub async fn update_last_connected(&self, name: &str) -> Result<()> {
        let mut servers = self.servers.write().await;
        
        if let Some(server) = servers.get_mut(name) {
            server.last_connected = Some(Utc::now());
            server.connection_count += 1;
            
            drop(servers);
            self.save_servers().await?;
            Ok(())
        } else {
            Err(anyhow::anyhow!("Server not found: {}", name))
        }
    }
    
    /// Get servers with auto-connect enabled
    pub async fn get_auto_connect_servers(&self) -> Vec<ServerInfo> {
        self.servers
            .read()
            .await
            .values()
            .filter(|s| s.auto_connect)
            .cloned()
            .collect()
    }
    
    /// Search servers by tags
    pub async fn search_by_tags(&self, tags: &[String]) -> Vec<ServerInfo> {
        self.servers
            .read()
            .await
            .values()
            .filter(|s| tags.iter().any(|tag| s.tags.contains(tag)))
            .cloned()
            .collect()
    }
    
    /// Import servers from JSON
    pub async fn import_servers(&self, json: &str) -> Result<usize> {
        let imported: Vec<ServerInfo> = serde_json::from_str(json)?;
        let count = imported.len();
        
        let mut servers = self.servers.write().await;
        for server in imported {
            servers.insert(server.name.clone(), server);
        }
        
        drop(servers);
        self.save_servers().await?;
        
        Ok(count)
    }
    
    /// Export servers to JSON
    pub async fn export_servers(&self) -> Result<String> {
        let servers: Vec<ServerInfo> = self.servers.read().await.values().cloned().collect();
        Ok(serde_json::to_string_pretty(&servers)?)
    }
    
    /// Get server statistics
    pub async fn get_statistics(&self) -> ServerStatistics {
        let servers = self.servers.read().await;
        
        let total = servers.len();
        let auto_connect = servers.values().filter(|s| s.auto_connect).count();
        let recently_connected = servers
            .values()
            .filter(|s| {
                s.last_connected
                    .map(|t| (Utc::now() - t).num_days() < 7)
                    .unwrap_or(false)
            })
            .count();
        
        let total_connections: u32 = servers.values().map(|s| s.connection_count).sum();
        
        ServerStatistics {
            total_servers: total,
            auto_connect_servers: auto_connect,
            recently_connected,
            total_connections,
        }
    }
    
    // Private helper methods
    
    async fn load_servers(&mut self) -> Result<()> {
        if !self.config.servers_file.exists() {
            return Ok(());
        }
        
        let content = fs::read_to_string(&self.config.servers_file).await?;
        let servers: Vec<ServerInfo> = serde_json::from_str(&content)?;
        
        let mut server_map = HashMap::new();
        for server in servers {
            server_map.insert(server.name.clone(), server);
        }
        
        *self.servers.write().await = server_map;
        
        Ok(())
    }
    
    async fn save_servers(&self) -> Result<()> {
        // Ensure directory exists
        if let Some(parent) = self.config.servers_file.parent() {
            fs::create_dir_all(parent).await?;
        }
        
        let servers: Vec<ServerInfo> = self.servers.read().await.values().cloned().collect();
        let json = serde_json::to_string_pretty(&servers)?;
        
        fs::write(&self.config.servers_file, json).await?;
        
        Ok(())
    }
    
    fn parse_connection_url(&self, url: &str) -> Result<(String, String, u16)> {
        if url.starts_with("ssh://") {
            // SSH URL format: ssh://user@host:port
            let url = url.trim_start_matches("ssh://");
            let parts: Vec<&str> = url.split('@').collect();
            let host_port = if parts.len() > 1 { parts[1] } else { parts[0] };
            
            let (host, port) = if host_port.contains(':') {
                let parts: Vec<&str> = host_port.split(':').collect();
                (parts[0].to_string(), parts[1].parse().unwrap_or(22))
            } else {
                (host_port.to_string(), 22)
            };
            
            Ok(("ssh".to_string(), host, port))
        } else if url.starts_with("https://") {
            let parsed = url::Url::parse(url)?;
            Ok((
                "https".to_string(),
                parsed.host_str().unwrap_or("localhost").to_string(),
                parsed.port().unwrap_or(443),
            ))
        } else if url.starts_with("wss://") {
            let parsed = url::Url::parse(url)?;
            Ok((
                "wss".to_string(),
                parsed.host_str().unwrap_or("localhost").to_string(),
                parsed.port().unwrap_or(443),
            ))
        } else {
            // Assume SSH format: user@host or host
            let parts: Vec<&str> = url.split('@').collect();
            let host = if parts.len() > 1 { parts[1] } else { parts[0] };
            Ok(("ssh".to_string(), host.to_string(), 22))
        }
    }
    
    async fn test_tcp_connection(&self, host: &str, port: u16) -> Result<()> {
        let addr = format!("{}:{}", host, port);
        let duration = Duration::from_secs(self.config.connection_timeout_secs);
        
        timeout(duration, TcpStream::connect(&addr)).await??;
        
        Ok(())
    }
    
    async fn test_ssh_connection(&self, host: &str, port: u16) -> Result<()> {
        // For now, just test TCP connection
        // Full SSH handshake would require SSH client library
        self.test_tcp_connection(host, port).await
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerInfo {
    pub name: String,
    pub url: String,
    pub default_key: Option<String>,
    pub tags: Vec<String>,
    pub environment: HashMap<String, String>,
    pub last_connected: Option<DateTime<Utc>>,
    pub connection_count: u32,
    pub notes: String,
    pub auto_connect: bool,
    pub health_check_enabled: bool,
}

#[derive(Debug, Clone)]
pub struct ServerUpdate {
    pub url: Option<String>,
    pub default_key: Option<String>,
    pub tags: Option<Vec<String>>,
    pub environment: Option<HashMap<String, String>>,
    pub notes: Option<String>,
    pub auto_connect: Option<bool>,
}

#[derive(Debug, Clone)]
struct ServerConnection {
    server_name: String,
    connected_at: Instant,
    last_activity: Instant,
    bytes_sent: u64,
    bytes_received: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerStatistics {
    pub total_servers: usize,
    pub auto_connect_servers: usize,
    pub recently_connected: usize,
    pub total_connections: u32,
}