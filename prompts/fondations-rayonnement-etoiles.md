# Fondations · Rayonnement thermique et étoiles (modules 43 et 44)

Dossier de sortie : `opus-sonnet/fondations-rayonnement-etoiles/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 43 · 44`, titre « La lumière et la vie des *étoiles* ». Accent : `--accent: #e2786b;` (la couleur `--astre` de l'accueil LABO en thème sombre). Budget : ≈ 1,2 ADN, **deux chapitres : 43 (3 étapes) et 44 (4 étapes)**.

Elle ouvre la branche I · Astrophysique. Elle retire à la planche *Supernova par effondrement du cœur* (`../09-supernova/`) la théorie qu'elle porte seule (structure en couches, fusion jusqu'au fer, équilibre de pression), et prépare une supernova v2, la collision d'étoiles à neutrons, la cosmologie (45).

Préalables conseillés : 13 (gravitation), 17 (gaz, pression, température), 19 (rayonnement introduit), 24 (spectre), 26 · 27 (fusion, énergie de liaison, raies).

## Intention

À la fin, l'étudiant sait que **tout objet chaud brille d'une lumière dont la couleur dit la température**, et qu'**une étoile est une boule de gaz en équilibre** : la gravité veut l'écraser, la pression du gaz chaud la retient, et la fusion au centre paie l'énergie qui s'échappe par la surface. Intuitions à rendre évidentes, par ordre de priorité :

1. Plus un corps est chaud, plus il brille (comme T⁴) et plus sa lumière tire vers le bleu (λ_max ∝ 1/T) ; la couleur d'une étoile est un thermomètre (étape 1, moment fort).
2. Une planète prend la température où ce qu'elle rayonne égale ce qu'elle reçoit ; sans effet de serre, la Terre serait à −18 °C (étape 3).
3. À chaque profondeur dans une étoile, la pression soutient le poids des couches au-dessus ; c'est un équilibre stable, qui se rétablit si on le perturbe (étape 4, moment fort).
4. La masse décide de tout : luminosité, durée de vie, fin. Une étoile dix fois plus massive que le Soleil vit environ trois cents fois moins longtemps (étape 6).
5. Les éléments dont nous sommes faits ont été fabriqués dans des étoiles (étape 7).

Interdits : « l'étoile brûle » (pas de combustion), « l'étoile veut s'effondrer ».

## Réutilisation (ne pas reconstruire)

- Spectre électromagnétique, intensité, 1/r² : `../fondations-onde-electromagnetique/` (module 24) ; reprendre `visibleColor`.
- Raies, niveaux, énergie de liaison, courbe B/A, fusion : `../fondations-atomes-spectres/` (modules 26 · 27). Les raies d'absorption d'une étoile sont évoquées à l'étape 1 avec un renvoi.
- Gaz parfait, pression, température : `../07-matiere-chaleur/`. Gravitation, potentiel, énergie : `../fondations-rotation-gravitation/`.
- Rayonnement thermique introduit : `../07-matiere-chaleur/` (acte IX).
- Fin d'une étoile massive : `../09-supernova/`. L'étape 7 y renvoie et ne refait pas l'effondrement.
- Marche aléatoire (photons qui sortent de l'étoile) : `../fondations-systemes-hasard/`.

## Moteur (à écrire et tester avant la page)

Bloc `/* STAR-BEGIN */ … /* STAR-END */`, objet `Star`. Constantes SI : h, c, k_B, σ = 5,670 374 × 10⁻⁸ W/(m²·K⁴), b = 2,897 772 × 10⁻³ m·K, G, M☉ = 1,989 × 10³⁰ kg, R☉ = 6,957 × 10⁸ m, L☉ = 3,828 × 10²⁶ W, T☉ = 5 772 K.

- **Corps noir** : `planck(lambda, T)` (luminance spectrale) ; `wien(T)` ; `stefan(T)` ; `bandFraction(T, l1, l2)` (fraction de la puissance dans une bande, intégration numérique) ; `bbColor(T)` (couleur perçue : intégration de Planck contre les fonctions colorimétriques CIE 1931 tabulées, puis sRGB, normalisée en luminance ; source des tables citée).
- **Étoiles** : `luminosity(R, T)` ; `radiusFrom(L, T)` ; `STARS` : une douzaine d'étoiles réelles (Soleil, Sirius A, Bételgeuse, Rigel, Proxima Centauri, Véga, Aldébaran, Antarès, Sirius B…) avec T_eff, R, L, masse, type, source citée.
- **Planète** : `eqTemp(S, albedo)` ; `greenhouse(S, albedo, layers, epsilon)` (modèle à couches atmosphériques d'émissivité ε).
- **Structure** : `laneEmden(n)` → profil θ(ξ), ξ₁, et constantes (ρ_c/ρ̄, P_c en unités de GM²/R⁴) ; `polytropeStar(M, R, n)` → ρ(r), P(r), T(r) (gaz parfait, μ documenté) ; `hydroColumn` (étape 4 : couches empilées, chacune en équilibre ; perturbation et oscillation amortie autour de l'équilibre).
- **Fusion et transport** : `ppRate(T, rho, X)` et `cnoRate(T, ...)` (lois de puissance documentées autour de 1,5 × 10⁷ K : ≈ T⁴ et ≈ T¹⁶ à T¹⁸) ; `ppEnergy` = 26,73 MeV par ⁴He ; `massLoss(L)` = L/c² ; `photonWalk({R, mfp}, rng)` (marche aléatoire, temps de sortie ∝ R²/(ℓ c)).
- **Évolution** : `mainSequence(M)` → L ∝ M^3,5, R ≈ M^0,8, T_eff, durée t ≈ 10¹⁰ ans × (M/M☉)^−2,5 (relations d'échelle documentées, valables à peu près entre 0,5 et 20 M☉) ; `fate(M)` (naine blanche sous ≈ 8 M☉ initiales, étoile à neutrons ou trou noir au-delà ; limite de Chandrasekhar 1,4 M☉) ; `ORIGIN` : origine dominante de chaque élément de Z = 1 à 92 (Big Bang, étoiles de faible masse, explosions d'étoiles massives, fusions d'étoiles à neutrons, rayons cosmiques), d'après le tableau de Johnson (2019), source citée.

### Tests du moteur

1. `wien(5 772)` = 502 nm ; `wien(310)` = 9,35 µm ; maximum numérique de `planck` = `wien` à 0,1 %.
2. ∫ planck dλ dΩ (π fois l'intégrale) = σT⁴ à 0,1 % pour T = 300, 5 772, 20 000 K.
3. Soleil : 4πR☉²σT☉⁴ = L☉ à 0,5 %.
4. `bbColor` : 1 500 K rouge-orangé, 5 800 K presque blanc, 10 000 K bleuté (vérifier le signe des écarts R − B).
5. `eqTemp(1 361, 0,30)` = 254,6 K (−18,6 °C) ; une couche parfaitement absorbante → 2^(1/4) × 254,6 = 302,8 K ; ε ≈ 0,78 → ≈ 288 K.
6. Lane-Emden n = 3 : ξ₁ = 6,897, ρ_c/ρ̄ = 54,18 ; P_c = 11,05 GM²/R⁴ (à 0,5 %) ; n = 1 : solution exacte sin ξ/ξ.
7. Masse perdue par le Soleil : L☉/c² = 4,26 × 10⁹ kg/s ; fraction de masse convertie dans pp = 0,71 %.
8. Marche aléatoire : temps de sortie moyen ∝ (R/ℓ)² à 5 % sur 3 tailles.
9. Séquence principale : M = 10 M☉ → durée ≈ 3 × 10⁷ ans (10^−2,5 ≈ 1/316) ; M = 0,5 M☉ → ≈ 5,7 × 10¹⁰ ans ; `fate(1)` naine blanche, `fate(20)` effondrement du cœur.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| corps noir, surface d'une étoile | sa couleur perçue (`bbColor`) |
| courbe de Planck | trait `--texte` ; bande visible coloriée en arc-en-ciel discret, IR et UV en `--accent` atténué |
| énergie produite, luminosité | `--energie` |
| pression | flèches vers l'extérieur `--positif` ; poids des couches : flèches vers le centre `--negatif` |
| hydrogène / hélium / carbone-oxygène / fer | quatre teintes désaturées, reprises de la planche 09 (lire ses couleurs et les garder) |
| photons qui errent | petits points `--energie` avec traînée brève |

## Chapitre 1 · Module 43 · Rayonnement thermique et corps noir

### Étape 1 · La couleur d'un corps chaud (moment fort)
- Scène : un objet (barre de métal, puis étoile) qu'on chauffe avec un curseur de température ; il passe du noir au rouge sombre, orange, blanc, bleuté. À côté, la courbe de Planck à la même échelle, qui grandit et glisse vers les courtes longueurs d'onde ; la fenêtre visible est marquée ; λ_max suivi par un repère. Une deuxième courbe « fantôme » garde la température précédente pour comparer.
- Contrôles : T (échelle log, 300 K à 40 000 K), préréglages (« corps humain 310 K », « braise 1 000 K », « filament 2 800 K », « Soleil 5 772 K », « Bételgeuse 3 600 K », « Rigel 12 000 K »), bascule « Échelle log » pour l'axe vertical.
- Panneau : T, λ_max, puissance émise par m² (σT⁴), fraction visible, couleur perçue. Statuts : à 310 K « Toi aussi tu brilles, mais dans l'infrarouge, vers 9 µm » ; T doublée « Le maximum se déplace de moitié, la puissance est multipliée par 16 ». Renvoi discret : « Les raies sombres dans le spectre du Soleil : module 27 ».
- Phrase-clé : « Tout corps chaud émet un spectre continu dont la forme ne dépend que de sa température : le maximum recule quand T monte (λ_max T = 2 898 µm·K) et la puissance croît comme T⁴. »
- Note : corps noir idéal ; les étoiles en sont proches, pas identiques.

### Étape 2 · Les étoiles, des thermomètres
- Scène : un ciel où l'on choisit deux étoiles réelles (`STARS`), dessinées côte à côte **à l'échelle de leur rayon** (avec un repère « Soleil » ; pour les géantes, l'échelle se réduit et le Soleil devient un point). Couleur = `bbColor(T_eff)`. À côté, un mini-diagramme T–L où les deux étoiles sont placées.
- Contrôles : étoile A, étoile B ; bascule « Même température, rayons différents » (deux étoiles fictives à 5 772 K, R et 10 R).
- Panneau : T, R, L (en L☉), L recalculée par 4πR²σT⁴. Statuts : Bételgeuse « Plus froide que le Soleil, mais environ 100 000 fois plus lumineuse : sa surface est immense » ; Sirius B « Plus chaude que le Soleil et pourtant très peu lumineuse : elle est de la taille de la Terre ».
- Phrase-clé : « La couleur d'une étoile donne sa température ; sa luminosité dépend aussi de sa taille : L = 4πR²σT⁴. »
- Note : rayons et luminosités tirés de catalogues cités ; certaines valeurs (Bételgeuse) sont incertaines.

### Étape 3 · L'équilibre d'une planète
- Scène : la Terre et le Soleil (pas à l'échelle, le dire) ; des flèches de lumière solaire entrantes (une partie réfléchie : albédo), des flèches infrarouges sortantes. Une jauge de température de surface qui monte ou descend jusqu'à l'équilibre. Bascule « Atmosphère » : une couche qui absorbe une partie de l'infrarouge et en renvoie la moitié vers le sol.
- Contrôles : albédo (0 à 0,9), distance au Soleil (Vénus, Terre, Mars), absorption de l'atmosphère ε (0 à 1).
- Panneau : flux reçu, flux absorbé, flux émis, température d'équilibre (K et °C). Statuts : sans atmosphère « −18 °C : ce que la Terre serait si elle rayonnait directement vers l'espace » ; ε ≈ 0,78 « ≈ 15 °C : l'atmosphère renvoie une partie de l'infrarouge vers le sol ».
- Phrase-clé : « Une planète se met à la température où ce qu'elle rayonne égale ce qu'elle absorbe. Une atmosphère qui absorbe l'infrarouge réchauffe la surface : c'est l'effet de serre. »
- Note : modèle à une couche, sans convection ni nuages, bilan moyen sur toute la planète.

## Chapitre 2 · Module 44 · Comment fonctionne une étoile

### Étape 4 · L'équilibre hydrostatique (moment fort)
- Scène : une étoile en coupe, découpée en couches concentriques. Pour une couche sélectionnée : flèche du poids des couches au-dessus (vers le centre) et flèche de la différence de pression (vers l'extérieur), égales. Profils P(r), ρ(r), T(r) du polytrope n = 3 à côté. Bouton « Comprimer » : on serre l'étoile, la pression gagne, elle rebondit et oscille autour de l'équilibre en s'amortissant. Bouton « Couper la pression » (expérience de pensée) : l'étoile s'effondre en un temps de chute libre (≈ 30 min pour le Soleil), renvoi à la supernova.
- Contrôles : masse et rayon de l'étoile (préréglage Soleil), couche sélectionnée (glisser), boutons ci-dessus.
- Panneau : pression centrale (Pa et en « atmosphères terrestres »), température centrale estimée, densité centrale, temps de chute libre. Statuts : « Au centre du Soleil, environ 10¹⁶ Pa et 15 millions de kelvins : la pression du gaz chaud y porte le poids de toute l'étoile ».
- Phrase-clé : « À chaque profondeur, la pression du gaz retient le poids des couches au-dessus : dP/dr = −ρ g. L'équilibre est stable : comprimée, l'étoile chauffe et repousse. »
- Note : polytrope n = 3 (le Soleil réel a une pression centrale environ deux fois plus grande) ; rotation et champ magnétique ignorés.

### Étape 5 · Fusion et transport de l'énergie
- Scène : coupe du Soleil : cœur (fusion), zone radiative, zone convective, photosphère. Au cœur, la chaîne proton-proton schématisée : 4 ¹H → ⁴He + 2 e⁺ + 2 ν, avec les neutrinos qui filent hors de l'étoile en 2 s. Dans la zone radiative, un photon fait une marche aléatoire (on le suit, compteur de pas et de temps). Dans la zone convective, des cellules qui montent et descendent.
- Contrôles : température centrale (± 20 %) pour voir la sensibilité du taux de fusion (pp et CNO), libre parcours moyen (échelle) pour la marche des photons.
- Panneau : énergie par réaction (26,7 MeV), masse convertie par seconde (4,3 millions de tonnes), taux pp et CNO relatifs, temps de sortie de l'énergie (de l'ordre de 10⁴ à 10⁵ ans selon les modèles). Statuts : température +10 % « pp ×1,5 environ, CNO ×5 environ : les étoiles plus massives, au cœur plus chaud, brûlent bien plus vite ». L'effet tunnel est nommé : « Deux protons se repoussent ; ils fusionnent quand même grâce à l'effet tunnel (module 49) ».
- Phrase-clé : « Au cœur, l'hydrogène fusionne en hélium ; la masse perdue part en énergie. Cette énergie met des dizaines de milliers d'années à sortir, de collision en collision, puis par convection. »
- Note : lois de puissance approximatives ; marche aléatoire à libre parcours constant.

### Étape 6 · La masse décide : le diagramme HR
- Scène : un diagramme de Hertzsprung-Russell (T décroissante vers la droite, L en log) ; un amas de 200 étoiles nées ensemble avec des masses tirées selon une fonction de masse documentée ; on fait avancer le temps (échelle log) : les plus massives quittent la séquence principale les premières, gonflent en géantes, disparaissent ; le « coude » de l'amas descend avec l'âge.
- Contrôles : âge de l'amas (log, 10⁶ à 10¹⁰ ans), bouton « Nouvel amas », clic sur une étoile pour suivre sa trajectoire.
- Panneau : masse, L, T, durée de vie de l'étoile suivie, âge de l'amas déduit du coude. Statut : « Dix fois plus massive, environ trois mille fois plus lumineuse : elle vide son réservoir trois cents fois plus vite ».
- Phrase-clé : « La masse d'une étoile fixe sa place sur la séquence principale, sa luminosité et sa durée de vie : les plus massives vivent vite et meurent jeunes. »
- Note : relations d'échelle approchées et trajectoires après la séquence principale schématiques.

### Étape 7 · Fins de vie et nucléosynthèse
- Scène : un curseur de masse initiale ; une frise de vie de l'étoile choisie (séquence principale → géante → nébuleuse planétaire et naine blanche, ou → supergéante en pelure d'oignon → effondrement du cœur, lien vers `../09-supernova/`). À côté, un tableau périodique colorié par origine (`ORIGIN`) ; survoler un élément donne son origine principale.
- Contrôles : masse initiale (0,5 à 40 M☉), bascule « Éléments du corps humain » (O, C, H, N, Ca, P, Fe… mis en évidence avec leur origine).
- Panneau : destin, masse du résidu, durée, éléments rendus au milieu interstellaire. Statut : « Le fer de ton sang vient en grande partie d'explosions d'étoiles ; l'or, en bonne partie de collisions d'étoiles à neutrons ».
- Phrase-clé : « Selon sa masse, une étoile finit en naine blanche ou s'effondre. Dans les deux cas, elle rend au gaz de la galaxie des éléments qu'elle a fabriqués : nous en sommes faits. »
- Fin de planche, trois questions ouvertes : **Gravité extrême** « Que devient l'espace-temps autour d'un résidu si compact que la lumière n'en sort plus ? » → module 47 ; **Univers** « Comment des étoiles se sont-elles formées, et comment mesure-t-on des distances jusqu'aux autres galaxies ? » → module 45 ; **Quantique** « Qu'est-ce qui empêche une naine blanche de s'effondrer, sans fusion ni chaleur ? » → modules 48 à 50 (pression de dégénérescence, seulement nommée).

## Micro-interactions de découverte

Courbe de Planck, λ_max, fenêtre visible, étoile, rayon, albédo, couche atmosphérique, couche de l'étoile, flèche de pression, flèche de poids, cœur, zone radiative, zone convective, photon, neutrino, séquence principale, géante, naine blanche, coude de l'amas, élément du tableau.

## `window.__labo` (en plus du socle)

`setT(T)`, `presetBody(name)`, `logScale(on)` (1) ; `setStars(a, b)`, `sameT(on)` (2) ; `setAlbedo(a)`, `setPlanet(p)`, `setEps(e)` (3) ; `setStar(M, R)`, `selectLayer(r)`, `squeeze()`, `cutPressure()` (4) ; `setTc(f)`, `setMfp(l)`, `followPhoton()` (5) ; `setAge(t)`, `newCluster()`, `follow(i)` (6) ; `setMass(M)`, `humanElements(on)` (7).

## Théorie (explication)

**Module 43.** Relations : loi de Planck \(B_\lambda(T) = \dfrac{2hc^2}{\lambda^5}\,\dfrac{1}{e^{hc/(\lambda k_B T)} - 1}\) ; \(\lambda_{\max} T = b\) ; \(M = \sigma T^4\) ; \(L = 4\pi R^2 \sigma T^4\) ; équilibre \(\tfrac{S}{4}(1 - A) = \sigma T^4\). Exemple chiffré possible : température d'équilibre de Mars ou de la Terre ; rayon de Bételgeuse à partir de L et T. Pièges : « les objets froids n'émettent pas » ; « les étoiles rouges sont plus chaudes (le rouge = chaud) » ; « plus lumineuse = plus chaude » ; « l'effet de serre piège la lumière du Soleil » (il ralentit la sortie de l'infrarouge) ; confondre spectre continu et spectre de raies.

**Module 44.** Relations : \(\dfrac{\dd P}{\dd r} = -\dfrac{G\,m(r)\,\rho(r)}{r^2}\) ; ordre de grandeur \(P_c \sim GM^2/R^4\) ; \(E = \Delta m\,c^2\) (pp : 26,7 MeV) ; \(L \propto M^{3{,}5}\), \(t \propto M/L \propto M^{-2{,}5}\) ; temps de chute libre \(t_{\text{ff}} \sim 1/\sqrt{G\bar\rho}\). Exemple chiffré possible : durée de vie du Soleil à partir de la masse d'hydrogène disponible au cœur et de L☉ ; ou pression centrale estimée. Pièges : « l'étoile brûle comme un feu » ; « la fusion se fait parce qu'il fait chaud, sans rien d'autre » (barrière coulombienne, effet tunnel) ; « la lumière émise aujourd'hui a été produite aujourd'hui au cœur » ; « les étoiles massives vivent plus longtemps parce qu'elles ont plus de carburant » ; « le Soleil finira en trou noir ».

Où ça resservira : 45 (formation des structures, distances), 47 (objets compacts), 49 (effet tunnel de la fusion), 26 · 27 (raies), planche 09, Atlas : séquence principale, géante rouge, naine blanche, supernova de type Ia, étoile à neutrons.

Seulement introduit ici : opacité et transfert radiatif, pression de dégénérescence, processus s et r, formation stellaire, binaires, variables.

## Honnêteté

Corps noirs idéaux ; couleurs perçues approchées ; planète à une couche ; étoile polytropique ; lois de puissance et relations d'échelle approchées ; trajectoires post-séquence principale schématiques ; origine des éléments d'après un tableau publié, simplifiée.

## Hors champ

Codes d'évolution stellaire, astérosismologie, magnétisme solaire, neutrinos solaires en détail, planètes extrasolaires, climat réel.
