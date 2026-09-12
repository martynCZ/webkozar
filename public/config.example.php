<?php
// Zkopíruj tento soubor jako config.php a doplň skutečné hodnoty.
// config.php NIKDY necommituj do gitu ani nenahrávej do public složky repozitáře.
return [
    'openai_api_key' => 'sk-...',
    // Model pro AI chat/průvodce. Lze změnit bez zásahu do kódu.
    'openai_model' => 'gpt-4o-mini',
    // Ladicí vypínač rate limitů (ai-api.php + send-email.php).
    // true = limity vypnuté (jen pro testování!). V ostrém provozu false / smazat.
    'rate_limit_disabled' => false,
    // Limity AI asistenta (per IP). Volitelné – výchozí 5 / 20 s a 60 / hod.
    'ai_rate_burst' => 5,
    'ai_rate_hour'  => 60,
    'db_host' => 'localhost',
    'db_name' => 'webkozar_ai',
    'db_user' => 'webkozar',
    'db_pass' => '',
    'mail_to'  => 'info@webkozar.cz',
    'mail_from' => 'info@webkozar.cz',
    // Odesílání formuláře přes autentizované SMTP (lepší doručitelnost než mail()).
    // Vyplň smtp_host + smtp_user pro aktivaci; jinak se použije PHP mail().
    'smtp_host'      => '',            // např. 'smtp.svethostingu.cz'
    'smtp_port'      => 587,           // 587 = STARTTLS, 465 = implicitní TLS
    'smtp_user'      => '',            // obvykle celá e-mailová adresa schránky
    'smtp_pass'      => '',            // heslo ke schránce
    'smtp_secure'    => 'tls',         // 'tls' (STARTTLS) | 'ssl' | '' (bez šifrování)
    'smtp_from'      => 'info@webkozar.cz',  // adresa v hlavičce From (musí sedět s doménou schránky)
    'smtp_from_name' => 'webkozar',
    // Povolené originy pro CORS (bez lomítka na konci)
    'allowed_origins' => [
        'https://webkozar.cz',
        'https://www.webkozar.cz',
    ],
];
