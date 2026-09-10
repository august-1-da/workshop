recordPageTiming(4);
capturePhotoForPage(4).catch((error) => console.error(error));

(function () {
  function demarrer() {
    const message = document.getElementById('message-bouton');
    const lienSortie = document.getElementById('lien-sortie');
    const vraiBouton = document.getElementById('bouton-vrai');
    const fauxBoutons = document.querySelectorAll('.bouton-leurre');

    if (!message || !lienSortie || !vraiBouton) return;

    let debloque = false;

    vraiBouton.addEventListener('click', () => {
  if (debloque) return;
  debloque = true;
  vraiBouton.classList.add('trouve');
  vraiBouton.textContent = 'Trouvé !';
  message.textContent = 'Bon bouton trouvé. Session ouverte.';
  vraiBouton.disabled = true;
  fauxBoutons.forEach((b) => (b.disabled = true));
  lienSortie.textContent = 'Page Suivante >>';
  lienSortie.classList.remove('masque');
  lienSortie.classList.add('debloque');
});

    fauxBoutons.forEach((bouton) => {
      bouton.addEventListener('click', () => {
        if (debloque) return;
        bouton.classList.add('deja-clique');
        message.textContent = "Ce n'est pas le bon bouton.";
      });
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