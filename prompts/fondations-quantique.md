# Fondations · Fondations quantiques (module 48)

Dossier de sortie : `opus-sonnet/fondations-quantique/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 48`, titre « Une particule, des *amplitudes* ». Accent : `--accent: #a99cf0;` (lavande quantique). Budget : ≈ 0,9 ADN, **un chapitre de 4 étapes**.

Elle ouvre la branche K · Quantique. Elle prépare 49 (potentiels, effet tunnel) et 50 (spin, intrication).

Préalables conseillés : 06 (phase, phaseurs), 07 (probabilités), 15 et la planche 05 (interférences), 25 (lumière), 27 (photons, quantification).

## Intention

À la fin, l'étudiant sait que **la mécanique quantique calcule des amplitudes, nombres qui ont une phase, et qu'on les additionne avant d'en prendre le carré pour obtenir une probabilité** ; que chaque particule arrive en un seul point, mais que la statistique de ces points dessine des interférences ; et que savoir par où elle est passée efface ces interférences. Intuitions à rendre évidentes, par ordre de priorité :

1. Des électrons envoyés **un par un** arrivent chacun en un point précis, au hasard ; peu à peu, ces points dessinent des franges d'interférence (étape 1, moment fort).
2. On n'additionne pas des probabilités, on additionne des amplitudes : deux chemins peuvent s'annuler (étape 2).
3. Placer un détecteur qui révèle le chemin détruit l'interférence ; ce n'est pas une maladresse de l'appareil, c'est la règle (étape 3, moment fort).
4. Une particule localisée est un paquet d'ondes ; plus il est étroit en position, plus il est large en quantité de mouvement, et il s'étale (étape 4).

Interdits : « l'électron passe par les deux fentes à la fois » comme affirmation simple (on dit : « on ne peut attribuer aucun chemin ; on additionne les amplitudes des deux ») ; « l'observateur conscient change le résultat » ; « l'électron est à la fois une onde et une particule » sans précision.

## Réutilisation (ne pas reconstruire)

- Phaseurs, addition de sinusoïdes : `../fondations-oscillations-ondes/` (module 06, cadran de phase). Les amplitudes complexes sont dessinées exactement comme ces flèches tournantes : le dire.
- Interférences en 2D, fentes : `../05-ondes-interferences/`. Ici on ajoute le grain (un impact à la fois).
- Probabilités, histogrammes, convergence : `../fondations-systemes-hasard/`.
- Photon, E = hf : future page 26 · 27 ; λ = h/p prolonge cette relation.
- Polarisation et polariseurs : future page 25 (renvoi pour le photon unique à 45°).

## Moteur (à écrire et tester avant la page)

Bloc `/* QM-BEGIN */ … /* QM-END */`, objet `QM`. Nombres complexes maison (`{re, im}` ou tableaux typés interlacés). Constantes : h, ħ, mₑ, e.

- **Complexes** : `cadd`, `cmul`, `cabs2`, `cexp(phi)`, `phasor(amp, phase)`.
- **Fentes de Young** : `twoSlit({lambda, d, w, L}, x)` → amplitudes ψ₁(x), ψ₂(x) (diffraction de Fraunhofer de chaque fente) ; `pattern(mode, x)` avec mode ∈ `'both'` (|ψ₁ + ψ₂|²), `'which'` (|ψ₁|² + |ψ₂|²), `'partial', eta` (visibilité réduite : |ψ₁|² + |ψ₂|² + 2η Re(ψ₁*ψ₂)) ; `sampleHits(pattern, n, rng)` (tirage par inversion de la fonction de répartition).
- **De Broglie** : `lambdaDB(m, v)` et `lambdaElectron(V)` (avec correction relativiste).
- **Mach-Zehnder** : `mz({phi, blockArm, whichPath})` → probabilités aux deux détecteurs ; `mzPhotons(n, params, rng)`.
- **Paquet libre** : `gaussPacket({x0, sigma0, k0}, x, t)` (solution exacte de l'équation de Schrödinger libre) ; `sigmaT(sigma0, m, t)` ; `momentumSpread(sigma0)` ; `expectation(psi, op)`.

### Tests du moteur

1. Probabilités normalisées : ∫ pattern = 1 à 10⁻⁶ pour chaque mode.
2. Franges : interfrange = λL/d à 0,5 % ; mode `'which'` : aucune frange (enveloppe de diffraction seule) ; `'partial'` : visibilité = η.
3. Tirages : histogramme de 10⁵ impacts conforme à `pattern` (χ² raisonnable) ; à 10 impacts, aucune frange visible (test qualitatif : variance de l'histogramme dominée par le bruit).
4. De Broglie : électron de 100 eV → 0,123 nm ; 50 keV → 5,36 pm avec correction relativiste (5,48 pm sans).
5. Mach-Zehnder : P(D₁) = cos²(φ/2), P(D₂) = sin²(φ/2) ; un bras bloqué → 1/4 et 1/4 (plus 1/2 absorbé) ; chemin connu → 1/2 et 1/2 quel que soit φ.
6. Paquet gaussien : norme conservée ; σ(t) = σ₀ √(1 + (ħt/(2mσ₀²))²) à 10⁻⁶ ; Δx Δp = ħ/2 à t = 0 ; centre qui avance à ħk₀/m.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| amplitude complexe | flèche tournante (phaseur) : longueur = module, angle = phase ; teinte de la phase sur une roue de couleurs discrète, ou `--accent` uni si la roue nuit à la lisibilité (choisir et le dire) |
| probabilité |ψ|² | aire ou histogramme `--texte` |
| impacts de particules | points `--energie` qui s'allument puis restent en blanc cassé |
| chemin 1 / chemin 2 | `--positif` / `--negatif` (seulement pour distinguer les deux chemins) |
| détecteur de chemin | petit œil schématique `--texte` qui s'allume |

## Chapitre · Module 48 · Fondations quantiques

### Étape 1 · Une particule à la fois (moment fort)
- Scène : un canon à électrons, une plaque à deux fentes, un écran détecteur. Les électrons partent **un par un** (cadence réglable) ; chacun laisse un seul point sur l'écran. Au début, les points semblent au hasard ; après quelques centaines, des bandes apparaissent ; après des milliers, la figure d'interférence est nette. Histogramme sous l'écran, avec la courbe |ψ₁ + ψ₂|² tiretée (révélée à la demande).
- Contrôles : cadence (1/s à 1 000/s), bouton « 10 000 d'un coup », tension d'accélération (donc λ), écartement des fentes, bouton « Fermer une fente ».
- Panneau : nombre d'impacts, λ de de Broglie, interfrange mesuré et prévu. Statuts : 10 impacts « Rien de régulier : chaque électron arrive en un point, au hasard » ; 2 000 impacts « Les bandes apparaissent : la probabilité d'arriver en un point suit une figure d'interférence » ; une fente fermée « Avec une seule fente, plus de franges : il y a des endroits où l'électron arrive **plus souvent** quand on ferme une fente ».
- Phrase-clé : « Chaque électron arrive en un seul point, au hasard. Mais la probabilité de ces points dessine des interférences, comme une onde : λ = h/p. »
- Note : expérience réalisée (Tonomura, 1989, citée) ; géométrie et échelles de la scène agrandies.

### Étape 2 · Additionner des amplitudes
- Scène : un interféromètre de Mach-Zehnder vu de dessus (une lame séparatrice, deux miroirs, une deuxième séparatrice, deux détecteurs D₁ et D₂). Des photons partent un par un ; chacun est détecté en D₁ ou en D₂. Pour chaque détecteur, les deux phaseurs (un par chemin) sont dessinés et mis bout à bout : leur somme, au carré, donne la probabilité. Un déphaseur réglable sur un bras.
- Contrôles : phase φ (0 à 2π), bouton « Bloquer un bras », cadence des photons.
- Panneau : P(D₁), P(D₂) prédites, comptages mesurés, phaseurs. Statuts : φ = 0 « Tous les photons vont en D₁ : en D₂, les deux amplitudes s'annulent » ; bras bloqué « Bloquer un chemin fait **apparaître** des photons en D₂ : on ne peut pas additionner des probabilités ».
- Phrase-clé : « À chaque chemin possible correspond une amplitude, un nombre avec une phase. On additionne les amplitudes de tous les chemins, puis on prend le carré du module : c'est la probabilité. »
- Note : séparatrices idéales 50/50 ; conventions de phase des lames documentées dans le moteur.

### Étape 3 · Savoir par où, c'est perdre les franges (moment fort)
- Scène : on revient aux fentes de Young (ou au Mach-Zehnder, bascule) et on ajoute un détecteur de chemin, réglable de « éteint » à « parfait » (η de 1 à 0). Les impacts déjà accumulés restent ; les nouveaux se répartissent selon la nouvelle règle ; deux histogrammes côte à côte (avant / après).
- Contrôles : efficacité du détecteur de chemin (curseur), bouton « Effacer l'écran ».
- Panneau : visibilité des franges, efficacité du détecteur. Statuts : détecteur parfait « Dès que l'on peut savoir par quelle fente il est passé, les franges disparaissent : on additionne alors les probabilités » ; partiel « Une information partielle sur le chemin, des franges partielles ».
- Phrase-clé : « Si une information sur le chemin existe quelque part, les amplitudes des deux chemins ne s'additionnent plus : les interférences disparaissent. Ce n'est pas la maladresse de l'appareil, c'est la règle. »
- Note : modèle de visibilité simple ; la gomme quantique est seulement nommée dans l'explication.

### Étape 4 · Le paquet d'onde
- Scène : une particule libre en 1D représentée par sa fonction d'onde : partie réelle (fine), module (enveloppe), |ψ|² (aire). Le paquet avance et s'étale. En dessous, sa distribution en quantité de mouvement (fixe pour une particule libre). On peut « mesurer la position » : un tirage selon |ψ|², un point, et le paquet est remplacé par un paquet étroit centré sur ce point, qui s'étale à nouveau, plus vite.
- Contrôles : largeur initiale σ₀, quantité de mouvement moyenne, masse (électron, atome, grain de poussière), bouton « Mesurer la position ».
- Panneau : Δx(t), Δp, Δx·Δp, λ = h/p, temps pour que la largeur double. Statuts : électron de σ₀ = 1 nm « La largeur double en moins d'une picoseconde » ; grain de poussière « L'étalement est invisible : à l'échelle humaine, la mécanique classique suffit » ; après une mesure « Plus étroit en position, plus large en vitesse : il s'étale plus vite ».
- Phrase-clé : « Une particule localisée est un paquet d'ondes : plus il est étroit en position, plus il est étalé en quantité de mouvement, Δx·Δp ≥ ħ/2. »
- Fin de planche, trois questions ouvertes : **Énergie** « Pourquoi un électron piégé dans un atome n'a-t-il que certaines énergies ? » → module 49 ; **Barrières** « Une particule peut-elle franchir un mur qu'elle n'a pas l'énergie de franchir ? » → module 49 ; **Corrélations** « Deux particules peuvent-elles partager une seule amplitude ? » → module 50.

## Micro-interactions de découverte

Canon, fente, écran, impact, histogramme, phaseur, lame séparatrice, miroir, déphaseur, détecteur D₁/D₂, détecteur de chemin, paquet d'onde, partie réelle, |ψ|², distribution en p.

## `window.__labo` (en plus du socle)

`setRate(r)`, `burst(n)`, `setVoltage(V)`, `setSpacing(d)`, `closeSlit(on)` (1) ; `setPhase(phi)`, `blockArm(on)` (2) ; `setWhichPath(eta)`, `clearScreen()`, `setSetup(kind)` (3) ; `setSigma(s)`, `setK(k)`, `setMass(m)`, `measureX()` (4).

## Théorie (explication, module 48)

- Relations : \(\lambda = \dfrac{h}{p}\) ; \(P = |\psi|^2\) avec \(\int |\psi|^2\,\dd x = 1\) ; \(\psi = \psi_1 + \psi_2\) et \(|\psi_1 + \psi_2|^2 = |\psi_1|^2 + |\psi_2|^2 + 2\,\mathrm{Re}(\psi_1^*\psi_2)\) ; \(e^{i\varphi} = \cos\varphi + i\sin\varphi\) ; \(\Delta x\,\Delta p \ge \hbar/2\).
- Exemple chiffré possible : interfrange pour des électrons de 50 keV et des fentes séparées de 1 µm à 1 m (≈ 5 µm), ou longueur d'onde de de Broglie d'une balle de baseball.
- Pièges : « l'électron passe par les deux fentes » dit sans nuance ; « la mesure perturbe mécaniquement la particule » comme seule explication ; « on additionne les probabilités des deux chemins » ; « le principe d'incertitude vient de l'imprécision des instruments » ; « la fonction d'onde est une onde de matière qu'on pourrait voir ».
- Où ça resservira : 49 (états liés, effet tunnel), 50 (spin, intrication), 27 (quantification), 28 (orbitales), 44 (pression de dégénérescence).
- Seulement introduit ici : équation de Schrödinger en général, opérateurs, gomme quantique, décohérence, interprétations.

## Honnêteté

Fentes et interféromètre idéaux ; nombres d'impacts et échelles de la scène agrandis ; visibilité modélisée par un seul paramètre ; paquet en 1D, particule libre.

## Hors champ

Interprétations de la mécanique quantique, formalisme de Dirac, théorie quantique des champs, informatique quantique (seulement à 50).
