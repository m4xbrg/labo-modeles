/* EMG-BEGIN */
const Emg = (() => {
  'use strict';
  // Les temps ODE et SIR sont des jours illustratifs ; les tailles sont des individus.
  // Les automates sont sans dimensions physiques : une itération est un pas de règle.
  const borne = (x, a, b) => Math.max(a, Math.min(b, x));
  function mulberry32(graine = 1) {
    let a = graine >>> 0;
    return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function rk4(y, dt, derivee) {
    const addition = (v, w, f) => v.map((x, i) => x + f * w[i]);
    const k1 = derivee(y), k2 = derivee(addition(y, k1, dt / 2));
    const k3 = derivee(addition(y, k2, dt / 2)), k4 = derivee(addition(y, k3, dt));
    return y.map((x, i) => Math.max(0, x + dt * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) / 6));
  }
  function logistic(N, { r = 0.5, K = 100 } = {}, dt = 0.1) {
    return rk4([N], dt, ([n]) => [r * n * (1 - n / K)])[0];
  }
  function competition({ r1 = 0.7, r2 = 0.5, K1 = 120, K2 = 100, a12 = 0.5, a21 = 0.5 } = {}) {
    return (etat, dt = 0.05) => rk4(etat, dt, ([x, y]) => [r1 * x * (1 - (x + a12 * y) / K1), r2 * y * (1 - (y + a21 * x) / K2)]);
  }
  function competitionIssue({ K1 = 120, K2 = 100, a12 = .5, a21 = .5 } = {}) {
    const p = 1 - a12 * a21;
    const x = p ? (K1 - a12 * K2) / p : NaN;
    const y = p ? (K2 - a21 * K1) / p : NaN;
    if (a12 < K1 / K2 && a21 < K2 / K1) return { issue: 'coexistence', N1: x, N2: y };
    if (a12 > K1 / K2 && a21 > K2 / K1) return { issue: 'priorité initiale', N1: x, N2: y };
    return { issue: a12 >= K1 / K2 ? 'espèce 2' : 'espèce 1', N1: x, N2: y };
  }
  function lotkaVolterra({ a = 0.7, b = 0.14, c = 0.08, d = 0.45, K = Infinity } = {}) {
    return (etat, dt = 0.02) => rk4(etat, dt, ([x, y]) => [a * x * (1 - x / K) - b * x * y, c * x * y - d * y]);
  }
  function lvIntegrale(x, y, { a = .7, b = .14, c = .08, d = .45 } = {}) {
    return c * x - d * Math.log(x) + b * y - a * Math.log(y);
  }
  function sir({ beta = 0.45, gamma = 0.2, N = 1000, vacc = 0 } = {}) {
    // Les vaccinés sont comptés dans R sans avoir été malades.
    return (etat, dt = 0.05) => rk4(etat, dt, ([S, I]) => [-beta * S * I / N, beta * S * I / N - gamma * I, gamma * I]);
  }
  function initialSIR(N = 1000, vacc = 0, infectes = 1) {
    const V = Math.floor(borne(vacc, 0, 1) * N), I = Math.min(infectes, N - V);
    return [N - V - I, I, V];
  }
  function finalSize(R0, vacc = 0) {
    const s0 = 1 - borne(vacc, 0, 1);
    if (R0 * s0 <= 1) return 0;
    // Racine NON NULLE de z=s0(1-exp(-R0*z)), en fraction de la population entière.
    let lo = 1e-14, hi = s0;
    for (let i = 0; i < 90; i++) {
      const z = (lo + hi) / 2;
      if (s0 * (-Math.expm1(-R0 * z)) > z) lo = z; else hi = z;
    }
    return (lo + hi) / 2;
  }
  function peakS(R0, N = 1) { return N / R0; }
  function binomiale(n, p, hasard) {
    if (n < 1 || p <= 0) return 0;
    if (p >= 1) return n;
    // Simulation de Bernoulli exacte à petite échelle ; approximation normale
    // à grande échelle pour garder les essais de 10 000 individus réactifs.
    if (n <= 300 || n * Math.min(p, 1 - p) < 16) {
      if (p > .5) return n - binomiale(n, 1 - p, hasard);
      let resultat = 0;
      for (let i = 0; i < n; i++) if (hasard() < p) resultat++;
      return resultat;
    }
    const z = Math.sqrt(-2 * Math.log(Math.max(1e-12, hasard()))) * Math.cos(2 * Math.PI * hasard());
    return borne(Math.round(n * p + Math.sqrt(n * p * (1 - p)) * z), 0, n);
  }
  function agentsSIR({ N = 400, contacts = 8, beta = .5, gamma = .2, vacc = 0, infectes = 1 } = {}, hasard = mulberry32(1)) {
    const V = Math.floor(N * borne(vacc, 0, 1)), I0 = Math.min(infectes, N - V);
    const agent = N <= 2000 ? new Uint8Array(N) : null;
    if (agent) {
      const indices = [...Array(N).keys()];
      for (let j = indices.length - 1; j > 0; j--) { const k = Math.floor(hasard() * (j + 1)); [indices[j], indices[k]] = [indices[k], indices[j]]; }
      for (let j = 0; j < V; j++) agent[indices[j]] = 3;
      for (let j = V; j < V + I0; j++) agent[indices[j]] = 1;
    }
    const e = { N, contacts, beta, gamma, vacc, S: N - V - I0, I: I0, R: V, V, casGueris: 0, temps: 0, agents: agent };
    e.step = (dt = .2) => {
      // Le taux beta est le taux EFFECTIF de contacts infectants par jour ;
      // 'contacts' décrit le nombre de contacts candidats, beta/contacts leur risque.
      const pI = -Math.expm1(-contacts * (1 - Math.exp(-beta / contacts * e.I / N)) * dt);
      const pR = -Math.expm1(-gamma * dt);
      let nouveaux = 0, gueris = 0;
      if (agent) {
        const changements = [];
        for (let i = 0; i < N; i++) {
          if (agent[i] === 0 && hasard() < pI) { changements.push(i); nouveaux++; }
          else if (agent[i] === 1 && hasard() < pR) { agent[i] = 2; gueris++; }
        }
        for (const i of changements) agent[i] = 1;
      } else {
        nouveaux = binomiale(e.S, pI, hasard);
        gueris = binomiale(e.I, pR, hasard);
      }
      e.S -= nouveaux; e.I += nouveaux - gueris; e.R += gueris;
      e.casGueris += gueris; e.temps += dt;
      return e;
    };
    return e;
  }
  function graphe(n) { return { n, adj: Array.from({ length: n }, () => new Set()) }; }
  function relier(g, i, j) { if (i !== j) { g.adj[i].add(j); g.adj[j].add(i); } }
  function delier(g, i, j) { g.adj[i].delete(j); g.adj[j].delete(i); }
  function lattice(n = 300, k = 6) {
    if (k % 2 || n <= k || k < 2) throw new RangeError('k doit être pair et inférieur à n');
    const g = graphe(n);
    for (let i = 0; i < n; i++) for (let d = 1; d <= k / 2; d++) relier(g, i, (i + d) % n);
    return g;
  }
  function smallWorld(n = 300, k = 6, p = .08, hasard = mulberry32(12)) {
    const g = lattice(n, k);
    for (let i = 0; i < n; i++) for (let d = 1; d <= k / 2; d++) {
      const j = (i + d) % n;
      if (hasard() >= p) continue;
      // Conserver le nombre de liens, jamais de boucle ni de doublon.
      const candidats = [];
      for (let x = 0; x < n; x++) if (x !== i && !g.adj[i].has(x)) candidats.push(x);
      if (!candidats.length) continue;
      delier(g, i, j); relier(g, i, candidats[Math.floor(hasard() * candidats.length)]);
    }
    return g;
  }
  function scaleFree(n = 300, m = 3, hasard = mulberry32(3)) {
    if (!Number.isInteger(m) || m < 1 || n <= m) throw new RangeError('Paramètres Barabási–Albert invalides');
    const g = graphe(n), urne = [];
    for (let i = 0; i <= m; i++) for (let j = i + 1; j <= m; j++) { relier(g, i, j); urne.push(i, j); }
    for (let i = m + 1; i < n; i++) {
      const choix = new Set();
      while (choix.size < m) choix.add(urne[Math.floor(hasard() * urne.length)]);
      for (const j of choix) { relier(g, i, j); urne.push(i, j); }
    }
    return g;
  }
  function degreeDistribution(g) {
    const comptes = new Map();
    for (const voisins of g.adj) comptes.set(voisins.size, (comptes.get(voisins.size) || 0) + 1);
    return [...comptes].sort((a, b) => a[0] - b[0]).map(([degree, count]) => ({ degree, count, probability: count / g.n }));
  }
  function pathLength(g, echantillon = 60) {
    // BFS exact pour n<=400, échantillon déterministe de racines au-delà.
    const n = g.n, nb = n <= 400 ? n : Math.min(n, echantillon);
    let somme = 0, paires = 0;
    for (let t = 0; t < nb; t++) {
      const origine = n <= 400 ? t : Math.floor((t + .5) * n / nb);
      const dist = new Int32Array(n).fill(-1), queue = new Int32Array(n);
      let tete = 0, fin = 1; queue[0] = origine; dist[origine] = 0;
      while (tete < fin) {
        const x = queue[tete++];
        for (const y of g.adj[x]) if (dist[y] === -1) { dist[y] = dist[x] + 1; queue[fin++] = y; }
      }
      for (let i = 0; i < n; i++) if (dist[i] > 0) { somme += dist[i]; paires++; }
    }
    return paires ? somme / paires : 0;
  }
  function clustering(g) {
    let somme = 0;
    for (let i = 0; i < g.n; i++) {
      const v = [...g.adj[i]], k = v.length;
      if (k < 2) continue;
      let triangles = 0;
      for (let a = 0; a < k; a++) for (let b = a + 1; b < k; b++) if (g.adj[v[a]].has(v[b])) triangles++;
      somme += triangles / (k * (k - 1) / 2);
    }
    return somme / g.n;
  }
  function vaccinate(g, fraction = .1, strategy = 'random', hasard = mulberry32(13)) {
    const ordre = Array.from({ length: g.n }, (_, i) => i), compte = Math.floor(g.n * borne(fraction, 0, 1));
    if (strategy === 'hubs') ordre.sort((a, b) => g.adj[b].size - g.adj[a].size || a - b);
    else if (strategy === 'random') for (let i = ordre.length - 1; i > 0; i--) { const j = Math.floor(hasard() * (i + 1)); [ordre[i], ordre[j]] = [ordre[j], ordre[i]]; }
    else throw new RangeError('Stratégie de vaccination inconnue');
    return ordre.slice(0, compte);
  }
  function sirOnNetwork(g, { beta = .28, gamma = .12, seeds = [0], vaccinated = [] } = {}, hasard = mulberry32(15)) {
    const etats = new Uint8Array(g.n); // 0 susceptible, 1 infecté, 2 guéri, 3 vacciné.
    for (const i of vaccinated) if (i >= 0 && i < g.n) etats[i] = 3;
    let infectes = 0, V = 0;
    for (const i of seeds) if (i >= 0 && i < g.n && etats[i] === 0) { etats[i] = 1; infectes++; }
    for (const x of etats) if (x === 3) V++;
    const e = { status: etats, S: g.n - V - infectes, I: infectes, R: V, V, gueris: 0, t: 0, vitesse: 0 };
    e.step = (dt = 1) => {
      const nouveau = new Set(), pEdge = -Math.expm1(-beta * dt), pR = -Math.expm1(-gamma * dt);
      let sorties = 0;
      for (let i = 0; i < g.n; i++) if (etats[i] === 1) {
        for (const j of g.adj[i]) if (etats[j] === 0 && hasard() < pEdge) nouveau.add(j);
        if (hasard() < pR) { etats[i] = 2; sorties++; }
      }
      for (const j of nouveau) etats[j] = 1;
      e.S -= nouveau.size; e.I += nouveau.size - sorties; e.R += sorties;
      e.gueris += sorties; e.vitesse = nouveau.size / dt; e.t += dt;
      return e;
    };
    return e;
  }
  const PATRONS = {
    planeur: [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]],
    clignotant: [[0, 0], [1, 0], [2, 0]],
    canon: [[24, 0], [22, 1], [24, 1], [12, 2], [13, 2], [20, 2], [21, 2], [34, 2], [35, 2],
      [11, 3], [15, 3], [20, 3], [21, 3], [34, 3], [35, 3], [0, 4], [1, 4], [10, 4], [16, 4], [20, 4], [21, 4],
      [0, 5], [1, 5], [10, 5], [14, 5], [16, 5], [17, 5], [22, 5], [24, 5], [10, 6], [16, 6], [24, 6],
      [11, 7], [15, 7], [12, 8], [13, 8]]
  };
  function life(grid, W, H) {
    const suivant = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let v = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (dx || dy) v += grid[((y + dy + H) % H) * W + (x + dx + W) % W] ? 1 : 0;
      }
      const i = y * W + x;
      suivant[i] = +(v === 3 || (grid[i] && v === 2));
    }
    return suivant;
  }
  function poserPatron(nom, W = 48, H = 34, x0 = 4, y0 = 6) {
    const tableau = new Uint8Array(W * H);
    for (const [x, y] of PATRONS[nom] || []) tableau[((y + y0 + H) % H) * W + (x + x0 + W) % W] = 1;
    return tableau;
  }
  function ordreMoyen(boids) {
    if (!boids.length) return 0;
    const s = boids.reduce((acc, b) => { const z = Math.hypot(b.vx, b.vy) || 1; acc[0] += b.vx / z; acc[1] += b.vy / z; return acc; }, [0, 0]);
    return Math.hypot(...s) / boids.length;
  }
  function boidsStep(boids, { sep = .22, ali = 1.5, coh = .16, radius = .37, vmax = .11, predator = null } = {}, dt = .12) {
    const delta = (a, b) => { let d = b - a; if (d > .5) d--; if (d < -.5) d++; return d; };
    const futur = boids.map((b, i) => {
      let sx = 0, sy = 0, ax = 0, ay = 0, cx = 0, cy = 0, n = 0;
      for (let j = 0; j < boids.length; j++) if (i !== j) {
        const o = boids[j], dx = delta(b.x, o.x), dy = delta(b.y, o.y), d2 = dx * dx + dy * dy;
        if (d2 > 1e-8 && d2 < radius * radius) {
          n++; ax += o.vx / (Math.hypot(o.vx, o.vy) || 1); ay += o.vy / (Math.hypot(o.vx, o.vy) || 1);
          cx += dx; cy += dy;
          if (d2 < (radius * .23) ** 2) { sx -= dx / d2; sy -= dy / d2; }
        }
      }
      const norme = (x, y) => { const l = Math.hypot(x, y); return l ? [x / l, y / l] : [0, 0]; };
      const [nsx, nsy] = norme(sx, sy), [nax, nay] = norme(ax, ay), [ncx, ncy] = norme(cx, cy);
      let fx = sep * nsx + ali * nax + coh * ncx, fy = sep * nsy + ali * nay + coh * ncy;
      if (predator) { const dx = delta(predator.x, b.x), dy = delta(predator.y, b.y), d = Math.hypot(dx, dy); if (d < .23 && d > 1e-5) { fx += 3 * dx / d; fy += 3 * dy / d; } }
      // Interpolation vers une direction désirée, sans chef ni force globale.
      const vitesse = Math.hypot(b.vx, b.vy) || vmax;
      const [ux, uy] = norme((b.vx / vitesse) * .3 + fx, (b.vy / vitesse) * .3 + fy);
      const omega = borne(dt * .2, 0, 1), [vx, vy] = norme((1 - omega) * b.vx / vitesse + omega * ux, (1 - omega) * b.vy / vitesse + omega * uy);
      return { x: (b.x + vx * vmax * dt + 1) % 1, y: (b.y + vy * vmax * dt + 1) % 1, vx: vx * vmax, vy: vy * vmax };
    });
    return futur;
  }
  function initBoids(n = 200, hasard = mulberry32(21)) {
    return Array.from({ length: n }, () => { const a = 2 * Math.PI * hasard(); return { x: .5 + .22 * (hasard() - .5), y: .5 + .22 * (hasard() - .5), vx: .11 * Math.cos(a), vy: .11 * Math.sin(a) }; });
  }
  function sandpileGrid(W = 36, H = 36) { return { W, H, cells: new Uint32Array(W * H), lost: 0, added: 0 }; }
  function sandpileAdd(grid, i, j) {
    const { W, H, cells } = grid, stack = [], touches = new Set();
    i = borne(Math.floor(i), 0, W - 1); j = borne(Math.floor(j), 0, H - 1);
    const k = j * W + i; cells[k]++; grid.added++;
    if (cells[k] >= 4) stack.push(k);
    let size = 0, lost = 0;
    while (stack.length) {
      const id = stack.pop(), n = Math.floor(cells[id] / 4);
      if (!n) continue;
      cells[id] -= n * 4; size += n; touches.add(id);
      const x = id % W, y = Math.floor(id / W);
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || xx >= W || yy < 0 || yy >= H) { lost += n; continue; }
        const adj = yy * W + xx; cells[adj] += n;
        if (cells[adj] >= 4) stack.push(adj);
      }
    }
    grid.lost += lost;
    return { size, lost, sites: touches.size, touched: [...touches] };
  }
  function avalancheStats(sizes) {
    const compte = new Map();
    for (const s of sizes) if (s > 0) { const b = Math.floor(Math.log2(s)); compte.set(b, (compte.get(b) || 0) + 1); }
    const nombre = [...compte.values()].reduce((a, b) => a + b, 0);
    const bins = [...compte].sort((a, b) => a[0] - b[0]).map(([b, count]) => ({ size: Math.pow(2, b + .5), count, density: count / (nombre * Math.pow(2, b)) }));
    // Le tout dernier compartiment est souvent coupé par la taille finie de la grille.
    const candidats = bins.filter((b, i) => b.count >= 8 && i < bins.length - 1);
    const xs = candidats.map(b => Math.log10(b.size)), ys = candidats.map(b => Math.log10(b.density));
    const xm = xs.reduce((a, b) => a + b, 0) / (xs.length || 1), ym = ys.reduce((a, b) => a + b, 0) / (ys.length || 1);
    const den = xs.reduce((a, x) => a + (x - xm) ** 2, 0);
    const slope = den ? xs.reduce((a, x, i) => a + (x - xm) * (ys[i] - ym), 0) / den : null;
    const variance = ys.reduce((s, y) => s + (y - ym) ** 2, 0);
    const residu = slope === null ? variance : ys.reduce((s, y, i) => s + (y - ym - slope * (xs[i] - xm)) ** 2, 0);
    const r2 = variance > 0 ? 1 - residu / variance : null;
    return { bins, slope, r2, decades: xs.length > 1 ? Math.max(...xs) - Math.min(...xs) : 0, samples: nombre };
  }
  function initRoad(L = 240, voitures = 45, vmax = 5) {
    const v = new Int16Array(L).fill(-1), nb = borne(Math.floor(voitures), 0, L);
    for (let i = 0; i < nb; i++) v[Math.floor(i * L / nb)] = vmax;
    return v;
  }
  function nagelSchreckenberg(road, { vmax = 5, p = .3 } = {}, hasard = mulberry32(32)) {
    const L = road.length, voitures = [], nouveau = new Int16Array(L).fill(-1);
    for (let i = 0; i < L; i++) if (road[i] >= 0) voitures.push({ pos: i, vitesse: road[i] });
    let total = 0, arrets = 0;
    for (let j = 0; j < voitures.length; j++) {
      const a = voitures[j], prochain = voitures[(j + 1) % voitures.length];
      const espace = (prochain.pos - a.pos + L) % L - 1;
      let v = Math.min(a.vitesse + 1, vmax, voitures.length === 1 ? L - 1 : espace);
      if (v > 0 && hasard() < p) v--;
      nouveau[(a.pos + v) % L] = v;
      total += v; if (v <= 1) arrets++;
    }
    // Un bouchon est ici un groupe d’au moins deux voitures lentes séparées
    // d’au plus deux cellules vides ; cette définition discrète est indicative.
    const ralenties = [];
    for (let i = 0; i < L; i++) if (nouveau[i] >= 0 && nouveau[i] <= 1) ralenties.push(i);
    let groupes = 0;
    if (ralenties.length > 1) {
      const ruptures = [];
      for (let i = 0; i < ralenties.length; i++) {
        const j = (i + 1) % ralenties.length;
        if ((ralenties[j] - ralenties[i] + L) % L > 3) ruptures.push(i);
      }
      if (!ruptures.length) groupes = 1;
      else {
        for (let k = 0; k < ruptures.length; k++) {
          const precedent = ruptures[(k - 1 + ruptures.length) % ruptures.length];
          const taille = (ruptures[k] - precedent + ralenties.length) % ralenties.length || ralenties.length;
          if (taille >= 2) groupes++;
        }
      }
    }
    return { road: nouveau, flow: total / L, speed: voitures.length ? total / voitures.length : 0, jams: arrets, jamGroups: groupes, density: voitures.length / L };
  }
  function fundamentalDiagram(densities, { L = 200, vmax = 5, p = .3, steps = 210, burn = 70, seed = 71 } = {}) {
    return densities.map((density, i) => {
      let route = initRoad(L, Math.round(borne(density, 0, 1) * L), vmax), debit = 0, vitesse = 0, nb = 0;
      const rng = mulberry32(seed + i);
      for (let t = 0; t < steps; t++) {
        const r = nagelSchreckenberg(route, { vmax, p }, rng); route = r.road;
        if (t >= burn) { debit += r.flow; vitesse += r.speed; nb++; }
      }
      return { density: (route.filter(v => v >= 0).length / L), flow: debit / nb, speed: vitesse / nb };
    });
  }
  return { borne, mulberry32, rk4, logistic, competition, competitionIssue, lotkaVolterra, lvIntegrale, sir, initialSIR, finalSize, peakS, agentsSIR, lattice, smallWorld, scaleFree, degreeDistribution, pathLength, clustering, sirOnNetwork, vaccinate, life, PATRONS, poserPatron, boidsStep, initBoids, ordreMoyen, sandpileGrid, sandpileAdd, avalancheStats, initRoad, nagelSchreckenberg, fundamentalDiagram };
})();
/* EMG-END */
