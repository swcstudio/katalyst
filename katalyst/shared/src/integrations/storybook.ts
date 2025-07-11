export class StorybookIntegration {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async setupStorybook() {
    return {
      name: 'storybook-rsbuild',
      setup: () => ({
        builder: 'rsbuild',
        stories: [],
        addons: []
      })
    };
  }

  async initialize() {
    return [await this.setupStorybook()];
  }
}
