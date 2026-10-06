# Fondations · Copie, variation et division du génome (module 36)

Dossier de sortie : `opus-sonnet/fondations-genome-variation/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 36`, titre « Copier, varier, *diviser* ». Accent : `--accent: #a6e3d0;` (vert d'eau pâle, entre la mitose et la réplication). Budget : ≈ 0,8 ADN, **un chapitre de 4 étapes**.

**Statut particulier.** Deux showcases couvrent déjà une partie du module : *La mitose* (`../01-mitose/`, phase M) et *La réplication de l'ADN* (`../08-replication-adn/`, la fourche). Cette page ne refait ni l'une ni l'autre. Elle construit ce qui manque : **le cycle cellulaire et ses points de contrôle**, **les erreurs de copie et leur réparation**, **la méiose** et **la recombinaison**. Ensemble, ces quatre étapes répondent à une question : comment un génome peut-il être copié presque parfaitement, et pourtant varier d'une génération à l'autre ?

## Intention

Intuitions à rendre évidentes, par ordre de priorité :

1. La copie de l'ADN est d'une fidélité extrême parce qu'elle a **plusieurs couches de correction**, chacune divisant les erreurs par cent ou plus ; sans elles, chaque division ferait des dizaines de milliers d'erreurs (étape 2, moment fort).
2. La cellule ne se divise pas quand elle veut : des points de contrôle vérifient que l'ADN est intact et entièrement copié ; quand ils sautent, des cellules abîmées se divisent quand même (étape 1).
3. La méiose divise le nombre de chromosomes par deux et **mélange** : chaque gamète reçoit une combinaison au hasard d'un chromosome de chaque paire (étape 3, moment fort).
4. Le crossing-over échange des morceaux entre chromosomes homologues : des gènes proches restent ensemble, des gènes éloignés se séparent souvent (étape 4).
5. La variation vient de deux sources très différentes : les mutations (rares, nouvelles) et le brassage (fréquent, recombine l'existant) (étapes 2 à 4).

Interdits : « la cellule décide de se diviser », « les mutations arrivent pour que l'espèce s'adapte ».

## Réutilisation (ne pas reconstruire)

- Phase M, fuseau, cytocinèse : `../01-mitose/`. L'étape 1 montre la mitose en accéléré (une icône animée) et renvoie à la planche.
- Fourche, polymérase, brin retardé : `../08-replication-adn/`. L'étape 2 montre la polymérase en gros plan sur une seule base, pas la fourche.
- Code génétique et classification des mutations : `../fondations-information-genetique/` (module 35). Réutiliser `classify`.
- Hasard, probabilités, loi binomiale (combinatoire 2ⁿ) : `../fondations-systemes-hasard/`.
- Fréquences alléliques, sélection : `../fondations-evolution-populations/` (module 40), renvoi en fin de planche.

## Moteur (à écrire et tester avant la page)

Bloc `/* GENO-BEGIN */ … /* GENO-END */`, objet `Geno`. Hasard par générateur à graine.

- **Cycle cellulaire** : `cycleInit({G1, S, G2, M})` (durées en heures, défaut 11, 8, 4, 1) ; `cycleStep(cell, dt, {checkpoints, damage})` → phase, contenu en ADN (2C → 4C pendant S → 2C après M), arrêt aux points G1/S, G2/M et du fuseau si dommage non réparé ; `population(cells, dt)` (prolifération, cellules arrêtées, cellules filles portant des dommages si les points de contrôle sont désactivés).
- **Fidélité** : `copyErrors({length, baseSelection, proofreading, mismatchRepair}, rng)` → nombre d'erreurs (tirage de Poisson) ; `errorRate(layers)` ; ordres de grandeur documentés : sélection des bases ≈ 10⁻⁵, relecture ≈ ×10⁻², réparation des mésappariements ≈ ×10⁻² à ×10⁻³ ; `damage(kind)` (dimère de thymines par les UV, base oxydée) et `repair(kind, on)` (excision : retirer, recopier, recoller).
- **Méiose** : `meiosis(genome, {pairs, crossovers}, rng)` → 4 gamètes ; génome = paires de chromosomes homologues (un d'origine maternelle, un paternelle), chacun porteur de quelques gènes à des positions données ; `combinations(nPairs)` = 2ⁿ ; `fertilize(g1, g2)`.
- **Recombinaison** : `crossover(chrA, chrB, nChiasmata, rng)` ; `haldane(d)` = ½(1 − e^(−2d)) (d en morgans) ; `recombFreq(samples, geneA, geneB)` ; `dihybrid(linked, d, n, rng)` → effectifs des quatre classes.

### Tests du moteur

1. Cycle de 24 h : fractions de temps 0,46 / 0,33 / 0,17 / 0,04 ; contenu en ADN 2C en G1, 4C en G2, retour à 2C après M.
2. Dommage en G1 avec points de contrôle : aucune entrée en S tant que le dommage n'est pas réparé ; sans points de contrôle : les cellules filles héritent du dommage.
3. Fidélité, génome diploïde humain (6,4 × 10⁹ pb) : sélection seule → ≈ 6 × 10⁴ erreurs par copie ; + relecture → ≈ 600 ; + réparation → de l'ordre de 1 à 6 ; moyennes de 1 000 tirages à 3 % de l'espérance.
4. Méiose sans crossing-over, n paires : les 2ⁿ combinaisons apparaissent avec des fréquences égales (χ² sur 10⁵ méioses, n = 3) ; chaque gamète a exactement un chromosome par paire.
5. Recombinaison : fréquence mesurée = `haldane(d)` à 2 % pour d = 0,01, 0,1, 0,5 M ; tend vers 0,5 pour des gènes très éloignés ou sur des chromosomes différents.
6. Dihybridisme non lié (F1 × F1, dominance complète) : rapports 9 : 3 : 3 : 1 à 2 % sur 10⁵ descendants ; lié à 10 cM : classes recombinées ≈ 10 % en croisement test.
7. 23 paires : 2²³ = 8 388 608 combinaisons sans crossing-over.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| chromosomes d'origine maternelle / paternelle | `#f2b8d8` (rose) / `#9ad0f5` (bleu), désaturés ; les morceaux échangés gardent la couleur de leur origine |
| gènes (marqueurs) | petites bandes avec lettre (A/a, B/b…), majuscule pleine, minuscule en contour |
| phases du cycle | anneau : G1 `--texte-2`, S `--accent`, G2 `--texte-2` plus clair, M `--energie` |
| dommage à l'ADN | éclat `--positif` sur l'hélice ; réparation : `--accent` |
| erreur de copie non corrigée | base `--positif` mal appariée |
| point de contrôle | barrière `--texte` sur l'anneau, qui s'ouvre (vert d'eau) ou reste fermée |

## Chapitre · Module 36 · Copie, variation et division du génome

### Étape 1 · Le cycle cellulaire et ses contrôles
- Scène : un grand anneau du cycle (G1, S, G2, M) sur lequel tourne une cellule ; sous l'anneau, la courbe de son contenu en ADN (2C → 4C → 2C) ; trois barrières (G1/S, G2/M, fuseau). À droite, une petite culture de cellules qui prolifèrent. Pendant M, une icône animée de la mitose (lien vers `../01-mitose/`) ; pendant S, une icône de fourche (lien vers `../08-replication-adn/`).
- Contrôles : bouton « Endommager l'ADN » (UV), bascule « Points de contrôle actifs » (un gène gardien, nommé seulement ensuite : p53), vitesse du temps.
- Panneau : phase, durée écoulée, contenu en ADN, nombre de cellules, cellules arrêtées, cellules filles porteuses de dommages. Statuts : avec contrôles « La cellule attend à la barrière G1/S que l'ADN soit réparé » ; sans contrôles « Les cellules abîmées se divisent quand même : leurs filles héritent des dommages » (le mot « cancer » apparaît seulement dans la note, avec prudence : « une des étapes vers certains cancers »).
- Phrase-clé : « Une cellule copie tout son ADN (phase S) avant de se diviser (phase M). Des points de contrôle bloquent le cycle tant que l'ADN est abîmé ou mal copié. »
- Note : durées d'une cellule humaine en culture ; G0 et facteurs de croissance seulement nommés.

### Étape 2 · Des erreurs de copie, et leur correction (moment fort)
- Scène : gros plan sur la polymérase qui ajoute des bases une à une ; de temps en temps, une mauvaise base entre (éclat) ; la relecture (bras qui recule) la retire ; ce qui reste est rattrapé plus tard par une deuxième machine qui parcourt l'ADN (réparation des mésappariements). À côté, un compteur géant : « erreurs dans une copie complète du génome humain », recalculé selon les couches actives. Bascule « Dommage UV » : un dimère de thymines apparaît ; avec la réparation par excision, un morceau est retiré, recopié, recollé.
- Contrôles : trois bascules (sélection des bases toujours active ; relecture ; réparation des mésappariements), bouton « Copier un génome entier » (tirage), bouton « Rayons UV ».
- Panneau : taux d'erreur par base, erreurs attendues par copie, erreurs tirées, effet sur une protéine (renvoi à 35 : silencieuse, faux-sens…). Statuts : sans relecture ni réparation « Soixante mille erreurs à chaque division » ; tout actif « Une erreur ou quelques-unes par division, pour 6 milliards de lettres : comme recopier une dizaine de milliers de romans en se trompant d'une ou deux lettres ».
- Phrase-clé : « La copie de l'ADN se trompe rarement parce que chaque erreur doit passer plusieurs contrôles successifs. Ce qui échappe à tous devient une mutation, transmise aux cellules filles. »
- Note : taux en ordres de grandeur, variables selon les régions et les organismes.

### Étape 3 · La méiose : diviser par deux et mélanger (moment fort)
- Scène : une cellule avec n paires de chromosomes homologues (rose / bleu) ; on lance la méiose : réplication, appariement des homologues, première division (les homologues se séparent, chaque paire s'oriente au hasard), deuxième division (les chromatides se séparent) ; quatre gamètes. Bascule « Comparer avec la mitose » : à côté, une mitose de la même cellule donne deux cellules identiques à la mère.
- Contrôles : nombre de paires (1 à 4), bouton « Méiose », bouton « 1 000 méioses » (histogramme des combinaisons de gamètes).
- Panneau : 2n et n, combinaisons possibles (2ⁿ), histogramme des gamètes observés. Encart : chez l'humain, 23 paires → 8 388 608 combinaisons par parent, sans compter le crossing-over ; avec deux parents, plus de 7 × 10¹³ enfants possibles. Statut : « Chaque paire se sépare au hasard, indépendamment des autres : le gamète reçoit un mélange de chromosomes maternels et paternels ».
- Phrase-clé : « La méiose fabrique des gamètes à un seul chromosome de chaque paire, choisi au hasard. La fécondation rétablit les paires : chaque enfant est une combinaison nouvelle. »
- Note : chromosomes stylisés ; non-disjonction seulement mentionnée.

### Étape 4 · Crossing-over et brassage
- Scène : une paire d'homologues portant deux ou trois gènes (A/a, B/b, C/c) ; pendant la méiose, des chiasmas se forment au hasard le long de la paire ; les morceaux échangés gardent leur couleur d'origine (chromosomes en mosaïque). Une règle en centimorgans le long du chromosome ; on déplace le gène B pour changer sa distance à A.
- Contrôles : distance A–B (glisser B), nombre moyen de crossing-over par paire, bouton « 1 000 gamètes ». Bascule « Croisement » : deux parents, descendance en tableau 2 × 2 avec les classes parentales et recombinées.
- Panneau : fréquence de recombinaison mesurée, courbe r(d) avec le point courant (plafonne à 50 %), rapports de la descendance (9 : 3 : 3 : 1 si non liés). Statuts : gènes voisins « Ils voyagent presque toujours ensemble : on dit qu'ils sont liés » ; gènes éloignés « Au-delà d'une certaine distance, autant de recombinés que de parentaux : comme s'ils étaient sur des chromosomes différents ».
- Phrase-clé : « Le crossing-over échange des morceaux entre chromosomes homologues. Plus deux gènes sont éloignés, plus ils sont souvent séparés : c'est ainsi qu'on a dressé les premières cartes génétiques. »
- Fin de planche, trois questions ouvertes : **Évolution** « Que deviennent ces variations dans une population, génération après génération ? » → module 40 (construit) ; **Signaux** « Qui donne à une cellule le signal de se diviser ? » → module 37 ; **Santé** « Pourquoi certaines cellules échappent-elles aux contrôles ? » → seulement introduit (cancer, Atlas).

## Micro-interactions de découverte

Phase G1, S, G2, M, point de contrôle, cellule arrêtée, polymérase, relecture, réparation, dimère de thymines, mutation, chromosome homologue, chromatide, chiasma, gamète, fécondation, centimorgan.

## `window.__labo` (en plus du socle)

`damage()`, `checkpoints(on)`, `setSpeed(x)` (1) ; `layer(name, on)`, `copyGenome()`, `uv()` (2) ; `setPairs(n)`, `meiosis()`, `meiosisN(n)`, `compareMitosis(on)` (3) ; `setDistance(cM)`, `setCrossovers(m)`, `gametes(n)`, `cross(on)` (4).

## Théorie (explication, module 36)

- Relations : contenu en ADN 2C → 4C → 2C ; erreurs attendues \(\langle k \rangle = L\,\mu\) avec \(\mu = \mu_1\mu_2\mu_3\) ; nombre de combinaisons \(2^n\) ; fonction de Haldane \(r = \tfrac12\left(1 - e^{-2d}\right)\), \(r \approx d\) pour \(d\) petit (1 cM ≈ 1 %) ; rapports \(9:3:3:1\).
- Exemple chiffré possible : erreurs par copie du génome humain selon les couches de correction ; ou nombre de combinaisons d'un gamète humain.
- Pièges : « méiose et mitose, c'est pareil en deux fois » ; « les chromatides sœurs sont des homologues » ; « une mutation apparaît chez l'individu quand il en a besoin » ; « des gènes liés sont toujours transmis ensemble » ; « r peut dépasser 50 % » ; « un enfant a la moitié des gènes de chaque grand-parent » (en moyenne un quart, avec de la variance).
- Où ça resservira : 40 (variation, dérive), 35 (classification des mutations), 37 (signaux de division), 39 (diversité des anticorps, recombinaison somatique : seulement introduit), planches 01 et 08.
- Seulement introduit ici : p53 et oncogènes, télomères, non-disjonction et trisomies, recombinaison somatique.

## Honnêteté

Durées et taux en ordres de grandeur ; chromosomes et machines stylisés ; carte génétique à interférence nulle (Haldane) ; dominance complète dans les croisements.

## Hors champ

Cancer en détail, épigénétique, réparation des cassures double brin, génétique humaine clinique, conseil génétique.
