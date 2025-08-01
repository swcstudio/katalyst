#!/bin/bash

# Katalyst Next Development Script
# Supports Deno (primary) and Bun (fallback) runtimes

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[Katalyst]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[Success]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[Warning]${NC} $1"
}

print_error() {
    echo -e "${RED}[Error]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "deno.json" ] && [ ! -f "bunfig.toml" ]; then
    print_error "This script must be run from the next directory"
    exit 1
fi

# Set environment variables
export NODE_ENV=development
export PAYLOAD_CONFIG_PATH=./payload.config.ts
export NEXT_TELEMETRY_DISABLED=1

print_status "Starting Katalyst Next development server..."
print_status "Environment: $NODE_ENV"
print_status "Port: 20009"

# Function to start with Deno
start_with_deno() {
    print_status "Using Deno runtime (primary choice)"

    # Check if deno.json exists
    if [ ! -f "deno.json" ]; then
        print_error "deno.json not found"
        return 1
    fi

    print_status "Installing dependencies with Deno..."

    # Start the development server with Deno
    print_success "Starting Katalyst Next with Deno..."
    exec deno run \
        --allow-all \
        --import-map=deno.json \
        --node-modules-dir \
        npm:next dev --port 20009
}

# Function to start with Bun
start_with_bun() {
    print_status "Using Bun runtime (fallback)"

    # Check if bunfig.toml exists
    if [ ! -f "bunfig.toml" ]; then
        print_warning "bunfig.toml not found, using default Bun configuration"
    fi

    # Check if node_modules exists, if not install dependencies
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies with Bun..."
        bun install
    fi

    # Start the development server with Bun
    print_success "Starting Katalyst Next with Bun..."
    exec bun run dev
}

# Function to create a minimal package.json for Bun if needed
create_package_json() {
    if [ ! -f "package.json" ]; then
        print_status "Creating minimal package.json for Bun..."
        cat > package.json << 'EOF'
{
  "name": "katalyst-next",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "next dev --port 20009",
    "build": "next build",
    "start": "next start --port 20009",
    "payload": "payload",
    "payload:migrate": "payload migrate",
    "payload:seed": "payload seed",
    "payload:generate:types": "payload generate:types"
  },
  "dependencies": {
    "next": "^15.1.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-query": "^5.59.20",
    "@heroicons/react": "^2.0.18",
    "payload": "^3.48.0",
    "@payloadcms/next": "^3.48.0",
    "@payloadcms/db-sqlite": "^3.48.0",
    "@payloadcms/richtext-lexical": "^3.48.0",
    "@next/mdx": "^15.1.3",
    "@mdx-js/react": "^3.0.0",
    "sharp": "^0.34.3",
    "framer-motion": "^12.23.7",
    "clsx": "^2.1.0",
    "zustand": "^5.0.1",
    "tailwindcss": "^4.1.7",
    "autoprefixer": "^10.4.20"
  },
  "devDependencies": {
    "@types/react": "^19.1.4",
    "@types/react-dom": "^19.1.5",
    "typescript": "^5.6.3",
    "@biomejs/biome": "^1.9.4"
  }
}
EOF
        print_success "Created package.json for Bun fallback"
    fi
}

# Main execution logic
main() {
    print_status "Katalyst Framework - Next Development Environment"
    print_status "Checking available runtimes..."

    # Check for Deno first (primary choice)
    if command -v deno &> /dev/null; then
        print_success "Deno detected: $(deno --version | head -n1)"
        start_with_deno
    # Check for Bun as fallback
    elif command -v bun &> /dev/null; then
        print_warning "Deno not found, falling back to Bun"
        print_success "Bun detected: $(bun --version)"
        create_package_json
        start_with_bun
    else
        print_error "Neither Deno nor Bun runtime found!"
        print_error "Please install Deno (recommended) or Bun:"
        print_error "  Deno: curl -fsSL https://deno.land/install.sh | sh"
        print_error "  Bun:  curl -fsSL https://bun.sh/install | bash"
        exit 1
    fi
}

# Handle interrupts gracefully
cleanup() {
    print_status "Shutting down development server..."
    exit 0
}

trap cleanup SIGINT SIGTERM

# Run main function
main "$@"
