# Feuille de route : les planches qui restent à faire

Rédigée le 2026-10-06, à partir de `corpus/` (état au 2026-10-04, 18 modèles). Ce fichier dit **ce qu'il reste à construire et dans quel ordre** ; `corpus/` reste la source de vérité sur ce qui existe. Quand une production est fusionnée, on coche sa ligne ici et on met le corpus à jour (voir [`SESSION-FONDATION.md`](SESSION-FONDATION.md), « Corpus »).

## En une phrase

Pour que les 50 modules soient couverts, il faut **23 nouvelles pages de fondations** (≈ 20 ADN), organisées en sept vagues qui suivent les chaînes de préalables, plus une piste parallèle de **mise au standard** des pages existantes. Chacune a un brief complet, prêt à coller dans une session.

## Comment c'est organisé

- **Une page par production**, une production couvre un ou deux modules canoniques. On ne regroupe deux modules que s'ils partagent un moteur et une scène (26 · 27, 28 · 29, 41 · 42, 43 · 44). Les gros modules que `fondations.md` désigne comme candidats au découpage (34, 38, 44, 48) restent **une page de 4 étapes** chacun : la richesse en plus ira aux showcases, pas aux fondations.
- **Un chapitre par module, 2 à 4 étapes par chapitre** (`corpus/standards.md` §3). Une page à un module a donc 4 étapes ; une page à deux modules, 7 ou 8.
- **Les vagues suivent les chaînes de préalables** de `fondations.md` : on finit une branche avant d'ouvrir la suivante, pour que chaque page puisse renvoyer à des pages qui existent déjà. L'ordre des vagues 1 à 3 est celui que le corpus prévoit déjà ; celui des vagues 4 à 7 est une proposition.
- **Chaque page se termine par deux ou trois questions** qui pointent vers les modules suivants : c'est ce qui coud la carte.
- **Fabrication** : une session Claude Code par production, avec le bloc de [`SESSION-FONDATION.md`](SESSION-FONDATION.md). Opus écrit et teste le moteur, des sous-agents Sonnet construisent la page et l'explication, Opus intègre et vérifie, la PR met le corpus à jour.

## Vue d'ensemble

| Vague | Page (slug `fondations-…`) | Modules | Étapes | ADN | Brief | Préalables principaux |
|---|---|---|---|---|---|---|
| 1 · D | [x] `magnetisme-induction` | 23 | 4 | 0,8 | [écrit](fondations-magnetisme-induction.md), construite le 2026-10-06 | 21, 22 |
| 1 · D | [x] `onde-electromagnetique` | 24 | 4 | 0,8 | [écrit](fondations-onde-electromagnetique.md), construite le 2026-10-07 | 15, 21, 23 |
| 1 · D | [ ] `optique` | 25 | 4 | 0,8 | [écrit](fondations-optique.md) | 15, 24 |
| 2 · E | [ ] `atomes-spectres` | 26 · 27 | 4 + 3 | 1,2 | [écrit](fondations-atomes-spectres.md) ; chapitre 26 construit le 2026-10-07, chapitre 27 à faire | 21, 24, 46 |
| 2 · E | [x] `molecules-mole` | 28 · 29 | 4 + 3 | 1,1 | [écrit](fondations-molecules-mole.md), construite le 2026-10-06 | 21, 27 |
| 2 · E | [x] `reactions-chimiques` | 30 | 4 | 0,8 | [écrit](fondations-reactions-chimiques.md), construite le 2026-10-06 | 17, 28, 29 |
| 2 · E | [x] `acide-base-redox` | 31 | 4 | 0,8 | [écrit](fondations-acide-base-redox.md), construite le 2026-10-06 | 22, 29, 30 |
| 3 · F | [x] `bioelectricite` | 33 | 4 | 0,7 | [écrit](fondations-bioelectricite.md), construite le 2026-10-07 | 22, 32, 31 |
| 3 · F | [ ] `energie-biologique` | 34 | 4 | 0,8 | [écrit](fondations-energie-biologique.md) | 30, 31, 32 |
| 3 · F | [ ] `information-genetique` | 35 | 4 | 0,8 | [écrit](fondations-information-genetique.md) | 28, 32, 34 |
| 3 · F | [ ] `genome-variation` | 36 | 4 | 0,8 | [écrit](fondations-genome-variation.md) | 35, 07 |
| 3 · F | [x] `signalisation-homeostasie` | 37 | 4 | 0,8 | [écrit](fondations-signalisation-homeostasie.md), construite le 2026-10-07 | 04, 30, 34, 35 |
| 4 · G | [ ] `physiologie-circulation` | 38 | 4 | 0,9 | [écrit](fondations-physiologie-circulation.md) | 20, 33, 34 |
| 4 · G | [ ] `immunite-coagulation` | 39 | 4 | 0,8 | [écrit](fondations-immunite-coagulation.md) | 36, 37 |
| 5 · I-J | [ ] `rayonnement-etoiles` | 43 · 44 | 3 + 4 | 1,2 | [écrit](fondations-rayonnement-etoiles.md) | 13, 17, 26, 27 |
| 5 · I-J | [ ] `relativite-generale` | 47 | 4 | 0,9 | [écrit](fondations-relativite-generale.md) | 13, 46 |
| 5 · I-J | [ ] `cosmologie` | 45 | 4 | 0,9 | [écrit](fondations-cosmologie.md) | 13, 24, 27, 43 |
| 6 · K | [ ] `quantique` | 48 | 4 | 0,9 | [écrit](fondations-quantique.md) | 06, 07, 15 |
| 6 · K | [ ] `etats-quantiques` | 49 | 4 | 0,9 | [écrit](fondations-etats-quantiques.md) | 48, 27 |
| 6 · K | [ ] `spin-intrication` | 50 | 4 | 0,8 | [écrit](fondations-spin-intrication.md) | 48, 25 |
| 7 · H | [ ] `populations-emergence` | 41 · 42 | 4 + 4 | 1,2 | [écrit](fondations-populations-emergence.md) | 04, 05, 07, 40 |
| parallèle · A | [ ] `chaos` | 08 | 4 | 0,8 | [écrit](fondations-chaos.md) | 04, 14 |
| parallèle · A | [ ] `signaux-fourier` | 09 | 4 | 0,7 | [écrit](fondations-signaux-fourier.md) | 06, 15, 22 |

Total : 23 pages, 105 étapes, ≈ 20 ADN. À la fin, les 50 modules sont couverts en `full`.

### Pourquoi cet ordre

1. **D · Électromagnétisme et lumière (23 → 24 → 25).** C'est la suite directe de ce qui existe (21, 22) et le seul trou au milieu de la chaîne « Mouvement et électromagnétisme ». 24 et 25 servent ensuite à tout le reste (spectres, couleurs des étoiles, photons).
2. **E · Atomes et chimie (26·27 → 28·29 → 30 → 31).** Les atomes et les spectres ouvrent à la fois la chimie et l'astrophysique ; la chimie est le préalable de toute la biologie moléculaire qui reste.
3. **F · Cellule (33 → 34 → 35 → 36 → 37).** Elle ferme la branche ouverte par 32. Le 33 est déjà couvert par le showcase du neurone : sa page est la moins urgente de la vague et peut glisser à la fin.
4. **G · Physiologie (38, 39).** Elle suppose 33, 34 et 37 : elle vient juste après.
5. **I-J · Astrophysique et relativité générale (43·44 → 47 → 45).** C'est l'ambition d'origine de LABO (supernova, étoiles à neutrons, trous noirs) ; elle ne demande que des pages déjà prévues avant elle (13, 26·27, 46).
6. **K · Quantique (48 → 49 → 50).** Elle s'appuie sur 06, 07, 15, 25 et 27 ; 49 débloque l'idée sélectionnée « Barrière et effet tunnel ».
7. **H · Populations et émergence (41·42).** Très visuelle et sans préalable lourd : elle peut être avancée à tout moment si l'envie s'en fait sentir.
- **Parallèle · A (08, 09).** Indépendants de tout le reste ; à intercaler quand une session est libre. 09 est utile avant 43 (spectres) ; 08 débloque l'idée sélectionnée « Double pendule et chaos ».

## Piste parallèle : mettre les pages existantes au standard

Neuf des pages construites avant `corpus/standards.md` n'en respectent pas encore la navigation (un chapitre par module, 2 à 4 étapes) ; *Rotation, gravitation et orbites*, *Matière, chaleur et transport* et *Courant et circuits* sont déjà conformes. Le détail est dans le tableau du §3 de `standards.md` ; en résumé, avec la page de préalables en plus :

| Page | À faire |
|---|---|
| Langage scientifique (01·02·03) | Aplatir les onglets imbriqués en trois chapitres ; ajouter un toy d'**analyse dimensionnelle** au chapitre 01 (aujourd'hui seulement dans l'explication). |
| Systèmes, croissance et hasard (04·05·07) | Regrouper A + B sous 04 ; **compléter 07** (probabilités conditionnelles, loi binomiale, théorème central limite) pour le faire passer en `full`. |
| Oscillations et ondes (06·14·15) | Ramener le chapitre 15 de 5 à 4 étapes. |
| Forces, énergie et conservation (10·11) | Nommer les chapitres par module. |
| Flux, gradients, champs et fluides (16·20) | Aplatir les onglets imbriqués en deux chapitres. |
| Le champ électrique (21) | Structurer le bac à sable en 2 à 4 étapes. |
| Cellule, membrane et transport (32) | 7 → 4 étapes. |
| Évolution et génétique des populations (40) | 11 → 4 étapes ; ce qui annonce 41 peut migrer vers la future page 41·42. |
| Relativité restreinte (46) | 8 → 4 étapes ; ce qui annonce 47 peut migrer vers la future page 47. |
| Préalables (`opus-sonnet/prealables.html`) | Ajouter la supernova et les pages de fondations. |

Règle : on ne jette pas de contenu, on regroupe des scènes voisines en une étape. Une session par page, avec ce bloc :

```text
Tu mets une page de LABO au standard, sans réécrire sa science. Lis corpus/standards.md, prompts/SESSION-FONDATION.md (partie 2) et la page opus-sonnet/<dossier>/. Objectif : <ligne du tableau de prompts/FEUILLE-DE-ROUTE.md, piste parallèle>. Regroupe des scènes voisines plutôt que d'en supprimer ; garde window.__labo et ajoute-y goStep ; vérifie (console vide, 1440, 1366 × 768 et 375 px, chaque étape visitée) ; mets à jour corpus/models.json (parts, parts_kind: "step") et le tableau de standards.md ; PR vers main.
```

## Showcases que chaque vague rend possibles

Les fondations ne sont pas une fin : elles rendent les showcases moins lourds. Aucun n'est requis pour couvrir la carte ; ce sont les candidats naturels, à choisir dans l'Atlas quand une vague est finie.

| Après | Candidats (Atlas) |
|---|---|
| Vague 1 · D | Moteur électrique et génératrice ; aurores (particules piégées dans le champ terrestre) ; arc-en-ciel |
| Vague 2 · E | Pile galvanique ; catalyse en surface ; titrage |
| Vague 3 · F | Photosynthèse (le chloroplaste en entier) ; transcription d'un vrai gène |
| Vague 4 · G | Battement du cœur ; contraction musculaire ; néphron |
| Vague 5 · I-J | **Supernova v2** (effondrement → rebond → choc → neutrinos, sans réexpliquer les étoiles) ; collision de deux étoiles à neutrons ; trou noir |
| Vague 6 · K | Microscope à effet tunnel ou désintégration α (si 49 absorbe l'idée « Barrière et effet tunnel ») |
| Parallèle · A | **Double pendule et chaos** (idée sélectionnée) |
| Vague 7 · H | Épidémie sur un réseau réel ; Game of Life comme objet d'exploration |

## État

| | |
|---|---|
| Briefs écrits | 23 (toutes les vagues et la piste A) |
| Construites depuis cette feuille de route | 2 (23 · magnétisme et induction ; 28 · 29 · molécules et mole) |
