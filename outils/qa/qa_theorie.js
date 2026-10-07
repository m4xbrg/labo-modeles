// QA d'une page de théorie : KaTeX rendu, aucune erreur, LaTeX brut résiduel, captures.
const { chromium } = require('playwright-core');
const OUT = require('path').join(__dirname, 'captures') + '/';
const BASE = process.env.LABO_URL || 'http://localhost:4350/';   // racine du dépôt servie en HTTP
const CANAL = process.env.LABO_NAVIGATEUR || 'msedge';            // msedge ou chrome (navigateur installé)
const pages = (process.argv[2] || 'fondations-oscillations-ondes').split(',');
(async () => {
  const b = await chromium.launch({ channel: CANAL });
  for (const nom of pages){
    for (const [w, h] of [[1440, 900], [375, 812]]){
      const p = await b.newPage({ viewport: { width: w, height: h } });
      const err = [];
      p.on('console', m => { if (['error', 'warning'].includes(m.type())) err.push(m.text()); });
      p.on('pageerror', e => err.push(e.message));
      await p.goto(`${BASE}opus-sonnet/${nom}/explication.html`);
      await p.waitForFunction(() => document.documentElement.classList.contains('katex-pret'), null, { timeout: 15000 }).catch(() => err.push('KaTeX jamais prêt'));
      const r = await p.evaluate(() => {
        const brut = [...document.querySelectorAll('.module')].map(m => m.innerText).join('\n').match(/\\\(|\\\[|\\frac|\\omega/g) || [];
        return { modules: [...document.querySelectorAll('.module')].map(m => m.id), katex: document.querySelectorAll('.katex').length,
          erreurs: [...document.querySelectorAll('.katex-error')].map(e => e.title || e.textContent).slice(0, 5),
          brut: brut.length, debord: document.documentElement.scrollWidth - innerWidth,
          mots: document.querySelector('.wrap').innerText.split(/\s+/).length,
          sections: [...document.querySelectorAll('.module')].map(m => [m.id, m.querySelectorAll('h4').length, m.innerText.split(/\s+/).length]) };
      });
      console.log(nom, w, JSON.stringify(r), err.length ? 'CONSOLE: ' + err.join(' | ') : '');
      if (w === 1440){
        const el = await p.$('.module'); if (el) await el.screenshot({ path: `${OUT}theorie-${nom}-module1.png` });
      } else await p.screenshot({ path: `${OUT}theorie-${nom}-mobile.png`, fullPage: false });
      await p.close();
    }
  }
  await b.close();
})();
