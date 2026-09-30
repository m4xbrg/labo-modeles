# Prompt de session (à coller dans une autre session)

Copie le bloc ci-dessous. Remplace `XX-projet` par le brief voulu (`01-mitose`, `02-respiration`, `03-neurone`, `04-champ-electrique`) et `MODELE` par le nom du dossier de sortie (`astra`, `opus-seul`, etc.).

Pour Astra (sans accès à tes fichiers), utilise plutôt `astra-neurone.md`, qui contient tout le texte en un seul bloc.

---

```text
Tu construis une page web interactive de vulgarisation scientifique, qui fait partie d'une série de quatre.

Lis d'abord, en entier :
1. C:\Users\m4xbr\Documents\labo-modeles\prompts\00-direction-artistique.md  (charte commune, obligatoire)
2. C:\Users\m4xbr\Documents\labo-modeles\prompts\XX-projet.md  (brief du projet)

Livre dans C:\Users\m4xbr\Documents\labo-modeles\MODELE\XX-projet\ :
- index.html : la page interactive, autonome (CSS et JS inline).
- explication.html : le document complémentaire décrit dans la charte.

Exigences :
- Exactitude scientifique d'abord : un comportement faux est un échec, même s'il est joli.
- Le design et le motion doivent être de niveau portfolio : c'est l'objet principal de l'évaluation.
- Ouvre la page dans un navigateur (Playwright via Edge si disponible) et vérifie : aucune erreur console, animation fluide, rendu correct à 1440 px et à 375 px de large. Corrige ce que tu trouves.
- Ne touche à rien en dehors de ton dossier de sortie.

À la fin, rends un court rapport : ce qui est fait, ce que tu as vérifié et comment, les simplifications scientifiques assumées, et ce que tu améliorerais avec plus de temps.
```
