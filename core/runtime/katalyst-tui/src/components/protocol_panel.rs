/// Protocol Panel - TUI component for Context Engineering protocol execution and visualization
/// 
/// This component provides a visual interface for:
/// - Selecting and executing protocol shells
/// - Monitoring symbolic residue in real-time
/// - Visualizing execution traces and field states

use anyhow::Result;
use crossterm::event::{KeyCode, KeyEvent, KeyModifiers};
use ratatui::{
    buffer::Buffer,
    layout::{Alignment, Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style},
    text::{Line, Span, Text},
    widgets::{
        Block, Borders, Clear, Gauge, List, ListItem, ListState, 
        Paragraph, Scrollbar, ScrollbarOrientation, ScrollbarState, Tabs, Widget, Wrap
    },
    Frame,
};
use std::sync::Arc;
use tokio::sync::RwLock;
use serde_json::Value;
use std::collections::HashMap;

use katalyst_wasm_runtime::{
    protocol_shell_v1::{ProtocolShellV1, ProtocolTemplatesV1},
    symbolic_residue_v1::{SymbolicResidueV1, ResidueState},
    protocol_runtime::{ProtocolRuntime, ExecutionResult},
};

/// Panel display mode
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PanelMode {
    ProtocolList,
    ExecutionView,
    ResidueMonitor,
    TraceViewer,
}

/// Protocol panel state
pub struct ProtocolPanel {
    runtime: Arc<RwLock<ProtocolRuntime>>,
    mode: PanelMode,
    
    // Protocol list state
    protocols: Vec<(String, ProtocolShellV1)>,
    protocol_list_state: ListState,
    
    // Execution state
    current_execution: Option<ExecutionResult>,
    execution_logs: Vec<String>,
    log_scroll: u16,
    
    // Residue visualization
    residue_data: Vec<ResidueVisualization>,
    residue_scroll: u16,
    
    // Input state
    input_buffer: String,
    input_params: HashMap<String, Value>,
    
    // UI state
    focused: bool,
    show_help: bool,
}

#[derive(Clone)]
struct ResidueVisualization {
    id: String,
    content: String,
    strength: f64,
    state: ResidueState,
    interactions: usize,
}

impl ProtocolPanel {
    pub fn new() -> Result<Self> {
        let runtime = Arc::new(RwLock::new(ProtocolRuntime::new()));
        
        // Initialize with template protocols
        let mut protocols = vec![
            ("reasoning_systematic".to_string(), ProtocolTemplatesV1::reasoning_systematic()),
            ("code_analyze".to_string(), ProtocolTemplatesV1::code_analyze()),
            ("workflow_tdd".to_string(), ProtocolTemplatesV1::workflow_tdd()),
        ];
        
        let mut protocol_list_state = ListState::default();
        protocol_list_state.select(Some(0));
        
        Ok(Self {
            runtime,
            mode: PanelMode::ProtocolList,
            protocols,
            protocol_list_state,
            current_execution: None,
            execution_logs: Vec::new(),
            log_scroll: 0,
            residue_data: Vec::new(),
            residue_scroll: 0,
            input_buffer: String::new(),
            input_params: HashMap::new(),
            focused: false,
            show_help: false,
        })
    }
    
    pub async fn handle_key_event(&mut self, key: KeyEvent) -> Result<()> {
        if key.modifiers.contains(KeyModifiers::CONTROL) {
            match key.code {
                KeyCode::Char('p') => self.toggle_mode(),
                KeyCode::Char('h') => self.show_help = !self.show_help,
                KeyCode::Char('r') => self.refresh_residue_data().await?,
                KeyCode::Char('c') => self.clear_execution_logs(),
                _ => {}
            }
            return Ok(());
        }
        
        match self.mode {
            PanelMode::ProtocolList => self.handle_protocol_list_keys(key).await?,
            PanelMode::ExecutionView => self.handle_execution_view_keys(key),
            PanelMode::ResidueMonitor => self.handle_residue_monitor_keys(key),
            PanelMode::TraceViewer => self.handle_trace_viewer_keys(key),
        }
        
        Ok(())
    }
    
    async fn handle_protocol_list_keys(&mut self, key: KeyEvent) -> Result<()> {
        match key.code {
            KeyCode::Up | KeyCode::Char('k') => {
                self.move_selection(-1);
            }
            KeyCode::Down | KeyCode::Char('j') => {
                self.move_selection(1);
            }
            KeyCode::Enter => {
                self.execute_selected_protocol().await?;
            }
            KeyCode::Char('i') => {
                // Start input mode for parameters
                self.focused = true;
            }
            KeyCode::Tab => {
                self.mode = PanelMode::ExecutionView;
            }
            _ => {}
        }
        Ok(())
    }
    
    fn handle_execution_view_keys(&mut self, key: KeyEvent) {
        match key.code {
            KeyCode::Up | KeyCode::Char('k') => {
                if self.log_scroll > 0 {
                    self.log_scroll -= 1;
                }
            }
            KeyCode::Down | KeyCode::Char('j') => {
                if self.log_scroll < self.execution_logs.len() as u16 {
                    self.log_scroll += 1;
                }
            }
            KeyCode::Tab => {
                self.mode = PanelMode::ResidueMonitor;
            }
            _ => {}
        }
    }
    
    fn handle_residue_monitor_keys(&mut self, key: KeyEvent) {
        match key.code {
            KeyCode::Up | KeyCode::Char('k') => {
                if self.residue_scroll > 0 {
                    self.residue_scroll -= 1;
                }
            }
            KeyCode::Down | KeyCode::Char('j') => {
                if self.residue_scroll < self.residue_data.len() as u16 {
                    self.residue_scroll += 1;
                }
            }
            KeyCode::Tab => {
                self.mode = PanelMode::TraceViewer;
            }
            _ => {}
        }
    }
    
    fn handle_trace_viewer_keys(&mut self, key: KeyEvent) {
        match key.code {
            KeyCode::Tab => {
                self.mode = PanelMode::ProtocolList;
            }
            _ => {}
        }
    }
    
    fn toggle_mode(&mut self) {
        self.mode = match self.mode {
            PanelMode::ProtocolList => PanelMode::ExecutionView,
            PanelMode::ExecutionView => PanelMode::ResidueMonitor,
            PanelMode::ResidueMonitor => PanelMode::TraceViewer,
            PanelMode::TraceViewer => PanelMode::ProtocolList,
        };
    }
    
    fn move_selection(&mut self, delta: i32) {
        let len = self.protocols.len();
        if len == 0 {
            return;
        }
        
        let current = self.protocol_list_state.selected().unwrap_or(0);
        let new_index = if delta > 0 {
            (current + delta as usize) % len
        } else {
            (current as i32 + delta).rem_euclid(len as i32) as usize
        };
        
        self.protocol_list_state.select(Some(new_index));
    }
    
    async fn execute_selected_protocol(&mut self) -> Result<()> {
        if let Some(selected) = self.protocol_list_state.selected() {
            if let Some((id, protocol)) = self.protocols.get(selected) {
                self.execution_logs.push(format!("Executing protocol: {}", id));
                
                // Register protocol in runtime
                self.runtime.write().await.register_protocol(id.clone(), protocol.clone()).await?;
                
                // Prepare default inputs based on protocol requirements
                let mut inputs = HashMap::new();
                for (key, param) in &protocol.input {
                    // Use default values or empty values
                    inputs.insert(key.clone(), Value::String(format!("default_{}", key)));
                }
                
                // Merge with user-provided inputs
                for (key, value) in &self.input_params {
                    inputs.insert(key.clone(), value.clone());
                }
                
                // Execute protocol
                match self.runtime.read().await.execute_protocol(id, inputs).await {
                    Ok(result) => {
                        self.current_execution = Some(result.clone());
                        self.execution_logs.push(format!("✓ Execution successful in {}ms", result.execution_time_ms));
                        
                        // Log outputs
                        for (key, value) in &result.outputs {
                            self.execution_logs.push(format!("  Output {}: {:?}", key, value));
                        }
                        
                        // Log residue generated
                        if !result.residue_generated.is_empty() {
                            self.execution_logs.push(format!("  Generated {} residue(s)", result.residue_generated.len()));
                        }
                        
                        // Update residue visualization
                        self.refresh_residue_data().await?;
                        
                        // Switch to execution view
                        self.mode = PanelMode::ExecutionView;
                    }
                    Err(e) => {
                        self.execution_logs.push(format!("✗ Execution failed: {}", e));
                    }
                }
            }
        }
        Ok(())
    }
    
    async fn refresh_residue_data(&mut self) -> Result<()> {
        let residue_json = self.runtime.read().await.get_residue_state().await?;
        
        // Parse residue state and convert to visualization format
        if let Ok(residue_state) = serde_json::from_str::<SymbolicResidueV1>(&residue_json) {
            self.residue_data = residue_state.residue_tracking.tracked_residues
                .into_iter()
                .map(|r| ResidueVisualization {
                    id: r.id.clone(),
                    content: r.content.clone(),
                    strength: r.strength,
                    state: r.state,
                    interactions: r.interactions.len(),
                })
                .collect();
        }
        
        Ok(())
    }
    
    fn clear_execution_logs(&mut self) {
        self.execution_logs.clear();
        self.log_scroll = 0;
    }
    
    pub fn render(&mut self, f: &mut Frame, area: Rect) {
        // Create layout
        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Length(3),  // Header
                Constraint::Min(10),    // Main content
                Constraint::Length(3),  // Status bar
            ])
            .split(area);
        
        // Render header
        self.render_header(f, chunks[0]);
        
        // Render main content based on mode
        match self.mode {
            PanelMode::ProtocolList => self.render_protocol_list(f, chunks[1]),
            PanelMode::ExecutionView => self.render_execution_view(f, chunks[1]),
            PanelMode::ResidueMonitor => self.render_residue_monitor(f, chunks[1]),
            PanelMode::TraceViewer => self.render_trace_viewer(f, chunks[1]),
        }
        
        // Render status bar
        self.render_status_bar(f, chunks[2]);
        
        // Render help overlay if active
        if self.show_help {
            self.render_help_overlay(f, area);
        }
    }
    
    fn render_header(&self, f: &mut Frame, area: Rect) {
        let titles = vec!["Protocols", "Execution", "Residue", "Trace"];
        let selected = match self.mode {
            PanelMode::ProtocolList => 0,
            PanelMode::ExecutionView => 1,
            PanelMode::ResidueMonitor => 2,
            PanelMode::TraceViewer => 3,
        };
        
        let tabs = Tabs::new(titles)
            .block(Block::default().borders(Borders::ALL).title("Context Engineering"))
            .select(selected)
            .style(Style::default().fg(Color::Cyan))
            .highlight_style(Style::default().add_modifier(Modifier::BOLD).bg(Color::Black));
        
        f.render_widget(tabs, area);
    }
    
    fn render_protocol_list(&mut self, f: &mut Frame, area: Rect) {
        let items: Vec<ListItem> = self.protocols
            .iter()
            .map(|(id, protocol)| {
                let content = vec![
                    Line::from(vec![
                        Span::styled(id, Style::default().fg(Color::Yellow)),
                    ]),
                    Line::from(vec![
                        Span::raw("  "),
                        Span::styled(&protocol.intent, Style::default().fg(Color::Gray)),
                    ]),
                ];
                ListItem::new(content)
            })
            .collect();
        
        let list = List::new(items)
            .block(Block::default().borders(Borders::ALL).title("Available Protocols"))
            .style(Style::default().fg(Color::White))
            .highlight_style(Style::default().add_modifier(Modifier::BOLD).bg(Color::DarkGray))
            .highlight_symbol("▶ ");
        
        f.render_stateful_widget(list, area, &mut self.protocol_list_state);
    }
    
    fn render_execution_view(&self, f: &mut Frame, area: Rect) {
        let logs_text: Vec<Line> = self.execution_logs
            .iter()
            .map(|log| {
                if log.starts_with("✓") {
                    Line::from(vec![Span::styled(log, Style::default().fg(Color::Green))])
                } else if log.starts_with("✗") {
                    Line::from(vec![Span::styled(log, Style::default().fg(Color::Red))])
                } else if log.starts_with("  ") {
                    Line::from(vec![Span::styled(log, Style::default().fg(Color::Gray))])
                } else {
                    Line::from(vec![Span::styled(log, Style::default().fg(Color::White))])
                }
            })
            .collect();
        
        let paragraph = Paragraph::new(logs_text)
            .block(Block::default().borders(Borders::ALL).title("Execution Logs"))
            .style(Style::default().fg(Color::White))
            .scroll((self.log_scroll, 0))
            .wrap(Wrap { trim: true });
        
        f.render_widget(paragraph, area);
    }
    
    fn render_residue_monitor(&self, f: &mut Frame, area: Rect) {
        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Min(10),    // Residue list
                Constraint::Length(5),  // Metrics
            ])
            .split(area);
        
        // Render residue list
        let items: Vec<ListItem> = self.residue_data
            .iter()
            .map(|r| {
                let state_color = match r.state {
                    ResidueState::Surfaced => Color::Cyan,
                    ResidueState::Echo => Color::Blue,
                    ResidueState::Integrated => Color::Green,
                    ResidueState::Shadow => Color::DarkGray,
                    ResidueState::Orphaned => Color::Red,
                };
                
                let strength_bar = "█".repeat((r.strength * 10.0) as usize);
                let empty_bar = "░".repeat(10 - (r.strength * 10.0) as usize);
                
                let content = vec![
                    Line::from(vec![
                        Span::styled(format!("{:?}", r.state), Style::default().fg(state_color)),
                        Span::raw(" "),
                        Span::styled(&r.id, Style::default().fg(Color::Yellow)),
                    ]),
                    Line::from(vec![
                        Span::raw("  "),
                        Span::styled(format!("[{}{}]", strength_bar, empty_bar), 
                            Style::default().fg(Color::Magenta)),
                        Span::raw(format!(" {:.2} ", r.strength)),
                        Span::styled(&r.content, Style::default().fg(Color::Gray)),
                    ]),
                ];
                ListItem::new(content)
            })
            .collect();
        
        let list = List::new(items)
            .block(Block::default().borders(Borders::ALL).title("Symbolic Residue"))
            .style(Style::default().fg(Color::White));
        
        f.render_widget(list, chunks[0]);
        
        // Render metrics
        if let Some(execution) = &self.current_execution {
            let total_residue = self.residue_data.len();
            let avg_strength: f64 = if total_residue > 0 {
                self.residue_data.iter().map(|r| r.strength).sum::<f64>() / total_residue as f64
            } else {
                0.0
            };
            
            let metrics_text = vec![
                Line::from(vec![
                    Span::raw("Total Residue: "),
                    Span::styled(format!("{}", total_residue), Style::default().fg(Color::Cyan)),
                    Span::raw("  |  "),
                    Span::raw("Avg Strength: "),
                    Span::styled(format!("{:.2}", avg_strength), Style::default().fg(Color::Yellow)),
                ]),
                Line::from(vec![
                    Span::raw("Generated: "),
                    Span::styled(format!("{}", execution.residue_generated.len()), 
                        Style::default().fg(Color::Green)),
                    Span::raw("  |  "),
                    Span::raw("Execution Time: "),
                    Span::styled(format!("{}ms", execution.execution_time_ms), 
                        Style::default().fg(Color::Magenta)),
                ]),
            ];
            
            let paragraph = Paragraph::new(metrics_text)
                .block(Block::default().borders(Borders::ALL).title("Metrics"))
                .style(Style::default().fg(Color::White));
            
            f.render_widget(paragraph, chunks[1]);
        }
    }
    
    fn render_trace_viewer(&self, f: &mut Frame, area: Rect) {
        if let Some(execution) = &self.current_execution {
            let trace_items: Vec<ListItem> = execution.trace
                .iter()
                .map(|trace| {
                    let impact_text = if let Some(impact) = &trace.residue_impact {
                        format!(" [S:{} I:{} E:{}]", 
                            impact.surfaced, impact.integrated, impact.echoes_created)
                    } else {
                        String::new()
                    };
                    
                    let content = vec![
                        Line::from(vec![
                            Span::styled(&trace.operation, Style::default().fg(Color::Yellow)),
                            Span::styled(format!(" ({}ms)", trace.duration_ms), 
                                Style::default().fg(Color::Cyan)),
                            Span::styled(impact_text, Style::default().fg(Color::Magenta)),
                        ]),
                    ];
                    ListItem::new(content)
                })
                .collect();
            
            let list = List::new(trace_items)
                .block(Block::default().borders(Borders::ALL).title("Execution Trace"))
                .style(Style::default().fg(Color::White));
            
            f.render_widget(list, area);
        } else {
            let paragraph = Paragraph::new("No execution trace available")
                .block(Block::default().borders(Borders::ALL).title("Execution Trace"))
                .style(Style::default().fg(Color::DarkGray))
                .alignment(Alignment::Center);
            
            f.render_widget(paragraph, area);
        }
    }
    
    fn render_status_bar(&self, f: &mut Frame, area: Rect) {
        let mode_text = format!("Mode: {:?}", self.mode);
        let help_text = if self.show_help { "Help: ON" } else { "Ctrl+H: Help" };
        
        let status = Paragraph::new(Line::from(vec![
            Span::styled(mode_text, Style::default().fg(Color::Cyan)),
            Span::raw(" | "),
            Span::raw("Tab: Switch Mode | "),
            Span::raw("Ctrl+P: Toggle Panel | "),
            Span::styled(help_text, Style::default().fg(Color::Yellow)),
        ]))
        .block(Block::default().borders(Borders::ALL))
        .style(Style::default().fg(Color::White));
        
        f.render_widget(status, area);
    }
    
    fn render_help_overlay(&self, f: &mut Frame, area: Rect) {
        let help_text = vec![
            Line::from("Protocol Panel Help"),
            Line::from(""),
            Line::from("Navigation:"),
            Line::from("  Tab         - Switch between modes"),
            Line::from("  ↑/↓, j/k   - Navigate lists"),
            Line::from("  Enter      - Execute selected protocol"),
            Line::from(""),
            Line::from("Controls:"),
            Line::from("  Ctrl+P     - Toggle panel mode"),
            Line::from("  Ctrl+R     - Refresh residue data"),
            Line::from("  Ctrl+C     - Clear execution logs"),
            Line::from("  Ctrl+H     - Toggle this help"),
            Line::from(""),
            Line::from("Modes:"),
            Line::from("  Protocol List  - Browse available protocols"),
            Line::from("  Execution View - View execution logs"),
            Line::from("  Residue Monitor - Track symbolic residue"),
            Line::from("  Trace Viewer   - Analyze execution trace"),
        ];
        
        let help = Paragraph::new(help_text)
            .block(Block::default()
                .borders(Borders::ALL)
                .title("Help")
                .style(Style::default().bg(Color::Black)))
            .style(Style::default().fg(Color::White))
            .alignment(Alignment::Left);
        
        // Center the help overlay
        let help_area = Rect {
            x: area.x + area.width / 4,
            y: area.y + area.height / 4,
            width: area.width / 2,
            height: area.height / 2,
        };
        
        f.render_widget(Clear, help_area);
        f.render_widget(help, help_area);
    }
}