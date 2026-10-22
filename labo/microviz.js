/* LABO — microvisualisations de l’index des fondations.
   Un pictogramme par module, dessiné dans un <svg viewBox="0 0 128 36" data-viz="clé">.
   Statique au repos (on dessine l’instant t = 0,35), animé seulement au survol ou au focus
   de la ligne, et jamais si prefers-reduced-motion. Couleurs : var(--c) (couleur du module),
   var(--encre*), var(--trait), var(--papier) ; rien de codé en dur, pour suivre le thème.
   La clé d’un module se choisit dans presentation.js (MODULES), pas ici.

   Contrat d’une fabrique : VIZ.cle(svg) pose ses éléments et rend f(t, actif),
   t en secondes, actif = la ligne est survolée. */
(() => {
'use strict';
const NS = 'http://www.w3.org/2000/svg';
const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;
const el = (tag, at) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); return e; };
let alea = 7; const rnd = () => (alea = (alea * 16807) % 2147483647) / 2147483647;

const VIZ = {
  onde(svg){
    const p = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.3});
    svg.append(el('line',{x1:0,x2:128,y1:18,y2:18,stroke:'var(--trait)','stroke-width':1}), p);
    return t => { let d=''; for (let x=0;x<=128;x+=2){ const y = 18 - 11*Math.sin(x/128*Math.PI*4 - t*3)*Math.exp(-x/260); d += (x?'L':'M')+x+' '+y.toFixed(2); } p.setAttribute('d',d); };
  },
  phase(svg){
    const cx=18, R=13;
    svg.append(el('circle',{cx,cy:18,r:R,fill:'none',stroke:'var(--trait)'}));
    const ray = el('line',{x1:cx,y1:18,stroke:'var(--encre-3)','stroke-width':1});
    const dot = el('circle',{r:2.4,fill:'var(--c)'});
    const tr = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2});
    const h = el('line',{stroke:'var(--c)','stroke-width':.8,'stroke-dasharray':'2 2',opacity:.6});
    svg.append(ray,tr,h,dot);
    return t => {
      const a = t*1.6, x = cx+R*Math.cos(a), y = 18-R*Math.sin(a);
      ray.setAttribute('x2',x); ray.setAttribute('y2',y); dot.setAttribute('cx',x); dot.setAttribute('cy',y);
      h.setAttribute('x1',x); h.setAttribute('y1',y); h.setAttribute('x2',40); h.setAttribute('y2',y);
      let d=''; for (let i=0;i<=88;i+=2){ d += (i?'L':'M')+(40+i)+' '+(18-R*Math.sin(a - i/14)).toFixed(2); } tr.setAttribute('d',d);
    };
  },
  orbite(svg){
    svg.append(el('ellipse',{cx:64,cy:18,rx:46,ry:13,fill:'none',stroke:'var(--trait)'}),
               el('circle',{cx:64+46*0.55,cy:18,r:3.2,fill:'var(--encre)'}));
    const p = el('circle',{r:2.2,fill:'var(--c)'}); svg.append(p);
    const f = 46*0.55; // foyer
    return t => { // anomalie : approximation suffisante pour un pictogramme
      const M = t*1.2; let E = M; for (let i=0;i<5;i++) E = M + .55*Math.sin(E);
      p.setAttribute('cx', 64 + 46*Math.cos(E)); p.setAttribute('cy', 18 + 13*Math.sin(E)); };
  },
  gaz(svg){
    svg.append(el('rect',{x:.5,y:.5,width:127,height:35,fill:'none',stroke:'var(--trait)'}));
    const P = Array.from({length:18},()=>({x:4+rnd()*120,y:4+rnd()*28,vx:rnd()-.5,vy:rnd()-.5,e:el('circle',{r:1.7,fill:'var(--c)'})}));
    P.forEach(p => svg.append(p.e));
    const base = P.map(p => ({x:p.x,y:p.y,vx:p.vx,vy:p.vy})); let last = 0;
    return (t, actif) => { if (!actif) P.forEach((p,i)=>Object.assign(p, base[i]));
      const dt = actif ? Math.min(.05, t-last || 0) : 0; last = t;
      for (const p of P){ p.x += p.vx*dt*90; p.y += p.vy*dt*90;
        if (p.x<3||p.x>125){p.vx*=-1;p.x=Math.max(3,Math.min(125,p.x));} if (p.y<3||p.y>33){p.vy*=-1;p.y=Math.max(3,Math.min(33,p.y));}
        p.e.setAttribute('cx',p.x.toFixed(1)); p.e.setAttribute('cy',p.y.toFixed(1)); } };
  },
  diffusion(svg){
    svg.append(el('line',{x1:64,x2:64,y1:0,y2:36,stroke:'var(--trait)','stroke-dasharray':'2 3'}));
    const P = Array.from({length:22},()=>({x:4+rnd()*30,y:4+rnd()*28,e:el('circle',{r:1.6,fill:'var(--c)'})}));
    P.forEach(p => svg.append(p.e));
    const base = P.map(p => ({x:p.x,y:p.y})); let last=0, t0=null;
    return (t, actif) => { if (!actif){ P.forEach((p,i)=>{p.x=base[i].x;p.y=base[i].y;}); t0=null; }
      else { const dt = Math.min(.05,t-last||0); for (const p of P){ p.x += (rnd()-.5)*dt*160; p.y += (rnd()-.5)*dt*160;
        p.x=Math.max(3,Math.min(125,p.x)); p.y=Math.max(3,Math.min(33,p.y)); } }
      last=t; P.forEach(p=>{p.e.setAttribute('cx',p.x.toFixed(1));p.e.setAttribute('cy',p.y.toFixed(1));}); };
  },
  hasard(svg){
    const bars = []; const N = 15;
    for (let i=0;i<N;i++){ const b = el('rect',{x:6+i*8,width:5,fill:'var(--c)'}); bars.push(b); svg.append(b); }
    svg.append(el('line',{x1:0,x2:128,y1:35.5,y2:35.5,stroke:'var(--trait)'}));
    const g = i => Math.exp(-((i-7)**2)/(2*2.6**2));
    let n = 0, cts = new Array(N).fill(0);
    return (t, actif) => {
      if (!actif){ cts = cts.map((_,i)=>g(i)*30); n = 0; }
      else { for (let k=0;k<3;k++){ let s=0; for (let j=0;j<14;j++) s += rnd()<.5?1:0; cts[s]=(cts[s]||0)+1; } n++; }
      const m = Math.max(...cts) || 1; bars.forEach((b,i)=>{ const h = 32*cts[i]/m; b.setAttribute('y',35-h); b.setAttribute('height',h); });
      if (actif && n>220){ cts.fill(0); n=0; } };
  },
  fil(svg){ // fil vu en bout : courant sortant, lignes de champ concentriques
    const C = [];
    svg.append(el('line',{x1:0,x2:128,y1:18,y2:18,stroke:'var(--trait)','stroke-dasharray':'1 3'}));
    for (let i=0;i<4;i++){ const c = el('circle',{cx:64,cy:18,fill:'none',stroke:'var(--c)','stroke-width':1}); C.push(c); svg.append(c); }
    svg.append(el('circle',{cx:64,cy:18,r:3.4,fill:'var(--papier)',stroke:'var(--encre)','stroke-width':1}), el('circle',{cx:64,cy:18,r:1,fill:'var(--encre)'}));
    return t => C.forEach((c,i)=>{ const r = 7 + i*8 + 1.2*Math.sin(t*2 - i*.8); c.setAttribute('r',r); c.setAttribute('opacity',(1 - i*.22).toFixed(2)); });
  },
  em(svg){
    const e = el('path',{fill:'none',stroke:'var(--positif)','stroke-width':1.1});
    const b = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.1});
    svg.append(el('line',{x1:0,x2:128,y1:20,y2:20,stroke:'var(--trait)'}), b, e);
    return t => { let de='',db=''; for (let x=0;x<=128;x+=2){ const s = Math.sin(x/128*Math.PI*4 - t*3);
      de += (x?'L':'M')+x+' '+(20-13*s).toFixed(2); db += (x?'L':'M')+(x+4*s).toFixed(2)+' '+(20+5*s).toFixed(2); }
      e.setAttribute('d',de); b.setAttribute('d',db); };
  },
  echelle(svg){ // règle logarithmique 10⁻¹⁰ → 10¹³ m, curseur qui parcourt les décades
    const X = e => 6 + (e+10)*5.04, Y = 27;
    svg.append(el('line',{x1:4,x2:124,y1:Y,y2:Y,stroke:'var(--trait)'}));
    for (let e=-10;e<=13;e++){ const h = e===0 ? 9 : e%5===0 ? 6 : 3;
      svg.append(el('line',{x1:X(e),x2:X(e),y1:Y,y2:Y-h,stroke:e===0?'var(--encre-2)':'var(--encre-3)','stroke-width':e===0?1.1:.8})); }
    [[-10,1],[-5,1.4],[0,1.8],[7,2.4],[13,3]].forEach(([e,r]) => svg.append(el('circle',{cx:X(e),cy:Y-13,r,fill:'none',stroke:'var(--encre-3)','stroke-width':.8})));
    const seg = el('line',{x1:X(0),y1:Y,y2:Y,stroke:'var(--c)','stroke-width':1.3});
    const cur = el('line',{y1:3,y2:Y,stroke:'var(--c)','stroke-width':.8,'stroke-dasharray':'2 2',opacity:.7});
    const dot = el('circle',{cy:Y,r:2.4,fill:'var(--c)'});
    svg.append(seg,cur,dot);
    return t => { const x = X(1.5 + 11.5*Math.sin(t*.5 - .9)).toFixed(2);
      seg.setAttribute('x2',x); cur.setAttribute('x1',x); cur.setAttribute('x2',x); dot.setAttribute('cx',x); };
  },
  vecteur(svg){ // a + b : règle du parallélogramme, a tourne
    const O = [30,31], b = [44,-7];
    const pa = el('line',{stroke:'var(--encre-2)','stroke-width':1.1}), pb = el('line',{stroke:'var(--encre-2)','stroke-width':1.1});
    const qa = el('line',{stroke:'var(--trait)','stroke-dasharray':'2 2'}), qb = el('line',{stroke:'var(--trait)','stroke-dasharray':'2 2'});
    const s = el('line',{stroke:'var(--c)','stroke-width':1.3});
    const ha = el('path',{fill:'var(--encre-2)'}), hb = el('path',{fill:'var(--encre-2)'}), hs = el('path',{fill:'var(--c)'});
    svg.append(qa,qb,pa,pb,s,ha,hb,hs, el('circle',{cx:O[0],cy:O[1],r:1.6,fill:'var(--encre)'}));
    const seg = (l,h,x1,y1,x2,y2) => { const a = Math.atan2(y2-y1,x2-x1), c = Math.cos(a), n = Math.sin(a);
      const bx = x2-5*c, by = y2-5*n;
      l.setAttribute('x1',x1); l.setAttribute('y1',y1); l.setAttribute('x2',bx.toFixed(2)); l.setAttribute('y2',by.toFixed(2));
      h.setAttribute('d',`M${x2.toFixed(2)} ${y2.toFixed(2)}L${(bx-2.2*n).toFixed(2)} ${(by+2.2*c).toFixed(2)}L${(bx+2.2*n).toFixed(2)} ${(by-2.2*c).toFixed(2)}Z`); };
    return t => { const al = .7 + .45*Math.sin(t*.8), L = 24;
      const A = [O[0]+L*Math.cos(al), O[1]-L*Math.sin(al)], B = [O[0]+b[0], O[1]+b[1]], S = [A[0]+b[0], A[1]+b[1]];
      seg(pa,ha,O[0],O[1],A[0],A[1]); seg(pb,hb,O[0],O[1],B[0],B[1]); seg(s,hs,O[0],O[1],S[0],S[1]);
      qa.setAttribute('x1',A[0]); qa.setAttribute('y1',A[1]); qa.setAttribute('x2',S[0]); qa.setAttribute('y2',S[1]);
      qb.setAttribute('x1',B[0]); qb.setAttribute('y1',B[1]); qb.setAttribute('x2',S[0]); qb.setAttribute('y2',S[1]); };
  },
  tangente(svg){ // x(t) : la pente (dérivée) au point, l’aire déjà accumulée (intégrale)
    const Y = 32, y = x => 19 - 9*Math.sin(x/19) - 3*Math.sin(x/7.3), dy = x => -9/19*Math.cos(x/19) - 3/7.3*Math.cos(x/7.3);
    const aire = el('path',{fill:'var(--c)',opacity:.14});
    let d=''; for (let x=4;x<=124;x+=2) d += (x>4?'L':'M')+x+' '+y(x).toFixed(2);
    svg.append(aire, el('line',{x1:4,x2:124,y1:Y,y2:Y,stroke:'var(--trait)'}), el('path',{d,fill:'none',stroke:'var(--encre-3)','stroke-width':1}));
    const tg = el('line',{stroke:'var(--c)','stroke-width':1.2}), pt = el('circle',{r:2.4,fill:'var(--c)'});
    svg.append(tg,pt);
    return t => { const x0 = 16 + 96*(1-Math.cos(t*.45 + .6))/2, y0 = y(x0), m = dy(x0), k = 13/Math.sqrt(1+m*m);
      let a = 'M4 '+Y; for (let x=4;x<x0;x+=2) a += 'L'+x+' '+y(x).toFixed(2); aire.setAttribute('d', a+'L'+x0.toFixed(2)+' '+y0.toFixed(2)+'L'+x0.toFixed(2)+' '+Y+'Z');
      tg.setAttribute('x1',(x0-k).toFixed(2)); tg.setAttribute('y1',(y0-k*m).toFixed(2)); tg.setAttribute('x2',(x0+k).toFixed(2)); tg.setAttribute('y2',(y0+k*m).toFixed(2));
      pt.setAttribute('cx',x0.toFixed(2)); pt.setAttribute('cy',y0.toFixed(2)); };
  },
  flot(svg){ // ligne de phase de dx/dt = sin θ : des états glissent vers les points fixes stables
    const Y = 18, th = x => (x-64)*Math.PI/32;
    let d=''; for (let x=2;x<=126;x+=2) d += (x>2?'L':'M')+x+' '+(Y-10*Math.sin(th(x))).toFixed(2);
    svg.append(el('line',{x1:2,x2:126,y1:Y,y2:Y,stroke:'var(--trait)'}), el('path',{d,fill:'none',stroke:'var(--encre-3)','stroke-width':.8,opacity:.7}));
    [32,96].forEach(cx => svg.append(el('circle',{cx,cy:Y,r:3,fill:'none',stroke:'var(--c)','stroke-width':1})));
    svg.append(el('circle',{cx:64,cy:Y,r:2.4,fill:'var(--papier)',stroke:'var(--encre-2)','stroke-width':1}));
    const P = [7,20,42,57,71,86,108,121].map(x0 => { const e = el('circle',{cy:Y,r:1.8,fill:'var(--c)'}); svg.append(e);
      const q = Math.round(th(x0)/(2*Math.PI)); return { e, q, u: Math.tan((th(x0) - 2*Math.PI*q)/2) }; });
    return t => { const s = t % 4, g = Math.exp(1.1*s), o = Math.min(1, s*3, (4-s)*3).toFixed(2); // solution exacte, repart toutes les 4 s
      for (const p of P){ const x = 64 + 32*(2*p.q + 2*Math.atan(p.u*g)/Math.PI);
        p.e.setAttribute('cx',x.toFixed(2)); p.e.setAttribute('opacity',o); } };
  },
  demivie(svg){ // N = N₀ 2^(−t/t½) : chaque demi-vie divise par deux
    const X0 = 4, T = 28, y = x => 32 - 28*Math.pow(2, -(x-X0)/T);
    let d=''; for (let x=X0;x<=124;x+=2) d += (x>X0?'L':'M')+x+' '+y(x).toFixed(2);
    svg.append(el('line',{x1:X0,x2:124,y1:32,y2:32,stroke:'var(--trait)'}));
    for (let k=1;k<=4;k++){ const x = X0+k*T, yy = y(x).toFixed(2);
      svg.append(el('line',{x1:x,x2:x,y1:yy,y2:32,stroke:'var(--trait)','stroke-dasharray':'1.5 2'})); }
    svg.append(el('path',{d,fill:'none',stroke:'var(--encre-3)','stroke-width':1}));
    for (let k=1;k<=4;k++) svg.append(el('circle',{cx:X0+k*T,cy:y(X0+k*T).toFixed(2),r:1.5,fill:'var(--papier)',stroke:'var(--encre-3)','stroke-width':.8}));
    const v = el('line',{y2:32,stroke:'var(--c)','stroke-width':.8,'stroke-dasharray':'2 2'}), pt = el('circle',{r:2.4,fill:'var(--c)'});
    svg.append(v,pt);
    return t => { const s = (t*.25) % 1, x = X0 + 4 + 116*s, yy = y(x).toFixed(2), o = Math.min(1, s*12, (1-s)*12).toFixed(2);
      v.setAttribute('x1',x.toFixed(2)); v.setAttribute('x2',x.toFixed(2)); v.setAttribute('y1',yy); v.setAttribute('opacity',(o*.7).toFixed(2));
      pt.setAttribute('cx',x.toFixed(2)); pt.setAttribute('cy',yy); pt.setAttribute('opacity',o); };
  },
  cobweb(svg){ // application logistique : toile d’araignée vers x*, puis chaos quand r grandit
    const S = 30, X = 3, Y = 33, N = 21; // carré [0,1]² à gauche, série xₙ à droite
    svg.append(el('rect',{x:X,y:Y-S,width:S,height:S,fill:'none',stroke:'var(--trait)'}),
               el('line',{x1:X,y1:Y,x2:X+S,y2:Y-S,stroke:'var(--trait)'}));
    const par = el('path',{fill:'none',stroke:'var(--encre-3)','stroke-width':1}), web = el('path',{fill:'none',stroke:'var(--c)','stroke-width':.9,opacity:.85});
    const ser = el('path',{fill:'none',stroke:'var(--c)','stroke-width':.8,opacity:.45});
    svg.append(par,web,ser);
    const D = Array.from({length:N},(_,i) => { const e = el('circle',{cx:42+i*4,r:1.5,fill:'var(--c)'}); svg.append(e); return e; });
    return t => { const r = 2.9 + (1-Math.cos(t*.35))/2, px = u => (X+S*u).toFixed(2), py = u => (Y-S*u).toFixed(2);
      let d=''; for (let i=0;i<=20;i++){ const u = i/20; d += (i?'L':'M')+px(u)+' '+py(r*u*(1-u)); } par.setAttribute('d',d);
      let x = .12, w = 'M'+px(x)+' '+Y, s = '';
      for (let i=0;i<N;i++){ const n = r*x*(1-x); w += 'L'+px(x)+' '+py(n)+'L'+px(n)+' '+py(n);
        const cy = (Y-1 - (S-2)*x).toFixed(2); D[i].setAttribute('cy',cy); s += (i?'L':'M')+(42+i*4)+' '+cy; x = n; }
      web.setAttribute('d',w); ser.setAttribute('d',s); };
  },
  fourier(svg){ // série de Fourier du créneau : les harmoniques entrent et sortent une à une
    const H = [1,3,5,7,9], A = 10.5*4/Math.PI;
    svg.append(el('line',{x1:0,x2:128,y1:18,y2:18,stroke:'var(--trait)'}));
    const ph = H.map(() => { const p = el('path',{fill:'none',stroke:'var(--encre-3)','stroke-width':.8}); svg.append(p); return p; });
    const sum = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.3}); svg.append(sum);
    return t => { const K = 5 - 4*(1-Math.cos(t*.5 + 1))/2, w = H.map((_,i) => Math.max(0, Math.min(1, K-i))), ds = H.map(()=> '');
      let s = '';
      for (let x=0;x<=128;x++){ const a = x/128*Math.PI*4 - t*.8; let y = 0;
        H.forEach((n,i) => { const c = A*Math.sin(n*a)/n; y += w[i]*c; ds[i] += (x?'L':'M')+x+' '+(18-c).toFixed(1); });
        s += (x?'L':'M')+x+' '+(18-y).toFixed(1); }
      ph.forEach((p,i) => { p.setAttribute('d',ds[i]); p.setAttribute('opacity',(.4*w[i]).toFixed(2)); }); sum.setAttribute('d',s); };
  },
  force(svg){ // force constante : le bloc accélère, la stroboscopie s’écarte en t²
    const a = 32.6, X = s => 10 + a*s*s/2;
    svg.append(el('line',{x1:2,x2:126,y1:29.5,y2:29.5,stroke:'var(--trait)'}));
    for (let k=0;k<6;k++) svg.append(el('circle',{cx:X(k*.48).toFixed(1),cy:33,r:1.2,fill:'var(--encre-3)'}));
    const b = el('rect',{y:21,width:8,height:8,fill:'var(--papier)',stroke:'var(--encre)','stroke-width':1});
    const f = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.3,'stroke-linecap':'round','stroke-linejoin':'round'});
    svg.append(b, f);
    return t => { const s = Math.max(0, Math.min(2.4, (t % 3.2) - .3)), x = X(s);
      b.setAttribute('x',(x-4).toFixed(1));
      f.setAttribute('d',`M${(x+4).toFixed(1)} 25L${(x+16).toFixed(1)} 25M${(x+13).toFixed(1)} 23L${(x+16).toFixed(1)} 25L${(x+13).toFixed(1)} 27`); };
  },
  choc(svg){ // choc élastique m₁ = 2m₂ : la barre Σp garde sa longueur, le centre de masse file droit
    const tc = 38.6/24;
    svg.append(el('line',{x1:2,x2:126,y1:24.5,y2:24.5,stroke:'var(--trait)'}));
    const g = el('line',{y1:9,y2:31,stroke:'var(--encre-3)','stroke-width':.8,'stroke-dasharray':'1.5 2'});
    const A = el('circle',{cy:21.3,r:3.2,fill:'var(--c)'}), B = el('circle',{cy:22.3,r:2.2,fill:'var(--encre)'});
    const pa = el('line',{y1:5,y2:5,stroke:'var(--c)','stroke-width':1.3,'stroke-linecap':'round'});
    const pb = el('line',{y1:5,y2:5,stroke:'var(--encre)','stroke-width':1.3,'stroke-linecap':'round'});
    svg.append(g, pa, pb, A, B);
    return t => { const u = t % 3.6, d = Math.max(0, u - tc);
      const xa = u < tc ? 12 + 24*u : 50.6 + 8*d, xb = u < tc ? 56 : 56 + 32*d;
      const m = (2*xa + xb)/3, q = u < tc ? 40 : 40/3; // part de p portée par A
      A.setAttribute('cx',xa.toFixed(1)); B.setAttribute('cx',xb.toFixed(1));
      g.setAttribute('x1',m.toFixed(1)); g.setAttribute('x2',m.toFixed(1));
      pa.setAttribute('x1',(m-20).toFixed(1)); pa.setAttribute('x2',(m-20+q).toFixed(1));
      pb.setAttribute('x1',(m-20+q).toFixed(1)); pb.setAttribute('x2',(m+20).toFixed(1));
      pb.setAttribute('opacity', u < tc ? 0 : 1); };
  },
  patineur(svg){ // L = Iω constant : les masses rentrent, ça tourne plus vite
    const cx = 20, r = t => 10 - 3*Math.cos(t*.9);
    svg.append(el('circle',{cx,cy:18,r:13,fill:'none',stroke:'var(--trait)','stroke-dasharray':'1 2.5'}),
               el('line',{x1:42,x2:126,y1:32.5,y2:32.5,stroke:'var(--trait)'}));
    const I = el('path',{fill:'none',stroke:'var(--encre-3)','stroke-width':1});
    const W = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2});
    const bras = el('line',{stroke:'var(--encre-3)','stroke-width':1});
    const m1 = el('circle',{r:2.4,fill:'var(--c)'}), m2 = el('circle',{r:2.4,fill:'var(--c)'});
    svg.append(I, W, bras, m1, m2, el('circle',{cx,cy:18,r:1.2,fill:'var(--encre)'}));
    const yI = q => 32 - 26*(q*q - 49)/120, yW = q => 32 - 26*(1/(q*q) - 1/169)/(1/49 - 1/169);
    let th = .6, last = 0;
    return (t, actif) => {
      if (!actif) th = .6; else { const dt = Math.min(.05, t-last || 0); th = (th + 200/r(t)**2*dt) % (2*Math.PI); }
      last = t; const R = r(t), dx = R*Math.cos(th), dy = R*Math.sin(th);
      bras.setAttribute('x1',(cx-dx).toFixed(2)); bras.setAttribute('y1',(18+dy).toFixed(2));
      bras.setAttribute('x2',(cx+dx).toFixed(2)); bras.setAttribute('y2',(18-dy).toFixed(2));
      m1.setAttribute('cx',(cx+dx).toFixed(2)); m1.setAttribute('cy',(18-dy).toFixed(2));
      m2.setAttribute('cx',(cx-dx).toFixed(2)); m2.setAttribute('cy',(18+dy).toFixed(2));
      let di='', dw=''; for (let i=0;i<=84;i+=2){ const q = r(t - i/22), x = 42 + i;
        di += (i?'L':'M')+x+' '+yI(q).toFixed(2); dw += (i?'L':'M')+x+' '+yW(q).toFixed(2); }
      I.setAttribute('d',di); W.setAttribute('d',dw); };
  },
  ressort(svg){ // masse pendue, amortie : x = A e^(−γt) cos ω₀t, relancée en boucle
    const P = 6, w = 5.65, gm = .5, X0 = 34, k = 92/P;
    const x = s => 20 + 7*Math.exp(-gm*s)*Math.cos(w*s);
    svg.append(el('line',{x1:8,x2:24,y1:1.5,y2:1.5,stroke:'var(--encre-3)','stroke-width':1}));
    let eh='', eb=''; for (let s=0;s<=P;s+=.2){ const e = 7*Math.exp(-gm*s), X = (X0+s*k).toFixed(1);
      eh += (s?'L':'M')+X+' '+(20-e).toFixed(2); eb += (s?'L':'M')+X+' '+(20+e).toFixed(2); }
    let dt=''; for (let s=0;s<=P;s+=.05) dt += (s?'L':'M')+(X0+s*k).toFixed(1)+' '+x(s).toFixed(2);
    svg.append(el('path',{d:eh+eb,fill:'none',stroke:'var(--trait)','stroke-dasharray':'1.5 2'}),
               el('path',{d:dt,fill:'none',stroke:'var(--trait)','stroke-width':1}));
    const tr = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2});
    const sp = el('path',{fill:'none',stroke:'var(--encre-3)','stroke-width':.9,'stroke-linejoin':'round'});
    const h = el('line',{stroke:'var(--c)','stroke-width':.8,'stroke-dasharray':'2 2',opacity:.6});
    const b = el('rect',{x:12,width:8,height:6,fill:'var(--papier)',stroke:'var(--encre)','stroke-width':1});
    const dot = el('circle',{r:2,fill:'var(--c)'});
    svg.append(sp, tr, h, b, dot);
    return t => { const u = t % P, y = x(u), px = X0 + u*k, top = y - 3;
      let d = 'M16 1.5L16 4'; const n = 8, l = (top - 1 - 4)/n;
      for (let i=0;i<n;i++) d += 'L'+(i%2?13:19)+' '+(4 + (i+.5)*l).toFixed(2); d += 'L16 '+(top-1).toFixed(2)+'L16 '+top.toFixed(2);
      sp.setAttribute('d',d); b.setAttribute('y',top.toFixed(2));
      let e=''; for (let s=0;s<=u;s+=.05) e += (s?'L':'M')+(X0+s*k).toFixed(1)+' '+x(s).toFixed(2); tr.setAttribute('d',e || 'M34 20');
      h.setAttribute('x1',20); h.setAttribute('y1',y.toFixed(2)); h.setAttribute('x2',px.toFixed(1)); h.setAttribute('y2',y.toFixed(2));
      dot.setAttribute('cx',px.toFixed(1)); dot.setAttribute('cy',y.toFixed(2)); };
  },
  champ(svg){ // champ F = cos φ · r̂ + sin φ · θ̂ : de la source (∇·F) au tourbillon (∇×F)
    const A = [];
    for (let j=0;j<3;j++) for (let i=0;i<9;i++){ const x = 8+i*14, y = 6+j*12, dx = (x-64)/2.6, dy = y-18, n = Math.hypot(dx,dy);
      if (!n) continue; const e = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1,'stroke-linecap':'round','stroke-linejoin':'round',opacity:(1 - n/40).toFixed(2)});
      A.push({x, y, ux:dx/n, uy:dy/n, e}); svg.append(e); }
    svg.append(el('circle',{cx:64,cy:18,r:1.6,fill:'var(--encre)'}));
    return t => { const p = Math.PI/4*(1 + Math.sin(t*.7)), c = Math.cos(p), s = Math.sin(p);
      for (const a of A){ const vx = c*a.ux - s*a.uy, vy = c*a.uy + s*a.ux; // θ̂ = (−uy, ux)
        const x0 = a.x - 2.5*vx, y0 = a.y - 2.5*vy, x1 = a.x + 2.5*vx, y1 = a.y + 2.5*vy, f = v => v.toFixed(2);
        a.e.setAttribute('d',`M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}M${f(x1 - 1.6*vx - 1.1*vy)} ${f(y1 - 1.6*vy + 1.1*vx)}L${f(x1)} ${f(y1)}L${f(x1 - 1.6*vx + 1.1*vy)} ${f(y1 - 1.6*vy - 1.1*vx)}`); } };
  },
  palier(svg){ // courbe de chauffe à puissance constante : x = chaleur reçue, paliers = changements de phase
    const K = [[4,32],[24,25],[52,25],[70,12],[108,12],[124,4]];
    const pts = K.map(p => p.join(' ')).join('L');
    svg.append(el('path',{d:'M3 2V34H126',fill:'none',stroke:'var(--trait)','stroke-width':1}),
               el('path',{d:'M'+pts,fill:'none',stroke:'var(--encre-3)','stroke-width':1,opacity:.5}));
    const tr = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.3,'stroke-linejoin':'round'});
    const v = el('line',{y2:34,stroke:'var(--c)','stroke-width':.8,'stroke-dasharray':'1 2',opacity:.6});
    const dot = el('circle',{r:2.4,fill:'var(--c)'});
    svg.append(tr, v, dot);
    return t => {
      const x = 4 + ((t*18 + 28) % 120); let d = 'M4 32', y = 32;
      for (let i=1;i<K.length;i++){ const [x0,y0] = K[i-1], [x1,y1] = K[i];
        if (x >= x1){ d += 'L'+x1+' '+y1; continue; }
        y = y0 + (y1-y0)*(x-x0)/(x1-x0); d += 'L'+x.toFixed(1)+' '+y.toFixed(1); break; }
      tr.setAttribute('d',d); dot.setAttribute('cx',x.toFixed(1)); dot.setAttribute('cy',y.toFixed(1));
      v.setAttribute('x1',x.toFixed(1)); v.setAttribute('x2',x.toFixed(1)); v.setAttribute('y1',(y+3).toFixed(1));
      dot.setAttribute('r', y===25||y===12 ? 2.4+.5*Math.sin(t*9)**2 : 2.4); };
  },
  debit(svg){ // tube qui se rétrécit : même débit Q = A·v, donc filets plus rapides dans le col
    const h = x => x<40 ? 30 : x>80 ? 12 : 30 - 9*(1-Math.cos(Math.PI*(x-40)/40));
    let dh='', db='', V=[0]; for (let x=0;x<=128;x++){ dh += (x?'L':'M')+x+' '+(18-h(x)/2).toFixed(2); db += (x?'L':'M')+x+' '+(18+h(x)/2).toFixed(2); if (x) V.push(V[x-1]+h(x)); }
    svg.append(el('path',{d:dh,fill:'none',stroke:'var(--encre-3)','stroke-width':1}), el('path',{d:db,fill:'none',stroke:'var(--encre-3)','stroke-width':1}));
    const W = V[128], Q = 300;
    const xDe = w => { let a=0, b=128; while (b-a>1){ const m=(a+b)>>1; if (V[m]<w) a=m; else b=m; } return a + (w-V[a])/((V[b]-V[a])||1); };
    const P = Array.from({length:18},(_,i)=>({w:rnd()*W,u:-.8+1.6*((i*7)%18)/17,e:el('line',{stroke:'var(--c)','stroke-width':1.3,'stroke-linecap':'round'})}));
    P.forEach(p => svg.append(p.e));
    return t => { for (const p of P){ const x = xDe((p.w + t*Q) % W), l = .25*Q/h(x), x0 = Math.max(1,x-l);
      p.e.setAttribute('x1',x0.toFixed(1)); p.e.setAttribute('y1',(18+p.u*h(x0)/2).toFixed(1));
      p.e.setAttribute('x2',x.toFixed(1)); p.e.setAttribute('y2',(18+p.u*h(x)/2).toFixed(1)); } };
  },
  dipole(svg){ // dipôle : lignes de champ de + vers −, charges d’essai poussées le long de E (F = qE)
    const A=[40,18], B=[88,18], L=[];
    const E = (x,y) => { const ax=x-A[0], ay=y-A[1], bx=x-B[0], by=y-B[1], ra=(ax*ax+ay*ay)**1.5, rb=(bx*bx+by*by)**1.5;
      return [ax/ra - bx/rb, ay/ra - by/rb]; };
    const trace = a => { let x=A[0]+4.5*Math.cos(a), y=A[1]+4.5*Math.sin(a); const p=[[x,y]];
      for (let k=0;k<260;k++){ const [ex,ey]=E(x,y), n=Math.hypot(ex,ey)||1; x+=ex/n; y+=ey/n;
        if (y<1.5||y>34.5||x<1.5||x>126.5) break; p.push([x,y]); if (Math.hypot(x-B[0],y-B[1])<4.5) return {p,ok:true}; }
      return {p,ok:false}; };
    const chemin = p => 'M'+p.map(q => q[0].toFixed(1)+' '+q[1].toFixed(1)).join('L');
    for (const a of [0,.55,-.55,1.15,-1.15,1.85,-1.85,2.6,-2.6,Math.PI]){ const l = trace(a); L.push(l);
      svg.append(el('path',{d:chemin(l.p),fill:'none',stroke:'var(--c)','stroke-width':.9,opacity:.5}));
      if (!l.ok) svg.append(el('path',{d:chemin(l.p.map(q=>[128-q[0],q[1]])),fill:'none',stroke:'var(--c)','stroke-width':.9,opacity:.5})); }
    svg.append(el('circle',{cx:A[0],cy:18,r:3.2,fill:'var(--c)'}), el('path',{d:'M38.2 18H41.8M40 16.2V19.8',stroke:'var(--papier)','stroke-width':1}),
               el('circle',{cx:B[0],cy:18,r:3.2,fill:'var(--papier)',stroke:'var(--encre)','stroke-width':1}), el('path',{d:'M86.2 18H89.8',stroke:'var(--encre)','stroke-width':1}));
    const D = [0,1,2,3,4].map(i => ({p:L[i].p, k:(.15+i*.37)%1, e:el('circle',{r:1.6,fill:'var(--encre)'})}));
    D.forEach(d => svg.append(d.e));
    return t => D.forEach(d => { const s = (t*.22 + d.k) % 1, q = d.p[Math.floor(s*(d.p.length-1))];
      d.e.setAttribute('cx',q[0].toFixed(1)); d.e.setAttribute('cy',q[1].toFixed(1)); });
  },
  rc(svg){ // écran d’oscilloscope : créneau appliqué, tension du condensateur en exponentielles de constante τ
    const T=64, H=32, tau=7, a=Math.exp(-H/tau), Vh=1/(1+a), Vb=a/(1+a), Y = v => 30 - 24*v;
    svg.append(el('line',{x1:2,x2:126,y1:Y(.632),y2:Y(.632),stroke:'var(--trait)','stroke-dasharray':'2 3'}));
    const e = el('path',{fill:'none',stroke:'var(--encre-3)','stroke-width':.8,opacity:.6});
    const s = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.3});
    svg.append(e, s);
    return t => { const o = t*16, ph = x => (((x - o) % T) + T) % T;
      let ds = '';
      for (let x=2;x<=126;x+=2){ const u = ph(x), v = u<H ? 1-(1-Vb)*Math.exp(-u/tau) : Vh*Math.exp(-(u-H)/tau); ds += (x>2?'L':'M')+x+' '+Y(v).toFixed(2); }
      let haut = ph(2) < H, de = 'M2 '+Y(haut?1:0);
      for (let x = 2 + ((H - ph(2) % H) % H || H); x < 126; x += H){ de += 'L'+x.toFixed(1)+' '+Y(haut?1:0)+'L'+x.toFixed(1)+' '+Y(haut?0:1); haut = !haut; }
      de += 'L126 '+Y(haut?1:0); e.setAttribute('d',de); s.setAttribute('d',ds); };
  },
  refraction(svg){ // dioptre : le rayon se rapproche de la normale dans le milieu plus réfringent (n₂ = 1,5 n₁)
    const n=1.5, O=[64,18], r=7;
    svg.append(el('rect',{x:1,y:18,width:126,height:17,fill:'var(--c)',opacity:.08}),
               el('line',{x1:1,x2:127,y1:18,y2:18,stroke:'var(--encre-3)','stroke-width':1}),
               el('line',{x1:64,x2:64,y1:1,y2:35,stroke:'var(--encre-3)','stroke-width':.8,'stroke-dasharray':'2 2'}));
    const i = el('line',{x2:64,y2:18,stroke:'var(--c)','stroke-width':1.2}), f = el('line',{x1:64,y1:18,stroke:'var(--c)','stroke-width':1.2});
    const g = el('line',{x1:64,y1:18,y2:1,stroke:'var(--c)','stroke-width':.9,opacity:.3});
    const a1 = el('path',{fill:'none',stroke:'var(--encre-3)','stroke-width':.8}), a2 = el('path',{fill:'none',stroke:'var(--encre-3)','stroke-width':.8});
    const D = [0,.5].map(k => ({k, e:el('circle',{r:1.8,fill:'var(--encre)'})}));
    svg.append(g, i, f, a1, a2); D.forEach(d => svg.append(d.e));
    return t => { const t1 = .95 + .3*Math.sin(t*.7), t2 = Math.asin(Math.sin(t1)/n);
      const x0 = 64 - 17*Math.tan(t1), x2 = 64 + 17*Math.tan(t2), L1 = Math.hypot(64-x0,17), L2 = Math.hypot(x2-64,17);
      i.setAttribute('x1',x0.toFixed(1)); i.setAttribute('y1',1); f.setAttribute('x2',x2.toFixed(1)); f.setAttribute('y2',35);
      g.setAttribute('x2',(128-x0).toFixed(1));
      a1.setAttribute('d','M64 '+(18-r)+'A'+r+' '+r+' 0 0 0 '+(64-r*Math.sin(t1)).toFixed(2)+' '+(18-r*Math.cos(t1)).toFixed(2));
      a2.setAttribute('d','M64 '+(18+r)+'A'+r+' '+r+' 0 0 0 '+(64+r*Math.sin(t2)).toFixed(2)+' '+(18+r*Math.cos(t2)).toFixed(2));
      for (const d of D){ const s = ((t*.45 + d.k) % 1)*(L1 + n*L2); let x, y;
        if (s < L1){ x = x0 + (64-x0)*s/L1; y = 1 + 17*s/L1; } else { const q = (s-L1)/(n*L2); x = 64 + (x2-64)*q; y = 18 + 17*q; }
        d.e.setAttribute('cx',x.toFixed(1)); d.e.setAttribute('cy',y.toFixed(1)); } };
  },
  noyau(svg){ // noyau serré de nucléons ; une particule α s’en échappe
    const cx=22, N=[];
    svg.append(el('circle',{cx,cy:18,r:13,fill:'none',stroke:'var(--trait)'}),
               el('line',{x1:37,x2:126,y1:18,y2:18,stroke:'var(--trait)','stroke-dasharray':'1 3'}));
    for (let i=0;i<14;i++){ const r=2.5*Math.sqrt(i), a=i*2.39996, e=el('circle',{r:1.9,fill:i%2?'var(--encre-3)':'var(--c)'});
      N.push({x:cx+r*Math.cos(a),y:18+r*Math.sin(a),e}); svg.append(e); }
    const al = el('g',{}); [[-1.5,-1.5],[1.5,-1.5],[-1.5,1.5],[1.5,1.5]].forEach(([x,y],i)=>al.append(el('circle',{cx:x,cy:y,r:1.5,fill:(i===0||i===3)?'var(--c)':'var(--encre-3)'})));
    svg.append(al);
    return (t, actif) => { const u=((t+.6)/2.2)%1, x=30+92*Math.pow(u,1.2);
      al.setAttribute('transform','translate('+x.toFixed(1)+' 18)'); al.setAttribute('opacity',Math.min(1,u/.08,(1-u)/.15).toFixed(2));
      const k = actif?.35:0; // agitation du noyau au survol
      N.forEach((n,i)=>{ n.e.setAttribute('cx',(n.x+k*Math.sin(t*9+i*1.7)).toFixed(2)); n.e.setAttribute('cy',(n.y+k*Math.cos(t*8+i*2.3)).toFixed(2)); }); };
  },
  raies(svg){ // niveaux d’énergie, désexcitation, photon, raie du spectre
    const Y=[32,18,11,7,5], X=[73,97.5,111.5,118.5], L=[9,6.3,4.8,4];
    Y.forEach(y=>svg.append(el('line',{x1:4,x2:34,y1:y,y2:y,stroke:y===32?'var(--encre-3)':'var(--trait)','stroke-width':y===32?1.1:.8})));
    const fl = el('line',{x1:19,x2:19,stroke:'var(--c)','stroke-width':.8,'stroke-dasharray':'1.5 1.5'});
    const ph = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.1});
    const R = X.map(x=>el('line',{x1:x,x2:x,y1:5,y2:31,stroke:'var(--c)','stroke-width':1.2}));
    const e = el('circle',{cx:19,r:2.2,fill:'var(--c)'});
    svg.append(el('line',{x1:68,x2:124,y1:33,y2:33,stroke:'var(--trait)'}), ...R, fl, ph, e);
    return t => { const s=(t+2.53)/1.8, k=Math.floor(s)%4, u=s%1, yh=Y[k+1];
      const ye = u<.15 ? 32-(32-yh)*u/.15 : u<.35 ? yh : u<.45 ? yh+(32-yh)*(u-.35)/.1 : 32;
      e.setAttribute('cy',ye.toFixed(2));
      fl.setAttribute('y1',yh); fl.setAttribute('y2',32); fl.setAttribute('opacity',u>.3&&u<.6?.8:0);
      const c = 38+(u-.4)/.45*28; let d='';
      for (let x=36;x<=66;x++){ const g=Math.exp(-(((x-c)/5)**2)); d+=(x>36?'L':'M')+x+' '+(18-5*g*Math.sin(2*Math.PI*(x-c)/L[k])).toFixed(2); }
      ph.setAttribute('d',d); ph.setAttribute('opacity',u<.4||u>.88?0:Math.min(1,(.88-u)/.06).toFixed(2));
      R.forEach((r,j)=>{ let o=.3; if (j===k&&u>.82) o=1; else if (j===(k+3)%4&&u<.4) o=.3+.7*(1-u/.4); r.setAttribute('opacity',o.toFixed(2)); }); };
  },
  liaison(svg){ // tétraèdre (VSEPR) qui tourne lentement ; règle ~ une longueur de liaison
    const L=14.5, q=Math.sqrt(8)/3, V=[[0,1,0]];
    for (let k=0;k<3;k++){ const a=2*Math.PI*k/3; V.push([q*Math.cos(a),-1/3,q*Math.sin(a)]); }
    svg.append(el('path',{d:'M56.75 32V34H71.25V32',fill:'none',stroke:'var(--trait)'}));
    const B = V.map(()=>el('line',{x1:64,y1:18,stroke:'var(--encre-3)','stroke-width':1}));
    const A = V.map(()=>el('circle',{fill:'var(--encre)'}));
    svg.append(...B, el('circle',{cx:64,cy:18,r:3.2,fill:'var(--c)'}), ...A);
    const ct=Math.cos(.35), st=Math.sin(.35);
    return t => { const f=t*.9, c=Math.cos(f), s=Math.sin(f);
      V.forEach(([x,y,z],i)=>{ const x1=c*x+s*z, z1=-s*x+c*z, y2=ct*y-st*z1, z2=st*y+ct*z1;
        const X=(64+L*x1).toFixed(2), Y=(18-L*y2).toFixed(2);
        B[i].setAttribute('x2',X); B[i].setAttribute('y2',Y); B[i].setAttribute('opacity',(.55+.35*z2).toFixed(2));
        A[i].setAttribute('cx',X); A[i].setAttribute('cy',Y); A[i].setAttribute('r',(2+.5*z2).toFixed(2)); A[i].setAttribute('opacity',(.6+.4*z2).toFixed(2)); }); };
  },
  mole(svg){ // compter en pesant : les atomes s’ajoutent jusqu’à l’équilibre
    const S=[]; for (let r=0;r<4;r++) for (let j=0;j<4-r;j++) S.push([(j-(3-r)/2)*3.6, -1.9-r*3.1]);
    svg.append(el('path',{d:'M64 13L58.5 33H69.5Z',fill:'none',stroke:'var(--encre-3)','stroke-width':1}),
               el('line',{x1:52,x2:76,y1:33.5,y2:33.5,stroke:'var(--trait)'}));
    const ba = el('line',{stroke:'var(--encre)','stroke-width':1.1});
    const P = [0,1].map(()=>['line','line','line'].map(n=>el(n,{stroke:'var(--encre-3)','stroke-width':.8})));
    const w = el('rect',{width:10,height:8,fill:'var(--encre-3)'});
    const A = S.map(()=>el('circle',{r:1.6,fill:'var(--c)'})), ch = el('circle',{r:1.6,fill:'var(--c)'});
    svg.append(ba, ...P.flat(), w, ...A, ch);
    return t => { const u=((t+3.3)/7)%1, c=Math.min(10,u/.72*10), k=Math.floor(c), f=c-k;
      const m = k<10 ? k-1+Math.min(1,f/.25) : 10, th=-.12*(1-Math.max(0,m)/10), co=Math.cos(th), si=Math.sin(th);
      const E = [[64-34*co,13+34*si],[64+34*co,13-34*si]];
      ba.setAttribute('x1',E[0][0].toFixed(2)); ba.setAttribute('y1',E[0][1].toFixed(2)); ba.setAttribute('x2',E[1][0].toFixed(2)); ba.setAttribute('y2',E[1][1].toFixed(2));
      E.forEach(([x,y],i)=>{ const [h1,h2,d]=P[i], yd=(y+13).toFixed(2);
        h1.setAttribute('x1',x.toFixed(2)); h1.setAttribute('y1',y.toFixed(2)); h1.setAttribute('x2',(x-11).toFixed(2)); h1.setAttribute('y2',yd);
        h2.setAttribute('x1',x.toFixed(2)); h2.setAttribute('y1',y.toFixed(2)); h2.setAttribute('x2',(x+11).toFixed(2)); h2.setAttribute('y2',yd);
        d.setAttribute('x1',(x-11).toFixed(2)); d.setAttribute('x2',(x+11).toFixed(2)); d.setAttribute('y1',yd); d.setAttribute('y2',yd); });
      w.setAttribute('x',(E[1][0]-5).toFixed(2)); w.setAttribute('y',(E[1][1]+5).toFixed(2));
      const fo = u>.93 ? (1-u)/.07 : 1, [lx,ly]=E[0];
      A.forEach((a,i)=>{ a.setAttribute('cx',(lx+S[i][0]).toFixed(2)); a.setAttribute('cy',(ly+13+S[i][1]).toFixed(2)); a.setAttribute('opacity',i<k?fo.toFixed(2):0); });
      if (k<10){ const yt=ly+13+S[k][1]; ch.setAttribute('cx',(lx+S[k][0]).toFixed(2)); ch.setAttribute('cy',(2+(yt-2)*f*f).toFixed(2)); ch.setAttribute('opacity',1); }
      else ch.setAttribute('opacity',0); };
  },
  barriere(svg){ // profil réactionnel : agitation thermique, franchissement de Ea
    const Y = s => 27+3*Math.tanh((s-.5)*7)-18*Math.exp(-(((s-.5)/.11)**2))-260*(Math.max(0,.18-s)**2+Math.max(0,s-.82)**2);
    let d=''; for (let x=4;x<=124;x+=2) d+=(x>4?'L':'M')+x+' '+Y((x-4)/120).toFixed(2);
    svg.append(el('line',{x1:64,x2:64,y1:Y(.5).toFixed(2),y2:Y(.2).toFixed(2),stroke:'var(--encre-3)','stroke-width':.8,'stroke-dasharray':'1.5 2'}),
               el('line',{x1:22,x2:66,y1:Y(.2).toFixed(2),y2:Y(.2).toFixed(2),stroke:'var(--trait)','stroke-dasharray':'1.5 2'}),
               el('path',{d,fill:'none',stroke:'var(--encre-3)','stroke-width':1.1}));
    const b = el('circle',{r:2.4,fill:'var(--c)'}); svg.append(b);
    const ez = v => v<.5 ? 2*v*v : 1-2*(1-v)**2;
    return t => { const u=((t+2.8)/5)%1; let s;
      if (u<.6) s=.2+(.04+.1*u/.6)*Math.sin(2*Math.PI*u*6.25/.6);
      else if (u<.8) s=.34+.46*ez((u-.6)/.2);
      else s=.8+.025*Math.sin((u-.8)*40)*Math.exp(-(u-.8)*12);
      b.setAttribute('cx',(4+s*120).toFixed(2)); b.setAttribute('cy',(Y(s)-2.6).toFixed(2));
      b.setAttribute('opacity',Math.min(1,u/.04,(1-u)/.06).toFixed(2)); };
  },
  titrage(svg){ // courbe de titrage : saut de pH à l’équivalence, l’indicateur vire
    const ve=.6, n=Math.asinh(20), Y = v => 19-13*Math.asinh((v-ve)/.02)/n, X = v => 6+v*116;
    let d=''; for (let i=0;i<=58;i++){ const v=i/58; d+=(i?'L':'M')+X(v).toFixed(2)+' '+Y(v).toFixed(2); }
    svg.append(el('line',{x1:X(ve),x2:X(ve),y1:2,y2:34,stroke:'var(--trait)','stroke-dasharray':'1.5 2'}),
               el('path',{d,fill:'none',stroke:'var(--trait)','stroke-width':1}));
    const p = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2}), o = el('circle',{r:2.4});
    svg.append(p, o);
    return t => { const u=((t+3.4)/5)%1, w=Math.min(1,u/.85); let q='';
      for (let i=0;i<=58;i++){ const v=Math.min(w,i/58); q+=(i?'L':'M')+X(v).toFixed(2)+' '+Y(v).toFixed(2); if (i/58>=w) break; }
      p.setAttribute('d',q); o.setAttribute('cx',X(w).toFixed(2)); o.setAttribute('cy',Y(w).toFixed(2));
      o.setAttribute('fill',w>ve?'var(--c)':'var(--encre-3)'); const a=Math.min(1,(1-u)/.05).toFixed(2); p.setAttribute('opacity',a); o.setAttribute('opacity',a); };
  },
  membrane(svg){ // bicouche coupée par un canal : les ions descendent leur gradient un à un
    const tete = (y,x1,x2) => el('line',{x1,x2,y1:y,y2:y,stroke:'var(--encre-3)','stroke-width':2.2,'stroke-linecap':'round','stroke-dasharray':'0 4.5'});
    for (const [a,b] of [[3,56],[72,125]]) svg.append(tete(13,a,b), tete(23,a,b),
      el('line',{x1:a,x2:b,y1:16,y2:16,stroke:'var(--trait)'}), el('line',{x1:a,x2:b,y1:20,y2:20,stroke:'var(--trait)'}));
    svg.append(el('rect',{x:58,y:11,width:4,height:14,rx:1.5,fill:'none',stroke:'var(--encre)','stroke-width':1}),
               el('rect',{x:66,y:11,width:4,height:14,rx:1.5,fill:'none',stroke:'var(--encre)','stroke-width':1}));
    const I = Array.from({length:9},()=>({a:8+rnd()*112,b:8+rnd()*112,e:el('circle',{r:1.8,fill:'var(--c)'})}));
    I.forEach(p => svg.append(p.e));
    return t => I.forEach((p,i)=>{ const s = (t*.2 + i/9) % 1; let x, y;
      if (s<.55){ const k = s/.55; x = p.a + (64-p.a)*k*k; y = 4 + 5*k; }      // attente au-dessus, plus dense
      else if (s<.65){ x = 64; y = 9 + 18*(s-.55)/.1; }                           // passage dans le canal
      else { const k = (s-.65)/.35; x = 64 + (p.b-64)*Math.sqrt(k); y = 27 + 6*k; } // dispersion en dessous
      p.e.setAttribute('cx',x.toFixed(1)); p.e.setAttribute('cy',y.toFixed(1));
      p.e.setAttribute('opacity',Math.min(1, s/.08, (1-s)/.2).toFixed(2)); });
  },
  potentiel(svg){ // oscilloscope : repos, seuil franchi, pic, hyperpolarisation, retour
    svg.append(el('line',{x1:0,x2:128,y1:21,y2:21,stroke:'var(--trait)','stroke-dasharray':'2 3'}));
    const p = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2,'stroke-linejoin':'round'});
    const dot = el('circle',{cx:124,r:2,fill:'var(--c)'}); svg.append(p,dot);
    const v = u => { const s = u-20; if (s<0) return 0;   // u : px dans une période de 64
      if (s<3) return .26*(s/3)**2; if (s<6) return .26 + .74*(s-3)/3;
      if (s<11) return 1 - 1.2*(s-6)/5; return -.2*Math.exp(-(s-11)/6); };
    let sh = 0; const y = x => 27 - 23*v(((x + sh) % 64 + 64) % 64);
    return t => { sh = Math.round(t*24) % 64; let d=''; for (let x=0;x<=128;x++) d += (x?'L':'M')+x+' '+y(x).toFixed(2);
      p.setAttribute('d',d); dot.setAttribute('cy',y(124).toFixed(2)); };
  },
  turbine(svg){ // ATP synthase : les protons font tourner le rotor, chaque tiers de tour libère un ATP
    const cx=30, cy=12;
    svg.append(el('line',{x1:0,x2:128,y1:25,y2:25,stroke:'var(--trait)'}), el('line',{x1:0,x2:128,y1:31,y2:31,stroke:'var(--trait)'}),
      el('rect',{x:cx-9,y:23,width:18,height:10,rx:2,fill:'var(--papier)',stroke:'var(--encre-3)'}),
      el('line',{x1:cx,x2:cx,y1:20,y2:23,stroke:'var(--encre-3)'}),
      el('circle',{cx,cy,r:8,fill:'var(--papier)',stroke:'var(--encre-3)'}));
    const R = [0,1,2].map(()=>el('line',{x1:cx,y1:cy,stroke:'var(--encre)','stroke-width':1}));
    const axe = el('circle',{r:1.8,fill:'var(--c)'});
    const H = [0,1,2].map(()=>el('circle',{cx:cx-5,r:1.5,fill:'var(--c)'}));
    const A = [0,1,2].map(()=>{ const g = el('g',{});
      g.append(el('circle',{cx:0,cy:0,r:2.2,fill:'none',stroke:'var(--encre)','stroke-width':1}));
      for (let j=1;j<=3;j++) g.append(el('circle',{cx:1.4+j*3.2,cy:0,r:1.3,fill:'var(--c)'}));
      return g; });
    svg.append(...R, axe, ...H, ...A);
    return t => { const a = (t*2) % (2*Math.PI);
      R.forEach((l,k)=>{ const b = a + k*2*Math.PI/3; l.setAttribute('x2',(cx+7*Math.cos(b)).toFixed(2)); l.setAttribute('y2',(cy+7*Math.sin(b)).toFixed(2)); });
      axe.setAttribute('cx',(cx+4*Math.cos(a)).toFixed(2)); axe.setAttribute('cy',(cy+4*Math.sin(a)).toFixed(2));
      H.forEach((h,k)=>{ const s = (t*.95 + k/3) % 1; h.setAttribute('cy',(35 - 14*s).toFixed(1)); h.setAttribute('opacity',Math.min(1,s/.15,(1-s)/.25).toFixed(2)); });
      A.forEach((g,k)=>{ const s = (a/(2*Math.PI) + k/3) % 1;
        g.setAttribute('transform','translate('+(cx+14+s*68).toFixed(1)+' '+(cy+3*s).toFixed(1)+')'); g.setAttribute('opacity',Math.sin(Math.PI*s).toFixed(2)); }); };
  },
  code(svg){ // la polymérase lit l’ADN, l’ARN s’allonge, la protéine gagne un grain par codon
    svg.append(el('line',{x1:4,x2:62,y1:4,y2:4,stroke:'var(--encre-3)'}), el('line',{x1:4,x2:62,y1:12,y2:12,stroke:'var(--encre-3)'}),
               el('line',{x1:4.5,x2:62,y1:8,y2:8,stroke:'var(--trait)','stroke-width':7,'stroke-dasharray':'1 3'}));
    const g = el('g',{}), arn = el('line',{x1:4,y1:21,y2:21,stroke:'var(--c)','stroke-width':1.2}),
      bases = el('line',{x1:4.5,y1:18.5,y2:18.5,stroke:'var(--c)','stroke-width':4,'stroke-dasharray':'1 3',opacity:.5}),
      tete = el('circle',{cy:8,r:4.5,fill:'none',stroke:'var(--c)','stroke-width':1.1}),
      ch = el('path',{fill:'none',stroke:'var(--encre-3)','stroke-width':1});
    const P = Array.from({length:9},(_,i)=>({x:74+i*6,y:20+7*Math.sin(i*.9),e:el('circle',{cx:74+i*6,cy:(20+7*Math.sin(i*.9)).toFixed(2),r:2.2,fill:'var(--c)'})}));
    g.append(arn, bases, ch, ...P.map(p=>p.e)); svg.append(g, tete);
    return t => { const s = (t*.18 + .48) % 1, hx = 4 + s*58, n = Math.min(9, Math.floor(s*10.5)), o = Math.min(1, s/.05, (1-s)/.08).toFixed(2);
      arn.setAttribute('x2',hx.toFixed(1)); bases.setAttribute('x2',hx.toFixed(1)); tete.setAttribute('cx',hx.toFixed(1));
      g.setAttribute('opacity',o); tete.setAttribute('opacity',o);
      let d=''; P.forEach((p,i)=>{ p.e.setAttribute('opacity',i<n?1:0); if (i<n) d += (i?'L':'M')+p.x+' '+p.y.toFixed(2); });
      ch.setAttribute('d',d||'M0 0'); };
  },
  helice(svg){ // fourche de réplication : la double hélice s’ouvre, chaque brin reçoit son complément
    const g = el('g',{}), ech = el('path',{fill:'none',stroke:'var(--trait)','stroke-width':1});
    const A = el('path',{fill:'none',stroke:'var(--encre-3)','stroke-width':1}), B = el('path',{fill:'none',stroke:'var(--encre-3)','stroke-width':1});
    const A2 = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2}), B2 = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2});
    const f = el('circle',{cy:18,r:1.8,fill:'var(--c)'});
    g.append(ech, A, B, A2, B2, f); svg.append(g);
    const sm = u => u<=0?0:u>=1?1:u*u*(3-2*u);
    return t => { const s = (t*.1 + .5) % 1, xf = -10 + s*148, w = t*1.5 % (2*Math.PI);
      const pt = x => { const k = sm((xf-x)/14), d = 9*k, a = 7 - 3.5*k, q = a*Math.sin(x/6 - w);
        return [18-d+q, 18+d-q, 18-d-q, 18+d+q]; };       // A, B, A′, B′
      let da='', db='', da2='', db2='', dr='';
      for (let x=0;x<=128;x+=2){ const [ya,yb,ya2,yb2] = pt(x), m = x?'L':'M';
        da += m+x+' '+ya.toFixed(2); db += m+x+' '+yb.toFixed(2);
        if (x<xf){ da2 += (da2?'L':'M')+x+' '+ya2.toFixed(2); db2 += (db2?'L':'M')+x+' '+yb2.toFixed(2); }
        if (x%4===2) dr += x<xf ? 'M'+x+' '+ya.toFixed(1)+'V'+ya2.toFixed(1)+'M'+x+' '+yb.toFixed(1)+'V'+yb2.toFixed(1) : 'M'+x+' '+ya.toFixed(1)+'V'+yb.toFixed(1); }
      A.setAttribute('d',da); B.setAttribute('d',db); A2.setAttribute('d',da2||'M0 0'); B2.setAttribute('d',db2||'M0 0'); ech.setAttribute('d',dr);
      f.setAttribute('cx',Math.max(1,Math.min(127,xf)).toFixed(1)); f.setAttribute('opacity',xf>0&&xf<128?1:0);
      g.setAttribute('opacity',Math.min(1, s/.05, (1-s)/.05).toFixed(2)); };
  },
  consigne(svg){ // rétroaction : la grandeur rejoint chaque nouvelle consigne en oscillant, de moins en moins
    const c = el('path',{fill:'none',stroke:'var(--encre-3)','stroke-width':1,'stroke-dasharray':'2 2'});
    const r = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2});
    const dot = el('circle',{cx:124,r:2,fill:'var(--c)'}); svg.append(c, r, dot);
    let sh = 0;
    const at = x => { const u = ((x + sh) % 64 + 64) % 64, haut = u<32, z = haut?u:u-32, L = haut?11:25, L0 = haut?25:11;
      return [L, L + (L0-L)*Math.exp(-z/7)*Math.cos(z/3.2)]; };
    return t => { sh = (t*20) % 64; let dc='', dr='';
      for (let x=0;x<=128;x++){ const [L,y] = at(x), m = x?'L':'M'; dc += m+x+' '+L; dr += m+x+' '+y.toFixed(2); }
      c.setAttribute('d',dc); r.setAttribute('d',dr); dot.setAttribute('cy',at(124)[1].toFixed(2)); };
  },
  pouls(svg){ // pression artérielle : un battement par seconde, encoche dicrote
    const P = u => 19*Math.exp(-(((u-.14)/(u<.14?.05:.12))**2)) + 4*Math.exp(-(((u-.42)/.06)**2)) + 6*(1-u);
    svg.append(el('line',{x1:0,x2:128,y1:31,y2:31,stroke:'var(--trait)'}),
               el('line',{x1:0,x2:128,y1:20,y2:20,stroke:'var(--trait)','stroke-dasharray':'1 3'}));
    const p = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2,'stroke-linejoin':'round'});
    const dot = el('circle',{cx:118,r:2.2,fill:'var(--c)'}); svg.append(p, dot);
    const y = x => 31 - P((((x/50) % 1) + 1) % 1);
    return t => { const s = t*50; let d='';
      for (let x=2;x<=118;x+=1.5){ d += (x>2?'L':'M')+x+' '+y(x+s).toFixed(2); }
      p.setAttribute('d',d); dot.setAttribute('cy',y(118+s).toFixed(2)); };
  },
  immun(svg){ // titre d’anticorps : réponse primaire faible, secondaire forte et durable
    const b = (d,r) => d>0 ? (d/r)*Math.exp(1-d/r) : 0;
    const h = x => 7*b(x-10,16) + 26*b(x-62,14), y = x => 33 - h(x);
    svg.append(el('line',{x1:2,x2:126,y1:33.5,y2:33.5,stroke:'var(--trait)'}));
    for (const x of [10,62]) svg.append(el('line',{x1:x,x2:x,y1:4,y2:33,stroke:'var(--encre-3)','stroke-width':.8,'stroke-dasharray':'1 2'}),
      el('path',{d:`M${x-2.2} 1.5h4.4l-2.2 3z`,fill:'var(--encre-3)'}));
    const p = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2});
    const dot = el('circle',{r:2.2,fill:'var(--c)'}); svg.append(p, dot);
    const trace = X => { let d=''; for (let x=2;x<=X;x+=2) d += (x>2?'L':'M')+x+' '+y(x).toFixed(2); p.setAttribute('d',d);
      dot.setAttribute('cx',X); dot.setAttribute('cy',y(X).toFixed(2)); };
    return (t, actif) => trace(actif ? 4 + Math.min(122, (t*28) % 150) : 124);
  },
  derive(svg){ // dérive génétique : fréquences alléliques (Wright-Fisher, 2N = 16), fixation en 0 ou 1
    const L = 6, S = 31, X = i => 2.5 + i*4, Y = p => (33 - 30*p).toFixed(2);
    svg.append(el('line',{x1:2,x2:126,y1:3,y2:3,stroke:'var(--trait)'}), el('line',{x1:2,x2:126,y1:33,y2:33,stroke:'var(--trait)'}),
               el('line',{x1:2,x2:126,y1:18,y2:18,stroke:'var(--trait)','stroke-dasharray':'1 3'}));
    const E = Array.from({length:L},(_,j)=>el('path',{fill:'none',stroke:'var(--c)','stroke-width':1,opacity:(.35+j*.12).toFixed(2),'stroke-linejoin':'round'}));
    E.forEach(e => svg.append(e));
    const tire = () => Array.from({length:L},()=>{ const q=[.5]; for (let i=1;i<=S;i++){ const p=q[i-1]; let k=0;
      for (let n=0;n<16;n++) if (rnd()<p) k++; q.push(k/16); } return q; });
    const base = tire(); let F = base, t0 = null, cyc = 0;
    const trace = n => E.forEach((e,j)=>{ let d=''; for (let i=0;i<=n;i++) d += (i?'L':'M')+X(i)+' '+Y(F[j][i]); e.setAttribute('d',d); });
    return (t, actif) => {
      if (!actif){ F = base; t0 = null; cyc = 0; return trace(S); }
      if (t0 === null) t0 = t;
      const u = (t-t0)/4.5, k = Math.floor(u); if (k !== cyc){ cyc = k; F = tire(); }
      trace(Math.min(S, Math.floor((u-k)*1.25*S))); };
  },
  logistique(svg){ // croissance logistique vers la capacité K
    const N = x => 1/(1+Math.exp(-.085*(x-52))), y = x => (32 - 26*N(x)).toFixed(2);
    svg.append(el('line',{x1:2,x2:126,y1:32.5,y2:32.5,stroke:'var(--trait)'}),
               el('line',{x1:2,x2:126,y1:6,y2:6,stroke:'var(--encre-3)','stroke-width':.8,'stroke-dasharray':'3 2'}));
    let d=''; for (let x=2;x<=126;x+=2) d += (x>2?'L':'M')+x+' '+y(x);
    svg.append(el('path',{d,fill:'none',stroke:'var(--trait)','stroke-width':1}));
    const p = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.3});
    const dot = el('circle',{r:2.4,fill:'var(--c)'}); svg.append(p, dot);
    return (t, actif) => { const X = actif ? 2 + Math.min(124, (t*32) % 150) : 52;
      let s=''; for (let x=2;x<X;x+=2) s += (x>2?'L':'M')+x+' '+y(x); s += (X>2?'L':'M')+X.toFixed(1)+' '+y(X);
      p.setAttribute('d',s); dot.setAttribute('cx',X.toFixed(1)); dot.setAttribute('cy',y(X)); };
  },
  automate(svg){ // automate cellulaire élémentaire, règle 30 : une cellule, un motif qui défile
    const C = 62, R = 17, p = el('path',{fill:'var(--c)'}); svg.append(p);
    const suit = r => r.map((c,i)=> r[(i+C-1)%C] ^ (c | r[(i+1)%C]));
    const germe = () => { const r = new Array(C).fill(0); r[C>>1] = 1; const g=[r]; while (g.length<R) g.push(suit(g[g.length-1])); return g; };
    let G = germe(), pas = 0, t0 = null;
    const dessine = () => { let d=''; G.forEach((r,j)=>r.forEach((c,i)=>{ if (c) d += `M${2+i*2} ${1+j*2}h1.6v1.6h-1.6z`; })); p.setAttribute('d',d); };
    dessine();
    return (t, actif) => {
      if (!actif){ if (pas){ G = germe(); pas = 0; dessine(); } t0 = null; return; }
      if (t0 === null) t0 = t;
      const n = Math.floor((t-t0)/.14); if (n <= pas) return;
      if (n - pas > 20){ G = germe(); pas = n; } // retour d’onglet : on repart du germe
      while (pas < n){ G.push(suit(G[R-1])); G.shift(); pas++; } dessine(); };
  },
  planck(svg){ // courbes de Planck ; le pic glisse le long du lieu de Wien (λ_max T = b)
    const B=34, H=29, Lp=.2014; // λ = x/128 ; pic à λT = Lp
    const y = (x,T) => { const l = x/128, lp = Lp/T;
      return B - H*T**1.5*(lp**5*(Math.exp(1/Lp)-1))/(l**5*(Math.exp(1/(l*T))-1)); };
    const courbe = T => { let d=''; for (let x=2;x<=126;x+=2) d += (x>2?'L':'M')+x+' '+y(x,T).toFixed(2); return d; };
    let w=''; for (let T=1.05;T>=.42;T-=.03) w += (w?'L':'M')+(128*Lp/T).toFixed(2)+' '+(B-H*T**1.5).toFixed(2);
    svg.append(el('line',{x1:0,x2:128,y1:34.5,y2:34.5,stroke:'var(--trait)'}),
               el('path',{d:w,fill:'none',stroke:'var(--encre-3)','stroke-width':.8,'stroke-dasharray':'1.5 2'}));
    [1,.7,.48].forEach(T => svg.append(el('path',{d:courbe(T),fill:'none',stroke:'var(--trait)','stroke-width':1})));
    const p = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.3});
    const v = el('line',{y2:34,stroke:'var(--c)','stroke-width':.8,'stroke-dasharray':'2 2',opacity:.6});
    const dot = el('circle',{r:2.2,fill:'var(--c)'});
    svg.append(p,v,dot);
    return t => { const T = .7 + .28*Math.sin(t*.9), x = 128*Lp/T, yp = B - H*T**1.5;
      p.setAttribute('d',courbe(T)); dot.setAttribute('cx',x.toFixed(2)); dot.setAttribute('cy',yp.toFixed(2));
      v.setAttribute('x1',x.toFixed(2)); v.setAttribute('x2',x.toFixed(2)); v.setAttribute('y1',(yp+3).toFixed(2)); };
  },
  etoile(svg){ // équilibre hydrostatique : gravité vers le centre, pression vers l’extérieur, fusion au cœur
    const cx=64, cy=18;
    const S = el('circle',{cx,cy,r:13,fill:'var(--c)','fill-opacity':.12,stroke:'var(--c)','stroke-width':1});
    const C = el('circle',{cx,cy,fill:'var(--c)'});
    svg.append(S,C);
    const F = Array.from({length:8},(_,k)=>({a:k*Math.PI/4+Math.PI/8, in:k%2===0,
      e:el('path',{fill:'none',stroke:k%2?'var(--c)':'var(--encre-3)','stroke-width':1,'stroke-linecap':'round'})}));
    F.forEach(f => svg.append(f.e));
    const P = [0,.5,.25,.75].map((ph,i)=>({ph, s:i<2?1:-1, dy:[-3,4,2,-4][i], e:el('circle',{r:1.5,fill:'var(--c)'})}));
    P.forEach(p => svg.append(p.e));
    const fl = (a,r0,r1) => { const c=Math.cos(a), s=Math.sin(a), x1=cx+r1*c, y1=cy+r1*s, u=r1>r0?1:-1;
      const hx = x1-u*2*c, hy = y1-u*2*s, nx = -s*1.6, ny = c*1.6;
      return 'M'+(cx+r0*c).toFixed(2)+' '+(cy+r0*s).toFixed(2)+'L'+x1.toFixed(2)+' '+y1.toFixed(2)
        +'M'+(hx+nx).toFixed(2)+' '+(hy+ny).toFixed(2)+'L'+x1.toFixed(2)+' '+y1.toFixed(2)+'L'+(hx-nx).toFixed(2)+' '+(hy-ny).toFixed(2); };
    return t => { const o = Math.sin(t*2.2);
      S.setAttribute('r',(13+.5*o).toFixed(2)); C.setAttribute('r',(2.6+.6*Math.sin(t*5)).toFixed(2));
      for (const f of F){ const l = 1.2*(f.in?o:-o); f.e.setAttribute('d', f.in ? fl(f.a,12.5+l,7.5) : fl(f.a,6.5,11.5-l)); }
      for (const p of P){ const u = (t*.35+p.ph)%1, x = cx + p.s*(16+46*u);
        p.e.setAttribute('cx',x.toFixed(2)); p.e.setAttribute('cy',(cy+p.dy*u).toFixed(2)); p.e.setAttribute('opacity',(1-u).toFixed(2)); } };
  },
  hubble(svg){ // expansion : chaque galaxie s’éloigne de nous d’autant plus vite qu’elle est loin (v = H₀ d)
    const cx=64, cy=18;
    svg.append(el('path',{d:'M61 18H67M64 15V21',stroke:'var(--encre)','stroke-width':1}));
    const G = Array.from({length:12},(_,i)=>({a:rnd()*Math.PI*2, ph:(i+rnd()*.6)/12,
      l:el('line',{stroke:'var(--c)','stroke-width':.8,opacity:.5}), e:el('circle',{r:1.6,fill:'var(--c)'})}));
    G.forEach(g => svg.append(g.l, g.e));
    return t => { for (const g of G){ const u = (t*.12+g.ph)%1, r = 9*Math.exp(1.88*u), c=Math.cos(g.a), s=.26*Math.sin(g.a); // ciel vu en biais
      const x = cx+r*c, y = cy+r*s, q = .78; // traîne ∝ r : la vitesse
      const op = Math.max(0, Math.min(1, (1-u)*8, u*5));
      g.e.setAttribute('cx',x.toFixed(2)); g.e.setAttribute('cy',y.toFixed(2)); g.e.setAttribute('opacity',op.toFixed(2));
      g.l.setAttribute('x1',(cx+q*r*c).toFixed(2)); g.l.setAttribute('y1',(cy+q*r*s).toFixed(2));
      g.l.setAttribute('x2',x.toFixed(2)); g.l.setAttribute('y2',y.toFixed(2)); g.l.setAttribute('opacity',(op*.5).toFixed(2)); } };
  },
  lumiere(svg){ // horloges à lumière : celle qui file bat plus lentement (γ = 1,25 à v = 0,6 c)
    const Y0=30.5, D=25, c=40, g=1.25, v=.6*c, T0=D/c, T1=D*g/c, X0=38, X1=120, P=(X1-X0)/v;
    const tri = s => { s %= 2; return s<1 ? s : 2-s; };
    svg.append(el('line',{x1:12,x2:12,y1:Y0,y2:Y0-D,stroke:'var(--trait)'}),
               el('line',{x1:6,x2:18,y1:4,y2:4,stroke:'var(--encre)','stroke-width':1.2}),
               el('line',{x1:6,x2:18,y1:32,y2:32,stroke:'var(--encre)','stroke-width':1.2}),
               el('line',{x1:28,x2:28,y1:2,y2:34,stroke:'var(--trait)','stroke-dasharray':'1 3'}));
    const p0 = el('circle',{cx:12,r:2,fill:'var(--c)'});
    const mh = el('line',{y1:4,y2:4,stroke:'var(--encre)','stroke-width':1.2}), mb = el('line',{y1:32,y2:32,stroke:'var(--encre)','stroke-width':1.2});
    const tr = el('path',{fill:'none',stroke:'var(--c)','stroke-width':.9,opacity:.55});
    const p1 = el('circle',{r:2,fill:'var(--c)'});
    svg.append(p0,mh,mb,tr,p1);
    return t => { p0.setAttribute('cy',(Y0-D*tri(t/T0)).toFixed(2));
      const u = (t+2.2)%P, X = X0+v*u; let d = 'M'+X0+' '+Y0;
      for (let k=1;k*T1<u;k++) d += 'L'+(X0+v*k*T1).toFixed(2)+' '+(k%2?Y0-D:Y0);
      const y = Y0-D*tri(u/T1); d += 'L'+X.toFixed(2)+' '+y.toFixed(2); tr.setAttribute('d',d);
      p1.setAttribute('cx',X.toFixed(2)); p1.setAttribute('cy',y.toFixed(2));
      for (const m of [mh,mb]){ m.setAttribute('x1',(X-6).toFixed(2)); m.setAttribute('x2',(X+6).toFixed(2)); } };
  },
  geodesique(svg){ // la masse creuse l’espace-temps ; la trajectoire libre suit la courbure
    const cx=64, cy=18, bh = x => Math.exp(-(((x-cx)/22)**2)), bv = y => Math.exp(-(((y-cy)/12)**2));
    for (const y0 of [4,11,25,32]){ let d=''; for (let x=0;x<=128;x+=4) d += (x?'L':'M')+x+' '+(y0-(y0-cy)*.5*bh(x)).toFixed(2);
      svg.append(el('path',{d,fill:'none',stroke:'var(--trait)','stroke-width':1})); }
    for (const x0 of [8,24,40,52,76,88,104,120]){ const k = .45*Math.exp(-(((x0-cx)/34)**2)); let d='';
      for (let y=1;y<=35;y+=2) d += (y>1?'L':'M')+(x0-(x0-cx)*k*bv(y)).toFixed(2)+' '+y;
      svg.append(el('path',{d,fill:'none',stroke:'var(--trait)','stroke-width':1})); }
    const Q = []; let x=1, y=12, vx=1, vy=-.15; // intégration unique de la géodésique (approx. newtonienne)
    while (x<127 && Q.length<400){ const dx=cx-x, dy=cy-y, r2=dx*dx+dy*dy+16, a=2.5/(r2*Math.sqrt(r2));
      vx += a*dx; vy += a*dy; x += vx; y += vy; Q.push([x, Math.max(2,Math.min(34,y))]); }
    svg.append(el('path',{d:'M1 12'+Q.map(q=>'L'+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(''),fill:'none',stroke:'var(--encre-3)','stroke-width':.8,'stroke-dasharray':'1.5 2'}),
               el('circle',{cx,cy,r:3.2,fill:'var(--encre)'}));
    const tr = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2,'stroke-linecap':'round'}), dot = el('circle',{r:2.2,fill:'var(--c)'});
    svg.append(tr,dot);
    return t => { const n = Q.length, i = Math.floor(((t*.22+.3)%1)*n), j = Math.max(0,i-14);
      let d=''; for (let k=j;k<=i;k++) d += (k>j?'L':'M')+Q[k][0].toFixed(1)+' '+Q[k][1].toFixed(1); tr.setAttribute('d', i>j?d:'');
      dot.setAttribute('cx',Q[i][0].toFixed(1)); dot.setAttribute('cy',Q[i][1].toFixed(1));
      dot.setAttribute('opacity',Math.min(1,i/6,(n-1-i)/6).toFixed(2)); };
  },
  paquet(svg){ // paquet d’onde : Re ψ sous son enveloppe, |ψ|² en aplat ; le paquet va et vient, la phase défile
    const dens = el('path',{fill:'var(--c)',opacity:.2,stroke:'none'});
    const env = el('path',{fill:'none',stroke:'var(--encre-3)','stroke-width':.8,'stroke-dasharray':'2 2'});
    const re = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2});
    svg.append(el('line',{x1:0,x2:128,y1:33.5,y2:33.5,stroke:'var(--trait)'}), dens, env, re);
    const k = 2*Math.PI/12, s = 13;
    return t => { const x0 = 64 + 30*Math.sin(t*.55), w = t*3.2; let dd='M2 33.5', de='', db='', dr='';
      for (let x=2;x<=126;x+=2){ const u = (x-x0)/s, a = Math.exp(-u*u/2);
        dd += 'L'+x+' '+(33.5-24*a*a).toFixed(2);
        de += (x>2?'L':'M')+x+' '+(18-12*a).toFixed(2); db += (x>2?'L':'M')+x+' '+(18+12*a).toFixed(2);
        dr += (x>2?'L':'M')+x+' '+(18-12*a*Math.cos(k*(x-x0)-w)).toFixed(2); }
      dens.setAttribute('d',dd+'L126 33.5Z'); env.setAttribute('d',de+db); re.setAttribute('d',dr); };
  },
  tunnel(svg){ // onde incidente, décroissance dans la barrière, onde transmise plus faible
    const x1 = 58, x2 = 72, k = 2*Math.PI/14, q = .075, At = Math.exp(-q*(x2-x1));
    svg.append(el('rect',{x:x1,y:4,width:x2-x1,height:30,fill:'var(--encre-3)',opacity:.12}),
               el('path',{d:`M1 34H${x1}V4H${x2}V34H127`,fill:'none',stroke:'var(--encre-3)','stroke-width':.9}),
               el('line',{x1:1,x2:127,y1:19,y2:19,stroke:'var(--trait)','stroke-dasharray':'1 3'}));
    const p = el('path',{fill:'none',stroke:'var(--c)','stroke-width':1.2}); svg.append(p);
    return t => { const w = t*3; let d='';
      for (let x=2;x<=126;x+=1){ let y;
        if (x<x1) y = Math.sin(k*x - w);
        else if (x<=x2) y = Math.exp(-q*(x-x1))*Math.sin(k*x1 - w);
        else y = At*Math.sin(k*(x-(x2-x1)) - w);
        d += (x>2?'L':'M')+x+' '+(19-10*y).toFixed(2); }
      p.setAttribute('d',d); };
  },
  spin(svg){ // Stern-Gerlach : le faisceau se scinde en deux taches, ↑ ou ↓, rien entre
    const a = 2.93, dev = x => x<44 ? 0 : x<76 ? a*((x-44)/32)**2 : a + a/16*(x-76);
    const br = s => { let d=''; for (let x=4;x<=120;x+=4) d += (x>4?'L':'M')+x+' '+(18+s*dev(x)).toFixed(2); return d; };
    svg.append(el('path',{d:br(-1),fill:'none',stroke:'var(--trait)','stroke-dasharray':'1 2'}),
               el('path',{d:br(1),fill:'none',stroke:'var(--trait)','stroke-dasharray':'1 2'}),
               el('path',{d:'M44 2H76V8L60 13.5L44 8Z',fill:'none',stroke:'var(--encre-3)','stroke-width':.9}),
               el('rect',{x:44,y:26,width:32,height:6,fill:'none',stroke:'var(--encre-3)','stroke-width':.9}),
               el('line',{x1:123.5,x2:123.5,y1:2,y2:34,stroke:'var(--encre-3)','stroke-width':1}),
               el('rect',{x:121,y:5,width:2,height:4,fill:'var(--c)'}), el('rect',{x:121,y:27,width:2,height:4,fill:'var(--c)'}),
               el('circle',{cx:4,cy:18,r:2,fill:'var(--encre-3)'}));
    const N = 8, P = Array.from({length:N},()=>el('circle',{r:1.7,fill:'var(--c)'})); P.forEach(e => svg.append(e));
    const h = (i,c) => { const v = Math.sin(i*12.9898 + c*78.233)*43758.5453; return v - Math.floor(v); };
    return t => P.forEach((e,i)=>{ const u = t*.45 + i/N, c = Math.floor(u), s = u - c, x = 6 + 114*s;
      const sg = h(i,c) < .5 ? -1 : 1;
      e.setAttribute('cx',x.toFixed(1)); e.setAttribute('cy',(18+sg*dev(x)).toFixed(1));
      e.setAttribute('opacity',Math.min(1,s*10,(1-s)*10).toFixed(2)); });
  },
};

const vivants = [];
function active(){ document.querySelectorAll('svg[data-viz]').forEach(svg => {
  const fab = VIZ[svg.dataset.viz]; if (!fab) return;
  const f = fab(svg); const ligne = svg.closest('li') || svg;
  const v = { f, actif:false }; vivants.push(v); f(0.35, false);
  if (calme) return;
  const repos = () => { v.actif = false; f(0.35, false); }; // revenir à l'image fixe
  ligne.addEventListener('pointerenter', () => { v.actif = true; boucle(); });
  ligne.addEventListener('pointerleave', repos);
  ligne.addEventListener('focusin', () => { v.actif = true; boucle(); });
  ligne.addEventListener('focusout', repos);
}); }
let tourne = false;
function boucle(){ if (tourne) return; tourne = true;
  const pas = now => { const t = now/1000; let un = false;
    for (const v of vivants) if (v.actif){ v.f(t, true); un = true; }
    if (un) requestAnimationFrame(pas); else tourne = false; };
  requestAnimationFrame(pas); }

window.LaboMicroViz = { VIZ, active };
})();
