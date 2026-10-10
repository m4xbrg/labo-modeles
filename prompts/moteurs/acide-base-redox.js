// Moteur de la planche « Acide-base, redox et électrochimie » (Fondations 31).
// Verrouillé : copier à l'identique dans le <script> de la page, du marqueur
// ELC-BEGIN au marqueur ELC-END inclus. Tests : node prompts/moteurs/acide-base-redox.test.js [page.html]
//
// Conventions
// - 25 °C. Concentrations en mol/L, volumes en L, quantités en mol, charges en C,
//   tensions en V, courants en A, masses en g (masses molaires en g/mol).
// - Activités assimilées aux concentrations (solutions idéales).
// - Une solution (« bécher ») est décrite par ce qui est conservé quand on mélange :
//   { V, Na, Cl, T: { couple: quantité totale } } en mol. Na = cations spectateurs
//   (Na⁺ de NaOH et des sels), Cl = anions spectateurs (Cl⁻ de HCl et des sels),
//   T = quantité totale de chaque couple acide/base faible (HA + A).
//   La répartition HA / A et le pH se déduisent du seul bilan de charge, résolu
//   exactement (aucune approximation « acide faible »).
// - Pile : l'anode est l'électrode où a lieu l'oxydation pendant la décharge (le zinc
//   de la Daniell), la cathode celle de la réduction (le cuivre). I > 0 : la pile débite
//   (électrons de l'anode vers la cathode par le fil) ; I < 0 : électrolyse (recharge).

/* ELC-BEGIN */
const Elc = (function () {
  'use strict';
  const LN10 = Math.LN10;
  const KW = 1.0e-14;                 // produit ionique de l'eau à 25 °C
  const F = 96485.332;                // constante de Faraday, C/mol
  const R = 8.314462618;              // constante des gaz, J/(mol·K)
  const T = 298.15;                   // 25 °C
  const NA = 6.02214076e23;           // nombre d'Avogadro
  const NERNST = R * T * LN10 / F;    // ≈ 0,05916 V (« 0,0592 / n »)

  // Couples acide/base faibles, traités comme monoacides (une seule acidité).
  // zA = charge de la forme acide ; la forme basique porte zA − 1.
  // Sources : CRC Handbook of Chemistry and Physics, « Dissociation constants of
  // organic acids / inorganic acids and bases in aqueous solution », 25 °C ;
  // H₂CO₃ : pKa apparent (CO₂ dissous + H₂CO₃), première acidité seulement ;
  // H₂PO₄⁻ : deuxième acidité de l'acide phosphorique, seule retenue.
  const ACIDS = {
    HCl:        { name: 'acide chlorhydrique', acid: 'HCl', base: 'Cl⁻', strong: true, src: 'acide fort : entièrement ionisé dans l’eau' },
    acetique:   { name: 'acide acétique', acid: 'CH₃COOH', base: 'CH₃COO⁻', pKa: 4.76, zA: 0, acidSalt: 'CH3COOH', baseSalt: 'CH3COONa', src: 'CRC Handbook, 25 °C' },
    ammonium:   { name: 'ion ammonium', acid: 'NH₄⁺', base: 'NH₃', pKa: 9.25, zA: 1, acidSalt: 'NH4Cl', baseSalt: 'NH3', src: 'CRC Handbook, 25 °C' },
    phosphate:  { name: 'ion dihydrogénophosphate', acid: 'H₂PO₄⁻', base: 'HPO₄²⁻', pKa: 7.21, zA: -1, acidSalt: 'NaH2PO4', baseSalt: 'Na2HPO4', src: 'CRC Handbook, 25 °C (pKa₂ de H₃PO₄)' },
    carbonique: { name: 'acide carbonique', acid: 'H₂CO₃', base: 'HCO₃⁻', pKa: 6.35, zA: 0, acidSalt: 'H2CO3', baseSalt: 'NaHCO3', src: 'CRC Handbook, 25 °C (pKa₁ apparent)' }
  };
  // Composés qu'on dissout : ce que chacun apporte par mole.
  const COMPOUNDS = {
    HCl: { Cl: 1 }, NaOH: { Na: 1 }, NaCl: { Na: 1, Cl: 1 },
    CH3COOH: { T: 'acetique' }, CH3COONa: { Na: 1, T: 'acetique' },
    NH4Cl: { Cl: 1, T: 'ammonium' }, NH3: { T: 'ammonium' },
    NaH2PO4: { Na: 1, T: 'phosphate' }, Na2HPO4: { Na: 2, T: 'phosphate' },
    H2CO3: { T: 'carbonique' }, NaHCO3: { Na: 1, T: 'carbonique' }
  };
  const Ka = key => Math.pow(10, -ACIDS[key].pKa);

  // ---------- Solutions ----------
  function beaker(V, list) {
    let b = { V: V, Na: 0, Cl: 0, T: {} };
    for (const [k, C] of (list || [])) b = addMol(b, k, C * V);
    return b;
  }
  function addMol(b, compound, n) {
    const c = COMPOUNDS[compound];
    if (!c) throw new Error('composé inconnu : ' + compound);
    const o = { V: b.V, Na: b.Na + (c.Na || 0) * n, Cl: b.Cl + (c.Cl || 0) * n, T: Object.assign({}, b.T) };
    if (c.T) o.T[c.T] = (o.T[c.T] || 0) + n;
    return o;
  }
  // Ajouter un volume Vadd (L) d'une solution de compound à C (mol/L).
  function add(b, compound, C, Vadd) {
    const o = addMol(b, compound, C * Vadd);
    o.V = b.V + Vadd;
    return o;
  }
  function mix(a, b) {
    const o = { V: a.V + b.V, Na: a.Na + b.Na, Cl: a.Cl + b.Cl, T: Object.assign({}, a.T) };
    for (const k in b.T) o.T[k] = (o.T[k] || 0) + b.T[k];
    return o;
  }
  const water = (V) => beaker(V || 1, []);
  const strongAcid = (C, V) => beaker(V || 1, [['HCl', C]]);
  const strongBase = (C, V) => beaker(V || 1, [['NaOH', C]]);
  const weakAcid = (key, C, V) => beaker(V || 1, [[ACIDS[key].acidSalt, C]]);
  const weakBase = (key, C, V) => beaker(V || 1, [[ACIDS[key].baseSalt, C]]);
  const buffer = (key, Cacid, Cbase, V) => beaker(V || 1, [[ACIDS[key].acidSalt, Cacid], [ACIDS[key].baseSalt, Cbase]]);
  // Tampon de concentration totale C, rapport base/acide = ratio.
  const bufferRatio = (key, C, ratio, V) => buffer(key, C / (1 + ratio), C * ratio / (1 + ratio), V);

  // Charge nette par litre (mol/L) pour h = [H₃O⁺], à concentrations c.
  function chargeAt(h, c) {
    let q = h - KW / h + c.Na - c.Cl;
    for (const k in c.T) { const K = Ka(k), CT = c.T[k]; q += CT * (ACIDS[k].zA - K / (h + K)); }
    return q;
  }
  function conc(b) {
    const c = { Na: b.Na / b.V, Cl: b.Cl / b.V, T: {} };
    for (const k in b.T) if (b.T[k] > 0) c.T[k] = b.T[k] / b.V;
    return c;
  }
  // Résolution exacte du bilan de charge : chargeAt est strictement croissante en h.
  function solve(b) {
    const c = conc(b);
    let lo = Math.log(1e-20), hi = Math.log(1e2);
    for (let i = 0; i < 200; i++) {
      const mid = 0.5 * (lo + hi);
      if (chargeAt(Math.exp(mid), c) > 0) hi = mid; else lo = mid;
      if (hi - lo < 1e-15) break;
    }
    const h = Math.exp(0.5 * (lo + hi)), oh = KW / h;
    const pairs = {};
    let charge = h - oh + c.Na - c.Cl;
    for (const k in c.T) {
      const K = Ka(k), CT = c.T[k], A = CT * K / (h + K), HA = CT - A, z = ACIDS[k].zA;
      pairs[k] = { HA, A, CT, ratio: A / HA, zA: z };
      charge += z * HA + (z - 1) * A;
    }
    const pH = -Math.log10(h);
    return { pH, pOH: -Math.log10(oh), h, oh, Kw: h * oh, V: b.V,
             species: { H3O: h, OH: oh, Na: c.Na, Cl: c.Cl, pairs }, charge };
  }
  const pH = b => solve(b).pH;

  // ---------- Titrage ----------
  // acid : clé de ACIDS ou composé ; base : composé (NaOH par défaut). Volumes en L.
  const salt = k => (ACIDS[k] ? (ACIDS[k].strong ? k : ACIDS[k].acidSalt) : k);
  function titrate(acid, Ca, Va, base, Cb, Vb) {
    return solve(add(beaker(Va, [[salt(acid), Ca]]), base || 'NaOH', Cb, Vb)).pH;
  }
  function titrationCurve(acid, Ca, Va, base, Cb, Vmax, n) {
    const out = [];
    n = n || 200;
    for (let i = 0; i <= n; i++) { const Vb = Vmax * i / n; out.push({ Vb, pH: titrate(acid, Ca, Va, base, Cb, Vb) }); }
    return out;
  }
  function equivalence(acid, Ca, Va, base, Cb) {
    const Veq = Ca * Va / Cb, Vhalf = Veq / 2;
    const A = ACIDS[acid];
    return { Veq, Vhalf, pHeq: titrate(acid, Ca, Va, base, Cb, Veq), pHhalf: titrate(acid, Ca, Va, base, Cb, Vhalf),
             pKa: A && !A.strong ? A.pKa : null };
  }

  // ---------- Vue particulaire ----------
  // Nombre réel d'ions H₃O⁺ et OH⁻ dans un volume V (L) au pH donné, et ce qu'on en dessine :
  // un point = 10^k ions, k choisi pour qu'il y ait au plus maxDraw points de l'espèce majoritaire.
  function sampleIons(pHv, V, maxDraw) {
    maxDraw = maxDraw || 200;
    const h = Math.pow(10, -pHv), oh = KW / h;
    const nH = h * NA * V, nOH = oh * NA * V, nMax = Math.max(nH, nOH);
    const k = Math.max(0, Math.ceil(Math.log10(nMax / maxDraw) - 1e-12));
    const scale = Math.pow(10, k);
    return { V, nH, nOH, scale, k, drawH: Math.round(nH / scale), drawOH: Math.round(nOH / scale),
             rule: k === 0 ? '1 point = 1 ion' : '1 point = 10^' + k + ' ions' };
  }
  // Générateur pseudo-aléatoire à graine (mulberry32), valeurs dans [0, 1).
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- Redox ----------
  // Couples Mⁿ⁺/M : potentiel standard (V), électrons échangés, masse molaire du métal (g/mol).
  // Source : CRC Handbook, « Electrochemical series », 25 °C, arrondis du programme.
  const E0 = { Zn: -0.76, Fe: -0.44, Pb: -0.13, H: 0.00, Cu: 0.34, Ag: 0.80 };
  const COUPLES = {
    Zn: { E0: -0.76, n: 2, M: 65.38,  metal: 'Zn', ion: 'Zn²⁺', name: 'zinc' },
    Fe: { E0: -0.44, n: 2, M: 55.845, metal: 'Fe', ion: 'Fe²⁺', name: 'fer' },
    Pb: { E0: -0.13, n: 2, M: 207.2,  metal: 'Pb', ion: 'Pb²⁺', name: 'plomb' },
    H:  { E0: 0.00,  n: 2, M: 2.016,  metal: 'H₂', ion: 'H⁺', name: 'hydrogène', gas: true, nIon: 2 },
    Cu: { E0: 0.34,  n: 2, M: 63.546, metal: 'Cu', ion: 'Cu²⁺', name: 'cuivre' },
    Ag: { E0: 0.80,  n: 1, M: 107.868, metal: 'Ag', ion: 'Ag⁺', name: 'argent' }
  };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const coef = (k, s) => (k === 1 ? s : k + ' ' + s);
  // Demi-réaction de réduction écrite pour une mole de réducteur (métal ou H₂).
  function halfRed(k) {
    const c = COUPLES[k];
    return c.gas ? '2 H⁺ + 2 e⁻ → H₂' : c.ion + ' + ' + coef(c.n, 'e⁻') + ' → ' + c.metal;
  }
  function halfOx(k) {
    const c = COUPLES[k];
    return c.gas ? 'H₂ → 2 H⁺ + 2 e⁻' : c.metal + ' → ' + c.ion + ' + ' + coef(c.n, 'e⁻');
  }
  // Potentiel d'électrode (Nernst) : E = E° + (0,0592/n) log [ion]^(ν) (métal pur, p(H₂) = 1 bar).
  function electrode(k, c) {
    const C = COUPLES[k];
    const nu = C.gas ? 2 : 1;
    return C.E0 + NERNST / C.n * nu * Math.log10(c);
  }
  // Un métal plongé dans une solution d'un ion : y a-t-il réaction (conditions standard) ?
  function spontaneous(metal, ion) {
    const a = COUPLES[metal], b = COUPLES[ion];
    if (metal === ion) return { spont: false, same: true, dE: 0, n: 0, K: 1, ox: halfOx(metal), red: halfRed(ion), eq: 'aucune réaction : même couple' };
    const dE = b.E0 - a.E0;
    const n = a.n * b.n / gcd(a.n, b.n);          // électrons échangés par « tour » de réaction
    const pM = n / a.n, pI = n / b.n;               // moles de métal oxydé, d'ion réduit
    const ionCoef = b.gas ? 2 * pI : pI, redProd = b.gas ? 'H₂' : b.metal;
    const eq = coef(pM, a.metal) + ' + ' + coef(ionCoef, b.ion) + ' → ' + coef(pM, a.ion) + ' + ' + coef(pI, redProd);
    return { spont: dE > 0, same: false, dE, n, K: Math.pow(10, n * dE / NERNST), ox: halfOx(metal), red: halfRed(ion),
             eq, metalPerTurn: pM, ionPerTurn: ionCoef, depositPerTurn: pI };
  }
  // Réaction de déplacement dans un volume V : métal en excès, ion à c0, avancement x (0 → 1)
  // mesuré en fraction de l'ion consommé. Renvoie quantités et masses.
  function displacement(metal, ion, c0, V, x) {
    const s = spontaneous(metal, ion), b = COUPLES[ion], a = COUPLES[metal];
    if (!s.spont) return { s, x: 0, cIon: c0, cMetalIon: 0, nE: 0, mDeposit: 0, mDissolved: 0 };
    const nIon0 = c0 * V, nIon = nIon0 * x;                 // ions réduits
    const turns = nIon / s.ionPerTurn, nE = turns * s.n;
    const nMet = turns * s.metalPerTurn, nDep = turns * s.depositPerTurn;
    return { s, x, cIon: (nIon0 - nIon) / V, cMetalIon: nMet / V, nE, Q: nE * F,
             mDeposit: b.gas ? 0 : nDep * b.M, nGas: b.gas ? nDep : 0, mDissolved: nMet * a.M };
  }
  // Avancement d'équilibre (fraction d'ion consommé) : les deux électrodes au même potentiel.
  function displacementEq(metal, ion, c0) {
    const s = spontaneous(metal, ion);
    if (!s.spont) return 0;
    // f(y) = E_ion(reste) − E_métal(formé), y = ln(reste/c0) ≤ 0 : f(0) = +∞, f décroît quand on avance.
    const f = y => {
      const d = displacement(metal, ion, c0, 1, -Math.expm1(y));
      return electrode(ion, c0 * Math.exp(y)) - electrode(metal, Math.max(d.cMetalIon, 1e-300));
    };
    let lo = -700, hi = 0;
    for (let i = 0; i < 200; i++) { const m = 0.5 * (lo + hi); if (f(m) > 0) hi = m; else lo = m; }
    return -Math.expm1(0.5 * (lo + hi));
  }

  // ---------- Pile ----------
  // cell : { anode, cathode, cA, cC (mol/L), VA, VC (L), mA, mC (g), Rint (Ω), bridge, Q (C), t (s) }
  function cell(o) {
    return Object.assign({ anode: 'Zn', cathode: 'Cu', cA: 1, cC: 1, VA: 0.1, VC: 0.1, mA: 20, mC: 20, Rint: 2, bridge: true, Q: 0, t: 0, I: 0 }, o || {});
  }
  // f.é.m. (Nernst) : E = E_cathode − E_anode. conc = { cathode, anode } en mol/L (1 par défaut).
  function cellEMF(cathode, anode, conc) {
    conc = conc || {};
    const cC = conc.cathode != null ? conc.cathode : 1, cA = conc.anode != null ? conc.anode : 1;
    return electrode(cathode, cC) - electrode(anode, cA);
  }
  const emfOf = c => cellEMF(c.cathode, c.anode, { cathode: c.cC, anode: c.cA });
  // Courant instantané dans le circuit : charge R (Ω) et générateur U_ext (V) en opposition.
  function current(c, R, Uext) {
    if (c.bridge === false) return 0;
    return (emfOf(c) - (Uext || 0)) / (c.Rint + R);
  }
  // État après le passage d'une charge dq (C) ; dq > 0 : décharge, dq < 0 : électrolyse.
  function pass(c, dq) {
    const A = COUPLES[c.anode], C = COUPLES[c.cathode];
    const o = Object.assign({}, c);
    o.cC = c.cC - dq / (C.n * F * c.VC);
    o.cA = c.cA + dq / (A.n * F * c.VA);
    o.mC = c.mC + dq / (C.n * F) * C.M;
    o.mA = c.mA - dq / (A.n * F) * A.M;
    o.Q = c.Q + dq;
    return o;
  }
  // État après une charge |dq| qui ramène l'ion consommé à c0·e^y exactement
  // (y ≤ 0 ; pas de soustraction qui perdrait les très faibles concentrations).
  function passLog(c, dis, y) {
    const k = dis ? 'cC' : 'cA', V = dis ? c.VC : c.VA, n = COUPLES[dis ? c.cathode : c.anode].n;
    const c0 = c[k], dq = (dis ? 1 : -1) * c0 * -Math.expm1(y) * n * F * V;
    const o = pass(c, dq);
    o[k] = c0 * Math.exp(y);
    return o;
  }
  // Un pas de temps dt (s), Euler implicite : le courant est celui de l'état d'arrivée,
  // ce qui garde les concentrations positives et la tension monotone même pour de grands pas.
  function cellStep(c, R, dt, Uext) {
    Uext = Uext || 0;
    const I0 = current(c, R, Uext), Rt = c.Rint + R;
    let o;
    if (I0 === 0 || !(dt > 0)) { o = Object.assign({}, c); o.I = 0; }
    else {
      const dis = I0 > 0, sgn = dis ? 1 : -1;               // décharge ou électrolyse
      const metal = COUPLES[dis ? c.anode : c.cathode], mMetal = dis ? c.mA : c.mC;
      // g(y) = |dq| − dt·|I(arrivée)| : croissante quand y diminue (on consomme plus d'ions)
      const g = y => { const s = passLog(c, dis, y); return sgn * (s.Q - c.Q) - dt * sgn * (emfOf(s) - Uext) / Rt; };
      let lo = -700, hi = 0;
      for (let i = 0; i < 100; i++) { const m = 0.5 * (lo + hi); if (g(m) > 0) lo = m; else hi = m; }
      o = passLog(c, dis, 0.5 * (lo + hi));
      const dqMetal = mMetal / metal.M * metal.n * F;        // le métal qui se dissout s'épuise
      if (Math.abs(o.Q - c.Q) > dqMetal) o = pass(c, sgn * dqMetal);
      o.I = (o.Q - c.Q) / dt;
    }
    o.t = c.t + dt;
    o.E = emfOf(o);
    o.U = o.E - o.I * c.Rint;                               // tension aux bornes
    return o;
  }
  // Pile reliée à un générateur U (V) à travers R (Ω) : régime de fonctionnement.
  function electrolysis(U, c, R) {
    const E = emfOf(c), I = current(c, R || 0, U);
    const mode = Math.abs(I) < 1e-12 ? 'équilibre' : I > 0 ? 'pile' : 'électrolyse';
    return { E, I, mode, Uth: E, P: U * -I };
  }
  // Loi de Faraday : masse (g) déposée ou dissoute par une charge Q (C).
  const faradayMass = (Q, M, n) => Q * M / (n * F);

  return {
    KW, F, R, T, NA, NERNST, ACIDS, COMPOUNDS, Ka, E0, COUPLES,
    beaker, add, addMol, mix, water, strongAcid, strongBase, weakAcid, weakBase, buffer, bufferRatio,
    chargeAt, solve, pH, titrate, titrationCurve, equivalence, sampleIons, rng,
    electrode, halfOx, halfRed, spontaneous, displacement, displacementEq,
    cell, cellEMF, emfOf, current, pass, cellStep, electrolysis, faradayMass
  };
})();
/* ELC-END */
if (typeof module !== 'undefined') module.exports = Elc;
