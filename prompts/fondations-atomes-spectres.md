# Fondations · Atomes, noyaux, photons et spectres (modules 26 et 27)

Dossier de sortie : `opus-sonnet/fondations-atomes-spectres/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 26 · 27`, titre « Atomes, noyaux et *lumière* ». Accent : `--accent: #e9b6ff;` (orchidée pâle). Budget : ≈ 1,2 ADN, un `index.html` de l'ordre de 130 à 160 Ko, **deux chapitres : 26 (4 étapes) et 27 (3 étapes)**.

Elle ouvre la branche E · Atomes, chimie et noyaux. Elle prépare 28 (liaisons), 43 (corps noir), 44 (fusion et nucléosynthèse), 48 (quantique), et retire à la planche *Supernova* une partie de la théorie qu'elle porte seule (énergie de liaison).

## Intention

À la fin, l'étudiant voit **un atome comme un noyau minuscule et massif entouré d'électrons dont l'énergie ne peut prendre que certaines valeurs**, et il sait lire deux conséquences : l'énergie des noyaux (fusion, fission, radioactivité) et la lumière des atomes (spectres de raies, photons). Intuitions à rendre évidentes, par ordre de priorité :

1. L'atome est presque vide : presque toute la masse tient dans un noyau 10⁴ à 10⁵ fois plus petit que lui. On l'a découvert en tirant dessus (étape 1, moment fort).
2. L'énergie de liaison par nucléon culmine vers le fer : fusionner des noyaux légers ou casser des noyaux lourds libère de l'énergie, et cette énergie se lit dans un défaut de masse (étape 3).
3. Un atome n'absorbe et n'émet que des photons d'énergies précises, celles des écarts entre ses niveaux : chaque élément a son code-barres de raies (étapes 5 et 6, moment fort).
4. La lumière échange son énergie par paquets : sous un certain seuil de fréquence, aucune intensité n'arrache d'électron (étape 7).
5. Un noyau instable se transforme au hasard, sans mémoire, en changeant d'élément (étape 4).

Interdits : « les électrons tournent sur des orbites comme des planètes » (le modèle de Bohr est montré comme une échelle d'énergies, pas comme un système solaire ; les niveaux sont dessinés en barres horizontales, les électrons en nuage) ; « le noyau veut être stable ».

## Réutilisation (ne pas reconstruire)

- Décroissance exponentielle, demi-vie, désintégration aléatoire : `../fondations-systemes-hasard/` (toy désintégration). L'étape 4 renvoie à ce toy pour la courbe et se concentre sur ce qui change dans le noyau.
- Force de Coulomb, énergie potentielle électrique : `../04-champ-electrique/`. Énergie, E = mc² : `../fondations-relativite-restreinte/`.
- Spectre électromagnétique, E = hf, `visibleColor` : `../fondations-onde-electromagnetique/` (module 24).
- Couches d'une étoile massive, fer, effondrement : `../09-supernova/`. Renvoi depuis l'étape 3.

## Moteur (à écrire et tester avant la page)

Bloc `/* ATOM-BEGIN */ … /* ATOM-END */`, objet `Atom`. Énergies en MeV (noyaux) et eV (atomes), longueurs en fm et nm.

- **Diffusion de Rutherford** : `rutherfordTraj(E_MeV, Z, b_fm, dt)` (intégration de la trajectoire coulombienne d'une particule α, conservation de l'énergie) ; `thomsonDeflect(E, Z, b)` (modèle de Thomson : charge positive répartie dans une sphère de rayon atomique, déviation faible) ; `rutherfordAngle(E, Z, b)` analytique ; `closestApproach(E, Z)`.
- **Noyaux** : `NUCLIDES` : table des nucléides de Z = 1 à 26 (au moins tous les stables, et les instables de demi-vie > 1 ms), plus quelques nucléides repères hors de cette plage (⁶⁰Co, ¹³¹I, ²²²Rn, ²³⁵U, ²³⁸U), avec `{Z, N, symbol, name, halfLife, mode}` où mode ∈ stable, β⁻, β⁺/CE, α, p, n ; **recopiée d'une source de référence (NUBASE2020 ou NNDC), source citée en commentaire**. `BA_DATA` : B/A mesurées pour une vingtaine de nucléides repères (²H, ³He, ⁴He, ⁶Li, ¹²C, ¹⁶O, ²⁰Ne, ⁴⁰Ca, ⁵⁶Fe, ⁶²Ni, ⁹⁰Zr, ¹²⁰Sn, ¹⁹⁷Au, ²⁰⁸Pb, ²³⁵U, ²³⁸U). `semf(Z, A)` (formule de Weizsäcker, coefficients documentés) pour la courbe continue et la vallée de stabilité ; `qValue(reactants, products)`.
- **Désintégration** : `decaySample(n, halfLife, rng, dt)` ; `transmute(Z, N, mode)` ; `attenuate(kind, material, thickness)` (portée α, β ; atténuation exponentielle γ avec coefficient documenté).
- **Hydrogène et raies** : `hLevel(n)` = −13,606/n² eV ; `hLine(n1, n2)` (Rydberg, longueur d'onde dans le vide et dans l'air) ; `LINES` : raies visibles les plus intenses de H, He, Na, Hg, Ne (longueurs d'onde dans l'air, intensités relatives, source citée) ; `absorb(E_photon, levels, tol)`.
- **Effet photoélectrique** : `WORK` (Na, K, Zn, Cu : valeurs typiques, source citée) ; `photo(lambda_nm, metal)` → `{Kmax_eV, Vstop}` ; `ejectionRate(intensity, lambda, metal)` (∝ nombre de photons si hf > W, 0 sinon).

### Tests du moteur

1. Rutherford : énergie conservée à 10⁻⁶ sur la trajectoire ; angle numérique = 2 arctan(d/(2b)) à 0,5 % ; distance minimale frontale pour α de 5 MeV sur l'or : 45,5 fm.
2. Histogramme de 200 000 tirs à b uniforme dans le disque : dN/dΩ ∝ 1/sin⁴(θ/2) entre 10° et 150° (χ² raisonnable) ; modèle de Thomson : aucune déviation au-delà de 1° sur 200 000 tirs.
3. ⁴He : défaut de masse 0,030 38 u → 28,30 MeV, B/A = 7,07 MeV.
4. `semf` : B/A de ⁵⁶Fe, ¹²⁰Sn, ²⁰⁸Pb, ²³⁸U à 1,5 % des valeurs mesurées ; maximum de la courbe mesurée vers A ≈ 56 à 62.
5. `NUCLIDES` : ¹²C, ¹³C, ¹⁴N, ¹⁶O stables ; ¹⁴C β⁻ 5 700 a ; ³H β⁻ 12,32 a ; ¹⁸F β⁺ 109,7 min ; ⁶⁰Co β⁻ 5,27 a ; ¹³¹I β⁻ 8,02 j ; ²²²Rn α 3,82 j ; ²³⁸U α 4,47 × 10⁹ a ; ⁸Be instable (α, ≈ 10⁻¹⁶ s).
6. `transmute` : β⁻ (Z+1, N−1), β⁺ (Z−1, N+1), α (Z−2, N−2) ; A conservé en β.
7. Hydrogène : Hα 656,28 nm dans l'air (656,47 nm dans le vide), Hβ 486,13, Hγ 434,05, Hδ 410,17 nm à 0,02 nm ; énergie d'ionisation 13,6 eV.
8. `absorb` : un photon de 10,2 eV est absorbé (1 → 2) ; 11,0 eV ne l'est pas ; 14 eV ionise (électron libre de 0,4 eV).
9. Photoélectrique, sodium (W ≈ 2,28 eV) : 400 nm → Kmax ≈ 0,82 eV ; 600 nm (2,07 eV) → aucune émission quelle que soit l'intensité ; pente Vstop(f) = h/e = 4,136 × 10⁻¹⁵ V·s.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| proton | `--positif`, disque plein ; neutron : `--texte-2`, disque plein ; électron : `--negatif`, petit point, ou nuage `--negatif` à faible opacité |
| particule α | deux protons et deux neutrons accolés, traînée `--positif` |
| énergie de liaison, énergie libérée, photon émis | `--energie` |
| photons de lumière visible | leur couleur (`visibleColor`) ; hors visible : `--accent` |
| niveaux d'énergie | barres horizontales `--texte-2`, niveau occupé souligné `--accent` |
| vallée de stabilité, nucléides stables | carrés `--texte` ; β⁻ `--negatif` à 60 %, β⁺ `--positif` à 60 %, α `--energie` à 60 % |

## Chapitre 1 · Module 26 · Architecture atomique et nucléaire

### Étape 1 · Tirer sur une feuille d'or (moment fort)
- Scène : expérience de Geiger et Marsden vue de dessus ; une source de particules α, une feuille d'or vue en coupe comme une rangée d'atomes, un écran circulaire de scintillation tout autour où chaque impact laisse un éclat qui s'estompe. Bascule de modèle : « Thomson (charge positive étalée) » / « Rutherford (noyau concentré) ». Loupe sur un atome : trajectoires α hyperboliques autour du noyau, dessinées à l'échelle du noyau (fm).
- Contrôles : énergie des α (2 à 8 MeV), cadence de tir, bouton « Rejouer 10 000 tirs d'un coup ».
- Panneau : compteurs par tranche d'angle, histogramme log de l'angle de déviation comparé à la courbe 1/sin⁴(θ/2) (tiretée) ; fraction déviée au-delà de 90°. Statut en mode Rutherford, au premier α qui revient : « Comme un obus de 15 pouces qui rebondirait sur une feuille de papier (Rutherford) : la charge positive est concentrée dans un tout petit noyau ».
- Bascule « Échelles » : zoom continu atome → noyau, avec comparaison (si le noyau était une bille de 1 cm, l'atome ferait plusieurs centaines de mètres).
- Phrase-clé : « L'atome est presque vide. Toute sa charge positive et presque toute sa masse tiennent dans un noyau 10⁴ à 10⁵ fois plus petit que lui. »
- Note : feuille d'or d'une seule épaisseur d'atome ; écran sans perte ; électrons de l'atome ignorés dans la déviation.

### Étape 2 · Protons, neutrons, isotopes
- Scène : à gauche, un noyau qu'on construit (boutons + p, − p, + n, − n), dessiné comme un amas compact de nucléons ; le nom de l'élément et du nucléide (⁴He, ¹²C, ¹⁴C…) s'affichent. À droite, la **carte des nucléides** (N en abscisse, Z en ordonnée) jusqu'à Z = 26, la case courante soulignée ; la vallée de stabilité apparaît en traçant au fur et à mesure les nucléides visités (option « Tout montrer »).
- Contrôles : les quatre boutons, sélecteur « aller à un élément ».
- Panneau : Z, N, A, nom, stable ou mode de désintégration et demi-vie, rapport N/Z. Statuts : en ajoutant des neutrons à ¹²C : « ¹³C est stable, ¹⁴C se désintègre (5 700 ans) : même élément, autre isotope » ; trop de protons : « Trop de protons pour ce nombre de neutrons : la répulsion électrique l'emporte ».
- Phrase-clé : « Le nombre de protons fait l'élément ; le nombre de neutrons fait l'isotope. Seules certaines combinaisons sont stables : une vallée étroite sur la carte. »
- Note : nucléons dessinés comme des billes, sans structure en couches.

### Étape 3 · Énergie de liaison
- Scène : la courbe B/A en fonction de A (points mesurés `BA_DATA` sur la courbe `semf`), le fer au sommet. Au-dessus, une balance : à gauche les nucléons séparés, à droite le noyau formé, **plus léger** ; la différence de masse est convertie en énergie (barre `--energie`).
- Contrôles : choix d'une réaction : « fusion ²H + ³H → ⁴He + n », « fusion de l'hélium : 3 ⁴He → ¹²C », « fission ²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3 n », ou « construire » (choisir deux noyaux légers à fusionner, ou un lourd à couper). Une flèche montre le déplacement sur la courbe : vers le haut = énergie libérée.
- Panneau : masses (u), défaut de masse, Q (MeV), énergie par kilogramme de combustible comparée à la combustion du méthane (≈ 50 MJ/kg). Statut fusion : « On monte sur la courbe : les produits sont plus liés, la différence part en énergie » ; tenter de fusionner deux noyaux de fer : « Au-delà du fer, fusionner coûte de l'énergie : c'est ce qui condamne le cœur d'une étoile massive » → lien vers `../09-supernova/`.
- Phrase-clé : « Un noyau pèse moins que ses nucléons séparés. Monter sur la courbe de l'énergie de liaison, par fusion ou par fission, libère cette différence : E = Δm c². »
- Note : formule semi-empirique pour la courbe continue, valeurs mesurées pour les points.

### Étape 4 · Radioactivité
- Scène : un échantillon de 400 noyaux d'un nucléide choisi, en grille ; chacun se désintègre au hasard (éclat, puis il prend la couleur du nucléide fils) ; à côté, la carte des nucléides montre la flèche de transmutation (pour un nucléide au-delà de Z = 26, une mini-carte locale de 5 × 5 cases autour de lui). Sous-scène : trois écrans (papier, aluminium 5 mm, plomb 5 cm) et trois faisceaux α, β, γ : qui passe.
- Contrôles : nucléide (« ¹⁴C », « ³H », « ¹⁸F », « ¹³¹I », « ⁶⁰Co », « ²²²Rn »), accélération du temps adaptée à la demi-vie, bouton « Suivre un noyau » (il a la même chance de se désintégrer à chaque instant, quel que soit son âge).
- Panneau : noyaux restants, activité (désintégrations par seconde réelle), demi-vie, courbe N(t) (renvoi au toy de *Systèmes, croissance et hasard*). Statut : « Le noyau suivi est vieux de trois demi-vies, et il n'a pas plus de chances de se désintégrer qu'au premier jour ».
- Phrase-clé : « Un noyau instable se transforme au hasard, sans mémoire, en un autre élément. Ce qui sort (α, β, γ) dit ce qui a changé dans le noyau. »
- Note : pas de chaînes complètes ; fils supposés stables sauf mention.

## Chapitre 2 · Module 27 · Quantification, photons et spectres

### Étape 5 · Une échelle d'énergies (moment fort)
- Scène : l'atome d'hydrogène représenté par son **échelle de niveaux** (barres horizontales n = 1 à 6, et le continuum au-dessus de 0 eV), avec à côté le nuage électronique de l'état occupé (taille ∝ n²). Un canon à photons dont on règle l'énergie ; le photon traverse l'atome : absorbé seulement si son énergie égale un écart (l'électron saute, le nuage grossit), sinon il passe. L'électron excité retombe au bout d'un temps aléatoire en émettant un ou plusieurs photons (cascade), dessinés de leur couleur.
- Contrôles : énergie du photon (0 à 15 eV, curseur fin, « aimanté » près des transitions seulement si l'aide est activée), bouton « Lumière blanche » (photons de toutes énergies), bouton « Chauffer » (collisions qui excitent).
- Panneau : niveau occupé, énergie, transitions observées (liste), raies émises. Statuts : à 11 eV « Le photon passe : aucun écart ne vaut 11 eV » ; au-delà de 13,6 eV « Ionisation : l'électron est arraché ; le surplus devient son énergie cinétique ».
- Phrase-clé : « L'énergie d'un électron lié ne peut prendre que certaines valeurs. Il n'absorbe ou n'émet un photon que si l'énergie du photon égale exactement un écart entre deux niveaux. »
- Note : modèle de Bohr pour les énergies seulement ; les nuages sont schématiques (module 48 pour les orbitales).

### Étape 6 · Des raies comme des empreintes
- Scène : un tube à décharge rempli d'un gaz, qui luit ; sa lumière passe dans un prisme (reprend le rendu de 25) et donne un spectre d'**émission** (raies brillantes sur fond noir). Bascule « Absorption » : lumière blanche à travers le gaz froid → spectre continu barré de raies sombres **aux mêmes places**.
- Contrôles : gaz (H, He, Na, Hg, Ne), bascule émission / absorption, bouton « Gaz mystère » (un mélange tiré au hasard ; l'étudiant coche les éléments présents, la page corrige).
- Panneau : liste des raies (nm), transitions correspondantes pour H (série de Balmer : niveau d'arrivée n = 2), énergie des photons. Statut sur l'hélium : « L'hélium a été découvert dans le spectre du Soleil (1868) avant d'être trouvé sur Terre ».
- Phrase-clé : « Chaque élément a ses niveaux, donc ses raies. Le spectre d'une lumière dit de quoi est faite la matière qui l'a émise ou absorbée, même à des milliards de kilomètres. »
- Note : intensités relatives approximatives ; seulement les raies visibles les plus fortes.

### Étape 7 · Des paquets de lumière : l'effet photoélectrique
- Scène : une plaque de métal dans une ampoule vide, éclairée par une lampe dont on règle la couleur et l'intensité ; des électrons éjectés filent vers une électrode ; un ampèremètre et une tension de freinage réglable.
- Contrôles : λ (200 à 700 nm), intensité, métal (Na, K, Zn, Cu), tension de freinage.
- Panneau : énergie d'un photon, travail d'extraction W, Kmax, courant, tension d'arrêt. Graphe V_arrêt en fonction de f : une droite de pente h/e qui coupe l'axe au seuil f₀ = W/h ; chaque métal a sa droite parallèle.
- Statuts : sous le seuil, intensité au maximum « Aucun électron : ce n'est pas la quantité de lumière qui compte, c'est l'énergie de chaque paquet » ; au-dessus du seuil, intensité doublée « Deux fois plus d'électrons, pas plus rapides ».
- Phrase-clé : « La lumière cède son énergie par paquets, les photons : E = hf. Un seul photon arrache un électron, ou rien. »
- Fin de planche, trois questions ouvertes : **Molécules** « Que se passe-t-il quand deux atomes partagent leurs électrons ? » → module 28 ; **Étoiles** « D'où vient la lumière continue d'une étoile, et comment lit-on sa composition dans ses raies sombres ? » → modules 43 et 44 ; **Quantique** « Pourquoi l'énergie d'un électron lié est-elle quantifiée ? » → modules 48 et 49.

## Micro-interactions de découverte

Source α, feuille d'or, noyau, écran, proton, neutron, case de la carte, vallée, balance, réaction, échantillon, écrans papier / aluminium / plomb, niveau, nuage, photon, tube à décharge, raie, plaque, électrode, ampèremètre.

## `window.__labo` (en plus du socle)

`setModel(m)`, `burst(n)`, `setEalpha(E)` (1) ; `addNucleon(kind, ±1)`, `goElement(Z)` (2) ; `reaction(name)` (3) ; `setNuclide(id)`, `followOne()` (4) ; `firePhoton(eV)`, `white()`, `heat()` (5) ; `setGas(g)`, `absorption(on)`, `mystery()` (6) ; `setLambda(nm)`, `setMetal(m)`, `setStop(V)`, `setIntensity(x)` (7).

## Théorie (explication)

**Module 26.** Relations : \(A = Z + N\) ; \(E = \Delta m\,c^2\) avec \(1\ \text{u}\,c^2 = 931{,}494\ \text{MeV}\) ; \(B = (Z m_p + N m_n - m_{\text{noyau}})c^2\) ; \(N(t) = N_0\,2^{-t/t_{1/2}}\) et \(A = \lambda N\) ; \(r \approx 1{,}2\ \text{fm}\,A^{1/3}\). Exemple chiffré possible : énergie d'un gramme de deutérium-tritium fusionné comparée au méthane brûlé, ou datation au carbone 14. Pièges : « isotope = radioactif » ; « la masse se conserve dans une réaction nucléaire » ; « la demi-vie : la moitié de la vie d'un noyau » ; « la fission libère de l'énergie parce que le noyau éclate » (c'est parce que les fragments sont plus liés) ; « le rayonnement rend radioactif ».

**Module 27.** Relations : \(E = hf = hc/\lambda\) ; \(E_n = -13{,}6\ \text{eV}/n^2\) ; \(h f = |E_m - E_n|\) ; \(1/\lambda = R_H(1/n_1^2 - 1/n_2^2)\) ; \(K_{\max} = hf - W\). Exemple chiffré possible : raie Hα (transition 3 → 2), ou seuil photoélectrique du sodium. Pièges : orbites planétaires ; « une lumière plus intense éjecte des électrons plus rapides » ; « l'électron absorbe un photon de n'importe quelle énergie au-dessus de l'écart » (sauf ionisation) ; confondre raies d'émission et d'absorption ; « un photon = une petite bille dans l'onde » sans nuance.

Où ça resservira : 28 (couches électroniques et liaisons), 30 (énergie de réaction), 43 (corps noir, raies stellaires), 44 (fusion, nucléosynthèse), 48 (quantification expliquée), *Supernova* (énergie de liaison du fer).

Seulement introduit ici : force nucléaire forte, interaction faible (désintégration β), modèle en couches du noyau, orbitales et nombres quantiques, spectres moléculaires.

## Honnêteté

Échelles non respectées dans les vues d'ensemble (le noyau serait invisible) ; modèle de Bohr pour les énergies de l'hydrogène seulement ; formule semi-empirique pour la courbe ; tables recopiées de sources citées ; métal sans structure de bandes.

## Hors champ

Mécanique quantique de l'atome (48, 49), spin et principe de Pauli (50, seulement nommé pour les couches), réacteurs, armes, dosimétrie détaillée, quarks.
