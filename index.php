<?php
declare(strict_types=1);

$languageHeader = strtolower($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '');
$target = '/en/';

if (preg_match('/\bde\b|de-/', $languageHeader) === 1) {
    $target = '/de/';
}

header('Vary: Accept-Language');
header('Location: ' . $target, true, 302);
exit;
