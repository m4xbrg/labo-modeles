/* QM-BEGIN */
const QM = (() => {
  'use strict';
  // Constantes SI : CODATA 2022 (NIST), h, e et c definies exactement.
  const h = 6.62607015e-34;
  const hbar = h / (2 * Math.PI);
  const me = 9.1093837139e-31;
  const e = 1.602176634e-19;
  const c = 299792458;
  const u = 1.66053906892e-27;
  const TAU = 2 * Math.PI;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const cadd = (a, b) => ({re: a.re + b.re, im: a.im + b.im});
  const cmul = (a, b) => ({re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re});
  const cabs2 = z => z.re * z.re + z.im * z.im;
  const cexp = phi => ({re: Math.cos(phi), im: Math.sin(phi)});
  const phasor = (amp, phase) => ({re: amp * Math.cos(phase), im: amp * Math.sin(phase)});
  const sinc = z => Math.abs(z) < 1e-7 ? 1 - z * z / 6 + z ** 4 / 120 : Math.sin(z) / z;
  const DEFAULT = Object.freeze({lambda: 1.226e-10, d: 1e-6, w: 0.18e-6, L: 0.45, xMin: -3.1e-4, xMax: 3.1e-4});

  function mulberry32(seed = 1) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function validFentes(p) {
    if (!(p.lambda > 0 && p.d > 0 && p.w > 0 && p.L > 0 && p.d >= p.w))
      throw new RangeError('Longueurs positives et fentes distinctes requises');
  }
  function twoSlit({lambda, d, w, L}, x) {
    validFentes({lambda, d, w, L});
    // Fraunhofer paraxial : deux fentes rectangulaires identiques, phases opposees.
    const enveloppe = sinc(Math.PI * w * x / (lambda * L));
    const phase = Math.PI * d * x / (lambda * L);
    return {psi1: phasor(enveloppe, -phase), psi2: phasor(enveloppe, phase)};
  }
  const interfrange = ({lambda, d, L}) => lambda * L / d;
  function intensite(mode, x, p, eta = 1) {
    const {psi1: a, psi2: b} = twoSlit(p, x);
    if (mode === 'single') return cabs2(a);
    const somme = cabs2(a) + cabs2(b);
    if (mode === 'which') return somme;
    if (mode !== 'both' && mode !== 'partial') throw new RangeError('Mode de fentes inconnu');
    const coherence = mode === 'both' ? 1 : clamp(eta, 0, 1);
    return Math.max(0, somme + 2 * coherence * (a.re * b.re + a.im * b.im));
  }

  function preparePattern(params = {}, mode = 'both', eta = 1) {
    const p = {...DEFAULT, ...params};
    validFentes(p);
    if (!(p.xMax > p.xMin)) throw new RangeError('Intervalle de detection vide');
    // Integration et CDF sur le MEME domaine fini que l'ecran : probas conditionnelles.
    const N = 8192, dx = (p.xMax - p.xMin) / N;
    const cumul = new Float64Array(N + 1);
    let prev = intensite(mode, p.xMin, p, eta);
    for (let i = 1; i <= N; i++) {
      const next = intensite(mode, p.xMin + i * dx, p, eta);
      cumul[i] = cumul[i - 1] + 0.5 * (prev + next) * dx;
      prev = next;
    }
    const norme = cumul[N];
    if (!(norme > 0)) throw new RangeError('Densite de detection nulle');
    for (let i = 1; i <= N; i++) cumul[i] /= norme;
    return {
      mode, eta: mode === 'both' ? 1 : mode === 'which' ? 0 : clamp(eta, 0, 1),
      params: p, xMin: p.xMin, xMax: p.xMax, dx, cumul,
      pdf: x => x < p.xMin || x > p.xMax ? 0 : intensite(mode, x, p, eta) / norme,
      interfrange: interfrange(p),
      normalisation: norme
    };
  }
  // Les affichages utilisent toujours le meme modele tant que les parametres restent fixes.
  const cache = new Map();
  function pattern(mode, x, params = {}) {
    const key = JSON.stringify([mode, params]);
    if (!cache.has(key)) {
      if (cache.size >= 24) cache.clear();
      cache.set(key, preparePattern(params, mode, params.eta ?? 1));
    }
    return cache.get(key).pdf(x);
  }
  function sampleHits(distribution, n, rng) {
    if (!distribution || !distribution.cumul || !Number.isInteger(n) || n < 0 || typeof rng !== 'function')
      throw new TypeError('Distribution, nombre entier et generateur requis');
    const {cumul: f, xMin, dx} = distribution;
    const hits = new Float64Array(n);
    for (let k = 0; k < n; k++) {
      const q = clamp(rng(), 0, 1 - Number.EPSILON);
      let lo = 0, hi = f.length - 1;
      while (hi - lo > 1) { const mid = (lo + hi) >>> 1; if (f[mid] < q) lo = mid; else hi = mid; }
      const frac = f[hi] > f[lo] ? (q - f[lo]) / (f[hi] - f[lo]) : 0;
      hits[k] = xMin + (lo + frac) * dx;
    }
    return hits;
  }
  function lambdaDB(m, v) {
    if (!(m > 0 && v >= 0 && v < c)) throw new RangeError('Masse positive et vitesse sous c');
    return v === 0 ? Infinity : h / (m * v / Math.sqrt(1 - (v / c) ** 2));
  }
  function lambdaElectron(V) {
    if (!(V > 0)) throw new RangeError('Tension positive requise');
    // K = eV ; (pc)^2 = K(K + 2 m_e c^2).
    const K = e * V;
    return h * c / Math.sqrt(K * (K + 2 * me * c * c));
  }
  function mz({phi = 0, blockArm = false, whichPath = false, eta = 1} = {}) {
    // Convention relative des separatrices : D1 = (1 + exp(i phi))/2,
    // D2 = (1 - exp(i phi))/2. La phase globale est non observable.
    const a = phasor(0.5, 0), b = phasor(0.5, phi);
    const voies = {d1: [a, b], d2: [a, {re: -b.re, im: -b.im}]};
    const coherence = blockArm || whichPath === true ? 0 :
      typeof whichPath === 'number' ? clamp(1 - whichPath, 0, 1) : clamp(eta, 0, 1);
    const p1 = blockArm ? 0.25 : (1 + coherence * Math.cos(phi)) / 2;
    const p2 = blockArm ? 0.25 : (1 - coherence * Math.cos(phi)) / 2;
    return {d1: p1, d2: p2, absorbed: blockArm ? 0.5 : 0, coherence, voies};
  }
  function mzPhotons(n, params = {}, rng = mulberry32(1)) {
    const p = mz(params), out = {d1: 0, d2: 0, absorbed: 0};
    if (!Number.isInteger(n) || n < 0) throw new RangeError('Nombre de photons invalide');
    for (let i = 0; i < n; i++) {
      const r = rng();
      if (r < p.d1) out.d1++;
      else if (r < p.d1 + p.d2) out.d2++;
      else out.absorbed++;
    }
    return out;
  }
  function sigmaT(sigma0, m, t) {
    if (!(sigma0 > 0 && m > 0)) throw new RangeError('Largeur et masse positives');
    return sigma0 * Math.hypot(1, hbar * t / (2 * m * sigma0 ** 2));
  }
  function momentumSpread(sigma0) {
    if (!(sigma0 > 0)) throw new RangeError('Largeur initiale positive');
    return hbar / (2 * sigma0);
  }
  function gaussPacket({x0 = 0, sigma0, k0 = 0, m = me}, x, t = 0) {
    if (!(sigma0 > 0 && m > 0 && t >= 0)) throw new RangeError('Paquet initial invalide');
    // Solution exacte libre pour |psi(x,0)|^2 gaussienne d'ecart-type sigma0.
    const tau = hbar * t / (2 * m * sigma0 * sigma0);
    const s = sigma0 * Math.hypot(1, tau);
    const mean = x0 + hbar * k0 / m * t;
    const z = x - mean;
    const prob = Math.exp(-0.5 * (z / s) ** 2) / (Math.sqrt(TAU) * s);
    const phase = k0 * (x - x0) - hbar * k0 * k0 * t / (2 * m)
      + z * z * tau / (4 * sigma0 * sigma0 * (1 + tau * tau))
      - 0.5 * Math.atan(tau);
    const amp = Math.sqrt(prob);
    return {re: amp * Math.cos(phase), im: amp * Math.sin(phase), abs2: prob, mean, sigma: s};
  }
  function expectation(psi, op) {
    // psi = {at(x), min, max, n}. L'operateur op(x,psi_x) renvoie O psi(x).
    const {at, min, max, n = 4096} = psi;
    if (typeof at !== 'function' || typeof op !== 'function' || !(max > min) || n < 2)
      throw new TypeError('Fonction d onde et operateur numeriques requis');
    const dx = (max - min) / n;
    let real = 0, imag = 0, norm = 0;
    for (let i = 0; i <= n; i++) {
      const x = min + i * dx, z = at(x), rz = op(x, z), w = (i === 0 || i === n ? 0.5 : 1) * dx;
      const oz = typeof rz === 'number' ? {re: rz, im: 0} : rz;
      real += (z.re * oz.re + z.im * oz.im) * w;
      imag += (z.re * oz.im - z.im * oz.re) * w;
      norm += cabs2(z) * w;
    }
    return {re: real / norm, im: imag / norm, norm};
  }
  function mesureInterfrange(points, attendu, min, max) {
    if (points.length < 1200 || !(attendu > 0)) return null;
    // Comparaison de la periode via autocorrelation d'un histogramme lisse.
    const N = 256, hist = new Float64Array(N), dx = (max - min) / N;
    for (const x of points) if (x >= min && x <= max) hist[Math.min(N - 1, Math.floor((x - min) / dx))]++;
    const filtr = new Float64Array(N), largeur = Math.max(1, 0.12 * attendu / dx);
    for (let i = 0; i < N; i++) {
      let s = 0, w = 0;
      for (let k = -5; k <= 5; k++) {
        const j = i + k;
        if (j >= 0 && j < N) { const poids = Math.exp(-0.5 * (k / largeur) ** 2); s += poids * hist[j]; w += poids; }
      }
      filtr[i] = s / w;
    }
    const lo = Math.max(2, Math.floor(0.75 * attendu / dx));
    const hi = Math.min(N / 3, Math.ceil(1.25 * attendu / dx));
    let best = lo, score = -Infinity;
    for (let shift = lo; shift <= hi; shift++) {
      let corr = 0, norm = 0;
      for (let j = 24; j < N - 24 - shift; j++) {
        const a = filtr[j], b = filtr[j + shift];
        corr += a * b;
        norm += a * a + b * b;
      }
      const s = corr / Math.max(norm, 1e-30);
      if (s > score) {score = s; best = shift;}
    }
    return best * dx;
  }
  return {h, hbar, me, e, c, u, DEFAULT, mulberry32, cadd, cmul, cabs2, cexp, phasor,
    twoSlit, intensite, interfrange, preparePattern, pattern, sampleHits,
    lambdaDB, lambdaElectron, mz, mzPhotons, sigmaT, momentumSpread, gaussPacket,
    expectation, mesureInterfrange};
})();
/* QM-END */
