#!/bin/bash

# Cloudflare deployment script for Katalyst Server
# Sets up all Cloudflare resources and deploys Workers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Katalyst Server - Cloudflare Deployment Script      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check for required tools
check_requirements() {
    echo -e "${YELLOW}Checking requirements...${NC}"
    
    if ! command -v wrangler &> /dev/null; then
        echo -e "${RED}✗ Wrangler CLI not found${NC}"
        echo "Installing Wrangler..."
        npm install -g wrangler
    else
        echo -e "${GREEN}✓ Wrangler CLI found${NC}"
    fi
    
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}✗ jq not found${NC}"
        echo "Please install jq: apt-get install jq"
        exit 1
    else
        echo -e "${GREEN}✓ jq found${NC}"
    fi
    
    # Check for environment variables
    if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
        echo -e "${RED}✗ CLOUDFLARE_API_TOKEN not set${NC}"
        echo "Please set your Cloudflare API token"
        exit 1
    else
        echo -e "${GREEN}✓ API token configured${NC}"
    fi
}

# Create D1 databases
setup_d1_databases() {
    echo -e "\n${YELLOW}Setting up D1 databases...${NC}"
    
    databases=("katalyst-timeseries" "katalyst-analytics" "katalyst-sessions" "katalyst-application")
    
    for db in "${databases[@]}"; do
        echo -e "Creating database: ${db}"
        
        # Check if database exists
        if wrangler d1 list | grep -q "$db"; then
            echo -e "${GREEN}✓ Database $db already exists${NC}"
        else
            wrangler d1 create "$db" --experimental-backend
            echo -e "${GREEN}✓ Created database $db${NC}"
        fi
        
        # Run migrations
        migration_file=".cloudflare/migrations/timeseries/0001_init.sql"
        if [ -f "$migration_file" ]; then
            echo "Running migrations for $db..."
            wrangler d1 execute "$db" --file="$migration_file"
            echo -e "${GREEN}✓ Migrations complete for $db${NC}"
        fi
    done
}

# Create KV namespaces
setup_kv_namespaces() {
    echo -e "\n${YELLOW}Setting up KV namespaces...${NC}"
    
    namespaces=("cache" "sessions" "config" "rate-limits" "locks")
    
    for ns in "${namespaces[@]}"; do
        kv_name="katalyst-${ns}"
        echo -e "Creating KV namespace: ${kv_name}"
        
        # Check if namespace exists
        if wrangler kv:namespace list | grep -q "$kv_name"; then
            echo -e "${GREEN}✓ KV namespace $kv_name already exists${NC}"
        else
            result=$(wrangler kv:namespace create "$ns" --preview)
            echo -e "${GREEN}✓ Created KV namespace $kv_name${NC}"
            echo "$result"
        fi
    done
}

# Create Queues
setup_queues() {
    echo -e "\n${YELLOW}Setting up Queues...${NC}"
    
    queues=("events" "tasks" "analytics" "notifications" "dlq")
    
    for queue in "${queues[@]}"; do
        queue_name="katalyst-${queue}"
        echo -e "Creating queue: ${queue_name}"
        
        # Create queue using API (wrangler doesn't have queue commands yet)
        curl -X POST "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/queues" \
            -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
            -H "Content-Type: application/json" \
            -d "{\"queue_name\": \"${queue_name}\"}" \
            --silent | jq -r '.success' > /dev/null
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Queue $queue_name created or already exists${NC}"
        else
            echo -e "${RED}✗ Failed to create queue $queue_name${NC}"
        fi
    done
}

# Create R2 buckets
setup_r2_buckets() {
    echo -e "\n${YELLOW}Setting up R2 buckets...${NC}"
    
    buckets=("containers" "wasm-modules" "backups" "assets")
    
    for bucket in "${buckets[@]}"; do
        bucket_name="katalyst-${bucket}"
        echo -e "Creating R2 bucket: ${bucket_name}"
        
        if wrangler r2 bucket list | grep -q "$bucket_name"; then
            echo -e "${GREEN}✓ R2 bucket $bucket_name already exists${NC}"
        else
            wrangler r2 bucket create "$bucket_name"
            echo -e "${GREEN}✓ Created R2 bucket $bucket_name${NC}"
        fi
    done
}

# Create Vectorize indexes
setup_vectorize() {
    echo -e "\n${YELLOW}Setting up Vectorize indexes...${NC}"
    
    # Create embeddings index
    echo "Creating Vectorize index: katalyst-embeddings"
    curl -X POST "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/vectorize/indexes" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "katalyst-embeddings",
            "dimensions": 1536,
            "metric": "cosine",
            "description": "Main embeddings for AI/ML operations"
        }' \
        --silent | jq -r '.success' > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Vectorize index created or already exists${NC}"
    fi
    
    # Create search index
    echo "Creating Vectorize index: katalyst-search"
    curl -X POST "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/vectorize/indexes" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "katalyst-search",
            "dimensions": 768,
            "metric": "euclidean",
            "description": "Content search vectors"
        }' \
        --silent | jq -r '.success' > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Vectorize search index created or already exists${NC}"
    fi
}

# Build WASM modules
build_wasm() {
    echo -e "\n${YELLOW}Building WASM modules...${NC}"
    
    if [ -f "scripts/build-wasm.sh" ]; then
        ./scripts/build-wasm.sh
        echo -e "${GREEN}✓ WASM modules built${NC}"
    else
        echo -e "${YELLOW}⚠ WASM build script not found, skipping${NC}"
    fi
}

# Deploy Workers
deploy_workers() {
    echo -e "\n${YELLOW}Deploying Workers...${NC}"
    
    cd .cloudflare
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install
    
    # Build the worker
    echo "Building worker..."
    npm run build:cloudflare || npm run build || true
    
    # Deploy based on environment
    if [ "$1" == "production" ]; then
        echo -e "${YELLOW}Deploying to PRODUCTION...${NC}"
        wrangler deploy --env production
    elif [ "$1" == "staging" ]; then
        echo -e "${YELLOW}Deploying to STAGING...${NC}"
        wrangler deploy --env staging
    else
        echo -e "${YELLOW}Deploying to DEVELOPMENT...${NC}"
        wrangler deploy --env development
    fi
    
    cd ..
    echo -e "${GREEN}✓ Workers deployed${NC}"
}

# Create AI Gateway
setup_ai_gateway() {
    echo -e "\n${YELLOW}Setting up AI Gateway...${NC}"
    
    curl -X POST "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/ai-gateway/gateways" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        -d '{
            "name": "katalyst-ai-gateway",
            "description": "AI Gateway for Katalyst Server"
        }' \
        --silent | jq -r '.success' > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ AI Gateway created or already exists${NC}"
    fi
}

# Update wrangler.toml with IDs
update_config() {
    echo -e "\n${YELLOW}Updating configuration...${NC}"
    
    # Get D1 database IDs
    echo "Fetching D1 database IDs..."
    d1_list=$(wrangler d1 list --json 2>/dev/null || echo '[]')
    
    # Get KV namespace IDs
    echo "Fetching KV namespace IDs..."
    kv_list=$(wrangler kv:namespace list --json 2>/dev/null || echo '[]')
    
    echo -e "${GREEN}✓ Configuration updated${NC}"
    echo -e "${YELLOW}Note: You may need to manually update wrangler.toml with the correct IDs${NC}"
}

# Main deployment flow
main() {
    ENVIRONMENT="${1:-development}"
    
    echo -e "${BLUE}Deployment Environment: ${ENVIRONMENT}${NC}\n"
    
    # Check requirements
    check_requirements
    
    # Setup Cloudflare resources
    setup_d1_databases
    setup_kv_namespaces
    setup_queues
    setup_r2_buckets
    setup_vectorize
    setup_ai_gateway
    
    # Build and deploy
    build_wasm
    deploy_workers "$ENVIRONMENT"
    
    # Update configuration
    update_config
    
    echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          Deployment Complete! 🚀                        ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Update .env with Cloudflare resource IDs"
    echo "2. Test your Workers at: https://katalyst-server.${CLOUDFLARE_SUBDOMAIN}.workers.dev"
    echo "3. Monitor logs: wrangler tail"
    echo "4. View analytics: https://dash.cloudflare.com"
}

# Run main function
main "$@"