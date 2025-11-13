# 🚀 Katalyst Framework - Kitchen Sink Installation

Complete suite of tools for building modern applications with React 19, AI integration, multithreading, and cross-platform support.

## 📦 Installation

```bash
npm install @katalyst/kitchen-sink
```

## 🎯 Quick Start

### Simple SPA
```tsx
import { createKatalystApp, Button, Card } from '@katalyst/kitchen-sink';

const app = createKatalystApp();

function MyApp() {
  return (
    <app.App>
      <Card>
        <Button>Click me</Button>
      </Card>
    </app.App>
  );
}
```

### Admin Dashboard
```tsx
import { QuickStart, Admin } from '@katalyst/kitchen-sink';

const app = QuickStart.admin();

function AdminApp() {
  const { AdminDashboard } = await Admin();
  
  return (
    <app.App>
      <AdminDashboard />
    </app.App>
  );
}
```

### With Unified Hooks
```tsx
import { useKatalyst, Button, Card } from '@katalyst/kitchen-sink';

function MyComponent() {
  const k = useKatalyst();
  const [count, setCount] = k.state(0);
  const debouncedCount = k.utils.debounce(count, 300);
  
  return (
    <Card>
      <Button onClick={() => setCount(c => c + 1)}>
        Count: {debouncedCount}
      </Button>
    </Card>
  );
}
```

## 🏗️ Package Structure

### Public Packages (Available via npm)

| Package | Purpose | Main Exports |
|---------|---------|-------------|
| `@katalyst/core` | Framework foundation | KatalystApp, providers, core components |
| `@katalyst/hooks` | Unified hook interface | useKatalyst(), all React hooks |
| `@katalyst/design-system` | UI components & theming | Button, Card, Modal, design tokens |
| `@katalyst/api` | Data & integrations | tRPC, AI agents, edge functions |
| `@katalyst/ai` | AI & automation | Claude integration, thread management |
| `@katalyst/build-system` | Build tools | RSBuild, Tauri, mobile configs |

### Internal/Workspace Packages

| Package | Purpose | Status |
|---------|---------|--------|
| `@swcstudio/multithreading` | Rust-native multithreading | Private, requires compilation |
| `@katalyst/test-utils` | Testing utilities | Internal use only |
| `@katalyst/pwa` | Progressive Web App | Internal use only |
| `@katalyst/payments` | Payment processing | Internal use only |
| `@katalyst/integrations` | Third-party integrations | Internal use only |

## 📱 Platform Support

### Web Applications
```tsx
import { createKatalystApp } from '@katalyst/kitchen-sink';

const app = createKatalystApp({
  platform: 'web',
  features: ['core', 'hooks', 'design-system', 'api']
});
```

### Mobile Apps (React Native)
```tsx
import { QuickStart, Mobile } from '@katalyst/kitchen-sink';

const app = QuickStart.mobile();
const { MobileApp } = await Mobile();

function MyMobileApp() {
  return <MobileApp />;
}
```

### Desktop Apps (Tauri)
```tsx
import { QuickStart, Desktop } from '@katalyst/kitchen-sink';

const app = QuickStart.desktop();
const { DesktopApp } = await Desktop();

function MyDesktopApp() {
  return <DesktopApp />;
}
```

## 🪝 Unified Hook Interface

The `useKatalyst()` hook provides access to all functionality:

```tsx
import { useKatalyst } from '@katalyst/kitchen-sink';

function Component() {
  const k = useKatalyst();
  
  // State management
  const [value, setValue] = k.state('initial');
  
  // DOM utilities
  const { width, height } = k.dom.windowSize();
  const isMobile = k.dom.mediaQuery('(max-width: 768px)');
  
  // Utilities
  const debouncedValue = k.utils.debounce(value, 500);
  const [count, setCount] = k.utils.counter(0);
  
  // Data fetching
  const { data, loading } = k.patterns.query('/api/users');
  
  // Quick access with $
  const [search, setSearch] = k.$.state('');
  const results = k.$.fetch('/search?q=' + search);
  
  return (
    <div>
      <p>Window: {width}x{height}</p>
      <p>Mobile: {isMobile ? 'Yes' : 'No'}</p>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <p>Debounced: {debouncedValue}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount()}>Increment</button>
    </div>
  );
}
```

## 🔧 Build System Integration

### RSBuild Configuration
```tsx
import { createCoreConfig } from '@katalyst/kitchen-sink/build-system';

// rsbuild.config.js
export default createCoreConfig({
  platform: 'web',
  features: ['typescript', 'tailwind', 'react']
});
```

### Admin Dashboard
```tsx
import { createAdminConfig } from '@katalyst/kitchen-sink/build-system';

export default createAdminConfig({
  refine: true,
  authentication: true,
  api: true
});
```

### Mobile App
```tsx
import { createMobileConfig } from '@katalyst/kitchen-sink/build-system';

export default createMobileConfig({
  platform: 'react-native',
  navigation: 'tabs',
  offline: true
});
```

### Desktop App
```tsx
import { createDesktopConfig } from '@katalyst/kitchen-sink/build-system';

export default createDesktopConfig({
  tauri: true,
  nativeMenu: true,
  systemTray: true
});
```

## 🤖 AI Integration

### Claude Integration
```tsx
import { ClaudeProvider, useClaude } from '@katalyst/kitchen-sink/ai';

function App() {
  return (
    <ClaudeProvider apiKey={process.env.CLAUDE_API_KEY}>
      <ChatComponent />
    </ClaudeProvider>
  );
}

function ChatComponent() {
  const { messages, sendMessage, loading } = useClaude();
  
  return (
    <div>
      {messages.map(msg => <p key={msg.id}>{msg.content}</p>)}
      <input onKeyPress={(e) => {
        if (e.key === 'Enter') {
          sendMessage(e.target.value);
          e.target.value = '';
        }
      }} />
    </div>
  );
}
```

### Agent Orchestration
```tsx
import { AgentOrchestrator, useAgent } from '@katalyst/kitchen-sink/ai';

function App() {
  return (
    <AgentOrchestrator>
      <AgentComponent agentId="claude-analyst" />
    </AgentOrchestrator>
  );
}

function AgentComponent({ agentId }) {
  const { runAgent, result, loading } = useAgent(agentId);
  
  return (
    <div>
      <button onClick={() => runAgent('Analyze this data')}>
        Analyze
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

## 🚀 Advanced Features (Lazy Loaded)

### Multithreading
```tsx
import { Threading } from '@katalyst/kitchen-sink';

function AdvancedComponent() {
  const [threads, setThreads] = useState(null);
  
  const loadThreading = async () => {
    const { useMultithreading } = await Threading();
    setThreads(useMultithreading);
  };
  
  if (!threads) {
    return <button onClick={loadThreading}>Enable Multithreading</button>;
  }
  
  return <div>Multithreading enabled!</div>;
}
```

### WebXR
```tsx
import { WebXR } from '@katalyst/kitchen-sink/webxr';

function XRComponent() {
  const [xr, setXr] = useState(null);
  
  const loadWebXR = async () => {
    const { useWebXR } = await WebXR();
    setXr(useWebXR);
  };
  
  if (!xr) {
    return <button onClick={loadWebXR}>Enable WebXR</button>;
  }
  
  return <div>WebXR enabled!</div>;
}
```

## 🎨 Design System

### Using Design Tokens
```tsx
import { tokens, colors, spacing } from '@katalyst/kitchen-sink/design-system';

function ThemedComponent() {
  const style = {
    color: colors.primary[500],
    padding: spacing.md,
    borderRadius: tokens.borderRadius.md
  };
  
  return <div style={style}>Themed content</div>;
}
```

### Custom Components
```tsx
import { Button, Card, Modal } from '@katalyst/kitchen-sink';

function CustomUI() {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <Card>
      <Button onClick={() => setModalOpen(true)}>
        Open Modal
      </Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <p>Modal content</p>
      </Modal>
    </Card>
  );
}
```

## 📊 API Integration

### tRPC Setup
```tsx
import { createTRPC, TRPCProvider } from '@katalyst/kitchen-sink/api';

const trpc = createTRPC('http://localhost:3000/trpc');

function App() {
  return (
    <TRPCProvider client={trpc}>
      <MyComponent />
    </TRPCProvider>
  );
}

function MyComponent() {
  const { data: users } = trpc.user.list.useQuery();
  const createUser = trpc.user.create.useMutation();
  
  return (
    <div>
      {users?.map(user => <p key={user.id}>{user.name}</p>)}
      <button onClick={() => createUser.mutate({ name: 'New User' })}>
        Add User
      </button>
    </div>
  );
}
```

## 🔍 Development Tools

### Component Explorer (Dev Only)
```tsx
import { DevTools } from '@katalyst/kitchen-sink';

if (process.env.NODE_ENV === 'development') {
  DevTools().then(({ ComponentExplorer }) => {
    // Component explorer available
  });
}
```

### Performance Monitor
```tsx
import { DevTools } from '@katalyst/kitchen-sink';

function DevelopmentApp() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      DevTools().then(({ PerformanceMonitor }) => {
        // Performance monitoring enabled
      });
    }
  }, []);
  
  return <App />;
}
```

## 🏭 Kitchen Sink Configuration

### Complete Setup
```json
{
  "dependencies": {
    "@katalyst/kitchen-sink": "^1.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### Package.json Setup
```json
{
  "name": "my-katalyst-app",
  "dependencies": {
    "@katalyst/kitchen-sink": "^1.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

## 📚 Module Exports

```bash
# Everything
import { KatalystApp, useKatalyst } from '@katalyst/kitchen-sink';

# Specific modules
import { useKatalyst } from '@katalyst/kitchen-sink/hooks';
import { Button, Card } from '@katalyst/kitchen-sink/design-system';
import { createCoreConfig } from '@katalyst/kitchen-sink/build-system';
import { ClaudeProvider } from '@katalyst/kitchen-sink/ai';
import { MobileApp } from '@katalyst/kitchen-sink/mobile';
import { DesktopApp } from '@katalyst/kitchen-sink/desktop';
```

## 🚀 Platform Detection

```tsx
import { isPlatform, hasFeature } from '@katalyst/kitchen-sink';

function PlatformComponent() {
  return (
    <div>
      <p>Platform: {Object.keys(isPlatform).find(k => isPlatform[k])}</p>
      <p>WebGL: {hasFeature.webgl() ? 'Yes' : 'No'}</p>
      <p>WebXR: {hasFeature.webxr() ? 'Yes' : 'No'}</p>
      <p>Multithreading: {hasFeature.multithreading() ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our GitHub repository.

## 📞 Support

- 📖 [Documentation](https://katalyst.dev)
- 🐛 [Issue Tracker](https://github.com/katalyst-framework/katalyst/issues)
- 💬 [Discord Community](https://discord.gg/katalyst)
- 📧 [Email Support](mailto:support@katalyst.dev)
