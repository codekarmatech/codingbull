import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from './Button';
import bullLogo from '../assets/codingbulllogo.png';

// Navbar container - Reduced size for a sleeker look
const NavbarContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${props => props.theme.zIndex.fixed};
  padding: 0.7rem 1.5rem; // Reduced padding
  transition: all 0.3s ease;
  background: ${props => props.$scrolled 
    ? props.theme.colors.deepGrey 
    : 'rgba(10, 25, 41, 0.8)'}; // Darker blue-black background
  backdrop-filter: ${props => props.$scrolled ? 'blur(10px)' : 'none'};
  box-shadow: ${props => props.$scrolled ? '0 4px 15px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(13, 71, 161, 0.2)' : 'none'};
`;

// Navbar content wrapper
const NavbarContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// Logo container
const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Logo text - Updated for dark blue theme
const LogoText = styled.h1`
  font-size: ${props => props.theme.fontSizes.lg}; // Slightly smaller
  font-weight: 700;
  margin: 0;
  background: ${props => props.theme.colors.gradientBlue}; // Dark blue gradient
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 5px rgba(13, 71, 161, 0.5)); // Subtle glow effect
`;

// Navigation links container - Reduced spacing
const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem; // Reduced gap between links
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

// Individual nav link - using a custom component that combines motion and Link
const NavLink = styled(({ to, children, ...props }) => (
  <motion.div {...props}>
    <Link to={to} style={{ color: 'inherit', textDecoration: 'none' }}>
      {children}
    </Link>
  </motion.div>
))`
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 500;
  font-size: ${props => props.theme.fontSizes.sm}; // Smaller font size
  position: relative;
  cursor: pointer;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -4px; // Slightly higher
    left: 0;
    width: 0;
    height: 1.5px; // Thinner line
    background: ${props => props.theme.colors.glowingBlue}; // Glowing blue
    transition: width 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 0 0 rgba(33, 150, 243, 0);
  }
  
  &:hover:after, &.active:after {
    width: 100%;
    box-shadow: 0 0 8px rgba(33, 150, 243, 0.6); // Glow effect on hover
  }
`;

// Mobile menu button
const MenuButton = styled(motion.button)`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  z-index: 100;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: block;
  }
`;

// Mobile menu container
const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background: ${props => props.theme.colors.mediumGrey};
  padding: 5rem 2rem 2rem;
  z-index: 99;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: ${props => props.theme.shadows.lg};
`;

// Mobile menu links
const MobileNavLink = styled(({ to, children, ...props }) => (
  <motion.div {...props}>
    <Link to={to} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
      {children}
    </Link>
  </motion.div>
))`
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 600;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
`;

// Mobile menu backdrop
const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 98;
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
        <LogoContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={bullLogo} alt="CodingBull Logo" style={{ height: '32px', marginRight: '8px' }} />
          <LogoText>CodingBull</LogoText>
        </LogoContainer>
        
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