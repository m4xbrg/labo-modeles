/* LABO — lecture du corpus (prototype).
   Une seule source de données : ../corpus/*.json. Ce fichier ne contient aucune donnée,
   seulement de quoi les charger et les interpréter (statut d'un module, voisins, etc.).
   Les pages doivent être servies par HTTP (GitHub Pages, ou `python -m http.server` à la
   racine du dépôt) : un fichier ouvert directement (file://) ne peut pas lire le JSON. */
(() => {
'use strict';
const BASE = new URL('../corpus/', document.currentScript.src);
const OS = new URL('../', document.currentScript.src);   // racine du dépôt

let promesse = null;
function charge(){
  if (promesse) return promesse;
  const lit = n => fetch(new URL(n + '.json', BASE)).then(r => { if (!r.ok) throw new Error(n + ' : HTTP ' + r.status); return r.json(); });
  promesse = Promise.all(['modules', 'models', 'productions', 'collections', 'atlas'].map(lit))
    .then(([modules, models, productions, collections, atlas]) => interprete({ modules, models, productions, collections, atlas }));
  return promesse;
}

const RANG = { full: 3, partial: 2, supporting: 1, none: 0 };

function interprete(c){
  const modeles = new Map(c.models.models.map(m => [m.id, m]));
  const productions = c.productions.productions;
  const mods = c.modules.modules;

  // Le modèle qui « ouvre » un module : d'abord celui de sa production de fondations,
  // sinon celui qui le couvre le mieux. Une couverture `supporting` n'ouvre rien.
  function modelePour(mod){
    const candidats = mod.covered_by.filter(x => RANG[x.coverage] >= 2);
    if (!candidats.length) return null;
    const prod = productions.find(p => p.modules.includes(mod.id) && p.status === 'built');
    const parProd = prod && candidats.find(x => prod.models.includes(x.model));
    const choix = parProd || candidats.sort((a, b) => RANG[b.coverage] - RANG[a.coverage])[0];
    return { modele: modeles.get(choix.model), couverture: choix.coverage };
  }

  const modules = mods.map(m => {
    const o = modelePour(m);
    return {
      id: m.id, titre: m.title, domaine: m.domain, code: m.domain_code, concepts: m.concepts,
      couverture: m.coverage,                       // full | partial | supporting | none
      modele: o ? o.modele : null,
      href: o ? new URL(o.modele.path, OS).href : null,
      ouvert: !!o,
      partiel: !!o && o.couverture === 'partial',
    };
  });

  const collections = c.collections.collections.map(col => ({
    id: col.id, titre: col.title, description: col.description,
    membres: col.members.map(id => modeles.get(id)).filter(Boolean),
  }));
  const dansUneCollection = new Set(collections.flatMap(col => col.membres.map(m => m.id)));
  const showcasesHorsCollection = c.models.models.filter(m => m.type === 'showcase' && !dansUneCollection.has(m.id));
  const selectionnees = c.atlas.entries.filter(e => e.status === 'selected');

  return {
    date: c.modules.as_of && c.modules.as_of.date,
    domaines: c.modules.domains,
    modules,
    module: id => modules.find(m => m.id === +id),
    voisins: id => ({ avant: modules.find(m => m.id === +id - 1) || null, apres: modules.find(m => m.id === +id + 1) || null }),
    modeles, collections, showcasesHorsCollection, selectionnees,
    lien: path => new URL(path, OS).href,
  };
}

window.LaboCorpus = { charge };
})();
