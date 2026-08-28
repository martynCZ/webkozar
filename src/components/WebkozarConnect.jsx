import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  LayoutTemplate,
  RefreshCw,
  MessagesSquare,
  ReceiptText,
} from 'lucide-react';
import CtaButton from './CtaButton';
import { BrowserFrame, Shot } from './BrowserFrame';
import RequestLifecycle from './RequestLifecycle';

/**
 * Sekce „Webkozar Connect" na domovské stránce — úderný teaser klientského
 * portálu studia. Popsané výhradně z pohledu zákazníka. Podrobný rozpis funkcí
 * a screenshoty jsou na samostatné stránce `/connect` (komponenta `ConnectPage`).
 */
const CONNECT_PAGE = '/connect';

const miniFeatures = [
  { icon: LayoutTemplate, label: 'Zadání úpravy přes připravené šablony' },
  { icon: RefreshCw, label: 'Stav práce v reálném čase' },
  { icon: MessagesSquare, label: 'Diskuze a podklady u požadavku' },
  { icon: ReceiptText, label: 'Faktury a přehled, za co platíte' },
];

// Plovoucí kartička nad screenshotem — náznak živého přehledu stavů.
const liveStatuses = [
  { label: 'Nová stránka „Reference"', color: '#22c55e', time: 'Hotovo' },
  { label: 'Úprava ceníku', color: '#3b82f6', time: 'V řešení' },
  { label: 'Fotogalerie akce', color: '#f59e0b', time: 'Nový' },
];

function WebkozarConnect() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="connect" className="relative overflow-hidden py-16 md:py-24 px-4 scroll-mt-24">
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
            Klientský portál · v ceně webu
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Celá spolupráce na{' '}
            <motion.span
              className="bg-gradient-to-r from-[#0EC3BF] via-purple-500 to-[#0EC3BF] bg-[length:200%_auto] bg-clip-text text-transparent"
              animate={reduceMotion ? undefined : { backgroundPosition: ['0% center', '-200% center'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              jednom místě
            </motion.span>
          </h2>
          <p className="text-xl text-gray-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Žádné hledání ve vláknech e-mailů. Webkozar Connect je portál, kde si řídíte úpravy webu.
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
              Ke každému webu od nás dostanete přístup do vlastního portálu. Zadáte požadavek na úpravu,
              sledujete, jak na něm pracujeme, hotovou verzi schválíte a rovnou vidíte, kolik stála.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {miniFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.label}
                    className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3"
                  >
                    <span className="shrink-0 inline-flex p-2 rounded-lg bg-gradient-to-br from-[#0EC3BF]/20 to-purple-600/20 border border-[#0EC3BF]/30">
                      <Icon className="w-4 h-4 text-[#0EC3BF]" aria-hidden="true" />
                    </span>
                    <span className="text-sm text-gray-200" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <CtaButton to={CONNECT_PAGE}>Prohlédnout Webkozar Connect</CtaButton>
              <a
                href="#kontakt"
                className="group inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors font-medium"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Chci web s portálem
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </motion.div>

          {/* Vizuál: vrstvené okno prohlížeče + plovoucí přehled stavů */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-[#0EC3BF]/10 blur-[110px] rounded-full pointer-events-none" />

            {/* Zadní vrstva — náznak druhé obrazovky */}
            <div className="hidden sm:block absolute inset-0 translate-x-6 translate-y-8 rotate-[5deg] scale-[0.92] opacity-40 pointer-events-none">
              <BrowserFrame>
                <Shot src="/connect/fakturace.webp" alt="" label="Fakturace a výkazy práce" />
              </BrowserFrame>
            </div>

            {/* Přední vrstva */}
            <motion.div
              className="relative rounded-2xl"
              animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="rounded-[17px] p-px bg-gradient-to-br from-[#0EC3BF]/50 via-white/10 to-purple-600/50 shadow-[0_0_60px_rgba(14,195,191,0.22)]">
                <BrowserFrame>
                  <Shot
                    src="/connect/prehled.webp"
                    alt="Přehled požadavků v klientském portálu Webkozar Connect"
                    label="Klientský přehled — stavy úprav a nedávná aktivita"
                  />
                </BrowserFrame>
              </div>

              {/* Plovoucí kartička se stavy */}
              <div className="hidden sm:block absolute -left-6 -bottom-10 w-60 rounded-2xl bg-[#0b0a1a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] p-4">
                <p
                  className="text-[10px] uppercase tracking-wider text-gray-500 mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Vaše požadavky
                </p>
                <div className="space-y-2.5">
                  {liveStatuses.map((s) => (
                    <div key={s.label} className="flex items-center gap-2.5">
                      <span
                        className="shrink-0 w-2.5 h-2.5 rounded-full"
                        style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
                      />
                      <span
                        className="flex-1 truncate text-xs text-gray-200"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        {s.label}
                      </span>
                      <span className="text-[10px] text-gray-500" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {s.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 md:mt-28"
        >
          <RequestLifecycle />
        </motion.div>
      </div>
    </section>
  );
}

export default WebkozarConnect;
