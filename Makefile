# Katalyst Framework Makefile
# Unified build system orchestrating Deno, Bun, NX, and Turborepo

.PHONY: help install dev build test lint clean deploy status
.DEFAULT_GOAL := help

# Configuration
DENO := deno run --allow-all
UNIFIED_RUNNER := scripts/unified-runner.ts
BUN_FALLBACK := bun
NODE_FALLBACK := npm

# Colors for output
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

##@ General Commands

help: ## Display this help message
	@echo "$(CYAN)🚀 Katalyst Framework - Unified Build System$(RESET)"
	@echo "$(CYAN)==============================================$(RESET)"
	@echo ""
	@echo "$(GREEN)Available commands:$(RESET)"
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { printf "  $(CYAN)%-20s$(RESET) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(RESET)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(GREEN)Package Managers:$(RESET) Deno (primary), Bun (fallback)"
	@echo "$(GREEN)Task Runners:$(RESET) Turborepo (primary), NX (fallback)"
	@echo "$(GREEN)Frameworks:$(RESET) Core (TanStack), Remix (Admin), Next.js (Marketing)"

status: ## Show system status and capabilities
	@$(DENO) $(UNIFIED_RUNNER) --status

##@ Installation & Setup

install: ## Install dependencies (Deno primary, Bun fallback)
	@echo "$(CYAN)📦 Installing dependencies...$(RESET)"
	@$(DENO) $(UNIFIED_RUNNER) --install || $(MAKE) install-fallback

install-fallback: ## Install using Bun fallback
	@echo "$(YELLOW)🔄 Using Bun fallback...$(RESET)"
	@$(BUN_FALLBACK) install || npm install

install-force: ## Force reinstall all dependencies
	@$(MAKE) clean-deps
	@$(MAKE) install

setup: ## Initial project setup with cloud caching
	@echo "$(CYAN)⚙️  Setting up Katalyst Framework...$(RESET)"
	@$(MAKE) install
	@$(MAKE) cache-setup
	@$(MAKE) status

cache-setup: ## Setup cloud caching for Turbo and NX
	@echo "$(CYAN)☁️  Setting up cloud caching...$(RESET)"
	@$(DENO) $(UNIFIED_RUNNER) --cloud-cache

##@ Development

dev: ## Start development servers for all frameworks
	@echo "$(CYAN)🚀 Starting development servers...$(RESET)"
	@$(DENO) $(UNIFIED_RUNNER) --task dev

dev-core: ## Start Core framework development server
	@$(DENO) $(UNIFIED_RUNNER) --task dev:core

dev-remix: ## Start Remix admin development server
	@$(DENO) $(UNIFIED_RUNNER) --task dev:remix

dev-nextjs: ## Start Next.js marketing development server
	@$(DENO) $(UNIFIED_RUNNER) --task dev:nextjs

##@ Building

build: ## Build all frameworks with cloud caching
	@echo "$(CYAN)🏗️  Building all frameworks...$(RESET)"
	@$(DENO) $(UNIFIED_RUNNER) --task build --cloud-cache

build-web: ## Build for web platforms
	@$(DENO) $(UNIFIED_RUNNER) --task build:web --platforms web

build-desktop: ## Build for desktop platforms
	@$(DENO) $(UNIFIED_RUNNER) --task build:desktop --platforms desktop

build-mobile: ## Build for mobile platforms
	@$(DENO) $(UNIFIED_RUNNER) --task build:mobile --platforms mobile

build-native: ## Build native Rust components
	@$(DENO) $(UNIFIED_RUNNER) --task build-native

build-all: ## Build for all platforms
	@echo "$(CYAN)🌍 Building for all platforms...$(RESET)"
	@$(MAKE) build-native
	@$(MAKE) build-web
	@$(MAKE) build-desktop
	@$(MAKE) build-mobile

build-core: ## Build Core framework only
	@$(DENO) $(UNIFIED_RUNNER) --task build --frameworks core

build-remix: ## Build Remix framework only
	@$(DENO) $(UNIFIED_RUNNER) --task build --frameworks remix

build-nextjs: ## Build Next.js framework only
	@$(DENO) $(UNIFIED_RUNNER) --task build --frameworks nextjs

##@ Testing

test: ## Run all tests using Deno test runner
	@echo "$(CYAN)🧪 Running all tests...$(RESET)"
	@$(DENO) $(UNIFIED_RUNNER) --task test

test-unit: ## Run unit tests only
	@$(DENO) $(UNIFIED_RUNNER) --task test:unit

test-integration: ## Run integration tests only
	@$(DENO) $(UNIFIED_RUNNER) --task test:integration

test-performance: ## Run performance tests only
	@$(DENO) $(UNIFIED_RUNNER) --task test:performance

test-e2e: ## Run end-to-end tests only
	@$(DENO) $(UNIFIED_RUNNER) --task test:e2e

test-coverage: ## Run tests with coverage report
	@$(DENO) tests/run-all.ts --coverage --reporter html
	@echo "$(GREEN)✅ Coverage report: tests/output/coverage/html/index.html$(RESET)"

test-watch: ## Run tests in watch mode
	@$(DENO) tests/run-all.ts --watch

test-ci: ## Run tests for CI/CD (with bail on failure)
	@$(DENO) tests/run-all.ts --coverage --reporter junit --bail

test-core: ## Run tests for Core framework
	@$(DENO) $(UNIFIED_RUNNER) --task test --frameworks core

test-remix: ## Run tests for Remix framework
	@$(DENO) $(UNIFIED_RUNNER) --task test --frameworks remix

test-nextjs: ## Run tests for Next.js framework
	@$(DENO) $(UNIFIED_RUNNER) --task test --frameworks nextjs

test-shared: ## Run tests for shared components
	@$(DENO) $(UNIFIED_RUNNER) --task test --frameworks shared

test-multithreading: ## Test multithreading and WebAssembly performance
	@$(DENO) tests/performance/multithreading.test.ts

##@ Code Quality

lint: ## Run linting across all frameworks
	@echo "$(CYAN)🔍 Running linters...$(RESET)"
	@$(DENO) $(UNIFIED_RUNNER) --task lint

lint-deno: ## Run Deno-specific linting
	@deno lint && deno fmt --check

lint-fix: ## Fix linting issues automatically
	@deno fmt
	@bunx biome check --apply .

typecheck: ## Run TypeScript type checking
	@$(DENO) $(UNIFIED_RUNNER) --task typecheck

typecheck-deno: ## Run Deno type checking
	@deno check **/*.ts

format: ## Format code using Deno formatter
	@deno fmt

format-check: ## Check code formatting
	@deno fmt --check

##@ Preview & Storybook

preview: ## Preview built applications
	@$(DENO) $(UNIFIED_RUNNER) --task preview

preview-core: ## Preview Core framework
	@$(DENO) $(UNIFIED_RUNNER) --task preview --frameworks core

preview-remix: ## Preview Remix framework
	@$(DENO) $(UNIFIED_RUNNER) --task preview --frameworks remix

preview-nextjs: ## Preview Next.js framework
	@$(DENO) $(UNIFIED_RUNNER) --task preview --frameworks nextjs

storybook: ## Start Storybook development server
	@storybook dev -p 6006

storybook-build: ## Build Storybook for production
	@storybook build

##@ Deployment

deploy: ## Deploy all frameworks
	@echo "$(CYAN)🚀 Deploying all frameworks...$(RESET)"
	@$(MAKE) build
	@$(DENO) $(UNIFIED_RUNNER) --task deploy

deploy-web: ## Deploy web applications
	@$(MAKE) build-web
	@$(DENO) $(UNIFIED_RUNNER) --task deploy --platforms web

deploy-desktop: ## Deploy desktop applications
	@$(MAKE) build-desktop
	@$(DENO) $(UNIFIED_RUNNER) --task deploy --platforms desktop

deploy-mobile: ## Deploy mobile applications
	@$(MAKE) build-mobile
	@$(DENO) $(UNIFIED_RUNNER) --task deploy --platforms mobile

##@ Cleaning

clean: ## Clean build artifacts and caches
	@echo "$(CYAN)🧹 Cleaning build artifacts...$(RESET)"
	@$(DENO) $(UNIFIED_RUNNER) --clean

clean-all: ## Deep clean everything including node_modules
	@echo "$(RED)🗑️  Deep cleaning everything...$(RESET)"
	@rm -rf dist .next .remix node_modules/.cache .turbo .nx coverage tests/output
	@rm -rf node_modules
	@rm -rf */node_modules
	@rm -rf bun.lockb package-lock.json yarn.lock

clean-deps: ## Clean dependency directories
	@rm -rf node_modules */node_modules bun.lockb package-lock.json yarn.lock

clean-build: ## Clean only build artifacts
	@rm -rf dist .next .remix */dist */build

clean-cache: ## Clean only cache directories
	@rm -rf node_modules/.cache .turbo .nx coverage tests/output

clean-test: ## Clean test artifacts
	@rm -rf tests/output tests/coverage .nyc_output coverage

##@ Tool-Specific Commands

# NX Commands
nx-build: ## Build using NX only
	@nx run-many --target=build --projects=core,remix,nextjs --parallel

nx-test: ## Test using NX only
	@nx run-many --target=test --projects=core,remix,nextjs,shared --parallel

nx-lint: ## Lint using NX only
	@nx run-many --target=lint --projects=core,remix,nextjs,shared --parallel

nx-reset: ## Reset NX cache
	@nx reset

# Turbo Commands
turbo-build: ## Build using Turbo only
	@turbo build

turbo-test: ## Test using Turbo only
	@turbo test

turbo-lint: ## Lint using Turbo only
	@turbo lint

turbo-prune: ## Prune Turbo cache
	@turbo prune

# Bun Commands
bun-install: ## Install using Bun only
	@$(BUN_FALLBACK) install

bun-build: ## Build using Bun only
	@$(BUN_FALLBACK) run build

bun-test: ## Test using Bun only
	@$(BUN_FALLBACK) test

bun-dev: ## Develop using Bun only
	@$(BUN_FALLBACK) run dev

##@ Utilities

check-env: ## Check environment and tool availability
	@echo "$(CYAN)🔍 Checking environment...$(RESET)"
	@command -v deno >/dev/null 2>&1 && echo "$(GREEN)✅ Deno$(RESET)" || echo "$(RED)❌ Deno$(RESET)"
	@command -v bun >/dev/null 2>&1 && echo "$(GREEN)✅ Bun$(RESET)" || echo "$(RED)❌ Bun$(RESET)"
	@command -v node >/dev/null 2>&1 && echo "$(GREEN)✅ Node.js$(RESET)" || echo "$(RED)❌ Node.js$(RESET)"
	@command -v nx >/dev/null 2>&1 && echo "$(GREEN)✅ NX$(RESET)" || echo "$(RED)❌ NX$(RESET)"
	@command -v turbo >/dev/null 2>&1 && echo "$(GREEN)✅ Turbo$(RESET)" || echo "$(RED)❌ Turbo$(RESET)"

doctor: ## Run comprehensive system diagnostics
	@echo "$(CYAN)🏥 Running system diagnostics...$(RESET)"
	@$(MAKE) check-env
	@$(MAKE) status
	@echo ""
	@echo "$(GREEN)Configuration files:$(RESET)"
	@ls -la deno.json package.json turbo.json nx.json 2>/dev/null || echo "$(YELLOW)Some config files missing$(RESET)"

benchmark: ## Run performance benchmarks
	@echo "$(CYAN)⚡ Running performance benchmarks...$(RESET)"
	@$(MAKE) test-performance
	@$(MAKE) test-multithreading

update: ## Update dependencies
	@echo "$(CYAN)⬆️  Updating dependencies...$(RESET)"
	@$(BUN_FALLBACK) update || npm update

security-audit: ## Run security audit
	@echo "$(CYAN)🔒 Running security audit...$(RESET)"
	@$(BUN_FALLBACK) audit || npm audit

##@ Advanced

# Advanced workflows
full-ci: ## Complete CI workflow
	@echo "$(CYAN)🔄 Running full CI workflow...$(RESET)"
	@$(MAKE) clean
	@$(MAKE) install
	@$(MAKE) lint
	@$(MAKE) typecheck
	@$(MAKE) test-ci
	@$(MAKE) build

release-prep: ## Prepare for release
	@echo "$(CYAN)📦 Preparing release...$(RESET)"
	@$(MAKE) full-ci
	@$(MAKE) build-all
	@echo "$(GREEN)✅ Release preparation complete$(RESET)"

dev-setup: ## Setup development environment
	@echo "$(CYAN)🛠️  Setting up development environment...$(RESET)"
	@$(MAKE) setup
	@$(MAKE) storybook &
	@$(MAKE) dev

# Parallel execution examples
parallel-test: ## Run tests in parallel across frameworks
	@echo "$(CYAN)⚡ Running parallel tests...$(RESET)"
	@$(MAKE) test-core & \
	 $(MAKE) test-remix & \
	 $(MAKE) test-nextjs & \
	 $(MAKE) test-shared & \
	 wait

parallel-build: ## Build frameworks in parallel
	@echo "$(CYAN)⚡ Building in parallel...$(RESET)"
	@$(MAKE) build-core & \
	 $(MAKE) build-remix & \
	 $(MAKE) build-nextjs & \
	 wait

# Documentation
docs: ## Generate documentation
	@echo "$(CYAN)📚 Generating documentation...$(RESET)"
	@deno doc --html --name="Katalyst Framework" shared/src/index.ts

# Debugging
debug-deno: ## Debug with Deno inspector
	@deno run --allow-all --inspect-brk $(UNIFIED_RUNNER) --status

debug-test: ## Debug tests with inspector
	@deno test --allow-all --inspect-brk tests/unit/

# Watch commands
watch-build: ## Watch and rebuild on changes
	@echo "$(CYAN)👀 Watching for changes...$(RESET)"
	@while true; do \
		inotifywait -r -e modify,create,delete . 2>/dev/null; \
		$(MAKE) build; \
	done

# Quick shortcuts
q-dev: dev ## Quick: Start development (alias)
q-build: build ## Quick: Build all (alias)
q-test: test ## Quick: Run tests (alias)
q-clean: clean ## Quick: Clean artifacts (alias)

##@ Examples

example-basic: ## Example: Basic development workflow
	@echo "$(GREEN)Example: Basic development workflow$(RESET)"
	@echo "  make install dev"

example-testing: ## Example: Complete testing workflow
	@echo "$(GREEN)Example: Complete testing workflow$(RESET)"
	@echo "  make test test-coverage test-e2e"

example-deployment: ## Example: Production deployment
	@echo "$(GREEN)Example: Production deployment$(RESET)"
	@echo "  make clean install build-all test-ci deploy"

example-debugging: ## Example: Debug failing tests
	@echo "$(GREEN)Example: Debug failing tests$(RESET)"
	@echo "  make test-watch or make debug-test"
