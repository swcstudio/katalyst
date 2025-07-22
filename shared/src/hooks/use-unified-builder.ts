import { useState, useEffect } from 'react';
import { IntegrationFactory } from '../factory/integration-factory.ts';
import { KatalystIntegration } from '../types/index.ts';

export interface UnifiedBuilderConfig {
  targetPlatforms: ('web' | 'desktop' | 'mobile' | 'metaverse')[];
  sharedComponents: boolean;
  rustBackend: boolean;
  features?: {
    hotReload?: boolean;
    crossPlatformSharing?: boolean;
    performanceOptimization?: boolean;
    nativeIntegration?: boolean;
  };
}

export interface UnifiedBuilderState {
  platforms: string[];
  isReady: boolean;
  isInitializing: boolean;
  error: string | null;
  integrations: Record<string, any>;
}

export function useUnifiedBuilder(config: UnifiedBuilderConfig): UnifiedBuilderState {
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<Record<string, any>>({});

  useEffect(() => {
    const initializePlatforms = async () => {
      setIsInitializing(true);
      setError(null);

      try {
        const integrationsToInit: KatalystIntegration[] = [];
        
        if (config.targetPlatforms.includes('desktop')) {
          integrationsToInit.push({ 
            name: 'tauri', 
            type: 'framework' as const,
            enabled: true 
          });
        }
        
        if (config.targetPlatforms.includes('mobile')) {
          integrationsToInit.push({ 
            name: 'rspeedy', 
            type: 'framework' as const,
            enabled: true 
          });
        }
        
        if (config.targetPlatforms.includes('metaverse')) {
          integrationsToInit.push({ 
            name: 'webxr', 
            type: 'framework' as const,
            enabled: true 
          });
        }

        if (integrationsToInit.length > 0) {
          const initializedIntegrations = await IntegrationFactory.initializeIntegrations(integrationsToInit);
          
          const integrationMap: Record<string, any> = {};
          integrationsToInit.forEach(integration => {
            const instance = IntegrationFactory.getIntegration(integration.name);
            if (instance) {
              integrationMap[integration.name] = instance;
            }
          });

          setIntegrations(integrationMap);
          setPlatforms(config.targetPlatforms);
          setIsReady(true);
        } else {
          setPlatforms(['web']);
          setIsReady(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize platforms');
        setIsReady(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initializePlatforms();
  }, [config.targetPlatforms, config.sharedComponents, config.rustBackend]);

  return { 
    platforms, 
    isReady, 
    isInitializing, 
    error, 
    integrations 
  };
}

export function useDesktopBuilder(config?: Partial<UnifiedBuilderConfig>) {
  return useUnifiedBuilder({
    targetPlatforms: ['desktop'],
    sharedComponents: true,
    rustBackend: true,
    ...config
  });
}

export function useMobileBuilder(config?: Partial<UnifiedBuilderConfig>) {
  return useUnifiedBuilder({
    targetPlatforms: ['mobile'],
    sharedComponents: true,
    rustBackend: true,
    ...config
  });
}

export function useMetaverseBuilder(config?: Partial<UnifiedBuilderConfig>) {
  return useUnifiedBuilder({
    targetPlatforms: ['metaverse'],
    sharedComponents: true,
    rustBackend: true,
    ...config
  });
}

export function useMultiPlatformBuilder(config?: Partial<UnifiedBuilderConfig>) {
  return useUnifiedBuilder({
    targetPlatforms: ['web', 'desktop', 'mobile', 'metaverse'],
    sharedComponents: true,
    rustBackend: true,
    features: {
      hotReload: true,
      crossPlatformSharing: true,
      performanceOptimization: true,
      nativeIntegration: true
    },
    ...config
  });
}
