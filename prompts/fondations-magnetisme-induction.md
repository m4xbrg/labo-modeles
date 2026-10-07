# Fondations · Magnétisme et induction (module 23)

Dossier de sortie : `opus-sonnet/fondations-magnetisme-induction/` (`index.html` + `explication.html`). Charte : `00-direction-artistique.md`, intégralement. Normes : `corpus/standards.md`, intégralement (en-tête, théorie module par module, taille). Gabarit : **le même que `fondations-rotation-gravitation/index.html`** (scène canvas, titre discret, panneau de lecture à droite, enregistreur, mesures en Plex Mono, barre de contrôles, stepper d'actes groupés par paillasse, infobulle de découverte, clavier, fondu entre actes, `window.__labo`). Lis ce fichier en entier avant d'écrire une ligne et reprends sa coquille CSS, HTML et JS.

Production `fondations-magnetisme` (`corpus/productions.json`), la suivante de la feuille de route. Elle ouvre la seconde moitié de la branche **D · Électricité, magnétisme et lumière** : elle prolonge *Le champ électrique* (21) et *Courant et circuits* (22) et prépare l'onde électromagnétique (24).

- Surtitre : `LABO · Fondations 23`. Titre : « Magnétisme et *induction* ». Onglet : `Magnétisme et induction — LABO`. Retour : `← LABO` vers `../../labo/index.html`.
- Accent : `--accent: #45c9a0;` (vert d'induction, le `--induit` de `labo/labo.css` en thème sombre). Il porte l'interface et **tout ce qui est induit** : f.é.m., courant induit, force induite.
- Budget : ≈ 1 ADN. Un `index.html` autonome de l'ordre de 110 à 150 Ko. **Quatre actes** (une page à un module : 2 à 4 étapes, `standards.md` § 3), au plus trois ou quatre curseurs par acte, plus des boutons. Chaque acte peut regrouper deux ou trois scènes voisines derrière un sélecteur segmenté.

## Intention

À la fin, l'étudiant ne voit plus le magnétisme comme « ce que font les aimants », mais comme **l'autre face de l'électricité** : des charges en mouvement créent un champ magnétique ; un champ magnétique pousse les charges en mouvement ; un flux magnétique qui varie met des charges en mouvement. Intuitions à rendre évidentes, par ordre de priorité :

1. La force magnétique est toujours perpendiculaire à la vitesse : elle **courbe sans jamais accélérer**. L'énergie cinétique reste plate pendant que la trajectoire tourne (acte II, moment fort).
2. Ce n'est pas le flux qui produit une tension, c'est **sa variation**. L'aimant immobile au cœur de la bobine, le courant établi dans le primaire : flux maximal, f.é.m. nulle (acte III, moment fort).
3. Le courant induit **s'oppose à la variation** qui le crée, et ce n'est pas une règle à apprendre : sans ce signe, on fabriquerait de l'énergie à partir de rien (acte IV, moment fort).
4. Le champ magnétique naît des courants. Un aimant se comporte exactement comme une bobine, et ses lignes de champ se referment toujours : il n'y a pas de pôle seul (acte I).
5. La même loi, ε = −N dΦ/dt, couvre l'aimant qui bouge, la spire qui tourne et le courant qui s'établit (acte III).

Le phénomène vient **avant** le vocabulaire : « loi de Faraday », « loi de Lenz », « courants de Foucault », « sélecteur de vitesse » apparaissent après que l'étudiant a vu la chose (statut qui change, étiquette qui se révèle).

Pièges interdits partout (texte, statuts, infobulles) :
- Les pôles d'un aimant présentés comme des charges magnétiques, ou un pôle nord isolable.
- Les lignes de champ présentées comme des trajectoires, ou comme des objets qui « sortent » et « s'arrêtent ».
- Une force magnétique sur une charge immobile, ou un champ B qui « donne de l'énergie » à une charge.
- « Le flux crée une tension » ; « plus de flux = plus de tension ».
- Lenz résumé en « le courant induit s'oppose au champ » : il s'oppose à la **variation** du flux.
- « Le champ veut… », « l'aimant cherche à… », « la bobine résiste parce qu'elle n'aime pas… ». On écrit ce qui arrive.

## Réutilisation (ne pas reconstruire)

- Champ, lignes de champ, potentiel et tension : `../04-champ-electrique/index.html`. Lien discret dans la note de l'acte I (« les lignes de E commencent et finissent sur des charges ; celles de B se referment »).
- Courant, résistance, puissance P = RI², inductance RL : `../06-courant-circuits/index.html`. L'acte IV de 06 dit : « Pourquoi une bobine réagit ainsi aux variations de courant : c'est l'induction, sujet d'une planche à venir. » **Cette planche est la réponse** : lien dans le statut du segment « Deux bobines » de l'acte III et dans une carte de fin.
- Force, travail, énergie cinétique, conservation : `../fondations-forces-energie/index.html`. Lien dans les notes des actes II et IV.
- Mouvement circulaire, période, vitesse angulaire : `../fondations-rotation-gravitation/index.html`. Lien dans la note de l'acte II.
- Sinusoïdes, phase, quadrature : `../fondations-oscillations-ondes/index.html`. Lien dans le segment « Spire qui tourne » (Φ en cosinus, ε en sinus).
- Flux d'un champ à travers une surface : `../fondations-flux-fluides/index.html`. Lien dans le statut de l'acte III quand le mot « flux » apparaît.

## Moteur : verrouillé et déjà testé

Le moteur est écrit et vérifié (112 tests : spire contre Biot-Savart intégré, div B = 0, théorème d'Ampère, inductance mutuelle de Maxwell contre ∫ B·dA, bobine longue, aimant contre la formule du cylindre, lignes fermées, Boris contre r = mv/qB et T = 2πm/qB, sélecteur de vitesse, Faraday ∫ ε dt = −ΔΛ, sens de Lenz, génératrice, deux bobines, bilans d'énergie des rails et du tube). Il est dans le dépôt :

- `prompts/moteurs/magnetisme.js`
- `prompts/moteurs/magnetisme.test.js`

Copie **à l'identique** le bloc de `magnetisme.js` du marqueur `/* MAG-BEGIN */` au marqueur `/* MAG-END */` inclus (sans la dernière ligne `module.exports`) dans le `<script>` de la page. Ne modifie pas ces fonctions ; si tu as besoin d'un calcul de plus, écris-le hors du bloc. Le test vérifie que le bloc de la page est identique au moteur, puis le teste : `node prompts/moteurs/magnetisme.test.js opus-sonnet/fondations-magnetisme-induction/index.html` doit afficher `112 réussis, 0 échoués`.

Conventions (lis l'en-tête du fichier, il est court) :
- **SI partout**. Repère mathématique : x vers la droite, **y vers le haut**, z sort de l'écran. La page retourne y au dessin.
- Sources : `{kind:'fil', I, x, y}` (perpendiculaire à l'écran, I > 0 = sort de l'écran ⊙) ; `{kind:'spire', I, a, x, y}`, `{kind:'bobine', I, N, a, L, x, y}`, `{kind:'aimant', Br, a, L, x, y, dir}` (axe horizontal, I > 0 ou `dir = +1` : nord à droite) ; `{kind:'uniforme', bx, by}`. **Appelle `Mag.prepare(sources)` après tout changement de paramètre ou de position** (les spires représentatives sont mises en cache).
- `fieldAt(sources, x, y)` → `{bx, by, b}`, exact en 3D dans le plan de coupe (sources à symétrie axiale + fils). `crossings(src)` → points ⊙/⊗ à dessiner. `traceLine(sources, x0, y0, {ds, nmax, xmin, xmax, ymin, ymax, rStop})` → `{pts, closed}` ; `seeds(src, n)` → graines conseillées. `compassStep(st, bx, by, dt)` : aiguille amortie.
- `boris(p, q, m, E, B, dt)` (p : `{x,y,z,vx,vy,vz}`), `gyro(m, q, v⊥, B, v∥)` → `{r, T, f, omega, pas}`, `lorentz`, `drift(E, B)` ; constantes `QE`, `MP`, `MD`, `MA`, `ME`.
- `laplace(I, L, B)`, `swingEq`, `swingStep(st, {I, L, B, m, ell}, dt)`, `wiresForce`.
- Bobine réceptrice `{N, b, x, y, L}` : `linkage(sources, coil)` → Λ = NΦ (Wb), `fluxPerTurn`, `dLinkageDx(src, coil)`, `emfMoving(src, coil, vx)` ; signe : flux compté selon +x, ε > 0 = courant dans le sens direct autour de +x. `generator({N, B, A, omega, phi0}, t)` → `{phi, lam, emf}`. `inductance(coil)`, `mutualCoils(c1, c2)`, `faradayPair({V0, R1, L1, M, ton, toff}, t)` → `{I1, dI1, emf2, tau}`.
- `dragStep(s, {m, F, k}, dt)` : m dv/dt = F − kv, pas exact, s = `{x, v, W, Q}` (travail fourni, chaleur) ; `rails({B, ell, R, m, F, open})` → `{k, tau, vT}` ; `railsState(p, v)` → `{emf, I, Ffrein, Pjoule, Pmeca}` ; `tubeBrake(magnet, {b, w, rho, fendu})` → k ; `ringProfile(magnet, tube, n, span)` ; `magnetMass(magnet)` ; `RHO.cuivre`, `RHO.aluminium`, `G`.

Performance mesurée : 14 lignes de champ autour d'un aimant ≈ 30 ms. **Ne retrace jamais les lignes à chaque image** : seulement quand une source change, au plus une fois par image pendant un glisser (et alors avec un `ds` deux fois plus grand), puis une passe fine au relâchement.

## Code couleur (le même partout dans la page)

| Objet | Couleur et forme |
|---|---|
| Champ magnétique B : lignes, aiguilles de boussole (pointe nord), symboles ⊙ ⊗ du champ, vecteur B de la sonde | jeton local `--champ-b: #8a97f2;` (le `--champ-b` sombre de `labo/labo.css`). Lignes fines avec de petites flèches de sens espacées ; opacité qui baisse avec \|B\| (échelle logarithmique, l'écrire dans le `title`) |
| Courant **imposé** (pile, générateur extérieur) | `--positif` : sens conventionnel, petites flèches ou points qui avancent le long du fil |
| Électrons, quand on les dessine | `--negatif`, en sens inverse du courant conventionnel |
| Tout ce qui est **induit** : f.é.m., courant induit, force de freinage induite, pôles induits d'une bobine | `--accent` |
| Particules chargées (acte II) | proton, deutéron, alpha : `--positif` (disque, « + ») ; électron : `--negatif` (disque, « − ») |
| Énergie : travail fourni, chaleur dissipée, lampe qui s'allume | famille `--energie` ; énergie cinétique : `--texte` |
| Aimant | corps `--fond-2` à contour `--texte-2`, moitié nord légèrement plus claire, lettres « N » et « S » en Plex Mono. **Pas de rouge et bleu** : dans LABO, le rouge et le bleu désignent les charges + et −, et un pôle n'est pas une charge. Le dire dans l'infobulle de l'aimant |
| Conducteurs vus en coupe | ⊙ (courant qui sort de l'écran) et ⊗ (qui y entre), dans la couleur du courant qui les traverse (imposé ou induit) |
| Prédictions impossibles (Lenz inversé) | `--texte-2` tireté, barré d'un trait fin |

Rappelle dans la légende des actes I et II que ⊙ et ⊗ indiquent un sens perpendiculaire à l'écran (une pointe de flèche qui vient vers toi, une queue de flèche qui s'éloigne).

## Paillasse B · champ et force (actes I et II)

### Acte I · D'où vient le champ
- Scène : coupe d'un plan de 24 cm × 14 cm environ (barre d'échelle « 2 cm »). Sélecteur segmenté : « Aimant » | « Fil » | « Spire » | « Bobine ». Sources : aimant Ø 12 × 24 mm, `Br = 1,2 T` (néodyme) ; fil perpendiculaire à l'écran ; spire de rayon 3 cm ; bobine de rayon 1,5 cm, longueur 6 cm.
- Deux représentations, bascule « Lignes » | « Boussoles » | « Les deux » : lignes de champ tracées (`traceLine`, 10 à 16 graines selon la source), ou une grille de 13 × 7 petites boussoles qui **pivotent réellement** (`compassStep`, amorties : elles oscillent un peu puis se calent). Sous les boussoles, au départ de la scène, le champ terrestre seul : toutes pointent vers la droite.
- Bascule « Champ terrestre » (active par défaut) : ajoute `{kind:'uniforme', bx: Mag.B_TERRE_H, by: 0}` ; étiquette en coin « nord géographique → ».
- **Sonde** glissable (petit réticule) : affiche \|B\| (µT ou mT selon la grandeur), la direction et le rapport B / B_terre.
- **Fil** (moment Œrsted) : curseur I de −20 à 20 A (défaut 0). À I = 0, les boussoles montrent le nord ; en montant I, celles proches du fil s'enroulent en cercles, les lointaines bougent à peine. Panneau : B mesuré à la sonde et B = μ₀I / 2πr calculé, côte à côte. Statut quand \|I\| ≥ 5 A : « Un courant fait tourner une boussole. À 5 cm, 10 A donnent 40 µT : autant que la Terre. » Inverser I inverse le sens de rotation.
- **Spire** et **Bobine** : curseur I (−5 à 5 A, défaut 2), et pour la bobine N (10 à 400 spires, défaut 200). Les conducteurs en coupe portent ⊙ en haut, ⊗ en bas (`crossings`). Panneau : B au centre, n = N/L, et pour la bobine μ₀nI à côté de la valeur mesurée.
- **Aimant** : bouton « Retourner ». Bouton « Couper en deux » : l'aimant se sépare en deux moitiés qui s'écartent de 0 à 1 cm en 1,2 s (deux sources `aimant` de longueur moitié) ; de nouvelles lettres N et S apparaissent sur les faces de la coupure ; les lignes traversent la fente. Statut : « Deux aimants, chacun avec son nord et son sud. On ne peut pas isoler un pôle : les lignes de B n'ont ni début ni fin. » Bouton « Recoller ».
- Bascule « Comparer à une bobine » (segment Aimant) : dessine en surimpression, en tireté, les spires de la bobine de même taille qui produirait exactement ce champ, et le panneau affiche ses **ampères-tours** : N·I = (Br / μ₀)·L ≈ 23 000 A·tours pour cet aimant de 2,4 cm. Statut : « Un aimant se comporte comme une bobine parcourue par un courant énorme. Ce courant n'a pas de fil : il vient des électrons de la matière (module 50). »
- Panneau : source, paramètres, \|B\| à la sonde, direction, B / B_terre, et selon la source B théorique. Enregistreur : non (rien n'évolue dans le temps) ; à la place, petit graphe B(r) le long d'un rayon horizontal passant par la sonde (échelle log, avec la ligne B_terre).
- Phrase-clé : « Un champ magnétique est produit par des charges en mouvement : un courant dans un fil, ou, dans un aimant, les électrons eux-mêmes. Ses lignes se referment toujours. »
- Note : champ exact en trois dimensions, dessiné dans un plan de coupe ; aimant uniformément aimanté (modèle exact : courant de surface équivalent) ; boussoles amorties, réponse plafonnée dans les champs forts. Renvoi à 04 (lignes de E).

### Acte II · Une force qui dévie (moment fort)
Sélecteur segmenté : « Une charge » | « Un fil ».

**Une charge.**
- Scène : le plan du mouvement, champ uniforme B perpendiculaire à l'écran, figuré par une grille discrète de ⊙ (B > 0) ou ⊗ (B < 0), opacité ∝ \|B\|. La particule laisse une traînée (6 s). Barre d'échelle adaptative (l'échelle change avec la particule : le dire).
- Sélecteur de particule : proton, électron, deutéron, alpha. Curseurs : B de −0,2 à 0,2 T (défaut 0,1), vitesse de 2 × 10⁵ à 3 × 10⁶ m/s (défaut 10⁶). `boris` à pas fixe, au moins 400 pas par période.
- **Ralenti affiché en permanence** : fixé une fois pour toutes à partir de la période du proton à 0,1 T, pour qu'un tour prenne ≈ 3 s à l'écran (« 1 s à l'écran = 0,22 µs »). Il ne change pas quand on change la vitesse : c'est ce qui rend visible que la période ne dépend pas de la vitesse. Pour l'électron, le ralenti est recalculé et le panneau le signale.
- **Jauge d'énergie cinétique** (barre `--texte`) à côté de la scène, et dans l'enregistreur : Ec(t) et vx(t), vy(t). Les composantes oscillent, Ec reste **parfaitement plate**. Statut : « La force est toujours perpendiculaire à la vitesse. Elle tourne la vitesse sans jamais changer sa grandeur : B ne fait aucun travail. »
- Vecteurs dessinés sur la particule : v (`--texte`, fin) et F = qv × B (`--texte`, épais ; pas `--accent`, car rien n'est induit ici), avec un petit angle droit entre v et F.
- Bouton « Deux protons » : lance un second proton deux fois plus rapide depuis le même point. Grand cercle, petit cercle, **retour au point de départ au même instant**, à chaque tour. Statut : « Deux fois plus vite, deux fois plus grand, même durée par tour : T = 2πm / qB. C'est le principe du cyclotron. »
- Bascule « Champ électrique » : ajoute deux plaques (haut `--positif`, bas `--negatif`) et un curseur E de 0 à 3 × 10⁵ V/m. La particule qui a v = E/B file droit (marque « v = E/B » sur le curseur de vitesse) ; les autres dévient d'un côté ou de l'autre. Ec n'est plus plate : E travaille. Statut : « Le champ électrique change l'énergie ; le champ magnétique, jamais. Ensemble, ils trient les vitesses. »
- Bascule « Vitesse le long de B » : ajoute v∥ = 0,3 v. Un encart « vue de côté » (projection x–z) montre l'hélice qui avance ; le panneau affiche le pas.
- Panneau : particule, q, m, v, B, r mesuré (rayon de la trace) et r = mv / \|q\|B, T, Ec, et avec E : E/B.
- Phrase-clé : « La force magnétique est perpendiculaire à la vitesse et au champ. Elle courbe la trajectoire en cercle sans jamais accélérer la particule. »
- Note : non relativiste (v ≤ 1 % de c) ; une seule particule, pas de rayonnement ; ralenti énorme. Renvoi à Forces-énergie (travail) et Rotation (mouvement circulaire).

**Un fil.**
- Scène : balançoire de Laplace vue de bout : la tige conductrice (L = 5 cm, m = 10 g) apparaît comme un disque ⊙ ou ⊗ selon le courant, suspendue par deux fils fins (ℓ = 15 cm) entre les pièces polaires d'un aimant en U (pôle en haut, pôle en bas, champ vertical uniforme, lignes `--champ-b`). `swingStep`.
- Curseurs : I de −6 à 6 A (défaut 0), B de 0 à 0,2 T (défaut 0,1).
- Vecteurs : poids mg, force de Laplace F = ILB (horizontale), tension du fil ; à l'équilibre, tan θ = ILB / mg.
- Panneau : F, mg, θ mesuré, θ attendu. Statut : « Un courant, c'est des charges en mouvement : chacune subit qv × B, et le fil entier est poussé. » Inverser I ou le champ inverse le côté.
- Note : renvoi aux deux fils parallèles (F/L = μ₀I₁I₂ / 2πd) seulement dans l'explication.

## Paillasse I · induction (actes III et IV)

### Acte III · Faire varier le flux (moment fort)
Sélecteur segmenté : « Aimant et bobine » | « Spire qui tourne » | « Deux bobines ».

**Aimant et bobine.**
- Scène : axe horizontal. Bobine réceptrice au centre (N spires, rayon 1,5 cm, longueur 2 cm, vue en coupe ⊙/⊗ ou en légère perspective) reliée à un **galvanomètre à zéro central** (aiguille amortie, dans un coin de la scène) ; résistance totale du circuit 10 Ω. Aimant Ø 12 × 24 mm sur l'axe, **à glisser au pointeur** (vitesse lissée sur 80 ms) ; ses lignes de champ en `--champ-b` léger, celles qui traversent la bobine un peu plus marquées.
- Boutons : « Va-et-vient » (mouvement sinusoïdal de ±8 cm, curseur fréquence 0,2 à 2 Hz, défaut 0,5), « Retourner l'aimant ». Curseur N (50 à 400, défaut 200).
- Courant induit : petites flèches `--accent` qui circulent dans les spires, vitesse et densité ∝ \|I\|, sens donné par le signe de ε. Aux deux bouts de la bobine, des lettres « N » et « S » en `--accent` apparaissent quand un courant passe (la bobine devient un aimant) : **face à l'aimant qui approche, la bobine présente le même pôle**. C'est l'annonce de l'acte IV ; pas encore de mot « Lenz ».
- **Enregistreur** (le cœur de l'acte) : deux courbes sur le même axe du temps, Φ par spire (µWb, `--champ-b`) en haut et ε (mV, `--accent`) en bas. Une ligne verticale suit l'instant présent sur les deux. Quand l'aimant traverse la bobine : Φ fait une bosse, ε fait deux bosses de signes opposés, et ε passe par zéro au sommet de Φ.
- Statuts conditionnels : aimant immobile hors de la bobine → « Rien ne change, rien ne passe. » ; aimant immobile **au centre** de la bobine (≥ 1 s) → « Flux maximal, et pourtant ε = 0. Ce n'est pas le flux qui compte, c'est sa variation. » ; en mouvement → « Plus vite : même variation de flux en moins de temps, tension plus grande. » Valeurs à attendre (vérifiées) : N = 200, aimant à 0,5 m/s, crête ≈ 320 mV ; Λ max ≈ 16 mWb.
- Le mot « flux » apparaît avec une étiquette qui se révèle la première fois qu'une ligne traverse la bobine : « flux : combien de champ traverse la surface d'une spire » (renvoi Flux-fluides).

**Spire qui tourne.**
- Scène : champ uniforme B = 0,2 T entre deux pièces polaires (lignes horizontales). Une bobine rectangulaire de N = 200 spires, A = 100 cm², tourne autour d'un axe vertical : dessinée en projection (largeur apparente ∝ \|cos θ\|, face avant et face arrière légèrement différentes), avec sa normale n̂ en petit vecteur. Bagues, balais, et une **lampe** dont la lueur `--energie` ∝ ε².
- Curseur vitesse de rotation 0,2 à 3 tr/s (défaut 1). Enregistreur : Φ = BA cos θ et ε = NBAω sin θ (`generator`), en quadrature. Le panneau extrapole : « à 50 Hz : ε crête = 126 V ».
- Statut : « Le flux est maximal quand la spire fait face au champ, et c'est là que ε est nulle ; ε est maximale quand la spire est de profil et que le flux change le plus vite. » Lien Oscillations-ondes (déphasage d'un quart de tour).

**Deux bobines** (Faraday, 1831).
- Scène : deux bobines coaxiales côte à côte (300 spires, rayon 2 cm, longueur 4 cm, centres à 5 cm). Le primaire est relié à une pile de 6 V par un **interrupteur** (résistance 2 Ω) ; le secondaire à un galvanomètre. Lignes de champ du primaire en `--champ-b`, opacité ∝ I₁. `faradayPair` avec `M = mutualCoils(c1, c2)` et `L1 = inductance(c1)` (τ ≈ 1,2 ms, ε₂ crête ≈ 0,58 V) ; **ralenti ×200 affiché**.
- Bouton « Fermer l'interrupteur » / « Ouvrir ». À la fermeture, l'aiguille saute d'un côté puis revient à zéro pendant que I₁ s'établit ; le courant établi ne fait plus rien ; à l'ouverture, elle saute de l'autre côté. Enregistreur : I₁(t) et ε₂(t).
- Statut après la fermeture : « Le courant du primaire est établi, son champ traverse le secondaire, et l'aiguille est revenue à zéro. Rien ne bouge, mais rien ne change non plus. » Lien vers 06 : « Une bobine traversée par son propre champ réagit de la même façon à ses propres variations : c'est l'inductance de la planche Courant et circuits. »
- Panneau commun aux trois segments : Φ par spire, Λ = NΦ, dΦ/dt, ε, I induit, et la loi qui se révèle à la fin du premier passage complet de l'aimant : « ε = −N dΦ/dt (loi de Faraday) ».
- Phrase-clé : « Aimant qui bouge, spire qui tourne, courant qui s'établit : trois façons de faire varier le flux, une seule loi. Une tension apparaît tant que le flux change, et seulement tant qu'il change. »
- Note : bobines sans noyau de fer ; galvanomètre amorti ; self-inductance de la bobine réceptrice négligée dans le segment Aimant ; ralentis affichés.

### Acte IV · L'induction freine (moment fort)
Sélecteur segmenté : « Rails » | « Aimant dans un tube ».

**Rails.**
- Scène, vue de dessus : deux rails horizontaux (ℓ = 20 cm d'écart) fermés à gauche par une résistance R, une tige mobile (m = 50 g) posée en travers ; champ B uniforme vers l'écran (⊗, grille discrète). La caméra suit la tige (les rails défilent) ; l'aire du circuit, BℓX et le flux sont écrits.
- Curseurs : force appliquée F de 0 à 0,4 N (défaut 0,2), R de 0,05 à 1 Ω (défaut 0,1), B de 0 à 1 T (défaut 0,5). Boutons « Tirer » (bascule : la force s'applique) et « Lancer » (v₀ = 3 m/s, F = 0) ; bascule « Circuit ouvert » (on coupe la résistance : plus de courant, plus de freinage, la tige accélère sans limite à F/m, statut le dit).
- Valeurs par défaut vérifiées : τ = mR / B²ℓ² = 0,5 s, v_lim = FR / B²ℓ² = 2 m/s, ε = 0,2 V, I = 2 A, P = 0,4 W. `rails`, `railsState`, `dragStep`.
- Courant induit en `--accent` qui circule dans le circuit ; sur la tige, la force appliquée (`--texte`) et la force induite F = −IℓB (`--accent`), opposées. **Barres d'énergie** : travail fourni W (`--energie`), énergie cinétique K (`--texte`), chaleur dissipée Q (`--energie` hachuré), avec W = K + Q écrit et vérifié en direct.
- Enregistreur : v(t) avec la ligne v_lim ; puissance mécanique Fv et puissance électrique RI², qui se rejoignent.
- Bascule « Lenz à l'envers » (expérience de pensée) : la force induite change de signe (`dragStep` avec `k` négatif). La tige s'emballe toute seule ; Q devient négatif ; les barres d'énergie montrent de l'énergie qui sort de nulle part, tracées en `--texte-2` tireté et barrées ; la page plafonne la vitesse à 10 m/s et l'écrit. Statut : « Si le courant induit aidait le mouvement, la tige s'accélérerait toute seule et chaufferait la résistance gratuitement. Le signe moins de la loi de Faraday, c'est la conservation de l'énergie. » C'est ici que le nom se révèle : « loi de Lenz ».

**Aimant dans un tube.**
- Scène : deux tubes verticaux de 1 m côte à côte, même échelle, et deux aimants identiques (Ø 12 × 12 mm, 1,2 T, `magnetMass` ≈ 10 g) lâchés en même temps par le bouton « Lâcher ». Tube de gauche : **matériau au choix** (« Plastique », « Aluminium », « Cuivre », « Cuivre fendu »), rayon intérieur 7,5 mm, paroi 1,5 mm ; tube de droite : plastique (chute libre, référence). `tubeBrake`, `dragStep` avec F = mg.
- Valeurs vérifiées : chute libre de 1 m en 0,45 s ; dans le cuivre, vitesse limite ≈ 5,8 cm/s, ≈ 17 s pour le mètre ; aluminium ≈ 9,2 cm/s. Bouton « ×4 » pour accélérer l'affichage (affiché).
- Courants de Foucault : autour de l'aimant qui tombe, des anneaux `--accent` dans la paroi (devant et derrière l'aimant, de sens opposés, intensité ∝ v · dΦ/dz, `ringProfile`). Avec le cuivre fendu, aucun anneau ne se ferme : chute presque libre, statut « Coupé, le tube ne laisse plus le courant faire le tour : plus de freinage. »
- Panneau : v, v_lim, temps écoulé, énergie potentielle perdue, cinétique, chaleur dans le tube. Le nom « courants de Foucault » se révèle quand l'aimant atteint sa vitesse limite.
- Phrase-clé : « Le courant induit s'oppose à la variation qui le crée. C'est pour ça qu'une génératrice est dure à tourner quand elle alimente quelque chose : l'énergie électrique produite est payée en travail mécanique. »
- **Fin de la planche : trois questions ouvertes**, trois cartes sobres dans le panneau (pas de réponse) :
  - **Lumière** : « Un champ magnétique qui varie fait naître un champ électrique. Un champ électrique qui varie fait-il naître un champ magnétique ? » → module 24 (à venir).
  - **Inductance** : « Une bobine sent son propre champ. Que se passe-t-il quand son courant change ? » → planche 06, acte IV.
  - **Matière** : « D'où vient le champ d'un aimant, sans pile ni fil ? » → module 50 (spin, à venir).

## Mise en scène
- Stepper à deux groupes : « Paillasse B · champ et force » (I, II) et « Paillasse I · induction » (III, IV). Fondu entre actes. Chaque acte a ses outils (`data-acts`) ; le sélecteur segmenté d'un acte est dans la barre de contrôles.
- Panneau : numéro et titre de l'acte, 1 à 3 phrases, statut, enregistreur (canvas), légende SVG, mesures en IBM Plex Mono, note d'honnêteté (une ligne). Valeurs avec virgule décimale et unités SI (µT, mT, mV, mWb, cm/s).
- Micro-interactions de découverte (survol ou toucher → nom + rôle en une ligne) : aimant et ses pôles, fil, spire, bobine, ⊙ et ⊗, ligne de champ, boussole, sonde, particule, vecteurs v et F, plaques, balançoire, galvanomètre, bobine réceptrice et ses pôles induits, lampe, bagues et balais, interrupteur, rails, tige, résistance, tube, anneau de courant, barres d'énergie.
- Clavier : Espace pause, ← → acte, 1 à 4 aller à l'acte, R réinitialiser l'acte, `C` couper l'aimant (I), `D` deux protons (II), `V` va-et-vient (III), `T` tirer (IV rails), `L` lâcher (IV tube).
- `prefers-reduced-motion` : boussoles qui se calent sans osciller, traînées raccourcies, mouvements ralentis ; rien ne clignote.
- Responsive jusqu'à 375 px sans défilement horizontal ; < 861 px : scène, contrôles, panneau empilés. À 1366 × 768, la scène tient dans l'écran.
- Aucune erreur console ; canvas à l'échelle de `devicePixelRatio` ; pas de bibliothèque ; pas d'image externe.
- `window.__labo` : `{ Mag, act, goAct, state, tick(n), setPlay }` + crochets de test : `source(kind)`, `setI(I)`, `setN(N)`, `earth(on)`, `cut(on)`, `flip()`, `probe(x, y)` (I) ; `seg(name)`, `particle(kind)`, `setB(B)`, `setV(v)`, `efield(on, E)`, `twin()`, `vpar(on)`, `swing(I, B)` (II) ; `seg(name)`, `moveMagnet(x, vx)`, `shuttle(on, f)`, `rotor(tps)`, `closeSwitch(on)` (III) ; `seg(name)`, `pull(on, F)`, `launch(v0)`, `setR(R)`, `open(on)`, `reverse(on)`, `tube(mat)`, `drop()` (IV). `state()` renvoie les grandeurs affichées de l'acte courant ; `tick(n)` avance n pas fixes sans dessiner.

## Honnêteté (dans la page, une ligne par acte, et dans l'explication)
- Champs exacts en trois dimensions pour des sources à symétrie axiale et des fils infinis, dessinés dans un plan de coupe ; aimant uniformément aimanté ; pas de matériaux magnétiques (pas de fer, pas d'hystérésis).
- Particules non relativistes, sans rayonnement ; ralentis énormes et affichés.
- Bobines sans noyau ; inductance propre de la bobine réceptrice et des anneaux du tube négligée (valable pour des mouvements lents) ; galvanomètre et boussoles amortis.
- Rails sans frottement mécanique ; tube infini par rapport à l'aimant (effets de bout négligés) ; un tube fendu réel freine encore un peu.

## Hors champ
Équations de Maxwell sous forme locale, courant de déplacement (module 24), potentiel vecteur, magnétisme de la matière (ferro-, para-, diamagnétisme, domaines, hystérésis), effet Hall, relativité du champ magnétique (module 46, seulement nommé dans l'explication), rayonnement synchrotron, moteurs et transformateurs réels, courant alternatif triphasé, supraconducteurs.

## L'explication (`explication.html`)

Même coquille que `../fondations-relativite-restreinte/explication.html` (mêmes en-tête, `labo/theorie.css` et `labo/theorie.js`, KaTeX). Plan imposé par `corpus/standards.md` :

1. **Ce que tu vois** : chaque élément des quatre actes, relié au phénomène réel.
2. **La théorie, module par module** : un sommaire, puis une seule `<section class="module" id="m23">`, avec ses sept rubriques dans l'ordre (Intuition, Définitions, Relations clés, Exemple chiffré, Pièges fréquents, Où ça resservira, Teste-toi), **800 à 1 150 mots de prose**, formules exclues. Le `<p class="etapes">` liste les quatre actes.
   - Définitions (`dl.defs`) : champ magnétique B (T), tesla, perméabilité du vide μ₀, ligne de champ, force de Lorentz, force de Laplace, flux Φ (Wb), liaison de flux NΦ, f.é.m. ε (V), courant induit, ampère-tour.
   - Relations clés (5 ou 6 blocs `div.relation`) : B = μ₀I / 2πr (fil) et B = μ₀nI (bobine longue) ; \(\vec F = q\,\vec v \times \vec B\) avec r = mv / \|q\|B et T = 2πm / \|q\|B ; \(\vec F = I\,\vec L \times \vec B\) ; Φ = BA cos θ (en général ∫ B·dA) ; ε = −N dΦ/dt ; ε = Bℓv et le bilan Fv = εI (Lenz comme conservation de l'énergie).
   - Exemple chiffré : la génératrice de l'acte III (200 spires, 100 cm², 0,2 T, 50 Hz → Φ max = 2 mWb par spire, ε crête = NBAω ≈ 126 V, valeur efficace ≈ 89 V), calculé pas à pas, puis le contrôle : en dix millisecondes (une demi-période), le flux par spire passe de +2 mWb à −2 mWb, soit une f.é.m. moyenne de 200 × 4 mWb / 10 ms = 80 V, cohérente avec la crête (moyenne = 2/π × crête).
   - Pièges : pôles ≠ charges et pas de monopôle ; une charge immobile ne subit aucune force magnétique ; B ne change pas la vitesse ; flux ≠ variation de flux ; Lenz s'oppose à la variation, pas au champ ; règle de la main droite et signe de la charge (l'électron tourne dans l'autre sens).
   - Où ça resservira : 22 (inductance, planche 06), 24 (onde électromagnétique), 46 (le magnétisme comme effet relativiste du champ électrique, seulement nommé), 50 (spin, Stern-Gerlach), 44 (champs magnétiques des étoiles, magnétars), 11 (énergie et puissance) ; planches 04 et 06.
   - Teste-toi : exactement 3 questions, réponses dans `<details>`, dont au moins une calculatoire (par exemple : rayon d'un électron à 10⁷ m/s dans 1 mT ≈ 5,7 cm ; vitesse limite des rails si on double B).
3. **Ce que la simulation simplifie** (la liste d'honnêteté ci-dessus, développée).
4. **Les chiffres à retenir** : champ terrestre ≈ 50 µT (≈ 18 µT à l'horizontale vers Montréal) ; fil de 10 A à 5 cm : 40 µT ; aimant néodyme : Br ≈ 1,2 T, quelques dixièmes de tesla au contact ; IRM : 1,5 à 3 T ; proton à 1 000 km/s dans 0,1 T : r ≈ 10 cm, T ≈ 0,66 µs ; aimant dans un tube de cuivre : quelques cm/s.
5. **Seulement introduit ici** : auto-induction, transformateur, moteur, courants de Foucault dans les freins de train, magnétisme de la matière.

## Vérifier avant de rendre
- `node prompts/moteurs/magnetisme.test.js opus-sonnet/fondations-magnetisme-induction/index.html` → 112 réussis, 0 échoués.
- `node --check` sur le JS extrait de la page.
- Servir la racine du dépôt (`python -m http.server`) et ouvrir la page dans un navigateur headless (Playwright ; Edge si disponible, sinon Chromium, sans télécharger de navigateur) : console propre ; captures à 1440 px, 1366 × 768 et 375 px pour chaque acte et chaque segment ; aucun défilement horizontal ; les crochets `__labo` donnent les valeurs attendues (crête ≈ 320 mV, v_lim = 2 m/s, W = K + Q, Ec constante dans B seul, deux protons de retour ensemble).
- Explication : toutes les formules KaTeX rendues sans erreur, compte de mots de la section m23 dans la fourchette, rien ne déborde à 375 px.

## Après la construction (dans la même branche)
- `corpus/` : `models.json` (nouveau modèle `fondations-magnetisme-induction`, type `foundation`, actes, interactivité, notes, module 23 `full` et en appui 21, 22, 11) ; `modules.json` (23 couvert `full`, `covered_by`) ; `productions.json` (`fondations-magnetisme` passe à `built`, avec son modèle) ; `fondations.md` (état, tableau D, productions construites, limites connues) ; `modeles.md` (fiche du modèle) ; `atlas.md` et `atlas.json` (Champ magnétique, Force de Lorentz, Induction électromagnétique, Solénoïde, Génératrice, Dipôle magnétique, Courants de Foucault et Induction motrice deviennent `absorbed`, Cyclotron `partial`, avec le lien vers le modèle) ; `README.md` (compte des modèles, pages de fondations).
- `opus-sonnet/06-courant-circuits/index.html` : la phrase « c'est l'induction, sujet d'une planche à venir » devient un lien vers la nouvelle planche. Rien d'autre hors du dossier de sortie.
- Pas d'emoji.

Rapport final (moins de 250 mots) : ce qui est fait, ce que tu as vérifié et comment (tests du moteur, captures, valeurs des crochets), les simplifications assumées, et ce que tu améliorerais avec plus de temps.

## Pour lancer la session (bloc à coller)

```text
Tu construis la planche de fondations « Magnétisme et induction » (module 23) de LABO, dans le dépôt labo-modeles.

Lis d'abord, en entier :
1. prompts/00-direction-artistique.md (charte commune)
2. corpus/standards.md (en-tête, théorie module par module, taille)
3. prompts/fondations-magnetisme-induction.md (le brief, qui fait foi)
4. prompts/moteurs/magnetisme.js (le moteur verrouillé) et opus-sonnet/fondations-rotation-gravitation/index.html (la coquille à reprendre)

Tu es l'orchestrateur : découpe en lots indépendants (par exemple actes I-II, actes III-IV, explication.html), délègue-les à des sous-agents Sonnet avec un contrat d'interface précis, puis intègre, relis en directeur artistique et en physicien, et renvoie ce qui n'est pas au niveau avec des corrections précises.

Livre dans opus-sonnet/fondations-magnetisme-induction/ : index.html et explication.html. Fais ensuite les mises à jour de corpus/ et la phrase de la planche 06 décrites à la fin du brief, rien d'autre. Vérifie tout ce que la section « Vérifier avant de rendre » demande, corrige ce que tu trouves, puis rends le rapport final demandé.
```
