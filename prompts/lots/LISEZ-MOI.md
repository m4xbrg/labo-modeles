# Lots LABO pour un exécutant externe

14 lots, un par page de fondations restante (`node prompts/lots/lots.mjs liste`). Les briefs scientifiques sont les `prompts/fondations-*.md` existants : les lots n'ajoutent que le contrat d'exécutant externe (`_contrat-labo.md`).

1. Créer une fois un **Projet ChatGPT** avec les pièces jointes listées à la fin de `_contrat-labo.md`.
2. `node prompts/lots/lots.mjs prompt lot-information-genetique` copie le prompt ; le coller dans une nouvelle conversation du Projet.
3. Récupérer le `.zip` livré, puis : `node prompts/lots/lots.mjs recevoir lot-information-genetique <zip>` (contrôle) puis `--appliquer` (copie + tests du moteur).
4. Donner le rapport à Claude : contrôle scientifique, captures, fiche corpus. Rien de plus à relire avant ce rapport.

L'ordre des vagues est celui de `prompts/FEUILLE-DE-ROUTE.md` (les préalables d'une page doivent exister avant elle, sauf `chaos`, `signaux-fourier` et `populations-emergence`, indépendants). Plusieurs conversations peuvent tourner en parallèle si leurs dossiers sont différents.

Cas particulier : `lot-atomes-spectres-ch27` modifie une page existante ; la réception se fait avec `--ecraser`, et les quatre fichiers à joindre sont affichés par la commande `prompt`.
