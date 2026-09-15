'use client';
import { motion } from 'framer-motion';

export default function SplashLoader({ onComplete }: { onComplete: () => void }) {
  const word = "КОНДРАТОВО";
  const letters = word.split("");

  return (
    <motion.div 
      className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50"
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 0.5 }}
      onAnimationComplete={onComplete}
    >
      <motion.div 
        className="flex space-x-2 md:space-x-4 text-4xl md:text-7xl font-black text-white font-mono"
        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
        initial="initial"
        animate="animate"
      >
        {letters.map((char, i) => (
          <motion.span
            key={i}
            variants={{
              initial: { opacity: 0, y: 40, scale: 0.5 },
              animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' } }
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: 240 }}
        transition={{ delay: 0.4, duration: 1.5 }}
        className="h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mt-6 rounded-full"
      />
    </motion.div>
  );
}
