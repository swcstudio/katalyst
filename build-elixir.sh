#!/bin/bash
# Build script for Elixir/Phoenix components for Vercel deployment

set -e

echo "🔮 Building Elixir/Phoenix components for Vercel..."

# Check if we're in the right directory
if [ ! -f "server/mix.exs" ]; then
    echo "❌ Error: server/mix.exs not found. Please run from core directory."
    exit 1
fi

# Check Elixir installation
if ! command -v elixir &> /dev/null; then
    echo "❌ Error: Elixir not found. Please install Elixir."
    exit 1
fi

# Create api/elixir directory structure
mkdir -p api/elixir

# Copy Phoenix application files
echo "📋 Copying Phoenix application..."
cp -r server/lib api/elixir/
cp -r server/config api/elixir/
cp -r server/priv api/elixir/
cp server/mix.exs api/elixir/
cp server/mix.lock api/elixir/

# Create production configuration
echo "⚙️ Creating production configuration..."
cat > api/elixir/config/prod.exs << 'EOF'
import Config

# Database configuration
config :katalyst, Katalyst.Repo,
  url: System.get_env("DATABASE_URL"),
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
  ssl: true

# Endpoint configuration
config :katalyst, KatalystWeb.Endpoint,
  url: [host: System.get_env("HOST"), port: 80],
  cache_static_manifest: "priv/static/cache_manifest.json",
  server: false,
  secret_key_base: System.get_env("SECRET_KEY_BASE")

# Runtime configuration
config :katalyst, KatalystWeb.Endpoint,
  server: true

# Logger configuration
config :logger, level: :info

# Phoenix configuration
config :phoenix, :json_library, Jason
EOF

# Create release configuration
echo "📦 Creating release configuration..."
cat > api/elixir/config/runtime.exs << 'EOF'
import Config

# Runtime configuration
if config_env() == :prod do
  database_url =
    System.get_env("DATABASE_URL") ||
      raise """
      environment variable DATABASE_URL is missing.
      For example: ecto://USER:PASS@HOST/DATABASE
      """

  config :katalyst, Katalyst.Repo,
    # ssl: false,
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  config :katalyst, KatalystWeb.Endpoint,
    url: [host: System.get_env("HOST"), port: 80],
    cache_static_manifest: "priv/static/cache_manifest.json",
    server: true,
    secret_key_base: secret_key_base

  config :katalyst, :dns_cluster_query, System.get_env("DNS_CLUSTER_QUERY")
end
EOF

# Create Vercel serverless function handler
echo "🌐 Creating Vercel serverless function handler..."
cat > api/elixir/index.js << 'EOF'
const { spawn } = require('child_process');
const path = require('path');

module.exports = async (req, res) => {
  // Start Elixir application
  const elixirProcess = spawn('mix', ['phx.server'], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      MIX_ENV: 'prod',
      PORT: '8080',
      HOST: 'localhost'
    }
  });

  // Wait for server to start
  await new Promise((resolve) => {
    elixirProcess.stdout.on('data', (data) => {
      if (data.toString().includes('Running KatalystWeb.Endpoint')) {
        resolve();
      }
    });
  });

  // Proxy request to Elixir application
  const http = require('http');
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  req.pipe(proxyReq);
};
EOF

# Create build script for Elixir
echo "🔨 Creating Elixir build script..."
cat > api/elixir/build.sh << 'EOF'
#!/bin/bash
set -e

echo "📦 Installing Elixir dependencies..."
mix deps.get --only prod

echo "🔨 Compiling application..."
MIX_ENV=prod mix compile

echo "📦 Creating release..."
MIX_ENV=prod mix release

echo "✅ Elixir build complete!"
EOF

chmod +x api/elixir/build.sh

# Create package.json for build scripts
echo "📝 Creating package.json..."
cat > api/elixir/package.json << 'EOF'
{
  "name": "@katalyst/elixir-api",
  "version": "0.1.0",
  "description": "Elixir Phoenix API for Katalyst on Vercel",
  "scripts": {
    "build": "./build.sh",
    "start": "mix phx.server"
  },
  "engines": {
    "elixir": ">=1.15.0",
    "otp": ">=26.0"
  }
}
EOF

# Create Vercel configuration for Elixir
echo "⚙️ Creating Vercel configuration for Elixir..."
cat > api/elixir/vercel.json << 'EOF'
{
  "runtime": "elixir",
  "buildCommand": "./build.sh",
  "outputDirectory": "_build/prod/rel/katalyst",
  "installCommand": "mix deps.get --only prod",
  "devCommand": "mix phx.server",
  "maxDuration": 30,
  "memory": 1024,
  "includeFiles": ["lib/**", "config/**", "priv/**", "mix.*"],
  "excludeFiles": ["_build/**", "deps/**", ".elixir_ls/**"],
  "environment": {
    "MIX_ENV": "prod",
    "HOST": "localhost",
    "PORT": "8080"
  }
}
EOF

echo "✅ Elixir build setup complete!"
echo "📂 Built files are in api/elixir/"
echo ""
echo "🚀 To use in Vercel:"
echo "   Phoenix API will be available at /api/elixir/"
echo "   Build with: ./build.sh"
echo ""
echo "📋 Required environment variables:"
echo "   - DATABASE_URL"
echo "   - SECRET_KEY_BASE"
echo "   - HOST"
echo "   - POOL_SIZE"
