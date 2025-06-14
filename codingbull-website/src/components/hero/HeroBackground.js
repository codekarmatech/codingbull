import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const HeroBackground = () => {
  const shouldReduceMotion = useReducedMotion();

  // Enterprise-level animation optimization
  const optimizedAnimations = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        wave1: { y: '0%', scaleX: 1 },
        wave2: { y: '0%', scaleX: 1 },
        border1: { backgroundPosition: '0% 0%' },
        border2: { backgroundPosition: '0% 0%' }
      };
    }

    return {
      wave1: {
        y: ['0%', '4%', '0%'],
        scaleX: [1, 1.05, 1]
      },
      wave2: {
        y: ['0%', '-4%', '0%'],
        scaleX: [1, 0.95, 1]
      },
      border1: {
        backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
      },
      border2: {
        backgroundPosition: ['100% 0%', '0% 0%', '100% 0%']
      }
    };
  }, [shouldReduceMotion]);

  const optimizedTransitions = useMemo(() => ({
    wave1: {
      duration: shouldReduceMotion ? 0 : 25,
      repeat: shouldReduceMotion ? 0 : Infinity,
      repeatType: 'reverse',
      ease: 'linear' // Linear for better performance
    },
    wave2: {
      duration: shouldReduceMotion ? 0 : 30,
      delay: shouldReduceMotion ? 0 : 5,
      repeat: shouldReduceMotion ? 0 : Infinity,
      repeatType: 'reverse',
      ease: 'linear' // Linear for better performance
    },
    border1: {
      backgroundPosition: {
        duration: shouldReduceMotion ? 0 : 15,
        repeat: shouldReduceMotion ? 0 : Infinity,
        repeatType: 'reverse'
      }
    },
    border2: {
      backgroundPosition: {
        duration: shouldReduceMotion ? 0 : 15,
        delay: shouldReduceMotion ? 0 : 2,
        repeat: shouldReduceMotion ? 0 : Infinity,
        repeatType: 'reverse'
      }
    }
  }), [shouldReduceMotion]);

  return (
    <div className="gradient-background" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: 2,
      pointerEvents: 'none',
      // Enterprise performance optimizations
      contain: 'layout style paint',
      willChange: 'transform'
    }}>
      {/* Optimized wave effects */}
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
          zIndex: 2,
          // Performance optimizations
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden'
        }}
        animate={optimizedAnimations.wave1}
        transition={optimizedTransitions.wave1}
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
          zIndex: 2,
          // Performance optimizations
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden'
        }}
        animate={optimizedAnimations.wave2}
        transition={optimizedTransitions.wave2}
      />

      {/* Optimized Animated border glows */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(21, 101, 192, 0.4), transparent)',
          opacity: 0.4,
          // Performance optimizations
          willChange: 'background-position',
          transform: 'translate3d(0, 0, 0)'
        }}
        animate={optimizedAnimations.border1}
        transition={optimizedTransitions.border1}
      />

      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(21, 101, 192, 0.4), transparent)',
          opacity: 0.4,
          // Performance optimizations
          willChange: 'background-position',
          transform: 'translate3d(0, 0, 0)'
        }}
        animate={optimizedAnimations.border2}
        transition={optimizedTransitions.border2}
      />
    </div>
  );
};

export default HeroBackground;
