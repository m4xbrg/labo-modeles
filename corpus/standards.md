# Standards des pages LABO

Ce fichier fixe ce que toutes les pages doivent partager. Il s'applique aux nouvelles pages et sert de cible pour remettre les anciennes à niveau. Décisions de Max du 2026-10-04.

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

**Mise en forme.** `labo/theorie.css` (composants) et `labo/theorie.js` (KaTeX 0.16.11, cdnjs). Dans le HTML : `\( … \)` en ligne, `\[ … \]` en bloc, `\dd` pour la différentielle droite, la virgule décimale française écrite `{,}` dans les formules (`16{,}7`). Les caractères `<` et `>` dans une formule s'écrivent `\lt` et `\gt`. Hors formule, nombres et unités restent en texte.

Référence complète : [`opus-sonnet/fondations-oscillations-ondes/explication.html`](../opus-sonnet/fondations-oscillations-ondes/explication.html) (modules 06, 14, 15).

Les showcases ne suivent pas ce plan : leur explication porte sur leur phénomène, et renvoie aux fondations pour la théorie de base.

## 3. Taille des pages de fondations : un chapitre par module

La navigation d'une page de fondations est organisée en **chapitres = modules canoniques**, avec **2 à 4 étapes par chapitre**. Une page à trois modules a donc 6 à 12 étapes ; une page à un module, 2 à 4. Une même barre d'étapes partout, sans onglets imbriqués.

Ce standard s'applique au fil de la migration des planches vers le gabarit LABO ; il n'a pas été imposé page par page en réécrivant les simulations. État au 2026-10-04 :

| Page | Modules | Étapes aujourd'hui | Navigation | Écart au standard |
|---|---|---|---|---|
| Langage scientifique | 01 · 02 · 03 | 4 onglets × 2 à 4 modes (≈ 14 vues) | onglets imbriqués | Aplatir : chapitres 01 (échelles, graphiques), 02 (vecteurs), 03 (mouvement). |
| Systèmes, croissance et hasard | 04 · 05 · 07 (+ 08 partiel) | 9 | étapes à plat, chapitres A-D | Chapitre B (rétroaction) relève du 04 : regrouper A+B sous 04 (4 étapes). |
| Oscillations et ondes | 06 · 14 · 15 | 10 | étapes à plat, chapitres A-D | Le module 15 a 5 étapes (C1-D3) : en garder 4. |
| Forces, énergie et conservation | 10 · 11 | 6 | actes en paillasses | Conforme en nombre ; nommer les chapitres par module. |
| Rotation, gravitation et orbites | 12 · 13 | 7 | actes en paillasses | Conforme (4 + 3). |
| Flux, gradients, champs et fluides | 16 · 20 | 4 onglets × 4 modes (16 vues) | onglets imbriqués | Aplatir : 16 (cartes, champs, flux) et 20 (conduit). |
| Matière, chaleur et transport | 17 · 18 · 19 | 9 | actes | Conforme (3 par module). |
| Le champ électrique | 21 | bac à sable | sans étapes | À structurer en 2 à 4 étapes. |
| Courant et circuits | 22 | 4 | actes | Conforme. |
| Cellule, membrane et transport | 32 | 7 | actes en paillasses | Trop long pour un module : 4 étapes. |
| Évolution et génétique des populations | 40 | 11 | étapes à plat | Trop long pour un module : 4 étapes, ou scinder si une partie relève de 41. |
| Relativité restreinte | 46 | 8 | actes en paillasses | Trop long pour un module : 4 étapes. |
| Magnétisme et induction | 23 | 4 | actes en paillasses, scènes au choix dans chaque acte | Conforme (construite au standard le 2026-10-06). |
| Molécules et mole | 28 · 29 | 7 | étapes à plat, chapitres 28 (4) et 29 (3) | Conforme (construite au standard le 2026-10-06). |

« Trop long pour un module » ne veut pas dire qu'il faut jeter du contenu : une étape peut regrouper deux scènes voisines, et ce qui dépasse le module (ouverture vers 41 ou 47) peut devenir le premier chapitre d'une page future.
