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
      {/* Modern morphing background shape */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: 'rgba(43, 155, 244, 0.05)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(43, 155, 244, 0.1)',
          zIndex: 1
        }}
        animate={{
          borderRadius: [
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '30% 60% 70% 40% / 50% 60% 30% 60%',
            '50% 60% 30% 60% / 30% 60% 70% 40%',
            '60% 40% 60% 30% / 70% 30% 60% 40%',
            '60% 40% 30% 70% / 60% 30% 70% 40%'
          ],
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.1, 0.9, 1.05, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      {/* Modern floating particles - 2025 trending */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            width: `${20 + i * 10}px`,
            height: `${20 + i * 10}px`,
            background: 'rgba(43, 155, 244, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(43, 155, 244, 0.2)',
            borderRadius: '50%',
            top: `${10 + i * 15}%`,
            left: `${5 + i * 15}%`,
            zIndex: 1
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5
          }}
        />
      ))}
      
      <motion.div
        style={{
          position: 'absolute',
          top: '30%',
          right: '-10%',
          width: '120%',
          height: '180px',
          background: 'linear-gradient(90deg, rgba(10, 10, 30, 0.08), rgba(15, 15, 40, 0.05))',
          borderRadius: '50%',
          filter: 'blur(70px)',
          opacity: 0.15,
          zIndex: 2
        }}
        animate={{
          y: ['0%', '-4%', '0%'],
        }}
        transition={{
          duration: 20,
          delay: 3,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '-5%',
          width: '110%',
          height: '150px',
          background: 'linear-gradient(90deg, rgba(15, 15, 40, 0.06), rgba(10, 36, 99, 0.08))',
          borderRadius: '50%',
          filter: 'blur(50px)',
          opacity: 0.2,
          zIndex: 2
        }}
        animate={{
          y: ['0%', '6%', '0%'],
        }}
        transition={{
          duration: 15,
          delay: 2,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
      
      {/* Blue accent waves */}
      <motion.div
        style={{
          position: 'absolute',
          top: '40%',
          left: '-10%',
          width: '120%',
          height: '200px',
          background: 'linear-gradient(90deg, rgba(10, 36, 99, 0.04), rgba(33, 150, 243, 0.06))',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.15,
          zIndex: 2
        }}
        animate={{
          y: ['0%', '3%', '0%'],
        }}
        transition={{
          duration: 22,
          delay: 1,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '-10%',
          width: '120%',
          height: '220px',
          background: 'linear-gradient(90deg, rgba(33, 150, 243, 0.06), rgba(10, 36, 99, 0.04))',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.15,
          zIndex: 2
        }}
        animate={{
          y: ['0%', '-3%', '0%'],
        }}
        transition={{
          duration: 20,
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
          background: 'linear-gradient(90deg, transparent, rgba(62, 146, 204, 0.4), transparent)',
          opacity: 0.4
        }}
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
        }}
        transition={{ 
          opacity: { duration: 8, repeat: Infinity, repeatType: 'reverse' },
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
          background: 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.4), transparent)',
          opacity: 0.4
        }}
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          backgroundPosition: ['100% 0%', '0% 0%', '100% 0%']
        }}
        transition={{ 
          opacity: { duration: 8, delay: 4, repeat: Infinity, repeatType: 'reverse' },
          backgroundPosition: { duration: 15, delay: 2, repeat: Infinity, repeatType: 'reverse' }
        }}
      />
    </div>
  );
};

export default HeroBackground;
