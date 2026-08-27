import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, SlidersHorizontal, Check, ChevronLeft } from 'lucide-react';
import {
  COOKIE_CATEGORIES,
  ALLOW_ALL,
  DENY_ALL,
  loadConsent,
  saveConsent,
} from '../lib/cookieConsent';
// Text zásad se načte až když ho někdo otevře (samostatný chunk).
const CookiePolicy = lazy(() => import('./CookiePolicy'));

function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [preferences, setPreferences] = useState(DENY_ALL);

  // Lišta se zobrazí až po načtení stránky, aby nesoupeřila s LoadingScreen.
  useEffect(() => {
    if (loadConsent()) return;

    const timer = setTimeout(() => setIsVisible(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Umožňuje znovu otevřít nastavení odkudkoli (odkaz v patičce).
  useEffect(() => {
    const handleOpenSettings = () => {
      const saved = loadConsent();
      setPreferences(saved ? { ...saved, necessary: true } : DENY_ALL);
      setShowDetails(true);
      setIsVisible(true);
    };

    const handleOpenPolicy = () => setShowPolicy(true);

    window.addEventListener('openCookieSettings', handleOpenSettings);
    window.addEventListener('openCookiePolicy', handleOpenPolicy);
    return () => {
      window.removeEventListener('openCookieSettings', handleOpenSettings);
      window.removeEventListener('openCookiePolicy', handleOpenPolicy);
    };
  }, []);

  const closeWith = (choice) => {
    saveConsent(choice);
    setIsVisible(false);
    setShowDetails(false);
  };

  const togglePreference = (id) => {
    setPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 28 }}
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-consent-title"
          className="fixed bottom-0 left-0 right-0 z-[110] p-4 sm:p-6 pointer-events-none"
        >
          <div className="relative mx-auto w-full max-w-[95%] md:max-w-3xl pointer-events-auto">
            {/* Záře pod lištou ve stylu sekcí webu */}
            <div className="absolute -inset-x-10 -bottom-10 h-1/2 bg-[#0EC3BF]/20 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative rounded-3xl overflow-hidden bg-[#050117]/95 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(14,195,191,0.15)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#0EC3BF]/60 to-transparent" />

              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex items-center justify-center w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#0EC3BF] to-purple-600 shadow-[0_0_15px_rgba(14,195,191,0.4)]">
                    <Cookie className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h2
                        id="cookie-consent-title"
                        className="text-xl sm:text-2xl font-bold text-white"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {showDetails ? (
                          'Nastavení cookies'
                        ) : (
                          <>
                            Používáme{' '}
                            <motion.span
                              className="bg-gradient-to-r from-[#0EC3BF] via-purple-500 to-[#0EC3BF] bg-[length:200%_auto] bg-clip-text text-transparent"
                              animate={{ backgroundPosition: ['0% center', '-200% center'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                              cookies
                            </motion.span>
                          </>
                        )}
                      </h2>

                      <button
                        type="button"
                        onClick={() => closeWith(DENY_ALL)}
                        aria-label="Zavřít a odmítnout volitelné cookies"
                        className="p-2 -mt-1 -mr-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <p
                      className="text-gray-400 leading-relaxed mt-2 text-sm sm:text-base"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {showDetails
                        ? 'Vyberte si, co nám dovolíte měřit. Nezbytné cookies zajišťují chod webu a nelze je vypnout.'
                        : 'Nezbytné cookies zajišťují chod webu. S analytickými nám pomůžete web zrychlit a vylepšit. Rozhodnutí můžete kdykoli změnit.'}{' '}
                      <button
                        type="button"
                        onClick={() => setShowPolicy(true)}
                        className="text-[#0EC3BF] hover:underline cursor-pointer"
                      >
                        Zásady zpracování cookies
                      </button>
                    </p>

                    {/* Detailní nastavení kategorií */}
                    <AnimatePresence initial={false}>
                      {showDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-3 mt-5 max-h-[40vh] overflow-y-auto pr-1">
                            {COOKIE_CATEGORIES.map((category) => {
                              const isOn = category.required || preferences[category.id];

                              return (
                                <div
                                  key={category.id}
                                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3
                                        className="text-white font-bold text-sm"
                                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                                      >
                                        {category.title}
                                      </h3>
                                      {category.required && (
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#0EC3BF] px-2 py-0.5 rounded-full bg-[#0EC3BF]/10 border border-[#0EC3BF]/30">
                                          Vždy aktivní
                                        </span>
                                      )}
                                    </div>
                                    <p
                                      className="text-gray-400 text-xs sm:text-sm mt-1 leading-relaxed"
                                      style={{ fontFamily: 'Outfit, sans-serif' }}
                                    >
                                      {category.description}
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={isOn}
                                    aria-label={category.title}
                                    disabled={category.required}
                                    onClick={() => togglePreference(category.id)}
                                    className={`relative w-12 h-7 shrink-0 rounded-full border transition-colors duration-300 ${
                                      isOn
                                        ? 'bg-gradient-to-r from-[#0EC3BF] to-purple-600 border-transparent shadow-[0_0_15px_rgba(14,195,191,0.3)]'
                                        : 'bg-white/5 border-white/15'
                                    } ${category.required ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                  >
                                    <motion.span
                                      layout
                                      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                                      className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white ${
                                        isOn ? 'right-1' : 'left-1'
                                      }`}
                                    />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tlačítka */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => closeWith(ALLOW_ALL)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[#050117] font-bold hover:bg-[#0EC3BF] transition-colors cursor-pointer order-1"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        <Check className="w-4 h-4" />
                        Přijmout vše
                      </button>

                      {showDetails ? (
                        <button
                          type="button"
                          onClick={() => closeWith(preferences)}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300 font-bold hover:text-white hover:border-[#0EC3BF]/50 hover:bg-[#0EC3BF]/10 transition-all cursor-pointer order-2"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          Uložit výběr
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => closeWith(DENY_ALL)}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300 font-bold hover:text-white hover:border-[#0EC3BF]/50 hover:bg-[#0EC3BF]/10 transition-all cursor-pointer order-2"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          Odmítnout vše
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowDetails((prev) => !prev)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-400 hover:text-[#0EC3BF] transition-colors cursor-pointer order-3 sm:ml-auto"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        {showDetails ? (
                          <>
                            <ChevronLeft className="w-4 h-4" />
                            Zpět
                          </>
                        ) : (
                          <>
                            <SlidersHorizontal className="w-4 h-4" />
                            Nastavit podrobně
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {showPolicy && (
      <Suspense fallback={null}>
        <CookiePolicy isOpen onClose={() => setShowPolicy(false)} />
      </Suspense>
    )}
    </>
  );
}

export default CookieConsent;
