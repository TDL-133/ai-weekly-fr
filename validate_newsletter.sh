#!/bin/bash

# validate_newsletter.sh
# Validates that an AI Weekly newsletter meets all quality requirements

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if file provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <newsletter.html>"
    echo "Example: $0 AI_Weekly_Nov23-29_2025_final.html"
    exit 1
fi

NEWSLETTER="$1"

if [ ! -f "$NEWSLETTER" ]; then
    echo -e "${RED}Error: File '$NEWSLETTER' not found${NC}"
    exit 1
fi

echo "Validating: $NEWSLETTER"
echo "=========================================="

ERRORS=0
WARNINGS=0

# 1. Check clickable links in news titles
echo -n "1. Checking clickable links in news titles... "
LINK_COUNT=$(grep -c '<a href=' "$NEWSLETTER" || true)
# Check if links are in JavaScript (url property - with or without quotes)
URL_COUNT=$(grep -c 'url:' "$NEWSLETTER" || true)
if [ "$URL_COUNT" -ge 25 ]; then
    # JavaScript-based newsletter with URL properties
    echo -e "${GREEN}✓ PASS${NC} ($URL_COUNT URLs in JavaScript data)"
elif [ "$LINK_COUNT" -ge 25 ]; then
    # HTML-based newsletter with href attributes
    echo -e "${GREEN}✓ PASS${NC} ($LINK_COUNT clickable links found)"
else
    echo -e "${RED}✗ FAIL${NC} (Found $LINK_COUNT HTML links and $URL_COUNT JS URLs, expected ≥25 total)"
    ((ERRORS++))
fi

# 2. Check sources note below date
echo -n "2. Checking sources note in header... "
if grep -q "Les sources sont disponibles" "$NEWSLETTER"; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${RED}✗ FAIL${NC} (Missing 'Les sources sont disponibles' note)"
    ((ERRORS++))
fi

# 3. Check Sources section in footer
echo -n "3. Checking Sources section... "
if grep -i "sources" "$NEWSLETTER" | grep -q -i "<h2"; then
    echo -e "${GREEN}✓ PASS${NC} (Sources section found)"
    
    # Check for 10 source links
    echo -n "   Checking source links count... "
    SOURCE_LINKS=$(grep -A 30 -i "Sources" "$NEWSLETTER" | grep -c '<a href=' || true)
    if [ "$SOURCE_LINKS" -ge 9 ]; then
        echo -e "${GREEN}✓ PASS${NC} ($SOURCE_LINKS sources listed)"
    else
        echo -e "${YELLOW}⚠ WARNING${NC} (Found $SOURCE_LINKS sources, expected 10)"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗ FAIL${NC} (Sources section not found)"
    ((ERRORS++))
fi

# 4. Check minimum news count
echo -n "4. Checking news item count... "
# Try both JavaScript data and HTML structure
NEWS_COUNT_JS=$(grep -c '"id":' "$NEWSLETTER" || true)
NEWS_COUNT_HTML=$(grep -c '<article' "$NEWSLETTER" || true)
NEWS_COUNT=$((NEWS_COUNT_JS > NEWS_COUNT_HTML ? NEWS_COUNT_JS : NEWS_COUNT_HTML))
if [ "$NEWS_COUNT" -ge 25 ]; then
    echo -e "${GREEN}✓ PASS${NC} ($NEWS_COUNT news items)"
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Found $NEWS_COUNT, expected ≥25 - may need manual verification)"
    ((WARNINGS++))
fi

# 5. Check for category sections
echo -n "5. Checking category sections... "
CATEGORIES_OK=true
if ! grep -q "Critique" "$NEWSLETTER"; then
    echo -e "${RED}✗ FAIL${NC} (Missing 'Critique' category)"
    ((ERRORS++))
    CATEGORIES_OK=false
fi
if ! grep -q "Important" "$NEWSLETTER"; then
    echo -e "${RED}✗ FAIL${NC} (Missing 'Important' category)"
    ((ERRORS++))
    CATEGORIES_OK=false
fi
if ! grep -q "Bon à Savoir" "$NEWSLETTER" && ! grep -q "Bon a Savoir" "$NEWSLETTER"; then
    echo -e "${RED}✗ FAIL${NC} (Missing 'Bon à Savoir' category)"
    ((ERRORS++))
    CATEGORIES_OK=false
fi
if [ "$CATEGORIES_OK" = true ]; then
    echo -e "${GREEN}✓ PASS${NC} (All 3 categories present)"
fi

# 6. Check for required sources
echo -n "6. Checking required newsletter sources... "
REQUIRED_SOURCES=("Alpha Signal" "Mozza Bytes" "Upmynt" "NLP Newsletter" "The AI Report" "TLDR" "AI Tidbits" "Superhuman" "Ethique Insider")
MISSING_SOURCES=()

for source in "${REQUIRED_SOURCES[@]}"; do
    if ! grep -q "$source" "$NEWSLETTER"; then
        MISSING_SOURCES+=("$source")
    fi
done

if [ ${#MISSING_SOURCES[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC} (All required sources referenced)"
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Missing: ${MISSING_SOURCES[*]})"
    ((WARNINGS++))
fi

# 7. Check header structure
echo -n "7. Checking header structure... "
if grep -q "AI Weekly" "$NEWSLETTER" && grep -q "Dagorsey & Claude" "$NEWSLETTER"; then
    echo -e "${GREEN}✓ PASS${NC} (Title and subtitle present)"
else
    echo -e "${RED}✗ FAIL${NC} (Missing title or subtitle)"
    ((ERRORS++))
fi

# Summary
echo "=========================================="
echo "Validation Summary:"
echo -e "  Errors: ${RED}$ERRORS${NC}"
echo -e "  Warnings: ${YELLOW}$WARNINGS${NC}"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "\n${GREEN}✓ Newsletter is ready for publication!${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "\n${YELLOW}⚠ Newsletter has warnings but can be published${NC}"
    exit 0
else
    echo -e "\n${RED}✗ Newsletter has critical errors and should NOT be published${NC}"
    exit 1
fi
