export interface RSpackPluginConfig {
  name: string;
  options?: Record<string, any>;
}

export class RSpackPluginManager {
  private plugins: Map<string, RSpackPluginConfig> = new Map();

  addPlugin(config: RSpackPluginConfig) {
    this.plugins.set(config.name, config);
  }

  getPlugin(name: string): RSpackPluginConfig | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): RSpackPluginConfig[] {
    return Array.from(this.plugins.values());
  }

  generatePluginConfig() {
    return this.getAllPlugins().map((plugin) => ({
      ...plugin,
      apply: (compiler: any) => {},
    }));
  }
}
