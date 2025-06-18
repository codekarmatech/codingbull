# 🐂 CodingBull Company Website

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-5.2.1-green.svg)](https://djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.x-yellow.svg)](https://python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Dev%20Tools-brightgreen.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Proprietary-red.svg)]()

**Official CodingBull company website** - A full-stack platform showcasing our development services, client projects, and technical expertise. Built to demonstrate enterprise-grade architecture with advanced security monitoring and performance optimizations.

## 🏢 About This Project

This is **CodingBull's proprietary company website** that serves multiple purposes:
- **Client Portfolio** - Showcases our completed projects and case studies
- **Service Marketing** - Details our full-stack development offerings  
- **Lead Generation** - Contact forms and client communication system
- **Technical Showcase** - Demonstrates our development capabilities
- **Business Credibility** - Professional online presence for CodingBull

## 🏗️ Architecture Overview

```
codingbull/
├── codingbull-website/          # React Frontend (Client-facing)
│   ├── src/
│   │   ├── components/          # UI Components (Hero, Services, Projects)
│   │   ├── pages/              # Main Pages (Home, About, Contact)
│   │   ├── hooks/              # Custom React Hooks
│   │   ├── services/           # API Communication Layer
│   │   ├── styles/             # Styled-components & Themes
│   │   └── data/               # Static Content & Constants
│   └── package.json            # Frontend Dependencies
├── codingbull_backend/         # Django API (Business Logic)
│   ├── api/                    # Core API Application
│   │   ├── models.py           # Database Models (Projects, Services, Blog)
│   │   ├── views.py            # API Endpoints & Business Logic
│   │   ├── serializers.py      # Data Serialization
│   │   └── middleware.py       # Custom Security Middleware
│   ├── media/                  # Client Logos & Project Images
│   └── manage.py               # Django Management
├── DEPLOYMENT_GUIDE_SIMPLIFIED.md  # Production Deployment Guide
├── audit-production.sh         # Production Audit Script
├── deploy.sh                   # Automated Deployment Script
└── requirements.txt            # Python Dependencies
```

## 🎯 Business Features

### Client-Facing Features
- **Professional Portfolio** - Real client projects with detailed case studies
- **Service Showcase** - Full-stack development services we offer
- **Client Testimonials** - Authentic feedback from satisfied clients
- **Technical Blog** - Thought leadership and development insights
- **Contact System** - Lead capture and client communication
- **Responsive Design** - Perfect on all devices (mobile-first)

### Business Intelligence
- **Security Dashboard** - Real-time threat monitoring for enterprise clients
- **Performance Analytics** - Web vitals and user experience metrics
- **Lead Tracking** - Contact form submissions and client inquiries
- **Content Management** - Easy updates for projects, services, and blog posts

## 🚀 Development Setup

### Prerequisites
- **Node.js** (Latest LTS) - *For React development tools only*
- **Python 3.8+** - Backend runtime
- **pip** - Python package manager
- **Git** - Version control

### Frontend Development

```bash
# Navigate to React frontend
cd codingbull-website

# Install all dependencies
npm install

# Start development server (http://localhost:3000)
npm start

# Build for production deployment
npm run build

# Analyze bundle size and performance
npm run analyze
```

### Backend Development

```bash
# Navigate to Django backend
cd codingbull_backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# Install Python dependencies
pip install -r ../requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your specific configuration

# Run database migrations
python manage.py migrate

# Create admin superuser (optional)
python manage.py createsuperuser

# Start Django development server (http://localhost:8000)
python manage.py runserver
```

## ⚙️ Configuration & Environment

### Environment Setup

Create `.env` file in `codingbull_backend/` directory:

```env
# Django Core Settings
DJANGO_SECRET_KEY=your-production-secret-key
DJANGO_ENV=development  # or 'production'
DJANGO_DEBUG=True       # False for production
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,codingbullz.com

# Database (SQLite for dev, PostgreSQL for production)
DATABASE_URL=postgresql://user:password@localhost:5432/codingbull_db

# CORS Settings (Frontend URLs)
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://codingbullz.com

# Email Configuration (Contact form submissions)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=contact@codingbullz.com
EMAIL_HOST_PASSWORD=your-app-specific-password

# Error Monitoring
SENTRY_DSN=your-sentry-dsn-for-production-errors
```

### Production Deployment Notes
- Frontend builds to static files (served via CDN/Nginx)
- Backend runs on Django + Gunicorn + Nginx
- Database: PostgreSQL for production
- Media files: AWS S3 or similar for client logos/project images

## 📡 API Reference

### Business Content APIs
- `GET /api/services/` - All CodingBull services
- `GET /api/services/{slug}/` - Specific service details
- `GET /api/projects/` - Client project portfolio
- `GET /api/projects/{slug}/` - Project case study
- `GET /api/blog-posts/` - Technical blog posts
- `GET /api/testimonials/` - Client testimonials
- `POST /api/contact/` - Contact form submission

### Security & Monitoring APIs
- `GET /api/security/dashboard/` - Security monitoring dashboard
- `GET /api/security/logs/` - Security event logs
- `GET /api/security/alerts/` - Active security alerts
- `POST /api/security/block-ip/` - Block malicious IPs

## 🎨 Frontend Components

### Business Components
- **Hero** - Main landing section with CodingBull branding
- **Services** - Our development service offerings
- **OurProjects** - Client project showcase with case studies
- **Testimonials** - Real client feedback carousel
- **TechStack** - Technologies we specialize in
- **ContactForm** - Lead generation and client inquiries

### Technical Components
- **Navbar** - Responsive navigation with mobile menu
- **Footer** - Company info and contact details
- **ErrorBoundary** - Graceful error handling
- **LazyImage** - Optimized loading for project images
- **SEO** - Meta tags for search engine optimization
- **FluidBackground** - Animated visual effects

### Custom Hooks
- **useIntersectionObserver** - Scroll-triggered animations

## 🔒 Enterprise Security System

### Custom Security Features
- **Real-time Threat Detection** - Custom middleware monitors suspicious activity
- **IP Reputation System** - Automatic blocking of malicious IPs
- **Rate Limiting** - Prevents abuse and DDoS attacks
- **Advanced Logging** - Comprehensive security event tracking
- **Client Dashboard** - Security monitoring for enterprise clients

### Standard Security Measures
- Content Security Policy (CSP) headers
- XSS protection and input sanitization
- CSRF protection on all forms
- Secure file upload handling
- HTTPS enforcement in production

## 🚀 Performance & Optimization

### Frontend Performance
- **Code Splitting** - React.lazy() for optimal loading
- **Image Optimization** - Lazy loading for client project images
- **Bundle Analysis** - Source map explorer for size optimization
- **Animation Performance** - Framer Motion with hardware acceleration
- **Web Vitals Monitoring** - Real-time performance tracking

### Backend Performance
- **Database Optimization** - Efficient queries for projects/services
- **API Serialization** - Optimized data transfer
- **Media Handling** - Compressed images for client logos
- **Caching Strategy** - Redis for frequently accessed data

## 🧠 Technical Architecture Decisions

### Why This Stack?
- **React 19.1.0** - Latest features, better performance, modern development
- **Django 5.2.1** - Robust backend, excellent security, rapid API development
- **Styled Components** - Component-scoped styling, consistent theming
- **Framer Motion** - Professional animations, smooth user experience
- **Custom Security** - Enterprise-grade protection built from scratch

### Key Implementation Choices
- **Mobile-First Design** - Responsive across all devices
- **SEO Optimization** - React Helmet for search engine visibility
- **Error Handling** - Sentry integration for production monitoring
- **API Design** - RESTful endpoints with proper serialization
- **Environment Configuration** - Separate dev/production settings

## 🧪 Testing & Quality Assurance

### Frontend Testing
```bash
cd codingbull-website
npm test                    # Run React component tests
npm run test:coverage      # Generate coverage report
```

### Backend Testing
```bash
cd codingbull_backend
python manage.py test      # Run Django API tests
python manage.py test --coverage  # With coverage
```

## 🚀 Production Deployment

**For complete deployment instructions, see:** [`DEPLOYMENT_GUIDE_SIMPLIFIED.md`](./DEPLOYMENT_GUIDE_SIMPLIFIED.md)

### Quick Deployment Overview
- **Frontend**: Cloudflare Pages → https://codingbullz.com
- **Backend**: Koyeb VPS → https://api.codingbullz.com
- **Database**: PostgreSQL (Aiven/ElephantSQL/Railway)
- **Domain**: Managed via Hostinger.com

### Deployment Scripts
```bash
# Run production audit
./audit-production.sh

# Automated deployment preparation
./deploy.sh
```

### Production URLs
- **Website**: https://codingbullz.com
- **API**: https://api.codingbullz.com/api/v1/
- **Admin**: https://api.codingbullz.com/admin/

## 🔐 Proprietary CodingBull Software

**⚠️ CONFIDENTIAL - This is proprietary software owned by CodingBull**

### Important Security Notes
- Contains real client project data and testimonials
- Includes proprietary business logic and algorithms
- Security configurations and API keys are environment-specific
- Media files contain actual client logos and project screenshots
- All code and content is confidential and proprietary

### Repository Access
- **Private Repository** - No public contributions accepted
- **Internal Use Only** - CodingBull team members only
- **Client Demos** - May be shown to potential clients for capability demonstration
- **No Open Source** - All rights reserved

## 📞 CodingBull Company Information

**Official Company Website Repository**

- **Live Website**: [codingbullz.com](https://codingbullz.com)
- **Business Inquiries**: contact@codingbullz.com
- **Technical Support**: Available for clients only
- **Company Owner**: Pranshu Dixit
- **Repository Purpose**: Company website and client portfolio showcase

## 📋 Development Notes

### For Future Reference
- **Database Models**: Projects, Services, BlogPosts, Testimonials, ContactSubmissions
- **Media Management**: Client logos stored in `/media/clients/`
- **Security Dashboard**: Real-time monitoring at `/api/security/dashboard/`
- **Contact Forms**: Lead generation system with email notifications
- **Blog System**: Technical content management for thought leadership

### Key Files to Remember
- `codingbull_backend/api/models.py` - All database models
- `codingbull_backend/api/middleware.py` - Custom security middleware
- `codingbull-website/src/components/` - All React components
- `codingbull-website/src/data/` - Static content and configuration

---

**© 2024 CodingBull - All Rights Reserved**  
*Built with expertise by the CodingBull development team*