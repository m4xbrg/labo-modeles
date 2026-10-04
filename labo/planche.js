/* LABO — comportement commun des planches au gabarit.
   - trois couches Observer / Manipuler / Comprendre (onglets, touches 1 2 3, ?mode=… dans l'URL) ;
   - position « NN / 50 » et planches voisines, lues dans le corpus d'après <body data-module="NN"> ;
   - Échap transmis aux planches (fermer une fiche, etc.).
   Le texte d'aide de chaque couche vient de l'attribut data-indice de son onglet.
   API : Planche.mode(m), Planche.actif(), Planche.surMode(fn), Planche.surEchap(fn). */
(() => {
'use strict';
const $ = s => document.querySelector(s);
const onglets = [...document.querySelectorAll('.modes [role=tab]')];
const indice = $('#indice');
const abonnes = [], echap = [];

function mode(m){
  if (!onglets.some(b => b.dataset.m === m)) return;
  document.body.dataset.mode = m;
  onglets.forEach(b => { const oui = b.dataset.m === m; b.setAttribute('aria-selected', oui); b.tabIndex = oui ? 0 : -1; });
  const b = onglets.find(x => x.dataset.m === m);
  if (indice && b) indice.textContent = b.dataset.indice || '';
  abonnes.forEach(f => f(m));
}
onglets.forEach((b, i) => {
  b.addEventListener('click', () => mode(b.dataset.m));
  b.addEventListener('keydown', e => {   // flèches dans la liste d'onglets (motif ARIA tabs)
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!d) return;
    const n = onglets[(i + d + onglets.length) % onglets.length]; n.focus(); mode(n.dataset.m); e.preventDefault();
  });
});
addEventListener('keydown', e => {
  if (e.target.closest('input,textarea,select')) return;
  const k = { '1': 'observer', '2': 'manipuler', '3': 'comprendre' }[e.key];
  if (k) mode(k);
  if (e.key === 'Escape') echap.forEach(f => f());
});

// Position et voisins depuis le corpus (le HTML statique sert de repli si le corpus est illisible)
const num = +document.body.dataset.module;
if (num && window.LaboCorpus) window.LaboCorpus.charge().then(C => {
  const m = C.module(num); if (!m) return;
  const pos = $('.barre .pos');
  if (pos) pos.innerHTML = `<span>Fondations · ${m.domaine} · </span><b>${String(num).padStart(2, '0')}</b> / ${C.modules.length}`;
  const { avant, apres } = C.voisins(num);
  const MAQ = (window.LaboPresentation || {}).MAQUETTES || {};
  const cible = v => v && (v.ouvert ? v.href : (MAQ[v.id] || null));
  const carte = (v, sens) => {
    if (!v) return '<div></div>';
    const href = cible(v), n = String(v.id).padStart(2, '0');
    const lab = sens < 0 ? `← ${n}${href ? '' : ' · à venir'}` : `${n}${href ? '' : ' · à venir'} →`;
    const cls = sens > 0 ? 'apres' + (href ? ' lien' : '') : '';
    return href ? `<a class="${cls}" href="${href}"><span class="label">${lab}</span><span class="t">${v.titre}</span></a>`
                : `<div class="${cls}"><span class="label">${lab}</span><span class="t">${v.titre}</span></div>`;
  };
  const suite = $('.suite');
  if (suite) suite.innerHTML = carte(avant, -1) + carte(apres, 1);
}).catch(err => console.warn('LABO : corpus illisible, position et voisins laissés tels quels', err));

const m0 = new URLSearchParams(location.search).get('mode');
mode(onglets.some(b => b.dataset.m === m0) ? m0 : (document.body.dataset.mode || 'observer'));

window.Planche = {
  mode,
  actif: () => document.body.dataset.mode !== 'observer',
  surMode: f => abonnes.push(f),
  surEchap: f => echap.push(f),
};
})();
