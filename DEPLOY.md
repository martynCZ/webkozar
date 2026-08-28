# Nasazení

Web běží na produkci. Nasazuje se přes **SFTP** — buď skriptem `npm run deploy`,
nebo ručně SFTP klientem.

## Rychlá cesta: `npm run deploy`

```
npm run deploy
```

Spustí `npm run build` a pak nahraje obsah `dist/` přes **SFTP** (šifrované)
do složky `/www` na serveru — **včetně `config.php`**. Přenos je šifrovaný,
takže se klíče přenášejí bezpečně; zdroj pravdy je lokální `public/config.php`
(gitignored). Drž ho aktuální — co je v něm, to bude na serveru.

**Jednorázové nastavení:** zkopíruj `deploy/.env.example` → `deploy/.env`
a doplň přístupy:

```
SFTP_HOST=sftp.svethostingu.cz
SFTP_PORT=24
SFTP_USER=...
SFTP_PASS=...
SFTP_REMOTE_DIR=/www
```

`deploy/.env` **není v gitu** (`.gitignore`). Svět hostingu má SFTP na
**portu 24** (ne 22).

- `npm run deploy` — build + nahrání
- `npm run deploy:only` — jen nahrání (build musí proběhnout dřív)

Po nasazení projeď **Kontrolu po nahrání** níže.

## Ruční cesta (SFTP klient)

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
   (včetně `ai-knowledge.json`) a podadresáře s prerenderovanými podstránkami.
   Z markdownů se přibalí **jen `README.md`** (`copyReadme` ve `vite.config.js`);
   `CLAUDE.md`, `AUDIT.md`, `DEPLOY.md` jsou interní a na web nejdou.

2. **Nahrání:** obsah `dist/` nahraj přes SFTP do `/www` (přepiš stávající).
   Nahraj **i podadresáře** `connect/`, `seo-novy-jicin/` atd. a **`.htaccess`**
   — ten servíruje prerenderovaná `<cesta>/index.html` a dělá SPA fallback;
   bez něj by reload podstránky skončil na 404.

3. **`config.php` se nahrává taky.** `dist/config.php` je kopie lokálního
   `public/config.php` (gitignored, drží ostré klíče a hesla) — musí být
   aktuální **před** buildem. `npm run deploy` ho nahraje spolu se vším.
   Vzor pro nový server: `public/config.example.php`; do gitu `config.php`
   nepatří.

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
(`sys_get_temp_dir()`). Když adresář není zapisovatelný, limiter propouští
(fail-open).

Laditelné v `config.php` (bez buildu — stačí nahrát `config.php`):

- `rate_limit_disabled` — `true` úplně vypne limity (jen pro ladění, jinak `false`).
- `ai_rate_burst` — kolik dotazů na AI za 20 s z jedné IP (výchozí 5).
- `ai_rate_hour` — strop dotazů na AI za hodinu z jedné IP (výchozí 60).

Limity jsou **per IP**; za sdílenou IP (kancelář, mobilní CGN NAT) sedí víc
lidí — když uživatelé narážejí na limit, zvedni `ai_rate_hour`.

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
