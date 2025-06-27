# 🚀 CodingBull Deployment Guide - Hostinger VPS

## 📋 Quick Overview

**Project Structure:**
- **Frontend:** React app in `codingbull-website/`
- **Backend:** Django API in `codingbull_backend/`
- **Database:** PostgreSQL (Local on VPS)

**Deployment Target:**
- **Platform:** Hostinger VPS (Ubuntu)
- **Frontend:** Nginx static file serving → https://codingbullz.com
- **Backend:** Gunicorn + Nginx reverse proxy → https://api.codingbullz.com
- **Database:** PostgreSQL (Local installation on VPS)
- **Domain:** Managed via Hostinger.com

---

## 🔧 Phase 1: VPS Setup & Prerequisites

### 1.1 Hostinger VPS Initial Setup

**Connect to your VPS:**
```bash
ssh root@31.97.61.151
```

**Update system and install dependencies:**
```bash
# Update system packages
apt update && apt upgrade -y

# Install required packages
apt install -y python3 python3-pip python3-venv nginx postgresql postgresql-contrib git curl ufw

# Install Node.js (for frontend build)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Create application user
adduser --disabled-password --gecos '' codingbull
usermod -aG sudo codingbull
```

### 1.2 PostgreSQL Database Setup

**Configure PostgreSQL:**
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE bulldb;
CREATE USER bulldb WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE bulldb TO bulldb;
ALTER USER bulldb CREATEDB;
\q

# Configure PostgreSQL for local connections
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Add: local   bulldb   bulldb   md5

# Restart PostgreSQL
systemctl restart postgresql
systemctl enable postgresql
```

### 1.3 Environment Configuration

**Backend Setup:**
```bash
# Switch to application user
su - codingbull

# Clone repository (replace with your repo URL)
git clone https://github.com/your-username/codingbull.git
cd codingbull/codingbull_backend

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r ../requirements.txt

# Generate secret key
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Update .env.production with VPS-specific settings
cp .env.production .env.hostinger
# Edit .env.hostinger with your VPS domain and generated secret key
```

**Frontend Setup:**
```bash
cd ../codingbull-website

# Install Node.js dependencies
npm ci --production=false

# Build for production
npm run build:prod
```

---

## 🌐 Phase 2: Domain Configuration

### 2.1 DNS Setup (Hostinger.com)

1. Login to [hostinger.com](https://hostinger.com)
2. Go to Domains → Manage codingbullz.com → DNS Zone
3. Add these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_VPS_IP_ADDRESS | 3600 |
| A | www | YOUR_VPS_IP_ADDRESS | 3600 |
| A | api | YOUR_VPS_IP_ADDRESS | 3600 |

---

## 🚀 Phase 3: Hostinger VPS Deployment

### 3.1 Automated Enterprise Deployment

1. **Run the enterprise deployment script:**
```bash
chmod +x deploy-hostinger.sh
./deploy-hostinger.sh
```

2. **The script automatically configures:**
   - Python environment and dependencies
   - Local PostgreSQL database
   - Secure environment variables generation
   - Nginx for static file serving and reverse proxy
   - Gunicorn with systemd service
   - Enterprise security hardening

3. **Manual steps (if needed):**
   - Update VPS IP address in environment files
   - Configure SSL certificates with Let's Encrypt
   - Set up custom domain DNS records

### 3.2 Environment Configuration

The deployment uses `.env.hostinger` with these settings:
```
DJANGO_SECRET_KEY=auto-generated-secure-key
DJANGO_ENV=production
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=YOUR_VPS_IP,api.codingbullz.com,codingbullz.com
DATABASE_URL=postgresql://bulldb:secure-password@localhost:5432/bulldb
CORS_ALLOWED_ORIGINS_PRODUCTION=https://codingbullz.com,https://www.codingbullz.com
```

**Local Database Configuration:**
- **Database:** PostgreSQL (local on VPS)
- **Host:** localhost
- **Port:** 5432
- **Zero external dependencies**

---

## 🌟 Phase 4: Frontend Configuration (Nginx Static Serving)

### 4.1 Frontend Build and Deployment

The frontend is automatically built and deployed by the `deploy-hostinger.sh` script:

1. **Automatic build process:**
```bash
cd codingbull-website
npm run build:hostinger  # Uses .env.hostinger configuration
```

2. **Nginx serves static files:**
   - Static files served from `/home/codingbull/codingbull/staticfiles/`
   - React Router support with fallback to `index.html`
   - Gzip and Brotli compression enabled
   - Security headers applied

3. **Environment Configuration:**
```
REACT_APP_ENV=production
REACT_APP_API_BASE_URL=https://api.codingbullz.com/api/v1
REACT_APP_ENABLE_DEBUG_MODE=false
GENERATE_SOURCEMAP=false
REACT_APP_DEPLOYMENT_TARGET=hostinger-vps
```

4. **Zero external dependencies** - everything served from Hostinger VPS

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
**Database Issues:**
- Verify DATABASE_URL format matches your provider
- Check database service is running (Supabase/Neon dashboard)
- Test connection: `python check_database_status.py`
- Ensure database allows external connections

---

## 📞 Post-Deployment

1. Monitor for 24-48 hours
2. Set up database backups
3. Configure monitoring alerts
4. Plan scaling strategy

**Need help?** Check platform documentation or review error logs.
