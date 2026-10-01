# Labo modèles

Banc d'essai perso pour comparer des modèles d'IA sur un même brief. Hors du Second Brain, pas versionné.

## Essai 1 : « L'invisible en mouvement » (2026-09-29)

Huit planches scientifiques interactives : mitose, respiration cellulaire, neurone, champ électrique, ondes et interférences, courant et circuits, matière-chaleur-transport, supernova. La série s'appelait d'abord « Mécaniques invisibles » ; `prompts/astra-neurone.md` garde l'ancien nom, tel qu'il a été donné à Astra.

- `prompts/` : la charte commune (`00-direction-artistique.md`), un brief par projet, `PROMPT-SESSION.md` (prompt à coller dans une autre session) et `astra-neurone.md` (tout-en-un pour Astra).
- `opus-sonnet/` : Opus 5.5 écrit la direction, des sous-agents Sonnet 5.5 construisent (quatre en parallèle pour 01 à 04 ; un constructeur et un relecteur QA pour 05, ajoutée le 2026-10-01). Ouvrir `opus-sonnet/index.html`.
- Fondations électricité (modules 21-22, 2026-10-01) : la planche 04 est prolongée (tension entre deux points A–B, force F = qE sur 1 nC, forces de Coulomb entre charges, lectures commentées des vues, tableau charge / champ / force / potentiel / tension / énergie dans l'explication) et une planche 06 « Courant et circuits » est ajoutée (Ohm et puissance, charge et décharge RC, aperçu RL et LC amorti ; brief `prompts/06-courant-circuits.md`, construite par Sonnet). Les préalables gagnent une section 06 et un paragraphe sur la tension.
- `opus-sonnet/fondations-forces-energie/` : batch Fondations (modules 10 et 11, forces, énergie, quantité de mouvement), ajouté le 2026-10-01. Brief : `prompts/fondations-forces-energie.md`. Opus écrit le brief et l'explication, un sous-agent Sonnet construit la page, Opus fait la QA.
- `opus-sonnet/07-matiere-chaleur/` : matière, chaleur et transport (modules canoniques 17, 18 et 19), neuf actes. Opus 5.5 a écrit le brief (`prompts/07-matiere-chaleur-transport.md`) et construit la page autour d'un seul moteur de dynamique moléculaire 2D réutilisé dans huit actes ; des sous-agents Sonnet 5.5 ont rédigé l'explication et fait la QA.
- `opus-sonnet/08-replication-adn/` : réplication de l'ADN (2026-10-01), une fourche suivie en cinq actes. Opus 5.5 a écrit le brief (`prompts/08-replication-adn.md`) ; des sous-agents Sonnet 5.5 ont construit la page, rédigé l'explication et fait le QA.
- `opus-sonnet/09-supernova/` : supernova par effondrement du cœur (2026-10-01), planche narrative en huit actes. Opus 5.5 a écrit le brief (`prompts/09-supernova.md`) ; des sous-agents Sonnet 5.5 ont construit la page, rédigé l'explication et fait la QA.
- `opus-sonnet/fondations-flux-fluides/` : batch Fondations (module 16, flux, gradients et champs continus ; module 20, fluides, pression et débit), ajouté le 2026-10-01. Quatre laboratoires dans une page (champs scalaires et gradient, champs vectoriels avec divergence et rotationnel, flux, conduit) et une explication commune. Brief : `prompts/fondations-flux-fluides.md`. Opus écrit le brief, la coquille et l'explication ; deux sous-agents Sonnet construisent (A+B, C+D) ; un relecteur Sonnet vérifie maths et physique ; Opus intègre et fait la QA.
- `astra/03-neurone/` : GPT-6 Astra, même brief, en solo, projet 03 seulement.

## Grille de comparaison

Pour chaque essai, noter de 1 à 5 :

| Critère | Opus + Sonnet | Astra |
|---|---|---|
| Exactitude scientifique | | |
| Direction artistique | | |
| Qualité du motion | | |
| Interactivité utile | | |
| Explication (j'ai appris quelque chose) | | |
| Bugs / erreurs console | | |

## Ce que j'en retiens

(à remplir après l'essai)
