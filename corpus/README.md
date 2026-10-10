# Corpus de LABO : la source de vérité

Ce dossier décrit **ce qu'est le corpus de LABO** : la carte conceptuelle des fondations, les productions, les modèles réellement construits, les collections et l'Atlas des phénomènes qu'on pourrait un jour construire. C'est la référence actuelle. En cas de désaccord entre ce dossier et un autre document du dépôt (brief dans `prompts/`, ancien README, accueil du site, prototype d'interface), **ce dossier l'emporte**, sauf pour l'état du code lui-même : si une page existe ou n'existe pas, c'est le dépôt qui a raison, et ce dossier doit être corrigé.

État préparé après fusion des productions 33 et 31, le 2026-10-10, à partir de `main` au commit `e6064d5`. Module 40 (*Évolution et génétique des populations*) ajouté le 2026-10-04 (PR n° 16). Module 23 (*Magnétisme et induction*) ajouté le 2026-10-06. Modules 28 et 29 (*Molécules et mole*) ajoutés le 2026-10-06 (20 modèles). Module 24 (*L'onde électromagnétique*) ajouté le 2026-10-07 (21 modèles). Page *Atomes, noyaux et lumière* ajoutée le 2026-10-07 en `partial` (module 26 couvert, module 27 en théorie seulement ; 22 modèles). Module 37 (*Signalisation et homéostasie*) ajouté le 2026-10-07 (23 modèles : 22 `built`, un `partial`). Page *D’un gradient à une tension* ajoutée le 2026-10-07 (`built`, couverture 33 `partial` en complément du neurone ; 24 modèles dont un partiel).

## Les fichiers

| Fichier | Pour qui | Contenu |
|---|---|---|
| [`fondations.md`](fondations.md) | humain | Les 50 modules canoniques, les productions de fondations, ce qui est construit, partiel ou prévu, les chaînes de préalables. |
| [`modeles.md`](modeles.md) | humain | L'inventaire de ce qui s'ouvre réellement dans le dépôt : chemin, type, production, modules, collection, explication. |
| [`atlas.md`](atlas.md) | humain | Le grand réservoir de phénomènes : la liste historique, les ajouts proposés, leurs statuts. |
| [`collections.md`](collections.md) | humain | Les regroupements éditoriaux, dont « L'invisible en mouvement ». |
| [`historique.md`](historique.md) | humain | Généalogie du projet, anciennes numérotations, anciens noms, statut des documents historiques. |
| [`standards.md`](standards.md) | humain | Ce que toutes les pages partagent : en-tête LABO, plan de théorie des fondations (une section par module, LaTeX), taille des pages (un chapitre par module). |
| `modules.json`, `productions.json`, `models.json`, `atlas.json`, `collections.json` | machine | Les mêmes données, structurées, pour alimenter plus tard l'accueil de LABO. |

Les fichiers `.json` et les fichiers `.md` décrivent les mêmes choses. Quand on change un statut, on change les deux.

## Les niveaux à ne pas confondre

> module ≠ production ≠ modèle ≠ collection ≠ idée d'Atlas

| Niveau | Ce que c'est | Exemple |
|---|---|---|
| **LABO** | Le laboratoire-musée entier. | — |
| **Module canonique** | Une unité de la carte conceptuelle des fondations, numérotée de 01 à 50. Un module n'est **pas** une page. Les concepts qu'il contient ne sont pas des modules. | `03 · Changement et accumulation` (dérivée, intégrale, position, vitesse, accélération) |
| **Production** | Une unité de conception et de fabrication, qui couvre un ou plusieurs modules et peut contenir plusieurs toys. | `Fondations · Langage scientifique fondamental` couvre `01 + 02 + 03` |
| **Modèle** | Un objet concret qu'on ouvre dans LABO : une page `index.html`, souvent accompagnée d'un `explication.html`. Une page peut contenir plusieurs toys ou actes. | `opus-sonnet/fondations-langage/` et ses quatre toys, dont « Le réservoir » |
| **Showcase** | Un modèle construit autour d'un seul phénomène riche, qui mobilise plusieurs fondations. | Mitose, réplication de l'ADN, supernova |
| **Collection** | Un regroupement éditorial transversal de modèles. | « L'invisible en mouvement » |
| **Idée d'Atlas** | Un phénomène que LABO pourrait construire. Une idée n'est pas une page. | « Collision de deux étoiles à neutrons » (idée) |

### Fondations et showcases

Le projet n'a pas commencé par une carte de fondations : il a commencé par des phénomènes (la mitose d'abord, avec la respiration cellulaire, le neurone et le champ électrique). En montant vers des sujets plus ambitieux, un problème est apparu : une supernova suppose la gravitation, l'énergie, la pression, les noyaux, le rayonnement. Les réexpliquer dans chaque planche serait absurde.

Les **fondations** construisent donc une grammaire scientifique réutilisable : une intuition juste, le vocabulaire, les relations importantes et les équations utiles, sans devenir un cours exhaustif. Les **showcases** s'appuient sur cette grammaire pour se concentrer sur leur phénomène propre : une supernova future n'aura qu'à suivre l'effondrement, le rebond, le choc et les neutrinos.

Les fondations ne remplacent pas les showcases ; elles les rendent possibles. Et LABO n'est pas un curriculum : les chaînes de préalables sont des chemins conseillés, pas des verrous, et la forme suit le phénomène (interactive, narrative, contemplative, comparative ou toy).

## Statuts

Deux axes distincts. Le premier dit si l'objet existe ; le second dit ce qu'il enseigne vraiment.

**Statut d'un modèle, d'une production ou d'une idée d'Atlas**

| Statut | Sens |
|---|---|
| `idea` | Seulement une idée. |
| `selected` | Choisie comme futur projet probable (un brief existe ou la production est la suivante prévue). |
| `planned` | Pour une production de fondations : inscrite dans la feuille de route, rien de construit. |
| `absorbed` | Idée d'Atlas désormais couverte, pour l'essentiel, à l'intérieur d'une fondation **construite**. Elle reste dans l'Atlas et pourra un jour avoir son propre toy. |
| `partial` | Une partie existe, mais l'objet n'est pas complet. |
| `built` | Une vraie expérience existe et s'ouvre. |

Une idée dont le module de destination n'est pas encore construit reste `idea` : on indique seulement son module de destination.

**Couverture conceptuelle d'un module par un modèle**

| Couverture | Sens |
|---|---|
| `full` | L'essentiel des concepts du module est enseigné, avec manipulation ou théorie suffisante. |
| `partial` | Une partie des concepts est enseignée ; les absents sont nommés. |
| `supporting` | Le concept est utilisé en passant (un gradient dans une boîte de molécules) sans être enseigné pour lui-même. |

Un modèle peut être `built` et ne couvrir un module qu'en `partial`. On ne gonfle pas la couverture.

## Types de modèles

`showcase` (un phénomène suivi de bout en bout), `foundation` (une page de fondations, souvent plusieurs toys), `sandbox` (bac à sable autour d'un champ ou d'un système manipulable). Les sous-parties d'une page sont des `toy` (fondations) ou des `act` (récit en actes).

## Règles de maintenance

1. Une page n'est `built` que si elle existe dans `opus-sonnet/` sur `main`. Un brief, un prompt ou une maquette ne suffit pas.
2. On ne crée jamais de module à partir d'un concept interne : « Dérivées » vit dans le module 03.
3. Les numéros 01-50 sont ceux de la carte canonique. Les numéros 01-09 des dossiers `opus-sonnet/0N-…` sont des numéros historiques (`legacy_number`), gardés pour ne pas casser les URL ; ce ne sont ni des modules ni des rangs de collection. Voir [`historique.md`](historique.md).
4. Les identifiants stables des modèles sont des slugs sans numéro (`mitose`, `replication-adn`).
5. Une idée d'Atlas qui devient une page garde son entrée : on change son statut et on la relie au modèle. Module 30 (*Réactions : vitesse et équilibre*) ajouté le 2026-10-06.
