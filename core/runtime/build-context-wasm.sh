#!/bin/bash

# Build script for Context Engineering WASM modules
# Compiles Rust modules to WebAssembly for use in Katalyst framework

set -e

echo "🚀 Building Context Engineering WASM modules..."

# Navigate to the wasm runtime directory
cd katalyst-wasm-runtime

# Build for wasm32-unknown-unknown target
echo "📦 Building WASM modules..."
cargo build --target wasm32-unknown-unknown --release

# Install wasm-bindgen-cli if not present
if ! command -v wasm-bindgen &> /dev/null; then
    echo "📥 Installing wasm-bindgen-cli..."
    cargo install wasm-bindgen-cli
fi

# Generate JavaScript bindings
echo "🔗 Generating JavaScript bindings..."
mkdir -p ../wasm-output

wasm-bindgen \
    --target web \
    --out-dir ../wasm-output \
    --out-name context_engineering \
    target/wasm32-unknown-unknown/release/katalyst_wasm_runtime.wasm

# Optimize WASM file size with wasm-opt if available
if command -v wasm-opt &> /dev/null; then
    echo "⚡ Optimizing WASM file size..."
    wasm-opt -O3 \
        ../wasm-output/context_engineering_bg.wasm \
        -o ../wasm-output/context_engineering_bg_optimized.wasm
    mv ../wasm-output/context_engineering_bg_optimized.wasm \
       ../wasm-output/context_engineering_bg.wasm
fi

# Build with PyO3 support for Python interop
echo "🐍 Building with PyO3 support..."
cargo build --release --features python

# Copy the built library to the server directory for PyO3 integration
echo "📂 Copying libraries to server directory..."
cp target/release/libkatalyst_wasm_runtime.so ../../server/priv/native/ 2>/dev/null || \
cp target/release/libkatalyst_wasm_runtime.dylib ../../server/priv/native/ 2>/dev/null || \
cp target/release/katalyst_wasm_runtime.dll ../../server/priv/native/ 2>/dev/null || true

echo "✅ Build complete!"
echo ""
echo "Generated files:"
echo "  - WASM module: wasm-output/context_engineering_bg.wasm"
echo "  - JS bindings: wasm-output/context_engineering.js"
echo "  - Native library: server/priv/native/libkatalyst_wasm_runtime.*"
echo ""
echo "To use in your Katalyst application:"
echo "  1. Import the WASM module in your Deno/JS code:"
echo "     import init, { ResonanceMeasurer, PromptProgram, ControlLoop } from './wasm-output/context_engineering.js';"
echo "  2. Initialize the module:"
echo "     await init();"
echo "  3. Use the exported classes and functions"