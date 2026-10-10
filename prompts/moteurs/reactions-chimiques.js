/* RXN-BEGIN */
/* Moteur Rxn : réactions chimiques (module 30). Fonctions pures autant que possible, aucune dépendance au dessin.
   Unités : SI (J/mol, K, s, Pa, m³) sauf la boîte 2D, en unités réduites (diamètre σ = 1, masse m = 1, k_B = 1 :
   énergies et températures dans la même unité ε, temps en τ = σ√(m/ε)).
   Tout le hasard passe par mulberry32 (graine) ; Box-Muller pour les normales.

   Boîte réactive 2D (étapes 1 à 3)
   - Disques durs de même diamètre et de même masse, collisions élastiques, pas fixe dt avec retour à l'instant exact
     du contact (géométrie de collision exacte pour une collision binaire), grille de cellules.
   - Espèces : 0 = A, 1 = B, 2 = C, 3 = D (produits). Réaction A + B → C + D si
       E_lc = ½ μ g_n² > Ea   (énergie cinétique relative le long de la ligne des centres, μ = m/2)
     et, si l'orientation est exigée, si le site réactif de A (demi-cône α autour de son axe) pointe vers B.
     Les orientations tournent librement (sans échange d'énergie) : au contact, elles sont uniformes,
     donc le facteur stérique vaut P = 2α/2π = α/π (α = 45° → P = 1/4).
   - ΔH : la composante normale de la vitesse relative sort avec |g_n'| = √(g_n² − 2ΔH/μ) : l'énergie cinétique
     de la paire change de −ΔH exactement (exothermique ΔH < 0 : elle gagne), la quantité de mouvement est conservée.
     On impose Ea ≥ ΔH (une réaction endothermique ne peut pas avoir une barrière plus basse que son ΔH).
   - Thermostat : parois à température T (réémission thermique avec un coefficient d'accommodation acc ;
     acc = 0 : parois spéculaires, énergie conservée).
   - Catalyseur : grains fixes (disques) à T. Un A qui touche un grain s'y fixe (immobile) pendant un temps
     exponentiel de moyenne tAds, puis repart avec une vitesse thermique. Un B qui heurte un A fixé réagit si
     ½ m v_n² > EaCat (mécanisme d'Eley-Rideal) : C repart du grain, D rebondit avec la même règle ΔH.
     Le grain ressort intact. Pour un obstacle fixe, la fraction des chocs avec ½ m v_n² > E vaut aussi e^(−E/T).
   - renew > 0 : un produit redevient réactif (C → A, D → B) après renew τ, sans toucher à sa vitesse ;
     artifice d'affichage pour garder la boîte en régime permanent (l'énergie cinétique n'est pas modifiée).
     Effet réel à connaître : les collisions réactives retirent des réactifs rapides ; quand la fraction réactive
     est grande (Ea/kT ≲ 3) et renew long, la queue des réactifs s'appauvrit et la fraction mesurée passe sous
     e^(−Ea/kT) de quelques % (effet Prigogine-Xhrouet). Les tests mesurent la fraction avec renew = 0,02 τ.
   - Réglages conseillés pour la page : 4 τ par seconde affichée, renew = 8 τ, Ea = 4, T = 1 (CAT pour l'étape 3).

   Théorie
   - fracAbove(Ea, T, dim, crit) : fraction des collisions (pondérées par le flux) dont l'énergie dépasse Ea.
     Distribution des vitesses relatives à 2D : f(g) ∝ g e^(−μg²/2T) ; taux de collision ∝ g ; paramètre d'impact
     b uniforme sur [−σ, σ] ; g_n = g √(1 − b²/σ²). Avec ε = μg²/2T (densité pondérée ∝ ε^(1/2) e^(−ε) à 2D) :
       F = ∫_a^∞ (2/√π) ε^(1/2) e^(−ε) √(1 − a/ε) dε = (2/√π) e^(−a) ∫_0^∞ u^(1/2) e^(−u) du = e^(−a),  a = Ea/T.
     Même résultat à 3D (b² uniforme). Critère « énergie relative totale » (crit = 'tot') :
       2D : Γ(3/2, a)/Γ(3/2) = erfc(√a) + 2√(a/π) e^(−a) ;  3D : (1 + a) e^(−a).
     La densité des énergies E_lc des collisions est donc exponentielle : elcPdf(E, T) = e^(−E/T)/T.
   - kBox : théorie des collisions à 2D. Taux de chocs A-B par unité d'aire = n_A n_B · 2σ · ⟨g⟩ · χ,
     ⟨g⟩ = √(πT/2μ), χ = (1 − 7η/16)/(1 − η)² (contact des disques durs, η = fraction surfacique) ;
     k = 2σ⟨g⟩ χ P e^(−Ea/T). Le préfacteur dépend de T (∝ √T) : la pente de ln k en 1/T vaut −(Ea + T/2).
   - arrhenius(A, Ea, T) = A e^(−Ea/RT) ; ratioT(Ea, T1, T2) = k(T2)/k(T1).

   Cinétique moyenne : odeRate({order, k}, c0, t) ordres 0, 1, 2 (2 : A + A, ou A + B à concentrations égales) ;
   odeAB(k, a0, b0, t) pour A + B quelconques ; halfLife(order, k, c0).
   Simulation stochastique (étape 2) : ssaAB (Gillespie, propension k nA nB / Ω, Ω = molécules par mol/L),
   fitK (ajustement de la loi intégrée), measureK.

   Équilibre N₂O₄ ⇌ 2 NO₂ (étape 4) : ΔH° = +57,2 kJ/mol, ΔS° = 176 J/(mol·K) (réel ≈ 175,8), d'où Kp(298 K) = 0,147.
   Kp(T) = exp(−ΔH°/RT + ΔS°/R) (van 't Hoff, ΔH° et ΔS° constants), P° = 1 bar.
   Gaz parfaits. Une « molécule » du tirage représente q mol ; Ω = V/q (molécules par mol/m³).
   Propensions : dissociation kf·N ; recombinaison kr·M(M − 1)/Ω. kr(T) = Ar e^(−Ear/RT) (recombinaison
   presque sans barrière, Ear = 3 kJ/mol illustratif), kf = Kc·kr avec Kc = Kp P°/RT (équilibre détaillé exact).
   Catalyseur : kf et kr multipliés par le même facteur e^(dEa/RT) : même K, approche plus rapide.
*/
const Rxn = (() => {
  const R = 8.314, P0 = 1e5, LN2 = Math.LN2, PI = Math.PI;

  function mulberry32(a) {
    a = a >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0; let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(rng) { let u = 0; while (u === 0) u = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * PI * rng()); }
  function erfc(x) { // Numerical Recipes (erfcc), erreur relative < 1,2e-7
    const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  }

  /* ---------------- Théorie ---------------- */
  function fracAbove(Ea, T, dim, crit) {
    const a = Math.max(0, Ea / T); dim = dim || 2;
    if (crit === 'tot') return dim === 3 ? (1 + a) * Math.exp(-a) : erfc(Math.sqrt(a)) + 2 * Math.sqrt(a / PI) * Math.exp(-a);
    return Math.exp(-a);
  }
  const elcPdf = (E, T) => E < 0 ? 0 : Math.exp(-E / T) / T;
  const mb2dPdf = (v, T, m) => { m = m || 1; return v < 0 ? 0 : (m * v / T) * Math.exp(-m * v * v / (2 * T)); };
  const mb2dCdf = (v, T, m) => { m = m || 1; return v <= 0 ? 0 : 1 - Math.exp(-m * v * v / (2 * T)); };
  const arrhenius = (A, Ea, T) => A * Math.exp(-Ea / (R * T));
  const ratioT = (Ea, T1, T2) => Math.exp(Ea / R * (1 / T1 - 1 / T2));
  const chi2d = eta => (1 - 7 * eta / 16) / Math.pow(1 - eta, 2);
  function kBox(o) { // o : {T, Ea, sig, mu, eta, P}
    const sig = o.sig || 1, mu = o.mu || 0.5, P = o.P == null ? 1 : o.P, g = Math.sqrt(PI * o.T / (2 * mu));
    return 2 * sig * g * chi2d(o.eta || 0) * P * Math.exp(-o.Ea / o.T);
  }

  /* ---------------- Cinétique moyenne ---------------- */
  function odeRate(p, c0, t) {
    const k = p.k;
    if (p.order === 0) return Math.max(0, c0 - k * t);
    if (p.order === 1) return c0 * Math.exp(-k * t);
    if (p.order === 2) return c0 / (1 + k * c0 * t);
    throw new Error('ordre non pris en charge');
  }
  function odeAB(k, a0, b0, t) { // A + B → P, v = k[A][B] ; renvoie [A](t)
    const d = b0 - a0;
    if (Math.abs(d) < 1e-12 * Math.max(a0, b0)) return a0 / (1 + k * a0 * t);
    const e = Math.exp(d * k * t);
    return a0 * d / (b0 * e - a0);
  }
  function halfLife(order, k, c0) {
    if (order === 0) return c0 / (2 * k);
    if (order === 1) return LN2 / k;
    if (order === 2) return 1 / (k * c0);
    throw new Error('ordre non pris en charge');
  }
  // Étape 2 : A + B → P en solution, k(T) = A e^(−Ea/RT) ; k(298 K) ≈ 0,125 L/(mol·s)
  const SOL = { A: 7.3e7, Ea: 50e3 };
  const kSol = T => arrhenius(SOL.A, SOL.Ea, T);
  // Gillespie A + B → P : s = {nA, nB, nP, t} ; avance jusqu'à tEnd (exact : propension constante entre deux événements)
  function ssaAB(s, p, rng, tEnd) {
    let n = 0;
    for (;;) {
      const a = p.k * s.nA * s.nB / p.Om;
      if (a <= 0) { s.t = tEnd; return n; }
      const dt = -Math.log(1 - rng()) / a;
      if (s.t + dt > tEnd) { s.t = tEnd; return n; }
      s.t += dt; s.nA--; s.nB--; s.nP++; n++;
      if (s.ev) s.ev.push(s.t);
    }
  }
  // Ajuste k sur une série [{t, a, b}] (concentrations) par la loi intégrée, droite passant par l'origine
  function fitK(series, a0, b0) {
    let sxy = 0, sxx = 0; const d = b0 - a0;
    for (const r of series) {
      if (r.a <= 0) continue;
      const y = Math.abs(d) < 1e-9 * a0 ? (1 / r.a - 1 / a0) : Math.log((r.b * a0) / (r.a * b0)) / d;
      sxy += r.t * y; sxx += r.t * r.t;
    }
    return sxx > 0 ? sxy / sxx : NaN;
  }
  // Essai : tirage stochastique jusqu'à la consommation de frac de A, puis ajustement de k
  function measureK(o) { // {k, a0, b0, Om, seed, frac, nPts}
    const rng = mulberry32(o.seed), Om = o.Om, s = { nA: Math.round(o.a0 * Om), nB: Math.round(o.b0 * Om), nP: 0, t: 0 };
    const a0 = s.nA / Om, b0 = s.nB / Om, frac = o.frac || 0.6, nPts = o.nPts || 40;
    const tTot = (() => { // durée moyenne pour consommer frac de A
      let lo = 0, hi = 1 / (o.k * Math.max(a0, b0)); while (odeAB(o.k, a0, b0, hi) > a0 * (1 - frac)) hi *= 2;
      for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (odeAB(o.k, a0, b0, m) > a0 * (1 - frac)) lo = m; else hi = m; }
      return hi;
    })();
    const ser = [];
    for (let i = 1; i <= nPts; i++) { ssaAB(s, { k: o.k, Om }, rng, tTot * i / nPts); ser.push({ t: s.t, a: s.nA / Om, b: s.nB / Om }); }
    return { k: fitK(ser, a0, b0), series: ser, a0, b0, tTot };
  }
  function linfit(xs, ys) {
    const n = xs.length; let sx = 0, sy = 0, sxx = 0, sxy = 0, syy = 0;
    for (let i = 0; i < n; i++) { sx += xs[i]; sy += ys[i]; sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; syy += ys[i] * ys[i]; }
    const vx = sxx - sx * sx / n, vy = syy - sy * sy / n, cxy = sxy - sx * sy / n, slope = cxy / vx;
    return { slope, icpt: (sy - slope * sx) / n, r2: vy > 0 ? cxy * cxy / (vx * vy) : 1 };
  }

  /* ---------------- Profil énergétique ---------------- */
  // Coordonnée de réaction s ∈ [0, 1] ; réactifs à 0, sommet (état de transition) à s = 0,5, produits à ΔH.
  function profile(o) {
    const dH = o.dH, Ea = Math.max(o.Ea, dH, 0), n = o.n || 120;
    const hasCat = o.EaCat != null, EaC = hasCat ? Math.min(Ea, Math.max(o.EaCat, dH, 0)) : NaN;
    const curve = h => s => s <= 0.5 ? h * (1 - Math.cos(2 * PI * s)) / 2 : dH + (h - dH) * (1 - Math.cos(2 * PI * s)) / 2;
    const f = curve(Ea), g = hasCat ? curve(EaC) : null, pts = [], cat = [];
    for (let i = 0; i <= n; i++) { const s = i / n; pts.push({ s, E: f(s) }); if (g) cat.push({ s, E: g(s) }); }
    return { pts, cat: g ? cat : null, Ea, EaCat: EaC, dH, EaRev: Ea - dH, EaCatRev: hasCat ? EaC - dH : NaN, ts: { s: 0.5, E: Ea } };
  }

  /* ---------------- Boîte réactive 2D ---------------- */
  const SP = { A: 0, B: 1, C: 2, D: 3 };
  function boxInit(o) {
    const rng = mulberry32(o.seed == null ? 1 : o.seed);
    const Lx = o.Lx || 40, Ly = o.Ly || 28, sig = o.sig || 1, nA = o.nA | 0, nB = o.nB | 0, N = nA + nB;
    const b = {
      rng, Lx, Ly, sig, N, T: o.T == null ? 1 : o.T, Ea: o.Ea == null ? 4 : o.Ea, dH: o.dH || 0,
      steric: !!o.steric, alpha: o.alpha == null ? PI / 4 : o.alpha, acc: o.acc == null ? 1 : o.acc,
      dt: o.dt || 0.0025, t: 0, renew: o.renew || 0, tAds: o.tAds == null ? 2 : o.tAds,
      cat: (o.cat || []).map(g => ({ x: g.x, y: g.y, R: g.R })), EaCat: o.EaCat == null ? Infinity : o.EaCat,
      x: new Float64Array(N), y: new Float64Array(N), vx: new Float64Array(N), vy: new Float64Array(N),
      th: new Float64Array(N), w: new Float64Array(N), sp: new Uint8Array(N), born: new Float64Array(N),
      ads: new Int16Array(N).fill(-1), rel: new Float64Array(N),
      cnt: { coll: 0, react: 0, reactCat: 0, hitAds: 0, collAll: 0 },
      hist: new Float64Array(o.nBins || 40), histMax: o.histMax || 12,
      ev: [], evMax: o.evMax || 400, nHead: null, nNext: null
    };
    b.Ea = Math.max(b.Ea, b.dH);
    // placement sans recouvrement
    for (let i = 0; i < N; i++) {
      let ok = false, tries = 0;
      while (!ok && tries++ < 5000) {
        const x = sig / 2 + rng() * (Lx - sig), y = sig / 2 + rng() * (Ly - sig);
        ok = true;
        for (const g of b.cat) if (Math.hypot(x - g.x, y - g.y) < g.R + sig) { ok = false; break; }
        for (let j = 0; ok && j < i; j++) if ((x - b.x[j]) ** 2 + (y - b.y[j]) ** 2 < sig * sig * 1.0001) ok = false;
        if (ok) { b.x[i] = x; b.y[i] = y; }
      }
      if (!ok) throw new Error('boîte trop pleine');
      b.sp[i] = i < nA ? 0 : 1;
      b.th[i] = rng() * 2 * PI; b.w[i] = gauss(rng) * 1.5;
      if (o.init === 'mono') { const a = rng() * 2 * PI, v = Math.sqrt(2 * b.T); b.vx[i] = v * Math.cos(a); b.vy[i] = v * Math.sin(a); }
      else { const s = Math.sqrt(b.T); b.vx[i] = gauss(rng) * s; b.vy[i] = gauss(rng) * s; }
    }
    return b;
  }
  const boxKE = b => { let e = 0; for (let i = 0; i < b.N; i++) e += 0.5 * (b.vx[i] * b.vx[i] + b.vy[i] * b.vy[i]); return e; };
  function boxTemp(b) { let e = 0, n = 0; for (let i = 0; i < b.N; i++) if (b.ads[i] < 0) { e += 0.5 * (b.vx[i] * b.vx[i] + b.vy[i] * b.vy[i]); n++; } return n ? e / n : 0; } // 2D : ⟨KE⟩ = kT
  function boxSetT(b, T, rescale) {
    if (rescale !== false) { const Tc = boxTemp(b), f = Tc > 0 ? Math.sqrt(T / Tc) : 1; for (let i = 0; i < b.N; i++) { b.vx[i] *= f; b.vy[i] *= f; } }
    b.T = T;
  }
  function boxCount(b) { const c = [0, 0, 0, 0]; for (let i = 0; i < b.N; i++) c[b.sp[i]]++; return { A: c[0], B: c[1], C: c[2], D: c[3] }; }
  const boxEta = b => b.N * PI * b.sig * b.sig / 4 / (b.Lx * b.Ly - b.cat.reduce((s, g) => s + PI * g.R * g.R, 0));
  // vitesse thermique réémise par une surface de normale (nx, ny) à la température T
  function emit(b, i, nx, ny) {
    const T = b.T, vn = Math.sqrt(-2 * T * Math.log(1 - b.rng())), vt = gauss(b.rng) * Math.sqrt(T);
    b.vx[i] = vn * nx - vt * ny; b.vy[i] = vn * ny + vt * nx;
  }
  function wall(b, i, nx, ny, to) { // to : temps écoulé depuis le contact
    to = Math.min(Math.max(to, 0), b.dt);
    b.x[i] -= b.vx[i] * to; b.y[i] -= b.vy[i] * to;
    if (b.acc > 0 && b.rng() < b.acc) emit(b, i, nx, ny);
    else { const vn = b.vx[i] * nx + b.vy[i] * ny; b.vx[i] -= 2 * vn * nx; b.vy[i] -= 2 * vn * ny; }
    b.x[i] += b.vx[i] * to; b.y[i] += b.vy[i] * to;
  }
  function pushEv(b, e) { b.ev.push(e); if (b.ev.length > b.evMax) b.ev.splice(0, b.ev.length - b.evMax); }
  // collision entre i (libre) et j (libre ou fixé) au contact
  function collide(b, i, j) {
    const s = b.sig;
    if (b.ads[i] >= 0 && b.ads[j] >= 0) return;
    if (b.ads[i] >= 0) { const t = i; i = j; j = t; } // i libre ; j éventuellement fixé
    const fixed = b.ads[j] >= 0;
    const vix = b.vx[i], viy = b.vy[i], vjx = fixed ? 0 : b.vx[j], vjy = fixed ? 0 : b.vy[j];
    let rx = b.x[i] - b.x[j], ry = b.y[i] - b.y[j];
    const gx = vix - vjx, gy = viy - vjy, rv = rx * gx + ry * gy;
    if (rv >= 0) return; // s'éloignent
    const g2 = gx * gx + gy * gy, D = rv * rv - g2 * (rx * rx + ry * ry - s * s);
    let back = D > 0 ? (rv + Math.sqrt(D)) / g2 : 0; // temps écoulé depuis le contact
    if (!(back >= 0 && back <= 3 * b.dt)) back = 0;
    // positions au contact
    b.x[i] -= vix * back; b.y[i] -= viy * back;
    if (!fixed) { b.x[j] -= vjx * back; b.y[j] -= vjy * back; }
    rx = b.x[i] - b.x[j]; ry = b.y[i] - b.y[j];
    const d = Math.hypot(rx, ry) || 1, nx = rx / d, ny = ry / d;
    const gn = gx * nx + gy * ny; // < 0
    const mu = fixed ? 1 : 0.5, Elc = 0.5 * mu * gn * gn;
    const si = b.sp[i], sj = b.sp[j];
    b.cnt.collAll++;
    let gnNew = -gn, reacted = false, viaCat = false;
    if (fixed) {
      // obstacle fixe : A fixé sur un grain (j) heurté par i
      if (sj === 0 && si === 1) {
        b.cnt.hitAds++;
        if (Elc > b.EaCat) { gnNew = Math.sqrt(gn * gn - 2 * b.dH / mu); reacted = true; viaCat = true; }
      }
    } else if ((si === 0 && sj === 1) || (si === 1 && sj === 0)) {
      b.cnt.coll++;
      const hb = Math.min(b.hist.length - 1, Math.floor(Elc / b.histMax * b.hist.length)); b.hist[hb]++;
      let orient = true;
      if (b.steric) { const a = si === 0 ? i : j, sg = a === i ? -1 : 1; orient = Math.cos(b.th[a]) * nx * sg + Math.sin(b.th[a]) * ny * sg > Math.cos(b.alpha); }
      if (Elc > b.Ea && orient) { gnNew = Math.sqrt(gn * gn - 2 * b.dH / mu); reacted = true; }
    }
    const dv = gnNew - gn; // gnNew > 0
    if (fixed) { b.vx[i] += dv * nx; b.vy[i] += dv * ny; }
    else { b.vx[i] += dv / 2 * nx; b.vy[i] += dv / 2 * ny; b.vx[j] -= dv / 2 * nx; b.vy[j] -= dv / 2 * ny; }
    // repartir depuis le contact
    b.x[i] += b.vx[i] * back; b.y[i] += b.vy[i] * back;
    if (!fixed) { b.x[j] += b.vx[j] * back; b.y[j] += b.vy[j] * back; }
    if (reacted) {
      const a = si === 0 ? i : j, bb = a === i ? j : i;
      b.sp[a] = 2; b.sp[bb] = 3; b.born[a] = b.born[bb] = b.t;
      if (viaCat) { b.cnt.reactCat++; const g = b.cat[b.ads[a]]; b.ads[a] = -1; const ux = (b.x[a] - g.x), uy = (b.y[a] - g.y), u = Math.hypot(ux, uy) || 1; emit(b, a, ux / u, uy / u); }
      else b.cnt.react++;
    }
    if (fixed ? (sj === 0 && si === 1) : ((si === 0 && sj === 1) || (si === 1 && sj === 0)))
      pushEv(b, { t: b.t, x: (b.x[i] + b.x[j]) / 2, y: (b.y[i] + b.y[j]) / 2, E: Elc, r: reacted, cat: fixed });
  }
  function boxStep(b, dt) {
    const h = b.dt; let n = Math.max(1, Math.round((dt == null ? h : dt) / h));
    while (n-- > 0) step1(b, h);
    return b;
  }
  function step1(b, h) {
    const N = b.N, s = b.sig, r = s / 2, Lx = b.Lx, Ly = b.Ly, x = b.x, y = b.y, vx = b.vx, vy = b.vy;
    b.t += h;
    for (let i = 0; i < N; i++) {
      if (b.ads[i] >= 0) {
        if (b.t >= b.rel[i]) { const g = b.cat[b.ads[i]], ux = x[i] - g.x, uy = y[i] - g.y, u = Math.hypot(ux, uy) || 1; b.ads[i] = -1; emit(b, i, ux / u, uy / u); }
        else continue;
      }
      x[i] += vx[i] * h; y[i] += vy[i] * h; b.th[i] += b.w[i] * h;
      // parois : retour à l'instant du contact, réémission (thermique ou spéculaire), puis fin du pas
      if (x[i] < r && vx[i] < 0) wall(b, i, 1, 0, (r - x[i]) / -vx[i]);
      else if (x[i] > Lx - r && vx[i] > 0) wall(b, i, -1, 0, (x[i] - Lx + r) / vx[i]);
      if (y[i] < r && vy[i] < 0) wall(b, i, 0, 1, (r - y[i]) / -vy[i]);
      else if (y[i] > Ly - r && vy[i] > 0) wall(b, i, 0, -1, (y[i] - Ly + r) / vy[i]);
      // grains de catalyseur
      for (let k = 0; k < b.cat.length; k++) {
        const g = b.cat[k], dx = x[i] - g.x, dy = y[i] - g.y, d = Math.hypot(dx, dy), Rc = g.R + r;
        if (d < Rc) {
          const nx = dx / (d || 1), ny = dy / (d || 1), vn = vx[i] * nx + vy[i] * ny;
          if (vn < 0) {
            if (b.sp[i] === 0 && isFinite(b.EaCat)) { x[i] = g.x + nx * Rc; y[i] = g.y + ny * Rc; vx[i] = 0; vy[i] = 0; b.ads[i] = k; b.rel[i] = b.t - b.tAds * Math.log(1 - b.rng()); }
            else { vx[i] -= 2 * vn * nx; vy[i] -= 2 * vn * ny; x[i] = g.x + nx * (2 * Rc - d); y[i] = g.y + ny * (2 * Rc - d); }
          }
        }
      }
    }
    // grille de cellules (taille ≥ σ)
    const cs = Math.max(s, 1e-9), nx = Math.max(1, Math.floor(Lx / cs)), ny = Math.max(1, Math.floor(Ly / cs)), nc = nx * ny;
    if (!b.nHead || b.nHead.length !== nc) { b.nHead = new Int32Array(nc); b.nNext = new Int32Array(N); }
    const head = b.nHead, next = b.nNext; head.fill(-1);
    const cx = i => Math.min(nx - 1, Math.max(0, Math.floor(x[i] / Lx * nx))), cy = i => Math.min(ny - 1, Math.max(0, Math.floor(y[i] / Ly * ny)));
    for (let i = 0; i < N; i++) { const c = cy(i) * nx + cx(i); next[i] = head[c]; head[c] = i; }
    const s2 = s * s;
    for (let gy = 0; gy < ny; gy++) for (let gx = 0; gx < nx; gx++) {
      for (let i = head[gy * nx + gx]; i >= 0; i = next[i]) {
        for (let oy = 0; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
          if (oy === 0 && ox < 0) continue;
          const hx = gx + ox, hy = gy + oy; if (hx < 0 || hx >= nx || hy >= ny) continue;
          for (let j = (oy === 0 && ox === 0) ? next[i] : head[hy * nx + hx]; j >= 0; j = next[j]) {
            const dx = x[i] - x[j], dy = y[i] - y[j];
            if (dx * dx + dy * dy < s2) collide(b, i, j);
          }
        }
      }
    }
    if (b.renew > 0) for (let i = 0; i < N; i++) if (b.sp[i] >= 2 && b.t - b.born[i] > b.renew) { b.sp[i] -= 2; if (b.sp[i] === 0) b.th[i] = b.rng() * 2 * PI; }
  }
  function boxDrain(b) { const e = b.ev; b.ev = []; return e; }
  function boxResetCounts(b) { b.cnt = { coll: 0, react: 0, reactCat: 0, hitAds: 0, collAll: 0 }; b.hist.fill(0); }

  /* ---------------- Équilibre N₂O₄ ⇌ 2 NO₂ ---------------- */
  const EQ = { dH: 57.2e3, dS: 176, Ear: 3e3, Ar: 0.033 * Math.exp(3e3 / (R * 298)), q: 1e-4, n0: 0.04, V0: 1e-3 };
  const Kp = T => Math.exp(-EQ.dH / (R * T) + EQ.dS / R);
  const Kc = T => Kp(T) * P0 / (R * T); // mol/m³
  // composition d'équilibre à T et P totale (bar), n0 mol de N₂O₄ au départ (ou équivalent)
  function eqSolve(T, P, n0) {
    const K = Kp(T), a = Math.sqrt(K / (K + 4 * P)), n = n0 == null ? 1 : n0;
    return { alpha: a, nN2O4: n * (1 - a), nNO2: 2 * n * a, xNO2: 2 * a / (1 + a), P, K };
  }
  // à T et V (m³) fixés, n0 mol équivalents N₂O₄
  function eqSolveV(T, V, n0) {
    const K = Kc(T), c0 = n0 / V; // 4ξ² + Kξ − K c0 = 0
    const xi = (-K + Math.sqrt(K * K + 16 * K * c0)) / 8, a = xi / c0;
    const nN = n0 * (1 - a), nM = 2 * n0 * a;
    return { alpha: a, nN2O4: nN, nNO2: nM, xNO2: nM / (nN + nM), P: (nN + nM) * R * T / V / P0, K: Kp(T) };
  }
  function eqRates(T, V, cat) { // constantes du tirage : kf (s⁻¹), kr (m³/(mol·s)), Om (molécules par mol/m³)
    const f = cat ? (cat === true ? 5 : cat) : 1, kr = EQ.Ar * Math.exp(-EQ.Ear / (R * T)) * f;
    return { kf: Kc(T) * kr, kr, Om: V / EQ.q };
  }
  function eqInit(o) { // {T, V, nEq (molécules équivalentes N₂O₄), seed, start: 'N2O4'|'eq', cat}
    const T = o.T || 298, V = o.V || EQ.V0, nEq = o.nEq || Math.round(EQ.n0 / EQ.q);
    const s = { N: nEq, M: 0, T, Tbath: T, V, t: 0, nf: 0, nr: 0, cat: !!o.cat, rng: mulberry32(o.seed == null ? 7 : o.seed), log: null };
    if (o.start === 'eq') { const e = eqSolveV(T, V, nEq * EQ.q); s.M = 2 * Math.round(e.nNO2 / EQ.q / 2); s.N = nEq - s.M / 2; }
    return s;
  }
  // Un événement de Gillespie : renvoie {dt, type: 'f'|'r'} sans l'appliquer si dry, sinon l'applique
  function gillespie(s, p, rng) {
    const af = p.kf * s.N, ar = p.kr * s.M * (s.M - 1) / p.Om, a = af + ar;
    if (a <= 0) return { dt: Infinity, type: null };
    const dt = -Math.log(1 - rng()) / a, type = rng() * a < af ? 'f' : 'r';
    return { dt, type };
  }
  // Avance le piston de dt : relaxation thermique vers le bain (constante tauT), puis tirages exacts à taux constants
  function eqStep(s, dt, o) {
    o = o || {}; const tauT = o.tauT == null ? 0.8 : o.tauT;
    if (tauT > 0) s.T += (s.Tbath - s.T) * (1 - Math.exp(-dt / tauT)); else s.T = s.Tbath;
    const p = eqRates(s.T, s.V, s.cat), tEnd = s.t + dt;
    for (;;) {
      const e = gillespie(s, p, s.rng);
      if (s.t + e.dt > tEnd) { s.t = tEnd; break; }
      s.t += e.dt;
      if (e.type === 'f') { s.N--; s.M += 2; s.nf++; } else { s.N++; s.M -= 2; s.nr++; }
      if (s.log) s.log.push({ t: s.t, type: e.type });
    }
    return s;
  }
  const Q = s => (s.N > 0 ? (s.M * EQ.q * R * s.T / s.V / P0) ** 2 / (s.N * EQ.q * R * s.T / s.V / P0) : Infinity);
  const eqP = s => (s.N + s.M) * EQ.q * R * s.T / s.V / P0; // bar
  const eqAlpha = s => s.M / 2 / (s.N + s.M / 2);
  const eqKnow = s => Kp(s.T);

  /* ---------------- Préréglages ---------------- */
  // Décomposition de l'eau oxygénée, 2 H₂O₂ → 2 H₂O + O₂ : ordres de grandeur de manuel ; même facteur A supposé (illustratif)
  const H2O2 = { none: { Ea: 75e3, nom: 'sans catalyseur' }, MnO2: { Ea: 55e3, nom: 'dioxyde de manganèse' }, catalase: { Ea: 8e3, nom: 'catalase' }, dH: -98e3 };
  const h2o2Ratio = (kind, T) => Math.exp((H2O2.none.Ea - H2O2[kind].Ea) / (R * T));

  // Étape 3 : trois grains, A fixé 6 τ en moyenne, barrière catalysée 1 (contre 5) : la voie catalysée domine (≈ × 5)
  const CAT = { grains: [{ x: 12, y: 14, R: 3 }, { x: 28, y: 9, R: 3 }, { x: 28, y: 20, R: 3 }], tAds: 6, Ea: 5, EaCat: 1 };

  return {
    R, P0, LN2, SP, CAT, mulberry32, gauss, erfc,
    fracAbove, elcPdf, mb2dPdf, mb2dCdf, arrhenius, ratioT, chi2d, kBox,
    odeRate, odeAB, halfLife, SOL, kSol, ssaAB, fitK, measureK, linfit,
    profile,
    boxInit, boxStep, boxKE, boxTemp, boxSetT, boxCount, boxEta, boxDrain, boxResetCounts,
    EQ, Kp, Kc, eqSolve, eqSolveV, eqRates, eqInit, gillespie, eqStep, Q, eqP, eqAlpha, eqKnow,
    H2O2, h2o2Ratio
  };
})();
/* RXN-END */
if (typeof module !== 'undefined') module.exports = Rxn;
