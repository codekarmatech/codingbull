import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const DevelopmentCycle = () => {
  const shouldReduceMotion = useReducedMotion();

  // Enterprise-level animation optimization
  const optimizedAnimations = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        centralOrb: { scale: 1, opacity: 1 },
        innerContent: { scale: 1 },
        connectingSquare: { opacity: 0.7, rotate: 0 },
        ring1: { opacity: 1, rotateZ: 0 },
        ring2: { opacity: 1, rotateZ: 0 },
        glowEffect: { opacity: 0.4 },
        cycleElements: { opacity: 1, scale: 1 }
      };
    }

    return {
      centralOrb: {
        scale: [1, 1.005, 1], // Reduced from 1.01 to 1.005
        opacity: 1
      },
      innerContent: {
        scale: [1, 1.002, 1] // Reduced from 1.005 to 1.002
      },
      connectingSquare: {
        opacity: [0.7, 0.75, 0.7], // Reduced range
        rotate: [0, 360]
      },
      ring1: {
        opacity: 1,
        rotateZ: 360
      },
      ring2: {
        opacity: 1,
        rotateZ: 0
      },
      glowEffect: {
        opacity: [0.4, 0.5, 0.4] // Reduced range
      },
      cycleElements: {
        opacity: 1,
        scale: [0.99, 1.005, 0.99] // Reduced from 0.98-1.01 to 0.99-1.005
      }
    };
  }, [shouldReduceMotion]);

  const optimizedTransitions = useMemo(() => ({
    centralOrb: {
      scale: {
        duration: shouldReduceMotion ? 0 : 8, // Increased from 6 to 8
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: "linear" // Changed from easeInOut to linear
      },
      opacity: { duration: shouldReduceMotion ? 0 : 1 }
    },
    innerContent: {
      scale: {
        duration: shouldReduceMotion ? 0 : 12, // Increased from 8 to 12
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: "linear"
      }
    },
    connectingSquare: {
      opacity: {
        duration: shouldReduceMotion ? 0 : 12, // Increased from 8 to 12
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: "linear"
      },
      rotate: {
        duration: shouldReduceMotion ? 0 : 120, // Increased from 80 to 120
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: "linear"
      }
    },
    ring1: {
      opacity: { duration: shouldReduceMotion ? 0 : 1 },
      rotateZ: {
        duration: shouldReduceMotion ? 0 : 60, // Increased from 40 to 60
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: "linear"
      }
    },
    ring2: {
      opacity: { duration: shouldReduceMotion ? 0 : 1.5 },
      rotateZ: {
        duration: shouldReduceMotion ? 0 : 90, // Increased from 60 to 90
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: "linear"
      }
    },
    glowEffect: {
      opacity: {
        duration: shouldReduceMotion ? 0 : 12, // Increased from 8 to 12
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: "linear"
      }
    },
    cycleElements: {
      opacity: { duration: shouldReduceMotion ? 0 : 0.8, delay: 0.3 },
      scale: {
        duration: shouldReduceMotion ? 0 : 12, // Increased from 8 to 12
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: "linear"
      }
    }
  }), [shouldReduceMotion]);

  return (
    <motion.div
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(350px, 60vh, 600px)', // Responsive height that prevents clipping
        minHeight: '350px', // Ensure minimum space for all elements
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible', // Ensure elements aren't clipped
        padding: 'clamp(10px, 3vw, 20px)', // Responsive padding for safety margin
        // Enterprise performance optimizations
        contain: 'layout style paint',
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)'
      }}
    >
      {/* Optimized central glowing orb */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={optimizedAnimations.centralOrb}
        transition={optimizedTransitions.centralOrb}
        style={{
          position: 'absolute',
          // Responsive central orb sizing
          width: window.innerWidth < 640 ? 'clamp(100px, 20vw, 120px)' : '140px',
          height: window.innerWidth < 640 ? 'clamp(100px, 20vw, 120px)' : '140px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30%, #1E88E5, #1565C0, #0D47A1)',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontFamily: "'Poppins', 'Inter', sans-serif",
          fontWeight: 'bold',
          // Responsive font sizing for central text
          fontSize: window.innerWidth < 640 ? 'clamp(14px, 3.5vw, 16px)' : '18px',
          letterSpacing: window.innerWidth < 640 ? '0.3px' : '0.5px',
          // Simplified shadows for better performance
          boxShadow: '0 0 40px rgba(30, 136, 229, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.1)',
          border: '3px solid rgba(66, 165, 245, 0.5)',
          overflow: 'hidden',
          // Performance optimizations
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          contain: 'layout style paint'
        }}
        whileHover={{
          scale: shouldReduceMotion ? 1 : 1.02, // Reduced from 1.03 to 1.02
          transition: { duration: 0.3, ease: "linear" }
        }}
      >
        {/* Optimized inner content */}
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, rgba(30, 136, 229, 0.9), rgba(21, 101, 192, 0.95), rgba(13, 71, 161, 1))',
            padding: '10px',
            // Performance optimizations
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)'
          }}
          animate={optimizedAnimations.innerContent}
          transition={optimizedTransitions.innerContent}
        >
          <motion.span
            style={{
              fontFamily: "'Poppins', 'Inter', sans-serif",
              fontWeight: '700',
              // Responsive font sizing for CODING text
              fontSize: window.innerWidth < 640 ? 'clamp(12px, 3vw, 14px)' : '18px',
              textShadow: window.innerWidth < 640 
                ? '0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(66, 165, 245, 0.8)'
                : '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(66, 165, 245, 0.8)',
              letterSpacing: window.innerWidth < 640 ? '0.8px' : '1.2px',
              lineHeight: '1.1',
              marginBottom: window.innerWidth < 640 ? '2px' : '4px',
              color: '#FFFFFF'
            }}

          >
            CODING
          </motion.span>
          <motion.span
            style={{
              fontFamily: "'Poppins', 'Inter', sans-serif",
              fontWeight: '800',
              // Responsive font sizing for BULL text
              fontSize: window.innerWidth < 640 ? 'clamp(14px, 4vw, 18px)' : '22px',
              textShadow: window.innerWidth < 640 
                ? '0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(66, 165, 245, 0.8)'
                : '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(66, 165, 245, 0.8)',
              letterSpacing: window.innerWidth < 640 ? '1px' : '1.5px',
              color: '#FFFFFF'
            }}

          >
            BULL
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Optimized rotating square connecting structure */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={optimizedAnimations.connectingSquare}
        transition={optimizedTransitions.connectingSquare}
        style={{
          position: 'absolute',
          width: '360px',
          height: '360px',
          border: '2px solid rgba(30, 136, 229, 0.6)',
          borderRadius: '20px',
          // Simplified shadows for better performance
          boxShadow: '0 0 30px rgba(30, 136, 229, 0.3)',
          zIndex: 2,
          background: 'linear-gradient(45deg, transparent 30%, rgba(30, 136, 229, 0.05) 50%, transparent 70%)',
          // Performance optimizations
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0) rotate(45deg)',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Optimized orbital ring 1 */}
      <motion.div
        initial={{ opacity: 0, rotateZ: 0 }}
        animate={optimizedAnimations.ring1}
        transition={optimizedTransitions.ring1}
        style={{
          position: 'absolute',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          border: '3px solid rgba(30, 136, 229, 0.6)',
          // Simplified shadows for better performance
          boxShadow: '0 0 40px rgba(30, 136, 229, 0.3)',
          zIndex: 1,
          background: 'radial-gradient(circle at center, transparent 40%, rgba(30, 136, 229, 0.08) 70%, transparent 100%)',
          // Performance optimizations
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Optimized orbital ring 2 */}
      <motion.div
        initial={{ opacity: 0, rotateZ: 360 }}
        animate={optimizedAnimations.ring2}
        transition={optimizedTransitions.ring2}
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          border: '2px solid rgba(30, 136, 229, 0.4)',
          // Simplified shadows for better performance
          boxShadow: '0 0 30px rgba(30, 136, 229, 0.2)',
          zIndex: 1,
          background: 'radial-gradient(circle at center, transparent 50%, rgba(30, 136, 229, 0.05) 80%, transparent 100%)',
          // Performance optimizations
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Optimized pulsing glow effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={optimizedAnimations.glowEffect}
        transition={optimizedTransitions.glowEffect}
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(30, 136, 229, 0.2) 0%, rgba(30, 136, 229, 0.1) 40%, transparent 70%)',
          filter: 'blur(20px)',
          zIndex: 0,
          // Performance optimizations
          willChange: 'opacity',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden'
        }}
      />

      {/* Professional development cycle elements with luxury styling */}
      {[
        { text: 'BUILD', icon: '🔨', color: '#1E88E5', position: 'right' },
        { text: 'TEST', icon: '✓', color: '#42A5F5', position: 'bottom' },
        { text: 'DEPLOY', icon: '🚀', color: '#2979FF', position: 'left' },
        { text: 'INNOVATE', icon: '💡', color: '#1565C0', position: 'top' }
      ].map((item, index) => {
        const angle = (index * 90) * (Math.PI / 180);
        // Enterprise-level responsive radius calculation to prevent clipping
        const baseRadius = 180;
        const vwRadius = Math.min(window.innerWidth * 0.25, baseRadius); // 25% of viewport width, max 180px
        const safeRadius = Math.max(vwRadius, 100); // Minimum 100px radius
        const radius = window.innerWidth < 640 ? safeRadius : baseRadius;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x, y, scale: 0.7 }}
            animate={optimizedAnimations.cycleElements}
            transition={{
              opacity: {
                duration: shouldReduceMotion ? 0 : 0.8,
                delay: shouldReduceMotion ? 0 : 0.3 + (index * 0.2)
              },
              scale: {
                duration: shouldReduceMotion ? 0 : 12, // Increased from 8 to 12
                repeat: shouldReduceMotion ? 0 : Infinity,
                ease: "linear", // Changed from easeInOut to linear
                delay: shouldReduceMotion ? 0 : index * 1
              }
            }}
            whileHover={{
              scale: shouldReduceMotion ? 1 : 1.05, // Reduced from 1.08 to 1.05
              transition: { duration: 0.3, ease: "linear" }
            }}
            style={{
              position: 'absolute',
              // Enterprise-level responsive sizing to prevent clipping
              width: window.innerWidth < 640 ? 'clamp(50px, 12vw, 70px)' : '85px',
              height: window.innerWidth < 640 ? 'clamp(50px, 12vw, 70px)' : '85px',
              borderRadius: '50%',
              background: `radial-gradient(circle at 30%, ${item.color}, ${item.color}E6, ${item.color}CC)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontFamily: "'Poppins', 'Inter', sans-serif",
              fontWeight: 'bold',
              // Responsive font sizing
              fontSize: window.innerWidth < 640 ? 'clamp(9px, 2.5vw, 11px)' : '13px',
              letterSpacing: window.innerWidth < 640 ? '0.5px' : '0.8px',
              // Responsive shadows for better performance on mobile
              boxShadow: window.innerWidth < 640 
                ? `0 0 10px ${item.color}60, inset 0 0 5px rgba(255, 255, 255, 0.2)`
                : `0 0 20px ${item.color}60, inset 0 0 10px rgba(255, 255, 255, 0.2)`,
              border: window.innerWidth < 640 
                ? '1px solid rgba(255, 255, 255, 0.4)'
                : '2px solid rgba(255, 255, 255, 0.4)',
              zIndex: 5,
              cursor: 'pointer',
              padding: window.innerWidth < 640 ? '4px' : '8px',
              // Performance optimizations
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              contain: 'layout style paint'
            }}
          >
            <span style={{
              // Responsive icon sizing
              fontSize: window.innerWidth < 640 ? 'clamp(14px, 4vw, 16px)' : '20px',
              marginBottom: window.innerWidth < 640 ? '2px' : '4px',
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))'
            }}>
              {item.icon}
            </span>
            <span style={{
              textShadow: window.innerWidth < 640 
                ? '0 0 5px rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.3)'
                : '0 0 10px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0, 0, 0, 0.3)',
              fontWeight: '700',
              letterSpacing: window.innerWidth < 640 ? '0.5px' : '1px',
              // Responsive text sizing
              fontSize: window.innerWidth < 640 ? 'clamp(8px, 2vw, 10px)' : '12px'
            }}>
              {item.text}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DevelopmentCycle;
