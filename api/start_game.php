<?php

declare(strict_types=1);

session_start();
$_SESSION['game_started'] = true;

header('Content-Type: application/json; charset=utf-8');
echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
