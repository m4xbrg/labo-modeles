# Fondations · Populations, réseaux et émergence (modules 41 et 42)

Dossier de sortie : `opus-sonnet/fondations-populations-emergence/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 41 · 42`, titre « Du local au *collectif* ». Accent : `--accent: #cbd67a;` (olive pâle, la teinte du domaine H de l'accueil). Budget : ≈ 1,2 ADN, **deux chapitres : 41 (4 étapes) et 42 (4 étapes)**.

Elle termine la branche H ouverte par *Évolution et génétique des populations* (`../fondations-evolution-populations/`, module 40), qui annonce 41 et 42 en fin de planche (grille mélangée ou par voisinage). Elle absorbe une dizaine d'idées du groupe 8 de l'Atlas (épidémie SIR, prédateur-proie, compétition, Game of Life, automates cellulaires, trafic, avalanches, propagation sur réseau).

Préalables conseillés : 04 (systèmes dynamiques, rétroaction), 05 (exponentielle, logistique), 07 (hasard, distributions), 40 (populations).

## Intention

À la fin, l'étudiant sait que **des règles simples entre individus produisent des comportements collectifs** : des cycles de proies et de prédateurs, une épidémie qui s'éteint avant d'avoir touché tout le monde, des planeurs dans une grille, des bancs de poissons, des avalanches de toutes tailles, des bouchons sans cause. Intuitions à rendre évidentes, par ordre de priorité :

1. Une épidémie croît tant que chaque cas en produit plus d'un autre ; elle culmine quand les susceptibles se raréfient, et s'arrête **avant** d'avoir touché tout le monde ; vacciner au-delà de 1 − 1/R₀ l'empêche de démarrer (étape 3, moment fort).
2. Deux populations couplées (proies et prédateurs) oscillent, décalées d'un quart de cycle (étape 2).
3. Sur un réseau, qui est connecté à qui compte autant que le nombre de contacts : quelques nœuds très connectés accélèrent la propagation, et les vacciner en priorité est très efficace (étape 4).
4. Des règles purement locales, sans chef ni plan, produisent des structures globales : planeurs, bancs, bouchons qui reculent (étapes 5, 6 et 8, moment fort à l'étape 6).
5. Certains systèmes s'organisent d'eux-mêmes au bord de l'instabilité : petites et grandes avalanches suivent la même loi (étape 7).

Interdits : « le banc de poissons décide », « le virus veut infecter », « l'épidémie s'arrête parce que le virus s'épuise ».

## Réutilisation (ne pas reconstruire)

- Logistique, rétroaction, exponentielle : `../fondations-systemes-hasard/` (modules 04, 05). L'étape 1 commence là où elle s'arrête.
- Grille spatiale, voisinage local contre mélange : `../fondations-evolution-populations/` (étape de la grille, `gridStep`). Reprendre son rendu de grille.
- Stabilité et cycles : futur module 08 (`../fondations-chaos/`), seulement renvoyé.
- Immunité collective : future page 39 (`../fondations-immunite-coagulation/`, étape 3), qui l'introduit ; ici, sa version sur réseau.
- Distributions, loi de puissance et échelle log-log : `../fondations-langage/` (graphiques) et `../fondations-systemes-hasard/`.

## Moteur (à écrire et tester avant la page)

Bloc `/* EMG-BEGIN */ … /* EMG-END */`, objet `Emg`. Hasard par générateur à graine.

- **Populations (ODE, RK4)** : `logistic`, `competition({r1, r2, K1, K2, a12, a21})`, `lotkaVolterra({a, b, c, d})` (avec option de capacité limite pour les proies), `sir({beta, gamma, N, vacc})` ; `finalSize(R0)` ; `peakS(R0)` = N/R₀.
- **Version agents** : `agentsSIR({N, contacts, beta, gamma}, rng)` (mélange homogène) pour montrer le bruit sur les petites populations.
- **Réseaux** : `lattice(n, k)`, `smallWorld(n, k, p)` (Watts-Strogatz), `scaleFree(n, m)` (Barabási-Albert), `degreeDistribution(g)`, `pathLength(g)`, `clustering(g)` ; `sirOnNetwork(g, {beta, gamma, seeds, vaccinated}, rng)` ; `vaccinate(g, fraction, strategy: 'random'|'hubs')`.
- **Automates** : `life(grid, W, H)` (règle B3/S23, bords toriques) ; patrons (planeur, clignotant, canon de Gosper).
- **Essaim** : `boidsStep(boids, {sep, ali, coh, radius, vmax}, dt)` ; paramètre d'ordre (alignement moyen).
- **Tas de sable** : `sandpileAdd(grid, i, j)` → taille de l'avalanche (règle de Bak-Tang-Wiesenfeld, seuil 4, bords ouverts) ; `avalancheStats(sizes)` (histogramme log-log, pente).
- **Trafic** : `nagelSchreckenberg(road, {vmax, p}, rng)` (route circulaire, cellules) ; `fundamentalDiagram(densities)` → débit en fonction de la densité.

### Tests du moteur

1. Compétition : coexistence stable si a12 < K1/K2 et a21 < K2/K1 ; exclusion sinon (deux cas testés).
2. Lotka-Volterra sans capacité limite : la quantité conservée (intégrale première) reste constante à 10⁻⁶ sur 20 cycles ; le pic des prédateurs suit celui des proies d'environ un quart de période.
3. SIR : `finalSize(2)` = 0,797, `finalSize(3)` = 0,940 ; le pic des infectés a lieu quand S = N/R₀ (à 1 %) ; avec une couverture vaccinale ≥ 1 − 1/R₀, le nombre d'infectés ne croît pas.
4. SIR en agents : la moyenne sur 50 graines rejoint l'ODE à 5 % pour N = 10 000 ; pour N = 50, une fraction notable des épidémies s'éteint d'elle-même au début.
5. Réseaux : Watts-Strogatz avec p = 0,01 à 0,1 → longueur moyenne des chemins proche de celle d'un réseau aléatoire, agrégation proche de celle du réseau régulier ; Barabási-Albert : distribution des degrés en loi de puissance de pente ≈ −3.
6. Vaccination ciblée des nœuds les plus connectés (10 %) sur un réseau sans échelle : taille finale nettement inférieure (au moins deux fois) à la vaccination au hasard de 10 %.
7. Jeu de la vie : le planeur se retrouve identique, décalé d'une case en diagonale, après 4 générations ; le clignotant a une période 2.
8. Boids : paramètre d'ordre initial ≈ 0 (directions au hasard), > 0,8 après 500 pas avec les paramètres par défaut.
9. Tas de sable : nombre total de grains conservé hors bords ; histogramme des tailles d'avalanches linéaire en log-log sur au moins deux décades.
10. Trafic : avec p = 0 et faible densité, aucun bouchon ; avec p = 0,3, des bouchons apparaissent et reculent ; le diagramme fondamental monte puis redescend.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| proies / prédateurs | sable `#dcc29a` / `--positif` |
| espèce 1 / espèce 2 (compétition) | `--accent` / lilas `#b9a3ff` |
| S, I, R | `--texte-2` / `--positif` / `--negatif` (guéris immunisés) ; vaccinés : contour `--negatif` |
| nœuds et liens d'un réseau | points `--texte`, liens `--trait` ; nœuds très connectés plus gros |
| cellules vivantes (jeu de la vie) | `--accent` ; naissances : éclat bref `--energie` |
| boids | petits triangles `--texte`, orientés |
| grains de sable, avalanche | niveaux en luminance ; avalanche en cours : `--energie` |
| voitures | petits rectangles `--texte` ; à l'arrêt : `--positif` |

## Chapitre 1 · Module 41 · Populations et propagation sur réseaux

### Étape 1 · Croître et se concurrencer
- Scène : un pré avec deux espèces (agents dessinés, densité ∝ effectif) ; à côté, le plan de phase N₁–N₂ avec les deux isoclines et la trajectoire. On part de la logistique d'une seule espèce (rappel de la fondation 04), puis on ajoute la seconde.
- Contrôles : coefficients de compétition a12 et a21, rapport des capacités K1/K2.
- Panneau : N₁, N₂, issue prévue (coexistence ou exclusion de l'une) et issue observée. Statuts : « Chaque espèce se gêne plus elle-même qu'elle ne gêne l'autre : elles coexistent » ; sinon « L'une finit par éliminer l'autre, sans combat : elle consomme simplement mieux la ressource ».
- Phrase-clé : « Deux populations qui partagent une ressource coexistent seulement si chacune se limite davantage elle-même qu'elle ne limite l'autre. »
- Note : modèle de Lotka-Volterra de compétition, populations homogènes.

### Étape 2 · Proies et prédateurs
- Scène : lièvres et lynx sur un même territoire (agents) ; courbes N(t) des deux, et plan de phase où la trajectoire tourne en boucle. Bascule « Données historiques » : un graphique de démonstration inspiré des fourrures de la Compagnie de la Baie d'Hudson, cycle de ≈ 10 ans (le dire comme illustration).
- Contrôles : taux de croissance des proies, efficacité des prédateurs, bascule « Capacité limite des proies » (les cycles s'amortissent vers un équilibre).
- Panneau : effectifs, période des cycles, décalage entre les pics. Statut : « Les prédateurs culminent après les proies : ils ont besoin d'elles pour se multiplier, et ils les font décliner ».
- Phrase-clé : « Deux populations couplées par la prédation oscillent : les proies augmentent, puis les prédateurs, puis les proies diminuent, puis les prédateurs. »
- Note : modèle de Lotka-Volterra, sans espace ni hasard ; les vrais cycles dépendent aussi de la végétation.

### Étape 3 · Une épidémie (moment fort)
- Scène : une population de 400 personnes (points) qui se mélangent ; un cas initial ; les infectés colorent leurs contacts selon β, guérissent selon γ. Courbes S, I, R en dessous ; une ligne horizontale marque S = N/R₀ (le pic arrive quand S la croise). Bascule « Version équations » (courbes lisses de l'ODE superposées).
- Contrôles : R₀ (0,5 à 6), durée de l'infection, couverture vaccinale ; bouton « Nouveau départ ».
- Panneau : R₀, R effectif (R₀ × S/N), pic d'infectés et date du pic, fraction finale infectée, seuil d'immunité collective. Statuts : « Chaque cas en produit plus d'un autre : croissance exponentielle » ; au pic « Les susceptibles se raréfient : R effectif passe sous 1 » ; à la fin « Il reste des gens jamais infectés : l'épidémie s'est éteinte faute de nouvelles cibles » ; vaccination au-dessus du seuil « Plus d'épidémie possible ».
- Phrase-clé : « Une épidémie grandit tant que chaque cas en produit plus d'un ; elle culmine quand les susceptibles se raréfient. Au-delà d'une couverture de 1 − 1/R₀, elle ne peut plus démarrer. »
- Note : modèle SIR, mélange homogène, immunité permanente.

### Étape 4 · Réseaux et cascades
- Scène : un réseau de 300 nœuds dessiné par un placement par forces ; trois structures au choix : régulier (voisins seulement), petit monde (quelques raccourcis), sans échelle (quelques nœuds très connectés). Une épidémie part d'un nœud ; on voit la vague se propager le long des liens. Histogramme des degrés à côté.
- Contrôles : structure, probabilité de raccourci p (petit monde), vaccination 10 % « au hasard » ou « les plus connectés ».
- Panneau : degré moyen, longueur moyenne des chemins, agrégation, taille finale, vitesse de propagation. Statuts : petit monde « Quelques raccourcis suffisent : tout le monde est à quelques pas de tout le monde » ; vaccination des plus connectés « Même nombre de doses, épidémie bien plus petite : on a coupé les autoroutes ».
- Phrase-clé : « Sur un réseau, la structure des contacts compte autant que leur nombre : quelques raccourcis rendent le monde petit, quelques nœuds très connectés propagent tout. »
- Note : réseaux synthétiques ; un réseau social réel est seulement cité.

## Chapitre 2 · Module 42 · Émergence

### Étape 5 · Le jeu de la vie
- Scène : une grille ; chaque cellule vit ou meurt selon ses 8 voisines (règle affichée en petit : naissance à 3, survie à 2 ou 3). L'étudiant dessine des cellules à la souris ou place des patrons ; la grille évolue. Un planeur traverse l'écran ; un canon de Gosper en émet régulièrement.
- Contrôles : dessin, patrons (planeur, clignotant, canon, aléatoire 30 %), vitesse, pas à pas.
- Panneau : génération, cellules vivantes, période détectée si cycle. Statut sur un planeur : « Aucune règle ne parle de mouvement, et pourtant cette forme avance d'une case en diagonale toutes les quatre générations ».
- Phrase-clé : « Des règles locales très simples suffisent à produire des structures qui se déplacent, se reproduisent ou calculent. Rien dans les règles ne les décrit : elles émergent. »
- Note : grille torique.

### Étape 6 · L'essaim (moment fort)
- Scène : 200 boids (triangles) qui suivent trois règles locales : s'écarter des trop proches, s'aligner sur les voisins, se rapprocher du groupe. Un prédateur (curseur de la souris) les fait s'ouvrir et se refermer. Paramètre d'ordre (alignement moyen) en courbe.
- Contrôles : poids de séparation, d'alignement et de cohésion (trois curseurs), rayon de perception (bascule de préréglages).
- Panneau : alignement moyen, nombre de groupes, rayon. Statuts : alignement à zéro « Sans alignement, un essaim désordonné » ; préréglage par défaut « Personne ne mène le banc : chacun regarde seulement ses voisins ».
- Phrase-clé : « Un banc de poissons ou une nuée d'étourneaux n'ont pas de chef : chaque individu suit quelques règles locales, et l'ordre collectif émerge. »
- Note : modèle de Reynolds (1987), en 2D.

### Étape 7 · Le tas de sable
- Scène : une grille vue de dessus ; on laisse tomber des grains un à un au hasard (ou au centre) ; une case qui atteint 4 grains en donne un à chacune de ses voisines, ce qui peut en faire déborder d'autres : avalanche. Histogramme log-log des tailles d'avalanches qui se remplit.
- Contrôles : vitesse d'ajout, lieu d'ajout (hasard / centre), bouton « 10 000 grains d'un coup ».
- Panneau : grains sur la grille, taille de la dernière avalanche, pente de l'histogramme. Statuts : « La plupart des grains ne déclenchent rien ; quelques-uns déclenchent une avalanche qui traverse toute la grille. Toutes les tailles suivent la même loi » ; « Personne n'a réglé le tas : il s'est mis de lui-même au bord de l'instabilité ».
- Phrase-clé : « Certains systèmes s'organisent d'eux-mêmes dans un état critique, où un petit événement peut déclencher une réponse de n'importe quelle taille, selon une loi de puissance. »
- Note : modèle de Bak, Tang et Wiesenfeld ; les vrais tas de sable ne s'y conforment pas toujours (le dire).

### Étape 8 · Les bouchons fantômes
- Scène : une route circulaire avec des voitures (automate de Nagel-Schreckenberg) ; diagramme espace-temps qui défile en dessous (chaque ligne est un instant) : les bouchons y apparaissent comme des bandes qui **reculent** alors que les voitures avancent. À côté, le diagramme fondamental (débit en fonction de la densité) avec le point courant.
- Contrôles : nombre de voitures (densité), probabilité de freinage aléatoire p, vitesse maximale.
- Panneau : densité, débit, vitesse moyenne, nombre de bouchons. Statuts : p = 0 « Sans hésitation, aucun bouchon jusqu'à une densité élevée » ; p = 0,3 « Un freinage de trop, sans accident ni obstacle, et un bouchon naît et remonte la file » ; au-delà de la densité critique « Plus de voitures, moins de débit ».
- Phrase-clé : « Un bouchon peut naître de rien : un petit freinage amplifié de voiture en voiture. Il recule pendant que les voitures avancent. »
- Fin de planche, trois questions ouvertes : **Chaos** « Ces systèmes sont-ils prévisibles à long terme ? » → module 08 ; **Évolution** « La sélection agit-elle aussi sur des comportements collectifs ? » → module 40 ; **Physique** « L'aimantation d'un métal ou l'ébullition sont-elles aussi des phénomènes collectifs ? » → Atlas (modèle d'Ising), module 18.

## Micro-interactions de découverte

Individu, isocline, trajectoire de phase, lièvre, lynx, S/I/R, R effectif, seuil, nœud, lien, nœud très connecté, raccourci, cellule, planeur, canon, boid, prédateur, grain, avalanche, voiture, bouchon, diagramme fondamental.

## `window.__labo` (en plus du socle)

`setCompetition(a12, a21, kRatio)` (1) ; `setLV(params)`, `capacity(on)`, `historical(on)` (2) ; `setR0(r)`, `setDuration(d)`, `setVacc(c)`, `restart()`, `odeOverlay(on)` (3) ; `setNetwork(kind, p)`, `vaccinate(strategy)`, `seed(i)` (4) ; `setCells(list)`, `pattern(name)`, `stepLife(n)` (5) ; `setWeights(s, a, c)`, `predator(x, y)` (6) ; `addGrains(n, where)` (7) ; `setCars(n)`, `setBrake(p)`, `setVmax(v)` (8).

## Théorie (explication)

**Module 41.** Relations : logistique \(\dfrac{\dd N}{\dd t} = rN\left(1 - \dfrac{N}{K}\right)\) ; Lotka-Volterra \(\dot x = ax - bxy\), \(\dot y = cxy - dy\) ; SIR \(\dot S = -\beta SI/N\), \(\dot I = \beta SI/N - \gamma I\), \(R_0 = \beta/\gamma\) ; seuil \(1 - 1/R_0\) ; taille finale \(z = 1 - e^{-R_0 z}\). Exemple chiffré possible : taille finale et pic pour R₀ = 2,5 ; couverture nécessaire contre la rougeole. Pièges : « une épidémie s'arrête quand tout le monde a été infecté » ; « R₀ est une propriété du virus seul » (il dépend aussi des contacts) ; « les prédateurs maintiennent les proies constantes » ; « vacciner au hasard ou cibler, c'est pareil ».

**Module 42.** Relations : règle B3/S23 ; trois règles des boids ; loi de puissance \(P(s) \propto s^{-\tau}\) ; débit \(q = \rho\,v\). Exemple chiffré possible : débit maximal d'une route à l'automate (densité critique), ou nombre de générations d'un planeur pour traverser une grille de 100 cases. Pièges : « un comportement collectif suppose un chef ou un plan » ; « l'émergence est mystérieuse » (elle est calculable, pas prévisible à l'œil) ; « une loi de puissance a une taille typique » ; « les bouchons ont toujours une cause ».

Où ça resservira : 40 (sélection, grille), 39 (immunité collective), 08 (stabilité, chaos), 18 (transitions de phase), Atlas : consensus et polarisation, modèle d'Ising, formation de motifs.

Seulement introduit ici : théorie des réseaux en détail, épidémiologie avec structure d'âge, transitions de phase, criticité en physique statistique.

## Honnêteté

Modèles minimaux et populations homogènes (sauf réseaux) ; données historiques présentées comme illustration ; réseaux et automates synthétiques ; tas de sable idéalisé ; trafic en une seule voie circulaire.

## Hors champ

Modèles épidémiologiques de santé publique, écologie des communautés, théorie des jeux, économie et marchés.
