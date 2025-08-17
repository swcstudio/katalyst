use anyhow::Result;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::spawn_local;
use web_sys::{
    console, Document, Element, HtmlCanvasElement, HtmlElement, MessageEvent, 
    WebSocket, Window, Storage,
};
use serde::{Deserialize, Serialize};
use std::{
    cell::RefCell,
    collections::HashMap,
    rc::Rc,
    sync::Arc,
};
use tokio::sync::{mpsc, RwLock};
use js_sys::{Array, Function, Object, Promise, Uint8Array};

/// WebAssembly bridge for running Katalyst Terminal in browsers
#[wasm_bindgen]
pub struct WasmTerminalBridge {
    #[wasm_bindgen(skip)]
    pub config: BridgeConfig,
    
    #[wasm_bindgen(skip)]
    pub websocket: Option<WebSocket>,
    
    #[wasm_bindgen(skip)]
    pub canvas: Option<HtmlCanvasElement>,
    
    #[wasm_bindgen(skip)]
    pub sessions: Rc<RefCell<HashMap<String, WasmSession>>>,
    
    #[wasm_bindgen(skip)]
    pub message_handlers: Rc<RefCell<HashMap<String, js_sys::Function>>>,
    
    #[wasm_bindgen(skip)]
    pub connection_state: Rc<RefCell<ConnectionState>>,
}

#[wasm_bindgen]
impl WasmTerminalBridge {
    #[wasm_bindgen(constructor)]
    pub fn new(config_json: &str) -> Result<WasmTerminalBridge, JsValue> {
        console_error_panic_hook::set_once();
        
        let config: BridgeConfig = serde_json::from_str(config_json)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        
        Ok(WasmTerminalBridge {
            config,
            websocket: None,
            canvas: None,
            sessions: Rc::new(RefCell::new(HashMap::new())),
            message_handlers: Rc::new(RefCell::new(HashMap::new())),
            connection_state: Rc::new(RefCell::new(ConnectionState::Disconnected)),
        })
    }
    
    /// Initialize the terminal in the browser
    #[wasm_bindgen]
    pub async fn initialize(&mut self, container_id: &str) -> Result<(), JsValue> {
        console::log_1(&"Initializing Katalyst Terminal in browser".into());
        
        // Get the container element
        let window = web_sys::window().unwrap();
        let document = window.document().unwrap();
        let container = document.get_element_by_id(container_id)
            .ok_or_else(|| JsValue::from_str("Container element not found"))?;
        
        // Create canvas for terminal rendering
        let canvas = document.create_element("canvas")
            .map_err(|e| JsValue::from_str(&format!("Failed to create canvas: {:?}", e)))?
            .dyn_into::<HtmlCanvasElement>()
            .map_err(|_| JsValue::from_str("Failed to cast to canvas"))?;
        
        canvas.set_width(self.config.width);
        canvas.set_height(self.config.height);
        canvas.set_id("katalyst-terminal-canvas");
        canvas.style().set_property("width", "100%")?;
        canvas.style().set_property("height", "100%")?;
        canvas.style().set_property("display", "block")?;
        
        container.append_child(&canvas)?;
        self.canvas = Some(canvas);
        
        // Set up event handlers
        self.setup_event_handlers()?;
        
        // Initialize local storage for settings
        self.initialize_storage()?;
        
        console::log_1(&"Terminal initialized successfully".into());
        Ok(())
    }
    
    /// Connect to a remote Katalyst server
    #[wasm_bindgen]
    pub async fn connect_to_server(&mut self, url: &str) -> Result<(), JsValue> {
        console::log_1(&format!("Connecting to server: {}", url).into());
        
        // Update connection state
        *self.connection_state.borrow_mut() = ConnectionState::Connecting;
        
        // Create WebSocket connection
        let ws = WebSocket::new(url)
            .map_err(|e| JsValue::from_str(&format!("Failed to create WebSocket: {:?}", e)))?;
        
        // Set up WebSocket event handlers
        self.setup_websocket_handlers(&ws)?;
        
        self.websocket = Some(ws);
        
        Ok(())
    }
    
    /// Create a new development session
    #[wasm_bindgen]
    pub async fn create_dev_session(&mut self, repo_url: &str) -> Result<String, JsValue> {
        console::log_1(&format!("Creating dev session for: {}", repo_url).into());
        
        let session_id = format!("wasm-session-{}", uuid::Uuid::new_v4());
        
        // Send request to server to create container
        let request = ServerRequest::CreateSession {
            session_id: session_id.clone(),
            repo_url: repo_url.to_string(),
            session_type: SessionType::Development,
        };
        
        self.send_to_server(&request)?;
        
        // Create local session tracking
        let session = WasmSession {
            id: session_id.clone(),
            repo_url: Some(repo_url.to_string()),
            session_type: SessionType::Development,
            created_at: js_sys::Date::now(),
            active: true,
        };
        
        self.sessions.borrow_mut().insert(session_id.clone(), session);
        
        Ok(session_id)
    }
    
    /// Send terminal input to the server
    #[wasm_bindgen]
    pub fn send_input(&self, session_id: &str, input: &str) -> Result<(), JsValue> {
        let request = ServerRequest::TerminalInput {
            session_id: session_id.to_string(),
            input: input.to_string(),
        };
        
        self.send_to_server(&request)?;
        Ok(())
    }
    
    /// Execute a command in the terminal
    #[wasm_bindgen]
    pub fn execute_command(&self, session_id: &str, command: &str) -> Result<(), JsValue> {
        let request = ServerRequest::ExecuteCommand {
            session_id: session_id.to_string(),
            command: command.to_string(),
        };
        
        self.send_to_server(&request)?;
        Ok(())
    }
    
    /// Resize the terminal
    #[wasm_bindgen]
    pub fn resize(&mut self, width: u32, height: u32) -> Result<(), JsValue> {
        self.config.width = width;
        self.config.height = height;
        
        if let Some(canvas) = &self.canvas {
            canvas.set_width(width);
            canvas.set_height(height);
        }
        
        // Notify server of resize
        let request = ServerRequest::Resize {
            width,
            height,
        };
        
        self.send_to_server(&request)?;
        Ok(())
    }
    
    /// Register a JavaScript callback for events
    #[wasm_bindgen]
    pub fn on(&mut self, event: &str, callback: js_sys::Function) {
        self.message_handlers.borrow_mut().insert(event.to_string(), callback);
    }
    
    /// Get list of active sessions
    #[wasm_bindgen]
    pub fn get_sessions(&self) -> JsValue {
        let sessions: Vec<SessionInfo> = self.sessions.borrow()
            .values()
            .map(|s| SessionInfo {
                id: s.id.clone(),
                repo_url: s.repo_url.clone(),
                session_type: s.session_type.clone(),
                active: s.active,
            })
            .collect();
        
        JsValue::from_serde(&sessions).unwrap_or(JsValue::NULL)
    }
    
    /// Close a session
    #[wasm_bindgen]
    pub fn close_session(&self, session_id: &str) -> Result<(), JsValue> {
        self.sessions.borrow_mut().remove(session_id);
        
        let request = ServerRequest::CloseSession {
            session_id: session_id.to_string(),
        };
        
        self.send_to_server(&request)?;
        Ok(())
    }
    
    /// Disconnect from server
    #[wasm_bindgen]
    pub fn disconnect(&mut self) {
        if let Some(ws) = &self.websocket {
            let _ = ws.close();
        }
        
        self.websocket = None;
        *self.connection_state.borrow_mut() = ConnectionState::Disconnected;
    }
    
    // Private helper methods
    fn send_to_server(&self, request: &ServerRequest) -> Result<(), JsValue> {
        if let Some(ws) = &self.websocket {
            let message = serde_json::to_string(request)
                .map_err(|e| JsValue::from_str(&e.to_string()))?;
            
            ws.send_with_str(&message)
                .map_err(|e| JsValue::from_str(&format!("Failed to send message: {:?}", e)))?;
        } else {
            return Err(JsValue::from_str("Not connected to server"));
        }
        
        Ok(())
    }
    
    fn setup_event_handlers(&self) -> Result<(), JsValue> {
        let window = web_sys::window().unwrap();
        let document = window.document().unwrap();
        
        // Keyboard events
        let sessions = self.sessions.clone();
        let websocket = self.websocket.clone();
        
        let keydown_closure = Closure::wrap(Box::new(move |event: web_sys::KeyboardEvent| {
            // Handle keyboard input
            console::log_1(&format!("Key pressed: {}", event.key()).into());
            
            // Send to active session
            if let Some(active_session) = sessions.borrow().values().find(|s| s.active) {
                // Send key to server
                console::log_1(&format!("Sending key to session: {}", active_session.id).into());
            }
        }) as Box<dyn FnMut(_)>);
        
        document.add_event_listener_with_callback(
            "keydown",
            keydown_closure.as_ref().unchecked_ref()
        )?;
        keydown_closure.forget();
        
        // Mouse events for terminal selection
        if let Some(canvas) = &self.canvas {
            let mouse_closure = Closure::wrap(Box::new(move |event: web_sys::MouseEvent| {
                console::log_1(&format!("Mouse click at: {}, {}", event.offset_x(), event.offset_y()).into());
            }) as Box<dyn FnMut(_)>);
            
            canvas.add_event_listener_with_callback(
                "click",
                mouse_closure.as_ref().unchecked_ref()
            )?;
            mouse_closure.forget();
        }
        
        // Window resize
        let resize_closure = Closure::wrap(Box::new(move |_event: web_sys::Event| {
            console::log_1(&"Window resized".into());
        }) as Box<dyn FnMut(_)>);
        
        window.add_event_listener_with_callback(
            "resize",
            resize_closure.as_ref().unchecked_ref()
        )?;
        resize_closure.forget();
        
        Ok(())
    }
    
    fn setup_websocket_handlers(&self, ws: &WebSocket) -> Result<(), JsValue> {
        let connection_state = self.connection_state.clone();
        let sessions = self.sessions.clone();
        let handlers = self.message_handlers.clone();
        
        // On open
        let on_open = Closure::wrap(Box::new(move |_| {
            console::log_1(&"WebSocket connected".into());
            *connection_state.borrow_mut() = ConnectionState::Connected;
            
            // Trigger connected callback
            if let Some(handler) = handlers.borrow().get("connected") {
                let _ = handler.call0(&JsValue::NULL);
            }
        }) as Box<dyn FnMut(_)>);
        
        ws.set_onopen(Some(on_open.as_ref().unchecked_ref()));
        on_open.forget();
        
        // On message
        let handlers = self.message_handlers.clone();
        let sessions = self.sessions.clone();
        
        let on_message = Closure::wrap(Box::new(move |event: MessageEvent| {
            if let Ok(text) = event.data().dyn_into::<js_sys::JsString>() {
                let message_str: String = text.into();
                
                // Parse server response
                if let Ok(response) = serde_json::from_str::<ServerResponse>(&message_str) {
                    match response {
                        ServerResponse::SessionCreated { session_id } => {
                            console::log_1(&format!("Session created: {}", session_id).into());
                            
                            if let Some(handler) = handlers.borrow().get("session_created") {
                                let _ = handler.call1(&JsValue::NULL, &JsValue::from_str(&session_id));
                            }
                        }
                        ServerResponse::TerminalOutput { session_id, output } => {
                            if let Some(handler) = handlers.borrow().get("terminal_output") {
                                let args = js_sys::Object::new();
                                js_sys::Reflect::set(&args, &"session_id".into(), &session_id.into()).unwrap();
                                js_sys::Reflect::set(&args, &"output".into(), &output.into()).unwrap();
                                let _ = handler.call1(&JsValue::NULL, &args);
                            }
                        }
                        ServerResponse::Error { message } => {
                            console::error_1(&format!("Server error: {}", message).into());
                            
                            if let Some(handler) = handlers.borrow().get("error") {
                                let _ = handler.call1(&JsValue::NULL, &JsValue::from_str(&message));
                            }
                        }
                        _ => {}
                    }
                }
            }
        }) as Box<dyn FnMut(_)>);
        
        ws.set_onmessage(Some(on_message.as_ref().unchecked_ref()));
        on_message.forget();
        
        // On error
        let handlers = self.message_handlers.clone();
        let on_error = Closure::wrap(Box::new(move |_| {
            console::error_1(&"WebSocket error occurred".into());
            
            if let Some(handler) = handlers.borrow().get("error") {
                let _ = handler.call1(&JsValue::NULL, &JsValue::from_str("WebSocket error"));
            }
        }) as Box<dyn FnMut(_)>);
        
        ws.set_onerror(Some(on_error.as_ref().unchecked_ref()));
        on_error.forget();
        
        // On close
        let connection_state = self.connection_state.clone();
        let handlers = self.message_handlers.clone();
        
        let on_close = Closure::wrap(Box::new(move |_| {
            console::log_1(&"WebSocket disconnected".into());
            *connection_state.borrow_mut() = ConnectionState::Disconnected;
            
            if let Some(handler) = handlers.borrow().get("disconnected") {
                let _ = handler.call0(&JsValue::NULL);
            }
        }) as Box<dyn FnMut(_)>);
        
        ws.set_onclose(Some(on_close.as_ref().unchecked_ref()));
        on_close.forget();
        
        Ok(())
    }
    
    fn initialize_storage(&self) -> Result<(), JsValue> {
        let window = web_sys::window().unwrap();
        
        if let Ok(Some(storage)) = window.local_storage() {
            // Store configuration
            let config_json = serde_json::to_string(&self.config)
                .map_err(|e| JsValue::from_str(&e.to_string()))?;
            
            storage.set_item("katalyst_config", &config_json)?;
            
            // Load saved sessions
            if let Ok(Some(sessions_json)) = storage.get_item("katalyst_sessions") {
                if let Ok(saved_sessions) = serde_json::from_str::<Vec<WasmSession>>(&sessions_json) {
                    for session in saved_sessions {
                        self.sessions.borrow_mut().insert(session.id.clone(), session);
                    }
                }
            }
        }
        
        Ok(())
    }
}

/// Export functions for JavaScript
#[wasm_bindgen]
pub fn create_terminal(config: &str) -> WasmTerminalBridge {
    WasmTerminalBridge::new(config).unwrap()
}

#[wasm_bindgen]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

// Terminal rendering functions
#[wasm_bindgen]
pub fn render_terminal_frame(
    canvas_id: &str,
    session_id: &str,
    frame_data: &[u8],
) -> Result<(), JsValue> {
    let window = web_sys::window().unwrap();
    let document = window.document().unwrap();
    
    let canvas = document.get_element_by_id(canvas_id)
        .and_then(|e| e.dyn_into::<HtmlCanvasElement>().ok())
        .ok_or_else(|| JsValue::from_str("Canvas not found"))?;
    
    let context = canvas
        .get_context("2d")?
        .unwrap()
        .dyn_into::<web_sys::CanvasRenderingContext2d>()?;
    
    // Render frame data to canvas
    // This would involve parsing the terminal output and rendering it
    
    Ok(())
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BridgeConfig {
    pub server_url: String,
    pub width: u32,
    pub height: u32,
    pub theme: String,
    pub font_size: u32,
    pub font_family: String,
    pub auto_reconnect: bool,
    pub reconnect_interval_ms: u32,
}

impl Default for BridgeConfig {
    fn default() -> Self {
        Self {
            server_url: "wss://localhost:8080".to_string(),
            width: 1024,
            height: 768,
            theme: "dark".to_string(),
            font_size: 14,
            font_family: "JetBrains Mono, monospace".to_string(),
            auto_reconnect: true,
            reconnect_interval_ms: 5000,
        }
    }
}

#[derive(Debug, Clone)]
struct WasmSession {
    id: String,
    repo_url: Option<String>,
    session_type: SessionType,
    created_at: f64,
    active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionInfo {
    pub id: String,
    pub repo_url: Option<String>,
    pub session_type: SessionType,
    pub active: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SessionType {
    Development,
    Remote,
    Local,
}

#[derive(Debug, Clone)]
enum ConnectionState {
    Disconnected,
    Connecting,
    Connected,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
enum ServerRequest {
    CreateSession {
        session_id: String,
        repo_url: String,
        session_type: SessionType,
    },
    CloseSession {
        session_id: String,
    },
    TerminalInput {
        session_id: String,
        input: String,
    },
    ExecuteCommand {
        session_id: String,
        command: String,
    },
    Resize {
        width: u32,
        height: u32,
    },
    ListSessions,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
enum ServerResponse {
    SessionCreated {
        session_id: String,
    },
    SessionClosed {
        session_id: String,
    },
    TerminalOutput {
        session_id: String,
        output: String,
    },
    SessionList {
        sessions: Vec<SessionInfo>,
    },
    Error {
        message: String,
    },
}

// Utility functions for JavaScript interop
#[wasm_bindgen]
pub fn encode_base64(data: &[u8]) -> String {
    base64::encode(data)
}

#[wasm_bindgen]
pub fn decode_base64(data: &str) -> Result<Vec<u8>, JsValue> {
    base64::decode(data)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}

// Set up allocator for WebAssembly
#[cfg(target_arch = "wasm32")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Initialize function called when WASM module loads
#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
    console::log_1(&"Katalyst Terminal WASM module loaded".into());
}