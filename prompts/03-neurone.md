# Projet 03 — Le neurone : de l'impulsion à l'apprentissage

Dossier de sortie : `03-neurone/`. Accent : `--accent: #ff6fae;` (rose-magenta, pour l'activité synaptique et la mémoire).

## Intention
Répondre à la question : **« Qu'est-ce qui se passe dans mon cerveau quand j'apprends quelque chose ? »** en deux actes : comment un neurone transmet un signal électrique, puis comment une connexion se renforce avec la répétition.

## Acte 1 — Le potentiel d'action
- Un neurone : dendrites, soma, axone myélinisé avec nœuds de Ranvier, terminaisons.
- Un **oscilloscope** en direct affiche le potentiel de membrane en mV à un point choisi (clic sur l'axone pour déplacer la sonde).
- Valeurs réalistes : repos ≈ **-70 mV**, seuil ≈ **-55 mV**, pic ≈ **+30 à +40 mV**, hyperpolarisation ≈ **-80 mV**, retour au repos. Durée réelle ≈ 1 à 2 ms (ralentie à l'écran, l'indiquer).
- Vue rapprochée d'un segment de membrane : canaux Na+ qui s'ouvrent (entrée de Na+ en `--positif`) puis s'inactivent ; canaux K+ qui s'ouvrent plus tard (sortie de K+ en `--negatif`) ; pompe Na+/K+ en arrière-plan.
- **Conduction saltatoire** : l'impulsion saute de nœud en nœud.
- Interaction : bouton « Stimuler » avec intensité réglable. Sous le seuil : rien ne part (loi du tout ou rien). Au-dessus : un potentiel d'action complet, toujours de la même amplitude. Stimuler pendant la période réfractaire ne fait rien.

## Acte 2 — La synapse qui apprend
- Zoom sur une synapse : vésicules de glutamate, fente synaptique, récepteurs AMPA et NMDA sur le neurone suivant.
- Chaque potentiel d'action libère du glutamate. Stimulation isolée : réponse faible.
- **Potentialisation à long terme (PLT)** : une stimulation répétée et rapprochée débloque les récepteurs NMDA (retrait de l'ion Mg2+ qui les bouche), laisse entrer du Ca2+, et la synapse insère plus de récepteurs AMPA. La réponse suivante est visiblement plus forte.
- Une jauge « force de la connexion » qui monte avec la répétition et redescend lentement si on arrête (lien avec la répétition espacée, à expliquer dans le document).
- Interaction : l'étudiant « apprend » en cliquant pour répéter ; il voit la connexion s'épaissir et s'illuminer. Rendre visible la règle de Hebb (« des neurones qui s'activent ensemble se connectent ensemble ») en précisant que c'est une simplification.

## Contrôles
Transition fluide entre Acte 1 et Acte 2, lecture/pause, vitesse, réinitialisation.

## Moment signature
Le passage de l'acte 1 à l'acte 2 : la caméra suit l'impulsion jusqu'au bout de l'axone et plonge dans la synapse sans coupure.
