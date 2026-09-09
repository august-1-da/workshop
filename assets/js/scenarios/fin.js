function readLocalStorageJson(key, fallback) {
	try {
		return JSON.parse(localStorage.getItem(key)) || fallback;
	} catch (error) {
		return fallback;
	}
}

function displayFinishData() {
	const player = readLocalStorageJson('joueur', {});
	const timing = readLocalStorageJson('Temps pages', {});
	const photosByPage = readLocalStorageJson('Photos pages', {});
	const lastPhoto = readLocalStorageJson('Photo page', null);
	const playerElement = document.getElementById('finish-player');
	const timeElement = document.getElementById('finish-time');
	const photosElement = document.getElementById('finish-photos');

	if (playerElement) {
		const firstName = player.prenom || '';
		const lastName = player.nom || '';
		playerElement.textContent = `${firstName} ${lastName}`.trim() || 'Joueur inconnu';
	}

	if (timeElement) {
		timeElement.textContent = timing.finalTime || 'Temps non disponible';
	}

	if (!photosElement) {
		return;
	}

	const photos = Object.keys(photosByPage).length > 0
		? Object.values(photosByPage)
		: (lastPhoto ? [lastPhoto] : []);
	photos.sort((first, second) => first.page - second.page);

	if (photos.length === 0) {
		photosElement.textContent = 'Aucune photo disponible.';
		return;
	}

	photosElement.replaceChildren();
	photos.forEach((photo) => {
		const figure = document.createElement('figure');
		const image = document.createElement('img');
		const caption = document.createElement('figcaption');

		image.src = photo.path;
		image.alt = `Photo de la page ${photo.page}`;
		caption.textContent = `Page ${photo.page}`;
		figure.append(image, caption);
		photosElement.appendChild(figure);
	});
}

displayFinishData();
