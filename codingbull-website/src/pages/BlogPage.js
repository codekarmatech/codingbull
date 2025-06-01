import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { pageTransition, staggerContainer, slideUp } from '../animations/variants';
import Footer from '../components/Footer';
import Button from '../components/Button';
import SEO from '../components/SEO';
import ImageWithFallback from '../components/ImageWithFallback';
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
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query parameters from URL
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category') || 'all';
  const searchParam = queryParams.get('search') || '';
  const pageParam = parseInt(queryParams.get('page') || '1', 10);
  
  // State for blog posts
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [category, setCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [categories, setCategories] = useState([{id: 'all', name: 'All Categories'}]);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 6;
  
  const [error, setError] = useState(null);
  
  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.blog.getCategoriesWithCount();
        if (response && Array.isArray(response)) {
          setCategories([
            { id: 'all', name: 'All Categories' },
            ...response
          ]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Categories will fall back to the default state with 'All Categories'
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch blog posts based on filters
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: currentPage,
        search: searchTerm
      };
      
      if (category !== 'all') {
        params.category = category;
      }
      
      const response = await apiService.blog.getPosts(currentPage, params);
      
      if (response && response.results) {
        setPosts(response.results);
        setTotalPages(Math.ceil(response.count / postsPerPage));
      } else if (response && Array.isArray(response)) {
        // Handle case where response is directly an array (mock data)
        setPosts(response);
        setTotalPages(1);
      } else {
        setPosts([]);
        setTotalPages(1);
        setError('No results found. Please try different search criteria.');
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      // Don't show error if we're using fallback data
      if (!err.message.includes('falling back to mock data')) {
        setError('Failed to load blog posts. Please try again later.');
      }
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, category, searchTerm]);

  // Fetch posts when filters change
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    const newParams = new URLSearchParams(location.search);
    newParams.set('page', page.toString());
    navigate(`/blog?${newParams.toString()}`);
  };
  
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    
    const newParams = new URLSearchParams(location.search);
    if (newCategory === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', newCategory);
    }
    newParams.delete('page');
    navigate(`/blog?${newParams.toString()}`);
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    
    const newParams = new URLSearchParams(location.search);
    if (term) {
      newParams.set('search', term);
    } else {
      newParams.delete('search');
    }
    newParams.delete('page');
    navigate(`/blog?${newParams.toString()}`);
  };
  
  
    
  
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
        phone: 'N/A',
        subject: 'Newsletter Subscription',
        message: 'Please add me to your newsletter',
        name: 'Newsletter Subscriber',
        inquiry_type: 'newsletter'
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
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get author initials
  const getInitials = (name) => {
    if (!name) return 'CB';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
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
          <HeroTitle>Our Blog & Resources</HeroTitle>
          <HeroDescription>
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
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id === 'all' ? 'all' : cat.name}>
                    {cat.name} {cat.post_count !== undefined ? `(${cat.post_count})` : ''}
                  </option>
                ))}
              </select>
            </FilterGroup>
            
            <SearchInput 
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(e.target.value)
              }}
            />
          </BlogFilters>
          
          {loading ? (
            <div className="loading-container">
              <p>Loading posts...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <Button 
                variant="secondary" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="no-results-container">
              <p>No posts found matching your criteria.</p>
              <Button 
                variant="secondary" 
                onClick={() => {
                  handleCategoryChange('all');
                  handleSearch('');
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <>
              <BlogGrid>
                {posts.map((post, index) => (
                  <BlogCard key={post.id}>
                    <BlogImage>
                      <BlogCategory>{post.category?.name || 'Uncategorized'}</BlogCategory>
                      <ImageWithFallback 
                        src={post.image_url || post.image} 
                        alt={post.title}
                        fallbackText="Blog Image"
                        showFallbackText={false}
                      />
                    </BlogImage>
                    <BlogCardContent>
                      <BlogMeta>
                        <BlogAuthor>
                          <div className="avatar">{getInitials(post.author)}</div>
                          {post.author || 'CodingBull Team'}
                        </BlogAuthor>
                        <BlogDate>
                          <span>📅</span> {post.published_date ? formatDate(post.published_date) : 'Unknown date'}
                        </BlogDate>
                      </BlogMeta>
                      <BlogTitle>
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </BlogTitle>
                      <BlogExcerpt>{post.excerpt}</BlogExcerpt>
                      <BlogCardFooter>
                        <BlogTags>
                          {post.tags?.slice(0, 3).map((tag, i) => (
                            <BlogTag key={i}>{typeof tag === 'object' ? tag.name : tag}</BlogTag>
                          ))}
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
              
              {totalPages > 1 && (
                <Pagination>
                  <PageButton 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    {"<"}
                  </PageButton>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PageButton
                      key={page}
                      $active={currentPage === page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PageButton>
                  ))}
                  
                  <PageButton
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    {">"}
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
    </BlogPageContainer>
    </>
  );
};

export default BlogPage;
