import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import bullLogo from '../assets/codingbulllogo.png';
import Button from './Button';

// Navigation items
const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/our-projects' },
  { name: 'Blog', path: '/blog' }
];

// Main navbar container with theme colors
const NavbarContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: ${props => props.theme.colors.glassDark};
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid ${props => props.theme.colors.glassBorder};
  z-index: ${props => props.theme.zIndex.sticky};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing[8]};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 0 ${props => props.theme.spacing[4]};
  }
`;

// Logo container - always visible
const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[3]};
  cursor: pointer;
  z-index: ${props => props.theme.zIndex.modal}; /* Ensure logo stays above mobile menu */
  margin-top: ${props => props.theme.spacing[2]}; /* Add space on top to prevent edge cutting */
`;

const LogoImage = styled(motion.img)`
  height: 80px;
  width: 80px;
  object-fit: contain;
  z-index: 1;
`;

const LogoText = styled.span`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.brandPrimary};
  font-family: ${props => props.theme.fonts.display};
`;

// Desktop navigation links
const DesktopNavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[8]};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.textPrimary};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  font-size: ${props => props.theme.fontSizes.base};
  transition: all ${props => props.theme.animations.normal};
  
  &:hover {
    color: ${props => props.theme.colors.brandPrimary};
    text-shadow: ${props => props.theme.colors.glowSubtle};
  }
`;

// Mobile menu button
const MenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  font-size: ${props => props.theme.fontSizes.xl};
  cursor: pointer;
  color: ${props => props.theme.colors.textPrimary};
  z-index: ${props => props.theme.zIndex.modal}; /* Ensure button stays above mobile menu */
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`;

// Mobile menu overlay - doesn't cover full screen
const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.colors.backdropBlur};
  backdrop-filter: blur(8px);
  z-index: ${props => props.theme.zIndex.overlay};
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

// Mobile menu container - slides from right with theme colors, doesn't cover full screen
const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px; /* Fixed width, doesn't cover full screen */
  max-width: 85vw; /* Responsive max width */
  background: ${props => props.theme.colors.deepGrey};
  border-left: 1px solid ${props => props.theme.colors.glassBorder};
  z-index: ${props => props.theme.zIndex.modal};
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.spacing[6]} ${props => props.theme.spacing[6]} ${props => props.theme.spacing[6]};
  gap: ${props => props.theme.spacing[4]};
  box-shadow: ${props => props.theme.shadows.glass};
  
  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    display: none;
  }
`;

// Close button for mobile menu
const CloseButton = styled(motion.button)`
  position: absolute;
  top: ${props => props.theme.spacing[4]};
  right: ${props => props.theme.spacing[4]};
  background: none;
  border: none;
  font-size: ${props => props.theme.fontSizes['2xl']};
  color: ${props => props.theme.colors.textPrimary};
  cursor: pointer;
  padding: ${props => props.theme.spacing[2]};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.animations.normal};
  
  &:hover {
    background: ${props => props.theme.colors.glassLight};
    color: ${props => props.theme.colors.brandPrimary};
  }
`;

// Mobile navigation links
const MobileNavLink = styled(Link)`
  color: ${props => props.theme.colors.textPrimary};
  text-decoration: none;
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: ${props => props.theme.fontWeights.medium};
  padding: ${props => props.theme.spacing[4]} ${props => props.theme.spacing[3]};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.animations.normal};
  border: 1px solid transparent;
  
  &:hover {
    color: ${props => props.theme.colors.brandPrimary};
    background: ${props => props.theme.colors.glassLight};
    border-color: ${props => props.theme.colors.glassBorder};
    transform: translateX(4px);
    box-shadow: ${props => props.theme.shadows.glowSoft};
  }
`;

// Mobile contact button
const MobileContactButton = styled(motion.div)`
  margin-top: ${props => props.theme.spacing[6]};
  
  button {
    width: 100%;
    background: ${props => props.theme.colors.gradientPrimary};
    color: ${props => props.theme.colors.textPrimary};
    border: none;
    padding: ${props => props.theme.spacing[4]};
    border-radius: ${props => props.theme.borderRadius.md};
    font-size: ${props => props.theme.fontSizes.base};
    font-weight: ${props => props.theme.fontWeights.semibold};
    cursor: pointer;
    transition: all ${props => props.theme.animations.normal};
    box-shadow: ${props => props.theme.shadows.button};
    
    &:hover {
      background: ${props => props.theme.colors.buttonHoverPrimary};
      box-shadow: ${props => props.theme.shadows.buttonHover};
      transform: translateY(-2px);
    }
  }
`;

// Animation variants
const mobileMenuVariants = {
  closed: {
    x: '100%',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const overlayVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

const linkVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  })
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <NavbarContainer
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo - Always Visible */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <LogoContainer
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogoImage 
              src={bullLogo} 
              alt="CodingBull Logo"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <LogoText>CodingBull</LogoText>
          </LogoContainer>
        </Link>

        {/* Desktop Navigation */}
        <DesktopNavLinks>
          {navItems.map((item) => (
            <NavLink key={item.name} to={item.path}>
              {item.name}
            </NavLink>
          ))}
          <Link to="/contact" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md">
              Contact Us
            </Button>
          </Link>
        </DesktopNavLinks>

        {/* Mobile Menu Button */}
        <MenuButton
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.9 }}
        >
          ☰
        </MenuButton>
      </NavbarContainer>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <MobileMenuOverlay
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={closeMobileMenu}
            />
            
            {/* Menu Panel */}
            <MobileMenu
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Close Button */}
              <CloseButton
                onClick={closeMobileMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </CloseButton>

              {/* Navigation Links */}
              {navItems.map((item, i) => (
                <MobileNavLink
                  key={item.name}
                  to={item.path}
                  onClick={closeMobileMenu}
                  as={motion.a}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={linkVariants}
                >
                  {item.name}
                </MobileNavLink>
              ))}
              
              {/* Contact Button */}
              <MobileContactButton
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/contact" style={{ textDecoration: 'none' }}>
                  <button onClick={closeMobileMenu}>
                    Contact Us
                  </button>
                </Link>
              </MobileContactButton>
            </MobileMenu>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;