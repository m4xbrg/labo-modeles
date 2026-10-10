# Collections

Une collection est un regroupement **éditorial** de modèles : une série qui se lit ensemble, avec un ton propre. Elle ne dit rien de la carte des fondations. Un modèle peut appartenir à zéro, une ou plusieurs collections, et aussi à une production de fondations. Version structurée : [`collections.json`](collections.json).

## Ajouter ou créer une collection

- **Ajouter un modèle à une collection** : ajouter son identifiant à `members` dans `collections.json`, à la position voulue (l'ordre de la liste est l'ordre d'affichage), et ajouter l'identifiant de la collection au champ `collections` du modèle dans `models.json`. Mettre à jour le tableau ci-dessous.
- **Créer une collection** : ajouter un objet `{id, title, description, status, members}` dans `collections.json` et une section ici. On en crée une quand plusieurs modèles se lisent naturellement ensemble (par exemple des objets compacts : supernova, étoile à neutrons, kilonova), pas à l'avance.

Les collections n'ont pas de numérotation propre. Les numéros 01-09 des dossiers sont des numéros historiques (`legacy_number`).

## L'invisible en mouvement

> Ce qui se passe à des échelles qu'on ne voit jamais.

C'est la première série de LABO, et longtemps le nom de tout le projet. Elle est née le 2026-09-29 sous le nom « Mécaniques invisibles » (mitose, respiration cellulaire, neurone, champ électrique), a été renommée le 2026-10-01 et a compté jusqu'à neuf planches.

Le 2026-10-04, elle est resserrée à ses **showcases** : des phénomènes suivis de bout en bout. Le projet s'appelle désormais **LABO** ; la collection n'en est qu'une partie.

| Ordre | Modèle | N° historique |
|---|---|---|
| 1 | [La mitose](../opus-sonnet/01-mitose/index.html) | 01 |
| 2 | [La respiration cellulaire](../opus-sonnet/02-respiration/index.html) | 02 |
| 3 | [Le neurone qui apprend](../opus-sonnet/03-neurone/index.html) | 03 |
| 4 | [La réplication de l'ADN](../opus-sonnet/08-replication-adn/index.html) | 08 |
| 5 | [Supernova par effondrement du cœur](../opus-sonnet/09-supernova/index.html) | 09 |

**Sortis de la collection** (ils restent des modèles, à leur place et à leur URL) :

| Modèle | N° historique | Pourquoi |
|---|---|---|
| [Le champ électrique](../opus-sonnet/04-champ-electrique/index.html) | 04 | bac à sable de la fondation 21 |
| [Ondes et interférences](../opus-sonnet/05-ondes-interferences/index.html) | 05 | showcase hors collection |
| [Courant et circuits](../opus-sonnet/06-courant-circuits/index.html) | 06 | page de fondations (22) |
| [Matière, chaleur et transport](../opus-sonnet/07-matiere-chaleur/index.html) | 07 | page de fondations (17·18·19) |


## Fondations n'est pas une collection

La section « Fondations » de l'accueil est la couche des fondations, décrite par la carte canonique ([`fondations.md`](fondations.md)).
