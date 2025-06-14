import React from 'react';
import { motion } from 'framer-motion';

const HeroBackground = () => {
  return (
    <div className="gradient-background" style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden',
      zIndex: 2,
      pointerEvents: 'none'
    }}>
      {/* Gradient overlays with subtle motion */}

      {/* Removed redundant particles - now handled by optimized HeroVisual particle system */}
      
      {/* Simplified wave effects - reduced from 4 to 2 for better performance */}
      <motion.div
        style={{
          position: 'absolute',
          top: '25%',
          left: '-10%',
          width: '120%',
          height: '200px',
          background: 'linear-gradient(90deg, rgba(43, 155, 244, 0.04), rgba(43, 155, 244, 0.06), rgba(43, 155, 244, 0.04))',
          borderRadius: '50%',
          filter: 'blur(60px)',
          opacity: 0.15,
          zIndex: 2
        }}
        animate={{
          y: ['0%', '4%', '0%'],
          scaleX: [1, 1.05, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />

      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '-10%',
          width: '120%',
          height: '180px',
          background: 'linear-gradient(90deg, rgba(43, 155, 244, 0.03), rgba(43, 155, 244, 0.05), rgba(43, 155, 244, 0.03))',
          borderRadius: '50%',
          filter: 'blur(70px)',
          opacity: 0.12,
          zIndex: 2
        }}
        animate={{
          y: ['0%', '-4%', '0%'],
          scaleX: [1, 0.95, 1]
        }}
        transition={{
          duration: 30,
          delay: 5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
      
      {/* Animated border glows */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(21, 101, 192, 0.4), transparent)',
          opacity: 0.4
        }}
        animate={{
          /* Removed opacity animation to prevent color changing */
          backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
        }}
        transition={{
          backgroundPosition: { duration: 15, repeat: Infinity, repeatType: 'reverse' }
        }}
      />
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(21, 101, 192, 0.4), transparent)',
          opacity: 0.4
        }}
        animate={{
          /* Removed opacity animation to prevent color changing */
          backgroundPosition: ['100% 0%', '0% 0%', '100% 0%']
        }}
        transition={{
          backgroundPosition: { duration: 15, delay: 2, repeat: Infinity, repeatType: 'reverse' }
        }}
      />
    </div>
  );
};

export default HeroBackground;
