// Moteur de la planche « Magnétisme et induction » (Fondations 23).
// Verrouillé : copier à l'identique dans le <script> de la page, du marqueur
// MAG-BEGIN au marqueur MAG-END inclus. Tests : node prompts/moteurs/magnetisme.test.js [page.html]
//
// Conventions
// - Unités SI partout (m, s, A, T, Wb, V, N, J, kg).
// - Repère mathématique de la scène : x vers la droite, y vers le HAUT, z sort de l'écran.
//   La page retourne y au dessin (canvas : y vers le bas).
// - Sources « axiales » (spire, bobine, aimant) : axe horizontal (selon x), centre (x, y).
//   Courant I > 0 = sens direct autour de +x (règle de la main droite) : le champ au centre
//   pointe vers +x, le pôle nord est du côté +x. Vue en coupe : le conducteur du haut porte
//   un courant qui sort de l'écran (⊙), celui du bas un courant qui y entre (⊗).
// - Fil rectiligne perpendiculaire à l'écran : I > 0 = courant qui sort de l'écran (⊙),
//   champ qui tourne dans le sens antihoraire.
// - Flux d'une bobine : compté selon +x ; f.é.m. et courant induits > 0 = sens direct autour de +x.

/* MAG-BEGIN */
const Mag = (function () {
  'use strict';
  const PI = Math.PI;
  const MU0 = 4e-7 * PI;
  const QE = 1.602176634e-19;
  const MP = 1.67262192e-27;      // proton
  const MD = 3.3435837768e-27;    // deutéron
  const MA = 6.6446573450e-27;    // particule alpha
  const ME = 9.1093837015e-31;    // électron
  const G = 9.81;
  const B_TERRE_H = 18e-6;        // composante horizontale vers Montréal, ≈ 18 µT
  const B_TERRE = 53e-6;          // champ total vers Montréal, ≈ 53 µT
  const RHO = { cuivre: 1.68e-8, aluminium: 2.65e-8 };   // résistivités, Ω·m
  const DENS_NDFEB = 7500;        // kg/m³

  // ---------- Intégrales elliptiques complètes K(m), E(m), m = k², par la moyenne arithmético-géométrique
  function ellipKE(m) {
    if (m < 0) m = 0;
    if (m > 1 - 1e-15) m = 1 - 1e-15;
    let a = 1, b = Math.sqrt(1 - m), c = Math.sqrt(m);
    let sum = 0.5 * c * c, p2 = 0.5;
    for (let i = 0; i < 40 && Math.abs(c) > 1e-15; i++) {
      const an = 0.5 * (a + b);
      c = 0.5 * (a - b);
      b = Math.sqrt(a * b);
      a = an;
      p2 *= 2;
      sum += p2 * c * c;
    }
    const K = PI / (2 * a);
    return { K: K, E: K * (1 - sum) };
  }

  // ---------- Spire circulaire (rayon a, courant I) : champ exact au point (dz, rho)
  // dz : position axiale relative au plan de la spire ; rho : distance signée à l'axe.
  function loopField(I, a, dz, rho) {
    const s = rho < 0 ? -1 : 1;
    const r = Math.abs(rho);
    const C = MU0 * I / PI;
    if (r < 1e-7 * a) {
      const d = a * a + dz * dz;
      return { bz: MU0 * I * a * a / (2 * Math.pow(d, 1.5)),
               brho: s * 3 * MU0 * I * a * a * dz * r / (4 * Math.pow(d, 2.5)) };
    }
    const r2 = a * a + r * r + dz * dz;
    let alpha2 = r2 - 2 * a * r;
    const amin = 1e-3 * a;
    if (alpha2 < amin * amin) alpha2 = amin * amin;   // adoucissement sur le conducteur
    const beta2 = r2 + 2 * a * r;
    const beta = Math.sqrt(beta2);
    const ke = ellipKE(1 - alpha2 / beta2);
    const bz = C / (2 * alpha2 * beta) * ((a * a - r * r - dz * dz) * ke.E + alpha2 * ke.K);
    const brho = C * dz / (2 * alpha2 * beta * r) * ((a * a + r * r + dz * dz) * ke.E - alpha2 * ke.K);
    return { bz: bz, brho: s * brho };
  }

  // ---------- Inductance mutuelle de deux cercles coaxiaux (Maxwell) : flux dans le cercle b
  // dû à 1 A dans le cercle a, distance axiale d.
  function mutual(a, b, d) {
    const k2 = 4 * a * b / ((a + b) * (a + b) + d * d);
    const k = Math.sqrt(k2);
    const ke = ellipKE(k2);
    return MU0 * Math.sqrt(a * b) * ((2 / k - k) * ke.K - (2 / k) * ke.E);
  }

  // ---------- Sources
  // {kind:'fil', I, x, y}
  // {kind:'spire', I, a, x, y}
  // {kind:'bobine', I, N, a, L, x, y}          N spires réparties sur la longueur L
  // {kind:'aimant', Br, a, L, x, y, dir}       cylindre aimanté uniformément ; dir = +1 : nord à droite
  // {kind:'uniforme', bx, by}
  // Spires représentatives d'une bobine ou d'un aimant : espacement ≤ a/4, entre 12 et NREP
  const NREP = 80;
  function nRep(src) { return Math.min(NREP, Math.max(12, Math.ceil(4 * src.L / src.a))); }
  function loopsOf(src) {
    if (src.kind === 'spire') return [{ a: src.a, x: src.x, y: src.y, I: src.I }];
    let n, Iloop;
    if (src.kind === 'bobine') {
      n = Math.min(src.N, nRep(src));
      Iloop = src.I * src.N / n;
    } else if (src.kind === 'aimant') {
      n = nRep(src);
      Iloop = (src.dir === -1 ? -1 : 1) * (src.Br / MU0) * src.L / n;   // courant de surface K = M = Br/μ0
    } else return [];
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push({ a: src.a, x: src.x - src.L / 2 + (i + 0.5) * src.L / n, y: src.y, I: Iloop });
    }
    return out;
  }

  // Champ total au point (x, y) du plan de la scène : {bx, by, b}
  function fieldAt(sources, x, y) {
    let bx = 0, by = 0;
    for (let i = 0; i < sources.length; i++) {
      const s = sources[i];
      if (s.kind === 'uniforme') { bx += s.bx; by += s.by; continue; }
      if (s.kind === 'fil') {
        const dx = x - s.x, dy = y - s.y;
        let r2 = dx * dx + dy * dy;
        if (r2 < 1e-12) r2 = 1e-12;
        const f = MU0 * s.I / (2 * PI * r2);
        bx += -f * dy; by += f * dx;
        continue;
      }
      const L = s._loops || loopsOf(s);
      for (let j = 0; j < L.length; j++) {
        const l = L[j];
        const f = loopField(l.I, l.a, x - l.x, y - l.y);
        bx += f.bz; by += f.brho;
      }
    }
    return { bx: bx, by: by, b: Math.hypot(bx, by) };
  }

  // Précalcule les spires d'une liste de sources (à rappeler après tout changement de paramètre)
  function prepare(sources) {
    for (const s of sources) if (s.kind === 'spire' || s.kind === 'bobine' || s.kind === 'aimant') s._loops = loopsOf(s);
    return sources;
  }

  // Points où les conducteurs traversent le plan de la scène, pour dessiner ⊙ et ⊗
  // sens : +1 sort de l'écran, -1 y entre
  function crossings(src) {
    if (src.kind === 'fil') return [{ x: src.x, y: src.y, sens: src.I >= 0 ? 1 : -1 }];
    const L = loopsOf(src), out = [];
    for (const l of L) {
      const s = l.I >= 0 ? 1 : -1;
      out.push({ x: l.x, y: l.y + l.a, sens: s }, { x: l.x, y: l.y - l.a, sens: -s });
    }
    return out;
  }

  // ---------- Lignes de champ : RK4 sur la direction de B, pas de longueur ds
  // opts : {ds, nmax, xmin, xmax, ymin, ymax, both (deux sens, défaut true), rStop (arrêt près d'un conducteur)}
  // Renvoie {pts:[[x,y]...], closed}
  function traceLine(sources, x0, y0, opts) {
    const o = Object.assign({ ds: 0.002, nmax: 3000, both: true, rStop: 0 }, opts || {});
    const cr = [];
    if (o.rStop > 0) for (const s of sources) if (s.kind !== 'uniforme') for (const c of crossings(s)) cr.push(c);
    function dir(x, y, sg) {
      const f = fieldAt(sources, x, y);
      if (f.b === 0) return null;
      return [sg * f.bx / f.b, sg * f.by / f.b];
    }
    function inside(x, y) {
      if (o.xmin !== undefined && (x < o.xmin || x > o.xmax || y < o.ymin || y > o.ymax)) return false;
      for (const c of cr) if (Math.hypot(x - c.x, y - c.y) < o.rStop) return false;
      return true;
    }
    function run(sg) {
      const pts = [];
      let x = x0, y = y0, travelled = 0, closed = false;
      for (let i = 0; i < o.nmax; i++) {
        const k1 = dir(x, y, sg); if (!k1) break;
        const k2 = dir(x + 0.5 * o.ds * k1[0], y + 0.5 * o.ds * k1[1], sg); if (!k2) break;
        const k3 = dir(x + 0.5 * o.ds * k2[0], y + 0.5 * o.ds * k2[1], sg); if (!k3) break;
        const k4 = dir(x + o.ds * k3[0], y + o.ds * k3[1], sg); if (!k4) break;
        x += o.ds / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
        y += o.ds / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
        travelled += o.ds;
        if (!inside(x, y)) break;
        pts.push([x, y]);
        if (travelled > 20 * o.ds && Math.hypot(x - x0, y - y0) < 0.75 * o.ds) { closed = true; pts.push([x0, y0]); break; }
      }
      return { pts: pts, closed: closed };
    }
    const fwd = run(1);
    if (fwd.closed || !o.both) return { pts: [[x0, y0]].concat(fwd.pts), closed: fwd.closed };
    const bwd = run(-1);
    return { pts: bwd.pts.reverse().concat([[x0, y0]], fwd.pts), closed: false };
  }

  // Graines conseillées : à travers une source axiale (plan médian), ou sur un rayon pour un fil
  function seeds(src, n) {
    const out = [];
    if (src.kind === 'fil') {
      for (let i = 1; i <= n; i++) out.push([src.x + 0.012 * i * i, src.y]);
      return out;
    }
    for (let i = 0; i < n; i++) {
      const u = -1 + (2 * i + 1) / n;     // ]-1, 1[
      out.push([src.x, src.y + 0.92 * src.a * u]);
    }
    return out;
  }

  // ---------- Boussole : aiguille amortie qui s'aligne sur B (réponse plafonnée pour rester stable)
  // st : {th, w} ; renvoie st. Période ≈ 0,6 s dans 53 µT, plus courte dans un champ plus fort.
  function compassStep(st, bx, by, dt) {
    const b = Math.min(Math.hypot(bx, by), 2e-3);
    if (b === 0) { st.w *= Math.exp(-2 * dt); st.th += st.w * dt; return st; }
    const target = Math.atan2(by, bx);
    const w0 = Math.min(2 * PI / 0.6 * Math.sqrt(b / B_TERRE), 60);
    const n = Math.max(1, Math.ceil(w0 * dt / 0.2));
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      const acc = -w0 * w0 * Math.sin(st.th - target) - 2 * 0.18 * w0 * st.w;
      st.w += acc * h;
      st.th += st.w * h;
    }
    st.th = Math.atan2(Math.sin(st.th), Math.cos(st.th));
    return st;
  }

  // ---------- Force de Lorentz : intégrateur de Boris (3D)
  // p : {x,y,z,vx,vy,vz} ; E, B : {x,y,z}. Modifie et renvoie p.
  function boris(p, q, m, E, B, dt) {
    const h = q * dt / (2 * m);
    let vx = p.vx + h * E.x, vy = p.vy + h * E.y, vz = p.vz + h * E.z;
    const tx = h * B.x, ty = h * B.y, tz = h * B.z;
    const t2 = tx * tx + ty * ty + tz * tz;
    const sx = 2 * tx / (1 + t2), sy = 2 * ty / (1 + t2), sz = 2 * tz / (1 + t2);
    const px = vx + (vy * tz - vz * ty), py = vy + (vz * tx - vx * tz), pz = vz + (vx * ty - vy * tx);
    vx += py * sz - pz * sy; vy += pz * sx - px * sz; vz += px * sy - py * sx;
    p.vx = vx + h * E.x; p.vy = vy + h * E.y; p.vz = vz + h * E.z;
    p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
    return p;
  }

  // Mouvement cyclotron : rayon, période, fréquence, pulsation, pas de l'hélice
  function gyro(m, q, vperp, B, vpar) {
    const w = Math.abs(q) * B / m;
    const T = 2 * PI / w;
    return { r: m * Math.abs(vperp) / (Math.abs(q) * B), T: T, f: 1 / T, omega: w, pas: Math.abs(vpar || 0) * T };
  }

  // Force sur une charge : F = q (E + v × B), vecteurs {x,y,z}
  function lorentz(q, v, E, B) {
    return { x: q * (E.x + v.y * B.z - v.z * B.y), y: q * (E.y + v.z * B.x - v.x * B.z), z: q * (E.z + v.x * B.y - v.y * B.x) };
  }

  // Dérive E × B (sélecteur de vitesse) : vitesse = E × B / B²
  function drift(E, B) {
    const b2 = B.x * B.x + B.y * B.y + B.z * B.z;
    return { x: (E.y * B.z - E.z * B.y) / b2, y: (E.z * B.x - E.x * B.z) / b2, z: (E.x * B.y - E.y * B.x) / b2 };
  }

  // ---------- Force de Laplace : balançoire (tige de longueur L, masse m, suspendue par des fils de longueur ell)
  // dans un champ B horizontal, perpendiculaire à la tige. F = I L B (horizontale).
  function laplace(I, L, B, angle) { return I * L * B * (angle === undefined ? 1 : Math.sin(angle)); }
  function swingEq(I, L, B, m) { return Math.atan2(I * L * B, m * G); }
  // st : {th, w} ; p : {I, L, B, m, ell, gamma}
  function swingStep(st, p, dt) {
    const F = p.I * p.L * p.B;
    const n = Math.max(1, Math.ceil(dt / 0.002)), h = dt / n;
    for (let i = 0; i < n; i++) {
      const acc = (-G * Math.sin(st.th) + (F / p.m) * Math.cos(st.th)) / p.ell - (p.gamma === undefined ? 1.5 : p.gamma) * st.w;
      st.w += acc * h;
      st.th += st.w * h;
    }
    return st;
  }
  // Deux fils parallèles : force par mètre (> 0 : attraction, courants de même sens)
  function wiresForce(I1, I2, d) { return MU0 * I1 * I2 / (2 * PI * d); }

  // ---------- Flux et induction
  // Bobine réceptrice : {N, b (rayon), x, y, L (longueur, 0 = spires confondues), R (résistance totale du circuit, Ω)}
  // Liaison de flux Λ = N Φ (Wb), compté selon +x, due aux sources axiales coaxiales (même y).
  function linkage(sources, coil) {
    const nT = coil.L > 0 ? Math.min(coil.N, 12) : 1;
    const w = coil.N / nT;
    let lam = 0;
    for (let t = 0; t < nT; t++) {
      const xt = coil.L > 0 ? coil.x - coil.L / 2 + (t + 0.5) * coil.L / nT : coil.x;
      for (const s of sources) {
        if (s.kind === 'uniforme') { lam += w * s.bx * PI * coil.b * coil.b; continue; }
        if (s.kind === 'fil') continue;
        const Ls = s._loops || loopsOf(s);
        for (const l of Ls) lam += w * mutual(l.a, coil.b, xt - l.x) * l.I;
      }
    }
    return lam;
  }
  // Flux moyen par spire, Φ = Λ / N
  function fluxPerTurn(sources, coil) { return linkage(sources, coil) / coil.N; }

  // dΛ/dx de l'aimant (ou de toute source) déplacé en bloc selon x : différence centrée
  function dLinkageDx(src, coil, others) {
    const h = 1e-4;
    const x0 = src.x;
    const ext = others || [];
    src.x = x0 + h; src._loops = loopsOf(src);
    const lp = linkage([src].concat(ext), coil);
    src.x = x0 - h; src._loops = loopsOf(src);
    const lm = linkage([src].concat(ext), coil);
    src.x = x0; src._loops = loopsOf(src);
    return (lp - lm) / (2 * h);
  }
  // f.é.m. induite quand la source se déplace à vx : ε = −dΛ/dt = −(dΛ/dx)·vx
  function emfMoving(src, coil, vx, others) { return -dLinkageDx(src, coil, others) * vx; }

  // Génératrice : N spires de surface A tournant à ω dans un champ uniforme B
  // Φ par spire = B A cos(ωt + φ0) ; ε = N B A ω sin(ωt + φ0)
  function generator(p, t) {
    const ph = p.omega * t + (p.phi0 || 0);
    return { phi: p.B * p.A * Math.cos(ph), lam: p.N * p.B * p.A * Math.cos(ph), emf: p.N * p.B * p.A * p.omega * Math.sin(ph) };
  }

  // Deux bobines (expérience de Faraday, 1831) : primaire RL alimenté par V0 à t = 0
  // courant I1(t) = (V0/R1)(1 − e^(−t/τ)), τ = L1/R1 ; ε2 = −M dI1/dt
  function inductance(coil) {
    // inductance propre approchée d'une bobine : formule de Wheeler (spires jointives), en H
    const a = coil.b, L = Math.max(coil.L, 1e-4);
    return MU0 * coil.N * coil.N * PI * a * a / (L + 0.9 * a);
  }
  function mutualCoils(c1, c2) {
    const one = { kind: 'bobine', I: 1, N: c1.N, a: c1.b, L: Math.max(c1.L, 1e-4), x: c1.x, y: c1.y };
    one._loops = loopsOf(one);
    return linkage([one], c2);
  }
  function faradayPair(p, t) {
    // p : {V0, R1, L1, M, ton, toff} ; interrupteur fermé de ton à toff (toff facultatif)
    const tau = p.L1 / p.R1, Imax = p.V0 / p.R1;
    let I1 = 0, dI = 0;
    if (t >= p.ton) {
      if (p.toff === undefined || t < p.toff) {
        const e = Math.exp(-(t - p.ton) / tau);
        I1 = Imax * (1 - e); dI = Imax * e / tau;
      } else {
        const Ioff = Imax * (1 - Math.exp(-(p.toff - p.ton) / tau));
        const e = Math.exp(-(t - p.toff) / tau);
        I1 = Ioff * e; dI = -Ioff * e / tau;
      }
    }
    return { I1: I1, dI1: dI, emf2: -p.M * dI, tau: tau };
  }

  // ---------- Freinage par induction : mouvement à frottement linéaire, pas exact
  // m dv/dt = F − k v ; s : {x, v, W (travail de F), Q (énergie dissipée)} ; p : {m, F, k}
  // k < 0 est accepté pour l'expérience de pensée « Lenz inversé » : la vitesse diverge et Q devient
  // négatif (de l'énergie sortie de nulle part). La page plafonne alors la vitesse et le dit.
  function dragStep(s, p, dt) {
    const m = p.m, F = p.F, k = p.k;
    if (!k || !isFinite(k)) {
      const v1 = s.v + F / m * dt;
      const dx = 0.5 * (s.v + v1) * dt;
      s.x += dx; s.W += F * dx; s.v = v1;
      return s;
    }
    const tau = m / k, vT = F / k, u = s.v - vT;
    const e = Math.exp(-dt / tau), e2 = e * e;
    const dx = vT * dt + u * tau * (1 - e);
    s.Q += k * (vT * vT * dt + 2 * vT * u * tau * (1 - e) + u * u * tau / 2 * (1 - e2));
    s.W += F * dx;
    s.x += dx;
    s.v = vT + u * e;
    return s;
  }

  // Rails : tige de longueur ell, masse m, circuit de résistance R, champ B perpendiculaire au plan des rails
  // k = B² ell² / R ; ε = B ell v ; I = ε / R ; force de freinage = −I ell B (s'oppose toujours à v)
  function rails(p) {
    const open = p.open || !(p.R > 0);
    const k = open ? 0 : p.B * p.B * p.ell * p.ell / p.R;
    return { k: k, tau: k > 0 ? p.m / k : Infinity, vT: k > 0 ? p.F / k : Infinity };
  }
  function railsState(p, v) {
    const emf = p.B * p.ell * v;
    const I = (p.open || !(p.R > 0)) ? 0 : emf / p.R;
    return { emf: emf, I: I, Ffrein: -I * p.ell * p.B, Pjoule: I * I * (p.R || 0), Pmeca: p.F * v };
  }

  // Aimant qui tombe dans un tube conducteur : le tube est découpé en anneaux de hauteur dz.
  // Chaque anneau de rayon moyen b, d'épaisseur w, résistance R = ρ 2π b / (w dz), reçoit ε = −(dΦ/dz) v.
  // Puissance dissipée = v² Σ (dΦ/dz)² / R = k v², d'où k = (w / (2π b ρ)) ∫ (dΦ/dz)² dz.
  // tube : {b (rayon intérieur), w (épaisseur de paroi), rho (Ω·m), fendu (bool)} ; magnet : source 'aimant'
  // (inductance propre des anneaux négligée : valable tant que le freinage est lent)
  function tubeBrake(magnet, tube) {
    if (tube.fendu || !(tube.rho > 0) || !(tube.w > 0)) return 0;
    const bm = tube.b + tube.w / 2;
    const ring = { N: 1, b: bm, x: 0, y: magnet.y, L: 0 };
    const src = Object.assign({}, magnet, { x: 0 });
    src._loops = loopsOf(src);
    const span = 12 * Math.max(magnet.L, magnet.a, bm), n = 1200, h = 2 * span / n;
    let integ = 0, prev = null;
    for (let i = 0; i <= n; i++) {
      ring.x = -span + i * h;
      const phi = linkage([src], ring);
      if (prev !== null) { const d = (phi - prev) / h; integ += d * d * h; }
      prev = phi;
    }
    return tube.w / (2 * PI * bm * tube.rho) * integ;
  }
  // Profil de flux d'un anneau du tube autour de l'aimant : pour n positions dz ∈ [−span, span]
  // (dz = position de l'anneau moins centre de l'aimant, selon l'axe nord), renvoie {dz, phi, dphi}.
  // f.é.m. de l'anneau quand l'aimant avance à v selon son axe : ε = +dphi · v (l'anneau recule de v
  // par rapport à l'aimant) ; courant = ε / R_anneau, sens direct autour de l'axe si > 0.
  function ringProfile(magnet, tube, n, span) {
    const bm = tube.b + tube.w / 2;
    const ring = { N: 1, b: bm, x: 0, y: magnet.y, L: 0 };
    const src = Object.assign({}, magnet, { x: 0 });
    src._loops = loopsOf(src);
    const out = [], h = 1e-4;
    for (let i = 0; i < n; i++) {
      const dz = -span + 2 * span * i / (n - 1);
      ring.x = dz; const phi = linkage([src], ring);
      ring.x = dz + h; const pp = linkage([src], ring);
      ring.x = dz - h; const pm = linkage([src], ring);
      out.push({ dz: dz, phi: phi, dphi: (pp - pm) / (2 * h) });
    }
    return out;
  }
  function magnetMass(magnet) { return DENS_NDFEB * PI * magnet.a * magnet.a * magnet.L; }

  return {
    MU0, QE, MP, MD, MA, ME, G, B_TERRE, B_TERRE_H, RHO, NREP,
    ellipKE, loopField, mutual, loopsOf, prepare, fieldAt, crossings, traceLine, seeds, compassStep,
    boris, gyro, lorentz, drift, laplace, swingEq, swingStep, wiresForce,
    linkage, fluxPerTurn, dLinkageDx, emfMoving, generator, inductance, mutualCoils, faradayPair,
    dragStep, rails, railsState, tubeBrake, ringProfile, magnetMass
  };
})();
/* MAG-END */
if (typeof module !== 'undefined') module.exports = Mag;
