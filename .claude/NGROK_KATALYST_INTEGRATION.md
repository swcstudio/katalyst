# Ngrok + Katalyst: Revolutionary Development & Production Tunneling

## Overview

Ngrok integration with Katalyst creates a powerful development and production infrastructure that seamlessly bridges local development, module federation, and cloud deployment. This integration leverages ngrok's 2025 Cloud Endpoints and Traffic Policy system to create an unprecedented development experience.

## What Makes This Integration Revolutionary

### 1. **Instant Global Deployment**
- Transform localhost into production-ready endpoints instantly
- Share federated modules across teams in real-time
- Test mobile apps against live development APIs
- Enable seamless collaboration across distributed teams

### 2. **Module Federation on Steroids**
- Expose Re.Pack federated modules via secure tunnels
- Share TanStack components between development environments
- Enable cross-team component testing without deployment
- Real-time module sharing with automatic HTTPS

### 3. **Advanced Traffic Management**
- Route traffic based on headers, paths, and subdomains
- A/B testing with traffic policy rules
- Feature flags through intelligent routing
- Load balancing across development instances

## Ngrok + Katalyst Architecture

### Core Infrastructure
```
┌─────────────────────────────────────────────────────────┐
│                Ngrok Cloud Endpoints                    │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │
│ │   Dev Env   │ │ Staging Env │ │  Prod Env   │        │
│ │  (Tunnel)   │ │  (Tunnel)   │ │ (Cloud EP)  │        │
│ └─────────────┘ └─────────────┘ └─────────────┘        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │          Traffic Policy Engine                      │ │
│ │ • OAuth/SAML • IP Restrictions • Rate Limiting     │ │
│ │ • A/B Testing • Feature Flags • Load Balancing     │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │          Katalyst Integration Layer                 │ │
│ │ • TanStack Federation • Re.Pack Modules            │ │
│ │ • StyleX Themes • RSpeedy Mobile                   │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Development Workflow Enhancement
```
┌─────────────────────────────────────────────────────────┐
│              Developer Experience Flow                  │
├─────────────────────────────────────────────────────────┤
│ 1. npm run dev:katalyst                                │
│    ├─── Starts all services (Web, Mobile, Shared)      │
│    ├─── Auto-creates ngrok tunnels                     │
│    └─── Updates federation config with tunnel URLs     │
│                                                         │
│ 2. Auto-Generated Secure URLs                          │
│    ├─── https://web-abc123.ngrok.app                   │
│    ├─── https://mobile-def456.ngrok.app                │
│    ├─── https://shared-ghi789.ngrok.app                │
│    └─── https://api-jkl012.ngrok.app                   │
│                                                         │
│ 3. Team Collaboration                                   │
│    ├─── Share URLs instantly via Slack/Teams           │
│    ├─── QR codes for mobile testing                    │
│    ├─── Real-time module federation                    │
│    └─── Cross-team component testing                   │
└─────────────────────────────────────────────────────────┘
```

## Implementation

### 1. Core Ngrok Integration

#### NgrokProvider (`shared/src/infrastructure/ngrok/NgrokProvider.tsx`)
```typescript
/**
 * Ngrok Integration Provider for Katalyst
 * 
 * Provides secure tunneling, traffic management, and development workflow automation
 * Integrates with Katalyst's federated architecture for seamless development experience
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { NgrokApi } from './ngrok-api';
import { TrafficPolicy } from './traffic-policy';
import { FederationManager } from './federation-manager';

export interface NgrokConfig {
  // Authentication
  authToken: string;
  region?: 'us' | 'eu' | 'ap' | 'au' | 'sa' | 'jp' | 'in';
  
  // Development settings
  autoStart?: boolean;
  autoShare?: boolean;
  teamNotifications?: boolean;
  
  // Traffic policies
  defaultPolicy?: TrafficPolicyConfig;
  environmentPolicies?: Record<string, TrafficPolicyConfig>;
  
  // Federation integration
  federationConfig?: {
    autoUpdateRemotes?: boolean;
    shareModules?: boolean;
    enableCORS?: boolean;
  };
  
  // Mobile integration
  mobileConfig?: {
    generateQRCodes?: boolean;
    enableDeepLinks?: boolean;
    iosUniversalLinks?: boolean;
    androidAppLinks?: boolean;
  };
}

export interface NgrokContextValue {
  // Tunnel management
  createTunnel: (port: number, options?: TunnelOptions) => Promise<NgrokTunnel>;
  destroyTunnel: (tunnelId: string) => Promise<void>;
  getTunnels: () => NgrokTunnel[];
  getTunnelByPort: (port: number) => NgrokTunnel | undefined;
  
  // Cloud endpoints
  createCloudEndpoint: (config: CloudEndpointConfig) => Promise<CloudEndpoint>;
  updateCloudEndpoint: (id: string, config: Partial<CloudEndpointConfig>) => Promise<CloudEndpoint>;
  deleteCloudEndpoint: (id: string) => Promise<void>;
  
  // Traffic policies
  applyTrafficPolicy: (tunnelId: string, policy: TrafficPolicy) => Promise<void>;
  createABTest: (config: ABTestConfig) => Promise<ABTest>;
  enableFeatureFlag: (flag: string, condition: FeatureFlagCondition) => Promise<void>;
  
  // Federation integration
  updateFederationUrls: () => Promise<void>;
  shareModule: (moduleName: string, port: number) => Promise<string>;
  
  // Analytics and monitoring
  getTunnelMetrics: (tunnelId: string) => Promise<TunnelMetrics>;
  getTrafficAnalytics: (timeframe: string) => Promise<TrafficAnalytics>;
  
  // Development utilities
  generateQRCode: (url: string) => Promise<string>;
  notifyTeam: (message: string, channels?: string[]) => Promise<void>;
  copyToClipboard: (url: string) => Promise<void>;
}

const NgrokContext = createContext<NgrokContextValue | null>(null);

export function NgrokProvider({ children, config }: {
  children: React.ReactNode;
  config: NgrokConfig;
}) {
  const [api, setApi] = useState<NgrokApi | null>(null);
  const [tunnels, setTunnels] = useState<NgrokTunnel[]>([]);
  const [cloudEndpoints, setCloudEndpoints] = useState<CloudEndpoint[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeNgrok = async () => {
      try {
        const ngrokApi = new NgrokApi(config.authToken, config.region);
        await ngrokApi.initialize();
        
        setApi(ngrokApi);
        setIsInitialized(true);
        
        if (config.autoStart) {
          await autoStartTunnels();
        }
      } catch (error) {
        console.error('Failed to initialize ngrok:', error);
      }
    };

    initializeNgrok();
  }, [config]);

  const autoStartTunnels = async () => {
    // Auto-detect common Katalyst ports and create tunnels
    const katalystPorts = [
      { port: 3000, name: 'web', description: 'Web application' },
      { port: 3001, name: 'shared', description: 'Shared components' },
      { port: 3002, name: 'mobile', description: 'Mobile application' },
      { port: 4000, name: 'api', description: 'API server' },
      { port: 5000, name: 'storybook', description: 'Component library' },
    ];

    for (const service of katalystPorts) {
      try {
        const tunnel = await createTunnel(service.port, {
          name: service.name,
          description: service.description,
          subdomain: `katalyst-${service.name}`,
        });
        
        console.log(`🚀 ${service.description} available at: ${tunnel.publicUrl}`);
      } catch (error) {
        console.warn(`Could not create tunnel for port ${service.port}:`, error);
      }
    }
  };

  const createTunnel = async (port: number, options: TunnelOptions = {}): Promise<NgrokTunnel> => {
    if (!api) throw new Error('Ngrok not initialized');

    const tunnel = await api.createTunnel({
      port,
      proto: options.proto || 'http',
      subdomain: options.subdomain,
      hostname: options.hostname,
      name: options.name,
      auth: options.auth,
      host_header: options.hostHeader || 'rewrite',
      bind_tls: options.bindTls !== false,
      metadata: JSON.stringify({
        katalyst: true,
        service: options.name || `port-${port}`,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        ...options.metadata,
      }),
    });

    // Apply default traffic policy if configured
    if (config.defaultPolicy) {
      await applyTrafficPolicy(tunnel.id, new TrafficPolicy(config.defaultPolicy));
    }

    // Update federation configuration if enabled
    if (config.federationConfig?.autoUpdateRemotes) {
      await updateFederationUrls();
    }

    // Generate QR code for mobile testing
    if (config.mobileConfig?.generateQRCodes && options.name === 'mobile') {
      const qrCode = await generateQRCode(tunnel.publicUrl);
      console.log(`📱 Mobile QR Code: ${qrCode}`);
    }

    // Notify team if enabled
    if (config.autoShare && config.teamNotifications) {
      await notifyTeam(`🚀 New tunnel created: ${tunnel.publicUrl} (${options.description || options.name})`);
    }

    setTunnels(prev => [...prev, tunnel]);
    return tunnel;
  };

  const createCloudEndpoint = async (config: CloudEndpointConfig): Promise<CloudEndpoint> => {
    if (!api) throw new Error('Ngrok not initialized');

    const endpoint = await api.createCloudEndpoint({
      url: config.url,
      description: config.description,
      metadata: {
        katalyst: true,
        type: 'cloud-endpoint',
        ...config.metadata,
      },
      traffic_policy: config.trafficPolicy,
      forwards_to: config.forwardsTo,
    });

    setCloudEndpoints(prev => [...prev, endpoint]);
    return endpoint;
  };

  const applyTrafficPolicy = async (tunnelId: string, policy: TrafficPolicy): Promise<void> => {
    if (!api) throw new Error('Ngrok not initialized');
    
    await api.updateTunnelPolicy(tunnelId, policy.compile());
  };

  const createABTest = async (config: ABTestConfig): Promise<ABTest> => {
    const policy = new TrafficPolicy()
      .addRule({
        name: `ab-test-${config.name}`,
        match: config.match || [],
        actions: [
          {
            type: 'weighted-backends',
            config: config.variants.map(variant => ({
              url: variant.url,
              weight: variant.weight,
              metadata: { variant: variant.name },
            })),
          },
        ],
      });

    await applyTrafficPolicy(config.tunnelId, policy);

    return {
      id: `ab-${config.name}`,
      name: config.name,
      variants: config.variants,
      metrics: await getTunnelMetrics(config.tunnelId),
    };
  };

  const shareModule = async (moduleName: string, port: number): Promise<string> => {
    const tunnel = await createTunnel(port, {
      name: `module-${moduleName}`,
      description: `Federated module: ${moduleName}`,
      subdomain: `katalyst-${moduleName}`,
    });

    // Update federation remotes
    const federationManager = new FederationManager();
    await federationManager.addRemote(moduleName, tunnel.publicUrl);

    return tunnel.publicUrl;
  };

  const updateFederationUrls = async (): Promise<void> => {
    const federationManager = new FederationManager();
    const activeTunnels = tunnels.filter(t => t.config.metadata?.katalyst);
    
    for (const tunnel of activeTunnels) {
      const serviceName = tunnel.config.metadata?.service;
      if (serviceName) {
        await federationManager.updateRemote(serviceName, tunnel.publicUrl);
      }
    }
  };

  const generateQRCode = async (url: string): Promise<string> => {
    // Generate QR code for mobile testing
    const qrApi = 'https://api.qrserver.com/v1/create-qr-code/';
    return `${qrApi}?size=200x200&data=${encodeURIComponent(url)}`;
  };

  const notifyTeam = async (message: string, channels: string[] = []): Promise<void> => {
    // Integration with team communication tools
    console.log(`📢 Team notification: ${message}`);
    
    // Could integrate with:
    // - Slack webhooks
    // - Microsoft Teams
    // - Discord
    // - Custom notification systems
  };

  const contextValue: NgrokContextValue = {
    createTunnel,
    destroyTunnel: async (tunnelId: string) => {
      if (!api) throw new Error('Ngrok not initialized');
      await api.destroyTunnel(tunnelId);
      setTunnels(prev => prev.filter(t => t.id !== tunnelId));
    },
    getTunnels: () => tunnels,
    getTunnelByPort: (port: number) => tunnels.find(t => t.config.addr === port),
    createCloudEndpoint,
    updateCloudEndpoint: async (id: string, config: Partial<CloudEndpointConfig>) => {
      if (!api) throw new Error('Ngrok not initialized');
      const updated = await api.updateCloudEndpoint(id, config);
      setCloudEndpoints(prev => prev.map(ep => ep.id === id ? updated : ep));
      return updated;
    },
    deleteCloudEndpoint: async (id: string) => {
      if (!api) throw new Error('Ngrok not initialized');
      await api.deleteCloudEndpoint(id);
      setCloudEndpoints(prev => prev.filter(ep => ep.id !== id));
    },
    applyTrafficPolicy,
    createABTest,
    enableFeatureFlag: async (flag: string, condition: FeatureFlagCondition) => {
      const policy = new TrafficPolicy()
        .addRule({
          name: `feature-flag-${flag}`,
          match: [condition.match],
          actions: [
            {
              type: 'forward',
              config: { url: condition.enabledUrl },
            },
          ],
        })
        .addRule({
          name: `feature-flag-${flag}-default`,
          match: [],
          actions: [
            {
              type: 'forward',
              config: { url: condition.disabledUrl },
            },
          ],
        });

      await applyTrafficPolicy(condition.tunnelId, policy);
    },
    updateFederationUrls,
    shareModule,
    getTunnelMetrics: async (tunnelId: string) => {
      if (!api) throw new Error('Ngrok not initialized');
      return await api.getTunnelMetrics(tunnelId);
    },
    getTrafficAnalytics: async (timeframe: string) => {
      if (!api) throw new Error('Ngrok not initialized');
      return await api.getTrafficAnalytics(timeframe);
    },
    generateQRCode,
    notifyTeam,
    copyToClipboard: async (url: string) => {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        console.log(`📋 Copied to clipboard: ${url}`);
      }
    },
  };

  if (!isInitialized) {
    return <div>Initializing ngrok...</div>;
  }

  return (
    <NgrokContext.Provider value={contextValue}>
      {children}
    </NgrokContext.Provider>
  );
}

export function useNgrok(): NgrokContextValue {
  const context = useContext(NgrokContext);
  if (!context) {
    throw new Error('useNgrok must be used within a NgrokProvider');
  }
  return context;
}

// Type definitions
export interface TunnelOptions {
  proto?: 'http' | 'https' | 'tcp' | 'tls';
  subdomain?: string;
  hostname?: string;
  name?: string;
  description?: string;
  auth?: string;
  hostHeader?: string;
  bindTls?: boolean;
  metadata?: Record<string, any>;
}

export interface NgrokTunnel {
  id: string;
  publicUrl: string;
  config: {
    addr: number;
    proto: string;
    name?: string;
    metadata?: Record<string, any>;
  };
  metrics: {
    conns: {
      count: number;
      gauge: number;
      rate1: number;
      rate5: number;
      rate15: number;
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
    http: {
      count: number;
      rate1: number;
      rate5: number;
      rate15: number;
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
  };
}

export interface CloudEndpointConfig {
  url: string;
  description?: string;
  metadata?: Record<string, any>;
  trafficPolicy?: any;
  forwardsTo?: string;
}

export interface CloudEndpoint {
  id: string;
  url: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  trafficPolicy?: any;
  forwardsTo?: string;
}

export interface ABTestConfig {
  name: string;
  tunnelId: string;
  match?: any[];
  variants: Array<{
    name: string;
    url: string;
    weight: number;
  }>;
}

export interface ABTest {
  id: string;
  name: string;
  variants: ABTestConfig['variants'];
  metrics: TunnelMetrics;
}

export interface FeatureFlagCondition {
  tunnelId: string;
  match: any;
  enabledUrl: string;
  disabledUrl: string;
}

export interface TunnelMetrics {
  requests: number;
  responses: number;
  bandwidth: number;
  latency: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

export interface TrafficAnalytics {
  timeframe: string;
  totalRequests: number;
  uniqueVisitors: number;
  topPaths: Array<{ path: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  topUserAgents: Array<{ userAgent: string; count: number }>;
}

export interface TrafficPolicyConfig {
  name: string;
  rules: Array<{
    name: string;
    match: any[];
    actions: any[];
  }>;
}
```

### 2. Development Workflow Automation

#### NgrokDevTools (`shared/src/infrastructure/ngrok/NgrokDevTools.tsx`)
```typescript
/**
 * Ngrok Development Tools for Katalyst
 * 
 * Provides development utilities, tunnel management, and team collaboration features
 */

import React, { useState, useEffect } from 'react';
import { useNgrok } from './NgrokProvider';
import { useTanstackQuery } from '../tanstack/hooks';

interface NgrokDevToolsProps {
  showQRCodes?: boolean;
  enableTeamSharing?: boolean;
  autoRefresh?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function NgrokDevTools({
  showQRCodes = true,
  enableTeamSharing = true,
  autoRefresh = true,
  position = 'bottom-right',
}: NgrokDevToolsProps) {
  const {
    getTunnels,
    createTunnel,
    destroyTunnel,
    generateQRCode,
    notifyTeam,
    copyToClipboard,
    getTunnelMetrics,
  } = useNgrok();

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTunnel, setSelectedTunnel] = useState<string | null>(null);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});

  const tunnels = getTunnels();

  // Auto-refresh metrics
  const { data: metrics } = useTanstackQuery({
    queryKey: ['ngrok-metrics', selectedTunnel],
    queryFn: () => selectedTunnel ? getTunnelMetrics(selectedTunnel) : null,
    enabled: !!selectedTunnel && autoRefresh,
    refetchInterval: 5000,
  });

  useEffect(() => {
    // Generate QR codes for mobile tunnels
    if (showQRCodes) {
      tunnels.forEach(async (tunnel) => {
        if (tunnel.config.name?.includes('mobile') && !qrCodes[tunnel.id]) {
          const qrCode = await generateQRCode(tunnel.publicUrl);
          setQrCodes(prev => ({ ...prev, [tunnel.id]: qrCode }));
        }
      });
    }
  }, [tunnels, showQRCodes]);

  const handleShareTunnel = async (tunnel: any) => {
    await copyToClipboard(tunnel.publicUrl);
    
    if (enableTeamSharing) {
      await notifyTeam(
        `🔗 ${tunnel.config.name || 'Tunnel'} shared: ${tunnel.publicUrl}`
      );
    }
  };

  const positionStyles = {
    'top-left': { top: 20, left: 20 },
    'top-right': { top: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
    'bottom-right': { bottom: 20, right: 20 },
  };

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 10000,
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        minWidth: isExpanded ? '400px' : '120px',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: tunnels.length > 0 ? '#22c55e' : '#ef4444',
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>
            ngrok ({tunnels.length})
          </span>
        </div>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>
          {isExpanded ? '−' : '+'}
        </span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ padding: '16px' }}>
          {/* Tunnel List */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Active Tunnels
            </h4>
            
            {tunnels.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                No active tunnels
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tunnels.map((tunnel) => (
                  <div
                    key={tunnel.id}
                    style={{
                      padding: '8px',
                      backgroundColor: selectedTunnel === tunnel.id ? '#f3f4f6' : 'transparent',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedTunnel(tunnel.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '500' }}>
                          {tunnel.config.name || `Port ${tunnel.config.addr}`}
                        </div>
                        <div style={{ fontSize: '10px', color: '#6b7280' }}>
                          {tunnel.publicUrl}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {/* Copy Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareTunnel(tunnel);
                          }}
                          style={{
                            padding: '4px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '10px',
                          }}
                          title="Copy & Share"
                        >
                          📋
                        </button>
                        
                        {/* QR Code Button */}
                        {showQRCodes && qrCodes[tunnel.id] && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(qrCodes[tunnel.id], '_blank');
                            }}
                            style={{
                              padding: '4px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '10px',
                            }}
                            title="QR Code"
                          >
                            📱
                          </button>
                        )}
                        
                        {/* Destroy Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            destroyTunnel(tunnel.id);
                          }}
                          style={{
                            padding: '4px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '10px',
                            color: '#ef4444',
                          }}
                          title="Destroy Tunnel"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tunnel Metrics */}
          {selectedTunnel && metrics && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Metrics
              </h4>
              <div
                style={{
                  padding: '8px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '4px',
                  fontSize: '11px',
                }}
              >
                <div>Requests: {metrics.requests}</div>
                <div>Bandwidth: {formatBytes(metrics.bandwidth)}</div>
                <div>Latency P99: {metrics.latency.p99}ms</div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Quick Actions
            </h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => createTunnel(3000, { name: 'web' })}
                style={{
                  padding: '4px 8px',
                  fontSize: '10px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                + Web (3000)
              </button>
              <button
                onClick={() => createTunnel(3001, { name: 'shared' })}
                style={{
                  padding: '4px 8px',
                  fontSize: '10px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                + Shared (3001)
              </button>
              <button
                onClick={() => createTunnel(3002, { name: 'mobile' })}
                style={{
                  padding: '4px 8px',
                  fontSize: '10px',
                  backgroundColor: '#06b6d4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                + Mobile (3002)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
```

### 3. TanStack Integration with Ngrok

#### NgrokTanStackProvider (`shared/src/components/tanstack/NgrokTanStackProvider.tsx`)
```typescript
/**
 * TanStack + Ngrok Integration
 * 
 * Seamlessly integrates TanStack components with ngrok tunneling
 * Provides automatic URL updates and federated component sharing
 */

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, RouterProvider } from '@tanstack/react-router';
import { useNgrok } from '../infrastructure/ngrok/NgrokProvider';
import { createTanStackIntegration } from './integration-factory';

interface NgrokTanStackProviderProps {
  children: React.ReactNode;
  autoUpdateUrls?: boolean;
  enableFederation?: boolean;
  queryClient?: QueryClient;
}

export function NgrokTanStackProvider({
  children,
  autoUpdateUrls = true,
  enableFederation = true,
  queryClient: providedQueryClient,
}: NgrokTanStackProviderProps) {
  const { getTunnels, updateFederationUrls } = useNgrok();
  
  // Create or use provided query client
  const queryClient = providedQueryClient || new QueryClient({
    defaultOptions: {
      queries: {
        // Update base URLs when tunnels change
        queryFn: async ({ queryKey, meta }) => {
          const tunnels = getTunnels();
          const apiTunnel = tunnels.find(t => t.config.name === 'api');
          
          if (apiTunnel && meta?.endpoint) {
            const updatedEndpoint = `${apiTunnel.publicUrl}${meta.endpoint}`;
            // Fetch with updated URL
            const response = await fetch(updatedEndpoint);
            return response.json();
          }
          
          // Fallback to original query function
          return meta?.originalQueryFn?.(queryKey);
        },
      },
    },
  });

  // Auto-update federation URLs when tunnels change
  useEffect(() => {
    if (autoUpdateUrls && enableFederation) {
      const interval = setInterval(() => {
        updateFederationUrls();
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [autoUpdateUrls, enableFederation, updateFederationUrls]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Enhanced TanStack hooks with ngrok integration
export function useTanStackQueryWithNgrok<T>(
  queryKey: any[],
  endpoint: string,
  options?: any
) {
  const { getTunnels } = useNgrok();
  
  return useTanstackQuery<T>({
    queryKey,
    queryFn: async () => {
      const tunnels = getTunnels();
      const apiTunnel = tunnels.find(t => t.config.name === 'api');
      const baseUrl = apiTunnel?.publicUrl || 'http://localhost:4000';
      
      const response = await fetch(`${baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    ...options,
  });
}

export function useTanStackMutationWithNgrok<T, V>(
  endpoint: string,
  options?: any
) {
  const { getTunnels } = useNgrok();
  
  return useTanstackMutation<T, Error, V>({
    mutationFn: async (variables: V) => {
      const tunnels = getTunnels();
      const apiTunnel = tunnels.find(t => t.config.name === 'api');
      const baseUrl = apiTunnel?.publicUrl || 'http://localhost:4000';
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variables),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    ...options,
  });
}
```

## Advanced Use Cases

### 1. **Cross-Team Component Development**
```typescript
// Team A shares a component via ngrok
const { shareModule } = useNgrok();
await shareModule('user-profile', 3001);
// Returns: https://katalyst-user-profile.ngrok.app

// Team B consumes the shared component
const UserProfile = lazy(() => 
  import('https://katalyst-user-profile.ngrok.app/remoteEntry.js')
    .then(module => ({ default: module.UserProfile }))
);
```

### 2. **Mobile App Testing**
```typescript
// Automatically generate QR codes for mobile testing
const { generateQRCode, createTunnel } = useNgrok();

const mobileTunnel = await createTunnel(3002, {
  name: 'mobile-app',
  description: 'React Native app for testing'
});

const qrCode = await generateQRCode(mobileTunnel.publicUrl);
console.log(`📱 Test on device: ${qrCode}`);
```

### 3. **A/B Testing with Traffic Policies**
```typescript
// Split traffic between two versions
const { createABTest } = useNgrok();

await createABTest({
  name: 'new-checkout-flow',
  tunnelId: 'tunnel-123',
  variants: [
    { name: 'control', url: 'http://localhost:3000', weight: 0.5 },
    { name: 'variant', url: 'http://localhost:3001', weight: 0.5 }
  ]
});
```

### 4. **Feature Flags via Traffic Routing**
```typescript
// Route traffic based on feature flags
const { enableFeatureFlag } = useNgrok();

await enableFeatureFlag('new-dashboard', {
  tunnelId: 'tunnel-123',
  match: { headers: { 'x-feature-flag': 'new-dashboard' } },
  enabledUrl: 'http://localhost:3001',
  disabledUrl: 'http://localhost:3000'
});
```

## Development Workflow Commands

### Package.json Scripts
```json
{
  "scripts": {
    "dev:katalyst": "npm-run-all --parallel dev:web dev:shared dev:mobile dev:api --print-label",
    "dev:web": "vite dev --port 3000",
    "dev:shared": "webpack serve --port 3001",
    "dev:mobile": "expo start --port 3002",
    "dev:api": "fastify start --port 4000",
    "ngrok:start": "ngrok-katalyst start",
    "ngrok:share": "ngrok-katalyst share --team",
    "ngrok:status": "ngrok-katalyst status"
  }
}
```

### CLI Tool (`bin/ngrok-katalyst`)
```bash
#!/usr/bin/env node

const { NgrokKatalystCLI } = require('../shared/src/infrastructure/ngrok/cli');

const cli = new NgrokKatalystCLI();
cli.run(process.argv);
```

## Configuration Examples

### Development Configuration
```typescript
// ngrok.config.ts
export const ngrokConfig: NgrokConfig = {
  authToken: process.env.NGROK_AUTH_TOKEN!,
  region: 'us',
  autoStart: true,
  autoShare: true,
  teamNotifications: true,
  
  defaultPolicy: {
    name: 'katalyst-dev',
    rules: [
      {
        name: 'cors',
        match: [],
        actions: [
          {
            type: 'add-headers',
            config: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': '*',
              'Access-Control-Allow-Headers': '*',
            },
          },
        ],
      },
    ],
  },
  
  federationConfig: {
    autoUpdateRemotes: true,
    shareModules: true,
    enableCORS: true,
  },
  
  mobileConfig: {
    generateQRCodes: true,
    enableDeepLinks: true,
    iosUniversalLinks: true,
    androidAppLinks: true,
  },
};
```

### Production Configuration
```typescript
// ngrok.prod.config.ts
export const ngrokProdConfig: NgrokConfig = {
  authToken: process.env.NGROK_AUTH_TOKEN!,
  region: 'us',
  autoStart: false,
  autoShare: false,
  teamNotifications: false,
  
  defaultPolicy: {
    name: 'katalyst-prod',
    rules: [
      {
        name: 'auth',
        match: [],
        actions: [
          {
            type: 'oauth',
            config: {
              provider: 'google',
              allowed_domains: ['swcstudio.com'],
            },
          },
        ],
      },
      {
        name: 'rate-limit',
        match: [],
        actions: [
          {
            type: 'rate-limit',
            config: {
              name: 'api-limit',
              algorithm: 'sliding_window',
              capacity: 1000,
              rate: '100r/m',
            },
          },
        ],
      },
    ],
  },
};
```

## Benefits for Katalyst

### 1. **Revolutionary Development Experience**
- Instant secure URLs for all services
- Real-time team collaboration
- Mobile testing with QR codes
- Automatic federation updates

### 2. **Production-Ready Infrastructure**
- Traffic management and load balancing
- A/B testing and feature flags
- OAuth/SAML authentication
- Rate limiting and DDoS protection

### 3. **Cross-Platform Integration**
- Seamless mobile app testing
- Federated module sharing
- TanStack query integration
- StyleX theme distribution

### 4. **Advanced Analytics**
- Real-time traffic metrics
- Performance monitoring
- Geographic analytics
- User behavior tracking

## Conclusion

The ngrok + Katalyst integration creates an unprecedented development and production infrastructure that transforms how modern applications are built, tested, and deployed. With secure tunneling, advanced traffic management, and seamless integration with your existing TanStack, Re.Pack, StyleX, and RSpeedy stack, this solution provides:

- **Zero-config secure URLs** for all development services
- **Real-time team collaboration** with instant sharing
- **Production-grade traffic management** with policies and analytics
- **Cross-platform testing** with mobile QR codes and deep links
- **Federated architecture support** with dynamic module loading

This integration makes Katalyst not just a design system, but a complete development platform that rivals any enterprise solution in the market. 🚀