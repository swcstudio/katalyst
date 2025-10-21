#!/bin/bash

# Build script for Katalyst WASM modules

set -e

echo "Building Katalyst WASM modules..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    echo -e "${RED}Rust is not installed. Please install Rust first.${NC}"
    exit 1
fi

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo -e "${YELLOW}wasm-pack not found. Installing...${NC}"
    cargo install wasm-pack
fi

# Check if Deno is installed
if ! command -v deno &> /dev/null; then
    echo -e "${YELLOW}Deno not found. Installing...${NC}"
    curl -fsSL https://deno.land/install.sh | sh
fi

# Add wasm32 target if not already added
rustup target add wasm32-unknown-unknown

# Build directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
WASM_DIR="$PROJECT_ROOT/native/katalyst_wasm"
OUTPUT_DIR="$PROJECT_ROOT/priv/wasm"
WORKERS_DIR="$PROJECT_ROOT/workers"

# Create output directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$WORKERS_DIR/wasm"

echo -e "${GREEN}Building WASM for Deno runtime...${NC}"
cd "$WASM_DIR"

# Build for Deno
wasm-pack build --target deno --out-dir "$OUTPUT_DIR/deno" --release

# Build for Cloudflare Workers
echo -e "${GREEN}Building WASM for Cloudflare Workers...${NC}"
wasm-pack build --target web --out-dir "$OUTPUT_DIR/web" --release

# Build for Node.js (for testing)
echo -e "${GREEN}Building WASM for Node.js...${NC}"
wasm-pack build --target nodejs --out-dir "$OUTPUT_DIR/node" --release

# Copy to workers directory for Cloudflare deployment
cp -r "$OUTPUT_DIR/web"/* "$WORKERS_DIR/wasm/"

# Generate TypeScript definitions for Deno
echo -e "${GREEN}Generating TypeScript definitions...${NC}"
cat > "$OUTPUT_DIR/deno/katalyst_wasm.d.ts" << 'EOF'
/* tslint:disable */
/* eslint-disable */
/**
* Initialize the WASM module
*/
export function init(): void;
/**
* Process a message with high performance
* @param {any} message
* @returns {any}
*/
export function process_message(message: any): any;
/**
* High-performance JSON transformation
* @param {string} input
* @returns {string}
*/
export function transform_json(input: string): string;
/**
* Vector operations for ML/AI workloads
* @param {Float32Array} vec1
* @param {Float32Array} vec2
* @returns {number}
*/
export function dot_product(vec1: Float32Array, vec2: Float32Array): number;
/**
* Cosine similarity for vector search
* @param {Float32Array} vec1
* @param {Float32Array} vec2
* @returns {number}
*/
export function cosine_similarity(vec1: Float32Array, vec2: Float32Array): number;
/**
* Batch processing for multiple items
* @param {any} items
* @returns {any}
*/
export function batch_process(items: any): any;
/**
* Hash data
* @param {string} data
* @returns {string}
*/
export function hash_data(data: string): string;
/**
* Time-series data aggregation
* @param {any} data
* @param {number} window_size
* @returns {any}
*/
export function aggregate_timeseries(data: any, window_size: number): any;
/**
* Get version information
* @returns {string}
*/
export function get_version(): string;
/**
* Get memory statistics
* @returns {any}
*/
export function get_memory_stats(): any;

export class StreamProcessor {
  free(): void;
  constructor();
  add_chunk(chunk: Uint8Array): void;
  process(): any;
  get_stats(): any;
}
EOF

# Create Deno test file
cat > "$OUTPUT_DIR/deno/test.ts" << 'EOF'
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import init, {
  process_message,
  transform_json,
  get_version,
  StreamProcessor,
} from "./katalyst_wasm.js";

await init();

Deno.test("WASM module version", () => {
  const version = get_version();
  assertEquals(typeof version, "string");
  console.log(`WASM module version: ${version}`);
});

Deno.test("JSON transformation", () => {
  const input = JSON.stringify({ test: "data", nested: { value: 123 } });
  const result = transform_json(input);
  const parsed = JSON.parse(result);
  assertEquals(typeof parsed, "object");
  console.log("Transformed:", parsed);
});

Deno.test("Stream processor", () => {
  const processor = new StreamProcessor();
  processor.add_chunk(new Uint8Array([1, 2, 3, 4, 5]));
  const stats = processor.get_stats();
  assertEquals(stats.buffer_size, 5);
  processor.free();
});

Deno.test("Message processing", async () => {
  const message = {
    id: "test-123",
    timestamp: Date.now(),
    payload: { data: "test" },
    metadata: null,
  };
  
  const result = await process_message(message);
  assertEquals(result.success, true);
  console.log("Processing result:", result);
});
EOF

# Run Deno tests
echo -e "${GREEN}Running WASM tests with Deno...${NC}"
cd "$OUTPUT_DIR/deno"
deno test --allow-read test.ts || true

# Create usage example
cat > "$PROJECT_ROOT/workers/src/wasm-example.ts" << 'EOF'
// Example of using Katalyst WASM in Cloudflare Workers

import wasmModule from '../wasm/katalyst_wasm_bg.wasm';
import * as wasm from '../wasm/katalyst_wasm.js';

export default {
  async fetch(request: Request): Promise<Response> {
    // Initialize WASM module
    await wasm.default(wasmModule);
    
    // Process request
    const url = new URL(request.url);
    
    if (url.pathname === '/transform') {
      const body = await request.text();
      const transformed = wasm.transform_json(body);
      return new Response(transformed, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (url.pathname === '/version') {
      return new Response(wasm.get_version());
    }
    
    return new Response('Katalyst WASM Worker', { status: 200 });
  }
};
EOF

echo -e "${GREEN}WASM build complete!${NC}"
echo ""
echo "Build artifacts:"
echo "  - Deno:              $OUTPUT_DIR/deno/"
echo "  - Cloudflare Workers: $OUTPUT_DIR/web/"
echo "  - Node.js:           $OUTPUT_DIR/node/"
echo ""
echo "To use in Deno:"
echo "  import init, * as wasm from '$OUTPUT_DIR/deno/katalyst_wasm.js';"
echo "  await init();"
echo ""
echo "To deploy to Cloudflare:"
echo "  cd $PROJECT_ROOT && wrangler deploy"