# Vérifier les pages de LABO

Un contrôle statique de conformité au gabarit standard (`conformite.mjs`, Node seul) et deux scripts Playwright qui ouvrent les pages dans un vrai navigateur (sans navigateur à télécharger : Edge ou Chrome déjà installé). Ils complètent, sans les remplacer, les tests de moteurs de [`prompts/moteurs/`](../../prompts/moteurs/) et surtout **la relecture des captures** : un test qui passe ne dit rien d'un dessin décalé.

## Mise en route

```bash
# 1. À la racine du dépôt : servir en HTTP (le corpus ne se lit pas en file://)
python -m http.server 4350 --directory .

# 2. Dans outils/qa/, une seule fois
npm install
```

Variables d'environnement, toutes facultatives :

| Variable | Défaut | Rôle |
|---|---|---|
| `LABO_URL` | `http://localhost:4350/` | Racine du dépôt servie en HTTP, avec la barre oblique finale. |
| `LABO_NAVIGATEUR` | `msedge` | `chrome` pour utiliser Chrome. |
| `LABO_EXECUTABLE` | (aucune) | Chemin d'un exécutable Chromium, pour `qa_migrees.js` seulement ; remplace le canal. |

## La conformité au gabarit : `conformite.mjs`

Lecture statique des fichiers, sans navigateur ni `npm install`, depuis la racine du dépôt :

```bash
node outils/qa/conformite.mjs                                # toutes les pages : format et erreurs
node outils/qa/conformite.mjs fondations-langage --strict    # une page neuve ou migrée : doit sortir sans erreur
node outils/qa/conformite.mjs --markdown                     # tableau pour corpus/standards.md §4.5
```

Pour chaque dossier de `opus-sonnet/`, il dit si la planche est à **fiche d'étape** ou encore à **couches**, si l'explication est en **cours interactif** ou à l'ancien format, et, pour ce qui est au standard, vérifie les règles de [`labo/GABARIT.md`](../../labo/GABARIT.md) : ordre des feuilles de style et des scripts, `body` et coque, KaTeX, fiche branchée (`Fiche.init`, `Fiche.montre`, `window.allerScene`), 2 à 4 étapes `NN.k` par chapitre de fondation, sept rubriques et leurs ids, trois quiz dans Teste-toi, pas à pas, ids uniques, liens internes, scènes intégrées en `?embed` vers une étape qui existe. `✗` est une erreur, `·` un avertissement (quantités visées : 2 scènes intégrées, 2 ou 3 calculs vivants, une question dans les relations).

Code de sortie 1 si une page au standard a une erreur, ou si `--strict` vise une page pas encore migrée ; 2 si un dossier n'existe pas. Il ne remplace ni le rendu (`qa_migrees.js`, `qa_theorie.js`) ni la relecture.

## Les planches : `qa_migrees.js`

```bash
node qa_migrees.js 01-mitose,02-respiration
node qa_migrees.js fondations-chaos sans-captures
```

Le premier argument est la liste des **dossiers** de `opus-sonnet/`, séparés par des virgules ; `sans-captures` en second argument évite d'écrire des images. Pour chaque page, le script l'ouvre en 1366 × 768 (thème clair) puis en 375 px (thème sombre), clique chaque étape, passe en Manipuler puis en Comprendre sur une page à couches, et écrit **une ligne JSON par page** : présence de la coque, chapitres et nombre d'étapes, débordement horizontal, bas des contrôles comparé à la hauteur d'écran, étape marquée, surtitre, lien de théorie, erreurs de console et requêtes en échec. Sur une page à fiche, chaque mesure d'étape donne aussi le titre de la fiche montrée (`fiche`) et `cochesSansGeste`, le nombre d'essais cochés sans aucune action, qui doit rester à 0. Les captures vont dans `captures/` (ignoré par git).

Limites :

- Il **suppose la coque commune** (`header.barre`, `nav.chapitres`, couches ou fiche d’étape) : sur une page qui ne la charge pas, il ne mesure rien d'utile. Au 2026-10-13, toutes les pages construites la chargent.
- Il contient un traitement propre à `03-neurone` (attendre que la caméra entre dans la synapse).
- Il ne juge pas la justesse scientifique : celle-là se vérifie dans les tests de moteurs et par relecture.

Une page migrée est acceptée quand : coque complète ; chaque étape s'ouvre et est marquée ; console propre ; aucun débordement à 375 px ; écran et contrôles dans 1366 × 768 ; thèmes clair et sombre lisibles ; aucune fonctionnalité perdue (boutons, curseurs, raccourcis). Le 404 de `favicon.ico` sur le serveur local est sans importance.

## Les explications : `qa_theorie.js`

```bash
node qa_theorie.js fondations-chaos,fondations-optique
```

Ouvre `explication.html` en 1440 et 375 px, attend que KaTeX soit prêt, puis compte les sections `.module`, les formules rendues, les erreurs KaTeX, le LaTeX brut resté à l'écran, le débordement et les mots par section (repère de `corpus/standards.md` §2 : 800 à 1 150 mots de prose par module).

## Les moteurs : `prompts/moteurs/*.test.js`

Ces tests tournent avec Node seul, sans navigateur ni installation, depuis la racine du dépôt :

```bash
node prompts/moteurs/optique.test.js                                       # le moteur de référence
node prompts/moteurs/optique.test.js opus-sonnet/fondations-optique/index.html   # le bloc copié dans la page, et son identité avec la référence
```

Au 2026-10-13, les 15 fichiers de tests passent (0 échec), y compris dans leur forme à deux arguments pour `optique`, `chaos` et `quantique` (les autres n'ont pas été essayés ainsi). Le message final diffère d'un fichier à l'autre ; `quantique` précise « bloc de page identique ». `reactions-chimiques.test.js` prend environ une minute et demie.

Convention : le moteur est écrit et testé **avant** la page, versionné dans `prompts/moteurs/<nom>.js`, puis copié tel quel entre ses marqueurs dans la page ; la page ne le modifie jamais.
