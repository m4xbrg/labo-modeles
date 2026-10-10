// Vérification du moteur scientifique de LABO · Signaux et Fourier.
// node prompts/moteurs/signaux-fourier.test.js
// node prompts/moteurs/signaux-fourier.test.js opus-sonnet/fondations-signaux-fourier/index.html
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const REF = path.join(__dirname, 'signaux-fourier.js');
const cible = process.argv[2] ? path.resolve(process.argv[2]) : REF;
const marqueDebut = '/* FOURIER-BEGIN */', marqueFin = '/* FOURIER-END */';
const extraire = code => {
  const a = code.indexOf(marqueDebut), b = code.indexOf(marqueFin);
  return a < 0 || b < a ? null : code.slice(a, b + marqueFin.length);
};
const bloc = extraire(fs.readFileSync(cible, 'utf8'));
if (!bloc) { console.error('ÉCHEC : bloc FOURIER introuvable : ' + cible); process.exit(1); }
if (cible !== REF && extraire(fs.readFileSync(REF, 'utf8')) !== bloc) {
  console.error('ÉCHEC : le bloc de la page diffère du moteur de référence.'); process.exit(1);
}
const Fourier = new Function(bloc + '\nreturn Fourier;')();
let passes = 0, echecs = 0;
function ok(condition, nom, precision) {
  if (condition) { passes++; return; }
  echecs++; console.error('ÉCHEC  ' + nom + (precision === undefined ? '' : ' (' + precision + ')'));
}
function proche(a, b, tol, nom) { ok(Number.isFinite(a) && Math.abs(a - b) <= tol, nom, `${a} vs ${b}, écart=${Math.abs(a - b)}`); }
function relatif(a, b, tol, nom) { ok(Number.isFinite(a) && Math.abs(a - b) / Math.max(Math.abs(b), 1e-300) <= tol, nom, `${a} vs ${b}`); }
const PI = Math.PI, TAU = 2 * PI;

// 1. Séries, phases et sommes : carrée, dent de scie et triangle.
for (let k = 1; k <= 50; k++) {
  const sq = Fourier.square(50)[k - 1], sw = Fourier.sawtooth(50)[k - 1], tr = Fourier.triangle(50)[k - 1];
  proche(sq.amplitude, k % 2 ? 4 / (PI * k) : 0, 1e-14, 'Carré : amplitude harmonique ' + k);
  proche(sw.sin, 2 / (PI * k) * (k % 2 ? 1 : -1), 1e-14, 'Dent de scie : coefficient signé ' + k);
  proche(tr.sin, k % 2 ? 8 / (PI * PI * k * k) * ((k - 1) % 4 ? -1 : 1) : 0, 1e-14, 'Triangle : coefficient ' + k);
}
relatif(Fourier.synth(Fourier.square(49), 1, .25), 1, .02, 'Somme carrée près du plateau');
const g99 = Fourier.gibbsOvershoot(99), g199 = Fourier.gibbsOvershoot(199), g399 = Fourier.gibbsOvershoot(399);
relatif(g399.maximum, 1.178979744, .005, 'Gibbs : maximum ≈ 1,179 à 0,5 %');
ok(Math.abs(g399.maximum - g199.maximum) < .006 && g399.depassement > .17, 'Gibbs persiste à grand N', g199.maximum + ' puis ' + g399.maximum);
ok(g399.position < g199.position && g199.position < g99.position, 'Gibbs se resserre près du saut');

// 2. FFT, transformée inverse, étalement en fréquence, fenêtres et Parseval.
const N = 1024, fsEch = 1024;
const signal = Float64Array.from({length: N}, (_, i) => Math.sin(TAU * 37 * i / N));
const spectre = Fourier.spectrum(signal, fsEch, 'rectangulaire');
proche(spectre.amplitudes[37], 1, 1e-12, 'Sinusoïde pure : raie unique à 37 Hz');
ok(spectre.amplitudes.reduce((s, a, k) => s + (k === 37 ? 0 : a * a), 0) < 1e-20, 'Fuite FFT entière sous 10^-10 en amplitude');
const re = Float64Array.from({length:N}, (_, i) => .6 * Math.cos(TAU*17*i/N) + .3 * Math.sin(TAU*193*i/N) + i/N), im = new Float64Array(N);
const original = re.slice();
Fourier.fft(re, im); Fourier.ifft(re, im);
ok(Math.max(...Array.from(re, (v,i) => Math.abs(v - original[i]))) < 1e-12, 'ifft(fft(x)) = x à 10^-12');
ok(Math.max(...im.map(Math.abs)) < 1e-12, 'Parties imaginaires nulles après aller-retour');
const par = Fourier.parseval(original);
relatif(par.frequence, par.temps, 1e-10, 'Parseval à 10^-10');
const horsCase = Float64Array.from({length:N}, (_, i) => Math.sin(TAU*37.25*i/N));
const etale = Fourier.spectrum(horsCase, fsEch, 'rectangulaire');
ok(etale.amplitudes[36] > .05 && etale.amplitudes[38] > .1, 'Fréquence entre cases : fuite spectrale');
const Hann = Fourier.spectrum(horsCase, fsEch, 'Hann');
const principal = Math.max(...Hann.amplitudes), secondaire = Math.max(...Hann.amplitudes.filter((a,k) => k < 35 || k > 39));
ok(20*Math.log10(secondaire / principal) < -31, 'Hann : lobes latéraux sous -31 dB', (20*Math.log10(secondaire/principal)).toFixed(2)+' dB');
proche(Fourier.freqAxis(1024, 44100)[512], 22050, 1e-12, 'Axe FFT : fréquence de Nyquist');

// 3. Échantillonnage, repliement, roue de chariot.
proche(Fourier.aliasFrequency(7000, 10000), 3000, 1e-12, '7 kHz à 10 kHz se replie à 3 kHz');
proche(Fourier.aliasFrequency(22000, 44100), 22000, 1e-12, '22 kHz à 44,1 kHz, sous Nyquist');
proche(Fourier.aliasFrequency(25000, 44100), 19100, 1e-12, '25 kHz à 44,1 kHz se replie à 19,1 kHz');
const roue175 = Fourier.wheel(175, 8, 24), roue180 = Fourier.wheel(180, 8, 24);
proche(roue175.rpmApparent, -5, 1e-12, 'Roue 8 rayons, 24 im/s, 175 tr/min : -5 tr/min');
ok(roue175.sens === 'inverse', 'Roue 175 tr/min : apparence inverse');
proche(roue180.rpmApparent, 0, 1e-12, 'Roue 180 tr/min : immobile');
const prise = Fourier.sample(t => Math.sin(TAU * 350 * t), 2000, 1);
let ecartMax = 0;
for (let i = 0; i < 50; i++) {
  const t = .2 + i*.0123;
  ecartMax = Math.max(ecartMax, Math.abs(Fourier.reconstruct(prise, 2000, t) - Math.sin(TAU*350*t)));
}
ok(ecartMax < .01, 'Reconstruction sinc tronquée sous Nyquist : erreur absolue < 1 %', ecartMax);
const haute = Fourier.sample(t => Math.sin(TAU * 1300 * t), 2000, 1);
let erreurAlias = 0;
for (let i = 0; i < 30; i++) {
  const t = .24 + .01479 * i;
  erreurAlias = Math.max(erreurAlias, Math.abs(Fourier.reconstruct(haute, 2000, t) + Math.sin(TAU * 700 * t)));
}
ok(erreurAlias < .01, 'Au-dessus de Nyquist : la sinc reconstruit -sin(700 Hz)', erreurAlias);

// 4. Réponses RC et filtres réels dans le domaine de Fourier.
const R = 1000, C = 1e-7, fc = 1 / (TAU * R * C), lp = Fourier.rcLowpass(fc), hp = Fourier.rcHighpass(fc);
relatif(lp(fc).gain, 1 / Math.sqrt(2), 1e-12, 'RC passe-bas : 1/racine(2) à fc');
proche(20 * Math.log10(lp(fc).gain), -3.01029995664, 1e-9, 'RC : -3,0103 dB à fc');
proche(lp(fc).phase * 180 / PI, -45, 1e-12, 'RC : phase -45 degrés à fc');
proche(hp(fc).phase * 180 / PI, 45, 1e-12, 'Passe-haut : phase +45 degrés à fc');
const pente = 20*Math.log10(lp(100*fc).gain / lp(10*fc).gain);
ok(Math.abs(pente + 20) < .06, 'RC : pente environ -20 dB/décade', pente);
proche(Fourier.notch(60, 12)(60).gain, 0, 1e-12, 'Coupe-bande : zéro à 60 Hz');
const son = Float64Array.from({length:N}, (_, i) => Math.sin(TAU*60*i/N) + .5 * Math.sin(TAU*200*i/N));
const filtre = Fourier.applyFilter(son, fsEch, Fourier.notch(60, 12));
const avant = Fourier.spectrum(son, fsEch), apres = Fourier.spectrum(filtre, fsEch);
ok(apres.amplitudes[60] < 1e-10, 'Coupe-bande : bourdonnement 60 Hz supprimé', apres.amplitudes[60]);
relatif(apres.amplitudes[200], avant.amplitudes[200], .002, 'Coupe-bande : 200 Hz conservés');
const filtreRC = Fourier.applyFilter(son, fsEch, Fourier.rcLowpass(100));
const spectreRC = Fourier.spectrum(filtreRC, fsEch);
relatif(spectreRC.amplitudes[200], .5 * Fourier.rcLowpass(100)(200).gain, 1e-10, 'Passe-bas en fréquence : gain exact à 200 Hz');

// 5. Timbres, signaux de bruit et génération stéréotypée déterministe.
for (const nom of ['diapason','flute','clarinette','violon','voix-a','voix-i']) {
  const cs = Fourier.timbreCoeffs(nom, 440);
  ok(cs.length >= 16 && cs.every(c => Number.isFinite(c.amplitude)), 'Timbre documenté et fini : ' + nom);
}
ok(Fourier.timbreCoeffs('clarinette',440)[2].amplitude > 5 * Fourier.timbreCoeffs('clarinette',440)[1].amplitude, 'Clarinette : 3e harmonique dominante sur 2e');
ok(Fourier.timbreCoeffs('diapason',440)[0].amplitude > 30*Fourier.timbreCoeffs('diapason',440)[1].amplitude, 'Diapason quasi pur');
ok(Fourier.timbreCoeffs('violon',440,true)[0].amplitude === 0, 'Fondamentale retirée sans effacer les harmoniques');
const alea1=Fourier.mulberry32(42), alea2=Fourier.mulberry32(42);
ok(Array.from({length:50}, () => Fourier.noise(alea1)).every((v,i) => v === Fourier.noise(alea2)), 'Bruit à graine reproduit exactement');
proche(Fourier.hum(60)(1/240), 1, 1e-12, 'Bourdonnement à 60 Hz, quart de période');

console.log(`${passes} tests réussis ; ${echecs} échec(s).`);
if (echecs) process.exitCode = 1;
