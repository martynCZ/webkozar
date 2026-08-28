import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import CtaButton from './CtaButton';
import { FAQ as faqs } from '../lib/knowledge';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

function Faq() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-16 md:py-24 px-4 scroll-mt-24" id="faq" >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-[95%] md:max-w-[60%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Často kladené{' '}
            <motion.span 
              className="bg-gradient-to-r from-[#0EC3BF] via-purple-500 to-[#0EC3BF] bg-[length:200%_auto] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% center", "-200% center"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`overflow-hidden rounded-3xl border transition-all duration-500 ${
                  isOpen 
                    ? 'bg-gradient-to-br from-white/10 via-white/5 to-transparent border-[#0EC3BF]/40 shadow-[0_0_30px_rgba(14,195,191,0.1)]' 
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-8 py-7 flex justify-between items-center text-left cursor-pointer group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3
                    className={`text-base md:text-xl font-bold pr-8 transition-colors duration-300 ${
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
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-4">
            Máte další otázky? Rádi vám odpovíme!
          </p>
          <div className="">
            <CtaButton href="#cenik">Vybrat balíček</CtaButton>
        </div>
        </motion.div>          
        </div>
      </div>
    </section>
  )
}

export default Faq;