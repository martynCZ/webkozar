import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Check,
  LayoutTemplate,
  Activity,
  ReceiptText,
  RefreshCw,
  BellRing,
  History,
  Paperclip,
  Star,
  MoonStar,
  List,
  LayoutGrid,
} from 'lucide-react';
import CtaButton from '../components/CtaButton';
import { BrowserFrame, Shot } from '../components/BrowserFrame';
import RequestLifecycle from '../components/RequestLifecycle';
import ChaosVsConnect from '../components/ChaosVsConnect';
import { usePageMeta } from '../lib/usePageMeta';

const SG = { fontFamily: 'Space Grotesk, sans-serif' };
const OF = { fontFamily: 'Outfit, sans-serif' };

const heroStatuses = [
  { label: 'Nová stránka „Reference"', color: '#22c55e', time: 'Hotovo' },
  { label: 'Úprava ceníku', color: '#3b82f6', time: 'V řešení' },
  { label: 'Fotogalerie akce', color: '#f59e0b', time: 'Nový' },
];

const featureRows = [
  {
    icon: LayoutTemplate,
    kicker: 'Zadání požadavku',
    title: 'Řeknete si o úpravu způsobem, který vás navede',
    text: 'Vyberete jednu z pěti šablon — nová stránka, úprava obsahu, ceník, blog nebo obecný dotaz — a průvodce se doptá jen na to, co je opravdu potřeba. U nové stránky si navíc poskládáte hrubou strukturu z bloků (hero, služby, galerie, ceník, FAQ…) pouhým přetažením. My pak přesně víme, co chcete.',
    points: ['Pět připravených šablon', 'Průvodce místo prázdného e-mailu', 'Struktura stránky z bloků'],
    shot: {
      src: '/connect/sablony.jpg',
      alt: 'Výběr šablony nového požadavku v portálu Webkozar Connect',
      label: 'Screenshot: výběr z pěti šablon požadavku',
    },
  },
  {
    icon: Activity,
    kicker: 'Přehled o práci',
    title: 'Vidíte v reálném čase, jak na úpravě pracujeme',
    text: 'Každý požadavek prochází jasnými stavy od „Nový" po „Hotovo". U každého máte odhad ceny předem, diskuzi přímo s námi, přiložené podklady i kompletní historii změn. Když je práce hotová, jedním kliknutím ji schválíte — nebo vrátíte s komentářem.',
    points: [
      'Stav a odhad ceny na jednom místě',
      'Diskuze místo přeposílaných e-mailů',
      'Schválení, nebo vrácení s komentářem',
    ],
    shot: {
      src: '/connect/detail.jpg',
      alt: 'Detail požadavku se stavem, odhadem ceny a diskuzí v portálu Webkozar Connect',
      label: 'Screenshot: detail požadavku — stav, odhad ceny, diskuze',
    },
  },
  {
    icon: ReceiptText,
    kicker: 'Fakturace',
    title: 'Faktury a přehled „za co platím" bez papírování',
    text: 'Faktury máte v portálu ke stažení v PDF, včetně přehledu „za co platím" — řádek po řádku odvedená práce s hodinami a cenou. Na první pohled vidíte, co je uhrazené, co čeká na platbu a co zatím není vyfakturované.',
    points: ['Faktury v PDF ke stažení', 'Rozpis práce řádek po řádku', 'Přehled uhrazeno / k úhradě'],
    shot: {
      src: '/connect/fakturace.webp',
      alt: 'Přehled faktur a výkazů práce v portálu Webkozar Connect',
      label: 'Screenshot: fakturace a výkazy práce',
    },
  },
];

const perks = [
  { icon: RefreshCw, title: 'Realtime aktualizace', desc: 'Změny se objeví hned, bez obnovování stránky.' },
  { icon: BellRing, title: 'Notifikace a zvoneček', desc: 'Upozornění v prohlížeči i historie oznámení.' },
  { icon: History, title: 'Historie změn', desc: 'U každého požadavku časová osa, kdo co kdy udělal.' },
  { icon: Paperclip, title: 'Přílohy a obrázky', desc: 'Podklady nahrajete přetažením, máme je hned u požadavku.' },
  { icon: Star, title: 'Hodnocení práce', desc: 'Hotovou úpravu ohodnotíte hvězdičkami.' },
  { icon: MoonStar, title: 'Tmavý i světlý režim', desc: 'Portál se přizpůsobí vám i vašemu zařízení.' },
];

const flowDots = ['#f59e0b', '#3b82f6', '#a855f7', '#f43f5e', '#22c55e'];

function ConnectPage() {
  const reduce = useReducedMotion();
  usePageMeta('/connect');

  return (
    <main className="relative z-10 px-4 pt-32 md:pt-40 pb-16 md:pb-24">
      <div className="max-w-[95%] md:max-w-[80%] mx-auto">
        {/* ---------- Hero ---------- */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-28 md:mb-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="inline-block mb-4 px-3 py-1 rounded-full bg-[#0EC3BF]/15 border border-[#0EC3BF]/30 text-[#0EC3BF] text-xs font-medium uppercase tracking-wider"
              style={SG}
            >
              Klientský portál webkozar
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={SG}
            >
              Webkozar Connect: celá spolupráce na{' '}
              <span className="bg-gradient-to-r from-[#0EC3BF] to-purple-500 bg-clip-text text-transparent">
                jednom místě
              </span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8" style={OF}>
              Ke každému webu od nás dostanete přístup do vlastního portálu. Místo hledání v e-mailech
              zadáváte úpravy, sledujete jejich stav a máte přehled o tom, co platíte — všechno na
              jednom místě a v reálném čase.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <CtaButton href="/#kontakt">Chci web s portálem</CtaButton>
              <a
                href="#jak-funguje"
                className="group inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors font-medium"
                style={OF}
              >
                Jak to funguje
                <ArrowRight
                  className="w-4 h-4 rotate-90 transition-transform duration-300 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-[#0EC3BF]/10 blur-[110px] rounded-full pointer-events-none" />

            <div className="hidden sm:block absolute inset-0 translate-x-6 translate-y-8 rotate-[5deg] scale-[0.92] opacity-40 pointer-events-none">
              <BrowserFrame>
                <Shot src="/connect/fakturace.webp" alt="" label="Fakturace a výkazy práce" />
              </BrowserFrame>
            </div>

            <motion.div
              className="relative rounded-2xl"
              animate={reduce ? undefined : { y: [0, -12, 0] }}
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

              <div className="hidden sm:block absolute -left-6 -bottom-10 w-60 rounded-2xl bg-[#0b0a1a]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] p-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-3" style={SG}>
                  Vaše požadavky
                </p>
                <div className="space-y-2.5">
                  {heroStatuses.map((s) => (
                    <div key={s.label} className="flex items-center gap-2.5">
                      <span
                        className="shrink-0 w-2.5 h-2.5 rounded-full"
                        style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
                      />
                      <span className="flex-1 truncate text-xs text-gray-200" style={OF}>
                        {s.label}
                      </span>
                      <span className="text-[10px] text-gray-500" style={OF}>
                        {s.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ---------- Cesta požadavku ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-28 md:mb-40"
        >
          <RequestLifecycle
            heading="Cesta jednoho požadavku"
            subheading="Pět jasných stavů — vždy víte, co se právě děje"
          />
        </motion.div>

        {/* ---------- Rozpad na funkce ---------- */}
        <div id="jak-funguje" className="scroll-mt-32 space-y-24 md:space-y-36 mb-28 md:mb-40">
          {featureRows.map((row, index) => {
            const Icon = row.icon;
            const flip = index % 2 === 1;
            return (
              <div key={row.title} className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className={`relative ${flip ? 'lg:order-2' : ''}`}
                >
                  <span
                    className="pointer-events-none absolute -top-16 -left-2 select-none text-[7rem] font-bold leading-none text-white/[0.04]"
                    style={SG}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span
                    className="relative inline-flex items-center gap-2 rounded-full border border-[#0EC3BF]/30 bg-[#0EC3BF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0EC3BF]"
                    style={SG}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    {row.kicker}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-4" style={SG}>
                    {row.title}
                  </h2>
                  <p className="text-gray-400 leading-relaxed mb-6" style={OF}>
                    {row.text}
                  </p>
                  <ul className="space-y-2">
                    {row.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0 inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#0EC3BF]/20 border border-[#0EC3BF]/40">
                          <Check className="w-3 h-3 text-[#0EC3BF]" aria-hidden="true" />
                        </span>
                        <span className="text-gray-300" style={OF}>
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`group relative ${flip ? 'lg:order-1' : ''}`}
                >
                  <div className="absolute -inset-6 bg-[#0EC3BF]/10 blur-[90px] rounded-full pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative rounded-[17px] p-px bg-gradient-to-br from-[#0EC3BF]/40 via-white/10 to-purple-600/40 shadow-[0_0_50px_rgba(14,195,191,0.18)] transition-shadow duration-500 group-hover:shadow-[0_0_70px_rgba(14,195,191,0.3)]">
                    <BrowserFrame>
                      <Shot src={row.shot.src} alt={row.shot.alt} label={row.shot.label} />
                    </BrowserFrame>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ---------- Dva pohledy: Seznam / Kanban ---------- */}
        <div className="mb-28 md:mb-40">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-white text-center mb-3"
            style={SG}
          >
            Dva pohledy na vaše požadavky
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
            style={OF}
          >
            Přepnete se jedním kliknutím — podle toho, co se vám zrovna hodí.
          </motion.p>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            {[
              {
                icon: List,
                name: 'Seznam',
                desc: 'Přehledný výpis všech úprav pod sebou — stav, priorita, termín a rychlé akce na jednom řádku.',
                shot: {
                  src: '/connect/seznam.webp',
                  alt: 'Požadavky v zobrazení Seznam v portálu Webkozar Connect',
                  label: 'Screenshot: zobrazení Seznam',
                },
              },
              {
                icon: LayoutGrid,
                name: 'Kanban',
                desc: 'Nástěnka se sloupci podle stavu. Na první pohled vidíte, kolik úprav je nových, v řešení a čeká na vás.',
                shot: {
                  src: '/connect/kanban.webp',
                  alt: 'Požadavky v zobrazení Kanban v portálu Webkozar Connect',
                  label: 'Screenshot: zobrazení Kanban',
                },
              },
            ].map((view, index) => {
              const Icon = view.icon;
              return (
                <motion.div
                  key={view.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  <span
                    className="inline-flex items-center gap-2 rounded-full border border-[#0EC3BF]/30 bg-[#0EC3BF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0EC3BF]"
                    style={SG}
                  >
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    {view.name}
                  </span>
                  <p className="text-gray-400 leading-relaxed mt-3 mb-5" style={OF}>
                    {view.desc}
                  </p>
                  <div className="absolute -inset-6 top-16 bg-[#0EC3BF]/10 blur-[90px] rounded-full pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative rounded-[17px] p-px bg-gradient-to-br from-[#0EC3BF]/40 via-white/10 to-purple-600/40 shadow-[0_0_50px_rgba(14,195,191,0.18)] transition-shadow duration-500 group-hover:shadow-[0_0_70px_rgba(14,195,191,0.3)]">
                    <BrowserFrame>
                      <Shot src={view.shot.src} alt={view.shot.alt} label={view.shot.label} />
                    </BrowserFrame>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ---------- Konec e-mailového chaosu ---------- */}
        <div className="mb-28 md:mb-40">
          <ChaosVsConnect />
        </div>

        {/* ---------- Další drobnosti ---------- */}
        <div className="mb-28 md:mb-40">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-white text-center mb-10"
            style={SG}
          >
            Co dál v portálu máte
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="p-6 rounded-3xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl border border-white/15 shadow-[0_0_40px_rgba(14,195,191,0.12)] hover:border-[#0EC3BF]/30 hover:shadow-[0_0_55px_rgba(14,195,191,0.22)] transition-colors duration-300"
                >
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-[#0EC3BF]/20 to-purple-600/20 border border-[#0EC3BF]/30">
                    <Icon className="w-6 h-6 text-[#0EC3BF]" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2" style={SG}>
                    {perk.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed" style={OF}>
                    {perk.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ---------- Závěrečné CTA ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl border border-white/15 shadow-[0_0_60px_rgba(14,195,191,0.15)] p-8 md:p-14 text-center"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-[#0EC3BF]/12 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <div className="mb-6 flex items-center justify-center gap-2">
              {flowDots.map((color, i) => (
                <span
                  key={color}
                  className="h-2 w-2 rounded-full"
                  style={{ background: color, boxShadow: `0 0 10px ${color}`, opacity: 0.5 + i * 0.12 }}
                />
              ))}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={SG}>
              Portál dostanete ke každému webu od nás
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto" style={OF}>
              Webkozar Connect je součástí každé zakázky — bez příplatku. Napište nám a projdeme si
              spolu, jak by vám mohl usnadnit správu webu.
            </p>
            <CtaButton href="/#kontakt">Napište nám</CtaButton>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default ConnectPage;
