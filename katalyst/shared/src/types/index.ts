export interface KatalystConfig {
  variant: 'core' | 'remix' | 'nextjs';
  features: KatalystFeature[];
  plugins: KatalystPlugin[];
  integrations: KatalystIntegration[];
}

export interface KatalystFeature {
  name: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface KatalystPlugin {
  name: string;
  version: string;
  config?: Record<string, any>;
}

export interface KatalystIntegration {
  name: string;
  type: 'bundler' | 'framework' | 'ui' | 'testing' | 'deployment' | 'development' | 'validation' | 'automation';
  enabled: boolean;
  config?: Record<string, any>;
}

export interface TanStackConfig {
  router: boolean;
  query: boolean;
  form: boolean;
  table: boolean;
  virtual: boolean;
}

export interface RSpackConfig {
  plugins: string[];
  optimization: Record<string, any>;
  performance: Record<string, any>;
}

export interface Web3Config {
  evmos: boolean;
  cosmos: boolean;
  ethereum: boolean;
  chains: string[];
}

export interface StyleXConfig {
  theme: Record<string, any>;
  tokens: Record<string, any>;
  plugins: string[];
}

export interface StorybookConfig {
  builder: 'rsbuild';
  addons: string[];
  features: Record<string, boolean>;
}
