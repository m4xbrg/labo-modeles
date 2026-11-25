/* TROIS-CORPS-BEGIN */
/* LABO — moteur « trois corps ». Gravitation newtonienne plane, sans adoucissement.
   Unités : masse du Soleil, unité astronomique, G = 1 ; l'unité de temps vaut donc un an / 2π.
   État : Float64Array [x1,y1,x2,y2,x3,y3, vx1,vy1,vx2,vy2,vx3,vy3]. Intégrateur : Dormand-Prince 5(4) à pas adaptatif. */
const TroisCorps = (() => {
  'use strict';
  const COLLISION = 1e-4, HUIT_T = 6.32591398;
  const PAIRES = [[0, 1], [0, 2], [1, 2]];

  function deriv(s, m, d) {
    for (let i = 0; i < 6; i++) { d[i] = s[6 + i]; d[6 + i] = 0; }
    for (let n = 0; n < 3; n++) {
      const i = PAIRES[n][0], j = PAIRES[n][1];
      const dx = s[2 * j] - s[2 * i], dy = s[2 * j + 1] - s[2 * i + 1];
      const r2 = dx * dx + dy * dy, k = 1 / (r2 * Math.sqrt(r2));
      d[6 + 2 * i] += m[j] * k * dx; d[7 + 2 * i] += m[j] * k * dy;
      d[6 + 2 * j] -= m[i] * k * dx; d[7 + 2 * j] -= m[i] * k * dy;
    }
    return d;
  }
  const dist = (s, i, j) => Math.hypot(s[2 * j] - s[2 * i], s[2 * j + 1] - s[2 * i + 1]);
  const dmin = s => Math.min(dist(s, 0, 1), dist(s, 0, 2), dist(s, 1, 2));

  function energie(s, m) {
    let c = 0, p = 0;
    for (let i = 0; i < 3; i++) c += 0.5 * m[i] * (s[6 + 2 * i] ** 2 + s[7 + 2 * i] ** 2);
    for (const [i, j] of PAIRES) p -= m[i] * m[j] / dist(s, i, j);
    return { c, p, t: c + p };
  }
  function moment(s, m) {
    let L = 0;
    for (let i = 0; i < 3; i++) L += m[i] * (s[2 * i] * s[7 + 2 * i] - s[2 * i + 1] * s[6 + 2 * i]);
    return L;
  }
  function centre(s, m) {
    const M = m[0] + m[1] + m[2], c = [0, 0, 0, 0];
    for (let i = 0; i < 3; i++) for (let k = 0; k < 2; k++) { c[k] += m[i] * s[2 * i + k] / M; c[2 + k] += m[i] * s[6 + 2 * i + k] / M; }
    return c;
  }
  /* ramène le centre de masse au repos, à l'origine */
  function recentre(s, m) {
    const c = centre(s, m);
    for (let i = 0; i < 3; i++) for (let k = 0; k < 2; k++) { s[2 * i + k] -= c[k]; s[6 + 2 * i + k] -= c[2 + k]; }
    return s;
  }

  const A = [[], [1 / 5], [3 / 40, 9 / 40], [44 / 45, -56 / 15, 32 / 9], [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
    [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656], [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]];
  const ER = [71 / 57600, 0, -71 / 16695, 71 / 1920, -17253 / 339200, 22 / 525, -1 / 40];
  const K = Array.from({ length: 7 }, () => new Float64Array(12)), Y = new Float64Array(12);

  /* Avance `sys` ({ s, m, h }) de T. Renvoie { ok, t, raison } : arrêt propre si deux corps se touchent.
     Le pas initial vient de sys.h, gardé d'un appel à l'autre. */
  function avance(sys, T, tol = 1e-12, maxPas = 200000) {
    const { s, m } = sys;
    let t = 0, h = sys.h || 1e-3, n = 0;
    while (t < T - 1e-14) {
      if (n++ > maxPas) return { ok: false, t, raison: 'calcul' };
      if (dmin(s) < COLLISION) return { ok: false, t, raison: 'collision' };
      const dernier = t + h >= T, hh = dernier ? T - t : h;
      for (let e = 0; e < 7; e++) {
        for (let i = 0; i < 12; i++) { let v = s[i]; for (let j = 0; j < e; j++) v += hh * A[e][j] * K[j][i]; Y[i] = v; }
        deriv(Y, m, K[e]);
      }
      let err = 0;
      for (let i = 0; i < 12; i++) {
        let e = 0; for (let j = 0; j < 7; j++) e += ER[j] * K[j][i];
        err = Math.max(err, Math.abs(e * hh / (tol * (1 + Math.abs(s[i])))));
      }
      const f = Math.min(4, Math.max(0.2, 0.9 * Math.pow(err || 1e-10, -0.2)));
      if (err <= 1) { s.set(Y); t += hh; if (!dernier || f < 1) h = hh * f; }
      else { h = hh * f; if (!(h > 1e-14)) return { ok: false, t, raison: 'collision' }; }
    }
    sys.h = h;
    return { ok: true, t };
  }
  const cree = (p, m) => ({ s: Float64Array.from(p), m: m.slice(), h: 1e-3 });

  /* ---------- Situations de départ ---------- */
  function huit() {
    const x = 0.97000436, y = -0.24308753, vx = -0.93240737, vy = -0.86473146;
    return cree([x, y, -x, -y, 0, 0, -vx / 2, -vy / 2, -vx / 2, -vy / 2, vx, vy], [1, 1, 1]);
  }
  /* Burrau : triangle 3-4-5, chaque masse en face du côté de même longueur, au repos */
  const pythagore = () => cree([1, 3, -2, -1, 1, -1, 0, 0, 0, 0, 0, 0], [3, 4, 5]);
  /* triangle équilatéral de côté a, en rotation d'ensemble : exact quelles que soient les masses */
  function lagrange(m, a = 1.6) {
    const R = a / Math.sqrt(3), p = [];
    for (let i = 0; i < 3; i++) { const th = Math.PI / 2 + i * 2 * Math.PI / 3; p.push(R * Math.cos(th), R * Math.sin(th)); }
    const sys = cree([...p, 0, 0, 0, 0, 0, 0], m), w = Math.sqrt((m[0] + m[1] + m[2]) / a ** 3);
    recentre(sys.s, m);
    for (let i = 0; i < 3; i++) { sys.s[6 + 2 * i] = -w * sys.s[2 * i + 1]; sys.s[7 + 2 * i] = w * sys.s[2 * i]; }
    return sys;
  }
  /* binaire serrée (deux masses 1, séparées de 0,4) et un troisième corps lointain */
  function hierarchie() {
    const a = 0.4, d = 3, m = [1, 1, 0.5], vb = Math.sqrt(2 / a) / 2, vd = Math.sqrt(2.5 / d);
    const sys = cree([-a / 2, 0, a / 2, 0, d, 0, 0, -vb, 0, vb, 0, vd], m);
    recentre(sys.s, m); return sys;
  }
  /* « papillon I » de Šuvakov et Dmitrašinović (2013) */
  function papillon() {
    const a = 0.30689, b = 0.12551;
    return cree([-1, 0, 1, 0, 0, 0, a, b, a, b, -2 * a, -2 * b], [1, 1, 1]);
  }
  /* Critère de Routh : le triangle de Lagrange est linéairement stable si R = (m1+m2+m3)² / (m1m2+m1m3+m2m3) > 27 */
  const routh = m => (m[0] + m[1] + m[2]) ** 2 / (m[0] * m[1] + m[0] * m[2] + m[1] * m[2]);

  /* Corps qui s'échappe : énergie positive par rapport au centre de masse des deux autres, qui s'éloigne,
     et loin de la paire (plus de 4 fois sa séparation). -1 sinon. */
  function echappe(s, m) {
    for (let i = 0; i < 3; i++) {
      const j = (i + 1) % 3, k = (i + 2) % 3, M = m[j] + m[k];
      const g = n => (m[j] * s[2 * j + n] + m[k] * s[2 * k + n]) / M, gv = n => (m[j] * s[6 + 2 * j + n] + m[k] * s[6 + 2 * k + n]) / M;
      const x = s[2 * i] - g(0), y = s[2 * i + 1] - g(1), vx = s[6 + 2 * i] - gv(0), vy = s[7 + 2 * i] - gv(1), r = Math.hypot(x, y);
      if (r > 4 * dist(s, j, k) && x * vx + y * vy > 0 && 0.5 * (vx * vx + vy * vy) - (M + m[i]) / r > 0) return i;
    }
    return -1;
  }
  /* écart entre deux systèmes : plus grand déplacement d'un corps */
  const ecart = (a, b) => Math.max(...[0, 1, 2].map(i => Math.hypot(a[2 * i] - b[2 * i], a[2 * i + 1] - b[2 * i + 1])));

  return { COLLISION, HUIT_T, PAIRES, deriv, dist, dmin, energie, moment, centre, recentre, avance, cree, huit, pythagore, lagrange, hierarchie, papillon, routh, echappe, ecart };
})();
/* TROIS-CORPS-END */
if (typeof module !== 'undefined') module.exports = TroisCorps;
