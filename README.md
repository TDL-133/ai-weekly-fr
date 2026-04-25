# AI Weekly - Revue de Presse IA en Français

Newsletter hebdomadaire des actualités IA en français, conçue par Dagorsey & Claude.

## 📰 Dernière édition

**Période :** 20 avril au 25 avril 2026

[Voir la newsletter](./dist/archive/AI_Weekly_2026-04-20_to_2026-04-25.html)

## 📊 Contenu

Cette newsletter compile et traduit en français les meilleures actualités IA de la semaine, organisées en trois catégories :

- 🔴 **Critique** : Annonces majeures, changements réglementaires significatifs, évolutions bouleversant l'industrie
- 🟡 **Important** : Développements notables, recherches significatives, partenariats importants  
- 🟢 **Bon à Savoir** : Mises à jour intéressantes, tendances émergentes, outils utiles

## 🌐 Sources

Les actualités sont compilées à partir des newsletters et sources suivantes :

- [Alpha Signal](https://alphasignal.ai/last-email/)
- [AINews](https://buttondown.com/ainews)
- [Mozza Bytes](https://mozzabytes.substack.com/)
- [Upmynt](https://www.upmynt.com/)
- [NLP Newsletter (Elvis Saravia)](https://nlp.elvissaravia.com/)
- [The AI Report](https://www.theaireport.ai/newsletters)
- [TLDR AI](https://tldr.tech/ai)
- [AI Tidbits (Sahar Mor)](https://www.aitidbits.ai/)
- [Superhuman (Zain Kahn)](https://www.superhuman.ai/)
- [IA Ethique Insider (Daphnée)](https://iaethiqueinsider.substack.com/)
- [Human in the Loop (Andreas Horn)](https://www.humanintheloop.online/)

Pour l’édition du 20 au 25 avril 2026, la hiérarchie a été recalée sur la **convergence inter-sources** : les sujets qui remontent le plus dans plusieurs newsletters passent avant la simple fraîcheur ou la seule répartition équilibrée. Cette édition retient 8 sources actives exploitées sur la période : Alpha Signal, AINews, Mozza Bytes, Upmynt, The AI Report, TLDR AI, Superhuman et IA Ethique Insider.

## 🔗 Règle éditoriale des liens

Chaque article doit suivre la priorité suivante :

1. **lien public vers la newsletter source** quand il existe
2. **sinon article tiers** qui couvre la news
3. **sinon lien officiel** seulement en dernier recours

Cette règle est maintenant encodée dans :

- `config/editorial-link-policy.json`
- `src/scripts/validator.js`
- `scripts/normalize-links.js`

Le validateur attend désormais les métadonnées suivantes dans chaque article :

- `url`
- `urlType`
- `sourceNewsletterUrl`
- `thirdPartyUrl`
- `officialUrl`
- `urlReason` si `urlType` vaut `official`

Le build échoue si :

- un lien de priorité inférieure est choisi alors qu’un meilleur lien existe
- `url` ne correspond pas au type déclaré
- un lien officiel est utilisé sans justification

La normalisation de `url` et `urlType` est maintenant automatique :

- `npm run normalize-links`
- `npm test`
- `npm run validate`
- `npm run build`

Ces commandes recalculent d’abord `url` à partir de :

1. `sourceNewsletterUrl`
2. `thirdPartyUrl`
3. `officialUrl`

Le process de pré-édition est maintenant intégré au build :

- `npm run build` lance automatiquement `npm test`
- puis la validation
- puis la génération HTML finale

Autrement dit, `npm run build` est désormais la commande de contrôle complète avant publication.

Les tests couvrent le playbook de génération :

- priorité automatique des liens
- erreurs bloquantes du validateur
- génération HTML d’une newsletter conforme
- présence stricte des sections `Critique`, `Important`, `Bon à Savoir`
- comptage exact des articles par catégorie
- fixtures dédiées dans `tests/fixtures/`

## 📝 À propos

Cette newsletter est générée avec l'aide de Claude (Anthropic) et conçue pour offrir une vue d'ensemble rapide et en français des développements les plus importants dans le domaine de l'intelligence artificielle.

## 🛠️ Mises à jour récentes

- **25 avril 2026** : édition recalée pour la période du 20 au 25 avril 2026, avec 25 actualités hiérarchisées par convergence inter-sources et 8 sources actives retenues.
- **25 avril 2026** : règle éditoriale de priorité des liens automatisée dans la configuration et le validateur (`newsletter > third_party > official`).
- **19 avril 2026** : nouvelle édition générée pour la période du 12 au 19 avril 2026, avec 25 actualités réparties sur 10 sources actives.
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

Note : ce contrôle reflète la règle historique à 10 sources. Pour l’édition du 20 au 25 avril 2026, la priorité éditoriale a été déplacée vers la convergence inter-sources ; la répartition reste un garde-fou utile, mais elle n’est plus le critère principal de classement pour cette semaine.

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
