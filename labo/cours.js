/* LABO — cours interactif, gabarit standard des explications depuis le 2026-10-15 (corpus/standards.md §2). Tout est écrit dans le HTML ; ce script
   ne fait qu'animer. Sans lui, la page reste lisible : scènes remplacées par un lien, réponses visibles.

   <figure class="labo" data-src="index.html?embed&etape=01.1" data-h="420">
     <figcaption>… <a class="ouvrir" href="index.html?etape=01.1">Ouvrir à cette étape ↗</a></figcaption>
       → iframe de la planche en mode intégré (labo/planche.js) ; le lien a.ouvrir, écrit dans le HTML,
         reste le seul accès à la scène sans script (créé par le script s'il manque).
   <div class="calc"> … <span class="var" data-nom="Q" data-val="6" data-min="0" data-max="10" data-pas="0.5" data-dec="1">
       … <output data-expr="V0 + Q*t" data-dec="1"></output> … </div>
       → nombres qu'on fait glisser (ou flèches du clavier) ; les sorties se recalculent. Une sortie sans
         data-dec reçoit le texte (HTML) que renvoie l'expression. Aussi <input type="range" data-nom="e">.
         Aides disponibles dans les expressions : fmt, fmtS, sci, mant, ordre, sup, log10, sqrt, abs, min, max, round,
         hypot, cosd, sind, atan2d (en degrés), et deux dessins : plan([[x0, y0, x1, y1, 'a'], …]) et trace({ f, x, y, seg, pts }).
   <div class="quiz" data-reponse="25" data-tol="0.1" data-unite="m/s"><p class="q">…</p><div class="corr">…</div></div>
   <div class="quiz"><p class="q">…</p><ul class="choix"><li>…</li><li data-bon>…</li></ul><div class="corr">…</div></div>
   <ol class="pas-a-pas"> → une étape à la fois, bouton « Étape suivante ».
   <a class="terme" href="#def-ordre">ordre de grandeur</a> → bulle avec la définition de la liste .defs.
   <nav class="cours-sommaire"> → suit la lecture ; .cours-avance → barre de progression. */
(() => {
'use strict';
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- nombres à la française ---------- */
const NNBSP = ' ';
function fmt(x, d = 2){
  if (!isFinite(x)) return '—';
  if (Math.abs(x) < 0.5 * 10 ** -d) x = 0;
  const s = Math.abs(x).toFixed(d).split('.');
  s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
  return (x < 0 ? '−' : '') + s.join(',');
}
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
const sup = n => String(n).split('').map(c => SUP[c] || c).join('');
const expo = x => { let e = Math.floor(Math.log10(Math.abs(x))); if (Math.abs(x) / 10 ** e >= 9.9999999) e++; return e; };
/** mantisse a (1 ≤ a < 10), arrondie à sig chiffres significatifs */
const mant = (x, sig = 3) => { const e = expo(x); let a = x / 10 ** e; return +a.toFixed(sig - 1) >= 10 ? 1 : +a.toFixed(sig - 1); };
/** notation scientifique « 6,3 × 10⁻⁶ » */
function sci(x, sig = 2){
  if (x === 0) return '0';
  let e = expo(x), a = x / 10 ** e;
  if (+Math.abs(a).toFixed(sig - 1) >= 10){ e++; a = x / 10 ** e; }
  return `${fmt(a, sig - 1)} × 10${sup(e)}`;
}
const ordre = x => Math.round(Math.log10(Math.abs(x)));
const RAD = Math.PI / 180;
const r2 = x => +x.toFixed(3);
/** Petit plan de vecteurs, en SVG : plan([[x0, y0, x1, y1, 'a'], …], R). Classes : a (phénomène), b, r (résultante),
    c (composante, pointillée), rail (trait épais sans flèche). Le y monte, comme en physique. */
function plan(vs, R = 10){
  const s = [`<svg class="plan" viewBox="${-R - 1} ${-R - 1} ${2 * R + 2} ${2 * R + 2}" role="img" aria-label="Plan des vecteurs"><g class="grille">`];
  for (let i = -R; i <= R; i++) s.push(`<line x1="${i}" y1="${-R}" x2="${i}" y2="${R}"/><line x1="${-R}" y1="${i}" x2="${R}" y2="${i}"/>`);
  s.push(`</g><line class="axe" x1="${-R}" y1="0" x2="${R}" y2="0"/><line class="axe" x1="0" y1="${-R}" x2="0" y2="${R}"/>`);
  vs.forEach(([x0, y0, x1, y1, k = 'a']) => {
    const X0 = r2(x0), Y0 = r2(-y0), X1 = r2(x1), Y1 = r2(-y1), L = Math.hypot(X1 - X0, Y1 - Y0);
    if (k === 'rail'){ s.push(`<line class="v-rail" x1="${X0}" y1="${Y0}" x2="${X1}" y2="${Y1}"/>`); return; }
    if (L < 0.05) return;
    const ux = (X1 - X0) / L, uy = (Y1 - Y0) / L, t = Math.min(0.9, L * 0.4), w = t * 0.55;
    const bx = X1 - ux * t, by = Y1 - uy * t;
    s.push(`<g class="v-${k}"><line x1="${X0}" y1="${Y0}" x2="${r2(bx)}" y2="${r2(by)}"/>` +
      `<polygon points="${X1},${Y1} ${r2(bx - uy * w)},${r2(by + ux * w)} ${r2(bx + uy * w)},${r2(by - ux * w)}"/></g>`);
  });
  return s.join('') + '</svg>';
}
/** Petite courbe en SVG : trace({ f, x: [a, b], y: [c, d], seg: [[x0, y0, x1, y1, 'cls']], pts: [[x, y]] }) */
function trace(o){
  const W = 220, H = 150, m = 12, [xa, xb] = o.x, [ya, yb] = o.y;
  const X = x => r2(m + (x - xa) / (xb - xa) * (W - 2 * m)), Y = y => r2(H - m - (y - ya) / (yb - ya) * (H - 2 * m));
  const p = []; for (let i = 0; i <= 60; i++){ const x = xa + (xb - xa) * i / 60; p.push(X(x) + ',' + Y(o.f(x))); }
  const s = [`<svg class="trace" viewBox="0 0 ${W} ${H}" role="img" aria-label="Graphe"><line class="axe" x1="${m}" y1="${Y(Math.max(ya, 0))}" x2="${W - m}" y2="${Y(Math.max(ya, 0))}"/><line class="axe" x1="${X(Math.max(xa, 0))}" y1="${m}" x2="${X(Math.max(xa, 0))}" y2="${H - m}"/>`,
    `<polyline class="courbe" points="${p.join(' ')}"/>`];
  (o.seg || []).forEach(([x0, y0, x1, y1, k = 'sec']) => s.push(`<line class="${k}" x1="${X(x0)}" y1="${Y(y0)}" x2="${X(x1)}" y2="${Y(y1)}"/>`));
  (o.pts || []).forEach(([x, y]) => s.push(`<circle class="pt" cx="${X(x)}" cy="${Y(y)}" r="3"/>`));
  return s.join('') + '</svg>';
}
const AIDES = { fmt, sci, mant, ordre, sup, plan, trace, log10: Math.log10, sqrt: Math.sqrt, abs: Math.abs, min: Math.min, max: Math.max, round: Math.round, hypot: Math.hypot, PI: Math.PI,
  cosd: d => Math.cos(d * RAD), sind: d => Math.sin(d * RAD), atan2d: (y, x) => Math.atan2(y, x) / RAD,
  fmtS: (x, d = 1) => (x > 0.5 * 10 ** -d ? '+' : '') + fmt(x, d) };
const num = s => parseFloat(String(s).replace(/[\s ]/g, '').replace(',', '.').replace('−', '-'));

/* ---------- scènes intégrées ---------- */
$$('figure.labo[data-src]').forEach(f => {
  const src = f.dataset.src, cadre = document.createElement('div');
  cadre.className = 'cadre';
  const ifr = document.createElement('iframe');
  ifr.src = src; ifr.loading = 'lazy'; ifr.title = f.dataset.titre || 'Scène de la planche';
  const h = () => { ifr.height = innerWidth < 640 ? (f.dataset.hMobile || Math.max(320, (+f.dataset.h || 420) - 60)) : (f.dataset.h || 420); };
  h(); addEventListener('resize', h);
  cadre.append(ifr); f.prepend(cadre);
  const plein = new URL(src, location.href);
  ['embed', 'panneau', 'controles'].forEach(k => plein.searchParams.delete(k));
  // le lien statique a.ouvrir (écrit dans le HTML, repli sans script) est repris ; sinon on le crée
  let cap = f.querySelector('figcaption');
  if (!cap){ cap = document.createElement('figcaption'); f.append(cap); }
  let lien = cap.querySelector('a.ouvrir');
  if (!lien){ lien = document.createElement('a'); lien.className = 'ouvrir'; lien.textContent = 'Ouvrir à cette étape ↗'; cap.append(lien); }
  lien.href = plein.href;
});

/* ---------- calculs vivants ---------- */
$$('.calc').forEach(box => {
  const vars = $$('[data-nom]', box), sorties = $$('output[data-expr]', box);
  const val = {};
  const lit = v => v.tagName === 'INPUT' ? +v.value : +v.dataset.val;
  const fns = sorties.map(o => {
    const noms = vars.map(v => v.dataset.nom).concat(Object.keys(AIDES));
    try { return new Function(...noms, `return (${o.dataset.expr});`); } catch (e) { console.warn('LABO cours : expression illisible', o.dataset.expr); return () => '—'; }
  });
  function calcule(){
    vars.forEach(v => { val[v.dataset.nom] = lit(v); });
    const args = vars.map(v => val[v.dataset.nom]).concat(Object.values(AIDES));
    sorties.forEach((o, i) => {
      let r; try { r = fns[i](...args); } catch (e) { r = '—'; }
      const html = typeof r === 'number' ? fmt(r, o.dataset.dec != null ? +o.dataset.dec : 2) : String(r);
      if (o._h !== html){ o._h = html; o.innerHTML = html; }
    });
  }
  vars.forEach(v => {
    if (v.tagName === 'INPUT'){ v.addEventListener('input', calcule); return; }
    const mn = +v.dataset.min, mx = +v.dataset.max, pas = +v.dataset.pas || 1, dec = v.dataset.dec != null ? +v.dataset.dec : 1;
    const valeurs = v.dataset.valeurs ? v.dataset.valeurs.split(';').map(Number) : null;   // ensemble discret
    const noms = v.dataset.noms ? v.dataset.noms.split(';') : null;   // libellés des valeurs discrètes
    const montre = () => { v.textContent = noms && valeurs ? noms[+v.dataset.i] : fmt(+v.dataset.val, dec) + (v.dataset.unite ? ' ' + v.dataset.unite : ''); v.setAttribute('aria-valuenow', v.dataset.val); v.setAttribute('aria-valuetext', v.textContent); };
    const pose = x => {
      if (valeurs){ const i = Math.max(0, Math.min(valeurs.length - 1, Math.round(x))); v.dataset.i = i; x = valeurs[i]; }
      else x = Math.min(mx, Math.max(mn, Math.round(x / pas) * pas));
      v.dataset.val = +x.toFixed(10); montre(); calcule();
    };
    const indice = () => valeurs ? +(v.dataset.i ?? valeurs.indexOf(+v.dataset.val)) : +v.dataset.val;
    v.tabIndex = 0; v.setAttribute('role', 'slider');
    v.setAttribute('aria-label', v.dataset.label || v.dataset.nom);
    if (!valeurs){ v.setAttribute('aria-valuemin', mn); v.setAttribute('aria-valuemax', mx); }
    if (valeurs) v.dataset.i = Math.max(0, valeurs.indexOf(+v.dataset.val));
    v.title = 'Glisse horizontalement, ou flèches du clavier';
    let x0 = 0, i0 = 0;
    v.addEventListener('pointerdown', e => { x0 = e.clientX; i0 = indice(); v.setPointerCapture(e.pointerId); v.classList.add('tire'); e.preventDefault(); });
    v.addEventListener('pointermove', e => {
      if (!v.hasPointerCapture(e.pointerId)) return;
      const crans = Math.round((e.clientX - x0) / (valeurs ? 24 : 6));
      pose(valeurs ? i0 + crans : i0 + crans * pas);
    });
    const fin = () => v.classList.remove('tire');
    v.addEventListener('pointerup', fin); v.addEventListener('pointercancel', fin);
    v.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key]; if (!d) return;
      e.preventDefault(); pose(valeurs ? indice() + d : +v.dataset.val + d * pas * (e.shiftKey ? 10 : 1));
    });
    montre();
  });
  calcule();
});

/* ---------- questions ---------- */
$$('.quiz').forEach(q => {
  const corr = q.querySelector('.corr'), choix = q.querySelector('.choix');
  const verdict = document.createElement('span'); verdict.className = 'verdict';
  if (corr) corr.prepend(verdict);
  const fini = (juste, texte) => {
    verdict.className = 'verdict ' + (juste === null ? '' : juste ? 'juste' : 'faux');
    verdict.textContent = texte;
    q.classList.add('repondu');
    q.querySelectorAll('button,input').forEach(x => { x.disabled = true; });
  };
  if (choix){
    $$('li', choix).forEach(li => {
      const b = document.createElement('button'); b.type = 'button';
      while (li.firstChild) b.append(li.firstChild);
      li.append(b);
      b.addEventListener('click', () => {
        b.classList.add('choisi');
        const bon = choix.querySelector('li[data-bon] button'); if (bon) bon.classList.add('bon');
        fini(li.hasAttribute('data-bon'), li.hasAttribute('data-bon') ? 'Juste.' : 'Pas tout à fait.');
      });
    });
  } else if (q.dataset.reponse != null){
    const rep = +q.dataset.reponse, tol = q.dataset.tol != null ? +q.dataset.tol : Math.abs(rep) * 0.02;
    const f = document.createElement('form'); f.className = 'quiz-rep';
    f.innerHTML = `<input type="text" inputmode="decimal" autocomplete="off" aria-label="Ta réponse"><span class="u">${q.dataset.unite || ''}</span><button type="submit">Vérifier</button><button type="button" class="voir">Voir la réponse</button>`;
    q.querySelector('.q').after(f);
    const inp = f.querySelector('input');
    f.addEventListener('submit', e => {
      e.preventDefault(); const v = num(inp.value);
      if (!isFinite(v)){ inp.focus(); return; }
      const ok = Math.abs(v - rep) <= tol;
      fini(ok, ok ? 'Juste.' : `Pas tout à fait : on attendait ${fmt(rep, q.dataset.dec != null ? +q.dataset.dec : 2).replace(/,0+$/, '')} ${q.dataset.unite || ''}.`);
    });
    f.querySelector('.voir').addEventListener('click', () => fini(null, 'Réponse :'));
  }
});

/* ---------- exemple pas à pas ---------- */
$$('ol.pas-a-pas').forEach(ol => {
  const lis = $$(':scope > li', ol); if (lis.length < 2) return;
  let n = +(ol.dataset.montre ?? 1);
  lis.forEach((li, i) => li.classList.toggle('cache', i >= n));
  const b = document.createElement('button'); b.type = 'button'; b.className = 'pas-suivant';
  const maj = () => { b.textContent = n === 0 ? 'Voir la première étape' : `Étape suivante (${n} / ${lis.length})`; b.hidden = n >= lis.length; };
  b.addEventListener('click', () => { const li = lis[n++]; li.classList.remove('cache'); li.classList.add('vient'); maj(); });
  ol.after(b); maj();
});

/* ---------- glossaire : bulle au survol ou au focus ---------- */
const bulle = document.createElement('div'); bulle.className = 'bulle'; bulle.setAttribute('role', 'tooltip'); bulle.id = 'bulle';
document.body.append(bulle);
const montreBulle = a => {
  const cible = document.getElementById(decodeURIComponent(a.hash.slice(1))); if (!cible) return;
  const dt = cible.querySelector('dt'), dd = cible.querySelector('dd'); if (!dd) return;
  bulle.innerHTML = `<b>${dt ? dt.innerHTML : ''}</b>${dd.innerHTML}`;
  const r = a.getBoundingClientRect(), w = Math.min(300, innerWidth - 24);
  bulle.style.width = w + 'px';
  bulle.style.left = Math.max(12, Math.min(innerWidth - w - 12, r.left + scrollX)) + 'px';
  bulle.style.top = (r.bottom + scrollY + 8) + 'px';
  bulle.classList.add('on'); a.setAttribute('aria-describedby', 'bulle');
};
const cacheBulle = () => bulle.classList.remove('on');
$$('a.terme').forEach(a => {
  a.addEventListener('mouseenter', () => montreBulle(a)); a.addEventListener('focus', () => montreBulle(a));
  a.addEventListener('mouseleave', cacheBulle); a.addEventListener('blur', cacheBulle);
});
addEventListener('scroll', cacheBulle, { passive: true });

/* ---------- sommaire qui suit la lecture, barre de progression ---------- */
const liens = $$('.cours-sommaire a[href^="#"]');
const cibles = liens.map(a => document.getElementById(a.hash.slice(1))).filter(Boolean);
const avance = document.querySelector('.cours-avance');
let attente = 0;
function suit(){
  attente = 0;
  const h = document.documentElement, haut = scrollY + 110;
  if (avance) avance.style.width = (100 * scrollY / Math.max(1, h.scrollHeight - innerHeight)) + '%';
  let ici = null;
  cibles.forEach(c => { if (c.getBoundingClientRect().top + scrollY <= haut) ici = c; });
  liens.forEach(a => a.classList.toggle('ici', !!ici && a.hash === '#' + ici.id));
  // le module en cours déplie ses rubriques
  $$('.cours-sommaire li').forEach(li => li.classList.toggle('ouvert', !!li.querySelector('a.ici')));
}
addEventListener('scroll', () => { if (!attente) attente = requestAnimationFrame(suit); }, { passive: true });
addEventListener('load', suit); suit();
})();
