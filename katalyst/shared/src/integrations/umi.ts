export class UmiIntegration {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async setupUmi() {
    return {
      name: 'umi-framework',
      setup: () => ({
        routing: 'convention',
        plugins: [],
        aumi: true
      })
    };
  }

  async initialize() {
    return [await this.setupUmi()];
  }
}
