Make me a summary of the main AI news for the week that just ended.
I will give you the last day to review.

I want a bullet point answer with the main news concerning AI.
I want a title for each news with two lines of description / text.
Rank me these news from the most important to the less one. I want at least 25 news with three zones: critical, important, good to know.

---

## SOURCES

### Méthode de collecte
1. **Gmail** : Scanner mes emails pour trouver les 18 newsletters de la semaine demandée
2. **URLs de fallback** : Si les emails ne sont pas trouvés, scraper les URLs ci-dessous avec les outils MCP (parallel search, firecrawl, tavily)

### Les 18 newsletters (SOURCES EXCLUSIVES)
Utiliser **UNIQUEMENT** ces 18 newsletters curatées. Ne pas aller chercher ailleurs :

1. **Alpha Signal** : https://alphasignal.ai/last-email/
2. **Mozza Bytes** : https://mozzabytes.substack.com/
3. **Upmynt** : https://www.upmynt.com/
4. **NLP Newsletter** (Elvis Saravia) : https://nlp.elvissaravia.com/
5. **The AI Report** : https://www.theaireport.ai/newsletters
6. **TLDR AI** : https://tldr.tech/ai
7. **AI Tidbits** (Sahar Mor) : https://www.aitidbits.ai/
8. **Superhuman** (Zain Kahn) : https://www.superhuman.ai/
9. **IA Ethique Insider** (Daphnée) : https://iaethiqueinsider.substack.com/
10. **Human in the Loop** (Andreas Horn) : https://www.humanintheloop.online/
11. **Aakash's Newsletter** : https://www.news.aakashg.com/
12. **Millefeuille AI** : https://millefeuilleai.substack.com/
13. **TechBuzz China** : https://techbuzzchina.substack.com/
14. **The Rundown AI** : https://www.therundown.ai/
15. **DeepLearning.AI - The Batch** : https://www.deeplearning.ai/the-batch/
16. **Interconnects** : https://www.interconnects.ai/
17. **Latent Space** : https://www.latent.space/
18. **AI Ramblings** : https://airesearch.substack.com/

### Règles sur les sources
- **PAS DE SOURCES EXTERNES** : Ne pas utiliser CNBC, Forbes, MIT Tech Review, WSJ, Bloomberg ou autres sites d'actualité généralistes
- Les 18 newsletters contiennent suffisamment de news pour remplir les 25 articles minimum
- Assurer un équilibre entre les 18 sources (max 3 articles de différence entre sources)
- Les liens dans la newsletter doivent respecter la priorité éditoriale suivante :
  1. lien public vers la newsletter source quand il existe
  2. sinon article tiers qui couvre la news
  3. sinon seulement lien officiel / vendor en dernier recours

Use the ai_newsletter_minimal.html file as a template

below the title you must write down design by Dagorsey & Claude
below this you must write down the start and end date of the week
below this date you must write down that the sources are available at the end of the newsletter
at the end of the newsletter you must write down all the sources you used for this news letter specifically

the title of the weekly review will always be "AI Weekly"

please provide the precise and unique link for each news
put the link in the title of the news as a hyperlink

be a hundred times more specific
I want the revue to be in french

---

## CONTRAINTES STRICTES ABSOLUES

### RÈGLE D'OR #1 : PRIORITÉ ÉDITORIALE DES LIENS
- **INTERDICTION ABSOLUE** de choisir un lien officiel si une newsletter source publique ou un bon article tiers est disponible
- **PRIORITÉ OBLIGATOIRE** :
  1. `sourceNewsletterUrl`
  2. `thirdPartyUrl`
  3. `officialUrl`
- **OBLIGATION** : le champ `url` final doit toujours correspondre à la meilleure option disponible selon cette priorité
- **VÉRIFICATION OBLIGATOIRE** : documenter le type retenu avec `urlType`

### RÈGLE D'OR #1B : URLs DIRECTES UNIQUEMENT
- **INTERDICTION ABSOLUE** de mettre des URLs de page d'accueil génériques (ex: `https://alphasignal.ai/`, `https://tldr.tech/ai`)
- **OBLIGATION** : Chaque URL doit pointer vers une page SPÉCIFIQUE
- **FORMAT REQUIS** : Lien direct vers un post de newsletter, un article tiers précis, ou un lien officiel précis en dernier recours
- **VÉRIFICATION OBLIGATOIRE** : Vérifier que l'URL mène bien à une page spécifique et non à une page générique

### RÈGLE D'OR #2 : CONTENU CONCRET ET SPÉCIFIQUE
- **TITRES** : Doivent contenir des noms propres (entreprises, produits, modèles) - ex: "Kimi K2.5", "Gemini 3", "Claude Opus"
- **DESCRIPTIONS** : 2-3 phrases avec détails techniques, chiffres, dates précises
- **EXEMPLE BON** : "Moonshot AI lance Kimi K2.5 avec Agent Swarm à 100 sous-agents, pré-entraîné sur 15T tokens"
- **EXEMPLE MAUVAIS** : "Nouveau modèle IA lancé cette semaine"
- **INTERDICTION** : Pas de descriptions vagues ou génériques

### RÈGLE D'OR #3 : PAS DE PLACEHOLDERS
- **INTERDICTION ABSOLUE** d'articles génériques ou inventés
- Chaque article doit correspondre à une VRAIE actualité publiée dans les newsletters
- Si une source n'a pas d'article pour la période, ne pas inventer - utiliser une autre source

---

## POINTS D'ATTENTION CRITIQUES

### Vérification des dates
- **OBLIGATOIRE** : Chaque article doit avoir une date de publication dans la période demandée
- Format des dates : "27 janvier 2026", "28-29 janvier 2026" si plusieurs jours
- Ne jamais inclure d'articles datant de mois précédents
- En cas de doute sur la date, exclure l'article

### Vérification des liens - PROCESSUS STRICT
1. **AVANT** d'ajouter un article, vérifier qu'au moins une URL candidate est directe et fonctionnelle
2. **REMPLIR LES CHAMPS DE TRAÇABILITÉ** :
   - `sourceNewsletterUrl` si la newsletter source publique existe
   - `thirdPartyUrl` si un bon article tiers existe
   - `officialUrl` seulement en fallback
3. **CHOISIR `url`** en appliquant strictement la priorité newsletter source > article tiers > officiel
4. **RENSEIGNER `urlType`** avec `newsletter`, `third_party` ou `official`
5. **SI `urlType = official`** : ajouter `urlReason` pour expliquer pourquoi aucun meilleur lien n'était disponible
6. **DOUBLE VÉRIFICATION** : tester chaque lien dans le JSON final

### Qualité du contenu
- Minimum 25 articles vérifiés
- Équilibre entre les 3 catégories : Critique (8-10), Important (8-10), Bon à Savoir (7-10)
- **PAS DE DOUBLONS** : Une seule entrée par sujet/actualité
  - Choisir la source la plus fiable ou la plus complète
  - Ne pas inclure les "angles différents" du même sujet
- **LIENS** : privilégier la newsletter source publique, puis un article tiers, et garder l’annonce officielle seulement en dernier recours

### Structure des articles
Chaque article DOIT avoir :
- **title** : Titre spécifique avec nom de produit/entreprise
- **url** : Lien final retenu selon la priorité éditoriale
- **urlType** : `newsletter`, `third_party`, ou `official`
- **sourceNewsletterUrl** : URL de la newsletter source si disponible
- **thirdPartyUrl** : URL d’un article tiers si disponible
- **officialUrl** : URL officielle uniquement en fallback
- **urlReason** : justification textuelle si `urlType` vaut `official`
- **description** : 2-3 phrases avec détails techniques/concrets
- **source** : Nom exact de la newsletter
- **date** : Date précise dans la période demandée

### Processus de génération
1. Scraper les 18 sources pour la période demandée (27-31 janvier 2026)
2. Identifier les articles avec viralité (nombre de sources mentionnant le même sujet)
3. Classer par importance : Critique (5+ sources), Important (2-4 sources), Bon à Savoir (1 source)
4. **REMPLIR LES CANDIDATS DE LIEN** (`sourceNewsletterUrl`, `thirdPartyUrl`, `officialUrl`)
5. **SÉLECTIONNER `url` ET `urlType`** selon la priorité newsletter source > article tiers > officiel
6. Rédiger titres et descriptions en français avec spécificité
7. Vérifier JSON : 25+ articles, URLs directes, dates correctes, priorité éditoriale respectée
8. Exécuter `node scripts/generate.js`
9. Vérifier le HTML généré
10. Remplacer `index.html` par la nouvelle version

### Publication sur GitHub
- **TOUJOURS** remplacer `index.html` par la nouvelle newsletter
- **TOUJOURS** créer une branche depuis `master` pour la PR
- **TOUJOURS** inclure `index.html` et `prompt revue fr.md` (si modifié) dans le commit
- Format du nom de branche : `update-newsletter-[dates]` (ex: `update-newsletter-jan27-31`)
- Utiliser GitHub CLI (`gh pr create`) ou le lien web pour créer la PR
