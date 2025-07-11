export interface WebpackPluginConfig {
  name: string;
  options?: Record<string, any>;
}

export class WebpackPluginManager {
  private plugins: Map<string, WebpackPluginConfig> = new Map();

  addPlugin(config: WebpackPluginConfig) {
    this.plugins.set(config.name, config);
  }

  getPlugin(name: string): WebpackPluginConfig | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): WebpackPluginConfig[] {
    return Array.from(this.plugins.values());
  }
}
