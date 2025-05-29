import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { pageTransition, staggerContainer, slideUp } from '../animations/variants';
import Footer from '../components/Footer';
import Button from '../components/Button';
import SEO from '../components/SEO';
import DebugEnv from '../components/DebugEnv';
import ApiTest from '../components/ApiTest';
import NetworkDebug from '../components/NetworkDebug';
import apiService from '../services/api';

// Blog page container
const BlogPageContainer = styled(motion.div)`
  min-height: 100vh;
  padding-top: 80px; // Account for fixed navbar
`;

// Hero section
const BlogHero = styled.section`
  background: ${props => props.theme.colors.darkGrey};
  padding: 6rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
      rgba(255,255,255,0) 0%, 
      rgba(0,191,255,0.5) 50%, 
      rgba(255,255,255,0) 100%);
  }
`;

// Hero content
const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

// Hero title
const HeroTitle = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes['5xl']};
  margin-bottom: 1.5rem;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

// Hero description
const HeroDescription = styled(motion.p)`
  font-size: ${props => props.theme.fontSizes.xl};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

// Blog content section
const BlogContent = styled.section`
  padding: 5rem 2rem;
  background: ${props => props.theme.colors.mediumGrey};
`;

// Content wrapper
const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Blog filters
const BlogFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

// Filter group
const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  label {
    font-weight: 500;
    color: ${props => props.theme.colors.textSecondary};
  }
  
  select {
    padding: 0.5rem 1rem;
    background: ${props => props.theme.colors.darkGrey};
    color: ${props => props.theme.colors.textPrimary};
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: ${props => props.theme.borderRadius.md};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.electricBlue};
    }
  }
`;

// Search input
const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.darkGrey};
  color: ${props => props.theme.colors.textPrimary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  width: 100%;
  max-width: 300px;
  
  &::placeholder {
    color: ${props => props.theme.colors.lightGrey};
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.electricBlue};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    max-width: 100%;
  }
`;

// Blog grid
const BlogGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Blog card
const BlogCard = styled(motion.article)`
  background: ${props => props.theme.colors.darkGrey};
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

// Blog image
const BlogImage = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${BlogCard}:hover & img {
    transform: scale(1.05);
  }
`;

// Blog category
const BlogCategory = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${props => props.theme.colors.electricBlue};
  color: ${props => props.theme.colors.textPrimary};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 1;
`;

// Blog content
const BlogCardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Blog meta
const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.lightGrey};
  font-size: ${props => props.theme.fontSizes.sm};
`;

// Blog author
const BlogAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${props => props.theme.colors.gradientPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: white;
  }
`;

// Blog date
const BlogDate = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// Blog title
const BlogTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.xl};
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

// Blog excerpt
const BlogExcerpt = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1.5rem;
  flex: 1;
`;

// Blog footer
const BlogCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

// Blog tags
const BlogTags = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// Blog tag
const BlogTag = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.lightGrey};
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.sm};
`;

// Pagination
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 4rem;
`;

// Page button
const PageButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$active ? props.theme.colors.electricBlue : props.theme.colors.darkGrey};
  color: ${props => props.theme.colors.textPrimary};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.electricBlue : props.theme.colors.deepPurple};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Newsletter section
const NewsletterSection = styled.section`
  padding: 5rem 2rem;
  background: ${props => props.theme.colors.darkGrey};
  text-align: center;
`;

// Newsletter content
const NewsletterContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

// Newsletter title
const NewsletterTitle = styled(motion.h2)`
  font-size: ${props => props.theme.fontSizes['3xl']};
  margin-bottom: 1rem;
`;

// Newsletter description
const NewsletterDescription = styled(motion.p)`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

// Newsletter form
const NewsletterForm = styled(motion.form)`
  display: flex;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
  
  input {
    flex: 1;
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

const BlogPage = () => {
  // State for blog posts
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const postsPerPage = 6;
  
  // State for API data
  const [error, setError] = useState(null); // Used for error handling
  
  // Legacy mock data (will be replaced by API data)
  const mockPostsRef = useRef([
    {
      id: 1,
      title: 'The Future of Web Development: Trends to Watch in 2024',
      excerpt: 'Explore the cutting-edge technologies and methodologies that are shaping the future of web development.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Alex Johnson',
      date: '2024-06-15',
      category: 'Technology',
      tags: ['Web Development', 'Trends', 'JavaScript'],
      image: 'https://placehold.co/600x400',
      slug: 'future-web-development-trends-2024'
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
      image: 'https://placehold.co/600x400',
      slug: 'ai-transforming-software-development'
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
      image: 'https://placehold.co/600x400',
      slug: 'building-scalable-microservices-architecture'
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
      image: 'https://placehold.co/600x400',
      slug: 'complete-guide-cybersecurity-businesses'
    },
    {
      id: 5,
      title: 'Optimizing React Applications for Performance',
      excerpt: 'Practical techniques to improve the speed and responsiveness of your React applications.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'David Kim',
      date: '2024-05-20',
      category: 'Frontend',
      tags: ['React', 'Performance', 'JavaScript'],
      image: 'https://placehold.co/600x400',
      slug: 'optimizing-react-applications-performance'
    },
    {
      id: 6,
      title: 'Cloud Migration Strategies for Enterprise Applications',
      excerpt: 'A step-by-step approach to migrating legacy enterprise applications to the cloud.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Jennifer Patel',
      date: '2024-05-15',
      category: 'Cloud',
      tags: ['Cloud Computing', 'Migration', 'Enterprise'],
      image: 'https://placehold.co/600x400',
      slug: 'cloud-migration-strategies-enterprise'
    },
    {
      id: 7,
      title: 'The Rise of Low-Code Development Platforms',
      excerpt: 'How low-code platforms are democratizing software development and accelerating digital transformation.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Robert Thompson',
      date: '2024-05-08',
      category: 'Technology',
      tags: ['Low-Code', 'Digital Transformation', 'Productivity'],
      image: 'https://placehold.co/600x400',
      slug: 'rise-low-code-development-platforms'
    },
    {
      id: 8,
      title: 'Implementing DevOps in Traditional Organizations',
      excerpt: 'Strategies for successfully adopting DevOps practices in established, traditional business environments.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Lisa Martinez',
      date: '2024-05-01',
      category: 'DevOps',
      tags: ['DevOps', 'Organizational Change', 'CI/CD'],
      image: 'https://placehold.co/600x400',
      slug: 'implementing-devops-traditional-organizations'
    }
  ]);
  
  // Fetch blog posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching blog posts with category:', category, 'page:', currentPage, 'search:', searchTerm);
        
        // Use the API service to fetch posts
        let response;
        
        if (category !== 'all' && category) {
          // If a category is selected, fetch posts by category
          response = await apiService.blog.getPostsByCategory(category, currentPage);
        } else {
          // Otherwise fetch all posts with optional search
          response = await apiService.blog.getPosts(currentPage, {
            search: searchTerm
          });
        }
        
        console.log('API response:', response);
        
        if (response && response.results) {
          setPosts(response.results);
          setFilteredPosts(response.results);
        } else {
          console.log('No results found, using mock data');
          // Fallback to mock data if API fails or during development
          setPosts(mockPostsRef.current);
          setFilteredPosts(mockPostsRef.current);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
        console.log('Using mock data due to error');
        // Fallback to mock data
        setPosts(mockPostsRef.current);
        setFilteredPosts(mockPostsRef.current);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPage, category, searchTerm]);
  
  // We're using uniqueCategories derived from posts, so we don't need to fetch categories separately
  
  // Filter posts based on category and search term
  useEffect(() => {
    let results = posts;
    
    // Filter by category
    if (category !== 'all') {
      results = results.filter(post => post.category === category);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.excerpt.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredPosts(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [category, searchTerm, posts]);
  
  // Get unique categories for filter
  const uniqueCategories = ['all', ...new Set(posts.map(post => post.category))];
  
  // Get current posts for pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
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
  
  // State for newsletter form
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState(null);
  
  // Handle newsletter submission
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterError('Please enter a valid email address');
      return;
    }
    
    setIsNewsletterSubmitting(true);
    setNewsletterError(null);
    
    try {
      // Use the contact API to submit newsletter subscription
      await apiService.contact.submitInquiry({
        email: newsletterEmail,
        subject: 'Newsletter Subscription',
        message: 'Please add me to your newsletter',
        name: 'Newsletter Subscriber'
      });
      
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setNewsletterSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting newsletter form:', error);
      setNewsletterError('Failed to subscribe. Please try again later.');
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };
  
  return (
    <>
      <SEO 
        title="Blog" 
        description="Stay updated with the latest insights, tutorials, and trends in web development, AI, cloud computing, and more from the CodingBull team."
        canonical="/blog"
      />
      <BlogPageContainer
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
      <BlogHero>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Blog & Resources
          </HeroTitle>
          <HeroDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Insights, case studies, and expert perspectives on technology, innovation, and digital transformation.
          </HeroDescription>
        </HeroContent>
      </BlogHero>
      
      <BlogContent>
        <ContentWrapper>
          <BlogFilters>
            <FilterGroup>
              <label htmlFor="category">Category:</label>
              <select 
                id="category" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {uniqueCategories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </FilterGroup>
            
            <SearchInput 
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </BlogFilters>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>No posts found matching your criteria.</p>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setCategory('all');
                  setSearchTerm('');
                }}
                style={{ marginTop: '1rem' }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <>
              <BlogGrid
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                viewport={{ once: true }}
              >
                {currentPosts.map((post, index) => (
                  <BlogCard
                    key={post.id}
                    variants={slideUp}
                    custom={index * 0.1}
                  >
                    <BlogImage>
                      <BlogCategory>{post.category}</BlogCategory>
                      <img src={post.image} alt={post.title} />
                    </BlogImage>
                    <BlogCardContent>
                      <BlogMeta>
                        <BlogAuthor>
                          <div className="avatar">{getInitials(post.author)}</div>
                          {post.author}
                        </BlogAuthor>
                        <BlogDate>
                          <span>📅</span> {formatDate(post.date)}
                        </BlogDate>
                      </BlogMeta>
                      <BlogTitle>
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </BlogTitle>
                      <BlogExcerpt>{post.excerpt}</BlogExcerpt>
                      <BlogCardFooter>
                        <BlogTags>
                          {post.tags.slice(0, 2).map((tag, i) => (
                            <BlogTag key={i}>{tag}</BlogTag>
                          ))}
                          {post.tags.length > 2 && <BlogTag>+{post.tags.length - 2}</BlogTag>}
                        </BlogTags>
                        <Button 
                          as={Link} 
                          to={`/blog/${post.slug}`} 
                          variant="ghost" 
                          size="sm"
                        >
                          Read More
                        </Button>
                      </BlogCardFooter>
                    </BlogCardContent>
                  </BlogCard>
                ))}
              </BlogGrid>
              
              {/* Pagination */}
              {filteredPosts.length > postsPerPage && (
                <Pagination>
                  <PageButton 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </PageButton>
                  
                  {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }).map((_, index) => (
                    <PageButton
                      key={index}
                      $active={currentPage === index + 1}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </PageButton>
                  ))}
                  
                  <PageButton
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
                  >
                    &gt;
                  </PageButton>
                </Pagination>
              )}
            </>
          )}
        </ContentWrapper>
      </BlogContent>
      
      <NewsletterSection>
        <NewsletterContent>
          <NewsletterTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Subscribe to Our Newsletter
          </NewsletterTitle>
          <NewsletterDescription
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Stay updated with our latest insights, articles, and industry news delivered straight to your inbox.
          </NewsletterDescription>
          <NewsletterForm
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleNewsletterSubmit}
          >
            <input 
              type="email" 
              id="blog-newsletter-email" 
              name="blog-newsletter-email" 
              placeholder="Your email address" 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              disabled={isNewsletterSubmitting}
              required 
            />
            <Button 
              type="submit" 
              variant="primary"
              disabled={isNewsletterSubmitting}
            >
              {isNewsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
            {newsletterError && (
              <div style={{ 
                color: '#ff6b6b', 
                fontSize: '0.875rem', 
                marginTop: '1rem', 
                textAlign: 'center',
                width: '100%'
              }}>
                {newsletterError}
              </div>
            )}
            {newsletterSuccess && (
              <div style={{ 
                color: '#2ed573', 
                fontSize: '0.875rem', 
                marginTop: '1rem', 
                textAlign: 'center',
                width: '100%'
              }}>
                Successfully subscribed to the newsletter!
              </div>
            )}
          </NewsletterForm>
        </NewsletterContent>
      </NewsletterSection>
      
      <Footer />
      <DebugEnv />
      <ApiTest />
      <NetworkDebug />
    </BlogPageContainer>
    </>
  );
};

export default BlogPage;