# Gabarit de page LABO

**Gabarit standard depuis le 2026-10-15** (décision de Max) : la planche à **fiche d'étape** et l'explication en **cours interactif**, prototypées sur *Langage scientifique* (PR n° 43). Toute page neuve est construite ainsi ; toute page existante y est migrée, page par page. La règle et l'état de la migration sont dans [`corpus/standards.md`](../corpus/standards.md) §4 ; ce fichier donne les recettes.

**Références à imiter, à lire en entier avant d'écrire :**

- planche : [`opus-sonnet/fondations-langage/index.html`](../opus-sonnet/fondations-langage/index.html) ;
- explication : [`opus-sonnet/fondations-langage/explication.html`](../opus-sonnet/fondations-langage/explication.html).

Les planches à couches Observer / Manipuler / Comprendre et les explications à `theorie.css` sont le **format hérité** : valides tant qu'elles ne sont pas migrées, mais on n'en écrit plus (voir la fin de ce fichier).

## Les fichiers communs

| Fichier | Rôle | Chargé par |
|---|---|---|
| `labo.css` | Jetons (papier, encre, couleurs des phénomènes, polices), lecture d'instrument, barre. | Planche (avant son `<style>`) et explication. |
| `planche-etapes.css` | Coque des planches : barre repliée, tiroir Infos, chapitres, grille scène / panneau / contrôles, mode intégré. | Planche, après son `<style>`. |
| `fiche.css` / `fiche.js` | **Fiche d'étape** : le panneau devient une fiche par scène, mode Focus. | Planche : la feuille après `planche-etapes.css`, le script avant `Fiche.init`. |
| `planche.js` | Repli de la coque en une barre, tiroir Infos (I), hauteur d'écran, `?etape=`, `?embed`, voisins lus dans le corpus. | Planche, **dernier script**. |
| `theme.js` | Thème auto, clair ou sombre, partagé entre pages et iframes. | Planche et explication, dans le `<head>`. |
| `cours.css` / `cours.js` | **Cours interactif** : sommaire collant, scènes intégrées, calculs vivants, quiz, pas à pas, glossaire. | Explication (`cours.js` en `defer`). |
| `theorie.js` | KaTeX 0.16.11 (cdnjs) et rendu des formules. | Explication (`defer`). |
| `corpus.js`, `presentation.js` | Lecture de `corpus/*.json` et habillage de l'accueil. | Accueil, planches (voisins). |
| `planche.css`, `theorie.css`, `gabarit.html` | Format hérité (maquettes, ancienne théorie). | Pages non migrées seulement. |

On ne modifie pas ces fichiers depuis une page. Un besoin commun (une option de `fiche.js`, un composant de `cours.js`) se traite dans une PR à part, qui met à jour ce fichier et l'en-tête du script.

## Les règles de la direction

- **UI silencieuse, phénomène expressif.** Le papier, l'encre et les traits restent neutres ; la couleur appartient au phénomène (`--phenomene`, ou un jeton de `labo.css` comme `--champ-b`, `--vivant`). Pas d'« application bleue » : chaque domaine garde sa teinte. La scène d'une planche reste un *écran d'instrument* sombre ; tout ce qui l'entoure suit le thème LABO clair ou sombre.
- **Trois voix typographiques.** Plex Sans pour l'interface et les titres ; Plex Mono pour les mesures, unités et étiquettes ; Instrument Serif italique **seulement** pour les symboles mathématiques.
- **Signature** obligatoire : Échelle · Temps · Modèle (dans le tiroir Infos de la planche).
- **Une navigation : les étapes.** Plus de couches. Tout est visible ; le mode Focus (F) est le seul moyen de cacher la fiche.
- **Contrôles contextuels.** On règle une valeur là où elle s'affiche quand c'est possible ; au plus trois curseurs par étape.
- **Le phénomène avant le mot**, et pas d'intention prêtée aux objets (« l'électron veut… »).

## La planche à fiche d'étape

Le panneau devient une **fiche** lue de haut en bas, une par scène.

| Rubrique | Contenu |
|---|---|
| En-tête | Code et rang de l'étape, titre, bascule de scène quand l'étape en regroupe deux (elle remplace la bascule « Scène » des contrôles). |
| Regarde | Ce qu'il faut remarquer, en une ou deux phrases ; pas ce qu'il faut faire. |
| Prédis | Une question avant de toucher : réponse chiffrée (virgule acceptée, tolérance) ou choix de 2 ou 3 options, une seule juste ; puis correction qui refait le calcul. |
| Essaie | Deux ou trois gestes précis, **cochés d'eux-mêmes** quand l'état de la simulation les vérifie. Une étape dont tous les essais sont faits reçoit un point dans la barre. |
| Lectures | Le panneau de la page, inchangé : mesures, graphes et notes dynamiques. |
| Pourquoi | 2 à 4 phrases, la relation clé en KaTeX et, si le panneau ne montre pas déjà ce calcul, une **équation vivante** calculée avec les valeurs de la scène. Définitions (1 à 3) et piège fréquent en replis, repris de l'explication. |
| Suite | Étape précédente et suivante, lien vers la théorie (« Théorie complète du module NN », ou « Comprendre ce qui se passe » pour un showcase). |

**Focus** (bouton de la barre ou touche **F**) masque la fiche. Le titre de l'étape en cours reste visible dans la barre.

### Brancher une planche

1. `<head>` : `../../labo/labo.css` **avant** le `<style>` de la page ; après lui, `../../labo/planche-etapes.css`, `../../labo/fiche.css` et `../../labo/theme.js`. KaTeX 0.16.11 depuis cdnjs (feuille et script) si la page ne le charge pas déjà. Le `<style>` de la page porte les jetons de l'écran (`--fond`, `--texte`, `--accent`…) que lit le JavaScript ; pour les garder en thème explicite, donner au sélecteur d'origine la priorité `:root, :root[data-theme], :root:not([data-theme])`.
2. `<body class="labo-etapes labo-fiche" data-mode="fiche">` : ni `data-touches`, ni `div.modes`.
3. Coque, avant le conteneur principal : `header.barre` (LABO, ← Fondations ou ← Phénomènes, `p.pos`, bouton de thème), `div.titre` (h1, `p.lead` d'une phrase, `dl.sig` Échelle · Temps · Modèle), `nav.chapitres#stepper`. `planche.js` la replie en une barre et range le titre dans le tiroir Infos.
4. **Chapitres** : fondation, un `div.chap` par module canonique (`p.chap-t` avec `<b>NN</b>` et le titre canonique), 2 à 4 boutons `.seg` aux codes `NN.k` ; showcase, un seul chapitre et ses actes (`I`, `II`… ou `1`, `2`…). Deux scènes dans une étape : un bouton à deux index, `data-a` et `data-b`.
5. `aside.panel` contient le conteneur des **lectures** (`#toyPanel` dans la référence ; sinon envelopper les sections de mesures dans un élément et le passer en option `lectures`) et, s'il y a lieu, `#hints` (aide du clavier, rangée dans un repli « Clavier »).
6. **Exposer l'état.** Les fonctions des fiches lisent l'objet que renvoie `etat()`. Dans un script classique, les `let` et `const` de premier niveau sont visibles par nom depuis un script suivant : `etat: () => ({ st, P })` suffit souvent, sans toucher au moteur. La fiche ne modifie jamais cet état.
7. **Brancher la navigation.** Dans la fonction d'étape de la page (`goStep`, `goAct`…), appeler `if (window.Fiche) Fiche.montre(n)` avec l'index de **scène** (celui de `data-a` / `data-b`), et exposer `window.allerScene = n => goStep(n)`. Si cette même fonction sert aussi à **remettre la scène en cours à zéro** (bouton Réinitialiser, touche R, clic sur l'étape en cours, préréglage), l'appel devient `if (window.Fiche) { Fiche.relance(); Fiche.montre(n); }` (voir « Réinitialiser la scène sans la quitter »).
8. **Écrire les fiches** dans un `<script>` placé après `<script src="../../labo/fiche.js">` et avant la coquille de la page : `Fiche.init({ etapes, fiches, etat, aller, k, theorie })`. La référence construit `etapes` depuis `#stepper .seg` ; le format complet d'une fiche est en tête de `labo/fiche.js`.
9. Aide du clavier : retirer O/M/C, ajouter `F` focus et `I` infos. Si la page utilise déjà F, passer `toucheFocus: false` (Focus reste au bouton) et le dire dans la PR.
10. En fin de `<body>`, `../../labo/planche.js` : **dernier script**.

Options de `Fiche.init` au-delà de la référence : `lectures` (élément ou sélecteur, défaut `#toyPanel`), `theorieTexte: E => '…'` (libellé du lien de fin), `toucheFocus` (`'f'` par défaut, `false` pour la désactiver). Une étape sans `mod` est traitée comme un acte de showcase.

### Écrire une fiche

En français, tutoiement, ton de la référence.

- **Regarde** : ce que la scène montre, pas une consigne.
- **Prédis** : les valeurs citées sont celles du **réglage par défaut** de la scène ; la réponse est **recalculée avec le moteur** (Node ou console), jamais de tête ; l'explication refait le calcul. Hasard : porter sur une tendance (moyenne, √n, demi-vie) avec une tolérance qui tient compte de la dispersion.
- **Essaie** : des gestes que les contrôles permettent réellement. Chaque `fait` devient vrai **seulement après une action** : comparer à la valeur d'arrivée gardée dans `mem` (aide `instant` de la référence). Pas d'essai vrai au chargement, ni d'essai qu'aucune commande n'atteint. Un bac à sable propose des défis vérifiés sur l'état.
- **Pourquoi** : 2 à 4 phrases, puis `relation` (TeX). `vivant` seulement si le panneau ne montre pas déjà ce calcul.

### Réinitialiser la scène sans la quitter

`Fiche.montre(i)` ne fait rien quand `i` est déjà la scène en cours : la fiche n'est pas reconstruite et les essais cochés restent cochés. Conséquence : **`mem` n'est pas remis à zéro quand la page réapplique la même scène** (Réinitialiser, touche R, clic sur l'étape en cours, préréglage). Un essai qui compare l'état à un instantané pris au premier passage (`instant(mem, 'v0', …)`, `mem.depart = e`) compare alors à un départ périmé :

- **coché sans geste** : le reset remet les valeurs par défaut alors que l'instantané gardait celles d'une visite précédente (réglages modifiés, puis retour sur la scène) ; l'essai « change X » se coche au simple appui sur Réinitialiser ;
- **impossible à atteindre** : le reset recrée des objets aux identifiants neufs (préréglage du champ électrique) ou remet des compteurs à zéro, et la comparaison ne peut plus devenir vraie.

Relevé le 2026-10-20 sur Le champ électrique (essai « glisse une charge »), puis par audit des planches à fiche : *Systèmes et hasard* (les six premières scènes) et *Forces et énergie* (« Deux forces, une résultante »).

**Règle.** Partout où la page remet la scène en état de départ **sans changer d'index**, appeler `Fiche.relance()` au même endroit : elle jette `mem` (`suivi` le remplit de nouveau à l'image suivante, à partir de l'état tel qu'il est alors). Elle ne touche ni à la fiche, ni à la prédiction, ni aux essais déjà cochés.

```js
// la fonction d'étape sert aussi au reset : relancer AVANT de montrer
if (window.Fiche) { Fiche.relance(); Fiche.montre(n); }
// un reset propre à un jouet, qui ne passe pas par la fonction d'étape
function reset() { …; if (window.Fiche) Fiche.relance(); }
```

À la place d'un compteur de scénario dans l'état exposé (`scenario++` dans `applyPreset`, lu par `suivi`), préférer `Fiche.relance()` dans la fonction qui applique le préréglage. Ne relancer **qu'au moment où l'état est vraiment remis à zéro** (pas sur un simple retour de la même étape qui ne touche à rien) et pas à chaque image. Au test : après Réinitialiser, aucun essai ne se coche seul, et chacun reste réalisable avec les vrais contrôles (le script Playwright de « Vérifier », point 4, le fait avec un reset au milieu).

## L'explication en cours interactif

Tout est écrit dans le HTML ; `cours.js` ne fait qu'animer. Sans lui, la page reste lisible (scènes remplacées par un lien, réponses visibles). Composants : en-tête de `labo/cours.js`.

1. `<head>` : `labo/labo.css`, `labo/cours.css`, `labo/theme.js`, puis `labo/theorie.js` et `labo/cours.js` en `defer`. Pas de `theorie.css`, pas de `<style>` qui refait la mise en page.
2. Structure : `body.cours` > `header.cours-barre` (LABO, ← retour à la planche, titre court, thème, `.cours-avance`), `div.cours-page` > `nav.cours-sommaire` + `main.cours-texte`. En tête : `p.surtitre` (`corpus/standards.md` §1), `h1`, `p.lead`, `p.mode-emploi`, cartes des modules.
3. « Ce que tu vois » : des `.cartes` dont les liens ouvrent la planche à l'étape (`index.html?etape=NN.k`).
4. **Fondations : chaque module garde ses sept rubriques et leur prose**, dans l'ordre, avec les ids `mNN-intuition`, `mNN-defs`, `mNN-relations`, `mNN-exemple`, `mNN-pieges`, `mNN-suite`, `mNN-test` (le sommaire les liste). L'en-tête du module relie chaque étape (`p.etapes`, liens `?etape=`).
5. Par module :
   - **2 scènes intégrées** : `<figure class="labo" data-src="index.html?embed&amp;etape=NN.k" data-h="440" data-titre="…">` et une `figcaption` qui dit quoi faire et se termine par le lien statique `<a class="ouvrir" href="index.html?etape=NN.k">Ouvrir à cette étape ↗</a>` (seul accès à la scène si le script ne tourne pas) ; `&amp;panneau=1` quand les mesures comptent. Hauteur `data-h` entre 400 et 560 ; vérifier chaque URL dans un cadre de 680 px.
   - **2 ou 3 calculs vivants** (`.calc`), chacun attaché à une relation clé ; `plan(...)` pour des vecteurs, `trace(...)` pour une courbe ; une sortie qui est une phrase prend `class="phrase"`.
   - **1 ou 2 questions** dans les relations, et les **3 Teste-toi** en `.quiz` (réponse chiffrée ou choix), correction reprise du texte.
   - **Exemple chiffré** en `ol.pas-a-pas data-montre="0"`.
   - **Définitions** aux ids `def-…` uniques, et 3 à 6 termes du texte en `a.terme`.
6. Après la théorie : « Ce que les labos simplifient » et « Les chiffres à retenir », avec des ids pour le sommaire.
7. **Showcase** : même forme, sur son propre plan (le phénomène, ses actes) ; scènes intégrées et quiz là où ils aident, pas de sept rubriques.

## Migrer une page existante

La simulation ne change pas : ni moteur, ni calcul, ni couleur de l'écran, ni commande. On remplace la couche qui l'entoure.

1. **Planche** : appliquer « Brancher une planche » à la page à couches. Ce qui était caché selon la couche (`.couche-lire`, `.couche-comp`, règles CSS sur `data-mode=observer|manipuler|comprendre`) devient toujours visible : retirer ces classes. Un texte du panneau qui fait doublon avec la fiche (titre et phrase de l'étape) se masque par une règle de la page sous `.labo-fiche`. Mesures, graphes et notes dynamiques deviennent les Lectures. Écrire une fiche par scène.
2. **Explication** : appliquer « L'explication en cours interactif » ; remplacer la mise en page, garder la prose.
3. **Vérifier** (section suivante) et joindre à la PR la sortie de `conformite.mjs <dossier> --strict`.
4. Une branche et une PR par page ; ne toucher que `opus-sonnet/<dossier>/index.html` et `explication.html`, pour que des migrations de pages différentes puissent tourner en parallèle sans conflit. Prompt prêt à l'emploi : [`prompts/codex/MIGRATION-FICHE-COURS.md`](../prompts/codex/MIGRATION-FICHE-COURS.md).
5. **Après la fusion** (une fois par lot de PR fusionnées, pas dans chaque PR) : régénérer le tableau de `corpus/standards.md` §4.5 avec `node outils/qa/conformite.mjs --markdown`, ajouter une ligne datée à `corpus/historique.md`, et reporter ici les pièges nouveaux.

## Vérifier

Servir la racine du dépôt par HTTP (`python -m http.server 4350 --directory .`) : `file://` ne lit pas le corpus. Outils : [`outils/qa/`](../outils/qa/README.md).

1. `node outils/qa/conformite.mjs <dossier> --strict` : aucune erreur (`✗`). Lecture statique de l'ordre des feuilles et des scripts, de la coque, du branchement de la fiche, des chapitres, des rubriques, des quiz, des ids et des scènes intégrées.
2. `node outils/qa/qa_migrees.js <dossier>` : chaque étape s'ouvre et est marquée, `cochesSansGeste` vaut 0 partout, console propre (le 404 de `favicon.ico` ne compte pas), aucun débordement à 375 px, écran et contrôles dans 1366 × 768. **Regarder les captures.**
3. `node outils/qa/qa_theorie.js <dossier>` : aucune erreur KaTeX ni LaTeX brut, aucun débordement à 1440 et 375 px.
4. Un script Playwright jetable (non commité) réalise **au moins un essai par scène** avec les vrais contrôles et vérifie `.fiche-essais li.fait`, **y compris après un Réinitialiser** (aucun essai coché par le reset seul, chaque essai encore réalisable ensuite, y compris en revenant sur la scène après avoir déplacé les curseurs) ; chaque calcul vivant donne des valeurs justes aux bornes de ses curseurs ; chaque quiz accepte la bonne réponse et refuse une mauvaise ; chaque URL d'embed ouvre la bonne étape.
5. Thèmes clair et sombre lisibles ; `prefers-reduced-motion` ralentit sans figer le sujet.

## Lien vers une étape et mode intégré

`planche.js` lit deux familles de paramètres d'URL, sur **toutes** les planches qui chargent la coque.

| Paramètre | Effet |
|---|---|
| `?etape=01.3` | Ouvre l'étape dont le code est affiché dans la barre. Aussi `?etape=3` (rang, 1 = première), et `?etape=48.2` sur une page qui numérote ses étapes « 1 2 3 » si 48 est son `data-module`. Choisie après le `load`, pour passer après l'initialisation propre de la page. |
| `&scene=2` | Seconde scène d'une étape à deux scènes (`data-b`), si la page expose `window.allerScene`. |
| `?embed` | Mode intégré, pour une iframe : la scène et sa barre de contrôles seules, à toute largeur (la grille de bureau est forcée, sans mise en page mobile). Page à couches : Manipuler par défaut. Un lien « Ouvrir la planche ↗ » mène à la planche complète, à la même étape. |
| `&panneau=1` | Garde le panneau de lecture à droite (masqué sous 520 px). Sur une page à fiche, seules les lectures restent. |
| `&controles=0` | Retire la barre de contrôles : scène seule. |

Exemple : `<iframe src="../fondations-langage/index.html?embed&etape=02.1&scene=2&panneau=1" height="440" loading="lazy" title="Composantes d'un vecteur"></iframe>`.

En mode intégré, les touches qui changent d'étape ou de couche (chiffres, lettres de couche, I, F) sont neutralisées : l'étape reste celle qu'a choisie l'auteur. Les commandes propres à la page (← → ou boutons Précédent / Suivant sur certaines planches) restent actives. La molette ne va à la scène qu'après un clic dedans ; avant, elle fait défiler la page qui accueille l'iframe, et un avis le dit. Styles : fin de `planche-etapes.css` (`html.labo-embed`) ; `theme.js` pose la classe dès le `<head>` pour éviter un éclair de la coque.

Vérifié le 2026-10-13 sur Langage scientifique, Oscillations et ondes, Une particule, des amplitudes et La mitose, à 694 et 360 px de large, ainsi que sur Optique.

## Forme plein écran (décision du 2026-10-07)

`planche.js` replie la coque en **une seule barre** (LABO, retour, titre court, codes d'étape avec le titre en infobulle, Focus, Infos, thème ; sur une page à couches, aussi O · M · C). Le titre complet, la signature et l'aide vont dans un **tiroir** qu'ouvre le bouton « Infos » ou la touche **I** (Échap le referme). L'écran est bord à bord et prend toute la hauteur restante. Rien à changer dans les pages : `planche.js` déplace les éléments de la coque au chargement, sans les recréer. La lecture, la pause, la frise du temps, la vitesse et les gestes centraux restent toujours visibles.

## Pièges déjà rencontrés

Relevés pendant les migrations (2026-10-04 à 07) et le prototype de la fiche (2026-10-13) ; ils valent pour toute page.

1. **Ordre des feuilles de style.** `labo.css` AVANT le `<style>` de la page, `planche-etapes.css` puis `fiche.css` APRÈS. Sinon `labo.css` écrase les jetons de l'écran (`--positif`, `--negatif`, `--energie`, `--trait`) et la simulation change de couleurs en thème clair. La coque utilise `--filet`, pas `--trait`.
2. **`planche.js` doit être inclus**, en dernier. Sans lui : coque non repliée et écran trop haut.
3. **Réserve d'en-tête.** L'ancien titre superposé à la scène réservait 90 à 130 px en haut du dessin (`headH()`, `top = 108`, `headRect()`…). Une fois le titre sorti de la scène, réduire cette réserve (16 à 36 px) et vérifier sur capture.
4. **Regrouper sans toucher à la physique.** Un bouton d'étape à deux index (`data-a` et `data-b`) ; le marquage de l'étape courante teste `data-a` **ou** `data-b`. L'index des fiches est l'index de scène.
5. **Graphe caché puis montré.** Un canvas caché a une taille nulle : le redimensionner quand il réapparaît (`ResizeObserver`), par exemple en sortant du mode Focus.
6. **LaTeX et regex.** Ne jamais les écrire par un heredoc shell (les barres obliques inverses sont corrompues) : écrire un fichier, puis l'exécuter. Dans le HTML : `\lt`, `\gt`, virgule décimale `{,}`, `\dd`.
7. **Attributs HTML du cours.** Dans `data-expr`, écrire `&lt;` pour `<`, `&amp;&amp;` pour `&&`, et des guillemets simples dans l'expression ; dans `data-src`, `&amp;` entre les paramètres. Un nom de variable de calcul ne reprend pas un nom d'aide (`plan`, `trace`, `fmt`, `sci`, `sup`, `ordre`, `mant`…).
8. **Commentaire `//` dans une ligne de code** : il avale la suite de la ligne. Préférer `/* … */` au milieu d'une expression.
9. **Onglet masqué.** `requestAnimationFrame` s'y arrête : la simulation paraît figée, les essais ne se cochent pas, les équations vivantes ne bougent pas. Tester en headless (Playwright avec Edge) avant de conclure à un bug.
10. **Iframes hors écran** : elles chargent tard. Faire défiler jusqu'à elles avant de mesurer.
11. **`?etape=` est appliqué après le `load`.** Si la page ouvre sa première étape plus tard (minuterie), le signaler au lieu de modifier `planche.js`.
12. **PR empilées.** Ne pas supprimer la branche de base d'une PR dont une autre dépend (`gh pr merge --delete-branch` a fermé une PR empilée le 2026-10-04).
13. **`mem` survit à un reset de la même scène.** `Fiche.montre(i)` sort tout de suite quand `i` est la scène en cours : appeler `Fiche.relance()` avant lui dans la fonction d'étape, et dans tout reset propre à un jouet (section « Réinitialiser la scène sans la quitter »).

## Format hérité

### Planche à couches (pages non migrées)

Jusqu'au 2026-10-15, les planches de `opus-sonnet/` étaient habillées avec trois **couches** : Observer (la scène seule), Manipuler (réglages et mesures), Comprendre (texte et lien de théorie). `<body class="labo-etapes" data-mode="observer" data-touches="omc">` (les chiffres servent aux étapes ; une page dont une touche de simulation est déjà o, m ou c choisit d'autres lettres : O/M/K, V/M/C, O/A/C, O/A/K), bloc `div.modes` de trois onglets avec `data-indice`, classes `couche-lire` (Manipuler et Comprendre) et `couche-comp` (Comprendre) dans le panneau, réglages masqués en Observer. Référence historique : [`opus-sonnet/fondations-oscillations-ondes/index.html`](../opus-sonnet/fondations-oscillations-ondes/index.html). Une correction ponctuelle sur une page à couches garde ce format ; tout travail de structure la migre.

### Planches maquettes (`gabarit.html`)

`gabarit.html`, `planche.css` et l'entrée `MAQUETTES` de `presentation.js` servaient à dessiner des **maquettes** de la direction visuelle (`<body data-module="NN">`, scène SVG au `viewBox` fixe, étiquettes posées en pourcentage par `pc(el, x, y)`, lecture d'instrument `.lecture`, équation `.eqn`, fiche contextuelle `.fiche` ouverte par `.ouverte`, repère `.rep`, API `Planche.mode`, `Planche.surMode`, `Planche.surEchap`). Une maquette ne compte pas dans `corpus/` ; aucune n'est en cours. Une page neuve part des références du gabarit standard, pas de `gabarit.html`.
