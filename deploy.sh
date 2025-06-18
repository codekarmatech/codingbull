#!/bin/bash
# CodingBull Production Deployment Script
# Automated deployment to Cloudflare Pages (Frontend) and Koyeb VPS (Backend)

set -e  # Exit on any error

echo "🚀 CodingBull Production Deployment"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check if Python is installed
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed"
        exit 1
    fi
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Generate production secret key
generate_secret_key() {
    print_status "Generating production secret key..."
    
    cd codingbull_backend
    SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
    
    # Update production environment file
    sed -i.bak "s/prod-secret-key-will-be-generated-during-deployment/$SECRET_KEY/" .env.production
    
    print_success "Production secret key generated and updated"
    cd ..
}

# Run security hardening check
run_security_check() {
    print_status "Running security hardening check..."
    
    cd codingbull_backend
    
    # Copy production environment for testing
    cp .env.production .env.temp
    
    # Run security check
    if python3 security_hardening.py; then
        print_success "Security check passed"
    else
        print_error "Security check failed. Please fix issues before deployment."
        rm .env.temp
        exit 1
    fi
    
    rm .env.temp
    cd ..
}

# Build frontend for production
build_frontend() {
    print_status "Building frontend for production..."
    
    cd codingbull-website
    
    # Install dependencies
    npm ci --production=false
    
    # Build for production
    npm run build:prod
    
    print_success "Frontend build completed"
    cd ..
}

# Prepare backend for deployment
prepare_backend() {
    print_status "Preparing backend for deployment..."
    
    cd codingbull_backend
    
    # Install production dependencies
    pip3 install -r ../requirements.txt
    
    # Run database migrations (dry run)
    print_status "Testing database migrations..."
    python3 manage.py migrate --dry-run
    
    # Collect static files
    python3 manage.py collectstatic --noinput --dry-run
    
    print_success "Backend preparation completed"
    cd ..
}

# Deploy to Cloudflare Pages
deploy_frontend() {
    print_status "Deploying frontend to Cloudflare Pages..."
    
    cd codingbull-website
    
    # Check if wrangler is installed
    if ! command -v wrangler &> /dev/null; then
        print_warning "Wrangler CLI not found. Installing..."
        npm install -g wrangler
    fi
    
    # Deploy to Cloudflare Pages
    print_status "Uploading to Cloudflare Pages..."
    print_warning "Manual step required: Upload the 'build' directory to Cloudflare Pages dashboard"
    print_warning "Or use: wrangler pages publish build --project-name=codingbull-website"
    
    cd ..
}

# Deploy backend to Koyeb
deploy_backend() {
    print_status "Preparing backend deployment to Koyeb..."
    
    print_warning "Manual steps required for Koyeb deployment:"
    echo "1. Create a new app on Koyeb dashboard"
    echo "2. Connect your GitHub repository"
    echo "3. Set the working directory to 'codingbull_backend'"
    echo "4. Configure environment variables from .env.production"
    echo "5. Set build command: pip install -r ../requirements.txt && python manage.py collectstatic --noinput"
    echo "6. Set run command: gunicorn codingbull_api.wsgi:application --bind 0.0.0.0:8000"
}

# Database migration
migrate_database() {
    print_status "Database migration information..."
    
    print_warning "Database migration steps:"
    echo "1. Set up PostgreSQL database with credentials:"
    echo "   - Database: bulldb"
    echo "   - Username: bulldb"
    echo "   - Password: Bull@2747."
    echo "2. Run: cd codingbull_backend && python3 migrate_to_postgresql.py"
    echo "3. Verify data migration completed successfully"
}

# Create deployment summary
create_deployment_summary() {
    print_status "Creating deployment summary..."
    
    cat > DEPLOYMENT_SUMMARY.md << EOF
# CodingBull Production Deployment Summary

## Deployment Date
$(date)

## Frontend Deployment (Cloudflare Pages)
- **URL**: https://codingbullz.com
- **Build Directory**: codingbull-website/build
- **Environment**: Production
- **Features Enabled**:
  - Analytics: Enabled
  - Debug Mode: Disabled
  - Source Maps: Disabled
  - Performance Monitoring: Enabled

## Backend Deployment (Koyeb VPS)
- **URL**: https://codingbull-backend.koyeb.app
- **Environment**: Production
- **Database**: PostgreSQL
- **Security**: HTTPS enforced, security headers enabled

## Database Configuration
- **Type**: PostgreSQL
- **Database**: bulldb
- **Username**: bulldb
- **Host**: localhost
- **Port**: 5432

## Security Measures Implemented
- ✅ Debug mode disabled in production
- ✅ Secret key generated for production
- ✅ HTTPS enforced
- ✅ Security headers enabled
- ✅ CORS properly configured
- ✅ Console logs removed from production
- ✅ Development components removed

## Performance Optimizations
- ✅ Source maps disabled
- ✅ Bundle optimization enabled
- ✅ Static asset caching configured
- ✅ Gzip compression enabled
- ✅ Image optimization ready

## Post-Deployment Checklist
- [ ] Verify frontend loads at https://codingbullz.com
- [ ] Verify API endpoints work
- [ ] Test contact form functionality
- [ ] Verify database connectivity
- [ ] Check error monitoring
- [ ] Test responsive design on mobile devices
- [ ] Verify analytics tracking
- [ ] Test all page routes
- [ ] Check performance metrics
- [ ] Verify security headers

## Environment Variables to Set
### Frontend (Cloudflare Pages)
- REACT_APP_API_BASE_URL=https://codingbull-backend.koyeb.app/api/v1
- REACT_APP_ENV=production
- REACT_APP_ENABLE_DEBUG_MODE=false

### Backend (Koyeb VPS)
- DJANGO_ENV=production
- DJANGO_DEBUG=False
- DATABASE_URL=postgresql://bulldb:Bull@2747.@localhost:5432/bulldb
- DJANGO_ALLOWED_HOSTS=codingbull-backend.koyeb.app,codingbullz.com,www.codingbullz.com

## Support Information
- **Repository**: https://github.com/your-username/codingbull
- **Documentation**: See README.md and ENVIRONMENT_SETUP.md
- **Security**: See SECURITY_DEPLOYMENT_CHECKLIST.md
EOF

    print_success "Deployment summary created: DEPLOYMENT_SUMMARY.md"
}

# Main deployment process
main() {
    print_status "Starting CodingBull production deployment process..."
    
    check_prerequisites
    generate_secret_key
    run_security_check
    build_frontend
    prepare_backend
    create_deployment_summary
    
    echo ""
    print_success "🎉 Pre-deployment preparation completed successfully!"
    echo ""
    print_warning "Next steps (manual):"
    echo "1. Set up PostgreSQL database and run migration"
    echo "2. Deploy frontend to Cloudflare Pages"
    echo "3. Deploy backend to Koyeb VPS"
    echo "4. Configure domain DNS settings"
    echo "5. Test the deployed application"
    echo ""
    print_status "See DEPLOYMENT_SUMMARY.md for detailed instructions"
}

# Run main function
main
