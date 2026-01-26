#!/bin/bash
# generate-archive.sh - Generate archive index page

OUTPUT_FILE="${1:-archive.html}"

cat > "$OUTPUT_FILE" << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Weekly - Archives</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #111827;
            background-color: #f9fafb;
            padding: 2rem;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 3rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 2.5rem;
            font-weight: 300;
            margin-bottom: 0.5rem;
        }
        .subtitle {
            color: #6b7280;
            margin-bottom: 2rem;
        }
        .archive-list {
            list-style: none;
        }
        .archive-list li {
            padding: 1rem 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .archive-list li:last-child {
            border-bottom: none;
        }
        .archive-list a {
            color: #2563eb;
            text-decoration: none;
            font-size: 1.1rem;
        }
        .archive-list a:hover {
            text-decoration: underline;
        }
        .back-link {
            display: inline-block;
            margin-top: 2rem;
            color: #6b7280;
            text-decoration: none;
        }
        .back-link:hover {
            color: #2563eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI Weekly</h1>
        <p class="subtitle">Archives des newsletters</p>
        <ul class="archive-list">
EOF

# Find and list all newsletter files, sorted by date (newest first)
find . -maxdepth 1 -name "AI_Weekly_*.html" -type f | \
    sort -r | \
    while read -r file; do
        basename=$(basename "$file" .html)
        # Extract date from filename
        date_str=$(echo "$basename" | sed 's/AI_Weekly_//')
        echo "            <li><a href=\"$file\">$date_str</a></li>" >> "$OUTPUT_FILE"
    done

cat >> "$OUTPUT_FILE" << 'EOF'
        </ul>
        <a href="index.html" class="back-link">← Retour à l'accueil</a>
    </div>
</body>
</html>
EOF

echo "Archive index generated: $OUTPUT_FILE"
