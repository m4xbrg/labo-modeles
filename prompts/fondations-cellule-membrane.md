# Fondations · Cellule, membrane et transport (module 32)

Dossier de sortie : `opus-sonnet/fondations-cellule-membrane/` (`index.html` + `explication.html`). Charte : `00-direction-artistique.md`, intégralement. Gabarit : **le même que `fondations-rotation-gravitation/index.html`** (scène, titre discret, panneau de lecture, barre de contrôles, stepper d'actes groupés par paillasse, infobulle de découverte, clavier, fondu entre actes, enregistreur, `window.__labo`). Lire ce fichier avant d'écrire une ligne et reprendre sa coquille CSS/HTML.

Première production de la branche **Cellule et biologie moléculaire**. Accent : `--accent: #bfe39a;` (vert-sauge pâle, de la famille des verts du vivant mais distinct de la mitose et de la fondation 40). En-tête : `L’invisible en mouvement — Fondations 32`, titre « Cellule, membrane et *transport* ».

Budget : ≈ 1 ADN. Un `index.html` autonome de l'ordre de 110 à 150 Ko, sept actes, au plus trois ou quatre curseurs par acte (plus des boutons).

## Intention

À la fin, l'étudiant voit une cellule non comme « un sac rempli d'organites » mais comme **un système ouvert qui maintient activement un intérieur différent de son environnement**. Intuitions à rendre évidentes, par ordre de priorité :

1. À l'équilibre, le flux net est nul **mais les particules ne s'arrêtent jamais** : elles traversent toujours, autant dans un sens que dans l'autre (acte III, moment fort). Aucune représentation de la page ne doit suggérer qu'elles s'immobilisent.
2. Une cellule vivante n'est pas à l'équilibre : elle **dépense de l'énergie** (pompe, ATP) pour maintenir des gradients que la diffusion efface (acte V, moment fort). Un gradient maintenu peut à son tour faire du travail (symport).
3. La membrane trie selon ce qu'est la molécule (charge, polarité, et seulement ensuite taille) et selon les protéines qu'elle porte. « Petit = passe » est faux (acte II).
4. L'eau traverse dans les deux sens ; le **flux net** suit la différence de concentration en soluté qui ne traverse pas, et le volume suit le flux net (acte IV).
5. La surface croît comme L², le volume comme L³ : une grosse cellule a trop peu de surface pour ce qu'elle doit nourrir (acte VI).
6. Des membranes internes créent des compartiments aux conditions différentes (acte VII).

Le phénomène vient **avant** le vocabulaire : les mots hypotonique, isotonique, hypertonique, transport actif, etc. apparaissent après que l'étudiant a vu la chose (statut qui change, étiquette qui se révèle).

Interdits de formulation : « l'eau veut… », « les molécules cherchent à équilibrer… », « la cellule décide… ». On écrit ce qui arrive : « plus de molécules d'eau entrent qu'il n'en sort ».

## Réutilisation (ne pas reconstruire)

- La diffusion moléculaire et l'osmose à l'échelle des molécules sont **déjà** dans la planche 07 (actes IV « Diffusion » et VI « Osmose », `../07-matiere-chaleur/index.html`). Ici on change d'échelle : la membrane et la cellule. Liens discrets vers 07 dans les notes des actes III et IV.
- Le flux et le gradient, `J = −D∇c`, sont posés dans `../fondations-flux-fluides/index.html` (laboratoire A, « Ce qui s'écoule »). Ici on n'écrit que la version membranaire qualitative : **flux net ∝ (C_ext − C_int)** (à travers une membrane, le gradient devient une différence de part et d'autre). Lien dans la note de l'acte III.
- Retour exponentiel vers l'équilibre : `../fondations-systemes-hasard/index.html` (rétroaction négative). Mention dans la note de l'acte III.
- Showcases à **préparer sans dupliquer** : `../01-mitose/` (membrane qui se pince, noyau, cellule), `../02-respiration/` (gradient de protons, mitochondrie, ATP synthase : ne **pas** montrer l'ATP synthase ici), `../03-neurone/` (canaux Na⁺/K⁺, pompe, potentiel : ne **pas** montrer de potentiel ici), `../08-replication-adn/` (ADN dans le noyau).

## Moteur : verrouillé et déjà testé

Copie **à l'identique** le fichier
`C:\Users\m4xbr\AppData\Local\Temp\claude\C--Users-m4xbr-dev-labo-modeles--claude-worktrees-cell-membrane-foundations-398802\90dba6ea-1f7f-40db-8eb1-175a7643a307\scratchpad\cell.js`
dans le `<script>`, du marqueur `/* CELL-BEGIN */` au marqueur `/* CELL-END */` inclus (sans la dernière ligne `module.exports`). Ne modifie pas ces fonctions ; si tu as besoin d'un calcul de plus, écris-le hors du bloc. Le test doit continuer de passer sur ta page : `node scratchpad/test.js <chemin>/index.html`.

Ce qu'il fournit (lis le fichier, il est court) :
- **Boîte à particules** (actes I, II, III, V) : monde de 2 × 1, x ∈ [−1, 1], y ∈ [0, 1], membrane verticale en x = 0 d'épaisseur `Cell.MW`. **Intérieur (cellule) à gauche** (x < 0), extérieur à droite. `makeBox({membrane:'none'|'bilayer'|'tamis', seed, atp, atpSupply})`, `addParticles(box, sp, n, 'in'|'out'|'both')`, `removeParticles`, `addProt(box, kind, y, {sel, open})` avec `kind` ∈ `canal` (sélectif, `sel: ['na']`, `['eau']` = aquaporine, `['a']`…), `glut` (uniport du glucose, saturable), `pompe` (Na⁺/K⁺-ATPase : 3 Na⁺ dehors, 2 K⁺ dedans, 1 ATP par cycle ; ne tourne que si `box.atp ≥ 1` et `open`), `sglt` (symport Na⁺-glucose, action de masse, aucune énergie propre). `step(box)` à pas fixe `Cell.DT` (accumulateur), `counts(box)` → `{sp:{in,out,transit}}`, `rate(box, sp, 'in'|'out', fenêtre)` → traversées par seconde (`'in'` = entrée dans la cellule), `box.cross[sp]` cumulés, `box.atp`, `box.atpUsed`, `box.atpSupply`. Les particules en transit ont `p.lock` non nul : le moteur met lui-même à jour leur position (approche, traversée, sortie) ; dessine-les là où elles sont, à l'intérieur de la protéine.
- Espèces `Cell.SPECIES` : `o2`, `ster` (stéroïde), `eau`, `glu`, `na`, `k`, `a`, `b` avec `nom`, `role`, `r` (rayon de dessin, monde), `charge`.
- **Osmose** (acte IV) : `osmoInit()`, `osmoStep(s, {Cout, Uout, Pu}, dt)`, `osmoIn(s)` → `{imp, u, tot}` en mOsm/L, `s.V` (en V₀), `s.jw` (flux d'eau net, > 0 = entre), `s.lysed`, `osmoVeq(Cout)`, `waterRates(s, P)` → `{in, out}` molécules d'eau **dessinées** par seconde dans chaque sens (jamais nulles), `tonicity(Cout)`, `area(V)`, `Cell.OSMO` (iso 300, seuil de lyse 1,75 V₀).
- **Surface et volume** (acte VI) : `sv(d, fold)` pour une sphère de diamètre d (µm) → A, V, A/V, besoin (∝ V), apport maximal (∝ A × replis), `couverture` = apport/besoin, `dCrit` (40 µm sans replis).

## Code couleur (le même partout)

| Objet | Couleur et forme |
|---|---|
| Na⁺ | `--positif`, disque plein avec un petit « + » |
| K⁺ | `--negatif`, disque plein avec un petit « + » (même code que 03 : la couleur dit l'espèce, pas le signe) |
| ATP, énergie, pompe en action | `--energie` (lueur brève à chaque cycle de pompe, seulement là) |
| O₂ | anneau creux `--negatif` à 70 %, plus petit que les ions (code de la série : O₂ en bleu ; la forme le distingue de K⁺) |
| H₂O | petit point `--texte` à 55 % (l'eau est partout, discrète) |
| glucose | petit hexagone lilas `#b9a3ff` (le soluté de 07) |
| stéroïde | quatre petits cycles accolés (glyphe), `--texte` |
| soluté A (acte I et III) | lilas `#b9a3ff` ; soluté B : sable `#dcc29a` |
| bicouche : têtes hydrophiles | `--accent` ; queues hydrophobes : traits `--texte-2` ondulants ; cœur de la membrane : bande sombre |
| protéines | formes `--fond-2` à contour `--accent` ; canal = deux demi-cylindres avec un pore ; GLUT = forme en V qui s'ouvre d'un côté puis de l'autre ; pompe = bloc plus massif avec un liseré `--energie` quand l'ATP est disponible ; SGLT = forme double |
| flux net | flèche épaisse `--accent` à travers la membrane, longueur ∝ |flux net| ; traversées individuelles : petites traînées brèves (0,4 s) de la couleur de l'espèce |
| intérieur de la cellule | fond très légèrement teinté `--accent` à 4 % ; extérieur : `--fond` |

Rappelle dans la légende de chaque acte que les couleurs désignent des espèces, et que les particules sont des **représentants** (une particule dessinée = un très grand nombre de molécules).

## Paillasse M · membrane (actes I à IV)

### Acte I · La frontière
- Scène : la boîte, étiquettes « intérieur » (gauche) et « extérieur » (droite). Départ : 60 A à l'intérieur, 60 B à l'extérieur, 40 O₂ à l'extérieur. Membrane `bilayer`.
- Boutons : « Retirer la membrane » (nouvelle boîte `none`, mêmes particules aux mêmes positions) / « Mettre une membrane » ; « Recommencer ». Sans membrane, la limite reste dessinée en tireté fin `--texte-2` (une ligne imaginaire) : A et B se mélangent. Avec membrane : A et B restent chacun de leur côté, **O₂ passe** et s'équilibre.
- **Loupe sur la membrane** (bascule, active par défaut à la première visite) : encart circulaire ancré sur la membrane (glissable verticalement le long d'elle), qui montre la coupe de la bicouche agrandie : deux rangées de phospholipides (tête ronde `--accent`, deux queues ondulantes `--texte-2` vers le centre), des molécules d'eau de chaque côté, **aucune dans le cœur**. Étiquettes : « tête hydrophile (attire l'eau) », « queues hydrophobes (fuient l'eau) », « cœur huileux ≈ 3 nm ; bicouche ≈ 5 nm ». Les queues ondulent lentement (la membrane est fluide).
- Panneau : comptes A, B, O₂ intérieur | extérieur ; deux barres empilées « composition de l'intérieur » et « de l'extérieur ». Statut avec membrane : « Une frontière qui laisse passer O₂ mais pas A ni B : l'intérieur peut rester différent de l'extérieur. » Sans : « Sans frontière, tout finit mélangé. Il n'y a plus d'intérieur. »
- Phrase-clé : « Une cellule commence par une frontière. Sa structure (un cœur huileux entre deux faces qui aiment l'eau) décide déjà en partie de ce qui passe. »
- Note : bicouche réelle ≈ 5 nm, ici énormément grossie ; phospholipides sans catalogue.

### Acte II · Qui traverse ?
- Scène : la boîte, membrane dessinée **en coupe** (motif de phospholipides le long de la bande, cohérent avec la loupe de l'acte I). Rien au départ.
- Boutons d'injection (30 particules du côté extérieur) : « O₂ », « stéroïde », « H₂O », « glucose », « Na⁺ » ; « Vider ».
- Bascule de nature de la membrane : « Bicouche lipidique » / « Tamis hypothétique » (`tamis` : des pores aqueux qui ne trient que par la taille). C'est la contre-épreuve de la règle naïve : dans le tamis, Na⁺ passe et le stéroïde est bloqué ; dans la vraie bicouche, c'est l'inverse.
- Bascules de protéines (seulement en bicouche) : « Aquaporines » (2 canaux `sel:['eau']`), « Canaux Na⁺ » (2 canaux `sel:['na']`), « Transporteurs du glucose » (3 `glut`). Survol d'une protéine : nom et rôle en une ligne.
- Panneau : **tableau** par espèce présente : taille (petite / grosse), polarité (non polaire / polaire / chargée), entrés (cumul), traversées par seconde par molécule restée dehors (moyenne glissante), et un **verdict mesuré** (« traverse vite », « traverse lentement », « presque jamais ») calculé à partir de la mesure, pas d'une table écrite d'avance. Statuts conditionnels : si Na⁺ et stéroïde présents en bicouche → « Na⁺ est plus petit que le stéroïde, et pourtant il ne passe pas : sa charge l'empêche d'entrer dans le cœur huileux. » ; avec canaux Na⁺ → « Même membrane, autre résultat : un canal offre un passage aqueux, et il est sélectif (K⁺ n'y passerait pas). » ; avec GLUT → « Le transporteur lie le glucose et le fait basculer de l'autre côté, un à la fois : il peut saturer. »
- Phrase-clé : « Membrane seule ≠ membrane équipée de protéines. Ce qui compte : la charge, la polarité, la taille, et les protéines présentes. »
- Note : probabilités de passage illustratives (l'ordre est réel : gaz et stéroïdes ≫ eau ≫ glucose ≫ ions ; les écarts réels couvrent une dizaine de puissances de 10).

### Acte III · Gradient et diffusion (moment fort)
- Scène : la boîte, bicouche + canaux pour le soluté A (`sel:['a']`) régulièrement espacés. Curseurs : « intérieur au départ » (0 à 120 particules A, défaut 10), « extérieur au départ » (0 à 120, défaut 110), « canaux ouverts » (1 à 6, défaut 4 : c'est la perméabilité) ; bouton « Lancer » (recrée la boîte).
- Chaque traversée laisse une brève traînée ; deux **compteurs de traversées** de part et d'autre de la membrane : « → entrées : n/s » et « ← sorties : n/s » (fenêtre 3 s), plus la flèche de flux net (`--accent`) dont la longueur ∝ |entrées − sorties|.
- Bascule « Suivre une particule » : une particule A marquée (anneau `--energie`), sa trace des 6 dernières secondes, et son nombre de traversées. À l'équilibre, elle continue d'aller et venir.
- Panneau : C_int et C_ext (nombre par compartiment ; les deux compartiments ont le même volume, donc nombre ∝ concentration ; le dire), ΔC, entrées/s, sorties/s, flux net. Enregistreur 30 s : C_int(t) et C_ext(t) (trait plein et tireté), et en dessous entrées/s et sorties/s (deux traits fins qui **ne tombent jamais à zéro**). Petit graphe **flux net en fonction de ΔC** : un point toutes les secondes, ils s'alignent sur une droite qui passe par l'origine. Légende : « flux net ∝ C_ext − C_int ».
- Statut : pendant la relaxation « Plus de A à l'extérieur : plus de A frappe la membrane de ce côté, donc plus d'entrées que de sorties. » ; quand |ΔC| < 10 % du total (et |flux net| petit) → « **Équilibre dynamique** : flux net ≈ 0, mais ≈ n traversées par seconde dans chaque sens. Rien ne s'est arrêté. » (n mesuré).
- Phrase-clé : « Un gradient produit un flux net, sans qu'aucune molécule ne “sache” où aller. À l'équilibre, le flux net s'annule ; le mouvement, jamais. »
- Note : renvoi à 07 (diffusion moléculaire), à Flux-fluides (`J = −D∇c`) et à Systèmes (retour exponentiel).

### Acte IV · Osmose et volume
- Scène : **une cellule** (contour organique ondulant, `--accent`, rayon ∝ V^(1/3) à partir de V₀) au centre d'un bain. À l'intérieur, 70 points de soluté imperméant (lilas) qui s'agitent : leur nombre est fixe, donc leur densité monte quand la cellule rétrécit. Dans le bain, des points sable dont la densité ∝ C_out (mOsm/L). Molécules d'eau dessinées qui traversent la membrane **dans les deux sens**, aux débits `waterRates` (petits traits `--texte` courts, entrant et sortant, tirés au hasard le long du contour). Le contour se dilate ou se contracte en douceur selon `s.V`.
- Curseur C_out (50 à 900 mOsm/L, défaut 300 ; échelle lisible). Préréglages : « 150 », « 300 », « 600 ». Curseur « soluté qui traverse lentement (type urée) » U_out 0 à 600 (défaut 0, `Pu = 0.15`). Bouton « Nouvelle cellule ».
- **Le vocabulaire vient après** : une étiquette « milieu : … » reste masquée (« ? ») jusqu'à ce que le volume se soit stabilisé (|jw| < 0,01) ou après 4 s ; elle révèle alors hypotonique / isotonique / hypertonique avec une ligne : « hypo : moins de soluté dehors, l'eau entre en net, la cellule gonfle » etc.
- Lyse : si `s.lysed`, le contour se déchire (animation brève), les points s'échappent, statut « La membrane cède : lyse. Une cellule animale n'a pas de paroi pour résister. ». Bouton « Nouvelle cellule ».
- Panneau : C_int, C_out (mOsm/L), entrées et sorties d'eau dessinées /s, flux net d'eau, V/V₀, milieu. Enregistreur : V/V₀ (t) et C_int(t), C_out(t).
- Statut urée : « Au début, l'urée compte comme un soluté qui ne traverse pas : l'eau sort. Puis elle entre à son tour et l'eau la suit. Seul ce qui **ne traverse pas** décide du volume final. »
- Phrase-clé : « L'eau traverse dans les deux sens. Il entre plus d'eau qu'il n'en sort du côté où le soluté qui ne traverse pas est le plus concentré, et le volume suit ce flux net jusqu'à ce que les concentrations soient égales. »
- Note : renvoi à 07 acte VI (osmose moléculaire, pression osmotique) ; débits d'eau dessinés à une échelle arbitraire ; le vrai débit unidirectionnel est énorme et le flux net en est une petite différence.

## Paillasse C · cellule vivante (actes V à VII)

### Acte V · Maintenir un gradient (moment fort)
- Scène : la boîte ; intérieur à gauche. Départ : Na⁺ 5 dedans / 55 dehors, K⁺ 55 dedans / 5 dehors (l'ordre de grandeur réel : Na⁺ ≈ 12 / 145 mmol/L, K⁺ ≈ 140 / 5 ; 1 particule ≈ 2,5 mmol/L, le dire). Canaux de fuite Na⁺ et K⁺ (curseur « fuite » 1 à 3 de chaque), deux pompes au milieu de la membrane (y 0,36 et 0,64 si le symport est présent, sinon 0,42 et 0,58). Réserve d'ATP (`box.atp`, max 200, départ 100) en jauge `--energie` dans un coin de la scène.
- Déroulé guidé par les statuts : **pompes arrêtées au départ** → les gradients s'effacent (statut « Sans dépense d'énergie, la fuite efface les gradients : vers l'équilibre. »). Bouton « Pompes en marche » ; bascule « Apport d'énergie (ATP) » (`atpSupply` 6/s ou 0) ; bouton « Recommencer avec les gradients ». Quand la réserve s'épuise, les pompes s'arrêtent (liseré éteint) et la fuite reprend le dessus.
- Chaque cycle de pompe : 3 Na⁺ sortent, 2 K⁺ entrent, une petite lueur `--energie` et la jauge baisse d'un cran. Survol d'une pompe : « Pompe Na⁺/K⁺ : 3 Na⁺ dehors, 2 K⁺ dedans, 1 ATP par cycle. Transport actif : contre le gradient. »
- Bascule « Symport Na⁺–glucose » : ajoute un `sglt` au centre et 10 glucoses de chaque côté. Avec gradient de Na⁺ maintenu, le glucose s'accumule à l'intérieur au-delà de l'extérieur. Statut : « Le Na⁺ qui rentre en descendant son gradient entraîne le glucose avec lui, même contre le gradient du glucose. Le gradient de Na⁺ fait un travail. » Sans pompe, l'effet s'éteint.
- Panneau : Na⁺ in/out, K⁺ in/out, rapport Na⁺ out/in, « écart à l'équilibre » (une jauge 0–100 % calculée à partir des deux rapports), ATP en réserve, ATP consommés par seconde, Na⁺ entrés par fuite /s vs sortis par pompe /s (à l'état stationnaire ils s'égalent), glucose in/out si symport. Enregistreur : Na⁺ in(t), K⁺ in(t), ATP(t), glucose in(t).
- Phrase-clé : « Une cellule vivante n'est pas à l'équilibre. Elle paie, en ATP, pour maintenir des différences que la diffusion efface sans cesse. Et une différence maintenue peut servir : elle stocke une possibilité de travail. »
- Note d'honnêteté : « Ces ions portent une charge. Ici on ne compte que les concentrations : la tension électrique qui en résulte, et qui change tout, est le sujet du module 33 (bioélectricité). Proportions des débits illustratives. »

### Acte VI · Surface et volume
- Scène : deux cellules sphériques vues en coupe (cercles organiques) côte à côte : A fixe à 10 µm, B réglable (curseur d de 5 à 100 µm, défaut 30). Même échelle de dessin pour les deux (si B devient trop grande, l'échelle commune se réduit en douceur ; barre d'échelle « 10 µm »). Sur le contour, des « portes » (petits traits `--accent`) à densité surfacique constante : leur nombre ∝ d². À l'intérieur, des « consommateurs » (points) à densité volumique constante (nombre ∝ d³, plafonné à l'affichage, l'écrire). Remplissage intérieur teinté par la couverture apport/besoin : si < 1, le centre s'assombrit (le cœur manque).
- Bascule « Replis de la membrane (×3) » : contour de B en microvillosités, `sv(d, 3)` ; d* passe à 120 µm.
- Panneau : pour A et B : A (µm²), V (µm³), A/V (µm⁻¹), besoin, apport, couverture (%). Graphe log-log ou linéaire (choisis le plus lisible) : A/V en fonction de d (hyperbole 6/d), les deux points ; ligne horizontale « A/V minimal » correspondant à d* ; zone « la surface ne suffit plus » au-delà.
- Statut : quand d dépasse d* « Au-delà de ≈ 40 µm, la surface ne suffit plus à nourrir le volume. » Phrase-clé : « Doubler la taille multiplie la surface par 4 mais le volume par 8. Le volume dit combien il faut nourrir ; la surface dit par où ça peut entrer. A/V ∝ 1/L. »
- Note : nombres d'apport et de besoin illustratifs ; le seuil de 40 µm n'est pas une loi universelle (formes aplaties, allongées, replis, transport interne).

### Acte VII · Compartiments
- Scène : une cellule eucaryote schématique (pas un atlas) : membrane plasmique, **noyau** (double membrane avec pores, quelques brins d'ADN `--accent` qui ondulent à l'intérieur), **mitochondrie** (double membrane, crêtes ; ions H⁺ `--positif` concentrés entre les deux membranes), **lysosome** (petite vésicule, H⁺ concentrés, quelques « enzymes » en ciseaux), cytosol. Chaque population s'agite (marche aléatoire), contenue par sa membrane.
- Bascule « Dissoudre les membranes internes » : les contours internes s'estompent, les populations diffusent dans tout le cytosol (même marche aléatoire, sans les parois) ; les concentrations locales s'égalisent. Bascule inverse : les membranes reviennent, mais les populations restent mélangées (statut : « Remettre une membrane ne trie rien : il faudrait des pompes et de l'énergie pour refaire la différence. Renvoi à l'acte V. »). Bouton « Recommencer ».
- Panneau : par compartiment, la concentration en H⁺ relative et l'équivalent pH réel (cytosol ≈ 7,2, lysosome ≈ 4,7, espace intermembranaire de la mitochondrie ≈ 6,8 à 7) pendant que les membranes existent ; brins d'ADN dans le noyau / hors du noyau.
- Survol : noyau (« garde l'ADN à part : module 35 »), mitochondrie (« un gradient de protons entre ses deux membranes : module 34 et planche 02 »), lysosome (« un intérieur acide où des enzymes digèrent sans attaquer le reste »), membrane plasmique.
- Phrase-clé : « Une membrane fait un compartiment ; un compartiment garde des conditions locales différentes ; des conditions différentes permettent des fonctions spécialisées. »
- **Fin de la planche : trois questions ouvertes**, sous forme de trois cartes sobres dans le panneau (pas de réponse) :
  - **Énergie** : « Si une cellule dépense sans arrêt de l'énergie pour maintenir son organisation, d'où vient cette énergie ? » → module 34 (à venir) ; en attendant, planche 02.
  - **Information** : « Comment la cellule sait-elle quelles protéines (canaux, pompes, transporteurs) fabriquer ? » → module 35 (à venir) ; planche 08.
  - **Électricité** : « Que se passe-t-il quand les particules séparées par la membrane portent une charge ? » → module 33 (à venir) ; planche 03.

## Positions des protéines (y, pour ne pas les chevaucher : demi-hauteur `Cell.PROT_H/2`)
- Acte II : aquaporines 0,15 et 0,85 ; canaux Na⁺ 0,32 et 0,68 ; GLUT 0,42, 0,50 et 0,58.
- Acte III : n canaux à y = (i + 0,5)/n.
- Acte V : fuite Na⁺ à 0,12, 0,20, 0,28 ; fuite K⁺ à 0,90, 0,82, 0,74 (les k premiers selon le curseur) ; pompes 0,42 et 0,58, ou 0,36 et 0,64 avec le symport à 0,50.

## Mise en scène
- Stepper à deux groupes (« Paillasse M · membrane » I–IV, « Paillasse C · cellule vivante » V–VII). Fondu entre actes. Chaque acte a ses propres outils (`data-acts`).
- Panneau : numéro et titre de l'acte, 1 à 3 phrases, statut, enregistreur (canvas), légende SVG, mesures en IBM Plex Mono, note d'honnêteté (une ligne).
- Micro-interactions de découverte (survol → nom + rôle) : chaque espèce, la membrane, tête et queue dans la loupe, chaque protéine, la flèche de flux net, les compteurs, la particule suivie, la jauge d'ATP, la cellule de l'acte IV, les portes et consommateurs de l'acte VI, chaque compartiment.
- Clavier : Espace pause, ← → acte, 1 à 7 aller à l'acte, R réinitialiser l'acte, `M` membrane (acte I), `P` pompes (acte V), `S` suivre une particule (acte III).
- **Le temps ne s'arrête jamais de lui-même** : aucune simulation ne gèle à l'équilibre ; seule la pause de l'utilisateur arrête l'affichage. Même dans `prefers-reduced-motion`, les particules continuent de bouger (plus lentement : agitation divisée par 2 à l'affichage, l'écrire dans un `title`) : leur mouvement est le sujet.
- Responsive jusqu'à 375 px sans défilement horizontal ; < 861 px : scène, contrôles, panneau empilés. La boîte garde son rapport 2 : 1 et se centre.
- Aucune erreur console ; canvas à l'échelle de `devicePixelRatio` ; pas de bibliothèque ; pas d'image externe. Performance : ≤ 250 particules, dessin en lots par espèce.
- `window.__labo` : `{ Cell, act, goAct, state, tick(n), setPlay, box() }` + des crochets de test : `membrane(on)` (I), `inject(sp)`, `setMem(kind)`, `prot(kind, on)` (II), `launch(nIn, nOut, ch)`, `follow(on)` (III), `setCout(C)`, `setUrea(U)`, `newCell()` (IV), `pumps(on)`, `supply(on)`, `symport(on)`, `restart()` (V), `setD(d)`, `fold(on)` (VI), `dissolve(on)` (VII). `state()` renvoie les grandeurs affichées de l'acte courant. `tick(n)` avance n pas fixes sans dessiner.

## Honnêteté (dans la page, une ligne par acte, et dans l'explication)
- 2D, quelques centaines de particules, chacune représentant un très grand nombre de molécules ; temps illustratif.
- Probabilités de passage illustratives ; l'ordre de perméabilité est réel, pas les rapports.
- Pas de charge électrique ni de potentiel de membrane (module 33) ; pas d'électroneutralité.
- Osmose : modèle continu (Boyle–van 't Hoff avec un volume non osmotique de 0,3 V₀), soluté parfaitement imperméant, débits d'eau dessinés à échelle arbitraire.
- Surface/volume : sphères, besoin et apport proportionnels, seuil illustratif.
- Compartiments : schéma, pas un atlas ; mélange illustratif.

## Hors champ
Potentiel d'action, Hodgkin-Huxley, équation de Nernst, ATP synthase, respiration et photosynthèse, transcription, traduction, réplication, mitose, cycle cellulaire, signalisation, cytosquelette, trafic vésiculaire, endocytose.
