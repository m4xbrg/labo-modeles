// Tests du moteur Rxn (module 30).
// node prompts/moteurs/reactions-chimiques.test.js            → teste prompts/moteurs/reactions-chimiques.js
// node prompts/moteurs/reactions-chimiques.test.js page.html  → teste le bloc RXN-BEGIN … RXN-END copié dans la page
'use strict';
const fs = require('fs'), path = require('path');
const file = process.argv[2] || path.join(__dirname, 'reactions-chimiques.js');
const src = fs.readFileSync(file, 'utf8');
const m = src.match(/\/\* RXN-BEGIN \*\/([\s\S]*?)\/\* RXN-END \*\//);
if (!m) { console.error('Bloc RXN introuvable dans ' + file); process.exit(2); }
const Rxn = new Function(m[1] + '\nreturn Rxn;')();
console.log('Bloc RXN extrait de ' + file + ' (' + m[1].length + ' caractères)');

let pass = 0, fail = 0;
function ok(cond, name, detail) {
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '  [' + detail + ']' : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '  [' + detail + ']' : '')); }
}
const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
const f3 = x => (+x).toPrecision(4);
const t0 = Date.now();

/* 1. Boîte sans réaction : énergie conservée, Maxwell-Boltzmann 2D */
console.log('1. Boîte sans réaction');
{
  const b = Rxn.boxInit({ nA: 80, nB: 80, T: 1, Ea: Infinity, acc: 0, seed: 11, init: 'mono' });
  const E0 = Rxn.boxKE(b);
  Rxn.boxStep(b, 60); // relaxation depuis des vitesses toutes égales
  const E1 = Rxn.boxKE(b);
  const sp = [];
  for (let k = 0; k < 1200; k++) { Rxn.boxStep(b, 0.5); for (let i = 0; i < b.N; i++) sp.push(Math.hypot(b.vx[i], b.vy[i])); }
  const E2 = Rxn.boxKE(b), T = E0 / b.N;
  ok(Math.abs(E2 - E0) / E0 < 1e-9 && Math.abs(E1 - E0) / E0 < 1e-9, 'énergie cinétique conservée à 1e-9', 'écart relatif ' + (Math.abs(E2 - E0) / E0).toExponential(2) + ' sur 660 τ, ' + b.cnt.collAll + ' chocs');
  sp.sort((a, c) => a - c);
  let ks = 0; for (let i = 0; i < sp.length; i += 7) ks = Math.max(ks, Math.abs((i + 0.5) / sp.length - Rxn.mb2dCdf(sp[i], T)));
  const mean = sp.reduce((s, v) => s + v, 0) / sp.length, m2 = sp.reduce((s, v) => s + v * v, 0) / sp.length, m4 = sp.reduce((s, v) => s + v ** 4, 0) / sp.length;
  ok(rel(mean, Math.sqrt(Math.PI * T / 2)) < 0.05, 'vitesse moyenne = √(πkT/2m) à 5 %', f3(mean) + ' vs ' + f3(Math.sqrt(Math.PI * T / 2)));
  ok(rel(m4 / (m2 * m2), 2) < 0.05, '⟨v⁴⟩/⟨v²⟩² = 2 (Maxwell 2D ; 1 au départ) à 5 %', f3(m4 / m2 / m2));
  // histogramme : chaque classe de probabilité > 3 % à 5 % près
  const nb = 16, vmax = 4 * Math.sqrt(T), cnt = new Float64Array(nb); for (const v of sp) if (v < vmax) cnt[Math.floor(v / vmax * nb)]++;
  let worst = 0; for (let k = 0; k < nb; k++) { const p = Rxn.mb2dCdf((k + 1) * vmax / nb, T) - Rxn.mb2dCdf(k * vmax / nb, T); if (p > 0.03) worst = Math.max(worst, rel(cnt[k] / sp.length, p)); }
  ok(worst < 0.05 && ks < 0.02, 'distribution des vitesses = Maxwell-Boltzmann 2D à 5 % (classes > 3 %), KS < 0,02', 'pire classe ' + (worst * 100).toFixed(1) + ' %, KS ' + ks.toFixed(4) + ', ' + sp.length + ' vitesses');
}

/* 2. Fraction réactive mesurée = fracAbove */
console.log('2. Fraction de collisions réactives');
function measureFrac(Ea, T, steric, seed, tau) {
  const b = Rxn.boxInit({ nA: 90, nB: 90, T, Ea, dH: 0, seed, renew: 0.02, steric }); // produits renouvelés aussitôt : pas d'appauvrissement de la queue
  Rxn.boxStep(b, 10); Rxn.boxResetCounts(b);
  Rxn.boxStep(b, tau);
  return { f: b.cnt.react / b.cnt.coll, n: b.cnt.coll, r: b.cnt.react, b };
}
for (const [Ea, T, tau] of [[2, 1, 1200], [3, 1.5, 1200], [4, 1, 2500]]) {
  const r = measureFrac(Ea, T, false, 21 + Ea, tau), th = Rxn.fracAbove(Ea, T, 2);
  ok(rel(r.f, th) < 0.05, `Ea = ${Ea}, T = ${T} : fraction = e^(−Ea/T) à 5 %`, f3(r.f) + ' vs ' + f3(th) + ' (' + r.r + '/' + r.n + ')');
}
{
  const r = measureFrac(1, 1, true, 5, 900), th = Rxn.fracAbove(1, 1, 2) * 0.25;
  ok(rel(r.f, th) < 0.05, 'orientation exigée (α = 45°) : fraction = (α/π) e^(−Ea/T) à 5 %', f3(r.f) + ' vs ' + f3(th) + ' (' + r.r + '/' + r.n + ')');
  // la distribution des énergies le long de la ligne des centres est exponentielle (histogramme de l'étape 1)
  const h = r.b.hist, w = r.b.histMax / h.length, tot = h.reduce((s, v) => s + v, 0); let worst = 0;
  for (let k = 0; k < 8; k++) { const p = Math.exp(-k * w) - Math.exp(-(k + 1) * w); worst = Math.max(worst, rel(h[k] / tot, p)); }
  ok(worst < 0.08, 'histogramme des énergies de collision = e^(−E/kT)/kT (8 premières classes, 8 %)', 'pire ' + (worst * 100).toFixed(1) + ' %');
  ok(Math.abs(Rxn.fracAbove(3, 1, 3, 'tot') - 4 * Math.exp(-3)) < 1e-12 && Math.abs(Rxn.fracAbove(0, 1, 2, 'tot') - 1) < 1e-6, 'fracAbove, critère énergie totale : 3D (1 + a)e^(−a), 2D → 1 en a = 0');
}

/* 3. Arrhenius : ln k linéaire en 1/T entre T et 3T */
console.log('3. Arrhenius');
{
  // (a) chaîne de l'étape 2 : k(T) = A e^(−Ea/RT), essais stochastiques ajustés, T de 290 à 870 K
  const Ts = [290, 350, 420, 520, 660, 870], xs = [], ys = [];
  Ts.forEach((T, i) => { const r = Rxn.measureK({ k: Rxn.kSol(T), a0: 1, b0: 1, Om: 400, seed: 100 + i }); xs.push(1 / T); ys.push(Math.log(r.k)); });
  const fit = Rxn.linfit(xs, ys);
  ok(fit.r2 > 0.99, 'essais stochastiques : ln k linéaire en 1/T (R² > 0,99)', 'R² = ' + fit.r2.toFixed(6));
  ok(rel(-fit.slope * Rxn.R, Rxn.SOL.Ea) < 0.05, 'pente = −Ea/R à 5 %', 'Ea mesurée ' + f3(-fit.slope * Rxn.R / 1000) + ' kJ/mol vs 50');
  // (b) boîte de disques durs, T0 à 3 T0 : droite d'Arrhenius ; pente = théorie des collisions (−(Ea + T/2))
  const Tb = [1, 1.4, 2, 3], bx = [], by = [], ty = [];
  Tb.forEach((T, i) => {
    const b = Rxn.boxInit({ nA: 90, nB: 90, T, Ea: 4, seed: 300 + i, renew: 1.5 });
    Rxn.boxStep(b, 10); Rxn.boxResetCounts(b);
    let nAB = 0, n = 0; const tau = 1500 / Math.sqrt(T);
    for (let k = 0; k < tau; k++) { Rxn.boxStep(b, 1); const c = Rxn.boxCount(b); nAB += c.A * c.B; n++; }
    const area = b.Lx * b.Ly, kM = b.cnt.react / tau / ((nAB / n) / area / area * area); // événements/(τ·aire) / (nA nB)
    bx.push(1 / T); by.push(Math.log(kM)); ty.push(Math.log(Rxn.kBox({ T, Ea: 4, eta: Rxn.boxEta(b) })));
  });
  const fb = Rxn.linfit(bx, by), ft = Rxn.linfit(bx, ty);
  ok(fb.r2 > 0.99, 'boîte 2D, T0 à 3T0 : ln k linéaire en 1/T (R² > 0,99)', 'R² = ' + fb.r2.toFixed(5));
  ok(rel(fb.slope, ft.slope) < 0.05, 'boîte 2D : pente = théorie des collisions 2D (−(Ea + T/2), préfacteur ∝ √T) à 5 %', 'pente ' + f3(fb.slope) + ' vs ' + f3(ft.slope) + ' ; Ea seule : −4');
  ok(Math.abs(Math.exp(by[0]) / Math.exp(ty[0]) - 1) < 0.15, 'boîte 2D : k mesuré = kBox (théorie des collisions + χ d\'Enskog) à 15 %', f3(Math.exp(by[0])) + ' vs ' + f3(Math.exp(ty[0])));
}

/* 4. Valeurs de référence */
console.log('4. Facteurs de vitesse');
{
  const r = Rxn.ratioT(50e3, 298, 308);
  ok(Math.abs(r - 1.92) < 0.01, 'ratioT(50 kJ/mol, 298 K, 308 K) = 1,92', r.toFixed(4));
  const f = Rxn.arrhenius(1, 50e3, 298) / Rxn.arrhenius(1, 75e3, 298);
  ok(rel(f, 2.4e4) < 0.03, 'Ea 75 → 50 kJ/mol à 298 K : k × 2,4 × 10⁴', f.toExponential(3));
  ok(rel(Rxn.h2o2Ratio('none', 298), 1) < 1e-12 && Rxn.h2o2Ratio('catalase', 298) > Rxn.h2o2Ratio('MnO2', 298), 'préréglage H₂O₂ : catalase > MnO₂ > sans');
}

/* 5. Demi-vies */
console.log('5. Demi-vies');
{
  const k1 = 0.3, k2 = 0.5;
  const h1 = [0.1, 1, 10].map(c0 => Rxn.halfLife(1, k1, c0));
  ok(h1.every(h => Math.abs(h - Math.LN2 / k1) < 1e-12) && [0.1, 1, 10].every(c0 => Math.abs(Rxn.odeRate({ order: 1, k: k1 }, c0, Math.LN2 / k1) - c0 / 2) < 1e-12), 'premier ordre : t½ = ln 2/k, indépendant de c₀');
  ok([0.5, 1, 2].every(c0 => Math.abs(Rxn.halfLife(2, k2, c0) - 1 / (k2 * c0)) < 1e-12 && Math.abs(Rxn.odeRate({ order: 2, k: k2 }, c0, 1 / (k2 * c0)) - c0 / 2) < 1e-12), 'second ordre : t½ = 1/(k c₀), et [A](t½) = c₀/2');
  ok(Math.abs(Rxn.odeAB(0.2, 1, 1 + 1e-15, 3) - Rxn.odeRate({ order: 2, k: 0.2 }, 1, 3)) < 1e-9 && Math.abs(Rxn.odeAB(0.2, 0.1, 100, 0.2) - 0.1 * Math.exp(-0.2 * 100 * 0.2)) / (0.1 * Math.exp(-4)) < 0.02, 'A + B : égales → second ordre ; B en grand excès → pseudo-premier ordre k[B]₀');
  // tirages stochastiques A + B : la moyenne suit la loi intégrée
  const k = Rxn.kSol(298); let acc = 0; const tq = Rxn.halfLife(2, k, 1);
  for (let sd = 0; sd < 40; sd++) { const s = { nA: 200, nB: 200, nP: 0, t: 0 }; Rxn.ssaAB(s, { k, Om: 200 }, Rxn.mulberry32(sd + 1), tq); acc += s.nA / 200; }
  ok(Math.abs(acc / 40 - 0.5) < 0.02, 'Gillespie A + B (40 graines) : [A](t½) = c₀/2 à 2 %', f3(acc / 40));
}

/* 6. Catalyseur */
console.log('6. Catalyseur');
{
  const p0 = Rxn.profile({ Ea: 75, dH: -98 + 98 * 0 - 0, EaCat: 55 }), p = Rxn.profile({ Ea: 75, dH: -20, EaCat: 40 });
  const last = a => a[a.length - 1].E, max = a => Math.max(...a.map(q => q.E));
  ok(last(p.pts) === last(p.cat) && p.pts[0].E === p.cat[0].E && Math.abs(max(p.pts) - 75) < 1e-9 && Math.abs(max(p.cat) - 40) < 1e-9, 'profil : mêmes départ et arrivée (ΔH inchangé), sommets Ea et Ea catalysée');
  ok(Math.abs((p.EaRev - p.EaCatRev) - (p.Ea - p.EaCat)) < 1e-12, 'profil : la barrière inverse baisse d\'autant (accélère les deux sens)');
  ok(p0.Ea >= p0.dH && Rxn.profile({ Ea: 10, dH: 30 }).Ea === 30, 'profil endothermique : Ea ≥ ΔH imposé');
  // équilibre avec et sans catalyseur : même composition, approche plus rapide
  const runs = cat => {
    let sumA = 0, tHalf = 0;
    for (let sd = 0; sd < 20; sd++) {
      const s = Rxn.eqInit({ T: 298, seed: 500 + sd, cat });
      const a_eq = Rxn.eqSolveV(298, s.V, s.N * Rxn.EQ.q).alpha; let th = NaN;
      for (let k = 0; k < 3000; k++) { Rxn.eqStep(s, 0.005, { tauT: 0 }); if (isNaN(th) && Rxn.eqAlpha(s) >= a_eq / 2) th = s.t; }
      let a = 0; for (let k = 0; k < 200; k++) { Rxn.eqStep(s, 0.1, { tauT: 0 }); a += Rxn.eqAlpha(s); }
      sumA += a / 200; tHalf += th;
    }
    return { a: sumA / 20, th: tHalf / 20 };
  };
  const r0 = runs(false), r1 = runs(true);
  ok(rel(r1.a, r0.a) < 0.02, 'équilibre avec catalyseur = sans catalyseur (α, 20 graines) à 2 %', f3(r1.a) + ' vs ' + f3(r0.a));
  ok(r1.th < r0.th / 3, 'avec catalyseur, l\'équilibre est approché plus vite', 'mi-chemin en ' + f3(r1.th) + ' s vs ' + f3(r0.th) + ' s');
  // boîte : même énergie libérée par réaction, catalysée ou non ; la voie catalysée accélère
  const mk = cat => Rxn.boxInit({ nA: 60, nB: 60, T: 1, Ea: 5, dH: -2, EaCat: 1, tAds: 6, seed: 77, renew: 2, cat: cat ? Rxn.CAT.grains : [] });
  const b0 = mk(false), b1 = mk(true); Rxn.boxStep(b0, 300); Rxn.boxStep(b1, 300);
  ok(b1.cnt.reactCat > 0 && (b1.cnt.react + b1.cnt.reactCat) > 3 * b0.cnt.react, 'boîte : les grains de catalyseur accélèrent la réaction', 'sans ' + b0.cnt.react + ', avec ' + (b1.cnt.react + b1.cnt.reactCat) + ' dont ' + b1.cnt.reactCat + ' sur les grains');
  // énergie rendue par réaction : un choc réactif seul, voie normale et voie catalysée
  const one = Rxn.boxInit({ nA: 1, nB: 1, T: 1, Ea: 1, dH: -2, acc: 0, seed: 1 });
  one.x[0] = 10; one.y[0] = 10; one.x[1] = 10.99; one.y[1] = 10.02; one.vx[0] = 2; one.vy[0] = 0; one.vx[1] = -2; one.vy[1] = 0; one.steric = false;
  const e0 = Rxn.boxKE(one); Rxn.boxStep(one, 0.005); const dE1 = Rxn.boxKE(one) - e0;
  const two = Rxn.boxInit({ nA: 1, nB: 1, T: 1, Ea: 9, dH: -2, EaCat: 1, acc: 0, seed: 1, cat: [{ x: 5, y: 10, R: 2 }] });
  two.ads[0] = 0; two.rel[0] = 1e9; two.x[0] = 7.5; two.y[0] = 10; two.vx[0] = 0; two.vy[0] = 0; two.x[1] = 8.49; two.y[1] = 10; two.vx[1] = -3; two.vy[1] = 0;
  const vb0 = 0.5 * 9; Rxn.boxStep(two, 0.005); const dE2 = 0.5 * (two.vx[1] ** 2 + two.vy[1] ** 2) - vb0;
  ok(Math.abs(dE1 - 2) < 1e-9 && Math.abs(dE2 - 2) < 1e-9 && two.sp[0] === 2 && two.sp[1] === 3 && one.sp[0] === 2, 'énergie libérée par réaction = −ΔH, avec ou sans catalyseur ; le grain ressort intact', 'ΔK = ' + dE1.toFixed(12) + ' et ' + dE2.toFixed(12));
}

/* 7. N₂O₄ ⇌ 2 NO₂ */
console.log('7. Constante d\'équilibre');
{
  const K298 = Rxn.Kp(298);
  ok(Math.abs(K298 - 0.15) <= 0.01, 'Kp(298 K) = 0,15 ± 0,01', K298.toFixed(4));
  ok([250, 298, 320, 350, 400].every((T, i, a) => i === 0 || Rxn.Kp(T) > Rxn.Kp(a[i - 1])), 'Kp augmente avec T (endothermique)');
  const e1 = Rxn.eqSolve(298, 1, 1), e2 = Rxn.eqSolve(350, 1, 1);
  ok(e2.xNO2 > e1.xNO2, 'à 1 bar, fraction de NO₂ plus grande à 350 K qu\'à 298 K', f3(e1.xNO2) + ' → ' + f3(e2.xNO2));
  const chk = (e, T) => Math.abs((e.xNO2 ** 2 * e.P / (1 - e.xNO2)) / Rxn.Kp(T) - 1) < 1e-9;
  const ev = Rxn.eqSolveV(298, 1e-3, 0.04), xv = ev.xNO2;
  ok(chk(e1, 298) && chk(e2, 350) && Math.abs((xv * xv * ev.P / (1 - xv)) / Rxn.Kp(298) - 1) < 1e-9, 'eqSolve et eqSolveV vérifient Kp = x²_NO₂ P/(x_N₂O₄ P°)');
}

/* 8. Gillespie */
console.log('8. Gillespie');
{
  const T = 298, V = 1e-3, nEq = 400, th = Rxn.eqSolveV(T, V, nEq * Rxn.EQ.q);
  let sumA = 0, nf = 0, nr = 0, minWin = Infinity, worstW = 0;
  for (let sd = 0; sd < 50; sd++) {
    const s = Rxn.eqInit({ T, V, nEq, seed: 1000 + sd });
    for (let k = 0; k < 100; k++) Rxn.eqStep(s, 0.1, { tauT: 0 }); // relaxation depuis N₂O₄ pur
    s.nf = 0; s.nr = 0; let a = 0;
    for (let w = 0; w < 40; w++) {
      const f0 = s.nf, r0 = s.nr;
      for (let k = 0; k < 10; k++) { Rxn.eqStep(s, 0.1, { tauT: 0 }); a += Rxn.eqAlpha(s); }
      minWin = Math.min(minWin, s.nf - f0, s.nr - r0);
    }
    sumA += a / 400; nf += s.nf; nr += s.nr;
  }
  const am = sumA / 50;
  ok(rel(am, th.alpha) < 0.02, '50 graines : composition moyenne à long terme = eqSolveV à 2 %', 'α = ' + f3(am) + ' vs ' + f3(th.alpha));
  ok(rel(nf, nr) < 0.05, 'à l\'équilibre, dissociations/s = recombinaisons/s à 5 %', f3(nf / 2000) + ' vs ' + f3(nr / 2000) + ' par seconde');
  ok(minWin > 0, 'jamais nuls : chaque fenêtre de 1 s compte des événements dans les deux sens (2 000 fenêtres)', 'minimum ' + minWin + ' par seconde');
}

/* 9. Le Chatelier */
console.log('9. Le Chatelier');
{
  const T = 298, s = Rxn.eqInit({ T, start: 'eq', seed: 42 });
  for (let k = 0; k < 50; k++) Rxn.eqStep(s, 0.1, { tauT: 0 });
  s.M += 120; // injecter du NO₂
  const K = Rxn.Kp(T), q0 = Rxn.Q(s);
  ok(q0 > K, 'après ajout de NO₂ : Q > K', 'Q = ' + f3(q0) + ', K = ' + f3(K));
  s.nf = 0; s.nr = 0; Rxn.eqStep(s, 0.3, { tauT: 0 });
  const dom = s.nr > 1.5 * s.nf, nr03 = s.nr, nf03 = s.nf; let q = Rxn.Q(s), t = 0; const qs = [];
  while (t < 10) { Rxn.eqStep(s, 0.1, { tauT: 0 }); t += 0.1; qs.push(Rxn.Q(s)); }
  const qEnd = qs.slice(-50).reduce((a, v) => a + v, 0) / 50;
  ok(dom && q > K, 'la recombinaison domine tant que Q > K', 'en 0,3 s : ' + nr03 + ' recombinaisons, ' + nf03 + ' dissociations, Q = ' + f3(q));
  ok(rel(qEnd, K) < 0.08, 'retour à Q = K (moyenne des 5 dernières secondes, 8 %)', f3(qEnd) + ' vs ' + f3(K));
  const n0 = 0.04, eA = Rxn.eqSolveV(T, 1e-3, n0), eB = Rxn.eqSolveV(T, 0.5e-3, n0);
  ok(eB.nN2O4 > eA.nN2O4 && eB.xNO2 < eA.xNO2, 'volume divisé par deux : déplacement vers N₂O₄', 'x_NO₂ ' + f3(eA.xNO2) + ' → ' + f3(eB.xNO2));
  const eC = Rxn.eqSolveV(330, 1e-3, n0);
  ok(eC.nNO2 > eA.nNO2, 'chauffer : déplacement vers NO₂', 'n_NO₂ ' + f3(eA.nNO2) + ' → ' + f3(eC.nNO2) + ' mol');
  // même chose par tirages : compression puis chauffage, à partir de l'équilibre
  const s2 = Rxn.eqInit({ T, start: 'eq', seed: 9 }); for (let k = 0; k < 30; k++) Rxn.eqStep(s2, 0.1, { tauT: 0 });
  const avg = st => { let a = 0; for (let k = 0; k < 100; k++) { Rxn.eqStep(st, 0.1, { tauT: 0 }); a += st.N; } return a / 100; };
  const nBefore = avg(s2); s2.V /= 2; for (let k = 0; k < 30; k++) Rxn.eqStep(s2, 0.1, { tauT: 0 }); const nAfter = avg(s2);
  s2.Tbath = 330; for (let k = 0; k < 50; k++) Rxn.eqStep(s2, 0.1); const nHot = avg(s2);
  ok(nAfter > nBefore && nHot < nAfter, 'tirages : comprimer augmente N₂O₄, chauffer le diminue', 'N₂O₄ ' + nBefore.toFixed(0) + ' → ' + nAfter.toFixed(0) + ' → ' + nHot.toFixed(0));
}

console.log(`\n${pass} réussis, ${fail} échoués (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
process.exit(fail ? 1 : 0);
