defmodule Katalyst.MixProject do
  use Mix.Project

  def project do
    [
      app: :katalyst,
      version: "0.1.0",
      elixir: "~> 1.14",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      compilers: Mix.compilers(),
      rustler_crates: rustler_crates()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Katalyst.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.7.21"},
      {:phoenix_ecto, "~> 4.5"},
      {:ecto_sql, "~> 3.10"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_html, "~> 4.1"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix_live_view, "~> 1.0"},
      {:floki, ">= 0.30.0", only: :test},
      {:phoenix_live_dashboard, "~> 0.8.3"},
      {:esbuild, "~> 0.8", runtime: Mix.env() == :dev},
      {:tailwind, "~> 0.2.0", runtime: Mix.env() == :dev},
      {:heroicons,
       github: "tailwindlabs/heroicons",
       tag: "v2.1.1",
       sparse: "optimized",
       app: false,
       compile: false,
       depth: 1},
      {:swoosh, "~> 1.5"},
      {:finch, "~> 0.13"},
      {:telemetry_metrics, "~> 1.0"},
      {:telemetry_poller, "~> 1.0"},
      {:gettext, "~> 0.26"},
      {:jason, "~> 1.2"},
      {:dns_cluster, "~> 0.1.1"},
      {:bandit, "~> 1.5"},
      
      # Rust NIF integration
      {:rustler, "~> 0.36.2"},
      
      # TimescaleDB & Vector support
      # {:pgvector, "~> 0.2.0"},
      # {:timescale, "~> 0.1.0"},
      
      # DragonflyDB client (Redis protocol)
      {:redix, "~> 1.5"},
      {:castore, "~> 1.0"},
      
      # Apache Pulsar client - commented due to telemetry conflict
      # {:pulsar_ex, "~> 0.1.0"},
      
      # HTTP clients for Cloudflare API
      {:req, "~> 0.5.0"},
      {:mint, "~> 1.6"},
      
      # WASM/Deno integration - commented as it may not exist
      # {:wasmex, "~> 0.9.0"},
      
      # Distributed systems support
      {:libcluster, "~> 3.4"},
      {:horde, "~> 0.9.0"},
      
      # Observability
      {:opentelemetry_exporter, "~> 1.8"},
      {:opentelemetry, "~> 1.5"},
      {:opentelemetry_api, "~> 1.4"},
      
      # Development tools
      {:credo, "~> 1.7", only: [:dev, :test], runtime: false},
      {:dialyxir, "~> 1.4", only: [:dev, :test], runtime: false},
      {:ex_doc, "~> 0.34", only: :dev, runtime: false}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      setup: ["deps.get", "ecto.setup", "assets.setup", "assets.build"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"],
      "assets.setup": ["tailwind.install --if-missing", "esbuild.install --if-missing"],
      "assets.build": ["tailwind katalyst", "esbuild katalyst"],
      "assets.deploy": [
        "tailwind katalyst --minify",
        "esbuild katalyst --minify",
        "phx.digest"
      ]
    ]
  end

  defp rustler_crates do
    [
      katalyst_nif: [
        path: "native/katalyst_nif",
        mode: rustler_mode()
      ]
    ]
  end

  defp rustler_mode do
    case Mix.env() do
      :prod -> :release
      _ -> :debug
    end
  end
end
