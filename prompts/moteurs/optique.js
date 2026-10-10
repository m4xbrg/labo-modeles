// Moteur de la planche « Optique : la lumière qui tourne » (Fondations 25).
// Verrouillé : copier à l'identique dans le <script> de la page, du marqueur
// OPT-BEGIN au marqueur OPT-END inclus. Tests : node prompts/moteurs/optique.test.js [page.html]
//
// Conventions
// - Longueurs en mm, angles en radians (sauf mention), longueurs d'onde en nm.
// - Repère mathématique : x vers la droite, y vers le HAUT. La page retourne y au dessin.
// - Interface plane de l'étape 1 : la droite y = 0 ; milieu 1 (incident) en y > 0, milieu 2 en y < 0.
// - Lentilles : axe optique = axe x, lumière de gauche à droite. Rayon de courbure R > 0 si le centre
//   est à droite du sommet. Distances objet et image « réelles positives » : objet réel à gauche
//   (d_o > 0), image réelle à droite (d_i > 0), image virtuelle d_i < 0.

/* OPT-BEGIN */
const Opt = (function () {
  'use strict';
  const PI = Math.PI;
  const C = 299792458;                       // vitesse de la lumière dans le vide, m/s
  const EPS = 1e-7;                          // mm : distance minimale entre deux contacts d'un rayon

  // ---------- Hasard à graine (seule source d'aléa du moteur et de la page)
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- Milieux
  const MEDIA = {
    air: { name: 'air', n: 1.000 },
    eau: { name: 'eau', n: 1.333 },
    verre: { name: 'verre', n: 1.500 },
    diamant: { name: 'diamant', n: 2.417 }
  };
  const speed = n => C / n;                   // m/s

  // ---------- Interfaces
  // Loi de Snell-Descartes : n1 sin θ1 = n2 sin θ2. total = réflexion totale (aucun rayon réfracté).
  function snell(n1, n2, theta1) {
    const s = n1 * Math.sin(theta1) / n2;
    if (Math.abs(s) > 1) return { theta2: NaN, total: true };
    return { theta2: Math.asin(s), total: false };
  }
  // Angle critique (n1 > n2), NaN sinon.
  function critical(n1, n2) { return n1 > n2 ? Math.asin(n2 / n1) : NaN; }
  // Angle de Brewster : le rayon réfléchi n'a plus de composante p.
  function brewster(n1, n2) { return Math.atan2(n2, n1); }
  // Coefficients de Fresnel en énergie. s : E perpendiculaire au plan d'incidence ; p : dans le plan.
  // T est calculé par les coefficients de transmission (pas par 1 − R) : R + T = 1 est une vérification.
  function fresnel(n1, n2, theta1) {
    const ci = Math.cos(theta1), sn = snell(n1, n2, theta1);
    if (sn.total) return { Rs: 1, Rp: 1, Ts: 0, Tp: 0, R: 1, T: 0, total: true };
    const ct = Math.cos(sn.theta2);
    const rs = (n1 * ci - n2 * ct) / (n1 * ci + n2 * ct);
    const rp = (n2 * ci - n1 * ct) / (n2 * ci + n1 * ct);
    const ts = 2 * n1 * ci / (n1 * ci + n2 * ct);
    const tp = 2 * n1 * ci / (n2 * ci + n1 * ct);
    const f = (n2 * ct) / (n1 * ci);
    const Rs = rs * rs, Rp = rp * rp, Ts = f * ts * ts, Tp = f * tp * tp;
    return { Rs, Rp, Ts, Tp, R: (Rs + Rp) / 2, T: (Ts + Tp) / 2, total: false };
  }

  // ---------- Huygens : fronts d'onde plans de part et d'autre de l'interface y = 0
  // Une onde plane de longueur d'onde lambda (dans le vide, unités de longueur au choix) et de fréquence
  // f (cycles par unité de temps) arrive du milieu 1 sous l'angle theta1. Le front numéro m est l'ensemble
  // des points où la phase vaut m cycles : n·(k̂·r)/lambda − f·t = m. Dans chaque milieu c'est une droite
  // perpendiculaire à la direction de propagation, à la distance (m + f t)·lambda/n de l'origine :
  // l'espacement vaut lambda/n et la vitesse lambda·f/n. Les deux moitiés d'un même front se rejoignent
  // sur l'interface : c'est la loi de Snell (n1 sin θ1 = n2 sin θ2).
  // Retour : { k1, k2, theta2, total, fronts: [{ m, d1, d2, p1, u1, p2, u2, xi }] }
  //   d1, d2 : distances signées des droites à l'origine le long de k1, k2 ;
  //   p, u : un point de la droite et sa direction unitaire ; xi : abscisse de la jonction sur l'interface
  //   (Infinity en incidence normale) ; p2, u2 = null en réflexion totale (onde évanescente non dessinée).
  //   Les m retenus sont ceux dont la droite du milieu 1 coupe le disque de rayon opts.reach autour de l'origine,
  //   ou dont la droite du milieu 2 le coupe.
  function wavefront(n1, n2, theta1, t, opts) {
    const o = opts || {}, lam = o.lambda || 1, f = o.freq == null ? 1 : o.freq, reach = o.reach || 10 * lam;
    const sn = snell(n1, n2, theta1);
    const k1 = [Math.sin(theta1), -Math.cos(theta1)];
    const k2 = sn.total ? null : [Math.sin(sn.theta2), -Math.cos(sn.theta2)];
    const ph = f * t, fronts = [];
    const nMin = sn.total ? n1 : Math.min(n1, n2);
    const mLo = Math.floor(-reach * Math.max(n1, n2) / lam - ph) - 1, mHi = Math.ceil(reach * Math.max(n1, n2) / lam - ph) + 1;
    for (let m = mLo; m <= mHi; m++) {
      const q = (m + ph) * lam;
      const d1 = q / n1, d2 = sn.total ? NaN : q / n2;
      if (Math.abs(d1) > reach && (sn.total || Math.abs(d2) > reach)) continue;
      const p1 = [k1[0] * d1, k1[1] * d1], u1 = [-k1[1], k1[0]];
      const p2 = sn.total ? null : [k2[0] * d2, k2[1] * d2], u2 = sn.total ? null : [-k2[1], k2[0]];
      const xi = Math.abs(k1[0]) < 1e-12 ? Infinity : d1 / k1[0];
      fronts.push({ m, d1, d2, p1, u1, p2, u2, xi });
    }
    return { k1, k2, theta2: sn.theta2, total: sn.total, spacing1: lam / n1, spacing2: sn.total ? NaN : lam / n2, nMin, fronts };
  }

  // ---------- Tracé de rayons
  // Surfaces :
  //   { type: 'line', p: [x, y], q: [x, y], nL, nR }  segment ; nL du côté gauche de p→q (côté de la normale (−dy, dx)), nR de l'autre.
  //   { type: 'arc', c: [x, y], r, a0, sw, nOut, nIn } arc de cercle de l'angle a0 à a0 + sw (sw > 0, sens antihoraire).
  //   Options communes : absorb: true (écran : le rayon s'arrête), mirror: true (réflexion totale forcée), tag: 'nom'.
  // Rayon : { x, y, dx, dy, I } (direction normalisée par le moteur, I intensité relative, 1 par défaut).
  // trace(ray, scene, maxBounces, opts) ; opts.fresnel : l'intensité du rayon transmis est multipliée par T ;
  //   opts.partial : les réflexions partielles sont suivies aussi (branches 'refl', jusqu'à opts.minI, 0,02 par défaut) ;
  //   opts.far : longueur du dernier segment d'un rayon qui sort (1e4 mm par défaut).
  // Retour : { segs: [{x0, y0, x1, y1, I, n, kind, depth}], events: [{x, y, type, surf, thetaI, n1, n2}] (rayon principal),
  //            out: dernier rayon principal {x, y, dx, dy, I, n} ou null s'il est absorbé, end: 'escape' | 'absorb' | 'max' }
  function hitLine(s, x, y, dx, dy) {
    const ex = s.q[0] - s.p[0], ey = s.q[1] - s.p[1];
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-15) return null;
    const wx = s.p[0] - x, wy = s.p[1] - y;
    const t = (wx * ey - wy * ex) / den, u = (wx * dy - wy * dx) / den;
    if (t <= EPS || u < 0 || u > 1) return null;
    const L = Math.hypot(ex, ey);
    return { t, nx: -ey / L, ny: ex / L, nA: s.nL, nB: s.nR };
  }
  function hitArc(s, x, y, dx, dy) {
    const fx = x - s.c[0], fy = y - s.c[1];
    const b = fx * dx + fy * dy, cc = fx * fx + fy * fy - s.r * s.r, disc = b * b - cc;
    if (disc < 0) return null;
    const sq = Math.sqrt(disc);
    for (const t of [-b - sq, -b + sq]) {
      if (t <= EPS) continue;
      const px = fx + t * dx, py = fy + t * dy;
      let a = Math.atan2(py, px) - s.a0;
      a = ((a % (2 * PI)) + 2 * PI) % (2 * PI);
      if (a <= s.sw + 1e-12) return { t, nx: px / s.r, ny: py / s.r, nA: s.nOut, nB: s.nIn };
    }
    return null;
  }
  function firstHit(scene, x, y, dx, dy) {
    let best = null, bi = -1;
    for (let i = 0; i < scene.length; i++) {
      const s = scene[i], h = s.type === 'line' ? hitLine(s, x, y, dx, dy) : hitArc(s, x, y, dx, dy);
      if (h && (!best || h.t < best.t)) { best = h; bi = i; }
    }
    return best ? Object.assign(best, { i: bi }) : null;
  }
  // Interaction en un point : N normale unitaire vers le côté d'où vient le rayon.
  function refractDir(dx, dy, nx, ny, n1, n2) {
    const ci = -(dx * nx + dy * ny), eta = n1 / n2, k = 1 - eta * eta * (1 - ci * ci);
    if (k < 0) return null;
    const ct = Math.sqrt(k), a = eta * ci - ct;
    const rx = eta * dx + a * nx, ry = eta * dy + a * ny, L = Math.hypot(rx, ry);
    return [rx / L, ry / L];
  }
  function reflectDir(dx, dy, nx, ny) { const d = dx * nx + dy * ny; return [dx - 2 * d * nx, dy - 2 * d * ny]; }
  function trace(ray, scene, maxBounces, opts) {
    const o = opts || {}, far = o.far || 1e4, minI = o.minI == null ? 0.02 : o.minI, maxB = maxBounces || 50;
    const segs = [], events = [];
    let out = null, end = 'max';
    const L0 = Math.hypot(ray.dx, ray.dy);
    const stack = [{ x: ray.x, y: ray.y, dx: ray.dx / L0, dy: ray.dy / L0, I: ray.I == null ? 1 : ray.I, n: ray.n || null, kind: 'main', depth: 0, b: 0 }];
    while (stack.length) {
      const r = stack.pop();
      let { x, y, dx, dy, I, n } = r;
      let b = r.b;
      for (;;) {
        if (b >= maxB) { if (r.kind === 'main') { end = 'max'; out = { x, y, dx, dy, I, n }; } break; }
        const h = firstHit(scene, x, y, dx, dy);
        if (!h) {
          segs.push({ x0: x, y0: y, x1: x + far * dx, y1: y + far * dy, I, n, kind: r.kind, depth: r.depth });
          if (r.kind === 'main') { end = 'escape'; out = { x, y, dx, dy, I, n }; }
          break;
        }
        const hx = x + h.t * dx, hy = y + h.t * dy, s = scene[h.i];
        let nx = h.nx, ny = h.ny, n1 = h.nA, n2 = h.nB;
        if (dx * nx + dy * ny > 0) { nx = -nx; ny = -ny; n1 = h.nB; n2 = h.nA; }
        segs.push({ x0: x, y0: y, x1: hx, y1: hy, I, n: n1, kind: r.kind, depth: r.depth });
        const ci = Math.min(1, -(dx * nx + dy * ny)), thI = Math.acos(ci);
        b++;
        if (s.absorb) {
          if (r.kind === 'main') { events.push({ x: hx, y: hy, type: 'absorb', surf: h.i, thetaI: thI, n1, n2 }); end = 'absorb'; out = null; }
          break;
        }
        if (s.mirror) {
          const d = reflectDir(dx, dy, nx, ny);
          if (r.kind === 'main') events.push({ x: hx, y: hy, type: 'reflect', surf: h.i, thetaI: thI, n1, n2: n1 });
          x = hx; y = hy; dx = d[0]; dy = d[1]; n = n1; continue;
        }
        const t = refractDir(dx, dy, nx, ny, n1, n2);
        if (!t) {
          const d = reflectDir(dx, dy, nx, ny);
          if (r.kind === 'main') events.push({ x: hx, y: hy, type: 'tir', surf: h.i, thetaI: thI, n1, n2 });
          x = hx; y = hy; dx = d[0]; dy = d[1]; n = n1; continue;
        }
        const F = (o.fresnel || o.partial) ? fresnel(n1, n2, thI) : null;
        if (o.partial && F && I * F.R >= minI) {
          const d = reflectDir(dx, dy, nx, ny);
          stack.push({ x: hx, y: hy, dx: d[0], dy: d[1], I: I * F.R, n: n1, kind: 'refl', depth: r.depth + 1, b });
        }
        if (r.kind === 'main') events.push({ x: hx, y: hy, type: 'refract', surf: h.i, thetaI: thI, n1, n2, R: F ? F.R : NaN });
        x = hx; y = hy; dx = t[0]; dy = t[1]; n = n2;
        if (F) I *= F.T;
      }
    }
    return { segs, events, out, end };
  }
  // Abscisse où un rayon (x, y, dx, dy) coupe l'axe y = 0 (Infinity s'il lui est parallèle).
  function axisCross(r) { return Math.abs(r.dy) < 1e-15 ? Infinity : r.x - r.y * r.dx / r.dy; }

  // ---------- Fibre : un cœur d'indice nCore, de largeur w, dans une gaine d'indice nClad, le long d'un
  // chemin fait d'arcs. path = { x, y, heading (rad), w, arcs: [{ R, len }] } ; R > 0 : virage à gauche,
  // R < 0 : à droite, R = Infinity : tronçon droit. La face d'entrée (air | cœur) est perpendiculaire au chemin.
  // Retour : { scene, center: [[x, y], …] (ligne médiane échantillonnée), end: {x, y, heading}, entry: {x, y, ux, uy} }
  function fiber(path, nCore, nClad, nOut) {
    const w = path.w || 1, h = w / 2, n0 = nOut == null ? 1 : nOut;
    let x = path.x || 0, y = path.y || 0, hd = path.heading || 0;
    const scene = [], center = [[x, y]];
    // face d'entrée : du bord droit au bord gauche, cœur du côté gauche de p→q (en avant)
    const lx = -Math.sin(hd), ly = Math.cos(hd);
    scene.push({ type: 'line', p: [x - lx * h, y - ly * h], q: [x + lx * h, y + ly * h], nL: n0, nR: nCore, tag: 'entree' });
    const entry = { x, y, ux: Math.cos(hd), uy: Math.sin(hd) };
    for (let k = 0; k < path.arcs.length; k++) {
      const a = path.arcs[k];
      const nlx = -Math.sin(hd), nly = Math.cos(hd);           // normale gauche
      if (!isFinite(a.R)) {
        const ux = Math.cos(hd), uy = Math.sin(hd), x1 = x + ux * a.len, y1 = y + uy * a.len;
        // paroi gauche : cœur à droite de p→q ; paroi droite : cœur à gauche
        scene.push({ type: 'line', p: [x + nlx * h, y + nly * h], q: [x1 + nlx * h, y1 + nly * h], nL: nClad, nR: nCore, tag: 'paroi' + k });
        scene.push({ type: 'line', p: [x - nlx * h, y - nly * h], q: [x1 - nlx * h, y1 - nly * h], nL: nCore, nR: nClad, tag: 'paroi' + k });
        for (let j = 1; j <= 4; j++) center.push([x + ux * a.len * j / 4, y + uy * a.len * j / 4]);
        x = x1; y = y1;
      } else {
        const R = a.R, sg = R > 0 ? 1 : -1, Ra = Math.abs(R);
        const cx = x + nlx * R, cy = y + nly * R;               // centre du virage
        const phi = a.len / Ra;                                  // angle balayé
        const a0 = Math.atan2(y - cy, x - cx);
        const start = sg > 0 ? a0 : a0 - phi;
        // rayon intérieur et extérieur du cœur ; le cœur est entre les deux
        scene.push({ type: 'arc', c: [cx, cy], r: Ra - h, a0: start, sw: phi, nOut: nCore, nIn: nClad, tag: 'paroi' + k });
        scene.push({ type: 'arc', c: [cx, cy], r: Ra + h, a0: start, sw: phi, nOut: nClad, nIn: nCore, tag: 'paroi' + k });
        for (let j = 1; j <= 12; j++) { const ang = a0 + sg * phi * j / 12; center.push([cx + Ra * Math.cos(ang), cy + Ra * Math.sin(ang)]); }
        const aEnd = a0 + sg * phi;
        x = cx + Ra * Math.cos(aEnd); y = cy + Ra * Math.sin(aEnd); hd += sg * phi;
      }
    }
    // face de sortie : cœur du côté droit de p→q (en arrière)
    const ex = -Math.sin(hd), ey = Math.cos(hd);
    scene.push({ type: 'line', p: [x - ex * h, y - ey * h], q: [x + ex * h, y + ey * h], nL: nCore, nR: n0, tag: 'sortie' });
    return { scene, center, end: { x, y, heading: hd }, entry };
  }
  // Ouverture numérique et angle d'acceptance (dans le milieu extérieur d'indice n0) d'une fibre droite.
  function acceptance(nCore, nClad, n0) {
    const na = Math.sqrt(Math.max(0, nCore * nCore - nClad * nClad)), m = n0 == null ? 1 : n0;
    return { NA: na, theta: na / m >= 1 ? PI / 2 : Math.asin(na / m) };
  }

  // ---------- Lentilles
  // Lentille mince : 1/d_o + 1/d_i = 1/f, m = −d_i/d_o.
  function thinLens(f, dObj, hObj) {
    const h = hObj == null ? 1 : hObj, inv = 1 / f - 1 / dObj;
    const dImg = Math.abs(inv) < 1e-15 ? Infinity : 1 / inv;
    const m = isFinite(dImg) ? -dImg / dObj : Infinity;
    return { dImg, hImg: m * h, m, real: dImg > 0 && isFinite(dImg) };
  }
  // Formule des opticiens (lentille mince).
  function lensmaker(R1, R2, n) { return 1 / ((n - 1) * (1 / R1 - 1 / R2)); }
  // Lentille épaisse dans l'air : focale effective (mesurée depuis le plan principal image),
  // tirage arrière bfd (depuis le sommet de sortie), tirage avant ffd (depuis le sommet d'entrée).
  function thickLens(R1, R2, n, e) {
    const c1 = 1 / R1, c2 = 1 / R2, P = (n - 1) * (c1 - c2 + (n - 1) * e * c1 * c2 / n), f = 1 / P;
    return { f, bfd: f * (1 - (n - 1) * e * c1 / n), ffd: f * (1 + (n - 1) * e * c2 / n) };
  }
  // Demi-hauteur de la flèche (sagitta) d'une calotte de rayon R à la hauteur h.
  const sag = (R, h) => (!isFinite(R) ? 0 : Math.sign(R) * (Math.abs(R) - Math.sqrt(Math.max(0, R * R - h * h))));
  // Lentille épaisse réelle en deux surfaces sphériques, centrée en x0 sur l'axe, d'indice n dans un milieu nm.
  // Retour : { scene, x1, x2 (sommets), hMax (demi-ouverture utilisable : là où les faces se rejoignent) }
  function lensSurfaces(R1, R2, n, e, opts) {
    const o = opts || {}, x0 = o.x0 || 0, nm = o.nm == null ? 1 : o.nm;
    const x1 = x0 - e / 2, x2 = x0 + e / 2;
    // hMax : hauteur où l'épaisseur au bord s'annule, bornée par les rayons de courbure
    let hMax = Math.min(isFinite(R1) ? Math.abs(R1) : Infinity, isFinite(R2) ? Math.abs(R2) : Infinity, o.h || Infinity);
    const edge = hh => e - sag(R1, hh) + sag(R2, hh);
    if (edge(hMax * 0.999999) <= 0) { let lo = 0, hi = hMax; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (edge(m) > 0) lo = m; else hi = m; } hMax = lo; }
    if (!isFinite(hMax)) hMax = o.h || 50;
    const scene = [];
    const surf = (xv, R, glassRight) => {
      if (!isFinite(R)) {
        // plan vertical ; p→q vers le haut : la gauche du segment est à gauche (−x)
        scene.push({ type: 'line', p: [xv, -hMax], q: [xv, hMax], nL: glassRight ? nm : n, nR: glassRight ? n : nm });
        return;
      }
      const cx = xv + R, ra = Math.abs(R), al = Math.asin(Math.min(1, hMax / ra));
      const a0 = R > 0 ? PI - al : -al;
      // le verre est-il à l'intérieur du cercle ? oui si le centre est du côté du verre
      const glassInside = glassRight ? R > 0 : R < 0;
      scene.push({ type: 'arc', c: [cx, 0], r: ra, a0, sw: 2 * al, nOut: glassInside ? nm : n, nIn: glassInside ? n : nm });
    };
    surf(x1, R1, true);
    surf(x2, R2, false);
    return { scene, x1, x2, hMax };
  }
  // Lentille biconvexe ou biconcave symétrique d'indice n dont la focale effective vaut f,
  // assez épaisse pour garder 1 mm au bord (convergente) ou au centre (divergente) à la demi-ouverture h.
  function designLens(f, n, h) {
    const conv = f > 0, F = Math.abs(f);
    const build = R => conv ? { R1: R, R2: -R, e: 2 * (R - Math.sqrt(Math.max(0, R * R - h * h))) + 1 } : { R1: -R, R2: R, e: 1 };
    let lo = h * 1.0001, hi = 10 * F * (n - 1) * 2 + 10 * h;
    for (let i = 0; i < 80; i++) {
      const R = (lo + hi) / 2, L = build(R), fe = Math.abs(thickLens(L.R1, L.R2, n, L.e).f);
      if (fe > F) hi = R; else lo = R;
    }
    const L = build((lo + hi) / 2);
    return Object.assign(L, { n, f: thickLens(L.R1, L.R2, n, L.e).f });
  }

  // ---------- Dispersion
  const GLASS = {
    BK7: { name: 'BK7', A: 1.5046, B: 4200 },
    flint: { name: 'flint F2', A: 1.592, B: 9800 },
    eau: { name: 'eau', A: 1.3238, B: 3141 }
  };
  function cauchy(lambda, glass) { const g = typeof glass === 'string' ? GLASS[glass] : glass; return g.A + g.B / (lambda * lambda); }
  // Prisme d'angle au sommet apex, rayon entrant sous theta1 (depuis la normale de la première face).
  function prismDeviation(n, apex, theta1) {
    const r1 = Math.asin(Math.sin(theta1) / n), r2 = apex - r1, s2 = n * Math.sin(r2);
    if (Math.abs(s2) > 1) return { D: NaN, theta2: NaN, r1, r2, total: true };
    const theta2 = Math.asin(s2);
    return { D: theta1 + theta2 - apex, theta2, r1, r2, total: false };
  }
  function minDeviation(n, apex) {
    const s = n * Math.sin(apex / 2);
    if (s > 1) return { D: NaN, theta1: NaN };
    const th = Math.asin(s);
    return { D: 2 * th - apex, theta1: th };
  }
  // Goutte sphérique de rayon 1 centrée à l'origine, une réflexion interne. Un rayon horizontal (vers +x)
  // entre à la hauteur b (0 < b < 1). points : entrée, réflexion arrière, sortie ; dir : direction de sortie.
  // D : déviation totale (π + 2i − 4r) ; angle : angle entre le rayon sortant et la direction d'où vient
  // la lumière (π − D), celui sous lequel on voit l'arc. I : énergie sortante T·R·T (Fresnel, non polarisée).
  function dropRay(n, b) {
    const i = Math.asin(b), r = Math.asin(b / n);
    const p0 = [-Math.sqrt(1 - b * b), b];
    const d1 = refractDir(1, 0, p0[0], p0[1], 1, n);
    const t1 = -2 * (p0[0] * d1[0] + p0[1] * d1[1]);
    const p1 = [p0[0] + t1 * d1[0], p0[1] + t1 * d1[1]];
    const d2 = reflectDir(d1[0], d1[1], p1[0], p1[1]);
    const t2 = -2 * (p1[0] * d2[0] + p1[1] * d2[1]);
    const p2 = [p1[0] + t2 * d2[0], p1[1] + t2 * d2[1]];
    const d3 = refractDir(d2[0], d2[1], -p2[0], -p2[1], n, 1);
    const F1 = fresnel(1, n, i), F2 = fresnel(n, 1, r);
    return { i, r, D: PI + 2 * i - 4 * r, angle: Math.acos(-d3[0]), points: [p0, p1, p2], dir: d3, I: F1.T * F2.R * F2.T };
  }
  // Angle de l'arc primaire (minimum de déviation) : cos² i = (n² − 1)/3.
  function rainbowAngle(n) {
    const i = Math.acos(Math.sqrt((n * n - 1) / 3)), r = Math.asin(Math.sin(i) / n), D = PI + 2 * i - 4 * r;
    return { i, r, D, angle: PI - D };
  }
  // Couleur approximative (sRGB 0..255) d'une longueur d'onde visible ; gris en dehors de 380-750 nm.
  function visibleColor(lambda) {
    const l = lambda;
    if (l < 380 || l > 750) return [128, 128, 128];
    let r = 0, g = 0, b = 0;
    if (l < 440) { r = -(l - 440) / 60; b = 1; }
    else if (l < 490) { g = (l - 440) / 50; b = 1; }
    else if (l < 510) { g = 1; b = -(l - 510) / 20; }
    else if (l < 580) { r = (l - 510) / 70; g = 1; }
    else if (l < 645) { r = 1; g = -(l - 645) / 65; }
    else { r = 1; }
    const k = l < 420 ? 0.3 + 0.7 * (l - 380) / 40 : l > 700 ? 0.3 + 0.7 * (750 - l) / 50 : 1;
    const gm = 0.8, c = v => Math.round(255 * Math.pow(Math.max(0, v * k), gm));
    return [c(r), c(g), c(b)];
  }
  const LAMBDA = { rouge: 656, jaune: 589, bleu: 486 };

  // ---------- Polarisation
  // Loi de Malus : intensité transmise par un polariseur idéal faisant l'angle a avec la vibration incidente.
  function malus(I, a) { const c = Math.cos(a); return I * c * c; }
  // Suite de polariseurs idéaux d'axes angles[k] (rad). Lumière naturelle : la moitié passe le premier.
  // Lumière polarisée : vibration initiale selon pol0. Retour : intensités après chaque polariseur.
  function chain(I0, angles, unpolarized, pol0) {
    const out = [];
    let I = I0, dir = pol0 || 0;
    for (let k = 0; k < angles.length; k++) {
      I = k === 0 && unpolarized ? I / 2 : malus(I, angles[k] - dir);
      dir = angles[k]; out.push(I);
    }
    return out;
  }
  // Reflet sur une vitre (n) sous l'incidence theta, regardé à travers un polariseur dont l'axe fait
  // l'angle alpha avec la direction s (perpendiculaire au plan d'incidence, horizontale pour un reflet au sol).
  function glare(n1, n2, theta, alpha) {
    const F = fresnel(n1, n2, theta), ca = Math.cos(alpha), sa = Math.sin(alpha);
    const Rs = F.Rs / 2, Rp = F.Rp / 2;                       // lumière naturelle : moitié dans chaque polarisation
    return { R: Rs + Rp, Rs, Rp, P: (F.Rs - F.Rp) / (F.Rs + F.Rp), through: Rs * ca * ca + Rp * sa * sa };
  }

  return {
    C, MEDIA, GLASS, LAMBDA, mulberry32, speed,
    snell, critical, brewster, fresnel, wavefront,
    trace, axisCross, fiber, acceptance,
    thinLens, lensmaker, thickLens, sag, lensSurfaces, designLens,
    cauchy, prismDeviation, minDeviation, dropRay, rainbowAngle, visibleColor,
    malus, chain, glare
  };
})();
/* OPT-END */

if (typeof module !== 'undefined') module.exports = Opt;
