# 🔧 Environment Configuration Guide

## Overview

This project uses an intelligent environment configuration system that automatically switches between development and production settings without requiring manual code changes.

## 📁 Environment Files Structure

```
codingbull-website/
├── .env                    # Default/fallback configuration
├── .env.development        # Development-specific settings
├── .env.production         # Production-specific settings
├── .env.template          # Template for creating new environments
└── scripts/switch-env.js   # Environment switching utility

codingbull_backend/
├── .env                    # Default/fallback configuration
├── .env.development        # Development-specific settings
├── .env.production.template # Production template
└── security_hardening.py   # Security validation script
```

## 🚀 Quick Start

### For Development (Local)
```bash
# Frontend
cd codingbull-website
npm run env:dev          # Switch to development environment
npm run start:dev        # Start with development settings

# Backend
cd codingbull_backend
# The .env file is already configured for development by default
python manage.py runserver
```

### For Production Deployment
```bash
# Frontend
cd codingbull-website
npm run env:prod         # Switch to production environment
npm run build:prod       # Build with production settings

# Backend
cd codingbull_backend
# Copy and customize the production template
cp .env.production.template .env.production
# Edit .env.production with your actual values
# Then copy to .env for deployment
cp .env.production .env
```

## 🔄 Environment Switching

### Frontend Environment Switching

#### Using NPM Scripts (Recommended)
```bash
# Switch environments
npm run env:dev          # Switch to development
npm run env:prod         # Switch to production
npm run env:status       # Check current environment

# Start with specific environment
npm run start:dev        # Development mode
npm run start:prod       # Production mode (for testing)

# Build with specific environment
npm run build:dev        # Development build
npm run build:prod       # Production build
```

#### Using the Switch Script Directly
```bash
# Check current environment
node scripts/switch-env.js status

# Switch environments
node scripts/switch-env.js development
node scripts/switch-env.js production

# Show help
node scripts/switch-env.js help
```

### Backend Environment Switching

#### Manual Method
```bash
# For development
cp .env.development .env

# For production
cp .env.production .env
```

## ⚙️ Configuration Details

### Frontend Configuration

#### Development Settings (.env.development)
- **API URL**: `http://localhost:8000/api/v1`
- **Debug Mode**: Enabled
- **Source Maps**: Enabled
- **Analytics**: Disabled
- **Mock Fallback**: Enabled
- **Cache Duration**: 0 (no caching)

#### Production Settings (.env.production)
- **API URL**: `https://api.codingbullz.com/api/v1`
- **Debug Mode**: Disabled
- **Source Maps**: Disabled
- **Analytics**: Enabled
- **Mock Fallback**: Disabled
- **Cache Duration**: 3600 seconds

### Backend Configuration

#### Development Settings (.env.development)
- **Debug**: True
- **Allowed Hosts**: localhost, 127.0.0.1
- **Database**: SQLite (development)
- **SSL**: Disabled
- **Log Level**: DEBUG

#### Production Settings (.env.production)
- **Debug**: False
- **Allowed Hosts**: Your domain only
- **Database**: PostgreSQL/MySQL (recommended)
- **SSL**: Enabled
- **Log Level**: WARNING

## 🔍 Environment Detection

The system automatically detects the environment using:

1. **REACT_APP_ENV** environment variable (highest priority)
2. **NODE_ENV** environment variable
3. **Default to development** if neither is set

### Environment-Specific Features

| Feature | Development | Production |
|---------|-------------|------------|
| Debug Logging | ✅ Enabled | ❌ Disabled |
| Source Maps | ✅ Generated | ❌ Disabled |
| Analytics | ❌ Disabled | ✅ Enabled |
| Mock API Fallback | ✅ Enabled | ❌ Disabled |
| Error Reporting | ✅ Console | ✅ External Service |
| Performance Monitoring | ✅ Basic | ✅ Full |
| Security Headers | 🔶 Relaxed | ✅ Strict |

## 🛠️ Customization

### Adding New Environments

1. **Create environment file**:
   ```bash
   # Frontend
   cp .env.template .env.staging
   
   # Backend
   cp .env.development .env.staging
   ```

2. **Update environment detection** in `src/config/environment.js`:
   ```javascript
   const environmentDefaults = {
     development: { /* ... */ },
     staging: { /* your staging config */ },
     production: { /* ... */ }
   };
   ```

3. **Add to switching script**:
   ```javascript
   const ENVIRONMENTS = ['development', 'staging', 'production'];
   ```

### Environment Variables Reference

#### Frontend Variables
```bash
# Core Configuration
NODE_ENV=development|production|test
REACT_APP_ENV=development|production|test
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
REACT_APP_API_TIMEOUT=10000

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true|false
REACT_APP_ENABLE_DEBUG_MODE=true|false
REACT_APP_ENABLE_MOCK_FALLBACK=true|false

# Build Configuration
GENERATE_SOURCEMAP=true|false
REACT_APP_BUILD_VERSION=1.0.0
```

#### Backend Variables
```bash
# Core Configuration
DJANGO_SECRET_KEY=your-secret-key
DJANGO_ENV=development|production
DJANGO_DEBUG=True|False
DJANGO_ALLOWED_HOSTS=localhost,yourdomain.com

# Database
DATABASE_URL=sqlite:///db.sqlite3
# or
DATABASE_URL=postgresql://user:pass@localhost/db

# Security
SECURE_SSL_REDIRECT=True|False
SESSION_COOKIE_SECURE=True|False
CSRF_COOKIE_SECURE=True|False
```

## 🚨 Security Considerations

### Development Environment
- Uses relaxed security settings for easier development
- Allows localhost and local network access
- Debug information is visible
- Source maps are generated

### Production Environment
- Strict security headers enabled
- HTTPS enforcement
- Debug information hidden
- Source maps disabled
- Restricted CORS origins

## 🔧 Troubleshooting

### Common Issues

1. **Wrong API URL being used**
   ```bash
   # Check current environment
   npm run env:status
   
   # Switch to correct environment
   npm run env:dev  # or env:prod
   ```

2. **Environment not switching**
   ```bash
   # Clear React cache
   rm -rf node_modules/.cache
   
   # Restart development server
   npm start
   ```

3. **Backend not using correct settings**
   ```bash
   # Check which .env file is being used
   cd codingbull_backend
   python -c "import os; print('DJANGO_ENV:', os.environ.get('DJANGO_ENV', 'Not set'))"
   ```

### Validation Commands

```bash
# Frontend: Check configuration
npm run env:status

# Backend: Run security check
cd codingbull_backend
python security_hardening.py

# Verify API connectivity
curl http://localhost:8000/api/v1/
```

## 📋 Deployment Checklist

### Before Production Deployment

1. **Frontend**:
   - [ ] Switch to production environment: `npm run env:prod`
   - [ ] Update API URLs in `.env.production`
   - [ ] Build for production: `npm run build:prod`
   - [ ] Verify no debug information in build

2. **Backend**:
   - [ ] Create `.env.production` from template
   - [ ] Generate new SECRET_KEY
   - [ ] Set DEBUG=False
   - [ ] Configure production database
   - [ ] Enable SSL settings
   - [ ] Run security check: `python security_hardening.py`

3. **Testing**:
   - [ ] Test in staging environment
   - [ ] Verify API connectivity
   - [ ] Check security headers
   - [ ] Validate error handling

## 🎯 Best Practices

1. **Never commit sensitive .env files** to version control
2. **Use environment templates** for sharing configuration structure
3. **Validate environment** before deployment
4. **Test environment switching** regularly
5. **Keep development and production configs in sync** (structure-wise)
6. **Use the switching scripts** instead of manual file copying
7. **Document any custom environment variables** you add

---

## 🆘 Need Help?

If you encounter issues with environment configuration:

1. Check the current environment: `npm run env:status`
2. Verify environment files exist and have correct permissions
3. Restart development servers after switching environments
4. Check browser console for configuration logs (in development)
5. Run security validation: `python security_hardening.py`
