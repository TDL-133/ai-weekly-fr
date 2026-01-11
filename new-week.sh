#!/bin/bash
# new-week.sh - Quick script to start a new week's newsletter

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get current week's Monday and Sunday
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - get this week's Monday
    DAY_OF_WEEK=$(date +%u)  # 1=Monday, 7=Sunday
    if [ "$DAY_OF_WEEK" -eq 1 ]; then
        # Today is Monday
        MONDAY=$(date +%Y-%m-%d)
        SUNDAY=$(date -v +6d +%Y-%m-%d)
    else
        # Find last Monday
        DAYS_BACK=$((DAY_OF_WEEK - 1))
        MONDAY=$(date -v -${DAYS_BACK}d +%Y-%m-%d)
        SUNDAY=$(date -v +$((6 - DAYS_BACK))d +%Y-%m-%d)
    fi
else
    # Linux
    DAY_OF_WEEK=$(date +%u)  # 1=Monday, 7=Sunday
    if [ "$DAY_OF_WEEK" -eq 1 ]; then
        # Today is Monday
        MONDAY=$(date +%Y-%m-%d)
        SUNDAY=$(date -d "+6 days" +%Y-%m-%d)
    else
        # Find last Monday
        DAYS_BACK=$((DAY_OF_WEEK - 1))
        MONDAY=$(date -d "-${DAYS_BACK} days" +%Y-%m-%d)
        SUNDAY=$(date -d "+$((6 - DAYS_BACK)) days" +%Y-%m-%d)
    fi
fi

# Ask if user wants next week instead
read -p "Create newsletter for this week ($MONDAY to $SUNDAY) or next week? (this/next) [this]: " choice
choice=${choice:-this}

if [ "$choice" = "next" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        MONDAY=$(date -j -f "%Y-%m-%d" "$MONDAY" -v +7d +%Y-%m-%d)
        SUNDAY=$(date -j -f "%Y-%m-%d" "$SUNDAY" -v +7d +%Y-%m-%d)
    else
        MONDAY=$(date -d "$MONDAY +7 days" +%Y-%m-%d)
        SUNDAY=$(date -d "$SUNDAY +7 days" +%Y-%m-%d)
    fi
fi

echo "Creating newsletter for: $MONDAY to $SUNDAY"
"$SCRIPT_DIR/newsletter.sh" create "$MONDAY" "$SUNDAY"
