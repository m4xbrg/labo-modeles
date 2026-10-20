# Migration vers la fiche d'étape et le cours interactif (pour Codex ou une session Claude)

Rédigé le 2026-10-13 par Claude Opus 5.5, après la PR n° 43 (prototype sur *Langage scientifique*) ; mis à jour le 2026-10-15, quand ce format est devenu le **gabarit standard** de LABO (`corpus/standards.md` §4). Une migration par conversation, chacune sur sa propre branche. Plusieurs peuvent tourner en parallèle : elles ne touchent pas les mêmes fichiers. Les trois premières sont prêtes au §7 ; le §7 bis donne un prompt pour n'importe quelle autre page.

**Les recettes font foi dans `labo/GABARIT.md`** (sections « La planche à fiche d'étape », « L'explication en cours interactif », « Migrer une page existante », « Vérifier »). Ce document les résume pour un exécutant et ajoute les règles de PR ; en cas d'écart, `GABARIT.md` l'emporte.

**Préalable : `main` contient `labo/fiche.js`, `labo/cours.js`, le mode `?embed` et `outils/qa/conformite.mjs`** (PR n° 43 et PR du gabarit standard).

## Modèle à choisir dans Codex

Prendre le **modèle de frontière le plus capable proposé par Codex**, en **raisonnement élevé** (« high »). Le projet a déjà travaillé avec GPT-6 Astra (`corpus/historique.md`, 2026-09-29) : c'est le choix à faire s'il figure au menu. Le menu de Codex n'a pas pu être vérifié au moment d'écrire. Raison du choix : chaque migration demande de lire une simulation de 1 200 à 1 400 lignes, d'en trouver l'état, et d'écrire du contenu scientifique juste (prédictions chiffrées, tolérances) ; un modèle plus petit se trompe sur ces deux points.

## 1. Ce qu'on migre, et vers quoi

LABO (`README.md`, `corpus/`) publie des planches interactives : `opus-sonnet/<dossier>/index.html` (la simulation) et `explication.html` (la théorie). La PR n° 43 a fait deux prototypes sur `opus-sonnet/fondations-langage/`, validés par Max :

1. **Planche : fiche d'étape.** Les couches Observer / Manipuler / Comprendre sont retirées. Le panneau devient une fiche par scène, lue de haut en bas : Regarde → Prédis → Essaie (essais cochés d'eux-mêmes d'après l'état de la simulation) → Lectures (le panneau existant de la page) → Pourquoi (relation clé, équation vivante, définitions, piège) → étape suivante. Mode focus (F). Spécification : `labo/GABARIT.md`, section « Fiche d'étape » ; format des fiches : l'en-tête de `labo/fiche.js`.
2. **Explication : cours interactif.** Même contenu en sept rubriques par module (`corpus/standards.md` §2), nouvelle forme : jetons et thème LABO, sommaire collant, scènes de la planche intégrées (`?embed`), calculs vivants aux nombres réglables, questions vérifiées, exemple pas à pas, glossaire en bulles. Composants : l'en-tête de `labo/cours.js`.

**Les deux références à imiter sont `opus-sonnet/fondations-langage/index.html` et `opus-sonnet/fondations-langage/explication.html`.** Les lire en entier avant d'écrire quoi que ce soit.

## 2. Recette : la planche

La simulation ne change pas : ni moteur, ni calcul, ni couleur de l'écran. On ajoute une couche autour.

1. `<head>` : après `planche-etapes.css`, charger `../../labo/fiche.css`. Si la page ne charge pas KaTeX, ajouter KaTeX 0.16.11 depuis cdnjs comme dans la référence.
2. `<body class="labo-etapes labo-fiche" data-mode="fiche">` : retirer `data-touches`. Supprimer le bloc `div.modes` (onglets de couches). `planche.js` accepte une coque sans onglets.
3. **Ce qui était caché selon la couche** (`.couche-lire`, `.couche-comp`, règles CSS sur `data-mode=observer|manipuler|comprendre`) est désormais toujours visible : retirer ces classes et ces règles. Si un texte du panneau de la page fait doublon avec la fiche (titre et phrase de l'étape), le masquer par une règle CSS de la page sous `.labo-fiche`, comme la référence masque `#vHead`. Garder mesures, graphes et notes dynamiques : ils deviennent la rubrique « Lectures ». Si la page n'a pas de `#toyPanel`, envelopper ces sections dans un élément (`<div id="lectures">`) et passer `lectures: '#lectures'` à `Fiche.init`.
4. **Exposer l'état.** Les fonctions `fait`, `suivi` et `vivant` des fiches lisent l'objet que renvoie `etat()`. Dans un script classique, les `let` et `const` de premier niveau d'un script sont visibles par nom depuis un script suivant : `etat: () => ({ st, P })` suffit souvent, sans toucher au moteur. Ne rien écrire dans cet état depuis la fiche.
5. **Brancher la navigation.** Dans la fonction d'étape de la page (`goStep`, `goAct`…), appeler `if (window.Fiche) Fiche.montre(n)` avec l'index de **scène** (celui de `data-a` / `data-b`), et exposer `window.allerScene = n => goStep(n)` (ou l'équivalent). L'index des fiches est cet index de scène. Si cette fonction sert aussi à remettre la scène en cours à zéro (Réinitialiser, R, préréglage), l'appeler `Fiche.relance()` juste avant `Fiche.montre(n)`, et dans tout reset propre à un jouet : sinon `mem` garde un départ périmé (voir `labo/GABARIT.md`, « Réinitialiser la scène sans la quitter »).
6. **Écrire les fiches** dans un `<script>` placé avant la coquille de la page, avec `Fiche.init({ etapes, fiches, etat, aller, k, theorie })`. Voir le bloc « Fiches d'étape (prototype) » de la référence pour la forme exacte, y compris la construction de `etapes` depuis `#stepper .seg`.
7. Texte d'aide du clavier : retirer O/M/C, ajouter `F` focus et `I` infos. **Si la page utilise déjà la touche F**, garder sa commande et passer `toucheFocus: false` ; le focus reste au bouton de la barre. Le signaler dans la PR. Pour un showcase, les étapes n'ont pas de `mod` : le lien de fin devient « Comprendre ce qui se passe » vers `explication.html`.

**Contenu d'une fiche** (en français, tutoiement, ton de la référence) :

- **Regarde** : une ou deux phrases sur ce qu'il faut remarquer dans la scène, pas sur ce qu'il faut faire.
- **Prédis** : une question à laquelle on peut répondre avant de toucher. Réponse chiffrée avec tolérance raisonnable, ou choix (2 ou 3 options, une seule juste). **Les valeurs citées sont celles du réglage par défaut de la scène**, et la réponse est **recalculée avec le moteur** (Node ou console), pas de tête. L'explication refait le calcul.
- **Essaie** : 2 ou 3 gestes précis que l'élève peut réellement faire avec les contrôles de la scène. Chacun a une fonction `fait` qui devient vraie **seulement après une action** : comparer à la valeur d'arrivée gardée dans `mem` avec l'aide `instant` de la référence. Pas d'essai déjà vrai au chargement, ni d'essai qu'aucune commande ne permet d'atteindre.
- **Pourquoi** : 2 à 4 phrases, puis `relation` (TeX). Ajouter `vivant` seulement si le panneau de la page ne montre pas déjà ce calcul.
- **defs** (1 à 3) et **piege** : repris de l'explication du module.

## 3. Recette : l'explication

Remplacer la mise en page, garder la prose. Partir de `fondations-langage/explication.html` :

1. `<head>` : `labo/labo.css`, `labo/cours.css`, `labo/theme.js`, puis `labo/theorie.js` et `labo/cours.js` en `defer`. Retirer l'ancien `<style>` et `labo/theorie.css`.
2. Structure : `header.cours-barre`, `div.cours-page` > `nav.cours-sommaire` + `main.cours-texte`. En tête : surtitre `LABO · Fondations NN · NN` (standards §1), `h1`, `p.lead`, `p.mode-emploi`, cartes des modules.
3. « Ce que tu vois » devient des `.cartes` dont les liens ouvrent la planche à l'étape (`index.html?etape=NN.k`).
4. **Chaque module garde ses sept rubriques et leur prose**, dans l'ordre, avec des ids `mNN-intuition`, `mNN-defs`, `mNN-relations`, `mNN-exemple`, `mNN-pieges`, `mNN-suite`, `mNN-test` (le sommaire les liste). L'en-tête du module relie chaque étape de la planche (`p.etapes` avec des liens `?etape=`).
5. Ajouts par module :
   - **2 scènes intégrées** (`figure.labo data-src="index.html?embed&amp;etape=NN.k"`), placées là où le texte parle de ce qu'elles montrent, avec une légende qui dit quoi faire. `&amp;panneau=1` quand les mesures comptent. Ouvrir chaque URL d'embed dans un cadre de 680 px pour vérifier que la scène y est lisible (hauteur `data-h` entre 400 et 560).
   - **2 ou 3 calculs vivants** (`.calc`), chacun attaché à une relation clé. Utiliser `plan(...)` pour des vecteurs et `trace(...)` pour une courbe quand un dessin aide. Une sortie qui est une phrase prend `class="phrase"`.
   - **1 ou 2 questions** dans les relations, et les **trois Teste-toi convertis** en `.quiz` (réponse chiffrée ou choix), correction reprise du texte actuel.
   - **Exemple chiffré en `ol.pas-a-pas data-montre="0"`.**
   - **Définitions avec ids `def-…` uniques dans la page**, et 3 à 6 termes du texte en `a.terme`.
6. Garder « Ce que les laboratoires simplifient » et « Les chiffres à retenir », avec des ids pour le sommaire.

## 4. Pièges (rencontrés pendant le prototype)

1. **Attributs HTML.** Dans `data-expr`, écrire `&lt;` pour `<`, `&amp;&amp;` pour `&&`, et des guillemets simples dans l'expression. Dans `data-src`, `&amp;` entre les paramètres.
2. **Noms des variables d'un calcul** : ne pas reprendre un nom d'aide (`plan`, `trace`, `fmt`, `sci`, `sup`, `ordre`, `mant`…).
3. **LaTeX et regex** : jamais par un heredoc shell, les barres obliques inverses s'y corrompent. Écrire un fichier, puis l'exécuter. Dans le HTML : `\lt`, `\gt`, virgule décimale `{,}`, `\dd` pour la différentielle.
4. **Commentaire `//` dans une ligne de code** : il avale la suite de la ligne. Préférer `/* … */` au milieu d'une expression.
5. **`requestAnimationFrame` s'arrête dans un onglet masqué** : les essais ne se cochent pas et les équations vivantes ne bougent pas. Tester en headless (Playwright), pas dans un onglet caché.
6. **Iframes hors écran** : elles chargent tard. Faire défiler jusqu'à elles avant de mesurer.
7. **`?etape=` est appliqué après le `load`** de la page. Si la page ouvre sa première étape plus tard (minuterie), le signaler au lieu de modifier `planche.js`.

## 5. Vérifier

Servir la racine en HTTP (`python -m http.server 4350 --directory .`), puis dans `outils/qa/` (une fois `npm install`) :

```bash
node conformite.mjs <dossier> --strict       # lecture statique : aucune erreur ✗ acceptée
node qa_migrees.js <dossier> sans-captures   # puis sans « sans-captures », et regarder les captures
node qa_theorie.js <dossier>
```

Acceptation :

- **Conformité** : `conformite.mjs <dossier> --strict` sort sans erreur ; sa sortie est collée dans la PR.
- **Planche** : console propre (le 404 de `favicon.ico` ne compte pas) ; `cochesSansGeste` vaut 0 à chaque étape dans la sortie de `qa_migrees.js` ; chaque étape s'ouvre et est marquée ; aucun débordement à 375 px ; écran et contrôles dans 1366 × 768 ; aucune commande perdue.
- **Fiches** :
  - un script Playwright jetable (non commité) ouvre chaque scène, vérifie qu'**aucun essai n'est coché au chargement**, puis en réalise **au moins un par scène** en pilotant les vrais contrôles (clic, glisser, touches) et vérifie `.fiche-essais li.fait` ;
  - chaque réponse de « Prédis » est recalculée avec le moteur, et la PR liste les valeurs.
- **Explication** : `qa_theorie.js` sans erreur KaTeX ni LaTeX brut, sans débordement à 1440 et 375 px ; chaque calcul donne des valeurs justes aux bornes de ses curseurs ; chaque quiz accepte la bonne réponse et refuse une mauvaise ; chaque URL d'embed ouvre la bonne étape.
- Thèmes clair et sombre lisibles.

## 6. Règles

- **Ne modifier que** `opus-sonnet/<dossier>/index.html` et `opus-sonnet/<dossier>/explication.html`. Pas de changement dans `labo/`, `corpus/`, `outils/`, `prompts/` ni dans les autres pages : trois conversations tournent en parallèle et la documentation commune sera mise à jour après, en une fois. Si un fichier partagé doit changer, l'expliquer dans la PR sans le modifier.
- Ne pas toucher aux moteurs, calculs, couleurs de l'écran ni commandes existantes.
- Branche `codex/fiche-cours-<dossier sans « fondations- »>` créée depuis `main` à jour. Commits ciblés (`git add <fichier>`, jamais `git add -A`), messages en français. Pas de force-push, pas de commit sur `main`.
- PR vers `main` avec :
  - un résumé ;
  - un tableau des scènes (fiche, prédiction et réponse recalculée, essais) ;
  - un tableau de l'explication par module (scènes intégrées, calculs, questions) ;
  - ce qui a été vérifié et comment ;
  - une section « À relire » qui nomme ce qui est incertain.
- **Ne pas fusionner** : Max relit d'abord.
- Signaler tout écart entre ce document et l'état réel du dépôt avant d'agir.

## 7. Les trois prompts

### Prompt 1 — Oscillations et ondes (06 · 14 · 15)

```text
Tu travailles dans le dépôt labo-modeles. Lis d'abord prompts/codex/MIGRATION-FICHE-COURS.md en entier, puis labo/GABARIT.md (sections « Fiche d'étape » et « Lien vers une étape et mode intégré »), corpus/standards.md §1 et §2, l'en-tête de labo/fiche.js et celui de labo/cours.js, et enfin les deux références : opus-sonnet/fondations-langage/index.html et explication.html.
Vérifie que main contient la PR n° 43 (labo/fiche.js et labo/cours.js existent) ; sinon arrête-toi et dis-le. Crée la branche codex/fiche-cours-oscillations-ondes depuis main à jour.
Ta mission : migrer opus-sonnet/fondations-oscillations-ondes/ vers la fiche d'étape (planche) et le cours interactif (explication), selon les §2 à §6 du document.
Repères dans index.html : le tableau STEPS (vers la ligne 518) et goStep(n, immediate, keep) (vers la ligne 1176). Dix scènes pour neuf étapes : l'étape 15.1 regroupe deux scènes (data-a="5" data-b="6", impulsion ou onde périodique), il faut donc deux fiches pour elle. Cette explication est la référence historique du format de théorie (corpus/standards.md §2) : sa prose ne change pas, seule la forme change.
Idées de calculs vivants, à confirmer contre le texte : T = 1/f et ω = 2πf ; somme de deux oscillations déphasées ; ω₀ = √(k/m) ; λ = v/f ; fréquence perçue par effet Doppler. Utilise trace(...) pour dessiner une sinusoïde ou une enveloppe amortie quand c'est utile.
Vérifie selon le §5 (Playwright compris), commite fichier par fichier, pousse la branche et ouvre la PR vers main. Ne fusionne pas.
Réponds en français. Termine par : ce qui est fait, valeurs des prédictions recalculées, écarts ou risques, lien de la PR.
```

### Prompt 2 — Forces, énergie et conservation (10 · 11)

```text
Tu travailles dans le dépôt labo-modeles. Lis d'abord prompts/codex/MIGRATION-FICHE-COURS.md en entier, puis labo/GABARIT.md (sections « Fiche d'étape » et « Lien vers une étape et mode intégré »), corpus/standards.md §1 et §2, l'en-tête de labo/fiche.js et celui de labo/cours.js, et enfin les deux références : opus-sonnet/fondations-langage/index.html et explication.html.
Vérifie que main contient la PR n° 43 (labo/fiche.js et labo/cours.js existent) ; sinon arrête-toi et dis-le. Crée la branche codex/fiche-cours-forces-energie depuis main à jour.
Ta mission : migrer opus-sonnet/fondations-forces-energie/ vers la fiche d'étape (planche) et le cours interactif (explication), selon les §2 à §6 du document.
Repères dans index.html : le tableau ACTS (vers la ligne 1146) et goAct(n, restart) (vers la ligne 1185) ; six étapes, une scène chacune (10.1 à 10.3, 11.1 à 11.3). L'étape 11.3 « À toi : collision libre » est déjà un bac à sable : ses essais doivent proposer des défis (par exemple obtenir une collision où toute l'énergie cinétique est conservée, ou une où les deux chariots repartent ensemble), vérifiés sur l'état.
Idées de calculs vivants, à confirmer contre le texte : ΣF = m·a avec une résultante de deux forces (plan(...) pour les flèches) ; travail W = F·d·cos θ et énergie cinétique ½mv² ; quantité de mouvement avant et après une collision, élastique ou parfaitement inélastique, avec l'énergie perdue.
Vérifie selon le §5 (Playwright compris), commite fichier par fichier, pousse la branche et ouvre la PR vers main. Ne fusionne pas.
Réponds en français. Termine par : ce qui est fait, valeurs des prédictions recalculées, écarts ou risques, lien de la PR.
```

### Prompt 3 — Systèmes, croissance et hasard (04 · 05 · 07)

```text
Tu travailles dans le dépôt labo-modeles. Lis d'abord prompts/codex/MIGRATION-FICHE-COURS.md en entier, puis labo/GABARIT.md (sections « Fiche d'étape » et « Lien vers une étape et mode intégré »), corpus/standards.md §1 et §2, l'en-tête de labo/fiche.js et celui de labo/cours.js, et enfin les deux références : opus-sonnet/fondations-langage/index.html et explication.html.
Vérifie que main contient la PR n° 43 (labo/fiche.js et labo/cours.js existent) ; sinon arrête-toi et dis-le. Crée la branche codex/fiche-cours-systemes-hasard depuis main à jour.
Ta mission : migrer opus-sonnet/fondations-systemes-hasard/ vers la fiche d'étape (planche) et le cours interactif (explication), selon les §2 à §6 du document.
Repères dans index.html : le tableau STEPS (vers la ligne 491) et goStep(n, immediate) (vers la ligne 1024) ; neuf étapes, une scène chacune (04.1 à 04.4, 05.1 et 05.2, 07.1 à 07.3). Le hasard (07) est tiré au sort : un essai ou une prédiction qui dépend d'un tirage doit porter sur une tendance (moyenne sur beaucoup de lancers, √n de la marche aléatoire, demi-vie) avec une tolérance qui tient compte de la dispersion, jamais sur un résultat exact.
Idées de calculs vivants, à confirmer contre le texte : un pas d'Euler x(t + Δt) = x + f(x)·Δt ; temps de doublement ln 2 / r ; croissance logistique et capacité K ; écart typique √n d'une marche aléatoire ; demi-vie et fraction restante après n demi-vies. Utilise trace(...) pour dessiner l'exponentielle ou la logistique.
Vérifie selon le §5 (Playwright compris), commite fichier par fichier, pousse la branche et ouvre la PR vers main. Ne fusionne pas.
Réponds en français. Termine par : ce qui est fait, valeurs des prédictions recalculées, écarts ou risques, lien de la PR.
```

### Prompt 4 et suivants — n'importe quelle page (§7 bis)

Remplacer `<dossier>` (nom du dossier dans `opus-sonnet/`) et `<court>` (le même sans « fondations- »). Avant d'envoyer, compléter la ligne « Repères » en lisant la page : nom du tableau des étapes et de la fonction d'étape, scènes regroupées (`data-b`), touches déjà prises.

```text
Tu travailles dans le dépôt labo-modeles. Lis d'abord prompts/codex/MIGRATION-FICHE-COURS.md en entier, puis labo/GABARIT.md (gabarit standard), corpus/standards.md §1, §2 et §4, l'en-tête de labo/fiche.js et celui de labo/cours.js, et enfin les deux références : opus-sonnet/fondations-langage/index.html et explication.html.
Vérifie que main contient labo/fiche.js, labo/cours.js et outils/qa/conformite.mjs ; sinon arrête-toi et dis-le. Crée la branche codex/fiche-cours-<court> depuis main à jour.
Ta mission : migrer opus-sonnet/<dossier>/ vers la fiche d'étape (planche) et le cours interactif (explication), selon les §2 à §6 du document.
Repères dans index.html : <tableau des étapes et fonction d'étape, scènes regroupées, touches déjà prises>.
Si c'est un showcase (dossier qui commence par deux chiffres) : une fiche par acte, retour « ← Phénomènes », lien de fin « Comprendre ce qui se passe » ; l'explication prend la forme du cours interactif sur son propre plan, sans les sept rubriques.
Vérifie selon le §5 (conformite.mjs --strict et Playwright compris), commite fichier par fichier, pousse la branche et ouvre la PR vers main. Ne fusionne pas.
Réponds en français. Termine par : ce qui est fait, valeurs des prédictions recalculées, écarts ou risques, lien de la PR.
```

## 8. Après la fusion d'un lot de migrations

Quand Max a relu et fusionné une ou plusieurs migrations, une session Claude met à jour d'un coup la documentation commune (jamais dans les PR de migration, pour éviter les conflits) :

- `corpus/standards.md` §4.5 : régénérer le tableau avec `node outils/qa/conformite.mjs --markdown` ;
- `corpus/historique.md` : une ligne datée par lot ;
- `labo/GABARIT.md` : pièges nouveaux remontés par les PR ;
- les changements de fichiers partagés que les PR auront demandés (dans une PR à part, qui met aussi à jour `GABARIT.md` et l'en-tête du script).
