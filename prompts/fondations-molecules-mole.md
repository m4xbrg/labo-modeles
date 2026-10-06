# Fondations · Liaisons, molécules, mole et stœchiométrie (modules 28 et 29)

Dossier de sortie : `opus-sonnet/fondations-molecules-mole/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 28 · 29`, titre « Molécules et *mole* ». Accent : `--accent: #9ad0f5;` (bleu ciel pâle). Budget : ≈ 1,1 ADN, **deux chapitres : 28 (4 étapes) et 29 (3 étapes)**.

Préalables conseillés : 21 (charges, énergie potentielle), 26 · 27 (atomes, niveaux). Elle prépare 30 (réactions), 31 (acides, redox), 32 à 35 (molécules du vivant), et donne enfin un sens chiffré aux « particules » de la planche 07.

## Intention

À la fin, l'étudiant sait **pourquoi des atomes se lient, quelle forme prend une molécule, pourquoi certaines molécules se collent entre elles, et comment on compte des molécules qu'on ne voit pas en les pesant**. Intuitions à rendre évidentes, par ordre de priorité :

1. Une liaison est un **creux d'énergie** : deux atomes trop loin s'attirent, trop près se repoussent, et la distance de liaison est le fond du creux (étape 1, moment fort).
2. Entre partage égal et transfert complet d'électrons, il y a un continuum ; l'électronégativité dit où l'on se trouve (étape 2).
3. La forme d'une molécule vient de la répulsion entre paires d'électrons ; la forme décide si la molécule est polaire, même quand ses liaisons le sont toutes (CO₂ contre H₂O) (étape 3, moment fort).
4. Les forces entre molécules, bien plus faibles que les liaisons, décident de l'état (gaz, liquide) à une température donnée : l'eau bout à 100 °C, le méthane à −162 °C (étape 4).
5. Une mole est un **changement d'échelle** : un nombre fixé de particules (6,022 × 10²³) choisi pour que la masse molaire en grammes égale la masse d'une particule en unités atomiques (étape 5, moment fort).
6. Dans une réaction, les particules se combinent en proportions fixes ; le réactif épuisé en premier arrête tout, et la masse totale ne change pas (étape 7).

Interdits : « les atomes veulent compléter leur couche », « l'oxygène vole les électrons ». On écrit : « l'énergie du système est plus basse quand… ».

## Réutilisation (ne pas reconstruire)

- Niveaux d'énergie, couches, électron en nuage : `../fondations-atomes-spectres/` (module 27). Reprendre le dessin des nuages.
- Énergie potentielle, puits et forces dérivées de l'énergie : `../fondations-forces-energie/`. Coulomb : `../04-champ-electrique/`.
- Molécules en mouvement, température, changement de phase : `../07-matiere-chaleur/` (actes I à III). L'étape 4 change le type d'interaction, pas le moteur de collisions : reprendre son rendu et sa logique de thermostat.
- Échelles log, notation scientifique : `../fondations-langage/` (toy Échelles).

## Moteur (à écrire et tester avant la page)

Bloc `/* MOL-BEGIN */ … /* MOL-END */`, objet `Mol`.

- **Potentiel de liaison** : `morse(r, {De, re, a})` et sa force ; `BONDS` : H–H (De 4,75 eV, re 74,1 pm), Cl–Cl (re 199 pm, énergie de liaison 242 kJ/mol), H–Cl (re 127 pm, 431 kJ/mol), avec énergie de liaison usuelle à 298 K (kJ/mol) citée ; `vibrate(state, bond, dt)` (petite oscillation autour de re).
- **Électronégativité** : `CHI` (échelle de Pauling : H 2,20, C 2,55, N 3,04, O 3,44, F 3,98, Na 0,93, Cl 3,16, K 0,82) ; `bondCharacter(A, B)` → `{dchi, type: 'covalente non polaire' | 'covalente polaire' | 'ionique', delta}` (seuils pédagogiques documentés, avec la mention qu'ils sont conventionnels).
- **VSEPR** : `relaxDomains(nBond, nLone, iters)` (points sur une sphère qui se repoussent ; les doublets libres repoussent plus fort, coefficient documenté) → directions ; `angles(dirs)` ; `dipole(molecule)` (somme vectorielle des moments de liaison, valeurs de référence pour comparaison) ; `MOLECULES` : CO₂, BF₃, CH₄, NH₃, H₂O, HCl, avec angles et moments dipolaires mesurés cités.
- **Forces intermoléculaires** (étape 4, qualitatif) : `liquidStep(sys, T, dt, rng)` : particules 2D à potentiel de Lennard-Jones dont la profondeur dépend de la substance, plus des **sites collants directionnels** (modèle à « patchs ») pour la liaison hydrogène ; `SUBSTANCES` : « type méthane » (LJ faible, 0 site), « type HCl » (LJ moyen + dipôle traité comme 1 site faible), « type eau » (2 donneurs + 2 accepteurs) ; `clusterFraction(sys)` ; `BOILING` : températures d'ébullition réelles (CH₄ −161,5 °C, H₂S −60 °C, NH₃ −33 °C, HF 19,5 °C, H₂O 100 °C).
- **Mole et masse** : `ATOMIC_MASS` (H 1,008, C 12,011, N 14,007, O 15,999, Na 22,990, Cl 35,45, Ca 40,078, Fe 55,845) ; `molarMass(formula)` (analyse d'une formule simple, parenthèses comprises) ; `NA = 6.02214076e23`.
- **Solutions** : `conc(n, V)`, `dilute(C1, V1, V2)`.
- **Stœchiométrie** : `REACTIONS` (combustion du méthane, synthèse de l'eau, combustion du propane, formation de NaCl), `react(reaction, moles)` → `{extent, limiting, leftover, products, massBefore, massAfter}`.

### Tests du moteur

1. `morse` : minimum en re = 74,1 pm, profondeur De, force nulle en re et positive (répulsive) en dessous.
2. `bondCharacter` : H–H non polaire, O–H polaire (Δχ = 1,24), Na–Cl ionique (Δχ = 2,23).
3. VSEPR relaxé : CH₄ 109,47° à 0,3° ; BF₃ 120° ; CO₂ 180° ; NH₃ entre 106° et 108° ; H₂O entre 103,5° et 105,5°.
4. Moments dipolaires : CO₂ et CH₄ nuls à 10⁻⁹ ; H₂O non nul, dirigé selon la bissectrice ; ordre H₂O > NH₃ > HCl respecté avec les valeurs de référence.
5. Étape 4 : à température réduite égale, `clusterFraction` de « type eau » > « type HCl » > « type méthane » (moyenne sur 5 graines).
6. Masses molaires : H₂O 18,015, CO₂ 44,009, NaCl 58,44, C₆H₁₂O₆ 180,156, Ca(OH)₂ 74,092 g/mol (à 0,01).
7. 18,015 g d'eau → 1,000 mol → 6,022 × 10²³ molécules ; 1 L d'eau → 55,5 mol.
8. Dilution : 0,50 mol/L × 100 mL dilués à 250 mL → 0,20 mol/L.
9. Réactions : CH₄ 2 mol + O₂ 3 mol → O₂ limitant, 1,5 mol de CO₂, 0,5 mol de CH₄ restant ; masse avant = masse après à 10⁻⁹ près relatif pour les quatre réactions.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| atomes | code CPK sobre et désaturé : H `--texte`, C `#6f7682`, N `#7b8cff`, O `#ff7b6b`, Cl `#8fe08a`, Na `#c89bff` ; taille ∝ rayon covalent |
| nuage d'électrons de liaison | `--negatif` à faible opacité, densité qui se déplace vers l'atome le plus électronégatif |
| charges partielles δ⁺ / δ⁻ | `--positif` / `--negatif`, petits signes |
| moment dipolaire | flèche `--accent` (convention : de δ⁺ vers δ⁻, à dire dans la légende) |
| doublets libres | « ballons » `--texte-2` translucides |
| liaison hydrogène | pointillé `--accent` |
| énergie de liaison, puits | courbe `--texte`, fond du puits `--energie` |
| masse (balance) | `--texte` ; quantités de matière : barres `--accent` |

## Chapitre 1 · Module 28 · Liaisons et structure moléculaire

### Étape 1 · Un creux d'énergie (moment fort)
- Scène : deux atomes d'hydrogène qu'on rapproche ou éloigne à la souris ; leurs nuages se recouvrent et une densité commune apparaît entre eux. En dessous, la courbe d'énergie potentielle E(r) avec un point qui suit la distance courante, et la force dessinée (flèches sur les atomes : attraction au-delà de re, répulsion en dessous). Lâcher les atomes : ils oscillent autour de re (vibration, renvoi à 14).
- Contrôles : paire d'atomes (H–H, Cl–Cl, H–Cl), distance (glisser), bouton « Lâcher », bouton « Casser la liaison » (apporter l'énergie de liaison : les atomes se séparent).
- Panneau : r, re, E(r), énergie de liaison (eV par liaison et kJ/mol). Statuts : trop près « Les noyaux se repoussent : l'énergie remonte en flèche » ; au fond « Ici, l'énergie est minimale : c'est la longueur de liaison, 74 pm pour H₂ ».
- Phrase-clé : « Deux atomes forment une liaison quand l'énergie du système est plus basse ensemble que séparés. La longueur de liaison est le fond de ce creux ; sa profondeur, l'énergie qu'il faut pour casser la liaison. »
- Note : courbe de Morse ajustée ; nuages schématiques.

### Étape 2 · Partager ou céder : l'électronégativité
- Scène : deux atomes liés dans un grand cadre, le nuage de liaison entre eux. On choisit les deux atomes ; le nuage glisse vers l'atome le plus électronégatif ; δ⁺ et δ⁻ apparaissent ; à l'extrême (Na–Cl), le nuage passe entièrement d'un côté : deux ions. Une règle horizontale « Δχ » de 0 à 3,3 avec trois zones (non polaire, polaire, ionique) et un curseur qui se place tout seul.
- Contrôles : atome A, atome B (H, C, N, O, F, Na, K, Cl).
- Panneau : χ(A), χ(B), Δχ, type, charges partielles indicatives. Statut : « Les frontières entre les trois zones sont des conventions : la nature, elle, est continue ».
- Phrase-clé : « Entre deux atomes, les électrons de liaison sont plus ou moins partagés. Plus l'écart d'électronégativité est grand, plus la liaison est polaire, jusqu'au transfert complet : la liaison ionique. »
- Note : électronégativités de Pauling ; charges partielles illustratives.

### Étape 3 · La forme des molécules (moment fort)
- Scène : une molécule en 3D (projection, rotation à la souris), atomes et « ballons » de doublets libres ; les domaines se repoussent et la forme se met en place devant l'étudiant (relaxation animée depuis une position aléatoire). Flèches des moments de liaison et flèche du moment total.
- Contrôles : nombre de liaisons (2 à 4) et de doublets libres (0 à 2), ou préréglages CO₂, BF₃, CH₄, NH₃, H₂O ; bouton « Secouer » (relance la relaxation).
- Panneau : angles mesurés, nom de la géométrie (linéaire, plane trigonale, tétraédrique, pyramidale, coudée), moment dipolaire total. Statuts : CO₂ « Deux liaisons polaires, une molécule non polaire : les deux flèches s'annulent » ; H₂O « Les doublets libres poussent plus fort : 104,5° au lieu de 109,5° ».
- Phrase-clé : « Les paires d'électrons autour d'un atome se repoussent et s'écartent le plus possible. La forme qui en résulte décide si la molécule est polaire. »
- Note : VSEPR, une règle qui marche bien pour les petites molécules, pas une théorie complète (orbitales au module 48).

### Étape 4 · Entre les molécules
- Scène : trois boîtes côte à côte (« type méthane », « type HCl », « type eau »), chacune avec une quarantaine de molécules 2D ; un thermostat commun. À basse température, l'eau forme un réseau de liaisons hydrogène (pointillés) ; on chauffe : le méthane s'évapore d'abord, l'eau en dernier. Une échelle de températures d'ébullition réelles au-dessus (CH₄, H₂S, NH₃, HF, H₂O).
- Contrôles : température (échelle réduite, avec la correspondance indicative), bouton « Refroidir lentement ».
- Panneau : fraction de molécules en amas dans chaque boîte, nombre de liaisons hydrogène dans la boîte d'eau. Statut : « Les forces entre molécules sont 10 à 100 fois plus faibles qu'une liaison : on les rompt en chauffant un peu, sans casser les molécules ».
- Phrase-clé : « Les molécules polaires se collent entre elles ; l'eau, avec ses liaisons hydrogène, se colle beaucoup. C'est ce qui décide si une substance est gazeuse ou liquide à température ambiante. »
- Note : modèle 2D à sites collants, qualitatif ; températures du modèle non comparables directement aux températures réelles.

## Chapitre 2 · Module 29 · Compter la matière

### Étape 5 · La mole : changer d'échelle (moment fort)
- Scène : une cuillère d'eau (18 mL) ; zoom continu par puissances de 10 jusqu'à voir les molécules ; un compteur de molécules qui défile en notation scientifique. À côté, une balance : on pose « 1 mole » de différentes substances (eau, sel, sucre, fer, hélium) : même nombre de particules, masses différentes.
- Contrôles : substance, masse (curseur) → nombre de moles et de particules ; bouton « Composer une molécule » (atomes à glisser dans un plateau, la masse molaire s'additionne).
- Panneau : m, M, n = m/M, N = n·N_A. Analogie affichée : « On ne compte pas les grains de riz, on les pèse : si un grain pèse 25 mg, 1 kg en contient 40 000 ». Statut : « Une mole de n'importe quoi contient 6,022 × 10²³ particules. Sa masse en grammes est la masse d'une particule en unités atomiques ».
- Phrase-clé : « La mole est un nombre : 6,022 × 10²³. Elle relie la masse qu'on pèse au nombre de particules qu'on ne peut pas compter. »
- Note : valeurs exactes de N_A (définition SI depuis 2019) et masses atomiques standard.

### Étape 6 · Concentration et dilution
- Scène : un bécher gradué ; on dissout une masse de sel ; une loupe montre un petit volume avec des ions dispersés, leur densité ∝ concentration. Bouton « Diluer » : on verse de l'eau, la loupe montre moins d'ions par volume, mais le nombre total d'ions dans le bécher ne change pas (compteur).
- Contrôles : masse de soluté (sel ou sucre), volume de solution, volume final après dilution.
- Panneau : n, V, C = n/V (mol/L) et concentration massique (g/L). Préréglages : « sérum physiologique 9 g/L (0,154 mol/L) », « eau de mer ≈ 35 g/L de sels », « sang : glucose ≈ 5 mmol/L ».
- Phrase-clé : « La concentration dit combien de particules il y a par litre. Diluer ajoute du solvant : la concentration baisse, la quantité de soluté reste la même. C₁V₁ = C₂V₂. »
- Note : volume du soluté négligé ; ions du sel comptés comme un soluté (la dissociation est seulement mentionnée).

### Étape 7 · Stœchiométrie : le réactif limitant
- Scène : deux réservoirs de molécules (dessinées) qui se combinent sur un « établi » selon l'équation équilibrée ; chaque combinaison consomme exactement les bonnes proportions et produit les produits ; le réactif épuisé en premier arrête tout, le reste demeure. Une balance au-dessus montre la masse totale avant et après : identique.
- Contrôles : réaction (méthane, eau, propane, NaCl), quantités de chaque réactif (en moles ou en grammes, bascule), bouton « Réagir ».
- Panneau : quantités initiales, avancement, réactif limitant, quantités finales, masses. Statut : « Rien ne se perd : les atomes sont réarrangés, pas créés ».
- Phrase-clé : « Une équation équilibrée dit dans quelles proportions les particules réagissent. Le réactif qui manque le premier limite tout ; la masse totale se conserve. »
- Fin de planche, trois questions ouvertes : **Vitesse** « Pourquoi certaines réactions sont-elles explosives et d'autres prennent-elles des années ? » → module 30 ; **Équilibre** « Une réaction va-t-elle toujours jusqu'au bout ? » → module 30 ; **Eau** « Pourquoi l'eau dissout-elle si bien le sel, et que deviennent les ions ? » → module 31.

## Micro-interactions de découverte

Atome, nuage, noyau, courbe d'énergie, longueur de liaison, δ⁺/δ⁻, règle Δχ, doublet libre, moment dipolaire, liaison hydrogène, thermostat, cuillère, balance, bécher, ion, établi, réactif limitant.

## `window.__labo` (en plus du socle)

`setPair(a, b)`, `setDist(pm)`, `release()`, `breakBond()` (1) ; `setAtoms(a, b)` (2) ; `setDomains(nb, nl)`, `preset(m)`, `shake()` (3) ; `setT(T)`, `cool()` (4) ; `setSubstance(s)`, `setMass(g)`, `compose(formula)` (5) ; `dissolve(g, V)`, `dilute(V2)` (6) ; `setReaction(r)`, `setReactants(obj)`, `react()` (7).

## Théorie (explication)

**Module 28.** Relations : \(\Delta\chi = |\chi_A - \chi_B|\) ; \(\vec\mu = q\,\vec d\) et \(\vec\mu_{\text{tot}} = \sum \vec\mu_i\) ; \(F = -\dd E/\dd r\) ; énergie d'une réaction ≈ liaisons rompues − liaisons formées (seulement introduit, renvoi à 30). Exemple chiffré possible : énergie pour casser les liaisons d'une mole de H₂ comparée à l'énergie d'un photon UV (lien avec 27), ou moment dipolaire de l'eau à partir de deux liaisons O–H. Pièges : « une liaison stocke de l'énergie qu'on libère en la cassant » (casser coûte toujours) ; « molécule à liaisons polaires = molécule polaire » ; « la liaison hydrogène est une liaison covalente avec un H » ; « bouillir casse les molécules d'eau » ; dessiner les molécules à plat.

**Module 29.** Relations : \(n = m/M\) ; \(N = n N_A\) ; \(C = n/V\) ; \(C_1V_1 = C_2V_2\) ; avancement \(\xi\) avec \(n_i = n_{i,0} + \nu_i\xi\). Exemple chiffré possible : combustion d'un litre d'essence assimilée à l'octane (masse de CO₂ produite), ou préparation d'un sérum physiologique. Pièges : confondre masse et quantité de matière ; « une mole d'O₂ pèse 16 g » ; oublier d'équilibrer ; prendre le réactif en plus petite masse pour le limitant ; mL et L mélangés.

Où ça resservira : 30 (énergie et vitesse de réaction), 31 (pH, ions en solution), 32 (membranes, molécules polaires et apolaires), 34 (ATP, liaisons « riches en énergie » : à corriger), 35 (liaisons hydrogène de l'ADN), 17 (gaz : n et N dans PV = nRT).

Seulement introduit ici : orbitales moléculaires, hybridation, liaison métallique, résonance, forces de London en détail, solubilité.

## Honnêteté

Molécules dessinées avec des rayons et des couleurs conventionnels ; VSEPR comme règle ; étape 4 qualitative en 2D ; seuils de Δχ conventionnels ; dans le monde réel une mole d'objets macroscopiques n'existe pas (le dire avec un ordre de grandeur amusant).

## Hors champ

Chimie organique, isomérie, nomenclature, spectroscopie IR, cristallographie, gaz réels.
