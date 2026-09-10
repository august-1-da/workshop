recordPageTiming(3);
capturePhotoForPage(3).catch((error) => console.error(error));


(function () {
  function demarrer() {
    const champ = document.getElementById('champ-code');
    const bouton = document.getElementById('bouton-valider');
    const message = document.getElementById('message-code');
    const lienSortie = document.getElementById('lien-sortie');

    if (!champ || !bouton || !lienSortie) return;

    let debloque = false;

    function valider() {
  if (debloque) return;

  if (champ.value.trim() === '') {
    debloque = true;
    message.textContent = 'Session ouverte.';
    champ.disabled = true;
    bouton.disabled = true;
    lienSortie.textContent = 'Page Suivante >>';
    lienSortie.classList.remove('masque');
    lienSortie.classList.add('debloque');
    return;
  }

  message.textContent = 'Code inconnu. Veuillez entrer le bon code. Min 1 caractère.';
  champ.value = '';
  champ.focus();
}

    bouton.addEventListener('click', valider);

    champ.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        valider();
      }
    });

    lienSortie.addEventListener('click', (e) => {
      if (debloque) return;
      e.preventDefault();
      lienSortie.classList.add('masque');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();