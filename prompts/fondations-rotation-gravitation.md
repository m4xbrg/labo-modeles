# Fondations · Rotation, gravitation et orbites (modules 12 et 13)

Dossier de sortie : `opus-sonnet/fondations-rotation-gravitation/` (`index.html` + `explication.html`). Charte : `00-direction-artistique.md`, intégralement. Gabarit : **le même que `fondations-forces-energie/index.html`** (scène, titre discret, panneau de lecture, barre de contrôles, stepper d'actes groupés par paillasse, infobulle de découverte, clavier, fondu entre actes, `window.__labo`). Cette planche prolonge celle-là : même code couleur, même manière de dessiner flèches et barres d'énergie.

Accent : `--accent: #d4ee8a;` (chartreuse pâle). En-tête : `L’invisible en mouvement — Fondations 12·13`, titre « Rotation, gravitation et *orbites* ».

Budget : ≈ 1 ADN : un `index.html` autonome de l'ordre de 100 à 130 Ko, sept actes, au plus trois ou quatre curseurs par acte.

## Intention

Deux paillasses. **R · rotation** (actes I à IV) transpose à la rotation ce que l'étudiant connaît déjà de la translation : angle ↔ position, ω ↔ v, α ↔ a, couple ↔ force, moment d'inertie ↔ masse, moment cinétique ↔ quantité de mouvement. **G · gravitation** (actes V à VII) montre qu'une orbite est une chute libre qui rate le sol, et relie la forme de la trajectoire à l'énergie.

Intuitions à rendre évidentes (dans cet ordre de priorité) :
1. Une orbite est une chute libre continue (acte V, moment fort).
2. Rapprocher la masse de l'axe fait tourner plus vite quand L est conservé (acte III).
3. Faire tourner demande plus ou moins d'effort selon la distribution de la masse, pas seulement selon la masse (acte II).
4. Le couple est l'analogue rotationnel de la force ; le moment cinétique peut être transféré ou conservé.
5. La forme de l'orbite (chute, cercle, ellipse, fuite) est décidée par l'énergie totale.

## Moteur physique : verrouillé et déjà testé

Le moteur est écrit et vérifié. Copie **à l'identique** le fichier
`C:\Users\m4xbr\AppData\Local\Temp\claude\C--Users-m4xbr-dev-labo-modeles--claude-worktrees-rotation-gravitation-foundations-ff89e5\3a14a035-009c-4a63-95d7-85d2505fa161\scratchpad\phys.js`
dans le `<script>`, du marqueur `/* PHYS-BEGIN */` au marqueur `/* PHYS-END */` inclus (sans la dernière ligne `module.exports`). Ne modifie pas ces fonctions ; si tu as besoin d'un calcul de plus, écris-le hors du bloc. Le test `scratchpad/test.js` doit continuer de passer sur ta page : `node test.js <chemin>/index.html`.

Ce qu'il fournit (unités SI) :
- `stepKin` (acte I), `inertiaRotor`, `stepRot`, `timeToAngle` (acte II), `stepSkater`, `stepRing`, `ringBudget` (acte III), `gyroInit`, `stepGyro`, `precessionRate` (acte IV) ;
- `ORB` (astre de la masse et du rayon de la Terre), `gAt`, `vCirc`, `vEsc`, `energy` (par kg), `stepOrbit`, `advanceOrbit` (s'arrête à l'impact ou à la fuite, champ `ended`), `elements` (e, a, b, rp, ra, T, h, type ∈ impact/cercle/ellipse/parabole/hyperbole, direction du périastre `wp`), `launch(alt, v0, angle)`, `uEff`, `sweptArea` (actes V et VI) ;
- `binaryInit`, `stepBinary`, `bodies` (acte VII, unités réduites : a = 1, période = 1).

Boucle : pas fixes découplés de l'affichage (accumulateur) : `ROT.dt`, `SK.dt`, `RING.dt`, `GY.dt`, `BI.dt`. Pour les orbites, `advanceOrbit(s, dtPhys)` gère lui-même ses sous-pas : appelle-le une fois par image avec `dtPhys = dtÉcran × accélération du temps`.

## Code couleur (le même partout dans la page, cohérent avec 10·11)

- **Couple τ et accélération angulaire α** : `--accent` (comme ΣF et a dans 10·11 : ce qui change le mouvement). Accélération gravitationnelle **g** : `--accent` aussi (flèche vers le centre de l'astre).
- Vitesse tangentielle v et vitesse orbitale : flèche fine `--texte-2`. Vitesse angulaire ω : arc fléché fin `--texte` autour de l'axe.
- **Moment cinétique L** : `--positif` si L > 0 (sens antihoraire), `--negatif` si L < 0, comme p dans 10·11 (grandeur signée autour d'un axe fixe).
- Énergie : famille `--energie`, texture = forme : cinétique (rotation ou translation) plein ; potentielle gravitationnelle hachurée (et **négative** : la barre descend sous la ligne zéro) ; dissipée pâle à 35 % ; travail reçu contour en tirets. Énergie totale : contour `--texte`.
- Poids, forces individuelles : flèches fines `--texte`.
- Trajectoires : trait `--texte` fin ; traces des tirs précédents à 25 % ; ligne « sans gravité » tiretée `--texte-2`.

Les flèches et barres sont des représentations à échelle fixe dans un acte (« 1 N·m = n px »), la page le dit.

## Paillasse R · rotation

### Acte I — Tourner (cinématique ; rotation ≠ translation)
- Scène : un grand disque vu de face (rayon physique 0,40 m), une bande radiale peinte qui tourne avec lui ; ligne de référence fixe tiretée « θ = 0 » ; arc θ entre les deux, étiqueté. Trois points sur la bande à r = 0,10, 0,20, 0,30 m, plus un **point P** déplaçable (glisser le long de la bande, ou curseur r_P de 0,02 à 0,40 m) dessiné en `--accent`.
- Chaque point : flèche v = ωr tangente, et une traînée d'arc de la dernière seconde (longueur s = rΔθ) : les points extérieurs parcourent plus de chemin pour le même angle. Pour P seulement : accélération centripète a_c = ω²r (tirets vers le centre) et tangentielle a_t = αr (si α ≠ 0).
- Consigne : curseur « ω visée » (−6 à 6 rad/s, défaut 1,5). `stepKin(s, ωvisée, 2, dt)` : ω rejoint la consigne avec α ≤ 2 rad/s², donc α est visible pendant le changement puis retombe à 0. Bouton « Arrêter » (consigne 0).
- Bouton bascule « Comparer à une translation » : une bande au bas de la scène où un bloc portant trois points identiques file à la vitesse v_P (défilement des graduations, comme 10·11) ; toutes ses flèches sont égales. Phrase à l'écran : « translation : même v pour tous les points · rotation : même ω, v = ωr ».
- Panneau : θ (rad et tours), ω (rad/s et tr/min), α, r_P, s_P = r_P·θ, v_P, a_c, a_t. Enregistreur 10 s : ω(t) `--texte`, α(t) `--accent`.

### Acte II — Couple et inertie (expérience A, laboratoire de rotation)
- Scène : deux rotors côte à côte, vus de face, **même masse totale**. Chacun : moyeu (disque plein 1 kg, R 0,10 m), deux rayons sans masse de 0,50 m, deux masses m à la distance r de l'axe (r_A et r_B). Un tambour de rayon d (le bras de levier) sur le moyeu ; une corde tangente tirée par une force F (flèche `--texte` au point de tangence, toujours perpendiculaire au rayon) ; segment tireté de l'axe au point d'application étiqueté « d ». Arc fléché `--accent` autour du moyeu quand τ ≠ 0, taille ∝ τ.
- Curseurs : F (0 à 10 N, défaut 4), d (0,02 à 0,10 m, défaut 0,05), m (0,1 à 1 kg, défaut 0,5), r_A (0,05 à 0,45 m, défaut 0,10), r_B (défaut 0,40). τ = F·d est le même pour les deux rotors.
- Boutons : « Couple pendant 1 s » (les deux reçoivent τ exactement 1,000 s), « Couple sur 1 tour » (chacun reçoit τ jusqu'à ce que **son** θ ait avancé de 2π depuis le début, coupure exacte avec `timeToAngle` ; B finit plus tard), « Maintenir » (bouton tenu, ou touche `D`), bascule « Frein » (`stepRot(..., brake=true, ...)`, arrêt exact), « Arrêter » (ω = 0).
- Panneau, deux colonnes A | B : I = I_moyeu + 2mr², α, ω, L = Iω, E = ½Iω², travail reçu W = τΔθ. Enregistreur : ω_A(t), ω_B(t) (texte plein et tireté), bande `--accent` pâle quand le couple est appliqué. Sous l'enregistreur, barres : L_A, L_B (`--positif`) et E_A, E_B (`--energie` plein) avec W en contour tireté.
- Phrases de statut (selon le dernier bouton) : après « 1 s » → « Même couple, même durée : même L (τΔt). Mais ω et E diffèrent : E = L²/2I. » ; après « 1 tour » → « Même couple sur le même angle : même travail τ·2π, donc même énergie. Mais L diffère. »

### Acte III — Moment cinétique conservé (expérience B)
Deux modes, boutons en tête des outils : « Patineur » / « Anneau ».
- **Patineur** (vu de dessus, abstrait, pas de silhouette réaliste) : un corps ovale (épaules) avec une tête, deux bras (traits) tenant deux haltères (m = 2 kg chacune) à la distance r. `stepSkater`. Curseur « Bras » r visé (0,20 à 0,90 m) ; boutons « Ramener » (0,20) / « Écarter » (0,90) ; bouton « Lancer la rotation » (ω = 3 rad/s au r actuel ; c'est le seul moment où un couple extérieur agit, dis-le) ; bascule « Frottement de la glace » (couple extérieur faible : L décroît lentement).
- **Rectangle I × ω** (au cœur de la leçon), dans la scène ou le panneau : un graphe ω en fonction de I, l'hyperbole ω = L/I pour le L courant (tiretée), le point (I, ω) et le **rectangle ombré** entre l'origine et ce point, d'aire L. Quand on ramène les bras, le rectangle s'amincit et s'allonge mais garde son aire. Avec la glace, l'hyperbole elle-même descend lentement.
- Panneau : r, I, ω (rad/s et tr/s), L, E = L²/2I, tension dans un bras T = mω²r, travail des bras W. Phrase : « En ramenant les haltères, les bras tirent (T) sur une distance : ce travail devient énergie de rotation. L, lui, ne change pas. »
- **Anneau** (vu de dessus) : un plateau (disque 1,5 kg, R 15 cm) tourne à 20 rad/s ; un anneau (1,0 kg, R 12 cm) immobile au-dessus. « Lâcher l'anneau » : il descend (agrandi puis ramené à sa taille en 0,4 s, effet de perspective seulement, à dire), puis `stepRing(..., coupled=true, ...)` : il glisse, les vitesses se rejoignent en environ 4 s. Un repère peint sur chaque objet montre leur rotation propre.
- Panneau anneau : ω₁, ω₂, L₁, L₂, L total (constant), énergie totale, chaleur dégagée. Barres empilées : L₁ + L₂ (hauteur totale constante, la part change de couleur… même famille `--positif`, deux opacités) ; énergie empilée K₁, K₂, E_th. Enregistreur ω₁(t), ω₂(t). Phrase : « Le frottement entre les deux transfère du moment cinétique du plateau à l'anneau. Le total ne change pas. L'énergie, elle, en perd (I₂/(I₁+I₂) ≈ 46 %) : chaleur. »

### Acte IV — Gyroscope et précession (introduction visuelle)
- Scène en pseudo-3D (projection orthographique, élévation ≈ 20°) : un sol (ellipse fine), un poteau, un pivot ; l'axe (d = 0,12 m) part du pivot selon la direction (sinθ cosφ, sinθ sinφ, cosθ) ; au bout, une roue-anneau (R = 8 cm) perpendiculaire à l'axe, dessinée comme une ellipse projetée (24 points) avec 4 rayons. Petite trace de la pointe de l'axe sur son cercle de précession.
- Vecteurs à la roue : poids mg (`--texte`, vers le bas) ; **L** le long de l'axe (`--positif`, longueur ∝ L, plafonnée) ; **τ** horizontal, perpendiculaire à l'axe (`--accent`) ; au bout de L, un petit ΔL = τΔt tireté `--accent` dans le sens de τ : c'est lui qui fait tourner L.
- `gyroInit(ω3, smooth)` puis `stepGyro`. Curseur « rotation propre ω » (0 à 300 rad/s, défaut 200). Boutons « Lâcher » (φ̇ = 0 au départ : réaliste, petite nutation), « Lâcher en douceur » (précession déjà lancée, nutation quasi nulle), « Tenir » (remet l'axe horizontal, tenu, immobile). À ω = 0, la roue tombe sur la butée (θ = 150°) : statut « Sans rotation, le couple du poids la fait simplement tomber. »
- La rotation propre réelle (jusqu'à 50 tr/s) ne peut pas s'afficher sans stroboscopie : la roue est dessinée tournant à au plus 10 rad/s, dans le bon sens, et une étiquette discrète le dit (« rotation propre ralentie à l'affichage »).
- Panneau : ω, L = I₃ω, τ = mgd·sinθ, Ω prédite = τ/L, Ω mesurée (φ̇ lissé sur 0,5 s), période de précession 2π/Ω, inclinaison de l'axe (90° − θ en degrés, « sous l'horizontale » si négatif… choisis la convention la plus lisible). Enregistreur : inclinaison (t) (nutation visible) et Ω(t).
- Phrase-clé : « Le couple du poids ne fait pas tomber la roue : il ajoute à L un petit ΔL horizontal, perpendiculaire à L. L tourne au lieu de pencher. Plus L est grand, plus il tourne lentement : Ω = τ/L. » Indiquer « approximation gyroscopique : Ω ≪ ω » et que la théorie complète (nutation, toupie) est hors de ce module.

## Paillasse G · gravitation

Astre central : sphère de la masse et du rayon de la Terre, **sans atmosphère**, rotation propre ignorée, objet lancé de masse négligeable (l'astre ne bouge pas, sauf acte VII). Dessin : disque sombre `--fond-2`, liseré fin, légère lueur du limbe ; aucun continent. Les distances sont **à l'échelle** dans les actes V et VI (rayon, altitude, trajectoires) ; seul le point de l'objet est grossi. Temps accéléré, facteur affiché (« temps ×600 »), temps physique affiché en minutes ou en heures.

### Acte V — Le canon de Newton (expérience C, moment fort)
- Scène : l'astre, une tour fictive de 400 km au sommet (dessinée à l'échelle : fine), un canon horizontal vers la droite. Anneaux tiretés à r = R, 2R, 3R, 4R étiquetés de g (9,8 · 2,5 · 1,1 · 0,6 m/s²) : la loi en 1/r² se lit d'un coup d'œil. Bascule « Champ g » : grille de flèches `--accent` vers le centre, longueur ∝ g (plafonnée, l'écrire). Survoler n'importe quel point de l'espace : infobulle « g = GM/r² = … m/s² à r = … R ».
- Curseur v₀ (0 à 12 km/s, pas 0,05, défaut 6). Préréglages : « 4 km/s », « v_c (7,67) », « 9 km/s », « v_lib (10,85) », « 11,5 km/s ». Bouton « Tirer ». Avant le tir, le panneau annonce le type prévu (`elements`) et v₀/v_c, v₀/v_lib.
- Pendant le vol : point lumineux, trace, flèche g vers le centre (`--accent`), flèche v. **Comparaison** (bascule, active par défaut) : (1) la droite tiretée « sans gravité » depuis la bouche du canon et un point fantôme qui la parcourt à v₀ ; un segment entre le fantôme et le projectile étiqueté « chute » ; (2) une balle **lâchée** sans vitesse depuis la bouche au même instant (chute libre radiale, même intégrateur), avec sa propre distance de chute. Les deux « chutes » sont égales au début : c'est le cœur de la leçon. Panneau : « chute depuis la ligne droite » et « chute de la balle lâchée » en km, côte à côte.
- Vue : auto-cadrage doux au tir (le rayon visible englobe l'apoastre prévu × 1,15, entre 1,6 R et 14 R) ; une fuite sort du cadre : statut « fuite : l'objet ne reviendra pas ». Les 6 derniers tirs restent en traces pâles, étiquetés par leur v₀. Bouton « Effacer les traces ».
- Accélération du temps automatique : choisie à chaque tir pour qu'une révolution (ou le vol jusqu'à l'impact) dure 6 à 10 s à l'écran ; curseur « vitesse d'affichage » ×0,25 à ×4 en plus.
- Fin : « impact à … km/s après … min » / « orbite circulaire, une révolution en 92 min » / « ellipse… » / « fuite ».
- Panneau : v₀, v_c(400 km), v_lib(400 km), t, altitude, v, g local, les deux chutes. Enregistreur : altitude(t) et v(t).
- Phrase-clé : « Le projectile tombe exactement comme la balle lâchée. Mais il file si vite de côté que le sol se dérobe sous lui à mesure qu'il tombe. Une orbite, c'est une chute qui rate le sol. »

### Acte VI — Ellipse et énergie (expérience D)
- Scène : même astre, lancer horizontal depuis 400 km, curseur v₀ de 7,0 à 11,5 km/s (défaut 9). Conique prévue tracée finement (à partir de `elements`), astre à un foyer, l'autre foyer marqué « foyer vide » ×, grand axe tireté, **périastre** et **apoastre** marqués avec leur altitude (préciser « périgée / apogée autour de la Terre »). Flèche v longue au périastre, courte à l'apoastre.
- Bascule « Aires (Kepler 2) » : le rayon astre–satellite balaie des secteurs pendant des intervalles égaux de T/12, remplis en alternance (`--accent` 12 % / 22 %) ; aires égales (afficher l'aire du dernier secteur en % de πab/12).
- Barres d'énergie par kilogramme dans la scène (coin) : K (plein, positif), U (hachuré, **sous la ligne zéro**), E = K + U (contour). Unité MJ/kg.
- Panneau, graphe **puits de potentiel** : U(r) = −GM/r de R à r_max, ligne horizontale E, le point (r, U(r)) qui glisse, et le segment vertical entre U et E étiqueté K (K = E − U, toujours). Ligne E = 0 « seuil de libération ». Bascule « Potentiel effectif » : courbe tiretée U_eff(r) = −GM/r + h²/2r², dont les intersections avec E sont exactement le périastre et l'apoastre (les marquer). Si E ≥ 0 : la ligne E passe au-dessus de zéro, l'orbite s'ouvre.
- Kepler 3 : afficher T et a, et « T²/a³ = 4π²/GM = 9,90 × 10⁻¹⁴ s²/m³ » : la même valeur pour toute ellipse essayée.
- Panneau : r, altitude, v, K, U, E (MJ/kg), h = r·v⊥ (constant), e, a, altitudes du périastre et de l'apoastre, v au périastre et à l'apoastre, T.
- Phrase-clé : « Tout se joue sur E. E < 0 : lié (cercle ou ellipse). E = 0 : juste assez pour s'échapper. E > 0 : fuite. Le long d'une orbite, K et U s'échangent ; leur somme ne bouge pas. »

### Acte VII — Barycentre (deux corps)
- Scène : deux corps qui tournent autour d'un barycentre fixe (croix `--accent`). `binaryInit(e)`, `stepBinary`, `bodies(s, m1, m2)`. Tailles **pas à l'échelle** (rayon ∝ m^(1/3), minimum lisible : l'écrire). Traces des deux corps. Flèches de quantité de mouvement p₁ et p₂ (égales et opposées : Σp = 0, renvoi à 10·11).
- Curseurs : rapport des masses q = m₂/m₁ (échelle log, 0,001 à 1) et excentricité (0 à 0,7). Préréglages : « Terre–Lune » (q = 0,0123), « Soleil–Jupiter » (q = 0,000954), « Binaire 2 : 1 » (q = 0,5), « Jumelles » (q = 1).
- **Loupe** (encart circulaire dans un coin) centrée sur le barycentre, agrandie pour que le petit cercle du corps 1 soit visible quand q est petit (facteur affiché). C'est le « vacillement » de l'étoile qui trahit une planète.
- Pour les préréglages réels, une ligne de faits : Terre–Lune : barycentre à 4 670 km du centre de la Terre (rayon 6 371 km : à l'intérieur) ; Soleil–Jupiter : à ≈ 742 000 km du centre du Soleil (rayon 696 000 km : juste à l'extérieur).
- Panneau : q, r₁/r₂ = m₂/m₁, v₁/v₂, période commune, distance du barycentre au corps 1 en fraction de a. Phrase : « Les deux corps tournent autour de leur centre de masse commun, chacun sur sa propre orbite, dans le même temps. Le plus lourd décrit la plus petite. »

## Mise en scène
- Stepper à deux groupes (« Paillasse R · rotation » I–IV, « Paillasse G · gravitation » V–VII), comme 10·11. Fondu entre actes. Chaque acte a ses propres outils (`data-acts`).
- Panneau : numéro et titre de l'acte, 1 à 3 phrases, statut, enregistreur (canvas), légende SVG, mesures en IBM Plex Mono avec unités, note d'honnêteté de l'acte (une ligne).
- Micro-interactions de découverte (survol → nom + rôle) : point P, masses, tambour, flèche F, arc τ, haltères, rectangle I×ω, plateau, anneau, roue, vecteurs L/τ/ΔL, astre, anneaux g, projectile, fantôme, balle lâchée, foyers, périastre, apoastre, secteurs, barres, barycentre, loupe.
- Clavier : Espace pause, ← → acte, 1 à 7 aller à l'acte, R réinitialiser, `D` maintenir le couple (acte II), `T` tirer / lancer (actes V et VI).
- Responsive jusqu'à 375 px sans défilement horizontal ; < 861 px : scène, contrôles, panneau empilés.
- `prefers-reduced-motion` : pas de fondus ; simulations conservées.
- Aucune erreur console ; canvas à l'échelle de `devicePixelRatio` ; pas de bibliothèque ; pas d'image externe.
- `window.__labo` : `{ Phys, act, goAct, state, tick, setPlay, … }` + des crochets de test par acte (par exemple `fire(v0)`, `torque1s()`, `skaterTo(r)`, `dropRing()`, `releaseGyro(w, smooth)`, `setBinary(q, e)`), et `state` renvoyant les grandeurs affichées.

## Honnêteté (dans la page, une ligne par acte, et dans l'explication)
- Rotation autour d'un **axe fixe** seulement ; masses ponctuelles sur des rayons sans masse ; moment d'inertie scalaire (pas de tenseur).
- Gyroscope : vraie intégration de la toupie pesante, mais avec un amortissement de la nutation (frottement au pivot) et une rotation propre maintenue constante ; seule l'idée Ω = τ/L est enseignée ici.
- Gravitation newtonienne, astre sphérique et immobile (sauf VII), pas d'atmosphère, pas d'autres corps, pas de relativité. Montagne de 400 km fictive. Temps accéléré. Point de l'objet grossi. Acte VII : tailles non à l'échelle.

## Hors champ
Tenseur d'inertie 3D, mécanique du solide complète, théorie de la toupie (nutation détaillée), précession relativiste, problème à N corps, points de Lagrange, marées (seulement évoquées dans l'explication), relativité générale.
