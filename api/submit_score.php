<?php
// Vérifie que la requête est de type GET, puis récupère le leaderboard depuis la base de données SQLite et renvoie les résultats au format JSON trié par temps final et étape.
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['success' => false, 'error' => 'Méthode non autorisée.'], 405);
}
// Récupère les données JSON de la requête POST
$input = json_decode(file_get_contents('php://input'), true);
$input = is_array($input) ? $input : $_POST;

$firstName = trim((string) ($input['first_name'] ?? ''));
$lastName = trim((string) ($input['last_name'] ?? ''));
$finalTime = trim((string) ($input['final_time'] ?? ''));
$photo = trim((string) ($input['photo'] ?? ''));
$stoppedAt = filter_var($input['stopped_at'] ?? null, FILTER_VALIDATE_INT);

// Validation des données
if ($photo === '') {
    sendJson(['success' => false, 'error' => 'Une photo est obligatoire.'], 422);
}

if ($firstName === '' || $lastName === '' || $finalTime === '' || $stoppedAt === false) {
    sendJson(['success' => false, 'error' => 'Tous les champs sont obligatoires.'], 422);
}

if (mb_strlen($firstName) > 80 || mb_strlen($lastName) > 80) {
    sendJson(['success' => false, 'error' => 'Le nom ou le prénom est trop long.'], 422);
}

if ($stoppedAt < 1 || $stoppedAt > 5) {
    sendJson(['success' => false, 'error' => 'L’étape doit être comprise entre 1 et 5.'], 422);
}

if (!preg_match('/^(\d{1,3}):([0-5]\d):(\d{3})$/', $finalTime, $timeParts)) {
    sendJson(['success' => false, 'error' => 'Le temps doit respecter le format MM:SS:mmm.'], 422);
}

$finalTimeMs = ((int) $timeParts[1] * 60 * 1000)
    + ((int) $timeParts[2] * 1000)
    + (int) $timeParts[3];

if (!preg_match('/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+\/=]+)$/', $photo, $photoParts)) {
    sendJson(['success' => false, 'error' => 'La photo doit être envoyée au format image.'], 422);
}

$photoData = base64_decode($photoParts[2], true);
if ($photoData === false || strlen($photoData) > 8 * 1024 * 1024 || getimagesizefromstring($photoData) === false) {
    sendJson(['success' => false, 'error' => 'La photo est trop volumineuse.'], 422);
}

// Enregistre le score dans la base de données SQLite
try {
    $database = getDatabase();
    $statement = $database->prepare(
        'INSERT INTO scores (photo, first_name, last_name, final_time, final_time_ms, stopped_at)
         VALUES (:photo, :first_name, :last_name, :final_time, :final_time_ms, :stopped_at)'
    );
    $statement->execute([
        ':photo' => $photo,
        ':first_name' => $firstName,
        ':last_name' => $lastName,
        ':final_time' => $finalTime,
        ':final_time_ms' => $finalTimeMs,
        ':stopped_at' => $stoppedAt,
    ]);

    sendJson(['success' => true, 'id' => (int) $database->lastInsertId()], 201);
} catch (PDOException $exception) {
    sendJson(['success' => false, 'error' => 'Impossible d’enregistrer le score.'], 500);
}