# Projet 05 — Ondes et interférences

Dossier de sortie : `opus-sonnet/05-ondes-interferences/`. Accent : `--accent: #b9c6ff;` (bleu glacier pâle, pour l'interface, les sources et la sonde ; peu saturé pour laisser la couleur aux ondes).

## Intention
Faire **voir** que deux ondes qui traversent le même espace s'additionnent, et que selon leur décalage elles se renforcent ou s'annulent. Le texte est minimal : c'est la scène qui démontre. Le moment fort est l'instant où, dans la cuve à deux sources, on voit côte à côte un point qui oscille deux fois plus fort et un point qui **ne bouge plus du tout**, alors que deux ondes y passent.

## Ce que l'on représente réellement (modèle verrouillé)
- Une onde scalaire 2D (surface d'eau peu profonde de faible amplitude, ou pression acoustique), vue de dessus, comme une cuve à ondes.
- Sources ponctuelles harmoniques, même fréquence, même amplitude, cohérentes. Contribution de la source i au point r :
  `u_i = A_i(r_i) · sin(k·r_i − ω·t + φ_i)` pour `r_i < c·(t − t_on,i)` (front qui avance à la vitesse c), avec `A_i(r) = A0 / sqrt(1 + r/r0)` (atténuation géométrique d'une onde circulaire en 2D, adoucie près de la source).
- **Superposition linéaire exacte** : `u = u_1 + u_2`. Rien d'autre n'est ajouté.
- Intensité moyenne dans le temps (calcul analytique, pas une moyenne d'images) : `I = ½A_1² + ½A_2² + A_1·A_2·cos(k(r_2 − r_1) + φ_2 − φ_1)`. Quand A_1 ≈ A_2 : I varie de 0 (annulation) à 4× l'intensité d'une seule source (renforcement).
- Différence de marche `Δ = r_2 − r_1`. En phase (φ_1 = φ_2) : renforcement si Δ = mλ, annulation si Δ = (m + ½)λ. Les lignes nodales sont des hyperboles de foyers S1 et S2.
- Entre les deux sources, sur l'axe S1–S2, les ondes vont en sens opposé : leur somme est une **onde stationnaire**, nœuds espacés de λ/2.
- Impulsions (acte II) : chaque source émet un seul cycle (enveloppe lisse, par exemple une gaussienne de largeur ~0,6λ modulant le sinus, ou un cycle de sinus fenêtré), qui se propage en anneau à la vitesse c. Les deux anneaux se croisent, s'additionnent là où ils se chevauchent, puis **continuent intacts**.

## Ce que l'on simplifie (à documenter dans explication.html)
- Pas de réflexion sur les bords (cuve infinie, bords absorbants), pas de dispersion (c indépendante de λ), pas d'amortissement autre que géométrique.
- Forme d'amplitude asymptotique en 1/√r (champ lointain), adoucie près de la source ; la vraie solution est une fonction de Hankel.
- Amplitudes faibles : linéarité parfaite. Une vraie vague de grande amplitude n'est plus linéaire.
- Sources parfaitement cohérentes (même fréquence, phase fixe). Deux ampoules ordinaires ne le sont pas : c'est pourquoi on ne voit pas de franges entre deux lampes.
- Vitesse et échelle arbitraires (λ de l'ordre de 40 à 60 px à l'écran) ; l'onde est très ralentie.

## Ce qui est illustratif (à dire honnêtement)
- Le léger relief lumineux (ombrage du gradient de u) qui donne l'aspect « eau » : purement esthétique.
- Les hyperboles tracées en pointillé : des repères calculés, pas un objet physique.
- La couleur : crête (u > 0) en `--positif`, creux (u < 0) en `--negatif`, niveau zéro = `--fond`. Intensité (énergie transportée, ∝ amplitude²) en `--energie`. C'est le code de la série : positif / négatif / énergie.

## Mise en scène : six actes (stepper, pas une timeline)
Les actes se succèdent manuellement (boutons, flèches, segments cliquables). L'animation de l'onde tourne en continu à l'intérieur d'un acte. Transitions continues (fondus, sources qui s'allument, front qui avance), jamais de saut brutal.

I. **Une source** — S1 s'allume, des cercles s'éloignent. Une sonde (petit anneau) monte et descend sur place : l'onde transporte une forme, pas la matière. Oscilloscope : une trace.
II. **Deux impulsions se croisent** — S1 et S2 émettent chacune un seul cycle. Là où les anneaux se chevauchent, crête + crête = crête deux fois plus haute ; crête + creux = presque plat. Puis les anneaux repartent intacts. Rejouer automatiquement toutes les ~4 s.
III. **Renforcement et annulation (moment fort)** — deux sources continues en phase. Deux sondes fixes : P sur la médiatrice (Δ = 0, étiquette « renforcement ») et Q sur la première ligne nodale (Δ = λ/2, étiquette « annulation »). Oscilloscope : pour la sonde active, trois traces superposées (onde 1, onde 2, somme). Sur P les deux traces se confondent et la somme est double ; sur Q elles sont en opposition et la somme est une ligne plate. Après ~2 s, les lignes nodales (hyperboles) apparaissent en pointillé fin. Clic sur une sonde = elle devient la sonde affichée.
IV. **Où va l'énergie ?** — fondu progressif de la vue instantanée vers l'intensité moyenne (franges jaunes et sombres). Une coupe le long d'un « écran » (ligne loin des sources, parallèle à S1S2) trace le profil I(x) de 0 à 4 I₀, avec le niveau 2 I₀ (somme sans interférence) en tireté : l'énergie n'est pas détruite, elle est redistribuée.
V. **Onde stationnaire** — coupe le long de l'axe S1–S2 : onde 1 (vers la droite) et onde 2 (vers la gauche) en traits fins, somme en trait fort, enveloppe ±2A en jaune. Les nœuds restent immobiles, espacés de λ/2 (repères marqués).
VI. **À toi** — mode libre : glisser S1, S2 et la sonde ; deux réglages seulement : longueur d'onde λ et déphasage de S2 (0 à 360°). Bascule « instantané / intensité moyenne ». Un déphasage de 180° doit transformer la médiatrice en ligne nodale.

## Interface
- Structure de la série : scène en vedette, titre discret en haut à gauche (`L'invisible en mouvement — 05`, « Ondes et *interférences* », lien retour), panneau de lecture à droite (≥ 861 px) / en bas (mobile), barre de contrôles en bas.
- Panneau : numéro et titre de l'acte, 1 à 3 phrases, puis mesures en direct en IBM Plex Mono : Δ (en λ), déphasage (°), amplitude relative de la somme (0 à 2), intensité relative (0 à 4 I₀) à la sonde, et un petit **oscilloscope** canvas (fenêtre de temps glissante).
- Une **bande de coupe** (canvas) sous la scène ou en surimpression au bas de la scène, visible aux actes IV et V (et VI quand l'utilisateur la demande) ; la ligne de coupe est tracée dans la scène.
- Micro-interaction de découverte : survoler une source, une sonde, une ligne nodale ou la ligne de coupe affiche son nom et son rôle en une ligne.
- Clavier : Espace = lecture/pause (gèle l'onde : instantané figé), ← → = acte précédent/suivant, R = réinitialiser, 1 à 6 = aller à l'acte.
- Aucun curseur avant l'acte VI.

## Moment signature
Acte III : les deux sondes côte à côte, l'une qui danse deux fois plus haut, l'autre immobile au milieu de l'agitation, et l'oscilloscope qui montre pourquoi (deux traces identiques contre deux traces miroirs). Puis acte IV : l'image se « fige » en franges d'énergie.
