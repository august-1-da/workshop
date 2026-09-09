<?php
// Récupère les photos prises sur chaque page et les enregistre dans le dossier upload, puis renvoie le chemin de la photo au format JSON.
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['success' => false, 'error' => 'Méthode non autorisée.'], 405);
}
// Récupère les données JSON de la requête POST
$input = json_decode(file_get_contents('php://input'), true);
$input = is_array($input) ? $input : $_POST;
$page = filter_var($input['page'] ?? null, FILTER_VALIDATE_INT);
$image = (string) ($input['image'] ?? '');

// Validation des données
if ($page === false || $page < 1 || $page > 5 || $image === '') {
    sendJson(['success' => false, 'error' => 'Page ou image invalide.'], 422);
}

if (!preg_match('/^data:image\/(jpeg|png|webp);base64,(.+)$/s', $image, $matches)) {
    sendJson(['success' => false, 'error' => 'Format d’image non pris en charge.'], 422);
}

$imageData = base64_decode($matches[2], true);
if ($imageData === false || strlen($imageData) > 8 * 1024 * 1024) {
    sendJson(['success' => false, 'error' => 'Image invalide ou trop volumineuse.'], 422);
}

$imageInfo = getimagesizefromstring($imageData);
if ($imageInfo === false) {
    sendJson(['success' => false, 'error' => 'Le fichier envoyé n’est pas une image valide.'], 422);
}

$extension = match ($imageInfo['mime']) {
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    default => null,
};

if ($extension === null) {
    sendJson(['success' => false, 'error' => 'Type d’image non autorisé.'], 422);
}

// Crée le dossier upload s’il n’existe pas et enregistre l’image
$uploadDirectory = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'upload';
if (!is_dir($uploadDirectory) && !mkdir($uploadDirectory, 0755, true) && !is_dir($uploadDirectory)) {
    sendJson(['success' => false, 'error' => 'Impossible de créer le dossier upload.'], 500);
}

$fileName = sprintf('page-%d-%s.%s', $page, bin2hex(random_bytes(16)), $extension);
$filePath = $uploadDirectory . DIRECTORY_SEPARATOR . $fileName;

if (file_put_contents($filePath, $imageData, LOCK_EX) === false) {
    sendJson(['success' => false, 'error' => 'Impossible d’enregistrer la photo.'], 500);
}

// Envoie la réponse JSON avec le chemin de la photo
sendJson([
    'success' => true,
    'page' => $page,
    'path' => 'upload/' . $fileName,
], 201);
