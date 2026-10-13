/* LABO — fiche d'étape (prototype, 2026-10-13). Remplace les couches Observer / Manipuler / Comprendre
   par une fiche lue de haut en bas dans le panneau : Regarde → Prédis → Essaie → Lectures (le panneau
   du toy, inchangé) → Pourquoi → étape suivante. Activée par <body class="labo-etapes labo-fiche">.

   La page fournit le contenu et deux crochets :
     Fiche.init({
       etapes: [{ code: '01.1', titre: 'Échelles', mod: 1, scenes: [0, 1] }, …],   // l'ordre de la barre
       fiches: [ { scene: 'Zoom', titre, regarde, prediction, essais, pourquoi, relation, vivant,
                   defs, piege }, … ],                                             // une par scène
       etat:   () => objet lu par les fonctions des fiches (état de la simulation),
       aller:  i => …,                     // ouvrir la scène i (la page garde sa navigation)
       k:      (tex, repli, bloc) => html,  // rendu KaTeX de la page
       theorie: mod => 'explication.html#m01',
     });
     Fiche.montre(i)   // à appeler à chaque changement de scène

   Une fiche :
     regarde    : html, ce qu'il faut remarquer (1 ou 2 phrases).
     prediction : { q, reponse, unite?, tol?, explication }            réponse numérique (virgule acceptée)
                  { q, choix: ['…', '…'], bonne: 1, explication }      choix
     essais     : [{ t: html, fait: (e, mem) => bool }]  cochés d'eux-mêmes quand fait() devient vrai.
     suivi      : (e, mem) => …   appelée à chaque image, pour retenir ce qui s'est passé (mem est
                  remis à zéro à chaque visite de la scène).
     pourquoi   : html.  relation : TeX statique.  vivant : e => TeX (recalculé, rendu si le texte change).
     defs       : [[terme, définition], …].  piege : html. */
(() => {
'use strict';
let O = null, cur = -1, mem = {}, faits = new Set(), boucle = 0;
const etats = new Map();     // par scène : essais cochés et réponse donnée, gardés pendant la session
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

const haut = el('div', 'fiche-haut'), bas = el('div', 'fiche-bas');

function etapeDe(i) { return O.etapes.findIndex(s => s.scenes.includes(i)); }
const num = x => parseFloat(String(x).replace(/\s/g, '').replace(',', '.').replace('−', '-'));

function init(opts) {
  O = opts;
  const panel = $('.panel'), toy = $('#toyPanel');
  if (!panel || !toy) return;
  toy.before(haut); toy.after(bas);
  toy.classList.add('fiche-lectures');
  // le clavier passe dans un repli, en bas
  const hints = $('#hints');
  if (hints) {
    const d = el('details', 'fiche-clavier', '<summary>Clavier</summary>');
    d.append(hints); panel.append(d);
  }
  // le bouton Focus rejoint la barre ; F le bascule aussi
  const droite = $('.barre .droite');
  if (droite) {
    const b = el('button', 'bascule-theme focus', 'Focus');
    b.type = 'button'; b.title = 'Scène seule (F)'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => focus());
    droite.prepend(b);
  }
  addEventListener('keydown', e => {
    if (e.target.closest('input:not([type=range]),textarea,select') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'f' || e.key === 'F') focus();
  });
}

function focus(on) {
  const o = on === undefined ? !document.body.classList.contains('fiche-focus') : on;
  document.body.classList.toggle('fiche-focus', o);
  const b = $('.barre .focus'); if (b) b.setAttribute('aria-pressed', String(o));
}

function montre(i) {
  if (!O || !O.fiches[i]) return;
  if (i === cur) return;
  cur = i; mem = {};
  const f = O.fiches[i], ie = etapeDe(i), E = O.etapes[ie];
  if (ie !== montre.etape) { montre.etape = ie; const p = $('.panel'); if (p) p.scrollTop = 0; }
  if (!etats.has(i)) etats.set(i, { faits: new Set(), rep: null });
  const S = etats.get(i); faits = S.faits;

  /* ---------- en-tête, regarde, prédiction, essais ---------- */
  const autres = E.scenes.length > 1
    ? `<div class="fiche-scenes" role="group" aria-label="Scène">${E.scenes.map(j =>
        `<button type="button" data-s="${j}" aria-pressed="${j === i}">${O.fiches[j].scene}</button>`).join('')}</div>` : '';
  haut.innerHTML = `
    <header class="fiche-tete">
      <p class="fiche-ou"><b>${E.code}</b> · étape ${ie + 1} sur ${O.etapes.length}</p>
      <h2>${f.titre}</h2>
      ${autres}
    </header>
    <section class="fiche-s"><h3>Regarde</h3><p>${f.regarde}</p></section>
    ${f.prediction ? `<section class="fiche-s fiche-predi"><h3>Prédis</h3><p>${f.prediction.q}</p><div class="fiche-rep"></div><p class="fiche-retour" aria-live="polite"></p></section>` : ''}
    ${f.essais && f.essais.length ? `<section class="fiche-s"><h3>Essaie <span class="fiche-compte"></span></h3><ul class="fiche-essais">${f.essais.map((x, n) =>
        `<li data-n="${n}"><span class="coche" aria-hidden="true"></span><span>${x.t}</span></li>`).join('')}</ul></section>` : ''}
    <p class="fiche-lab">Lectures</p>`;
  haut.querySelectorAll('.fiche-scenes button').forEach(b => b.addEventListener('click', () => O.aller(+b.dataset.s)));
  if (f.prediction) prediction(f.prediction, S);

  /* ---------- pourquoi, définitions, piège, suite ---------- */
  const k = (t, bloc) => O.k(t, t, bloc);
  const prev = O.etapes[ie - 1], next = O.etapes[ie + 1];
  bas.innerHTML = `
    <section class="fiche-s fiche-pourquoi"><h3>Pourquoi</h3><p>${f.pourquoi}</p>
      ${f.relation ? `<div class="fiche-rel">${k(f.relation, true)}</div>` : ''}
      ${f.vivant ? `<div class="fiche-rel fiche-vivant" title="Calculé avec les valeurs de la scène"></div>` : ''}
    </section>
    ${f.defs && f.defs.length ? `<details class="fiche-pli"><summary>Définitions</summary><dl>${f.defs.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl></details>` : ''}
    ${f.piege ? `<details class="fiche-pli"><summary>Piège fréquent</summary><p>${f.piege}</p></details>` : ''}
    <nav class="fiche-nav" aria-label="Étapes">
      ${prev ? `<button type="button" class="fiche-pas" data-s="${prev.scenes[0]}"><span>← ${prev.code}</span>${prev.titre}</button>` : '<span></span>'}
      ${next ? `<button type="button" class="fiche-pas suiv" data-s="${next.scenes[0]}"><span>${next.code} →</span>${next.titre}</button>` : '<span></span>'}
    </nav>
    <a class="fiche-theorie" href="${O.theorie(E.mod)}">Théorie complète du module ${String(E.mod).padStart(2, '0')} <span aria-hidden="true">→</span></a>`;
  bas.querySelectorAll('.fiche-pas').forEach(b => b.addEventListener('click', () => O.aller(+b.dataset.s)));
  bas.querySelectorAll('.fiche-pli').forEach(d => d.addEventListener('toggle', () => { O.ouverts = O.ouverts || {}; O.ouverts[d.querySelector('summary').textContent] = d.open; }));
  if (O.ouverts) bas.querySelectorAll('.fiche-pli').forEach(d => { d.open = !!O.ouverts[d.querySelector('summary').textContent]; });

  for (const n of faits) coche(n, false);
  compte();
  haut.classList.remove('swap'); void haut.offsetWidth; haut.classList.add('swap');
  if (!boucle) boucle = requestAnimationFrame(tick);
}

function prediction(p, S) {
  const box = $('.fiche-rep', haut), retour = $('.fiche-retour', haut);
  const montrer = (juste, donnee) => {
    S.rep = { juste, donnee };
    retour.className = 'fiche-retour ' + (juste ? 'juste' : 'faux');
    retour.innerHTML = `<b>${juste ? 'Juste.' : 'Pas tout à fait.'}</b> ${p.explication}`;
    box.querySelectorAll('button,input').forEach(x => x.disabled = true);
  };
  if (p.choix) {
    box.innerHTML = `<div class="fiche-choix">${p.choix.map((c, n) => `<button type="button" data-n="${n}">${c}</button>`).join('')}</div>`;
    box.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      const n = +b.dataset.n; b.classList.add('choisi'); box.querySelector(`[data-n="${p.bonne}"]`).classList.add('bonne');
      montrer(n === p.bonne, n);
    }));
    if (S.rep) { box.querySelector(`[data-n="${S.rep.donnee}"]`).classList.add('choisi'); box.querySelector(`[data-n="${p.bonne}"]`).classList.add('bonne'); montrer(S.rep.juste, S.rep.donnee); }
  } else {
    box.innerHTML = `<form class="fiche-num"><input type="text" inputmode="decimal" autocomplete="off" aria-label="Ta prédiction"><span>${p.unite || ''}</span><button type="submit">Vérifier</button><button type="button" class="voir">Voir</button></form>`;
    const form = $('form', box), inp = $('input', box);
    form.addEventListener('submit', e => {
      e.preventDefault(); const v = num(inp.value); if (!isFinite(v)) { inp.focus(); return; }
      const tol = p.tol != null ? p.tol : Math.abs(p.reponse) * 0.05 + 1e-9;
      montrer(Math.abs(v - p.reponse) <= tol, inp.value); inp.blur();
    });
    $('.voir', box).addEventListener('click', () => { inp.value = ''; montrer(false, ''); retour.querySelector('b').textContent = 'Réponse :'; });
    if (S.rep) { inp.value = S.rep.donnee; montrer(S.rep.juste, S.rep.donnee); if (S.rep.donnee === '') retour.querySelector('b').textContent = 'Réponse :'; }
  }
}

function coche(n, anime = true) {
  const li = haut.querySelector(`.fiche-essais li[data-n="${n}"]`); if (!li) return;
  li.classList.add('fait'); if (anime) { li.classList.remove('vient'); void li.offsetWidth; li.classList.add('vient'); }
}
function compte() {
  const f = O.fiches[cur], c = $('.fiche-compte', haut); if (!c || !f.essais) return;
  c.textContent = `${faits.size} / ${f.essais.length}`;
  const ie = etapeDe(cur), E = O.etapes[ie];
  const fini = E.scenes.every(j => { const s = etats.get(j), F = O.fiches[j]; return !F.essais || (s && s.faits.size === F.essais.length); });
  const seg = document.querySelectorAll('#stepper .seg')[ie]; if (seg) seg.classList.toggle('fiche-fini', fini);
}

function tick() {
  boucle = requestAnimationFrame(tick);
  const f = O.fiches[cur]; if (!f) return;
  let e; try { e = O.etat(); } catch (_) { return; }
  if (!e) return;
  try { if (f.suivi) f.suivi(e, mem); } catch (_) { /* état pas encore prêt */ }
  (f.essais || []).forEach((x, n) => {
    if (faits.has(n)) return;
    let ok = false; try { ok = x.fait(e, mem); } catch (_) {}
    if (ok) { faits.add(n); coche(n); compte(); }
  });
  if (f.vivant) {
    const box = $('.fiche-vivant', bas); if (!box) return;
    let t = ''; try { t = f.vivant(e); } catch (_) {}
    if (box._t !== t) { box._t = t; box.innerHTML = t ? O.k(t, t, true) : ''; }
  }
}

window.Fiche = { init, montre, focus };
})();
