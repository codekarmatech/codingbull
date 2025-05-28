import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, fadeIn, slideUp, staggerContainer } from '../animations/variants';
import Footer from '../components/Footer';
import Button from '../components/Button';

// Blog post page container
const BlogPostPageContainer = styled(motion.div)`
  min-height: 100vh;
  padding-top: 80px; // Account for fixed navbar
`;

// Hero section
const BlogPostHero = styled.section`
  position: relative;
  height: 500px;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(18, 18, 18, 0.7) 0%,
      rgba(18, 18, 18, 0.8) 100%
    );
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Hero content
const HeroContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 3rem 2rem;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  right: 0;
`;

// Blog category
const BlogCategory = styled.span`
  display: inline-block;
  background: ${props => props.theme.colors.electricBlue};
  color: ${props => props.theme.colors.textPrimary};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
`;

// Blog title
const BlogTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['5xl']};
  margin-bottom: 1.5rem;
  max-width: 800px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }
`;

// Blog meta
const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  color: ${props => props.theme.colors.textSecondary};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

// Blog author
const BlogAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${props => props.theme.colors.gradientPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: white;
  }
  
  .name {
    font-weight: 500;
  }
`;

// Blog date
const BlogDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Blog reading time
const ReadingTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Content section
const ContentSection = styled.section`
  padding: 5rem 2rem;
  background: ${props => props.theme.colors.mediumGrey};
`;

// Content wrapper
const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

// Main content
const MainContent = styled.div`
  background: ${props => props.theme.colors.darkGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 2rem 1.5rem;
  }
`;

// Blog content
const BlogContent = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.lg};
  line-height: 1.7;
  
  p {
    margin-bottom: 1.5rem;
  }
  
  h2 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    margin: 2.5rem 0 1rem;
    color: ${props => props.theme.colors.textPrimary};
  }
  
  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
    margin: 2rem 0 1rem;
    color: ${props => props.theme.colors.textPrimary};
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
    }
  }
  
  blockquote {
    border-left: 4px solid ${props => props.theme.colors.electricBlue};
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
  }
  
  img {
    max-width: 100%;
    border-radius: ${props => props.theme.borderRadius.md};
    margin: 2rem 0;
  }
  
  code {
    font-family: ${props => props.theme.fonts.code};
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: ${props => props.theme.borderRadius.sm};
    font-size: 0.9em;
  }
  
  pre {
    background: rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
    border-radius: ${props => props.theme.borderRadius.md};
    overflow-x: auto;
    margin: 2rem 0;
    
    code {
      background: transparent;
      padding: 0;
    }
  }
  
  a {
    color: ${props => props.theme.colors.electricBlue};
    text-decoration: underline;
    
    &:hover {
      color: ${props => props.theme.colors.deepPurple};
    }
  }
`;

// Tags
const BlogTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

// Tag
const BlogTag = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.theme.colors.textPrimary};
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.electricBlue};
    transform: translateY(-2px);
  }
`;

// Share section
const ShareSection = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    font-size: ${props => props.theme.fontSizes.lg};
    margin-bottom: 1rem;
  }
`;

// Share buttons
const ShareButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

// Custom shouldForwardProp function to filter out motion props
const shouldForwardProp = prop => !['whileHover', 'whileTap'].includes(prop);

// Share button styled component (without motion props)
const StyledShareButton = styled(motion.a).withConfig({
  shouldForwardProp
})`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.mediumGrey};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textPrimary};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme.colors.electricBlue};
    transform: translateY(-3px);
  }
`;

// Share button component that handles motion props
const ShareButton = ({ children, ...props }) => {
  // Extract motion props to avoid passing them to DOM
  const { whileHover, whileTap, ...otherProps } = props;
  
  // Create motion props object
  const motionProps = {
    whileHover,
    whileTap
  };
  
  return (
    <StyledShareButton {...motionProps} {...otherProps}>
      {children}
    </StyledShareButton>
  );
};

// Sidebar
const Sidebar = styled.aside`
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
`;

// Sidebar section
const SidebarSection = styled(motion.div)`
  background: ${props => props.theme.colors.darkGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  margin-bottom: 2rem;
  
  h3 {
    font-size: ${props => props.theme.fontSizes.lg};
    margin-bottom: 1.5rem;
    position: relative;
    padding-bottom: 0.75rem;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background: ${props => props.theme.colors.electricBlue};
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    margin-bottom: 0;
  }
`;

// Recent posts
const RecentPosts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// Recent post
const RecentPost = styled(Link)`
  display: flex;
  gap: 1rem;
  color: ${props => props.theme.colors.textPrimary};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    color: ${props => props.theme.colors.electricBlue};
  }
  
  .image {
    width: 80px;
    height: 60px;
    border-radius: ${props => props.theme.borderRadius.md};
    overflow: hidden;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .content {
    h4 {
      font-size: ${props => props.theme.fontSizes.md};
      margin-bottom: 0.25rem;
    }
    
    .date {
      font-size: ${props => props.theme.fontSizes.sm};
      color: ${props => props.theme.colors.lightGrey};
    }
  }
`;

// Categories list
const CategoriesList = styled.ul`
  list-style: none;
`;

// Category item
const CategoryItem = styled.li`
  margin-bottom: 0.75rem;
  
  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${props => props.theme.colors.textSecondary};
    transition: all 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.colors.electricBlue};
      transform: translateX(5px);
    }
    
    .count {
      background: rgba(255, 255, 255, 0.05);
      padding: 0.25rem 0.5rem;
      border-radius: ${props => props.theme.borderRadius.full};
      font-size: ${props => props.theme.fontSizes.xs};
    }
  }
`;

// Newsletter form
const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  input {
    padding: 0.75rem 1rem;
    background: ${props => props.theme.colors.mediumGrey};
    color: ${props => props.theme.colors.textPrimary};
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: ${props => props.theme.borderRadius.md};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.electricBlue};
    }
  }
`;

// Related posts section
const RelatedPostsSection = styled.section`
  padding: 5rem 2rem;
  background: ${props => props.theme.colors.darkGrey};
`;

// Related posts content
const RelatedPostsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Section header
const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

// Section title
const SectionTitle = styled(motion.h2)`
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: ${props => props.theme.colors.electricBlue};
  }
`;

// Related posts grid
const RelatedPostsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Related post card
const RelatedPostCard = styled(motion.article)`
  background: ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

// Related post image
const RelatedPostImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${RelatedPostCard}:hover & img {
    transform: scale(1.05);
  }
`;

// Related post content
const RelatedPostContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Related post title
const RelatedPostTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

// Related post excerpt
const RelatedPostExcerpt = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  flex: 1;
`;

// Mock blog data (would be fetched from API in production)
const mockPosts = [
  {
    id: 1,
    title: 'The Future of Web Development: Trends to Watch in 2024',
    excerpt: 'Explore the cutting-edge technologies and methodologies that are shaping the future of web development.',
    content: `
      <p>The web development landscape is constantly evolving, with new technologies, frameworks, and methodologies emerging at a rapid pace. As we move further into 2024, several key trends are shaping the future of how we build and interact with web applications.</p>
      
      <h2>1. WebAssembly (Wasm) Goes Mainstream</h2>
      <p>WebAssembly has been gaining traction for years, but 2024 is seeing it truly go mainstream. This binary instruction format provides near-native performance for web applications, allowing developers to run code written in languages like C, C++, and Rust directly in the browser.</p>
      <p>Key applications include:</p>
      <ul>
        <li>High-performance web games</li>
        <li>Complex data visualizations</li>
        <li>CPU-intensive tasks like image/video editing</li>
        <li>Porting existing desktop applications to the web</li>
      </ul>
      
      <h2>2. AI-Assisted Development</h2>
      <p>Artificial intelligence is revolutionizing how developers write code. Tools like GitHub Copilot and similar AI pair programmers are becoming essential parts of the development workflow, helping to:</p>
      <ul>
        <li>Generate boilerplate code</li>
        <li>Suggest optimizations</li>
        <li>Identify potential bugs</li>
        <li>Explain complex code sections</li>
      </ul>
      <p>This trend is not about replacing developers but augmenting their capabilities and allowing them to focus on higher-level problems.</p>
      
      <h2>3. Edge Computing</h2>
      <p>The edge computing paradigm continues to gain momentum, with more applications running code closer to the end user rather than in centralized data centers. This approach offers:</p>
      <ul>
        <li>Reduced latency</li>
        <li>Improved performance</li>
        <li>Better reliability</li>
        <li>Reduced bandwidth costs</li>
      </ul>
      <p>Frameworks like Cloudflare Workers, Vercel Edge Functions, and Netlify Edge are making it easier than ever to deploy code to the edge.</p>
      
      <h2>4. Web Components and Micro-Frontends</h2>
      <p>As applications grow in complexity, more teams are adopting component-based architectures and micro-frontend approaches. These methodologies allow:</p>
      <ul>
        <li>Independent deployment of different parts of an application</li>
        <li>Team autonomy and specialized focus</li>
        <li>Mixing of different technologies within the same application</li>
        <li>Better scalability for large organizations</li>
      </ul>
      
      <h2>5. Improved Accessibility as Standard</h2>
      <p>Web accessibility is no longer an afterthought but a fundamental aspect of web development. In 2024, we're seeing:</p>
      <ul>
        <li>Better tooling for accessibility testing</li>
        <li>Increased regulatory requirements</li>
        <li>More awareness and training</li>
        <li>Accessibility-first component libraries</li>
      </ul>
      <p>This shift is not just about compliance but about building better experiences for all users.</p>
      
      <h2>Conclusion</h2>
      <p>The web development field continues to evolve at a rapid pace, with performance, developer experience, and user accessibility at the forefront. By staying informed about these trends and adopting the relevant technologies and methodologies, developers can build better, faster, and more inclusive web applications.</p>
    `,
    author: 'Alex Johnson',
    date: '2024-06-15',
    category: 'Technology',
    tags: ['Web Development', 'Trends', 'JavaScript', 'WebAssembly', 'Edge Computing'],
    image: 'https://placehold.co/1200x600',
    slug: 'future-web-development-trends-2024',
    readingTime: '8 min read'
  },
  {
    id: 2,
    title: 'How AI is Transforming Software Development',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way we build, test, and deploy software.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: 'Sarah Chen',
    date: '2024-06-10',
    category: 'Artificial Intelligence',
    tags: ['AI', 'Machine Learning', 'Software Development'],
    image: 'https://placehold.co/1200x600',
    slug: 'ai-transforming-software-development',
    readingTime: '6 min read'
  },
  {
    id: 3,
    title: 'Building Scalable Microservices Architecture',
    excerpt: 'Learn the best practices for designing, implementing, and maintaining microservices at scale.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: 'Michael Rodriguez',
    date: '2024-06-05',
    category: 'Architecture',
    tags: ['Microservices', 'Scalability', 'System Design'],
    image: 'https://placehold.co/1200x600',
    slug: 'building-scalable-microservices-architecture',
    readingTime: '10 min read'
  },
  {
    id: 4,
    title: 'The Complete Guide to Cybersecurity for Businesses',
    excerpt: 'Protect your digital assets with this comprehensive guide to modern cybersecurity practices.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    author: 'Emily Williams',
    date: '2024-05-28',
    category: 'Cybersecurity',
    tags: ['Security', 'Business', 'Data Protection'],
    image: 'https://placehold.co/1200x600',
    slug: 'complete-guide-cybersecurity-businesses',
    readingTime: '12 min read'
  }
];

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [contentKey, setContentKey] = useState(0); // Key for AnimatePresence
  
  // Simulate API fetch
  useEffect(() => {
    // Reset loading state and increment content key for animation
    setLoading(true);
    setContentKey(prevKey => prevKey + 1);
    
    // In a real app, this would be an API call to fetch the specific post
    setTimeout(() => {
      const foundPost = mockPosts.find(p => p.slug === slug);
      setPost(foundPost || mockPosts[0]); // Default to first post if not found
      
      // Get related posts (same category or shared tags)
      if (foundPost) {
        const related = mockPosts
          .filter(p => p.id !== foundPost.id) // Exclude current post
          .filter(p => 
            p.category === foundPost.category || 
            p.tags.some(tag => foundPost.tags.includes(tag))
          )
          .slice(0, 3); // Limit to 3 related posts
        
        setRelatedPosts(related);
      }
      
      setLoading(false);
    }, 1000);
  }, [slug]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get author initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  // Handle newsletter submission
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the email to an API
    alert('Thank you for subscribing to our newsletter!');
    e.target.reset();
  };
  
  return (
    <BlogPostPageContainer
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.div
            key={`loading-${contentKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              background: '#121212',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10
            }}
          >
            <p>Loading article...</p>
          </motion.div>
        ) : !post ? (
          <motion.div
            key={`not-found-${contentKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              padding: '2rem',
              textAlign: 'center',
              background: '#121212'
            }}
          >
            <h1>Article Not Found</h1>
            <p>The article you're looking for doesn't exist or has been moved.</p>
            <Button 
              as={Link} 
              to="/blog" 
              variant="primary"
              style={{ marginTop: '2rem' }}
            >
              Back to Blog
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={`content-${contentKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BlogPostHero>
              <img src={post.image} alt={post.title} />
              <HeroContent>
                <BlogCategory>{post.category}</BlogCategory>
                <BlogTitle
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {post.title}
                </BlogTitle>
                <BlogMeta>
                  <BlogAuthor>
                    <div className="avatar">{getInitials(post.author)}</div>
                    <div>
                      <div className="name">{post.author}</div>
                    </div>
                  </BlogAuthor>
                  <BlogDate>
                    <span>📅</span> {formatDate(post.date)}
                  </BlogDate>
                  <ReadingTime>
                    <span>⏱️</span> {post.readingTime}
                  </ReadingTime>
                </BlogMeta>
              </HeroContent>
            </BlogPostHero>
            
            <ContentSection>
              <ContentWrapper>
                <MainContent>
                  <BlogContent dangerouslySetInnerHTML={{ __html: post.content }} />
                  
                  <BlogTags>
                    {post.tags.map((tag, index) => (
                      <BlogTag key={index}>{tag}</BlogTag>
                    ))}
                  </BlogTags>
                  
                  <ShareSection>
                    <h3>Share this article</h3>
                    <ShareButtons>
                      <ShareButton 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span>FB</span>
                      </ShareButton>
                      <ShareButton 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span>TW</span>
                      </ShareButton>
                      <ShareButton 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span>LI</span>
                      </ShareButton>
                      <ShareButton 
                        href="#" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span>EM</span>
                      </ShareButton>
                    </ShareButtons>
                  </ShareSection>
                </MainContent>
                
                <Sidebar>
                  <SidebarSection
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <h3>Recent Posts</h3>
                    <RecentPosts>
                      {mockPosts.slice(0, 3).map(recentPost => (
                        <RecentPost key={recentPost.id} to={`/blog/${recentPost.slug}`}>
                          <div className="image">
                            <img src={recentPost.image} alt={recentPost.title} />
                          </div>
                          <div className="content">
                            <h4>{recentPost.title}</h4>
                            <div className="date">{formatDate(recentPost.date)}</div>
                          </div>
                        </RecentPost>
                      ))}
                    </RecentPosts>
                  </SidebarSection>
                  
                  <SidebarSection
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3>Categories</h3>
                    <CategoriesList>
                      {Array.from(new Set(mockPosts.map(p => p.category))).map((category, index) => (
                        <CategoryItem key={index}>
                          <Link to={`/blog?category=${category}`}>
                            <span>{category}</span>
                            <span className="count">
                              {mockPosts.filter(p => p.category === category).length}
                            </span>
                          </Link>
                        </CategoryItem>
                      ))}
                    </CategoriesList>
                  </SidebarSection>
                  
                  <SidebarSection
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3>Newsletter</h3>
                    <p style={{ marginBottom: '1rem', color: '#E0E0E0' }}>
                      Subscribe to our newsletter for the latest insights and articles.
                    </p>
                    <NewsletterForm onSubmit={handleNewsletterSubmit}>
                      <input type="email" placeholder="Your email address" required />
                      <Button type="submit" variant="primary" fullWidth>Subscribe</Button>
                    </NewsletterForm>
                  </SidebarSection>
                </Sidebar>
              </ContentWrapper>
            </ContentSection>
            
            {relatedPosts.length > 0 && (
              <RelatedPostsSection>
                <RelatedPostsContent>
                  <SectionHeader>
                    <SectionTitle
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      Related Articles
                    </SectionTitle>
                  </SectionHeader>
                  
                  <RelatedPostsGrid
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {relatedPosts.map((relatedPost, index) => (
                      <RelatedPostCard
                        key={relatedPost.id}
                        variants={slideUp}
                        custom={index * 0.1}
                      >
                        <RelatedPostImage>
                          <img src={relatedPost.image} alt={relatedPost.title} />
                        </RelatedPostImage>
                        <RelatedPostContent>
                          <RelatedPostTitle>
                            <Link to={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                          </RelatedPostTitle>
                          <RelatedPostExcerpt>{relatedPost.excerpt}</RelatedPostExcerpt>
                          <Button 
                            as={Link} 
                            to={`/blog/${relatedPost.slug}`} 
                            variant="ghost" 
                            size="sm"
                          >
                            Read More
                          </Button>
                        </RelatedPostContent>
                      </RelatedPostCard>
                    ))}
                  </RelatedPostsGrid>
                </RelatedPostsContent>
              </RelatedPostsSection>
            )}
      
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </BlogPostPageContainer>
  );
};

export default BlogPostPage;