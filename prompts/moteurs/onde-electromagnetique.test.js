// Tests du moteur « L'onde électromagnétique » (objet EMW).
// node prompts/moteurs/onde-electromagnetique.test.js            → teste prompts/moteurs/onde-electromagnetique.js
// node prompts/moteurs/onde-electromagnetique.test.js page.html  → teste le bloc EMW-BEGIN … EMW-END copié dans la page
'use strict';
const fs = require('fs'), path = require('path');
const file = process.argv[2] || path.join(__dirname, 'onde-electromagnetique.js');
const src = fs.readFileSync(file, 'utf8');
const m = src.match(/\/\* EMW-BEGIN \*\/([\s\S]*?)\/\* EMW-END \*\//);
if (!m) { console.error('Bloc EMW introuvable dans ' + file); process.exit(1); }
if (file.endsWith('.html')) {
  const ref = fs.readFileSync(path.join(__dirname, 'onde-electromagnetique.js'), 'utf8').match(/\/\* EMW-BEGIN \*\/([\s\S]*?)\/\* EMW-END \*\//);
  if (!ref || ref[1] !== m[1]) { console.error('ÉCHEC : le bloc de la page diffère du moteur de référence.'); process.exit(1); }
}
const EMW = new Function(m[1] + '\nreturn EMW;')();

let pass = 0, fail = 0;
function ok(cond, name, info) {
  if (cond) { pass++; console.log('  ok   ' + name); }
  else { fail++; console.log('  ÉCHEC ' + name + (info !== undefined ? '  → ' + info : '')); }
}
const rel = (a, b) => Math.abs(a - b) / Math.abs(b);
const near = (a, b, tol, name) => ok(rel(a, b) <= tol, name + ` (${a.toPrecision(6)} vs ${b.toPrecision(6)})`, rel(a, b).toExponential(2));
const hyp = v => Math.hypot(...v);
const { C, EPS0, MU0 } = EMW;

console.log('1. Constantes');
near(1 / Math.sqrt(MU0 * EPS0), C, 1e-6, '1/√(μ₀ε₀) = c');
near(EMW.HC_EVNM, 1239.84, 1e-5, 'hc = 1239,84 eV·nm');

console.log('2. Charge à vitesse constante (v = 0,05 c)');
{
  const c = 100, h = EMW.chargeHistory({ c, dt: 1 / 240, span: 12 });
  const mot = EMW.kinkCharge(1e9, 0, { v0: 0.05 * c, x0: -30 });   // aucun coup : vitesse constante
  EMW.fillHistory(h, mot, 0, 10);
  const t = 10;
  let worst = 0, dirWorst = 0;
  for (const [x, y] of [[100, 0], [0, 150], [-120, 80], [60, -200], [250, 250]]) {
    const f = EMW.fieldAt(h, x, y, t);
    worst = Math.max(worst, hyp(f.Erad) / hyp(f.Ecoul));
    // pour un mouvement uniforme, le champ pointe depuis la position présente
    const p = mot(t), dx = x - p.x, dy = y - p.y;
    const cos = (f.Ecoul[0] * dx + f.Ecoul[1] * dy) / (hyp(f.Ecoul) * Math.hypot(dx, dy));
    dirWorst = Math.max(dirWorst, Math.acos(Math.min(1, cos)));
    // le temps retardé vérifie t' = t − R/c
    const s = EMW.stateAt(h, f.tRet);
    if (Math.abs(f.tRet - (t - Math.hypot(x - s.x, y - s.y) / c)) > 1e-9) worst = Infinity;
  }
  ok(worst < 1e-9, '|Erad| < 10⁻⁹ |Ecoul| (et t\' = t − R/c)', worst);
  ok(dirWorst < 1e-6, 'le champ pointe depuis la position présente (mouvement uniforme)', dirWorst);
}

console.log('3. Ride après un coup sec');
{
  const c = 100, t0 = 1, tau = 0.04, h = EMW.chargeHistory({ c, dt: 1 / 480, span: 6 });
  const mot = EMW.kinkCharge(t0, 0.2 * c, { tau });
  EMW.fillHistory(h, mot, 0, 5);
  for (const r of [100, 200]) {
    const pts = [[r, 0], [0, r], [r * Math.SQRT1_2, r * Math.SQRT1_2]];
    let before = 0, after = Infinity;
    for (const [x, y] of pts) {
      const ref = [x / r / (r * r), y / r / (r * r)];   // champ statique de la charge au repos à l'origine
      const fb = EMW.fieldAt(h, x, y, t0 + r / c - 0.01);
      before = Math.max(before, hyp([fb.E[0] - ref[0], fb.E[1] - ref[1]]) / hyp(ref));
      const fa = EMW.fieldAt(h, x, y, t0 + tau + r / c + 0.3);
      after = Math.min(after, hyp([fa.E[0] - ref[0], fa.E[1] - ref[1]]) / hyp(ref));
    }
    ok(before < 1e-12, `r = ${r} : rien ne change avant t₀ + r/c`, before);
    ok(after > 1e-3, `r = ${r} : le champ a changé après t₀ + r/c`, after);
  }
  // Dans la coquille, la ride est transverse et vaut a sinθ/(c²R) ; elle est nulle dans l'axe.
  const r = 150, tm = t0 + tau / 2 + r / c;
  const f90 = EMW.fieldAt(h, 0, r, tm), f0 = EMW.fieldAt(h, r, 0, tm);
  near(hyp(f90.Erad), (0.2 * c / tau) / (c * c * f90.R), 1e-2, 'ride à 90° : |Erad| = a/(c²R)');
  ok(hyp(f0.Erad) < 1e-9 * hyp(f90.Erad), 'ride nulle dans l\'axe du mouvement', hyp(f0.Erad));
  ok(f90.Erad[0] < 0, 'ride opposée à l\'accélération (charge +)', f90.Erad[0]);
  // La ligne de champ (construction de Purcell) suit la direction du champ calculé dans la coquille.
  const th = Math.PI / 3, ds = 0.25, line = EMW.fieldLine(h, th, tm, 220, ds);
  let worst = 0;
  for (let i = 0; i + 3 < line.length; i += 2) {
    const x = line[i], y = line[i + 1], x2 = line[i + 2], y2 = line[i + 3];
    const rr = Math.hypot(x, y);
    if (rr < r - 1.8 || rr > r + 1.8) continue;      // dans la coquille seulement (épaisseur c·τ = 4)
    const f = EMW.fieldAt(h, (x + x2) / 2, (y + y2) / 2, tm);
    const tx = x2 - x, ty = y2 - y;
    const cos = (f.E[0] * tx + f.E[1] * ty) / (hyp(f.E) * Math.hypot(tx, ty));
    worst = Math.max(worst, Math.acos(Math.min(1, cos)));
  }
  console.log('     (écart max ' + worst.toFixed(4) + ' rad)');
  ok(worst < 0.1, 'la ligne coudée suit le champ dans la coquille (écart < 0,1 rad)', worst.toFixed(4));
  // Hors coquille aussi, la ligne suit le champ (dedans : depuis la position présente).
  let w2 = 0;
  for (let i = 0; i + 3 < line.length; i += 2) {
    const rr = Math.hypot(line[i], line[i + 1]); if (Math.abs(rr - r) < 3 || rr < 20) continue;
    const f = EMW.fieldAt(h, (line[i] + line[i + 2]) / 2, (line[i + 1] + line[i + 3]) / 2, tm), tx = line[i + 2] - line[i], ty = line[i + 3] - line[i + 1];
    w2 = Math.max(w2, Math.acos(Math.min(1, (f.E[0] * tx + f.E[1] * ty) / (hyp(f.E) * Math.hypot(tx, ty)))));
  }
  ok(w2 < 0.01, 'hors coquille, la ligne suit le champ (écart < 0,01 rad)', w2.toFixed(5));
  // Au-delà du cercle, la ligne part encore de l'ancienne position.
  const outer = EMW.fieldLine(h, th, t0 + 0.5, 200, 1), n = outer.length;
  const ox = outer[n - 2], oy = outer[n - 1];
  ok(Math.abs(Math.atan2(oy, ox) - th) < 1e-9, 'au-delà du cercle, la ligne pointe depuis l\'ancienne position');
}

console.log('4. Dipôle oscillant');
{
  const p0 = 1e-9, w = 2 * Math.PI * 1e8, r = 100, lam = 2 * Math.PI * C / w;
  const amp = th => { let mx = 0; for (let k = 0; k < 64; k++) mx = Math.max(mx, Math.abs(EMW.dipoleFar(p0, w, r, th, k / 64 * 1e-8).Etheta)); return mx; };
  ok(amp(0) === 0, 'Erad nul sur l\'axe (θ = 0)');
  let best = 0, thBest = 0;
  for (let i = 0; i <= 180; i++) { const a = amp(i * Math.PI / 180); if (a > best) { best = a; thBest = i; } }
  ok(thBest === 90, 'Erad maximal à θ = 90°', thBest);
  let worst = 0;
  for (const deg of [15, 30, 45, 60, 75, 120]) {
    const th = deg * Math.PI / 180;
    worst = Math.max(worst, rel(EMW.dipoleIntensity(p0, w, r, th) / EMW.dipoleIntensity(p0, w, r, Math.PI / 2), Math.sin(th) ** 2));
  }
  ok(worst < 0.01, 'intensité ∝ sin²θ à 1 %', worst);
  // <S> calculé à partir des champs (moyenne temporelle de E·B/μ0) = dipoleIntensity
  let S = 0; const N = 400, T = 2 * Math.PI / w;
  for (let k = 0; k < N; k++) { const f = EMW.dipoleFar(p0, w, r, Math.PI / 3, k / N * T); S += f.Etheta * f.Bphi / MU0; }
  near(S / N, EMW.dipoleIntensity(p0, w, r, Math.PI / 3), 1e-6, '<E·B/μ₀> = intensité');
  // puissance totale : intégrale sur la sphère
  let P = 0; const M = 2000;
  for (let i = 0; i < M; i++) { const th = (i + 0.5) / M * Math.PI; P += EMW.dipoleIntensity(p0, w, r, th) * 2 * Math.PI * r * r * Math.sin(th) * Math.PI / M; }
  near(P, EMW.dipolePower(p0, w), 1e-4, '∮ I dA = μ₀p₀²ω⁴/(12πc)');
  // retard de phase 2πr/λ
  const d1 = EMW.dipoleFar(p0, w, r, 1, 0).phase - EMW.dipoleFar(p0, w, r + lam / 4, 1, 0).phase;
  near(d1, Math.PI / 2, 1e-9, 'retard de phase 2π·Δr/λ (Δr = λ/4 → π/2)');
  const d2 = EMW.dipoleFar(p0, w, 0.001, 1, 0).phase - EMW.dipoleFar(p0, w, r, 1, 0).phase;
  near(d2, 2 * Math.PI * (r - 0.001) / lam, 1e-9, 'retard de phase 2πr/λ');
  // et en oscillant, la charge de scène rayonne nulle dans l'axe, maximale en travers
  const c = 100, h = EMW.chargeHistory({ c, dt: 1 / 240, span: 8 });
  EMW.fillHistory(h, EMW.oscCharge(3, 2 * Math.PI * 0.5), 0, 6);
  ok(hyp(EMW.fieldAt(h, 200, 0, 6).Erad) < 1e-12, 'charge qui oscille : rayonnement nul dans l\'axe');
}

console.log('5. Onde plane');
{
  const E0 = 100, lam = 0.5, T = lam / C;
  let dot = 0, ratio = 0, phase = 0, poy = 0;
  for (const pol of [0, 0.7]) for (let k = 0; k < 50; k++) {
    const x = k * lam / 37, t = k * T / 23, f = EMW.plane(E0, lam, x, t, pol);
    const Em = hyp(f.E), Bm = hyp(f.B);
    dot = Math.max(dot, Math.abs(f.E[0] * f.B[0] + f.E[1] * f.B[1] + f.E[2] * f.B[2]) / (E0 * E0 / C));
    if (Em > 1e-6 * E0) ratio = Math.max(ratio, rel(Em / Bm, C));
    // en phase : E et B s'annulent ensemble (même signe de la projection sur leurs axes)
    const e = f.E[1] * Math.cos(pol) + f.E[2] * Math.sin(pol), b = -f.B[1] * Math.sin(pol) + f.B[2] * Math.cos(pol);
    phase = Math.max(phase, Math.abs(e / C - b) / (E0 / C));
    const Sx = f.E[1] * f.B[2] - f.E[2] * f.B[1];
    if (Em > 1e-6 * E0 && Sx <= 0) poy = 1;
  }
  ok(dot < 1e-12, 'E·B = 0', dot);
  ok(ratio < 1e-12, '|E|/|B| = c', ratio);
  ok(phase < 1e-12, 'E et B en phase', phase);
  ok(poy === 0, 'E × B dans le sens de propagation (+x)');
  // Maxwell : ∂Ey/∂x = −∂Bz/∂t et ∂Bz/∂x = −μ₀ε₀ ∂Ey/∂t (polarisation verticale)
  const x = 0.13, t = 0.37 * T, dx = lam * 1e-5, dt = T * 1e-5, g = (X, Tt) => EMW.plane(E0, lam, X, Tt, 0);
  const dEdx = (g(x + dx, t).E[1] - g(x - dx, t).E[1]) / (2 * dx), dBdt = (g(x, t + dt).B[2] - g(x, t - dt).B[2]) / (2 * dt);
  const dBdx = (g(x + dx, t).B[2] - g(x - dx, t).B[2]) / (2 * dx), dEdt = (g(x, t + dt).E[1] - g(x, t - dt).E[1]) / (2 * dt);
  near(dEdx, -dBdt, 1e-6, 'Faraday : ∂E/∂x = −∂B/∂t');
  near(dBdx, -MU0 * EPS0 * dEdt, 1e-6, 'Ampère-Maxwell : ∂B/∂x = −μ₀ε₀ ∂E/∂t');
  const u = EMW.energyDensity(E0, E0 / C);
  near(u.uB, u.uE, 1e-6, 'énergie magnétique = énergie électrique');
}

console.log('6. Soleil à 1 UA');
{
  const I = 1361, E0 = EMW.E0from(I);
  near(E0, 1013, 0.01, 'E₀ ≈ 1 013 V/m');
  near(EMW.B0from(E0), 3.38e-6, 0.01, 'B₀ ≈ 3,38 µT');
  near(EMW.radPressure(I, false), 4.54e-6, 0.01, 'pression absorbée 4,54 µPa');
  near(EMW.radPressure(I, true), 9.08e-6, 0.01, 'pression réfléchie 9,08 µPa');
  near(EMW.intensity(E0), I, 1e-12, 'intensity(E0from(I)) = I');
  near(EMW.inverseSquare(EMW.P_SOLEIL, EMW.UA), 1361, 0.01, 'P☉/(4π UA²) ≈ 1 361 W/m²');
  near(EMW.radPressure(I, true) * 100 * 100, 0.0908, 0.01, 'voile réfléchissante 100 m × 100 m : 0,09 N');
}

console.log('7. Photon');
{
  near(EMW.photonEnergy(550e-9).eV, 2.25, 0.005, '550 nm → 2,25 eV');
  let worst = 0;
  for (const nm of [0.05, 124, 254, 550, 1e4, 3e9]) worst = Math.max(worst, rel(EMW.photonEnergy(nm * 1e-9).eV, 1240 / nm));
  ok(worst < 1e-3, 'E = 1 240 eV·nm / λ à 0,1 %', worst);
  const l = EMW.lambdaFromF(100e6);
  near(l, 3.00, 0.001, '100 MHz → λ = 3,00 m');
  near(EMW.photonEnergy(l).eV, 4.1e-7, 0.01, '100 MHz → E ≈ 4,1 × 10⁻⁷ eV');
  near(EMW.LAMBDA_ION, 124e-9, 0.001, 'seuil d\'ionisation 10 eV ≈ 124 nm');
  ok(EMW.ionizing(100e-9) && !EMW.ionizing(254e-9), 'ionisant à 100 nm, pas à 254 nm');
}

console.log('8. Inverse du carré');
{
  near(EMW.inverseSquare(100, 1), 7.96, 0.001, 'P = 100 W, r = 1 m → 7,96 W/m²');
  near(EMW.inverseSquare(100, 1) / EMW.inverseSquare(100, 2), 4, 1e-12, 'r doublé → divisé par 4');
  near(EMW.hitFraction(1, 0.5), 1 / 6, 1e-12, 'face d\'un cube vue du centre : 1/6 des rayons');
  near(EMW.hitFraction(1, 10), 1 / (4 * Math.PI * 100), 0.01, 'carré de 1 m² à 10 m : A/(4πr²)');
  const rng = EMW.mulberry32(42); let hits = 0; const N = 200000;
  for (let i = 0; i < N; i++) { const d = EMW.isoDir(rng); if (d[2] > 0) { const s = 0.5 / d[2]; if (Math.abs(d[0] * s) <= 0.5 && Math.abs(d[1] * s) <= 0.5) hits++; } }
  near(hits / N, 1 / 6, 0.02, 'tirage isotrope à graine : 1/6 sur la face d\'un cube');
}

console.log('9. Spectre');
{
  const b = EMW.bands;
  let okc = Math.abs(b[0].lmin - 1e-12) < 1e-24 && Math.abs(b[b.length - 1].lmax - 1e4) < 1e-9;
  for (let i = 0; i + 1 < b.length; i++) okc = okc && b[i].lmax === b[i + 1].lmin && b[i].lmin < b[i].lmax;
  ok(okc, 'domaines contigus de 10⁻¹² m à 10⁴ m, sans trou ni chevauchement');
  let one = true;
  for (let k = 0; k <= 1600; k++) { const l = Math.pow(10, -12 + 16 * k / 1600) * (k === 1600 ? 0.999999 : 1); if (b.filter(x => l >= x.lmin && l < x.lmax).length !== 1) one = false; }
  ok(one, 'chaque λ de la règle tombe dans exactement un domaine');
  ok(EMW.presets.every(p => EMW.bandOf(p.lambda).id === p.band && p.lambda >= EMW.LMIN && p.lambda <= EMW.LMAX), 'chaque préréglage tombe dans son domaine et sur la règle',
     EMW.presets.map(p => p.id + ':' + EMW.bandOf(p.lambda).id).join(' '));
  const c5 = EMW.visibleColor(550e-9), c6 = EMW.visibleColor(650e-9), c4 = EMW.visibleColor(450e-9), cx = EMW.visibleColor(1e-6), cu = EMW.visibleColor(300e-9);
  ok(c5.g > c5.r && c5.g > c5.b && c6.r > c6.g && c6.r > c6.b && c4.b > c4.r && c4.b > c4.g, 'visibleColor : 450 bleu, 550 vert, 650 rouge');
  ok(!cx.visible && cx.r === cx.g && cx.g === cx.b && !cu.visible && cu.r === cu.b, 'visibleColor : gris hors du visible');
  ok(EMW.scaleObject(550e-9).nom === 'une bactérie' && EMW.scaleObject(1.7).nom === 'un humain' && EMW.scaleObject(0.05e-9).nom === 'un atome', 'scaleObject : 550 nm ↔ bactérie, 1,7 m ↔ humain, 0,05 nm ↔ atome');
  ok(EMW.inWindow(550e-9) && EMW.inWindow(3) && !EMW.inWindow(1e-10) && !EMW.inWindow(10e-6), 'fenêtres : visible et radio passent, X et IR thermique non');
  ok(EMW.bandOf(500e-9).id === 'visible' && EMW.bandOf(1e3).id === 'radio' && EMW.bandOf(5e-12).id === 'gamma', 'bandOf');
}

console.log(`\n${pass} réussis, ${fail} échoués`);
process.exit(fail ? 1 : 0);
