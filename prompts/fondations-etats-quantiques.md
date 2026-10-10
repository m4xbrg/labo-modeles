# Fondations · Potentiels et états quantiques (module 49)

Dossier de sortie : `opus-sonnet/fondations-etats-quantiques/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 49`, titre « Piéger une onde, traverser un *mur* ». Accent : `--accent: #7fc8f0;` (bleu ciel). Budget : ≈ 0,9 ADN, **un chapitre de 4 étapes**.

**Statut particulier.** L'idée d'Atlas sélectionnée « Barrière et effet tunnel » est absorbée par l'étape 3. Un showcase pourra plus tard porter sur une application (microscope à effet tunnel, désintégration α) sans réexpliquer le tunnel. Mettre l'idée à `absorbed` dans le corpus avec le lien vers cette page.

Préalables conseillés : 48 (amplitude, paquet d'ondes), 15 (ondes stationnaires, modes d'une corde), 27 (niveaux d'énergie), 11 (énergie potentielle).

## Intention

À la fin, l'étudiant sait que **confiner une onde quantique la force à prendre certaines formes seulement, donc certaines énergies** (comme une corde fixée aux deux bouts n'a que certaines fréquences), et que **l'onde déborde dans les régions classiquement interdites**, assez pour traverser une barrière mince. Intuitions à rendre évidentes, par ordre de priorité :

1. Dans une boîte, seules les ondes stationnaires qui « tiennent » sont permises : énergies discrètes, qui croissent comme n² et comme 1/L² (étape 1).
2. Une paroi de hauteur finie ne retient pas parfaitement : la fonction d'onde y pénètre en s'atténuant exponentiellement, et le nombre d'états liés dépend de la profondeur (étape 2).
3. Une particule peut traverser une barrière plus haute que son énergie ; la probabilité chute **exponentiellement** avec l'épaisseur (étape 3, moment fort).
4. Cette sensibilité exponentielle explique des faits très différents : un microscope qui voit les atomes, des noyaux qui vivent une microseconde ou des milliards d'années, la fusion dans le Soleil (étape 4, moment fort).

Interdits : « la particule emprunte de l'énergie pour passer », « elle creuse un tunnel ».

## Réutilisation (ne pas reconstruire)

- Modes d'une corde, ondes stationnaires : `../fondations-oscillations-ondes/` (module 15). L'étape 1 montre la corde et le puits côte à côte.
- Amplitudes, |ψ|², paquet gaussien : future page 48 (`../fondations-quantique/`). Reprendre son rendu (partie réelle, enveloppe, aire).
- Niveaux de l'hydrogène, spectres : future page 26 · 27.
- Désintégration α, demi-vie : future page 26 · 27 et `../fondations-systemes-hasard/`.
- Fusion au cœur du Soleil : future page 43 · 44.
- Exponentielles et logarithmes : `../fondations-systemes-hasard/` (module 05).

## Moteur (à écrire et tester avant la page)

Bloc `/* QS-BEGIN */ … /* QS-END */`, objet `QS`. Unités : nm, eV, fs ; masse de l'électron par défaut ; ħ²/(2mₑ) = 0,0381 eV·nm².

- **États stationnaires** : `eigen(V, grid, nStates)` (différences finies, matrice tridiagonale, valeurs propres par bisection de Sturm et vecteurs propres par itération inverse) ; `infiniteWell(L, n)` analytique ; `finiteWellCount(V0, L)` ; potentiels prédéfinis : puits infini, puits fini, double puits, oscillateur harmonique, puits de forme libre (dessiné à la souris).
- **Dynamique** : `cnInit(grid, dt)`, `cnStep(psi)` (Crank-Nicolson, normes conservées) ; `gaussian({x0, sigma, k0})` ; conditions aux bords absorbantes (couche complexe documentée) pour l'étape 3.
- **Barrière** : `transmission(E, V0, a)` (formule exacte pour une barrière rectangulaire, E < V₀ et E > V₀) ; `wkb(E, V(x))` = exp(−2∫κ dx) ; `packetTransmission(psi, xBarrier)` (probabilité mesurée à droite après passage).
- **Applications** : `stmCurrent(gap, phi)` (∝ e^(−2κ·gap), κ = √(2mφ)/ħ) ; `gamowHalfLife(Z, E_alpha)` (modèle de Gamow, constantes documentées, comparé à des données réelles de ²¹²Po, ²²⁶Ra, ²³⁸U, ²³²Th avec sources) ; `ppTunnel(T)` (facteur de Gamow pour deux protons à la température du cœur solaire, comparé à l'énergie thermique moyenne).

### Tests du moteur

1. Puits infini L = 1 nm, électron : E₁ = 0,376 eV, Eₙ = n²E₁ ; `eigen` retrouve les 5 premiers à 0,1 % avec 1 000 points.
2. Oscillateur harmonique : niveaux équidistants (n + ½)ħω à 0,1 %.
3. Puits fini : nombre d'états = plafond de (L√(2mV₀))/(πħ) ; un puits très peu profond a toujours au moins un état lié (1D).
4. Crank-Nicolson : norme conservée à 10⁻¹⁰ sur 10⁴ pas (sans bord absorbant) ; un état propre ne fait que tourner en phase.
5. Barrière rectangulaire, électron, V₀ − E = 1 eV : κ = 5,12 nm⁻¹ ; a = 0,5 nm → e^(−2κa) = 6,0 × 10⁻³ ; a = 1 nm → 3,6 × 10⁻⁵ ; formule exacte et WKB de même ordre, rapport documenté.
6. Paquet sur une barrière : probabilité transmise = moyenne de `transmission` sur la distribution d'énergie du paquet, à 3 %.
7. STM : φ = 4,5 eV → courant divisé par ≈ 9 pour 0,1 nm de plus (κ ≈ 10,9 nm⁻¹).
8. Gamow : l'ordre des demi-vies de ²¹²Po (≈ 0,3 µs, Eα ≈ 8,95 MeV) et de ²³⁸U (≈ 4,5 × 10⁹ a, Eα ≈ 4,27 MeV) est reproduit à quelques ordres de grandeur près, avec un écart de plus de 20 ordres de grandeur entre les deux (le modèle est approximatif : dire la tolérance retenue).

## Code couleur

| Objet | Couleur et forme |
|---|---|
| potentiel V(x) | trait épais `--texte-2`, régions interdites hachurées |
| niveaux d'énergie | traits horizontaux `--accent` |
| fonction d'onde (partie réelle) | trait fin `--accent` posé sur son niveau ; |ψ|² en aire `--texte` |
| partie de l'onde dans la région interdite | même tracé, hachuré, pour montrer la pénétration |
| énergie de la particule | ligne tiretée `--energie` |
| transmis / réfléchi | barres `--positif` / `--negatif` (seulement pour distinguer) |
| pointe et surface (STM) | `--texte`, atomes de la surface en sphères grises, courant `--energie` |

## Chapitre · Module 49 · Potentiels et états quantiques

### Étape 1 · L'onde dans une boîte
- Scène : à gauche, la corde de la fondation 15 fixée aux deux bouts, avec ses modes ; à droite, un électron dans un puits infini de largeur L : ses états stationnaires dessinés sur leurs niveaux, du même dessin que les modes de la corde. On choisit un état : il ne bouge pas en |ψ|², seule sa phase tourne (la partie réelle oscille). Bouton « Superposer deux états » : |ψ|² se met à osciller d'un côté à l'autre, à la fréquence (E₂ − E₁)/h.
- Contrôles : largeur L (0,2 à 5 nm), état n (1 à 6), bascule superposition.
- Panneau : Eₙ (eV), écart E₂ − E₁, longueur d'onde du photon correspondant, nombre de nœuds. Statuts : « Comme une corde fixée aux deux bouts : seules les ondes qui tiennent un nombre entier de demi-longueurs d'onde sont permises » ; L divisée par 2 « Boîte deux fois plus petite, énergies quatre fois plus grandes : c'est pourquoi les électrons des atomes ont des énergies de quelques eV ». Lien : boîtes quantiques dont la couleur dépend de la taille (Atlas).
- Phrase-clé : « Confinée, une onde quantique ne peut prendre que certaines formes, donc certaines énergies : Eₙ = n²h²/(8mL²). »
- Note : parois infinies, une dimension.

### Étape 2 · Puits fini et états liés
- Scène : un puits de profondeur V₀ et de largeur L ; ses états liés avec leurs fonctions d'onde, qui débordent dans les parois (partie hachurée) ; au-dessus de V₀, un continuum. Bascules de forme : puits fini, double puits (deux états presque dégénérés, symétrique et antisymétrique : préfigure la liaison chimique, module 28), oscillateur harmonique (niveaux équidistants), « dessiner un puits » à la souris.
- Contrôles : profondeur V₀, largeur L, forme.
- Panneau : nombre d'états liés, énergies, longueur de pénétration 1/κ de l'état sélectionné, probabilité de se trouver dans la région interdite. Statuts : « L'onde déborde dans la paroi alors que l'énergie y est inférieure au potentiel : une région interdite en mécanique classique » ; double puits « Deux puits voisins : chaque niveau se dédouble. C'est ainsi que deux atomes partagent leurs électrons ».
- Phrase-clé : « Dans un puits de profondeur finie, il y a un nombre fini d'états liés, et l'onde pénètre un peu dans les parois, en s'atténuant exponentiellement. »
- Note : calcul numérique sur une grille, en 1D.

### Étape 3 · L'effet tunnel (moment fort)
- Scène : un paquet d'ondes (rendu de la page 48) lancé vers une barrière rectangulaire ; à l'impact, une partie est réfléchie, une petite partie passe de l'autre côté. Deux compteurs : probabilité réfléchie, probabilité transmise. Bouton « Version particules » : on répète l'expérience avec des électrons uniques qui sont détectés soit à gauche, soit à droite, jamais coupés en deux. En dessous, le graphe log T en fonction de l'épaisseur a : une droite.
- Contrôles : épaisseur a (0,1 à 1,5 nm), hauteur V₀, énergie du paquet (sous et au-dessus de V₀), bouton « Lancer ».
- Panneau : E, V₀, κ, T (formule exacte), T mesurée sur le paquet, nombre de passages sur N électrons. Statuts : « L'énergie est inférieure à la barrière, et pourtant une partie passe » ; a + 0,1 nm « Un dixième de nanomètre de plus : environ trois fois moins de chances de passer » ; E > V₀ « Au-dessus de la barrière, une partie est quand même réfléchie : autre surprise quantique ».
- Phrase-clé : « Une particule peut traverser une barrière plus haute que son énergie. La probabilité décroît exponentiellement avec l'épaisseur et la hauteur : T ≈ e^(−2κa). »
- Note : barrière rectangulaire, une dimension ; la particule n'emprunte aucune énergie.

### Étape 4 · Le tunnel au travail (moment fort)
- Trois scènes au choix (sélecteur) :
  - **Microscope à effet tunnel** : une pointe balaie une surface d'atomes ; le courant tunnel, très sensible à la distance, est maintenu constant par un asservissement ; la trajectoire de la pointe dessine les atomes. Curseur : distance pointe-surface.
  - **Désintégration α** : un noyau dessiné comme un puits nucléaire entouré d'une barrière coulombienne ; une particule α y rebondit ~10²¹ fois par seconde et a une infime chance de traverser à chaque fois. Curseur : énergie de la particule α (4 à 9 MeV) ; demi-vie affichée en échelle log de la microseconde au milliard d'années, avec les noyaux réels placés dessus.
  - **Fusion dans le Soleil** : deux protons à 15 millions de K ; leur énergie thermique moyenne (≈ 1 keV) est très inférieure à la barrière (≈ 1 MeV) ; sans effet tunnel, aucune fusion.
- Panneau : selon la scène, courant et variation pour 0,1 nm ; demi-vie et rapport entre deux énergies ; probabilité de passage par collision.
- Statuts : STM « Le courant varie d'un facteur dix pour un dixième de nanomètre : assez pour sentir un seul atome » ; α « Doubler l'énergie de la particule α fait passer la demi-vie de milliards d'années à une microseconde » ; Soleil « Sans effet tunnel, le Soleil ne brillerait pas ».
- Phrase-clé : « Parce qu'elle varie exponentiellement, la probabilité de passer à travers une barrière explique des phénomènes sur des dizaines d'ordres de grandeur : voir les atomes, la vie des noyaux, l'énergie des étoiles. »
- Fin de planche, trois questions ouvertes : **Spin** « Certaines grandeurs n'ont que deux valeurs possibles : comment les mesurer ? » → module 50 ; **Chimie** « Comment deux puits voisins font-ils une molécule ? » → module 28 et explication ; **Étoiles** « Qu'est-ce qui retient une naine blanche si ce n'est pas la chaleur ? » → module 44 (dégénérescence, seulement nommée).

## Micro-interactions de découverte

Potentiel, paroi, niveau, état stationnaire, nœud, région interdite, double puits, barrière, paquet transmis, paquet réfléchi, pointe, surface, courant tunnel, noyau, particule α, barrière coulombienne, proton.

## `window.__labo` (en plus du socle)

`setL(nm)`, `setState(n)`, `superpose(on)` (1) ; `setV0(eV)`, `setShape(s)`, `drawWell(points)` (2) ; `setBarrier(a, V0)`, `setEnergy(E)`, `launch()`, `particles(n)` (3) ; `setApplication(kind)`, `setGap(nm)`, `setEalpha(MeV)` (4).

## Théorie (explication, module 49)

- Relations : \(E_n = \dfrac{n^2 h^2}{8 m L^2}\) ; \(E_n = \left(n + \tfrac12\right)\hbar\omega\) ; \(\kappa = \dfrac{\sqrt{2m(V_0 - E)}}{\hbar}\) et \(\psi \propto e^{-\kappa x}\) dans la région interdite ; \(T \approx 16\,\dfrac{E}{V_0}\left(1 - \dfrac{E}{V_0}\right)e^{-2\kappa a}\) ; WKB \(T \approx \exp\left(-2\displaystyle\int \kappa(x)\,\dd x\right)\).
- Exemple chiffré possible : facteur de variation du courant d'un microscope à effet tunnel pour 0,1 nm ; ou énergie de transition d'un électron dans une boîte de 1 nm (couleur d'une boîte quantique).
- Pièges : « l'électron emprunte de l'énergie pour passer » ; « la particule est coupée en deux à la barrière » ; « plus la particule est lourde, plus elle passe facilement » ; « l'énergie la plus basse vaut zéro » (énergie de point zéro) ; « les niveaux d'un puits sont équidistants » (seulement pour l'oscillateur).
- Où ça resservira : 27 (niveaux atomiques), 28 (liaison : double puits), 44 (fusion), 26 · 27 (désintégration α), 50, Atlas : microscope à effet tunnel, boîtes quantiques.
- Seulement introduit ici : équation de Schrödinger indépendante du temps en 3D, atome d'hydrogène quantique, bandes d'énergie des solides, diode tunnel.

## Honnêteté

Une dimension ; potentiels idéalisés ; modèle de Gamow approximatif (ordres de grandeur, pas les valeurs exactes) ; microscope à effet tunnel schématique.

## Hors champ

Atomes à plusieurs électrons, physique du solide, tunnel macroscopique (jonctions Josephson), formalisme matriciel complet.
