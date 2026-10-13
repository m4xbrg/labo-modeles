# Lots LABO pour un exécutant externe

14 lots ont été préparés le 2026-10-10 (`node prompts/lots/lots.mjs liste`), un par page de fondations qui restait alors. Les briefs scientifiques sont les `prompts/fondations-*.md` existants : les lots n'ajoutent que le contrat d'exécutant externe (`_contrat-labo.md`).

## Où en sont les lots (2026-10-13)

La vague 1 (PR n° 37) a construit en interne huit des pages visées, le même jour que la préparation des lots. **Ces huit lots sont obsolètes : ne pas les relancer**, car `recevoir --appliquer` copierait une livraison par-dessus une page déjà construite.

| Lot | Page | État |
|---|---|---|
| `lot-genome-variation` | 36 · Génome et variation | **À faire**, préalables prêts (35, 07 partiel) |
| `lot-rayonnement-etoiles` | 43 · 44 · Rayonnement et étoiles | **À faire**, préalables prêts (13, 17, 26, 27) |
| `lot-etats-quantiques` | 49 · États quantiques | **À faire**, préalables prêts (48, 27) |
| `lot-spin-intrication` | 50 · Spin et intrication | **À faire**, préalables prêts (48, 25) |
| `lot-immunite-coagulation` | 39 · Immunité et coagulation | **À faire après 36** (préalables 36, 37) |
| `lot-cosmologie` | 45 · Cosmologie | **À faire après 43·44** (préalables 13, 24, 27, 43) |
| `lot-atomes-spectres-ch27` | 27 · chapitre 27 des atomes | Obsolète, construit par la vague 1 |
| `lot-chaos` | 08 | Obsolète, construit par la vague 1 |
| `lot-signaux-fourier` | 09 | Obsolète, construit par la vague 1 |
| `lot-information-genetique` | 35 | Obsolète, construit par la vague 1 |
| `lot-physiologie-circulation` | 38 | Obsolète, construit par la vague 1 |
| `lot-populations-emergence` | 41 · 42 | Obsolète, construit par la vague 1 |
| `lot-relativite-generale` | 47 | Obsolète, construit par la vague 1 |
| `lot-quantique` | 48 | Obsolète, construit par la vague 1 |

Les fichiers des lots obsolètes sont gardés tels quels (ils servent d'exemples du format) ; les supprimer est possible, mais `lots.mjs liste` les montrera tant qu'ils sont là.

## Utiliser un lot

1. Créer une fois un **Projet ChatGPT** avec les pièces jointes listées à la fin de `_contrat-labo.md`.
2. `node prompts/lots/lots.mjs prompt lot-genome-variation` copie le prompt ; le coller dans une nouvelle conversation du Projet.
3. Récupérer le `.zip` livré, puis : `node prompts/lots/lots.mjs recevoir lot-genome-variation <zip>` (contrôle) puis `--appliquer` (copie + tests du moteur).
4. Donner le rapport à Claude : contrôle scientifique, captures, fiche corpus. Rien de plus à relire avant ce rapport.

L'ordre est celui de [`prompts/FEUILLE-DE-ROUTE.md`](../FEUILLE-DE-ROUTE.md) : les préalables d'une page doivent exister avant elle. Plusieurs conversations peuvent tourner en parallèle si leurs dossiers sont différents.

Cas particulier : un lot qui modifie une page existante (comme l'ancien `lot-atomes-spectres-ch27`) se reçoit avec `--ecraser`, et les fichiers à joindre sont affichés par la commande `prompt`.

Une page livrée par un lot est **construite sans avoir été vue dans un navigateur** : la livraison dit elle-même ce qu'un humain doit regarder (`LIVRAISON.md`, section 5). Elle compte comme construite au sens du corpus seulement une fois fusionnée sur `main`, mais sa validation visuelle reste à faire (voir [`corpus/README.md`](../../corpus/README.md), règles de maintenance).
