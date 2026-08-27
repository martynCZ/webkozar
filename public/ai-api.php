<?php
declare(strict_types=1);

$config = require __DIR__ . '/config.php';
require __DIR__ . '/_ratelimit.php';

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
    echo json_encode(["error" => "Nepovolená metoda."]);
    exit;
}

// --- Rate limiting: CORS chrání jen prohlížeč, ne přímé volání přes curl. ---
// Krátký burst limit (rychlé mačkání) + hodinový strop (ochrana nákladů OpenAI).
if (!rate_limit_ok('ai-api-burst', 3, 20) || !rate_limit_ok('ai-api-hour', 15, 3600)) {
    http_response_code(429);
    echo json_encode(["error" => "Příliš mnoho dotazů. Zkuste to prosím za chvíli."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
$userInput = trim((string)($data->message ?? ''));
$requestType = ($data->type ?? 'chat') === 'wizard' ? 'wizard' : 'chat';

if ($userInput === '') {
    echo json_encode(["error" => "Nebylo zadáno žádné zadání."]);
    exit;
}

// Limit délky vstupu (ochrana proti zneužití API a nákladům)
if (mb_strlen($userInput) > 2000) {
    $userInput = mb_substr($userInput, 0, 2000);
}

$db_host = $config['db_host'];
$db_name = $config['db_name'];
$db_user = $config['db_user'];
$db_pass = $config['db_pass'];

$apiKey = $config['openai_api_key'];

// SPOLEČNÉ ZNALOSTI PRO OBA REŽIMY
$baseKnowledge = "Jsi přátelský, vysoce profesionální a moderní AI asistent webového studia 'webkozar' (působící primárně v oblastech Nový Jičín a Ostrava).
ZNALOSTI O FIRMĚ: Jsme firma s více než 10 lety zkušeností. Tvoříme moderní, rychlé a responzivní weby. Pro design využíváme Figma. Pracujeme s WordPressem, Reactem. Dbáme na SEO (Analytics, Search Console). Tvorba trvá 2-6 týdnů. Reference: Okna Jančálek, Baspyr Glass, F.S.C. Bezpečnostní poradenství, ZŠ a MŠ Hladké Životice.
CENÍK: 
1. 'Základní web' (od 10 000 Kč) - pro osobní vizitky, do 5 stránek. ID: zakladni
2. 'Standardní web' (od 15 000 Kč) - pro firmy, pokročilé SEO, do 15 stránek. ID: standard
3. 'Web na míru' (od 25 000 Kč) - Komplexní řešení, portály, e-shopy, napojení na systémy. ID: na-miru
";

// ROZDĚLENÍ PROMPTŮ PODLE TOHO, Z KTERÉ KOMPONENTY POŽADAVEK PŘIŠEL
if ($requestType === 'wizard') {
    // ---------------------------------------------
    // TOTO SE SPUSTÍ PRO AIChatbot.jsx (PRŮVODCE)
    // ---------------------------------------------
    $systemPrompt = $baseKnowledge . "
Tvým úkolem je na základě popisu projektu od klienta vybrat nejvhodnější balíček z našeho ceníku a odhadnout cenu.

Odpověz STRIKTNĚ jako validní JSON objekt s TĚMITO TŘEMI klíči:
- 'doporuceni': Krátké (1-2 odstavce) zdůvodnění, proč doporučuješ daný balíček, psané přátelsky přímo klientovi.
- 'cena': Odhadovaná cena (např. 'od 15 000 Kč' nebo '25 000 - 40 000 Kč').
- 'balicek': Přesné ID doporučeného balíčku (musí být striktně 'zakladni', 'standard' nebo 'na-miru').";

} else {
    // ---------------------------------------------
    // TOTO SE SPUSTÍ PRO LiveChatWidget.jsx (BUBLINA)
    // ---------------------------------------------
    $systemPrompt = $baseKnowledge . "
Tvým úkolem je komunikovat s návštěvníky webu, zodpovídat jejich dotazy a pomáhat jim.
PRAVIDLA KOMUNIKACE: Odpovídej VŽDY česky, energicky, ale slušně a přirozeně. Nepiš dlouhé slohy. Důležité pojmy piš **tučně**. Pokud klient chce přesnou cenovou nabídku nad rámec ceníku, požádej ho, ať nám zanechá kontakt. Nevymýšlej si služby.

Odpověz STRIKTNĚ jako validní JSON objekt s JEDNÍM jediným klíčem 'reply', který bude obsahovat tvou zprávu:
{
  \"reply\": \"Tvá formátovaná konverzační odpověď klientovi.\"
}";
}

$postData = [
    "model" => "gpt-4o-mini",
    "response_format" => [ "type" => "json_object" ],
    "messages" => [
        ["role" => "system", "content" => $systemPrompt],
        ["role" => "user", "content" => $userInput]
    ],
    "temperature" => 0.7
];

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . $apiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(["error" => "Chyba API OpenAI."]);
    exit();
}

$responseData = json_decode($response, true);

if (isset($responseData['choices'][0]['message']['content'])) {
    
    $aiResponseJson = $responseData['choices'][0]['message']['content'];
    $aiParsed = json_decode($aiResponseJson, true);
    
    // Zápis do databáze
    $dbLogText = ($requestType === 'wizard') 
        ? ($aiParsed['doporuceni'] ?? 'Chyba v parsování odpovědi (wizard)') 
        : ($aiParsed['reply'] ?? 'Chyba v parsování odpovědi (chat)');

    try {
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $pdo->prepare("INSERT INTO ai_chat_logs (user_message, ai_response) VALUES (:umsg, :aresp)");
        $stmt->execute([
            ':umsg' => $userInput,
            ':aresp' => $dbLogText
        ]);
    } catch(PDOException $e) {
        
    }
    
    // Odeslání odpovědi zpět do Reactu
    echo $aiResponseJson;

} else {
    echo json_encode(["error" => "AI nevrátila správný formát dat."]);
}
?>
