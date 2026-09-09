(function () {
 
  const COMBINAISON = ['v', 'f', 'k', 'g'];

  const lienSortie = document.getElementById('lien-sortie');
  let progression = 0;
  let debloque = false;

  if (!lienSortie) return;

  document.addEventListener('keydown', (e) => {
    if (debloque) return;

    const touche = e.key.toLowerCase();
    const attendue = COMBINAISON[progression];

    if (touche === attendue) {
      progression++;
      if (progression === COMBINAISON.length) {
        debloque = true;
        lienSortie.textContent = 'Page Suivante >>';
        lienSortie.classList.remove('masque');
        lienSortie.classList.add('debloque');
      }
    } else if (touche === COMBINAISON[0]) {
      progression = 1;
    } else {
      progression = 0;
    }
  });

  lienSortie.addEventListener('click', (e) => {
    if (debloque) return; 

    e.preventDefault();
    lienSortie.classList.add('masque');
  });
})();