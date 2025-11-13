defmodule Katalyst.ClaudeCode.Supervisor do
  @moduledoc """
  Supervisor for Claude Code integration components.
  """

  use Supervisor

  def start_link(init_arg) do
    Supervisor.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @impl true
  def init(_init_arg) do
    children = [
      # Session manager
      {Katalyst.ClaudeCode.SessionManager, []},
      
      # Task supervisor for async operations
      {Task.Supervisor, name: Katalyst.ClaudeCode.TaskSupervisor},
      
      # Registry for session tracking
      {Registry, keys: :unique, name: Katalyst.ClaudeCode.Registry}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
end