/**
 * Newsletter Data Validator
 * Validates JSON data structure before generation
 */

const editorialLinkPolicy = require('../../config/editorial-link-policy.json');

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

function normalizeHostname(url) {
    if (!isValidURL(url)) return null;
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
}

function hostMatchesSource(articleUrl, sourceUrl) {
    const articleHost = normalizeHostname(articleUrl);
    const sourceHost = normalizeHostname(sourceUrl);

    if (!articleHost || !sourceHost) return false;

    return articleHost === sourceHost
        || articleHost.endsWith(`.${sourceHost}`)
        || sourceHost.endsWith(`.${articleHost}`);
}

/**
 * Validate article structure
 */
function validateArticle(article, index, sourceMap = new Map()) {
    const errors = [];
    const warnings = [];
    const allowedUrlTypes = Object.keys(editorialLinkPolicy.urlTypes);

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
    } else if (!sourceMap.has(article.source)) {
        errors.push(`Article ${index + 1}: Source '${article.source}' is not declared in data.sources`);
    }

    if (!article.date || typeof article.date !== 'string' || article.date.trim().length === 0) {
        errors.push(`Article ${index + 1}: Missing or invalid date`);
    }

    if (!article.urlType || typeof article.urlType !== 'string' || !allowedUrlTypes.includes(article.urlType)) {
        errors.push(
            `Article ${index + 1}: Missing or invalid urlType (expected one of: ${allowedUrlTypes.join(', ')})`
        );
        return { errors, warnings };
    }

    const candidateFields = Object.values(editorialLinkPolicy.urlTypes).map(config => config.candidateField);
    candidateFields.forEach(field => {
        if (article[field] && !isValidURL(article[field])) {
            errors.push(`Article ${index + 1}: Invalid ${field}`);
        }
    });

    if (article.urlReason && (typeof article.urlReason !== 'string' || article.urlReason.trim().length === 0)) {
        errors.push(`Article ${index + 1}: urlReason must be a non-empty string when provided`);
    }

    const selectedTypeConfig = editorialLinkPolicy.urlTypes[article.urlType];
    const selectedCandidateField = selectedTypeConfig.candidateField;

    if (!article[selectedCandidateField]) {
        errors.push(`Article ${index + 1}: Missing ${selectedCandidateField} for urlType '${article.urlType}'`);
    } else if (article.url !== article[selectedCandidateField]) {
        errors.push(
            `Article ${index + 1}: url must match ${selectedCandidateField} when urlType is '${article.urlType}'`
        );
    }

    const selectedPriorityIndex = editorialLinkPolicy.linkPriority.indexOf(article.urlType);
    editorialLinkPolicy.linkPriority.slice(0, selectedPriorityIndex).forEach(higherPriorityType => {
        const higherPriorityField = editorialLinkPolicy.urlTypes[higherPriorityType].candidateField;
        if (article[higherPriorityField]) {
            errors.push(
                `Article ${index + 1}: urlType '${article.urlType}' violates link priority because ${higherPriorityField} is available`
            );
        }
    });

    if (selectedTypeConfig.requiresReason && (!article.urlReason || article.urlReason.trim().length === 0)) {
        errors.push(`Article ${index + 1}: urlReason is required when urlType is '${article.urlType}'`);
    }

    if (article.urlType === 'newsletter') {
        const sourceUrl = sourceMap.get(article.source);
        if (sourceUrl && !hostMatchesSource(article.url, sourceUrl)) {
            warnings.push(
                `Article ${index + 1}: urlType 'newsletter' does not match the declared source domain for '${article.source}'`
            );
        }
    }

    return { errors, warnings };
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
    const sourceMap = new Map();

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

    // Count articles
    const totalArticles = countArticles(data);

    if (totalArticles < 25) {
        errors.push(`Minimum 25 articles required, found ${totalArticles}`);
    }

    // Validate sources list first so article validation can rely on it
    if (!data.sources || !Array.isArray(data.sources)) {
        warnings.push('Sources list is missing or invalid');
    } else {
        data.sources.forEach((source, index) => {
            if (!source.name || !source.url) {
                errors.push(`Source ${index + 1}: Missing name or URL`);
            } else if (!isValidURL(source.url)) {
                errors.push(`Source ${index + 1}: Invalid URL`);
            } else {
                sourceMap.set(source.name, source.url);
            }
        });
    }

    // Validate each article
    categories.forEach(category => {
        const articles = data.categories[category] || [];
        articles.forEach((article, index) => {
            const articleValidation = validateArticle(article, index, sourceMap);
            errors.push(...articleValidation.errors);
            warnings.push(...articleValidation.warnings);
        });
    });

    // Check source balance
    const balanceCheck = checkSourceBalance(data);
    if (!balanceCheck.balanced) {
        warnings.push(balanceCheck.message);
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
