#!/usr/bin/env elixir

Mix.install([{:katalyst, path: "."}])

IO.puts("🔍 Testing Claude Code Basic Functions...")
IO.puts("=" |> String.duplicate(50))

# Test Claude init
IO.puts("1. Testing Claude Init...")
case KatalystNif.claude_init() do
  {:ok, message} ->
    IO.puts("✓ Claude init successful: #{message}")
  {status, error} ->
    IO.puts("✗ Claude init failed: #{status} - #{error}")
end

# Test list tools
IO.puts("\n2. Testing List Tools...")
case KatalystNif.claude_list_tools() do
  {:ok, tools_json} ->
    tools = Jason.decode!(tools_json)
    IO.puts("✓ Available tools: #{inspect(tools)}")
  {status, error} ->
    IO.puts("✗ List tools failed: #{status} - #{error}")
end

# Test create session
IO.puts("\n3. Testing Create Session...")
config = %{
  model: "claude-3-5-sonnet-20241022",
  temperature: 0.7,
  tools: ["Read", "Write"],
  memory_enabled: false,
  mcp_servers: [],
  environment: %{}
}

config_json = Jason.encode!(config)

case KatalystNif.claude_create_session(config_json) do
  {:session_created, session_json} ->
    session = Jason.decode!(session_json, keys: :atoms)
    IO.puts("✓ Session created: #{session.id}")
    
    # Test session retrieval
    IO.puts("\n4. Testing Get Session...")
    case KatalystNif.claude_get_session(session.id) do
      {:ok, retrieved_json} ->
        retrieved = Jason.decode!(retrieved_json, keys: :atoms)
        IO.puts("✓ Session retrieved: #{retrieved.id}")
      {status, error} ->
        IO.puts("✗ Get session failed: #{status} - #{error}")
    end
    
  {status, error} ->
    IO.puts("✗ Create session failed: #{status} - #{error}")
end

IO.puts("\n✅ Basic tests completed!")