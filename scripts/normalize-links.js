#!/usr/bin/env node

/**
 * Newsletter Link Normalization Script
 * Selects url and urlType automatically from candidate link fields.
 */

const fs = require('fs');
const path = require('path');
const editorialLinkPolicy = require('../config/editorial-link-policy.json');

const DATA_FILE = path.join(__dirname, '../data/newsletter-data.json');

function selectPreferredLink(article) {
    for (const urlType of editorialLinkPolicy.linkPriority) {
        const candidateField = editorialLinkPolicy.urlTypes[urlType].candidateField;
        const candidateUrl = article[candidateField];

        if (typeof candidateUrl === 'string' && candidateUrl.trim().length > 0) {
            return {
                url: candidateUrl,
                urlType
            };
        }
    }

    return null;
}

function normalizeNewsletterLinks(data) {
    let changed = false;
    let normalizedArticles = 0;

    const categories = ['critique', 'important', 'goodToKnow'];
    categories.forEach(category => {
        const articles = data.categories?.[category] || [];
        articles.forEach(article => {
            const preferredLink = selectPreferredLink(article);
            if (!preferredLink) return;

            if (article.url !== preferredLink.url) {
                article.url = preferredLink.url;
                changed = true;
            }

            if (article.urlType !== preferredLink.urlType) {
                article.urlType = preferredLink.urlType;
                changed = true;
            }

            normalizedArticles += 1;
        });
    });

    return {
        changed,
        normalizedArticles,
        data
    };
}

function normalizeNewsletterDataFile(dataFile = DATA_FILE) {
    if (!fs.existsSync(dataFile)) {
        throw new Error(`Data file not found at ${dataFile}`);
    }

    const raw = fs.readFileSync(dataFile, 'utf8');
    const data = JSON.parse(raw);
    const result = normalizeNewsletterLinks(data);

    if (result.changed) {
        fs.writeFileSync(dataFile, JSON.stringify(result.data, null, 2) + '\n', 'utf8');
    }

    return result;
}

function main() {
    console.log('🔗 Normalizing newsletter links...\n');

    let result;
    try {
        result = normalizeNewsletterDataFile();
    } catch (error) {
        console.error(`❌ ${error.message}`);
        process.exit(1);
    }

    if (result.changed) {
        console.log(`✅ Updated url/urlType for ${result.normalizedArticles} articles`);
        console.log(`📄 Saved normalized data to ${DATA_FILE}`);
    } else {
        console.log(`✅ No changes needed (${result.normalizedArticles} articles checked)`);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    DATA_FILE,
    selectPreferredLink,
    normalizeNewsletterLinks,
    normalizeNewsletterDataFile
};
