defmodule KatalystNif do
  @moduledoc """
  Elixir interface for Katalyst Rust NIFs.
  Provides high-performance native functions for the Katalyst framework.
  """
  use Rustler, otp_app: :katalyst, crate: "katalyst_nif"

  # Initialize Katalyst with configuration
  def initialize_katalyst(_config_json), do: :erlang.nif_error(:nif_not_loaded)

  # GenServer management with Fly.io
  def register_genserver(_name, _region), do: :erlang.nif_error(:nif_not_loaded)
  def get_genserver_status(_genserver_name), do: :erlang.nif_error(:nif_not_loaded)

  # Distributed task execution
  def execute_distributed_task(_task_json), do: :erlang.nif_error(:nif_not_loaded)

  # Performance optimization
  def optimize_memory(), do: :erlang.nif_error(:nif_not_loaded)
  def optimize_cpu(), do: :erlang.nif_error(:nif_not_loaded)

  # Telemetry and metrics
  def process_telemetry(_data_json), do: :erlang.nif_error(:nif_not_loaded)
  def get_performance_metrics(), do: :erlang.nif_error(:nif_not_loaded)

  # Benchmarking
  def benchmark_nif(_iterations), do: :erlang.nif_error(:nif_not_loaded)

  # WebSocket and JSON processing
  def process_websocket_frame(_frame_data), do: :erlang.nif_error(:nif_not_loaded)
  def parse_json_fast(_json_string), do: :erlang.nif_error(:nif_not_loaded)
  
  # Claude Code integration NIFs
  def claude_init(), do: :erlang.nif_error(:nif_not_loaded)
  def claude_create_session(_config_json), do: :erlang.nif_error(:nif_not_loaded)
  def claude_send_message(_session_id, _message_json), do: :erlang.nif_error(:nif_not_loaded)
  def claude_execute_tool(_session_id, _tool_name, _parameters_json), do: :erlang.nif_error(:nif_not_loaded)
  def claude_get_session(_session_id), do: :erlang.nif_error(:nif_not_loaded)
  def claude_list_sessions(), do: :erlang.nif_error(:nif_not_loaded)
  def claude_list_tools(), do: :erlang.nif_error(:nif_not_loaded)
  def claude_terminate_session(_session_id), do: :erlang.nif_error(:nif_not_loaded)
  def claude_cleanup_idle_sessions(_idle_timeout_minutes), do: :erlang.nif_error(:nif_not_loaded)
  def claude_export_metrics(), do: :erlang.nif_error(:nif_not_loaded)
  def claude_batch_create_sessions(_configs_json), do: :erlang.nif_error(:nif_not_loaded)
  def claude_batch_send_messages(_messages_json), do: :erlang.nif_error(:nif_not_loaded)
  def claude_configure_mcp(_session_id, _mcp_servers_json), do: :erlang.nif_error(:nif_not_loaded)
  def claude_stream_message(_session_id, _message_json), do: :erlang.nif_error(:nif_not_loaded)
  def claude_poll_stream(_stream_id), do: :erlang.nif_error(:nif_not_loaded)

  @doc """
  Initialize the Katalyst system with the given configuration.
  
  ## Examples
  
      iex> config = %{
      ...>   name: "katalyst-prod",
      ...>   mode: "production",
      ...>   performance_level: 10,
      ...>   fly_region: "dfw",
      ...>   genserver_pool_size: 20
      ...> }
      iex> KatalystNif.initialize_katalyst(Jason.encode!(config))
      {:initialized, "Katalyst 'katalyst-prod' initialized..."}
  """
  def init_katalyst(config) when is_map(config) do
    config
    |> Jason.encode!()
    |> initialize_katalyst()
  end

  @doc """
  Register a GenServer with Fly.io region awareness.
  """
  def register_gen_server(name, region \\ "dfw") when is_binary(name) and is_binary(region) do
    register_genserver(name, region)
  end

  @doc """
  Execute a task across multiple Fly.io regions.
  """
  def execute_task(task) when is_map(task) do
    task
    |> Jason.encode!()
    |> execute_distributed_task()
  end

  @doc """
  Get current performance metrics including Fly.io specific data.
  """
  def metrics do
    case get_performance_metrics() do
      {:ok, json} -> Jason.decode(json)
      error -> error
    end
  end

  @doc """
  Benchmark NIF performance compared to pure Elixir.
  """
  def benchmark(iterations \\ 1_000_000) when is_integer(iterations) and iterations > 0 do
    case benchmark_nif(iterations) do
      {:ok, json} -> Jason.decode(json)
      error -> error
    end
  end
end