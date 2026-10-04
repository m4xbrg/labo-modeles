/* LABO — habillage de l’accueil et des planches.
   AUCUNE donnée de vérité ici : numéros, titres, domaines, statuts et liens viennent de
   ../corpus/*.json (voir corpus.js). Ce fichier ne dit que comment montrer les choses :
   couleur d'un domaine, petite formule d'en-tête, pictogramme animé, textes des phénomènes,
   et les planches maquettes. Une entrée absente a un rendu par défaut : rien ne casse
   quand le corpus gagne un module ou un modèle.

   Pour ajouter une maquette de planche : la poser dans labo/ (voir GABARIT.md) puis
   ajouter une ligne dans MAQUETTES. */
window.LaboPresentation = {

  // Couleur et sous-titre par domaine (codes de corpus/modules.json)
  DOMAINES: {
    A: { c: '#3a8f86', sous: 'Mesurer, représenter, faire évoluer' },
    B: { c: '#7a64b0', sous: 'Ce qui bouge, et pourquoi' },
    C: { c: '#a5793f', sous: 'Des molécules à la chaleur' },
    D: { c: '#d4532a', sous: 'Charges, courants, champs, lumière' },
    E: { c: '#8a6d2f', sous: 'Atomes, liaisons, réactions' },
    F: { c: '#3e9a6a', sous: 'Ce qui se passe dans une cellule' },
    G: { c: '#b4566e', sous: 'Organes et échanges' },
    H: { c: '#8b8f2e', sous: 'Du gène à la population' },
    I: { c: '#b0453c', sous: 'Étoiles et grandes structures' },
    J: { c: '#55585a', sous: 'Espace, temps, lumière' },
    K: { c: '#6b5fa8', sous: 'Amplitudes et mesures' },
  },

  // Par module : [formule ou ordre de grandeur, pictogramme (clé de VIZ dans index.html), couleur propre]
  MODULES: {
    1: ['10⁻¹⁰ → 10¹³ m'], 2: ['a + b · |a|'], 3: ['v = dx/dt'], 4: ['dx/dt = f(x)'], 5: ['t½ = ln2 / λ'],
    6: ['T = 1/f', 'phase'], 7: ['σ ∝ √n', 'hasard'], 8: ['x* stable ?'], 9: ['Σ aₙ sin(nωt)'],
    10: ['ΣF = ma'], 11: ['Σp = cte'], 12: ['L = Iω'], 13: ['v = √(GM/r)', 'orbite'], 14: ['ω₀ = √(k/m)'], 15: ['λ = v/f', 'onde'],
    16: ['∇·F · ∇×F'], 17: ['PV = NkT', 'gaz'], 18: ['ΔS ≥ 0'], 19: ['J = −D ∇c', 'diffusion'], 20: ['Q = A·v'],
    21: ['F = qE'], 22: ['τ = RC'], 23: ['ε = −N dΦ/dt', 'fil', '#3b4fb8'], 24: ['c = 1/√(μ₀ε₀)', 'em', '#3b4fb8'], 25: ['n₁ sin θ₁ = n₂ sin θ₂', null, '#3f6fa8'],
    26: ['~10⁻¹⁵ m'], 27: ['E = hf'], 28: ['~0,1 nm'], 29: ['n = m/M'], 30: ['k = A e^(−Ea/RT)'], 31: ['pH = −log[H⁺]'],
    32: ['~10 µm'], 33: ['~100 mV · ms'], 34: ['ATP · ~1 µm'], 35: ['ADN → ARN → protéine'], 36: ['~2 nm'], 37: ['boucle de rétroaction'],
    38: ['~1 m · ~1 s'], 39: ['jours'], 40: ['~10⁴ générations'], 41: ['dN/dt = rN(1 − N/K)'], 42: ['règles locales'],
    43: ['λ_max T = b'], 44: ['~10¹⁰ ans'], 45: ['v = H₀ d'], 46: ['γ = 1/√(1 − v²/c²)'], 47: ['~10⁻⁹ Δt/t'],
    48: ['|ψ|²'], 49: ['~1 nm'], 50: ['↑ ou ↓'],
  },

  // Planches maquettes (pas des modèles) : module → page dans labo/
  MAQUETTES: {},

  // Phénomènes : id de modèle (models.json) ou d'idée d'Atlas (atlas.json) → texte et signature
  PHENOMENES: {
    'mitose':              { d: 'Des chromosomes tirés par des câbles, puis une cellule qui se pince en deux.', e: '~20 µm', t: '~1 h', c: '#3e9a6a' },
    'respiration':         { d: 'Du glucose à l’ATP : une turbine moléculaire mue par des protons.', e: '~1 µm', t: 'ms', c: '#8a5bc4' },
    'neurone':             { d: 'Une impulsion électrique, puis une synapse qui se renforce à force de répétition.', e: '~100 µm', t: '~2 ms', c: '#c2477f' },
    'replication-adn':     { d: 'Suivre une fourche : un brin se copie d’un trait, l’autre à reculons, par fragments.', e: '~2 nm', t: '30–50 nt/s', c: '#1f9a8e' },
    'supernova':           { d: 'Un cœur de fer s’écroule en une fraction de seconde, puis une onde de choc traverse l’étoile.', e: '~10⁹ km', t: '~0,3 s → 10⁴ ans', c: '#b0453c' },
    'ondes-interferences': { d: 'Deux ondes se croisent : ici elles se renforcent, là elles s’annulent.', e: '~1 cm', t: '~0,1 s', c: '#3f6fa8' },
    'double-pendule-et-chaos':  { d: 'Deux tiges, aucune règle cachée, et pourtant aucune prévision possible au-delà de quelques secondes.', e: '~1 m', t: '~10 s', c: '#7a64b0' },
    'barriere-et-effet-tunnel': { d: 'Une particule franchit une barrière qu’elle ne pourrait jamais escalader.', e: '~1 nm', t: '~10⁻¹⁵ s', c: '#55585a' },
  },
};
