import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS as navLinks } from '../lib/navLinks';

function Header() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const containerVars = {
    initial: { transition: { staggerChildren: 0.09, staggerDirection: -1 } },
    open: { transition: { delayChildren: 0.2, staggerChildren: 0.09, staggerDirection: 1 } },
  };

  const linkVars = {
    initial: { y: 30, opacity: 0 },
    open: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-5xl"
      >
        <nav className="relative flex items-center justify-between px-8 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(14,195,191,0.15)]">
          <div className="flex items-center gap-2 z-50">
            <img
              src="/logos/webkozar-logo-icon.svg"
              alt="webkozar – tvorba webových stránek"
              width="32"
              height="32"
              className="w-8 h-8 object-contain rounded-md"
            />      
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              webkozar
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 menu" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 z-10"
              >
                {hoveredIndex === index && (
                  <motion.span
                    layoutId="navHover"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10 backdrop-blur-md border border-white/20 shadow-[0_0_15px_rgba(14,195,191,0.2)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:block z-50">
            <a href="#kontakt" aria-label="Kontaktovat přes formulář" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white font-medium shadow-[0_0_30px_rgba(14,195,191,0.5)] hover:shadow-[0_0_50px_rgba(14,195,191,0.7)] transition-all duration-300">
              Kontaktujte nás
            </a>
          </div>

          <button 
            aria-label="Toggle mobile menu" 
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
                    <a
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-4xl font-bold text-white/80 hover:text-white transition-colors duration-300"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {link.name}
                    </a>
                  </motion.div>
                </div>
              ))}
              
              <div className="overflow-hidden mt-8 w-full max-w-xs">
                <motion.div variants={linkVars}>
                  <a
                    href="#kontakt"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex justify-center w-full px-8 py-4 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white font-bold text-lg shadow-[0_0_40px_rgba(14,195,191,0.5)]"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Kontaktujte nás
                  </a>
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