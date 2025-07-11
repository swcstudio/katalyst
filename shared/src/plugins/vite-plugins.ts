export interface VitePluginConfig {
  name: string;
  options?: Record<string, any>;
}

export class VitePluginManager {
  private plugins: Map<string, VitePluginConfig> = new Map();

  addPlugin(config: VitePluginConfig) {
    this.plugins.set(config.name, config);
  }

  getPlugin(name: string): VitePluginConfig | undefined {
    return this.plugins.get(name);
  }

  getAllPlugins(): VitePluginConfig[] {
    return Array.from(this.plugins.values());
  }
}
