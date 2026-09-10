// Gestion de la caméra et de la capture de photos pour chaque page du scénario, gestion du chronomètre et du fullscreen.

// let fullscreenRequired = false;
// let fullscreenRetryTimer = null;
let cameraVideo;
const domReady = document.readyState === 'loading'
	? new Promise((resolve) => document.addEventListener('DOMContentLoaded', resolve, { once: true }))
	: Promise.resolve();
const isFinishPage = /\/fin\.php$/i.test(window.location.pathname);
const globalScript = document.currentScript;
const uploadEndpoint = new URL('../../api/upload_photo.php', globalScript?.src || document.baseURI).href;

const cameraReady = domReady.then(() => {
	cameraVideo = document.createElement('video');
	cameraVideo.autoplay = true;
	cameraVideo.muted = true;
	cameraVideo.playsInline = true;
	cameraVideo.setAttribute('aria-hidden', 'true');
	cameraVideo.style.display = 'none';
	document.body.appendChild(cameraVideo);

	if (!navigator.mediaDevices?.getUserMedia) {
		return null;
	}

	return navigator.mediaDevices.getUserMedia({
		video: { facingMode: 'user' },
		audio: false,
	}).then((stream) => {
		cameraVideo.srcObject = stream;
		return stream;
	}).catch(() => null);
});
const photoCapturePromises = new Map();

const timingStorageKey = 'Temps pages';
const playerStorageKey = 'joueur';

// Formatage du temps écoulé en minutes, secondes et millisecondes
function formatElapsedTime(milliseconds) {
	const totalMilliseconds = Math.max(0, Math.floor(Number(milliseconds) || 0));
	const minutes = Math.floor(totalMilliseconds / 60000);
	const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
	const remainingMilliseconds = totalMilliseconds % 1000;

	return [minutes, seconds, remainingMilliseconds]
		.map((value, index) => String(value).padStart(index === 2 ? 3 : 2, '0'))
		.join(':');
}

function readPageTiming() {
	try {
		return JSON.parse(localStorage.getItem(timingStorageKey)) || null;
	} catch (error) {
		return null;
	}
}

function readPlayer() {
	try {
		return JSON.parse(localStorage.getItem(playerStorageKey)) || {};
	} catch (error) {
		return {};
	}
}

function startPageTiming() {
	const startedAt = Date.now();
	const timing = {
		startedAt,
		lastPageAt: startedAt,
		pages: [{ page: 1, at: startedAt, elapsedMs: 0 }],
		finalTimeMs: null,
		finalTime: null,
		stopped: false,
		stoppedAt: null,
		currentPage: 1,
	};

	localStorage.setItem(timingStorageKey, JSON.stringify(timing));
	return timing;
}
// Enregistre le temps passé sur une page spécifique et met à jour le stockage local
function recordPageTiming(page) {
	const timing = readPageTiming();

	if (!timing || !timing.startedAt || !timing.lastPageAt) {
		return null;
	}

	if (timing.stopped) {
		return timing.pages[timing.pages.length - 1] || null;
	}

	const now = Date.now();
	const elapsedMs = now - timing.lastPageAt;
	const pageTiming = { page, at: now, elapsedMs };
	const totalTimeMs = timing.pages.reduce((total, currentPage) => total + currentPage.elapsedMs, 0) + elapsedMs;

	timing.pages.push(pageTiming);
	timing.lastPageAt = now;
	timing.currentPage = page;

	if (String(page).toLowerCase() === 'fin') {
		timing.stopped = true;
		timing.stoppedAt = now;
		timing.finalTimeMs = totalTimeMs;
		timing.finalTime = formatElapsedTime(totalTimeMs);
	}

	localStorage.setItem(timingStorageKey, JSON.stringify(timing));
	return pageTiming;
}

// Capture une photo pour une page spécifique et l'envoie au serveur
function capturePhotoForPage(pageNumber) {
	if (photoCapturePromises.has(pageNumber)) {
		return photoCapturePromises.get(pageNumber);
	}

	const capturePromise = (async () => {
		const stream = await cameraReady;

		if (!stream) {
			throw new Error('La caméra doit être activée pour prendre la photo.');
		}

		await cameraVideo.play();

		const canvas = document.createElement('canvas');
		canvas.width = cameraVideo.videoWidth;
		canvas.height = cameraVideo.videoHeight;

		if (!canvas.width || !canvas.height) {
			throw new Error('La caméra n’est pas encore prête.');
		}

		canvas.getContext('2d').drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);

		const response = await fetch(uploadEndpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				page: pageNumber,
				image: canvas.toDataURL('image/jpeg', 0.85),
			}),
		});
		const result = await response.json();

		if (!response.ok || !result.success) {
			throw new Error(result.error || 'La photo n’a pas pu être enregistrée.');
		}

		const photoData = { page: result.page, path: result.path };
		const photo = JSON.stringify(photoData);
		let photosByPage = {};

		try {
			photosByPage = JSON.parse(localStorage.getItem('Photos pages')) || {};
		} catch (error) {
			photosByPage = {};
		}

		photosByPage[result.page] = photoData;
		localStorage.setItem('Photos pages', JSON.stringify(photosByPage));
		localStorage.setItem('Photo page actuelle', photo);

		if (localStorage.getItem('Photo page actuelle') !== photo) {
			throw new Error('Le chemin de la photo n’a pas été enregistré.');
		}

		stream.getTracks().forEach((track) => track.stop());
		return result;
	})();

	photoCapturePromises.set(pageNumber, capturePromise);
	return capturePromise;
}

function getAutomaticPhotoPage() {
	if (/\/leaderboard\.php$/i.test(window.location.pathname)) {
		return null;
	}

	const pageMatch = window.location.pathname.match(/page([2-5])\.(?:php|html?)$/i);
	if (pageMatch) {
		return Number(pageMatch[1]);
	}

	const scenarioScript = Array.from(document.scripts).find((script) => script.src.match(/page([2-5])\.js$/i));
	const scriptMatch = scenarioScript?.src.match(/page([2-5])\.js$/i);
	return scriptMatch ? Number(scriptMatch[1]) : null;
}

domReady.then(() => {
	const inscriptionForm = document.getElementById('form-inscription');
	const inscriptionPopup = document.getElementById('popup');
	const firstNameInput = document.getElementById('prenom');
	const lastNameInput = document.getElementById('nom');
	const savedPlayer = readPlayer();

	if (firstNameInput) {
		firstNameInput.value = savedPlayer.prenom || '';
		firstNameInput.addEventListener('input', () => {
			localStorage.setItem(playerStorageKey, JSON.stringify({
				prenom: firstNameInput.value,
				nom: lastNameInput?.value || '',
			}));
		});
	}
	if (lastNameInput) {
		lastNameInput.value = savedPlayer.nom || '';
		lastNameInput.addEventListener('input', () => {
			localStorage.setItem(playerStorageKey, JSON.stringify({
				prenom: firstNameInput?.value || '',
				nom: lastNameInput.value,
			}));
		});
	}

	if (!inscriptionForm || !inscriptionPopup) {
		const pageNumber = getAutomaticPhotoPage();
		if (pageNumber !== null) {
			capturePhotoForPage(pageNumber).catch((error) => console.error(error));
		}
		return;
	}

	inscriptionForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		// enterFullscreen();

		const prenom = document.getElementById('prenom').value.trim();
		const nom = document.getElementById('nom').value.trim();
		const submitButton = inscriptionForm.querySelector('button[type="submit"]');

		submitButton.disabled = true;

		try {
			startPageTiming();
			await capturePhotoForPage(1);
			const startResponse = await fetch('api/start_game.php', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});

			if (!startResponse.ok) {
				throw new Error('La partie ne peut pas être démarrée.');
			}

			localStorage.setItem(playerStorageKey, JSON.stringify({ prenom, nom }));
			inscriptionPopup.style.display = 'none';
			document.body.classList.remove('popup-ouverte');
		} catch (error) {
			alert(error.message);
			submitButton.disabled = false;
		}
	});
});

/* ---- Blocage de la navigation au clavier (touche Tab) ---- */

(function () {
  const CHAMPS_SAISIE = ['INPUT', 'TEXTAREA', 'SELECT'];

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const actif = document.activeElement;

    // On laisse Tab circuler entre les champs d'un même formulaire
    if (actif && CHAMPS_SAISIE.includes(actif.tagName) && actif.form) {
      const champs = Array.from(actif.form.elements)
        .filter((el) => CHAMPS_SAISIE.includes(el.tagName) && !el.disabled);
      const index = champs.indexOf(actif);
      const suivant = e.shiftKey ? champs[index - 1] : champs[index + 1];

      e.preventDefault();
      if (suivant) suivant.focus();
      return;
    }

    // Partout ailleurs : Tab ne fait rien
    e.preventDefault();
  }, true);
})();


/*
function enterFullscreen() {
	fullscreenRequired = true;

	if (fullscreenRetryTimer === null) {
		fullscreenRetryTimer = setInterval(restoreFullscreen, 1000);
	}

	restoreFullscreen();
}

function restoreFullscreen() {
	if (fullscreenRequired && !document.fullscreenElement && document.documentElement.requestFullscreen) {
		document.documentElement.requestFullscreen().catch(() => {});
	}
}

document.addEventListener('fullscreenchange', () => {
	if (fullscreenRequired && !document.fullscreenElement) {
		setTimeout(restoreFullscreen, 0);
	}
});

document.addEventListener('visibilitychange', () => {
	if (document.visibilityState === 'visible') {
		restoreFullscreen();
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'F11' || event.code === 'F11') {
		event.preventDefault();
		event.stopPropagation();
		restoreFullscreen();
	}
}, true);
*/
