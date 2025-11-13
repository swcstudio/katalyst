#!/bin/bash
# Main build script for all Katalyst components for Vercel deployment

set -e

echo "🚀 Building Katalyst multi-language components for Vercel..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf api/
mkdir -p api

# Run individual build scripts
echo "🔨 Building Python components..."
./build-python.sh

echo "🔮 Building Elixir components..."
./build-elixir.sh

echo "📦 Building WASM components..."
./build-wasm.sh

# Create unified API index
echo "📝 Creating unified API index..."
cat > api/index.ts << 'EOF'
// Katalyst Multi-Language API Gateway
// Routes requests to appropriate runtime

import { KatalystVercelClient } from '../wasm-modules/vercel-integration';

// Runtime configuration
const runtimeConfig = {
  deno: {
    endpoint: process.env.DENO_ENDPOINT || 'https://your-deno-app.vercel.app',
    apiKey: process.env.DENO_API_KEY,
  },
  wasmex: {
    endpoint: process.env.WASMEX_ENDPOINT || 'https://your-elixir-app.vercel.app/api/elixir',
    apiKey: process.env.WASMEX_API_KEY,
  },
  wasmer: {
    endpoint: process.env.WASMER_ENDPOINT || 'https://your-wasmer-app.vercel.app',
    apiKey: process.env.WASMER_API_KEY,
  },
  preferredRuntime: 'deno',
  fallbackOrder: ['wasmex', 'wasmer', 'deno'],
};

// Create client instance
const katalystClient = new KatalystVercelClient(runtimeConfig);

// Handler for Vercel Edge Functions
export default async function handler(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  try {
    // Route to appropriate runtime
    if (path.startsWith('/api/python/')) {
      return await handlePythonRequest(request, path);
    } else if (path.startsWith('/api/elixir/')) {
      return await handleElixirRequest(request, path);
    } else if (path.startsWith('/api/wasm/')) {
      return await handleWasmRequest(request, path);
    } else if (path.startsWith('/api/rust/')) {
      return await handleRustRequest(request, path);
    } else {
      // Default to stateful Katalyst execution
      return await handleKatalystRequest(request);
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Python request handler
async function handlePythonRequest(request: Request, path: string) {
  const pythonUrl = 'http://localhost:8000' + path.replace('/api/python', '');
  
  const response = await fetch(pythonUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
  
  return response;
}

// Elixir request handler
async function handleElixirRequest(request: Request, path: string) {
  const elixirUrl = 'http://localhost:4000' + path.replace('/api/elixir', '');
  
  const response = await fetch(elixirUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
  
  return response;
}

// WASM request handler
async function handleWasmRequest(request: Request, path: string) {
  const { initializeKatalystWasm } = await import('../wasm-modules');
  await initializeKatalystWasm();
  
  // Handle WASM-specific logic here
  const requestData = await request.json();
  
  const result = await katalystClient.executeStatefulCall({
    method: requestData.method || 'process',
    params: requestData.params || {},
    runtime: 'deno',
  });
  
  return new Response(
    JSON.stringify(result),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

// Rust request handler
async function handleRustRequest(request: Request, path: string) {
  // Handle Rust-specific logic
  const requestData = await request.json();
  
  const result = await katalystClient.executeStatefulCall({
    method: requestData.method || 'process',
    params: requestData.params || {},
    runtime: 'wasmer',
  });
  
  return new Response(
    JSON.stringify(result),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

// Default Katalyst request handler
async function handleKatalystRequest(request: Request) {
  const requestData = await request.json();
  
  const result = await katalystClient.executeStatefulCall({
    method: requestData.method || 'execute',
    params: requestData.params || {},
  });
  
  return new Response(
    JSON.stringify(result),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

// Health check endpoint
export async function GET() {
  return new Response(
    JSON.stringify({ 
      status: 'healthy', 
      service: 'katalyst-multi-language',
      runtimes: ['python', 'elixir', 'wasm', 'rust']
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
EOF

# Create package.json for unified API
echo "📦 Creating unified package.json..."
cat > api/package.json << 'EOF'
{
  "name": "@katalyst/api",
  "version": "0.1.0",
  "description": "Unified Katalyst API for Vercel",
  "type": "module",
  "dependencies": {
    "@katalyst/wasm-modules": "file:../wasm-modules"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Update root package.json
echo "📝 Updating root package.json..."
if [ -f "package.json" ]; then
  # Add build scripts if they don't exist
  if ! grep -q "build:all" package.json; then
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      pkg.scripts = pkg.scripts || {};
      pkg.scripts['build:all'] = './build-all.sh';
      pkg.scripts['build:python'] = './build-python.sh';
      pkg.scripts['build:elixir'] = './build-elixir.sh';
      pkg.scripts['build:wasm'] = './build-wasm.sh';
      pkg.scripts['vercel-build'] = 'npm run build:all';
      fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
  fi
fi

echo "✅ Multi-language build complete!"
echo ""
echo "📂 Built structure:"
echo "   api/"
echo "   ├── python/     # Python/FastAPI components"
echo "   ├── elixir/     # Elixir/Phoenix components"
echo "   ├── wasm/       # WASM modules"
echo "   └── index.ts    # Unified API gateway"
echo ""
echo "🚀 Deployment ready for Vercel!"
echo ""
echo "📋 Required environment variables:"
echo "   - DATABASE_URL (for Elixir)"
echo "   - SECRET_KEY_BASE (for Elixir)"
echo "   - CLAUDE_API_KEY or CLAUDE_SESSION_TOKEN (for Python)"
echo "   - DENO_ENDPOINT (optional)"
echo "   - WASMEX_ENDPOINT (optional)"
echo "   - WASMER_ENDPOINT (optional)"
