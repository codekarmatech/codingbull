/**
 * Mock blog data for fallback scenarios
 * This serves as a failsafe when the API is unavailable
 */

export const mockBlogPosts = [
  {
    id: 1,
    title: 'The Future of Web Development: Trends to Watch in 2024',
    slug: 'future-web-development-trends-2024',
    excerpt: 'Explore the cutting-edge technologies and methodologies that are shaping the future of web development.',
    content: `
      <p>The web development landscape is constantly evolving, with new technologies, frameworks, and methodologies emerging at a rapid pace. As we move through 2024, several key trends are shaping the future of how we build and interact with web applications.</p>
      
      <h2>1. The Rise of Edge Computing</h2>
      <p>Edge computing is revolutionizing how we think about web performance and user experience. By processing data closer to the user, applications can achieve:</p>
      <ul>
        <li>Significantly reduced latency</li>
        <li>Improved performance for global users</li>
        <li>Better data privacy and security</li>
        <li>Reduced bandwidth costs</li>
      </ul>
      <p>Major cloud providers are investing heavily in edge infrastructure, making it more accessible for developers to implement edge-first architectures.</p>
      
      <h2>2. WebAssembly (WASM) Mainstream Adoption</h2>
      <p>WebAssembly is no longer just an experimental technology. In 2024, we're seeing widespread adoption for:</p>
      <ul>
        <li>High-performance web applications</li>
        <li>Porting existing desktop applications to the web</li>
        <li>Running complex algorithms in the browser</li>
        <li>Gaming and multimedia applications</li>
      </ul>
      <p>The ecosystem around WASM is maturing, with better tooling and language support making it more accessible to developers.</p>
      
      <h2>3. AI-Powered Development Tools</h2>
      <p>Artificial Intelligence is transforming the development process itself. Modern AI tools are helping developers with:</p>
      <ul>
        <li>Code generation and completion</li>
        <li>Automated testing and bug detection</li>
        <li>Performance optimization suggestions</li>
        <li>Documentation generation</li>
      </ul>
      <p>These tools are not replacing developers but augmenting their capabilities, allowing them to focus on higher-level problem-solving and creativity.</p>
      
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
    published_date: '2024-06-15',
    category: {
      id: 1,
      name: 'Technology',
      slug: 'technology'
    },
    tags: [
      { name: 'Web Development' },
      { name: 'Trends' },
      { name: 'JavaScript' },
      { name: 'WebAssembly' },
      { name: 'Edge Computing' }
    ],
    image_url: '/api/placeholder/800/400',
    readingTime: '8 min read',
    featured: true
  },
  {
    id: 2,
    title: 'How AI is Transforming Software Development',
    slug: 'ai-transforming-software-development',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way we build, test, and deploy software.',
    content: `
      <p>Artificial Intelligence is no longer a futuristic concept—it's actively transforming how we approach software development today. From code generation to automated testing, AI is becoming an integral part of the development lifecycle.</p>
      
      <h2>AI-Powered Code Generation</h2>
      <p>Modern AI tools can generate code snippets, complete functions, and even entire modules based on natural language descriptions. This capability is revolutionizing how developers approach problem-solving.</p>
      
      <h2>Automated Testing and Quality Assurance</h2>
      <p>AI-driven testing tools can automatically generate test cases, identify edge cases, and predict potential bugs before they reach production.</p>
      
      <h2>Intelligent Code Review</h2>
      <p>AI systems can now perform sophisticated code reviews, identifying not just syntax errors but also potential security vulnerabilities, performance issues, and maintainability concerns.</p>
      
      <h2>The Future of AI in Development</h2>
      <p>As AI continues to evolve, we can expect even more sophisticated tools that will further augment developer capabilities while maintaining the creative and problem-solving aspects that make software development an art.</p>
    `,
    author: 'Sarah Chen',
    published_date: '2024-06-10',
    category: {
      id: 2,
      name: 'Artificial Intelligence',
      slug: 'artificial-intelligence'
    },
    tags: [
      { name: 'AI' },
      { name: 'Machine Learning' },
      { name: 'Software Development' },
      { name: 'Automation' }
    ],
    image_url: '/api/placeholder/800/400',
    readingTime: '6 min read',
    featured: true
  },
  {
    id: 3,
    title: 'Building Scalable Microservices Architecture',
    slug: 'building-scalable-microservices-architecture',
    excerpt: 'Learn the best practices for designing, implementing, and maintaining microservices at scale.',
    content: `
      <p>Microservices architecture has become the go-to approach for building scalable, maintainable applications. However, implementing microservices correctly requires careful planning and adherence to best practices.</p>
      
      <h2>Key Principles of Microservices</h2>
      <p>Successful microservices architectures are built on several fundamental principles that ensure scalability and maintainability.</p>
      
      <h2>Service Decomposition Strategies</h2>
      <p>Breaking down a monolithic application into microservices requires careful consideration of business domains, data ownership, and service boundaries.</p>
      
      <h2>Communication Patterns</h2>
      <p>Effective communication between microservices is crucial for system reliability and performance. We'll explore synchronous and asynchronous patterns.</p>
      
      <h2>Deployment and Monitoring</h2>
      <p>Deploying and monitoring microservices requires specialized tools and practices to ensure system health and performance.</p>
    `,
    author: 'Michael Rodriguez',
    published_date: '2024-06-05',
    category: {
      id: 3,
      name: 'Architecture',
      slug: 'architecture'
    },
    tags: [
      { name: 'Microservices' },
      { name: 'Scalability' },
      { name: 'System Design' },
      { name: 'DevOps' }
    ],
    image_url: '/api/placeholder/800/400',
    readingTime: '10 min read',
    featured: false
  },
  {
    id: 4,
    title: 'The Complete Guide to Cybersecurity for Businesses',
    slug: 'complete-guide-cybersecurity-businesses',
    excerpt: 'Protect your digital assets with this comprehensive guide to modern cybersecurity practices.',
    content: `
      <p>In today's digital landscape, cybersecurity is not just an IT concern—it's a business imperative. Organizations of all sizes must implement comprehensive security strategies to protect their digital assets.</p>
      
      <h2>Understanding the Threat Landscape</h2>
      <p>Modern cyber threats are sophisticated and constantly evolving. Understanding these threats is the first step in building effective defenses.</p>
      
      <h2>Essential Security Frameworks</h2>
      <p>Implementing proven security frameworks provides a structured approach to cybersecurity that scales with your organization.</p>
      
      <h2>Employee Training and Awareness</h2>
      <p>Human error remains one of the biggest security vulnerabilities. Comprehensive training programs are essential for maintaining security.</p>
      
      <h2>Incident Response Planning</h2>
      <p>When security incidents occur, having a well-defined response plan can minimize damage and reduce recovery time.</p>
    `,
    author: 'Emily Williams',
    published_date: '2024-05-28',
    category: {
      id: 4,
      name: 'Cybersecurity',
      slug: 'cybersecurity'
    },
    tags: [
      { name: 'Security' },
      { name: 'Business' },
      { name: 'Data Protection' },
      { name: 'Risk Management' }
    ],
    image_url: '/api/placeholder/800/400',
    readingTime: '12 min read',
    featured: false
  },
  {
    id: 5,
    title: 'Modern JavaScript: ES2024 Features and Best Practices',
    slug: 'modern-javascript-es2024-features',
    excerpt: 'Explore the latest JavaScript features and learn how to write more efficient, maintainable code.',
    content: `
      <p>JavaScript continues to evolve with new features and improvements that make development more efficient and enjoyable. ES2024 brings several exciting additions to the language.</p>
      
      <h2>New Language Features</h2>
      <p>ES2024 introduces several new language features that improve developer productivity and code readability.</p>
      
      <h2>Performance Improvements</h2>
      <p>The latest JavaScript engines include significant performance optimizations that benefit all applications.</p>
      
      <h2>Best Practices for Modern JavaScript</h2>
      <p>Writing maintainable JavaScript requires following established patterns and leveraging the language's modern features effectively.</p>
    `,
    author: 'David Kim',
    published_date: '2024-05-20',
    category: {
      id: 1,
      name: 'Technology',
      slug: 'technology'
    },
    tags: [
      { name: 'JavaScript' },
      { name: 'ES2024' },
      { name: 'Programming' },
      { name: 'Best Practices' }
    ],
    image_url: '/api/placeholder/800/400',
    readingTime: '7 min read',
    featured: false
  },
  {
    id: 6,
    title: 'Cloud-Native Development: A Comprehensive Guide',
    slug: 'cloud-native-development-guide',
    excerpt: 'Master the principles and practices of cloud-native development for modern applications.',
    content: `
      <p>Cloud-native development represents a fundamental shift in how we design, build, and deploy applications. This approach leverages cloud computing capabilities to create more resilient, scalable applications.</p>
      
      <h2>Cloud-Native Principles</h2>
      <p>Understanding the core principles of cloud-native development is essential for building successful applications in the cloud.</p>
      
      <h2>Containerization and Orchestration</h2>
      <p>Containers and orchestration platforms like Kubernetes are fundamental to cloud-native architectures.</p>
      
      <h2>DevOps and CI/CD</h2>
      <p>Cloud-native development requires robust DevOps practices and continuous integration/deployment pipelines.</p>
    `,
    author: 'Lisa Thompson',
    published_date: '2024-05-15',
    category: {
      id: 5,
      name: 'Cloud Computing',
      slug: 'cloud-computing'
    },
    tags: [
      { name: 'Cloud Native' },
      { name: 'Kubernetes' },
      { name: 'DevOps' },
      { name: 'Containers' }
    ],
    image_url: '/api/placeholder/800/400',
    readingTime: '9 min read',
    featured: true
  }
];

export const mockCategories = [
  { id: 1, name: 'Technology', slug: 'technology', post_count: 2 },
  { id: 2, name: 'Artificial Intelligence', slug: 'artificial-intelligence', post_count: 1 },
  { id: 3, name: 'Architecture', slug: 'architecture', post_count: 1 },
  { id: 4, name: 'Cybersecurity', slug: 'cybersecurity', post_count: 1 },
  { id: 5, name: 'Cloud Computing', slug: 'cloud-computing', post_count: 1 }
];

/**
 * Get mock posts with pagination
 */
export const getMockPosts = (page = 1, filters = {}) => {
  let filteredPosts = [...mockBlogPosts];
  
  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    filteredPosts = filteredPosts.filter(post => 
      post.category.slug === filters.category || post.category.name === filters.category
    );
  }
  
  // Apply search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredPosts = filteredPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.name.toLowerCase().includes(searchTerm))
    );
  }
  
  // Calculate pagination
  const postsPerPage = 6;
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  return {
    results: paginatedPosts,
    count: totalPosts,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrevious: page > 1
  };
};

/**
 * Get mock post by slug
 */
export const getMockPostBySlug = (slug) => {
  return mockBlogPosts.find(post => post.slug === slug);
};

/**
 * Get mock featured posts
 */
export const getMockFeaturedPosts = () => {
  return mockBlogPosts.filter(post => post.featured);
};

/**
 * Get mock categories with post count
 */
export const getMockCategoriesWithCount = () => {
  return mockCategories;
};

/**
 * Get mock posts by category
 */
export const getMockPostsByCategory = (categorySlug, page = 1) => {
  const filteredPosts = mockBlogPosts.filter(post => 
    post.category.slug === categorySlug
  );
  
  const postsPerPage = 6;
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  return {
    results: paginatedPosts,
    count: totalPosts,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrevious: page > 1
  };
};