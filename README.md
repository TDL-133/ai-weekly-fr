# AI Weekly - Revue de Presse IA en Français

Newsletter hebdomadaire des actualités IA en français, conçue par Dagorsey & Claude.

## 📰 Dernière édition

**Période :** 5 avril au 11 avril 2026

[Voir la newsletter](./dist/archive/AI_Weekly_2026-04-05_to_2026-04-11.html)

## 📊 Contenu

Cette newsletter compile et traduit en français les meilleures actualités IA de la semaine, organisées en trois catégories :

- 🔴 **Critique** : Annonces majeures, changements réglementaires significatifs, évolutions bouleversant l'industrie
- 🟡 **Important** : Développements notables, recherches significatives, partenariats importants  
- 🟢 **Bon à Savoir** : Mises à jour intéressantes, tendances émergentes, outils utiles

## 🌐 Sources

Les actualités sont compilées à partir des newsletters et sources suivantes :

- [Alpha Signal](https://alphasignal.ai/last-email/)
- [Mozza Bytes](https://mozzabytes.substack.com/)
- [Upmynt](https://www.upmynt.com/)
- [NLP Newsletter (Elvis Saravia)](https://nlp.elvissaravia.com/)
- [The AI Report](https://www.theaireport.ai/newsletters)
- [TLDR AI](https://tldr.tech/ai)
- [AI Tidbits (Sahar Mor)](https://www.aitidbits.ai/)
- [Superhuman (Zain Kahn)](https://www.superhuman.ai/)
- [IA Ethique Insider (Daphnée)](https://iaethiqueinsider.substack.com/)
- [Human in the Loop (Andreas Horn)](https://www.humanintheloop.online/)

Pour l’édition du 5 au 11 avril 2026, 8 de ces sources ont publié un numéro pertinent et exploitable sur la période ciblée.

## 📝 À propos

Cette newsletter est générée avec l'aide de Claude (Anthropic) et conçue pour offrir une vue d'ensemble rapide et en français des développements les plus importants dans le domaine de l'intelligence artificielle.

## 🛠️ Mises à jour récentes

- **11 avril 2026** : nouvelle édition générée pour la période du 5 au 11 avril 2026, avec 25 actualités réparties sur 8 sources actives. Mozza Bytes et AI Tidbits n’avaient pas de numéro pertinent pour la période.
- **11 janvier 2026** : Implémentation de la méthode de répartition équilibrée des sources (voir [documentation](./docs/METHODE_REPARTITION_EQUILIBREE.md))
- 8–14 novembre 2025 : ajout de `AI_Weekly_Nov8-14_2025_v2.html` avec harmonisation du style des titres (liens des articles alignés sur les éditions précédentes).

## ⚖️ Méthode de Répartition Équilibrée

Pour garantir une distribution équitable des articles entre les sources actives d’une semaine donnée, nous utilisons une **méthode de répartition équilibrée**.

### Principe

- **Répartition cible** : 2-3 articles par source (pour 25-27 articles au total)
- **Différence maximale** : 1 article entre les sources
- **Toutes les sources actives représentées** : Minimum 1 article par source publiée pour la période visée

### Documentation

📖 Consultez la [documentation complète](./docs/METHODE_REPARTITION_EQUILIBREE.md) pour :
- Les règles détaillées de répartition
- Le processus de sélection des articles
- Les cas particuliers et exceptions
- Des exemples de répartition réussie

### Validation automatique

Utilisez le script de validation pour vérifier que votre newsletter respecte la méthode :

```bash
node scripts/validate-balance.js index.html
```

Le script vérifie :
- ✅ Toutes les 10 sources historiques sont représentées
- ✅ Différence maximale ≤ 1 article
- ✅ Total d'articles entre 25-27
- ✅ Répartition des catégories respectée

Note : ce contrôle reflète encore la règle historique à 10 sources. Pour l’édition du 5 au 11 avril 2026, la validation principale à retenir est `npm run validate`, car seules 8 sources avaient publié un contenu exploitable cette semaine.

## 🚀 Workflow de Publication

Ce projet utilise des scripts automatisés pour gérer le workflow hebdomadaire des newsletters avec Git worktrees.

### Scripts Disponibles

- **`newsletter.sh`** : Script principal pour gérer les newsletters
- **`new-week.sh`** : Script rapide pour créer une newsletter de la semaine
- **`generate-archive.sh`** : Génère une page d'archive HTML

### Créer une Nouvelle Newsletter

#### Option 1 : Script rapide (recommandé)
```bash
./new-week.sh
```
Ce script détecte automatiquement la semaine en cours et vous demande si vous voulez créer la newsletter pour cette semaine ou la semaine prochaine.

#### Option 2 : Script principal avec dates
```bash
# Créer une newsletter pour une période spécifique
./newsletter.sh create 2026-01-09 2026-01-15
```

Le script va :
- Créer une nouvelle branche Git (`newsletter-YYYYMMDD`)
- Créer un worktree dans `../worktrees/newsletter-YYYYMMDD`
- Copier le template vers le nouveau fichier HTML
- Vous donner les instructions pour la suite

### Éditer une Newsletter

1. Naviguez vers le worktree créé :
   ```bash
   cd ../worktrees/newsletter-20260109
   ```

2. Éditez le fichier HTML (ex: `AI_Weekly_Jan09-15-2026.html`)

3. Utilisez le template `revue fr template.html` comme référence

### Publier une Newsletter

Une fois votre newsletter terminée :

```bash
# Depuis le répertoire principal
./newsletter.sh publish newsletter-20260109

# Ou depuis le worktree (le script détectera automatiquement la branche)
cd ../worktrees/newsletter-20260109
../newsletter.sh publish
```

Le script va :
- Commiter tous les changements
- Vous demander si vous voulez pousser vers le remote
- Vous proposer de merger vers la branche main/master

### Autres Commandes Utiles

```bash
# Lister toutes les newsletters
./newsletter.sh list

# Générer une page d'archive
./generate-archive.sh archive.html

# Nettoyer les worktrees mergés
./newsletter.sh cleanup

# Afficher l'aide
./newsletter.sh help
```

### Structure des Worktrees

Les worktrees sont créés dans `../worktrees/` par défaut. Chaque newsletter a :
- Sa propre branche Git (`newsletter-YYYYMMDD`)
- Son propre répertoire de travail
- Son fichier HTML avec le nom formaté automatiquement

### Variables d'Environnement

Vous pouvez personnaliser le comportement avec des variables d'environnement :

```bash
# Changer le répertoire de base du repo
REPO_DIR=/path/to/repo ./newsletter.sh create 2026-01-09 2026-01-15

# Changer l'emplacement des worktrees
WORKTREE_BASE=/custom/path/worktrees ./newsletter.sh create 2026-01-09 2026-01-15
```

### Workflow Complet

1. **Créer** : `./new-week.sh` ou `./newsletter.sh create <date>`
2. **Éditer** : Ouvrir le fichier HTML dans le worktree
3. **Publier** : `./newsletter.sh publish <branch-name>`
4. **Archiver** : `./generate-archive.sh` (optionnel, pour mettre à jour l'index)

## 📄 Licence

Contenu sous licence MIT.
