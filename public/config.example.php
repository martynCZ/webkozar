<?php
// Zkopíruj tento soubor jako config.php a doplň skutečné hodnoty.
// config.php NIKDY necommituj do gitu ani nenahrávej do public složky repozitáře.
return [
    'openai_api_key' => 'sk-...',
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
