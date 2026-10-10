# Fondations : la carte canonique

Les fondations construisent la grammaire scientifique que les showcases supposent. Une fondation n'a pas besoin d'être spectaculaire : elle doit donner une intuition juste, le vocabulaire, les relations importantes, les équations utiles et une image mentale réutilisable. Assez de théorie pour reconnaître et réutiliser le concept ailleurs ; pas un cours exhaustif.

Version structurée : [`modules.json`](modules.json) et [`productions.json`](productions.json).

## Une carte, pas cinquante pages

Les 50 modules ci-dessous forment une **carte conceptuelle**. Elle ne dit pas qu'il y aura 50 pages.

- Un **module** est une unité de la carte. Ses concepts (dérivée, intégrale, vitesse…) ne sont pas des modules : ils vivent à l'intérieur. Il n'existe pas de module « Fonctions » ni de module « Dérivées et intégrales » ; ces notions appartiennent au module 03.
- Une **production** regroupe un ou plusieurs modules en une unité d'apprentissage visuelle cohérente : « un prompt par unité d'apprentissage, pas nécessairement un prompt par numéro ». Les modules 6, 14 et 15 font une seule page ; le module 44 (étoiles) en fera probablement plusieurs.
- Un **modèle** est la page qui en résulte ([`modeles.md`](modeles.md)).

La numérotation 01-50 est canonique et ne change pas. Les productions sont dimensionnées en « ADN » : 1 ADN est l'ordre de grandeur du travail d'une planche complète comme *La réplication de l'ADN* (recherche, conception, construction, explication, QA).

Origine : la carte vient du paquet de fondations préparé avant la première production (hors dépôt). Elle regroupe une liste antérieure de 104 fondations numérotées #1-#104, toutes rattachées à un module principal, et ajoute trois modules absents de cette liste (20 Fluides, 25 Optique, 39 Immunité et coagulation). La liste des 104 elle-même n'est pas dans le dépôt.

## État préparé au 2026-10-10

| | Modules |
|---|---|
| Couverture **full** par au moins un modèle | 01-06, 10-26, 28-29, 31-34, 37, 40, 46 (32 modules) |
| Couverture **partial** | 07-08, 27, 36, 44 |
| Seulement **supporting** | 09, 30, 35 |
| Rien | 38-39, 41-43, 45, 47-50 |

Les huit productions de fondations définies au départ sont toutes construites. Une neuvième, *Relativité restreinte* (module 46), ouvre la branche J · Relativité le 2026-10-02. Une dixième, *Évolution et génétique des populations* (module 40), ouvre la branche H · Évolution, populations et systèmes complexes le 2026-10-04 (PR n° 16). Une onzième, *Cellule, membrane et transport* (module 32), ouvre la branche F · Cellule et biologie moléculaire le même jour (PR n° 17). Une douzième, *Magnétisme et induction* (module 23), reprend la feuille de route de la branche D le 2026-10-06 ; c'est la première construite au standard d'une page à un module (quatre étapes, `standards.md`), à partir d'un moteur verrouillé versionné dans `prompts/moteurs/`. Une treizième, *Liaisons, molécules, mole et stœchiométrie* (modules 28 et 29), ouvre la branche E · Atomes, chimie et noyaux le même jour, en deux chapitres (4 + 3 étapes), avant les modules 26-27 qui la précèdent dans la carte. Une quatorzième, *L'onde électromagnétique* (module 24), poursuit la branche D au même standard (un chapitre de quatre étapes) ; son moteur, écrit et testé avant la page, est versionné dans `prompts/moteurs/`. Une quinzième, *Atomes, noyaux, photons et spectres* (modules 26 et 27), rejoint la branche E le 2026-10-07 ; seule la première moitié est livrée (chapitre 26 et explication des deux modules), le chapitre 27 suivra. Une seizième, *Signalisation et homéostasie* (module 37), ajoute le 2026-10-07 un chapitre de quatre étapes et prépare la physiologie (38 et 39). Une dix-septième, *Bioélectricité et synapses* (module 33), ajoute le 2026-10-07 la planche *D’un gradient à une tension* : quatre étapes sur Nernst, GHK, le câble et la sommation. Sa couverture est `partial` ; le showcase *Le neurone qui apprend* maintient la couverture globale `full` du module. Une dix-huitième, *Acide-base, redox et électrochimie* (module 31), ajoute la planche *Protons et électrons qui passent* : un chapitre de quatre étapes, avec un moteur versionné dans `prompts/moteurs/acide-base-redox.js`. La production *Énergie biologique* (module 34) ajoute *L’énergie du vivant* : quatre étapes sur le couplage, les enzymes, le bilan de la respiration et la photosynthèse, sans reconstruire le mécanisme du showcase 02. Les couvertures partielles des modules 36 et 44 viennent de showcases (mitose et réplication, supernova), pas de fondations.

*Optique fondamentale* (module 25) est construite le 2026-10-06, avant le module 24 : la planche utilise la vibration transverse de E pour la polarisation sans enseigner l’onde électromagnétique.

Limites connues des fondations construites (détail dans [`modeles.md`](modeles.md)) :

- **34** : ΔG°′ standard (ΔG réel pour l'ATP seulement) ; enzymes immobiles en 2D dans un bain à concentration constante ; bilans selon une convention (30 ATP par glucose) ; chloroplaste schématique et spectre de la chlorophylle approché. Cycle de Krebs, photosystèmes, cycle de Calvin et régulation allostérique seulement introduits ; les modules 33, 35 et 41 sont annoncés en fin de planche.

- **01** : l'analyse dimensionnelle n'est que dans l'explication, aucun toy ne la manipule.
- **03** : mouvement en 1D, accélération constante par morceaux ; les mots « dérivée » et « intégrale » sont dans l'explication et l'accueil, pas dans les toys.
- **07** `partial` : dé, marche aléatoire, cloche, désintégration ; ni probabilités conditionnelles, ni loi binomiale ou théorème central limite nommés.
- **08** `partial` : stabilité d'un équilibre en 1D et logistique ; ni chaos, ni attracteur, ni sensibilité aux conditions initiales. Aucune production ne vise ce module.
- **09** `supporting` : Fourier est seulement nommé. Aucune production ne vise ce module.
- **10** en 1D ; **12** autour d'un axe fixe ; **15** en 1D dans les fondations (la planche 05 traite les interférences en 2D).
- **46** : une seule dimension d’espace ; accélération propre, quadrivecteurs, aberration et Doppler relativistes hors champ. Le module 47 est annoncé en fin de planche, pas couvert.
- **40** : générations non chevauchantes, un seul gène, reproduction à un parent pour le trait continu, mutations neutres ; ni recombinaison, ni coalescence, ni spéciation. Les modules 41 et 42 sont annoncés en fin de planche (grille mélangée ou par voisinage), pas couverts.
- **23** : sources à symétrie axiale et fils infinis seulement, sans matériaux magnétiques (ni fer, ni hystérésis) ; particules non relativistes ; inductance propre de la bobine réceptrice et des anneaux du tube négligée. Auto-induction, transformateur et moteur seulement introduits ; le module 24 est annoncé en fin de planche.
- **25** : optique géométrique (ni diffraction ni interférences de couches minces) ; lentille mince idéale par défaut, lentille épaisse seulement pour montrer l'aberration sphérique ; loi de Cauchy approchée ; polariseurs idéaux ; fibre figurée par une tige de verre dans l'air. Principe de Fermat, diffusion, biréfringence et instruments à plusieurs lentilles seulement introduits ; les modules 15, 47, 48 et 50 sont annoncés en fin de planche.
- **28** : VSEPR simulé par des domaines qui se repoussent sur une sphère, limité à quatre domaines (octet étendu hors champ) ; forces entre molécules en 2D, qualitatives, températures réduites ; orbitales, hybridation, liaison métallique, résonance et solubilité seulement introduites. **29** : réactions totales, sans vitesse ni équilibre ; volume du soluté négligé. Les modules 30 et 31 sont annoncés en fin de planche.
- **24** : champ de rayonnement non relativiste et vitesse de la lumière ralentie à l'étape 1 ; onde plane idéale, polarisée verticalement ; frontières des domaines du spectre conventionnelles ; distances schématiques à l'étape 4. Le photon est seulement nommé (énergie hf affichée, d'où le `supporting` du module 27) ; équations de Maxwell complètes, courant de déplacement et polarisation seulement introduits. Les modules 25, 27 et 43 sont annoncés en fin de planche.
- **26** : nucléons en billes, sans modèle en couches ; table des nucléides limitée à Z ≤ 26 (plus quelques repères) ; fils supposés stables, pas de chaînes. Force forte et interaction faible seulement introduites.
- **27** `partial` : la théorie est dans l'explication d'*Atomes, noyaux et lumière*, les trois étapes de la planche (niveaux, raies, effet photoélectrique) sont à venir.
- **37** : liaison réversible en bain bien mélangé, gains constants illustratifs, glycémie à deux variables et apport net calibré sans valeur médicale, thermostat linéaire à retard, commutateur abstrait. Seconds messagers détaillés, récepteurs nucléaires, système nerveux autonome et rythmes circadiens seulement introduits.
- **33** `partial` dans la nouvelle fondation : canaux réduits, sans étude des portes Hodgkin-Huxley, sans chimie synaptique détaillée ni plasticité. Le showcase conserve sa couverture `full`.
- **31** : 25 °C, activités assimilées aux concentrations, acides traités comme monoacides (phosphate et carbonique réduits à un couple) ; cinétique du dépôt illustrative, résistance interne de la pile constante, surtensions ignorées. Solubilité, indicateurs colorés, corrosion, piles à combustible et lithium-ion seulement introduits.
- **16** est enseigné par *Flux, gradients, champs et fluides*. Le gradient et le flux qui apparaissent dans *Matière, chaleur et transport* restent `supporting`.

## Les 50 modules

### A · Langage scientifique et mathématique

| # | Module | Concepts | Production | Couverture actuelle | Par |
|---|---|---|---|---|---|
| 01 | Mesure, échelles et représentation scientifique | grandeurs, unités, ordres de grandeur, notation scientifique, dimensions, graphiques, pente, aire, proportionnalité, analyse dimensionnelle, incertitude, chiffres significatifs | Langage scientifique fondamental (`built`) | **full** | Langage scientifique (full), Systèmes, croissance et hasard (supporting), Flux, gradients, champs et fluides (supporting) |
| 02 | Vecteurs et géométrie des quantités | magnitude, direction, composantes, addition, projection | Langage scientifique fondamental (`built`) | **full** | Le champ électrique (supporting), Langage scientifique (full), Forces, énergie et conservation (supporting), Rotation, gravitation et orbites (supporting), Flux, gradients, champs et fluides (supporting), Optique : la lumière qui tourne (supporting) |
| 03 | Changement et accumulation | dérivée, intégrale, position, vitesse, accélération | Langage scientifique fondamental (`built`) | **full** | Langage scientifique (full), Systèmes, croissance et hasard (supporting), Forces, énergie et conservation (supporting), Rotation, gravitation et orbites (supporting), Flux, gradients, champs et fluides (supporting) |
| 04 | Systèmes qui évoluent dans le temps | EDO intuitives, état, taux de changement, conditions initiales, feedback positif/négatif | Systèmes, croissance et hasard (`built`) | **full** | Le neurone qui apprend (supporting), Systèmes, croissance et hasard (full), Oscillations et ondes (supporting) |
| 05 | Exponentielles et logarithmes | croissance, décroissance, demi-vie, temps caractéristique, échelles logarithmiques | Systèmes, croissance et hasard (`built`) | **full** | Courant et circuits (supporting), Langage scientifique (supporting), Systèmes, croissance et hasard (full), Atomes, noyaux et lumière (supporting) |
| 06 | Sinusoïdes, cycles et phase | amplitude, fréquence, période, phase, déphasage | Oscillations et ondes (`built`) | **full** | Ondes et interférences (supporting), Oscillations et ondes (full) |
| 07 | Hasard, probabilité et distributions | probabilité, moyenne, variance, distributions, échantillonnage | Systèmes, croissance et hasard (`built`) | partial | Systèmes, croissance et hasard (partial), Atomes, noyaux et lumière (supporting) |
| 08 | Non-linéarité, stabilité et chaos | non-linéarité, points fixes, stabilité, attracteurs, sensibilité aux conditions initiales | — | partial | Systèmes, croissance et hasard (partial) |
| 09 | Signaux et Fourier | décomposition en fréquences, spectre, fréquence dominante, reconstruction | — | supporting | Oscillations et ondes (supporting) |

### B · Mécanique

| # | Module | Concepts | Production | Couverture actuelle | Par |
|---|---|---|---|---|---|
| 10 | Forces, inertie et lois de Newton | force résultante, inertie, masse, accélération, action-réaction | Forces, énergie et conservation (`built`) | **full** | Langage scientifique (supporting), Forces, énergie et conservation (full) |
| 11 | Énergie et quantité de mouvement | travail, énergie cinétique, énergie potentielle, puissance, impulsion, quantité de mouvement, collisions, conservation | Forces, énergie et conservation (`built`) | **full** | Le champ électrique (supporting), Supernova par effondrement du cœur (supporting), Oscillations et ondes (supporting), Forces, énergie et conservation (full), Rotation, gravitation et orbites (supporting), Magnétisme et induction (supporting), Molécules et mole (supporting), Atomes, noyaux et lumière (supporting) |
| 12 | Rotation | couple, vitesse angulaire, moment d’inertie, moment cinétique, précession (extension) | Rotation, gravitation et orbites (`built`) | **full** | Rotation, gravitation et orbites (full) |
| 13 | Gravitation et orbites | gravitation newtonienne, potentiel, énergie orbitale, orbites elliptiques, vitesse de libération | Rotation, gravitation et orbites (`built`) | **full** | Supernova par effondrement du cœur (supporting), Rotation, gravitation et orbites (full) |
| 14 | Oscillateurs et résonance | masse-ressort, oscillateur harmonique, amortissement, forçage, résonance | Oscillations et ondes (`built`) | **full** | Courant et circuits (supporting), Oscillations et ondes (full), Molécules et mole (supporting) |
| 15 | Ondes | propagation, amplitude, fréquence, longueur d’onde, superposition, interférence, ondes stationnaires, modes, Doppler | Oscillations et ondes (`built`) | **full** | Ondes et interférences (partial), Oscillations et ondes (full), L’onde électromagnétique (supporting), Optique : la lumière qui tourne (supporting) |
| 16 | Flux, gradients et champs continus | flux, gradient, champ scalaire, champ vectoriel, divergence, rotationnel | Flux, gradients, champs et fluides (`built`) | **full** | La respiration cellulaire (supporting), Le champ électrique (supporting), Matière, chaleur et transport (supporting), Rotation, gravitation et orbites (supporting), Flux, gradients, champs et fluides (full) |

### C · Matière, thermique et transport

| # | Module | Concepts | Production | Couverture actuelle | Par |
|---|---|---|---|---|---|
| 17 | Monde microscopique des gaz | température, collisions, pression, P/V/T, gaz idéal | Matière microscopique, thermique et transport (`built`) | **full** | Matière, chaleur et transport (full), Molécules et mole (supporting) |
| 18 | Chaleur, phases et entropie | chaleur, capacité thermique, changement de phase, chaleur latente, entropie | Matière microscopique, thermique et transport (`built`) | **full** | Matière, chaleur et transport (full) |
| 19 | Transport thermique et moléculaire | conduction, convection, rayonnement, mouvement brownien, diffusion, osmose | Matière microscopique, thermique et transport (`built`) | **full** | Matière, chaleur et transport (full) |
| 20 | Fluides, pression et débit | pression fluide, débit, continuité, viscosité / résistance, Bernoulli (éventuel) | Flux, gradients, champs et fluides (`built`) | **full** | Flux, gradients, champs et fluides (full) |

### D · Électricité, magnétisme et lumière

| # | Module | Concepts | Production | Couverture actuelle | Par |
|---|---|---|---|---|---|
| 21 | Électrostatique | charge, champ électrique, potentiel, tension | Électricité fondamentale et circuits (`built`) | **full** | Le champ électrique (full), Courant et circuits (supporting), Magnétisme et induction (supporting), L’onde électromagnétique (supporting), Atomes, noyaux et lumière (supporting), D’un gradient à une tension (supporting) |
| 22 | Courant et circuits dynamiques | courant, résistance, loi d’Ohm, condensateur, RC / RL / RLC | Électricité fondamentale et circuits (`built`) | **full** | Courant et circuits (full), Magnétisme et induction (supporting), D’un gradient à une tension (supporting), Protons et électrons qui passent (supporting) |
| 23 | Magnétisme et induction | champ magnétique, force de Lorentz, flux magnétique, Faraday, Lenz | Magnétisme et induction (`built`) | **full** | Magnétisme et induction (full), L’onde électromagnétique (supporting) |
| 24 | Onde électromagnétique | E et B couplés, propagation, fréquence, longueur d’onde, énergie, spectre EM | Onde électromagnétique et spectre (`built`) | **full** | L’onde électromagnétique (full), Optique : la lumière qui tourne (supporting) |
| 25 | Optique fondamentale | réflexion, réfraction, indice, réflexion totale, lentilles, dispersion, polarisation | Optique fondamentale (`built`) | **full** | Optique : la lumière qui tourne (full) |

### E · Atomes, chimie et noyaux

| # | Module | Concepts | Production | Couverture actuelle | Par |
|---|---|---|---|---|---|
| 26 | Architecture atomique et nucléaire | atome, électron, proton, neutron, isotopes, énergie de liaison, stabilité nucléaire, radioactivité de base | Atomes, noyaux, photons et spectres (`partial`) | **full** | Supernova par effondrement du cœur (supporting), Atomes, noyaux et lumière (full) |
| 27 | Quantification, photons et spectres atomiques | niveaux d’énergie, absorption, émission, photons, effet photoélectrique, spectres | Atomes, noyaux, photons et spectres (`partial`) | partial | L’onde électromagnétique (supporting), Atomes, noyaux et lumière (partial), L’énergie du vivant (supporting) |
| 28 | Liaisons et structure moléculaire | covalence, ionicité, polarité, géométrie, électronégativité, forces intermoléculaires, VSEPR intuitif | Liaisons, molécules, mole et stœchiométrie (`built`) | **full** | Molécules et mole (full) |
| 29 | Compter la matière | mole, masse molaire, concentration, stœchiométrie | Liaisons, molécules, mole et stœchiométrie (`built`) | **full** | Molécules et mole (full), Protons et électrons qui passent (supporting) |
| 30 | Réactions chimiques | énergie de réaction, activation, cinétique, catalyse, équilibre, Le Chatelier | Réactions chimiques (`planned`) | supporting | La réplication de l’ADN (supporting), Molécules et mole (supporting), Protons et électrons qui passent (supporting), L’énergie du vivant (supporting) |
| 31 | Acide-base, redox et électrochimie | pH, pKa, tampons, redox, potentiel, piles, électrolyse | Acide-base, redox et électrochimie (`built`) | **full** | Protons et électrons qui passent (full), La respiration cellulaire (supporting), L’énergie du vivant (supporting) |

### F · Cellule et biologie moléculaire

| # | Module | Concepts | Production | Couverture actuelle | Par |
|---|---|---|---|---|---|
| 32 | Cellule, membrane et transport | compartiments, membrane, diffusion, transport facilité, pompes | Cellule, membrane et transport (`built`) | **full** | La mitose (supporting), Le neurone qui apprend (supporting), Cellule, membrane et transport (full), D’un gradient à une tension (supporting) |
| 33 | Bioélectricité et synapses | gradients ioniques, potentiel membranaire, seuil, canaux voltage-dépendants, potentiel d’action, transmission synaptique | Bioélectricité et synapses (`built`) | **full** | Le neurone qui apprend (full), D’un gradient à une tension (partial) |
| 34 | Énergie biologique | ATP, couplage, enzymes, respiration, photosynthèse | Énergie biologique (`built`) | **full** | L’énergie du vivant (full), La respiration cellulaire (partial), Cellule, membrane et transport (supporting) |
| 35 | Information génétique | ADN, nucléotides, chromosomes, transcription, traduction, ADN → ARN → protéine | Information génétique (`planned`) | supporting | La mitose (supporting), La réplication de l’ADN (supporting) |
| 36 | Copie, variation et division du génome | réplication, cycle cellulaire, méiose, recombinaison, mutation, réparation | Copie, variation et division du génome (`planned`) | partial | La mitose (partial), La réplication de l’ADN (partial) |
| 37 | Signalisation et homéostasie | ligand, récepteur, cascades, rétroaction, homéostasie | Signalisation et homéostasie (`built`) | **full** | Signaux et équilibres du vivant (full) |

### G · Physiologie

| # | Module | Concepts | Production | Couverture actuelle | Par |
|---|---|---|---|---|---|
| 38 | Muscle, circulation et échanges | muscle / sarcomère, pression-débit biologique, échange gazeux | — | — | — |
| 39 | Immunité et coagulation | immunité innée, immunité adaptative, anticorps, lymphocytes B/T, mémoire, inflammation, coagulation | — | — | — |

### H · Évolution, populations et systèmes complexes

| # | Module | Concepts | Production | Couverture actuelle | Par |
|---|---|---|---|---|---|
| 40 | Évolution et génétique des populations | variation, hérédité, sélection, fréquences alléliques, dérive, effet fondateur, goulot | Évolution et génétique des populations (`built`) | **full** | Évolution et génétique des populations (full) |
| 41 | Populations et propagation sur réseaux | croissance, compétition, prédation, SIR, cascades | — | — | — |
| 42 | Émergence | règles locales, comportement global, automates | — | — | — |

### I · Astrophysique

| # | Module | Concepts | Production | Couverture actuelle | Par |
|---|---|---|---|---|---|
| 43 | Rayonnement thermique / corps noir | corps noir, température, spectre, Wien, Stefan-Boltzmann | — | — | — |
| 44 | Comment fonctionne une étoile | équilibre hydrostatique, fusion, structure interne, évolution, nucléosynthèse | — | partial | Supernova par effondrement du cœur (partial) |
| 45 | Gravitation cosmique et formation des structures | galaxies, amas, grandes structures, expansion cosmique, Hubble, facteur d’échelle, redshift, matière noire introductive | — | — | — |

### J · Relativité

| # | Module | Concepts | Production | Couverture actuelle | Par |
|---|---|---|---|---|---|
| 46 | Fondations de la relativité restreinte | référentiels, invariance de c, simultanéité, temps propre, dilatation, contraction | Relativité restreinte (`built`) | **full** | Relativité restreinte (full), Atomes, noyaux et lumière (supporting) |
| 47 | Fondations de la relativité générale | principe d’équivalence, géodésiques, courbure, horizons | — | — | — |

### K · Quantique

| # | Module | Concepts | Production | Couverture actuelle | Par |
|---|---|---|---|---|---|
| 48 | Fondations quantiques | fonction d’onde, amplitude, probabilité, superposition, mesure, phase quantique, complexes introductifs | — | — | — |
| 49 | Potentiels et états quantiques | puits, barrière, états liés, tunnel | — | — | — |
| 50 | Spin, mesure et intrication | spin, Stern-Gerlach, états à deux niveaux, bases de mesure, intrication | — | — | — |

## Productions de fondations

### Construites

| Production | Modules | Modèle(s) | Remarque |
|---|---|---|---|
| Langage scientifique fondamental | 01 · 02 · 03 | [Langage scientifique](../opus-sonnet/fondations-langage/index.html) | Quatre toys : Échelles, Graphiques (« Le réservoir »), Vecteurs, Mouvement. |
| Forces, énergie et conservation | 10 · 11 | [Forces, énergie et conservation](../opus-sonnet/fondations-forces-energie/index.html) | |
| Oscillations et ondes | 06 · 14 · 15 | [Oscillations et ondes](../opus-sonnet/fondations-oscillations-ondes/index.html) | |
| Matière microscopique, thermique et transport | 17 · 18 · 19 | [Matière, chaleur et transport](../opus-sonnet/07-matiere-chaleur/index.html) | Livrée comme planche 07 (numéro historique), pas dans la section Fondations de l'accueil. |
| Systèmes, croissance et hasard | 04 · 05 · 07 | [Systèmes, croissance et hasard](../opus-sonnet/fondations-systemes-hasard/index.html) | Module 07 partiel. |
| Rotation, gravitation et orbites | 12 · 13 | [Rotation, gravitation et orbites](../opus-sonnet/fondations-rotation-gravitation/index.html) | |
| Flux, gradients, champs et fluides | 16 · 20 | [Flux, gradients, champs et fluides](../opus-sonnet/fondations-flux-fluides/index.html) | |
| Relativité restreinte | 46 | [Relativité restreinte](../opus-sonnet/fondations-relativite-restreinte/index.html) | Ouvre la branche J · Relativité. Le module 47 est seulement annoncé. |
| Électricité fondamentale et circuits | 21 · 22 | [Le champ électrique](../opus-sonnet/04-champ-electrique/index.html) (prolongé), [Courant et circuits](../opus-sonnet/06-courant-circuits/index.html) | La planche du champ électrique existait depuis le 2026-09-29 ; la production l'a prolongée et a ajouté la planche 06. |
| Évolution et génétique des populations | 40 | [Évolution et génétique des populations](../opus-sonnet/fondations-evolution-populations/index.html) | Ouvre la branche H · Évolution, populations et systèmes complexes. Les modules 41 et 42 sont seulement annoncés. |
| Cellule, membrane et transport | 32 | [Cellule, membrane et transport](../opus-sonnet/fondations-cellule-membrane/index.html) | Ouvre la branche F · Cellule et biologie moléculaire. Diffusion et osmose reprises côté cellule ; pompe Na⁺/K⁺ en appui des modules 33 et 34. |
| Magnétisme et induction | 23 | [Magnétisme et induction](../opus-sonnet/fondations-magnetisme-induction/index.html) | Quatre actes en deux paillasses (champ et force, induction). Moteur verrouillé : `prompts/moteurs/magnetisme.js`. Répond à la question laissée ouverte par l'acte IV de *Courant et circuits*. |
| Onde électromagnétique et spectre | 24 | [L’onde électromagnétique](../opus-sonnet/fondations-onde-electromagnetique/index.html) | Un chapitre de quatre étapes (secouer une charge, E et B, spectre, énergie). Moteur : `prompts/moteurs/onde-electromagnetique.js`. Répond à la première question laissée ouverte par *Magnétisme et induction*. |
| Liaisons, molécules, mole et stœchiométrie | 28 · 29 | [Molécules et mole](../opus-sonnet/fondations-molecules-mole/index.html) | Sept étapes en deux chapitres. Moteur testé : `prompts/moteurs/molecules-mole.js`. Ouvre la branche E ; annonce les modules 30 et 31. |
| Atomes, noyaux, photons et spectres (`partial`) | 26 · 27 | [Atomes, noyaux et lumière](../opus-sonnet/fondations-atomes-spectres/index.html) | Chapitre 26 (4 étapes) construit, chapitre 27 (3 étapes) à venir. Moteur verrouillé : `prompts/moteurs/atomes.js`. Reprend à la planche *Supernova* l'énergie de liaison par nucléon. |
| Signalisation et homéostasie | 37 | [Signaux et équilibres du vivant](../opus-sonnet/fondations-signalisation-homeostasie/index.html) | Quatre étapes ; saturation, amplification, glycémie et boucles à retard. Moteur et tests dans le scratchpad (27 tests). |
| Bioélectricité et synapses | 33 | [D’un gradient à une tension](../opus-sonnet/fondations-bioelectricite/index.html) | Quatre étapes complémentaires au neurone ; couverture 33 partial (Hodgkin-Huxley, chimie synaptique détaillée et plasticité renvoyés au showcase). |
| Acide-base, redox et électrochimie | 31 | [Protons et électrons qui passent](../opus-sonnet/fondations-acide-base-redox/index.html) | Un chapitre de quatre étapes (pH, tampons, redox, pile et électrolyse). Moteur verrouillé : `prompts/moteurs/acide-base-redox.js`. Le module 30 reste un préalable annoncé. |
| Optique fondamentale | 25 | [Optique : la lumière qui tourne](../opus-sonnet/fondations-optique/index.html) | Un chapitre de quatre étapes (réfraction et réflexion totale, lentilles, couleurs, polarisation) sur une même table d'optique. Moteur versionné dans prompts/moteurs/optique.js (61 tests dans optique.test.js, aussi lancés sur la page). Construite avant le module 24. |
| Énergie biologique | 34 | [L’énergie du vivant](../opus-sonnet/fondations-energie-biologique/index.html) | Quatre étapes : couplage, enzymes, bilan de la respiration, photosynthèse. Moteur verrouillé : `prompts/moteurs/energie-biologique.js`. Le mécanisme de la chaîne respiratoire reste dans la planche 02 ; répond à la question « énergie » laissée ouverte par *Cellule, membrane et transport*. |

### Prévues (rien de construit)

Dans cet ordre indicatif : 27 (chapitre restant d'*Atomes, noyaux, photons et spectres*) · 30 Réactions chimiques · 35 Information génétique · 36 Copie, variation et division du génome.

La maquette « magnétisme » du premier prototype d'interface, retirée le 2026-10-04 (voir [`historique.md`](historique.md#prototype-dinterface-labo)), n'a rien à voir avec la planche *Magnétisme et induction* construite le 2026-10-06.

Pour 36, des showcases couvrent déjà une partie du module ; une future production pourrait se limiter à ce qui manque.

### Sans production définie

Modules 08 et 09, puis la physiologie (38-39), les populations et l'émergence (41-42), l'astrophysique (43-45), la relativité générale (47) et la quantique (48-50). Candidats évidents au découpage en plusieurs productions : 38 Muscle, circulation et échanges, 44 Comment fonctionne une étoile, 48 Fondations quantiques.

## Chaînes de préalables

Des chemins conseillés, pas des dépendances strictes. LABO n'est pas un arbre obligatoire.

**Mouvement et électromagnétisme**
mesure → vecteurs → changement → forces → énergie → oscillations → ondes → champs → électrostatique → circuits → magnétisme → induction → onde électromagnétique → optique
<br>(01 → 02 → 03 → 10 → 11 → 14 → 15 → 16 → 21 → 22 → 23 → 24 → 25)

**Matière et physiologie**
particules → température → pression → diffusion → gradients → flux → membranes → transport → bioélectricité → physiologie
<br>(17 → 19 → 16 → 32 → 33 → 38)

**Atomes et astrophysique**
atome → niveaux d'énergie → photons → spectres → corps noir → étoiles → nucléosynthèse → évolution stellaire
<br>(26 → 27 → 43 → 44)

**Biologie moléculaire**
cellule → membrane → énergie biologique → ADN → transcription / traduction → réplication → division → variation → évolution
<br>(32 → 34 → 35 → 36 → 40)

**Quantique**
ondes → phase → probabilité → nombres complexes introductifs → amplitude quantique → superposition → mesure → potentiels → états liés → tunnel → spin → intrication
<br>(15 → 06 → 07 → 48 → 49 → 50)

**Relativité et cosmologie**
mouvement → énergie → ondes → gravitation → relativité restreinte → relativité générale → étoiles compactes → trous noirs → cosmologie
<br>(03 → 11 → 15 → 13 → 46 → 47 → 44 → 45)

## Ce que les fondations permettent

Quand une fondation existe, un showcase s'appuie dessus au lieu de tout réenseigner. La planche *Supernova par effondrement du cœur* a été construite avant les fondations 26, 43 et 44 : elle porte encore elle-même beaucoup de théorie (dégénérescence, couches de l'étoile) ; l'énergie de liaison par nucléon et le « mur du fer » sont désormais enseignés par *Atomes, noyaux et lumière* (étape 3). Une future supernova, ou une collision d'étoiles à neutrons, pourra considérer gravitation, pression, rayonnement et étoiles comme acquis, et se concentrer sur effondrement → rebond → choc → neutrinos → explosion.
