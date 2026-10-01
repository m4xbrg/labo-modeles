# Fondations · Oscillations et ondes (modules 6, 14, 15)

Dossier de sortie : `opus-sonnet/fondations-oscillations-ondes/` (`index.html` + `explication.html`). Charte : `00-direction-artistique.md`, intégralement, avec les ajustements ci-dessous.

Accent : `--accent: #8fe3d1;` (vert d'eau pâle). Il sert à l'interface **et** à l'énergie potentielle (voir code couleur).

Budget : ≈ 1 ADN, c'est-à-dire une planche du gabarit des cinq autres (un `index.html` autonome de l'ordre de 70 à 100 Ko, un `explication.html`). Pas plus. Peu de curseurs : au plus deux par étape.

## Identité : la ligne « Fondations »

La série « L'invisible en mouvement » montre des phénomènes. La ligne **Fondations** montre le **langage** qui les décrit. Même charte, même structure de page, mais :

- surtitre : `Fondations — modules 6 · 14 · 15` (mono, petites capitales, comme `.serie`) ;
- titre : « Oscillations et *ondes* » ;
- une scène qui change de « paillasse » à chaque chapitre, mais un **même vocabulaire visuel** partout : le même petit cadran de phase (phaseur), le même oscilloscope déroulant, les mêmes rangées de mesures (A, f, T, φ) dans le panneau. L'étudiant doit reconnaître qu'il manipule chaque fois la même chose.

## Fil pédagogique

cycle → sinus → phase → oscillateur → échange d'énergie → amortissement → forçage → résonance → perturbation qui se propage → superposition → interférence → modes stationnaires → Doppler.

Deux moments forts, à soigner plus que tout le reste :
1. **B1** : l'énergie passe sans cesse du ressort (potentielle) à la masse (cinétique) et revient, la somme reste plate.
2. **D1** : deux ondes occupent la même corde ; leur somme renforce ou annule selon le déphasage, et le cadran de phase montre pourquoi (addition de deux flèches).

## Code couleur (convention de la série, étendue)

| Grandeur | Couleur |
|---|---|
| déplacement positif (x > 0, crête) | `--positif` |
| déplacement négatif (x < 0, creux) | `--negatif` |
| énergie cinétique Ec | `--energie` |
| énergie potentielle Ep | `--accent` |
| énergie totale | contour `--texte` |
| énergie dissipée (chaleur) | `--texte-2`, hachuré |
| oscillation / onde 1 | `--texte`, trait fin plein |
| oscillation / onde 2 | `--texte-2`, tireté |
| somme | `--texte`, trait fort |

La corde est dessinée en `--texte` ; chaque perle est teintée selon le signe de son déplacement (mélange vers `--positif` ou `--negatif` selon |y|), comme la cuve de la planche 05.

## Structure : quatre chapitres, dix étapes (stepper, pas une timeline)

Stepper groupé par chapitre (A, B, C, D) ; segments `A1 A2 | B1 B2 B3 | C1 C2 | D1 D2 D3`. L'animation tourne en continu dans une étape. Changement d'étape : fondu continu, jamais de saut. Les curseurs propres à une étape n'apparaissent que dans cette étape.

### A — Cercle, sinus et phase (module 6)

**A1. Un cycle.** À gauche, un cadran : un point tourne à vitesse angulaire constante ω = 2πf sur un cercle de rayon A. À droite, l'oscilloscope déroulant trace sa projection verticale y = A sin(ωt + φ) en fonction du temps (le temps défile vers la gauche, l'instant présent est au bord gauche du graphe, aligné horizontalement avec le point du cadran ; un trait fin horizontal relie le point à la tête de la trace). Une période T est marquée sur la trace par une accolade « T ». Sur le cadran, l'angle courant est un arc rempli : **la phase est une position dans le cycle**. Un « ruban de phase » sous le cadran (0° à 360°, avec repères 0, 90, 180, 270) montre un curseur qui avance puis revient à 0 à chaque tour. Curseur : f (0,25 à 2 Hz). Mesures : A, f, T = 1/f (mis à jour ensemble), phase courante en degrés.

**A2. Deux oscillations, un déphasage.** Un deuxième point (tireté) sur le même cadran, même f, en avance de Δφ. Deux traces sur l'oscilloscope. Le déphasage est montré trois fois : angle entre les deux rayons sur le cadran, décalage temporel Δt = (Δφ/360°)·T mesuré entre deux crêtes correspondantes sur l'oscilloscope (accolade « Δt »), et valeur en degrés. Mots-clés affichés aux valeurs remarquables : 0° « en phase », 90° « en quadrature », 180° « en opposition de phase ». Curseur : Δφ (0 à 360°, pas de 15°). Le curseur f de A1 reste disponible.

### B — Oscillateurs et résonance (module 14)

Modèle unique pour tout le chapitre (unités SI réelles, temps réel) :

    m ẍ = −k x − b ẋ + F0 cos(Ω t)

m = 0,5 kg, k = 20 N/m par défaut ⇒ ω0 = √(k/m) ≈ 6,32 rad/s, f0 ≈ 1,01 Hz. β = b/(2m). Intégration RK4, pas fixe 1/480 s, sous-pas multiples par image. **Jamais** de formule analytique substituée à la dynamique affichée (la courbe de résonance, elle, est analytique et sert de référence).

Scène : un ressort horizontal fixé à un mur à gauche, une masse sur un rail sans frottement (le rail est un trait fin). Le ressort est un hélicoïde dessiné (spires qui se serrent et s'écartent réellement avec x ; son épaisseur ne change pas). Position d'équilibre marquée par un tireté vertical. Flèche de force de rappel −kx sur la masse (longueur ∝ force). Sous la scène : l'oscilloscope déroulant de x(t), même dessin qu'au chapitre A. En incrustation, le **cadran de phase** devient le portrait de phase : point (x/A0, v/(ω0 A0)) ; en régime libre non amorti c'est **le même cercle qu'en A**, parcouru à ω0. Dire en une phrase : « le cercle du chapitre A, c'était déjà l'oscillateur ».

**B1. Échange d'énergie (moment fort).** Lâcher depuis x0 = 0,10 m (bouton « Lâcher » et glisser la masse à la souris/doigt pour choisir x0). Deux jauges verticales côte à côte : Ec = ½mv² (`--energie`), Ep = ½kx² (`--accent`), et une troisième, E = Ec + Ep, en contour : elle doit rester **plate** (dérive numérique < 0,1 % sur 60 s). Le ressort luit en `--accent` proportionnellement à Ep, la masse luit en `--energie` proportionnellement à Ec : on voit l'énergie « sauter » de l'un à l'autre deux fois par période. Petit graphe déroulant Ec(t), Ep(t) : deux sinusoïdes de fréquence 2f0 en opposition, somme horizontale. Curseurs : m (0,2 à 2 kg) et k (5 à 50 N/m) ; f0 et T0 affichés et cohérents (f0 = (1/2π)√(k/m)).

**B2. Amortissement.** Curseur β (0 à 1,5 s⁻¹, défaut 0,3) via b = 2mβ. Jauge supplémentaire « chaleur » (`--texte-2`, hachurée) qui accumule ∫ b v² dt : Ec + Ep + chaleur = E initiale (vérifier à 0,5 % près). Le portrait de phase devient une spirale (laisser une traîne). Enveloppe ±x0 e^(−βt) en tireté fin sur l'oscilloscope. Afficher le facteur de qualité Q = ω0/(2β) (Q = ∞ si β = 0) et la pseudo-période. Mentionner sur-amortissement en une ligne seulement (si β ≥ ω0 : retour sans osciller, autorisé par le curseur si on étend la plage jusqu'à 7 s⁻¹ ; sinon le dire dans l'explication).

**B3. Forçage et résonance.** Une main/piston discret à gauche ou une flèche de force périodique F0 cos(Ωt) appliquée à la masse (F0 = 0,2 N). Curseur Ω/ω0 (0,2 à 2,5, défaut 0,6) ; β fixé à 0,25 s⁻¹ (curseur β de B2 réutilisable). L'oscilloscope montre deux traces : la force (tireté `--texte-2`, échelle normalisée) et x(t). Le démarrage depuis le repos montre le **régime transitoire** puis le régime permanent. À droite de la scène, la **courbe de résonance** analytique

    A(Ω) = (F0/m) / √((ω0² − Ω²)² + (2βΩ)²)

avec un point qui marque Ω courant à la hauteur **mesurée** (amplitude crête de x sur le dernier cycle complet) : le point mesuré rejoint la courbe quand le transitoire s'éteint. Afficher aussi le retard de phase de x sur la force, δ = atan2(2βΩ, ω0² − Ω²) : ≈ 0° bien en dessous, 90° à la résonance, ≈ 180° au-dessus. Afficher l'amplitude mesurée et la puissance moyenne fournie (optionnel). Une phrase du panneau doit dire **pourquoi** : à Ω ≈ ω0, la force pousse toujours dans le sens de la vitesse, elle ajoute de l'énergie à chaque cycle, jusqu'à ce que l'amortissement en retire autant.

### C — La corde (module 15, propagation)

Modèle unique pour C et D1–D2 : corde tendue de longueur L = 1 m (affichée par une règle graduée), équation d'onde 1D

    ∂²y/∂t² = c² ∂²y/∂x²  (+ amortissement faible −2γ ∂y/∂t en D2 seulement, γ = 0,1 s⁻¹ ; nul en C1 et C2)

c = 0,5 m/s par défaut (corde très lâche, filmée « au ralenti » ; le dire). Discrétisation : N = 200 segments, schéma saute-mouton avec **nombre de Courant exactement 1** (dt = dx/c) : ce schéma est exact pour l'équation d'onde 1D sans amortissement (pas de dispersion numérique), le dire en commentaire. Extrémités :
- fixe : y = 0 (réflexion avec inversion) ;
- absorbante : condition de Mur du premier ordre, exacte à Courant 1 (`y_N^{n+1} = y_{N−1}^n`) ;
- entraînée : y(0, t) imposé par la main.

Affichage : la corde est une ligne lisse passant par 60 à 80 « perles » visibles (sous-échantillonnage des 200 points) ; une perle témoin, en surbrillance, avec un tireté vertical à sa position de repos : elle monte et descend **sur place**, elle n'avance jamais. Une seconde mesure : un petit marqueur suit le maximum de l'impulsion et affiche la vitesse mesurée (distance/temps) à comparer à c.

**C1. Une perturbation qui voyage.** Bouton « Impulsion » (la main à gauche fait un aller-retour gaussien, largeur ≈ 0,08 m). L'extrémité droite est fixe : l'impulsion revient **inversée**. Bascule « bout fixe / bout libre » (libre : ∂y/∂x = 0, réflexion sans inversion) — optionnel si le budget serre ; sinon fixe seulement et le dire. Deuxième bouton « Deux impulsions » : une impulsion part de chaque bout en même temps (même sens, ou sens opposés via une bascule). Au croisement : somme deux fois plus haute (même sens) ou presque plate (sens opposés) pendant un instant, puis les deux impulsions repartent **intactes**. C'est la superposition linéaire. Le panneau affiche c mesurée.

**C2. Onde périodique.** La main oscille à f (curseur 0,5 à 3 Hz), l'extrémité droite est absorbante (onde progressive pure, pas de retour). Afficher λ par une accolade entre deux crêtes successives, avec λ = c/f calculé et mesuré. La perle témoin oscille à f avec la même amplitude que la main. Petit oscilloscope : y(t) de la perle témoin ; le même cadran de phase montre la phase de la perle témoin, en retard de kx sur la main (phase locale). Phrase clé : « chaque perle refait le même cycle que la main, avec un retard qui grandit avec la distance : c'est ça, une onde ».

### D — Interférences, modes et Doppler (module 15, suite)

**D1. Deux ondes, une même corde (moment fort).** Vue analytique (pas de simulation numérique ici), même cadre et même corde dessinée : deux ondes progressives de même f, même A, même sens, y1 = A sin(kx − ωt), y2 = A sin(kx − ωt + Δφ), en traits fins (code onde 1 / onde 2), et leur somme en trait fort. Curseur Δφ (0 à 360°, pas de 15°, défaut 0). Le cadran de phase montre deux flèches mises **bout à bout** et leur résultante (longueur 2A cos(Δφ/2)) : c'est l'addition de phaseurs, rendue visible. Mesures : Δφ, amplitude de la somme (0 à 2A), intensité relative (∝ amplitude², 0 à 4). À 0° « renforcement », à 180° « annulation » : la corde ne bouge plus alors que deux ondes y passent. Lien discret vers `../05-ondes-interferences/index.html` : « la même chose en deux dimensions ».

**D2. Ondes stationnaires et modes propres.** Retour à la simulation de la corde, bouts fixes des deux côtés, la main à gauche oscille avec une **petite** amplitude (a = 0,01 m) à f (curseur 0,1 à 1,1 Hz, pas 0,005). Fréquences propres f_n = n c / (2L) = 0,25 n Hz ; repères n = 1 à 4 sur le curseur et boutons « n = 1 », « 2 », « 3 », « 4 » qui règlent f = f_n. Quand f ≈ f_n, la corde **résonne** : l'amplitude grandit jusqu'à un régime stationnaire où apparaissent des nœuds immobiles (marqués d'un point `--texte` et d'une étiquette « nœud ») et des ventres (enveloppe ±A en `--energie`, étiquette « ventre »), espacés de λ/2. Hors résonance, la corde reste agitée faiblement et sans nœuds nets. Phrase clé : « la corde est un oscillateur qui a plusieurs fréquences propres ; c'est la résonance du chapitre B, appliquée à une onde qui fait des allers-retours ». Afficher : f, f/f1, amplitude mesurée au ventre, nombre de nœuds détectés (hors extrémités). Une bascule « décomposer » superpose, en traits fins, l'onde aller et l'onde retour dont la somme fait la stationnaire (calcul analytique au régime établi, pour le mode courant).

**D3. Doppler (petite scène finale).** Vue de dessus 2D minimale : une source se déplace vers la droite à v (curseur v/c de 0 à 0,8), émet un front circulaire à chaque période T (fronts = cercles fins centrés sur la position d'émission, rayon c·(t − t_émission)). Deux observateurs fixes, devant et derrière. Chaque observateur compte les fronts reçus : afficher la fréquence mesurée et la valeur théorique f' = f / (1 ∓ v/c) (source mobile, observateur fixe, milieu au repos). Phrase clé : « la source ne change pas de fréquence ; les fronts se tassent devant elle et s'étirent derrière ». Pas de mur du son (v < c), pas d'observateur mobile, pas de relativité : le dire dans l'explication.

## Interface

- Structure de la planche 05 (grille scène + panneau à droite ≥ 861 px, panneau en bas sur mobile, barre de contrôles en bas). Reprendre ses classes et ses styles autant que possible : `.app .scene .head .panel .controls .stepper .seg .tools .btn input[type=range] .tip .meas .row`.
- Panneau : étiquette `Chapitre A · étape 1 sur 10`, titre de l'étape, 1 à 3 phrases, puis mesures (IBM Plex Mono), puis l'oscilloscope / le cadran quand ils ne sont pas dans la scène. Les rangées A, f, T, φ gardent le même ordre et le même format dans tout le document.
- Micro-interaction de découverte : survol/tap d'un élément (cadran, rayon, trace, masse, ressort, jauge, perle témoin, main, nœud, ventre, source, observateur) → nom + rôle en une ligne.
- Clavier : Espace pause, ← → étape, R réinitialiser l'étape, 1 à 9 et 0 = étapes 1 à 10.
- Responsive jusqu'à 375 px, sans défilement horizontal. Sur mobile, les éléments secondaires de la scène (courbe de résonance, graphe Ec/Ep) passent sous la scène principale ou dans le panneau plutôt que d'être écrasés.
- `prefers-reduced-motion` : temps ralenti ×0,25 et pas de traînes.
- Canvas mis à l'échelle de `devicePixelRatio`. Aucune erreur console.
- Lien `explication.html` et retour `../index.html`.

## Crochet de vérification (obligatoire)

Exposer `window.__fondations` en lecture seule pour la QA automatisée, sans effet sur l'interface :

```js
window.__fondations = {
  step: () => index,                // 0..9
  go: (i) => {...},                 // change d'étape
  osc: () => ({ t, x, v, m, k, b, F0, W, Ec, Ep, heat, E0 }),   // chapitre B
  string: () => ({ t, N, L, c, y: Float32Array, vel }),          // chapitre C / D2
  setParam: (name, value) => {...}, // mêmes paramètres que les curseurs
  advance: (seconds) => {...},      // avance la simulation de manière synchrone (sans rendu)
};
```

## Ce que explication.html doit dire

Charte habituelle (Ce que tu vois / Ce qui se passe vraiment / Ce que la simulation simplifie / Les chiffres à retenir / Teste-toi), 900 à 1300 mots vu les trois modules, plus deux courtes sections :
- **Où tu reverras ce langage** : acoustique (modes d'une corde de guitare, f_n), Fourier (tout signal = somme de sinus, ce que D1–D2 font avec deux), optique (interférences, planche 05), circuits RLC (même équation que B : L ↔ m, 1/C ↔ k, R ↔ b), électromagnétisme (onde lumineuse = même équation d'onde, c = 1/√(μ0 ε0)), mécanique quantique (états stationnaires d'une particule dans une boîte ↔ modes de D2). Une phrase chacun, aucun développement.
- **Seulement introduit ici** : sur-amortissement, bout libre (si absent), dispersion, ondes 2D/3D, Doppler avec observateur mobile, mur du son, Fourier.

Modèles à expliciter : loi de Hooke et approximation harmonique (petits déplacements, ressort idéal sans masse), amortissement visqueux (force ∝ vitesse), forçage sinusoïdal, équation d'onde 1D (petits angles, tension uniforme, c = √(T/μ)), conditions aux limites (fixe, absorbante, entraînée), Doppler source mobile.

Chiffres à retenir (exemples) : corde de guitare (c ≈ 100 à 400 m/s, f1 ≈ 82 à 330 Hz), son dans l'air 343 m/s, la4 = 440 Hz ⇒ λ ≈ 78 cm, Q d'un diapason ~ 10³ à 10⁴, lumière visible λ ≈ 400 à 700 nm.

## Notes d'échelle (vérifiées par Opus)

- D2 : au régime établi, y(x) = a sin(κ(L − x)) / sin(κL) avec κ complexe ; à la résonance |sin κL| ≈ γL/c = 0,2, donc amplitude au ventre ≈ 5a = 5 cm, atteinte en quelques τ = 1/γ = 10 s (la croissance est visible dès les premières secondes). Échelle verticale de la corde exagérée ×2 et **affichée** (« échelle verticale ×2 ») ; l'échelle horizontale reste vraie (la règle de 1 m fait foi pour λ).
- C2 : λ = c/f va de 1 m (0,5 Hz) à 0,17 m (3 Hz).
- B : à β = 0,25 s⁻¹ et ω0 = 6,32 rad/s, Q ≈ 12,6 ; amplitude à résonance ≈ F0/(m·2βω0) = 0,2/(0,5·2·0,25·6,32) ≈ 0,127 m. Échelle de la scène : prévoir ±0,15 m sans sortir du cadre ; pour Ω/ω0 hors pic, la réponse est ≈ 0,01 à 0,02 m (petite mais visible : c'est le contraste recherché).
