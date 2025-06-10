import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from './Button';
import bullLogo from '../assets/codingbulllogo.png';

// Professional navbar container with glass morphism
const NavbarContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${props => props.theme.zIndex.sticky};
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[6]};
  transition: all ${props => props.theme.animations.normal};
  
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
    padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
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
`;

// Professional logo container with enhanced styling
const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: all ${props => props.theme.animations.normal};
  
  &:hover {
    background: ${props => props.theme.colors.glassLight};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.glowSoft};
  }
`;

// Enhanced logo image styling
const LogoImage = styled.img`
  height: 48px;
  width: auto;
  transition: all ${props => props.theme.animations.normal};
  filter: drop-shadow(0 0 8px rgba(0, 102, 255, 0.3));
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    height: 40px;
  }
  
  ${LogoContainer}:hover & {
    transform: scale(1.05);
    filter: drop-shadow(0 0 12px rgba(0, 102, 255, 0.5));
  }
`;

// Professional logo text with gradient and glow
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
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes.xl};
  }
  
  ${LogoContainer}:hover & {
    filter: drop-shadow(0 0 12px rgba(0, 102, 255, 0.6));
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
  
  // Navigation links
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Our Projects', path: '/our-projects' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
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
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <NavbarContent>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <LogoContainer
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogoImage src={bullLogo} alt="CodingBull Logo" />
            <LogoText>CodingBull</LogoText>
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.name}
            </NavLink>
          ))}
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md">Contact Us</Button>
          </Link>
        </NavLinks>
        
        <MenuButton
          onClick={toggleMobileMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
                    onClick={closeMobileMenu}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={linkVariants}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </MobileNavLink>
                ))}
                <Link to="/contact" style={{ textDecoration: 'none', width: '100%' }} onClick={closeMobileMenu}>
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