# Fondations · Information génétique (module 35)

Dossier de sortie : `opus-sonnet/fondations-information-genetique/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 35`, titre « De l'ADN à la *protéine* ». Accent : `--accent: #b3a3ff;` (lavande ; la planche 08 garde son turquoise pour l'ADN, et on le reprend pour la double hélice). Budget : ≈ 0,8 ADN, **un chapitre de 4 étapes**.

Préalables conseillés : 28 (liaisons hydrogène), 32 (cellule, noyau), 34 (enzymes). Elle prépare 36 (copie et variation), 37 (signalisation : quels gènes s'allument), 40 (allèles), et explique ce que les planches *La mitose* et *La réplication de l'ADN* manipulent sans le dire.

## Intention

À la fin, l'étudiant voit l'ADN comme **un texte**, et la cellule comme **une machine qui recopie ce texte en ARN puis le traduit en protéines**, en ne lisant que les gènes dont elle a besoin. Intuitions à rendre évidentes, par ordre de priorité :

1. L'information n'est pas dans la molécule « en général » mais dans **l'ordre** des bases ; la complémentarité A–T, C–G permet de recopier sans erreur un brin à partir de l'autre (étape 1).
2. La transcription recopie une portion du texte (un gène), dans le même alphabet à une lettre près ; l'ARN est une copie de travail, jetable (étape 2).
3. La traduction change d'alphabet : trois lettres (un codon) donnent un acide aminé ; décaler la lecture d'une seule lettre change tout ce qui suit (étape 3, moment fort).
4. Toutes les cellules d'un organisme ont le même ADN ; elles diffèrent par les gènes qu'elles lisent. Un gène s'allume et s'éteint selon des signaux (étape 4, moment fort).

Interdits : « l'ADN commande la cellule », « le ribosome sait quel acide aminé mettre », « le gène de la couleur des yeux » (on dit « un gène qui code une protéine impliquée dans… »).

## Réutilisation (ne pas reconstruire)

- Réplication de l'ADN, fourche, polymérase : `../08-replication-adn/`. Ne pas montrer la réplication ici (module 36). Reprendre son rendu de la double hélice et ses couleurs de bases.
- Liaisons hydrogène : `../fondations-molecules-mole/` (module 28).
- Noyau, compartiments : `../fondations-cellule-membrane/` (acte VII).
- Production et dégradation, état stationnaire, retour exponentiel : `../fondations-systemes-hasard/`.
- Allèles, fréquences : `../fondations-evolution-populations/` (renvoi en fin de planche).

## Moteur (à écrire et tester avant la page)

Bloc `/* GEN-BEGIN */ … /* GEN-END */`, objet `Gen`.

- **Séquences** : `complement(seq)`, `reverseComplement(seq)`, `transcribe(templateStrand)` → ARNm 5'→3' (U à la place de T), `codingFromTemplate`.
- **Code génétique** : `CODE` : les 64 codons du code standard → acide aminé (code à une et trois lettres) ou stop ; `translate(mrna, frame)` (commence au premier AUG si demandé, s'arrête au premier stop) ; `AA` : nom, propriété (hydrophobe, polaire, chargé +, chargé −) pour la couleur.
- **Mutations** : `mutate(seq, pos, base)`, `insert`, `delete` ; `classify(before, after)` → silencieuse, faux-sens, non-sens, décalage du cadre.
- **Cinétique** : `transcriptionRun({length, rate})` (polymérase qui avance), `ribosomeRun({codons, rate})`, plusieurs ribosomes sur un même ARNm (polysome) ; vitesses documentées (ARN polymérase ≈ 20 à 80 nt/s, ribosome ≈ 5 à 20 acides aminés/s selon l'organisme).
- **Régulation** : `lacOperon({lactose, glucose})` → état du répresseur et de l'activateur, taux de transcription relatif (table de vérité documentée) ; `expression({k, gamma, on}, t)` : dp/dt = k·on − γp (ARNm et protéine, deux étages) ; `steady(k, gamma)`.
- **Gène modèle** : un court gène fictif mais réaliste (≈ 60 à 90 nucléotides codants, promoteur et terminateur stylisés) qui code un peptide d'une vingtaine d'acides aminés, et la vraie séquence de début d'un gène célèbre si on veut un clin d'œil (par exemple le début de la chaîne β de l'hémoglobine, avec la mutation drépanocytaire GAG → GTG, source citée).

### Tests du moteur

1. `CODE` : 64 entrées ; 61 codons de sens, 3 stops (UAA, UAG, UGA) ; AUG = Met, UGG = Trp ; Leu, Ser, Arg : 6 codons chacun ; comparaison complète avec la table standard (NCBI, table 1).
2. `reverseComplement(reverseComplement(s)) = s` ; `transcribe` sur le brin matrice redonne le brin codant avec U.
3. `translate` : la séquence modèle donne le peptide attendu ; le premier stop arrête la lecture.
4. `classify` : changement de la troisième base d'un codon de Leu → souvent silencieuse (cas testés) ; GAG → GTG dans la β-globine → Glu → Val (faux-sens) ; insertion d'une base → décalage du cadre ; création d'un UAA → non-sens.
5. Lac : lactose absent → transcription ≈ 0 ; lactose présent et glucose présent → faible ; lactose présent et glucose absent → forte.
6. Expression : p(t) → k/γ ; temps de demi-approche = ln 2/γ ; sur deux étages, la protéine suit l'ARNm avec retard.
7. Génome humain : 3,1 × 10⁹ paires de bases par jeu haploïde, ≈ 2 m d'ADN par cellule diploïde (0,34 nm par paire).

## Code couleur

| Objet | Couleur et forme |
|---|---|
| bases A, T (U), C, G | les couleurs de la planche 08 (les reprendre telles quelles) |
| squelette sucre-phosphate | `--texte-2` |
| ARN messager | brin simple, même code de bases, squelette `--accent` |
| ARN polymérase, ribosome | formes `--fond-2` à contour `--accent` (le ribosome en deux sous-unités) |
| ARNt | petite forme en L portant son acide aminé |
| acides aminés | perles colorées par propriété : hydrophobes `#dcc29a`, polaires `--texte`, chargés + `--positif`, chargés − `--negatif` |
| gène allumé | lueur douce `--energie` sur le promoteur ; répresseur : forme sable `#dcc29a` qui bloque |

## Chapitre · Module 35 · Information génétique

### Étape 1 · Un texte en quatre lettres
- Scène : zoom continu d'un noyau à un chromosome, à la fibre, à la double hélice, aux paires de bases (reprendre le rendu de 08). Au bout du zoom, une bande de texte qui défile : la séquence du brin, et sous elle le brin complémentaire. L'étudiant peut **écrire** sur un brin (clavier A, T, C, G) : l'autre brin se complète tout seul.
- Contrôles : niveau de zoom (molette ou curseur), saisie de bases, bouton « Ouvrir l'hélice » (les deux brins se séparent, chacun suffit à reconstruire l'autre : renvoi à 08).
- Panneau : longueur de la séquence, contenu en GC, ordres de grandeur (génome humain 3,1 × 10⁹ paires, 2 m d'ADN dans un noyau de 6 µm : « comme une vingtaine de kilomètres de fil fin dans une balle de tennis », rapport de longueurs à recalculer dans le moteur). Statut : « A en face de T, C en face de G : connaître un brin, c'est connaître l'autre ».
- Phrase-clé : « L'information génétique est l'ordre des bases le long de l'ADN. Les deux brins sont complémentaires : chacun contient de quoi refaire l'autre. »
- Note : zoom stylisé, compaction de la chromatine simplifiée.

### Étape 2 · Transcription : une copie de travail
- Scène : un gène (promoteur, région transcrite, terminateur) sur la double hélice ; l'ARN polymérase s'y fixe au promoteur, ouvre une bulle, avance en lisant le brin matrice et allonge un ARN qui se détache derrière elle. Plusieurs polymérases peuvent se suivre. Bascule « Cellule eucaryote » : l'ARN sort du noyau par un pore ; l'épissage est seulement montré comme un raccourcissement (introns retirés) avec une étiquette.
- Contrôles : vitesse (temps réel ou accéléré), bouton « Lancer une polymérase », choix du brin lu (pour montrer qu'un seul brin sert de matrice pour un gène donné).
- Panneau : position de la polymérase, nucléotides par seconde, ARN produits ; la séquence de l'ARN alignée sur le brin codant (identique, U à la place de T). Statut : « L'ARN a la même séquence que le brin codant, à une lettre près : U au lieu de T ».
- Phrase-clé : « La transcription recopie un gène en ARN messager, une copie de travail que la cellule peut produire en nombre et détruire. »
- Note : promoteur et terminateur stylisés ; épissage seulement nommé.

### Étape 3 · Traduction : changer d'alphabet (moment fort)
- Scène : un ARNm qui défile dans un ribosome ; à chaque codon, un ARNt porteur de l'acide aminé correspondant arrive, s'apparie, et la chaîne de perles s'allonge ; au codon stop, le ribosome se détache et la chaîne se replie (repliement schématique, les perles hydrophobes vers l'intérieur). Une grille du code génétique à côté, où le codon courant s'allume.
- Contrôles : clic sur une base de l'ARNm pour la changer, bouton « Insérer une base », bouton « Supprimer une base », bouton « Traduire ». Préréglage « β-globine : la mutation drépanocytaire ».
- Panneau : codons lus, chaîne d'acides aminés (code à une lettre et à trois lettres), type de mutation (`classify`), longueur de la protéine. Statuts : silencieuse « Le codon a changé, l'acide aminé non : le code est redondant » ; faux-sens « Un seul acide aminé change ; selon lequel et où, la protéine fonctionne encore ou plus du tout » ; décalage « Une seule base de plus, et toute la suite est lue de travers » ; non-sens « Un stop trop tôt : protéine tronquée ».
- Phrase-clé : « Le ribosome lit l'ARN trois lettres à la fois ; chaque codon désigne un acide aminé. Le cadre de lecture compte : un décalage d'une lettre change tout ce qui suit. »
- Note : ARNt et ribosome stylisés ; repliement schématique.

### Étape 4 · Allumer un gène (moment fort)
- Scène : deux vues. À gauche, l'opéron lactose d'une bactérie : promoteur, opérateur, gènes ; un répresseur fixé sur l'opérateur bloque la polymérase ; quand du lactose arrive, il s'accroche au répresseur, qui se détache ; si le glucose manque, un activateur renforce la transcription. À droite, des courbes : ARNm et protéine au cours du temps, qui montent vers un plateau quand le gène s'allume et redescendent quand il s'éteint.
- Contrôles : lactose (présent / absent), glucose (présent / absent), vitesse de dégradation de la protéine (γ).
- Panneau : état du répresseur et de l'activateur, taux de transcription, ARNm et protéines par cellule, plateau k/γ, temps de demi-approche. Bascule « Même ADN, cellules différentes » : trois cellules d'un même organisme (neurone, globule rouge en formation, cellule du foie) avec les mêmes gènes, des lumières différentes allumées.
- Statuts : « Lactose sans glucose : la bactérie fabrique les enzymes qui le digèrent, seulement quand il le faut » ; avec γ grand « Une protéine qui se dégrade vite suit les changements de près ; une protéine stable garde la mémoire ».
- Phrase-clé : « Toutes les cellules portent le même texte ; elles diffèrent par les passages qu'elles lisent. Des protéines régulatrices allument ou éteignent les gènes selon les signaux. »
- Fin de planche, trois questions ouvertes : **Copie** « Comment ce texte est-il recopié à chaque division, et que se passe-t-il quand la copie se trompe ? » → module 36 et planche 08 ; **Signaux** « Qui envoie les signaux qui allument les gènes, et comment entrent-ils dans la cellule ? » → module 37 ; **Évolution** « Si un gène change, que devient la population ? » → module 40.

## Micro-interactions de découverte

Noyau, chromosome, double hélice, base, brin matrice, brin codant, promoteur, terminateur, ARN polymérase, ARNm, pore nucléaire, ribosome, ARNt, codon, acide aminé, codon stop, répresseur, opérateur, activateur, lactose.

## `window.__labo` (en plus du socle)

`setZoom(z)`, `typeBases(s)`, `unzip()` (1) ; `startPol()`, `setSpeed(x)`, `eukaryote(on)` (2) ; `setBase(i, b)`, `insertBase(i, b)`, `deleteBase(i)`, `translateNow()`, `presetHbS()` (3) ; `setLactose(on)`, `setGlucose(on)`, `setGamma(g)`, `cellTypes(on)` (4).

## Théorie (explication, module 35)

- Relations : complémentarité A–T, C–G ; \(4^3 = 64\) codons pour 20 acides aminés et 3 stops ; nombre de séquences possibles \(4^n\) ; production-dégradation \(\dfrac{\dd p}{\dd t} = k - \gamma p\), \(p^* = k/\gamma\), \(t_{1/2} = \ln 2/\gamma\).
- Exemple chiffré possible : temps pour transcrire puis traduire une protéine de 300 acides aminés (900 nucléotides codants) ; ou nombre de protéines produites par un ARNm avant sa dégradation.
- Pièges : « un gène = un caractère » ; « l'ARN est fait de l'autre brin » (même séquence que le brin codant) ; « chaque cellule n'a que les gènes dont elle a besoin » ; « une mutation est toujours mauvaise » ; « le code génétique est différent d'une espèce à l'autre » (presque universel) ; « l'ADN fabrique les protéines ».
- Où ça resservira : 36 (réplication, mutation, méiose), 37 (régulation par des signaux), 40 (allèles, variation héritable), 32 (protéines membranaires), 34 (enzymes), planches 01 et 08.
- Seulement introduit ici : épissage alternatif, ARN non codants, épigénétique, modifications des protéines, code génétique mitochondrial.

## Honnêteté

Gène modèle court ; vitesses citées en ordres de grandeur ; machines moléculaires stylisées ; opéron lactose réduit à sa logique ; cellules eucaryotes montrées sans chromatine.

## Hors champ

Biotechnologies (PCR, CRISPR), génomique, réplication (36), évolution du code, synthèse des protéines membranaires et adressage.
