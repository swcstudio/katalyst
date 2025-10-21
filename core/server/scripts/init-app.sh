#!/bin/bash
# Katalyst Server - Application Initialization Script
# Creates the Fly.io app and sets up initial configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

APP_NAME="katalyst-server"
PRIMARY_REGION="dfw"

echo -e "${BLUE}🚀 Katalyst Server Application Initialization${NC}"
echo "=============================================="

# Check if fly CLI is available
if ! command -v fly &> /dev/null; then
    echo -e "${RED}❌ Fly CLI not found. Installing...${NC}"
    curl -L https://fly.io/install.sh | sh
    export PATH="$HOME/.fly/bin:$PATH"
fi

# Check if logged in
if ! fly auth whoami &> /dev/null; then
    echo -e "${YELLOW}🔑 Please log in to Fly.io...${NC}"
    fly auth login
fi

echo -e "${GREEN}✅ Fly.io CLI ready${NC}"

# Check if app already exists
if fly status --app $APP_NAME &> /dev/null; then
    echo -e "${YELLOW}📱 App '$APP_NAME' already exists${NC}"
    echo -e "${BLUE}Current status:${NC}"
    fly status --app $APP_NAME
    exit 0
fi

# Create the app
echo -e "${YELLOW}🏗️  Creating Fly.io app '$APP_NAME'...${NC}"

# Create app with our fly.toml configuration
fly launch \
    --name $APP_NAME \
    --region $PRIMARY_REGION \
    --no-deploy \
    --copy-config \
    --yes

echo -e "${GREEN}✅ App '$APP_NAME' created successfully!${NC}"

# Set up initial volumes for data persistence
echo -e "${YELLOW}💾 Creating persistent volumes...${NC}"

# Primary region volume
fly volumes create katalyst_data \
    --region $PRIMARY_REGION \
    --size 10 \
    --app $APP_NAME \
    --yes || echo "Volume may already exist"

# Additional region volumes
for region in sjc iad; do
    echo "Creating volume in $region..."
    fly volumes create "katalyst_data_${region}" \
        --region $region \
        --size 10 \
        --app $APP_NAME \
        --yes || echo "Volume in $region may already exist"
done

echo -e "${GREEN}✅ Volumes created${NC}"

# Show app info
echo ""
echo -e "${BLUE}📋 Application Information:${NC}"
echo "App Name: $APP_NAME"
echo "Primary Region: $PRIMARY_REGION"
echo "App URL: https://${APP_NAME}.fly.dev"
echo ""

# Show next steps
echo -e "${YELLOW}🎯 Next Steps:${NC}"
echo "1. Set up secrets: ./scripts/setup-secrets.sh"
echo "2. Deploy application: ./scripts/deploy.sh"
echo "3. Check status: fly status --app $APP_NAME"
echo "4. View logs: fly logs --app $APP_NAME"
echo ""

echo -e "${GREEN}🎉 Initialization complete!${NC}"
echo -e "${BLUE}Your app is ready for secrets setup and deployment.${NC}"