import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Tvoříte weby jen pro klienty z Nového Jičína a Ostravy?',
    answer: 'Ne, rozhodně ne! Ačkoliv máme sídlo v Hladkých Životicích u Nového Jičína a rádi spolupracujeme s klienty z Ostravy a celého Moravskoslezského kraje, naše služby nejsou geograficky omezené. Díky moderním technologiím a online komunikaci vytváříme webové stránky a aplikace pro klienty z celé České republiky i zahraničí. Vzdálenost není překážkou - důležitá je kvalita výsledku a vaše spokojenost.'
  },
  {
    question: 'Jak dlouho trvá tvorba webových stránek?',
    answer: 'Doba realizace závisí na rozsahu a komplexnosti projektu. Jednoduchý prezentační web můžeme dokončit za 2-3 týdny, komplexnější firemní stránky s vlastním designem obvykle trvají 4-6 týdnů. Aplikace na míru mohou zabrat 8-12 týdnů i více. Vždy se snažíme dodržet dohodnuté termíny a pravidelně vás informujeme o průběhu prací. Pokud potřebujete web urgentně, nabízíme i expresní realizaci.'
  },
  {
    question: 'Co všechno zahrnuje SEO optimalizace?',
    answer: 'Naše SEO optimalizace je komplexní služba zahrnující technické SEO (rychlost načítání, mobilní optimalizaci, strukturovaná data), on-page optimalizaci (meta tagy, nadpisy, klíčová slova, ALT texty), tvorbu kvalitního obsahu, analýzu konkurence, výzkum klíčových slov a local SEO pro místní firmy. Díky tomu vaše stránky dosáhnou lepších pozic ve vyhledávačích a přivedou více zákazníků.'
  },
  {
    question: 'Kolik stojí vytvoření webových stránek?',
    answer: 'Cena se odvíjí od typu a rozsahu projektu. Základní prezentační web začíná od 10 000 Kč, profesionální firemní web s vlastním designem od 15 000 Kč a komplexní weby na míru od 25 000 Kč. V ceně je vždy zahrnut responzivní design, základní SEO optimalizace a podpora. Rádi vám připravíme cenovou nabídku přesně na míru vašim potřebám.'
  },
  {
    question: 'Poskytujete také správu a údržbu webu?',
    answer: 'Ano! Nabízíme komplexní servis včetně technické podpory, aktualizace obsahu, pravidelných záloh, bezpečnostních aktualizací, monitoringu výkonu a SEO optimalizace. Můžete si vybrat z několika servisních balíčků podle vašich potřeb - od základní technické podpory až po kompletní správu webu s pravidelnými aktualizacemi.'
  },
  {
    question: 'Budou webové stránky optimalizované pro mobily?',
    answer: 'Rozhodně ano! Všechny naše weby vytváříme v responzivním designu, což znamená, že perfektně fungují na všech zařízeních - od mobilních telefonů přes tablety až po velké monitory. Mobilní optimalizace je dnes klíčová nejen pro uživatele, ale i pro SEO - Google upřednostňuje mobilně optimalizované stránky.'
  }
];

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative md:py-24 px-4 scroll-mt-8 min-h-screen" id="faq" >
      <div className="max-w-[90%] md:max-w-[60%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Často kladené{' '}
            <motion.span 
              className="bg-gradient-to-r from-[#0EC3BF] via-purple-500 to-[#0EC3BF] bg-[length:200%_auto] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% center", "-200% center"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              dotazy
            </motion.span>
          </h2>
          <p className="text-xl text-gray-400">
            Vše, co potřebujete vědět před začátkem spolupráce
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`overflow-hidden rounded-2xl border transition-all duration-500 ${
                  isOpen 
                    ? 'bg-gradient-to-br from-white/10 via-white/5 to-transparent border-[#0EC3BF]/40 shadow-[0_0_30px_rgba(14,195,191,0.1)]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-6 py-7 flex justify-between items-center text-left cursor-pointer group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 
                    className={`text-md md:text-xl font-bold pr-8 transition-colors duration-300 ${
                      isOpen ? 'text-[#0EC3BF]' : 'text-white group-hover:text-gray-200'
                    }`}                
                  >
                    {faq.question}
                  </h3>
                  <div className={`shrink-0 inline-flex p-2 rounded-full border transition-all duration-500 ${
                    isOpen 
                      ? 'bg-gradient-to-br from-[#0EC3BF] to-purple-600 border-transparent shadow-[0_0_20px_rgba(14,195,191,0.4)]' 
                      : 'bg-[#0EC3BF]/10 border-[#0EC3BF]/30 group-hover:bg-[#0EC3BF]/20'
                  }`}>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-[#0EC3BF]'}`} aria-hidden="true" />
                    </motion.div>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-6 pb-7 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                        <p style={{ fontFamily: 'Outfit, sans-serif' }}>
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>                
                  )}               
                </AnimatePresence>
              </motion.div>
            );
          })}
          <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 30 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className=" text-gray-400 mb-4">
            Máte další otázky? Rádi vám odpovíme!
          </p>
          <div className="hidden md:block">
          <button aria-label="Kontaktovat přes formulář" className="cursor-pointer px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white font-medium shadow-[0_0_30px_rgba(14,195,191,0.5)] hover:shadow-[0_0_50px_rgba(14,195,191,0.7)] transition-all duration-300">
            Kontaktujte nás!
          </button>
        </div>
        </motion.div>          
        </div>
      </div>
    </section>
  )
}

export default Faq;