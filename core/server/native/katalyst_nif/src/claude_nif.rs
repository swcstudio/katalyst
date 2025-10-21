use rustler::{Atom, NifResult};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tokio::runtime::Runtime;
use once_cell::sync::Lazy;
use uuid::Uuid;

use crate::claude_code::{
    self, ClaudeMessage, SessionConfig,
};

mod atoms {
    rustler::atoms! {
        ok,
        error,
        success,
        failure,
        session_created,
        message_sent,
        tool_executed,
        session_terminated,
        metrics_exported,
        idle_sessions_cleaned,
    }
}

// Global Tokio runtime for async operations
static TOKIO_RUNTIME: Lazy<Runtime> = Lazy::new(|| {
    Runtime::new().expect("Failed to create Tokio runtime")
});

/// Initialize Claude Code integration
#[rustler::nif]
pub fn claude_init() -> NifResult<(Atom, String)> {
    match claude_code::init_claude_code() {
        Ok(_) => Ok((atoms::ok(), "Claude Code initialized successfully".to_string())),
        Err(e) => Ok((atoms::error(), format!("Initialization failed: {}", e))),
    }
}

/// Create a new Claude Code session
#[rustler::nif]
pub fn claude_create_session(config_json: String) -> NifResult<(Atom, String)> {
    let config: SessionConfig = match serde_json::from_str(&config_json) {
        Ok(c) => c,
        Err(e) => return Ok((atoms::error(), format!("Invalid config: {}", e))),
    };
    
    let result = TOKIO_RUNTIME.block_on(async {
        claude_code::create_session(config).await
    });
    
    match result {
        Ok(session) => {
            match serde_json::to_string(&session) {
                Ok(json) => Ok((atoms::session_created(), json)),
                Err(e) => Ok((atoms::error(), format!("Serialization error: {}", e))),
            }
        }
        Err(e) => Ok((atoms::error(), format!("Failed to create session: {}", e))),
    }
}

/// Send a message to Claude Code
#[rustler::nif]
pub fn claude_send_message(session_id: String, message_json: String) -> NifResult<(Atom, String)> {
    let message: ClaudeMessage = match serde_json::from_str(&message_json) {
        Ok(m) => m,
        Err(e) => return Ok((atoms::error(), format!("Invalid message: {}", e))),
    };
    
    let result = TOKIO_RUNTIME.block_on(async {
        claude_code::send_message(session_id, message).await
    });
    
    match result {
        Ok(response) => {
            match serde_json::to_string(&response) {
                Ok(json) => Ok((atoms::message_sent(), json)),
                Err(e) => Ok((atoms::error(), format!("Serialization error: {}", e))),
            }
        }
        Err(e) => Ok((atoms::error(), format!("Failed to send message: {}", e))),
    }
}

/// Execute a tool in Claude Code
#[rustler::nif]
pub fn claude_execute_tool(
    session_id: String,
    tool_name: String,
    parameters_json: String,
) -> NifResult<(Atom, String)> {
    let parameters: HashMap<String, serde_json::Value> = match serde_json::from_str(&parameters_json) {
        Ok(p) => p,
        Err(e) => return Ok((atoms::error(), format!("Invalid parameters: {}", e))),
    };
    
    let result = TOKIO_RUNTIME.block_on(async {
        claude_code::execute_tool(session_id, tool_name, parameters).await
    });
    
    match result {
        Ok(response) => Ok((atoms::tool_executed(), response)),
        Err(e) => Ok((atoms::error(), format!("Tool execution failed: {}", e))),
    }
}

/// Get session information
#[rustler::nif]
pub fn claude_get_session(session_id: String) -> NifResult<(Atom, String)> {
    match claude_code::get_session(&session_id) {
        Some(session) => {
            match serde_json::to_string(&session) {
                Ok(json) => Ok((atoms::ok(), json)),
                Err(e) => Ok((atoms::error(), format!("Serialization error: {}", e))),
            }
        }
        None => Ok((atoms::error(), format!("Session not found: {}", session_id))),
    }
}

/// List all active sessions
#[rustler::nif]
pub fn claude_list_sessions() -> NifResult<(Atom, String)> {
    let sessions = claude_code::list_sessions();
    match serde_json::to_string(&sessions) {
        Ok(json) => Ok((atoms::ok(), json)),
        Err(e) => Ok((atoms::error(), format!("Serialization error: {}", e))),
    }
}

/// List available tools
#[rustler::nif]
pub fn claude_list_tools() -> NifResult<(Atom, String)> {
    let result = TOKIO_RUNTIME.block_on(async {
        claude_code::list_tools().await
    });
    
    match result {
        Ok(tools) => {
            match serde_json::to_string(&tools) {
                Ok(json) => Ok((atoms::ok(), json)),
                Err(e) => Ok((atoms::error(), format!("Serialization error: {}", e))),
            }
        }
        Err(e) => Ok((atoms::error(), format!("Failed to list tools: {}", e))),
    }
}

/// Terminate a Claude Code session
#[rustler::nif]
pub fn claude_terminate_session(session_id: String) -> NifResult<(Atom, String)> {
    let result = TOKIO_RUNTIME.block_on(async {
        claude_code::terminate_session(session_id.clone()).await
    });
    
    match result {
        Ok(_) => Ok((atoms::session_terminated(), format!("Session {} terminated", session_id))),
        Err(e) => Ok((atoms::error(), format!("Failed to terminate session: {}", e))),
    }
}

/// Clean up idle sessions
#[rustler::nif]
pub fn claude_cleanup_idle_sessions(idle_timeout_minutes: i64) -> NifResult<(Atom, String)> {
    let result = TOKIO_RUNTIME.block_on(async {
        claude_code::cleanup_idle_sessions(idle_timeout_minutes).await
    });
    
    match result {
        Ok(count) => Ok((
            atoms::idle_sessions_cleaned(),
            format!("{} idle sessions cleaned up", count),
        )),
        Err(e) => Ok((atoms::error(), format!("Cleanup failed: {}", e))),
    }
}

/// Export metrics for all sessions
#[rustler::nif]
pub fn claude_export_metrics() -> NifResult<(Atom, String)> {
    let metrics = claude_code::export_metrics();
    match serde_json::to_string(&metrics) {
        Ok(json) => Ok((atoms::metrics_exported(), json)),
        Err(e) => Ok((atoms::error(), format!("Failed to export metrics: {}", e))),
    }
}

/// Batch create sessions for concurrent processing
#[rustler::nif]
pub fn claude_batch_create_sessions(configs_json: String) -> NifResult<(Atom, String)> {
    let configs: Vec<SessionConfig> = match serde_json::from_str(&configs_json) {
        Ok(c) => c,
        Err(e) => return Ok((atoms::error(), format!("Invalid configs: {}", e))),
    };
    
    let results = TOKIO_RUNTIME.block_on(async {
        let mut sessions = Vec::new();
        for config in configs {
            match claude_code::create_session(config).await {
                Ok(session) => sessions.push(session),
                Err(e) => {
                    // Log error but continue with other sessions
                    eprintln!("Failed to create session: {}", e);
                }
            }
        }
        sessions
    });
    
    match serde_json::to_string(&results) {
        Ok(json) => Ok((atoms::ok(), json)),
        Err(e) => Ok((atoms::error(), format!("Serialization error: {}", e))),
    }
}

/// Send messages to multiple sessions concurrently
#[rustler::nif]
pub fn claude_batch_send_messages(messages_json: String) -> NifResult<(Atom, String)> {
    #[derive(Deserialize)]
    struct BatchMessage {
        session_id: String,
        message: ClaudeMessage,
    }
    
    let batch_messages: Vec<BatchMessage> = match serde_json::from_str(&messages_json) {
        Ok(m) => m,
        Err(e) => return Ok((atoms::error(), format!("Invalid messages: {}", e))),
    };
    
    let results = TOKIO_RUNTIME.block_on(async {
        let mut responses = Vec::new();
        let mut handles = Vec::new();
        
        for batch_msg in batch_messages {
            let handle = tokio::spawn(async move {
                claude_code::send_message(batch_msg.session_id, batch_msg.message).await
            });
            handles.push(handle);
        }
        
        for handle in handles {
            match handle.await {
                Ok(Ok(response)) => responses.push(response),
                Ok(Err(e)) => eprintln!("Message send error: {}", e),
                Err(e) => eprintln!("Task join error: {}", e),
            }
        }
        
        responses
    });
    
    match serde_json::to_string(&results) {
        Ok(json) => Ok((atoms::ok(), json)),
        Err(e) => Ok((atoms::error(), format!("Serialization error: {}", e))),
    }
}

/// Configure MCP (Model Context Protocol) servers
#[rustler::nif]
pub fn claude_configure_mcp(session_id: String, mcp_servers_json: String) -> NifResult<(Atom, String)> {
    let _mcp_servers: Vec<String> = match serde_json::from_str(&mcp_servers_json) {
        Ok(s) => s,
        Err(e) => return Ok((atoms::error(), format!("Invalid MCP servers: {}", e))),
    };
    
    // In production, this would update the session's MCP configuration
    Ok((atoms::ok(), format!("MCP servers configured for session {}", session_id)))
}

/// Stream responses from Claude Code (returns a stream ID for polling)
#[rustler::nif]
pub fn claude_stream_message(_session_id: String, _message_json: String) -> NifResult<(Atom, String)> {
    let stream_id = Uuid::new_v4().to_string();
    
    // In production, this would set up a streaming connection
    // For now, return a stream ID that can be polled
    Ok((atoms::ok(), stream_id))
}

/// Poll a stream for new data
#[rustler::nif]
pub fn claude_poll_stream(stream_id: String) -> NifResult<(Atom, String)> {
    // In production, this would check for new stream data
    Ok((atoms::ok(), format!("No new data for stream {}", stream_id)))
}