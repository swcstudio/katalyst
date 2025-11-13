#!/bin/bash
# Katalyst Server - Secrets Setup Script
# Securely configure all required secrets for production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

APP_NAME="katalyst-server"

echo -e "${BLUE}🔐 Katalyst Server Secrets Configuration${NC}"
echo "========================================"

# Check if fly CLI is available
if ! command -v fly &> /dev/null; then
    echo -e "${RED}❌ Fly CLI not found. Install it from https://fly.io/docs/getting-started/installing-flyctl/${NC}"
    exit 1
fi

# Check if logged in
if ! fly auth whoami &> /dev/null; then
    echo -e "${RED}❌ Not logged in to Fly.io. Run 'fly auth login' first${NC}"
    exit 1
fi

# Check if app exists, if not, offer to create it
if ! fly status --app $APP_NAME &> /dev/null; then
    echo -e "${YELLOW}⚠️  App '$APP_NAME' not found.${NC}"
    echo -e "${BLUE}Would you like to initialize it first? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        ./scripts/init-app.sh
        echo ""
        echo -e "${GREEN}✅ App initialized. Continuing with secrets setup...${NC}"
    else
        echo -e "${RED}❌ Cannot set up secrets without an app. Run './scripts/init-app.sh' first${NC}"
        exit 1
    fi
fi

echo -e "${YELLOW}📋 Setting up secrets for $APP_NAME...${NC}"

# Generate secure random values
generate_secret_key() {
    openssl rand -base64 64
}

generate_release_cookie() {
    openssl rand -base64 32
}

# Set up core Phoenix secrets
echo "Setting up Phoenix framework secrets..."
fly secrets set --app $APP_NAME SECRET_KEY_BASE="$(generate_secret_key)"
fly secrets set --app $APP_NAME RELEASE_COOKIE="$(generate_release_cookie)"

# Prompt for required secrets
echo ""
echo -e "${YELLOW}Please provide the following required secrets:${NC}"

# Claude Authentication - Support both session tokens (Max Plan) and API keys
echo ""
echo -e "${BLUE}Claude Authentication Setup:${NC}"
echo "For Claude Max Plan users: Use session token authentication (recommended)"
echo "For API users: Use API key authentication"
echo ""
echo -n "Do you have a Claude Max Plan with session access? (y/N): "
read -r HAS_MAX_PLAN
echo ""

if [[ "$HAS_MAX_PLAN" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Setting up Claude Max Plan session authentication...${NC}"
    echo "To get your session token:"
    echo "1. Open Claude.ai in your browser"
    echo "2. Login to your account"
    echo "3. Open browser developer tools (F12)"
    echo "4. Go to Application/Storage → Cookies → https://claude.ai"
    echo "5. Find the 'sessionKey' cookie value"
    echo ""
    echo -n "Claude Session Token (from sessionKey cookie): "
    read -s CLAUDE_SESSION_TOKEN
    echo ""
    if [[ -n "$CLAUDE_SESSION_TOKEN" ]]; then
        fly secrets set --app $APP_NAME CLAUDE_SESSION_TOKEN="$CLAUDE_SESSION_TOKEN"
        echo -e "${GREEN}✅ Claude Session Token set (Max Plan authentication)${NC}"
    else
        echo -e "${YELLOW}⚠️  Session token skipped${NC}"
    fi
else
    echo -n "Claude API Key (for API access): "
    read -s CLAUDE_API_KEY
    echo ""
    if [[ -n "$CLAUDE_API_KEY" ]]; then
        fly secrets set --app $APP_NAME CLAUDE_API_KEY="$CLAUDE_API_KEY"
        echo -e "${GREEN}✅ Claude API Key set${NC}"
    else
        echo -e "${YELLOW}⚠️  Claude API Key skipped${NC}"
    fi
fi

# Database URL
echo -n "Database URL (PostgreSQL connection string): "
read -s DATABASE_URL
echo ""
if [[ -n "$DATABASE_URL" ]]; then
    fly secrets set --app $APP_NAME DATABASE_URL="$DATABASE_URL"
    echo -e "${GREEN}✅ Database URL set${NC}"
else
    echo -e "${YELLOW}⚠️  Database URL skipped - will use Fly.io Postgres${NC}"
fi

# Optional secrets
echo ""
echo -e "${YELLOW}Optional secrets (press Enter to skip):${NC}"

# Redis URL
echo -n "Redis URL (for caching): "
read -s REDIS_URL
echo ""
if [[ -n "$REDIS_URL" ]]; then
    fly secrets set --app $APP_NAME REDIS_URL="$REDIS_URL"
    echo -e "${GREEN}✅ Redis URL set${NC}"
fi

# Cloudflare secrets
echo -n "Cloudflare API Token (for Cloudflare integrations): "
read -s CLOUDFLARE_API_TOKEN
echo ""
if [[ -n "$CLOUDFLARE_API_TOKEN" ]]; then
    fly secrets set --app $APP_NAME CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN"
    echo -e "${GREEN}✅ Cloudflare API Token set${NC}"
fi

echo -n "Cloudflare Account ID: "
read -s CLOUDFLARE_ACCOUNT_ID
echo ""
if [[ -n "$CLOUDFLARE_ACCOUNT_ID" ]]; then
    fly secrets set --app $APP_NAME CLOUDFLARE_ACCOUNT_ID="$CLOUDFLARE_ACCOUNT_ID"
    echo -e "${GREEN}✅ Cloudflare Account ID set${NC}"
fi

# Monitoring and logging
echo -n "Sentry DSN (for error tracking): "
read -s SENTRY_DSN
echo ""
if [[ -n "$SENTRY_DSN" ]]; then
    fly secrets set --app $APP_NAME SENTRY_DSN="$SENTRY_DSN"
    echo -e "${GREEN}✅ Sentry DSN set${NC}"
fi

# Show current secrets (names only)
echo ""
echo -e "${BLUE}📋 Current secrets configured:${NC}"
fly secrets list --app $APP_NAME

echo ""
echo -e "${GREEN}🎉 Secrets configuration complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Deploy your application: ./scripts/deploy.sh"
echo "2. Check application health after deployment"
echo "3. Monitor logs: fly logs --app $APP_NAME"
echo ""
echo -e "${BLUE}💡 Security Notes:${NC}"
echo "• All secrets are encrypted and stored securely on Fly.io"
echo "• Secrets are only available to your application instances"
echo "• You can update secrets anytime with: fly secrets set SECRET_NAME='new-value'"
echo "• Remove secrets with: fly secrets unset SECRET_NAME"