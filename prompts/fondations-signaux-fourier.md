# Fondations · Signaux et Fourier (module 09)

Dossier de sortie : `opus-sonnet/fondations-signaux-fourier/` (`index.html` + `explication.html`). Règles communes : [`SESSION-FONDATION.md`](SESSION-FONDATION.md), partie 2, intégralement. Charte : `00-direction-artistique.md`.

En-tête : `LABO · Fondations 09`, titre « Un signal, des *fréquences* ». Accent : `--accent: #80d8a0;` (vert oscilloscope). Budget : ≈ 0,7 ADN, **un chapitre de 4 étapes**.

**Statut particulier.** Le module 09 est aujourd'hui seulement `supporting` (Fourier est nommé dans *Oscillations et ondes*). Cette page le couvre. Elle est indépendante des vagues : à intercaler quand une session est libre, de préférence avant 43 · 44 (spectres).

Préalables conseillés : 06 (sinusoïdes, phase, somme de sinusoïdes), 14 (résonance), 15 (ondes, modes), 22 (circuit RC).

**Son.** La page peut produire du son par Web Audio. Le son est **coupé par défaut** ; un bouton « Écouter » l'active, avec un volume bas et un fondu à l'ouverture et à la fermeture. Aucun accès au micro.

## Intention

À la fin, l'étudiant sait que **tout signal se décompose en sinusoïdes** et que le spectre (quelles fréquences, avec quelles amplitudes) est une autre façon, souvent plus parlante, de décrire le même signal. Intuitions à rendre évidentes, par ordre de priorité :

1. En ajoutant des sinusoïdes bien choisies, on fabrique n'importe quelle forme périodique, même un signal carré aux coins vifs (étape 1).
2. Deux instruments qui jouent la même note ont la même fréquence fondamentale mais pas les mêmes harmoniques : le timbre est le spectre (étape 2, moment fort).
3. Échantillonner trop lentement crée de fausses fréquences : une roue qui semble tourner à l'envers au cinéma (étape 3, moment fort).
4. Filtrer, c'est modifier le spectre : garder les graves, couper les aigus, enlever un bruit (étape 4).

Interdits : « le spectre montre de quoi le son est fait physiquement » sans nuance (c'est une décomposition mathématique exacte, pas des sons séparés présents dans l'air) ; « plus d'échantillons, c'est toujours mieux » sans dire pourquoi.

## Réutilisation (ne pas reconstruire)

- Sinusoïde, amplitude, fréquence, phase, cadran de phase, oscilloscope déroulant : `../fondations-oscillations-ondes/` (modules 06, 14, 15). Reprendre l'oscilloscope et le cadran ; les harmoniques de la corde (modes) y sont déjà : renvoi à l'étape 2.
- Circuit RC, constante de temps : `../06-courant-circuits/`. L'étape 4 montre que le RC est un filtre passe-bas.
- Spectre électromagnétique : future page 24 ; raies : future page 26 · 27 (un spectre lumineux est aussi une décomposition en fréquences).
- Échelles log, décibels : `../fondations-langage/` et `../fondations-systemes-hasard/`.

## Moteur (à écrire et tester avant la page)

Bloc `/* FOURIER-BEGIN */ … /* FOURIER-END */`, objet `Fourier`.

- **Séries** : `square(n)`, `sawtooth(n)`, `triangle(n)` → coefficients (amplitude et phase) des n premières harmoniques ; `synth(coeffs, f0, t)` ; `gibbsOvershoot(n)`.
- **Transformée** : `fft(re, im)` (radix 2 en place) et `ifft` ; `spectrum(signal, fs, window)` (fenêtres rectangulaire et de Hann) ; `freqAxis(N, fs)` ; `parseval(signal)`.
- **Instruments** : `TIMBRES` : spectres d'harmoniques et enveloppes simples pour « diapason », « flûte », « clarinette » (harmoniques impaires dominantes), « violon », « voix : a », « voix : i » (formants), documentés comme approximations ; `play(timbre, f0, ctx)` (Web Audio, oscillateurs additionnés ou `PeriodicWave`).
- **Échantillonnage** : `sample(signal, fs, duration)` ; `aliasFrequency(f, fs)` = |f − fs · round(f/fs)| ; `reconstruct(samples, fs, t)` (interpolation sinc tronquée) ; `wheel(rpm, spokes, fps)` → vitesse apparente.
- **Filtres** : `rcLowpass(fc)` et `rcHighpass(fc)` (gain et phase en fonction de f) ; `applyFilter(signal, fs, response)` (dans le domaine fréquentiel) ; `noise(rng)` et `hum(f)` (bourdonnement à 60 Hz) ; `notch(f0, Q)`.

### Tests du moteur

1. Signal carré : coefficients 4/(πn) pour n impair, 0 pour n pair ; dent de scie : 2/(πn) en alternance de signe.
2. Gibbs : dépassement de la somme partielle du carré ±1 → maximum ≈ 1,179 pour n grand (à 0,5 %), qui ne diminue pas quand n augmente (il se resserre).
3. FFT : une sinusoïde pure à une fréquence de case donne une seule raie (fuite < 10⁻¹⁰) ; `ifft(fft(x))` = x à 10⁻¹² ; Parseval vérifié à 10⁻¹⁰.
4. Fuite : une fréquence entre deux cases s'étale ; la fenêtre de Hann réduit les lobes latéraux sous −31 dB.
5. Repliement : f = 7 kHz échantillonné à 10 kHz → 3 kHz ; f = 22 kHz à 44,1 kHz → 22 kHz (sous Nyquist, aucun repliement) ; f = 25 kHz à 44,1 kHz → 19,1 kHz.
6. Roue de chariot : 8 rayons, 24 images/s, roue à 175 tr/min → elle paraît tourner lentement à l'envers (valeur calculée et vérifiée) ; à 180 tr/min, immobile.
7. RC : gain 1/√2 (−3 dB) à fc = 1/(2πRC) ; pente −20 dB par décade au-delà ; phase −45° à fc.
8. Reconstruction : une sinusoïde sous Nyquist est reconstruite à 1 % (loin des bords) ; au-dessus, la reconstruction donne la fréquence repliée.

## Code couleur

| Objet | Couleur et forme |
|---|---|
| signal dans le temps | trait `--texte` sur fond d'oscilloscope `--fond-2` |
| harmoniques individuelles | traits fins `--accent` à opacités décroissantes |
| spectre (barres ou raies) | `--accent` ; fondamentale soulignée `--energie` |
| échantillons | points `--energie` sur le signal |
| fréquence repliée | `--positif` (le faux signal), signal vrai en `--texte` |
| réponse d'un filtre | courbe `--negatif` superposée au spectre, zone coupée assombrie |

## Chapitre · Module 09 · Signaux et Fourier

### Étape 1 · Construire un signal
- Scène : en haut, l'oscilloscope du signal en construction ; en dessous, une pile de sinusoïdes (les harmoniques) dessinées séparément, chacune avec son cadran de phase (repris de la fondation 06) ; à droite, le spectre : une barre par harmonique. On ajoute les harmoniques une à une, ou on règle chaque barre à la souris.
- Contrôles : forme cible (carré, dent de scie, triangle, « libre »), nombre d'harmoniques (1 à 50), bascule « Montrer la cible ».
- Panneau : amplitudes des 8 premières harmoniques, erreur quadratique entre la somme et la cible, dépassement au coin. Statuts : 1 harmonique « Une sinusoïde seule : la fondamentale » ; 50 harmoniques « Les coins se dessinent ; le petit dépassement au bord reste, il se resserre sans disparaître (phénomène de Gibbs) ».
- Phrase-clé : « Tout signal périodique est une somme de sinusoïdes dont les fréquences sont des multiples de la fréquence fondamentale. Les coins vifs demandent des harmoniques élevées. »
- Note : sommes partielles finies.

### Étape 2 · Le spectre d'un son (moment fort)
- Scène : choix d'un instrument ; la forme d'onde sur l'oscilloscope, le spectre en barres à côté, et une corde ou un tuyau stylisé avec ses modes (renvoi à la fondation 15). Bouton « Écouter » (son coupé par défaut). Bascule « Même note, autre instrument » : deux spectres superposés, même fondamentale (440 Hz), harmoniques différentes.
- Contrôles : instrument (diapason, flûte, clarinette, violon, voix « a », voix « i »), note (fondamentale), bouton « Retirer la fondamentale » (on l'entend encore : le cerveau la reconstruit à partir des harmoniques, fondamentale manquante), volume.
- Panneau : fondamentale, harmoniques principales, rapport d'amplitudes, nom de la note. Statuts : diapason « Presque une seule raie : un son pur » ; clarinette « Surtout des harmoniques impaires : un tuyau fermé à un bout » ; voyelles « Les voyelles se distinguent par des bosses dans le spectre, les formants, pas par la note ».
- Phrase-clé : « Deux sons de même hauteur ont la même fréquence fondamentale ; leur timbre vient de leurs harmoniques. Le spectre décrit le même son autrement, souvent plus clairement. »
- Note : timbres synthétiques approximatifs, sans attaque réaliste ; aucune captation par micro.

### Étape 3 · Échantillonner (moment fort)
- Scène : un signal continu (sinusoïde de fréquence réglable) et les échantillons pris à la cadence fs (points) ; la courbe reconstruite à partir des échantillons, superposée. Quand f dépasse fs/2, la reconstruction donne une autre sinusoïde, plus lente (repliement), dessinée en `--positif`. Encart « roue de chariot » : une roue à rayons filmée à 24 images/s qui semble ralentir, s'arrêter, tourner à l'envers à mesure qu'elle accélère.
- Contrôles : f du signal, fs (fréquence d'échantillonnage), vitesse de la roue.
- Panneau : f, fs, fs/2 (Nyquist), fréquence reconstruite, vitesse apparente de la roue. Statuts : sous Nyquist « Assez d'échantillons par période : on retrouve exactement le signal » ; au-dessus « Trop peu d'échantillons : on voit une fausse fréquence » ; roue « La caméra échantillonne : la roue paraît tourner à l'envers ». Encart : CD à 44,1 kHz pour une oreille qui entend jusqu'à ≈ 20 kHz.
- Phrase-clé : « Pour reproduire fidèlement un signal, il faut l'échantillonner à plus du double de sa plus haute fréquence. Sinon, des fréquences trop hautes se déguisent en fréquences plus basses : c'est le repliement. »
- Note : échantillonnage idéal et reconstruction par sinc tronquée.

### Étape 4 · Filtrer
- Scène : un signal utile (une mélodie simple ou une sinusoïde à 440 Hz) plus du bruit (souffle et bourdonnement à 60 Hz) ; spectre avec la réponse du filtre superposée ; signal avant et après filtrage. Schéma d'un circuit RC à côté, dont le curseur R ou C déplace la fréquence de coupure.
- Contrôles : type de filtre (passe-bas, passe-haut, coupe-bande à 60 Hz), fréquence de coupure (ou R et C), bouton « Écouter avant / après » (son coupé par défaut).
- Panneau : fc, gain à quelques fréquences (dB), puissance du bruit avant et après. Statuts : passe-bas « Le RC laisse passer ce qui varie lentement et atténue ce qui varie vite : au-delà de fc, −20 dB par décade » ; coupe-bande « Le bourdonnement du secteur disparaît, la note reste ».
- Phrase-clé : « Filtrer un signal, c'est modifier son spectre : atténuer certaines fréquences et garder les autres. Un simple circuit RC est un filtre passe-bas. »
- Fin de planche, trois questions ouvertes : **Lumière** « Un prisme fait-il une transformée de Fourier de la lumière ? » → modules 24, 25 et 27 ; **Quantique** « Pourquoi un signal très bref a-t-il forcément un spectre très large ? » → module 48 (Δx Δp, Δt Δf) ; **Chaos** « À quoi ressemble le spectre d'un signal chaotique ? » → module 08.

## Micro-interactions de découverte

Oscilloscope, harmonique, cadran de phase, barre du spectre, fondamentale, formant, échantillon, fréquence de Nyquist, fréquence repliée, roue de chariot, filtre, fréquence de coupure, résistance, condensateur, bourdonnement.

## `window.__labo` (en plus du socle)

`setShape(s)`, `setHarmonics(n)`, `setCoef(k, a)` (1) ; `setInstrument(i)`, `setNote(f)`, `removeFundamental(on)`, `listen(on)` (2) ; `setF(f)`, `setFs(fs)`, `setWheel(rpm)` (3) ; `setFilter(kind, fc)`, `setRC(R, C)`, `listenFiltered(on)` (4).

## Théorie (explication, module 09)

- Relations : \(x(t) = a_0 + \sum_{n\ge1} A_n \sin(2\pi n f_0 t + \varphi_n)\) ; carré : \(\dfrac{4}{\pi}\sum_{n\ \text{impair}} \dfrac{\sin(2\pi n f_0 t)}{n}\) ; \(f_s \gt 2 f_{\max}\) ; \(f_{\text{replié}} = |f - k f_s|\) ; \(f_c = \dfrac{1}{2\pi RC}\), \(|H(f)| = \dfrac{1}{\sqrt{1 + (f/f_c)^2}}\) ; \(\Delta t\,\Delta f \gtrsim 1\) (seulement introduit).
- Exemple chiffré possible : fréquences des cinq premières harmoniques d'un la 440 Hz et lesquelles un téléphone (bande 300 à 3 400 Hz) transmet ; ou repliement d'un son de 25 kHz enregistré à 44,1 kHz sans filtre.
- Pièges : « le spectre montre des sons séparés présents dans l'air » ; « on peut échantillonner à exactement 2f » ; « le repliement se corrige après coup » (il faut filtrer avant d'échantillonner) ; « un signal carré n'a qu'une fréquence » ; « filtrer ne change que l'amplitude » (la phase aussi).
- Où ça resservira : 15 (modes), 22 (filtres), 24 · 27 (spectres lumineux), 48 (paquet d'ondes, incertitude), 08 (spectres de signaux chaotiques), Atlas : battements, ligne de transmission.
- Seulement introduit ici : transformée de Fourier continue, convolution, compression (MP3, JPEG), décibels en détail, transformée en ondelettes.

## Honnêteté

Timbres synthétiques ; échantillonnage idéal ; filtres du premier ordre ; FFT sur des fenêtres finies (fuite spectrale expliquée).

## Hors champ

Traitement numérique du signal avancé, filtres numériques récursifs, acoustique des salles, psychoacoustique au-delà de la fondamentale manquante.
