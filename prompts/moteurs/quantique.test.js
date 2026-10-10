// Tests du moteur quantique. Compatible avec le moteur seul ou son bloc HTML.
// node prompts/moteurs/quantique.test.js
// node prompts/moteurs/quantique.test.js opus-sonnet/fondations-quantique/index.html
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const REF = path.join(__dirname, 'quantique.js');
const target = process.argv[2] || REF;
const extract = src => {
  const begin = '/* QM-BEGIN */', end = '/* QM-END */';
  const a = src.indexOf(begin), b = src.indexOf(end);
  return a < 0 || b < a ? null : src.slice(a, b + end.length);
};
const block = extract(fs.readFileSync(target, 'utf8'));
if (!block) { console.error('Marqueurs QM-BEGIN / QM-END absents : ' + target); process.exit(1); }
if (path.resolve(target) !== path.resolve(REF) && extract(fs.readFileSync(REF, 'utf8')) !== block) {
  console.error('ECHEC : le bloc HTML et le moteur quantique.js sont differents.'); process.exit(1);
}
const QM = new Function(block + '\nreturn QM;')();
let pass = 0, fail = 0;
function ok(cond, nom, details = '') {
  if (cond) {pass++; return;}
  fail++; console.error('ECHEC  ' + nom + (details ? ' : ' + details : ''));
}
function near(a, b, tol, nom) { ok(Math.abs(a - b) <= tol * Math.max(1e-300, Math.abs(b)), nom, a + ' vs ' + b); }
function nearAbs(a, b, tol, nom) { ok(Math.abs(a - b) <= tol, nom, a + ' vs ' + b); }
const cfg = {lambda: QM.lambdaElectron(100), d: 1e-6, w: 0.18e-6, L: 0.45, xMin: -3.1e-4, xMax: 3.1e-4};
const step = 2 * (cfg.xMax - cfg.xMin) / 32768;
const sinc = z => z === 0 ? 1 : Math.sin(z) / z;
function integrate(f, a, b, N = 32768) {
  const dx = (b-a)/N; let sum = .5 * (f(a)+f(b));
  for (let i=1;i<N;i++) sum+=f(a+i*dx);
  return sum*dx;
}

// 1. Probabilites de detection dans la fenetre effectivement simulee.
for (const [mode, eta] of [['both',1], ['which',0], ['partial',0.2], ['partial',0.65], ['single',1]]) {
  const a = QM.preparePattern(cfg,mode,eta);
  const aire = integrate(x => a.pdf(x), cfg.xMin, cfg.xMax);
  nearAbs(aire, 1, 1e-6, 'Aire normalisee : '+ mode + '/' + eta);
  nearAbs(a.cumul[a.cumul.length-1],1,1e-13,'CDF terminale : '+mode+'/'+eta);
  ok(a.pdf(0)>0 && a.pdf(cfg.xMax*2)===0, 'Densite positive et nulle hors ecran');
}

// 2. Franges, profil sans chemin, et visibilite partielle.
const delta = cfg.lambda * cfg.L / cfg.d;
near(QM.interfrange(cfg), delta, 0.005,'Interfrange lambda L / d');
const profile = QM.preparePattern(cfg,'both');
let bestX = delta, bestY = -Infinity;
for (let i=850;i<=1150;i++) {
  const x = delta*i/1000;
  const env = sinc(Math.PI*cfg.w*x/(cfg.lambda*cfg.L))**2;
  const y = profile.pdf(x)/env;
  if (y>bestY){bestX=x;bestY=y;}
}
near(bestX,delta,0.005,'Maximum voisin de lambda L/d (0,5 %)');
const sansChemin = QM.preparePattern(cfg,'which');
const x1 = 0.35*delta, x2 = 1.1*delta;
const norm1=sansChemin.pdf(x1)/sinc(Math.PI*cfg.w*x1/(cfg.lambda*cfg.L))**2;
const norm2=sansChemin.pdf(x2)/sinc(Math.PI*cfg.w*x2/(cfg.lambda*cfg.L))**2;
near(norm1,norm2,1e-10,'Which : seulement enveloppe, aucune frange');
for (const eta of [0,0.25,0.6,1]) {
  const p = QM.preparePattern(cfg,'partial',eta);
  const Iplus = p.pdf(0);
  const Iminus = p.pdf(delta/2) / sinc(Math.PI*cfg.w*(delta/2)/(cfg.lambda*cfg.L))**2;
  const vis = (Iplus-Iminus)/(Iplus+Iminus);
  nearAbs(vis,eta,1e-11,'Visibilite partielle eta = '+eta);
}
const [ps1,ps2] = Object.values(QM.twoSlit(cfg, 0));
nearAbs(QM.cabs2(QM.cadd(ps1,ps2)),4,1e-12,'Addition complexe constructive');
nearAbs(QM.cabs2(QM.cadd(...Object.values(QM.twoSlit(cfg,delta/2)))),0,1e-24,'Annulation complexe destructive');
nearAbs(QM.cabs2(QM.cmul(QM.cexp(Math.PI/3),QM.cexp(Math.PI/6))),1,1e-12,'Module du produit de phases');

// 3. Inversion de CDF : 100 000 impacts et regime pauvre en statistiques.
{
  const n=100000, p=QM.preparePattern(cfg,'both');
  const tirages=QM.sampleHits(p,n,QM.mulberry32(2026));
  const bins=24, counts=new Array(bins).fill(0), expected=new Array(bins).fill(0);
  for(const x of tirages) counts[Math.min(bins-1,Math.floor((x-cfg.xMin)/(cfg.xMax-cfg.xMin)*bins))]++;
  for(let j=0;j<bins;j++) expected[j]=n*integrate(x=>p.pdf(x),cfg.xMin+j*(cfg.xMax-cfg.xMin)/bins,cfg.xMin+(j+1)*(cfg.xMax-cfg.xMin)/bins,300);
  let chi=0,nd=0;
  for(let j=0;j<bins;j++) if(expected[j]>=5){chi+=(counts[j]-expected[j])**2/expected[j];nd++;}
  ok(chi/Math.max(1,nd-1)<2.5,'100 000 impacts : chi2/ddl < 2,5', (chi/Math.max(1,nd-1)).toFixed(4));
  ok(tirages.length===n && tirages.every(x=>x>=cfg.xMin && x<=cfg.xMax), 'Inversion CDF : tous les impacts dans la fenetre');
  const petits=QM.sampleHits(p,10,QM.mulberry32(2026));
  const occupied=new Set([...petits].map(x=>Math.floor((x-cfg.xMin)/(cfg.xMax-cfg.xMin)*24))).size;
  ok(occupied<=10 && occupied/24<0.5,'10 impacts : echantillonnage trop clairseme pour des franges ('+occupied+'/24 cases)');
  ok(1/Math.sqrt(10)>5/Math.sqrt(2000), '10 impacts : bruit statistique domine le regime a 2 000 impacts');
}

// 4. De Broglie avec correction relativiste et valeurs de reference.
near(QM.lambdaElectron(100),0.123e-9,0.005,'Electron 100 eV : 0,123 nm');
near(QM.lambdaElectron(50000),5.36e-12,0.005,'Electron 50 keV : 5,36 pm relativistes');
const NR=QM.h/Math.sqrt(2*QM.me*QM.e*50000);
near(NR,5.48e-12,0.005,'Electron 50 keV : 5,48 pm sans correction');
ok(QM.lambdaElectron(50000)<NR,'La correction relativiste reduit lambda');
ok(QM.lambdaDB(QM.me,0) === Infinity,'Vitesse nulle : longueur de Broglie infinie');
near(QM.lambdaDB(QM.me,1e5),QM.h/(QM.me*1e5),1e-7,'Vitesse faible : limite non relativiste');

// 5. Mach-Zehnder : phases, bras bloque et information de chemin.
for (const phi of [0,0.1,Math.PI/2,Math.PI,1.6*Math.PI,2*Math.PI]) {
  const p=QM.mz({phi});
  nearAbs(p.d1,Math.cos(phi/2)**2,1e-12,'Mach-Zehnder D1 pour phi='+phi.toFixed(2));
  nearAbs(p.d2,Math.sin(phi/2)**2,1e-12,'Mach-Zehnder D2 pour phi='+phi.toFixed(2));
  nearAbs(p.d1+p.d2+p.absorbed,1,1e-12,'Mach-Zehnder : probabilites conservees');
  const b=QM.mz({phi,blockArm:true});
  nearAbs(b.d1,0.25,1e-12,'Bras bloque : D1 = 1/4');
  nearAbs(b.d2,0.25,1e-12,'Bras bloque : D2 = 1/4');
  nearAbs(b.absorbed,0.5,1e-12,'Bras bloque : 1/2 absorbe');
  const w=QM.mz({phi,whichPath:true});
  nearAbs(w.d1,0.5,1e-12,'Chemin connu : D1 = 1/2');
  nearAbs(w.d2,0.5,1e-12,'Chemin connu : D2 = 1/2');
}
{
  const n=100000, p=QM.mzPhotons(n,{phi:Math.PI/2},QM.mulberry32(42));
  near(p.d1/n,0.5,0.025,'Comptage Mach-Zehnder D1');
  ok(p.d1+p.d2+p.absorbed===n,'Mach-Zehnder : exactement un resultat par photon');
  const b=QM.mzPhotons(n,{blockArm:true},QM.mulberry32(99));
  near(b.absorbed/n,0.5,0.025,'Mach-Zehnder : comptage absorption');
  nearAbs(QM.mz({phi:0,eta:0.3}).d1,0.65,1e-12,'Coherence partielle eta=0,3');
}

// 6. Paquet libre exact, norme, dispersion, Heisenberg et vitesse du centre.
const m=QM.me, s0=1e-9, k0=1.5e9, x0=-3e-9, t=2e-14;
const initial={x0,sigma0:s0,k0,m};
const s=QM.sigmaT(s0,m,t), tau=QM.hbar*t/(2*m*s0*s0);
near(s,s0*Math.sqrt(1+tau*tau),1e-6,'Dispersion gaussienne sigma(t)');
nearAbs(QM.momentumSpread(s0)*s0,QM.hbar/2,QM.hbar*1e-9,'Incertitude minimale au depart');
for (const temps of [0,t,3*t]) {
  const largeur=QM.sigmaT(s0,m,temps), centre=x0+QM.hbar*k0/m*temps;
  const area=integrate(x=>QM.gaussPacket(initial,x,temps).abs2,centre-12*largeur,centre+12*largeur,10000);
  nearAbs(area,1,1e-6,'Norme conservee t='+temps);
  const result=QM.expectation({at:x=>QM.gaussPacket(initial,x,temps),min:centre-9*largeur,max:centre+9*largeur,n:3000},(x,z)=>({re:x*z.re,im:x*z.im}));
  nearAbs(result.re,centre,1e-14,'Centre avance a hbar k0/m');
  nearAbs(result.im,0,1e-14,'Esperance position reelle');
  nearAbs(result.norm,1,1e-6,'Norme de l operateur discret');
}
const doubleT=2*m*s0*s0/QM.hbar*Math.sqrt(3);
near(QM.sigmaT(s0,m,doubleT),2*s0,1e-6,'Temps exact de doublement');
nearAbs(QM.gaussPacket(initial,x0,0).abs2,1/(Math.sqrt(2*Math.PI)*s0),1e-2,'Densite initiale au centre');

console.log('Quantique : '+pass+' tests reussis, '+fail+' echec(s) ['+(target===REF?'moteur':'bloc de page identique')+'].');
if(fail) process.exit(1);
