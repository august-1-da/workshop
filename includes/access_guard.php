<?php

declare(strict_types=1);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if (empty($_SESSION['game_started'])) {
    header('Location: index.php', true, 302);
    exit;
}
