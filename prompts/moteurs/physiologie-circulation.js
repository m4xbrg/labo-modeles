/* PHYSIO-BEGIN */
const Physio = (() => {
  'use strict';
  // Toutes les variables physiques sont en SI ; seules les aides mmHg sont destinées à l'interface.
  const MMHG = 133.322, ML = 1e-6, UM = 1e-6, MIN = 60;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const mm = x => x * MMHG;
  const ml = x => x * ML;
  const mulberry32 = seed => {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  };

  // Courbe pédagogique de Gordon-Huxley-Julian (1966) : plateau 2,00–2,25 µm,
  // épaule courte au-dessous de 1,67 µm et perte de recouvrement à 3,65 µm.
  function overlap(L) {
    const u = L / UM;
    if (u <= 1.3 || u >= 3.65) return 0;
    if (u < 1.67) return (u - 1.3) / 0.37 * 0.65;
    if (u < 2) return 0.65 + (u - 1.67) / 0.33 * 0.35;
    if (u <= 2.25) return 1;
    return (3.65 - u) / 1.4;
  }
  function crossBridgeSim(s, dt = 0) {
    if (!s.states) {
      const n = Math.max(1, Math.floor(s.nHeads ?? 300));
      s = {nHeads:n, Ca:s.Ca ?? 0, ATP:s.ATP ?? true, L:s.L ?? 2.3e-6,
        load:s.load ?? 0, seed:s.seed ?? 7, states:new Uint8Array(n), t:0,
        atpUsed:0, strokes:0, force:0, attached:0, rateATP:0, moved:0,
        random:mulberry32(s.seed ?? 7)};
    }
    if (!(dt > 0)) return s;
    const ca = clamp(s.Ca, 0, 1), ov = overlap(s.L);
    const pa = 1 - Math.exp(-34 * ca * dt);
    const pp = 1 - Math.exp(-37 * dt);
    const pd = s.ATP ? 1 - Math.exp(-27 * dt) : 0;
    let strokes = 0, used = 0, attached = 0;
    for (let k = 0; k < s.states.length; k++) {
      let v = s.states[k];
      if (v === 0 && (k + 0.5) / s.nHeads < ov && s.random() < pa) v = 1;
      else if (v === 1 && s.random() < pp) { v = 2; strokes++; }
      else if (v === 2 && s.random() < pd) { v = 0; used++; }
      s.states[k] = v;
      if (v > 0) attached++;
    }
    s.attached = attached;
    s.force = 2e-12 * attached;
    s.atpUsed += used;
    s.strokes += strokes;
    s.rateATP = used / dt;
    if (s.ATP && ca > 0 && s.force > s.load && s.load >= 0) {
      // Pas collectif de 10 nm par cycle complet, moyenné sur les têtes disponibles.
      const dx = 1e-8 * strokes / s.nHeads * (1 - s.load / Math.max(s.force, 1e-30));
      s.L = Math.max(1.3e-6, s.L - dx);
      s.moved += dx;
    }
    s.t += dt;
    return s;
  }

  function heartParams(p = {}) {
    return {HR:p.HR ?? 70, Emax:p.Emax ?? (3.0 * MMHG / ML), Emin:p.Emin ?? (0.065 * MMHG / ML),
      V0:p.V0 ?? ml(10), preload:p.preload ?? mm(9.1),
      R:p.R ?? (1.18 * MMHG / ML), C:p.C ?? (1.55 * ML / MMHG),
      Rmitral:p.Rmitral ?? (0.025 * MMHG / ML), Raortic:p.Raortic ?? (0.065 * MMHG / ML)};
  }
  function elastance(t, p) {
    const T = MIN / p.HR, u = ((t % T) + T) % T / T;
    // Activation ventriculaire concentrée dans la systole ; pas de contraction atriale explicite.
    const a = u < 0.43 ? Math.sin(Math.PI * u / 0.43) ** 2 : 0;
    return p.Emin + (p.Emax - p.Emin) * a;
  }
  function heartInit(p = {}) {
    const q = heartParams(p);
    return {t:0, V:ml(120), Pa:mm(86), P:0, E:q.Emin, phase:'remplissage', mitral:false, aortic:false,
      Qm:0, Qa:0, history:[], completed:[], beat:0, params:q};
  }
  function heartStep(s, overrides = {}, dt = 0.001) {
    const p = heartParams({...s.params, ...overrides}); s.params = p;
    if (!(dt > 0)) return s;
    // Une valve idéale conduit dans un seul sens ; sa résistance ouverte limite le flux.
    const P = elastance(s.t, p) * Math.max(s.V - p.V0, 0);
    const Qm = Math.max(0, (p.preload - P) / p.Rmitral);
    const Qa = Math.max(0, (P - s.Pa) / p.Raortic);
    const Vnext = clamp(s.V + dt * (Qm - Qa), ml(12), ml(220));
    const Panext = Math.max(0, s.Pa + dt * (Qa - s.Pa / p.R) / p.C);
    const period = MIN / p.HR;
    const phase = Qa > 1e-10 ? 'éjection' : Qm > 1e-10 ? 'remplissage'
      : elastance(s.t+1e-5,p) > elastance(s.t,p) ? 'contraction isovolumique' : 'relaxation isovolumique';
    s.t += dt; s.V = Vnext; s.Pa = Panext; s.P = elastance(s.t, p) * (s.V - p.V0);
    s.E = elastance(s.t, p); s.mitral = Qm > 0; s.aortic = Qa > 0;
    s.Qm = Qm; s.Qa = Qa; s.phase = phase;
    s.history.push({t:s.t, V:s.V, P:s.P, Pa:s.Pa, Qm, Qa, phase});
    if (s.history.length > 8000) s.history.shift();
    if (Math.floor((s.t - dt) / period) < Math.floor(s.t / period)) {
      s.completed = s.history.filter(x => x.t > s.t - period - dt);
      s.beat++;
    }
    return s;
  }
  function loop(s) {
    // Les échantillons du dernier cycle complet sont préférés aux états transitoires.
    const pts = s.completed.length > 10 ? s.completed : s.history;
    return pts.map(x => ({V:x.V, P:x.P, t:x.t}));
  }
  function strokeWork(pts) {
    if (pts.length < 3) return 0;
    let sum = 0;
    for (let i=0; i<pts.length; i++) {
      const a=pts[i], b=pts[(i+1)%pts.length];
      sum += (a.P + b.P) * (b.V - a.V) / 2;
    }
    return Math.abs(sum);
  }
  function metrics(s) {
    const pts = s.completed.length > 10 ? s.completed : s.history;
    if (!pts.length) return {VTD:s.V, VTS:s.V, VES:0, FE:0, debit:0, PaSys:s.Pa, PaDia:s.Pa, W:0, puissance:0};
    const VTD = Math.max(...pts.map(x=>x.V)), VTS=Math.min(...pts.map(x=>x.V));
    const VES = VTD - VTS, FE = VES / VTD, debit = VES*s.params.HR / MIN;
    const PaSys=Math.max(...pts.map(x=>x.Pa)), PaDia=Math.min(...pts.map(x=>x.Pa));
    const W=strokeWork(loop(s));
    return {VTD,VTS,VES,FE,debit,PaSys,PaDia,W,puissance:W*s.params.HR/MIN};
  }

  function poiseuilleR(r, L, eta = 0.0035) {
    if (!(r > 0 && L > 0 && eta > 0)) throw new RangeError('Rayon, longueur et viscosité positifs');
    return 8 * eta * L / (Math.PI * r**4);
  }
  function section(segment) {return Math.PI * segment.r**2 * (segment.n ?? 1);}
  function velocity(segment) {return (segment.Q ?? 0) / section(segment);}
  function network(tree = null) {
    const mk=(nom,r,L,n=1) => ({nom,r,L,n});
    const base = {
      common:[mk('Aorte', Math.sqrt(4e-4/Math.PI),.4), mk('Artères communes',.00305/Math.pow(100,.25),.23,100)],
      branches:{
        cerveau:[mk('Artères',.0028/Math.pow(20,.25),.16,20),mk('Artérioles',16e-6,.0012,720000),mk('Capillaires',4e-6,.00065,1.65e9),mk('Veinules',40e-6,.002,100000),mk('Veines',.004/Math.pow(20,.25),.18,20)],
        muscles:[mk('Artères',.0034/Math.pow(20,.25),.22,20),mk('Artérioles',16e-6,.00125,810000),mk('Capillaires',4e-6,.00065,1.75e9),mk('Veinules',40e-6,.002,103333),mk('Veines',.004/Math.pow(20,.25),.20,20)],
        intestin:[mk('Artères',.0025/Math.pow(20,.25),.2,20),mk('Artérioles',16e-6,.00135,680000),mk('Capillaires',4e-6,.00065,1.57e9),mk('Veinules',40e-6,.002,86667),mk('Veines',.0035/Math.pow(20,.25),.2,20)]
      }
    };
    return structuredClone(typeof tree === 'object' && tree ? tree : base);
  }
  function solve(net, Pin = mm(100), Pout = mm(5), eta = 0.0035) {
    const n=network(net);
    const resist = s => poiseuilleR(s.r,s.L,eta) / (s.n ?? 1);
    const r0=n.common.reduce((a,s)=>a+resist(s),0);
    const sums=Object.fromEntries(Object.entries(n.branches).map(([k,ss])=>[k,ss.reduce((a,s)=>a+resist(s),0)]));
    const rPar=1/Object.values(sums).reduce((a,r)=>a+1/r,0);
    const Q=(Pin-Pout)/(r0+rPar);
    let p=Pin;
    n.common.forEach(s=>{s.R=resist(s);s.Pin=p;s.Q=Q;p-=Q*s.R;s.Pout=p;s.v=velocity(s);});
    const join=p, branches={};
    for (const [key, segs] of Object.entries(n.branches)) {
      const q=(join-Pout)/sums[key]; let pr=join;
      segs.forEach(s=>{s.R=resist(s);s.Pin=pr;s.Q=q;pr-=q*s.R;s.Pout=pr;s.v=velocity(s);});
      branches[key]={Q:q,R:sums[key],segments:segs};
    }
    return {Q,R:r0+rPar,Pin,Pout,jonction:join,common:n.common,branches,eta};
  }

  function hbSat(PO2, opts={}) {
    const P50=(opts.P50 ?? 26.8)*MMHG, n=opts.n ?? 2.7;
    const P=Math.max(0,PO2);
    return P===0 ? 0 : 1/(1+(P50/P)**n);
  }
  function o2Content(PO2,Hb=150,opts={}) {
    // Hb en g/L ; concentration retournée en m³ O2(STPD)/m³ de sang, égale numériquement à mL/dL / 100.
    const Hbgdl=Hb/10, po=PO2/MMHG;
    const mlDL=1.34*Hbgdl*hbSat(PO2,opts)+.003*po;
    return mlDL/100;
  }
  function capillaryTransit(o={},dt=.001) {
    const PA=o.PA ?? mm(100), Pv=o.Pv ?? mm(40),
      D=o.D ?? 1, thickness=o.thickness ?? 0.5e-6,
      transit=o.transit ?? 0.75, Hb=o.Hb ?? 150, P50=o.P50 ?? 26.8;
    if (!(dt > 0 && transit > 0 && thickness > 0 && D > 0)) throw new RangeError('Transit et diffusion positifs');
    // Conductance effective en équivalent O2. La dérivée du contenu en O2 apporte
    // la capacité tampon Hb ; les paramètres géométriques restent illustratifs.
    const conductance = 0.020 * D * (0.5e-6/thickness); // en s^-1 par gain normalisé.
    let P=Pv, t=0, equil=null;
    const pts=[{t:0,P,Sat:hbSat(P,{P50}),C:o2Content(P,Hb,{P50})}];
    while(t < transit - 1e-12) {
      const h=Math.min(dt, transit-t), midpoint=Math.max(P,1);
      const dPdP=(o2Content(midpoint+mm(.05),Hb,{P50})-o2Content(midpoint-mm(.05),Hb,{P50}))/(mm(.1));
      const buffer=1 + dPdP / (0.003/100/MMHG) * .012;
      const k=conductance/buffer;
      P=PA+(P-PA)*Math.exp(-k*h*1000);
      t+=h;
      if (equil===null && Math.abs(P-PA) <= .01*Math.abs(Pv-PA)) equil=t;
      pts.push({t,P,Sat:hbSat(P,{P50}),C:o2Content(P,Hb,{P50})});
    }
    return {points:pts, PO2:P, Sat:hbSat(P,{P50}), C:o2Content(P,Hb,{P50}),
      equilibrium:equil, PA,Pv,transit,thickness,D};
  }
  return {MMHG, ML, UM, mm, ml, mulberry32, overlap, crossBridgeSim, heartParams,
    elastance, heartInit, heartStep, loop, strokeWork, metrics,
    poiseuilleR,section,velocity,network,solve,hbSat,o2Content,capillaryTransit};
})();
/* PHYSIO-END */
