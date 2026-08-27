# Nasazení

Web běží na produkci. Nahrává se ručně přes **SFTP / FTPS** (žádný skript).

## Postup

1. **Build:**
   ```
   npm run build
   ```
   Vznikne složka `dist/` s hotovým webem (HTML, JS, CSS, obrázky) a s PHP
   soubory z `public/` (`send-email.php`, `ai-api.php`, `_ratelimit.php`).

2. **Nahrání:** obsah `dist/` nahraj přes SFTP/FTPS do webroot na hostingu
   (přepiš stávající soubory).

3. **`config.php` NEPŘEPISUJ.** Na serveru leží `config.php` se skutečnými
   klíči a hesly. `dist/config.php` z buildu je jen kopie vzoru z repozitáře —
   při nahrávání ho **vynech**, ať nepřepíšeš ostrou konfiguraci.
   (Vzor je `public/config.example.php`, do gitu `config.php` nepatří.)

4. **Kontrola po nahrání:**
   - `https://webkozar.cz/` – web běží
   - `https://webkozar.cz/robots.txt` – `Allow: /`
   - `https://webkozar.cz/sitemap.xml` – zobrazí se XML
   - odeslat testovací zprávu z formuláře (musí přijít e-mail)
   - otevřít AI chat a poslat dotaz (musí přijít odpověď)

## config.php (hesla a API klíče)

Ve stejné složce jako `ai-api.php` musí na serveru ležet `config.php`
se skutečnými hodnotami (OpenAI klíč, přístup k DB, e-maily, `allowed_origins`).
Vzor: `public/config.example.php`.

## Rate limiting

`_ratelimit.php` si drží počítadla v dočasném adresáři serveru
(`sys_get_temp_dir()`). Nic se nekonfiguruje; když adresář není zapisovatelný,
limiter propouští (fail-open).

## Po větších změnách / při přechodu na jinou URL strukturu

- **301 přesměrování** ze starých URL na nové (onepage → `/` nebo na kotvy),
  ideálně přes `.htaccess`.
- Google Search Console + Seznam Webmaster: odeslat `sitemap.xml`.
- Ověřit strukturovaná data: https://search.google.com/test/rich-results
- Ověřit náhled sdílení: https://www.opengraph.xyz/

## Staging / subdomény

Pokud vznikne testovací subdoména (např. `new.webkozar.cz`), musí mít
`robots.txt` s `Disallow: /` a hlavičku `X-Robots-Tag: noindex`, jinak
vznikne duplicitní obsah.
