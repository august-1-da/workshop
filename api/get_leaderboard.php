<?php
// Récupère le leaderboard depuis la base de données SQLite et renvoie les résultats au format JSON trié par temps final et étape.
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJson(['success' => false, 'error' => 'Méthode non autorisée.'], 405);
}

try {
    $database = getDatabase();
    $statement = $database->query(
        'SELECT id, photo, first_name, last_name, final_time, stopped_at, created_at
         FROM scores
         ORDER BY final_time_ms ASC, stopped_at DESC'
    );

    sendJson(['success' => true, 'scores' => $statement->fetchAll()]);
} catch (PDOException $exception) {
    sendJson(['success' => false, 'error' => 'Impossible de charger le leaderboard.'], 500);
}