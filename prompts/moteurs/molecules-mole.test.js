// Tests du moteur Mol. Usage : node prompts/moteurs/molecules-mole.test.js [chemin/vers/index.html]
// Sans argument : moteur du scratchpad. Avec un index.html : extrait le bloc MOL-BEGIN … MOL-END de la page.
'use strict';
const fs = require('fs'), path = require('path');
let Mol, source;
const arg = process.argv[2];
if (arg) {
  const html = fs.readFileSync(arg, 'utf8');
  const m = /\/\* MOL-BEGIN \*\/([\s\S]*?)\/\* MOL-END \*\//.exec(html);
  if (!m) { console.error('Bloc MOL-BEGIN … MOL-END introuvable dans ' + arg); process.exit(2); }
  Mol = new Function(m[1] + '\nreturn Mol;')();
  source = arg;
  // Le bloc de la page doit être identique à celui du scratchpad.
  const ref = fs.readFileSync(path.join(__dirname, 'molecules-mole.js'), 'utf8');
  const r = /\/\* MOL-BEGIN \*\/([\s\S]*?)\/\* MOL-END \*\//.exec(ref)[1];
  if (r !== m[1]) { console.error('ÉCHEC : le bloc moteur de la page diffère du moteur testé.'); process.exit(1); }
} else { Mol = require('./molecules-mole.js'); source = 'molecules-mole.js'; }

let pass = 0, fail = 0;
function ok(cond, name, detail) {
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '  (' + detail + ')' : '')); }
  else { fail++; console.log('  ÉCHEC ' + name + (detail ? '  (' + detail + ')' : '')); }
}
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const rel = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-300);
console.log('Moteur : ' + source);

/* 1. Morse */
console.log('1. Potentiel de Morse');
for (const k of Object.keys(Mol.BONDS)) {
  const b = Mol.BONDS[k];
  // minimum : balayage fin
  let rmin = 0, emin = Infinity;
  for (let r = b.re * 0.5; r <= b.re * 3; r += 0.001) { const e = Mol.morse(r, b); if (e < emin) { emin = e; rmin = r; } }
  ok(near(rmin, b.re, 0.002), k + ' : minimum en re = ' + b.re + ' pm', 'r_min = ' + rmin.toFixed(3));
  ok(near(emin, -b.De, 1e-9), k + ' : profondeur De = ' + b.De + ' eV', 'E_min = ' + emin.toFixed(6));
  ok(Math.abs(Mol.morseForce(b.re, b)) < 1e-12, k + ' : force nulle en re');
  ok(Mol.morseForce(b.re * 0.9, b) > 0 && Mol.morseForce(b.re * 0.7, b) > 0, k + ' : force positive (répulsive) sous re');
  ok(Mol.morseForce(b.re * 1.2, b) < 0, k + ' : force négative (attractive) au-delà de re');
  ok(near(Mol.morse(1e5, b), 0, 1e-9), k + ' : E → 0 à grande distance');
  // F = −dE/dr par différences finies
  const r = b.re * 1.13, h = 1e-4, Fn = -(Mol.morse(r + h, b) - Mol.morse(r - h, b)) / (2 * h);
  ok(rel(Mol.morseForce(r, b), Fn) < 1e-6, k + ' : F = −dE/dr');
  // raideur k = 2 De a² cohérente avec la valeur citée (N/m) à 1 %
  const kSI = 2 * b.De * Mol.EV * Math.pow(b.a * 1e12, 2);
  ok(rel(kSI, b.k) < 0.01, k + ' : raideur 2·De·a² = ' + b.k + ' N/m', kSI.toFixed(1) + ' N/m');
}
{
  const b = Mol.BONDS['H–H'];
  ok(near(Mol.bondEnergyEV(b), 4.52, 0.01), 'H–H : 436 kJ/mol = 4,52 eV par liaison', Mol.bondEnergyEV(b).toFixed(3) + ' eV');
  ok(Mol.bondEnergyEV(b) < b.De, 'H–H : énergie de liaison tabulée < profondeur du puits (point zéro)');
  ok(near(Mol.vibPeriod(b), 7.58, 0.08), 'H–H : période de vibration ≈ 7,6 fs (4401 cm⁻¹)', Mol.vibPeriod(b).toFixed(3) + ' fs');
  // Vibration : énergie conservée et oscillation autour de re
  let s = { r: b.re + 5, v: 0, t: 0 }; const E0 = Mol.bondEnergy(s, b); let rmin = Infinity, rmax = -Infinity, drift = 0;
  for (let i = 0; i < 20000; i++) { s = Mol.vibrate(s, b, 0.002); rmin = Math.min(rmin, s.r); rmax = Math.max(rmax, s.r); drift = Math.max(drift, Math.abs(Mol.bondEnergy(s, b) - E0)); }
  ok(drift < 1e-5, 'vibrate : énergie conservée (Verlet)', 'écart max ' + drift.toExponential(2) + ' eV');
  ok(rmin < b.re && rmax > b.re && near(rmax, b.re + 5, 0.01), 'vibrate : oscille autour de re', rmin.toFixed(2) + ' – ' + rmax.toFixed(2) + ' pm');
  // Casser : énergie totale ≥ 0 → les atomes s'éloignent sans retour
  let s2 = { r: b.re, v: Mol.speedForEnergy(b.re, b, 0.05), t: 0 };
  for (let i = 0; i < 50000; i++) s2 = Mol.vibrate(s2, b, 0.002);
  ok(s2.r > 500 && s2.v > 0, 'énergie de liaison fournie : les atomes se séparent', 'r = ' + s2.r.toFixed(0) + ' pm après 100 fs');
}

/* 2. Électronégativité */
console.log('2. Caractère de la liaison');
{
  const hh = Mol.bondCharacter('H', 'H'), oh = Mol.bondCharacter('O', 'H'), nacl = Mol.bondCharacter('Na', 'Cl');
  ok(hh.dchi === 0 && hh.type === 'covalente non polaire', 'H–H non polaire', JSON.stringify([hh.dchi, hh.type]));
  ok(near(oh.dchi, 1.24, 1e-9) && oh.type === 'covalente polaire' && oh.minus === 'O' && oh.plus === 'H', 'O–H polaire, Δχ = 1,24, δ− sur O', JSON.stringify([oh.dchi, oh.type, oh.minus]));
  ok(near(nacl.dchi, 2.23, 1e-9) && nacl.type === 'ionique' && nacl.minus === 'Cl', 'Na–Cl ionique, Δχ = 2,23', JSON.stringify([nacl.dchi, nacl.type]));
  ok(Mol.bondCharacter('H', 'F').type === 'covalente polaire', 'H–F (Δχ = 1,78) reste polaire avec le seuil 1,8');
  ok(Mol.bondCharacter('C', 'H').type === 'covalente non polaire', 'C–H (Δχ = 0,35) non polaire');
  ok(oh.delta > 0 && oh.delta < nacl.delta && nacl.delta < 1, 'charge partielle indicative croissante avec Δχ', oh.delta.toFixed(2) + ' < ' + nacl.delta.toFixed(2));
  ok(Mol.bondCharacter('Na', 'H').caveat !== null && Mol.bondCharacter('Na', 'K').caveat !== null, 'réserves signalées (hydrure, deux métaux)');
}

/* 3. VSEPR */
console.log('3. VSEPR relaxé');
const relaxed = {};
for (const k of Object.keys(Mol.MOLECULES)) { const m = Mol.MOLECULES[k]; relaxed[k] = Mol.relaxDomains(m.nBond, m.nLone); }
{
  const a = k => Mol.angles(relaxed[k].dirs);
  const ch4 = a('CH4'), bf3 = a('BF3'), co2 = a('CO2'), nh3 = a('NH3'), h2o = a('H2O');
  ok(ch4.length === 6 && ch4.every(x => near(x, 109.47, 0.3)), 'CH₄ 109,47° à 0,3°', ch4.map(x => x.toFixed(3)).join(' '));
  ok(bf3.length === 3 && bf3.every(x => near(x, 120, 0.3)), 'BF₃ 120°', bf3.map(x => x.toFixed(3)).join(' '));
  ok(co2.length === 1 && near(co2[0], 180, 0.3), 'CO₂ 180°', co2[0].toFixed(3));
  ok(nh3.every(x => x >= 106 && x <= 108), 'NH₃ entre 106° et 108°', nh3.map(x => x.toFixed(2)).join(' '));
  ok(h2o[0] >= 103.5 && h2o[0] <= 105.5, 'H₂O entre 103,5° et 105,5°', h2o[0].toFixed(2));
  for (const k of Object.keys(relaxed)) ok(relaxed[k].fmax < 1e-10, k + ' : relaxation convergée', 'fmax = ' + relaxed[k].fmax.toExponential(1) + ', ' + relaxed[k].iters + ' pas');
  // Indépendance du départ : plusieurs graines, même forme
  const spread = [1, 2, 3, 4, 5].map(sd => Mol.angles(Mol.relaxDomains(2, 2, 20000, sd).dirs)[0]);
  ok(Math.max(...spread) - Math.min(...spread) < 1e-6, 'H₂O : même angle depuis 5 départs aléatoires', spread.map(x => x.toFixed(4)).join(' '));
  for (const [nb, nl] of [[2, 0], [3, 0], [4, 0], [2, 1], [3, 1], [2, 2], [1, 3]]) {
    const Es = [11, 12, 13, 14, 15, 16].map(sd => Mol.relaxDomains(nb, nl, 20000, sd).E);
    ok(Math.max(...Es) - Math.min(...Es) < 1e-9, `AX${nb}E${nl} : même minimum depuis 6 départs (pas de minimum local)`, Mol.geometryName(nb, nl));
  }
  let threw = false; try { Mol.relaxDomains(4, 1); } catch (e) { threw = true; }
  ok(threw, 'plus de quatre domaines refusé (limite documentée du modèle)');
  ok(Mol.geometryName(2, 2) === 'coudée' && Mol.geometryName(3, 1) === 'pyramidale' && Mol.geometryName(4, 0) === 'tétraédrique' && Mol.geometryName(3, 0) === 'plane trigonale' && Mol.geometryName(2, 0) === 'linéaire', 'noms des géométries');
}

/* 4. Moments dipolaires */
console.log('4. Moments dipolaires');
{
  const d = k => Mol.dipole(Mol.MOLECULES[k], relaxed[k].dirs);
  ok(d('CO2').mag < 1e-9, 'CO₂ : moment nul à 10⁻⁹', d('CO2').mag.toExponential(2) + ' D');
  ok(d('CH4').mag < 1e-9, 'CH₄ : moment nul à 10⁻⁹', d('CH4').mag.toExponential(2) + ' D');
  ok(d('BF3').mag < 1e-9, 'BF₃ : moment nul à 10⁻⁹', d('BF3').mag.toExponential(2) + ' D');
  const w = d('H2O'), dirs = relaxed.H2O.dirs, bis = [dirs[0][0] + dirs[1][0], dirs[0][1] + dirs[1][1], dirs[0][2] + dirs[1][2]];
  const bl = Math.hypot(...bis), cosang = (w.vec[0] * bis[0] + w.vec[1] * bis[1] + w.vec[2] * bis[2]) / (w.mag * bl);
  ok(w.mag > 0.5, 'H₂O : moment non nul', w.mag.toFixed(3) + ' D');
  ok(near(cosang, -1, 1e-9), 'H₂O : dirigé selon la bissectrice, des H (δ+) vers O (δ−)', 'cos = ' + cosang.toFixed(12));
  const mw = w.mag, mn = d('NH3').mag, mh = d('HCl').mag;
  ok(mw > mn && mn > mh, 'ordre H₂O > NH₃ > HCl', [mw, mn, mh].map(x => x.toFixed(3)).join(' > '));
  for (const k of ['H2O', 'NH3', 'HCl']) ok(rel(d(k).mag, Mol.MOLECULES[k].dipoleRef) < 0.03, k + ' : proche de la valeur mesurée ' + Mol.MOLECULES[k].dipoleRef + ' D (3 %)', d(k).mag.toFixed(3) + ' D');
}

/* 5. Forces entre molécules */
console.log('5. Étape 4 : amas à température égale (moyenne sur 5 graines)');
{
  const T = 0.4, res = {};
  for (const s of ['methane', 'hcl', 'eau']) {
    let acc = 0, k = 0, nh = 0;
    for (let seed = 1; seed <= 5; seed++) {
      const sys = Mol.liquidInit(s, T, seed);
      for (let i = 0; i < 12000; i++) { Mol.liquidStep(sys, T); if (i >= 6000 && i % 50 === 0) { acc += Mol.clusterFraction(sys); nh += Mol.hbonds(sys); k++; } }
    }
    res[s] = { f: acc / k, nh: nh / k };
  }
  ok(res.eau.f > res.hcl.f && res.hcl.f > res.methane.f, 'T* = 0,4 : eau > HCl > méthane', ['eau ' + res.eau.f.toFixed(2), 'HCl ' + res.hcl.f.toFixed(2), 'méthane ' + res.methane.f.toFixed(2)].join(' > '));
  ok(res.eau.nh > 20 && res.methane.nh === 0, 'liaisons hydrogène nombreuses dans l’eau, aucune dans le méthane', 'eau ' + res.eau.nh.toFixed(1));
  // Thermostat : la température cinétique moyenne rejoint la consigne
  const sys = Mol.liquidInit('methane', 1.0, 3); let Tm = 0, k = 0;
  for (let i = 0; i < 8000; i++) { Mol.liquidStep(sys, 1.0); if (i > 3000) { Tm += Mol.liquidTemp(sys); k++; } }
  ok(near(Tm / k, 1.0, 0.05), 'thermostat de Langevin : T cinétique ≈ consigne', (Tm / k).toFixed(3));
  // Déterminisme : même graine, même trajectoire
  const a = Mol.liquidInit('eau', 0.5, 9), b = Mol.liquidInit('eau', 0.5, 9);
  for (let i = 0; i < 500; i++) { Mol.liquidStep(a, 0.5); Mol.liquidStep(b, 0.5); }
  ok(a.x[7] === b.x[7] && a.th[3] === b.th[3], 'même graine, même trajectoire');
  ok(Mol.LIQ.Tb.methane < Mol.LIQ.Tb.hcl && Mol.LIQ.Tb.hcl < Mol.LIQ.Tb.eau && Math.abs(Mol.toKelvin(Mol.LIQ.Tb.eau) - 373) < 10, 'transitions du modèle ordonnées, correspondance indicative ≈ 373 K pour l’eau', Mol.toKelvin(Mol.LIQ.Tb.eau).toFixed(0) + ' K');
  ok(Mol.BOILING.CH4 < Mol.BOILING.H2S && Mol.BOILING.H2S < Mol.BOILING.NH3 && Mol.BOILING.NH3 < Mol.BOILING.HF && Mol.BOILING.HF < Mol.BOILING.H2O, 'BOILING : ordre CH₄ < H₂S < NH₃ < HF < H₂O');
}

/* 6. Masses molaires */
console.log('6. Masses molaires');
for (const [f, M] of [['H2O', 18.015], ['CO2', 44.009], ['NaCl', 58.44], ['C6H12O6', 180.156], ['Ca(OH)2', 74.092]]) {
  const v = Mol.molarMass(f); ok(near(v, M, 0.01), f + ' = ' + M + ' g/mol', v.toFixed(4));
}
ok(near(Mol.molarMass('C₆H₁₂O₆'), 180.156, 0.01), 'indices en exposant Unicode acceptés');
ok(JSON.stringify(Mol.atomCounts('Ca(OH)2')) === JSON.stringify({ Ca: 1, O: 2, H: 2 }), 'Ca(OH)₂ → Ca 1, O 2, H 2');
ok(near(Mol.molarMass('Al2(SO4)3'.replace('Al', 'Fe')), 2 * 55.845 + 3 * (32.06 + 4 * 15.999), 1e-9), 'parenthèses avec indice (Fe₂(SO₄)₃)');
{ let threw = false; try { Mol.molarMass('Xx2'); } catch (e) { threw = true; } ok(threw, 'élément inconnu refusé'); }

/* 7. Mole */
console.log('7. Mole et nombre de particules');
{
  const n = Mol.moles(18.015, Mol.molarMass('H2O')), N = Mol.particles(n);
  ok(near(n, 1.000, 0.001), '18,015 g d’eau → 1,000 mol', n.toFixed(5));
  ok(near(N / 1e23, 6.022, 0.001), '→ 6,022 × 10²³ molécules', (N / 1e23).toFixed(4) + ' × 10²³');
  ok(Mol.NA === 6.02214076e23, 'N_A exact (SI 2019)');
  const nL = Mol.molesInVolume(1, 1.000, Mol.molarMass('H2O'));
  ok(near(nL, 55.5, 0.05), '1 L d’eau (1,000 g/mL) → 55,5 mol', nL.toFixed(2));
}

/* 8. Dilution */
console.log('8. Concentration et dilution');
{
  const C2 = Mol.dilute(0.50, 100, 250);
  ok(near(C2, 0.20, 1e-12), '0,50 mol/L × 100 mL dilués à 250 mL → 0,20 mol/L', String(C2));
  const n = Mol.moles(9, Mol.molarMass('NaCl'));
  ok(near(Mol.conc(n, 1), 0.154, 0.001), 'sérum physiologique 9 g/L → 0,154 mol/L', Mol.conc(n, 1).toFixed(4));
  ok(near(Mol.conc(0.05, 0.25) * 0.25, 0.05, 1e-15) && near(Mol.conc(0.05, 0.25), Mol.dilute(Mol.conc(0.05, 0.1), 0.1, 0.25), 1e-15), 'diluer conserve n');
  ok(near(Mol.massConc(0.154, 58.44), 9.0, 0.01), 'concentration massique C·M');
}

/* 9. Réactions */
console.log('9. Stœchiométrie');
{
  for (const k of Object.keys(Mol.REACTIONS)) ok(Mol.balanced(Mol.REACTIONS[k]), Mol.REACTIONS[k].name + ' : équation équilibrée');
  const r = Mol.react(Mol.REACTIONS.methane, { CH4: 2, O2: 3 });
  ok(r.limiting === 'O2', 'CH₄ 2 mol + O₂ 3 mol → O₂ limitant', JSON.stringify(r.limiting));
  ok(near(r.products.CO2, 1.5, 1e-12) && near(r.products.H2O, 3, 1e-12), '1,5 mol de CO₂ (et 3 mol d’eau)', r.products.CO2 + ' mol');
  ok(near(r.leftover.CH4, 0.5, 1e-12) && r.leftover.O2 === 0, '0,5 mol de CH₄ restant, O₂ épuisé', JSON.stringify(r.leftover));
  ok(near(r.extent, 1.5, 1e-12), 'avancement ξ = 1,5 mol');
  const cases = { methane: { CH4: 2, O2: 3 }, eau: { H2: 3.7, O2: 1.1 }, propane: { C3H8: 0.25, O2: 2 }, nacl: { Na: 1.3, Cl2: 0.9 } };
  for (const k of Object.keys(cases)) {
    const q = Mol.react(Mol.REACTIONS[k], cases[k]);
    ok(rel(q.massAfter, q.massBefore) < 1e-9, Mol.REACTIONS[k].name + ' : masse avant = masse après (10⁻⁹)', q.massBefore.toFixed(4) + ' g → ' + q.massAfter.toFixed(4) + ' g');
  }
  const half = Mol.react(Mol.REACTIONS.methane, { CH4: 2, O2: 3 }, 0.75);
  ok(near(half.leftover.O2, 1.5, 1e-12) && rel(half.massAfter, half.massBefore) < 1e-12, 'avancement partiel : n_i = n_i,0 − ν_i ξ, masse conservée');
  const tie = Mol.react(Mol.REACTIONS.eau, { H2: 2, O2: 1 });
  ok(Array.isArray(tie.limiting) && tie.limiting.length === 2, 'proportions exactes : les deux réactifs s’épuisent ensemble');
}

console.log(`\n${pass} réussis, ${fail} échoués`);
process.exit(fail ? 1 : 0);
