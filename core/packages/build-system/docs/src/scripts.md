# Build Scripts Documentation

This section documents the automation scripts that power the Katalyst build system, providing development workflows, build automation, and deployment capabilities.

## Overview

The build system includes three main scripts that orchestrate different aspects of the development and build process:

1. **unified-runner.ts** - Main build system orchestrator
2. **tauri-builder.ts** - Specialized Tauri build automation
3. **setup-turbo-cache.ts** - Remote caching configuration

## unified-runner.ts

The central orchestrator for the entire build system, managing multiple package managers, task runners, and build targets.

**Purpose**: Unified interface for all build operations across platforms and frameworks
**Size**: 816 lines of comprehensive automation logic
**Features**: Multi-runner support, fallback mechanisms, cloud caching, parallel execution

### Core Architecture

#### Runner Configuration

```typescript
interface RunnerConfig {
  preferredPackageManager: 'deno' | 'bun';
  preferredTaskRunner: 'nx' | 'turbo';
  enableCloudCache: boolean;
  parallel: boolean;
  verbose: boolean;
  dry: boolean;
  fallbackEnabled: boolean;
  cacheStrategy: 'aggressive' | 'conservative' | 'disabled';
}
```

#### Task Configuration

```typescript
interface TaskConfig {
  name: string;
  command: string;
  runner: 'nx' | 'turbo' | 'deno' | 'bun';
  dependencies?: string[];
  platforms?: string[];
  cacheEnabled: boolean;
  cloudCacheEnabled: boolean;
  fallbacks?: Array<{ runner: string; command: string }>;
}
```

#### System Capabilities Detection

The script automatically detects available tools:

```typescript
interface RunnerCapabilities {
  deno: boolean;
  bun: boolean;
  nx: boolean;
  turbo: boolean;
  node: boolean;
}
```

### Key Features

#### 1. Multi-Package Manager Support

**Primary**: Deno (URL imports + npm compatibility)
**Fallback**: Bun (fast package manager)
**Last Resort**: npm/yarn (traditional package managers)

```typescript
async install(packages?: string[]): Promise<boolean> {
  // Try Deno first
  if (this.capabilities.deno && this.config.preferredPackageManager === 'deno') {
    const success = await this.runDenoInstall(packages);
    if (success) return true;
  }

  // Fallback to Bun
  if (this.capabilities.bun && this.config.fallbackEnabled) {
    const success = await this.runBunInstall(packages);
    if (success) return true;
  }

  // Last resort: npm
  if (this.capabilities.node && this.config.fallbackEnabled) {
    return await this.runNpmInstall(packages);
  }

  return false;
}
```

#### 2. Intelligent Task Runner Selection

The script automatically selects the best runner for each task:

```typescript
private selectOptimalRunner(task: TaskConfig): 'nx' | 'turbo' | 'deno' | 'bun' {
  // Use task-specified runner if available
  if (this.capabilities[task.runner]) {
    return task.runner;
  }

  // Complex builds with caching: prefer Turbo
  if (task.cacheEnabled && task.dependencies) {
    if (this.capabilities.turbo) return 'turbo';
    if (this.capabilities.nx) return 'nx';
  }

  // Testing: prefer Deno
  if (task.name.startsWith('test') || task.name.includes('deno')) {
    if (this.capabilities.deno) return 'deno';
  }

  // General fallback priority
  if (this.config.preferredTaskRunner === 'turbo' && this.capabilities.turbo) return 'turbo';
  if (this.config.preferredTaskRunner === 'nx' && this.capabilities.nx) return 'nx';
  if (this.capabilities.bun) return 'bun';
  if (this.capabilities.deno) return 'deno';

  throw new Error('No suitable task runner available');
}
```

#### 3. Comprehensive Task Definitions

The script includes predefined tasks for all common operations:

**Development Tasks**:
```typescript
dev: {
  name: 'dev',
  command: 'run-many --target=dev --projects=core,remix,nextjs --parallel',
  runner: 'nx',
  cacheEnabled: false,
  cloudCacheEnabled: false,
  fallbacks: [
    { runner: 'turbo', command: 'dev' },
    { runner: 'bun', command: 'run dev' },
  ],
}
```

**Build Tasks**:
```typescript
build: {
  name: 'build',
  command: 'build',
  runner: 'turbo',
  dependencies: ['build-native'],
  cacheEnabled: true,
  cloudCacheEnabled: true,
  fallbacks: [
    {
      runner: 'nx',
      command: 'run-many --target=build --projects=core,remix,nextjs --parallel',
    },
    { runner: 'bun', command: 'run build' },
  ],
}
```

**Platform-Specific Builds**:
```typescript
'build:desktop': {
  name: 'build:desktop',
  command: 'build:desktop',
  runner: 'turbo',
  platforms: ['desktop'],
  dependencies: ['build-native', 'build:web'],
  cacheEnabled: true,
  cloudCacheEnabled: true,
}
```

#### 4. Fallback Mechanism

Tasks can have multiple fallback runners:

```typescript
if (this.config.fallbackEnabled && task.fallbacks) {
  for (const fallback of task.fallbacks) {
    try {
      console.log(colors.yellow(`🔄 Trying fallback: ${fallback.runner}`));
      const fallbackTask = { ...task, command: fallback.command };
      const success = await this.executeTask(fallbackTask, fallback.runner as any, options);
      if (success) return true;
    } catch (fallbackError) {
      console.warn(colors.yellow(`⚠️  Fallback failed: ${fallbackError.message}`));
    }
  }
}
```

#### 5. Cloud Cache Integration

Automatic setup and usage of remote caching:

```typescript
async setupCloudCache(): Promise<boolean> {
  console.log(colors.blue('☁️  Setting up cloud cache...'));

  // Setup Turbo remote cache
  if (this.capabilities.turbo) {
    try {
      const process = new Deno.Command('turbo', {
        args: ['login'],
        cwd: this.cwd,
      });

      const { success } = await process.output();
      if (success) {
        console.log(colors.green('✅ Turbo cloud cache configured'));
      }
    } catch (error) {
      console.warn(colors.yellow(`⚠️  Failed to setup Turbo cache: ${error.message}`));
    }
  }

  // Setup NX cloud cache
  if (this.capabilities.nx) {
    try {
      const process = new Deno.Command('nx', {
        args: ['connect-to-nx-cloud'],
        cwd: this.cwd,
      });

      const { success } = await process.output();
      if (success) {
        console.log(colors.green('✅ NX cloud cache configured'));
      }
    } catch (error) {
      console.warn(colors.yellow(`⚠️  Failed to setup NX cache: ${error.message}`));
    }
  }

  return true;
}
```

### CLI Interface

The script provides a comprehensive CLI with extensive options:

```bash
deno run --allow-all src/packages/build-system/src/scripts/unified-runner.ts [OPTIONS]
```

#### Main Options

| Option | Description | Default |
|--------|-------------|---------|
| `-t, --task <TASK>` | Run a specific task | - |
| `-f, --frameworks <LIST>` | Comma-separated frameworks | - |
| `-p, --platforms <LIST>` | Comma-separated platforms | - |
| `--pm, --package-manager <PM>` | Package manager: deno, bun | deno |
| `--tr, --task-runner <TR>` | Task runner: nx, turbo | turbo |
| `--cache <STRATEGY>` | Cache strategy | aggressive |
| `-i, --install` | Install dependencies | false |
| `-c, --clean` | Clean build artifacts | false |
| `--cc, --cloud-cache` | Setup cloud caching | false |
| `--parallel` | Enable parallel execution | true |
| `--no-fallback` | Disable fallback runners | false |
| `-v, --verbose` | Enable verbose output | false |
| `-d, --dry` | Dry run (show commands) | false |
| `-s, --status` | Show system status | false |
| `-h, --help` | Show help message | false |

#### Usage Examples

**Basic Development**:
```bash
deno run --allow-all src/scripts/unified-runner.ts --task dev
```

**Build Specific Frameworks**:
```bash
deno run --allow-all src/scripts/unified-runner.ts --task build --frameworks core,shared
```

**Build for Specific Platforms**:
```bash
deno run --allow-all src/scripts/unified-runner.ts --task build --platforms web,desktop
```

**Use NX Instead of Turbo**:
```bash
deno run --allow-all src/scripts/unified-runner.ts --task dev --task-runner nx
```

**Install Dependencies**:
```bash
deno run --allow-all src/scripts/unified-runner.ts --install
```

**Clean and Rebuild**:
```bash
deno run --allow-all src/scripts/unified-runner.ts --clean
deno run --allow-all src/scripts/unified-runner.ts --task build
```

**Show System Status**:
```bash
deno run --allow-all src/scripts/unified-runner.ts --status
```

**Dry Run to See Commands**:
```bash
deno run --allow-all src/scripts/unified-runner.ts --task build --dry --verbose
```

### Environment Integration

#### CI/CD Integration

The script is designed to work seamlessly in CI/CD environments:

```bash
# CI build with cloud caching
deno run --allow-all src/scripts/unified-runner.ts \
  --task build \
  --cloud-cache \
  --cache aggressive \
  --parallel

# CI testing
deno run --allow-all src/scripts/unified-runner.ts \
  --task test \
  --platforms web \
  --frameworks core,shared
```

#### Development Workflow Integration

**Package.json scripts**:
```json
{
  "scripts": {
    "dev": "deno run --allow-all src/scripts/unified-runner.ts --task dev",
    "build": "deno run --allow-all src/scripts/unified-runner.ts --task build",
    "test": "deno run --allow-all src/scripts/unified-runner.ts --task test",
    "clean": "deno run --allow-all src/scripts/unified-runner.ts --clean"
  }
}
```

**VS Code Tasks**:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build All",
      "type": "shell",
      "command": "deno",
      "args": ["run", "--allow-all", "src/scripts/unified-runner.ts", "--task", "build"],
      "group": "build"
    }
  ]
}
```

## tauri-builder.ts

Specialized build script for Tauri applications, supporting desktop, mobile, and WebXR platforms.

**Purpose**: Automated Tauri build process with RSpack integration
**Size**: 423 lines of platform-specific build logic
**Features**: Cross-platform builds, asset optimization, metadata generation

### Core Architecture

#### Build Configuration

```typescript
interface BuildConfig {
  platform: 'desktop' | 'mobile' | 'webxr';
  mode: 'development' | 'production';
  features: string[];
  target?: string;
  bundleType?: 'app' | 'updater' | 'deb' | 'appimage' | 'msi' | 'nsis' | 'dmg' | 'aab' | 'apk';
}
```

#### Platform Detection

```typescript
const platform = process.env.TAURI_PLATFORM || 'desktop';
const isDev = process.env.NODE_ENV === 'development';
const isDesktop = platform === 'desktop';
const isMobile = platform === 'mobile';
const isWebXR = platform === 'webxr';
```

### Key Features

#### 1. Unified Build Process

The script orchestrates both frontend and backend builds:

```typescript
async build(): Promise<void> {
  console.log(`🚀 Building Katalyst Tauri ${this.config.platform} app...`);

  // Ensure directories exist
  await this.ensureDirectories();

  // Setup environment
  await this.setupEnvironment();

  // Build frontend with RSpack
  await this.buildFrontend();

  // Build Rust backend
  await this.buildBackend();

  // Package application
  await this.packageApp();

  console.log(`✅ Build completed for ${this.config.platform}`);
}
```

#### 2. Platform-Specific Environment Setup

```typescript
private async setupEnvironment(): Promise<void> {
  const env = {
    TAURI_PLATFORM: this.config.platform,
    NODE_ENV: this.config.mode,
    RUST_LOG: this.config.mode === 'development' ? 'debug' : 'info',
    TAURI_DEV: this.config.mode === 'development' ? 'true' : 'false',
  };

  // Platform-specific environment variables
  switch (this.config.platform) {
    case 'desktop':
      env['TAURI_TARGET'] = this.config.target || 'desktop';
      break;
    case 'mobile':
      env['TAURI_TARGET'] = this.config.target || 'mobile';
      env['TAURI_MOBILE'] = 'true';
      break;
    case 'webxr':
      env['TAURI_TARGET'] = 'desktop';
      env['TAURI_WEBXR'] = 'true';
      break;
  }

  // Set environment variables
  for (const [key, value] of Object.entries(env)) {
    Deno.env.set(key, value);
  }
}
```

#### 3. RSpack Integration

Frontend builds use RSpack for optimal performance:

```typescript
private async buildFrontend(): Promise<void> {
  console.log('📦 Building frontend with RSpack...');

  const rsbuildConfig = join(this.projectRoot, 'tauri-rsbuild.config.ts');

  if (!(await exists(rsbuildConfig))) {
    throw new Error('RSpack configuration not found');
  }

  const cmd = new Deno.Command('deno', {
    args: [
      'run',
      '--allow-all',
      'node_modules/@rsbuild/core/bin/rsbuild.js',
      'build',
      '--config',
      rsbuildConfig,
    ],
    cwd: this.projectRoot,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const { success } = await cmd.output();

  if (!success) {
    throw new Error('Frontend build failed');
  }
}
```

#### 4. Rust Backend Build

```typescript
private async buildBackend(): Promise<void> {
  console.log('🦀 Building Rust backend...');

  const features = this.getCargoFeatures();
  const target = this.getCargoTarget();

  const args = ['tauri', 'build'];

  if (features.length > 0) {
    args.push('--features', features.join(','));
  }

  if (target) {
    args.push('--target', target);
  }

  if (this.config.bundleType) {
    args.push('--bundles', this.config.bundleType);
  }

  const cmd = new Deno.Command('cargo', {
    args,
    cwd: this.projectRoot,
    stdout: 'inherit',
    stderr: 'inherit',
  });

  const { success } = await cmd.output();

  if (!success) {
    throw new Error('Backend build failed');
  }
}
```

#### 5. Feature Management

```typescript
private getCargoFeatures(): string[] {
  const features = [...this.config.features];

  switch (this.config.platform) {
    case 'mobile':
      features.push('mobile');
      break;
    case 'webxr':
      features.push('webxr');
      break;
  }

  if (this.config.mode === 'development') {
    features.push('devtools');
  }

  return features;
}
```

#### 6. Artifact Management

```typescript
private async copyBuildArtifacts(sourceDir: string, targetDir: string): Promise<void> {
  if (!(await exists(sourceDir))) {
    return;
  }

  // Copy platform-specific artifacts
  const artifacts = await this.getBuildArtifacts(sourceDir);

  for (const artifact of artifacts) {
    const sourcePath = join(sourceDir, artifact);
    const targetPath = join(targetDir, artifact);

    if (await exists(sourcePath)) {
      await Deno.copyFile(sourcePath, targetPath);
      console.log(`📋 Copied ${artifact}`);
    }
  }
}
```

#### 7. Metadata Generation

```typescript
private async generateMetadata(outputDir: string): Promise<void> {
  const metadata = {
    platform: this.config.platform,
    mode: this.config.mode,
    features: this.config.features,
    buildTime: new Date().toISOString(),
    version: await this.getVersion(),
    bundleType: this.config.bundleType,
  };

  const metadataPath = join(outputDir, 'build-metadata.json');
  await Deno.writeTextFile(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`📄 Generated metadata: ${metadataPath}`);
}
```

### CLI Interface

```bash
deno run --allow-all src/packages/build-system/src/scripts/tauri-builder.ts [OPTIONS] <COMMAND>
```

#### Commands

| Command | Description |
|---------|-------------|
| `--dev` | Start development server |
| `--build` | Build for production |

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --platform <PLATFORM>` | Target platform [desktop, mobile, webxr] | desktop |
| `-m, --mode <MODE>` | Build mode [development, production] | development |
| `-f, --features <FEATURES>` | Cargo features (comma-separated) | default |
| `-t, --target <TARGET>` | Specific build target | - |
| `-b, --bundle <TYPE>` | Bundle type [app, deb, dmg, apk, etc.] | - |
| `-h, --help` | Show help message | false |

#### Usage Examples

**Development**:
```bash
# Desktop development
deno run --allow-all src/scripts/tauri-builder.ts --dev --platform desktop

# Mobile development
deno run --allow-all src/scripts/tauri-builder.ts --dev --platform mobile

# WebXR development
deno run --allow-all src/scripts/tauri-builder.ts --dev --platform webxr
```

**Production Builds**:
```bash
# Desktop DMG
deno run --allow-all src/scripts/tauri-builder.ts --build --platform desktop --mode production --bundle dmg

# Mobile APK
deno run --allow-all src/scripts/tauri-builder.ts --build --platform mobile --mode production --bundle apk

# WebXR build
deno run --allow-all src/scripts/tauri-builder.ts --build --platform webxr --mode production
```

**Feature-Specific Builds**:
```bash
deno run --allow-all src/scripts/tauri-builder.ts --build --platform desktop --features "webxr,mobile"
```

### Development Workflow

#### Development Mode

The development mode starts both frontend and backend servers in parallel:

```typescript
async dev(): Promise<void> {
  console.log(`🛠️  Starting Katalyst Tauri ${this.config.platform} dev server...`);

  // Setup environment
  await this.setupEnvironment();

  // Start dev servers in parallel
  const frontendPromise = this.startFrontendDev();
  const backendPromise = this.startBackendDev();

  await Promise.all([frontendPromise, backendPromise]);
}
```

#### Platform-Specific Development

**Desktop Development**:
- Frontend: RSpack dev server on port 20007
- Backend: Tauri dev server with hot reload
- Features: Desktop APIs, file system access, system integration

**Mobile Development**:
- Frontend: RSpack dev server on port 20010
- Backend: Tauri mobile dev server
- Features: Mobile APIs, camera, geolocation, push notifications

**WebXR Development**:
- Frontend: RSpack dev server on port 20011
- Backend: Standard Tauri dev server
- Features: WebXR APIs, 3D rendering, spatial computing

## setup-turbo-cache.ts

Utility script for configuring Turborepo remote caching with Vercel.

**Purpose**: Automated setup of remote caching for faster builds across teams
**Size**: 241 lines of cache configuration logic
**Features**: Vercel integration, team setup, connection verification

### Core Architecture

#### Cache Configuration

```typescript
interface CacheConfig {
  team: string;
  token: string;
  apiUrl?: string;
  uploadTimeout?: number;
}
```

### Key Features

#### 1. Automated Cache Setup

```typescript
async setup(): Promise<void> {
  console.log('🚀 Setting up Turborepo remote caching...');

  // Ensure .turbo directory exists
  await ensureFile(this.turboConfigPath);

  // Configure remote cache
  await this.configureTurboCache();

  // Verify connection
  await this.verifyConnection();

  // Setup team configuration
  await this.setupTeamConfig();

  // Configure Vercel integration
  await this.configureVercelIntegration();

  console.log('✅ Turborepo remote caching configured successfully!');
}
```

#### 2. Connection Verification

```typescript
private async verifyConnection(): Promise<void> {
  console.log('🔍 Verifying remote cache connection...');

  const response = await fetch(
    `${this.config.apiUrl || 'https://api.vercel.com'}/v1/teams/${this.config.team}`,
    {
      headers: {
        Authorization: `Bearer ${this.config.token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to verify connection: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`✅ Connected to team: ${data.name}`);
}
```

#### 3. Turbo Configuration

```typescript
private async configureTurboCache(): Promise<void> {
  const config = {
    teamId: this.config.team,
    apiUrl: this.config.apiUrl || 'https://api.vercel.com',
    token: this.config.token,
    enabled: true,
    preflight: true,
    uploadTimeout: this.config.uploadTimeout || 60000,
    signature: true,
  };

  await Deno.writeTextFile(this.turboConfigPath, JSON.stringify(config, null, 2));

  console.log('📝 Turbo config written to .turbo/config.json');
}
```

#### 4. Vercel Integration

```typescript
private async configureVercelIntegration(): Promise<void> {
  console.log('🔗 Configuring Vercel integration...');

  // Update vercel.json with caching configuration
  const vercelJsonPath = join(this.cwd, 'vercel.json');

  try {
    const vercelConfig = JSON.parse(await Deno.readTextFile(vercelJsonPath));

    vercelConfig.build = {
      ...vercelConfig.build,
      env: {
        ...vercelConfig.build?.env,
        TURBO_TEAM: this.config.team,
        TURBO_TOKEN: '@turbo-token',
        TURBO_REMOTE_CACHE_SIGNATURE_KEY: '@turbo-cache-key',
      },
    };

    await Deno.writeTextFile(vercelJsonPath, JSON.stringify(vercelConfig, null, 2));
  } catch (error) {
    console.warn('⚠️  Could not update vercel.json:', error.message);
  }
}
```

### CLI Interface

```bash
deno run --allow-all src/packages/build-system/src/scripts/setup-turbo-cache.ts [OPTIONS]
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-t, --team <TEAM>` | Vercel team ID or slug | - |
| `-k, --token <TOKEN>` | Vercel API token | - |
| `-u, --api-url <URL>` | Custom API URL | - |
| `--timeout <MS>` | Upload timeout in milliseconds | - |
| `-s, --stats` | Show cache statistics | false |
| `-h, --help` | Show help message | false |

#### Usage Examples

**Basic Setup**:
```bash
deno run --allow-all src/scripts/setup-turbo-cache.ts --team my-team --token xxx
```

**With Custom Timeout**:
```bash
deno run --allow-all src/scripts/setup-turbo-cache.ts --team my-team --token xxx --timeout 120000
```

**Show Cache Statistics**:
```bash
deno run --allow-all src/scripts/setup-turbo-cache.ts --team my-team --token xxx --stats
```

**Environment Variables**:
```bash
export TURBO_TEAM=my-team
export TURBO_TOKEN=xxx
deno run --allow-all src/scripts/setup-turbo-cache.ts
```

### Integration with CI/CD

#### GitHub Actions

```yaml
- name: Setup Turbo Cache
  run: |
    deno run --allow-all src/packages/build-system/src/scripts/setup-turbo-cache.ts \
      --team ${{ secrets.TURBO_TEAM }} \
      --token ${{ secrets.TURBO_TOKEN }}
  env:
    TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
    TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
```

#### Vercel Configuration

The script automatically configures Vercel environment variables:

```json
{
  "build": {
    "env": {
      "TURBO_TEAM": "@turbo-team",
      "TURBO_TOKEN": "@turbo-token",
      "TURBO_REMOTE_CACHE_SIGNATURE_KEY": "@turbo-cache-key"
    }
  }
}
```

## Script Integration

### Workflow Integration

All three scripts work together to provide a comprehensive build system:

1. **setup-turbo-cache.ts** - Configure remote caching (one-time setup)
2. **unified-runner.ts** - Main development and build operations
3. **tauri-builder.ts** - Platform-specific native builds

### Example Complete Workflow

```bash
# 1. Initial setup
deno run --allow-all src/scripts/setup-turbo-cache.ts --team my-team --token xxx

# 2. Install dependencies
deno run --allow-all src/scripts/unified-runner.ts --install

# 3. Development
deno run --allow-all src/scripts/unified-runner.ts --task dev

# 4. Build for web
deno run --allow-all src/scripts/unified-runner.ts --task build:web

# 5. Build desktop app
deno run --allow-all src/scripts/tauri-builder.ts --build --platform desktop

# 6. Build mobile app
deno run --allow-all src/scripts/tauri-builder.ts --build --platform mobile
```

### Error Handling

All scripts include comprehensive error handling:

```typescript
try {
  await builder.build();
} catch (error) {
  console.error(`❌ Build failed: ${error.message}`);
  if (config.verbose) {
    console.error(error.stack);
  }
  Deno.exit(1);
}
```

### Logging and Output

The scripts provide consistent, colored output:

```typescript
console.log(colors.cyan('🚀 Katalyst Build System'));
console.log(colors.blue('📦 Installing dependencies...'));
console.log(colors.green('✅ Build completed successfully'));
console.log(colors.red('❌ Build failed'));
console.log(colors.yellow('⚠️  Warning message'));
```

This comprehensive script system provides developers with powerful, flexible tools for managing complex multi-platform builds while maintaining excellent developer experience and build performance.
