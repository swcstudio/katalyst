import { useState, useEffect } from 'react';
import { KatalystIntegration } from '../types';

export function useIntegration(integrationName: string) {
  const [integration, setIntegration] = useState<KatalystIntegration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIntegration = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    loadIntegration();
  }, [integrationName]);

  return {
    integration,
    isLoading,
    error
  };
}
