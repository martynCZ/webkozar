<?php
declare(strict_types=1);

/**
 * Jednoduchý rate limiting podle IP adresy návštěvníka.
 * Stav se drží v dočasných souborech (sys_get_temp_dir), žádná databáze.
 *
 * Web neběží za CDN, takže primární zdroj IP je REMOTE_ADDR; hlavička
 * CF-Connecting-IP se zkouší jen jako levná pojistka, kdyby se to změnilo.
 * X-Forwarded-For se záměrně nepoužívá – bez důvěryhodné proxy se dá podvrhnout.
 */

function rate_limit_client_ip(): string
{
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP']
        ?? $_SERVER['REMOTE_ADDR']
        ?? 'unknown';

    return trim((string)$ip);
}

/**
 * Vrátí true, pokud je požadavek v limitu, false při jeho překročení.
 *
 * Globální vypínač: konstanta RATE_LIMIT_DISABLED === true → limity se
 * přeskočí. Definuje ji endpoint z hodnoty $config['rate_limit_disabled']
 * (viz ai-api.php / send-email.php). Slouží k ladění na produkci; v běžném
 * provozu musí být false / chybět.
 *
 * @param string $bucket         název pravidla (odděluje počítadla různých endpointů)
 * @param int    $maxHits        kolik požadavků se vejde do okna
 * @param int    $windowSeconds  délka okna v sekundách
 */
function rate_limit_ok(string $bucket, int $maxHits, int $windowSeconds): bool
{
    if (defined('RATE_LIMIT_DISABLED') && RATE_LIMIT_DISABLED === true) {
        return true;
    }

    $key  = hash('sha256', $bucket . '|' . rate_limit_client_ip());
    $file = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'rl_' . $key . '.json';

    $now = time();

    $fp = @fopen($file, 'c+');
    if ($fp === false) {
        // Když nejde zapisovat, raději legitimní provoz propustit než blokovat.
        return true;
    }

    try {
        if (!flock($fp, LOCK_EX)) {
            return true;
        }

        $raw    = stream_get_contents($fp);
        $stored = json_decode((string)$raw, true);

        $hits = [];
        if (is_array($stored)) {
            foreach ($stored as $t) {
                if (is_int($t) && ($now - $t) < $windowSeconds) {
                    $hits[] = $t;
                }
            }
        }

        if (count($hits) >= $maxHits) {
            return false;
        }

        $hits[] = $now;

        ftruncate($fp, 0);
        rewind($fp);
        fwrite($fp, json_encode($hits));
        fflush($fp);

        return true;
    } finally {
        flock($fp, LOCK_UN);
        fclose($fp);
    }
}
