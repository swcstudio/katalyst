#!/bin/bash
# Build script for Katalyst WASM modules for Vercel deployment

set -e

echo "🔨 Building Katalyst WASM modules for Vercel..."

# Check if we're in the right directory
if [ ! -f "runtime/Cargo.toml" ]; then
    echo "❌ Error: runtime/Cargo.toml not found. Please run from core directory."
    exit 1
fi

# Install wasm-pack if not present
if ! command -v wasm-pack &> /dev/null; then
    echo "📦 Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

# Add wasm target for Rust
echo "🎯 Adding wasm32-unknown-unknown target..."
rustup target add wasm32-unknown-unknown

# Build each runtime component
echo "🏗️ Building runtime components..."

# Build core wasm runtime
echo "  - Building katalyst-wasm-runtime..."
cd runtime/katalyst-wasm-runtime
wasm-pack build --target web --out-dir pkg --scope katalyst
cd ../..

# Build TUI if needed for web
echo "  - Building katalyst-tui..."
cd runtime/katalyst-tui
cargo build --target wasm32-unknown-unknown --release
cd ../..

# Build terminal pro for web
echo "  - Building katalyst-terminal-pro..."
cd runtime/katalyst-terminal-pro
bash build-wasm.sh
cd ../..

# Copy built WASM files to api directory
echo "📋 Copying WASM files to api directory..."
mkdir -p api/wasm
cp -r runtime/katalyst-wasm-runtime/pkg/* api/wasm/
find runtime -name "*.wasm" -exec cp {} api/wasm/ \;

# Create TypeScript bindings
echo "📝 Creating TypeScript bindings..."
cat > api/wasm/index.ts << 'EOF'
// Auto-generated WASM bindings for Katalyst
export * from './katalyst_wasm_runtime';

// Import WASM modules
import initWasm, { 
  KatalystRuntime, 
  process_command, 
  initialize_runtime 
} from './katalyst_wasm_runtime';

// Initialize WASM module
let wasmInitialized = false;

export async function initializeKatalystWasm() {
  if (!wasmInitialized) {
    await initWasm();
    wasmInitialized = true;
  }
}

export { KatalystRuntime, process_command, initialize_runtime };
EOF

# Create package.json for WASM modules
echo "📦 Creating package.json for WASM modules..."
cat > api/wasm/package.json << 'EOF'
{
  "name": "@katalyst/wasm-modules",
  "version": "0.1.0",
  "description": "Katalyst WASM modules for Vercel Edge Functions",
  "type": "module",
  "main": "index.js",
  "types": "index.d.ts",
  "files": [
    "*.wasm",
    "*.js",
    "*.d.ts"
  ],
  "sideEffects": false
}
EOF

echo "✅ WASM build complete!"
echo "📂 Built files are in api/wasm/"
echo ""
echo "🚀 To use in Vercel Edge Functions:"
echo "   import { initializeKatalystWasm, KatalystRuntime } from '../wasm';"
echo "   await initializeKatalystWasm();"
