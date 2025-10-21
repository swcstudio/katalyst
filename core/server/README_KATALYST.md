# Katalyst Server - Phoenix Framework with Rust NIFs on Fly.io

## Overview

Katalyst Server is a high-performance Phoenix Framework application that leverages:
- **Phoenix Framework 1.7** for real-time web functionality
- **Rust NIFs** (Native Implemented Functions) for CPU-intensive operations
- **Fly.io** for global deployment with GenServer distribution
- **PostgreSQL** for persistent data storage
- **Bandit** HTTP server for high-performance request handling

## Architecture

### Core Components

1. **Phoenix Application**
   - LiveView for real-time UI updates
   - WebSocket support with Rust-accelerated frame processing
   - RESTful API endpoints
   - Telemetry and monitoring

2. **Rust NIFs Integration**
   - High-performance JSON parsing
   - Memory and CPU optimization functions
   - Distributed task execution
   - WebSocket frame processing
   - Benchmark utilities

3. **Fly.io Deployment**
   - Multi-region deployment support
   - Distributed Erlang clustering
   - Auto-scaling capabilities
   - Health checks and monitoring

## Key Features

### Native Functions (Rust NIFs)

- `initialize_katalyst/1` - Initialize the Katalyst system
- `register_genserver/2` - Register GenServer with Fly.io region awareness
- `execute_distributed_task/1` - Execute tasks across multiple regions
- `optimize_memory/0` - Rust-based memory optimization
- `optimize_cpu/0` - CPU optimization through native scheduling
- `process_telemetry/1` - High-speed telemetry data processing
- `benchmark_nif/1` - Performance benchmarking utilities
- `process_websocket_frame/1` - Native WebSocket frame handling
- `parse_json_fast/1` - High-performance JSON parsing

## Setup Instructions

### Prerequisites

- Elixir 1.16+
- Erlang/OTP 26+
- Rust 1.70+
- PostgreSQL 14+
- Fly CLI (for deployment)

### Local Development

1. **Install dependencies:**
   ```bash
   mix deps.get
   ```

2. **Setup database:**
   ```bash
   mix ecto.setup
   ```

3. **Compile Rust NIFs:**
   ```bash
   mix compile
   ```

4. **Start Phoenix server:**
   ```bash
   mix phx.server
   ```

   Or with interactive shell:
   ```bash
   iex -S mix phx.server
   ```

### Testing NIFs

```elixir
# Initialize Katalyst
config = %{
  name: "katalyst-dev",
  mode: "development",
  performance_level: 8,
  fly_region: "dfw",
  genserver_pool_size: 10
}
KatalystNif.init_katalyst(config)

# Benchmark performance
KatalystNif.benchmark(1_000_000)

# Get metrics
KatalystNif.metrics()
```

## Deployment to Fly.io

### Initial Setup

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Authenticate:**
   ```bash
   fly auth login
   ```

3. **Create app:**
   ```bash
   fly apps create katalyst-server
   ```

4. **Create PostgreSQL database:**
   ```bash
   fly postgres create katalyst-db
   fly postgres attach katalyst-db
   ```

5. **Set secrets:**
   ```bash
   fly secrets set SECRET_KEY_BASE=$(mix phx.gen.secret)
   ```

### Deploy

```bash
fly deploy
```

### Scaling

```bash
# Scale to multiple regions
fly regions add ord iad

# Scale instances
fly scale count 3

# Scale VM size
fly scale vm performance-2x
```

## Performance Optimizations

### Rust NIFs Benefits

- **JSON Parsing**: 10-100x faster than pure Elixir
- **Memory Management**: Direct memory control and optimization
- **CPU Scheduling**: Native thread management
- **WebSocket Processing**: High-speed frame handling

### Fly.io Benefits

- **Global Distribution**: Deploy close to users
- **Distributed Erlang**: Native clustering support
- **Auto-scaling**: Handle traffic spikes automatically
- **Built-in Monitoring**: Metrics and logs out of the box

## Configuration

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY_BASE` - Phoenix secret key
- `POOL_SIZE` - Database connection pool size
- `PORT` - HTTP port (default: 4000)
- `FLY_REGION` - Current Fly.io region
- `FLY_APP_NAME` - Fly.io application name

### Mix Config

See `config/` directory for environment-specific configurations:
- `config/dev.exs` - Development settings
- `config/prod.exs` - Production settings
- `config/runtime.exs` - Runtime configuration

## Monitoring

### Telemetry Metrics

The application exposes metrics via:
- `/dashboard` - Phoenix LiveDashboard
- Custom telemetry events for NIF operations
- Fly.io metrics dashboard

### Health Checks

- `GET /health` - Basic health check
- `GET /ready` - Readiness probe
- TCP checks on port 8080

## Development Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes and test:**
   ```bash
   mix test
   mix format
   mix credo
   ```

3. **Compile and verify NIFs:**
   ```bash
   cargo test --manifest-path native/katalyst_nif/Cargo.toml
   mix compile --force
   ```

4. **Deploy to staging:**
   ```bash
   fly deploy --app katalyst-staging
   ```

5. **Deploy to production:**
   ```bash
   fly deploy --app katalyst-server
   ```

## Troubleshooting

### NIF Compilation Issues

If NIFs fail to compile:
1. Ensure Rust is installed: `rustc --version`
2. Clear build artifacts: `rm -rf _build native/katalyst_nif/target`
3. Recompile: `mix deps.compile rustler --force`

### Fly.io Deployment Issues

1. Check logs: `fly logs`
2. SSH into instance: `fly ssh console`
3. Check status: `fly status`
4. Verify secrets: `fly secrets list`

## License

Copyright (c) 2024 Katalyst Framework

## Support

For issues and questions, please open an issue on GitHub or contact the development team.