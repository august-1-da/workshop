<?php

declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'database.php';

function writeLeaveLog(string $message, array $context = []): void
{
    $logDirectory = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'log';
    if (!is_dir($logDirectory)) {
        mkdir($logDirectory, 0755, true);
    }

    $entry = [
        'at' => date('c'),
        'message' => $message,
        ...$context,
    ];
    file_put_contents(
        $logDirectory . DIRECTORY_SEPARATOR . 'leave_site.log',
        json_encode($entry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    writeLeaveLog('Requête refusée : méthode HTTP invalide.', [
        'method' => $_SERVER['REQUEST_METHOD'] ?? null,
    ]);
    sendJson(['success' => false, 'error' => 'Méthode non autorisée.'], 405);
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
$input = is_array($input) ? $input : $_POST;
$firstName = trim((string) ($input['first_name'] ?? ''));
$lastName = trim((string) ($input['last_name'] ?? ''));
$finalTimeMs = filter_var($input['final_time_ms'] ?? null, FILTER_VALIDATE_INT);
$stoppedAt = filter_var($input['stopped_at'] ?? null, FILTER_VALIDATE_INT);
$photos = is_array($input['photos'] ?? null) ? $input['photos'] : [];
$cleanupOnly = (bool) ($input['cleanup_only'] ?? false);

writeLeaveLog('Requête de sortie reçue.', [
    'method' => $_SERVER['REQUEST_METHOD'],
    'first_name' => $firstName,
    'last_name' => $lastName,
    'final_time_ms' => $finalTimeMs,
    'stopped_at' => $stoppedAt,
    'photo_count' => count($photos),
    'cleanup_only' => $cleanupOnly,
    'body_size' => strlen($rawInput),
]);

if (!$cleanupOnly && ($firstName === '' || $lastName === '' || $finalTimeMs === false || $finalTimeMs < 0 || $stoppedAt === false)) {
    writeLeaveLog('Échec : données de sortie invalides.');
    sendJson(['success' => false, 'error' => 'Données de sortie invalides.'], 422);
}

if (!$cleanupOnly && (mb_strlen($firstName) > 80 || mb_strlen($lastName) > 80 || $stoppedAt < 1 || $stoppedAt > 5)) {
    writeLeaveLog('Échec : données de sortie hors limites.');
    sendJson(['success' => false, 'error' => 'Données de sortie invalides.'], 422);
}

$finalTime = '';
$storedPhoto = 'assets/img/image.png';
if (!$cleanupOnly) {
    $minutes = intdiv($finalTimeMs, 60000);
    $seconds = intdiv($finalTimeMs % 60000, 1000);
    $milliseconds = $finalTimeMs % 1000;
    $finalTime = sprintf('%02d:%02d:%03d', $minutes, $seconds, $milliseconds);

    foreach ($photos as $photo) {
        if (is_string($photo) && preg_match('/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+\/=]+)$/', $photo, $photoParts)) {
            $photoData = base64_decode($photoParts[2], true);
            if ($photoData !== false && strlen($photoData) <= 8 * 1024 * 1024 && getimagesizefromstring($photoData) !== false) {
                $storedPhoto = $photo;
                break;
            }
        }
    }
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
            ':photo' => $storedPhoto,
            ':first_name' => $firstName,
            ':last_name' => $lastName,
            ':final_time' => $finalTime,
            ':final_time_ms' => $finalTimeMs,
            ':stopped_at' => $stoppedAt,
        ]);
    }

    foreach ($photos as $photo) {
        // Les photos sont maintenant stockées dans la BDD par submit_score.php.
        if (!is_string($photo) || str_starts_with($photo, 'data:image/')) {
            continue;
        }

        $photoPath = parse_url($photo, PHP_URL_PATH);
        $photoPath = $photoPath === null ? null : ltrim($photoPath, '/');
        if ($photoPath === null || !str_starts_with($photoPath, 'upload/')) {
            continue;
        }

        $filePath = $uploadDirectory . DIRECTORY_SEPARATOR . basename($photoPath);
        if (is_file($filePath)) {
            unlink($filePath);
        }
    }

    $insertedId = $cleanupOnly ? null : (int) $database->lastInsertId();
    writeLeaveLog('Sortie traitée avec succès.', [
        'inserted_id' => $insertedId,
        'cleanup_only' => $cleanupOnly,
    ]);
    sendJson(['success' => true, 'id' => $insertedId], 201);
} catch (PDOException $exception) {
    writeLeaveLog('Échec base de données.', [
        'error' => $exception->getMessage(),
    ]);
    sendJson(['success' => false, 'error' => 'Impossible d’enregistrer la sortie.'], 500);
}
