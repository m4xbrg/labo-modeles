# Standards des pages LABO

Ce fichier fixe ce que toutes les pages doivent partager. Il s'applique aux nouvelles pages et sert de cible pour remettre les anciennes à niveau. Décisions de Max du 2026-10-04, complétées le 2026-10-15 par le **gabarit standard** (§4) : la planche à **fiche d'étape** et l'explication en **cours interactif**, prototypées sur *Langage scientifique* (PR n° 43), deviennent la forme obligatoire de toute page neuve et la cible de toute migration.

## 1. En-tête commun (toutes les planches et explications)

- **Surtitre** : `LABO · L’invisible en mouvement` pour les showcases de la collection, `LABO · Fondations NN · NN` (numéros canoniques sur deux chiffres, ceux que la page couvre en `full` ou `partial`) pour les pages de fondations, `LABO · Phénomènes` pour un showcase hors collection.
- **Retour** : un lien `LABO` vers `../../labo/index.html`. Plus de « série ».
- **Titre d'onglet** : `Titre de la page — LABO`.

## 2. Théorie des fondations : une section par module

L'explication d'une page de fondations (`explication.html`) contient une partie **« La théorie, module par module »** : un sommaire, puis une `<section class="module" id="mNN">` par module canonique couvert, dans l'ordre des numéros. Chaque section a exactement ces sept rubriques, dans cet ordre :

| # | Rubrique | Contenu attendu |
|---|---|---|
| 1 | Intuition | Un paragraphe : l'image mentale juste, sans formule. |
| 2 | Définitions | Une liste `dl.defs` : terme, symbole, unité, définition en une phrase. Toutes les grandeurs utilisées plus bas y figurent. |
| 3 | Relations clés | 3 à 6 blocs `div.relation` : une équation en LaTeX, puis ce qu'elle dit en une ou deux phrases. Les relations du programme du module, pas plus. |
| 4 | Exemple chiffré | Un cas réel, calculé pas à pas, avec unités et ordres de grandeur vérifiés. |
| 5 | Pièges fréquents | 4 à 6 erreurs classiques, chacune corrigée. |
| 6 | Où ça resservira | 3 à 6 renvois vers d'autres modules par numéro canonique, et vers des planches existantes. |
| 7 | Teste-toi | 3 questions avec réponse dans `<details>`, dont au moins une calculatoire. |

Repères : **800 à 1 150 mots de prose par module**, toutes rubriques comprises, formules exclues (une formule en ligne compte pour un mot, une formule en bloc pour zéro). Relations clés : 3 à 6 blocs. Teste-toi : exactement 3 questions. « Les bases, mais assez complet » : quelqu'un qui a lu la section doit pouvoir faire l'exemple chiffré seul et reconnaître le concept dans une autre planche.

Le reste de l'explication garde son rôle : **Ce que tu vois** (avant la théorie), puis **Ce que la simulation simplifie**, **Les chiffres à retenir**, **Seulement introduit ici** (après).

**Mise en forme : le cours interactif (standard depuis le 2026-10-15).** Les sept rubriques gardent leur contenu ; la forme est celle de [`opus-sonnet/fondations-langage/explication.html`](../opus-sonnet/fondations-langage/explication.html), la **référence**. Jetons et thème LABO (`labo/labo.css`, `labo/cours.css`, `labo/theme.js`), KaTeX par `labo/theorie.js`, composants de `labo/cours.js` : sommaire collant qui suit la lecture, scènes de la planche intégrées au texte (`figure.labo`, mode `?embed`), calculs vivants aux nombres réglables (`.calc`, avec les dessins `plan` et `trace`), questions vérifiées (`.quiz`), exemple chiffré pas à pas (`ol.pas-a-pas`), termes du glossaire avec bulle (`a.terme` vers `#def-…`). Le détail des quantités par module est au §4.

Formules : `\( … \)` en ligne, `\[ … \]` en bloc, `\dd` pour la différentielle droite, la virgule décimale française écrite `{,}` dans les formules (`16{,}7`). Les caractères `<` et `>` dans une formule s'écrivent `\lt` et `\gt`. Hors formule, nombres et unités restent en texte.

**Ancien format (hérité).** `labo/theorie.css` sur une page sombre à serif, sans composants ; référence historique : [`opus-sonnet/fondations-oscillations-ondes/explication.html`](../opus-sonnet/fondations-oscillations-ondes/explication.html). Il reste valide pour les pages pas encore migrées, mais on n'écrit plus de page neuve dans ce format.

Les showcases ne suivent pas ce plan en sept rubriques : leur explication porte sur leur phénomène, et renvoie aux fondations pour la théorie de base. Elles prennent quand même la **forme** du cours interactif (§4).

## 3. Taille des pages de fondations : un chapitre par module

La navigation d'une page de fondations est organisée en **chapitres = modules canoniques**, avec **2 à 4 étapes par chapitre**. Une page à trois modules a donc 6 à 12 étapes ; une page à un module, 2 à 4. Une même barre d'étapes partout, sans onglets imbriqués.

Ce tableau suit le **découpage** en chapitres et en étapes ; la migration vers le gabarit standard (fiche d'étape, cours interactif) est suivie au §4. État au 2026-10-13 (`main` au commit `3f2faab`) : les 35 pages respectent la règle de 2 à 4 étapes par chapitre, et les 6 showcases ont migré. Les scènes regroupées restent accessibles depuis leurs commandes. Les trois dernières pages qui avaient leur propre mise en page (*Optique*, *Protons et électrons qui passent*, *L’énergie du vivant*) ont reçu la coque commune (`labo/labo.css`, `planche-etapes.css`, `planche.js`) le 2026-10-13. « Conforme, gabarit LABO » ci-dessous veut dire : coque commune chargée.

| Page | Chapitres (modules canoniques) | Étapes par chapitre | Total | État |
|---|---|---|---|---|
| Langage scientifique | 01 · 02 · 03 | 4 + 2 + 2 | 8 | Conforme, gabarit LABO. |
| Systèmes, croissance et hasard | 04 · 05 · 07 (+ 08 partiel) | 4 + 2 + 3 | 9 | Conforme ; la rétroaction est dans 04. |
| Oscillations et ondes | 06 · 14 · 15 | 2 + 3 + 4 | 9 | Conforme ; impulsion et onde périodique regroupées dans 15.1. |
| Forces, énergie et conservation | 10 · 11 | 3 + 3 | 6 | Conforme, gabarit LABO. |
| Rotation, gravitation et orbites | 12 · 13 | 4 + 3 | 7 | Conforme, gabarit LABO. |
| Flux, gradients, champs et fluides | 16 · 20 | 3 + 2 | 5 | Conforme ; scènes au choix dans les étapes. |
| Matière, chaleur et transport | 17 · 18 · 19 | 2 + 3 + 4 | 9 | Conforme, gabarit LABO. |
| Le champ électrique | 21 | 4 | 4 | Conforme, gabarit LABO. |
| Courant et circuits | 22 | 4 | 4 | Conforme, gabarit LABO. |
| Cellule, membrane et transport | 32 | 4 | 4 | Conforme ; scènes regroupées. |
| Évolution et génétique des populations | 40 | 4 | 4 | Conforme ; scènes regroupées. |
| Relativité restreinte | 46 | 4 | 4 | Conforme ; scènes regroupées. |
| Magnétisme et induction | 23 | 4 | 4 | Conforme, gabarit LABO. |
| Molécules et mole | 28 · 29 | 4 + 3 | 7 | Conforme, gabarit LABO. |
| L’onde électromagnétique | 24 | 4 | 4 | Conforme, gabarit LABO. |
| Atomes, noyaux et lumière | 26 · 27 | 4 + 3 | 7 | Chapitre 27 ajouté dans la vague 1 (PR n° 37), à essayer. |
| Signaux et équilibres du vivant | 37 | 4 | 4 | Conforme ; liaison, cascade, glycémie et boucles à retard. Ajout du 2026-10-07. |
| D’un gradient à une tension | 33 | 4 | 4 | Conforme, gabarit LABO ; couverture partielle complémentaire au showcase Neurone. Ajoutée le 2026-10-07. |
| Réactions : vitesse et équilibre | 30 | 4 | 4 | Conforme, gabarit LABO et coque repliée ; couches V/M/K, O orientation, C catalyseur, N injection, I Infos. Migrée le 2026-10-10. |
| Protons et électrons qui passent | 31 | 4 | 4 | Conforme, gabarit LABO ; pH, tampons et titrage, redox, pile et électrolyse. Couches O/M/C. Migrée le 2026-10-13. |
| Optique : la lumière qui tourne | 25 | 4 | 4 | Conforme, gabarit LABO ; un chapitre et des sous-scènes en bascule, table d’optique autonome. Couches O/M/C ; « inverser » passe de I à S (I ouvre le tiroir Infos). Migrée le 2026-10-13. |
| L’énergie du vivant | 34 | 4 | 4 | Conforme, gabarit LABO ; couplage, enzymes, bilan de la respiration et photosynthèse. Couches O/A/K (C et M restent aux commandes de la scène) ; « inhibiteur » passe de I à H. Migrée le 2026-10-13. |
| Stabilité, bifurcations et chaos | 08 | 4 | 4 | Vague 1 (PR n° 37) ; nombre d’étapes recensé, validation visuelle à poursuivre. |
| Un signal, des fréquences | 09 | 4 | 4 | Vague 1 (PR n° 37) ; nombre d’étapes recensé, validation visuelle à poursuivre. |
| Du local au collectif | 41 · 42 | 4 + 4 | 8 | Vague 1 (PR n° 37) ; nombre d’étapes recensé, validation visuelle à poursuivre. |
| De l’ADN à la protéine | 35 | 4 | 4 | Vague 1 (PR n° 37) ; nombre d’étapes recensé, validation visuelle à poursuivre. |
| Muscle, cœur et échanges | 38 | 4 | 4 | Vague 1 (PR n° 37) ; nombre d’étapes recensé, validation visuelle à poursuivre. |
| La gravité comme géométrie | 47 | 4 | 4 | Vague 1 (PR n° 37) ; nombre d’étapes recensé, validation visuelle à poursuivre. |
| Une particule, des amplitudes | 48 | 4 | 4 | Vague 1 (PR n° 37) ; nombre d’étapes recensé, validation visuelle à poursuivre. |

Les quatre fondations récentes suivent aussi le gabarit. Les commandes de scène sont conservées : couches O/M/K pour Magnétisme et Molécules, V/M/C pour Onde électromagnétique, O/A/C pour Atomes, afin de garder C (couper ou casser), O (osciller) et M (changer de modèle). La conformité du nombre d’étapes ne signifie pas que toute la couverture conceptuelle est complète : les statuts restent ceux du corpus.

### Showcases : un chapitre par phénomène

Les six showcases suivent le gabarit LABO : un chapitre, leurs actes conservés, trois couches Observer / Manipuler / Comprendre (format hérité, à migrer vers la fiche d'étape, §4), signature Échelle · Temps · Modèle, retour « ← Phénomènes » et lien « Comprendre ce qui se passe » vers `explication.html`. La règle des 2 à 4 étapes concerne les fondations uniquement.

| Page | Chapitre | Étapes | Particularité conservée |
|---|---|---|---|
| La mitose | Mitose | 7 | Frise continue réversible, curseur `rng`, touches 1–7. |
| La respiration cellulaire | Respiration cellulaire | 4 + vue « Tout le trajet » | Frise `scrub`, oxygène `o2`. |
| Le neurone qui apprend | Neurone | 2 actes | Impulsion et Synapse ; sous-étapes automatiques et oscilloscope dans la scène. |
| Ondes et interférences | Ondes et interférences | 6 | Hors collection ; sources, sondes et oscilloscope. |
| La réplication de l’ADN | Réplication de l’ADN | 5 | Graphe de la distance à la fourche. |
| Supernova par effondrement du cœur | Supernova | 8 | Frise logarithmique `tlBox`, sans curseur physique. |

## 4. Gabarit standard : fiche d'étape et cours interactif

Décision de Max du 2026-10-15, après le prototype sur *Langage scientifique* (PR n° 43). **À partir de cette date, toute page neuve est construite dans ce gabarit, et toute page existante y est migrée.** Les pages à couches restent en ligne et valides tant qu'elles ne sont pas migrées ; la migration se fait page par page, au fil des semaines, sans date butoir. Recettes et pièges : [`labo/GABARIT.md`](../labo/GABARIT.md). Références à imiter : [`opus-sonnet/fondations-langage/index.html`](../opus-sonnet/fondations-langage/index.html) et [`explication.html`](../opus-sonnet/fondations-langage/explication.html).

### 4.1 Pourquoi

Les couches Observer / Manipuler / Comprendre étaient peu claires : la page s'ouvrait sur un panneau vide, et deux navigations (étapes, couches) se croisaient. Les explications, elles, étaient des textes à lire à côté de la planche, sans lien direct avec ses scènes. Le gabarit standard fait une seule navigation (les étapes), met tout en vue, et fait entrer les scènes dans le cours.

### 4.2 La planche : une fiche par scène

- **Plus de couches.** `<body class="labo-etapes labo-fiche" data-mode="fiche">`, sans `div.modes` ni `data-touches`. Tout est visible ; seul le mode **Focus** (bouton de la barre, touche F) masque la fiche pour laisser la scène seule.
- **Coque inchangée** : barre repliée, retour (← Fondations ou ← Phénomènes), position, thème, tiroir Infos (I) avec titre, phrase d'accroche et signature Échelle · Temps · Modèle ; chapitres et étapes du §3.
- **La fiche** (`labo/fiche.js`, `labo/fiche.css`), lue de haut en bas dans le panneau : en-tête (code, rang, titre, bascule de scène si l'étape en regroupe deux) · **Regarde** (1 ou 2 phrases sur ce qu'il faut remarquer) · **Prédis** (une question avant de toucher : réponse chiffrée avec tolérance, ou choix de 2 ou 3 options) · **Essaie** (2 ou 3 gestes réalisables, cochés d'eux-mêmes d'après l'état de la simulation, jamais vrais au chargement) · **Lectures** (le panneau de mesures de la page, inchangé) · **Pourquoi** (2 à 4 phrases, relation clé en KaTeX, équation vivante si le panneau ne montre pas déjà le calcul ; définitions et piège fréquent en replis) · étapes précédente et suivante, lien vers la théorie.
- **Une fiche par scène.** Une étape qui regroupe deux scènes (`data-a`, `data-b`) a deux fiches.
- **Exactitude.** Les valeurs citées dans Prédis sont celles du réglage par défaut de la scène, et la réponse est recalculée avec le moteur, pas de tête.
- **Showcases** : même fiche, une par acte ; le lien de fin est « Comprendre ce qui se passe » vers `explication.html`.
- **Lien vers une étape et mode intégré** : `?etape=NN.k`, `&scene=2`, `?embed` (`&panneau=1`, `&controles=0`), fournis par `planche.js` à toutes les planches.
- **Ce qui ne change pas en migrant** : moteur, calculs, couleurs de l'écran, commandes existantes. Si une touche de la page est déjà F, elle la garde et Focus reste au bouton.

### 4.3 L'explication : le cours interactif

- **Fondations** : les sept rubriques du §2, avec leurs ids `mNN-intuition`, `mNN-defs`, `mNN-relations`, `mNN-exemple`, `mNN-pieges`, `mNN-suite`, `mNN-test`, listés par le sommaire. Par module : **2 scènes intégrées** (`figure.labo data-src="index.html?embed&amp;etape=NN.k"`, placées là où le texte parle de ce qu'elles montrent, légende qui dit quoi faire) ; **2 ou 3 calculs vivants** attachés aux relations clés ; **1 ou 2 questions** dans les relations ; les **3 Teste-toi en `.quiz`** ; l'exemple chiffré en **`ol.pas-a-pas`** ; des définitions aux ids `def-…` uniques et 3 à 6 termes en `a.terme`. L'en-tête de chaque module relie ses étapes (`p.etapes`, liens `index.html?etape=NN.k`) ; « Ce que tu vois » devient des cartes qui ouvrent la planche à l'étape.
- **Showcases** : la même forme (barre, sommaire, scènes intégrées aux actes, quiz, calculs vivants quand une relation s'y prête), sur leur propre plan ; pas de sept rubriques.
- **Théorie préalable** (`opus-sonnet/prealables.html`) : à passer à la même forme quand on y retouche.

### 4.4 Vérifier

1. `node outils/qa/conformite.mjs <dossier> --strict` : lecture statique, sans navigateur. Ordre des feuilles de style et des scripts, coque, fiche branchée, chapitres, sept rubriques, quiz du Teste-toi, ids et liens internes, scènes intégrées qui visent une étape réelle. Une page au standard ne doit avoir **aucune erreur** (`✗`) ; les avertissements (`·`) signalent ce qui manque aux quantités visées.
2. `node outils/qa/qa_migrees.js <dossier>` puis `qa_theorie.js <dossier>` (voir [`outils/qa/README.md`](../outils/qa/README.md)) : rendu, débordement, console, et pour une fiche, aucun essai coché sans geste. Regarder les captures.
3. Un script Playwright jetable réalise au moins un essai par scène avec les vrais contrôles ; chaque prédiction est recalculée avec le moteur et la PR liste les valeurs.

### 4.5 État de la migration

Généré par `node outils/qa/conformite.mjs --markdown` le 2026-10-15, sur la branche qui fait de ce gabarit le standard. Le régénérer et le recopier ici après la fusion des migrations (pas dans chaque PR de migration, pour éviter les conflits entre migrations parallèles).

| Page | Dossier | Planche | Explication | État |
|---|---|---|---|---|
| La mitose | `01-mitose` | Couches O/M/C | Ancien format | À migrer |
| La respiration cellulaire | `02-respiration` | Couches O/M/C | Ancien format | À migrer |
| Le neurone | `03-neurone` | Couches O/M/C | Ancien format | À migrer |
| Le champ électrique | `04-champ-electrique` | Couches O/M/C | Ancien format | À migrer |
| Ondes et interférences | `05-ondes-interferences` | Couches O/M/C | Ancien format | À migrer |
| Courant et circuits | `06-courant-circuits` | Couches O/M/C | Ancien format | À migrer |
| Matière, chaleur et transport | `07-matiere-chaleur` | Couches O/M/C | Ancien format | À migrer |
| La réplication de l'ADN | `08-replication-adn` | Couches O/M/C | Ancien format | À migrer |
| Supernova par effondrement du cœur | `09-supernova` | Couches O/M/C | Ancien format | À migrer |
| Protons et électrons qui passent | `fondations-acide-base-redox` | Couches O/M/C | Ancien format | À migrer |
| Atomes, noyaux et lumière | `fondations-atomes-spectres` | Couches O/M/C | Ancien format | À migrer |
| D’un gradient à une tension | `fondations-bioelectricite` | Couches O/M/C | Ancien format | À migrer |
| Cellule, membrane et transport | `fondations-cellule-membrane` | Couches O/M/C | Ancien format | À migrer |
| Stabilité, bifurcations et chaos | `fondations-chaos` | Couches O/M/C | Ancien format | À migrer |
| L’énergie du vivant | `fondations-energie-biologique` | Couches O/M/C | Ancien format | À migrer |
| Évolution et génétique des populations | `fondations-evolution-populations` | Couches O/M/C | Ancien format | À migrer |
| Fondations | `fondations-flux-fluides` | Couches O/M/C | Ancien format | À migrer |
| Forces, énergie et conservation | `fondations-forces-energie` | Couches O/M/C | Ancien format | À migrer |
| De l’ADN à la protéine | `fondations-information-genetique` | Couches O/M/C | Ancien format | À migrer |
| Langage scientifique | `fondations-langage` | Fiche d’étape | Cours interactif | Au standard |
| Magnétisme et induction | `fondations-magnetisme-induction` | Couches O/M/C | Ancien format | À migrer |
| Molécules et mole | `fondations-molecules-mole` | Couches O/M/C | Ancien format | À migrer |
| L'onde électromagnétique | `fondations-onde-electromagnetique` | Couches O/M/C | Ancien format | À migrer |
| Optique : la lumière qui tourne | `fondations-optique` | Couches O/M/C | Ancien format | À migrer |
| Oscillations et ondes | `fondations-oscillations-ondes` | Couches O/M/C | Ancien format | À migrer |
| Muscle, cœur et échanges | `fondations-physiologie-circulation` | Couches O/M/C | Ancien format | À migrer |
| Du local au collectif | `fondations-populations-emergence` | Couches O/M/C | Ancien format | À migrer |
| Une particule, des amplitudes | `fondations-quantique` | Couches O/M/C | Ancien format | À migrer |
| Réactions : vitesse et équilibre | `fondations-reactions-chimiques` | Couches O/M/C | Ancien format | À migrer |
| La gravité comme géométrie | `fondations-relativite-generale` | Couches O/M/C | Ancien format | À migrer |
| Relativité restreinte | `fondations-relativite-restreinte` | Couches O/M/C | Ancien format | À migrer |
| Rotation, gravitation et orbites | `fondations-rotation-gravitation` | Couches O/M/C | Ancien format | À migrer |
| Signaux et équilibres du vivant | `fondations-signalisation-homeostasie` | Couches O/M/C | Ancien format | À migrer |
| Un signal, des fréquences | `fondations-signaux-fourier` | Couches O/M/C | Ancien format | À migrer |
| Systèmes, croissance et hasard | `fondations-systemes-hasard` | Couches O/M/C | Ancien format | À migrer |

1 page(s) sur 35 au standard.
