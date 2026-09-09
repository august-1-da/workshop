<?php

declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['success' => false, 'error' => 'Méthode non autorisée.'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$input = is_array($input) ? $input : $_POST;
$firstName = trim((string) ($input['first_name'] ?? ''));
$lastName = trim((string) ($input['last_name'] ?? ''));
$finalTimeMs = filter_var($input['final_time_ms'] ?? null, FILTER_VALIDATE_INT);
$stoppedAt = filter_var($input['stopped_at'] ?? null, FILTER_VALIDATE_INT);
$photos = is_array($input['photos'] ?? null) ? $input['photos'] : [];
$cleanupOnly = (bool) ($input['cleanup_only'] ?? false);

if (!$cleanupOnly && ($firstName === '' || $lastName === '' || $finalTimeMs === false || $finalTimeMs < 0 || $stoppedAt === false)) {
    sendJson(['success' => false, 'error' => 'Données de sortie invalides.'], 422);
}

if (!$cleanupOnly && (mb_strlen($firstName) > 80 || mb_strlen($lastName) > 80 || $stoppedAt < 1 || $stoppedAt > 5)) {
    sendJson(['success' => false, 'error' => 'Données de sortie invalides.'], 422);
}

$finalTime = '';
if (!$cleanupOnly) {
    $minutes = intdiv($finalTimeMs, 60000);
    $seconds = intdiv($finalTimeMs % 60000, 1000);
    $finalTime = sprintf('%02d:%02d.000', $minutes, $seconds);
}
$uploadDirectory = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'upload';
$defaultPhoto = 'assets/img/icon.png';

try {
    $database = getDatabase();
    if (!$cleanupOnly) {
        $statement = $database->prepare(
            'INSERT INTO scores (photo, first_name, last_name, final_time, final_time_ms, stopped_at)
             VALUES (:photo, :first_name, :last_name, :final_time, :final_time_ms, :stopped_at)'
        );
        $statement->execute([
            ':photo' => $defaultPhoto,
            ':first_name' => $firstName,
            ':last_name' => $lastName,
            ':final_time' => $finalTime,
            ':final_time_ms' => $finalTimeMs,
            ':stopped_at' => $stoppedAt,
        ]);
    }

    foreach ($photos as $photo) {
        $photoPath = is_string($photo) ? parse_url($photo, PHP_URL_PATH) : null;
        $photoPath = $photoPath === null ? null : ltrim($photoPath, '/');
        if ($photoPath === null || !str_starts_with($photoPath, 'upload/')) {
            continue;
        }

        $filePath = $uploadDirectory . DIRECTORY_SEPARATOR . basename($photoPath);
        if (is_file($filePath)) {
            unlink($filePath);
        }
    }

    sendJson(['success' => true, 'id' => $cleanupOnly ? null : (int) $database->lastInsertId()], 201);
} catch (PDOException $exception) {
    sendJson(['success' => false, 'error' => 'Impossible d’enregistrer la sortie.'], 500);
}
