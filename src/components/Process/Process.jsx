import { motion } from 'motion/react';
import { Calculator, FileSearch, Palette, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Calculator,
    number: '01',
    title: 'Odhad ceny',
    description: 'Zmapujeme váš záměr a cíle. Na základě úvodní konzultace vám připravíme transparentní cenovou nabídku přesně na míru vašemu projektu.'
  },
  {
    icon: FileSearch,
    number: '02',
    title: 'Analýza',
    description: 'Nestřílíme naslepo. Pečlivě prozkoumáme vaši konkurenci a trh, abychom navrhli strategii, která vašemu novému webu zajistí maximální úspěch.'
  },
  {
    icon: Palette,
    number: '03',
    title: 'Návrh',
    description: 'Vytvoříme moderní design s důrazem na uživatelskou přívětivost (UX). Během tvorby úzce spolupracujeme – vaše zpětná vazba je klíčem k dokonalému výsledku.'
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Předání',
    description: 'Hotový a plně optimalizovaný (SEO) web otestujeme a vypustíme do světa. Zaškolíme vás do jeho správy a zůstaneme vám k dispozici i po spuštění projektu.'
  }
];

function Process() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-[70%] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Jak{' '}
            <span className="bg-gradient-to-r from-[#0EC3BF] to-purple-500 bg-clip-text text-transparent">
              tvoříme web
            </span>
          </h2>
          <p 
            className="text-xl text-gray-400"
          >
            Náš prověřený proces od A do Z
          </p>
        </motion.div>
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#0EC3BF]/30 to-transparent -translate-y-1/2" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl border border-white/15 shadow-[0_0_40px_rgba(14,195,191,0.15)] hover:shadow-[0_0_60px_rgba(14,195,191,0.3)] transition-all duration-500 group">
                    {/* Step Number */}
                    <div 
                      className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#0EC3BF] to-purple-600 flex items-center justify-center text-white font-bold shadow-[0_0_30px_rgba(14,195,191,0.6)]"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {step.number}
                    </div>

                    {/* Glowing Icon */}
                    <div className="mb-6 inline-flex p-4 rounded-xl bg-gradient-to-br from-[#0EC3BF]/20 to-purple-600/20 border border-[#0EC3BF]/30 shadow-[0_0_20px_rgba(14,195,191,0.3)]">
                      <Icon className="w-8 h-8 text-[#0EC3BF]" />
                    </div>

                    {/* Title */}
                    <h3 
                      className="text-2xl font-bold text-white mb-3"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p 
                      className="text-gray-400 leading-relaxed"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {step.description}
                    </p>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0EC3BF]/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Arrow Connector (Desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 -translate-y-1/2 z-10">
                      <svg 
                        className="w-full h-full text-[#0EC3BF]/50" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 7l5 5m0 0l-5 5m5-5H6" 
                        />
                      </svg>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Process