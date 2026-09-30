# Série « Mécaniques invisibles » — direction artistique commune

Quatre pages interactives qui rendent visible ce qui se passe à une échelle qu'on ne voit pas : une cellule qui se divise, une mitochondrie qui produit de l'énergie, un neurone qui apprend, un champ électrique. Les quatre doivent se lire comme une même collection, pas comme quatre démos séparées.

Public : un étudiant curieux (niveau cégep, sciences et génie) qui veut **comprendre**, pas seulement regarder. Chaque page doit enseigner quelque chose de vrai.

## Ambiance

« Carnet de laboratoire la nuit. » Un fond sombre et profond, comme un oculaire de microscope ou un écran d'oscilloscope. Les éléments vivants émettent leur propre lumière douce. Le texte a la sobriété d'une planche scientifique annotée : peu de mots, bien placés, jamais de décor gratuit.

À éviter absolument : dégradés violet-bleu génériques, glassmorphism partout, emojis, icônes clipart, cartes arrondies empilées façon tableau de bord SaaS, texte centré en gros titre « Bienvenue dans... ».

## Palette (tokens CSS obligatoires sur `:root`)

```css
--fond:        #0a0d12;  /* encre profonde */
--fond-2:      #11161e;  /* panneaux */
--trait:       #1f2833;  /* séparateurs, grilles */
--texte:       #e8e4dc;  /* blanc cassé chaud */
--texte-2:     #8a93a0;  /* annotations */
--accent:      /* propre à chaque page, voir le brief du projet */
--positif:     #ff8a5b;  /* charges +, ions Na+, dépolarisation */
--negatif:     #5bb8ff;  /* charges -, ions K+, repolarisation */
--energie:     #ffd166;  /* ATP, énergie libérée, moments clés */
```

Les couleurs `--positif`, `--negatif` et `--energie` ont le **même sens dans les quatre pages**. C'est une convention pédagogique : l'étudiant apprend un code couleur une seule fois.

## Typographie

- Titres : **Instrument Serif** (Google Fonts), grand, italique permis pour un mot clé.
- Interface et texte courant : **IBM Plex Sans**, 15-16 px.
- Valeurs numériques, unités, étiquettes de mesure : **IBM Plex Mono**.
- Prévoir des polices de repli système : la page doit rester lisible hors ligne.

## Structure de page (identique pour les quatre)

1. **Scène** : occupe l'essentiel de l'écran (canvas ou SVG). C'est la vedette.
2. **Titre discret** en haut à gauche : nom de la série en petit (`Mécaniques invisibles — 02`), titre de la page dessous.
3. **Panneau de lecture** (à droite sur grand écran, en bas sur téléphone) : l'étape en cours, 1 à 3 phrases d'explication, les valeurs mesurées en direct.
4. **Contrôles** en bas : lecture/pause, scrubber ou curseurs, bouton de réinitialisation. Sobres, fins, alignés.
5. Lien **« Comprendre ce qui se passe »** vers `explication.html`.
6. Lien de retour vers `../index.html` (l'accueil de la série).

## Règles de motion

- Tout mouvement doit **signifier** quelque chose de physique ou biologique. Pas d'animation décorative qui ne correspond à rien de réel.
- Courbes : `cubic-bezier(0.22, 1, 0.36, 1)` pour les entrées, ressorts amortis pour les objets physiques, jamais de `linear` sauf pour un phénomène réellement linéaire.
- Formes organiques : ondulations lentes (bruit, sinusoïdes superposées), jamais de cercles parfaitement rigides pour du vivant.
- Transitions entre étapes : continues, sans saut. Si l'utilisateur recule dans le temps, l'animation recule proprement.
- Lueur (glow) utilisée avec parcimonie, réservée à ce qui porte de l'énergie ou de l'information.
- 60 images/s visées : `requestAnimationFrame`, canvas mis à l'échelle de `devicePixelRatio`, pas de recalcul coûteux inutile à chaque image.
- Respecter `prefers-reduced-motion` : animations ralenties ou remplacées par des transitions douces.

## Interaction

- Au moins une **micro-interaction de découverte** : survoler ou cliquer un élément l'identifie (nom + rôle en une ligne).
- Clavier : `Espace` = lecture/pause, `←` `→` = reculer/avancer, `R` = réinitialiser.
- Responsive jusqu'à 375 px de large, sans défilement horizontal.

## Contraintes techniques

- Livrable : **un dossier par projet** contenant `index.html` (autonome, CSS et JS inline) et `explication.html`.
- Aucune image externe, aucune image générée. Tout est dessiné (canvas, SVG, CSS).
- Bibliothèques permises seulement depuis cdnjs.cloudflare.com ou cdn.jsdelivr.net, et seulement si elles apportent vraiment quelque chose. Le vanilla est préféré.
- Aucune erreur dans la console.
- Texte entièrement en **français** (québécois neutre, sans anglicismes évitables).

## Le document complémentaire `explication.html`

Même charte visuelle, format article, 600 à 1000 mots. Sections :

1. **Ce que tu vois** : chaque élément de la scène, relié au phénomène réel.
2. **Ce qui se passe vraiment** : le mécanisme expliqué pas à pas, avec les vrais termes scientifiques définis au passage.
3. **Ce que la simulation simplifie** : honnêteté sur les raccourcis pris (échelles, vitesses, nombres de particules). C'est essentiel : l'étudiant doit savoir où s'arrête le modèle.
4. **Les chiffres à retenir** : 3 à 5 ordres de grandeur réels (tailles, durées, tensions, quantités).
5. **Teste-toi** : 3 questions de compréhension, réponses repliées dans des `<details>`.

L'accent reste sur la page interactive. L'explication la complète, elle ne la remplace pas.

## Note de design à rendre

En commentaire HTML en tête de `index.html` : 3 lignes qui justifient les choix de design et de motion propres à cette page.
