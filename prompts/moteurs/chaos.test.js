// Tests du moteur « Stabilité, bifurcations et chaos ».
// node prompts/moteurs/chaos.test.js              : moteur de référence.
// node prompts/moteurs/chaos.test.js page.html    : bloc de la page et identité exacte.
'use strict';
const fs = require('fs');
const path = require('path');
const REF = path.join(__dirname, 'chaos.js');
const target = process.argv[2] || REF;
const debut = '/* CHAOS-BEGIN */', fin = '/* CHAOS-END */';
const extract = src => { const a=src.indexOf(debut), b=src.indexOf(fin); return a<0||b<a?null:src.slice(a,b+fin.length); };
const bloc = extract(fs.readFileSync(target,'utf8'));
if (!bloc) {console.error('ÉCHEC : marqueurs CHAOS absents de '+target); process.exit(1);}
if (target !== REF && extract(fs.readFileSync(REF,'utf8'))!==bloc) {console.error('ÉCHEC : le moteur de la page diffère du moteur de référence.');process.exit(1);}
const Chaos = new Function(bloc+'\nreturn Chaos;')();
let okN=0,failN=0;
function ok(condition,nom,info=''){
  if(condition)okN++;
  else {failN++;console.error('ÉCHEC : '+nom+(info?' ('+info+')':''));}
}
function near(value,expected,tolerance,nom){
  const err=Math.abs(value-expected);
  ok(Number.isFinite(value)&&err<=tolerance,nom,`${value} au lieu de ${expected}, écart ${err}`);
}
function nearRel(value,expected,rel,nom){near(value,expected,Math.abs(expected)*rel,nom);}
const R=Math.PI/180;

// 1. Pendule non linéaire, période et conservation sur 100 périodes.
const petit=Chaos.periodVsAmplitude(5*R), moyen=Chaos.periodVsAmplitude(90*R), grand=Chaos.periodVsAmplitude(170*R);
nearRel(petit.T,petit.T0,.0005,'5° : période petits angles à 0,05 %');
near(moyen.ratio,1.180,.002,'90° : allongement de 18,0 %');
ok(grand.ratio>2,'170° : période supérieure au double');
nearRel(Chaos.periodVsAmplitude(0).T,2*Math.PI*Math.sqrt(1/9.81),1e-11,'formule T0 et intégrale elliptique');
{
  const s0=[Math.PI/2,0],E0=Chaos.pendulumEnergy(s0),dt=.003;
  let s=s0,max=0;
  for(let i=0;i<Math.round(100*moyen.T/dt);i++){
    s=Chaos.pendulumStep(s,dt);max=Math.max(max,Math.abs(Chaos.pendulumEnergy(s)-E0)/Math.max(1,Math.abs(E0)));
  }
  ok(max<1e-8,'pendule : énergie à 10⁻⁸ sur 100 périodes',max.toExponential(3));
}
for (const initial of [[.5,0],[2.5,0],[-2.7,.4],[.25,-.7],[1.1,1.7]]){
  let s=initial;
  const E0=Chaos.pendulumEnergy(s);
  ok(E0<19.62,'état amorti sous la séparatrice : '+initial.join(', '));
  for(let i=0;i<30000;i++)s=Chaos.pendulumStep(s,.005,{g:9.81,L:1,damping:.22});
  ok(Math.abs(Chaos.angle(s[0]))<1e-5&&Math.abs(s[1])<1e-5,'convergence amortie vers (0,0) : '+initial.join(', '),JSON.stringify(s));
}
{
  const champ=Chaos.phasePortrait(),sep=Chaos.separatrix();
  ok(champ.length===345,'champ des phases : quadrillage 2D complet');
  ok(sep.some(p=>Math.abs(p.theta)<.01&&Math.abs(p.haut-2*Math.sqrt(9.81))<.001),'séparatrice analytique au centre');
  ok(Chaos.basin(...Chaos.AIMANTS[0])===0&&Chaos.basin(...Chaos.AIMANTS[1])===1&&Chaos.basin(...Chaos.AIMANTS[2])===2,'trois attracteurs du pendule aimanté');
  const map=Chaos.basinMap(5,{steps:500});
  ok(map.pixels.length===map.nx*map.ny&&map.pixels.every(v=>v>=0&&v<=2),'carte de bassins de dimensions explicites');
}

// 2. Logistique discrète, doublements, fenêtre périodique, Lyapunov.
for(const r of [1.2,1.6,2.1,2.8,2.99]){
  const trajectoire=Chaos.orbit(r,.13,3000),fixe=1-1/r;
  near(trajectoire[trajectoire.length-1],fixe,1e-6,`équilibre stable x*=1-1/r pour r=${r}`);
}
const seuils=Chaos.doublingThresholds();
const attendus=[3,3.44949,3.54409,3.56441];
seuils.forEach((v,i)=>near(v,attendus[i],1e-4,`doublement r${i+1} à 10⁻⁴`));
const rapport=(seuils[2]-seuils[1])/(seuils[3]-seuils[2]);
ok(Math.abs(rapport-Chaos.FEIGENBAUM)/Chaos.FEIGENBAUM<.02,'rapport de Feigenbaum à 2 %',rapport.toFixed(6));
ok(Chaos.detectPeriod(3.84)===3,'fenêtre périodique de période 3 près de r=3,8284');
ok(Chaos.lyapunovLogistic(4)>0,'Lyapunov positif à r=4');
nearRel(Chaos.lyapunovLogistic(4),Math.log(2),.01,'λ(4) = ln 2 à 1 %');
for(const r of [2.8,3.2,3.5,3.84])ok(Chaos.lyapunovLogistic(r)<0,`λ négatif pour un régime périodique à r=${r}`);
{
  const b=Chaos.bifurcation(2.5,4,11,50,12),toile=Chaos.cobweb(3.2,.3,20);
  ok(b.length===11*12,'diagramme : toutes les traces demandées');
  ok(toile.length===41,'toile : segments verticaux et horizontaux');
}

// 3. Double pendule idéal : conservation et amplification déterministe.
const initial=[120*R,0,0,0],reference=Chaos.doubleEnergy(initial);
{
  let s=initial.slice(),max=0;
  for(let i=0;i<100000;i++){
    s=Chaos.doubleStep(s,.001);
    const drift=Math.abs(Chaos.doubleEnergy(s)-reference)/Math.max(1,Math.abs(reference));
    max=Math.max(max,drift);
  }
  ok(max<1e-6,'double pendule : énergie relative à 10⁻⁶ sur 100 s',max.toExponential(3));
}
{
  let a=initial.slice(),b=initial.slice();b[0]+=1e-9;
  const valeurs=[];
  for(let i=1;i<=12500;i++){
    a=Chaos.doubleStep(a,.002);b=Chaos.doubleStep(b,.002);
    if(i%50===0)valeurs.push({t:i*.002,d:Chaos.separation(a,b)});
  }
  const debut=valeurs.find(p=>p.t>=1),fin=valeurs.find(p=>p.t>=20);
  ok(fin.d>1e6*debut.d,'deux lancements à 10⁻⁹ rad deviennent macroscopiquement distincts',`${debut.d} → ${fin.d}`);
  // Fenêtre de croissance présélectionnée, indépendante de la saturation.
  const w=valeurs.filter(p=>p.t>=10.2-1e-8&&p.t<=14.1+1e-8),n=w.length;
  const mt=w.reduce((s,p)=>s+p.t,0)/n,my=w.reduce((s,p)=>s+Math.log(p.d),0)/n;
  let stt=0,sty=0,syy=0;
  for(const p of w){const t=p.t-mt,y=Math.log(p.d)-my;stt+=t*t;sty+=t*y;syy+=y*y;}
  const lambda=sty/stt,r2=sty*sty/(stt*syy);
  ok(lambda>0,'pente de ln(séparation) positive',lambda.toFixed(5)+' s⁻¹');
  ok(r2>.95,'droite ln(séparation) : R² > 0,95 entre 10,2 et 14,1 s',r2.toFixed(6));
  const bennettin=Chaos.lyapunovEstimate(initial,1e-8,70);
  ok(bennettin.lambda>.2,'exposant de Benettin positif',bennettin.lambda.toFixed(5)+' s⁻¹');
  console.log('Double pendule : pente libre '+lambda.toFixed(5)+' s⁻¹, R² '+r2.toFixed(6)+', Benettin '+bennettin.lambda.toFixed(5)+' s⁻¹');
}

// 4. Lorenz : attracteur borné, Lyapunov et branche fixe à ρ = 20.
{
  const result=Chaos.lyapunovLorenz(Chaos.LORENZ,220);
  nearRel(result.lambda,.906,.05,'Lorenz : plus grand exposant ≈ 0,906 à 5 %');
  console.log('Lorenz : exposant calculé '+result.lambda.toFixed(6)+' (attendu ≈ 0,906)');
  let s=[1,1,1],borne=true;const historique=[];
  for(let i=0;i<25000;i++){
    s=Chaos.lorenzStep(s,.01);
    if(i%10===0)historique.push(s);
    if(s.some(v=>!Number.isFinite(v)||Math.abs(v)>100))borne=false;
  }
  ok(borne,'Lorenz chaotique borné pendant 250 unités de temps');
  ok(Chaos.poincareSection(historique).length>20,'section de Poincaré : franchissements ascendants');
  const proj=Chaos.lorenzProjection([1,2,3]);
  ok(Number.isFinite(proj.x)&&Number.isFinite(proj.y),'projection tridimensionnelle finie');
  const params={sigma:10,rho:20,beta:8/3};s=[1,1,1];
  for(let i=0;i<20000;i++)s=Chaos.lorenzStep(s,.01,params);
  const c=Math.sqrt(params.beta*(params.rho-1)),d=Math.min(Math.hypot(s[0]-c,s[1]-c,s[2]-19),Math.hypot(s[0]+c,s[1]+c,s[2]-19));
  ok(d<.002,'ρ=20 : convergence vers un point fixe non nul',d.toExponential(3));
}
near(Chaos.forecastHorizon(1,1e-6)-Chaos.forecastHorizon(1,1e-3),Math.log(1000),1e-12,'gain de précision ×1000 = ln(1000) temps caractéristiques');
ok(Chaos.forecastHorizon(0,1e-6)===null,'pas d’horizon chaotique quand λ n’est pas positif');
console.log(`Bilan : ${okN} tests réussis / ${okN+failN} ; ${failN} échec(s).`);
if(failN) process.exit(1);
