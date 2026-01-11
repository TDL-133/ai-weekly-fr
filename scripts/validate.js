#!/usr/bin/env node

/**
 * Newsletter Validation Script
 * Validates JSON data without generating HTML
 */

const fs = require('fs');
const path = require('path');
const { validateNewsletter } = require('../src/scripts/validator');

const DATA_FILE = path.join(__dirname, '../data/newsletter-data.json');

function main() {
    console.log('🔍 Validating newsletter data...\n');
    
    if (!fs.existsSync(DATA_FILE)) {
        console.error(`❌ Error: Data file not found at ${DATA_FILE}`);
        process.exit(1);
    }
    
    let data;
    try {
        const dataContent = fs.readFileSync(DATA_FILE, 'utf8');
        data = JSON.parse(dataContent);
    } catch (error) {
        console.error(`❌ Error parsing JSON: ${error.message}`);
        process.exit(1);
    }
    
    const validation = validateNewsletter(data);
    
    if (validation.valid) {
        console.log('✅ Validation passed!\n');
        console.log(`📊 Stats:`);
        console.log(`   - Total articles: ${validation.stats.totalArticles}`);
        console.log(`   - Source balance: ${validation.stats.balance.message}`);
        
        if (validation.warnings.length > 0) {
            console.log('\n⚠️  Warnings:');
            validation.warnings.forEach(warning => console.warn(`   - ${warning}`));
        }
        
        process.exit(0);
    } else {
        console.error('❌ Validation failed!\n');
        console.error('Errors:');
        validation.errors.forEach(error => console.error(`   - ${error}`));
        
        if (validation.warnings.length > 0) {
            console.warn('\n⚠️  Warnings:');
            validation.warnings.forEach(warning => console.warn(`   - ${warning}`));
        }
        
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };
