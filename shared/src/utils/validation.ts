import type {
  KatalystConfig,
  KatalystFeature,
  KatalystIntegration,
  KatalystPlugin,
} from '../types/index.ts';

export function validateKatalystConfig(config: KatalystConfig): boolean {
  if (!config.variant || !['core', 'remix', 'nextjs'].includes(config.variant)) {
    return false;
  }

  if (
    !Array.isArray(config.features) ||
    !Array.isArray(config.plugins) ||
    !Array.isArray(config.integrations)
  ) {
    return false;
  }

  return (
    config.features.every(validateFeature) &&
    config.plugins.every(validatePlugin) &&
    config.integrations.every(validateIntegration)
  );
}

export function validateFeature(feature: KatalystFeature): boolean {
  return typeof feature.name === 'string' && typeof feature.enabled === 'boolean';
}

export function validatePlugin(plugin: KatalystPlugin): boolean {
  return typeof plugin.name === 'string' && typeof plugin.version === 'string';
}

export function validateIntegration(integration: KatalystIntegration): boolean {
  const validTypes = [
    'bundler',
    'framework',
    'ui',
    'testing',
    'deployment',
    'development',
    'validation',
    'automation',
  ];
  return (
    typeof integration.name === 'string' &&
    validTypes.includes(integration.type) &&
    typeof integration.enabled === 'boolean'
  );
}
