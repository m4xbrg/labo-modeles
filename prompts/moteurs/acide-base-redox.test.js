// Tests du moteur « Acide-base, redox et électrochimie » (Fondations 31).
// node prompts/moteurs/acide-base-redox.test.js            → teste prompts/moteurs/acide-base-redox.js
// node prompts/moteurs/acide-base-redox.test.js page.html  → teste le bloc ELC-BEGIN … ELC-END copié dans la page,
//                           et vérifie qu'il est identique au moteur de référence.
'use strict';
const fs = require('fs');
const path = require('path');

const REF = path.join(__dirname, 'acide-base-redox.js');
const target = process.argv[2] || REF;
const M0 = '/* ELC-BEGIN */', M1 = '/* ELC-END */';
const extract = src => { const i0 = src.indexOf(M0), i1 = src.indexOf(M1); return i0 < 0 || i1 < 0 ? null : src.slice(i0, i1 + M1.length); };
const block = extract(fs.readFileSync(target, 'utf8'));
if (!block) { console.error('Marqueurs ELC-BEGIN / ELC-END introuvables dans ' + target); process.exit(1); }
if (target !== REF && fs.existsSync(REF) && extract(fs.readFileSync(REF, 'utf8')) !== block) {
  console.error('ÉCHEC : le bloc de la page diffère du moteur de référence.'); process.exit(1);
}
const Elc = new Function(block + '\nreturn Elc;')();

let pass = 0, fail = 0;
function ok(cond, name, info) {
  if (cond) pass++;
  else { fail++; console.log('ÉCHEC  ' + name + (info !== undefined ? '  (' + info + ')' : '')); }
}
const within = (a, b, tol, name) => ok(Math.abs(a - b) <= tol, name, a + ' vs ' + b + ' ± ' + tol);
const near = (a, b, rel, name) => ok(Math.abs(a - b) <= rel * Math.abs(b), name, a + ' vs ' + b + ', ' + (Math.abs(a - b) / Math.abs(b) * 100).toFixed(3) + ' %');

// Électroneutralité recomptée espèce par espèce à partir de species (indépendant de chargeAt).
function neutral(r, name) {
  const s = r.species;
  let q = s.H3O - s.OH + s.Na - s.Cl;
  for (const k in s.pairs) { const p = s.pairs[k]; q += p.zA * p.HA + (p.zA - 1) * p.A; }
  ok(Math.abs(q) <= 1e-12, 'électroneutralité · ' + name, q.toExponential(2) + ' mol/L');
  ok(Math.abs(s.H3O * s.OH - Elc.KW) <= 1e-9 * Elc.KW, 'Kw · ' + name);
  for (const k in s.pairs) {
    const p = s.pairs[k];
    ok(p.HA >= 0 && p.A >= 0 && Math.abs(p.HA + p.A - p.CT) <= 1e-12 * Math.max(1, p.CT), 'conservation du couple ' + k + ' · ' + name);
    near(s.H3O * p.A / p.HA, Elc.Ka(k), 1e-9, 'Ka vérifiée · ' + k + ' · ' + name);
  }
}
const solved = [];
const S = (b, name) => { const r = Elc.solve(b); solved.push([r, name]); return r; };

// 1. Acide fort, échelle logarithmique, l'eau compte
within(S(Elc.strongAcid(0.10), 'HCl 0,10').pH, 1.00, 0.005, '1 · HCl 0,10 mol/L → pH 1,00');
within(S(Elc.strongAcid(1e-3), 'HCl 10⁻³').pH, 3.00, 0.005, '1 · HCl 10⁻³ mol/L → pH 3,00');
within(S(Elc.strongAcid(1e-8), 'HCl 10⁻⁸').pH, 6.98, 0.005, '1 · HCl 10⁻⁸ mol/L → pH 6,98 (pas 8)');
ok(S(Elc.strongAcid(1e-8), 'HCl 10⁻⁸ bis').pH < 7, '1 · HCl 10⁻⁸ reste acide');
{ // dilution par dix : une unité de pH (acide fort concentré)
  let b = Elc.strongAcid(0.1, 0.1);
  const p0 = Elc.pH(b), b1 = Elc.add(b, 'NaCl', 0, 0.9), p1 = S(b1, 'HCl dilué dix fois').pH;
  within(p1 - p0, 1.00, 0.005, '1 · diluer dix fois → +1 unité de pH');
}
within(S(Elc.water(), 'eau pure').pH, 7.00, 1e-9, '1 · eau pure → pH 7');
within(S(Elc.strongBase(0.01), 'NaOH 0,01').pH, 12.00, 0.005, '1 · NaOH 10⁻² → pH 12,00');
within(S(Elc.strongBase(1e-8), 'NaOH 10⁻⁸').pH, 7.02, 0.005, '1 · NaOH 10⁻⁸ → pH 7,02');
{ const r = Elc.solve(Elc.strongAcid(0.01)); within(r.pH + r.pOH, 14, 1e-9, '1 · pH + pOH = 14'); }

// 2. Acide faible, base faible (résolution exacte)
within(S(Elc.weakAcid('acetique', 0.10), 'acétique 0,10').pH, 2.88, 0.005, '2 · acide acétique 0,10 → pH 2,88');
// L'ammoniac à 0,10 mol/L donne exactement 11,12 avec pKa = 9,25 ; le brief cite 11,13
// (formule approchée √(Kb·C), qui donne 11,125). Tolérance 0,015.
within(S(Elc.weakBase('ammonium', 0.10), 'ammoniac 0,10').pH, 11.13, 0.015, '2 · ammoniac 0,10 → pH 11,13 (11,12 exact)');
{ // un acide faible n'est pas un acide dilué : fraction ionisée
  const r = Elc.solve(Elc.weakAcid('acetique', 0.1)), p = r.species.pairs.acetique;
  ok(p.A / p.CT < 0.02, '2 · acétique 0,10 : moins de 2 % ionisé', (p.A / p.CT * 100).toFixed(2) + ' %');
  const r2 = Elc.solve(Elc.weakAcid('acetique', 1e-5)), p2 = r2.species.pairs.acetique;
  ok(p2.A / p2.CT > 0.5, '2 · acétique 10⁻⁵ : plus de la moitié ionisé');
}
S(Elc.weakAcid('ammonium', 0.1), 'NH₄Cl 0,10'); S(Elc.weakAcid('phosphate', 0.1), 'NaH₂PO₄ 0,10');
S(Elc.weakBase('phosphate', 0.1), 'Na₂HPO₄ 0,10'); S(Elc.weakAcid('carbonique', 0.03), 'H₂CO₃ 0,03');
S(Elc.weakBase('acetique', 0.1), 'acétate 0,10');
within(Elc.pH(Elc.weakBase('acetique', 0.1)), 8.88, 0.01, '2 · acétate de sodium 0,10 → pH 8,88');

// 3. Tampon
{
  const b = Elc.buffer('acetique', 0.10, 0.10, 1);
  within(S(b, 'tampon acétique').pH, 4.76, 0.005, '3 · tampon acétique 0,10 / 0,10 → pH 4,76');
  within(S(Elc.addMol(b, 'HCl', 0.01), 'tampon + HCl').pH, 4.67, 0.005, '3 · tampon + 0,01 mol HCl → pH 4,67');
  within(S(Elc.addMol(Elc.water(1), 'HCl', 0.01), 'eau + HCl').pH, 2.00, 0.005, '3 · eau pure + 0,01 mol HCl → pH 2,00');
  within(S(Elc.addMol(b, 'NaOH', 0.01), 'tampon + NaOH').pH, 4.85, 0.005, '3 · tampon + 0,01 mol NaOH → pH 4,85');
  for (const k of ['acetique', 'ammonium', 'phosphate', 'carbonique']) {
    const p = Elc.pH(Elc.bufferRatio(k, 0.2, 1, 1));
    within(p, Elc.ACIDS[k].pKa, 0.01, '3 · tampon équimolaire ' + k + ' → pH = pKa');
    within(Elc.pH(Elc.bufferRatio(k, 0.2, 10, 1)) - p, 1, 0.02, '3 · rapport base/acide ×10 → +1 (Henderson) · ' + k);
  }
}

// 4. Titrage acide acétique 25 mL 0,10 par NaOH 0,10
{
  const eq = Elc.equivalence('acetique', 0.10, 0.025, 'NaOH', 0.10);
  within(eq.Veq * 1000, 25.0, 1e-9, '4 · équivalence à 25,0 mL');
  within(eq.pHhalf, 4.76, 0.005, '4 · demi-équivalence : pH = pKa = 4,76');
  within(eq.pHeq, 8.72, 0.03, '4 · pH à l’équivalence 8,72 (à 0,03)');
  const curve = Elc.titrationCurve('acetique', 0.10, 0.025, 'NaOH', 0.10, 0.050, 200);
  let mono = true; for (let i = 1; i < curve.length; i++) if (curve[i].pH <= curve[i - 1].pH) mono = false;
  ok(mono, '4 · courbe de titrage strictement croissante');
  // la pente est maximale à l'équivalence
  let iMax = 1; for (let i = 1; i < curve.length; i++) if (curve[i].pH - curve[i - 1].pH > curve[iMax].pH - curve[iMax - 1].pH) iMax = i;
  within((curve[iMax].Vb + curve[iMax - 1].Vb) / 2 * 1000, 25, 0.25, '4 · saut de pH centré sur l’équivalence');
  S(Elc.add(Elc.weakAcid('acetique', 0.1, 0.025), 'NaOH', 0.1, 0.05), 'titrage 2× équivalence');
  within(Elc.titrate('acetique', 0.1, 0.025, 'NaOH', 0.1, 0.05), 12.52, 0.01, '4 · à 2× l’équivalence, pH 12,52');
  const hcl = Elc.equivalence('HCl', 0.1, 0.025, 'NaOH', 0.1);
  within(hcl.pHeq, 7.00, 0.005, '4 · titrage HCl : équivalence à pH 7');
  within(Elc.titrate('HCl', 0.1, 0.025, 'NaOH', 0.1, 0), 1.00, 0.005, '4 · titrage HCl : départ pH 1');
}

// 5. Électroneutralité de chaque solution résolue
for (const [r, name] of solved) neutral(r, name);

// Vue particulaire
{
  const s7 = Elc.sampleIons(7, 1e-15, 200);
  within(s7.nH, 60.2, 0.1, 'loupe 1 µm³ à pH 7 : ≈ 60 H₃O⁺');
  ok(s7.drawH === s7.drawOH && s7.k === 0, 'loupe à pH 7 : autant de H₃O⁺ que de OH⁻, 1 point = 1 ion');
  const s1 = Elc.sampleIons(1, 1e-15, 200);
  ok(s1.drawH <= 200 && s1.drawH >= 20 && s1.drawOH === 0, 'loupe à pH 1 : ≤ 200 points, aucun OH⁻ dessiné', s1.drawH + ' / ' + s1.rule);
  near(s1.drawH * s1.scale, s1.nH, 0.01, 'loupe à pH 1 : points × échelle = ions réels');
  const s2 = Elc.sampleIons(2, 1e-15, 200), s3 = Elc.sampleIons(3, 1e-15, 200);
  near(s2.nH / s3.nH, 10, 1e-9, 'loupe : une unité de pH = dix fois plus de H₃O⁺');
  const r = Elc.rng(42), r2 = Elc.rng(42); let same = true, inUnit = true;
  for (let i = 0; i < 1000; i++) { const a = r(), b = r2(); if (a !== b) same = false; if (a < 0 || a >= 1) inUnit = false; }
  ok(same && inUnit, 'générateur à graine reproductible, dans [0, 1)');
}

// 6. Réactions spontanées
ok(Elc.spontaneous('Zn', 'Cu').spont, '6 · Zn dans Cu²⁺ : spontané');
ok(!Elc.spontaneous('Cu', 'Zn').spont, '6 · Cu dans Zn²⁺ : non spontané');
ok(Elc.spontaneous('Cu', 'Ag').spont, '6 · Cu dans Ag⁺ : spontané');
ok(!Elc.spontaneous('Cu', 'Cu').spont, '6 · Cu dans Cu²⁺ : rien');
ok(!Elc.spontaneous('Ag', 'Cu').spont && Elc.spontaneous('Fe', 'Cu').spont && Elc.spontaneous('Zn', 'Pb').spont, '6 · autres couples cohérents avec l’échelle');
ok(Elc.spontaneous('Cu', 'Ag').eq === 'Cu + 2 Ag⁺ → Cu²⁺ + 2 Ag', '6 · équation Cu + 2 Ag⁺ équilibrée', Elc.spontaneous('Cu', 'Ag').eq);
ok(Elc.spontaneous('Zn', 'H').spont && !Elc.spontaneous('Cu', 'H').spont, '6 · Zn réduit H⁺, Cu non');
{
  const d = Elc.displacement('Zn', 'Cu', 0.1, 0.1, 1);
  near(d.mDeposit, 0.01 * 63.546, 1e-9, '6 · 100 mL de Cu²⁺ 0,1 : 0,635 g de cuivre déposé');
  near(d.mDissolved, 0.01 * 65.38, 1e-9, '6 · … et 0,654 g de zinc dissous');
  near(d.Q, 0.01 * 2 * Elc.F, 1e-9, '6 · … soit 1930 C d’électrons échangés');
  const a = Elc.displacement('Cu', 'Ag', 0.1, 0.1, 1);
  near(a.mDeposit / a.mDissolved, 2 * 107.868 / 63.546, 1e-9, '6 · Cu dans Ag⁺ : deux Ag pour un Cu');
  ok(Elc.displacementEq('Zn', 'Cu', 0.1) > 0.999999, '6 · Zn + Cu²⁺ : réaction quasi totale');
  ok(Elc.spontaneous('Zn', 'Cu').K > 1e36, '6 · K(Zn + Cu²⁺) ≈ 10³⁷');
  const xh = Elc.displacementEq('Pb', 'H', 0.1);
  ok(xh > 0.9 && xh < 0.999, '6 · Pb + H⁺ (ΔE° = 0,13 V) : équilibre mesurable, pas total', xh);
  ok(Elc.displacementEq('Cu', 'Zn', 0.1) === 0, '6 · Cu + Zn²⁺ : avancement nul');
}

// 7. Pile Daniell
within(Elc.cellEMF('Cu', 'Zn', { cathode: 1, anode: 1 }), 1.10, 1e-9, '7 · Daniell 1 mol/L → 1,10 V');
within(Elc.cellEMF('Cu', 'Zn', { cathode: 0.01, anode: 1 }), 1.041, 0.0005, '7 · [Cu²⁺] = 0,01, [Zn²⁺] = 1 → 1,041 V');
within(Elc.cellEMF('Ag', 'Zn'), 1.56, 1e-9, '7 · Zn/Ag → 1,56 V');
within(Elc.cellEMF('Cu', 'Fe'), 0.78, 1e-9, '7 · Fe/Cu → 0,78 V');
within(Elc.cellEMF('Ag', 'Zn', { cathode: 0.1, anode: 1 }), 1.56 - Elc.NERNST, 1e-9, '7 · Zn/Ag : [Ag⁺] au carré dans Q (n = 2)');
within(Elc.electrode('H', 1e-7), -7 * Elc.NERNST, 1e-12, '7 · électrode à hydrogène : E = −0,0592 pH');
{
  let c = Elc.cell({ cA: 1, cC: 1, VA: 0.1, VC: 0.1, mA: 20, mC: 20, Rint: 2 });
  const R = 8, dt = 60;
  let prevE = Elc.emfOf(c), mono = true, pos = true, n = 0, minU = Infinity;
  const totalQ = 0.1 * 2 * Elc.F;
  while (n < 200000) {
    c = Elc.cellStep(c, R, dt);
    n++;
    if (c.E > prevE + 1e-12) mono = false;
    if (c.cC < 0 || c.cA < 0 || c.mA < 0) pos = false;
    prevE = c.E;
    if (c.E < 1e-3) break;
  }
  ok(mono, '7 · la f.é.m. décroît de façon monotone pendant la décharge');
  ok(pos, '7 · concentrations et masses restent positives');
  ok(c.E < 1e-3, '7 · la f.é.m. tend vers 0', c.E);
  near(c.Q, totalQ, 1e-3, '7 · charge totale = tout le Cu²⁺ réduit (2F × 0,01 mol… × 10)');
  within(c.cA, 2, 1e-3, '7 · [Zn²⁺] finit à 2 mol/L');
  // décharge sur un pas immense : toujours stable
  const big = Elc.cellStep(Elc.cell(), 0, 1e7);
  ok(big.cC > 0 && big.E >= -1e-9 && big.E < 0.01, '7 · Euler implicite : un pas de 10⁷ s ne fait pas déborder', big.E);
  // tension aux bornes
  const c1 = Elc.cellStep(Elc.cell(), 8, 1e-3);
  within(c1.U, c1.E - c1.I * 2, 1e-12, '7 · U = E − r I');
  near(c1.I, 1.10 / 10, 1e-3, '7 · I = E / (r + R) au départ');
  // pont salin retiré : plus de courant
  const nb = Elc.cellStep(Elc.cell({ bridge: false }), 8, 10);
  ok(nb.I === 0 && nb.Q === 0, '7 · sans pont salin : courant nul');
}

// 8. Faraday
near(Elc.faradayMass(3600, 63.546, 2), 1.186, 0.001, '8 · 1,00 A pendant 1 h → 1,186 g de cuivre');
near(Elc.faradayMass(3600, 65.38, 2), 1.220, 0.001, '8 · … et 1,220 g de zinc');
{
  let c = Elc.cell({ cA: 1, cC: 1, VA: 0.5, VC: 0.5, mA: 50, mC: 50, Rint: 0.1 });
  const m0C = c.mC, m0A = c.mA;
  while (c.Q < 3600) {
    const dt = Math.min(1, (3600 - c.Q) / Math.max(Elc.current(c, 1, 0), 1e-9));
    c = Elc.cellStep(c, 1, dt);
  }
  near(c.Q, 3600, 1e-3, '8 · pile : 3600 C écoulés');
  near(c.mC - m0C, Elc.faradayMass(c.Q, 63.546, 2), 1e-9, '8 · pile : cuivre déposé = Q·M/(nF)');
  near(m0A - c.mA, Elc.faradayMass(c.Q, 65.38, 2), 1e-9, '8 · pile : zinc perdu pour la même charge');
}

// 9. Électrolyse
{
  const c = Elc.cell();
  const e0 = Elc.electrolysis(1.10, c, 1);
  ok(Math.abs(e0.I) < 1e-9, '9 · 1,10 V appliqués à la Daniell : courant nul', e0.I);
  const e1 = Elc.electrolysis(1.5, c, 1);
  ok(e1.I < 0 && e1.mode === 'électrolyse', '9 · 1,5 V : courant de sens opposé (électrolyse)');
  near(e1.I, -(1.5 - 1.1) / 3, 1e-9, '9 · I = (E − U) / (r + R)');
  const e2 = Elc.electrolysis(0.8, c, 1);
  ok(e2.I > 0 && e2.mode === 'pile', '9 · 0,8 V : la pile débite encore');
  // recharge : le zinc se redépose, le cuivre se dissout, la f.é.m. remonte
  let s = Elc.cellStep(Elc.cell({ cA: 1.5, cC: 0.5 }), 1, 0);
  const E0 = Elc.emfOf(s), mA0 = s.mA, mC0 = s.mC;
  for (let i = 0; i < 100; i++) s = Elc.cellStep(s, 1, 60, 2.0);
  ok(s.mA > mA0 && s.mC < mC0 && s.Q < 0, '9 · électrolyse : Zn se dépose, Cu se dissout');
  ok(Elc.emfOf(s) > E0, '9 · électrolyse : la f.é.m. remonte (recharge)');
  near(s.mA - mA0, Elc.faradayMass(-s.Q, 65.38, 2), 1e-9, '9 · électrolyse : masse de zinc = Faraday');
  // à long terme, l'électrolyse tend vers E = U imposée
  let L = Elc.cell({ cA: 1, cC: 1 });
  for (let i = 0; i < 2000; i++) L = Elc.cellStep(L, 1, 600, 1.2);
  within(L.E, 1.2, 0.01, '9 · l’électrolyse s’arrête quand E rejoint U');
}

console.log(pass + ' tests réussis, ' + fail + ' échecs' + (target !== REF ? ' (bloc de ' + path.basename(path.dirname(target)) + '/' + path.basename(target) + ')' : ''));
process.exit(fail ? 1 : 0);
