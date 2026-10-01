# Projet 07 — Matière, chaleur et transport

Dossier de sortie : `opus-sonnet/07-matiere-chaleur/`. Accent : `--accent: #78d7e0;` (cyan d'eau froide, pour l'interface, les molécules « A » et l'eau de l'osmose).

Couvre les modules canoniques **17 (monde microscopique des gaz)**, **18 (chaleur, phases et entropie)** et **19 (transport thermique et moléculaire)**. Les notions de **gradient** et de **flux** sont utilisées comme prérequis locaux (pente d'un profil le long d'un axe, débit net à travers une ligne) ; le module 16 (champs scalaires et vectoriels, divergence, rotationnel, formulation générale des flux) n'est **pas** couvert et la page ne doit pas le prétendre.

## Intention
Une seule boîte de molécules, réutilisée d'acte en acte. On ne change que les conditions (énergie, volume, cloison, parois chaudes, attraction, membrane) et on regarde ce qui émerge. Le message unique : **les grandeurs macroscopiques (température, pression, concentration, flux, chaleur) sont des moyennes sur un très grand nombre d'événements microscopiques aléatoires.** Aucune molécule ne « sait » où aller.

## Modèle verrouillé (un seul moteur)
- Dynamique moléculaire 2D, unités réduites : diamètre σ = 1, masse m = 1, énergie ε = 1, temps τ. Intégration de Verlet vitesse, pas dt = 0,004 τ, liste de cellules.
- Interaction de paires : répulsion WCA (Lennard-Jones tronqué à 2^(1/6) σ, décalé) ; à l'acte VIII seulement, Lennard-Jones complet tronqué à 2,5 σ (attraction).
- Parois : répulsion douce ; la force cumulée sur les parois, divisée par le périmètre, donne la **pression mesurée** (en 2D : force par longueur).
- Température : `k T = ⟨½ m v²⟩` (2 degrés de liberté en 2D). Affichée en K avec l'échelle `kT = 1 ↔ 300 K` (substance fictive).
- Thermostat faible (Berendsen) quand on « règle l'énergie » ; parois thermiques de Langevin à l'acte VII (l'énergie qu'elles injectent ou retirent est comptée : c'est la chaleur).
- Gaz idéal comme référence : `P A = N k T` (A : aire). Le rapport `PA/NkT` mesuré doit rester proche de 1 (un peu au-dessus à cause de la taille des molécules).
- Distribution des vitesses en 2D (Maxwell-Boltzmann) : `f(v) = (m v / kT) · exp(−m v² / 2kT)`.

## Neuf actes (stepper)
I. **Température** — 200 molécules, curseur d'énergie. Histogramme des vitesses contre la courbe de Maxwell-Boltzmann. T est la moyenne de l'énergie cinétique, pas une propriété d'une molécule.
II. **Pression** — piston mobile (curseur ou glisser), thermostat activable. P mesurée contre NkT/A ; points mesurés tracés dans le plan P-V avec l'isotherme. Thermostat coupé : comprimer réchauffe.
III. **Mouvement brownien** — un grain lourd (σ = 5, M = 40) parmi 450 molécules. Trajectoire, bouton « vue microscope » qui masque les molécules.
IV. **Diffusion** — molécules A (gauche) et B (droite), cloison retirée. Profil de concentration de A en bande sous la boîte, pente (gradient), flèche de flux net mesuré à la ligne médiane, une molécule suivie dont la trajectoire reste aléatoire.
V. **Entropie** — toutes les molécules d'un côté, N au choix (4, 12, 40, 200). Histogramme observé de n_gauche contre la loi binomiale, Ω = C(N, n), probabilité 2^−N du retour total. Rien n'interdit le retour, il est seulement improbable.
VI. **Osmose** — membrane mobile retenue par un ressort, perméable à l'eau, imperméable au soluté. Le soluté pousse la membrane ; l'eau traverse dans les deux sens, le flux net va vers le soluté jusqu'à l'équilibre où la pression du soluté (≈ c_s kT, van 't Hoff) égale la force de rappel. Mode « membrane fixe » : pas de flux net, mais une différence de pression (pression osmotique).
VII. **Chaleur et conduction** — paroi gauche chaude, paroi droite froide (Langevin). Profil de température, gradient, flux de chaleur mesuré aux parois ; bouton « isoler » : le profil s'aplatit.
VIII. **Changement de phase** — attraction activée, amas cristallin froid, puissance de chauffe constante. Courbe T contre Q avec un palier adouci : l'énergie va aux liaisons (énergie potentielle), pas à l'agitation. Capacité thermique apparente.
IX. **Convection et rayonnement** — scènes compactes et illustratives : rouleau de convection à champ de vitesse imposé (parcelles chauffées en bas, refroidies en haut) ; rayonnement entre un corps chaud et un corps froid à travers le vide, puissance ∝ T⁴.

## Ce qui est simulé, simplifié, illustratif
- **Simulé** : trajectoires, chocs, température (énergie cinétique moyenne), pression (force sur les parois), diffusion, mouvement brownien, flux de molécules et de chaleur (comptés), osmose, palier de phase.
- **Simplifié** : 2D ; 30 à 500 molécules au lieu de ~10²³ ; potentiel de Lennard-Jones générique ; membrane idéale ; ressort à la place de la pression hydrostatique ; temps très ralenti ; changement de phase d'un petit amas (palier arrondi).
- **Illustratif** : couleurs de vitesse et de température, flèches de flux, bandes de profil, rouleau de convection imposé, « photons » dessinés.

## Code couleur
Vitesse et température : rampe gris-bleu sombre (lent, froid) vers `--energie` (rapide, chaud) : l'agitation est de l'énergie. Molécules A et eau : `--accent`. Molécules B et soluté : lilas `#b9a3ff`. Grain brownien : `--texte`. `--positif` et `--negatif` ne sont pas utilisés (pas de charges ici).

## Interface
Structure de la série (comme 05) : scène, titre discret `L'invisible en mouvement — 07`, panneau de lecture avec mesures en IBM Plex Mono et un petit graphique, barre de contrôles avec stepper I–IX et outils propres à l'acte. Survol d'une molécule, d'une paroi, du piston, de la membrane ou du grain : nom et rôle. Clavier : Espace, ← →, R, 1–9.
