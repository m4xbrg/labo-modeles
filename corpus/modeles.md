# Modèles : ce qui existe réellement

Ce fichier ne liste que ce qui s'ouvre dans le dépôt, sur `main`. Un brief, un prompt, une maquette ou une idée d'Atlas n'y figure pas comme modèle. Version structurée : [`models.json`](models.json).

Toutes les pages vivent dans `opus-sonnet/` (le nom du dossier vient de l'époque du banc d'essai Opus + Sonnet ; voir [`historique.md`](historique.md)). Chaque modèle est une page `index.html` autonome, avec un `explication.html` « Comprendre ce qui se passe ».

**16 modèles** : 9 planches numérotées 01-09 (dont 5 forment la collection *L'invisible en mouvement*, et 3 sont issues ou prolongées par des productions de fondations) et 7 pages de fondations. Plus trois pages d'appui (accueil, préalables, redirection racine).

## Vue d'ensemble

| Modèle | Type | Production | N° hist. · collection | Modules principaux | Depuis |
|---|---|---|---|---|---|
| [La mitose](../opus-sonnet/01-mitose/index.html) | showcase | — | 01 · L'invisible en mouvement | 36 (partial) | 2026-09-29 |
| [La respiration cellulaire](../opus-sonnet/02-respiration/index.html) | showcase | — | 02 · L'invisible en mouvement | 34 (partial) | 2026-09-29 |
| [Le neurone qui apprend](../opus-sonnet/03-neurone/index.html) | showcase | — | 03 · L'invisible en mouvement | 33 | 2026-09-29 |
| [Le champ électrique](../opus-sonnet/04-champ-electrique/index.html) | sandbox | Électricité fondamentale et circuits | 04 · hors collection | 21 | 2026-09-29 |
| [Ondes et interférences](../opus-sonnet/05-ondes-interferences/index.html) | showcase | — | 05 · hors collection | 15 (partial) | 2026-10-01 |
| [Courant et circuits](../opus-sonnet/06-courant-circuits/index.html) | foundation | Électricité fondamentale et circuits | 06 · hors collection | 22 | 2026-10-01 |
| [Matière, chaleur et transport](../opus-sonnet/07-matiere-chaleur/index.html) | foundation | Matière microscopique, thermique et transport | 07 · hors collection | 17, 18, 19 | 2026-10-01 |
| [La réplication de l’ADN](../opus-sonnet/08-replication-adn/index.html) | showcase | — | 08 · L'invisible en mouvement | 36 (partial) | 2026-10-01 |
| [Supernova par effondrement du cœur](../opus-sonnet/09-supernova/index.html) | showcase | — | 09 · L'invisible en mouvement | 44 (partial) | 2026-10-01 |
| [Langage scientifique](../opus-sonnet/fondations-langage/index.html) | foundation | Langage scientifique fondamental | — | 01, 02, 03 | 2026-10-01 |
| [Systèmes, croissance et hasard](../opus-sonnet/fondations-systemes-hasard/index.html) | foundation | Systèmes, croissance et hasard | — | 04, 05, 07 (partial), 08 (partial) | 2026-10-01 |
| [Oscillations et ondes](../opus-sonnet/fondations-oscillations-ondes/index.html) | foundation | Oscillations et ondes | — | 06, 14, 15 | 2026-10-01 |
| [Forces, énergie et conservation](../opus-sonnet/fondations-forces-energie/index.html) | foundation | Forces, énergie et conservation | — | 10, 11 | 2026-10-01 |
| [Rotation, gravitation et orbites](../opus-sonnet/fondations-rotation-gravitation/index.html) | foundation | Rotation, gravitation et orbites | — | 12, 13 | 2026-10-01 |
| [Flux, gradients, champs et fluides](../opus-sonnet/fondations-flux-fluides/index.html) | foundation | Flux, gradients, champs et fluides | — | 16, 20 | 2026-10-01 |
| [Relativité restreinte](../opus-sonnet/fondations-relativite-restreinte/index.html) | foundation | Relativité restreinte | — | 46 | 2026-10-02 |

Les modules marqués `supporting` (utilisés en passant) sont omis ici ; ils figurent dans les fiches.

## Showcases et bacs à sable

### Le rôle de la mitose

*La mitose* est la planche 01 : construite le 2026-09-29 avec la respiration cellulaire, le neurone et le champ électrique, lors du tout premier essai. Elle a montré ce que LABO peut devenir : un mécanisme biologique compliqué (sept étapes, kinétochores, point de contrôle du fuseau, séparase, cytocinèse) devient lisible quand la page est conçue autour du mécanisme lui-même, avec une frise qu'on peut remonter et un chromosome qu'on peut suivre.

Elle reste un showcase autonome. Elle relève du module 36 (copie et division du génome), qu'elle couvre en `partial` (la phase M, pas la réplication, la méiose ni la réparation), et elle s'appuie sur 35 (chromosomes, chromatides) et 32 (cellule). Une future production de fondations 35·36 la préparera ; elle ne la remplacera pas.

### La mitose

- **Identifiant** : `mitose` · **chemin** : [`opus-sonnet/01-mitose/index.html`](../opus-sonnet/01-mitose/index.html) · **explication** : [`explication.html`](../opus-sonnet/01-mitose/explication.html)
- **Type** : showcase · **statut** : `built` · **production** : aucune (showcase autonome)
- **Collection** : L'invisible en mouvement (numéro historique 01)
- **Modules** : 36 Copie, variation et division du génome (`partial`), 35 Information génétique (`supporting`), 32 Cellule, membrane et transport (`supporting`)
- **Étapes** : Interphase (fin) · Prophase · Prométaphase · Métaphase · Anaphase · Télophase · Cytocinèse
- **Interaction** : Frise continue réversible, vitesses, suivi d’un chromosome, identification au survol.
- **Notes** : Planche 01, une des quatre premières (2026-09-29) : le premier showcase de LABO. Couvre la phase M du module 36 ; la réplication, la méiose, la mutation et la réparation n’y sont pas.

### La respiration cellulaire

- **Identifiant** : `respiration` · **chemin** : [`opus-sonnet/02-respiration/index.html`](../opus-sonnet/02-respiration/index.html) · **explication** : [`explication.html`](../opus-sonnet/02-respiration/explication.html)
- **Type** : showcase · **statut** : `built` · **production** : aucune (showcase autonome)
- **Collection** : L'invisible en mouvement (numéro historique 02)
- **Modules** : 34 Énergie biologique (`partial`), 31 Acide-base, redox et électrochimie (`supporting`), 16 Flux, gradients et champs continus (`supporting`)
- **Étapes** : Glycolyse · Pyruvate · Cycle de Krebs · Chaîne de transport et ATP synthase · Tout le trajet
- **Interaction** : Étapes narratives, curseur d’O₂ qui pilote le gradient de protons, frise, identification au survol.
- **Notes** : Couvre ATP, enzymes et respiration du module 34 ; la photosynthèse et le couplage énergétique général n’y sont pas.

### Le neurone qui apprend

- **Identifiant** : `neurone` · **chemin** : [`opus-sonnet/03-neurone/index.html`](../opus-sonnet/03-neurone/index.html) · **explication** : [`explication.html`](../opus-sonnet/03-neurone/explication.html)
- **Type** : showcase · **statut** : `built` · **production** : aucune (showcase autonome)
- **Collection** : L'invisible en mouvement (numéro historique 03)
- **Modules** : 33 Bioélectricité et synapses (`full`), 32 Cellule, membrane et transport (`supporting`), 04 Systèmes qui évoluent dans le temps (`supporting`)
- **Actes** : Acte 1 · Impulsion · Acte 2 · Synapse
- **Interaction** : Intensité de stimulation, influx un par un ou en rafale, remonter le temps, sonde d’oscilloscope déplaçable.
- **Notes** : Tracé calculé par un modèle de Hodgkin-Huxley couplé nœud à nœud. Couvre l’essentiel du module 33 (potentiel de membrane, seuil, canaux voltage-dépendants, potentiel d’action, transmission synaptique) et ajoute la plasticité (PLT).

### Le champ électrique

- **Identifiant** : `champ-electrique` · **chemin** : [`opus-sonnet/04-champ-electrique/index.html`](../opus-sonnet/04-champ-electrique/index.html) · **explication** : [`explication.html`](../opus-sonnet/04-champ-electrique/explication.html)
- **Type** : sandbox · **statut** : `built` · **production** : Fondations · Électricité fondamentale et circuits
- **Collection** : aucune depuis le 2026-10-04 (numéro historique 04)
- **Modules** : 21 Électrostatique (`full`), 16 Flux, gradients et champs continus (`supporting`), 02 Vecteurs et géométrie des quantités (`supporting`), 11 Énergie et quantité de mouvement (`supporting`)
- **Éléments** : Préréglages : dipôle, deux identiques, condensateur, quadrupôle · Couches : lignes, équipotentielles, carte de V, vecteurs, forces · Charge test · Tension entre deux points A–B
- **Interaction** : Bac à sable : placer, déplacer, régler des charges ; lâcher une charge test ; sonder E, V et la force.
- **Notes** : Une des quatre premières planches, prolongée le 2026-10-01 par la production de fondations Électricité (tension, forces de Coulomb, tableau charge / champ / force / potentiel / tension / énergie).

### Ondes et interférences

- **Identifiant** : `ondes-interferences` · **chemin** : [`opus-sonnet/05-ondes-interferences/index.html`](../opus-sonnet/05-ondes-interferences/index.html) · **explication** : [`explication.html`](../opus-sonnet/05-ondes-interferences/explication.html)
- **Type** : showcase · **statut** : `built` · **production** : aucune (showcase autonome)
- **Collection** : aucune depuis le 2026-10-04 (numéro historique 05)
- **Modules** : 15 Ondes (`partial`), 06 Sinusoïdes, cycles et phase (`supporting`)
- **Actes** : I Une source · II Impulsions · III Annulation · IV Énergie · V Stationnaire · VI À toi
- **Interaction** : Longueur d’onde et phase réglables, sources et sonde glissables, vue instantanée ou intensité moyenne.
- **Notes** : Antérieure aux fondations Oscillations et ondes, qui reprennent le module 15 en entier. Couvre la superposition et les interférences en 2D ; pas de Doppler ni de modes.

### La réplication de l’ADN

- **Identifiant** : `replication-adn` · **chemin** : [`opus-sonnet/08-replication-adn/index.html`](../opus-sonnet/08-replication-adn/index.html) · **explication** : [`explication.html`](../opus-sonnet/08-replication-adn/explication.html)
- **Type** : showcase · **statut** : `built` · **production** : aucune (showcase autonome)
- **Collection** : L'invisible en mouvement (numéro historique 08)
- **Modules** : 36 Copie, variation et division du génome (`partial`), 35 Information génétique (`supporting`), 30 Réactions chimiques (`supporting`)
- **Actes** : 1 Ouvrir · 2 Un seul sens · 3 À reculons · 4 Coudre · 5 La vraie machine
- **Interaction** : Actes en lecture, mesures en direct, graphe distance polymérase–fourche ; pas de curseur physique.
- **Notes** : Couvre la réplication du module 36 ; topoisomérase, PCNA et relecture sont nommées comme absentes. Créée sous le numéro 06, renumérotée 08.

### Supernova par effondrement du cœur

- **Identifiant** : `supernova` · **chemin** : [`opus-sonnet/09-supernova/index.html`](../opus-sonnet/09-supernova/index.html) · **explication** : [`explication.html`](../opus-sonnet/09-supernova/explication.html)
- **Type** : showcase · **statut** : `built` · **production** : aucune (showcase autonome)
- **Collection** : L'invisible en mouvement (numéro historique 09)
- **Modules** : 44 Comment fonctionne une étoile (`partial`), 26 Architecture atomique et nucléaire (`supporting`), 13 Gravitation et orbites (`supporting`), 11 Énergie et quantité de mouvement (`supporting`)
- **Actes** : I Supergéante · II En couches · III Cœur de fer · IV Effondrement · V Rebond · VI Le choc cale · VII Explosion · VIII Résidu
- **Interaction** : Frise logarithmique glissable, actes, mesures en direct et bilan d’énergie ; pas de curseur physique (choix du brief).
- **Notes** : Showcase narratif. Les préalables (`prealables.html`) n’ont pas de section pour elle. Elle suppose les modules 13, 26, 43 et 44, dont seuls 11 et 13 sont construits.

## Pages de fondations

*Courant et circuits* et *Matière, chaleur et transport* sont des pages de fondations ; elles gardent leurs numéros historiques 06 et 07 mais ne font plus partie de la collection. *Le champ électrique* figure plus haut, comme bac à sable, bien que la production Électricité l'ait prolongé.

### Courant et circuits

- **Identifiant** : `courant-circuits` · **chemin** : [`opus-sonnet/06-courant-circuits/index.html`](../opus-sonnet/06-courant-circuits/index.html) · **explication** : [`explication.html`](../opus-sonnet/06-courant-circuits/explication.html)
- **Type** : foundation · **statut** : `built` · **production** : Fondations · Électricité fondamentale et circuits
- **Collection** : aucune depuis le 2026-10-04 (numéro historique 06)
- **Modules** : 22 Courant et circuits dynamiques (`full`), 05 Exponentielles et logarithmes (`supporting`), 14 Oscillateurs et résonance (`supporting`), 21 Électrostatique (`supporting`)
- **Actes** : I Une boucle · II Charge · III Décharge · IV Bobine (RL / LC amorti)
- **Interaction** : Curseurs de tension, résistance, capacité ; inverseur charge/décharge ; bascule RL / LC amorti.
- **Notes** : Construite par la production de fondations Électricité mais rangée dans la collection, numéro 06. Le RLC est traité comme un LC amorti, la résonance forcée RLC ne l’est pas.

### Matière, chaleur et transport

- **Identifiant** : `matiere-chaleur` · **chemin** : [`opus-sonnet/07-matiere-chaleur/index.html`](../opus-sonnet/07-matiere-chaleur/index.html) · **explication** : [`explication.html`](../opus-sonnet/07-matiere-chaleur/explication.html)
- **Type** : foundation · **statut** : `built` · **production** : Fondations · Matière microscopique, thermique et transport
- **Collection** : aucune depuis le 2026-10-04 (numéro historique 07)
- **Modules** : 17 Monde microscopique des gaz (`full`), 18 Chaleur, phases et entropie (`full`), 19 Transport thermique et moléculaire (`full`), 16 Flux, gradients et champs continus (`supporting`)
- **Actes** : I Température · II Pression et volume · III Mouvement brownien · IV Diffusion, gradient, flux · V Pourquoi ça ne revient pas (entropie) · VI Osmose · VII Chaleur et conduction · VIII Changement de phase · IX Convection et rayonnement
- **Interaction** : Un seul moteur de dynamique moléculaire 2D ; curseurs propres à chaque acte (énergie, piston, parois, chauffage) ; mesure d’une molécule au survol.
- **Notes** : C’est la production de fondations 17·18·19, rangée dans la collection sous le numéro 07 et non dans la section Fondations de l’accueil. Le gradient et le flux y sont utilisés sans couvrir le module 16.

### Langage scientifique

- **Identifiant** : `fondations-langage` · **chemin** : [`opus-sonnet/fondations-langage/index.html`](../opus-sonnet/fondations-langage/index.html) · **explication** : [`explication.html`](../opus-sonnet/fondations-langage/explication.html)
- **Type** : foundation · **statut** : `built` · **production** : Fondations · Langage scientifique fondamental
- **Collection** : aucune
- **Modules** : 01 Mesure, échelles et représentation scientifique (`full`), 02 Vecteurs et géométrie des quantités (`full`), 03 Changement et accumulation (`full`), 05 Exponentielles et logarithmes (`supporting`), 10 Forces, inertie et lois de Newton (`supporting`)
- **Toys** : A · Échelles — « Puissances de dix » · B · Graphiques — « Le réservoir » · C · Vecteurs — « Une flèche, pas un nombre » · D · Mouvement — « Trois graphes, un seul mouvement »
- **Interaction** : Quatre laboratoires en onglets, chacun avec 2 à 4 modes ; zoom de 10⁻¹⁰ à 10¹³ m, débit réglable, flèches saisissables, paliers d’accélération glissables.
- **Notes** : Module 01 : l’analyse dimensionnelle n’est que dans l’explication. Module 02 en 2D. Module 03 en 1D, accélération constante par morceaux.

### Systèmes, croissance et hasard

- **Identifiant** : `fondations-systemes-hasard` · **chemin** : [`opus-sonnet/fondations-systemes-hasard/index.html`](../opus-sonnet/fondations-systemes-hasard/index.html) · **explication** : [`explication.html`](../opus-sonnet/fondations-systemes-hasard/explication.html)
- **Type** : foundation · **statut** : `built` · **production** : Fondations · Systèmes, croissance et hasard
- **Collection** : aucune
- **Modules** : 04 Systèmes qui évoluent dans le temps (`full`), 05 Exponentielles et logarithmes (`full`), 07 Hasard, probabilité et distributions (`partial`), 08 Non-linéarité, stabilité et chaos (`partial`), 03 Changement et accumulation (`supporting`), 01 Mesure, échelles et représentation scientifique (`supporting`)
- **Actes** : A1 L’état et son taux · A2 Même règle, autres départs · B1 Négatif ou positif ? · B2 La croissance logistique · C1 Pourquoi ça explose · C2 L’échelle logarithmique et l’opération inverse · D1 Un lancer, beaucoup de lancers · D2 Marche aléatoire et distribution · D3 Hasard individuel, loi collective
- **Interaction** : Stepper en quatre chapitres ; pas d’Euler, champ de pentes, billes en cuvette ou dôme, dés, marcheurs, atomes.
- **Notes** : Module 07 partiel (pas de probabilités conditionnelles ni de loi binomiale nommée). Module 08 effleuré : stabilité en 1D et logistique, pas de chaos.

### Oscillations et ondes

- **Identifiant** : `fondations-oscillations-ondes` · **chemin** : [`opus-sonnet/fondations-oscillations-ondes/index.html`](../opus-sonnet/fondations-oscillations-ondes/index.html) · **explication** : [`explication.html`](../opus-sonnet/fondations-oscillations-ondes/explication.html)
- **Type** : foundation · **statut** : `built` · **production** : Fondations · Oscillations et ondes
- **Collection** : aucune
- **Modules** : 06 Sinusoïdes, cycles et phase (`full`), 14 Oscillateurs et résonance (`full`), 15 Ondes (`full`), 09 Signaux et Fourier (`supporting`), 11 Énergie et quantité de mouvement (`supporting`), 04 Systèmes qui évoluent dans le temps (`supporting`)
- **Actes** : A1 Un cycle · A2 Deux oscillations, un déphasage · B1 Échange d’énergie · B2 Amortissement · B3 Forçage et résonance · C1 Une perturbation qui voyage · C2 Onde périodique · D1 Deux ondes, une même corde · D2 Ondes stationnaires et modes propres · D3 Doppler
- **Interaction** : Stepper en quatre chapitres ; fréquence, déphasage, masse, raideur, amortissement, forçage, modes, v/c.
- **Notes** : Ondes en 1D ; battements et pendule absents ; Fourier seulement nommé.

### Forces, énergie et conservation

- **Identifiant** : `fondations-forces-energie` · **chemin** : [`opus-sonnet/fondations-forces-energie/index.html`](../opus-sonnet/fondations-forces-energie/index.html) · **explication** : [`explication.html`](../opus-sonnet/fondations-forces-energie/explication.html)
- **Type** : foundation · **statut** : `built` · **production** : Fondations · Forces, énergie et conservation
- **Collection** : aucune
- **Modules** : 10 Forces, inertie et lois de Newton (`full`), 11 Énergie et quantité de mouvement (`full`), 02 Vecteurs et géométrie des quantités (`supporting`), 03 Changement et accumulation (`supporting`)
- **Actes** : I Inertie · II Force résultante et masse · III Action-réaction · IV Travail et énergie · V Collision · VI À toi
- **Interaction** : Actes en paillasses ; pousser, régler forces et masses, piste en profil, collisions rejouables.
- **Notes** : Forces en 1D seulement.

### Rotation, gravitation et orbites

- **Identifiant** : `fondations-rotation-gravitation` · **chemin** : [`opus-sonnet/fondations-rotation-gravitation/index.html`](../opus-sonnet/fondations-rotation-gravitation/index.html) · **explication** : [`explication.html`](../opus-sonnet/fondations-rotation-gravitation/explication.html)
- **Type** : foundation · **statut** : `built` · **production** : Fondations · Rotation, gravitation et orbites
- **Collection** : aucune
- **Modules** : 12 Rotation (`full`), 13 Gravitation et orbites (`full`), 11 Énergie et quantité de mouvement (`supporting`), 16 Flux, gradients et champs continus (`supporting`), 02 Vecteurs et géométrie des quantités (`supporting`), 03 Changement et accumulation (`supporting`)
- **Actes** : I Tourner · II Couple et inertie · III Moment cinétique conservé · IV Gyroscope et précession · V Le canon de Newton · VI Ellipse et énergie · VII Barycentre
- **Interaction** : Actes en deux paillasses ; patineur, anneau, gyroscope, canon de Newton, ellipse avec aires et puits de potentiel, barycentre.
- **Notes** : Rotation autour d’un axe fixe ; gyroscope en introduction ; marées et Lagrange seulement cités.

### Flux, gradients, champs et fluides

- **Identifiant** : `fondations-flux-fluides` · **chemin** : [`opus-sonnet/fondations-flux-fluides/index.html`](../opus-sonnet/fondations-flux-fluides/index.html) · **explication** : [`explication.html`](../opus-sonnet/fondations-flux-fluides/explication.html)
- **Type** : foundation · **statut** : `built` · **production** : Fondations · Flux, gradients, champs et fluides
- **Collection** : aucune
- **Modules** : 16 Flux, gradients et champs continus (`full`), 20 Fluides, pression et débit (`full`), 02 Vecteurs et géométrie des quantités (`supporting`), 03 Changement et accumulation (`supporting`), 01 Mesure, échelles et représentation scientifique (`supporting`)
- **Toys** : A · Cartes scalaires — « Une valeur partout » · B · Champs vectoriels — « Une flèche partout » · C · Flux — « Ce qui traverse » · D · Pression et débit
- **Interaction** : Quatre laboratoires en onglets ; foyers, sondes, moulinet, surfaces fermées, conduit avec cinq fluides.
- **Notes** : Gauss et Stokes seulement nommés ; Bernoulli traité (Venturi).

### Relativité restreinte

- **Identifiant** : `fondations-relativite-restreinte` · **chemin** : [`opus-sonnet/fondations-relativite-restreinte/index.html`](../opus-sonnet/fondations-relativite-restreinte/index.html) · **explication** : [`explication.html`](../opus-sonnet/fondations-relativite-restreinte/explication.html)
- **Type** : foundation · **statut** : `built` · **production** : Fondations · Relativité restreinte
- **Collection** : aucune
- **Modules** : 46 Fondations de la relativité restreinte (`full`), 11 Énergie et quantité de mouvement (`supporting`), 03 Changement et accumulation (`supporting`)
- **Actes** : I Deux référentiels · II Horloge lumineuse · III Train et éclairs · IV Diagramme d’espace-temps · V Dilatation et contraction · VI Temps propre · VII Addition des vitesses · VIII Énergie et quantité de mouvement
- **Interaction** : Actes en trois paillasses ; changement de référentiel, horloge lumineuse, train et éclairs avec reconstruction corrigée des délais, diagramme de Minkowski avec cône de lumière et transformation de Lorentz animée, ruban d’univers, jumeaux à point de demi-tour déplaçable, fusées en étages, poussée à force constante et triangle énergie-impulsion.
- **Notes** : Une dimension d’espace ; demi-tour instantané ; apparence visuelle (Terrell, aberration, Doppler relativiste) hors champ ; module 47 seulement annoncé.

## Pages d'appui

| Page | Rôle | État |
|---|---|---|
| [`opus-sonnet/index.html`](../opus-sonnet/index.html) | Accueil actuel de tout le site, titré « L'invisible en mouvement » : la collection 01-09, puis une section « Fondations · le langage préalable ». | Construit. Le chapeau énumère huit phénomènes et omet la supernova. |
| [`opus-sonnet/prealables.html`](../opus-sonnet/prealables.html) | « Avant de commencer » : théorie préalable par planche. | Partiel : sections 01 à 08 ; rien pour la 09 ni pour les fondations. Aucune planche n'y renvoie ; seul l'accueil y mène. |
| [`index.html`](../index.html) | Redirection de la racine vers l'accueil. | Construit. |

## Hors corpus (ne pas prendre pour des modèles)

- **Prototype d'interface LABO** (`prototype/`) : sur `main` depuis le 2026-10-02 (PR n° 14), en `noindex`. C'est la nouvelle direction visuelle de LABO ; il ne remplace pas encore l'accueil. `gabarit.html` est un gabarit de planche, pas un modèle. La page `magnetisme.html` est une **maquette** du module 23, pas un modèle. Le prototype utilise une numérotation des modules qui diverge de la carte canonique à partir du module 08 : voir [`historique.md`](historique.md#prototype-dinterface-labo).
- **Version Astra du neurone** : annoncée par l'ancien README (`astra/03-neurone/`), absente du dépôt.
- **Briefs de showcases non construits** : double pendule, effet tunnel (voir [`atlas.md`](atlas.md#les-deux-idées-sélectionnées)).

## Constats transversaux

- Aucun lien relatif cassé dans `opus-sonnet/` (vérifié le 2026-10-02).
- Aucune planche ni page de fondations ne renvoie vers `prealables.html` ; les renvois entre pages sont rares et souvent du texte sans lien (« planche 06 »).
- Deux libellés de série coexistent dans les pages de fondations : « L'invisible en mouvement — Fondations 1·2·3 / 10·11 / 12·13 » (langage, forces, rotation) et « Fondations — modules 4 · 5 · 7 / 6 · 14 · 15 » ou « Fondations 16·20 » (les trois autres). Les nombres affichés sont des numéros de modules canoniques.
- Dans l'explication de *Langage scientifique*, la rubrique « Circuits » renvoie au neurone (03) et non à *Courant et circuits* (06).
