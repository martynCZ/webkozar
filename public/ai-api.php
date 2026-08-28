<?php
declare(strict_types=1);

$config = require __DIR__ . '/config.php';

// Ladicí vypínač rate limitů (config.php: 'rate_limit_disabled' => true).
// V běžném provozu musí být false / chybět.
if (!empty($config['rate_limit_disabled'])) {
    define('RATE_LIMIT_DISABLED', true);
}

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
// Limity počítají per IP – za sdílenou IP (kancelář, mobilní CGN NAT) sedí víc
// lidí, proto je hodinový strop volnější. Lze doladit v config.php bez buildu.
$burstMax = max(1, (int)($config['ai_rate_burst'] ?? 5));
$hourMax  = max(1, (int)($config['ai_rate_hour'] ?? 60));
if (!rate_limit_ok('ai-api-burst', $burstMax, 20) || !rate_limit_ok('ai-api-hour', $hourMax, 3600)) {
    http_response_code(429);
    echo json_encode(["error" => "Vyčerpali jste limit dotazů na AI asistenta. Zkuste to prosím za pár minut, nebo nám napište přes formulář níže či na info@webkozar.cz."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
$userInput = trim((string)($data->message ?? ''));

if ($userInput === '') {
    echo json_encode(["error" => "Nebylo zadáno žádné zadání."]);
    exit;
}

// Limit délky vstupu (ochrana proti zneužití API a nákladům)
if (mb_strlen($userInput) > 2000) {
    $userInput = mb_substr($userInput, 0, 2000);
}

// --- Historie konverzace -----------------------------------------------
// Frontend posílá `history` = pole { role: 'user'|'assistant', content: '...' }
// s předchozími replikami (bez aktuální zprávy). Bereme posledních
// MAX_HISTORY položek, každou ořízneme na MAX_HISTORY_LEN znaků. Cizí role
// a prázdné položky zahazujeme.
$maxHistory = 10;
$maxHistoryLen = 1500;
$history = [];
if (isset($data->history) && is_array($data->history)) {
    foreach ($data->history as $turn) {
        $role = is_object($turn) ? ($turn->role ?? '') : '';
        $content = is_object($turn) ? trim((string)($turn->content ?? '')) : '';
        if (($role === 'user' || $role === 'assistant') && $content !== '') {
            if (mb_strlen($content) > $maxHistoryLen) {
                $content = mb_substr($content, 0, $maxHistoryLen);
            }
            $history[] = ['role' => $role, 'content' => $content];
        }
    }
    if (count($history) > $maxHistory) {
        $history = array_slice($history, -$maxHistory);
    }
}

$db_host = $config['db_host'];
$db_name = $config['db_name'];
$db_user = $config['db_user'];
$db_pass = $config['db_pass'];

$apiKey = $config['openai_api_key'];

// --- Znalosti z jednoho zdroje (ai-knowledge.json) ---------------------
// Když soubor chybí nebo je rozbitý, spadneme na holé minimum, ať asistent
// pořád funguje (jen bez detailů).
$kb = json_decode((string)@file_get_contents(__DIR__ . '/ai-knowledge.json'), true);
if (!is_array($kb)) {
    error_log('ai-api.php: ai-knowledge.json chybí nebo je nevalidní');
    $kb = ['company' => ['name' => 'webkozar'], 'packages' => [], 'faq' => [], 'tone' => [], 'examples' => []];
}

/** Sestaví textový blok znalostí o firmě, ceníku a FAQ pro system prompt. */
function build_knowledge_block(array $kb): string {
    $c = $kb['company'] ?? [];
    $out = "ZNALOSTI O STUDIU webkozar:\n";
    foreach ([
        'obor' => 'Obor', 'pusobnost' => 'Působnost', 'zkusenosti' => 'Zkušenosti',
        'postup' => 'Postup spolupráce', 'doba_dodani' => 'Doba dodání',
        'sluzby_navic' => 'Služby navíc', 'kontakt' => 'Kontakt',
    ] as $key => $label) {
        if (!empty($c[$key])) {
            $out .= "- $label: {$c[$key]}\n";
        }
    }
    if (!empty($c['technologie'])) {
        $out .= '- Technologie: ' . implode(', ', $c['technologie']) . "\n";
    }
    if (!empty($c['reference'])) {
        $out .= '- Reference: ' . implode(', ', $c['reference']) . "\n";
    }

    $out .= "\nCENÍK (ID používej přesně):\n";
    foreach ($kb['packages'] ?? [] as $p) {
        $feat = !empty($p['features']) ? ' – ' . implode(', ', $p['features']) : '';
        $out .= "- {$p['label']} ({$p['cena_text']}), ID: {$p['id']}. {$p['podtitulek']}.$feat\n";
    }

    if (!empty($kb['connect'])) {
        $cn = $kb['connect'];
        $out .= "\n{$cn['nazev']} (klientský portál):\n";
        $out .= "- {$cn['co_to_je']}\n";
        $out .= "- K čemu: {$cn['k_cemu']}\n";
        if (!empty($cn['funkce'])) {
            $out .= '- Funkce: ' . implode('; ', $cn['funkce']) . "\n";
        }
        if (!empty($cn['adresa'])) {
            $out .= "- Adresa: {$cn['adresa']} (detail na webu: {$cn['detail_na_webu']})\n";
        }
    }

    if (!empty($kb['faq'])) {
        $out .= "\nČASTÉ DOTAZY:\n";
        foreach ($kb['faq'] as $f) {
            $out .= "Q: {$f['q']}\nA: {$f['a']}\n";
        }
    }
    return $out;
}

$knowledgeBlock = build_knowledge_block($kb);
$toneBlock = !empty($kb['tone']) ? "\nJAK KOMUNIKOVAT:\n- " . implode("\n- ", $kb['tone']) . "\n" : '';
$refusalBlock = !empty($kb['refusal']) ? "\nMIMO TÉMA: {$kb['refusal']}\n" : '';

$intro = "Jsi AI asistent webového studia webkozar. Pomáháš návštěvníkům webu.\n\n";

// LiveChatWidget.jsx – jediný chat (dřív byl navíc jednorázový wizard v ceníku,
// zrušen; jeho funkci „doporuč balíček + odhad ceny" pokrývá akce odhad_ceny).
$systemPrompt = $intro . $knowledgeBlock . $toneBlock . $refusalBlock . "
ÚKOL: Konverzuj s návštěvníkem, odpovídej na dotazy o webech, cenách a spolupráci.

Odpověz STRIKTNĚ jako validní JSON objekt:
{ \"reply\": \"tvoje formátovaná odpověď\", \"akce\": null }

Klíč \"akce\" nech null, dokud návštěvník jen komunikuje. Když ale JASNĚ projeví
záměr, vyplň akci – frontend ji hned provede a ty v \"reply\" krátce potvrď, cos udělal:
- Chce konkrétní balíček (\"beru standard\", \"chci ten za 15 tisíc\"):
  \"akce\": { \"typ\": \"predvypln_formular\", \"balicek\": \"zakladni|standard|na-miru\" }
  (předvyplní balíček v poptávkovém formuláři a odscrolluje k němu)
- Chce vidět konkrétní sekci webu (\"ukaž ceník\", \"kde máte reference\"):
  \"akce\": { \"typ\": \"prejdi_na\", \"sekce\": \"cenik|kontakt|faq|reference|tvorba|technologie\" }
- Popíše projekt a chce doporučit balíček / odhad ceny:
  \"akce\": { \"typ\": \"odhad_ceny\", \"balicek\": \"zakladni|standard|na-miru\", \"cena\": \"např. 25 000 – 40 000 Kč\", \"zduvodneni\": \"1–2 věty proč\" }
  (frontend ukáže kartu s balíčkem, cenou a tlačítkem Poptat). \"cena\" je odhad
  rozsahu, ne závazná nabídka – to v \"reply\" zmiň.
- Chce nezávaznou nabídku / aby se mu studio ozvalo: poptávku umíš připravit rovnou
  tady v chatu (není nutné jít na formulář). NEJDŘÍV si v běžné konverzaci vyžádej
  jméno a e-mail (telefon nepovinně) a stručně si shrň, co potřebuje. Až tyhle
  údaje máš, vrať:
  \"akce\": { \"typ\": \"navrhnout_poptavku\", \"jmeno\": \"...\", \"email\": \"...\", \"telefon\": \"\", \"balicek\": \"\", \"shrnuti\": \"1–3 věty co klient chce\" }
  (\"balicek\" vyplň jen když je jasný, jinak prázdný řetězec.) Frontend
  návštěvníkovi zobrazí údaje k překontrolování a tlačítko Odeslat – odešle je
  až on sám. V \"reply\" ho vyzvi, ať to zkontroluje a potvrdí tlačítkem.
  Nikdy nepiš, že poptávku vezmete jen přes formulář nebo e-mail – vezmeš ji tady.
Nikdy nevymýšlej jiné hodnoty klíčů. Když si záměrem nejsi jistý, \"akce\": null.";

// Pozn.: `assistant` položky v historii jsou prostý text (frontend si ukládá
// vytažené `reply`, ne surový JSON). Modelu to jako kontext stačí, novou
// odpověď stejně vrací jako JSON (vynuceno `response_format`).
$messages = [["role" => "system", "content" => $systemPrompt]];

// Few-shot příklady správného tónu.
// Volitelný klíč `akce` v příkladu ukazuje modelu i tvar akcí.
foreach ($kb['examples'] ?? [] as $ex) {
    if (!empty($ex['user']) && !empty($ex['assistant'])) {
        $messages[] = ['role' => 'user', 'content' => $ex['user']];
        $messages[] = ['role' => 'assistant', 'content' => json_encode(
            ['reply' => $ex['assistant'], 'akce' => $ex['akce'] ?? null],
            JSON_UNESCAPED_UNICODE
        )];
    }
}

foreach ($history as $turn) {
    $messages[] = $turn;
}
$messages[] = ["role" => "user", "content" => $userInput];

$postData = [
    "model" => $config['openai_model'] ?? 'gpt-4o-mini',
    "response_format" => [ "type" => "json_object" ],
    "messages" => $messages,
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

if (!isset($responseData['choices'][0]['message']['content'])) {
    echo json_encode(["error" => "AI nevrátila správný formát dat."]);
    exit();
}

$aiResponseJson = $responseData['choices'][0]['message']['content'];
$aiParsed = json_decode($aiResponseJson, true);

// Model má vracet validní JSON (vynucujeme přes response_format), ale kdyby
// přesto přišel rozbitý řetězec, neposílej ho do Reactu – ten by ho jen
// zobrazil jako nesmysl. Vrať čitelnou chybu.
if (json_last_error() !== JSON_ERROR_NONE || !is_array($aiParsed)) {
    error_log('ai-api.php: nevalidní JSON od OpenAI: ' . substr((string)$aiResponseJson, 0, 500));
    echo json_encode(["error" => "AI odpověď se nepodařilo zpracovat. Zkuste to prosím znovu."]);
    exit();
}

if (!isset($aiParsed['reply'])) {
    error_log('ai-api.php: v odpovědi chybí klíč "reply"');
    echo json_encode(["error" => "AI vrátila neúplnou odpověď. Zkuste to prosím znovu."]);
    exit();
}

// --- Sanitace akce ----------------------------------------------------
// Model může vrátit `akce`, kterou frontend provede (předvyplní formulář /
// odscrolluje / ukáže kartu). Nikdy nevěř tomu, co přišlo – whitelist typů i hodnot.
$akce = null;
if (isset($aiParsed['akce']) && is_array($aiParsed['akce'])) {
    $typ = $aiParsed['akce']['typ'] ?? '';
    $packageIds = array_column($kb['packages'] ?? [], 'id');
    $sekce = ['cenik', 'kontakt', 'faq', 'reference', 'tvorba', 'technologie', 'connect'];

    if ($typ === 'predvypln_formular'
        && in_array($aiParsed['akce']['balicek'] ?? '', $packageIds, true)) {
        $akce = ['typ' => 'predvypln_formular', 'balicek' => $aiParsed['akce']['balicek']];
    } elseif ($typ === 'prejdi_na'
        && in_array($aiParsed['akce']['sekce'] ?? '', $sekce, true)) {
        $akce = ['typ' => 'prejdi_na', 'sekce' => $aiParsed['akce']['sekce']];
    } elseif ($typ === 'odhad_ceny'
        && in_array($aiParsed['akce']['balicek'] ?? '', $packageIds, true)) {
        $akce = [
            'typ' => 'odhad_ceny',
            'balicek' => $aiParsed['akce']['balicek'],
            'cena' => mb_substr(trim((string)($aiParsed['akce']['cena'] ?? '')), 0, 60),
            'zduvodneni' => mb_substr(trim((string)($aiParsed['akce']['zduvodneni'] ?? '')), 0, 400),
        ];
    } elseif ($typ === 'navrhnout_poptavku') {
        // Návrh leadu z chatu. Odeslání dělá až návštěvník tlačítkem ve frontendu
        // (POST na send-email.php, který má vlastní validaci + rate limit);
        // tady jen očistíme pole.
        $a = $aiParsed['akce'];
        $jmeno = trim((string)($a['jmeno'] ?? ''));
        $email = trim((string)($a['email'] ?? ''));
        $shrnuti = trim((string)($a['shrnuti'] ?? ''));
        $telefon = trim((string)($a['telefon'] ?? ''));
        $balicek = in_array($a['balicek'] ?? '', $packageIds, true) ? $a['balicek'] : '';

        if ($jmeno !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) && $shrnuti !== '') {
            $akce = [
                'typ' => 'navrhnout_poptavku',
                'jmeno' => mb_substr($jmeno, 0, 100),
                'email' => mb_substr($email, 0, 254),
                'telefon' => mb_substr($telefon, 0, 40),
                'balicek' => $balicek,
                'shrnuti' => mb_substr($shrnuti, 0, 2000),
            ];
        }
    }
}

// Zápis do databáze (log konverzace). Selhání logu nesmí shodit odpověď.
$dbLogText = $aiParsed['reply'];

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("INSERT INTO ai_chat_logs (user_message, ai_response) VALUES (:umsg, :aresp)");
    $stmt->execute([
        ':umsg' => $userInput,
        ':aresp' => $dbLogText
    ]);
} catch (PDOException $e) {
    error_log('ai-api.php: logování do DB selhalo: ' . $e->getMessage());
}

// Odeslání odpovědi zpět do Reactu – přeskládaný objekt se sanitovanou akcí.
echo json_encode(['reply' => $aiParsed['reply'], 'akce' => $akce], JSON_UNESCAPED_UNICODE);
?>
