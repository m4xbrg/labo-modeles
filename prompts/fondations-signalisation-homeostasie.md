# Fondations · Signalisation et homéostasie (module 37)

Dossier de sortie : `opus-sonnet/fondations-signalisation-homeostasie/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 37`, titre « Signaux et *équilibres* du vivant ». Accent : `--accent: #f0c27a;` (miel pâle). Budget : ≈ 0,8 ADN, **un chapitre de 4 étapes**.

Préalables conseillés : 04 (systèmes, rétroaction), 30 (équilibre, liaison), 32 (membrane), 34 (enzymes), 35 (gènes qui s'allument). Elle ferme la branche F et prépare la physiologie (38, 39), le diabète, la fièvre, la coagulation.

## Intention

À la fin, l'étudiant voit une cellule et un organisme comme **des systèmes qui captent des signaux, les amplifient et corrigent leurs écarts par des boucles de rétroaction**. Intuitions à rendre évidentes, par ordre de priorité :

1. Une molécule signal ne transporte pas d'instruction : elle se lie à un récepteur, et c'est la forme du récepteur, puis ce que la cellule a « câblé » derrière, qui décident de la réponse (étape 1).
2. Une cascade amplifie : chaque enzyme activée en active beaucoup d'autres ; quelques hormones suffisent à mobiliser des millions de molécules, en quelques secondes (étape 2, moment fort).
3. L'homéostasie est une **rétroaction négative** : un écart à la consigne déclenche une réponse qui le réduit ; la glycémie revient vers 5 mmol/L après un repas (étape 3, moment fort).
4. Une boucle trop lente ou trop forte oscille ou s'emballe ; une rétroaction positive ne régule pas, elle déclenche (tout ou rien) (étape 4).

Interdits : « l'hormone dit à la cellule de… », « le corps veut garder sa température ». On écrit : « la liaison de l'hormone active… », « un écart déclenche… ».

## Réutilisation (ne pas reconstruire)

- Rétroaction positive et négative, état, taux de changement : `../fondations-systemes-hasard/` (module 04). Ici, on les applique au vivant, avec des délais.
- Liaison, équilibre, saturation : `../fondations-reactions-chimiques/` (module 30) et `../fondations-energie-biologique/` (Michaelis-Menten, module 34). La courbe de liaison a la même forme : le dire.
- Membrane et récepteurs dans la bicouche : `../fondations-cellule-membrane/`.
- Gènes qui s'allument : `../fondations-information-genetique/` (module 35, étape 4).
- Stabilité d'un équilibre, oscillations : renvoi au module 08 (prévu) et à `../fondations-oscillations-ondes/` (amortissement).

## Moteur (à écrire et tester avant la page)

Bloc `/* SIG-BEGIN */ … /* SIG-END */`, objet `Sig`.

- **Liaison** : `occupancy(L, Kd, n)` (Hill, n = 1 par défaut) ; `bindingSim({nR, L, kon, koff, seed}, dt)` : simulation stochastique de récepteurs à la surface d'une cellule et de ligands qui diffusent ; `doseResponse(Lrange, Kd, Emax, EC50)`.
- **Cascade** : `cascade({stages, gain, kOff, input, t})` : chaque étage active le suivant avec un gain et se désactive avec un taux ; renvoie les populations actives de chaque étage au cours du temps (ODE) ; `amplification(stages, gain)` ; exemple adrénaline → glycogène phosphorylase avec ordres de grandeur documentés.
- **Glycémie** : modèle minimal glucose-insuline (type Bergman, documenté) : `glucoseStep(s, {meal, SI, beta, Gb, delay}, dt)` avec G en mmol/L, insuline en unités arbitraires ; `meal(gCarbs)` (apport de glucose étalé sur 30 à 60 min) ; préréglages « sain », « résistance à l'insuline » (SI réduit), « production d'insuline réduite » (β réduit).
- **Boucles** : `delayedFeedback({k, tau, x0}, t)` (équation à retard x' = −k x(t − τ), intégration par méthode des pas) ; `thermostat({setpoint, gain, delay, noise}, dt)` (température corporelle : frisson, vasoconstriction, sudation, consigne déplaçable = fièvre) ; `positiveSwitch({basal, gain, n, K}, x0, t)` (rétroaction positive à seuil, bistable).

### Tests du moteur

1. `occupancy` : 50 % à L = Kd ; 10 % à Kd/9 ; 90 % à 9 Kd (facteur 81 entre 10 et 90 %) ; Hill n = 4 resserre ce facteur à 3.
2. `bindingSim` : occupation moyenne à l'équilibre = `occupancy` à 5 % (10 graines) ; les liaisons et déliaisons continuent à l'équilibre, à des taux égaux.
3. `cascade` : 4 étages de gain 100 → amplification 10⁸ ; supprimer la désactivation (kOff = 0) → le signal ne s'éteint plus après l'arrêt de l'entrée.
4. Glycémie « sain » : à jeun 5,0 mmol/L ; après 75 g de glucides, pic entre 7 et 9 mmol/L, retour à moins de 10 % de la base en moins de 3 h ; « résistance » : pic plus haut et retour plus lent.
5. Retard : x' = −k x(t − τ) converge sans osciller si kτ < 1/e, oscille amorti si 1/e < kτ < π/2, diverge en oscillant si kτ > π/2 (trois cas testés).
6. Thermostat : consigne 37 °C tenue à ±0,3 °C avec bruit ; consigne déplacée à 39 °C (fièvre) : frissons tant que T < consigne.
7. Commutateur : deux états stables pour les paramètres par défaut ; une impulsion au-dessus du seuil fait basculer, et l'état reste après la fin de l'impulsion (mémoire).

## Code couleur

| Objet | Couleur et forme |
|---|---|
| ligand, hormone | petites formes `--accent` (chaque ligand a sa forme : la forme dit la spécificité) |
| récepteur | protéine dans la membrane, contour `--texte`, poche à la forme du ligand ; activé : lueur `--accent` |
| molécules activées dans la cascade | `--energie` (vives), inactives : `--texte-2` |
| consigne | ligne tiretée `--texte` ; écart : aire `--positif` (au-dessus) ou `--negatif` (au-dessous) |
| glucose / insuline / glucagon | lilas `#b9a3ff` (hexagone, code de 07 et 32) / `--accent` / sable `#dcc29a` |
| rétroaction négative / positive | flèche de boucle avec « − » `--negatif` / « + » `--positif` |

## Chapitre · Module 37 · Signalisation et homéostasie

### Étape 1 · Ligand et récepteur
- Scène : une cellule vue en coupe partielle, sa membrane hérissée de récepteurs ; des ligands diffusent dans le milieu, se lient, se détachent. Les récepteurs occupés s'allument. Trois types de ligands de formes différentes : seul celui qui a la bonne forme se lie (spécificité) ; un « leurre » de forme proche se lie sans activer (antagoniste).
- Contrôles : concentration du ligand (curseur log), affinité (Kd), bouton « Ajouter un antagoniste ».
- Panneau : fraction de récepteurs occupés, liaisons et déliaisons par seconde, courbe dose-réponse sur échelle log avec le point courant. Statuts : « À L = Kd, la moitié des récepteurs sont occupés » ; « Pour passer de 10 % à 90 % de réponse, il faut 81 fois plus de ligand » ; antagoniste « Le leurre occupe la poche sans rien déclencher ».
- Phrase-clé : « Un signal agit en se liant à un récepteur qui a la forme complémentaire. La réponse dépend de la fraction de récepteurs occupés, qui sature quand le signal devient abondant. »
- Note : liaison réversible simple ; récepteurs immobiles ; même forme mathématique que Michaelis-Menten (module 34).

### Étape 2 · Cascade et amplification (moment fort)
- Scène : une hormone (adrénaline) se lie à un récepteur ; derrière la membrane, une cascade en étages : chaque molécule activée en active plusieurs de l'étage suivant, dessinées en gerbe qui s'élargit (arbre), jusqu'à la libération de glucose depuis le glycogène. Un compteur par étage, en notation scientifique.
- Contrôles : nombre d'étages (1 à 5), gain par étage (2 à 100), bascule « Éteindre les signaux » (phosphatases, dégradation) ; bouton « Une seule hormone ».
- Panneau : molécules actives par étage, amplification totale, délai jusqu'à la réponse, durée de la réponse. Statuts : « Une hormone, quatre étages de gain 100 : cent millions de molécules mobilisées » ; sans extinction « La réponse ne s'arrête plus : un signal doit aussi pouvoir s'éteindre ».
- Phrase-clé : « Une cascade multiplie le signal à chaque étage : quelques hormones suffisent à mobiliser des millions de molécules, en quelques secondes. Chaque étage doit aussi s'éteindre, sinon la cellule ne peut plus écouter. »
- Note : gains et nombre d'étages illustratifs ; ordres de grandeur réels dans l'explication.

### Étape 3 · Rétroaction négative : la glycémie (moment fort)
- Scène : un schéma d'organisme sobre : intestin, sang (jauge de glycémie au centre avec la bande normale 4 à 6 mmol/L), pancréas, foie, muscles. Un repas fait monter le glucose ; le pancréas libère de l'insuline ; foie et muscles absorbent le glucose ; la jauge redescend. En jeûne, le glucagon fait l'inverse. La boucle est dessinée en flèches avec un « − ».
- Contrôles : bouton « Repas » (glucides en g), préréglage de la personne (« sain », « résistance à l'insuline », « production d'insuline réduite »), bouton « Course » (consommation musculaire).
- Panneau : glycémie, insuline, glucagon, écart à la consigne ; enregistreur sur 6 h. Statuts : sain « La glycémie revient à sa valeur de départ en deux à trois heures : l'écart déclenche la réponse qui le réduit » ; résistance « Même repas, même insuline produite, mais les cellules y répondent moins : le retour est lent, le pic plus haut ».
- Phrase-clé : « L'homéostasie est une rétroaction négative : un écart à la consigne déclenche une réponse qui le réduit. Le corps ne maintient pas une valeur fixe : il corrige sans cesse des écarts. »
- Note : modèle minimal à deux variables ; valeurs pour un adulte, sans valeur de diagnostic (le dire).

### Étape 4 · Quand la boucle déraille
- Scène : deux panneaux. À gauche, un thermostat corporel (température, consigne, effecteurs : frisson, sudation) avec un **délai** réglable dans la boucle ; trop de délai et trop de gain → la température dépasse, revient, redépasse : oscillations. Bouton « Fièvre » : la consigne monte, on frissonne alors qu'on a déjà 38 °C. À droite, une rétroaction positive (commutateur) : sous le seuil, rien ; au-dessus, la réponse s'emballe jusqu'au maximum et y reste ; exemples nommés : le pic d'hormone de l'ovulation, la coagulation (39), le potentiel d'action (33).
- Contrôles : délai, gain (thermostat) ; amplitude d'une impulsion (commutateur).
- Panneau : type de comportement (retour direct, oscillation amortie, oscillation croissante) avec la carte kτ et le point courant ; état du commutateur. Statuts : « Une boucle trop lente corrige un écart qui n'existe plus : elle oscille » ; commutateur « La rétroaction positive ne régule pas : elle décide, tout ou rien, et se souvient ».
- Phrase-clé : « Une rétroaction négative stabilise si elle n'est ni trop lente ni trop forte ; sinon elle oscille. Une rétroaction positive amplifie l'écart : elle sert à déclencher, pas à maintenir. »
- Fin de planche, trois questions ouvertes : **Organes** « Comment le cœur et les poumons ajustent-ils leur débit à l'effort ? » → module 38 ; **Défense** « Comment le corps reconnaît-il un intrus, et pourquoi la coagulation s'arrête-t-elle ? » → module 39 ; **Instabilité** « Une boucle peut-elle devenir chaotique ? » → module 08.

## Micro-interactions de découverte

Ligand, récepteur, poche, antagoniste, étage de la cascade, molécule active, glycogène, jauge de glycémie, pancréas, insuline, glucagon, foie, consigne, délai, effecteur, commutateur.

## `window.__labo` (en plus du socle)

`setL(L)`, `setKd(K)`, `antagonist(on)` (1) ; `setStages(n)`, `setGain(g)`, `shutoff(on)`, `oneHormone()` (2) ; `meal(g)`, `setProfile(p)`, `run()` (3) ; `setDelay(t)`, `setLoopGain(k)`, `fever(on)`, `pulse(a)` (4).

## Théorie (explication, module 37)

- Relations : \(\theta = \dfrac{[L]}{[L] + K_d}\) (et Hill \(\theta = \dfrac{[L]^n}{[L]^n + K^n}\)) ; amplification \(A = g^{\,n}\) ; rétroaction négative \(\dfrac{\dd x}{\dd t} = -k\,(x - x^*)\) et retour exponentiel ; avec retard \(\dfrac{\dd x}{\dd t} = -k\,x(t - \tau)\), oscillations dès que \(k\tau \gt 1/e\), instabilité au-delà de \(\pi/2\).
- Exemple chiffré possible : quantité de glucose libérée par le foie sous l'effet de l'adrénaline (amplification), ou glycémie après un repas de 75 g de glucides (volume de distribution du glucose ≈ 15 L).
- Pièges : « l'hormone porte l'ordre » ; « plus de signal = toujours plus de réponse » (saturation) ; « l'homéostasie = constance » (correction permanente d'écarts) ; « la fièvre est un dérèglement » (consigne déplacée) ; « la rétroaction positive est bonne, la négative mauvaise » ; « le diabète de type 2 = pas d'insuline ».
- Où ça resservira : 38 (pression artérielle, rythme cardiaque), 39 (coagulation, inflammation), 33 (canaux ouverts par des ligands), 35 (gènes allumés par des signaux), 08 (stabilité et chaos), 41 (populations régulées).
- Seulement introduit ici : seconds messagers en détail, récepteurs nucléaires, système nerveux autonome, rythmes circadiens.

## Honnêteté

Liaison réversible simple ; cascade à gains constants ; modèle minimal de la glycémie, sans valeur médicale ; thermostat linéaire à retard ; commutateur abstrait.

## Hors champ

Endocrinologie détaillée, pharmacologie, diabète clinique, immunologie (39), neurosciences (33).
