<?php
declare(strict_types=1);

/**
 * Minimalistický SMTP odesílač (bez závislostí / composeru).
 *
 * Podporuje AUTH LOGIN přes STARTTLS (port 587) i implicitní TLS (port 465).
 * Určeno pro nízkoobjemový kontaktní formulář – jeden e-mail na požadavek.
 *
 * Použití:
 *   [$ok, $err] = smtp_send_mail($config, [
 *       'to'       => 'info@webkozar.cz',
 *       'reply_to' => 'zakaznik@example.com',
 *       'subject'  => 'Poptávka z webu: …',
 *       'body'     => "Jméno: …\n…",
 *   ]);
 *
 * Očekávané klíče v $config:
 *   smtp_host, smtp_port, smtp_user, smtp_pass
 *   smtp_secure  => 'tls' (STARTTLS, default) | 'ssl' (implicitní) | '' (žádné)
 *   smtp_from    => adresa v hlavičce From (default mail_from)
 *   smtp_from_name => zobrazované jméno (default 'webkozar')
 */

function smtp_configured(array $config): bool
{
    return !empty($config['smtp_host']) && !empty($config['smtp_user']);
}

/**
 * @return array{0: bool, 1: string} [úspěch, chybová hláška pro error_log]
 */
function smtp_send_mail(array $config, array $mail): array
{
    $host   = (string)($config['smtp_host'] ?? '');
    $port   = (int)($config['smtp_port'] ?? 587);
    $user   = (string)($config['smtp_user'] ?? '');
    $pass   = (string)($config['smtp_pass'] ?? '');
    $secure = strtolower((string)($config['smtp_secure'] ?? 'tls'));
    $from     = (string)($config['smtp_from'] ?? $config['mail_from'] ?? $user);
    $fromName = (string)($config['smtp_from_name'] ?? 'webkozar');

    $to      = (string)($mail['to'] ?? '');
    $replyTo = trim((string)($mail['reply_to'] ?? ''));
    $subject = (string)($mail['subject'] ?? '');
    $body    = (string)($mail['body'] ?? '');

    if ($host === '' || $user === '' || $to === '') {
        return [false, 'smtp_send_mail: chybí host/user/to'];
    }

    // CRLF injection do hlaviček (adresy i předmět čistíme bez ohledu na volajícího).
    $clean = static fn(string $s): string => preg_replace('/[\r\n]+/', ' ', $s);
    $from    = $clean($from);
    $to      = $clean($to);
    $replyTo = $clean($replyTo);
    $subject = $clean($subject);

    $transport = $secure === 'ssl' ? "ssl://{$host}" : $host;
    $ctx = stream_context_create([
        'ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'SNI_enabled' => true],
    ]);

    $errno = 0;
    $errstr = '';
    $fp = @stream_socket_client(
        "{$transport}:{$port}",
        $errno,
        $errstr,
        15,
        STREAM_CLIENT_CONNECT,
        $ctx
    );
    if (!$fp) {
        return [false, "smtp spojení selhalo: {$errstr} ({$errno})"];
    }
    stream_set_timeout($fp, 15);

    // --- pomocné čtení/zápis ---
    // Přečte celou (i víceřádkovou) odpověď serveru; poslední řádek má za
    // třímístným kódem mezeru, průběžné řádky „-".
    $readResp = static function () use ($fp): array {
        $data = '';
        while (($line = fgets($fp, 515)) !== false) {
            $data .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        $code = (int)substr($data, 0, 3);
        return [$code, trim($data)];
    };

    $write = static function (string $cmd) use ($fp): void {
        fwrite($fp, $cmd . "\r\n");
    };

    $expect = static function (array $resp, int ...$ok): bool {
        return in_array($resp[0], $ok, true);
    };

    $fail = static function (string $msg) use ($fp): array {
        @fwrite($fp, "QUIT\r\n");
        @fclose($fp);
        return [false, $msg];
    };

    [$code, $txt] = $readResp();
    if (!$expect([$code], 220)) {
        return $fail("smtp: server neodpověděl 220 ({$txt})");
    }

    $ehloHost = preg_replace('/[^A-Za-z0-9.\-]/', '', $_SERVER['SERVER_NAME'] ?? 'localhost') ?: 'localhost';

    $write('EHLO ' . $ehloHost);
    [$code, $txt] = $readResp();
    if ($code !== 250) {
        return $fail("smtp: EHLO odmítnuto ({$txt})");
    }

    if ($secure === 'tls') {
        $write('STARTTLS');
        [$code, $txt] = $readResp();
        if ($code !== 220) {
            return $fail("smtp: STARTTLS odmítnuto ({$txt})");
        }
        $crypto = @stream_socket_enable_crypto(
            $fp,
            true,
            STREAM_CRYPTO_METHOD_TLS_CLIENT
                | STREAM_CRYPTO_METHOD_TLSv1_1_CLIENT
                | STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT
        );
        if ($crypto !== true) {
            return $fail('smtp: navázání TLS selhalo');
        }
        $write('EHLO ' . $ehloHost);
        [$code, $txt] = $readResp();
        if ($code !== 250) {
            return $fail("smtp: druhé EHLO odmítnuto ({$txt})");
        }
    }

    // --- AUTH LOGIN ---
    $write('AUTH LOGIN');
    [$code, $txt] = $readResp();
    if ($code !== 334) {
        return $fail("smtp: AUTH LOGIN odmítnuto ({$txt})");
    }
    $write(base64_encode($user));
    [$code, $txt] = $readResp();
    if ($code !== 334) {
        return $fail("smtp: uživatelské jméno odmítnuto ({$txt})");
    }
    $write(base64_encode($pass));
    [$code, $txt] = $readResp();
    if ($code !== 235) {
        return $fail("smtp: přihlášení selhalo ({$txt})");
    }

    // --- obálka ---
    $write('MAIL FROM:<' . $from . '>');
    [$code, $txt] = $readResp();
    if ($code !== 250) {
        return $fail("smtp: MAIL FROM odmítnuto ({$txt})");
    }
    $write('RCPT TO:<' . $to . '>');
    [$code, $txt] = $readResp();
    if (!$expect([$code], 250, 251)) {
        return $fail("smtp: RCPT TO odmítnuto ({$txt})");
    }
    $write('DATA');
    [$code, $txt] = $readResp();
    if ($code !== 354) {
        return $fail("smtp: DATA odmítnuto ({$txt})");
    }

    // --- hlavičky + tělo ---
    $date = date('r');
    $msgId = sprintf('<%s.%s@%s>', time(), bin2hex(random_bytes(8)), $ehloHost);
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $encodedFromName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';

    $headers = [
        'Date: ' . $date,
        'Message-ID: ' . $msgId,
        'From: ' . $encodedFromName . ' <' . $from . '>',
        'To: <' . $to . '>',
    ];
    if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }
    $headers[] = 'Subject: ' . $encodedSubject;
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $headers[] = 'Content-Transfer-Encoding: 8bit';

    // Tečkování na začátku řádku (SMTP „dot stuffing") + normalizace konců řádků.
    $normalizedBody = preg_replace('/\r\n|\r|\n/', "\r\n", $body);
    $normalizedBody = preg_replace('/^\./m', '..', $normalizedBody);

    $data = implode("\r\n", $headers) . "\r\n\r\n" . $normalizedBody . "\r\n.";
    $write($data);
    [$code, $txt] = $readResp();
    if ($code !== 250) {
        return $fail("smtp: zpráva nepřijata ({$txt})");
    }

    $write('QUIT');
    @fclose($fp);

    return [true, ''];
}
