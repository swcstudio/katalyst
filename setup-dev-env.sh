#!/bin/bash
# Development environment setup for GitHub tools integration

set -e

echo "🛠️ Setting up development environment for GitHub tools integration..."

# Check for required tools
echo "🔍 Checking for required tools..."

# Check GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Installing..."
    
    # Detect OS and install GitHub CLI
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt update
        sudo apt install gh -y
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            brew install gh
        else
            echo "❌ Please install Homebrew first: https://brew.sh/"
            exit 1
        fi
    else
        echo "❌ Unsupported OS. Please install GitHub CLI manually: https://cli.github.com/"
        exit 1
    fi
else
    echo "✅ GitHub CLI found: $(gh --version | head -1)"
fi

# Check for uvx (Python package runner)
if ! command -v uvx &> /dev/null; then
    echo "📦 Installing uvx..."
    pip install uvx
else
    echo "✅ uvx found: $(uvx --version)"
fi

# Check for Node.js (required for some tools)
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js: https://nodejs.org/"
    exit 1
else
    echo "✅ Node.js found: $(node --version)"
fi

# Check for VS Code (optional but recommended)
if command -v code &> /dev/null; then
    echo "✅ VS Code found: $(code --version | head -1)"
    
    # Install recommended VS Code extensions
    echo "🔧 Installing recommended VS Code extensions..."
    
    # GitHub extensions
    code --install-extension GitHub.copilot || echo "⚠️ GitHub Copilot extension already installed or failed"
    code --install-extension GitHub.copilot-chat || echo "⚠️ GitHub Copilot Chat extension already installed or failed"
    code --install-extension GitHub.vscode-pull-request-github || echo "⚠️ GitHub Pull Requests extension already installed or failed"
    
    # Python extensions
    code --install-extension ms-python.python || echo "⚠️ Python extension already installed or failed"
    code --install-extension ms-python.black-formatter || echo "⚠️ Black formatter extension already installed or failed"
    code --install-extension ms-python.ruff || echo "⚠️ Ruff extension already installed or failed"
    
    # Rust extensions
    code --install-extension rust-lang.rust-analyzer || echo "⚠️ Rust Analyzer extension already installed or failed"
    
    # Elixir extensions
    code --install-extension PhoenixFramework.phoenix || echo "⚠️ Phoenix extension already installed or failed"
    code --install-extension elixir-lsp.elixir-lsp || echo "⚠️ Elixir LSP extension already installed or failed"
    
    # Docker extensions
    code --install-extension ms-azuretools.vscode-docker || echo "⚠️ Docker extension already installed or failed"
    
else
    echo "⚠️ VS Code not found. Recommended for optimal development experience."
    echo "💡 Install VS Code: https://code.visualstudio.com/"
fi

# Install GitHub CLI extensions
echo "🔧 Installing GitHub CLI extensions..."

# Install Copilot CLI extension
echo "🤖 Installing GitHub Copilot CLI extension..."
gh extension install github/gh-copilot || echo "⚠️ GitHub Copilot CLI extension already installed or failed"

# Install Spec Kit extension
echo "📋 Installing GitHub Spec Kit extension..."
gh extension install github/spec-kit || echo "⚠️ GitHub Spec Kit extension already installed or failed"

# Authenticate with GitHub CLI if not already authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub CLI:"
    gh auth login
else
    echo "✅ GitHub CLI authenticated"
fi

# Set up development workspace
echo "📁 Setting up development workspace..."

# Create development directories
mkdir -p workspace/{projects,specs,docs,scripts}
mkdir -p .github/{workflows,templates,ISSUE_TEMPLATE}

# Create development configuration files
echo "⚙️ Creating development configuration files..."

# VS Code workspace settings
cat > .vscode/settings.json << 'EOF'
{
    "python.defaultInterpreterPath": "./.venv/bin/python",
    "python.formatting.provider": "black",
    "python.linting.enabled": true,
    "python.linting.ruffEnabled": true,
    "python.linting.mypyEnabled": true,
    "rust-analyzer.checkOnSave.command": "clippy",
    "elixirLS.path": "/path/to/elixir-ls/language_server.sh",
    "files.exclude": {
        "**/__pycache__": true,
        "**/.pytest_cache": true,
        "**/_build": true,
        "**/deps": true,
        "**/node_modules": true,
        "**/target": true
    },
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.organizeImports": true
    }
}
EOF

# VS Code launch configurations
cat > .vscode/launch.json << 'EOF'
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: GitHub Tools API",
            "type": "python",
            "request": "launch",
            "program": "${workspaceFolder}/api/python/github_api.py",
            "console": "integratedTerminal",
            "env": {
                "PYTHONPATH": "${workspaceFolder}/api/python"
            }
        },
        {
            "name": "Elixir: Phoenix Server",
            "type": "mix_task",
            "request": "launch",
            "task": "phx.server",
            "projectDir": "${workspaceFolder}/api/elixir"
        }
    ]
}
EOF

# VS Code tasks
cat > .vscode/tasks.json << 'EOF'
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build All Components",
            "type": "shell",
            "command": "./build-all.sh",
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "shared"
            }
        },
        {
            "label": "Start GitHub Tools API",
            "type": "shell",
            "command": "python",
            "args": ["api/python/github_api.py"],
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "always",
                "focus": false,
                "panel": "dedicated"
            }
        },
        {
            "label": "Test GitHub Tools",
            "type": "shell",
            "command": "gh",
            "args": ["copilot", "--help"],
            "group": "test"
        }
    ]
}
EOF

# Create development scripts
echo "📜 Creating development scripts..."

# Quick test script
cat > scripts/test-github-tools.sh << 'EOF'
#!/bin/bash
# Test GitHub tools integration

echo "🧪 Testing GitHub tools integration..."

# Test GitHub CLI
echo "📋 Testing GitHub CLI..."
gh --version

# Test Copilot CLI
echo "🤖 Testing GitHub Copilot CLI..."
gh copilot --help || echo "❌ GitHub Copilot CLI not available"

# Test Spec Kit
echo "📋 Testing GitHub Spec Kit..."
gh spec --help || echo "❌ GitHub Spec Kit not available"

# Test Python environment
echo "🐍 Testing Python environment..."
python --version
pip list | grep -E "(fastapi|uvicorn|pydantic)"

echo "✅ Testing complete!"
EOF

chmod +x scripts/test-github-tools.sh

# Project creation script
cat > scripts/create-project.sh << 'EOF'
#!/bin/bash
# Create a new project with GitHub tools integration

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <project-name> [project-type]"
    echo "Example: $0 my-webapp webapp"
    exit 1
fi

PROJECT_NAME=$1
PROJECT_TYPE=${2:-"webapp"}

echo "🚀 Creating new project: $PROJECT_NAME (type: $PROJECT_TYPE)"

# Create project directory
mkdir -p "workspace/projects/$PROJECT_NAME"
cd "workspace/projects/$PROJECT_NAME"

# Generate specification using GitHub Spec Kit
echo "📋 Generating project specification..."
gh spec generate --type "$PROJECT_TYPE" "Create a $PROJECT_TYPE called $PROJECT_NAME" > spec.json

# Initialize git repository
echo "🔧 Initializing git repository..."
git init

# Create basic project structure
echo "📁 Creating project structure..."
mkdir -p {src,tests,docs,scripts}

# Create README
cat > README.md << PROJECT_EOF
# $PROJECT_NAME

$PROJECT_TYPE project created with GitHub tools integration.

## Specification

Generated specification is available in \`spec.json\`.

## Development

This project is set up with GitHub tools integration:

- GitHub Copilot CLI for AI assistance
- GitHub Spec Kit for specification management
- Goose IDE for enhanced development experience

## Getting Started

1. Install dependencies
2. Run development server
3. Start building!

## Resources

- [GitHub Copilot CLI Documentation](https://cli.github.com/manual/gh_copilot)
- [GitHub Spec Kit Documentation](https://github.com/github/spec-kit)
- [Goose IDE Documentation](https://goose-ide.com)
PROJECT_EOF

echo "✅ Project created successfully!"
echo "📂 Project location: $(pwd)"
echo "🎯 Next steps:"
echo "   1. Review the specification in spec.json"
echo "   2. Customize the project structure"
echo "   3. Start development with GitHub tools!"
EOF

chmod +x scripts/create-project.sh

# Create Git configuration
echo "🔧 Creating Git configuration..."

cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# Virtual environments
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Rust
target/
Cargo.lock

# Elixir
_build/
deps/
*.beam
*.dump

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# API Keys and secrets
.env.local
.env.development.local
.env.test.local
.env.production.local
*.key
*.pem
EOF

# GitHub workflows
echo "🔄 Creating GitHub workflows..."

cat > .github/workflows/github-tools.yml << 'EOF'
name: GitHub Tools Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-github-tools:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        pip install fastapi uvicorn pydantic
        pip install PyGithub gitpython
    
    - name: Set up GitHub CLI
      uses: github/setup-gh-cli@v2
    
    - name: Install GitHub CLI extensions
      run: |
        gh extension install github/gh-copilot
        gh extension install github/spec-kit
    
    - name: Test GitHub tools integration
      run: |
        ./scripts/test-github-tools.sh
    
    - name: Build project
      run: |
        ./build-all.sh

  deploy:
    needs: test-github-tools
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
EOF

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Run './scripts/test-github-tools.sh' to verify installation"
echo "   2. Create a new project with './scripts/create-project.sh my-project'"
echo "   3. Start development with 'code .' to open VS Code"
echo "   4. Run 'vercel dev' to start local development server"
echo ""
echo "📚 Useful commands:"
echo "   - gh copilot --help    # GitHub Copilot CLI"
echo "   - gh spec --help       # GitHub Spec Kit"
echo "   - ./build-all.sh       # Build all components"
echo "   - vercel dev           # Start development server"
