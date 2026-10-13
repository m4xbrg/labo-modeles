# Vérifier les pages de LABO

Deux scripts Playwright qui ouvrent les pages dans un vrai navigateur (sans navigateur à télécharger : Edge ou Chrome déjà installé). Ils complètent, sans les remplacer, les tests de moteurs de [`prompts/moteurs/`](../../prompts/moteurs/) et surtout **la relecture des captures** : un test qui passe ne dit rien d'un dessin décalé.

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

## Les planches : `qa_migrees.js`

```bash
node qa_migrees.js 01-mitose,02-respiration
node qa_migrees.js fondations-chaos sans-captures
```

Le premier argument est la liste des **dossiers** de `opus-sonnet/`, séparés par des virgules ; `sans-captures` en second argument évite d'écrire des images. Pour chaque page, le script l'ouvre en 1366 × 768 (thème clair) puis en 375 px (thème sombre), clique chaque étape, passe en Manipuler puis en Comprendre, et écrit **une ligne JSON par page** : présence de la coque, chapitres et nombre d'étapes, débordement horizontal, bas des contrôles comparé à la hauteur d'écran, étape marquée, surtitre, lien de théorie, erreurs de console et requêtes en échec. Les captures vont dans `captures/` (ignoré par git).

Limites :

- Il **suppose la coque commune** (`header.barre`, `nav.chapitres`, couches) : sur une page qui ne la charge pas, il ne mesure rien d'utile. Au 2026-10-13, toutes les pages construites la chargent.
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
