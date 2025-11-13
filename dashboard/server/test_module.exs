#!/usr/bin/env elixir

Mix.install([{:katalyst, path: "."}])

IO.puts("Testing if KatalystNif module exists...")
IO.inspect(Code.ensure_loaded(KatalystNif))
IO.puts("Available functions:")
IO.inspect(KatalystNif.__info__(:functions))