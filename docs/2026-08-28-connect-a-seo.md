# Práce 2026-08-28 — Webkozar Connect v prezentaci + komplexní SEO

Shrnutí dne, ať víme, kde jsme, co je nasazené a co ještě zkontrolovat.

---

## 1. Sekce a stránka „Webkozar Connect"

Prezentace klientského portálu (repo `prace.webkozar.cz`) na webkozar.cz —
**vždy jen z pohledu zákazníka**, admin pohled se záměrně nedává.

- **Teaser na homepage:** `src/components/WebkozarConnect.jsx`, v `Home` pod
  `<Technologies />`. Vrstvené „okno prohlížeče" + plovoucí kartička stavů,
  4 mini-featury, `<RequestLifecycle>` band, 2 CTA.
- **Samostatná stránka `/connect`:** `src/pages/ConnectPage.jsx`. Hero,
  3 feature řádky se screenshoty, `<RequestLifecycle>`, `<ChaosVsConnect>`
  (před/po e-mail vs. portál), 6 perků, „Dva pohledy" (Seznam / Kanban), CTA.
- **Sdílené:** `src/components/BrowserFrame.jsx` (`BrowserFrame`, `Shot`,
  `SCREENSHOTS_AVAILABLE`), `RequestLifecycle.jsx`, `ChaosVsConnect.jsx`.
- **Screenshoty:** `public/connect/` — `prehled/fakturace/seznam/kanban.webp`,
  `sablony/detail.jpg`. Všechny 16:9 výřezy, `SCREENSHOTS_AVAILABLE = true`.
  Nové screeny = přepsat soubory pod stejnými názvy.

### Přechod na react-router

Web byl onepage bez routeru. Přidán `react-router-dom` v7:
- `src/main.jsx` — `<BrowserRouter>`.
- `src/App.jsx` — shell (Header/Footer/pozadí/loader) + `<Routes>` +
  `ScrollManager` (scroll na kotvu / nahoru při změně routy).
- `src/pages/Home.jsx` — sekce homepage vytažené z App.
- `src/lib/navLinks.js` — položky mají `hash` (sekce) nebo `to` (routa).
- `Header.jsx` / `Footer.jsx` — kotvy mimo `/` vedou na `/<hash>`.
- `CtaButton.jsx` — umí `to` (render `<Link>`) vedle `href`.

### Navigace v hlavičce

- **Scroll-spy:** aktivní sekce se počítá ze scroll pozice (čára 35 % pod
  horním okrajem). Každá sledovaná sekce „platí" až do začátku další —
  teaser `#connect` tak spadne pod „Technologie". Poslední sekce končí svým
  koncem → v kontaktním formuláři a na Heru se nezvýrazňuje nic. Jen na `/`.
- **„Connect"** je poslední položka, za tenkým svislým oddělovačem, s ikonou
  `LayoutDashboard`, tyrkysový text bez rámečku, hover = tyrkysové pozadí;
  na `/connect` plná tyrkysová + podtržení.
- **„Kontaktujte nás"** = `CtaButton compact` (`px-4 py-2`, **netučné**).

---

## 2. Balíček u referencí (hover)

`src/components/Reference.jsx` — ke každé z 14 referencí přidáno pole `balicek`
a chip vlevo dole na fotce, který se objeví při najetí (jako „Zobrazit projekt").
Hodnoty: „Základní web" / „Standardní web" / „Řešení na míru".

---

## 3. Komplexní SEO

Podnět: Search Console ukázala zobrazení bez prokliků na fráze „… nový jičín"
(`seo nový jičín`, `tvorba webových stránek nový jičín`, `webdesign nový jičín`…).
Cílíme na Nový Jičín (ne Ostravu), tři služby chtějí tři stránky.

### 3a. Prerender (SPA → statické HTML)

`npm run build` běží trojstupňově:
1. `vite build` (klient)
2. `vite build --ssr src/entry-server.jsx --outDir .ssr-dist`
3. `node scripts/prerender.mjs` — vyrenderuje `App` pod `StaticRouter`
   (`renderToString`), vloží do šablony `dist/index.html`, vymění
   `<title>` / description / canonical / og per routa, zapíše
   `dist/<cesta>/index.html`. `.ssr-dist/` se smaže.

Bez Puppeteeru, žádná runtime závislost navíc. `main.jsx` dál používá
`createRoot().render()` (ne hydrate) — klient prerenderované HTML přepíše,
žádné hydration warningy (ověřeno: 0 chyb v konzoli).

- `src/entry-server.jsx` — `StaticRouter` je v RR7 v `react-router`
  (ne `react-router-dom/server`).
- `shouldShowIntro()` v `App.jsx` vrací `false` když `typeof window === 'undefined'`
  → loader se do prerenderu nedostane.
- `vite.config.js` — plugin `copyReadme` (jen klient build), do `dist/`
  z markdownů jde **jen README.md**.

### 3b. Landing pages pro top fráze

Nové routy + prerenderované stránky:
- `/tvorba-webovych-stranek-novy-jicin`
- `/seo-novy-jicin`
- `/webdesign-novy-jicin`

`src/pages/ServiceLanding.jsx` (šablona, `variant` prop) + obsah v
`src/lib/serviceLanding.js` (~500 slov / stránka, lokální text, „Proč webkozar",
3 FAQ, prolinky). Vlastní `Service` + `BreadcrumbList` + `FAQPage` JSON-LD.
Šířka obsahu = `max-w-5xl` (jako header), delší odstavce zúžené na `max-w-3xl`.
Odkazované z patičky (sloupec „Služby") a v `sitemap.xml`.

### 3c. Meta a strukturovaná data

- `src/lib/seo.js` — jediný zdroj titulků/popisků per routa (`PAGE_META`).
  `src/lib/usePageMeta.js` je nastavuje za běhu; prerender při buildu.
  `Home.jsx` i `ConnectPage.jsx` volají `usePageMeta(...)`.
- `index.html`: nový `<title>` „Tvorba webových stránek a SEO Nový Jičín | webkozar",
  nový description, geo meta (Nový Jičín 49.5946;18.0106), přidané
  `Organization` + `WebSite` JSON-LD, `ProfessionalService` rozšířen o
  `image`/`logo`/`priceRange`/`geo`/`sameAs`.
- **`FAQPage` JSON-LD přesunut z `index.html` do `Faq.jsx`** — generuje se z pole
  `faqs`, drží se tak v souladu s viditelným obsahem; landing pages nenesou
  cizí FAQ. (Ruší i past z CLAUDE.md o rozcházení JSON-LD s Faq.jsx.)
- `public/sitemap.xml` — 5 URL, `lastmod` 2026-08-28.

### 3d. Loader

`src/components/LoadingScreen.jsx` — progress 0,45 s, exit 0,4 s, pojistka
600 ms (bylo ~2,5 s). Kvůli LCP / Core Web Vitals.

---

## 4. Nasazení / `.htaccess`

`public/.htaccess` (jde do `dist/`, nahrává se do webrootu):
- kanonizace www → bez www a http → https (jedním 301, `.well-known` vyňato),
- **prerenderované podstránky**: složka s `index.html` → servíruje se přímo
  i pro `/cesta` bez lomítka (žádný 301 na `/cesta/`), + `DirectoryIndex index.html`,
- SPA fallback pro neznámé cesty → kořenový `index.html`,
- zákaz HTTP přístupu k `config.php` / `config.example.php` / `_ratelimit.php`
  + skryté/zálohové soubory,
- `Options -Indexes`,
- bezpečnostní hlavičky (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`),
- cache: `assets/*` rok + immutable, obrázky týden, HTML `no-cache`, xml/txt den,
- gzip komprese, MIME typy pro `.webp`/`.avif`/`.woff2`/`.mjs`,
- **zakomentované, k vědomému zapnutí:** HSTS a CSP starter.

### Vyřešený 403 na `/connect`

Živý web měl `connect/` jen se screenshoty, bez `index.html` → `Options -Indexes`
→ 403. Nový build přidává `dist/connect/index.html` (a landing dirs), `.htaccess`
je servíruje přímo. **Fix je součástí nového buildu — po nasazení `/connect`
funguje.**

`DEPLOY.md` aktualizován (nový build flow, nahrát i podadresáře, po nasazení
Požádat o indexování).

---

## Stav nasazení

- **Nasazeno** (uživatel dnes): build s Connect sekcí + SEO overhaul + oprava 403.
  `webkozar.cz/seo-novy-jicin` je živě.
- **Ještě nenasazeno** (změny po posledním deploy): rozšíření šířky landing pages
  na `max-w-5xl`. → při příštím deploy stačí znovu `npm run build` + nahrát `dist/`.

## Co zkontrolovat / dodělat

### V kódu — po příštím buildu ověřit
- `npm run lint` a `npm run build` procházejí (prerenderuje 5 rout).
- `dist/<cesta>/index.html` mají vlastní `<title>` a plný obsah (loader tam není).
- Po nasazení: `curl -s https://webkozar.cz/seo-novy-jicin | grep '<title>'` →
  titulek té stránky (ne SPA fallback), `/connect` nevrací 403.

### Mimo kód — musí udělat uživatel (často větší dopad než kód)
- **Google Business Profile** — kategorie „Webový designér", oblast služeb
  Nový Jičín, fotky, příspěvky. Největší lokální páka pro „[služba] nový jičín".
- **Firmy.cz** (Seznam) — zápis + konzistentní NAP (jméno/adresa/telefon).
- **Recenze** na GBP i Firmy.cz.
- Po nasazení: Search Console → Kontrola URL → **Požádat o indexování** pro `/`
  a 3 landing pages; znovu odeslat `sitemap.xml`. Totéž v **Seznam Webmaster**.
- Ověřit strukturovaná data: <https://search.google.com/test/rich-results>.
- Za pár týdnů zkontrolovat v Search Console pozice/prokliky na sledované fráze.

### Volitelná další vylna
- V `.htaccess` zvážit zapnutí HSTS (až bude HTTPS 100% jisté) a CSP.
- `ProfessionalService.hasOfferCatalog` v `index.html` pořád ručně duplikuje
  ceny z `Pricing.jsx` (past z CLAUDE.md) — případně přesunout do komponenty.
- Další landing pages / blog na long-tail, pokud se první tři osvědčí.

---

## Klíčové soubory (rychlá orientace)

| Oblast | Soubory |
|---|---|
| Prerender | `scripts/prerender.mjs`, `src/entry-server.jsx`, `vite.config.js`, `package.json` (`build`) |
| SEO meta | `src/lib/seo.js`, `src/lib/usePageMeta.js`, `index.html`, `public/sitemap.xml` |
| Landing pages | `src/pages/ServiceLanding.jsx`, `src/lib/serviceLanding.js` |
| Connect | `src/components/WebkozarConnect.jsx`, `src/pages/ConnectPage.jsx`, `src/components/{BrowserFrame,RequestLifecycle,ChaosVsConnect}.jsx`, `public/connect/` |
| Routing / nav | `src/App.jsx`, `src/main.jsx`, `src/lib/navLinks.js`, `src/components/{Header,Footer,CtaButton}.jsx` |
| Nasazení | `public/.htaccess`, `DEPLOY.md` |
