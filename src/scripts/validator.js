/**
 * Newsletter Data Validator
 * Validates JSON data structure before generation
 */

/**
 * Validate URL format
 */
function isValidURL(url) {
    if (typeof url !== 'string') return false;
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Validate article structure
 */
function validateArticle(article, index) {
    const errors = [];
    
    if (!article.title || typeof article.title !== 'string' || article.title.trim().length === 0) {
        errors.push(`Article ${index + 1}: Missing or invalid title`);
    }
    
    if (!article.url || !isValidURL(article.url)) {
        errors.push(`Article ${index + 1}: Missing or invalid URL`);
    }
    
    if (!article.description || typeof article.description !== 'string' || article.description.trim().length === 0) {
        errors.push(`Article ${index + 1}: Missing or invalid description`);
    }
    
    if (!article.source || typeof article.source !== 'string' || article.source.trim().length === 0) {
        errors.push(`Article ${index + 1}: Missing or invalid source`);
    }
    
    if (!article.date || typeof article.date !== 'string' || article.date.trim().length === 0) {
        errors.push(`Article ${index + 1}: Missing or invalid date`);
    }
    
    return errors;
}

/**
 * Count total articles
 */
function countArticles(data) {
    let count = 0;
    if (data.categories) {
        if (data.categories.critique) count += data.categories.critique.length;
        if (data.categories.important) count += data.categories.important.length;
        if (data.categories.goodToKnow) count += data.categories.goodToKnow.length;
    }
    return count;
}

/**
 * Check source balance
 */
function checkSourceBalance(data) {
    const sourceCounts = {};
    const allArticles = [
        ...(data.categories?.critique || []),
        ...(data.categories?.important || []),
        ...(data.categories?.goodToKnow || [])
    ];
    
    allArticles.forEach(article => {
        const source = article.source;
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    
    const counts = Object.values(sourceCounts);
    if (counts.length === 0) return { balanced: true, message: 'No articles found' };
    
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    const difference = max - min;
    
    // Allow up to 3 articles difference between sources
    const balanced = difference <= 3;
    
    return {
        balanced,
        message: balanced 
            ? `Sources are balanced (min: ${min}, max: ${max})`
            : `Sources are unbalanced (min: ${min}, max: ${max}, diff: ${difference})`,
        counts: sourceCounts
    };
}

/**
 * Validate newsletter data structure
 */
function validateNewsletter(data) {
    const errors = [];
    const warnings = [];
    
    // Check required fields
    if (!data.week || typeof data.week !== 'string') {
        errors.push('Missing or invalid week field');
    }
    
    if (!data.categories || typeof data.categories !== 'object') {
        errors.push('Missing or invalid categories field');
        return { valid: false, errors, warnings };
    }
    
    // Validate categories
    const categories = ['critique', 'important', 'goodToKnow'];
    categories.forEach(category => {
        if (!Array.isArray(data.categories[category])) {
            warnings.push(`Category '${category}' is not an array or is missing`);
        }
    });
    
    // Count and validate articles
    const totalArticles = countArticles(data);
    
    if (totalArticles < 25) {
        errors.push(`Minimum 25 articles required, found ${totalArticles}`);
    }
    
    // Validate each article
    categories.forEach(category => {
        const articles = data.categories[category] || [];
        articles.forEach((article, index) => {
            const articleErrors = validateArticle(article, index);
            errors.push(...articleErrors);
        });
    });
    
    // Check source balance
    const balanceCheck = checkSourceBalance(data);
    if (!balanceCheck.balanced) {
        warnings.push(balanceCheck.message);
    }
    
    // Validate sources list
    if (!data.sources || !Array.isArray(data.sources)) {
        warnings.push('Sources list is missing or invalid');
    } else {
        data.sources.forEach((source, index) => {
            if (!source.name || !source.url) {
                errors.push(`Source ${index + 1}: Missing name or URL`);
            } else if (!isValidURL(source.url)) {
                errors.push(`Source ${index + 1}: Invalid URL`);
            }
        });
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        stats: {
            totalArticles,
            balance: balanceCheck
        }
    };
}

module.exports = {
    validateNewsletter,
    isValidURL,
    validateArticle,
    countArticles,
    checkSourceBalance
};
