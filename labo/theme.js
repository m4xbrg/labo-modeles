/* LABO — thème clair / sombre.
   Par défaut, le thème suit le système. Le bouton [data-theme-bascule] fait défiler
   auto → clair → sombre ; le choix est retenu dans ce navigateur seulement.
   Chargé dans <head> pour éviter un éclair du mauvais thème. */
(() => {
'use strict';
const CLE = 'labo-theme', ORDRE = ['auto', 'clair', 'sombre'];
const lit = () => { try { return localStorage.getItem(CLE) || 'auto'; } catch (_) { return 'auto'; } };
const ecrit = v => { try { localStorage.setItem(CLE, v); } catch (_) {} };
function applique(v){
  const html = document.documentElement;
  if (v === 'clair') html.dataset.theme = 'light';
  else if (v === 'sombre') html.dataset.theme = 'dark';
  else delete html.dataset.theme;
  document.querySelectorAll('[data-theme-bascule]').forEach(b => {
    b.textContent = { auto: 'Thème auto', clair: 'Thème clair', sombre: 'Thème sombre' }[v];
    b.setAttribute('aria-label', 'Thème : ' + v + ' (changer)');
  });
  dispatchEvent(new CustomEvent('labo-theme'));
}
applique(lit());
document.addEventListener('DOMContentLoaded', () => {
  applique(lit());
  document.querySelectorAll('[data-theme-bascule]').forEach(b => b.addEventListener('click', () => {
    const v = ORDRE[(ORDRE.indexOf(lit()) + 1) % ORDRE.length]; ecrit(v); applique(v);
  }));
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => dispatchEvent(new CustomEvent('labo-theme')));
// Lire une couleur de thème depuis le JS (canvas, SVG générés)
window.LaboTheme = { couleur: nom => getComputedStyle(document.documentElement).getPropertyValue(nom).trim() };
})();
