/// Components module - TUI components for Katalyst

pub mod terminal_pane;
pub mod protocol_panel;

// Re-export commonly used components
pub use terminal_pane::TerminalPane;
pub use protocol_panel::{ProtocolPanel, PanelMode};

// Additional component modules can be added here as the TUI grows
// pub mod editor;
// pub mod file_explorer;
// pub mod search_panel;
// pub mod statusbar;
// pub mod tabbar;
// pub mod command_palette;
// pub mod notifications;