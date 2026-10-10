# Fondations · Gravitation cosmique et formation des structures (module 45)

Dossier de sortie : `opus-sonnet/fondations-cosmologie/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 45`, titre « Un univers qui s'*étire* ». Accent : `--accent: #9c8cff;` (violet cosmique). Budget : ≈ 0,9 ADN, **un chapitre de 4 étapes**.

Préalables conseillés : 13 (gravitation, orbites), 15 (Doppler), 24 · 27 (spectres, raies), 43 · 44 (étoiles, luminosité), 47 (espace-temps qui se courbe). Elle ferme la branche I et la chaîne « Relativité et cosmologie » de `fondations.md`.

## Intention

À la fin, l'étudiant sait que **l'univers n'explose pas dans un espace vide : c'est l'espace lui-même qui s'étire**, que la lumière qui le traverse s'étire avec lui, qu'il contient beaucoup plus de masse qu'on n'en voit, et que la gravité a fait grandir de minuscules irrégularités en une toile de galaxies. Intuitions à rendre évidentes, par ordre de priorité :

1. Si tout s'étire uniformément, **chaque** galaxie voit les autres s'éloigner, d'autant plus vite qu'elles sont loin : la loi de Hubble, sans centre (étape 1, moment fort).
2. Le décalage vers le rouge cosmologique est un étirement de la longueur d'onde pendant le trajet : 1 + z dit de combien l'univers s'est étiré depuis l'émission. Regarder loin, c'est regarder tôt (étape 2).
3. Les étoiles au bord des galaxies tournent trop vite pour la masse visible : il y a une masse invisible, la matière noire (étape 3, moment fort).
4. La gravité amplifie les irrégularités : des régions un peu plus denses attirent la matière et deviennent des filaments et des amas, en laissant des vides (étape 4).

Interdits : « le Big Bang est une explosion en un point », « les galaxies fuient le centre », « la matière noire est un nuage de gaz sombre » (on dit : une masse qu'on détecte par sa gravité, de nature inconnue).

## Réutilisation (ne pas reconstruire)

- Vitesse circulaire, gravitation d'une distribution de masse : `../fondations-rotation-gravitation/` (v = √(GM/r)).
- Doppler : `../fondations-oscillations-ondes/` ; raies, spectre : futures pages 24 et 26 · 27. L'étape 2 montre que le décalage cosmologique n'est **pas** un Doppler ordinaire (le dire, sans entrer dans les détails).
- Luminosité, chandelles standard : future page 43 · 44 (L = 4πR²σT⁴ ; flux en 1/r², page 24).
- Courbure de l'espace-temps : future page 47.
- Exponentielle et retour à l'échelle : `../fondations-systemes-hasard/` (phase d'accélération).

## Moteur (à écrire et tester avant la page)

Bloc `/* COSMO-BEGIN */ … /* COSMO-END */`, objet `Cosmo`. Unités : Mpc, km/s, milliards d'années (Ga). H₀ = 70 km/s/Mpc par défaut (la page dit qu'elle est mesurée entre ≈ 67 et ≈ 73 selon les méthodes).

- **Expansion** : `scaleGrid(points, a)` (positions comobiles × a) ; `hubbleLaw(points, observerIndex, adot)` → vitesses relatives vues depuis n'importe quel point.
- **Modèle plat** : `friedmann({H0, Om, OL}, a)` → H(a) ; `age({H0, Om, OL})` ; `aOfT(t)` (tabulé) ; `lookback(z)`, `comovingDistance(z)`, `luminosityDistance(z)` ; `hubbleTime(H0)` = 1/H₀.
- **Lumière** : `stretch(lambdaEmit, aEmit, aObs)` ; `z(aEmit)` = 1/a − 1 ; `cmbTemp(z)` = 2,725 (1 + z) K.
- **Galaxie** : `rotationCurve(r, {Mdisk, Rdisk, halo: {rho0, rc}})` → vitesses disque seul, halo seul, total (disque exponentiel en approximation sphérique documentée, halo isotherme à cœur) ; `keplerFrom(Mvisible, r)`.
- **Structures** : simulation N corps 2D en coordonnées comobiles (`nbodyInit({N, amplitude, seed})`, `nbodyStep(s, da)`, adoucissement documenté, méthode particule-maille ou somme directe selon N) ; `densityField(s, grid)` ; `contrast(s)` (écart-type de la densité) ; bascule « sans matière noire » (masse totale réduite à la seule matière ordinaire).

### Tests du moteur

1. Grille étirée uniformément : depuis **chaque** point, v = H d à 10⁻¹² (vérifier sur 5 points différents).
2. 1/H₀ pour 70 km/s/Mpc = 13,97 Ga.
3. Âge, modèle plat Ωm = 0,3, ΩΛ = 0,7, H₀ = 70 : 13,47 Ga (formule analytique à 10⁻³) ; Ωm = 1, ΩΛ = 0 : 2/(3H₀) = 9,31 Ga.
4. `z(0,5)` = 1 ; une raie Hα émise à 656,3 nm et observée à z = 1 → 1 312,6 nm ; T du fond diffus à z = 1 100 : ≈ 3 000 K.
5. Distance de luminosité à faible z : ≈ cz/H₀ (à 1 % pour z = 0,01).
6. Courbe de rotation : disque seul → décroissance en 1/√r loin du disque ; disque + halo → plat à ±10 % entre 2 et 6 R_disk ; Voie lactée : ≈ 220 à 230 km/s à 8 kpc avec les paramètres par défaut.
7. N corps : quantité de mouvement totale conservée à 10⁻¹⁰ ; le contraste de densité croît avec a ; sans matière noire, il croît nettement moins vite sur la même durée.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| galaxies | petites spirales et ellipses `--texte` à luminance variable |
| grille comobile | traits fins `--trait` qui s'étirent |
| flèches de vitesse (vues depuis l'observateur) | `--accent` |
| photon, onde | couleur de sa longueur d'onde (`visibleColor`), qui glisse vers le rouge puis l'infrarouge (`--accent` atténué) |
| matière visible / matière noire | `--texte` / halo `--accent` à faible opacité |
| densité (étape 4) | carte de luminance `--fond` → `--accent` → `--texte` |

## Chapitre · Module 45 · Gravitation cosmique et formation des structures

### Étape 1 · L'expansion, sans centre (moment fort)
- Scène : une grille de galaxies (une centaine) dans un carré ; le temps fait grandir le facteur d'échelle a, toutes les distances sont multipliées par le même nombre. L'étudiant **clique sur n'importe quelle galaxie** pour se mettre à sa place : les flèches de vitesse sont redessinées depuis elle, et elles pointent toutes vers l'extérieur, plus longues pour les galaxies lointaines. Un graphe v en fonction de d se remplit : une droite de pente H.
- Contrôles : vitesse de l'expansion (H), bouton « Rejouer », clic pour changer d'observateur, bascule « Pain aux raisins » (vue 3D en coupe avec une métaphore explicitement nommée).
- Panneau : galaxie observatrice, H mesuré (pente de la droite), distances et vitesses de deux galaxies sélectionnées. Statuts : au premier changement d'observateur « Même résultat depuis ici : chaque galaxie se croit au centre, aucune ne l'est » ; « Deux fois plus loin, deux fois plus vite : v = H d ».
- Phrase-clé : « L'expansion est un étirement de l'espace, partout à la fois. Vue de n'importe quelle galaxie, les autres s'éloignent d'autant plus vite qu'elles sont loin : v = H₀ d. »
- Note : expansion uniforme en 2D ; les galaxies proches, liées par la gravité, ne s'éloignent pas (Andromède s'approche) : le dire.

### Étape 2 · La lumière étirée, le passé visible
- Scène : un photon qui part d'une galaxie lointaine et voyage vers nous sur la grille qui s'étire ; son onde est dessinée et s'allonge en route ; à l'arrivée, sa raie Hα est comparée à la même raie en laboratoire (bande de spectre). Une frise du temps en bas : moment d'émission, moment de réception, âge de l'univers à l'émission.
- Contrôles : décalage z de la source (0 à 10, puis préréglage « fond diffus cosmologique z ≈ 1 100 »), bascule « Regarder plus loin » (une série de galaxies de plus en plus lointaines, donc de plus en plus jeunes).
- Panneau : z, facteur d'étirement 1 + z, a à l'émission, temps de trajet de la lumière (lookback), âge de l'univers à l'émission, distance comobile. Statuts : z = 1 « La lumière est partie quand l'univers était deux fois plus petit ; elle a voyagé près de 8 milliards d'années » ; fond diffus « Une lumière émise à ≈ 3 000 K, étirée 1 100 fois : elle nous arrive en micro-ondes, à 2,7 K ».
- Phrase-clé : « Pendant son trajet, la longueur d'onde de la lumière s'étire avec l'espace : 1 + z = a_réception / a_émission. Plus la source est loin, plus sa lumière est ancienne. »
- Note : modèle plat (matière et constante cosmologique) aux paramètres affichés ; détails des distances seulement dans l'explication.

### Étape 3 · La masse qui manque (moment fort)
- Scène : une galaxie spirale vue de face qui tourne ; des étoiles témoins à différents rayons. À côté, la courbe de rotation : points « mesurés » (données de démonstration plates, avec la mention qu'elles imitent des mesures réelles) et prédiction à partir de la seule masse visible (qui décroît). Bascule « Ajouter un halo » : un halo invisible sphérique se dessine en transparence et la prédiction rejoint les mesures.
- Contrôles : masse visible du disque, masse et taille du halo, bascule halo.
- Panneau : vitesse à 2, 5, 10 et 20 kpc (prédite et « mesurée »), masse visible, masse totale nécessaire, rapport. Statuts : sans halo « Loin du centre, les étoiles tournent trop vite : avec la seule masse visible, elles seraient éjectées » ; avec halo « Il faut environ cinq fois plus de masse qu'on n'en voit ». Encart : budget de l'univers (≈ 5 % matière ordinaire, ≈ 27 % matière noire, ≈ 68 % énergie sombre), avec la mention que les deux derniers sont des noms pour des choses mal comprises.
- Phrase-clé : « Les vitesses de rotation des galaxies révèlent une masse invisible bien plus grande que la masse visible : la matière noire. On ne la voit que par sa gravité. »
- Note : galaxie idéalisée (disque + halo sphérique) ; autres indices (amas, lentilles, fond diffus) seulement cités.

### Étape 4 · La toile cosmique
- Scène : une boîte 2D de 4 000 particules en coordonnées comobiles, presque uniformes au départ (fluctuations de quelques pour cent). On fait avancer a : les surdensités attirent la matière, des filaments et des nœuds apparaissent, des vides se creusent. Carte de densité en fond, particules par-dessus. Bascule « Sans matière noire » : même départ, beaucoup moins de structure au même âge.
- Contrôles : amplitude des fluctuations initiales, bascule matière noire, bouton « Nouvelles conditions initiales ».
- Panneau : facteur d'échelle, contraste de densité, fraction de la masse dans les nœuds, taille des vides. Statut : « Une région à peine plus dense attire un peu plus : la différence grandit. La gravité amplifie les irrégularités ».
- Phrase-clé : « Les galaxies et leurs amas se sont formés par la croissance, sous la gravité, de minuscules irrégularités du début : la matière s'est rassemblée en filaments et en nœuds, autour de grands vides. »
- Fin de planche, trois questions ouvertes : **Origine** « D'où viennent les toutes premières irrégularités ? » → seulement introduit (inflation, fluctuations quantiques, modules 48 à 50) ; **Énergie sombre** « Pourquoi l'expansion accélère-t-elle depuis quelques milliards d'années ? » → seulement introduit ; **Lumière** « Que montre exactement le fond diffus cosmologique ? » → Atlas (fond diffus).

## Micro-interactions de découverte

Galaxie, observateur, flèche de vitesse, droite de Hubble, photon, raie Hα, frise du temps, fond diffus, étoile témoin, courbe de rotation, halo, filament, nœud, vide.

## `window.__labo` (en plus du socle)

`setH(H)`, `setObserver(i)`, `replay()`, `raisins(on)` (1) ; `setZ(z)`, `cmb()`, `deeper(on)` (2) ; `setDisk(M)`, `setHalo(M, rc)`, `halo(on)` (3) ; `setAmplitude(x)`, `darkMatter(on)`, `reseed()` (4).

## Théorie (explication, module 45)

- Relations : \(v = H_0\,d\) ; \(1 + z = \dfrac{\lambda_{\text{obs}}}{\lambda_{\text{ém}}} = \dfrac{a_0}{a}\) ; \(t_H = 1/H_0\) ; \(H^2(a) = H_0^2\left(\Omega_m a^{-3} + \Omega_\Lambda\right)\) (modèle plat) ; \(v_c(r) = \sqrt{G M(\lt r)/r}\) ; \(T_{\text{CMB}}(z) = T_0(1 + z)\).
- Exemple chiffré possible : vitesse de récession d'une galaxie à 100 Mpc, temps de Hubble, ou masse de la Voie lactée dans 8 kpc à partir de v = 220 km/s.
- Pièges : « le Big Bang a eu lieu en un point de l'espace » ; « les galaxies s'éloignent dans l'espace comme des éclats » ; « le redshift cosmologique est un Doppler ordinaire » ; « tout s'étire, y compris les atomes et le système solaire » ; « la matière noire, c'est du gaz qu'on ne voit pas » ; « l'univers observable a un rayon de 13,8 milliards d'années-lumière ».
- Où ça resservira : 47 (espace-temps dynamique), 43 · 44 (formation des étoiles), Atlas : formation du système solaire, toile cosmique, fond diffus, lentilles.
- Seulement introduit ici : inflation, nucléosynthèse primordiale, équations de Friedmann en détail, énergie sombre, tension sur H₀.

## Honnêteté

Expansion uniforme en 2D ; modèle plat à deux composantes ; galaxie idéalisée ; données « mesurées » de démonstration (le dire) ; simulation N corps 2D, sans gaz ni formation d'étoiles.

## Hors champ

Cosmologie de précision, anisotropies du fond diffus, physique des particules du début, topologie de l'univers.
