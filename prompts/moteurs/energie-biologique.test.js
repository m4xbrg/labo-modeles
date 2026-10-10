// Tests du moteur « L'énergie du vivant » (Fondations 34).
// node prompts/moteurs/energie-biologique.test.js              → teste prompts/moteurs/energie-biologique.js
// node prompts/moteurs/energie-biologique.test.js page.html    → teste le bloc BIOEN-BEGIN … BIOEN-END copié dans la page,
//                             et vérifie qu'il est identique au moteur de référence.
// FAST=1 node prompts/moteurs/energie-biologique.test.js …     → simulation d'enzymes abrégée (3 graines au lieu de 10).
'use strict';
const fs = require('fs');
const path = require('path');

const REF = path.join(__dirname, 'energie-biologique.js');
const target = process.argv[2] || REF;
const cut = (src) => {
  const i0 = src.indexOf('/* BIOEN-BEGIN */'), i1 = src.indexOf('/* BIOEN-END */');
  if (i0 < 0 || i1 < 0) return null;
  return src.slice(i0, i1 + '/* BIOEN-END */'.length);
};
const block = cut(fs.readFileSync(target, 'utf8'));
if (!block) { console.error('Marqueurs BIOEN-BEGIN / BIOEN-END introuvables dans ' + target); process.exit(1); }
if (target !== REF) {
  const ref = cut(fs.readFileSync(REF, 'utf8'));
  if (ref !== block) { console.error('ÉCHEC : le bloc de la page diffère du moteur de référence.'); process.exit(1); }
  console.log('Bloc de la page identique au moteur de référence.');
}
const B = new Function(block + '\nreturn BioEn;')();

let pass = 0, fail = 0;
function ok(cond, name, info) {
  if (cond) pass++;
  else { fail++; console.log('ÉCHEC  ' + name + (info !== undefined ? '  (' + info + ')' : '')); }
}
const near = (a, b, tol, name) => ok(Math.abs(a - b) <= tol, name, a + ' vs ' + b + ' ± ' + tol);
const rel = (a, b, r, name) => ok(Math.abs(a - b) <= r * Math.abs(b), name, a + ' vs ' + b + ' (' + (100 * (a / b - 1)).toFixed(2) + ' %)');

// ---------- 1. Couplage glucose + ATP : −16,7 kJ/mol ----------
near(B.couple('g6p', 'atp'), -16.7, 1e-9, '1. couplage glucose-6-P + ATP = −16,7');
near(B.couple(B.REACTIONS.g6p, B.REACTIONS.atp, 1), -16.7, 1e-9, '1. couplage (objets)');
near(B.couple('gln', 'atp'), -16.3, 1e-9, '1. couplage glutamine + ATP = −16,3');
ok(B.couple('g6p', 'atp', 0) > 0, '1. sans ATP, la réaction monte (ΔG > 0)');
near(B.couple(13.8, -30.5, 2), -47.2, 1e-9, '1. deux ATP couplés');
for (const id of B.UPHILL) ok(B.REACTIONS[id].dG0 > 0, '1. ' + id + ' monte');
for (const id in B.REACTIONS) ok(typeof B.REACTIONS[id].src === 'string' && B.REACTIONS[id].src.length > 5, '1. source citée : ' + id);
rel(B.myosinWork(), 24.09, 0.005, '1. travail d’une myosine 5 pN × 8 nm ≈ 24 kJ/mol');
rel(B.pumpDG(), 44.35, 0.005, '1. pompe Na⁺/K⁺ ≈ 44 kJ/mol de cycles');
ok(B.couple('pompe', 'atp') > 0, '1. pompe + 1 ATP standard : ne passe pas (ΔG°′)');
ok(B.pumpDG() + B.cellATP() < 0, '1. pompe + 1 ATP aux conditions de la cellule : passe');

// ---------- 2. ΔG réel de l'hydrolyse ----------
near(B.RT(), 2.5773, 1e-3, '2. RT à 310 K = 2,577 kJ/mol');
near(B.cellATP({ ATP: 4, ADP: 0.5, Pi: 5 }), -49.5, 0.3, '2. ΔG réel ATP 4 / ADP 0,5 / Pi 5 = −49,5');
near(B.cellATP(), -49.5, 0.3, '2. ΔG réel par défaut');
ok(B.cellATP({ ATP: 4, ADP: 0.05, Pi: 5 }) < -55, '2. ADP 0,05 mmol/L : plus négatif que −55', B.cellATP({ ADP: 0.05 }));
near(B.dG(-30.5, 1), -30.5, 1e-12, '2. Q = 1 : ΔG = ΔG°′');
rel(B.Keq(-30.5), Math.exp(30.5 / 2.5773), 1e-3, '2. K = e^(−ΔG°′/RT)');
ok(B.Keq(-30.5) > 1e5, '2. équilibre très loin vers ADP + Pi');
// porte-monnaie : équilibre stable avec recharge, vidé en ≈ 20 s sans
{
  let s = B.walletInit();
  near(s.ATP, 4, 1e-12, '2. réserve initiale 4 mmol/L');
  for (let i = 0; i < 6000; i++) s = B.walletStep(s, true, null, 0.01);
  near(s.ATP, 4, 1e-6, '2. avec recharge, ATP stable à 4 mmol/L');
  let t = 0; while (s.ATP > 0.01 && t < 100) { s = B.walletStep(s, false, null, 0.01); t += 0.01; }
  ok(t > 15 && t < 25, '2. sans recharge, réserve épuisée en ≈ 20 s', t.toFixed(1));
  ok(B.walletSpend({ ATP: 0.1, ADP: 4.4 }, 0.5) === null, '2. dépense refusée si la réserve ne suffit pas');
  ok(B.walletDG({ ATP: 1, ADP: 3.5 }) > B.walletDG(B.walletInit()), '2. réserve basse : ΔG de l’hydrolyse moins négatif');
}

// ---------- 3. Michaelis-Menten ----------
{
  const Vm = 10, Km = 2;
  near(B.mmRate(Km, Vm, Km), Vm / 2, 1e-12, '3. v(Km) = Vmax/2');
  ok(Math.abs(B.mmRate(1e9, Vm, Km) - Vm) < 1e-6, '3. v → Vmax quand S → ∞');
  near(B.mmRate(0, Vm, Km), 0, 1e-12, '3. v(0) = 0');
  rel(B.mmRate(1e-4, Vm, Km), Vm / Km * 1e-4, 1e-4, '3. pente initiale Vmax/Km');
  const I = 3, Ki = 1.5, KmA = Km * (1 + I / Ki);
  near(B.KmApp(Km, I, Ki), 6, 1e-12, '3. Km apparent = Km(1 + I/Ki)');
  near(B.mmRate(KmA, Vm, Km, I, Ki), Vm / 2, 1e-12, '3. inhibiteur : v(Km app) = Vmax/2');
  ok(Math.abs(B.mmRate(1e9, Vm, Km, I, Ki) - Vm) < 1e-5, '3. inhibiteur : Vmax inchangé');
  ok(B.mmRate(Km, Vm, Km, I, Ki) < B.mmRate(Km, Vm, Km), '3. inhibiteur : plus lent à S donné');
  near(B.mmRate(4, 2 * Vm, Km) / B.mmRate(4, Vm, Km), 2, 1e-12, '3. doubler les enzymes double v');
  near(B.KmOf(0.02, 0.4, 0.8), 60, 1e-9, '3. Km = (koff + kcat)/kon');
}

// ---------- 4. Simulation particulaire = Michaelis-Menten à 8 % ----------
{
  const nSeeds = process.env.FAST ? 3 : 10;
  const P = B.ENZ, Km = B.KmOf(P.kon, P.koff, P.kcat);
  for (const f of [0.25, 0.5, 1, 2, 4]) {
    const nS = Math.round(f * Km);
    let v = 0, occ = 0, th = 0;
    for (let s = 1; s <= nSeeds; s++) { const m = B.enzymeMeasure({ nS, seed: 100 + s }, 60, 10); v += m.v / nSeeds; occ += m.occ / nSeeds; th = m.theo; }
    rel(v, th, 0.08, '4. vitesse mesurée ≈ mmRate à [S] = ' + f + ' Km');
    rel(occ, nS / (Km + nS), 0.08, '4. occupation ≈ [S]/(Km + [S]) à ' + f + ' Km');
  }
  // inhibiteur compétitif : à [S] = Km app, la vitesse vaut la moitié de Vmax
  {
    const nI = 30, KmA = B.KmApp(Km, nI, P.Ki), nS = Math.round(KmA);
    let v = 0, th = 0;
    for (let s = 1; s <= nSeeds; s++) { const m = B.enzymeMeasure({ nS, nI, seed: 200 + s }, 60, 10); v += m.v / nSeeds; th = m.theo; }
    rel(th, P.kcat * P.nE / 2, 0.02, '4. inhibiteur : théorie v(Km app) ≈ Vmax/2');
    rel(v, th, 0.08, '4. inhibiteur : vitesse mesurée ≈ mmRate avec I');
  }
  // conservation et reproductibilité
  {
    const a = B.enzymeSim({ nS: 40, nI: 10, seed: 7 }), b = B.enzymeSim({ nS: 40, nI: 10, seed: 7 });
    for (let i = 0; i < 1200; i++) { B.enzymeStep(a, 1 / 120); B.enzymeStep(b, 1 / 120); }
    ok(a.S.length === 40 && a.I.length === 10, '4. concentrations libres maintenues constantes (bain)');
    ok(a.nProd === b.nProd && a.S[0].x === b.S[0].x, '4. même graine, même histoire');
    ok(a.E.every((e) => ['E', 'ES', 'EI'].includes(e.st)), '4. états des enzymes valides');
  }
}

// ---------- 5. Bilans : 30 ATP avec O₂, 2 sans ; 6 O₂ et 6 CO₂ ----------
{
  const a = B.respirationBudget({ O2: true }), n = B.respirationBudget({ O2: false });
  near(a.atp.total, 30, 1e-12, '5. avec O₂ : 30 ATP par glucose');
  near(a.atp.glycolyse + a.atp.krebs + a.atp.chaine, 30, 1e-12, '5. 2 + 2 + 26');
  near(a.atp.chaine, 26, 1e-12, '5. chaîne ≈ 26');
  near(B.respirationBudget({ shuttle: 'malate' }).atp.total, 32, 1e-12, '5. navette malate-aspartate : 32');
  near(n.atp.total, 2, 1e-12, '5. sans O₂ : 2 ATP');
  ok(a.o2 === 6 && a.co2 === 6, '5. 6 O₂ consommés, 6 CO₂ produits');
  ok(n.o2 === 0 && n.co2 === 0 && n.lactate === 2, '5. fermentation lactique : 0 O₂, 0 CO₂, 2 lactate');
  near(B.glucoseFor(30, false) / B.glucoseFor(30, true), 15, 1e-12, '5. sans O₂, quinze fois plus de glucose');
  near(a.captured + a.heat, 2870, 1e-9, '5. bilan fermé : ATP + chaleur = 2 870 kJ');
  near(a.flows.glycoATP + a.flows.krebsATP + a.flows.glycoHeat + a.flows.carriers, 2870, 1e-9, '5. Sankey : sorties du glucose = 2 870');
  near(a.flows.chainATP + a.flows.chainHeat, a.flows.carriers, 1e-9, '5. Sankey : la chaîne redistribue ce que portent NADH et FADH₂');
  rel(-a.eNADH, 219.2, 0.002, '5. NADH → O₂ : −nFΔE ≈ −219 kJ/mol');
  ok(a.flows.glycoHeat > 0 && a.flows.chainHeat > 0, '5. chaleurs positives');
  near(n.captured + n.heat + n.retained, 2870, 1e-9, '5. fermentation : ATP + chaleur + lactate = 2 870');
  const s = B.supply(10, 4);
  near(s.aer + s.ana, 10, 1e-12, '5. sprint : demande servie');
  near(s.lactate, 6, 1e-12, '5. sprint : un lactate par ATP anaérobie');
  near(s.glucose, 4 / 30 + 6 / 2, 1e-12, '5. sprint : glucose consommé');
}

// ---------- 6. Rendement : 30 × 30,5 / 2 870 ≈ 32 % ----------
near(B.respirationBudget().yield, 30 * 30.5 / 2870, 1e-12, '6. rendement = 30 × 30,5 / 2 870');
near(B.respirationBudget().yield, 0.32, 0.005, '6. rendement ≈ 32 %');

// ---------- 7. dailyATP(100 W) : de l'ordre de 50 kg ----------
{
  const d = B.dailyATP(100);
  ok(d.kg > 40 && d.kg < 90, '7. 100 W : de l’ordre de 50 kg d’ATP par jour', d.kg.toFixed(1));
  rel(d.kg, 45.8, 0.01, '7. hypothèse affichée : 30 ATP par glucose de 2 870 kJ → 45,8 kg');
  ok(d.kgUpper > 80 && d.kgUpper < 90, '7. borne haute P/|ΔG réel| ≈ 88 kg', d.kgUpper.toFixed(1));
  near(B.M_ATP, 507, 0.5, '7. masse molaire de l’ATP 507 g/mol');
  rel(d.powerThroughATP, 100 * 30 * 49.5 / 2870, 0.01, '7. puissance qui passe par l’ATP ≈ 52 W');
  const t = B.stockSeconds(20, 1);
  ok(t > 10 && t < 60, '7. cerveau (20 W, 1 L) : réserve d’ATP en quelques dizaines de secondes', t.toFixed(1));
  ok(B.stockSeconds(100, 40) > 60 && B.stockSeconds(100, 40) < 300, '7. corps entier : quelques minutes');
}

// ---------- 8. chlAbs : 430 et 662 nm, minimum dans le vert ----------
{
  let bl = 0, bv = 0, rl = 0, rv = 0;
  for (let l = 380; l <= 720; l += 0.5) { const v = B.chlAbs(l, 'a'); if (l < 550 && v > bv) { bv = v; bl = l; } if (l >= 550 && v > rv) { rv = v; rl = l; } }
  near(bl, 430, 10, '8. chl a : maximum bleu vers 430 nm');
  near(rl, 662, 10, '8. chl a : maximum rouge vers 662 nm');
  near(bv, 1, 1e-6, '8. chl a normalisée');
  let gl = 0, gv = 9;
  for (let l = 430; l <= 662; l += 0.5) { const v = B.chlAbs(l); if (v < gv) { gv = v; gl = l; } }
  ok(gl >= 500 && gl <= 600, '8. mélange a + b : minimum entre les deux pics dans le vert', gl);
  const band = (a, b) => { let s = 0, n = 0; for (let l = a; l <= b; l++) { s += B.chlAbs(l); n++; } return s / n; };
  ok(band(500, 600) < band(400, 500) && band(500, 600) < band(600, 700), '8. le vert est la bande la moins absorbée');
  ok(B.chlAbs(550) < 0.15, '8. absorbance à 550 nm faible', B.chlAbs(550));
  let bb = 0, bbl = 0; for (let l = 380; l <= 720; l += 0.5) { const v = B.chlAbs(l, 'b'); if (l < 550 && v > bb) { bb = v; bbl = l; } }
  near(bbl, 453, 10, '8. chl b : maximum bleu vers 453 nm');
  ok(B.absorbed(662) > 0.9 && B.absorbed(550) < 0.3, '8. feuille : rouge absorbé, vert surtout renvoyé');
  ok(B.photoRate({ lambda: 550, I: 200 }).P < B.photoRate({ lambda: 662, I: 200 }).P, '8. moins de photosynthèse en lumière verte');
  rel(B.photonE(680), 175.9, 0.002, '8. photon de 680 nm : 176 kJ/mol');
}

// ---------- 9. lightResponse : linéaire puis plateau ----------
{
  const o = { Pmax: 20, alpha: 0.06 };
  ok(B.photoRate({ I: 0, CO2: 0 }).P === 0 &&
    [[0, 20], [-1, 20], [100, 0], [100, -1]].every(([I, Pmax]) => B.lightResponse(I, { Pmax }) === 0),
    '9. lumière ou Pmax non positifs : vitesse nulle, y compris I = CO₂ = 0');
  rel(B.lightResponse(1, o), 0.06, 0.002, '9. faible lumière : P ≈ αI');
  rel(B.lightResponse(2, o) / B.lightResponse(1, o), 2, 0.002, '9. faible lumière : linéaire');
  rel(B.lightResponse(1e5, o), 20, 1e-6, '9. forte lumière : plateau à Pmax');
  ok(B.lightResponse(4000, o) - B.lightResponse(2000, o) < 0.05, '9. doubler la lumière au plateau ne change presque rien');
  ok(B.photoRate({ I: 2000, CO2: 200 }).P < B.photoRate({ I: 2000, CO2: 420 }).P, '9. au plateau, le CO₂ limite');
  near(B.pmaxCO2(B.PHOTO.CO2), B.PHOTO.Pmax0, 1e-9, '9. Pmax = 20 au CO₂ actuel');
  const pb = B.photoBudget();
  ok(pb.photonsPerGlucose === 48 && pb.o2 === 6, '9. photosynthèse : 48 photons, 6 O₂ par glucose');
  ok(pb.yieldRed > 0.3 && pb.yieldRed < 0.36, '9. rendement en lumière rouge ≈ 34 %', pb.yieldRed);
}

// ---------- hasard ----------
{
  const r1 = B.mulberry32(42), r2 = B.mulberry32(42);
  ok(r1() === r2() && r1() === r2(), 'mulberry32 reproductible');
}

console.log(`${pass} réussis, ${fail} échoués`);
process.exit(fail ? 1 : 0);
