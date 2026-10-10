/* CHAOS-BEGIN */
const Chaos = (() => {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI;
  const PENDULE = Object.freeze({g:9.81, L:1, damping:0});
  const DOUBLE = Object.freeze({g:9.81, L1:1, L2:1, m1:1, m2:1});
  const LORENZ = Object.freeze({sigma:10, rho:28, beta:8/3});
  const FEIGENBAUM = 4.66920160910299;
  const SEUILS = Object.freeze([3,3.449489742783178,3.544090359551922,3.564407266095]);
  const borne = (v,a,b) => Math.max(a, Math.min(b,v));
  const angle = v => Math.atan2(Math.sin(v),Math.cos(v));
  function mulberry32(seed=1){let a=seed>>>0;return () => {a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
  // RK4 à pas fixé : le pas d'intégration n'est jamais celui du dessin.
  function rk4(f, state, dt, params){
    if(!(dt>0))throw new RangeError('Le pas doit être positif');
    const k1=f(state,params), n=state.length;
    const avec=(k,s)=>state.map((v,i)=>v+s*k[i]);
    const k2=f(avec(k1,dt/2),params), k3=f(avec(k2,dt/2),params),k4=f(avec(k3,dt),params);
    return state.map((v,i)=>v+dt/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]));
  }
  function pendulumRHS(s, p=PENDULE){const {g=9.81,L=1,damping=0}=p;return [s[1],-g/L*Math.sin(s[0])-damping*s[1]];}
  function pendulumStep(s,dt,p=PENDULE,linear=false){return rk4(linear ? (a,q)=>[a[1],-(q.g??9.81)/(q.L??1)*a[0]-(q.damping??0)*a[1]]:pendulumRHS,s,dt,p);}
  function pendulumEnergy(s,p=PENDULE){const {g=9.81,L=1}=p;return .5*(L*s[1])**2+g*L*(1-Math.cos(s[0]));}
  function phasePortrait(params=PENDULE,grid={nx:23,ny:15,thetaMin:-PI,thetaMax:PI,omegaMin:-7,omegaMax:7}){
    const {nx=23,ny=15,thetaMin=-PI,thetaMax=PI,omegaMin=-7,omegaMax=7}=grid, vecteurs=[];
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
      const theta=thetaMin+(thetaMax-thetaMin)*i/(nx-1), omega=omegaMin+(omegaMax-omegaMin)*j/(ny-1);
      const [dx,dy]=pendulumRHS([theta,omega],params);
      vecteurs.push({theta,omega,dx,dy});
    }
    return vecteurs;
  }
  function separatrix(params=PENDULE,points=360){
    const {g=9.81,L=1}=params,out=[];
    for(let i=0;i<=points;i++){
      const theta=-PI+TAU*i/points,omega=2*Math.sqrt(g/L)*Math.cos(theta/2);
      out.push({theta,haut:omega,bas:-omega});
    }
    return out;
  }
  function periodVsAmplitude(theta0,params=PENDULE){
    const {g=9.81,L=1}=params, a=Math.abs(theta0);
    if(a>=PI) return {T:Infinity,T0:TAU*Math.sqrt(L/g),ratio:Infinity};
    const k2=Math.sin(a/2)**2,N=4096,h=PI/2/N;
    let acc=0;
    for(let i=0;i<=N;i++){
      const f=1/Math.sqrt(1-k2*Math.sin(i*h)**2);
      acc+=(i===0||i===N?1:(i%2?4:2))*f;
    }
    const T0=TAU*Math.sqrt(L/g),T=4*Math.sqrt(L/g)*h*acc/3;
    return {T,T0,ratio:T/T0};
  }
  // Pendule magnétique plan à potentiel de rappel et trois pôles adoucis.
  // Les attracteurs sont des positions d'équilibre locales, non des impacts réels.
  const AIMANTS=Object.freeze([[0,-.73],[-.632,.365],[.632,.365]]);
  function magneticRHS(s,p={}){
    const ressort=p.ressort??.65,amplitude=p.attraction??.20,hauteur=p.hauteur??.18,frein=p.frein??.38;
    let ax=-ressort*s[0]-frein*s[2],ay=-ressort*s[1]-frein*s[3];
    for(const [mx,my] of AIMANTS){const dx=mx-s[0],dy=my-s[1],r2=dx*dx+dy*dy+hauteur*hauteur,k=amplitude/(r2*Math.sqrt(r2));ax+=k*dx;ay+=k*dy;}
    return [s[2],s[3],ax,ay];
  }
  function basin(x0,y0,p={}){
    let s=[x0,y0,0,0];const dt=p.dt??.035,steps=p.steps??1400;
    for(let i=0;i<steps;i++)s=rk4(magneticRHS,s,dt,p);
    let best=Infinity,id=-1;
    AIMANTS.forEach(([x,y],i)=>{const d=Math.hypot(s[0]-x,s[1]-y);if(d<best){best=d;id=i;}});
    return id;
  }
  function basinMap(res=36,p={}){
    const nx=typeof res==='number'?res:res.nx,ny=typeof res==='number'?Math.round(res*.70):res.ny;
    const pixels=new Uint8Array(nx*ny);
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)pixels[j*nx+i]=basin(-1.7+3.4*(i+.5)/nx,-1.3+2.6*(j+.5)/ny,p);
    return {nx,ny,pixels,aimants:AIMANTS};
  }
  function logisticMap(r,x){return r*x*(1-x);}
  function orbit(r,x0=.371,n=100){const v=[x0];for(let i=0;i<n;i++)v.push(logisticMap(r,v[v.length-1]));return v;}
  function cobweb(r,x0=.371,n=60){
    let x=x0;const pts=[{x,y:0}];
    for(let i=0;i<n;i++){const y=logisticMap(r,x);pts.push({x,y},{x:y,y});x=y;}
    return pts;
  }
  function bifurcation(rMin=2.5,rMax=4,nr=540,transient=800,keep=100){
    const pts=[];
    for(let i=0;i<nr;i++){
      const r=rMin+(rMax-rMin)*i/(nr-1);let x=.371;
      for(let k=0;k<transient;k++)x=logisticMap(r,x);
      for(let k=0;k<keep;k++){x=logisticMap(r,x);pts.push({r,x});}
    }
    return pts;
  }
  function lyapunovLogistic(r,n=20000,x0=.371,transient=2000){
    let x=x0,tot=0;
    for(let i=0;i<transient;i++)x=logisticMap(r,x);
    for(let i=0;i<n;i++){
      x=logisticMap(r,x);
      tot+=Math.log(Math.max(1e-300,Math.abs(r*(1-2*x))));
    }
    return tot/n;
  }
  function detectPeriod(r,x0=.371,limit=64){
    const sequence=orbit(r,x0,1700+2*limit).slice(-2*limit);
    for(let p=1;p<=limit;p++){
      let max=0;
      for(let j=0;j<limit;j++)max=Math.max(max,Math.abs(sequence[j+limit]-sequence[j+limit-p]));
      if(max<.00015)return p;
    }
    return null;
  }
  // Résolution de l'orbite périodique par Newton, suivie de son multiplicateur.
  // L'équation de l'orbite demeure régulière lors d'un doublement (multiplicateur -1).
  function periodicPoint(r,p,seed){
    let x=seed;
    for(let n=0;n<35;n++){
      let y=x,deriv=1;
      for(let j=0;j<p;j++){deriv*=r*(1-2*y);y=logisticMap(r,y);}
      const err=y-x,den=deriv-1;
      if(Math.abs(err)<1e-13)return {x,multiplier:deriv};
      if(!Number.isFinite(den)||Math.abs(den)<1e-12)break;
      x-=err/den;
    }
    return null;
  }
  // Les seuils calculés sont les solutions du multiplicateur -1, jusqu'à la période 8.
  function doublingThresholds(){
    const out=[3];
    for(const {period:p,ancre,lo,hi} of [{period:2,ancre:3.40,lo:3.448,hi:3.451},{period:4,ancre:3.53,lo:3.543,hi:3.546},{period:8,ancre:3.558,lo:3.5635,hi:3.5653}]){
      const xs=orbit(ancre,.371,6000),seed=xs[xs.length-1];
      // Continuation de la branche périodique depuis un point stable.
      function mult(r){
        const chemin=20;let x=seed;
        for(let i=1;i<=chemin;i++){
          const a=ancre+(r-ancre)*i/chemin;
          const v=periodicPoint(a,p,x);
          if(!v)throw new Error('Continuation périodique impossible');
          x=v.x;
        }
        return periodicPoint(r,p,x).multiplier;
      }
      let a=lo,b=hi,fa=mult(a)+1,fb=mult(b)+1;
      if(fa*fb>0)throw new Error('Doublement non encadré');
      for(let i=0;i<46;i++){
        const m=(a+b)/2,fm=mult(m)+1;
        if(fm*fa<=0){b=m;fb=fm;}else{a=m;fa=fm;}
      }
      out.push((a+b)/2);
    }
    return out;
  }
  function doublePendulumRHS(s,p=DOUBLE){
    const {g=9.81,L1=1,L2=1,m1=1,m2=1}=p;
    const [a,w,b,v]=s,d=a-b,c=Math.cos(d),sn=Math.sin(d),den=2*m1+m2-m2*Math.cos(2*d);
    const acc1=(-g*(2*m1+m2)*Math.sin(a)-m2*g*Math.sin(a-2*b)-2*sn*m2*(v*v*L2+w*w*L1*c))/(L1*den);
    const acc2=2*sn*(w*w*L1*(m1+m2)+g*(m1+m2)*Math.cos(a)+v*v*L2*m2*c)/(L2*den);
    return [w,acc1,v,acc2];
  }
  function doubleStep(s,dt,p=DOUBLE){return rk4(doublePendulumRHS,s,dt,p);}
  function doubleEnergy(s,p=DOUBLE){
    const {g=9.81,L1=1,L2=1,m1=1,m2=1}=p,[a,w,b,v]=s;
    // La référence E = 0 est le point le plus bas, pour une erreur relative bien définie.
    return .5*(m1+m2)*L1*L1*w*w+.5*m2*L2*L2*v*v+m2*L1*L2*w*v*Math.cos(a-b)+(m1+m2)*g*L1*(1-Math.cos(a))+m2*g*L2*(1-Math.cos(b));
  }
  function doublePositions(s,p=DOUBLE){const {L1=1,L2=1}=p,[a,,b]=s,x1=L1*Math.sin(a),y1=L1*Math.cos(a);return {x1,y1,x2:x1+L2*Math.sin(b),y2:y1+L2*Math.cos(b)};}
  function separation(a,b,p=DOUBLE){
    const e=Math.sqrt((p.L1??1)/(p.g??9.81));
    return Math.hypot(angle(a[0]-b[0]),angle(a[2]-b[2]),e*(a[1]-b[1]),e*(a[3]-b[3]));
  }
  function lyapunovEstimate(initial=[2*PI/3,0,0,0],d0=1e-8,T=80,opts={}){
    const dt=opts.dt??.006,periode=opts.renorm??.30,p=opts.params??DOUBLE;
    const count=Math.max(1,Math.round(T/periode)),steps=Math.max(1,Math.round(periode/dt)),h=periode/steps;
    let a=initial.slice(),b=initial.slice();b[0]+=d0;
    let sum=0;const series=[];
    for(let k=0;k<count;k++){
      for(let i=0;i<steps;i++){a=doubleStep(a,h,p);b=doubleStep(b,h,p);}
      const delta=[angle(b[0]-a[0]),b[1]-a[1],angle(b[2]-a[2]),b[3]-a[3]];
      const e=Math.sqrt((p.L1??1)/(p.g??9.81)),d=Math.hypot(delta[0],delta[2],e*delta[1],e*delta[3]);
      const rapport=d/d0;sum+=Math.log(Math.max(1e-300,rapport));
      const t=(k+1)*periode;
      series.push({t,lambda:sum/t,log:sum});
      const q=d>0?d0/d:1;
      b=a.map((v,i)=>v+delta[i]*q);
    }
    return {lambda:sum/(count*periode),series,d0,T:count*periode};
  }
  function lorenzRHS(s,p=LORENZ){const {sigma=10,rho=28,beta=8/3}=p,[x,y,z]=s;return [sigma*(y-x),x*(rho-z)-y,x*y-beta*z];}
  function lorenzStep(s,dt,p=LORENZ){return rk4(lorenzRHS,s,dt,p);}
  function lorenzProjection(s,rotation=.55,inclinaison=.32){
    const [x,y,z]=s,c=Math.cos(rotation),si=Math.sin(rotation),ci=Math.cos(inclinaison),sn=Math.sin(inclinaison);
    return {x:c*x-si*y,y:sn*(si*x+c*y)-ci*(z-24),depth:ci*(si*x+c*y)+sn*(z-24)};
  }
  function poincareSection(path,rho=28){
    const plan=rho-1,points=[];
    for(let i=1;i<path.length;i++){
      const a=path[i-1],b=path[i];
      if(a[2]<plan&&b[2]>=plan){const f=(plan-a[2])/(b[2]-a[2]);points.push({x:a[0]+f*(b[0]-a[0]),y:a[1]+f*(b[1]-a[1]),z:plan});}
    }
    return points;
  }
  function lyapunovLorenz(params=LORENZ,T=220,opts={}){
    const dt=opts.dt??.01,periode=opts.renorm??.1,d0=opts.d0??1e-7,prelude=opts.prelude??25;
    let a=opts.initial?.slice()??[1,1,1],b=a.slice();b[0]+=d0;
    const steps=Math.round(periode/dt),rounds=Math.ceil((T+prelude)/periode);
    let sum=0,temps=0;
    for(let k=0;k<rounds;k++){
      for(let i=0;i<steps;i++){a=lorenzStep(a,dt,params);b=lorenzStep(b,dt,params);}
      const diff=a.map((v,i)=>b[i]-v),dist=Math.hypot(...diff);
      if(k*periode>=prelude){sum+=Math.log(Math.max(1e-300,dist/d0));temps+=periode;}
      const factor=dist>0?d0/dist:1;
      b=a.map((v,i)=>v+factor*diff[i]);
    }
    return {lambda:sum/temps,T:temps};
  }
  const forecastHorizon=(lambda,precision,seuil=1)=>lambda>0&&precision>0&&seuil>precision?Math.log(seuil/precision)/lambda:null;
  return {PI,TAU,PENDULE,DOUBLE,LORENZ,FEIGENBAUM,SEUILS,AIMANTS,borne,angle,mulberry32,rk4,
    pendulumRHS,pendulumStep,pendulumEnergy,phasePortrait,separatrix,periodVsAmplitude,
    magneticRHS,basin,basinMap,logisticMap,orbit,cobweb,bifurcation,lyapunovLogistic,detectPeriod,periodicPoint,doublingThresholds,
    doublePendulumRHS,doubleStep,doubleEnergy,doublePositions,separation,lyapunovEstimate,
    lorenzRHS,lorenzStep,lorenzProjection,poincareSection,lyapunovLorenz,forecastHorizon};
})();
/* CHAOS-END */
