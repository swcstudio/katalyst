use std::sync::Arc;
use tokio::sync::RwLock;
use serde::{Deserialize, Serialize};
use lsp_types::{
    CompletionItem, CompletionParams, Position, TextDocumentIdentifier,
    TextDocumentPositionParams, Url, CompletionContext, CompletionTriggerKind,
    DiagnosticSeverity, Diagnostic, Range, Location, 
};
use wasm_bindgen::prelude::*;
use std::collections::HashMap;

use crate::IDEConfig;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LSPServer {
    pub language: String,
    pub server_url: String,
    pub capabilities: Vec<String>,
}

pub struct LSPClient {
    config: Arc<RwLock<IDEConfig>>,
    servers: HashMap<String, LSPServer>,
    active_connections: HashMap<String, ServerConnection>,
    diagnostics: HashMap<String, Vec<Diagnostic>>,
}

#[derive(Debug, Clone)]
struct ServerConnection {
    server_id: String,
    websocket_url: String,
    connected: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompletionResult {
    pub items: Vec<CompletionItemSimple>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CompletionItemSimple {
    pub label: String,
    pub kind: String,
    pub detail: Option<String>,
    pub documentation: Option<String>,
    pub insert_text: Option<String>,
}

impl LSPClient {
    pub fn new(config: Arc<RwLock<IDEConfig>>) -> Self {
        let mut servers = HashMap::new();
        
        // Pre-configure common language servers
        servers.insert("rust".to_string(), LSPServer {
            language: "rust".to_string(),
            server_url: "wss://lsp.example.com/rust-analyzer".to_string(),
            capabilities: vec![
                "completion".to_string(),
                "hover".to_string(),
                "definition".to_string(),
                "references".to_string(),
                "rename".to_string(),
                "formatting".to_string(),
            ],
        });
        
        servers.insert("typescript".to_string(), LSPServer {
            language: "typescript".to_string(),
            server_url: "wss://lsp.example.com/typescript".to_string(),
            capabilities: vec![
                "completion".to_string(),
                "hover".to_string(),
                "definition".to_string(),
                "references".to_string(),
                "rename".to_string(),
                "formatting".to_string(),
            ],
        });
        
        servers.insert("python".to_string(), LSPServer {
            language: "python".to_string(),
            server_url: "wss://lsp.example.com/pylsp".to_string(),
            capabilities: vec![
                "completion".to_string(),
                "hover".to_string(),
                "definition".to_string(),
                "references".to_string(),
            ],
        });
        
        Self {
            config,
            servers,
            active_connections: HashMap::new(),
            diagnostics: HashMap::new(),
        }
    }
    
    pub async fn connect_to_server(&mut self, language: &str) -> Result<(), String> {
        let server = self.servers.get(language)
            .ok_or_else(|| format!("No LSP server configured for language: {}", language))?;
        
        let connection = ServerConnection {
            server_id: format!("{}_{}", language, generate_connection_id()),
            websocket_url: server.server_url.clone(),
            connected: true, // In WASM, we'd actually establish WebSocket connection
        };
        
        self.active_connections.insert(language.to_string(), connection);
        
        Ok(())
    }
    
    pub async fn disconnect_from_server(&mut self, language: &str) -> Result<(), String> {
        self.active_connections.remove(language);
        Ok(())
    }
    
    pub async fn get_completions(&self, file_path: &str, position: usize) -> Result<CompletionResult, String> {
        let language = detect_language_from_path(file_path);
        
        // Check if we have an active connection for this language
        if !self.active_connections.contains_key(&language) {
            return Err(format!("No active LSP connection for language: {}", language));
        }
        
        // Simulate completion items
        // In production, this would make actual LSP requests
        let items = self.generate_mock_completions(&language, position);
        
        Ok(CompletionResult { items })
    }
    
    pub async fn get_hover_info(&self, file_path: &str, position: usize) -> Result<String, String> {
        let language = detect_language_from_path(file_path);
        
        if !self.active_connections.contains_key(&language) {
            return Err(format!("No active LSP connection for language: {}", language));
        }
        
        // Simulate hover information
        Ok(format!("Hover info at position {} for {}", position, file_path))
    }
    
    pub async fn go_to_definition(&self, file_path: &str, position: usize) -> Result<Location, String> {
        let language = detect_language_from_path(file_path);
        
        if !self.active_connections.contains_key(&language) {
            return Err(format!("No active LSP connection for language: {}", language));
        }
        
        // Simulate definition location
        let url = Url::parse(&format!("file://{}", file_path))
            .map_err(|e| format!("Invalid file URL: {}", e))?;
        
        Ok(Location {
            uri: url,
            range: Range {
                start: Position { line: 0, character: 0 },
                end: Position { line: 0, character: 0 },
            },
        })
    }
    
    pub async fn find_references(&self, file_path: &str, position: usize) -> Result<Vec<Location>, String> {
        let language = detect_language_from_path(file_path);
        
        if !self.active_connections.contains_key(&language) {
            return Err(format!("No active LSP connection for language: {}", language));
        }
        
        // Simulate references
        Ok(vec![])
    }
    
    pub async fn rename_symbol(&self, file_path: &str, position: usize, new_name: &str) -> Result<HashMap<String, Vec<TextEdit>>, String> {
        let language = detect_language_from_path(file_path);
        
        if !self.active_connections.contains_key(&language) {
            return Err(format!("No active LSP connection for language: {}", language));
        }
        
        // Simulate rename edits
        Ok(HashMap::new())
    }
    
    pub async fn format_document(&self, file_path: &str, content: &str) -> Result<String, String> {
        let language = detect_language_from_path(file_path);
        
        if !self.active_connections.contains_key(&language) {
            return Err(format!("No active LSP connection for language: {}", language));
        }
        
        // Return formatted content (unchanged for now)
        Ok(content.to_string())
    }
    
    pub async fn get_diagnostics(&self, file_path: &str) -> Vec<Diagnostic> {
        self.diagnostics.get(file_path)
            .cloned()
            .unwrap_or_default()
    }
    
    pub async fn update_diagnostics(&mut self, file_path: &str, diagnostics: Vec<Diagnostic>) {
        self.diagnostics.insert(file_path.to_string(), diagnostics);
    }
    
    fn generate_mock_completions(&self, language: &str, position: usize) -> Vec<CompletionItemSimple> {
        match language.as_str() {
            "rust" => vec![
                CompletionItemSimple {
                    label: "println!".to_string(),
                    kind: "Macro".to_string(),
                    detail: Some("Prints to stdout".to_string()),
                    documentation: Some("Macro for printing to standard output".to_string()),
                    insert_text: Some("println!(\"$1\")$0".to_string()),
                },
                CompletionItemSimple {
                    label: "let".to_string(),
                    kind: "Keyword".to_string(),
                    detail: Some("Variable binding".to_string()),
                    documentation: Some("Creates a new variable binding".to_string()),
                    insert_text: Some("let $1 = $0;".to_string()),
                },
                CompletionItemSimple {
                    label: "fn".to_string(),
                    kind: "Keyword".to_string(),
                    detail: Some("Function definition".to_string()),
                    documentation: Some("Defines a new function".to_string()),
                    insert_text: Some("fn $1() {\n    $0\n}".to_string()),
                },
            ],
            "typescript" => vec![
                CompletionItemSimple {
                    label: "console.log".to_string(),
                    kind: "Method".to_string(),
                    detail: Some("Logs to console".to_string()),
                    documentation: Some("Outputs a message to the console".to_string()),
                    insert_text: Some("console.log($0)".to_string()),
                },
                CompletionItemSimple {
                    label: "const".to_string(),
                    kind: "Keyword".to_string(),
                    detail: Some("Constant declaration".to_string()),
                    documentation: Some("Declares a block-scoped constant".to_string()),
                    insert_text: Some("const $1 = $0;".to_string()),
                },
                CompletionItemSimple {
                    label: "function".to_string(),
                    kind: "Keyword".to_string(),
                    detail: Some("Function declaration".to_string()),
                    documentation: Some("Declares a function".to_string()),
                    insert_text: Some("function $1() {\n    $0\n}".to_string()),
                },
            ],
            "python" => vec![
                CompletionItemSimple {
                    label: "print".to_string(),
                    kind: "Function".to_string(),
                    detail: Some("Print to stdout".to_string()),
                    documentation: Some("Prints objects to the text stream".to_string()),
                    insert_text: Some("print($0)".to_string()),
                },
                CompletionItemSimple {
                    label: "def".to_string(),
                    kind: "Keyword".to_string(),
                    detail: Some("Function definition".to_string()),
                    documentation: Some("Defines a function".to_string()),
                    insert_text: Some("def $1():\n    $0".to_string()),
                },
                CompletionItemSimple {
                    label: "class".to_string(),
                    kind: "Keyword".to_string(),
                    detail: Some("Class definition".to_string()),
                    documentation: Some("Defines a class".to_string()),
                    insert_text: Some("class $1:\n    def __init__(self):\n        $0".to_string()),
                },
            ],
            _ => vec![],
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TextEdit {
    pub range: Range,
    pub new_text: String,
}

fn detect_language_from_path(path: &str) -> String {
    let extension = path.rsplit('.').next().unwrap_or("");
    
    match extension {
        "rs" => "rust".to_string(),
        "js" | "mjs" => "javascript".to_string(),
        "ts" | "tsx" => "typescript".to_string(),
        "py" => "python".to_string(),
        "go" => "go".to_string(),
        _ => "unknown".to_string(),
    }
}

fn generate_connection_id() -> String {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    format!("{:08x}", rng.gen::<u32>())
}