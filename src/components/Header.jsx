import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { NAV_LINKS as navLinks } from '../lib/navLinks';
import { useBodyScrollLock } from '../lib/useBodyScrollLock';
import CtaButton from './CtaButton';

function Header() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeHash, setActiveHash] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  // Kotva na sekci: na domovské stránce scrolluje, odjinud vede zpět na `/`.
  const hashHref = (hash) => (isHome ? hash : `/${hash}`);

  useBodyScrollLock(isMobileMenuOpen);

  // Scroll-spy: která položka menu odpovídá referenční čáře ~35 % pod horním
  // okrajem. Každá sledovaná sekce „platí" až do začátku té další (takže
  // nezařazené sekce mezi nimi – např. teaser Connectu – spadnou pod tu
  // předchozí). Poslední sekce končí svým koncem, takže v kontaktním formuláři
  // a nad první sekcí (Hero) se nezvýrazňuje nic. Mimo `/` to vypne `isHome`.
  useEffect(() => {
    if (!isHome) return;
    const hashes = navLinks.filter((link) => link.hash).map((link) => link.hash.slice(1));

    const compute = () => {
      const line = window.scrollY + window.innerHeight * 0.35;
      const sections = hashes
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          return { id, top, bottom: top + rect.height };
        })
        .filter(Boolean)
        .sort((a, b) => a.top - b.top);

      let current = null;
      for (let i = 0; i < sections.length; i += 1) {
        const start = sections[i].top;
        const end = i < sections.length - 1 ? sections[i + 1].top : sections[i].bottom;
        if (line >= start && line < end) {
          current = `#${sections[i].id}`;
          break;
        }
      }
      setActiveHash(current);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ticking = false;
      });
    };

    const raf = requestAnimationFrame(compute);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isHome, pathname]);

  const activeIndex = isHome
    ? navLinks.findIndex((link) => link.hash && link.hash === activeHash)
    : -1;
  const highlightIndex = hoveredIndex ?? (activeIndex >= 0 ? activeIndex : null);

  const containerVars = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.2, staggerChildren: 0.09, staggerDirection: 1 } },
  };

  const linkVars = {
    initial: { y: 30, opacity: 0 },
    open: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-5xl"
      >
        <nav className="relative flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(14,195,191,0.15)]">
          <Link to="/" className="flex items-center gap-2 z-50">
            <img
              src="/logos/webkozar-logo-icon.svg"
              alt="webkozar"
              width="32"
              height="32"
              className="w-8 h-8 object-contain rounded-md"
            />
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              webkozar
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 menu" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {navLinks.map((link, index) => {
              if (link.to) return null; // Connect je vpravo od CTA (viz níže)

              const highlight = highlightIndex === index;
              return (
                <a
                  key={link.name}
                  href={hashHref(link.hash)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative px-4 py-2 transition-colors duration-300 z-10 ${
                    highlight ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {highlight && (
                    <motion.span
                      layoutId="navHighlight"
                      className="absolute inset-0 -z-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_15px_rgba(14,195,191,0.2)]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {link.name}
                </a>
              );
            })}

            {/* Connect = samostatná stránka → za oddělovačem, s ikonou, bez rámečku. */}
            {navLinks
              .filter((link) => link.to)
              .map((link) => {
                const onPage = pathname === link.to;
                return (
                  <span key={link.name} className="flex items-center">
                    <span className="mx-2 h-5 w-px bg-white/20" aria-hidden="true" />
                    <Link
                      to={link.to}
                      className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 font-medium transition-colors duration-300 ${
                        onPage
                          ? 'text-[#0EC3BF]'
                          : 'text-[#0EC3BF]/80 hover:bg-[#0EC3BF]/10 hover:text-[#0EC3BF]'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                      {link.name}
                      {onPage && (
                        <span
                          className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-[#0EC3BF]"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </span>
                );
              })}
          </div>

          <div className="hidden md:block z-50">
            <CtaButton
              href={hashHref('#kontakt')}
              compact
              aria-label="Kontaktovat přes formulář"
              className="shadow-[0_0_25px_rgba(14,195,191,0.45)] hover:shadow-[0_0_40px_rgba(14,195,191,0.65)]"
            >
              Kontaktujte nás
            </CtaButton>
          </div>

          <button
            aria-label={isMobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-50 p-2 text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-6 h-6 text-[#0EC3BF]" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { delay: 0.3 } }}
            className="fixed inset-0 z-50 flex items-center pt-18 justify-center bg-[#050117]/60 overflow-hidden md:hidden"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -30, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#0EC3BF]/20 rounded-full blur-[80px]"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 40, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]"
            />
            <motion.div
              variants={containerVars}
              initial="initial"
              animate="open"
              exit="initial"
              className="relative z-10 flex flex-col items-center gap-8 w-full px-8"
            >
              {navLinks.map((link) => (
                <div key={link.name} className="overflow-hidden">
                  <motion.div variants={linkVars}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        onClick={closeMenu}
                        className="text-4xl font-bold text-[#0EC3BF] hover:text-white transition-colors duration-300"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={hashHref(link.hash)}
                        onClick={closeMenu}
                        className="text-4xl font-bold text-white/80 hover:text-white transition-colors duration-300"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {link.name}
                      </a>
                    )}
                  </motion.div>
                </div>
              ))}

              <div className="overflow-hidden mt-8 w-full max-w-xs">
                <motion.div variants={linkVars}>
                  <CtaButton
                    href={hashHref('#kontakt')}
                    onClick={closeMenu}
                    className="w-full text-lg font-bold"
                  >
                    Kontaktujte nás
                  </CtaButton>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header;
