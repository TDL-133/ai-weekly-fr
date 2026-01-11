# Quick Start Guide - AI Weekly Newsletter

## 🚀 Créer une Newsletter (3 étapes)

### 1. Créer la newsletter
```bash
./new-week.sh
```
ou
```bash
./newsletter.sh create 2026-01-09 2026-01-15
```

### 2. Éditer le contenu
```bash
cd ../worktrees/newsletter-20260109
# Éditez AI_Weekly_Jan09-15-2026.html
```

### 3. Publier
```bash
cd ../worktrees/newsletter-20260109
../newsletter.sh publish
```

## 📋 Commandes Essentielles

| Commande | Description |
|---------|-------------|
| `./new-week.sh` | Créer newsletter pour cette semaine |
| `./newsletter.sh create <date>` | Créer avec dates personnalisées |
| `./newsletter.sh publish <branch>` | Publier la newsletter |
| `./newsletter.sh list` | Lister toutes les newsletters |
| `./generate-archive.sh` | Générer page d'archive |
| `./newsletter.sh cleanup` | Nettoyer worktrees mergés |

## 📁 Structure

```
ai-weekly-fr/
├── newsletter.sh          # Script principal
├── new-week.sh            # Helper rapide
├── generate-archive.sh    # Générateur d'archive
├── revue fr template.html # Template
└── ../worktrees/          # Worktrees créés ici
    └── newsletter-YYYYMMDD/
        └── AI_Weekly_*.html
```

## 💡 Astuces

- Les worktrees sont isolés : vous pouvez travailler sur plusieurs newsletters en parallèle
- Chaque newsletter a sa propre branche Git
- Le template est copié automatiquement
- Les dates sont formatées automatiquement dans le nom de fichier

## 🔧 Personnalisation

```bash
# Changer l'emplacement des worktrees
WORKTREE_BASE=/custom/path ./newsletter.sh create 2026-01-09
```
