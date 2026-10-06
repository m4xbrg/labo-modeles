# Fondations · Magnétisme et induction (module 23)

Dossier de sortie : `opus-sonnet/fondations-magnetisme-induction/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 23`, titre « Magnétisme et *induction* ». Accent : `--accent: #8a97f2;` (indigo pâle, la couleur du champ magnétique sur l'accueil LABO). Budget : ≈ 0,8 ADN, un `index.html` de l'ordre de 100 à 130 Ko, **un chapitre de 4 étapes**.

Elle prolonge la branche D après *Le champ électrique* (21) et *Courant et circuits* (22). Elle prépare 24 (onde électromagnétique), le moteur et la génératrice, le cyclotron, le pulsar.

## Intention

À la fin, l'étudiant sait que **le magnétisme est l'affaire des charges en mouvement** : un courant crée un champ magnétique, un champ magnétique dévie une charge en mouvement sans jamais changer sa vitesse, et un champ magnétique **qui change** à travers une boucle y fait naître une tension. Intuitions à rendre évidentes, par ordre de priorité :

1. Un aimant immobile près d'une boucle immobile ne produit **rien**, même très fort. C'est la **variation** du flux qui induit une tension (étape 3, moment fort).
2. La force magnétique est toujours perpendiculaire à la vitesse : elle courbe la trajectoire mais **ne fournit aucun travail** ; l'énergie cinétique ne bouge pas (étape 2, moment fort).
3. Le courant induit s'oppose à ce qui le crée : c'est pour cela qu'un aimant tombe lentement dans un tube de cuivre, et c'est la conservation de l'énergie, pas une règle de plus (étape 4).
4. Un courant crée un champ qui tourne autour de lui ; les lignes de champ magnétique se referment toujours : il n'existe pas de « charge magnétique » isolée (étape 1).

Interdits de formulation : « le courant induit veut s'opposer », « l'aimant attire le flux ». On écrit : « le courant induit crée un champ qui s'oppose à la variation ».

## Réutilisation (ne pas reconstruire)

- Champ, potentiel et force électrique : `../04-champ-electrique/` (module 21). Ici, E n'apparaît que comme rappel : F = qE pousse dans le sens du champ, F = qv × B pousse de côté.
- Courant, résistance, puissance RI², circuit RL : `../06-courant-circuits/` (module 22). Le courant induit circule dans un circuit de résistance R ; on ne refait pas la loi d'Ohm.
- Mouvement circulaire, accélération centripète : `../fondations-rotation-gravitation/` (acte I). Produit vectoriel et règle de la main droite : nouveaux ici, à poser proprement.
- Énergie, travail, puissance : `../fondations-forces-energie/`. Vitesse limite (rétroaction négative, retour exponentiel) : `../fondations-systemes-hasard/`.

## Moteur (à écrire et tester avant la page)

Bloc `/* MAG-BEGIN */ … /* MAG-END */`, objet global `Mag`, unités SI, μ₀ = 4π × 10⁻⁷ T·m/A.

- **Champ d'un courant** : `bWire(I, x0, y0, x, y)` (fil infini perpendiculaire au plan, sens `I > 0` = sortant ⊙) ; `bLoop(I, R, n)` → fonction (x, y) du champ dans le plan de coupe d'une spire de rayon R (Biot-Savart numérique, n segments) ; `bSolenoid(I, nTurns, L, R)` (somme de spires) ; `fieldLines(Bfn, seeds, opts)` (intégration RK4 des lignes, arrêt sur boucle fermée ou bord).
- **Charge dans B** : `borisStep(p, q, m, E, B, dt)` (pousseur de Boris, 3D), `larmor(q, m, v, B)` → `{r, T, f}`.
- **Flux et induction** : `flux(Bfn, loop)` (intégrale numérique sur la surface d'une spire plane, position et orientation données), `emf(fluxPrev, fluxNow, dt, N)` ; `generator({N, B, A, omega, t})` → `{phi, emf}`.
- **Barre sur rails** : `railStep(s, {m, g, B, L, R}, dt)` avec `s = {y, v}` (barre horizontale qui tombe entre deux rails verticaux reliés par R, champ perpendiculaire) → met à jour v, renvoie `{I, Fmag, Pmech, Pjoule}` ; `railTerminal(p)` = mgR/(B²L²).
- **Aimant dans un tube** (qualitatif pour l'étape 4) : `tubeStep(s, {k, m, g}, dt)` où la force de freinage vaut −k v (k nul pour un tube isolant).

### Tests du moteur

1. Fil, I = 10 A, r = 1 cm : B = 200 µT à 0,1 % près ; B ∝ 1/r sur 1 à 10 cm.
2. Centre d'une spire R = 5 cm, I = 1 A : B = μ₀I/(2R) = 12,57 µT à 0,5 % (n = 400 segments).
3. Solénoïde long (L = 50 cm, R = 2 cm, 500 spires, I = 1 A) : B au centre = μ₀nI = 1,257 mT à 2 % ; champ extérieur près du milieu < 5 % du champ intérieur.
4. Boris, proton à 10⁶ m/s dans B = 1 T : rayon 1,044 cm à 0,1 % ; |v| conservée à 10⁻⁹ près relatif après 1 000 tours ; période 65,6 ns (f ≈ 15,2 MHz) indépendante de v (vérifier à 10⁵ et 10⁶ m/s).
5. Vitesse parallèle à B : aucune déviation ; composante parallèle conservée → hélice de pas v∥·T.
6. Génératrice N = 100, B = 0,1 T, A = 0,01 m², f = 50 Hz : amplitude NBAω = 31,4 V à 0,5 % ; −dΦ/dt numérique = emf analytique à 1 %.
7. Spire immobile, aimant immobile : emf exactement 0 (pas de bruit numérique au-delà de 10⁻¹²).
8. Rails (m = 0,02 kg, B = 0,5 T, L = 0,2 m, R = 0,5 Ω) : vitesse limite mgR/(B²L²) = 9,81 m/s à 0,5 % ; à chaque pas, mgv = RI² + d(½mv²)/dt à 1 %.
9. Lignes de champ d'une spire : chaque ligne issue d'un germe à l'intérieur se referme (retour à moins d'un pas du départ).

## Code couleur

| Objet | Couleur et forme |
|---|---|
| champ **B** (lignes, flèches, aiguilles de boussole) | `--champ-b` (= `--accent`) ; pôle nord des aiguilles en `--champ-b`, pôle sud en `--texte-2` |
| courant conventionnel dans un fil, sens | `--positif` (points qui défilent dans le sens conventionnel) ; fil en coupe : ⊙ sortant, ⊗ entrant |
| charge + / électron | `--positif` / `--negatif` |
| force magnétique | flèche `--texte` épaisse ; vitesse : flèche fine `--texte-2` |
| f.é.m. et courant induits | `--induit` (flèches et points qui défilent) ; champ du courant induit : lignes `--induit` tiretées |
| flux à travers la spire | remplissage de la surface de la spire en `--champ-b` à opacité ∝ |Φ|, motif ⊙ ou ⊗ selon le signe |
| énergie (cinétique, chaleur) | famille `--energie` : plein = cinétique, pâle = dissipée par effet Joule |

## Chapitre · Module 23 · Magnétisme et induction

### Étape 1 · Le champ d'un courant
- Scène : vue en coupe. Sélecteur de source : « fil », « spire », « solénoïde », « aimant droit ». Une grille de 9 × 6 petites boussoles qui s'orientent avec une inertie amortie (ressort angulaire) ; lignes de champ fermées `--champ-b`, animées par un défilement lent dans le sens de B. Une sonde déplaçable affiche |B| et sa direction.
- Contrôles : curseur I (−20 à 20 A, défaut 10) ; pour le solénoïde, curseur « spires par cm » (2 à 20). Bouton « Inverser le courant ». Bascule « Champ terrestre » (ajoute un fond uniforme de 50 µT vers le nord : à 4 cm d'un fil de 10 A, les deux champs sont égaux et la boussole se met à 45° ; à 50 cm, le fil ne fait plus que 4 µT et la boussole montre le nord).
- « Aimant droit » : le même motif extérieur que le solénoïde ; une loupe montre l'intérieur de l'aimant comme une foule de petites boucles de courant alignées (« l'aimantation vient de courants à l'échelle atomique, module 50 »). Bouton « Couper l'aimant en deux » : deux aimants complets, chacun avec un nord et un sud.
- Panneau : B à la sonde (µT ou mT), distance r à la source, comparaison « × champ terrestre ». Statuts : en fil, « B tourne autour du fil ; à distance double, deux fois moins fort » ; en coupant l'aimant, « On n'obtient jamais un pôle seul : les lignes se referment toujours ».
- Phrase-clé : « Toute charge en mouvement crée un champ magnétique. Ses lignes ne partent de nulle part et n'arrivent nulle part : elles se referment. »
- Note : champ dessiné dans un plan de coupe ; aimant représenté par des boucles de courant microscopiques, modèle d'Ampère.

### Étape 2 · Une force qui ne travaille pas (moment fort)
- Scène : une chambre vue de dessus, B uniforme perpendiculaire à l'écran (motif ⊙ ou ⊗ discret en fond). Un canon injecte une particule ; sa trajectoire laisse une trace. À côté de la particule, en permanence : flèche v, flèche F, et l'angle droit entre les deux marqué. Dans le panneau, une barre « énergie cinétique » qui **ne bouge pas**.
- Contrôles : vitesse v (curseur, échelle log, 10⁵ à 10⁷ m/s), B (0,01 à 2 T), particule (« proton », « électron », « particule α »). Bouton « Tirer ». Bascule « Ajouter une composante le long de B » : vue inclinée, l'hélice apparaît.
- Sous-scène « fil dans un champ » (bouton bascule) : une tige parcourue par un courant entre les pôles d'un aimant, posée sur deux rails ; F = IL × B la pousse. Lien vers l'étape 4.
- Panneau : r, T, f, |v|, Ec ; enregistreur |v|(t) plat. Statuts : « Doubler la vitesse double le rayon, mais pas la période : chaque tour prend le même temps » ; électron : « Même champ, autre sens de rotation : le signe de la charge décide » ; avec composante parallèle : « Le long de B, aucune force : la particule file en hélice ».
- Phrase-clé : « La force magnétique est toujours perpendiculaire à la vitesse. Elle change la direction du mouvement, jamais sa vitesse : elle ne fournit aucun travail. »
- Note : rayons de quelques centimètres pour des protons à 10⁶ m/s dans 1 T ; la chambre est à l'échelle, le temps est ralenti d'environ 10⁸.

### Étape 3 · Le flux qui change (moment fort)
- Scène : une spire (ou bobine de N spires) reliée à un galvanomètre à aiguille ; un aimant droit qu'on **glisse à la souris** vers la spire et qu'on éloigne. Le remplissage de la spire montre le flux. Quand l'emf est non nulle, des points `--induit` défilent dans la spire et l'aiguille dévie.
- Contrôles : N (1 à 50 spires), bascule « Faire tourner la spire » (mode génératrice, curseur fréquence 0,2 à 5 Hz affichée ; B uniforme). Bouton « Laisser l'aimant immobile au centre de la spire ».
- Panneau : Φ (mWb), ε (mV ou V), I induit (R fixe affichée). Enregistreur à deux pistes alignées : Φ(t) en haut, ε(t) en bas, avec un curseur vertical commun : ε est la pente de Φ, au signe près. En mode génératrice : Φ en cosinus, ε en sinus, déphasage de 90° (renvoi à 06).
- Statuts : aimant immobile, même tout près : « Flux énorme, mais constant : ε = 0. Rien ne se passe » ; mouvement rapide : « Même déplacement, deux fois plus vite : deux fois plus de tension, pendant deux fois moins longtemps ». Le mot « induction » apparaît après le premier mouvement.
- Phrase-clé : « Une tension apparaît dans une boucle quand le flux magnétique qui la traverse change : ε = −N dΦ/dt. Peu importe comment il change : aimant qui bouge, boucle qui tourne, courant qui varie. »
- Note : champ de l'aimant calculé comme celui d'un solénoïde court ; résistance de la boucle fixe ; galvanomètre sans inertie.

### Étape 4 · Lenz : l'induction freine
- Scène A (défaut) : une barre conductrice tombe entre deux rails verticaux fermés en haut par une résistance R, dans un champ uniforme ⊗. Le courant induit `--induit` circule, la force magnétique sur la barre pointe vers le haut. Barres d'énergie à droite : puissance du poids mgv, chaleur RI², variation d'énergie cinétique.
- Scène B (bascule) : un aimant lâché dans un tube vertical, « cuivre » ou « plastique », deux tubes côte à côte. Dans le cuivre, des boucles de courant `--induit` apparaissent au-dessus et au-dessous de l'aimant (sens opposés), l'aimant descend lentement.
- Contrôles (scène A) : R (0,1 à 5 Ω), B (0,1 à 1 T), m (5 à 50 g). Bouton « Lâcher ». Bascule « Ouvrir le circuit » : plus de courant, chute libre.
- Panneau : v, v_limite, I, Fmag, mgv, RI². Enregistreur v(t) qui rejoint la limite en exponentielle. Statut à la limite : « Toute l'énergie que le poids fournit part en chaleur dans R ». Statut « circuit ouvert » : « Pas de courant, pas de force : on retrouve la chute libre ».
- Question affichée avant de révéler le sens du courant : « Et si le courant induit tournait dans l'autre sens ? » → réponse : la force accélérerait la barre, qui produirait plus de courant, qui l'accélérerait encore : de l'énergie à partir de rien. Lenz, c'est la conservation de l'énergie.
- Phrase-clé : « Le courant induit crée un champ qui s'oppose à la variation du flux. Toute génératrice résiste à qui la fait tourner : c'est le prix de l'électricité qu'elle produit. »
- Fin de planche, trois questions ouvertes : **Lumière** « Un champ électrique qui change crée-t-il à son tour un champ magnétique ? » → module 24 ; **Matière** « D'où vient le champ d'un aimant, s'il n'y a aucun fil dedans ? » → modules 26 et 50 ; **Mouvement** « Un champ magnétique vu par un observateur en mouvement est-il encore magnétique ? » → module 46.

## Micro-interactions de découverte

Boussole, ligne de champ, sonde, fil ⊙ et ⊗, spire, solénoïde, aimant et ses pôles, particule, flèches v et F, galvanomètre, surface de flux, barre, rails, résistance, tube.

## `window.__labo` (en plus du socle)

`setSource(kind)`, `setI(I)`, `cutMagnet()` (1) ; `fire(kind, v, B)`, `parallel(on)` (2) ; `moveMagnet(x)`, `spin(on, f)`, `setN(N)` (3) ; `drop()`, `setRail({R, B, m})`, `openCircuit(on)`, `tube(on)` (4).

## Théorie (explication, module 23)

- Relations : \(B = \mu_0 I / (2\pi r)\) (fil) et \(B = \mu_0 n I\) (solénoïde) ; \(\vec F = q\,\vec v \times \vec B\) et \(r = mv/(|q|B)\), \(f = |q|B/(2\pi m)\) ; \(\vec F = I\,\vec L \times \vec B\) ; \(\Phi = B A \cos\theta\) ; \(\varepsilon = -N\,\dd\Phi/\dd t\).
- Exemple chiffré possible : génératrice de vélo ou alternateur simple (N, B, A, f → tension crête et efficace) ; ou proton dans le champ d'une IRM de 3 T.
- Pièges : B et E confondus (la force magnétique n'est pas le long des lignes) ; « un champ fort induit une tension » (c'est la variation) ; oublier le signe de la charge ; « la force magnétique accélère » (elle courbe) ; règle de la main droite appliquée au sens des électrons ; flux confondu avec champ.
- Où ça resservira : 24 (onde EM, induction mutuelle de E et B), 22 (inductance, RL), 12 (moteur : couple sur une spire), 46 (E et B sont deux faces d'un même champ), 44 et l'idée « pulsar ».
- Seulement introduit ici : inductance propre et mutuelle, transformateur, matériaux ferromagnétiques, loi d'Ampère sous forme intégrale, courants de Foucault en détail.

## Honnêteté (une ligne par étape, et dans l'explication)

Champs dessinés en 2D (coupes) ; aimant = solénoïde équivalent ; particules sans rayonnement (une charge accélérée rayonne : module 24) ; galvanomètre idéal ; frottements de la barre négligés ; tube de cuivre modélisé par un freinage proportionnel à la vitesse.

## Hors champ

Équations de Maxwell complètes, courant de déplacement (24), magnétisme de la matière au-delà d'une phrase, effet Hall, supraconductivité, relativité du magnétisme (seulement la question finale).
