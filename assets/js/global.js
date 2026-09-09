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

const cameraReady = isFinishPage ? Promise.resolve(null) : domReady.then(() => {
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
const leaveSiteEndpoint = new URL('../../api/leave_site.php', globalScript?.src || document.baseURI).href;

// Formatage du temps écoulé en minutes, secondes et millisecondes
function formatElapsedTime(milliseconds) {
	const minutes = Math.floor(milliseconds / 60000);
	const seconds = Math.floor((milliseconds % 60000) / 1000);

	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function readPageTiming() {
	try {
		return JSON.parse(localStorage.getItem(timingStorageKey)) || null;
	} catch (error) {
		return null;
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

function finalizePageTiming() {
	const timing = readPageTiming();

	if (!timing || !timing.startedAt || timing.stopped) {
		return timing;
	}

	const now = Date.now();
	const elapsedMs = now - timing.lastPageAt;
	const totalTimeMs = timing.pages.reduce((total, currentPage) => total + currentPage.elapsedMs, 0) + elapsedMs;

	timing.pages.push({ page: timing.currentPage || 1, at: now, elapsedMs });
	timing.lastPageAt = now;
	timing.finalTimeMs = totalTimeMs;
	timing.finalTime = formatElapsedTime(totalTimeMs);
	timing.stopped = true;
	timing.stoppedAt = now;
	localStorage.setItem(timingStorageKey, JSON.stringify(timing));

	return timing;
}

function readPlayer() {
	try {
		return JSON.parse(localStorage.getItem('joueur')) || {};
	} catch (error) {
		return {};
	}
}

function readPhotoPaths() {
	try {
		const photos = JSON.parse(localStorage.getItem('Photos pages')) || {};
		return Object.values(photos).map((photo) => photo.path).filter(Boolean);
	} catch (error) {
		return [];
	}
}

async function leaveSite() {
	const timing = finalizePageTiming();
	const player = readPlayer();

	if (!timing) {
		return false;
	}
	const cleanupOnly = timing.stopped;
	if (!cleanupOnly && (!player.prenom || !player.nom)) {
		return false;
	}

	const response = await fetch(leaveSiteEndpoint, {
		method: 'POST',
		keepalive: true,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			first_name: player.prenom || '',
			last_name: player.nom || '',
			final_time_ms: timing.finalTimeMs || 0,
			stopped_at: Number(timing.currentPage) || 1,
			photos: readPhotoPaths(),
			cleanup_only: cleanupOnly,
		}),
	});

	if (!response.ok) {
		throw new Error('La sortie n’a pas pu être enregistrée.');
	}

	localStorage.removeItem('joueur');
	localStorage.removeItem('Temps pages');
	localStorage.removeItem('Photo page');
	localStorage.removeItem('Photos pages');
	return true;
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
		localStorage.setItem('Photo page', photo);

		if (localStorage.getItem('Photo page') !== photo) {
			throw new Error('Le chemin de la photo n’a pas été enregistré.');
		}

		stream.getTracks().forEach((track) => track.stop());
		return result;
	})();

	photoCapturePromises.set(pageNumber, capturePromise);
	return capturePromise;
}

function getAutomaticPhotoPage() {
	if (/\/fin\.php$/i.test(window.location.pathname)) {
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
	const exitButton = document.querySelector('.exit-button');
	if (exitButton) {
		exitButton.addEventListener('click', async (event) => {
			event.preventDefault();
			exitButton.disabled = true;
			try {
				await leaveSite();
				window.location.href = 'about:blank';
			} catch (error) {
				console.error(error);
				exitButton.disabled = false;
			}
		});
	}

	const inscriptionForm = document.getElementById('form-inscription');
	const inscriptionPopup = document.getElementById('popup');

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
			localStorage.setItem('joueur', JSON.stringify({ prenom, nom }));
			inscriptionPopup.style.display = 'none';
			document.body.classList.remove('popup-ouverte');
		} catch (error) {
			alert(error.message);
			submitButton.disabled = false;
		}
	});
});

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
