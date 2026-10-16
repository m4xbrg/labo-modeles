# CONTRAT — construire une page de fondations de LABO (exécutant externe)

Tu construis une page du laboratoire LABO : une planche interactive (`index.html`) et sa théorie (`explication.html`), plus le moteur scientifique qui les alimente et ses tests. Tu **ne vois pas le dépôt** : tout ce dont tu as besoin est en pièces jointes (voir la liste en fin de message) et dans le brief qui suit. Ce que tu rends sera relu et testé par quelqu'un d'autre ; ne prétends jamais avoir exécuté ce que tu n'as pas exécuté.

## Les règles sont celles de LABO — avec ces adaptations

Lis, dans l'ordre : `corpus/standards.md`, `prompts/SESSION-FONDATION.md` (**partie 2 « Règles communes »** seulement), `prompts/00-direction-artistique.md`, `labo/GABARIT.md`, puis le brief ci-dessous. Elles s'appliquent **intégralement**, sauf :

1. **Pas d'orchestrateur ni de sous-agents** : tu fais tout, seul. La partie 1 de `SESSION-FONDATION.md` ne te concerne pas.
2. **Pas de git, pas de PR, pas de mise à jour du corpus** : tu ne touches à aucun fichier de `corpus/`, à `README.md` ni à `FEUILLE-DE-ROUTE.md`. À la place, tu écris une **fiche corpus** dans `LIVRAISON.md` (voir plus bas).
3. **Gabarit standard (depuis le 2026-10-15) : planche à fiche d'étape.** Référence : `opus-sonnet/fondations-langage/index.html` (jointe), à imiter. La coque commune est chargée par `../../labo/labo.css`, `../../labo/planche-etapes.css`, `../../labo/fiche.css`, `../../labo/theme.js`, `../../labo/fiche.js` et `../../labo/planche.js` (joints, **ne les modifie pas et ne les recopie pas**) : `labo.css` AVANT le `<style>` de la page, `planche-etapes.css` puis `fiche.css` APRÈS, `fiche.js` avant `Fiche.init`, `planche.js` en dernier. `<body class="labo-etapes labo-fiche" data-mode="fiche">`, sans couches ni `data-touches` ; une fiche par scène (section « La planche à fiche d'étape » de `GABARIT.md`). Si le brief parle de couches Observer / Manipuler / Comprendre, c'est le format d'avant : suis le gabarit standard.
4. **Explication en cours interactif.** Référence : `opus-sonnet/fondations-langage/explication.html` (jointe) pour la forme, avec `labo/cours.css` et `labo/cours.js` (joints) ; le plan de `standards.md` §2 et les quantités du §4.3 font foi.
5. **Le moteur est un livrable**, pas un fichier de scratchpad : `prompts/moteurs/<nom>.js` entre les marqueurs du brief, et `prompts/moteurs/<nom>.test.js` qui suit **exactement** la convention des moteurs existants : `node prompts/moteurs/<nom>.test.js` teste le moteur de référence ; `node prompts/moteurs/<nom>.test.js opus-sonnet/<dossier>/index.html` teste le bloc copié dans la page **et vérifie qu'il est identique** au moteur de référence. `<nom>` est le nom de dossier sans le préfixe `fondations-`. Tous les « Tests du moteur » du brief y figurent, avec les tolérances du brief.
6. Tu n'as peut-être pas Node dans ton environnement : essaie de lancer les tests ; si tu ne peux pas, **écris « non exécuté »** dans `LIVRAISON.md`. Dans tous les cas, recalcule à la main ou en Python les valeurs de référence les plus risquées du brief et donne l'écart.

## Ce que tu livres

Un `.zip` (voir le format ci-dessous) contenant **exactement** :

- `opus-sonnet/<dossier>/index.html` et `opus-sonnet/<dossier>/explication.html` ;
- `prompts/moteurs/<nom>.js` et `prompts/moteurs/<nom>.test.js` ;
- `LIVRAISON.md`.

Rien d'autre. Pas d'image, pas de fichier de configuration. Bibliothèques : seulement ce que les règles communes autorisent.

## `LIVRAISON.md` — sections obligatoires

1. **Fichiers livrés** et ce que tu as réellement exécuté (résultat exact des tests, ou « non exécuté »).
2. **Contrôle scientifique** — c'est ce que relira un réviseur qui ne lira pas tout ton code. Pour chaque grandeur affichée à l'écran : sa formule, son unité, la valeur des constantes utilisées avec leur source (CODATA, NIST ou autre, nommée), et les 3 à 5 vérifications numériques les plus importantes avec valeur calculée, valeur attendue et écart. Liste honnêtement chaque simplification de la simulation (dans le même esprit que « Ce que la simulation simplifie » de l'explication).
3. **Fiche corpus** — un bloc JSON prêt à fusionner : l'entrée `models.json` de la page (champs `id`, `title`, `path`, `explanation`, `type: "foundation"`, `status: "built"`, `production`, `modules` avec leur `coverage` **honnête** `full | partial | supporting`, `parts_kind: "step"`, `parts` (titres des étapes), `interactivity`, `notes` avec les limites connues), plus pour chaque module touché : la couverture proposée et ce qui manque si elle est `partial`.
4. **Hypothèses et écarts au brief**, avec la raison de chacun.
5. **Vérification visuelle non faite** : liste ce qu'un humain doit regarder (tu ne peux pas ouvrir la page dans un navigateur).

Un seul exemplaire de chaque fichier ; si tu hésites entre deux versions, livres-en une et explique ton choix.

## Pièces à joindre à la conversation (une fois, dans un Projet ChatGPT si possible)

`corpus/standards.md` · `prompts/SESSION-FONDATION.md` · `prompts/00-direction-artistique.md` · `labo/GABARIT.md` · `labo/labo.css` · `labo/planche-etapes.css` · `labo/fiche.css` · `labo/fiche.js` · `labo/planche.js` · `labo/theme.js` · `labo/cours.css` · `labo/cours.js` · `labo/theorie.js` · `opus-sonnet/fondations-langage/index.html` · `opus-sonnet/fondations-langage/explication.html` · `prompts/moteurs/atomes.test.js` (modèle de convention de test)

Un Projet ChatGPT créé avant le 2026-10-15 avec l'ancienne liste (bioélectricité, `planche.css`, `theorie.css`) doit recevoir ces pièces avant de lancer un nouveau lot.
