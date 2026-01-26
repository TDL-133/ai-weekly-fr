#!/usr/bin/env node

/**
 * Script de validation de la répartition équilibrée des sources
 * 
 * Usage: node scripts/validate-balance.js [fichier.html]
 * 
 * Ce script vérifie que la newsletter respecte la méthode de répartition équilibrée :
 * - Toutes les 10 sources sont représentées
 * - Différence maximale entre sources ≤ 1 article
 * - Total d'articles entre 25-27
 * - Répartition des catégories respectée
 */

const fs = require('fs');
const path = require('path');

// Les 10 sources exclusives
const SOURCES = [
    'Alpha Signal',
    'Mozza Bytes',
    'Upmynt',
    'NLP Newsletter',
    'The AI Report',
    'TLDR AI',
    'AI Tidbits',
    'Superhuman',
    'IA Ethique Insider',
    'Human in the Loop'
];

// Catégories
const CATEGORIES = {
    'Critique': { min: 8, max: 10 },
    'Important': { min: 8, max: 10 },
    'Bon à Savoir': { min: 7, max: 10 }
};

function extractSourceFromHTML(html) {
    const sourceCounts = {};
    SOURCES.forEach(source => sourceCounts[source] = 0);
    
    // Pattern pour trouver les sources dans le HTML
    // Format: <span>Source Name</span>
    const sourcePattern = /<span>([^<]+)<\/span>/g;
    let match;
    
    while ((match = sourcePattern.exec(html)) !== null) {
        const foundSource = match[1].trim();
        if (SOURCES.includes(foundSource)) {
            sourceCounts[foundSource] = (sourceCounts[foundSource] || 0) + 1;
        }
    }
    
    return sourceCounts;
}

function extractCategoryCounts(html) {
    const categoryCounts = {};
    
    // Compter les articles dans chaque section
    const critiqueMatch = html.match(/<h2[^>]*class="[^"]*text-red-500[^"]*"[^>]*>Critique<\/h2>/);
    const importantMatch = html.match(/<h2[^>]*class="[^"]*text-yellow-500[^"]*"[^>]*>Important<\/h2>/);
    const bonASavoirMatch = html.match(/<h2[^>]*class="[^"]*text-green-500[^"]*"[^>]*>Bon à Savoir<\/h2>/);
    
    // Compter les articles (balises <article>) dans chaque section
    if (critiqueMatch) {
        const critiqueSection = html.substring(html.indexOf(critiqueMatch[0]));
        const nextSection = critiqueSection.indexOf('<h2');
        const sectionContent = nextSection > 0 ? critiqueSection.substring(0, nextSection) : critiqueSection;
        categoryCounts['Critique'] = (sectionContent.match(/<article/g) || []).length;
    }
    
    if (importantMatch) {
        const importantSection = html.substring(html.indexOf(importantMatch[0]));
        const nextSection = importantSection.indexOf('<h2');
        const sectionContent = nextSection > 0 ? importantSection.substring(0, nextSection) : importantSection;
        categoryCounts['Important'] = (sectionContent.match(/<article/g) || []).length;
    }
    
    if (bonASavoirMatch) {
        const bonASavoirSection = html.substring(html.indexOf(bonASavoirMatch[0]));
        categoryCounts['Bon à Savoir'] = (bonASavoirSection.match(/<article/g) || []).length;
    }
    
    return categoryCounts;
}

function validateBalance(sourceCounts) {
    const errors = [];
    const warnings = [];
    
    // Vérifier que toutes les sources sont représentées
    const missingSources = SOURCES.filter(source => !sourceCounts[source] || sourceCounts[source] === 0);
    if (missingSources.length > 0) {
        errors.push(`❌ Sources manquantes : ${missingSources.join(', ')}`);
    }
    
    // Calculer les statistiques
    const counts = Object.values(sourceCounts).filter(c => c > 0);
    const total = counts.reduce((sum, c) => sum + c, 0);
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    const difference = max - min;
    
    // Vérifier le total d'articles
    if (total < 25) {
        warnings.push(`⚠️  Total d'articles trop faible : ${total} (minimum recommandé : 25)`);
    } else if (total > 27) {
        warnings.push(`⚠️  Total d'articles élevé : ${total} (recommandé : 25-27)`);
    }
    
    // Vérifier la différence maximale
    if (difference > 1) {
        errors.push(`❌ Différence maximale trop élevée : ${difference} articles (maximum autorisé : 1)`);
    }
    
    // Vérifier qu'aucune source n'a plus de 3 articles
    const overLimit = Object.entries(sourceCounts).filter(([source, count]) => count > 3);
    if (overLimit.length > 0) {
        errors.push(`❌ Sources avec plus de 3 articles : ${overLimit.map(([s, c]) => `${s} (${c})`).join(', ')}`);
    }
    
    return { errors, warnings, stats: { total, min, max, difference } };
}

function validateCategories(categoryCounts) {
    const errors = [];
    const warnings = [];
    
    for (const [category, count] of Object.entries(categoryCounts)) {
        const limits = CATEGORIES[category];
        if (limits) {
            if (count < limits.min) {
                warnings.push(`⚠️  ${category} : ${count} articles (minimum recommandé : ${limits.min})`);
            } else if (count > limits.max) {
                warnings.push(`⚠️  ${category} : ${count} articles (maximum recommandé : ${limits.max})`);
            }
        }
    }
    
    return { errors, warnings };
}

function main() {
    const htmlFile = process.argv[2] || 'index.html';
    const filePath = path.resolve(htmlFile);
    
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Fichier non trouvé : ${filePath}`);
        process.exit(1);
    }
    
    console.log(`\n📊 Validation de la répartition équilibrée\n`);
    console.log(`Fichier : ${filePath}\n`);
    
    const html = fs.readFileSync(filePath, 'utf-8');
    
    // Extraire les données
    const sourceCounts = extractSourceFromHTML(html);
    const categoryCounts = extractCategoryCounts(html);
    
    // Valider la répartition des sources
    const balanceValidation = validateBalance(sourceCounts);
    const categoryValidation = validateCategories(categoryCounts);
    
    // Afficher les résultats
    console.log('📈 Répartition par source :\n');
    const sortedSources = Object.entries(sourceCounts)
        .sort((a, b) => b[1] - a[1])
        .filter(([_, count]) => count > 0);
    
    sortedSources.forEach(([source, count]) => {
        const status = count <= 3 ? '✅' : '❌';
        console.log(`  ${status} ${source.padEnd(25)} : ${count} article${count > 1 ? 's' : ''}`);
    });
    
    const missingSources = SOURCES.filter(s => !sourceCounts[s] || sourceCounts[s] === 0);
    if (missingSources.length > 0) {
        console.log('\n  Sources non représentées :');
        missingSources.forEach(source => {
            console.log(`  ❌ ${source}`);
        });
    }
    
    console.log(`\n📊 Statistiques :`);
    console.log(`  Total d'articles : ${balanceValidation.stats.total}`);
    console.log(`  Minimum par source : ${balanceValidation.stats.min}`);
    console.log(`  Maximum par source : ${balanceValidation.stats.max}`);
    console.log(`  Différence : ${balanceValidation.stats.difference}`);
    
    console.log(`\n📑 Répartition par catégorie :\n`);
    Object.entries(categoryCounts).forEach(([category, count]) => {
        const limits = CATEGORIES[category];
        const status = limits && count >= limits.min && count <= limits.max ? '✅' : '⚠️';
        console.log(`  ${status} ${category.padEnd(20)} : ${count} article${count > 1 ? 's' : ''}`);
    });
    
    // Afficher les erreurs et avertissements
    const allErrors = [...balanceValidation.errors, ...categoryValidation.errors];
    const allWarnings = [...balanceValidation.warnings, ...categoryValidation.warnings];
    
    if (allErrors.length > 0) {
        console.log(`\n❌ Erreurs :\n`);
        allErrors.forEach(error => console.log(`  ${error}`));
    }
    
    if (allWarnings.length > 0) {
        console.log(`\n⚠️  Avertissements :\n`);
        allWarnings.forEach(warning => console.log(`  ${warning}`));
    }
    
    // Résultat final
    console.log(`\n${'='.repeat(50)}\n`);
    if (allErrors.length === 0 && allWarnings.length === 0) {
        console.log('✅ Validation réussie ! La newsletter respecte la méthode de répartition équilibrée.\n');
        process.exit(0);
    } else if (allErrors.length === 0) {
        console.log('⚠️  Validation réussie avec avertissements. Vérifiez les recommandations ci-dessus.\n');
        process.exit(0);
    } else {
        console.log('❌ Validation échouée. Corrigez les erreurs ci-dessus.\n');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { extractSourceFromHTML, validateBalance, validateCategories };
