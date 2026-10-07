// Moteur de la planche « Molécules et mole » (Fondations 28 · 29).
// Testé avant la page : copier à l'identique dans le <script> de la page, du marqueur
// MOL-BEGIN au marqueur MOL-END inclus. Tests : node prompts/moteurs/molecules-mole.test.js [page.html]
/* MOL-BEGIN */
/* ================= Moteur chimique : fonctions pures, sans DOM =================
   Unités. Échelle atomique (étapes 1 à 3) : distances en pm, temps en fs, énergies en eV,
   masses en u, moments dipolaires en debye (D). Étape 4 : unités réduites de Lennard-Jones
   (σ = 1, ε = 1, m = 1, k_B = 1). Étapes 5 à 7 : g, mol, L, g/mol, mol/L (usage de la chimie).
   Tout le hasard passe par un générateur à graine (mulberry32). */
const Mol = (() => {
  const TAU = 2 * Math.PI;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

  // Générateur pseudo-aléatoire à graine : renvoie une fonction () → [0, 1).
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Loi normale centrée réduite (Box-Muller) à partir d'un rng.
  function gauss(rng) {
    let u = rng(); if (u < 1e-12) u = 1e-12;
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * rng());
  }

  /* ---------------- Constantes ---------------- */
  const NA = 6.02214076e23;            // mol⁻¹, exact (SI 2019)
  const EV = 1.602176634e-19;          // J, exact
  const KJMOL_PER_EV = EV * NA / 1000; // 96,485 kJ/mol par eV et par liaison
  const DEBYE = 3.33564e-30;           // C·m
  // a [pm/fs²] = ACC · F [eV/pm] / μ [u] ; ½ μ v² [eV] = μ v² / (2·ACC) avec v en pm/fs.
  const ACC = EV / 1e-12 / 1.66053906660e-27 * 1e12 / 1e30;   // 96,485…

  /* ---------------- Étape 1 : potentiel de liaison (Morse) ----------------
     E(r) = De·(1 − e^{−a(r−re)})² − De : nul à l'infini, minimum −De en r = re.
     F(r) = −dE/dr (eV/pm) : > 0 (répulsive, vers les grands r) sous re, < 0 (attractive) au-delà. */
  function morse(r, p) {
    const x = Math.exp(-p.a * (r - p.re));
    return p.De * (1 - x) * (1 - x) - p.De;
  }
  function morseForce(r, p) {
    const x = Math.exp(-p.a * (r - p.re));
    return -2 * p.De * p.a * x * (1 - x);
  }
  // Paramètres. De : profondeur du puits (eV) ; D298 : énergie de liaison usuelle à 298 K (kJ/mol,
  // enthalpie de dissociation tabulée) ; elle est un peu plus petite que De·N_A, l'écart étant
  // surtout l'énergie de vibration du point zéro. a (pm⁻¹) ajusté sur la raideur k = 2·De·a²
  // tirée du nombre d'onde de vibration ; mu : masse réduite (u).
  const BONDS = {
    'H–H':  { A: 'H',  B: 'H',  De: 4.75, re: 74.1,  a: 0.01944, mu: 0.50391, D298: 436, k: 575 },
    'Cl–Cl':{ A: 'Cl', B: 'Cl', De: 2.54, re: 199,   a: 0.01992, mu: 17.4844, D298: 242, k: 323 },
    'H–Cl': { A: 'H',  B: 'Cl', De: 4.62, re: 127,   a: 0.01867, mu: 0.97959, D298: 431, k: 516 }
  };
  const bondEnergyEV = b => b.D298 / KJMOL_PER_EV;               // énergie de liaison par liaison, eV
  // Petite (ou grande) oscillation : état {r (pm), v (pm/fs), t (fs)}, Verlet vitesse, dt en fs.
  function vibrate(s, bond, dt) {
    const a0 = ACC * morseForce(s.r, bond) / bond.mu;
    const v1 = s.v + 0.5 * dt * a0, r = s.r + dt * v1;
    const a1 = ACC * morseForce(r, bond) / bond.mu;
    return { r, v: v1 + 0.5 * dt * a1, t: (s.t || 0) + dt };
  }
  const kinetic = (s, bond) => bond.mu * s.v * s.v / (2 * ACC);   // eV
  const bondEnergy = (s, bond) => kinetic(s, bond) + morse(s.r, bond);
  // Vitesse relative (pm/fs, vers les grands r) qui donne l'énergie totale E à la distance r ; NaN si impossible.
  function speedForEnergy(r, bond, E) { const K = E - morse(r, bond); return K < 0 ? NaN : Math.sqrt(2 * ACC * K / bond.mu); }
  // Période des petites oscillations (fs) : T = 2π √(μ/k), k = 2·De·a².
  const vibPeriod = bond => TAU * Math.sqrt(bond.mu / (ACC * 2 * bond.De * bond.a * bond.a));

  /* ---------------- Étape 2 : électronégativité ----------------
     Échelle de Pauling. Seuils pédagogiques CONVENTIONNELS (les manuels placent la frontière
     polaire/ionique entre 1,7 et 2,0) : Δχ < 0,4 non polaire ; 0,4 ≤ Δχ < 1,8 polaire ; Δχ ≥ 1,8 ionique.
     delta : caractère ionique de Pauling 1 − e^{−Δχ²/4}, une charge partielle indicative (en e). */
  const CHI = { H: 2.20, B: 2.04, C: 2.55, N: 3.04, O: 3.44, F: 3.98, Na: 0.93, Cl: 3.16, K: 0.82, S: 2.58 };
  const METALS = { Na: true, K: true };
  const CHI_THRESHOLDS = { polar: 0.4, ionic: 1.8 };
  function bondCharacter(A, B) {
    const xa = CHI[A], xb = CHI[B];
    const dchi = Math.round(Math.abs(xa - xb) * 100) / 100;
    const type = dchi < CHI_THRESHOLDS.polar ? 'covalente non polaire' : dchi < CHI_THRESHOLDS.ionic ? 'covalente polaire' : 'ionique';
    const delta = 1 - Math.exp(-dchi * dchi / 4);
    const minus = dchi === 0 ? null : (xa > xb ? A : B), plus = dchi === 0 ? null : (xa > xb ? B : A);
    let caveat = null;
    if (METALS[A] && METALS[B]) caveat = 'Deux métaux : ni covalente ni ionique, une liaison métallique (hors de ce module).';
    else if ((METALS[A] || METALS[B]) && type !== 'ionique') caveat = 'Métal et non-métal : en réalité surtout ionique malgré Δχ ; les seuils sont des conventions.';
    return { dchi, type, delta, plus, minus, chiA: xa, chiB: xb, caveat };
  }

  /* ---------------- Étape 3 : VSEPR ----------------
     Chaque domaine d'électrons (liaison ou doublet libre) est un point sur la sphère unité ; les points
     se repoussent en 1/d (énergie Σ c_ij/d_ij). Coefficients : liaison–liaison 1, doublet–liaison
     VSEPR.lam = 1,25, doublet–doublet lam² : un doublet libre repousse plus fort qu'une liaison.
     Ce coefficient est ajusté (NH₃ 106,7°, H₂O 104,4° ; mesurés 106,7° et 104,5°). Le modèle est limité
     à quatre domaines (règle de l'octet) : au-delà, une répulsion aussi simple ne retrouve pas les
     formes observées (le plan carré de XeF₄, par exemple). */
  const VSEPR = { lam: 1.25, p: 1, h: 0.02, maxDomains: 4 };
  const coef = (ka, kb) => (ka + kb === 0 ? 1 : ka + kb === 1 ? VSEPR.lam : VSEPR.lam * VSEPR.lam);
  // sys = {pts: [[x,y,z]…], kinds: [0 = liaison, 1 = doublet libre]}. Un pas de descente projetée.
  // Renvoie {sys, E, fmax} ; fmax = plus grande force tangentielle (critère de convergence).
  function relaxStep(sys, h) {
    const P = sys.pts, K = sys.kinds, n = P.length, F = P.map(() => [0, 0, 0]);
    let E = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const dx = P[i][0] - P[j][0], dy = P[i][1] - P[j][1], dz = P[i][2] - P[j][2];
      const d = Math.max(1e-6, Math.hypot(dx, dy, dz)), c = coef(K[i], K[j]);
      E += c / d;
      const f = c / (d * d * d);
      F[i][0] += f * dx; F[i][1] += f * dy; F[i][2] += f * dz;
      F[j][0] -= f * dx; F[j][1] -= f * dy; F[j][2] -= f * dz;
    }
    let fmax = 0;
    const out = P.map((p, i) => {
      const fr = F[i][0] * p[0] + F[i][1] * p[1] + F[i][2] * p[2];
      const ft = [F[i][0] - fr * p[0], F[i][1] - fr * p[1], F[i][2] - fr * p[2]];
      fmax = Math.max(fmax, Math.hypot(ft[0], ft[1], ft[2]));
      const q = [p[0] + h * ft[0], p[1] + h * ft[1], p[2] + h * ft[2]], L = Math.hypot(q[0], q[1], q[2]);
      return [q[0] / L, q[1] / L, q[2] / L];
    });
    return { sys: { pts: out, kinds: K.slice() }, E, fmax };
  }
  // Départ aléatoire (à graine) : nBond liaisons puis nLone doublets.
  function randomDomains(nBond, nLone, rng) {
    const pts = [], kinds = [];
    for (let i = 0; i < nBond + nLone; i++) {
      const z = 2 * rng() - 1, ph = TAU * rng(), s = Math.sqrt(1 - z * z);
      pts.push([s * Math.cos(ph), s * Math.sin(ph), z]); kinds.push(i < nBond ? 0 : 1);
    }
    return { pts, kinds };
  }
  // Relaxe jusqu'à fmax < tol ou iters pas. Renvoie {dirs (liaisons), lones (doublets), pts, kinds, E, iters, fmax}.
  function relaxDomains(nBond, nLone, iters, seed, tol) {
    if (nBond + nLone > VSEPR.maxDomains) throw new Error('VSEPR : quatre domaines au plus dans ce modèle');
    iters = iters || 20000; tol = tol == null ? 1e-13 : tol;
    let sys = randomDomains(nBond, nLone, mulberry32(seed == null ? 7 : seed)), E = 0, fmax = Infinity, k = 0;
    for (; k < iters && fmax > tol; k++) { const r = relaxStep(sys, VSEPR.h); sys = r.sys; E = r.E; fmax = r.fmax; }
    return { dirs: sys.pts.filter((_, i) => sys.kinds[i] === 0), lones: sys.pts.filter((_, i) => sys.kinds[i] === 1), pts: sys.pts, kinds: sys.kinds, E, iters: k, fmax };
  }
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  // Angles (degrés) entre toutes les paires de directions.
  function angles(dirs) {
    const out = [];
    for (let i = 0; i < dirs.length; i++) for (let j = i + 1; j < dirs.length; j++) out.push(Math.acos(clamp(dot(dirs[i], dirs[j]), -1, 1)) * 180 / Math.PI);
    return out;
  }
  // Nom de la géométrie (forme des atomes, pas des domaines), table VSEPR.
  function geometryName(nBond, nLone) {
    const T = { '1,0': 'linéaire', '1,1': 'linéaire', '1,2': 'linéaire', '1,3': 'linéaire', '2,0': 'linéaire', '3,0': 'plane trigonale', '4,0': 'tétraédrique', '2,1': 'coudée', '3,1': 'pyramidale', '2,2': 'coudée' };
    return T[nBond + ',' + nLone] || '—';
  }
  // Molécules de référence : atome central, ligand, domaines, moment de liaison (D) et mesures.
  // Moments de liaison usuels : C=O 2,3 ; B–F 1,7 ; C–H 0,4 ; N–H 1,31 ; O–H 1,51 ; H–Cl 1,08 D.
  // Angles et moments dipolaires mesurés (phase gazeuse).
  const MOLECULES = {
    CO2: { name: 'CO₂', center: 'C', ligand: 'O', nBond: 2, nLone: 0, bondMoment: 2.3, angleRef: 180, dipoleRef: 0, geometry: 'linéaire' },
    BF3: { name: 'BF₃', center: 'B', ligand: 'F', nBond: 3, nLone: 0, bondMoment: 1.7, angleRef: 120, dipoleRef: 0, geometry: 'plane trigonale' },
    CH4: { name: 'CH₄', center: 'C', ligand: 'H', nBond: 4, nLone: 0, bondMoment: 0.4, angleRef: 109.47, dipoleRef: 0, geometry: 'tétraédrique' },
    NH3: { name: 'NH₃', center: 'N', ligand: 'H', nBond: 3, nLone: 1, bondMoment: 1.31, angleRef: 106.7, dipoleRef: 1.47, geometry: 'pyramidale' },
    H2O: { name: 'H₂O', center: 'O', ligand: 'H', nBond: 2, nLone: 2, bondMoment: 1.51, angleRef: 104.5, dipoleRef: 1.85, geometry: 'coudée' },
    HCl: { name: 'HCl', center: 'Cl', ligand: 'H', nBond: 1, nLone: 3, bondMoment: 1.08, angleRef: null, dipoleRef: 1.08, geometry: 'linéaire' }
  };
  // Moment dipolaire : somme vectorielle des moments de liaison. Convention des chimistes : la flèche
  // va de δ+ vers δ−. Le ligand plus électronégatif que le centre → flèche du centre vers le ligand.
  // mol : une entrée de MOLECULES (ou {center, ligand, bondMoment}) ; dirs : directions des liaisons
  // (relaxées si omises). Renvoie {vec (D), mag (D), bonds: [vecteurs]}.
  function dipole(mol, dirs) {
    if (!dirs) dirs = relaxDomains(mol.nBond, mol.nLone).dirs;
    const sgn = CHI[mol.ligand] > CHI[mol.center] ? 1 : -1, m = mol.bondMoment;
    const bonds = dirs.map(d => [sgn * m * d[0], sgn * m * d[1], sgn * m * d[2]]);
    const vec = bonds.reduce((s, b) => [s[0] + b[0], s[1] + b[1], s[2] + b[2]], [0, 0, 0]);
    return { vec, mag: Math.hypot(vec[0], vec[1], vec[2]), bonds };
  }

  /* ---------------- Étape 4 : forces entre molécules (qualitatif, 2D) ----------------
     Disques de diamètre σ = 1 dans une boîte à parois, potentiel de Lennard-Jones tronqué à 2,5σ
     (profondeur eps selon la substance) et sites collants directionnels (« patchs ») portés par chaque
     molécule à 0,5σ du centre : un site donneur (δ+, H) attire un site accepteur (δ−, doublet) d'une
     autre molécule, U = −eh·(1 − (d/rc)²)² si la distance entre sites d < rc. Donneur–donneur et
     accepteur–accepteur : rien. Thermostat de Langevin à la température T (unités réduites) en
     translation et en rotation. Gravité g facultative (le liquide tombe au fond). */
  const LJ = { rc: 2.5, sigma: 1 };
  const PATCH = { r: 0.5, rc: 0.32 };
  // Sites : angle (rad) par rapport à l'orientation de la molécule, type 'D' (donneur) ou 'A' (accepteur).
  const SUBSTANCES = {
    methane: { name: 'type méthane', eps: 0.55, eh: 0, sites: [] },
    hcl:     { name: 'type HCl', eps: 0.70, eh: 1.4, sites: [{ a: 0, t: 'D' }, { a: Math.PI, t: 'A' }] },
    eau:     { name: 'type eau', eps: 0.70, eh: 3.6, sites: [{ a: 52.25 * Math.PI / 180, t: 'D' }, { a: -52.25 * Math.PI / 180, t: 'D' }, { a: Math.PI - 52.25 * Math.PI / 180, t: 'A' }, { a: Math.PI + 52.25 * Math.PI / 180, t: 'A' }] }
  };
  // Températures d'ébullition réelles sous 1 atm (°C).
  const BOILING = { CH4: -161.5, H2S: -60, NH3: -33, HF: 19.5, H2O: 100 };
  const LIQ = { L: 18, n: 40, I: 0.125, gamma: 1.0, dt: 0.004, g: 0, clusterR: 1.35, clusterMin: 4, hbondD: 0.25 };
  // Températures réduites où la moitié des molécules du modèle sont en amas (mesurées : 6 graines,
  // 16 000 pas). Correspondance INDICATIVE avec les kelvins : Kscale ajusté pour que ces trois
  // transitions tombent près des ébullitions réelles (CH₄ 112 K, HCl 188 K, H₂O 373 K) ; le modèle
  // donne alors ≈ 124, 187 et 371 K. Ce n'est pas une prédiction.
  LIQ.Tb = { methane: 0.255, hcl: 0.385, eau: 0.765 };
  LIQ.Kscale = 485;
  const toKelvin = Tred => Tred * LIQ.Kscale;
  // Crée un système : n molécules sur une grille avec un peu de désordre, orientations et vitesses tirées.
  function liquidInit(subKey, T, seed, opt) {
    opt = Object.assign({}, LIQ, opt || {});
    const rng = mulberry32(seed), n = opt.n, L = opt.L;
    const x = new Float64Array(n), y = new Float64Array(n), th = new Float64Array(n), vx = new Float64Array(n), vy = new Float64Array(n), w = new Float64Array(n);
    const cols = Math.ceil(Math.sqrt(n)), gap = (L - 1) / cols;
    const order = Array.from({ length: cols * cols }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
    const sT = Math.sqrt(Math.max(T, 1e-6)), sI = Math.sqrt(Math.max(T, 1e-6) / opt.I);
    for (let i = 0; i < n; i++) {
      const c = order[i] % cols, r = Math.floor(order[i] / cols);
      x[i] = 0.5 + gap * (c + 0.5) + (rng() - 0.5) * 0.2 * gap; y[i] = 0.5 + gap * (r + 0.5) + (rng() - 0.5) * 0.2 * gap;
      th[i] = TAU * rng(); vx[i] = sT * gauss(rng); vy[i] = sT * gauss(rng); w[i] = sI * gauss(rng);
    }
    const sys = { sub: subKey, n, L: opt.L, I: opt.I, gamma: opt.gamma, g: opt.g, x, y, th, vx, vy, w, fx: new Float64Array(n), fy: new Float64Array(n), tq: new Float64Array(n), U: 0, nh: 0, t: 0, rng };
    liquidForces(sys);
    return sys;
  }
  // Forces, couples, énergie potentielle et nombre de liaisons « hydrogène » (paires de sites liées).
  function liquidForces(sys) {
    const S = SUBSTANCES[sys.sub], n = sys.n, x = sys.x, y = sys.y, th = sys.th, fx = sys.fx, fy = sys.fy, tq = sys.tq;
    const eps = S.eps, eh = S.eh, sites = S.sites, ns = sites.length, rc2 = LJ.rc * LJ.rc;
    const prc = PATCH.rc, pr = PATCH.r, prc2 = prc * prc;
    const ir = 1 / LJ.rc, ir6 = ir * ir * ir * ir * ir * ir, shift = 4 * eps * (ir6 * ir6 - ir6);
    fx.fill(0); fy.fill(0); tq.fill(0);
    let U = 0, nh = 0;
    // positions des sites (relatives au centre)
    const sx = new Float64Array(n * ns), sy = new Float64Array(n * ns);
    for (let i = 0; i < n; i++) for (let k = 0; k < ns; k++) { const a = th[i] + sites[k].a; sx[i * ns + k] = pr * Math.cos(a); sy[i * ns + k] = pr * Math.sin(a); }
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const dx = x[i] - x[j], dy = y[i] - y[j], r2 = dx * dx + dy * dy;
      if (r2 >= rc2) continue;
      const i2 = 1 / Math.max(r2, 0.36), i6 = i2 * i2 * i2;
      U += 4 * eps * (i6 * i6 - i6) - shift;
      const f = 24 * eps * (2 * i6 * i6 - i6) * i2;          // F/r
      fx[i] += f * dx; fy[i] += f * dy; fx[j] -= f * dx; fy[j] -= f * dy;
      if (!ns || r2 > 4) continue;
      for (let a = 0; a < ns; a++) for (let b = 0; b < ns; b++) {
        if (sites[a].t === sites[b].t) continue;              // seulement donneur–accepteur
        const ax = x[i] + sx[i * ns + a], ay = y[i] + sy[i * ns + a], bx = x[j] + sx[j * ns + b], by = y[j] + sy[j * ns + b];
        const ex = ax - bx, ey = ay - by, d2 = ex * ex + ey * ey;
        if (d2 >= prc2) continue;
        const q = 1 - d2 / prc2;
        U -= eh * q * q;
        if (d2 < PATCH.hb2) nh++;
        const g = -4 * eh * q / prc2;                         // force sur le site a : g·(ex, ey)
        const gx = g * ex, gy = g * ey;
        fx[i] += gx; fy[i] += gy; fx[j] -= gx; fy[j] -= gy;
        tq[i] += sx[i * ns + a] * gy - sy[i * ns + a] * gx;
        tq[j] -= sx[j * ns + b] * gy - sy[j * ns + b] * gx;
      }
    }
    sys.U = U; sys.nh = nh;
  }
  PATCH.hb2 = LIQ.hbondD * LIQ.hbondD;
  // Un pas : Verlet vitesse (B-A-B) puis Langevin exact sur les vitesses (O), parois réfléchissantes.
  function liquidStep(sys, T, dt, rng) {
    rng = rng || sys.rng; dt = dt || LIQ.dt;
    const n = sys.n, x = sys.x, y = sys.y, th = sys.th, vx = sys.vx, vy = sys.vy, w = sys.w, I = sys.I, h = 0.5 * dt, L = sys.L, g = sys.g;
    for (let i = 0; i < n; i++) { vx[i] += h * sys.fx[i]; vy[i] += h * (sys.fy[i] - g); w[i] += h * sys.tq[i] / I; x[i] += dt * vx[i]; y[i] += dt * vy[i]; th[i] += dt * w[i]; }
    for (let i = 0; i < n; i++) {
      if (x[i] < 0.5) { x[i] = 1 - x[i]; vx[i] = Math.abs(vx[i]); } else if (x[i] > L - 0.5) { x[i] = 2 * (L - 0.5) - x[i]; vx[i] = -Math.abs(vx[i]); }
      if (y[i] < 0.5) { y[i] = 1 - y[i]; vy[i] = Math.abs(vy[i]); } else if (y[i] > L - 0.5) { y[i] = 2 * (L - 0.5) - y[i]; vy[i] = -Math.abs(vy[i]); }
    }
    liquidForces(sys);
    for (let i = 0; i < n; i++) { vx[i] += h * sys.fx[i]; vy[i] += h * (sys.fy[i] - g); w[i] += h * sys.tq[i] / I; }
    const c1 = Math.exp(-sys.gamma * dt), q = Math.sqrt(Math.max(0, 1 - c1 * c1)), sT = q * Math.sqrt(Math.max(T, 0)), sI = sT / Math.sqrt(I);
    for (let i = 0; i < n; i++) { vx[i] = c1 * vx[i] + sT * gauss(rng); vy[i] = c1 * vy[i] + sT * gauss(rng); w[i] = c1 * w[i] + sI * gauss(rng); }
    sys.t += dt;
    return sys;
  }
  // Température cinétique instantanée (translation 2D + rotation : 3 degrés de liberté par molécule).
  function liquidTemp(sys) {
    let e = 0; for (let i = 0; i < sys.n; i++) e += 0.5 * (sys.vx[i] * sys.vx[i] + sys.vy[i] * sys.vy[i]) + 0.5 * sys.I * sys.w[i] * sys.w[i];
    return 2 * e / (3 * sys.n);
  }
  // Amas : deux molécules sont voisines si leurs centres sont à moins de LIQ.clusterR ; une molécule est
  // « en amas » si son groupe connexe compte au moins LIQ.clusterMin molécules. Renvoie la fraction.
  function clusters(sys) {
    const n = sys.n, parent = Array.from({ length: n }, (_, i) => i), R2 = LIQ.clusterR * LIQ.clusterR;
    const find = i => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const dx = sys.x[i] - sys.x[j], dy = sys.y[i] - sys.y[j];
      if (dx * dx + dy * dy < R2) { const a = find(i), b = find(j); if (a !== b) parent[a] = b; }
    }
    const size = new Map(); for (let i = 0; i < n; i++) { const r = find(i); size.set(r, (size.get(r) || 0) + 1); }
    const root = Array.from({ length: n }, (_, i) => find(i));
    return { root, size, inCluster: root.map(r => size.get(r) >= LIQ.clusterMin) };
  }
  function clusterFraction(sys) { const c = clusters(sys); let k = 0; for (const b of c.inCluster) if (b) k++; return k / sys.n; }
  const hbonds = sys => sys.nh;

  /* ---------------- Étape 5 : mole et masse ----------------
     Masses atomiques standard (g/mol), IUPAC abrégées. */
  const ATOMIC_MASS = { H: 1.008, He: 4.0026, B: 10.81, C: 12.011, N: 14.007, O: 15.999, F: 18.998, Na: 22.990, S: 32.06, Cl: 35.45, K: 39.098, Ca: 40.078, Fe: 55.845 };
  // Analyse d'une formule simple : symboles, indices, parenthèses imbriquées. 'Ca(OH)2' → {Ca:1, O:2, H:2}.
  function atomCounts(formula) {
    const f = String(formula).replace(/[₀-₉]/g, c => String(c.charCodeAt(0) - 0x2080));
    let i = 0;
    function group() {
      const out = {};
      while (i < f.length && f[i] !== ')') {
        let part;
        if (f[i] === '(') { i++; part = group(); if (f[i] !== ')') throw new Error('Parenthèse non fermée : ' + formula); i++; }
        else {
          const m = /^[A-Z][a-z]?/.exec(f.slice(i)); if (!m) throw new Error('Formule illisible : ' + formula);
          if (!(m[0] in ATOMIC_MASS)) throw new Error('Élément inconnu : ' + m[0]);
          i += m[0].length; part = { [m[0]]: 1 };
        }
        const d = /^\d+/.exec(f.slice(i)); let k = 1; if (d) { k = +d[0]; i += d[0].length; }
        for (const e in part) out[e] = (out[e] || 0) + k * part[e];
      }
      return out;
    }
    const r = group(); if (i !== f.length) throw new Error('Parenthèse en trop : ' + formula);
    return r;
  }
  function molarMass(formula) { const c = atomCounts(formula); let M = 0; for (const e in c) M += c[e] * ATOMIC_MASS[e]; return M; }
  const moles = (m, M) => m / M;                 // n = m/M (mol)
  const particles = n => n * NA;                 // N = n·N_A
  // Quantité de matière dans un volume de liquide pur : V (L), masse volumique rho (g/mL).
  const molesInVolume = (V, rho, M) => V * 1000 * rho / M;
  // Substances de l'étape 5 (masse volumique en g/mL à 20 °C, à titre d'ordre de grandeur ; hélium : gaz à 0 °C, 1 atm).
  const SUBSTANCES_MOLE = {
    eau: { name: 'eau', formula: 'H2O', rho: 0.998 }, sel: { name: 'sel', formula: 'NaCl', rho: 2.165 },
    sucre: { name: 'sucre (glucose)', formula: 'C6H12O6', rho: 1.54 }, fer: { name: 'fer', formula: 'Fe', rho: 7.874 },
    helium: { name: 'hélium', formula: 'He', rho: 0.0001786 }
  };

  /* ---------------- Étape 6 : solutions ---------------- */
  const conc = (n, V) => n / V;                  // C = n/V (mol/L si V en L)
  const dilute = (C1, V1, V2) => C1 * V1 / V2;   // C₁V₁ = C₂V₂ (V₁, V₂ dans la même unité)
  const massConc = (C, M) => C * M;              // g/L

  /* ---------------- Étape 7 : stœchiométrie ----------------
     Coefficients stœchiométriques ν (> 0). Avancement ξ (mol) : n_i = n_i,0 − ν_i ξ pour un réactif,
     n_p = n_p,0 + ν_p ξ pour un produit. Réaction totale : ξ_max = min(n_i,0 / ν_i). */
  const REACTIONS = {
    methane: { name: 'Combustion du méthane', reactants: { CH4: 1, O2: 2 }, products: { CO2: 1, H2O: 2 } },
    eau:     { name: 'Synthèse de l’eau', reactants: { H2: 2, O2: 1 }, products: { H2O: 2 } },
    propane: { name: 'Combustion du propane', reactants: { C3H8: 1, O2: 5 }, products: { CO2: 3, H2O: 4 } },
    nacl:    { name: 'Formation du chlorure de sodium', reactants: { Na: 2, Cl2: 1 }, products: { NaCl: 2 } }
  };
  // Vrai si chaque élément apparaît autant de fois de chaque côté.
  function balanced(rx) {
    const side = o => { const t = {}; for (const s in o) { const c = atomCounts(s); for (const e in c) t[e] = (t[e] || 0) + o[s] * c[e]; } return t; };
    const a = side(rx.reactants), b = side(rx.products), keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) if ((a[k] || 0) !== (b[k] || 0)) return false;
    return true;
  }
  // moles : {espèce: n initial} (réactifs ; produits facultatifs, 0 par défaut). xi facultatif : avancement
  // imposé (0 ≤ xi ≤ ξ_max), sinon réaction totale.
  function react(rx, moles, xi) {
    let ext = Infinity; const lim = [];
    for (const s in rx.reactants) { const r = (moles[s] || 0) / rx.reactants[s]; if (r < ext - 1e-12) { ext = r; lim.length = 0; lim.push(s); } else if (Math.abs(r - ext) <= 1e-12) lim.push(s); }
    const extent = xi == null ? ext : clamp(xi, 0, ext);
    const leftover = {}, products = {};
    let massBefore = 0, massAfter = 0;
    for (const s in rx.reactants) { const n0 = moles[s] || 0, M = molarMass(s); leftover[s] = Math.max(0, n0 - rx.reactants[s] * extent); if (leftover[s] < 1e-12 * Math.max(1, n0)) leftover[s] = 0; massBefore += n0 * M; massAfter += leftover[s] * M; }
    for (const s in rx.products) { const n0 = moles[s] || 0, M = molarMass(s); products[s] = n0 + rx.products[s] * extent; massBefore += n0 * M; massAfter += products[s] * M; }
    return { extent, extentMax: ext, limiting: lim.length === 1 ? lim[0] : lim, leftover, products, massBefore, massAfter };
  }

  return {
    TAU, clamp, mulberry32, gauss, NA, EV, KJMOL_PER_EV, DEBYE, ACC,
    morse, morseForce, BONDS, bondEnergyEV, vibrate, kinetic, bondEnergy, speedForEnergy, vibPeriod,
    CHI, CHI_THRESHOLDS, bondCharacter,
    VSEPR, relaxStep, randomDomains, relaxDomains, angles, geometryName, MOLECULES, dipole,
    LJ, PATCH, SUBSTANCES, BOILING, LIQ, toKelvin, liquidInit, liquidForces, liquidStep, liquidTemp, clusters, clusterFraction, hbonds,
    ATOMIC_MASS, atomCounts, molarMass, moles, particles, molesInVolume, SUBSTANCES_MOLE,
    conc, dilute, massConc,
    REACTIONS, balanced, react
  };
})();
/* MOL-END */
if (typeof module !== 'undefined') module.exports = Mol;
