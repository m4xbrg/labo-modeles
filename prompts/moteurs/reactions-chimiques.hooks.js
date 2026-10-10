// Appelle chaque crochet de window.__labo et vérifie que la planche réagit dans le bon sens.
// Exécuté dans la page par verify.js (page.evaluate(hooks.run)).
module.exports.run = function () {
  const L = window.__labo, log = []; let fail = 0;
  const ok = (c, name, det) => { log.push((c ? 'ok   ' : 'FAIL ') + name + (det !== undefined ? '  [' + det + ']' : '')); if (!c) fail++; };
  const r3 = x => typeof x === 'number' ? +x.toPrecision(3) : x;
  try {
    ok(L && L.moteur && typeof L.moteur.boxInit === 'function', 'moteur exposé');
    for (const k of ['goStep', 'state', 'tick', 'setPlay', 'setT', 'setEa', 'orientation', 'setConc', 'trial', 'catalyst', 'presetH2O2', 'setTeq', 'setVolume', 'injectNO2', 'eqCatalyst'])
      ok(typeof L[k] === 'function', 'crochet ' + k);
    L.setPlay(false);
    // Étape 1
    L.goStep(0); ok(L.step === 0, 'goStep(0)');
    L.setT(1); L.setEa(3); L.orientation(true); let s = L.tick(600);
    ok(s.step === 0 && s.fracTheo > 0 && s.fracTheo < 0.05, 'étape 1 : fraction attendue avec orientation', r3(s.fracTheo));
    const f1 = s.fracTheo; L.orientation(false); s = L.tick(60);
    ok(Math.abs(s.fracTheo / f1 - 4) < 0.01, 'étape 1 : sans orientation, fraction attendue × 4', r3(s.fracTheo / f1));
    L.setT(1.1); s = L.tick(60);
    ok(s.fracTheo > f1 * 4 * 1.25, 'étape 1 : T + 10 % gonfle la queue', r3(s.fracTheo / (f1 * 4)));
    L.setEa(5); s = L.tick(60); ok(s.Ea === 5 && s.fracTheo < 0.02, 'étape 1 : setEa', r3(s.fracTheo));
    ok(isFinite(s.collPerS) && isFinite(s.reactPerS) && s.collPerS > 0, 'étape 1 : compteurs mesurés', r3(s.collPerS) + ' chocs/s');
    // Étape 2
    L.goStep(1); ok(L.step === 1, 'goStep(1)');
    L.setConc(1, 1); s = L.tick(30);
    const k0 = s.k; ok(Math.abs(s.v0 - s.k * 1 * 1) < 1e-9 * Math.max(1, s.v0) || Math.abs(s.v0 / (s.k) - 1) < 1e-6, 'étape 2 : v₀ = k[A][B]', r3(s.v0));
    ok(Math.abs(s.tHalf - 1 / s.k) / s.tHalf < 1e-6, 'étape 2 : t½ = 1/(k c₀) pour [A]₀ = [B]₀', r3(s.tHalf));
    L.setConc(0.2, 2); s = L.tick(30); ok(s.pseudo === true, 'étape 2 : pseudo-premier ordre signalé si [B]₀ ≥ 10 [A]₀', String(s.pseudo));
    ok(Math.abs(s.tHalf - Math.LN2 / (s.k * 2)) / s.tHalf < 0.02, 'étape 2 : t½ = ln 2/(k[B]₀) en pseudo-premier ordre', r3(s.tHalf));
    L.setConc(1, 1); const n0 = (L.state().trials || []).length; L.trial(); s = L.state();
    ok((s.trials || []).length === n0 + 1, 'étape 2 : trial() ajoute un point');
    // Étape 3
    L.goStep(2); ok(L.step === 2, 'goStep(2)');
    L.catalyst(true, 25); s = L.tick(60);
    ok(s.cat === true && s.EaCat < s.Ea && s.consumed === 0, 'étape 3 : catalyseur présent, Ea abaissée, rien de consommé', r3(s.Ea) + ' → ' + r3(s.EaCat));
    const dH1 = s.dH; L.catalyst(false); s = L.tick(30); ok(s.dH === dH1, 'étape 3 : ΔH inchangé par le catalyseur', r3(dH1));
    for (const k of ['none', 'MnO2', 'catalase']) { L.presetH2O2(k); s = L.tick(10); log.push('     preset ' + k + ' : ratio ' + r3(s.ratioTheo) + ', Ea ' + r3(s.Ea) + ', EaCat ' + r3(s.EaCat)); }
    ok(s.preset === 'catalase' && s.ratioTheo > 1e9, 'étape 3 : préréglage catalase', r3(s.ratioTheo));
    // Étape 4
    L.goStep(3); ok(L.step === 3, 'goStep(3)');
    L.setTeq(298); L.setVolume(1); L.eqCatalyst(false); s = L.tick(60 * 20);
    ok(Math.abs(s.K - 0.147) < 0.005, 'étape 4 : K(298 K)', r3(s.K));
    ok(Math.abs(s.Q / s.K - 1) < 0.35 && s.fPerS > 0 && s.rPerS > 0, 'étape 4 : à l\'équilibre, Q ≈ K et deux vitesses non nulles', 'Q/K ' + r3(s.Q / s.K) + ', ' + r3(s.fPerS) + ' / ' + r3(s.rPerS));
    const M0 = s.M; L.injectNO2(100); s = L.state(); ok(s.Q > s.K && s.M >= M0 + 90, 'étape 4 : injectNO2 → Q > K', r3(s.Q / s.K));
    s = L.tick(60 * 15); ok(Math.abs(s.Q / s.K - 1) < 0.35, 'étape 4 : retour vers Q = K', r3(s.Q / s.K));
    const a1 = s.alpha; L.setVolume(0.5); s = L.tick(60 * 15); ok(s.alpha < a1, 'étape 4 : comprimer → moins de NO₂ (α)', r3(a1) + ' → ' + r3(s.alpha));
    const a2 = s.alpha; L.setTeq(340); s = L.tick(60 * 20); ok(s.alpha > a2 && s.K > 0.147, 'étape 4 : chauffer → plus de NO₂', r3(a2) + ' → ' + r3(s.alpha));
    L.eqCatalyst(true); s = L.tick(60); ok(s.cat === true, 'étape 4 : eqCatalyst');
    L.setPlay(true);
  } catch (e) { fail++; log.push('FAIL exception : ' + e.message); }
  return { log, fail };
};
