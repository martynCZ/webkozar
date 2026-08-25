import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, CheckCircle2, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { selectPackageAndScroll } from '../lib/selectPackage';

function AIChatbot({ isOpen, onClose }) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // 1. Změň na svou skutečnou doménu
      const response = await fetch('https://new.webkozar.cz/ai-api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 2. Tady je ten zásadní rozdíl - posíláme type: 'wizard'
        body: JSON.stringify({ message: inputValue, type: 'wizard' })
      });

      if (!response.ok) throw new Error('Chyba komunikace se serverem.');

      const data = await response.json();
      console.log("Co přišlo z PHP:", data);
      if (data.error) {
        throw new Error(data.error);
      }

      // 3. Uložíme si celá strukturovaná data z PHP
      setResult({
        doporuceni: data.doporuceni,
        cena: data.cena,
        balicek: data.balicek
      });

    } catch (err) {
      console.error(err);
      setError('Nepodařilo se získat doporučení. Zkuste to prosím znovu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setInputValue('');
    setError(null);
  };

  const handleSelectAndScroll = () => {
    if (!result?.balicek) return;
    
    // Zavřeme modální okno chatbota
    onClose();

    // Předvyplníme balíček ve formuláři a zascrollujeme na něj
    selectPackageAndScroll(result.balicek);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#050117]/80 backdrop-blur-sm">
          {/* Pozadí pro kliknutí mimo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-pointer"
            onClick={onClose}
          />

          {/* Samotné okno AI Průvodce */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[#050117] border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(14,195,191,0.2)] overflow-hidden"
          >
            {/* Hlavička */}
            <div className="flex items-start justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0EC3BF]/20 to-purple-600/20 border border-[#0EC3BF]/30 shadow-[0_0_20px_rgba(14,195,191,0.2)]">
                  <Bot className="w-6 h-6 text-[#0EC3BF]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    AI Průvodce výběrem
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Popište detailně svůj projekt, AI vám navrhne řešení přímo z ceníku.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Obsah */}
            <div className="p-6">
              {!result ? (
                /* STAV 1: Formulář pro zadání (pokud ještě nemáme výsledek) */
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Např.: Potřebuji moderní web pro mou novou kavárnu. Chtěl bych tam mít fotogalerii, menu, kontaktní formulář a možnost online rezervace stolu..."
                    className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#0EC3BF]/50 focus:shadow-[0_0_20px_rgba(14,195,191,0.2)] resize-none transition-all"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  />
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  
                  <div className="flex justify-end">
                    <motion.button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(14,195,191,0.4)]"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>Získat doporučení <ArrowRight className="w-4 h-4" /></>
                      )}
                    </motion.button>
                  </div>
                </form>
              ) : (
                /* STAV 2: Zobrazení výsledku z AI */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-[#0EC3BF]/10 to-transparent border border-[#0EC3BF]/30 rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <CheckCircle2 className="w-8 h-8 text-[#0EC3BF] shrink-0" />
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Doporučení:
                      </h4>
                      <p className="text-gray-300 leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {result.doporuceni}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#050117]/50 rounded-xl p-4 border border-white/5 inline-block">
                    <p className="text-gray-400 text-sm mb-1">Odhadovaná cena:</p>
                    <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {result.cena}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-4 mt-8">
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <RefreshCw className="w-4 h-4" /> Nové zadání
                    </button>
                    <motion.button
                      onClick={handleSelectAndScroll}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white font-semibold shadow-[0_0_30px_rgba(14,195,191,0.4)] hover:shadow-[0_0_50px_rgba(14,195,191,0.6)] transition-shadow"
                    >
                      Poptat tento balíček <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AIChatbot;