const fs = require('fs');
const path = require('path');

/**
 * Newsletter Generator
 * Generates HTML newsletter from JSON data using templates
 */

const TEMPLATES_DIR = path.join(__dirname, '../templates');
const STYLES_DIR = path.join(__dirname, '../styles');

/**
 * Load template file
 */
function loadTemplate(templateName) {
    const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
    return fs.readFileSync(templatePath, 'utf8');
}

/**
 * Replace template variables
 */
function renderTemplate(template, data) {
    let html = template;
    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, value);
    }
    return html;
}

/**
 * Generate article HTML
 */
function generateArticle(article, number, color) {
    const template = loadTemplate('article');
    return renderTemplate(template, {
        number: String(number).padStart(2, '0'),
        color: color,
        title: escapeHtml(article.title),
        url: article.url,
        description: escapeHtml(article.description),
        source: escapeHtml(article.source),
        date: article.date
    });
}

/**
 * Generate category section
 */
function generateCategory(categoryName, articles, color, startNumber = 1) {
    const template = loadTemplate('category');
    const articlesHtml = articles.map((article, index) => {
        const articleNumber = startNumber + index;
        return generateArticle(article, articleNumber, color);
    }).join('\n');
    
    return renderTemplate(template, {
        categoryName: categoryName,
        color: color,
        articles: articlesHtml
    });
}

/**
 * Generate sources section
 */
function generateSources(sources) {
    const template = loadTemplate('sources');
    const sourceItems = sources.map(source => 
        `<li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.name)}</a></li>`
    ).join('\n');
    
    return renderTemplate(template, {
        sourceItems: sourceItems
    });
}

/**
 * Convert date range to French format
 */
function formatDateRangeFrench(weekString) {
    // Format: "2026-01-11 to 2026-01-17" -> "11-17 janvier 2026"
    const match = weekString.match(/(\d{4})-(\d{2})-(\d{2})\s+to\s+(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return weekString;
    
    const [, year1, month1, day1, year2, month2, day2] = match;
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const monthName = months[parseInt(month1) - 1];
    
    return `${day1}-${day2} ${monthName} ${year1}`;
}

/**
 * Generate header
 */
function generateHeader(dateRange) {
    const template = loadTemplate('header');
    const dateRangeFrench = formatDateRangeFrench(dateRange);
    return renderTemplate(template, {
        dateRange: dateRange,
        dateRangeFrench: dateRangeFrench
    });
}

/**
 * Generate complete newsletter HTML
 */
function generateNewsletter(data) {
    // Load base template
    const baseTemplate = loadTemplate('base');
    
    // Generate header
    const header = generateHeader(data.week);
    
    // Generate categories with sequential numbering
    const categories = [];
    let articleNumber = 1;
    
    if (data.categories.critique && data.categories.critique.length > 0) {
        categories.push(generateCategory('Critique', data.categories.critique, 'red', articleNumber));
        articleNumber += data.categories.critique.length;
    }
    
    if (data.categories.important && data.categories.important.length > 0) {
        categories.push(generateCategory('Important', data.categories.important, 'yellow', articleNumber));
        articleNumber += data.categories.important.length;
    }
    
    if (data.categories.goodToKnow && data.categories.goodToKnow.length > 0) {
        categories.push(generateCategory('Bon à Savoir', data.categories.goodToKnow, 'green', articleNumber));
        articleNumber += data.categories.goodToKnow.length;
    }
    
    // Generate sources
    const sources = generateSources(data.sources || []);
    
    // Determine CSS path based on output location
    // For dist/index.html, use relative path; for root index.html, use absolute
    const cssPath = 'dist/src/styles/newsletter.css';
    
    // Combine everything
    return renderTemplate(baseTemplate, {
        week: data.week,
        cssPath: cssPath,
        header: header,
        categories: categories.join('\n'),
        sources: sources
    });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Generate filename from date range
 */
function generateFilename(startDate, endDate) {
    const formatDate = (date) => {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return date.toISOString().split('T')[0].replace(/-/g, '-');
    };
    
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `AI_Weekly_${start}_to_${end}.html`;
}

/**
 * Save newsletter to file
 */
function saveNewsletter(html, filename, outputDir) {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, html, 'utf8');
    return filePath;
}

module.exports = {
    generateNewsletter,
    generateFilename,
    saveNewsletter,
    generateCategory,
    generateArticle,
    generateSources,
    generateHeader
};
