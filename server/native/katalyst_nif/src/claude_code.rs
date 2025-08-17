use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use uuid::Uuid;
use chrono::{DateTime, Utc};
use dashmap::DashMap;
use once_cell::sync::Lazy;
use tracing::{error, info};
use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader, Write};

// Session management - no Python runtime storage needed
static CLAUDE_SESSIONS: Lazy<Arc<DashMap<String, ClaudeSession>>> = Lazy::new(|| {
    Arc::new(DashMap::new())
});

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClaudeSession {
    pub id: String,
    pub created_at: DateTime<Utc>,
    pub last_activity: DateTime<Utc>,
    pub status: SessionStatus,
    pub config: SessionConfig,
    pub metrics: SessionMetrics,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum SessionStatus {
    Initializing,
    Active,
    Idle,
    Processing,
    Error(String),
    Terminated,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionConfig {
    pub api_key: Option<String>,
    pub model: String,
    pub temperature: f32,
    pub max_tokens: Option<i32>,
    pub tools: Vec<String>,
    pub memory_enabled: bool,
    pub mcp_servers: Vec<String>,
    pub environment: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionMetrics {
    pub messages_sent: u64,
    pub messages_received: u64,
    pub tokens_used: u64,
    pub errors: u64,
    pub average_response_time_ms: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClaudeMessage {
    pub role: String,
    pub content: String,
    pub timestamp: DateTime<Utc>,
    pub metadata: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClaudeResponse {
    pub session_id: String,
    pub message: String,
    pub tool_calls: Vec<ToolCall>,
    pub tokens_used: u64,
    pub response_time_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolCall {
    pub tool: String,
    pub parameters: HashMap<String, serde_json::Value>,
    pub result: Option<String>,
}

// Call Python bridge via subprocess
async fn call_python_bridge(request: serde_json::Value) -> Result<serde_json::Value, String> {
    let cwd = std::env::current_dir()
        .map_err(|e| format!("Failed to get current directory: {}", e))?;
    let python_path = cwd.join("python_bridge.py");
    let venv_python = cwd.join(".venv/bin/python3");
    
    // Serialize request to JSON
    let request_json = serde_json::to_string(&request)
        .map_err(|e| format!("Failed to serialize request: {}", e))?;
    
    // Try to use venv python first, then fallback to system python3
    let python_cmd = if venv_python.exists() {
        venv_python.to_string_lossy().to_string()
    } else {
        "python3".to_string()
    };
    
    // Execute Python script with request as argument
    let output = Command::new(&python_cmd)
        .arg(&python_path)
        .arg(&request_json)
        .env("VIRTUAL_ENV", cwd.join(".venv"))
        .env("PATH", format!("{}:{}", 
            cwd.join(".venv/bin").display(), 
            std::env::var("PATH").unwrap_or_default()))
        .current_dir(&cwd)
        .output()
        .map_err(|e| format!("Failed to execute Python bridge: {} (cmd: {} {})", e, python_cmd, python_path.display()))?;
    
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Python bridge failed: {}", stderr));
    }
    
    let stdout = String::from_utf8_lossy(&output.stdout);
    let response: serde_json::Value = serde_json::from_str(&stdout)
        .map_err(|e| format!("Failed to parse Python response: {}", e))?;
    
    // Check for error in response
    if let Some(error) = response.get("error") {
        return Err(error.as_str().unwrap_or("Unknown Python error").to_string());
    }
    
    Ok(response)
}

// Initialize Python runtime and Claude Code SDK
pub async fn initialize_python_runtime() -> Result<(), String> {
    let request = serde_json::json!({
        "action": "init",
        "params": {}
    });
    
    let response = call_python_bridge(request).await?;
    
    if let Some(success) = response.get("success") {
        info!("Python runtime initialized: {}", success.as_str().unwrap_or(""));
    }
    
    Ok(())
}

// Create a new Claude Code session
pub async fn create_session(config: SessionConfig) -> Result<ClaudeSession, String> {
    let session_id = Uuid::new_v4().to_string();
    let now = Utc::now();
    
    let session = ClaudeSession {
        id: session_id.clone(),
        created_at: now,
        last_activity: now,
        status: SessionStatus::Initializing,
        config: config.clone(),
        metrics: SessionMetrics {
            messages_sent: 0,
            messages_received: 0,
            tokens_used: 0,
            errors: 0,
            average_response_time_ms: 0.0,
        },
    };
    
    // Create session via Python bridge
    let request = serde_json::json!({
        "action": "create_session",
        "params": {
            "model": config.model,
            "temperature": config.temperature,
            "tools": config.tools,
            "memory_enabled": config.memory_enabled,
            "mcp_servers": config.mcp_servers,
            "environment": config.environment
        }
    });
    
    let response = call_python_bridge(request).await?;
    
    if let Some(session_info) = response.get("session") {
        info!("Created Claude Code session: {}", session_id);
        
        // Update session status
        let mut updated_session = session.clone();
        updated_session.status = SessionStatus::Active;
        
        // Store session
        CLAUDE_SESSIONS.insert(session_id.clone(), updated_session.clone());
        
        Ok(updated_session)
    } else {
        Err("Failed to get session information from Python bridge".to_string())
    }
}

// Send a message to Claude Code
pub async fn send_message(
    session_id: String,
    message: ClaudeMessage,
) -> Result<ClaudeResponse, String> {
    let start_time = std::time::Instant::now();
    
    // Get session
    let mut session = CLAUDE_SESSIONS.get_mut(&session_id)
        .ok_or_else(|| format!("Session not found: {}", session_id))?
        .clone();
    
    // Update session status
    session.status = SessionStatus::Processing;
    session.last_activity = Utc::now();
    session.metrics.messages_sent += 1;
    
    // Send message via Python bridge
    let request = serde_json::json!({
        "action": "send_message",
        "params": {
            "session_id": session_id,
            "message": {
                "role": message.role,
                "content": message.content,
                "timestamp": message.timestamp.to_rfc3339(),
                "metadata": message.metadata
            }
        }
    });
    
    let bridge_response = call_python_bridge(request).await?;
    
    let response = if let Some(resp) = bridge_response.get("response") {
        resp.get("message")
            .and_then(|m| m.as_str())
            .unwrap_or("Response received")
            .to_string()
    } else {
        "Response received".to_string()
    };
    
    let response_time = start_time.elapsed().as_millis() as u64;
    
    // Update session metrics
    session.metrics.messages_received += 1;
    session.metrics.average_response_time_ms = 
        (session.metrics.average_response_time_ms * (session.metrics.messages_received - 1) as f64 
         + response_time as f64) / session.metrics.messages_received as f64;
    session.status = SessionStatus::Active;
    
    // Update stored session
    CLAUDE_SESSIONS.insert(session_id.clone(), session);
    
    Ok(ClaudeResponse {
        session_id,
        message: response,
        tool_calls: vec![],
        tokens_used: 0, // Would get from actual SDK
        response_time_ms: response_time,
    })
}

// Execute a tool call
pub async fn execute_tool(
    session_id: String,
    tool_name: String,
    parameters: HashMap<String, serde_json::Value>,
) -> Result<String, String> {
    // Get session
    let session = CLAUDE_SESSIONS.get(&session_id)
        .ok_or_else(|| format!("Session not found: {}", session_id))?;
    
    // Check if tool is enabled
    if !session.config.tools.contains(&tool_name) {
        return Err(format!("Tool not enabled: {}", tool_name));
    }
    
    // Execute tool via Python bridge
    let request = serde_json::json!({
        "action": "execute_tool",
        "params": {
            "session_id": session_id,
            "tool_name": tool_name,
            "parameters": parameters
        }
    });
    
    let response = call_python_bridge(request).await?;
    
    if let Some(result) = response.get("result") {
        Ok(result.as_str().unwrap_or("Tool executed").to_string())
    } else {
        Err("Failed to get tool result from Python bridge".to_string())
    }
}

// List available tools
pub async fn list_tools() -> Result<Vec<String>, String> {
    let request = serde_json::json!({
        "action": "list_tools",
        "params": {}
    });
    
    let response = call_python_bridge(request).await?;
    
    if let Some(tools) = response.get("tools") {
        let tools_vec: Vec<String> = tools.as_array()
            .ok_or("Tools is not an array")?
            .iter()
            .filter_map(|v| v.as_str().map(|s| s.to_string()))
            .collect();
        Ok(tools_vec)
    } else {
        Err("Failed to get tools from Python bridge".to_string())
    }
}

// Get session status
pub fn get_session(session_id: &str) -> Option<ClaudeSession> {
    CLAUDE_SESSIONS.get(session_id).map(|entry| entry.clone())
}

// List all sessions
pub fn list_sessions() -> Vec<ClaudeSession> {
    CLAUDE_SESSIONS.iter().map(|entry| entry.value().clone()).collect()
}

// Terminate a session
pub async fn terminate_session(session_id: String) -> Result<(), String> {
    // Get and update session
    let mut session = CLAUDE_SESSIONS.get_mut(&session_id)
        .ok_or_else(|| format!("Session not found: {}", session_id))?
        .clone();
    
    session.status = SessionStatus::Terminated;
    session.last_activity = Utc::now();
    
    // Clean up Python resources (via bridge if needed)
    info!("Terminated Claude Code session: {}", session_id);
    
    // Remove from active sessions
    CLAUDE_SESSIONS.remove(&session_id);
    
    Ok(())
}

// Clean up idle sessions
pub async fn cleanup_idle_sessions(idle_timeout_minutes: i64) -> Result<usize, String> {
    let cutoff_time = Utc::now() - chrono::Duration::minutes(idle_timeout_minutes);
    let mut removed_count = 0;
    
    let idle_sessions: Vec<String> = CLAUDE_SESSIONS.iter()
        .filter(|entry| entry.last_activity < cutoff_time)
        .map(|entry| entry.key().clone())
        .collect();
    
    for session_id in idle_sessions {
        if terminate_session(session_id).await.is_ok() {
            removed_count += 1;
        }
    }
    
    Ok(removed_count)
}

// Export metrics for all sessions
pub fn export_metrics() -> HashMap<String, SessionMetrics> {
    CLAUDE_SESSIONS.iter()
        .map(|entry| (entry.key().clone(), entry.value().metrics.clone()))
        .collect()
}

// Initialize the module
pub fn init_claude_code() -> Result<(), String> {
    // Set up tracing
    tracing_subscriber::fmt()
        .with_env_filter("info")
        .try_init()
        .ok();
    
    info!("Initializing Claude Code integration");
    
    // Test Python bridge connection
    std::thread::spawn(|| {
        let runtime = tokio::runtime::Runtime::new().unwrap();
        runtime.block_on(async {
            if let Err(e) = initialize_python_runtime().await {
                error!("Failed to initialize Python runtime: {}", e);
            }
        });
    });
    
    Ok(())
}