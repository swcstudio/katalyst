# Desktop Platform Guide

This section covers the desktop platform implementation using Tauri 2.0, providing native desktop applications with web technologies.

## Overview

The desktop platform leverages Tauri 2.0 to create high-performance, secure desktop applications using React 19, RSpack, and Rust. It provides native APIs, system integration, and cross-platform support for Windows, macOS, and Linux.

**Key Features**:
- Native performance with Rust backend
- Web technologies frontend (React 19 + RSpack)
- Cross-platform builds (Windows, macOS, Linux)
- System APIs (file system, shell, notifications)
- Auto-updates and code signing
- Small bundle sizes and security

## Architecture

```
platforms/desktop/
├── mod.ts                    # Desktop module exports
├── package.json              # Desktop-specific dependencies
└── src-tauri/               # Tauri Rust backend
    ├── Cargo.toml           # Rust dependencies and metadata
    ├── build.rs             # Build script and configuration
    ├── tauri.conf.json      # Tauri application configuration
    └── src/
        ├── main.rs          # Main application entry
        ├── commands.rs      # Tauri commands
        ├── desktop/         # Desktop-specific modules
        ├── store/           # State management
        ├── utils/           # Utility functions
        └── webxr/           # WebXR integration
```

## Configuration

### Tauri Configuration (tauri.conf.json)

The main Tauri configuration file defines application metadata, permissions, and build settings.

**Purpose**: Core Tauri application configuration
**Size**: 166 lines of comprehensive settings

#### Key Configuration Sections

**Application Metadata**:
```json
{
  "package": {
    "productName": "Katalyst Desktop",
    "version": "0.1.0"
  },
  "build": {
    "beforeDevCommand": "deno run --allow-all src/scripts/tauri-builder.ts --dev --platform desktop",
    "beforeBuildCommand": "deno run --allow-all src/scripts/tauri-builder.ts --build --platform desktop",
    "devPath": "http://localhost:20007",
    "distDir": "../dist/desktop"
  }
}
```

**Window Configuration**:
```json
{
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      },
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true,
        "exists": true
      }
    },
    "bundle": {
      "active": true,
      "category": "DeveloperTool",
      "copyright": "",
      "deb": {
        "depends": []
      },
      "externalBin": [],
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "identifier": "com.katalyst.desktop",
      "longDescription": "",
      "macOS": {
        "entitlements": null,
        "exceptionDomain": "",
        "frameworks": [],
        "providerShortName": null,
        "signingIdentity": null
      },
      "resources": [],
      "shortDescription": "",
      "targets": "all",
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": ""
      }
    },
    "security": {
      "csp": null
    },
    "updater": {
      "active": false
    },
    "windows": [
      {
        "fullscreen": false,
        "height": 600,
        "resizable": true,
        "title": "Katalyst Desktop",
        "width": 800
      }
    ]
  }
}
```

### Cargo Configuration (Cargo.toml)

Rust dependencies and workspace configuration for the desktop backend.

**Purpose**: Rust project configuration and dependencies
**Size**: 142 lines of dependencies and settings

#### Key Dependencies

```toml
[dependencies]
tauri = { version = "1.5.0", features = ["api-all"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1.0", features = ["full"] }
web-sys = "0.3"
js-sys = "0.3"
wasm-bindgen = "0.2"

# Desktop-specific features
rusqlite = { version = "0.28", features = ["bundled"], optional = true }
dirs = { version = "5.0", optional = true }
notify = { version = "6.0", optional = true }

[features]
default = ["custom-protocol"]
desktop = ["rusqlite", "dirs", "notify"]
mobile = []
webxr = ["web-sys", "js-sys"]
```

### Build Script (build.rs)

Custom build script for compiling native dependencies and embedding resources.

**Purpose**: Build-time configuration and resource embedding
**Size**: 62 lines of build logic

#### Key Features

```rust
fn main() {
    println!("cargo:rerun-if-changed=src-tauri/src");
    println!("cargo:rerun-if-changed=src-tauri/Cargo.toml");
    
    // Embed frontend assets
    if cfg!(target_os = "windows") {
        println!("cargo:rustc-link-arg=/SUBSYSTEM:WINDOWS");
    }
    
    // Build native modules
    #[cfg(feature = "desktop")]
    {
        build_desktop_modules();
    }
}

#[cfg(feature = "desktop")]
fn build_desktop_modules() {
    // Compile native dependencies
    println!("cargo:rerun-if-changed=src/native");
}
```

## Desktop API

### Tauri Commands

The desktop platform provides a comprehensive set of Tauri commands for system integration.

#### Window Management

```rust
use tauri::Manager;

#[tauri::command]
async fn minimize_window(window: tauri::Window) -> Result<(), String> {
    window.minimize().map_err(|e| e.to_string())
}

#[tauri::command]
async fn maximize_window(window: tauri::Window) -> Result<(), String> {
    window.set_maximized(true).map_err(|e| e.to_string())
}

#[tauri::command]
async fn close_window(window: tauri::Window) -> Result<(), String> {
    window.close().map_err(|e| e.to_string())
}

#[tauri::command]
async fn set_fullscreen(window: tauri::Window, fullscreen: bool) -> Result<(), String> {
    window.set_fullscreen(fullscreen).map_err(|e| e.to_string())
}
```

#### File System Operations

```rust
#[tauri::command]
async fn read_file(path: String) -> Result<String, String> {
    use std::fs;
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn write_file(path: String, contents: String) -> Result<(), String> {
    use std::fs;
    fs::write(path, contents).map_err(|e| e.to_string())
}

#[tauri::command]
async fn file_exists(path: String) -> Result<bool, String> {
    use std::path::Path;
    Ok(Path::new(&path).exists())
}
```

#### Shell Operations

```rust
#[tauri::command]
async fn open_path(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .args(["/C", "start", "", &path])
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

#[tauri::command]
async fn execute_command(command: String, args: Vec<String>) -> Result<String, String> {
    use std::process::Command;
    
    let output = Command::new(command)
        .args(args)
        .output()
        .map_err(|e| e.to_string())?;
    
    String::from_utf8(output.stdout).map_err(|e| e.to_string())
}
```

### TypeScript Interface

The desktop module provides TypeScript interfaces for type-safe communication with the Rust backend.

```typescript
// mod.ts
export interface TauriCommands {
  invoke: (cmd: string, args?: any) => Promise<any>;
  listen: (event: string, handler: (payload: any) => void) => Promise<() => void>;
  emit: (event: string, payload?: any) => Promise<void>;
}

export interface DesktopAPI {
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
    setFullscreen: (fullscreen: boolean) => Promise<void>;
  };
  fs: {
    readFile: (path: string) => Promise<string>;
    writeFile: (path: string, contents: string) => Promise<void>;
    exists: (path: string) => Promise<boolean>;
  };
  shell: {
    open: (path: string) => Promise<void>;
    execute: (command: string, args?: string[]) => Promise<string>;
  };
}
```

## Usage Examples

### Basic Desktop Application

```typescript
import { invoke } from '@tauri-apps/api/tauri';

// Window management
async function minimizeWindow() {
  await invoke('minimize_window');
}

async function setFullscreen(fullscreen: boolean) {
  await invoke('set_fullscreen', { fullscreen });
}

// File operations
async function saveFile(path: string, content: string) {
  await invoke('write_file', { path, contents: content });
}

async function loadFile(path: string): Promise<string> {
  return await invoke('read_file', { path });
}

// Shell operations
async function openExternal(path: string) {
  await invoke('open_path', { path });
}
```

### React Component Integration

```typescript
import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

export function FileManager() {
  const [files, setFiles] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('');

  const loadDirectory = async (path: string) => {
    try {
      const entries = await invoke('read_directory', { path });
      setFiles(entries);
      setCurrentPath(path);
    } catch (error) {
      console.error('Failed to load directory:', error);
    }
  };

  const saveFile = async (filename: string, content: string) => {
    try {
      const fullPath = `${currentPath}/${filename}`;
      await invoke('write_file', { path: fullPath, contents: content });
      await loadDirectory(currentPath); // Refresh
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  };

  return (
    <div className="file-manager">
      <div className="path-bar">
        <input 
          type="text" 
          value={currentPath}
          onChange={(e) => setCurrentPath(e.target.value)}
        />
        <button onClick={() => loadDirectory(currentPath)}>
          Load
        </button>
      </div>
      
      <div className="file-list">
        {files.map((file) => (
          <div key={file} className="file-item">
            {file}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### System Integration

```typescript
import { invoke } from '@tauri-apps/api/tauri';

export class DesktopIntegration {
  // Notifications
  async showNotification(title: string, body: string) {
    if ('Notification' in window) {
      new Notification(title, { body });
    }
  }

  // System tray
  async setupSystemTray() {
    await invoke('setup_system_tray');
  }

  // Auto-updater
  async checkForUpdates() {
    try {
      const update = await invoke('check_updates');
      if (update.available) {
        await this.showUpdateDialog(update);
      }
    } catch (error) {
      console.error('Failed to check updates:', error);
    }
  }

  // File associations
  async registerFileAssociation(extension: string, handler: string) {
    await invoke('register_file_association', { extension, handler });
  }

  // Deep linking
  async handleDeepLink(url: string) {
    const parsed = new URL(url);
    const action = parsed.searchParams.get('action');
    
    switch (action) {
      case 'open':
        const file = parsed.searchParams.get('file');
        if (file) await this.openFile(file);
        break;
      case 'import':
        const data = parsed.searchParams.get('data');
        if (data) await this.importData(data);
        break;
    }
  }
}
```

## Development Workflow

### Development Mode

Start the desktop application in development mode:

```bash
# Using the unified runner
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task dev:desktop

# Using the Tauri builder directly
deno run --allow-all src/packages/build-system/src/scripts/tauri-builder.ts --dev --platform desktop
```

This will:
1. Start the RSpack dev server on port 20007
2. Launch the Tauri development window
3. Enable hot reload for both frontend and backend
4. Open developer tools by default

### Building

Build the desktop application for distribution:

```bash
# Build for current platform
deno run --allow-all src/packages/build-system/src/scripts/tauri-builder.ts --build --platform desktop

# Build specific bundle types
deno run --allow-all src/packages/build-system/src/scripts/tauri-builder.ts \
  --build --platform desktop --bundle dmg        # macOS
deno run --allow-all src/packages/build-system/src/scripts/tauri-builder.ts \
  --build --platform desktop --bundle exe        # Windows
deno run --allow-all src/packages/build-system/src/scripts/tauri-builder.ts \
  --build --platform desktop --bundle deb        # Linux
```

### Testing

Test the desktop application:

```bash
# Run unit tests
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task test:unit

# Run integration tests
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task test:integration

# Run E2E tests (requires built application)
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts --task test:e2e --platforms desktop
```

## Security Considerations

### Security Model

Tauri provides a secure sandbox by default:

- **Web Content**: Runs in a secure sandbox with limited system access
- **Native APIs**: Access controlled through capability-based security model
- **File System**: Access limited to explicitly allowed directories
- **Network**: All network requests go through the browser's security model

### Capability Configuration

Configure allowed capabilities in `tauri.conf.json`:

```json
{
  "tauri": {
    "allowlist": {
      "fs": {
        "all": false,
        "readFile": true,
        "writeFile": true,
        "exists": true,
        "scope": ["$APPDATA/*", "$DOWNLOAD/*", "$DOCUMENT/*"]
      },
      "shell": {
        "all": false,
        "open": true
      },
      "notification": {
        "all": true
      }
    }
  }
}
```

### Best Practices

1. **Principle of Least Privilege**: Only enable capabilities your app needs
2. **Input Validation**: Validate all user inputs in Rust before processing
3. **Secure Storage**: Use Tauri's secure storage for sensitive data
4. **Code Signing**: Sign your applications for distribution
5. **Regular Updates**: Keep Tauri and dependencies updated

## Performance Optimization

### Bundle Size Optimization

Minimize application size:

```toml
# Cargo.toml
[dependencies]
# Use feature flags to reduce binary size
tauri = { version = "1.5.0", features = ["api-all"] }
# Remove unused features
# tauri = { version = "1.5.0", features = ["window-all", "shell-open"] }
```

### Memory Management

Optimize memory usage:

```rust
// Use efficient data structures
use std::collections::HashMap;

// Avoid unnecessary cloning
#[tauri::command]
async fn process_data(data: String) -> Result<String, String> {
    // Process data without cloning when possible
    Ok(data.to_uppercase())
}
```

### Startup Performance

Improve application startup time:

```rust
// main.rs
fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // Initialize heavy operations asynchronously
            tokio::spawn(async {
                // Background initialization
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Platform-Specific Features

### Windows

```rust
#[cfg(target_os = "windows")]
use tauri::api::notification::Notification;

#[cfg(target_os = "windows")]
#[tauri::command]
async fn show_windows_notification(title: String, body: String) -> Result<(), String> {
    Notification::new("com.katalyst.desktop")
        .title(&title)
        .body(&body)
        .show()
        .map_err(|e| e.to_string())
}
```

### macOS

```rust
#[cfg(target_os = "macos")]
#[tauri::command]
async fn get_macos_version() -> Result<String, String> {
    use std::process::Command;
    
    let output = Command::new("sw_vers")
        .arg("-productVersion")
        .output()
        .map_err(|e| e.to_string())?;
    
    String::from_utf8(output.stdout).map_err(|e| e.to_string())
}
```

### Linux

```rust
#[cfg(target_os = "linux")]
#[tauri::command]
async fn get_linux_distro() -> Result<String, String> {
    use std::fs;
    
    let content = fs::read_to_string("/etc/os-release")
        .map_err(|e| e.to_string())?;
    
    // Parse OS release information
    for line in content.lines() {
        if line.starts_with("PRETTY_NAME=") {
            return Ok(line.split('=').nth(1).unwrap_or("Unknown").trim_matches('"').to_string());
        }
    }
    
    Ok("Unknown Linux".to_string())
}
```

## Troubleshooting

### Common Issues

**Build fails with "Tauri prerequisites not found"**
```bash
# Install Tauri prerequisites
# Follow https://tauri.app/v1/guides/getting-started/prerequisites

# On macOS
xcode-select --install

# On Ubuntu/Debian
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
  build-essential \
  curl \
  wget \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

**Application window doesn't appear**
```bash
# Check dev server is running
curl http://localhost:20007

# Check Tauri configuration
cat src-tauri/tauri.conf.json | jq '.build.devPath'
```

**Rust compilation errors**
```bash
# Update Rust toolchain
rustup update

# Clean and rebuild
cargo clean
cargo build
```

### Debug Mode

Enable debug logging:

```rust
// main.rs
fn main() {
    env_logger::init(); // Add to Cargo.toml: env_logger = "0.10"
    
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Development Tools

Useful development tools for desktop development:

```bash
# Tauri CLI for additional commands
cargo install tauri-cli

# Check application info
cargo tauri info

# Build with verbose output
cargo tauri build --verbose

# Developer tools
cargo tauri dev --debug
```

This desktop platform provides a powerful, secure foundation for building cross-platform desktop applications with web technologies while maintaining native performance and integration.
