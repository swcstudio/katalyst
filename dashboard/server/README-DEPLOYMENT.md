# Katalyst Server - Advanced Fly.io Deployment Guide

## 🚀 **Complete Production-Ready Setup**

This guide covers the advanced Fly.io configuration for Katalyst Server with Phoenix + Python + Claude Code SDK integration, featuring horizontal scaling, autoscaling, fault tolerance, monitoring, and everything needed for production.

## 📋 **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                        Fly.io Global Network                    │
├─────────────────────────────────────────────────────────────────┤
│  🌍 Multi-Region Deployment                                     │
│  ├── 🇺🇸 DFW (Dallas) - Primary: 2-8 machines                  │
│  ├── 🇺🇸 SJC (San Jose) - West Coast: 1-5 machines            │
│  ├── 🇺🇸 IAD (Ashburn) - East Coast: 1-5 machines             │
│  └── 🇬🇧 LHR (London) - Europe: 0-3 machines                   │
├─────────────────────────────────────────────────────────────────┤
│  📊 Load Balancing & Health Checks                              │
│  ├── HTTP/HTTPS (80/443) - Phoenix Web Server                  │
│  ├── WebSocket (4000) - LiveView & Real-time                   │
│  └── Metrics (9091) - Prometheus Monitoring                    │
├─────────────────────────────────────────────────────────────────┤
│  🏗️  Application Stack (Per Machine)                           │
│  ├── 🔥 Phoenix Framework (Elixir/OTP)                          │
│  ├── 🐍 Python 3.12 + Claude Code SDK                          │
│  ├── 🦀 Rust NIFs (High-performance bindings)                   │
│  ├── 📦 Virtual Environment (.venv)                             │
│  └── 🔄 GenServer Session Management                            │
├─────────────────────────────────────────────────────────────────┤
│  🛡️  Security & Monitoring                                      │
│  ├── 🔐 Secrets Management                                       │
│  ├── 📈 Metrics & Alerting                                      │
│  ├── 🏥 Health Checks & Auto-restart                           │
│  └── 🔄 Blue-Green Deployments                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ **Features Implemented**

### ✅ **Horizontal Scaling & Autoscaling**
- **Multi-region deployment** across 4+ regions
- **Auto-scaling** based on CPU, memory, RPS, and response time
- **Manual scaling** with region-specific control
- **Load balancing** with connection limits

### ✅ **Fault Tolerance & Reliability**
- **Blue-green deployments** with zero downtime
- **Automatic rollback** on deployment failure
- **Health checks** for Phoenix, Claude Code, and Python bridge
- **Process restart policies** with exponential backoff

### ✅ **Performance Optimization**
- **Performance machines** (4 vCPU, 8GB RAM in primary)
- **Connection pooling** (2000 hard limit, 1500 soft limit)
- **HTTP/2 and TLS** with ALPN negotiation
- **Optimized Python** build with LTO and computed gotos

### ✅ **Monitoring & Observability**
- **Prometheus metrics** collection
- **Grafana dashboards** for visualization
- **Health check endpoints** (`/health`, `/api/claude/health`, `/ready`)
- **Structured logging** with JSON format

### ✅ **Security & Compliance**
- **Non-root user** execution (security)
- **Secrets management** with encrypted storage
- **TLS encryption** with modern ciphers
- **Security headers** and rate limiting

## 🔧 **Quick Start**

### 1. **Initial Setup**
```bash
# Clone and enter the project
cd katalyst-server

# Install Fly.io CLI if not already installed
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
fly auth login

# Set up secrets (interactive)
./scripts/setup-secrets.sh
```

### 2. **Deploy to Production**
```bash
# Deploy with automatic health checks and rollback
./scripts/deploy.sh
```

### 3. **Manage Scaling**
```bash
# Check current status
./scripts/scale.sh status

# Scale specific region
./scripts/scale.sh scale dfw 5

# Configure autoscaling
./scripts/scale.sh autoscale 2 10

# Run performance optimization
./scripts/scale.sh optimize
```

## 📊 **Monitoring & Management**

### **Health Endpoints**
- **Application**: `https://katalyst-server.fly.dev/health`
- **Claude Code**: `https://katalyst-server.fly.dev/api/claude/health`
- **Ready Check**: `https://katalyst-server.fly.dev/ready`
- **Metrics**: `https://katalyst-server.fly.dev/metrics`

### **Management Commands**
```bash
# View application status
fly status --app katalyst-server

# Check logs
fly logs --app katalyst-server

# SSH into machine
fly ssh console --app katalyst-server

# View metrics
fly metrics --app katalyst-server

# Scale manually
fly scale count --region dfw 5 --app katalyst-server
```

## 🐍 **Python + Claude Code Integration**

### **Features**
- **Claude Code SDK** v0.0.19+ with full feature access
- **Virtual environment** isolation for Python dependencies
- **Subprocess bridge** for reliable Python-Rust communication
- **Session management** with GenServer pools
- **Concurrent processing** of Claude Code requests

### **Architecture**
```
Phoenix Request → Elixir NIF → Rust Bridge → Python Subprocess → Claude Code SDK
     ↓                ↓              ↓              ↓                    ↓
  REST API    →   GenServer   →   Subprocess   →  JSON-RPC   →      API Calls
```

## 🔄 **Development Workflow**

### **Local Development**
```bash
# Start complete development environment
docker-compose up -d

# Access services:
# - Katalyst App: http://localhost:4000
# - Grafana: http://localhost:3000 (admin/katalyst)
# - Prometheus: http://localhost:9090
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

### **Development Features**
- **Hot reloading** for Phoenix code changes
- **Python debugging** with full SDK access
- **Monitoring stack** (Prometheus + Grafana)
- **Database seeding** with sample data

## 📁 **File Structure**

```
katalyst-server/
├── 🏗️  Infrastructure
│   ├── fly.toml              # Advanced Fly.io configuration
│   ├── Dockerfile            # Production multi-stage build
│   ├── Dockerfile.dev        # Development environment
│   ├── docker-compose.yml    # Local development stack
│   └── .dockerignore         # Build optimization
├── 🐍 Python Integration
│   ├── python_bridge.py      # JSON-RPC bridge for Claude Code
│   ├── pyproject.toml        # Python dependencies
│   └── .venv/               # Virtual environment (created)
├── 🦀 Rust NIFs
│   └── native/
│       └── katalyst_nif/
│           ├── src/
│           │   ├── claude_code.rs     # Claude Code integration
│           │   ├── claude_nif.rs      # NIF bindings
│           │   └── lib.rs             # Main NIF module
│           └── Cargo.toml            # Rust dependencies
├── 🔥 Phoenix Application
│   ├── lib/
│   │   ├── katalyst/
│   │   │   └── claude_code/          # Claude Code Elixir wrapper
│   │   └── katalyst_web/
│   │       └── controllers/
│   │           └── claude_code_controller.ex  # REST API
│   └── config/              # Phoenix configuration
├── 📊 Monitoring
│   └── monitoring/
│       └── prometheus.yml    # Metrics collection config
├── 🛠️  Scripts
│   ├── scripts/
│   │   ├── deploy.sh         # Production deployment
│   │   ├── scale.sh          # Scaling management
│   │   └── setup-secrets.sh  # Secrets configuration
│   └── bin/
│       └── health_check      # Container health script
└── 📚 Documentation
    └── README-DEPLOYMENT.md  # This file
```

## ⚡ **Performance Specifications**

### **Machine Configurations**
- **Primary Region (DFW)**: `performance-4x` (4 vCPU, 8GB RAM)
- **Secondary Regions**: `performance-2x` (2 vCPU, 4GB RAM)
- **Auto-scaling**: 2-20 machines based on load

### **Connection Limits**
- **HTTP**: 2000 concurrent connections (1500 soft limit)
- **WebSocket**: 3000 concurrent connections (2000 soft limit)
- **Claude Sessions**: Up to 1000 concurrent sessions

### **Response Targets**
- **Health Check**: < 100ms
- **API Responses**: < 500ms (95th percentile)
- **Claude Code Calls**: < 2000ms (varies by complexity)

## 🔐 **Security Configuration**

### **Required Secrets**
```bash
# Core application secrets (auto-generated)
SECRET_KEY_BASE           # Phoenix encryption key
RELEASE_COOKIE           # Erlang distribution cookie

# External service keys (must provide)
CLAUDE_API_KEY           # Claude Code SDK access
DATABASE_URL             # PostgreSQL connection
REDIS_URL                # Redis connection (optional)

# Optional integrations
CLOUDFLARE_API_TOKEN     # Cloudflare services
CLOUDFLARE_ACCOUNT_ID    # Cloudflare account
SENTRY_DSN              # Error tracking
```

### **Security Features**
- **Non-root execution** with dedicated user account
- **Encrypted secrets** storage on Fly.io
- **TLS/HTTPS enforcement** with modern ciphers
- **Security headers** (HSTS, CSP, X-Frame-Options)

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Deployment Fails**
   ```bash
   # Check logs
   fly logs --app katalyst-server
   
   # Check machine status
   fly status --app katalyst-server
   
   # Rollback if needed
   fly releases rollback VERSION --app katalyst-server
   ```

2. **Python Bridge Issues**
   ```bash
   # Test Python bridge directly
   fly ssh console --app katalyst-server
   python3 /app/python_bridge.py '{"action": "init", "params": {}}'
   ```

3. **Claude Code Not Working**
   ```bash
   # Check Claude API key
   fly secrets list --app katalyst-server
   
   # Test health endpoint
   curl https://katalyst-server.fly.dev/api/claude/health
   ```

4. **Performance Issues**
   ```bash
   # Run optimization
   ./scripts/scale.sh optimize
   
   # Check metrics
   ./scripts/scale.sh performance
   
   # Scale up if needed
   ./scripts/scale.sh scale dfw 10
   ```

## 📞 **Support & Maintenance**

### **Monitoring Alerts**
- **Health check failures** → Auto-restart
- **High CPU/Memory** → Auto-scale
- **Slow responses** → Performance alerts
- **Error rate spikes** → Notification alerts

### **Regular Maintenance**
```bash
# Weekly health check
./scripts/scale.sh status

# Monthly optimization
./scripts/scale.sh optimize

# Update dependencies (as needed)
mix deps.update --all
.venv/bin/pip install --upgrade claude-code-sdk
```

---

## 🎉 **You're All Set!**

Your Katalyst Server is now configured with enterprise-grade infrastructure:

- ✅ **Global deployment** across multiple regions
- ✅ **Auto-scaling** based on real-time metrics  
- ✅ **Zero-downtime deployments** with rollback
- ✅ **Comprehensive monitoring** and alerting
- ✅ **Python + Claude Code** integration
- ✅ **Production security** and compliance

**Next Steps:**
1. Run `./scripts/setup-secrets.sh` to configure your secrets
2. Deploy with `./scripts/deploy.sh`
3. Monitor your app at `https://katalyst-server.fly.dev`
4. Scale as needed with `./scripts/scale.sh`

🚀 **Your Phoenix + Python + Claude Code application is ready for global scale!**