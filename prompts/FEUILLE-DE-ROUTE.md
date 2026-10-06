# Feuille de route : les planches qui restent à faire

Rédigée le 2026-10-06, à partir de `corpus/` (état au 2026-10-04, 18 modèles). Ce fichier dit **ce qu'il reste à construire et dans quel ordre** ; `corpus/` reste la source de vérité sur ce qui existe. Quand une production est fusionnée, on coche sa ligne ici et on met le corpus à jour (voir [`SESSION-FONDATION.md`](SESSION-FONDATION.md), « Corpus »).

## En une phrase

Pour que les 50 modules soient couverts, il faut **23 nouvelles pages de fondations** (≈ 20 ADN), organisées en sept vagues qui suivent les chaînes de préalables, plus une piste parallèle de **mise au standard** des pages existantes. Les douze premières ont un brief complet ; les onze suivantes ont une fiche, à transformer en brief le moment venu.

## Comment c'est organisé

- **Une page par production**, une production couvre un ou deux modules canoniques. On ne regroupe deux modules que s'ils partagent un moteur et une scène (26 · 27, 28 · 29, 41 · 42, 43 · 44). Les gros modules que `fondations.md` désigne comme candidats au découpage (34, 38, 44, 48) restent **une page de 4 étapes** chacun : la richesse en plus ira aux showcases, pas aux fondations.
- **Un chapitre par module, 2 à 4 étapes par chapitre** (`corpus/standards.md` §3). Une page à un module a donc 4 étapes ; une page à deux modules, 7 ou 8.
- **Les vagues suivent les chaînes de préalables** de `fondations.md` : on finit une branche avant d'ouvrir la suivante, pour que chaque page puisse renvoyer à des pages qui existent déjà. L'ordre des vagues 1 à 3 est celui que le corpus prévoit déjà ; celui des vagues 4 à 7 est une proposition.
- **Chaque page se termine par deux ou trois questions** qui pointent vers les modules suivants : c'est ce qui coud la carte.
- **Fabrication** : une session Claude Code par production, avec le bloc de [`SESSION-FONDATION.md`](SESSION-FONDATION.md). Opus écrit et teste le moteur, des sous-agents Sonnet construisent la page et l'explication, Opus intègre et vérifie, la PR met le corpus à jour.

## Vue d'ensemble

| Vague | Page (slug `fondations-…`) | Modules | Étapes | ADN | Brief | Préalables principaux |
|---|---|---|---|---|---|---|
| 1 · D | [ ] `magnetisme-induction` | 23 | 4 | 0,8 | [écrit](fondations-magnetisme-induction.md) | 21, 22 |
| 1 · D | [ ] `onde-electromagnetique` | 24 | 4 | 0,8 | [écrit](fondations-onde-electromagnetique.md) | 15, 21, 23 |
| 1 · D | [ ] `optique` | 25 | 4 | 0,8 | [écrit](fondations-optique.md) | 15, 24 |
| 2 · E | [ ] `atomes-spectres` | 26 · 27 | 4 + 3 | 1,2 | [écrit](fondations-atomes-spectres.md) | 21, 24, 46 |
| 2 · E | [ ] `molecules-mole` | 28 · 29 | 4 + 3 | 1,1 | [écrit](fondations-molecules-mole.md) | 21, 27 |
| 2 · E | [ ] `reactions-chimiques` | 30 | 4 | 0,8 | [écrit](fondations-reactions-chimiques.md) | 17, 28, 29 |
| 2 · E | [ ] `acide-base-redox` | 31 | 4 | 0,8 | [écrit](fondations-acide-base-redox.md) | 22, 29, 30 |
| 3 · F | [ ] `bioelectricite` | 33 | 4 | 0,7 | [écrit](fondations-bioelectricite.md) | 22, 32, 31 |
| 3 · F | [ ] `energie-biologique` | 34 | 4 | 0,8 | [écrit](fondations-energie-biologique.md) | 30, 31, 32 |
| 3 · F | [ ] `information-genetique` | 35 | 4 | 0,8 | [écrit](fondations-information-genetique.md) | 28, 32, 34 |
| 3 · F | [ ] `genome-variation` | 36 | 4 | 0,8 | [écrit](fondations-genome-variation.md) | 35, 07 |
| 3 · F | [ ] `signalisation-homeostasie` | 37 | 4 | 0,8 | [écrit](fondations-signalisation-homeostasie.md) | 04, 30, 34, 35 |
| 4 · G | [ ] `physiologie-circulation` | 38 | 4 | 0,9 | fiche ci-dessous | 20, 33, 34 |
| 4 · G | [ ] `immunite-coagulation` | 39 | 4 | 0,8 | fiche | 36, 37 |
| 5 · I-J | [ ] `rayonnement-etoiles` | 43 · 44 | 3 + 4 | 1,2 | fiche | 13, 17, 26, 27 |
| 5 · I-J | [ ] `relativite-generale` | 47 | 4 | 0,9 | fiche | 13, 46 |
| 5 · I-J | [ ] `cosmologie` | 45 | 4 | 0,9 | fiche | 13, 24, 27, 43 |
| 6 · K | [ ] `quantique` | 48 | 4 | 0,9 | fiche | 06, 07, 15 |
| 6 · K | [ ] `etats-quantiques` | 49 | 4 | 0,9 | fiche | 48, 27 |
| 6 · K | [ ] `spin-intrication` | 50 | 4 | 0,8 | fiche | 48, 25 |
| 7 · H | [ ] `populations-emergence` | 41 · 42 | 4 + 4 | 1,2 | fiche | 04, 05, 07, 40 |
| parallèle · A | [ ] `chaos` | 08 | 4 | 0,8 | fiche | 04, 14 |
| parallèle · A | [ ] `signaux-fourier` | 09 | 4 | 0,7 | fiche | 06, 15, 22 |

Total : 23 pages, 105 étapes, ≈ 20 ADN. À la fin, les 50 modules sont couverts en `full`.

### Pourquoi cet ordre

1. **D · Électromagnétisme et lumière (23 → 24 → 25).** C'est la suite directe de ce qui existe (21, 22) et le seul trou au milieu de la chaîne « Mouvement et électromagnétisme ». 24 et 25 servent ensuite à tout le reste (spectres, couleurs des étoiles, photons).
2. **E · Atomes et chimie (26·27 → 28·29 → 30 → 31).** Les atomes et les spectres ouvrent à la fois la chimie et l'astrophysique ; la chimie est le préalable de toute la biologie moléculaire qui reste.
3. **F · Cellule (33 → 34 → 35 → 36 → 37).** Elle ferme la branche ouverte par 32. Le 33 est déjà couvert par le showcase du neurone : sa page est la moins urgente de la vague et peut glisser à la fin.
4. **G · Physiologie (38, 39).** Elle suppose 33, 34 et 37 : elle vient juste après.
5. **I-J · Astrophysique et relativité générale (43·44 → 47 → 45).** C'est l'ambition d'origine de LABO (supernova, étoiles à neutrons, trous noirs) ; elle ne demande que des pages déjà prévues avant elle (13, 26·27, 46).
6. **K · Quantique (48 → 49 → 50).** Elle s'appuie sur 06, 07, 15, 25 et 27 ; 49 débloque l'idée sélectionnée « Barrière et effet tunnel ».
7. **H · Populations et émergence (41·42).** Très visuelle et sans préalable lourd : elle peut être avancée à tout moment si l'envie s'en fait sentir.
- **Parallèle · A (08, 09).** Indépendants de tout le reste ; à intercaler quand une session est libre. 09 est utile avant 43 (spectres) ; 08 débloque l'idée sélectionnée « Double pendule et chaos ».

## Fiches des pages sans brief

Chaque fiche donne le découpage, le moment fort, ce qu'on réutilise et l'essentiel du moteur. Pour en faire un brief, suivre le modèle des briefs écrits (intention, réutilisation, moteur et tests, code couleur, étapes avec scène / contrôles / panneau / statuts / phrase-clé / note, crochets de test, théorie, honnêteté, hors champ).

### 38 · Muscle, circulation et échanges (`physiologie-circulation`)
1. **Le sarcomère** : filaments d'actine et de myosine qui glissent, ponts qui s'attachent, pivotent et se détachent (un ATP par cycle) ; courbe force-longueur. Excitation : renvoi à 33.
2. **Le cœur, une pompe** (moment fort) : boucle pression-volume du ventricule gauche, ouverture et fermeture des valves, débit = fréquence × volume d'éjection (≈ 5 L/min au repos).
3. **La circulation** : résistances en série et en parallèle, loi de Poiseuille (R ∝ 1/r⁴), la pression chute surtout dans les artérioles ; le sang ralentit dans les capillaires parce que leur section totale est immense (continuité, module 20).
4. **Les échanges gazeux** : alvéole et capillaire, diffusion selon les pressions partielles, courbe de saturation de l'hémoglobine (sigmoïde, effet Bohr).
- Réutilise : 20 (Poiseuille, continuité), 19 et 32 (diffusion), 33, 34, 37. Moteur : ponts transversaux stochastiques, modèle de cœur à élastance variable, réseau de résistances, courbe de Hill de l'hémoglobine. Débloque : battement du cœur, néphron (Atlas).

### 39 · Immunité et coagulation (`immunite-coagulation`)
1. **Défense innée** : reconnaissance de motifs, phagocytes qui remontent un gradient chimique, inflammation.
2. **Sélection clonale** (moment fort) : un répertoire aléatoire de récepteurs ; seul le clone qui reconnaît l'intrus prolifère ; les clones qui reconnaissent le soi sont éliminés.
3. **Mémoire et vaccination** : réponse primaire et secondaire (échelle log), immunité collective (pont vers 41).
4. **Coagulation** : cascade amplifiée avec rétroaction positive, confinée par des inhibiteurs ; plaquettes.
- Réutilise : 37 (cascades, rétroactions), 07 (hasard et combinatoire), 36 (recombinaison). Moteur : répertoire et sélection stochastiques, ODE de réponse primaire et secondaire, cascade à seuil.

### 43 · 44 · Rayonnement thermique et étoiles (`rayonnement-etoiles`)
- Chapitre 43 : 1 **Le corps noir** (spectre de Planck, loi de Wien λ_max T = 2 898 µm·K) ; 2 **Stefan-Boltzmann et couleur des étoiles** (L = 4πR²σT⁴) ; 3 **L'équilibre radiatif d'une planète** (Terre sans effet de serre ≈ −18 °C, modèle à une couche).
- Chapitre 44 : 4 **L'équilibre hydrostatique** (moment fort : la pression soutient le poids des couches) ; 5 **Fusion et transport de l'énergie** (chaîne proton-proton, l'effet tunnel seulement nommé, marche aléatoire des photons sur des dizaines de milliers d'années, convection) ; 6 **Le diagramme HR** (masse → luminosité ∝ M^3,5, durée de vie ∝ M^−2,5) ; 7 **Fins de vie et nucléosynthèse** (naine blanche, géante, supernova : renvoi à la planche 09).
- Réutilise : 13, 17, 19 (rayonnement introduit), 26 · 27 (fusion, raies), 24. Moteur : Planck intégré numériquement (test : Stefan-Boltzmann à 0,1 %), étoile polytropique (Lane-Emden), relations d'échelle. Débloque : séquence principale, géante rouge, naine blanche ; une **supernova v2** qui ne porte plus la théorie de base.

### 47 · Relativité générale (`relativite-generale`)
1. **Le principe d'équivalence** : l'ascenseur en chute libre, la lumière qui se courbe dans l'ascenseur accéléré.
2. **Le temps et la gravité** (moment fort) : horloges à des altitudes différentes ; GPS : +45 µs/jour par la gravitation, −7 µs/jour par la vitesse, +38 µs/jour au total.
3. **Géodésiques et courbure** : des trajectoires « droites » dans un espace courbe ; déviation de la lumière au bord du Soleil (1,75″), lentille gravitationnelle.
4. **Horizons** : rayon de Schwarzschild (≈ 3 km par masse solaire), dernière orbite stable, chute vers l'horizon vue de loin.
- Réutilise : 13, 46 (diagrammes d'espace-temps), 25 (lentilles). Moteur : géodésiques de Schwarzschild (photons et particules), décalages d'horloges. Débloque : trou noir, lentille gravitationnelle, binaire compact.

### 45 · Gravitation cosmique et formation des structures (`cosmologie`)
1. **L'expansion** : une grille qui s'étire ; chaque galaxie voit les autres s'éloigner, loi de Hubble (H₀ ≈ 70 km/s/Mpc).
2. **Décalage vers le rouge et distances** : 1 + z = a₀/a ; regarder loin, c'est regarder tôt.
3. **La matière noire** (moment fort) : courbes de rotation plates contre la prédiction keplérienne.
4. **La toile cosmique** : simulation à N corps dans une boîte en expansion ; de petites fluctuations deviennent des filaments.
- Réutilise : 13, 15 (Doppler), 27 (raies), 43. Moteur : facteur d'échelle a(t) d'un modèle plat, courbes de rotation (disque + halo), N corps 2D en coordonnées comobiles.

### 48 · Fondations quantiques (`quantique`)
1. **Une particule à la fois** (moment fort) : fentes de Young avec des électrons envoyés un par un ; la figure d'interférence se construit point par point.
2. **Des amplitudes, pas des probabilités** : phaseurs complexes, on additionne les amplitudes puis on prend le module au carré ; interféromètre de Mach-Zehnder.
3. **Superposition et mesure** : savoir par où est passée la particule détruit l'interférence.
4. **Fonction d'onde et paquet d'onde** : paquet gaussien libre qui s'étale, λ = h/p, Δx Δp ≥ ħ/2.
- Réutilise : 06 (phase), 07 (probabilités), 15 et la planche 05 (interférences), 25. Moteur : amplitudes complexes, tirages selon |ψ|², propagation libre exacte d'un paquet gaussien.

### 49 · Potentiels et états quantiques (`etats-quantiques`)
1. **La boîte** : puits infini, niveaux ∝ n², états stationnaires qui sont des ondes stationnaires (renvoi à la corde de 15).
2. **Puits fini et états liés** : la fonction d'onde déborde dans la paroi ; le nombre d'états dépend de la profondeur (pont vers les atomes, 27).
3. **L'effet tunnel** (moment fort) : un paquet sur une barrière, transmission T ≈ e^(−2κa), sensibilité exponentielle à l'épaisseur.
4. **Le tunnel au travail** : désintégration α, microscope à effet tunnel, fusion dans le Soleil (renvoi à 44).
- Moteur : Schrödinger 1D par Crank-Nicolson (test : norme conservée à 10⁻¹⁰), états propres par diagonalisation (test : puits infini exact). L'idée sélectionnée « Barrière et effet tunnel » devient `absorbed` ; un showcase pourra porter sur le microscope à effet tunnel ou la désintégration α (Gamow).

### 50 · Spin, mesure et intrication (`spin-intrication`)
1. **Stern-Gerlach** (moment fort) : deux taches, pas une traînée.
2. **Mesures successives** : z puis x puis z, la première information est effacée ; probabilités cos²(θ/2).
3. **Le qubit** : sphère de Bloch, superposition, mesure dans différentes bases.
4. **Intrication et Bell** : paires singulets, corrélation −cos θ, test CHSH (2 au plus pour toute théorie locale, 2√2 en quantique).
- Réutilise : 25 (polarisation, Malus), 48. Moteur : algèbre de spin ½ (matrices 2 × 2 complexes), tirages de mesures, statistique CHSH.

### 41 · 42 · Populations, réseaux et émergence (`populations-emergence`)
- Chapitre 41 : 1 **Compétition** (deux espèces, coexistence ou exclusion) ; 2 **Prédateurs et proies** (cycles, espace des phases) ; 3 **Épidémie SIR** (moment fort : R₀, pic, seuil d'immunité collective 1 − 1/R₀) ; 4 **Réseaux et cascades** (petit monde, nœuds très connectés, vaccination ciblée).
- Chapitre 42 : 5 **Le jeu de la vie** (règles locales, planeurs) ; 6 **Essaims** (trois règles locales, un banc de poissons) ; 7 **Le tas de sable** (avalanches en loi de puissance, criticité auto-organisée) ; 8 **Bouchons fantômes** (trafic de Nagel-Schreckenberg).
- Réutilise : 04, 05, 07, 40 (sa grille spatiale annonce 41 et 42), 39 (immunité collective). Moteur : ODE Lotka-Volterra et SIR, SIR stochastique sur réseau, automates. Débloque et absorbe : une dizaine d'idées du groupe 8 de l'Atlas.

### 08 · Non-linéarité, stabilité et chaos (`chaos`)
1. **Points fixes et stabilité** : espace des phases du pendule amorti, bassins d'attraction.
2. **Bifurcations** : application logistique, doublement de période, diagramme de bifurcation.
3. **Sensibilité aux conditions initiales** (moment fort) : deux doubles pendules lancés à 10⁻⁹ rad d'écart, divergence exponentielle, exposant de Lyapunov.
4. **Attracteurs étranges** : Lorenz, section de Poincaré.
- Réutilise : 04, 05, 14. Moteur : intégrateur symplectique du double pendule (test : énergie conservée à 10⁻⁶ sur 100 s), constante de Feigenbaum ≈ 4,669, exposant de la logistique à r = 4 égal à ln 2. Complète le module 08 aujourd'hui `partial` ; l'idée sélectionnée « Double pendule et chaos » peut alors devenir un showcase qui ne réexplique plus le chaos.

### 09 · Signaux et Fourier (`signaux-fourier`)
1. **Construire un signal** : somme de sinusoïdes, signal carré et dent de scie, phénomène de Gibbs.
2. **Le spectre** (moment fort) : décomposition d'un son (voyelles, instruments, harmoniques), son produit par Web Audio, coupé par défaut.
3. **Échantillonner** : théorème de Nyquist, repliement, roue de chariot qui tourne à l'envers.
4. **Filtrer** : passe-bas et passe-haut sur le spectre, lien avec le circuit RC (22).
- Réutilise : 06, 14, 15, 22. Moteur : FFT (tests : Parseval, raie unique d'une sinusoïde pure, fréquence repliée). Complète le module 09 aujourd'hui `supporting`.

## Piste parallèle : mettre les pages existantes au standard

Neuf des pages construites avant `corpus/standards.md` n'en respectent pas encore la navigation (un chapitre par module, 2 à 4 étapes) ; *Rotation, gravitation et orbites*, *Matière, chaleur et transport* et *Courant et circuits* sont déjà conformes. Le détail est dans le tableau du §3 de `standards.md` ; en résumé, avec la page de préalables en plus :

| Page | À faire |
|---|---|
| Langage scientifique (01·02·03) | Aplatir les onglets imbriqués en trois chapitres ; ajouter un toy d'**analyse dimensionnelle** au chapitre 01 (aujourd'hui seulement dans l'explication). |
| Systèmes, croissance et hasard (04·05·07) | Regrouper A + B sous 04 ; **compléter 07** (probabilités conditionnelles, loi binomiale, théorème central limite) pour le faire passer en `full`. |
| Oscillations et ondes (06·14·15) | Ramener le chapitre 15 de 5 à 4 étapes. |
| Forces, énergie et conservation (10·11) | Nommer les chapitres par module. |
| Flux, gradients, champs et fluides (16·20) | Aplatir les onglets imbriqués en deux chapitres. |
| Le champ électrique (21) | Structurer le bac à sable en 2 à 4 étapes. |
| Cellule, membrane et transport (32) | 7 → 4 étapes. |
| Évolution et génétique des populations (40) | 11 → 4 étapes ; ce qui annonce 41 peut migrer vers la future page 41·42. |
| Relativité restreinte (46) | 8 → 4 étapes ; ce qui annonce 47 peut migrer vers la future page 47. |
| Préalables (`opus-sonnet/prealables.html`) | Ajouter la supernova et les pages de fondations. |

Règle : on ne jette pas de contenu, on regroupe des scènes voisines en une étape. Une session par page, avec ce bloc :

```text
Tu mets une page de LABO au standard, sans réécrire sa science. Lis corpus/standards.md, prompts/SESSION-FONDATION.md (partie 2) et la page opus-sonnet/<dossier>/. Objectif : <ligne du tableau de prompts/FEUILLE-DE-ROUTE.md, piste parallèle>. Regroupe des scènes voisines plutôt que d'en supprimer ; garde window.__labo et ajoute-y goStep ; vérifie (console vide, 1440, 1366 × 768 et 375 px, chaque étape visitée) ; mets à jour corpus/models.json (parts, parts_kind: "step") et le tableau de standards.md ; PR vers main.
```

## Showcases que chaque vague rend possibles

Les fondations ne sont pas une fin : elles rendent les showcases moins lourds. Aucun n'est requis pour couvrir la carte ; ce sont les candidats naturels, à choisir dans l'Atlas quand une vague est finie.

| Après | Candidats (Atlas) |
|---|---|
| Vague 1 · D | Moteur électrique et génératrice ; aurores (particules piégées dans le champ terrestre) ; arc-en-ciel |
| Vague 2 · E | Pile galvanique ; catalyse en surface ; titrage |
| Vague 3 · F | Photosynthèse (le chloroplaste en entier) ; transcription d'un vrai gène |
| Vague 4 · G | Battement du cœur ; contraction musculaire ; néphron |
| Vague 5 · I-J | **Supernova v2** (effondrement → rebond → choc → neutrinos, sans réexpliquer les étoiles) ; collision de deux étoiles à neutrons ; trou noir |
| Vague 6 · K | Microscope à effet tunnel ou désintégration α (si 49 absorbe l'idée « Barrière et effet tunnel ») |
| Parallèle · A | **Double pendule et chaos** (idée sélectionnée) |
| Vague 7 · H | Épidémie sur un réseau réel ; Game of Life comme objet d'exploration |

## État

| | |
|---|---|
| Briefs écrits | 12 (vagues 1 à 3) |
| Fiches | 11 (vagues 4 à 7, piste A) |
| Construites depuis cette feuille de route | 0 |
