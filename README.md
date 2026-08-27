# webkozar — tvorba webových stránek

Moderní, interaktivní a vizuálně prémiová jednostránková (onepage) prezentace
webového studia **[webkozar.cz](https://webkozar.cz/)** (Nový Jičín / Ostrava).
Projekt klade důraz na UI/UX, plynulé mikro-interakce a „dark-neon" estetiku
s glassmorphismem.

## Technologie

| Nástroj | Verze | K čemu |
|---|---|---|
| [React](https://react.dev/) | 19 | jádro aplikace |
| [Vite](https://vitejs.dev/) | 7 | dev server a build |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | stylování (`@tailwindcss/vite`) |
| [motion](https://motion.dev/) (`motion/react`) | 12 | animace a přechody |
| [Lucide React](https://lucide.dev/) | — | ikony |
| [@fontsource](https://fontsource.org/) | — | fonty Space Grotesk (nadpisy) + Outfit (text) |
| PHP | 8+ | backend na hostingu (formulář + AI chat) |

Design vzniká ve [Figmě](https://www.figma.com/).

## Co web obsahuje

- **Hero** — hlavní sekce s gradientním nadpisem, statistikami a animovaným `FluidBlob`.
- **Process** — čtyři kroky spolupráce (odhad ceny → analýza → návrh → předání).
- **Pricing** — tři cenové balíčky + tlačítko, které předvyplní balíček ve formuláři.
  Součástí je **AI průvodce** (`AIChatbot`) doporučující balíček podle popisu projektu.
- **Technologies** — přehled používaných technologií.
- **Reference** — mřížka hotových projektů s postupným načítáním („Zobrazit více").
- **Faq** — často kladené dotazy (accordion).
- **Form** — kontaktní formulář (jméno, e-mail, balíček, zpráva) + kontaktní
  a fakturační údaje.
- **LiveChatWidget** — plovoucí AI chat bublina.
- **CookieConsent / CookiePolicy** — lišta souhlasu s cookies a zásady zpracování
  (Google Consent Mode v2, uložení do localStorage).
- **LoadingScreen**, **AnimatedBackground** — úvodní loader a fixní gradientové pozadí.

## Struktura projektu

```
webkozar/
├─ index.html               # meta tagy, Open Graph, JSON-LD (ProfessionalService, FAQPage)
├─ vite.config.js
├─ eslint.config.js
├─ DEPLOY.md                # postup nasazení (ruční SFTP/FTPS)
├─ AUDIT.md                 # seznam úkolů k dodělání (priority)
├─ CLAUDE.md                # pokyny pro AI asistenta
├─ public/
│  ├─ send-email.php        # příjem kontaktního formuláře → mail()
│  ├─ ai-api.php            # proxy na OpenAI (režimy 'wizard' / 'chat') + log do MySQL
│  ├─ config.example.php    # vzor konfigurace
│  ├─ config.php            # SKUTEČNÉ klíče/hesla – NENÍ v gitu
│  ├─ robots.txt, sitemap.xml
│  ├─ logos/                # logo, favicon, og-image
│  └─ reference/            # náhledy projektů (.webp)
└─ src/
   ├─ main.jsx              # vstupní bod, import fontů
   ├─ App.jsx               # skládá sekce onepage
   ├─ index.css             # Tailwind + fonty + základní styly
   ├─ Form.jsx              # kontaktní sekce
   ├─ components/           # Header, Hero, Process, Pricing, Technologies,
   │                        # Reference, Faq, Footer, AIChatbot, LiveChatWidget,
   │                        # CookieConsent, CookiePolicy, CustomSelect,
   │                        # AnimatedBackground, FluidBlob, LoadingScreen
   └─ lib/
      ├─ navLinks.js        # položky navigace (Header + Footer)
      ├─ selectPackage.js   # balíčky + předvyplnění formuláře přes CustomEvent
      └─ cookieConsent.js   # logika souhlasu s cookies
```

Komunikace mezi sekcemi jde přes `CustomEvent` (`prefillPackage`,
`openCookieSettings`, `openCookiePolicy`), ne přes globální stav.

## Instalace a spuštění

```bash
git clone https://github.com/martynCZ/webkozar.git
cd webkozar
npm install
npm run dev
```

Další příkazy:

```bash
npm run build     # produkční build do dist/
npm run lint      # ESLint
```

Nasazení je ruční: obsah `dist/` se nahraje přes SFTP/FTPS na hosting.
Podrobnosti v [`DEPLOY.md`](./DEPLOY.md).

### Backend

`public/*.php` běží na hostingu. Lokálně formulář a chat fungují až proti
serveru s PHP a souborem `public/config.php` (zkopíruj `config.example.php`
a doplň OpenAI klíč, přístup k DB a e-maily). `config.php` **nikdy** necommituj.
Podrobnosti k nasazení v [`DEPLOY.md`](./DEPLOY.md).

## Dokumentace

- [`AUDIT.md`](./AUDIT.md) — kompletní seznam úkolů (bezpečnost, výkon, SEO,
  přístupnost, responzivita, UX, kód, backend, deploy) s prioritami.
- [`CLAUDE.md`](./CLAUDE.md) — pokyny pro práci s AI asistentem.
- [`DEPLOY.md`](./DEPLOY.md) — postup nasazení na produkci.

## Autor

**martynCZ** (Martin Kozar)

- GitHub: [@martynCZ](https://github.com/martynCZ)
- LinkedIn: [Martin Kozar](https://www.linkedin.com/in/martin-kozar-306bb8305)
- Web: [webkozar.cz](https://webkozar.cz)
