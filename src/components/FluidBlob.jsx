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
      style={{ willChange: 'transform, opacity' }}
      animate={{ 
        opacity: [0.7, 1, 0.7],
        scale: [1, 1.03, 1],
        rotate: [0, 3, -3, 0]
      }}
      transition={{ 
        duration: 10,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      <div className="relative w-full h-full">
        <div 
          className="absolute inset-[-20%] rounded-full opacity-40 pointer-events-none" 
          style={{ 
            background: 'radial-gradient(circle, rgba(14,195,191,0.6) 0%, rgba(147,51,234,0.3) 40%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0EC3BF] via-purple-600 to-fuchsia-600 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-90 shadow-[inset_0_0_40px_rgba(255,255,255,0.2)]" />       
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border border-white/30" />       
        
        <div 
          className="absolute top-[10%] left-[15%] w-1/3 h-1/3 rounded-full pointer-events-none" 
        />      
      </div>
    </motion.div>
  );
}

export default FluidBlob;