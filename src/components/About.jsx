import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Code2,
  Gauge,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  CalendarDays,
  LayoutDashboard,
} from 'lucide-react';

const principles = [
  {
    icon: MessageCircle,
    title: 'Jednáte přímo s námi',
    text: 'Žádný prostředník. Domlouváte se telefonem, e-mailem nebo na schůzce s lidmi, kteří web opravdu dělají.',
  },
  {
    icon: Code2,
    title: 'Na míru i na WordPressu',
    text: 'Podle rozsahu a rozpočtu web postavíme vlastním kódem, nebo na WordPressu s tématem Avada, který si pak spravíte i sami.',
  },
  {
    icon: Gauge,
    title: 'SEO a rychlost v základu',
    text: 'Optimalizaci pro vyhledávače a rychlé načítání řešíme u každého webu — ne za příplatek.',
  },
  {
    icon: MapPin,
    title: 'Nový Jičín a Ostrava',
    text: 'Působíme hlavně na Novojičínsku a Ostravsku a rozumíme tomu, co tu zákazníci ve vyhledávání hledají.',
  },
];

const channels = [
  { icon: Phone, label: 'Telefon' },
  { icon: Mail, label: 'E-mail' },
  { icon: CalendarDays, label: 'Osobní schůzka' },
  { icon: LayoutDashboard, label: 'Webkozar Connect' },
];

const capabilities = [
  { label: 'Tvorba webů', to: '/tvorba-webovych-stranek-novy-jicin' },
  { label: 'Webdesign', to: '/webdesign-novy-jicin' },
  { label: 'SEO a analytika', to: '/seo-novy-jicin' },
  { label: 'Loga a grafika' },
  { label: 'E-shopy' },
  { label: 'Správa a hosting' },
  { label: 'Domény' },
  { label: 'Školení správy webu' },
];

function About() {
  return (
    <section className="relative py-16 md:py-24 px-4 scroll-mt-24" id="o-nas">
      <div className="max-w-[95%] md:max-w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 backdrop-blur-sm border border-[#0EC3BF]/30 text-[#0EC3BF] text-sm font-medium"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Osobní a individuální přístup
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Kdo je{' '}
            <motion.span
              className="bg-gradient-to-r from-[#0EC3BF] via-purple-500 to-[#0EC3BF] bg-[length:200%_auto] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0% center', '-200% center'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              webkozar
            </motion.span>
          </h2>
          <p className="text-xl text-gray-400">
            Weby na míru i na WordPressu pro firmy, obce a spolky z Nového Jičína a Ostravy
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
          {/* Narrativní karta s tyrkysovo-fialovým akcentem */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl border border-white/15 shadow-[0_0_40px_rgba(14,195,191,0.12)]"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#0EC3BF] to-purple-600" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full">
              <div
                className="flex flex-col gap-5 text-gray-400 leading-relaxed text-lg"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <p>
                  webkozar je <strong className="text-white">tvorba webových stránek a webdesign
                  z Nového Jičína</strong>. Jsme dva a weby děláme celé sami — od návrhu a textů po
                  nasazení. Za sebou máme přes 40 hotových webů pro firmy, obce, školy, spolky
                  i sportovní kluby z Novojičínska, Ostravska a celého Moravskoslezského kraje.
                </p>
                <p>
                  Zakládáme si na <strong className="text-white">osobním a individuálním
                  přístupu</strong>. Řešení přizpůsobujeme tomu, co potřebujete vy, ne šabloně —
                  a domlouváme se napřímo. Podle rozsahu web postavíme vlastním kódem, nebo na
                  WordPressu s tématem Avada. Obrázky generujeme přes AI, takže je nemusíte řešit
                  po stránce autorských práv.
                </p>
                <p>
                  Ke každému webu dostanete přístup do portálu{' '}
                  <strong className="text-white">Webkozar Connect</strong> — zadáváte v něm úpravy,
                  vidíte jejich stav i cenu předem a máte pohromadě faktury. Po spuštění máte v ceně{' '}
                  <strong className="text-white">správu a drobné úpravy</strong> (texty, fotky,
                  výměna údajů); větší věci jako nová stránka nebo sekce jsou samostatná zakázka.
                  Rozsah a délku má každý balíček v ceníku, dál pokračujeme ročním předplatným nebo
                  jednotlivými úpravami — vždy přehledně přes Connect.
                </p>
              </div>

              {/* Kanály, kterými s námi jednáte */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p
                  className="text-xs uppercase tracking-wider text-gray-500 mb-3"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Jednáte s námi napřímo
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {channels.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <span
                        key={channel.label}
                        className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-sm text-gray-200"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        <span className="inline-flex p-1.5 rounded-lg bg-gradient-to-br from-[#0EC3BF]/20 to-purple-600/20 border border-[#0EC3BF]/30">
                          <Icon className="w-3.5 h-3.5 text-[#0EC3BF]" aria-hidden="true" />
                        </span>
                        {channel.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Principy – 2×2 mřížka s hover efektem jako v sekci „Jak tvoříme" */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 sm:auto-rows-fr gap-5">
            {principles.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative h-full overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl border border-white/15 shadow-[0_0_40px_rgba(14,195,191,0.1)] hover:shadow-[0_0_50px_rgba(14,195,191,0.28)] transition-all duration-500"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0EC3BF]/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br from-[#0EC3BF]/20 to-purple-600/20 border border-[#0EC3BF]/30 shadow-[0_0_20px_rgba(14,195,191,0.25)]">
                      <Icon className="w-6 h-6 text-[#0EC3BF]" aria-hidden="true" />
                    </div>
                    <h3
                      className="text-lg font-bold text-white mb-2"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm text-gray-400 leading-relaxed"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Co všechno u nás vyřešíte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-gray-500 mr-1">Vyřešíte u nás:</span>
            {capabilities.map((item) => {
              const cls =
                'px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-[#0EC3BF]/40 hover:text-white transition-colors';
              return item.to ? (
                <Link key={item.label} to={item.to} className={cls}>
                  {item.label}
                </Link>
              ) : (
                <span key={item.label} className={cls}>
                  {item.label}
                </span>
              );
            })}
          </div>
          <p className="mt-4 text-center text-sm text-gray-500">
            Hosting řešíme přes Svět hostingu, domény přes Subreg.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
