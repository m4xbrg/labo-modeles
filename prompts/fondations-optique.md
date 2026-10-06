# Fondations · Optique fondamentale (module 25)

Dossier de sortie : `opus-sonnet/fondations-optique/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 25`, titre « Optique : la lumière qui *tourne* ». Accent : `--accent: #f6c6a0;` (pêche pâle). Budget : ≈ 0,8 ADN, **un chapitre de 4 étapes**. Une table d'optique sombre, vue de dessus : c'est la scène de toutes les étapes.

Préalables conseillés : 15 (ondes, fronts d'onde), 24 (onde électromagnétique). Elle prépare la vision, l'arc-en-ciel, la fibre optique, le microscope, la lentille gravitationnelle (47).

## Intention

À la fin, l'étudiant sait que **la lumière tourne à l'entrée d'un milieu parce qu'elle y ralentit**, et que tout le reste (réflexion totale, lentilles, couleurs d'un prisme) en découle. Intuitions à rendre évidentes, par ordre de priorité :

1. Un front d'onde qui arrive en biais sur du verre ralentit d'un côté avant l'autre : il pivote. La loi de Snell-Descartes est la géométrie de ce pivotement (étape 1, moment fort).
2. Sortir d'un milieu lent vers un milieu rapide a une limite : au-delà de l'angle critique, plus rien ne sort. La fibre optique piège la lumière ainsi (étape 1).
3. Une lentille est une machine à faire converger : tous les rayons issus d'un point de l'objet se retrouvent en un point de l'image (étape 2, moment fort).
4. L'indice dépend de la couleur : un prisme ne « colore » pas la lumière, il trie ce qu'elle contient déjà (étape 3).
5. La lumière a une direction de vibration ; un polariseur la filtre, et deux polariseurs croisés éteignent tout, sauf si on en glisse un troisième entre eux (étape 4).

Interdits : « la lumière choisit le chemin le plus court » sans précision (c'est le chemin de durée stationnaire, à nommer dans l'explication seulement), « le prisme crée les couleurs ».

## Réutilisation (ne pas reconstruire)

- Fronts d'onde, principe de superposition, λ = v/f : `../fondations-oscillations-ondes/` (module 15) et `../05-ondes-interferences/` (interférences 2D : ne pas les refaire ; la diffraction reste hors champ).
- Onde EM, vecteur E transverse, spectre, `visibleColor` : `../fondations-onde-electromagnetique/` (module 24). Reprendre la même rampe de couleurs.
- Vecteurs et projections (Malus est une projection au carré) : `../fondations-langage/` (toy Vecteurs).

## Moteur (à écrire et tester avant la page)

Bloc `/* OPT-BEGIN */ … /* OPT-END */`, objet `Opt`. Longueurs en mm, angles en radians.

- **Interfaces** : `snell(n1, n2, theta1)` → `{theta2, total}` ; `critical(n1, n2)` ; `fresnel(n1, n2, theta1)` → `{Rs, Rp, Ts, Tp, R}` (lumière non polarisée R = (Rs + Rp)/2) ; `brewster(n1, n2)`.
- **Huygens** (étape 1) : `wavefront(n1, n2, theta1, t)` → positions des fronts plans de part et d'autre d'une interface plane, pour l'animation.
- **Tracé de rayons** : scène = liste de surfaces (droites, arcs de cercle, segments) avec indices de part et d'autre ; `trace(ray, scene, maxBounces)` → segments avec intensité (réflexion partielle de Fresnel en option) ; `fiber(path, n_core, n_clad)` (fibre courbe : suite d'arcs).
- **Lentilles** : `thinLens(f, dObj, hObj)` → `{dImg, hImg, m, real}` (convention : distances réelles positives) ; `lensSurfaces(R1, R2, n, e)` (lentille épaisse réelle en deux surfaces sphériques pour le tracé exact) ; `lensmaker(R1, R2, n)`.
- **Dispersion** : `cauchy(lambda_nm, glass)` avec `BK7` (A = 1,5046, B = 4 200 nm²) et `flint` (verre F2 : A ≈ 1,592, B ≈ 9 800 nm², soit n(587,6 nm) ≈ 1,620) ; `prismDeviation(n, apex, theta1)` ; `minDeviation(n, apex)`.
- **Polarisation** : `malus(I, angle)` ; `chain(I0, angles, unpolarized)` (suite de polariseurs idéaux).

### Tests du moteur

1. Snell : air → eau (1,333) à 45° : 32,0° ; air → verre (1,5) à 30° : 19,47°.
2. Angle critique : verre/air 41,81°, eau/air 48,6°, diamant (2,417)/air 24,4°.
3. Fresnel en incidence normale air/verre 1,5 : R = 4,00 % ; à l'angle de Brewster (56,31°) Rp = 0 à 10⁻⁹.
4. Conservation : R + T = 1 pour chaque polarisation, à tout angle (100 angles tirés).
5. Lentille mince f = 100 mm, objet à 300 mm : image à 150 mm, m = −0,5 ; objet à 50 mm : image virtuelle à −100 mm, m = +2.
6. Lentille épaisse biconvexe (R = ±100 mm, n = 1,5, e = 5 mm) : rayons paraxiaux (h < 1 mm) convergent à la focale effective de la formule des opticiens pour lentille épaisse (100,8 mm, mesurée depuis le plan principal image) à 0,5 % ; rayons marginaux (h = 20 mm) convergent **plus près** (aberration sphérique).
7. Cauchy BK7 : n(486 nm) ≈ 1,5224, n(656 nm) ≈ 1,5144 (à 0,002) ; le bleu dévie plus que le rouge dans un prisme de 60°.
8. Malus : deux polariseurs croisés → 0 ; trois polariseurs 0°, 45°, 90° sur lumière non polarisée → I₀/8.
9. Fibre : rayon injecté sous l'angle d'acceptance reste dans le cœur sur 10 arcs ; au-delà, il s'échappe au premier contact.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| rayon de lumière blanche | `--texte` lumineux ; rayons colorés : `visibleColor(λ)` |
| fronts d'onde | arcs ou droites fins `--accent` |
| verre, eau, diamant | aplats `--fond-2` avec liseré `--texte-2`, densité de hachures ∝ n |
| normale à l'interface | tireté `--texte-2` ; angles : arcs fins avec valeur |
| rayon réfléchi partiel | même couleur que le rayon, opacité ∝ R |
| objet / image | flèche `--accent` (objet), flèche `--texte` (image réelle), tiretée (image virtuelle) |
| direction de polarisation | double flèche `--accent` sur le rayon ; axe du polariseur : traits fins parallèles |

## Chapitre · Module 25 · Optique fondamentale

### Étape 1 · Réfraction et réflexion totale (moment fort)
- Scène : une interface horizontale ; en haut un milieu, en bas un autre. Un laser qu'on oriente à la souris (poignée). Rayon incident, réfléchi (opacité = R de Fresnel), réfracté ; normale et angles. Bascule « Fronts d'onde » : un faisceau large dessiné comme une suite de fronts plans qui ralentissent dans le milieu dense (espacement λ/n) et pivotent ; la bascule montre que la règle de Snell est la géométrie de ce ralentissement.
- Contrôles : angle d'incidence (en tirant le laser, ou curseur), milieu du bas (« eau 1,33 », « verre 1,50 », « diamant 2,42 »), bouton « Inverser : de l'intérieur vers l'air ». En sens inverse, au-delà de θc, le rayon réfracté disparaît et le réfléchi devient total (le dire avec un compteur R = 100 %).
- Sous-scène (bascule) : « Fibre optique » : un cylindre courbe qu'on déforme (deux poignées), un laser à l'entrée ; la lumière rebondit en zigzag ; trop courbée, elle fuit.
- Panneau : θ₁, θ₂, n₁, n₂, v = c/n, R et T, θc quand il existe. Statuts : « Dans le verre, la lumière avance à 200 000 km/s : les fronts se resserrent et pivotent » ; au-delà de θc « Plus rien ne sort : réflexion totale ».
- Phrase-clé : « La lumière tourne à la frontière parce qu'elle change de vitesse : n₁ sin θ₁ = n₂ sin θ₂. Vers un milieu plus rapide, au-delà d'un angle critique, elle ne sort plus. »
- Note : rayons idéaux sans largeur ; une partie est toujours réfléchie, même en entrant.

### Étape 2 · Lentilles et images (moment fort)
- Scène : un axe optique, une lentille mince au centre, un objet (flèche) qu'on déplace à la souris. Trois rayons particuliers tracés (parallèle à l'axe, par le centre, par le foyer objet) ; l'image se forme où ils se croisent (ou leurs prolongements en tireté, image virtuelle). Un écran déplaçable : l'image est nette seulement à la bonne distance.
- Bascule « Rayons réels à travers le verre » : la lentille devient épaisse, un faisceau de 15 rayons tracés exactement (moteur `trace`) ; les rayons du bord convergent un peu plus près : aberration sphérique. Retour à la lentille mince : « Modèle idéal ».
- Contrôles : f (−200 à +200 mm, signe = divergente / convergente), position de l'objet (glisser), bascule « Rayons réels ».
- Panneau : d_objet, d_image, grandissement m, nature de l'image (réelle / virtuelle, droite / renversée). Préréglages : « appareil photo (objet lointain) », « projecteur (objet juste au-delà de f) », « loupe (objet entre f et la lentille) ».
- Statuts : objet à 2f « Image de même taille, renversée, à 2f » ; objet entre f et la lentille « L'image est du même côté que l'objet, droite et agrandie : c'est une loupe ; on ne peut pas la recueillir sur un écran ».
- Phrase-clé : « Une lentille réunit en un point tous les rayons qui partent d'un point de l'objet : 1/d_o + 1/d_i = 1/f. »
- Note : lentille mince idéale dans le mode par défaut ; l'œil, le microscope et les télescopes sont seulement nommés.

### Étape 3 · Couleurs et dispersion
- Scène : un prisme ; un faisceau blanc entre et ressort étalé en spectre sur un écran. Bascule « Une seule couleur » (curseur λ) : un rayon monochrome dévie sans s'étaler ; un deuxième prisme inversé recompose le blanc (expérience de Newton). Bascule « Goutte d'eau » : coupe d'une goutte sphérique, rayons qui entrent, se réfléchissent une fois à l'arrière et ressortent ; angle de sortie concentré vers 42° pour le rouge et 40° pour le violet : l'arc-en-ciel.
- Contrôles : angle du prisme (30 à 70°), verre (BK7 / flint), λ (bascule une couleur), bascule « Deuxième prisme ».
- Panneau : n(λ) pour 3 couleurs (rouge 656 nm, jaune 589 nm, bleu 486 nm), déviation de chaque couleur, étalement angulaire. Petit graphe n(λ).
- Statuts : « Le bleu dévie plus que le rouge : dans le verre, il va un peu moins vite » ; avec le deuxième prisme « Les couleurs se recombinent en blanc : le prisme n'a rien ajouté, il a trié ».
- Phrase-clé : « L'indice d'un milieu dépend de la longueur d'onde. Un prisme ou une goutte séparent ce que la lumière blanche contient déjà. »
- Note : loi de Cauchy approchée ; intensités des couleurs non pondérées par la sensibilité de l'œil.

### Étape 4 · Polarisation
- Scène : un faisceau qui traverse des polariseurs (disques avec traits parallèles), vu de biais ; sur le faisceau, la direction de vibration de E dessinée (double flèche ; lumière naturelle = étoile de directions qui changent vite). Un détecteur au bout avec une barre d'intensité.
- Contrôles : angle du polariseur 1 et du polariseur 2 (en tournant les disques à la souris), bouton « Glisser un troisième polariseur au milieu » (son angle réglable). Bascule « Reflet sur une vitre » : la lumière réfléchie à l'angle de Brewster est polarisée ; un polariseur bien orienté éteint le reflet (lunettes de soleil polarisantes).
- Panneau : I après chaque polariseur (fraction de I₀), angles relatifs, loi de Malus tracée I(θ) avec le point courant.
- Statuts : croisés « Rien ne passe » ; avec le troisième à 45° « En ajoutant un filtre, on fait passer plus de lumière : I₀/8. Chaque polariseur projette la vibration sur son axe ».
- Phrase-clé : « Le champ électrique de la lumière vibre dans une direction. Un polariseur ne garde que la projection sur son axe : I = I₀ cos² θ. »
- Fin de planche, trois questions ouvertes : **Ondes** « Pourquoi la lumière contourne-t-elle un peu les obstacles, et pourquoi le ciel est-il bleu ? » → module 15 et Atlas (diffusion, diffraction) ; **Quantique** « Que se passe-t-il quand un seul photon arrive sur un polariseur à 45° ? » → modules 48 et 50 ; **Cosmos** « La gravitation peut-elle faire tourner la lumière comme une lentille ? » → module 47.

## Micro-interactions de découverte

Laser, rayon incident, réfléchi, réfracté, normale, front d'onde, milieu, angle critique, fibre, lentille, foyer, objet, image, écran, prisme, goutte, polariseur, détecteur, reflet.

## `window.__labo` (en plus du socle)

`setAngle(deg)`, `setMedium(n)`, `reverse(on)`, `fronts(on)`, `fiber(on)` (1) ; `setF(f)`, `setObj(d)`, `realRays(on)` (2) ; `setApex(a)`, `setGlass(g)`, `mono(on, l)`, `drop(on)` (3) ; `setPol(i, deg)`, `third(on, deg)`, `glare(on)` (4).

## Théorie (explication, module 25)

- Relations : \(n = c/v\) ; \(n_1\sin\theta_1 = n_2\sin\theta_2\) ; \(\sin\theta_c = n_2/n_1\) ; \(1/d_o + 1/d_i = 1/f\) et \(m = -d_i/d_o\) ; \(R_\perp = \left(\tfrac{n_1 - n_2}{n_1 + n_2}\right)^2\) (incidence normale) ; \(I = I_0\cos^2\theta\).
- Exemple chiffré possible : poisson vu depuis la berge (profondeur apparente), ou fibre optique (angle d'acceptance pour n_cœur = 1,48 et n_gaine = 1,46), ou appareil photo f = 50 mm qui photographie une personne à 3 m.
- Pièges : mesurer les angles depuis la surface au lieu de la normale ; « la lumière ralentit donc perd de l'énergie » (la fréquence ne change pas, λ oui) ; « une image virtuelle n'existe pas » ; confondre foyer et point image ; « le prisme colore la lumière » ; « deux polariseurs croisés + un troisième = encore moins ».
- Où ça resservira : 24 (E transverse), 27 (spectroscopie), 43 (couleurs des étoiles), 47 (lentille gravitationnelle), 48 et 50 (photon polarisé), 38 (l'œil, si un jour il est traité).
- Seulement introduit ici : principe de Fermat, diffraction, diffusion Rayleigh, biréfringence, instruments à plusieurs lentilles.

## Honnêteté

Optique géométrique (pas de diffraction) ; lentille mince idéale par défaut ; Cauchy approché ; polariseurs idéaux ; couleurs sRGB approximatives.

## Hors champ

Interférences de couches minces, diffraction et réseaux, laser (fonctionnement), optique non linéaire, fibres monomodes.
