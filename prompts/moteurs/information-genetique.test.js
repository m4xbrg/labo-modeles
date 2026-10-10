// Tests autonomes du moteur « Information génétique ».
// node prompts/moteurs/information-genetique.test.js
// node prompts/moteurs/information-genetique.test.js opus-sonnet/fondations-information-genetique/index.html
'use strict';
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const REF=path.join(__dirname,'information-genetique.js');
const cible=process.argv[2] || REF;
const extract=s=>{const a=s.indexOf('/* GEN-BEGIN */'),b=s.indexOf('/* GEN-END */');return a<0||b<a ? null:s.slice(a,b+'/* GEN-END */'.length);};
const bloc=extract(fs.readFileSync(cible,'utf8'));
if(!bloc){console.error('ÉCHEC : marqueurs GEN-BEGIN / GEN-END absents');process.exit(1);}
if(cible!==REF && extract(fs.readFileSync(REF,'utf8'))!==bloc){console.error('ÉCHEC : le bloc de la page diffère du moteur de référence');process.exit(1);}
const Gen=new Function(bloc+'\nreturn Gen;')();
let ok=0,ko=0;
function test(nom,action){try{action();ok++;}catch(e){ko++;console.error('ÉCHEC : '+nom+' — '+e.message);}}
function proche(a,b,tol=0.01){assert.ok(Math.abs(a-b)<=Math.max(Math.abs(b),1e-12)*tol,`${a} vs ${b} (écart ${Math.abs(a-b)})`);}

// 1. Table 1 du NCBI : chaque quadruplet est indépendant de la construction du moteur.
const refTable={UU:'FFLL',UC:'SSSS',UA:'YY**',UG:'CC*W',CU:'LLLL',CC:'PPPP',CA:'HHQQ',CG:'RRRR',AU:'IIIM',AC:'TTTT',AA:'NNKK',AG:'SSRR',GU:'VVVV',GC:'AAAA',GA:'DDEE',GG:'GGGG'};
test('table NCBI : les 64 codons et leurs produits',()=>{
  assert.equal(Object.keys(Gen.CODE).length,64);
  for(const [prefix,row] of Object.entries(refTable)) for(let j=0;j<4;j++)assert.equal(Gen.CODE[prefix+'UCAG'[j]].one,row[j],prefix+'UCAG'[j]);
  assert.equal(Object.values(Gen.CODE).filter(a=>!a.stop).length,61);
  assert.deepEqual(Object.keys(Gen.CODE).filter(c=>Gen.CODE[c].stop).sort(),['UAA','UAG','UGA']);
});
test('AUG Met, UGG Trp et stop',()=>{assert.equal(Gen.CODE.AUG.three,'Met');assert.equal(Gen.CODE.UGG.three,'Trp');assert.equal(Gen.CODE.UAA.stop,true);});
test('Leu, Ser, Arg : 6 codons chacun',()=>{for(const aa of ['L','S','R'])assert.equal(Object.values(Gen.CODE).filter(v=>v.one===aa).length,6);});
test('AA : les 20 fiches et leurs propriétés',()=>{assert.equal(Object.keys(Gen.AA).length,20);assert.deepEqual(new Set(Object.values(Gen.AA).map(a=>a.propriete)),new Set(['hydrophobe','polaire','chargé +','chargé −']));});

// 2. Orientation des brins, transcription et propriété involutive.
test('double complément inversé',()=>{
  for(const s of ['', 'A','TCGATGCTTTAGC','GGGGAAAATTTTCC'])assert.equal(Gen.reverseComplement(Gen.reverseComplement(s)),s);
});
test('matrice 3’→5’ vers ARN 5’→3’ : identité au codant sauf U',()=>{
  for(const s of ['ATG','ATGCTTAGCCCG','GGGTTTAAACCC']){
    const matrice=Gen.complement(s);
    assert.equal(Gen.codingFromTemplate(matrice),s);
    assert.equal(Gen.transcribe(matrice),s.replace(/T/g,'U'));
  }
});
test('refus des symboles ambigus',()=>{assert.throws(()=>Gen.complement('AX'),RangeError);assert.throws(()=>Gen.translate('ATG'),RangeError);});

// 3. Traduction et gène modèle.
test('gène modèle de 72 nt, traduction de 23 acides aminés',()=>{
  assert.equal(Gen.GENE.coding.length,72);assert.equal(Gen.GENE.template.length,72);
  assert.equal(Gen.transcribe(Gen.GENE.template),Gen.GENE.mrna);
  const tr=Gen.translate(Gen.GENE.mrna,{startAtAUG:true});
  assert.equal(tr.one,Gen.GENE.peptide);assert.equal(tr.one.length,23);
  assert.equal(tr.stop,69);assert.equal(tr.codons.length,24);
});
test('premier stop arrête les codons suivants',()=>{
  const t=Gen.translate('AUGGCUUAAUGGCU');
  assert.equal(t.one,'MA');assert.equal(t.stop,6);assert.equal(t.codons.length,3);
});
test('cadre 1 / cadre 2 et AUG explicite',()=>{
  assert.equal(Gen.translate('CAUGGCUUAA',{startAtAUG:true}).one,'MA');
  assert.equal(Gen.translate('CAUGGCUUAA',1).one,'MA');
  assert.equal(Gen.translate('CCAUGGCUUAA',2).one,'MA');
});

// 4. Mutations : tests sur une substitution, un stop et un indel.
test('Leu CUA→CUG : mutation silencieuse',()=>{
  assert.equal(Gen.classify('AUGCUAUAA','AUGCUGUAA'),'silencieuse');
});
test('HbS : GAG→GTG, Glu→Val, faux-sens',()=>{
  const n=Gen.HBB.normal,m=Gen.HBB.mutation;
  assert.equal(n.slice(18,21),'GAG');assert.equal(m.slice(18,21),'GTG');
  assert.equal(Gen.translate(n.replace(/T/g,'U')).aminoAcids[6].three,'Glu');
  assert.equal(Gen.translate(m.replace(/T/g,'U')).aminoAcids[6].three,'Val');
  assert.equal(Gen.classify(n,m),'faux-sens');
});
test('insertion / délétion non multiple de trois : décalage du cadre',()=>{
  const s='AUGGCUCUAUAA';assert.equal(Gen.classify(s,Gen.insert(s,5,'A')),'décalage du cadre');
  assert.equal(Gen.classify(s,Gen.delete(s,5)),'décalage du cadre');
});
test('apparition d’un stop UAA : non-sens',()=>{assert.equal(Gen.classify('AUGCAAGCUUAA','AUGUAAGCUUAA'),'non-sens');});
test('édition en phase et séquence inchangée : cas distincts',()=>{
  assert.equal(Gen.classify('AUGGCUUAA', 'AUGGCUUAA'),'aucune');
  assert.equal(Gen.classify('AUGGCUUAA', 'AUGGCCGCUUAA'),'modification en phase');
});

// 5. Polymérases et polysomes, pas indépendants du dessin.
test('transcription : 50 nt/s, 72 nt = 1,44 s',()=>{
  const s=Gen.transcriptionRun({length:72,rate:50});s.step(0.5);proche(s.position,25,1e-12);
  s.step(0.94);assert.equal(s.position,72);assert.equal(s.finished,true);
});
test('polysome : espacements, plusieurs produits',()=>{
  const s=Gen.ribosomeRun({codons:23,rate:10,spacingCodons:5,maximum:3});
  assert.equal(s.launch(),true);assert.equal(s.launch(),false);s.step(0.6);
  assert.equal(s.launch(),true);s.step(0.6);assert.equal(s.launch(),true);
  s.step(3);assert.ok(s.completed>=1);assert.ok(s.ribosomes.length>=0);
});

// 6. Régulation et cinétique.
test('opéron lac : quatre lignes de la table de vérité',()=>{
  for(const [l,g,t,r,a] of [[false,true,0,true,false],[false,false,0,true,true],[true,true,0.08,false,false],[true,false,1,false,true]]){
    const x=Gen.lacOperon({lactose:l,glucose:g});
    assert.equal(x.taux,t);assert.equal(x.represseurFixe,r);assert.equal(x.activateurFixe,a);
  }
});
test('étage unique : plateau et demi-approche ln(2)/gamma',()=>{
  const o={k:8,gamma:0.2,on:1};proche(Gen.steady(8,0.2),40,1e-12);
  proche(Gen.niveau(o,Math.log(2)/.2),20,1e-12);
  proche(Gen.expression(o,100).p,40,1e-8);
});
test('deux étages : plateau analytique et retard de la protéine',()=>{
  const o={k:10,gamma:0.2,gammaMrna:0.5,translationRate:2,on:1};
  const finale=Gen.expression(o,300),debut=Gen.expression(o,1);
  proche(finale.mrna,20,1e-10);proche(finale.protein,200,1e-10);
  assert.ok(debut.mrna/finale.mrna > debut.protein/finale.protein);
});
test('deux étages : gamma identiques et initialisation non nulle',()=>{
  const s=Gen.expression({k:4,gamma:.3,gammaMrna:.3,translationRate:2,on:0,m0:10,p0:6},1);
  proche(s.mrna,10*Math.exp(-.3),1e-12);
  proche(s.protein,6*Math.exp(-.3)+2*10*Math.exp(-.3),1e-12);
});
test('extinction : décroissance des deux concentrations',()=>{
  const s=Gen.expression({k:8,gamma:.4,gammaMrna:1,translationRate:2,on:0,m0:8,p0:40},15);
  assert.ok(s.mrna<0.001 && s.protein<1);
});

// 7. Ordres de grandeur et analogie.
test('génome haploïde, duplex et balle de tennis',()=>{
  const x=Gen.genomeMetrics();
  proche(x.lengthHaploidM,1.054,1e-12);proche(x.lengthDiploidM,2.108,1e-12);
  proche(x.compression,351333.3333333333,1e-12);
  proche(x.tennisAnalogyM,23539.3333333333,1e-12);
  assert.equal(x.haploidBp,3.1e9);assert.equal(x.riseM,0.34e-9);
});
console.log(`Moteur Information génétique — ${ok} tests réussis, ${ko} échec(s), cible : ${path.basename(cible)}`);
if(ko)process.exit(1);
