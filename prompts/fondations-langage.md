# Fondations — Langage scientifique fondamental

Dossier de sortie : `opus-sonnet/fondations/`. Une seule page `index.html` (quatre toys internes, navigation par onglets) et une seule `explication.html` commune. Accent : `--accent: #6fd6c8;` (sarcelle craie : l'outil de mesure, le repère, l'interface).

La charte `00-direction-artistique.md` s'applique, avec trois adaptations propres aux fondations :
- les toys sont plus petits et plus didactiques que les planches : une idée claire par scène, texte court, retour immédiat ;
- pas de stepper narratif obligatoire : chaque toy a 3 ou 4 **modes** (boutons segmentés) qui sont autant de « regards » sur la même scène ;
- le titre discret dit `Fondations — 0N` au lieu de `L'invisible en mouvement — 0N`.

## Intention

Donner le vocabulaire visuel que les planches supposent : unités, ordres de grandeur, graphes, pente, aire, vecteurs, position / vitesse / accélération. Après la page, on doit savoir **lire** ce qu'une planche affiche. Pas un cours de calcul : des choses à manipuler, des formules seulement quand elles clarifient.

## Code couleur (identique dans les quatre toys)

Le code de la série est réutilisé pour le **signe** :
- `--positif` (orange) : pente positive, aire au-dessus de l'axe, composante positive, vecteur qui pointe vers +x.
- `--negatif` (bleu) : pente négative, aire sous l'axe, composante négative.
- gris `--texte-2` : nul (pente nulle, composante nulle).
- `--energie` (jaune) : réservé au repère clé du moment (point sondé, tête de lecture, résultat d'une addition).

Couleurs de grandeurs (courbes, flèches) :
- position x : `--texte` (blanc cassé) ;
- vitesse v : `--accent` (sarcelle) ;
- accélération a : `#c38bff` (lilas, noté `--acc-a`).
Vecteurs du toy C : A = `--accent`, B = `--acc-a`, résultante = `--energie`.

## Les quatre toys

### 01 · Échelles — « Puissances de dix »
Un champ de vision dont la largeur L va de 10⁻¹⁰ m à 10¹³ m, piloté en continu (molette, glisser vertical, curseur logarithmique, boutons ÷10 ×10 ÷1000 ×1000 animés). Des objets réels emboîtés, chacun dessiné à sa vraie taille relative (cercle ou silhouette simple), ancrés au même coin : atome, ADN, virus, bactérie, globule rouge, cheveu (épaisseur), fourmi, humain, bâtiment, montagne, Terre, distance Terre–Lune, Soleil, orbite de la Terre, orbite de Neptune. Un objet n'est nommé que s'il occupe entre ~3 % et ~150 % du champ.
Mesures : largeur du champ en notation décimale avec préfixe (« 20 µm »), en notation scientifique (« 2 × 10⁻⁵ m »), ordre de grandeur (« 10⁻⁵ m »), préfixe courant mis en évidence dans une réglette de préfixes (n, µ, m, —, k, M, G, T). Barre d'échelle ronde (1, 2 ou 5 × 10ⁿ) dont l'unité change de préfixe.
Modes : **Zoom** (la scène), **Linéaire ou log** (les mêmes objets placés sur un axe linéaire, où presque tout s'écrase sur zéro, puis sur un axe logarithmique, où chaque ×10 occupe la même longueur ; transition animée), **Précision** (une règle : on mesure un même objet avec une graduation au cm puis au mm ; lecture « 7,3 ± 0,05 cm », chiffres significatifs, distinction valeur / précision).

### 02 · Graphiques — « Le réservoir »
Contexte concret unique : un réservoir et un robinet. Débit Q en L/min (positif = remplit, négatif = vide), volume V en L, temps t en min. À gauche la situation animée, à droite le graphe. Modes :
1. **Proportionnalité** : réservoir vide au départ, V = Q·t. Repères t et 2t : le volume double. Droite par l'origine.
2. **Pente** : volume initial V₀ réglable, Q de −5 à +5 L/min. Triangle de pente (Δt = 1 min, ΔV = Q). Couleur par signe. Unité de la pente affichée : L/min = (unité de V)/(unité de t).
3. **Aire** : graphe Q(t) ; l'utilisateur change le débit en cours de route (curseur actif pendant la lecture) : Q(t) est en escalier, l'aire colorée sous la courbe croît et vaut le volume ajouté (L/min × min = L) ; le réservoir le confirme.
4. **Non linéaire** : le réservoir se vide par un trou au fond (Torricelli simplifié : Q ∝ −√V). V(t) est une courbe. Une sonde déplaçable sur la courbe montre la tangente et sa pente : plus raide = plus vite ; à la fin, presque plat.

### 03 · Vecteurs — « Une flèche, pas un nombre »
Plan quadrillé en mètres (déplacement) ; en mode 4, en newtons (force). Action directe : on saisit la pointe des flèches. Modes :
1. **Scalaire ou vecteur** : « 5 m depuis ici » : le cercle de toutes les arrivées possibles (un nombre ne suffit pas) ; la flèche choisit un seul point. Exemples rangés : température, masse, durée (scalaires) / déplacement, vitesse, force (vecteurs).
2. **Composantes** : A déplaçable, composantes Ax et Ay dessinées comme deux pattes (couleur par signe), norme |A| = √(Ax² + Ay²), direction θ depuis +x. Aimant de grille désactivable.
3. **Addition** : A et B ; B glisse au bout de A (bout à bout, animé), résultante R ; composantes qui s'additionnent (Rx = Ax + Bx) en barres empilées ; la norme de R n'est pas |A| + |B| en général.
4. **Projection** : un rail incliné (direction réglable) et une force F ; l'ombre de F sur le rail = F cos α, la seule partie qui fait avancer le wagon. Perpendiculaire : zéro.

### 04 · Mouvement — « Trois graphes, un seul mouvement »
Un mobile sur une piste horizontale graduée en m, et trois graphes empilés partageant l'axe t (0 à 10 s) : x(t) en m, v(t) en m/s, a(t) en m/s². Tête de lecture commune. L'accélération est **constante par morceaux** sur 5 intervalles de 2 s : on saisit chaque palier de a(t) et on le glisse (pas 0,5 m/s², de −3 à +3) ; v(t) et x(t) se recalculent **exactement et instantanément** (v affine par morceaux, x parabolique par morceaux). Curseurs v₀ et x₀. Préréglages : immobile, vitesse constante, départ arrêté, freinage, aller-retour, ralentir puis repartir.
Sur le mobile, flèches de v et de a (lien avec le toy 03 : en 1D, le signe est la direction).
Regards (bascules) :
- **Pente** : à la tête de lecture, sécante sur [t, t + Δt] avec Δt réglable de 2 s à 0,05 s ; elle tend vers la tangente, dont la pente égale la valeur lue sur le graphe du dessous (x → v, v → a). Valeurs affichées côte à côte avec unités (m / s = m/s).
- **Aire** : aire signée sous v(t) de 0 à la tête de lecture (orange au-dessus, bleu dessous) = Δx, marqué par une accolade sur x(t) ; idem aire sous a(t) = Δv. Unités : m/s × s = m.

## Contrat technique

La coquille `index.html` fournit la mise en page, les onglets, le style et un objet global `FX` (aides communes). Chaque toy est un fichier de travail `_work/toy-XX.js` qui s'enregistre ainsi :

```js
FX.register('echelles', {
  num: '01', titre: 'Échelles', titreHtml: 'Puissances <em>de dix</em>',
  mount(ctx) { /* construit son DOM dans ctx.scene, ctx.panel, ctx.controls ; ctx.signal pour les écouteurs */ },
  unmount() { /* arrête sa boucle d'animation */ }
});
```

Les fichiers de travail sont insérés dans `index.html` à l'intégration, puis supprimés.

Formules : KaTeX 0.16.11 depuis cdnjs, dans `index.html` (via `FX.k(tex, repli)` et `FX.tex(racine)`) comme dans `explication.html` (éléments `data-tex`). Chaque formule garde un repli en texte Unicode, affiché si KaTeX ne charge pas (hors ligne). On rend en KaTeX les formules statiques ; les valeurs qui changent à chaque image restent en texte mono ; les étiquettes du canevas restent du texte simple.

## Ce que l'on simplifie (à documenter)
- Tailles d'objets : ordres de grandeur typiques, pas des valeurs exactes.
- Réservoir : débit idéal, Torricelli sans constantes réelles.
- Mouvement : 1D, accélération constante par morceaux (sauts d'accélération instantanés, pas réalistes pour un vrai véhicule mais exacts pour le modèle).
- Vecteurs : 2D seulement, sans produit scalaire nommé ni trigonométrie détaillée.
