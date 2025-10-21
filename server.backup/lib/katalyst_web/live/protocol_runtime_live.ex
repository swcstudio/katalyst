defmodule KatalystWeb.ProtocolRuntimeLive do
  use KatalystWeb, :live_view
  
  alias Katalyst.ProtocolRuntimeServer
  
  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket) do
      ProtocolRuntimeServer.subscribe()
    end
    
    # Load initial data
    {:ok, protocols} = get_available_protocols()
    {:ok, residue_state} = ProtocolRuntimeServer.get_residue_state()
    {:ok, history} = ProtocolRuntimeServer.get_execution_history(5)
    
    socket = 
      socket
      |> assign(:page_title, "Protocol Runtime")
      |> assign(:protocols, protocols)
      |> assign(:selected_protocol, nil)
      |> assign(:protocol_inputs, %{})
      |> assign(:execution_result, nil)
      |> assign(:execution_loading, false)
      |> assign(:residue_state, residue_state)
      |> assign(:execution_history, history)
      |> assign(:active_tab, :protocols)
      |> assign(:residue_network_analysis, nil)
    
    {:ok, socket}
  end
  
  @impl true
  def render(assigns) do
    ~H"""
    <div class="protocol-runtime-container">
      <div class="header">
        <h1 class="text-3xl font-bold text-gray-900">Context Engineering Protocol Runtime</h1>
        <p class="text-gray-600 mt-2">Execute protocol shells and monitor symbolic residue</p>
      </div>
      
      <div class="tabs mt-6">
        <nav class="flex space-x-4" aria-label="Tabs">
          <button
            phx-click="set_tab"
            phx-value-tab="protocols"
            class={tab_class(@active_tab == :protocols)}
          >
            Protocols
          </button>
          <button
            phx-click="set_tab"
            phx-value-tab="residue"
            class={tab_class(@active_tab == :residue)}
          >
            Residue Monitor
          </button>
          <button
            phx-click="set_tab"
            phx-value-tab="history"
            class={tab_class(@active_tab == :history)}
          >
            Execution History
          </button>
        </nav>
      </div>
      
      <div class="tab-content mt-6">
        <%= case @active_tab do %>
          <% :protocols -> %>
            <%= render_protocols_tab(assigns) %>
          <% :residue -> %>
            <%= render_residue_tab(assigns) %>
          <% :history -> %>
            <%= render_history_tab(assigns) %>
        <% end %>
      </div>
    </div>
    """
  end
  
  defp render_protocols_tab(assigns) do
    ~H"""
    <div class="protocols-tab">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="protocol-selection">
          <h3 class="text-xl font-semibold mb-4">Available Protocols</h3>
          <div class="space-y-2">
            <%= for {id, protocol} <- @protocols do %>
              <div 
                class={protocol_card_class(@selected_protocol == id)}
                phx-click="select_protocol"
                phx-value-id={id}
              >
                <h4 class="font-semibold text-lg"><%= id %></h4>
                <p class="text-sm text-gray-600"><%= protocol.intent %></p>
                <div class="mt-2 flex flex-wrap gap-1">
                  <%= for step <- protocol.process do %>
                    <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      <%= step %>
                    </span>
                  <% end %>
                </div>
              </div>
            <% end %>
          </div>
        </div>
        
        <div class="protocol-execution">
          <%= if @selected_protocol do %>
            <h3 class="text-xl font-semibold mb-4">Execute Protocol</h3>
            <form phx-submit="execute_protocol">
              <div class="space-y-4">
                <%= for {input_name, input_type} <- @protocols[@selected_protocol].input do %>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      <%= input_name %> (<%= input_type %>)
                    </label>
                    <input
                      type="text"
                      name={"input[#{input_name}]"}
                      value={@protocol_inputs[input_name] || ""}
                      phx-change="update_input"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      placeholder={"Enter #{input_name}"}
                    />
                  </div>
                <% end %>
                
                <button
                  type="submit"
                  disabled={@execution_loading}
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <%= if @execution_loading do %>
                    <span class="flex items-center justify-center">
                      <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Executing...
                    </span>
                  <% else %>
                    Execute Protocol
                  <% end %>
                </button>
              </div>
            </form>
            
            <%= if @execution_result do %>
              <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-lg mb-2">Execution Result</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Status:</span>
                    <span class={if @execution_result.success, do: "text-green-600", else: "text-red-600"}>
                      <%= if @execution_result.success, do: "Success", else: "Failed" %>
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Execution Time:</span>
                    <span><%= @execution_result.execution_time_ms %>ms</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Residue Generated:</span>
                    <span><%= length(@execution_result.residue_generated) %></span>
                  </div>
                  
                  <%= if not Enum.empty?(@execution_result.outputs) do %>
                    <div class="mt-4">
                      <h5 class="font-medium">Outputs:</h5>
                      <pre class="mt-2 p-2 bg-white rounded text-xs overflow-x-auto">
                        <%= Jason.encode!(@execution_result.outputs, pretty: true) %>
                      </pre>
                    </div>
                  <% end %>
                  
                  <%= if not Enum.empty?(@execution_result.errors) do %>
                    <div class="mt-4">
                      <h5 class="font-medium text-red-600">Errors:</h5>
                      <ul class="mt-2 space-y-1">
                        <%= for error <- @execution_result.errors do %>
                          <li class="text-sm text-red-600">• <%= error %></li>
                        <% end %>
                      </ul>
                    </div>
                  <% end %>
                </div>
              </div>
            <% end %>
          <% else %>
            <div class="text-center py-12 text-gray-500">
              Select a protocol to execute
            </div>
          <% end %>
        </div>
      </div>
    </div>
    """
  end
  
  defp render_residue_tab(assigns) do
    ~H"""
    <div class="residue-tab">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <h3 class="text-xl font-semibold mb-4">Tracked Residues</h3>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <%= if Enum.empty?(@residue_state.tracked_residues) do %>
              <p class="text-gray-500 text-center py-8">No residues currently tracked</p>
            <% else %>
              <%= for residue <- @residue_state.tracked_residues do %>
                <div class="p-3 bg-white rounded-lg border border-gray-200">
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <span class={residue_state_badge_class(residue.state)}>
                          <%= residue.state %>
                        </span>
                        <span class="text-sm font-mono text-gray-600"><%= residue.id %></span>
                      </div>
                      <p class="mt-1 text-sm text-gray-700"><%= residue.content %></p>
                    </div>
                    <div class="ml-4 text-right">
                      <div class="text-sm text-gray-600">Strength</div>
                      <div class="flex items-center gap-1">
                        <div class="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            class="bg-purple-600 h-2 rounded-full"
                            style={"width: #{residue.strength * 100}%"}
                          ></div>
                        </div>
                        <span class="text-xs text-gray-600">
                          <%= Float.round(residue.strength, 2) %>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              <% end %>
            <% end %>
          </div>
          
          <div class="mt-4 flex gap-2">
            <button
              phx-click="refresh_residue"
              class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Refresh
            </button>
            <button
              phx-click="analyze_network"
              class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Analyze Network
            </button>
          </div>
        </div>
        
        <div>
          <h3 class="text-xl font-semibold mb-4">Metrics</h3>
          <div class="bg-white rounded-lg p-4 space-y-3">
            <div class="metric-item">
              <span class="text-gray-600">Total Residues:</span>
              <span class="font-semibold"><%= length(@residue_state.tracked_residues) %></span>
            </div>
            <div class="metric-item">
              <span class="text-gray-600">Surfaced:</span>
              <span class="font-semibold"><%= @residue_state.metrics.surfaced_count %></span>
            </div>
            <div class="metric-item">
              <span class="text-gray-600">Integrated:</span>
              <span class="font-semibold"><%= @residue_state.metrics.integrated_count %></span>
            </div>
            <div class="metric-item">
              <span class="text-gray-600">Echoes:</span>
              <span class="font-semibold"><%= @residue_state.metrics.echo_count %></span>
            </div>
            <div class="metric-item">
              <span class="text-gray-600">Avg Strength:</span>
              <span class="font-semibold">
                <%= Float.round(@residue_state.metrics.average_strength, 3) %>
              </span>
            </div>
            <div class="metric-item">
              <span class="text-gray-600">Integration Rate:</span>
              <span class="font-semibold">
                <%= Float.round(@residue_state.metrics.integration_rate * 100, 1) %>%
              </span>
            </div>
          </div>
          
          <%= if @residue_network_analysis do %>
            <div class="mt-4 bg-white rounded-lg p-4">
              <h4 class="font-semibold mb-2">Network Analysis</h4>
              <pre class="text-xs overflow-x-auto">
                <%= Jason.encode!(@residue_network_analysis, pretty: true) %>
              </pre>
            </div>
          <% end %>
        </div>
      </div>
    </div>
    """
  end
  
  defp render_history_tab(assigns) do
    ~H"""
    <div class="history-tab">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Execution History</h3>
        <button
          phx-click="clear_history"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Clear History
        </button>
      </div>
      
      <%= if Enum.empty?(@execution_history) do %>
        <p class="text-gray-500 text-center py-12">No execution history available</p>
      <% else %>
        <div class="space-y-4">
          <%= for entry <- @execution_history do %>
            <div class="bg-white rounded-lg p-4 border border-gray-200">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <span class="font-semibold"><%= entry.protocol_id %></span>
                  <span class={if entry.success, do: "ml-2 text-green-600", else: "ml-2 text-red-600"}>
                    <%= if entry.success, do: "✓", else: "✗" %>
                  </span>
                </div>
                <span class="text-sm text-gray-600">
                  <%= format_datetime(entry.completed_at) %>
                </span>
              </div>
              
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">Duration:</span>
                  <span class="ml-1 font-medium"><%= entry.duration_ms %>ms</span>
                </div>
                <div>
                  <span class="text-gray-600">Residue:</span>
                  <span class="ml-1 font-medium"><%= length(entry.residue_generated) %></span>
                </div>
                <div>
                  <span class="text-gray-600">Operations:</span>
                  <span class="ml-1 font-medium"><%= length(entry.trace) %></span>
                </div>
              </div>
              
              <details class="mt-3">
                <summary class="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                  View Details
                </summary>
                <div class="mt-2 p-2 bg-gray-50 rounded text-xs">
                  <pre><%= Jason.encode!(entry, pretty: true) %></pre>
                </div>
              </details>
            </div>
          <% end %>
        </div>
      <% end %>
    </div>
    """
  end
  
  # Event Handlers
  
  @impl true
  def handle_event("set_tab", %{"tab" => tab}, socket) do
    {:noreply, assign(socket, :active_tab, String.to_atom(tab))}
  end
  
  @impl true
  def handle_event("select_protocol", %{"id" => id}, socket) do
    {:noreply, assign(socket, selected_protocol: id, protocol_inputs: %{})}
  end
  
  @impl true
  def handle_event("update_input", %{"input" => inputs}, socket) do
    {:noreply, assign(socket, :protocol_inputs, inputs)}
  end
  
  @impl true
  def handle_event("execute_protocol", _params, socket) do
    protocol_id = socket.assigns.selected_protocol
    inputs = socket.assigns.protocol_inputs
    
    socket = assign(socket, :execution_loading, true)
    
    # Convert inputs to proper format
    formatted_inputs = format_inputs(inputs, socket.assigns.protocols[protocol_id].input)
    
    # Execute protocol asynchronously
    Task.start(fn ->
      result = ProtocolRuntimeServer.execute_protocol(protocol_id, formatted_inputs)
      send(self(), {:execution_result, result})
    end)
    
    {:noreply, socket}
  end
  
  @impl true
  def handle_event("refresh_residue", _params, socket) do
    {:ok, residue_state} = ProtocolRuntimeServer.get_residue_state()
    {:noreply, assign(socket, :residue_state, residue_state)}
  end
  
  @impl true
  def handle_event("analyze_network", _params, socket) do
    {:ok, analysis} = ProtocolRuntimeServer.analyze_residue_network()
    {:noreply, assign(socket, :residue_network_analysis, analysis)}
  end
  
  @impl true
  def handle_event("clear_history", _params, socket) do
    ProtocolRuntimeServer.clear_history()
    {:noreply, assign(socket, :execution_history, [])}
  end
  
  # Info Handlers
  
  @impl true
  def handle_info({:execution_result, {:ok, result}}, socket) do
    {:ok, residue_state} = ProtocolRuntimeServer.get_residue_state()
    {:ok, history} = ProtocolRuntimeServer.get_execution_history(5)
    
    socket = 
      socket
      |> assign(:execution_result, result)
      |> assign(:execution_loading, false)
      |> assign(:residue_state, residue_state)
      |> assign(:execution_history, history)
    
    {:noreply, socket}
  end
  
  @impl true
  def handle_info({:execution_result, {:error, _reason}}, socket) do
    socket = 
      socket
      |> assign(:execution_loading, false)
      |> put_flash(:error, "Protocol execution failed")
    
    {:noreply, socket}
  end
  
  @impl true
  def handle_info({:protocol_registered, _payload}, socket) do
    {:ok, protocols} = get_available_protocols()
    {:noreply, assign(socket, :protocols, protocols)}
  end
  
  @impl true
  def handle_info({:execution_started, _payload}, socket) do
    {:noreply, socket}
  end
  
  @impl true
  def handle_info({:execution_complete, _payload}, socket) do
    {:ok, residue_state} = ProtocolRuntimeServer.get_residue_state()
    {:ok, history} = ProtocolRuntimeServer.get_execution_history(5)
    
    socket = 
      socket
      |> assign(:residue_state, residue_state)
      |> assign(:execution_history, history)
    
    {:noreply, socket}
  end
  
  # Helper Functions
  
  defp get_available_protocols do
    # For now, return template protocols
    # In production, this would fetch from ProtocolRuntimeServer
    protocols = %{
      "reasoning_systematic" => %{
        intent: "Break down complex problems into logical steps",
        input: %{
          "problem" => "string",
          "constraints" => "array",
          "context" => "object"
        },
        process: ["understand", "analyze", "plan", "execute", "verify", "refine"],
        output: %{"solution" => "object", "reasoning" => "string"}
      },
      "code_analyze" => %{
        intent: "Analyze code structure and quality",
        input: %{
          "code" => "string",
          "focus" => "array"
        },
        process: ["parse", "evaluate", "summarize"],
        output: %{"overview" => "string", "details" => "object"}
      },
      "workflow_tdd" => %{
        intent: "Test-driven development workflow",
        input: %{
          "feature" => "string",
          "requirements" => "object"
        },
        process: ["write_tests", "verify", "implement", "refactor"],
        output: %{"tests" => "array", "implementation" => "object"}
      }
    }
    
    {:ok, protocols}
  end
  
  defp format_inputs(raw_inputs, input_spec) do
    Enum.reduce(input_spec, %{}, fn {name, type}, acc ->
      value = Map.get(raw_inputs, name, "")
      
      formatted_value = case type do
        "array" -> String.split(value, ",", trim: true)
        "object" -> %{}
        _ -> value
      end
      
      Map.put(acc, name, formatted_value)
    end)
  end
  
  defp tab_class(active) do
    base = "px-3 py-2 font-medium text-sm rounded-md transition-colors"
    
    if active do
      "#{base} bg-blue-100 text-blue-700"
    else
      "#{base} text-gray-500 hover:text-gray-700"
    end
  end
  
  defp protocol_card_class(selected) do
    base = "p-4 rounded-lg border cursor-pointer transition-all"
    
    if selected do
      "#{base} border-blue-500 bg-blue-50"
    else
      "#{base} border-gray-200 hover:border-gray-300 bg-white"
    end
  end
  
  defp residue_state_badge_class(state) do
    base = "px-2 py-1 text-xs font-medium rounded"
    
    case state do
      :surfaced -> "#{base} bg-cyan-100 text-cyan-700"
      :echo -> "#{base} bg-blue-100 text-blue-700"
      :integrated -> "#{base} bg-green-100 text-green-700"
      :shadow -> "#{base} bg-gray-100 text-gray-700"
      :orphaned -> "#{base} bg-red-100 text-red-700"
      _ -> "#{base} bg-gray-100 text-gray-700"
    end
  end
  
  defp format_datetime(datetime) do
    Calendar.strftime(datetime, "%Y-%m-%d %H:%M:%S")
  end
end