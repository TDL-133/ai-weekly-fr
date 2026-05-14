#!/usr/bin/env node

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { selectPreferredLink, normalizeNewsletterLinks } = require('../scripts/normalize-links');
const { validateArticle, validateNewsletter, countArticles } = require('../src/scripts/validator');
const { generateNewsletter } = require('../src/scripts/generator');

const DATA_FILE = path.join(__dirname, '../data/newsletter-data.json');
const FIXTURES_DIR = path.join(__dirname, 'fixtures');

function loadJson(relativePath) {
    return JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, relativePath), 'utf8'));
}

function createSourceMap() {
    const sourceFixture = loadJson('sources.json');
    return new Map(sourceFixture.sources.map(source => [source.name, source.url]));
}

function extractSection(html, sectionName, nextMarker) {
    const startMarker = `<!-- ${sectionName} Section -->`;
    const startIndex = html.indexOf(startMarker);
    assert.notStrictEqual(startIndex, -1, `Missing section marker for ${sectionName}`);

    const contentStart = startIndex + startMarker.length;
    const endIndex = nextMarker ? html.indexOf(nextMarker, contentStart) : html.length;
    assert.notStrictEqual(endIndex, -1, `Missing end marker after ${sectionName}`);

    return html.slice(contentStart, endIndex);
}

const tests = [
    {
        name: 'selectPreferredLink chooses source newsletter before other candidates',
        run() {
            const article = loadJson('article-newsletter.json');

            const result = selectPreferredLink(article);

            assert.deepStrictEqual(result, {
                url: 'https://alphasignal.ai/email/test-issue',
                urlType: 'newsletter'
            });
        }
    },
    {
        name: 'selectPreferredLink falls back to third-party when no newsletter source exists',
        run() {
            const article = loadJson('article-third-party.json');

            const result = selectPreferredLink(article);

            assert.deepStrictEqual(result, {
                url: 'https://example.com/coverage',
                urlType: 'third_party'
            });
        }
    },
    {
        name: 'normalizeNewsletterLinks updates url and urlType from the best candidate',
        run() {
            const data = {
                categories: {
                    critique: [
                        loadJson('article-newsletter.json')
                    ],
                    important: [],
                    goodToKnow: []
                }
            };
            data.categories.critique[0].url = 'https://vendor.example.com/announcement';
            data.categories.critique[0].urlType = 'official';
            data.categories.critique[0].urlReason = 'temporary fallback';

            const result = normalizeNewsletterLinks(data);

            assert.strictEqual(result.changed, true);
            assert.strictEqual(result.normalizedArticles, 1);
            assert.strictEqual(data.categories.critique[0].url, 'https://alphasignal.ai/email/test-issue');
            assert.strictEqual(data.categories.critique[0].urlType, 'newsletter');
        }
    },
    {
        name: 'validateArticle rejects a third-party selection when a newsletter source exists',
        run() {
            const article = loadJson('article-newsletter.json');
            article.url = 'https://example.com/coverage';
            article.urlType = 'third_party';

            const result = validateArticle(article, 0, createSourceMap());

            assert.ok(
                result.errors.some(error => error.includes("violates link priority")),
                `Expected a priority violation error, received: ${result.errors.join(' | ')}`
            );
        }
    },
    {
        name: 'validateArticle rejects official links without a justification',
        run() {
            const article = loadJson('article-official.json');

            const result = validateArticle(article, 0, createSourceMap());

            assert.ok(
                result.errors.some(error => error.includes('urlReason is required')),
                `Expected a missing urlReason error, received: ${result.errors.join(' | ')}`
            );
        }
    },
    {
        name: 'validateNewsletter accepts the dedicated valid fixture',
        run() {
            const data = loadJson('valid-newsletter.json');
            const result = validateNewsletter(data);

            assert.strictEqual(result.valid, true, result.errors.join(' | '));
            assert.ok(countArticles(data) >= 25, 'Expected at least 25 articles in the valid newsletter fixture');
        }
    },
    {
        name: 'validateNewsletter accepts the current newsletter data',
        run() {
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            const result = validateNewsletter(data);

            assert.strictEqual(result.valid, true, result.errors.join(' | '));
            assert.ok(countArticles(data) >= 25, 'Expected at least 25 articles in current newsletter data');
        }
    },
    {
        name: 'generateNewsletter renders all article blocks and required playbook text',
        run() {
            const data = loadJson('valid-newsletter.json');
            const html = generateNewsletter(data, { cssPath: 'dist/src/styles/newsletter.css' });
            const articleCount = countArticles(data);
            const renderedArticles = (html.match(/<article class="group">/g) || []).length;

            assert.strictEqual(renderedArticles, articleCount);
            assert.ok(html.includes('AI Weekly'));
            assert.ok(html.includes('Design by Dagorsey & Claude'));
            assert.ok(html.includes('Les sources sont disponibles à la fin de la newsletter'));
            assert.ok(html.includes('Sources'));
        }
    },
    {
        name: 'generateNewsletter renders Critique, Important and Bon à Savoir with exact article counts',
        run() {
            const data = loadJson('valid-newsletter.json');
            const html = generateNewsletter(data, { cssPath: 'dist/src/styles/newsletter.css' });

            const critiqueSection = extractSection(html, 'Critique', '<!-- Important Section -->');
            const importantSection = extractSection(html, 'Important', '<!-- Bon à Savoir Section -->');
            const goodToKnowSection = extractSection(html, 'Bon à Savoir', '<!-- Sources Section -->');

            const critiqueCount = (critiqueSection.match(/<article class="group">/g) || []).length;
            const importantCount = (importantSection.match(/<article class="group">/g) || []).length;
            const goodToKnowCount = (goodToKnowSection.match(/<article class="group">/g) || []).length;

            assert.ok(critiqueSection.includes('Critique'));
            assert.ok(importantSection.includes('Important'));
            assert.ok(goodToKnowSection.includes('Bon à Savoir'));

            assert.strictEqual(critiqueCount, data.categories.critique.length);
            assert.strictEqual(importantCount, data.categories.important.length);
            assert.strictEqual(goodToKnowCount, data.categories.goodToKnow.length);
        }
    }
];

function main() {
    let failures = 0;

    console.log(`Running ${tests.length} newsletter playbook tests...\n`);

    tests.forEach(test => {
        try {
            test.run();
            console.log(`✅ ${test.name}`);
        } catch (error) {
            failures += 1;
            console.error(`❌ ${test.name}`);
            console.error(`   ${error.message}`);
        }
    });

    if (failures > 0) {
        console.error(`\n${failures} test(s) failed.`);
        process.exit(1);
    }

    console.log(`\n✅ All ${tests.length} tests passed.`);
}

if (require.main === module) {
    main();
}
