defmodule KatalystWeb.Router do
  use KatalystWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {KatalystWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", KatalystWeb do
    pipe_through :browser

    get "/", PageController, :home
    
    # Context Engineering LiveViews
    live "/context-engineering", ContextEngineeringLive
    live "/protocol-runtime", ProtocolRuntimeLive
  end

  # Claude Code API routes
  scope "/api/claude-code", KatalystWeb do
    pipe_through :api

    # Session management
    post "/sessions", ClaudeCodeController, :create_session
    get "/sessions", ClaudeCodeController, :list_sessions
    get "/sessions/:session_id", ClaudeCodeController, :get_session
    delete "/sessions/:session_id", ClaudeCodeController, :terminate_session
    
    # Session operations
    post "/sessions/:session_id/messages", ClaudeCodeController, :send_message
    post "/sessions/:session_id/tools", ClaudeCodeController, :execute_tool
    
    # Batch operations
    post "/batch", ClaudeCodeController, :batch_execute
    
    # Pool management
    post "/pools", ClaudeCodeController, :create_pool
    get "/pools/:pool_name/session", ClaudeCodeController, :get_pool_session
    
    # System metrics
    get "/metrics", ClaudeCodeController, :get_metrics
    
    # Programmatic actions for WASM frontend
    post "/actions/generate-code", ClaudeCodeController, :generate_code
    post "/actions/analyze-code", ClaudeCodeController, :analyze_code
    post "/actions/refactor-code", ClaudeCodeController, :refactor_code
    post "/actions/write-tests", ClaudeCodeController, :write_tests
    post "/actions/debug-code", ClaudeCodeController, :debug_code
    post "/actions/generate-docs", ClaudeCodeController, :generate_docs
    post "/actions/convert-code", ClaudeCodeController, :convert_code
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:katalyst, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: KatalystWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
