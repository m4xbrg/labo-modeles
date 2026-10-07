/* EMW-BEGIN */
const EMW = (function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI;
  // ---------- Constantes (SI)
  const C = 299792458;              // m/s
  const EPS0 = 8.8541878e-12;       // F/m
  const MU0 = 1.25663706e-6;        // H/m
  const H = 6.62607015e-34;         // J·s
  const QE = 1.602176634e-19;       // C (et J par eV)
  const HC_EVNM = H * C / QE * 1e9; // ≈ 1239,84 eV·nm
  const UA = 1.495978707e11;        // m
  const P_SOLEIL = 3.828e26;        // W (luminosité nominale IAU)
  const ION_EV = 10;                // seuil d'ionisation retenu, eV (≈ 124 nm)

  // ---------- Générateur à graine
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // =====================================================================
  // 1. Champ retardé d'une charge, en unités de scène (c de scène, k = q/4πε₀ = 1)
  // =====================================================================
  // Tampon circulaire à pas fixe dt : positions, vitesses, accélérations passées.
  // Avant le premier échantillon : mouvement uniforme prolongé (vitesse du premier échantillon, a = 0).
  function chargeHistory(opts) {
    const o = opts || {};
    const dt = o.dt || 1 / 240, cap = Math.max(4, Math.ceil((o.span || 10) / dt) + 2);
    return {
      c: o.c || 100, dt, cap, n: 0, head: -1, t0: 0,
      x: new Float64Array(cap), y: new Float64Array(cap),
      vx: new Float64Array(cap), vy: new Float64Array(cap),
      ax: new Float64Array(cap), ay: new Float64Array(cap)
    };
  }
  // Ajoute l'état au temps t = t0 + n·dt (le tampon suppose des pas réguliers).
  function pushState(h, s) {
    if (h.n === 0) h.t0 = s.t;
    else if (h.n >= h.cap) h.t0 += h.dt;
    h.head = (h.head + 1) % h.cap;
    const i = h.head;
    h.x[i] = s.x; h.y[i] = s.y; h.vx[i] = s.vx || 0; h.vy[i] = s.vy || 0; h.ax[i] = s.ax || 0; h.ay[i] = s.ay || 0;
    if (h.n < h.cap) h.n++;
  }
  function clearHistory(h) { h.n = 0; h.head = -1; h.t0 = 0; }
  function lastTime(h) { return h.t0 + (h.n - 1) * h.dt; }
  // État interpolé au temps tp (linéaire entre échantillons).
  function stateAt(h, tp) {
    if (h.n === 0) return { x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0 };
    const first = (h.head - h.n + 1 + h.cap) % h.cap;
    const u = (tp - h.t0) / h.dt;
    if (u <= 0) {
      const i = first, d = tp - h.t0;
      return { x: h.x[i] + h.vx[i] * d, y: h.y[i] + h.vy[i] * d, vx: h.vx[i], vy: h.vy[i], ax: 0, ay: 0 };
    }
    if (u >= h.n - 1) {
      const i = h.head, d = tp - lastTime(h);
      return { x: h.x[i] + h.vx[i] * d, y: h.y[i] + h.vy[i] * d, vx: h.vx[i], vy: h.vy[i], ax: h.ax[i], ay: h.ay[i] };
    }
    const k = Math.floor(u), f = u - k;
    const i = (first + k) % h.cap, j = (first + k + 1) % h.cap, g = 1 - f;
    return { x: g * h.x[i] + f * h.x[j], y: g * h.y[i] + f * h.y[j], vx: g * h.vx[i] + f * h.vx[j], vy: g * h.vy[i] + f * h.vy[j],
             ax: g * h.ax[i] + f * h.ax[j], ay: g * h.ay[i] + f * h.ay[j] };
  }
  // Temps retardé : t' = t − |r − r(t')|/c, par point fixe (contractant tant que |v| < c).
  function retardedTime(h, x, y, t) {
    let s = stateAt(h, t), tp = t - Math.hypot(x - s.x, y - s.y) / h.c;
    for (let k = 0; k < 60; k++) {
      s = stateAt(h, tp);
      const nt = t - Math.hypot(x - s.x, y - s.y) / h.c;
      if (Math.abs(nt - tp) < 1e-12 * (1 + Math.abs(t))) { tp = nt; break; }
      tp = nt;
    }
    return tp;
  }
  // Champ au point (x, y), temps t.
  // Ecoul : champ de vitesse de Liénard-Wiechert (exact pour un mouvement uniforme : il pointe depuis la position présente).
  // Erad  : champ de rayonnement non relativiste, n̂×(n̂×a)/(c²R) = −a⊥/(c²R), a évaluée au temps retardé.
  function fieldAt(h, x, y, t) {
    const tp = retardedTime(h, x, y, t), s = stateAt(h, tp), c = h.c;
    const rx = x - s.x, ry = y - s.y, R = Math.hypot(rx, ry) || 1e-9;
    const nx = rx / R, ny = ry / R, bx = s.vx / c, by = s.vy / c;
    const kap = 1 - (nx * bx + ny * by), g = (1 - bx * bx - by * by) / (kap * kap * kap * R * R);
    const an = nx * s.ax + ny * s.ay;
    const fr = 1 / (c * c * R);
    const Ecoul = [(nx - bx) * g, (ny - by) * g];
    const Erad = [(an * nx - s.ax) * fr, (an * ny - s.ay) * fr];
    return { Ecoul, Erad, E: [Ecoul[0] + Erad[0], Ecoul[1] + Erad[1]], tRet: tp, R };
  }
  // Ligne de champ d'angle θ (angle vu par la charge, qui fixe le flux qu'elle porte, donc l'étiquette
  // conservée par Gauss) : le morceau émis au temps t' part de r(t') dans la direction û telle que
  // c·û − v(t') soit parallèle à (cos θ, sin θ), et se trouve à c(t − t') de r(t').
  // En mouvement uniforme, la ligne est droite depuis la position présente ; après une secousse, recoller
  // les morceaux donne le coude (construction de Purcell, valable pour |v| ≪ c).
  function fieldLine(h, theta, t, rMax, ds, r0) {
    const c = h.c, ax = Math.cos(theta), ay = Math.sin(theta), pts = [];
    const d = ds || 2, start = r0 || 0;
    for (let r = start; r <= rMax + 1e-9; r += d) {
      const st = stateAt(h, t - r / c), va = st.vx * ax + st.vy * ay, v2 = st.vx * st.vx + st.vy * st.vy;
      const s = -va + Math.sqrt(Math.max(0, va * va + c * c - v2)), k = r / c;   // |v + s·α̂| = c
      pts.push(st.x + k * (st.vx + s * ax), st.y + k * (st.vy + s * ay));
    }
    return pts;   // [x0, y0, x1, y1, …]
  }
  // Mouvements types (fonctions du temps → état).
  // Coup sec : vitesse v0 jusqu'à t0, puis accélération dv/tau pendant tau, puis v0 + dv.
  function kinkCharge(t0, dv, opts) {
    const o = opts || {}, tau = o.tau || 0.04, v0 = o.v0 || 0, x0 = o.x0 || 0, y0 = o.y0 || 0;
    const ang = o.dir || 0, ex = Math.cos(ang), ey = Math.sin(ang), a = dv / tau;
    return function (t) {
      let s, v, acc;
      if (t <= t0) { s = v0 * (t - t0); v = v0; acc = 0; }
      else if (t <= t0 + tau) { const u = t - t0; s = v0 * u + 0.5 * a * u * u; v = v0 + a * u; acc = a; }
      else { const u = t - t0 - tau; s = v0 * tau + 0.5 * dv * tau + (v0 + dv) * u; v = v0 + dv; acc = 0; }
      return { t, x: x0 + ex * s, y: y0 + ey * s, vx: ex * v, vy: ey * v, ax: ex * acc, ay: ey * acc };
    };
  }
  // Oscillation : x = A sin(ωt) le long de la direction dir.
  function oscCharge(A, omega, opts) {
    const o = opts || {}, ang = o.dir || 0, ex = Math.cos(ang), ey = Math.sin(ang), x0 = o.x0 || 0, y0 = o.y0 || 0;
    return function (t) {
      const s = A * Math.sin(omega * t), v = A * omega * Math.cos(omega * t), acc = -A * omega * omega * Math.sin(omega * t);
      return { t, x: x0 + ex * s, y: y0 + ey * s, vx: ex * v, vy: ey * v, ax: ex * acc, ay: ey * acc };
    };
  }
  function fillHistory(h, motion, tA, tB) {
    const n = Math.round((tB - tA) / h.dt);
    for (let k = 0; k <= n; k++) pushState(h, motion(tA + k * h.dt));
  }

  // =====================================================================
  // 2. Dipôle oscillant, champ lointain (SI). p(t) = p0 cos ωt le long de z.
  // =====================================================================
  function dipoleFar(p0, omega, r, theta, t) {
    const k = omega / C, ph = omega * t - k * r, amp = MU0 * p0 * omega * omega * Math.sin(theta) / (4 * PI * r);
    const Eth = -amp * Math.cos(ph);
    return { Etheta: Eth, Bphi: Eth / C, phase: ph };
  }
  // Intensité moyenne <S> = μ0 p0² ω⁴ sin²θ / (32π² c r²)
  function dipoleIntensity(p0, omega, r, theta) {
    const s = Math.sin(theta);
    return MU0 * p0 * p0 * Math.pow(omega, 4) * s * s / (32 * PI * PI * C * r * r);
  }
  function dipolePower(p0, omega) { return MU0 * p0 * p0 * Math.pow(omega, 4) / (12 * PI * C); }

  // =====================================================================
  // 3. Onde plane progressive selon +x (SI). pol : angle de E dans le plan (y, z), 0 = vertical (y).
  // =====================================================================
  function plane(E0, lambda, x, t, pol) {
    const k = TAU / lambda, w = C * k, a = pol || 0, e = E0 * Math.cos(k * x - w * t), b = e / C;
    const cy = Math.cos(a), cz = Math.sin(a);
    // E = e (0, cos a, sin a) ; B = (x̂ × E)/c = b (0, −sin a, cos a)
    return { E: [0, e * cy, e * cz], B: [0, -b * cz, b * cy] };
  }
  function intensity(E0) { return 0.5 * C * EPS0 * E0 * E0; }
  function E0from(I) { return Math.sqrt(2 * I / (C * EPS0)); }
  function B0from(E0) { return E0 / C; }
  function energyDensity(E, B) { return { uE: 0.5 * EPS0 * E * E, uB: B * B / (2 * MU0) }; }
  function radPressure(I, reflect) { return (reflect ? 2 : 1) * I / C; }

  // =====================================================================
  // 4. Spectre
  // =====================================================================
  const LMIN = 1e-12, LMAX = 1e4;
  // Bornes conventionnelles (en pratique les domaines se chevauchent).
  const bands = [
    { id: 'gamma', nom: 'gamma', lmin: 1e-12, lmax: 1e-11, repond: 'les noyaux', source: 'noyaux radioactifs (⁶⁰Co), sursauts gamma' },
    { id: 'x', nom: 'rayons X', lmin: 1e-11, lmax: 1e-8, repond: 'les électrons profonds des atomes', source: 'tube à rayons X, couronne solaire' },
    { id: 'uv', nom: 'ultraviolet', lmin: 1e-8, lmax: 380e-9, repond: 'les électrons externes ; ionise sous ≈ 124 nm', source: 'Soleil, lampe germicide' },
    { id: 'visible', nom: 'visible', lmin: 380e-9, lmax: 750e-9, repond: 'les électrons externes des atomes et des molécules', source: 'Soleil, flamme, DEL' },
    { id: 'ir', nom: 'infrarouge', lmin: 750e-9, lmax: 1e-3, repond: 'la vibration des liaisons entre atomes', source: 'corps chauds, corps humain' },
    { id: 'micro', nom: 'micro-ondes', lmin: 1e-3, lmax: 1, repond: 'la rotation des molécules (eau)', source: 'four, Wi-Fi, radar, fond cosmologique' },
    { id: 'radio', nom: 'radio', lmin: 1, lmax: 1e4, repond: 'les électrons libres d’une antenne', source: 'émetteurs AM et FM, pulsars' }
  ];
  function bandOf(lambda) {
    for (const b of bands) if (lambda >= b.lmin && lambda < b.lmax) return b;
    return lambda >= LMAX ? bands[bands.length - 1] : bands[0];
  }
  // Fenêtres de l'atmosphère (ce qui arrive au sol), bornes approximatives.
  const windows = [
    { nom: 'fenêtre optique', lmin: 300e-9, lmax: 1.1e-6 },
    { nom: 'fenêtre radio', lmin: 1e-2, lmax: 20 }
  ];
  function inWindow(lambda) { return windows.some(w => lambda >= w.lmin && lambda <= w.lmax); }
  const fFromLambda = l => C / l, lambdaFromF = f => C / f;
  function photonEnergy(lambda) { const J = H * C / lambda; return { J, eV: J / QE }; }
  const LAMBDA_ION = HC_EVNM / ION_EV * 1e-9;   // ≈ 124 nm
  function ionizing(lambda) { return photonEnergy(lambda).eV >= ION_EV; }
  // Rampe sRGB approximative 380-750 nm (atténuée aux bords), gris neutre hors du visible.
  function visibleColor(lambda) {
    const nm = lambda * 1e9;
    if (!(nm >= 380 && nm <= 750)) return { r: 128, g: 128, b: 128, visible: false };
    let r, g, b;
    if (nm < 440) { r = -(nm - 440) / 60; g = 0; b = 1; }
    else if (nm < 490) { r = 0; g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { r = 0; g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; b = 0; }
    else if (nm < 645) { r = 1; g = -(nm - 645) / 65; b = 0; }
    else { r = 1; g = 0; b = 0; }
    const f = nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : nm > 700 ? 0.3 + 0.7 * (750 - nm) / 50 : 1;
    const q = v => Math.round(255 * Math.pow(v * f, 0.8));
    return { r: q(r), g: q(g), b: q(b), visible: true };
  }
  // Objets de comparaison (taille caractéristique, m).
  const objects = [
    { nom: 'une ville', taille: 5e3 },
    { nom: 'un bâtiment', taille: 30 },
    { nom: 'un humain', taille: 1.7 },
    { nom: 'un ballon', taille: 0.22 },
    { nom: 'une abeille', taille: 1.2e-2 },
    { nom: 'un grain de sable', taille: 5e-4 },
    { nom: 'l’épaisseur d’un cheveu', taille: 7e-5 },
    { nom: 'une cellule', taille: 1e-5 },
    { nom: 'une bactérie', taille: 1.5e-6 },
    { nom: 'un virus', taille: 1e-7 },
    { nom: 'une protéine', taille: 5e-9 },
    { nom: 'une petite molécule', taille: 8e-10 },
    { nom: 'un atome', taille: 1e-10 },
    { nom: 'un noyau', taille: 1.5e-14 }
  ];
  function scaleObject(lambda) {
    let best = objects[0], d = Infinity;
    for (const o of objects) { const e = Math.abs(Math.log10(lambda / o.taille)); if (e < d) { d = e; best = o; } }
    return { nom: best.nom, taille: best.taille, rapport: lambda / best.taille };
  }
  // Préréglages de l'étape 3 (λ en m).
  const presets = [
    { id: 'fm', nom: 'radio FM 100 MHz', lambda: C / 100e6, band: 'radio' },
    { id: 'wifi', nom: 'Wi-Fi 2,4 GHz', lambda: C / 2.4e9, band: 'micro' },
    { id: 'four', nom: 'four à micro-ondes 2,45 GHz', lambda: C / 2.45e9, band: 'micro' },
    { id: 'corps', nom: 'infrarouge du corps 10 µm', lambda: 10e-6, band: 'ir' },
    { id: 'vert', nom: 'vert 550 nm', lambda: 550e-9, band: 'visible' },
    { id: 'uvc', nom: 'UV-C 254 nm', lambda: 254e-9, band: 'uv' },
    { id: 'radio', nom: 'radiographie 0,05 nm', lambda: 0.05e-9, band: 'x' },
    { id: 'co60', nom: 'gamma du ⁶⁰Co (1,17 MeV)', lambda: HC_EVNM * 1e-9 / 1.173e6, band: 'gamma' }
  ];

  // =====================================================================
  // 5. Source ponctuelle
  // =====================================================================
  function inverseSquare(P, r) { return P / (4 * PI * r * r); }
  // Angle solide d'un carré de côté a vu de face, sur son axe, à la distance d.
  function squareSolidAngle(a, d) { return 4 * Math.asin(a * a / (4 * d * d + a * a)); }
  // Fraction des rayons isotropes qui traversent ce carré.
  function hitFraction(a, d) { return squareSolidAngle(a, d) / (4 * PI); }
  // Direction isotrope tirée avec rng (uniforme sur la sphère).
  function isoDir(rng) {
    const z = 2 * rng() - 1, ph = TAU * rng(), s = Math.sqrt(1 - z * z);
    return [s * Math.cos(ph), s * Math.sin(ph), z];
  }

  return {
    C, EPS0, MU0, H, QE, HC_EVNM, UA, P_SOLEIL, ION_EV, LAMBDA_ION, LMIN, LMAX,
    mulberry32,
    chargeHistory, pushState, clearHistory, lastTime, stateAt, retardedTime, fieldAt, fieldLine, kinkCharge, oscCharge, fillHistory,
    dipoleFar, dipoleIntensity, dipolePower,
    plane, intensity, E0from, B0from, energyDensity, radPressure,
    bands, bandOf, windows, inWindow, fFromLambda, lambdaFromF, photonEnergy, ionizing, visibleColor, objects, scaleObject, presets,
    inverseSquare, squareSolidAngle, hitFraction, isoDir
  };
})();
/* EMW-END */
if (typeof module !== 'undefined') module.exports = EMW;
