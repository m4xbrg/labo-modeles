# Construire une page de fondations : prompt de session et règles communes

Ce fichier sert à lancer la construction d'une production de fondations dans une nouvelle session Claude Code (Opus orchestre, sous-agents Sonnet). Il a deux parties : le bloc à coller, puis les règles communes que la session lit et applique. Le plan d'ensemble est dans [`FEUILLE-DE-ROUTE.md`](FEUILLE-DE-ROUTE.md).

Une session par production. On remplace `<brief>` par le nom du fichier de brief (par exemple `fondations-magnetisme-induction`).

---

## 1. Le bloc à coller

```text
Tu construis une page de fondations de LABO, de bout en bout : moteur, planche, explication, mise à jour du corpus, PR. Tu es l'orchestrateur : tu écris et testes toi-même le moteur scientifique, tu délègues la construction de la page et de l'explication à des sous-agents (outil Agent, model: "sonnet"), puis tu intègres, tu critiques et tu vérifies.

Lis d'abord, en entier et dans cet ordre :
1. corpus/README.md et corpus/standards.md (source de vérité, standards de page)
2. prompts/SESSION-FONDATION.md, partie 2 « Règles communes » (obligatoire)
3. prompts/00-direction-artistique.md (charte visuelle)
4. prompts/<brief>.md (le brief de cette production)
5. labo/GABARIT.md (le gabarit standard : planche à fiche d'étape, explication en cours interactif), puis les deux références, en entier : opus-sonnet/fondations-langage/index.html et opus-sonnet/fondations-langage/explication.html
6. Les pages que le brief cite dans « Réutilisation », assez pour ne pas reconstruire ce qui existe.

Puis :
1. Moteur. Écris le moteur décrit dans le brief dans ton scratchpad (<slug>-moteur.js, entre marqueurs /* XXX-BEGIN */ et /* XXX-END */, exporté pour node), et un test.js qui vérifie chaque point de la section « Tests du moteur ». Tous les tests passent avant toute délégation.
2. Plan. Découpe en 2 à 4 lots (par exemple : coquille et chapitre 1 ; chapitre 2 ; explication.html ; passe de motion et d'accessibilité). Pour chaque lot, un brief de sous-agent : contrat d'interface, critères d'acceptation, exactitude attendue, fichiers qu'il a le droit d'écrire (jamais le même fichier que deux sous-agents).
3. Délègue et intègre. Renvoie un lot qui n'est pas au niveau avec des corrections précises plutôt que de le réécrire toi-même.
4. Vérifie (règles communes, section « Vérification »). Corrige ce que tu trouves.
5. Mets à jour le corpus (règles communes, section « Corpus »), commite, pousse sur ta branche et ouvre une PR vers main.

Rapport final (moins de 300 mots) : découpage, allers-retours, tests du moteur (nombre, résultat), vérifications faites et comment, simplifications assumées, écarts au brief et pourquoi.
```

---

## 2. Règles communes à toutes les nouvelles pages de fondations

Elles s'appliquent à chaque brief `fondations-*.md` écrit à partir du 2026-10-06. Un brief peut préciser ; il ne contredit pas ces règles sans le dire.

**Gabarit standard (2026-10-15).** Toute page neuve est une planche à **fiche d'étape** et une explication en **cours interactif** (`corpus/standards.md` §4, `labo/GABARIT.md`). Les briefs écrits avant cette date qui parlent de couches Observer / Manipuler / Comprendre, de touches de couches ou de `theorie.css` sont dépassés sur ce point : ces règles l'emportent. Leur contenu scientifique, lui, reste valable.

### Fichiers et emplacement

- Dossier : `opus-sonnet/fondations-<slug>/` avec `index.html` (autonome : CSS et JS inline) et `explication.html`. Le slug est donné par le brief.
- Rien d'autre n'est créé dans `opus-sonnet/`. Le moteur et ses tests restent dans le scratchpad ; leur résultat est cité dans la PR.
- Aucune image externe, aucune image générée : tout est dessiné (canvas, SVG, CSS). Bibliothèques seulement depuis cdnjs ou jsDelivr, et seulement KaTeX (déjà chargé par `labo/theorie.js`) dans l'explication. Le vanilla est la règle dans `index.html`.

### Coquille

- Gabarit standard, section « La planche à fiche d'étape » de `labo/GABARIT.md` : `labo.css` avant le `<style>` de la page, `planche-etapes.css` et `fiche.css` après, `theme.js` ; `<body class="labo-etapes labo-fiche" data-mode="fiche">` ; `header.barre`, `div.titre` (h1, phrase, signature Échelle · Temps · Modèle), `nav.chapitres#stepper`, `aside.panel` avec le conteneur des lectures ; `fiche.js` puis `Fiche.init`, et `planche.js` en dernier. Référence : `opus-sonnet/fondations-langage/index.html`.
- Dans la scène et le panneau : infobulle de découverte, clavier, fondu entre étapes, mesures en IBM Plex Mono, note d'honnêteté, `window.__labo`.
- En-tête (`corpus/standards.md` §1) : position `Fondations · NN · NN` dans la barre de la planche, surtitre `LABO · Fondations NN · NN` dans l'explication, avec les numéros couverts en `full` ou `partial` ; lien LABO vers `../../labo/index.html` et retour « ← Fondations » ; titre d'onglet `Titre — LABO` (explication : `Comprendre … — LABO`).
- Palette : tokens de `00-direction-artistique.md` (`--fond`, `--fond-2`, `--trait`, `--texte`, `--texte-2`, `--positif`, `--negatif`, `--energie`), plus l'`--accent` du brief. `--positif`, `--negatif` et `--energie` gardent leur sens dans toutes les pages. Quand le brief en a besoin : `--champ-b: #8a97f2` (champ magnétique) et `--induit: #45c9a0` (f.é.m. et courant induits), les mêmes que l'accueil LABO en thème sombre.

### Chapitres et étapes (`corpus/standards.md` §3)

- **Un chapitre par module canonique, 2 à 4 étapes par chapitre.** Une seule barre d'étapes, sans onglets imbriqués.
- Un `div.chap` par module (`p.chap-t` avec `<b>NN</b>` et le titre canonique), boutons `.seg` aux codes `NN.k` (`<b>14.2</b><span>Mot</span>`), titre complet en `title`. Deux scènes dans une étape : `data-a` et `data-b`, et une fiche par scène.
- Clavier : `Espace` pause, `←` `→` étape, `1` à `9` aller à l'étape, `R` réinitialiser l'étape, `F` focus, `I` infos, plus les touches que le brief donne (jamais F ni I).
- Au plus **trois curseurs par étape**, plus des boutons et des bascules. On règle une valeur là où elle s'affiche quand c'est possible.
- Chaque scène a sa **fiche** (Regarde, Prédis, Essaie, Pourquoi, définitions, piège : `labo/GABARIT.md`, « Écrire une fiche »), dont la prédiction est recalculée avec le moteur et dont les essais se cochent d'après l'état. Le panneau de lectures garde des **statuts** qui réagissent à ce que fait l'étudiant, une **phrase-clé** (encadré `.cle`) et une **note d'honnêteté** d'une ligne.
- Le phénomène vient avant le mot : un terme technique apparaît après que l'étudiant a vu la chose qu'il nomme.
- Interdits de formulation : intentions prêtées aux objets (« l'électron veut… », « la molécule cherche… », « la cellule décide… »). On écrit ce qui arrive.
- La dernière étape se termine par deux ou trois **questions ouvertes** vers les modules suivants (cartes sobres, sans réponse), comme la fin de *Cellule, membrane et transport*.

### Moteur

- Toute la science calculée passe par un **moteur écrit et testé avant la page**, par l'orchestrateur. Fonctions pures autant que possible, pas de fixe pour l'affichage, unités SI sauf mention.
- Pas fixes découplés de l'affichage (accumulateur). Tout le hasard passe par un générateur à graine (`mulberry32` ou équivalent) ; `Math.random` seulement pour tirer une nouvelle graine.
- Le bloc moteur est copié **à l'identique** dans la page, entre ses marqueurs ; un calcul de plus s'écrit hors du bloc. `test.js` doit passer sur la page livrée (il extrait le bloc de `index.html`).
- Chaque brief liste les **tests du moteur** : ce sont des minimums. Les tolérances sont celles du brief ou, à défaut, 1 %.

### `window.__labo`

`{ moteur, step, goStep(i), state(), tick(n), setPlay(b) }` plus les crochets de test que le brief nomme. `state()` renvoie les grandeurs affichées de l'étape courante ; `tick(n)` avance n pas fixes sans dessiner.

### Motion et accessibilité

- 60 images/s visées, canvas à l'échelle de `devicePixelRatio`, dessin en lots.
- `prefers-reduced-motion` : ralentir, jamais figer un phénomène dont le mouvement est le sujet (le dire dans un `title`).
- Micro-interactions de découverte : survoler ou toucher un objet donne son nom et son rôle en une ligne. Chaque brief liste les objets.
- Responsive jusqu'à 375 px sans défilement horizontal ; sous 861 px : scène, contrôles, panneau empilés. À 1366 × 768, la scène tient dans l'écran.
- Texte entièrement en français (québécois neutre), sans emoji.

### Explication (`corpus/standards.md` §2 et §4.3)

- Forme : **cours interactif** (`labo/GABARIT.md`, « L'explication en cours interactif » ; référence `opus-sonnet/fondations-langage/explication.html`) : 2 scènes intégrées (`?embed`), 2 ou 3 calculs vivants et 1 ou 2 questions par module, Teste-toi en `.quiz`, exemple en `ol.pas-a-pas`, glossaire en `a.terme`.
- Plan : **Ce que tu vois** · **La théorie, module par module** (sommaire puis une `<section class="module" id="mNN">` par module, sept rubriques : Intuition, Définitions, Relations clés, Exemple chiffré, Pièges fréquents, Où ça resservira, Teste-toi) · **Ce que la simulation simplifie** · **Les chiffres à retenir** · **Seulement introduit ici**.
- 800 à 1 150 mots de prose par module (formules exclues), 3 à 6 relations, exactement 3 questions dont une calculatoire.
- `../../labo/labo.css`, `../../labo/cours.css`, `../../labo/theme.js`, puis `../../labo/theorie.js` et `../../labo/cours.js` en `defer` (plus de `theorie.css`) ; `\( … \)` en ligne, `\[ … \]` en bloc, `\dd`, virgule décimale `{,}`, `\lt` et `\gt`.
- Chaque brief donne, par module, les relations attendues, un exemple chiffré possible et des pièges. Les chiffres de l'exemple sont recalculés, pas recopiés.
- L'en-tête de chaque section relie les étapes de la planche qui la portent (`<p class="etapes">Sur la planche : <a href="index.html?etape=NN.1">NN.1 …</a>…</p>`).

### Vérification

- `node outils/qa/conformite.mjs <dossier> --strict` : aucune erreur.
- `node --check` sur le JS extrait ; `test.js` sur la page livrée.
- Navigateur headless (Playwright : Chromium du système en session cloud, `channel: 'msedge'` sur la machine de Max ; ne pas télécharger de navigateur) : console vide sur les deux pages, chaque étape visitée et chaque crochet de test appelé, aucun essai coché sans geste et au moins un essai réalisé par scène, captures à 1440 × 900, 1366 × 768 et 375 × 812.
- Explication : toutes les formules KaTeX rendues sans erreur (compter les `.katex-error`), aucun débordement horizontal à 375 px, comptage des mots par module ; chaque calcul vivant juste aux bornes de ses curseurs, chaque quiz qui accepte la bonne réponse et refuse une mauvaise, chaque scène intégrée à la bonne étape.
- Servir la racine du dépôt par HTTP (`python -m http.server`) et ouvrir `/labo/` : la nouvelle page apparaît au bon module, le lien fonctionne.

### Corpus (dans la même PR)

Le corpus est la source de vérité : une page n'est `built` que si elle est sur `main`, mais la PR prépare déjà l'état d'après fusion.

- `corpus/models.json` et `modeles.md` : nouveau modèle (`type: "foundation"`, `parts_kind: "step"`, `parts`, modules avec leur couverture honnête : `full`, `partial` en nommant ce qui manque, `supporting`).
- `corpus/productions.json` et `fondations.md` : statut `built`, modèle relié ; couverture des modules et colonne « Par » ; liste « Prévues » ; limites connues.
- `corpus/modules.json` : `coverage` et `covered_by`.
- `corpus/atlas.json` et `atlas.md` : les idées couvertes passent `absorbed` (ou `partial`) avec le lien vers le modèle ; recompter le tableau « En chiffres ».
- `README.md` (État du projet) et `corpus/README.md` (état décrit) : compte de modèles, date.
- `prompts/FEUILLE-DE-ROUTE.md` : cocher la production.

### Git

Une branche par production, commits en français sur le modèle de l'historique (`Fondations 23 : magnétisme et induction`), PR vers `main` avec : ce qui est construit, tests du moteur, vérifications, simplifications, mise à jour du corpus.
