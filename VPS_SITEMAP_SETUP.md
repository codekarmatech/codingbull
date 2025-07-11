# VPS Sitemap Setup Guide - Hostinger Production Deployment

## 🚀 Production Deployment Checklist

### ✅ Pre-Deployment Verification

1. **Code Status**: Ready for production with basic sitemap fallback
2. **Database**: Works with both PostgreSQL and fallback mode
3. **Service Worker**: Fixed 404 error with proper sw.js file
4. **Template**: Unified index.html with proper service worker registration

### ⚠️ Known Issues to Address

1. **Database Connection**: Currently using fallback mode - needs production DB credentials
2. **Static Files**: Ensure sw.js and offline.html are properly collected in production
3. **File Permissions**: Scripts need proper execution permissions

---

## 📋 Step-by-Step VPS Setup Instructions

### Step 1: Push Code to Repository

```bash
# On your local machine
git add .
git commit -m "feat: Add comprehensive sitemap system with automation"
git push origin main
```

### Step 2: Connect to Hostinger VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Navigate to your project directory
cd /path/to/your/project
```

### Step 3: Pull Latest Changes

```bash
# Pull the latest changes
git pull origin main

# Activate virtual environment
source venv/bin/activate

# Install any new dependencies (if any)
pip install -r requirements.txt
```

### Step 4: Configure Production Settings

```bash
# Edit your production settings to ensure sitemap configuration
nano codingbull_backend/codingbull_api/settings.py
```

**Ensure these settings are properly configured:**

```python
# Sitemap configuration
SITEMAP_DOMAIN = 'codingbullz.com'
SITEMAP_USE_HTTPS = True
SITEMAP_CACHE_TIMEOUT = 86400  # 24 hours
SITEMAP_LIMIT = 50000

# Database configuration for production
if ENVIRONMENT == 'production':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'your_db_name',
            'USER': 'your_db_user',
            'PASSWORD': 'your_db_password',
            'HOST': 'localhost',
            'PORT': '5432',
        }
    }
```

### Step 5: Collect Static Files

```bash
# Collect static files including sw.js and offline.html
cd codingbull_backend
python manage.py collectstatic --noinput
```

### Step 6: Test Sitemap Generation

```bash
# Test sitemap generation
python manage.py generate_sitemap --validate

# Test sitemap sync
python manage.py sync_sitemap --dry-run
```

### Step 7: Set Up Cron Jobs

```bash
# Make the setup script executable
chmod +x scripts/setup_sitemap_cron.sh

# Create logs directory
mkdir -p logs

# Test the automated script
python scripts/update_sitemap.py
```

### Step 8: Configure Cron Jobs Manually

```bash
# Edit crontab
crontab -e

# Add these lines:
# CodingBull Sitemap Automation
# Update sitemap every 2 hours
0 */2 * * * cd /path/to/your/project/codingbull_backend && source venv/bin/activate && python scripts/update_sitemap.py >> logs/cron_sitemap.log 2>&1

# Daily sitemap validation and sync (at 6 AM)
0 6 * * * cd /path/to/your/project/codingbull_backend && source venv/bin/activate && python manage.py sync_sitemap --validate >> logs/cron_sitemap.log 2>&1

# Weekly comprehensive sitemap monitoring (Sundays at 7 AM)
0 7 * * 0 cd /path/to/your/project/codingbull_backend && source venv/bin/activate && python manage.py monitor_sitemap --check-urls --send-alerts >> logs/cron_sitemap.log 2>&1

# Monthly sitemap cleanup (1st of each month at 3 AM)
0 3 1 * * cd /path/to/your/project/codingbull_backend && find logs -name "sitemap_report_*.json" -mtime +30 -delete >> logs/cron_sitemap.log 2>&1
```

### Step 9: Configure Web Server (Nginx)

Add to your Nginx configuration:

```nginx
# In your server block
location /sitemap.xml {
    try_files $uri @django;
}

location /sitemap-index.xml {
    try_files $uri @django;
}

location ~ /sitemap-(.+)\.xml$ {
    try_files $uri @django;
}

location /sw.js {
    try_files $uri /static/frontend/sw.js;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}

location /offline.html {
    try_files $uri /static/frontend/offline.html;
}

location /robots.txt {
    try_files $uri @django;
}
```

### Step 10: Restart Services

```bash
# Restart your Django application
sudo systemctl restart codingbull-gunicorn

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status codingbull-gunicorn
sudo systemctl status nginx
```

### Step 11: Verify Deployment

Test these URLs:

1. **Main Sitemap**: `https://codingbullz.com/sitemap.xml`
2. **Sitemap Index**: `https://codingbullz.com/sitemap-index.xml`
3. **Individual Sitemaps**: `https://codingbullz.com/sitemap-static.xml`
4. **Service Worker**: `https://codingbullz.com/sw.js`
5. **Robots.txt**: `https://codingbullz.com/robots.txt`

### Step 12: Monitor and Test

```bash
# Check cron logs
tail -f logs/cron_sitemap.log

# Test sitemap health
python scripts/check_sitemap_health.sh

# View sitemap status
python scripts/sitemap_dashboard.py
```

---

## 🛠️ Troubleshooting

### Common Issues

1. **Service Worker 404 Error**
   - Ensure `sw.js` is in `/static/frontend/` directory
   - Run `python manage.py collectstatic`
   - Check Nginx configuration

2. **Sitemap Generation Fails**
   - Check database connection
   - Verify SITEMAP_DOMAIN setting
   - Review Django logs

3. **Cron Jobs Not Working**
   - Check file permissions
   - Verify paths in crontab
   - Check cron service status: `sudo systemctl status cron`

### Debug Commands

```bash
# Check sitemap generation
python manage.py generate_sitemap --validate

# Test URL accessibility
python manage.py monitor_sitemap --check-urls

# View detailed logs
tail -f logs/sitemap_update.log
```

---

## 📊 Post-Deployment Verification

### Test URLs
- [ ] https://codingbullz.com/sitemap.xml
- [ ] https://codingbullz.com/sitemap-index.xml
- [ ] https://codingbullz.com/sw.js
- [ ] https://codingbullz.com/offline.html
- [ ] https://codingbullz.com/robots.txt

### Service Worker Test
1. Open developer tools
2. Go to Application tab
3. Check Service Workers section
4. Verify registration success

### Sitemap Validation
1. Test with Google Search Console
2. Use online sitemap validators
3. Check XML structure validity

---

## 🔐 Security Considerations

1. **File Permissions**: Ensure scripts have proper permissions
2. **Log Rotation**: Set up log rotation for cron logs
3. **Error Handling**: Monitor error logs regularly
4. **Database Security**: Use proper database credentials

---

## 📈 Monitoring & Maintenance

### Daily Tasks
- Check sitemap generation logs
- Monitor service worker registration
- Verify URL accessibility

### Weekly Tasks
- Review sitemap statistics
- Check for broken URLs
- Analyze performance metrics

### Monthly Tasks
- Clean up old log files
- Review and update sitemap structure
- Performance optimization

---

## 🚨 Emergency Procedures

### If Sitemap Generation Fails
1. Check database connectivity
2. Verify Django settings
3. Use fallback sitemap generation
4. Review error logs

### If Service Worker Fails
1. Check static file collection
2. Verify Nginx configuration
3. Test service worker registration
4. Check browser console for errors

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review log files
3. Test individual components
4. Contact development team

**Last Updated**: December 2024
**Version**: 1.0.0
**Environment**: Hostinger VPS Production