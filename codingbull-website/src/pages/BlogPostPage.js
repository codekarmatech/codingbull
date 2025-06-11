import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, fadeIn, slideUp, staggerContainer } from '../animations/variants';
import Footer from '../components/Footer';
import Button from '../components/Button';
import ImageWithFallback from '../components/ImageWithFallback';
import apiService from '../services/api';
import { mockBlogPosts, mockCategories } from '../data/mockBlogData';
// import SEO from '../components/SEO';

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



const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [contentKey, setContentKey] = useState(0); // Key for AnimatePresence
  
  // Fetch post data from API
  useEffect(() => {
    // Reset loading state and increment content key for animation
    setLoading(true);
    setContentKey(prevKey => prevKey + 1);
    
    const fetchPost = async () => {
      try {
        // Fetch the post by slug
        const postData = await apiService.blog.getPost(slug);
        setPost(postData);
        
        // Fetch related posts (same category or shared tags)
        if (postData && postData.category) {
          try {
            // Get posts from the same category
            const categoryResponse = await apiService.blog.getPostsByCategory(postData.category.slug);
            
            // Filter out the current post and limit to 3 related posts
            const related = (categoryResponse.results || [])
              .filter(p => p.id !== postData.id)
              .slice(0, 3);
              
            setRelatedPosts(related);
          } catch (error) {
            console.error('Error fetching related posts:', error);
        // Return empty array if no related posts found
        setRelatedPosts([]);
          }
        }
        
        // Fetch recent posts for sidebar
        try {
          const recentResponse = await apiService.blog.getPosts(1, { ordering: '-published_date' });
          // Filter out the current post and limit to 3 recent posts
          const recent = (recentResponse.results || [])
            .filter(p => p.id !== postData.id)
            .slice(0, 3);
          setRecentPosts(recent);
        } catch (error) {
          console.error('Error fetching recent posts:', error);
          // Fallback to mock data if API fails
          setRecentPosts(mockBlogPosts.filter(p => p.slug !== slug).slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setPost(null);
        setRelatedPosts([]);
        setRecentPosts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
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
                className="blog-loading-container"
              >
                <p>Loading article...</p>
              </motion.div>
            ) : !post ? (
              <motion.div
                key={`not-found-${contentKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="blog-not-found-container"
              >
                <h1>Article Not Found</h1>
                <p>The article you're looking for doesn't exist or has been moved.</p>
                <Button 
                  as={Link} 
                  to="/blog" 
                  variant="primary"
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
                  {post.image_url || post.image ? (
                    <ImageWithFallback 
                      src={post.image_url || post.image} 
                      alt={post.title}
                      fallbackText="Blog Post Image"
                      showFallbackText={false}
                    />
                  ) : (
                    <div className="blog-image-placeholder">
                      <div className="placeholder-content">
                        <div className="placeholder-text">No Image</div>
                      </div>
                    </div>
                  )}
                  <HeroContent>
                    <BlogCategory>{post.category?.name || 'Uncategorized'}</BlogCategory>
                    <BlogTitle>{post.title}</BlogTitle>
                    <BlogMeta>
                      <BlogAuthor>
                        <div className="avatar">{getInitials(post.author)}</div>
                        <div className="name">{post.author || 'CodingBull Team'}</div>
                      </BlogAuthor>
                      <BlogDate>
                        <span>📅</span> {formatDate(post.published_date || post.date)}
                      </BlogDate>
                      <ReadingTime>
                        <span>⏱️</span> {post.readingTime || '5 min read'}
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
                      <BlogTag key={index}>{typeof tag === 'object' ? tag.name : tag}</BlogTag>
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
                      {recentPosts.length > 0 ? (
                        recentPosts.map(recentPost => (
                          <RecentPost key={recentPost.id} to={`/blog/${recentPost.slug}`}>
                            <div className="image">
                              <ImageWithFallback 
                                src={recentPost.image_url || recentPost.image} 
                                alt={recentPost.title}
                                fallbackText="Blog"
                                showFallbackText={false}
                              />
                            </div>
                            <div className="content">
                              <h4>{recentPost.title}</h4>
                              <div className="date">{formatDate(recentPost.published_date || recentPost.date)}</div>
                            </div>
                          </RecentPost>
                        ))
                      ) : (
                        <div style={{ color: '#E0E0E0', textAlign: 'center', padding: '1rem' }}>
                          Loading recent posts...
                        </div>
                      )}
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
                      {mockCategories.map((category) => (
                        <CategoryItem key={category.id}>
                          <Link to={`/blog?category=${category.slug}`}>
                            <span>{category.name}</span>
                            <span className="count">
                              {category.post_count}
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
                      <input 
                        type="email" 
                        id="blog-post-newsletter-email" 
                        name="blog-post-newsletter-email" 
                        placeholder="Your email address" 
                        required 
                      />
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
