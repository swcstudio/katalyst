defmodule Katalyst.ProtocolRuntimeServer do
  @moduledoc """
  Server-side protocol runtime for Context Engineering schemas.
  Manages protocol shell execution and symbolic residue tracking through
  Phoenix LiveView and WebSocket connections.
  """
  
  use GenServer
  require Logger
  
  alias Katalyst.ContextEngineering
  
  @protocol_templates %{
    "reasoning_systematic" => %{
      intent: "Break down complex problems into logical steps with traceable reasoning",
      input: %{
        "problem" => "string",
        "constraints" => "array",
        "context" => "object"
      },
      process: [
        "understand.restate",
        "analyze.decompose",
        "plan.design",
        "execute.implement",
        "verify.validate",
        "refine.improve"
      ],
      output: %{
        "solution" => "object",
        "reasoning" => "string",
        "verification" => "object"
      }
    },
    "code_analyze" => %{
      intent: "Deeply understand code structure, patterns and quality",
      input: %{
        "code" => "string",
        "focus" => "array"
      },
      process: [
        "parse.structure",
        "parse.patterns",
        "parse.flow",
        "evaluate.quality",
        "evaluate.performance",
        "evaluate.security",
        "summarize.overview"
      ],
      output: %{
        "overview" => "string",
        "details" => "object",
        "recommendations" => "array"
      }
    },
    "workflow_tdd" => %{
      intent: "Implement changes using test-first methodology",
      input: %{
        "feature" => "string",
        "requirements" => "object"
      },
      process: [
        "write_tests.create",
        "verify_tests.fail",
        "implement.code",
        "refactor.clean",
        "finalize.commit"
      ],
      output: %{
        "tests" => "array",
        "implementation" => "object",
        "commit" => "object"
      }
    }
  }
  
  # Client API
  
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end
  
  @doc """
  Register a new protocol shell
  """
  def register_protocol(id, protocol) do
    GenServer.call(__MODULE__, {:register_protocol, id, protocol})
  end
  
  @doc """
  Execute a protocol with given inputs
  """
  def execute_protocol(protocol_id, inputs) do
    GenServer.call(__MODULE__, {:execute_protocol, protocol_id, inputs}, 30_000)
  end
  
  @doc """
  Get current residue state
  """
  def get_residue_state do
    GenServer.call(__MODULE__, :get_residue_state)
  end
  
  @doc """
  Analyze residue network
  """
  def analyze_residue_network do
    GenServer.call(__MODULE__, :analyze_residue_network)
  end
  
  @doc """
  Get execution history
  """
  def get_execution_history(limit \\ 10) do
    GenServer.call(__MODULE__, {:get_execution_history, limit})
  end
  
  @doc """
  Clear execution history
  """
  def clear_history do
    GenServer.cast(__MODULE__, :clear_history)
  end
  
  @doc """
  Subscribe to protocol events
  """
  def subscribe do
    Phoenix.PubSub.subscribe(Katalyst.PubSub, "protocol_events")
  end
  
  @doc """
  Unsubscribe from protocol events
  """
  def unsubscribe do
    Phoenix.PubSub.unsubscribe(Katalyst.PubSub, "protocol_events")
  end
  
  # Server Callbacks
  
  @impl true
  def init(_opts) do
    state = %{
      protocols: @protocol_templates,
      residue_manager: %{
        enabled: true,
        tracked_residues: [],
        metrics: %{
          integrated_count: 0,
          surfaced_count: 0,
          echo_count: 0,
          average_strength: 0.0,
          integration_rate: 0.0
        },
        processing_strategy: %{
          surface_threshold: 0.3,
          integration_threshold: 0.7,
          echo_threshold: 0.5,
          compression_enabled: false,
          auto_integration: true
        }
      },
      execution_history: [],
      active_executions: %{}
    }
    
    {:ok, state}
  end
  
  @impl true
  def handle_call({:register_protocol, id, protocol}, _from, state) do
    new_protocols = Map.put(state.protocols, id, protocol)
    new_state = %{state | protocols: new_protocols}
    
    broadcast_event(:protocol_registered, %{id: id, protocol: protocol})
    
    {:reply, :ok, new_state}
  end
  
  @impl true
  def handle_call({:execute_protocol, protocol_id, inputs}, from, state) do
    case Map.get(state.protocols, protocol_id) do
      nil ->
        {:reply, {:error, :protocol_not_found}, state}
        
      protocol ->
        # Start async execution
        execution_id = generate_execution_id()
        
        Task.start(fn ->
          result = execute_protocol_async(protocol, inputs, execution_id, state)
          GenServer.cast(__MODULE__, {:execution_complete, execution_id, result, from})
        end)
        
        # Track active execution
        active_executions = Map.put(state.active_executions, execution_id, %{
          protocol_id: protocol_id,
          started_at: DateTime.utc_now(),
          from: from
        })
        
        new_state = %{state | active_executions: active_executions}
        
        broadcast_event(:execution_started, %{
          execution_id: execution_id,
          protocol_id: protocol_id
        })
        
        {:noreply, new_state}
    end
  end
  
  @impl true
  def handle_call(:get_residue_state, _from, state) do
    {:reply, {:ok, state.residue_manager}, state}
  end
  
  @impl true
  def handle_call(:analyze_residue_network, _from, state) do
    analysis = analyze_residue_network_internal(state.residue_manager)
    {:reply, {:ok, analysis}, state}
  end
  
  @impl true
  def handle_call({:get_execution_history, limit}, _from, state) do
    history = Enum.take(state.execution_history, limit)
    {:reply, {:ok, history}, state}
  end
  
  @impl true
  def handle_cast(:clear_history, state) do
    {:noreply, %{state | execution_history: []}}
  end
  
  @impl true
  def handle_cast({:execution_complete, execution_id, result, from}, state) do
    # Remove from active executions
    {execution, active_executions} = Map.pop(state.active_executions, execution_id)
    
    # Add to history
    history_entry = Map.merge(result, %{
      execution_id: execution_id,
      protocol_id: execution.protocol_id,
      completed_at: DateTime.utc_now(),
      duration_ms: DateTime.diff(DateTime.utc_now(), execution.started_at, :millisecond)
    })
    
    new_history = [history_entry | state.execution_history] |> Enum.take(100)
    
    # Update residue manager
    new_residue_manager = update_residue_manager(state.residue_manager, result)
    
    new_state = %{state | 
      active_executions: active_executions,
      execution_history: new_history,
      residue_manager: new_residue_manager
    }
    
    # Reply to original caller
    GenServer.reply(from, {:ok, result})
    
    # Broadcast completion
    broadcast_event(:execution_complete, %{
      execution_id: execution_id,
      result: result
    })
    
    {:noreply, new_state}
  end
  
  # Private Functions
  
  defp execute_protocol_async(protocol, inputs, execution_id, state) do
    start_time = System.monotonic_time(:millisecond)
    
    # Initialize execution context
    context = %{
      inputs: inputs,
      outputs: %{},
      state: %{},
      metadata: %{
        execution_id: execution_id,
        protocol_intent: protocol.intent
      }
    }
    
    # Execute each process step
    {final_context, trace, errors} = 
      Enum.reduce(protocol.process, {context, [], []}, fn operation, {ctx, trace_acc, errors_acc} ->
        op_start = System.monotonic_time(:millisecond)
        
        # Execute operation
        case execute_operation(operation, ctx) do
          {:ok, op_outputs} ->
            # Update context
            new_ctx = Map.update(ctx, :outputs, op_outputs, &Map.merge(&1, op_outputs))
            
            # Create trace entry
            trace_entry = %{
              operation: operation,
              timestamp: DateTime.utc_now(),
              duration_ms: System.monotonic_time(:millisecond) - op_start,
              inputs: ctx.inputs,
              outputs: op_outputs,
              residue_impact: generate_residue_impact()
            }
            
            {new_ctx, [trace_entry | trace_acc], errors_acc}
            
          {:error, reason} ->
            error = "Operation #{operation} failed: #{inspect(reason)}"
            {ctx, trace_acc, [error | errors_acc]}
        end
      end)
    
    # Generate residue
    residue_generated = generate_residue_for_execution(execution_id, protocol, final_context)
    
    execution_time = System.monotonic_time(:millisecond) - start_time
    
    %{
      success: Enum.empty?(errors),
      outputs: final_context.outputs,
      execution_time_ms: execution_time,
      residue_generated: residue_generated,
      errors: Enum.reverse(errors),
      trace: Enum.reverse(trace)
    }
  end
  
  defp execute_operation(operation, context) do
    # Simulate operation execution
    # In production, this would call actual operation handlers
    case String.split(operation, ".") do
      ["understand", _] ->
        {:ok, %{
          "understood" => true,
          "clarity_score" => :rand.uniform()
        }}
        
      ["analyze", _] ->
        {:ok, %{
          "analysis_complete" => true,
          "components" => ["A", "B", "C"]
        }}
        
      ["plan", _] ->
        {:ok, %{
          "plan_created" => true,
          "steps" => 5
        }}
        
      ["execute", _] ->
        {:ok, %{
          "execution_complete" => true
        }}
        
      ["verify", _] ->
        {:ok, %{
          "verification_passed" => true
        }}
        
      ["refine", _] ->
        {:ok, %{
          "refinement_complete" => true
        }}
        
      ["parse", _] ->
        {:ok, %{
          "parsed" => true
        }}
        
      ["evaluate", _] ->
        {:ok, %{
          "evaluation_score" => :rand.uniform()
        }}
        
      ["summarize", _] ->
        {:ok, %{
          "summary" => "Summary generated"
        }}
        
      _ ->
        {:ok, %{"completed" => true}}
    end
  end
  
  defp generate_residue_impact do
    %{
      surfaced: :rand.uniform(3),
      integrated: :rand.uniform(2),
      echoes_created: :rand.uniform(1),
      strength_delta: :rand.uniform() * 0.2 - 0.1
    }
  end
  
  defp generate_residue_for_execution(execution_id, protocol, context) do
    # Generate residue entries for this execution
    base_residue = %{
      id: "exec_#{execution_id}",
      content: "Execution of #{protocol.intent}",
      strength: 0.5 + :rand.uniform() * 0.5,
      state: :surfaced
    }
    
    # Generate operation residues
    operation_residues = 
      protocol.process
      |> Enum.take(:rand.uniform(3) + 1)
      |> Enum.map(fn op ->
        %{
          id: "op_#{execution_id}_#{op}",
          content: "Operation: #{op}",
          strength: 0.3 + :rand.uniform() * 0.4,
          state: Enum.random([:surfaced, :echo, :integrated])
        }
      end)
    
    [base_residue | operation_residues]
  end
  
  defp update_residue_manager(residue_manager, execution_result) do
    # Add new residues
    new_residues = execution_result.residue_generated ++ residue_manager.tracked_residues
    
    # Apply decay to existing residues
    decayed_residues = Enum.map(new_residues, fn residue ->
      Map.update(residue, :strength, 0, &(&1 * 0.95))
    end)
    
    # Filter out weak residues
    filtered_residues = Enum.filter(decayed_residues, fn r -> r.strength > 0.01 end)
    
    # Update metrics
    total_count = length(filtered_residues)
    avg_strength = if total_count > 0 do
      Enum.sum(Enum.map(filtered_residues, & &1.strength)) / total_count
    else
      0.0
    end
    
    surfaced_count = Enum.count(filtered_residues, & &1.state == :surfaced)
    echo_count = Enum.count(filtered_residues, & &1.state == :echo)
    integrated_count = Enum.count(filtered_residues, & &1.state == :integrated)
    
    %{residue_manager |
      tracked_residues: Enum.take(filtered_residues, 100), # Keep max 100 residues
      metrics: %{
        integrated_count: integrated_count,
        surfaced_count: surfaced_count,
        echo_count: echo_count,
        average_strength: avg_strength,
        integration_rate: if(total_count > 0, do: integrated_count / total_count, else: 0.0)
      }
    }
  end
  
  defp analyze_residue_network_internal(residue_manager) do
    residues = residue_manager.tracked_residues
    
    # State distribution
    state_distribution = 
      residues
      |> Enum.group_by(& &1.state)
      |> Enum.map(fn {state, items} -> {state, length(items)} end)
      |> Map.new()
    
    # Strength analysis
    strengths = Enum.map(residues, & &1.strength)
    
    strength_stats = if Enum.empty?(strengths) do
      %{min: 0, max: 0, avg: 0, median: 0}
    else
      sorted = Enum.sort(strengths)
      %{
        min: List.first(sorted),
        max: List.last(sorted),
        avg: Enum.sum(sorted) / length(sorted),
        median: Enum.at(sorted, div(length(sorted), 2))
      }
    end
    
    # Top residues by strength
    top_residues = 
      residues
      |> Enum.sort_by(& &1.strength, :desc)
      |> Enum.take(5)
      |> Enum.map(fn r -> %{id: r.id, strength: r.strength, state: r.state} end)
    
    %{
      total_residues: length(residues),
      state_distribution: state_distribution,
      strength_stats: strength_stats,
      top_residues: top_residues,
      metrics: residue_manager.metrics,
      processing_strategy: residue_manager.processing_strategy
    }
  end
  
  defp generate_execution_id do
    :crypto.strong_rand_bytes(16) |> Base.encode16(case: :lower)
  end
  
  defp broadcast_event(event_type, payload) do
    Phoenix.PubSub.broadcast(
      Katalyst.PubSub,
      "protocol_events",
      {event_type, payload}
    )
  end
end