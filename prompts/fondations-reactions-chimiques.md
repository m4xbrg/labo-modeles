# Fondations · Réactions chimiques (module 30)

Dossier de sortie : `opus-sonnet/fondations-reactions-chimiques/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 30`, titre « Réactions : vitesse et *équilibre* ». Accent : `--accent: #ffb36b;` (orangé pâle). Budget : ≈ 0,8 ADN, **un chapitre de 4 étapes**.

Préalables conseillés : 05 (exponentielles), 07 (hasard, distributions), 17 · 18 (température, énergie des molécules), 28 · 29 (liaisons, mole). Elle prépare 31 (acide-base, redox), 34 (enzymes), 37 (cascades) et la réplication de l'ADN (planche 08, où les enzymes catalysent).

## Intention

À la fin, l'étudiant voit une réaction comme **une affaire de collisions assez énergiques**, et l'équilibre comme **deux réactions opposées qui vont à la même vitesse**. Intuitions à rendre évidentes, par ordre de priorité :

1. Seules les collisions qui ont assez d'énergie (et la bonne orientation) réagissent ; c'est une petite fraction, et cette fraction grimpe très vite avec la température (étape 1, moment fort).
2. Un catalyseur ouvre un autre chemin, plus bas ; il ne change ni le point de départ ni le point d'arrivée, donc ni l'énergie libérée ni l'équilibre (étape 3).
3. À l'équilibre, la réaction ne s'arrête pas : directe et inverse continuent à la même vitesse (étape 4, moment fort ; même idée que l'équilibre dynamique de la fondation 32).
4. Perturber un équilibre (ajouter, chauffer, comprimer) le déplace dans le sens qui absorbe en partie la perturbation : Le Chatelier se voit, il ne s'apprend pas par cœur (étape 4).
5. La vitesse dépend des concentrations : moins de réactifs, moins de rencontres (étape 2).

Interdits : « la réaction veut atteindre l'équilibre », « le catalyseur donne de l'énergie », « à l'équilibre, plus rien ne se passe ».

## Réutilisation (ne pas reconstruire)

- Distribution des vitesses, température comme agitation : `../07-matiere-chaleur/` (acte I). Reprendre l'histogramme des énergies et le style des particules.
- Décroissance exponentielle, demi-vie : `../fondations-systemes-hasard/`.
- Équilibre dynamique (flux nets nuls, traversées continues) : `../fondations-cellule-membrane/` (acte III). Citer dans la note de l'étape 4.
- Énergie de liaison, liaisons rompues et formées : `../fondations-molecules-mole/` (module 28).
- Enzymes comme catalyseurs : **ne pas** faire Michaelis-Menten ici (module 34). Une phrase et un lien vers la planche 08 (polymérase).

## Moteur (à écrire et tester avant la page)

Bloc `/* RXN-BEGIN */ … /* RXN-END */`, objet `Rxn`. R = 8,314 J/(mol·K).

- **Boîte réactive 2D** (étapes 1 à 3) : `boxInit({nA, nB, T, Ea, dH, seed})`, `boxStep(box, dt)` : disques durs, collisions élastiques ; une collision A + B réagit en C + D si l'énergie cinétique relative le long de la ligne des centres dépasse Ea (unités réduites) et si l'orientation tombe dans un cône (facteur stérique documenté) ; l'énergie ΔH est rendue (exothermique) ou prise (endothermique) aux produits ; thermostat optionnel. Compteurs : collisions, collisions réactives, par seconde.
- **Théorie** : `fracAbove(Ea, T, dim)` (fraction des collisions dont l'énergie le long de la ligne des centres dépasse Ea, dérivée pour la dimension de la boîte et documentée) ; `arrhenius(A, Ea, T)` ; `ratioT(Ea, T1, T2)`.
- **Cinétique moyenne** : `odeRate({order, k}, c0, t)` (ordres 1 et 2, solutions analytiques) ; `halfLife(order, k, c0)`.
- **Profil énergétique** : `profile({Ea, dH, EaCat})` → points pour tracer la courbe réactifs → état de transition → produits, avec ou sans catalyseur.
- **Équilibre** (étape 4) : `N2O4` : ΔH° = +57,2 kJ/mol, ΔS° documenté pour que Kp(298 K) ≈ 0,15 ; `Kp(T)` (van 't Hoff) ; `gillespie(state, {kf, kr, V}, rng)` (tirages stochastiques des événements N₂O₄ → 2 NO₂ et 2 NO₂ → N₂O₄) ; `eqSolve(T, P, n0)` → composition d'équilibre ; `Q(state)`.

### Tests du moteur

1. Boîte sans réaction : énergie cinétique totale conservée à 10⁻⁹ ; distribution des vitesses 2D (Maxwell-Boltzmann à deux dimensions) à 5 % après relaxation.
2. Fraction de collisions réactives mesurée = `fracAbove` à 5 % pour trois couples (Ea, T).
3. ln(k) linéaire en 1/T entre T et 3T (R² > 0,99) ; pente −Ea/R à 5 %.
4. `ratioT(50 kJ/mol, 298 K, 308 K)` = 1,92 ; abaisser Ea de 75 à 50 kJ/mol à 298 K multiplie k par 2,4 × 10⁴.
5. Premier ordre : t½ = ln 2/k indépendant de c₀ ; second ordre : t½ = 1/(k c₀).
6. Catalyseur : à T égale, ΔH et composition d'équilibre identiques avec et sans (étape 4 avec option catalyseur) ; seule la vitesse d'approche change.
7. Kp(298 K) = 0,15 ± 0,01 ; Kp augmente avec T (endothermique) ; à 350 K, la fraction de NO₂ à 1 bar est plus grande qu'à 298 K.
8. Gillespie : sur 50 graines, la moyenne de la composition à long terme = `eqSolve` à 2 % ; à l'équilibre, les nombres d'événements directs et inverses par seconde sont égaux à 5 % et **jamais nuls**.
9. Le Chatelier : après ajout de NO₂, Q > K et la recombinaison domine jusqu'au retour à Q = K ; réduire le volume de moitié déplace vers N₂O₄ ; chauffer déplace vers NO₂.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| réactif A / réactif B | lilas `#b9a3ff` / sable `#dcc29a` (les solutés de la série) |
| produits | `--accent` |
| collision réactive | éclat bref `--energie` ; collision non réactive : rien |
| énergie d'activation, état de transition | sommet de la courbe en `--energie` ; chemin catalysé tireté `--accent` |
| NO₂ / N₂O₄ | NO₂ brun-orangé `#c8763a` (il est réellement brun), N₂O₄ incolore : contour `--texte-2` ; teinte du gaz ∝ concentration de NO₂ |
| vitesse directe / inverse | flèches `--positif` / `--negatif` (même convention de sens que les flux de 32 : couleur = sens) |

## Chapitre · Module 30 · Réactions chimiques

### Étape 1 · Collisions et énergie d'activation (moment fort)
- Scène : la boîte 2D ; A et B s'agitent et se heurtent ; seules quelques collisions font un éclat et changent A + B en produits. À droite, l'histogramme des énergies de collision avec une ligne verticale « Ea » : la queue au-delà est coloriée. En haut, le profil d'énergie de la réaction, un point qui monte la pente à chaque collision et retombe s'il n'atteint pas le sommet.
- Contrôles : T (thermostat), Ea, bascule « Orientation exigée » (sans elle, plus de collisions réussissent).
- Panneau : collisions par seconde, collisions réactives par seconde, fraction réactive, vitesse de réaction. Statuts : « Sur cent collisions, quelques-unes seulement réagissent : celles de la queue de la distribution » ; quand on monte T de 10 % : « La température n'a pas beaucoup changé la moyenne, mais elle a gonflé la queue : la vitesse a presque doublé ».
- Phrase-clé : « Une réaction a lieu quand des molécules se heurtent avec assez d'énergie pour franchir la barrière d'activation. Chauffer augmente surtout la petite fraction de collisions assez énergiques. »
- Note : 2D, unités réduites, une seule réaction ; facteur stérique schématique.

### Étape 2 · Ce qui règle la vitesse
- Scène : trois boîtes miniatures côte à côte qui partent en même temps : concentration de A doublée, température plus haute, référence. Un graphe [A](t) pour chacune, superposé à la courbe moyenne (tiretée). Sous-graphe « ln k en fonction de 1/T » qui se remplit à chaque essai : les points s'alignent (droite d'Arrhenius).
- Contrôles : [A]₀, [B]₀, T. Bouton « Essai » (ajoute un point au graphe d'Arrhenius).
- Panneau : vitesse initiale, k, t½ (si un réactif est en grand excès : pseudo-premier ordre, le dire). Statut : « Deux fois plus de A : deux fois plus de rencontres avec B, deux fois plus vite ».
- Phrase-clé : « La vitesse augmente avec les concentrations (plus de rencontres) et, très fortement, avec la température (plus de rencontres assez énergiques) : k = A e^(−Ea/RT). »
- Note : la loi de vitesse se mesure, elle ne se lit pas toujours dans l'équation (réactions en plusieurs étapes : seulement mentionné).

### Étape 3 · La catalyse
- Scène : le profil d'énergie, avec un deuxième chemin plus bas qui apparaît quand on ajoute un catalyseur (surface ou molécule dessinée dans la boîte, sur laquelle A et B se fixent un instant). La boîte avec et sans catalyseur côte à côte, même T.
- Contrôles : catalyseur (présent / absent, quantité), abaissement de Ea, T. Préréglage « Eau oxygénée : sans catalyseur / avec du dioxyde de manganèse / avec de la catalase (renvoi au module 34) » avec des bulles d'O₂ qui sortent à la vitesse calculée.
- Panneau : Ea et Ea catalysée, k, rapport des vitesses, ΔH (inchangé), catalyseur consommé : 0. Statut : « Le catalyseur ressort intact ; le départ et l'arrivée n'ont pas bougé, seulement le col à franchir ».
- Phrase-clé : « Un catalyseur offre un chemin de plus basse énergie d'activation. Il accélère la réaction dans les deux sens, sans changer l'énergie libérée ni l'équilibre. »
- Note : abaissements de Ea illustratifs, ordres de grandeur réels cités dans l'explication.

### Étape 4 · L'équilibre dynamique et Le Chatelier (moment fort)
- Scène : un piston de verre rempli de N₂O₄ et de NO₂ ; la teinte brune suit la quantité de NO₂ ; une loupe montre les molécules qui se dissocient et se recombinent (tirages de Gillespie), chaque événement en petit éclat. Deux compteurs « → dissociations/s » et « ← recombinaisons/s » qui deviennent égaux sans jamais tomber à zéro.
- Contrôles : T (bain chaud / froid, curseur), volume du piston (pousser / tirer), bouton « Injecter du NO₂ », bascule catalyseur (l'équilibre est atteint plus vite, au même endroit).
- Panneau : quantités, Q, K, sens d'évolution (Q < K → vers la droite, Q > K → vers la gauche), vitesses directe et inverse. Enregistreur : [NO₂](t), [N₂O₄](t), et les deux vitesses. Statuts : à l'équilibre « Q = K : autant de dissociations que de recombinaisons, et pourtant ça ne s'arrête jamais » ; après chauffage « La couleur fonce : chauffer favorise la dissociation, qui absorbe de la chaleur » ; après compression « Moins de molécules prennent moins de place : l'équilibre se déplace vers N₂O₄ ».
- Phrase-clé : « À l'équilibre, la réaction directe et la réaction inverse vont à la même vitesse : Q = K. Perturbé, l'équilibre se déplace dans le sens qui absorbe en partie la perturbation. »
- Fin de planche, trois questions ouvertes : **Ions** « Que se passe-t-il quand la particule échangée est un proton, ou un électron ? » → module 31 ; **Vivant** « Comment une cellule fait-elle tourner des milliers de réactions à 37 °C ? » → module 34 ; **Énergie** « Qu'est-ce qui décide de quel côté penche K ? » → module 18 et explication (énergie libre, seulement introduite).

## Micro-interactions de découverte

Molécule A, B, produit, collision réactive, histogramme et queue, Ea, état de transition, catalyseur, bulle, piston, NO₂, N₂O₄, compteurs directs et inverses, Q, K.

## `window.__labo` (en plus du socle)

`setT(T)`, `setEa(E)`, `orientation(on)` (1) ; `setConc(a, b)`, `trial()` (2) ; `catalyst(on, dEa)`, `presetH2O2(kind)` (3) ; `setTeq(T)`, `setVolume(V)`, `injectNO2(n)`, `eqCatalyst(on)` (4).

## Théorie (explication, module 30)

- Relations : \(k = A\,e^{-E_a/RT}\) ; \(\ln\dfrac{k_2}{k_1} = \dfrac{E_a}{R}\left(\dfrac{1}{T_1} - \dfrac{1}{T_2}\right)\) ; \(v = k[A][B]\) (loi de vitesse mesurée) ; \(t_{1/2} = \ln 2/k\) (premier ordre) ; \(K = \dfrac{[\text{NO}_2]^2}{[\text{N}_2\text{O}_4]}\) (forme générale \(K = \prod [X_i]^{\nu_i}\)) ; \(Q\) comparé à \(K\).
- Exemple chiffré possible : règle des « +10 °C, vitesse doublée » vérifiée pour Ea = 50 kJ/mol ; ou facteur d'accélération d'une catalase.
- Pièges : « un catalyseur déplace l'équilibre » ; « à l'équilibre les concentrations sont égales » ; « à l'équilibre la réaction s'arrête » ; « exothermique = rapide » ; « la température augmente la vitesse parce que les molécules se heurtent plus souvent » (surtout parce que plus de collisions franchissent Ea) ; lire l'ordre dans les coefficients.
- Où ça resservira : 31 (Ka, équilibres acido-basiques), 34 (enzymes, couplage), 37 (cascades), 32 (équilibre dynamique), 44 (fusion : barrière coulombienne et effet tunnel, 49), planche 08 (polymérase).
- Seulement introduit ici : énergie libre de Gibbs et lien ΔG° = −RT ln K, mécanismes en plusieurs étapes, cinétique enzymatique (34), réactions oscillantes.

## Honnêteté

Boîte 2D en unités réduites ; facteur stérique schématique ; NO₂ et N₂O₄ en gaz parfaits ; nombres de molécules dérisoires, tirages stochastiques ; abaissements de Ea par catalyse illustratifs.

## Hors champ

Thermodynamique chimique complète, électrochimie (31), cinétique enzymatique (34), photochimie, chimie des radicaux.
