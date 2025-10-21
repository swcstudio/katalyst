defmodule KatalystWeb.ClaudeCodeController do
  @moduledoc """
  REST API controller for Claude Code integration.
  Provides programmatic access to Claude Code for WASM frontend.
  """

  use KatalystWeb, :controller
  
  alias Katalyst.ClaudeCode.SessionManager
  
  action_fallback KatalystWeb.FallbackController

  @doc """
  Create a new Claude Code session.
  
  POST /api/claude-code/sessions
  """
  def create_session(conn, %{"config" => config}) do
    with {:ok, session} <- SessionManager.create_session(config) do
      conn
      |> put_status(:created)
      |> json(%{
        status: "success",
        session: session
      })
    end
  end

  @doc """
  Send a message to a Claude Code session.
  
  POST /api/claude-code/sessions/:session_id/messages
  """
  def send_message(conn, %{"session_id" => session_id, "message" => message}) do
    with {:ok, response} <- SessionManager.send_message(session_id, message) do
      json(conn, %{
        status: "success",
        response: response
      })
    end
  end

  @doc """
  Execute a tool in a Claude Code session.
  
  POST /api/claude-code/sessions/:session_id/tools
  """
  def execute_tool(conn, %{"session_id" => session_id, "tool" => tool_name, "parameters" => params}) do
    with {:ok, result} <- SessionManager.execute_tool(session_id, tool_name, params) do
      json(conn, %{
        status: "success",
        result: result
      })
    end
  end

  @doc """
  Get session information.
  
  GET /api/claude-code/sessions/:session_id
  """
  def get_session(conn, %{"session_id" => session_id}) do
    with {:ok, session} <- SessionManager.get_session(session_id) do
      json(conn, %{
        status: "success",
        session: session
      })
    end
  end

  @doc """
  List all active sessions.
  
  GET /api/claude-code/sessions
  """
  def list_sessions(conn, _params) do
    with {:ok, sessions} <- SessionManager.list_sessions() do
      json(conn, %{
        status: "success",
        sessions: sessions
      })
    end
  end

  @doc """
  Terminate a session.
  
  DELETE /api/claude-code/sessions/:session_id
  """
  def terminate_session(conn, %{"session_id" => session_id}) do
    with :ok <- SessionManager.terminate_session(session_id) do
      json(conn, %{
        status: "success",
        message: "Session terminated"
      })
    end
  end

  @doc """
  Get system metrics.
  
  GET /api/claude-code/metrics
  """
  def get_metrics(conn, _params) do
    with {:ok, metrics} <- SessionManager.get_metrics() do
      json(conn, %{
        status: "success",
        metrics: metrics
      })
    end
  end

  @doc """
  Execute batch operations.
  
  POST /api/claude-code/batch
  """
  def batch_execute(conn, %{"operations" => operations}) do
    with {:ok, results} <- SessionManager.batch_execute(operations) do
      json(conn, %{
        status: "success",
        results: results
      })
    end
  end

  @doc """
  Create a session pool.
  
  POST /api/claude-code/pools
  """
  def create_pool(conn, %{"name" => pool_name, "config" => config, "size" => size}) do
    with {:ok, pool} <- SessionManager.create_pool(pool_name, config, size) do
      conn
      |> put_status(:created)
      |> json(%{
        status: "success",
        pool: pool
      })
    end
  end

  @doc """
  Get a session from a pool.
  
  GET /api/claude-code/pools/:pool_name/session
  """
  def get_pool_session(conn, %{"pool_name" => pool_name}) do
    with {:ok, session} <- SessionManager.get_pool_session(pool_name) do
      json(conn, %{
        status: "success",
        session: session
      })
    end
  end

  @doc """
  Programmatic actions for WASM frontend.
  These are high-level actions that combine multiple operations.
  """
  
  @doc """
  Generate code based on a prompt.
  
  POST /api/claude-code/actions/generate-code
  """
  def generate_code(conn, %{"prompt" => prompt, "language" => language} = params) do
    config = %{
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.7,
      tools: ["Write", "Edit"],
      memory_enabled: false,
      mcp_servers: [],
      environment: %{}
    }
    
    with {:ok, session} <- SessionManager.create_session(config),
         message = %{
           role: "user",
           content: "Generate #{language} code: #{prompt}",
           timestamp: DateTime.utc_now() |> DateTime.to_iso8601(),
           metadata: %{}
         },
         {:ok, response} <- SessionManager.send_message(session.id, message),
         :ok <- SessionManager.terminate_session(session.id) do
      
      json(conn, %{
        status: "success",
        code: response.message,
        language: language
      })
    end
  end

  @doc """
  Analyze code and provide improvements.
  
  POST /api/claude-code/actions/analyze-code
  """
  def analyze_code(conn, %{"code" => code, "language" => language}) do
    config = %{
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.5,
      tools: ["Read"],
      memory_enabled: false,
      mcp_servers: [],
      environment: %{}
    }
    
    with {:ok, session} <- SessionManager.create_session(config),
         message = %{
           role: "user",
           content: "Analyze this #{language} code and suggest improvements:\n\n```#{language}\n#{code}\n```",
           timestamp: DateTime.utc_now() |> DateTime.to_iso8601(),
           metadata: %{}
         },
         {:ok, response} <- SessionManager.send_message(session.id, message),
         :ok <- SessionManager.terminate_session(session.id) do
      
      json(conn, %{
        status: "success",
        analysis: response.message
      })
    end
  end

  @doc """
  Refactor code according to best practices.
  
  POST /api/claude-code/actions/refactor-code
  """
  def refactor_code(conn, %{"code" => code, "language" => language, "instructions" => instructions}) do
    config = %{
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.3,
      tools: ["Edit"],
      memory_enabled: false,
      mcp_servers: [],
      environment: %{}
    }
    
    with {:ok, session} <- SessionManager.create_session(config),
         message = %{
           role: "user",
           content: "Refactor this #{language} code according to: #{instructions}\n\n```#{language}\n#{code}\n```",
           timestamp: DateTime.utc_now() |> DateTime.to_iso8601(),
           metadata: %{}
         },
         {:ok, response} <- SessionManager.send_message(session.id, message),
         :ok <- SessionManager.terminate_session(session.id) do
      
      json(conn, %{
        status: "success",
        refactored_code: response.message
      })
    end
  end

  @doc """
  Write tests for given code.
  
  POST /api/claude-code/actions/write-tests
  """
  def write_tests(conn, %{"code" => code, "language" => language, "framework" => framework}) do
    config = %{
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.5,
      tools: ["Write"],
      memory_enabled: false,
      mcp_servers: [],
      environment: %{}
    }
    
    with {:ok, session} <- SessionManager.create_session(config),
         message = %{
           role: "user",
           content: "Write comprehensive tests for this #{language} code using #{framework}:\n\n```#{language}\n#{code}\n```",
           timestamp: DateTime.utc_now() |> DateTime.to_iso8601(),
           metadata: %{}
         },
         {:ok, response} <- SessionManager.send_message(session.id, message),
         :ok <- SessionManager.terminate_session(session.id) do
      
      json(conn, %{
        status: "success",
        tests: response.message,
        framework: framework
      })
    end
  end

  @doc """
  Debug code and identify issues.
  
  POST /api/claude-code/actions/debug-code
  """
  def debug_code(conn, %{"code" => code, "error" => error_message, "language" => language}) do
    config = %{
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.3,
      tools: ["Read", "Edit"],
      memory_enabled: false,
      mcp_servers: [],
      environment: %{}
    }
    
    with {:ok, session} <- SessionManager.create_session(config),
         message = %{
           role: "user",
           content: "Debug this #{language} code that has the following error: #{error_message}\n\n```#{language}\n#{code}\n```",
           timestamp: DateTime.utc_now() |> DateTime.to_iso8601(),
           metadata: %{}
         },
         {:ok, response} <- SessionManager.send_message(session.id, message),
         :ok <- SessionManager.terminate_session(session.id) do
      
      json(conn, %{
        status: "success",
        debug_info: response.message,
        fixed_code: response.message
      })
    end
  end

  @doc """
  Generate documentation for code.
  
  POST /api/claude-code/actions/generate-docs
  """
  def generate_docs(conn, %{"code" => code, "language" => language, "style" => doc_style}) do
    config = %{
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.5,
      tools: ["Write"],
      memory_enabled: false,
      mcp_servers: [],
      environment: %{}
    }
    
    with {:ok, session} <- SessionManager.create_session(config),
         message = %{
           role: "user",
           content: "Generate #{doc_style} documentation for this #{language} code:\n\n```#{language}\n#{code}\n```",
           timestamp: DateTime.utc_now() |> DateTime.to_iso8601(),
           metadata: %{}
         },
         {:ok, response} <- SessionManager.send_message(session.id, message),
         :ok <- SessionManager.terminate_session(session.id) do
      
      json(conn, %{
        status: "success",
        documentation: response.message
      })
    end
  end

  @doc """
  Convert code from one language to another.
  
  POST /api/claude-code/actions/convert-code
  """
  def convert_code(conn, %{"code" => code, "from_language" => from_lang, "to_language" => to_lang}) do
    config = %{
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.3,
      tools: ["Write"],
      memory_enabled: false,
      mcp_servers: [],
      environment: %{}
    }
    
    with {:ok, session} <- SessionManager.create_session(config),
         message = %{
           role: "user",
           content: "Convert this #{from_lang} code to #{to_lang}:\n\n```#{from_lang}\n#{code}\n```",
           timestamp: DateTime.utc_now() |> DateTime.to_iso8601(),
           metadata: %{}
         },
         {:ok, response} <- SessionManager.send_message(session.id, message),
         :ok <- SessionManager.terminate_session(session.id) do
      
      json(conn, %{
        status: "success",
        converted_code: response.message,
        from: from_lang,
        to: to_lang
      })
    end
  end
end