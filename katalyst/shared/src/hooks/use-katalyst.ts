import { useState, useEffect } from 'react';
import { KatalystConfig } from '../types';

export function useKatalyst(initialConfig: KatalystConfig) {
  const [config, setConfig] = useState<KatalystConfig>(initialConfig);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeKatalyst = async () => {
      try {
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Katalyst:', error);
      }
    };

    initializeKatalyst();
  }, []);

  const updateConfig = (updates: Partial<KatalystConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return {
    config,
    updateConfig,
    isInitialized
  };
}
