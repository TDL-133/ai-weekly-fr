# Guide d'Optimisation - AI Weekly

Ce guide explique comment utiliser le nouveau système optimisé de génération de newsletters.

## 🎯 Changements Principaux

### 1. CSS Externalisé
- ✅ CSS extrait vers `src/styles/newsletter.css`
- ✅ Plus de duplication (économise ~200 lignes par fichier)
- ✅ Mise à jour centralisée

### 2. Système de Templates Modulaires
- ✅ Templates séparés dans `src/templates/`
- ✅ Réutilisables et maintenables
- ✅ Facile à modifier

### 3. Génération Automatisée
- ✅ JSON → HTML via script Node.js
- ✅ Validation automatique
- ✅ Génération de fichiers standardisés

## 📁 Structure des Fichiers

```
ai-weekly-fr/
├── src/
│   ├── templates/          # Templates HTML modulaires
│   │   ├── base.html
│   │   ├── header.html
│   │   ├── article.html
│   │   ├── category.html
│   │   └── sources.html
│   ├── styles/
│   │   └── newsletter.css  # CSS centralisé
│   └── scripts/
│       ├── generator.js    # Générateur HTML
│       └── validator.js    # Validateur de données
├── data/
│   └── newsletter-data.json  # Données JSON (généré par AI)
├── dist/
│   ├── index.html         # Newsletter actuelle
│   └── archive/           # Archives
├── scripts/
│   ├── generate.js        # Script principal
│   └── validate.js        # Script de validation
└── package.json           # Configuration npm
```

## 🚀 Utilisation

### 1. Préparation

```bash
# Installer Node.js (si pas déjà fait)
# Vérifier la version
node --version  # Doit être >= 14.0.0
```

### 2. Créer les Données JSON

L'AI doit générer un fichier `data/newsletter-data.json` avec cette structure :

```json
{
  "week": "2025-12-20 to 2025-12-26",
  "categories": {
    "critique": [
      {
        "title": "Titre de l'article",
        "url": "https://example.com/article",
        "description": "Description en deux lignes",
        "source": "TLDR AI",
        "date": "20 décembre 2025"
      }
    ],
    "important": [...],
    "goodToKnow": [...]
  },
  "sources": [...]
}
```

### 3. Générer la Newsletter

```bash
# Valider les données
npm run validate

# Générer la newsletter
npm run generate

# Ou les deux en une fois
npm run build
```

### 4. Résultat

Le script génère :
- `dist/index.html` - Newsletter actuelle
- `dist/archive/AI_Weekly_YYYY-MM-DD_to_YYYY-MM-DD.html` - Archive

## 📝 Format des Données

### Structure Complète

```json
{
  "week": "2025-12-20 to 2025-12-26",
  "categories": {
    "critique": [
      {
        "title": "Titre en français",
        "url": "https://example.com/article",
        "description": "Description en deux lignes maximum",
        "source": "Nom de la source",
        "date": "20 décembre 2025"
      }
    ],
    "important": [...],
    "goodToKnow": [...]
  },
  "sources": [
    {
      "name": "Alpha Signal",
      "url": "https://alphasignal.ai/last-email/"
    }
  ]
}
```

### Règles de Validation

- ✅ Minimum 25 articles au total
- ✅ URLs valides (http:// ou https://)
- ✅ Tous les champs requis présents
- ✅ Équilibre des sources (max 3 articles de différence)
- ✅ Dates dans le format correct

## 🔧 Personnalisation

### Modifier le CSS

Éditer `src/styles/newsletter.css` - les changements s'appliquent à toutes les newsletters.

### Modifier les Templates

Éditer les fichiers dans `src/templates/` :
- `base.html` - Structure principale
- `header.html` - En-tête
- `article.html` - Structure d'un article
- `category.html` - Section de catégorie
- `sources.html` - Section des sources

### Ajouter des Validations

Modifier `src/scripts/validator.js` pour ajouter de nouvelles règles.

## 📊 Avantages

### Avant (Ancien Système)
- ❌ CSS dupliqué dans chaque fichier (~200 lignes × 15 fichiers = 3000 lignes)
- ❌ Génération manuelle
- ❌ Pas de validation
- ❌ Noms de fichiers inconsistants

### Après (Nouveau Système)
- ✅ CSS centralisé (1 fichier)
- ✅ Génération automatisée
- ✅ Validation automatique
- ✅ Noms de fichiers standardisés (ISO 8601)
- ✅ Templates réutilisables
- ✅ Structure organisée

## 🐛 Dépannage

### Erreur: "Data file not found"
→ Créer `data/newsletter-data.json` avec la structure correcte

### Erreur: "Validation failed"
→ Vérifier les erreurs affichées et corriger le JSON

### Erreur: "Template not found"
→ Vérifier que tous les fichiers templates existent dans `src/templates/`

## 🔄 Migration depuis l'Ancien Système

Les anciens fichiers HTML restent fonctionnels. Pour migrer :

1. Extraire les données d'un ancien HTML
2. Créer le JSON correspondant
3. Générer avec le nouveau système

## 📚 Exemple Complet

Voir `data/newsletter-data.example.json` pour un exemple complet.

---

**Note:** Ce système est rétrocompatible - les anciens fichiers HTML continuent de fonctionner.
