import { useEffect } from 'react';
import { motion } from 'motion/react';
import { X, ShieldCheck } from 'lucide-react';
import { COOKIE_CATEGORIES, openCookieSettings } from '../lib/cookieConsent';

/**
 * Zásady zpracování cookies a osobních údajů.
 * Web je jednostránkový, proto je dokument řešený jako modální okno,
 * na které se odkazuje z lišty i z patičky.
 */
function CookiePolicy({ isOpen, onClose }) {
  // Zavření klávesou Esc + zamknutí scrollu na pozadí.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Bez AnimatePresence: exit animace se nedokončovala a modal zůstával
  // připnutý v DOM jako neviditelná vrstva přes celou stránku, která
  // pohlcovala všechny kliky. Zavřený modal se proto nevykresluje vůbec.
  if (!isOpen) return null;

  return (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-policy-title"
        >
          <div
            className="absolute inset-0 bg-[#050117]/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Karta záměrně není motion.div – vnořená exit animace uvnitř
              AnimatePresence se nedokončila a modal zůstával připnutý v DOM
              jako neviditelná vrstva blokující klikání. */}
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl overflow-hidden bg-[#050117]/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(14,195,191,0.15)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0EC3BF]/60 to-transparent" />

            {/* Hlavička */}
            <div className="flex items-start justify-between gap-4 px-6 sm:px-8 pt-7 pb-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#0EC3BF] to-purple-600 shadow-[0_0_15px_rgba(14,195,191,0.4)]">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2
                    id="cookie-policy-title"
                    className="text-xl sm:text-2xl font-bold text-white"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Zásady zpracování cookies
                  </h2>
                  <p className="text-sm text-gray-400 mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Naposledy aktualizováno: 27. 8. 2026
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Zavřít zásady zpracování cookies"
                className="p-2 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Obsah */}
            <div
              className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 flex flex-col gap-7 text-gray-400 leading-relaxed"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              <Section title="Kdo údaje zpracovává">
                <p>
                  Správcem je <strong className="text-white">webkozar</strong>, Malá Strana 298,
                  742 47 Hladké Životice, IČO 72996293, DIČ CZ7802015298. V čemkoli ohledně
                  osobních údajů nás zastihnete na{' '}
                  <a href="mailto:info@webkozar.cz" className="text-[#0EC3BF] hover:underline">
                    info@webkozar.cz
                  </a>
                  .
                </p>
              </Section>

              <Section title="Co jsou cookies">
                <p>
                  Cookies jsou malé soubory, které si web ukládá ve vašem prohlížeči, aby si
                  zapamatoval vaše nastavení nebo anonymně změřil návštěvnost. Kromě cookies
                  využíváme také úložiště prohlížeče (localStorage), které funguje obdobně.
                </p>
              </Section>

              <Section title="Jaké kategorie používáme">
                <div className="flex flex-col gap-4">
                  {COOKIE_CATEGORIES.map((category) => (
                    <div
                      key={category.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className="text-white font-bold text-sm"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          {category.title}
                        </h4>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${
                            category.required
                              ? 'text-[#0EC3BF] bg-[#0EC3BF]/10 border-[#0EC3BF]/30'
                              : 'text-gray-400 bg-white/5 border-white/15'
                          }`}
                        >
                          {category.required ? 'Vždy aktivní' : 'Jen s vaším souhlasem'}
                        </span>
                      </div>
                      <p className="text-sm mt-2">{category.description}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-sm">
                  Reklamní ani profilovací cookies nepoužíváme a vaše údaje neprodáváme.
                </p>
              </Section>

              <Section title="Co konkrétně ukládáme">
                <ul className="flex flex-col gap-3">
                  <li className="flex gap-3">
                    <span className="text-[#0EC3BF] shrink-0">•</span>
                    <span>
                      <strong className="text-white">webkozar-cookie-consent</strong> — vaše volba
                      v liště cookies. Ukládá se do localStorage ve vašem prohlížeči, platí 12
                      měsíců a nikam se neodesílá. Jde o nezbytnou položku, bez níž bychom se
                      vás museli ptát při každé návštěvě.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[#0EC3BF] shrink-0">•</span>
                    <span>
                      <strong className="text-white">Google Analytics</strong> — měření
                      návštěvnosti. Spustí se výhradně po vašem souhlasu s analytickými cookies;
                      do té doby zůstává vypnuté díky režimu Google Consent Mode. Údaje jsou
                      anonymizované a zpracovává je Google Ireland Limited.
                    </span>
                  </li>
                </ul>
              </Section>

              <Section title="Kontaktní formulář a chat">
                <p>
                  Ve formuláři zpracováváme jméno, e-mail, vybraný balíček a text zprávy — pouze
                  proto, abychom mohli odpovědět na vaši poptávku. Zpráva se odesílá na náš
                  e-mail, neukládáme ji do žádné databáze a bez vašeho souhlasu ji nepoužíváme
                  k oslovování. Konverzace s AI asistentem probíhá na našem serveru a slouží
                  jen k zodpovězení vašeho dotazu.
                </p>
              </Section>

              <Section title="Jak souhlas změnit">
                <p>
                  Rozhodnutí můžete kdykoli upravit nebo odvolat — otevřete{' '}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openCookieSettings();
                    }}
                    className="text-[#0EC3BF] hover:underline cursor-pointer"
                  >
                    nastavení cookies
                  </button>{' '}
                  zde nebo odkazem v patičce webu. Cookies lze také smazat přímo v nastavení
                  svého prohlížeče.
                </p>
              </Section>

              <Section title="Vaše práva">
                <p>
                  Podle nařízení GDPR máte právo na přístup ke svým údajům, jejich opravu nebo
                  výmaz, omezení zpracování, přenositelnost a právo vznést námitku. Stačí nám
                  napsat na{' '}
                  <a href="mailto:info@webkozar.cz" className="text-[#0EC3BF] hover:underline">
                    info@webkozar.cz
                  </a>
                  . Pokud byste nebyli spokojeni s tím, jak jsme věc vyřídili, můžete se obrátit
                  na Úřad pro ochranu osobních údajů (uoou.gov.cz).
                </p>
              </Section>
            </div>

            {/* Patička */}
            <div className="px-6 sm:px-8 py-5 bg-white/5 border-t border-white/10 flex justify-end shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[#050117] font-bold hover:bg-[#0EC3BF] transition-colors cursor-pointer"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Rozumím
              </button>
            </div>
          </div>
        </motion.div>
  );
}

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-2">
      <h3
        className="text-white font-bold text-base sm:text-lg"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

export default CookiePolicy;
