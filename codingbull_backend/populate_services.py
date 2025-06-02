#!/usr/bin/env python
"""
Script to populate comprehensive services data in the database.
This script creates detailed services with all the information needed for both
the services listing page and individual service pages.
"""

import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'codingbull_api.settings')
django.setup()

from api.models import Service

def populate_services():
    """Populate the database with comprehensive services data."""
    
    services_data = [
        {
            'name': 'Full-Stack Development',
            'slug': 'full-stack-development',
            'summary': 'End-to-end development services from front-end interfaces to back-end systems.',
            'description': 'Complete web application development using modern technologies and best practices.',
            'long_description': 'Our full-stack development services provide comprehensive solutions that cover both client-facing interfaces and server-side systems. We leverage the latest technologies and frameworks to build scalable, high-performance applications that meet your business needs.',
            'icon_emoji': '💻',
            'image_url': 'https://placehold.co/600x400',
            'features': [
                'Responsive web applications',
                'RESTful API development',
                'Database design and optimization',
                'Third-party integrations',
                'Performance optimization',
                'Testing & Quality Assurance'
            ],
            'detailed_features': [
                {
                    'icon': '🎨',
                    'title': 'Front-End Excellence',
                    'description': 'Responsive, intuitive, and engaging user interfaces built with modern frameworks like React, Angular, and Vue.js.'
                },
                {
                    'icon': '⚙️',
                    'title': 'Robust Back-End Systems',
                    'description': 'Scalable server-side architecture using Node.js, Python, Java, or .NET, designed for performance and reliability.'
                },
                {
                    'icon': '🔄',
                    'title': 'API Development',
                    'description': 'RESTful and GraphQL APIs that enable seamless communication between your front-end and back-end systems.'
                },
                {
                    'icon': '🗄️',
                    'title': 'Database Design',
                    'description': 'Optimized database structures using SQL or NoSQL solutions, ensuring data integrity and efficient queries.'
                },
                {
                    'icon': '🔍',
                    'title': 'Testing & Quality Assurance',
                    'description': 'Comprehensive testing strategies including unit, integration, and end-to-end testing to ensure robust applications.'
                },
                {
                    'icon': '🚀',
                    'title': 'DevOps Integration',
                    'description': 'CI/CD pipelines and infrastructure as code for streamlined deployment and maintenance.'
                }
            ],
            'process_steps': [
                {
                    'step': 1,
                    'title': 'Discovery & Planning',
                    'description': 'We begin by understanding your business goals, target audience, and technical requirements to create a comprehensive project roadmap.'
                },
                {
                    'step': 2,
                    'title': 'Architecture & Design',
                    'description': 'Our architects design the system architecture, database schema, and user interfaces, ensuring scalability and optimal performance.'
                },
                {
                    'step': 3,
                    'title': 'Development',
                    'description': 'Using agile methodologies, we develop both front-end and back-end components in parallel, with regular client check-ins.'
                },
                {
                    'step': 4,
                    'title': 'Testing & QA',
                    'description': 'Rigorous testing across multiple devices and scenarios ensures your application works flawlessly in all conditions.'
                },
                {
                    'step': 5,
                    'title': 'Deployment',
                    'description': 'We handle the deployment process, ensuring smooth transitions to production environments with minimal downtime.'
                },
                {
                    'step': 6,
                    'title': 'Maintenance & Support',
                    'description': 'Ongoing support, monitoring, and updates keep your application secure, performant, and aligned with evolving business needs.'
                }
            ],
            'technologies': [
                {'name': 'React', 'icon': '⚛️'},
                {'name': 'Angular', 'icon': '🅰️'},
                {'name': 'Vue.js', 'icon': '🔰'},
                {'name': 'Node.js', 'icon': '📦'},
                {'name': 'Python', 'icon': '🐍'},
                {'name': 'Java', 'icon': '☕'},
                {'name': 'MongoDB', 'icon': '🍃'},
                {'name': 'PostgreSQL', 'icon': '🐘'},
                {'name': 'AWS', 'icon': '☁️'},
                {'name': 'Docker', 'icon': '🐳'},
                {'name': 'Kubernetes', 'icon': '⎈'},
                {'name': 'GraphQL', 'icon': '📊'}
            ],
            'faqs': [
                {
                    'question': 'How long does a typical full-stack development project take?',
                    'answer': 'Project timelines vary based on complexity and scope. A simple application might take 2-3 months, while more complex enterprise solutions can take 6+ months. During our initial consultation, we will provide a detailed timeline based on your specific requirements.'
                },
                {
                    'question': 'Which technology stack do you recommend for my project?',
                    'answer': 'We recommend technology stacks based on your specific business needs, scalability requirements, existing infrastructure, and long-term goals. We are proficient in multiple stacks and will help you choose the one that best aligns with your project objectives.'
                },
                {
                    'question': 'Do you provide ongoing maintenance after the project is completed?',
                    'answer': 'Yes, we offer flexible maintenance packages to ensure your application remains secure, up-to-date, and aligned with your evolving business needs. Our support includes bug fixes, security updates, performance optimization, and feature enhancements.'
                },
                {
                    'question': 'How do you ensure the security of the applications you develop?',
                    'answer': 'Security is integrated throughout our development process. We follow industry best practices for secure coding, implement authentication and authorization mechanisms, conduct regular security audits, and stay updated on the latest vulnerabilities and mitigation strategies.'
                },
                {
                    'question': 'Can you work with our existing development team?',
                    'answer': 'Absolutely. We are experienced in collaborative development and can integrate seamlessly with your existing team. We can provide specialized expertise, augment your team capabilities, or take on specific components of the project as needed.'
                }
            ],
            'related_services': ['mobile-app-development', 'cloud-solutions', 'devops-cicd']
        },
        {
            'name': 'Mobile App Development',
            'slug': 'mobile-app-development',
            'summary': 'Native and cross-platform mobile applications for iOS and Android.',
            'description': 'Professional mobile app development for all platforms.',
            'long_description': 'Our mobile app development services deliver high-performance, user-friendly applications that engage your audience and drive business growth. Whether you need native iOS, Android, or cross-platform solutions, we create mobile experiences that stand out in today\'s competitive market.',
            'icon_emoji': '📱',
            'image_url': 'https://placehold.co/600x400',
            'features': [
                'Native iOS applications',
                'Native Android applications',
                'Cross-platform solutions',
                'API integration',
                'Secure authentication',
                'Analytics & insights'
            ],
            'detailed_features': [
                {
                    'icon': '🍎',
                    'title': 'iOS Development',
                    'description': 'Native iOS applications built with Swift, optimized for performance and user experience across all Apple devices.'
                },
                {
                    'icon': '🤖',
                    'title': 'Android Development',
                    'description': 'Native Android applications using Kotlin or Java, designed to work seamlessly across the diverse Android ecosystem.'
                },
                {
                    'icon': '🔄',
                    'title': 'Cross-Platform Solutions',
                    'description': 'Efficient development using React Native or Flutter to deliver consistent experiences across both iOS and Android.'
                },
                {
                    'icon': '🔌',
                    'title': 'API Integration',
                    'description': 'Seamless integration with backend services, third-party APIs, and existing business systems.'
                },
                {
                    'icon': '🔒',
                    'title': 'Secure Authentication',
                    'description': 'Robust authentication methods including biometrics, social login, and multi-factor authentication.'
                },
                {
                    'icon': '📊',
                    'title': 'Analytics & Insights',
                    'description': 'Integration of analytics tools to track user behavior and provide actionable insights for continuous improvement.'
                }
            ],
            'process_steps': [
                {
                    'step': 1,
                    'title': 'Strategy & Planning',
                    'description': 'We define your app\'s objectives, target audience, and key features to create a comprehensive development roadmap.'
                },
                {
                    'step': 2,
                    'title': 'UI/UX Design',
                    'description': 'Our designers create intuitive, engaging interfaces that align with your brand and optimize the user experience.'
                },
                {
                    'step': 3,
                    'title': 'Development',
                    'description': 'Using agile methodologies, we develop your application with regular builds and client feedback sessions.'
                },
                {
                    'step': 4,
                    'title': 'Testing',
                    'description': 'Rigorous testing across multiple devices and scenarios ensures your app works flawlessly in all conditions.'
                },
                {
                    'step': 5,
                    'title': 'Deployment',
                    'description': 'We handle the submission process to app stores, ensuring compliance with all guidelines and requirements.'
                },
                {
                    'step': 6,
                    'title': 'Post-Launch Support',
                    'description': 'Ongoing maintenance, performance monitoring, and updates keep your app relevant and functioning optimally.'
                }
            ],
            'technologies': [
                {'name': 'Swift', 'icon': '🍎'},
                {'name': 'Kotlin', 'icon': '🤖'},
                {'name': 'React Native', 'icon': '⚛️'},
                {'name': 'Flutter', 'icon': '💙'},
                {'name': 'Firebase', 'icon': '🔥'},
                {'name': 'AWS Amplify', 'icon': '☁️'},
                {'name': 'GraphQL', 'icon': '📊'},
                {'name': 'REST APIs', 'icon': '🔄'},
                {'name': 'SQLite', 'icon': '🗄️'},
                {'name': 'Realm', 'icon': '💾'},
                {'name': 'Push Notifications', 'icon': '🔔'},
                {'name': 'Analytics', 'icon': '📈'}
            ],
            'faqs': [
                {
                    'question': 'Should I build a native app or a cross-platform app?',
                    'answer': 'The choice between native and cross-platform depends on your specific needs. Native apps offer the best performance and access to platform-specific features, while cross-platform solutions provide faster development and cost efficiency. We will help you evaluate the trade-offs based on your project requirements.'
                },
                {
                    'question': 'How long does it take to develop a mobile app?',
                    'answer': 'Development timelines vary based on complexity. A simple app might take 2-3 months, while more complex applications can take 4-6 months or more. We will provide a detailed timeline during our initial consultation based on your specific requirements.'
                },
                {
                    'question': 'How do you ensure my app will be approved by the App Store and Google Play?',
                    'answer': 'We stay current with all app store guidelines and requirements, and build compliance into our development process. Our submission specialists handle the entire process, addressing any feedback from review teams to ensure successful approval.'
                },
                {
                    'question': 'Can you update my existing mobile app?',
                    'answer': 'Yes, we can take over maintenance and enhancement of existing applications. We will begin with a thorough code review and architecture assessment to understand the current state and identify opportunities for improvement.'
                },
                {
                    'question': 'How do you handle app testing across multiple devices?',
                    'answer': 'We employ a comprehensive testing strategy that includes automated testing, device labs with physical devices, and cloud-based testing platforms that allow us to test across hundreds of device/OS combinations to ensure compatibility and performance.'
                }
            ],
            'related_services': ['full-stack-development', 'ui-ux-design', 'cloud-solutions']
        },
        {
            'name': 'Cloud Solutions',
            'slug': 'cloud-solutions',
            'summary': 'Scalable, secure, and cost-effective cloud infrastructure and services.',
            'description': 'Modern cloud infrastructure and deployment solutions.',
            'long_description': 'Our cloud solutions help businesses leverage the power of cloud computing with scalable architectures, automated deployments, and cost-effective solutions. We provide end-to-end cloud services from migration to optimization.',
            'icon_emoji': '☁️',
            'image_url': 'https://placehold.co/600x400',
            'features': [
                'Cloud migration services',
                'Auto scaling solutions',
                'Security & compliance',
                'Cost optimization',
                'Disaster recovery',
                'Monitoring & analytics'
            ],
            'detailed_features': [
                {
                    'icon': '🚀',
                    'title': 'Cloud Migration',
                    'description': 'Seamless migration of your existing applications and data to cloud platforms with minimal downtime.'
                },
                {
                    'icon': '📈',
                    'title': 'Auto Scaling',
                    'description': 'Automatic scaling of resources based on demand to ensure optimal performance and cost efficiency.'
                },
                {
                    'icon': '🔒',
                    'title': 'Security & Compliance',
                    'description': 'Enterprise-grade security measures and compliance with industry standards like GDPR, HIPAA, and SOC 2.'
                },
                {
                    'icon': '💰',
                    'title': 'Cost Optimization',
                    'description': 'Continuous monitoring and optimization of cloud resources to minimize costs while maintaining performance.'
                },
                {
                    'icon': '🔄',
                    'title': 'Disaster Recovery',
                    'description': 'Robust backup and disaster recovery solutions to ensure business continuity.'
                },
                {
                    'icon': '📊',
                    'title': 'Monitoring & Analytics',
                    'description': 'Comprehensive monitoring and analytics to track performance, usage, and costs.'
                }
            ],
            'process_steps': [
                {
                    'step': 1,
                    'title': 'Assessment',
                    'description': 'We analyze your current infrastructure and identify opportunities for cloud adoption.'
                },
                {
                    'step': 2,
                    'title': 'Strategy',
                    'description': 'We develop a comprehensive cloud strategy aligned with your business objectives.'
                },
                {
                    'step': 3,
                    'title': 'Migration',
                    'description': 'We execute the migration plan with minimal disruption to your operations.'
                },
                {
                    'step': 4,
                    'title': 'Optimization',
                    'description': 'We continuously optimize your cloud environment for performance and cost.'
                }
            ],
            'technologies': [
                {'name': 'AWS', 'icon': '☁️'},
                {'name': 'Azure', 'icon': '🔷'},
                {'name': 'Google Cloud', 'icon': '🌐'},
                {'name': 'Kubernetes', 'icon': '⎈'},
                {'name': 'Docker', 'icon': '🐳'},
                {'name': 'Terraform', 'icon': '🏗️'},
                {'name': 'Ansible', 'icon': '🔧'},
                {'name': 'Jenkins', 'icon': '🔄'}
            ],
            'faqs': [
                {
                    'question': 'Which cloud platform is best for my business?',
                    'answer': 'The choice depends on your specific requirements, existing infrastructure, and business goals. We help you evaluate AWS, Azure, and Google Cloud to find the best fit.'
                },
                {
                    'question': 'How long does cloud migration take?',
                    'answer': 'Migration timelines vary based on the complexity and size of your infrastructure. Simple migrations can take weeks, while complex enterprise migrations may take several months.'
                }
            ],
            'related_services': ['full-stack-development', 'devops-cicd', 'ai-machine-learning']
        },
        {
            'name': 'DevOps & CI/CD',
            'slug': 'devops-cicd',
            'summary': 'Streamline your development workflow with automated testing and deployment.',
            'description': 'Professional DevOps services and automation solutions.',
            'long_description': 'We implement continuous integration and deployment pipelines that improve development efficiency and ensure reliable software delivery. Our DevOps practices help teams deliver better software faster.',
            'icon_emoji': '🔄',
            'image_url': 'https://placehold.co/600x400',
            'features': [
                'CI/CD pipelines',
                'Infrastructure as code',
                'Monitoring & logging',
                'Security integration',
                'Containerization',
                'Performance optimization'
            ],
            'detailed_features': [
                {
                    'icon': '🔄',
                    'title': 'CI/CD Pipelines',
                    'description': 'Automated build, test, and deployment pipelines that ensure consistent and reliable releases.'
                },
                {
                    'icon': '🏗️',
                    'title': 'Infrastructure as Code',
                    'description': 'Manage and provision infrastructure through code for consistency and repeatability.'
                },
                {
                    'icon': '📊',
                    'title': 'Monitoring & Logging',
                    'description': 'Comprehensive monitoring and logging solutions for proactive issue detection and resolution.'
                },
                {
                    'icon': '🔒',
                    'title': 'Security Integration',
                    'description': 'Security practices integrated into the development pipeline for secure software delivery.'
                },
                {
                    'icon': '🐳',
                    'title': 'Containerization',
                    'description': 'Docker and Kubernetes solutions for scalable and portable application deployment.'
                },
                {
                    'icon': '⚡',
                    'title': 'Performance Optimization',
                    'description': 'Continuous performance monitoring and optimization for optimal application performance.'
                }
            ],
            'process_steps': [
                {
                    'step': 1,
                    'title': 'Assessment',
                    'description': 'We evaluate your current development and deployment processes.'
                },
                {
                    'step': 2,
                    'title': 'Pipeline Design',
                    'description': 'We design CI/CD pipelines tailored to your specific needs and requirements.'
                },
                {
                    'step': 3,
                    'title': 'Implementation',
                    'description': 'We implement the DevOps tools and processes with minimal disruption.'
                },
                {
                    'step': 4,
                    'title': 'Training',
                    'description': 'We train your team on the new processes and tools.'
                }
            ],
            'technologies': [
                {'name': 'Jenkins', 'icon': '🔄'},
                {'name': 'GitLab CI', 'icon': '🦊'},
                {'name': 'GitHub Actions', 'icon': '🐙'},
                {'name': 'Docker', 'icon': '🐳'},
                {'name': 'Kubernetes', 'icon': '⎈'},
                {'name': 'Terraform', 'icon': '🏗️'},
                {'name': 'Prometheus', 'icon': '📊'},
                {'name': 'Grafana', 'icon': '📈'}
            ],
            'faqs': [
                {
                    'question': 'What are the benefits of implementing CI/CD?',
                    'answer': 'CI/CD provides faster time to market, improved code quality, reduced manual errors, and better collaboration between development and operations teams.'
                },
                {
                    'question': 'How long does it take to implement DevOps practices?',
                    'answer': 'Implementation timelines vary based on your current setup and requirements. Basic CI/CD can be set up in weeks, while comprehensive DevOps transformation may take several months.'
                }
            ],
            'related_services': ['full-stack-development', 'cloud-solutions', 'mobile-app-development']
        },
        {
            'name': 'UI/UX Design',
            'slug': 'ui-ux-design',
            'summary': 'User-centered design services that create intuitive, engaging digital experiences.',
            'description': 'Professional design services focused on user experience.',
            'long_description': 'We create beautiful, functional interfaces that delight users and drive business results through thoughtful design and user research. Our design process is centered around understanding your users and creating experiences that meet their needs.',
            'icon_emoji': '🎨',
            'image_url': 'https://placehold.co/600x400',
            'features': [
                'User research',
                'Wireframing',
                'Visual design',
                'Responsive design',
                'Usability testing',
                'Accessibility'
            ],
            'detailed_features': [
                {
                    'icon': '🔍',
                    'title': 'User Research',
                    'description': 'In-depth user research to understand your audience and their needs.'
                },
                {
                    'icon': '📐',
                    'title': 'Wireframing',
                    'description': 'Detailed wireframes that map out the structure and flow of your application.'
                },
                {
                    'icon': '🎨',
                    'title': 'Visual Design',
                    'description': 'Beautiful, modern designs that align with your brand and engage your users.'
                },
                {
                    'icon': '📱',
                    'title': 'Responsive Design',
                    'description': 'Designs that work seamlessly across all devices and screen sizes.'
                },
                {
                    'icon': '🧪',
                    'title': 'Usability Testing',
                    'description': 'Testing with real users to validate design decisions and improve usability.'
                },
                {
                    'icon': '♿',
                    'title': 'Accessibility',
                    'description': 'Designs that are accessible to all users, including those with disabilities.'
                }
            ],
            'process_steps': [
                {
                    'step': 1,
                    'title': 'Research',
                    'description': 'We research your users, competitors, and market to inform our design decisions.'
                },
                {
                    'step': 2,
                    'title': 'Wireframing',
                    'description': 'We create wireframes to map out the structure and flow of your application.'
                },
                {
                    'step': 3,
                    'title': 'Design',
                    'description': 'We create high-fidelity designs that bring your vision to life.'
                },
                {
                    'step': 4,
                    'title': 'Testing',
                    'description': 'We test our designs with real users to ensure they meet their needs.'
                }
            ],
            'technologies': [
                {'name': 'Figma', 'icon': '🎨'},
                {'name': 'Sketch', 'icon': '✏️'},
                {'name': 'Adobe XD', 'icon': '🎭'},
                {'name': 'InVision', 'icon': '👁️'},
                {'name': 'Principle', 'icon': '🎬'},
                {'name': 'Framer', 'icon': '🖼️'}
            ],
            'faqs': [
                {
                    'question': 'What is the difference between UI and UX design?',
                    'answer': 'UI (User Interface) design focuses on the visual elements and layout, while UX (User Experience) design focuses on the overall experience and usability of the product.'
                },
                {
                    'question': 'How long does the design process take?',
                    'answer': 'Design timelines vary based on project complexity. Simple projects may take 2-4 weeks, while complex applications can take 2-3 months or more.'
                }
            ],
            'related_services': ['full-stack-development', 'mobile-app-development', 'ai-machine-learning']
        },
        {
            'name': 'AI & Machine Learning',
            'slug': 'ai-machine-learning',
            'summary': 'Harness the power of artificial intelligence to gain insights and automate processes.',
            'description': 'Advanced AI and machine learning solutions for modern businesses.',
            'long_description': 'We help organizations leverage artificial intelligence to automate processes, gain insights from data, and create intelligent applications. Our AI solutions are designed to solve real business problems and drive measurable results.',
            'icon_emoji': '🤖',
            'image_url': 'https://placehold.co/600x400',
            'features': [
                'Predictive analytics',
                'Natural language processing',
                'Computer vision',
                'Recommendation systems',
                'Process automation',
                'Deep learning'
            ],
            'detailed_features': [
                {
                    'icon': '📊',
                    'title': 'Predictive Analytics',
                    'description': 'Use machine learning to predict future trends and make data-driven decisions.'
                },
                {
                    'icon': '💬',
                    'title': 'Natural Language Processing',
                    'description': 'Build chatbots, sentiment analysis, and text processing solutions.'
                },
                {
                    'icon': '👁️',
                    'title': 'Computer Vision',
                    'description': 'Image recognition, object detection, and visual analysis capabilities.'
                },
                {
                    'icon': '🎯',
                    'title': 'Recommendation Systems',
                    'description': 'Personalized recommendations to improve user engagement and sales.'
                },
                {
                    'icon': '🔄',
                    'title': 'Process Automation',
                    'description': 'Automate repetitive tasks and workflows using AI and machine learning.'
                },
                {
                    'icon': '🧠',
                    'title': 'Deep Learning',
                    'description': 'Advanced neural networks for complex pattern recognition and decision making.'
                }
            ],
            'process_steps': [
                {
                    'step': 1,
                    'title': 'Problem Definition',
                    'description': 'We work with you to identify the business problem and define success metrics.'
                },
                {
                    'step': 2,
                    'title': 'Data Analysis',
                    'description': 'We analyze your data to understand its quality and potential for AI solutions.'
                },
                {
                    'step': 3,
                    'title': 'Model Development',
                    'description': 'We develop and train machine learning models tailored to your specific needs.'
                },
                {
                    'step': 4,
                    'title': 'Deployment',
                    'description': 'We deploy the AI solution and integrate it with your existing systems.'
                }
            ],
            'technologies': [
                {'name': 'Python', 'icon': '🐍'},
                {'name': 'TensorFlow', 'icon': '🧠'},
                {'name': 'PyTorch', 'icon': '🔥'},
                {'name': 'Scikit-learn', 'icon': '📊'},
                {'name': 'OpenAI', 'icon': '🤖'},
                {'name': 'Hugging Face', 'icon': '🤗'},
                {'name': 'AWS SageMaker', 'icon': '☁️'},
                {'name': 'Google AI', 'icon': '🌐'}
            ],
            'faqs': [
                {
                    'question': 'Do I need a lot of data to implement AI solutions?',
                    'answer': 'The amount of data needed varies by use case. Some AI solutions can work with smaller datasets, while others require large amounts of data. We help you assess your data and recommend the best approach.'
                },
                {
                    'question': 'How long does it take to develop an AI solution?',
                    'answer': 'Development timelines vary based on complexity. Simple AI solutions can be developed in 1-2 months, while complex systems may take 6+ months.'
                }
            ],
            'related_services': ['full-stack-development', 'cloud-solutions', 'ui-ux-design']
        }
    ]
    
    created_count = 0
    updated_count = 0
    
    for service_data in services_data:
        service, created = Service.objects.get_or_create(
            slug=service_data['slug'],
            defaults=service_data
        )
        
        if created:
            created_count += 1
            print(f"✓ Created service: {service.name}")
        else:
            # Update existing service with new data
            for key, value in service_data.items():
                setattr(service, key, value)
            service.save()
            updated_count += 1
            print(f"✓ Updated service: {service.name}")
    
    print(f"\nServices population completed!")
    print(f"Created: {created_count} services")
    print(f"Updated: {updated_count} services")
    print(f"Total services in database: {Service.objects.count()}")

if __name__ == '__main__':
    print("Populating comprehensive services data...")
    populate_services()