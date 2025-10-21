#!/bin/bash

# Katalyst WASM Setup Script
# This script installs all necessary dependencies for the Katalyst terminal

set -e

echo "🚀 Setting up Katalyst WASM Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
else
    print_error "Unsupported OS: $OSTYPE"
    exit 1
fi

print_status "Detected OS: $OS"

# Install system dependencies
print_info "Installing system dependencies..."

if [ "$OS" == "linux" ]; then
    sudo apt-get update
    sudo apt-get install -y \
        build-essential \
        pkg-config \
        libssl-dev \
        libgtk-3-dev \
        libwebkit2gtk-4.0-dev \
        libappindicator3-dev \
        librsvg2-dev \
        cmake \
        llvm \
        clang \
        libclang-dev \
        neovim \
        tmux \
        ripgrep \
        fd-find \
        bat \
        exa \
        fzf \
        git \
        curl \
        wget
elif [ "$OS" == "macos" ]; then
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        print_info "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    brew install \
        pkg-config \
        cmake \
        llvm \
        neovim \
        tmux \
        ripgrep \
        fd \
        bat \
        exa \
        fzf \
        git \
        curl \
        wget
fi

print_status "System dependencies installed"

# Install Rust if not present
if ! command -v rustc &> /dev/null; then
    print_info "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
else
    print_status "Rust already installed"
fi

# Update Rust and install components
print_info "Updating Rust and installing components..."
rustup update
rustup component add rust-analyzer
rustup component add clippy
rustup component add rustfmt

# Install cargo tools
print_info "Installing cargo tools..."
cargo install --locked \
    cargo-watch \
    cargo-edit \
    cargo-expand \
    cargo-outdated \
    cargo-audit \
    cargo-deny \
    cargo-machete \
    sccache

print_status "Cargo tools installed"

# Install Language Servers
print_info "Installing language servers..."

# Node.js and npm (for TypeScript/JavaScript servers)
if ! command -v node &> /dev/null; then
    print_info "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# TypeScript/JavaScript
npm install -g \
    typescript \
    typescript-language-server \
    @angular/language-server \
    vscode-langservers-extracted \
    prettier \
    eslint \
    @biomejs/biome

print_status "Node.js language servers installed"

# Python
print_info "Installing Python language servers..."
pip3 install --user \
    python-lsp-server[all] \
    pylsp-mypy \
    pylsp-rope \
    black \
    isort \
    flake8 \
    mypy \
    debugpy

print_status "Python language servers installed"

# Go
if command -v go &> /dev/null; then
    print_info "Installing Go language servers..."
    go install golang.org/x/tools/gopls@latest
    go install github.com/go-delve/delve/cmd/dlv@latest
    go install golang.org/x/tools/cmd/goimports@latest
    go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
    print_status "Go language servers installed"
else
    print_info "Go not installed, skipping Go language servers"
fi

# Java
if command -v java &> /dev/null; then
    print_info "Installing Java language servers..."
    # Download Eclipse JDT Language Server
    mkdir -p ~/.local/share/nvim/lsp_servers/jdtls
    cd ~/.local/share/nvim/lsp_servers/jdtls
    wget https://download.eclipse.org/jdtls/snapshots/jdt-language-server-latest.tar.gz
    tar -xzf jdt-language-server-latest.tar.gz
    rm jdt-language-server-latest.tar.gz
    cd -
    print_status "Java language servers installed"
else
    print_info "Java not installed, skipping Java language servers"
fi

# Ruby
if command -v gem &> /dev/null; then
    print_info "Installing Ruby language servers..."
    gem install solargraph
    print_status "Ruby language servers installed"
else
    print_info "Ruby not installed, skipping Ruby language servers"
fi

# PHP
if command -v php &> /dev/null; then
    print_info "Installing PHP language servers..."
    npm install -g intelephense
    print_status "PHP language servers installed"
else
    print_info "PHP not installed, skipping PHP language servers"
fi

# C/C++
print_info "Installing C/C++ language servers..."
if [ "$OS" == "linux" ]; then
    sudo apt-get install -y clangd-15
elif [ "$OS" == "macos" ]; then
    brew install llvm
fi
print_status "C/C++ language servers installed"

# Elixir
if command -v mix &> /dev/null; then
    print_info "Installing Elixir language servers..."
    mkdir -p ~/.local/share/nvim/lsp_servers/elixir-ls
    cd ~/.local/share/nvim/lsp_servers/elixir-ls
    wget https://github.com/elixir-lsp/elixir-ls/releases/latest/download/elixir-ls.zip
    unzip -o elixir-ls.zip
    rm elixir-ls.zip
    chmod +x language_server.sh
    cd -
    print_status "Elixir language servers installed"
else
    print_info "Elixir not installed, skipping Elixir language servers"
fi

# Kotlin
print_info "Installing Kotlin language server..."
mkdir -p ~/.local/share/nvim/lsp_servers/kotlin
cd ~/.local/share/nvim/lsp_servers/kotlin
wget https://github.com/fwcd/kotlin-language-server/releases/latest/download/server.zip
unzip -o server.zip
rm server.zip
chmod +x server/bin/kotlin-language-server
cd -
print_status "Kotlin language server installed"

# Install Wasmer
print_info "Installing Wasmer..."
curl https://get.wasmer.io -sSfL | sh
print_status "Wasmer installed"

# Install Deno
print_info "Installing Deno..."
curl -fsSL https://deno.land/x/install/install.sh | sh
print_status "Deno installed"

# Install Tauri CLI
print_info "Installing Tauri CLI..."
cargo install tauri-cli --version "^2.0.0-rc"
print_status "Tauri CLI installed"

# Setup Neovim configuration
print_info "Setting up Neovim configuration..."
mkdir -p ~/.config/katalyst/nvim
cp -r config/nvim/* ~/.config/katalyst/nvim/
print_status "Neovim configuration installed"

# Build the project
print_info "Building Katalyst..."
cargo build --release
print_status "Build complete"

echo ""
echo "========================================="
echo -e "${GREEN}✨ Katalyst WASM setup complete!${NC}"
echo "========================================="
echo ""
echo "To run the terminal interface:"
echo "  cargo run --bin katalyst"
echo ""
echo "To run the desktop application:"
echo "  cargo run --bin katalyst-desktop"
echo ""
echo "Configuration directory: ~/.config/katalyst/"
echo ""
print_info "Don't forget to add ~/.cargo/bin to your PATH if not already done"
print_info "You may need to restart your terminal for all changes to take effect"