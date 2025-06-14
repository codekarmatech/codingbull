import React from 'react';
import { motion } from 'framer-motion';

const DevelopmentCycle = () => {
  return (
    <motion.div
      style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* Enhanced central glowing orb with professional CODING BULL styling */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [1, 1.01, 1],
          opacity: 1
        }}
        transition={{
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1 }
        }}
        style={{
          position: 'absolute',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30%, #1E88E5, #1565C0, #0D47A1)',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontFamily: "'Poppins', 'Inter', sans-serif",
          fontWeight: 'bold',
          fontSize: '18px',
          letterSpacing: '0.5px',
          boxShadow: '0 0 60px rgba(30, 136, 229, 0.8), 0 0 120px rgba(30, 136, 229, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.1)',
          border: '3px solid rgba(66, 165, 245, 0.5)',
          overflow: 'hidden',
          willChange: 'transform'
        }}
        whileHover={{
          scale: 1.03,
          transition: { duration: 0.2 }
        }}
      >
        {/* Inner content with professional styling */}
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
            padding: '10px'
          }}
          animate={{
            scale: [1, 1.005, 1]
          }}
          transition={{
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <motion.span
            style={{
              fontFamily: "'Poppins', 'Inter', sans-serif",
              fontWeight: '700',
              fontSize: '18px',
              textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(66, 165, 245, 0.8)',
              letterSpacing: '1.2px',
              lineHeight: '1.1',
              marginBottom: '4px',
              color: '#FFFFFF'
            }}

          >
            CODING
          </motion.span>
          <motion.span
            style={{
              fontFamily: "'Poppins', 'Inter', sans-serif",
              fontWeight: '800',
              fontSize: '22px',
              textShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 40px rgba(66, 165, 245, 0.8)',
              letterSpacing: '1.5px',
              color: '#FFFFFF'
            }}

          >
            BULL
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Professional rotating square connecting structure */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.7, 0.8, 0.7],
          rotate: [0, 360]
        }}
        transition={{
          opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 80, repeat: Infinity, ease: "linear" }
        }}
        style={{
          position: 'absolute',
          width: '360px',
          height: '360px',
          transform: 'rotate(45deg)',
          border: '2px solid rgba(30, 136, 229, 0.6)',
          borderRadius: '20px',
          boxShadow: '0 0 40px rgba(30, 136, 229, 0.4), inset 0 0 40px rgba(30, 136, 229, 0.1)',
          zIndex: 2,
          background: 'linear-gradient(45deg, transparent 30%, rgba(30, 136, 229, 0.05) 50%, transparent 70%)',
          willChange: 'transform'
        }}
      />

      {/* Enhanced orbital ring with professional glow */}
      <motion.div
        initial={{ opacity: 0, rotateZ: 0 }}
        animate={{
          opacity: 1,
          rotateZ: 360,
        }}
        transition={{
          opacity: { duration: 1 },
          rotateZ: { duration: 40, repeat: Infinity, ease: "linear" }
        }}
        style={{
          position: 'absolute',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          border: '3px solid rgba(30, 136, 229, 0.6)',
          boxShadow: 'inset 0 0 40px rgba(30, 136, 229, 0.2), 0 0 60px rgba(30, 136, 229, 0.4)',
          zIndex: 1,
          background: 'radial-gradient(circle at center, transparent 40%, rgba(30, 136, 229, 0.08) 70%, transparent 100%)'
        }}
      />

      {/* Second orbital ring with enhanced glow */}
      <motion.div
        initial={{ opacity: 0, rotateZ: 360 }}
        animate={{
          opacity: 1,
          rotateZ: 0,
        }}
        transition={{
          opacity: { duration: 1.5 },
          rotateZ: { duration: 60, repeat: Infinity, ease: "linear" }
        }}
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          border: '2px solid rgba(30, 136, 229, 0.4)',
          boxShadow: 'inset 0 0 30px rgba(30, 136, 229, 0.15), 0 0 40px rgba(30, 136, 229, 0.3)',
          zIndex: 1,
          background: 'radial-gradient(circle at center, transparent 50%, rgba(30, 136, 229, 0.05) 80%, transparent 100%)'
        }}
      />

      {/* Enhanced pulsing glow effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: [0.4, 0.6, 0.4]
        }}
        transition={{
          opacity: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(30, 136, 229, 0.2) 0%, rgba(30, 136, 229, 0.1) 40%, transparent 70%)',
          filter: 'blur(20px)',
          zIndex: 0
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
        const radius = 180; // Increased radius for better spacing
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x, y, scale: 0.7 }}
            animate={{
              opacity: 1,
              scale: [0.98, 1.01, 0.98]
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.3 + (index * 0.2) },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: index * 1 }
            }}
            whileHover={{
              scale: 1.08,
              transition: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              width: '85px',
              height: '85px',
              borderRadius: '50%',
              background: `radial-gradient(circle at 30%, ${item.color}, ${item.color}E6, ${item.color}CC)`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontFamily: "'Poppins', 'Inter', sans-serif",
              fontWeight: 'bold',
              fontSize: '13px',
              letterSpacing: '0.8px',
              boxShadow: `0 0 30px ${item.color}80, 0 0 60px ${item.color}40, inset 0 0 15px rgba(255, 255, 255, 0.2)`,
              border: '2px solid rgba(255, 255, 255, 0.4)',
              zIndex: 5,
              cursor: 'pointer',
              padding: '8px'
            }}
          >
            <span style={{
              fontSize: '20px',
              marginBottom: '4px',
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))'
            }}>
              {item.icon}
            </span>
            <span style={{
              textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0, 0, 0, 0.3)',
              fontWeight: '700',
              letterSpacing: '1px',
              fontSize: '12px'
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
