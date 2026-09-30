# Prompts de session : Opus 5.5 orchestre, sous-agents Sonnet 5.5

Ouvre une nouvelle session Claude Code dans `labo-modeles`, choisis **Opus 5.5** dans le sélecteur de modèle, puis colle un des blocs ci-dessous. Une session par planche.

## 01-mitose

```text
Tu es l'orchestrateur (Claude Opus 5.5) d'un petit projet : une planche web interactive de vulgarisation scientifique sur la mitose. Tu ne codes pas toi-même l'essentiel : tu diriges des sous-agents Sonnet 5.5, puis tu intègres et tu vérifies. Le but est de tester ce duo Opus + Sonnet.

1. Lis en entier :
   - <dossier du projet>/prompts/00-direction-artistique.md (charte commune, obligatoire)
   - <dossier du projet>/prompts/01-mitose.md (brief du projet)

2. Planifie. Découpe le travail en 2 à 4 lots indépendants (par exemple : moteur de simulation et scène, contrôles et panneau de lecture, document explication.html, passe finale de motion). Pour chaque lot, écris un brief précis : contrat d'interface (noms de fonctions, format des données, variables CSS), critères d'acceptation, exactitude scientifique attendue.

3. Délègue. Lance les lots avec l'outil Agent en fixant model: "sonnet". Parallélise ce qui est indépendant. Chaque sous-agent écrit dans un fichier de travail distinct sous le dossier de sortie, jamais dans le même fichier qu'un autre.

4. Intègre et critique. Assemble le tout dans index.html (autonome, CSS et JS inline) et explication.html. Relis avec un œil de directeur artistique et de scientifique : si un lot n'est pas au niveau, renvoie-le au sous-agent avec des corrections précises plutôt que de tout réécrire toi-même.

5. Vérifie. node --check sur le JS extrait ; si Playwright est disponible (channel: 'msedge', sans télécharger de navigateur), ouvre la page, capture les erreurs console et des captures à 1440 px et 375 px. Corrige ce que tu trouves. Si tu ne peux pas vérifier dans un navigateur, dis-le.

Dossier de sortie : <dossier du projet>/opus-orchestre/01-mitose/ . Ne touche à rien d'autre. Pas de git. Pas d'emoji.

Rapport final (moins de 250 mots) : ton découpage, ce que chaque sous-agent a livré, combien d'allers-retours de correction, ce que tu as vérifié et comment, les simplifications scientifiques assumées, et ton avis honnête sur ce que la délégation a apporté ou coûté.
```

## 02-respiration

```text
Tu es l'orchestrateur (Claude Opus 5.5) d'un petit projet : une planche web interactive de vulgarisation scientifique sur la respiration cellulaire. Tu ne codes pas toi-même l'essentiel : tu diriges des sous-agents Sonnet 5.5, puis tu intègres et tu vérifies. Le but est de tester ce duo Opus + Sonnet.

1. Lis en entier :
   - <dossier du projet>/prompts/00-direction-artistique.md (charte commune, obligatoire)
   - <dossier du projet>/prompts/02-respiration.md (brief du projet)

2. Planifie. Découpe le travail en 2 à 4 lots indépendants (par exemple : moteur de simulation et scène, contrôles et panneau de lecture, document explication.html, passe finale de motion). Pour chaque lot, écris un brief précis : contrat d'interface (noms de fonctions, format des données, variables CSS), critères d'acceptation, exactitude scientifique attendue.

3. Délègue. Lance les lots avec l'outil Agent en fixant model: "sonnet". Parallélise ce qui est indépendant. Chaque sous-agent écrit dans un fichier de travail distinct sous le dossier de sortie, jamais dans le même fichier qu'un autre.

4. Intègre et critique. Assemble le tout dans index.html (autonome, CSS et JS inline) et explication.html. Relis avec un œil de directeur artistique et de scientifique : si un lot n'est pas au niveau, renvoie-le au sous-agent avec des corrections précises plutôt que de tout réécrire toi-même.

5. Vérifie. node --check sur le JS extrait ; si Playwright est disponible (channel: 'msedge', sans télécharger de navigateur), ouvre la page, capture les erreurs console et des captures à 1440 px et 375 px. Corrige ce que tu trouves. Si tu ne peux pas vérifier dans un navigateur, dis-le.

Dossier de sortie : <dossier du projet>/opus-orchestre/02-respiration/ . Ne touche à rien d'autre. Pas de git. Pas d'emoji.

Rapport final (moins de 250 mots) : ton découpage, ce que chaque sous-agent a livré, combien d'allers-retours de correction, ce que tu as vérifié et comment, les simplifications scientifiques assumées, et ton avis honnête sur ce que la délégation a apporté ou coûté.
```

## 03-neurone

```text
Tu es l'orchestrateur (Claude Opus 5.5) d'un petit projet : une planche web interactive de vulgarisation scientifique sur le neurone. Tu ne codes pas toi-même l'essentiel : tu diriges des sous-agents Sonnet 5.5, puis tu intègres et tu vérifies. Le but est de tester ce duo Opus + Sonnet.

1. Lis en entier :
   - <dossier du projet>/prompts/00-direction-artistique.md (charte commune, obligatoire)
   - <dossier du projet>/prompts/03-neurone.md (brief du projet)

2. Planifie. Découpe le travail en 2 à 4 lots indépendants (par exemple : moteur de simulation et scène, contrôles et panneau de lecture, document explication.html, passe finale de motion). Pour chaque lot, écris un brief précis : contrat d'interface (noms de fonctions, format des données, variables CSS), critères d'acceptation, exactitude scientifique attendue.

3. Délègue. Lance les lots avec l'outil Agent en fixant model: "sonnet". Parallélise ce qui est indépendant. Chaque sous-agent écrit dans un fichier de travail distinct sous le dossier de sortie, jamais dans le même fichier qu'un autre.

4. Intègre et critique. Assemble le tout dans index.html (autonome, CSS et JS inline) et explication.html. Relis avec un œil de directeur artistique et de scientifique : si un lot n'est pas au niveau, renvoie-le au sous-agent avec des corrections précises plutôt que de tout réécrire toi-même.

5. Vérifie. node --check sur le JS extrait ; si Playwright est disponible (channel: 'msedge', sans télécharger de navigateur), ouvre la page, capture les erreurs console et des captures à 1440 px et 375 px. Corrige ce que tu trouves. Si tu ne peux pas vérifier dans un navigateur, dis-le.

Dossier de sortie : <dossier du projet>/opus-orchestre/03-neurone/ . Ne touche à rien d'autre. Pas de git. Pas d'emoji.

Rapport final (moins de 250 mots) : ton découpage, ce que chaque sous-agent a livré, combien d'allers-retours de correction, ce que tu as vérifié et comment, les simplifications scientifiques assumées, et ton avis honnête sur ce que la délégation a apporté ou coûté.
```

## 04-champ-electrique

```text
Tu es l'orchestrateur (Claude Opus 5.5) d'un petit projet : une planche web interactive de vulgarisation scientifique sur le champ électrique. Tu ne codes pas toi-même l'essentiel : tu diriges des sous-agents Sonnet 5.5, puis tu intègres et tu vérifies. Le but est de tester ce duo Opus + Sonnet.

1. Lis en entier :
   - <dossier du projet>/prompts/00-direction-artistique.md (charte commune, obligatoire)
   - <dossier du projet>/prompts/04-champ-electrique.md (brief du projet)

2. Planifie. Découpe le travail en 2 à 4 lots indépendants (par exemple : moteur de simulation et scène, contrôles et panneau de lecture, document explication.html, passe finale de motion). Pour chaque lot, écris un brief précis : contrat d'interface (noms de fonctions, format des données, variables CSS), critères d'acceptation, exactitude scientifique attendue.

3. Délègue. Lance les lots avec l'outil Agent en fixant model: "sonnet". Parallélise ce qui est indépendant. Chaque sous-agent écrit dans un fichier de travail distinct sous le dossier de sortie, jamais dans le même fichier qu'un autre.

4. Intègre et critique. Assemble le tout dans index.html (autonome, CSS et JS inline) et explication.html. Relis avec un œil de directeur artistique et de scientifique : si un lot n'est pas au niveau, renvoie-le au sous-agent avec des corrections précises plutôt que de tout réécrire toi-même.

5. Vérifie. node --check sur le JS extrait ; si Playwright est disponible (channel: 'msedge', sans télécharger de navigateur), ouvre la page, capture les erreurs console et des captures à 1440 px et 375 px. Corrige ce que tu trouves. Si tu ne peux pas vérifier dans un navigateur, dis-le.

Dossier de sortie : <dossier du projet>/opus-orchestre/04-champ-electrique/ . Ne touche à rien d'autre. Pas de git. Pas d'emoji.

Rapport final (moins de 250 mots) : ton découpage, ce que chaque sous-agent a livré, combien d'allers-retours de correction, ce que tu as vérifié et comment, les simplifications scientifiques assumées, et ton avis honnête sur ce que la délégation a apporté ou coûté.
```
