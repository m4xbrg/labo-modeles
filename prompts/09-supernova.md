# Projet 09 — Supernova par effondrement du cœur

Dossier de sortie : `opus-sonnet/09-supernova/`. Accent : `--accent: #ff5e62;` (rouge H-alpha, la couleur des restes de supernova et de l'enveloppe d'une supergéante rouge ; réservé à l'interface et à l'enveloppe d'hydrogène).

C'est le « gros morceau » de la série : plus narratif et cinématique que manipulable. On regarde un film en huit actes, qu'on peut mettre en pause, rembobiner et parcourir. Pas de curseurs physiques.

## Intention

Faire comprendre visuellement quatre choses, et pas davantage :
1. une étoile massive finit sa vie avec une structure interne **en couches** (oignon) ;
2. au centre s'accumule un **cœur de fer** qui ne peut plus produire d'énergie par fusion ;
3. quand ce cœur perd son soutien, il **s'effondre en une fraction de seconde** et rebondit sur lui-même en formant un cœur compact (proto-étoile à neutrons) ;
4. une **onde de choc**, relancée par l'énergie des neutrinos, traverse l'étoile et en **éjecte l'enveloppe** ; il reste un **résidu compact**.

Moment fort : le passage **effondrement → rebond → onde de choc → explosion de l'enveloppe** (actes IV à VII).

## Le défi : deux échelles impossibles

- **Temps** : de −10 millions d'années à quelques secondes, puis à des milliers d'années. Solution verrouillée : une **horloge logarithmique**. Chaque acte dure à peu près le même temps à l'écran, mais l'horloge affiche le temps réel, et une **frise logarithmique** (à double branche, avant / après l'effondrement, ±10⁻² s repliés au centre) montre où l'on se trouve. La frise est marquée « échelle logarithmique ». Les accélérations sont donc visibles et assumées, jamais cachées.
- **Espace** : de ~800 R☉ (enveloppe) à ~30 km (cœur compact), un facteur ~10⁷. Solution verrouillée : une **caméra qui plonge puis ressort** avec un indicateur de champ de vue permanent dans la scène (« champ ≈ 4 000 km »). Deux régimes, toujours étiquetés :
  - « **Coupe schématique — épaisseurs non à l'échelle** » (actes I, II, VII, VIII) ;
  - « **À l'échelle — champ ≈ … km** » (actes III à VI, dans le cœur).

## Ce que l'on représente réellement (modèle verrouillé)

Étoile de référence : **~15 à 20 M☉ à la naissance**, en fin de vie **supergéante rouge** (le cas le plus courant : supernova de type II-P). Tous les chiffres sont des **ordres de grandeur** pour ce cas.

- **Couches** (de l'extérieur vers le centre, produits dominants) : H ; He ; C, O ; O, Ne, Mg ; Si, S ; Fe, Ni (cœur de fer). Chaque couche est la cendre de la combustion précédente.
- **Durées des combustions centrales** (≈) : H ~10 Myr ; He ~1 Myr ; C ~1 000 ans ; Ne ~1 an ; O ~1 an ; Si ~1 jour. Chaque étape est plus courte parce qu'elle libère moins d'énergie par unité de masse et que l'étoile perd de plus en plus d'énergie sous forme de neutrinos.
- **Cœur de fer** : ~1,4 à 1,8 M☉, rayon de quelques milliers de km (ordre de la taille de la Terre), température ~10¹⁰ K, densité centrale ~10¹⁰ g/cm³. Soutenu surtout par la **pression des électrons dégénérés**. Le fer (groupe du fer) est au sommet de la courbe d'énergie de liaison par nucléon : sa fusion ne libère plus d'énergie, le cœur est inerte et grossit avec les cendres de la couche de silicium.
- **Perte du soutien (déclencheur, à montrer correctement)** : quand le cœur approche de sa masse limite, deux processus retirent la pression qui le tient :
  - **captures électroniques** (p + e⁻ → n + νₑ, sur des noyaux) : les électrons qui soutiennent le cœur disparaissent, les neutrinos s'échappent ;
  - **photodésintégration** du fer par les photons très énergétiques : réaction **endothermique** qui consomme de l'énergie thermique.
  Ce n'est **pas** « la fusion du fer qui absorbe l'énergie » : idée reçue à ne pas reproduire.
- **Effondrement** : en **quelques dixièmes de seconde**. Le cœur interne s'effondre de façon **homologue** (vitesse ∝ rayon), le cœur externe tombe plus vite que le son ; vitesses de chute jusqu'à **~70 000 km/s (~¼ c)**. Vers ~10¹² g/cm³ les neutrinos sont **piégés** temporairement. Rayon : de ~3 000 km à quelques dizaines de km.
- **Rebond** : le cœur interne atteint la **densité nucléaire (~3 × 10¹⁴ g/cm³)**, la force nucléaire devient fortement répulsive, le cœur se raidit et rebondit légèrement. La matière qui tombe dessus est stoppée : une **onde de choc** naît au bord du cœur interne (~0,5 M☉). Naissance de la **proto-étoile à neutrons** (~30 à 50 km de rayon, chaude, riche en neutrinos).
- **Choc qui cale** : en traversant le fer qui tombe, le choc dépense son énergie à **dissocier les noyaux** et en neutrinos ; il **s'arrête** à ~100 à 200 km en quelques dizaines de ms. C'est un point clé : le rebond seul ne suffit pas (dans presque tous les modèles).
- **Relance (scénario dominant, à présenter comme tel)** : la proto-étoile à neutrons rayonne un flot énorme de neutrinos ; une petite fraction est absorbée dans la région sous le choc (**région de gain**) et la chauffe. Aidé par la **convection et les instabilités** (le choc oscille, se déforme : SASI), le choc repart en **quelques dixièmes de seconde à ~1 s**, de façon **asymétrique**. Le mécanisme exact reste un sujet de recherche actif ; les simulations 3D récentes font exploser beaucoup d'étoiles, mais pas toutes.
- **Traversée de l'étoile** : le choc met **~1 jour** à atteindre la surface d'une supergéante rouge. Les couches se mélangent en doigts (instabilités de Rayleigh-Taylor). Le **sursaut de sortie du choc** (shock breakout) est le premier signal lumineux, bref. Puis l'enveloppe chaude s'étend et brille des mois (plateau ~100 jours), puis la désintégration du ⁵⁶Ni → ⁵⁶Co → ⁵⁶Fe prend le relais.
- **Bilan d'énergie** : ~3 × 10⁴⁶ J d'énergie gravitationnelle libérée ; **~99 % en neutrinos** (sur ~10 s), **~1 %** en énergie cinétique des éjectas (~10⁴⁴ J), **~0,01 %** en lumière. SN 1987A : une vingtaine de neutrinos détectés quelques heures avant la lumière.
- **Résidu** : une **étoile à neutrons** (~1,4 M☉, ~12 km de rayon après refroidissement) dans la plupart des cas ; pour certaines étoiles, un **trou noir** (par retombée de matière ou effondrement sans explosion brillante). Autour, les éjectas (~10 000 km/s) forment un **reste de supernova** qui enrichit le milieu interstellaire en O, Si, Ca, Fe… pendant des dizaines de milliers d'années.

## Ce que l'on simplifie (à documenter dans explication.html)

- Une seule étoile de référence ; la masse initiale, la rotation, le champ magnétique, la métallicité et un compagnon binaire changent tout (types Ib/Ic, IIb, IIn…). SN 1987A venait d'une supergéante **bleue**.
- Couches **sphériques et nettes** ; en réalité elles sont convectives, se mélangent, brûlent par intermittence.
- Épaisseurs des couches non à l'échelle dans la coupe (le cœur de fer est ~10⁵ fois plus petit que l'étoile).
- Temps compressé sur une échelle logarithmique ; durées d'acte arbitraires.
- Effondrement montré comme un mouvement d'ensemble lisse ; la relance est représentée par une déformation stylisée du choc, pas par une simulation hydrodynamique.
- Les neutrinos sont dessinés comme des traits : en réalité invisibles, leur nombre est astronomique et leur interaction rarissime.
- Pas de rotation, de jets, de champ magnétique ; pas de chaîne détaillée de nucléosynthèse.

## Ce qui est illustratif (à dire honnêtement)

- Les couleurs des couches : une rampe du rouge sombre (extérieur, plus froid) au blanc acier (centre, plus chaud) ; elles évoquent la température, ce ne sont pas des couleurs réelles.
- La granulation de la surface (grandes cellules de convection) : stylisée.
- Le flash du rebond et du sursaut de sortie : dosé, pas mesuré.
- Les filaments du reste de supernova.

## Code couleur (convention de la série respectée)

- `--negatif` (bleu) : **électrons** (captures électroniques à l'acte IV). Ils disparaissent : c'est le soutien qui s'en va.
- `--positif` (orange) : **protons** qui se changent en neutrons (petits points qui virent au gris neutre) — usage discret.
- `--energie` (jaune) : **ce qui porte l'énergie** : l'onde de choc, la région de gain chauffée, le sursaut lumineux.
- Neutrinos : traits fins blanc cassé translucides (`--texte` à faible opacité), rapides, rectilignes.
- Couches : rampe propre à la page (voir plus haut), désaturée, distincte des trois couleurs codées.

## Mise en scène : huit actes (film)

La planche est un **film déterministe** : tout l'état visuel est une **fonction pure** du temps global du film `T` (en secondes de film). Reculer, avancer, sauter à un acte = recalculer l'image pour un autre `T`. Seule une « respiration » ambiante (bouillonnement de surface, oscillation du choc calé) utilise une horloge séparée, très lente.

Durée indicative : ~8 à 11 s par acte, ~80 s au total. Lecture automatique au chargement ; le film s'arrête à la fin de l'acte VIII (résidu qui respire doucement).

| Acte | Titre court | Horloge réelle (log) | Caméra | Ce qu'on voit |
|---|---|---|---|---|
| I | Supergéante | −10 Myr → −1 Myr | étoile entière, schématique | Grande sphère rouge sombre, assombrissement centre-bord, grandes cellules de convection lentes. Champ ≈ 2 000 R☉. Repère : « le Soleil ici serait un point » (point minuscule optionnel). |
| II | En couches | −1 Myr → −1 jour | coupe en quartier (secteur ouvert) | Un secteur de 90° s'ouvre. Les couches apparaissent **de l'intérieur vers l'extérieur au rythme des combustions**, l'horloge accélère : He, C/O, O/Ne/Mg, Si/S, Fe. Étiquettes courtes à la pointe du secteur, une par couche. |
| III | Cœur de fer | −1 jour → −0,3 s | plongée vers le centre, puis à l'échelle (champ ≈ 8 000 km) | Le cœur de fer grossit (masse affichée 1,2 → ~1,5 M☉). Électrons (points bleus) en agitation. Mention : « le fer ne libère plus d'énergie par fusion ». Une très légère contraction s'amorce. |
| IV | Effondrement | −0,3 s → 0 | à l'échelle, champ qui se resserre (8 000 → 400 km) | Le cœur interne s'effondre de façon homologue, le cœur externe chute plus vite. Les électrons bleus s'éteignent (captures) et émettent des traits de neutrinos qui fuient, puis se raréfient (piégeage). Indicateur de vitesse de chute qui monte jusqu'à ~70 000 km/s. Les couches externes, plus loin, n'ont pas encore « appris » que le centre a disparu. |
| V | Rebond | 0 → +0,01 s | champ ≈ 400 km | Le cœur interne touche la densité nucléaire, se raidit, rebondit (petit ressort amorti). Un **front jaune** naît à son bord et part vers l'extérieur contre la matière qui tombe encore. Proto-étoile à neutrons au centre (sphère blanc bleuté, ~30 km). Flash bref et dosé. **Moment signature.** |
| VI | Le choc cale, puis repart | +0,01 s → +1 s | champ ≈ 600 km | Le choc ralentit et s'arrête vers ~150 km ; il ondule (convection, SASI). Neutrinos qui jaillissent du cœur compact ; la région de gain sous le choc se réchauffe (jaune qui monte). Le choc repart, déformé, asymétrique. Bandeau discret : « scénario dominant, encore étudié ». |
| VII | Explosion | +1 s → +1 jour | dézoom vers l'étoile entière (schématique) | Le front jaune traverse les couches, qui se déforment en doigts et se mélangent. Arrivée à la surface : sursaut lumineux bref au bord de l'étoile (« sortie du choc, ~1 jour après l'effondrement »). |
| VIII | Résidu | +1 jour → +10 000 ans | éjectas en expansion, champ qui grandit (ua → années-lumière) | Coquille d'éjectas en filaments où les couleurs des couches restent reconnaissables (O, Si, Fe mélangés). Au centre, étoile à neutrons (point blanc bleuté, « ~20 km de diamètre, ~1,4 M☉ »). Mention prudente : « parfois un trou noir ». |

Transitions continues entre actes : la caméra glisse (interpolation logarithmique du champ de vue), les couches et les étiquettes se fondent. Jamais de coupe sèche.

## Interface (structure de la série, comme 05)

- Scène en vedette (canvas 2D, `devicePixelRatio`) ; titre discret en haut à gauche : `L'invisible en mouvement — 09`, « Supernova par *effondrement du cœur* », lien retour.
- Dans la scène, en bas à gauche, en IBM Plex Mono : **régime d'échelle** (« Coupe schématique — épaisseurs non à l'échelle » ou « À l'échelle ») + **barre d'échelle / champ de vue**.
- Panneau de lecture (droite ≥ 861 px, dessous sur mobile) : « Acte IV sur VIII », titre, 1 à 3 phrases. Puis **mesures en direct** :
  - **Temps** par rapport à l'effondrement (ex. « −1 000 ans », « −0,12 s », « +0,30 s », « +1 jour ») ;
  - **Rayon du cœur** (km) ;
  - **Densité centrale** (g/cm³, notation scientifique) ;
  - **Vitesse de chute max** (km/s), actes IV-V ;
  - **Rayon du choc** (km), actes V-VII ;
  - tout « — » quand ce n'est pas pertinent.
  - Une petite **jauge d'énergie** (acte VI à VIII) : 99 % neutrinos / 1 % mouvement / 0,01 % lumière, barre horizontale qui se remplit.
- Barre de contrôles : précédent / lecture-pause / suivant / réinitialiser ; **stepper à 8 segments** (I à VIII) ; au-dessus ou intégrée, la **frise temporelle logarithmique** avec un curseur qui avance et qu'on peut cliquer/glisser pour parcourir le film.
- Micro-interaction de découverte : survoler une couche, le cœur de fer, un électron, un trait de neutrino, le choc, la région de gain, la proto-étoile à neutrons, l'étoile à neutrons, les éjectas → nom + rôle en une ligne (bulle comme 05).
- Clavier : Espace lecture/pause ; ← → acte précédent/suivant ; R recommencer l'acte ; 1 à 8 aller à l'acte.
- `prefers-reduced-motion` : pas de flash (fondu doux), film plus lent, pas de tremblement.
- Responsive jusqu'à 375 px, sans défilement horizontal.

## Moment signature

Acte IV → VII d'une traite : le cœur qui s'écroule (champ qui se resserre, compteur de vitesse qui grimpe), l'arrêt net et le rebond, le front jaune qui part, **cale**, ondule, puis repart et traverse toute l'étoile pendant que la caméra recule jusqu'à voir l'enveloppe se déchirer.
