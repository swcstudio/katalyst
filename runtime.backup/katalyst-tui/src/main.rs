use anyhow::Result;
use crossterm::{
    event::{self, DisableMouseCapture, EnableMouseCapture, Event, KeyCode, KeyModifiers},
    execute,
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
};
use ratatui::{
    backend::CrosstermBackend,
    Terminal,
};
use std::{
    io,
    sync::Arc,
    time::Duration,
};
use tokio::sync::RwLock;

mod app;
mod components;
mod config;
mod events;
mod keybindings;
mod layout;
mod lsp;
mod notifications;
mod search;
mod state;
mod themes;
mod ui;
mod utils;
mod wasm;

use app::App;
use config::Config;
use events::EventHandler;

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    // Load configuration
    let config = Config::load()?;
    
    // Setup terminal
    enable_raw_mode()?;
    let mut stdout = io::stdout();
    execute!(stdout, EnterAlternateScreen, EnableMouseCapture)?;
    
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;
    terminal.clear()?;

    // Create application
    let app = Arc::new(RwLock::new(App::new(config).await?));
    
    // Setup event handler
    let event_handler = EventHandler::new(Duration::from_millis(16));
    
    // Run application
    let res = run_app(&mut terminal, app, event_handler).await;

    // Restore terminal
    disable_raw_mode()?;
    execute!(
        terminal.backend_mut(),
        LeaveAlternateScreen,
        DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    if let Err(err) = res {
        eprintln!("Error: {err:?}");
    }

    Ok(())
}

async fn run_app(
    terminal: &mut Terminal<CrosstermBackend<io::Stdout>>,
    app: Arc<RwLock<App>>,
    mut event_handler: EventHandler,
) -> Result<()> {
    loop {
        // Draw UI
        {
            let app = app.read().await;
            terminal.draw(|f| ui::draw(f, &app))?;
        }

        // Handle events
        match event_handler.next().await? {
            Event::Key(key_event) => {
                let mut app = app.write().await;
                
                // Global keybindings
                if key_event.modifiers.contains(KeyModifiers::CONTROL) {
                    match key_event.code {
                        KeyCode::Char('q') => return Ok(()),
                        KeyCode::Char('c') if key_event.modifiers.contains(KeyModifiers::SHIFT) => {
                            return Ok(());
                        }
                        _ => {}
                    }
                }
                
                // Pass to app for handling
                app.handle_key_event(key_event).await?;
            }
            Event::Mouse(mouse_event) => {
                let mut app = app.write().await;
                app.handle_mouse_event(mouse_event).await?;
            }
            Event::Resize(width, height) => {
                let mut app = app.write().await;
                app.handle_resize(width, height).await?;
            }
            _ => {}
        }

        // Check if should quit
        if app.read().await.should_quit() {
            return Ok(());
        }
    }
}