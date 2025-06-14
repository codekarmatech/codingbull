import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '../../animations/variants';
import DevelopmentCycle from './DevelopmentCycle';
import { HeroVisualWrapper } from './HeroStyles';

// Enterprise-level performance configuration with enhanced visibility
const PERFORMANCE_CONFIG = {
  LOW_END: {
    particleCount: 150,
    animationQuality: 'low',
    enableGlow: true,
    enableTrails: false,
    enablePulse: true,
    frameRate: 30
  },
  MOBILE: {
    particleCount: 250,
    animationQuality: 'medium',
    enableGlow: true,
    enableTrails: false,
    enablePulse: true,
    frameRate: 45
  },
  DESKTOP: {
    particleCount: 400,
    animationQuality: 'high',
    enableGlow: true,
    enableTrails: true,
    enablePulse: true,
    frameRate: 60
  }
};

// Professional device capability detection
const getDeviceCapabilities = () => {
  const isMobile = window.innerWidth <= 768;
  const isLowEnd = navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;
  const hasGPU = window.WebGLRenderingContext !== undefined;

  if (isLowEnd) return { ...PERFORMANCE_CONFIG.LOW_END, isMobile, isLowEnd, hasGPU };
  if (isMobile) return { ...PERFORMANCE_CONFIG.MOBILE, isMobile, isLowEnd, hasGPU };
  return { ...PERFORMANCE_CONFIG.DESKTOP, isMobile, isLowEnd, hasGPU };
};

// Enterprise-level particle generator with enhanced visibility and effects
const generateParticleField = (config) => {
  const particles = [];
  const { particleCount } = config;

  // Professional particle distribution using Fibonacci spiral for optimal coverage
  for (let i = 0; i < particleCount; i++) {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle in radians
    const theta = i * goldenAngle;
    const radius = Math.sqrt(i / particleCount) * 600; // Spiral distribution

    const x = Math.cos(theta) * radius;
    const y = Math.sin(theta) * radius;

    // Optimized size distribution - smaller particles, no flickering
    const sizeWeight = Math.random();
    const size = sizeWeight < 0.7 ? 1.5 + Math.random() * 1.5 : 2 + Math.random() * 2; // Smaller: 1.5-5px

    // Smooth animation timing - longer durations to prevent flickering
    const phase = (i / particleCount) * Math.PI * 2;
    const duration = 12 + Math.sin(phase) * 6; // 6-18 seconds for smooth, non-flickering movement
    const delay = (i / particleCount) * duration; // Perfect phase distribution

    // Particle type distribution for visual variety
    const typeRandom = Math.random();
    let particleType = 'standard';
    if (typeRandom < 0.15) particleType = 'bright'; // 15% bright particles
    else if (typeRandom < 0.25) particleType = 'pulse'; // 10% pulsing particles
    else if (typeRandom < 0.35) particleType = 'glow'; // 10% glowing particles

    particles.push({
      id: i,
      x,
      y,
      size,
      duration,
      delay,
      phase,
      opacity: 0.7 + Math.random() * 0.3, // Stable base opacity 0.7-1.0 to prevent flickering
      particleType,
      brightness: 0.8 + Math.random() * 0.4, // Brightness factor 0.8-1.2
      glowIntensity: Math.random() * 0.5 + 0.5 // Glow intensity 0.5-1.0
    });
  }

  return particles;
};

const HeroVisual = () => {
  // Enterprise-level device capability detection
  const deviceCapabilities = useMemo(() => getDeviceCapabilities(), []);

  // Professional particle field generation
  const particles = useMemo(() =>
    generateParticleField(deviceCapabilities),
    [deviceCapabilities]
  );

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
          maxWidth: '800px',
          height: '600px',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: 'perspective(1500px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible'
        }}
      >
        {/* Floating 3D elements representing development cycle */}
        <DevelopmentCycle />

        {/* Enhanced Particle System with Multiple Effect Types */}
        {particles.map((particle) => {
          // Dynamic styling based on particle type
          const getParticleStyle = () => {
            const baseStyle = {
              position: 'absolute',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: '50%',
              zIndex: 1,
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            };

            switch (particle.particleType) {
              case 'bright':
                return {
                  ...baseStyle,
                  background: `radial-gradient(circle at 20% 20%,
                    rgba(255,255,255,1),
                    rgba(66,165,245,0.9),
                    rgba(21,101,192,0.8))`,
                  boxShadow: `
                    0 0 ${particle.size * 6}px rgba(255,255,255,0.8),
                    0 0 ${particle.size * 12}px rgba(66,165,245,0.6),
                    0 0 ${particle.size * 18}px rgba(21,101,192,0.4)`,
                  filter: `brightness(${particle.brightness * 1.5})`
                };

              case 'pulse':
                return {
                  ...baseStyle,
                  background: `radial-gradient(circle at center,
                    rgba(255,255,255,0.9),
                    rgba(30,136,229,0.8),
                    rgba(13,71,161,0.6))`,
                  boxShadow: `
                    0 0 ${particle.size * 8}px rgba(30,136,229,0.7),
                    0 0 ${particle.size * 16}px rgba(30,136,229,0.4)`,
                  border: '1px solid rgba(255,255,255,0.3)'
                };

              case 'glow':
                return {
                  ...baseStyle,
                  background: `radial-gradient(circle at 40% 40%,
                    rgba(255,255,255,0.95),
                    rgba(42,169,245,0.85),
                    rgba(21,101,192,0.7))`,
                  boxShadow: `
                    0 0 ${particle.size * 10}px rgba(42,169,245,0.8),
                    0 0 ${particle.size * 20}px rgba(42,169,245,0.5),
                    inset 0 0 ${particle.size * 2}px rgba(255,255,255,0.6)`,
                  filter: `brightness(${particle.brightness}) saturate(1.2)`
                };

              default:
                return {
                  ...baseStyle,
                  background: `radial-gradient(circle at 30% 30%,
                    rgba(255,255,255,0.8),
                    rgba(21,101,192,0.9),
                    rgba(13,71,161,0.7))`,
                  boxShadow: deviceCapabilities.enableGlow
                    ? `0 0 ${particle.size * 5}px rgba(21,101,192,0.6),
                       0 0 ${particle.size * 10}px rgba(21,101,192,0.3)`
                    : 'none'
                };
            }
          };

          // Enhanced animations based on particle type
          const getAnimationProps = () => {
            const baseOpacity = particle.opacity;

            switch (particle.particleType) {
              case 'bright':
                return {
                  opacity: [baseOpacity * 0.85, baseOpacity * 1.0, baseOpacity * 0.9, baseOpacity * 0.85],
                  scale: [0.95, 1.1, 1.05, 0.95],
                  filter: [`brightness(${particle.brightness})`, `brightness(${particle.brightness * 1.3})`, `brightness(${particle.brightness * 1.1})`, `brightness(${particle.brightness})`]
                };

              case 'pulse':
                return {
                  opacity: [baseOpacity * 0.8, baseOpacity * 1.0, baseOpacity * 0.85, baseOpacity * 1.0, baseOpacity * 0.8],
                  scale: [0.9, 1.2, 0.95, 1.1, 0.9]
                };

              case 'glow':
                return {
                  opacity: [baseOpacity * 0.9, baseOpacity * 1.0, baseOpacity * 0.95, baseOpacity * 0.9],
                  scale: [0.9, 1.1, 1.0, 0.9],
                  rotate: [0, 90, 180, 270]
                };

              default:
                return {
                  opacity: [baseOpacity * 0.85, baseOpacity * 1.0, baseOpacity * 0.9, baseOpacity * 0.85],
                  scale: [0.9, 1.05, 1.0, 0.9]
                };
            }
          };

          return (
            <motion.div
              key={`particle-${particle.id}`}
              initial={{
                opacity: particle.opacity * 0.4,
                x: particle.x,
                y: particle.y,
                scale: 0.8
              }}
              animate={{
                ...getAnimationProps(),
                x: [
                  particle.x,
                  particle.x + Math.sin(particle.phase) * 25,
                  particle.x + Math.sin(particle.phase + Math.PI) * 20,
                  particle.x
                ],
                y: [
                  particle.y,
                  particle.y + Math.cos(particle.phase) * 20,
                  particle.y + Math.cos(particle.phase + Math.PI) * 15,
                  particle.y
                ]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: [0.25, 0.46, 0.45, 0.94], // Smoother easing to prevent flickering
                times: particle.particleType === 'pulse' ? [0, 0.25, 0.5, 0.75, 1] : [0, 0.33, 0.66, 1]
              }}
              style={getParticleStyle()}
            />
          );
        })}

        {/* Professional Ambient Energy Field - Anti-Flicker */}
        {deviceCapabilities.enableGlow &&
          Array.from({ length: 2 }, (_, index) => {
            const size = 40 + index * 20; // Smaller sizes
            const angle = (index * 180) * (Math.PI / 180);
            const distance = 200 + index * 60;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            return (
              <motion.div
                key={`ambient-field-${index}`}
                initial={{ opacity: 0.2, x, y, scale: 0.8 }}
                animate={{
                  opacity: [0.2, 0.35, 0.25, 0.2], // Reduced opacity range to prevent flickering
                  x: [x, x + 20, x - 15, x], // Reduced movement
                  y: [y, y - 15, y + 20, y],
                  scale: [0.8, 1.1, 0.95, 0.8], // Reduced scale range
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 25 + index * 5, // Longer duration for smoother animation
                  repeat: Infinity,
                  delay: index * 8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                style={{
                  position: 'absolute',
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at center,
                    rgba(66, 165, 245, 0.2) 0%,
                    rgba(21, 101, 192, 0.12) 50%,
                    transparent 100%)`,
                  filter: 'blur(10px)',
                  zIndex: 0,
                  willChange: 'transform, opacity',
                  transform: 'translate3d(0, 0, 0)',
                  mixBlendMode: 'screen'
                }}
              />
            );
          })
        }

        {/* Sleek Light Streaks for Enhanced Visual Appeal */}
        {deviceCapabilities.animationQuality === 'high' &&
          Array.from({ length: 4 }, (_, index) => {
            const angle = (index * 90) * (Math.PI / 180);
            const length = 200 + index * 50;
            const x = Math.cos(angle) * 300;
            const y = Math.sin(angle) * 300;

            return (
              <motion.div
                key={`light-streak-${index}`}
                initial={{ opacity: 0, x, y, scaleX: 0 }}
                animate={{
                  opacity: [0, 0.4, 0.2, 0],
                  scaleX: [0, 1, 0.8, 0],
                  scaleY: [1, 1.2, 1, 1],
                  rotate: [angle * (180/Math.PI), (angle * (180/Math.PI)) + 180]
                }}
                transition={{
                  duration: 12 + index * 2,
                  repeat: Infinity,
                  delay: index * 3,
                  ease: [0.4, 0.0, 0.2, 1]
                }}
                style={{
                  position: 'absolute',
                  width: `${length}px`,
                  height: '2px',
                  background: `linear-gradient(90deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0.8) 20%,
                    rgba(66, 165, 245, 0.9) 50%,
                    rgba(255, 255, 255, 0.8) 80%,
                    transparent 100%)`,
                  borderRadius: '1px',
                  filter: 'blur(1px)',
                  boxShadow: `0 0 8px rgba(66, 165, 245, 0.6), 0 0 16px rgba(66, 165, 245, 0.3)`,
                  zIndex: 2,
                  willChange: 'transform, opacity',
                  transform: 'translate3d(0, 0, 0)',
                  transformOrigin: 'left center'
                }}
              />
            );
          })
        }

        {/* Floating Light Orbs - Smaller & Anti-Flicker */}
        {Array.from({ length: 4 }, (_, index) => {
          const size = 4 + Math.random() * 6; // Smaller orbs: 4-10px
          const angle = (index * 90) * (Math.PI / 180);
          const distance = 350 + Math.random() * 150;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;

          return (
            <motion.div
              key={`floating-orb-${index}`}
              initial={{ opacity: 0.3, x, y, scale: 0.9 }}
              animate={{
                opacity: [0.3, 0.6, 0.45, 0.3], // Reduced opacity range
                x: [x, x + Math.sin(index) * 30, x - Math.cos(index) * 20, x], // Reduced movement
                y: [y, y - Math.cos(index) * 25, y + Math.sin(index) * 30, y],
                scale: [0.9, 1.1, 1.0, 0.9], // Reduced scale range
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 18 + index * 3, // Longer duration for smoother animation
                repeat: Infinity,
                delay: index * 4,
                ease: [0.25, 0.46, 0.45, 0.94] // Smoother easing
              }}
              style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%,
                  rgba(255, 255, 255, 0.9) 0%,
                  rgba(66, 165, 245, 0.8) 40%,
                  rgba(21, 101, 192, 0.6) 80%,
                  transparent 100%)`,
                boxShadow: `
                  0 0 ${size * 3}px rgba(255, 255, 255, 0.6),
                  0 0 ${size * 6}px rgba(66, 165, 245, 0.4)`,
                zIndex: 3,
                willChange: 'transform, opacity',
                transform: 'translate3d(0, 0, 0)',
                filter: 'brightness(1.1)'
              }}
            />
          );
        })}
      </motion.div>
    </HeroVisualWrapper>
  );
};

export default HeroVisual;
