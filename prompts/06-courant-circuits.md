# Projet 06 — Courant et circuits

Dossier de sortie : `opus-sonnet/06-courant-circuits/`. Accent : `--accent: #8fe9d9;` (turquoise pâle d'oscilloscope de banc, pour l'interface, le sens conventionnel du courant et les traces de mesure).

Token local supplémentaire : `--magnetique: #c9a7ff;` (violet pâle), réservé à l'énergie stockée par l'inductance (acte IV). Il ne sert à rien d'autre.

## Place dans la série
La planche 04 (champ électrique) couvre l'électrostatique : charges, champ, potentiel, équipotentielles, tension entre deux points (voltmètre A–B), condensateur plan. La planche 06 la prolonge : **que se passe-t-il quand on relie deux points de potentiels différents par un conducteur ?** Les charges se mettent en mouvement : c'est le courant. Chaque fois qu'une idée vient de la planche 04 (tension = différence de potentiel, champ qui pousse les charges, champ uniforme entre deux plaques), le texte le dit explicitement et le lien `../04-champ-electrique/index.html` est donné une fois dans le panneau de l'acte I.

## Intention
Après la planche, l'étudiant doit sentir intuitivement :
- un courant est un **débit de charges** (coulombs par seconde), le même partout dans une boucle simple ;
- la tension est ce qui **pousse** (une différence de potentiel, comme une différence d'altitude), la résistance ce qui **freine** ;
- la puissance est l'énergie convertie par seconde, P = VI ;
- un condensateur **stocke de la charge séparée** (+Q d'un côté, −Q de l'autre, charge totale nulle) et donc de l'énergie ;
- un circuit RC évolue **exponentiellement** parce que la vitesse de charge est proportionnelle à ce qu'il reste à faire ;
- un circuit LC **oscille** parce que l'énergie passe sans cesse du condensateur (électrique) à l'inductance (magnétique), comme une masse sur un ressort.

## Modèle physique verrouillé (à respecter exactement)
Composants idéaux, fils sans résistance, pile idéale (pas de résistance interne). Sens conventionnel du courant : du + vers le − à l'extérieur de la pile. Les électrons (porteurs réels dans un métal) vont en sens inverse.

**Acte I — Ohm et puissance.** Pile de tension V (1,5 à 12 V, pas 0,5 ; défaut 6 V), résistance R (10 à 200 Ω, pas 5 ; défaut 60 Ω).
- I = V / R ; P = V·I = R·I² = V²/R.
- Potentiel le long de la boucle (borne − de la pile = 0 V) : V sur tout le fil du haut, chute **linéaire** de V à 0 dans la résistance, 0 V sur le fil du bas, remontée de 0 à V dans la pile.
- Dans la résistance de longueur L, le champ est uniforme : E = V / L, dirigé du haut potentiel vers le bas (c'est lui qui pousse les charges : lien direct avec la planche 04).

**Actes II et III — RC.** Pile V₀ = 6 V fixe, R de 2 à 20 kΩ (défaut 10 kΩ), C de 50 à 500 µF (défaut 100 µF), donc τ = RC de 0,1 à 10 s (défaut 1 s), en **temps réel** (pas de ralenti).
- Inverseur à deux positions : « charge » (pile – R – C) ou « décharge » (C – R, pile hors circuit).
- Mise à jour **exacte** à chaque image (pas d'Euler) : V_C(t + dt) = V_s + (V_C(t) − V_s)·e^(−dt/τ), avec V_s = V₀ en charge, 0 en décharge.
- I = (V_s − V_C) / R (positif en charge, négatif en décharge : le courant s'inverse). Q = C·V_C.
- Énergie stockée U_C = ½·C·V_C². En charge complète depuis 0 : la pile fournit Q·V₀ = C·V₀², le condensateur garde ½·C·V₀², la résistance dissipe l'autre moitié, **quelle que soit R**. Le panneau doit le montrer (énergie fournie, stockée, dissipée, intégrées numériquement à partir de P = V₀·I et P_R = R·I²).
- Repères sur la courbe de charge : 63 % à τ, 86 % à 2τ, 95 % à 3τ, 99 % à 5τ. Tangente à l'origine qui atteint V₀ exactement à t = τ. En décharge : 37 % à τ, demi-vie t½ = τ·ln 2 ≈ 0,69 τ.
- Pourquoi l'exponentielle : dV_C/dt = (V_s − V_C)/τ. La vitesse est proportionnelle à l'écart restant ; à chaque intervalle τ, l'écart est multiplié par 1/e ≈ 0,37. C'est la même loi que la décroissance radioactive ou le refroidissement : « ce qui reste diminue d'une même fraction par unité de temps ».

**Acte IV — Inductance : RL puis RLC (aperçu).** Une bascule à deux segments dans l'acte : `RL` | `LC amorti`.
- RL : pile V₀ = 6 V, L = 1 H, R de 5 à 50 Ω (défaut 10 Ω), τ = L/R (défaut 0,1 s), **ralenti ×10** affiché en permanence. Fermeture de l'interrupteur à t = 0 : I = (V₀/R)(1 − e^(−t/τ)), V_L = V₀·e^(−t/τ). Mise à jour exacte comme en RC. Message : en RC, c'est la **tension** du condensateur qui ne peut pas sauter ; en RL, c'est le **courant** dans la bobine. V_L = L·dI/dt : la bobine s'oppose aux variations du courant, comme une masse s'oppose aux variations de vitesse.
- LC amorti : C = 100 µF chargé à V₀ = 6 V, L = 10 mH, R de 0 à 30 Ω (défaut 1 Ω). ω₀ = 1/√(LC) = 1000 rad/s, f₀ ≈ 159 Hz, T₀ ≈ 6,3 ms. **Ralenti ×500** affiché (T₀ apparaît ≈ 3,1 s). Équation : L·dI/dt + R·I + q/C = 0, I = dq/dt. Intégration RK4 à sous-pas (≥ 20 sous-pas par image) ou solution analytique ; l'énergie totale ½q²/C + ½LI² doit décroître uniquement par R·I² (à R = 0 elle doit rester constante à mieux que 0,5 % sur 20 périodes).
- R critique = 2·√(L/C) = 20 Ω : sous 20 Ω oscillation amortie, à 20 Ω retour le plus rapide sans dépassement, au-dessus retour lent sans oscillation. Le panneau nomme le régime.
- Afficher : V_C(t) et I(t) superposés (décalés d'un quart de période : I est maximal quand V_C passe par 0), barres d'énergie U_C (en `--energie`), U_L (en `--magnetique`), dissipée cumulée (en `--texte-2`).
- Analogie masse-ressort, en une ligne dans le panneau et un petit tableau dans l'explication : C ↔ ressort (1/k), L ↔ masse, R ↔ frottement, q ↔ position, I ↔ vitesse.
- **Hors scope, à ne pas expliquer** : loi de Faraday, induction, force de Lorentz, champ B quantitatif, analyse fréquentielle, résonance forcée. Une seule phrase le dit : « Pourquoi une bobine réagit ainsi aux variations de courant : c'est l'induction, sujet d'une planche à venir. »

## Mise en scène : quatre actes (stepper, comme la planche 05)
Les actes se changent manuellement (boutons, flèches, segments cliquables, touches 1 à 4). À l'intérieur d'un acte, la simulation tourne en continu. Transitions par fondu, jamais de saut brutal. Deux curseurs au maximum par acte.

I. **Une boucle, un courant** — schéma : pile, fil, résistance, fil. Les fils sont colorés selon leur potentiel (dégradé `--fond` → `--positif` de 0 à 12 V ; le fil du haut porte la couleur de V, le fil du bas reste sombre, la résistance montre un dégradé continu). Des électrons (`--negatif`, petits points) circulent à **densité constante** et à vitesse ∝ I (vitesse visuelle bornée ; préciser dans l'explication qu'en vrai la vitesse de dérive est de l'ordre de 0,1 mm/s). Flèches du sens conventionnel en `--accent`. Petites flèches de champ E dans la résistance. La résistance rayonne une lueur `--energie` dont l'intensité suit P. Un voltmètre (deux pointes) aux bornes de R et un ampèremètre en série affichent leurs valeurs. Graphique : caractéristique I(V) de la résistance (droite de pente 1/R sur axes fixes 0–12 V, 0–1,2 A) avec le point de fonctionnement ; changer R fait pivoter la droite. Un profil « altitude » du potentiel le long de la boucle (petite bande) : plat, chute dans R, remontée dans la pile.
II. **Le condensateur se charge** — remplace la résistance de charge par R + C en série, inverseur en position « charge ». Armatures dessinées assez grandes : des charges + (`--positif`) apparaissent sur l'une et autant de charges − (`--negatif`) sur l'autre, nombre ∝ Q. Entre elles, lignes de champ parallèles dont la densité suit Q (rappel : le condensateur plan de la planche 04). Le courant (vitesse des électrons, flèches) ralentit à mesure que V_C approche V₀. Graphiques : V_C(t) et I(t) (axe des temps gradué en τ et en secondes, fenêtre 0–5τ), repères 63 %/86 %/95 %/99 %, tangente à l'origine. Bilan d'énergie en trois barres : fournie, stockée, dissipée. Phrase forte du panneau à la fin de la charge : « La moitié de l'énergie fournie par la pile a chauffé la résistance. »
III. **Le condensateur se décharge** — inverseur basculé : la pile sort du circuit, C se vide dans R. Le courant change de sens (les électrons repartent en sens inverse ; la valeur de I devient négative). Courbes V_C(t) = V₀·e^(−t/τ) et I(t), repère 37 % à τ et t½. L'inverseur reste cliquable aux actes II et III (touche S) : on peut recharger à mi-course et voir la courbe repartir de la valeur courante. Le moment pédagogique « pourquoi exponentielle » : une petite jauge « écart restant » et une flèche « vitesse » proportionnelle, qui rétrécissent ensemble.
IV. **Bobine et oscillation (aperçu)** — bascule RL / LC amorti. La bobine est dessinée en spires ; autour d'elle, des boucles fines en `--magnetique` dont l'opacité suit |I| (aucune flèche de B, aucune valeur numérique de B). En LC : le condensateur se vide dans la bobine, le courant monte, le condensateur se recharge à l'envers (signes des armatures inversés), et ainsi de suite. Les barres d'énergie U_C et U_L se passent la main. Curseur R : à 20 Ω le panneau dit « amortissement critique ».

## Interface
- Structure de la série (copier l'ossature de `opus-sonnet/05-ondes-interferences/index.html` : grille scène / panneau / contrôles, mêmes tokens, polices, boutons, curseurs, stepper, styles mobiles) : titre discret `L'invisible en mouvement — 06`, « Courant et *circuits* », lien retour `../index.html`, panneau à droite (≥ 861 px) / en bas (mobile), barre de contrôles en bas, lien « Comprendre ce qui se passe » vers `explication.html`.
- La scène contient le schéma (en haut ou à gauche) et une zone de graphiques canvas (en bas ou à droite selon le format) ; sur mobile, empiler schéma puis graphiques, sans défilement horizontal à 375 px.
- Panneau : numéro et titre de l'acte, 1 à 3 phrases, puis mesures en IBM Plex Mono (V, I avec signe, R, P, Q, V_C, τ, énergies selon l'acte), puis une ligne « Équation de l'acte » (une seule, reliée à ce qu'on voit : par ex. « I = V/R : pente de la droite = 1/R »).
- Micro-interaction de découverte : survoler pile, résistance, condensateur, bobine, inverseur, voltmètre, ampèremètre, un électron : nom + rôle en une ligne.
- Clavier : Espace = pause (gèle le temps), ← → = acte précédent/suivant, 1 à 4 = aller à l'acte, R = réinitialiser l'acte, S = basculer l'inverseur (actes II–IV).
- Format des nombres : `Intl.NumberFormat('fr-CA')`, signe moins typographique « − », unités avec préfixes (mA, kΩ, µF, mJ).
- `prefers-reduced-motion` : électrons immobiles remplacés par des flèches, transitions sans animation, mais les courbes se tracent quand même (c'est la physique, pas de la décoration).
- Interface de test en lecture seule : `window.__circuits = { act(), state(), set(obj), step(dt) }` qui expose les grandeurs (V, R, C, L, I, V_C, q, énergies, t) et permet de régler les paramètres et d'avancer le temps de façon déterministe, pour la QA.

## Code couleur
`--positif` charges + et potentiel haut, `--negatif` électrons et charges −, `--energie` puissance dissipée et énergie électrique stockée, `--magnetique` énergie de la bobine, `--accent` sens conventionnel, instruments et traces de mesure, `--texte-2` énergie dissipée cumulée et axes.

## Moment signature
Acte II : l'étudiant voit le courant s'essouffler pendant que les armatures se remplissent, et la courbe atteindre exactement 63 % au repère τ, avec la tangente qui « vise » V₀. Acte IV : les deux barres d'énergie qui se renvoient l'énergie comme une balançoire, de plus en plus faiblement.

## Explication (`explication.html`)
Même charte et mêmes sections que les autres planches (Ce que tu vois / Ce qui se passe vraiment / Ce que la simulation simplifie / Les chiffres à retenir / Teste-toi), 900 à 1300 mots (quatre actes). Dans « Ce qui se passe vraiment », une sous-partie par acte ; chaque équation (I = V/R, P = VI, Q = CV, U = ½CV², V_C(t), τ = RC, τ = L/R, ω₀ = 1/√(LC)) est accompagnée de ce qu'elle signifie **dans la scène**. Inclure le tableau masse-ressort ↔ LC. Simplifications à déclarer : composants idéaux, pas de résistance interne, vitesse de dérive très exagérée, ralentis ×10 et ×500, le courant s'établit en réalité à la vitesse de propagation du champ dans le fil (pas à celle des électrons), pas de rayonnement. Chiffres : vitesse de dérive (~0,1 mm/s pour 1 A dans 1 mm² de cuivre), 1 A ≈ 6,2 × 10¹⁸ électrons/s, énergie d'un condensateur de flash photo (~1 J sous ~300 V), τ d'un circuit de la planche, membrane du neurone (≈ 1 µF/cm², lien planche 03).
