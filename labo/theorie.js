/* LABO — rendu LaTeX des pages de théorie (KaTeX, cdnjs).
   Dans le HTML : \( … \) en ligne, \[ … \] en bloc. Le texte reste lisible si KaTeX
   ne charge pas (hors ligne) : on voit alors le LaTeX brut, jamais une page vide. */
(() => {
'use strict';
const V = '0.16.11', CDN = `https://cdnjs.cloudflare.com/ajax/libs/KaTeX/${V}/`;
const css = document.createElement('link');
css.rel = 'stylesheet'; css.href = CDN + 'katex.min.css'; css.crossOrigin = 'anonymous';
document.head.append(css);
const charge = src => new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.crossOrigin = 'anonymous'; s.onload = ok; s.onerror = ko; document.head.append(s); });
charge(CDN + 'katex.min.js')
  .then(() => charge(CDN + 'contrib/auto-render.min.js'))
  .then(() => {
    renderMathInElement(document.body, {
      delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      throwOnError: false, strict: 'ignore',
      macros: { '\\dd': '\\mathrm{d}' },   // différentielle droite : \dd x
    });
    document.documentElement.classList.add('katex-pret');
  })
  .catch(() => console.warn('LABO : KaTeX indisponible, équations laissées en LaTeX brut.'));
})();
