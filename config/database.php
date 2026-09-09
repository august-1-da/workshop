<?php

declare(strict_types=1);

function getDatabase(): PDO
{
    $databaseDirectory = __DIR__ . DIRECTORY_SEPARATOR . 'data';
    $databasePath = $databaseDirectory . DIRECTORY_SEPARATOR . 'leaderboard.sqlite';

    if (!is_dir($databaseDirectory) && !mkdir($databaseDirectory, 0755, true) && !is_dir($databaseDirectory)) {
        throw new PDOException('Impossible de créer le dossier de la base SQLite.');
    }

    $database = new PDO(
        'sqlite:' . $databasePath,
        null,
        null,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    $schemaPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'schemas.sql';
    $schema = file_get_contents($schemaPath);

    if ($schema === false) {
        throw new PDOException('Impossible de lire le schéma SQLite.');
    }

    $database->exec($schema);

    return $database;
}

function sendJson(array $data, int $statusCode = 200): never
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}