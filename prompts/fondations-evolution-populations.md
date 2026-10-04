# Fondations · Évolution et génétique des populations (module 40)

Dossier de sortie : `opus-sonnet/fondations-evolution-populations/` (`index.html` + `explication.html`). Charte : `00-direction-artistique.md`, intégralement, avec les ajustements ci-dessous.

Ce batch ouvre la branche **H · Évolution, populations et systèmes complexes**. Il couvre le module 40 seulement. Les modules 41 (populations et propagation sur réseaux) et 42 (émergence) sont **annoncés** à la fin, pas construits.

Accent : `--accent: #a8dcb4;` (sauge pâle). Il sert à l'interface, aux **histogrammes et fréquences observées**.

Budget : ≈ 1 ADN, une planche du gabarit des autres fondations (un `index.html` autonome de l'ordre de 110 à 150 Ko, un `explication.html`). Au plus deux curseurs par étape, plus des boutons et un sélecteur.

## L'intuition à éliminer

> Les individus ne se transforment pas parce qu'ils « ont besoin » de s'adapter.

L'évolution est un **changement statistique de la composition d'une population au fil des générations**. Elle se produit quand :

1. la population contient de la **variation** ;
2. une partie de cette variation est **héritable** ;
3. les variants n'ont pas tous le même **succès reproductif** ;
4. les **fréquences** changent d'une génération à l'autre.

Et elle se produit aussi **sans** avantage, par le seul hasard de l'échantillonnage (dérive, fondateur, goulot). La page doit faire sentir ces deux sources de changement, et leur différence.

## Moteur stochastique : verrouillé et déjà testé

Le moteur est écrit et vérifié par Opus (29 tests : dérive contre la théorie, probabilité de fixation de Kimura, Hardy-Weinberg, fondateur, goulot, équilibre mutation-dérive, migration, grille). Copie **à l'identique** le fichier

`C:\Users\m4xbr\AppData\Local\Temp\claude\C--Users-m4xbr-dev-labo-modeles--claude-worktrees-evolution-populations-fondations-b48ee0\91313a2b-d6f9-4e9f-8d88-e0584d5bb099\scratchpad\popgen.js`

dans le `<script>`, du marqueur `/* POPGEN-BEGIN */` au marqueur `/* POPGEN-END */` inclus (sans la dernière ligne `module.exports`). Ne modifie pas ces fonctions ; si tu as besoin d'un calcul de plus, écris-le hors du bloc. Le test doit continuer de passer sur ta page : `node test.js <chemin>/index.html` (même dossier que `popgen.js`).

Ce qu'il fournit (objet global `PG`) :

- **Hasard** : `makeRng(seed)` (mulberry32), `normal`, `binomial`, `randInt`, `shuffle`. **Tout** le hasard de la page passe par un générateur `makeRng` ; jamais `Math.random` dans la simulation (seulement pour choisir une nouvelle graine).
- **Trait continu** (A1, A2, B1) : `TRAIT` (N = 240, σ = 0,15), `traitInit({N, h2, mean}, rng)`, `survival(z, env, s, harsh)`, `traitSurvive(pop, env, s, rng, harsh)` → masque des survivants, `traitReproduce(pop, alive, rng, {sigmaMut})` → génération suivante (`parent[j]` = indice du parent, enfants triés par parent ; `null` si extinction), `traitGeneration`, `traitStats(pop, alive)` → `{meanZ, sdZ, meanG, varG, varZ, h2now, survivors, S}`, `traitPredictNext(pop, env, s, bins, harsh)` → histogramme **attendu** de la génération suivante, `histogram(a, bins, lo, hi, mask)`. Environnements `env` : `'none'`, `'dark'`, `'light'`, `'mid'`, `'patchy'`.
- **Deux allèles, diploïdes** (C1, C2, D2) : état `{N, nA, gen}` (nA = copies de A parmi 2N), `pOf`, `hardyWeinberg(p)`, `wfExpected(p, {s, h, u, v, m, pSrc})` (fréquence attendue avant tirage), `wfStep(st, {s, N}, rng)` (une génération), `wfIndividuals(nA, N, rng)` (génotypes 2/1/0 par appariement au hasard des copies), `genotypeCounts`, `fixationProb(p, N, s)` (Kimura), `wfReplicates`, `expectedH(H0, tailles)`. Fitness relatives : AA 1 + s, Aa 1 + s/2, aa 1.
- **Copies, plusieurs allèles** (D1, E1, E2, F1) : une population = `Uint16Array` d'allèles de longueur 2N ; `maInit(nCopies, K, rng, freqs)`, `maStep(arr, nNext, rng, {mu, nextId, sortByParent})` → `{arr, parent, mutated, nextId, newMutations}`, `maSample(arr, nCopies, rng)` (fondateurs), `maStats(arr)` → `{nAlleles, H, freqs, counts}`, `bottleneckSizes({N0, Nb, tCrash, dur, r}, gens)`, `equilibriumH(N, mu)`, `islandsStep(A, B, {m, mu, nextId}, rng)`, `divergence(A, B)`.
- **Grille** (G1) : `gridInit(W, H, K, rng)`, `gridStep(g, W, H, 'local'|'mixed', rng, events)`, `gridSameNeighbor`.

Notations : H = hétérozygotie attendue = 1 − Σ pᵢ² (« diversité » dans l'interface, avec le symbole H). Générations discrètes, non chevauchantes : la génération t+1 remplace entièrement la génération t.

## Identité : la ligne « Fondations »

Même charte, même structure de page que `opus-sonnet/fondations-systemes-hasard/index.html` : **reprendre sa coquille** (CSS, grille `.app .scene .panel .controls`, stepper groupé par chapitres, `.meas .row`, `.tip`, `.cle`, `.eq`, panneau secondaire `#secBox`, clavier, liens). Lire ce fichier avant d'écrire une ligne.

- surtitre : `Fondations — module 40` ;
- titre : « Évolution et génétique des *populations* » ;
- un **même vocabulaire visuel** partout :
  - un **individu** est un petit corps organique (ellipse légèrement ondulante, jamais un cercle rigide) ;
  - une **copie du gène** est une perle (petit disque) ;
  - une **fréquence** est une barre empilée horizontale (part de chaque allèle) ou une courbe p(t) avec les générations en abscisse ;
  - une **distribution** est un histogramme `--accent` ;
  - une **attente théorique** est un tireté fin `--texte-2`.

## Code couleur

| Grandeur | Couleur |
|---|---|
| coloration d'un individu (trait z ∈ [0, 1]) | rampe de luminance de `#2b2723` (z = 0, sombre) à `#ece3d3` (z = 1, clair) |
| allèle **A** | `--A: #c49bff` (lilas) |
| allèle **a** | `--a: #6ad1e3` (cyan) |
| allèles multiples (E, F, G) | palette de 8 teintes douces (A et a en tête), puis teintes par angle d'or pour les allèles nés d'une mutation |
| histogrammes, fréquences observées | `--accent` |
| attendu, théorie, génération précédente fantôme | `--texte-2`, tireté fin |
| fitness relative > 1 (ce variant gagne en fréquence) | `--positif` ; < 1 (il en perd) : `--negatif` (même convention de signe que 4·5·7 : ce qui croît / ce qui décroît) |
| repère clé : individu suivi, moyenne, mutation qui apparaît, ligne mise en évidence | `--energie` |
| migrant | contour `--texte` |

Terrain des arènes A et B (le fond sur lequel vivent les individus) : neutre `#5e5850` ; sombre `#2f2b27` ; clair `#bdb3a2` ; moyen `#8a8174` ; tacheté = taches sombres et claires mêlées (bruit doux, deux teintes). Le terrain occupe l'arène seulement ; le reste de la page reste la paillasse sombre.

## Structure : sept chapitres, onze étapes (stepper)

Segments `A1 A2 | B1 | C1 C2 | D1 D2 | E1 E2 | F1 | G1`. Dans une étape, la simulation avance **par générations** ; contrôles communs : lecture/pause (enchaîne les générations), « Une génération », « ×10 » (dix générations sans animation intermédiaire), « Nouveau tirage » (nouvelle graine), « Rejouer le même tirage » (même graine, même histoire : c'est la preuve que le hasard est réel *et* contrôlé). Afficher la graine en petit (`graine 48213`, mono, `--texte-2`). Changement d'étape : fondu, jamais de saut. Les curseurs propres à une étape n'apparaissent que dans cette étape.

Rythme par défaut : A1 ≈ 2,4 s par génération (animée en phases), B1 sur demande, C2/D/E/F ≈ 6 générations par seconde, G1 ≈ 8 générations par seconde.

### A — Une population, pas un individu

**A1. La composition change, pas les individus (moment fort).** Une **arène** (rectangle aux coins à peine arrondis, terrain coloré) avec N = 240 individus colorés par leur z. Sélecteur « Terrain » : *sans prédateur* (`none`, terrain neutre), *sombre* (`dark`, défaut), *clair* (`light`). Curseur « intensité de la sélection » s (0 à 0,9, défaut 0,6). Une génération s'anime en quatre phases, nommées en petit sous l'arène :
1. *vivre* : les individus dérivent lentement sur place ;
2. *sélection* : les non-survivants (`traitSurvive`) pâlissent en contour puis disparaissent ; rien ne bouge chez les autres ;
3. *reproduction* : chaque nouvel individu (`traitReproduce`) naît à côté de son parent, relié un instant par un trait fin ;
4. *relève* : la génération précédente s'efface (générations non chevauchantes).

À droite de l'arène (dessous sur mobile) : l'histogramme de z de la génération courante (`--accent`), le fantôme de la génération 0 (tireté), la moyenne (trait `--energie`) ; et un petit graphe « moyenne de z selon la génération ». **Micro-interaction de découverte (moment pédagogique)** : clic/tap sur un individu → il est cerclé `--energie` et le panneau affiche « Individu suivi · coloration 0,62 · sa coloration ne change pas pendant sa vie ». S'il meurt : « n'a pas survécu jusqu'à la reproduction » ; s'il a des descendants : « a laissé 2 descendants » et ceux-ci sont cerclés plus pâle à la génération suivante (suivre ensuite la lignée, `id`). Mesures : génération, N, moyenne de z, écart-type, survivants à la dernière sélection. Phrase clé : « Aucun individu n'a changé de couleur. La population, si : ceux qui ont survécu plus souvent ont laissé plus de descendants qui leur ressemblent. »

**A2. Variation sans hérédité : génotype et phénotype.** Même arène, terrain sombre, s = 0,6. Chaque individu montre maintenant deux choses : son corps a la couleur du **phénotype** z (ce que voit le prédateur), un petit **noyau** au centre a la couleur du **génotype** g (ce qui est transmis). Curseur « part héritable de la variation » h² (0 à 1, défaut 0,8 ; changer h² refait une population, `traitInit({h2})`). Graphe « moyenne de z selon la génération » qui **garde** les courbes des courses précédentes à 25 % avec leur étiquette h² : on compare h² = 0,8 (la moyenne glisse), h² = 0 (elle ne bouge pas malgré une sélection aussi forte). Mesures : h², différentielle de sélection S (moyenne des survivants − moyenne de la population, `traitStats(pop, alive).S`), réponse R (moyenne de la génération suivante − moyenne de celle-ci), rapport R/S. Équation discrète : `R ≈ h² · S`. Phrase clé : « La sélection trie des phénotypes ; seule la part génétique de leurs différences passe aux descendants. Sans hérédité, la sélection agit à chaque génération et ne laisse aucune trace. » Survol du noyau : « génotype : l'information transmise » ; survol du corps : « phénotype : le caractère observable, génotype + environnement ».

### B — Sélection

**B1. Ce que veut dire « fitness ».** Vue analytique. En haut, une bande de terrain (sélecteur « Terrain » à cinq choix : *aucun prédateur*, *sombre*, *moyen*, *tacheté*, *clair*). Dessous, trois graphes alignés sur le même axe z ∈ [0, 1] :
1. l'histogramme de la génération courante (`--accent`) ;
2. la **survie** w(z) (`survival`, trait `--texte`) et sa moyenne w̄ (tireté horizontal) ; la zone où w > w̄ est teintée `--positif` très pâle, w < w̄ `--negatif` très pâle : la **fitness relative** w/w̄ est lue sur un second axe à droite (1 au niveau de w̄) ;
3. la génération suivante **attendue** (`traitPredictNext`, tireté) superposée au fantôme de la génération actuelle.

Bouton « Une génération » : tire réellement la génération suivante (elle devient la courante). Bascule « Environnement rude : toutes les survies × 0,5 » : la courbe de survie s'écrase, w̄ aussi, **la fitness relative et la génération attendue ne bougent pas**. Curseur s (0 à 0,9, défaut 0,6). Le panneau nomme le régime : *directionnelle* (sombre, clair), *stabilisante* (moyen), *disruptive* (tacheté), *aucune*. Mesures : w̄, moyenne actuelle → attendue, écart-type actuel → attendu. Phrase clé : « La fitness n'est ni la force, ni la santé, ni la perfection : c'est le succès reproductif d'un variant **comparé aux autres**, dans **cet** environnement. Change le terrain, et le « meilleur » change. »

### C — Fréquences d'allèles

**C1. Deux allèles : p + q = 1.** On passe du trait continu à un gène à deux variantes. N = 50 individus diploïdes dessinés comme des paires de perles (deux copies, A lilas ou a cyan). Au-dessus, le **réservoir de copies** : les 2N = 100 perles alignées en une barre (A à gauche, a à droite), p et q écrits dessous. Curseur p (0,02 à 0,98, pas 0,02, défaut 0,3). Bouton « Former une génération » : les 100 copies se mélangent et s'apparient deux à deux (`wfIndividuals`), animation ≤ 1,2 s. À côté, le **carré de Punnett proportionnel** : un carré unité coupé en p et q horizontalement et verticalement ; ses quatre aires sont p², pq, pq, q² (étiquetées), le tout à côté d'une barre des génotypes **observés** (AA, Aa, aa). Sélecteur N : 50 / 1000 (à 1000, les individus sont de petits points et les proportions observées collent à p², 2pq, q²). Mesures : copies A, copies a, p, q, p + q, AA/Aa/aa observés et attendus. Phrase clé : « Une fréquence, c'est une proportion de copies. Si les copies se rencontrent au hasard, les génotypes suivent p², 2pq, q² : c'est le modèle nul de Hardy-Weinberg, ce qui arrive quand rien ne pousse les fréquences. » Note : « Hardy-Weinberg n'est pas une loi de l'évolution, c'est la référence de ce qui se passe *sans* sélection, sans dérive, sans mutation ni migration. »

**C2. Une sélection sur un allèle.** Une population N = 1000 (grande : le hasard y est faible). Curseurs s (−0,2 à 0,2, pas 0,01, défaut 0,05) et p₀ (0,02 à 0,98, défaut 0,1). Graphe p(t) sur 0 à 200 générations : la trajectoire simulée (`wfStep`, trait `--A`) et la trajectoire attendue (`wfExpected` itéré, tireté). Sous le graphe, une fine bande de génotypes empilés (AA/Aa/aa) par génération. Mesures : génération, p, q, Δp de la dernière génération, Δp attendu ≈ (s/2)·p·q. Phrase clé : « La sélection ne fabrique pas l'allèle A : elle change sa fréquence, un peu à chaque génération, plus vite quand les deux variantes sont courantes. Avec s = 0, rien ne bouge (presque). » Le « presque » renvoie vers D.

### D — Dérive génétique

**D1. Le hasard de la reproduction (moment fort).** Aucune sélection. Vingt populations **identiques** au départ (p₀ = 0,5), même environnement, simulées au niveau des copies (`maStep` à deux allèles, A = 0, a = 1). Sélecteur N : 10 / 50 / 500 (défaut 10).
- **Généalogie** (à gauche, ou en haut sur mobile) : pour la population n° 1, les 2N copies de chaque génération en une rangée de perles, chaque copie reliée par un trait fin à la copie dont elle descend dans la rangée précédente (`parent`, `sortByParent: true`). Les rangées défilent (les plus récentes en bas). On voit des copies sans descendance et d'autres copiées deux ou trois fois : c'est tout. Pour N = 500, la généalogie est remplacée par la seule barre de fréquence (« 1000 copies : trop pour les dessiner une à une »).
- **Vingt trajectoires** p(t) (à droite) sur 0 à 100 générations, traits fins `--texte` à 40 %, la population n° 1 en `--energie`. Au bout de chaque trajectoire terminée par fixation ou perte, un petit point.
- Sous les trajectoires : l'histogramme des p actuels des 20 populations (`--accent`), et les compteurs « A fixé · a fixé · encore variables ».
- Petit graphe secondaire (`#secBox`) : diversité moyenne H des 20 populations, rapportée à H₀, contre l'attendu (1 − 1/2N)^t (tireté).

Mesures : génération, N, p de la population suivie, écart-type des p entre populations, fixées / perdues. Phrase clé : « Aucun allèle n'est avantagé. Les fréquences bougent quand même, parce qu'une génération finie n'est qu'un échantillon de la précédente. Plus la population est petite, plus l'échantillon est grossier. » Survol d'une perle de la généalogie : « copie de A · 3 descendants » ; survol d'une trajectoire : « population 7 · p = 0,85 ».

**D2. Sélection et dérive à la fois.** Vingt populations, l'allèle A **avantagé** (curseur s de 0 à 0,1, défaut 0,05), rare au départ p₀ = 0,1 (curseur 0,02 à 0,5). Sélecteur N : 10 / 100 / 1000 (défaut 10). Trajectoires p(t) (`wfStep`) sur 0 à 150 générations, avec la trajectoire déterministe attendue en tireté. Compteurs : « A fixé · A perdu · en cours ». Mesures : N·s, probabilité de fixation de Kimura (`fixationProb`), probabilité si A était neutre (p₀), fraction observée parmi les populations terminées. Phrase clé : « La sélection est un biais ; la dérive est le bruit. Dans une petite population, un allèle avantageux peut disparaître par malchance. Ce qui décide, c'est N·s. » Note : « sélection ≠ dérive : une fréquence peut changer sans aucun avantage (D1), et un avantage peut ne rien changer (ici, N = 10). »

### E — Fondateur et goulot

**E1. Effet fondateur.** Un **continent** : 2000 copies (N = 1000), 8 allèles de fréquences inégales `[0,30 ; 0,20 ; 0,15 ; 0,12 ; 0,09 ; 0,07 ; 0,05 ; 0,02]`, dessinées comme un nuage de perles minuscules dans une grande forme organique à gauche. Curseur « fondateurs » k (2 à 50 individus, défaut 5). Bouton « Fonder une colonie » : 2k copies tirées au hasard (`maSample`) s'allument `--energie`, traversent la mer vers une **île** à droite ; la colonie croît ensuite vers 200 individus (+50 % par génération, plafonné) en dérivant (`maStep`). Jusqu'à trois îles (« Fonder une autre colonie » ; la quatrième remplace la plus ancienne) : elles diffèrent **entre elles**. Barres empilées de fréquences : continent, fondateurs, chaque colonie aujourd'hui. Mesures : allèles présents (continent / colonie), H continent, H fondateurs, attendu H₀·(1 − 1/2k). Phrase clé : « Les fondateurs ne sont pas choisis pour leurs gènes : ils forment un échantillon. Un petit échantillon reproduit mal les proportions, et les allèles rares restent souvent sur le continent. »

**E2. Goulot d'étranglement.** Une population de 400 individus (800 copies), 8 allèles à fréquences égales. Graphe de la **taille** N(t) en haut (0 à 80 générations, `bottleneckSizes` : effondrement à la génération 10 jusqu'à N_b pour 3 générations, puis croissance r = 0,5 jusqu'à 400). Curseur N_b (2 à 50, défaut 5). Dessous, sur le même axe des générations : nombre d'allèles présents (escalier) et diversité H (trait `--accent`), avec H attendue (`expectedH`, tireté). À côté, le nuage des copies actuelles, colorées. Mesures : génération, N, allèles présents, H, H avant le goulot. Phrase clé : « La taille revient en quelques générations. La diversité perdue, non : elle ne revient que par mutation ou par migration, beaucoup plus lentement. » Fond commun avec E1 à dire dans le panneau : *fondateur et goulot sont le même phénomène, un échantillonnage trop petit, suivi de dérive.*

### F — Ce qui ajoute et ce qui mélange

**F1. Mutation et flux génétique.** Deux **îles** (N = 100 chacune, 200 copies), 4 allèles au départ, même composition. Pour chacune : un nuage de perles, et un **graphe de Muller** (aires empilées des fréquences des allèles en fonction de la génération, 150 dernières générations). Curseurs : taux de mutation μ par copie et par génération (0 à 0,01, défaut 0,002) et taux de migration m (0 à 0,1, défaut 0). `islandsStep`. Chaque mutation (`mutated`) fait apparaître une perle d'une couleur **jamais vue** avec un bref anneau `--energie` ; chaque migrant reçoit un contour `--texte` une génération. Sur le Muller on voit naître de fins filets de couleur, la plupart s'éteignent, de rares s'étendent. Mesures : par île H et allèles présents ; divergence entre îles (`divergence`, 0 = identiques, 1 = rien en commun) ; θ = 4Nμ et H* = θ/(1 + θ). Phrase clé : « La mutation introduit des variantes au hasard, qu'elles servent ou non ; la plupart disparaissent par dérive. La migration mélange des populations qui, sinon, divergent. » Note : « Une mutation ne survient pas parce qu'elle serait utile : son taux ne dépend pas de l'environnement. Ici toutes les variantes sont neutres ; dans un environnement donné, la plupart des mutations qui changent quelque chose sont neutres ou nuisibles, rarement avantageuses. »

### G — Ouverture

**G1. Et si la population n'était pas mélangée ?** Deux grilles 64 × 40 côte à côte (empilées sur mobile), 4 allèles tirés au hasard, même règle neutre (`gridStep`) : à gauche *mélange parfait* (le parent est n'importe qui), à droite *voisinage* (le parent est l'un des 8 voisins). À droite des **taches** se forment et grandissent ; à gauche, un poivre et sel qui dérive lentement en bloc. Mesure : « voisins semblables » (`gridSameNeighbor`) pour chaque grille, et sa valeur sans structure Σpᵢ². Texte du panneau, deux paragraphes courts :
- vers le **module 41** : « Jusqu'ici, chacun pouvait se reproduire avec n'importe qui. Les vraies populations ont un espace, des contacts, des réseaux. Qui touche qui change ce qui se propage, une variante, une rumeur ou une maladie. »
- vers le **module 42** : « Personne ne copie plus loin que son voisin, et personne ne dessine les taches. Une règle individuelle simple produit une structure collective qu'aucun individu ne vise : c'est l'émergence. »
Liens textuels (sans hyperlien, ces pages n'existent pas) : « À suivre : 41 · Populations et propagation sur réseaux · 42 · Émergence ». Ne **pas** construire de SIR, de réseau, d'automate de Conway ni d'Ising.

## Vocabulaire et pièges (à respecter dans tous les textes de la page)

Distinguer partout : individu ≠ population ; trait ≠ variante ≠ allèle ; génotype ≠ phénotype ; fréquence (proportion de copies) ≠ nombre ; fitness relative ≠ survie absolue.

**Interdits** (ni dans la page ni dans l'explication, sauf pour les réfuter explicitement entre guillemets) : « pour s'adapter », « afin de survivre », « l'espèce essaie / veut / cherche », « a besoin de », « le plus fort », « meilleur organisme », « plus évolué », « progrès », « optimal », « la mutation apparaît pour ». Le sujet d'un verbe d'action est une population, une fréquence, un allèle ou un processus, jamais une intention.

Le hasard présenté comme tel est **réel** : il vient du générateur semé, pas d'un script. Deux tirages différents donnent deux histoires différentes ; « Rejouer le même tirage » donne la même.

## Interface

- Coquille de `fondations-systemes-hasard` : grille scène + panneau à droite ≥ 861 px, panneau en bas sur mobile, barre de contrôles en bas, stepper groupé (ch0 au début de chaque chapitre).
- Panneau : `Chapitre A · étape 1 sur 11`, titre, 1 à 3 phrases, l'équation de l'étape quand il y en a une (classe `.eq`), phrase clé (`.cle`), mesures, note, graphe secondaire quand utile.
- Micro-interaction de découverte (survol ou tap → nom + rôle en une ligne) : individu, noyau (génotype), corps (phénotype), barre d'histogramme, courbe de survie, w̄, perle-copie, carré de Punnett (chaque aire), trajectoire, généalogie, continent, île, migrant, mutation, cellule de grille.
- Clavier : Espace pause, ← → étape, R réinitialiser l'étape, G une génération, 1 à 9 étapes 1 à 9.
- Responsive jusqu'à 375 px, sans défilement horizontal ; sous 860 px les vues côte à côte s'empilent. A1 sur mobile : arène en haut, histogramme dessous ; N reste 240 (individus plus petits).
- `prefers-reduced-motion` : phases d'A1 sans mouvement de dérive (fondus seulement), rythme ralenti ×0,4, pas de vol des fondateurs (apparition directe).
- Canvas à l'échelle de `devicePixelRatio`. Aucune erreur console. Performance : D1 à N = 500 (20 × 1000 copies), E1 (2000 perles), G1 (2 × 2560 cellules, dessin par `ImageData` ou rectangles par lots) doivent rester fluides.
- Lien `explication.html` et retour `../index.html`.
- Note de design de 3 lignes en commentaire HTML en tête.

## Crochet de vérification (obligatoire)

Exposer `window.__evo` en lecture seule pour la QA automatisée, sans effet sur l'interface :

```js
window.__evo = {
  step: () => index,                       // 0..10
  go: (i) => {...},
  setParam: (name, value) => {...},        // env, s, h2, harsh (bool), p, N, p0, k, Nb, mu, m
  seed: (n) => {...},                      // réensemence et réinitialise l'étape courante
  gen: (n) => {...},                       // avance n générations de l'étape courante, synchrone, sans animation
  found: () => {...},                      // E1 : fonde une colonie
  state: () => ({...}),                    // selon l'étape, au minimum :
  // A1/A2 : { gen, N, meanZ, sdZ, h2, S, R, survivors, tracked: {alive, z, children} | null }
  // B1   : { env, s, harsh, wbar, meanNow, meanNext, sdNow, sdNext, regime }
  // C1   : { N, p, q, AA, Aa, aa, expAA, expAa, expaa }
  // C2   : { gen, s, p, pExpected }
  // D1/D2: { gen, N, s, ps: [20 fréquences], fixedA, lostA, kimura }
  // E1   : { k, sourceH, founderH, expectedFounderH, colonies: [{ gen, N, nAlleles, H }] }
  // E2   : { gen, N, Nb, nAlleles, H, Hbefore, Hexpected }
  // F1   : { gen, mu, m, H1, H2, n1, n2, divergence, Hstar }
  // G1   : { gen, sameMixed, sameLocal }
};
```

## Notes d'échelle (vérifiées par Opus avec le moteur)

- A1, terrain sombre, s = 0,6, h² = 0,8 : moyenne de z de 0,49 à ≈ 0,26 en 20 générations. Sans prédateur : la moyenne ne bouge que par dérive (± 0,02). h² = 0 : déplacement ≈ 0 (± 0,04) malgré la même sélection.
- B1 : stabilisante (moyen, s = 0,8) : écart-type 0,16 → 0,08 en 15 générations ; disruptive (tacheté) : 0,16 → 0,31. « Environnement rude » : même réponse moyenne (vérifié sur 150 courses).
- C1 : N = 20 000, p = 0,3 : AA 0,092, Aa 0,416, aa 0,492 (attendu 0,09 / 0,42 / 0,49).
- C2 : Δp ≈ (s/2)·p·q ; s = 0,1, N = 1000 : p de 0,1 à ≈ 0,96 en 120 générations.
- D1 : N = 25, 40 générations : variance des p = 0,138 (théorie p₀q₀[1 − (1 − 1/2N)^t] = 0,139) ; fixations A et a à égalité. N = 10 : H divisée par 2 en ≈ 14 générations ; la plupart des 20 populations sont fixées vers 60-100 générations. N = 500 : écart-type des p ≈ 0,07 après 40 générations.
- D2 : nouvel allèle (p₀ = 1/2N), N = 50, s = 0,04 : fixé 4,1 % des fois (Kimura 4,0 %, neutre 1 %). N = 10, s = 0,04, p₀ = 0,5 : l'allèle favorable est **perdu** 42 % des fois. Défauts (N = 10, s = 0,05, p₀ = 0,1) : Kimura 0,15 contre 0,10 si neutre ; N = 1000 : ≈ 1.
- E1 : 5 fondateurs : H ≈ H₀·(1 − 1/10), mais en moyenne 5,8 allèles sur 8 seulement.
- E2 : N_b = 5 pendant 3 générations : H moyenne 0,875 → ≈ 0,50 (attendue 0,496) et la taille revient à 400 vers la génération 25 ; une course typique ne garde que 2 à 5 allèles.
- F1 : N = 50, μ = 0,005 : H ≈ 0,49 (θ/(1 + θ) = 0,50). Îles N = 100, 150 générations : sans migration divergence ≈ 0,98 ; m = 0,05 : ≈ 0,14.
- G1 : après 60 générations, voisins semblables ≈ 0,63 (voisinage) contre ≈ Σp² ≈ 0,35 (mélange).

## Ce que explication.html doit dire

Écrite par Opus (pas par le constructeur). Charte habituelle, plus une section « Les idées, une par une » (définition, représentation dans la page, relation clé, limites) qui sert de théorie de référence, plus « Pièges », « Où tu reverras ce langage » et « Seulement introduit ici ».
