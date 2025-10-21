#!/usr/bin/env python3
"""
Python bridge for Claude Code SDK integration.
This script provides a JSON-RPC style interface for Claude Code operations.
"""

import sys
import json
import os
import asyncio
from typing import Dict, List, Any, Optional
import traceback

# Ensure we're using the virtual environment
venv_path = os.path.join(os.path.dirname(__file__), '.venv', 'lib', 'python3.12', 'site-packages')
if venv_path not in sys.path:
    sys.path.insert(0, venv_path)

try:
    import claude_code_sdk
    from claude_code_sdk import ClaudeSDKClient
    CLAUDE_SDK_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Claude Code SDK not available: {e}", file=sys.stderr)
    CLAUDE_SDK_AVAILABLE = False

# Global client instance
client = None

def init_client() -> Dict[str, Any]:
    """Initialize Claude Code SDK client with session-based auth."""
    global client
    try:
        if not CLAUDE_SDK_AVAILABLE:
            return {"error": "Claude Code SDK not available"}
        
        # Try session-based authentication first (for Claude Max Plan)
        session_token = os.environ.get('CLAUDE_SESSION_TOKEN')
        api_key = os.environ.get('CLAUDE_API_KEY')
        
        if session_token:
            # Use session token authentication (Claude Max Plan)
            try:
                from claude_code_sdk import ClaudeCodeOptions
                options = ClaudeCodeOptions(
                    session_token=session_token,
                    use_session_auth=True
                )
                client = ClaudeSDKClient(options=options)
                return {"success": "Claude Code SDK initialized with session auth"}
            except Exception as e:
                return {"error": f"Session auth failed: {str(e)}. Try setting CLAUDE_API_KEY instead."}
        
        elif api_key:
            # Fall back to API key authentication
            try:
                from claude_code_sdk import ClaudeCodeOptions
                options = ClaudeCodeOptions(api_key=api_key)
                client = ClaudeSDKClient(options=options)
                return {"success": "Claude Code SDK initialized with API key"}
            except Exception as e:
                return {"error": f"API key auth failed: {str(e)}"}
        
        else:
            # Try default initialization (may use environment variables)
            try:
                client = ClaudeSDKClient()
                return {"success": "Claude Code SDK initialized with default auth"}
            except Exception as e:
                return {"error": f"No authentication method available. Set CLAUDE_SESSION_TOKEN or CLAUDE_API_KEY. Error: {str(e)}"}
                
    except Exception as e:
        return {"error": f"Failed to initialize Claude Code SDK: {str(e)}"}

def list_available_tools() -> Dict[str, Any]:
    """List all available tools."""
    try:
        # Common Claude Code tools
        tools = [
            "Read", "Write", "Edit", "MultiEdit",
            "Bash", "Glob", "Grep", 
            "WebSearch", "WebFetch",
            "LS", "TodoWrite", "NotebookEdit",
            "Task", "ExitPlanMode"
        ]
        return {"tools": tools}
    except Exception as e:
        return {"error": f"Failed to list tools: {str(e)}"}

def create_session(config: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new Claude Code session."""
    try:
        if not client:
            init_result = init_client()
            if "error" in init_result:
                return init_result
        
        # Create session configuration
        session_id = f"session_{os.urandom(8).hex()}"
        
        # For now, return a mock session since we need more SDK integration
        session_info = {
            "id": session_id,
            "model": config.get("model", "claude-3-5-sonnet-20241022"),
            "temperature": config.get("temperature", 0.7),
            "tools": config.get("tools", ["Read", "Write"]),
            "memory_enabled": config.get("memory_enabled", False),
            "status": "active",
            "created_at": "2025-08-07T09:37:00Z"
        }
        
        return {"session": session_info}
    except Exception as e:
        return {"error": f"Failed to create session: {str(e)}"}

def get_session(session_id: str) -> Dict[str, Any]:
    """Get session information."""
    try:
        # Mock session retrieval for now
        return {
            "session": {
                "id": session_id,
                "status": "active",
                "last_activity": "2025-08-07T09:37:00Z"
            }
        }
    except Exception as e:
        return {"error": f"Failed to get session: {str(e)}"}

def send_message(session_id: str, message: Dict[str, Any]) -> Dict[str, Any]:
    """Send a message to Claude."""
    try:
        if not client:
            return {"error": "Client not initialized"}
        
        role = message.get("role", "user")
        content = message.get("content", "")
        
        # For now, return a mock response
        response = {
            "session_id": session_id,
            "message": f"Mock response to: {content[:50]}...",
            "role": "assistant",
            "tokens_used": len(content.split()),
            "response_time_ms": 500
        }
        
        return {"response": response}
    except Exception as e:
        return {"error": f"Failed to send message: {str(e)}"}

def execute_tool(session_id: str, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
    """Execute a tool."""
    try:
        # Mock tool execution
        result = f"Mock execution of {tool_name} with parameters: {parameters}"
        
        return {"result": result}
    except Exception as e:
        return {"error": f"Failed to execute tool: {str(e)}"}

def handle_request(request: Dict[str, Any]) -> Dict[str, Any]:
    """Handle a JSON-RPC style request."""
    try:
        action = request.get("action")
        params = request.get("params", {})
        
        if action == "init":
            return init_client()
        elif action == "list_tools":
            return list_available_tools()
        elif action == "create_session":
            return create_session(params)
        elif action == "get_session":
            return get_session(params.get("session_id"))
        elif action == "send_message":
            return send_message(params.get("session_id"), params.get("message", {}))
        elif action == "execute_tool":
            return execute_tool(
                params.get("session_id"),
                params.get("tool_name"),
                params.get("parameters", {})
            )
        else:
            return {"error": f"Unknown action: {action}"}
    except Exception as e:
        return {"error": f"Request handling failed: {str(e)}\n{traceback.format_exc()}"}

def main():
    """Main entry point for the Python bridge."""
    if len(sys.argv) > 1:
        # Command line mode - process single request
        try:
            request_json = sys.argv[1]
            request = json.loads(request_json)
            response = handle_request(request)
            print(json.dumps(response))
        except Exception as e:
            print(json.dumps({"error": f"Failed to process request: {str(e)}"}))
    else:
        # Interactive mode - process requests from stdin
        try:
            for line in sys.stdin:
                line = line.strip()
                if not line:
                    continue
                    
                try:
                    request = json.loads(line)
                    response = handle_request(request)
                    print(json.dumps(response))
                    sys.stdout.flush()
                except json.JSONDecodeError as e:
                    print(json.dumps({"error": f"Invalid JSON: {str(e)}"}))
                except Exception as e:
                    print(json.dumps({"error": f"Processing error: {str(e)}"}))
        except KeyboardInterrupt:
            pass
        except Exception as e:
            print(json.dumps({"error": f"Bridge error: {str(e)}"}), file=sys.stderr)

if __name__ == "__main__":
    main()