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

const TermsOfServicePage = () => {
  return (
    <>
      <SEO 
        title="Terms of Service" 
        description="CodingBull's Terms of Service - Understand the terms and conditions for using our web development, mobile app, AI/ML, and technology services."
        canonical="/terms-of-service"
      />
      <PageContainer
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <ContentWrapper>
          <PageHeader variants={fadeIn}>
            <PageTitle>Terms of Service</PageTitle>
            <LastUpdated>Last updated: January 2025</LastUpdated>
          </PageHeader>

          <ContentSection variants={slideUp}>
            <SectionTitle>1. Agreement to Terms</SectionTitle>
            <ContentText>
              These Terms of Service ("Terms") constitute a legally binding agreement between you and CodingBull Technovations Pvt Ltd ("CodingBull," "we," "us," or "our"), a company registered in Ahmedabad, Gujarat, India (GSTIN: 24AAMCC7617E1ZP).
            </ContentText>
            <ContentText>
              By accessing our website <ExternalLink href="https://codingbullz.com" target="_blank" rel="noopener noreferrer">codingbullz.com</ExternalLink>, using our services, or engaging with us for technology solutions, you agree to be bound by these Terms and our <Link to="/privacy-policy">Privacy Policy</Link>.
            </ContentText>
            <HighlightBox>
              <ContentText>
                <strong>Important:</strong> If you do not agree to these Terms, please do not use our website or services. Your continued use constitutes acceptance of any updates to these Terms.
              </ContentText>
            </HighlightBox>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>2. Our Services</SectionTitle>
            <ContentText>CodingBull provides comprehensive technology services including:</ContentText>
            
            <SubsectionTitle>2.1 Development Services</SubsectionTitle>
            <ContentList>
              <li><strong>Full-Stack Web Development:</strong> Custom web applications using React, Django, Node.js, and modern frameworks</li>
              <li><strong>Mobile App Development:</strong> Native iOS/Android apps and cross-platform solutions using React Native and Flutter</li>
              <li><strong>Backend & API Development:</strong> Scalable server-side solutions, RESTful and GraphQL APIs</li>
              <li><strong>3D & Visualization:</strong> Interactive 3D experiences using Three.js, WebGL, and React Three Fiber</li>
            </ContentList>

            <SubsectionTitle>2.2 Specialized Services</SubsectionTitle>
            <ContentList>
              <li><strong>AI & Machine Learning:</strong> Predictive analytics, natural language processing, computer vision solutions</li>
              <li><strong>DevOps & Cloud Solutions:</strong> Containerization, CI/CD pipelines, AWS/Azure/Google Cloud deployment</li>
              <li><strong>UI/UX Design:</strong> User-centered design services for digital experiences</li>
              <li><strong>Enterprise Platforms:</strong> Custom business solutions, healthcare platforms, attendance systems</li>
            </ContentList>

            <SubsectionTitle>2.3 Support Services</SubsectionTitle>
            <ContentList>
              <li><strong>Technical Consulting:</strong> Architecture planning and technology guidance</li>
              <li><strong>Quality Assurance:</strong> Comprehensive testing and quality assurance services</li>
              <li><strong>Maintenance & Support:</strong> Ongoing application support and performance optimization</li>
              <li><strong>Performance Optimization:</strong> Application speed and efficiency improvements</li>
            </ContentList>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>3. Service Agreements and Scope</SectionTitle>
            
            <SubsectionTitle>3.1 Project Engagement</SubsectionTitle>
            <ContentText>
              Each project engagement will be governed by a separate Statement of Work (SOW) or Service Agreement that outlines specific deliverables, timelines, costs, and technical requirements. These project-specific agreements supplement but do not replace these Terms.
            </ContentText>

            <SubsectionTitle>3.2 Scope Changes</SubsectionTitle>
            <ContentText>
              Any changes to the agreed project scope must be documented in writing and may result in adjusted timelines and costs. We will provide estimates for scope changes before implementation.
            </ContentText>

            <SubsectionTitle>3.3 Client Responsibilities</SubsectionTitle>
            <ContentList>
              <li>Provide accurate project requirements and necessary materials</li>
              <li>Respond to requests for feedback and approvals in a timely manner</li>
              <li>Ensure you have rights to any content or materials provided to us</li>
              <li>Maintain confidentiality of any sensitive information shared during the project</li>
            </ContentList>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>4. Intellectual Property Rights</SectionTitle>

            <SubsectionTitle>4.1 Our Intellectual Property</SubsectionTitle>
            <ContentText>
              All content on our website, including but not limited to text, graphics, logos, images, software, and design elements, is the property of CodingBull or our licensors and is protected by copyright, trademark, and other intellectual property laws.
            </ContentText>

            <SubsectionTitle>4.2 Client-Owned Content</SubsectionTitle>
            <ContentText>
              You retain ownership of any content, data, or materials you provide to us. By engaging our services, you grant us a limited license to use your content solely for the purpose of delivering the agreed services.
            </ContentText>

            <SubsectionTitle>4.3 Work Product Ownership</SubsectionTitle>
            <ContentList>
              <li><strong>Custom Development:</strong> Upon full payment, you own the custom code and applications we develop specifically for your project</li>
              <li><strong>Third-Party Components:</strong> Open-source libraries and third-party components remain subject to their respective licenses</li>
              <li><strong>CodingBull Tools:</strong> We retain ownership of our proprietary tools, frameworks, and methodologies</li>
              <li><strong>Documentation:</strong> Technical documentation and user guides become your property upon project completion</li>
            </ContentList>

            <SubsectionTitle>4.4 Portfolio Rights</SubsectionTitle>
            <ContentText>
              Unless otherwise agreed in writing, we reserve the right to showcase completed projects in our portfolio, case studies, and marketing materials, while respecting any confidentiality requirements.
            </ContentText>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>5. Payment Terms and Pricing</SectionTitle>

            <SubsectionTitle>5.1 Pricing Structure</SubsectionTitle>
            <ContentText>
              Our pricing is based on project scope, complexity, timeline, and resource requirements. All prices are quoted in USD or INR as specified in the project agreement.
            </ContentText>

            <SubsectionTitle>5.2 Payment Schedule</SubsectionTitle>
            <ContentList>
              <li><strong>Project Deposit:</strong> 25-50% upfront payment required to commence work</li>
              <li><strong>Milestone Payments:</strong> Payments tied to specific project milestones as outlined in the SOW</li>
              <li><strong>Final Payment:</strong> Remaining balance due upon project completion and delivery</li>
              <li><strong>Ongoing Services:</strong> Monthly or quarterly billing for maintenance and support services</li>
            </ContentList>

            <SubsectionTitle>5.3 Late Payments</SubsectionTitle>
            <ContentText>
              Invoices are due within 30 days of issuance. Late payments may incur a 1.5% monthly service charge and may result in suspension of services until payment is received.
            </ContentText>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>6. Warranties and Disclaimers</SectionTitle>

            <SubsectionTitle>6.1 Service Warranties</SubsectionTitle>
            <ContentList>
              <li>We warrant that our services will be performed with professional skill and care</li>
              <li>We guarantee that delivered software will substantially conform to agreed specifications</li>
              <li>We provide a 90-day warranty period for bug fixes on custom development work</li>
              <li>We warrant that we have the right to provide the services outlined in our agreements</li>
            </ContentList>

            <SubsectionTitle>6.2 Disclaimers</SubsectionTitle>
            <ContentText>
              EXCEPT AS EXPRESSLY STATED, OUR SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </ContentText>

            <HighlightBox>
              <ContentText>
                <strong>Third-Party Services:</strong> We disclaim any warranties for third-party services, APIs, or platforms integrated into your project. These are subject to their respective terms and conditions.
              </ContentText>
            </HighlightBox>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>7. Limitation of Liability</SectionTitle>
            <ContentText>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CODINGBULL'S TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATED TO OUR SERVICES SHALL NOT EXCEED THE TOTAL AMOUNT PAID BY YOU FOR THE SPECIFIC SERVICE GIVING RISE TO THE CLAIM.
            </ContentText>

            <SubsectionTitle>7.1 Excluded Damages</SubsectionTitle>
            <ContentText>
              IN NO EVENT SHALL CODINGBULL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </ContentText>
            <ContentList>
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Loss of data or information</li>
              <li>Business interruption or downtime</li>
              <li>Cost of substitute services or products</li>
            </ContentList>

            <SubsectionTitle>7.2 Force Majeure</SubsectionTitle>
            <ContentText>
              We shall not be liable for any delay or failure to perform due to circumstances beyond our reasonable control, including but not limited to natural disasters, government actions, pandemics, or internet service disruptions.
            </ContentText>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>8. Confidentiality</SectionTitle>
            <ContentText>
              Both parties acknowledge that they may have access to confidential information during the course of our business relationship.
            </ContentText>

            <SubsectionTitle>8.1 Confidential Information</SubsectionTitle>
            <ContentList>
              <li>Business strategies, financial information, and proprietary processes</li>
              <li>Technical specifications, source code, and development methodologies</li>
              <li>Customer data, user information, and business relationships</li>
              <li>Any information marked as confidential or that would reasonably be considered confidential</li>
            </ContentList>

            <SubsectionTitle>8.2 Confidentiality Obligations</SubsectionTitle>
            <ContentText>
              We agree to maintain the confidentiality of your information and use it solely for the purpose of providing our services. This obligation survives termination of our agreement for a period of 5 years.
            </ContentText>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>9. Termination</SectionTitle>

            <SubsectionTitle>9.1 Termination by Either Party</SubsectionTitle>
            <ContentText>
              Either party may terminate ongoing services with 30 days written notice. Project-based work may be terminated as specified in the individual project agreement.
            </ContentText>

            <SubsectionTitle>9.2 Immediate Termination</SubsectionTitle>
            <ContentText>We may terminate services immediately if:</ContentText>
            <ContentList>
              <li>You breach these Terms or any project agreement</li>
              <li>You fail to make required payments after notice and cure period</li>
              <li>You engage in illegal activities or violate applicable laws</li>
              <li>Continuation of services would violate applicable laws or regulations</li>
            </ContentList>

            <SubsectionTitle>9.3 Effect of Termination</SubsectionTitle>
            <ContentList>
              <li>You remain responsible for payment of all services rendered prior to termination</li>
              <li>We will provide you with all work product completed as of the termination date</li>
              <li>Confidentiality obligations and intellectual property rights survive termination</li>
              <li>We may retain copies of work product for our records and legal compliance</li>
            </ContentList>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>10. Dispute Resolution</SectionTitle>

            <SubsectionTitle>10.1 Governing Law</SubsectionTitle>
            <ContentText>
              These Terms are governed by the laws of India. Any disputes arising from these Terms or our services shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, Gujarat, India.
            </ContentText>

            <SubsectionTitle>10.2 Dispute Resolution Process</SubsectionTitle>
            <ContentList>
              <li><strong>Direct Negotiation:</strong> Parties will first attempt to resolve disputes through good faith negotiations</li>
              <li><strong>Mediation:</strong> If negotiation fails, disputes will be submitted to mediation before a mutually agreed mediator</li>
              <li><strong>Arbitration:</strong> Unresolved disputes may be submitted to binding arbitration under Indian Arbitration laws</li>
              <li><strong>Legal Action:</strong> Court proceedings only as a last resort for unresolved matters</li>
            </ContentList>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>11. General Provisions</SectionTitle>

            <SubsectionTitle>11.1 Entire Agreement</SubsectionTitle>
            <ContentText>
              These Terms, together with any project-specific agreements and our Privacy Policy, constitute the entire agreement between the parties and supersede all prior negotiations, representations, or agreements.
            </ContentText>

            <SubsectionTitle>11.2 Modifications</SubsectionTitle>
            <ContentText>
              We may update these Terms from time to time. Material changes will be communicated via email or prominent website notice. Continued use of our services constitutes acceptance of updated Terms.
            </ContentText>

            <SubsectionTitle>11.3 Severability</SubsectionTitle>
            <ContentText>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
            </ContentText>

            <SubsectionTitle>11.4 Assignment</SubsectionTitle>
            <ContentText>
              You may not assign these Terms or any rights hereunder without our written consent. We may assign these Terms in connection with a merger, acquisition, or sale of assets.
            </ContentText>
          </ContentSection>

          <ContentSection variants={slideUp}>
            <SectionTitle>12. Contact Information</SectionTitle>
            <ContentText>
              For questions about these Terms of Service or our services, please contact us:
            </ContentText>

            <SubsectionTitle>CodingBull Technovations Pvt Ltd</SubsectionTitle>
            <ContentList>
              <li><strong>Email:</strong> <ExternalLink href="mailto:contact@codingbullz.com">contact@codingbullz.com</ExternalLink></li>
              <li><strong>Website:</strong> <ContactLink to="/contact">Contact Form</ContactLink></li>
              <li><strong>Address:</strong> Registered in Ahmedabad, Gujarat, India</li>
              <li><strong>GSTIN:</strong> 24AAMCC7617E1ZP</li>
              <li><strong>Business Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM IST</li>
            </ContentList>

            <HighlightBox>
              <ContentText>
                <strong>Legal Notice:</strong> These Terms of Service are effective as of the date last updated above. By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms.
              </ContentText>
            </HighlightBox>
          </ContentSection>
        </ContentWrapper>
      </PageContainer>
    </>
  );
};

export default TermsOfServicePage;
