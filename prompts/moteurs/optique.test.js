// Tests du moteur Opt (planche « Optique », Fondations 25).
// Usage : node optique.test.js            → teste optique.js (à côté de ce fichier)
//         node optique.test.js page.html  → extrait le bloc OPT-BEGIN … OPT-END de la page et le teste
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');

const src = process.argv[2] || path.join(__dirname, 'optique.js');
const txt = fs.readFileSync(src, 'utf8');
const a = txt.indexOf('/* OPT-BEGIN */'), b = txt.indexOf('/* OPT-END */');
if (a < 0 || b < 0) { console.error('Marqueurs OPT-BEGIN / OPT-END introuvables dans ' + src); process.exit(2); }
const block = txt.slice(a, b + '/* OPT-END */'.length);
if (process.argv[2]) {
  const ref = fs.readFileSync(path.join(__dirname, 'optique.js'), 'utf8');
  const ra = ref.indexOf('/* OPT-BEGIN */'), rb = ref.indexOf('/* OPT-END */');
  const same = ref.slice(ra, rb + '/* OPT-END */'.length) === block;
  console.log((same ? 'ok  ' : 'ÉCHEC') + ' bloc moteur identique au moteur de référence');
  if (!same) process.exitCode = 1;
}
const Opt = vm.runInNewContext(block + '\nOpt;', { Math, Object, Number, Infinity, NaN, isFinite });

const deg = Math.PI / 180, D = x => x / deg;
let pass = 0, fail = 0;
function check(name, ok, info) {
  if (ok) { pass++; console.log('ok   ' + name + (info ? '  (' + info + ')' : '')); }
  else { fail++; console.log('ÉCHEC ' + name + (info ? '  (' + info + ')' : '')); }
}
const near = (x, y, tol) => Math.abs(x - y) <= tol;
const rel = (x, y, tol) => Math.abs(x - y) <= tol * Math.abs(y);

// 1. Snell
{
  const t1 = Opt.snell(1, 1.333, 45 * deg).theta2, t2 = Opt.snell(1, 1.5, 30 * deg).theta2;
  check('1a Snell air → eau à 45° : 32,0°', near(D(t1), 32.0, 0.05), D(t1).toFixed(3) + '°');
  check('1b Snell air → verre à 30° : 19,47°', near(D(t2), 19.47, 0.01), D(t2).toFixed(3) + '°');
  const tir = Opt.snell(1.5, 1, 60 * deg);
  check('1c verre → air à 60° : réflexion totale', tir.total && isNaN(tir.theta2));
  check('1d incidence normale : pas de déviation', Opt.snell(1, 1.5, 0).theta2 === 0);
}
// 2. Angle critique
{
  const v = D(Opt.critical(1.5, 1)), e = D(Opt.critical(1.333, 1)), d = D(Opt.critical(2.417, 1));
  check('2a θc verre/air : 41,81°', near(v, 41.81, 0.005), v.toFixed(3) + '°');
  check('2b θc eau/air : 48,6°', near(e, 48.6, 0.05), e.toFixed(3) + '°');
  check('2c θc diamant/air : 24,4°', near(d, 24.4, 0.05), d.toFixed(3) + '°');
  check('2d pas d’angle critique vers un milieu plus lent', isNaN(Opt.critical(1, 1.5)));
  const c = Opt.critical(1.5, 1);
  check('2e juste sous θc : réfracté ; juste au-dessus : total', !Opt.snell(1.5, 1, c - 1e-6).total && Opt.snell(1.5, 1, c + 1e-6).total);
}
// 3. Fresnel
{
  const F = Opt.fresnel(1, 1.5, 0);
  check('3a R normale air/verre = 4,00 %', near(F.R * 100, 4.0, 0.005), (F.R * 100).toFixed(4) + ' %');
  const thB = Opt.brewster(1, 1.5);
  check('3b angle de Brewster air/verre = 56,31°', near(D(thB), 56.31, 0.005), D(thB).toFixed(3) + '°');
  const FB = Opt.fresnel(1, 1.5, thB);
  check('3c Rp = 0 à l’angle de Brewster (à 1e-9)', FB.Rp < 1e-9, 'Rp = ' + FB.Rp.toExponential(2));
  check('3d Rs ≠ 0 à l’angle de Brewster', FB.Rs > 0.1, 'Rs = ' + FB.Rs.toFixed(4));
  const T = Opt.fresnel(1.5, 1, 50 * deg);
  check('3e réflexion totale : R = 1, T = 0', T.R === 1 && T.T === 0);
  const g = Opt.fresnel(1, 1.5, 89.9 * deg);
  check('3f incidence rasante : R → 1', g.R > 0.98, 'R = ' + g.R.toFixed(4));
}
// 4. Conservation R + T = 1 (100 angles tirés, plusieurs couples d'indices)
{
  const rnd = Opt.mulberry32(25);
  let worst = 0, n = 0;
  const pairs = [[1, 1.333], [1, 1.5], [1, 2.417], [1.5, 1], [1.333, 1], [2.417, 1], [1.46, 1.48], [1.48, 1.46]];
  for (const [n1, n2] of pairs) for (let k = 0; k < 100; k++) {
    const th = rnd() * Math.PI / 2 * 0.9999, F = Opt.fresnel(n1, n2, th);
    worst = Math.max(worst, Math.abs(F.Rs + F.Ts - 1), Math.abs(F.Rp + F.Tp - 1), Math.abs(F.R + F.T - 1)); n++;
  }
  check('4  R + T = 1 pour s et p, ' + n + ' angles tirés', worst < 1e-12, 'écart max ' + worst.toExponential(1));
}
// 5. Lentille mince
{
  const a = Opt.thinLens(100, 300, 10), b = Opt.thinLens(100, 50, 10);
  check('5a f = 100, d_o = 300 : image réelle à 150 mm', near(a.dImg, 150, 1e-9) && a.real, 'd_i = ' + a.dImg);
  check('5b m = −0,5 (renversée, deux fois plus petite)', near(a.m, -0.5, 1e-12) && near(a.hImg, -5, 1e-9));
  check('5c d_o = 50 : image virtuelle à −100 mm', near(b.dImg, -100, 1e-9) && !b.real, 'd_i = ' + b.dImg);
  check('5d m = +2 (droite, agrandie)', near(b.m, 2, 1e-12));
  const c = Opt.thinLens(100, 200);
  check('5e objet à 2f : image à 2f, m = −1', near(c.dImg, 200, 1e-9) && near(c.m, -1, 1e-12));
  check('5f objet au foyer : image à l’infini', !isFinite(Opt.thinLens(100, 100).dImg));
  const d = Opt.thinLens(-100, 300);
  check('5g divergente : image virtuelle, droite, réduite', d.dImg < 0 && d.m > 0 && d.m < 1, 'd_i = ' + d.dImg.toFixed(2) + ', m = ' + d.m.toFixed(3));
  check('5h formule des opticiens : R = ±100, n = 1,5 → f = 100', near(Opt.lensmaker(100, -100, 1.5), 100, 1e-9));
}
// 6. Lentille épaisse : tracé exact, focale paraxiale et aberration sphérique
{
  const R1 = 100, R2 = -100, n = 1.5, e = 5;
  const tl = Opt.thickLens(R1, R2, n, e);
  check('6a focale effective (formule des opticiens, lentille épaisse) = 100,8 mm', near(tl.f, 100.84, 0.01), tl.f.toFixed(3) + ' mm');
  const L = Opt.lensSurfaces(R1, R2, n, e, { x0: 0, h: 22 });
  const cross = h => { const r = Opt.trace({ x: -50, y: h, dx: 1, dy: 0 }, L.scene, 10); return Opt.axisCross(r.out); };
  // plan principal image : H' = sommet de sortie + bfd − f
  const xH2 = L.x2 + tl.bfd - tl.f;
  const fPar = cross(0.5) - xH2, fPar2 = cross(0.1) - xH2;
  check('6b rayons paraxiaux (h = 0,5 et 0,1 mm) : focale mesurée depuis H′ à 0,5 %', rel(fPar, tl.f, 0.005) && rel(fPar2, tl.f, 0.005), fPar.toFixed(3) + ' et ' + fPar2.toFixed(3) + ' mm');
  const xMarg = cross(20), xPar = cross(0.5);
  check('6c rayons marginaux (h = 20 mm) convergent plus près : aberration sphérique', xMarg < xPar - 0.5, 'Δ = ' + (xPar - xMarg).toFixed(2) + ' mm');
  check('6d demi-ouverture limitée là où les faces se rejoignent', L.hMax > 21.9 && L.hMax <= 22, 'hMax = ' + L.hMax.toFixed(2));
  const thin = Opt.lensSurfaces(R1, R2, n, e, { x0: 0 });
  check('6e sans borne : hMax où l’épaisseur au bord s’annule (√(100² − 97,5²) = 22,22 mm)', near(thin.hMax, 22.22, 0.005), thin.hMax.toFixed(2));
  const ds = Opt.designLens(100, 1.5, 25);
  check('6f designLens : focale effective visée (100 mm, h = 25)', near(ds.f, 100, 1e-6), 'R = ' + ds.R1.toFixed(2) + ', e = ' + ds.e.toFixed(2));
  const dd = Opt.designLens(-150, 1.5, 25);
  check('6g designLens divergente : f = −150 mm', near(dd.f, -150, 1e-6), 'R1 = ' + dd.R1.toFixed(2));
  // divergente : un rayon parallèle ressort en s'écartant de l'axe ; son prolongement passe par le foyer virtuel
  const Ld = Opt.lensSurfaces(dd.R1, dd.R2, 1.5, dd.e, { x0: 0, h: 25 });
  const rd = Opt.trace({ x: -60, y: 0.5, dx: 1, dy: 0 }, Ld.scene, 10).out, tld = Opt.thickLens(dd.R1, dd.R2, 1.5, dd.e);
  check('6h divergente : le prolongement du rayon émergent passe par le foyer virtuel', rd.dy > 0 && near(Opt.axisCross(rd), Ld.x2 + tld.bfd, 0.005 * Math.abs(tld.bfd)), 'x = ' + Opt.axisCross(rd).toFixed(2) + ' vs ' + (Ld.x2 + tld.bfd).toFixed(2));
}
// 7. Dispersion
{
  const nb = Opt.cauchy(486, 'BK7'), nr = Opt.cauchy(656, 'BK7'), nf = Opt.cauchy(587.6, 'flint');
  check('7a BK7 : n(486 nm) ≈ 1,5224', near(nb, 1.5224, 0.002), nb.toFixed(4));
  check('7b BK7 : n(656 nm) ≈ 1,5144', near(nr, 1.5144, 0.002), nr.toFixed(4));
  check('7c flint F2 : n(587,6 nm) ≈ 1,620', near(nf, 1.620, 0.002), nf.toFixed(4));
  const A = 60 * deg, Db = Opt.prismDeviation(nb, A, 50 * deg).D, Dr = Opt.prismDeviation(nr, A, 50 * deg).D;
  check('7d prisme 60°, incidence 50° : le bleu dévie plus que le rouge', Db > Dr, D(Db).toFixed(2) + '° > ' + D(Dr).toFixed(2) + '°');
  const mb = Opt.minDeviation(nb, A), mr = Opt.minDeviation(nr, A);
  check('7e au minimum de déviation aussi', mb.D > mr.D, D(mb.D).toFixed(2) + '° > ' + D(mr.D).toFixed(2) + '°');
  // le minimum est bien un minimum, et il est symétrique (θ1 = θ2)
  const pm = Opt.prismDeviation(nb, A, mb.theta1);
  let isMin = true; for (const d of [-5, -1, 1, 5]) if (Opt.prismDeviation(nb, A, mb.theta1 + d * deg).D < mb.D - 1e-12) isMin = false;
  check('7f déviation minimale : passage symétrique et minimum vrai', near(pm.theta2, mb.theta1, 1e-9) && near(pm.D, mb.D, 1e-12) && isMin);
  // tracé exact à travers un prisme : même déviation que la formule
  const h = 40, apexP = [0, h], left = [-h * Math.tan(A / 2), 0], right = [h * Math.tan(A / 2), 0];
  const n = nb, prism = [
    { type: 'line', p: left, q: apexP, nL: 1, nR: n },     // face gauche (verre à droite de bas→haut)
    { type: 'line', p: apexP, q: right, nL: 1, nR: n },    // face droite
    { type: 'line', p: right, q: left, nL: 1, nR: n }      // base
  ];
  // rayon qui frappe la face gauche sous 50° depuis sa normale
  const nx = -Math.cos(A / 2), ny = Math.sin(A / 2);        // normale extérieure de la face gauche
  const th = 50 * deg, mid = [(left[0] + apexP[0]) / 2, (left[1] + apexP[1]) / 2];
  // direction entrante : −N tournée de th (vers le bas de la face)
  const ca = Math.cos(th), sa = Math.sin(th), dx = -nx * ca - ny * sa, dy = -ny * ca + nx * sa;
  const tr = Opt.trace({ x: mid[0] - 30 * dx, y: mid[1] - 30 * dy, dx, dy }, prism, 10);
  const dev = Math.acos(Math.max(-1, Math.min(1, tr.out.dx * dx + tr.out.dy * dy)));
  check('7g tracé exact à travers le prisme = formule de déviation', near(D(dev), D(Db), 1e-6), D(dev).toFixed(4) + '° vs ' + D(Db).toFixed(4) + '°');
  // goutte : arc-en-ciel
  const red = Opt.rainbowAngle(Opt.cauchy(656, 'eau')).angle, vio = Opt.rainbowAngle(Opt.cauchy(405, 'eau')).angle;
  check('7h arc-en-ciel : rouge ≈ 42°, violet ≈ 40,5°', near(D(red), 42.3, 0.3) && near(D(vio), 40.6, 0.3), D(red).toFixed(2) + '°, ' + D(vio).toFixed(2) + '°');
  let maxA = 0; for (let k = 1; k < 1000; k++) maxA = Math.max(maxA, Opt.dropRay(Opt.cauchy(656, 'eau'), k / 1000).angle);
  check('7i goutte tracée : l’angle de sortie plafonne à l’angle de l’arc', near(D(maxA), D(red), 0.01), D(maxA).toFixed(3) + '°');
  const dr = Opt.dropRay(1.3311, 0.7);
  check('7j goutte : angle tracé = π − (π + 2i − 4r)', near(dr.angle, Math.PI - dr.D, 1e-9));
  const vc = Opt.visibleColor(650), vb = Opt.visibleColor(470), vg = Opt.visibleColor(300);
  check('7k visibleColor : rouge à 650 nm, bleu à 470 nm, gris hors du visible', vc[0] > 200 && vc[2] === 0 && vb[2] > 200 && vb[0] === 0 && vg[0] === vg[1] && vg[1] === vg[2]);
}
// 8. Malus et polariseurs
{
  const c = Opt.chain(1, [0, 90 * deg], true);
  check('8a deux polariseurs croisés → 0', c[1] < 1e-30, c[1].toExponential(1));
  const t = Opt.chain(1, [0, 45 * deg, 90 * deg], true);
  check('8b 0°, 45°, 90° sur lumière naturelle → I₀/8', near(t[2], 1 / 8, 1e-15), t.map(v => v.toFixed(4)).join(' → '));
  check('8c le premier polariseur garde la moitié de la lumière naturelle', t[0] === 0.5);
  check('8d Malus : I₀ cos² 60° = I₀/4', near(Opt.malus(1, 60 * deg), 0.25, 1e-15));
  const p = Opt.chain(1, [30 * deg], false, 0);
  check('8e lumière déjà polarisée : I₀ cos²(30°)', near(p[0], 0.75, 1e-15));
  const g = Opt.glare(1, 1.5, Opt.brewster(1, 1.5), 90 * deg);
  check('8f reflet à l’angle de Brewster : polarisé s, éteint par un polariseur vertical', near(g.P, 1, 1e-9) && g.through < 1e-12, 'P = ' + g.P.toFixed(6));
}
// 9. Fibre optique
{
  const nc = 1.48, ncl = 1.46, A = Opt.acceptance(nc, ncl);
  check('9a ouverture numérique 1,48 / 1,46 : NA = 0,242, θa = 14,0°', near(A.NA, 0.2425, 0.0005) && near(D(A.theta), 14.03, 0.01), 'NA = ' + A.NA.toFixed(4) + ', θa = ' + D(A.theta).toFixed(2) + '°');
  const arcs = []; for (let k = 0; k < 10; k++) arcs.push({ R: (k % 2 ? -1 : 1) * 1000, len: 40 });
  const F = Opt.fiber({ x: 0, y: 0, heading: 0, w: 1, arcs }, nc, ncl);
  const inject = fac => { const th = fac * A.theta; return Opt.trace({ x: -5, y: 5 * Math.tan(th), dx: Math.cos(th), dy: -Math.sin(th) }, F.scene, 1000); };
  const wall = e => F.scene[e.surf].tag.indexOf('paroi') === 0;
  const tin = inject(0.9), win = tin.events.filter(wall);
  const visited = new Set(win.map(e => F.scene[e.surf].tag));
  const lastIn = tin.events[tin.events.length - 1];
  check('9b sous l’angle d’acceptance (0,9 θa) : réflexions totales sur les 10 arcs, sortie par la face de sortie',
    win.length > 10 && win.every(e => e.type === 'tir') && visited.size === 10 && F.scene[lastIn.surf].tag === 'sortie',
    win.length + ' réflexions totales, ' + visited.size + ' arcs');
  const tout = inject(1.1), wout = tout.events.filter(wall);
  check('9c au-delà (1,1 θa) : le rayon s’échappe au premier contact', wout.length >= 1 && wout[0].type === 'refract' && tout.events.filter(wall).length === 1, wout.length + ' contact(s) avec la paroi');
  const arcs2 = []; for (let k = 0; k < 10; k++) arcs2.push({ R: (k % 2 ? -1 : 1) * 200, len: 40 });
  const F2 = Opt.fiber({ x: 0, y: 0, heading: 0, w: 1, arcs: arcs2 }, nc, ncl), th = 0.9 * A.theta;
  const t2 = Opt.trace({ x: -5, y: 5 * Math.tan(th), dx: Math.cos(th), dy: -Math.sin(th) }, F2.scene, 1000);
  check('9d trop courbée (R = 200 mm) : le même rayon finit par fuir', t2.events.some(e => F2.scene[e.surf].tag.indexOf('paroi') === 0 && e.type === 'refract'));
  const rod = Opt.acceptance(1.5, 1);
  check('9e tige de verre dans l’air : tout rayon venu de l’air est guidé (θa = 90°)', near(rod.theta, Math.PI / 2, 1e-12));
}
// 10. Huygens : les deux moitiés d'un front se rejoignent sur l'interface (géométrie de Snell)
{
  let worst = 0, sp = true;
  for (const [n1, n2, th] of [[1, 1.5, 40], [1, 1.333, 10], [1, 2.417, 70], [1.5, 1, 30]]) {
    const w = Opt.wavefront(n1, n2, th * deg, 0.37, { lambda: 1, freq: 1, reach: 12 });
    for (const f of w.fronts) {
      // intersection de chaque moitié avec y = 0
      const x1 = f.p1[0] - f.p1[1] * f.u1[0] / f.u1[1], x2 = f.p2[0] - f.p2[1] * f.u2[0] / f.u2[1];
      worst = Math.max(worst, Math.abs(x1 - x2), Math.abs(x1 - f.xi));
    }
    sp = sp && near(w.spacing1, 1 / n1, 1e-15) && near(w.spacing2, 1 / n2, 1e-15);
  }
  check('10a fronts : les deux moitiés se rejoignent sur l’interface', worst < 1e-9, 'écart max ' + worst.toExponential(1));
  check('10b espacement λ/n de part et d’autre', sp);
  const w0 = Opt.wavefront(1, 1.5, 30 * deg, 0, { lambda: 1, freq: 1, reach: 5 }), w1 = Opt.wavefront(1, 1.5, 30 * deg, 0.25, { lambda: 1, freq: 1, reach: 5 });
  const f0 = w0.fronts.find(f => f.m === 0), f1 = w1.fronts.find(f => f.m === -1);
  check('10c les fronts avancent à v = c/n (λ f / n par unité de temps)', near((f1 ? f1.d2 : 0) - (w0.fronts.find(f => f.m === -1).d2), 0.25 / 1.5, 1e-12) && !!f0);
  check('10d réflexion totale : pas de front transmis', Opt.wavefront(1.5, 1, 50 * deg, 0, { reach: 5 }).fronts.every(f => f.p2 === null));
  check('10e v dans le verre ≈ 200 000 km/s', near(Opt.speed(1.5) / 1000, 199862, 1), (Opt.speed(1.5) / 1000).toFixed(0) + ' km/s');
}
// 11. Tracé : réflexion partielle (Fresnel) et réflexion totale dans la scène plane de l'étape 1
{
  const iface = [{ type: 'line', p: [-1000, 0], q: [1000, 0], nL: 1.5, nR: 1 }];
  // gauche de (−1000,0)→(1000,0) = +y : n = 1,5 en haut, 1 en bas. Rayon qui descend du verre vers l'air.
  const r = Opt.trace({ x: -10 * Math.sin(30 * deg), y: 10 * Math.cos(30 * deg), dx: Math.sin(30 * deg), dy: -Math.cos(30 * deg) }, iface, 5, { partial: true, minI: 0.001 });
  const refl = r.segs.filter(s => s.kind === 'refl'), F = Opt.fresnel(1.5, 1, 30 * deg);
  check('11a réflexion partielle : branche réfléchie d’intensité R', refl.length === 1 && near(refl[0].I, F.R, 1e-12) && near(r.out.I, F.T, 1e-12), 'R = ' + F.R.toFixed(4));
  const t = Opt.trace({ x: -10 * Math.sin(50 * deg), y: 10 * Math.cos(50 * deg), dx: Math.sin(50 * deg), dy: -Math.cos(50 * deg) }, iface, 5, { partial: true });
  check('11b au-delà de θc : réflexion totale, intensité conservée', t.events[0].type === 'tir' && t.out.dy > 0 && near(t.out.I, 1, 1e-15));
}

console.log('\n' + pass + ' réussis, ' + fail + ' échoués');
if (fail) process.exitCode = 1;
