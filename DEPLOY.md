# Nasazení

Web běží na produkci. Nahrává se ručně přes **SFTP / FTPS** (žádný skript).

## Postup

1. **Build:**
   ```
   npm run build
   ```
   Proběhne trojstupňově: klientský build → SSR build do `.ssr-dist/` →
   `scripts/prerender.mjs`, který vygeneruje statické HTML pro každou routu
   z `src/lib/seo.js` (`/`, `/connect`, `/tvorba-webovych-stranek-novy-jicin`,
   `/seo-novy-jicin`, `/webdesign-novy-jicin`) — každá s vlastním `<title>`
   a meta. `.ssr-dist/` se po sobě smaže.
   Ve `dist/` je hotový web (HTML, JS, CSS, obrázky), PHP soubory z `public/`
   a podadresáře s prerenderovanými podstránkami. Z markdownů se přibalí
   **jen `README.md`** (`copyReadme` ve `vite.config.js`); `CLAUDE.md`,
   `AUDIT.md`, `DEPLOY.md` jsou interní a na web nejdou.

2. **Nahrání:** obsah `dist/` nahraj přes SFTP/FTPS do webroot (přepiš stávající).
   Nahraj **i podadresáře** `connect/`, `seo-novy-jicin/` atd. a **`.htaccess`**
   — ten servíruje prerenderovaná `<cesta>/index.html` a dělá SPA fallback;
   bez něj by reload podstránky skončil na 404.

3. **`config.php` NEPŘEPISUJ.** Na serveru leží `config.php` se skutečnými
   klíči a hesly. `dist/config.php` z buildu je jen kopie vzoru z repozitáře —
   při nahrávání ho **vynech**, ať nepřepíšeš ostrou konfiguraci.
   (Vzor je `public/config.example.php`, do gitu `config.php` nepatří.)

4. **Kontrola po nahrání:**
   - `https://webkozar.cz/` – web běží
   - `https://webkozar.cz/seo-novy-jicin` – landing page se načte přímo (ne přes
     SPA fallback); `curl -s … | grep '<title>'` musí vrátit titulek té stránky
   - `https://webkozar.cz/robots.txt` – `Allow: /`
   - `https://webkozar.cz/sitemap.xml` – zobrazí se XML (5 URL)
   - odeslat testovací zprávu z formuláře (musí přijít e-mail)
   - otevřít AI chat a poslat dotaz (musí přijít odpověď)

5. **SEO po nasazení:**
   - Search Console → Kontrola URL → **Požádat o indexování** pro `/` a všechny
     tři landing pages; znovu odeslat `sitemap.xml`.
   - Totéž v **Seznam Webmaster**.
   - Ověřit strukturovaná data: <https://search.google.com/test/rich-results>.

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
