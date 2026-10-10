# Historique et anciennes conventions

Ce fichier garde la mémoire du projet et dit quels documents sont historiques. Il ne décrit pas l'état actuel : pour cela, voir [`README.md`](README.md).

## Généalogie

| Date | Étape |
|---|---|
| 2026-09-29 | **Banc d'essai « Mécaniques invisibles ».** Le dépôt naît pour comparer des modèles d'IA sur un même brief. Opus 5.5 écrit une charte commune (`prompts/00-direction-artistique.md`) et quatre briefs ; des sous-agents Sonnet 5.5 construisent en parallèle la mitose, la respiration cellulaire, le neurone et le champ électrique, plus une page de théorie préalable. Une version du neurone est demandée à GPT-6 Astra (`prompts/astra-neurone.md`). |
| 2026-09-30 | Publication sur GitHub Pages, `noindex` sur toutes les pages, chemins locaux retirés des prompts. |
| 2026-10-01 | **Série « L'invisible en mouvement ».** Renommage avec la planche 05 (ondes et interférences), puis supernova (09), réplication de l'ADN (08), courant et circuits (06), matière-chaleur-transport (07). |
| 2026-10-01 | **Fondations.** La carte des 50 modules entre dans le dépôt par les briefs. Sept productions de fondations sont construites le même jour (langage ; forces-énergie ; oscillations-ondes ; flux-fluides ; matière-thermique sous forme de planche 07 ; électricité sous forme de prolongement de la 04 et de planche 06 ; systèmes-hasard), puis rotation-gravitation (fusionnée le 2026-10-01, PR n° 12). |
| 2026-10-01 | Un prototype d'interface **LABO** explore la future identité : « LABO — Modèles pour voir ce qui se passe ». Fusionné sur `main` le 2026-10-02 (PR n° 14), avec la relativité restreinte (PR n° 13). |
| 2026-10-02 → 04 | Ce dossier `corpus/` devient la source de vérité ; le README est réécrit autour de LABO ; la collection *L'invisible en mouvement* est resserrée à cinq showcases. |
| 2026-10-04 | Le prototype devient l'accueil : `prototype/` est renommé `labo/`, la racine et l'ancien accueil (`opus-sonnet/index.html`) redirigent vers lui. |
| 2026-10-06 | **Suite de la migration au gabarit LABO** : Magnétisme et induction, Molécules et mole, Onde électromagnétique, Atomes, noyaux et lumière. Chapitres canoniques, liens de théorie par module, raccourcis sans conflit et graphes redimensionnés au retour des couches. Moteurs conservés ; les trois emplacements du module 27 restent à venir. Contrôles ordinateur/mobile et captures relues ; PR distincte vers main. |
| 2026-10-06 | **Migration des planches au gabarit LABO** (branche claude/labo-migration) : 12 fondations et 6 showcases, coque claire/sombre, chapitres et couches communes ; scènes et moteurs conservés. Vérifications headless et relecture des captures. PR nº 27 fusionnée à la demande de Max ; publication vérifiée sur GitHub Pages. |
| 2026-10-06 | **Fondations 23 · Magnétisme et induction.** Première page de fondations construite au standard d'une page à un module (quatre étapes), à partir d'un brief et d'un moteur verrouillé versionnés dans `prompts/` (`prompts/moteurs/magnetisme.js`). |
| 2026-10-06 | **Fondations 28 · 29 · Molécules et mole.** Ouvre la branche E (atomes et chimie) : sept étapes en deux chapitres, moteur testé avant la page et versionné dans `prompts/moteurs/molecules-mole.js`. |
| 2026-10-07 | **Fondations 24 · L'onde électromagnétique.** Un chapitre de quatre étapes ; moteur écrit et testé dans la session de construction (`prompts/moteurs/onde-electromagnetique.js`), page et explication déléguées à des sous-agents, selon `prompts/SESSION-FONDATION.md`. |
| 2026-10-07 | **Fondations 26 · 27 · Atomes, noyaux et lumière (première moitié).** Chapitre 26 (quatre étapes) et explication des deux modules ; le chapitre 27 suivra. Moteur verrouillé `prompts/moteurs/atomes.js`, avec une table des nucléides recopiée de NUBASE2020 et AME2020. |

| 2026-10-06 | **Fondations 31 · Acide-base, redox et électrochimie** (« Protons et électrons qui passent »). Un chapitre, quatre étapes numérotées (pH, tampons, redox, pile). Moteur écrit et testé avant la page, versionné dans `prompts/moteurs/acide-base-redox.js`. |
| 2026-10-06 | **Fondations 25 · Optique.** Construite avant le module 24 ; premier découpage en lots parallèles contre un contrat d'interface (coquille et étapes 1-2, étapes 3-4 en fragment, explication). |

Le projet a commencé par des phénomènes, pas par une carte. Les fondations sont apparues parce que les showcases ambitieux (supernova, collisions d'étoiles à neutrons) supposaient trop de préalables pour être réexpliqués à chaque fois.

## Anciens noms

| Nom | Époque | Statut |
|---|---|---|
| « Mécaniques invisibles » | 2026-09-29 → 2026-10-01 | Ancien nom de la série. Survit seulement dans `prompts/astra-neurone.md`, volontairement : c'est le texte exact donné à Astra. |
| « L'invisible en mouvement » | depuis le 2026-10-01 | Nom de la **collection**. A servi de nom au projet entier (titre de l'accueil, de la racine, de l'ancien README). |
| « Labo modèles » / `labo-modeles` | depuis le 2026-09-29 | Nom technique du dépôt, conservé. |
| **LABO** | depuis le 2026-10-02 | Identité du projet. |
| `opus-sonnet/` | depuis le 2026-09-29 | Dossier de sortie du duo Opus + Sonnet dans le banc d'essai. Contient aujourd'hui tout LABO ; conservé pour ne pas casser les URL. |

## Anciennes numérotations

**Numéros de planches.** Les numéros 01-09 sont des numéros historiques (l'ancien ordre de la série), pas des modules. Ils ont bougé pendant la journée du 2026-10-01 :

- la réplication de l'ADN a été créée comme planche **06** (`cec7f41`), puis renumérotée **08** (`366b278`) parce que le 06 était pris par courant et circuits ;
- matière, chaleur et transport a été créée comme planche **06** (`f07d16c`), puis renumérotée **07** (`de08cb4`) pour la même raison.

**Numéros de showcases du paquet de fondations.** Le paquet préparé avant les fondations numérotait des briefs de showcases ainsi : 05 ondes, 06 ADN, **07 double pendule et chaos**, **08 effet tunnel quantique**, **09 supernova**. Dans le dépôt actuel, 07 et 08 désignent d'autres planches (matière-chaleur et réplication) ; le double pendule et l'effet tunnel n'existent que comme idées sélectionnées dans l'[Atlas](atlas.md#les-deux-idées-sélectionnées). Ces numéros sont obsolètes : on désigne ces sujets par leur nom.

**Numéros de modules du prototype d'interface.** Voir ci-dessous.

**Règle.** Dans les nouvelles données, on identifie un modèle par son slug, un module par son numéro canonique 01-50, et on ne garde les numéros 01-09 que comme repères historiques dans les noms de dossiers ; pas pour l'ordre d'affichage de la collection.

## Prototype d'interface LABO

Un prototype d'accueil LABO a été fusionné le 2026-10-02 (PR n° 14) dans `prototype/`. Dans sa première version :

- il reprenait les modules 01-07 conformément à la carte, mais divergeait ensuite : son module 08 était « Incertitude et ajustement », son 09 « Mouvement dans le plan », ses 23-50 suivaient un autre découpage (par exemple 26 « Diffraction et interférences lumineuses », 27 « Atomes et tableau périodique ») ;
- il marquait les modules 12 et 13 « à venir » alors que la page Rotation, gravitation et orbites existait ;
- il contenait une planche maquette `magnetisme.html` (module 23), retirée le 2026-10-04 : présentée comme une planche à part entière, elle n'en était pas une et détonnait à côté des vraies planches.

Le 2026-10-04, l'accueil a été branché sur `corpus/*.json` (plus aucune liste en dur), un gabarit de planche a été extrait, puis le dossier est devenu `labo/` et l'accueil officiel. L'ancien accueil sombre de la série est conservé dans l'historique git ; `opus-sonnet/index.html` n'est plus qu'une redirection.

## Documents du dépôt et leur statut

| Document | Statut | Remarque |
|---|---|---|
| `README.md` | **actuel** (réécrit le 2026-10-02) | L'ancien README décrivait un « banc d'essai » « pas versionné », « huit planches » sans la réplication, et un dossier `astra/03-neurone/` absent du dépôt. Son contenu utile (qui a construit quoi) est repris dans les fiches de [`modeles.md`](modeles.md) et ci-dessous. |
| `corpus/` | **actuel**, source de vérité | |
| `prompts/00-direction-artistique.md` | actuel pour le style, historique pour le reste | Charte visuelle toujours appliquée (palette, typographie, motion). Son introduction parle encore de « cinq pages » de la série « L'invisible en mouvement ». |
| `prompts/01-…` à `09-…`, `prompts/fondations-*.md` des pages construites | **historiques** | Briefs de construction : ils disent ce qui a été demandé, pas forcément ce qui existe. Les écarts relevés sont mineurs (titres d'actes raccourcis dans 07 et 09 ; planche 04 plus riche que son brief). Les chemins locaux qui restaient dans `fondations-rotation-gravitation.md` et `fondations-relativite-restreinte.md` ont été retirés le 2026-10-04 (l'historique git les contient encore). |
| `prompts/FEUILLE-DE-ROUTE.md`, `prompts/SESSION-FONDATION.md` et les briefs `fondations-*.md` des 23 pages qui restent (écrits le 2026-10-06) | **actuels**, prévisionnels | Plan des pages qui restent et briefs à exécuter. Ils deviennent historiques, comme les autres briefs, une fois la page construite. |
| `prompts/PROMPT-SESSION.md`, `PROMPTS-OPUS-ORCHESTRE.md` | **historiques** | Prompts du banc d'essai (« série de quatre », dossier `opus-orchestre/` jamais créé). |
| `prompts/astra-neurone.md` | **historique, figé** | Texte donné à Astra, garde l'ancien nom. |
| `opus-sonnet/index.html` | redirection | Ancien accueil sombre de la série (titré LABO le 2026-10-04), remplacé le même jour par `labo/index.html`. |
| `opus-sonnet/prealables.html` | actuel, incomplet | Pas de section pour la planche 09 ni pour les fondations. |
| `index.html` (racine) | actuel | Redirection vers `labo/`. |

## Banc d'essai d'origine

Le dépôt a d'abord servi à comparer des modèles d'IA sur un même brief. La grille de comparaison de l'ancien README n'a jamais été remplie :

| Critère | Opus + Sonnet | Astra |
|---|---|---|
| Exactitude scientifique | | |
| Direction artistique | | |
| Qualité du motion | | |
| Interactivité utile | | |
| Explication (j'ai appris quelque chose) | | |
| Bugs / erreurs console | | |

Mode de construction des pages (repris de l'ancien README) : Opus 5.5 écrit la direction, les briefs et souvent l'explication ; des sous-agents Sonnet 5.5 construisent ; une relecture QA (Sonnet ou Opus) vérifie. Les planches 01-04 ont été construites par quatre sous-agents en parallèle ; *Matière, chaleur et transport* a été construite par Opus autour d'un seul moteur de dynamique moléculaire ; *Rotation, gravitation et orbites* repose sur un moteur physique écrit et testé par Opus hors de la page.
