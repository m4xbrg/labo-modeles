# Handoff : migration des planches LABO au gabarit (pour Codex)

Rédigé le 2026-10-06 par Claude Opus 5.5, qui s'arrête à la limite de session. Tu reprends ce travail dans le dépôt `labo-modeles`, sur la branche **`claude/labo-migration`** (poussée sur GitHub). Réponds à Max en français.

## 1. Le contexte en cinq lignes

- **LABO** = laboratoire de modèles scientifiques interactifs, publié sur GitHub Pages (`https://m4xbrg.github.io/labo-modeles/`, branche `main`).
- **Source de vérité** : `corpus/` (lire `corpus/README.md`, puis `corpus/standards.md`). Les 50 modules canoniques, les modèles, l'Atlas.
- **Accueil** : `labo/index.html` (lit `corpus/*.json`). Les planches sont dans `opus-sonnet/<dossier>/index.html` + `explication.html`.
- **Décisions de Max** (2026-10-04) : coque commune d'abord (faite, en ligne), puis migration des planches au gabarit LABO. Fondations : un chapitre par module canonique, 2 à 4 étapes par chapitre. Théorie des fondations : une section par module, LaTeX (faite, en ligne).
- **Ce que veut dire « migrer »** : on **habille** la simulation existante, on ne la réécrit pas. La scène reste un écran d'instrument sombre (canvas, couleurs, lueurs, JavaScript de simulation intacts) ; tout autour (barre, titre, signature Échelle · Temps · Modèle, chapitres, couches Observer / Manipuler / Comprendre, panneau, contrôles) suit le thème LABO clair ou sombre. **Recette complète : `labo/GABARIT.md`, section « Migrer une planche existante ».**

## 2. État de la branche `claude/labo-migration`

| Commit | Contenu |
|---|---|
| `5733e06` | Pilote : `opus-sonnet/fondations-oscillations-ondes/index.html` migrée ; `labo/planche-etapes.css` ; `planche.js` (touches de couches configurables, hauteur d'écran ajustée) ; recette dans `labo/GABARIT.md`. |
| `c8e40a2` | **Vague 1 faite** : les 12 pages de fondations migrées et vérifiées (Langage, Systèmes, Oscillations, Forces, Rotation, Flux, Matière 07, Champ 04, Courant 06, Cellule, Évolution, Relativité). |
| (non committé au moment du handoff, voir §5) | `outils/qa/` (scripts de vérification), `.gitignore`, ce fichier. |

Aucune PR n'est encore ouverte pour cette branche. `main` contient tout le reste (corpus, accueil, coque, théorie) : PR #15, #19, #20 fusionnées.

## 3. Ce qui reste à faire, dans l'ordre

### 3.1 Vague 2 : migrer les 6 showcases

Mêmes règles que la vague 1, avec deux différences : un **seul chapitre** (le phénomène, ses actes comme étapes), lien de retour **« ← Phénomènes »** vers `../../labo/index.html#phenomenes`, et le lien de fin reste **« Comprendre ce qui se passe »** vers `explication.html` (pas de théorie par module : les showcases ne suivent pas le plan des fondations).

| Dossier | Actes / étapes actuels | Remarques |
|---|---|---|
| `01-mitose` | 7 étapes (tableau `PHASES`) | Frise continue réversible : garder le curseur `#rng`. Touches 1-7 déjà prises. |
| `02-respiration` | 4 étapes + « Tout le trajet » | Curseur d'O₂ `#o2`, frise `scrub`. |
| `03-neurone` | 2 actes (Impulsion, Synapse), chacun avec sous-étapes `STEP1` / `STEP2` | Oscilloscope dans le panneau. |
| `05-ondes-interferences` | 6 actes I-VI | Showcase **hors collection**. |
| `08-replication-adn` | 5 actes | |
| `09-supernova` | 8 actes, frise logarithmique `#tlBox` | Pas de curseur physique (choix du brief). |

Pour un showcase, 2 à 4 étapes n'est **pas** exigé (la règle vaut pour les fondations) : garder ses actes. Code d'étape : `I`, `II`… ou `1`, `2`… comme la page, pas `NN.k`.

### 3.2 Vérifier chaque page (obligatoire, voir §4)

### 3.3 Mettre la documentation à jour

- `corpus/standards.md` §3 : remplacer le tableau « État au 2026-10-04 » par l'état réel après migration (chapitres et nombre d'étapes de chaque page ; toutes les pages de fondations sont désormais conformes).
- `corpus/collections.md` : retirer la phrase « Les planches affichent encore « L'invisible en mouvement — 0N »… » si les showcases migrés n'affichent plus ce libellé.
- `corpus/historique.md` : une ligne datée « migration des planches au gabarit ».
- `README.md` : mentionner que les planches suivent le gabarit LABO.

### 3.4 Publier

1. Commits ciblés (`git add <fichier>` un par un, jamais `git add -A`), message en français, terminé par la ligne d'attribution habituelle de l'outil.
2. `git push` de `claude/labo-migration`, puis PR vers `main` avec `gh pr create`.
3. **Fusionner et publier seulement si Max le demande** (il l'a demandé pour les étapes précédentes, mais redemande). Après fusion : attendre la construction Pages (`gh api repos/m4xbrg/labo-modeles/pages/builds/latest`) et vérifier le site en ligne.

## 4. Vérifier : outils et méthode

Servir la racine du dépôt en HTTP (le corpus ne se lit pas en `file://`) :

```bash
python -m http.server 4350 --directory .
```

Puis, dans `outils/qa/` (une fois : `npm install`, qui n'installe que `playwright-core`, sans télécharger de navigateur ; le script utilise Edge, ou Chrome avec `LABO_NAVIGATEUR=chrome`) :

```bash
node qa_migrees.js 01-mitose,02-respiration
```

Le script ouvre chaque planche en 1366 × 768 (clair) et 375 px (sombre), clique chaque étape, et sort une ligne JSON par page : présence de la coque, chapitres, débordement horizontal, bas des contrôles comparé à la hauteur d'écran, étape marquée, surtitre, lien de théorie, erreurs console. Captures dans `outils/qa/captures/`. **Regarde les captures** : un test qui passe ne dit rien d'un dessin décalé.

`node qa_theorie.js <dossier>,<dossier>` vérifie les pages d'explication (KaTeX rendu, erreurs, débordement).

Critères d'acceptation d'une page migrée : coque complète ; chaque étape s'ouvre et est marquée ; console propre (le 404 de `favicon.ico` sur le serveur local est sans importance) ; aucun débordement à 375 px ; écran et contrôles dans 1366 × 768 ; thèmes clair et sombre lisibles ; aucune fonctionnalité perdue (boutons, curseurs, raccourcis).

## 5. Pièges déjà rencontrés (à ne pas refaire)

1. **Ordre des feuilles de style.** Dans chaque planche migrée, `../../labo/labo.css` doit être chargé **avant** le `<style>` de la page, et `../../labo/planche-etapes.css` **après**. Sinon `labo.css` écrase les jetons de l'écran (`--positif`, `--negatif`, `--energie`, `--trait`) et la simulation change de couleurs en thème clair. La coque utilise `--filet`, pas `--trait`.
2. **`planche.js` doit être inclus** en fin de page (`<script src="../../labo/planche.js"></script>` avant `</body>`). Trois agents l'avaient oublié : couches sans indice et écran trop haut.
3. **Touches** : `<body class="labo-etapes" data-mode="observer" data-touches="omc">`. Les chiffres servent aux étapes, les couches passent sur O, M, C. Vérifier qu'aucune touche de la page n'utilise déjà o, m ou c.
4. **Réserve d'en-tête** : l'ancien titre superposé à la scène réservait 90 à 130 px en haut du dessin (`headH()`, `top = 108`, `headRect()`…). Une fois le titre sorti de la scène, réduire cette réserve (16 à 36 px) et vérifier sur capture que rien ne remonte sous le bord.
5. **Regrouper sans toucher à la physique** : un bouton d'étape à deux index (`data-a` et `data-b`) et une bascule « Scène » dans les contrôles (exemple : étape 15.1 du pilote). Le marquage de l'étape courante doit tester `data-a` **ou** `data-b`.
6. **Graphes du panneau masqués en Observer** : un canvas caché a une taille nulle. Le redimensionner quand sa couche réapparaît (`ResizeObserver` ou abonnement `Planche.surMode`).
7. **Écrire du LaTeX ou des regex** : jamais par un heredoc shell (les barres obliques inverses sont corrompues). Écrire un fichier, puis l'exécuter.
8. **Navigateur intégré masqué** : `requestAnimationFrame` s'y arrête et une simulation paraît figée. Tester en headless (Playwright) plutôt que de conclure à un bug.
9. **Fusion de PR empilées** : ne pas supprimer la branche de base d'une PR dont une autre dépend (`gh pr merge --delete-branch` a fermé une PR empilée le 2026-10-04).

## 6. Règles

- Ne modifie pas les moteurs de simulation, les calculs ni les couleurs de l'écran.
- Pas de `git add -A`, pas de force-push, pas de commit sur `main`.
- Un seul écrivain à la fois sur le dépôt : si une autre session tourne, se coordonner avec Max.
- Signaler à Max tout écart entre ce handoff et l'état réel du dépôt avant d'agir.

## 7. Prompt à coller dans Codex

```text
Tu reprends un chantier dans le dépôt labo-modeles. Lis d'abord HANDOFF-CODEX.md à la racine, en entier, puis labo/GABARIT.md (section « Migrer une planche existante ») et corpus/standards.md.
Mets-toi sur la branche claude/labo-migration (git fetch, puis git switch claude/labo-migration) et vérifie que son dernier commit correspond à ce que dit le handoff ; signale tout écart avant d'agir.
Ta mission : la vague 2 du handoff (migrer les 6 showcases au gabarit, en suivant la planche pilote opus-sonnet/fondations-oscillations-ondes/index.html), les vérifier avec outils/qa/qa_migrees.js en regardant les captures, mettre à jour la documentation (§3.3), committer fichier par fichier, pousser la branche et ouvrir une PR vers main. Ne fusionne pas sans l'accord de Max.
Réponds en français. Termine par : pages migrées, écarts ou risques, état de la PR.
```
