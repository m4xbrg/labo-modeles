# Fondations · Bioélectricité et synapses (module 33)

Dossier de sortie : `opus-sonnet/fondations-bioelectricite/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 33`, titre « D'un gradient à une *tension* ». Accent : `--accent: #ff9ad5;` (rose pâle, parent du neurone sans le copier). Budget : ≈ 0,7 ADN, **un chapitre de 4 étapes**.

**Statut particulier.** Le showcase *Le neurone qui apprend* (`../03-neurone/`) couvre déjà le module 33 en `full` : potentiel d'action (Hodgkin-Huxley) et plasticité synaptique. Cette page ne le refait pas. Elle construit **ce que le neurone suppose sans le montrer** : comment un gradient de concentration devient une tension (Nernst, potentiel de repos), comment le signal voyage le long d'un axone (câble, myéline), et comment un neurone additionne ses entrées. Elle se place entre *Cellule, membrane et transport* (32) et le neurone (03). Si le temps manque, c'est la production de la vague qui peut attendre.

## Intention

À la fin, l'étudiant comprend que **la tension d'une membrane vient de quelques ions qui ont traversé**, et que le signal nerveux est une tension qui se propage en se régénérant. Intuitions à rendre évidentes, par ordre de priorité :

1. Une membrane perméable au K⁺ seul, avec plus de K⁺ dedans : quelques K⁺ sortent, l'intérieur devient négatif, et cette tension freine la sortie jusqu'à l'arrêter. Le flux net s'annule **avant** que les concentrations bougent de façon mesurable (étape 1, moment fort).
2. Le potentiel de repos est un compromis entre les ions auxquels la membrane est perméable ; il penche vers le K⁺ parce que la membrane au repos laisse surtout passer le K⁺ (étape 2).
3. Une tension appliquée en un point d'un fil biologique s'éteint en quelques millimètres ; l'axone la régénère en route, et la myéline la fait sauter de nœud en nœud (étape 3, moment fort).
4. Un neurone additionne des entrées excitatrices et inhibitrices, dans l'espace et dans le temps, et ne décharge que si la somme dépasse le seuil (étape 4).

Interdits : « les ions veulent équilibrer les charges », « le neurone décide de tirer ».

## Réutilisation (ne pas reconstruire)

- Gradients Na⁺/K⁺, pompe, canaux de fuite, boîte à particules : `../fondations-cellule-membrane/` (acte V). L'étape 1 **reprend sa boîte et son rendu** en y ajoutant la charge.
- Potentiel, tension, condensateur, circuit RC : `../04-champ-electrique/`, `../06-courant-circuits/`. La membrane est un condensateur qui fuit ; le dire.
- Potentiel d'action (Hodgkin-Huxley), synapse et plasticité : `../03-neurone/`. L'étape 3 utilise un potentiel d'action simplifié et renvoie au neurone pour le détail.
- Équation de Nernst côté chimie (pile) : `../fondations-acide-base-redox/` (module 31).
- Seuil, rétroaction positive : `../fondations-systemes-hasard/`.

## Moteur (à écrire et tester avant la page)

Bloc `/* BIOE-BEGIN */ … /* BIOE-END */`, objet `BioE`. RT/F = 26,7 mV à 37 °C (310 K).

- **Électrodiffusion à particules** (étape 1) : `boxInit({Kin, Kout, Ain, Aout, perm, seed})` (boîte de la fondation 32, intérieur à gauche, anions imperméants A⁻ pour l'électroneutralité), `boxStep(box, dt)` : les traversées de K⁺ dépendent d'une marche aléatoire biaisée par le champ dans la membrane ; la tension V = Q/C est calculée à partir de la charge nette séparée ; `scaleIons` (règle « une particule dessinée = n ions » et nombre réel d'ions qui traversent, documenté).
- **Théorie** : `nernst(z, Cout, Cin, T)` ; `ghk({pK, pNa, pCl}, conc, T)` ; `chargeToV(nIons, areaCm2, Cm)` (Cm = 1 µF/cm²).
- **Membrane passive et active** (étapes 2 à 4) : `cableInit({length, dx, rm, ri, cm, myelin, nodes})`, `cableStep(c, dt, Iinj)` (équation du câble discrétisée, implicite) ; canaux actifs simplifiés (modèle de FitzHugh-Nagumo ou Hodgkin-Huxley réduit, au choix, documenté) aux nœuds ou partout ; `lengthConstant`, `velocity(c)` (mesurée sur deux électrodes).
- **Intégration synaptique** (étape 4) : `neuronInit({nDend})`, `synapse(kind: 'E'|'I', site, t)`, `somaStep(n, dt)` → potentiel au cône d'émergence, seuil, décharge (simplifiée : intègre-et-tire à fuite).

### Tests du moteur

1. Nernst à 37 °C : K⁺ 140/5 mmol/L → −89 mV ; Na⁺ 12/145 → +67 mV ; Cl⁻ 7/110 → −74 mV (à 1 mV).
2. GHK avec pK : pNa : pCl = 1 : 0,04 : 0,45 et ces concentrations → −70 mV (à 1 mV).
3. Boîte (perméable au K⁺ seul) : le potentiel converge vers le Nernst des concentrations **effectives** de la boîte à 3 % ; la fraction de K⁺ déplacée pour l'atteindre est affichée et reste petite.
4. `chargeToV` : 100 mV sur 1 cm² à 1 µF/cm² → 6,2 × 10¹¹ ions monovalents.
5. Câble passif : profil stationnaire V(x) = V₀ e^(−x/λ) à 2 % ; λ = √(r_m/r_i) à 1 %.
6. Câble actif : propagation sans atténuation ; vitesse avec myéline > 5 × vitesse sans myéline pour le même diamètre ; vitesse sans myéline ∝ √(diamètre) à 10 %.
7. Intégration : deux EPSP sous le seuil, séparés de 1 ms → décharge ; séparés de 30 ms → pas de décharge ; un IPSP simultané annule la décharge.
8. Toutes les simulations restent bornées et sans NaN sur 10⁶ pas.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| Na⁺ | `--positif` ; K⁺ : `--negatif` (même code que 03 et 32 : la couleur dit l'espèce) |
| anions imperméants A⁻ | petits losanges `--texte-2` |
| charge nette séparée (couche contre la membrane) | fin liseré : excès de + `--positif`, excès de − `--negatif`, épaisseur ∝ charge |
| tension membranaire | `--accent` (voltmètre, courbes V(t), V(x)) |
| potentiel d'équilibre (Nernst) | tireté de la couleur de l'ion |
| myéline | manchons `--fond-2` à contour `--texte-2` ; nœuds de Ranvier marqués `--accent` |
| synapse excitatrice / inhibitrice | `--positif` / `--negatif` (petits boutons sur les dendrites) |

## Chapitre · Module 33 · Bioélectricité et synapses

### Étape 1 · Un gradient devient une tension (moment fort)
- Scène : la boîte de la fondation 32 (intérieur à gauche) ; K⁺ concentrés dedans, Na⁺ dehors, anions imperméants dedans. Seuls des canaux à K⁺ sont ouverts. Les K⁺ sortent ; un liseré de charges + se forme sur la face externe et de charges − sur la face interne ; un voltmètre dessiné entre les deux compartiments affiche V. Les traversées dans les deux sens sont comptées (rappel de 32) : la sortie ralentit, l'entrée s'accélère, jusqu'à égalité.
- Contrôles : [K⁺] intérieur et extérieur, ion perméant (K⁺, Na⁺, Cl⁻), bouton « Recommencer ».
- Panneau : V, E_Nernst, sorties/s et entrées/s, nombre d'ions déplacés (dessinés et réels), variation relative de concentration. Statut à l'équilibre : « Le flux net est nul alors que les concentrations n'ont presque pas changé : c'est la tension qui retient le K⁺ ». Un deuxième statut au premier passage : « Une cellule de 10 µm n'a besoin de déplacer qu'environ quatre ions K⁺ sur cent mille pour atteindre −90 mV » (calculé par le moteur, valeur affichée).
- Phrase-clé : « Quelques ions qui traversent séparent des charges ; la tension qui en résulte s'oppose à leur passage. À l'équilibre, gradient chimique et tension s'équilibrent : c'est le potentiel de Nernst. »
- Note : boîte 2D ; la proportion d'ions déplacés est exagérée à l'écran pour être visible, la vraie est affichée.

### Étape 2 · Le potentiel de repos
- Scène : une portion de membrane avec trois sortes de canaux (K⁺, Na⁺, Cl⁻) dont on règle l'ouverture ; une aiguille de voltmètre sur une échelle de −100 à +70 mV où figurent E_K, E_Cl, E_Na. L'aiguille se place entre eux, plus près de l'ion le plus perméant. Bascule « Arrêter la pompe » : très lentement (temps accéléré), les gradients s'effacent et le potentiel dérive vers 0.
- Contrôles : pK, pNa, pCl (trois curseurs), bascule pompe.
- Panneau : V_repos (GHK), les trois E_ion, contribution de chaque ion. Statuts : « Au repos, la membrane laisse surtout passer le K⁺ : V est proche de E_K » ; si pNa ≫ pK : « Ouvrir les canaux à Na⁺ tire V vers +67 mV : c'est ce qui se passe pendant un potentiel d'action ».
- Phrase-clé : « Le potentiel de repos est un compromis entre les ions qui traversent, pondéré par leur perméabilité. La pompe Na⁺/K⁺ entretient les gradients qui le rendent possible. »
- Note : équation de Goldman-Hodgkin-Katz ; contribution électrogène directe de la pompe négligée (quelques mV).

### Étape 3 · Le long de l'axone (moment fort)
- Scène : un long axone horizontal ; deux électrodes d'enregistrement déplaçables et une électrode de stimulation. Bascule de mode : « Fil passif » (aucun canal actif), « Axone nu », « Axone myélinisé ». En passif, le pulse injecté s'étale et s'éteint en quelques λ ; en actif, un potentiel d'action se propage sans s'atténuer (onde de couleur `--accent`) ; en myélinisé, il saute de nœud en nœud.
- Contrôles : diamètre de l'axone, intensité de la stimulation, mode. Bouton « Stimuler aux deux bouts » : les deux potentiels d'action se rencontrent et s'annulent (période réfractaire).
- Panneau : λ (mm), vitesse mesurée entre les électrodes (m/s), délai, V(x) instantané et V(t) aux deux électrodes. Statuts : passif « Sans canaux actifs, le signal meurt en quelques millimètres : un nerf de 1 m ne pourrait rien transmettre » ; myélinisé « Même diamètre, dix à cinquante fois plus vite ».
- Phrase-clé : « La membrane est un câble qui fuit : une tension s'y éteint en quelques millimètres. Le potentiel d'action se régénère en route ; la myéline le fait sauter de nœud en nœud, beaucoup plus vite. »
- Note : modèle de canaux réduit (renvoi à `../03-neurone/` pour Hodgkin-Huxley) ; vitesses réelles citées dans l'explication.

### Étape 4 · Additionner pour décider
- Scène : un neurone stylisé (corps, dendrites, axone) avec des synapses excitatrices et inhibitrices sur les dendrites, qu'on déclenche en cliquant ; des petits potentiels postsynaptiques partent vers le corps cellulaire en s'atténuant ; au cône d'émergence, V(t) s'affiche avec la ligne de seuil. Au-delà du seuil, un potentiel d'action part dans l'axone (le rendu de l'étape 3).
- Contrôles : clic sur les synapses, bouton « Rafale » (trains réguliers à fréquence réglable), bascule « Inhibition près du corps » (une synapse inhibitrice placée sur le corps cellulaire pèse plus lourd).
- Panneau : V au cône d'émergence, seuil, décharges ; journal des entrées. Statuts : sommation temporelle « Deux entrées rapprochées s'additionnent avant de s'éteindre » ; spatiale « Trois synapses en même temps franchissent le seuil » ; inhibition « Une seule synapse inhibitrice bien placée peut tout annuler ».
- Phrase-clé : « Un neurone additionne des milliers de petites entrées, excitatrices et inhibitrices, dans l'espace et dans le temps. Il ne décharge que si la somme dépasse le seuil : c'est là qu'il calcule. »
- Fin de planche, trois questions ouvertes : **Apprendre** « Si une synapse sert souvent, peut-elle devenir plus forte ? » → `../03-neurone/` (plasticité) ; **Muscle** « Comment un potentiel d'action fait-il contracter un muscle ou battre un cœur ? » → module 38 ; **Énergie** « Combien d'ATP coûte un influx nerveux, et qui le paie ? » → module 34.

## Micro-interactions de découverte

K⁺, Na⁺, anion, canal, liseré de charges, voltmètre, E_ion, pompe, axone, électrode, nœud de Ranvier, myéline, potentiel d'action, synapse excitatrice, inhibitrice, cône d'émergence, seuil.

## `window.__labo` (en plus du socle)

`setConc(ion, cin, cout)`, `setPermeant(ion)`, `restart()` (1) ; `setPerm(pK, pNa, pCl)`, `pump(on)` (2) ; `setMode(m)`, `setDiameter(d)`, `stimulate(I, where)` (3) ; `fireSyn(i)`, `burst(i, f)`, `somaInhib(on)` (4).

## Théorie (explication, module 33)

- Relations : \(E_X = \dfrac{RT}{zF}\ln\dfrac{[X]_{\text{ext}}}{[X]_{\text{int}}}\) ; \(V_m = \dfrac{RT}{F}\ln\dfrac{p_K[\text{K}^+]_e + p_{Na}[\text{Na}^+]_e + p_{Cl}[\text{Cl}^-]_i}{p_K[\text{K}^+]_i + p_{Na}[\text{Na}^+]_i + p_{Cl}[\text{Cl}^-]_e}\) ; \(Q = C\,V\) ; \(\lambda = \sqrt{r_m/r_i}\) et \(V(x) = V_0\,e^{-x/\lambda}\) ; \(\tau = r_m c_m\).
- Exemple chiffré possible : nombre d'ions K⁺ qui sortent pour charger à −90 mV une cellule sphérique de 10 µm de diamètre, comparé au nombre de K⁺ qu'elle contient.
- Pièges : « le potentiel de repos vient de la pompe » (elle entretient les gradients, la tension vient des fuites) ; « au repos, aucun ion ne traverse » ; « le potentiel d'action est un courant qui circule le long de l'axone comme dans un fil » ; « plus le stimulus est fort, plus le potentiel d'action est grand » (tout ou rien) ; « la myéline isole donc ralentit ».
- Où ça resservira : 38 (muscle, cœur), 37 (signalisation : canaux ouverts par des ligands), 34 (coût énergétique de la pompe), planche 03 (potentiel d'action et plasticité), 31 (Nernst côté chimie).
- Seulement introduit ici : Hodgkin-Huxley (planche 03), canaux calciques et libération de neurotransmetteurs, synapses électriques, codage par la fréquence.

## Honnêteté

Électrodiffusion en 2D avec une proportion d'ions déplacés exagérée à l'écran ; modèle de canaux réduit ; neurone à quelques compartiments ; synapses sans chimie détaillée.

## Hors champ

Pharmacologie, électrophysiologie expérimentale, réseaux de neurones, neurotransmetteurs en détail, rythmes cérébraux.
