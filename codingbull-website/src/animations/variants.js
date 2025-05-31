// Animation variants for Framer Motion

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

// Slide in from bottom
export const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15 
    }
  }
};

// Slide in from left
export const slideInLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15 
    }
  }
};

// Slide in from right
export const slideInRight = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15 
    }
  }
};

// Scale up animation
export const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15 
    }
  }
};

// Staggered children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Hover animation for buttons and interactive elements
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

// Pulse animation for attention-grabbing elements
export const pulse = {
  scale: [1, 1.05, 1],
  transition: { 
    duration: 1.5, 
    repeat: Infinity,
    repeatType: "reverse" 
  }
};

// Text reveal animation
export const textReveal = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Path drawing animation for SVGs
export const drawPath = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, ease: "easeInOut" },
      opacity: { duration: 0.3 }
    }
  }
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// Rotate animation
export const rotate = {
  hidden: { rotate: -90, opacity: 0 },
  visible: { 
    rotate: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 20 
    }
  }
};

// Bounce animation
export const bounce = {
  hidden: { y: -50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 10 
    }
  }
};

// 3D float animation
export const float3D = {
  hidden: { 
    opacity: 0,
    rotateX: 15,
    rotateY: -15,
    z: -100
  },
  visible: { 
    opacity: 1,
    rotateX: 0,
    rotateY: 0,
    z: 0,
    transition: { 
      type: "spring", 
      stiffness: 50, 
      damping: 15,
      duration: 0.8
    }
  }
};

// Glitch effect animation
export const glitch = {
  hidden: { 
    opacity: 0,
    skewX: 0,
    x: 0
  },
  visible: {
    opacity: 1,
    skewX: [0, -5, 3, 0, 2, -1, 0],
    x: [0, -5, 3, 0, 5, -2, 0],
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Enhanced shooting star animation with smoother motion at 45-degree angle
export const shootingStar = {
  hidden: { 
    x: '-5%',
    y: '-5%',
    opacity: 0,
    scale: 0.8
  },
  visible: {
    x: '105%',
    y: '105%',
    opacity: [0, 0.2, 0.8, 1, 0.8, 0.2, 0],
    scale: [0.8, 1, 1.2, 1.2, 1, 0.8],
    transition: {
      duration: 3.5, // Longer duration for smoother flow
      ease: [0.2, 0.4, 0.2, 1], // Custom cubic-bezier for ultra-smooth motion
      times: [0, 0.05, 0.2, 0.5, 0.8, 0.95, 1],
      repeat: Infinity,
      repeatDelay: 0.5 // Short delay for continuous flow
    }
  }
};