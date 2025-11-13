use anyhow::Result;
use nvim_rs::{
    create::tokio as create,
    rpc::handler::DefaultHandler,
    Handler, Neovim, UiAttachOptions, Value,
};
use std::{
    path::{Path, PathBuf},
    process::Stdio,
    sync::Arc,
};
use tokio::{
    io::{AsyncBufReadExt, AsyncWriteExt, BufReader},
    process::{Child, Command},
    sync::RwLock,
};

pub mod config;
pub mod lsp_config;
pub mod plugins;
pub mod keymaps;

use config::NeovimConfig;

pub struct NeovimInstance {
    nvim: Neovim<DefaultHandler>,
    process: Child,
    config_dir: PathBuf,
    runtime_dir: PathBuf,
}

impl NeovimInstance {
    pub async fn new() -> Result<Self> {
        // Create Neovim configuration directories
        let config_dir = Self::setup_config_dir()?;
        let runtime_dir = Self::setup_runtime_dir()?;
        
        // Initialize Neovim configuration
        Self::initialize_config(&config_dir).await?;
        
        // Start Neovim process with embedded configuration
        let mut cmd = Command::new("nvim");
        cmd.arg("--embed")
            .arg("--headless")
            .arg("-u")
            .arg(config_dir.join("init.lua"))
            .env("XDG_CONFIG_HOME", config_dir.parent().unwrap())
            .env("XDG_DATA_HOME", runtime_dir.parent().unwrap())
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());
        
        let mut process = cmd.spawn()?;
        
        let stdin = process.stdin.take().unwrap();
        let stdout = process.stdout.take().unwrap();
        
        let (nvim, _io_handler) = create::new_child_cmd(stdin, stdout).await?;
        
        let instance = Self {
            nvim,
            process,
            config_dir,
            runtime_dir,
        };
        
        // Attach UI and configure
        instance.attach_ui().await?;
        instance.configure_lsp().await?;
        
        Ok(instance)
    }
    
    fn setup_config_dir() -> Result<PathBuf> {
        let config_dir = dirs::config_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("katalyst")
            .join("nvim");
        
        std::fs::create_dir_all(&config_dir)?;
        Ok(config_dir)
    }
    
    fn setup_runtime_dir() -> Result<PathBuf> {
        let runtime_dir = dirs::data_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("katalyst")
            .join("nvim");
        
        std::fs::create_dir_all(&runtime_dir)?;
        Ok(runtime_dir)
    }
    
    async fn initialize_config(config_dir: &Path) -> Result<()> {
        // Create init.lua
        let init_lua = include_str!("../../config/nvim/init.lua");
        std::fs::write(config_dir.join("init.lua"), init_lua)?;
        
        // Create lua directory structure
        let lua_dir = config_dir.join("lua");
        std::fs::create_dir_all(&lua_dir)?;
        std::fs::create_dir_all(lua_dir.join("config"))?;
        std::fs::create_dir_all(lua_dir.join("plugins"))?;
        
        // Write configuration files
        Self::write_config_files(&lua_dir)?;
        
        Ok(())
    }
    
    fn write_config_files(lua_dir: &Path) -> Result<()> {
        // Core configuration
        std::fs::write(
            lua_dir.join("config/init.lua"),
            include_str!("../../config/nvim/lua/config/init.lua")
        )?;
        
        // Options
        std::fs::write(
            lua_dir.join("config/options.lua"),
            include_str!("../../config/nvim/lua/config/options.lua")
        )?;
        
        // Keymaps
        std::fs::write(
            lua_dir.join("config/keymaps.lua"),
            include_str!("../../config/nvim/lua/config/keymaps.lua")
        )?;
        
        // Autocmds
        std::fs::write(
            lua_dir.join("config/autocmds.lua"),
            include_str!("../../config/nvim/lua/config/autocmds.lua")
        )?;
        
        // LSP configuration
        std::fs::write(
            lua_dir.join("config/lsp.lua"),
            include_str!("../../config/nvim/lua/config/lsp.lua")
        )?;
        
        // Plugin configurations
        std::fs::write(
            lua_dir.join("plugins/init.lua"),
            include_str!("../../config/nvim/lua/plugins/init.lua")
        )?;
        
        Ok(())
    }
    
    async fn attach_ui(&self) -> Result<()> {
        let options = UiAttachOptions::new()
            .set_rgb(true)
            .set_ext_linegrid(true)
            .set_ext_multigrid(true)
            .set_ext_hlstate(true)
            .set_ext_termcolors(true);
        
        self.nvim.ui_attach(80, 24, &options).await?;
        Ok(())
    }
    
    async fn configure_lsp(&self) -> Result<()> {
        // Initialize LSP servers for all languages
        self.nvim.command("lua require('config.lsp').setup()").await?;
        Ok(())
    }
    
    pub async fn open_file(&self, path: &Path) -> Result<()> {
        let path_str = path.to_string_lossy();
        self.nvim.command(&format!("edit {}", path_str)).await?;
        Ok(())
    }
    
    pub async fn execute_command(&self, cmd: &str) -> Result<String> {
        let result = self.nvim.command_output(cmd).await?;
        Ok(result)
    }
    
    pub async fn get_current_buffer_content(&self) -> Result<Vec<String>> {
        let buffer = self.nvim.get_current_buf().await?;
        let lines = buffer.get_lines(0, -1, false).await?;
        Ok(lines)
    }
    
    pub async fn set_buffer_content(&self, lines: Vec<String>) -> Result<()> {
        let buffer = self.nvim.get_current_buf().await?;
        buffer.set_lines(0, -1, false, lines).await?;
        Ok(())
    }
    
    pub async fn handle_input(&self, input: &str) -> Result<()> {
        self.nvim.input(input).await?;
        Ok(())
    }
    
    pub async fn resize(&self, width: i64, height: i64) -> Result<()> {
        self.nvim.ui_try_resize(width, height).await?;
        Ok(())
    }
    
    pub async fn shutdown(&mut self) -> Result<()> {
        self.nvim.command("qa!").await?;
        self.process.kill().await?;
        Ok(())
    }
}

// Bridge between TUI and Neovim
pub struct NeovimBridge {
    instances: Arc<RwLock<Vec<Arc<RwLock<NeovimInstance>>>>>,
}

impl NeovimBridge {
    pub fn new() -> Self {
        Self {
            instances: Arc::new(RwLock::new(Vec::new())),
        }
    }
    
    pub async fn create_instance(&self) -> Result<Arc<RwLock<NeovimInstance>>> {
        let instance = Arc::new(RwLock::new(NeovimInstance::new().await?));
        self.instances.write().await.push(instance.clone());
        Ok(instance)
    }
    
    pub async fn remove_instance(&self, instance: Arc<RwLock<NeovimInstance>>) -> Result<()> {
        let mut instances = self.instances.write().await;
        instances.retain(|i| !Arc::ptr_eq(i, &instance));
        Ok(())
    }
}