# LABO

> Modèles pour voir ce qui se passe.

LABO est un laboratoire scientifique personnel, à mi-chemin entre le musée interactif et la bibliothèque de simulations. Chaque modèle rend visible, manipulable ou intuitif un phénomène qu'on ne peut normalement pas voir : trop petit, trop grand, trop rapide, trop lent, trop abstrait, ou trop difficile à imaginer à partir des équations seules. Une cellule qui se divise, une boîte de molécules d'où sortent la température et la pression, un boulet de canon qui tombe sans jamais toucher le sol, le cœur de fer d'une étoile qui s'effondre.

Le dépôt s'appelle techniquement `labo-modeles`. Site publié : <https://m4xbrg.github.io/labo-modeles/> (pages en `noindex`).

## Ce qu'on y trouve

LABO distingue plusieurs niveaux, qu'il ne faut pas confondre :

> module ≠ production ≠ modèle ≠ collection ≠ idée d'Atlas

- **Fondations** : une carte de **50 modules canoniques** (01 Mesure et échelles … 50 Spin et intrication), qui forment la grammaire scientifique réutilisable. Un module n'est pas une page.
- **Productions** : des unités de fabrication qui couvrent un ou plusieurs modules (« Oscillations et ondes » couvre 06 + 14 + 15).
- **Modèles** : ce qui s'ouvre réellement, une page interactive et son explication « Comprendre ce qui se passe ».
- **Showcases** : des modèles construits autour d'un phénomène riche, qui mobilisent plusieurs fondations (mitose, réplication de l'ADN, supernova).
- **Collections** : des séries éditoriales. *L'invisible en mouvement*, qui a longtemps donné son nom au projet, est aujourd'hui une collection de cinq showcases.
- **Atlas** : le réservoir des phénomènes que LABO pourrait construire un jour. Une idée d'Atlas n'est pas une page.

## Pourquoi des fondations

Le projet a commencé par des phénomènes : la **mitose** d'abord, avec la respiration cellulaire, le neurone et le champ électrique. La mitose a montré qu'un mécanisme biologique complexe devient lisible quand la page est conçue autour du mécanisme lui-même. Elle reste un des showcases de référence.

En visant des sujets plus ambitieux, il est devenu clair qu'une supernova ou une collision d'étoiles à neutrons supposent la gravitation, l'énergie, la pression, les noyaux et le rayonnement. Les fondations existent pour ne pas réexpliquer tout cela dans chaque showcase. Elles donnent une intuition juste, le vocabulaire, les relations et les équations utiles ; les showcases peuvent alors se concentrer sur leur phénomène propre.

Les fondations ne remplacent pas les grands modèles : elles les rendent possibles. Et LABO n'est pas un curriculum : les préalables sont des chemins conseillés, pas des verrous, et la forme suit le phénomène (interactive, narrative, contemplative, comparative ou toy).

## État du projet

Le détail, à jour, est dans [`corpus/`](corpus/README.md). En résumé, au 2026-10-10 (état préparé après fusion des modules 31 et 34) :

**26 modèles : 25 construits et un partiel.**

- Planches numérotées 01-09 : La mitose · La respiration cellulaire · Le neurone qui apprend · Le champ électrique · Ondes et interférences · Courant et circuits · Matière, chaleur et transport · La réplication de l'ADN · Supernova par effondrement du cœur. Cinq d'entre elles (mitose, respiration, neurone, réplication, supernova) forment la collection *L'invisible en mouvement*.
- Pages de fondations : Langage scientifique (01·02·03) · Systèmes, croissance et hasard (04·05·07) · Oscillations et ondes (06·14·15) · Forces, énergie et conservation (10·11) · Rotation, gravitation et orbites (12·13) · Flux, gradients, champs et fluides (16·20) · Relativité restreinte (46) · Évolution et génétique des populations (40) · Cellule, membrane et transport (32) · Magnétisme et induction (23) · L'onde électromagnétique (24) · Molécules et mole (28·29) · Signaux et équilibres du vivant (37) · Protons et électrons qui passent (31, acide-base, redox et électrochimie) · D’un gradient à une tension (33, couverture partielle) · L’énergie du vivant (34). *Atomes, noyaux et lumière* (26·27) est `partial` : chapitre 26 et explication construits, chapitre 27 à venir.
- Les huit productions de fondations définies au départ sont construites ; les planches 06 et 07 en sont issues, et la 04 a été prolongée par l'une d'elles.

**Partiel.** Les modules 07 (hasard) et 08 (non-linéarité) ne sont couverts qu'en partie ; 36 et 44 le sont en partie, grâce à des showcases. La page de préalables n'a rien pour la supernova ni pour les fondations.

**Prévu, rien de construit.** Les fondations 25 (optique) à 36 (génome), sauf 26, 28, 29, 31, 32, 33 et 34 (le 27 a sa théorie, pas encore sa planche), dans l'ordre de la feuille de route, puis la physiologie, les populations et l'émergence, l'astrophysique, le reste de la relativité et la quantique.

**Seulement des idées.** L'essentiel de l'Atlas : sur 265 entrées, 16 sont construites, 16 partielles, 58 absorbées dans une fondation, 2 sélectionnées (double pendule, effet tunnel) et 173 restent des idées.

## Où est la source de vérité

Le dossier [`corpus/`](corpus/README.md) décrit le corpus et l'emporte sur tout autre document :

| Document | Contenu |
|---|---|
| [`corpus/README.md`](corpus/README.md) | Le modèle conceptuel, les statuts, les règles de maintenance. |
| [`corpus/fondations.md`](corpus/fondations.md) | Les 50 modules, les productions, la couverture réelle, les chaînes de préalables. |
| [`corpus/modeles.md`](corpus/modeles.md) | Tout ce qui existe vraiment, avec chemins, modules et explications. |
| [`corpus/atlas.md`](corpus/atlas.md) | Le réservoir des phénomènes, avec la liste historique et les ajouts proposés séparés. |
| [`corpus/collections.md`](corpus/collections.md) | Les collections, dont *L'invisible en mouvement*. |
| [`corpus/historique.md`](corpus/historique.md) | Généalogie, anciens noms, anciennes numérotations, statut des documents. |

Les mêmes données existent en JSON (`corpus/modules.json`, `productions.json`, `models.json`, `atlas.json`, `collections.json`), pour alimenter plus tard l'accueil de LABO.

## Organisation du dépôt

- `index.html` : redirection vers l'accueil, `labo/index.html`.
- `labo/` : l'accueil de LABO (lu dans `corpus/`), la feuille de style commune et le gabarit de planche documenté dans `labo/GABARIT.md`.
- `opus-sonnet/` : toutes les planches. Le nom vient du banc d'essai d'origine et reste pour ne pas casser les URL. `prealables.html` est la théorie préalable, chaque sous-dossier un modèle (`index.html` + `explication.html`) ; `index.html`, l'ancien accueil, redirige vers `labo/`.
- `prompts/` : la charte visuelle commune (`00-direction-artistique.md`, toujours appliquée) et les briefs de construction de chaque page. Les briefs des pages construites sont historiques : ils disent ce qui a été demandé, `corpus/` dit ce qui existe. Pour la suite : [`prompts/FEUILLE-DE-ROUTE.md`](prompts/FEUILLE-DE-ROUTE.md) (les pages de fondations qui restent, en sept vagues), [`prompts/SESSION-FONDATION.md`](prompts/SESSION-FONDATION.md) (le prompt de session et les règles communes) et un brief pour chacune de ces pages. `prompts/moteurs/` garde les moteurs physiques verrouillés d'une planche et leurs tests, à copier tels quels dans la page.
- `corpus/` : la source de vérité.

Les 18 planches de fondations et les 6 showcases suivent le [gabarit LABO](labo/GABARIT.md) : coque claire ou sombre, signature Échelle · Temps · Modèle, chapitres et couches Observer / Manipuler / Comprendre autour des simulations d’origine. Le chapitre 27 d’Atomes reste à venir, avec trois emplacements explicitement annoncés et sa théorie disponible. Voir [les standards](corpus/standards.md) pour les chapitres et les étapes. Les 16 fondations existantes ont été migrées en deux PR (nº 27 et nº 28) ; Signaux et équilibres du vivant et D’un gradient à une tension ont été construits directement avec cette coque.

Les pages sont des fichiers HTML autonomes (CSS et JS inline, polices Google avec repli système), sans étape de build. Pour les voir en local, servir la racine du dépôt (`python -m http.server`) et ouvrir `/labo/` : l'accueil lit `corpus/*.json`, ce qu'un fichier ouvert directement ne peut pas faire.

## Fabrication

Opus 5.5 écrit la direction, les briefs et souvent l'explication ; des sous-agents Sonnet 5.5 construisent ; une relecture vérifie l'exactitude scientifique et le rendu. Le dépôt est né le 2026-09-29 comme banc d'essai pour comparer des modèles d'IA sur un même brief ; cette histoire est racontée dans [`corpus/historique.md`](corpus/historique.md).
