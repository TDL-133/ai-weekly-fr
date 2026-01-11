#!/usr/bin/env node

/**
 * Newsletter Generation Script
 * Main entry point for generating newsletters from JSON data
 */

const fs = require('fs');
const path = require('path');
const { generateNewsletter, generateFilename, saveNewsletter } = require('../src/scripts/generator');
const { validateNewsletter } = require('../src/scripts/validator');

// Configuration
const DATA_DIR = path.join(__dirname, '../data');
const DIST_DIR = path.join(__dirname, '../dist');
const DATA_FILE = path.join(DATA_DIR, 'newsletter-data.json');

/**
 * Main function
 */
function main() {
    console.log('🚀 Starting newsletter generation...\n');
    
    // Check if data file exists
    if (!fs.existsSync(DATA_FILE)) {
        console.error(`❌ Error: Data file not found at ${DATA_FILE}`);
        console.log('\n💡 Tip: Create newsletter-data.json in the data/ directory');
        process.exit(1);
    }
    
    // Load data
    console.log('📖 Loading newsletter data...');
    let data;
    try {
        const dataContent = fs.readFileSync(DATA_FILE, 'utf8');
        data = JSON.parse(dataContent);
    } catch (error) {
        console.error(`❌ Error parsing JSON: ${error.message}`);
        process.exit(1);
    }
    
    // Validate data
    console.log('✅ Validating data...');
    const validation = validateNewsletter(data);
    
    if (!validation.valid) {
        console.error('\n❌ Validation errors:');
        validation.errors.forEach(error => console.error(`   - ${error}`));
        
        if (validation.warnings.length > 0) {
            console.warn('\n⚠️  Warnings:');
            validation.warnings.forEach(warning => console.warn(`   - ${warning}`));
        }
        
        process.exit(1);
    }
    
    if (validation.warnings.length > 0) {
        console.warn('\n⚠️  Warnings:');
        validation.warnings.forEach(warning => console.warn(`   - ${warning}`));
    }
    
    console.log(`\n📊 Stats: ${validation.stats.totalArticles} articles`);
    console.log(`   ${validation.stats.balance.message}\n`);
    
    // Generate HTML
    console.log('🎨 Generating HTML...');
    let html;
    try {
        html = generateNewsletter(data);
    } catch (error) {
        console.error(`❌ Error generating HTML: ${error.message}`);
        console.error(error.stack);
        process.exit(1);
    }
    
    // Generate filename
    // Extract dates from week string (format: "2025-12-20 to 2025-12-26")
    const weekMatch = data.week.match(/(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/);
    let filename;
    
    if (weekMatch) {
        filename = generateFilename(weekMatch[1], weekMatch[2]);
    } else {
        // Fallback: use current date
        const now = new Date();
        const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filename = generateFilename(start, now);
    }
    
    // Copy CSS to dist
    const cssSource = path.join(__dirname, '../src/styles/newsletter.css');
    const cssDest = path.join(DIST_DIR, 'src/styles/newsletter.css');
    const cssDestDir = path.dirname(cssDest);
    
    if (!fs.existsSync(cssDestDir)) {
        fs.mkdirSync(cssDestDir, { recursive: true });
    }
    fs.copyFileSync(cssSource, cssDest);
    console.log('   ✓ CSS copied to dist');
    
    // Save files
    console.log('💾 Saving files...');
    
    // Save to archive
    const archiveDir = path.join(DIST_DIR, 'archive');
    const archivePath = saveNewsletter(html, filename, archiveDir);
    console.log(`   ✓ Saved to archive: ${archivePath}`);
    
    // Save to dist/index.html
    const indexPath = saveNewsletter(html, 'index.html', DIST_DIR);
    console.log(`   ✓ Saved to index: ${indexPath}`);
    
    console.log('\n✅ Newsletter generated successfully!');
    console.log(`\n📄 Files created:`);
    console.log(`   - ${archivePath}`);
    console.log(`   - ${indexPath}`);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main };
