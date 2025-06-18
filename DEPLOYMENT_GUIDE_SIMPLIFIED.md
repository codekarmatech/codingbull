# 🚀 CodingBull Deployment Guide

## 📋 Quick Overview

**Project Structure:**
- **Frontend:** React app in `codingbull-website/`
- **Backend:** Django API in `codingbull_backend/`
- **Database:** PostgreSQL (bulldb/bulldb/Bull@2747.)

**Deployment Targets:**
- **Frontend:** Cloudflare Pages → https://codingbullz.com
- **Backend:** Koyeb VPS → https://api.codingbullz.com
- **Domain:** Managed via Hostinger.com

---

## 🔧 Phase 1: Pre-deployment Setup

### 1.1 Environment Configuration

**Backend Setup:**
```bash
cd codingbull_backend

# Generate secret key
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Create production environment
cp .env .env.production
# Edit .env.production with:
# - Generated secret key
# - DJANGO_DEBUG=False
# - Production database URL
# - CORS_ALLOWED_ORIGINS=https://codingbullz.com
```

**Frontend Setup:**
```bash
cd codingbull-website
npm run env:prod
npm run build:prod
```

### 1.2 Database Migration

**Setup PostgreSQL** (choose one):
- **Aiven:** [aiven.io](https://aiven.io) (Free 1 month)
- **ElephantSQL:** [elephantsql.com](https://elephantsql.com) (Free tier)
- **Railway:** [railway.app](https://railway.app) ($5 credit monthly)

**Migrate Data:**
```bash
cd codingbull_backend
cp .env.production .env
python migrate_to_postgresql.py
```

---

## 🌐 Phase 2: Domain Configuration

### 2.1 DNS Setup (Hostinger.com)

1. Login to [hostinger.com](https://hostinger.com)
2. Go to Domains → Manage codingbullz.com → DNS Zone
3. Add these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | @ | codingbull-website.pages.dev | 3600 |
| CNAME | www | codingbull-website.pages.dev | 3600 |
| CNAME | api | codingbull-backend.koyeb.app | 3600 |

---

## 🚀 Phase 3: Backend Deployment (Koyeb)

### 3.1 Koyeb Setup

1. **Sign up:** [koyeb.com](https://koyeb.com)
2. **Create App:** Connect GitHub repository
3. **Configure Service:**
   - **App name:** `codingbull-backend`
   - **Build directory:** `codingbull_backend`
   - **Build command:** `pip install -r ../requirements.txt`
   - **Run command:** `gunicorn codingbull_api.wsgi:application --bind 0.0.0.0:8000`
   - **Port:** `8000`

4. **Environment Variables:**
```
DJANGO_SECRET_KEY=your-generated-key
DJANGO_ENV=production
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=codingbull-backend.koyeb.app,api.codingbullz.com
DATABASE_URL=your-postgresql-url
CORS_ALLOWED_ORIGINS_PRODUCTION=https://codingbullz.com,https://www.codingbullz.com
```

5. **Add Custom Domain:** `api.codingbullz.com`

---

## 🌟 Phase 4: Frontend Deployment (Cloudflare Pages)

### 4.1 Cloudflare Pages Setup

1. **Sign up:** [cloudflare.com](https://cloudflare.com)
2. **Create Project:** Connect GitHub repository
3. **Configure Build:**
   - **Project name:** `codingbull-website`
   - **Build directory:** `codingbull-website`
   - **Build command:** `npm run build:prod`
   - **Output directory:** `build`

4. **Environment Variables:**
```
REACT_APP_ENV=production
REACT_APP_API_BASE_URL=https://api.codingbullz.com/api/v1
REACT_APP_ENABLE_DEBUG_MODE=false
GENERATE_SOURCEMAP=false
```

5. **Add Custom Domain:** `codingbullz.com`

---

## ✅ Phase 5: Testing & Verification

### 5.1 API Testing
```bash
# Test API endpoints
curl https://api.codingbullz.com/api/v1/
curl https://api.codingbullz.com/api/v1/projects/
curl https://api.codingbullz.com/api/v1/services/
```

### 5.2 Frontend Testing
- Visit https://codingbullz.com
- Test all pages and functionality
- Verify mobile responsiveness
- Check contact form submission

---

## 🔧 Quick Commands Reference

**Pre-deployment:**
```bash
# Backend
cd codingbull_backend
python manage.py check --deploy
python security_hardening.py

# Frontend
cd codingbull-website
npm run build:prod
npm run build:prod:analyze
```

**Production URLs:**
- **Website:** https://codingbullz.com
- **API:** https://api.codingbullz.com/api/v1/
- **Admin:** https://api.codingbullz.com/admin/

---

## 🚨 Troubleshooting

**CORS Errors:** Check CORS_ALLOWED_ORIGINS in backend environment
**API Not Loading:** Verify DNS propagation and API endpoint URL
**Build Failures:** Check platform build logs and environment variables
**Database Issues:** Verify DATABASE_URL format and PostgreSQL service

---

## 📞 Post-Deployment

1. Monitor for 24-48 hours
2. Set up database backups
3. Configure monitoring alerts
4. Plan scaling strategy

**Need help?** Check platform documentation or review error logs.
