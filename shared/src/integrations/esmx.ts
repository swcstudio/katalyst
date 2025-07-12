declare const process: {
  env: {
    NODE_ENV?: string;
  };
} | undefined;

export interface EsmxConfig {
  importMaps: Record<string, string>;
  moduleResolution: 'node' | 'bundler' | 'classic';
  allowImportingTsExtensions: boolean;
  allowArbitraryExtensions: boolean;
  resolveJsonModule: boolean;
  esModuleInterop: boolean;
  allowSyntheticDefaultImports: boolean;
  moduleDetection: 'auto' | 'legacy' | 'force';
}

export interface ImportMap {
  imports: Record<string, string>;
  scopes: Record<string, Record<string, string>>;
}

export interface ModuleCache {
  enabled: boolean;
  directory: string;
  maxSize: string;
  ttl: number;
}

export class EsmxIntegration {
  private config: EsmxConfig;

  constructor(config: EsmxConfig) {
    this.config = config;
  }

  async setupESM() {
    return {
      name: 'esmx-esm',
      setup: () => ({
        importMaps: this.generateImportMaps(),
        moduleCache: this.setupModuleCache(),
        loader: this.setupModuleLoader(),
        resolution: {
          moduleResolution: this.config.moduleResolution || 'bundler',
          allowImportingTsExtensions: this.config.allowImportingTsExtensions || true,
          allowArbitraryExtensions: this.config.allowArbitraryExtensions || false,
          resolveJsonModule: this.config.resolveJsonModule || true,
          esModuleInterop: this.config.esModuleInterop || true,
          allowSyntheticDefaultImports: this.config.allowSyntheticDefaultImports || true,
          moduleDetection: this.config.moduleDetection || 'auto'
        },
        features: {
          nativeESM: true,
          dynamicImports: true,
          topLevelAwait: true,
          importAssertions: true,
          importMeta: true,
          webStreams: true,
          webCrypto: true,
          fetchAPI: true
        }
      }),
      plugins: [
        'esmx-loader',
        'esmx-resolver',
        'esmx-transformer'
      ],
      dependencies: [
        'esmx',
        'esbuild',
        'typescript'
      ]
    };
  }

  private generateImportMaps(): ImportMap {
    return {
      imports: {
        'react': 'https://esm.sh/react@18',
        'react-dom': 'https://esm.sh/react-dom@18',
        'react-dom/client': 'https://esm.sh/react-dom@18/client',
        '@tanstack/react-query': 'https://esm.sh/@tanstack/react-query@5',
        '@tanstack/react-router': 'https://esm.sh/@tanstack/react-router@1',
        'zustand': 'https://esm.sh/zustand@4',
        'tailwindcss': 'https://esm.sh/tailwindcss@4',
        '@arco-design/web-react': 'https://esm.sh/@arco-design/web-react@2',
        'typia': 'https://esm.sh/typia@6',
        ...this.config.importMaps
      },
      scopes: {
        '/katalyst/core/': {
          '@katalyst/shared': '/katalyst/shared/src/index.ts',
          '@katalyst/components': '/katalyst/shared/src/components/index.ts',
          '@katalyst/hooks': '/katalyst/shared/src/hooks/index.ts',
          '@katalyst/stores': '/katalyst/shared/src/stores/index.ts',
          '@katalyst/utils': '/katalyst/shared/src/utils/index.ts'
        },
        '/katalyst/remix/': {
          '@katalyst/shared': '/katalyst/shared/src/index.ts',
          '@katalyst/components': '/katalyst/shared/src/components/index.ts',
          '@katalyst/hooks': '/katalyst/shared/src/hooks/index.ts',
          '@katalyst/stores': '/katalyst/shared/src/stores/index.ts',
          '@katalyst/utils': '/katalyst/shared/src/utils/index.ts'
        },
        '/katalyst/nextjs/': {
          '@katalyst/shared': '/katalyst/shared/src/index.ts',
          '@katalyst/components': '/katalyst/shared/src/components/index.ts',
          '@katalyst/hooks': '/katalyst/shared/src/hooks/index.ts',
          '@katalyst/stores': '/katalyst/shared/src/stores/index.ts',
          '@katalyst/utils': '/katalyst/shared/src/utils/index.ts'
        }
      }
    };
  }

  private setupModuleCache(): ModuleCache {
    return {
      enabled: true,
      directory: '.esmx/cache',
      maxSize: '500MB',
      ttl: 86400000 // 24 hours
    };
  }

  private setupModuleLoader() {
    return {
      name: 'esmx-loader',
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json'],
      transformers: {
        typescript: {
          enabled: true,
          target: 'es2022',
          jsx: 'react-jsx',
          jsxImportSource: 'react',
          allowJs: true,
          declaration: false,
          sourceMap: true
        },
        jsx: {
          enabled: true,
          runtime: 'automatic',
          importSource: 'react',
          development: (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || false
        },
        css: {
          enabled: true,
          modules: true,
          postcss: true
        }
      },
      resolvers: [
        {
          name: 'node-modules',
          priority: 1,
          resolve: (specifier: string, context: any) => {
            if (specifier.startsWith('node:')) {
              return { url: specifier };
            }
            return null;
          }
        },
        {
          name: 'import-maps',
          priority: 2,
          resolve: (specifier: string, context: any) => {
            const importMaps = this.generateImportMaps();
            if (importMaps.imports[specifier]) {
              return { url: importMaps.imports[specifier] };
            }
            return null;
          }
        },
        {
          name: 'relative',
          priority: 3,
          resolve: (specifier: string, context: any) => {
            if (specifier.startsWith('./') || specifier.startsWith('../')) {
              return { url: new URL(specifier, context.parentURL).href };
            }
            return null;
          }
        }
      ]
    };
  }

  async setupDenoIntegration() {
    return {
      name: 'esmx-deno',
      setup: () => ({
        runtime: 'deno',
        permissions: {
          net: ['esm.sh', 'deno.land', 'cdn.skypack.dev'],
          read: ['.', './katalyst'],
          write: ['./.esmx', './dist'],
          env: ['NODE_ENV', 'DENO_ENV'],
          run: ['deno', 'bun']
        },
        importMap: './deno.json',
        tasks: {
          dev: 'deno run --allow-all --watch ./scripts/dev.ts',
          build: 'deno run --allow-all ./scripts/build.ts',
          test: 'deno test --allow-all',
          lint: 'deno lint',
          fmt: 'deno fmt'
        },
        compilerOptions: {
          allowJs: true,
          allowUnreachableCode: false,
          allowUnusedLabels: false,
          checkJs: false,
          experimentalDecorators: false,
          jsx: 'react-jsx',
          jsxImportSource: 'react',
          keyofStringsOnly: false,
          lib: ['deno.window', 'dom', 'dom.iterable', 'es2022'],
          noFallthroughCasesInSwitch: false,
          noImplicitAny: true,
          noImplicitOverride: false,
          noImplicitReturns: false,
          noImplicitThis: true,
          noStrictGenericChecks: false,
          noUncheckedIndexedAccess: false,
          noUnusedLocals: false,
          noUnusedParameters: false,
          strict: true,
          strictBindCallApply: true,
          strictFunctionTypes: true,
          strictNullChecks: true,
          strictPropertyInitialization: true,
          suppressExcessPropertyErrors: false,
          suppressImplicitAnyIndexErrors: false,
          useUnknownInCatchVariables: false
        }
      })
    };
  }

  async setupBunIntegration() {
    return {
      name: 'esmx-bun',
      setup: () => ({
        runtime: 'bun',
        target: 'bun',
        format: 'esm',
        splitting: true,
        treeshaking: true,
        minify: false,
        sourcemap: 'external',
        external: ['react', 'react-dom'],
        define: {
          'process.env.NODE_ENV': '"development"',
          'import.meta.env.DEV': 'true'
        },
        loader: {
          '.ts': 'ts',
          '.tsx': 'tsx',
          '.js': 'js',
          '.jsx': 'jsx',
          '.css': 'css',
          '.json': 'json'
        },
        plugins: [
          {
            name: 'katalyst-resolver',
            setup: (build: any) => {
              build.onResolve({ filter: /^@katalyst\// }, (args: any) => {
                const path = args.path.replace('@katalyst/', './katalyst/shared/src/');
                return { path, namespace: 'katalyst' };
              });
            }
          }
        ]
      })
    };
  }

  async setupWebStreams() {
    return {
      name: 'esmx-web-streams',
      setup: () => ({
        streams: {
          ReadableStream: true,
          WritableStream: true,
          TransformStream: true,
          ReadableStreamDefaultReader: true,
          ReadableStreamBYOBReader: true,
          WritableStreamDefaultWriter: true,
          TransformStreamDefaultController: true,
          ReadableByteStreamController: true,
          ReadableStreamDefaultController: true
        },
        apis: {
          fetch: true,
          Request: true,
          Response: true,
          Headers: true,
          URL: true,
          URLSearchParams: true,
          AbortController: true,
          AbortSignal: true,
          FormData: true,
          Blob: true,
          File: true
        },
        crypto: {
          subtle: true,
          getRandomValues: true,
          randomUUID: true
        }
      })
    };
  }

  async initialize() {
    const integrations = await Promise.all([
      this.setupESM(),
      this.setupDenoIntegration(),
      this.setupBunIntegration(),
      this.setupWebStreams()
    ]);

    return integrations.filter(Boolean);
  }

  getDenoConfig() {
    return {
      compilerOptions: {
        allowJs: true,
        jsx: 'react-jsx',
        jsxImportSource: 'react',
        lib: ['deno.window', 'dom', 'dom.iterable', 'es2022'],
        strict: true
      },
      imports: this.generateImportMaps().imports,
      tasks: {
        dev: 'deno run --allow-all --watch ./scripts/dev.ts',
        build: 'deno run --allow-all ./scripts/build.ts',
        test: 'deno test --allow-all',
        lint: 'deno lint',
        fmt: 'deno fmt'
      },
      exclude: ['node_modules', 'dist', '.next', '.remix']
    };
  }

  getBunConfig() {
    return {
      name: 'katalyst',
      module: 'index.ts',
      type: 'module',
      devDependencies: {
        'bun-types': 'latest'
      },
      peerDependencies: {
        typescript: '^5.0.0'
      },
      trustedDependencies: ['esbuild']
    };
  }

  getTypeDefinitions() {
    return `
      interface ImportMap {
        imports: Record<string, string>;
        scopes: Record<string, Record<string, string>>;
      }

      interface ModuleCache {
        enabled: boolean;
        directory: string;
        maxSize: string;
        ttl: number;
      }

      interface EsmxLoader {
        name: string;
        extensions: string[];
        transformers: Record<string, any>;
        resolvers: Array<{
          name: string;
          priority: number;
          resolve: (specifier: string, context: any) => any;
        }>;
      }

      declare namespace Deno {
        export interface CompilerOptions {
          allowJs?: boolean;
          jsx?: string;
          jsxImportSource?: string;
          lib?: string[];
          strict?: boolean;
        }
      }

      declare namespace Bun {
        export interface BuildConfig {
          entrypoints: string[];
          outdir: string;
          target: string;
          format: string;
          splitting: boolean;
          treeshaking: boolean;
          minify: boolean;
          sourcemap: string;
        }
      }
    `;
  }
}
