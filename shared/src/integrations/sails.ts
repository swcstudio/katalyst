export class SailsIntegration {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async setupSails() {
    return {
      name: 'sails-mvc',
      setup: () => ({
        models: new Map(),
        controllers: new Map(),
        views: new Map(),
      }),
    };
  }

  async initialize() {
    return [await this.setupSails()];
  }
}
