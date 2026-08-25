# Nasazení

## Jednorázově na serveru
1. Zkopíruj `public/config.example.php` jako `config.php` a doplň skutečné hodnoty
   (OpenAI klíč, heslo k DB, povolené domény).
2. `config.php` je v `.gitignore` – nikdy se necommituje.

## Staging (new.webkozar.cz)
```
npm run deploy
```
`FTP_REMOTE_ROOT` není nastaven → použije se `/new` a automaticky se nasadí
`robots.txt` s `Disallow: /`, aby staging nekonkuroval ostrému webu ve vyhledávání.

## Produkce (webkozar.cz)
V `.env` nastav:
```
FTP_REMOTE_ROOT=/
```
pak `npm run deploy`. Nasadí se `robots.txt`, který indexaci povoluje.

### Po přechodu na ostrou doménu
- Přidat web do Google Search Console + Seznam Webmaster a odeslat `sitemap.xml`.
- Ověřit strukturovaná data: https://search.google.com/test/rich-results
- Ze starého WordPressu nastavit 301 přesměrování na nové URL.
