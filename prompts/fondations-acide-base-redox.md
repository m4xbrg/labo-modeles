# Fondations · Acide-base, redox et électrochimie (module 31)

Dossier de sortie : `opus-sonnet/fondations-acide-base-redox/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 31`, titre « Protons et *électrons* qui passent ». Accent : `--accent: #9ef0f0;` (cyan pâle). Budget : ≈ 0,8 ADN, **un chapitre de 4 étapes** : deux pour l'acide-base, deux pour le redox.

Préalables conseillés : 05 (logarithmes), 21 · 22 (tension, courant), 29 (mole, concentration), 30 (équilibre). Elle prépare 32 et 33 (gradients d'ions), 34 (chaîne respiratoire : une suite de redox), la planche 02 (gradient de protons).

## Intention

À la fin, l'étudiant voit l'acide-base comme **un échange de protons** et le redox comme **un échange d'électrons**, deux équilibres qu'on peut mesurer, l'un avec le pH, l'autre avec une tension. Intuitions à rendre évidentes, par ordre de priorité :

1. Le pH est un compteur logarithmique : diluer dix fois un acide fort fait monter le pH d'une seule unité (étape 1).
2. Un tampon encaisse les ajouts d'acide ou de base parce qu'il contient à la fois de quoi capter et de quoi céder des protons (étape 2, moment fort).
3. Mettre du zinc dans une solution de cuivre : le zinc se dissout, le cuivre se dépose. Les électrons passent d'un atome à un ion, directement (étape 3).
4. Si on sépare les deux moitiés et qu'on les relie par un fil, les mêmes électrons passent **par le fil** : c'est une pile, et la tension mesure l'écart entre les deux couples (étape 4, moment fort).
5. Une pile « s'use » parce que sa tension baisse avec les concentrations ; en imposant une tension plus grande, on fait marcher la réaction à l'envers : électrolyse, recharge (étape 4).

Interdits : « l'acide attaque », « le zinc veut donner ses électrons ». On écrit : « l'échange a lieu dans ce sens parce que… ».

## Réutilisation (ne pas reconstruire)

- Équilibre, Q et K, Le Chatelier : `../fondations-reactions-chimiques/` (module 30). Ka y est un K comme un autre.
- Concentration, dilution, mole : `../fondations-molecules-mole/` (module 29).
- Tension, courant, résistance, charge : `../06-courant-circuits/` (module 22). Le circuit extérieur de la pile se dessine comme là-bas.
- Échelle log : `../fondations-langage/`, `../fondations-systemes-hasard/` (logarithmes).
- Gradient de protons dans la mitochondrie : `../02-respiration/` (renvoi en fin d'étape 2).

## Moteur (à écrire et tester avant la page)

Bloc `/* ELC-BEGIN */ … /* ELC-END */`, objet `Elc`. 25 °C sauf mention. Kw = 1,0 × 10⁻¹⁴, F = 96 485 C/mol.

- **Solutions acido-basiques** : `solve(system)` → `{pH, species}` par résolution exacte du bilan de charge (pas d'approximation des « acides faibles ») pour : acide fort, base forte, acide faible (Ka), base faible, mélange acide faible + base conjuguée ; `ACIDS` : HCl (fort), acide acétique (pKa 4,76), NH₄⁺ (9,25), H₂PO₄⁻ (7,21), H₂CO₃ (6,35), avec sources.
- **Titrage** : `titrate(acid, Ca, Va, base, Cb, Vb)` → pH ; `titrationCurve(...)` ; `equivalence(...)`.
- **Vue particulaire** (étape 1) : `sampleIons(pH, volume_scene)` (nombre de H₃O⁺ et OH⁻ à dessiner dans un volume de scène, avec la règle d'échelle affichée).
- **Redox** : `E0` (Zn²⁺/Zn −0,76 V, Fe²⁺/Fe −0,44, Pb²⁺/Pb −0,13, H⁺/H₂ 0,00, Cu²⁺/Cu +0,34, Ag⁺/Ag +0,80) ; `spontaneous(metal, ion)` ; `cellEMF(cathode, anode, conc)` (Nernst, n électrons) ; `cellStep(cell, R, dt)` (décharge : courant I = (E − U_ext)/R_int+R, concentrations mises à jour par la charge écoulée, masses des électrodes) ; `electrolysis(Uapplied, ...)` ; `faradayMass(Q, M, n)`.

### Tests du moteur

1. HCl 0,10 mol/L → pH 1,00 ; 10⁻³ → 3,00 ; 10⁻⁸ mol/L → pH ≈ 6,98 (pas 8 : l'eau compte).
2. Acide acétique 0,10 mol/L → pH 2,88 ; ammoniaque 0,10 mol/L → pH 11,13.
3. Tampon acétique 0,10 / 0,10 → pH 4,76 ; + 0,01 mol de HCl dans 1 L → pH 4,67 ; la même quantité dans 1 L d'eau pure → pH 2,00.
4. Titrage de 25 mL d'acide acétique 0,10 mol/L par NaOH 0,10 mol/L : demi-équivalence pH = 4,76, équivalence à 25,0 mL et pH 8,72 (à 0,03).
5. Électroneutralité vérifiée dans chaque solution à 10⁻¹² mol/L.
6. Zn dans Cu²⁺ : spontané ; Cu dans Zn²⁺ : non ; Cu dans Ag⁺ : spontané.
7. Pile Daniell, concentrations 1 mol/L : 1,10 V ; [Cu²⁺] = 0,01 et [Zn²⁺] = 1 → 1,041 V ; la tension décroît de façon monotone pendant la décharge et tend vers 0.
8. Faraday : 1,00 A pendant 1 h dépose 1,186 g de cuivre ; la masse perdue par le zinc correspond à la même charge (1,220 g).
9. Électrolyse : sous 1,10 V appliqués à la Daniell, courant nul ; au-dessus, courant de sens opposé à celui de la pile.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| H₃O⁺ (proton) | `--positif`, petit disque avec « + » |
| OH⁻ | `--negatif`, petit disque avec « − » |
| électron | `--negatif`, point vif qui file dans le fil |
| ion Cu²⁺ en solution | teinte bleue de la solution (`#4f8fd8` à opacité ∝ concentration : elle est réellement bleue) ; dépôt de cuivre : `#c8763a` |
| zinc | `#9aa3ad` ; ions Zn²⁺ : incolores, contour `--texte-2` |
| règle des pH | dégradé neutre `--texte-2` → `--accent`, sans arc-en-ciel d'indicateur universel (le pH n'a pas de couleur) |
| tension, énergie électrique | `--energie` |

## Chapitre · Module 31 · Acide-base, redox et électrochimie

### Étape 1 · Le pH, un compteur de protons
- Scène : une règle verticale de pH 0 à 14 en échelle logarithmique de [H₃O⁺] (chaque graduation = facteur 10), avec des repères du quotidien (jus de citron ≈ 2, café ≈ 5, eau pure 7, sang 7,4, eau de mer ≈ 8,1, eau de Javel ≈ 12,5). À côté, un bécher et une loupe sur un tout petit volume où l'on voit les H₃O⁺ et les OH⁻ (en nombre proportionnel, échelle affichée).
- Contrôles : substance (HCl, NaOH), concentration (curseur log), bouton « Diluer dix fois ». Bascule « L'eau pure » : même dans l'eau pure, quelques molécules échangent un proton (autoprotolyse), autant de H₃O⁺ que de OH⁻.
- Panneau : [H₃O⁺], [OH⁻], pH, pOH, produit [H₃O⁺][OH⁻] = 10⁻¹⁴. Statuts : après une dilution « Dix fois moins de protons par litre : une seule unité de pH » ; HCl 10⁻⁸ « On ne peut pas rendre l'eau basique en y versant de l'acide : à cette dilution, ce sont les protons de l'eau qui dominent ».
- Phrase-clé : « Un acide cède des protons, une base en capte. Le pH compte les protons libres en puissances de dix : pH = −log[H₃O⁺]. »
- Note : activités assimilées aux concentrations ; nombre de particules dessinées très réduit.

### Étape 2 · Acides faibles et tampons (moment fort)
- Scène : deux béchers côte à côte : « eau pure » et « tampon acétique ». Une burette au-dessus de chacun, qu'on actionne goutte à goutte avec un acide fort ou une base forte. Dans la loupe du tampon, les molécules d'acide acétique et les ions acétate captent ou cèdent les protons ajoutés. En dessous, la courbe de titrage qui se trace en direct, avec la zone tampon autour du pKa en bande `--accent`.
- Contrôles : bouton « 1 goutte d'acide » / « 1 goutte de base » (ou maintenus), acide faible (acétique, ammonium, phosphate), rapport base/acide du tampon. Bascule « Titrage complet » : une base forte ajoutée jusqu'à 2× l'équivalence, curseur V_base.
- Panneau : pH des deux béchers, rapport [A⁻]/[HA], pKa ; points remarquables de la courbe (demi-équivalence pH = pKa, équivalence). Statuts : « Même goutte, deux réactions : l'eau pure plonge de plusieurs unités, le tampon bouge à peine » ; à la demi-équivalence « Ici, autant d'acide que de base conjuguée : pH = pKa ».
- Phrase-clé : « Un acide faible ne cède qu'une partie de ses protons. Avec sa base conjuguée, il forme un tampon : il encaisse l'acide et la base ajoutés, et le pH bouge à peine. »
- Note : le sang est tamponné (bicarbonate, protéines) autour de 7,4 ; renvoi au gradient de protons de `../02-respiration/`.

### Étape 3 · Passer des électrons : le redox
- Scène : une lame de zinc plongée dans une solution bleue d'ions Cu²⁺. Une loupe sur la surface : un atome de zinc cède deux électrons à un ion Cu²⁺ qui le touche ; l'ion Zn²⁺ part en solution, l'atome de cuivre reste collé (dépôt rougeâtre qui grandit) ; la solution pâlit. Une « échelle des couples » à côté (E° de −0,76 V à +0,80 V).
- Contrôles : métal (Zn, Fe, Pb, Cu, Ag) et solution (ions de chaque métal), bouton « Plonger ». Prédiction avant de plonger (bascule « Je prédis ») : l'étudiant dit si quelque chose va se passer.
- Panneau : demi-réactions (oxydation, réduction), électrons échangés, couples et E°, quantité déposée. Statut si rien ne se passe : « Le cuivre ne cède pas ses électrons aux ions zinc : sur l'échelle, le couple du cuivre est au-dessus de celui du zinc ».
- Phrase-clé : « Une oxydation cède des électrons, une réduction en capte ; l'une ne va pas sans l'autre. Sur l'échelle des potentiels, l'ion du couple du haut capte les électrons du métal du couple du bas. »
- Note : potentiels standards ; vitesse du dépôt illustrative.

### Étape 4 · La pile et l'électrolyse (moment fort)
- Scène : pile Daniell : deux béchers (Zn dans Zn²⁺, Cu dans Cu²⁺), un pont salin, un fil avec voltmètre et résistance. Les électrons filent dans le fil du zinc vers le cuivre ; dans le pont salin, des ions se déplacent (anions vers le zinc, cations vers le cuivre) pour garder chaque bécher neutre. Bascule « Générateur » : une source de tension remplace la résistance ; au-delà de 1,10 V, tout s'inverse (électrolyse, recharge).
- Contrôles : résistance de charge, tension appliquée (mode générateur), couples (Zn/Cu, Fe/Cu, Zn/Ag), bouton « Retirer le pont salin » (le courant s'arrête aussitôt).
- Panneau : f.é.m., tension aux bornes, courant, charge écoulée, masse déposée et dissoute, concentrations ; enregistreur U(t) pendant la décharge (pile qui s'use). Statuts : sans pont salin « Les béchers se chargeraient : le courant s'arrête » ; en électrolyse « On paie de l'énergie électrique pour faire marcher la réaction à l'envers ».
- Phrase-clé : « Une pile sépare l'oxydation et la réduction et oblige les électrons à passer par un fil : la tension est l'écart entre les deux couples. Imposer une tension plus grande inverse la réaction. »
- Fin de planche, trois questions ouvertes : **Cellule** « Une membrane qui sépare des ions de concentrations différentes, est-ce une pile ? » → modules 32 et 33 ; **Vivant** « La respiration est-elle une pile ? D'où viennent ses électrons, où vont-ils ? » → module 34 et planche 02 ; **Énergie** « Pourquoi certaines batteries se rechargent et d'autres non ? » → seulement introduit (électrochimie réversible).

## Micro-interactions de découverte

Règle des pH, repère du quotidien, H₃O⁺, OH⁻, burette, tampon, acide faible, base conjuguée, courbe de titrage, lame de zinc, ion Cu²⁺, dépôt, échelle des couples, pont salin, voltmètre, générateur.

## `window.__labo` (en plus du socle)

`setAcid(kind, C)`, `dilute10()`, `pureWater(on)` (1) ; `drop(kind, n)`, `setBuffer(acid, ratio)`, `titrate(Vb)` (2) ; `setMetal(m)`, `setIon(i)`, `dip()`, `predict(b)` (3) ; `setCell(a, c)`, `setLoad(R)`, `generator(on, U)`, `saltBridge(on)` (4).

## Théorie (explication, module 31)

- Relations : \(\text{pH} = -\log[\text{H}_3\text{O}^+]\) et \([\text{H}_3\text{O}^+][\text{OH}^-] = K_w\) ; \(K_a = \dfrac{[\text{H}_3\text{O}^+][\text{A}^-]}{[\text{HA}]}\) ; \(\text{pH} = \text{p}K_a + \log\dfrac{[\text{A}^-]}{[\text{HA}]}\) ; \(\Delta E^\circ = E^\circ_{\text{cathode}} - E^\circ_{\text{anode}}\) ; \(E = E^\circ - \dfrac{0{,}0592}{n}\log Q\) (25 °C) ; \(m = \dfrac{Q\,M}{nF}\).
- Exemple chiffré possible : tampon acétique qui reçoit 0,01 mol de HCl, comparé à l'eau pure ; ou charge et masse de cuivre d'une pile Daniell qui débite 0,5 A pendant 2 h.
- Pièges : « pH 4 = deux fois plus acide que pH 2 » ; « acide faible = acide dilué » ; « un tampon a un pH de 7 » ; « les électrons traversent la solution » (ce sont les ions qui portent le courant dans la solution) ; inverser anode et cathode ; « la pile contient de l'électricité ».
- Où ça resservira : 32 et 33 (gradients d'ions, potentiel d'équilibre : la même logique que Nernst), 34 (chaîne respiratoire et photosynthèse : chaînes de redox), 37 (pH sanguin, homéostasie), planche 02.
- Seulement introduit ici : activité, constante de solubilité, indicateurs colorés, piles à combustible, corrosion, batteries lithium-ion.

## Honnêteté

Activités = concentrations ; 25 °C ; dessins de particules en nombre très réduit ; cinétique de dépôt illustrative ; résistance interne de la pile constante.

## Hors champ

Thermodynamique électrochimique complète (ΔG = −nFE seulement mentionné), acides polyprotiques en détail, chimie du carbone inorganique, corrosion.
