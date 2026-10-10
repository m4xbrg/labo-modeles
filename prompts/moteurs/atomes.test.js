// Tests du moteur « Atomes, noyaux et lumière ».
// node prompts/moteurs/atomes.test.js            → teste prompts/moteurs/atomes.js
// node prompts/moteurs/atomes.test.js page.html  → teste le bloc ATOM-BEGIN … ATOM-END copié dans la page (et vérifie qu'il est identique)
'use strict';
const fs = require('fs');
const path = require('path');

const REF = path.join(__dirname, 'atomes.js');
const target = process.argv[2] || REF;
const extract = src => { const i0 = src.indexOf('/* ATOM-BEGIN */'), i1 = src.indexOf('/* ATOM-END */'); return i0 < 0 || i1 < 0 ? null : src.slice(i0, i1 + '/* ATOM-END */'.length); };
const block = extract(fs.readFileSync(target, 'utf8'));
if (!block) { console.error('Marqueurs ATOM-BEGIN / ATOM-END introuvables dans ' + target); process.exit(1); }
if (target !== REF && fs.existsSync(REF) && extract(fs.readFileSync(REF, 'utf8')) !== block) { console.error('ÉCHEC : le bloc de la page diffère du moteur de référence.'); process.exit(1); }
const Atom = new Function(block + '\nreturn Atom;')();

let pass = 0, fail = 0;
function ok(cond, name, info) { if (cond) pass++; else { fail++; console.log('ÉCHEC  ' + name + (info !== undefined ? '  (' + info + ')' : '')); } }
function near(a, b, rel, name) { const e = Math.abs(a - b) / Math.max(Math.abs(b), 1e-300); ok(e <= rel, name, a + ' vs ' + b + ', écart rel. ' + e.toExponential(2)); }
function nearAbs(a, b, tol, name) { ok(Math.abs(a - b) <= tol, name, a + ' vs ' + b); }
const DEG = Math.PI / 180, YEAR = Atom.YEAR, DAY = 86400;

// ---------- 1. Rutherford : énergie, angle, distance minimale
for (const [E, Z, b] of [[5, 79, 0], [5, 79, 5], [5, 79, 20], [5, 79, 60], [5, 79, 300], [2, 79, 40], [8, 79, 10], [5, 13, 8]]) {
  const t = Atom.rutherfordTraj(E, Z, b);
  ok(t.dEmax < 1e-6, `énergie conservée à 1e-6 (E=${E}, Z=${Z}, b=${b})`, t.dEmax.toExponential(2));
  const th = Atom.rutherfordAngle(E, Z, b);
  near(t.theta, th, 0.005, `angle numérique = 2 arctan(d/2b) à 0,5 % (E=${E}, Z=${Z}, b=${b})`);
  near(t.rmin, Atom.rMin(E, Z, b), 1e-3, `distance minimale numérique = analytique (b=${b})`);
  ok(t.pts.length > 20, 'trajectoire dessinable : points gardés près du noyau', t.pts.length);
}
nearAbs(Atom.closestApproach(5, 79), 45.5, 0.05, 'distance minimale frontale, α de 5 MeV sur l’or : 45,5 fm');
near(Atom.rutherfordAngle(5, 79, Atom.impactForAngle(5, 79, 1.2)), 1.2, 1e-12, 'impactForAngle inverse rutherfordAngle');
nearAbs(Atom.rutherfordTraj(5, 79, 0).theta, Math.PI, 1e-6, 'tir frontal : la particule revient (θ = 180°)');
ok(Atom.nuclearRadius(197) > 6.9 && Atom.nuclearRadius(197) < 7.1, 'rayon du noyau d’or ≈ 7 fm', Atom.nuclearRadius(197));
{ const ratio = Atom.R_AU / Atom.nuclearRadius(197); ok(ratio > 1e4 && ratio < 1e5, 'atome 10⁴ à 10⁵ fois plus grand que son noyau', ratio); }

// ---------- 2. Histogramme de 200 000 tirs ; Thomson
{
  const rng = Atom.mulberry32(12345), E = 5, Z = 79, n = 200000, bmax = 6 * Atom.closestApproach(E, Z);
  const edges = []; for (let a = 10; a <= 150; a += 10) edges.push(a * DEG);
  const cnt = new Array(edges.length - 1).fill(0);
  for (let i = 0; i < n; i++) {
    const s = Atom.shot(E, Z, 'rutherford', rng, bmax);
    for (let j = 0; j < cnt.length; j++) if (s.theta >= edges[j] && s.theta < edges[j + 1]) { cnt[j]++; break; }
  }
  let chi2 = 0, dof = 0; const shape = [];
  for (let j = 0; j < cnt.length; j++) {
    const ex = Atom.expectedCount(n, E, Z, edges[j], edges[j + 1], bmax);
    chi2 += (cnt[j] - ex) * (cnt[j] - ex) / ex; dof++;
    // dN/dΩ × sin⁴(θ/2) doit être constant : forme 1/sin⁴(θ/2)
    const dOm = 2 * Math.PI * (Math.cos(edges[j]) - Math.cos(edges[j + 1]));
    const thc = 0.5 * (edges[j] + edges[j + 1]);
    shape.push({ k: cnt[j] / dOm * Math.pow(Math.sin(thc / 2), 4), c: cnt[j] });
  }
  ok(chi2 / dof < 2.5, 'histogramme 10°–150° conforme au comptage attendu (χ²/ddl raisonnable)', (chi2 / dof).toFixed(2));
  // forme : comparer chaque tranche de 10° à la loi exacte intégrée sur la tranche plutôt qu'au centre
  let worst = 0;
  for (let j = 0; j < cnt.length; j++) {
    let I = 0; const m = 200; for (let i = 0; i < m; i++) { const th = edges[j] + (i + 0.5) * (edges[j + 1] - edges[j]) / m; I += Math.sin(th) / Math.pow(Math.sin(th / 2), 4); }
    I *= 2 * Math.PI * (edges[j + 1] - edges[j]) / m;
    const k = cnt[j] / I; shape[j].k2 = k;
  }
  const kref = shape.reduce((s, x) => s + x.c, 0) / shape.reduce((s, x) => s + x.c / x.k2, 0);
  for (const x of shape) { const z = Math.abs(x.k2 / kref - 1) * Math.sqrt(x.c); if (z > worst) worst = z; }
  ok(worst < 4, 'dN/dΩ ∝ 1/sin⁴(θ/2) : chaque tranche à moins de 4 σ de la loi', worst.toFixed(2));
  ok(cnt[cnt.length - 1] > 50, 'assez de tirs dans la dernière tranche (140°–150°) pour juger', cnt[cnt.length - 1]);
}
{
  const rng = Atom.mulberry32(777); let maxTh = 0;
  for (let i = 0; i < 200000; i++) { const s = Atom.shot(5, 79, 'thomson', rng); if (s.theta > maxTh) maxTh = s.theta; }
  ok(maxTh < 1 * DEG, 'Thomson : aucune déviation au-delà de 1° sur 200 000 tirs', (maxTh / DEG).toExponential(2) + '°');
  let maxTh2 = 0; const rng2 = Atom.mulberry32(3);
  for (let i = 0; i < 200000; i++) { const s = Atom.shot(2, 79, 'thomson', rng2); if (s.theta > maxTh2) maxTh2 = s.theta; }
  ok(maxTh2 < 1 * DEG, 'Thomson : aucune déviation au-delà de 1°, même à 2 MeV', (maxTh2 / DEG).toExponential(2) + '°');
}
{ // sur la planche (disque de 1 000 fm) : des retours existent, rares
  const rng = Atom.mulberry32(99); let back = 0; for (let i = 0; i < 10000; i++) if (Atom.shot(5, 79, 'rutherford', rng).theta > Math.PI / 2) back++;
  ok(back >= 1 && back <= 20, 'planche : quelques α reviennent (> 90°) sur 10 000 tirs à 5 MeV', back);
  near(Atom.expectedCount(10000, 5, 79, Math.PI / 2, Math.PI), 10000 * Math.pow(Atom.closestApproach(5, 79) / 2 / Atom.B_DISPLAY, 2), 1e-9, 'fraction attendue au-delà de 90° = (d/2 bmax)²');
}

// ---------- 3. ⁴He : défaut de masse
{
  const nu = Atom.byId('4He');
  const dm = 2 * Atom.M_H_U + 2 * Atom.M_N_U - Atom.atomicMass(nu.Z, nu.N);
  nearAbs(dm, 0.03038, 0.000005, '⁴He : défaut de masse 0,030 38 u');
  nearAbs(dm * Atom.U_MEV, 28.30, 0.006, '⁴He : 28,30 MeV');
  nearAbs(Atom.bindingMeasured(2, 2), 28.30, 0.006, '⁴He : énergie de liaison par les excès de masse = 28,30 MeV');
  nearAbs(Atom.bindingMeasured(2, 2) / 4, 7.07, 0.005, '⁴He : B/A = 7,07 MeV');
  nearAbs(Atom.bindingMeasured(1, 1), 2.2246, 0.0005, '²H : B = 2,2246 MeV');
}

// ---------- 4. semf et courbe mesurée
for (const [id, BA] of [['56Fe', 8.790], ['120Sn', 8.504], ['208Pb', 7.867], ['238U', 7.570]]) {
  const nu = Atom.byId(id);
  near(Atom.semf(nu.Z, nu.A) / nu.A, BA, 0.015, `semf : B/A de ${id} à 1,5 %`);
  nearAbs(Atom.BA_DATA.find(b => b.id === id).BA, BA, 0.001, `BA_DATA : B/A mesurée de ${id}`);
}
{
  const best = Atom.BA_DATA.reduce((a, b) => b.BA > a.BA ? b : a);
  ok(best.A >= 56 && best.A <= 62, 'maximum de la courbe mesurée vers A ≈ 56 à 62', best.id);
  ok(Atom.BA_DATA.length >= 20, 'BA_DATA : une vingtaine de repères', Atom.BA_DATA.length);
  for (const id of ['2H', '3He', '4He', '6Li', '12C', '16O', '20Ne', '40Ca', '56Fe', '62Ni', '90Zr', '120Sn', '197Au', '208Pb', '235U', '238U'])
    ok(Atom.BA_DATA.some(b => b.id === id), 'BA_DATA contient ' + id);
  // vallée de stabilité : Z du fond de vallée proche des nucléides stables
  for (const [A, Zs] of [[56, 26], [120, 50], [208, 82], [27, 13], [238, 92]]) nearAbs(Atom.valleyZ(A), Zs, 1.6, `fond de vallée semf à A = ${A}`);
}
{ // bilans de réaction
  nearAbs(Atom.reaction('dt').Q, 17.59, 0.01, 'Q de ²H + ³H → ⁴He + n = 17,59 MeV');
  nearAbs(Atom.reaction('alpha3').Q, 7.275, 0.002, 'Q de 3 ⁴He → ¹²C = 7,27 MeV');
  nearAbs(Atom.reaction('fission').Q, 173.3, 0.3, 'Q de ²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3 n ≈ 173 MeV');
  ok(Atom.reaction('fefe').Q < 0, 'fusionner deux noyaux de fer coûte de l’énergie', Atom.reaction('fefe').Q);
  for (const k in Atom.REACTIONS) ok(Atom.reaction(k).conserved, 'charge et nombre de nucléons conservés : ' + k);
  const r = Atom.reaction('dt');
  near(r.perKg, 3.37e14, 0.01, 'fusion D-T : ≈ 3,4 × 10¹⁴ J par kilogramme');
  near(r.dm * Atom.U_MEV, r.Q, 1e-6, 'Q = Δm c²');
  ok(r.vsMethane > 1e6 && r.vsMethane < 1e7, 'fusion D-T : quelques millions de fois le méthane', r.vsMethane.toExponential(2));
  near(Atom.qZN([[1, 1], [1, 1]], [[2, 2]]).Q, 23.85, 0.002, 'qZN : ²H + ²H → ⁴He = 23,85 MeV');
}

// ---------- 5. Table des nucléides
const T = id => Atom.byId(id);
for (const id of ['12C', '13C', '14N', '16O', '56Fe', '4He', '1H', '2H']) ok(T(id) && T(id).mode === 'stable', id + ' stable');
const chk = (id, mode, hl, rel, name) => { const n = T(id); ok(n && n.mode === mode, name + ' : mode ' + mode, n && n.mode); if (n) near(n.halfLife, hl, rel, name + ' : demi-vie'); };
chk('14C', 'b-', 5700 * YEAR, 0.01, '¹⁴C β⁻ 5 700 a');
chk('3H', 'b-', 12.32 * YEAR, 0.01, '³H β⁻ 12,32 a');
chk('18F', 'b+', 109.7 * 60, 0.01, '¹⁸F β⁺ 109,7 min');
chk('60Co', 'b-', 5.27 * YEAR, 0.01, '⁶⁰Co β⁻ 5,27 a');
chk('131I', 'b-', 8.02 * DAY, 0.01, '¹³¹I β⁻ 8,02 j');
chk('222Rn', 'a', 3.82 * DAY, 0.01, '²²²Rn α 3,82 j');
chk('238U', 'a', 4.47e9 * YEAR, 0.01, '²³⁸U α 4,47 × 10⁹ a');
{ const n = T('8Be'); ok(n && n.mode === 'a' && n.halfLife < 1e-15 && n.halfLife > 1e-17, '⁸Be instable (α, ≈ 10⁻¹⁶ s)', n && n.halfLife); }
{
  // tous les stables de Z = 1 à 26 (nombre attendu : 4 (H, He) ... ; Fe a 4 stables)
  const stab = Z => Atom.NUCLIDES.filter(n => n.Z === Z && n.mode === 'stable').map(n => n.A).join(',');
  ok(stab(26) === '54,56,57,58', 'fer : 4 isotopes stables', stab(26));
  ok(stab(6) === '12,13', 'carbone : 2 isotopes stables', stab(6));
  ok(stab(20) === '40,42,43,44,46', 'calcium : 5 stables (⁴⁸Ca, 6 × 10¹⁹ a, compté instable)', stab(20));
  ok(!Atom.NUCLIDES.some(n => n.Z === 43 || n.Z === 61), 'pas d’élément hors table');
  const nZ = Atom.NUCLIDES.filter(n => n.Z >= 1 && n.Z <= 26);
  ok(nZ.every(n => n.mode === 'stable' || n.halfLife > 1e-3 || n.A === 8), 'Z ≤ 26 : seulement des stables ou des demi-vies > 1 ms (sauf ⁸Be)');
  ok(nZ.filter(n => n.mode === 'stable').length === 61, 'Z ≤ 26 : 61 nucléides stables', nZ.filter(n => n.mode === 'stable').length);
  ok(nZ.length > 300, 'Z ≤ 26 : plus de 300 nucléides', nZ.length);
  ok(T('40K').mode === 'b-' && T('40K').halfLife > 1e9 * YEAR, '⁴⁰K radioactif à très longue demi-vie');
  ok(Atom.nuclide(6, 8) === T('14C') && Atom.nuclide(6, 30) === null, 'nuclide(Z, N) : recherche et absence');
  ok(T('14C').label === '¹⁴C' && T('14C').name === 'carbone', 'étiquette et nom');
  for (const id of ['218Po', '131Xe', '60Ni', '14N', '3He', '18O']) ok(!!T(id), 'fils présent dans la table : ' + id);
  // toute entrée de mode connu
  ok(Atom.NUCLIDES.every(n => ['stable', 'b-', 'b+', 'a', 'p', 'n'].includes(n.mode)), 'modes dans {stable, β⁻, β⁺/CE, α, p, n}');
  // les nucléides riches en neutrons sont β⁻, riches en protons β⁺
  ok(T('16C').mode === 'b-' && T('9C').mode === 'b+', 'excès de neutrons → β⁻ ; excès de protons → β⁺');
}

// ---------- 6. transmute
{
  const a = Atom.transmute(6, 8, 'b-'); ok(a.Z === 7 && a.N === 7, 'β⁻ : (Z+1, N−1)');
  const b = Atom.transmute(9, 9, 'b+'); ok(b.Z === 8 && b.N === 10, 'β⁺ : (Z−1, N+1)');
  const c = Atom.transmute(86, 136, 'a'); ok(c.Z === 84 && c.N === 134, 'α : (Z−2, N−2)');
  ok(a.Z + a.N === 14 && b.Z + b.N === 18, 'A conservé en β');
  ok(Atom.byId('14N').Z === a.Z, '¹⁴C → ¹⁴N');
  ok(Atom.nuclide(c.Z, c.N).id === '218Po', '²²²Rn → ²¹⁸Po');
}
// désintégration : statistique et absence de mémoire
{
  const rng = Atom.mulberry32(42), hl = 10, dt = 0.05; let n = 100000, t = 0;
  while (t < hl - 1e-9) { n -= Atom.decaySample(n, hl, rng, dt); t += dt; }
  near(n, 50000, 0.01, 'decaySample : la moitié reste après une demi-vie (100 000 noyaux)');
  near(Atom.decayProb(hl, dt), 1 - Math.pow(2, -dt / hl), 1e-12, 'probabilité par pas');
  // sans mémoire : parmi ceux qui ont survécu 3 demi-vies, la moitié survit à la suivante
  const rng2 = Atom.mulberry32(7); let old = 0, oldNext = 0;
  for (let i = 0; i < 200000; i++) { const life = -Math.log(1 - rng2()) / Atom.decayConst(hl); if (life > 3 * hl) { old++; if (life > 4 * hl) oldNext++; } }
  near(oldNext / old, 0.5, 0.03, 'sans mémoire : un noyau vieux de trois demi-vies a toujours une chance sur deux');
}
// écrans
{
  ok(Atom.attenuate('alpha', 'papier') === 0, 'α arrêtée par une feuille de papier');
  ok(Atom.attenuate('beta', 'papier') > 0.5, 'β traverse le papier', Atom.attenuate('beta', 'papier'));
  ok(Atom.attenuate('beta', 'aluminium') === 0, 'β arrêtée par 5 mm d’aluminium');
  ok(Atom.attenuate('gamma', 'aluminium') > 0.85, 'γ traverse l’aluminium', Atom.attenuate('gamma', 'aluminium'));
  const g = Atom.attenuate('gamma', 'plomb'); ok(g > 0.01 && g < 0.06, 'γ : quelques % passent 5 cm de plomb', g);
  near(Atom.attenuate('gamma', 'plomb', 0.1), g * g, 1e-9, 'γ : atténuation exponentielle (deux épaisseurs = carré)');
}

// ---------- 7. Hydrogène
{
  const a = Atom.hLine(2, 3); nearAbs(a.air, 656.28, 0.02, 'Hα 656,28 nm dans l’air'); nearAbs(a.vac, 656.47, 0.02, 'Hα 656,47 nm dans le vide');
  nearAbs(Atom.hLine(2, 4).air, 486.13, 0.02, 'Hβ 486,13 nm');
  nearAbs(Atom.hLine(2, 5).air, 434.05, 0.02, 'Hγ 434,05 nm');
  nearAbs(Atom.hLine(2, 6).air, 410.17, 0.02, 'Hδ 410,17 nm');
  nearAbs(-Atom.hLevel(1), 13.6, 0.01, 'énergie d’ionisation 13,6 eV');
  nearAbs(Atom.hLevel(2), -3.40, 0.005, 'E₂ = −3,40 eV');
  near(Atom.hLine(2, 3).E, Atom.hLevel(3) - Atom.hLevel(2), 2e-4, 'hf = E₃ − E₂ (raies et niveaux cohérents)');
  nearAbs(Atom.hLine(1, 2).vac, 121.57, 0.02, 'Lyman α 121,57 nm');
  ok(Atom.LINES.H.length === 4 && Math.abs(Atom.LINES.H[0].nm - 656.28) < 0.01, 'LINES.H : série de Balmer visible');
  for (const g of Atom.GASES) ok(Atom.LINES[g].every(l => l.nm >= 380 && l.nm <= 750) && Atom.LINES[g].some(l => l.I === 100), 'LINES.' + g + ' : visibles, intensité max 100');
  ok(Atom.LINES.Na.filter(l => l.g).length === 2, 'sodium : les deux raies D partent du fondamental');
  nearAbs(Atom.LINES.Na.find(l => l.I === 100).nm, 589.0, 0.05, 'raie D du sodium 589,0 nm');
  nearAbs(Atom.LINES.He.find(l => l.I === 100).nm, 587.56, 0.01, 'raie D3 de l’hélium 587,56 nm');
  nearAbs(Atom.LINES.Hg.find(l => l.I === 100).nm, 435.83, 0.01, 'mercure 435,83 nm');
  nearAbs(Atom.LINES.Ne.find(l => l.I === 100).nm, 640.22, 0.01, 'néon 640,22 nm');
  // cascade
  const rng = Atom.mulberry32(5); let to2 = 0, n = 20000;
  for (let i = 0; i < n; i++) if (Atom.hDecay(3, rng).to === 2) to2++;
  near(to2 / n, 4.4101e7 / (4.4101e7 + 5.5751e7), 0.03, 'cascade depuis n = 3 : branchement selon les coefficients A');
  const d = Atom.hDecay(2, rng); ok(d.to === 1 && d.t > 0 && d.t < 1e-6, '2 → 1 en quelques nanosecondes');
  const m = Atom.mystery(Atom.mulberry32(9)); ok(m.length >= 2 && m.length <= 3 && new Set(m).size === m.length, 'gaz mystère : 2 ou 3 gaz distincts');
  const c = Atom.visibleColor(650); ok(c[0] > 200 && c[1] < 60 && c[2] === 0, 'visibleColor : 650 nm rouge'); ok(Atom.visibleColor(300) === null, 'visibleColor : 300 nm hors du visible');
}

// ---------- 8. absorb
{
  const r1 = Atom.absorb(10.2); ok(r1.type === 'absorb' && r1.to === 1, 'photon de 10,2 eV absorbé (1 → 2)');
  const r2 = Atom.absorb(11.0); ok(r2.type === 'pass', 'photon de 11,0 eV : passe');
  const r3 = Atom.absorb(14); ok(r3.type === 'ionize', '14 eV : ionisation'); nearAbs(r3.Ekin, 0.4, 0.01, '14 eV : électron libre de 0,4 eV');
  const r4 = Atom.absorb(1.89, Atom.H_LEVELS, 0.03, 1); ok(r4.type === 'absorb' && r4.to === 2, 'depuis n = 2 : Hα (1,89 eV) absorbé');
  const r5 = Atom.absorb(12.09); ok(r5.type === 'absorb' && r5.to === 2, '12,09 eV : 1 → 3');
}

// ---------- 9. Effet photoélectrique
{
  nearAbs(Atom.WORK.Na, 2.28, 1e-9, 'W(Na) = 2,28 eV');
  const p = Atom.photo(400, 'Na'); nearAbs(p.Kmax, 0.82, 0.01, 'sodium, 400 nm : Kmax ≈ 0,82 eV'); nearAbs(p.Vstop, 0.82, 0.01, 'tension d’arrêt 0,82 V');
  const q = Atom.photo(600, 'Na'); nearAbs(q.Eph, 2.07, 0.01, '600 nm : photon de 2,07 eV'); ok(!q.emits, '600 nm sur le sodium : aucune émission');
  for (const P of [1e-9, 1e-6, 1e-3, 1, 1e3]) ok(Atom.ejectionRate(P, 600, 'Na') === 0, 'aucune émission sous le seuil, puissance ' + P + ' W');
  const v1 = Atom.photo(250, 'Zn').Vstop, v2 = Atom.photo(200, 'Zn').Vstop;
  near((v2 - v1) / (Atom.photo(200, 'Zn').f - Atom.photo(250, 'Zn').f), 4.136e-15, 1e-3, 'pente V_arrêt(f) = h/e = 4,136 × 10⁻¹⁵ V·s');
  near((Atom.photo(300, 'Na').Vstop - Atom.photo(400, 'Na').Vstop) / (Atom.photo(300, 'Na').f - Atom.photo(400, 'Na').f), 4.136e-15, 1e-3, 'pente identique pour le sodium');
  near(Atom.ejectionRate(2e-6, 400, 'Na'), 2 * Atom.ejectionRate(1e-6, 400, 'Na'), 1e-12, 'intensité doublée : deux fois plus d’électrons');
  near(Atom.photo(400, 'Na').Kmax, Atom.photo(400, 'Na').Kmax, 0, 'intensité doublée : Kmax inchangée');
  ok(Atom.current(1e-6, 400, 'Na', 0.9) === 0 && Atom.current(1e-6, 400, 'Na', 0) > 0, 'courant nul au-delà de la tension d’arrêt');
  nearAbs(Atom.photo(1, 'Cu').lambda0, 263.8, 0.2, 'seuil du cuivre ≈ 264 nm');
}

console.log(`${pass} réussis, ${fail} échoués`);
process.exit(fail ? 1 : 0);
