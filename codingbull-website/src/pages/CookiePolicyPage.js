import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { pageTransition, fadeIn, slideUp } from '../animations/variants';

// Page container
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  padding-top: 120px;
  background: ${props => props.theme.colors.deepBlue};
`;

// Content wrapper
const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
`;

// Page header
const PageHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

// Page title
const PageTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['4xl']};
  font-weight: ${props => props.theme.fontWeights.bold};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: 1rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.electricBlue}, ${props => props.theme.colors.brandLight});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// Last updated
const LastUpdated = styled(motion.p)`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.base};
  margin-bottom: 2rem;
`;

// Content section
const ContentSection = styled(motion.section)`
  background: ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 3rem;
  margin-bottom: 2rem;
  border: 1px solid ${props => props.theme.colors.borderGrey};
  box-shadow: ${props => props.theme.shadows.card};
`;

// Section title
const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: ${props => props.theme.fontWeights.semibold};
  color: ${props => props.theme.colors.electricBlue};
  margin-bottom: 1.5rem;
  border-bottom: 2px solid ${props => props.theme.colors.electricBlue};
  padding-bottom: 0.5rem;
`;

// Subsection title
const SubsectionTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.textPrimary};
  margin: 2rem 0 1rem;
`;

// Content text
const ContentText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: ${props => props.theme.lineHeights.relaxed};
  margin-bottom: 1.5rem;
  font-size: ${props => props.theme.fontSizes.base};
`;

// Content list
const ContentList = styled.ul`
  color: ${props => props.theme.colors.textSecondary};
  margin: 1rem 0 1.5rem 1.5rem;
  
  li {
    margin-bottom: 0.75rem;
    line-height: ${props => props.theme.lineHeights.relaxed};
    
    &::marker {
      color: ${props => props.theme.colors.electricBlue};
    }
  }
`;

// Cookie table
const CookieTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  background: ${props => props.theme.colors.deepGrey};
  border-radius: ${props => props.theme.borderRadius.md};
  overflow: hidden;
`;

const TableHeader = styled.th`
  background: ${props => props.theme.colors.electricBlue}20;
  color: ${props => props.theme.colors.textPrimary};
  padding: 1rem;
  text-align: left;
  font-weight: ${props => props.theme.fontWeights.semibold};
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.borderGrey};
  color: ${props => props.theme.colors.textSecondary};
  vertical-align: top;
`;

// Highlight box
const HighlightBox = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.electricBlue}15, ${props => props.theme.colors.brandLight}10);
  border: 1px solid ${props => props.theme.colors.electricBlue}30;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: 1.5rem;
  margin: 1.5rem 0;
  
  p {
    margin-bottom: 0;
    font-weight: ${props => props.theme.fontWeights.medium};
  }
`;

// Contact link
const ContactLink = styled(Link)`
  color: ${props => props.theme.colors.electricBlue};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  
  &:hover {
    text-decoration: underline;
    color: ${props => props.theme.colors.brandLight};
  }
`;

// External link
const ExternalLink = styled.a`
  color: ${props => props.theme.colors.electricBlue};
  text-decoration: none;
  font-weight: ${props => props.theme.fontWeights.medium};
  
  &:hover {
    text-decoration: underline;
    color: ${props => props.theme.colors.brandLight};
  }
`;

const CookiePolicyPage = () => {
  return (
    <>
      <SEO 
        title="Cookie Policy" 
        description="CodingBull's Cookie Policy - Learn about the cookies we use, how they work, and how you can manage your cookie preferences."
        canonical="/cookie-policy"
      />
      <PageContainer
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <ContentWrapper>
          <PageHeader variants={fadeIn}>
            <PageTitle>Cookie Policy</PageTitle>
            <LastUpdated>Last updated: January 2025</LastUpdated>
          </PageHeader>

          <ContentSection variants={slideUp}>
            <SectionTitle>1. What Are Cookies</SectionTitle>
            <ContentText>
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit our website <ExternalLink href="https://codingbullz.com" target="_blank" rel="noopener noreferrer">codingbullz.com</ExternalLink>. They help us provide you with a better browsing experience and allow us to analyze how our website is used.
            </ContentText>
            <ContentText>
              This Cookie Policy explains what cookies are, how we use them, the types of cookies we use, and how you can control your cookie preferences. This policy should be read alongside our <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/terms-of-service">Terms of Service</Link>.
            </ContentText>
            <HighlightBox>
              <ContentText>
                <strong>Your Control:</strong> You can control and manage cookies in various ways. Please note that removing or blocking cookies may impact your user experience and some functionality may not work as intended.
              </ContentText>
            </HighlightBox>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>2. How We Use Cookies</SectionTitle>
            <ContentText>CodingBull uses cookies for several important purposes:</ContentText>
            
            <SubsectionTitle>2.1 Essential Website Functionality</SubsectionTitle>
            <ContentList>
              <li><strong>Security:</strong> Protecting against cross-site request forgery and other security threats</li>
              <li><strong>Session Management:</strong> Maintaining your session state across page visits</li>
              <li><strong>Form Data:</strong> Remembering form inputs to improve user experience</li>
              <li><strong>Preferences:</strong> Storing your website preferences and settings</li>
            </ContentList>

            <SubsectionTitle>2.2 Performance and Analytics</SubsectionTitle>
            <ContentList>
              <li><strong>Custom Analytics:</strong> Our proprietary analytics system tracks website performance and user interactions</li>
              <li><strong>Error Tracking:</strong> Monitoring JavaScript errors and performance issues for debugging</li>
              <li><strong>Core Web Vitals:</strong> Measuring page load times, interactivity, and visual stability</li>
              <li><strong>User Journey:</strong> Understanding how visitors navigate through our website</li>
            </ContentList>

            <SubsectionTitle>2.3 Functionality Enhancement</SubsectionTitle>
            <ContentList>
              <li><strong>Contact Forms:</strong> Improving form submission experience and preventing spam</li>
              <li><strong>Blog Interactions:</strong> Enhancing blog reading experience and content recommendations</li>
              <li><strong>Service Inquiries:</strong> Streamlining the service inquiry and consultation process</li>
            </ContentList>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>3. Types of Cookies We Use</SectionTitle>
            
            <SubsectionTitle>3.1 Essential Cookies</SubsectionTitle>
            <ContentText>These cookies are necessary for the website to function properly and cannot be disabled:</ContentText>
            
            <CookieTable>
              <thead>
                <tr>
                  <TableHeader>Cookie Name</TableHeader>
                  <TableHeader>Purpose</TableHeader>
                  <TableHeader>Duration</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableCell>session_id</TableCell>
                  <TableCell>Maintains user session across page visits</TableCell>
                  <TableCell>Session</TableCell>
                </tr>
                <tr>
                  <TableCell>csrf_token</TableCell>
                  <TableCell>Security protection against cross-site request forgery</TableCell>
                  <TableCell>Session</TableCell>
                </tr>
                <tr>
                  <TableCell>preferences</TableCell>
                  <TableCell>Stores user preferences and settings</TableCell>
                  <TableCell>1 year</TableCell>
                </tr>
              </tbody>
            </CookieTable>

            <SubsectionTitle>3.2 Performance Cookies</SubsectionTitle>
            <ContentText>These cookies help us understand how visitors interact with our website:</ContentText>

            <CookieTable>
              <thead>
                <tr>
                  <TableHeader>Cookie Name</TableHeader>
                  <TableHeader>Purpose</TableHeader>
                  <TableHeader>Duration</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableCell>analytics_session</TableCell>
                  <TableCell>Tracks user interactions and page views for our custom analytics</TableCell>
                  <TableCell>30 minutes</TableCell>
                </tr>
                <tr>
                  <TableCell>performance_metrics</TableCell>
                  <TableCell>Collects Core Web Vitals and performance data</TableCell>
                  <TableCell>24 hours</TableCell>
                </tr>
                <tr>
                  <TableCell>error_tracking</TableCell>
                  <TableCell>Helps identify and debug JavaScript errors</TableCell>
                  <TableCell>7 days</TableCell>
                </tr>
                <tr>
                  <TableCell>user_journey</TableCell>
                  <TableCell>Tracks navigation patterns to improve user experience</TableCell>
                  <TableCell>1 hour</TableCell>
                </tr>
              </tbody>
            </CookieTable>

            <SubsectionTitle>3.3 Functional Cookies</SubsectionTitle>
            <ContentText>These cookies enhance functionality and personalization:</ContentText>

            <CookieTable>
              <thead>
                <tr>
                  <TableHeader>Cookie Name</TableHeader>
                  <TableHeader>Purpose</TableHeader>
                  <TableHeader>Duration</TableHeader>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <TableCell>contact_form_data</TableCell>
                  <TableCell>Temporarily stores contact form data to prevent loss</TableCell>
                  <TableCell>1 hour</TableCell>
                </tr>
                <tr>
                  <TableCell>blog_preferences</TableCell>
                  <TableCell>Remembers blog reading preferences and bookmarks</TableCell>
                  <TableCell>6 months</TableCell>
                </tr>
                <tr>
                  <TableCell>service_interests</TableCell>
                  <TableCell>Tracks service pages visited for personalized recommendations</TableCell>
                  <TableCell>3 months</TableCell>
                </tr>
              </tbody>
            </CookieTable>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>4. Third-Party Cookies</SectionTitle>
            <ContentText>
              Our website may also use third-party cookies from our service providers and hosting platforms:
            </ContentText>

            <SubsectionTitle>4.1 Hosting and CDN Services</SubsectionTitle>
            <ContentList>
              <li><strong>Cloudflare:</strong> Our frontend hosting provider may set cookies for security and performance optimization</li>
              <li><strong>Koyeb:</strong> Our backend hosting service may use cookies for load balancing and session management</li>
            </ContentList>

            <SubsectionTitle>4.2 Security Services</SubsectionTitle>
            <ContentList>
              <li><strong>DDoS Protection:</strong> Security cookies to protect against malicious attacks</li>
              <li><strong>Bot Detection:</strong> Cookies to identify and block automated traffic</li>
            </ContentList>

            <HighlightBox>
              <ContentText>
                <strong>Third-Party Control:</strong> We do not control third-party cookies. Please refer to the respective third-party privacy policies for more information about their cookie practices.
              </ContentText>
            </HighlightBox>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>5. Managing Your Cookie Preferences</SectionTitle>

            <SubsectionTitle>5.1 Browser Settings</SubsectionTitle>
            <ContentText>You can control cookies through your browser settings:</ContentText>
            <ContentList>
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
            </ContentList>

            <SubsectionTitle>5.2 Cookie Categories</SubsectionTitle>
            <ContentText>You can choose to accept or decline different categories of cookies:</ContentText>
            <ContentList>
              <li><strong>Essential Cookies:</strong> Cannot be disabled as they are necessary for website functionality</li>
              <li><strong>Performance Cookies:</strong> Can be disabled, but may impact our ability to improve the website</li>
              <li><strong>Functional Cookies:</strong> Can be disabled, but may reduce website functionality and personalization</li>
            </ContentList>

            <SubsectionTitle>5.3 Impact of Disabling Cookies</SubsectionTitle>
            <ContentText>Disabling certain cookies may result in:</ContentText>
            <ContentList>
              <li>Reduced website functionality and user experience</li>
              <li>Need to re-enter information on each visit</li>
              <li>Inability to use certain features like contact forms</li>
              <li>Less personalized content and recommendations</li>
            </ContentList>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>6. Updates to This Cookie Policy</SectionTitle>
            <ContentText>
              We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of any material changes by:
            </ContentText>
            <ContentList>
              <li>Updating the "Last Updated" date at the top of this policy</li>
              <li>Providing notice on our website for significant changes</li>
              <li>Sending email notifications for major policy updates (if you have provided your email)</li>
            </ContentList>
            <ContentText>
              We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.
            </ContentText>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>7. Contact Us</SectionTitle>
            <ContentText>
              If you have any questions about this Cookie Policy or our use of cookies, please contact us:
            </ContentText>

            <SubsectionTitle>CodingBull Technovations Pvt Ltd</SubsectionTitle>
            <ContentList>
              <li><strong>Email:</strong> <ExternalLink href="mailto:contact@codingbullz.com">contact@codingbullz.com</ExternalLink></li>
              <li><strong>Website:</strong> <ContactLink to="/contact">Contact Form</ContactLink></li>
              <li><strong>Subject Line:</strong> "Cookie Policy Inquiry" for faster response</li>
              <li><strong>Response Time:</strong> We respond to all cookie-related inquiries within 48 hours</li>
            </ContentList>

            <HighlightBox>
              <ContentText>
                <strong>Additional Resources:</strong> For more information about cookies in general, visit <ExternalLink href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</ExternalLink> or <ExternalLink href="https://cookiepedia.co.uk" target="_blank" rel="noopener noreferrer">cookiepedia.co.uk</ExternalLink>.
              </ContentText>
            </HighlightBox>
          </ContentSection>
        </ContentWrapper>
      </PageContainer>
    </>
  );
};

export default CookiePolicyPage;
