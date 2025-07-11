export class RePackIntegration {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async setupReactNative() {
    return {
      name: 'repack-react-native',
      setup: () => ({
        platform: 'native',
        bundler: 'webpack',
        devServer: true
      })
    };
  }

  async initialize() {
    return [await this.setupReactNative()];
  }
}
