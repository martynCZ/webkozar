import { motion } from 'motion/react';

export function LoadingScreen({ onComplete }) {
  return (
    <motion.div
      // Fixní pozice přes celou obrazovku, nejvyšší z-index
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#050117]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }} // Animace zmizení
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Rotující neonové kruhy */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-8">
        {/* Vnější fialový kruh */}
        <motion.div
          className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Vnitřní tyrkysový kruh (točí se na druhou stranu) */}
        <motion.div
          className="absolute inset-4 rounded-full border-b-2 border-l-2 border-[#0EC3BF] shadow-[0_0_20px_rgba(14,195,191,0.5)]"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        {/* Pulzující jádro uprostřed */}
        <motion.div
          className="w-10 h-10 bg-gradient-to-br from-[#0EC3BF] to-[#A855F7] rounded-full blur-md"
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Značka webkozar */}
      <div className="overflow-hidden mb-6">
        <motion.h1
          className="text-4xl font-bold text-white tracking-widest"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          web<span className="text-[#0EC3BF]">kozar</span>
        </motion.h1>
      </div>
      
      {/* Načítací lišta (Progress bar) */}
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#0EC3BF] to-[#A855F7] shadow-[0_0_10px_rgba(14,195,191,0.8)]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          // Jakmile lišta dojede na 100 %, zavolá funkci pro skrytí loaderu
          onAnimationComplete={onComplete} 
        />
      </div>
    </motion.div>
  );
}