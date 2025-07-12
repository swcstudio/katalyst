#!/bin/bash

# Katalyst Repository Setup Script
# This script sets up the development environment for the Katalyst React 19 Framework

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."

    local missing_deps=()

    if ! command_exists node; then
        missing_deps+=("Node.js 18+")
    else
        node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -lt 18 ]; then
            missing_deps+=("Node.js 18+ (current: $(node --version))")
        fi
    fi

    if ! command_exists deno; then
        missing_deps+=("Deno 2.0+")
    fi

    if ! command_exists git; then
        missing_deps+=("Git")
    fi

    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing prerequisites:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo "Please install the missing dependencies and run this script again."
        exit 1
    fi

    print_success "All prerequisites are installed!"
}

# Setup git configuration
setup_git() {
    print_status "Setting up Git configuration..."

    if [ -z "$(git config --global user.name)" ]; then
        read -p "Enter your Git username: " git_username
        git config --global user.name "$git_username"
    fi

    if [ -z "$(git config --global user.email)" ]; then
        read -p "Enter your Git email: " git_email
        git config --global user.email "$git_email"
    fi

    # Set up local repository configuration
    git config user.name "$(git config --global user.name)"
    git config user.email "$(git config --global user.email)"

    print_success "Git configuration completed!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."

    if command_exists bun; then
        print_status "Using Bun for package installation..."
        bun install
    elif command_exists pnpm; then
        print_status "Using pnpm for package installation..."
        pnpm install
    else
        print_status "Using npm for package installation..."
        npm install
    fi

    print_success "Dependencies installed successfully!"
}

# Setup development environment
setup_dev_environment() {
    print_status "Setting up development environment..."

    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        print_status "Creating .env file..."
        cat > .env << EOF
# Katalyst Development Environment
NODE_ENV=development

# Ports for different variants
CORE_PORT=3000
REMIX_PORT=3001
NEXTJS_PORT=3002

# API Configuration
API_URL=http://localhost:4000

# Feature Flags
ENABLE_STORYBOOK=true
ENABLE_TESTING=true
EOF
        print_success ".env file created!"
    else
        print_warning ".env file already exists, skipping creation."
    fi

    # Setup VSCode settings if .vscode directory doesn't exist
    if [ ! -d ".vscode" ]; then
        print_status "Setting up VSCode configuration..."
        mkdir -p .vscode

        cat > .vscode/settings.json << EOF
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["classnames\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
EOF

        cat > .vscode/extensions.json << EOF
{
  "recommendations": [
    "biomejs.biome",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-playwright.playwright"
  ]
}
EOF
        print_success "VSCode configuration created!"
    else
        print_warning ".vscode directory already exists, skipping setup."
    fi
}

# Run initial checks
run_initial_checks() {
    print_status "Running initial checks..."

    # Type checking
    if command_exists tsc; then
        print_status "Running TypeScript type checking..."
        npm run typecheck || print_warning "Type checking found issues. Review and fix them when convenient."
    fi

    # Linting
    if command_exists biome; then
        print_status "Running Biome linting..."
        npm run lint || print_warning "Linting found issues. Review and fix them when convenient."
    fi

    print_success "Initial checks completed!"
}

# Display helpful information
display_info() {
    echo ""
    echo "🚀 Katalyst React 19 Framework Setup Complete!"
    echo ""
    echo "📁 Repository Structure:"
    echo "  ├── core/      - Pure React web application"
    echo "  ├── remix/     - Admin dashboard variant"
    echo "  ├── nextjs/    - Marketing website variant"
    echo "  └── shared/    - Common utilities and integrations"
    echo ""
    echo "🛠️  Available Commands:"
    echo "  npm run dev           - Start all variants"
    echo "  npm run dev:core      - Start core variant (port 3000)"
    echo "  npm run dev:remix     - Start remix variant (port 3001)"
    echo "  npm run dev:nextjs    - Start nextjs variant (port 3002)"
    echo "  npm run build         - Build all variants"
    echo "  npm run test          - Run tests"
    echo "  npm run storybook     - Start Storybook"
    echo ""
    echo "📚 Documentation:"
    echo "  - README.md          - Project overview"
    echo "  - CONTRIBUTING.md    - Contribution guidelines"
    echo "  - docs/              - Detailed documentation"
    echo ""
    echo "🌐 Repository: https://github.com/swcstudio/katalyst"
    echo ""
    echo "Happy coding! 🎉"
}

# Main execution
main() {
    echo "🔧 Katalyst Repository Setup"
    echo "=============================="
    echo ""

    check_prerequisites
    setup_git
    install_dependencies
    setup_dev_environment
    run_initial_checks
    display_info
}

# Run main function
main "$@"
