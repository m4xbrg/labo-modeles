// QA générique des planches migrées : chaque étape cliquée, console, débordement, hauteur, couches, captures.
const { chromium } = require('playwright-core');
const OUT = require('path').join(__dirname, 'captures') + '/';
const BASE = process.env.LABO_URL || 'http://localhost:4350/';   // racine du dépôt servie en HTTP
const CANAL = process.env.LABO_NAVIGATEUR || 'msedge';            // msedge ou chrome (navigateur installé)
require('fs').mkdirSync(OUT, { recursive: true });
const pages = process.argv[2].split(',');
const captures = process.argv[3] !== 'sans-captures';
(async () => {
  const b = await chromium.launch(process.env.LABO_EXECUTABLE ? { executablePath: process.env.LABO_EXECUTABLE, args: ['--no-sandbox'] } : { channel: CANAL });
  for (const page of pages){
    const res = { page, erreurs: [] };
    for (const [nom, w, h, sch] of [['laptop', 1366, 768, 'light'], ['mobile', 375, 812, 'dark']]){
      const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: sch });
      const p = await ctx.newPage();
      p.on('console', m => { if (['error', 'warning'].includes(m.type()) && !/favicon|status of 404/.test(m.text())) res.erreurs.push(`${nom}: ${m.text().slice(0, 160)}`); });
      p.on('pageerror', e => res.erreurs.push(`${nom} pageerror: ${e.message.slice(0, 160)}`));
      p.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) res.erreurs.push(`${nom} HTTP ${r.status()} ${r.url()}`); });
      await p.goto(`${BASE}opus-sonnet/${page}/index.html`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1500);
      const base = await p.evaluate(() => {
        const q = s => document.querySelector(s);
        const app = q('.app'), ctr = q('.controls');
        return { coque: !!(q('header.barre') && q('.titre h1') && q('dl.sig') && q('nav.chapitres') && q('.modes [role=tab]')),
          classe: document.body.classList.contains('labo-etapes'), touches: document.body.dataset.touches,
          chapitres: [...document.querySelectorAll('.chap')].map(c => (c.querySelector('.chap-t b')?.textContent || '?') + ':' + c.querySelectorAll('.seg').length),
          debord: document.documentElement.scrollWidth - innerWidth,
          appBas: app ? Math.round(app.getBoundingClientRect().bottom) : null, controlesBas: ctr ? Math.round(ctr.getBoundingClientRect().bottom) : null, vh: innerHeight,
          ancienTitre: !!q('.scene .head, .scene header'), planchejs: !!window.Planche };
      });
      res[nom] = base;
      if (captures && nom === 'laptop') await p.screenshot({ animations: 'disabled', path: `${OUT}vague-${page}-observer.png` });
      await p.keyboard.press(base.touches[1]); await p.waitForTimeout(250);
      const segs = await p.$$('.chap .seg');
      res[nom].etapes = [];
      res[nom].mesuresEtapes = [];
      for (let i = 0; i < segs.length; i++){
        await segs[i].click();
        // Attendre la fin du trajet vers l’étape avant de mesurer son marquage.
        await p.waitForFunction(n => document.querySelectorAll('.chap .seg')[n]?.getAttribute('aria-current') === 'step', i, { timeout: 10000 });
        await p.waitForTimeout(700);
        if (page === '03-neurone') {
          // La caméra suit l'impulsion avant d'entrer dans la synapse.
          await p.waitForFunction(n => window.__neurone.mode === (n === 0 ? 'a1' : 'a2'), i, { timeout: 30000 });
          if (/Pause/.test(await p.getAttribute('#bPlay', 'aria-label'))) await p.click('#bPlay');
          await p.waitForTimeout(600);
        }
        const r = await p.evaluate(() => ({ cur: [...document.querySelectorAll('.chap .seg[aria-current]')].map(x => x.querySelector('b')?.textContent).join(','),
          eye: (document.querySelector('#eyebrow, .eyebrow, .etape, .step.mono, #kick')?.textContent || '').trim().slice(0, 40), lien: document.querySelector('a[href^="explication.html"]')?.getAttribute('href') || '' }));
        res[nom].mesuresEtapes.push(await p.evaluate(() => ({
          debord: document.documentElement.scrollWidth - innerWidth,
          controlesBas: Math.round(document.querySelector('.controls').getBoundingClientRect().bottom),
          sceneHauteur: Math.round(document.querySelector('.scene').getBoundingClientRect().height),
          mode: document.body.dataset.mode
        })));
        res[nom].etapes.push(`${i}→${r.cur}|${r.eye}|${r.lien}`);
        if (captures && nom === 'laptop') await p.screenshot({ animations: 'disabled', path: `${OUT}vague-${page}-e${i}.png` });
      }
      await p.keyboard.press(base.touches[2]); await p.waitForTimeout(250);
      res[nom].comprendre = await p.evaluate(() => document.body.dataset.mode);
      res[nom].interactif = await p.evaluate(() => {
        const ctr = document.querySelector('.controls'), app = document.querySelector('.app');
        return { debord: document.documentElement.scrollWidth - innerWidth,
          appBas: Math.round(app.getBoundingClientRect().bottom),
          controlesBas: Math.round(ctr.getBoundingClientRect().bottom),
          lien: document.querySelector('a[href^="explication.html"]')?.getAttribute('href'),
          mode: document.body.dataset.mode };
      });
      if (captures && nom === 'mobile') await p.screenshot({ animations: 'disabled', path: `${OUT}vague-${page}-mobile.png`, fullPage: true });
      await ctx.close();
    }
    console.log(JSON.stringify(res));
  }
  await b.close();
})();
