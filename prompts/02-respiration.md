# Projet 02 — La respiration cellulaire

Dossier de sortie : `02-respiration/`. Accent : `--accent: #c38bff;` (violet, pour les électrons et les porteurs NADH/FADH2).

## Intention
Suivre **une molécule de glucose** jusqu'à l'ATP, et montrer que la mitochondrie est une centrale électrique : un gradient de protons fait tourner une vraie turbine moléculaire.

## Scène
Une vue en coupe où la caméra glisse ou zoome à travers 4 tableaux, reliés sans coupure :
1. **Glycolyse** (cytoplasme) : glucose (6 C) → 2 pyruvates (3 C). Bilan net : 2 ATP, 2 NADH.
2. **Oxydation du pyruvate** (entrée dans la matrice) : pyruvate → acétyl-CoA + CO2, 1 NADH par pyruvate.
3. **Cycle de Krebs** (matrice) : un vrai cycle qui tourne, deux tours par glucose. Par tour : 3 NADH, 1 FADH2, 1 ATP (ou GTP), 2 CO2 libérés.
4. **Chaîne de transport d'électrons + ATP synthase** (membrane interne) : les électrons des NADH/FADH2 passent de complexe en complexe (I, III, IV ; FADH2 entre au complexe II), les protons H+ sont pompés vers l'espace intermembranaire, O2 accepte les électrons et forme H2O. Les protons redescendent par l'ATP synthase, dont le rotor tourne réellement et fabrique l'ATP.

## Contrôles
- Navigation entre les 4 étapes (boutons + scrubber global) et vue « tout le trajet ».
- Curseur **concentration en O2** : à zéro, la chaîne s'arrête, le gradient s'effondre, la turbine ralentit puis s'arrête. C'est l'interaction clé : elle fait comprendre pourquoi on respire.
- Survol de chaque complexe, porteur et molécule : nom + rôle.

## Panneau de lecture
Compteur cumulatif d'ATP pour le glucose suivi, par étape. Total réaliste : **environ 30 à 32 ATP** (l'explication dit pourquoi les anciens manuels donnent 36-38). Compteurs NADH, FADH2, CO2 libérés.

## Code couleur
Électrons et porteurs réduits en `--accent`, protons H+ en `--positif`, ATP en `--energie`, O2/H2O en `--negatif`.

## Moment signature
L'ATP synthase : le rotor tourne à la vitesse du flux de protons, et chaque ATP formé jaillit avec une petite lueur `--energie`. Elle doit évoquer une turbine hydroélectrique, pas un simple cercle qui tourne.
