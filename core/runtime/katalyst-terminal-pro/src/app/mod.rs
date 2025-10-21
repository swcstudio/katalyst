use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::{
    path::PathBuf,
    sync::Arc,
    time::Duration,
};
use tokio::sync::RwLock;

pub mod ssh_manager;
pub mod server_store;
pub mod ui;
pub mod renderer;
pub mod input;
pub mod theme;

use ssh_manager::SshManager;
use server_store::ServerStore;
use ui::TerminalUI;
use renderer::TerminalRenderer;
use input::InputHandler;
use theme::ThemeManager;

use crate::{
    KatalystTerminalPro, TerminalConfig,
    devcontainer::DevContainerRuntime,
    session::SessionManager,
};

/// Main application struct that ties everything together
pub struct KatalystApp {
    pub config: AppConfig,
    pub terminal: Arc<KatalystTerminalPro>,
    pub ssh_manager: Arc<SshManager>,
    pub server_store: Arc<ServerStore>,
    pub ui: Arc<RwLock<TerminalUI>>,
    pub renderer: Arc<TerminalRenderer>,
    pub input_handler: Arc<InputHandler>,
    pub theme_manager: Arc<ThemeManager>,
    pub devcontainer_runtime: Arc<RwLock<DevContainerRuntime>>,
    pub session_manager: Arc<RwLock<SessionManager>>,
    running: Arc<RwLock<bool>>,
}

impl KatalystApp {
    pub async fn new(config: AppConfig) -> Result<Self> {
        // Initialize core terminal
        let terminal = Arc::new(
            KatalystTerminalPro::new(config.terminal_config.clone()).await?
        );
        
        // Initialize SSH manager
        let ssh_manager = Arc::new(
            SshManager::new(&config.ssh_config).await?
        );
        
        // Initialize server store
        let server_store = Arc::new(
            ServerStore::new(&config.server_config).await?
        );
        
        // Initialize theme manager
        let theme_manager = Arc::new(
            ThemeManager::new(&config.theme_config)?
        );
        
        // Initialize renderer
        let renderer = Arc::new(
            TerminalRenderer::new(&config.render_config, theme_manager.clone()).await?
        );
        
        // Initialize UI
        let ui = Arc::new(RwLock::new(
            TerminalUI::new(&config.ui_config, theme_manager.clone()).await?
        ));
        
        // Initialize input handler
        let input_handler = Arc::new(
            InputHandler::new(&config.input_config)?
        );
        
        // Get references from terminal
        let devcontainer_runtime = terminal.devcontainer.clone();
        let session_manager = terminal.sessions.clone();
        
        Ok(Self {
            config,
            terminal,
            ssh_manager,
            server_store,
            ui,
            renderer,
            input_handler,
            theme_manager,
            devcontainer_runtime,
            session_manager,
            running: Arc::new(RwLock::new(false)),
        })
    }
    
    /// Run the main application
    pub async fn run(&mut self) -> Result<()> {
        *self.running.write().await = true;
        
        // Start the terminal backend
        self.terminal.start().await?;
        
        // Initialize UI
        self.ui.write().await.initialize().await?;
        
        // Start render loop
        self.start_render_loop();
        
        // Start input processing
        self.start_input_loop();
        
        // Main event loop
        while *self.running.read().await {
            // Process events
            self.process_events().await?;
            
            // Small delay to prevent busy waiting
            tokio::time::sleep(Duration::from_millis(16)).await; // ~60 FPS
        }
        
        // Cleanup
        self.shutdown().await?;
        
        Ok(())
    }
    
    /// Connect to a remote server
    pub async fn connect_to_server(&mut self, server: &str) -> Result<()> {
        // Check if it's a configured server
        if let Ok(server_config) = self.server_store.get_server(server).await {
            // Use stored configuration
            if let Some(key) = &server_config.default_key {
                self.ssh_manager.load_key_by_name(key).await?;
            }
            
            self.terminal.connect_remote(&server_config.url).await?;
            
            // Update last connected time
            self.server_store.update_last_connected(server).await?;
        } else {
            // Direct connection
            self.terminal.connect_remote(server).await?;
        }
        
        Ok(())
    }
    
    /// Clone a repository
    pub async fn clone_repository(&self, url: &str) -> Result<PathBuf> {
        let repos_dir = dirs::home_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("repositories");
        
        tokio::fs::create_dir_all(&repos_dir).await?;
        
        // Extract repo name from URL
        let repo_name = url.split('/').last()
            .unwrap_or("repo")
            .trim_end_matches(".git");
        
        let repo_path = repos_dir.join(repo_name);
        
        // Clone using git
        let output = tokio::process::Command::new("git")
            .args(&["clone", url, repo_path.to_str().unwrap()])
            .output()
            .await?;
        
        if !output.status.success() {
            return Err(anyhow::anyhow!("Failed to clone repository: {}", 
                String::from_utf8_lossy(&output.stderr)));
        }
        
        Ok(repo_path)
    }
    
    /// Open a repository with DevContainer
    pub async fn open_with_devcontainer(&mut self, path: &PathBuf) -> Result<()> {
        let repo_path = path.to_string_lossy().to_string();
        
        // Create development session
        let session_id = self.terminal.create_dev_session(&repo_path).await?;
        
        // Switch UI to show the new session
        self.ui.write().await.switch_to_session(&session_id).await?;
        
        Ok(())
    }
    
    /// Enable mobile mode optimizations
    pub fn enable_mobile_mode(&mut self) {
        self.config.ui_config.mobile_mode = true;
        self.config.input_config.touch_enabled = true;
        self.config.render_config.adaptive_resolution = true;
    }
    
    /// Set fullscreen mode
    pub fn set_fullscreen(&mut self, fullscreen: bool) {
        self.config.ui_config.fullscreen = fullscreen;
    }
    
    /// Set UI theme
    pub fn set_theme(&mut self, theme: &str) -> Result<()> {
        self.theme_manager.set_theme(theme)?;
        Ok(())
    }
    
    /// Set UI scale factor
    pub fn set_scale_factor(&mut self, scale: f32) {
        self.config.ui_config.scale_factor = scale;
    }
    
    fn start_render_loop(&self) {
        let renderer = self.renderer.clone();
        let ui = self.ui.clone();
        let running = self.running.clone();
        
        tokio::spawn(async move {
            while *running.read().await {
                // Get UI state
                let ui_state = ui.read().await.get_render_state();
                
                // Render frame
                if let Err(e) = renderer.render_frame(&ui_state).await {
                    tracing::error!("Render error: {}", e);
                }
                
                // Adaptive frame rate
                let delay = renderer.get_frame_delay();
                tokio::time::sleep(delay).await;
            }
        });
    }
    
    fn start_input_loop(&self) {
        let input_handler = self.input_handler.clone();
        let ui = self.ui.clone();
        let running = self.running.clone();
        
        tokio::spawn(async move {
            while *running.read().await {
                // Process input events
                if let Some(event) = input_handler.poll_event().await {
                    if let Err(e) = ui.write().await.handle_input(event).await {
                        tracing::error!("Input handling error: {}", e);
                    }
                }
                
                // Small delay
                tokio::time::sleep(Duration::from_millis(1)).await;
            }
        });
    }
    
    async fn process_events(&mut self) -> Result<()> {
        // Process UI events
        while let Some(event) = self.ui.read().await.poll_event() {
            match event {
                UiEvent::Quit => {
                    *self.running.write().await = false;
                }
                UiEvent::OpenSettings => {
                    self.ui.write().await.show_settings().await?;
                }
                UiEvent::ConnectServer(server) => {
                    self.connect_to_server(&server).await?;
                }
                UiEvent::OpenRepository(path) => {
                    self.open_with_devcontainer(&PathBuf::from(path)).await?;
                }
                _ => {}
            }
        }
        
        Ok(())
    }
    
    async fn shutdown(&mut self) -> Result<()> {
        tracing::info!("Shutting down application");
        
        // Save state
        self.save_state().await?;
        
        // Cleanup UI
        self.ui.write().await.cleanup().await?;
        
        Ok(())
    }
    
    async fn save_state(&self) -> Result<()> {
        // Save configuration
        let config_path = dirs::config_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("katalyst")
            .join("config.toml");
        
        let content = toml::to_string_pretty(&self.config)?;
        tokio::fs::write(&config_path, content).await?;
        
        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub terminal_config: TerminalConfig,
    pub ssh_config: SshConfig,
    pub server_config: ServerConfig,
    pub ui_config: UiConfig,
    pub render_config: RenderConfig,
    pub input_config: InputConfig,
    pub theme_config: ThemeConfig,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            terminal_config: TerminalConfig::default(),
            ssh_config: SshConfig::default(),
            server_config: ServerConfig::default(),
            ui_config: UiConfig::default(),
            render_config: RenderConfig::default(),
            input_config: InputConfig::default(),
            theme_config: ThemeConfig::default(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SshConfig {
    pub keys_dir: PathBuf,
    pub known_hosts_file: PathBuf,
    pub default_key_type: String,
    pub agent_forwarding: bool,
}

impl Default for SshConfig {
    fn default() -> Self {
        let ssh_dir = dirs::home_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join(".ssh");
        
        Self {
            keys_dir: ssh_dir.clone(),
            known_hosts_file: ssh_dir.join("known_hosts"),
            default_key_type: "ed25519".to_string(),
            agent_forwarding: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    pub servers_file: PathBuf,
    pub auto_reconnect: bool,
    pub connection_timeout_secs: u64,
}

impl Default for ServerConfig {
    fn default() -> Self {
        Self {
            servers_file: dirs::config_dir()
                .unwrap_or_else(|| PathBuf::from("."))
                .join("katalyst")
                .join("servers.json"),
            auto_reconnect: true,
            connection_timeout_secs: 30,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UiConfig {
    pub fullscreen: bool,
    pub mobile_mode: bool,
    pub scale_factor: f32,
    pub show_tabs: bool,
    pub show_statusbar: bool,
    pub animations_enabled: bool,
    pub blur_background: bool,
}

impl Default for UiConfig {
    fn default() -> Self {
        Self {
            fullscreen: false,
            mobile_mode: false,
            scale_factor: 1.0,
            show_tabs: true,
            show_statusbar: true,
            animations_enabled: true,
            blur_background: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RenderConfig {
    pub backend: RenderBackend,
    pub vsync: bool,
    pub target_fps: f32,
    pub adaptive_resolution: bool,
    pub antialiasing: bool,
    pub gpu_acceleration: bool,
}

impl Default for RenderConfig {
    fn default() -> Self {
        Self {
            backend: RenderBackend::Wgpu,
            vsync: true,
            target_fps: 60.0,
            adaptive_resolution: false,
            antialiasing: true,
            gpu_acceleration: true,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RenderBackend {
    Wgpu,
    OpenGL,
    Metal,
    Vulkan,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InputConfig {
    pub touch_enabled: bool,
    pub gesture_support: bool,
    pub keyboard_shortcuts: bool,
    pub mouse_support: bool,
    pub gamepad_support: bool,
}

impl Default for InputConfig {
    fn default() -> Self {
        Self {
            touch_enabled: false,
            gesture_support: true,
            keyboard_shortcuts: true,
            mouse_support: true,
            gamepad_support: false,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ThemeConfig {
    pub default_theme: String,
    pub auto_switch: bool,
    pub custom_themes_dir: PathBuf,
}

impl Default for ThemeConfig {
    fn default() -> Self {
        Self {
            default_theme: "katalyst-dark".to_string(),
            auto_switch: true,
            custom_themes_dir: dirs::config_dir()
                .unwrap_or_else(|| PathBuf::from("."))
                .join("katalyst")
                .join("themes"),
        }
    }
}

#[derive(Debug, Clone)]
pub enum UiEvent {
    Quit,
    OpenSettings,
    ConnectServer(String),
    OpenRepository(String),
    SwitchSession(String),
    CreateSession,
    CloseSession(String),
}