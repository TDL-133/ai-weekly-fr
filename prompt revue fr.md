Make me a summary of the main AI news for the week that just ended.
I will give you the last day to review.

I want a bullet point answer with the main news concerning AI.
I want a title for each news with two lines of description / text.
Rank me these news from the most important to the less one. I want at least 25 news with three zones: critical, important, good to know.

---

## SOURCES

### Méthode de collecte
1. **Gmail** : Scanner mes emails pour trouver les 10 newsletters de la semaine demandée
2. **URLs de fallback** : Si les emails ne sont pas trouvés, scraper les URLs ci-dessous avec les outils MCP (parallel search, firecrawl, tavily)

### Les 10 newsletters (SOURCES EXCLUSIVES)
Utiliser **UNIQUEMENT** ces 10 newsletters curatées. Ne pas aller chercher ailleurs :

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

### Règles sur les sources
- **PAS DE SOURCES EXTERNES** : Ne pas utiliser CNBC, Forbes, MIT Tech Review ou autres sites d'actualité
- Les 10 newsletters contiennent suffisamment de news pour remplir les 25 articles minimum
- Assurer un équilibre entre les 10 sources
- Les liens dans la newsletter doivent pointer vers les articles originaux mentionnés dans les newsletters

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

## POINTS D'ATTENTION CRITIQUES

### Vérification des dates
- **OBLIGATOIRE** : Chaque article doit avoir une date de publication dans la période demandée
- Ne jamais inclure d'articles datant de mois précédents (ex: septembre quand on demande décembre)
- En cas de doute sur la date, exclure l'article

### Vérification des liens
- **OBLIGATOIRE** : Chaque URL doit pointer vers l'article spécifique, PAS vers une page d'accueil
- Tester chaque lien avant de l'inclure dans la newsletter
- Format attendu : URL directe vers l'article (ex: `https://site.com/2025/12/30/titre-article`)
- Format à éviter : Page d'accueil ou archive (ex: `https://site.com/` ou `https://site.com/newsletters`)
- Exception : Pour Alpha Signal, utiliser `https://alphasignal.ai/last-email/` car c'est l'URL stable de la dernière édition

### Qualité du contenu
- Minimum 25 articles vérifiés
- Équilibre entre les 3 catégories : Critique (8-10), Important (8-10), Bon à Savoir (7-10)
- **PAS DE DOUBLONS** : Une seule entrée par sujet/actualité, même si plusieurs sources en parlent
  - Exemple : Si 5 articles parlent de "Nvidia achète Groq", n'en garder qu'un seul (la source primaire)
  - Choisir la source la plus fiable ou la plus complète
  - Ne pas inclure les "angles différents" du même sujet (analyse, implications, réactions...)
- Privilégier les sources primaires aux reprises

### Processus de génération
1. Scraper toutes les sources pour la période demandée
2. Vérifier la date de chaque article trouvé
3. Vérifier que chaque URL est fonctionnelle et pointe vers le bon article
4. Catégoriser selon l'importance
5. Traduire titres et descriptions en français
6. Générer le HTML final avec le template

