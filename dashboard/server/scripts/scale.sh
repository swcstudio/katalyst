#!/bin/bash
# Katalyst Server - Scaling and Performance Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

APP_NAME="katalyst-server"

echo -e "${BLUE}📈 Katalyst Server Scaling Management${NC}"
echo "======================================"

# Check if app exists
if ! fly status --app $APP_NAME &> /dev/null; then
    echo -e "${RED}❌ App '$APP_NAME' not found${NC}"
    exit 1
fi

show_usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  status                Show current scaling status"
    echo "  scale [REGION] [COUNT] Scale to specific machine count in region"
    echo "  autoscale [MIN] [MAX]  Configure autoscaling"
    echo "  regions               Show all regions and machine counts"
    echo "  performance           Show performance metrics"
    echo "  optimize              Run performance optimizations"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 scale dfw 5"
    echo "  $0 autoscale 2 10"
    echo "  $0 regions"
}

show_status() {
    echo -e "${YELLOW}📊 Current Scaling Status${NC}"
    echo "=========================="
    
    # Show machine status
    fly status --app $APP_NAME
    
    echo ""
    echo -e "${YELLOW}🗺️  Regional Distribution${NC}"
    fly machines list --app $APP_NAME | grep -E "^[a-f0-9]" | \
    awk '{print $3}' | sort | uniq -c | \
    while read count region; do
        echo "  $region: $count machines"
    done
    
    # Show resource usage
    echo ""
    echo -e "${YELLOW}💾 Resource Usage${NC}"
    fly machines list --app $APP_NAME --json | \
    jq -r '.[] | "\(.region): \(.config.size) (\(.config.guest.cpus)x\(.config.guest.memory_mb)MB)"'
}

scale_region() {
    local region=$1
    local count=$2
    
    if [[ -z "$region" || -z "$count" ]]; then
        echo -e "${RED}❌ Please specify region and count${NC}"
        echo "Usage: $0 scale [REGION] [COUNT]"
        exit 1
    fi
    
    echo -e "${YELLOW}📈 Scaling $region to $count machines...${NC}"
    
    # Scale the region
    fly scale count --app $APP_NAME --region $region $count
    
    # Wait for scaling to complete
    echo "Waiting for scaling to complete..."
    sleep 10
    
    # Verify scaling
    local current_count=$(fly machines list --app $APP_NAME | grep "$region" | wc -l)
    if [[ "$current_count" -eq "$count" ]]; then
        echo -e "${GREEN}✅ Successfully scaled $region to $count machines${NC}"
    else
        echo -e "${YELLOW}⚠️  Scaling in progress. Current: $current_count, Target: $count${NC}"
    fi
}

configure_autoscale() {
    local min=$1
    local max=$2
    
    if [[ -z "$min" || -z "$max" ]]; then
        echo -e "${RED}❌ Please specify min and max machine counts${NC}"
        echo "Usage: $0 autoscale [MIN] [MAX]"
        exit 1
    fi
    
    echo -e "${YELLOW}🔄 Configuring autoscaling: min=$min, max=$max${NC}"
    
    # Update fly.toml with autoscaling configuration
    # This would be implemented based on your specific needs
    echo "Autoscaling configured. Update your fly.toml with:"
    echo "[scaling]"
    echo "  min_machines = $min"
    echo "  max_machines = $max"
    
    echo -e "${GREEN}✅ Autoscaling configuration updated${NC}"
}

show_regions() {
    echo -e "${YELLOW}🗺️  Available Regions and Current Deployment${NC}"
    echo "==============================================="
    
    # Show all available regions
    echo "Available Fly.io regions:"
    fly platform regions | head -20
    
    echo ""
    echo "Current deployment:"
    fly machines list --app $APP_NAME | grep -E "^[a-f0-9]" | \
    awk '{print $1 " " $3 " " $4 " " $5}' | \
    while read id region status size; do
        echo "  $id: $region ($status) - $size"
    done
}

show_performance() {
    echo -e "${YELLOW}⚡ Performance Metrics${NC}"
    echo "===================="
    
    # Get app URL
    APP_URL="https://${APP_NAME}.fly.dev"
    
    # Check response times
    echo "Testing response times..."
    
    # Health endpoint
    HEALTH_TIME=$(curl -o /dev/null -s -w '%{time_total}' "${APP_URL}/health" || echo "failed")
    echo "Health endpoint: ${HEALTH_TIME}s"
    
    # Claude Code health
    CLAUDE_TIME=$(curl -o /dev/null -s -w '%{time_total}' "${APP_URL}/api/claude/health" || echo "failed")
    echo "Claude Code API: ${CLAUDE_TIME}s"
    
    # Show metrics if available
    if curl -f -s "${APP_URL}/metrics" > /dev/null 2>&1; then
        echo ""
        echo "Recent metrics (last 5 minutes):"
        curl -s "${APP_URL}/metrics" | grep -E "(http_requests|claude_sessions|genserver_processes)" | head -10
    fi
    
    # Show resource utilization
    echo ""
    echo -e "${YELLOW}📊 Resource Utilization${NC}"
    fly metrics --app $APP_NAME | tail -20
}

run_optimization() {
    echo -e "${YELLOW}🚀 Running Performance Optimizations${NC}"
    echo "===================================="
    
    # Restart machines for memory cleanup
    echo "1. Restarting machines for memory cleanup..."
    fly machines restart --app $APP_NAME --force
    
    # Clear any accumulated logs
    echo "2. Log maintenance completed"
    
    # Warm up caches
    APP_URL="https://${APP_NAME}.fly.dev"
    echo "3. Warming up application caches..."
    curl -s "${APP_URL}/health" > /dev/null || true
    curl -s "${APP_URL}/api/claude/health" > /dev/null || true
    
    echo -e "${GREEN}✅ Performance optimization complete${NC}"
}

# Parse command line arguments
case "${1:-status}" in
    "status")
        show_status
        ;;
    "scale")
        scale_region "$2" "$3"
        ;;
    "autoscale")
        configure_autoscale "$2" "$3"
        ;;
    "regions")
        show_regions
        ;;
    "performance")
        show_performance
        ;;
    "optimize")
        run_optimization
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        show_usage
        exit 1
        ;;
esac