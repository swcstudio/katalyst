use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;

pub mod editor;
pub mod sandbox;
pub mod lsp_client;
pub mod file_system;
pub mod terminal;
pub mod parquet_output;
pub mod cryptobox_integration;

#[cfg(feature = "rustler-nif")]
pub mod rustler_bridge;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    
    #[wasm_bindgen(js_namespace = console)]
    fn error(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

macro_rules! console_error {
    ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IDEConfig {
    pub theme: String,
    pub font_size: u32,
    pub tab_size: u32,
    pub enable_lsp: bool,
    pub enable_sandbox: bool,
    pub sandbox_memory_limit: usize,
    pub sandbox_cpu_limit: f64,
    pub parquet_output_path: Option<String>,
}

impl Default for IDEConfig {
    fn default() -> Self {
        Self {
            theme: "dark".to_string(),
            font_size: 14,
            tab_size: 4,
            enable_lsp: true,
            enable_sandbox: true,
            sandbox_memory_limit: 512 * 1024 * 1024, // 512MB
            sandbox_cpu_limit: 1.0,
            parquet_output_path: None,
        }
    }
}

#[wasm_bindgen]
pub struct ZedWasmIDE {
    config: Arc<RwLock<IDEConfig>>,
    editor: Arc<RwLock<editor::Editor>>,
    sandbox: Arc<RwLock<sandbox::Sandbox>>,
    lsp_client: Arc<RwLock<lsp_client::LSPClient>>,
    file_system: Arc<RwLock<file_system::FileSystem>>,
    terminal: Arc<RwLock<terminal::Terminal>>,
    parquet_writer: Arc<RwLock<parquet_output::ParquetWriter>>,
}

#[wasm_bindgen]
impl ZedWasmIDE {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<ZedWasmIDE, JsValue> {
        console_log!("Initializing Zed WASM IDE");
        
        let config = Arc::new(RwLock::new(IDEConfig::default()));
        
        Ok(ZedWasmIDE {
            config: config.clone(),
            editor: Arc::new(RwLock::new(editor::Editor::new(config.clone()))),
            sandbox: Arc::new(RwLock::new(sandbox::Sandbox::new(config.clone()))),
            lsp_client: Arc::new(RwLock::new(lsp_client::LSPClient::new(config.clone()))),
            file_system: Arc::new(RwLock::new(file_system::FileSystem::new())),
            terminal: Arc::new(RwLock::new(terminal::Terminal::new())),
            parquet_writer: Arc::new(RwLock::new(parquet_output::ParquetWriter::new())),
        })
    }
    
    #[wasm_bindgen]
    pub async fn initialize(&mut self, config_json: String) -> Result<(), JsValue> {
        let new_config: IDEConfig = serde_json::from_str(&config_json)
            .map_err(|e| JsValue::from_str(&format!("Failed to parse config: {}", e)))?;
        
        *self.config.write().await = new_config;
        
        console_log!("IDE initialized with config");
        Ok(())
    }
    
    #[wasm_bindgen]
    pub async fn open_file(&mut self, path: String) -> Result<String, JsValue> {
        console_log!("Opening file: {}", path);
        
        let file_system = self.file_system.read().await;
        let content = file_system.read_file(&path).await
            .map_err(|e| JsValue::from_str(&format!("Failed to read file: {}", e)))?;
        
        let mut editor = self.editor.write().await;
        editor.open_buffer(&path, &content).await
            .map_err(|e| JsValue::from_str(&format!("Failed to open buffer: {}", e)))?;
        
        Ok(content)
    }
    
    #[wasm_bindgen]
    pub async fn save_file(&mut self, path: String, content: String) -> Result<(), JsValue> {
        console_log!("Saving file: {}", path);
        
        let mut file_system = self.file_system.write().await;
        file_system.write_file(&path, &content).await
            .map_err(|e| JsValue::from_str(&format!("Failed to write file: {}", e)))?;
        
        // Log to parquet if enabled
        if let Some(parquet_path) = &self.config.read().await.parquet_output_path {
            let mut writer = self.parquet_writer.write().await;
            writer.log_file_operation("save", &path, Some(&content)).await
                .map_err(|e| JsValue::from_str(&format!("Failed to log to parquet: {}", e)))?;
        }
        
        Ok(())
    }
    
    #[wasm_bindgen]
    pub async fn execute_in_sandbox(&mut self, code: String, language: String) -> Result<String, JsValue> {
        console_log!("Executing code in sandbox: {}", language);
        
        let mut sandbox = self.sandbox.write().await;
        let result = sandbox.execute(&code, &language).await
            .map_err(|e| JsValue::from_str(&format!("Sandbox execution failed: {}", e)))?;
        
        // Log execution to parquet
        if self.config.read().await.parquet_output_path.is_some() {
            let mut writer = self.parquet_writer.write().await;
            writer.log_execution(&language, &code, &result).await
                .map_err(|e| JsValue::from_str(&format!("Failed to log execution: {}", e)))?;
        }
        
        Ok(result)
    }
    
    #[wasm_bindgen]
    pub async fn get_completions(&mut self, file_path: String, position: usize) -> Result<String, JsValue> {
        console_log!("Getting completions for {} at position {}", file_path, position);
        
        let lsp = self.lsp_client.read().await;
        let completions = lsp.get_completions(&file_path, position).await
            .map_err(|e| JsValue::from_str(&format!("Failed to get completions: {}", e)))?;
        
        serde_json::to_string(&completions)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize completions: {}", e)))
    }
    
    #[wasm_bindgen]
    pub async fn run_terminal_command(&mut self, command: String) -> Result<String, JsValue> {
        console_log!("Running terminal command: {}", command);
        
        let mut terminal = self.terminal.write().await;
        let output = terminal.execute_command(&command).await
            .map_err(|e| JsValue::from_str(&format!("Terminal command failed: {}", e)))?;
        
        Ok(output)
    }
    
    #[wasm_bindgen]
    pub async fn export_to_parquet(&mut self, output_path: String) -> Result<(), JsValue> {
        console_log!("Exporting data to parquet: {}", output_path);
        
        let mut writer = self.parquet_writer.write().await;
        writer.finalize(&output_path).await
            .map_err(|e| JsValue::from_str(&format!("Failed to export parquet: {}", e)))?;
        
        Ok(())
    }
}

#[wasm_bindgen(start)]
pub fn main() {
    console_log!("Zed WASM IDE loaded");
    
    // Initialize panic hook for better error messages
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
    
    // Initialize tracing for WASM
    tracing_wasm::set_as_global_default();
}