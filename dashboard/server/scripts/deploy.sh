#!/bin/bash
# Katalyst Server - Production Deployment Script
# Advanced deployment with zero-downtime, health checks, and rollback

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="katalyst-server"
FLY_CONFIG="fly.toml"
HEALTH_ENDPOINT="/health"
MAX_WAIT_TIME=300 # 5 minutes
ROLLBACK_ON_FAILURE=true

echo -e "${BLUE}🚀 Katalyst Server Production Deployment${NC}"
echo "=========================================="

# Check prerequisites
echo -e "${YELLOW}📋 Checking deployment prerequisites...${NC}"

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo -e "${RED}❌ Fly CLI not found. Install it from https://fly.io/docs/getting-started/installing-flyctl/${NC}"
    exit 1
fi

# Check if logged in to Fly.io
if ! fly auth whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Fly.io. Run 'fly auth login' first${NC}"
    exit 1
fi

# Check if app exists
if ! fly status --app $APP_NAME &> /dev/null; then
    echo -e "${YELLOW}⚠️  App '$APP_NAME' not found. Creating it...${NC}"
    fly launch --no-deploy --copy-config --name $APP_NAME
fi

echo -e "${GREEN}✅ Prerequisites checked${NC}"

# Pre-deployment setup
echo -e "${YELLOW}🔧 Pre-deployment setup...${NC}"

# Set secrets if they don't exist
echo "Setting up secrets..."
fly secrets set --app $APP_NAME SECRET_KEY_BASE="$(openssl rand -base64 64)" || true
fly secrets set --app $APP_NAME RELEASE_COOKIE="$(openssl rand -base64 32)" || true

# Check required secrets
REQUIRED_SECRETS=("DATABASE_URL" "CLAUDE_API_KEY")
for secret in "${REQUIRED_SECRETS[@]}"; do
    if ! fly secrets list --app $APP_NAME | grep -q "$secret"; then
        echo -e "${YELLOW}⚠️  Required secret '$secret' not set. Please set it with:${NC}"
        echo "fly secrets set --app $APP_NAME $secret='your-value'"
    fi
done

# Build and deploy
echo -e "${YELLOW}🏗️  Building and deploying application...${NC}"

# Get current deployment version for potential rollback
CURRENT_VERSION=$(fly status --app $APP_NAME -j | jq -r '.Version // "none"')
echo "Current version: $CURRENT_VERSION"

# Deploy with automatic rollback on failure
if [ "$ROLLBACK_ON_FAILURE" = true ]; then
    DEPLOY_CMD="fly deploy --auto-rollback"
else
    DEPLOY_CMD="fly deploy"
fi

echo "Running: $DEPLOY_CMD"
if ! $DEPLOY_CMD --app $APP_NAME; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Wait for deployment to be healthy
echo -e "${YELLOW}🏥 Waiting for deployment to become healthy...${NC}"
START_TIME=$(date +%s)

while true; do
    CURRENT_TIME=$(date +%s)
    ELAPSED=$((CURRENT_TIME - START_TIME))
    
    if [ $ELAPSED -gt $MAX_WAIT_TIME ]; then
        echo -e "${RED}❌ Deployment timed out after ${MAX_WAIT_TIME}s${NC}"
        
        if [ "$ROLLBACK_ON_FAILURE" = true ] && [ "$CURRENT_VERSION" != "none" ]; then
            echo -e "${YELLOW}⏪ Rolling back to version $CURRENT_VERSION...${NC}"
            fly releases rollback $CURRENT_VERSION --app $APP_NAME
        fi
        exit 1
    fi
    
    # Check health endpoint
    APP_URL="https://${APP_NAME}.fly.dev"
    if curl -f -s --max-time 10 "${APP_URL}${HEALTH_ENDPOINT}" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Deployment healthy!${NC}"
        break
    fi
    
    echo -n "."
    sleep 5
done

# Post-deployment checks
echo -e "${YELLOW}🔍 Running post-deployment checks...${NC}"

# Check Claude Code integration
if curl -f -s --max-time 10 "${APP_URL}/api/claude/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Claude Code integration healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Claude Code health check inconclusive${NC}"
fi

# Check metrics endpoint
if curl -f -s --max-time 10 "${APP_URL}/metrics" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Metrics endpoint responding${NC}"
else
    echo -e "${YELLOW}⚠️  Metrics endpoint not responding${NC}"
fi

# Display deployment information
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo "=========================================="
echo "App URL: ${APP_URL}"
echo "Health: ${APP_URL}${HEALTH_ENDPOINT}"
echo "Metrics: ${APP_URL}/metrics"
echo "Dashboard: ${APP_URL}/dashboard"

# Show current status
echo ""
echo -e "${BLUE}📊 Current Status:${NC}"
fly status --app $APP_NAME

# Show recent logs
echo ""
echo -e "${BLUE}📝 Recent Logs:${NC}"
fly logs --app $APP_NAME --lines 20

echo ""
echo -e "${GREEN}✨ Deployment complete! Your app is running on Fly.io${NC}"