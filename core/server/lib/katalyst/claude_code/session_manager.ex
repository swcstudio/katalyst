defmodule Katalyst.ClaudeCode.SessionManager do
  @moduledoc """
  GenServer for managing concurrent Claude Code sessions.
  Provides pooling, load balancing, and session lifecycle management.
  """

  use GenServer
  require Logger
  
  alias Katalyst.ClaudeCode
  
  @cleanup_interval :timer.minutes(5)
  @idle_timeout_minutes 30
  @max_sessions_per_pool 100
  
  defstruct [
    :sessions,
    :pools,
    :metrics,
    :config,
    :cleanup_ref
  ]

  # Client API

  @doc """
  Start the SessionManager GenServer.
  """
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @doc """
  Create a new Claude Code session with automatic pool assignment.
  """
  def create_session(config) do
    GenServer.call(__MODULE__, {:create_session, config})
  end

  @doc """
  Send a message to a specific session.
  """
  def send_message(session_id, message) do
    GenServer.call(__MODULE__, {:send_message, session_id, message}, :timer.seconds(30))
  end

  @doc """
  Execute a tool in a specific session.
  """
  def execute_tool(session_id, tool_name, parameters) do
    GenServer.call(__MODULE__, {:execute_tool, session_id, tool_name, parameters})
  end

  @doc """
  Get session information.
  """
  def get_session(session_id) do
    GenServer.call(__MODULE__, {:get_session, session_id})
  end

  @doc """
  List all managed sessions.
  """
  def list_sessions do
    GenServer.call(__MODULE__, :list_sessions)
  end

  @doc """
  Terminate a session.
  """
  def terminate_session(session_id) do
    GenServer.call(__MODULE__, {:terminate_session, session_id})
  end

  @doc """
  Get metrics for all sessions.
  """
  def get_metrics do
    GenServer.call(__MODULE__, :get_metrics)
  end

  @doc """
  Execute concurrent operations across multiple sessions.
  """
  def batch_execute(operations) do
    GenServer.call(__MODULE__, {:batch_execute, operations}, :timer.seconds(60))
  end

  @doc """
  Create a session pool for load balancing.
  """
  def create_pool(pool_name, config, size) do
    GenServer.call(__MODULE__, {:create_pool, pool_name, config, size})
  end

  @doc """
  Get the next available session from a pool.
  """
  def get_pool_session(pool_name) do
    GenServer.call(__MODULE__, {:get_pool_session, pool_name})
  end

  # Server Callbacks

  @impl true
  def init(opts) do
    # Initialize Claude Code
    case ClaudeCode.init() do
      {:ok, _} ->
        Logger.info("Claude Code initialized successfully")
      {:error, error} ->
        Logger.error("Failed to initialize Claude Code: #{error}")
    end
    
    # Schedule periodic cleanup
    cleanup_ref = Process.send_after(self(), :cleanup_idle_sessions, @cleanup_interval)
    
    state = %__MODULE__{
      sessions: %{},
      pools: %{},
      metrics: %{
        total_sessions_created: 0,
        total_messages_sent: 0,
        total_tools_executed: 0,
        active_sessions: 0,
        errors: 0
      },
      config: Keyword.get(opts, :config, %{}),
      cleanup_ref: cleanup_ref
    }
    
    {:ok, state}
  end

  @impl true
  def handle_call({:create_session, config}, _from, state) do
    case ClaudeCode.create_session(config) do
      {:ok, session} ->
        new_state = %{state |
          sessions: Map.put(state.sessions, session.id, session),
          metrics: %{state.metrics |
            total_sessions_created: state.metrics.total_sessions_created + 1,
            active_sessions: state.metrics.active_sessions + 1
          }
        }
        
        Logger.info("Created Claude Code session: #{session.id}")
        {:reply, {:ok, session}, new_state}
        
      {:error, error} ->
        new_state = %{state |
          metrics: %{state.metrics | errors: state.metrics.errors + 1}
        }
        
        Logger.error("Failed to create session: #{error}")
        {:reply, {:error, error}, new_state}
    end
  end

  @impl true
  def handle_call({:send_message, session_id, message}, _from, state) do
    if Map.has_key?(state.sessions, session_id) do
      case ClaudeCode.send_message(session_id, message) do
        {:ok, response} ->
          new_state = %{state |
            metrics: %{state.metrics |
              total_messages_sent: state.metrics.total_messages_sent + 1
            }
          }
          
          {:reply, {:ok, response}, new_state}
          
        {:error, error} ->
          new_state = %{state |
            metrics: %{state.metrics | errors: state.metrics.errors + 1}
          }
          
          Logger.error("Failed to send message to session #{session_id}: #{error}")
          {:reply, {:error, error}, new_state}
      end
    else
      {:reply, {:error, "Session not found"}, state}
    end
  end

  @impl true
  def handle_call({:execute_tool, session_id, tool_name, parameters}, _from, state) do
    if Map.has_key?(state.sessions, session_id) do
      case ClaudeCode.execute_tool(session_id, tool_name, parameters) do
        {:ok, result} ->
          new_state = %{state |
            metrics: %{state.metrics |
              total_tools_executed: state.metrics.total_tools_executed + 1
            }
          }
          
          {:reply, {:ok, result}, new_state}
          
        {:error, error} ->
          new_state = %{state |
            metrics: %{state.metrics | errors: state.metrics.errors + 1}
          }
          
          Logger.error("Failed to execute tool in session #{session_id}: #{error}")
          {:reply, {:error, error}, new_state}
      end
    else
      {:reply, {:error, "Session not found"}, state}
    end
  end

  @impl true
  def handle_call({:get_session, session_id}, _from, state) do
    case ClaudeCode.get_session(session_id) do
      {:ok, session} -> {:reply, {:ok, session}, state}
      {:error, error} -> {:reply, {:error, error}, state}
    end
  end

  @impl true
  def handle_call(:list_sessions, _from, state) do
    {:reply, {:ok, Map.values(state.sessions)}, state}
  end

  @impl true
  def handle_call({:terminate_session, session_id}, _from, state) do
    if Map.has_key?(state.sessions, session_id) do
      case ClaudeCode.terminate_session(session_id) do
        :ok ->
          new_state = %{state |
            sessions: Map.delete(state.sessions, session_id),
            metrics: %{state.metrics |
              active_sessions: max(0, state.metrics.active_sessions - 1)
            }
          }
          
          Logger.info("Terminated session: #{session_id}")
          {:reply, :ok, new_state}
          
        {:error, error} ->
          Logger.error("Failed to terminate session #{session_id}: #{error}")
          {:reply, {:error, error}, state}
      end
    else
      {:reply, {:error, "Session not found"}, state}
    end
  end

  @impl true
  def handle_call(:get_metrics, _from, state) do
    # Get metrics from Claude Code
    claude_metrics = case ClaudeCode.export_metrics() do
      {:ok, metrics} -> metrics
      _ -> %{}
    end
    
    combined_metrics = Map.merge(state.metrics, %{
      claude_metrics: claude_metrics,
      pools: Enum.map(state.pools, fn {name, pool} ->
        %{
          name: name,
          size: length(pool.sessions),
          config: pool.config
        }
      end)
    })
    
    {:reply, {:ok, combined_metrics}, state}
  end

  @impl true
  def handle_call({:batch_execute, operations}, _from, state) do
    # Execute operations concurrently
    tasks = Enum.map(operations, fn op ->
      Task.async(fn ->
        case op do
          {:send_message, session_id, message} ->
            ClaudeCode.send_message(session_id, message)
            
          {:execute_tool, session_id, tool_name, parameters} ->
            ClaudeCode.execute_tool(session_id, tool_name, parameters)
            
          _ ->
            {:error, "Unknown operation"}
        end
      end)
    end)
    
    # Await all tasks with timeout
    results = Task.await_many(tasks, :timer.seconds(30))
    
    {:reply, {:ok, results}, state}
  end

  @impl true
  def handle_call({:create_pool, pool_name, config, size}, _from, state) do
    # Create multiple sessions for the pool
    sessions = Enum.map(1..size, fn _ ->
      case ClaudeCode.create_session(config) do
        {:ok, session} -> session
        {:error, error} ->
          Logger.error("Failed to create session for pool: #{error}")
          nil
      end
    end)
    |> Enum.filter(&(&1 != nil))
    
    pool = %{
      name: pool_name,
      config: config,
      sessions: sessions,
      current_index: 0
    }
    
    new_state = %{state |
      pools: Map.put(state.pools, pool_name, pool),
      sessions: Enum.reduce(sessions, state.sessions, fn session, acc ->
        Map.put(acc, session.id, session)
      end),
      metrics: %{state.metrics |
        total_sessions_created: state.metrics.total_sessions_created + length(sessions),
        active_sessions: state.metrics.active_sessions + length(sessions)
      }
    }
    
    Logger.info("Created pool '#{pool_name}' with #{length(sessions)} sessions")
    {:reply, {:ok, pool}, new_state}
  end

  @impl true
  def handle_call({:get_pool_session, pool_name}, _from, state) do
    case Map.get(state.pools, pool_name) do
      nil ->
        {:reply, {:error, "Pool not found"}, state}
        
      pool ->
        # Round-robin load balancing
        session = Enum.at(pool.sessions, pool.current_index)
        next_index = rem(pool.current_index + 1, length(pool.sessions))
        
        updated_pool = %{pool | current_index: next_index}
        new_state = %{state | pools: Map.put(state.pools, pool_name, updated_pool)}
        
        {:reply, {:ok, session}, new_state}
    end
  end

  @impl true
  def handle_info(:cleanup_idle_sessions, state) do
    # Clean up idle sessions
    case ClaudeCode.cleanup_idle_sessions(@idle_timeout_minutes) do
      {:ok, message} ->
        Logger.info("Cleanup: #{message}")
        
      {:error, error} ->
        Logger.error("Cleanup failed: #{error}")
    end
    
    # Update our session list
    {:ok, active_sessions} = ClaudeCode.list_sessions()
    active_session_ids = Enum.map(active_sessions, & &1.id) |> MapSet.new()
    
    new_sessions = Map.filter(state.sessions, fn {id, _} ->
      MapSet.member?(active_session_ids, id)
    end)
    
    # Schedule next cleanup
    cleanup_ref = Process.send_after(self(), :cleanup_idle_sessions, @cleanup_interval)
    
    new_state = %{state |
      sessions: new_sessions,
      cleanup_ref: cleanup_ref,
      metrics: %{state.metrics |
        active_sessions: map_size(new_sessions)
      }
    }
    
    {:noreply, new_state}
  end

  @impl true
  def terminate(_reason, state) do
    # Cancel cleanup timer
    if state.cleanup_ref do
      Process.cancel_timer(state.cleanup_ref)
    end
    
    # Terminate all sessions
    Enum.each(state.sessions, fn {session_id, _} ->
      ClaudeCode.terminate_session(session_id)
    end)
    
    Logger.info("SessionManager terminated, cleaned up #{map_size(state.sessions)} sessions")
    :ok
  end
end