# webkozar

> Prezentační web webového studia **webkozar** — tvorba webových stránek, log
> a SEO optimalizace pro firmy z Nového Jičína, Ostravy a okolí.

Marketingový web s důrazem na UI/UX, plynulé mikro-interakce a „dark-neon"
estetiku s glassmorphismem. Hlavní stránka je onepage, k ní patří několik
prerenderovaných podstránek a tenký PHP backend na hostingu, který obsluhuje
kontaktní formulář a AI chat.

Ostrá verze: **[webkozar.cz](https://webkozar.cz/)**

---

## Co web obsahuje

### Sekce hlavní stránky
| Sekce | Kotva | Popis |
|-------|-------|-------|
| Hero | — | Hlavní sekce: gradientní nadpis, statistiky, animovaný `FluidBlob`, dvě CTA |
| Proces | `#tvorba` | Kroky spolupráce (odhad ceny → analýza → návrh → předání) |
| Ceník | `#cenik` | Balíčky (Základní / Standardní / Web na míru) + spuštění AI chatu s odhadem ceny |
| Technologie | `#technologie` | Přehled používaných nástrojů |
| Reference | `#reference` | Mřížka hotových projektů; úvodem 6, zbytek za „Zobrazit více" |
| FAQ | `#faq` | Časté dotazy (accordion) |
| Kontakt | `#kontakt` | Kontaktní formulář + kontaktní a fakturační údaje |

### Podstránky
- `/connect` — prezentace produktu **Webkozar Connect** (`ConnectPage`)
- Landing pages pro službu + lokalitu (`ServiceLanding`, konfigurace
  v `src/lib/serviceLanding.js`)

Všechny se při buildu prerenderují do statického HTML (`scripts/prerender.mjs`),
takže roboti i sdílecí náhledy dostanou hotový obsah včetně meta tagů.

### Interaktivní prvky
- **AI chat** (`LiveChatWidget`) — plovoucí bublina; odpovídá na dotazy a umí
  předvyplnit formulář, odscrollovat na sekci, doporučit balíček s odhadem ceny
  nebo navrhnout odeslání poptávky
- **Lišta souhlasu s cookies** (`CookieConsent` + `CookiePolicy`) — nezbytné /
  analytické cookies, Google Consent Mode v2, uložení do `localStorage`
- **Úvodní loader** (`LoadingScreen`) — krátká animace, jen jednou za návštěvu
  (`sessionStorage`), na skryté záložce se přeskočí
- **Pozadí** (`AnimatedBackground`) — fixní gradientová vrstva s blur „bloby";
  na mobilu i při „omezit pohyb" bez animace

### Komunikace mezi sekcemi
Sekce spolu nemluví přes globální stav, ale přes `CustomEvent`:

| Event | Odesílá | Poslouchá |
|-------|---------|-----------|
| `prefillPackage` | ceník, AI chat | formulář (předvyplní balíček + odscrolluje) |
| `openChat` | ceník | plovoucí AI chat |
| `openCookieSettings` | patička | lišta cookies |
| `openCookiePolicy` | patička, lišta cookies | modal se zásadami |

---

## Technologie

| Oblast | Technologie |
|--------|-------------|
| Frontend | [React 19](https://react.dev/) + [React Router](https://reactrouter.com/) |
| Build & dev server | [Vite 7](https://vitejs.dev/) + vlastní prerender (SSR build) |
| Stylování | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) |
| Animace | [Motion](https://motion.dev/) (`motion/react`) |
| Ikony | [Lucide React](https://lucide.dev/) |
| Písma | [Fontsource](https://fontsource.org/) — Space Grotesk (nadpisy), Outfit (text) |
| Backend | PHP 8+ (na hostingu) |
| AI | OpenAI API přes serverovou proxy |
| Databáze | MySQL (log konverzací AI chatu) |
| Návrh | [Figma](https://www.figma.com/) |

---

## Struktura projektu

```
webkozar/
├── index.html                  # meta tagy, Open Graph, Twitter card, JSON-LD
├── vite.config.js
├── eslint.config.js
├── scripts/prerender.mjs       # build → statické HTML pro každou routu
│
├── public/                     # kopíruje se do dist/ beze změny
│   ├── send-email.php          # příjem kontaktního formuláře
│   ├── ai-api.php              # proxy na OpenAI + log do MySQL
│   ├── _ratelimit.php          # sdílený rate-limiting helper
│   ├── _smtp.php               # odeslání e-mailu přes autentizované SMTP
│   ├── ai-knowledge.json       # znalosti AI + zdroj ceníku a FAQ pro web
│   ├── config.example.php      # vzor konfigurace
│   ├── .htaccess               # redirecty, SPA fallback, hlavičky, cache
│   ├── robots.txt / sitemap.xml
│   ├── logos/ · reference/ · connect/
│
└── src/
    ├── main.jsx                # vstupní bod (router)
    ├── entry-server.jsx        # vstupní bod pro prerender
    ├── App.jsx                 # layout, MotionConfig, lazy modaly
    ├── index.css               # Tailwind, fonty, keyframes, prefers-reduced-motion
    ├── Form.jsx                # kontaktní sekce (formulář + údaje)
    ├── pages/                  # Home, ConnectPage, ServiceLanding
    ├── components/             # sekce a UI prvky (viz výše)
    └── lib/                    # sdílený kód bez UI
        ├── navLinks.js         # položky navigace (Header + Footer)
        ├── knowledge.js        # PACKAGES + FAQ z ai-knowledge.json
        ├── selectPackage.js    # předvyplnění formuláře přes CustomEvent
        ├── openChat.js         # otevření AI chatu odkudkoli
        ├── cookieConsent.js    # logika souhlasu (localStorage, Consent Mode)
        ├── analytics.js        # GA4 se spouští až po souhlasu
        ├── seo.js · serviceLanding.js · usePageMeta.js
        └── useBodyScrollLock.js · useFocusTrap.js
```

> Ceník a FAQ se udržují **jen v `public/ai-knowledge.json`** — web, JSON-LD
> i systémový prompt AI z něj čtou, takže se obsah nerozchází.

---

## Backend (PHP)

Soubory v `public/*.php` běží na hostingu (Vite je zkopíruje do `dist/`).

### `send-email.php` — kontaktní formulář
Přijme JSON, zvaliduje (jméno, e-mail, zpráva, délky) a odešle na `mail_to`
z konfigurace — přes autentizované SMTP, když je nastavené, jinak PHP `mail()`.
Ochrany:

- **CORS** — `Access-Control-Allow-Origin` jen pro domény z `allowed_origins`
- **Honeypot** — skryté pole `website`; když je vyplněné, tváří se úspěšně, ale nic neodešle
- **Časový zámek** — odeslání příliš brzy po načtení formuláře (`renderedAt`) = bot
- **Rate limit** — max 5 odeslání za hodinu z jedné IP
- **Ochrana proti header injection** — do hlaviček jde jen ověřený e-mail bez CR/LF

### `ai-api.php` — AI chat
Serverová proxy na OpenAI Chat Completions (`response_format: json_object`).
Systémový prompt se skládá z `ai-knowledge.json` (znalosti, tón, refusal,
few-shot). Odpověď je `{ reply, akce }`; `akce` server whitelistuje a frontend
podle ní předvyplní formulář, odscrolluje, ukáže odhad ceny nebo nabídne
odeslání poptávky. Konverzace se logují do MySQL. Ochrany: CORS jako výše +
**rate limit** (burst i hodinový strop) — CORS totiž nechrání přímé volání
přes `curl`, jen prohlížeč.

### `_ratelimit.php`
`rate_limit_ok(bucket, maxHits, windowSeconds)` — počítadla podle IP v dočasném
adresáři serveru (`sys_get_temp_dir()`). Žádná databáze. Když adresář není
zapisovatelný, limiter **propouští** (fail-open), aby neblokoval legitimní provoz.

---

## Konfigurace

Na serveru musí ve stejné složce jako `ai-api.php` ležet **`config.php`**
se skutečnými hodnotami. Vzor i s komentáři je
[`public/config.example.php`](./public/config.example.php) — zkopíruj ho jako
`config.php` a doplň OpenAI klíč, přístup k databázi, e-mailové adresy,
případně SMTP a povolené originy.

`config.php` je v `.gitignore` — **nikdy ho necommituj**. Při nahrávání `dist/`
na server ho nepřepisuj kopií vzoru.

---

## Spuštění projektu

### Požadavky
- Node.js 20+
- Pro plně funkční formulář a chat: hosting s PHP 8+ a soubor `config.php`

### Instalace a vývoj

```bash
git clone https://github.com/martynCZ/webkozar.git
cd webkozar
npm install

npm run dev       # vývojový server (http://localhost:5173)
npm run build     # produkční build do dist/ (vč. prerenderu podstránek)
npm run preview   # náhled produkčního buildu
npm run lint      # ESLint
```

> Formulář a AI chat lokálně fungují až proti serveru s PHP a `config.php`.
> Bez backendu se web normálně vykreslí, jen odeslání formuláře / chat selže.

---

## Nasazení

1. `npm run build` → složka `dist/` (HTML, JS, CSS, obrázky + PHP z `public/`)
2. Obsah `dist/` nahrát na webroot, **`config.php` na serveru nepřepisovat**
3. Kontrola: web běží, `robots.txt` má `Allow: /`, `sitemap.xml` se zobrazí,
   testovací zpráva z formuláře dorazí, AI chat odpoví

---

## SEO a metadata

- `lang="cs"`, `<link rel="canonical">`, meta description pro každou routu
  (`src/lib/seo.js` + `usePageMeta.js`, zapečené prerenderem do HTML)
- **Open Graph** + **Twitter card** (obrázek `logos/og-image.jpg`, 1200 × 630)
- **JSON-LD** — `ProfessionalService` (název, adresa, oblast působení,
  otevírací doba), `OfferCatalog` s ceníkem a `FAQPage`; ceník i FAQ se generují
  z `ai-knowledge.json`, takže nemůžou vzniknout rozejité strukturované údaje
- `public/robots.txt` povoluje indexaci, `public/sitemap.xml` obsahuje všechny routy

---

## Přístupnost a výkon

- Veškerý pohyb respektuje `prefers-reduced-motion` — `<MotionConfig reducedMotion="user">`
  v `App.jsx` + CSS `@media` v `index.css`
- Nekritické komponenty (`LiveChatWidget`, `CookieConsent`, `CookiePolicy`)
  se načítají přes `React.lazy` v samostatných chunkech
- Chyby vykreslení odchytává `ErrorBoundary`
- Fonty se načítají jen v potřebných vahách a subsetech
- Náhledy referencí jsou webp do 900 px šířky

---

## Autor

**martynCZ** — Martin Kozar

- GitHub: [@martynCZ](https://github.com/martynCZ)
- LinkedIn: [Martin Kozar](https://www.linkedin.com/in/martin-kozar-306bb8305)
- Web: [webkozar.cz](https://webkozar.cz)
