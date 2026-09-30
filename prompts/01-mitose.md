# Projet 01 — La mitose

Dossier de sortie : `01-mitose/`. Accent : `--accent: #7ee0b5;` (vert pâle, pour l'ADN et le fuseau).

## Intention
Montrer qu'une cellule qui se divise est une **machine mécanique** : des chromosomes condensés, tirés par des câbles (microtubules) ancrés à deux pôles, puis une membrane qui se pince en deux.

## Scène
Une cellule animale vue au microscope, membrane qui ondule doucement, noyau visible. Utiliser **2 paires de chromosomes homologues** (4 chromosomes, 2n = 4), chacune d'une teinte distincte dans la famille de l'accent, pour que l'étudiant puisse suivre chaque chromatide.

## Déroulement (ordre obligatoire, scientifiquement correct)
1. **Interphase (fin, après la phase S)** : chromatine diffuse dans le noyau, ADN déjà répliqué, deux centrosomes côte à côte.
2. **Prophase** : la chromatine se condense en chromosomes à deux chromatides sœurs unies au centromère ; les centrosomes migrent vers les pôles opposés ; le fuseau commence à se former.
3. **Prométaphase** : l'enveloppe nucléaire se fragmente ; les microtubules s'attachent aux kinétochores.
4. **Métaphase** : les chromosomes s'alignent sur la plaque équatoriale, tension visible dans les microtubules.
5. **Anaphase** : les chromatides sœurs se séparent (la cohésine est clivée) et sont tirées vers les pôles ; la cellule s'allonge.
6. **Télophase** : deux enveloppes nucléaires se reforment, les chromosomes se décondensent.
7. **Cytocinèse** : anneau contractile, sillon de division, deux cellules filles identiques.

## Contrôles
- Scrubber de temps continu avec les phases marquées dessus ; on peut glisser à n'importe quel instant et l'image correspond exactement à cet instant (animation déterministe en fonction de `t`, pas d'état accumulé).
- Lecture/pause, vitesse (0,5x / 1x / 2x).
- Clic sur un chromosome : il s'illumine, et on peut suivre ses deux chromatides jusqu'aux cellules filles.
- Survol : centrosome, microtubule, kinétochore, enveloppe nucléaire, anneau contractile s'identifient.

## Panneau de lecture
Phase en cours, 2 phrases, compteur « chromosomes : 4 | chromatides : 8 » qui devient « 2 cellules × 4 chromosomes » à la fin.

## Moment signature
L'anaphase : la séparation est le climax. Un bref éclat `--energie` à la rupture de la cohésine, puis une traction fluide et amortie.
