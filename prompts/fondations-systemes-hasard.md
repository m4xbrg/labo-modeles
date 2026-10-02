# Fondations · Systèmes, croissance et hasard (modules 4, 5, 7)

Dossier de sortie : `opus-sonnet/fondations-systemes-hasard/` (`index.html` + `explication.html`). Charte : `00-direction-artistique.md`, intégralement, avec les ajustements ci-dessous.

Accent : `--accent: #d9e58c;` (citron pâle). Il sert à l'interface, aux **équilibres stables** et aux **histogrammes**.

Budget : ≈ 1 ADN, c'est-à-dire une planche du gabarit des autres fondations (un `index.html` autonome de l'ordre de 80 à 110 Ko, un `explication.html`). Pas plus. Au plus deux curseurs par étape, plus des boutons.

## Identité : la ligne « Fondations »

Même charte, même structure de page que `opus-sonnet/fondations-oscillations-ondes/index.html` : **reprendre sa coquille** (CSS, grille `.app .scene .panel .controls`, stepper groupé par chapitres, `.meas .row`, `.tip`, panneau secondaire `#secBox`, clavier, liens). Lire ce fichier avant d'écrire une ligne.

- surtitre : `Fondations — modules 4 · 5 · 7` ;
- titre : « Systèmes, croissance et *hasard* » ;
- un **même vocabulaire visuel** partout : un graphe x(t) avec axe du temps en bas (même style dans A, B, C, D3), une **flèche de taux** (petite tangente colorée par son signe), une **ligne de phase** (axe vertical de l'état avec des flèches qui montrent où le système va). L'étudiant doit reconnaître dans D3 la même courbe qu'en C1, et dans B1 la même règle qu'en A1.

## Idée directrice (à faire sentir, pas à réciter)

1. Un système a un **état** ; une **règle** dit à quelle vitesse cet état change, **selon l'état actuel**. C'est ça, une équation différentielle : dx/dt = f(x).
2. Quand le taux est **proportionnel** à l'état, on obtient l'exponentielle : feedback positif → croissance, feedback négatif → retour exponentiel vers l'équilibre.
3. Un événement individuel aléatoire est imprévisible ; mille répétitions forment une **distribution** stable et prévisible. Final : des atomes qui se désintègrent au hasard dessinent **exactement** l'exponentielle du chapitre C.

## Code couleur

| Grandeur | Couleur |
|---|---|
| état x, courbe x(t) | `--texte` |
| taux dx/dt > 0 (croît) | `--positif` |
| taux dx/dt < 0 (décroît) | `--negatif` |
| taux nul | `--texte-2` |
| équilibre stable | point plein `--accent` |
| équilibre instable | cercle vide `--texte` |
| solution exacte / théorie / référence | `--texte-2`, tireté fin |
| repère clé (doublement, demi-vie, moyenne, dernier tirage) | `--energie` |
| histogrammes, fréquences observées | `--accent` |
| feedback négatif (système de gauche en B1) | `--negatif` ; feedback positif (droite) | `--positif` |

Le code est cohérent avec la série : le signe du **gain** de rétroaction prend la couleur du signe.

## Structure : quatre chapitres, neuf étapes (stepper)

Segments `A1 A2 | B1 B2 | C1 C2 | D1 D2 D3`. L'animation tourne en continu dans une étape. Changement d'étape : fondu, jamais de saut. Les curseurs propres à une étape n'apparaissent que dans cette étape. Le temps de chaque étape est en **secondes de simulation** (unités génériques « u » pour x quand rien de concret ne s'impose ; le dire dans la note).

### A — Un système qui évolue (module 4)

Trois règles, mêmes dans tout le chapitre (sélecteur segmenté « Règle ») :

| Règle | Équation | Paramètres |
|---|---|---|
| Taux constant | dx/dt = a | a = 0,5 u/s |
| Taux ∝ état | dx/dt = k·x | k = 0,2 s⁻¹ |
| Retour vers une cible | dx/dt = −(x − x*)/τ | x* = 5 u, τ = 2 s |

Graphe x(t) : t ∈ [0, 10] s, x ∈ [0, 10] u. Solutions exactes (tireté `--texte-2`) : x0 + a t ; x0 e^(kt) ; x* + (x0 − x*) e^(−t/τ).

**A1. L'état et son taux (moment fort).** À gauche une jauge verticale (un réservoir gradué de 0 à 10 u) remplie jusqu'à x ; à côté, une flèche verticale dont la longueur ∝ dx/dt (couleur par signe) : « à quelle vitesse ça bouge, maintenant ». À droite, le graphe. Le système avance **pas à pas** (méthode d'Euler, montrée sans la nommer dans le panneau, nommée dans la note) : à chaque pas Δt, dessiner le segment de tangente de pente f(x) qui part du point courant, puis le nouveau point au bout ; la trajectoire en escalier de segments reste affichée. Sélecteur Δt : 2 s, 1 s, 0,5 s, 0,1 s (défaut 1 s) : avec 0,1 s la ligne brisée épouse la solution exacte. Curseur x0 (0,5 à 9 u, défaut 1 ; aussi : glisser le point de départ sur le graphe). Rythme : un pas toutes les ~0,6 s de temps réel pour Δt ≥ 0,5 ; pour 0,1 s, 10 pas par seconde réelle. Mesures : t, x, dx/dt (avec unité u/s), Δt, prédiction x + (dx/dt)·Δt. Phrase clé du panneau : « La règle ne dit pas où sera x : elle dit à quelle vitesse x change, compte tenu de ce qu'il vaut maintenant. » Afficher la règle en notation : `dx/dt = 0,2·x` etc.

**A2. Même règle, autres départs.** Même graphe, sur lequel on dessine le **champ de pentes** : une grille de petits traits (≈ 14 × 10) dont la pente est f(x), colorés par signe. Un clic/tap n'importe où lance une trajectoire depuis ce point (vers l'avant), intégrée finement (RK4, pas 0,02 s) et animée ; garder les 8 dernières. Boutons « 5 départs » (x0 = 1, 3, 5, 7, 9). À gauche du graphe, la **ligne de phase** : l'axe x seul, avec des flèches (vers le haut si f > 0, vers le bas si f < 0, longueur ∝ |f|) et, pour la règle 3, le point d'équilibre x* (point plein `--accent`). Petit graphe secondaire dans le panneau (`#secBox`) : f(x) en fonction de x (« graphe du taux »), avec le point courant. Phrase clé : « Les trajectoires ne se croisent jamais : un état donné n'a qu'un seul avenir. La condition initiale choisit laquelle on suit. »

### B — Rétroaction, équilibre, stabilité (module 4, suite)

**B1. Négatif ou positif ? (moment fort).** Deux systèmes côte à côte, même règle au signe près, écart e = x − x* à l'équilibre :
- gauche (`--negatif`) : de/dt = −e/τ : un paysage en **cuvette** avec une bille ;
- droite (`--positif`) : de/dt = +e/τ : un paysage en **dôme** avec une bille.
(Dessiner le paysage V(e) = ±e²/2 ; la bille est à la position e, sur la courbe ; mouvement sur-amorti : la bille glisse, ne roule pas, ne rebondit pas. Le dire dans la note : « comme dans du miel ».) Sous chaque paysage, son graphe e(t) déroulant (10 dernières secondes). Bouton « Perturber » : ajoute +0,5 à e dans les deux à la fois (aussi : clic sur une bille la pousse vers le côté cliqué). Bascule « Bruit » : petits coups aléatoires continus (e += σ·√dt·N(0,1), σ = 0,15) : à gauche la bille tremble autour de 0, à droite elle finit toujours par partir. Curseur τ (1 à 5 s, défaut 2). Le système positif est **borné** à |e| = 4 : en butée, afficher « saturation : le modèle linéaire ne vaut plus » et le bouton « Recentrer » remet e = 0 (sans bruit, il y reste : équilibre instable). Mesures pour chaque système : e, de/dt, et « temps caractéristique τ ». Mettre en évidence que l'écart de gauche est divisé par e ≈ 2,72 toutes les τ secondes, celui de droite multiplié par e : **le même exponentiel**, dans les deux sens (lien vers C). Phrase clé : « Rétroaction négative : l'écart crée une réponse qui le réduit. Positive : l'écart crée une réponse qui l'augmente. »

**B2. Les deux à la fois : la croissance logistique.** Population N, règle dN/dt = r·N·(1 − N/K), K = 100, curseur r (0,2 à 1,5 s⁻¹, défaut 0,8). Deux vues : en haut à gauche, le **graphe du taux** f(N) (parabole, positive entre 0 et K, négative au-delà, N ∈ [0, 140]) avec, sur l'axe N, la ligne de phase (flèches vers K) ; 0 = équilibre instable (cercle vide), K = stable (point plein). À droite, N(t) (t ∈ [0, 20] s). Clic sur l'axe N ou sur le graphe N(t) = lancer une trajectoire depuis ce N0 (garder 6 trajectoires, dont une au-dessus de K qui redescend). Bouton « Départs types » : N0 = 2, 20, 60, 130. Superposer, pour la trajectoire courante, l'exponentielle N0 e^(rt) en tireté : elles se confondent au début (feedback positif dominant), puis divergent quand la rétroaction négative (1 − N/K) prend le dessus. Mesures : N, dN/dt, N/K. Phrase clé : « Près d'un équilibre, regarde la pente du graphe du taux : si elle descend, l'équilibre est stable ; si elle monte, il est instable. »

### C — Exponentielles et logarithmes (module 5)

Modèle exact (pas d'intégration) : x(t) = x0·e^(k t). Curseurs (C1 et C2) : x0 (1 à 10, défaut 1) et k (−1 à +1 s⁻¹, pas 0,05, défaut 0,35). Temps qui défile de 0 à 30 s (lecture/pause, bouton « Rejouer »). Grandeurs dérivées, affichées ensemble :
- facteur par seconde e^k (« chaque seconde : ×1,42 ») ;
- temps caractéristique τ = 1/|k| ;
- si k > 0 : temps de doublement T₂ = ln 2 / k ; si k < 0 : demi-vie T½ = ln 2 / |k| ; si k = 0 : « — » (constant).

**C1. Pourquoi ça explose.** Graphe linéaire, échelle verticale initiale 0 à 10. Marches de doublement (ou de demi-vie) : à chaque T₂, un repère `--energie` « ×2 » (ou « ÷2 ») sur la courbe, avec la petite marche horizontale-verticale. En tireté : la croissance **linéaire** de même pente initiale, x0(1 + k t), pour comparer : au début elles se confondent, puis plus du tout. Quand la courbe sort par le haut, le compteur continue (valeur en notation décimale puis scientifique au-delà de 10⁶) et un bouton « Zoom arrière ×10 » recompresse l'axe vertical (transition animée) : à chaque zoom, tout le passé paraît plat. À gauche, une jauge « quantité » à remplissage logarithmiquement annoté n'est **pas** voulue ici : garder une jauge linéaire qui déborde (flèche « hors cadre »). Mesures : t, x, facteur/s, T₂ ou T½, τ, nombre de doublements écoulés t/T₂. Phrase clé : « Croissance linéaire : on **ajoute** la même quantité à chaque seconde. Exponentielle : on **multiplie** par le même facteur. »

**C2. L'échelle logarithmique et l'opération inverse.** Même courbe ; bascule « linéaire / log » (défaut log en entrant dans l'étape, transition animée de l'ordonnée entre les deux échelles, ≥ 600 ms). Axe log en puissances de 10 (graduations 1, 10, 100, 1000… et sous-graduations 2…9 fines) ; la courbe y devient **une droite** de pente k/ln 10 décades par seconde ; afficher « temps pour ×10 : ln 10 / k ». Une **sonde** : glisser une ligne horizontale de niveau y (`--energie`) ; la page affiche le temps où x atteint y : t = ln(y/x0)/k, en traçant les pointillés jusqu'à l'axe des t, et l'égalité lue en clair : « ln(y/x0) = k·t ». Afficher aussi log₂(y/x0) = nombre de doublements nécessaires. Phrase clé : « Le logarithme répond à la question inverse : combien de temps (combien de multiplications) pour arriver là ? Sur une échelle log, multiplier devient avancer d'un pas constant. »

### D — Hasard, probabilité, distributions (module 7)

Générateur pseudo-aléatoire **semé** (mulberry32 ou équivalent) pour tout le chapitre, réensemençable par le crochet de QA ; normales par Box-Muller.

**D1. Un lancer, beaucoup de lancers.** Un dé à six faces. Au centre, le dernier lancer en grand (face dessinée, points), avec une brève animation de roulement (≤ 300 ms). Dessous, le ruban des 30 derniers résultats. Boutons « 1 lancer », « ×10 », « ×100 », « ×1000 », « Lancer en continu » (≈ 20 lancers/s), « Effacer ». À droite, l'histogramme des **fréquences observées** des six faces (`--accent`) avec la ligne théorique 1/6 (tireté). En bas, le graphe de la fréquence observée de « 6 » en fonction du nombre de lancers n, **abscisse log** (1 à 10⁵), avec la valeur p = 1/6 en tireté et la bande ±2·√(p(1−p)/n) (`--texte-2`, très pâle) : la fréquence observée entre dans l'entonnoir et y reste. Deuxième trace optionnelle : la moyenne des valeurs, qui tend vers 3,5 (si le budget serre, l'afficher seulement en mesure). Mesures : n, fréquence de 6 (en % ), écart à 1/6, moyenne observée (théorie 3,5), écart-type observé (théorie √(35/12) ≈ 1,71). Phrase clé : « Le prochain lancer est imprévisible. La proportion sur mille lancers, elle, l'est presque. »

**D2. Marche aléatoire → distribution (moment fort).** M marcheurs (sélecteur 200 / 1000 / 5000, défaut 1000) partent tous de 0 ; à chaque pas, chacun fait +1 ou −1 avec probabilité ½. ≈ 15 pas par seconde, jusqu'à n = 400 (puis pause). Scène, de haut en bas :
1. une bande où les marcheurs sont des points sur l'axe horizontal (petite dispersion verticale aléatoire fixe pour les voir), de sorte qu'on voie le nuage **s'étaler** ;
2. la trajectoire d'**un** marcheur choisi (`--energie`) : position en fonction du pas, zigzag imprévisible ;
3. l'histogramme des positions (cases de largeur 2 : les positions ont la parité de n), barres `--accent`, avec la courbe théorique M·2·φ(x ; 0, √n) en trait fin `--texte` (φ = densité normale), la moyenne observée (trait `--energie`) et la bande ±σ observé.
Mesures : n, moyenne observée (théorie 0), écart-type observé, √n, rapport σ_obs/√n. Bouton « Nouvel échantillon » (même n, autres tirages) pour voir les fluctuations de l'histogramme, fortes avec 200, faibles avec 5000. Phrase clé : « Chaque marcheur fait n'importe quoi ; le nuage s'étale toujours comme √n. C'est la diffusion. » (Lien discret vers `../07-matiere-chaleur/index.html` : « la même chose avec des molécules ».)

**D3. Hasard individuel, loi collective : la désintégration.** N0 atomes dans une grille (sélecteur 25 / 400 / 2500, défaut 400). Demi-vie T½ = 2 s (λ = ln 2 / T½). À chaque pas dt = 0,05 s, chaque atome intact se désintègre avec probabilité p = 1 − 2^(−dt/T½) (≈ 1,72 %), **sans mémoire** : son âge ne compte pas. Atome intact = cellule pleine `--texte` ; désintégré = cellule éteinte avec un bref éclair `--energie`. Graphe N(t) : comptage observé (escalier `--accent`) et attendu N0·e^(−λt) (tireté `--texte-2`), avec bande ±√(N0·q(1−q)), q = e^(−λt), et repères de demi-vie (N0/2, N0/4… à 2, 4, 6 s en `--energie`) : c'est la courbe de C, avec k = −λ. Survol/tap d'un atome : « Probabilité de se désintégrer dans la prochaine seconde : 29 %, quel que soit son âge. » Boutons « Relancer », N0. Mesures : t, N, attendu, écart relatif (N − attendu)/attendu, demi-vie mesurée (temps où N passe sous N0/2, pour la dernière course). Phrase clé : « Personne ne peut dire quel atome partira. Tout le monde peut dire combien. Et plus ils sont nombreux, plus la prévision est précise (fluctuations relatives ∝ 1/√N). »

## Interface

- Coquille de `fondations-oscillations-ondes` : grille scène + panneau à droite ≥ 861 px, panneau en bas sur mobile, barre de contrôles en bas, stepper groupé (ch0 au début de chaque chapitre).
- Panneau : `Chapitre A · étape 1 sur 9`, titre, 1 à 3 phrases, la règle en notation (classe `.eq`, mono), mesures, note, graphe secondaire quand utile.
- Micro-interaction de découverte : survol/tap (jauge, flèche de taux, tangente, champ de pentes, ligne de phase, équilibre, bille, paysage, repère ×2, sonde, dé, barre d'histogramme, marcheur suivi, courbe théorique, atome) → nom + rôle en une ligne.
- Clavier : Espace pause, ← → étape, R réinitialiser l'étape, 1 à 9 = étapes.
- Responsive jusqu'à 375 px, sans défilement horizontal ; en dessous de 860 px, les vues côte à côte (B1, B2, D1) s'empilent.
- `prefers-reduced-motion` : temps ralenti ×0,25, pas d'éclairs ni d'animation de roulement.
- Canvas mis à l'échelle de `devicePixelRatio`. Aucune erreur console. Performance : D2 à 5000 marcheurs et D3 à 2500 atomes doivent rester fluides (tableaux typés, pas d'objets par particule, dessin par lots).
- Lien `explication.html` et retour `../index.html`.
- Note de design de 3 lignes en commentaire HTML en tête.

## Crochet de vérification (obligatoire)

Exposer `window.__fondations` en lecture seule pour la QA automatisée, sans effet sur l'interface :

```js
window.__fondations = {
  step: () => index,                   // 0..8
  go: (i) => {...},
  setParam: (name, value) => {...},    // noms : rule ('const'|'prop'|'goal'), dt, x0, tau, r, k, log (bool), M, N0
  advance: (seconds) => {...},         // avance l'étape courante de manière synchrone (sans rendu)
  seed: (n) => {...},                  // réensemence le générateur
  roll: (count) => {...},              // D1 : lance count dés immédiatement
  evo:   () => ({ rule, t, x, rate, dt, x0, exact }),            // A1 (exact = solution exacte à t)
  fb:    () => ({ t, tau, eNeg, ePos, saturated }),              // B1
  logi:  () => ({ r, K, N, rate }),                              // B2 (trajectoire courante)
  expo:  () => ({ x0, k, t, x, T2, Thalf, tau, log }),           // C
  dice:  () => ({ n, counts, freq6, mean, sd }),                 // D1
  walk:  () => ({ n, M, mean, sd, hist }),                       // D2
  decay: () => ({ t, N0, N, expected, thalfMeasured }),          // D3
};
```

## Notes d'échelle (vérifiées par Opus)

- A, règle 2 : x0 = 1 ⇒ x(10) = e² ≈ 7,39 (reste dans le cadre) ; Euler Δt = 2 donne (1,4)⁵ ≈ 5,38 : l'écart est bien visible, Δt = 0,1 donne (1,02)¹⁰⁰ ≈ 7,24.
- A, règle 3 : avec Δt = 2 s = τ, Euler arrive **exactement** sur x* en un pas (facteur 1 − Δt/τ = 0) : ce n'est pas un bug, c'est un pas trop grand. Le signaler dans la note quand c'est le cas.
- B1 : depuis e = 0,5 et τ = 2 s, la bille positive atteint la butée 4 en τ·ln 8 ≈ 4,2 s ; la négative est à 0,5·e^(−2) ≈ 0,07 après 4 s.
- B2 : taux maximal r·K/4 = 20 s⁻¹ à N = K/2 pour r = 0,8 ; depuis N0 = 2 on atteint ≈ K/2 vers t = ln(49)/r ≈ 4,9 s.
- C : k = 0,35 ⇒ T₂ = 1,98 s, facteur 1,419/s, x(30) = e^10,5 ≈ 3,6·10⁴ ; k = −0,35 ⇒ T½ = 1,98 s. Sortie du cadre initial (10) à t = ln 10 / 0,35 ≈ 6,6 s.
- D1 : dé équilibré : moyenne 3,5, variance 35/12, écart-type 1,708 ; pour n = 1000, l'écart-type de la fréquence de 6 vaut √(5/36/1000) ≈ 1,18 %.
- D2 : variance de la position = n (pas ±1) ; n = 400 ⇒ σ = 20 ; histogramme théorique par case de largeur 2 : M·2·φ(x).
- D3 : p = 1 − 2^(−0,025) ≈ 0,01718 par pas de 0,05 s ; probabilité sur 1 s : 1 − 2^(−0,5) ≈ 0,293. Avec N0 = 25, l'écart-type à t = T½ vaut √(25·0,25) = 2,5, soit 20 % ; avec 2500, 2 %.

## Ce que explication.html doit dire

Écrite par Opus (pas par le constructeur). Charte habituelle, plus une section « Les idées, une par une » (définition, représentation dans la page, relation clé, unités, limites) qui sert de théorie de référence, plus « Où tu reverras ce langage » et « Seulement introduit ici ».
