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

const PrivacyPolicyPage = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy" 
        description="CodingBull's Privacy Policy - Learn how we collect, use, and protect your personal information in compliance with GDPR and international privacy laws."
        canonical="/privacy-policy"
      />
      <PageContainer
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <ContentWrapper>
          <PageHeader variants={fadeIn}>
            <PageTitle>Privacy Policy</PageTitle>
            <LastUpdated>Last updated: January 2025</LastUpdated>
          </PageHeader>

          <ContentSection variants={slideUp}>
            <SectionTitle>1. Introduction</SectionTitle>
            <ContentText>
              CodingBull Technovations Pvt Ltd ("CodingBull," "we," "us," or "our") is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <ExternalLink href="https://codingbullz.com" target="_blank" rel="noopener noreferrer">codingbullz.com</ExternalLink>, use our services, or interact with us.
            </ContentText>
            <ContentText>
              We are a technology services company registered in Ahmedabad, Gujarat, India (GSTIN: 24AAMCC7617E1ZP), providing web development, mobile applications, AI/ML solutions, and related technology services to clients worldwide.
            </ContentText>
            <HighlightBox>
              <ContentText>
                <strong>Your Privacy Rights:</strong> You have the right to know what personal information we collect, how we use it, and to request its deletion or modification. This policy complies with GDPR, CCPA, and other applicable privacy laws.
              </ContentText>
            </HighlightBox>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>2. Information We Collect</SectionTitle>
            
            <SubsectionTitle>2.1 Information You Provide Directly</SubsectionTitle>
            <ContentText>We collect information you voluntarily provide when you:</ContentText>
            <ContentList>
              <li><strong>Contact Us:</strong> Name, email address, phone number, company name, and message content through our contact forms</li>
              <li><strong>Request Services:</strong> Project details, business requirements, technical specifications, and budget information</li>
              <li><strong>Subscribe to Updates:</strong> Email address for newsletters and service updates</li>
              <li><strong>Provide Testimonials:</strong> Your name, title, company, and feedback about our services</li>
              <li><strong>Engage with Support:</strong> Communication history, technical issues, and resolution details</li>
            </ContentList>

            <SubsectionTitle>2.2 Information Collected Automatically</SubsectionTitle>
            <ContentText>Our website automatically collects certain information through our custom analytics and error tracking systems:</ContentText>
            <ContentList>
              <li><strong>Technical Information:</strong> IP address, browser type and version, operating system, device information</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, referral sources</li>
              <li><strong>Performance Metrics:</strong> Page load times, Core Web Vitals (LCP, FID, CLS), JavaScript errors</li>
              <li><strong>Session Data:</strong> Unique session identifiers, user journey tracking, interaction patterns</li>
              <li><strong>Error Logs:</strong> JavaScript errors, component failures, stack traces for debugging purposes</li>
            </ContentList>

            <SubsectionTitle>2.3 Cookies and Tracking Technologies</SubsectionTitle>
            <ContentText>We use the following types of cookies and tracking technologies:</ContentText>
            <ContentList>
              <li><strong>Essential Cookies:</strong> Required for website functionality and security</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and improve user experience</li>
              <li><strong>Analytics Cookies:</strong> Collect information about website usage and performance</li>
            </ContentList>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>3. How We Use Your Information</SectionTitle>
            <ContentText>We use the collected information for the following purposes:</ContentText>

            <SubsectionTitle>3.1 Service Delivery</SubsectionTitle>
            <ContentList>
              <li>Providing web development, mobile app development, AI/ML solutions, and other technology services</li>
              <li>Communicating about project requirements, timelines, and deliverables</li>
              <li>Managing client relationships and project workflows</li>
              <li>Delivering technical support and maintenance services</li>
            </ContentList>

            <SubsectionTitle>3.2 Website Improvement</SubsectionTitle>
            <ContentList>
              <li>Analyzing website performance and user experience</li>
              <li>Identifying and fixing technical issues and bugs</li>
              <li>Optimizing website speed, functionality, and accessibility</li>
              <li>Developing new features and improving existing ones</li>
            </ContentList>

            <SubsectionTitle>3.3 Communication</SubsectionTitle>
            <ContentList>
              <li>Responding to inquiries and providing customer support</li>
              <li>Sending project updates and service notifications</li>
              <li>Sharing relevant industry insights and company news (with consent)</li>
              <li>Marketing our services to potential clients (with consent)</li>
            </ContentList>

            <SubsectionTitle>3.4 Legal and Security</SubsectionTitle>
            <ContentList>
              <li>Complying with legal obligations and regulatory requirements</li>
              <li>Protecting against fraud, security threats, and unauthorized access</li>
              <li>Enforcing our terms of service and other agreements</li>
              <li>Resolving disputes and legal claims</li>
            </ContentList>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>4. Information Sharing and Disclosure</SectionTitle>
            <ContentText>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</ContentText>

            <SubsectionTitle>4.1 Service Providers</SubsectionTitle>
            <ContentText>We may share information with trusted third-party service providers who assist us in:</ContentText>
            <ContentList>
              <li><strong>Hosting Services:</strong> Cloudflare Pages (frontend hosting), Koyeb VPS (backend hosting)</li>
              <li><strong>Database Services:</strong> PostgreSQL database hosting and management</li>
              <li><strong>Email Services:</strong> Transactional emails and communication</li>
              <li><strong>Analytics:</strong> Website performance monitoring and error tracking</li>
            </ContentList>

            <SubsectionTitle>4.2 Legal Requirements</SubsectionTitle>
            <ContentText>We may disclose your information when required by law or to:</ContentText>
            <ContentList>
              <li>Comply with legal processes, court orders, or government requests</li>
              <li>Protect our rights, property, or safety, or that of our users</li>
              <li>Investigate potential violations of our terms of service</li>
              <li>Prevent fraud or other illegal activities</li>
            </ContentList>

            <SubsectionTitle>4.3 Business Transfers</SubsectionTitle>
            <ContentText>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity, subject to the same privacy protections outlined in this policy.
            </ContentText>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>5. Data Security</SectionTitle>
            <ContentText>We implement comprehensive security measures to protect your personal information:</ContentText>

            <SubsectionTitle>5.1 Technical Safeguards</SubsectionTitle>
            <ContentList>
              <li><strong>Encryption:</strong> All data transmission is encrypted using HTTPS/TLS protocols</li>
              <li><strong>Secure Hosting:</strong> Our infrastructure is hosted on secure, enterprise-grade platforms</li>
              <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms</li>
              <li><strong>Regular Updates:</strong> Security patches and updates are applied promptly</li>
            </ContentList>

            <SubsectionTitle>5.2 Operational Safeguards</SubsectionTitle>
            <ContentList>
              <li><strong>Employee Training:</strong> Our team is trained on data protection best practices</li>
              <li><strong>Incident Response:</strong> Procedures for detecting and responding to security incidents</li>
              <li><strong>Regular Audits:</strong> Periodic security assessments and vulnerability testing</li>
              <li><strong>Data Minimization:</strong> We collect only the information necessary for our services</li>
            </ContentList>

            <HighlightBox>
              <ContentText>
                <strong>Security Notice:</strong> While we implement robust security measures, no method of transmission over the internet is 100% secure. We continuously monitor and improve our security practices to protect your information.
              </ContentText>
            </HighlightBox>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>6. Your Privacy Rights (GDPR & CCPA Compliance)</SectionTitle>
            <ContentText>Depending on your location, you may have the following rights regarding your personal information:</ContentText>

            <SubsectionTitle>6.1 Access and Portability</SubsectionTitle>
            <ContentList>
              <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Information Request:</strong> Learn about how we process your personal information</li>
            </ContentList>

            <SubsectionTitle>6.2 Correction and Deletion</SubsectionTitle>
            <ContentList>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete personal information</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal information ("right to be forgotten")</li>
              <li><strong>Right to Restriction:</strong> Limit how we process your personal information</li>
            </ContentList>

            <SubsectionTitle>6.3 Consent and Objection</SubsectionTitle>
            <ContentList>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
              <li><strong>Object to Processing:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Opt-out of Marketing:</strong> Unsubscribe from marketing communications</li>
            </ContentList>

            <HighlightBox>
              <ContentText>
                <strong>How to Exercise Your Rights:</strong> Contact us at <ContactLink to="/contact">contact@codingbullz.com</ContactLink> to exercise any of these rights. We will respond within 30 days and may require identity verification.
              </ContentText>
            </HighlightBox>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>7. Data Retention</SectionTitle>
            <ContentText>We retain your personal information only as long as necessary for the purposes outlined in this policy:</ContentText>

            <SubsectionTitle>7.1 Retention Periods</SubsectionTitle>
            <ContentList>
              <li><strong>Contact Inquiries:</strong> 3 years from last contact or until you request deletion</li>
              <li><strong>Client Project Data:</strong> 7 years for business records and tax compliance</li>
              <li><strong>Website Analytics:</strong> 26 months for performance analysis and improvement</li>
              <li><strong>Error Logs:</strong> 12 months for debugging and system improvement</li>
              <li><strong>Marketing Data:</strong> Until you unsubscribe or request deletion</li>
            </ContentList>

            <SubsectionTitle>7.2 Deletion Process</SubsectionTitle>
            <ContentText>
              When retention periods expire or upon your request, we securely delete or anonymize your personal information. Some information may be retained longer if required by law or for legitimate business purposes.
            </ContentText>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>8. International Data Transfers</SectionTitle>
            <ContentText>
              As a company based in India serving clients worldwide, we may transfer your personal information across borders. We ensure adequate protection through:
            </ContentText>
            <ContentList>
              <li><strong>Adequacy Decisions:</strong> Transfers to countries with adequate data protection laws</li>
              <li><strong>Standard Contractual Clauses:</strong> EU-approved contracts for international transfers</li>
              <li><strong>Security Measures:</strong> Encryption and secure transmission protocols</li>
              <li><strong>Legal Compliance:</strong> Adherence to applicable international privacy laws</li>
            </ContentList>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>9. Children's Privacy</SectionTitle>
            <ContentText>
              Our services are not directed to children under 16 years of age. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete such information promptly.
            </ContentText>
            <ContentText>
              If you are a parent or guardian and believe your child has provided us with personal information, please <ContactLink to="/contact">contact us</ContactLink> immediately.
            </ContentText>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>10. Changes to This Privacy Policy</SectionTitle>
            <ContentText>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
            </ContentText>
            <ContentList>
              <li>Posting the updated policy on our website with a new "Last Updated" date</li>
              <li>Sending email notifications for significant changes (if you have provided your email)</li>
              <li>Providing prominent notice on our website for major policy changes</li>
            </ContentList>
            <ContentText>
              Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.
            </ContentText>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>11. Contact Information</SectionTitle>
            <ContentText>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </ContentText>

            <SubsectionTitle>CodingBull Technovations Pvt Ltd</SubsectionTitle>
            <ContentList>
              <li><strong>Email:</strong> <ExternalLink href="mailto:contact@codingbullz.com">contact@codingbullz.com</ExternalLink></li>
              <li><strong>Website:</strong> <ContactLink to="/contact">Contact Form</ContactLink></li>
              <li><strong>Address:</strong> Registered in Ahmedabad, Gujarat, India</li>
              <li><strong>GSTIN:</strong> 24AAMCC7617E1ZP</li>
              <li><strong>Response Time:</strong> We respond to all privacy inquiries within 24-48 hours</li>
            </ContentList>

            <HighlightBox>
              <ContentText>
                <strong>Data Protection Officer:</strong> For GDPR-related inquiries, you can reach our Data Protection Officer at <ExternalLink href="mailto:contact@codingbullz.com">contact@codingbullz.com</ExternalLink> with "GDPR Inquiry" in the subject line.
              </ContentText>
            </HighlightBox>
          </ContentSection>
        </ContentWrapper>
      </PageContainer>
    </>
  );
};

export default PrivacyPolicyPage;
