import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../animations/variants';
import DevelopmentCycle from './DevelopmentCycle';
import { HeroVisualWrapper } from './HeroStyles';

const HeroVisual = () => {
  return (
    <HeroVisualWrapper>
      {/* Modern 3D development cycle display */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ 
          width: '100%',
          maxWidth: '500px',
          height: 'auto',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'perspective(1000px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Floating 3D elements representing development cycle */}
        <DevelopmentCycle />
        
        {/* Enhanced connecting lines with animated particles */}
        {[0, 1, 2, 3].map((index) => {
          const startAngle = (index * 90) * (Math.PI / 180);
          const endAngle = ((index + 1) % 4 * 90) * (Math.PI / 180);
          
          const radius = 150; // Match the radius used for the circles
          const startX = Math.cos(startAngle) * radius;
          const startY = Math.sin(startAngle) * radius;
          const endX = Math.cos(endAngle) * radius;
          const endY = Math.sin(endAngle) * radius;
          
          // Calculate the length and angle of the line
          const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
          const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
          
          // Get colors from the circles
          const colors = ['#1E88E5', '#42A5F5', '#2979FF', '#1565C0'];
          const startColor = colors[index];
          const endColor = colors[(index + 1) % 4];
          
          return (
            <React.Fragment key={`line-container-${index}`}>
              {/* Main connecting line with enhanced styling */}
              <motion.div
                key={`line-${index}`}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{ 
                  opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
                }}
                style={{
                  position: 'absolute',
                  width: `${length}px`,
                  height: '2px', // Thicker line
                  background: `linear-gradient(to right, ${startColor}80, ${endColor}80)`,
                  boxShadow: `0 0 10px ${startColor}80`,
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '0 0',
                  left: `${startX + 150}px`, // Adjusted for new radius
                  top: `${startY + 150}px`, // Adjusted for new radius
                  zIndex: 2,
                  borderRadius: '1px'
                }}
              />
              
              {/* Glowing underline effect */}
              <motion.div
                key={`glow-${index}`}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{ 
                  opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 + 0.5 }
                }}
                style={{
                  position: 'absolute',
                  width: `${length}px`,
                  height: '4px',
                  background: `linear-gradient(to right, ${startColor}30, ${endColor}30)`,
                  filter: 'blur(3px)',
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '0 0',
                  left: `${startX + 150}px`,
                  top: `${startY + 150}px`,
                  zIndex: 1
                }}
              />
              
              {/* Moving particles along the line */}
              {[...Array(3)].map((_, particleIndex) => {
                const delay = particleIndex * 1.5 + index * 0.5;
                return (
                  <motion.div
                    key={`particle-${index}-${particleIndex}`}
                    initial={{ 
                      opacity: 0,
                      left: `${startX + 150}px`,
                      top: `${startY + 150}px`
                    }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      left: [`${startX + 150}px`, `${endX + 150}px`],
                      top: [`${startY + 150}px`, `${endY + 150}px`]
                    }}
                    transition={{ 
                      opacity: { 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut", 
                        delay,
                        repeatDelay: 1
                      },
                      left: { 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut", 
                        delay,
                        repeatDelay: 1
                      },
                      top: { 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut", 
                        delay,
                        repeatDelay: 1
                      }
                    }}
                    style={{
                      position: 'absolute',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle at center, white, ${startColor})`,
                      boxShadow: `0 0 8px ${startColor}`,
                      zIndex: 3
                    }}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
        
        {/* Enhanced particle effects with varied colors and sizes */}
        {[...Array(30)].map((_, index) => { // Increased number of particles
          const size = Math.random() * 5 + 1; // Slightly larger particles
          const angle = Math.random() * 360 * (Math.PI / 180);
          const distance = Math.random() * 160 + 20; // Wider distribution
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const duration = Math.random() * 8 + 4;
          
          // Varied colors for particles
          const colors = ['#1E88E5', '#42A5F5', '#2979FF', '#1565C0', '#64B5F6', '#0D47A1'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          // Varied particle types
          const particleType = Math.random() > 0.8 ? 'star' : 'circle';
          
          return (
            <motion.div
              key={`particle-${index}`}
              initial={{ opacity: 0, x, y, scale: 0, rotate: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0],
                x: [x, x * (1 + Math.random() * 0.4)],
                y: [y, y * (1 + Math.random() * 0.4)],
                scale: [0, 1, 0],
                rotate: particleType === 'star' ? [0, 180] : 0 // Rotate stars
              }}
              transition={{ 
                duration,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: particleType === 'circle' ? '50%' : '0%',
                background: particleType === 'circle' 
                  ? `radial-gradient(circle at center, white, ${color})`
                  : `${color}`,
                boxShadow: `0 0 ${size * 2}px ${color}`,
                zIndex: 1,
                clipPath: particleType === 'star' 
                  ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' 
                  : 'none'
              }}
            />
          );
        })}
        
        {/* Additional subtle floating dots */}
        {[...Array(15)].map((_, index) => {
          const size = Math.random() * 2 + 0.5; // Very small dots
          const angle = Math.random() * 360 * (Math.PI / 180);
          const distance = Math.random() * 200 + 50; // Even wider distribution
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          const duration = Math.random() * 12 + 6;
          
          return (
            <motion.div
              key={`dot-${index}`}
              initial={{ opacity: 0, x, y, scale: 0 }}
              animate={{ 
                opacity: [0, 0.4, 0],
                x: [x, x * 1.2],
                y: [y, y * 1.2],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                background: 'rgba(33, 150, 243, 0.6)',
                boxShadow: '0 0 4px rgba(33, 150, 243, 0.4)',
                zIndex: 1
              }}
            />
          );
        })}
      </motion.div>
    </HeroVisualWrapper>
  );
};

export default HeroVisual;
