#!/bin/bash

# Check/install Deno
if ! command -v deno &> /dev/null; then
  curl -fsSL https://deno.land/install.sh | sh
  source ~/.bashrc
fi

# Stable: Core lib/tests built
mkdir -p shared/src/native
# (Cargo.toml created above)
cargo build --release --package katalyst-core
cd .. && deno task setup && deno task build
cd server && mix deps.get && mix compile

# Config-required: Threads/keys (env)
export RAYON_THREADS=4
export TOKIO_WORKERS=2
export API_KEY=your_claude_key

# Multithreading init
echo "Threads: $RAYON_THREADS, Workers: $TOKIO_WORKERS"

# Run (separate terminals)
(cd apps/mobile && npx expo start) &
(cd server && mix phx.server)
