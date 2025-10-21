use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    path::{Path, PathBuf},
    process::Stdio,
    sync::Arc,
};
use tokio::{
    io::{AsyncBufReadExt, AsyncWriteExt, BufReader},
    process::{Child, Command},
    sync::{Mutex, RwLock},
};
use zellij_utils::{
    input::layout::Layout,
    ipc::{ClientToServerMsg, ServerToClientMsg},
    pane_size::PaneGeom,
    position::Position,
};

/// Zellij terminal multiplexer server
pub struct ZellijServer {
    config: ZellijConfig,
    sessions: Arc<RwLock<HashMap<String, ZellijSession>>>,
    layouts: Arc<RwLock<HashMap<String, Layout>>>,
    plugins: Arc<RwLock<Vec<ZellijPlugin>>>,
}

impl ZellijServer {
    pub async fn new(config: &ZellijConfig) -> Result<Self> {
        let sessions = Arc::new(RwLock::new(HashMap::new()));
        let layouts = Arc::new(RwLock::new(Self::load_layouts(&config.layout_dir)?));
        let plugins = Arc::new(RwLock::new(Self::load_plugins(&config.plugin_dir)?));
        
        Ok(Self {
            config: config.clone(),
            sessions,
            layouts,
            plugins,
        })
    }
    
    pub async fn start(&self) -> Result<()> {
        tracing::info!("Starting Zellij server");
        
        // Initialize Zellij configuration
        self.write_config().await?;
        
        // Start Zellij daemon if not running
        if !self.is_running().await {
            self.start_daemon().await?;
        }
        
        Ok(())
    }
    
    pub async fn create_session(&self, name: &str) -> Result<String> {
        let session_id = format!("{}-{}", name, uuid::Uuid::new_v4());
        
        // Get or create layout
        let layout = self.get_layout(name).await?;
        
        // Create Zellij session
        let mut cmd = Command::new("zellij");
        cmd.args(&[
            "attach",
            "--create",
            &session_id,
            "--layout",
            &layout.to_string(),
        ]);
        
        if let Some(ref dir) = self.config.session_dir {
            cmd.arg("--session-dir").arg(dir);
        }
        
        let child = cmd
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()?;
        
        let session = ZellijSession {
            id: session_id.clone(),
            name: name.to_string(),
            layout: layout.clone(),
            process: Arc::new(Mutex::new(child)),
            panes: Vec::new(),
            active_pane: 0,
            created_at: chrono::Utc::now(),
        };
        
        self.sessions.write().await.insert(session_id.clone(), session);
        
        tracing::info!("Created Zellij session: {}", session_id);
        Ok(session_id)
    }
    
    pub async fn attach_session(&self, session_id: &str) -> Result<()> {
        let sessions = self.sessions.read().await;
        let _session = sessions.get(session_id)
            .ok_or_else(|| anyhow::anyhow!("Session not found: {}", session_id))?;
        
        Command::new("zellij")
            .args(&["attach", session_id])
            .spawn()?;
        
        Ok(())
    }
    
    pub async fn detach_session(&self, session_id: &str) -> Result<()> {
        Command::new("zellij")
            .args(&["detach", session_id])
            .spawn()?;
        
        Ok(())
    }
    
    pub async fn kill_session(&self, session_id: &str) -> Result<()> {
        Command::new("zellij")
            .args(&["kill-session", session_id])
            .spawn()?;
        
        self.sessions.write().await.remove(session_id);
        
        Ok(())
    }
    
    pub async fn list_sessions(&self) -> Result<Vec<String>> {
        let output = Command::new("zellij")
            .args(&["list-sessions"])
            .output()
            .await?;
        
        let sessions = String::from_utf8(output.stdout)?
            .lines()
            .map(|s| s.to_string())
            .collect();
        
        Ok(sessions)
    }
    
    pub async fn create_pane(&self, session_id: &str, direction: PaneDirection) -> Result<u32> {
        let mut sessions = self.sessions.write().await;
        let session = sessions.get_mut(session_id)
            .ok_or_else(|| anyhow::anyhow!("Session not found"))?;
        
        let pane_id = session.panes.len() as u32;
        
        let direction_arg = match direction {
            PaneDirection::Horizontal => "--horizontal",
            PaneDirection::Vertical => "--vertical",
        };
        
        Command::new("zellij")
            .args(&["action", "new-pane", direction_arg])
            .env("ZELLIJ_SESSION", session_id)
            .spawn()?;
        
        session.panes.push(ZellijPane {
            id: pane_id,
            position: Position::default(),
            size: PaneGeom::default(),
            is_focused: false,
        });
        
        Ok(pane_id)
    }
    
    pub async fn close_pane(&self, session_id: &str, pane_id: u32) -> Result<()> {
        Command::new("zellij")
            .args(&["action", "close-pane"])
            .env("ZELLIJ_SESSION", session_id)
            .env("ZELLIJ_PANE_ID", pane_id.to_string())
            .spawn()?;
        
        let mut sessions = self.sessions.write().await;
        if let Some(session) = sessions.get_mut(session_id) {
            session.panes.retain(|p| p.id != pane_id);
        }
        
        Ok(())
    }
    
    pub async fn run_command(&self, session_id: &str, pane_id: u32, command: &str) -> Result<()> {
        Command::new("zellij")
            .args(&["action", "write", command])
            .env("ZELLIJ_SESSION", session_id)
            .env("ZELLIJ_PANE_ID", pane_id.to_string())
            .spawn()?;
        
        Ok(())
    }
    
    pub async fn resize_pane(&self, session_id: &str, pane_id: u32, direction: ResizeDirection, amount: u16) -> Result<()> {
        let direction_arg = match direction {
            ResizeDirection::Increase => "+",
            ResizeDirection::Decrease => "-",
        };
        
        Command::new("zellij")
            .args(&["action", "resize", direction_arg, &amount.to_string()])
            .env("ZELLIJ_SESSION", session_id)
            .env("ZELLIJ_PANE_ID", pane_id.to_string())
            .spawn()?;
        
        Ok(())
    }
    
    pub async fn focus_pane(&self, session_id: &str, pane_id: u32) -> Result<()> {
        Command::new("zellij")
            .args(&["action", "focus-pane"])
            .env("ZELLIJ_SESSION", session_id)
            .env("ZELLIJ_PANE_ID", pane_id.to_string())
            .spawn()?;
        
        let mut sessions = self.sessions.write().await;
        if let Some(session) = sessions.get_mut(session_id) {
            for pane in &mut session.panes {
                pane.is_focused = pane.id == pane_id;
            }
            if pane_id < session.panes.len() as u32 {
                session.active_pane = pane_id as usize;
            }
        }
        
        Ok(())
    }
    
    pub async fn load_plugin(&self, session_id: &str, plugin_name: &str) -> Result<()> {
        let plugins = self.plugins.read().await;
        let plugin = plugins.iter()
            .find(|p| p.name == plugin_name)
            .ok_or_else(|| anyhow::anyhow!("Plugin not found: {}", plugin_name))?;
        
        Command::new("zellij")
            .args(&["action", "load-plugin", &plugin.path.to_string_lossy()])
            .env("ZELLIJ_SESSION", session_id)
            .spawn()?;
        
        Ok(())
    }
    
    async fn get_layout(&self, name: &str) -> Result<Layout> {
        let layouts = self.layouts.read().await;
        
        if let Some(layout) = layouts.get(name) {
            return Ok(layout.clone());
        }
        
        // Create default layout
        Ok(self.create_default_layout(name))
    }
    
    fn create_default_layout(&self, name: &str) -> Layout {
        // Create a sensible default layout
        Layout {
            template: Some(LayoutTemplate {
                direction: Direction::Horizontal,
                parts: vec![
                    LayoutPart {
                        direction: Direction::Vertical,
                        split_size: Some(SplitSize::Percent(30)),
                        run: Some(RunCommand {
                            command: "helix".to_string(),
                            args: vec![],
                        }),
                    },
                    LayoutPart {
                        direction: Direction::Vertical,
                        split_size: Some(SplitSize::Percent(70)),
                        run: None,
                    },
                ],
            }),
            tabs: vec![],
        }
    }
    
    async fn write_config(&self) -> Result<()> {
        let config_path = self.config.config_dir.join("config.kdl");
        let config_content = self.generate_config_kdl();
        tokio::fs::write(config_path, config_content).await?;
        Ok(())
    }
    
    fn generate_config_kdl(&self) -> String {
        format!(r#"
keybinds clear-defaults=true {{
    normal {{
        bind "Ctrl h" {{ MoveFocus "Left"; }}
        bind "Ctrl l" {{ MoveFocus "Right"; }}
        bind "Ctrl j" {{ MoveFocus "Down"; }}
        bind "Ctrl k" {{ MoveFocus "Up"; }}
        bind "Ctrl n" {{ NewPane; }}
        bind "Ctrl x" {{ CloseFocus; }}
        bind "Ctrl s" {{ SwitchToMode "Scroll"; }}
        bind "Ctrl o" {{ FocusNextPane; }}
        bind "Ctrl d" {{ Detach; }}
        bind "Ctrl q" {{ Quit; }}
    }}
}}

themes {{
    katalyst {{
        fg "#D8D8D8"
        bg "#1C1C1C"
        black "#1C1C1C"
        red "#FF6B6B"
        green "#95E454"
        yellow "#FFA54F"
        blue "#96CBFE"
        magenta "#FF73FD"
        cyan "#A6E1FF"
        white "#F8F8F8"
        orange "#FFA54F"
    }}
}}

default_theme "katalyst"
default_shell "zsh"
scrollback_buffer_size 10000
copy_on_select true
mouse_mode true

plugins {{
    tab-bar {{ path "tab-bar"; }}
    status-bar {{ path "status-bar"; }}
    strider {{ path "strider"; }}
}}

ui {{
    pane_frames {{
        rounded_corners true
        hide_session_name false
    }}
}}
        "#)
    }
    
    async fn is_running(&self) -> bool {
        Command::new("zellij")
            .args(&["list-sessions"])
            .output()
            .await
            .is_ok()
    }
    
    async fn start_daemon(&self) -> Result<()> {
        Command::new("zellij")
            .args(&["--server"])
            .spawn()?;
        
        tokio::time::sleep(std::time::Duration::from_secs(1)).await;
        
        Ok(())
    }
    
    fn load_layouts(layout_dir: &Path) -> Result<HashMap<String, Layout>> {
        let mut layouts = HashMap::new();
        
        // Load custom layouts from directory
        if layout_dir.exists() {
            for entry in std::fs::read_dir(layout_dir)? {
                let entry = entry?;
                let path = entry.path();
                if path.extension() == Some(std::ffi::OsStr::new("kdl")) {
                    let name = path.file_stem()
                        .and_then(|s| s.to_str())
                        .unwrap_or("unknown")
                        .to_string();
                    
                    // Parse KDL layout file
                    let content = std::fs::read_to_string(&path)?;
                    if let Ok(layout) = Self::parse_layout(&content) {
                        layouts.insert(name, layout);
                    }
                }
            }
        }
        
        // Add default layouts
        layouts.insert("default".to_string(), Self::default_layout());
        layouts.insert("development".to_string(), Self::development_layout());
        layouts.insert("coding".to_string(), Self::coding_layout());
        
        Ok(layouts)
    }
    
    fn parse_layout(_content: &str) -> Result<Layout> {
        // Implement KDL parsing
        Ok(Layout::default())
    }
    
    fn default_layout() -> Layout {
        Layout::default()
    }
    
    fn development_layout() -> Layout {
        // Editor on left, terminal on right, bottom panel for logs
        Layout::default()
    }
    
    fn coding_layout() -> Layout {
        // Helix main, terminals on right, file tree on left
        Layout::default()
    }
    
    fn load_plugins(plugin_dir: &Path) -> Result<Vec<ZellijPlugin>> {
        let mut plugins = Vec::new();
        
        // Built-in plugins
        plugins.push(ZellijPlugin {
            name: "tab-bar".to_string(),
            path: plugin_dir.join("tab-bar.wasm"),
            config: HashMap::new(),
        });
        
        plugins.push(ZellijPlugin {
            name: "status-bar".to_string(),
            path: plugin_dir.join("status-bar.wasm"),
            config: HashMap::new(),
        });
        
        plugins.push(ZellijPlugin {
            name: "strider".to_string(),
            path: plugin_dir.join("strider.wasm"),
            config: HashMap::new(),
        });
        
        // Custom plugins
        if plugin_dir.exists() {
            for entry in std::fs::read_dir(plugin_dir)? {
                let entry = entry?;
                let path = entry.path();
                if path.extension() == Some(std::ffi::OsStr::new("wasm")) {
                    let name = path.file_stem()
                        .and_then(|s| s.to_str())
                        .unwrap_or("unknown")
                        .to_string();
                    
                    plugins.push(ZellijPlugin {
                        name,
                        path,
                        config: HashMap::new(),
                    });
                }
            }
        }
        
        Ok(plugins)
    }
}

#[derive(Debug, Clone)]
pub struct ZellijSession {
    pub id: String,
    pub name: String,
    pub layout: Layout,
    pub process: Arc<Mutex<Child>>,
    pub panes: Vec<ZellijPane>,
    pub active_pane: usize,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone)]
pub struct ZellijPane {
    pub id: u32,
    pub position: Position,
    pub size: PaneGeom,
    pub is_focused: bool,
}

#[derive(Debug, Clone)]
pub struct ZellijPlugin {
    pub name: String,
    pub path: PathBuf,
    pub config: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ZellijConfig {
    pub config_dir: PathBuf,
    pub layout_dir: PathBuf,
    pub plugin_dir: PathBuf,
    pub session_dir: Option<PathBuf>,
    pub default_shell: String,
    pub scrollback_buffer_size: usize,
    pub copy_on_select: bool,
    pub mouse_mode: bool,
    pub theme: String,
}

impl Default for ZellijConfig {
    fn default() -> Self {
        let config_dir = dirs::config_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("zellij");
        
        Self {
            config_dir: config_dir.clone(),
            layout_dir: config_dir.join("layouts"),
            plugin_dir: config_dir.join("plugins"),
            session_dir: Some(config_dir.join("sessions")),
            default_shell: "zsh".to_string(),
            scrollback_buffer_size: 10000,
            copy_on_select: true,
            mouse_mode: true,
            theme: "katalyst".to_string(),
        }
    }
}

#[derive(Debug, Clone, Default)]
pub struct Layout {
    pub template: Option<LayoutTemplate>,
    pub tabs: Vec<Tab>,
}

#[derive(Debug, Clone)]
pub struct LayoutTemplate {
    pub direction: Direction,
    pub parts: Vec<LayoutPart>,
}

#[derive(Debug, Clone)]
pub struct LayoutPart {
    pub direction: Direction,
    pub split_size: Option<SplitSize>,
    pub run: Option<RunCommand>,
}

#[derive(Debug, Clone)]
pub struct RunCommand {
    pub command: String,
    pub args: Vec<String>,
}

#[derive(Debug, Clone)]
pub enum Direction {
    Horizontal,
    Vertical,
}

#[derive(Debug, Clone)]
pub enum SplitSize {
    Percent(u8),
    Fixed(u16),
}

#[derive(Debug, Clone)]
pub struct Tab {
    pub name: String,
    pub layout: Layout,
}

#[derive(Debug, Clone)]
pub enum PaneDirection {
    Horizontal,
    Vertical,
}

#[derive(Debug, Clone)]
pub enum ResizeDirection {
    Increase,
    Decrease,
}