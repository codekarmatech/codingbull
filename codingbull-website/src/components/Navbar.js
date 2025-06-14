import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from './Button';
import bullLogo from '../assets/codingbulllogo.png';

// Professional navbar container with glass morphism - Enterprise optimized with logo visibility fix
const NavbarContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${props => props.theme.zIndex.sticky};
  padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[6]}; /* Reduced from spacing[2] to spacing[1] */
  transition: all ${props => props.theme.animations.normal};
  height: 70px; /* Fixed height - logo will break out */
  overflow: visible; /* Critical: Allow logo to extend beyond navbar boundaries */
  /* Add extra padding-bottom to accommodate logo breakout */
  padding-bottom: 15px;
  /* Add padding-top to prevent logo clipping at the top */
  padding-top: 25px;

  /* Enterprise performance optimizations */
  contain: layout style; /* Removed paint to allow overflow visibility */
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;

  background: ${props => props.$scrolled
    ? props.theme.colors.glassDark
    : 'rgba(10, 14, 26, 0.8)'};
  backdrop-filter: ${props => props.$scrolled ? 'blur(20px) saturate(180%)' : 'blur(10px)'};
  border-bottom: ${props => props.$scrolled
    ? `1px solid ${props.theme.colors.glassBorder}`
    : 'none'};
  box-shadow: ${props => props.$scrolled
    ? props.theme.shadows.glass
    : 'none'};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: ${props => props.theme.spacing[1]} ${props => props.theme.spacing[4]}; /* Reduced padding */
    height: 60px; /* Height on mobile - logo will break out */
    overflow: visible; /* Allow logo to extend beyond navbar on mobile */
    /* Add extra padding-bottom to accommodate logo breakout */
    padding-bottom: 20px;
    /* Add padding-top to prevent logo clipping at the top on mobile */
    padding-top: 20px;
  }
`;

// Enhanced navbar content wrapper
const NavbarContent = styled.div`
  max-width: 1536px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%; /* Ensure full height usage */
`;

// Professional logo container with modern styling - Enhanced for logo visibility
const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[4]}; /* Increased gap for better separation */
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-height: 100px; /* Increased to accommodate larger logo with breakout */
  overflow: visible; /* Critical: Allow logo to break out of container */
  z-index: ${props => props.theme.zIndex.sticky}; /* Ensure container has proper layering */

  &:hover {
    background: rgba(43, 155, 244, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(43, 155, 244, 0.15);
  }
`;

// Separate container for logo image with modern hover effects - Enhanced visibility positioning
const LogoImageContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  top: 15px; /* Adjusted to prevent top clipping while maintaining breakout effect */
  z-index: ${props => props.theme.zIndex.banner}; /* Higher z-index for better visibility */
  border-radius: 50%;
  overflow: visible; /* Container can safely use overflow: visible */

  /* Ensure adequate space for logo breakout */
  min-height: 100px;
  min-width: 100px;

  &:hover {
    transform: translateY(8px); /* Maintain position on hover */
    background: radial-gradient(circle, rgba(43, 155, 244, 0.1) 0%, transparent 70%);
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    top: -3px; /* Adjusted to prevent top clipping on mobile */
    min-height: 85px;
    min-width: 85px;
  }
`;

// Separate container for logo text with modern hover effects
const LogoTextContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-1px);
  }
`;

// Enhanced logo image with modern, sleek effects - Fixed overflow warning
const LogoImage = styled.img`
  height: 90px; /* Further increased to ensure proper breakout visibility */
  width: auto;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: ${props => props.theme.zIndex.modal}; /* Maximum z-index for logo visibility */
  /* Removed overflow: visible to fix browser warning */

  /* Clean, modern glow effect */
  filter:
    drop-shadow(0 4px 12px rgba(43, 155, 244, 0.3))
    drop-shadow(0 0 8px rgba(43, 155, 244, 0.2));

  transform: translateY(0px) scale(1);

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 75px; /* Increased for better mobile visibility */
  }

  ${LogoImageContainer}:hover & {
    transform: translateY(-3px) scale(1.08);
    filter:
      drop-shadow(0 8px 20px rgba(43, 155, 244, 0.4))
      drop-shadow(0 0 15px rgba(43, 155, 244, 0.3))
      drop-shadow(0 0 25px rgba(43, 155, 244, 0.1));
  }

  /* Smooth pulse animation */
  animation: logoPulse 3s ease-in-out infinite;

  @keyframes logoPulse {
    0%, 100% {
      filter:
        drop-shadow(0 4px 12px rgba(43, 155, 244, 0.3))
        drop-shadow(0 0 8px rgba(43, 155, 244, 0.2));
    }
    50% {
      filter:
        drop-shadow(0 4px 12px rgba(43, 155, 244, 0.4))
        drop-shadow(0 0 12px rgba(43, 155, 244, 0.3));
    }
  }
`;

// Professional logo text with gradient and glow - Fixed text cutting
const LogoText = styled.h1`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  font-family: ${props => props.theme.fonts.display};
  margin: 0;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 8px rgba(0, 102, 255, 0.4));
  letter-spacing: -0.02em;
  line-height: 1.2; /* Added to prevent text cutting */
  padding: 0.1rem 0; /* Added padding to prevent clipping */
  overflow: visible; /* Ensure text is not clipped */

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes.xl};
  }

  &:hover {
    filter: drop-shadow(0 0 12px rgba(0, 102, 255, 0.6));
    transform: translateY(-1px);
    transition: all ${props => props.theme.animations.normal};
  }
`;

// Professional navigation links container
const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[8]};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

// Enhanced navigation link with professional styling
const NavLink = styled(({ to, children, ...props }) => (
  <motion.div {...props}>
    <Link to={to} style={{ color: 'inherit', textDecoration: 'none' }}>
      {children}
    </Link>
  </motion.div>
))`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.base};
  position: relative;
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.animations.normal};
  
  &:hover {
    color: ${props => props.theme.colors.textPrimary};
    background: ${props => props.theme.colors.glassLight};
    transform: translateY(-1px);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: ${props => props.theme.colors.gradientPrimary};
    border-radius: ${props => props.theme.borderRadius.full};
    transition: all ${props => props.theme.animations.normal};
    box-shadow: 0 0 0 rgba(0, 102, 255, 0);
  }
  
  &:hover:after, &.active:after {
    width: 80%;
    box-shadow: ${props => props.theme.shadows.glowSoft};
  }
`;

// Professional mobile menu button
const MenuButton = styled(motion.button)`
  background: ${props => props.theme.colors.glassLight};
  border: 1px solid ${props => props.theme.colors.glassBorder};
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSizes.xl};
  cursor: pointer;
  display: none;
  z-index: ${props => props.theme.zIndex.modal};
  padding: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.md};
  backdrop-filter: blur(10px);
  transition: all ${props => props.theme.animations.normal};
  
  &:hover {
    background: ${props => props.theme.colors.glassMedium};
    transform: scale(1.05);
    box-shadow: ${props => props.theme.shadows.glowSoft};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// Enhanced mobile menu with glass morphism
const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  background: ${props => props.theme.colors.glassDark};
  backdrop-filter: blur(20px) saturate(180%);
  border-left: 1px solid ${props => props.theme.colors.glassBorder};
  padding: ${props => props.theme.spacing[20]} ${props => props.theme.spacing[6]} ${props => props.theme.spacing[6]};
  z-index: ${props => props.theme.zIndex.overlay};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[6]};
  box-shadow: ${props => props.theme.shadows.glass};
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    width: 100%;
    padding: ${props => props.theme.spacing[20]} ${props => props.theme.spacing[4]} ${props => props.theme.spacing[4]};
  }
`;

// Enhanced mobile navigation links
const MobileNavLink = styled(({ to, children, ...props }) => (
  <motion.div {...props}>
    <Link to={to} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
      {children}
    </Link>
  </motion.div>
))`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.medium};
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.animations.normal};
  border: 1px solid transparent;
  
  &:hover {
    color: ${props => props.theme.colors.textPrimary};
    background: ${props => props.theme.colors.glassLight};
    border-color: ${props => props.theme.colors.glassBorder};
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.glowSoft};
  }
`;

// Professional backdrop with blur effect
const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.backdropBlur};
  backdrop-filter: blur(8px);
  z-index: ${props => props.theme.zIndex.modal};
`;

// Animation variants
const mobileMenuVariants = {
  closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
};

const backdropVariants = {
  closed: { opacity: 0, transition: { duration: 0.2 } },
  open: { opacity: 1, transition: { duration: 0.3 } }
};

const linkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Enterprise-level animation optimization
  const optimizedAnimations = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        navbar: { y: 0 },
        logo: { opacity: 1, y: 0 },
        logoImage: { scale: 1 },
        logoText: { y: 0 },
        navLinks: { scale: 1 },
        menuButton: { scale: 1 }
      };
    }

    return {
      navbar: { y: 0 },
      logo: { opacity: 1, y: 0 },
      logoImage: {
        scale: 1.02,
        transition: { duration: 0.3, ease: "linear" }
      },
      logoText: {
        y: -1,
        transition: { duration: 0.3, ease: "linear" }
      },
      navLinks: { scale: 1.05 },
      menuButton: { scale: 1.1 }
    };
  }, [shouldReduceMotion]);
  
  // Navigation links
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Our Projects', path: '/our-projects' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
  ];
  
  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    
    // Prevent body scrolling when menu is open
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };
  
  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  return (
    <NavbarContainer
      $scrolled={scrolled}
      initial={{ y: -100 }}
      animate={optimizedAnimations.navbar}
      transition={{
        type: shouldReduceMotion ? 'tween' : 'spring',
        stiffness: shouldReduceMotion ? 0 : 100,
        damping: shouldReduceMotion ? 0 : 20,
        duration: shouldReduceMotion ? 0.3 : undefined
      }}
    >
      <NavbarContent>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <LogoContainer
            initial={{ opacity: 0, y: -20 }}
            animate={optimizedAnimations.logo}
            transition={{
              duration: shouldReduceMotion ? 0.3 : 0.8,
              ease: shouldReduceMotion ? "linear" : [0.4, 0, 0.2, 1]
            }}
            whileHover={{ y: shouldReduceMotion ? 0 : -2 }}
            whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
          >
            <LogoImageContainer
              whileHover={shouldReduceMotion ? {} : optimizedAnimations.logoImage}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.96 }}
            >
              <LogoImage src={bullLogo} alt="CodingBull Logo" />
            </LogoImageContainer>
            <LogoTextContainer
              whileHover={shouldReduceMotion ? {} : optimizedAnimations.logoText}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            >
              <LogoText>CodingBull</LogoText>
            </LogoTextContainer>
          </LogoContainer>
        </Link>
        
        <NavLinks>
          {navItems.map((item, i) => (
            <NavLink
              key={item.name}
              to={item.path}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={linkVariants}
              whileHover={shouldReduceMotion ? {} : optimizedAnimations.navLinks}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
            >
              {item.name}
            </NavLink>
          ))}
          <Link to="/contact" style={{ textDecoration: 'none' }} onClick={() => {
            // Scroll to top when Contact Us button is clicked
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
            });
          }}>
            <Button variant="primary" size="md">Contact Us</Button>
          </Link>
        </NavLinks>
        
        <MenuButton
          onClick={toggleMobileMenu}
          whileHover={shouldReduceMotion ? {} : optimizedAnimations.menuButton}
          whileTap={{ scale: shouldReduceMotion ? 1 : 0.9 }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </MenuButton>
        
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <Backdrop
                variants={backdropVariants}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={closeMobileMenu}
              />
              <MobileMenu
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {navItems.map((item, i) => (
                  <MobileNavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => {
                      closeMobileMenu();
                      // Scroll to top when mobile menu link is clicked
                      window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                      });
                    }}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={linkVariants}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </MobileNavLink>
                ))}
                <Link to="/contact" style={{ textDecoration: 'none', width: '100%' }} onClick={() => {
                  closeMobileMenu();
                  // Scroll to top when Contact Us button is clicked
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                  });
                }}>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth 
                  >
                    Contact Us
                  </Button>
                </Link>
              </MobileMenu>
            </>
          )}
        </AnimatePresence>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;