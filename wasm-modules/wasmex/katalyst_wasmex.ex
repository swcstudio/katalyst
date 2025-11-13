# Katalyst Wasmex Module
# Elixir interface for WASM runtime integration

defmodule KatalystWasmex do
  @moduledoc """
  Unified Wasmex interface for Katalyst framework.
  Provides stateful calls that can be invoked from Vercel frontend via Elixir backend.
  """
  
  use GenServer
  require Logger

  @wasm_file_path "priv/static/katalyst_wasm.wasm"

  defmodule State do
    defstruct [
      :wasmex_instance,
      :wasm_memory,
      :runtime_state,
      :initialized
    ]
  end

  # Client API

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  def execute_stateful_call(method, params) when is_binary(method) and is_map(params) do
    GenServer.call(__MODULE__, {:execute_stateful_call, method, params})
  end

  def get_state do
    GenServer.call(__MODULE__, :get_state)
  end

  def cleanup do
    GenServer.call(__MODULE__, :cleanup)
  end

  # Server Callbacks

  @impl true
  def init(_opts) do
    {:ok, %State{initialized: false}, {:continue, :initialize}}
  end

  @impl true
  def handle_continue(:initialize, state) do
    case initialize_wasm() do
      {:ok, instance, memory} ->
        new_state = %State{
          wasmex_instance: instance,
          wasm_memory: memory,
          runtime_state: %{},
          initialized: true
        }
        Logger.info("Katalyst Wasmex module initialized successfully")
        {:noreply, new_state}
      
      {:error, reason} ->
        Logger.error("Failed to initialize Katalyst Wasmex: #{inspect(reason)}")
        {:stop, reason, state}
    end
  end

  @impl true
  def handle_call({:execute_stateful_call, method, params}, _from, %State{initialized: true} = state) do
    case execute_wasm_method(state, method, params) do
      {:ok, result} ->
        {:reply, {:ok, result}, state}
      
      {:error, reason} ->
        Logger.error("WASM execution error: #{inspect(reason)}")
        {:reply, {:error, reason}, state}
    end
  end

  @impl true
  def handle_call({:execute_stateful_call, _, _}, _from, %State{initialized: false} = state) do
    {:reply, {:error, :not_initialized}, state}
  end

  @impl true
  def handle_call(:get_state, _from, state) do
    {:reply, state.runtime_state, state}
  end

  @impl true
  def handle_call(:cleanup, _from, state) do
    # Cleanup WASM resources if needed
    {:reply, :ok, %State{initialized: false}}
  end

  # Private Functions

  defp initialize_wasm do
    case File.read(@wasm_file_path) do
      {:ok, wasm_bytes} ->
        case Wasmex.start_link(%{bytes: wasm_bytes}) do
          {:ok, instance} ->
            {:ok, memory} = Wasmex.memory(instance, "memory")
            {:ok, instance, memory}
          
          error ->
            error
        end
      
      error ->
        error
    end
  end

  defp execute_wasm_method(state, method, params) do
    json_params = Jason.encode!(params)
    
    case method do
      "process_context" ->
        call_wasm_function(state, "process_context", [json_params])
      
      "execute_protocol" ->
        call_wasm_function(state, "execute_protocol", [json_params])
      
      "control_loop_step" ->
        call_wasm_function(state, "control_loop_step", [json_params])
      
      "bridge_call" ->
        call_wasm_function(state, "bridge_call", [params["target"], json_params])
      
      _ ->
        {:error, "Unknown method: #{method}"}
    end
  end

  defp call_wasm_function(state, function_name, args) do
    case Wasmex.call_function(state.wasmex_instance, function_name, args) do
      {:ok, [result]} when is_binary(result) ->
        case Jason.decode(result) do
          {:ok, decoded} -> {:ok, decoded}
          error -> error
        end
      
      {:ok, result} ->
        {:ok, result}
      
      error ->
        error
    end
  end
end
