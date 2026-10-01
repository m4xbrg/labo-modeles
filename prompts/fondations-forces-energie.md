# Fondations · Forces, énergie et conservation (modules 10 et 11)

Dossier de sortie : `opus-sonnet/fondations-forces-energie/`. Accent : `--accent: #d6c4ff;` (lilas pâle : interface, force résultante ΣF, accélération). Même charte que la série (`00-direction-artistique.md`), même gabarit que la planche 05 (scène, titre discret, panneau de lecture, barre de contrôles, stepper d'actes, infobulle de découverte, clavier).

En-tête : `L’invisible en mouvement — Fondations 10·11`, titre « Forces, énergie et *conservation* ».

## Intention

Un laboratoire de mécanique en trois paillasses reliées, pas un moteur universel. À la fin, devant n'importe quel système mécanique, l'étudiant doit se demander spontanément : quelles forces ? quelle résultante ? pourquoi ça accélère ou pas ? où est l'énergie, sous quelle forme, quel travail ? quelle quantité de mouvement, qu'est-ce qui est conservé ?

Ce que la page doit casser : la caricature « force = mouvement ». Une force **résultante** change la vitesse ; sans résultante, la vitesse persiste.

Moment fort : la collision (acte V), où l'on voit **en même temps et synchronisés** le mouvement, les forces de contact, les transferts d'énergie et la quantité de mouvement, avec un ralenti et une remontée dans le temps.

## Code couleur (le même partout dans la page)

- Forces individuelles (poids, normale, F₁, F₂, frottement, poussée) : flèches fines `--texte`, étiquette en mono. Poids et normale aussi dessinés (ils s'annulent : c'est une leçon, pas un décor).
- **Force résultante ΣF** : flèche épaisse `--accent`, tracée sous l'objet, partant de son centre. Accélération `a` : petite flèche `--accent` en tirets, longueur ∝ ΣF/m (visiblement plus courte quand la masse augmente).
- Vitesse `v` : flèche fine `--texte-2`.
- Quantité de mouvement `p = mv` (grandeur signée en 1D) : `--positif` si p > 0 (vers la droite), `--negatif` si p < 0. Une barre ou flèche Σp distincte, plus épaisse.
- Énergie : toutes ses formes dans la famille `--energie` (c'est la même grandeur), distinguées par la texture : cinétique K = plein ; potentielle U (gravité ou ressort) = contour + hachures ; dissipée E_th (chaleur, déformation) = jaune à 35 % d'opacité ; travail fourni par la poussée W = contour en tirets qui « entre » dans la barre.

## Modèle physique (verrouillé)

Unités SI réelles affichées (kg, N, m, m/s, J, W, N·s). g = 9,81 m/s². Échelle d'affichage : une constante `PX_PER_M` par paillasse, adaptée à la taille de la scène. Intégration à pas fixe découplée de l'affichage (accumulateur), sous-pas fins (voir chaque paillasse). Tout le moteur dans un objet `Phys` de fonctions pures (état in → état out), exposé avec l'état courant dans `window.__labo` pour les tests.

### Paillasse A — corps ponctuel sur rail horizontal (actes I à III)
- Objet = bloc de masse m (0,5 à 5 kg) sur un rail infini. **La caméra suit l'objet** : ce sont les graduations du rail (tous les 0,5 m, numérotées en m) qui défilent ; c'est elles qui montrent la vitesse.
- Forces horizontales : F₁ (vers +x, 0 à 10 N), F₂ (vers −x, 0 à 10 N), poussée tenue au bouton (±F_p, F_p = 6 N), frottement optionnel.
- Frottement (optionnel, case à cocher) : cinétique µ_k = 0,15 opposé à v si |v| > 1e-4 ; statique µ_s = 0,20 : si v ≈ 0 et |F_appliquée| ≤ µ_s·m·g, l'objet reste immobile (frottement = −F_appliquée). Si le frottement cinétique seul ferait changer v de signe pendant un pas, v = 0 exactement.
- Verticalement : poids m·g vers le bas et normale N = m·g vers le haut, dessinés, résultante verticale nulle.
- Mise à jour exacte pour une force constante sur le pas : `x += v·dt + ½·a·dt²`, `v += a·dt`, `a = ΣF/m`. dt = 1/240 s.
- Acte III (action-réaction) : deux chariots m₁, m₂ (0,5 à 4 kg) au repos, un ressort comprimé entre eux (k = 300 N/m, compression initiale 0,12 m, verrouillé). « Relâcher » : force k·c sur chacun, opposées, tant que c > 0 ; puis le ressort (fixé à m₁) se décolle de m₂. Caméra fixe. Intégration Verlet vitesse, dt = 1/2000 s.

### Paillasse B — chariot sur une piste en profil (acte IV)
- Piste y = h(x) définie analytiquement (une vallée douce avec une bosse au milieu et deux remontées hautes aux extrémités, hauteur max ≈ 2,5 m sur ≈ 10 m). Précalculer une table d'abscisse curviligne s(x) ; le chariot est un point qui se déplace le long de s.
- Équation : `m·s̈ = −m·g·sinθ(s) + F_poussée − frottement`, θ = pente locale. Frottement optionnel : µ = 0,05, `f = µ·m·g·cosθ` opposé à v (le terme centripète de la normale est négligé : à dire dans l'explication).
- Intégration Verlet vitesse (ou RK4), dt = 1/1000 s. Exigence : sans frottement ni poussée, dérive de K+U < 0,1 % sur 60 s.
- Bouts de piste : si le chariot atteint une extrémité, il est arrêté par une butée (v = 0, l'énergie cinétique restante passe dans E_th, comptée honnêtement).
- Comptes d'énergie, mis à jour à chaque sous-pas : K = ½mv², U = m·g·h (référence h = 0 au point le plus bas, tracée en tireté « référence choisie »), E_th += f·|v|·dt, W += F_poussée·v·dt. Puissance de la poussée P = F·v, puissance du poids P_g = −m·g·sinθ·v. **Bilan affiché** : K + U + E_th − W = E₀ (écart en J, doit rester ≈ 0).
- Interaction : glisser le chariot le long de la piste pour choisir son point de départ (au repos), bouton poussée tenu (le long de la tangente, vers l'avant ou l'arrière), masse 0,5 à 5 kg.

### Paillasse C — collision 1D sur rail à coussin d'air (actes V et VI)
- Deux chariots de masses m₁, m₂ (0,5 à 3 kg), vitesses initiales v₁, v₂ (−2 à +2 m/s), coefficient de restitution e (0 à 1). Pare-chocs = ressort sans masse de longueur 0,16 m sur la face avant de chaque chariot ; compression totale δ.
- Contact hystérétique de Walton-Braun (exact pour e) : charge F = k₁·δ ; à δ_max la décharge suit F = k₂·(δ − δ₀) avec k₂ = k₁/e², δ₀ = δ_max·(1 − e²), et F ≥ 0 toujours (pas de traction). Énergie rendue = e² × énergie stockée. k₁ = 1500 N/m. Cas e = 0 : la décharge est instantanée, les deux chariots finissent à la même vitesse et restent collés (aucune règle spéciale de fusion nécessaire, mais vérifier qu'ils ne s'écartent pas par erreur numérique).
- Intégration Verlet vitesse, dt = 1/20000 s (le contact dure quelques centièmes de seconde).
- **Ralenti automatique** ×1/10 pendant le contact (et 0,15 s autour), avec une étiquette visible « ralenti ×10 ». Le temps affiché reste le temps physique.
- Enregistrement : chaque image enregistre l'état (x, v, F, énergies, impulsion). Après la collision, un curseur « temps » permet de **remonter et rejouer** l'enregistrement (en pause), toutes les vues suivent le curseur.
- Grandeurs : p₁, p₂, Σp (constante), impulsion J = ∫F dt reçue par m₂ (et −J par m₁) ; K₁, K₂, énergie élastique du pare-chocs E_el, énergie dissipée E_th ; total K₁+K₂+E_el+E_th = constante. Centre de masse : petit repère « CM », vitesse constante. Après le contact, e mesuré = −(v₂′ − v₁′)/(v₂ − v₁).
- Si les chariots ne se rencontrent jamais (vitesses qui s'éloignent), le dire dans le panneau.

## Mise en scène : six actes (stepper, comme la planche 05)

Les segments du stepper sont groupés par paillasse (petite étiquette A / B / C au-dessus). Fondu entre actes. Chaque acte a ses propres réglages (barre `tools`) : peu de curseurs, seulement ceux de l'acte.

I. **Inertie** (A) — rail sans frottement, bloc au repos. Boutons « ← Pousser » / « Pousser → » (maintenir ; aussi pointeur maintenu sur la moitié gauche/droite de la scène). Pendant la poussée, la flèche ΣF apparaît, v grandit. On lâche : ΣF = 0, **v reste constante**, les graduations continuent de défiler. Étiquette dans la scène au moment du relâchement : « ΣF = 0 · v constante ». Enregistreur : F_net(t) et v(t) superposés (deux échelles), fenêtre glissante de 10 s.
II. **Force résultante et masse** (A) — curseurs F₁, F₂, m, case frottement. Somme vectorielle tête-bêche des forces horizontales dessinée au-dessus du bloc, résultante en dessous. Mesures : ΣF, m, a mesurée (dv/dt sur l'enregistreur) et ΣF/m (doivent coïncider), v. Moments à rendre évidents : F₁ = F₂ avec v ≠ 0 → mouvement uniforme ; même ΣF, masse double → a deux fois plus petite ; avec frottement, pousser juste assez pour égaler le frottement → vitesse constante (« on pousse et pourtant ça n'accélère pas »).
III. **Action-réaction** (A) — deux chariots, ressort comprimé. « Relâcher ». Flèches F₁→₂ et F₂→₁ égales et opposées pendant toute la poussée ; accélérations inverses des masses ; à la fin m₁v₁ = −m₂v₂. Mesures : forces, a₁, a₂, impulsions, p₁, p₂, Σp = 0, énergie du ressort → K₁ + K₂ (le plus léger emporte le plus d'énergie).
IV. **Travail et énergie** (B) — piste en profil. Barres d'énergie dans la scène, attachées au coin supérieur droit : K, U, E_th, et le total ; et un **enregistreur empilé** dans le panneau (aire K + U + E_th en fonction du temps) où l'on voit l'énergie passer d'une forme à l'autre. Poussée (W, P), frottement (E_th), masse. Phrase-clé : le poids fait un travail −ΔU ; le frottement transforme en chaleur ; la poussée apporte de l'énergie de l'extérieur.
V. **Collision (moment fort)** (C) — préréglage : m₁ = m₂ = 1 kg, v₁ = 1,2 m/s, v₂ = 0, e = 1. « Lancer ». Au contact : ralenti, pare-chocs qui se compriment, flèches de force égales et opposées qui grandissent puis décroissent, K qui passe dans le ressort puis revient, p₁ qui se vide dans p₂ pendant que **Σp ne bouge pas**. Panneau : courbe F(t) avec aire ombrée = J ; barres p₁, p₂, Σp ; barre d'énergie empilée K₁, K₂, E_el, E_th. Puis curseur temps pour remonter. Préréglages en boutons : « Égales, élastique », « Lourd sur léger », « Léger sur lourd », « Collées (e = 0) ».
VI. **À toi** (C) — curseurs m₁, m₂, v₁, v₂, e ; mêmes vues. Le texte invite : quelle combinaison laisse un chariot immobile ? que vaut la perte d'énergie à e = 0 ? Σp change-t-il jamais ?

## Panneau de lecture

Numéro et titre de l'acte, 1 à 3 phrases, puis l'enregistreur (canvas, fenêtre glissante ou enregistrement de la collision) et des mesures en IBM Plex Mono, avec unités. La légende de l'enregistreur en SVG (comme 05).

## Ce qui est illustratif (à dire honnêtement dans la page et l'explication)
- Les flèches (forces, vitesse, quantité de mouvement, accélération) : des représentations de grandeurs, pas des objets. Les échelles de flèches sont fixes dans un acte et indiquées (« 1 N = n px »).
- Les barres et aires d'énergie : des comptes, pas une substance.
- Le ralenti : le temps affiché reste physique.
- Le repère CM : calculé, pas un objet.

## Interface, accessibilité, performance
- Micro-interaction de découverte : survoler une flèche, un objet, une barre d'énergie, le pare-chocs → nom + rôle en une ligne.
- Clavier : Espace = pause, ← → = acte, 1 à 6 = aller à l'acte, R = réinitialiser l'acte. Dans les actes I et IV, maintenir `A` / `D` = pousser à gauche / à droite (en plus des boutons).
- Responsive jusqu'à 375 px, sans défilement horizontal ; à moins de 861 px : scène, contrôles, panneau empilés (comme 05).
- `prefers-reduced-motion` : pas de fondus, ralenti conservé (il est pédagogique).
- Aucune erreur console. Canvas à l'échelle de `devicePixelRatio`. Pas de bibliothèque.
- Hors champ (modules propres) : rotation, moment cinétique, gravitation et orbites, oscillateur harmonique complet, fluides, relativité. Les ressorts ne servent ici que de réservoir d'énergie et de modèle de contact.
