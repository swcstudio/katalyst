use anyhow::Result;
use std::sync::Arc;
use parking_lot::RwLock;

pub mod gpu_renderer;
pub mod terminal_emulator;
pub mod font_renderer;
pub mod performance;
pub mod scrollback;
pub mod input;
pub mod config;

use gpu_renderer::GpuRenderer;
use terminal_emulator::TerminalEmulator;
use font_renderer::FontRenderer;
use performance::PerformanceMonitor;
use scrollback::ScrollbackBuffer;

/// High-performance terminal that rivals Alacritty
pub struct KatalystTerminal {
    renderer: Arc<GpuRenderer>,
    emulator: Arc<RwLock<TerminalEmulator>>,
    font_renderer: Arc<FontRenderer>,
    scrollback: Arc<RwLock<ScrollbackBuffer>>,
    performance: Arc<PerformanceMonitor>,
    config: config::TerminalConfig,
}

impl KatalystTerminal {
    pub async fn new(config: config::TerminalConfig) -> Result<Self> {
        // Initialize GPU renderer with wgpu
        let renderer = Arc::new(GpuRenderer::new(&config).await?);
        
        // Initialize font renderer with HarfBuzz for ligatures
        let font_renderer = Arc::new(FontRenderer::new(&config)?);
        
        // Initialize terminal emulator with zsh
        let emulator = Arc::new(RwLock::new(
            TerminalEmulator::new_with_zsh(&config)?
        ));
        
        // Initialize zero-copy scrollback buffer
        let scrollback = Arc::new(RwLock::new(
            ScrollbackBuffer::new(config.scrollback_lines)?
        ));
        
        // Initialize performance monitor
        let performance = Arc::new(PerformanceMonitor::new());
        
        Ok(Self {
            renderer,
            emulator,
            font_renderer,
            scrollback,
            performance,
            config,
        })
    }
    
    pub fn render_frame(&mut self) -> Result<()> {
        self.performance.begin_frame();
        
        // Get terminal content with damage tracking
        let content = self.emulator.read().get_damaged_content();
        
        // Render only damaged regions (like Alacritty)
        if !content.damaged_lines.is_empty() {
            self.renderer.render_damaged(&content, &self.font_renderer)?;
        }
        
        self.performance.end_frame();
        
        // Adaptive frame rate based on activity
        self.adjust_frame_rate();
        
        Ok(())
    }
    
    fn adjust_frame_rate(&mut self) {
        let stats = self.performance.get_stats();
        
        // Dynamically adjust frame rate based on activity
        if stats.input_activity_ms < 100 {
            // High activity: 144+ FPS for responsiveness
            self.renderer.set_target_fps(144);
        } else if stats.input_activity_ms < 1000 {
            // Medium activity: 60 FPS
            self.renderer.set_target_fps(60);
        } else {
            // Low activity: 30 FPS to save power
            self.renderer.set_target_fps(30);
        }
    }
    
    pub fn handle_input(&mut self, input: input::TerminalInput) -> Result<()> {
        self.performance.record_input();
        
        match input {
            input::TerminalInput::Key(key) => {
                self.emulator.write().handle_key(key)?;
            }
            input::TerminalInput::Mouse(mouse) => {
                self.emulator.write().handle_mouse(mouse)?;
            }
            input::TerminalInput::Paste(text) => {
                // Bracket paste mode for safety
                self.emulator.write().paste_with_brackets(&text)?;
            }
            input::TerminalInput::Resize(cols, rows) => {
                self.handle_resize(cols, rows)?;
            }
        }
        
        Ok(())
    }
    
    fn handle_resize(&mut self, cols: u16, rows: u16) -> Result<()> {
        self.emulator.write().resize(cols, rows)?;
        self.renderer.resize(cols, rows)?;
        Ok(())
    }
    
    pub fn get_performance_stats(&self) -> performance::Stats {
        self.performance.get_stats()
    }
}