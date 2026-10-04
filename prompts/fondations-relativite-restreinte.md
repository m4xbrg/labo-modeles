# Fondations · Relativité restreinte (module 46)

Dossier de sortie : `opus-sonnet/fondations-relativite-restreinte/` (`index.html` + `explication.html`). Charte : `00-direction-artistique.md`, intégralement. Gabarit : **le même que `fondations-rotation-gravitation/index.html`** (scène canvas, titre discret, panneau de lecture, barre de contrôles, stepper d'actes groupés par paillasse, infobulle de découverte, clavier, fondu entre actes, enregistreur, `window.__labo`). Lis cette page avant de commencer et reprends sa structure CSS et JS.

Accent : `--accent: #b6f2ff;` (cyan glacé) : **c'est la couleur de la lumière** (photons, fronts, cônes de lumière). En-tête : `L’invisible en mouvement — Fondations 46`, titre « Relativité *restreinte* ». Branche canonique : J · Relativité. Cette planche ouvre la branche ; le module 47 (relativité générale) viendra après.

Budget : ≈ 1 ADN : un `index.html` autonome de l'ordre de 120 à 150 Ko, huit actes en trois paillasses, au plus trois ou quatre curseurs par acte.

## Intention

La relativité restreinte est souvent apprise comme une collection d'effets étranges (temps qui ralentit, longueurs qui raccourcissent, paradoxes, E = mc²). Ici, ces effets doivent apparaître comme **les conséquences d'une seule géométrie** : celle de l'espace-temps de Minkowski. Le fil conducteur :

> différents observateurs → coordonnées différentes ; mais certaines choses ne changent pas : la vitesse de la lumière, l'intervalle s², le temps propre, l'ordre causal.

Intuitions à rendre évidentes, par ordre de priorité :
1. La simultanéité est relative, et **ce n'est pas un effet de délai de la lumière** (acte III, moment fort).
2. Le diagramme d'espace-temps est la carte : événements, lignes d'univers, cône de lumière, axes d'un observateur mobile (acte IV).
3. Dilatation et contraction sont deux lectures de la même géométrie ; la contraction **est** la relativité de la simultanéité (acte V).
4. Le temps propre est une longueur le long d'une ligne d'univers, la même pour tous ; la ligne droite le maximise (acte VI).
5. c est une limite : les vitesses ne s'additionnent pas, et l'énergie nécessaire diverge (actes VII et VIII).

Pièges interdits partout (texte, statut, infobulles) : un observateur qui « voit » une règle raccourcie comme sur une photo ; un mécanisme qui « ralentit » l'horloge ; l'un des deux référentiels « vraiment » au repos ; simultanéité relative = délai de la lumière ; un observateur qui aurait raison et l'autre tort ; un objet massif qui atteint c avec assez d'énergie ; E = mc² présenté comme la formule générale ; l'expression « masse relativiste ». Les mots « paraît », « semble », « illusion » sont proscrits pour décrire dilatation et contraction : on dit « mesure ».

## Moteur physique : verrouillé et déjà testé

Le moteur est écrit et vérifié (194 tests). Copie **à l'identique** le fichier
`scratchpad/phys.js` (fichier de travail de la session de construction, hors dépôt)
dans le `<script>`, du marqueur `/* PHYS-BEGIN */` au marqueur `/* PHYS-END */` inclus (sans la dernière ligne `module.exports`). Ne modifie pas ces fonctions ; si tu as besoin d'un calcul de plus, écris-le hors du bloc. Le test `scratchpad/test.js` doit continuer de passer sur ta page : `node test.js <chemin>/index.html`.

Conventions du moteur : **c = 1**. Un événement est `{t, x}` où `t` est déjà « ct ». Une vitesse est `b = v/c`. S = quai (ou observateur « au sol »), S' = train / fusée, qui se déplace à `+b` selon x par rapport à S.

Ce qu'il fournit :
- `gamma`, `rapidity`, `fromRapidity`, `clampB`, `BMAX` (0,999) ;
- `boost(ev, b)` (coordonnées dans S'), `unboost`, `galilee(ev, b)` (acte I) ;
- `interval(e1, e2)` → `{dt, dx, s2, kind ∈ temps|lumiere|espace, tau, dist}` ; `orderInvariant`, `simultaneityBoost` ;
- `velTransform(u, b)` = (u − b)/(1 − ub) (vitesse u mesurée dans S, vue de S') ; `velCompose(u', b)` = (u' + b)/(1 + u'b) ; `velGalilee` ;
- `lightClock(b, L, t)` (acte II) ;
- `lightning(b, L0)` (acte III) : événements A (arrière), B (avant), réceptions par M et M', **reconstruction par M'** (`reconA`, `reconB`) et vérité de Lorentz (`Ap`, `Bp`, `dtPrime` = b·L0 > 0 : dans S', B a lieu avant A) ; `trainClockReading(b, x', t)`, `trainPointX(b, x', t)` ;
- `rodMeasure(b, L0, t)` (acte V) ;
- `properTime(path)`, `clampWaypoint(A, P, B, bmax)` (acte VI) ;
- `velCompose` répété (acte VII) ;
- `energy(m, b)`, `push(m, F, t)`, `bFromK` (acte VIII) ;
- `hyperbola(s2)`, `primedAxes(b)` (diagrammes).

## Unités affichées

- Actes I à III : train idéal de longueur propre **L₀ = 1 µs-lumière ≈ 299,8 m**. Temps en µs, longueurs en m (conversion : 1 unité = 299,792458 m), vitesses en fraction de c et en km/s. Le train fictif va jusqu'à 0,9 c : le dire (« train fictif : aucun train réel n'approche c ; à 300 km/h l'effet serait de 10⁻¹³ »).
- Actes IV à VI : années et années-lumière (« al »). Un diagramme : x horizontal (al), ct vertical (années, vers le haut). **Même échelle sur les deux axes** : la lumière fait toujours 45°. Le dire une fois dans la scène.
- Acte VII : fractions de c.
- Acte VIII : énergies en unités de mc² et, pour le préréglage proton, en GeV (mc² = 0,938 GeV).

## Code couleur (le même partout dans la page)

- **Lumière** (photons, fronts d'onde, rayons, lignes à 45°, cône de lumière) : `--accent`. Cône : bords pleins fins, futur et passé remplis `--accent` à 7 %. « Ailleurs » non rempli.
- **Référentiel S (quai, sol)** : `--texte`. Objets, horloges, axes ct et x, lignes de simultanéité de S (horizontales, tiretées).
- **Référentiel S' (train, fusée, voyageur)** : jeton local `--mobile: #c9a7ff;` (lilas). Objets, horloges, axes ct' et x', lignes de simultanéité de S' (inclinées, tiretées). C'est le seul jeton ajouté ; il n'a pas de sens de charge.
- **Événements** : petits disques pleins `--texte` avec halo ; l'événement sélectionné a un anneau `--accent`.
- **Énergie** (acte VIII) : famille `--energie`. Énergie de masse mc² : hachurée (elle est « stockée » dans l'objet au repos) ; énergie cinétique K : pleine ; énergie totale E : contour `--texte`. Prédiction newtonienne : tiretée `--texte-2`.
- **Invariants** (s², τ, c) : quand une valeur est invariante, la ligne du panneau porte une petite marque « invariant » en `--accent` et sa valeur ne bouge pas pendant un changement de référentiel. C'est un repère visuel récurrent : l'étudiant doit apprendre à le chercher.
- Prédictions galiléennes et valeurs impossibles : `--texte-2` tireté, barrées d'un trait fin quand elles contredisent l'expérience.
- `--positif` et `--negatif` : non utilisés dans cette page (sauf, éventuellement, sens + / − d'une vitesse sur un axe : non nécessaire).

## Paillasse R · Référentiels et lumière (actes I à III)

### Acte I — Deux référentiels (de Galilée au problème de la lumière)
- Scène, vue de côté stylisée : un quai (`--texte`) avec une règle graduée (repères tous les 50 m) et une horloge ; un train (wagon long, `--mobile`) avec sa propre règle graduée et son horloge, un passager au milieu. Un rectangle sobre pour le wagon ; pas de dessin réaliste.
- Bascule « Référentiel : quai | train » : la scène est redessinée **depuis** le référentiel choisi : celui-ci est immobile, l'autre défile (le quai part vers la gauche quand on est dans le train). Transition douce (0,6 s) entre les deux vues. Phrase d'un coin : « Aucun des deux n'est "vraiment" au repos. Chacun est immobile dans son propre référentiel. »
- Curseur b (0 à 0,5 c, défaut 0,3). Curseur u' (vitesse de la balle **dans le train**, −0,4 à 0,4 c, défaut 0,2).
- Bouton « Lancer la balle » : le passager lance une balle vers l'avant ; elle laisse des marques régulières (une par 0,2 µs) sur la règle du référentiel affiché. Panneau : vitesse de la balle mesurée dans le train u', mesurée sur le quai u = u' + v (Galilée). Les deux horloges marquent le même temps : « Galilée : un seul temps pour tous. » (On reste galiléen pour la balle : à ces vitesses fictives c'est faux de quelques %, le dire dans la note de l'acte : « on fait semblant que Galilée a raison pour la balle ; on verra à l'acte VII ».)
- Bascule « Wagon fermé » : on masque l'extérieur. L'expérience de la balle est identique quelle que soit b. Phrase : « Aucune expérience faite à l'intérieur ne dit si le wagon bouge : c'est le principe de relativité. »
- Bouton « Allumer la lampe » : une impulsion lumineuse part du passager vers l'avant (`--accent`). Deux colonnes dans le panneau, pour chaque observateur : « Galilée prédit » / « On mesure ». Train : prédit c, mesure c. Quai : prédit **c + v** (tireté, `--texte-2`), mesure **c**. Dans la scène, un photon fantôme tireté file à c + v devant le vrai photon (vue quai) ; il est barré dès que le vrai photon est mesuré. Statut : « Contradiction. Les mesures donnent c pour les deux observateurs. Il faut abandonner quelque chose : l'addition des vitesses, et avec elle le temps absolu. »
- Note : les expériences réelles (Michelson-Morley, 1887 ; mesures modernes à 10⁻¹⁷ près) et l'électromagnétisme de Maxwell, qui ne contient aucune vitesse de référence, imposent c pour tous.
- Panneau : b, v (km/s), u', u (Galilée), c mesurée (train, quai), temps des deux horloges.

### Acte II — Horloge lumineuse (dilatation du temps)
- Scène en deux volets côte à côte (empilés sous 861 px). Gauche : « Dans le référentiel de l'horloge » : deux miroirs horizontaux à L = 150 m (½ µs-lumière, donc τ₀ = 1 µs par aller-retour), un photon `--accent` qui monte et descend, trajet vertical. Droite : « Depuis le quai » : la **même** horloge défile à b ; le photon trace des diagonales (traînée en zigzag des 3 derniers tics).
- `lightClock(b, L, t)`. Temps commun de l'animation = temps du quai ; le volet gauche avance de façon cohérente : il affiche le temps propre τ = t/γ (le photon du volet gauche se trouve à la même phase que celui du volet droit, c'est le **même** photon). Compteurs de tics sous chaque volet : « tics de l'horloge : n » (identiques dans les deux volets) et en dessous « temps du quai : t ».
- **Triangle** (bascule, active par défaut) sur le volet droit, pour le dernier demi-tic : côté vertical L (`--mobile`), côté horizontal vΔt/2 (`--texte`), hypoténuse cΔt/2 (`--accent`). Sous la scène ou dans le panneau, la dérivation pas à pas en 3 lignes : (cΔt/2)² = L² + (vΔt/2)² → Δt = (2L/c)/√(1 − v²/c²) → **Δt = γ Δτ**. Les valeurs numériques s'y substituent en direct.
- Curseur b (0 à 0,99, défaut 0,6 → γ = 1,25). Préréglages 0 · 0,5 · 0,8 · 0,99. À b = 0 les deux volets sont identiques.
- Bascule « Une autre horloge » : on ajoute à côté de l'horloge lumineuse (dans les deux volets) une horloge d'un autre type (un balancier ou un ressort oscillant, dessiné en traits fins), réglée pour battre 1 µs **dans son référentiel**. Elle reste synchrone avec l'horloge lumineuse dans les deux volets. Phrase : « Si elle prenait du retard sur l'horloge lumineuse, le passager saurait qu'il bouge : contraire au principe de relativité. Ce n'est pas l'horloge qui est ralentie : c'est le temps entre deux événements qui dépend du référentiel. »
- Bascule « Réciproque » : on inverse les rôles : l'horloge est sur le quai et c'est le train qui la mesure (volet droit étiqueté « depuis le train », couleurs échangées). Même γ. Phrase : « Chacun mesure l'horloge de l'autre plus lente. Pas de contradiction : comparer deux horloges éloignées demande de décider ce qui est simultané. Voir l'acte III. »
- Panneau : b, γ, τ₀ = 1 µs, période mesurée depuis le quai γτ₀, temps propre écoulé, temps du quai, longueur du trajet du photon par tic (m) : 2L vs 2γL. Enregistreur : ligne γ(b) de 0 à 0,99 avec le point courant (courbe plate puis explosion près de c ; repères à 0,5 → 1,15 ; 0,87 → 2 ; 0,99 → 7,1).

### Acte III — Train et éclairs (relativité de la simultanéité, moment fort)
- Scène, vue de côté : quai (`--texte`) avec deux repères A_q et B_q séparés exactement de la longueur du train mesurée sur le quai, M au milieu ; train (`--mobile`), M' au milieu. `lightning(b, L0 = 1)`. Deux éclairs frappent l'arrière (A) et l'avant (B) du train **au moment où ils coïncident avec les repères** (marques de brûlure sur le quai ET sur le train : ces marques restent, ce sont des faits que les deux observateurs constatent).
- Animation : les fronts lumineux partent des deux points d'impact à c dans les deux sens (`--accent`, arcs ou barres verticales). Les réceptions par M et M' sont marquées d'un éclat. Scrubber de temps (lecture/pause, recul possible).
- **Bascule de référentiel** « Vu depuis : quai | train » : vue train = tout recalculé par Lorentz (`boost`) : le train est immobile, le quai défile vers la gauche, et l'éclair B (avant) se produit **avant** l'éclair A dans ce référentiel (même scrubber, en temps du train). La lumière va à c dans les deux vues.
- **Bloc « Reconstruction »** (au cœur de la leçon ; dans le panneau, lisible sans le reste) : pour chaque observateur, un petit tableau à trois lignes, toutes dans **son propre** référentiel : « reçu à » (son horloge) ; « distance à la source » (sa règle : L/2 pour chacun, puisque chacun est au milieu de ses repères) ; « donc émis à » = reçu − distance/c. Pour M : 0 et 0 → **simultanés**. Pour M' : B émis à −vL₀/2c², A émis à +vL₀/2c² → **non simultanés**, B d'abord, écart vL₀/c². Ces valeurs viennent de `reconB`, `reconA` et sont vérifiées égales à `Bp.t`, `Ap.t`.
- Encadré permanent sous le tableau (`--accent` à gauche, comme une équation) : « M' a déjà corrigé le temps de trajet de la lumière. Après correction, les deux éclairs ne sont toujours pas simultanés pour lui. La simultanéité n'est pas une affaire de délai : elle dépend du référentiel. »
- Bascule « Horloges synchronisées » : une rangée de 5 horloges le long du quai (synchronisées dans S) et 5 le long du train (synchronisées dans S', `trainClockReading`). En vue quai, les horloges du train marquent des heures différentes à un même instant du quai : l'horloge arrière est en avance de vL₀/c² sur l'avant. En vue train, c'est l'inverse pour les horloges du quai. Phrase : « Synchroniser des horloges éloignées, c'est choisir ce qui est simultané. Chaque référentiel a son propre choix, cohérent. »
- **Encart diagramme** (petit, dans un coin de la scène ; c'est l'aperçu de l'acte IV) : axes x, ct ; les deux événements A et B ; la ligne de simultanéité de S (horizontale, `--texte`) qui les relie ; celle de S' (inclinée de pente b, `--mobile`) passant par le milieu. Une ligne de légende : « horizontale pour le quai, inclinée pour le train ».
- Curseur b (0 à 0,9, défaut 0,5). À b = 0 : simultanés pour tous.
- Panneau : b, γ, L₀ (m), longueur du train mesurée sur le quai L₀/γ, Δt' = vL₀/c² (ns et µs), le bloc reconstruction, l'ordre des événements dans chaque référentiel.
- Note de l'acte : « Les éclairs sont séparés par plus de distance que la lumière ne peut en couvrir dans leur écart de temps : aucun ne peut causer l'autre. C'est pourquoi leur ordre peut dépendre du référentiel (acte IV). »

## Paillasse E · Géométrie de l'espace-temps (actes IV à VI)

Un même composant « diagramme de Minkowski » pour les trois actes : x horizontal (al), ct vertical (années), origine réglable, grille de S fine (`--trait`), même échelle sur les deux axes, glisser pour déplacer la vue n'est pas nécessaire. Graduations entières. Les étiquettes d'axes : « x (al) », « ct (années) » ; et pour S' : « x' », « ct' » en `--mobile`.

### Acte IV — Diagramme d'espace-temps (la carte)
- Contenu de départ : l'événement O à l'origine, son **cône de lumière** (futur et passé remplis, étiquetés « futur de O », « passé de O », « ailleurs »), la ligne d'univers de l'observateur S (axe ct, vertical), celle d'un observateur S' à b (droite inclinée `--mobile`), un photon émis de O (droite à 45°, `--accent`).
- Introduction progressive (boutons en tête des outils, dans l'ordre, chacun ajoute une couche ; l'étudiant n'a pas tout d'un coup) : « Événements » → « Lignes d'univers » → « Cône de lumière » → « Axes de S' » → « Invariance ». Par défaut au premier affichage : événements et lignes d'univers seulement.
- Événements : jusqu'à 4 événements E1…E4 placés par clic, déplaçables par glisser ; le dernier touché est sélectionné. Pour la paire (O, sélection) ou (sélection précédente, sélection) : Δt, Δx, s² = c²Δt² − Δx², type (« genre temps : un signal plus lent que la lumière peut les relier » / « genre lumière » / « genre espace : aucun signal ne peut les relier »), et l'ordre temporel dans S et dans S'.
- Couche « Axes de S' » : axe ct' (pente b) et axe x' (symétrique par rapport à la diagonale), graduations `primedAxes`, lignes de simultanéité de S' tiretées. Curseur b (−0,9 à 0,9). Phrase : « Les axes de S' se referment vers la diagonale comme des ciseaux. La lumière, la bissectrice, ne bouge pas. »
- Couche « Invariance » : bouton « Passer dans S' » : **animation continue** de la transformation de Lorentz (paramètre de 0 à b en 1,2 s) appliquée à tous les événements et aux lignes ; chaque événement glisse le long de son **hyperbole d'invariance** (tracée finement, `hyperbola(s2)`), le cône de lumière reste exactement en place, les axes de S' deviennent orthogonaux, ceux de S se referment. Les lignes « s² » du panneau portent la marque « invariant » et ne bougent pas ; Δt et Δx changent. Bouton « Revenir dans S ».
- Préréglage « Éclairs de l'acte III » : place A et B (genre espace) ; on voit que leur ordre bascule dans S'. Préréglage « Cause et effet » : deux événements genre temps ; aucun b n'inverse leur ordre (statut si on essaie : « impossible : il faudrait dépasser c »).
- Ligne d'univers de particule : une poignée sur la ligne de S' permet de changer b en glissant ; elle est bornée à |b| ≤ 0,999 (elle reste **dans** le cône). Statut quand on bute : « Une particule matérielle reste à l'intérieur de son cône de lumière. »
- Panneau : b, γ, liste des événements (t, x dans S et dans S'), paire sélectionnée : Δt, Δx, Δt', Δx', s² (invariant), type, ordre.

### Acte V — Dilatation et contraction (la même géométrie)
Deux modes, boutons en tête des outils : « Horloge » / « Règle ». Curseur b (0 à 0,95, défaut 0,6). Bascule « Mesuré par : S | S' » (réciprocité).
- **Horloge** : ligne d'univers d'une horloge de S' (droite de pente b, `--mobile`) avec ses tics tous les **1 an de temps propre** (petits traits perpendiculaires) ; chaque tic est sur l'hyperbole t² − x² = k² (bascule « Hyperboles d'étalonnage », tracées finement : elles montrent que ce sont bien des années, même si elles paraissent plus espacées sur le papier). Les lignes de simultanéité de S (horizontales) passant par les tics coupent l'axe ct à γk : **Δt = γΔτ** se lit sur le dessin. En mode « Mesuré par S' », c'est l'horloge de S (axe vertical) qui est lue avec les lignes de simultanéité inclinées de S' : même γ.
- **Règle** : règle de longueur propre L₀ = 4 al au repos dans S' : son **ruban d'univers** (bande entre deux droites parallèles de pente b, `--mobile` à 15 %). Mesurer la longueur, c'est repérer **les deux bouts au même instant**. La ligne de simultanéité de S (horizontale, à t réglable par glisser) coupe le ruban : segment `--texte` de longueur L₀/γ. La ligne de simultanéité de S' coupe le même ruban : segment `--mobile` de longueur L₀ (mesurée en graduations de x'). `rodMeasure`. Les deux « lectures » de S sont marquées comme événements, et le panneau affiche leur écart de temps dans S' (`dtPrime`) : « pour S', S a lu l'avant et l'arrière à des instants différents ». En mode « Mesuré par S' », règle au repos dans S, même conclusion.
- Phrase-clé (statut) : « Mesurer une longueur, c'est décider quels événements sont simultanés. S et S' coupent le même ruban d'espace-temps selon des lignes différentes : c'est la même chose que l'acte III. »
- Note : la contraction n'est pas un écrasement de la matière ni ce qu'une photo montrerait (une photo enregistre la lumière arrivée en même temps à l'objectif, partie à des instants différents : rotation de Terrell, hors champ). La règle n'a subi aucune contrainte : sa longueur propre reste L₀.
- Panneau : b, γ, Δτ, Δt, L₀, L = L₀/γ, écart Δt' des lectures, marque « invariant » sur L₀ (longueur propre) et Δτ (temps propre).

### Acte VI — Temps propre (les jumeaux)
- Diagramme : événement A (départ, origine) et événement B (retrouvailles, x = 0, ct = 10 ans). Ligne d'univers de la sédentaire : droite A → B (`--texte`). Ligne du voyageur : A → P → B (`--mobile`), le point de demi-tour P déplaçable (`clampWaypoint`, |b| ≤ 0,99 sur chaque segment). Bouton « Deux virages » : ajoute un second point P₂ (A → P → P₂ → B), retour à un virage avec le même bouton.
- Le long de chaque ligne, une perle tous les **1 an de temps propre** (calculée segment par segment). Bouton « Lecture » : un point lumineux parcourt chaque ligne d'univers en temps de coordonnées ; à côté, deux horloges (compteurs) affichent le temps propre accumulé.
- Panneau : τ_sédentaire, τ_voyageur (marque « invariant »), différence, b sur chaque segment, et la formule segment par segment : **c dτ = √(c²dt² − dx²)**, avec les valeurs substituées (ex. « segment 1 : √(5² − 4²) = 3 ans »). Préréglage « 0,8 c, aller-retour » : P = (ct 5, x 4) → τ = 6 ans contre 10.
- Bascule « Voir depuis l'aller du voyageur » : tout le diagramme est transformé par `boost` avec la vitesse du premier segment. La sédentaire bouge, le voyageur est immobile à l'aller ; les **deux temps propres affichés ne changent pas** (invariants). Phrase : « Les deux ne sont pas symétriques : la ligne du voyageur a un coude, il a changé de référentiel. La sédentaire, non. »
- Phrase-clé (statut) : « Sur ce diagramme, la ligne droite entre deux événements est celle qui accumule le **plus** de temps propre. C'est l'inverse de la géométrie ordinaire, à cause du signe moins dans c²dτ² = c²dt² − dx². »
- Note : demi-tour instantané idéalisé ; l'accélération propre n'est pas étudiée ici ; aucune gravitation n'est nécessaire pour résoudre le paradoxe.
- Chiffre réel dans une note : muons cosmiques (durée de vie propre 2,2 µs, γ ≈ 20 typique : ils atteignent le sol) et horloges atomiques en avion (Hafele-Keating, 1971).

## Paillasse D · Vitesse limite et énergie (actes VII et VIII)

### Acte VII — Addition relativiste des vitesses
- Scène, vue de côté : quai, une fusée (`--mobile`) à b, qui lance un projectile vers l'avant à u' (dans la fusée). Deux projectiles partent ensemble : le vrai (vitesse `velCompose(u', b)` sur le quai) et un fantôme tireté « Galilée » à u' + b, barré s'il dépasse c. Une règle de vitesses sous la scène : axe de −c à +c, mur fin `--accent` à ±c, marques pour b, u (vrai) et u' + b (Galilée, peut sortir du mur).
- Curseurs : b (0 à 0,99, défaut 0,5) ; u' (−1 à 1, défaut 0,5). Bouton « u' = c (lumière) » : le projectile devient un photon `--accent` ; résultat : **c** exactement. Statut : « Lumière dans la fusée → lumière sur le quai, à la même vitesse : c'est l'invariance de c, retrouvée. »
- Formules dans le panneau, avec la convention écrite : u = vitesse sur le quai (S), u' = vitesse dans la fusée (S'), v = vitesse de la fusée : **u' = (u − v)/(1 − uv/c²)** et sa réciproque **u = (u' + v)/(1 + u'v/c²)**. Valeurs substituées.
- **Graphe** (enregistreur) : u en fonction de u' pour le b courant : droite galiléenne tiretée qui sort du cadre, courbe relativiste qui reste entre −c et +c et passe par (±c, ±c) ; point courant.
- Bouton « Étage suivant » (jusqu'à 8 étages, bouton « Remettre à zéro ») : chaque étage est une fusée lancée à 0,5 c par la précédente. Liste : 0,5 · 0,8 · 0,929 · 0,976 · 0,992… et Galilée 0,5 · 1,0 · 1,5… barré. Petites fusées empilées dans la scène, de plus en plus serrées contre le mur c. Note : « Ce qui s'additionne vraiment, c'est la rapidité, artanh(v/c) : chaque étage ajoute la même rapidité. »
- Limite : b et u' petits → Galilée retrouvé (afficher l'écart relatif).
- Panneau : b, u', u relativiste, u' + b (Galilée), écart, γ de chaque vitesse.

### Acte VIII — Énergie et quantité de mouvement
- Scène : un objet de masse m poussé par une force constante F (flèche fine `--texte`) le long d'une piste droite, vue de côté ; règle de vitesses avec le mur c. `push(m, F, t)`. À côté, un fantôme newtonien tireté qui accélère uniformément et traverse le mur (barré quand il dépasse c).
- Boutons : « Pousser » (lecture continue), « + 1 mc² d'énergie » (ajoute ΔK = mc² d'un coup et met à jour v par `bFromK` : la liste des vitesses montre des gains de plus en plus petits : 0 → 0,866 → 0,943 → 0,968…), « Arrêter », « Repartir du repos ».
- **Barres d'énergie** (dans la scène) : une colonne E empilée : mc² (hachurée, constante) + K (pleine) ; contour E. À côté, la barre K newtonienne ½mv² tiretée pour la même v : égale à basse vitesse, beaucoup plus petite près de c.
- **Triangle énergie-impulsion** (dans le panneau ou la scène) : côté vertical mc² (hachuré `--energie`), côté horizontal pc, hypoténuse E. Quand l'objet accélère, pc s'allonge, mc² ne bouge pas. Bascule « Photon (m = 0) » : le côté vertical disparaît, le triangle s'aplatit : E = pc. Légende : E² = (pc)² + (mc²)².
- Graphe (enregistreur) : v/c en fonction de t : relativiste (courbe qui tend vers 1 sans l'atteindre) et newtonien (droite qui traverse 1).
- Préréglage « Proton du LHC » : m = 0,938 GeV/c², E = 6,8 TeV : γ ≈ 7 250, v/c = 0,999 999 990 (afficher les décimales utiles) : « encore 3 m/s sous c ».
- Phrases (statut) : au repos « E₀ = mc² : l'énergie qu'un objet possède du seul fait de sa masse. » ; en mouvement « E = γmc². E = mc² n'est que le cas au repos. » ; près de c « Chaque mc² ajouté rapproche de c sans jamais l'atteindre : il faudrait une énergie infinie. » Et une ligne fixe : « La masse m ne change pas avec la vitesse : c'est l'énergie et la quantité de mouvement qui croissent (on évite le vieux terme "masse relativiste"). »
- Panneau : v/c, γ, m, E₀ = mc², K, K newtonienne, E, p (en mc), pc, vérification E² − (pc)² = (mc²)² (marque « invariant »).
- **Pont vers le module 47** (petit encadré en bas du panneau de l'acte VIII seulement, trois lignes, sans développement) : « Jusqu'ici : des référentiels inertiels, un espace-temps plat. Que se passe-t-il si l'observateur accélère ? Si la gravitation s'en mêle ? Si l'espace-temps lui-même se courbe ? → Fondations 47 · Relativité générale (à venir). »

## Mise en scène
- Stepper à trois groupes : « R · Référentiels et lumière » (I–III), « E · Espace-temps » (IV–VI), « D · Vitesse limite et énergie » (VII–VIII). Fondu entre actes. Chaque acte a ses propres outils (`data-acts`).
- Panneau : numéro et titre de l'acte, 1 à 3 phrases, statut, enregistreur (canvas) quand utile, légende SVG, mesures en IBM Plex Mono avec unités, note d'honnêteté de l'acte (une ligne).
- Micro-interactions de découverte (survol → nom + rôle) : quai, train, passager, balle, photon, photon fantôme, horloges, miroirs, triangle, repères, marques de brûlure, M, M', fronts, horloges synchronisées, événement, ligne d'univers, cône (futur, passé, ailleurs), axes ct' et x', hyperbole, ligne de simultanéité, ruban d'univers, perles de temps propre, point de demi-tour, fusées, mur c, barres d'énergie, triangle.
- Clavier : Espace pause, ← → acte, 1 à 8 aller à l'acte, R réinitialiser, `L` allumer la lampe / lancer (actes I, VII), `F` changer de référentiel (actes I, II, III, IV, VI).
- Responsive jusqu'à 375 px sans défilement horizontal ; < 861 px : scène, contrôles, panneau empilés. Les diagrammes restent lisibles à 375 px (graduations éclaircies).
- `prefers-reduced-motion` : pas de fondus, animation de boost remplacée par un saut ; simulations conservées.
- Aucune erreur console ; canvas à l'échelle de `devicePixelRatio` ; pas de bibliothèque ; pas d'image externe.
- `window.__labo` : `{ Phys, act, goAct, state, tick, setPlay, … }` + crochets de test : `setB(b)`, `setFrame('S'|'Sp')`, `lamp()`, `throwBall()`, `scrub(t)` (acte III), `placeEvent(t, x)`, `boostTo(b)` (acte IV), `setMode('horloge'|'regle')`, `setWaypoint(t, x)` (acte VI), `setUp(u)`, `nextStage()` (acte VII), `addMc2()`, `preset(name)` (acte VIII) ; `state()` renvoie les grandeurs affichées de l'acte courant.

## Honnêteté (dans la page, une ligne par acte, et dans l'explication)
- Une seule dimension d'espace (mouvement selon x) ; les directions perpendiculaires ne sont pas contractées (seule la hauteur de l'horloge lumineuse sert, et elle est la même pour tous).
- Train, fusée et vitesses fictifs ; échelles de temps choisies pour être visibles.
- Les scènes montrent les **coordonnées mesurées** dans un référentiel, pas ce qu'une caméra enregistrerait.
- Demi-tour instantané (acte VI) ; force constante dans le référentiel de départ (acte VIII).
- Pas de gravitation ni d'accélération propre détaillée : relativité restreinte, espace-temps plat.

## Hors champ
Accélération propre détaillée, quadrivecteurs complets, tenseurs, électromagnétisme relativiste, aberration et Doppler relativistes approfondis, apparence visuelle (rotation de Terrell), relativité générale, Schwarzschild, trous noirs, cosmologie.
