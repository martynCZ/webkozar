# Audit webu webkozar.cz

Kompletní prohlídka k **27. 8. 2026**. Rozděleno do sekcí, každý bod má prioritu
a krátké „proč / jak". Body odškrtávej při dokončení, ať víme, kde jsme.

**Priority:**
`P0` = kritické (bezpečnost, blokuje výkon/SEO) · `P1` = důležité ·
`P2` = vylepšení · `P3` = nice-to-have

**Stav:** `[ ]` čeká · `[~]` rozpracováno / částečně · `[x]` hotovo

---

## 1. Bezpečnost a soukromí

- [~] **P0 — Rotovat vystavené klíče.** `public/config.php` obsahuje živý
  OpenAI API klíč a heslo k DB v čitelné podobě. Soubor je sice v `.gitignore`,
  ale hodnoty byly vystaveny (mimo jiné v pracovní relaci). Vygeneruj nový
  OpenAI klíč, změň heslo k DB a heslo k SFTP/FTP účtu (bylo shodné s DB).
  Staré zneplatnit. Konkrétní staré hodnoty vidíš v `config.php` na serveru
  a v Supabase/hostingu — do gitu je nepiš.
  → **Řeší uživatel (27. 8. 2026).**
- [x] **P0 — `ai-api.php` nemá rate limiting.** ~~CORS hlavičku obejde kdokoli
  přes `curl`.~~ Přidán `public/_ratelimit.php` (limit podle IP, stav v temp
  souborech). `ai-api.php`: burst 3/20 s + 15/hod. Turnstile/captcha zůstává
  jako možné budoucí zpřísnění (P2).
- [x] **P0 — Kontaktní formulář nemá antispam.** Přidán honeypot (skryté pole
  `website`) + časový zámek (odeslání do 2,5 s po načtení) + rate limit
  5/hod na IP (`send-email.php` + `_ratelimit.php` + honeypot/renderedAt
  ve `Form.jsx`). Boti dostanou „úspěch" bez odeslání, aby si neladili obcházení.
- [ ] **P1 — `mail()` má špatnou doručitelnost.** Odesílání přes PHP `mail()`
  s `From: info@webkozar.cz` z cizího serveru často padá do spamu (SPF/DKIM
  nesedí). Přejít na autentizované SMTP (PHPMailer + schránka na hostingu),
  `From` nechat na reálné doméně odesílatele a `Reply-To` na zákazníka.
- [x] **P1 — Deploy přes nešifrované FTP (port 21).** `deploy.cjs` + `.env`
  smazány, `ftp-deploy`/`dotenv` odebrány z `package.json`. Nasazení nově
  ručně přes SFTP/FTPS (řeší uživatel), viz `DEPLOY.md`.
- [ ] **P1 — GDPR souhlas ve formuláři.** Formulář zpracovává osobní údaje
  (jméno, e-mail), ale chybí zaškrtávací souhlas se zpracováním + odkaz na
  zásady. Přidat povinný checkbox „Souhlasím se zpracováním údajů pro účel
  vyřízení poptávky".
- [ ] **P2 — `config.php` chránit i na úrovni serveru.** Pokud by se na hostingu
  vyplo PHP, soubor by se servíroval jako text. Přidat `.htaccess`
  (`<Files config.php> Require all denied </Files>`) nebo přesunout mimo
  webroot a načítat přes `require '../config.php'`.
- [ ] **P2 — Bezpečnostní hlavičky.** Přidat přes `.htaccess`:
  `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
  a základní `Content-Security-Policy`.
- [ ] **P2 — `new.webkozar.cz` / staging subdoména.** `robots.staging.txt` byl
  smazán. Zajistit, že subdoména buď neexistuje, nebo má `robots.txt`
  s `Disallow: /` + `X-Robots-Tag: noindex` — jinak duplicitní obsah.
  Pozn.: `internovanj.webkozar.cz` v referencích je taková subdoména —
  ověřit, že je `noindex`.
- [ ] **P3 — `ai-api.php` tiše polyká chyby DB** (`catch(PDOException $e) {}`).
  Alespoň `error_log()`, ať se dá dohledat výpadek logování.

---

## 2. Výkon (Performance / Core Web Vitals)

- [x] **P0 — LoadingScreen blokuje obsah 2,5–3,5 s.** Progress bar zkrácen na
  0,8 s (0,2 s při „omezit pohyb"), pojistný timeout na 1,4 s. `App.jsx` si
  přes `sessionStorage` (`wk-intro-seen`) pamatuje, že loader proběhl → při
  dalším prokliku webu se nezobrazuje. Ověřeno v Chrome.
- [x] **P0 — Chybí těžší váhy fontů → faux bold.** `index.css` teď importuje
  váhy 400/500/600/700 pro Space Grotesk i Outfit (subsety latin + latin-ext),
  duplicitní import z `main.jsx` odebrán. Ověřeno: `h1` má reálnou váhu 700
  z načteného fontu, ne dopočítanou.
- [~] **P1 — JS bundle ~420 kB (1 chunk).** `AIChatbot`, `CookiePolicy`,
  `LiveChatWidget`, `CookieConsent` přesunuty na `React.lazy` + `Suspense`.
  Hlavní bundle 426 → **401 kB** (gzip 130 → 124). `AIChatbot` (2,2 kB gz)
  a `CookiePolicy` (2,9 kB gz) se načtou **až po otevření**. Ověřeno v Chrome.
  **Zbývá:** `LazyMotion` + `domAnimation` (nahradit `motion.*` za `m.*`
  všude) na osekání knihovny `motion` — větší refaktor.
- [x] **P1 — `AnimatedBackground` je drahý.** Přepsáno: 4 blur elementy
  s `animate-pulse` → **statické radiální gradienty** (žádný `filter: blur`,
  žádná opacity animace). 6 vrstev → 3. Na `md+` je jedna vrstva s pomalým
  28s `transform` driftem (GPU, bez repaintu); **na mobilu žádná animace**
  (`hidden md:block`), navíc `motion-reduce:hidden`. Ověřeno v Chrome:
  0 blur filtrů, 0 pulse animací. CSS bundle 74,0 → 71,6 kB.
- [x] **P1 — `viewport={{ once: false }}` všude.** Přepnuto na `once: true`
  v `Process`, `Pricing`, `Technologies`, `Form`, `Faq` — scroll animace se
  přehrají jen jednou.
- [~] **P1 — Reference obrázky nejsou zmenšené.** Přegenerovány na max 900 px
  šířky, webp q78 (`sharp-cli` přes npx, bez přidání závislosti). Celkem
  `public/reference/` **1,32 MB → 724 kB**. Největší úspory: `zemspol` 274→118 kB,
  `dpk` 158→58 kB, `tonysound` 121→32 kB, `internova` 112→31 kB.
  **Zbývá (P2):** `srcset` + `sizes` pro menší displeje.
- [ ] **P2 — `backdrop-blur-xl` na desítkách karet.** Při scrollu se
  přepočítává rozostření pozadí pro každou kartu. Zvážit slabší `backdrop-blur-md`
  nebo u statických karet nahradit poloprůhledným plným pozadím.
- [x] **P2 — Nepoužívané subsety fontů.** Vyřešeno spolu s váhami fontů —
  `index.css` importuje jen `latin` + `latin-ext`, vietnamese subset je pryč.
- [ ] **P2 — Preload/preconnect.** Přidat `<link rel="preload" as="font" ... crossorigin>`
  pro dva klíčové fonty (400 + 700) a `preconnect` na doménu, kam míří
  `fetch('/ai-api.php')` (stejná doména, takže spíš jen jistota).
- [ ] **P2 — `vite.config.js` bez optimalizace.** Přidat `build.rollupOptions.output.manualChunks`
  (rozdělit `react`, `motion`, `lucide-react`) a spustit `rollup-plugin-visualizer`
  pro kontrolu, co bundle nafukuje.
- [ ] **P2 — `lucide-react` — ověřit tree-shaking.** Importy vypadají OK
  (pojmenované), ale zkontrolovat ve visualizeru, že se netáhne celá sada.
- [ ] **P3 — `FluidBlob` — 3 nekonečné animace** současně s pozadím. Na
  `prefers-reduced-motion` zmrazit.

---

## 3. SEO

- [ ] **P1 — `sitemap.xml` obsahuje jen homepage a `lastmod` je zamrzlý**
  (2026-08-25). U onepage je to obhajitelné, ale generovat `lastmod` při
  buildu (Vite plugin / skript). Zvážit přidání kotev jako samostatných
  `<url>` (`/#reference`, `/#cenik`) — spíš P3.
- [x] **P1 — Kotva „O nás" míří na FAQ.** Nav položka přejmenována na „FAQ"
  a sekce má `id="faq"` (dřív `#o-nas`). Pokud později vznikne reálná sekce
  O nás, přidá se jako nová položka. Ověřeno v Chrome.
- [ ] **P1 — Chybí reálný textový obsah pro SEO.** Web je vizuálně silný, ale
  obsahově tenký (žádné service-page texty, žádný blog). Konkurence v „tvorba
  webových stránek Nový Jičín/Ostrava" má rozsáhlé podstránky. Zvážit: sekci
  O nás, delší popisy služeb, případové studie u referencí, blog / rádce
  (i pár článků výrazně pomůže na long-tail dotazy).
- [ ] **P2 — JSON-LD v `index.html` se ručně rozchází s obsahem.** FAQ schema
  (6 otázek) a Offer schema (ceny) jsou napevno v `index.html` a duplikují
  data z `Faq.jsx` / `Pricing.jsx`. Když se změní text nebo cena na webu,
  strukturovaná data zůstanou stará → riziko „structured data mismatch"
  v Search Console. Řešení: generovat JSON-LD z jednoho zdroje (např. sdílený
  `src/lib/faqData.js` + build krok, nebo vložit `<script type="application/ld+json">`
  z Reactu).
- [ ] **P2 — `ProfessionalService` schema doplnit.** Chybí `image`, `logo`,
  `sameAs` (GitHub/LinkedIn), `priceRange` (např. `"10000–50000 Kč"`),
  `geo` (souřadnice) a `aggregateRating`, pokud existují reálné recenze
  (Firmy.cz, Google). `aggregateRating` jen když je čím doložit.
- [ ] **P2 — ALT texty jsou keyword-stuffed.** Reference: `alt="Tvorba webových
  stránek pro {title}"` — pro čtečku obrazovky repetitivní a nepřirozené.
  Lépe: `alt="Náhled webu {title} – {kategorie}"`. Logo má 3× stejný
  `alt="webkozar – tvorba webových stránek"`; v hlavičce stačí `alt="webkozar"`,
  v patičce klidně prázdný (`alt=""`) jako dekorativní vedle textu „webkozar".
- [ ] **P2 — Favicon / ikony.** `index.html` má jen `logo-gr-64.webp`. Doplnit
  `favicon.ico` (fallback), `apple-touch-icon.png` (180×180) a
  `site.webmanifest` s ikonami 192/512 (PWA-ready, lepší sdílení na mobilu).
- [ ] **P2 — GA4 buď doinstalovat, nebo odstranit analytickou vrstvu.**
  `cookieConsent.js` počítá s `window.gtag` (Consent Mode v2), ale žádné GA4
  na webu není. Buď přidat GA4 s Consent Mode, nebo z lišty cookies vyhodit
  kategorii „Analytické" (teď žádá souhlas s něčím, co neexistuje).
- [ ] **P3 — `changefreq: monthly` vs `priority: 1.0`** v sitemapě — kosmetika,
  Google to stejně ignoruje.
- [ ] **P3 — Breadcrumb schema** — u onepage nedává smysl, přeskočit.

---

## 4. Přístupnost (a11y)

- [~] **P1 — `CustomSelect` není plně ovladatelný klávesnicí ani čtečkou.**
  Hotovo zatím: `aria-labelledby` (napojení na popisek „Balíček"),
  `aria-haspopup="listbox"`, `aria-expanded`. **Zbývá:** `role="listbox"`
  / `role="option"` na položkách, ovládání šipkami, výběr Enterem, zavření
  Esc — nebo rovnou nahradit stylovaným nativním `<select>`.
- [x] **P1 — Formulářové `<label>` nejsou spárované s inputy.** Přidány páry
  `id`/`htmlFor` (`form-name`, `form-email`, `form-message`); u výběru balíčku
  `aria-labelledby` na `#form-balicek-label`. Ověřeno v Chrome.
- [ ] **P1 — `AIChatbot` a `LiveChatWidget` modaly bez a11y základů.**
  Chybí `role="dialog"`, `aria-modal`, focus trap, zavření na Esc, návrat
  fokusu na spouštěč po zavření. `CookiePolicy.jsx` to má vyřešené správně —
  vzít jako vzor.
- [ ] **P1 — Kontrast textu.** `text-gray-500` (#6b7280) na pozadí #050117 má
  poměr ~3,4:1 → **propadá WCAG AA** pro běžný text (používá se v `Form.jsx`
  u fakturačních údajů a v `Footer.jsx` u copyrightu/cookies odkazů).
  `text-gray-400` je hraniční (~5,9:1, projde pro normální text, ne pro < 18px
  bold). Zesvětlit sekundární text na min. `#9aa4b2` a drobný text ještě víc.
- [x] **P1 — `prefers-reduced-motion` respektuje jen LoadingScreen.**
  Přidán globální CSS guard v `index.css` (`@media (prefers-reduced-motion:
  reduce)` — utlumí CSS animace i přechody) a `<MotionConfig reducedMotion="user">`
  v `App.jsx` (utlumí JS animace knihovny motion). LoadingScreen navíc zkracuje
  svoje časy při omezeném pohybu.
- [ ] **P2 — Ikonová tlačítka bez názvu.** Plovoucí tlačítko chatu
  (`LiveChatWidget`) nemá `aria-label`. Zavírací „X" v `AIChatbot` a
  `LiveChatWidget` taky ne. Doplnit česky.
- [ ] **P2 — `aria-label="Toggle mobile menu"` je anglicky** (`Header.jsx`),
  na jinak českém webu. → `„Otevřít / zavřít menu"`.
- [ ] **P2 — Chat nemá `aria-live`.** Nové zprávy bota čtečka neoznámí.
  Kontejner zpráv v `LiveChatWidget` označit `aria-live="polite"`.
- [ ] **P2 — Chybí „přeskočit na obsah".** Přidat skip-link jako první
  fokusovatelný prvek (`<a href="#main" class="sr-only focus:not-sr-only">`).
- [ ] **P2 — Viditelný fokus.** Vlastní tlačítka a odkazy (nav, CTA, karty)
  nemají `focus-visible` styl. Přidat konzistentní `focus-visible:ring-2
  ring-[#0EC3BF]` globálně.
- [x] **P2 — `text-md` není platná Tailwind třída** (`Faq.jsx`). Nahrazeno
  `text-base`.
- [ ] **P3 — Hierarchie nadpisů.** `Footer` a „Nevíte si rady" v `Pricing`
  používají `h4` bez předchozího `h3` v dané větvi (drobné). Sjednotit.
- [ ] **P3 — Externí odkazy** (`target="_blank"`) nemají vizuální/aria
  indikaci nového okna. Přidat `aria-label="… (otevře se v novém okně)"`.

---

## 5. Responzivita

- [x] **P1 — `min-h-screen` na sekcích `Pricing`, `Faq`, `Form`.** Odebráno,
  všechny sekce mají jednotné `py-16 md:py-24 px-4 scroll-mt-24`. Ověřeno:
  mezery mezi sekcemi = 0, výška sekcí je daná obsahem (ne viewportem).
- [x] **P1 — `Pricing` — prostřední karta posunutá `bottom-[%]`.** Nahrazeno
  `md:-translate-y-4` (resp. `hover:-translate-y-2` / `md:hover:-translate-y-6`),
  neplatné `duration-900` → `duration-500`, opraveny i překlepy
  `hover:transition-all` / `hover: transition-all`.
- [x] **P1 — Nekonzistentní vertikální rytmus sekcí.** Sjednoceno na
  `py-16 md:py-24` (`Technologies` dostalo `py`, `Reference` `pb`, `Pricing`/`Faq`
  mobilní `py`). Odstraněny ad-hoc `mb-48` / `mt-24` a `whileInView` animace
  do `y: 30` (teď `y: 0`).
- [ ] **P2 — Chybí horní strop šířky.** Zkoušel jsem `xl:max-w-6xl`, ale
  na běžných monitorech (1920 px) to obsah zúžilo z ~1536 px na 1152 px →
  **vráceno zpět** na `max-w-[95%] md:max-w-[80%]`. Pokud se strop někdy
  přidá, musí být mnohem vyšší (např. `2xl:max-w-[1600px]`) a jen pro
  opravdu široké displeje.
- [x] **P2 — Hero na malých mobilech.** `h1` má nově `text-4xl` základ
  (`sm:text-5xl` …), podnadpis `text-3xl` základ.
- [x] **P2 — `Header` na úzkých displejích.** Pill nav `px-4 sm:px-8 py-3 sm:py-4`.
- [x] **P2 — Fakturační údaje `grid-cols-2`** → `grid-cols-1 sm:grid-cols-2`.
- [x] **BONUS — LoadingScreen se zasekával v záložce na pozadí.** V neaktivní
  záložce se pozastaví animace → exit animace loaderu se nedohrála. Nově se
  loader při načtení na skryté záložce (`document.visibilityState === 'hidden'`)
  vůbec nezobrazí.
- [ ] **P3 — `Process` — spojovací šipky** (`absolute -right-4`) na přesném
  `lg` breakpointu mohou vyčnívat/klipovat. Ověřit na 1024 px.
- [ ] **P3 — Ověřit na skutečném telefonu** (ne jen zúžené okno) —
  `100dvh` v Hero vs. dynamická adresní lišta, plovoucí tlačítko chatu vs.
  cookie lišta (oba `fixed bottom` — můžou se překrývat, `z-[100]` vs
  `z-[110]`).

---

## 6. UX a obsah

- [ ] **P1 — Dva chatboti volající stejný endpoint.** `AIChatbot` (průvodce
  v ceníku) i `LiveChatWidget` (plovoucí bublina) posílají na `/ai-api.php`.
  Uživatele to mate a zdvojnásobuje to plochu pro zneužití API. Zvážit
  sjednocení do jednoho widgetu s dvěma režimy.
- [ ] **P1 — Falešný odznak „1" u chatu.** `LiveChatWidget` vždy po načtení
  ukazuje červenou bublinu s „1" nepřečtenou zprávou. To je dark pattern —
  odstranit, nebo navázat na reálný stav (např. první otevření).
- [ ] **P2 — „Všechny systémy online" v patičce.** Status indikátor pro webové
  studio nic neříká a působí jako vata. Nahradit něčím konkrétním (počet
  projektů, roky na trhu) nebo odstranit.
- [ ] **P2 — LiveChat je bezkontextový.** Přestože komentář mluví o „historii
  konverzace", `ai-api.php` dostává vždy jen system prompt + poslední zprávu.
  Bot si nepamatuje předchozí repliky. Buď posílat posledních N zpráv, nebo
  z UI odstranit dojem plnohodnotné konverzace.
- [ ] **P2 — Neověřitelná čísla v Hero.** „40+ projektů, 30+ klientů,
  99% spokojenost" — pokud nejsou doložitelná, zvážit zmírnění nebo doplnění
  zdroje (odkaz na reference/recenze).
- [ ] **P2 — `Form` — úspěšná hláška mizí po 3 s.** Uživatel ji může minout.
  Nechat ji zobrazenou trvale (do dalšího odeslání) a přidat sekundární
  potvrzení (např. „Kopii jsme poslali na váš e-mail", pokud se bude posílat).
- [ ] **P2 — GitHub odkaz v patičce** (`github.com/webkozar`) — ověřit, že
  účet existuje a má obsah; jinak 404 z patičky vypadá špatně. Případně
  odkaz odstranit.
- [ ] **P2 — Chybí stránka Zásady ochrany osobních údajů / Podmínky.**
  Existuje jen cookie policy (modal). Pro firemní web s kontaktním formulářem
  je vhodné mít i plné GDPR/privacy info.
- [ ] **P3 — „Generování obrázků"** jako bullet v ceníku „Základní web" je
  vágní — upřesnit, co znamená (AI ilustrace? optimalizace fotek?).
- [ ] **P3 — Reference „Zobrazit více"** načte 7 dalších karet naráz bez
  animovaného rozbalení kontejneru — drobný skok. Zvážit `AnimatePresence`.

---

## 7. Kód a údržba

- [ ] **P1 — `body { overflow }` spravuje 4 komponenty naráz.** `Header`
  (mobilní menu), `LoadingScreen`, `CookiePolicy`, a nepřímo další modaly
  si každý sám přepínají `document.body.style.overflow`. Zavření jednoho
  odemkne scroll, i když je jiný pořád otevřený. Zavést jeden sdílený
  `useBodyScrollLock` hook s čítačem.
- [ ] **P2 — `src/App.css` je prázdný a nikde se neimportuje.** Smazat.
- [ ] **P2 — `Technologies.jsx` — `transform: translateZ(75px)`** bez
  `perspective` a `transform-style: preserve-3d` na rodiči nedělá nic.
  Pozůstatek po 3D experimentu — odstranit, nebo dodělat perspektivu.
- [ ] **P2 — `Reference.jsx` — `showReference` je funkce vracející JSX**
  se stray `{return ...}` blokem a proměnná `MoreProjects` je PascalCase,
  ač to není komponenta. Přepsat na komponentu `<ProjectGrid projects={...} />`.
- [ ] **P2 — Chybí Error Boundary.** Jakákoli chyba v renderu shodí celou
  stránku na bílo. Obalit `<App>` do error boundary s fallbackem.
- [ ] **P2 — `Form.jsx` — stav `status`** míchá `''`, `'idle'`, `'sending'`,
  `'success'`, `'error'`. Sjednotit na jednu sadu (`'idle' | 'sending' |
  'success' | 'error'`) a inicializovat `'idle'`.
- [ ] **P3 — ESLint neběží na PHP ani nekontroluje a11y.** Přidat
  `eslint-plugin-jsx-a11y` — chytne většinu bodů ze sekce 4 automaticky.
- [x] **P3 — Duplicitní import fontu.** Vyřešeno se změnou fontů — importy
  jsou jen v `index.css`, z `main.jsx` odebrány.
- [ ] **P3 — Nepoužité závislosti `clsx` a `tailwind-merge`** v `package.json`
  (nikde se neimportují). Buď odebrat, nebo použít při dalším refaktoru tříd.

---

## 8. Backend (PHP)

- [ ] **P1 — `ai-api.php` — validace odpovědi od OpenAI.** Když model vrátí
  nevalidní JSON, `json_decode` dá `null` a do Reactu se pošle rozbitý string.
  Ošetřit (`json_last_error()`), poslat čitelnou chybu.
- [ ] **P2 — `ai-api.php` — model `gpt-4o-mini` napevno.** Vytáhnout do
  `config.php`, ať jde měnit bez zásahu do kódu.
- [ ] **P2 — DB logování chatu** — ukládá se `user_message` + `ai_response`
  bez timestampu v kódu (spoléhá na default sloupce) a bez IP/session.
  Doplnit, ať jde dohledat zneužití. Zvážit retenci (mazat po X dnech kvůli
  GDPR — jsou to zprávy od návštěvníků).
- [ ] **P2 — `send-email.php` — bez potvrzení odesílateli.** Zvážit
  auto-reply „Poptávku jsme přijali".
- [ ] **P3 — Sdílený CORS/bootstrap kód** je zkopírovaný v obou PHP souborech.
  Vytáhnout do `public/_bootstrap.php`.

---

## 9. Deploy a infrastruktura

- [ ] **P1 — Generovat `lastmod` v sitemapě + JSON-LD z jednoho zdroje** při
  buildu (souvisí s SEO driftem, sekce 3). Deploy je ruční, takže spíš
  build-time krok ve Vite.
- [ ] **P1 — 301 přesměrování ze starých URL.** `.htaccess` s 301 z podstránek
  starého WordPressu na `/` nebo na kotvy. Bez toho ztráta SEO šťávy.
- [ ] **P2 — Cache hlavičky.** `.htaccess` s `Cache-Control: max-age=31536000,
  immutable` pro `/assets/*` (hashované názvy) a krátkou cache pro `index.html`.
- [ ] **P2 — Gzip/Brotli** — ověřit, že hosting komprimuje `.js`/`.css`/`.svg`.
- [ ] **P3 — Search Console + Seznam Webmaster** — přidat web, odeslat
  sitemapu, ověřit rich results (DEPLOY.md už to má v postupu — odškrtnout
  po nasazení).

---

## 10. Doporučené pořadí prací

1. **Bezpečnost P0** (sekce 1): rotace klíčů, rate limit `ai-api.php`,
   antispam formuláře.
2. **Výkon P0** (sekce 2): pryč/zkrátit LoadingScreen, doplnit váhy fontů.
3. **SEO/a11y P1 rychlovky**: kotva „O nás", `text-md` → `text-base`,
   `once: true`, `htmlFor` v labelech, `prefers-reduced-motion` guard.
4. **Responzivita P1** (sekce 5): pryč `min-h-screen`, oprava `Pricing` karty.
5. **Výkon P1**: lazy modaly, zmenšení reference obrázků, odlehčení pozadí.
6. **Obsah/UX** (sekce 6): sjednotit chatboty, pryč falešný odznak, reálná
   sekce O nás + textový obsah pro SEO.
7. **Kód/údržba a backend** (sekce 7–8): scroll-lock hook, error boundary,
   SMTP, úklid mrtvého kódu.
8. **Deploy** (sekce 9): 301 redirecty, cache hlavičky, automatizace sitemapy.
