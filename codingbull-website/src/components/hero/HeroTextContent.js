import React from 'react';
import { motion } from 'framer-motion';
import Button from '../Button';
import { fadeIn, slideUp } from '../../animations/variants';
import { 
  HeroTextContentWrapper, 
  Headline, 
  Subheadline, 
  ButtonGroup, 
  TrustedBy 
} from './HeroStyles';

const HeroTextContent = () => {
  return (
    <HeroTextContentWrapper>
      <Headline
        style={{
          marginBottom: "2rem", // Optimized spacing
          lineHeight: 1.3, // Improved line height for better readability
          padding: "0.5rem 0" // Added vertical padding
        }}
      >
        {/* Company name now as the main title with larger, more prominent styling */}
        <div className="main-title" style={{ marginBottom: "1.5rem" }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.5rem"
            }}
          >
            {/* Main Company Name - Clean and Readable */}
            <motion.div
              style={{
                background: "linear-gradient(135deg, #2B9BF4 0%, #0D7DD6 50%, #1565C0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
                fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)",
                fontWeight: "900",
                letterSpacing: "-1px",
                lineHeight: 0.9,
                fontFamily: "'Inter', sans-serif",
                position: "relative",
                zIndex: 10, // Ensure text is above background elements
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              CodingBull
            </motion.div>

            {/* Company Type & Legal */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap"
              }}
            >
              <span
                style={{
                  fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                  fontWeight: "600",
                  color: "rgba(255, 255, 255, 0.95)", // Increased opacity for better readability
                  letterSpacing: "0.5px",
                  fontFamily: "'Inter', sans-serif",
                  position: "relative",
                  zIndex: 10, // Ensure text is above background elements
                }}
              >
                Technovations
              </span>
              <motion.span
                style={{
                  fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
                  fontWeight: "500",
                  color: "rgba(43, 155, 244, 0.9)", // Increased opacity for better readability
                  background: "rgba(43, 155, 244, 0.12)", // Slightly more opaque background
                  padding: "0.3rem 0.8rem",
                  borderRadius: "20px",
                  border: "1px solid rgba(43, 155, 244, 0.4)", // More visible border
                  backdropFilter: "blur(10px)",
                  letterSpacing: "0.3px",
                  fontFamily: "'Inter', sans-serif",
                  position: "relative",
                  zIndex: 10, // Ensure text is above background elements
                }}
                whileHover={{
                  background: "rgba(43, 155, 244, 0.18)",
                  color: "rgba(43, 155, 244, 1)", // Full opacity on hover
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                PVT. LTD.
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Transform Ideas now as the secondary tagline with enhanced styling */}
        <motion.div 
          className="company-name"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          style={{
            display: "block", // Changed to block for better mobile layout
            borderTop: "1px solid rgba(33, 150, 243, 0.3)",
            paddingTop: "1.2rem",
            marginTop: "1.5rem", // Optimized spacing
            position: "relative"
          }}
        >
          {/* Animated gradient text with letter animation */}
          <motion.div
            style={{
              position: "relative",
              display: "inline-block",
              fontSize: "clamp(1.3rem, 2.8vw, 1.6rem)", // Optimized font size
              fontWeight: "600", // Semi-bold
              letterSpacing: "0.5px",
              lineHeight: 1.4,
              fontFamily: "'Open Sans', sans-serif" // More elegant font
            }}
          >
            {/* Split text into individual letters for animation */}
            {"Transform Ideas into Digital Products".split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.5 + index * 0.03, 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                style={{
                  display: "inline-block",
                  color: letter === " " ? "transparent" : "rgba(255, 255, 255, 0.95)",
                  textShadow: letter === " " ? "none" : "0 0 10px rgba(33, 150, 243, 0.4)",
                  marginRight: letter === " " ? "0.4em" : "0",
                  background: letter === " " ? "none" : "linear-gradient(135deg, #42A5F5 0%, #1976D2 100%)", // Lighter blue gradient
                  WebkitBackgroundClip: letter === " " ? "none" : "text",
                  WebkitTextFillColor: letter === " " ? "transparent" : "transparent",
                }}
                whileHover={{
                  y: -5,
                  scale: 1.15,
                  rotateY: 10,
                  textShadow: letter === " " ? "none" : "0 0 20px rgba(43, 155, 244, 0.6)", // Use textShadow instead of filter
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.div>
          
          {/* Animated underline */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
            style={{
              height: "2px",
              background: "linear-gradient(to right, rgba(33, 150, 243, 0.3), rgba(33, 150, 243, 0.7), rgba(33, 150, 243, 0.3))",
              marginTop: "0.5rem",
              boxShadow: "0 0 10px rgba(33, 150, 243, 0.3)"
            }}
          />
        </motion.div>
      </Headline>
      
      <Subheadline
        variants={fadeIn}
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.25rem)", // Responsive font size
          lineHeight: 1.7, // Improved line height for better readability
          color: "rgba(255, 255, 255, 0.85)", // Slightly softer white for better contrast
          marginBottom: "2.5rem", // Increased spacing
          maxWidth: "95%", // Ensure text doesn't stretch too wide
          letterSpacing: "0.3px" // Slightly improved letter spacing
        }}
      >
        We build enterprise-grade web & mobile applications that scale—powered by modern technologies and proven expertise.
      </Subheadline>
      
      <ButtonGroup
        variants={fadeIn}
        style={{ marginTop: "3rem" }} // Increased spacing
      >
        <Button 
          variant="primary" 
          size="lg" 
          onClick={() => document.getElementById('our-projects').scrollIntoView({ behavior: 'smooth' })}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              delay: 0.8, 
              duration: 0.5,
              ease: [0.175, 0.885, 0.32, 1.275]
            }
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 10px 25px rgba(106, 13, 173, 0.5)',
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          Explore Our Work
        </Button>
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              delay: 1.0, 
              duration: 0.5,
              ease: [0.175, 0.885, 0.32, 1.275]
            }
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 10px 25px rgba(0, 112, 255, 0.3)',
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
        >
          Our Services
        </Button>
      </ButtonGroup>
      
      <TrustedBy
        variants={slideUp}
      >
        <motion.p
          style={{ color: '#E0E0E0', fontSize: '0.9rem', letterSpacing: '0.5px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Registered Technology Company • MCA India • GSTIN: 24AAMCC7617E1ZP
        </motion.p>
      </TrustedBy>
    </HeroTextContentWrapper>
  );
};

export default HeroTextContent;
