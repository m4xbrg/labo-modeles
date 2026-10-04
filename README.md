# Labo modèles

Banc d'essai perso pour comparer des modèles d'IA sur un même brief. Hors du Second Brain, pas versionné.

## Essai 1 : « L'invisible en mouvement » (2026-09-29)

Huit planches scientifiques interactives : mitose, respiration cellulaire, neurone, champ électrique, ondes et interférences, courant et circuits, matière-chaleur-transport, supernova. La série s'appelait d'abord « Mécaniques invisibles » ; `prompts/astra-neurone.md` garde l'ancien nom, tel qu'il a été donné à Astra.

- `prompts/` : la charte commune (`00-direction-artistique.md`), un brief par projet, `PROMPT-SESSION.md` (prompt à coller dans une autre session) et `astra-neurone.md` (tout-en-un pour Astra).
- `opus-sonnet/` : Opus 5.5 écrit la direction, des sous-agents Sonnet 5.5 construisent (quatre en parallèle pour 01 à 04 ; un constructeur et un relecteur QA pour 05, ajoutée le 2026-10-01). Ouvrir `opus-sonnet/index.html`.
- Fondations électricité (modules 21-22, 2026-10-01) : la planche 04 est prolongée (tension entre deux points A–B, force F = qE sur 1 nC, forces de Coulomb entre charges, lectures commentées des vues, tableau charge / champ / force / potentiel / tension / énergie dans l'explication) et une planche 06 « Courant et circuits » est ajoutée (Ohm et puissance, charge et décharge RC, aperçu RL et LC amorti ; brief `prompts/06-courant-circuits.md`, construite par Sonnet). Les préalables gagnent une section 06 et un paragraphe sur la tension.
- `opus-sonnet/fondations-forces-energie/` : batch Fondations (modules 10 et 11, forces, énergie, quantité de mouvement), ajouté le 2026-10-01. Brief : `prompts/fondations-forces-energie.md`. Opus écrit le brief et l'explication, un sous-agent Sonnet construit la page, Opus fait la QA.
- `opus-sonnet/fondations-rotation-gravitation/` : batch Fondations (module 12, rotation ; module 13, gravitation et orbites), ajouté le 2026-10-01, ≈ 1 ADN. Sept actes en deux paillasses : cinématique de rotation, couple et inertie, conservation du moment cinétique (patineur, anneau), introduction au gyroscope ; canon de Newton (l'orbite comme chute), ellipse et énergie orbitale avec puits de potentiel et Kepler, barycentre. Brief : `prompts/fondations-rotation-gravitation.md`. Opus écrit le brief, le moteur physique (testé hors page) et l'explication ; un sous-agent Sonnet construit la page ; Opus fait la QA.
- `opus-sonnet/fondations-langage/` : batch Fondations (modules 1 à 3, langage scientifique), ajouté le 2026-10-01. Quatre petits laboratoires dans une page (échelles et unités, graphiques, vecteurs, position-vitesse-accélération) et une explication commune. Brief : `prompts/fondations-langage.md`. Opus écrit le brief, la coquille et l'explication, deux sous-agents Sonnet construisent les toys, un troisième fait la QA.
- `opus-sonnet/07-matiere-chaleur/` : matière, chaleur et transport (modules canoniques 17, 18 et 19), neuf actes. Opus 5.5 a écrit le brief (`prompts/07-matiere-chaleur-transport.md`) et construit la page autour d'un seul moteur de dynamique moléculaire 2D réutilisé dans huit actes ; des sous-agents Sonnet 5.5 ont rédigé l'explication et fait la QA.
- `opus-sonnet/08-replication-adn/` : réplication de l'ADN (2026-10-01), une fourche suivie en cinq actes. Opus 5.5 a écrit le brief (`prompts/08-replication-adn.md`) ; des sous-agents Sonnet 5.5 ont construit la page, rédigé l'explication et fait le QA.
- `opus-sonnet/09-supernova/` : supernova par effondrement du cœur (2026-10-01), planche narrative en huit actes. Opus 5.5 a écrit le brief (`prompts/09-supernova.md`) ; des sous-agents Sonnet 5.5 ont construit la page, rédigé l'explication et fait la QA.
- `opus-sonnet/fondations-flux-fluides/` : batch Fondations (module 16, flux, gradients et champs continus ; module 20, fluides, pression et débit), ajouté le 2026-10-01. Quatre laboratoires dans une page (champs scalaires et gradient, champs vectoriels avec divergence et rotationnel, flux, conduit) et une explication commune. Brief : `prompts/fondations-flux-fluides.md`. Opus écrit le brief, la coquille et l'explication ; deux sous-agents Sonnet construisent (A+B, C+D) ; un relecteur Sonnet vérifie maths et physique ; Opus intègre et fait la QA.
- `opus-sonnet/fondations-oscillations-ondes/` : batch Fondations, modules 6, 14 et 15 réunis en une planche (≈ 1 ADN) : cercle et phase, oscillateur et résonance, corde, interférences, modes, Doppler. Brief : `prompts/fondations-oscillations-ondes.md`. Opus direction et QA, un constructeur Sonnet (2026-10-01).
- `opus-sonnet/fondations-systemes-hasard/` : batch Fondations, modules 4, 5 et 7 réunis en une planche (≈ 1 ADN) : état et taux (Euler pas à pas, champ de pentes), rétroaction et stabilité (cuvette / dôme, logistique), exponentielles et logarithmes (doublement, demi-vie, échelle log, sonde inverse), hasard (dé, marche aléatoire, désintégration). Brief : `prompts/fondations-systemes-hasard.md`. Opus écrit le brief et l'explication (théorie de référence) et fait la QA ; un constructeur Sonnet construit la page (2026-10-01).
- `opus-sonnet/fondations-relativite-restreinte/` : batch Fondations, module 46 (ouvre la branche J · Relativité), ≈ 1 ADN, ajouté le 2026-10-02. Huit actes en trois paillasses : deux référentiels (Galilée, puis la lumière qui va à c pour tous), horloge lumineuse, train et éclairs (simultanéité relative, avec reconstruction corrigée des délais) ; diagramme d'espace-temps et cône de lumière, dilatation et contraction lues sur la même géométrie, temps propre (jumeaux) ; addition relativiste des vitesses, énergie E = γmc² et E² = (pc)² + (mc²)². Brief : `prompts/fondations-relativite-restreinte.md`. Opus écrit le brief, le moteur (testé hors page) et l'explication ; un sous-agent Sonnet construit la page ; Opus fait la QA. Le module 47 (relativité générale) est seulement annoncé.
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
