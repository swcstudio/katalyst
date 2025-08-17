use anyhow::Result;
use crossterm::event::{KeyEvent, MouseEvent};
use std::sync::Arc;
use tokio::sync::RwLock;

use crate::{
    components::{
        protocol_panel::ProtocolPanel,
        terminal_pane::TerminalPane,
        // editor::Editor,
        // file_explorer::FileExplorer,
        // lsp_status::LspStatus,
        // search_panel::SearchPanel,
        // statusbar::StatusBar,
        // tabbar::TabBar,
        // command_palette::CommandPalette,
        // notifications::NotificationManager,
    },
    config::Config,
    layout::LayoutManager,
    lsp::LspManager,
    state::AppState,
    themes::ThemeManager,
    wasm::WasmRuntime,
};

pub struct App {
    pub state: AppState,
    pub config: Config,
    pub layout_manager: LayoutManager,
    pub theme_manager: ThemeManager,
    pub lsp_manager: Arc<RwLock<LspManager>>,
    pub wasm_runtime: Arc<RwLock<WasmRuntime>>,
    
    // Components
    pub protocol_panel: ProtocolPanel,
    pub terminal_pane: TerminalPane,
    // pub editor: Editor,
    // pub file_explorer: FileExplorer,
    // pub search_panel: SearchPanel,
    // pub statusbar: StatusBar,
    // pub tabbar: TabBar,
    // pub lsp_status: LspStatus,
    // pub command_palette: CommandPalette,
    // pub notification_manager: NotificationManager,
    
    should_quit: bool,
}

impl App {
    pub async fn new(config: Config) -> Result<Self> {
        // Initialize LSP manager with all language servers
        let lsp_manager = Arc::new(RwLock::new(
            LspManager::new(&config).await?
        ));
        
        // Initialize WASM runtime
        let wasm_runtime = Arc::new(RwLock::new(
            WasmRuntime::new(&config)?
        ));
        
        // Initialize theme manager
        let theme_manager = ThemeManager::new(&config)?;
        
        // Initialize layout manager
        let layout_manager = LayoutManager::new(&config);
        
        // Initialize state
        let state = AppState::new();
        
        // Initialize components
        let protocol_panel = ProtocolPanel::new()?;
        let terminal_pane = TerminalPane::new()?;
        // let editor = Editor::new(lsp_manager.clone());
        // let file_explorer = FileExplorer::new(&config.workspace_root);
        // let search_panel = SearchPanel::new()?;
        // let statusbar = StatusBar::new();
        // let tabbar = TabBar::new();
        // let lsp_status = LspStatus::new(lsp_manager.clone());
        // let command_palette = CommandPalette::new();
        // let notification_manager = NotificationManager::new();
        
        Ok(Self {
            state,
            config,
            layout_manager,
            theme_manager,
            lsp_manager,
            wasm_runtime,
            protocol_panel,
            terminal_pane,
            // editor,
            // file_explorer,
            // search_panel,
            // statusbar,
            // tabbar,
            // lsp_status,
            // command_palette,
            // notification_manager,
            should_quit: false,
        })
    }
    
    pub async fn handle_key_event(&mut self, key: KeyEvent) -> Result<()> {
        // Route key events to active component
        match self.state.active_pane() {
            ActivePane::Protocol => self.protocol_panel.handle_key_event(key).await?,
            ActivePane::Terminal => self.terminal_pane.handle_key_event(key).await?,
            // ActivePane::Editor => self.editor.handle_key_event(key).await?,
            // ActivePane::FileExplorer => self.file_explorer.handle_key_event(key).await?,
            // ActivePane::Search => self.search_panel.handle_key_event(key).await?,
            // ActivePane::CommandPalette => self.command_palette.handle_key_event(key).await?,
            _ => {}
        }
        
        // Update status
        // self.statusbar.update(&self.state);
        
        Ok(())
    }
    
    pub async fn handle_mouse_event(&mut self, mouse: MouseEvent) -> Result<()> {
        // Handle mouse events for click-to-focus and scrolling
        self.layout_manager.handle_mouse_event(mouse, &mut self.state)?;
        Ok(())
    }
    
    pub async fn handle_resize(&mut self, width: u16, height: u16) -> Result<()> {
        self.layout_manager.handle_resize(width, height);
        Ok(())
    }
    
    pub fn should_quit(&self) -> bool {
        self.should_quit
    }
    
    pub fn quit(&mut self) {
        self.should_quit = true;
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ActivePane {
    Protocol,
    Terminal,
    Editor,
    FileExplorer,
    Search,
    CommandPalette,
}