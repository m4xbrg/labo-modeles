# Fondations · Énergie biologique (module 34)

Dossier de sortie : `opus-sonnet/fondations-energie-biologique/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 34`, titre « L'énergie du *vivant* ». Accent : `--accent: #e0b48a;` (ambre pâle). L'ATP et toute énergie utilisable restent en `--energie`. Budget : ≈ 0,8 ADN, **un chapitre de 4 étapes**.

**Statut particulier.** La planche *La respiration cellulaire* (`../02-respiration/`) couvre une partie du module 34 (chaîne respiratoire, gradient de protons, ATP synthase). Cette page ne refait pas ce mécanisme : elle pose **la comptabilité** (énergie libre, couplage, ATP comme monnaie), **les enzymes** (qui décident quelle réaction a lieu), un **bilan** de la respiration et la **photosynthèse**, qu'aucune page ne montre. Le module 34 est un candidat au découpage (voir `corpus/fondations.md`) : on garde ici une seule page de 4 étapes, et on laisse aux showcases le détail (cycle de Krebs, photosystèmes).

## Intention

À la fin, l'étudiant sait que **le vivant ne fabrique pas d'énergie : il la capte (lumière, nourriture), la stocke dans des molécules et la dépense en couplant des réactions qui descendent à des réactions qui montent**. Intuitions à rendre évidentes, par ordre de priorité :

1. Une réaction « qui monte » (ΔG > 0) ne se fait pas seule ; couplée à une réaction qui descend davantage (l'hydrolyse de l'ATP), l'ensemble descend et se fait (étape 1, moment fort).
2. L'ATP n'est pas une réserve, c'est une monnaie : une cellule recycle son stock en moins d'une minute, et un humain renouvelle chaque jour à peu près son propre poids en ATP (étape 1).
3. Une enzyme ne change pas la pente, elle ouvre le passage ; et elle sature : au-delà d'une certaine quantité de substrat, aller plus vite est impossible (étape 2).
4. Sans oxygène, la cellule ne tire d'un glucose qu'une petite fraction de ce qu'elle tire avec (étape 3).
5. La photosynthèse fait monter ce que la respiration fait descendre ; l'énergie qui entre dans le vivant est presque toute de la lumière (étape 4, moment fort).

Interdits : « l'ATP contient des liaisons riches en énergie qui la libèrent en se cassant » (l'énergie vient de la différence entre l'état avant et après, casser une liaison coûte toujours) ; « l'enzyme veut son substrat » ; « la plante respire seulement la nuit ».

## Réutilisation (ne pas reconstruire)

- Chaîne respiratoire, gradient de protons, ATP synthase : `../02-respiration/`. L'étape 3 renvoie là pour le mécanisme et ne dessine **pas** l'ATP synthase.
- Énergie d'activation, catalyse, équilibre, Q et K : `../fondations-reactions-chimiques/` (module 30). L'enzyme est un catalyseur ; on ajoute la saturation.
- Redox, électrons qui passent d'un couple à l'autre : `../fondations-acide-base-redox/` (module 31).
- Pompe Na⁺/K⁺ qui dépense l'ATP : `../fondations-cellule-membrane/` (acte V).
- Spectre visible, photon, E = hf : `../fondations-onde-electromagnetique/`, `../fondations-atomes-spectres/`.

## Moteur (à écrire et tester avant la page)

Bloc `/* BIOEN-BEGIN */ … /* BIOEN-END */`, objet `BioEn`. R = 8,314 J/(mol·K), T = 310 K.

- **Énergie libre** : `dG(dG0, Q, T)` = ΔG°' + RT ln Q ; `REACTIONS` : ATP + H₂O → ADP + Pi (ΔG°' = −30,5 kJ/mol), glucose + Pi → glucose-6-P (+13,8), glutamate + NH₄⁺ → glutamine (+14,2), phosphoénolpyruvate → pyruvate (−61,9), créatine-P → créatine (−43,0), oxydation complète du glucose (−2 870), avec sources ; `couple(r1, r2)` → ΔG global ; `cellATP` : concentrations typiques (ATP ≈ 3 à 5 mmol/L, ADP ≈ 0,5, Pi ≈ 5) → ΔG réel de l'hydrolyse.
- **Enzymes** : `mmRate(S, Vmax, Km, I, Ki)` (Michaelis-Menten avec inhibiteur compétitif) ; `enzymeSim({nE, nS, kon, koff, kcat, nI, seed}, dt)` : simulation stochastique particulaire (enzymes fixes ou lentes, substrats qui diffusent, liaison au site actif, produit libéré) → vitesse mesurée.
- **Bilans** : `respirationBudget({O2: true|false})` → ATP par glucose (glycolyse 2, cycle de Krebs 2, chaîne ≈ 26, total ≈ 30 avec la convention citée ; fermentation 2), O₂ consommé, CO₂ produit, rendement ; `dailyATP(power_W)` (masse d'ATP renouvelée par jour pour une puissance métabolique donnée).
- **Photosynthèse** : `chlAbs(lambda)` (spectre d'absorption de la chlorophylle a et b, approximation documentée, pics vers 430 et 662 nm pour a) ; `lightResponse(I, {Pmax, alpha})` (courbe saturante) ; `photoBudget()` (6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂, photons nécessaires, ordre de grandeur du rendement).

### Tests du moteur

1. Couplage glucose + ATP : ΔG°' global = −16,7 kJ/mol.
2. ΔG réel de l'hydrolyse de l'ATP avec ATP 4, ADP 0,5, Pi 5 mmol/L à 310 K : −49,5 kJ/mol (à 0,3) ; avec ADP 0,05 mmol/L, plus négatif que −55 (la cellule maintient ATP/ADP loin de l'équilibre).
3. Michaelis-Menten : v(Km) = Vmax/2 ; v → Vmax quand S → ∞ ; inhibiteur compétitif : Km apparent = Km(1 + I/Ki), Vmax inchangé.
4. Simulation particulaire : vitesse mesurée = `mmRate` à 8 % pour 5 concentrations de substrat (moyenne sur 10 graines), avec Km = (koff + kcat)/kon.
5. Bilans : avec O₂ ≈ 30 ATP par glucose (convention citée), sans O₂ 2 ; 6 O₂ consommés et 6 CO₂ produits par glucose.
6. Rendement de la respiration aux conditions standard : 30 × 30,5 / 2 870 ≈ 32 %.
7. `dailyATP(100 W)` : de l'ordre de 50 à 90 kg d'ATP par jour (ΔG réel et masse molaire de l'ATP 507 g/mol, hypothèses affichées).
8. `chlAbs` : maxima vers 430 ± 10 nm et 662 ± 10 nm, minimum dans le vert (500 à 600 nm).
9. `lightResponse` : linéaire à faible lumière, plateau à Pmax.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| ATP, énergie utilisable | `--energie` (ATP : trois petites perles, la troisième lumineuse ; ADP : deux) |
| réaction qui descend / qui monte | flèche vers le bas `--energie` / vers le haut `--texte-2` sur une échelle verticale de G |
| enzyme | forme en croissant `--fond-2`, contour `--accent`, site actif marqué |
| substrat / produit / inhibiteur | lilas `#b9a3ff` / `--accent` / sable `#dcc29a` |
| glucose | hexagone lilas (code de 07 et 32) ; O₂ anneau `--negatif` ; CO₂ gris |
| lumière | couleur de la longueur d'onde ; chlorophylle `#7ec27a` (elle est verte parce qu'elle absorbe peu le vert) |

## Chapitre · Module 34 · Énergie biologique

### Étape 1 · Descendre pour monter : le couplage (moment fort)
- Scène : une échelle verticale d'énergie libre ; chaque réaction est une flèche qui descend ou qui monte. Une réaction qui monte (glucose + Pi → glucose-6-P) reste bloquée en bas : le statut dit « ne se fait pas seule ». On **glisse** une flèche d'hydrolyse de l'ATP contre elle : les deux s'emboîtent comme un engrenage (une enzyme les couple : intermédiaire commun), la flèche totale descend, la réaction se fait. À droite, un « porte-monnaie » de la cellule : une barre d'ATP qui baisse à chaque dépense et que la respiration recharge.
- Contrôles : réaction à faire monter (glucose-6-P, glutamine, « contraction musculaire », « pompe Na⁺/K⁺ »), nombre d'ATP couplés (1 ou 2), bascule « Conditions de la cellule » (ΔG réel à la place de ΔG°').
- Panneau : ΔG de chaque réaction, ΔG global, nombre d'ATP dépensés. Statut : « 13,8 kJ/mol à monter, 30,5 à descendre : ensemble, on descend de 16,7. La cellule ne paie que si le total descend ». Encart « ordres de grandeur » : stock d'ATP d'une cellule épuisé en quelques dizaines de secondes sans recyclage ; un humain renouvelle chaque jour à peu près son propre poids en ATP.
- Phrase-clé : « Une réaction qui monte ne se fait pas seule. Couplée à l'hydrolyse de l'ATP, qui descend davantage, l'ensemble descend : c'est ainsi que la cellule paie ses travaux. »
- Note : ΔG°' standard biochimique ; « monter » et « descendre » sur une échelle d'énergie libre, pas d'énergie potentielle.

### Étape 2 · Les enzymes
- Scène : une vue particulaire : quelques enzymes (croissants) dans un bain de substrats qui diffusent ; un substrat qui entre dans un site actif y reste un instant et ressort transformé. Graphe à côté : vitesse en fonction de [S], points mesurés qui s'alignent sur la courbe hyperbolique ; Vmax et Km marqués quand ils apparaissent.
- Contrôles : [S] (curseur log), nombre d'enzymes, bascule inhibiteur compétitif (des molécules qui occupent le site actif sans réagir) et sa concentration.
- Panneau : vitesse (produits/s), fraction d'enzymes occupées, Km, Vmax. Statuts : à forte [S] « Toutes les enzymes sont occupées : ajouter du substrat ne sert plus à rien ; doubler les enzymes double la vitesse » ; avec inhibiteur « Il faut plus de substrat pour atteindre la même vitesse, mais à très forte [S], le substrat l'emporte ».
- Phrase-clé : « Une enzyme accélère une réaction précise en lui offrant un site où elle se fait plus facilement. Elle sature : sa vitesse plafonne quand tous ses sites sont occupés. »
- Note : simulation 2D, enzymes immobiles ; renvoi au module 30 pour la catalyse en général.

### Étape 3 · Du glucose à l'ATP, en bilan
- Scène : un diagramme de flux (Sankey) qui part d'une molécule de glucose : glycolyse dans le cytosol, puis, si l'O₂ est là, entrée dans la mitochondrie (cycle de Krebs, chaîne respiratoire dessinée en boîte fermée avec un lien vers `../02-respiration/`) ; l'épaisseur des bandes est proportionnelle à l'énergie ; ce qui n'est pas capturé en ATP part en chaleur (`--energie` pâle). Une loupe ouvre la mitochondrie sur un schéma minimal : des électrons qui descendent une chaîne de redox jusqu'à l'O₂.
- Contrôles : bascule O₂ (avec / sans : fermentation lactique), bouton « Courir un sprint » (demande d'ATP très forte, l'O₂ ne suit plus, le lactate s'accumule).
- Panneau : ATP par glucose, glucose consommé pour une demande donnée, O₂ consommé, CO₂ produit, rendement, chaleur. Statut sans O₂ : « Sans oxygène : 2 ATP par glucose au lieu d'une trentaine. Il faut brûler quinze fois plus de glucose pour le même travail ».
- Phrase-clé : « La respiration fait descendre l'énergie du glucose par petites marches et en capture environ un tiers en ATP ; le reste part en chaleur. Sans oxygène au bout de la chaîne, presque tout s'arrête. »
- Note : rendement en ATP par glucose selon une convention (de 30 à 32 selon les sources) ; le mécanisme est dans la planche 02.

### Étape 4 · La lumière entre : la photosynthèse (moment fort)
- Scène : une feuille en coupe, un chloroplaste agrandi. Un faisceau lumineux dont on règle la couleur arrive ; la chlorophylle absorbe surtout le bleu et le rouge (spectre d'absorption affiché, avec le vert qui passe). Côté « phase lumineuse » : l'eau est cassée, l'O₂ part en bulles, de l'ATP et du NADPH se forment ; côté « fixation du carbone » : des CO₂ sont accrochés et assemblés en sucre. Un compteur de bulles d'O₂ par minute.
- Contrôles : longueur d'onde (400 à 700 nm) ou « lumière blanche », intensité, CO₂ disponible.
- Panneau : vitesse de photosynthèse (O₂/min), courbe de réponse à la lumière (le point courant sur la courbe saturante), absorption à la longueur d'onde choisie. Statuts : en lumière verte « La feuille est verte parce qu'elle renvoie le vert : c'est la couleur qu'elle utilise le moins » ; à forte lumière « Plateau : le CO₂ ou les enzymes de fixation limitent, plus la lumière ». Bascule « Le grand cycle » : une vue d'ensemble plante ↔ animal où les flèches de la photosynthèse et de la respiration se referment (CO₂, O₂, glucose), et l'énergie entre comme lumière et sort comme chaleur.
- Phrase-clé : « La photosynthèse utilise la lumière pour faire monter ce que la respiration fait descendre. La matière tourne en cycle ; l'énergie, elle, traverse : elle entre comme lumière et sort comme chaleur. »
- Fin de planche, trois questions ouvertes : **Information** « Qui décide quelles enzymes la cellule fabrique ? » → module 35 ; **Électricité** « Combien d'ATP coûte un influx nerveux ? » → module 33 ; **Écosystème** « Pourquoi y a-t-il moins de prédateurs que de proies ? » → module 41.

## Micro-interactions de découverte

Échelle d'énergie libre, flèche de réaction, ATP, ADP, porte-monnaie, enzyme, site actif, substrat, inhibiteur, glucose, mitochondrie, bande du Sankey, chaleur, chloroplaste, chlorophylle, bulle d'O₂, CO₂.

## `window.__labo` (en plus du socle)

`setUphill(r)`, `couple(nATP)`, `cellConditions(on)` (1) ; `setS(S)`, `setE(n)`, `inhibitor(on, I)` (2) ; `oxygen(on)`, `sprint()` (3) ; `setLambda(nm)`, `white()`, `setLight(I)`, `setCO2(c)`, `cycle(on)` (4).

## Théorie (explication, module 34)

- Relations : \(\Delta G = \Delta G^{\circ\prime} + RT\ln Q\) ; couplage \(\Delta G_{\text{tot}} = \Delta G_1 + \Delta G_2 \lt 0\) ; \(v = \dfrac{V_{\max}[S]}{K_m + [S]}\) ; \(K_m^{\text{app}} = K_m(1 + [I]/K_i)\) ; bilan \(\text{C}_6\text{H}_{12}\text{O}_6 + 6\,\text{O}_2 \to 6\,\text{CO}_2 + 6\,\text{H}_2\text{O}\), \(\Delta G^{\circ\prime} \approx -2\,870\) kJ/mol.
- Exemple chiffré possible : masse d'ATP renouvelée par jour par un humain de 100 W, ou glucose consommé pendant un sprint anaérobie comparé à une course aérobie.
- Pièges : « l'énergie est dans les liaisons de l'ATP » ; « les enzymes sont consommées » ; « les plantes ne respirent pas » ; « la photosynthèse fabrique de l'énergie » ; « plus d'enzymes changent Km » ; « le lactate cause les courbatures ».
- Où ça resservira : 33 (coût des pompes), 35 (enzymes codées par les gènes), 37 (cascades enzymatiques), 38 (muscle), 41 (chaînes alimentaires), planche 02.
- Seulement introduit ici : cycle de Krebs en détail, photosystèmes, NADH et FADH₂ comme transporteurs, régulation allostérique.

## Honnêteté

ΔG standard biochimiques ; enzymes immobiles en 2D ; bilans selon une convention citée ; chloroplaste schématique ; spectre de la chlorophylle approché.

## Hors champ

Métabolisme des lipides et des protéines, cycle de Calvin en détail, photorespiration, plantes C4, thermodynamique hors équilibre.
