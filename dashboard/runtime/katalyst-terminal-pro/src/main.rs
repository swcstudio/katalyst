use anyhow::Result;
use clap::{Parser, Subcommand};
use katalyst_terminal_pro::{
    KatalystTerminalPro, TerminalConfig,
    app::{KatalystApp, AppConfig},
};
use std::path::PathBuf;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Parser)]
#[command(name = "katalyst")]
#[command(about = "High-performance terminal with DevContainer support", long_about = None)]
struct Cli {
    /// Configuration file path
    #[arg(short, long, value_name = "FILE")]
    config: Option<PathBuf>,
    
    /// Start in fullscreen mode
    #[arg(short = 'f', long)]
    fullscreen: bool,
    
    /// Enable debug logging
    #[arg(short = 'd', long)]
    debug: bool,
    
    /// Server mode (headless)
    #[arg(short = 's', long)]
    server: bool,
    
    /// Mobile mode with touch optimizations
    #[arg(short = 'm', long)]
    mobile: bool,
    
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Connect to a remote server
    Connect {
        /// Server URL or SSH connection string
        #[arg(value_name = "URL")]
        server: String,
        
        /// Use specific SSH key
        #[arg(short = 'i', long)]
        identity: Option<PathBuf>,
    },
    
    /// Manage SSH keys
    Keys {
        #[command(subcommand)]
        action: KeyAction,
    },
    
    /// Manage server configurations
    Servers {
        #[command(subcommand)]
        action: ServerAction,
    },
    
    /// Open a repository with DevContainer
    Open {
        /// Repository path or URL
        #[arg(value_name = "REPO")]
        repo: String,
        
        /// Clone if repository doesn't exist locally
        #[arg(short = 'c', long)]
        clone: bool,
    },
    
    /// Start the terminal UI
    UI {
        /// UI theme (dark, light, auto)
        #[arg(short = 't', long, default_value = "auto")]
        theme: String,
        
        /// UI scale factor for high DPI displays
        #[arg(long, default_value = "1.0")]
        scale: f32,
    },
}

#[derive(Subcommand)]
enum KeyAction {
    /// Generate a new SSH key pair
    Generate {
        /// Key name
        #[arg(value_name = "NAME")]
        name: String,
        
        /// Key type (ed25519, rsa)
        #[arg(short = 't', long, default_value = "ed25519")]
        key_type: String,
    },
    
    /// List all SSH keys
    List,
    
    /// Add an existing SSH key
    Add {
        /// Path to private key
        #[arg(value_name = "PATH")]
        path: PathBuf,
    },
    
    /// Remove an SSH key
    Remove {
        /// Key name
        #[arg(value_name = "NAME")]
        name: String,
    },
}

#[derive(Subcommand)]
enum ServerAction {
    /// Add a server configuration
    Add {
        /// Server name
        #[arg(value_name = "NAME")]
        name: String,
        
        /// Server URL or SSH connection string
        #[arg(value_name = "URL")]
        url: String,
        
        /// Default SSH key to use
        #[arg(short = 'i', long)]
        identity: Option<String>,
    },
    
    /// List all configured servers
    List,
    
    /// Remove a server configuration
    Remove {
        /// Server name
        #[arg(value_name = "NAME")]
        name: String,
    },
    
    /// Test connection to a server
    Test {
        /// Server name
        #[arg(value_name = "NAME")]
        name: String,
    },
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();
    
    // Initialize logging
    init_logging(cli.debug)?;
    
    // Load configuration
    let config = load_config(cli.config).await?;
    
    // Handle commands
    match cli.command {
        Some(Commands::Connect { server, identity }) => {
            connect_to_server(&server, identity, &config).await?;
        }
        
        Some(Commands::Keys { action }) => {
            handle_key_action(action, &config).await?;
        }
        
        Some(Commands::Servers { action }) => {
            handle_server_action(action, &config).await?;
        }
        
        Some(Commands::Open { repo, clone }) => {
            open_repository(&repo, clone, &config).await?;
        }
        
        Some(Commands::UI { theme, scale }) => {
            launch_ui(&theme, scale, cli.mobile, &config).await?;
        }
        
        None => {
            // Default action: launch the terminal app
            launch_terminal_app(cli.fullscreen, cli.server, cli.mobile, config).await?;
        }
    }
    
    Ok(())
}

async fn launch_terminal_app(
    fullscreen: bool,
    server_mode: bool,
    mobile_mode: bool,
    config: AppConfig,
) -> Result<()> {
    tracing::info!("Starting Katalyst Terminal Pro");
    
    if server_mode {
        // Run in headless server mode
        tracing::info!("Running in server mode");
        
        let terminal = KatalystTerminalPro::new(config.terminal_config).await?;
        terminal.start().await?;
        
        // Keep server running
        tokio::signal::ctrl_c().await?;
        tracing::info!("Shutting down server");
    } else {
        // Launch the full GUI application
        let mut app = KatalystApp::new(config).await?;
        
        if mobile_mode {
            app.enable_mobile_mode();
        }
        
        if fullscreen {
            app.set_fullscreen(true);
        }
        
        app.run().await?;
    }
    
    Ok(())
}

async fn connect_to_server(
    server: &str,
    identity: Option<PathBuf>,
    config: &AppConfig,
) -> Result<()> {
    tracing::info!("Connecting to server: {}", server);
    
    let mut app = KatalystApp::new(config.clone()).await?;
    
    // Load SSH key if specified
    if let Some(key_path) = identity {
        app.ssh_manager.load_key(&key_path).await?;
    }
    
    // Connect to server
    app.connect_to_server(server).await?;
    
    // Run the app
    app.run().await?;
    
    Ok(())
}

async fn handle_key_action(action: KeyAction, config: &AppConfig) -> Result<()> {
    let app = KatalystApp::new(config.clone()).await?;
    
    match action {
        KeyAction::Generate { name, key_type } => {
            let key_path = app.ssh_manager.generate_key(&name, &key_type).await?;
            println!("Generated SSH key: {}", key_path.display());
            println!("Public key saved to: {}.pub", key_path.display());
        }
        
        KeyAction::List => {
            let keys = app.ssh_manager.list_keys().await?;
            
            if keys.is_empty() {
                println!("No SSH keys configured");
            } else {
                println!("SSH Keys:");
                for key in keys {
                    println!("  - {} ({})", key.name, key.key_type);
                    if let Some(fingerprint) = key.fingerprint {
                        println!("    Fingerprint: {}", fingerprint);
                    }
                }
            }
        }
        
        KeyAction::Add { path } => {
            let key_info = app.ssh_manager.add_key(&path).await?;
            println!("Added SSH key: {}", key_info.name);
        }
        
        KeyAction::Remove { name } => {
            app.ssh_manager.remove_key(&name).await?;
            println!("Removed SSH key: {}", name);
        }
    }
    
    Ok(())
}

async fn handle_server_action(action: ServerAction, config: &AppConfig) -> Result<()> {
    let app = KatalystApp::new(config.clone()).await?;
    
    match action {
        ServerAction::Add { name, url, identity } => {
            app.server_store.add_server(&name, &url, identity.as_deref()).await?;
            println!("Added server configuration: {}", name);
        }
        
        ServerAction::List => {
            let servers = app.server_store.list_servers().await?;
            
            if servers.is_empty() {
                println!("No servers configured");
            } else {
                println!("Configured Servers:");
                for server in servers {
                    println!("  - {} ({})", server.name, server.url);
                    if let Some(key) = server.default_key {
                        println!("    Default key: {}", key);
                    }
                    if let Some(last) = server.last_connected {
                        println!("    Last connected: {}", last);
                    }
                }
            }
        }
        
        ServerAction::Remove { name } => {
            app.server_store.remove_server(&name).await?;
            println!("Removed server: {}", name);
        }
        
        ServerAction::Test { name } => {
            println!("Testing connection to: {}", name);
            
            match app.server_store.test_connection(&name).await {
                Ok(latency) => {
                    println!("✓ Connection successful ({}ms)", latency);
                }
                Err(e) => {
                    println!("✗ Connection failed: {}", e);
                }
            }
        }
    }
    
    Ok(())
}

async fn open_repository(repo: &str, clone: bool, config: &AppConfig) -> Result<()> {
    tracing::info!("Opening repository: {}", repo);
    
    let mut app = KatalystApp::new(config.clone()).await?;
    
    // Check if we need to clone
    let repo_path = if repo.starts_with("http") || repo.starts_with("git@") {
        if clone {
            app.clone_repository(repo).await?
        } else {
            return Err(anyhow::anyhow!("Repository is remote. Use --clone to clone it first"));
        }
    } else {
        PathBuf::from(repo)
    };
    
    // Open with DevContainer
    app.open_with_devcontainer(&repo_path).await?;
    
    // Run the app
    app.run().await?;
    
    Ok(())
}

async fn launch_ui(theme: &str, scale: f32, mobile: bool, config: &AppConfig) -> Result<()> {
    let mut app = KatalystApp::new(config.clone()).await?;
    
    // Configure UI
    app.set_theme(theme)?;
    app.set_scale_factor(scale);
    
    if mobile {
        app.enable_mobile_mode();
    }
    
    // Run the app
    app.run().await?;
    
    Ok(())
}

async fn load_config(config_path: Option<PathBuf>) -> Result<AppConfig> {
    let path = config_path.unwrap_or_else(|| {
        dirs::config_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("katalyst")
            .join("config.toml")
    });
    
    if path.exists() {
        let content = tokio::fs::read_to_string(&path).await?;
        Ok(toml::from_str(&content)?)
    } else {
        // Create default config
        let config = AppConfig::default();
        
        // Ensure directory exists
        if let Some(parent) = path.parent() {
            tokio::fs::create_dir_all(parent).await?;
        }
        
        // Write default config
        let content = toml::to_string_pretty(&config)?;
        tokio::fs::write(&path, content).await?;
        
        Ok(config)
    }
}

fn init_logging(debug: bool) -> Result<()> {
    let filter = if debug {
        "katalyst=debug,info"
    } else {
        "katalyst=info,warn"
    };
    
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| filter.into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();
    
    Ok(())
}