import React from 'react';
import { motion } from 'framer-motion';

const DevelopmentCycle = () => {
  return (
    <motion.div
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* Enhanced central glowing orb with improved CODING BULL styling */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.95, 1.05, 0.95],
          opacity: 1,
          boxShadow: [
            '0 0 30px rgba(13, 71, 161, 0.5)',
            '0 0 50px rgba(13, 71, 161, 0.7)',
            '0 0 30px rgba(13, 71, 161, 0.5)'
          ]
        }}
        transition={{ 
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1 },
          boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          position: 'absolute',
          width: '100px', // Increased size
          height: '100px', // Increased size
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30%, #1565C0, #0D47A1)', // Darker blue gradient
          zIndex: 5, // Higher z-index to ensure it's on top
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '14px', // Larger font
          letterSpacing: '0.5px',
          boxShadow: '0 0 30px rgba(13, 71, 161, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.2)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          overflow: 'hidden' // Ensure content stays within the circle
        }}
        whileHover={{
          scale: 1.1,
          boxShadow: '0 0 40px rgba(13, 71, 161, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.3)',
          transition: { duration: 0.3 }
        }}
      >
        {/* Inner content with improved styling */}
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, rgba(21, 101, 192, 0.7), rgba(13, 71, 161, 0.9))',
            padding: '5px'
          }}
          animate={{
            scale: [1, 1.02, 1],
            rotateY: [0, 5, 0],
          }}
          transition={{
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <motion.span
            style={{
              fontWeight: '800',
              fontSize: '15px',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.8px',
              lineHeight: '1.2',
              marginBottom: '2px'
            }}
            animate={{ textShadow: ['0 0 8px rgba(255, 255, 255, 0.4)', '0 0 12px rgba(255, 255, 255, 0.6)', '0 0 8px rgba(255, 255, 255, 0.4)'] }}
            transition={{ textShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
          >
            CODING
          </motion.span>
          <motion.span
            style={{
              fontWeight: '900',
              fontSize: '18px',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              letterSpacing: '1px',
              background: 'linear-gradient(to bottom, #FFFFFF, #E0E0E0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            animate={{ textShadow: ['0 0 8px rgba(255, 255, 255, 0.4)', '0 0 12px rgba(255, 255, 255, 0.6)', '0 0 8px rgba(255, 255, 255, 0.4)'] }}
            transition={{ textShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
          >
            BULL
          </motion.span>
        </motion.div>
      </motion.div>
      
      {/* Enhanced orbital ring with double rings and glow effect */}
      <motion.div
        initial={{ opacity: 0, rotateZ: 0 }}
        animate={{ 
          opacity: 1, 
          rotateZ: 360,
        }}
        transition={{ 
          opacity: { duration: 1 },
          rotateZ: { duration: 25, repeat: Infinity, ease: "linear" }
        }}
        style={{
          position: 'absolute',
          width: '300px', // Slightly larger
          height: '300px', // Slightly larger
          borderRadius: '50%',
          border: '2px solid rgba(33, 150, 243, 0.4)', // Thicker and more visible border
          boxShadow: 'inset 0 0 25px rgba(33, 150, 243, 0.15), 0 0 15px rgba(33, 150, 243, 0.25)',
          zIndex: 1,
          background: 'radial-gradient(circle at center, transparent 40%, rgba(33, 150, 243, 0.05) 70%, transparent 100%)'
        }}
      />
      
      {/* Second orbital ring rotating in opposite direction */}
      <motion.div
        initial={{ opacity: 0, rotateZ: 360 }}
        animate={{ 
          opacity: 1, 
          rotateZ: 0,
        }}
        transition={{ 
          opacity: { duration: 1.5 },
          rotateZ: { duration: 30, repeat: Infinity, ease: "linear" }
        }}
        style={{
          position: 'absolute',
          width: '320px', // Larger than first ring
          height: '320px', // Larger than first ring
          borderRadius: '50%',
          border: '1px solid rgba(33, 150, 243, 0.25)', // Thinner border for contrast
          boxShadow: 'inset 0 0 20px rgba(33, 150, 243, 0.1), 0 0 12px rgba(33, 150, 243, 0.2)',
          zIndex: 1,
          background: 'radial-gradient(circle at center, transparent 50%, rgba(33, 150, 243, 0.03) 80%, transparent 100%)'
        }}
      />
      
      {/* Pulsing glow effect behind the rings */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: [0.3, 0.5, 0.3], 
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ 
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          position: 'absolute',
          width: '340px',
          height: '340px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(33, 150, 243, 0.15) 0%, transparent 70%)',
          filter: 'blur(15px)',
          zIndex: 0
        }}
      />
      
      {/* Enhanced development cycle elements with improved styling */}
      {[
        { text: 'BUILD', icon: '🔨', color: '#1E88E5' },
        { text: 'TEST', icon: '✓', color: '#42A5F5' },
        { text: 'DEPLOY', icon: '🚀', color: '#2979FF' },
        { text: 'INNOVATE', icon: '💡', color: '#1565C0' }
      ].map((item, index) => {
        const angle = (index * 90) * (Math.PI / 180);
        const radius = 150; // Slightly increased radius for better spacing
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x, y, scale: 0.7 }}
            animate={{ 
              opacity: 1, 
              x: [x, x + (x * 0.03), x], // Subtle movement
              y: [y, y + (y * 0.03), y], // Subtle movement
              scale: [0.9, 1.05, 0.9],
              boxShadow: [
                `0 0 15px rgba(33, 150, 243, 0.4)`,
                `0 0 25px rgba(33, 150, 243, 0.6)`,
                `0 0 15px rgba(33, 150, 243, 0.4)`
              ]
            }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.3 + (index * 0.2) },
              x: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
              boxShadow: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
            }}
            whileHover={{
              scale: 1.2,
              boxShadow: `0 0 30px ${item.color}`,
              transition: { duration: 0.3 }
            }}
            style={{
              position: 'absolute',
              width: '70px', // Larger circles
              height: '70px', // Larger circles
              borderRadius: '50%',
              background: `radial-gradient(circle at 30%, ${item.color}CC, ${item.color})`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '11px',
              letterSpacing: '0.5px',
              boxShadow: `0 0 15px ${item.color}99, inset 0 0 10px rgba(255, 255, 255, 0.2)`,
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              zIndex: 3,
              cursor: 'pointer',
              padding: '5px'
            }}
          >
            <span style={{ 
              fontSize: '16px', 
              marginBottom: '3px',
              filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))'
            }}>
              {item.icon}
            </span>
            <span style={{ 
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
              fontWeight: '700',
              letterSpacing: '0.8px'
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
