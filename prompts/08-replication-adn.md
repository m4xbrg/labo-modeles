# Projet 08 — La réplication de l'ADN

Dossier de sortie : `opus-sonnet/08-replication-adn/`. Accent : `--accent: #4fe0d2;` (turquoise : l'ADN **neuf**). Couleur propre à la page : `--arn: #ff7b9c;` (rose : les **amorces d'ARN**). Brins parentaux en blanc cassé atténué (`--texte` à ~70 %).

## Intention
Suivre **une fourche de réplication** comme une petite machine en marche, et faire **voir** une seule idée : la réplication est asymétrique, parce que les deux brins ne peuvent pas être copiés de la même manière. Le texte est minimal ; c'est le mouvement qui démontre.

Le moment fort : la caméra est accrochée à la fourche. Une polymérase reste **immobile** à l'écran, collée à l'hélicase, et son brin s'allonge d'un seul trait. L'autre polymérase **file à reculons**, loin de la fourche, lâche prise, **revient d'un bond** vers la fourche, et recommence. Une couture à petits points arrière. On n'a pas besoin de lire pour comprendre que les deux brins ne vivent pas la même chose.

## Ce que l'on représente réellement (verrouillé)
- Les deux brins parentaux sont **antiparallèles**. Orientation fixe à l'écran (la fourche avance vers la droite) :
  - brin parental du haut : **3′ à gauche, 5′ à droite** → c'est la matrice du **brin directeur** ;
  - brin parental du bas : **5′ à gauche, 3′ à droite** → c'est la matrice du **brin retardé**.
- L'**hélicase** sépare les brins à la pointe de la fourche et avance avec elle (consomme de l'ATP). Modèle eucaryote : anneau (CMG) qui **encercle le brin du haut** (matrice du directeur) et avance 3′→5′ sur lui ; le brin du bas passe à l'extérieur de l'anneau.
- Une **ADN polymérase** n'ajoute des nucléotides qu'à une **extrémité 3′ libre** : le brin neuf croît toujours **5′→3′**, en lisant la matrice 3′→5′. Elle ne peut **pas commencer seule** : il lui faut une amorce.
- La **primase** pose une courte **amorce d'ARN** (~10 nt). Le brin directeur n'en a besoin que d'**une** (posée à l'origine, au début de l'acte II). Le brin retardé en a besoin d'une **par fragment**.
- **Brin directeur** : la polymérase avance dans le même sens que la fourche → synthèse **continue**.
- **Brin retardé** : le sens 5′→3′ pointe **à l'opposé** de la fourche → la polymérase s'éloigne de la fourche, synthétise un **fragment d'Okazaki** jusqu'à buter sur l'amorce du fragment précédent, se détache, et repart d'une nouvelle amorce posée près de la fourche.
- Chaque fragment : 5′ (amorce, côté fourche, à droite) → 3′ (côté gauche).
- **Retrait des amorces** : quand la polymérase du fragment suivant atteint l'amorce précédente, l'ARN est retiré et remplacé par de l'ADN (chez l'humain : Pol δ déplace l'amorce, FEN1 la coupe ; RNase H aide). Il reste une **coupure** (nick) : une liaison phosphodiester manquante.
- La **ligase** scelle la coupure (consomme de l'ATP chez l'humain) → le brin retardé devient continu.
- **Protéines SSB** (RPA chez l'humain) sur l'ADN simple brin exposé du brin du bas.
- Chaque duplex fille = un brin parental + un brin neuf (réplication **semi-conservative**).
- Ordre de grandeur, échelle humaine : fragments d'Okazaki ~150-200 nt, fourche ~30-50 nt/s. Le modèle utilise **L = 180 nt** par fragment et un rythme proche de ce tempo réel (un fragment toutes les ~5-6 s).

## Ce que l'on simplifie (à documenter dans explication.html)
- **Vue dépliée** (actes I à IV) : la boucle « en trombone » du brin retardé est dépliée à plat pour qu'on lise les directions. En réalité les deux polymérases sont attachées au réplisome et voyagent ensemble ; c'est le brin retardé qui fait une boucle. L'acte V montre cette boucle.
- Les duplex filles sont dessinés **à plat** (échelle de barreaux), sans leur torsion en hélice ; seul l'ADN parental est dessiné en hélice. Les barreaux sont un repère, pas un par nucléotide (environ un trait tous les 10 nt).
- Une seule fourche ; en réalité une origine en lance deux, qui s'éloignent l'une de l'autre (bulle).
- Absents du dessin : topoisomérase (qui relâche les surenroulements devant la fourche), pince coulissante (PCNA / β-clamp), chargeur de pince, nucléosomes, correction d'épreuve 3′→5′ exonucléase, partie ADN de l'amorce de Pol α.
- Retrait des amorces compressé en un seul geste visuel (l'ARN rose « fond » en ADN turquoise derrière la polymérase).
- Les deux polymérases ont la même vitesse de lecture dans la réalité ; la polymérase du retardé est ici ~1,5 fois plus rapide dans le repère de la matrice pour laisser voir un temps de « lâcher, revenir, recharger ».
- Les acteurs sont des formes stylisées, pas des structures protéiques.

## Ce qui est illustratif
- Les chevrons de direction sur les polymérases et les petites étiquettes 5′ / 3′ aux extrémités des brins : des repères de lecture, pas des objets.
- Le graphe « distance à la fourche » du panneau : une projection abstraite du mouvement.
- La rotation de l'anneau d'hélicase : évocation de son activité motrice, pas une cinématique réelle.
- Les lueurs : réservées à ce qui consomme de l'énergie (ATP) : scellement par la ligase (éclat `--energie`), et très discrètement l'hélicase.

## Code couleur
- ADN parental : blanc cassé atténué. ADN neuf (directeur ET retardé, même chimie) : `--accent` turquoise. Amorces d'ARN : `--arn` rose. Énergie (ATP consommé par la ligase) : `--energie`.
- Les deux brins neufs ont la **même couleur** : c'est la **forme** (un trait continu contre un trait en segments avec coutures) et le **mouvement** qui les distinguent. C'est voulu.
- `--positif` et `--negatif` ne sont pas utilisés (aucune charge, aucun ion en jeu dans cette page).

## Caméra et géométrie
- Repère de la fourche : la pointe de la fourche (hélicase) est **fixe à l'écran** (~62 % de la largeur sur desktop, ~66 % sur mobile, centrée verticalement dans la scène). L'ADN parental entre par la droite et défile vers la gauche à la vitesse de la fourche ; les duplex filles sortent par la gauche.
- À droite : duplex parental en hélice (deux brins sinusoïdaux qui se croisent, barreaux de paires de bases), qui s'aplatit en arrivant dans l'hélicase.
- À gauche : la branche du haut (duplex fille directeur) et la branche du bas (duplex fille retardé) divergent en Y puis deviennent horizontales.
- Toute la simulation est **une fonction déterministe** de la position de la fourche `F` (en nt) et de l'acte : le fragment k a son amorce à la coordonnée matrice `s_k = k·L`, posée quand `F` atteint `s_k + g` ; sa synthèse va de `s_k` vers `s_(k-1)` à la vitesse `v_p = 1,5·v_f` ; l'amorce k-1 est remplacée quand la synthèse k l'atteint ; la ligase scelle `Δt` plus tard. Rien n'est accumulé image par image : pause, retour en arrière et changement d'acte restent propres.
- Dans le repère de la fourche : polymérase du directeur immobile à l'écran ; polymérase du retardé qui se déplace vers la gauche à `v_f + v_p`, puis revient.

## Mise en scène : cinq actes (stepper)
Les actes se suivent manuellement (boutons, flèches, segments cliquables). Dans un acte, la machine tourne en continu (la fourche avance indéfiniment). Chaque acte repart d'un état de départ propre (fondu enchaîné), où la scène est déjà « amorcée » quand c'est utile pour qu'on ne voie pas un écran vide.

I. **Ouvrir** — Seule l'hélicase agit : la double hélice entre à droite, se déroule, deux brins simples sortent à gauche. Étiquettes 5′/3′ aux bouts : on voit qu'ils sont antiparallèles. SSB sur le simple brin. Phrase : « Deux brins, deux directions opposées. »
II. **Copier dans un seul sens** — Une amorce rose sur le brin du haut, la polymérase du directeur l'allonge et reste collée à l'hélicase : brin turquoise continu. Le brin du bas, lui, reste nu et s'allonge sans copie, couvert de SSB : la tension monte. Chevron 5′→3′ sur la polymérase. Phrase-clé : « Une polymérase n'ajoute qu'à une extrémité 3′. Et le brin du bas ? »
III. **Copier à reculons** (moment fort) — Primase, amorces roses, polymérase du retardé qui part à reculons et revient. Les fragments s'accumulent avec leur amorce rose et une couture visible. Le graphe « distance à la fourche » apparaît dans le panneau : une ligne plate (directeur) contre une dent de scie (retardé).
IV. **Coudre** — Les amorces sont remplacées par de l'ADN, la ligase scelle chaque coupure avec un petit éclat `--energie`. Loin de la fourche, le brin retardé devient aussi continu que le directeur : le résultat est le même, le chemin ne l'était pas.
V. **La vraie machine** — Vue trombone : les deux polymérases côte à côte près de l'hélicase ; la matrice du brin retardé forme une boucle qui grandit pendant la synthèse d'un fragment, puis est relâchée. Tout fonctionne en même temps. (Peut être dessiné de façon plus schématique, mais la topologie doit être juste : la polymérase du retardé synthétise toujours 5′→3′, la boucle contient le fragment en cours.)

## Interface (conventions de la série)
- Scène en vedette (canvas), titre discret en haut à gauche : `L’invisible en mouvement — 08`, puis « La réplication de l'*ADN* ».
- Panneau de lecture à droite (≥ 901 px) / en bas (mobile) : acte et titre, 1 à 3 phrases, puis mesures en direct en IBM Plex Mono : nucléotides copiés, fragments d'Okazaki (formés / scellés), amorces posées (directeur : 1 ; retardé : n), et le **graphe distance à la fourche** (actes III à V ; vide grisé aux actes I-II).
- Légende couleur compacte, ligne clavier, lien « Comprendre ce qui se passe → » et « ← Retour à la série ».
- Barre de contrôles en bas : lecture/pause, segments des cinq actes, vitesse (×0,5 / ×1 / ×2), réinitialiser. Pas de curseur : aucun paramètre libre n'aide ici à comprendre.
- Étiquettes dans la scène : au plus 3 visibles en même temps, petites, IBM Plex Mono, avec un filet fin ; elles apparaissent quand l'acteur entre en jeu, puis s'estompent. Deux étiquettes persistantes près du bord gauche : « brin directeur » (haut) et « brin retardé » (bas), dès l'acte II / III.
- Micro-interaction : survoler / toucher un acteur (hélicase, polymérases, primase, amorce, fragment, coupure, ligase, SSB, brin parental) l'identifie : nom + rôle en une ligne.
- Clavier : Espace = lecture/pause, ← → = acte précédent/suivant, 1 à 5 = acte, R = réinitialiser.
- `prefers-reduced-motion` : vitesse réduite, pas de rotation continue de l'hélicase, transitions en fondu.
