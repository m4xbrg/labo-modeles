# Fondations · Non-linéarité, stabilité et chaos (module 08)

Dossier de sortie : `opus-sonnet/fondations-chaos/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 08`, titre « Stabilité, bifurcations et *chaos* ». Accent : `--accent: #d7a0e8;` (mauve pâle). Budget : ≈ 0,8 ADN, **un chapitre de 4 étapes**.

**Statut particulier.** Le module 08 est aujourd'hui `partial` grâce à *Systèmes, croissance et hasard* (`../fondations-systemes-hasard/` : stabilité d'un équilibre en 1D, logistique continue). Cette page le complète : espace des phases en 2D, bifurcations, sensibilité aux conditions initiales, attracteurs. Elle rend possible le showcase sélectionné « Double pendule et chaos », qui pourra alors se concentrer sur le pendule lui-même sans réexpliquer le chaos. Le double pendule apparaît ici à l'étape 3 comme démonstration, pas comme objet d'étude complet.

Préalables conseillés : 04 (systèmes dynamiques, points d'équilibre), 05 (exponentielle, logarithme), 14 (pendule, amortissement).

## Intention

À la fin, l'étudiant sait que **des équations parfaitement déterministes peuvent produire des comportements imprévisibles à long terme**, parce que de minuscules écarts y croissent exponentiellement, et que ce chaos a pourtant une structure (bifurcations, attracteurs). Intuitions à rendre évidentes, par ordre de priorité :

1. Deux doubles pendules lancés avec un milliardième de radian d'écart suivent le même chemin quelques secondes, puis n'ont plus rien à voir : l'écart croît exponentiellement (étape 3, moment fort).
2. Un équilibre est stable si une petite perturbation se résorbe ; l'espace des phases montre d'un coup d'œil tous les comportements possibles (étape 1).
3. En tournant un seul bouton, un système simple passe d'un équilibre à un cycle, puis à des cycles de période 4, 8…, puis au chaos ; les doublements s'accélèrent selon un rapport universel (étape 2).
4. Le chaos n'est pas du désordre : les trajectoires restent sur un attracteur qui a une forme précise ; on ne peut pas prédire où l'on sera, mais on sait sur quoi (étape 4).
5. L'horizon de prévision ne grandit qu'en logarithme de la précision : mesurer mille fois mieux ne fait gagner que quelques temps caractéristiques (étape 4).

Interdits : « le chaos, c'est le hasard », « l'effet papillon : un papillon provoque une tornade » sans nuance.

## Réutilisation (ne pas reconstruire)

- Points d'équilibre, stabilité en 1D, logistique continue : `../fondations-systemes-hasard/`. L'étape 1 passe en 2D ; l'étape 2 utilise la logistique **discrète**, la page le dit.
- Pendule, amortissement, petits angles : `../fondations-oscillations-ondes/` (module 14). L'étape 1 montre où l'approximation des petits angles cesse de valoir.
- Énergie mécanique conservée : `../fondations-forces-energie/`.
- Exponentielle, temps caractéristique : `../fondations-systemes-hasard/` (module 05).

## Moteur (à écrire et tester avant la page)

Bloc `/* CHAOS-BEGIN */ … /* CHAOS-END */`, objet `Chaos`.

- **Pendule simple** : `pendulumRHS(state, {g, L, damping})` (non linéaire, sin θ) ; `rk4` ; `phasePortrait(params, grid)` (champ de vecteurs) ; `separatrix(params)` ; `periodVsAmplitude(theta0)` (intégrale elliptique, comparée à 2π√(L/g)).
- **Pendule aimanté** (bassins, étape 1, option) : pendule au-dessus de trois aimants, amorti ; `basin(x0, y0)` → aimant final ; `basinMap(res)`.
- **Logistique discrète** : `logisticMap(r, x)` ; `orbit(r, x0, n)` ; `cobweb(r, x0, n)` ; `bifurcation(rMin, rMax, nr, transient, keep)` ; `lyapunovLogistic(r, n)`.
- **Double pendule** : équations du mouvement (masses et longueurs égales par défaut, documentées), intégrateur d'ordre élevé à pas fixe (RK4 avec petit pas, ou intégrateur symplectique en coordonnées canoniques ; justifier le choix par le test d'énergie) ; `separation(a, b)` (distance dans l'espace des phases) ; `lyapunovEstimate(state, d0, T)` (méthode de renormalisation de Benettin).
- **Lorenz** : `lorenzRHS({sigma: 10, rho: 28, beta: 8/3})`, `lorenzStep`, projections et section de Poincaré (plan z = ρ − 1).

### Tests du moteur

1. Pendule : à 5° la période vaut 2π√(L/g) à 0,05 % ; à 90° elle est plus longue de 18,0 % ; à 170°, plus de deux fois plus longue (comparaison avec l'intégrale elliptique).
2. Sans amortissement, énergie conservée à 10⁻⁸ sur 100 périodes ; avec amortissement, toutes les trajectoires sous la séparatrice convergent vers (0, 0).
3. Logistique : point fixe stable pour 1 < r < 3 (x* = 1 − 1/r) ; doublements à r₁ = 3, r₂ = 3,449 49, r₃ = 3,544 09, r₄ = 3,564 41 (à 10⁻⁴) ; rapport (r₃ − r₂)/(r₄ − r₃) proche de δ = 4,669 (à 2 %) ; fenêtre de période 3 vers r = 3,828 4.
4. Exposant de Lyapunov de la logistique : λ(4) = ln 2 à 1 % ; λ < 0 dans les régimes périodiques.
5. Double pendule : énergie conservée à 10⁻⁶ relatif sur 100 s ; pour un lancer à 120° et 0°, deux trajectoires séparées de 10⁻⁹ rad divergent exponentiellement (ajustement linéaire de ln(séparation) sur la phase de croissance, R² > 0,95), exposant positif documenté.
6. Lorenz : plus grand exposant de Lyapunov ≈ 0,906 à 5 % ; les trajectoires restent bornées ; pour ρ = 20, elles convergent vers un point fixe.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| trajectoire dans l'espace des phases | trait `--accent` avec traînée qui s'estompe |
| champ de vecteurs | petits traits `--texte-2` |
| équilibre stable / instable | disque plein `--texte` / cercle vide `--texte` |
| séparatrice | tireté `--energie` |
| deux trajectoires jumelles | `--positif` / `--negatif` |
| diagramme de bifurcation | points `--texte` à faible opacité (densité) |
| bassins d'attraction | trois teintes désaturées, une par aimant |

## Chapitre · Module 08 · Non-linéarité, stabilité et chaos

### Étape 1 · Équilibres et espace des phases
- Scène : à gauche, un pendule rigide qui peut faire le tour ; à droite, son espace des phases (θ, ω) avec le champ de vecteurs, les deux équilibres (bas : stable, haut : instable) et la séparatrice. On lance le pendule en cliquant dans l'espace des phases : la trajectoire s'y dessine, le pendule bouge en même temps. Bascule « Approximation des petits angles » : les trajectoires linéaires (ellipses parfaites) superposées en tireté, justes au centre, fausses près de la séparatrice.
- Contrôles : amortissement, clic de lancement, bascule petits angles ; option « Pendule aimanté » (bascule de scène) : la carte des bassins d'attraction de trois aimants, avec ses frontières enchevêtrées.
- Panneau : θ, ω, énergie, type de mouvement (oscillation, rotation), période mesurée comparée à 2π√(L/g). Statuts : près de l'équilibre du haut « Un équilibre instable : un écart infime grandit » ; avec amortissement « Toutes les trajectoires finissent au même point : c'est un attracteur » ; aimants « Deux départs voisins, deux aimants différents : la frontière entre les bassins est d'une finesse infinie ».
- Phrase-clé : « L'espace des phases montre tous les comportements d'un système d'un seul coup d'œil. Un équilibre est stable si les trajectoires voisines y reviennent, instable si elles s'en écartent. »
- Note : pendule rigide, sans frottement par défaut.

### Étape 2 · Bifurcations
- Scène : en haut, la toile d'araignée (cobweb) de la logistique discrète x → r x (1 − x) ; en bas, le diagramme de bifurcation qui se construit au fur et à mesure qu'on balaie r ; un trait vertical marque le r courant. Une petite série temporelle xₙ à droite.
- Contrôles : r (2,5 à 4, avec un zoom sur une région du diagramme), x₀.
- Panneau : r, période détectée, exposant de Lyapunov, valeurs de r aux doublements mesurées et rapport des intervalles. Statuts : « Un seul bouton, et le comportement change de nature : équilibre, puis cycle de 2, de 4, de 8… » ; dans la fenêtre de période 3 « Au milieu du chaos, une fenêtre d'ordre » ; rapport « Chaque doublement arrive environ 4,67 fois plus vite que le précédent : le même nombre pour une foule de systèmes ».
- Phrase-clé : « En faisant varier un seul paramètre, un système non linéaire peut passer de l'équilibre au cycle, puis au chaos, par doublements de période successifs. »
- Note : logistique **discrète** (une génération à la fois), différente de la logistique continue de la fondation 04.

### Étape 3 · Sensibilité aux conditions initiales (moment fort)
- Scène : deux doubles pendules superposés, l'un `--positif`, l'autre `--negatif`, lancés avec un écart réglable (10⁻³ à 10⁻¹² rad). Pendant quelques secondes, on ne voit qu'un seul pendule ; puis les couleurs se séparent et les deux n'ont plus rien en commun. En dessous, le logarithme de la séparation en fonction du temps : une droite (croissance exponentielle) puis un plateau (saturation).
- Contrôles : écart initial (échelle log), angle de départ (petits angles : pas de chaos ; grands angles : chaos), bouton « Relancer ».
- Panneau : séparation, exposant estimé, temps de divergence mesuré, prévision « si l'écart était dix fois plus petit, on gagnerait seulement … s ». Statuts : petits angles « À faible énergie, le double pendule est sage : l'écart reste petit » ; grands angles « Diviser l'écart initial par 1 000 ne fait gagner que quelques secondes de prévision ».
- Phrase-clé : « Dans un système chaotique, deux états de départ presque identiques s'écartent exponentiellement. Les lois sont déterministes, mais la prévision à long terme est impossible en pratique. »
- Note : double pendule idéal (tiges sans masse, sans frottement), intégration numérique vérifiée par la conservation de l'énergie. Showcase dédié à venir (Atlas).

### Étape 4 · Attracteurs étranges
- Scène : l'attracteur de Lorenz en 3D (rotation à la souris), une trajectoire qui le parcourt, passant d'une aile à l'autre de manière imprévisible. Bascule « Nuage de 1 000 départs » : 1 000 points partis d'une toute petite boule s'étalent le long de l'attracteur sans le quitter. Section de Poincaré en encart.
- Contrôles : ρ (10 à 35 : point fixe, puis chaos), bascule nuage, vitesse.
- Panneau : ρ, régime, plus grand exposant de Lyapunov, horizon de prévision pour une précision donnée (curseur de précision, résultat en temps de Lyapunov). Statuts : nuage « Impossible de dire où sera chaque point, mais tous restent sur la même forme » ; précision ×1 000 « Mille fois plus précis, seulement sept temps caractéristiques de plus (ln 1 000 ≈ 6,9) ».
- Phrase-clé : « Le chaos a une structure : les trajectoires restent sur un attracteur de forme précise. On ne peut pas prédire où l'on sera dessus, mais on sait sur quoi l'on sera. »
- Fin de planche, trois questions ouvertes : **Météo** « Pourquoi peut-on prévoir le climat mais pas la météo dans un mois ? » → seulement introduit (Atlas) ; **Collectif** « Des systèmes faits de milliers d'éléments sont-ils plus ou moins prévisibles ? » → modules 41 · 42 ; **Signal** « Que montre le spectre d'un signal chaotique ? » → module 09.

## Micro-interactions de découverte

Pendule, espace des phases, équilibre stable, équilibre instable, séparatrice, bassin, aimant, toile d'araignée, diagramme de bifurcation, fenêtre de période 3, double pendule, courbe de séparation, attracteur de Lorenz, section de Poincaré.

## `window.__labo` (en plus du socle)

`launchPendulum(theta, omega)`, `setDamping(c)`, `smallAngle(on)`, `magnets(on)` (1) ; `setR(r)`, `setX0(x)`, `zoom(r1, r2)` (2) ; `setOffset(d)`, `setAngle(deg)`, `relaunch()` (3) ; `setRho(rho)`, `cloud(on)`, `setPrecision(p)` (4).

## Théorie (explication, module 08)

- Relations : système \(\dot{\mathbf x} = \mathbf f(\mathbf x)\), point fixe \(\mathbf f(\mathbf x^*) = 0\) ; stabilité par le signe de la dérivée (1D) ou des valeurs propres de la jacobienne (2D, seulement introduit) ; logistique \(x_{n+1} = r\,x_n(1 - x_n)\), stabilité si \(|f'(x^*)| \lt 1\) ; \(\delta(t) \approx \delta_0\,e^{\lambda t}\) ; horizon \(t_p \approx \dfrac{1}{\lambda}\ln\dfrac{\Delta}{\delta_0}\) ; \(\delta_F = \lim \dfrac{r_n - r_{n-1}}{r_{n+1} - r_n} \approx 4{,}669\).
- Exemple chiffré possible : horizon de prévision d'un système avec λ = 1/s quand on passe d'une précision de 10⁻³ à 10⁻⁶ ; ou stabilité du point fixe de la logistique à r = 2,8.
- Pièges : « chaotique = aléatoire » ; « le chaos demande beaucoup de variables » (trois suffisent en continu, une en discret) ; « avec un ordinateur assez puissant on pourrait tout prévoir » ; « un système linéaire peut être chaotique » ; « l'effet papillon dit qu'un papillon cause une tempête ».
- Où ça resservira : 04 (stabilité), 14 (pendule), 37 (boucles qui oscillent), 41 · 42 (populations), 09 (spectres), Atlas : double pendule, météo, trois corps, billard.
- Seulement introduit ici : jacobienne et valeurs propres en 2D, dimension fractale, théorème KAM, chaos hamiltonien, contrôle du chaos.

## Honnêteté

Pendules idéaux ; logistique discrète ; double pendule intégré numériquement avec contrôle de l'énergie ; exposants estimés numériquement ; Lorenz est un modèle simplifié de convection, pas l'atmosphère.

## Hors champ

Théorie ergodique, chaos quantique, turbulence, systèmes de dimension infinie.
