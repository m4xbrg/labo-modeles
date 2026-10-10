# Fondations · Immunité et coagulation (module 39)

Dossier de sortie : `opus-sonnet/fondations-immunite-coagulation/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 39`, titre « Se défendre, *réparer* ». Accent : `--accent: #c0d8ff;` (bleu glacier). Budget : ≈ 0,8 ADN, **un chapitre de 4 étapes**.

Préalables conseillés : 07 (hasard, combinatoire), 36 (recombinaison), 37 (cascades, rétroaction positive et négative), 38 (vaisseaux, sang). Elle prépare 41 (épidémies, immunité collective).

## Intention

À la fin, l'étudiant voit l'immunité comme **un système qui ne sait pas d'avance ce qu'il va combattre** : il fabrique au hasard une immense variété de récepteurs, garde et multiplie ceux qui servent, et s'en souvient. La coagulation, elle, est une cascade qui doit être explosive **et** confinée. Intuitions à rendre évidentes, par ordre de priorité :

1. La sélection clonale : parmi des millions de clones tirés au hasard, celui qui reconnaît l'intrus prolifère ; c'est de la sélection, comme dans l'évolution, à l'échelle de quelques jours (étape 2, moment fort).
2. La deuxième rencontre est plus rapide et plus forte que la première ; un vaccin est une première rencontre sans danger (étape 3).
3. Les cellules de la défense innée trouvent l'infection en remontant un gradient chimique, sans « savoir » où elle est (étape 1).
4. La coagulation est une rétroaction positive (la thrombine fabrique la thrombine) que des inhibiteurs empêchent de s'étendre au-delà de la plaie (étape 4, moment fort).

Interdits : « le globule blanc cherche la bactérie », « le système immunitaire apprend à reconnaître » sans dire comment (sélection), « l'anticorps sait qui est l'ennemi ».

## Réutilisation (ne pas reconstruire)

- Sélection, variation, fréquences : `../fondations-evolution-populations/` (module 40). L'étape 2 s'y rattache explicitement (« la même logique, à l'intérieur d'un corps »).
- Marche aléatoire, gradient : `../fondations-systemes-hasard/`, `../fondations-flux-fluides/` ; diffusion : `../07-matiere-chaleur/`.
- Croissance exponentielle et logistique : `../fondations-systemes-hasard/`.
- Cascades et rétroactions : future page 37 (`../fondations-signalisation-homeostasie/`).
- Recombinaison, combinatoire : future page 36 (`../fondations-genome-variation/`) ; la recombinaison V(D)J y est seulement introduite.
- Vaisseaux, débit : future page 38.

## Moteur (à écrire et tester avant la page)

Bloc `/* IMM-BEGIN */ … /* IMM-END */`, objet `Imm`. Hasard par générateur à graine.

- **Défense innée** : `tissueInit({bacteria, macrophages, seed})`, `tissueStep(t, dt, {chemokine: true|false})` : bactéries à croissance logistique, macrophages qui reconnaissent et libèrent une chimiokine (diffusion et dégradation sur une grille), neutrophiles qui sortent d'un vaisseau et font une marche aléatoire biaisée par le gradient (ou non biaisée si chimiokine coupée), phagocytose au contact.
- **Répertoire** : récepteurs et antigènes codés comme des chaînes de bits (longueur L, documentée) ; `repertoire(n, rng)` ; `affinity(r, a)` (bits complémentaires) ; `matches(repertoire, antigen, threshold)` ; `thymus(repertoire, selfAntigens, threshold)` (élimination des clones qui reconnaissent le soi) ; `clonalStep(clones, antigenLoad, dt)` (prolifération des clones activés, doublement en ≈ 8 h, contraction après élimination de l'antigène, cellules mémoire).
- **Réponse humorale** : `antibodyCourse({memory, dose, t})` → titres IgM et IgG (ODE documentée) ; primaire : délai ≈ 5 à 7 jours, pic vers 10 à 14 jours ; secondaire : délai ≈ 2 à 3 jours, pic 10 à 100 fois plus haut, surtout IgG.
- **Population** (panneau de l'étape 3) : `finalSize(R0, coverage)` (équation z = 1 − e^(−R₀(1−c)z)) ; `herdThreshold(R0)` = 1 − 1/R₀.
- **Coagulation** : `clotInit(L, wound)`, `clotStep(c, dt, {factorVIII, inhibitors})` : réaction-diffusion 1D le long de la paroi d'un vaisseau (facteur tissulaire à la plaie → cascade à trois étages → thrombine, rétroaction positive de la thrombine sur ses propres activateurs, inhibiteurs : antithrombine dans le sang, protéine C activée sur la paroi saine), fibrine formée là où la thrombine dépasse un seuil ; plaquettes qui adhèrent à la plaie.

### Tests du moteur

1. Chimiotactisme : temps moyen d'arrivée des neutrophiles sur le foyer au moins 5 fois plus court avec gradient que sans (moyenne sur 20 graines).
2. Répertoire : probabilité qu'un récepteur reconnaisse un antigène donné égale à la formule binomiale de la longueur et du seuil (à 5 % sur 10⁶ tirages) ; avec 10⁶ clones, au moins un clone reconnaît presque tout antigène.
3. Thymus : après sélection, aucun clone restant ne reconnaît les antigènes du soi ; la fraction éliminée correspond à la probabilité calculée.
4. Expansion clonale : effectif ×2 toutes les ≈ 8 h tant que l'antigène est présent ; contraction ensuite ; une fraction mémoire persiste.
5. Primaire contre secondaire : délai secondaire < délai primaire, pic secondaire ≥ 10 × pic primaire, rapport IgG/IgM plus grand.
6. `herdThreshold(15)` = 0,933 ; `finalSize(2, 0)` = 0,797 ; `finalSize(3, 0)` = 0,940 ; au-delà du seuil de couverture, plus d'épidémie (z → 0).
7. Coagulation : plaie sous un seuil de taille → pas de caillot (les inhibiteurs gagnent) ; au-dessus → explosion de thrombine (rétroaction positive), front qui s'arrête au bord de la plaie avec inhibiteurs ; sans inhibiteurs → le front s'étend le long du vaisseau ; facteur VIII à 5 % → délai de formation au moins 3 fois plus long.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| bactérie, intrus | bâtonnets `#dcc29a` (sable), qui se divisent |
| macrophage, neutrophile | corps organiques `--fond-2` à contour `--accent`, noyau visible ; neutrophile plus petit |
| chimiokine | nappe diffuse `--accent` à faible opacité (le gradient) |
| clones de lymphocytes | petites cellules ; chaque clone a une **forme** de récepteur (encoche) ; clone activé : lueur `--energie` |
| antigène | forme complémentaire de certaines encoches, `#dcc29a` |
| anticorps | petits Y `--accent` |
| soi | formes `--texte-2` |
| thrombine, cascade | `--energie` (intensité ∝ concentration) ; inhibiteurs : `--negatif` |
| fibrine | filaments `--texte` ; plaquettes : disques `#c8b0a0` |

## Chapitre · Module 39 · Immunité et coagulation

### Étape 1 · La défense innée
- Scène : un morceau de tissu vu de dessus, un capillaire qui le traverse. Une écharde (bouton) introduit des bactéries qui se multiplient. Les macrophages résidents en reconnaissent quelques-unes (motifs communs aux bactéries), libèrent une chimiokine qui diffuse ; les neutrophiles sortent du capillaire, remontent le gradient et mangent les bactéries. Rougeur et gonflement : le capillaire se dilate, du liquide sort (léger halo).
- Contrôles : inoculum (nombre de bactéries), vitesse de division des bactéries, bascule « Signal chimique » (coupé : les neutrophiles errent au hasard).
- Panneau : bactéries, neutrophiles arrivés, temps d'arrivée moyen, issue (infection contenue ou débordée). Statuts : sans signal « Sans gradient, les neutrophiles errent : les bactéries ont le temps de se multiplier » ; inoculum fort « La défense innée est rapide mais limitée : il faut parfois plus ».
- Phrase-clé : « La défense innée reconnaît des motifs communs à beaucoup d'intrus. Ses cellules trouvent l'infection en remontant un gradient chimique : aucune ne sait où aller, toutes vont vers plus de signal. »
- Note : tissu 2D, une seule espèce de bactérie, phagocytose instantanée.

### Étape 2 · Sélection clonale (moment fort)
- Scène : une « bibliothèque » de lymphocytes (une grille de petites cellules, chacune avec une encoche de forme différente, des milliers dessinées pour des millions réels). Bouton « Former le répertoire » : les formes sont tirées au hasard. Bascule « Passage au thymus » : les clones dont l'encoche reconnaît une forme du soi s'éteignent. Bouton « Infection » : l'antigène arrive ; les quelques clones dont l'encoche colle s'allument et se divisent (la grille se remplit de leur couleur), les autres ne bougent pas.
- Contrôles : taille du répertoire (log), seuil de reconnaissance (spécificité), forme de l'antigène (aléatoire, ou « ressemble au soi »), bascule thymus.
- Panneau : clones qui reconnaissent l'antigène (sur combien), effectif du clone vainqueur au cours des jours (courbe log), fraction éliminée au thymus. Statuts : « Sur un million de clones, une poignée reconnaît l'intrus : ce sont eux qui se multiplient » ; thymus coupé avec antigène du soi « Des clones qui reconnaissent le soi ont survécu : ils attaquent le corps (auto-immunité) ».
- Phrase-clé : « Le système immunitaire ne fabrique pas un récepteur pour chaque ennemi : il en fabrique des millions au hasard, élimine ceux qui reconnaissent le soi, et multiplie ceux qui reconnaissent l'intrus. C'est une sélection. »
- Note : formes codées comme des chaînes de bits ; recombinaison V(D)J seulement nommée (renvoi à 36) ; un seul type de lymphocyte dessiné.

### Étape 3 · Mémoire et vaccination
- Scène : une frise de 60 jours avec le titre d'anticorps en échelle log (IgM et IgG) ; on place des rencontres sur la frise (infection ou vaccin). À côté, un petit panneau « population » : un village de 400 personnes, couverture vaccinale, R₀ de la maladie, et le nombre final de malades selon l'équation de taille finale.
- Contrôles : bouton « Infection », bouton « Vaccin », délai entre deux rencontres ; dans le panneau population : R₀ (1 à 18), couverture (0 à 100 %).
- Panneau : délai et hauteur du pic à chaque rencontre, cellules mémoire, rapport secondaire/primaire ; seuil d'immunité collective 1 − 1/R₀, fraction finale infectée. Statuts : « La deuxième fois, les clones mémoire sont déjà nombreux : réponse en deux ou trois jours au lieu d'une semaine, et bien plus forte » ; population au-dessus du seuil « Assez de monde est protégé pour que chaque cas en produise moins d'un autre : la maladie ne peut pas se répandre ».
- Phrase-clé : « Après une première rencontre, des cellules mémoire restent. Un vaccin est une première rencontre sans danger ; assez de personnes vaccinées protègent aussi celles qui ne le sont pas. »
- Note : courbes de titres schématiques ; population homogène et bien mélangée (le réseau est au module 41).

### Étape 4 · La coagulation (moment fort)
- Scène : un vaisseau en coupe longitudinale avec le sang qui coule. Bouton « Couper » : une plaie dans la paroi ; des plaquettes adhèrent ; la cascade démarre à la plaie (trois étages dessinés en encart) ; la thrombine monte lentement puis explose (rétroaction positive) et transforme le fibrinogène en un filet de fibrine qui bouche la plaie. Les inhibiteurs (dans le sang et sur la paroi saine) éteignent la cascade au bord de la plaie.
- Contrôles : taille de la plaie, niveau de facteur VIII (100 % à 1 % : hémophilie), bascule « Inhibiteurs ».
- Panneau : thrombine au centre de la plaie et à 1 mm, temps de formation du caillot, étendue du caillot, saignement cumulé. Statuts : petite plaie « Sous le seuil, les inhibiteurs l'emportent : rien ne démarre » ; hémophilie « Un étage affaibli : la rétroaction positive démarre trop tard, la plaie saigne longtemps » ; sans inhibiteurs « Le caillot ne s'arrête plus : il s'étend le long du vaisseau (thrombose) ».
- Phrase-clé : « La coagulation est une cascade amplifiée par une rétroaction positive : elle doit démarrer vite, tout ou rien. Des inhibiteurs la confinent à la plaie ; sans eux, le sang coagulerait partout. »
- Fin de planche, trois questions ouvertes : **Épidémies** « Comment une infection se propage-t-elle dans une population où chacun ne rencontre que quelques personnes ? » → module 41 ; **Évolution** « Comment un virus peut-il échapper à la mémoire immunitaire ? » → module 40 ; **Rythme** « Pourquoi une rétroaction positive ne s'emballe-t-elle pas partout ? » → module 37.

## Micro-interactions de découverte

Bactérie, macrophage, neutrophile, chimiokine, capillaire, lymphocyte, récepteur, antigène, thymus, clone activé, cellule mémoire, anticorps (IgM, IgG), plaie, plaquette, thrombine, fibrine, inhibiteur.

## `window.__labo` (en plus du socle)

`splinter(n)`, `setGrowth(r)`, `chemokine(on)` (1) ; `buildRepertoire(n)`, `setThreshold(t)`, `thymus(on)`, `infect(shape)` (2) ; `encounter(kind, day)`, `setR0(r)`, `setCoverage(c)` (3) ; `cut(size)`, `setFVIII(x)`, `inhibitors(on)` (4).

## Théorie (explication, module 39)

- Relations : croissance d'un clone \(N(t) = N_0\,2^{t/T_d}\) ; probabilité de reconnaissance \(p\) et nombre attendu de clones \(n\,p\) ; seuil d'immunité collective \(1 - 1/R_0\) ; taille finale \(z = 1 - e^{-R_0 z}\) ; rétroaction positive \(\dfrac{\dd T}{\dd t} = k\,T - \gamma\,T\) avec démarrage seulement si \(k \gt \gamma\) (forme minimale, seuil).
- Exemple chiffré possible : temps pour qu'un clone de 10 cellules en devienne 10⁶ avec un doublement toutes les 8 h (≈ 5,6 jours), ou couverture nécessaire contre la rougeole (R₀ ≈ 15).
- Pièges : « les anticorps tuent les microbes » (ils les marquent et les neutralisent) ; « le système immunitaire apprend en modifiant ses récepteurs » ; « un vaccin donne une forme légère de la maladie » ; « la fièvre est causée par les microbes » ; « la coagulation, c'est le sang qui sèche » ; « plus de coagulation, c'est mieux ».
- Où ça resservira : 40 (sélection), 41 (épidémies), 37 (rétroactions), 36 (recombinaison), 38 (vaisseaux).
- Seulement introduit ici : complément, lymphocytes T auxiliaires et cytotoxiques en détail, CMH, recombinaison V(D)J, maturation d'affinité, allergies, fibrinolyse.

## Honnêteté

Tissu 2D, une espèce de bactérie ; répertoire en chaînes de bits ; un seul type de lymphocyte ; titres d'anticorps schématiques ; cascade de coagulation réduite à trois étages ; populations homogènes.

## Hors champ

Immunologie clinique, vaccinologie détaillée, VIH et immunodéficiences, greffes, groupes sanguins, anticoagulants.
