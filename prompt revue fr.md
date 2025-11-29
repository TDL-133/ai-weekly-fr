# AI Weekly Newsletter Generation Instructions

## SECTION 1: Content Collection & Sources

### Step 1: Collect newsletters from Gmail
Go to my gmail and scan emails for AI newsletters from the week that just ended.
I will specify the last day to review.

### Step 2: Required sources (all must be equally represented)
Use these 10 newsletters in a balanced way:
- Alpha Signal
- Mozza Bytes
- Upmynt
- NLP Newsletter (Elvis Saravia)
- The AI Report
- TLDR AI
- AI Tidbits (Sahar Mor)
- Superhuman (Zain Kahn)
- IA Ethique Insider (Daphnée)
- Human in the Loop (Andreas Horn)

### Step 3: Fallback to web scraping
If newsletters not found in Gmail, scrape these URLs using parallel search, parallel task, firecrawl, tavily, or sequential thinking:
- Alpha Signal: https://alphasignal.ai/last-email/
- Mozza Bytes: https://mozzabytes.substack.com/
- Upmynt: https://www.upmynt.com/
- NLP Newsletter: https://nlp.elvissaravia.com/
- The AI Report: https://www.theaireport.ai/newsletters
- TLDR AI: https://tldr.tech/ai
- AI Tidbits: https://www.aitidbits.ai/
- Superhuman: https://www.superhuman.ai/
- IA Ethique Insider: https://iaethiqueinsider.substack.com/
- Human in the Loop: https://www.humanintheloop.online/

**CRITICAL**: All 10 sources must be equally represented in the final newsletter.

## SECTION 2: Content Requirements

### News Selection
- Minimum 25 news items
- Each item must have:
  - Title (in French)
  - Two-line description/summary (in French)
  - Precise and unique URL to the specific article
- All content must be in French

### Categorization
Rank news from most important to least, distributed across 3 zones:
1. **🔴 Critique (Critical)**: Major announcements, significant regulatory changes, industry-disrupting developments
2. **🟡 Important**: Notable developments, significant research, important partnerships
3. **🟢 Bon à Savoir (Good to Know)**: Interesting updates, emerging trends, useful tools

## SECTION 3: HTML Structure Requirements (MANDATORY)

Use `revue fr template.html` as the base template.

### Header Structure (in order):
1. **Title**: "AI Weekly" (h1, centered)
2. **Subtitle**: "by Dagorsey & Claude" (italics, gray)
3. **Divider line** (horizontal, centered)
4. **Date**: "[Start Date]-[End Date] [Month] [Year]" (e.g., "23-29 Novembre 2025")
5. **Sources note**: "Les sources sont disponibles à la fin de la newsletter" (small text, gray)

### Content Structure:
- Three category sections with colored dividers:
  - 🔴 Critique (red divider)
  - 🟡 Important (yellow divider) 
  - 🟢 Bon à Savoir (green divider)
- Each news item:
  - Numbered (01, 02, 03...)
  - **Title must be a clickable hyperlink** to the article URL
  - Two-line summary
  - Source name and date

### Footer Structure:
- Section titled "Sources"
- List of all 10 newsletters used
- Each source must have a clickable URL
- Format: "• [Newsletter Name](URL)"

## SECTION 4: VALIDATION CHECKLIST

Before considering the newsletter complete, verify ALL of these:

**✓ Required Elements:**
- [ ] All news titles are clickable hyperlinks to specific article URLs
- [ ] Note "Les sources sont disponibles à la fin de la newsletter" appears below the date
- [ ] Sources section at bottom with all 10 newsletters and their URLs
- [ ] Layout matches template (colors, spacing, typography)

**✓ Content Quality:**
- [ ] Minimum 25 news items
- [ ] All 10 sources equally represented (balanced coverage)
- [ ] 3 categories: Critique (red), Important (yellow), Bon à Savoir (green)
- [ ] All content in French
- [ ] Each news has unique, specific URL (not homepage)

**✓ Technical:**
- [ ] Valid HTML structure
- [ ] All links open in new tab (target="_blank")
- [ ] Responsive design preserved
- [ ] Animations and hover effects working

If ANY item is unchecked, the newsletter is NOT ready for publication.

