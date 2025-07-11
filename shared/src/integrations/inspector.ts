export class InspectorIntegration {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async setupInspector() {
    return {
      name: 'react-inspector',
      setup: () => ({
        components: new Map(),
        devtools: true,
        ide: 'vscode',
      }),
    };
  }

  async initialize() {
    return [await this.setupInspector()];
  }
}
