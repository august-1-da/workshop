(function () {
  // Combinaison attendue, déduite de l'ordre de première apparition
  // des lettres en gras dans le texte (V -> F -> K -> G)
  const COMBINAISON = ['v', 'f', 'k', 'g'];

  function demarrer() {
    const lienSortie = document.getElementById('lien-sortie');
    const conteneurVoyants = document.getElementById('voyants');

    if (!lienSortie) return;

    const voyants = conteneurVoyants
      ? Array.from(conteneurVoyants.querySelectorAll('.voyant'))
      : [];

    let progression = 0;
    let debloque = false;

    // Allume les n premiers voyants, éteint les autres
    function majVoyants(n) {
      voyants.forEach((voyant, i) => {
        voyant.classList.toggle('allume', i < n);
      });
    }

    // Écoute sur window en phase de capture : la touche est reçue avant
    // tout autre script qui pourrait interrompre sa propagation.
    window.addEventListener('keydown', (e) => {
      if (debloque) return;

      const touche = (e.key || '').toLowerCase();

      if (touche === COMBINAISON[progression]) {
        progression++;
        if (progression === COMBINAISON.length) {
          debloque = true;
          lienSortie.textContent = 'Page Suivante >>';
          lienSortie.classList.remove('masque');
          lienSortie.classList.add('debloque');
        }
      } else if (touche === COMBINAISON[0]) {
        // Mauvaise touche, mais elle correspond à un nouveau départ possible
        progression = 1;
      } else {
        progression = 0;
      }

      majVoyants(progression);
    }, true);

    lienSortie.addEventListener('click', (e) => {
      if (debloque) return; // laisse la navigation normale se faire

      // Cliqué avant d'avoir trouvé la combinaison : le bouton disparaît
      e.preventDefault();
      lienSortie.classList.add('masque');
    });

    majVoyants(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();