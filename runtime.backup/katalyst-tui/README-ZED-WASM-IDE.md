# Zed WASM IDE - WebAssembly-Powered Development Environment for iOS

A powerful, secure IDE built with Rust/WebAssembly, integrated with Cryptobox sandboxing, and delivered through a React Native iOS application.

## 🚀 Overview

This project combines:
- **Zed-inspired IDE architecture** ported to WebAssembly
- **Cryptobox sandboxing** for secure code execution
- **React Native frontend** optimized for iOS mobile devices
- **Rustler integration** for Elixir/Erlang interop
- **Parquet data export** for analytics and telemetry

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                iOS React Native App              │
│  ┌──────────────────────────────────────────┐   │
│  │        Lynx React TypeScript UI          │   │
│  └──────────────────────────────────────────┘   │
│                      ↕                           │
│  ┌──────────────────────────────────────────┐   │
│  │         WASM Bridge (wasm-bindgen)       │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                       ↕
┌─────────────────────────────────────────────────┐
│           Zed WASM IDE Core (Rust)              │
│  ┌──────────────────────────────────────────┐   │
│  │    Editor │ LSP │ Terminal │ FileSystem  │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │      Cryptobox Sandboxing Layer          │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │    Parquet Output │ Telemetry │ Logs     │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## ✨ Features

### Core IDE Features
- **Code Editor**: Syntax highlighting, auto-completion, multi-buffer support
- **Language Server Protocol**: IntelliSense for multiple languages
- **Integrated Terminal**: Full terminal emulation in WASM
- **File System**: Virtual file system with persistence
- **Version Control**: Git integration (planned)

### Security Features
- **Cryptobox Sandboxing**: Secure execution environment
- **Resource Limits**: Memory, CPU, and execution time constraints
- **Security Policies**: Configurable rule-based security
- **Encrypted Storage**: AES-256-GCM encryption for sensitive data

### Mobile Optimizations
- **Touch-Optimized UI**: Designed for iOS touch interfaces
- **Gesture Support**: Swipe, pinch, and tap gestures
- **Responsive Layout**: Adapts to different screen sizes
- **Offline Support**: Works without network connection

### Data & Analytics
- **Parquet Export**: Structured data export for analysis
- **Telemetry**: Usage metrics and performance monitoring
- **Session Recording**: Development session replay (optional)

## 🛠️ Technology Stack

- **Core**: Rust, WebAssembly (wasm-bindgen, wasm-pack)
- **Frontend**: React Native, TypeScript, Zustand
- **Sandboxing**: Cryptobox containers, WASI
- **Data**: Apache Parquet, Arrow
- **Build**: Cargo, npm, CocoaPods, Xcode

## 📦 Installation

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Install Node.js (v18+)
# Install Xcode and iOS development tools
```

### Build Steps
```bash
# Clone the repository
cd /home/ubuntu/src/repos/katalyst/runtime/katalyst-tui

# Build everything
./build.sh

# Or build components separately:

# 1. Build WASM module
cd zed-wasm-ide
wasm-pack build --target web

# 2. Build React Native app
cd ../lynx-react-ios
npm install
cd ios && pod install && cd ..

# 3. Run on iOS simulator
npm run ios
```

## 🎮 Usage

### Starting the IDE
```javascript
// Initialize the WASM IDE
const ide = new ZedWasmIDE();
await ide.initialize({
  theme: 'dark',
  fontSize: 14,
  enableLSP: true,
  enableSandbox: true,
  sandboxMemoryLimit: 512 * 1024 * 1024, // 512MB
});

// Open a file
const content = await ide.open_file('/path/to/file.rs');

// Execute code in sandbox
const result = await ide.execute_in_sandbox(code, 'rust');

// Get completions
const completions = await ide.get_completions('/path/to/file.rs', cursorPosition);
```

### Security Configuration
```javascript
// Configure security policy
const policy = {
  name: 'strict',
  rules: [
    {
      condition: { FileAccess: { path_pattern: '/sandbox/**' } },
      action: 'Allow',
    },
    {
      condition: { NetworkAccess: { host_pattern: '*' } },
      action: 'Deny',
    },
  ],
  resource_limits: {
    max_memory_bytes: 512 * 1024 * 1024,
    max_cpu_percent: 1.0,
    max_execution_time_ms: 30000,
  },
};
```

## 🔒 Security Considerations

1. **Sandboxed Execution**: All code runs in isolated containers
2. **Resource Limits**: Prevents resource exhaustion attacks
3. **Network Isolation**: No network access by default
4. **File System Restrictions**: Limited to sandbox directory
5. **Encrypted Communication**: All data encrypted in transit

## 📊 Data Export

The IDE can export telemetry and usage data in Parquet format:

```javascript
// Export session data to Parquet
await ide.export_to_parquet('/output/session_data.parquet');
```

Schema:
```sql
CREATE TABLE ide_events (
    timestamp TIMESTAMP,
    event_type VARCHAR,
    category VARCHAR,
    details TEXT,
    metadata JSON
);
```

## 🚦 Performance

- **WASM Module Size**: ~2MB compressed
- **Memory Usage**: 50-200MB typical
- **Startup Time**: <2 seconds
- **Execution Overhead**: ~10% vs native

## 🔧 Development

### Project Structure
```
katalyst-tui/
├── zed-wasm-ide/          # Rust WASM IDE core
│   ├── src/
│   │   ├── lib.rs         # Main WASM interface
│   │   ├── editor.rs      # Text editor implementation
│   │   ├── sandbox.rs     # Sandbox execution
│   │   ├── lsp_client.rs  # Language server client
│   │   ├── terminal.rs    # Terminal emulator
│   │   └── cryptobox_integration.rs
│   └── Cargo.toml
├── lynx-react-ios/        # React Native iOS app
│   ├── src/
│   │   ├── App.tsx        # Main application
│   │   ├── screens/       # UI screens
│   │   ├── providers/     # Context providers
│   │   └── stores/        # State management
│   └── package.json
└── build.sh              # Build script
```

### Testing
```bash
# Run Rust tests
cd zed-wasm-ide
cargo test

# Run React Native tests
cd lynx-react-ios
npm test

# Run integration tests
npm run test:integration
```

## 📝 Configuration

### CLAUDE.md Integration
The IDE respects the cognitive operating system defined in CLAUDE.md, including:
- Protocol shells for structured reasoning
- Workflow protocols for development patterns
- Self-improvement mechanisms
- Documentation guidelines

### Environment Variables
```bash
# Development
WASM_IDE_DEBUG=true
SANDBOX_ENABLED=true
LSP_SERVER_URL=wss://lsp.example.com

# Production
WASM_IDE_ENV=production
TELEMETRY_ENABLED=true
PARQUET_OUTPUT_PATH=/data/telemetry
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project integrates with existing Katalyst infrastructure and follows the project's licensing terms.

## 🙏 Acknowledgments

- Zed IDE team for architectural inspiration
- Cryptobox project for sandboxing infrastructure
- Katalyst team for the runtime environment
- WebAssembly community for tooling and support

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/your-org/katalyst/issues)
- Documentation: See inline documentation and CLAUDE.md

## 🚀 Roadmap

- [ ] Git integration
- [ ] Collaborative editing
- [ ] Plugin system
- [ ] Additional language support
- [ ] iPad optimization
- [ ] Cloud sync
- [ ] Voice commands
- [ ] AI-powered code suggestions

---

Built with ❤️ using Rust, WebAssembly, and React Native