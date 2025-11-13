#!/usr/bin/env elixir

# Test script for Claude Code integration
# Run with: elixir test_claude_integration.exs

Mix.install([
  {:httpoison, "~> 2.0"},
  {:jason, "~> 1.4"}
])

defmodule ClaudeIntegrationTest do
  @base_url "http://localhost:4000/api/claude-code"
  
  def run_tests do
    IO.puts("\n🔍 Testing Claude Code Integration...")
    IO.puts("=" |> String.duplicate(50))
    
    # Test 1: Generate Code
    test_generate_code()
    
    # Test 2: Analyze Code
    test_analyze_code()
    
    # Test 3: Session Management
    test_session_management()
    
    IO.puts("\n✅ All tests completed!")
  end
  
  defp test_generate_code do
    IO.puts("\n📝 Test 1: Generate Code")
    
    body = Jason.encode!(%{
      prompt: "Create a function to calculate factorial",
      language: "elixir"
    })
    
    case HTTPoison.post("#{@base_url}/actions/generate-code", body, headers()) do
      {:ok, %{status_code: 200, body: response_body}} ->
        response = Jason.decode!(response_body)
        IO.puts("✓ Code generation successful")
        IO.puts("Generated code preview: #{String.slice(response["code"] || "", 0, 100)}...")
        
      {:ok, %{status_code: code}} ->
        IO.puts("✗ Failed with status code: #{code}")
        
      {:error, reason} ->
        IO.puts("✗ Request failed: #{inspect(reason)}")
    end
  end
  
  defp test_analyze_code do
    IO.puts("\n🔍 Test 2: Analyze Code")
    
    code = """
    def factorial(n) when n <= 1, do: 1
    def factorial(n), do: n * factorial(n - 1)
    """
    
    body = Jason.encode!(%{
      code: code,
      language: "elixir"
    })
    
    case HTTPoison.post("#{@base_url}/actions/analyze-code", body, headers()) do
      {:ok, %{status_code: 200, body: response_body}} ->
        response = Jason.decode!(response_body)
        IO.puts("✓ Code analysis successful")
        IO.puts("Analysis preview: #{String.slice(response["analysis"] || "", 0, 100)}...")
        
      {:ok, %{status_code: code}} ->
        IO.puts("✗ Failed with status code: #{code}")
        
      {:error, reason} ->
        IO.puts("✗ Request failed: #{inspect(reason)}")
    end
  end
  
  defp test_session_management do
    IO.puts("\n🎮 Test 3: Session Management")
    
    # Create a session
    config = %{
      model: "claude-3-5-sonnet-20241022",
      temperature: 0.7,
      tools: ["Read", "Write"],
      memory_enabled: false,
      mcp_servers: [],
      environment: %{}
    }
    
    body = Jason.encode!(%{config: config})
    
    case HTTPoison.post("#{@base_url}/sessions", body, headers()) do
      {:ok, %{status_code: 201, body: response_body}} ->
        response = Jason.decode!(response_body)
        session_id = get_in(response, ["session", "id"])
        IO.puts("✓ Session created: #{session_id}")
        
        # Send a message
        test_send_message(session_id)
        
        # Terminate session
        test_terminate_session(session_id)
        
      {:ok, %{status_code: code, body: body}} ->
        IO.puts("✗ Failed to create session with status code: #{code}")
        IO.puts("Response: #{body}")
        
      {:error, reason} ->
        IO.puts("✗ Request failed: #{inspect(reason)}")
    end
  end
  
  defp test_send_message(session_id) do
    message = %{
      role: "user",
      content: "Hello, Claude!",
      timestamp: DateTime.utc_now() |> DateTime.to_iso8601(),
      metadata: %{}
    }
    
    body = Jason.encode!(%{message: message})
    
    case HTTPoison.post("#{@base_url}/sessions/#{session_id}/messages", body, headers()) do
      {:ok, %{status_code: 200}} ->
        IO.puts("  ✓ Message sent successfully")
        
      {:ok, %{status_code: code}} ->
        IO.puts("  ✗ Failed to send message with status code: #{code}")
        
      {:error, reason} ->
        IO.puts("  ✗ Message send failed: #{inspect(reason)}")
    end
  end
  
  defp test_terminate_session(session_id) do
    case HTTPoison.delete("#{@base_url}/sessions/#{session_id}", headers()) do
      {:ok, %{status_code: 200}} ->
        IO.puts("  ✓ Session terminated successfully")
        
      {:ok, %{status_code: code}} ->
        IO.puts("  ✗ Failed to terminate session with status code: #{code}")
        
      {:error, reason} ->
        IO.puts("  ✗ Session termination failed: #{inspect(reason)}")
    end
  end
  
  defp headers do
    [
      {"Content-Type", "application/json"},
      {"Accept", "application/json"}
    ]
  end
end

# Run the tests
ClaudeIntegrationTest.run_tests()