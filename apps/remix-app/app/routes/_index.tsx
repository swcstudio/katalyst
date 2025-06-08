import type { MetaFunction } from '@remix-run/node';
import { useAuthStoreRemix } from 'shared/adapters';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix App - SSE Framework' },
    { name: 'description', content: 'Remix micro-frontend for application UIs' },
  ];
};

export default function Index() {
  const { isAuthenticated, user } = useAuthStoreRemix();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ color: '#10b981', fontSize: '2.5rem', marginBottom: '1rem' }}>
          Remix Application UI
        </h1>

        <div
          style={{
            background: '#f3f4f6',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Authentication Status</h2>
          <p>Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
          {user && <p>User: {user.name}</p>}
        </div>

        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #10b981',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#047857' }}>Remix Features</h2>
          <ul>
            <li>Server-side rendering with React</li>
            <li>Shared Zustand state management</li>
            <li>TypeScript support</li>
            <li>Integrated with SSE framework</li>
            <li>Optimized for application UIs</li>
          </ul>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Dashboard</h3>
            <p>Application dashboard components</p>
          </div>

          <div
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Forms</h3>
            <p>Complex form handling</p>
          </div>

          <div
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Data Tables</h3>
            <p>Advanced data visualization</p>
          </div>
        </div>
      </div>
    </div>
  );
}
