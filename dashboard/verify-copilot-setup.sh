#!/bin/bash

echo "═══════════════════════════════════════════════════"
echo "  GitHub Spec Kit + Copilot Setup Verification"
echo "═══════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_passed=0
check_failed=0

# Check 1: .specify directory exists
echo -n "Checking .specify directory... "
if [ -d ".specify" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    ((check_passed++))
else
    echo -e "${RED}✗ Missing${NC}"
    ((check_failed++))
fi

# Check 2: .github/prompts directory exists
echo -n "Checking .github/prompts directory... "
if [ -d ".github/prompts" ]; then
    echo -e "${GREEN}✓ Found${NC}"
    ((check_passed++))
else
    echo -e "${RED}✗ Missing${NC}"
    ((check_failed++))
fi

# Check 3: Count prompt files
echo -n "Checking prompt files... "
prompt_count=$(ls .github/prompts/*.prompt.md 2>/dev/null | wc -l)
if [ "$prompt_count" -ge 7 ]; then
    echo -e "${GREEN}✓ Found $prompt_count prompts${NC}"
    ((check_passed++))
else
    echo -e "${YELLOW}⚠ Found only $prompt_count prompts (expected 7)${NC}"
    ((check_failed++))
fi

# List available prompts
echo ""
echo "Available Copilot slash commands:"
for file in .github/prompts/*.prompt.md; do
    if [ -f "$file" ]; then
        basename=$(basename "$file" .prompt.md)
        echo "  → /$basename"
    fi
done

echo ""
echo "═══════════════════════════════════════════════════"
echo -e "Results: ${GREEN}$check_passed passed${NC}, ${RED}$check_failed failed${NC}"
echo "═══════════════════════════════════════════════════"
echo ""

if [ $check_failed -eq 0 ]; then
    echo -e "${GREEN}✓ Setup looks good!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Open this project in VS Code or Cursor"
    echo "  2. Open GitHub Copilot Chat (Ctrl+I or Cmd+I)"
    echo "  3. Type '/' to see available slash commands"
    echo "  4. Start with: /constitution"
    echo ""
    echo "See SPEC_KIT_USAGE.md for detailed instructions."
else
    echo -e "${RED}✗ Some checks failed${NC}"
    echo ""
    echo "Try re-running the initialization:"
    echo "  specify init --ai copilot --no-git --script sh --here --force"
fi
