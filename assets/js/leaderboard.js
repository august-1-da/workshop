const ETAPE_FINALE = 5;

const etat = document.getElementById('etat-chargement');
const tableau = document.getElementById('classement');
const corps = document.getElementById('classement-corps');
const compteur = document.getElementById('nb-joueurs');

function formaterTemps(temps) {
    const parties = String(temps).split(':');
    if (parties.length !== 3) {
        return temps;
    }
    return `${parties[0]}:${parties[1]}.${parties[2]}`;
}

function creerCellule(contenu, classe) {
    const cellule = document.createElement('td');
    if (classe) {
        cellule.className = classe;
    }
    if (contenu instanceof Node) {
        cellule.appendChild(contenu);
    } else {
        cellule.textContent = contenu;
    }
    return cellule;
}

function creerPhoto(source, nom) {
    if (!source) {
        return document.createTextNode('—');
    }
    const image = document.createElement('img');
    image.className = 'photo-joueur';
    image.src = source;
    image.alt = `Photo de ${nom}`;
    image.loading = 'lazy';
    return image;
}

function creerLigne(score, rang) {
    const ligne = document.createElement('tr');
    const nom = `${score.first_name} ${score.last_name}`.trim();
    const termine = Number(score.stopped_at) >= ETAPE_FINALE;

    if (rang <= 3) {
        ligne.classList.add('podium', `podium-${rang}`);
    }
    if (!termine) {
        ligne.classList.add('abandon');
    }

    ligne.appendChild(creerCellule(String(rang), 'col-rang'));
    ligne.appendChild(creerCellule(creerPhoto(score.photo, nom), 'col-photo'));
    ligne.appendChild(creerCellule(nom));
    ligne.appendChild(creerCellule(
        termine ? 'Terminé' : `Page ${score.stopped_at}`,
        'col-etape'
    ));
    ligne.appendChild(creerCellule(formaterTemps(score.final_time), 'col-temps'));

    return ligne;
}

function afficherErreur(message) {
    etat.textContent = message;
    etat.classList.add('etat-erreur');
    etat.hidden = false;
    tableau.hidden = true;
}

async function chargerClassement() {
    try {
        const reponse = await fetch('api/get_leaderboard.php', {
            headers: { Accept: 'application/json' },
        });
        const donnees = await reponse.json();

        if (!reponse.ok || !donnees.success) {
            afficherErreur(donnees.error || 'Impossible de charger le classement.');
            return;
        }

        const scores = donnees.scores || [];

        if (scores.length === 0) {
            etat.textContent = 'Personne n\u2019est encore sorti.';
            return;
        }

        const fragment = document.createDocumentFragment();
        scores.forEach((score, index) => {
            fragment.appendChild(creerLigne(score, index + 1));
        });

        corps.appendChild(fragment);
        compteur.textContent = `${scores.length} joueur${scores.length > 1 ? 's' : ''}`;
        etat.hidden = true;
        tableau.hidden = false;
    } catch (error) {
        console.error(error);
        afficherErreur('Le serveur n\u2019a pas répondu.');
    }
}

chargerClassement();