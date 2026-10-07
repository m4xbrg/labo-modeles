# Fondations · Spin, mesure et intrication (module 50)

Dossier de sortie : `opus-sonnet/fondations-spin-intrication/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 50`, titre « Deux valeurs, et des *corrélations* ». Accent : `--accent: #f0a8d8;` (rose orchidée). Budget : ≈ 0,8 ADN, **un chapitre de 4 étapes**. C'est le dernier module de la carte.

Préalables conseillés : 48 (amplitudes, mesure), 25 (polarisation, loi de Malus), 23 (aimant, force sur un dipôle magnétique), 07 (probabilités, corrélation).

## Intention

À la fin, l'étudiant sait qu'**une mesure de spin ne donne que deux résultats**, que la probabilité de chacun dépend de l'angle entre la préparation et l'appareil, qu'une nouvelle mesure dans une autre direction **efface** l'information précédente, et que deux particules intriquées montrent des corrélations qu'aucune règle locale fixée d'avance ne peut reproduire. Intuitions à rendre évidentes, par ordre de priorité :

1. Des atomes d'argent traversant un aimant inhomogène font **deux taches**, pas une traînée : le moment magnétique est quantifié (étape 1, moment fort).
2. Mesurer selon x efface ce qu'on savait selon z : z⁺ puis x puis z redonne 50/50 (étape 2).
3. Un qubit est une flèche sur une sphère ; la mesure le projette sur l'un des deux pôles de l'axe choisi, avec la probabilité cos²(θ/2) (étape 3).
4. Deux spins intriqués donnent des résultats individuellement aléatoires mais corrélés ; la force de la corrélation dépasse la limite de toute théorie locale à variables cachées (CHSH : 2√2 contre 2), sans permettre d'envoyer un message (étape 4, moment fort).

Interdits : « le spin, c'est la particule qui tourne sur elle-même », « la mesure de l'un envoie un signal à l'autre », « l'intrication permet de communiquer plus vite que la lumière ».

## Réutilisation (ne pas reconstruire)

- Polarisation et polariseurs (même structure mathématique, avec θ/2 au lieu de θ) : future page 25 (`../fondations-optique/`, étape 4). Le dire explicitement : un photon à 45° et un spin à 90° obéissent à la même règle.
- Amplitudes, |ψ|², mesure qui efface l'interférence : future page 48 (`../fondations-quantique/`).
- Force sur un dipôle dans un champ non uniforme, aimant : future page 23 (`../fondations-magnetisme-induction/`).
- Corrélation, statistique, convergence : `../fondations-systemes-hasard/`.

## Moteur (à écrire et tester avant la page)

Bloc `/* SPIN-BEGIN */ … /* SPIN-END */`, objet `Spin`. Complexes et matrices 2 × 2 et 4 × 4 maison.

- **Spin ½** : états `ket(theta, phi)` (sphère de Bloch) ; matrices de Pauli ; `project(state, axis)` → probabilités des deux résultats et état après mesure ; `measure(state, axis, rng)` ; `blochVector(state)`.
- **Stern-Gerlach** : `sgBeam({n, axis, input, classical}, rng)` → positions d'impact sur l'écran : quantique (deux taches gaussiennes) ou modèle classique (moments orientés au hasard → traînée continue) ; `sgChain(devices, input, n, rng)` (appareils en série avec choix de la voie conservée).
- **Paires intriquées** : `singlet()` ; `measurePair(state, a, b, rng)` → (±1, ±1) ; `correlation(a, b, n, rng)` ; `chsh(angles, n, rng)` → S ; `localModel(strategy)` : une famille de modèles locaux à variables cachées (instructions fixées à la source, par exemple « spin classique orienté au hasard » et « table de réponses prédéfinies ») ; `localBound()` = 2 ; `marginals(...)` (vérification de l'absence de signal).

### Tests du moteur

1. `project` : préparé z⁺, mesuré selon un axe à θ : P(+) = cos²(θ/2) (θ = 0, 60°, 90°, 180° : 1, 0,75, 0,5, 0).
2. Après mesure, l'état est l'état propre obtenu ; deux mesures successives selon le même axe donnent toujours le même résultat.
3. Chaîne z (garder +) → x (garder +) → z : 50/50 à 1 % sur 10⁵ ; chaîne z (+) → z : 100 % +.
4. Stern-Gerlach : modèle quantique, deux pics séparés et rien entre eux ; modèle classique, distribution continue (uniforme en cos θ projetée).
5. Singulet : E(a, b) = −cos(a − b) à 1 % sur 10⁵ paires (5 angles).
6. CHSH avec a = 0°, a′ = 90°, b = 45°, b′ = 135° : |S| = 2√2 ≈ 2,83 à 1 % ; chaque modèle local : |S| ≤ 2 (à la fluctuation statistique près, sur 10⁵ paires).
7. Absence de signal : la fréquence de + chez Bob reste 1/2 quel que soit l'angle d'Alice (à 1 %).

## Code couleur

| Objet | Couleur et forme |
|---|---|
| résultat + / − | `--positif` / `--negatif` (petite flèche haut / bas sur la tache ou sur le compteur) |
| état préparé (flèche de Bloch) | `--accent` |
| axe de mesure de l'appareil | trait `--texte` à travers la sphère ou sur l'aimant |
| faisceau d'atomes | points `--texte` ; impacts : `--energie` puis blanc cassé |
| Alice / Bob | les deux côtés de la scène, appareils dessinés pareils, étiquettes neutres |
| prédiction locale / quantique | tireté `--texte-2` / trait `--accent` |

## Chapitre · Module 50 · Spin, mesure et intrication

### Étape 1 · Stern-Gerlach (moment fort)
- Scène : un four d'où sortent des atomes d'argent, un aimant à pôles de formes différentes (champ non uniforme), un écran. Bouton « Prédiction classique » : d'abord on montre ce qu'on attendrait d'aimants miniatures orientés au hasard (une traînée verticale continue) ; puis « Expérience » : les impacts s'accumulent en **deux taches** seulement. On peut tourner l'aimant : les deux taches tournent avec lui.
- Contrôles : orientation de l'aimant (angle), intensité du gradient, cadence ; bascule « Prédiction classique ».
- Panneau : nombre d'atomes, fraction en haut et en bas, écart entre les taches. Statuts : « Deux taches, jamais entre les deux : quelle que soit l'orientation de l'aimant, la mesure ne donne que deux résultats » (expérience de 1922 citée).
- Phrase-clé : « Le moment magnétique d'une particule de spin ½, mesuré dans n'importe quelle direction, ne donne que deux valeurs : + ou −. C'est le spin. »
- Note : faisceau idéal ; l'image « petite toupie » est signalée comme fausse.

### Étape 2 · Mesures successives
- Scène : une chaîne d'appareils de Stern-Gerlach qu'on assemble : chaque appareil a une orientation (z, x ou un angle libre) et l'on choisit la voie conservée (+, −, les deux recombinées). Des compteurs à chaque sortie.
- Contrôles : ajouter ou retirer un appareil (jusqu'à 4), orientation de chacun, voie conservée ; préréglages « z puis z », « z puis x », « z puis x puis z ».
- Panneau : fractions à chaque sortie, comparées à cos²(θ/2). Statuts : z puis z « Même axe, même résultat : 100 % » ; z puis x puis z « Le premier appareil avait trié les z⁺, et pourtant le troisième trouve 50/50 : mesurer selon x a effacé l'information selon z » ; renvoi : « Comme trois polariseurs (module 25) ».
- Phrase-clé : « Une mesure prépare un nouvel état. Mesurer dans une autre direction efface ce qu'on savait : les deux informations ne peuvent pas être connues ensemble. »
- Note : appareils idéaux, aucune perte.

### Étape 3 · Le qubit
- Scène : une sphère de Bloch qu'on tourne à la souris ; une flèche d'état qu'on oriente ; un appareil de mesure dont on choisit l'axe ; un histogramme des résultats sur n répétitions (on prépare n copies identiques). Après chaque mesure individuelle, la flèche saute sur un pôle de l'axe (animation) : c'est l'état après mesure.
- Contrôles : orientation de l'état (θ, φ), axe de mesure, nombre de copies.
- Panneau : P(+) et P(−) prédites, fréquences mesurées, angle entre l'état et l'axe. Statuts : état à l'équateur mesuré selon z « Pile ou face parfait : et pourtant l'état était parfaitement défini, simplement selon une autre direction » ; une seule copie « Une seule mesure ne dit presque rien de l'état : il faut beaucoup de copies ».
- Phrase-clé : « Un qubit est une flèche sur une sphère. Une mesure selon un axe donne + avec la probabilité cos²(θ/2), où θ est l'angle entre la flèche et l'axe, puis laisse l'état sur le pôle obtenu. »
- Note : spin isolé, sans décohérence ; ordinateurs quantiques seulement nommés.

### Étape 4 · Intrication et inégalités de Bell (moment fort)
- Scène : une source au centre émet des paires de spins dans l'état singulet ; à gauche Alice, à droite Bob, chacun avec un appareil dont il choisit l'angle. Chaque paire donne deux résultats ; une bande de résultats défile (++, +−, −+, −−). Un tableau à quatre cases (a, a′) × (b, b′) se remplit des corrélations ; S de CHSH s'affiche avec sa barre d'erreur, la limite locale 2 en tireté et 2√2 en `--accent`.
- Bascule « Théorie locale » : la source remplace les paires intriquées par des paires porteuses d'instructions fixées d'avance (choisir un des modèles locaux) ; on voit S rester sous 2. Bascule « Regarder seulement Bob » : ses résultats sont 50/50 quoi que fasse Alice.
- Contrôles : angles d'Alice (a, a′) et de Bob (b, b′), préréglage « angles optimaux », nombre de paires, bascules ci-dessus.
- Panneau : E(a, b) pour chaque couple, S, statistique de Bob seul. Statuts : quantique « S ≈ 2,83 : aucune règle fixée à la source ne fait mieux que 2 » ; Bob seul « Bob ne voit que du hasard : impossible de transmettre un message ainsi ». Mention : expériences sans faille de 2015 et prix Nobel 2022, cités dans l'explication.
- Phrase-clé : « Deux particules intriquées donnent des résultats aléatoires mais corrélés, plus fortement qu'aucune théorie locale à instructions préétablies ne le permet. On ne peut pas s'en servir pour envoyer un message. »
- Fin de planche (et de la carte), trois questions ouvertes : **Technologie** « Peut-on calculer avec des qubits ? » → seulement introduit (informatique quantique, Atlas) ; **Matière** « Pourquoi deux électrons ne peuvent-ils pas occuper le même état, et qu'est-ce que cela fait aux atomes et aux étoiles ? » → modules 28 et 44 (principe de Pauli, seulement nommé) ; **Retour** « Et maintenant ? » → l'accueil LABO, avec la carte des 50 modules complète.

## Micro-interactions de découverte

Four, faisceau, aimant de Stern-Gerlach, tache, appareil en chaîne, voie conservée, sphère de Bloch, flèche d'état, axe de mesure, source de paires, Alice, Bob, case du tableau CHSH, limite locale.

## `window.__labo` (en plus du socle)

`setMagnetAngle(deg)`, `classical(on)`, `fire(n)` (1) ; `setChain(devices)`, `presetChain(name)` (2) ; `setState(theta, phi)`, `setAxis(theta, phi)`, `measureN(n)` (3) ; `setAngles(a, a2, b, b2)`, `optimal()`, `pairs(n)`, `localTheory(on, kind)`, `bobOnly(on)` (4).

## Théorie (explication, module 50)

- Relations : \(|\psi\rangle = \cos\tfrac{\theta}{2}\,|{+}\rangle + e^{i\varphi}\sin\tfrac{\theta}{2}\,|{-}\rangle\) ; \(P(+) = \cos^2\tfrac{\theta}{2}\) ; singulet \(|\Psi^-\rangle = \tfrac{1}{\sqrt2}\left(|{+}{-}\rangle - |{-}{+}\rangle\right)\) ; \(E(a, b) = -\cos(a - b)\) ; \(S = E(a,b) - E(a,b') + E(a',b) + E(a',b')\), \(|S| \le 2\) (local) et \(|S|_{\max} = 2\sqrt2\) (quantique).
- Exemple chiffré possible : fraction transmise par une chaîne z⁺ → 60° → z ; ou calcul de S pour les angles optimaux.
- Pièges : « le spin est une rotation de la particule » ; « la mesure révèle une valeur qui existait avant selon tous les axes » ; « l'intrication transmet de l'information instantanément » ; « une corrélation forte prouve une influence » ; « avec un seul résultat, on connaît l'état ».
- Où ça resservira : 26 · 27 et 28 (couches électroniques, principe de Pauli), 23 (aimantation de la matière), 44 (dégénérescence), Atlas : informatique quantique, IRM (résonance de spin).
- Seulement introduit ici : spin 1 et photons, principe de Pauli, résonance magnétique, cryptographie et téléportation quantiques, décohérence.

## Honnêteté

Appareils idéaux ; spins isolés ; modèles locaux choisis parmi une famille simple (la borne de 2 vaut pour tous, la démonstration est dans l'explication) ; statistique finie, avec barres d'erreur.

## Hors champ

Formalisme complet des opérateurs, théorème de Kochen-Specker, interprétations, échappatoires expérimentales en détail.
