defmodule Katalyst.ClaudeCode do
  @moduledoc """
  Elixir wrapper for Claude Code Python SDK via Rust NIFs.
  Provides programmatic access to Claude Code functionality with high performance.
  """

  alias KatalystNif

  @type session_id :: String.t()
  @type tool_name :: String.t()
  
  @type session_config :: %{
    api_key: String.t() | nil,
    model: String.t(),
    temperature: float(),
    max_tokens: integer() | nil,
    tools: list(String.t()),
    memory_enabled: boolean(),
    mcp_servers: list(String.t()),
    environment: map()
  }
  
  @type session :: %{
    id: String.t(),
    created_at: String.t(),
    last_activity: String.t(),
    status: atom(),
    config: session_config(),
    metrics: session_metrics()
  }
  
  @type session_metrics :: %{
    messages_sent: integer(),
    messages_received: integer(),
    tokens_used: integer(),
    errors: integer(),
    average_response_time_ms: float()
  }
  
  @type message :: %{
    role: String.t(),
    content: String.t(),
    timestamp: String.t(),
    metadata: map()
  }
  
  @type response :: %{
    session_id: String.t(),
    message: String.t(),
    tool_calls: list(tool_call()),
    tokens_used: integer(),
    response_time_ms: integer()
  }
  
  @type tool_call :: %{
    tool: String.t(),
    parameters: map(),
    result: String.t() | nil
  }

  @doc """
  Initialize the Claude Code integration.
  Must be called before using any other functions.
  """
  @spec init() :: {:ok, String.t()} | {:error, String.t()}
  def init do
    case KatalystNif.claude_init() do
      {:ok, message} -> {:ok, message}
      {_, error} -> {:error, error}
    end
  end

  @doc """
  Create a new Claude Code session.
  
  ## Examples
  
      config = %{
        api_key: "your-api-key",
        model: "claude-3-5-sonnet-20241022",
        temperature: 0.7,
        max_tokens: nil,
        tools: ["Read", "Write", "Edit", "Bash"],
        memory_enabled: true,
        mcp_servers: [],
        environment: %{}
      }
      
      {:ok, session} = Katalyst.ClaudeCode.create_session(config)
  """
  @spec create_session(session_config()) :: {:ok, session()} | {:error, String.t()}
  def create_session(config) do
    config_json = Jason.encode!(config)
    
    case KatalystNif.claude_create_session(config_json) do
      {:session_created, session_json} ->
        {:ok, Jason.decode!(session_json, keys: :atoms)}
      {_, error} ->
        {:error, error}
    end
  end

  @doc """
  Send a message to Claude Code and get a response.
  
  ## Examples
  
      message = %{
        role: "user",
        content: "Write a function to calculate fibonacci numbers",
        timestamp: DateTime.utc_now() |> DateTime.to_iso8601(),
        metadata: %{}
      }
      
      {:ok, response} = Katalyst.ClaudeCode.send_message(session_id, message)
  """
  @spec send_message(session_id(), message()) :: {:ok, response()} | {:error, String.t()}
  def send_message(session_id, message) do
    message_json = Jason.encode!(message)
    
    case KatalystNif.claude_send_message(session_id, message_json) do
      {:message_sent, response_json} ->
        {:ok, Jason.decode!(response_json, keys: :atoms)}
      {_, error} ->
        {:error, error}
    end
  end

  @doc """
  Execute a tool in Claude Code.
  
  ## Examples
  
      {:ok, result} = Katalyst.ClaudeCode.execute_tool(
        session_id,
        "Read",
        %{file_path: "/path/to/file.ex"}
      )
  """
  @spec execute_tool(session_id(), tool_name(), map()) :: {:ok, String.t()} | {:error, String.t()}
  def execute_tool(session_id, tool_name, parameters) do
    parameters_json = Jason.encode!(parameters)
    
    case KatalystNif.claude_execute_tool(session_id, tool_name, parameters_json) do
      {:tool_executed, result} -> {:ok, result}
      {_, error} -> {:error, error}
    end
  end

  @doc """
  Get information about a specific session.
  """
  @spec get_session(session_id()) :: {:ok, session()} | {:error, String.t()}
  def get_session(session_id) do
    case KatalystNif.claude_get_session(session_id) do
      {:ok, session_json} ->
        {:ok, Jason.decode!(session_json, keys: :atoms)}
      {_, error} ->
        {:error, error}
    end
  end

  @doc """
  List all active Claude Code sessions.
  """
  @spec list_sessions() :: {:ok, list(session())} | {:error, String.t()}
  def list_sessions do
    case KatalystNif.claude_list_sessions() do
      {:ok, sessions_json} ->
        {:ok, Jason.decode!(sessions_json, keys: :atoms)}
      {_, error} ->
        {:error, error}
    end
  end

  @doc """
  List available tools for Claude Code.
  """
  @spec list_tools() :: {:ok, list(String.t())} | {:error, String.t()}
  def list_tools do
    case KatalystNif.claude_list_tools() do
      {:ok, tools_json} ->
        {:ok, Jason.decode!(tools_json)}
      {_, error} ->
        {:error, error}
    end
  end

  @doc """
  Terminate a Claude Code session.
  """
  @spec terminate_session(session_id()) :: :ok | {:error, String.t()}
  def terminate_session(session_id) do
    case KatalystNif.claude_terminate_session(session_id) do
      {:session_terminated, _} -> :ok
      {_, error} -> {:error, error}
    end
  end

  @doc """
  Clean up idle sessions that haven't been active for the specified timeout.
  """
  @spec cleanup_idle_sessions(integer()) :: {:ok, String.t()} | {:error, String.t()}
  def cleanup_idle_sessions(idle_timeout_minutes \\ 30) do
    case KatalystNif.claude_cleanup_idle_sessions(idle_timeout_minutes) do
      {:idle_sessions_cleaned, message} -> {:ok, message}
      {_, error} -> {:error, error}
    end
  end

  @doc """
  Export metrics for all active sessions.
  """
  @spec export_metrics() :: {:ok, map()} | {:error, String.t()}
  def export_metrics do
    case KatalystNif.claude_export_metrics() do
      {:metrics_exported, metrics_json} ->
        {:ok, Jason.decode!(metrics_json, keys: :atoms)}
      {_, error} ->
        {:error, error}
    end
  end

  @doc """
  Create multiple sessions concurrently for batch processing.
  
  ## Examples
  
      configs = [
        %{model: "claude-3-5-sonnet-20241022", temperature: 0.7, ...},
        %{model: "claude-3-5-sonnet-20241022", temperature: 0.9, ...}
      ]
      
      {:ok, sessions} = Katalyst.ClaudeCode.batch_create_sessions(configs)
  """
  @spec batch_create_sessions(list(session_config())) :: {:ok, list(session())} | {:error, String.t()}
  def batch_create_sessions(configs) do
    configs_json = Jason.encode!(configs)
    
    case KatalystNif.claude_batch_create_sessions(configs_json) do
      {:ok, sessions_json} ->
        {:ok, Jason.decode!(sessions_json, keys: :atoms)}
      {_, error} ->
        {:error, error}
    end
  end

  @doc """
  Send messages to multiple sessions concurrently.
  
  ## Examples
  
      messages = [
        %{session_id: "session1", message: %{role: "user", content: "Hello"}},
        %{session_id: "session2", message: %{role: "user", content: "Hi there"}}
      ]
      
      {:ok, responses} = Katalyst.ClaudeCode.batch_send_messages(messages)
  """
  @spec batch_send_messages(list(map())) :: {:ok, list(response())} | {:error, String.t()}
  def batch_send_messages(batch_messages) do
    messages_json = Jason.encode!(batch_messages)
    
    case KatalystNif.claude_batch_send_messages(messages_json) do
      {:ok, responses_json} ->
        {:ok, Jason.decode!(responses_json, keys: :atoms)}
      {_, error} ->
        {:error, error}
    end
  end

  @doc """
  Configure MCP (Model Context Protocol) servers for a session.
  """
  @spec configure_mcp(session_id(), list(String.t())) :: :ok | {:error, String.t()}
  def configure_mcp(session_id, mcp_servers) do
    mcp_servers_json = Jason.encode!(mcp_servers)
    
    case KatalystNif.claude_configure_mcp(session_id, mcp_servers_json) do
      {:ok, _} -> :ok
      {_, error} -> {:error, error}
    end
  end

  @doc """
  Start streaming a message to Claude Code.
  Returns a stream ID that can be polled for responses.
  """
  @spec stream_message(session_id(), message()) :: {:ok, String.t()} | {:error, String.t()}
  def stream_message(session_id, message) do
    message_json = Jason.encode!(message)
    
    case KatalystNif.claude_stream_message(session_id, message_json) do
      {:ok, stream_id} -> {:ok, stream_id}
      {_, error} -> {:error, error}
    end
  end

  @doc """
  Poll a stream for new data.
  """
  @spec poll_stream(String.t()) :: {:ok, String.t()} | {:error, String.t()}
  def poll_stream(stream_id) do
    case KatalystNif.claude_poll_stream(stream_id) do
      {:ok, data} -> {:ok, data}
      {_, error} -> {:error, error}
    end
  end
end