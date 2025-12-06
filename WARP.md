# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This repository generates **AI Weekly** - a French-language newsletter that aggregates, translates, and categorizes AI news from 10+ English-language sources. The output is a static HTML newsletter with a clean, minimalist design.

## Architecture

**Template-Based Static HTML Generation**
- No build system, dependencies, or compilation step
- Pure HTML/CSS with inline styles for portability
- Newsletter content is manually generated following the prompt instructions
- Each edition is a standalone HTML file that can be opened directly in a browser

## Key Files

| File | Purpose |
|------|---------|
| `prompt revue fr.md` | Complete instructions for generating newsletter content (scraping, categorization, formatting) |
| `revue fr template.html` | HTML/CSS template with category styling and layout structure |
| `index.html` | Most recent generated newsletter edition |
| `README.md` | Project description and source list for end users |

## Newsletter Generation Workflow

### 1. Content Collection
Use MCP tools to scrape the 10 required newsletter sources:
- **Primary tools**: parallel search, parallel task, firecrawl, tavily, sequential thinking
- **Fallback**: Gmail tool to search user's email for newsletter subscriptions
- **Balance requirement**: All sources must be equally represented in the final output

### 2. Required Sources (with URLs)
1. **Alpha Signal** - https://alphasignal.ai/last-email/
2. **Mozza Bytes** - https://mozzabytes.substack.com/
3. **Upmynt** - https://www.upmynt.com/
4. **NLP Newsletter** - https://nlp.elvissaravia.com/
5. **The AI Report** - https://www.theaireport.ai/newsletters
6. **TLDR AI** - https://tldr.tech/
7. **AI Tidbits** - https://www.aitidbits.ai/
8. **Superhuman** (Zain K) - https://www.superhuman.ai/
9. **IA Ethique Insider** (Daphnée) - https://iaethiqueinsider.substack.com/
10. **Human in the Loop** (Andreas Horn) - Search via Gmail

### 3. Content Categorization
Organize **minimum 25 news items** into three priority tiers:

- 🔴 **Critique (Critical)**: Major announcements, significant regulatory changes, industry-disrupting developments
- 🟡 **Important**: Notable developments, significant research, important partnerships
- 🟢 **Bon à Savoir (Good to Know)**: Interesting updates, emerging trends, useful tools

### 4. Content Requirements
Each news item must include:
- **Title** (in French) with hyperlink to source
- **Two-line description** (in French)
- **Specific, unique URL** for the news item (not the newsletter homepage)
- Balanced representation across all 10 sources

### 5. HTML Output Structure
```
Header:
  - Title: "AI Weekly"
  - Subtitle: "Design by Dagorsey & Claude"
  - Date range: "[Start Date]-[End Date] [Month] [Year]"
  - Note: "Les sources sont disponibles à la fin de la newsletter"

Content:
  - Category sections (Critical → Important → Good to Know)
  - Each section has colored divider (red/yellow/green)
  - Articles with hover effects and staggered fade-in animations

Footer:
  - Sources section with all 10 newsletters and their URLs
```

### 6. File Updates (IMPORTANT)
After generating a new newsletter:
1. **Save the newsletter** as `AI_Weekly_[DateRange].html` (e.g., `AI_Weekly_Dec1-6_2025.html`)
2. **Copy to index.html**: Always update `index.html` with the new newsletter content:
   ```bash
   cp AI_Weekly_[DateRange].html index.html
   ```
3. **Commit both files** in the same PR:
   - The dated newsletter file (for archive)
   - The updated `index.html` (for the live site)

## Critical Constraints

### Token Budget Management
- **Hard limit**: 200k tokens
- Monitor token usage throughout generation to avoid exceeding context window
- If approaching limit, reduce verbosity while maintaining quality and completeness

### Language
- All newsletter content must be **in French** (titles, descriptions, categories)
- Template structure uses French labels: "Critique", "Important", "Bon à Savoir"

### Source Balance
- Each of the 10 sources should contribute roughly equal number of articles
- Scan all sources comprehensively before selecting items
- Do not over-represent any single newsletter

## Working with Files

### View the generation prompt:
```bash
cat "prompt revue fr.md"
```

### View the HTML template:
```bash
cat "revue fr template.html"
```

### Open generated newsletter in browser:
```bash
open index.html
```

### View recent editions:
```bash
ls -lt *.html
```

## Template Customization

The template (`revue fr template.html`) uses utility-first CSS classes:
- Responsive design (mobile breakpoints at 768px)
- Color system: gray scale + red/yellow/green for categories
- Typography: System font stack (San Francisco on macOS)
- Animations: Staggered fade-in (0.1s delay per article)
- Hover effects: Blue highlight on article titles

## Scraping Strategy

1. **Start with website scraping** (parallel/firecrawl/tavily) for most recent editions
2. **Fallback to Gmail** if website scraping fails or returns old content
3. **Use sequential thinking** for complex extraction tasks
4. **Extract week range** from prompt or user specification
5. **Verify all 10 sources** are found before proceeding to categorization

## MCP Tools Configuration

The user has MCP tools configured including:
- **parallel search and task** - Primary web scraping tool
- **firecrawl** - Secondary web scraping tool
- **tavily** - Search and extraction tool
- **sequential thinking** - Complex reasoning for categorization
- **Gmail** (if available) - Newsletter email access
- **brightdata/playwright** - Alternative scraping tools
