#!/bin/bash
# Production Audit Script for CodingBull
# Comprehensive security and performance audit before deployment

set -e

echo "🔍 CodingBull Production Audit"
echo "=============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ISSUES_FOUND=0

print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

print_check() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((ISSUES_FOUND++))
}

print_error() {
    echo -e "${RED}✗${NC} $1"
    ((ISSUES_FOUND++))
}

# Check for debug code in frontend
check_frontend_debug() {
    print_header "Frontend Debug Code Audit"
    
    cd codingbull-website/src
    
    # Check for console.log statements with intelligent context analysis
    print_check "Analyzing console.log statements with context..."

    # Use our detailed console check script
    if [ -f "../check-console-logs.sh" ]; then
        UNWRAPPED_COUNT=$(../check-console-logs.sh 2>/dev/null | grep -c "❌ UNWRAPPED" || echo "0")
        TOTAL_COUNT=$(../check-console-logs.sh 2>/dev/null | grep -c "File:" || echo "0")

        if [ "$UNWRAPPED_COUNT" -eq 0 ]; then
            print_check "All $TOTAL_COUNT console.log statements properly wrapped or removed"
        else
            print_warning "Found $UNWRAPPED_COUNT unwrapped console.log statements"
        fi
    else
        # Fallback to simple check
        CONSOLE_LOGS=$(grep -r "console\.log" . --exclude-dir=node_modules 2>/dev/null | grep -v -E "(DEBUG_MODE|isDevelopment|config\.features\.enableDebugMode|process\.env\.NODE_ENV.*development|// to log results|removed console.log for production|toString.*native code)" || true)

        if [ -z "$CONSOLE_LOGS" ]; then
            print_check "All console.log statements properly wrapped or removed"
        else
            print_warning "Found potentially unwrapped console.log statements"
        fi
    fi
    
    # Check for console.error statements
    if grep -r "console\.error" . --exclude-dir=node_modules 2>/dev/null | grep -v "DEBUG_MODE\|isDevelopment"; then
        print_warning "Found console.error statements not wrapped in debug checks"
    else
        print_check "Console.error statements properly wrapped"
    fi
    
    # Check for development components
    if find . -name "*Debug*" -o -name "*Test*" | grep -v test.js; then
        print_warning "Found development components that should be removed"
    else
        print_check "No development components found"
    fi
    
    cd ../..
}

# Check for debug code in backend
check_backend_debug() {
    print_header "Backend Debug Code Audit"
    
    cd codingbull_backend
    
    # Check for print statements
    if grep -r "print(" . --include="*.py" | grep -v "security_hardening\|migrate_to_postgresql"; then
        print_warning "Found print statements in backend code"
    else
        print_check "No print statements found"
    fi
    
    # Check for development files
    if ls create_test_data.py fix_testimonials_data.py populate_services.py 2>/dev/null; then
        print_warning "Development files still present (should be in .gitignore)"
    else
        print_check "No development files found"
    fi
    
    cd ..
}

# Check environment configuration
check_environment_config() {
    print_header "Environment Configuration Audit"
    
    # Check frontend production config
    if [ -f "codingbull-website/.env.production" ]; then
        print_check "Frontend production environment file exists"
        
        if grep -q "REACT_APP_ENABLE_DEBUG_MODE=false" codingbull-website/.env.production; then
            print_check "Debug mode disabled in frontend production"
        else
            print_error "Debug mode not properly disabled in frontend production"
        fi
        
        if grep -q "GENERATE_SOURCEMAP=false" codingbull-website/.env.production; then
            print_check "Source maps disabled in production"
        else
            print_error "Source maps not disabled in production"
        fi
    else
        print_error "Frontend production environment file missing"
    fi
    
    # Check backend production config
    if [ -f "codingbull_backend/.env.production" ]; then
        print_check "Backend production environment file exists"
        
        if grep -q "DJANGO_DEBUG=False" codingbull_backend/.env.production; then
            print_check "Django debug mode disabled in production"
        else
            print_error "Django debug mode not disabled in production"
        fi
        
        if grep -q "postgresql://" codingbull_backend/.env.production; then
            print_check "PostgreSQL configured for production"
        else
            print_error "PostgreSQL not configured for production"
        fi
    else
        print_error "Backend production environment file missing"
    fi
}

# Check security configuration
check_security_config() {
    print_header "Security Configuration Audit"
    
    # Check if secret key is not default
    if grep -q "dev-secret-key\|prod-secret-key-will-be-generated" codingbull_backend/.env.production; then
        print_error "Production secret key not generated"
    else
        print_check "Production secret key appears to be set"
    fi
    
    # Check HTTPS settings
    if grep -q "SECURE_SSL_REDIRECT=True" codingbull_backend/.env.production; then
        print_check "HTTPS redirect enabled"
    else
        print_warning "HTTPS redirect not enabled"
    fi
    
    # Check CORS settings
    if grep -q "https://" codingbull_backend/.env.production | grep -q "CORS_ALLOWED_ORIGINS"; then
        print_check "CORS configured for HTTPS"
    else
        print_warning "CORS not properly configured for HTTPS"
    fi
}

# Check dependencies
check_dependencies() {
    print_header "Dependencies Audit"
    
    # Check if PostgreSQL dependencies are present
    if grep -q "psycopg2-binary" requirements.txt; then
        print_check "PostgreSQL driver included"
    else
        print_error "PostgreSQL driver missing from requirements.txt"
    fi
    
    # Check if production server is included
    if grep -q "gunicorn" requirements.txt; then
        print_check "Production server (Gunicorn) included"
    else
        print_error "Production server missing from requirements.txt"
    fi
    
    # Check frontend dependencies
    cd codingbull-website
    if npm audit --audit-level=high --production 2>/dev/null; then
        print_check "No high-severity vulnerabilities in frontend dependencies"
    else
        print_warning "High-severity vulnerabilities found in frontend dependencies"
    fi
    cd ..
}

# Check build configuration
check_build_config() {
    print_header "Build Configuration Audit"
    
    # Check if build scripts are optimized
    if grep -q "GENERATE_SOURCEMAP=false" codingbull-website/package.json; then
        print_check "Production build disables source maps"
    else
        print_warning "Production build should disable source maps"
    fi
    
    # Check if optimization script exists
    if [ -f "codingbull-website/scripts/optimize-build.js" ]; then
        print_check "Build optimization script exists"
    else
        print_warning "Build optimization script missing"
    fi
    
    # Check deployment configuration
    # Check that Cloudflare/Koyeb dependencies have been removed
    if [ -f "codingbull-website/_redirects" ]; then
        print_warning "Cloudflare Pages redirects file still exists - should be removed for Hostinger VPS deployment"
    else
        print_check "Cloudflare Pages redirects properly removed"
    fi

    if [ -f "deploy.sh" ] && grep -q "cloudflare\|koyeb" deploy.sh 2>/dev/null; then
        print_warning "Old Cloudflare/Koyeb deployment script still active - should be replaced with deploy-hostinger.sh"
    else
        print_check "Cloudflare/Koyeb deployment dependencies removed"
    fi
    
    # Check for Hostinger VPS native deployment configuration
    if [ -f "deploy-hostinger.sh" ]; then
        print_check "Hostinger VPS deployment script exists"
    else
        print_warning "Hostinger VPS deployment script missing"
    fi

    if [ -f "nginx.conf" ]; then
        print_check "Nginx configuration exists"
    else
        print_warning "Nginx configuration missing"
    fi

    if [ -f "codingbull-gunicorn.service" ]; then
        print_check "Systemd service configuration exists"
    else
        print_warning "Systemd service configuration missing"
    fi
}

# Check file permissions and structure
check_file_structure() {
    print_header "File Structure Audit"
    
    # Check if sensitive files are properly ignored
    if grep -q "\.env" .gitignore; then
        print_check "Environment files properly ignored"
    else
        print_error "Environment files not in .gitignore"
    fi
    
    # Check if database files are ignored
    if grep -q "db\.sqlite3" .gitignore; then
        print_check "Database files properly ignored"
    else
        print_warning "Database files not in .gitignore"
    fi
    
    # Check if deployment script is executable
    if [ -x "deploy.sh" ]; then
        print_check "Deployment script is executable"
    else
        print_warning "Deployment script not executable"
    fi
}

# Performance checks
check_performance() {
    print_header "Performance Configuration Audit"
    
    # Check if lazy loading is configured
    if grep -q "REACT_APP_LAZY_LOADING_THRESHOLD" codingbull-website/.env.production; then
        print_check "Lazy loading configured"
    else
        print_warning "Lazy loading not configured"
    fi
    
    # Check if image optimization is enabled
    if grep -q "REACT_APP_IMAGE_OPTIMIZATION=true" codingbull-website/.env.production; then
        print_check "Image optimization enabled"
    else
        print_warning "Image optimization not enabled"
    fi
    
    # Check if caching is configured
    if grep -q "REACT_APP_CACHE_DURATION" codingbull-website/.env.production; then
        print_check "Caching configuration present"
    else
        print_warning "Caching not configured"
    fi
}

# Run all checks
main() {
    echo "Starting comprehensive production audit..."
    
    check_frontend_debug
    check_backend_debug
    check_environment_config
    check_security_config
    check_dependencies
    check_build_config
    check_file_structure
    check_performance
    
    echo ""
    echo "=============================="
    
    if [ $ISSUES_FOUND -eq 0 ]; then
        echo -e "${GREEN}🎉 All checks passed! Ready for production deployment.${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠ Found $ISSUES_FOUND issues that should be addressed before deployment.${NC}"
        echo ""
        echo "Recommendations:"
        echo "1. Fix all errors (✗) before deploying"
        echo "2. Address warnings (⚠) for optimal security and performance"
        echo "3. Run this audit again after fixes"
        echo "4. Test in staging environment before production"
        exit 1
    fi
}

main
