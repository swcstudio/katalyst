defmodule KatalystWeb.ContextEngineeringLive do
  @moduledoc """
  LiveView for interacting with Context Engineering WASM modules.
  Provides real-time UI for neural field analysis, prompt programs, and control loops.
  """

  use KatalystWeb, :live_view
  alias Katalyst.ContextEngineering

  @impl true
  def mount(_params, _session, socket) do
    socket =
      socket
      |> assign(
        page_title: "Context Engineering",
        active_tab: :resonance,
        resonance_result: nil,
        field_analysis: nil,
        prompt_program: nil,
        control_loop: nil,
        patterns: [],
        attractors: [],
        program_steps: [],
        loop_history: []
      )

    {:ok, socket}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Context Engineering Tools</h1>
      
      <div class="tabs tabs-boxed mb-6">
        <button 
          class={"tab #{if @active_tab == :resonance, do: "tab-active"}"}
          phx-click="set_tab" 
          phx-value-tab="resonance"
        >
          Resonance Measurement
        </button>
        <button 
          class={"tab #{if @active_tab == :field, do: "tab-active"}"}
          phx-click="set_tab" 
          phx-value-tab="field"
        >
          Neural Field Analysis
        </button>
        <button 
          class={"tab #{if @active_tab == :program, do: "tab-active"}"}
          phx-click="set_tab" 
          phx-value-tab="program"
        >
          Prompt Programs
        </button>
        <button 
          class={"tab #{if @active_tab == :loop, do: "tab-active"}"}
          phx-click="set_tab" 
          phx-value-tab="loop"
        >
          Control Loops
        </button>
      </div>

      <%= case @active_tab do %>
        <% :resonance -> %>
          <.resonance_tab resonance_result={@resonance_result} />
        
        <% :field -> %>
          <.field_tab 
            patterns={@patterns} 
            attractors={@attractors}
            field_analysis={@field_analysis} 
          />
        
        <% :program -> %>
          <.program_tab 
            prompt_program={@prompt_program}
            program_steps={@program_steps}
          />
        
        <% :loop -> %>
          <.loop_tab 
            control_loop={@control_loop}
            loop_history={@loop_history}
          />
      <% end %>
    </div>
    """
  end

  # Component: Resonance Tab
  defp resonance_tab(assigns) do
    ~H"""
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Pattern Resonance Measurement</h2>
        
        <form phx-submit="measure_resonance" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Pattern 1</span>
            </label>
            <textarea 
              name="pattern1" 
              class="textarea textarea-bordered"
              placeholder="Enter first pattern..."
              required
            ></textarea>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Pattern 2</span>
            </label>
            <textarea 
              name="pattern2" 
              class="textarea textarea-bordered"
              placeholder="Enter second pattern..."
              required
            ></textarea>
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Method</span>
            </label>
            <select name="method" class="select select-bordered">
              <option value="cosine">Cosine Similarity</option>
              <option value="overlap">Word Overlap</option>
            </select>
          </div>
          
          <button type="submit" class="btn btn-primary">
            Measure Resonance
          </button>
        </form>
        
        <%= if @resonance_result do %>
          <div class="alert alert-info mt-4">
            <div>
              <h3 class="font-bold">Resonance Score</h3>
              <div class="text-2xl"><%= Float.round(@resonance_result, 3) %></div>
              <progress 
                class="progress progress-primary" 
                value={@resonance_result * 100} 
                max="100"
              ></progress>
            </div>
          </div>
        <% end %>
      </div>
    </div>
    """
  end

  # Component: Field Tab
  defp field_tab(assigns) do
    ~H"""
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Neural Field Analysis</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="text-lg font-semibold mb-2">Patterns</h3>
            <form phx-submit="add_pattern" class="space-y-2">
              <input 
                type="text" 
                name="pattern_content" 
                placeholder="Pattern content"
                class="input input-bordered w-full"
              />
              <input 
                type="number" 
                name="pattern_strength" 
                placeholder="Strength (0-1)"
                step="0.1"
                min="0"
                max="1"
                class="input input-bordered w-full"
              />
              <button type="submit" class="btn btn-sm btn-primary">Add Pattern</button>
            </form>
            
            <div class="mt-4 space-y-2">
              <%= for {content, strength} <- @patterns do %>
                <div class="badge badge-lg gap-2">
                  <%= String.slice(content, 0..30) %>... 
                  <span class="font-bold"><%= strength %></span>
                </div>
              <% end %>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-2">Attractors</h3>
            <form phx-submit="add_attractor" class="space-y-2">
              <input 
                type="text" 
                name="attractor_pattern" 
                placeholder="Attractor pattern"
                class="input input-bordered w-full"
              />
              <input 
                type="number" 
                name="attractor_strength" 
                placeholder="Strength (0-1)"
                step="0.1"
                min="0"
                max="1"
                class="input input-bordered w-full"
              />
              <button type="submit" class="btn btn-sm btn-primary">Add Attractor</button>
            </form>
            
            <div class="mt-4 space-y-2">
              <%= for {pattern, strength, _stability} <- @attractors do %>
                <div class="badge badge-lg badge-secondary gap-2">
                  <%= String.slice(pattern, 0..30) %>... 
                  <span class="font-bold"><%= strength %></span>
                </div>
              <% end %>
            </div>
          </div>
        </div>
        
        <button phx-click="analyze_field" class="btn btn-primary mt-4">
          Analyze Field
        </button>
        
        <%= if @field_analysis do %>
          <div class="stats shadow mt-4">
            <div class="stat">
              <div class="stat-title">Coherence</div>
              <div class="stat-value text-primary">
                <%= Float.round(@field_analysis.coherence, 2) %>
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Stability</div>
              <div class="stat-value text-secondary">
                <%= Float.round(@field_analysis.stability, 2) %>
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">Entropy</div>
              <div class="stat-value">
                <%= Float.round(@field_analysis.entropy, 2) %>
              </div>
            </div>
          </div>
          
          <div class="alert alert-info mt-4">
            <div>
              <h4 class="font-bold">Recommendations:</h4>
              <ul class="list-disc list-inside">
                <%= for rec <- @field_analysis.recommendations do %>
                  <li><%= rec %></li>
                <% end %>
              </ul>
            </div>
          </div>
        <% end %>
      </div>
    </div>
    """
  end

  # Component: Program Tab
  defp program_tab(assigns) do
    ~H"""
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Prompt Programs</h2>
        
        <%= if @prompt_program do %>
          <div class="alert alert-success">
            <div>
              Program created: <%= @prompt_program.name %>
            </div>
          </div>
        <% end %>
        
        <form phx-submit="create_program" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Program Name</span>
            </label>
            <input 
              type="text" 
              name="program_name" 
              class="input input-bordered"
              placeholder="My Program"
              required
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Description</span>
            </label>
            <textarea 
              name="program_description" 
              class="textarea textarea-bordered"
              placeholder="Program description..."
            ></textarea>
          </div>
          
          <button type="submit" class="btn btn-primary">
            Create Program
          </button>
        </form>
        
        <%= if @prompt_program do %>
          <div class="divider"></div>
          
          <form phx-submit="add_step" class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Step Content</span>
              </label>
              <input 
                type="text" 
                name="step_content" 
                class="input input-bordered"
                placeholder="Step instruction..."
                required
              />
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Step Type</span>
              </label>
              <select name="step_type" class="select select-bordered">
                <option value="instruction">Instruction</option>
                <option value="condition">Condition</option>
                <option value="loop">Loop</option>
                <option value="variable">Variable</option>
              </select>
            </div>
            
            <button type="submit" class="btn btn-secondary btn-sm">
              Add Step
            </button>
          </form>
          
          <div class="mt-4">
            <h3 class="font-bold mb-2">Program Steps:</h3>
            <div class="space-y-2">
              <%= for {step, index} <- Enum.with_index(@program_steps) do %>
                <div class="flex items-center space-x-2">
                  <span class="badge badge-lg"><%= index + 1 %></span>
                  <span><%= step %></span>
                </div>
              <% end %>
            </div>
          </div>
          
          <%= if length(@program_steps) > 0 do %>
            <button phx-click="execute_program" class="btn btn-accent mt-4">
              Execute Program
            </button>
          <% end %>
        <% end %>
      </div>
    </div>
    """
  end

  # Component: Loop Tab
  defp loop_tab(assigns) do
    ~H"""
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Control Loops</h2>
        
        <%= if @control_loop do %>
          <div class="stats shadow">
            <div class="stat">
              <div class="stat-title">Status</div>
              <div class="stat-value text-sm"><%= @control_loop.status %></div>
            </div>
            <div class="stat">
              <div class="stat-title">Current Iteration</div>
              <div class="stat-value"><%= @control_loop.current_iteration %></div>
            </div>
            <div class="stat">
              <div class="stat-title">Max Iterations</div>
              <div class="stat-value"><%= @control_loop.max_iterations %></div>
            </div>
          </div>
        <% end %>
        
        <form phx-submit="create_loop" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Max Iterations</span>
            </label>
            <input 
              type="number" 
              name="max_iterations" 
              class="input input-bordered"
              value="5"
              min="1"
              max="20"
              required
            />
          </div>
          
          <div class="form-control">
            <label class="label">
              <span class="label-text">Max Tokens</span>
            </label>
            <input 
              type="number" 
              name="max_tokens" 
              class="input input-bordered"
              value="4000"
              min="100"
              max="10000"
              required
            />
          </div>
          
          <button type="submit" class="btn btn-primary">
            Create Control Loop
          </button>
        </form>
        
        <%= if @control_loop do %>
          <div class="divider"></div>
          
          <form phx-submit="execute_iteration" class="space-y-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Input for Iteration</span>
              </label>
              <textarea 
                name="iteration_input" 
                class="textarea textarea-bordered"
                placeholder="Enter input for this iteration..."
                required
              ></textarea>
            </div>
            
            <button type="submit" class="btn btn-secondary">
              Execute Iteration
            </button>
          </form>
          
          <div class="mt-4">
            <h3 class="font-bold mb-2">Execution History:</h3>
            <div class="space-y-2">
              <%= for {entry, index} <- Enum.with_index(@loop_history) do %>
                <div class="collapse collapse-arrow bg-base-100">
                  <input type="checkbox" />
                  <div class="collapse-title">
                    Iteration <%= index + 1 %>
                  </div>
                  <div class="collapse-content">
                    <p><strong>Input:</strong> <%= entry.input %></p>
                    <p><strong>Output:</strong> <%= entry.output %></p>
                  </div>
                </div>
              <% end %>
            </div>
          </div>
        <% end %>
      </div>
    </div>
    """
  end

  # Event Handlers

  @impl true
  def handle_event("set_tab", %{"tab" => tab}, socket) do
    {:noreply, assign(socket, active_tab: String.to_atom(tab))}
  end

  @impl true
  def handle_event("measure_resonance", %{"pattern1" => p1, "pattern2" => p2, "method" => method}, socket) do
    case ContextEngineering.create_resonance_measurer(method) do
      {:ok, _measurer_id} ->
        case ContextEngineering.measure_resonance(p1, p2) do
          {:ok, resonance} ->
            {:noreply, assign(socket, resonance_result: resonance)}
          
          {:error, _reason} ->
            {:noreply, put_flash(socket, :error, "Failed to measure resonance")}
        end
      
      {:error, _reason} ->
        {:noreply, put_flash(socket, :error, "Failed to create resonance measurer")}
    end
  end

  @impl true
  def handle_event("add_pattern", %{"pattern_content" => content, "pattern_strength" => strength}, socket) do
    strength = String.to_float(strength)
    patterns = socket.assigns.patterns ++ [{content, strength}]
    {:noreply, assign(socket, patterns: patterns)}
  end

  @impl true
  def handle_event("add_attractor", %{"attractor_pattern" => pattern, "attractor_strength" => strength}, socket) do
    strength = String.to_float(strength)
    attractors = socket.assigns.attractors ++ [{pattern, strength, 0.9}]
    {:noreply, assign(socket, attractors: attractors)}
  end

  @impl true
  def handle_event("analyze_field", _params, socket) do
    case ContextEngineering.analyze_field(socket.assigns.patterns, socket.assigns.attractors) do
      {:ok, _field_id, analysis} ->
        {:noreply, assign(socket, field_analysis: analysis)}
      
      {:error, _reason} ->
        {:noreply, put_flash(socket, :error, "Failed to analyze field")}
    end
  end

  @impl true
  def handle_event("create_program", %{"program_name" => name, "program_description" => desc}, socket) do
    case ContextEngineering.create_prompt_program(name, desc) do
      {:ok, program_id} ->
        program = %{id: program_id, name: name, description: desc}
        {:noreply, assign(socket, prompt_program: program, program_steps: [])}
      
      {:error, _reason} ->
        {:noreply, put_flash(socket, :error, "Failed to create program")}
    end
  end

  @impl true
  def handle_event("add_step", %{"step_content" => content, "step_type" => type}, socket) do
    if socket.assigns.prompt_program do
      case ContextEngineering.add_program_step(
        socket.assigns.prompt_program.id, 
        content, 
        String.to_atom(type)
      ) do
        {:ok, _step_id} ->
          steps = socket.assigns.program_steps ++ [content]
          {:noreply, assign(socket, program_steps: steps)}
        
        {:error, _reason} ->
          {:noreply, put_flash(socket, :error, "Failed to add step")}
      end
    else
      {:noreply, put_flash(socket, :error, "Please create a program first")}
    end
  end

  @impl true
  def handle_event("execute_program", _params, socket) do
    if socket.assigns.prompt_program do
      case ContextEngineering.execute_program(socket.assigns.prompt_program.id, "Execute all steps") do
        {:ok, result} ->
          {:noreply, put_flash(socket, :info, "Program executed: #{result}")}
        
        {:error, _reason} ->
          {:noreply, put_flash(socket, :error, "Failed to execute program")}
      end
    else
      {:noreply, socket}
    end
  end

  @impl true
  def handle_event("create_loop", %{"max_iterations" => max_iter, "max_tokens" => max_tokens}, socket) do
    max_iter = String.to_integer(max_iter)
    max_tokens = String.to_integer(max_tokens)
    
    case ContextEngineering.create_control_loop(max_iter, max_tokens) do
      {:ok, loop_id} ->
        loop = %{
          id: loop_id,
          max_iterations: max_iter,
          max_tokens: max_tokens,
          current_iteration: 0,
          status: :idle
        }
        {:noreply, assign(socket, control_loop: loop, loop_history: [])}
      
      {:error, _reason} ->
        {:noreply, put_flash(socket, :error, "Failed to create control loop")}
    end
  end

  @impl true
  def handle_event("execute_iteration", %{"iteration_input" => input}, socket) do
    if socket.assigns.control_loop do
      case ContextEngineering.execute_loop_iteration(socket.assigns.control_loop.id, input) do
        {:ok, output} ->
          entry = %{input: input, output: output}
          history = socket.assigns.loop_history ++ [entry]
          
          loop = socket.assigns.control_loop
          |> Map.update(:current_iteration, 0, &(&1 + 1))
          |> Map.put(:status, :running)
          
          {:noreply, assign(socket, control_loop: loop, loop_history: history)}
        
        {:error, _reason} ->
          {:noreply, put_flash(socket, :error, "Failed to execute iteration")}
      end
    else
      {:noreply, put_flash(socket, :error, "Please create a control loop first")}
    end
  end
end