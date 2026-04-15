<?php
declare(strict_types=1);

$acceptLanguage = strtolower($_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '');
$target = preg_match('/\bde\b|de-/', $acceptLanguage) === 1 ? '/de/' : '/en/';
header('Vary: Accept-Language');
header('Location: ' . $target, true, 302);
exit;
