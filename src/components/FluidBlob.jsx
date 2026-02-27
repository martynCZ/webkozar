import { motion } from 'motion/react';

function FluidBlob({ className = '', size = 'lg', delay = 0 }) {
  const sizeClasses = {
    sm: 'w-40 h-40',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[32rem] h-[32rem]'
  };

  return (
     <motion.div
      className={`${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.8, 1, 0.8],
        scale: [1, 1.05, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0EC3BF] via-purple-500 to-fuchsia-500 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl opacity-60" />
        
        {/* 2. TĚLO BLOBU - Tohle chybělo! Plná barva, aby to nebyla černá díra */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0EC3BF] via-purple-600 to-fuchsia-600 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-90" />
        
        {/* 3. SKLENĚNÁ TEXTURA - Dodá tomu lesk a pevný okraj */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-transparent rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border border-white/40" />
        
        {/* 4. ODLESK - Zvýrazní 3D efekt koule */}
        <div className="absolute top-[15%] left-[15%] w-1/3 h-1/3 bg-white rounded-full blur-2xl opacity-60 pointer-events-none" />      
        
      </div>
    </motion.div>
  )
}

export default FluidBlob;