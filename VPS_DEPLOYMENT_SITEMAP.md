# 🚀 VPS Deployment Instructions - Sitemap System

## 📋 **Pre-Deployment Checklist**

### ✅ **Files Ready for Production:**
- ✅ Enhanced sitemap classes (`api/sitemaps.py`)
- ✅ Sitemap index management (`api/sitemap_index.py`)
- ✅ Management commands (`api/management/commands/`)
- ✅ Service worker (`sw.js`) - Fixes 404 error
- ✅ Offline page (`offline.html`)
- ✅ Updated Django template with SW registration
- ✅ Enhanced URL configuration

### ⚠️ **What We Fixed:**
- **Service Worker 404 Error** - Created missing `sw.js` and `offline.html`
- **Template Duplication** - Unified Django template
- **Database Fallbacks** - Commands work without DB connection
- **Import Issues** - Fixed all Django import errors

---

## 🔧 **Step-by-Step VPS Deployment**

### **Step 1: Push Changes to Repository**
```bash
# In your local environment
git add .
git commit -m "feat: Enhanced sitemap system with service worker fixes"
git push origin main
```

### **Step 2: Connect to Hostinger VPS**
```bash
ssh root@your-vps-ip
# or
ssh your-username@your-vps-ip
```

### **Step 3: Navigate to Project and Pull Changes**
```bash
cd /path/to/your/project/codingbull
git pull origin main
```

### **Step 4: Activate Virtual Environment**
```bash
cd codingbull_backend
source venv/bin/activate
```

### **Step 5: Install Any New Dependencies (if any)**
```bash
pip install -r requirements.txt
```

### **Step 6: Test Sitemap System**
```bash
# Test sitemap generation
python manage.py generate_sitemap --validate

# Test sitemap sync
python manage.py sync_sitemap --dry-run

# If successful, do actual sync
python manage.py sync_sitemap
```

### **Step 7: Collect Static Files**
```bash
python manage.py collectstatic --noinput
```

### **Step 8: Setup Cron Jobs for Automation**
```bash
# Open crontab editor
crontab -e

# Add these lines to the crontab:
```

```bash
# CodingBull Sitemap Automation
# Update sitemap every 4 hours
0 */4 * * * cd /path/to/your/project/codingbull/codingbull_backend && source venv/bin/activate && python manage.py sync_sitemap >> /var/log/sitemap_cron.log 2>&1

# Daily comprehensive sitemap generation (at 6 AM)
0 6 * * * cd /path/to/your/project/codingbull/codingbull_backend && source venv/bin/activate && python manage.py generate_sitemap --validate >> /var/log/sitemap_cron.log 2>&1

# Weekly sitemap monitoring (Sundays at 7 AM)
0 7 * * 0 cd /path/to/your/project/codingbull/codingbull_backend && source venv/bin/activate && python manage.py monitor_sitemap --save-report >> /var/log/sitemap_cron.log 2>&1

# Monthly cleanup (1st of each month at 3 AM)
0 3 1 * * find /path/to/your/project/codingbull/codingbull_backend/logs -name "sitemap_report_*.json" -mtime +30 -delete
```

### **Step 9: Create Log Directory and Set Permissions**
```bash
# Create logs directory
mkdir -p /path/to/your/project/codingbull/codingbull_backend/logs

# Create log files
touch /var/log/sitemap_cron.log
touch /path/to/your/project/codingbull/codingbull_backend/logs/sitemap_update.log

# Set proper permissions
chmod 755 /path/to/your/project/codingbull/codingbull_backend/logs
chmod 644 /var/log/sitemap_cron.log
chmod 644 /path/to/your/project/codingbull/codingbull_backend/logs/sitemap_update.log
```

### **Step 10: Test Cron Jobs**
```bash
# Test the cron job command manually
cd /path/to/your/project/codingbull/codingbull_backend && source venv/bin/activate && python manage.py sync_sitemap

# Check if cron service is running
systemctl status cron
# or on some systems:
systemctl status crond

# If not running, start it
systemctl start cron
systemctl enable cron
```

### **Step 11: Verify Service Worker Files**
```bash
# Check if service worker files exist
ls -la /path/to/your/project/codingbull/codingbull_backend/static/frontend/sw.js
ls -la /path/to/your/project/codingbull/codingbull_backend/static/frontend/offline.html

# If not there after collectstatic, copy manually
cp /path/to/your/project/codingbull/codingbull-website/public/sw.js /path/to/your/project/codingbull/codingbull_backend/static/frontend/
cp /path/to/your/project/codingbull/codingbull-website/public/offline.html /path/to/your/project/codingbull/codingbull_backend/static/frontend/
```

### **Step 12: Update Nginx Configuration (if needed)**
```bash
# Edit nginx configuration
nano /etc/nginx/sites-available/codingbullz.com

# Add these location blocks if not already present:
```

```nginx
# Service Worker
location /sw.js {
    alias /path/to/your/project/codingbull/codingbull_backend/static/frontend/sw.js;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# Offline page
location /offline.html {
    alias /path/to/your/project/codingbull/codingbull_backend/static/frontend/offline.html;
}

# Sitemap routes
location ~ ^/sitemap.*\.xml$ {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

```bash
# Test nginx configuration
nginx -t

# If test passes, reload nginx
systemctl reload nginx
```

### **Step 13: Restart Django Application**
```bash
# If using systemd service
systemctl restart codingbull-gunicorn

# If using PM2 or similar
# pm2 restart your-app-name

# If manual gunicorn
# Kill existing gunicorn processes and restart
```

---

## 🔍 **Verification Steps**

### **1. Test Service Worker Fix**
```bash
curl -I https://codingbullz.com/sw.js
# Should return 200 OK, not 404
```

### **2. Test Sitemap Endpoints**
```bash
curl -I https://codingbullz.com/sitemap.xml
curl -I https://codingbullz.com/sitemap-index.xml
curl -I https://codingbullz.com/sitemap-static.xml
```

### **3. Check Cron Logs**
```bash
# Check cron logs
tail -f /var/log/sitemap_cron.log

# Check system cron logs
journalctl -u cron -f
```

### **4. Monitor Application Logs**
```bash
# Check Django logs
tail -f /path/to/your/project/codingbull/codingbull_backend/logs/sitemap_update.log

# Check gunicorn logs
tail -f /var/log/gunicorn/error.log
```

---

## 🛠️ **Troubleshooting**

### **Service Worker Still 404?**
```bash
# Check file permissions
ls -la /path/to/your/project/codingbull/codingbull_backend/static/frontend/

# Manually copy files
cp /path/to/your/project/codingbull/codingbull-website/public/sw.js /path/to/your/project/codingbull/codingbull_backend/static/frontend/
cp /path/to/your/project/codingbull/codingbull-website/public/offline.html /path/to/your/project/codingbull/codingbull_backend/static/frontend/

# Ensure nginx serves them correctly
```

### **Sitemap Generation Fails?**
```bash
# Check database connection
python manage.py dbshell

# Test with fallback (should work even without DB)
python manage.py generate_sitemap --validate
```

### **Cron Jobs Not Running?**
```bash
# Check cron service
systemctl status cron

# Check user crontab
crontab -l

# Check system logs
journalctl -u cron
```

### **Permission Issues?**
```bash
# Fix ownership
chown -R www-data:www-data /path/to/your/project/codingbull/
# or
chown -R your-user:your-group /path/to/your/project/codingbull/

# Fix permissions
chmod -R 755 /path/to/your/project/codingbull/codingbull_backend/
```

---

## 📊 **Monitoring & Maintenance**

### **Weekly Checks:**
```bash
# Check sitemap health
cd /path/to/your/project/codingbull/codingbull_backend
source venv/bin/activate
python manage.py monitor_sitemap --save-report

# Check cron logs
tail -n 50 /var/log/sitemap_cron.log
```

### **Monthly Tasks:**
```bash
# Clean old logs
find /path/to/your/project/codingbull/codingbull_backend/logs -name "sitemap_report_*.json" -mtime +30 -delete

# Verify all endpoints
curl -s https://codingbullz.com/sitemap.xml | head -20
curl -s https://codingbullz.com/sw.js | head -10
```

---

## ✅ **Success Indicators**

After deployment, you should see:
- ✅ `https://codingbullz.com/sw.js` returns 200 (not 404)
- ✅ `https://codingbullz.com/sitemap.xml` returns valid XML
- ✅ `https://codingbullz.com/sitemap-index.xml` returns sitemap index
- ✅ No service worker registration errors in browser console
- ✅ Cron jobs running every 4 hours
- ✅ Log files being created and updated

---

## 🚨 **Important Notes**

1. **Replace `/path/to/your/project/codingbull/`** with your actual VPS path
2. **Update user permissions** according to your VPS setup
3. **Test everything** in a staging environment first if possible
4. **Keep backups** of your crontab before modifications
5. **Monitor logs** for the first 24 hours after deployment

---

## 📞 **Support**

If you encounter issues:
1. Check the troubleshooting section above
2. Review log files for specific error messages
3. Test individual commands manually before setting up cron jobs
4. Ensure all file paths are correct for your VPS setup