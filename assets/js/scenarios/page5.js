recordPageTiming(5);
capturePhotoForPage(5).catch((error) => console.error(error));

const boutonSortie = document.getElementById('bouton-sortie');
let sortieDeverrouillee = false;

document.addEventListener('keydown', function (event) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) || event.target.isContentEditable) {
        return;
    }

    if (event.key === 'Backspace') {
        const elementsRestants = document.querySelectorAll('.a-supprimer');

        if (elementsRestants.length > 0) {
            const elementCourant = elementsRestants[elementsRestants.length - 1];
            let texte = elementCourant.textContent;

            if (texte.length > 0) {
                elementCourant.textContent = texte.slice(0, -1);
            }

            if (elementCourant.textContent.length === 0) {
                elementCourant.remove();

                if (elementsRestants.length === 1) {
                    deverrouillerSortie();
                }
            }
        }
    }
    if (event.key === 'Delete') {
        const elementsRestants = document.querySelectorAll('.a-supprimer');

        if (elementsRestants.length > 0) {
            const elementCourant = elementsRestants[0];
            let texte = elementCourant.textContent;

            if (texte.length > 0) {
                elementCourant.textContent = texte.slice(1);
            }

            if (elementCourant.textContent.length === 0) {
                elementCourant.remove();

                if (elementsRestants.length === 1) {
                    deverrouillerSortie();
                }
            }
        }
    }
});

boutonSortie.addEventListener('click', () => {
    if (sortieDeverrouillee) {
        window.location.href = 'fin.php';
        return;
    }

    boutonSortie.classList.add('masque');
});

function deverrouillerSortie() {
    sortieDeverrouillee = true;
    boutonSortie.textContent = 'Sortie déverrouillée';
    boutonSortie.classList.remove('masque');
    boutonSortie.classList.add('debloque');
}