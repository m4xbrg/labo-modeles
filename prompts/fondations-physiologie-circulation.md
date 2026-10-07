# Fondations · Muscle, circulation et échanges (module 38)

Dossier de sortie : `opus-sonnet/fondations-physiologie-circulation/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 38`, titre « Muscle, cœur et *échanges* ». Accent : `--accent: #e88a8a;` (rouge sang pâle). Budget : ≈ 0,9 ADN, **un chapitre de 4 étapes**.

Elle ouvre la branche G · Physiologie. Le module 38 est un candidat au découpage (`corpus/fondations.md`) : on garde **une page de 4 étapes** (muscle, pompe, réseau, échanges) et on laisse aux showcases le battement du cœur complet, le néphron ou la respiration à l'effort.

Préalables conseillés : 20 (pression, débit, Poiseuille, continuité), 19 et 32 (diffusion), 33 (excitation), 34 (ATP), 37 (régulation).

## Intention

À la fin, l'étudiant voit le corps comme **un moteur moléculaire (le muscle), une pompe (le cœur), un réseau de tuyaux (les vaisseaux) et une surface d'échange (le poumon)**, chacun gouverné par une physique qu'il connaît déjà. Intuitions à rendre évidentes, par ordre de priorité :

1. Un muscle raccourcit sans que ses filaments raccourcissent : ils **glissent** les uns sur les autres, tirés par des têtes de myosine qui s'attachent, pivotent et se détachent, un ATP par cycle (étape 1, moment fort).
2. Le cœur est une pompe à quatre temps ; l'aire de sa boucle pression-volume est le travail qu'il fournit à chaque battement ; plus il est rempli, plus il éjecte (étape 2).
3. Dans les vaisseaux, le rayon est roi : la résistance varie comme 1/r⁴. Les artérioles, en se resserrant ou en s'ouvrant, décident où va le sang (étape 3, moment fort).
4. Le sang ralentit dans les capillaires parce que leur section totale est immense, pas parce qu'ils sont étroits (étape 3).
5. L'oxygène passe de l'alvéole au sang par simple diffusion ; l'hémoglobine en charge beaucoup grâce à sa courbe en S (étape 4).

Interdits : « le muscle pousse », « le cœur aspire le sang », « l'hémoglobine attire l'oxygène quand elle en a besoin ».

## Réutilisation (ne pas reconstruire)

- Pression, débit, continuité, Poiseuille, résistance hydraulique : `../fondations-flux-fluides/` (module 20). Ici on l'applique à un réseau ramifié.
- Diffusion et loi de Fick : `../07-matiere-chaleur/` (acte IV) et `../fondations-cellule-membrane/` (acte III).
- Potentiel d'action, libération de Ca²⁺ : `../03-neurone/` et la future page 33. Ici, l'excitation est un simple bouton « stimuler ».
- ATP et couplage : future page 34 (`../fondations-energie-biologique/`).
- Rétroaction (pression artérielle) : future page 37 ; seulement mentionnée.
- Ressort et élasticité (paroi des artères, Windkessel) : `../fondations-oscillations-ondes/` et `../06-courant-circuits/` (l'analogie RC est exacte : la dire).

## Moteur (à écrire et tester avant la page)

Bloc `/* PHYSIO-BEGIN */ … /* PHYSIO-END */`, objet `Physio`. Pressions en mmHg dans l'interface (1 mmHg = 133,32 Pa), calculs en SI.

- **Sarcomère** : `overlap(L)` (relation force-longueur active d'après Gordon, Huxley et Julian 1966, fibre de grenouille : plateau 2,00 à 2,25 µm, force nulle sous ≈ 1,3 µm et au-delà de 3,65 µm, segments documentés) ; `crossBridgeSim({nHeads, Ca, ATP, L, load, seed}, dt)` : têtes de myosine stochastiques à trois états (détachée, attachée, après le coup de rame), pas de ≈ 10 nm par cycle, ≈ 2 pN par tête attachée, un ATP consommé par détachement ; sans ATP, les têtes restent attachées (rigidité) ; sans Ca²⁺, aucune attache.
- **Cœur** : modèle à élastance variable du ventricule gauche, `heartStep(s, {HR, Emax, Emin, V0, preload, R, C}, dt)` : P = E(t)(V − V₀), valves mitrale et aortique idéales (diodes), artères en Windkessel à deux éléments (R, C), oreillette à pression de remplissage fixée ; `loop(s)` → points (V, P) d'un cycle ; `strokeWork(loop)` (aire), `metrics(s)` → VTD, VTS, VES, FE, débit.
- **Réseau** : `network(tree)` : arbre de segments (aorte, artères, artérioles par organe, capillaires, veinules, veines) avec rayon, longueur, nombre en parallèle ; `poiseuilleR(r, L, eta)` ; `solve(network, Pin, Pout)` → débits par branche et pression à chaque nœud ; `velocity(segment)` (continuité).
- **Échanges gazeux** : `hbSat(PO2, {P50, n})` (Hill, P₅₀ = 26,8 mmHg, n = 2,7 ; effet Bohr : P₅₀ déplacée vers 30 mmHg en sang acide) ; `capillaryTransit({PA, Pv, D, thickness, transit}, dt)` → PO₂(t) le long d'un capillaire pulmonaire, avec le tampon de l'hémoglobine ; `o2Content(PO2, Hb)` (1,34 mL O₂/g Hb + 0,003 mL/dL/mmHg dissous).

### Tests du moteur

1. `overlap` : 1 sur le plateau, 0 à 3,65 µm, décroissance linéaire entre 2,25 et 3,65 µm.
2. Sarcomère : force isométrique moyenne ∝ `overlap(L)` à 5 % (10 graines) ; sans Ca²⁺ force nulle ; sans ATP, plus aucun détachement ; consommation d'ATP nulle au repos (sans Ca²⁺).
3. Cœur, paramètres par défaut (HR 70/min) : VTD 110 à 130 mL, VES 65 à 75 mL, FE 55 à 65 %, débit ≈ 5 L/min, pression aortique ≈ 120/80 mmHg (à 5 mmHg).
4. Frank-Starling : précharge augmentée → VTD et VES augmentent ; la boucle s'élargit vers la droite.
5. Travail d'éjection = aire de la boucle à 2 % (comparée à ∮ P dV numérique) ; ordre de grandeur ≈ 1 J par battement.
6. Poiseuille : diviser r par 2 multiplie R par 16 à 10⁻⁹ ; resserrer les artérioles d'un organe réduit son débit et augmente légèrement celui des autres (pression d'entrée fixée par le cœur).
7. Continuité : débit 5 L/min, section aortique 4 cm² → ≈ 21 cm/s ; section capillaire totale 2 500 cm² → ≈ 0,33 mm/s.
8. Profil de pression : la chute la plus forte a lieu dans les artérioles (plus de 40 % de la chute totale).
9. Hémoglobine : saturation 97 % à 100 mmHg, 75 % à 40 mmHg (à 1 %) ; contenu artériel ≈ 20 mL O₂/dL avec Hb 150 g/L.
10. Transit capillaire de 0,75 s au repos : PO₂ atteint 99 % de la valeur alvéolaire avant 0,3 s ; paroi trois fois plus épaisse et transit de 0,25 s (effort) : équilibre non atteint.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| actine / myosine | traits fins `--texte-2` / filaments épais `--texte` avec têtes ; tête attachée en `--accent` |
| ATP, travail | `--energie` |
| Ca²⁺ | petits points `--positif` |
| sang oxygéné / désoxygéné | `#e0565b` / `#7a4fa0` désaturés (convention des schémas, à rappeler dans la légende : le sang veineux n'est pas bleu) |
| pression | dégradé d'épaisseur ou de luminance le long des vaisseaux ; profil P(x) en `--accent` |
| O₂ / CO₂ | anneau `--negatif` (code de la série) / petit point gris |
| valves | volets `--texte`, ouverts ou fermés |

## Chapitre · Module 38 · Muscle, circulation et échanges

### Étape 1 · Le sarcomère (moment fort)
- Scène : un sarcomère en coupe longitudinale, de disque Z à disque Z : filaments fins d'actine accrochés aux disques Z, filaments épais de myosine au centre avec leurs têtes. Bouton « Stimuler » : du Ca²⁺ apparaît, les têtes s'attachent, pivotent (coup de rame), se détachent en consommant un ATP, se réarment ; les filaments fins glissent vers le centre, les disques Z se rapprochent. Une loupe sur une tête montre le cycle à quatre temps.
- Contrôles : longueur initiale du sarcomère (1,4 à 3,8 µm), bouton « Stimuler » (ou maintenu : tétanos), bascule « Plus d'ATP » (rigidité : les têtes restent accrochées), charge (contraction contre une masse).
- Panneau : longueur, recouvrement, force, ATP consommés par seconde, têtes attachées. Courbe force-longueur avec le point courant. Statuts : longueur 3,6 µm « Presque plus de recouvrement : presque plus de têtes peuvent s'attacher » ; sans ATP « Sans ATP, les têtes ne se détachent plus : le muscle se fige (c'est la rigidité cadavérique) ».
- Phrase-clé : « Les filaments ne raccourcissent pas : ils glissent. Chaque tête de myosine tire un peu, se détache grâce à un ATP, et recommence. La force dépend du nombre de têtes qui peuvent s'accrocher. »
- Note : un seul sarcomère, quelques dizaines de têtes ; courbe force-longueur de la fibre de grenouille.

### Étape 2 · Le cœur, une pompe
- Scène : un ventricule gauche stylisé (cavité qui se contracte, valve mitrale à l'entrée, valve aortique à la sortie, oreillette et aorte) ; à côté, la boucle pression-volume qui se trace en direct, avec les quatre phases étiquetées (remplissage, contraction à volume constant, éjection, relaxation à volume constant) et l'aire coloriée `--energie`.
- Contrôles : fréquence cardiaque (40 à 180/min), contractilité (Emax), précharge (pression de remplissage).
- Panneau : VTD, VTS, VES, fraction d'éjection, débit, pression aortique systolique et diastolique, travail par battement et puissance. Statuts : précharge augmentée « Plus rempli, le ventricule éjecte plus : loi de Frank-Starling » ; contractilité réduite « La boucle se rétrécit : c'est ce qu'on appelle une insuffisance cardiaque » ; fréquence très élevée « Le remplissage n'a plus le temps de se faire : le volume éjecté baisse ».
- Phrase-clé : « Le cœur fonctionne en quatre temps, rythmés par ses valves. Le débit est la fréquence multipliée par le volume éjecté, environ 5 L/min au repos ; l'aire de la boucle pression-volume est le travail d'un battement. »
- Note : ventricule à élastance variable, artères en Windkessel (analogie exacte avec un circuit RC, module 22).

### Étape 3 · Un réseau de tuyaux (moment fort)
- Scène : l'arbre vasculaire déplié de gauche à droite (aorte, artères, artérioles vers trois organes : cerveau, muscles, intestin, puis capillaires, veines), l'épaisseur de chaque trait ∝ rayon, le nombre de vaisseaux en parallèle indiqué. Des globules rouges défilent à la vitesse locale. Sous l'arbre, deux profils alignés : pression P(x) et vitesse v(x), et la section totale en barres.
- Contrôles : rayon des artérioles des muscles (vasodilatation à l'effort / vasoconstriction), débit cardiaque, hématocrite (viscosité).
- Panneau : résistance de chaque organe, débit par organe (et sa part du débit total), vitesse dans l'aorte et dans les capillaires, pression à l'entrée des capillaires. Statuts : rayon des artérioles augmenté de 19 % « Un rayon à peine plus grand, une résistance deux fois plus petite : le débit vers les muscles double » (1,19⁴ ≈ 2) ; profil des vitesses « Les capillaires sont minuscules, mais il y en a des milliards : leur section totale est plusieurs centaines de fois celle de l'aorte, le sang y passe lentement, le temps des échanges ».
- Phrase-clé : « Dans un vaisseau, la résistance varie comme 1/r⁴ : les artérioles, en se resserrant ou en s'ouvrant, répartissent le sang. Le débit total se conserve : là où la section totale est grande, le sang ralentit. »
- Note : écoulement de Poiseuille, sang newtonien, débit moyen (pas de pulsation dans cette étape).

### Étape 4 · Les échanges gazeux
- Scène : une alvéole et un capillaire qui la longe ; des globules rouges entrent à gauche (sang veineux, PO₂ 40 mmHg) et sortent à droite. Les molécules d'O₂ traversent la paroi (≈ 0,5 µm) et s'accrochent à l'hémoglobine (quatre sites par molécule dessinés sur quelques globules), le CO₂ fait le chemin inverse. Sous la scène, PO₂ le long du capillaire, et à droite la courbe de saturation de l'hémoglobine avec le point courant.
- Contrôles : préréglage (« repos », « effort », « altitude 4 000 m », « paroi épaissie »), bascule « Sang plus acide » (effet Bohr).
- Panneau : PO₂ alvéolaire et sanguine, saturation, contenu en O₂ (mL/dL), temps de transit et temps d'équilibre. Statuts : repos « L'équilibre est atteint au premier tiers du trajet : il reste de la marge » ; paroi épaissie et effort « Le sang ressort avant d'avoir fini de se charger » ; Bohr « Dans un muscle qui travaille, le sang plus acide lâche plus facilement son oxygène ».
- Phrase-clé : « L'oxygène passe de l'alvéole au sang par diffusion, de la pression partielle haute vers la basse. La courbe en S de l'hémoglobine lui permet de se charger presque à fond dans le poumon et de lâcher beaucoup d'oxygène dans les tissus. »
- Fin de planche, trois questions ouvertes : **Régulation** « Qui augmente la fréquence cardiaque et ouvre les artérioles pendant l'effort ? » → module 37 ; **Défense** « Que se passe-t-il quand un vaisseau est percé ? » → module 39 ; **Rythme** « D'où vient le battement régulier du cœur ? » → module 33 et Atlas (battement du cœur).

## Micro-interactions de découverte

Disque Z, actine, myosine, tête de myosine, Ca²⁺, ATP, ventricule, valve mitrale, valve aortique, boucle pression-volume, aorte, artériole, capillaire, veine, globule rouge, alvéole, paroi alvéolo-capillaire, hémoglobine, O₂, CO₂.

## `window.__labo` (en plus du socle)

`setLength(um)`, `stimulate(on)`, `atp(on)`, `setLoad(N)` (1) ; `setHR(bpm)`, `setContractility(e)`, `setPreload(p)` (2) ; `setArteriole(organ, r)`, `setCO(q)`, `setHct(h)` (3) ; `preset(name)`, `bohr(on)` (4).

## Théorie (explication, module 38)

- Relations : \(Q = f_c \times V_{\text{éj}}\) ; \(W = \oint P\,\dd V\) ; \(R = \dfrac{8\eta L}{\pi r^4}\) et \(\Delta P = R\,Q\) ; \(Q = A\,v\) (continuité) ; \(J = D\,A\,\dfrac{\Delta P}{e}\) (Fick, forme membranaire) ; \(S = \dfrac{P^n}{P^n + P_{50}^n}\).
- Exemple chiffré possible : débit cardiaque et vitesse du sang dans l'aorte et dans les capillaires ; ou quantité d'O₂ délivrée par minute au repos (débit × différence de contenu artério-veineux ≈ 250 mL/min).
- Pièges : « les filaments raccourcissent » ; « le sang veineux est bleu » ; « le sang va plus vite dans les petits vaisseaux » ; « le cœur aspire le sang » ; « on respire pour absorber du CO₂ » ; « plus de pression = plus de débit partout » (c'est la résistance de chaque branche qui répartit).
- Où ça resservira : 37 (régulation de la pression et du rythme), 39 (hémostase), 33 (excitation du muscle et du cœur), 34 (ATP), 20 (fluides), Atlas : battement du cœur, néphron, échange gazeux pulmonaire.
- Seulement introduit ici : couplage excitation-contraction en détail, muscle lisse et cardiaque, régulation nerveuse, ventilation (mécanique respiratoire), rein.

## Honnêteté

Un sarcomère stochastique en 2D ; ventricule à élastance variable, sans oreillette active ; réseau à écoulement de Poiseuille, sang newtonien ; capillaire pulmonaire en une dimension ; valeurs pour un adulte au repos, sans valeur clinique.

## Hors champ

Pathologies, pharmacologie, électrocardiogramme, système lymphatique, contrôle nerveux de la respiration, thermorégulation.
