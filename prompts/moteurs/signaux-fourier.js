/* FOURIER-BEGIN */
const Fourier = (() => {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI;
  const entier = n => Number.isInteger(n) && n >= 0;
  const borne = (v, a, b) => Math.max(a, Math.min(b, v));
  const puissance2 = n => entier(n) && n > 0 && (n & (n - 1)) === 0;
  const coeff = (n, signe) => ({n, amplitude: Math.abs(signe), phase: signe < 0 ? PI : 0, sin: signe});

  function serie(n, forme) {
    if (!entier(n) || n > 4096) throw new RangeError('Nombre d’harmoniques entier entre 0 et 4096');
    const resultat = [];
    for (let k = 1; k <= n; k++) {
      let b = 0;
      if (forme === 'square') b = k % 2 ? 4 / (PI * k) : 0;
      if (forme === 'sawtooth') b = (k % 2 ? 1 : -1) * 2 / (PI * k);
      if (forme === 'triangle') b = k % 2 ? 8 / (PI * PI * k * k) * ((k - 1) % 4 ? -1 : 1) : 0;
      resultat.push(coeff(k, b));
    }
    return resultat;
  }
  const square = n => serie(n, 'square');
  const sawtooth = n => serie(n, 'sawtooth');
  const triangle = n => serie(n, 'triangle');
  function synth(coeffs, f0, t) {
    if (!Array.isArray(coeffs) || !(f0 > 0) || !Number.isFinite(t)) throw new RangeError('Coefficients, fréquence et temps valides requis');
    let somme = 0;
    for (const c of coeffs) somme += c.amplitude * Math.sin(TAU * c.n * f0 * t + (c.phase || 0));
    return somme;
  }
  function cible(forme, cycles) {
    const p = ((cycles + .5) % 1 + 1) % 1 - .5;
    if (forme === 'square') return Math.abs(p) < 1e-12 || Math.abs(Math.abs(p) - .5) < 1e-12 ? 0 : (p > 0 ? 1 : -1);
    if (forme === 'sawtooth') return 2 * p;
    if (forme === 'triangle') return (2 / PI) * Math.asin(Math.sin(TAU * cycles));
    return 0;
  }
  function gibbsOvershoot(n) {
    if (!entier(n) || n < 1) throw new RangeError('Au moins une harmonique');
    const cs = square(n), intervalle = Math.min(.25, 2 / n);
    let maximum = -Infinity, position = 0;
    for (let i = 1; i <= 4096; i++) {
      const x = intervalle * i / 4096, y = synth(cs, 1, x);
      if (y > maximum) { maximum = y; position = x; }
    }
    return {maximum, depassement: maximum - 1, fractionDuSaut: (maximum - 1) / 2, position};
  }
  function transforme(re, im, inverse) {
    const N = re.length;
    if (!puissance2(N) || !im || im.length !== N) throw new RangeError('FFT : parties réelles et imaginaires de même longueur, puissance de 2');
    for (let i = 1, j = 0; i < N; i++) {
      let bit = N >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { const a = re[i]; re[i] = re[j]; re[j] = a; const b = im[i]; im[i] = im[j]; im[j] = b; }
    }
    for (let largeur = 2; largeur <= N; largeur *= 2) {
      const angle = (inverse ? TAU : -TAU) / largeur;
      const wr = Math.cos(angle), wi = Math.sin(angle);
      for (let debut = 0; debut < N; debut += largeur) {
        let ur = 1, ui = 0;
        for (let j = 0; j < largeur / 2; j++) {
          const a = debut + j, b = a + largeur / 2;
          const tr = ur * re[b] - ui * im[b], ti = ur * im[b] + ui * re[b];
          re[b] = re[a] - tr; im[b] = im[a] - ti;
          re[a] += tr; im[a] += ti;
          const prochainR = ur * wr - ui * wi;
          ui = ur * wi + ui * wr; ur = prochainR;
        }
      }
    }
    if (inverse) for (let i = 0; i < N; i++) { re[i] /= N; im[i] /= N; }
    return {re, im};
  }
  const fft = (re, im) => transforme(re, im, false);
  const ifft = (re, im) => transforme(re, im, true);
  function freqAxis(N, fs) {
    if (!puissance2(N) || !(fs > 0)) throw new RangeError('Taille puissance de 2 et fréquence positive requises');
    return Array.from({length: N / 2 + 1}, (_, k) => k * fs / N);
  }
  function spectrum(signal, fs, window = 'rectangulaire') {
    const N = signal.length;
    if (!puissance2(N) || !(fs > 0)) throw new RangeError('Spectre : N puissance de 2 et fs positive');
    const hann = /hann/i.test(window);
    if (!hann && !/^(rectangulaire|rectangular|rect|aucune)$/i.test(window)) throw new RangeError('Fenêtre rectangulaire ou Hann');
    const re = new Float64Array(N), im = new Float64Array(N);
    let poids = 0;
    for (let i = 0; i < N; i++) {
      const w = hann ? .5 * (1 - Math.cos(TAU * i / N)) : 1;
      re[i] = signal[i] * w; poids += w;
    }
    fft(re, im);
    const frequences = freqAxis(N, fs), amplitudes = [], db = [];
    for (let k = 0; k <= N / 2; k++) {
      const A = Math.hypot(re[k], im[k]) / poids * (k === 0 || k === N / 2 ? 1 : 2);
      amplitudes.push(A); db.push(20 * Math.log10(Math.max(A, 1e-15)));
    }
    return {frequences, amplitudes, db, window: hann ? 'Hann' : 'rectangulaire', re, im, fs, N};
  }
  function parseval(signal) {
    const N = signal.length, re = Float64Array.from(signal), im = new Float64Array(N);
    fft(re, im);
    let temps = 0, frequence = 0;
    for (let i = 0; i < N; i++) { temps += signal[i] ** 2; frequence += re[i] ** 2 + im[i] ** 2; }
    frequence /= N;
    return {temps, frequence, ecart: Math.abs(temps - frequence)};
  }

  // Timbres spectraux stylisés : ni enregistrements, ni modèles complets d'instruments.
  const TIMBRES = {
    diapason: {nom: 'Diapason', description: 'Presque une seule raie', enveloppe: {attaque: .015, relache: .09}, harmoniques: f0 => Array.from({length: 16}, (_, i) => i === 0 ? 1 : (i === 1 ? .018 : .002 / (i + 1)))},
    flute: {nom: 'Flûte', description: 'Fondamentale dominante et harmoniques faibles', enveloppe: {attaque: .045, relache: .10}, harmoniques: f0 => Array.from({length: 16}, (_, i) => Math.exp(-i * .95) * (i % 2 ? .8 : 1))},
    clarinette: {nom: 'Clarinette', description: 'Harmoniques impaires dominantes, idéalisation d’un tuyau fermé', enveloppe: {attaque: .035, relache: .10}, harmoniques: f0 => Array.from({length: 16}, (_, i) => (i % 2 ? .045 : 1) / Math.pow(i + 1, .85))},
    violon: {nom: 'Violon', description: 'Spectre riche, sans bruit d’archet réaliste', enveloppe: {attaque: .055, relache: .12}, harmoniques: f0 => Array.from({length: 16}, (_, i) => Math.exp(-i * .16) / Math.pow(i + 1, .18))},
    'voix-a': {nom: 'Voix : a', description: 'Formants fictifs autour de 800 et 1200 Hz', enveloppe: {attaque: .065, relache: .11}, formants: [800, 1200], harmoniques: f0 => formants(f0, [800, 1200])},
    'voix-i': {nom: 'Voix : i', description: 'Formants fictifs autour de 300 et 2300 Hz', enveloppe: {attaque: .065, relache: .11}, formants: [300, 2300], harmoniques: f0 => formants(f0, [300, 2300])}
  };
  function formants(f0, centres) {
    return Array.from({length: 20}, (_, i) => {
      const f = (i + 1) * f0;
      const pic = centres.reduce((s, c, k) => s + (k ? 1.0 : 1.6) * Math.exp(-.5 * ((f - c) / (k ? 250 : 160)) ** 2), 0);
      return (.12 + pic) / Math.pow(i + 1, .55);
    });
  }
  function timbreCoeffs(nom, f0, sansFondamentale = false) {
    if (!TIMBRES[nom] || !(f0 > 0)) throw new RangeError('Timbre inconnu ou note invalide');
    return TIMBRES[nom].harmoniques(f0).map((a, i) => coeff(i + 1, (sansFondamentale && i === 0) ? 0 : a));
  }
  function play(timbre, f0, ctx, options = {}) {
    if (!ctx || typeof ctx.createOscillator !== 'function') throw new TypeError('Contexte Web Audio requis');
    const nom = typeof timbre === 'string' ? timbre : timbre.nom;
    const cle = TIMBRES[nom] ? nom : Object.keys(TIMBRES).find(k => TIMBRES[k] === timbre);
    if (!cle) throw new RangeError('Timbre inconnu');
    const cs = timbreCoeffs(cle, f0, !!options.sansFondamentale);
    const volume = borne(Number(options.volume ?? .2), 0, 1);
    const total = cs.reduce((s, c) => s + c.amplitude, 0) || 1;
    const master = ctx.createGain(), debut = ctx.currentTime;
    master.gain.setValueAtTime(0, debut);
    master.gain.linearRampToValueAtTime(.12 * volume, debut + Math.max(.03, TIMBRES[cle].enveloppe.attaque));
    master.connect(ctx.destination);
    const sources = [];
    cs.forEach(c => {
      if (c.amplitude < 1e-8 || c.n * f0 >= ctx.sampleRate / 2) return;
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(c.n * f0, debut);
      gain.gain.value = c.amplitude / total;
      osc.connect(gain); gain.connect(master); osc.start(debut); sources.push({osc, gain});
    });
    let fini = false;
    return {gain: master, sources, stop() {
      if (fini) return; fini = true;
      const t = ctx.currentTime, fin = t + Math.max(.05, TIMBRES[cle].enveloppe.relache);
      master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, fin);
      sources.forEach(({osc}) => { osc.stop(fin + .01); });
    }};
  }

  function sample(signal, fs, duration) {
    if (typeof signal !== 'function' || !(fs > 0) || !(duration > 0)) throw new RangeError('Signal(t), fs et durée positifs requis');
    const N = Math.floor(fs * duration) + 1;
    if (N > 1000000) throw new RangeError('Trop d’échantillons');
    const times = new Float64Array(N), values = new Float64Array(N);
    for (let i = 0; i < N; i++) { times[i] = i / fs; values[i] = signal(times[i]); }
    return {times, values, fs, duration};
  }
  const aliasFrequency = (f, fs) => { if (!(fs > 0)) throw new RangeError('fs doit être positive'); return Math.abs(f - fs * Math.round(f / fs)); };
  function sinc(x) { return Math.abs(x) < 1e-12 ? 1 : Math.sin(PI * x) / (PI * x); }
  function reconstruct(samples, fs, t) {
    const v = samples.values || samples;
    if (!(fs > 0) || !v || !v.length) throw new RangeError('Échantillons et fs valides requis');
    const u = t * fs, m = 72, a = Math.max(0, Math.ceil(u - m)), b = Math.min(v.length - 1, Math.floor(u + m));
    let somme = 0;
    for (let i = a; i <= b; i++) { const d = u - i; somme += v[i] * sinc(d) * sinc(d / m); }
    return somme;
  }
  function wheel(rpm, spokes = 8, fps = 24) {
    if (!(spokes >= 1) || !(fps > 0) || !(rpm >= 0)) throw new RangeError('Rayons, cadence et vitesse valides requis');
    const rotations = rpm / 60, periodeRayons = fps / spokes;
    const replie = rotations - Math.round(rotations / periodeRayons) * periodeRayons;
    return {rpmReel: rpm, rpmApparent: 60 * replie, sens: Math.abs(replie) < 1e-10 ? 'immobile' : replie < 0 ? 'inverse' : 'direct', cadenceImages: fps, rayons: spokes};
  }

  function rcLowpass(fc) {
    if (!(fc > 0)) throw new RangeError('Fréquence de coupure positive requise');
    return f => {
      const x = f / fc, d = 1 + x * x, re = 1 / d, im = -x / d;
      return {re, im, gain: 1 / Math.sqrt(d), phase: -Math.atan(x)};
    };
  }
  function rcHighpass(fc) {
    if (!(fc > 0)) throw new RangeError('Fréquence de coupure positive requise');
    return f => {
      const x = f / fc, d = 1 + x * x, re = x * x / d, im = x / d;
      return {re, im, gain: Math.abs(x) / Math.sqrt(d), phase: Math.atan2(im, re)};
    };
  }
  function notch(f0 = 60, Q = 12) {
    if (!(f0 > 0) || !(Q > 0)) throw new RangeError('f0 et Q positifs requis');
    return f => {
      const x = f / f0, a = 1 - x * x, b = x / Q, d = a * a + b * b;
      if (d < 1e-30) return {re: 0, im: 0, gain: 0, phase: 0};
      const re = a * a / d, im = -a * b / d;
      return {re, im, gain: Math.hypot(re, im), phase: Math.atan2(im, re)};
    };
  }
  function applyFilter(signal, fs, response) {
    if (!puissance2(signal.length) || !(fs > 0) || typeof response !== 'function') throw new RangeError('Signal puissance de 2, fs et réponse requis');
    const N = signal.length, re = Float64Array.from(signal), im = new Float64Array(N);
    fft(re, im);
    for (let k = 0; k < N; k++) {
      const f = k <= N / 2 ? k * fs / N : (k - N) * fs / N;
      const H = response(f), hr = H.re, hi = H.im;
      const r = re[k], a = im[k];
      re[k] = r * hr - a * hi; im[k] = r * hi + a * hr;
    }
    ifft(re, im);
    return re;
  }
  function mulberry32(seed = 1) {
    let a = seed >>> 0;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function noise(rng) { if (typeof rng !== 'function') throw new TypeError('Générateur à graine requis'); return 2 * rng() - 1; }
  const hum = (f = 60) => t => Math.sin(TAU * f * t);
  return {square, sawtooth, triangle, cible, synth, gibbsOvershoot, fft, ifft, spectrum, freqAxis, parseval, TIMBRES, timbreCoeffs, play, sample, aliasFrequency, reconstruct, wheel, rcLowpass, rcHighpass, notch, applyFilter, mulberry32, noise, hum};
})();
/* FOURIER-END */
