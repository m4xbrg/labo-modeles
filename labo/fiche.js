/* LABO — fiche d'étape. Gabarit standard des planches depuis le 2026-10-15 (prototype du 2026-10-13 sur
   Langage scientifique) : voir labo/GABARIT.md et corpus/standards.md §4. Remplace les couches
   Observer / Manipuler / Comprendre par une fiche lue de haut en bas dans le panneau : Regarde → Prédis →
   Essaie → Lectures (le panneau de la page, inchangé) → Pourquoi → étape suivante.
   Activée par <body class="labo-etapes labo-fiche" data-mode="fiche">.

   La page fournit le contenu et deux crochets :
     Fiche.init({
       etapes: [{ code: '01.1', titre: 'Échelles', mod: 1, scenes: [0, 1] }, …],   // l'ordre de la barre
       fiches: [ { scene: 'Zoom', titre, regarde, prediction, essais, pourquoi, relation, vivant,
                   defs, piege }, … ],                                             // une par scène
       etat:   () => objet lu par les fonctions des fiches (état de la simulation),
       aller:  i => …,                     // ouvrir la scène i (la page garde sa navigation)
       k:      (tex, repli, bloc) => html,  // rendu KaTeX de la page
       theorie: mod => 'explication.html#m01',
       // facultatifs
       lectures: '#toyPanel',              // élément (ou sélecteur) du panneau qui devient « Lectures »
       theorieTexte: E => '…',             // libellé du lien de fin ; défaut : « Théorie complète du module NN »,
                                           // ou « Comprendre ce qui se passe » si l'étape n'a pas de mod (showcase)
       toucheFocus: 'f',                   // false si la page utilise déjà F ; le bouton Focus reste
     });
     Fiche.montre(i)   // à appeler à chaque changement de scène
     Fiche.relance()   // à appeler quand la page remet la MÊME scène à son état de départ (voir plus bas)

   Une fiche :
     regarde    : html, ce qu'il faut remarquer (1 ou 2 phrases).
     prediction : { q, reponse, unite?, tol?, explication }            réponse numérique (virgule acceptée)
                  { q, choix: ['…', '…'], bonne: 1, explication }      choix
     essais     : [{ t: html, fait: (e, mem) => bool }]  cochés d'eux-mêmes quand fait() devient vrai.
     suivi      : (e, mem) => …   appelée à chaque image, pour retenir ce qui s'est passé (mem est
                  remis à zéro à chaque visite de la scène, et à chaque Fiche.relance()).
     pourquoi   : html.  relation : TeX statique.  vivant : e => TeX (recalculé, rendu si le texte change).
     defs       : [[terme, définition], …].  piege : html.

   Remettre la scène à zéro : montre(i) sort tout de suite quand i est déjà la scène en cours (la fiche
   n'est pas reconstruite, les essais cochés restent cochés). mem n'est donc PAS remis à zéro quand la page
   réapplique la même scène : Réinitialiser, touche R, clic sur l'étape en cours, préréglage. Les essais qui
   comparent l'état à un instantané gardé dans mem (instant(mem, 'v0', …), mem.depart = e) comparent alors à
   un départ périmé : un essai se coche sans geste (le reset remet les valeurs par défaut, différentes de
   celles du premier passage) ou ne peut plus l'être (identifiants d'objets recréés, compteurs remis à zéro).
   Règle : partout où la page remet la scène en état de départ SANS changer d'index, appeler Fiche.relance()
   juste avant Fiche.montre(i), ou seule si la page n'appelle pas montre à cet endroit :
     if (window.Fiche) { Fiche.relance(); Fiche.montre(i); }      // dans la fonction d'étape
     function reset() { …; if (window.Fiche) Fiche.relance(); }   // reset propre à un jouet
   Si le reset change des réglages tout de suite et n'applique la scène qu'après un fondu, relancer avant la
   première modification : pendant le fondu, la fiche lit déjà les nouveaux réglages.
   relance() ne remet à zéro que mem : la fiche, la prédiction et les essais déjà cochés ne bougent pas, et
   mem se remplit de nouveau à l'image suivante, à partir de l'état tel qu'il est alors. */
(() => {
'use strict';
let O = null, cur = -1, mem = {}, faits = new Set(), boucle = 0;
const etats = new Map();     // par scène : essais cochés et réponse donnée, gardés pendant la session
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

const haut = el('div', 'fiche-haut'), bas = el('div', 'fiche-bas');

const libelleTheorie = E => O.theorieTexte ? O.theorieTexte(E)
  : E.mod != null && E.mod !== '' ? `Théorie complète du module ${String(E.mod).padStart(2, '0')}` : 'Comprendre ce qui se passe';

function etapeDe(i) { return O.etapes.findIndex(s => s.scenes.includes(i)); }
const num = x => parseFloat(String(x).replace(/\s/g, '').replace(',', '.').replace('−', '-'));

function init(opts) {
  O = opts;
  const panel = $('.panel'), lec = O.lectures || '#toyPanel';
  const toy = typeof lec === 'string' ? $(lec) : lec;
  if (!panel || !toy) { console.warn('Fiche : panneau ou lectures introuvables (' + lec + ')'); O = null; return; }
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
  const tf = O.toucheFocus === undefined ? 'f' : O.toucheFocus;
  if (tf) addEventListener('keydown', e => {
    if (e.target.closest('input:not([type=range]),textarea,select') || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.toLowerCase() === tf) focus();
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
    <a class="fiche-theorie" href="${O.theorie(E.mod)}">${libelleTheorie(E)} <span aria-hidden="true">→</span></a>`;
  bas.querySelectorAll('.fiche-pas').forEach(b => b.addEventListener('click', () => O.aller(+b.dataset.s)));
  bas.querySelectorAll('.fiche-pli').forEach(d => d.addEventListener('toggle', () => { O.ouverts = O.ouverts || {}; O.ouverts[d.querySelector('summary').textContent] = d.open; }));
  if (O.ouverts) bas.querySelectorAll('.fiche-pli').forEach(d => { d.open = !!O.ouverts[d.querySelector('summary').textContent]; });

  for (const n of faits) coche(n, false);
  compte();
  haut.classList.remove('swap'); void haut.offsetWidth; haut.classList.add('swap');
  if (!boucle) boucle = requestAnimationFrame(tick);
}

/* La page vient de remettre la scène en cours à son état de départ : l'instantané d'arrivée gardé dans mem
   n'est plus le bon. On le jette ; suivi() le reprendra à l'image suivante. Les essais cochés restent cochés. */
function relance() { mem = {}; }

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

window.Fiche = { init, montre, relance, focus };
})();
