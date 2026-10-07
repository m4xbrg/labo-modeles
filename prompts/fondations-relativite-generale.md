# Fondations · Relativité générale (module 47)

Dossier de sortie : `opus-sonnet/fondations-relativite-generale/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 47`, titre « La gravité comme *géométrie* ». Accent : `--accent: #a8b8d8;` (gris bleuté, parent du bleu pâle de la relativité restreinte). Budget : ≈ 0,9 ADN, **un chapitre de 4 étapes**.

Elle prolonge *Relativité restreinte* (`../fondations-relativite-restreinte/`, module 46), qui annonce le module 47 en fin de planche. Elle prépare les trous noirs, la lentille gravitationnelle, les binaires compactes et les ondes gravitationnelles (Atlas).

Préalables conseillés : 13 (gravitation, orbites, vitesse de libération), 46 (espace-temps, temps propre), 25 (lentilles).

## Intention

À la fin, l'étudiant comprend que **la gravité, vue de près, est indiscernable d'une accélération, et qu'elle ralentit le temps** ; et qu'un corps en chute libre suit la trajectoire la plus « droite » possible dans un espace-temps courbé par la masse. Intuitions à rendre évidentes, par ordre de priorité :

1. Dans une cabine fermée, on ne peut pas distinguer « posé sur la Terre » de « accéléré à 1 g dans l'espace » ; en chute libre, la gravité disparaît localement. D'où : la lumière aussi tombe (étape 1).
2. Une horloge plus bas dans un champ de gravité bat plus lentement ; le GPS doit corriger 38 µs par jour, sinon il dériverait de plus de 10 km par jour (étape 2, moment fort).
3. Une orbite et la déviation de la lumière sont des géodésiques : des « lignes droites » dans un espace-temps courbe (étape 3).
4. Un horizon est une surface d'où rien, pas même la lumière, ne ressort ; vu de loin, ce qui y tombe semble s'y figer en rougissant (étape 4, moment fort).

Interdits : « la masse creuse l'espace comme une boule sur un drap » sans dire les limites de l'image (on peut l'utiliser, en signalant qu'elle triche : elle se sert de la gravité pour expliquer la gravité, et ne montre que l'espace, pas le temps) ; « le trou noir aspire ».

## Réutilisation (ne pas reconstruire)

- Diagrammes d'espace-temps, temps propre, horloges qui divergent, γ : `../fondations-relativite-restreinte/`. Reprendre son rendu des horloges et des lignes d'univers.
- Gravitation newtonienne, orbites, énergie orbitale, potentiel effectif : `../fondations-rotation-gravitation/`. Reprendre le canon de Newton pour comparer.
- Lentilles et réfraction : future page 25 (`../fondations-optique/`).
- Objets compacts, effondrement : `../09-supernova/` et future page 43·44.

## Moteur (à écrire et tester avant la page)

Bloc `/* GR-BEGIN */ … /* GR-END */`, objet `GR`. SI ; G, c, M☉, R☉, M⊕ = 5,972 × 10²⁴ kg, R⊕ = 6,371 × 10⁶ m, GM⊕ = 3,986 × 10¹⁴ m³/s².

- **Équivalence** : `cabin({mode: 'sol'|'fusée'|'chute'|'flotte', g}, dt)` → trajectoires d'une balle lâchée et d'un rayon lumineux dans la cabine (la lumière se courbe de g t²/2 dans la cabine accélérée).
- **Horloges** : `gravRate(r, M)` = √(1 − r_s/r) ; `weakRate(h, g)` ≈ 1 + gh/c² ; `gpsBudget({rOrbit})` → décalages gravitationnel, cinématique, total (µs/jour) et erreur de position accumulée si non corrigée ; `poundRebka(h)` = gh/c².
- **Géodésiques de Schwarzschild** : `rs(M)` ; `orbitStep(s, M, dt)` (particule massive : équation u″ + u = GM/h² + 3GMu²/c² en φ, ou intégration en temps propre ; documenter le choix) ; `photonPath(b, M)` (u″ + u = 3GMu²/c²) ; `deflection(b, M)` (numérique, à comparer à 4GM/(c²b)) ; `precession(a, e, M)` (avance du périhélie par orbite, 6πGM/(c²a(1 − e²))) ; `effPotential(r, L, M, massive)`.
- **Horizon** : `infall(r0, M)` → r(τ) temps propre et r(t) temps lointain d'une sonde lâchée ; `redshiftFactor(r, M)` ; `isco(M)` = 3 r_s ; `photonSphere(M)` = 1,5 r_s ; `embedding(r, M)` (paraboloïde de Flamm pour le dessin, avec l'avertissement sur l'image).

### Tests du moteur

1. r_s du Soleil = 2,953 km ; de la Terre = 8,87 mm.
2. GPS (rayon 26 560 km) : gravitation +45,7 µs/jour, vitesse −7,2 µs/jour, total +38,5 µs/jour (à 0,2) ; erreur de position c × 38,5 µs ≈ 11,5 km/jour.
3. Pound-Rebka, h = 22,5 m : Δf/f = 2,46 × 10⁻¹⁵.
4. Déviation de la lumière au bord du Soleil : 1,75″ (numérique contre 4GM/(c²b) à 1 %) ; deux fois la valeur « newtonienne » 2GM/(c²b).
5. Mercure (a = 5,79 × 10¹⁰ m, e = 0,2056, période 88 j) : avance du périhélie ≈ 43″ par siècle ; l'intégration numérique de l'orbite donne la même avance à 2 %.
6. Orbites : circulaires stables pour r > 3 r_s, instables entre 1,5 et 3 r_s ; un photon à r = 1,5 r_s tourne en cercle (instable).
7. Chute radiale depuis 10 r_s : le temps propre jusqu'à r_s est fini ; le temps lointain diverge (croissance logarithmique près de r_s) ; le facteur de décalage tend vers 0.
8. Limite faible : à grande distance, les orbites et la déviation rejoignent la mécanique newtonienne (sauf le facteur 2 de la lumière) à 10⁻⁶ près pour r = 10⁶ r_s.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| lignes d'univers, horloges | comme dans la page 46 (les reprendre) |
| gravité newtonienne (comparaison) | tireté `--texte-2` |
| prédiction relativiste | trait `--accent` |
| rayon lumineux | `--energie` |
| horizon | disque noir pur, liseré `--accent` à r_s ; sphère de photons tiretée à 1,5 r_s ; dernière orbite stable pointillée à 3 r_s |
| décalage vers le rouge | la couleur d'une sonde glisse vers le rouge puis s'éteint |

## Chapitre · Module 47 · Fondations de la relativité générale

### Étape 1 · Le principe d'équivalence
- Scène : deux cabines sans fenêtre côte à côte, chacune avec une personne, une balle et un laser horizontal. Sélecteur de situation pour chaque cabine : « posée sur la Terre », « fusée à 1 g dans l'espace », « en chute libre », « flottant loin de tout ». L'étudiant lâche la balle et allume le laser : dans les deux premières situations, la balle tombe pareil et le faisceau s'incurve (exagéré à l'écran, valeur réelle affichée) ; dans les deux dernières, tout flotte et le faisceau est droit. Bouton « Ouvrir les fenêtres » : on découvre où sont les cabines.
- Contrôles : situation de chaque cabine, g, bouton « Lâcher », bouton « Laser ».
- Panneau : chute de la balle et déviation du faisceau sur la largeur de la cabine (pour 3 m : ≈ 5 × 10⁻¹⁶ m à 1 g, valeur à recalculer). Statut avant l'ouverture des fenêtres : « Peux-tu dire laquelle est sur Terre ? ». Après : « Aucune expérience locale ne distingue la gravité d'une accélération. Si la lumière se courbe dans la fusée, elle se courbe aussi sur Terre ».
- Phrase-clé : « Localement, la gravité est indiscernable d'une accélération, et la chute libre l'annule. C'est le point de départ de la relativité générale. »
- Note : déviation de la lumière énormément exagérée ; cabine assez petite pour que le champ y soit uniforme (sinon les effets de marée trahissent la gravité : le dire).

### Étape 2 · La gravité ralentit le temps (moment fort)
- Scène : la Terre et un empilement d'horloges à différentes altitudes (sol, sommet d'une tour, avion, ISS, GPS, orbite géostationnaire), chacune avec son aiguille ; une horloge de référence « très loin ». Les aiguilles divergent sur un temps accéléré (affiché en µs/jour). Encart GPS : un satellite et un récepteur au sol ; bascule « Correction relativiste » : sans elle, la position calculée dérive sur une carte de plus de 10 km par jour.
- Contrôles : altitude d'une horloge mobile (glisser, de 0 à 40 000 km), bascule « Effet de la vitesse » (cumuler la dilatation du module 46), bascule correction GPS.
- Panneau : décalage gravitationnel, décalage de vitesse, total (µs/jour), erreur de position du GPS. Statuts : « Plus haut, l'horloge bat plus vite : +45 µs par jour pour un satellite GPS » ; avec la vitesse « La vitesse ralentit l'horloge de 7 µs par jour : le bilan est +38 µs » ; sans correction « En une journée, le GPS se tromperait d'environ 11 km ».
- Phrase-clé : « Plus on est bas dans un champ de gravité, plus le temps propre s'écoule lentement. Ce n'est pas une illusion : le GPS ne fonctionne que parce qu'on le corrige. »
- Note : champ faible et Terre sans rotation pour les calculs ; expérience de Pound-Rebka citée dans l'explication.

### Étape 3 · Géodésiques et courbure
- Scène A (défaut) : un astre central ; un canon (repris de la fondation 13) tire des projectiles et un rayon lumineux. Comparaison newtonienne (tiretée) et relativiste (`--accent`) : en champ faible elles coïncident pour les projectiles, la lumière dévie deux fois plus que la valeur « newtonienne ». Bascule « Mercure » : une orbite elliptique très exagérée dont le périhélie avance à chaque tour.
- Scène B (bascule « Image du drap ») : la surface de Flamm, avec des géodésiques tracées dessus, et l'avertissement à l'écran : « Cette image ne montre que la courbure de l'espace, et se sert de la gravité pour l'expliquer. La plupart de ce qui fait tomber une pomme vient du ralentissement du temps (étape 2) ».
- Contrôles : masse de l'astre (préréglages Soleil, étoile à neutrons), paramètre d'impact du rayon, bascule « Exagérer » (masse compacte pour voir l'effet).
- Panneau : déviation (secondes d'arc), avance du périhélie (secondes d'arc par siècle pour Mercure), r_s de l'astre. Statut : « 1,75 seconde d'arc au bord du Soleil : mesuré pendant l'éclipse de 1919 ». Mini-scène « lentille » : une galaxie lointaine dont l'image est dédoublée ou étirée en arc par une masse au premier plan.
- Phrase-clé : « Les corps en chute libre et la lumière suivent des géodésiques, les trajectoires les plus droites possibles dans un espace-temps courbé par la masse. »
- Note : orbites de Schwarzschild (astre sphérique, sans rotation) ; image du drap limitée.

### Étape 4 · Les horizons (moment fort)
- Scène : un trou noir (disque noir, r_s) avec la sphère de photons et la dernière orbite stable. On lâche une sonde lumineuse qui émet des impulsions régulières : deux vues synchronisées, « vue par la sonde » (elle franchit l'horizon en un temps fini, rien de spécial à l'instant du passage) et « vue de loin » (les impulsions arrivent de plus en plus espacées, de plus en plus rouges, la sonde semble se figer et s'éteindre). On peut aussi placer des orbites : stable au-delà de 3 r_s, plongeante en dessous.
- Contrôles : masse du trou noir (préréglages « 10 M☉ », « Sagittarius A* 4 × 10⁶ M☉ »), rayon de départ de la sonde, bouton « Lâcher », bouton « Mettre en orbite » (r choisi).
- Panneau : r_s (km), temps propre de chute, temps lointain, décalage vers le rouge des impulsions, effets de marée sur la sonde (différence d'accélération sur 2 m : énorme pour 10 M☉, faible pour Sgr A* à l'horizon). Statuts : « Pour la sonde, l'horizon n'est qu'un endroit : on le franchit sans rien sentir de particulier si le trou noir est assez gros » ; vue de loin « On ne la voit jamais entrer : sa lumière met de plus en plus longtemps à sortir ».
- Phrase-clé : « Un horizon est une surface d'où même la lumière ne ressort pas ; pour une masse M, son rayon vaut r_s = 2GM/c², environ 3 km par masse solaire. »
- Fin de planche, trois questions ouvertes : **Cosmos** « Si l'espace-temps peut se courber, peut-il aussi s'étirer tout entier ? » → module 45 ; **Ondes** « Deux trous noirs qui tournent l'un autour de l'autre font-ils vibrer l'espace-temps ? » → Atlas (ondes gravitationnelles, binaire compact) ; **Quantique** « Que se passe-t-il à l'horizon quand on tient compte de la mécanique quantique ? » → seulement introduit (rayonnement de Hawking).

## Micro-interactions de découverte

Cabine, balle, faisceau, fenêtre, horloge, satellite GPS, récepteur, canon, géodésique, périhélie, surface de Flamm, lentille, horizon, sphère de photons, dernière orbite stable, sonde, impulsion.

## `window.__labo` (en plus du socle)

`setCabin(i, mode)`, `drop()`, `laser()`, `openWindows()` (1) ; `setAltitude(h)`, `velocity(on)`, `gpsCorrection(on)` (2) ; `setMass(M)`, `setImpact(b)`, `mercury(on)`, `sheet(on)` (3) ; `setBH(M)`, `dropProbe(r0)`, `orbit(r)` (4).

## Théorie (explication, module 47)

- Relations : \(r_s = \dfrac{2GM}{c^2}\) ; \(\dfrac{\dd\tau}{\dd t} = \sqrt{1 - \dfrac{r_s}{r}} \approx 1 - \dfrac{GM}{rc^2}\) ; champ faible \(\dfrac{\Delta f}{f} \approx \dfrac{g\,h}{c^2}\) ; \(\delta = \dfrac{4GM}{c^2 b}\) ; avance du périhélie \(\Delta\varphi = \dfrac{6\pi GM}{c^2 a (1 - e^2)}\) par orbite.
- Exemple chiffré possible : le budget du GPS (gravitation, vitesse, total, erreur de position), ou la dérive d'une horloge entre le rez-de-chaussée et le sommet d'une tour de 300 m sur une vie de 80 ans.
- Pièges : « en orbite il n'y a pas de gravité » (il y en a presque autant qu'au sol, on est en chute libre) ; « le trou noir aspire tout » (loin de lui, il attire comme n'importe quelle masse) ; « l'image du drap explique la gravité » ; « le temps ralentit seulement pour l'observateur lointain, ce n'est qu'une apparence » ; « franchir l'horizon, c'est être arrêté net ».
- Où ça resservira : 45 (expansion, facteur d'échelle), 44 (étoiles compactes), 25 (lentilles), Atlas : trou noir, lentille gravitationnelle, binaire compact, disque d'accrétion, ondes gravitationnelles.
- Seulement introduit ici : équations d'Einstein, tenseurs, trous noirs en rotation (Kerr), ondes gravitationnelles, rayonnement de Hawking.

## Honnêteté

Métrique de Schwarzschild (astre sphérique, sans rotation) ; déviations exagérées à l'écran avec les valeurs réelles affichées ; image du drap signalée comme trompeuse ; calculs GPS en champ faible.

## Hors champ

Cosmologie (45), ondes gravitationnelles en détail, tests de précision, gravité quantique.
