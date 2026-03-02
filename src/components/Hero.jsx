import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import FluidBlob from './FluidBlob';

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
      <div className="max-w-[80%] w-full mx-auto grid lg:grid-cols-2 items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-8 text-center lg:text-left z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-[#0EC3BF]/30 text-[#0EC3BF] text-sm font-medium"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Web - E-shop - Grafika</span>
          </motion.div>
          
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Tvorba{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#0EC3BF] via-purple-500 to-fuchsia-500 bg-clip-text text-transparent animate-pulse">
                Webových
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#0EC3BF] to-purple-600 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span>
            <br />
            Stránek <br />Nový Jičín
          </h1>
          
          <p 
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Již řadu let vytváříme webové stránky, které nejen osloví, ale především přináší hodnotu a výsledky. Pojďme společně vytvořit web, který zaujme a posune váš byznys dál.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white font-semibold shadow-[0_0_40px_rgba(14,195,191,0.6)] hover:shadow-[0_0_60px_rgba(14,195,191,0.8)] transition-all duration-300 flex items-center gap-2"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              <span className='!bg-[rgba(0,0,0,0)]'>Získejte svůj web</span>
              <ArrowRight className="!bg-[rgba(0,0,0,0)] w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Secondary Frosted Glass Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-[#0EC3BF]/50 transition-all duration-300"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Podívejte se na naše projekty
            </motion.button>
          </div>

          {/* Statistiky */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            {[
              { value: '40+', label: 'Projektů' },
              { value: '30+', label: 'Klientů' },
              { value: '99%', label: 'Spokojenost' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="text-center lg:text-left"
              >
                <div 
                  className="text-2xl md:text-3xl font-bold text-[#0EC3BF]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-sm text-gray-400"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative hidden lg:flex items-center justify-center w-full min-h-[500px]"
        >
          <FluidBlob size="xl" delay={0.5} className="z-10 relative" />
          <FluidBlob 
            size="md" 
            delay={1} 
            className="absolute top-0 right-0 -translate-y-10 translate-x-10 opacity-60 z-0" 
          />
          <FluidBlob 
            size="sm" 
            delay={1.5} 
            className="absolute bottom-10 left-10 -translate-x-1/2 opacity-80 z-20" 
          />
        </motion.div>
      </div>
    </section>
  )
}

export default Hero