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
// Touches des couches : 1 2 3 par défaut ; <body data-touches="omc"> quand les chiffres servent déjà
// à choisir une étape (planches à étapes).
const TOUCHES = (document.body.dataset.touches || '123').split('');
addEventListener('keydown', e => {
  if (e.target.closest('input,textarea,select') || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = { [TOUCHES[0]]: 'observer', [TOUCHES[1]]: 'manipuler', [TOUCHES[2]]: 'comprendre' }[e.key.toLowerCase()];
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

// Planches à étapes : plein écran, coque repliée en une barre. Le titre complet, la signature et
// l'indice des couches se déplient avec le bouton « Infos » (touche I). Les éléments sont déplacés,
// pas recréés : identifiants et écouteurs de la page restent valables.
const app = document.body.classList.contains('labo-etapes') && $('.app');
const ajuste = () => { if (!app || innerWidth <= 860) return; document.body.style.setProperty('--chrome', Math.round(app.getBoundingClientRect().top + scrollY) + 'px'); };
if (app){
  const barre = $('.barre'), titre = $('.titre'), chap = $('.chapitres'), modes = $('.modes'), liste = modes && modes.querySelector('[role=tablist]');
  if (barre && titre && chap){   // sans couches (fiche d'étape, labo/fiche.js), la liste d'onglets manque
    barre.classList.add('compacte');
    const court = document.createElement('p'); court.className = 'titre-court';
    court.textContent = (titre.querySelector('h1') || {}).textContent || '';
    (barre.querySelector('.ou') || barre).append(court);
    const centre = document.createElement('div'); centre.className = 'centre';
    centre.append(chap); if (liste) centre.append(liste);
    barre.insertBefore(centre, barre.querySelector('.droite'));
    // le titre de chaque étape passe en infobulle (le texte du bouton est masqué dans la barre)
    chap.querySelectorAll('.seg').forEach(s => { if (!s.title) s.title = s.textContent.trim(); });
    const infos = document.createElement('button'); infos.type = 'button'; infos.className = 'bascule-theme infos';
    infos.setAttribute('aria-expanded', 'false'); infos.title = 'Titre, signature et aide (I)'; infos.textContent = 'Infos';
    const tiroir = document.createElement('div'); tiroir.className = 'tiroir'; tiroir.id = 'tiroir';
    tiroir.append(titre); if (modes) tiroir.append(modes); barre.after(tiroir); infos.setAttribute('aria-controls', 'tiroir');
    const droite = barre.querySelector('.droite') || barre; droite.prepend(infos);
    const bascule = ouvrir => {
      const o = ouvrir === undefined ? !document.body.classList.contains('coque-ouverte') : ouvrir;
      document.body.classList.toggle('coque-ouverte', o); infos.setAttribute('aria-expanded', o);
      requestAnimationFrame(() => { ajuste(); dispatchEvent(new Event('resize')); });
    };
    infos.addEventListener('click', () => bascule());
    addEventListener('keydown', e => {
      if (e.target.closest('input,textarea,select') || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'i' || e.key === 'I') bascule();
    });
    echap.push(() => bascule(false));
  }
  addEventListener('resize', ajuste); abonnes.push(() => requestAnimationFrame(ajuste)); ajuste();
  if (document.fonts) document.fonts.ready.then(ajuste);
}

const Q = new URLSearchParams(location.search);
const EMBED = Q.has('embed');
const m0 = Q.get('mode');
// intégrée, une planche montre ses réglages d'emblée : Observer les cacherait
mode(onglets.some(b => b.dataset.m === m0) ? m0 : EMBED && onglets.some(b => b.dataset.m === 'manipuler') ? 'manipuler' : (document.body.dataset.mode || 'observer'));

/* Ouvrir une étape précise : ?etape=01.3 (code affiché dans la barre) ou ?etape=3 (rang, 1 = première).
   Une page qui code ses étapes « 1 2 3 » accepte aussi « NN.k » si NN est son data-module.
   ?scene=2 ouvre la seconde scène d'une étape qui en regroupe deux, si la page expose window.allerScene. */
function etapeDemandee(v){
  const segs = [...document.querySelectorAll('#stepper .seg')];
  const code = s => ((s.querySelector('b') || {}).textContent || '').trim();
  let s = segs.find(x => code(x) === v);
  if (!s && /^\d+$/.test(v)) s = segs[+v - 1];
  const m = !s && /^(\d+)\.(\d+)$/.exec(v);
  if (m && +m[1] === +document.body.dataset.module) s = segs[+m[2] - 1];
  return s;
}
function ouvreEtape(){
  const e0 = Q.get('etape'), seg0 = e0 && etapeDemandee(e0);
  if (!seg0) return;
  if (Q.get('scene') === '2' && seg0.dataset.b !== undefined && window.allerScene) window.allerScene(+seg0.dataset.b);
  else if (seg0.getAttribute('aria-current') !== 'step') seg0.click();
}
// après le chargement : certaines pages ouvrent leur première étape au « load », ce qui écraserait le choix
if (Q.has('etape')){
  if (document.readyState === 'complete') ouvreEtape();
  else addEventListener('load', () => setTimeout(ouvreEtape, 0));
}

/* Mode intégré : ?embed. La scène et ses contrôles seuls, pour une iframe (explications, cours).
   ?panneau=1 garde le panneau de lecture ; ?controles=0 retire la barre de contrôles.
   Les touches qui changent d'étape ou de couche sont neutralisées : l'étape choisie reste celle de l'auteur.
   La molette ne va à la scène qu'après un clic dedans ; sinon elle fait défiler la page qui l'accueille.
   Styles : planche-etapes.css (html.labo-embed). */
if (EMBED){
  const html = document.documentElement;
  html.classList.add('labo-embed');
  html.classList.toggle('embed-panneau', Q.get('panneau') === '1');
  html.classList.toggle('embed-sans-controles', Q.get('controles') === '0');
  // retour vers la planche complète, à la même étape
  const plein = new URL(location.href);
  ['embed', 'panneau', 'controles', 'mode'].forEach(k => plein.searchParams.delete(k));
  const a = document.createElement('a');
  a.className = 'embed-ouvrir'; a.href = plein.href; a.target = '_top';
  a.textContent = 'Ouvrir la planche ↗';
  document.body.append(a);
  const avis = document.createElement('p'); avis.className = 'embed-avis'; avis.setAttribute('aria-live', 'polite');
  document.body.append(avis);
  const bloque = new Set(['i', 'f', ...TOUCHES]);
  addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select')) return;
    if (/^[0-9]$/.test(e.key) || bloque.has(e.key.toLowerCase())) e.stopImmediatePropagation();
  }, true);
  let actif = false, tAvis = 0;
  addEventListener('pointerdown', () => { actif = true; }, true);
  html.addEventListener('mouseleave', () => { actif = false; });
  addEventListener('wheel', e => {
    if (actif || !e.target.closest('.scene, #stage, canvas')) return;
    e.stopImmediatePropagation();   // la page parente défile ; la scène n'a rien reçu
    avis.textContent = 'Clique dans la scène pour utiliser la molette';
    avis.classList.add('on'); clearTimeout(tAvis); tAvis = setTimeout(() => avis.classList.remove('on'), 1600);
  }, { capture: true, passive: true });
}

window.Planche = {
  mode,
  actif: () => document.body.dataset.mode !== 'observer',
  surMode: f => abonnes.push(f),
  surEchap: f => echap.push(f),
};
})();
