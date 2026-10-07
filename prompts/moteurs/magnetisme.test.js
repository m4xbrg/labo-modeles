// Tests du moteur « Magnétisme et induction ».
// node prompts/moteurs/magnetisme.test.js            → teste prompts/moteurs/magnetisme.js
// node prompts/moteurs/magnetisme.test.js page.html  → teste le bloc MAG-BEGIN … MAG-END copié dans la page
'use strict';
const fs = require('fs');
const path = require('path');

const target = process.argv[2] || path.join(__dirname, 'magnetisme.js');
const src = fs.readFileSync(target, 'utf8');
const i0 = src.indexOf('/* MAG-BEGIN */'), i1 = src.indexOf('/* MAG-END */');
if (i0 < 0 || i1 < 0) { console.error('Marqueurs MAG-BEGIN / MAG-END introuvables dans ' + target); process.exit(1); }
const block = src.slice(i0, i1 + '/* MAG-END */'.length);
if (target.endsWith('.html')) {
  const ref = fs.readFileSync(path.join(__dirname, 'magnetisme.js'), 'utf8');
  const r0 = ref.indexOf('/* MAG-BEGIN */'), r1 = ref.indexOf('/* MAG-END */');
  if (ref.slice(r0, r1 + 13) !== block) { console.error('ÉCHEC : le bloc de la page diffère du moteur de référence.'); process.exit(1); }
}
const Mag = new Function(block + '\nreturn Mag;')();

let pass = 0, fail = 0;
function ok(cond, name, info) {
  if (cond) pass++;
  else { fail++; console.log('ÉCHEC  ' + name + (info !== undefined ? '  (' + info + ')' : '')); }
}
function near(a, b, rel, name) {
  const e = Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
  ok(e <= rel, name, a + ' vs ' + b + ', écart rel. ' + e.toExponential(2));
}
const PI = Math.PI, MU0 = Mag.MU0;

// --- Intégrales elliptiques
{
  const r = Mag.ellipKE(0);
  near(r.K, PI / 2, 1e-14, 'K(0) = π/2'); near(r.E, PI / 2, 1e-14, 'E(0) = π/2');
  const h = Mag.ellipKE(0.5);
  near(h.K, 1.8540746773013719, 1e-13, 'K(1/2)'); near(h.E, 1.3506438810476755, 1e-13, 'E(1/2)');
  const q = Mag.ellipKE(0.9);
  near(q.K, 2.5780921133481733, 1e-12, 'K(0,9)'); near(q.E, 1.1047747327040733, 1e-12, 'E(0,9)');
}

// --- Spire : centre, axe, loin (dipôle), symétries
{
  const I = 2, a = 0.05;
  near(Mag.loopField(I, a, 0, 0).bz, MU0 * I / (2 * a), 1e-12, 'spire : B au centre = μ0 I / 2a');
  for (const z of [0.01, 0.05, 0.2]) {
    near(Mag.loopField(I, a, z, 1e-12).bz, MU0 * I * a * a / (2 * Math.pow(a * a + z * z, 1.5)), 1e-9, 'spire : sur l\'axe z = ' + z);
  }
  // hors axe, comparer à la loi de Biot et Savart intégrée numériquement
  function biot(z, rho) {
    let bz = 0, br = 0; const n = 20000;
    for (let i = 0; i < n; i++) {
      const p = 2 * PI * (i + 0.5) / n, dp = 2 * PI / n;
      const lx = a * Math.cos(p), ly = a * Math.sin(p);   // spire dans le plan (x,y), axe z ; point en (rho, 0, z)
      const dlx = -a * Math.sin(p) * dp, dly = a * Math.cos(p) * dp;
      const rx = rho - lx, ry = -ly, rz = z, r3 = Math.pow(rx * rx + ry * ry + rz * rz, 1.5);
      // dl × r
      const cx = dly * rz, cz = dlx * ry - dly * rx;
      br += cx / r3; bz += cz / r3;
    }
    return { bz: MU0 * I / (4 * PI) * bz, brho: MU0 * I / (4 * PI) * br };
  }
  for (const [z, rho] of [[0.02, 0.03], [-0.04, 0.07], [0.1, 0.01], [0.0, 0.08]]) {
    const f = Mag.loopField(I, a, z, rho), b = biot(z, rho);
    near(f.bz, b.bz, 1e-6, 'spire : Bz hors axe vs Biot-Savart (' + z + ', ' + rho + ')');
    if (Math.abs(b.brho) > 1e-12) near(f.brho, b.brho, 1e-6, 'spire : Bρ hors axe vs Biot-Savart (' + z + ', ' + rho + ')');
  }
  // loin : dipôle, B(axe) = μ0 m / (2π z³), m = I π a²
  const z = 2;
  near(Mag.loopField(I, a, z, 0).bz, MU0 * I * PI * a * a / (2 * PI * z * z * z), 1e-3, 'spire : champ dipolaire loin sur l\'axe');
  const f1 = Mag.loopField(I, a, 0.03, 0.04), f2 = Mag.loopField(I, a, 0.03, -0.04), f3 = Mag.loopField(I, a, -0.03, 0.04);
  near(f2.bz, f1.bz, 1e-14, 'spire : Bz pair en ρ'); near(f2.brho, -f1.brho, 1e-14, 'spire : Bρ impair en ρ');
  near(f3.bz, f1.bz, 1e-14, 'spire : Bz pair en z'); near(f3.brho, -f1.brho, 1e-14, 'spire : Bρ impair en z');
}

// --- div B = 0 (coordonnées cylindriques) autour d'une spire
{
  const I = 1, a = 0.05, h = 1e-6;
  let worst = 0;
  for (const [z, r] of [[0.01, 0.02], [0.04, 0.06], [-0.03, 0.09], [0.08, 0.03]]) {
    const dbr = ((r + h) * Mag.loopField(I, a, z, r + h).brho - (r - h) * Mag.loopField(I, a, z, r - h).brho) / (2 * h * r);
    const dbz = (Mag.loopField(I, a, z + h, r).bz - Mag.loopField(I, a, z - h, r).bz) / (2 * h);
    const scale = Math.hypot(Mag.loopField(I, a, z, r).bz, Mag.loopField(I, a, z, r).brho) / a;
    worst = Math.max(worst, Math.abs(dbr + dbz) / scale);
  }
  ok(worst < 1e-5, 'div B = 0 autour d\'une spire', worst.toExponential(2));
}

// --- Inductance mutuelle : flux de Bz à travers un disque
{
  const a = 0.04, b = 0.03, d = 0.025;
  const n = 4000; let phi = 0;
  for (let i = 0; i < n; i++) { const r = b * (i + 0.5) / n; phi += Mag.loopField(1, a, d, r).bz * 2 * PI * r * b / n; }
  near(Mag.mutual(a, b, d), phi, 1e-5, 'mutuelle de Maxwell = ∫ Bz dA');
  near(Mag.mutual(a, b, d), Mag.mutual(b, a, d), 1e-12, 'mutuelle symétrique M12 = M21');
  const bs = 0.002;
  near(Mag.mutual(0.1, bs, 0), MU0 / (2 * 0.1) * PI * bs * bs, 3e-4, 'petite boucle au centre : Φ = B πb²');
}

// --- Fil rectiligne
{
  const s = [{ kind: 'fil', I: 10, x: 0, y: 0 }];
  const f = Mag.fieldAt(s, 0.05, 0);
  near(f.b, MU0 * 10 / (2 * PI * 0.05), 1e-12, 'fil : B = μ0 I / 2πr');
  ok(f.by > 0 && Math.abs(f.bx) < 1e-20, 'fil : I sortant → champ antihoraire (à droite du fil, B vers le haut)');
  near(Mag.fieldAt(s, 0.1, 0).b, f.b / 2, 1e-12, 'fil : B ∝ 1/r');
  // circulation d'Ampère
  let circ = 0; const n = 2000, R = 0.07;
  for (let i = 0; i < n; i++) {
    const p = 2 * PI * (i + 0.5) / n, g = Mag.fieldAt(s, R * Math.cos(p), R * Math.sin(p));
    circ += (-g.bx * Math.sin(p) + g.by * Math.cos(p)) * R * 2 * PI / n;
  }
  near(circ, MU0 * 10, 1e-9, 'Ampère : ∮ B·dl = μ0 I');
  // Oersted : 10 A à 5 cm ≈ 40 µT, comparable au champ terrestre
  near(f.b, 40e-6, 1e-9, 'Oersted : 10 A à 5 cm donne 40 µT');
}

// --- Spire vue en coupe : ⊙ en haut quand I > 0, et le champ tourne comme autour d'un fil sortant
{
  const sp = { kind: 'spire', I: 5, a: 0.05, x: 0, y: 0 };
  const c = Mag.crossings(sp);
  ok(c[0].y > 0 && c[0].sens === 1 && c[1].sens === -1, 'spire : ⊙ en haut, ⊗ en bas pour I > 0');
  const f = Mag.fieldAt([sp], 0.006, 0.05);   // juste à droite du conducteur du haut
  ok(f.by > 0, 'spire : près du conducteur du haut, champ antihoraire');
  ok(Mag.fieldAt([sp], 0, 0).bx > 0, 'spire : champ vers +x au centre pour I > 0');
}

// --- Bobine longue et aimant
{
  const N = 400, L = 0.4, I = 2;
  const bob = { kind: 'bobine', I: I, N: N, a: 0.02, L: L, x: 0, y: 0 };
  Mag.prepare([bob]);
  const n = N / L, B0 = MU0 * n * I;
  near(Mag.fieldAt([bob], 0, 0).bx, B0 * (L / 2) / Math.hypot(L / 2, 0.02), 1e-3, 'bobine : B au centre ≈ μ0 n I (formule de longueur finie)');
  near(Mag.fieldAt([bob], 0, 0).bx, B0, 0.01, 'bobine longue : B ≈ μ0 n I');
  near(Mag.fieldAt([bob], 0.2, 0).bx, B0 / 2, 0.02, 'bobine longue : B ≈ μ0 n I / 2 à une extrémité');
  ok(Math.abs(Mag.fieldAt([bob], 0, 0.01).bx - Mag.fieldAt([bob], 0, 0).bx) / B0 < 0.02, 'bobine longue : champ presque uniforme à l\'intérieur');
  const mag = { kind: 'aimant', Br: 1.2, a: 0.005, L: 0.1, x: 0, y: 0, dir: 1 };
  Mag.prepare([mag]);
  near(Mag.fieldAt([mag], 0, 0).bx, 1.2 * 0.05 / Math.hypot(0.05, 0.005), 2e-3, 'aimant très long : B intérieur ≈ Br');
  const m2 = { kind: 'aimant', Br: 1.2, a: 0.006, L: 0.012, x: 0, y: 0, dir: 1 };
  Mag.prepare([m2]);
  ok(Mag.fieldAt([m2], 0.02, 0).bx > 0, 'aimant : nord à droite pour dir = +1 (champ sortant vers +x)');
  m2.dir = -1; Mag.prepare([m2]);
  ok(Mag.fieldAt([m2], 0.02, 0).bx < 0, 'aimant : dir = −1 inverse le champ');
  // aimant de 12 mm, Br = 1,2 T : ≈ 0,4 T à la face (formule exacte du cylindre)
  m2.dir = 1; Mag.prepare([m2]);
  const zf = 0.006 + 1e-6, Bface = 1.2 / 2 * ((zf + 0.006) / Math.hypot(zf + 0.006, 0.006) - (zf - 0.006) / Math.hypot(zf - 0.006, 0.006));
  near(Mag.fieldAt([m2], zf, 0).bx, Bface, 0.01, 'aimant : champ à la face = formule du cylindre');
  // couper l'aimant : deux aimants, chacun avec ses deux pôles ; le champ ne s'annule pas dans la fente
  const g = 0.002;
  const left = { kind: 'aimant', Br: 1.2, a: 0.006, L: 0.006, x: -0.003 - g / 2, y: 0, dir: 1 };
  const right = { kind: 'aimant', Br: 1.2, a: 0.006, L: 0.006, x: 0.003 + g / 2, y: 0, dir: 1 };
  Mag.prepare([left, right]);
  ok(Mag.fieldAt([left, right], 0, 0).bx > 0.3, 'aimant coupé : le champ traverse la fente (nord face à sud)');
}

// --- Lignes de champ fermées
{
  const sp = { kind: 'spire', I: 5, a: 0.05, x: 0, y: 0 };
  Mag.prepare([sp]);
  const l = Mag.traceLine([sp], 0, 0.02, { ds: 0.001, nmax: 4000 });
  ok(l.closed, 'ligne de champ d\'une spire : se referme', l.pts.length);
  const mag = { kind: 'aimant', Br: 1.2, a: 0.006, L: 0.024, x: 0, y: 0, dir: 1 };
  Mag.prepare([mag]);
  const lm = Mag.traceLine([mag], 0, 0.003, { ds: 0.0005, nmax: 6000 });
  ok(lm.closed, 'ligne de champ d\'un aimant : se referme en passant dans l\'aimant', lm.pts.length);
  const fl = Mag.traceLine([{ kind: 'fil', I: 1, x: 0, y: 0 }], 0.03, 0, { ds: 0.001, nmax: 1000 });
  ok(fl.closed, 'ligne de champ d\'un fil : un cercle fermé');
  let rmax = 0; for (const p of fl.pts) rmax = Math.max(rmax, Math.abs(Math.hypot(p[0], p[1]) - 0.03));
  ok(rmax < 1e-6, 'ligne de champ d\'un fil : rayon constant', rmax);
  ok(Mag.seeds(mag, 8).length === 8, 'graines : nombre demandé');
}

// --- Boussole
{
  const st = { th: 2.5, w: 0 };
  for (let i = 0; i < 600; i++) Mag.compassStep(st, Mag.B_TERRE_H, 0, 1 / 60);
  ok(Math.abs(st.th) < 0.01, 'boussole : s\'aligne sur le champ', st.th);
  const st2 = { th: 0, w: 0 };
  for (let i = 0; i < 600; i++) Mag.compassStep(st2, 0, 0.5, 1 / 60);
  ok(Math.abs(st2.th - PI / 2) < 0.01 && isFinite(st2.th), 'boussole : stable dans un champ fort (0,5 T)', st2.th);
}

// --- Force de Lorentz : cyclotron
{
  const q = Mag.QE, m = Mag.MP, B = 0.1, v = 1e6;
  const g = Mag.gyro(m, q, v, B, 0);
  near(g.r, 0.10439, 1e-3, 'proton 1000 km/s dans 0,1 T : r ≈ 10,4 cm');
  near(g.T, 6.559e-7, 1e-3, 'proton dans 0,1 T : T ≈ 0,66 µs');
  const p = { x: 0, y: 0, z: 0, vx: v, vy: 0, vz: 0 };
  const dt = g.T / 2000, E0 = { x: 0, y: 0, z: 0 }, Bv = { x: 0, y: 0, z: B };
  let xmin = 0, xmax = 0, ymin = 0, ymax = 0, vmaxErr = 0;
  for (let i = 0; i < 2000; i++) {
    Mag.boris(p, q, m, E0, Bv, dt);
    xmin = Math.min(xmin, p.x); xmax = Math.max(xmax, p.x); ymin = Math.min(ymin, p.y); ymax = Math.max(ymax, p.y);
    vmaxErr = Math.max(vmaxErr, Math.abs(Math.hypot(p.vx, p.vy, p.vz) - v) / v);
  }
  ok(vmaxErr < 1e-12, 'B seul : vitesse constante (B ne travaille pas)', vmaxErr);
  near((ymax - ymin) / 2, g.r, 1e-4, 'Boris : rayon = m v / qB');
  ok(Math.hypot(p.x, p.y) < 1e-3 * g.r, 'Boris : revient au départ après une période', Math.hypot(p.x, p.y));
  ok(ymin < -0.1 * g.r && ymax < 1e-9, 'proton, v selon +x, B sortant : tourne vers −y (sens horaire)');
  // électron : sens inverse
  const pe = { x: 0, y: 0, z: 0, vx: 1e7, vy: 0, vz: 0 };
  Mag.boris(pe, -q, Mag.ME, E0, { x: 0, y: 0, z: 1e-3 }, 1e-12);
  ok(pe.vy > 0, 'électron : tourne dans l\'autre sens');
  // période indépendante de la vitesse
  near(Mag.gyro(m, q, 3e6, B).T, g.T, 1e-14, 'période indépendante de la vitesse');
  // hélice
  const ph = { x: 0, y: 0, z: 0, vx: v, vy: 0, vz: 3e5 };
  for (let i = 0; i < 2000; i++) Mag.boris(ph, q, m, E0, Bv, dt);
  near(ph.z, Mag.gyro(m, q, v, B, 3e5).pas, 1e-9, 'hélice : pas = v∥ T');
  // dérive E × B
  const Ef = { x: 0, y: 1e5, z: 0 }, d = Mag.drift(Ef, Bv);
  near(d.x, 1e6, 1e-12, 'sélecteur : v = E / B');
  const ps = { x: 0, y: 0, z: 0, vx: 1e6, vy: 0, vz: 0 };
  for (let i = 0; i < 1000; i++) Mag.boris(ps, q, m, Ef, Bv, dt);
  ok(Math.abs(ps.y) < 1e-9 && Math.abs(ps.vx - 1e6) < 1e-3, 'sélecteur : la bonne vitesse passe en ligne droite');
  // F = q v × B
  const F = Mag.lorentz(q, { x: v, y: 0, z: 0 }, E0, Bv);
  near(F.y, -q * v * B, 1e-12, 'F = q v × B');
  // spectromètre : r ∝ m/q
  near(Mag.gyro(Mag.MD, q, v, B).r / g.r, Mag.MD / Mag.MP, 1e-12, 'deutéron : rayon ≈ 2 × proton');
  near(Mag.gyro(Mag.MA, 2 * q, v, B).r / g.r, Mag.MA / (2 * Mag.MP), 1e-12, 'alpha : rayon ≈ 2 × proton');
}

// --- Laplace
{
  near(Mag.laplace(5, 0.05, 0.1), 0.025, 1e-12, 'F = I L B');
  near(Mag.swingEq(5, 0.05, 0.1, 0.010), Math.atan(0.025 / (0.010 * 9.81)), 1e-12, 'balançoire : tan θ = ILB / mg');
  const st = { th: 0, w: 0 }, p = { I: 5, L: 0.05, B: 0.1, m: 0.010, ell: 0.15 };
  for (let i = 0; i < 1200; i++) Mag.swingStep(st, p, 1 / 60);
  near(st.th, Mag.swingEq(5, 0.05, 0.1, 0.010), 1e-3, 'balançoire : s\'immobilise à l\'équilibre');
  near(Mag.wiresForce(1, 1, 1), 2e-7, 1e-12, 'deux fils 1 A à 1 m : 2 × 10⁻⁷ N/m');
}

// --- Flux, Faraday, Lenz
{
  const mag = { kind: 'aimant', Br: 1.2, a: 0.006, L: 0.02, x: -0.1, y: 0, dir: 1 };
  const coil = { N: 200, b: 0.015, x: 0, y: 0, L: 0.02 };
  // l'aimant traverse la bobine à vitesse constante
  const v = 0.5, dt = 1e-3;
  let integ = 0, integHalf = 0, area = 0, peakPos = 0, peakNeg = 0, tPos = 0, tNeg = 0;
  Mag.prepare([mag]);
  const lam0 = Mag.linkage([mag], coil);
  let lamHalf = 0;
  for (let i = 0; i <= 400; i++) {
    const t = i * dt;
    mag.x = -0.1 + v * t; Mag.prepare([mag]);
    const e = Mag.emfMoving(mag, coil, v);
    const w = (i > 0 && i < 400) ? dt : dt / 2;
    integ += e * w; area += Math.abs(e) * w;
    if (i <= 200) integHalf += e * ((i > 0 && i < 200) ? dt : dt / 2);
    if (i === 200) lamHalf = Mag.linkage([mag], coil);
    if (e > peakPos) { peakPos = e; tPos = t; } if (e < peakNeg) { peakNeg = e; tNeg = t; }
  }
  near(integHalf, -(lamHalf - lam0), 2e-3, 'Faraday : ∫ ε dt = −ΔΛ (aimant qui entre)');
  ok(Math.abs(integ) < 1e-3 * area, 'Faraday : traversée complète, ∫ ε dt ≈ 0 (même flux avant et après)');
  // à mi-parcours, au repos dans la bobine : ε = 0
  mag.x = 0; Mag.prepare([mag]);
  ok(Math.abs(Mag.emfMoving(mag, coil, 0)) === 0, 'aimant immobile dans la bobine : ε = 0');
  ok(Math.abs(Mag.dLinkageDx(mag, coil)) / Mag.linkage([mag], coil) < 1e-3, 'aimant centré : flux maximal (dΛ/dx ≈ 0)');
  // deux fois plus vite : bosse deux fois plus haute
  mag.x = -0.03; Mag.prepare([mag]);
  near(Mag.emfMoving(mag, coil, 1.0), 2 * Mag.emfMoving(mag, coil, 0.5), 1e-12, 'ε ∝ vitesse');
  // ordre de grandeur réaliste : quelques dizaines de mV à 0,5 m/s
  ok(peakPos > 0.01 && peakPos < 1, 'ε crête réaliste (10 mV à 1 V)', peakPos);
  // Lenz : nord qui approche par la gauche (vers +x) → Λ augmente → ε < 0 → courant induit horaire vu de +x
  // → son champ au centre de la bobine pointe vers −x : il s'oppose à l'augmentation.
  mag.x = -0.04; Mag.prepare([mag]);
  const e = Mag.emfMoving(mag, coil, 0.5);
  ok(e < 0, 'Lenz : flux qui augmente → ε < 0');
  const induit = { kind: 'spire', I: e / 1.0, a: coil.b, x: coil.x, y: 0 };
  ok(Mag.fieldAt([induit], coil.x, 0).bx < 0, 'Lenz : le champ du courant induit s\'oppose à la variation');
  // force sur l'aimant : le courant induit (une spire équivalente) repousse l'aimant qui approche
  // (pôles nord en face : la spire induite présente son nord vers la gauche)
  const fx = Mag.fieldAt([induit], mag.x + mag.L / 2 + 0.002, 0).bx;
  ok(fx < 0, 'Lenz : nord induit face au nord de l\'aimant (répulsion)');
  // flux uniforme
  near(Mag.linkage([{ kind: 'uniforme', bx: 0.2, by: 0 }], { N: 10, b: 0.1, x: 0, y: 0, L: 0 }), 10 * 0.2 * PI * 0.01, 1e-12, 'flux uniforme : Λ = N B πb²');
}

// --- Génératrice
{
  const p = { N: 200, B: 0.2, A: 0.01, omega: 2 * PI * 50 };
  near(Math.max(...Array.from({ length: 1000 }, (_, i) => Mag.generator(p, i * 2e-5).emf)), 125.66, 1e-3, 'génératrice : ε crête = N B A ω ≈ 126 V');
  const t = 0.0037, h = 1e-7;
  near(Mag.generator(p, t).emf, -(Mag.generator(p, t + h).lam - Mag.generator(p, t - h).lam) / (2 * h), 1e-6, 'génératrice : ε = −dΛ/dt');
  ok(Math.abs(Mag.generator(p, 0).emf) < 1e-12, 'génératrice : ε nul quand le flux est maximal');
}

// --- Deux bobines (Faraday 1831)
{
  const c1 = { N: 300, b: 0.02, x: 0, y: 0, L: 0.04 }, c2 = { N: 300, b: 0.02, x: 0.05, y: 0, L: 0.04 };
  const M = Mag.mutualCoils(c1, c2), L1 = Mag.inductance(c1);
  ok(M > 0 && M < L1, 'mutuelle positive et plus petite que l\'inductance propre', M + ' ' + L1);
  near(Mag.mutualCoils(c1, c2), Mag.mutualCoils(c2, c1), 0.02, 'mutuelle réciproque (à la discrétisation près)');
  near(L1, MU0 * 300 * 300 * PI * 4e-4 / (0.04 + 0.018), 1e-12, 'Wheeler');
  const p = { V0: 6, R1: 10, L1: L1, M: M, ton: 0.1, toff: 1 };
  ok(Mag.faradayPair(p, 0.05).emf2 === 0, 'interrupteur ouvert : rien');
  ok(Mag.faradayPair(p, 0.1).emf2 < 0, 'à la fermeture : ε2 opposée');
  ok(Math.abs(Mag.faradayPair(p, 0.9).emf2) < 1e-12, 'courant établi : ε2 = 0 (le courant est là, il ne varie plus)');
  ok(Mag.faradayPair(p, 1.0000001).emf2 > 0, 'à l\'ouverture : ε2 de l\'autre signe');
  near(Mag.faradayPair(p, 0.9).I1, 0.6, 1e-9, 'primaire : I = V0 / R1 une fois établi');
}

// --- Rails : terminal, bilan d'énergie
{
  const p = { B: 0.5, ell: 0.2, R: 0.1, m: 0.05, F: 0.2 };
  const r = Mag.rails(p);
  near(r.tau, 0.5, 1e-12, 'rails : τ = mR / B²ℓ²'); near(r.vT, 2, 1e-12, 'rails : v_lim = FR / B²ℓ²');
  const s = { x: 0, v: 0, W: 0, Q: 0 };
  for (let i = 0; i < 300; i++) Mag.dragStep(s, { m: p.m, F: p.F, k: r.k }, 1 / 60);
  near(s.W, 0.5 * p.m * s.v * s.v + s.Q, 1e-10, 'rails : travail = énergie cinétique + chaleur');
  near(s.v, 2 * (1 - Math.exp(-5 / 0.5)), 1e-9, 'rails : v(t) exact');
  const st = Mag.railsState(p, 2);
  near(st.Pjoule, st.Pmeca, 1e-12, 'rails : en régime limite, P mécanique = P Joule');
  ok(st.Ffrein < 0, 'rails : la force induite s\'oppose au mouvement');
  near(st.emf, 0.2, 1e-12, 'rails : ε = B ℓ v');
  // poussée puis lâchée : l'énergie cinétique devient entièrement chaleur
  const s2 = { x: 0, v: 3, W: 0, Q: 0 };
  for (let i = 0; i < 600; i++) Mag.dragStep(s2, { m: p.m, F: 0, k: r.k }, 1 / 60);
  near(s2.Q, 0.5 * p.m * 9, 1e-6, 'rails lancés : ½mv² → chaleur');
  near(s2.x, 3 * 0.5, 1e-6, 'rails lancés : distance d\'arrêt = v0 τ');
  // Lenz inversé (expérience de pensée) : la tige s'emballe, le bilan W = K + Q tient avec Q < 0
  const s3 = { x: 0, v: 0.1, W: 0, Q: 0 };
  for (let i = 0; i < 60; i++) Mag.dragStep(s3, { m: p.m, F: 0, k: -r.k }, 1 / 60);
  ok(s3.v > 0.1 * Math.exp(1.9) && s3.Q < 0, 'Lenz inversé : la vitesse croît sans travail fourni', s3.v);
  ok(Math.abs(0.5 * p.m * (s3.v * s3.v - 0.01) + s3.Q) < 1e-12 * Math.abs(s3.Q), 'Lenz inversé : énergie créée = −Q', s3.Q);
  // circuit ouvert : aucun freinage
  ok(Mag.rails(Object.assign({}, p, { open: true })).k === 0, 'circuit ouvert : pas de freinage');
}

// --- Aimant dans un tube
{
  const mag = { kind: 'aimant', Br: 1.2, a: 0.006, L: 0.012, x: 0, y: 0, dir: 1 };
  const m = Mag.magnetMass(mag);
  near(m, 7500 * PI * 0.006 * 0.006 * 0.012, 1e-12, 'masse de l\'aimant');
  const kCu = Mag.tubeBrake(mag, { b: 0.0075, w: 0.0015, rho: Mag.RHO.cuivre });
  const kAl = Mag.tubeBrake(mag, { b: 0.0075, w: 0.0015, rho: Mag.RHO.aluminium });
  const vCu = m * Mag.G / kCu, vAl = m * Mag.G / kAl;
  ok(vCu > 0.005 && vCu < 0.2, 'tube de cuivre : vitesse limite de quelques cm/s', (vCu * 100).toFixed(2) + ' cm/s');
  near(vAl / vCu, Mag.RHO.aluminium / Mag.RHO.cuivre, 1e-9, 'aluminium : v_lim ∝ résistivité');
  ok(Mag.tubeBrake(mag, { b: 0.0075, w: 0.0015, rho: Mag.RHO.cuivre, fendu: true }) === 0, 'tube fendu : pas de courant qui fait le tour');
  ok(Mag.tubeBrake(mag, { b: 0.0075, w: 0, rho: 0 }) === 0, 'tube isolant : chute libre');
  const k2 = Mag.tubeBrake(mag, { b: 0.0075, w: 0.003, rho: Mag.RHO.cuivre });
  ok(k2 > kCu, 'paroi plus épaisse : freinage plus fort');
  const s = { x: 0, v: 0, W: 0, Q: 0 };
  for (let i = 0; i < 600; i++) Mag.dragStep(s, { m: m, F: m * Mag.G, k: kCu }, 1 / 60);
  near(s.v, vCu, 1e-6, 'aimant : atteint sa vitesse limite');
  near(s.W, 0.5 * m * s.v * s.v + s.Q, 1e-9, 'aimant : énergie potentielle perdue = cinétique + chaleur');
  // profil : anneaux devant et derrière l'aimant de signes opposés (courants de Foucault en sens inverses)
  const prof = Mag.ringProfile(mag, { b: 0.0075, w: 0.0015 }, 41, 0.03);
  ok(prof.length === 41 && prof[10].dphi > 0 && prof[30].dphi < 0, 'profil : dΦ/dz change de signe de part et d\'autre de l\'aimant');
  near(prof[20].phi, Math.max(...prof.map(q => q.phi)), 1e-9, 'profil : flux maximal au centre de l\'aimant');
  // cohérence : k = (w / 2π b ρ) ∫ dphi² dz
  const pr = Mag.ringProfile(mag, { b: 0.0075, w: 0.0015 }, 1201, 12 * 0.00825);
  let ig = 0; for (let i = 1; i < pr.length; i++) ig += 0.5 * (pr[i].dphi ** 2 + pr[i - 1].dphi ** 2) * (pr[i].dz - pr[i - 1].dz);
  near(0.0015 / (2 * PI * 0.00825 * Mag.RHO.cuivre) * ig, kCu, 5e-3, 'profil et freinage cohérents');
  console.log('  (info) aimant Ø12 × 12 mm, 1,2 T : tube de cuivre Ø15/18 mm → ' + (vCu * 100).toFixed(1) + ' cm/s ; aluminium → ' + (vAl * 100).toFixed(1) + ' cm/s ; chute libre de 1 m : 0,45 s ; dans le cuivre : ' + (1 / vCu).toFixed(1) + ' s');
}

console.log(pass + ' réussis, ' + fail + ' échoués');
process.exit(fail ? 1 : 0);
