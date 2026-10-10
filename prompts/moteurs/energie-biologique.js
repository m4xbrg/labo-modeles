// Moteur de la planche « L'énergie du vivant » (Fondations 34).
// Verrouillé : copier à l'identique dans le <script> de la page, du marqueur
// BIOEN-BEGIN au marqueur BIOEN-END inclus. Tests : node prompts/moteurs/energie-biologique.test.js [page.html]
//
// Conventions
// - Énergies libres en kJ/mol (le seul écart au SI, celui de la biochimie) ; T = 310 K.
// - Concentrations en mmol/L dans les entrées, converties en mol/L (état standard 1 mol/L) dans Q ;
//   état standard biochimique (pH 7, eau d'activité 1) : ΔG°'.
// - Simulation d'enzymes : boîte carrée de côté 1 (unité de longueur arbitraire), périodique ;
//   une « concentration » y est un nombre de molécules libres par boîte. Temps en secondes.
// - Tout le hasard passe par mulberry32(seed).

/* BIOEN-BEGIN */
const BioEn = (function () {
  'use strict';
  const R = 8.314;            // J/(mol·K)
  const T = 310;              // K, 37 °C
  const F = 96485;            // C/mol
  const NA = 6.02214076e23;   // 1/mol
  const H = 6.62607015e-34;   // J·s
  const C = 2.99792458e8;     // m/s
  const M_ATP = 507.18;       // g/mol (acide libre)
  const RT = (t) => R * (t || T) / 1000;   // kJ/mol ; 2,577 kJ/mol à 310 K

  function mulberry32(a) {
    a = a >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(rnd) {                      // Box-Muller
    let u = 0; while (u === 0) u = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
  }

  /* ---------------- 1. Énergie libre et couplage ---------------- */

  // ΔG = ΔG°' + RT ln Q   (kJ/mol)
  const dG = (dG0, Q, t) => dG0 + RT(t) * Math.log(Q);

  // Pompe Na⁺/K⁺ : 3 Na⁺ sortent, 2 K⁺ entrent, contre leurs gradients électrochimiques.
  // Concentrations en mmol/L, Vm = potentiel intérieur − extérieur (V). Retourne ΔG du transport (kJ/mol de cycles).
  const PUMP = { Nao: 145, Nai: 12, Ko: 4, Ki: 140, Vm: -0.070 };
  function pumpDG(p) {
    const q = Object.assign({}, PUMP, p || {});
    const naOut = RT() * Math.log(q.Nao / q.Nai) + F * (-q.Vm) / 1000;   // par Na⁺ sorti
    const kIn = RT() * Math.log(q.Ki / q.Ko) + F * q.Vm / 1000;          // par K⁺ entré
    return 3 * naOut + 2 * kIn;
  }
  // Coup de rame d'une myosine : travail W = F·d par molécule, ramené à une mole.
  const MYO = { F_pN: 5, d_nm: 8 };
  const myosinWork = (F_pN, d_nm) => (F_pN == null ? MYO.F_pN : F_pN) * 1e-12 * (d_nm == null ? MYO.d_nm : d_nm) * 1e-9 * NA / 1000;

  // Réactions de référence (ΔG°' en kJ/mol). dir : -1 descend, +1 monte.
  const REACTIONS = {
    atp: { id: 'atp', nom: 'Hydrolyse de l’ATP', eq: 'ATP + H₂O → ADP + Pi', dG0: -30.5,
      src: 'Lehninger, Principles of Biochemistry, 7e éd., tableau 13-6' },
    g6p: { id: 'g6p', nom: 'Phosphorylation du glucose', eq: 'glucose + Pi → glucose-6-P + H₂O', dG0: 13.8,
      src: 'Lehninger, § 13.3 (hydrolyse du glucose-6-P : −13,8)' },
    gln: { id: 'gln', nom: 'Synthèse de la glutamine', eq: 'glutamate + NH₄⁺ → glutamine + H₂O', dG0: 14.2,
      src: 'Lehninger, § 13.3' },
    muscle: { id: 'muscle', nom: 'Coup de rame d’une myosine', eq: 'travail mécanique F·d', dG0: myosinWork(),
      src: 'ordre de grandeur : 5 pN sur 8 nm par molécule (pinces optiques, Finer et al. 1994)' },
    pompe: { id: 'pompe', nom: 'Pompe Na⁺/K⁺ (un cycle)', eq: '3 Na⁺ sortent, 2 K⁺ entrent', dG0: pumpDG(),
      src: 'calculé : 145/12 mmol/L de Na⁺, 4/140 de K⁺, −70 mV' },
    pep: { id: 'pep', nom: 'Hydrolyse du phosphoénolpyruvate', eq: 'PEP + H₂O → pyruvate + Pi', dG0: -61.9,
      src: 'Lehninger, tableau 13-6' },
    pcr: { id: 'pcr', nom: 'Hydrolyse de la créatine-phosphate', eq: 'créatine-P + H₂O → créatine + Pi', dG0: -43.0,
      src: 'Lehninger, tableau 13-6' },
    glc: { id: 'glc', nom: 'Oxydation complète du glucose', eq: 'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O', dG0: -2870,
      src: 'Campbell, Biology (−686 kcal/mol)' }
  };
  const UPHILL = ['g6p', 'gln', 'muscle', 'pompe'];

  // Couplage : ΔG global = somme. r1, r2 : identifiants, objets {dG0} ou nombres ; n2 = nombre de fois r2.
  const val = (r) => (typeof r === 'number' ? r : typeof r === 'string' ? REACTIONS[r].dG0 : r.dG0);
  const couple = (r1, r2, n2) => val(r1) + (n2 == null ? 1 : n2) * val(r2);

  // ΔG réel de l'hydrolyse de l'ATP dans la cellule (concentrations en mmol/L).
  const CELL = { ATP: 4, ADP: 0.5, Pi: 5 };
  function cellATP(c, t) {
    const q = Object.assign({}, CELL, c || {});
    const Q = (q.ADP * 1e-3) * (q.Pi * 1e-3) / (q.ATP * 1e-3);
    return dG(REACTIONS.atp.dG0, Q, t);
  }
  // Constante d'équilibre de l'hydrolyse : K = exp(−ΔG°'/RT).
  const Keq = (dG0, t) => Math.exp(-dG0 / RT(t));

  // Porte-monnaie : réserve ATP + ADP constante (mmol/L), Pi constant.
  // dATP/dt = kR·ADP·(recharge) − use. Sans recharge, la réserve tombe en ≈ ATP/use secondes.
  const WALLET = { total: 4.5, Pi: 5, use: 0.2, kR: 0.4 };   // use en mmol/(L·s) : réserve vidée en ≈ 20 s
  function walletInit() { return { ATP: CELL.ATP, ADP: WALLET.total - CELL.ATP }; }
  function walletStep(s, recharge, use, dt) {
    const u = use == null ? WALLET.use : use;
    let ATP = s.ATP + ((recharge ? WALLET.kR * s.ADP : 0) - (s.ATP > 0 ? u : 0)) * dt;
    ATP = Math.min(WALLET.total, Math.max(0, ATP));
    return { ATP, ADP: WALLET.total - ATP };
  }
  // Dépense ponctuelle de n mmol/L d'ATP : retourne null si la réserve ne suffit pas.
  function walletSpend(s, n) {
    if (s.ATP < n) return null;
    return { ATP: s.ATP - n, ADP: s.ADP + n };
  }
  const walletDG = (s) => cellATP({ ATP: Math.max(1e-6, s.ATP), ADP: Math.max(1e-6, s.ADP), Pi: WALLET.Pi });

  /* ---------------- 2. Enzymes ---------------- */

  // Michaelis-Menten, avec inhibiteur compétitif de concentration I et constante Ki.
  function mmRate(S, Vmax, Km, I, Ki) {
    const KmApp = Km * (1 + (I && Ki ? I / Ki : 0));
    return Vmax * S / (KmApp + S);
  }
  const KmOf = (kon, koff, kcat) => (koff + kcat) / kon;
  const KmApp = (Km, I, Ki) => Km * (1 + I / Ki);

  // Simulation particulaire 2D. Enzymes immobiles (site actif = disque de rayon r), substrats et
  // inhibiteurs libres qui diffusent (coefficient D). Chaque molécule libre dans le site d'une enzyme
  // libre s'y lie au taux λ = k_on/(π r²) : le taux de liaison par enzyme vaut k_on·[S], [S] en molécules
  // par boîte. Complexe ES : se défait (k_off) ou réagit (k_cat) ; EI : se défait (kIoff).
  // Concentrations libres maintenues constantes (bain) : une molécule liée est remplacée par une
  // nouvelle, entrée au hasard ; une molécule relâchée en fait sortir une autre.
  const ENZ = { nE: 8, nS: 60, kon: 0.02, koff: 0.4, kcat: 0.8, nI: 0, Ki: 30, kIoff: 0.3, D: 0.03, r: 0.045, site: 0.035, life: 1.5, seed: 1 };   // Km = 60 molécules par boîte
  function enzymeSim(p) {
    const P = Object.assign({}, ENZ, p || {});
    const rnd = mulberry32(P.seed);
    const sim = { P, rnd, t: 0, E: [], S: [], I: [], prod: [], events: [], nProd: 0, tStat: 0, occInt: 0, nBind: 0 };
    // enzymes sur une grille tremblée, orientations au hasard
    const n = Math.max(1, Math.ceil(Math.sqrt(P.nE)));
    const cells = [];
    for (let i = 0; i < n * n; i++) cells.push(i);
    for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = cells[i]; cells[i] = cells[j]; cells[j] = t; }
    for (let k = 0; k < P.nE; k++) {
      const c = cells[k % cells.length], gx = c % n, gy = Math.floor(c / n);
      const x = (gx + 0.3 + 0.4 * rnd()) / n, y = (gy + 0.3 + 0.4 * rnd()) / n, a = rnd() * 2 * Math.PI;
      sim.E.push({ x, y, a, sx: (x + P.site * Math.cos(a) + 1) % 1, sy: (y + P.site * Math.sin(a) + 1) % 1, st: 'E', tIn: 0 });
    }
    for (let k = 0; k < P.nS; k++) sim.S.push({ x: rnd(), y: rnd(), age: 1 });
    for (let k = 0; k < P.nI; k++) sim.I.push({ x: rnd(), y: rnd(), age: 1 });
    return sim;
  }
  const wrapD = (d) => (d > 0.5 ? d - 1 : d < -0.5 ? d + 1 : d);
  function enzymeStep(sim, dt) {
    const P = sim.P, rnd = sim.rnd, sd = Math.sqrt(2 * P.D * dt), r2 = P.r * P.r;
    const lamS = P.kon / (Math.PI * r2), kIon = P.Ki > 0 ? P.kIoff / P.Ki : 0, lamI = kIon / (Math.PI * r2);
    sim.events.length = 0;
    // diffusion
    for (const L of [sim.S, sim.I]) for (const m of L) {
      m.x = (m.x + sd * gauss(rnd) + 1) % 1; m.y = (m.y + sd * gauss(rnd) + 1) % 1; m.age += dt;
    }
    for (let i = sim.prod.length - 1; i >= 0; i--) {
      const m = sim.prod[i]; m.x = (m.x + sd * gauss(rnd) + 1) % 1; m.y = (m.y + sd * gauss(rnd) + 1) % 1; m.age += dt;
      if (m.age > P.life) sim.prod.splice(i, 1);
    }
    // réactions des enzymes
    for (const e of sim.E) {
      if (e.st === 'ES') {
        const u = rnd(), pOut = 1 - Math.exp(-(P.koff + P.kcat) * dt);
        if (u < pOut) {
          if (rnd() < P.kcat / (P.koff + P.kcat)) {          // produit
            e.st = 'E'; sim.nProd++;
            sim.prod.push({ x: e.sx, y: e.sy, age: 0 });
            sim.events.push({ k: 'prod', x: e.sx, y: e.sy });
          } else {                                           // le substrat repart intact
            e.st = 'E';
            sim.S.push({ x: e.sx, y: e.sy, age: 1 });
            const j = Math.floor(rnd() * (sim.S.length - 1));
            const out = sim.S.splice(j, 1)[0];
            sim.events.push({ k: 'off', x: e.sx, y: e.sy }, { k: 'outS', x: out.x, y: out.y });
          }
        }
      } else if (e.st === 'EI') {
        if (rnd() < 1 - Math.exp(-P.kIoff * dt)) {
          e.st = 'E';
          sim.I.push({ x: e.sx, y: e.sy, age: 1 });
          const j = Math.floor(rnd() * (sim.I.length - 1));
          const out = sim.I.splice(j, 1)[0];
          sim.events.push({ k: 'offI', x: e.sx, y: e.sy }, { k: 'outI', x: out.x, y: out.y });
        }
      } else {
        let nS = 0, nI = 0; const cS = [], cI = [];
        for (let i = 0; i < sim.S.length; i++) { const m = sim.S[i], dx = wrapD(m.x - e.sx), dy = wrapD(m.y - e.sy); if (dx * dx + dy * dy < r2) { nS++; cS.push(i); } }
        for (let i = 0; i < sim.I.length; i++) { const m = sim.I[i], dx = wrapD(m.x - e.sx), dy = wrapD(m.y - e.sy); if (dx * dx + dy * dy < r2) { nI++; cI.push(i); } }
        const tot = lamS * nS + lamI * nI;
        if (tot > 0 && rnd() < 1 - Math.exp(-tot * dt)) {
          if (rnd() * tot < lamS * nS) {
            const i = cS[Math.floor(rnd() * nS)]; sim.S.splice(i, 1);
            e.st = 'ES'; e.tIn = sim.t; sim.nBind++;
            const nw = { x: rnd(), y: rnd(), age: 0 }; sim.S.push(nw);
            sim.events.push({ k: 'bind', x: e.sx, y: e.sy }, { k: 'inS', x: nw.x, y: nw.y });
          } else {
            const i = cI[Math.floor(rnd() * nI)]; sim.I.splice(i, 1);
            e.st = 'EI'; e.tIn = sim.t;
            const nw = { x: rnd(), y: rnd(), age: 0 }; sim.I.push(nw);
            sim.events.push({ k: 'bindI', x: e.sx, y: e.sy }, { k: 'inI', x: nw.x, y: nw.y });
          }
        }
      }
    }
    let occ = 0; for (const e of sim.E) if (e.st === 'ES') occ++;
    sim.occInt += occ * dt; sim.tStat += dt; sim.t += dt;
    return sim;
  }
  function enzymeResetStats(sim) { sim.nProd = 0; sim.tStat = 0; sim.occInt = 0; sim.nBind = 0; }
  // Vitesse mesurée (produits/s) et occupation moyenne depuis la dernière remise à zéro.
  const enzymeRate = (sim) => (sim.tStat > 0 ? sim.nProd / sim.tStat : 0);
  const enzymeOcc = (sim) => (sim.tStat > 0 ? sim.occInt / sim.tStat / sim.P.nE : 0);
  // Mesure complète : préchauffage puis fenêtre de mesure. Retourne {v, occ, theo}.
  function enzymeMeasure(p, Tmeas, Twarm, dt) {
    const sim = enzymeSim(p), h = dt || 1 / 120;
    for (let t = 0; t < (Twarm == null ? 5 : Twarm); t += h) enzymeStep(sim, h);
    enzymeResetStats(sim);
    for (let t = 0; t < Tmeas; t += h) enzymeStep(sim, h);
    const P = sim.P, Km = KmOf(P.kon, P.koff, P.kcat);
    return { v: enzymeRate(sim), occ: enzymeOcc(sim), theo: mmRate(P.nS, P.kcat * P.nE, Km, P.nI, P.Ki), Km, Vmax: P.kcat * P.nE };
  }

  /* ---------------- 3. Bilans de la respiration ---------------- */

  // Convention : 2,5 ATP par NADH mitochondrial, 1,5 par FADH₂ ; NADH du cytosol par la navette
  // glycérol-3-phosphate (1,5) → 30 ATP, ou malate-aspartate (2,5) → 32 ATP (Lehninger, tableau 19-5).
  const E0 = { NAD: -0.320, FUM: 0.031, O2: 0.816 };          // potentiels standard biochimiques (V)
  const redoxDG = (n, Edon, Eacc) => -n * F * (Eacc - Edon) / 1000;   // kJ/mol
  function respirationBudget(o) {
    const opt = Object.assign({ O2: true, shuttle: 'glycerol' }, o || {});
    const dGatp = -REACTIONS.atp.dG0;                            // 30,5 kJ/mol capturés par ATP (conditions standard)
    if (!opt.O2) {
      const dGferm = -196;                                       // glucose → 2 lactate (ΔG°', Lehninger § 14.3)
      const captured = 2 * dGatp;
      return {
        O2: false, atp: { glycolyse: 2, krebs: 0, chaine: 0, total: 2 }, nadh: 0, fadh2: 0,
        o2: 0, co2: 0, h2o: 0, lactate: 2, dGglucose: REACTIONS.glc.dG0, released: -dGferm,
        captured, heat: -dGferm - captured, retained: -REACTIONS.glc.dG0 + dGferm,
        yield: captured / -REACTIONS.glc.dG0, yieldReleased: captured / -dGferm,
        flows: { glycoATP: captured, glycoHeat: -dGferm - captured, lactate: -REACTIONS.glc.dG0 + dGferm, carriers: 0, chainATP: 0, chainHeat: 0, krebsATP: 0 }
      };
    }
    const cyto = opt.shuttle === 'malate' ? 2.5 : 1.5;
    const chaine = 2 * cyto + 8 * 2.5 + 2 * 1.5;
    const total = 2 + 2 + chaine;
    const eNADH = redoxDG(2, E0.NAD, E0.O2), eFADH = redoxDG(2, E0.FUM, E0.O2);   // négatifs
    const carriers = -(10 * eNADH + 2 * eFADH);                                    // ≈ 2 495 kJ portés vers l'O₂
    const captured = total * dGatp, G = -REACTIONS.glc.dG0;
    const chainATP = chaine * dGatp;
    return {
      O2: true, atp: { glycolyse: 2, krebs: 2, chaine, total }, nadh: 10, fadh2: 2,
      o2: 6, co2: 6, h2o: 6, lactate: 0, dGglucose: REACTIONS.glc.dG0, released: G,
      captured, heat: G - captured, retained: 0, yield: captured / G, yieldReleased: captured / G,
      flows: { glycoATP: 2 * dGatp, krebsATP: 2 * dGatp, glycoHeat: G - carriers - 4 * dGatp, carriers,
        chainATP, chainHeat: carriers - chainATP, lactate: 0 },
      eNADH, eFADH
    };
  }
  // Glucose nécessaire pour n ATP.
  const glucoseFor = (nATP, O2) => nATP / respirationBudget({ O2 }).atp.total;
  // Approvisionnement d'un muscle : demande d'ATP D, plafond aérobie A (mêmes unités, ATP/s).
  function supply(D, A) {
    const aer = Math.min(D, A), ana = Math.max(0, D - A);
    return { aer, ana, glucose: aer / 30 + ana / 2, o2: aer / 5, co2: aer / 5, lactate: ana, fracAna: D > 0 ? ana / D : 0 };
  }
  // Masse d'ATP renouvelée par jour pour une puissance métabolique P (W), si toute cette puissance vient
  // de l'oxydation du glucose avec 30 ATP par glucose : n = P·30/|ΔG°'glucose|. Borne haute : P/|ΔG réel|.
  function dailyATP(P, o) {
    const opt = Object.assign({ atpPerGlucose: 30 }, o || {});
    const molPerS = P * opt.atpPerGlucose / (-REACTIONS.glc.dG0 * 1000);
    const kg = molPerS * 86400 * M_ATP / 1000;
    const kgUpper = P / (-cellATP() * 1000) * 86400 * M_ATP / 1000;
    return { molPerS, kg, kgUpper, powerThroughATP: molPerS * -cellATP() * 1000 };
  }
  // Durée de la réserve d'ATP sans recyclage : réserve (mmol/L × L) / consommation.
  function stockSeconds(P, V_L, ATP_mM) {
    const use = dailyATP(P).molPerS;
    return (ATP_mM == null ? CELL.ATP : ATP_mM) * 1e-3 * V_L / use;
  }

  /* ---------------- 4. Photosynthèse ---------------- */

  // Spectre d'absorption approché (somme de gaussiennes, d'après les spectres en solution organique) ;
  // chl a : bandes de Soret vers 430 nm et Qy vers 662 nm ; chl b : 453 et 642 nm. Un fond large et faible
  // tient lieu de l'absorption résiduelle dans le vert. Normalisé : maximum de la chl a = 1.
  // Mélange foliaire a:b = 3:1, ramené à un maximum de 1.
  const BANDS = {
    a: [[430, 15, 1.00], [411, 10, 0.25], [662, 10, 0.80], [616, 14, 0.12], [578, 14, 0.06]],
    b: [[453, 13, 1.00], [432, 12, 0.25], [642, 10, 0.37], [595, 14, 0.07]],
    fond: [520, 110, 0.035]
  };
  const gsum = (bands, l) => bands.reduce((s, b) => s + b[2] * Math.exp(-0.5 * Math.pow((l - b[0]) / b[1], 2)), 0);
  const rawA = (l) => gsum(BANDS.a, l) + gsum([BANDS.fond], l), rawB = (l) => 0.62 * gsum(BANDS.b, l) + gsum([BANDS.fond], l);
  const scanMax = (f) => { let m = 0; for (let l = 380; l <= 720; l += 0.5) m = Math.max(m, f(l)); return m; };
  const NA_ = scanMax(rawA), NMIX = scanMax((l) => (0.75 * rawA(l) + 0.25 * rawB(l)) / NA_);
  function chlAbs(l, pig) {
    if (pig === 'a') return rawA(l) / NA_;
    if (pig === 'b') return rawB(l) / NA_;
    return (0.75 * rawA(l) + 0.25 * rawB(l)) / NA_ / NMIX;
  }
  // Fraction de la lumière absorbée par une feuille mince (absorbance de crête A0).
  const PHOTO = { A0: 2.0, Pmax0: 20, alpha: 0.06, Kc: 300, CO2: 420, Iref: 2000 };
  const absorbed = (l, A0) => 1 - Math.pow(10, -(A0 == null ? PHOTO.A0 : A0) * chlAbs(l));
  // Lumière blanche : moyenne sur 400-700 nm (flux de photons uniforme).
  function absorbedWhite(A0) { let s = 0, n = 0; for (let l = 400; l <= 700; l += 2) { s += absorbed(l, A0); n++; } return s / n; }
  // Courbe de réponse à la lumière (Webb 1974) : P = Pmax (1 − e^(−αI/Pmax)). I en µmol photons/(m²·s).
  function lightResponse(I, o) {
    const q = Object.assign({ Pmax: PHOTO.Pmax0, alpha: PHOTO.alpha }, o || {});
    if (I <= 0 || q.Pmax <= 0) return 0;
    return q.Pmax * (1 - Math.exp(-q.alpha * I / q.Pmax));
  }
  // Plafond imposé par le CO₂ (fixation par la rubisco, saturable) : Pmax = Pmax0·C/(Kc + C). C en ppm.
  const pmaxCO2 = (c, o) => { const q = Object.assign({ Pmax0: PHOTO.Pmax0 * (1 + PHOTO.Kc / PHOTO.CO2), Kc: PHOTO.Kc }, o || {}); return q.Pmax0 * c / (q.Kc + c); };
  // Vitesse de photosynthèse (µmol O₂/(m²·s)) : I incidente, couleur (nm) ou 'blanc', CO₂ (ppm).
  function photoRate(o) {
    const q = Object.assign({ lambda: 'blanc', I: 500, CO2: PHOTO.CO2 }, o || {});
    const f = q.lambda === 'blanc' ? absorbedWhite() : absorbed(q.lambda);
    const fRef = absorbedWhite();
    const Iabs = q.I * f / fRef;                                 // ramené à l'échelle de la lumière blanche
    const Pmax = pmaxCO2(q.CO2);
    return { f, Iabs, Pmax, P: lightResponse(Iabs, { Pmax }) };
  }
  const photonE = (l) => H * C / (l * 1e-9) * NA / 1000;        // kJ par mole de photons
  function photoBudget() {
    const perO2 = 8, perGlc = 6 * perO2, E680 = photonE(680), G = -REACTIONS.glc.dG0;
    return { eq: '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂', dG0: G, o2: 6, co2: 6,
      photonsPerO2: perO2, photonsPerGlucose: perGlc, E680, Ein: perGlc * E680, yieldRed: G / (perGlc * E680), yieldField: [0.01, 0.02] };
  }

  return {
    R, T, F, NA, M_ATP, RT, mulberry32,
    dG, REACTIONS, UPHILL, couple, cellATP, Keq, CELL, PUMP, pumpDG, MYO, myosinWork,
    WALLET, walletInit, walletStep, walletSpend, walletDG,
    mmRate, KmOf, KmApp, ENZ, enzymeSim, enzymeStep, enzymeResetStats, enzymeRate, enzymeOcc, enzymeMeasure,
    E0, redoxDG, respirationBudget, glucoseFor, supply, dailyATP, stockSeconds,
    BANDS, chlAbs, PHOTO, absorbed, absorbedWhite, lightResponse, pmaxCO2, photoRate, photonE, photoBudget
  };
})();
/* BIOEN-END */

if (typeof module !== 'undefined') module.exports = BioEn;
