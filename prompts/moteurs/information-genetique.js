/* GEN-BEGIN */
const Gen = (() => {
  'use strict';
  // Orientations : le brin codant est 5'→3', le brin matrice fourni est 3'→5'.
  // Une fonction de séquence reçoit une chaîne sans espace et refuse les bases ambiguës.
  const ALPH_DNA = 'ATCG';
  const ALPH_RNA = 'AUCG';
  const PAIRS = Object.freeze({A:'T',T:'A',C:'G',G:'C'});
  const PAIRS_RNA = Object.freeze({A:'U',T:'A',C:'G',G:'C'});
  const GENOME = Object.freeze({haploidBp:3.1e9, riseM:0.34e-9, nucleusDiameterM:6e-6, tennisDiameterM:0.067});
  const TAUX = Object.freeze({polMin:20,polMax:80,riboMin:5,riboMax:20}); // nt/s et aa/s : plages pédagogiques
  const AA = Object.freeze({
    A:{nom:'alanine',trois:'Ala',propriete:'hydrophobe'},
    R:{nom:'arginine',trois:'Arg',propriete:'chargé +'},
    N:{nom:'asparagine',trois:'Asn',propriete:'polaire'},
    D:{nom:'aspartate',trois:'Asp',propriete:'chargé −'},
    C:{nom:'cystéine',trois:'Cys',propriete:'polaire'},
    Q:{nom:'glutamine',trois:'Gln',propriete:'polaire'},
    E:{nom:'glutamate',trois:'Glu',propriete:'chargé −'},
    G:{nom:'glycine',trois:'Gly',propriete:'hydrophobe'},
    H:{nom:'histidine',trois:'His',propriete:'chargé +'},
    I:{nom:'isoleucine',trois:'Ile',propriete:'hydrophobe'},
    L:{nom:'leucine',trois:'Leu',propriete:'hydrophobe'},
    K:{nom:'lysine',trois:'Lys',propriete:'chargé +'},
    M:{nom:'méthionine',trois:'Met',propriete:'hydrophobe'},
    F:{nom:'phénylalanine',trois:'Phe',propriete:'hydrophobe'},
    P:{nom:'proline',trois:'Pro',propriete:'hydrophobe'},
    S:{nom:'sérine',trois:'Ser',propriete:'polaire'},
    T:{nom:'thréonine',trois:'Thr',propriete:'polaire'},
    W:{nom:'tryptophane',trois:'Trp',propriete:'hydrophobe'},
    Y:{nom:'tyrosine',trois:'Tyr',propriete:'polaire'},
    V:{nom:'valine',trois:'Val',propriete:'hydrophobe'}
  });
  // NCBI, table 1 (code nucléaire standard). L'ordre des bases est U,C,A,G ; la 3e varie d'abord.
  const ORDRE = 'UCAG';
  const CODES_NCBI = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
  const code = {};
  let indice = 0;
  for (const a of ORDRE) for (const b of ORDRE) for (const c of ORDRE) {
    const one = CODES_NCBI[indice++];
    code[a+b+c] = Object.freeze(one === '*' ? {one:'*',three:'Stop',stop:true} : {one,three:AA[one].trois,stop:false});
  }
  const CODE = Object.freeze(code);
  const nettoyer = (s, alphabet) => {
    if (typeof s !== 'string' || [...s.toUpperCase()].some(c => !alphabet.includes(c))) throw new RangeError('Séquence de bases non valide');
    return s.toUpperCase();
  };
  function complement(seq) { return [...nettoyer(seq, ALPH_DNA)].map(b => PAIRS[b]).join(''); }
  function reverseComplement(seq) { return complement(seq).split('').reverse().join(''); }
  function transcribe(templateStrand) { return [...nettoyer(templateStrand, ALPH_DNA)].map(b => PAIRS_RNA[b]).join(''); }
  function codingFromTemplate(templateStrand) { return complement(templateStrand); }
  function genomeMetrics(o = {}) {
    const g = {...GENOME,...o};
    const lengthHaploidM = g.haploidBp * g.riseM;
    const lengthDiploidM = 2 * lengthHaploidM;
    const compression = lengthDiploidM / g.nucleusDiameterM;
    const tennisAnalogyM = compression * g.tennisDiameterM;
    return { ...g, lengthHaploidM,lengthDiploidM,compression,tennisAnalogyM };
  }
  // Le gène modèle est entièrement fictif : 23 codons de sens et UAA (72 nt).
  const CODONS_MODELE = 'AUG GCU UUC GAA CCA GGU AAA CUC UAU GAC AGC UGG CAA GUG ACU CGA AAC GGC UCU AUA CAG UGC GGA UAA'.split(' ');
  const arnModele = CODONS_MODELE.join('');
  const GENE = Object.freeze({
    nom:'Gène modèle',promoteur:'TATAAT',terminateur:'signal de fin (stylisé)',
    coding:arnModele.replace(/U/g,'T'),
    template:complement(arnModele.replace(/U/g,'T')),
    mrna:arnModele,
    peptide:'MAFEPG KLYDSWQVTRNGSIQCG'.replace(/ /g,'')
  });
  // Début codant réel de HBB (ADN 5'→3'), Nature Education, Scitable, Genetic Mutation.
  // Le 7e codon affiché correspond au 6e résidu de la chaîne mature, sans méthionine initiatrice.
  const HBB = Object.freeze({
    normal:'ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACT',
    mutation:'ATGGTGCACCTGACTCCTGTGGAGAAGTCTGCCGTTACT',
    indexBase:20,
    codonIndex:6
  });
  function translate(mrna, frame = 0) {
    const seq = nettoyer(mrna, ALPH_RNA);
    let offset = 0, startAtAUG = false;
    if (typeof frame === 'number') offset = frame;
    else if (frame && typeof frame === 'object') { offset = frame.frame ?? 0; startAtAUG = !!frame.startAtAUG; }
    if (!Number.isInteger(offset) || offset < 0 || offset > 2) throw new RangeError('Cadre de lecture : 0, 1 ou 2');
    const start = startAtAUG ? seq.indexOf('AUG',offset) : offset;
    if (start === -1) return {one:'',three:[],aminoAcids:[],codons:[],start:-1,stop:null,complete:false,ignored:seq.length};
    const aminoAcids=[],codons=[];
    let stop=null, cursor=start;
    for (;cursor+2<seq.length;cursor+=3) {
      const triplet=seq.slice(cursor,cursor+3), aa=CODE[triplet];
      codons.push({triplet,index:cursor,aa:aa.one,three:aa.three,stop:aa.stop});
      if(aa.stop){stop=cursor;break;}
      aminoAcids.push({...aa,index:cursor,triplet});
    }
    return {one:aminoAcids.map(a=>a.one).join(''),three:aminoAcids.map(a=>a.three),aminoAcids,codons,start,stop,complete:stop!==null,ignored:Math.max(0,seq.length-(stop===null?cursor:stop+3))};
  }
  function modifier(seq, pos, operation, base) {
    const alphabet = seq.toUpperCase().includes('U') ? ALPH_RNA : ALPH_DNA;
    const s=nettoyer(seq, alphabet);
    if (!Number.isInteger(pos) || pos<0 || pos>(operation==='ins' ? s.length:s.length-1)) throw new RangeError('Position hors séquence');
    if(operation==='del') return s.slice(0,pos)+s.slice(pos+1);
    const b=nettoyer(base,alphabet);
    if(b.length!==1) throw new RangeError('Une seule base requise');
    return operation==='ins' ? s.slice(0,pos)+b+s.slice(pos):s.slice(0,pos)+b+s.slice(pos+1);
  }
  const mutate=(s,p,b)=>modifier(s,p,'mut',b);
  const insert=(s,p,b)=>modifier(s,p,'ins',b);
  const del=(s,p)=>modifier(s,p,'del');
  function classify(before, after) {
    const b = nettoyer(before, before.toUpperCase().includes('U') ? ALPH_RNA:ALPH_DNA).replace(/T/g,'U');
    const a = nettoyer(after, after.toUpperCase().includes('U') ? ALPH_RNA:ALPH_DNA).replace(/T/g,'U');
    if(b===a)return 'aucune';
    if((a.length-b.length)%3!==0)return 'décalage du cadre';
    const x=translate(b),y=translate(a);
    if(y.stop!==null && (x.stop===null || y.stop<x.stop))return 'non-sens';
    if(a.length!==b.length)return 'modification en phase';
    return x.one===y.one ? 'silencieuse':'faux-sens';
  }
  function transcriptionRun({length,rate=50,position=0}={}) {
    if(!(Number.isFinite(length) && length>=0 && Number.isFinite(rate) && rate>0))throw new RangeError('Longueur ou vitesse de transcription non valide');
    const s={length,rate,position:Math.min(length,Math.max(0,position)),t:0,finished:position>=length};
    s.step=dt=>{if(!(dt>=0))throw new RangeError('Durée négative');s.t+=dt;s.position=Math.min(length,s.position+rate*dt);s.finished=s.position>=length;return s;};
    return s;
  }
  // Tous les ribosomes parcourent le même ARNm ; espacement minimal imposé (stylisation).
  function ribosomeRun({codons,rate=10,spacingCodons=6,maximum=4}={}) {
    const n = typeof codons==='number' ? codons : Array.isArray(codons)?codons.length:Math.floor(nettoyer(codons,ALPH_RNA).length/3);
    if(!(n>=0 && rate>0 && spacingCodons>=1 && maximum>=1))throw new RangeError('Paramètres des ribosomes non valides');
    const s={codons:n,rate,spacingCodons,maximum,t:0,ribosomes:[],completed:0};
    s.launch=()=>{if(s.ribosomes.length>=maximum || s.ribosomes.some(r=>r.position<spacingCodons))return false;s.ribosomes.push({position:0});return true;};
    s.step=dt=>{
      if(!(dt>=0))throw new RangeError('Durée négative');
      s.t+=dt;
      s.ribosomes.sort((a,b)=>b.position-a.position);
      let ahead=Infinity;
      for(const r of s.ribosomes){r.position=Math.min(n,Math.min(r.position+rate*dt,ahead-spacingCodons));ahead=r.position;}
      const ending=s.ribosomes.filter(r=>r.position>=n).length;
      s.completed+=ending;s.ribosomes=s.ribosomes.filter(r=>r.position<n);
      return s;
    };
    return s;
  }
  // Lac : on modélise l'allolactose induit par le lactose et CAP–AMPc ; 0 / 0,08 / 1 sont relatifs.
  function lacOperon({lactose=false,glucose=true}={}) {
    const repressoreFixe=!lactose,activateurFixe=!glucose;
    return {lactose:!!lactose,glucose:!!glucose,represseurFixe:repressoreFixe,activateurFixe,represseur:repressoreFixe?'fixé':'détaché',activateur:activateurFixe?'actif':'inactif',taux:repressoreFixe?0:activateurFixe?1:0.08};
  }
  function steady(k,gamma){if(!(Number.isFinite(k)&&k>=0&&Number.isFinite(gamma)&&gamma>0))throw new RangeError('k ≥ 0 et gamma > 0');return k/gamma;}
  function niveau({k,gamma,on=1,initial=0},t){
    if(!(Number.isFinite(t)&&t>=0&&Number.isFinite(on)&&on>=0&&on<=1))throw new RangeError('Durée ou commande non valide');
    const eq=steady(k*on,gamma);
    return eq+(initial-eq)*Math.exp(-gamma*t);
  }
  // Deux étages sans délai artificiel : dm/dt=k·on−gammaMrna·m, dp/dt=translationRate·m−gamma·p.
  // Le champ « p » conserve la solution du cas élémentaire dp/dt=k·on−gamma·p.
  function expression({k=6,gamma=0.12,on=1,initial=0,gammaMrna=0.45,translationRate=1,m0=0,p0=0}={},t=0) {
    const simple=niveau({k,gamma,on,initial},t);
    const mEq=steady(k*on,gammaMrna),pEq=steady(translationRate*mEq,gamma);
    const em=Math.exp(-gammaMrna*t),ep=Math.exp(-gamma*t);
    const m=mEq+(m0-mEq)*em;
    const conv=Math.abs(gamma-gammaMrna)<1e-10 ? t*ep:(em-ep)/(gamma-gammaMrna);
    const p=p0*ep+translationRate*mEq*(1-ep)/gamma+translationRate*(m0-mEq)*conv;
    return {p:simple,mrna:m,protein:p,plateauSimple:steady(k*on,gamma),plateauMrna:mEq,plateauProteine:pEq,demiApproche:Math.LN2/gamma};
  }
  return Object.freeze({CODE,AA,GENE,HBB,GENOME,TAUX,complement,reverseComplement,transcribe,codingFromTemplate,genomeMetrics,translate,mutate,insert,delete:del,classify,transcriptionRun,ribosomeRun,lacOperon,steady,niveau,expression});
})();
/* GEN-END */
