# Méthode de Répartition Équilibrée des Sources

## Vue d'ensemble

Cette méthode garantit une distribution équilibrée des articles de la newsletter AI Weekly entre les 10 sources exclusives, en évitant la sur-représentation de certaines sources au détriment d'autres.

## Principe fondamental

**Assurer un équilibre entre les 10 sources** - Chaque source doit être représentée de manière équitable dans la newsletter finale.

## Règles de répartition

### Pour une newsletter de 27 articles (standard)

**Répartition cible :**
- **7 sources** avec **3 articles** chacune = 21 articles
- **3 sources** avec **2 articles** chacune = 6 articles
- **Total : 27 articles**

### Pour une newsletter de 25 articles (minimum)

**Répartition cible :**
- **5 sources** avec **3 articles** chacune = 15 articles
- **5 sources** avec **2 articles** chacune = 10 articles
- **Total : 25 articles**

### Règle de tolérance

- **Maximum de différence entre sources : 1 article**
- Exemple acceptable : 3 sources à 3 articles, 7 sources à 2 articles (total 23 articles)
- Exemple inacceptable : 1 source à 7 articles, 1 source à 6 articles, 8 sources à 0 article

## Processus de sélection

### Étape 1 : Collecte initiale
1. Scraper **toutes les 10 sources** pour la période demandée
2. Collecter tous les articles pertinents de chaque source
3. Filtrer par date (période demandée uniquement)

### Étape 2 : Évaluation de l'importance
Pour chaque source, identifier les articles les plus :
- **Viraux** : Articles qui génèrent beaucoup d'engagement
- **Importants** : Annonces majeures, développements significatifs
- **Pertinents** : Articles qui correspondent aux catégories (Critique, Important, Bon à Savoir)

### Étape 3 : Répartition équilibrée
1. **Sélectionner les meilleurs articles** de chaque source (top 2-3 par source)
2. **Distribuer équitablement** en respectant la répartition cible
3. **Ajuster si nécessaire** pour respecter les catégories :
   - Critique : 8-10 articles
   - Important : 8-10 articles
   - Bon à Savoir : 7-10 articles

### Étape 4 : Vérification finale
1. Compter les articles par source
2. Vérifier que la différence maximale entre sources est ≤ 1
3. S'assurer que toutes les sources sont représentées (minimum 1 article par source)

## Exemple de répartition réussie

### Newsletter du 4-10 janvier 2026 (27 articles)

| Source | Nombre d'articles | Statut |
|--------|------------------|--------|
| TLDR AI | 3 | ✅ |
| Superhuman | 3 | ✅ |
| The AI Report | 3 | ✅ |
| NLP Newsletter | 3 | ✅ |
| Alpha Signal | 3 | ✅ |
| Mozza Bytes | 2 | ✅ |
| Upmynt | 2 | ✅ |
| AI Tidbits | 2 | ✅ |
| IA Ethique Insider | 2 | ✅ |
| Human in the Loop | 2 | ✅ |
| **TOTAL** | **27** | ✅ |

**Différence maximale : 1 article** ✅

## Cas particuliers

### Source avec peu de contenu disponible
Si une source n'a pas assez d'articles pertinents pour la période :
1. Inclure au minimum **1 article** de cette source
2. Compenser en réduisant légèrement les sources sur-représentées
3. Documenter la raison dans le commit

### Source avec beaucoup de contenu viral
Si une source a plusieurs articles très viraux :
1. **Limiter à 3 articles maximum** par source
2. Sélectionner les **3 plus importants/viraux**
3. Ne pas dépasser la limite même si d'autres articles sont pertinents

## Validation

### Checklist avant publication
- [ ] Toutes les 10 sources sont représentées
- [ ] Différence maximale entre sources ≤ 1 article
- [ ] Total d'articles entre 25-27
- [ ] Répartition des catégories respectée (Critique: 8-10, Important: 8-10, Bon à Savoir: 7-10)
- [ ] Tous les articles sont dans la période demandée
- [ ] Tous les liens pointent vers les articles originaux

## Outils de vérification

### Script de validation
Utiliser le script `scripts/validate-balance.js` pour valider automatiquement la répartition :

```bash
node scripts/validate-balance.js index.html
```

## Historique

- **11 janvier 2026** : Implémentation de la méthode de répartition équilibrée
- **Branche** : `Balanced`
- **Commit** : `e8d2cc7` - Rééquilibrage de la newsletter : distribution équilibrée des sources (2-3 articles par source)

## Références

- `prompt revue fr.md` : Ligne 33 - "Assurer un équilibre entre les 10 sources"
- `scripts/validate-balance.js` : Script de validation automatique
