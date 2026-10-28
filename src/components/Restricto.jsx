import { motion } from 'motion/react';
import { ArrowRight, MonitorSmartphone, ShieldBan, ServerOff, Languages } from 'lucide-react';
import CtaButton from './CtaButton';

/**
 * Sekce „Restricto" na domovské stránce — náš vlastní produkt: software pro
 * správu počítačové učebny ve škole. Fakta jsou z veřejného popisu produktu
 * (restricto.cz/llms.txt); nic navíc se tu nevymýšlí. Detail, ceník a zkušební
 * verze jsou na restricto.cz.
 */
const RESTRICTO_URL = 'https://restricto.cz/';

const points = [
  {
    icon: MonitorSmartphone,
    title: 'Přehled obrazovek a zámek',
    text: 'Učitel vidí obrazovky všech žáků, může je zamknout, poslat zprávu nebo soubor a převzít stanici na dálku.',
  },
  {
    icon: ShieldBan,
    title: 'Blokování AI nástrojů',
    text: 'Zablokuje ChatGPT, Gemini, Copilot a další AI nástroje, překladače i vlastní seznam stránek.',
  },
  {
    icon: ServerOff,
    title: 'Bez serveru a účtů',
    text: 'Žádný server, cloud ani účty. Data neopouštějí školu, náhledy putují přímo mezi počítači v učebně.',
  },
  {
    icon: Languages,
    title: 'Česky, pro Windows 10 a 11',
    text: 'Aplikace je v češtině. Cena 2 988 Kč ročně za učebnu do 30 stanic, 30 dní zdarma na zkoušku.',
  },
];

function Restricto() {
  return (
    <section id="restricto" className="relative overflow-hidden py-16 md:py-24 px-4 scroll-mt-24">
      <div className="max-w-[95%] md:max-w-[80%] mx-auto relative z-10">
        {/* Nadpis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 md:mb-20"
        >
          <span
            className="inline-block mb-4 px-3 py-1 rounded-full bg-[#0EC3BF]/15 border border-[#0EC3BF]/30 text-[#0EC3BF] text-xs font-medium uppercase tracking-wider"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Náš vlastní produkt
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Restricto — správa{' '}
            <span className="bg-gradient-to-r from-[#0EC3BF] via-purple-500 to-[#0EC3BF] bg-clip-text text-transparent">
              počítačové učebny
            </span>
          </h2>
          <p className="text-xl text-gray-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Kromě webů vyvíjíme i software pro školy. Restricto je náš vlastní produkt pro učitele a školní IT správce.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Učitel na své obrazovce vidí obrazovky všech žáků a může s nimi něco udělat: zamknout je, poslat
              zprávu nebo soubor, převzít stanici na dálku. Funguje bez serveru, bez cloudu a bez účtů.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {points.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="shrink-0 inline-flex p-2 rounded-lg bg-gradient-to-br from-[#0EC3BF]/20 to-purple-600/20 border border-[#0EC3BF]/30">
                        <Icon className="w-4 h-4 text-[#0EC3BF]" aria-hidden="true" />
                      </span>
                      <h3
                        className="text-base font-semibold text-white"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {point.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {point.text}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <CtaButton href={RESTRICTO_URL} target="_blank" rel="noopener">
                Více na restricto.cz
              </CtaButton>
              <a
                href={RESTRICTO_URL}
                target="_blank"
                rel="noopener"
                className="group inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors font-medium"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Software pro správu počítačové učebny Restricto
                <ArrowRight
                  className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </motion.div>

          {/* Vizuál: schéma učebny (konzole učitele + žákovské stanice, bez internetu) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-[#0EC3BF]/10 blur-[110px] rounded-full pointer-events-none" />
            <div className="relative rounded-[17px] p-px bg-gradient-to-br from-[#0EC3BF]/50 via-white/10 to-purple-600/50 shadow-[0_0_60px_rgba(14,195,191,0.22)]">
              <img
                src="/restricto/notebook-sit-1000.webp"
                srcSet="/restricto/notebook-sit-640.webp 640w, /restricto/notebook-sit-1000.webp 1000w"
                sizes="(min-width: 1024px) 40vw, 90vw"
                width="1000"
                height="558"
                loading="lazy"
                decoding="async"
                alt="Schéma učebny s Restrictem: konzole učitele a žákovské stanice propojené školní sítí, bez připojení k internetu"
                className="block w-full h-auto rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Restricto;
