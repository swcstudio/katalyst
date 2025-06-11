import type React from 'react';
import { SolidFeatureGrid } from '../components/SolidFeatureGrid';
import { usePulsar } from '../hooks/usePulsar';

const features = [
  {
    title: 'React 19 + SolidJS',
    description:
      'React 19 as main framework with SolidJS components via manual DOM mounting for optimal performance.',
    icon: '⚡',
  },
  {
    title: 'Rust Performance',
    description:
      "Blazing-fast backend processing with Rust's memory safety and zero-cost abstractions.",
    icon: '🦀',
  },
  {
    title: 'AdonisJS MVC',
    description:
      "Robust backend architecture with AdonisJS's elegant MVC framework and TypeScript support.",
    icon: '🏗️',
  },
  {
    title: 'Inertia.js Bridge',
    description:
      'Seamless full-stack experience without traditional API layers or complex state management.',
    icon: '🌉',
  },
  {
    title: 'Event-Driven Architecture',
    description:
      'Apache Pulsar integration for scalable pubsub messaging and real-time communication.',
    icon: '📡',
  },
  {
    title: 'Enterprise Ready',
    description:
      'Production-ready with Nomad deployment, comprehensive testing, and CI/CD integration.',
    icon: '🚀',
  },
];

export const HomePage: React.FC = () => {
  const { connected, messages, publishMessage } = usePulsar();

  const handleTestMessage = async () => {
    await publishMessage('sse/reactonrust/test', {
      type: 'user_action',
      action: 'test_button_clicked',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <section style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#f9fafb',
              marginBottom: '1.5rem',
            }}
          >
            Revolutionary Full-Stack Framework
          </h2>
          <p
            style={{
              fontSize: '1.25rem',
              color: '#d1d5db',
              marginBottom: '2rem',
              lineHeight: '1.625',
            }}
          >
            Combining React 19's latest features with SolidJS manual DOM mounting, Rust's blazing
            speed, AdonisJS's robust backend architecture, and Inertia.js's seamless full-stack
            experience.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
            >
              Get Started
            </button>
            <button
              style={{
                border: '1px solid #10b981',
                backgroundColor: 'transparent',
                color: '#10b981',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ecfdf5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              View Documentation
            </button>
            <button
              onClick={handleTestMessage}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
            >
              Test Pulsar {connected ? '✅' : '❌'}
            </button>
          </div>
          {messages.length > 0 && (
            <div style={{ marginTop: '2rem', maxWidth: '42rem', margin: '2rem auto 0' }}>
              <h4
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#f9fafb',
                }}
              >
                Recent Pulsar Messages:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {messages.slice(-3).map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#374151',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      color: '#f9fafb',
                    }}
                  >
                    <strong>{msg.topic}</strong>: {JSON.stringify(msg.payload)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: '4rem 0' }}>
        <h3
          style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#f9fafb',
            marginBottom: '3rem',
          }}
        >
          Key Features
        </h3>
        <SolidFeatureGrid features={features} />
      </section>

      <section
        style={{
          padding: '4rem 0',
          backgroundColor: '#374151',
          borderRadius: '0.5rem',
          margin: '0 1rem',
        }}
      >
        <div
          style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center', padding: '0 1rem' }}
        >
          <h3
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#f9fafb',
              marginBottom: '2rem',
            }}
          >
            Architecture Overview
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h4
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '1rem',
                }}
              >
                Frontend
              </h4>
              <ul
                style={{
                  color: '#6b7280',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  textAlign: 'left',
                }}
              >
                <li>React 19 + TypeScript</li>
                <li>SolidJS Manual DOM Mounting</li>
                <li>Inertia.js Client</li>
                <li>PandaCSS Styling</li>
                <li>Zustand State Management</li>
              </ul>
            </div>
            <div
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h4
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '1rem',
                }}
              >
                Backend
              </h4>
              <ul
                style={{
                  color: '#6b7280',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  textAlign: 'left',
                }}
              >
                <li>AdonisJS MVC Framework</li>
                <li>Rust Performance Layer</li>
                <li>Inertia.js Server</li>
                <li>Apache Pulsar Messaging</li>
              </ul>
            </div>
            <div
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h4
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '1rem',
                }}
              >
                Infrastructure
              </h4>
              <ul
                style={{
                  color: '#6b7280',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  textAlign: 'left',
                }}
              >
                <li>Nomad Orchestration</li>
                <li>Docker Containers</li>
                <li>Vault Security</li>
                <li>Consul Service Discovery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
