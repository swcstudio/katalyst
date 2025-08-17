#!/usr/bin/env elixir

Mix.install([{:katalyst, path: "."}])

IO.puts("🔍 Testing Minimal Python Integration...")
IO.puts("=" |> String.duplicate(50))

# Test Claude init only (which just prints a message and doesn't use Python)
IO.puts("1. Testing Claude Init Only...")
case KatalystNif.claude_init() do
  {:ok, message} ->
    IO.puts("✓ Claude init successful: #{message}")
  {status, error} ->
    IO.puts("✗ Claude init failed: #{status} - #{error}")
end

IO.puts("\n✅ Minimal test completed!")