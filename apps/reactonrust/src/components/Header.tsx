import React, { useRef, useEffect, useState } from 'react';
import { mountSolidHeader } from '../solid-components/SolidHeader';

export const Header: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    if (headerRef.current) {
      const { cleanup } = mountSolidHeader(headerRef.current, {
        title: 'React on Rust',
        subtitle: 'SSE Framework'
      });

      return cleanup;
    }
  }, []);

  const handleAuth = async () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      setUser(null);
    } else {
      setIsAuthenticated(true);
      setUser({ name: 'Demo User' });
    }
  };

  return (
    <header style={{ 
      backgroundColor: '#10b981', 
      color: 'white', 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '1rem' 
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div ref={headerRef}></div>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a 
              href="#features" 
              style={{ 
                color: 'white',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#a7f3d0'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Features
            </a>
            <a 
              href="#docs" 
              style={{ 
                color: 'white',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#a7f3d0'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
            >
              Documentation
            </a>
            <button
              onClick={handleAuth}
              style={{ 
                backgroundColor: 'white', 
                color: '#10b981', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              {isAuthenticated ? `Logout (${user?.name})` : 'Login'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
