use anyhow::Result;
use std::sync::Arc;
use tokio::sync::RwLock;

pub mod zellij;
pub mod helix;
pub mod devcontainer;

#[cfg(not(target_family = "wasm"))]
pub mod redox;

pub mod remote;
pub mod session;
pub mod security;
pub mod performance;

#[cfg(target_family = "wasm")]
pub mod wasm_bridge;

#[cfg(target_family = "wasm")]
pub use wasm_bridge::*;

use zellij::ZellijServer;
use helix::HelixIntegration;
use devcontainer::DevContainerRuntime;
use remote::RemoteConnectionManager;
use session::SessionManager;
use security::SecurityManager;

/// Enterprise-ready terminal with Zellij + Helix + DevContainer
pub struct KatalystTerminalPro {
    zellij: Arc<ZellijServer>,
    helix: Arc<HelixIntegration>,
    devcontainer: Arc<RwLock<DevContainerRuntime>>,
    remote: Arc<RemoteConnectionManager>,
    sessions: Arc<RwLock<SessionManager>>,
    security: Arc<SecurityManager>,
    config: TerminalConfig,
}

impl KatalystTerminalPro {
    pub async fn new(config: TerminalConfig) -> Result<Self> {
        // Initialize Zellij multiplexer
        let zellij = Arc::new(ZellijServer::new(&config.zellij).await?);
        
        // Initialize Helix editor with LSP
        let helix = Arc::new(HelixIntegration::new(&config.helix).await?);
        
        // Initialize DevContainer runtime
        let devcontainer = Arc::new(RwLock::new(
            DevContainerRuntime::new(&config.devcontainer).await?
        ));
        
        // Initialize remote connection manager
        let remote = Arc::new(
            RemoteConnectionManager::new(&config.remote).await?
        );
        
        // Initialize session manager
        let sessions = Arc::new(RwLock::new(
            SessionManager::new(&config.session).await?
        ));
        
        // Initialize security manager
        let security = Arc::new(SecurityManager::new(&config.security)?);
        
        Ok(Self {
            zellij,
            helix,
            devcontainer,
            remote,
            sessions,
            security,
            config,
        })
    }
    
    /// Start the terminal system
    pub async fn start(&self) -> Result<()> {
        tracing::info!("Starting Katalyst Terminal Pro");
        
        // Start Zellij server
        self.zellij.start().await?;
        
        // Start remote connection manager
        if self.config.remote.enabled {
            self.remote.start().await?;
        }
        
        // Initialize default session
        self.create_default_session().await?;
        
        tracing::info!("Katalyst Terminal Pro started successfully");
        Ok(())
    }
    
    /// Create a new development session with DevContainer
    pub async fn create_dev_session(&self, repo_path: &str) -> Result<String> {
        tracing::info!("Creating development session for: {}", repo_path);
        
        // Check for .devcontainer configuration
        let devcontainer_config = self.devcontainer
            .read()
            .await
            .load_config(repo_path)
            .await?;
        
        // Create isolated container
        let container_id = self.devcontainer
            .write()
            .await
            .create_container(&devcontainer_config)
            .await?;
        
        // Create Zellij session in container
        let session_id = self.zellij
            .create_session(&format!("dev-{}", container_id))
            .await?;
        
        // Configure Helix in the session
        self.helix.configure_for_project(repo_path).await?;
        
        // Register session
        self.sessions.write().await.register_session(
            &session_id,
            SessionInfo {
                id: session_id.clone(),
                container_id: Some(container_id.clone()),
                repo_path: Some(repo_path.to_string()),
                created_at: chrono::Utc::now(),
                session_type: SessionType::Development,
            },
        ).await?;
        
        tracing::info!("Development session created: {}", session_id);
        Ok(session_id)
    }
    
    /// Connect to remote server
    pub async fn connect_remote(&self, url: &str) -> Result<()> {
        self.security.validate_remote_connection(url)?;
        self.remote.connect(url).await?;
        Ok(())
    }
    
    /// Get terminal statistics
    pub async fn get_stats(&self) -> TerminalStats {
        let sessions = self.sessions.read().await;
        let containers = self.devcontainer.read().await;
        
        TerminalStats {
            active_sessions: sessions.count_active(),
            running_containers: containers.count_running().await,
            memory_usage_mb: self.get_memory_usage(),
            cpu_usage_percent: self.get_cpu_usage(),
            network_connections: self.remote.connection_count().await,
        }
    }
    
    async fn create_default_session(&self) -> Result<()> {
        let session_id = self.zellij.create_session("default").await?;
        
        self.sessions.write().await.register_session(
            &session_id,
            SessionInfo {
                id: session_id,
                container_id: None,
                repo_path: None,
                created_at: chrono::Utc::now(),
                session_type: SessionType::Default,
            },
        ).await?;
        
        Ok(())
    }
    
    fn get_memory_usage(&self) -> usize {
        // Implementation would get actual memory usage
        0
    }
    
    fn get_cpu_usage(&self) -> f32 {
        // Implementation would get actual CPU usage
        0.0
    }
}

#[derive(Debug, Clone)]
pub struct TerminalConfig {
    pub zellij: zellij::ZellijConfig,
    pub helix: helix::HelixConfig,
    pub devcontainer: devcontainer::DevContainerConfig,
    pub remote: remote::RemoteConfig,
    pub session: session::SessionConfig,
    pub security: security::SecurityConfig,
}

#[derive(Debug, Clone)]
pub struct SessionInfo {
    pub id: String,
    pub container_id: Option<String>,
    pub repo_path: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub session_type: SessionType,
}

#[derive(Debug, Clone)]
pub enum SessionType {
    Default,
    Development,
    Remote,
    Isolated,
}

#[derive(Debug, Clone)]
pub struct TerminalStats {
    pub active_sessions: usize,
    pub running_containers: usize,
    pub memory_usage_mb: usize,
    pub cpu_usage_percent: f32,
    pub network_connections: usize,
}