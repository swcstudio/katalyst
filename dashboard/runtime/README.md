# Katalyst WASM - Advanced Terminal User Interface

A state-of-the-art terminal user interface built with Rust, WebAssembly, and modern frameworks. Katalyst combines the power of a fully-featured IDE with the efficiency of a terminal-based workflow.

## Features

### Core Capabilities
- **Multi-Language Support**: Integrated LSP servers for Rust, TypeScript/JavaScript, Python, Java, C/C++, Go, Ruby, PHP, Elixir, Kotlin, and C#/.NET
- **WebAssembly Runtime**: Built-in Wasmer runtime for executing WASM modules with sandboxing
- **Deno Integration**: JavaScript/TypeScript execution with Deno runtime
- **Advanced Search**: Tantivy-powered full-text search with fuzzy matching and symbol indexing
- **Cross-Platform**: Tauri 2.0 for desktop, Lynx-based for mobile/web

### Terminal Features
- **Multiplexing**: tmux-like capabilities with split panes and sessions
- **Rich TUI**: Built with Ratatui for beautiful, responsive interfaces
- **Syntax Highlighting**: Tree-sitter based highlighting for all supported languages
- **File Explorer**: Interactive file tree with preview
- **Command Palette**: Quick access to all commands and functions
- **Integrated Terminal**: Multiple terminal instances with full PTY support

### Developer Experience
- **IntelliSense**: Real-time code completion from language servers
- **Hover Information**: Instant documentation and type information
- **Go to Definition**: Navigate code with LSP support
- **Find References**: Locate all usages across the codebase
- **Symbol Search**: Fast navigation to functions, classes, and variables
- **Diagnostics**: Real-time error and warning highlighting

### Performance & Scalability
- **Parallel Processing**: Rayon-based parallel file operations
- **Incremental Indexing**: Efficient code indexing with Tantivy
- **Memory Efficiency**: Optimized for large codebases
- **Async Architecture**: Tokio-based async runtime

### Notifications & Integration
- **Push Notifications**: System notifications even when minimized
- **Global Shortcuts**: System-wide keyboard shortcuts
- **System Tray**: Background operation with quick access
- **Auto-Updates**: Built-in update mechanism

## Installation

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install system dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y \
    build-essential \
    pkg-config \
    libssl-dev \
    libgtk-3-dev \
    libwebkit2gtk-4.0-dev \
    libappindicator3-dev \
    librsvg2-dev

# Install language servers
# Rust
rustup component add rust-analyzer

# TypeScript/JavaScript
npm install -g typescript typescript-language-server

# Python
pip install python-lsp-server[all]

# Go
go install golang.org/x/tools/gopls@latest

# Additional language servers...
```

### Build from Source
```bash
# Clone the repository
git clone https://github.com/katalyst/katalyst-wasm.git
cd katalyst-wasm

# Build the project
cargo build --release

# Run the TUI
cargo run --bin katalyst

# Or run the desktop app
cargo run --bin katalyst-desktop
```

## Usage

### Basic Commands
- `Ctrl+P`: Open command palette
- `Ctrl+Shift+F`: Global search
- `Ctrl+\``: Toggle terminal
- `Ctrl+B`: Toggle file explorer
- `Ctrl+Tab`: Switch between tabs

### Terminal Multiplexing
- `Ctrl+Shift+D`: Split pane horizontally
- `Ctrl+D`: Split pane vertically
- `Ctrl+W`: Close current pane
- `Alt+Arrow`: Navigate between panes

### Code Navigation
- `F12`: Go to definition
- `Shift+F12`: Find all references
- `Ctrl+Space`: Trigger completion
- `Ctrl+Shift+Space`: Show signature help
- `F2`: Rename symbol

## Configuration

Configuration file located at `~/.config/katalyst/config.toml`:

```toml
[general]
theme = "dark"
font_size = 14
tab_size = 4
auto_save = true

[lsp]
enable_all = true
format_on_save = true

[search]
index_on_startup = true
fuzzy_matching = true
max_results = 100

[terminal]
shell = "/bin/zsh"
scrollback = 10000

[keybindings]
# Custom keybindings
command_palette = "ctrl+shift+p"
global_search = "ctrl+shift+f"
```

## Architecture

### Project Structure
```
katalyst-wasm/
├── katalyst-tui/        # Main TUI application
├── katalyst-core/       # Shared utilities and types
├── katalyst-lsp/        # Language server integration
├── katalyst-wasm-runtime/ # WebAssembly runtime
├── katalyst-desktop/    # Tauri desktop application
└── katalyst-mobile/     # Mobile/web support
```

### Technology Stack
- **Frontend**: Ratatui, Crossterm
- **Backend**: Tokio, Tower-LSP
- **Search**: Tantivy, Skim
- **WebAssembly**: Wasmer, Wasmtime
- **Desktop**: Tauri 2.0
- **Runtime**: Deno Core

## Development

### Running Tests
```bash
cargo test --workspace
```

### Building for Production
```bash
# Desktop application
cargo tauri build

# TUI only
cargo build --release --bin katalyst
```

### Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Roadmap

- [ ] Redox OS integration for enhanced security
- [ ] Collaborative editing support
- [ ] Plugin system with WASM plugins
- [ ] AI-powered code suggestions
- [ ] Remote development support
- [ ] Integrated debugger
- [ ] Performance profiling tools
- [ ] Git integration with visual diff
- [ ] Integrated package manager
- [ ] Cloud synchronization

## License

This project is dual-licensed under MIT OR Apache-2.0.

## Acknowledgments

- Ratatui team for the excellent TUI framework
- Tauri team for the desktop application framework
- Language server protocol contributors
- Wasmer team for the WebAssembly runtime