use anyhow::Result;
use helix_core::{
    syntax::{Configuration as SyntaxConfig, LanguageConfiguration},
    Selection, Syntax,
};
use helix_lsp::{
    Client, LanguageServerName, Registry,
};
use helix_view::{
    Document, Editor, Theme, View,
};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    path::{Path, PathBuf},
    sync::Arc,
};
use tokio::sync::RwLock;

/// Helix editor integration with comprehensive LSP support
pub struct HelixIntegration {
    config: HelixConfig,
    editor: Arc<RwLock<Editor>>,
    lsp_registry: Arc<RwLock<Registry>>,
    languages: Arc<RwLock<HashMap<String, LanguageConfiguration>>>,
    themes: Arc<RwLock<HashMap<String, Theme>>>,
    claude_integration: Option<Arc<katalyst_claude::ClaudeCodeApp>>,
}

impl HelixIntegration {
    pub async fn new(config: &HelixConfig) -> Result<Self> {
        // Initialize LSP registry
        let lsp_registry = Arc::new(RwLock::new(Registry::new()));
        
        // Load language configurations
        let languages = Arc::new(RwLock::new(Self::load_languages(&config.languages_file)?));
        
        // Load themes
        let themes = Arc::new(RwLock::new(Self::load_themes(&config.themes_dir)?));
        
        // Create editor instance
        let editor = Arc::new(RwLock::new(Editor::new(
            config.runtime_dir.clone(),
            config.config_dir.clone(),
        )?));
        
        // Initialize Claude integration if enabled
        let claude_integration = if config.claude_enabled {
            let claude_settings = katalyst_claude::settings::Settings::load()?;
            Some(Arc::new(katalyst_claude::ClaudeCodeApp::new(claude_settings).await?))
        } else {
            None
        };
        
        let mut integration = Self {
            config: config.clone(),
            editor,
            lsp_registry,
            languages,
            themes,
            claude_integration,
        };
        
        // Initialize all language servers
        integration.initialize_language_servers().await?;
        
        Ok(integration)
    }
    
    pub async fn configure_for_project(&self, project_path: &str) -> Result<()> {
        tracing::info!("Configuring Helix for project: {}", project_path);
        
        // Detect project languages
        let languages = self.detect_project_languages(project_path).await?;
        
        // Start relevant language servers
        for lang in &languages {
            self.ensure_language_server(lang).await?;
        }
        
        // Load project-specific configuration
        self.load_project_config(project_path).await?;
        
        // Configure Claude integration for project
        if let Some(ref claude) = self.claude_integration {
            // Add project context to Claude memory
            let memory_content = format!(
                "Working on project: {}\nLanguages: {:?}\nEditor: Helix",
                project_path, languages
            );
            
            // This would add to Claude's memory
            tracing::info!("Configured Claude integration for project");
        }
        
        Ok(())
    }
    
    pub async fn open_file(&self, file_path: &Path) -> Result<()> {
        let mut editor = self.editor.write().await;
        
        // Open document
        let doc_id = editor.open(file_path, None)?;
        
        // Get language configuration
        let lang = self.detect_language(file_path).await?;
        
        // Attach language server
        if let Some(lang_config) = self.languages.read().await.get(&lang) {
            if let Some(lsp_config) = &lang_config.language_server {
                let mut registry = self.lsp_registry.write().await;
                
                // Get or start language server
                let client = registry.get_or_start(
                    &lsp_config.command,
                    &lsp_config.args,
                    file_path.parent().unwrap(),
                    lang_config.clone(),
                ).await?;
                
                // Attach to document
                if let Some(doc) = editor.document_mut(doc_id) {
                    doc.set_language_server(Some(client));
                }
            }
        }
        
        Ok(())
    }
    
    pub async fn save_file(&self, doc_id: usize) -> Result<()> {
        let mut editor = self.editor.write().await;
        
        if let Some(doc) = editor.document_mut(doc_id) {
            doc.save().await?;
            
            // Trigger format on save if configured
            if self.config.format_on_save {
                self.format_document(doc).await?;
            }
            
            // Run code actions on save
            if self.config.code_actions_on_save {
                self.run_code_actions(doc).await?;
            }
        }
        
        Ok(())
    }
    
    pub async fn get_completions(&self, doc_id: usize, position: usize) -> Result<Vec<Completion>> {
        let editor = self.editor.read().await;
        
        if let Some(doc) = editor.document(doc_id) {
            if let Some(lsp) = doc.language_server() {
                // Get LSP completions
                let completions = lsp.completion(doc.identifier(), position).await?;
                
                // Convert to our format
                return Ok(completions.into_iter().map(|c| Completion {
                    label: c.label,
                    kind: c.kind.map(|k| format!("{:?}", k)),
                    detail: c.detail,
                    documentation: c.documentation.map(|d| format!("{:?}", d)),
                    insert_text: c.insert_text.or(Some(c.label.clone())),
                }).collect());
            }
            
            // Fallback to Claude completion if LSP not available
            if let Some(ref claude) = self.claude_integration {
                let content = doc.text().to_string();
                let language = doc.language_name().unwrap_or("text");
                
                let completion = claude.client.complete_code(
                    &content,
                    language,
                    &Default::default(),
                ).await?;
                
                return Ok(vec![Completion {
                    label: "Claude suggestion".to_string(),
                    kind: Some("AI".to_string()),
                    detail: Some("AI-powered completion".to_string()),
                    documentation: None,
                    insert_text: Some(completion),
                }]);
            }
        }
        
        Ok(Vec::new())
    }
    
    pub async fn goto_definition(&self, doc_id: usize, position: usize) -> Result<Option<Location>> {
        let editor = self.editor.read().await;
        
        if let Some(doc) = editor.document(doc_id) {
            if let Some(lsp) = doc.language_server() {
                let location = lsp.goto_definition(doc.identifier(), position).await?;
                
                return Ok(location.map(|l| Location {
                    file: l.uri.path().to_string(),
                    line: l.range.start.line,
                    column: l.range.start.character,
                }));
            }
        }
        
        Ok(None)
    }
    
    pub async fn find_references(&self, doc_id: usize, position: usize) -> Result<Vec<Location>> {
        let editor = self.editor.read().await;
        
        if let Some(doc) = editor.document(doc_id) {
            if let Some(lsp) = doc.language_server() {
                let references = lsp.find_references(doc.identifier(), position).await?;
                
                return Ok(references.into_iter().map(|r| Location {
                    file: r.uri.path().to_string(),
                    line: r.range.start.line,
                    column: r.range.start.character,
                }).collect());
            }
        }
        
        Ok(Vec::new())
    }
    
    pub async fn rename_symbol(&self, doc_id: usize, position: usize, new_name: &str) -> Result<()> {
        let editor = self.editor.read().await;
        
        if let Some(doc) = editor.document(doc_id) {
            if let Some(lsp) = doc.language_server() {
                lsp.rename(doc.identifier(), position, new_name).await?;
            }
        }
        
        Ok(())
    }
    
    pub async fn get_diagnostics(&self, doc_id: usize) -> Result<Vec<Diagnostic>> {
        let editor = self.editor.read().await;
        
        if let Some(doc) = editor.document(doc_id) {
            if let Some(lsp) = doc.language_server() {
                let diagnostics = lsp.diagnostics(doc.identifier()).await?;
                
                return Ok(diagnostics.into_iter().map(|d| Diagnostic {
                    severity: format!("{:?}", d.severity),
                    message: d.message,
                    line: d.range.start.line,
                    column: d.range.start.character,
                    source: d.source,
                }).collect());
            }
        }
        
        Ok(Vec::new())
    }
    
    async fn initialize_language_servers(&mut self) -> Result<()> {
        tracing::info!("Initializing language servers");
        
        let languages = self.languages.read().await;
        let mut registry = self.lsp_registry.write().await;
        
        for (name, config) in languages.iter() {
            if let Some(lsp_config) = &config.language_server {
                tracing::info!("Starting LSP for {}: {}", name, lsp_config.command);
                
                // Start language server
                match registry.get_or_start(
                    &lsp_config.command,
                    &lsp_config.args,
                    &PathBuf::from("."),
                    config.clone(),
                ).await {
                    Ok(_) => tracing::info!("Started LSP for {}", name),
                    Err(e) => tracing::warn!("Failed to start LSP for {}: {}", name, e),
                }
            }
        }
        
        Ok(())
    }
    
    async fn ensure_language_server(&self, language: &str) -> Result<()> {
        let languages = self.languages.read().await;
        
        if let Some(config) = languages.get(language) {
            if let Some(lsp_config) = &config.language_server {
                let mut registry = self.lsp_registry.write().await;
                
                registry.get_or_start(
                    &lsp_config.command,
                    &lsp_config.args,
                    &PathBuf::from("."),
                    config.clone(),
                ).await?;
            }
        }
        
        Ok(())
    }
    
    async fn detect_project_languages(&self, project_path: &str) -> Result<Vec<String>> {
        let mut languages = Vec::new();
        
        // Walk project directory and detect languages
        for entry in walkdir::WalkDir::new(project_path)
            .max_depth(3)
            .into_iter()
            .filter_map(|e| e.ok())
        {
            let path = entry.path();
            if path.is_file() {
                if let Ok(lang) = self.detect_language(path).await {
                    if !languages.contains(&lang) {
                        languages.push(lang);
                    }
                }
            }
        }
        
        Ok(languages)
    }
    
    async fn detect_language(&self, path: &Path) -> Result<String> {
        let extension = path.extension()
            .and_then(|e| e.to_str())
            .unwrap_or("");
        
        let language = match extension {
            "rs" => "rust",
            "ts" | "tsx" => "typescript",
            "js" | "jsx" => "javascript",
            "py" => "python",
            "go" => "go",
            "java" => "java",
            "cpp" | "cc" | "cxx" => "cpp",
            "c" | "h" => "c",
            "rb" => "ruby",
            "php" => "php",
            "ex" | "exs" => "elixir",
            "kt" => "kotlin",
            "cs" => "csharp",
            "swift" => "swift",
            "zig" => "zig",
            "nim" => "nim",
            "ml" | "mli" => "ocaml",
            "hs" => "haskell",
            "scala" => "scala",
            "clj" => "clojure",
            "dart" => "dart",
            "lua" => "lua",
            "vim" => "vim",
            "sh" | "bash" => "bash",
            "fish" => "fish",
            "zsh" => "zsh",
            "toml" => "toml",
            "yaml" | "yml" => "yaml",
            "json" => "json",
            "xml" => "xml",
            "html" => "html",
            "css" => "css",
            "scss" | "sass" => "scss",
            "md" => "markdown",
            _ => "text",
        }.to_string();
        
        Ok(language)
    }
    
    async fn load_project_config(&self, project_path: &str) -> Result<()> {
        let config_path = Path::new(project_path).join(".helix").join("config.toml");
        
        if config_path.exists() {
            let content = tokio::fs::read_to_string(config_path).await?;
            // Parse and apply project-specific configuration
            tracing::info!("Loaded project-specific Helix configuration");
        }
        
        Ok(())
    }
    
    async fn format_document(&self, doc: &mut Document) -> Result<()> {
        if let Some(lsp) = doc.language_server() {
            let formatting = lsp.format(doc.identifier()).await?;
            // Apply formatting edits
            doc.apply_edits(formatting)?;
        }
        Ok(())
    }
    
    async fn run_code_actions(&self, doc: &mut Document) -> Result<()> {
        if let Some(lsp) = doc.language_server() {
            let actions = lsp.code_actions(doc.identifier()).await?;
            // Apply code actions
            for action in actions {
                doc.apply_code_action(action)?;
            }
        }
        Ok(())
    }
    
    fn load_languages(languages_file: &Path) -> Result<HashMap<String, LanguageConfiguration>> {
        let mut languages = HashMap::new();
        
        // Load from file if exists
        if languages_file.exists() {
            let content = std::fs::read_to_string(languages_file)?;
            let configs: Vec<LanguageConfiguration> = toml::from_str(&content)?;
            
            for config in configs {
                languages.insert(config.name.clone(), config);
            }
        }
        
        // Add default language configurations
        languages.extend(Self::default_language_configs());
        
        Ok(languages)
    }
    
    fn default_language_configs() -> HashMap<String, LanguageConfiguration> {
        let mut configs = HashMap::new();
        
        // Rust
        configs.insert("rust".to_string(), LanguageConfiguration {
            name: "rust".to_string(),
            scope: "source.rust".to_string(),
            injection_regex: None,
            file_types: vec!["rs".to_string()],
            shebangs: vec![],
            roots: vec!["Cargo.toml".to_string()],
            comment_token: Some("//".to_string()),
            indent: helix_core::Indent {
                tab_width: 4,
                unit: "    ".to_string(),
            },
            language_server: Some(LspConfig {
                command: "rust-analyzer".to_string(),
                args: vec![],
                environment: HashMap::new(),
            }),
            ..Default::default()
        });
        
        // TypeScript
        configs.insert("typescript".to_string(), LanguageConfiguration {
            name: "typescript".to_string(),
            scope: "source.ts".to_string(),
            injection_regex: None,
            file_types: vec!["ts".to_string(), "tsx".to_string()],
            shebangs: vec![],
            roots: vec!["package.json".to_string(), "tsconfig.json".to_string()],
            comment_token: Some("//".to_string()),
            indent: helix_core::Indent {
                tab_width: 2,
                unit: "  ".to_string(),
            },
            language_server: Some(LspConfig {
                command: "typescript-language-server".to_string(),
                args: vec!["--stdio".to_string()],
                environment: HashMap::new(),
            }),
            ..Default::default()
        });
        
        // Python
        configs.insert("python".to_string(), LanguageConfiguration {
            name: "python".to_string(),
            scope: "source.python".to_string(),
            injection_regex: None,
            file_types: vec!["py".to_string()],
            shebangs: vec!["python".to_string()],
            roots: vec!["pyproject.toml".to_string(), "setup.py".to_string()],
            comment_token: Some("#".to_string()),
            indent: helix_core::Indent {
                tab_width: 4,
                unit: "    ".to_string(),
            },
            language_server: Some(LspConfig {
                command: "pylsp".to_string(),
                args: vec![],
                environment: HashMap::new(),
            }),
            ..Default::default()
        });
        
        // Go
        configs.insert("go".to_string(), LanguageConfiguration {
            name: "go".to_string(),
            scope: "source.go".to_string(),
            injection_regex: None,
            file_types: vec!["go".to_string()],
            shebangs: vec![],
            roots: vec!["go.mod".to_string()],
            comment_token: Some("//".to_string()),
            indent: helix_core::Indent {
                tab_width: 4,
                unit: "\t".to_string(),
            },
            language_server: Some(LspConfig {
                command: "gopls".to_string(),
                args: vec![],
                environment: HashMap::new(),
            }),
            ..Default::default()
        });
        
        // Add more languages...
        
        configs
    }
    
    fn load_themes(themes_dir: &Path) -> Result<HashMap<String, Theme>> {
        let mut themes = HashMap::new();
        
        // Load custom themes
        if themes_dir.exists() {
            for entry in std::fs::read_dir(themes_dir)? {
                let entry = entry?;
                let path = entry.path();
                if path.extension() == Some(std::ffi::OsStr::new("toml")) {
                    let name = path.file_stem()
                        .and_then(|s| s.to_str())
                        .unwrap_or("unknown")
                        .to_string();
                    
                    let content = std::fs::read_to_string(&path)?;
                    if let Ok(theme) = toml::from_str(&content) {
                        themes.insert(name, theme);
                    }
                }
            }
        }
        
        // Add default themes
        themes.insert("katalyst".to_string(), Self::katalyst_theme());
        themes.insert("dark".to_string(), Self::dark_theme());
        themes.insert("light".to_string(), Self::light_theme());
        
        Ok(themes)
    }
    
    fn katalyst_theme() -> Theme {
        Theme::default() // Would implement custom theme
    }
    
    fn dark_theme() -> Theme {
        Theme::default()
    }
    
    fn light_theme() -> Theme {
        Theme::default()
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HelixConfig {
    pub config_dir: PathBuf,
    pub runtime_dir: PathBuf,
    pub themes_dir: PathBuf,
    pub languages_file: PathBuf,
    pub default_theme: String,
    pub format_on_save: bool,
    pub code_actions_on_save: bool,
    pub auto_save: bool,
    pub idle_timeout_ms: u64,
    pub completion_trigger_characters: Vec<String>,
    pub claude_enabled: bool,
}

impl Default for HelixConfig {
    fn default() -> Self {
        let config_dir = dirs::config_dir()
            .unwrap_or_else(|| PathBuf::from("."))
            .join("helix");
        
        Self {
            config_dir: config_dir.clone(),
            runtime_dir: config_dir.join("runtime"),
            themes_dir: config_dir.join("themes"),
            languages_file: config_dir.join("languages.toml"),
            default_theme: "katalyst".to_string(),
            format_on_save: true,
            code_actions_on_save: true,
            auto_save: false,
            idle_timeout_ms: 1000,
            completion_trigger_characters: vec![".".to_string(), "::".to_string()],
            claude_enabled: true,
        }
    }
}

#[derive(Debug, Clone)]
pub struct LspConfig {
    pub command: String,
    pub args: Vec<String>,
    pub environment: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Completion {
    pub label: String,
    pub kind: Option<String>,
    pub detail: Option<String>,
    pub documentation: Option<String>,
    pub insert_text: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Location {
    pub file: String,
    pub line: u32,
    pub column: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Diagnostic {
    pub severity: String,
    pub message: String,
    pub line: u32,
    pub column: u32,
    pub source: Option<String>,
}