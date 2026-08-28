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
    // Povolené originy pro CORS (bez lomítka na konci)
    'allowed_origins' => [
        'https://webkozar.cz',
        'https://www.webkozar.cz',
    ],
];
