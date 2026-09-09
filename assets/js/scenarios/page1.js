// Scénario pour la page 1 : gestion du menu principal qui change en fonction du scroll de l'utilisateur.
const menu = document.getElementById('menu-principal');
const VITESSE = 1500;
const SEUIL_SCROLL = 6;
const FACTEUR_BORD = 0.1;
const FACTEUR_CENTRE = 2;
const PUISSANCE_COURBE = 1;
const boutonQuitter = document.querySelector('#menu-principal a:last-child');


let direction = -1;
let position = 0; // sera remplacé juste après par la position sous le sous-titre
let demarre = false;
let dernierScrollY = window.scrollY;
let dernierTemps = performance.now();

// Gestion du menu principal
if (!menu) {
  console.warn('Le menu principal est introuvable.');
} else {
  function positionInitiale() {
    const sousTitre = document.querySelector('.sous-titre');
    if (!sousTitre) return 0;
    return sousTitre.getBoundingClientRect().bottom;
  }

  position = positionInitiale();

  function progression() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return 1;
    return Math.min(window.scrollY / scrollable, 1);
  }

  function cibleHaut() {
    return -menu.offsetHeight;
  }

  function cibleBas() {
    return window.innerHeight;
  }

  function actualiserPositionInitiale() {
    if (!demarre) {
      position = positionInitiale();
      menu.style.top = position + 'px';
      return;
    }
    const bas = cibleBas();
    const haut = cibleHaut();
    const cible = direction === 1 ? haut : bas;
    position = Math.min(Math.max(position, Math.min(cible, bas)), Math.max(cible, haut));
    menu.style.top = position + 'px';
  }

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const delta = y - dernierScrollY;

    if (Math.abs(delta) > SEUIL_SCROLL) {
      direction = delta > 0 ? 1 : -1;
      dernierScrollY = y;
      demarre = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    actualiserPositionInitiale();
  });

  function animer(temps) {
    const dt = (temps - dernierTemps) / 1000;
    dernierTemps = temps;

    if (!demarre) {

      menu.style.top = position + 'px';
      requestAnimationFrame(animer);
      return;
    }

    const cible = direction === 1 ? cibleHaut() : cibleBas();
    const vitesse = VITESSE * facteurVitesse();
    const pas = vitesse * dt;

    const ecart = cible - position;
    if (Math.abs(ecart) <= pas) position = cible;
    else position += Math.sign(ecart) * pas;

    menu.style.top = position + 'px';

    requestAnimationFrame(animer);
  }

  menu.style.top = position + 'px';
  requestAnimationFrame(animer);

  function facteurVitesse() {
    const p = progression();
    const distanceAuBord = Math.max(0, Math.min(p, 1 - p) * 2);
    const courbe = Math.pow(distanceAuBord, PUISSANCE_COURBE);
    return FACTEUR_BORD + (FACTEUR_CENTRE - FACTEUR_BORD) * courbe;
  }

  const boutonQuitter = document.querySelector('#menu-principal a:last-child');

  if (boutonQuitter) {
    boutonQuitter.addEventListener('click', (e) => {
      e.preventDefault();
      boutonQuitter.style.display = 'none';
    });
  }
}

boutonQuitter.addEventListener('click', (e) => {
  e.preventDefault();
  boutonQuitter.style.display = 'none';
});