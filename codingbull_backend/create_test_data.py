import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'codingbull_api.settings')
django.setup()

from api.models import Category, BlogPost
from django.utils.text import slugify
from datetime import datetime, timedelta

def create_test_data():
    # Create categories
    categories = [
        "Web Development",
        "Mobile Development",
        "DevOps",
        "Artificial Intelligence",
        "Cloud Computing",
        "Cybersecurity"
    ]
    
    category_objects = []
    for category_name in categories:
        category, created = Category.objects.get_or_create(name=category_name)
        category_objects.append(category)
        print(f"Category {'created' if created else 'already exists'}: {category_name}")
    
    # Create blog posts
    blog_posts = [
        {
            "title": "The Future of Web Development: Trends to Watch in 2024",
            "content": """
            <p>Web development continues to evolve at a rapid pace, with new technologies and methodologies emerging regularly. As we move through 2024, several key trends are shaping the future of web development.</p>
            
            <h2>1. WebAssembly (Wasm) Goes Mainstream</h2>
            <p>WebAssembly is revolutionizing web performance by allowing code written in languages like C, C++, and Rust to run in the browser at near-native speed. In 2024, we're seeing more applications leveraging Wasm for computation-heavy tasks.</p>
            
            <h2>2. AI-Driven Development</h2>
            <p>AI tools are increasingly being integrated into the development workflow, from code completion to automated testing and optimization. This trend is making developers more productive and helping to create more robust applications.</p>
            
            <h2>3. Edge Computing</h2>
            <p>With the rise of edge computing, web applications are being deployed closer to users, reducing latency and improving performance. This approach is particularly beneficial for applications that require real-time processing.</p>
            """,
            "excerpt": "Explore the cutting-edge technologies and methodologies that are shaping the future of web development in 2024 and beyond.",
            "author": "Alex Johnson",
            "category": category_objects[0],  # Web Development
            "days_ago": 5
        },
        {
            "title": "Building Scalable Mobile Applications with React Native",
            "content": """
            <p>React Native has transformed the mobile development landscape by enabling developers to build cross-platform applications with a single codebase. This article explores best practices for creating scalable mobile applications with React Native.</p>
            
            <h2>Architecture Patterns</h2>
            <p>Implementing the right architecture pattern is crucial for scalability. We'll explore how to structure your React Native application using patterns like Redux for state management and clean architecture principles.</p>
            
            <h2>Performance Optimization</h2>
            <p>As your application grows, performance can become a concern. Learn techniques for optimizing React Native applications, including memoization, lazy loading, and efficient list rendering.</p>
            
            <h2>Testing Strategies</h2>
            <p>A comprehensive testing strategy is essential for maintaining quality as your application scales. We'll cover unit testing, integration testing, and end-to-end testing approaches for React Native.</p>
            """,
            "excerpt": "Learn how to build scalable and maintainable mobile applications using React Native with best practices for architecture, performance, and testing.",
            "author": "Sarah Chen",
            "category": category_objects[1],  # Mobile Development
            "days_ago": 10
        },
        {
            "title": "DevOps Automation: Streamlining Your CI/CD Pipeline",
            "content": """
            <p>Continuous Integration and Continuous Deployment (CI/CD) pipelines are the backbone of modern software development. This article explores how to automate and optimize your CI/CD pipeline for maximum efficiency.</p>
            
            <h2>Infrastructure as Code</h2>
            <p>Managing infrastructure through code allows for consistent, repeatable deployments. We'll explore tools like Terraform and Ansible for defining and provisioning your infrastructure.</p>
            
            <h2>Containerization with Docker and Kubernetes</h2>
            <p>Containers provide a consistent environment across development, testing, and production. Learn how to leverage Docker for containerization and Kubernetes for orchestration in your CI/CD pipeline.</p>
            
            <h2>Monitoring and Observability</h2>
            <p>Effective monitoring is crucial for maintaining the health of your applications. We'll discuss implementing comprehensive monitoring and observability solutions to detect and resolve issues quickly.</p>
            """,
            "excerpt": "Discover how to streamline your CI/CD pipeline with automation, containerization, and effective monitoring for faster and more reliable software delivery.",
            "author": "Michael Rodriguez",
            "category": category_objects[2],  # DevOps
            "days_ago": 15
        },
        {
            "title": "Practical Applications of AI in Business Intelligence",
            "content": """
            <p>Artificial Intelligence is transforming how businesses analyze data and make decisions. This article explores practical applications of AI in business intelligence and how organizations can leverage these technologies.</p>
            
            <h2>Predictive Analytics</h2>
            <p>AI-powered predictive analytics can forecast trends and outcomes based on historical data. Learn how businesses are using these insights to make proactive decisions and stay ahead of market changes.</p>
            
            <h2>Natural Language Processing for Data Queries</h2>
            <p>Natural Language Processing (NLP) is making data more accessible by allowing users to query databases using conversational language. We'll explore how this technology is democratizing data access within organizations.</p>
            
            <h2>Automated Reporting and Insights</h2>
            <p>AI can automatically generate reports and surface insights that might otherwise go unnoticed. Discover how automated reporting is saving time and providing deeper insights for business intelligence teams.</p>
            """,
            "excerpt": "Explore how artificial intelligence is revolutionizing business intelligence through predictive analytics, natural language processing, and automated insights generation.",
            "author": "Emily Williams",
            "category": category_objects[3],  # Artificial Intelligence
            "days_ago": 20
        },
        {
            "title": "Multi-Cloud Strategies: Benefits and Challenges",
            "content": """
            <p>As cloud computing continues to evolve, many organizations are adopting multi-cloud strategies to leverage the strengths of different cloud providers. This article examines the benefits and challenges of multi-cloud approaches.</p>
            
            <h2>Vendor Diversification</h2>
            <p>Relying on multiple cloud providers reduces the risk of vendor lock-in and provides redundancy. We'll discuss how to strategically distribute workloads across different cloud platforms.</p>
            
            <h2>Cost Optimization</h2>
            <p>Different cloud providers offer varying pricing models for different services. Learn how to optimize costs by selecting the most cost-effective provider for each specific workload.</p>
            
            <h2>Management Complexity</h2>
            <p>While multi-cloud strategies offer benefits, they also introduce complexity in management and operations. We'll explore tools and practices for effectively managing multi-cloud environments.</p>
            """,
            "excerpt": "Understand the advantages and challenges of implementing a multi-cloud strategy, including vendor diversification, cost optimization, and managing increased complexity.",
            "author": "David Kim",
            "category": category_objects[4],  # Cloud Computing
            "days_ago": 25
        },
        {
            "title": "Zero Trust Security: Implementation Strategies",
            "content": """
            <p>The Zero Trust security model operates on the principle of "never trust, always verify," requiring verification from everyone attempting to access resources. This article provides strategies for implementing Zero Trust in your organization.</p>
            
            <h2>Identity and Access Management</h2>
            <p>Strong identity verification and access management are foundational to Zero Trust. We'll discuss implementing multi-factor authentication, role-based access control, and just-in-time access provisioning.</p>
            
            <h2>Micro-Segmentation</h2>
            <p>Dividing your network into secure zones helps contain breaches and limit lateral movement. Learn how to implement micro-segmentation to enhance your security posture.</p>
            
            <h2>Continuous Monitoring and Validation</h2>
            <p>Zero Trust requires ongoing monitoring and validation of security. We'll explore tools and practices for continuous monitoring, threat detection, and automated response to security incidents.</p>
            """,
            "excerpt": "Learn practical strategies for implementing a Zero Trust security model in your organization, focusing on identity management, micro-segmentation, and continuous monitoring.",
            "author": "Jennifer Patel",
            "category": category_objects[5],  # Cybersecurity
            "days_ago": 30
        }
    ]
    
    for post_data in blog_posts:
        # Create a slug from the title
        slug = slugify(post_data["title"])
        
        # Calculate the published date
        published_date = datetime.now() - timedelta(days=post_data["days_ago"])
        
        # Check if the post already exists
        if not BlogPost.objects.filter(slug=slug).exists():
            # Create the blog post
            BlogPost.objects.create(
                title=post_data["title"],
                slug=slug,
                content=post_data["content"],
                excerpt=post_data["excerpt"],
                author=post_data["author"],
                category=post_data["category"],
                published_date=published_date
            )
            print(f"Created blog post: {post_data['title']}")
        else:
            print(f"Blog post already exists: {post_data['title']}")

if __name__ == "__main__":
    create_test_data()
    print("Test data creation completed!")