#!/bin/bash

# Build script for Katalyst Terminal Pro WebAssembly

set -e

echo "Building Katalyst Terminal Pro for WebAssembly..."

# Install wasm-pack if not already installed
if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi

# Clean previous builds
rm -rf pkg www/pkg

# Build with wasm-pack
echo "Building WASM module..."
wasm-pack build \
    --target web \
    --out-dir www/pkg \
    --features wasm \
    --no-default-features

# Optimize WASM file size
if command -v wasm-opt &> /dev/null; then
    echo "Optimizing WASM binary..."
    wasm-opt -Oz \
        www/pkg/katalyst_terminal_pro_bg.wasm \
        -o www/pkg/katalyst_terminal_pro_bg.wasm
fi

# Generate TypeScript definitions
echo "Generating TypeScript definitions..."
wasm-pack build \
    --target web \
    --out-dir www/pkg \
    --features wasm \
    --no-default-features \
    -- --features typescript

# Copy static assets
echo "Copying static assets..."
mkdir -p www/static
cp -r assets/* www/static/ 2>/dev/null || true

# Create package.json for npm distribution
cat > www/package.json << EOF
{
  "name": "katalyst-terminal-pro",
  "version": "0.1.0",
  "description": "High-performance WebAssembly terminal with DevContainer support",
  "main": "pkg/katalyst_terminal_pro.js",
  "types": "pkg/katalyst_terminal_pro.d.ts",
  "scripts": {
    "serve": "python3 -m http.server 8000",
    "build": "sh ../build-wasm.sh"
  },
  "keywords": [
    "terminal",
    "wasm",
    "webassembly",
    "devcontainer",
    "zellij",
    "helix"
  ],
  "author": "Katalyst Team",
  "license": "MIT OR Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/katalyst/terminal-pro"
  }
}
EOF

# Create simple HTTP server script
cat > www/serve.py << 'EOF'
#!/usr/bin/env python3
import http.server
import socketserver
import os

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

PORT = 8000
os.chdir('www')

with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}/")
    httpd.serve_forever()
EOF

chmod +x www/serve.py

# Display build results
echo ""
echo "✅ WebAssembly build complete!"
echo ""
echo "Build artifacts:"
echo "  - WASM module: www/pkg/katalyst_terminal_pro_bg.wasm"
echo "  - JavaScript bindings: www/pkg/katalyst_terminal_pro.js"
echo "  - TypeScript definitions: www/pkg/katalyst_terminal_pro.d.ts"
echo ""
echo "To run the web interface:"
echo "  cd www && python3 -m http.server 8000"
echo "  Then open http://localhost:8000 in your browser"
echo ""

# Check file sizes
if [ -f "www/pkg/katalyst_terminal_pro_bg.wasm" ]; then
    SIZE=$(du -h www/pkg/katalyst_terminal_pro_bg.wasm | cut -f1)
    echo "WASM module size: $SIZE"
fi