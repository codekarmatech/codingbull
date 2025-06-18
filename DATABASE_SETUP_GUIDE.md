# 🗄️ Database Setup Guide for CodingBull

## 📋 Overview

CodingBull backend supports flexible database configuration:
- **Development:** SQLite (automatic, no setup required)
- **Production:** PostgreSQL (cloud-hosted recommended)

## 🔧 Current Configuration

The backend automatically detects the environment and uses the appropriate database:

```python
# Development (DJANGO_ENV=development)
DATABASE = SQLite (db.sqlite3)

# Production (DJANGO_ENV=production)  
DATABASE = PostgreSQL (via DATABASE_URL)
```

## 🌐 Recommended Cloud PostgreSQL Providers

### 🟢 Supabase (Recommended)
**Why Choose Supabase:**
- ✅ Generous free tier (500MB, 2 projects)
- ✅ Built-in authentication & real-time features
- ✅ Excellent dashboard and monitoring
- ✅ Global CDN and edge functions

**Setup Steps:**
1. Go to [supabase.com](https://supabase.com)
2. Create account → New Project
3. Choose region (closest to your users)
4. Set database password
5. Copy DATABASE_URL from Settings → Database → Connection string

**Example URL:**
```
postgresql://postgres:your-password@db.supabase.co:5432/postgres
```

### 🟢 Neon (Alternative)
**Why Choose Neon:**
- ✅ Serverless PostgreSQL with branching
- ✅ Free tier (512MB, 1 project)
- ✅ Automatic scaling and hibernation
- ✅ Git-like database branching

**Setup Steps:**
1. Go to [neon.tech](https://neon.tech)
2. Sign up → Create Project
3. Choose region
4. Copy connection string from Dashboard

**Example URL:**
```
postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb
```

### 🟡 Other Options

**Aiven (1 month free trial):**
- Enterprise-grade features
- Multiple cloud providers
- Advanced monitoring

**Railway ($5 monthly credit):**
- Simple deployment platform
- Integrated with Git
- Built-in monitoring

**ElephantSQL (Free tier):**
- 20MB free tier
- Simple setup
- Good for testing

## ⚙️ Configuration Steps

### 1. Create Production Environment File

```bash
cd codingbull_backend
cp .env.example .env.production
```

### 2. Configure Database URL

Edit `.env.production`:
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Example for Supabase:
DATABASE_URL=postgresql://postgres:your-password@db.supabase.co:5432/postgres

# Example for Neon:
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb
```

### 3. Test Database Connection

```bash
# Copy production config for testing
cp .env.production .env

# Test connection
python check_database_status.py
```

### 4. Migrate Data from SQLite

```bash
# Migrate existing data to PostgreSQL
python migrate_to_postgresql.py
```

## 🚀 Deployment Configuration

### Koyeb Environment Variables

Set these in your Koyeb dashboard:
```env
DATABASE_URL=your-cloud-postgresql-url
DJANGO_ENV=production
DJANGO_DEBUG=False
```

### Cloudflare Pages (Frontend)

No database configuration needed - frontend connects to backend API.

## 🔍 Verification

### Check Database Status
```bash
python check_database_status.py
```

### Test API Endpoints
```bash
curl https://api.codingbullz.com/api/v1/
curl https://api.codingbullz.com/api/v1/projects/
```

## 🚨 Troubleshooting

### Connection Issues
- ✅ Verify DATABASE_URL format
- ✅ Check database service status in provider dashboard
- ✅ Ensure database allows external connections
- ✅ Verify credentials and permissions

### Migration Issues
- ✅ Backup SQLite data before migration
- ✅ Check PostgreSQL schema compatibility
- ✅ Verify all required tables are created

### Performance Issues
- ✅ Monitor database usage in provider dashboard
- ✅ Consider upgrading to paid tier for production
- ✅ Optimize queries and add indexes as needed

## 📊 Database Schema

The backend automatically creates these tables:
- `api_blogpost` - Blog posts
- `api_project` - Portfolio projects  
- `api_service` - Services offered
- `api_testimonial` - Client testimonials
- `api_contactsubmission` - Contact form submissions

## 🔐 Security Best Practices

1. **Never commit DATABASE_URL to version control**
2. **Use strong, unique passwords**
3. **Enable SSL/TLS connections**
4. **Regularly backup your database**
5. **Monitor for unusual activity**
6. **Keep database software updated**

## 📞 Support

- **Supabase:** [docs.supabase.com](https://docs.supabase.com)
- **Neon:** [neon.tech/docs](https://neon.tech/docs)
- **Django Database:** [docs.djangoproject.com/en/5.2/ref/databases/](https://docs.djangoproject.com/en/5.2/ref/databases/)

---

**Next Steps:** After database setup, proceed with [DEPLOYMENT_GUIDE_SIMPLIFIED.md](./DEPLOYMENT_GUIDE_SIMPLIFIED.md)
