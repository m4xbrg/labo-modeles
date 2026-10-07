# Atlas des phénomènes

L'Atlas est le grand réservoir de phénomènes que LABO **pourrait** construire un jour. Ce n'est pas la liste des pages : la plupart des entrées sont des idées et le resteront peut-être longtemps. LABO n'est pas une liste à cocher ; on choisit un phénomène quand il est scientifiquement intéressant, qu'il gagne vraiment à être vu, que les fondations disponibles le rendent compréhensible, et qu'il offre un mécanisme, une dynamique ou une géométrie qui vaut la peine.

Version structurée : [`atlas.json`](atlas.json). Les statuts et les colonnes sont expliqués dans [`README.md`](README.md#statuts).

## En chiffres

| | Entrées | `built` | `partial` | `absorbed` | `selected` | `idea` |
|---|---|---|---|---|---|---|
| Liste historique (18 groupes) | 192 | 6 | 11 | 37 | 0 | 138 |
| Ajouts proposés (2026-10-02) | 69 | 7 | 4 | 11 | 1 | 46 |
| Sujets de l'histoire du dépôt | 4 | 3 | 0 | 0 | 1 | 0 |
| **Total** | **265** | **16** | **15** | **48** | **2** | **184** |

La liste historique compte 193 lignes : « Cosmic web » y figure deux fois (groupes 11 et 16) et n'a qu'une entrée de données.

## Provenance

Chaque entrée garde son origine, pour qu'on ne confonde jamais l'idée d'origine et les compléments.

- `original-list` : la liste historique de phénomènes, le réservoir de départ du projet. Elle est conservée telle quelle, dans ses 18 groupes.
- `proposed-addition` : ajouts proposés le 2026-10-02 pour combler des trous (traduction, chaîne respiratoire, Bernoulli, diffraction, nucléosynthèse, etc.). Ils ne font **pas** partie de la liste d'origine.
- `repo-history` : sujets présents dans l'histoire du dépôt (une planche ou un brief) mais absents des deux listes. Le champ électrique et le neurone sont parmi les toutes premières planches ; le double pendule a un brief de showcase.

Cas particulier : la respiration cellulaire, la chaîne de transport d'électrons, l'ATP synthase et le gradient de protons figurent dans les ajouts proposés, mais la planche Respiration cellulaire existe depuis le 2026-09-29. Elles restent étiquetées `proposed-addition` (c'est de là qu'elles viennent dans l'Atlas) avec le statut `built`.

## Lire une entrée

- **Statut** : `idea`, `selected`, `absorbed`, `partial`, `built`.
- **Module d'accueil** : le module canonique où le sujet vit, ou vivrait, comme fondation. Vide pour un showcase autonome (une supernova n'a pas de module d'accueil : elle s'appuie sur plusieurs).
- **Préparé par** : les modules qui le rendent compréhensible. Première carte qualitative ; vide quand ce n'était pas justifiable.
- **Modèle** : la page qui le couvre, s'il y en a une ([`modeles.md`](modeles.md)).
- **Kind** (dans le JSON seulement, indicatif) : `toy` (sujet circonscrit), `showcase` (phénomène suivi de bout en bout), `frontier` (grand showcase aux préalables lourds).

## Absorbée n'est pas effacée

Beaucoup d'idées de la liste historique sont devenues, pour l'essentiel, des morceaux de fondations : la diffusion, l'osmose et le brownien vivent dans *Matière, chaleur et transport* (modules 17·18·19) ; l'effet Doppler, les ondes sur une corde et les ondes stationnaires dans *Oscillations et ondes* (6·14·15) ; le circuit RC, le condensateur et le RLC dans *Courant et circuits* (22) ; le champ vectoriel, la divergence, le rotationnel et les lignes de niveau dans *Flux, gradients, champs et fluides* (16·20) ; les orbites et le moment cinétique dans *Rotation, gravitation et orbites* (12·13) ; la dilatation du temps, la contraction des longueurs, le train et les éclairs et l’énergie relativiste dans *Relativité restreinte* (46) ; la sélection naturelle, la dérive génétique, l'effet fondateur et le goulot d'étranglement dans *Évolution et génétique des populations* (40) ; le champ magnétique, la force de Lorentz, l'induction, la génératrice et les courants de Foucault dans *Magnétisme et induction* (23).

Ces entrées restent dans l'Atlas avec le statut `absorbed` et un lien vers le modèle. Rien n'empêche qu'un de ces sujets reçoive un jour son propre toy. Une idée dont la fondation d'accueil n'est pas encore construite (la catalyse, module 30) reste `idea`.

À l'inverse, une idée historique peut rester longtemps une simple idée sans que ce soit un manque : « Collision de deux étoiles à neutrons » est dans l'Atlas avec le statut `idea`, aucun modèle, et la liste des modules qui la prépareront.

## Regroupements

Les 18 groupes historiques sont conservés comme navigation principale : ils sont le réservoir tel qu'il a été pensé. Une taxonomie plus compacte, en 14 domaines, est proposée pour une future page LABO. La correspondance est approximative, car certains groupes historiques se partagent entre deux domaines.

| Domaine compact proposé | Groupes historiques |
|---|---|
| 1 · Mathématiques et représentation | 18 |
| 2 · Mécanique | 5 |
| 3 · Ondes et optique | 3 |
| 4 · Matière, thermique et fluides | 4 (partie physique), 2 |
| 5 · Électricité et magnétisme | 6 |
| 6 · Chimie | 4 (partie chimie), 12 (liaisons, orbitales moléculaires) |
| 7 · Cellule et biologie moléculaire | 1 (partie cellulaire), 7 (partie moléculaire) |
| 8 · Physiologie et neurosciences | 1 (partie physiologie), 7 (neurones, immunité, coagulation) |
| 9 · Évolution, populations et émergence | 8 |
| 10 · Planètes et systèmes orbitaux | 9 |
| 11 · Étoiles et objets compacts | 10, une partie du 17 |
| 12 · Galaxies et cosmologie | 11, 16, une partie du 17 |
| 13 · Quantique | 13, 12 (atomes et quantification) |
| 14 · Relativité | 14, 15 |

Rien n'est encore restructuré selon cette taxonomie : c'est une proposition à valider le jour où l'Atlas deviendra une page.

## Les deux idées sélectionnées

| Idée | Brief | État |
|---|---|---|
| Double pendule et chaos | « 07 · Double pendule et chaos » (paquet de fondations, hors dépôt) | Rien de construit. Prépare l'entrée dans le module 08, qu'aucune fondation ne couvre encore. |
| Barrière et effet tunnel | « 08 · Effet tunnel quantique » (même paquet) | Rien de construit. Suppose les modules 15 et 48. |

Le même paquet contenait un brief « 09 · Supernova par effondrement du cœur » ; la planche 09 existe, avec son propre brief dans `prompts/09-supernova.md`.

---

## Liste historique

### 1 · Cellule, biologie moléculaire et physiologie fondamentale

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Diffusion | `absorbed` | 19 | 17 | Matière, chaleur et transport | Acte de la planche Matière, chaleur et transport. |
| Osmose | `absorbed` | 19 | 17 | Matière, chaleur et transport | Acte de la planche Matière, chaleur et transport. |
| Mouvement brownien | `absorbed` | 19 | 17 | Matière, chaleur et transport | Acte de la planche Matière, chaleur et transport. |
| Cycle cellulaire | `partial` | 36 | 35 | La mitose | La mitose montre la phase M ; G1, S, G2 et les points de contrôle du cycle ne sont pas construits. |
| Mitose | `built` | 36 | 35, 32 | La mitose | Planche 01, construite le 2026-09-29 avec trois autres planches : le premier showcase de LABO. |
| Réplication de l’ADN | `built` | 36 | 35, 30 | La réplication de l’ADN |  |
| Transcription | `idea` | 35 | 30 | — |  |
| Contraction musculaire | `idea` | 38 | 10, 34, 33 | — |  |
| Battement du cœur | `idea` | 38 | 20, 33 | — |  |
| Circulation sanguine | `idea` | 38 | 20 | — |  |
| Échange gazeux pulmonaire | `idea` | 38 | 19, 17 | — |  |
| Néphron | `idea` | — | 20, 32, 19 | — | Rattachement de module à revoir (38 ou 37). |
| Digestion | `idea` | — | 30, 34 | — | Rattachement de module à revoir. |
| Photosynthèse | `idea` | 34 | 27, 31, 30 | — |  |
| Enzyme-substrat | `idea` | 34 | 30 | — | Peut aussi servir le module 30 (catalyse). |

### 2 · Terre et environnement

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Saisons | `idea` | — | 13, 02 | — | Aucun module canonique Terre : rattachement à revoir. |
| Cycle de l’eau | `idea` | — | 18, 19 | — | Aucun module canonique Terre : rattachement à revoir. |

### 3 · Ondes et optique

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Ondes sur une corde | `absorbed` | 15 | 06, 14 | Oscillations et ondes |  |
| Interférences | `built` | 15 | 06 | Ondes et interférences | Aussi présentes dans les fondations Oscillations et ondes. |
| Ondes stationnaires | `absorbed` | 15 | 06, 14 | Oscillations et ondes | Modes de la corde. |
| Effet Doppler | `absorbed` | 15 | 06 | Oscillations et ondes |  |
| Réfraction | `idea` | 25 | 15 | — |  |
| Réflexion totale interne | `idea` | 25 | 15 | — |  |
| Lentilles | `idea` | 25 | 15 | — |  |
| Polarisation de la lumière | `idea` | 25 | 24 | — |  |
| Dispersion dans un prisme | `idea` | 25 | 24 | — |  |

### 4 · Matière, thermique et chimie

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Pression d’un gaz | `absorbed` | 17 | 10, 11 | Matière, chaleur et transport |  |
| Gaz idéal | `absorbed` | 17 | 10, 11 | Matière, chaleur et transport |  |
| Changement de phase | `absorbed` | 18 | 17 | Matière, chaleur et transport |  |
| Diagramme de phase | `idea` | 18 | 17 | — |  |
| Conduction thermique | `absorbed` | 19 | 17 | Matière, chaleur et transport |  |
| Convection | `absorbed` | 19 | 20, 17 | Matière, chaleur et transport | Acte IX de Matière, chaleur et transport, avec le rayonnement. |
| Rayonnement thermique | `partial` | 43 | 24 | Matière, chaleur et transport | Introduit à l’acte IX de Matière, chaleur et transport ; le corps noir (module 43) n’est pas construit. |
| Cinétique chimique | `idea` | 30 | 07, 05 | — |  |
| Catalyse | `idea` | 30 | — | — |  |
| Équilibre chimique | `idea` | 30 | — | — |  |
| Titrage acide-base | `idea` | 31 | 29, 05 | — |  |
| Tampon chimique | `idea` | 31 | — | — |  |
| Précipitation | `idea` | — | 29, 28 | — | Rattachement de module à revoir (29, 30 ou 31). |
| Électrolyse | `idea` | 31 | 22 | — |  |
| Pile galvanique | `idea` | 31 | 21, 22 | — |  |

### 5 · Mécanique classique et oscillateurs

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Projectile | `idea` | 03 | 02, 10 | — | Le canon de Newton (fondations Rotation et gravitation) part d’un tir horizontal, sans traiter le projectile pour lui-même. |
| Projectile avec traînée | `idea` | 10 | 02, 04 | — |  |
| Pendule simple | `idea` | 14 | 06, 10 | — |  |
| Pendule amorti | `idea` | 14 | 06, 04 | — |  |
| Résonance mécanique | `absorbed` | 14 | 06 | Oscillations et ondes |  |
| Masse-ressort | `absorbed` | 14 | 06, 10, 11 | Oscillations et ondes |  |
| Pendules couplés | `idea` | 14 | 06, 15 | — |  |
| Battements | `idea` | 15 | 06 | — |  |
| Centre de masse | `absorbed` | 11 | 02 | Forces, énergie et conservation | Traité avec les collisions ; le barycentre revient dans les fondations Rotation et gravitation. |
| Moment cinétique | `absorbed` | 12 | 02, 11 | Rotation, gravitation et orbites |  |
| Précession gyroscopique | `partial` | 12 | 02, 11 | Rotation, gravitation et orbites | Introduction seulement dans les fondations Rotation. |

### 6 · Électromagnétisme et circuits

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Champ magnétique | `absorbed` | 23 | 21, 02 | Magnétisme et induction | Acte I des fondations Magnétisme et induction (aimant, fil, spire, bobine ; lignes et boussoles). |
| Force de Lorentz | `absorbed` | 23 | 21, 02, 10 | Magnétisme et induction | Acte II des fondations Magnétisme et induction (charge, sélecteur de vitesse, balançoire de Laplace). |
| Cyclotron | `partial` | 23 | 12, 21 | Magnétisme et induction | Acte II : période indépendante de la vitesse (deux protons) ; pas d’accélération entre les dés. |
| Induction électromagnétique | `absorbed` | 23 | 21, 22 | Magnétisme et induction | Acte III des fondations Magnétisme et induction (aimant et bobine, deux bobines de Faraday). |
| Transformateur | `idea` | 23 | 22 | — |  |
| Onde électromagnétique | `absorbed` | 24 | 15, 21, 23 | L’onde électromagnétique | Étapes 1 et 2 des fondations L’onde électromagnétique (charge secouée dont la ride part à c ; E et B en phase, E = cB). |
| Circuit RC | `absorbed` | 22 | 05, 21 | Courant et circuits |  |
| Circuit RLC | `absorbed` | 22 | 14, 21 | Courant et circuits |  |
| Résonance RLC | `idea` | 22 | 14 | — |  |
| Condensateur | `absorbed` | 22 | 21 | Courant et circuits |  |
| Solénoïde | `absorbed` | 23 | 22 | Magnétisme et induction | Acte I (bobine, champ μ₀nI, équivalence avec l’aimant). |
| Moteur électrique | `idea` | 23 | 12, 22 | — |  |
| Génératrice | `absorbed` | 23 | 12, 22 | Magnétisme et induction | Acte III (spire qui tourne, lampe). |
| Propagation dans une ligne de transmission | `idea` | 24 | 15, 22 | — |  |

### 7 · Neurobiologie, signalisation et régulation cellulaire

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Potentiel d’action détaillé | `built` | 33 | 21, 32, 19 | Le neurone qui apprend | Acte 1 de la planche Neurone. |
| Hodgkin-Huxley | `partial` | 33 | 04, 22 | Le neurone qui apprend | La planche Neurone calcule son tracé avec un modèle de Hodgkin-Huxley, sans en faire un objet d’étude manipulable. |
| Jonction neuromusculaire | `idea` | 33 | 38 | — |  |
| Transmission synaptique | `partial` | 33 | 32 | Le neurone qui apprend | Présente dans l’acte 2 de la planche Neurone, au service de la plasticité. |
| Plasticité synaptique | `built` | 33 | 32 | Le neurone qui apprend | Acte 2 de la planche Neurone (PLT). |
| Contraction cardiaque | `idea` | 38 | 33 | — |  |
| Système immunitaire inné | `idea` | 39 | — | — |  |
| Réponse adaptative | `idea` | 39 | — | — |  |
| Coagulation sanguine | `idea` | 39 | 30 | — |  |
| Méiose | `idea` | 36 | 35 | — |  |
| Mutation ADN | `idea` | 36 | 35 | — |  |
| Réparation de l’ADN | `idea` | 36 | 35 | — |  |
| Expression génique | `idea` | 35 | 37 | — |  |
| Signalisation cellulaire | `idea` | 37 | 32 | — |  |
| Apoptose | `idea` | 37 | 36 | — |  |

### 8 · Évolution, écologie et systèmes complexes

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Épidémie SIR | `idea` | 41 | 04, 05 | — |  |
| Prédateur-proie | `idea` | 41 | 04, 08 | — |  |
| Compétition entre espèces | `idea` | 41 | 04 | — |  |
| Sélection naturelle | `absorbed` | 40 | 07 | Évolution et génétique des populations | Mécanisme dans A1, A2, B1 et C2 (variation, hérédité, fitness relative, trois formes de sélection). Un showcase sur un cas réel reste à faire. |
| Dérive génétique | `absorbed` | 40 | 07 | Évolution et génétique des populations | D1 (généalogie de copies, vingt populations) et D2 (sélection contre dérive). |
| Effet fondateur | `absorbed` | 40 | 07 | Évolution et génétique des populations | E1 (continent et colonies). |
| Goulot d’étranglement | `absorbed` | 40 | 07 | Évolution et génétique des populations | E2 (taille, allèles, diversité). |
| Game of Life | `idea` | 42 | — | — |  |
| Automates cellulaires | `idea` | 42 | — | — |  |
| Modèle d’Ising | `idea` | 42 | 07, 18 | — |  |
| Trafic routier | `idea` | 42 | — | — |  |
| Avalanches critiques | `idea` | 42 | 07 | — |  |
| Propagation sur réseau | `idea` | 41 | 07 | — |  |
| Consensus / polarisation | `idea` | 41 | 07 | — |  |

### 9 · Gravitation, systèmes planétaires et formation planétaire

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Orbites planétaires | `absorbed` | 13 | 10, 11 | Rotation, gravitation et orbites |  |
| Système binaire | `partial` | 13 | 11 | Rotation, gravitation et orbites | Le barycentre est traité ; un système binaire complet ne l’est pas. |
| Marées | `idea` | 13 | 16 | — |  |
| Points de Lagrange | `idea` | 13 | 12 | — |  |
| Assistance gravitationnelle | `idea` | 13 | 11 | — |  |
| Formation du système solaire | `idea` | 45 | 13, 12, 18 | — |  |
| Accrétion planétaire | `idea` | 13 | 11 | — |  |
| Migration planétaire | `idea` | 13 | — | — |  |

### 10 · Étoiles et évolution stellaire

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Évolution stellaire | `partial` | 44 | 13, 17, 26, 43 | Supernova par effondrement du cœur | La supernova montre une étoile massive en fin de vie ; le parcours stellaire complet n’est pas construit. |
| Structure interne d’une étoile | `partial` | 44 | 13, 17, 20 | Supernova par effondrement du cœur | Structure en couches d’une étoile massive, montrée dans la supernova. |
| Séquence principale | `idea` | 44 | 43 | — |  |
| Diagramme HR | `idea` | 44 | 43 | — |  |
| Géante rouge | `idea` | 44 | — | — |  |
| Naine blanche | `idea` | 44 | 26, 48 | — |  |
| Supernova de type II | `built` | — | 13, 11, 17, 26, 43, 44 | Supernova par effondrement du cœur | Planche « Supernova par effondrement du cœur ». |
| Supernova de type Ia | `idea` | — | 44, 26 | — |  |
| Étoile à neutrons | `idea` | — | 26, 44, 47 | — | Apparaît comme résidu de la supernova, sans être explorée pour elle-même. |
| Pulsar | `idea` | — | 12, 23 | — |  |
| Binaire compact | `idea` | — | 13, 47 | — |  |
| Disque d’accrétion | `idea` | — | 12, 13, 43 | — |  |

### 11 · Trous noirs, galaxies et grandes structures

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Trou noir | `idea` | 47 | 13, 46 | — |  |
| Lentille gravitationnelle | `idea` | 47 | 25 | — |  |
| Collision de galaxies | `idea` | 45 | 13 | — |  |
| Formation d’une galaxie | `idea` | 45 | 13 | — |  |
| Cosmic web | `idea` | 45 | 13 | — | Figure aussi dans le groupe 16 de la liste historique. |

### 12 · Atomes et quantification

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Corps noir | `idea` | 43 | 24, 17 | — |  |
| Effet photoélectrique | `idea` | 27 | 24 | — |  |
| Spectres atomiques | `idea` | 27 | 26 | — |  |
| Modèle de Bohr | `idea` | 27 | 26 | — |  |
| Orbitales atomiques | `idea` | 48 | 27 | — |  |
| Hybridation | `idea` | 28 | 48 | — |  |
| Orbitales moléculaires | `idea` | 28 | 48 | — |  |

### 13 · Quantique

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Particule dans une boîte | `idea` | 49 | 15, 48 | — |  |
| Paquet d’onde | `idea` | 48 | 15, 09 | — |  |
| Double fente quantique | `idea` | 48 | 15, 07 | — |  |
| Stern-Gerlach | `idea` | 50 | 23 | — |  |
| Spin 1/2 | `idea` | 50 | 48 | — |  |
| Intrication | `idea` | 50 | 48 | — |  |
| Principe d’incertitude | `idea` | 48 | 09 | — |  |
| Oscillateur harmonique quantique | `idea` | 49 | 14 | — |  |

### 14 · Relativité restreinte

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Dilatation du temps | `absorbed` | 46 | — | Relativité restreinte | Actes II (horloge lumineuse) et V. |
| Contraction des longueurs | `absorbed` | 46 | — | Relativité restreinte | Acte V (ruban d’univers coupé par deux simultanéités). |
| Train et éclairs | `absorbed` | 46 | — | Relativité restreinte | Simultanéité. Acte III, avec reconstruction corrigée des délais. |
| Aberration relativiste | `idea` | 46 | — | — |  |
| Énergie relativiste | `absorbed` | 46 | 11 | Relativité restreinte | Acte VIII (E = γmc², E² = (pc)² + (mc²)²). |
| Accélération propre | `idea` | 46 | — | — |  |
| Relativité des champs E/B | `idea` | 46 | 21, 23 | — |  |

### 15 · Relativité générale

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Courbure de l’espace-temps | `idea` | 47 | 13 | — |  |
| Déviation de la lumière | `idea` | 47 | 13 | — |  |
| Précession de Mercure | `idea` | 47 | 13 | — |  |
| Trou noir de Schwarzschild | `idea` | 47 | 13, 46 | — |  |
| Photon sphere | `idea` | 47 | — | — |  |
| Forces de marée / spaghettification | `idea` | 47 | 13 | — |  |
| Fusion de trous noirs | `idea` | — | 47, 15 | — |  |
| Onde gravitationnelle | `idea` | 47 | 15 | — |  |

### 16 · Cosmologie

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Recombinaison | `idea` | 45 | 27, 43 | — |  |
| Nucléosynthèse primordiale | `idea` | 45 | 26 | — |  |
| Croissance des structures | `idea` | 45 | 13 | — |  |
| Matière noire | `idea` | 45 | 13 | — |  |
| Énergie noire | `idea` | 45 | — | — |  |
| Univers selon Ωm / ΩΛ / Ωk | `idea` | 45 | 04 | — |  |
| Oscillations acoustiques baryoniques | `idea` | 45 | 15 | — |  |
| Cosmic web | `idea` | 45 | 13 | — | Figure aussi dans le groupe 16 de la liste historique. |
| Formation des premiers halos | `idea` | 45 | 13 | — |  |
| Premières étoiles / Population III | `idea` | 44 | — | — |  |
| Réionisation | `idea` | 45 | 27 | — |  |
| Fusion hiérarchique des galaxies | `idea` | 45 | 13 | — |  |

### 17 · Astrophysique avancée / grands showcases

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Ray tracing autour d’un trou noir | `idea` | — | 47, 25 | — |  |
| Collision de deux trous noirs | `idea` | — | 47, 15 | — |  |
| Collision de deux étoiles à neutrons | `idea` | — | 13, 26, 44, 47 | — |  |
| Kilonova et production d’éléments lourds | `idea` | — | 26, 44 | — |  |
| Magnétar | `idea` | — | 23 | — |  |
| Jet relativiste d’un noyau actif | `idea` | — | 23, 46 | — |  |
| Quasar | `idea` | — | 13, 43 | — |  |
| Explosion de supernova vue couche par couche | `partial` | — | 44 | Supernova par effondrement du cœur | La planche Supernova suit l’onde de choc à travers les couches ; une vue couche par couche détaillée reste à faire. |
| Effondrement gravitationnel d’un nuage moléculaire | `idea` | 44 | 13, 17 | — |  |
| Formation d’une étoile | `idea` | 44 | 13, 17 | — |  |
| Formation d’un disque protoplanétaire | `idea` | — | 12, 13 | — |  |
| Dynamo solaire | `idea` | — | 23, 20 | — |  |
| Éruption solaire | `idea` | — | 23 | — |  |
| Magnétosphère terrestre | `idea` | — | 23 | — |  |
| Aurores polaires | `idea` | — | 23, 27 | — |  |
| Reconnexion magnétique | `idea` | — | 23 | — |  |
| Vent solaire | `idea` | — | 20, 23 | — |  |
| Onde de choc astrophysique | `idea` | — | 15, 20 | — |  |
| Nébuleuse en expansion | `idea` | — | 27 | — |  |
| Formation d’éléments dans les étoiles | `partial` | 44 | 26 | Supernova par effondrement du cœur | Les couches d’éléments de l’étoile massive sont montrées ; les réactions de fusion ne sont pas suivies. |

### 18 · Mathématiques et systèmes dynamiques visualisables

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Système de Lorenz | `idea` | 08 | 04 | — |  |
| Attracteurs étranges | `idea` | 08 | 04 | — |  |
| Carte logistique | `idea` | 08 | 04 | — |  |
| Équation de la chaleur | `idea` | 19 | 16, 03 | — |  |
| Équation des ondes | `idea` | 15 | 03 | — |  |
| Champ vectoriel | `absorbed` | 16 | 02 | Flux, gradients, champs et fluides |  |
| Divergence et rotationnel | `absorbed` | 16 | 02 | Flux, gradients, champs et fluides |  |
| Gradient d’une surface | `absorbed` | 16 | 02, 03 | Flux, gradients, champs et fluides |  |
| Lignes de niveau | `absorbed` | 16 | — | Flux, gradients, champs et fluides |  |
| Transformée de Fourier | `idea` | 09 | 06 | — |  |
| Série de Fourier | `idea` | 09 | 06 | — |  |

---

## Ajouts proposés (`proposed-addition`)

Absents de la liste historique ; proposés le 2026-10-02 pour rendre l'Atlas plus cohérent. Aucun n'est une commande de construction.

### Biologie moléculaire

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Traduction ARN → protéine | `idea` | 35 | — | — |  |
| Repliement / structure des protéines | `idea` | 35 | 28 | — |  |
| Membrane cellulaire et canaux | `absorbed` | 32 | 28 | Cellule, membrane et transport | Actes I et II des fondations Cellule, membrane et transport (bicouche, canaux, transporteurs). |
| Transport actif / pompe Na⁺/K⁺ | `absorbed` | 32 | 34 | Cellule, membrane et transport | Acte V des fondations Cellule, membrane et transport (pompe Na⁺/K⁺, symport). |
| Respiration cellulaire | `built` | 34 | 30, 31 | La respiration cellulaire | Sujet construit dès le 2026-09-29, avant cette liste : voir la note de provenance. |
| Chaîne de transport d’électrons | `built` | 34 | 31 | La respiration cellulaire | Étape de la planche Respiration cellulaire. |
| ATP synthase | `built` | 34 | 12 | La respiration cellulaire | La turbine de la planche Respiration cellulaire. |
| Gradient de protons | `built` | 34 | 16, 31 | La respiration cellulaire | Piloté par le curseur d’O₂ de la planche Respiration cellulaire. |

### Développement / génétique

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Recombinaison méiotique | `idea` | 36 | — | — |  |
| Ségrégation chromosomique | `partial` | 36 | — | La mitose | Montrée en anaphase dans la mitose ; la ségrégation méiotique ne l’est pas. |
| Régulation transcriptionnelle | `idea` | 35 | — | — |  |
| Épigénétique introductive | `idea` | 35 | — | — |  |

### Physiologie

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Ventilation pulmonaire | `idea` | 38 | 20 | — |  |
| Relation pression-volume du poumon | `idea` | 38 | 17, 20 | — |  |
| Boucle pression-volume cardiaque | `idea` | 38 | 20, 11 | — |  |
| Régulation de la glycémie | `idea` | 37 | 04 | — |  |
| Potentiel de membrane | `partial` | 33 | 21, 19 | Le neurone qui apprend | Potentiel de repos et dépolarisation dans la planche Neurone. |

### Chimie

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Liaison chimique et géométrie moléculaire | `absorbed` | 28 | 21 | [Molécules et mole](../opus-sonnet/fondations-molecules-mole/index.html) | Étapes 1 à 3 (creux d’énergie, électronégativité, VSEPR et moment dipolaire). |
| Forces intermoléculaires | `absorbed` | 28 | 21 | [Molécules et mole](../opus-sonnet/fondations-molecules-mole/index.html) | Étape 4 (modèle 2D qualitatif, liaisons hydrogène). |
| Dissolution / solvatation | `idea` | 28 | 19 | — |  |
| Diffusion réactionnelle | `idea` | 30 | 19 | — |  |
| Le Chatelier interactif | `idea` | 30 | — | — |  |

### Fluides

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Continuité dans un tube | `absorbed` | 20 | 16 | Flux, gradients, champs et fluides |  |
| Poiseuille / résistance hydraulique | `absorbed` | 20 | 16 | Flux, gradients, champs et fluides |  |
| Bernoulli | `absorbed` | 20 | 11 | Flux, gradients, champs et fluides | Mode « Rétrécissement » (Venturi) des fondations Flux et fluides. |
| Vortex | `idea` | 20 | 16 | — |  |
| Écoulement laminaire vs turbulent | `idea` | 20 | 08 | — |  |

### Électromagnétisme

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Champ électrique + potentiel comme deux représentations | `built` | 21 | 16 | Le champ électrique |  |
| Dipôle électrique | `built` | 21 | — | Le champ électrique | Configuration de la planche Champ électrique. |
| Dipôle magnétique | `absorbed` | 23 | — | Magnétisme et induction | Acte I (spire et aimant vus de loin). |
| Courants de Foucault | `absorbed` | 23 | — | Magnétisme et induction | Acte IV (aimant qui tombe dans un tube de cuivre). |
| Induction motrice | `absorbed` | 23 | — | Magnétisme et induction | Acte IV (tige sur des rails, ε = Bℓv). |
| Propagation EM depuis une source oscillante | `absorbed` | 24 | 15 | L’onde électromagnétique | Étape 1 des fondations L’onde électromagnétique (charge qui oscille : onde sortante, λ = c/f, rien dans l’axe). |

### Optique

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Diffraction | `idea` | 25 | 15 | — |  |
| Double fente classique | `idea` | 25 | 15 | — | Les interférences à deux sources de la planche Ondes s’en approchent sans la traiter. |
| Réseau de diffraction | `idea` | 25 | 15 | — |  |
| Résolution / limite de diffraction | `idea` | 25 | 15 | — |  |
| Interféromètre | `idea` | 25 | 15 | — |  |

### Atomes / noyaux

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Désintégration radioactive | `partial` | 26 | 05, 07 | Systèmes, croissance et hasard | Version statistique (étape D3 des fondations Systèmes, croissance et hasard) ; la physique nucléaire n’est pas traitée. |
| Chaîne de désintégration | `idea` | 26 | 05 | — |  |
| Fission | `idea` | 26 | 11 | — |  |
| Fusion | `idea` | 26 | 11 | — |  |
| Énergie de liaison nucléaire | `idea` | 26 | 11 | — |  |

### Quantique

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Barrière et effet tunnel | `selected` | 49 | 15, 48 | — | Brief de showcase écrit (« 08 · Effet tunnel quantique »), rien de construit. |
| Puits fini / infini | `idea` | 49 | 48 | — |  |
| Mesure et effondrement | `idea` | 48 | 07 | — |  |
| Phase quantique | `idea` | 48 | 06 | — |  |
| Interférence d’amplitudes | `idea` | 48 | 15 | — |  |
| Décohérence introductive | `idea` | 48 | — | — |  |

### Astrophysique

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Équilibre hydrostatique | `idea` | 44 | 13, 20 | — |  |
| Fusion proton-proton | `idea` | 44 | 26 | — |  |
| Cycle CNO | `idea` | 44 | 26 | — |  |
| Limite de Chandrasekhar | `idea` | 44 | 48 | — |  |
| Pression de dégénérescence | `idea` | 44 | 48 | — |  |
| Effondrement du cœur | `built` | 44 | 13, 26 | Supernova par effondrement du cœur | Cœur de la planche Supernova. |
| Nucléosynthèse stellaire | `partial` | 44 | 26 | Supernova par effondrement du cœur |  |
| Processus r | `idea` | 44 | 26 | — |  |
| Processus s | `idea` | 44 | 26 | — |  |

### Cosmologie

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Expansion de l’Univers | `idea` | 45 | — | — |  |
| Loi de Hubble | `idea` | 45 | — | — |  |
| Redshift cosmologique | `idea` | 45 | 15 | — |  |
| Fond diffus cosmologique | `idea` | 45 | 43 | — |  |
| Lentillage gravitationnel cosmologique | `idea` | 45 | 47 | — |  |

### Systèmes complexes

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Percolation | `idea` | 42 | 07 | — |  |
| Synchronisation d’oscillateurs | `idea` | 42 | 06 | — |  |
| Réaction-diffusion | `idea` | 42 | 19, 30 | — |  |
| Motifs de Turing | `idea` | 42 | 19 | — |  |
| Réseaux petits-mondes | `idea` | 41 | — | — |  |
| Transition de phase collective | `idea` | 42 | 18 | — |  |

---

## Sujets de l'histoire du dépôt (`repo-history`)

Présents dans le dépôt (planche ou brief) mais absents des deux listes ci-dessus.

| Phénomène | Statut | Module d’accueil | Préparé par | Modèle | Note |
|---|---|---|---|---|---|
| Champ électrique | `built` | 21 | 02 | Le champ électrique | Une des quatre premières planches (2026-09-29). |
| Neurone qui apprend | `built` | 33 | 21, 32 | Le neurone qui apprend | Une des quatre premières planches ; voir aussi « Potentiel d’action détaillé » et « Plasticité synaptique ». |
| Courant et circuits | `built` | 22 | 21 | Courant et circuits |  |
| Double pendule et chaos | `selected` | 08 | 10, 11, 12, 04 | — | Brief de showcase écrit (« 07 · Double pendule et chaos »), rien de construit. |
