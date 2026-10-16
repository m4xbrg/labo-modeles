// Conformité au gabarit standard de LABO (corpus/standards.md §4, labo/GABARIT.md).
// Lecture statique des fichiers, sans navigateur ni dépendance : complète qa_migrees.js et qa_theorie.js,
// qui mesurent le rendu. Depuis la racine du dépôt ou depuis outils/qa/ :
//
//   node outils/qa/conformite.mjs                      tableau de toutes les pages, erreurs des pages au standard
//   node outils/qa/conformite.mjs fondations-langage   seulement ces dossiers (séparés par des virgules)
//   node outils/qa/conformite.mjs --markdown           tableau Markdown, à recopier dans corpus/standards.md §4
//   node outils/qa/conformite.mjs --strict <dossier>   une page encore à l'ancien format compte comme un échec
//                                                      (à utiliser pour une page neuve ou qu'on vient de migrer)
//
// Code de sortie : 1 si une page déclarée au standard (body.labo-fiche, body.cours) enfreint une règle,
// ou, avec --strict, si une page demandée n'est pas au standard. Les avertissements ne font pas échouer.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PLANCHES = path.join(RACINE, 'opus-sonnet');
const args = process.argv.slice(2);
const md = args.includes('--markdown'), strict = args.includes('--strict');
const filtre = args.filter(a => !a.startsWith('--')).flatMap(a => a.split(',')).filter(Boolean);

const lire = f => (existsSync(f) ? readFileSync(f, 'utf8') : null);
const ouvre = (html, re) => { const m = html.match(re); return m ? m[0] : ''; };
const pos = (s, aiguille) => { const i = s.indexOf(aiguille); return i < 0 ? Infinity : i; };
const derniere = (s, aiguille) => s.lastIndexOf(aiguille);
const MODULES_SEPT = ['intuition', 'defs', 'relations', 'exemple', 'pieges', 'suite', 'test'];

/* ---------- Planche (index.html) ---------- */
function planche(dossier, html, showcase) {
  const err = [], avert = [];
  const body = ouvre(html, /<body[^>]*>/);
  const tete = html.slice(0, pos(html, '</head>'));
  const format = /class="[^"]*\blabo-fiche\b/.test(body) ? 'fiche'
    : /class="[^"]*\blabo-etapes\b/.test(body) ? 'couches' : 'autre';
  const codes = [...html.matchAll(/<button class="seg[^"]*"[^>]*>\s*<b>([^<]+)<\/b>/g)].map(m => m[1].trim());
  if (format !== 'fiche') return { format, err, avert, codes };

  // <head> : labo.css avant le <style> de la page, planche-etapes.css puis fiche.css après, theme.js
  const iLabo = pos(tete, 'labo/labo.css'), iStyle = pos(tete, '<style'), iFinStyle = derniere(tete, '</style>');
  const iEtapes = pos(tete, 'labo/planche-etapes.css'), iFiche = pos(tete, 'labo/fiche.css');
  if (iLabo === Infinity) err.push('labo.css absent du <head>');
  else if (iStyle !== Infinity && iLabo > iStyle) err.push('labo.css doit précéder le <style> de la page');
  if (iEtapes === Infinity) err.push('planche-etapes.css absent du <head>');
  else if (iFinStyle >= 0 && iEtapes < iFinStyle) err.push('planche-etapes.css doit suivre le <style> de la page');
  if (iFiche === Infinity) err.push('fiche.css absent du <head>');
  else if (iFiche < iEtapes) err.push('fiche.css doit suivre planche-etapes.css');
  if (!tete.includes('labo/theme.js')) err.push('theme.js absent du <head>');
  if (!/katex(\.min)?\.js/.test(html)) err.push('KaTeX non chargé (relations des fiches)');
  if (!/<meta name="robots" content="noindex">/.test(tete)) err.push('meta robots noindex manquante');
  if (!/<title>[^<]+ — LABO<\/title>/.test(tete)) err.push('titre d’onglet attendu : « Titre — LABO »');

  // <body> et coque
  if (!/class="[^"]*\blabo-etapes\b/.test(body)) err.push('body sans la classe labo-etapes');
  if (!/data-mode="fiche"/.test(body)) err.push('body sans data-mode="fiche"');
  if (/data-touches=/.test(body)) err.push('data-touches est réservé aux couches : le retirer');
  if (/<div class="modes\b/.test(html)) err.push('div.modes (onglets de couches) à retirer');
  if (!/<header class="barre/.test(html)) err.push('header.barre manquant');
  if (!/<div class="titre/.test(html) || !/<h1/.test(html)) err.push('div.titre avec h1 manquant');
  if (!/<dl class="sig"/.test(html)) err.push('signature dl.sig (Échelle · Temps · Modèle) manquante');
  else for (const t of ['Échelle', 'Temps', 'Modèle']) if (!new RegExp(`<dt>${t}</dt>`).test(html)) err.push(`signature : <dt>${t}</dt> manquant`);
  if (!/<nav class="chapitres"[^>]*id="stepper"|<nav[^>]*id="stepper"[^>]*class="chapitres"/.test(html)) err.push('nav.chapitres#stepper manquant');
  if (!/<aside class="panel/.test(html)) err.push('aside.panel manquant');
  const retour = showcase ? '← Phénomènes' : '← Fondations';
  if (!html.includes(retour)) err.push(`lien de retour « ${retour} » manquant`);

  // scripts : fiche.js, puis Fiche.init, puis planche.js en dernier
  const iFjs = pos(html, 'labo/fiche.js'), iInit = pos(html, 'Fiche.init('), iPjs = pos(html, 'labo/planche.js');
  if (iFjs === Infinity) err.push('labo/fiche.js non chargé');
  if (iInit === Infinity) err.push('Fiche.init(…) absent');
  else if (iFjs > iInit) err.push('labo/fiche.js doit être chargé avant Fiche.init');
  if (iPjs === Infinity) err.push('labo/planche.js non chargé');
  else if (derniere(html, '<script') > iPjs) err.push('labo/planche.js doit être le dernier script');
  if (!html.includes('Fiche.montre(')) err.push('Fiche.montre(n) jamais appelé (navigation non branchée)');
  if (!/window\.allerScene\s*=/.test(html)) err.push('window.allerScene non exposé');

  // chapitres : 2 à 4 étapes par chapitre pour une fondation, codes NN.k
  const nav = ouvre(html, /<nav[^>]*id="stepper"[\s\S]*?<\/nav>/);
  const chaps = nav.split(/<div class="chap[\s"]/).slice(1).map(c => (c.match(/<button class="seg/g) || []).length);
  if (!codes.length) err.push('aucune étape (button.seg) dans la barre');
  if (!showcase) {
    chaps.forEach((n, i) => { if (n < 2 || n > 4) err.push(`chapitre ${i + 1} : ${n} étapes (2 à 4 attendues)`); });
    const mauvais = codes.filter(c => !/^\d\d\.\d$/.test(c));
    if (mauvais.length) err.push(`codes d’étape attendus NN.k : ${mauvais.join(', ')}`);
  }
  if (/\bcouche-(lire|comp)\b/.test(html)) avert.push('classes couche-lire / couche-comp encore présentes (sans effet en fiche, à nettoyer)');
  return { format, err, avert, codes };
}

/* ---------- Explication (explication.html) ---------- */
function explication(dossier, html, showcase, codes) {
  const err = [], avert = [];
  const body = ouvre(html, /<body[^>]*>/), tete = html.slice(0, pos(html, '</head>'));
  const format = /class="[^"]*\bcours\b/.test(body) && tete.includes('labo/cours.css') ? 'cours' : 'ancien';
  const mods = [...html.matchAll(/<section class="module" id="m(\d\d)"/g)].map(m => m[1]);
  if (format !== 'cours') return { format, err, avert, mods };

  if (pos(tete, 'labo/labo.css') > pos(tete, 'labo/cours.css')) err.push('labo.css doit précéder cours.css');
  if (!tete.includes('labo/theme.js')) err.push('theme.js absent du <head>');
  if (!/labo\/theorie\.js"\s+defer/.test(tete)) err.push('labo/theorie.js (KaTeX) absent ou sans defer');
  if (!/labo\/cours\.js"\s+defer/.test(tete)) err.push('labo/cours.js absent ou sans defer');
  if (tete.includes('labo/theorie.css')) err.push('theorie.css est l’ancien format : le retirer');
  if (/<style[\s>]/.test(tete)) avert.push('<style> propre à la page : vérifier qu’il ne redéfinit pas la mise en page du cours');
  if (!/<meta name="robots" content="noindex">/.test(tete)) err.push('meta robots noindex manquante');
  if (!/<title>[^<]+ — LABO<\/title>/.test(tete)) err.push('titre d’onglet attendu : « … — LABO »');
  if (!/<header class="cours-barre"/.test(html)) err.push('header.cours-barre manquant');
  if (!/<nav class="cours-sommaire"/.test(html)) err.push('nav.cours-sommaire manquant');
  if (!/<main class="cours-texte"/.test(html)) err.push('main.cours-texte manquant');
  const sur = (html.match(/<p class="surtitre">([^<]*)<\/p>/) || [])[1];
  if (!sur) err.push('surtitre p.surtitre manquant');
  else if (showcase ? !/^LABO · (L’invisible en mouvement|Phénomènes)/.test(sur) : !/^LABO · Fondations \d\d( · \d\d)*$/.test(sur))
    err.push(`surtitre non conforme à standards §1 : « ${sur} »`);

  // ids uniques, liens internes résolus
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const doublons = [...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))];
  if (doublons.length) err.push(`ids en double : ${doublons.join(', ')}`);
  const morts = [...new Set([...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]).filter(x => !ids.includes(x)))];
  if (morts.length) err.push(`liens internes sans cible : ${morts.map(x => '#' + x).join(', ')}`);

  // scènes intégrées : ?embed et étape existante sur la planche
  const blocs = [...html.matchAll(/<figure class="labo[^"]*" data-src="([^"]+)"[\s\S]*?<\/figure>/g)];
  const figs = blocs.map(m => m[1].replace(/&amp;/g, '&'));
  for (const m of blocs) if (!/<a class="ouvrir" href="index\.html[^"]*"/.test(m[0]))
    err.push(`scène intégrée sans lien statique a.ouvrir (repli sans script) : ${m[1].replace(/&amp;/g, '&')}`);
  for (const src of figs) {
    if (!/[?&]embed\b/.test(src)) err.push(`scène intégrée sans ?embed : ${src}`);
    const e = (src.match(/[?&]etape=([^&]+)/) || [])[1];
    if (e && codes.length && !codes.includes(e) && !/^\d+$/.test(e)) err.push(`scène intégrée vers une étape inconnue : ${e}`);
  }
  for (const m of html.matchAll(/href="index\.html\?etape=([^"&#]+)/g))
    if (codes.length && !codes.includes(m[1]) && !/^\d+$/.test(m[1])) err.push(`lien vers une étape inconnue : ?etape=${m[1]}`);

  // fondations : sept rubriques par module, composants du cours
  if (!showcase) {
    if (!mods.length) err.push('aucune section.module#mNN');
    const decoupe = html.split(/<section class="module" id="m\d\d"/).slice(1);
    mods.forEach((n, i) => {
      const s = decoupe[i] || '';
      const manque = MODULES_SEPT.filter(r => !s.includes(`id="m${n}-${r}"`));
      if (manque.length) err.push(`module ${n} : rubriques sans id ${manque.map(r => `m${n}-${r}`).join(', ')}`);
      const nb = re => (s.match(re) || []).length;
      const scenes = nb(/<figure class="labo/g), calc = nb(/<div class="calc/g), quiz = nb(/<div class="quiz/g);
      if (!/<ol class="pas-a-pas/.test(s)) err.push(`module ${n} : exemple chiffré sans ol.pas-a-pas`);
      const test = s.slice(pos(s, `id="m${n}-test"`));
      const qt = (test.match(/<div class="quiz/g) || []).length;
      if (qt !== 3) err.push(`module ${n} : Teste-toi a ${qt} quiz (3 attendus)`);
      if (scenes < 2) avert.push(`module ${n} : ${scenes} scène(s) intégrée(s) (2 visées)`);
      if (calc < 2) avert.push(`module ${n} : ${calc} calcul(s) vivant(s) (2 ou 3 visés)`);
      if (quiz - qt < 1) avert.push(`module ${n} : aucune question dans les relations`);
      if (!/<p class="etapes"/.test(s)) avert.push(`module ${n} : en-tête sans p.etapes vers la planche`);
    });
  }
  return { format, err, avert, mods };
}

/* ---------- Parcours ---------- */
const dossiers = readdirSync(PLANCHES, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)
  .filter(d => existsSync(path.join(PLANCHES, d, 'index.html')))
  .filter(d => !filtre.length || filtre.includes(d)).sort();
const inconnus = filtre.filter(f => !dossiers.includes(f));
if (inconnus.length) { console.error(`Dossiers introuvables dans opus-sonnet/ : ${inconnus.join(', ')}`); process.exit(2); }

let echec = false;
const lignes = [];
for (const d of dossiers) {
  const showcase = /^\d\d-/.test(d);
  const P = planche(d, lire(path.join(PLANCHES, d, 'index.html')), showcase);
  const htmlE = lire(path.join(PLANCHES, d, 'explication.html'));
  const E = htmlE ? explication(d, htmlE, showcase, P.codes) : { format: 'absente', err: [], avert: [], mods: [] };
  const titre = (lire(path.join(PLANCHES, d, 'index.html')).match(/<title>([^<—]+)/) || [, d])[1].trim();
  lignes.push({ d, titre, showcase, P, E });
  if (P.err.length || E.err.length) echec = true;
  if (strict && (P.format !== 'fiche' || E.format !== 'cours')) echec = true;
}

const etat = l => l.P.format === 'fiche' && l.E.format === 'cours' ? (l.P.err.length || l.E.err.length ? 'Au standard, avec erreurs' : 'Au standard')
  : l.P.format === 'fiche' || l.E.format === 'cours' ? 'Migration partielle' : 'À migrer';
const nomP = { fiche: 'Fiche d’étape', couches: 'Couches O/M/C', autre: 'Autre' };
const nomE = { cours: 'Cours interactif', ancien: 'Ancien format', absente: '—' };

if (md) {
  console.log('| Page | Dossier | Planche | Explication | État |\n|---|---|---|---|---|');
  for (const l of lignes) console.log(`| ${l.titre} | \`${l.d}\` | ${nomP[l.P.format]} | ${nomE[l.E.format]} | ${etat(l)} |`);
  const n = lignes.filter(l => etat(l) === 'Au standard').length;
  console.log(`\n${n} page(s) sur ${lignes.length} au standard.`);
} else {
  const w = Math.max(...lignes.map(l => l.d.length));
  for (const l of lignes) {
    console.log(`${l.d.padEnd(w)}  ${nomP[l.P.format].padEnd(14)} ${nomE[l.E.format].padEnd(16)} ${etat(l)}`);
    for (const e of [...l.P.err.map(x => 'planche : ' + x), ...l.E.err.map(x => 'explication : ' + x)]) console.log(`  ✗ ${e}`);
    for (const a of [...l.P.avert.map(x => 'planche : ' + x), ...l.E.avert.map(x => 'explication : ' + x)]) console.log(`  · ${a}`);
    if (strict && etat(l) !== 'Au standard' && !l.P.err.length && !l.E.err.length) console.log('  ✗ --strict : page pas encore au gabarit standard');
  }
  const n = lignes.filter(l => etat(l) === 'Au standard').length;
  console.log(`\n${n} / ${lignes.length} au standard (planche à fiche d’étape et explication en cours interactif, sans erreur).`);
}
process.exit(echec ? 1 : 0);
