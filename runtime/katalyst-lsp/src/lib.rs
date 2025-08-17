use anyhow::Result;
use dashmap::DashMap;
use lsp_types::*;
use std::{
    collections::HashMap,
    path::PathBuf,
    process::Stdio,
    sync::Arc,
};
use tokio::{
    io::{AsyncBufReadExt, AsyncWriteExt, BufReader},
    process::{Child, Command},
    sync::RwLock,
};
use tracing::{error, info, warn};

pub mod config;
pub mod client;
pub mod handlers;
pub mod transport;

use config::LspConfig;
use client::LspClient;

#[derive(Debug)]
pub struct LspManager {
    servers: Arc<DashMap<String, Arc<RwLock<LanguageServer>>>>,
    configs: HashMap<String, LspConfig>,
}

impl LspManager {
    pub async fn new(workspace_root: &PathBuf) -> Result<Self> {
        let configs = Self::load_lsp_configs()?;
        let servers = Arc::new(DashMap::new());
        
        let mut manager = Self { servers, configs };
        manager.initialize_all_servers(workspace_root).await?;
        
        Ok(manager)
    }
    
    fn load_lsp_configs() -> Result<HashMap<String, LspConfig>> {
        let mut configs = HashMap::new();
        
        // Rust
        configs.insert("rust".to_string(), LspConfig {
            name: "rust-analyzer".to_string(),
            command: "rust-analyzer".to_string(),
            args: vec![],
            file_extensions: vec!["rs".to_string()],
            root_markers: vec!["Cargo.toml".to_string()],
            initialization_options: Some(serde_json::json!({
                "cargo": {
                    "features": "all",
                    "buildScripts": {
                        "enable": true
                    }
                },
                "procMacro": {
                    "enable": true
                },
                "diagnostics": {
                    "enable": true,
                    "experimental": {
                        "enable": true
                    }
                },
                "inlayHints": {
                    "enable": true
                }
            })),
        });
        
        // TypeScript/JavaScript
        configs.insert("typescript".to_string(), LspConfig {
            name: "typescript-language-server".to_string(),
            command: "typescript-language-server".to_string(),
            args: vec!["--stdio".to_string()],
            file_extensions: vec!["ts".to_string(), "tsx".to_string(), "js".to_string(), "jsx".to_string()],
            root_markers: vec!["package.json".to_string(), "tsconfig.json".to_string()],
            initialization_options: Some(serde_json::json!({
                "preferences": {
                    "includeInlayParameterNameHints": "all",
                    "includeInlayFunctionParameterTypeHints": true,
                    "includeInlayVariableTypeHints": true
                }
            })),
        });
        
        // Python
        configs.insert("python".to_string(), LspConfig {
            name: "pylsp".to_string(),
            command: "pylsp".to_string(),
            args: vec![],
            file_extensions: vec!["py".to_string(), "pyi".to_string()],
            root_markers: vec!["setup.py".to_string(), "pyproject.toml".to_string(), "requirements.txt".to_string()],
            initialization_options: Some(serde_json::json!({
                "pylsp": {
                    "plugins": {
                        "pycodestyle": {"enabled": true},
                        "pyflakes": {"enabled": true},
                        "pylint": {"enabled": true},
                        "mypy": {"enabled": true}
                    }
                }
            })),
        });
        
        // Java
        configs.insert("java".to_string(), LspConfig {
            name: "jdtls".to_string(),
            command: "jdtls".to_string(),
            args: vec![],
            file_extensions: vec!["java".to_string()],
            root_markers: vec!["pom.xml".to_string(), "build.gradle".to_string(), ".project".to_string()],
            initialization_options: None,
        });
        
        // C/C++
        configs.insert("cpp".to_string(), LspConfig {
            name: "clangd".to_string(),
            command: "clangd".to_string(),
            args: vec!["--background-index".to_string(), "--clang-tidy".to_string()],
            file_extensions: vec!["c".to_string(), "cpp".to_string(), "cc".to_string(), "h".to_string(), "hpp".to_string()],
            root_markers: vec!["compile_commands.json".to_string(), ".clangd".to_string()],
            initialization_options: None,
        });
        
        // Go
        configs.insert("go".to_string(), LspConfig {
            name: "gopls".to_string(),
            command: "gopls".to_string(),
            args: vec![],
            file_extensions: vec!["go".to_string()],
            root_markers: vec!["go.mod".to_string(), "go.sum".to_string()],
            initialization_options: Some(serde_json::json!({
                "usePlaceholders": true,
                "analyses": {
                    "unusedparams": true
                }
            })),
        });
        
        // Ruby
        configs.insert("ruby".to_string(), LspConfig {
            name: "solargraph".to_string(),
            command: "solargraph".to_string(),
            args: vec!["stdio".to_string()],
            file_extensions: vec!["rb".to_string(), "erb".to_string()],
            root_markers: vec!["Gemfile".to_string(), ".solargraph.yml".to_string()],
            initialization_options: None,
        });
        
        // PHP
        configs.insert("php".to_string(), LspConfig {
            name: "intelephense".to_string(),
            command: "intelephense".to_string(),
            args: vec!["--stdio".to_string()],
            file_extensions: vec!["php".to_string()],
            root_markers: vec!["composer.json".to_string(), ".php-cs-fixer.php".to_string()],
            initialization_options: None,
        });
        
        // Elixir
        configs.insert("elixir".to_string(), LspConfig {
            name: "elixir-ls".to_string(),
            command: "elixir-ls".to_string(),
            args: vec![],
            file_extensions: vec!["ex".to_string(), "exs".to_string()],
            root_markers: vec!["mix.exs".to_string()],
            initialization_options: None,
        });
        
        // Kotlin
        configs.insert("kotlin".to_string(), LspConfig {
            name: "kotlin-language-server".to_string(),
            command: "kotlin-language-server".to_string(),
            args: vec![],
            file_extensions: vec!["kt".to_string(), "kts".to_string()],
            root_markers: vec!["build.gradle.kts".to_string(), "settings.gradle.kts".to_string()],
            initialization_options: None,
        });
        
        // C#/.NET
        configs.insert("csharp".to_string(), LspConfig {
            name: "omnisharp".to_string(),
            command: "omnisharp".to_string(),
            args: vec!["-lsp".to_string()],
            file_extensions: vec!["cs".to_string(), "csx".to_string()],
            root_markers: vec![".csproj".to_string(), ".sln".to_string()],
            initialization_options: None,
        });
        
        Ok(configs)
    }
    
    async fn initialize_all_servers(&mut self, workspace_root: &PathBuf) -> Result<()> {
        for (lang, config) in &self.configs {
            match self.start_language_server(lang, config, workspace_root).await {
                Ok(server) => {
                    self.servers.insert(lang.clone(), Arc::new(RwLock::new(server)));
                    info!("Started {} language server", lang);
                }
                Err(e) => {
                    warn!("Failed to start {} language server: {}", lang, e);
                }
            }
        }
        Ok(())
    }
    
    async fn start_language_server(
        &self,
        lang: &str,
        config: &LspConfig,
        workspace_root: &PathBuf,
    ) -> Result<LanguageServer> {
        // Check if command exists
        which::which(&config.command)?;
        
        let mut child = Command::new(&config.command)
            .args(&config.args)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()?;
        
        let stdin = child.stdin.take().expect("Failed to get stdin");
        let stdout = child.stdout.take().expect("Failed to get stdout");
        
        let server = LanguageServer {
            language: lang.to_string(),
            process: child,
            client: LspClient::new(stdin, stdout),
            workspace_root: workspace_root.clone(),
            config: config.clone(),
        };
        
        // Initialize the server
        server.initialize().await?;
        
        Ok(server)
    }
    
    pub async fn get_server(&self, language: &str) -> Option<Arc<RwLock<LanguageServer>>> {
        self.servers.get(language).map(|s| s.clone())
    }
    
    pub async fn restart_server(&mut self, language: &str) -> Result<()> {
        if let Some((_, server)) = self.servers.remove(language) {
            let mut server = server.write().await;
            server.shutdown().await?;
        }
        
        if let Some(config) = self.configs.get(language) {
            let workspace_root = PathBuf::from(".");
            let new_server = self.start_language_server(language, config, &workspace_root).await?;
            self.servers.insert(language.to_string(), Arc::new(RwLock::new(new_server)));
        }
        
        Ok(())
    }
}

pub struct LanguageServer {
    language: String,
    process: Child,
    client: LspClient,
    workspace_root: PathBuf,
    config: LspConfig,
}

impl LanguageServer {
    async fn initialize(&self) -> Result<()> {
        let params = InitializeParams {
            process_id: Some(std::process::id()),
            root_path: Some(self.workspace_root.to_string_lossy().to_string()),
            root_uri: Some(Url::from_file_path(&self.workspace_root).unwrap()),
            initialization_options: self.config.initialization_options.clone(),
            capabilities: ClientCapabilities {
                text_document: Some(TextDocumentClientCapabilities {
                    completion: Some(CompletionClientCapabilities {
                        completion_item: Some(CompletionItemCapability {
                            snippet_support: Some(true),
                            ..Default::default()
                        }),
                        ..Default::default()
                    }),
                    hover: Some(HoverClientCapabilities {
                        content_format: Some(vec![MarkupKind::Markdown]),
                        ..Default::default()
                    }),
                    ..Default::default()
                }),
                ..Default::default()
            },
            ..Default::default()
        };
        
        self.client.request("initialize", params).await?;
        self.client.notify("initialized", InitializedParams {}).await?;
        
        Ok(())
    }
    
    async fn shutdown(&mut self) -> Result<()> {
        self.client.request::<(), ()>("shutdown", ()).await?;
        self.client.notify("exit", ()).await?;
        self.process.kill().await?;
        Ok(())
    }
    
    pub async fn completion(&self, params: CompletionParams) -> Result<CompletionResponse> {
        self.client.request("textDocument/completion", params).await
    }
    
    pub async fn hover(&self, params: HoverParams) -> Result<Option<Hover>> {
        self.client.request("textDocument/hover", params).await
    }
    
    pub async fn goto_definition(&self, params: GotoDefinitionParams) -> Result<Option<GotoDefinitionResponse>> {
        self.client.request("textDocument/definition", params).await
    }
}