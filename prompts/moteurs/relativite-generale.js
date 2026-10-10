/* GR-BEGIN */
const GR = (() => {
  'use strict';
  // Les grandeurs d'entrée et les résultats sont en SI. L'angle orbital est en radians.
  // G : CODATA 2022 ; c : définition SI ; masses et rayons : valeurs de référence IAU/NASA.
  const G = 6.67430e-11;
  const c = 299792458;
  const MS = 1.98847e30;
  const RS = 6.957e8;
  const ME = 5.972e24;
  const RE = 6.371e6;
  const GM_E = 3.986004418e14;
  const G0 = 9.80665;
  const DAY = 86400;
  const YEAR = 365.25 * DAY;
  const ARCSEC = 180 * 3600 / Math.PI;
  const mu = M => G * M;
  const limite = (v, bas, haut) => Math.max(bas, Math.min(haut, v));
  const valide = (v, nom) => { if (!(Number.isFinite(v) && v > 0)) throw new RangeError(nom + ' doit être positif et fini'); return v; };

  function rs(M) { return 2 * G * valide(M, 'M') / (c * c); }
  function isco(M) { return 3 * rs(M); }
  function photonSphere(M) { return 1.5 * rs(M); }
  function gravRate(r, M) {
    valide(r, 'r');
    return r <= rs(M) ? 0 : Math.sqrt(1 - rs(M) / r);
  }
  function redshiftFactor(r, M) { return gravRate(r, M); }
  function weakRate(h, g = G0) { return 1 + g * h / (c * c); }
  function poundRebka(h, g = G0) { return g * h / (c * c); }

  function cabin({mode = 'sol', g = G0, largeur = 3, hauteur = 3} = {}, dt = 0) {
    if (!['sol', 'fusée', 'chute', 'flotte'].includes(mode)) throw new RangeError('Situation inconnue');
    const apparent = mode === 'sol' || mode === 'fusée' ? g : 0;
    const t = Math.max(0, dt);
    const descente = limite(apparent * t * t / 2, 0, hauteur - 0.35);
    const laserSag = apparent * (largeur / c) ** 2 / 2;
    const laser = Array.from({length: 41}, (_, i) => {
      const x = largeur * i / 40;
      return {x, y: apparent * (x / c) ** 2 / 2};
    });
    return {mode, accelerationApparente: apparent, balle: {x: largeur * 0.5, y: 0.35 + descente, chute: descente}, laser, laserSag, largeur, hauteur};
  }

  function gpsBudget({rOrbit = 26560e3} = {}) {
    if (rOrbit <= RE) throw new RangeError('Orbite au-dessus de la surface');
    const sol = gravRate(RE, ME);
    const altitude = gravRate(rOrbit, ME);
    const v = Math.sqrt(GM_E / rOrbit);
    // La séparation des effets est faite relativement à une horloge statique au sol.
    const dGrav = DAY * 1e6 * (altitude / sol - 1);
    const dV = DAY * 1e6 * (altitude / sol) * (Math.sqrt(1 - v * v / (c * c)) - 1);
    const total = dGrav + dV;
    return {rOrbit, altitude: rOrbit - RE, vitesse: v, gravitation: dGrav, cinematique: dV,
      total, erreurMetres: Math.abs(total) * 1e-6 * c, unites: 'µs/jour'};
  }

  function rk4(y, dy, pas, accel) {
    const a1 = accel(y), k1 = dy;
    const a2 = accel(y + pas * k1 / 2), k2 = dy + pas * a1 / 2;
    const a3 = accel(y + pas * k2 / 2), k3 = dy + pas * a2 / 2;
    const a4 = accel(y + pas * k3), k4 = dy + pas * a3;
    return [y + pas * (k1 + 2 * k2 + 2 * k3 + k4) / 6,
      dy + pas * (a1 + 2 * a2 + 2 * a3 + a4) / 6];
  }

  function orbitInit(a, e, M) {
    valide(a, 'a');
    if (!(e >= 0 && e < 1)) throw new RangeError('0 ≤ e < 1');
    const p = a * (1 - e * e), h = Math.sqrt(mu(M) * p), w = 1 + e;
    return {phi: 0, p, h, w, dw: 0, u: w / p, du: 0, r: p / w};
  }
  function orbitStep(s, M, dt) {
    // Choix documenté : dt est un incrément d'angle Δφ, non un temps en secondes.
    // w = p/r évite de soustraire de petits nombres lors des avances de périhélie.
    const p = s.p ?? s.h * s.h / mu(M);
    const k = 3 * mu(M) / (c * c * p);
    const w = s.w ?? s.u * p, dw = s.dw ?? s.du * p;
    const accel = x => 1 - x + k * x * x;
    const [wn, dwn] = rk4(w, dw, dt, accel);
    return {...s, phi: (s.phi ?? 0) + dt, p, w: wn, dw: dwn,
      u: wn / p, du: dwn / p, r: p / wn};
  }
  function orbitAdvanceNumeric(a, e, M, pas = 0.0015) {
    if (!(e > 0 && e < 1)) throw new RangeError('Orbite elliptique nécessaire');
    let s = orbitInit(a, e, M), precedent = s;
    const n = Math.ceil(2.1 * Math.PI / pas), h = 2.1 * Math.PI / n;
    for (let i = 0; i < n; i++) {
      s = orbitStep(s, M, h);
      if (precedent.dw > 0 && s.dw <= 0 && s.phi > 1.5 * Math.PI) {
        const alpha = precedent.dw / (precedent.dw - s.dw);
        return precedent.phi + alpha * (s.phi - precedent.phi) - 2 * Math.PI;
      }
      precedent = s;
    }
    throw new Error('Périhélie suivant non détecté');
  }
  function precession(a, e, M) {
    valide(a, 'a');
    const parTour = 6 * Math.PI * mu(M) / (c * c * a * (1 - e * e));
    const periode = 2 * Math.PI * Math.sqrt(a ** 3 / mu(M));
    return {parTour, secondesArcTour: parTour * ARCSEC, secondesArcSiecle: parTour * ARCSEC * (100 * YEAR / periode), periode};
  }

  function photonPath(b, M, options = {}) {
    valide(b, 'b');
    const pasVoulu = options.pas ?? 0.0025;
    const phiMax = options.phiMax ?? 22;
    const pas = phiMax / Math.ceil(phiMax / pasVoulu);
    const k = 3 * mu(M) / (c * c * b);
    // w = b/r ; à l'infini entrant : w(0)=0 et w'(0)=1.
    // w'' + w = (3GM/c²b) w² ; la sortie à w=0 fixe l'angle observé.
    let phi = 0, w = 0, dw = 1, maxi = 0, points = [], angle = null, capture = false;
    const accel = x => -x + k * x * x;
    const conserver = () => {
      if (w > 0 && Number.isFinite(w)) {
        const r = b / w;
        if (r < 18 * b && (points.length === 0 || phi - points[points.length - 1].phi > 0.015))
          points.push({phi, r, x: r * Math.cos(phi), y: r * Math.sin(phi)});
        maxi = Math.max(maxi, w);
      }
    };
    for (let i = 0; i < Math.ceil(phiMax / pas); i++) {
      const ancien = w, penteAvant = dw, pAvant = phi;
      [w, dw] = rk4(w, dw, pas, accel); phi += pas;
      if (!Number.isFinite(w) || w > b / rs(M) * 1.005) { capture = true; break; }
      if (w <= 0 && i > 3) {
        // Une interpolation cubique d'Hermite évite une erreur dominante sur
        // un angle astronomique très petit (une interpolation linéaire ne suffit pas).
        const hermite = t => (2*t*t*t-3*t*t+1)*ancien +
          (t*t*t-2*t*t+t)*pas*penteAvant + (-2*t*t*t+3*t*t)*w +
          (t*t*t-t*t)*pas*dw;
        let bas = 0, haut = 1;
        for (let j = 0; j < 38; j++) {
          const milieu = (bas + haut) / 2;
          if (hermite(milieu) > 0) bas = milieu; else haut = milieu;
        }
        angle = pAvant + (bas + haut) * pas / 2 - Math.PI;
        break;
      }
      conserver();
    }
    if (angle === null) capture = true;
    return {points, angle: capture ? null : angle, capture,
      rMin: maxi > 0 ? b / maxi : Infinity, faible: 4 * mu(M) / (c * c * b),
      newton: 2 * mu(M) / (c * c * b), b};
  }
  function deflection(b, M) { return photonPath(b, M).angle; }
  function effPotential(r, L, M, massive = true) {
    valide(r, 'r');
    const f = 1 - rs(M) / r;
    // (dr/dτ)²/2 + Veff = E²/2 (massif), unités m²/s².
    // Photon : même écriture avec un paramètre affine et un L normalisé.
    return f * ((massive ? c * c : 0) + L * L / (r * r)) / 2;
  }
  function circularOrbit(r, M, massive = true) {
    const rayon = rs(M);
    if (!massive) return {r: photonSphere(M), possible: Math.abs(r / photonSphere(M) - 1) < 1e-9,
      stable: false, type: 'photon'};
    const possible = r > 1.5 * rayon;
    return {r, possible, stable: possible && r > 3 * rayon,
      L: possible ? Math.sqrt(mu(M) * r * r / (r - 1.5 * rayon)) : null,
      type: possible && r > 3 * rayon ? 'stable' : possible ? 'instable' : 'impossible'};
  }
  function photonCircularResidual(M) {
    const r = photonSphere(M), u = 1 / r;
    return -u + 3 * mu(M) * u * u / (c * c);
  }
  function embedding(r, M) {
    return r < rs(M) ? null : 2 * Math.sqrt(rs(M) * (r - rs(M)));
  }
  function tidal(r, M, longueur = 2) {
    return 2 * mu(M) * longueur / (r ** 3);
  }
  function infallRedshift(r, r0, M) {
    const horizon = rs(M);
    if (r <= horizon) return 0;
    if (r > r0) throw new RangeError('Sonde au-dessus du départ');
    const E = Math.sqrt(1 - horizon / r0), f = 1 - horizon / r;
    // Photon radial sortant émis par une sonde en chute libre depuis le repos.
    return f / (E + Math.sqrt(Math.max(0, E * E - f)));
  }
  function infall(r0, M) {
    const horizon = rs(M);
    if (r0 <= horizon) throw new RangeError('Départ hors de l’horizon obligatoire');
    const q = horizon / r0, E = Math.sqrt(1 - q), A = Math.sqrt(r0 ** 3 / (8 * mu(M)));
    const etaH = Math.acos(2 * q - 1);
    const tau = eta => A * (eta + Math.sin(eta));
    const rayon = eta => r0 * (1 + Math.cos(eta)) / 2;
    const etaDeR = r => Math.acos(limite(2 * r / r0 - 1, -1, 1));
    const tauH = tau(etaH), tauCentre = Math.PI * A;
    const properAt = r => tau(etaDeR(limite(r, 0, r0)));
    const farAt = r => {
      if (r <= horizon) return Infinity;
      if (r >= r0) return 0;
      const eta = etaDeR(r);
      const z = Math.sqrt(q / (1 - q)) * Math.tan(eta / 2);
      if (z >= 1) return Infinity;
      return E * A * ((1 + 2 * q) * eta + Math.sin(eta)) +
        horizon / c * Math.log((1 + z) / (1 - z));
    };
    const etaPar = (valeur, fn, borne) => {
      let bas = 0, haut = borne;
      for (let i = 0; i < 64; i++) {
        const milieu = (bas + haut) / 2;
        if (fn(milieu) < valeur) bas = milieu; else haut = milieu;
      }
      return (bas + haut) / 2;
    };
    const rAtProper = t => rayon(etaPar(limite(t, 0, tauCentre), tau, Math.PI));
    const rAtFar = t => {
      if (t <= 0) return r0;
      // La coordonnée t ne traverse jamais l'horizon ; asymptote, non blocage de la sonde.
      const fn = eta => farAt(rayon(eta));
      return rayon(etaPar(t, fn, etaH));
    };
    return {r0, M, rs: horizon, E, tauH, tauCentre, rAtProper, rAtFar,
      properAt, farAt, redshiftAt: r => infallRedshift(r, r0, M)};
  }

  return {G, c, MS, RS, ME, RE, GM_E, G0, DAY, YEAR, ARCSEC,
    rs, isco, photonSphere, gravRate, redshiftFactor, weakRate, poundRebka,
    cabin, gpsBudget, orbitInit, orbitStep, orbitAdvanceNumeric, precession,
    photonPath, deflection, effPotential, circularOrbit, photonCircularResidual,
    embedding, tidal, infallRedshift, infall};
})();
/* GR-END */
