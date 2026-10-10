#!/usr/bin/env node
// lots.mjs — délégation de lots à un exécutant externe (ChatGPT, Codex). Zéro dépendance.
//
//   node docs/lots/lots.mjs liste
//   node docs/lots/lots.mjs prompt <lot> [--stdout]      assemble le prompt et le copie dans le presse-papiers
//   node docs/lots/lots.mjs recevoir <lot> <zip|dossier> [--appliquer] [--ecraser]
//
// Un lot est un fichier `<lot>.md` à côté de ce script. Ses directives, en tête de fichier :
//   @titre:    nom court
//   @contrat:  chemin relatif à la racine du projet, collé en tête du prompt (plusieurs permis)
//   @inclure:  fichier recopié dans le prompt en bloc de code (les signatures réelles, jamais une description)
//   @brut:     fichier recopié tel quel à la fin (un brief existant)
//   @joindre:  fichier à joindre à la main dans la conversation (affiché, jamais recopié)
//   @ecrit:    glob des seuls chemins que la livraison a le droit de contenir (plusieurs permis)
//   @verifier: commande lancée à la racine après --appliquer (plusieurs permis)
//   @exige:    fichier requis à la racine pour que les vérifications aient un sens (ex. package.json) ;
//              s'il manque, --appliquer copie les fichiers et DIFFÈRE les vérifications
// La racine du projet est deux dossiers au-dessus de ce script.

import { execFileSync, spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ICI = path.dirname(fileURLToPath(import.meta.url))
const RACINE = path.resolve(ICI, '..', '..')
const [, , commande, ...reste] = process.argv
const drapeaux = new Set(reste.filter((a) => a.startsWith('--')))
const args = reste.filter((a) => !a.startsWith('--'))

const sortir = (message) => { console.error(message); process.exit(1) }

function lireLot(nom) {
  const fichier = path.join(ICI, `${nom}.md`)
  if (!existsSync(fichier)) sortir(`Lot introuvable : ${path.relative(RACINE, fichier)}`)
  const directives = {}
  const corps = []
  for (const ligne of readFileSync(fichier, 'utf8').split(/\r?\n/)) {
    const m = ligne.match(/^@([a-z]+):\s*(.*)$/)
    if (m && corps.every((l) => l.trim() === '')) (directives[m[1]] ??= []).push(m[2].trim())
    else corps.push(ligne)
  }
  return { directives, corps: corps.join('\n').trim() }
}

const lire = (rel) => {
  const fichier = path.join(RACINE, rel)
  if (!existsSync(fichier)) sortir(`Fichier cité par le lot, introuvable : ${rel}`)
  return readFileSync(fichier, 'utf8').replace(/\r\n/g, '\n').trimEnd()
}
const langage = (rel) => ({ '.ts': 'ts', '.tsx': 'tsx', '.js': 'js', '.mjs': 'js', '.json': 'json', '.css': 'css', '.md': 'md', '.html': 'html' })[path.extname(rel)] ?? ''

function assembler(nom) {
  const { directives: d, corps } = lireLot(nom)
  const parties = []
  for (const c of d.contrat ?? []) parties.push(lire(c))
  parties.push(corps)
  for (const f of d.inclure ?? []) parties.push(`### Fichier fourni : \`${f}\`\n\n\`\`\`${langage(f)}\n${lire(f)}\n\`\`\``)
  for (const f of d.brut ?? []) parties.push(lire(f))
  return { texte: parties.join('\n\n---\n\n'), joindre: d.joindre ?? [], titre: d.titre?.[0] ?? nom }
}

function copierPressePapiers(texte) {
  const tmp = path.join(os.tmpdir(), `lot-${process.pid}.txt`)
  writeFileSync(tmp, texte, 'utf8')
  const r = spawnSync('powershell', ['-NoProfile', '-Command', `Get-Content -Raw -Encoding UTF8 '${tmp}' | Set-Clipboard`], { encoding: 'utf8' })
  return r.status === 0
}

function motif(glob) {
  const re = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*\//g, '\u0001').replace(/\*\*/g, '\u0002').replace(/\*/g, '[^/]*').replace(/\u0001/g, '(?:.*/)?').replace(/\u0002/g, '.*')
  return new RegExp(`^${re}$`)
}

function parcourir(dossier, base = dossier) {
  return readdirSync(dossier, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dossier, e.name)
    return e.isDirectory() ? parcourir(p, base) : [path.relative(base, p).split(path.sep).join('/')]
  })
}

if (commande === 'liste') {
  for (const f of readdirSync(ICI).filter((n) => n.startsWith('lot-') && n.endsWith('.md')).sort()) {
    const { directives: d } = lireLot(f.slice(0, -3))
    console.log(`${f.slice(0, -3).padEnd(34)} ${d.titre?.[0] ?? ''}`)
  }
} else if (commande === 'prompt' && args[0]) {
  const { texte, joindre, titre } = assembler(args[0])
  if (drapeaux.has('--stdout')) { process.stdout.write(texte + '\n'); process.exit(0) }
  const ok = copierPressePapiers(texte)
  console.log(`${titre}\n${texte.split(/\s+/).length} mots, ${(Buffer.byteLength(texte) / 1024).toFixed(1)} Ko — ${ok ? 'copié dans le presse-papiers' : 'COPIE ÉCHOUÉE (relancer avec --stdout)'}`)
  if (joindre.length) {
    const dossier = path.join(os.tmpdir(), `a-joindre-${args[0]}`)
    mkdirSync(dossier, { recursive: true })
    for (const j of joindre) copyFileSync(path.join(RACINE, j), path.join(dossier, path.basename(j)))
    console.log(`À joindre à la conversation (dossier ouvert, glisser-déposer) :\n${joindre.map((j) => `  ${path.basename(j)}`).join('\n')}`)
    spawnSync('explorer.exe', [dossier])
  }
} else if (commande === 'recevoir' && args[0]) {
  const { directives: d } = lireLot(args[0])
  const autorises = (d.ecrit ?? []).map(motif)
  if (!autorises.length) sortir(`Le lot ${args[0]} n'a pas de directive @ecrit : refus par prudence.`)
  let source
  if (args[1]) source = path.resolve(args[1])
  else {
    // Sans chemin : le .zip le plus récent du dossier Téléchargements.
    const dl = path.join(os.homedir(), 'Downloads')
    const zips = readdirSync(dl).filter((n) => n.toLowerCase().endsWith('.zip')).map((n) => ({ n, t: statSync(path.join(dl, n)).mtimeMs })).sort((x, y) => y.t - x.t)
    if (!zips.length) sortir(`Aucun .zip dans ${dl}`)
    source = path.join(dl, zips[0].n)
    console.log(`Zip le plus récent : ${zips[0].n} (${Math.round((Date.now() - zips[0].t) / 60000)} min)`)
  }
  if (!existsSync(source)) sortir(`Introuvable : ${source}`)
  if (statSync(source).isFile()) {
    const tmp = mkdtempSync(path.join(os.tmpdir(), `livraison-${args[0]}-`))
    const r = spawnSync('tar', ['-xf', source, '-C', tmp], { encoding: 'utf8' })
    if (r.status !== 0) sortir(`Extraction impossible : ${r.stderr}`)
    source = tmp
  }
  const tous = parcourir(source)
  const manifeste = tous.find((f) => /(^|\/)LIVRAISON\.md$/.test(f))
  const base = manifeste ? path.join(source, path.dirname(manifeste)) : source
  const fichiers = parcourir(base).filter((f) => f !== 'LIVRAISON.md')
  const problemes = []
  if (!manifeste) problemes.push('LIVRAISON.md absent (hypothèses et requêtes manquantes non déclarées)')
  for (const f of fichiers) {
    if (f.split('/').includes('..')) problemes.push(`chemin suspect : ${f}`)
    else if (!autorises.some((re) => re.test(f))) problemes.push(`hors périmètre : ${f}`)
    if (/(^|\/)(package(-lock)?\.json|\.env.*)$/.test(f)) problemes.push(`fichier interdit : ${f}`)
    if (/ \(\d+\)\.|[-_.]v\d+\.|\.(copie|old|bak)$/i.test(f)) problemes.push(`doublon probable : ${f}`)
    if (existsSync(path.join(RACINE, f)) && !drapeaux.has('--ecraser')) problemes.push(`écraserait un fichier existant : ${f}`)
  }
  console.log(`Livraison ${args[0]} : ${fichiers.length} fichier(s)\n${fichiers.map((f) => `  ${f}`).join('\n')}`)
  if (problemes.length) { console.log(`\nREFUSÉE — ${problemes.length} problème(s) :\n${problemes.map((p) => `  - ${p}`).join('\n')}`); process.exit(2) }
  if (!drapeaux.has('--appliquer')) { console.log('\nConforme. Relancer avec --appliquer pour copier dans le projet et lancer les vérifications.'); process.exit(0) }
  for (const f of fichiers) { mkdirSync(path.dirname(path.join(RACINE, f)), { recursive: true }); copyFileSync(path.join(base, f), path.join(RACINE, f)) }
  console.log('\nCopiés.')
  const manquants = (d.exige ?? []).filter((f) => !existsSync(path.join(RACINE, f)))
  if (manquants.length) {
    console.log(`Vérifications DIFFÉRÉES : il manque ${manquants.join(', ')} à la racine du projet (le socle n'est pas construit).`)
    console.log('À relancer à la main quand il existera :\n' + (d.verifier ?? []).map((c) => `  ${c}`).join('\n'))
    process.exit(0)
  }
  console.log('Vérifications :')
  let echec = false
  for (const cmd of d.verifier ?? []) {
    const r = spawnSync(cmd, { cwd: RACINE, shell: true, encoding: 'utf8' })
    const sortie = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim().split('\n')
    console.log(`\n$ ${cmd}  →  ${r.status === 0 ? 'OK' : `ÉCHEC (${r.status})`}`)
    console.log(sortie.slice(-12).join('\n'))
    if (r.status !== 0) echec = true
  }
  console.log(echec ? '\nRÉSULTAT : ÉCHEC — lire la sortie ci-dessus, ne pas relire le code avant.' : '\nRÉSULTAT : vérifications au vert. Relire LIVRAISON.md (hypothèses) puis le diff.')
  process.exit(echec ? 3 : 0)
} else {
  console.log('Usage : lots.mjs liste | prompt <lot> [--stdout] | recevoir <lot> <zip|dossier> [--appliquer] [--ecraser]')
}
