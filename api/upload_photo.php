<?php
// Valide les photos prises sur chaque page et renvoie leur contenu complet.
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
if ($page === false || $page < 1 || $page > 6 || $image === '') {
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

// La photo est conservée directement dans la BDD sous forme d’URI data.
$storedImage = 'data:' . $imageInfo['mime'] . ';base64,' . base64_encode($imageData);

sendJson([
    'success' => true,
    'page' => $page,
    'path' => $storedImage,
], 201);
