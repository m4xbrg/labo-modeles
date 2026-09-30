# Projet 04 — Le champ électrique

Dossier de sortie : `04-champ-electrique/`. Accent : `--accent: #9fe870;` (vert oscilloscope, pour les équipotentielles et la charge test).

## Intention
Rendre tangible un objet invisible : le champ électrique créé par des charges ponctuelles, et la façon dont une charge test y est poussée.

## Physique (à respecter exactement)
- Loi de Coulomb et superposition : E = Σ k·qᵢ·r̂ᵢ / rᵢ², potentiel V = Σ k·qᵢ / rᵢ.
- Lignes de champ : partent des charges positives, arrivent aux négatives, **nombre de lignes proportionnel à |q|**, ne se croisent jamais. Tracé par intégration numérique (RK4 ou pas adaptatif), pas par approximation visuelle.
- Équipotentielles : toujours **perpendiculaires** aux lignes de champ (marching squares sur une grille de V, ou équivalent).
- Charge test : mouvement intégré numériquement (F = qE, a = F/m), avec gestion de la singularité près d'une charge (distance minimale ou adoucissement) pour éviter l'explosion numérique. L'expliquer dans le document.

## Interaction
- Clic : ajoute une charge (+ par défaut, Maj+clic ou bouton pour −). Molette ou curseur : change sa valeur (±1 à ±5 nC).
- Glisser une charge : tout se recalcule en direct, fluide.
- Double-clic : supprime.
- Bouton « Lâcher une charge test » : une petite charge (signe choisi) part du point cliqué et suit la force, en laissant une traînée qui s'estompe.
- Préréglages : dipôle, deux charges identiques, condensateur plan (deux rangées de charges opposées ; champ quasi uniforme entre les plaques), quadrupôle.
- Survol n'importe où : le panneau affiche |E| (N/C), direction, et V (V) en ce point, en IBM Plex Mono.
- Bascules d'affichage : lignes de champ / équipotentielles / carte de couleur du potentiel / vecteurs.

## Code couleur
Charges + en `--positif`, charges − en `--negatif`, équipotentielles en `--accent` fin et translucide, carte de potentiel en dégradé `--negatif` → `--fond` → `--positif`.

## Moment signature
Quand on glisse une charge, les lignes de champ se réorganisent comme des fils souples, sans scintillement. Le préréglage condensateur doit provoquer un « ah, c'est pour ça que le champ est uniforme ».
