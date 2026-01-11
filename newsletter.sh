#!/bin/bash
# newsletter.sh - Main script for managing weekly newsletters

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="${REPO_DIR:-$SCRIPT_DIR}"
WORKTREE_BASE="${WORKTREE_BASE:-../worktrees}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Generate filename from date range
generate_filename() {
    local start_date=$1
    local end_date=$2
    
    if [ -z "$end_date" ]; then
        # Single date
        if [[ "$OSTYPE" == "darwin"* ]]; then
            local date_str=$(date -j -f "%Y-%m-%d" "$start_date" "+%b%d-%Y" 2>/dev/null)
        else
            local date_str=$(date -d "$start_date" "+%b%d-%Y" 2>/dev/null)
        fi
        echo "AI_Weekly_${date_str}.html"
    else
        # Date range
        if [[ "$OSTYPE" == "darwin"* ]]; then
            local start_str=$(date -j -f "%Y-%m-%d" "$start_date" "+%b%d" 2>/dev/null)
            local end_str=$(date -j -f "%Y-%m-%d" "$end_date" "+%b%d-%Y" 2>/dev/null)
        else
            local start_str=$(date -d "$start_date" "+%b%d" 2>/dev/null)
            local end_str=$(date -d "$end_date" "+%b%d-%Y" 2>/dev/null)
        fi
        echo "AI_Weekly_${start_str}-${end_str}.html"
    fi
}

# Create new newsletter worktree
create_newsletter() {
    local start_date=$1
    local end_date=$2
    
    if [ -z "$start_date" ]; then
        log_error "Start date required (format: YYYY-MM-DD)"
        echo "Usage: $0 create <start-date> [end-date]"
        exit 1
    fi
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        local branch_name="newsletter-$(date -j -f "%Y-%m-%d" "$start_date" "+%Y%m%d" 2>/dev/null)"
    else
        local branch_name="newsletter-$(date -d "$start_date" "+%Y%m%d" 2>/dev/null)"
    fi
    
    local filename=$(generate_filename "$start_date" "$end_date")
    local worktree_path="$WORKTREE_BASE/$branch_name"
    
    log_info "Creating newsletter for $start_date"
    if [ -n "$end_date" ]; then
        log_info "Date range: $start_date to $end_date"
    fi
    
    # Check if worktree already exists
    if [ -d "$worktree_path" ]; then
        log_warning "Worktree already exists at $worktree_path"
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Navigate to repo root (try to find .git)
    local git_root="$REPO_DIR"
    while [ ! -d "$git_root/.git" ] && [ "$git_root" != "/" ]; do
        git_root=$(dirname "$git_root")
    done
    
    if [ ! -d "$git_root/.git" ]; then
        log_error "Git repository not found. Please run this from a git repository."
        exit 1
    fi
    
    cd "$git_root" || exit 1
    
    # Create branch if it doesn't exist
    if ! git show-ref --verify --quiet refs/heads/"$branch_name"; then
        log_info "Creating branch: $branch_name"
        git branch "$branch_name" 2>/dev/null || git checkout -b "$branch_name"
    fi
    
    # Create worktree
    log_info "Creating worktree at: $worktree_path"
    mkdir -p "$(dirname "$worktree_path")"
    git worktree add "$worktree_path" "$branch_name" 2>/dev/null || {
        log_warning "Worktree might already exist, checking out..."
        cd "$worktree_path" || exit 1
        git checkout "$branch_name" || exit 1
    }
    
    # Copy template if it exists
    if [ -f "$REPO_DIR/revue fr template.html" ]; then
        log_info "Copying template to worktree"
        cp "$REPO_DIR/revue fr template.html" "$worktree_path/$filename"
        log_success "Template copied to $filename"
    elif [ -f "$REPO_DIR/revue-fr-template.html" ]; then
        log_info "Copying template to worktree"
        cp "$REPO_DIR/revue-fr-template.html" "$worktree_path/$filename"
        log_success "Template copied to $filename"
    else
        log_warning "Template not found, creating empty file"
        touch "$worktree_path/$filename"
    fi
    
    log_success "Newsletter worktree created!"
    log_info "Worktree location: $worktree_path"
    log_info "Filename: $filename"
    log_info "Branch: $branch_name"
    echo
    log_info "Next steps:"
    echo "  1. cd $worktree_path"
    echo "  2. Edit $filename"
    echo "  3. Run: $0 publish $branch_name"
}

# Update archive index
update_archive() {
    log_info "Updating archive index..."
    
    local index_file="${1:-index.html}"
    local archive_section=""
    
    # Find all newsletter HTML files
    local newsletters=$(find . -maxdepth 1 -name "AI_Weekly_*.html" -type f | sort -r)
    
    if [ -z "$newsletters" ]; then
        log_warning "No newsletter files found"
        return
    fi
    
    archive_section="<section class=\"archive-section\">\n"
    archive_section+="    <h2>Archives</h2>\n"
    archive_section+="    <ul class=\"archive-list\">\n"
    
    while IFS= read -r file; do
        local basename=$(basename "$file")
        local date_match=$(echo "$basename" | grep -oE "[A-Z][a-z]{2}[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}" || \
                          echo "$basename" | grep -oE "[A-Z][a-z]{2}[0-9]{1,2}-[0-9]{4}")
        
        if [ -n "$date_match" ]; then
            archive_section+="        <li><a href=\"$basename\">$date_match</a></li>\n"
        else
            archive_section+="        <li><a href=\"$basename\">$basename</a></li>\n"
        fi
    done <<< "$newsletters"
    
    archive_section+="    </ul>\n"
    archive_section+="</section>\n"
    
    log_success "Archive section generated"
    echo -e "$archive_section"
}

# Publish newsletter
publish_newsletter() {
    local branch_name=$1
    
    if [ -z "$branch_name" ]; then
        # Try to detect current branch
        if git rev-parse --git-dir > /dev/null 2>&1; then
            branch_name=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
        fi
        if [ -z "$branch_name" ] || [ "$branch_name" = "HEAD" ]; then
            log_error "Branch name required"
            echo "Usage: $0 publish <branch-name>"
            exit 1
        fi
    fi
    
    local worktree_path="$WORKTREE_BASE/$branch_name"
    
    if [ ! -d "$worktree_path" ]; then
        log_error "Worktree not found: $worktree_path"
        log_info "Available worktrees:"
        git worktree list
        exit 1
    fi
    
    log_info "Publishing newsletter from branch: $branch_name"
    
    cd "$worktree_path" || exit 1
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        log_info "Staging all changes..."
        git add -A
        
        read -p "Commit message (or press Enter for default): " commit_msg
        if [ -z "$commit_msg" ]; then
            commit_msg="Publish newsletter $branch_name"
        fi
        
        git commit -m "$commit_msg"
        log_success "Changes committed"
    else
        log_info "No changes to commit"
    fi
    
    # Push to remote
    read -p "Push to remote? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Pushing to remote..."
        if git push origin "$branch_name" 2>/dev/null; then
            log_success "Pushed to remote"
        else
            log_warning "Push failed, trying to set upstream..."
            git push -u origin "$branch_name" || {
                log_error "Push failed. Check your remote configuration."
                exit 1
            }
            log_success "Pushed to remote with upstream set"
        fi
    fi
    
    # Merge to main if requested
    read -p "Merge to main/master branch? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        local main_branch="main"
        if ! git show-ref --verify --quiet refs/heads/main; then
            main_branch="master"
        fi
        
        log_info "Merging to $main_branch..."
        
        # Find git root
        local git_root="$worktree_path"
        while [ ! -d "$git_root/.git" ] && [ "$git_root" != "/" ]; do
            git_root=$(dirname "$git_root")
        done
        
        cd "$git_root" || exit 1
        git checkout "$main_branch"
        git merge "$branch_name" --no-edit
        git push origin "$main_branch" 2>/dev/null || log_warning "Could not push to $main_branch"
        
        log_success "Merged to $main_branch"
    fi
    
    log_success "Newsletter published!"
}

# List all newsletters
list_newsletters() {
    log_info "Newsletter worktrees:"
    echo
    
    if git rev-parse --git-dir > /dev/null 2>&1; then
        git worktree list 2>/dev/null | while read -r line; do
            if echo "$line" | grep -q "newsletter-"; then
                echo "  $line"
            fi
        done || log_warning "Could not list worktrees"
    else
        log_warning "Not in a git repository"
    fi
    
    echo
    log_info "Newsletter files in current directory:"
    find . -maxdepth 1 -name "AI_Weekly_*.html" -type f | sort -r | while read -r file; do
        echo "  $(basename "$file")"
    done
}

# Clean up old worktrees
cleanup_worktrees() {
    log_warning "This will remove worktrees that are merged into main/master"
    read -p "Continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
    
    local main_branch="main"
    if ! git show-ref --verify --quiet refs/heads/main; then
        main_branch="master"
    fi
    
    git worktree list | while read -r line; do
        local worktree_path=$(echo "$line" | awk '{print $1}')
        local branch=$(echo "$line" | awk '{print $3}' | tr -d '[]')
        
        if [[ "$branch" == newsletter-* ]]; then
            if git branch --merged "$main_branch" 2>/dev/null | grep -q "^  $branch$"; then
                log_info "Removing merged worktree: $branch"
                git worktree remove "$worktree_path" 2>/dev/null || true
                git branch -d "$branch" 2>/dev/null || true
            fi
        fi
    done
    
    log_success "Cleanup complete"
}

# Main command dispatcher
case "${1:-help}" in
    create)
        create_newsletter "$2" "$3"
        ;;
    publish)
        publish_newsletter "$2"
        ;;
    list)
        list_newsletters
        ;;
    archive)
        update_archive "$2"
        ;;
    cleanup)
        cleanup_worktrees
        ;;
    help|--help|-h)
        cat << EOF
AI Weekly Newsletter Manager

Usage: $0 <command> [options]

Commands:
  create <start-date> [end-date]  Create a new newsletter worktree
                                   Dates format: YYYY-MM-DD
                                   Example: $0 create 2026-01-09 2026-01-15
  
  publish [branch-name]           Publish newsletter (commit, push, optionally merge)
  
  list                            List all newsletter worktrees and files
  
  archive [output-file]           Generate archive index HTML (default: index.html)
  
  cleanup                         Remove merged worktree branches
  
  help                            Show this help message

Examples:
  # Create newsletter for this week
  $0 create 2026-01-09 2026-01-15
  
  # Publish current newsletter
  $0 publish newsletter-20260109
  
  # List all newsletters
  $0 list

Environment variables:
  REPO_DIR        Main repository directory (default: script directory)
  WORKTREE_BASE   Base directory for worktrees (default: ../worktrees)
EOF
        ;;
    *)
        log_error "Unknown command: $1"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac
