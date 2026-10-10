// Convention LABO : moteur de référence, ou bloc PHYSIO strictement identique extrait d'une planche.
// node prompts/moteurs/physiologie-circulation.test.js
// node prompts/moteurs/physiologie-circulation.test.js opus-sonnet/fondations-physiologie-circulation/index.html
'use strict';
const fs = require('fs');
const path = require('path');
const REF = path.join(__dirname, 'physiologie-circulation.js');
const cible = process.argv[2] || REF;
const begin='/* PHYSIO-BEGIN */', end='/* PHYSIO-END */';
const extrait = src => {
  const i=src.indexOf(begin), j=src.indexOf(end);
  return i<0 || j<0 || j<i ? null : src.slice(i,j+end.length);
};
const bloc=extrait(fs.readFileSync(cible,'utf8'));
if (!bloc) { console.error('ÉCHEC : marqueurs PHYSIO manquants'); process.exit(1); }
if (cible!==REF && extrait(fs.readFileSync(REF,'utf8'))!==bloc) {
  console.error('ÉCHEC : le moteur de la page diffère du moteur de référence'); process.exit(1);
}
const P=new Function(bloc+'\nreturn Physio;')();
let n=0, fails=0;
function ok(c,nom,val='') { n++; if(!c){fails++;console.error(`ÉCHEC ${nom}${val!==''?' : '+val:''}`);} }
function abs(a,b,tol,nom) {ok(Math.abs(a-b)<=tol,nom,`obtenu ${a}, attendu ${b} ± ${tol}`);}
function rel(a,b,tol,nom){ok(Math.abs(a-b)<=Math.abs(b)*tol,nom,`obtenu ${a}, attendu ${b}, tol. ${tol*100}%`);}
const mm=P.mm, ml=P.ml;

// 1. Gordon : plateau, deux zéros et décroissance linéaire documentée.
for(let x of [2.0,2.1,2.25])abs(P.overlap(x*1e-6),1,1e-12,`recouvrement optimal ${x} µm`);
for(let x of [1.3,3.65,3.8])abs(P.overlap(x*1e-6),0,1e-12,`recouvrement nul ${x} µm`);
for(let x of [2.5,2.8,3.3])rel(P.overlap(x*1e-6),(3.65-x)/1.4,1e-12,`pente Gordon ${x} µm`);
ok(P.overlap(1.65e-6)<P.overlap(1.95e-6),'force courte non plate');

// 2. Têtes à graine, force isométrique, calcium, ATP et rigidité.
function forceMoyenne(L){let F=0;
  for(let seed=1;seed<=10;seed++){
    let s=P.crossBridgeSim({nHeads:1500,Ca:1,ATP:true,L,load:1e-6,seed},0);
    for(let i=0;i<350;i++) P.crossBridgeSim(s,.01);
    let sum=0;for(let i=0;i<100;i++){P.crossBridgeSim(s,.01);sum+=s.force;}
    F+=sum/100;
  }
  return F/10;
}
const fmax=forceMoyenne(2.1e-6);
for(let x of [1.65,2.5,2.8,3.2])rel(forceMoyenne(x*1e-6)/fmax,P.overlap(x*1e-6),.05,`force moyenne ∝ recouvrement à ${x} µm, 10 graines`);
let s=P.crossBridgeSim({nHeads:400,Ca:0,ATP:true,L:2.1e-6,seed:8},0);
for(let i=0;i<300;i++)P.crossBridgeSim(s,.01);
ok(s.attached===0 && s.force===0,'sans Ca²⁺ : aucune tête ne se fixe');
ok(s.atpUsed===0,'sans Ca²⁺ : ATP consommé nul');
s=P.crossBridgeSim({nHeads:400,Ca:1,ATP:false,L:2.1e-6,load:1e-6,seed:9},0);
for(let i=0;i<300;i++)P.crossBridgeSim(s,.01);
const fixees=s.attached,atp=s.atpUsed;
for(let i=0;i<500;i++)P.crossBridgeSim(s,.01);
ok(fixees===400 && s.attached===fixees,'sans ATP : aucune des têtes fixées ne se détache');
ok(s.atpUsed===atp && atp===0,'sans ATP : aucune hydrolyse au détachement');
let a=P.crossBridgeSim({nHeads:400,Ca:1,ATP:true,L:2.1e-6,load:1e-6,seed:9},0);
for(let i=0;i<600;i++)P.crossBridgeSim(a,.01);
ok(a.atpUsed>0 && a.strokes>0,'ATP nécessaire au cycle renouvelé');
ok(a.force <= 400*2e-12+1e-18,'force par tête ≤ 2 pN');

// 3. Cœur au repos après régime périodique ; unités SI et tolérances du brief.
function heart(params={},cycles=15){const s=P.heartInit(params),dt=.0005,nt=Math.ceil(60/(s.params.HR*dt)*cycles);
  for(let i=0;i<nt;i++)P.heartStep(s,{},dt);return s;}
const coeur=heart(),m=P.metrics(coeur),traj=P.loop(coeur);
ok(m.VTD>=ml(110)&&m.VTD<=ml(130),'VTD au repos 110–130 mL',m.VTD/ml(1));
ok(m.VES>=ml(65)&&m.VES<=ml(75),'VES au repos 65–75 mL',m.VES/ml(1));
ok(m.FE>=.55&&m.FE<=.65,'fraction d’éjection 55–65 %',m.FE);
rel(m.debit,5/60000,.08,'débit de repos ≈ 5 L/min à HR=70');
abs(m.PaSys/mm(1),120,5,'pression systolique aortique 120 mmHg ± 5');
abs(m.PaDia/mm(1),80,5,'pression diastolique aortique 80 mmHg ± 5');
rel(m.debit,m.VES*70/60,1e-12,'débit = VES × fréquence');
for(const phase of ['remplissage','contraction isovolumique','éjection','relaxation isovolumique'])
  ok(coeur.completed.some(x=>x.phase===phase),`cycle à quatre temps : ${phase}`);

// 4. Frank-Starling : précharge plus élevée, boucle vers la droite et élargie.
const haut=P.metrics(heart({preload:mm(11)}));
ok(haut.VTD>m.VTD && haut.VES>m.VES,'précharge ↑ : VTD et VES ↑');
ok(haut.VTS>m.VTS,'précharge ↑ : boucle décalée vers la droite');

// 5. Aire du cycle P-V comparée à une intégrale indépendamment écrite.
let integ=0;
for(let i=0;i<traj.length;i++){
  const a=traj[i],b=traj[(i+1)%traj.length]; integ+=0.5*(a.P+b.P)*(b.V-a.V);
}
rel(P.strokeWork(traj),Math.abs(integ),.02,'travail = |∮ P dV| à 2 %');
ok(m.W>.5 && m.W<2,'travail de l’ordre du joule par battement',m.W);

// 6. Poiseuille et redistribution en réseau partagé.
const r=.002,L=.2,eta=.0035;
rel(P.poiseuilleR(r/2,L,eta)/P.poiseuilleR(r,L,eta),16,1e-9,'r/2 donne 16 R');
const source=P.network(),normal=P.solve(source,mm(100),mm(5));
const contracte=P.network();contracte.branches.muscles[1].r*=.7;
const serre=P.solve(contracte,mm(100),mm(5));
ok(serre.branches.muscles.Q < normal.branches.muscles.Q,'constriction des muscles : moins de débit');
ok(serre.branches.cerveau.Q > normal.branches.cerveau.Q,'redistribution vers le cerveau par chute moindre en amont');
ok(serre.branches.intestin.Q > normal.branches.intestin.Q,'redistribution vers l’intestin par chute moindre en amont');

// 7. Continuité : sections totales, m/s.
const q=5/60000, Aa=4e-4, Ac=.25;
rel(q/Aa,.20833333333333334,1e-12,'aorte 5 L/min / 4 cm² = 20,83 cm/s');
rel(q/Ac,.0003333333333333333,1e-12,'capillaires 5 L/min / 2 500 cm² = 0,333 mm/s');
const seg=normal.common[0];rel(P.velocity(seg),seg.Q/P.section(seg),1e-12,'continuité réseau, aorte');

// 8. Chute des pressions : artérioles dominant la résistance pour chaque branche.
for(const [nom,b] of Object.entries(normal.branches)) {
  const baisse=b.segments.find(x=>x.nom==='Artérioles');
  ok((baisse.Pin-baisse.Pout)/(normal.Pin-normal.Pout)>.40,`artérioles ${nom} : > 40 % chute totale`);
  abs(b.segments.at(-1).Pout,normal.Pout,1e-7,`sortie veineuse ${nom} = pression terminale`);
}

// 9. Hill + effet Bohr + concentration en O2.
abs(P.hbSat(mm(100))*100,97,1,'SaO2 à 100 mmHg ≈ 97 %');
abs(P.hbSat(mm(40))*100,75,1,'SaO2 à 40 mmHg ≈ 75 %');
ok(P.hbSat(mm(40),{P50:30})<P.hbSat(mm(40)),'Bohr : saturation diminuée à PO2 égale');
abs(P.o2Content(mm(100),150)*100,20,1,'CaO2 ≈ 20 mL/dL à 150 g/L Hb');

// 10. Transit au repos et avec paroi 3 fois épaisse, effort à 0,25 s.
const normalE=P.capillaryTransit({transit:.75},.0005), malade=P.capillaryTransit({thickness:1.5e-6,transit:.25},.0005);
ok(normalE.equilibrium!==null && normalE.equilibrium<.3,'99 % du rapprochement de PO2 avant 0,3 s au repos',normalE.equilibrium);
ok(malade.equilibrium===null && malade.PO2<mm(99),'sans équilibre : paroi × 3, 0,25 s');
ok(normalE.points.every((x,i,a)=>i===0 || x.P>=a[i-1].P),'pression pulmonaire monotone au repos');

console.log(`Physio : ${n-fails}/${n} vérifications réussies ; ${fails} échec(s) ; cible : ${cible}`);
if(fails)process.exit(1);
