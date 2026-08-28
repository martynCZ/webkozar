import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Mail, MapPin, Terminal, Github, Linkedin } from 'lucide-react';
import { NAV_LINKS as navLinks } from '../lib/navLinks';
import { SERVICE_LINKS } from '../lib/serviceLanding';
import { openCookieSettings, openCookiePolicy } from '../lib/cookieConsent';

const linkCls = 'hover:text-[#0EC3BF] transition-colors flex items-center gap-1 group';
const Dash = () => (
  <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100">
    -
  </span>
);

function Footer() {
  const currentYear = new Date().getFullYear();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const hashHref = (hash) => (isHome ? hash : `/${hash}`);

  return (
    <footer className="relative w-full overflow-hidden bg-[#050117] pt-32 pb-10 border-t border-white/5">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-[#0EC3BF]/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="max-w-[95%] md:max-w-[80%] mx-auto relative z-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/logos/webkozar-logo-icon.svg"
                alt="webkozar – tvorba webových stránek"
                width="40"
                height="40"
                loading="lazy"
                decoding="async"
                className="w-10 h-10 object-contain rounded-xl bg-white/5 p-1 border border-white/10"
              />
              <span className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                webkozar
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Posouváme hranice webového vývoje. Tvoříme rychlé, responzivní a vizuálně ohromující digitální zážitky, které prodávají.
            </p>
            
            {/* System Status Indicator */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-max mt-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0EC3BF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0EC3BF]"></span>
              </span>
              <span className="text-xs text-gray-300 uppercase tracking-wider font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Všechny systémy online
              </span>
            </div>
          </div>

          {/* Sloupec 2: Navigace + Služby */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white font-bold mb-6 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Navigace</h4>
            <ul className="flex flex-col gap-4 text-gray-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {navLinks.map((link) => (
                <li key={link.name}>
                  {link.to ? (
                    <Link to={link.to} className={linkCls}>
                      <Dash />
                      {link.name}
                    </Link>
                  ) : (
                    <a href={hashHref(link.hash)} className={linkCls}>
                      <Dash />
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <h4 className="text-white font-bold mt-8 mb-6 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Služby</h4>
            <ul className="flex flex-col gap-4 text-gray-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {SERVICE_LINKS.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className={linkCls}>
                    <Dash />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sloupec 3: Kontakt a Lokace (Zabírá 3 sloupce) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold mb-6 text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Kde nás najdete</h4>
            <ul className="flex flex-col gap-6 text-gray-400" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0EC3BF] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Moravskoslezský kraj</p>
                  <p className="text-sm mt-1">Primárně působíme v oblastech Nový Jičín a Ostrava.</p>
                </div>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer w-max">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#0EC3BF]/50 group-hover:bg-[#0EC3BF]/10 transition-all">
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-[#0EC3BF]" />
                </div>
                <a href="mailto:info@webkozar.cz" className="text-white hover:text-[#0EC3BF] transition-colors">
                  info@webkozar.cz
                </a>
              </li>
            </ul>
          </div>

          {/* Sloupec 4: CTA karta (Zabírá 3 sloupce) */}
          <div className="lg:col-span-3">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0EC3BF]/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10">
                <Terminal className="w-8 h-8 text-white/50 mb-4" />
                <h4 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Máte projekt?</h4>
                <p className="text-gray-400 text-sm mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Pojďme ho společně nakódovat k dokonalosti.
                </p>
                <a
                  href={hashHref('#kontakt')}
                  className="group/cta inline-flex items-center justify-between w-full px-5 py-3 rounded-full bg-white text-[#050117] font-bold transition-all duration-300 hover:bg-gradient-to-r hover:from-[#0EC3BF] hover:to-purple-600 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(14,195,191,0.5)]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Začít spolupráci
                  <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                </a>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Spodní lišta: Copyright & Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-gray-500 text-sm text-center" style={{ fontFamily: 'Outfit, sans-serif' }}>
              © {currentYear} <a href="https://webkozar.cz/" className="hover:text-[#0EC3BF] transition-colors">Tvorba webových stránek Nový Jičín.</a> Všechna práva vyhrazena.
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={openCookiePolicy}
                className="text-gray-500 text-sm hover:text-[#0EC3BF] transition-colors cursor-pointer"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Zásady cookies
              </button>
              <button
                type="button"
                onClick={openCookieSettings}
                className="text-gray-500 text-sm hover:text-[#0EC3BF] transition-colors cursor-pointer"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Nastavení cookies
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
              <a 
                href="https://github.com/webkozar" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#0EC3BF]/50 hover:bg-[#0EC3BF]/10 hover:shadow-[0_0_15px_rgba(14,195,191,0.2)] transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/martin-kozar-306bb8305" 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-[#0EC3BF]/50 hover:bg-[#0EC3BF]/10 hover:shadow-[0_0_15px_rgba(14,195,191,0.2)] transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;