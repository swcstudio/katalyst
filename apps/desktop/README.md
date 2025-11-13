# 🖥️ Katalyst Desktop Application

A powerful desktop application built with Tauri 2.0 and React 19, leveraging the Katalyst framework for modern desktop development.

## Features

### 🚀 Core Capabilities
- **Native Performance**: Built with Rust backend and React frontend
- **Cross-Platform**: Windows, macOS, and Linux support
- **Modern UI**: Beautiful interface using TailwindCSS and Katalyst Design System
- **File System Access**: Read/write files and directories
- **System Integration**: Native notifications, dialogs, and deep links
- **Theme Support**: Light and dark themes with system detection
- **Responsive Design**: Adapts to different screen sizes

### 🛠️ Technical Stack
- **Backend**: Tauri 2.0 with Rust
- **Frontend**: React 19 + TypeScript
- **Routing**: TanStack Router
- **State Management**: TanStack Query + Zustand
- **UI Framework**: Katalyst Design System
- **Styling**: TailwindCSS 4.0
- **Build System**: RSBuild
- **Package Management**: pnpm Workspace

## Quick Start

### Prerequisites
- Node.js 20+ 
- Rust 1.70+
- pnpm 8+

### Installation

1. **Install dependencies**:
   ```bash
   cd apps/desktop
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm dev
   ```

3. **Build for production**:
   ```bash
   pnpm build
   ```

### Development Scripts

```bash
# Development
pnpm dev              # Start Tauri development mode
pnpm dev:web          # Start web development only

# Building
pnpm build            # Build complete desktop app
pnpm build:web        # Build web assets only

# Utilities
pnpm tauri <command>  # Access Tauri CLI directly
pnpm preview          # Preview web build
pnpm clean            # Clean all build artifacts

# Code Quality
pnpm typecheck        # TypeScript type checking
pnpm lint             # ESLint with auto-fix
pnpm test             # Run tests
```

## Project Structure

```
apps/desktop/
├── src/                    # React frontend source
│   ├── components/         # Reusable UI components
│   │   ├── DesktopLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── providers/          # React context providers
│   │   └── TauriProvider.tsx
│   ├── routes/             # Route components
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   └── ...
│   ├── styles/             # Global styles
│   │   └── globals.css
│   ├── main.tsx           # App entry point
│   └── index.html         # HTML template
├── src-tauri/             # Rust backend source
│   ├── src/
│   │   ├── main.rs        # Main application entry
│   │   ├── commands.rs    # Tauri commands
│   │   ├── error.rs       # Error handling
│   │   └── utils.rs       # Utility functions
│   ├── Cargo.toml         # Rust dependencies
│   ├── build.rs           # Build script
│   └── tauri.conf.json    # Tauri configuration
├── package.json           # Frontend dependencies
├── rsbuild.config.ts      # Build configuration
├── tailwind.config.js     # TailwindCSS config
└── tsconfig.json          # TypeScript config
```

## Architecture

### Backend (Rust + Tauri)
- **Commands**: Expose Rust functions to frontend
- **Plugins**: File system, dialogs, notifications, shell
- **Security**: Sandboxed environment with permission system
- **Performance**: Native speed for system operations

### Frontend (React + TypeScript)
- **Components**: Modular, reusable UI components
- **Routing**: Client-side routing with TanStack Router
- **State**: Server state with TanStack Query, client state with Zustand
- **Styling**: Utility-first CSS with TailwindCSS

### Integration
- **IPC Communication**: Secure command invocation between frontend and backend
- **Type Safety**: Generated TypeScript types for Rust commands
- **Event System**: Real-time communication via Tauri events

## Available Commands

### File Operations
```typescript
// Read file content
const content = await readFile('/path/to/file.txt');

// Write file content
await writeFile('/path/to/file.txt', 'Hello World');

// Open file dialog
const filePath = await openFileDialog({
  title: 'Select a file',
  filters: [{ name: 'Text Files', extensions: ['txt'] }]
});

// Save file dialog
const savePath = await saveFileDialog({
  title: 'Save file',
  defaultPath: 'document.txt'
});
```

### System Operations
```typescript
// Show notification
await showNotification('Title', 'Message body');

// Open URL in browser
await openUrl('https://example.com');

// Get system information
const sysInfo = await getSystemInfo();
```

### Dialog Operations
```typescript
// Show confirmation dialog
const confirmed = await askQuestion('Are you sure?');

// Show message dialog
await showMessage('Operation completed', 'Success', 'info');
```

## Configuration

### Tauri Configuration (`src-tauri/tauri.conf.json`)
- Window settings (size, position, decorations)
- Security permissions
- Build targets
- Plugin configurations

### Build Configuration (`rsbuild.config.ts`)
- Entry points
- Asset handling
- Development server
- Module federation setup

## Security Features

### Sandboxing
- Frontend runs in secure webview
- File system access requires explicit permissions
- Network requests are controlled

### Permissions
```json
{
  "permissions": [
    "core:default",
    "shell:allow-open",
    "dialog:all",
    "fs:all",
    "notification:all",
    "window:all",
    "process:all"
  ]
}
```

## Deployment

### Development Build
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
```

Build artifacts are generated in `src-tauri/target/release/bundle/`:

- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image  
- **Linux**: `.deb`/`.rpm` packages

### Distribution
Configure distribution settings in `tauri.conf.json`:

```json
{
  "bundle": {
    "identifier": "com.katalyst.desktop",
    "category": "Productivity",
    "shortDescription": "Katalyst Desktop Application"
  }
}
```

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Test Tauri commands in both development and production builds
4. Keep security permissions minimal and explicit

## Troubleshooting

### Common Issues
- **Build fails**: Ensure Rust and Node.js versions meet requirements
- **Permissions denied**: Check that required permissions are in `tauri.conf.json`
- **Missing dependencies**: Run `pnpm install` in both root and desktop directories

### Debug Mode
Enable Tauri devtools for debugging:
```bash
pnpm dev --features devtools
```

## License

MIT License - see LICENSE file for details.
