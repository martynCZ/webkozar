# Vylepšení AI asistenta

Nápady na vycvičení a vylepšení AI (chat bublina + průvodce v ceníku).
Vznik: 2026-08-28.

## Současný stav

- `public/ai-api.php` — proxy na OpenAI `gpt-4o-mini`, `response_format:
  json_object`, dva režimy (`wizard` / `chat`) rozlišené system promptem.
- Znalosti o firmě jsou natvrdo v PHP stringu `$baseKnowledge`.
- **Chat nemá paměť** — posílá se vždy jen system prompt + poslední zpráva.
- Log do DB (`ai_chat_logs`) bez timestampu v kódu, bez IP/session.
- Model už jde měnit přes `config['openai_model']` (hotovo 2026-08-28).

---

## Vybráno k realizaci (body 1–7)

### 1. Historie konverzace  ⬅ největší dopad, malá práce
`LiveChatWidget` už drží `messages` ve stavu. Posílat do `ai-api.php`
posledních N zpráv (8–10), ne jen poslední. Ořezat na rozumný počet tokenů.
Bot pak drží kontext („a kolik by to stálo?" po předchozí otázce dává smysl).
Řeší AUDIT §6 P2 („LiveChat je bezkontextový").

### 2. Jeden zdroj znalostí místo stringu v PHP
Fakta o firmě + ceník + FAQ do jednoho souboru (`public/ai-knowledge.json`
nebo `src/lib/aiKnowledge.js` + build krok), který **čte web i `ai-api.php`**.
Změna ceny v ceníku → promítne se do bota i do JSON-LD. Řeší zároveň
AUDIT §3 P2 (structured data drift).

### 3. Retrieval z reálného obsahu webu (RAG-lite)
Build vygeneruje „knowledge pack" z reálných textů (FAQ, popisy služeb,
reference) a ten se vkládá do system promptu. Bot odpovídá slovy z webu,
nevymýšlí. Bez vektorové DB — web je malý, vejde se celý do kontextu.

### 4. Strukturované akce (tool / function calling)
Dát modelu „nástroje": `navrhni_balicek(id)`, `predvypln_formular(balicek)`,
`scrolluj_na(sekce)`. Když návštěvník řekne „chci standard", bot vrátí akci
→ frontend předvyplní formulář a odscrolluje (`selectPackageAndScroll` to
už umí, jen napojit). Wizard by se dal celý přepsat na tohle a sjednotit
s chatem (AUDIT §6 P1 — dva chatboti, jeden endpoint).

### 5. Sběr leadu přímo v chatu
Když konverzace dojde k „chci nabídku", bot požádá o e-mail/telefon a odešle
to na `send-email.php` jako poptávku (se souhrnem konverzace). Měřitelné:
kolik chatů skončí leadem.

### 6. Kvalita odpovědí — few-shot příklady + tón
Do system promptu 3–4 ukázkové páry otázka/odpověď ve správném tónu (krátce,
česky, **tučně** klíčové pojmy, nekecat o službách, co nemáte). Model se drží
stylu líp než podle abstraktních pravidel. Guardrail: „Když neznáš odpověď,
řekni to a nabídni kontakt."

### 7. Odmítání mimo-tématu a antizneužití
System prompt: „Bavíš se výhradně o webových službách webkozar. Na cokoli
jiného (obecné otázky, kód, překlady…) zdvořile odmítni." Šetří tokeny,
brání zneužití bota jako free GPT. K tomu limit délky konverzace
(např. 20 zpráv / session).

---

## Nápady mimo výběr (zatím se nedělají)

### 8. Streamování odpovědi
`gpt-4o-mini` přes SSE stream — text se píše postupně jako u ChatGPT.
Vyžaduje úpravu PHP (`stream: true`, průběžný `flush()`) i frontendu.

### 9. Vyhodnocení a ladění
- Do DB logu doplnit timestamp, session id, režim, počet tokenů, 👍/👎
  tlačítko pod odpovědí bota.
- „Eval sada": 15–20 typických dotazů + očekávané chování, pustit po každé
  změně promptu. Skript prožene přes API a vypíše odpovědi vedle sebe.

### 10. Model a náklady
- `gpt-4o-mini` → novější/levnější varianta až vyjde (změna 1 řádku v configu).
- OpenAI prompt caching — system prompt se cachuje, levnější + rychlejší.
- Krátký `max_tokens` pro chat.

### 11. Fallback, když OpenAI nedostupné
Při chybě/timeoutu nabídnout rychlé odpovědi z FAQ (keyword match nad
knowledge) + kontakt, ne jen „spojení selhalo".

---

## Doporučené pořadí (přínos / práce)

1. **Historie konverzace** (#1) — hodina práce, největší rozdíl
2. **Jeden zdroj znalostí** (#2) — vyřeší i SEO drift
3. **Few-shot + guardraily + odmítání mimo-téma** (#6, #7) — kvalita a bezpečnost
4. **RAG-lite** (#3) — navazuje na #2
5. **Tool calling + sjednocení wizardu** (#4) — větší, posune to z „chatbot"
   na „asistent"
6. **Sběr leadu** (#5) — až stojí základ

## Postup / stav

- [x] **1. Historie konverzace** (2026-08-28). `LiveChatWidget` posílá
  `history` = posledních 10 zpráv (bez uvítací a bez aktuální), mapuje
  `bot→assistant`. `ai-api.php` historii validuje (jen `user`/`assistant`,
  cap 10 položek × 1500 znaků) a vkládá mezi system prompt a aktuální zprávu.
  Jen pro `chat`, wizard zůstává jednorázový. Live otestováno – bot drží
  kontext.
- [x] **2. Jeden zdroj znalostí** (2026-08-28). Nový `public/ai-knowledge.json`
  = firma, ceník (label/cena/ID/features), FAQ, tón, refusal, few-shot
  příklady. `ai-api.php` z něj staví system prompt (`build_knowledge_block()`),
  fallback na minimum když soubor chybí.
  - [x] **Napojení frontendu** (2026-08-28). `src/lib/knowledge.js` importuje
    JSON do bundle a exportuje `PACKAGES` + `FAQ`. `Pricing.jsx` renderuje
    ceník mapou přes `knowledge.packages` (konec 3× kopírované karty; opraven
    i překlep „Multijazyčost"). `Faq.jsx` bere otázky z `FAQ`. `selectPackage.js`
    `PACKAGES` re-exportuje z `knowledge.js` (jeden zdroj).
  - [x] **JSON-LD bez driftu** (2026-08-28). `Pricing.jsx` generuje
    `OfferCatalog` z `knowledge.packages` (jako `Faq.jsx` `FAQPage`), do HTML
    přes prerender. `index.html` `#business` má jen `hasOfferCatalog` →
    `{ "@id": "…/#offercatalog" }`. Vyřešeno AUDIT §3 P2, past v CLAUDE.md
    (JSON-LD ceník napevno) je pryč.
- [x] **6. Few-shot + tón + guardrail** (2026-08-28). Tón i pravidla
  („když neznáš, přiznej + nabídni kontakt") v `ai-knowledge.json` → prompt.
  4 few-shot páry (user/assistant) se vkládají do `messages` jen pro `chat`.
- [x] **7. Odmítání mimo-téma + limit délky** (2026-08-28). `refusal` v
  knowledge → prompt (live otestováno: odmítne Python kód, nabídne pomoc
  s webem). Frontend: strop 20 zpráv od uživatele / session, pak bot pošle
  „napište přes formulář" bez volání API.
- [ ] 3. RAG-lite z obsahu webu — **doporučeno přeskočit** (`ai-knowledge.json`
  už pokrývá celý obsah webu, RAG by jen duplikoval)
- [x] **4. Tool calling + sjednocení wizardu** (2026-08-28). Nepoužívá se
  OpenAI `tools` API (konflikt s `response_format: json_object` + 2 roundtripy)
  – místo toho **rozšířené schéma**: chat vrací `{ reply, akce }`. `akce` =
  `null` | `{typ:"predvypln_formular",balicek}` | `{typ:"prejdi_na",sekce}` |
  `{typ:"odhad_ceny",balicek,cena,zduvodneni}` | `{typ:"navrhnout_poptavku",…}`.
  `ai-api.php` každou akci **whitelistuje** (typ + hodnoty proti ID balíčků /
  seznamu sekcí) a přeskládá výstup. Frontend (`LiveChatWidget`): scroll akce
  přes `selectPackageAndScroll()` / `scrollIntoView`, `odhad_ceny` →
  `EstimateCard` (balíček + cena + tlačítko Poptat), `navrhnout_poptavku` →
  `LeadCard`. Few-shot příklad pro každý typ.
  **Sjednocení:** `AIChatbot.jsx` (wizard v ceníku) **smazán**, `ai-api.php`
  má jediný režim (odstraněn `type`/`wizard` větev, `doporuceni/cena` klíče).
  Tlačítko v ceníku „Zeptat se AI asistenta" → `openChat()` (`src/lib/openChat.js`,
  `CustomEvent`) otevře plovoucí chat s výzvou k popisu projektu. AUDIT §6 P1
  hotové.
- [x] **5. Sběr leadu v chatu** (2026-08-28). Třetí typ akce:
  `{ typ:"navrhnout_poptavku", jmeno, email, telefon, balicek, shrnuti }`.
  System prompt: bot si v konverzaci vyžádá jméno + e-mail, shrne potřebu,
  vrátí akci. `ai-api.php` pole očistí (jméno/e-mail povinné, `filter_var`,
  délkové stropy, `balicek` proti ID).
  **AI poptávku NEODESÍLÁ.** `LiveChatWidget` z akce vyrenderuje `LeadCard` –
  přehled údajů + tlačítka **Odeslat / Zrušit**. Teprve klik návštěvníka pošle
  `POST /send-email.php` (vlastní validace + rate limit 5/hod; honeypot/time-lock
  chat nezablokuje – `renderedAt` chybí → `$tooFast=false`). Stavy karty:
  pending → sending → sent / error (retry) / cancelled.
  2 few-shot příklady (predvypln + navrhnout_poptavku), FAQ „Můžu poslat
  poptávku přes chat?", tón uvádí chat jako možnost (dřív bot tvrdil „jen přes
  formulář").

## ⚠️ Deploy

`public/ai-knowledge.json` se buildem kopíruje do `dist/` – nahraje se s ním.
Ceník i FAQ teď web čte z `ai-knowledge.json` (bod 2), takže se udržuje 1×.

**Nasazeno na produkci 2026-08-28:** body 2 (frontend napojení + JSON-LD),
4 bez sjednocení (akce predvypln_formular, prejdi_na) a 5 (LeadCard) – živé
a ověřené.

**Čeká na deploy:** dokončení bodu 4 – smazaný wizard, akce `odhad_ceny`
(`EstimateCard`), `openChat()`, jediný režim `ai-api.php`. Full build + deploy.

Vše necommitnuto do gitu (working tree). Hotové: body 1–7 kromě RAG-lite (bod 3,
záměrně přeskočen).

Stav udržovat tady.
