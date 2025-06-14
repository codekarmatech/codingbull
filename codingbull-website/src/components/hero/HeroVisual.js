import { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HeroVisualWrapper } from './HeroStyles';

// Enterprise-level performance configuration with enhanced particle density
const PERFORMANCE_CONFIG = {
  LOW_END: {
    particleCount: 110, // Increased from 80 for better visual density
    animationQuality: 'low',
    enableGlow: false, // Disabled for performance
    enableTrails: false,
    enablePulse: false,
    frameRate: 30,
    useRAF: true,
    batchSize: 12, // Adjusted for increased particle count
    updateInterval: 100 // ms between batch updates
  },
  MOBILE: {
    particleCount: 165, // Increased from 120 for enhanced mobile experience
    animationQuality: 'medium',
    enableGlow: true,
    enableTrails: false,
    enablePulse: true,
    frameRate: 45,
    useRAF: true,
    batchSize: 18, // Adjusted for increased particle count
    updateInterval: 80
  },
  DESKTOP: {
    particleCount: 275, // Increased from 200 for rich desktop experience
    animationQuality: 'high',
    enableGlow: true,
    enableTrails: false, // Disabled to prevent thermal throttling
    enablePulse: true,
    frameRate: 60,
    useRAF: true,
    batchSize: 25, // Adjusted for increased particle count
    updateInterval: 60
  }
};

// Enhanced device capability detection with high-density particle calculation for hero section
const getDeviceCapabilities = (viewport = null) => {
  // Get current viewport dimensions
  const currentViewport = viewport || {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const { width, height } = currentViewport;
  const viewportArea = width * height;

  // Device classification based on viewport
  const isMobile = width <= 768;
  const isTablet = width > 768 && width <= 1024;
  const isDesktop = width > 1024 && width <= 1440;
  const isHighEnd = width > 1440;

  // Hardware capability detection
  const isLowEnd = navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;
  const hasGPU = window.WebGLRenderingContext !== undefined;

  // Enhanced MacBook Pro detection for thermal optimization
  const isMacBook = navigator.userAgent.includes('Mac') && navigator.userAgent.includes('Intel');
  const isAppleSilicon = navigator.userAgent.includes('Mac') && !navigator.userAgent.includes('Intel');

  // Performance-optimized high-density particle calculation for visually rich hero section
  const calculateHighDensityParticleCount = () => {
    // Balanced particles per million pixels for rich visual coverage with good performance
    let particlesPerMillion;
    let baseConfig;

    if (isLowEnd) {
      particlesPerMillion = 120; // Conservative but richer than original 80
      baseConfig = { ...PERFORMANCE_CONFIG.LOW_END };
    } else if (isMobile) {
      particlesPerMillion = 180; // Rich mobile experience, reduced from 350 for performance
      baseConfig = { ...PERFORMANCE_CONFIG.MOBILE };
    } else if (isTablet) {
      particlesPerMillion = 220; // Balanced tablet experience, reduced from 450
      baseConfig = { ...PERFORMANCE_CONFIG.MOBILE };
    } else if (isHighEnd) {
      particlesPerMillion = 220; // Optimized for consistent 60 FPS on high-end displays
      baseConfig = { ...PERFORMANCE_CONFIG.DESKTOP };
    } else {
      particlesPerMillion = 200; // Optimized for consistent 60 FPS on standard desktop
      baseConfig = { ...PERFORMANCE_CONFIG.DESKTOP };
    }

    // Calculate base particle count from viewport area
    const baseParticleCount = Math.round((viewportArea / 1000000) * particlesPerMillion);

    // Performance-optimized limits for consistent 60 FPS
    const limits = {
      min: isLowEnd ? 80 : isMobile ? 100 : 120, // Conservative minimums
      max: isLowEnd ? 200 : isMobile ? 280 : isTablet ? 350 : isHighEnd ? 450 : 400 // Optimized for 60 FPS
    };

    let finalParticleCount = Math.max(limits.min, Math.min(baseParticleCount, limits.max));

    // Thermal throttling for Intel MacBooks
    if (isMacBook) {
      finalParticleCount = Math.floor(finalParticleCount * 0.85); // 15% reduction for thermal management
    }

    return {
      ...baseConfig,
      particleCount: finalParticleCount,
      // Optimize batch size for performance
      batchSize: Math.ceil(finalParticleCount / 12) // Smaller batches for better performance
    };
  };

  const dynamicConfig = calculateHighDensityParticleCount();

  return {
    ...dynamicConfig,
    isMobile,
    isTablet,
    isDesktop,
    isHighEnd,
    isLowEnd,
    hasGPU,
    isMacBook,
    isAppleSilicon,
    viewport: currentViewport,
    viewportArea,
    // Debug information for development
    debug: {
      particlesPerMillion: isLowEnd ? 120 : isMobile ? 180 : isTablet ? 220 : isHighEnd ? 220 : 200,
      calculatedBase: Math.round((viewportArea / 1000000) * (isLowEnd ? 120 : isMobile ? 180 : isTablet ? 220 : isHighEnd ? 220 : 200)),
      finalCount: dynamicConfig.particleCount,
      density: 'PERFORMANCE_OPTIMIZED_HERO'
    }
  };
};

// Enterprise-level full-screen particle generator with high-density optimization
const generateParticleField = (config) => {
  const particles = [];
  const { particleCount, viewport } = config;

  // Full-screen coverage calculation using viewport data for responsive particles
  const screenWidth = viewport?.width || window.innerWidth;
  const screenHeight = viewport?.height || window.innerHeight;
  const maxRadius = Math.max(screenWidth, screenHeight) * 0.9; // Increased to 90% for better coverage

  // Professional particle distribution for full-screen coverage
  for (let i = 0; i < particleCount; i++) {
    // Multiple distribution patterns for better coverage
    const distributionType = i % 3;
    let x, y;

    if (distributionType === 0) {
      // Fibonacci spiral for natural distribution
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const theta = i * goldenAngle;
      const radius = Math.sqrt(i / particleCount) * maxRadius;
      x = Math.cos(theta) * radius;
      y = Math.sin(theta) * radius;
    } else if (distributionType === 1) {
      // Grid-based distribution for even coverage
      const gridSize = Math.ceil(Math.sqrt(particleCount / 3));
      const gridX = (i % gridSize) - gridSize / 2;
      const gridY = Math.floor(i / gridSize) - gridSize / 2;
      x = (gridX * screenWidth) / gridSize + (Math.random() - 0.5) * 100;
      y = (gridY * screenHeight) / gridSize + (Math.random() - 0.5) * 100;
    } else {
      // Random distribution for organic feel
      x = (Math.random() - 0.5) * screenWidth * 1.2;
      y = (Math.random() - 0.5) * screenHeight * 1.2;
    }

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
      opacity: 0.8 + Math.random() * 0.2, // Enhanced visibility 0.8-1.0
      particleType,
      brightness: 0.9 + Math.random() * 0.3, // Enhanced brightness 0.9-1.2
      glowIntensity: Math.random() * 0.4 + 0.6, // Enhanced glow 0.6-1.0
      // Performance optimization flags
      lastUpdate: 0,
      updateInterval: 16 + Math.random() * 8, // Staggered updates for performance
      batchIndex: Math.floor(i / config.batchSize) // For batch processing
    });
  }

  return particles;
};

const HeroVisual = () => {
  // Enterprise-level performance optimization for high-density full-screen particles
  // Always show particles for enterprise-level experience (no prefers-reduced-motion)

  // Responsive viewport state for dynamic high-density particle calculation
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  }));

  // Enterprise-level device capability detection with high-density particle calculation
  const deviceCapabilities = useMemo(() => {
    const capabilities = getDeviceCapabilities(viewport);

    // Development logging for high-density particle system
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎯 High-Density Hero Particles: ${capabilities.particleCount} particles for ${viewport.width}×${viewport.height} (${capabilities.debug.particlesPerMillion}/M pixels - ${capabilities.debug.density})`);
    }

    return capabilities;
  }, [viewport]);

  // Professional particle field generation with high-density responsive optimization
  const particles = useMemo(() =>
    generateParticleField(deviceCapabilities),
    [deviceCapabilities]
  );

  // Enterprise-level responsive viewport handling for high-density particles
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let resizeTimeoutId;
    const RESIZE_DEBOUNCE_MS = 150; // Enterprise-level debouncing for performance

    const handleResize = () => {
      clearTimeout(resizeTimeoutId);
      resizeTimeoutId = setTimeout(() => {
        const newViewport = {
          width: window.innerWidth,
          height: window.innerHeight
        };

        // Only update if viewport actually changed significantly (avoid micro-adjustments)
        const widthDiff = Math.abs(newViewport.width - viewport.width);
        const heightDiff = Math.abs(newViewport.height - viewport.height);

        if (widthDiff > 10 || heightDiff > 10) {
          setViewport(newViewport);

          // Log viewport changes in development for debugging high-density system
          if (process.env.NODE_ENV === 'development') {
            console.log(`🔄 High-Density Viewport updated: ${newViewport.width}×${newViewport.height}`);
          }
        }
      }, RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(resizeTimeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [viewport.width, viewport.height]);

  // Use ref to store particle count to avoid useEffect dependency issues
  const particleCountRef = useRef(deviceCapabilities.particleCount);
  particleCountRef.current = deviceCapabilities.particleCount;

  // Enterprise-level performance monitoring and optimization
  useEffect(() => {
    // Always run animations for full-screen particle system
    document.body.style.setProperty('--hero-animations', 'running');

    // Optimized performance monitoring with reduced logging
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId;
    let lastLoggedFPS = 60; // Track last logged FPS to reduce spam
    let logCounter = 0; // Only log every few measurements

    const monitorPerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      // Check performance every second (1000ms)
      if (currentTime - lastTime >= 1000) {
        // Correct FPS calculation: frames per second
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        logCounter++;

        // Reduced logging: only log on performance issues or every 10 seconds for good performance
        if (process.env.NODE_ENV === 'development') {
          const fpsDifference = Math.abs(fps - lastLoggedFPS);

          if (fps < 45) {
            // Always log performance warnings
            console.warn(`🔥 Particle system FPS: ${fps} (${particleCountRef.current} particles). Consider reducing particle count for better performance.`);
            lastLoggedFPS = fps;
          } else if (fpsDifference > 10 || logCounter % 10 === 0) {
            // Log significant FPS changes or every 10 seconds
            console.log(`✅ Particle system FPS: ${fps} (${particleCountRef.current} particles) - Performance OK`);
            lastLoggedFPS = fps;
          }
        }

        // Reset counters
        frameCount = 0;
        lastTime = currentTime;
      }

      // Continue monitoring using requestAnimationFrame for accurate frame tracking
      animationId = requestAnimationFrame(monitorPerformance);
    };

    // Start performance monitoring with requestAnimationFrame
    animationId = requestAnimationFrame(monitorPerformance);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.body.style.setProperty('--hero-animations', 'running');
          } else {
            // Keep running for better UX with full-screen particles
            document.body.style.setProperty('--hero-animations', 'running');
          }
        });
      },
      { threshold: 0.01, rootMargin: '50px' }
    );

    // Observe the document body instead of a specific container for full-screen
    const heroSection = document.querySelector('section');
    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      observer.disconnect();
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Optimized particle rendering with batching - Always active for enterprise experience
  const renderParticles = useCallback(() => {
    return particles.map((particle) => {
      // Enterprise-level style optimization
      const getOptimizedParticleStyle = () => {
        const baseStyle = {
          position: 'absolute',
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          borderRadius: '50%',
          zIndex: 1,
          // GPU acceleration optimizations
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          // Performance optimizations
          contain: 'layout style paint',
          isolation: 'isolate'
        };

        // Enhanced particle types with consistent dark blue theme
        switch (particle.particleType) {
          case 'bright':
            return {
              ...baseStyle,
              background: `radial-gradient(circle, rgba(255,255,255,0.95), rgba(66,165,245,0.8))`,
              boxShadow: deviceCapabilities.enableGlow
                ? `0 0 ${particle.size * 4}px rgba(66,165,245,0.6)`
                : 'none',
            };

          case 'pulse':
            return {
              ...baseStyle,
              background: `radial-gradient(circle, rgba(255,255,255,0.9), rgba(30,136,229,0.7))`,
              boxShadow: deviceCapabilities.enableGlow
                ? `0 0 ${particle.size * 5}px rgba(30,136,229,0.5)`
                : 'none',
            };

          case 'glow':
            return {
              ...baseStyle,
              background: `radial-gradient(circle, rgba(255,255,255,0.92), rgba(42,169,245,0.8))`,
              boxShadow: deviceCapabilities.enableGlow
                ? `0 0 ${particle.size * 6}px rgba(42,169,245,0.5)`
                : 'none',
            };

          default:
            return {
              ...baseStyle,
              background: `radial-gradient(circle, rgba(255,255,255,0.85), rgba(21,101,192,0.9))`,
              boxShadow: deviceCapabilities.enableGlow
                ? `0 0 ${particle.size * 3}px rgba(21,101,192,0.5)`
                : 'none'
            };
        }
      };

      // Optimized animation properties
      const getOptimizedAnimationProps = () => {
        const baseAnimation = {
          opacity: particle.opacity,
          scale: 1
        };

        if (particle.particleType === 'pulse') {
          return {
            ...baseAnimation,
            scale: [0.8, 1.1, 0.9, 1],
            opacity: [particle.opacity * 0.6, particle.opacity, particle.opacity * 0.8, particle.opacity]
          };
        }

        return baseAnimation;
      };

      // Calculate screen-centered position using responsive viewport
      const screenCenterX = viewport.width / 2;
      const screenCenterY = viewport.height / 2;
      const finalX = screenCenterX + particle.x;
      const finalY = screenCenterY + particle.y;

      return (
        <motion.div
          key={`particle-${particle.id}`}
          initial={{
            opacity: particle.opacity * 0.3,
            x: finalX,
            y: finalY,
            scale: 0.7
          }}
          animate={{
            ...getOptimizedAnimationProps(),
            x: [
              finalX,
              finalX + Math.sin(particle.phase) * 25,
              finalX + Math.sin(particle.phase + Math.PI) * 20,
              finalX
            ],
            y: [
              finalY,
              finalY + Math.cos(particle.phase) * 20,
              finalY + Math.cos(particle.phase + Math.PI) * 15,
              finalY
            ]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear", // Linear for better performance
            times: [0, 0.33, 0.66, 1]
          }}
          style={getOptimizedParticleStyle()}
        />
      );
    });
  }, [particles, deviceCapabilities, viewport]);

  return (
    <HeroVisualWrapper>
      {/* Enterprise-level Full-Screen Particle System */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          // Enterprise-level performance optimizations
          contain: 'layout style paint',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Enterprise-level Full-Screen Particle Field */}
        {renderParticles()}

        {/* Full-Screen Ambient Energy Fields */}
        {deviceCapabilities.enableGlow &&
          Array.from({ length: 3 }, (_, index) => {
            const size = 60 + index * 40;
            const screenCenterX = viewport.width / 2;
            const screenCenterY = viewport.height / 2;
            const angle = (index * 120) * (Math.PI / 180);
            const distance = Math.min(viewport.width, viewport.height) * 0.3;
            const x = screenCenterX + Math.cos(angle) * distance;
            const y = screenCenterY + Math.sin(angle) * distance;

            return (
              <motion.div
                key={`ambient-energy-${index}`}
                initial={{ opacity: 0.1, x, y, scale: 0.8 }}
                animate={{
                  opacity: [0.1, 0.25, 0.15, 0.1],
                  x: [x, x + Math.sin(index) * 50, x - Math.cos(index) * 30, x],
                  y: [y, y - Math.cos(index) * 40, y + Math.sin(index) * 50, y],
                  scale: [0.8, 1.2, 1.0, 0.8],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 30 + index * 8,
                  repeat: Infinity,
                  delay: index * 10,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                style={{
                  position: 'absolute',
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at center,
                    rgba(66, 165, 245, 0.15) 0%,
                    rgba(21, 101, 192, 0.08) 50%,
                    transparent 100%)`,
                  filter: 'blur(15px)',
                  zIndex: 0,
                  willChange: 'transform, opacity',
                  transform: 'translate3d(0, 0, 0)',
                  mixBlendMode: 'screen'
                }}
              />
            );
          })
        }
      </motion.div>
    </HeroVisualWrapper>
  );
};

export default HeroVisual;
