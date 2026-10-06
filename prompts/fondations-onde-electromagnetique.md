# Fondations · Onde électromagnétique et spectre (module 24)

Dossier de sortie : `opus-sonnet/fondations-onde-electromagnetique/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 24`, titre « L'onde *électromagnétique* ». Accent : `--accent: #ff9fb2;` (corail rosé, pour l'interface et le spectre hors visible). Budget : ≈ 0,8 ADN, **un chapitre de 4 étapes**.

Préalables conseillés : 06 · 15 (ondes), 21 (champ électrique), 23 (magnétisme et induction). Elle prépare 25 (optique), 27 (photons et spectres), 43 (corps noir), 48 (photon et amplitude).

## Intention

À la fin, l'étudiant sait que **la lumière, la radio, les micro-ondes et les rayons X sont une seule chose** : des champs électrique et magnétique qui s'entretiennent l'un l'autre et voyagent à c, émis par des charges qui accélèrent. Intuitions à rendre évidentes, par ordre de priorité :

1. Une charge qu'on secoue envoie une « ride » dans son champ, et cette ride part à la vitesse c : loin de la charge, le champ ne « sait » pas encore qu'elle a bougé (étape 1, moment fort).
2. Dans l'onde, E et B sont perpendiculaires entre eux et à la direction de propagation, en phase, avec E = cB (étape 2).
3. Radio et rayons gamma ne diffèrent que par la longueur d'onde, sur plus de quinze ordres de grandeur ; ce qui change, c'est ce avec quoi l'onde interagit (étape 3, moment fort).
4. Une onde transporte de l'énergie ; l'intensité diminue comme 1/r² loin d'une source, parce que la même puissance se répartit sur une sphère plus grande (étape 4).

Interdits : « la lumière est faite de champs qui vibrent dans l'éther », « l'onde pousse les électrons » sans dire par quel champ. Le mot « photon » n'apparaît qu'à l'étape 3, comme passerelle vers 27 et 48.

## Réutilisation (ne pas reconstruire)

- Sinusoïde, phase, λ = v/f, superposition, Doppler : `../fondations-oscillations-ondes/` et `../05-ondes-interferences/`. Pas d'interférences ici.
- Champ électrique d'une charge (lignes, flèches) : reprendre le rendu de `../04-champ-electrique/` pour la charge immobile de l'étape 1.
- Induction : `../fondations-magnetisme-induction/` (module 23) : « un B qui change crée un E ». Ici on ajoute la réciproque : « un E qui change crée un B ».
- Ordres de grandeur, échelles log : `../fondations-langage/` (toy Échelles). L'étape 3 en reprend l'esprit sans le dupliquer.
- Rayonnement thermique (introduit) : `../07-matiere-chaleur/` acte IX. Le corps noir reste pour 43.

## Moteur (à écrire et tester avant la page)

Bloc `/* EMW-BEGIN */ … /* EMW-END */`, objet `EMW`. Constantes : c = 299 792 458 m/s, ε₀ = 8,854 187 8 × 10⁻¹² F/m, μ₀ = 1,256 637 06 × 10⁻⁶ H/m, h = 6,626 070 15 × 10⁻³⁴ J·s, e = 1,602 176 634 × 10⁻¹⁹ C.

- **Champ retardé d'une charge** (étape 1, unités de scène, c réduit) : `chargeHistory` (tampon des positions et accélérations passées), `retardedTime(hist, x, y, t)` (résolution de t' = t − |r − r(t')|/c par itération), `fieldAt(hist, x, y, t)` → `{Ecoul, Erad}` où la partie de rayonnement est la composante transverse ∝ a⊥(t')/(c²R) (forme non relativiste, |v| ≪ c). `kinkCharge(t0, dv)` : charge qui change brusquement de vitesse, pour la « ride ».
- **Dipôle oscillant** : `dipoleFar(p0, omega, r, theta, t)` → E_θ et B_φ en champ lointain ; `dipolePower(p0, omega)` = μ₀p₀²ω⁴/(12πc).
- **Onde plane** : `plane(E0, lambda, x, t, pol)` → `{E, B}` avec B = E/c ; `intensity(E0)` = ½cε₀E₀² ; `radPressure(I, reflect)` = I/c ou 2I/c.
- **Spectre** : `bands` (bornes conventionnelles des domaines, de 10⁴ m à 10⁻¹² m, avec ce qui interagit et un exemple de source) ; `photonEnergy(lambda)` en J et en eV ; `visibleColor(lambda)` (rampe sRGB approximative 380 à 750 nm, gris en dehors) ; `scaleObject(lambda)` (objet de comparaison de même taille).
- **Source ponctuelle** : `inverseSquare(P, r)` = P/(4πr²), `E0from(I)`.

### Tests du moteur

1. 1/√(μ₀ε₀) = c à 10⁻⁶ près relatif.
2. Charge à vitesse constante (v = 0,05 c) : le champ calculé par le tampon retardé ne contient aucune partie de rayonnement (|Erad| < 10⁻⁹ du coulombien).
3. Ride : après un changement brusque de vitesse à t₀, le champ en un point à distance r ne change pas avant t₀ + r/c, et change après (deux points à r = 100 et 200 unités).
4. Dipôle : Erad nul sur l'axe d'oscillation (θ = 0), maximal à θ = 90° ; intensité ∝ sin²θ à 1 % ; retard de phase 2πr/λ.
5. Onde plane : E·B = 0, |E|/|B| = c, E et B en phase, E × B dans le sens de propagation.
6. Soleil à 1 UA, I = 1 361 W/m² : E₀ ≈ 1 013 V/m, B₀ ≈ 3,38 µT, pression de radiation absorbée 4,54 µPa (1 %).
7. Photon : 550 nm → 2,25 eV ; 1 240 eV·nm / λ à 0,1 % ; 100 MHz → λ = 3,00 m, E ≈ 4,1 × 10⁻⁷ eV.
8. Inverse du carré : P = 100 W, r = 1 m → 7,96 W/m² ; r doublé → divisé par 4.
9. `bands` couvre sans trou ni chevauchement l'intervalle 10⁻¹² m à 10⁴ m.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| champ **E** | `#9fe870` (la couleur de la planche du champ électrique, gardée pour E) |
| champ **B** | `--champ-b: #8a97f2` (comme au module 23) |
| charge + qu'on secoue | `--positif` |
| ride, front d'onde, cercle r = ct | trait fin `--texte` à 40 % |
| énergie transportée, intensité | `--energie` |
| longueurs d'onde visibles | leur couleur (`visibleColor`) ; hors visible : `--accent` en dégradé de luminance (pas de fausses couleurs arc-en-ciel pour l'invisible) |

## Chapitre · Module 24 · Onde électromagnétique

### Étape 1 · Secouer une charge (moment fort)
- Scène : une charge + au centre, son champ électrique dessiné en flèches sur une grille polaire (ou en lignes de champ). On peut **saisir la charge et la secouer** à la souris ; ou boutons « Coup sec » (changement brusque de vitesse) et « Osciller » (curseur f).
- Le cercle de rayon c·(t − t₀) grandit à partir de chaque secousse : à l'intérieur, le champ a « appris » le mouvement ; à l'extérieur, il pointe encore vers l'ancienne position. Sur le cercle, les lignes font un **coude** : c'est la ride qui se propage. En mode « Osciller », les coudes successifs forment une onde sortante ; λ = c/f se lit directement entre deux crêtes.
- Contrôles : f (curseur, unités de scène), amplitude, vitesse de la lumière « ralentie » affichée (c de scène). Bascule « Afficher seulement la partie qui rayonne » (retire le coulombien, il ne reste que l'onde, nulle dans l'axe de l'oscillation).
- Panneau : λ mesurée, c de scène, rapport réel (« dans la réalité, la ride parcourt 300 000 km en une seconde »). Statut au premier coup sec : « Au-delà du cercle, le champ montre encore l'ancienne position : l'information voyage à c, pas plus vite ».
- Phrase-clé : « Une charge qui accélère rayonne. Le changement de son champ se propage à la vitesse c : c'est une onde électromagnétique. »
- Note : c ralentie d'un facteur énorme ; forme non relativiste du champ de rayonnement.

### Étape 2 · E et B, ensemble
- Scène : vue en perspective isométrique d'une onde plane progressive le long d'un axe : vecteurs E verticaux (`#9fe870`) et B horizontaux (`--champ-b`) dessinés à intervalles réguliers, en phase, qui glissent vers l'avant. Une petite boucle-sonde (rappel de 23) placée dans l'onde montre que le B qui varie induit un E, et une petite « plaque » montre que le E qui varie crée un B : flèches en pointillé qui se relaient.
- Contrôles : amplitude E₀ (V/m, échelle log de 1 à 10⁴), f (de 1 MHz à 10¹⁵ Hz, la scène garde la même allure, seule l'étiquette λ change), bascule « Arrêter le temps » (photo instantanée, utile pour voir que E et B ont les mêmes zéros).
- Panneau : E₀, B₀ = E₀/c, λ, f, T, intensité I = ½cε₀E₀². Préréglages : « lumière du Soleil au sol (≈ 1 000 W/m²) », « téléphone à 1 m (≈ 1 W/m²) », « pointeur laser 1 mW sur 1 mm² ».
- Statuts : avec la lumière du Soleil, « E₀ ≈ 900 V/m mais B₀ ≈ 3 µT : B paraît minuscule, mais sa part d'énergie est exactement égale à celle de E ».
- Phrase-clé : « Un champ électrique qui varie crée un champ magnétique, et un champ magnétique qui varie crée un champ électrique. Ils se relaient et avancent ensemble, à c = 1/√(μ₀ε₀). »
- Note : onde plane idéale, polarisée verticalement (la polarisation est au module 25).

### Étape 3 · Un seul phénomène, tout le spectre (moment fort)
- Scène : une règle horizontale en échelle log de 10⁴ m à 10⁻¹² m, découpée en domaines (radio, micro-ondes, infrarouge, visible, ultraviolet, X, gamma) ; le visible est une fente étroite colorée. Au-dessus, l'onde dessinée **à l'échelle** d'un objet de comparaison qui change avec λ (bâtiment, humain, abeille, cellule, bactérie, virus, molécule, atome, noyau). En dessous, « ce qui répond » : antenne, rotation de molécules d'eau, vibration de liaisons, électrons des atomes, électrons profonds, noyaux.
- Contrôles : curseur λ (log) ou f (bascule λ ↔ f) ; préréglages : « radio FM 100 MHz », « Wi-Fi 2,4 GHz », « four à micro-ondes 2,45 GHz », « infrarouge du corps 10 µm », « vert 550 nm », « UV-C 254 nm », « radiographie 0,05 nm », « gamma du ⁶⁰Co ».
- Panneau : λ, f, énergie d'un photon (eV), objet de même taille, domaine. Un trait vertical marque le **seuil d'ionisation** (≈ 10 eV, autour de 120 nm) : à gauche « peut arracher des électrons aux molécules », à droite « chauffe ou excite, n'ionise pas ». Une bande « fenêtres de l'atmosphère » (visible, radio) : ce qui arrive au sol.
- Statut au premier passage dans le visible : « Toute la lumière que tu vois tient entre 380 et 750 nm : moins d'un facteur 2 sur plus de quinze ordres de grandeur ».
- Phrase-clé : « Radio, lumière et rayons X sont la même onde. Seule la longueur d'onde change, et avec elle ce qu'elle fait à la matière. »
- Note : bornes des domaines conventionnelles (ils se chevauchent en pratique) ; le photon est seulement nommé ici (modules 27 et 48).

### Étape 4 · Ce que l'onde transporte
- Scène : une source ponctuelle (ampoule ou étoile) au centre, des sphères concentriques en coupe ; un détecteur carré de 1 m² qu'on éloigne. Les « rayons » qui traversent le détecteur se raréfient. Bascule « Voile » : une voile parfaitement réfléchissante devant le Soleil reçoit une poussée.
- Contrôles : puissance P de la source (1 W à 10²⁶ W, préréglages « ampoule 100 W », « Soleil 3,8 × 10²⁶ W »), distance r (log), bascule « Voile réfléchissante ».
- Panneau : I = P/(4πr²), E₀, pression de radiation (absorbée I/c, réfléchie 2I/c), force sur une voile de 100 m × 100 m. Préréglage « Soleil à la Terre » : 1 361 W/m², 4,5 µPa, 0,09 N sur la voile réfléchissante.
- Statut : « À distance double, quatre fois moins : la même énergie s'étale sur une sphère quatre fois plus grande ».
- Phrase-clé : « Une onde électromagnétique transporte de l'énergie et de la quantité de mouvement. Loin d'une source, son intensité baisse comme 1/r². »
- Fin de planche, trois questions ouvertes : **Matière** « Pourquoi la lumière ralentit-elle dans le verre, et pourquoi tourne-t-elle à l'entrée ? » → module 25 ; **Atomes** « Pourquoi un gaz chaud n'émet-il que certaines couleurs ? » → module 27 ; **Étoiles** « Quelle couleur a un objet seulement parce qu'il est chaud ? » → module 43.

## Micro-interactions de découverte

Charge, ligne de champ, coude, cercle r = ct, vecteur E, vecteur B, sonde, domaine du spectre, objet de comparaison, seuil d'ionisation, détecteur, voile.

## `window.__labo` (en plus du socle)

`kick(dv)`, `oscillate(on, f)`, `radOnly(on)` (1) ; `setE0(E)`, `setF(f)`, `freeze(on)` (2) ; `setLambda(l)`, `preset(name)` (3) ; `setP(P)`, `setR(r)`, `sail(on)` (4).

## Théorie (explication, module 24)

- Relations : \(c = 1/\sqrt{\mu_0\varepsilon_0}\) ; \(c = \lambda f\) ; \(E = cB\) ; \(I = \tfrac12 c\varepsilon_0 E_0^2\) ; \(I = P/(4\pi r^2)\) ; \(E_\gamma = hf = hc/\lambda\) (seulement introduit, avec renvoi à 27).
- Exemple chiffré possible : la lumière du Soleil au sol (I → E₀, B₀, pression, force sur une main) ou une antenne FM de 50 kW (I et E₀ à 10 km).
- Pièges : « E et B sont décalés d'un quart de période » (en phase dans une onde progressive) ; « les ondes radio ne sont pas de la lumière » ; « les micro-ondes sont radioactives » ; confondre intensité et énergie d'un photon ; « l'onde a besoin d'un milieu » ; croire que B est négligeable en énergie.
- Où ça resservira : 25 (indice, réfraction, polarisation), 27 (photons, spectres de raies), 43 (corps noir), 46 (c invariant), 48 (amplitude et photon), 09 (spectre d'un signal).
- Seulement introduit ici : équations de Maxwell sous forme complète, courant de déplacement, photon, polarisation circulaire, rayonnement synchrotron.

## Honnêteté

c ralentie à l'étape 1 ; champ de rayonnement non relativiste ; onde plane idéale ; frontières des domaines conventionnelles ; couleurs du visible approximatives (sRGB ne reproduit pas les couleurs spectrales pures).

## Hors champ

Guides d'onde et antennes en détail, lignes de transmission, interférences et diffraction (05, 25), dualité onde-particule (48), corps noir (43).
