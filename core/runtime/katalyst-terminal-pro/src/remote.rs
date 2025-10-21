use anyhow::Result;
use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        Extension, Path, Query, State,
    },
    http::StatusCode,
    response::{Html, IntoResponse, Response},
    routing::{get, post},
    Router,
};
use futures::{sink::SinkExt, stream::StreamExt};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    net::SocketAddr,
    sync::Arc,
    time::Duration,
};
use tokio::{
    net::TcpListener,
    sync::{broadcast, Mutex, RwLock},
    time::interval,
};
use tower_http::{
    cors::{Any, CorsLayer},
    compression::CompressionLayer,
    services::ServeDir,
    trace::TraceLayer,
};
use uuid::Uuid;

/// Remote connection manager for WebSocket clients
pub struct RemoteConnectionManager {
    config: RemoteConfig,
    connections: Arc<RwLock<HashMap<String, RemoteConnection>>>,
    sessions: Arc<RwLock<HashMap<String, RemoteSession>>>,
    broadcast_tx: broadcast::Sender<BroadcastMessage>,
    server_handle: Option<tokio::task::JoinHandle<()>>,
}

impl RemoteConnectionManager {
    pub async fn new(config: &RemoteConfig) -> Result<Self> {
        let (broadcast_tx, _) = broadcast::channel(1024);
        
        Ok(Self {
            config: config.clone(),
            connections: Arc::new(RwLock::new(HashMap::new())),
            sessions: Arc::new(RwLock::new(HashMap::new())),
            broadcast_tx,
            server_handle: None,
        })
    }
    
    pub async fn start(&mut self) -> Result<()> {
        if !self.config.enabled {
            return Ok(());
        }
        
        tracing::info!("Starting remote connection manager on {}", self.config.bind_address);
        
        let app = self.create_router().await?;
        let addr = self.config.bind_address.parse::<SocketAddr>()?;
        
        let listener = TcpListener::bind(addr).await?;
        
        let server = axum::serve(listener, app);
        
        let handle = tokio::spawn(async move {
            if let Err(e) = server.await {
                tracing::error!("Server error: {}", e);
            }
        });
        
        self.server_handle = Some(handle);
        
        tracing::info!("Remote server started on {}", addr);
        Ok(())
    }
    
    pub async fn stop(&mut self) -> Result<()> {
        if let Some(handle) = self.server_handle.take() {
            handle.abort();
        }
        
        // Close all connections
        let connections = self.connections.read().await;
        for (id, _) in connections.iter() {
            tracing::info!("Closing connection: {}", id);
        }
        
        Ok(())
    }
    
    pub async fn connect(&self, url: &str) -> Result<()> {
        tracing::info!("Connecting to remote server: {}", url);
        
        // Parse URL and establish connection
        let client = RemoteClient::new(url).await?;
        
        let connection = RemoteConnection {
            id: Uuid::new_v4().to_string(),
            url: url.to_string(),
            client: Arc::new(Mutex::new(client)),
            connected_at: chrono::Utc::now(),
            last_ping: chrono::Utc::now(),
        };
        
        self.connections.write().await.insert(connection.id.clone(), connection);
        
        Ok(())
    }
    
    pub async fn connection_count(&self) -> usize {
        self.connections.read().await.len()
    }
    
    async fn create_router(&self) -> Result<Router> {
        let app_state = AppState {
            connections: self.connections.clone(),
            sessions: self.sessions.clone(),
            broadcast_tx: self.broadcast_tx.clone(),
            config: self.config.clone(),
        };
        
        let cors = CorsLayer::new()
            .allow_origin(Any)
            .allow_methods(Any)
            .allow_headers(Any);
        
        let app = Router::new()
            // WebSocket endpoint
            .route("/ws", get(websocket_handler))
            // REST API endpoints
            .route("/api/sessions", get(list_sessions))
            .route("/api/sessions", post(create_session))
            .route("/api/sessions/:id", get(get_session))
            .route("/api/sessions/:id", axum::routing::delete(delete_session))
            .route("/api/health", get(health_check))
            // Static file serving for web UI
            .nest_service("/", ServeDir::new(&self.config.static_dir))
            // Middleware
            .layer(cors)
            .layer(CompressionLayer::new())
            .layer(TraceLayer::new_for_http())
            .with_state(app_state);
        
        Ok(app)
    }
}

#[derive(Clone)]
struct AppState {
    connections: Arc<RwLock<HashMap<String, RemoteConnection>>>,
    sessions: Arc<RwLock<HashMap<String, RemoteSession>>>,
    broadcast_tx: broadcast::Sender<BroadcastMessage>,
    config: RemoteConfig,
}

async fn websocket_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_websocket(socket, state))
}

async fn handle_websocket(socket: WebSocket, state: AppState) {
    let connection_id = Uuid::new_v4().to_string();
    tracing::info!("New WebSocket connection: {}", connection_id);
    
    let (mut sender, mut receiver) = socket.split();
    
    // Create broadcast receiver for this connection
    let mut broadcast_rx = state.broadcast_tx.subscribe();
    
    // Send initial connection confirmation
    let welcome = serde_json::to_string(&ServerMessage::Connected {
        connection_id: connection_id.clone(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    }).unwrap();
    
    if sender.send(Message::Text(welcome)).await.is_err() {
        return;
    }
    
    // Spawn task to handle outgoing messages
    let connection_id_clone = connection_id.clone();
    let mut sender_clone = sender.clone();
    
    let send_task = tokio::spawn(async move {
        while let Ok(msg) = broadcast_rx.recv().await {
            // Only send messages intended for this connection or broadcast messages
            if msg.target == connection_id_clone || msg.target == "*" {
                if sender_clone.send(Message::Text(msg.content)).await.is_err() {
                    break;
                }
            }
        }
    });
    
    // Handle incoming messages
    while let Some(msg) = receiver.next().await {
        if let Ok(msg) = msg {
            match msg {
                Message::Text(text) => {
                    if let Ok(request) = serde_json::from_str::<ClientRequest>(&text) {
                        handle_client_request(request, &connection_id, &state).await;
                    }
                }
                Message::Binary(data) => {
                    // Handle binary data (terminal output, file transfers, etc.)
                    handle_binary_data(&data, &connection_id, &state).await;
                }
                Message::Ping(_) => {
                    // Pong is handled automatically by axum
                }
                Message::Close(_) => {
                    break;
                }
                _ => {}
            }
        } else {
            break;
        }
    }
    
    // Clean up
    send_task.abort();
    state.connections.write().await.remove(&connection_id);
    tracing::info!("WebSocket connection closed: {}", connection_id);
}

async fn handle_client_request(
    request: ClientRequest,
    connection_id: &str,
    state: &AppState,
) {
    let response = match request {
        ClientRequest::CreateSession { repo_url, session_type } => {
            match create_remote_session(&repo_url, session_type, state).await {
                Ok(session_id) => ServerMessage::SessionCreated { session_id },
                Err(e) => ServerMessage::Error {
                    message: e.to_string(),
                },
            }
        }
        ClientRequest::CloseSession { session_id } => {
            state.sessions.write().await.remove(&session_id);
            ServerMessage::SessionClosed { session_id }
        }
        ClientRequest::TerminalInput { session_id, input } => {
            // Forward input to the appropriate session
            if let Some(session) = state.sessions.read().await.get(&session_id) {
                // Process terminal input
                tracing::debug!("Terminal input for session {}: {}", session_id, input);
                
                // Echo back for now (would forward to actual terminal)
                ServerMessage::TerminalOutput {
                    session_id,
                    output: format!("echo: {}", input),
                }
            } else {
                ServerMessage::Error {
                    message: format!("Session not found: {}", session_id),
                }
            }
        }
        ClientRequest::ExecuteCommand { session_id, command } => {
            if let Some(session) = state.sessions.read().await.get(&session_id) {
                // Execute command in session
                tracing::info!("Executing command in session {}: {}", session_id, command);
                
                ServerMessage::TerminalOutput {
                    session_id,
                    output: format!("$ {}\n", command),
                }
            } else {
                ServerMessage::Error {
                    message: format!("Session not found: {}", session_id),
                }
            }
        }
        ClientRequest::ListSessions => {
            let sessions = state.sessions.read().await;
            let session_list: Vec<SessionInfo> = sessions
                .values()
                .map(|s| SessionInfo {
                    id: s.id.clone(),
                    repo_url: s.repo_url.clone(),
                    session_type: s.session_type.clone(),
                    created_at: s.created_at.to_rfc3339(),
                })
                .collect();
            
            ServerMessage::SessionList {
                sessions: session_list,
            }
        }
        ClientRequest::Resize { width, height } => {
            tracing::info!("Terminal resize: {}x{}", width, height);
            ServerMessage::ResizeAcknowledged
        }
    };
    
    // Send response
    let response_json = serde_json::to_string(&response).unwrap();
    let _ = state.broadcast_tx.send(BroadcastMessage {
        target: connection_id.to_string(),
        content: response_json,
    });
}

async fn handle_binary_data(
    data: &[u8],
    connection_id: &str,
    state: &AppState,
) {
    // Handle binary protocol messages
    tracing::debug!("Received {} bytes of binary data from {}", data.len(), connection_id);
}

async fn create_remote_session(
    repo_url: &str,
    session_type: SessionType,
    state: &AppState,
) -> Result<String> {
    let session_id = format!("session-{}", Uuid::new_v4());
    
    let session = RemoteSession {
        id: session_id.clone(),
        repo_url: Some(repo_url.to_string()),
        session_type,
        container_id: None,
        created_at: chrono::Utc::now(),
        last_activity: chrono::Utc::now(),
    };
    
    state.sessions.write().await.insert(session_id.clone(), session);
    
    tracing::info!("Created remote session: {}", session_id);
    Ok(session_id)
}

// REST API handlers
async fn list_sessions(State(state): State<AppState>) -> impl IntoResponse {
    let sessions = state.sessions.read().await;
    let session_list: Vec<SessionInfo> = sessions
        .values()
        .map(|s| SessionInfo {
            id: s.id.clone(),
            repo_url: s.repo_url.clone(),
            session_type: s.session_type.clone(),
            created_at: s.created_at.to_rfc3339(),
        })
        .collect();
    
    axum::Json(session_list)
}

async fn create_session(
    State(state): State<AppState>,
    axum::Json(payload): axum::Json<CreateSessionRequest>,
) -> impl IntoResponse {
    match create_remote_session(&payload.repo_url, payload.session_type, &state).await {
        Ok(session_id) => {
            (StatusCode::CREATED, axum::Json(CreateSessionResponse {
                session_id,
            }))
        }
        Err(e) => {
            (StatusCode::INTERNAL_SERVER_ERROR, axum::Json(CreateSessionResponse {
                session_id: format!("Error: {}", e),
            }))
        }
    }
}

async fn get_session(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> impl IntoResponse {
    let sessions = state.sessions.read().await;
    
    if let Some(session) = sessions.get(&id) {
        axum::Json(SessionInfo {
            id: session.id.clone(),
            repo_url: session.repo_url.clone(),
            session_type: session.session_type.clone(),
            created_at: session.created_at.to_rfc3339(),
        })
    } else {
        axum::Json(SessionInfo {
            id: "not_found".to_string(),
            repo_url: None,
            session_type: SessionType::Local,
            created_at: String::new(),
        })
    }
}

async fn delete_session(
    Path(id): Path<String>,
    State(state): State<AppState>,
) -> impl IntoResponse {
    state.sessions.write().await.remove(&id);
    StatusCode::NO_CONTENT
}

async fn health_check() -> impl IntoResponse {
    axum::Json(serde_json::json!({
        "status": "healthy",
        "version": env!("CARGO_PKG_VERSION"),
        "timestamp": chrono::Utc::now().to_rfc3339(),
    }))
}

#[derive(Debug, Clone)]
struct RemoteConnection {
    id: String,
    url: String,
    client: Arc<Mutex<RemoteClient>>,
    connected_at: chrono::DateTime<chrono::Utc>,
    last_ping: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone)]
struct RemoteSession {
    id: String,
    repo_url: Option<String>,
    session_type: SessionType,
    container_id: Option<String>,
    created_at: chrono::DateTime<chrono::Utc>,
    last_activity: chrono::DateTime<chrono::Utc>,
}

struct RemoteClient {
    url: String,
    // WebSocket client implementation
}

impl RemoteClient {
    async fn new(url: &str) -> Result<Self> {
        Ok(Self {
            url: url.to_string(),
        })
    }
}

#[derive(Debug, Clone)]
struct BroadcastMessage {
    target: String,  // Connection ID or "*" for broadcast
    content: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RemoteConfig {
    pub enabled: bool,
    pub bind_address: String,
    pub tls_cert: Option<String>,
    pub tls_key: Option<String>,
    pub auth_token: Option<String>,
    pub static_dir: String,
    pub max_connections: usize,
    pub session_timeout_minutes: u64,
}

impl Default for RemoteConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            bind_address: "0.0.0.0:8080".to_string(),
            tls_cert: None,
            tls_key: None,
            auth_token: None,
            static_dir: "./static".to_string(),
            max_connections: 100,
            session_timeout_minutes: 60,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
enum ClientRequest {
    CreateSession {
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
    ListSessions,
    Resize {
        width: u32,
        height: u32,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
enum ServerMessage {
    Connected {
        connection_id: String,
        version: String,
    },
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
    ResizeAcknowledged,
    Error {
        message: String,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct SessionInfo {
    id: String,
    repo_url: Option<String>,
    session_type: SessionType,
    created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
enum SessionType {
    Development,
    Remote,
    Local,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct CreateSessionRequest {
    repo_url: String,
    session_type: SessionType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct CreateSessionResponse {
    session_id: String,
}