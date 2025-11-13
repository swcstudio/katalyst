#!/usr/bin/env elixir

# Simple test for basic NIF functionality
Mix.install([])

defmodule SimpleTest do
  def run do
    IO.puts("Testing basic NIF functions...")
    
    # Test basic NIFs first
    case KatalystNif.initialize_katalyst("{\"name\":\"test\",\"mode\":\"development\"}") do
      {:initialized, msg} ->
        IO.puts("✓ Basic NIF works: #{msg}")
      {status, error} ->
        IO.puts("✗ Basic NIF failed: #{status} - #{error}")
    end
  end
end

SimpleTest.run()