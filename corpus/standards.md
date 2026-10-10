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

État de la branche de migration au 2026-10-07, après la migration des 16 fondations et des 6 showcases et l’ajout de la fondation 37 : les chapitres réalisés respectent tous la règle de 2 à 4 étapes par chapitre. Les scènes regroupées restent accessibles depuis leurs commandes.

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
| Atomes, noyaux et lumière | 26 · 27 | 4 + 3 emplacements à venir | 4 réalisées + 3 emplacements | Gabarit LABO ; chapitre 26 réalisé, chapitre 27 explicitement à venir ; théorie disponible. |
| Signaux et équilibres du vivant | 37 | 4 | 4 | Conforme ; liaison, cascade, glycémie et boucles à retard. Ajout du 2026-10-07. |
| D’un gradient à une tension | 33 | 4 | 4 | Conforme, gabarit LABO ; couverture partielle complémentaire au showcase Neurone. Ajoutée le 2026-10-07. |
| Réactions : vitesse et équilibre | 30 | 4 | 4 | Construite le 2026-10-06, avant la migration : **pas encore au gabarit LABO** (`planche.js`, coque repliée). À migrer. |
| Protons et électrons qui passent | 31 | 4 | 4 | Conforme ; pH, tampons et titrage, redox, pile et électrolyse. |

Les quatre fondations récentes suivent aussi le gabarit. Les commandes de scène sont conservées : couches O/M/K pour Magnétisme et Molécules, V/M/C pour Onde électromagnétique, O/A/C pour Atomes, afin de garder C (couper ou casser), O (osciller) et M (changer de modèle). La conformité du nombre d’étapes ne signifie pas que toute la couverture conceptuelle est complète : les statuts restent ceux du corpus.

### Showcases : un chapitre par phénomène

Les six showcases suivent le gabarit LABO : un chapitre, leurs actes conservés, trois couches Observer / Manipuler / Comprendre, signature Échelle · Temps · Modèle, retour « ← Phénomènes » et lien « Comprendre ce qui se passe » vers `explication.html`. La règle des 2 à 4 étapes concerne les fondations uniquement.

| Page | Chapitre | Étapes | Particularité conservée |
|---|---|---|---|
| La mitose | Mitose | 7 | Frise continue réversible, curseur `rng`, touches 1–7. |
| La respiration cellulaire | Respiration cellulaire | 4 + vue « Tout le trajet » | Frise `scrub`, oxygène `o2`. |
| Le neurone qui apprend | Neurone | 2 actes | Impulsion et Synapse ; sous-étapes automatiques et oscilloscope dans la scène. |
| Ondes et interférences | Ondes et interférences | 6 | Hors collection ; sources, sondes et oscilloscope. |
| La réplication de l’ADN | Réplication de l’ADN | 5 | Graphe de la distance à la fourche. |
| Supernova par effondrement du cœur | Supernova | 8 | Frise logarithmique `tlBox`, sans curseur physique. |
