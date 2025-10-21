use anyhow::Result;
use crossterm::event::{KeyCode, KeyEvent, KeyModifiers};
use portable_pty::{CommandBuilder, PtySize, PtySystem};
use ratatui::{
    buffer::Buffer,
    layout::Rect,
    style::{Color, Style},
    widgets::{Block, Borders, Widget},
};
use std::{
    collections::VecDeque,
    io::{BufRead, BufReader, Write},
    path::PathBuf,
    sync::Arc,
};
use tokio::sync::RwLock;

use crate::neovim::{NeovimBridge, NeovimInstance};

pub struct TerminalPane {
    terminals: Vec<Terminal>,
    active_terminal: usize,
    neovim_bridge: Arc<NeovimBridge>,
    layout: TerminalLayout,
}

impl TerminalPane {
    pub fn new() -> Result<Self> {
        let neovim_bridge = Arc::new(NeovimBridge::new());
        
        // Create initial terminal with Neovim
        let mut terminals = Vec::new();
        let terminal = Terminal::new_with_neovim(neovim_bridge.clone())?;
        terminals.push(terminal);
        
        Ok(Self {
            terminals,
            active_terminal: 0,
            neovim_bridge,
            layout: TerminalLayout::Single,
        })
    }
    
    pub async fn handle_key_event(&mut self, key: KeyEvent) -> Result<()> {
        // Handle terminal-specific keybindings
        match (key.code, key.modifiers) {
            // Terminal management
            (KeyCode::Char('d'), KeyModifiers::CONTROL | KeyModifiers::SHIFT) => {
                self.split_horizontal().await?;
            }
            (KeyCode::Char('d'), KeyModifiers::CONTROL) => {
                self.split_vertical().await?;
            }
            (KeyCode::Char('w'), KeyModifiers::CONTROL) => {
                self.close_current_terminal().await?;
            }
            (KeyCode::Char('n'), KeyModifiers::CONTROL | KeyModifiers::SHIFT) => {
                self.new_terminal().await?;
            }
            
            // Navigation between terminals
            (KeyCode::Left, KeyModifiers::ALT) => {
                self.focus_left();
            }
            (KeyCode::Right, KeyModifiers::ALT) => {
                self.focus_right();
            }
            (KeyCode::Up, KeyModifiers::ALT) => {
                self.focus_up();
            }
            (KeyCode::Down, KeyModifiers::ALT) => {
                self.focus_down();
            }
            
            // Pass through to active terminal
            _ => {
                if let Some(terminal) = self.terminals.get_mut(self.active_terminal) {
                    terminal.handle_key_event(key).await?;
                }
            }
        }
        
        Ok(())
    }
    
    pub async fn split_horizontal(&mut self) -> Result<()> {
        let new_terminal = Terminal::new_with_neovim(self.neovim_bridge.clone())?;
        self.terminals.push(new_terminal);
        
        self.layout = match self.layout {
            TerminalLayout::Single => TerminalLayout::HSplit(2),
            TerminalLayout::HSplit(n) => TerminalLayout::HSplit(n + 1),
            TerminalLayout::VSplit(n) => TerminalLayout::Grid(n, 2),
            TerminalLayout::Grid(cols, rows) => TerminalLayout::Grid(cols, rows + 1),
        };
        
        Ok(())
    }
    
    pub async fn split_vertical(&mut self) -> Result<()> {
        let new_terminal = Terminal::new_with_neovim(self.neovim_bridge.clone())?;
        self.terminals.push(new_terminal);
        
        self.layout = match self.layout {
            TerminalLayout::Single => TerminalLayout::VSplit(2),
            TerminalLayout::VSplit(n) => TerminalLayout::VSplit(n + 1),
            TerminalLayout::HSplit(n) => TerminalLayout::Grid(2, n),
            TerminalLayout::Grid(cols, rows) => TerminalLayout::Grid(cols + 1, rows),
        };
        
        Ok(())
    }
    
    pub async fn new_terminal(&mut self) -> Result<()> {
        let terminal = Terminal::new_with_neovim(self.neovim_bridge.clone())?;
        self.terminals.push(terminal);
        self.active_terminal = self.terminals.len() - 1;
        Ok(())
    }
    
    pub async fn close_current_terminal(&mut self) -> Result<()> {
        if self.terminals.len() > 1 {
            let terminal = self.terminals.remove(self.active_terminal);
            if let Some(nvim) = terminal.neovim_instance {
                self.neovim_bridge.remove_instance(nvim).await?;
            }
            
            if self.active_terminal >= self.terminals.len() {
                self.active_terminal = self.terminals.len() - 1;
            }
            
            // Adjust layout
            match self.layout {
                TerminalLayout::HSplit(n) if n > 2 => {
                    self.layout = TerminalLayout::HSplit(n - 1);
                }
                TerminalLayout::VSplit(n) if n > 2 => {
                    self.layout = TerminalLayout::VSplit(n - 1);
                }
                TerminalLayout::Grid(cols, rows) if cols * rows > self.terminals.len() => {
                    // Recalculate grid
                    let total = self.terminals.len();
                    let cols = (total as f32).sqrt().ceil() as usize;
                    let rows = (total + cols - 1) / cols;
                    self.layout = TerminalLayout::Grid(cols, rows);
                }
                _ if self.terminals.len() == 1 => {
                    self.layout = TerminalLayout::Single;
                }
                _ => {}
            }
        }
        
        Ok(())
    }
    
    fn focus_left(&mut self) {
        if self.active_terminal > 0 {
            self.active_terminal -= 1;
        }
    }
    
    fn focus_right(&mut self) {
        if self.active_terminal < self.terminals.len() - 1 {
            self.active_terminal += 1;
        }
    }
    
    fn focus_up(&mut self) {
        // Calculate based on layout
        match self.layout {
            TerminalLayout::Grid(cols, _) => {
                if self.active_terminal >= cols {
                    self.active_terminal -= cols;
                }
            }
            TerminalLayout::HSplit(_) => {
                if self.active_terminal > 0 {
                    self.active_terminal -= 1;
                }
            }
            _ => {}
        }
    }
    
    fn focus_down(&mut self) {
        // Calculate based on layout
        match self.layout {
            TerminalLayout::Grid(cols, rows) => {
                let new_index = self.active_terminal + cols;
                if new_index < self.terminals.len() {
                    self.active_terminal = new_index;
                }
            }
            TerminalLayout::HSplit(n) => {
                if self.active_terminal < n - 1 {
                    self.active_terminal += 1;
                }
            }
            _ => {}
        }
    }
    
    pub fn render(&self, area: Rect, buf: &mut Buffer) {
        let areas = self.calculate_areas(area);
        
        for (i, (terminal, area)) in self.terminals.iter().zip(areas.iter()).enumerate() {
            let is_active = i == self.active_terminal;
            terminal.render(*area, buf, is_active);
        }
    }
    
    fn calculate_areas(&self, area: Rect) -> Vec<Rect> {
        match self.layout {
            TerminalLayout::Single => vec![area],
            TerminalLayout::HSplit(n) => {
                let height = area.height / n as u16;
                (0..n)
                    .map(|i| Rect {
                        x: area.x,
                        y: area.y + (i as u16 * height),
                        width: area.width,
                        height,
                    })
                    .collect()
            }
            TerminalLayout::VSplit(n) => {
                let width = area.width / n as u16;
                (0..n)
                    .map(|i| Rect {
                        x: area.x + (i as u16 * width),
                        y: area.y,
                        width,
                        height: area.height,
                    })
                    .collect()
            }
            TerminalLayout::Grid(cols, rows) => {
                let width = area.width / cols as u16;
                let height = area.height / rows as u16;
                let mut areas = Vec::new();
                
                for row in 0..rows {
                    for col in 0..cols {
                        if areas.len() < self.terminals.len() {
                            areas.push(Rect {
                                x: area.x + (col as u16 * width),
                                y: area.y + (row as u16 * height),
                                width,
                                height,
                            });
                        }
                    }
                }
                
                areas
            }
        }
    }
}

struct Terminal {
    pty: Box<dyn portable_pty::MasterPty>,
    buffer: VecDeque<String>,
    neovim_instance: Option<Arc<RwLock<NeovimInstance>>>,
    title: String,
    working_dir: PathBuf,
}

impl Terminal {
    fn new_with_neovim(bridge: Arc<NeovimBridge>) -> Result<Self> {
        let pty_system = portable_pty::native_pty_system();
        
        let pty_size = PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        };
        
        let mut cmd = CommandBuilder::new("bash");
        cmd.arg("-c");
        cmd.arg("nvim");
        
        let working_dir = std::env::current_dir()?;
        cmd.cwd(&working_dir);
        
        let pair = pty_system.openpty(pty_size)?;
        let child = pair.slave.spawn_command(cmd)?;
        
        // Create Neovim instance
        let neovim_instance = tokio::runtime::Handle::current()
            .block_on(bridge.create_instance()).ok();
        
        Ok(Self {
            pty: pair.master,
            buffer: VecDeque::with_capacity(1000),
            neovim_instance,
            title: "Neovim Terminal".to_string(),
            working_dir,
        })
    }
    
    async fn handle_key_event(&mut self, key: KeyEvent) -> Result<()> {
        // Convert key event to terminal input
        let input = self.key_to_terminal_input(key);
        
        if let Some(ref nvim) = self.neovim_instance {
            // Send to Neovim
            nvim.write().await.handle_input(&input).await?;
        } else {
            // Send to PTY
            self.pty.write_all(input.as_bytes())?;
        }
        
        // Read output
        self.read_output()?;
        
        Ok(())
    }
    
    fn key_to_terminal_input(&self, key: KeyEvent) -> String {
        match key.code {
            KeyCode::Char(c) => {
                if key.modifiers.contains(KeyModifiers::CONTROL) {
                    format!("\x{:02x}", c as u8 - b'a' + 1)
                } else if key.modifiers.contains(KeyModifiers::ALT) {
                    format!("\x1b{}", c)
                } else {
                    c.to_string()
                }
            }
            KeyCode::Enter => "\r".to_string(),
            KeyCode::Tab => "\t".to_string(),
            KeyCode::Backspace => "\x7f".to_string(),
            KeyCode::Esc => "\x1b".to_string(),
            KeyCode::Up => "\x1b[A".to_string(),
            KeyCode::Down => "\x1b[B".to_string(),
            KeyCode::Right => "\x1b[C".to_string(),
            KeyCode::Left => "\x1b[D".to_string(),
            KeyCode::Home => "\x1b[H".to_string(),
            KeyCode::End => "\x1b[F".to_string(),
            KeyCode::PageUp => "\x1b[5~".to_string(),
            KeyCode::PageDown => "\x1b[6~".to_string(),
            KeyCode::Delete => "\x1b[3~".to_string(),
            KeyCode::Insert => "\x1b[2~".to_string(),
            KeyCode::F(n) => format!("\x1b[{};2~", 10 + n),
            _ => String::new(),
        }
    }
    
    fn read_output(&mut self) -> Result<()> {
        let reader = self.pty.try_clone_reader()?;
        let mut buf_reader = BufReader::new(reader);
        let mut line = String::new();
        
        while buf_reader.read_line(&mut line)? > 0 {
            self.buffer.push_back(line.clone());
            if self.buffer.len() > 1000 {
                self.buffer.pop_front();
            }
            line.clear();
        }
        
        Ok(())
    }
    
    fn render(&self, area: Rect, buf: &mut Buffer, is_active: bool) {
        let block = Block::default()
            .title(format!(" {} ", self.title))
            .borders(Borders::ALL)
            .border_style(Style::default().fg(if is_active {
                Color::Cyan
            } else {
                Color::Gray
            }));
        
        let inner = block.inner(area);
        block.render(area, buf);
        
        // Render terminal content
        let lines: Vec<String> = self.buffer
            .iter()
            .rev()
            .take(inner.height as usize)
            .rev()
            .cloned()
            .collect();
        
        for (i, line) in lines.iter().enumerate() {
            if i < inner.height as usize {
                let y = inner.y + i as u16;
                let truncated = if line.len() > inner.width as usize {
                    &line[..inner.width as usize]
                } else {
                    line
                };
                
                for (x_offset, ch) in truncated.chars().enumerate() {
                    if x_offset < inner.width as usize {
                        buf.get_mut(inner.x + x_offset as u16, y)
                            .set_char(ch)
                            .set_style(Style::default().fg(Color::White));
                    }
                }
            }
        }
    }
}

#[derive(Debug, Clone)]
enum TerminalLayout {
    Single,
    HSplit(usize),
    VSplit(usize),
    Grid(usize, usize),
}