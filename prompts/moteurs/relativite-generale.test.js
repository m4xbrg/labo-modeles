// Tests du moteur « Relativité générale » ; le bloc embarqué doit être identique au moteur.
// node prompts/moteurs/relativite-generale.test.js
// node prompts/moteurs/relativite-generale.test.js opus-sonnet/fondations-relativite-generale/index.html
'use strict';
const fs = require('fs');
const path = require('path');
const REF = path.join(__dirname, 'relativite-generale.js');
const target = process.argv[2] || REF;
const extract = src => {
  const a = src.indexOf('/* GR-BEGIN */'), b = src.indexOf('/* GR-END */');
  return a < 0 || b < 0 ? null : src.slice(a, b + '/* GR-END */'.length);
};
const block = extract(fs.readFileSync(target, 'utf8'));
if (!block) { console.error('ÉCHEC : marqueurs GR-BEGIN / GR-END absents : ' + target); process.exit(1); }
if (target !== REF && extract(fs.readFileSync(REF, 'utf8')) !== block) {
  console.error('ÉCHEC : le bloc de la page diffère du moteur de référence.'); process.exit(1);
}
const GR = new Function(block + '\nreturn GR;')();
let pass = 0, fail = 0;
const ok = (condition, nom, detail = '') => {
  if (condition) pass++;
  else { fail++; console.error('ÉCHEC  ' + nom + (detail ? '  (' + detail + ')' : '')); }
};
const rel = (a, b, tol, nom) => ok(Number.isFinite(a) && Math.abs(a - b) <= tol * Math.abs(b),
  nom, `${a} contre ${b}, écart relatif ${Math.abs(a/b-1)}`);
const abs = (a, b, tol, nom) => ok(Number.isFinite(a) && Math.abs(a-b) <= tol,
  nom, `${a} contre ${b}, différence ${a-b}`);
const secondeArc = x => x * GR.ARCSEC;

// 1. Rayons de Schwarzschild ; Terre et Soleil.
abs(GR.rs(GR.MS) / 1000, 2.953, 0.006, 'Soleil : rₛ = 2,953 km');
abs(GR.rs(GR.ME) * 1000, 8.87, 0.02, 'Terre : rₛ = 8,87 mm');
rel(GR.isco(GR.MS) / GR.rs(GR.MS), 3, 1e-12, 'r_ISCO = 3 rₛ');
rel(GR.photonSphere(GR.MS) / GR.rs(GR.MS), 1.5, 1e-12, 'r_ph = 1,5 rₛ');

// 2. GPS : comparaison à la surface terrestre, vitesse orbitale circulaire.
const gps = GR.gpsBudget({rOrbit: 26560e3});
abs(gps.gravitation, 45.7, 0.2, 'GPS : +45,7 µs/j gravitation');
abs(gps.cinematique, -7.2, 0.2, 'GPS : −7,2 µs/j cinématique');
abs(gps.total, 38.5, 0.2, 'GPS : +38,5 µs/j total');
abs(gps.erreurMetres / 1000, 11.5, 0.15, 'GPS : ≈ 11,5 km de biais équivalent en 24 h');
rel(gps.vitesse, 3874, 0.01, 'GPS : vitesse orbitale ~3,87 km/s');

// 3. Équivalence locale, lumière et expérience de Pound-Rebka.
rel(GR.poundRebka(22.5), 2.46e-15, 0.01, 'Pound-Rebka, 22,5 m');
const sol = GR.cabin({mode:'sol',g:GR.G0}, 0.3);
const fusee = GR.cabin({mode:'fusée',g:GR.G0}, 0.3);
rel(sol.balle.chute, fusee.balle.chute, 1e-12, 'équivalence balle Terre/fusée');
rel(sol.laserSag, fusee.laserSag, 1e-12, 'équivalence rayon Terre/fusée');
rel(sol.laserSag, 4.91e-16, 0.02, 'laser sur 3 m : 4,91 × 10⁻¹⁶ m');
abs(GR.cabin({mode:'chute'},1).balle.chute, 0, 1e-12, 'chute libre : balle immobile localement');
abs(GR.cabin({mode:'flotte'},1).laserSag, 0, 1e-30, 'loin des masses : rayon droit');
rel(GR.weakRate(22.5,GR.G0)-1, GR.poundRebka(22.5), 0.1, 'limite faible, erreur d’arrondi évaluée');

// 4. Déviation solaire : calcul non linéaire par intégration RK4 des géodésiques nulles.
const b = GR.RS;
const soleil = GR.photonPath(b, GR.MS);
ok(!soleil.capture && soleil.points.length > 20, 'photon solaire réémerge ; trajectoire visible');
abs(secondeArc(soleil.angle), 1.75, 0.03, 'déviation au limbe du Soleil : 1,75″');
rel(soleil.angle, soleil.faible, 0.01, 'numérique contre 4GM/c²b à 1 %');
rel(soleil.faible / soleil.newton, 2, 1e-12, 'déviation RG = deux fois la valeur newtonienne');
abs(GR.deflection(b,GR.MS), soleil.angle, 1e-12, 'deflection = solution numérique photonPath');

// 5. Mercure : avance calculée et avance numérique de l'orbite massive.
const a = 5.79e10, e = 0.2056;
const prec = GR.precession(a,e,GR.MS);
abs(prec.secondesArcSiecle, 43, 0.8, 'Mercure : environ 43″/siècle');
rel(prec.periode / GR.DAY, 88, 0.01, 'Mercure : période ≈ 88 jours');
const num = GR.orbitAdvanceNumeric(a,e,GR.MS,0.0008);
rel(num, prec.parTour, 0.02, 'avance numérique contre 6πGM/(c² a (1−e²)) à 2 %');
const etat = GR.orbitInit(a,e,GR.MS);
const apres = GR.orbitStep(etat,GR.MS,0.01);
ok(apres.r > etat.r && apres.phi > etat.phi, 'orbitStep : commence à sortir du périhélie');

// 6. Orbites stables, instables, photons à la sphère de photons.
const rS = GR.rs(GR.MS);
ok(GR.circularOrbit(5*rS,GR.MS).stable, 'circulaire stable au-delà de 3 rₛ');
ok(!GR.circularOrbit(2*rS,GR.MS).stable && GR.circularOrbit(2*rS,GR.MS).possible,
  'circulaire instable entre 1,5 et 3 rₛ');
ok(!GR.circularOrbit(1.3*rS,GR.MS).possible, 'pas de cercle massif sous 1,5 rₛ');
ok(GR.circularOrbit(GR.photonSphere(GR.MS),GR.MS,false).possible, 'photon circulaire à 1,5 rₛ');
ok(!GR.circularOrbit(GR.photonSphere(GR.MS),GR.MS,false).stable, 'photon circulaire instable');
abs(GR.photonCircularResidual(GR.MS),0,1e-14, 'équation photon nulle sur sphère de photons');
const L = GR.circularOrbit(5*rS, GR.MS).L;
ok(GR.effPotential(5*rS,L,GR.MS,true) > 0, 'potentiel effectif massif fini');
ok(GR.effPotential(5*rS,L,GR.MS,false) > 0, 'potentiel effectif photon fini');
abs(GR.embedding(rS,GR.MS),0,1e-9, 'Flamm : z = 0 à l’horizon');
ok(GR.embedding(1.001*rS,GR.MS) > 0, 'Flamm : z réel à l’extérieur');

// 7. Chute radiale : temps propre fini, t de Schwarzschild divergent.
const chute = GR.infall(10*rS,GR.MS);
ok(Number.isFinite(chute.tauH) && chute.tauH > 0, 'chute 10 rₛ : temps propre fini');
rel(chute.rAtProper(chute.tauH),rS,1e-11,'sonde atteint rₛ en temps propre fini');
ok(chute.rAtProper(chute.tauH*1.01)<rS,'sonde traverse l’horizon');
const tauPres=chute.properAt(rS*(1+1e-5));
ok(tauPres<chute.tauH, 'τ approche une valeur finie près de rₛ');
const t1=chute.farAt(1.01*rS),t2=chute.farAt(1.000001*rS),t3=chute.farAt(1.000000001*rS);
ok(t3>t2 && t2>t1, 'temps lointain diverge en descendant vers rₛ');
const logRatio=(t3-t2)/(rS/GR.c * Math.log(1e-6/1e-9));
rel(logRatio,1,0.03,'singularité logarithmique avec coefficient rₛ/c');
ok(chute.rAtFar(t2) > rS && chute.rAtFar(t2) < 1.00001*rS,
  'coordonnée r(t) tend vers rₛ par l’extérieur');
abs(GR.redshiftFactor(rS, GR.MS),0,1e-20,'décalage gravitationnel nul à l’horizon');
ok(chute.redshiftAt(1.000001*rS)<chute.redshiftAt(2*rS),
  'photons de sonde descendante : énergie observée décroissante');

// 8. Limite faible : écart absolu et ordre relatif explicité.
const loin=1e6*rS, ph=GR.photonPath(loin,GR.MS,{pas:0.001});
ok(!ph.capture, 'rayon lointain s’échappe');
ok(Math.abs(ph.angle-ph.faible)<5e-12,'limite faible à 10⁶ rₛ : écart absolu < 5 × 10⁻¹² rad');
const phPrecis = GR.photonPath(loin,GR.MS,{pas:0.0007});
ok(phPrecis.angle/phPrecis.faible-1>1.2e-6 && phPrecis.angle/phPrecis.faible-1<1.8e-6,
  'à 10⁶ rₛ : correction physique d’ordre 1,5 × 10⁻⁶ (pas rigoureusement inférieure à 10⁻⁶)');
const phPlusLoin=GR.photonPath(2e6*rS,GR.MS,{pas:0.0007});
ok(Math.abs(phPlusLoin.angle/phPlusLoin.faible-1)<1e-6,
  'à 2 × 10⁶ rₛ : approximation relative à moins de 10⁻⁶');
rel(GR.gravRate(loin,GR.MS),1-rS/(2*loin),1e-12,
  'limite faible : racine versus premier ordre pour horloge');
const k=3*GR.G*GR.MS/(GR.c*GR.c*loin);
ok(k < 2e-6 && k > 1e-6, 'limite géodésique : correction de l’ordre de 10⁻⁶ à 10⁶ rₛ');
ok(GR.tidal(GR.rs(10*GR.MS),10*GR.MS,2)>GR.tidal(GR.rs(4e6*GR.MS),4e6*GR.MS,2),
  'marée à l’horizon : bien plus grande pour un petit trou noir');
rel(GR.tidal(GR.rs(4e6*GR.MS),4e6*GR.MS,2), 0.001288,0.01,
  'Sgr A* : marée à l’horizon sur 2 m, environ 0,0013 m/s²');
rel(GR.tidal(GR.rs(10*GR.MS),10*GR.MS,2),2.06e8,0.01,
  '10 M☉ : marée à l’horizon sur 2 m, environ 2,06 × 10⁸ m/s²');

console.log(`${pass} tests réussis ; ${fail} échec(s).`);
if (fail) process.exitCode = 1;
