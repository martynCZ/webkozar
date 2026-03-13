import { useState } from 'react';
import { motion } from 'motion/react';
import { Menu } from 'lucide-react';

function Header() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const navLinks = [
    { name: 'Tvorba', href: '#tvorba' },
    { name: 'Reference', href: '#reference' },
    { name: 'Ceník', href: '#cenik' },
    { name: 'O nás', href: '#o-nas' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4"
    >
      <nav className="relative flex items-center justify-between px-8 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(14,195,191,0.15)]">
        <div className="flex items-center gap-2">
          <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#0EC3BF] to-purple-600 shadow-[0_0_20px_rgba(14,195,191,0.6)]'>
            
          </div>        
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

        <div className="hidden md:block">
          <button aria-label="Kontaktovat přes formulář" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white font-medium shadow-[0_0_30px_rgba(14,195,191,0.5)] hover:shadow-[0_0_50px_rgba(14,195,191,0.7)] transition-all duration-300">
            Kontaktujte nás!
          </button>
        </div>

        <button aria-label="Otevřít hlavní menu" className="md:hidden text-white">
          <Menu className="w-6 h-6" />
        </button>
      </nav>
    </motion.header>
  )
}

export default Header