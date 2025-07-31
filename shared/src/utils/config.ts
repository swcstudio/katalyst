import type { KatalystConfig } from '../types/index.ts';

export class ConfigManager {
  private config: KatalystConfig;

  constructor(config: KatalystConfig) {
    this.config = config;
  }

  getConfig(): KatalystConfig {
    return this.config;
  }

  updateConfig(updates: Partial<KatalystConfig>) {
    this.config = { ...this.config, ...updates };
  }

  getFeature(name: string) {
    return this.config.features.find((f) => f.name === name);
  }

  getPlugin(name: string) {
    return this.config.plugins.find((p) => p.name === name);
  }

  getIntegration(name: string) {
    return this.config.integrations.find((i) => i.name === name);
  }
}
