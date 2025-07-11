export interface EMPConfig {
  name: string;
  port: number;
  remotes: Record<string, string>;
  exposes: Record<string, string>;
  shared: Record<string, any>;
  framework: 'react' | 'vue2' | 'vue3';
  mode: 'development' | 'production';
}

export interface MicroFrontendConfig {
  name: string;
  framework: 'react' | 'vue2' | 'vue3';
  exposed_components: Array<{
    name: string;
    path: string;
  }>;
}

export interface TeamConfig {
  name: string;
  path: string;
  port: number;
  modules: string[];
  dependencies: string[];
}

export interface WorkspaceConfig {
  shared_dependencies: string[];
  projects: ProjectConfig[];
  deployment: {
    cdn_url: string;
    production_domain: string;
    staging_domain: string;
  };
}

export interface ProjectConfig {
  name: string;
  path: string;
  port: number;
  exposed_modules: string[];
  dependencies: string[];
}

export class EMPIntegration {
  private config: EMPConfig;

  constructor(config: EMPConfig) {
    this.config = config;
  }

  async setupMicroFrontend() {
    return {
      name: 'emp-micro-frontend',
      setup: () => ({
        federation: {
          name: this.config.name || 'katalyst-host',
          filename: 'emp.js',
          remotes: this.config.remotes || {
            'marketing-header': 'http://localhost:8001/emp.js',
            'marketing-footer': 'http://localhost:8002/emp.js',
            'product-showcase': 'http://localhost:8003/emp.js',
            'user-dashboard': 'http://localhost:8004/emp.js'
          },
          exposes: this.config.exposes || {
            './App': './src/App.tsx',
            './Router': './src/Router.tsx',
            './Store': './src/store/index.ts',
            './Components': './src/components/index.ts'
          },
          shared: {
            react: { 
              singleton: true, 
              requiredVersion: '^18.0.0',
              eager: true 
            },
            'react-dom': { 
              singleton: true, 
              requiredVersion: '^18.0.0',
              eager: true 
            },
            'react-router-dom': {
              singleton: true,
              requiredVersion: '^6.0.0'
            },
            '@tanstack/react-query': {
              singleton: true,
              requiredVersion: '^5.0.0'
            },
            'zustand': {
              singleton: true,
              requiredVersion: '^4.0.0'
            },
            ...this.config.shared
          }
        },
        rspack: {
          experiments: {
            rspackFuture: {
              disableTransformByDefault: true
            }
          },
          plugins: [
            {
              name: 'ModuleFederationPlugin',
              options: {
                name: this.config.name,
                filename: 'emp.js',
                remotes: this.config.remotes,
                exposes: this.config.exposes,
                shared: this.config.shared
              }
            }
          ]
        },
        performance: {
          firstLoad: '28% faster than previous versions',
          secondLoad: '45% faster than previous versions',
          bundleSize: '24% smaller production bundles'
        }
      }),
      plugins: [
        '@empjs/cli',
        '@empjs/share',
        '@empjs/rspack-plugin'
      ],
      dependencies: [
        '@empjs/cli',
        '@empjs/share',
        '@empjs/rspack-plugin',
        'rspack'
      ]
    };
  }

  generateMicroFrontendConfig(config: MicroFrontendConfig) {
    const empConfig = {
      name: config.name,
      filename: 'emp.js',
      exposes: config.exposed_components.reduce((acc, component) => {
        acc[`./${component.name}`] = component.path;
        return acc;
      }, {} as Record<string, string>),
      shared: this.getSharedDependencies(config.framework)
    };

    return empConfig;
  }

  private getSharedDependencies(framework: 'react' | 'vue2' | 'vue3') {
    const baseDependencies = {
      'react': { singleton: true, requiredVersion: '^18.0.0' },
      'react-dom': { singleton: true, requiredVersion: '^18.0.0' }
    };

    switch (framework) {
      case 'react':
        return {
          ...baseDependencies,
          '@empjs/share/adapter': { singleton: true }
        };
      case 'vue2':
        return {
          ...baseDependencies,
          'vue': { singleton: true, requiredVersion: '^2.7.0' },
          '@empjs/share/vue2-adapter': { singleton: true }
        };
      case 'vue3':
        return {
          ...baseDependencies,
          'vue': { singleton: true, requiredVersion: '^3.0.0' },
          '@empjs/share/vue3-adapter': { singleton: true }
        };
      default:
        return baseDependencies;
    }
  }

  configureMarketingTeamsWorkspace(teams: TeamConfig[]): WorkspaceConfig {
    const workspace: WorkspaceConfig = {
      shared_dependencies: [
        'react', 'react-dom', 'react-router-dom', 
        'styled-components', 'analytics-lib',
        '@tanstack/react-query', 'zustand'
      ],
      projects: teams.map(team => ({
        name: team.name,
        path: team.path,
        port: team.port,
        exposed_modules: team.modules,
        dependencies: team.dependencies
      })),
      deployment: {
        cdn_url: 'https://cdn.example.com/marketing',
        production_domain: 'marketing.example.com',
        staging_domain: 'staging-marketing.example.com'
      }
    };

    return workspace;
  }

  async setupShellApplication() {
    return {
      name: 'emp-shell',
      setup: () => ({
        remoteModules: {
          'team-branding': {
            url: 'https://cdn.example.com/marketing/team-branding/emp.js',
            modules: ['Header', 'Footer', 'ColorTheme']
          },
          'team-product': {
            url: 'https://cdn.example.com/marketing/team-product/emp.js',
            modules: ['ProductGrid', 'ProductDetail', 'ProductSearch']
          },
          'team-blog': {
            url: 'https://cdn.example.com/marketing/team-blog/emp.js',
            modules: ['BlogList', 'BlogPost', 'AuthorBio']
          },
          'team-analytics': {
            url: 'https://cdn.example.com/marketing/team-analytics/emp.js',
            modules: ['AnalyticsProvider', 'EventTracker']
          }
        },
        errorBoundary: true,
        loadingFallback: 'BrandedLoadingSpinner',
        remoteTimeout: 5000,
        retryAttempts: 3,
        fallbackComponents: {
          'Header': 'DefaultHeader',
          'Footer': 'DefaultFooter',
          'ProductGrid': 'EmptyProductGrid'
        }
      })
    };
  }

  async setupDevelopmentServer() {
    return {
      name: 'emp-dev-server',
      setup: () => ({
        port: this.config.port || 8080,
        hot: true,
        liveReload: true,
        historyApiFallback: true,
        compress: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
        },
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            }
          }
        },
        static: {
          directory: './public',
          publicPath: '/'
        }
      })
    };
  }

  async initialize() {
    const integrations = await Promise.all([
      this.setupMicroFrontend(),
      this.setupShellApplication(),
      this.setupDevelopmentServer()
    ]);

    return integrations.filter(Boolean);
  }

  getCliCommands() {
    return {
      init: 'emp init <project-name>',
      dev: 'emp dev',
      build: 'emp build',
      serve: 'emp serve',
      analyze: 'emp analyze'
    };
  }

  getTypeDefinitions() {
    return `
      interface RemoteModule {
        url: string;
        modules: string[];
      }

      interface ShellConfig {
        remoteModules: Record<string, RemoteModule>;
        errorBoundary: boolean;
        loadingFallback: string;
        remoteTimeout: number;
        retryAttempts: number;
        fallbackComponents: Record<string, string>;
      }

      interface DevServerConfig {
        port: number;
        hot: boolean;
        liveReload: boolean;
        historyApiFallback: boolean;
        compress: boolean;
        headers: Record<string, string>;
        proxy: Record<string, any>;
        static: {
          directory: string;
          publicPath: string;
        };
      }
    `;
  }
}
