import type React from 'react';
import { useAuthStore } from '~/shared/state/auth-store';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';

export const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1f2937',
        color: '#f9fafb',
      }}
    >
      <Header />
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: '#f9fafb',
              marginBottom: '1rem',
            }}
          >
            React on Rust Framework
          </h1>
          <p
            style={{
              fontSize: '1.25rem',
              color: '#d1d5db',
              marginBottom: '1.5rem',
            }}
          >
            Enterprise-grade full-stack framework with React 19, SolidJS Web Components, AdonisJS,
            and Inertia.js
          </p>
          {isAuthenticated && user && (
            <div
              style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #16a34a',
                color: '#15803d',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                marginBottom: '1.5rem',
                display: 'inline-block',
              }}
            >
              Welcome back, {user?.name || user?.email}!
            </div>
          )}
        </div>
        <HomePage />
      </main>
    </div>
  );
};
