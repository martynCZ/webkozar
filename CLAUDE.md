# webkozar.cz — prezentační web studia

Jednostránkový (onepage) marketingový web webového studia **webkozar**
(Nový Jičín / Ostrava). React 19 + Vite 7 + Tailwind v4 + `motion`,
k tomu tenký PHP backend na hostingu (odeslání formuláře + AI chat).

## Příkazy pro vývoj

- `npm run dev` — vývojový server (Vite)
- `npm run build` — produkční build do `dist/`
- `npm run lint` — ESLint (flat config, `eslint.config.js`)

Nasazení řeší uživatel ručně (SFTP/FTPS nahrání `dist/`). Žádný deploy skript
v projektu není.

Po úpravě lintuj cíleně dotčené soubory (`npx eslint <soubor>`) a u větších
změn spusť `npm run build`, ať se chytnou chyby importů a Tailwind tříd.

## Model

Celý projekt jede **na Sonnetu** — je to jednoduchá prezentační webovka,
Sonnet ji pokryje celou (Tailwind, responzivita, obsah, komponenty, animace
`motion`, PHP backend, lint, build, dokumentace). Řešit přepnutí modelu není
potřeba.

## Role a názvosloví

- **webkozar / vývojář / „my" v textech webu:** studio Martina a Petra Kozara.
  Provozovatel webu a zadavatel úprav.
- **Klient / zákazník:** firma, která si u studia objednává web. Na stránce je
  to cílový návštěvník — jemu je psaný veškerý UI text.
- **Claude:** ty, AI asistent pro vývoj tohoto webu.

## Architektura a soubory

Onepage se skládá v `src/App.jsx` — sekce jdou po sobě v `<main>`
(`Hero → Process → Pricing → Technologies → Reference → Faq → Form`),
kolem toho `Header`, `Footer`, `LiveChatWidget`, `CookieConsent`,
`AnimatedBackground` a `LoadingScreen`.

Strukturu souborů hledej **Globem**, ne výčtem. Tady jen to, co z názvu není
poznat:

- **`src/lib/`** — sdílený kód bez UI:
  - `navLinks.js` — jediný zdroj položek navigace (používá `Header` i `Footer`).
  - `knowledge.js` — importuje `public/ai-knowledge.json` do bundle a exportuje
    `PACKAGES` + `FAQ`. Jediný zdroj obsahu ceníku a FAQ pro web; tentýž soubor
    čte za běhu i `ai-api.php`.
  - `selectPackage.js` — `selectPackageAndScroll()`: přes
    `CustomEvent('prefillPackage')` předvyplní balíček ve formuláři a odscrolluje
    na `#kontakt` (poslouchá `Form.jsx`). `PACKAGES` re-exportuje z `knowledge.js`.
  - `openChat.js` — `openChat(botMessage?)`: přes `CustomEvent` otevře plovoucí
    chat odkudkoli (používá `Pricing`, poslouchá `LiveChatWidget`).
  - `cookieConsent.js` — logika souhlasu (localStorage, verzování, Google
    Consent Mode v2). `openCookieSettings()` / `openCookiePolicy()` otevírají
    lištu/modal odkudkoli přes `CustomEvent`.
- **`src/components/CustomSelect.jsx`** — vlastní dropdown pro výběr balíčku ve
  formuláři. **Zatím není přístupný z klávesnice ani pro čtečky** (viz `AUDIT.md`
  sekce 4).
- **`src/components/LoadingScreen.jsx`** — úvodní loader. Drží viewport ~2,5 s
  (šířka progress baru) + pojistný timeout 3,5 s. Je to známý výkonnostní dluh
  (`AUDIT.md` 2), ne záměr k rozšiřování.
- **`src/components/AnimatedBackground.jsx`** — fixní gradientové pozadí
  s blur „bloby". Vizuálně nese celý web; jakákoli sekce má průhledné pozadí
  a spoléhá na tuhle vrstvu.
- **`LiveChatWidget.jsx`** — jediný AI chat (plovoucí bublina), volá
  `POST /ai-api.php`, čeká `{ reply, akce }`. `akce` (whitelistuje ji server)
  řídí frontend: `predvypln_formular`, `prejdi_na`, `odhad_ceny` (karta
  doporučeného balíčku + odhad ceny), `navrhnout_poptavku` (`LeadCard` s
  potvrzením → `POST /send-email.php`). Ceníkový průvodce `AIChatbot.jsx` byl
  zrušen (AUDIT §6 P1) — tlačítko v ceníku teď přes `openChat()` otevře tenhle
  chat s předvyplněnou výzvou. Podrobně `AI-VYLEPSENI.md`.

### PHP backend (`public/`)

- `send-email.php` — příjem kontaktního formuláře, validace, odeslání přes
  `mail()`. Antispam: honeypot pole `website` + časový zámek (`renderedAt`)
  + rate limit 5/hod přes `_ratelimit.php`.
- `ai-api.php` — proxy na OpenAI (model z `config['openai_model']`),
  `response_format: json_object`, system prompt ze `ai-knowledge.json`
  (znalosti + tón + refusal + few-shot), historie konverzace, sanitace `akce`,
  logování do MySQL. Rate limit přes `_ratelimit.php` (burst + hodinový strop,
  hodnoty z `config['ai_rate_burst']` / `['ai_rate_hour']`, výchozí 5/20 s a 60/hod).
- `_ratelimit.php` — `rate_limit_ok(bucket, maxHits, windowSeconds)`, stav
  v `sys_get_temp_dir()`. Fail-open, když nejde zapisovat. `config['rate_limit_disabled']
  => true` limity úplně vypne (jen pro ladění).
- `config.php` — **skutečné klíče a hesla. NENÍ v gitu** (`.gitignore`),
  vzor je `config.example.php`. Nikdy ho necommituj ani neloguj jeho obsah.
  Nahrává se ale na server přes SFTP se vším ostatním (přenos je šifrovaný) —
  zdroj pravdy je lokální `public/config.php`, drž ho aktuální.

## Pravidla pro kódování

1. **Jazyk:** veškerý UI text, chybové hlášky i `aria-label` píš **česky**
   (teď je pár anglických `aria-label` — opravuj je při dotyku).
2. **Animace:** importuj vždy z `'motion/react'`
   (`import { motion, AnimatePresence } from 'motion/react'`).
3. **Vzhled:** dark mode, akcentní barva `#0EC3BF` (tyrkysová), doplňková
   `purple-600` / `fuchsia`. Sklo = `bg-white/5` + `backdrop-blur-*` +
   `border-white/10` + tyrkysový `shadow-[0_0_..._rgba(14,195,191,...)]`.
4. **Fonty:** nadpisy **Space Grotesk**, běžný text **Outfit** — aplikuje se
   inline přes `style={{ fontFamily: '...' }}`, ne Tailwind třídou. Váhy
   400/500/600/700 (latin + latin-ext) se importují v `index.css`.
5. **Primární CTA:** komponenta `CtaButton` (`src/components/CtaButton.jsx`) —
   gradient + „odlesk" na hover, žádný scale. Nová primární tlačítka řeš přes ni.
6. **Nové scroll animace:** `viewport={{ once: true }}` (ne `false` — to je
   starý vzor, který se přehrává pořád dokola).
7. **Nový pohyb respektuje `prefers-reduced-motion`** — globálně to řeší
   `<MotionConfig reducedMotion="user">` v `App.jsx` + CSS `@media` v `index.css`;
   u vlastní logiky sáhni po `useReducedMotion()` z `motion/react`.
8. **Komponenta nesahá na globální stav přes `window`.** Komunikace mezi
   sekcemi jede přes `CustomEvent` (viz `selectPackage.js`, `cookieConsent.js`) —
   drž se toho vzoru, nezaváděj `window.__neco`.
9. **Sdílené konstanty patří do `src/lib/`**, ne kopie mezi komponentami
   (navigace, balíčky, cookie kategorie už tam jsou).

## Známé pasti

- **JSON-LD ceníku i FAQ se generuje z `public/ai-knowledge.json`** (`Pricing.jsx`
  `OfferCatalog`, `Faq.jsx` `FAQPage`, do HTML přes prerender). `index.html`
  `#business` má jen odkaz `hasOfferCatalog: { "@id": "…/#offercatalog" }`. Ceník
  a FAQ tedy uprav **jen v `ai-knowledge.json`** — web i strukturovaná data se
  srovnají sama.
- **`document.body.style.overflow` si přepíná víc komponent** (`Header`,
  `LoadingScreen`, `CookiePolicy`). Zavření jedné odemkne scroll i pod jinou
  otevřenou vrstvou. Než přidáš další modal, zvaž sdílený scroll-lock hook.
- **`duration-900` není platná Tailwind třída** (platí 700 nebo 1000) a v kódu
  se ještě vyskytuje — tiše se ignoruje. Nepřidávej další, oprav při dotyku.
- **`config.php` se nesmí dostat do gitu.** Vzor `config.example.php` ano, ostrý
  `config.php` ne. Na server se ale nahrává (SFTP, šifrovaně) se vším ostatním —
  `npm run deploy` ho posílá; drž lokální `public/config.php` aktuální.

## Nasazení

`npm run deploy` (build + SFTP) nebo ručně — obsah `dist/` na webroot,
včetně `config.php`. Podrobně v `DEPLOY.md`.

Po přechodu na jinou URL strukturu: 301 redirecty ze starých URL, odeslat sitemapu
do Search Console + Seznam Webmaster, ověřit rich results a náhled sdílení.

## Otevřené úkoly

Kompletní seznam k dodělání je v **`AUDIT.md`** (bezpečnost, výkon, SEO, a11y,
responzivita, UX, kód, backend, deploy) — s prioritami a doporučeným pořadím.
Stav udržuj tam: hotové body odškrtávej, ať víme, kde jsme.

> `CLAUDE.md` (tento soubor) **neaktualizuj sám od sebe** — uprav ho jen na
> vyžádání uživatele.
