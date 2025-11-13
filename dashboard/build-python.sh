#!/bin/bash
# Build script for Python components with GitHub tools integration for Vercel deployment

set -e

echo "🐍 Building Python environment with GitHub tools for Vercel..."

# Check if uvx is available
if ! command -v uvx &> /dev/null; then
    echo "📦 Installing uvx..."
    pip install uvx
fi

# Create api/python directory structure
mkdir -p api/python

# Create GitHub Copilot CLI integration
echo "🤖 Creating GitHub Copilot CLI integration..."
cat > api/python/copilot_bridge.py << 'EOF'
#!/usr/bin/env python3
"""
GitHub Copilot CLI integration bridge for Katalyst
Provides AI-powered development assistance via Vercel Edge Functions
"""

import os
import sys
import json
import subprocess
import asyncio
from typing import Dict, Any, Optional, List
from pathlib import Path

class CopilotBridge:
    def __init__(self):
        self.copilot_available = self._check_copilot_cli()
        self.spec_kit_available = self._check_spec_kit()
        self.goose_tools_available = self._check_goose_tools()
    
    def _check_copilot_cli(self) -> bool:
        """Check if GitHub Copilot CLI is available."""
        try:
            result = subprocess.run(
                ['gh', 'copilot', '--help'], 
                capture_output=True, 
                text=True, 
                timeout=10
            )
            return result.returncode == 0
        except (subprocess.TimeoutExpired, FileNotFoundError):
            return False
    
    def _check_spec_kit(self) -> bool:
        """Check if GitHub Spec Kit is available."""
        try:
            result = subprocess.run(
                ['gh', 'spec', '--help'], 
                capture_output=True, 
                text=True, 
                timeout=10
            )
            return result.returncode == 0
        except (subprocess.TimeoutExpired, FileNotFoundError):
            return False
    
    def _check_goose_tools(self) -> bool:
        """Check if Goose IDE tools are available."""
        return os.path.exists('/usr/local/bin/goose') or os.path.exists(os.path.expanduser('~/.local/bin/goose'))
    
    async def execute_copilot_command(self, command: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute GitHub Copilot CLI command."""
        if not self.copilot_available:
            return {
                "error": "GitHub Copilot CLI not available. Install with: gh extension install github/gh-copilot"
            }
        
        try:
            # Prepare copilot command
            cmd = ['gh', 'copilot'] + command.split()
            
            # Add context if provided
            if context:
                if 'file' in context:
                    cmd.extend(['--file', context['file']])
                if 'line' in context:
                    cmd.extend(['--line', str(context['line'])])
            
            # Execute command
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30,
                cwd=context.get('working_directory', os.getcwd())
            )
            
            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr if result.returncode != 0 else None,
                "command": ' '.join(cmd)
            }
            
        except subprocess.TimeoutExpired:
            return {"error": "Command timed out", "command": command}
        except Exception as e:
            return {"error": str(e), "command": command}
    
    async def generate_spec(self, requirement: str, project_type: str = "webapp") -> Dict[str, Any]:
        """Generate specification using GitHub Spec Kit."""
        if not self.spec_kit_available:
            return {
                "error": "GitHub Spec Kit not available. Install with: gh extension install github/spec-kit"
            }
        
        try:
            cmd = ['gh', 'spec', 'generate', '--type', project_type, requirement]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                # Parse the generated spec
                spec_data = json.loads(result.stdout) if result.stdout.strip().startswith('{') else {"raw": result.stdout}
                return {"success": True, "spec": spec_data}
            else:
                return {"error": result.stderr, "command": ' '.join(cmd)}
                
        except subprocess.TimeoutExpired:
            return {"error": "Spec generation timed out"}
        except Exception as e:
            return {"error": str(e)}
    
    async def execute_goose_command(self, command: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
        """Execute Goose IDE command."""
        if not self.goose_tools_available:
            return {
                "error": "Goose IDE tools not available. Please install Goose IDE."
            }
        
        try:
            # Prepare goose command
            goose_cmd = ['goose'] + command.split()
            
            # Add parameters
            if params:
                for key, value in params.items():
                    goose_cmd.extend([f'--{key}', str(value)])
            
            result = subprocess.run(
                goose_cmd,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            return {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr if result.returncode != 0 else None,
                "command": ' '.join(goose_cmd)
            }
            
        except subprocess.TimeoutExpired:
            return {"error": "Goose command timed out", "command": command}
        except Exception as e:
            return {"error": str(e), "command": command}
    
    async def get_ai_suggestions(self, code: str, language: str = "python") -> Dict[str, Any]:
        """Get AI-powered code suggestions."""
        if not self.copilot_available:
            return {"error": "GitHub Copilot CLI not available"}
        
        try:
            # Write code to temporary file
            temp_file = Path('/tmp/copilot_suggestion.py')
            temp_file.write_text(code)
            
            # Get suggestions
            result = await self.execute_copilot_command(
                f"suggest --language {language}",
                {"file": str(temp_file)}
            )
            
            # Clean up
            temp_file.unlink(missing_ok=True)
            
            return result
            
        except Exception as e:
            return {"error": str(e)}
    
    async def analyze_repository(self, repo_path: str = None) -> Dict[str, Any]:
        """Analyze repository with AI assistance."""
        if not self.copilot_available:
            return {"error": "GitHub Copilot CLI not available"}
        
        try:
            repo_path = repo_path or os.getcwd()
            
            # Get repository overview
            result = await self.execute_copilot_command(
                "analyze --repo-overview",
                {"working_directory": repo_path}
            )
            
            return result
            
        except Exception as e:
            return {"error": str(e)}
    
    def get_available_tools(self) -> Dict[str, bool]:
        """Get status of available GitHub tools."""
        return {
            "github_cli": bool(subprocess.run(['gh', '--version'], capture_output=True).returncode == 0),
            "copilot_cli": self.copilot_available,
            "spec_kit": self.spec_kit_available,
            "goose_ide": self.goose_tools_available
        }

# Global copilot bridge instance
copilot_bridge = CopilotBridge()

async def handle_request(request: Dict[str, Any]) -> Dict[str, Any]:
    """Handle incoming requests for GitHub tools."""
    action = request.get("action")
    params = request.get("params", {})
    
    if action == "copilot_execute":
        return await copilot_bridge.execute_copilot_command(
            params.get("command", ""),
            params.get("context", {})
        )
    
    elif action == "generate_spec":
        return await copilot_bridge.generate_spec(
            params.get("requirement", ""),
            params.get("project_type", "webapp")
        )
    
    elif action == "goose_execute":
        return await copilot_bridge.execute_goose_command(
            params.get("command", ""),
            params.get("params", {})
        )
    
    elif action == "get_suggestions":
        return await copilot_bridge.get_ai_suggestions(
            params.get("code", ""),
            params.get("language", "python")
        )
    
    elif action == "analyze_repo":
        return await copilot_bridge.analyze_repository(
            params.get("repo_path")
        )
    
    elif action == "get_tools_status":
        return {"tools": copilot_bridge.get_available_tools()}
    
    else:
        return {"error": f"Unknown action: {action}"}

if __name__ == "__main__":
    import asyncio
    
    # Test the bridge
    async def test():
        result = await handle_request({
            "action": "get_tools_status"
        })
        print(json.dumps(result, indent=2))
    
    asyncio.run(test())
EOF

# Create requirements.txt for GitHub tools
echo "📝 Creating requirements.txt for GitHub tools..."
cat > api/python/requirements.txt << 'EOF'
# GitHub tools integration for Katalyst
fastapi>=0.104.0
uvicorn>=0.24.0
pydantic>=2.5.0
httpx>=0.25.0
mangum>=0.17.0
aiofiles>=23.0.0
python-multipart>=0.0.6

# GitHub CLI integration
PyGithub>=2.1.1
gitpython>=3.1.40

# Development tools
black>=23.0.0
ruff>=0.1.0
mypy>=1.7.0

# Documentation and specs
jinja2>=3.1.0
markdown>=3.5.0
pyyaml>=6.0.1
EOF

# Create uvx configuration with GitHub tools
echo "🔒 Creating uvx configuration for GitHub tools..."
cat > api/python/pyproject.toml << 'EOF'
[project]
name = "katalyst-github-tools"
version = "0.1.0"
description = "GitHub tools integration for Katalyst - Copilot CLI, Spec Kit, Goose IDE"
requires-python = ">=3.10"
dependencies = [
    "fastapi>=0.104.0",
    "uvicorn>=0.24.0",
    "pydantic>=2.5.0",
    "httpx>=0.25.0",
    "mangum>=0.17.0",
    "aiofiles>=23.0.0",
    "python-multipart>=0.0.6",
    "PyGithub>=2.1.1",
    "gitpython>=3.1.40",
    "black>=23.0.0",
    "ruff>=0.1.0",
    "mypy>=1.7.0",
    "jinja2>=3.1.0",
    "markdown>=3.5.0",
    "pyyaml>=6.0.1",
]

[tool.uv]
dev-dependencies = [
    "pytest>=7.0",
    "pytest-asyncio>=0.21",
    "pytest-cov>=4.1.0",
]

[tool.ruff]
line-length = 88
target-version = "py310"

[tool.black]
line-length = 88
target-version = ['py310']

[tool.mypy]
python_version = "3.10"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
EOF

# Create GitHub tools API wrapper
echo "🌐 Creating GitHub tools API wrapper..."
cat > api/python/github_api.py << 'EOF'
#!/usr/bin/env python3
"""
GitHub tools API wrapper for Katalyst
Integrates Copilot CLI, Spec Kit, and Goose IDE functionality
"""

import os
import sys
import json
import asyncio
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import aiofiles
from pathlib import Path

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

from copilot_bridge import handle_request, copilot_bridge

app = FastAPI(
    title="Katalyst GitHub Tools API",
    description="Integration with GitHub Copilot CLI, Spec Kit, and Goose IDE"
)

# Request models
class CopilotRequest(BaseModel):
    command: str
    context: Optional[Dict[str, Any]] = {}
    language: Optional[str] = "python"

class SpecRequest(BaseModel):
    requirement: str
    project_type: Optional[str] = "webapp"
    output_format: Optional[str] = "json"

class GooseRequest(BaseModel):
    command: str
    params: Optional[Dict[str, Any]] = {}
    working_directory: Optional[str] = None

class CodeSuggestionRequest(BaseModel):
    code: str
    language: Optional[str] = "python"
    context: Optional[str] = ""

class RepositoryAnalysisRequest(BaseModel):
    repo_path: Optional[str] = None
    include_readme: Optional[bool] = True
    include_dependencies: Optional[bool] = True

# Response models
class GitHubToolsResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}

@app.on_event("startup")
async def startup_event():
    """Initialize GitHub tools on startup."""
    print("🚀 Starting Katalyst GitHub Tools API...")
    
    # Check tool availability
    tools_status = copilot_bridge.get_available_tools()
    print(f"📊 Available tools: {json.dumps(tools_status, indent=2)}")
    
    # Warn about missing tools
    missing_tools = [tool for tool, available in tools_status.items() if not available]
    if missing_tools:
        print(f"⚠️  Missing tools: {', '.join(missing_tools)}")
        print("💡 Install missing tools for full functionality:")
        if not tools_status.get('copilot_cli'):
            print("   - gh extension install github/gh-copilot")
        if not tools_status.get('spec_kit'):
            print("   - gh extension install github/spec-kit")
        if not tools_status.get('goose_ide'):
            print("   - Install Goose IDE")

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Katalyst GitHub Tools API",
        "version": "1.0.0",
        "tools": copilot_bridge.get_available_tools(),
        "endpoints": {
            "copilot": "/copilot/execute",
            "spec": "/spec/generate",
            "goose": "/goose/execute",
            "suggestions": "/suggestions/code",
            "analysis": "/analysis/repository",
            "status": "/status/tools"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    tools_status = copilot_bridge.get_available_tools()
    healthy = any(tools_status.values())
    
    return {
        "status": "healthy" if healthy else "degraded",
        "service": "github-tools-api",
        "tools": tools_status,
        "healthy_tools": [tool for tool, available in tools_status.items() if available]
    }

@app.get("/status/tools")
async def get_tools_status():
    """Get detailed status of all GitHub tools."""
    tools_status = copilot_bridge.get_available_tools()
    
    # Get version information for available tools
    versions = {}
    
    if tools_status.get('github_cli'):
        try:
            import subprocess
            result = subprocess.run(['gh', '--version'], capture_output=True, text=True)
            versions['github_cli'] = result.stdout.strip()
        except:
            versions['github_cli'] = "unknown"
    
    return {
        "tools": tools_status,
        "versions": versions,
        "recommendations": {
            "copilot_cli": "gh extension install github/gh-copilot" if not tools_status.get('copilot_cli') else "installed",
            "spec_kit": "gh extension install github/spec-kit" if not tools_status.get('spec_kit') else "installed",
            "goose_ide": "Install Goose IDE from https://goose-ide.com" if not tools_status.get('goose_ide') else "installed"
        }
    }

@app.post("/copilot/execute", response_model=GitHubToolsResponse)
async def execute_copilot_command(request: CopilotRequest):
    """Execute GitHub Copilot CLI command."""
    try:
        response = await copilot_bridge.execute_copilot_command(
            request.command,
            request.context
        )
        
        return GitHubToolsResponse(
            success=response.get("success", False),
            data=response.get("output"),
            error=response.get("error"),
            metadata={
                "command": response.get("command"),
                "tool": "copilot_cli"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/spec/generate", response_model=GitHubToolsResponse)
async def generate_specification(request: SpecRequest):
    """Generate specification using GitHub Spec Kit."""
    try:
        response = await copilot_bridge.generate_spec(
            request.requirement,
            request.project_type
        )
        
        return GitHubToolsResponse(
            success=response.get("success", False),
            data=response.get("spec"),
            error=response.get("error"),
            metadata={
                "requirement": request.requirement,
                "project_type": request.project_type,
                "tool": "spec_kit"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/goose/execute", response_model=GitHubToolsResponse)
async def execute_goose_command(request: GooseRequest):
    """Execute Goose IDE command."""
    try:
        response = await copilot_bridge.execute_goose_command(
            request.command,
            request.params
        )
        
        return GitHubToolsResponse(
            success=response.get("success", False),
            data=response.get("output"),
            error=response.get("error"),
            metadata={
                "command": response.get("command"),
                "tool": "goose_ide"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/suggestions/code", response_model=GitHubToolsResponse)
async def get_code_suggestions(request: CodeSuggestionRequest):
    """Get AI-powered code suggestions."""
    try:
        response = await copilot_bridge.get_ai_suggestions(
            request.code,
            request.language
        )
        
        return GitHubToolsResponse(
            success=response.get("success", False),
            data=response.get("output"),
            error=response.get("error"),
            metadata={
                "language": request.language,
                "code_length": len(request.code),
                "tool": "copilot_cli"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analysis/repository", response_model=GitHubToolsResponse)
async def analyze_repository(request: RepositoryAnalysisRequest):
    """Analyze repository with AI assistance."""
    try:
        response = await copilot_bridge.analyze_repository(request.repo_path)
        
        return GitHubToolsResponse(
            success=response.get("success", False),
            data=response.get("output"),
            error=response.get("error"),
            metadata={
                "repo_path": request.repo_path or os.getcwd(),
                "tool": "copilot_cli"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Development workflow endpoints
@app.post("/workflow/setup-project", response_model=GitHubToolsResponse)
async def setup_project_workflow(
    project_name: str,
    project_type: str = "webapp",
    include_github_actions: bool = True
):
    """Set up a new project with GitHub tools integration."""
    try:
        workflow_steps = []
        
        # 1. Generate project specification
        spec_response = await copilot_bridge.generate_spec(
            f"Create a {project_type} called {project_name}",
            project_type
        )
        workflow_steps.append({
            "step": "spec_generation",
            "success": spec_response.get("success", False),
            "data": spec_response.get("spec")
        })
        
        # 2. Create project structure (if Goose IDE is available)
        if copilot_bridge.goose_tools_available:
            goose_response = await copilot_bridge.execute_goose_command(
                f"create project --name {project_name} --type {project_type}"
            )
            workflow_steps.append({
                "step": "project_creation",
                "success": goose_response.get("success", False),
                "data": goose_response.get("output")
            })
        
        # 3. Initialize git repository (if GitHub CLI is available)
        if copilot_bridge.copilot_available:
            git_response = await copilot_bridge.execute_copilot_command(
                "init-git --template=standard",
                {"working_directory": f"./{project_name}"}
            )
            workflow_steps.append({
                "step": "git_init",
                "success": git_response.get("success", False),
                "data": git_response.get("output")
            })
        
        return GitHubToolsResponse(
            success=True,
            data={
                "project_name": project_name,
                "project_type": project_type,
                "workflow_steps": workflow_steps
            },
            metadata={
                "workflow": "project_setup",
                "tools_used": ["spec_kit", "goose_ide", "copilot_cli"]
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Vercel serverless function handler
def handler(request):
    """Vercel serverless function handler."""
    from mangum import Mangum
    return Mangum(app)(request)

# Export for Vercel
app_handler = handler

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF

# Create Vercel configuration for Python
echo "⚙️ Creating Vercel configuration for Python..."
cat > api/python/vercel.json << 'EOF'
{
  "runtime": "python3.11",
  "maxDuration": 30,
  "memory": 1024,
  "includeFiles": ["*.py", "*.txt", "*.toml"],
  "excludeFiles": ["__pycache__/**", "*.pyc"],
  "environment": {
    "PYTHONPATH": "/var/task",
    "PYTHONUNBUFFERED": "1"
  }
}
EOF

echo "✅ Python build complete!"
echo "📂 Built files are in api/python/"
echo ""
echo "🚀 To use in Vercel:"
echo "   Python bridge available at /api/python/execute"
echo "   Health check at /api/python/health"
