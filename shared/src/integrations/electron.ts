export class ElectronIntegration {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async setupElectron() {
    return {
      name: 'electron-rsbuild',
      setup: () => ({
        main: './src/main.ts',
        renderer: './src/renderer.tsx',
        preload: './src/preload.ts'
      })
    };
  }

  async initialize() {
    return [await this.setupElectron()];
  }
}
