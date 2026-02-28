import { motion } from 'motion/react';
import { Check } from 'lucide-react';
function Pricing() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-[70%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Ceník{' '}
            <motion.span 
              className="bg-gradient-to-r from-[#0EC3BF] via-purple-500 to-[#0EC3BF] bg-[length:200%_auto] bg-clip-text text-transparent"
              animate={{ backgroundPosition: ["0% center", "-200% center"] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              služeb
            </motion.span>
          </h2>
          <p 
            className="text-xl text-gray-400"
          >
            Vyberte si balíček, který nejlépe vyhovuje vašim potřebám
          </p>
        </motion.div>
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{  }}
                transition={{ duration: 0.6 }}
                className="relative"
                >
                    <div className="relative bottom-0 hover:bottom-[2%] p-10 rounded-4xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl border border-white/15 shadow-[0_0_40px_rgba(14,195,191,0.15)] hover:shadow-[0_0_100px_rgba(14,195,191,0.5)] hover:transition-all duration-900 group">
                    <h3 
                      className="text-2xl font-bold text-white mb-4"              
                    >
                      Základní
                    </h3>
                    <p 
                      className="text-gray-400 leading-relaxed"
                    >
                      Ideální pro malé projekty a osobní weby
                    </p>
                    <p
                        className="mt-3 mb-4 text-5xl font-bold text-white leading-relaxed"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                        <span className='text-gray-400 mr-1 leading-relaxed text-lg font-regular font-normal'>od </span>
                        10 000
                        <span className='text-gray-400 ml-1 leading-relaxed text-lg font-regular font-normal'> Kč</span>
                    </p>
                    <ul className="space-y-4 mb-8 text-gray-300">
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Responzivní design</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Do 5 stránek nebo onepage</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Základní SEO</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Kontaktní formulář</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>3 měsíce podpora</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>SSL certifikát</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Generování obrázků</span>
                        </li>         
                    </ul>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 w-full rounded-full bg-white/5 backdrop-blur-xl border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-[#0EC3BF]/50 transition-all duration-300"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                        Vybrat balíček
                    </motion.button>
                  </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6 }}
                className="relative"
                >
                    <div className="relative bottom-[5%] hover:bottom-[7%] p-10 rounded-4xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl border border-[#0EC3BF]/70 shadow-[0_0_80px_rgba(14,195,191,0.4)] hover:shadow-[0_0_100px_rgba(14,195,191,0.5)] hover: transition-all duration-900 group">
                    <h3 
                      className="text-2xl font-bold text-white mb-4"              
                    >
                      Standardní
                    </h3>
                    
                    <p 
                      className="text-gray-400 leading-relaxed"
                    >
                      Nejoblíbeější volba pro firmy
                    </p>
                    <p 
                        className="mt-3 mb-4 text-5xl font-bold text-white leading-relaxed"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                        <span className='text-gray-400 mr-1 leading-relaxed text-lg font-regular font-normal'>od </span>
                        <motion.span 
                        className="bg-gradient-to-r from-[#0EC3BF] via-purple-500 to-[#0EC3BF] bg-[length:200%_auto] bg-clip-text text-transparent"
                        animate={{ backgroundPosition: ["0% center", "-200% center"] }}
                        transition={{ 
                            duration: 4, 
                            repeat: Infinity, 
                            ease: "linear" 
                        }}
                        >
                        15 000
                        </motion.span>
                        <span className='text-gray-400 ml-1 leading-relaxed text-lg font-regular font-normal'> Kč</span>
                    
                    </p>
                    <ul className="space-y-4 mb-8 text-gray-300">
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 justify-center p-1 border border-[#0EC3BF]/60" 
                             />
                            <span>Vše ze Základního</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Do 15 podstránek</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Pokročilé SEO</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Google Analytics</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>6 měsíců podpora</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Multijazyčost</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Optimalizace rychlosti</span>
                        </li>         
                    </ul>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group w-full text-center px-8 py-4 rounded-full bg-gradient-to-r from-[#0EC3BF] to-purple-600 text-white font-semibold shadow-[0_0_40px_rgba(14,195,191,0.6)] hover:shadow-[0_0_60px_rgba(14,195,191,0.8)] transition-all duration-300"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                        <span className='!bg-[rgba(0,0,0,0)]'>Vybrat balíček</span>
                        </motion.button>
                  </div>
            </motion.div>


            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6 }}
                className="relative"
                >
                    <div className="relative bottom-0 hover:bottom-[2%] p-10 rounded-4xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl border border-white/15 shadow-[0_0_40px_rgba(14,195,191,0.15)] hover:shadow-[0_0_100px_rgba(14,195,191,0.5)] hover: transition-all duration-900 group">
                    <h3 
                      className="text-2xl font-bold text-white mb-4"              
                    >
                      Na míru
                    </h3>
                    <p 
                      className="text-gray-400 leading-relaxed"
                    >
                      Komplexní řešení pro velké projekty
                    </p>
                    <p
                        className="mt-3 mb-4 text-5xl font-bold text-white leading-relaxed"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                        <span className='text-gray-400 mr-1 leading-relaxed text-lg font-regular font-normal'>od </span>
                        25 000
                        <span className='text-gray-400 ml-1 leading-relaxed text-lg font-regular font-normal'> Kč</span>
                    </p>
                    <ul className="space-y-4 mb-8 text-gray-300">
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Vše ze Standardního</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Neomezený počet stránek</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>E-commerce a API integrace</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Vlastní funkcionalita</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>12 měsíců podpora</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Individuální řešení</span>
                        </li>
                        <li className='flex items-center gap-2'>
                            <Check className="w-6 h-6 text-[#0EC3BF] rounded-full justify-center p-1 border border-[#0EC3BF]/60" 
                            style={{backgroundColor:'rgba(14, 195, 191, 0.2)'}} />
                            <span>Komplexní SEO</span>
                        </li>         
                    </ul>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 w-full rounded-full bg-white/5 backdrop-blur-xl border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-[#0EC3BF]/50 transition-all duration-300"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                        Vybrat balíček
                    </motion.button>
                  </div>
            </motion.div>
            
            
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing