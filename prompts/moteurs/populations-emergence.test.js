// Contrat de vérification autonome : exécuter depuis la racine du dépôt.
// node prompts/moteurs/populations-emergence.test.js
// node prompts/moteurs/populations-emergence.test.js opus-sonnet/fondations-populations-emergence/index.html
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const REF = path.join(__dirname, 'populations-emergence.js');
const cible = process.argv[2] || REF;
const extrait = src => { const a = src.indexOf('/* EMG-BEGIN */'), b = src.indexOf('/* EMG-END */'); return a < 0 || b < a ? null : src.slice(a, b + '/* EMG-END */'.length); };
const bloc = extrait(fs.readFileSync(cible, 'utf8'));
if (!bloc) { console.error('ÉCHEC : marqueurs EMG manquants : ' + cible); process.exit(1); }
if (path.resolve(cible) !== path.resolve(REF) && extrait(fs.readFileSync(REF, 'utf8')) !== bloc) {
  console.error('ÉCHEC : le moteur de la planche diffère du moteur de référence.'); process.exit(1);
}
const Emg = new Function(bloc + '\nreturn Emg;')();
let reussis = 0, echoues = 0;
function verifie(nom, fn) {
  try { fn(); reussis++; console.log('OK     ' + nom); }
  catch (e) { echoues++; console.error('ÉCHEC  ' + nom + ' : ' + e.message); }
}
function proche(a, b, ecart, msg = '') { assert.ok(Math.abs(a - b) <= ecart, `${msg} obtenu=${a}, attendu=${b}, écart=${Math.abs(a - b)}, tolérance=${ecart}`); }
function deriveePic(arr, dt) {
  const pics = [];
  for (let i = 1; i < arr.length - 1; i++) if (arr[i] > arr[i-1] && arr[i] >= arr[i+1]) pics.push(i * dt);
  return pics;
}
verifie('1a · Compétition : coexistence stable', () => {
  const p = { r1: .8, r2: .6, K1: 130, K2: 100, a12: .65, a21: .42 };
  const f = Emg.competition(p); let v = [30, 25]; for (let i = 0; i < 2400; i++) v = f(v, .05);
  const e = Emg.competitionIssue(p);
  assert.equal(e.issue, 'coexistence'); proche(v[0], e.N1, .001); proche(v[1], e.N2, .001);
});
verifie('1b · Compétition : exclusion sans affrontement', () => {
  const p = { r1: .6, r2: .7, K1: 100, K2: 120, a12: 1.6, a21: .35 };
  let v = [25, 25]; const f = Emg.competition(p);
  for (let i = 0; i < 4000; i++) v = f(v, .05);
  assert.equal(Emg.competitionIssue(p).issue, 'espèce 2'); assert.ok(v[0] < .01); proche(v[1], 120, .01);
});
verifie('1c · Logistique RK4 approche K sans le dépasser', () => {
  let v = 10; for (let i = 0; i < 300; i++) v = Emg.logistic(v, {r:.6, K:150}, .1);
  proche(v, 150, .001);
});
verifie('2a · Lotka–Volterra : intégrale première à 1e-6 sur 20 cycles', () => {
  const p = { a: .7, b: .14, c: .08, d: .45 }, f = Emg.lotkaVolterra(p);
  let v = [6.1, 4.6], maxErreur = 0, origine = Emg.lvIntegrale(...v, p);
  const periode = 2 * Math.PI / Math.sqrt(p.a * p.d);
  const tours = Math.ceil(20 * periode / .01);
  for (let i = 0; i < tours; i++) { v = f(v, .01); maxErreur = Math.max(maxErreur, Math.abs(Emg.lvIntegrale(...v,p) - origine)); }
  assert.ok(maxErreur < 1e-6, 'dérive=' + maxErreur);
});
verifie('2b · Pics des prédateurs après les proies, proche du quart de cycle', () => {
  const p = {a:.7,b:.14,c:.08,d:.45}; let v = [6.1,4.6], x=[], y=[];
  const f=Emg.lotkaVolterra(p),dt=.04;
  for(let i=0;i<2600;i++){v=f(v,dt);x.push(v[0]);y.push(v[1]);}
  const px=deriveePic(x,dt),py=deriveePic(y,dt),periode=px[2]-px[1];
  const retard=py.find(t=>t>px[1])-px[1];
  assert.ok(px.length>3&&py.length>3);assert.ok(retard>0.18*periode&&retard<.34*periode,`retard=${retard}, T=${periode}`);
});
verifie('3a · Taille finale SIR R0=2 : 0,797 (±0,001)', () => proche(Emg.finalSize(2), .797, .001));
verifie('3b · Taille finale SIR R0=3 : 0,940 (±0,001)', () => proche(Emg.finalSize(3), .940, .001));
verifie('3c · SIR : pic I quand S=N/R0 à 1%', () => {
  const N=10000, beta=.5,gamma=.2,R0=beta/gamma, f=Emg.sir({N,beta,gamma});
  let y=Emg.initialSIR(N,0,30), meilleur=y[1], spot=y[0];
  for(let i=0;i<1500;i++){y=f(y,.04); if(y[1]>meilleur){meilleur=y[1];spot=y[0];}}
  assert.ok(Math.abs(spot-N/R0)/(N/R0)<.01,`S_pic=${spot}, seuil=${N/R0}`);
});
verifie('3d · Vaccination seuil : I non croissant et taille finale nulle', () => {
  const R0=2.5,vacc=.6,N=10000,f=Emg.sir({beta:.5,gamma:.2,N,vacc});
  let y=Emg.initialSIR(N,vacc,1), premier=y[1];
  for(let i=0;i<250;i++){y=f(y,.1);assert.ok(y[1] <= premier+1e-9);premier=y[1];}
  proche(Emg.finalSize(R0,vacc),0,1e-14);
});
verifie('4a · Agents N=10000 : moyenne de 50 graines proche ODE à 5%', () => {
  const N=10000,beta=.5,gamma=.2,infectes=150,dt=.25,nb=120;
  const f=Emg.sir({N,beta,gamma});let y=Emg.initialSIR(N,0,infectes);
  const reference=[];
  for(let i=0;i<nb;i++){y=f(y,dt);if([35,60,100,119].includes(i)) reference.push([y[0],y[1],y[2]]);}
  const moy=Array.from({length:4},()=>[0,0,0]);
  for(let s=1;s<=50;s++){
    const e=Emg.agentsSIR({N,beta,gamma,contacts:10,infectes},Emg.mulberry32(s*773));let k=0;
    for(let t=0;t<nb;t++){e.step(dt);if([35,60,100,119].includes(t)){moy[k][0]+=e.S/50;moy[k][1]+=e.I/50;moy[k][2]+=e.R/50;k++;}}
  }
  for(let j=0;j<4;j++)for(let k=0;k<3;k++) {
    const a=moy[j][k],b=reference[j][k];
    // I devient très proche de zéro tardivement : l'erreur absolue garde son sens.
    assert.ok(Math.abs(a-b)/N<.05,`j=${j}, k=${k}, agent=${a}, ODE=${b}, écart=${Math.abs(a-b)/N}`);
  }
});
verifie('4b · Agents N=50 : extinctions précoces sur 100 graines', () => {
  let extinctes=0;
  for(let s=1;s<=100;s++){
    const e=Emg.agentsSIR({N:50,infectes:1,beta:.36,gamma:.3,contacts:8},Emg.mulberry32(s*71));
    for(let i=0;i<100&&e.I;i++) e.step(.2);
    if(e.R<=4) extinctes++;
  }
  assert.ok(extinctes>=15&&extinctes<=95,'extinctions limitées à quatre cas=' + extinctes);
});
verifie('5a · Watts–Strogatz : forte agrégation, chemins raccourcis, p=0,01 à 0,1', () => {
  const n=600,k=8,base=Emg.lattice(n,k), C0=Emg.clustering(base), L0=Emg.pathLength(base);
  const hasard=Emg.smallWorld(n,k,1,Emg.mulberry32(989)); const Lr=Emg.pathLength(hasard);
  for(const p of [.01,.05,.1]){
    const g=Emg.smallWorld(n,k,p,Emg.mulberry32(112));const L=Emg.pathLength(g),C=Emg.clustering(g);
    assert.ok(L<L0*.58&&L<4*Lr,`p=${p}: L=${L}, L0=${L0}, Lr=${Lr}`);
    assert.ok(C>C0*.47,`p=${p}: C=${C}, C0=${C0}`);
  }
});
verifie('5b · Barabási–Albert : queue compatible avec une pente de loi de puissance ≈ -3', () => {
  const g=Emg.scaleFree(10000,3,Emg.mulberry32(771)),deg=Emg.degreeDistribution(g);
  // Ajustement sur histogramme à mailles logarithmiques, en divisant par largeur.
  const bords=[3,4,5,7,10,14,20,28,40,56,80];const tailles=bords.slice(0,-1).map((min,i)=>{
    const max=bords[i+1];const c=deg.filter(d=>d.degree>=min&&d.degree<max).reduce((s,d)=>s+d.count,0);
    return {x:Math.sqrt(min*max),y:c/(max-min)};
  }).filter(b=>b.y>3);
  const xs=tailles.map(x=>Math.log(x.x)),ys=tailles.map(x=>Math.log(x.y));
  const xm=xs.reduce((a,b)=>a+b)/xs.length,ym=ys.reduce((a,b)=>a+b)/ys.length;
  const pente=xs.reduce((s,x,i)=>s+(x-xm)*(ys[i]-ym),0)/xs.reduce((s,x)=>s+(x-xm)**2,0);
  assert.ok(pente< -2.5&&pente> -3.5,'pente=' + pente);
});
verifie('6 · Vacciner les 10% de hubs : au moins deux fois moins de cas', () => {
  const g=Emg.scaleFree(700,3,Emg.mulberry32(445));let hubs=0,hasard=0;
  for(let s=0;s<16;s++){
    const vh=Emg.vaccinate(g,.1,'hubs',Emg.mulberry32(s+1));
    const vr=Emg.vaccinate(g,.1,'random',Emg.mulberry32(888+s));
    const e1=Emg.sirOnNetwork(g,{beta:.18,gamma:.22,seeds:[200,201,202],vaccinated:vh},Emg.mulberry32(900+s));
    const e2=Emg.sirOnNetwork(g,{beta:.18,gamma:.22,seeds:[200,201,202],vaccinated:vr},Emg.mulberry32(900+s));
    for(let t=0;t<120;t++){if(e1.I)e1.step();if(e2.I)e2.step();}
    hubs+=e1.gueris+e1.I;hasard+=e2.gueris+e2.I;
  }
  assert.ok(hubs*2<=hasard,`cas hubs=${hubs}, aléatoire=${hasard}, ratio=${hasard/hubs}`);
});
verifie('7a · Jeu de la vie : planeur inchangé et déplacé (1,1) après 4 pas', () => {
  const W=30,H=30;let g=Emg.poserPatron('planeur',W,H,7,8);
  for(let t=0;t<4;t++)g=Emg.life(g,W,H);
  assert.deepEqual([...g],[...Emg.poserPatron('planeur',W,H,8,9)]);
});
verifie('7b · Jeu de la vie : clignotant période 2 et canon non vide', () => {
  const W=60,H=30,g=Emg.poserPatron('clignotant',W,H,10,10);
  assert.deepEqual([...Emg.life(Emg.life(g,W,H),W,H)],[...g]);
  let canon=Emg.poserPatron('canon',W,H,5,8);
  for(let t=0;t<60;t++) canon=Emg.life(canon,W,H);
  assert.ok(canon.reduce((a,b)=>a+b,0)>15);
});
verifie('8 · Boids : ordre ≈0 au départ, >0,8 après 500 pas', () => {
  let oiseaux=Emg.initBoids(200,Emg.mulberry32(994));const depart=Emg.ordreMoyen(oiseaux);
  for(let t=0;t<500;t++)oiseaux=Emg.boidsStep(oiseaux,{},.12);
  const fin=Emg.ordreMoyen(oiseaux);
  assert.ok(depart<.17,'initial=' + depart);assert.ok(fin>.8,'final=' + fin);
});
verifie('9a · Tas de sable : conservation interne sauf grains sortis des bords', () => {
  const g=Emg.sandpileGrid(16,16),rng=Emg.mulberry32(99);
  for(let i=0;i<20000;i++) Emg.sandpileAdd(g,Math.floor(rng()*16),Math.floor(rng()*16));
  assert.equal(g.cells.reduce((a,b)=>a+b,0)+g.lost,g.added);
  assert.ok(g.lost>0);
});
verifie('9b · Avalanches : histogramme log-log sur >=2 décades', () => {
  const g=Emg.sandpileGrid(36,36),r=Emg.mulberry32(42),tailles=[];
  for(let i=0;i<52000;i++) {
    const x=Math.floor(r()*36),y=Math.floor(r()*36),a=Emg.sandpileAdd(g,x,y);
    if(i>=14000) tailles.push(a.size);
  }
  const s=Emg.avalancheStats(tailles);
  assert.ok(s.decades>=2,`décades=${s.decades}`);
  assert.ok(s.slope!==null && s.slope<-.7 && s.slope> -2.4,`pente=${s.slope}`);
  assert.ok(s.r2>.95,`linéarité log-log : R²=${s.r2}`);
});
verifie('10a · Route peu dense, p=0 : aucun arrêt ni bouchon', () => {
  let road=Emg.initRoad(240,15,5);const rng=Emg.mulberry32(9);
  for(let i=0;i<150;i++){const r=Emg.nagelSchreckenberg(road,{vmax:5,p:0},rng);road=r.road;if(i>10){assert.equal(r.jams,0);proche(r.speed,5,1e-12);}}
});
verifie('10b · Freinages p=0,3 : bouchons mobiles sans obstacle', () => {
  let road=Emg.initRoad(240,65,5),maxJam=0,maxGroupes=0,variance=0,dernier=null,rng=Emg.mulberry32(20);
  for(let i=0;i<500;i++){const t=Emg.nagelSchreckenberg(road,{vmax:5,p:.3},rng);road=t.road;maxJam=Math.max(maxJam,t.jams);maxGroupes=Math.max(maxGroupes,t.jamGroups);if(dernier!==null)variance+=Math.abs(t.jams-dernier);dernier=t.jams;}
  assert.ok(maxJam>=7&&maxGroupes>=2&&variance>50,`voitures ralenties max=${maxJam}, groupes max=${maxGroupes}, variation=${variance}`);
});
verifie('10d · Les bouchons reculent pendant que les véhicules avancent', () => {
  // Sur la route circulaire, maximiser la corrélation des sites ralentis avec
  // une image ultérieure ; un déplacement négatif mesure le recul du motif.
  let road=Emg.initRoad(240,65,5), rng=Emg.mulberry32(25), frames=[], vitesseMoyenne=0;
  for(let t=0;t<650;t++){
    const r=Emg.nagelSchreckenberg(road,{vmax:5,p:.3},rng);road=r.road;
    if(t>=160){frames.push(Uint8Array.from(road, v => +(v>=0&&v<=1)));vitesseMoyenne+=r.speed;}
  }
  const score=shift=>{
    let total=0,delta=8;
    for(let t=0;t<frames.length-delta;t+=3){const a=frames[t],b=frames[t+delta];
      for(let i=0;i<240;i++)total+=a[i]*b[(i+shift+240)%240];
    }
    return total;
  };
  const scores=Array.from({length:41},(_,i)=>({shift:i-20,val:score(i-20)}));
  const meilleur=scores.reduce((a,b)=>b.val>a.val?b:a);
  assert.ok(meilleur.shift<=-3 && meilleur.shift>=-9,`recul sur 8 pas=${meilleur.shift} cellules`);
  assert.ok(vitesseMoyenne/frames.length>0.5,`vitesse des véhicules=${vitesseMoyenne/frames.length}`);
});
verifie('10c · Diagramme fondamental : d’abord hausse puis baisse du débit', () => {
  const d=Emg.fundamentalDiagram([.02,.08,.16,.26,.4,.65,.85],{p:.3,vmax:5});
  assert.ok(d[1].flow>d[0].flow && d[2].flow>d[1].flow,JSON.stringify(d));
  assert.ok(d[3].flow>d[6].flow && d[2].flow>d[5].flow,JSON.stringify(d));
});
console.log(`\n${reussis} tests réussis, ${echoues} échec(s) · cible ${cible}`);
if (echoues) process.exit(1);
