// Moteur de la planche « Atomes, noyaux et lumière » (Fondations 26 · 27).
// Verrouillé : copier à l'identique dans le <script> de la page, du marqueur
// ATOM-BEGIN au marqueur ATOM-END inclus. Tests : node prompts/moteurs/atomes.test.js [page.html]
//
// Unités : énergies nucléaires en MeV, énergies atomiques en eV, longueurs en fm (noyaux)
// et en nm (lumière), demi-vies en secondes, masses en u ou en excès de masse (keV).
// Aucune dépendance au DOM. Tout le hasard passe par un générateur à graine (mulberry32).

/* ATOM-BEGIN */
const Atom = (function () {
  'use strict';
  const PI = Math.PI;

  // ---------- Constantes (CODATA 2018 ; AME2020 pour les masses)
  const KE2 = 1.439964548;        // e²/(4π ε0), MeV·fm
  const U_MEV = 931.49410242;     // 1 u · c², MeV
  const M_ALPHA = 3727.3794066;   // masse de la particule α, MeV/c²
  const M_N_U = 1.00866491595;    // neutron, u
  const M_H_U = 1.007825031898;   // atome ¹H, u
  const D_N = 8071.31806;         // excès de masse du neutron, keV
  const D_H = 7288.971064;        // excès de masse de ¹H, keV
  const H_EVS = 4.135667696e-15;  // constante de Planck, eV·s
  const C = 299792458;            // m/s
  const HC = 1239.841984;         // h c, eV·nm
  const RY_H = 13.598434;         // énergie d'ionisation de l'hydrogène, eV (Rydberg corrigé de la masse réduite)
  const R_H = 10967758.34;        // constante de Rydberg de l'hydrogène, m⁻¹
  const R_AU = 1.44e5;            // rayon atomique de l'or, fm (144 pm)
  const B_DISPLAY = 1000;         // rayon du disque visé autour d'un noyau sur la planche, fm
  const YEAR = 31556926;          // s (convention NUBASE : 365,2422 j)

  // ---------- Hasard à graine
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

  /* =================== 1. Diffusion de Rutherford =================== */

  // Distance minimale d'approche frontale (b = 0) d'une particule α d'énergie cinétique E (MeV)
  // sur un noyau de charge Z fixe : d = 2 Z e²/(4π ε0 E).
  function closestApproach(E, Z) { return 2 * Z * KE2 / E; }
  // Distance minimale pour un paramètre d'impact b (fm).
  function rMin(E, Z, b) { const d = closestApproach(E, Z); return d / 2 + Math.sqrt(d * d / 4 + b * b); }
  // Angle de déviation analytique (noyau fixe) : θ = 2 arctan(d / 2b), en radians.
  function rutherfordAngle(E, Z, b) { const d = closestApproach(E, Z); return b <= 0 ? PI : 2 * Math.atan(d / (2 * b)); }
  // Paramètre d'impact qui donne la déviation θ : b = d / (2 tan(θ/2)).
  function impactForAngle(E, Z, theta) { return closestApproach(E, Z) / (2 * Math.tan(theta / 2)); }

  // Trajectoire coulombienne intégrée (RK4, pas adaptatif), noyau fixe à l'origine.
  // La particule part de x = −R0 (R0 = 1e5 · max(d, b)), à la hauteur b, vers +x, avec l'énergie
  // cinétique E à l'infini. dt : fraction de min(r/v, √(r³ m / k)) par pas (défaut 0,01).
  // Rend { pts : [[x, y], …] (fm, seulement r < keep), theta, rmin, dEmax (écart relatif d'énergie) }.
  function rutherfordTraj(E, Z, b, dt, keep) {
    dt = dt || 0.01;
    const d = closestApproach(E, Z), k = 2 * Z * KE2, m = M_ALPHA;
    const scale = Math.max(d, Math.abs(b), 1e-3);
    const R0 = 1e5 * scale;
    keep = keep || 30 * scale;
    let x = -R0, y = b;
    let r = Math.hypot(x, y);
    let vx = Math.sqrt(2 * (E - k / r) / m), vy = 0;
    const energy = (x, y, vx, vy) => 0.5 * m * (vx * vx + vy * vy) + k / Math.hypot(x, y);
    const E0 = energy(x, y, vx, vy);
    const acc = (x, y) => { const r2 = x * x + y * y, r = Math.sqrt(r2), f = k / (m * r2 * r); return [f * x, f * y]; };
    const pts = [];
    let rmin = r, dEmax = 0, guard = 0;
    while (guard++ < 200000) {
      r = Math.hypot(x, y);
      if (r < rmin) rmin = r;
      if (r < keep) pts.push([x, y]);
      if (r > R0 * 1.0001 && (x * vx + y * vy) > 0) break;
      const v = Math.hypot(vx, vy);
      const h = dt * Math.min(r / v, Math.sqrt(r * r * r * m / k));
      const a1 = acc(x, y);
      const x2 = x + 0.5 * h * vx, y2 = y + 0.5 * h * vy, vx2 = vx + 0.5 * h * a1[0], vy2 = vy + 0.5 * h * a1[1];
      const a2 = acc(x2, y2);
      const x3 = x + 0.5 * h * vx2, y3 = y + 0.5 * h * vy2, vx3 = vx + 0.5 * h * a2[0], vy3 = vy + 0.5 * h * a2[1];
      const a3 = acc(x3, y3);
      const x4 = x + h * vx3, y4 = y + h * vy3, vx4 = vx + h * a3[0], vy4 = vy + h * a3[1];
      const a4 = acc(x4, y4);
      x += h / 6 * (vx + 2 * vx2 + 2 * vx3 + vx4);
      y += h / 6 * (vy + 2 * vy2 + 2 * vy3 + vy4);
      vx += h / 6 * (a1[0] + 2 * a2[0] + 2 * a3[0] + a4[0]);
      vy += h / 6 * (a1[1] + 2 * a2[1] + 2 * a3[1] + a4[1]);
      const dE = Math.abs(energy(x, y, vx, vy) - E0) / E0;
      if (dE > dEmax) dEmax = dE;
    }
    return { pts, theta: Math.abs(Math.atan2(vy, vx)), rmin, dEmax, d };
  }

  // Modèle de Thomson : charge +Ze répartie uniformément dans une sphère de rayon R (fm, défaut :
  // rayon atomique de l'or), atome neutre vu de l'extérieur (aucune force au-delà de R).
  // Déviation en approximation d'impulsion (trajectoire droite) : θ = d · b √(R² − b²) / R³.
  function thomsonDeflect(E, Z, b, R) {
    R = R || R_AU;
    b = Math.abs(b);
    if (b >= R) return 0;
    return closestApproach(E, Z) * b * Math.sqrt(R * R - b * b) / (R * R * R);
  }

  // Un tir : paramètre d'impact uniforme dans un disque de rayon bmax (fm) autour d'un noyau.
  // model : 'rutherford' ou 'thomson'. Rend { b, theta } (radians).
  function shot(E, Z, model, rng, bmax) {
    bmax = bmax || (model === 'thomson' ? R_AU : B_DISPLAY);
    const b = bmax * Math.sqrt(rng());
    return { b, theta: model === 'thomson' ? thomsonDeflect(E, Z, b) : rutherfordAngle(E, Z, b) };
  }
  // Nombre attendu de tirs déviés entre θ1 et θ2 (radians, θ1 < θ2) sur n tirs à b uniforme
  // dans le disque bmax : n (b(θ1)² − b(θ2)²) / bmax², avec b(θ) borné à bmax.
  function expectedCount(n, E, Z, th1, th2, bmax) {
    bmax = bmax || B_DISPLAY;
    const bb = th => Math.min(bmax, impactForAngle(E, Z, th));
    const b1 = bb(th1), b2 = th2 >= PI ? 0 : bb(th2);
    return n * (b1 * b1 - b2 * b2) / (bmax * bmax);
  }
  // Section efficace différentielle de Rutherford, fm²/sr : (d/4)² / sin⁴(θ/2).
  function dSigma(E, Z, theta) { const d = closestApproach(E, Z), s = Math.sin(theta / 2); return (d * d / 16) / (s * s * s * s); }
  // Rayon d'un noyau : r ≈ 1,2 fm · A^(1/3).
  function nuclearRadius(A) { return 1.2 * Math.cbrt(A); }

  /* =================== 2. Noyaux =================== */

  const SYMBOLS = ['n', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu'];
  const NAMES = ['neutron', 'hydrogène', 'hélium', 'lithium', 'béryllium', 'bore', 'carbone', 'azote', 'oxygène', 'fluor', 'néon', 'sodium', 'magnésium', 'aluminium', 'silicium', 'phosphore', 'soufre', 'chlore', 'argon', 'potassium', 'calcium', 'scandium', 'titane', 'vanadium', 'chrome', 'manganèse', 'fer', 'cobalt', 'nickel', 'cuivre'];
  const EXTRA = { 36: ['Kr', 'krypton'], 40: ['Zr', 'zirconium'], 50: ['Sn', 'étain'], 51: ['Sb', 'antimoine'], 52: ['Te', 'tellure'], 53: ['I', 'iode'], 54: ['Xe', 'xénon'], 55: ['Cs', 'césium'], 56: ['Ba', 'baryum'], 79: ['Au', 'or'], 82: ['Pb', 'plomb'], 84: ['Po', 'polonium'], 85: ['At', 'astate'], 86: ['Rn', 'radon'], 87: ['Fr', 'francium'], 88: ['Ra', 'radium'], 92: ['U', 'uranium'] };
  function symbol(Z) { return Z < SYMBOLS.length ? SYMBOLS[Z] : (EXTRA[Z] ? EXTRA[Z][0] : '?'); }
  function elementName(Z) { return Z < NAMES.length ? NAMES[Z] : (EXTRA[Z] ? EXTRA[Z][1] : 'élément ' + Z); }

  // Table des nucléides. Source : NUBASE2020 (F. G. Kondev et al., Chinese Physics C 45, 030001, 2021)
  // pour les demi-vies et les modes de désintégration ; AME2020 (M. Wang et al., Chinese Physics C 45,
  // 030003, 2021) pour les excès de masse, extraits de la base du paquet mendeleev 1.3 qui reprend ces
  // deux évaluations. Contenu : Z = 1 à 26, tous les nucléides stables et tous les instables de demi-vie
  // supérieure à 1 ms, plus ⁸Be (instable, 8,19 × 10⁻¹⁷ s) ; hors de cette plage, ⁶⁰Co, ¹³¹I, ²²²Rn et
  // leurs voisins (Z ± 2, N ± 2, demi-vie > 1 ms), ⁹⁰Zr, ¹²⁰Sn, ¹⁹⁷Au, ²⁰⁸Pb, ²³⁵U, ²³⁸U, ¹⁴¹Ba, ⁹²Kr, ¹¹²Te.
  // Format : 'Z:N T mode Δ,…' ; T demi-vie en s (0 = stable), mode : s stable, b- β⁻, b+ β⁺ ou capture
  // électronique, a α, p proton, n neutron (mode principal seulement) ; Δ excès de masse atomique, keV.
  const NUC_SRC = [
    '1:0 0 s 7289,1 0 s 13135.7,2 3.888e8 b- 14949.8',
    '2:1 0 s 14931.2,2 0 s 2424.9,4 0.8069 b- 17592.1,6 0.1195 b- 31609.7',
    '3:3 0 s 14086.9,4 0 s 14907.1,5 0.8387 b- 20945.8,6 0.1782 b- 24954.9,8 0.00875 b- 40728.3',
    '4:3 4.598e6 b+ 15769,4 8.19e-17 a 4941.7,5 0 s 11348.5,6 4.377e13 b- 12607.5,7 13.76 b- 20177.2,8 0.02146 b- 25077.8,10 0.00453 b- 39954.5',
    '5:3 0.7719 b+ 22921.6,5 0 s 12050.6,6 0 s 8667.7,7 0.0202 b- 13369.4,8 0.01716 b- 16561.9,9 0.01236 b- 23663.7,10 0.01018 b- 28957.4,12 0.00508 b- 43716.3,14 0.00292 b- 59770.3',
    '6:3 0.1265 b+ 28911,4 19.3 b+ 15698.7,5 1220 b+ 10649.4,6 0 s 0,7 0 s 3125,8 1.799e11 b- 3019.9,9 2.449 b- 9873.1,10 0.75 b- 13694.1,11 0.193 b- 21031.9,12 0.092 b- 24919.3,13 0.0462 b- 32413.8,14 0.016 b- 37503.6,16 0.0062 b- 53611.2',
    '7:5 0.011 b+ 17338.1,6 597.9 b+ 5345.5,7 0 s 2863.4,8 0 s 101.4,9 7.13 b- 5683.9,10 4.173 b- 7870.1,11 0.6192 b- 13113.2,12 0.336 b- 15856.3,13 0.136 b- 21766.5,14 0.085 b- 25231.9,15 0.023 b- 31764.8,16 0.0139 b- 36720.4',
    '8:5 0.00858 b+ 23115.4,6 70.62 b+ 8007.8,7 122.3 b+ 2855.6,8 0 s -4737,9 0 s -808.8,10 0 s -782.8,11 26.47 b- 3332.9,12 13.51 b- 3796.2,13 3.42 b- 8062,14 2.25 b- 9283,15 0.097 b- 14621.4,16 0.0774 b- 18500.4',
    '9:8 64.37 b+ 1951.7,9 6584 b+ 873.1,10 0 s -1487.4,11 11.01 b- -17.5,12 4.158 b- -47.6,13 4.23 b- 2793.4,14 2.23 b- 3285.3,15 0.384 b- 7544.5,16 0.08 b- 11334.2,17 0.0082 b- 18674.7,18 0.005 b- 25133.5,20 0.0025 b- 40150.2',
    '10:7 0.1092 b+ 16500.5,8 1.664 b+ 5317.6,9 17.26 b+ 1752.1,10 0 s -7041.9,11 0 s -5731.8,12 0 s -8024.7,13 37.15 b- -5154,14 202.8 b- -5951.6,15 0.602 b- -2035.5,16 0.197 b- 481.1,17 0.0309 b- 7050.9,18 0.0188 b- 11299.7,19 0.0147 b- 18399.8,20 0.00722 b- 23280.1,21 0.0034 b- 31181.6,22 0.0035 b- 36998.9',
    '11:9 0.4479 b+ 6850.5,10 22.45 b+ -2184.9,11 8.211e7 b+ -5181.4,12 0 s -9529.9,13 5.384e4 b- -8417.9,14 59.1 b- -9357.8,15 1.071 b- -6860.8,16 0.301 b- -5517.8,17 0.0331 b- -988.3,18 0.0432 b- 2680,19 0.0459 b- 8474.7,20 0.0168 b- 12246,21 0.0129 b- 18640.2,22 0.0082 b- 23780.1,23 0.0055 b- 31680.1,24 0.0015 b- 37831.7',
    '12:8 0.0904 b+ 17477.7,9 0.12 b+ 10903.9,10 3.874 b+ -400,11 11.3 b+ -5473.7,12 0 s -13933.6,13 0 s -13192.8,14 0 s -16214.5,15 566.1 b- -14586.6,16 7.529e4 b- -15019.9,17 1.3 b- -10612.4,18 0.317 b- -8881.4,19 0.27 b- -3122.2,20 0.0804 b- -828.9,21 0.092 b- 4962.9,22 0.0449 b- 8323.3,23 0.0113 b- 15639.8,24 0.0039 b- 20380.2,25 0.008 b- 28211.5',
    '13:9 0.0911 b+ 18201.4,10 0.446 b+ 6748.1,11 2.053 b+ -48.8,12 7.167 b+ -8916,13 2.263e13 b+ -12210.1,14 0 s -17196.9,15 134.7 b- -16850.7,16 393.6 b- -18207.8,17 3.62 b- -15864.1,18 0.644 b- -14950.7,19 0.0326 b- -11099.4,20 0.04146 b- -8497.4,21 0.05373 b- -2997.6,22 0.03816 b- -223.7,23 0.09 b- 5950.4,24 0.0114 b- 9809.6,25 0.009 b- 16469.7,26 0.0076 b- 21489.6',
    '14:8 0.0287 b+ 33640,9 0.0423 b+ 23949.6,10 0.1432 b+ 10745.2,11 0.2206 b+ 3827.3,12 2.245 b+ -7141,13 4.117 b+ -12384.5,14 0 s -21492.8,15 0 s -21895.1,16 0 s -24433,17 9430 b- -22949,18 4.954e9 b- -24077.7,19 6.18 b- -20514.3,20 2.77 b- -19991.7,21 0.78 b- -14391.5,22 0.503 b- -12436.1,23 0.141 b- -6571.5,24 0.063 b- -4170.3,25 0.0412 b- 2320.4,26 0.0312 b- 5666.9,27 0.02 b- 13200.2,28 0.0125 b- 16839.6',
    '15:11 0.0436 b+ 10973,12 0.26 b+ -659,13 0.2703 b+ -7147.9,14 4.102 b+ -16952.8,15 150 b+ -20200.9,16 0 s -24440.5,17 1.233e6 b- -24304.9,18 2.19e6 b- -26337.4,19 12.43 b- -24548.7,20 47.3 b- -24857.8,21 5.6 b- -20251,22 2.31 b- -18996,23 0.64 b- -14621.6,24 0.282 b- -12774.6,25 0.15 b- -8139.2,26 0.101 b- -4979.8,27 0.0485 b- 1091.8,28 0.0358 b- 5040.3,29 0.0185 b- 11109.9',
    '16:11 0.0163 b+ 17490.7,12 0.125 b+ 4073.2,13 0.188 b+ -3094.4,14 1.18 b+ -14059.3,15 2.553 b+ -19042.5,16 0 s -26015.5,17 0 s -26585.9,18 0 s -29931.7,19 7.549e6 b- -28846.2,20 0 s -30664.1,21 303 b- -26896.4,22 1.022e4 b- -26861.2,23 11.5 b- -23162.7,24 8.8 b- -22837.8,25 1.99 b- -19008.6,26 1.016 b- -17637.7,27 0.265 b- -12195.5,28 0.1 b- -9204.2,29 0.068 b- -3340.3,30 0.05 b- 639.9',
    '17:14 0.19 b+ -7034.6,15 0.298 b+ -13334.7,16 2.504 b+ -21003.3,17 1.527 b+ -24440.1,18 0 s -29013.5,19 9.508e12 b- -29522,20 0 s -31761.6,21 2234 b- -29798.1,22 3372 b- -29800.2,23 81 b- -27557.8,24 38.4 b- -27307.2,25 6.8 b- -24831.8,26 3.13 b- -24159.5,27 0.562 b- -20479,28 0.413 b- -18262.5,29 0.232 b- -13734.9,30 0.101 b- -9580.4',
    '18:13 0.015 b+ 11325.1,14 0.098 b+ -2200.4,15 0.173 b+ -9384.3,16 0.8465 b+ -18378.3,17 1.776 b+ -23047.3,18 0 s -30231.5,19 3.025e6 b+ -30947.7,20 0 s -34714.8,21 8.457e9 b- -33242.2,22 0 s -35039.9,23 6577 b- -33067.5,24 1.038e9 b- -34422.7,25 322.2 b- -32009.8,26 712.2 b- -32673.3,27 21.48 b- -29770.8,28 8.4 b- -29771.3,29 1.23 b- -25367.3,30 0.415 b- -22354.9,31 0.236 b- -17060.3,32 0.106 b- -13230',
    '19:16 0.1752 b+ -11172.9,17 0.341 b+ -17417.2,18 1.237 b+ -24800.2,19 459.1 b+ -28800.8,20 0 s -33807.2,21 3.938e16 b- -33535.5,22 0 s -35559.5,23 4.448e4 b- -35022,24 8.028e4 b- -36575.4,25 1328 b- -35781.5,26 1068 b- -36615.6,27 96.3 b- -35413.9,28 17.38 b- -35712,29 6.83 b- -32284.5,30 1.26 b- -29611.5,31 0.472 b- -25727.9,32 0.365 b- -22515.5,33 0.11 b- -17137.6,34 0.03 b- -12295.7,35 0.01 b- -5150.2',
    '20:15 0.0257 b+ 5190.3,16 0.1009 b+ -6451.2,17 0.181 b+ -13136.1,18 0.4437 b+ -22058.5,19 0.8603 b+ -27282.7,20 0 s -34846.4,21 3.137e12 b+ -35137.9,22 0 s -38547.3,23 0 s -38408.9,24 0 s -41468.7,25 1.405e7 b- -40812.2,26 0 s -43139.6,27 3.919e5 b- -42344.7,28 1.767e27 b- -44224.9,29 523.1 b- -41300,30 13.45 b- -39589.2,31 10 b- -36332.3,32 4.6 b- -34266.3,33 0.461 b- -29387.7,34 0.09 b- -25160.6,35 0.022 b- -18650.4,36 0.011 b- -13510.4',
    '21:19 0.1823 b+ -20523.4,20 0.5963 b+ -28642.4,21 0.6807 b+ -32121,22 1.401e4 b+ -36188.1,23 1.455e4 b+ -37816,24 0 s -41072.3,25 7.237e6 b- -41761.6,26 2.894e5 b- -44336.8,27 1.572e5 b- -44504.1,28 3431 b- -46562.4,29 102.5 b- -44537.1,30 12.4 b- -43250.4,31 8.2 b- -40523.6,32 2.4 b- -38769.6,33 0.526 b- -34437.9,34 0.096 b- -30842.1,35 0.026 b- -25515.8,36 0.022 b- -21379.7,37 0.012 b- -15479.6',
    '22:17 0.0285 b+ 2500.1,18 0.0524 b+ -8993.4,19 0.0819 b+ -15697.5,20 0.2083 b+ -25104.4,21 0.509 b+ -29315.6,22 1.865e9 b+ -37548.6,23 1.109e4 b+ -39010.3,24 0 s -44128.3,25 0 s -44937.6,26 0 s -48493,27 0 s -48564,28 0 s -51431.9,29 345.6 b- -49733,30 102 b- -49477.7,31 32.7 b- -46881.4,32 2.1 b- -45743.8,33 1.3 b- -41832.5,34 0.2 b- -39423,35 0.095 b- -34401.8,36 0.055 b- -30917.7,37 0.0285 b- -25879.7,38 0.0222 b- -22099.7,39 0.015 b- -16370.1',
    '23:20 0.0793 b+ -17916.4,21 0.111 b+ -23808.1,22 0.547 b+ -31886.4,23 0.4226 b+ -37075.9,24 1956 b+ -42007.1,25 1.38e6 b+ -44478,26 2.851e7 b+ -47962.2,27 8.552e24 b+ -49223.2,28 0 s -52203.1,29 224.6 b- -51443,30 92.58 b- -51851.7,31 49.8 b- -49898.3,32 6.54 b- -49125.1,33 0.216 b- -46183.4,34 0.35 b- -44435.1,35 0.191 b- -40430.6,36 0.095 b- -37610.6,37 0.122 b- -33087.4,38 0.0482 b- -30177.1,39 0.0336 b- -25213.2,40 0.0196 b- -21740.1,41 0.015 b- -16319.8',
    '24:18 0.0133 b+ 7059.8,19 0.0211 b+ -1970.1,20 0.0428 b+ -13421.9,21 0.0609 b+ -19514.8,22 0.2243 b+ -29471.6,23 0.4616 b+ -34563.1,24 7.762e4 b+ -42821.3,25 2538 b+ -45332.4,26 0 s -50261.4,27 2.393e6 b+ -51450.7,28 0 s -55419.5,29 0 s -55287.6,30 0 s -56935.4,31 209.8 b- -55110.3,32 356.4 b- -55285.1,33 21.1 b- -52525,34 7 b- -51991.8,35 1.05 b- -48115.9,36 0.49 b- -46908.5,37 0.243 b- -42496.5,38 0.206 b- -40852.6,39 0.129 b- -36178.3,40 0.043 b- -33640,41 0.0275 b- -28310,42 0.0238 b- -25140.1',
    '25:21 0.0362 b+ -12417.7,22 0.088 b+ -22566.4,23 0.1581 b+ -29296.6,24 0.382 b+ -37619.9,25 0.2832 b+ -42626.9,26 2749 b+ -48243.2,27 4.831e5 b+ -50711.4,28 1.168e14 b+ -54690.4,29 2.696e7 b+ -55558.2,30 0 s -57712.5,31 9284 b- -56911.7,32 85.4 b- -57486.3,33 3 b- -55827.6,34 4.59 b- -55525.3,35 0.28 b- -52967.9,36 0.709 b- -51742.1,37 0.092 b- -48524,38 0.275 b- -46887.1,39 0.0888 b- -42989,40 0.0919 b- -40967.3,41 0.0638 b- -36750.4,42 0.0467 b- -33580.4,43 0.0337 b- -28920.1,44 0.0221 b- -25359.9,45 0.0199 b- -20450',
    '26:19 0.0025 p 14407.4,20 0.013 b+ 1210,21 0.0219 b+ -7129.7,22 0.0453 b+ -18008.6,23 0.0647 b+ -24750.7,24 0.152 b+ -34476.5,25 0.3054 b+ -40189.2,26 2.979e4 b+ -48332.1,27 510.6 b+ -50947.5,28 0 s -56254.6,29 8.698e7 b+ -57481.4,30 0 s -60607.2,31 0 s -60182,32 0 s -62155.3,33 3.845e6 b- -60665,34 8.268e13 b- -61413.2,35 358.8 b- -58920.5,36 68 b- -58878.1,37 6.1 b- -55635.6,38 2 b- -54969.6,39 0.805 b- -51217.9,40 0.467 b- -50067.8,41 0.394 b- -45708.4,42 0.188 b- -43896.7,43 0.162 b- -39199.1,44 0.0614 b- -36890,45 0.0343 b- -31929.8,46 0.017 b- -29249.8,47 0.0129 b- -23989.7,48 0.005 b- -20659.6',
    '27:31 6.121e6 b+ -59847.3,32 0 s -62229.8,33 1.663e8 b- -61650.4,34 5936 b- -62898.2,35 92.4 b- -61424.4',
    '28:31 2.556e12 b+ -61156.8,32 0 s -64473.2,33 0 s -64222,34 0 s -66746.4,35 3.194e9 b- -65512.9',
    '29:31 1422 b+ -58345.3,32 1.203e4 b+ -61984.1,33 580.3 b+ -62787.5,34 0 s -65579.9,35 4.572e4 b+ -65424.4',
    '36:56 1.84 b- -68769.3',
    '40:50 0 s -88772.5',
    '50:70 0 s -91097.7',
    '51:76 3.326e5 b- -86698.3,77 3.258e4 b- -84629.9,78 1.572e4 b- -84629.4,79 2370 b- -82285.7,80 1382 b- -81981.4',
    '52:60 120 b+ -77567.5,76 7.1e31 b- -88993.8,77 4176 b- -87004.9,78 2.496e28 b- -87353,79 1500 b- -85211,80 2.768e5 b- -85188.2',
    '53:76 5.093e14 b- -88507.2,77 4.45e4 b- -86936.2,78 6.934e5 b- -87442.7,79 8262 b- -85703.5,80 7.499e4 b- -85857.3',
    '54:76 0 s -89880.5,77 0 s -88413.6,78 0 s -89279,79 4.534e5 b- -87643.6,80 0 s -88125.8',
    '55:76 8.371e5 b+ -88055.6,77 5.599e5 b+ -87152.7,78 0 s -88070.9,79 6.517e7 b- -86891.2,80 4.197e13 b- -87582',
    '56:85 1096 b- -79732.5',
    '79:118 0 s -31139.8',
    '82:126 0 s -21748.5',
    '84:134 185.8 a 8356.7,135 618 b- 12681.4,137 132 b- 19773.8,138 546 b- 22486.3',
    '85:134 56 a 10396,135 222.6 b- 14375.7,136 138 b- 16782.7,137 54 b- 20953,138 50 b- 23428',
    '86:134 55.6 a 10612,135 1542 b- 14471.4,136 3.302e5 a 16372,137 1458 b- 20389.7,138 6420 b- 22445.1',
    '87:134 288.1 a 13277.3,135 852 b- 16378.1,136 1320 b- 18382.3,137 199.8 b- 21748.6,138 237 b- 23820.6',
    '88:134 33.6 a 14320.2,135 9.88e5 a 17233.2,136 3.138e5 a 18825.8,137 1.28e6 b- 21993,138 5.049e10 a 23667.6',
    '92:143 2.222e16 a 40918.8,146 1.408e17 a 47307.7'
  ];
  const MODE_LABEL = { s: 'stable', 'b-': 'β⁻', 'b+': 'β⁺/CE', a: 'α', p: 'p', n: 'n' };
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = n => String(n).split('').map(c => SUP[c]).join('');
  const NUCLIDES = [];
  const NUC_MAP = new Map();
  const key = (Z, N) => Z * 1000 + N;
  for (const line of NUC_SRC) {
    const [zs, rest] = line.split(':');
    const Z = +zs;
    for (const item of rest.split(',')) {
      const f = item.split(' ');
      const N = +f[0], T = +f[1], mode = f[2] === 's' ? 'stable' : f[2], dm = +f[3];
      const A = Z + N;
      const nu = { Z, N, A, symbol: symbol(Z), name: elementName(Z), id: A + symbol(Z), label: sup(A) + symbol(Z),
                   halfLife: mode === 'stable' ? Infinity : T, mode, dm };
      NUCLIDES.push(nu);
      NUC_MAP.set(key(Z, N), nu);
    }
  }
  function nuclide(Z, N) { return NUC_MAP.get(key(Z, N)) || null; }
  function byId(id) {
    const m = /^(\d+)([A-Za-z]+)$/.exec(id);
    if (!m) return null;
    const A = +m[1];
    for (const nu of NUCLIDES) if (nu.A === A && nu.symbol === m[2]) return nu;
    return null;
  }
  function modeLabel(mode) { return MODE_LABEL[mode === 'stable' ? 's' : mode] || mode; }

  // Masse atomique (u) et énergie de liaison mesurée (MeV) à partir des excès de masse AME2020.
  // B = Z Δ(¹H) + N Δ(n) − Δ(Z, N) : on compte les masses atomiques, les électrons se compensent
  // (leur énergie de liaison, quelques keV au plus ici, est négligée).
  function atomicMass(Z, N) { const nu = nuclide(Z, N); return nu ? nu.A + nu.dm / (U_MEV * 1000) : null; }
  function bindingMeasured(Z, N) { const nu = nuclide(Z, N); return nu ? (Z * D_H + N * D_N - nu.dm) / 1000 : null; }

  // Formule semi-empirique de Weizsäcker (goutte liquide), coefficients en MeV
  // (ajustement de J. W. Rohlf, Modern Physics from α to Z⁰, Wiley, 1994, chap. 11) :
  // B = aV A − aS A^(2/3) − aC Z(Z−1)/A^(1/3) − aA (A−2Z)²/A + δ, δ = ± aP / A^(1/2) (pair-pair +, impair-impair −).
  const SEMF = { aV: 15.75, aS: 17.8, aC: 0.711, aA: 23.7, aP: 11.18 };
  function semf(Z, A) {
    if (A < 1 || Z < 0 || Z > A) return 0;
    const N = A - Z, c = SEMF;
    let B = c.aV * A - c.aS * Math.pow(A, 2 / 3) - c.aC * Z * (Z - 1) / Math.cbrt(A) - c.aA * (A - 2 * Z) * (A - 2 * Z) / A;
    if (A % 2 === 0) B += (Z % 2 === 0 ? 1 : -1) * c.aP / Math.sqrt(A);
    return B;
  }
  // Énergie de liaison la meilleure disponible : mesurée si le nucléide est dans la table, sinon semf.
  function binding(Z, N) {
    const Bm = bindingMeasured(Z, N);
    return Bm !== null ? { B: Bm, src: 'mesure' } : { B: Math.max(0, semf(Z, Z + N)), src: 'semf' };
  }
  // Fond de la vallée de stabilité selon la formule semi-empirique : Z qui minimise la masse atomique
  // à A fixé (inclut la différence de masse neutron − hydrogène, 0,782 MeV). Valeur continue.
  function valleyZ(A) {
    const c = SEMF, dnh = (D_N - D_H) / 1000, a3 = Math.cbrt(A);
    return (dnh + c.aC / a3 + 4 * c.aA) / (2 * c.aC / a3 + 8 * c.aA / A);
  }

  // B/A mesurées (MeV par nucléon), calculées à partir des masses AME2020.
  const BA_DATA = [
  ];
  const BA_IDS = ['2H', '3He', '4He', '6Li', '7Li', '9Be', '12C', '14N', '16O', '20Ne', '24Mg', '28Si', '32S', '40Ca', '56Fe', '58Fe', '62Ni', '90Zr', '120Sn', '197Au', '208Pb', '235U', '238U'];
  for (const id of BA_IDS) { const nu = byId(id); BA_DATA.push({ id, label: nu.label, Z: nu.Z, N: nu.N, A: nu.A, BA: bindingMeasured(nu.Z, nu.N) / nu.A }); }

  // Bilan d'une réaction nucléaire, Z et A conservés. Particules données par [Z, N] (neutron : [0, 1]).
  // Q = Σ Δ(réactifs) − Σ Δ(produits) avec les excès de masse atomiques ; Q > 0 : énergie libérée.
  // Un nucléide absent de la table prend l'excès de masse déduit de semf (measured = false).
  function deltaZN(Z, N) {
    if (Z === 0 && N === 1) return { d: D_N, m: true };
    const nu = nuclide(Z, N);
    if (nu) return { d: nu.dm, m: true };
    return { d: Z * D_H + N * D_N - 1000 * Math.max(0, semf(Z, Z + N)), m: false };
  }
  function qZN(reactants, products) {
    let sZ = 0, sN = 0, Q = 0, measured = true, massR = 0, massP = 0;
    for (const [Z, N] of reactants) { const r = deltaZN(Z, N); Q += r.d; measured = measured && r.m; sZ += Z; sN += N; massR += Z + N + r.d / (U_MEV * 1000); }
    for (const [Z, N] of products) { const r = deltaZN(Z, N); Q -= r.d; measured = measured && r.m; sZ -= Z; sN -= N; massP += Z + N + r.d / (U_MEV * 1000); }
    return { Q: Q / 1000, dm: massR - massP, massR, massP, measured, conserved: sZ === 0 && sN === 0 };
  }
  function toZN(id) {
    if (id === 'n') return [0, 1];
    const nu = byId(id);
    if (nu) return [nu.Z, nu.N];
    const m = /^(\d+)([A-Za-z]+)$/.exec(id);
    const Z = SYMBOLS.indexOf(m[2]) >= 0 ? SYMBOLS.indexOf(m[2]) : +Object.keys(EXTRA).find(z => EXTRA[z][0] === m[2]);
    return [Z, +m[1] - Z];
  }
  function qValue(reactants, products) { return qZN(reactants.map(toZN), products.map(toZN)); }

  const REACTIONS = {
    dt:      { label: 'fusion ²H + ³H → ⁴He + n', kind: 'fusion', r: ['2H', '3H'], p: ['4He', 'n'], fuel: ['2H', '3H'] },
    alpha3:  { label: 'fusion de l’hélium : 3 ⁴He → ¹²C', kind: 'fusion', r: ['4He', '4He', '4He'], p: ['12C'], fuel: ['4He', '4He', '4He'] },
    fission: { label: 'fission ²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3 n', kind: 'fission', r: ['235U', 'n'], p: ['141Ba', '92Kr', 'n', 'n', 'n'], fuel: ['235U'] },
    fefe:    { label: 'fusion ⁵⁶Fe + ⁵⁶Fe → ¹¹²Te', kind: 'fusion', r: ['56Fe', '56Fe'], p: ['112Te'], fuel: ['56Fe', '56Fe'] }
  };
  const J_PER_MEV = 1.602176634e-13, KG_PER_U = 1.66053906660e-27;
  const METHANE_J_PER_KG = 50e6;  // pouvoir calorifique inférieur du méthane, ≈ 50 MJ/kg
  // Bilan d'une réaction prédéfinie : Q (MeV), énergie par kilogramme de combustible (J/kg),
  // rapport à la combustion du méthane.
  function reaction(name) {
    const R = REACTIONS[name];
    const q = qValue(R.r, R.p);
    const fuelU = R.fuel.reduce((s, id) => { const [Z, N] = toZN(id); return s + Z + N + deltaZN(Z, N).d / (U_MEV * 1000); }, 0);
    const perKg = q.Q * J_PER_MEV / (fuelU * KG_PER_U);
    return Object.assign({ name, label: R.label, kind: R.kind, perKg, vsMethane: perKg / METHANE_J_PER_KG, fuelU }, q);
  }

  /* =================== 3. Désintégration =================== */

  // Probabilité qu'un noyau se désintègre pendant dt (s) : 1 − 2^(−dt/T½), la même à tout âge.
  function decayProb(halfLife, dt) { return isFinite(halfLife) ? 1 - Math.pow(2, -dt / halfLife) : 0; }
  // Nombre de désintégrations parmi n noyaux pendant dt (tirage noyau par noyau).
  function decaySample(n, halfLife, rng, dt) {
    const p = decayProb(halfLife, dt);
    let k = 0;
    for (let i = 0; i < n; i++) if (rng() < p) k++;
    return k;
  }
  function decayConst(halfLife) { return Math.LN2 / halfLife; }
  // Ce que devient le noyau, et ce qui sort.
  function transmute(Z, N, mode) {
    switch (mode) {
      case 'b-': return { Z: Z + 1, N: N - 1, out: 'électron et antineutrino', ray: 'beta' };
      case 'b+': return { Z: Z - 1, N: N + 1, out: 'positon et neutrino (ou capture d’un électron)', ray: 'beta' };
      case 'a':  return { Z: Z - 2, N: N - 2, out: 'particule α (noyau d’hélium 4)', ray: 'alpha' };
      case 'p':  return { Z: Z - 1, N: N, out: 'proton', ray: 'p' };
      case 'n':  return { Z: Z, N: N - 1, out: 'neutron', ray: 'n' };
      default:   return { Z, N, out: '', ray: null };
    }
  }
  // Écrans : épaisseurs par défaut de la planche (m) et masses volumiques (g/cm³).
  const MATERIALS = {
    papier:    { label: 'papier', rho: 0.8, thick: 1e-4, muG: 0.0632, rAlpha: 0.0040 },
    aluminium: { label: 'aluminium', rho: 2.699, thick: 5e-3, muG: 0.05496, rAlpha: 0.0058 },
    plomb:     { label: 'plomb', rho: 11.35, thick: 5e-2, muG: 0.05876, rAlpha: 0.016 }
  };
  // Fraction transmise par un écran d'épaisseur thickness (m).
  // α (5 MeV par défaut) : arrêtée net au-delà de sa portée (ASTAR, NIST : ≈ 4 mg/cm² dans le papier,
  //   5,8 mg/cm² dans l'aluminium, 16 mg/cm² dans le plomb ; portée ∝ E^1,5, règle de Geiger).
  // β (énergie maximale 1 MeV par défaut) : portée de Katz et Penfold R = 0,412 E^(1,265 − 0,0954 ln E) g/cm²,
  //   atténuation e^(−μ ρ x) avec μ = 17 E^(−1,14) cm²/g en deçà de la portée.
  // γ (1,25 MeV par défaut, ⁶⁰Co) : e^(−(μ/ρ) ρ x), μ/ρ de NIST XCOM à 1,25 MeV (papier assimilé à l'eau).
  function attenuate(kind, material, thickness, E) {
    const M = MATERIALS[material];
    if (thickness == null) thickness = M.thick;
    const rx = M.rho * thickness * 100;   // g/cm²
    if (kind === 'alpha') { E = E || 5; return rx < M.rAlpha * Math.pow(E / 5, 1.5) ? 1 : 0; }
    if (kind === 'beta') {
      E = E || 1;
      const R = 0.412 * Math.pow(E, 1.265 - 0.0954 * Math.log(E));
      return rx >= R ? 0 : Math.exp(-17 * Math.pow(E, -1.14) * rx);
    }
    if (kind === 'gamma') return Math.exp(-M.muG * rx);
    return 0;
  }

  /* =================== 4. Hydrogène et raies =================== */

  // Indice de l'air sec standard (formule d'Edlén 1966, forme adoptée par l'UAI, Morton 2000).
  function airIndex(lambdaVac) { const s2 = Math.pow(1000 / lambdaVac, 2); return 1 + 8.34254e-5 + 2.406147e-2 / (130 - s2) + 1.5998e-4 / (38.9 - s2); }
  function vacToAir(lambdaVac) { return lambdaVac < 200 ? lambdaVac : lambdaVac / airIndex(lambdaVac); }
  // Niveaux de l'hydrogène (modèle de Bohr, masse réduite) : E_n = −13,598 eV / n².
  function hLevel(n) { return -RY_H / (n * n); }
  // Raie n2 → n1 (n2 > n1) : formule de Rydberg. Longueurs d'onde en nm, énergie en eV.
  function hLine(n1, n2) {
    const lo = Math.min(n1, n2), hi = Math.max(n1, n2);
    const vac = 1e9 / (R_H * (1 / (lo * lo) - 1 / (hi * hi)));
    return { n1: lo, n2: hi, vac, air: vacToAir(vac), E: HC / vac };
  }
  const H_LEVELS = [1, 2, 3, 4, 5, 6].map(hLevel);
  // Absorption d'un photon d'énergie E (eV) par un atome dont les niveaux liés sont levels (eV, croissants,
  // négatifs) et qui occupe le niveau d'indice from. Absorbé si E égale un écart à tol près (défaut 0,03 eV,
  // tolérance de la planche, bien plus large que la largeur réelle des raies) ; ionisation si E dépasse
  // l'énergie de liaison : l'électron libre emporte le surplus.
  function absorb(E, levels, tol, from) {
    levels = levels || H_LEVELS; tol = tol == null ? 0.03 : tol; from = from || 0;
    const Ei = levels[from];
    if (E >= -Ei) return { type: 'ionize', from, Ekin: E + Ei };
    let best = -1, err = Infinity;
    for (let j = from + 1; j < levels.length; j++) { const e = Math.abs(levels[j] - Ei - E); if (e < err) { err = e; best = j; } }
    if (best >= 0 && err <= tol) return { type: 'absorb', from, to: best, dE: levels[best] - Ei };
    return { type: 'pass', from };
  }
  // Coefficients d'Einstein A (s⁻¹) de l'hydrogène, moyennés sur les sous-niveaux (NIST ASD,
  // Wiese et Fuhr 2009). HA[n][m] : n → m.
  const HA = {
    2: { 1: 4.6986e8 },
    3: { 1: 5.5751e7, 2: 4.4101e7 },
    4: { 1: 1.2785e7, 2: 8.4193e6, 3: 8.9860e6 },
    5: { 1: 4.1250e6, 2: 2.5304e6, 3: 2.2008e6, 4: 2.6993e6 },
    6: { 1: 1.6440e6, 2: 9.7320e5, 3: 7.7829e5, 4: 7.7109e5, 5: 1.0254e6 }
  };
  // Désexcitation spontanée depuis n : niveau d'arrivée tiré selon les A, durée exponentielle (s).
  function hDecay(n, rng) {
    if (n <= 1) return null;
    const row = HA[n]; let tot = 0;
    for (const m in row) tot += row[m];
    let u = rng() * tot, to = 1;
    for (const m in row) { u -= row[m]; if (u <= 0) { to = +m; break; } }
    return { from: n, to, t: -Math.log(1 - rng()) / tot, line: hLine(to, n) };
  }

  // Raies visibles les plus intenses (longueurs d'onde dans l'air, nm ; intensités relatives approximatives,
  // maximum 100 par gaz). Source : NIST Atomic Spectra Database (raies persistantes), arrondies au centième.
  // g : raie dont le niveau bas est le fondamental (absorbée par le gaz froid).
  const LINES = {
    // H : valeurs mesurées (structure fine moyennée) ; hLine(2, n) les retrouve à 0,01 nm près.
    H: [[656.28, 100, 3], [486.13, 36, 4], [434.05, 18, 5], [410.17, 10, 6]].map(([nm, I, n]) => ({ nm, I, up: n, lo: 2, g: false })),
    He: [[447.15, 25], [471.31, 6], [492.19, 5], [501.57, 12], [587.56, 100], [667.82, 20], [706.52, 15]].map(([nm, I]) => ({ nm, I, g: false })),
    Na: [[497.85, 3], [498.28, 4], [568.27, 3], [568.82, 5], [588.99, 100], [589.59, 55], [615.42, 2], [616.08, 3]].map(([nm, I]) => ({ nm, I, g: nm > 588 && nm < 590 })),
    Hg: [[404.66, 45], [407.78, 6], [435.83, 100], [546.07, 80], [576.96, 22], [579.07, 24]].map(([nm, I]) => ({ nm, I, g: false })),
    Ne: [[540.06, 10], [585.25, 70], [588.19, 25], [594.48, 30], [597.55, 12], [603.00, 20], [607.43, 22], [609.62, 28], [614.31, 40], [616.36, 22], [621.73, 18],
         [626.65, 25], [630.48, 12], [633.44, 30], [638.30, 32], [640.22, 100], [650.65, 45], [659.90, 25], [667.83, 22], [671.70, 15], [692.95, 30], [703.24, 40]].map(([nm, I]) => ({ nm, I, g: false }))
  };
  const GASES = ['H', 'He', 'Na', 'Hg', 'Ne'];
  const GAS_NAMES = { H: 'hydrogène', He: 'hélium', Na: 'sodium', Hg: 'mercure', Ne: 'néon' };
  // Gaz mystère : 2 ou 3 gaz distincts tirés au hasard.
  function mystery(rng) {
    const pool = GASES.slice(), k = rng() < 0.5 ? 2 : 3, out = [];
    while (out.length < k) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    return out.sort((a, b) => GASES.indexOf(a) - GASES.indexOf(b));
  }

  // Couleur perçue d'une longueur d'onde (nm), [r, g, b] de 0 à 255, ou null hors de 380–750 nm
  // (approximation de D. Bruton, atténuée aux bords du visible).
  function visibleColor(nm) {
    if (nm < 380 || nm > 750) return null;
    let r = 0, g = 0, b = 0;
    if (nm < 440) { r = -(nm - 440) / 60; b = 1; }
    else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = -(nm - 510) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = -(nm - 645) / 65; }
    else { r = 1; }
    const f = nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : nm > 700 ? 0.3 + 0.7 * (750 - nm) / 50 : 1;
    const gam = 0.8, c = x => Math.round(255 * Math.pow(x * f, gam));
    return [c(r), c(g), c(b)];
  }

  /* =================== 5. Effet photoélectrique =================== */

  // Travaux d'extraction typiques de surfaces polycristallines (eV) : Na 2,28 (Halliday, Resnick et Walker),
  // K 2,29 (CRC Handbook), Zn 4,31 et Cu 4,70 (Serway et Jewett, tableau des travaux d'extraction).
  const WORK = { Na: 2.28, K: 2.29, Zn: 4.31, Cu: 4.70 };
  const METAL_NAMES = { Na: 'sodium', K: 'potassium', Zn: 'zinc', Cu: 'cuivre' };
  const QE = 1e-4;  // rendement quantique typique d'un métal : un électron pour 10 000 photons
  function photo(lambda, metal) {
    const W = WORK[metal], Eph = HC / lambda, f = C / (lambda * 1e-9);
    const Kmax = Eph - W, emits = Kmax > 0;
    return { Eph, f, W, f0: W / H_EVS, lambda0: HC / W, emits, Kmax: emits ? Kmax : 0, Vstop: emits ? Kmax : 0 };
  }
  // Électrons éjectés par seconde par une lumière de puissance P (W) : QE × (nombre de photons par seconde)
  // si hf > W, zéro sinon, quelle que soit P.
  function ejectionRate(P, lambda, metal) {
    const p = photo(lambda, metal);
    return p.emits ? QE * P / (p.Eph * J_PER_MEV * 1e-6) : 0;
  }
  // Courant reçu par l'électrode (A) sous une tension de freinage V (V) : énergies cinétiques supposées
  // réparties uniformément entre 0 et Kmax, donc fraction 1 − V/Kmax qui franchit la barrière.
  function current(P, lambda, metal, V) {
    const p = photo(lambda, metal), rate = ejectionRate(P, lambda, metal);
    if (!p.emits) return 0;
    const frac = V <= 0 ? 1 : Math.max(0, 1 - V / p.Kmax);
    return rate * frac * 1.602176634e-19;
  }

  return {
    // constantes
    KE2, U_MEV, M_ALPHA, M_N_U, M_H_U, H_EVS, HC, C, RY_H, R_H, R_AU, B_DISPLAY, YEAR, METHANE_J_PER_KG, QE,
    mulberry32,
    // 1
    closestApproach, rMin, rutherfordAngle, impactForAngle, rutherfordTraj, thomsonDeflect, shot, expectedCount, dSigma, nuclearRadius,
    // 2
    NUCLIDES, nuclide, byId, symbol, elementName, modeLabel, atomicMass, bindingMeasured, SEMF, semf, binding, valleyZ, BA_DATA,
    qZN, qValue, REACTIONS, reaction,
    // 3
    decayProb, decaySample, decayConst, transmute, MATERIALS, attenuate,
    // 4
    airIndex, vacToAir, hLevel, hLine, H_LEVELS, absorb, HA, hDecay, LINES, GASES, GAS_NAMES, mystery, visibleColor,
    // 5
    WORK, METAL_NAMES, photo, ejectionRate, current
  };
})();
/* ATOM-END */
if (typeof module !== 'undefined') module.exports = Atom;
