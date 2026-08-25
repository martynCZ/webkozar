<?php
declare(strict_types=1);

$config = require __DIR__ . '/config.php';

// --- CORS: pouze povolené domény ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $config['allowed_origins'], true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Nepovolená metoda.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?: [];

$name    = trim((string)($data['name'] ?? ''));
$email   = trim((string)($data['email'] ?? ''));
$balicek = trim((string)($data['balicek'] ?? ''));
$message = trim((string)($data['message'] ?? ''));

// --- Validace ---
$errors = [];
if ($name === '' || mb_strlen($name) > 100) {
    $errors[] = 'Neplatné jméno.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 254) {
    $errors[] = 'Neplatný e-mail.';
}
if ($message === '' || mb_strlen($message) > 5000) {
    $errors[] = 'Neplatná zpráva.';
}

$balickyMap = [
    'zakladni' => 'Základní web',
    'standard' => 'Standardní web',
    'na-miru'  => 'Web na míru',
];
$balicekLabel = $balickyMap[$balicek] ?? 'Nespecifikováno';

if ($errors) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => implode(' ', $errors)]);
    exit;
}

// --- Ochrana proti header injection ---
// Do hlaviček smí jít jen ověřený e-mail bez CR/LF; jméno do hlaviček nedáváme vůbec.
$safeEmail = preg_replace('/[\r\n]+/', '', $email);

$to      = $config['mail_to'];
$from    = $config['mail_from'];
$subject = 'Poptavka z webu: ' . preg_replace('/[\r\n]+/', ' ', $name);

$body = "Jméno: $name\n"
      . "E-mail: $safeEmail\n"
      . "Balíček: $balicekLabel\n\n"
      . "Zpráva:\n$message\n";

$headers = [
    'From: webkozar <' . $from . '>',
    'Reply-To: ' . $safeEmail,
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
];

$sent = mail(
    $to,
    '=?UTF-8?B?' . base64_encode($subject) . '?=',
    $body,
    implode("\r\n", $headers),
    '-f' . $from
);

if ($sent) {
    echo json_encode(['status' => 'success', 'message' => 'E-mail byl odeslán!']);
} else {
    http_response_code(500);
    error_log('send-email.php: mail() selhalo');
    echo json_encode(['status' => 'error', 'message' => 'Chyba při odesílání.']);
}
