# Fondations · Flux, gradients, champs et fluides (modules 16 et 20)

Dossier de sortie : `opus-sonnet/fondations-flux-fluides/`. Une seule page `index.html` (quatre laboratoires, navigation par onglets) et une seule `explication.html` commune. Accent : `--accent: #f2b8d8;` (rose craie : l'outil de mesure, le gradient, l'interface ; il ne porte aucun sens physique de signe).

La charte `00-direction-artistique.md` s'applique, avec les adaptations des Fondations (comme `fondations-langage.md`) :
- quatre laboratoires plus petits et plus didactiques que les planches : une idée par scène, texte court, retour immédiat ;
- pas de stepper narratif : chaque laboratoire a 4 **modes** (boutons segmentés), autant de « regards » sur la même scène ;
- le titre discret dit `Fondations 16·20 — A · …`.

## Intention

Donner le **langage spatial** que réutiliseront la diffusion, la chaleur, l'électricité, le magnétisme, les fluides, la circulation sanguine, le néphron, l'atmosphère, les étoiles et les équations aux dérivées partielles. Après la page, l'étudiant doit pouvoir dire, devant n'importe quelle carte ou flèche :

- est-ce un **champ scalaire** (un nombre par point) ou un **champ vectoriel** (une flèche par point) ?
- où est le **gradient** (vers où ça monte le plus vite, et à quel rythme) ? Et ce qui s'écoule va **contre** le gradient (chaleur, soluté, charges, fluide) ;
- combien **traverse** une surface (flux) et pourquoi l'orientation compte ;
- y a-t-il ici une **source** ou un **puits** (divergence) ? Le champ fait-il **tourner** un petit moulinet (rotationnel) ?
- dans un conduit : la **différence de pression** pousse, la **résistance** freine, le **débit** se conserve.

Ce que la page doit casser :
1. « Des flèches qui s'écartent = divergence » : loin d'une source, les flèches s'écartent **et** faiblissent ; ce qui entre dans un petit cercle en ressort, la divergence y est nulle.
2. « Des flèches qui tournent = rotationnel » : autour d'un tourbillon libre, le moulinet fait le tour **sans tourner sur lui-même** ; dans un cisaillement aux lignes droites, il tourne.
3. « La pression, c'est la vitesse » : la pression est un champ scalaire ; c'est sa **différence** (son gradient) qui pousse le fluide.

Formules : seulement quand elles résument une chose déjà vue. La notation ∇ (∇f, ∇·v, ∇×v) n'apparaît qu'en fin de parcours (mode 4 du laboratoire B et dernière section de l'explication), comme sténographie de ce qui est compris.

## Code couleur (le même dans les quatre laboratoires)

- **Signe** (code de la série) : `--positif` (orange) = positif, sortant, source, rotation antihoraire ; `--negatif` (bleu) = négatif, entrant, puits, rotation horaire ; gris `--texte-2` = nul.
- **Gradient** ∇f : flèches `--accent` (rose craie). **Ce qui s'écoule** (−k∇f : chaleur, soluté, champ électrique, force de pression) : flèches `--texte`, tête creuse.
- **Champ vectoriel** (vitesse, champ) : flèches `--texte-2` → `--texte` selon l'intensité ; traceurs : petits points `--texte` à 70 %.
- **Cartes scalaires** : température = rampe chaleur (`#16202c` → `#5a4a36` → `--energie`, comme la planche 07) ; concentration et pression = rampe neutre (`#121821` → `#8a93a0` → `--texte`) ; potentiel électrique = divergente (`--negatif` ← `--fond` → `--positif`, comme la planche 04).
- **Débit, flux** : valeur en `--energie` seulement quand c'est le résultat du moment (le « nombre qui compte »).

## Contrat technique

La coquille `index.html` (écrite par Opus) fournit la mise en page, les onglets, le style, l'objet `FX` (aides de la série Fondations : `canvas`, `loop`, `arrow`, `tag`, `tip`, `modes`, `fmt`, `k`, `tex`, …) et **`FX.F`**, la bibliothèque de champs commune (voir plus bas). Chaque laboratoire est un fichier de travail `_work/toy-X.js` :

```js
FX.register('scalaire', {
  num: 'A', titre: 'Cartes scalaires', titreHtml: 'Une valeur <em>partout</em>',
  hints: ['<kbd>Q</kbd>–<kbd>R</kbd> … (raccourcis propres au laboratoire)'],
  mount(ctx) { /* DOM dans ctx.scene, ctx.panel, ctx.controls ; ctx.signal pour tous les écouteurs */ },
  unmount() { /* arrête sa boucle */ }
});
```

Identifiants et ordre : `scalaire` (A), `vectoriel` (B), `flux` (C), `conduit` (D). Pendant le développement la coquille charge les fichiers de travail par `<script src>` ; à l'intégration, ils sont insérés en ligne puis supprimés.

Tous les calculs physiques se font en **coordonnées mathématiques** (x vers la droite, y vers le haut), en unités réelles (cm, cm/s, s, Pa, …). La conversion vers les pixels du canevas (y vers le bas) est faite au dessin, par une seule fonction par laboratoire. Une rotation **antihoraire à l'écran** est positive.

Chaque laboratoire expose son état pour les tests : `window.__flux = { toy: 'scalaire', state, model }` (fonctions pures du modèle accessibles, par exemple `model.value(x, y)`, `model.grad(x, y)`).

### `FX.F` : éléments de champ 2D (verrouillé, écrit dans la coquille)

Rayon de cœur `a` (adoucissement, évite l'infini au centre). Position relative (dx, dy), r² = dx² + dy².

| Élément | Vitesse v(dx, dy) | Divergence | Rotationnel (composante z) |
|---|---|---|---|
| uniforme (U, α) | (U cos α, U sin α) | 0 | 0 |
| source / puits (Q, cm²/s ; Q < 0 = puits) | Q/(2π) · (dx, dy)/(r² + a²) | Q/(2π) · 2a²/(r² + a²)² | 0 |
| tourbillon libre (Γ, cm²/s ; Γ > 0 antihoraire) | Γ/(2π) · (−dy, dx)/(r² + a²) | 0 | Γ/(2π) · 2a²/(r² + a²)² |
| rotation d'ensemble (ω, rad/s) | ω · (−dy, dx) | 0 | 2ω |
| cisaillement (γ, 1/s) | (γ · dy, 0) | 0 | −γ |

L'intégrale de la divergence d'une source sur tout le plan vaut exactement Q ; celle du rotationnel d'un tourbillon libre, exactement Γ. Le champ total est la **somme** des éléments (superposition). `FX.F.vel(elems, x, y)`, `FX.F.div(elems, x, y)`, `FX.F.curl(elems, x, y)` ; `FX.F.fluxCircle(elems, cx, cy, R, n)` et `FX.F.circCircle(…)` intègrent numériquement le flux sortant et la circulation sur un cercle (règle du point milieu, n = 96).

## Laboratoire A · « Une valeur partout » (champs scalaires et gradient)

Une plaque vue de dessus, 30 cm × 20 cm (le cadre s'adapte à la scène, rapport conservé, unités en cm). Des **foyers** (au plus 4) qu'on crée d'un clic dans une zone vide, qu'on déplace en les glissant, dont on règle l'intensité σ ∈ [σ_min, 1] (molette sur le foyer, ou curseur pour le foyer sélectionné), qu'on supprime par double-clic ou touche Suppr. σ > 0 : foyer chaud / source ; σ < 0 : foyer froid / puits.

### Modèle (verrouillé)
État stationnaire d'une plaque mince chauffée en quelques points et qui perd sa chaleur vers l'air : `∇²θ − θ/ℓ² = −(apport)`. La solution pour un foyer est la fonction de Bessel modifiée K₀ :

- `g(r) = K₀(ρ/ℓ) / K₀(a/ℓ)`, avec `ρ = √(r² + a²)`, ℓ = 6 cm (longueur d'atténuation), a = 0,8 cm (rayon du foyer). g(0) = 1, g décroît vers 0.
- Valeur : `f(x, y) = B + S · Σ σᵢ · g(rᵢ)`.
- Gradient **analytique** : `∂g/∂x = −K₁(ρ/ℓ) / (ℓ · K₀(a/ℓ)) · (x − xᵢ)/ρ` (idem en y). Vérifié contre la différence finie centrée (écart relatif < 10⁻³).
- K₀ et K₁ : approximations polynomiales d'Abramowitz et Stegun (9.8.1 à 9.8.8, via I₀ et I₁ pour x ≤ 2). Vérifiées contre l'intégrale `K_ν(x) = ∫₀^∞ e^(−x cosh t) cosh(νt) dt`.

La même équation décrit les quatre grandeurs proposées (sélecteur « Grandeur ») ; seul le sens physique change :

| Grandeur | B | S | σ_min | Unité de f | Gradient | Ce qui s'écoule (loi) |
|---|---|---|---|---|---|---|
| Température (plaque d'acier, k = 50 W/(m·K)) | 20 °C | 60 °C | −1 | °C | °C/cm | flux de chaleur q = −k∇T (Fourier), W/m² |
| Concentration (petit soluté dans un tissu, D = 10⁻¹⁰ m²/s) | 5 mmol/L | 4 mmol/L | −0,3 | mmol/L | mmol/L par cm | flux de soluté J = −D∇c (Fick), mol/(m²·s) |
| Pression (nappe d'eau souterraine) | 101,3 kPa | 2 kPa | −1 | kPa | kPa/cm | force volumique f = −∇p, N/m³ |
| Potentiel électrique (électrolyte, écrantage) | 0 V | 10 V | −1 | V | V/cm | champ E = −∇V, V/m |

Conversions d'unités faites honnêtement (1 °C/cm = 100 K/m, etc.). σ_min = −0,3 pour la concentration garantit c ≥ 0 avec 4 puits superposés.

### Modes
1. **Carte** — la carte colorée seule, légende graduée, une **sonde** (petit anneau `--energie`) déplaçable qui lit f(x, y). Texte : un seul nombre en chaque point ; la couleur n'est qu'un codage de ce nombre.
2. **Lignes de niveau** — 12 isolignes équidistantes en valeur (marching squares sur grille ≈ 4 px), quelques-unes étiquetées. Bascule **Relief** : la même carte dessinée en relief (lignes de crête empilées, vue oblique, hauteur ∝ f, rangées tracées de l'arrière vers l'avant avec remplissage `--fond` dessous) ; la transition carte ↔ relief est animée. Message : lignes serrées = pente raide, comme sur une carte de randonnée.
3. **Gradient** — grille de flèches ∇f (`--accent`, espacement ≈ 36 px), perpendiculaires aux isolignes, longueur ∝ |∇f| (plafonnée à 0,9 × espacement ; une flèche plafonnée a un petit trait de coupe). À la sonde : une **boussole de pente** : l'utilisateur fait tourner une direction u autour de la sonde (glisser la poignée) ; le panneau affiche la pente dans cette direction `df/ds = ∇f · u = |∇f| cos(θ − φ)` et un petit graphe de df/ds en fonction de l'angle (une cosinusoïde) avec le maximum marqué : il tombe sur la direction du gradient, et la pente est nulle le long de l'isoligne.
4. **Ce qui s'écoule** — flèches −k∇f (`--texte`, tête creuse) et traceurs illustratifs qui glissent « vers le bas » ; la loi de la grandeur choisie (Fourier, Fick, E = −∇V, f = −∇p) et la valeur à la sonde en unités SI. Message : partout dans la nature, ce qui diffuse descend le gradient.

Mesures du panneau (selon le mode) : f à la sonde, |∇f|, direction φ (en degrés depuis +x), df/ds, grandeur écoulée.

## Laboratoire B · « Une flèche partout » (champs vectoriels, divergence, rotationnel)

Un bassin vu de dessus, ≈ 30 cm × 20 cm, vitesses en cm/s. Le champ est une somme d'éléments `FX.F`.

**Vues** (bascules cumulables) : flèches (grille ≈ 34 px, longueur ∝ |v| plafonnée, opacité croissante avec |v|), **traceurs** (≈ 500 particules advectées par RK2, durée de vie aléatoire 3 à 6 s, renaissance au hasard ; dans un puits elles disparaissent au cœur), carte de divergence, carte de rotationnel (divergentes orange/bleu, normalisées par une échelle fixe propre à chaque préréglage, légende graduée en 1/s).

**Sonde de contrôle** : un petit cercle déplaçable, rayon 0,5 à 4 cm (curseur). Deux lentilles :
- **divergence** : sur le bord du cercle, la composante normale v·n en petits traits (orange sortant, bleu entrant) ; panneau : flux sortant net Φ (cm²/s), aire A, Φ/A (1/s) comparé à la divergence exacte au centre. Quand le rayon diminue, Φ/A → div.
- **rotationnel** : la composante tangentielle v·t sur le bord ; circulation C (cm²/s), C/A comparé au rotationnel exact ; un **moulinet** (4 palettes) au centre tourne à ω = rot/2 (rad/s, vitesse réelle, sens réel). Bouton **Lâcher le moulinet** : il est emporté par le courant (RK2) et tourne selon le rotationnel local ; on voit dans le tourbillon libre qu'il fait le tour en gardant son orientation.

Préréglages (paramètres par défaut, centre de la scène) : uniforme (U = 3 cm/s, α = 0) ; source (Q = +60 cm²/s) ; puits (Q = −60) ; tourbillon libre (Γ = +60) ; rotation d'ensemble (ω = 0,3 rad/s) ; cisaillement (γ = 0,3 1/s, centré) ; dipôle (source + puits à ±6 cm). Rayon de cœur a = 1 cm.

### Modes
1. **Champ** — préréglages, flèches + traceurs. Sonde : v (vx, vy, |v|, direction). Message : une flèche par point ; comparer avec A, où il n'y avait qu'un nombre.
2. **Divergence** — lentille divergence, carte de divergence en option. Situations guidées en boutons : « au cœur d'une source », « loin de la source », « courant uniforme », « au cœur d'un puits ». Message : la divergence mesure ce qui **naît** (ou disparaît) dans un petit volume ; loin de la source, elle est nulle bien que les flèches s'écartent.
3. **Rotationnel** — lentille rotationnel, moulinet. Situations guidées : « rotation d'ensemble », « tourbillon libre, loin du cœur », « tourbillon libre, au cœur », « cisaillement ». Message : le rotationnel mesure la tendance d'un petit élément à **tourner sur lui-même**, pas le fait que les flèches fassent un cercle.
4. **Composer** — palette d'éléments (source, puits, tourbillon +, tourbillon −) qu'on pose d'un clic, déplace, règle (molette), supprime ; courant uniforme réglable en fond. Les deux cartes calculées. Le panneau introduit la notation compacte : `∇·v` (divergence) et `∇×v` (rotationnel), en rappelant qu'elles ne disent rien de plus que les deux lentilles.

## Laboratoire C · « Ce qui traverse » (flux)

### Modes
1. **Fenêtre** — courant uniforme (intensité U réglable 0 à 5 cm/s, direction réglable), traceurs uniformément répartis (densité n fixe, particules par cm²). Une **fenêtre** : segment de longueur L (1 à 12 cm) qu'on déplace (centre) et oriente (poignée) ; sa normale n̂ est une flèche `--accent`. On dessine le **tube de courant** qui passe par la fenêtre (bande ombrée de largeur L |cos θ| en amont). Φ = U · L · cos θ (cm²/s). Les traceurs qui franchissent la fenêtre clignotent (orange dans le sens de n̂, bleu contre) ; compteur de franchissements par seconde (moyenne glissante sur 3 s) comparé à n · Φ. Panneau : les trois facteurs (intensité, taille, orientation cos θ) en barres, leur produit.
2. **Champ non uniforme** — même fenêtre dans un préréglage de B (source, tourbillon, cisaillement, dipôle). Le long de la fenêtre, v·n̂ en barres (orange/bleu). Φ = Σ v·n̂ Δs (60 points). Message : quand le champ varie, on additionne des petits morceaux.
3. **Surface fermée** — une courbe fermée déplaçable : cercle (rayon réglable) ou polygone à 6 sommets qu'on déforme en glissant ses sommets. Deux ou trois éléments (sources, puits, tourbillons) déplaçables, dedans ou dehors. Barres v·n̂ sur le pourtour. Panneau : flux net sortant Φ, et Σ Q des sources à l'intérieur (pondérées par la part du cœur incluse : afficher la valeur exacte calculée par intégration de la divergence sur la région, ou simplement Σ Q si le cœur est entièrement dedans). Message : le flux net qui sort d'une surface fermée ne dépend que de ce qui est produit **dedans**, pas de la forme. C'est l'idée du théorème de Gauss (nommé, pas démontré). Un tourbillon dedans ne change rien au flux net.
4. **Boucle dans un champ** — vue en perspective légère (projection oblique fixe) : champ uniforme B (lignes parallèles, B = 0 à 50 mT), boucle rectangulaire d'aire A (10 à 100 cm²) qui tourne autour d'un axe vertical (angle réglable ou rotation lente « Tourner »). Φ = B · A · cos θ en µWb (1 mT × 1 cm² = 0,1 µWb). Petit graphe Φ(θ). Message : même géométrie que la fenêtre ; quand ce flux change dans le temps, une tension apparaît dans la boucle (loi de Faraday, électricité et magnétisme). Pas de calcul de tension ici.

## Laboratoire D · « Pression et débit » (fluide dans un conduit)

Un tube vu en coupe longitudinale, trois tronçons en série : L₁ = 4 cm de diamètre D₁, L₂ = 2 cm de diamètre D₂ (rétrécissement), L₃ = 4 cm de diamètre D₁. Raccords en cosinus sur 3 mm. Diamètres **exagérés à l'affichage** (échelle verticale ≠ horizontale, indiquée : « diamètres ×k »).

### Modèle (verrouillé)
Écoulement laminaire, permanent, d'un fluide newtonien incompressible (Poiseuille par tranche), plus le terme d'énergie cinétique de Bernoulli :

- Résistance : `R = ∫₀ᴸ 8μ / (π r(x)⁴) dx` (intégration numérique sur le profil, 400 pas). Pour un tronçon droit : `R = 8μL/(πr⁴)`.
- Débit : `Q = ΔP / R` (entrée et sortie ont la même section : les termes cinétiques s'annulent dans le bilan global ; pertes de raccord négligées).
- Vitesse moyenne : `v̄(x) = Q / A(x)`, `A = πr²` (**continuité**). Profil : `u(η) = 2 v̄ (1 − η²)`, η = distance à l'axe / r(x) ; un traceur garde son η dans les raccords.
- Pression (relative à la sortie) : `p(x) = ΔP − Q · ∫₀ˣ 8μ/(π r⁴) dx' − ½ ρ (v̄(x)² − v̄(0)²)`. p(L) = 0 exactement. Dans le col, la pression peut descendre sous la pression de sortie (effet Venturi) : l'afficher tel quel.
- Reynolds par tronçon : `Re = ρ v̄ D / μ`. Si Re > 2000 quelque part : bandeau « régime turbulent probable : hors du modèle (le débit réel serait plus faible) ».
- Fluides (préréglages) : eau (μ = 1,0 mPa·s, ρ = 1000 kg/m³), sang (3,5 mPa·s, 1060 ; traité comme newtonien), huile d'olive (80 mPa·s, 910), glycérine (1,4 Pa·s, 1260), miel (10 Pa·s, 1420).
- Réglages : ΔP sur échelle logarithmique 1 Pa à 5 kPa (affichée aussi en mmHg, 1 mmHg = 133,3 Pa, et en cm d'eau) ; D₁ de 1 à 4 mm ; D₂/D₁ de 0,25 à 1 ; fluide. Valeurs par défaut : eau, ΔP = 40 Pa, D₁ = 3 mm, D₂/D₁ = 0,5.
- **Temps d'affichage** : un facteur de temps (ralenti ou accéléré) est choisi pour que v̄ dans le tronçon large fasse ≈ 120 px/s à l'écran, **recalculé seulement** quand on change de fluide ou de D₁, ou par le bouton « Recaler la vitesse » ; jamais pendant qu'on règle ΔP ou D₂ (sinon on ne verrait plus leur effet). Le facteur est toujours affiché (« ralenti ×12 », « accéléré ×300 »).

### Scène
Le fluide est coloré par sa pression (rampe neutre de la page, la même que la pression du laboratoire A) ; traceurs qui suivent le profil parabolique ; **piézomètres** (5 tubes verticaux : deux sur L₁, un au col, deux sur L₃) dont la colonne monte à h = p/(ρg) (en cm) au-dessus de l'axe ; trois **portes de comptage** (une par tronçon) qui affichent A, v̄ et A·v̄. Sous le tube, le graphe p(x), avec la part Bernoulli en tireté.

### Modes
1. **Débit et continuité** — portes de comptage et traceurs en vedette. Q identique aux trois portes ; v̄ plus grande dans le col (×(D₁/D₂)²). `Q = A · v̄`. Lien : le volume se conserve, la divergence de la vitesse est nulle (renvoi à B).
2. **La pression pousse** — piézomètres et graphe p(x) en vedette ; ΔP réglable ; petit graphe Q en fonction de ΔP (droite par l'origine, pente 1/R, point courant). Message : ce n'est pas la pression qui fait couler, c'est sa **différence** ; le fluide descend le gradient de pression (renvoi à A, mode 4).
3. **Résistance et viscosité** — fluide et diamètres ; une coupe transversale déplaçable affiche le profil parabolique des vitesses (flèches) ; tableau R₁, R₂, R₃, R total ; analogie `ΔP = R · Q` ↔ `U = R · I`. Repère : diviser le rayon par 2 multiplie la résistance par 16.
4. **Rétrécissement** — décomposition de la baisse de pression : frottement (permanent, chaleur) et accélération (Bernoulli, rendue à la sortie du col). Comparer eau (creux de Venturi marqué, remontée après le col) et miel (chute presque toute visqueuse). Bernoulli est nommé ici seulement : `p + ½ρv²` se conserve le long d'un filet **sans frottement**.

## Ce que l'on simplifie (à documenter dans explication.html)
- Tout est en 2D (A, B, C) ou en modèle 1D par tranche (D) ; « surface » = segment ou courbe, flux par unité de profondeur.
- Champs adoucis au cœur (rayon a) pour éviter l'infini.
- A : état stationnaire imposé, pas de dynamique de diffusion (la planche 07 la montre).
- C, mode 3 : Gauss sans démonstration ; mode 4 : Faraday seulement nommé.
- D : laminaire, newtonien, permanent, tube rigide, raccords sans perte, pas de gravité dans l'écoulement (tube horizontal), pas de turbulence ; le sang n'est pas newtonien et les vaisseaux sont élastiques et ramifiés.
- Hors champ : Navier–Stokes, turbulence, CFD, calcul vectoriel formel, démonstrations de Gauss et Stokes, fluides non newtoniens.

## Ce qui est illustratif
Les couleurs des cartes, les traceurs de A (mode 4), la longueur plafonnée des flèches, la vue en relief, l'exagération des diamètres, le facteur de temps de D.

## Interface, accessibilité, performance
- Micro-interaction de découverte : survoler un foyer, une flèche, la sonde, la fenêtre, un piézomètre, une porte → nom et rôle en une ligne (`FX.tip`).
- Clavier : `1`–`4` = laboratoire (coquille) ; dans chaque laboratoire, `Q` `W` `E` `R` = modes 1 à 4 ; `Espace` = pause des traceurs ; `0` = réinitialiser le laboratoire.
- Responsive jusqu'à 375 px, sans défilement horizontal ; toute interaction de glisser fonctionne au doigt (événements pointer, `touch-action:none` sur le canevas).
- Rien d'important sous l'en-tête (`FX.headRect()`).
- `prefers-reduced-motion` : traceurs plus lents et moins nombreux, pas de transitions animées.
- Aucune erreur console. Canevas à l'échelle de `devicePixelRatio`. Champs scalaires calculés sur une grille basse résolution (ImageData puis `drawImage` agrandi, lissé), recalculés seulement quand les foyers changent.
