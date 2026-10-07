# Gabarit de planche LABO

Le dossier `labo/` porte l’accueil de LABO et la direction visuelle des planches à venir. Ce fichier explique comment fabriquer une nouvelle **planche maquette** dans cette direction, à partir de [`gabarit.html`](gabarit.html). Une maquette n'est pas un modèle : elle ne compte pas dans `corpus/` tant qu'elle n'est pas devenue une vraie planche validée.

## Les fichiers

| Fichier | Rôle | À modifier pour une nouvelle planche ? |
|---|---|---|
| `labo.css` | Jetons (papier, encre, couleurs des phénomènes, polices), lecture d'instrument, barre. | Non, sauf nouveau jeton de couleur. |
| `planche.css` | Structure commune : titre et signature, couches, scène, calques, équations, fiche, théorie, voisins, densité laptop et mobile. | Non. |
| `planche.js` | Couches Observer / Manipuler / Comprendre (onglets, flèches, touches 1 2 3, `?mode=`), Échap, position « NN / 50 » et voisins lus dans le corpus. | Non. |
| `corpus.js` | Lit `../corpus/*.json`. Aucune donnée. | Non. |
| `presentation.js` | Habillage : couleur par domaine, formule d'en-tête, pictogramme, textes des phénomènes, **liste des maquettes**. | Oui : une ligne dans `MAQUETTES`. |
| `gabarit.html` | Squelette commenté d'une planche, avec une scène de démonstration. | On le copie. |

## Fabriquer une planche maquette

1. **Copier** `gabarit.html` sous un nom parlant (`membrane.html`, `orbitales.html`).
2. **Rattacher** : `<body data-module="NN">` avec le numéro canonique du module (`corpus/modules.json`). La barre affiche alors « Fondations · domaine · NN / 50 » et le bas de page relie les modules voisins, ouverts, en maquette ou à venir. Ne jamais inventer de numéro.
3. **Déclarer** la maquette dans `presentation.js` : `MAQUETTES: { NN: 'ma-planche.html' }`. L'index la montre alors comme « maquette » au bon module, tant qu'aucun vrai modèle ne l'ouvre.
4. **Remplacer** les blocs marqués « À REMPLACER » : titre, phrase d'accroche, signature, état du phénomène, dessin. Garder le reste.
5. **Vérifier** (voir plus bas).

## Les règles de la direction

- **UI silencieuse, phénomène expressif.** Le papier, l'encre et les traits restent neutres ; la couleur appartient au phénomène (`--phenomene`, ou un jeton de `labo.css` comme `--champ-b`, `--vivant`). Pas d'« application bleue » : chaque domaine garde sa teinte.
- **Trois voix typographiques.** Plex Sans pour l'interface et les titres ; Plex Mono pour les mesures, unités et étiquettes ; Instrument Serif italique **seulement** pour les symboles mathématiques (`.m`, `.vec`, `.eqn`, `.lecture .s`).
- **Signature** obligatoire sous le titre : Échelle · Temps · Modèle.
- **Trois couches.** Observer : la scène seule, rien à régler. Manipuler : les valeurs `.scrub` et les `.pas` apparaissent, les objets se touchent. Comprendre : équations et repères numérotés sur la scène, théorie dans la bande du bas. Classes de visibilité : `.lire` (Manipuler et Comprendre), `.manip` (Manipuler ; ajouter `.aussi` pour rester en Comprendre), `.comp` (Comprendre).
- **Contrôles contextuels.** Pas de panneau de curseurs : on règle une valeur là où elle s'affiche, ou dans une fiche qui s'ouvre sur l'objet touché.
- **Calques.** Le phénomène se dessine dans un SVG (ou un canvas) au `viewBox` fixe ; les étiquettes HTML se posent par-dessus en pourcentage de ce viewBox (`pc(el, x, y)`). Si des étiquettes suivent un objet mobile, les écarter les unes des autres (tester les rectangles des étiquettes à chaque image et décaler celles qui se recouvrent ou couvrent un objet).

## Composants

**Lecture d'instrument** : symbole, valeur, unité.

```html
<span class="lecture" style="--c:var(--phenomene)">
  <span class="s">B</span><span class="eq">=</span><span class="v">16,7</span><span class="u">µT</span>
</span>
```

**Équation de composition** : posée dans la scène, à côté de ce qu'elle décrit, avec une légende courte.

```html
<div class="ov eqn" style="left:57%;top:3%">
  <span class="vec">F</span><span class="op">=</span>q&#8239;<span class="vec">v</span><span class="op">×</span><span class="vec b">B</span>
  <small>force sur une charge en mouvement</small>
</div>
```

Fraction : `<span class="frac"><span>μ₀ I</span><span>2π r</span></span>`.

**Fiche contextuelle** : `<div class="fiche" role="dialog">`, ouverte par la classe `.ouverte`, fermée par Échap (`Planche.surEchap`), en revenant à Observer (`Planche.surMode`) ou par un clic ailleurs. Contenu : `.label`, `.rangee`, `.seg` (choix), `input[type=range]`.

**Repère numéroté** : `<span class="rep">1</span>` sur la scène (calque `.comp`) et le même dans le `<h3>` de la section de théorie.

## API de `planche.js`

| Appel | Effet |
|---|---|
| `Planche.mode('manipuler')` | Change de couche. |
| `Planche.actif()` | `true` hors Observer. |
| `Planche.surMode(m => …)` | Réagir à un changement de couche. |
| `Planche.surEchap(() => …)` | Réagir à Échap. |

## Vérifier

- Servir le dépôt par HTTP (`python -m http.server` à la racine, puis ouvrir `/labo/…`) : `file://` ne lit pas le corpus.
- Console propre ; aucun lien cassé ; rendu à 1440 px, 1366 × 768 (la scène doit tenir dans l'écran) et 375 px, sans défilement horizontal.
- `prefers-reduced-motion` : la boucle ralentit, rien ne clignote.
- Si le navigateur intégré est masqué, `requestAnimationFrame` s'arrête et la planche paraît figée : tester en navigateur headless (Playwright avec Edge) ou dans un onglet visible.

## Migrer une planche existante (planche à étapes)

Les planches de `opus-sonnet/` ont leur propre simulation (canvas ou SVG), souvent plusieurs milliers de lignes. On ne les réécrit pas : on les **habille**. Référence complète : [`opus-sonnet/fondations-oscillations-ondes/index.html`](../opus-sonnet/fondations-oscillations-ondes/index.html).

**Principe.** La scène reste un *écran d'instrument* : son fond sombre, ses couleurs, ses lueurs et tout son JavaScript de simulation sont conservés. Tout ce qui l'entoure suit le thème LABO (clair ou sombre) : barre, titre et signature, chapitres et étapes, couches, panneau de lecture, contrôles.

**Recette.**

1. `<head>` : charger `../../labo/labo.css` **avant** le `<style>` de la page, puis `../../labo/planche-etapes.css` et `../../labo/theme.js` **après**. Le style de la page reste : il porte les jetons de l'écran (`--fond`, `--texte`, `--accent`…) que lit le JavaScript. Pour conserver aussi les jetons partagés en thème explicite, donner au sélecteur d’origine la priorité suivante : `:root, :root[data-theme], :root:not([data-theme])` ; vérifier la palette en auto, clair et sombre.
2. `<body class="labo-etapes" data-mode="observer" data-touches="omc">` (les chiffres servent aux étapes, donc les couches passent sur O, M, C). Si une touche est déjà une commande de simulation, la conserver et choisir une autre lettre dans `data-touches` ainsi que dans l’onglet : O/M/K pour Magnétisme et Molécules, V/M/C pour Onde électromagnétique, O/A/C pour Atomes.
3. Avant le conteneur principal, insérer la coque : `header.barre` (LABO, ← Fondations ou ← Phénomènes, `p.pos`, bouton de thème), `div.titre` (h1, `p.lead` d'une phrase, `dl.sig` Échelle · Temps · Modèle), `nav.chapitres#stepper`, `div.modes` (trois onglets avec `data-indice`, `p.indice#indice`).
4. **Chapitres.** Page de fondations : un `div.chap` par module canonique (`p.chap-t` avec `<b>NN</b>` et le titre canonique), contenant 2 à 4 boutons d'étape. Les codes d'étape sont `NN.k` (`14.2`). Showcase : un seul chapitre, le phénomène, et ses actes.
5. Chaque bouton d'étape garde la classe et l'attribut d'origine (`.seg`, `data-a`, ou ce que le JavaScript lit) pour que la navigation existante continue de marcher. Pour regrouper deux scènes en une étape sans toucher à la physique : un bouton avec deux index (`data-a` et `data-b`), et une bascule « Scène : … | … » dans les contrôles.
6. Sortir le titre superposé de la scène, et réduire la réserve que le dessin lui laissait (`headH()` ou équivalent).
7. **Couches** dans le panneau : classe `couche-lire` sur les mesures et graphes (visibles en Manipuler et Comprendre), `couche-comp` sur le texte explicatif et le lien de théorie (Comprendre seulement). Les réglages (`#tools` ou équivalent) disparaissent en Observer. Un graphe masqué doit être redimensionné lorsqu’il redevient visible, par exemple avec un `ResizeObserver` sur son conteneur.
8. Pour les fondations, le lien « Comprendre ce qui se passe » devient « Théorie du module NN » vers `explication.html#mNN`, mis à jour à chaque étape. Pour un showcase, garder « Comprendre ce qui se passe » vers `explication.html` et le retour « ← Phénomènes » vers `../../labo/index.html#phenomenes`.
9. En fin de page, charger `../../labo/planche.js` (couches, hauteur de l'écran ajustée à la fenêtre).

**Vérifier** : console propre ; aucune requête en échec ; pas de défilement horizontal à 375 px ; l'écran et ses contrôles tiennent dans 1366 × 768 ; chaque étape s'ouvre et le bon module est marqué ; clair et sombre.
