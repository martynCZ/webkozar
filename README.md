# webkozar

> Prezentační web webového studia **webkozar** — tvorba webových stránek, log
> a SEO optimalizace pro firmy z Nového Jičína, Ostravy a okolí.

Jednostránkový (onepage) marketingový web s důrazem na UI/UX, plynulé
mikro-interakce a „dark-neon" estetiku s glassmorphismem. K webu patří tenký
PHP backend na hostingu, který obsluhuje kontaktní formulář a AI chat.

Ostrá verze: **[webkozar.cz](https://webkozar.cz/)**

---

## Co web obsahuje

### Sekce stránky
| Sekce | Kotva | Popis |
|-------|-------|-------|
| Hero | — | Hlavní sekce: gradientní nadpis, statistiky, animovaný `FluidBlob`, dvě CTA |
| Proces | `#tvorba` | Čtyři kroky spolupráce (odhad ceny → analýza → návrh → předání) |
| Ceník | `#cenik` | Tři balíčky (Základní / Standardní / Web na míru) + **AI průvodce výběrem** |
| Technologie | `#technologie` | Přehled používaných nástrojů |
| Reference | `#reference` | Mřížka hotových projektů; úvodem 6, zbytek za „Zobrazit více"; název je odkaz na web klienta |
| FAQ | `#faq` | Časté dotazy (accordion) |
| Kontakt | `#kontakt` | Kontaktní formulář + kontaktní a fakturační údaje |

### Interaktivní prvky
- **AI průvodce výběrem** (`AIChatbot`) — v ceníku; podle popisu projektu doporučí
  balíček a odhadne cenu, výsledek předvyplní do formuláře
- **Plovoucí AI chat** (`LiveChatWidget`) — bublina v rohu, odpovídá na dotazy návštěvníků
- **Lišta souhlasu s cookies** (`CookieConsent` + `CookiePolicy`) — nezbytné /
  analytické cookies, Google Consent Mode v2, uložení do `localStorage`;
  modal se zásadami zpracování otevíratelný z lišty i patičky
- **Úvodní loader** (`LoadingScreen`) — krátká animace (~0,8 s), zobrazí se jen
  jednou za návštěvu (`sessionStorage`), na skryté záložce se přeskočí
- **Pozadí** (`AnimatedBackground`) — statické radiální gradienty; na `md+`
  jedna vrstva s pomalým `transform` driftem, na mobilu i při „omezit pohyb" bez animace

### Komunikace mezi sekcemi
Sekce spolu nemluví přes globální stav, ale přes `CustomEvent`:

| Event | Odesílá | Poslouchá |
|-------|---------|-----------|
| `prefillPackage` | ceník, AI průvodce | formulář (předvyplní balíček + odscrolluje) |
| `openCookieSettings` | patička | lišta cookies |
| `openCookiePolicy` | patička, lišta cookies | modal se zásadami |

---

## Technologie

| Oblast | Technologie |
|--------|-------------|
| Frontend | [React 19](https://react.dev/) |
| Build & dev server | [Vite 7](https://vitejs.dev/) |
| Stylování | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) |
| Animace | [Motion](https://motion.dev/) (`motion/react`) |
| Ikony | [Lucide React](https://lucide.dev/) |
| Písma | [Fontsource](https://fontsource.org/) — Space Grotesk (nadpisy), Outfit (text); váhy 400/500/600/700, subsety latin + latin-ext |
| Backend | PHP 8+ (na hostingu) |
| AI | OpenAI API (`gpt-4o-mini`) přes serverovou proxy |
| Databáze | MySQL (log konverzací AI chatu) |
| Návrh | [Figma](https://www.figma.com/) |

---

## Struktura projektu

```
webkozar/
├── index.html                 # meta tagy, Open Graph, Twitter card, JSON-LD (ProfessionalService + FAQPage)
├── vite.config.js
├── eslint.config.js
├── DEPLOY.md                   # postup nasazení (ruční SFTP/FTPS)
├── AUDIT.md                    # kompletní audit webu s prioritami a stavem
├── CLAUDE.md                   # pokyny pro AI asistenta
│
├── public/                     # kopíruje se do dist/ beze změny
│   ├── send-email.php          # příjem kontaktního formuláře → mail()
│   ├── ai-api.php              # proxy na OpenAI (režimy 'wizard' / 'chat') + log do MySQL
│   ├── _ratelimit.php          # sdílený rate-limiting helper (stav v temp souborech)
│   ├── config.example.php      # vzor konfigurace
│   ├── config.php              # SKUTEČNÉ klíče a hesla – NENÍ v gitu (.gitignore)
│   ├── robots.txt              # Allow: /
│   ├── sitemap.xml
│   ├── logos/                  # logo, favicon, og-image
│   └── reference/              # náhledy projektů (.webp, max 900 px)
│
└── src/
    ├── main.jsx                # vstupní bod
    ├── App.jsx                 # skládá sekce onepage, MotionConfig, lazy modaly
    ├── index.css               # Tailwind, import fontů, keyframes, prefers-reduced-motion
    ├── Form.jsx                # kontaktní sekce (formulář + údaje)
    ├── components/
    │   ├── Header.jsx          # plovoucí skleněná navigace + mobilní menu
    │   ├── Hero.jsx            # hlavní sekce
    │   ├── FluidBlob.jsx       # animovaný „blob" v Hero
    │   ├── Process.jsx         # kroky spolupráce
    │   ├── Pricing.jsx         # ceník + spouštěč AI průvodce
    │   ├── AIChatbot.jsx       # modal: AI průvodce výběrem balíčku (lazy)
    │   ├── CustomSelect.jsx    # vlastní dropdown výběru balíčku ve formuláři
    │   ├── Technologies.jsx    # sekce technologií
    │   ├── Reference.jsx       # mřížka referencí + „Zobrazit více"
    │   ├── Faq.jsx             # accordion častých dotazů
    │   ├── Footer.jsx          # patička: navigace, kontakt, CTA, cookies
    │   ├── CtaButton.jsx       # sdílené primární tlačítko (gradient + efekt odlesku)
    │   ├── LiveChatWidget.jsx  # plovoucí AI chat (lazy)
    │   ├── CookieConsent.jsx   # lišta souhlasu s cookies (lazy)
    │   ├── CookiePolicy.jsx    # modal se zásadami zpracování cookies (lazy)
    │   ├── LoadingScreen.jsx   # úvodní loader
    │   └── AnimatedBackground.jsx  # fixní gradientové pozadí
    └── lib/
        ├── navLinks.js         # položky navigace (Header + Footer)
        ├── selectPackage.js    # balíčky + předvyplnění formuláře přes CustomEvent
        └── cookieConsent.js    # logika souhlasu (localStorage, verzování, Consent Mode)
```

---

## Backend (PHP)

Soubory v `public/*.php` běží na hostingu (Vite je zkopíruje do `dist/`).

### `send-email.php` — kontaktní formulář
Přijme JSON, zvaliduje (jméno, e-mail, zpráva, délky), odešle přes PHP `mail()`
na `mail_to` z konfigurace. Ochrany:

- **CORS** — hlavička `Access-Control-Allow-Origin` jen pro domény z `allowed_origins`
- **Honeypot** — skryté pole `website`; když je vyplněné, tváří se úspěšně, ale nic neodešle
- **Časový zámek** — odeslání do 2,5 s po načtení formuláře (`renderedAt`) = bot
- **Rate limit** — max 5 odeslání za hodinu z jedné IP
- **Ochrana proti header injection** — do hlaviček jde jen ověřený e-mail bez CR/LF

### `ai-api.php` — AI chat / průvodce
Serverová proxy na OpenAI Chat Completions (`gpt-4o-mini`, `response_format: json_object`).
Dva režimy podle pole `type` v požadavku:

| `type` | Volá | Odpověď (JSON klíče) |
|--------|------|----------------------|
| `wizard` | `AIChatbot.jsx` | `doporuceni`, `cena`, `balicek` |
| `chat` | `LiveChatWidget.jsx` | `reply` |

Systémový prompt obsahuje znalosti o firmě a ceníku. Konverzace se loguje do
tabulky `ai_chat_logs` (MySQL). Ochrany: CORS jako výše + **rate limit**
(burst 3 / 20 s a 15 / hodinu z jedné IP) — CORS totiž nechrání přímé volání
přes `curl`, jen prohlížeč.

### `_ratelimit.php`
`rate_limit_ok(bucket, maxHits, windowSeconds)` — počítadla podle IP v dočasném
adresáři serveru (`sys_get_temp_dir()`). Žádná databáze. Když adresář není
zapisovatelný, limiter **propouští** (fail-open), aby neblokoval legitimní provoz.

---

## Konfigurace

Na serveru musí ve stejné složce jako `ai-api.php` ležet **`config.php`**
se skutečnými hodnotami. Vzor je `config.example.php`:

```php
<?php
return [
    'openai_api_key' => 'sk-...',
    'db_host'   => 'localhost',
    'db_name'   => 'webkozar_ai',
    'db_user'   => 'webkozar',
    'db_pass'   => '',
    'mail_to'   => 'info@webkozar.cz',
    'mail_from' => 'info@webkozar.cz',
    'allowed_origins' => [
        'https://webkozar.cz',
        'https://www.webkozar.cz',
    ],
];
```

`config.php` je v `.gitignore` — **nikdy ho necommituj** ani neposílej do
repozitáře. Při ručním nahrávání `dist/` na server ho **nepřepisuj**
(v buildu je jen kopie vzoru).

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
npm run build     # produkční build do dist/
npm run preview   # náhled produkčního buildu
npm run lint      # ESLint
```

> Formulář a AI chat lokálně fungují až proti serveru s PHP a `config.php`.
> Bez backendu se web normálně vykreslí, jen odeslání formuláře / chat selže.

---

## Nasazení

Web běží na produkci a nahrává se **ručně přes SFTP / FTPS** (žádný skript
v repozitáři).

1. `npm run build` → složka `dist/` (HTML, JS, CSS, obrázky + PHP z `public/`)
2. Obsah `dist/` nahrát na webroot, **vynechat `config.php`** (na serveru je ostrá verze)
3. Kontrola: web běží, `robots.txt` má `Allow: /`, `sitemap.xml` se zobrazí,
   testovací zpráva z formuláře dorazí, AI chat odpoví

Podrobnosti a poznámky k SEO (301 redirecty, Search Console, rich results) jsou
v [`DEPLOY.md`](./DEPLOY.md).

---

## SEO a metadata

`index.html` obsahuje:

- `lang="cs"`, `<link rel="canonical">`, meta description
- **Open Graph** + **Twitter card** (obrázek `logos/og-image.jpg`, 1200 × 630)
- **JSON-LD**:
  - `ProfessionalService` — název, adresa, oblast působení (Nový Jičín, Ostrava,
    Moravskoslezský kraj), otevírací doba, ceník služeb (`hasOfferCatalog`)
  - `FAQPage` — 6 otázek a odpovědí

`public/robots.txt` povoluje indexaci, `public/sitemap.xml` obsahuje homepage.

> ⚠️ JSON-LD s FAQ a ceníkem je v `index.html` **napevno** a duplikuje obsah
> z `Faq.jsx` a `Pricing.jsx`. Při změně otázek nebo cen na webu je nutné
> upravit i strukturovaná data, jinak vznikne „structured data mismatch".

---

## Přístupnost a výkon

- Veškerý pohyb respektuje `prefers-reduced-motion` — `<MotionConfig reducedMotion="user">`
  v `App.jsx` + CSS `@media` v `index.css`
- Nekritické komponenty (`AIChatbot`, `LiveChatWidget`, `CookieConsent`,
  `CookiePolicy`) se načítají přes `React.lazy` v samostatných chunkech
- Fonty se načítají jen v potřebných vahách a subsetech
- Náhledy referencí jsou webp do 900 px šířky

Otevřené body a další možná vylepšení jsou v [`AUDIT.md`](./AUDIT.md).

---

## Dokumentace

| Soubor | Obsah |
|--------|-------|
| [`AUDIT.md`](./AUDIT.md) | Kompletní audit webu (bezpečnost, výkon, SEO, přístupnost, responzivita, UX, kód, backend, deploy) s prioritami a stavem |
| [`DEPLOY.md`](./DEPLOY.md) | Postup nasazení na produkci |
| [`CLAUDE.md`](./CLAUDE.md) | Pokyny pro práci s AI asistentem nad tímto repozitářem |

---

## Autor

**martynCZ** — Martin Kozar

- GitHub: [@martynCZ](https://github.com/martynCZ)
- LinkedIn: [Martin Kozar](https://www.linkedin.com/in/martin-kozar-306bb8305)
- Web: [webkozar.cz](https://webkozar.cz)
