
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
		const displayTime = timing.finalTime
			? timing.finalTime.replace(/[.:]\d{3}$/, '')
			: 'Temps non disponible';
		timeElement.textContent = displayTime;
	}
	console.log(timing.finalTime);


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
		const isSelected = readLocalStorageJson('Photo sélectionnée', null)?.path === photo.path;

		image.src = photo.path;
		image.alt = `Photo de la page ${photo.page}`;
		caption.textContent = `Photo ${photo.page}`;
		figure.className = isSelected ? 'photo-selectionnee' : '';
		figure.tabIndex = 0;
		figure.setAttribute('role', 'button');
		figure.setAttribute('aria-pressed', String(isSelected));

		const selectPhoto = () => {
			document.querySelectorAll('#finish-photos figure').forEach((currentFigure) => {
				currentFigure.classList.remove('photo-selectionnee');
				currentFigure.setAttribute('aria-pressed', 'false');
			});
			figure.classList.add('photo-selectionnee');
			figure.setAttribute('aria-pressed', 'true');
			localStorage.setItem('Photo sélectionnée', JSON.stringify(photo));
		};

		figure.addEventListener('click', selectPhoto);
		figure.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				selectPhoto();
			}
		});
		figure.append(image, caption);
		photosElement.appendChild(figure);
	});
}

async function submitScore() {
	const player = readLocalStorageJson('joueur', {});
	const timing = readLocalStorageJson('Temps pages', {});
	const selectedPhoto = readLocalStorageJson('Photo sélectionnée', null);
	const submitButton = document.getElementById('finish-leaderboard');
	const feedbackElement = document.getElementById('finish-feedback');

	if (!selectedPhoto?.path) {	
		if (feedbackElement) {
			feedbackElement.textContent = 'Veuillez sélectionner une photo avant de continuer.';
		}
		return;
	}

	const leaderboardData = {
		first_name: player.prenom || '',
		last_name: player.nom || '',
		final_time: timing.finalTime || '',
		photo: selectedPhoto.path,
		stopped_at: 3,
	};

	localStorage.setItem('Données leaderboard', JSON.stringify(leaderboardData));
	if (submitButton) {
		submitButton.disabled = true;
	}

	if (feedbackElement) {
		feedbackElement.textContent = 'Envoi des données...';
	}

	const script = document.querySelector('script[src*="scenarios/fin.js"]');
	const submitEndpoint = new URL('../../../api/submit_score.php', script?.src || document.baseURI);

	try {
		const response = await fetch(submitEndpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(leaderboardData),
		});
		const responseText = await response.text();
		let result;

		try {
			result = JSON.parse(responseText);
		} catch (error) {
			throw new Error('Le serveur a renvoyé une réponse invalide.');
		}

		if (!response.ok || !result.success) {
			throw new Error(result.error || 'Les données n’ont pas pu être enregistrées.');
		}

		[
			'joueur',
			'Temps pages',
			'Photo page',
			'Photo page actuelle',
			'Photos pages',
			'Photo sélectionnée',
			'Données leaderboard',
		].forEach((key) => localStorage.removeItem(key));

		if (feedbackElement) {
			feedbackElement.textContent = 'Les données ont bien été récupérées et enregistrées dans le leaderboard.';
		}
		window.setTimeout(() => {
			window.location.href = 'leaderboard.php';
		}, 800);
	} catch (error) {
		if (feedbackElement) {
			feedbackElement.textContent = error.message;
		}
		if (submitButton) {
			submitButton.disabled = false;
		}
	}
}

document.getElementById('finish-leaderboard')?.addEventListener('click', submitScore);

capturePhotoForPage(6)
	.then(() => displayFinishData())
	.catch((error) => {
		displayFinishData();
		const feedbackElement = document.getElementById('finish-feedback');
		if (feedbackElement) {
			feedbackElement.textContent = error.message;
		}
	});
