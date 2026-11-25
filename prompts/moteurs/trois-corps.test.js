/* Tests du moteur trois-corps. node prompts/moteurs/trois-corps.test.js [page.html]
   Avec une page en argument : vérifie aussi que le bloc copié est identique à la référence. */
const fs = require('fs'), path = require('path');
const T = require('./trois-corps.js');
let bons = 0, rates = 0;
const ok = (c, nom, info = '') => { if (c) bons++; else { rates++; console.log('ÉCHEC ' + nom, info); } };
const run = (s, duree, pas = 0.01) => { for (let i = 0; i < Math.round(duree / pas); i++) { const r = T.avance(s, pas); if (!r.ok) return r; } return { ok: true }; };
const horizon = k => { const a = T.pythagore(), b = T.pythagore(); b.s[0] += 10 ** -k; T.recentre(b.s, b.m); let t = 0; while (t < 90) { T.avance(a, 0.01); T.avance(b, 0.01); t += 0.01; if (T.ecart(a.s, b.s) > 0.1) break; } return t; };

{ // 1. Le huit : période, conservation, chorégraphie
  const s = T.huit(), d = s.s.slice(), e0 = T.energie(s.s, s.m).t;
  T.avance(s, T.HUIT_T / 3);
  const dep = [0, 1, 2].map(i => Math.min(...[0, 1, 2].filter(j => j !== i).map(j => Math.hypot(s.s[2 * i] - d[2 * j], s.s[2 * i + 1] - d[2 * j + 1]))));
  ok(Math.max(...dep) < 1e-6, 'huit : après T/3 chaque corps occupe la place d’un autre', dep);
  T.avance(s, T.HUIT_T * 2 / 3);
  ok(T.ecart(s.s, d) < 1e-6, 'huit : retour au départ après T', T.ecart(s.s, d));
  T.avance(s, T.HUIT_T * 19);
  ok(T.ecart(s.s, d) < 1e-5, 'huit : retour après 20 périodes');
  ok(Math.abs(T.energie(s.s, s.m).t - e0) < 1e-9, 'huit : énergie conservée');
  ok(Math.abs(T.moment(s.s, s.m)) < 1e-9, 'huit : moment cinétique nul');
}
{ // 2. Pythagore : Burrau 1913, Szebehely et Peters 1967
  const s = T.pythagore(), e0 = T.energie(s.s, s.m).t;
  ok(Math.abs(e0 + 769 / 60) < 1e-12, 'Pythagore : énergie −769/60', e0);
  let t = 0, esc = null;
  while (t < 75) { T.avance(s, 0.01); t += 0.01; const x = T.echappe(s.s, s.m); if (x < 0) esc = null; else if (!esc) esc = [x, t]; }
  ok(esc && esc[0] === 0 && esc[1] > 58 && esc[1] < 63, 'Pythagore : la masse 3 s’échappe vers t = 60', esc);
  ok(Math.abs(T.energie(s.s, s.m).t - e0) < 1e-6, 'Pythagore : énergie conservée malgré les passages serrés');
  ok(Math.abs(T.moment(s.s, s.m)) < 1e-6, 'Pythagore : moment cinétique nul');
  const c = T.centre(s.s, s.m); ok(Math.hypot(...c) < 1e-9, 'Pythagore : centre de masse immobile', c);
}
{ // 3. Sensibilité : gagner un facteur 1000 ajoute, ne multiplie pas
  const h3 = horizon(3), h6 = horizon(6);
  console.log('horizons 1e-3 et 1e-6 :', h3.toFixed(2), h6.toFixed(2));
  ok(Math.abs(h3 - 33.7) < 0.3 && Math.abs(h6 - 47.4) < 0.3, 'horizons cités par la page', [h3, h6]);
}
{ // 4. Lagrange : solution exacte, puis Routh
  const m = [1, 0.5, 0.25], s = T.lagrange(m), L0 = T.dist(s.s, 0, 1); run(s, 10);
  ok([[0, 1], [0, 2], [1, 2]].every(([i, j]) => Math.abs(T.dist(s.s, i, j) - L0) < 1e-5), 'Lagrange : triangle équilatéral gardé, masses quelconques');
  const rapport = (mu, duree) => { const M = [1, mu, mu], q = T.lagrange(M); q.s[0] += 0.005; T.recentre(q.s, M); let mx = 1; for (let t = 0; t < duree; t += 0.05) { if (!T.avance(q, 0.05).ok) return 99; const d = T.PAIRES.map(([i, j]) => T.dist(q.s, i, j)); mx = Math.max(mx, Math.max(...d) / Math.min(...d)); } return mx; };
  ok(T.routh([1, 1, 1]) === 3 && T.routh([1, 0.01, 0.01]) > 27, 'Routh : valeurs');
  ok(rapport(1, 14) > 1.5, 'masses égales poussées : le triangle se défait');
  ok(rapport(0.01, 100) < 1.1, 'R > 27 : le triangle poussé tient');
}
{ // 5. Réversibilité, collision
  const s = T.huit(), d = s.s.slice(); T.avance(s, 5); for (let i = 6; i < 12; i++) s.s[i] *= -1; T.avance(s, 5);
  ok([0, 1, 2, 3, 4, 5].every(i => Math.abs(s.s[i] - d[i]) < 1e-6), 'réversible dans le temps');
  const c = T.cree([-1, 0, 1, 0, 0, 50, 0, 0, 0, 0, 0, 0], [1, 1, 1e-3]), r = run(c, 5);
  ok(!r.ok && r.raison === 'collision', 'chute frontale : collision signalée', r);
  const h = T.hierarchie(); ok(run(h, 60).ok && T.echappe(h.s, h.m) < 0, 'binaire et lointain : lié pendant 60 unités');
  const p = T.papillon(), p0 = p.s.slice(); T.avance(p, 6.2356); ok(T.ecart(p.s, p0) < 5e-3, 'papillon : période 6,2356');
}
if (process.argv[2]) {
  const bloc = f => { const x = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'); return x.slice(x.indexOf('/* TROIS-CORPS-BEGIN */'), x.indexOf('/* TROIS-CORPS-END */')); };
  const a = bloc(path.join(__dirname, 'trois-corps.js')); ok(a.length > 1000 && a === bloc(process.argv[2]), 'bloc de page identique à la référence');
}
console.log(`Bilan : ${bons} réussis, ${rates} échec(s).`);
if (rates) process.exit(1);
