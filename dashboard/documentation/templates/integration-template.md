# {IntegrationName} Integration

> {Brief description of what this integration provides and its purpose}

## Overview

{Detailed description of the integration's functionality, what it connects to, and how it enhances the ecosystem}

## Installation

### Package Installation

```bash
# Main package (if separate)
npm install @swcstudio/{integration-package}

# Or included in shared package
npm install @swcstudio/shared
```

### Peer Dependencies

```bash
# Required peer dependencies
npm install {peer-dependency-1} {peer-dependency-2}
```

## Setup

### Basic Configuration

```tsx
import { {IntegrationName}Provider } from '@swcstudio/shared';

function App() {
  return (
    <{IntegrationName}Provider
      config={{
        apiKey: process.env.{INTEGRATION_API_KEY},
        environment: 'production',
        options: {
          // Integration-specific options
        }
      }}
    >
      <YourApp />
    </{IntegrationName}Provider>
  );
}
```

### Environment Variables

```bash
# .env.local
{INTEGRATION_API_KEY}=your-api-key-here
{INTEGRATION_ENV}=production
{INTEGRATION_DEBUG}=false
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["@swcstudio/shared/{integration-types}"]
  }
}
```

## Framework Integration

### Next.js Setup

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { {IntegrationName}Provider } from '@swcstudio/shared';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <{IntegrationName}Provider config={/* config */}>
      <Component {...pageProps} />
    </{IntegrationName}Provider>
  );
}
```

#### Next.js Configuration

```js
// next.config.js
module.exports = {
  experimental: {
    // Integration-specific Next.js config
  },
  env: {
    {INTEGRATION_API_KEY}: process.env.{INTEGRATION_API_KEY},
  }
};
```

### Remix Setup

```tsx
// app/root.tsx
import { {IntegrationName}Provider } from '@swcstudio/shared';

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <{IntegrationName}Provider config={/* config */}>
          <Outlet />
        </{IntegrationName}Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

#### Remix Configuration

```js
// remix.config.js
module.exports = {
  // Integration-specific Remix config
  serverDependenciesToBundle: [
    '@swcstudio/shared/{integration-package}'
  ]
};
```

### Core React Setup

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { {IntegrationName}Provider } from '@swcstudio/shared';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <{IntegrationName}Provider config={/* config */}>
      <App />
    </{IntegrationName}Provider>
  </React.StrictMode>
);
```

## Usage

### Basic Usage

```tsx
import { use{IntegrationName} } from '@swcstudio/shared';

function ExampleComponent() {
  const { data, loading, error } = use{IntegrationName}();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h2>Integration Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

### Advanced Usage

```tsx
import { use{IntegrationName}, {IntegrationName}Client } from '@swcstudio/shared';

function AdvancedComponent() {
  const { client, status } = use{IntegrationName}();
  
  const handleAction = async () => {
    try {
      const result = await client.performAction({
        param1: 'value',
        param2: true
      });
      console.log('Action result:', result);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };
  
  return (
    <div>
      <p>Status: {status}</p>
      <button onClick={handleAction}>
        Perform Action
      </button>
    </div>
  );
}
```

### With Other Integrations

```tsx
import { 
  {IntegrationName}Provider,
  AnotherIntegrationProvider,
  use{IntegrationName},
  useAnotherIntegration
} from '@swcstudio/shared';

function CombinedIntegrations() {
  const integration1 = use{IntegrationName}();
  const integration2 = useAnotherIntegration();
  
  // Use both integrations together
  const handleCombinedAction = () => {
    integration1.client.action1();
    integration2.client.action2();
  };
  
  return (
    <div>
      <button onClick={handleCombinedAction}>
        Combined Action
      </button>
    </div>
  );
}

// Provider setup for multiple integrations
<{IntegrationName}Provider config={config1}>
  <AnotherIntegrationProvider config={config2}>
    <CombinedIntegrations />
  </AnotherIntegrationProvider>
</{IntegrationName}Provider>
```

## Configuration

### Configuration Schema

```typescript
interface {IntegrationName}Config {
  /** API key for authentication */
  apiKey: string;
  
  /** Environment (development, staging, production) */
  environment?: 'development' | 'staging' | 'production';
  
  /** Base URL for API calls */
  baseUrl?: string;
  
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Enable debug logging */
  debug?: boolean;
  
  /** Retry configuration */
  retry?: {
    attempts: number;
    delay: number;
  };
  
  /** Integration-specific options */
  options?: {
    feature1?: boolean;
    feature2?: string;
    customConfig?: Record<string, any>;
  };
}
```

### Advanced Configuration

```tsx
const advancedConfig: {IntegrationName}Config = {
  apiKey: process.env.{INTEGRATION_API_KEY}!,
  environment: 'production',
  baseUrl: 'https://api.{integration}.com/v1',
  timeout: 10000,
  debug: process.env.NODE_ENV === 'development',
  retry: {
    attempts: 3,
    delay: 1000
  },
  options: {
    feature1: true,
    feature2: 'custom-value',
    customConfig: {
      caching: true,
      batchSize: 50
    }
  }
};

<{IntegrationName}Provider config={advancedConfig}>
  <App />
</{IntegrationName}Provider>
```

## API Reference

### Hooks

#### `use{IntegrationName}()`

Returns the integration client and status.

```typescript
interface Use{IntegrationName}Result {
  /** Integration client instance */
  client: {IntegrationName}Client;
  
  /** Connection status */
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  
  /** Error information if status is 'error' */
  error?: Error;
  
  /** Configuration used */
  config: {IntegrationName}Config;
}
```

#### `use{IntegrationName}Data(query)`

Fetch data using the integration.

```typescript
function use{IntegrationName}Data(query: DataQuery): {
  data: DataType | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

### Client Methods

```typescript
class {IntegrationName}Client {
  /** Fetch data from the integration */
  async fetchData(params: FetchParams): Promise<DataType>;
  
  /** Send data to the integration */
  async sendData(data: SendData): Promise<SendResult>;
  
  /** Subscribe to real-time updates */
  subscribe(callback: SubscriptionCallback): Unsubscribe;
  
  /** Get current connection status */
  getStatus(): ConnectionStatus;
  
  /** Manually reconnect */
  reconnect(): Promise<void>;
}
```

## Examples

### Real-time Data

```tsx
import { use{IntegrationName} } from '@swcstudio/shared';

function RealTimeComponent() {
  const { client } = use{IntegrationName}();
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const unsubscribe = client.subscribe((newData) => {
      setData(newData);
    });
    
    return unsubscribe;
  }, [client]);
  
  return (
    <div>
      <h3>Real-time Data</h3>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}
```

### Form Integration

```tsx
import { use{IntegrationName} } from '@swcstudio/shared';
import { useForm } from 'react-hook-form';

function IntegratedForm() {
  const { client } = use{IntegrationName}();
  const { register, handleSubmit, formState } = useForm();
  
  const onSubmit = async (formData) => {
    try {
      const result = await client.sendData(formData);
      console.log('Form submitted:', result);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register('field1', { required: true })}
        placeholder="Field 1"
      />
      <input 
        {...register('field2')}
        placeholder="Field 2"
      />
      <button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Error Handling

```tsx
import { use{IntegrationName} } from '@swcstudio/shared';

function ErrorHandlingExample() {
  const { client, status, error } = use{IntegrationName}();
  
  const renderStatus = () => {
    switch (status) {
      case 'connecting':
        return <div className="status-connecting">Connecting...</div>;
      case 'connected':
        return <div className="status-connected">Connected</div>;
      case 'disconnected':
        return <div className="status-disconnected">Disconnected</div>;
      case 'error':
        return (
          <div className="status-error">
            Error: {error?.message}
            <button onClick={() => client.reconnect()}>
              Retry Connection
            </button>
          </div>
        );
    }
  };
  
  return (
    <div>
      {renderStatus()}
      {status === 'connected' && (
        <IntegrationContent client={client} />
      )}
    </div>
  );
}
```

## Build Tool Integration

### Webpack Configuration

```js
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@{integration}': path.resolve(__dirname, 'node_modules/@swcstudio/shared/{integration}')
    }
  },
  plugins: [
    new {IntegrationName}Plugin({
      // Plugin configuration
    })
  ]
};
```

### Vite Configuration

```js
// vite.config.js
import { {integration}Plugin } from '@swcstudio/shared/{integration}/vite';

export default defineConfig({
  plugins: [
    {integration}Plugin({
      // Plugin configuration
    })
  ]
});
```

### RSPack Configuration

```js
// rspack.config.js
module.exports = {
  plugins: [
    new {IntegrationName}RSPackPlugin({
      // Plugin configuration
    })
  ]
};
```

## Testing

### Unit Tests

```tsx
import { renderHook } from '@testing-library/react';
import { {IntegrationName}Provider, use{IntegrationName} } from '@swcstudio/shared';

describe('{IntegrationName} Integration', () => {
  const wrapper = ({ children }) => (
    <{IntegrationName}Provider config={testConfig}>
      {children}
    </{IntegrationName}Provider>
  );
  
  it('should connect successfully', async () => {
    const { result } = renderHook(() => use{IntegrationName}(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.status).toBe('connected');
    });
  });
  
  it('should handle errors gracefully', async () => {
    const { result } = renderHook(() => use{IntegrationName}(), { 
      wrapper: ({ children }) => (
        <{IntegrationName}Provider config={invalidConfig}>
          {children}
        </{IntegrationName}Provider>
      )
    });
    
    await waitFor(() => {
      expect(result.current.status).toBe('error');
      expect(result.current.error).toBeDefined();
    });
  });
});
```

### Integration Tests

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { {IntegrationName}Provider } from '@swcstudio/shared';

function TestApp() {
  return (
    <{IntegrationName}Provider config={testConfig}>
      <IntegrationComponent />
    </{IntegrationName}Provider>
  );
}

describe('Integration E2E', () => {
  it('should render integration data', async () => {
    render(<TestApp />);
    
    await waitFor(() => {
      expect(screen.getByText('Integration Data')).toBeInTheDocument();
    });
  });
});
```

### Mocking for Tests

```tsx
// test-utils.tsx
export const mock{IntegrationName}Client = {
  fetchData: jest.fn(),
  sendData: jest.fn(),
  subscribe: jest.fn(),
  getStatus: jest.fn(() => 'connected'),
  reconnect: jest.fn()
};

// In tests
jest.mock('@swcstudio/shared', () => ({
  ...jest.requireActual('@swcstudio/shared'),
  use{IntegrationName}: () => ({
    client: mock{IntegrationName}Client,
    status: 'connected',
    config: testConfig
  })
}));
```

## Performance

### Optimization Tips

1. **Connection Pooling**: Reuse connections when possible
2. **Caching**: Enable caching for frequently accessed data
3. **Batching**: Batch multiple requests together
4. **Error Recovery**: Implement exponential backoff for retries

```tsx
// Optimized configuration
const optimizedConfig = {
  apiKey: process.env.{INTEGRATION_API_KEY},
  options: {
    connectionPooling: true,
    caching: {
      enabled: true,
      ttl: 300000 // 5 minutes
    },
    batching: {
      enabled: true,
      maxBatchSize: 100,
      batchDelay: 50
    },
    retry: {
      attempts: 3,
      backoff: 'exponential'
    }
  }
};
```

### Monitoring

```tsx
import { use{IntegrationName} } from '@swcstudio/shared';

function PerformanceMonitor() {
  const { client } = use{IntegrationName}();
  
  useEffect(() => {
    const monitor = client.createMonitor({
      onMetrics: (metrics) => {
        console.log('Performance metrics:', metrics);
        // Send to analytics service
      }
    });
    
    return () => monitor.stop();
  }, [client]);
  
  return null; // This component only handles monitoring
}
```

## Security

### Best Practices

1. **API Key Security**: Never expose API keys in client-side code
2. **Environment Variables**: Use environment variables for sensitive data
3. **HTTPS Only**: Ensure all communications use HTTPS
4. **Input Validation**: Validate all input data
5. **Rate Limiting**: Implement rate limiting to prevent abuse

### Secure Configuration

```tsx
// ✅ Secure - API key in environment variable
const secureConfig = {
  apiKey: process.env.{INTEGRATION_API_KEY}, // Server-side only
  environment: 'production',
  security: {
    validateCertificates: true,
    enforceHttps: true,
    rateLimit: {
      requests: 100,
      window: 60000 // 1 minute
    }
  }
};

// ❌ Insecure - hardcoded API key
const insecureConfig = {
  apiKey: 'hardcoded-api-key', // Never do this!
};
```

## Troubleshooting

### Common Issues

**Issue**: Integration not connecting
```tsx
// Check configuration
const { status, error } = use{IntegrationName}();
console.log('Status:', status, 'Error:', error);

// Verify environment variables
console.log('API Key present:', !!process.env.{INTEGRATION_API_KEY});
```

**Issue**: TypeScript errors
```bash
# Install type definitions
npm install @types/{integration-name}

# Check tsconfig.json
{
  "compilerOptions": {
    "types": ["@swcstudio/shared/{integration-types}"]
  }
}
```

**Issue**: Performance problems
```tsx
// Enable debug mode
const debugConfig = {
  ...config,
  debug: true,
  options: {
    ...config.options,
    logging: 'verbose'
  }
};
```

### Debug Mode

```tsx
<{IntegrationName}Provider 
  config={{
    ...config,
    debug: true
  }}
  onDebug={(event) => {
    console.log('Debug event:', event);
  }}
>
  <App />
</{IntegrationName}Provider>
```

## Migration Guide

### From v1.x to v2.x

```tsx
// v1.x (deprecated)
import { {OldIntegrationName} } from '@swcstudio/shared';

// v2.x (current)
import { {IntegrationName}Provider, use{IntegrationName} } from '@swcstudio/shared';

// Configuration changes
// v1.x
const oldConfig = {
  key: 'api-key',
  env: 'prod'
};

// v2.x
const newConfig = {
  apiKey: 'api-key',
  environment: 'production'
};
```

### Breaking Changes

- Configuration object structure changed
- Hook names updated
- Provider component renamed
- Some deprecated methods removed

## Related Integrations

- [{RelatedIntegration1}](./{related-integration-1}.md) - Complementary integration
- [{RelatedIntegration2}](./{related-integration-2}.md) - Alternative integration
- [Core Integration](./{core-integration}.md) - Base integration

## Version History

| Version | Changes |
|---------|---------|
| 2.1.0 | Added real-time subscription support |
| 2.0.0 | Breaking: New configuration structure |
| 1.3.0 | Performance improvements |
| 1.2.0 | Added TypeScript support |
| 1.1.0 | Bug fixes and stability |
| 1.0.0 | Initial release |

## Support

### Getting Help

- [Documentation](https://docs.swcstudio.com/{integration})
- [GitHub Issues](https://github.com/swcstudio/swcstudio-marketing/issues)
- [Community Discord](https://discord.gg/swcstudio)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/swcstudio-{integration})

### Contributing

To contribute to this integration:

1. Fork the repository
2. Create a feature branch
3. Make Your changes
4. Add tests
5. Update documentation
6. Submit a pull request

## License

MIT - see [LICENSE](../../LICENSE) for details.