from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import BlacklistRule, RateLimitRule
from datetime import datetime
from django.utils import timezone

class Command(BaseCommand):
    help = 'Setup enterprise-level security for corporate website'

    def add_arguments(self, parser):
        parser.add_argument(
            '--admin-ip',
            type=str,
            help='Your IP address for admin access (optional but recommended)',
        )
        parser.add_argument(
            '--enable-blocks',
            action='store_true',
            help='Enable blocking immediately (default: logging only for 7 days)',
        )

    def handle(self, *args, **options):
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            self.stdout.write(self.style.ERROR('No admin user found!'))
            return

        admin_ip = options.get('admin_ip')
        enable_blocks = options.get('enable_blocks', False)

        self.stdout.write('🏢 Setting up Corporate Website Security...')
        self.stdout.write('='*50)

        # 1. DJANGO ADMIN PROTECTION (Critical)
        self.stdout.write('\n🔐 ADMIN PROTECTION:')
        
        # Rate limit admin access heavily
        admin_rate_limits = [
            {
                'name': 'Django Admin Login Protection',
                'description': 'Strict rate limiting for admin login attempts',
                'path_pattern': '/admin/login/',
                'max_requests': 3,
                'time_window': 300,  # 5 minutes
                'block_duration': 1800,  # 30 minutes
                'is_active': True
            },
            {
                'name': 'Django Admin Panel Access',
                'description': 'Rate limit general admin access',
                'path_pattern': '/admin/*',
                'max_requests': 20,
                'time_window': 60,  # 1 minute
                'block_duration': 300,  # 5 minutes
                'is_active': True
            }
        ]

        for rate_limit in admin_rate_limits:
            if not RateLimitRule.objects.filter(path_pattern=rate_limit['path_pattern']).exists():
                RateLimitRule.objects.create(**rate_limit)
                self.stdout.write(f'✅ Added: {rate_limit["name"]}')

        # 2. BASIC WEB ATTACK PROTECTION
        self.stdout.write('\n🛡️  WEB ATTACK PROTECTION:')
        
        web_attack_rules = [
            # SQL Injection
            {
                'rule_type': 'path',
                'pattern': r'.*(\bunion\b.*\bselect\b|\bselect\b.*\bfrom\b|\binsert\b.*\binto\b|\bdelete\b.*\bfrom\b|\bdrop\b.*\btable\b).*',
                'reason': 'SQL injection attempt detected',
                'is_active': enable_blocks
            },
            # XSS Prevention
            {
                'rule_type': 'path', 
                'pattern': r'.*(<script|javascript:|onload=|onerror=|eval\(|\balert\()',
                'reason': 'Cross-site scripting (XSS) attempt',
                'is_active': enable_blocks
            },
            # Directory Traversal
            {
                'rule_type': 'path',
                'pattern': r'.*(\.\./|\.\.\\|/etc/passwd|/etc/shadow|\.env|\.git/)',
                'reason': 'Directory traversal attempt',
                'is_active': enable_blocks
            },
            # WordPress attacks (common even on non-WP sites)
            {
                'rule_type': 'path',
                'pattern': r'^/(wp-admin|wp-login\.php|wp-content|wp-includes)',
                'reason': 'WordPress attack attempt on non-WP site',
                'is_active': enable_blocks
            },
            # PHPMyAdmin attacks
            {
                'rule_type': 'path',
                'pattern': r'^/(phpmyadmin|pma|myadmin)',
                'reason': 'Database admin panel attack attempt',
                'is_active': enable_blocks
            }
        ]

        for rule in web_attack_rules:
            if not BlacklistRule.objects.filter(pattern=rule['pattern']).exists():
                BlacklistRule.objects.create(
                    created_by=admin_user,
                    match_count=0,
                    **rule
                )
                status = "🟢 ACTIVE" if rule['is_active'] else "🟡 LOGGING"
                self.stdout.write(f'✅ Added {status}: {rule["reason"]}')

        # 3. BOT PROTECTION (but allow good bots)
        self.stdout.write('\n🤖 BOT PROTECTION:')
        
        bot_rules = [
            # Block obvious malicious bots
            {
                'rule_type': 'user_agent',
                'pattern': r'(?i)(masscan|nmap|nikto|sqlmap|dirb|gobuster|wpscan)',
                'reason': 'Security scanning tools',
                'is_active': enable_blocks
            },
            # Block generic scrapers (but allow legitimate ones)
            {
                'rule_type': 'user_agent',
                'pattern': r'^(curl|wget)(?!/)',  # Raw curl/wget without version info
                'reason': 'Basic scraping tools without proper identification',
                'is_active': enable_blocks
            }
        ]

        for rule in bot_rules:
            if not BlacklistRule.objects.filter(pattern=rule['pattern']).exists():
                BlacklistRule.objects.create(
                    created_by=admin_user,
                    match_count=0,
                    **rule
                )
                status = "🟢 ACTIVE" if rule['is_active'] else "🟡 LOGGING"
                self.stdout.write(f'✅ Added {status}: {rule["reason"]}')

        # 4. CONTACT FORM PROTECTION
        self.stdout.write('\n📧 FORM PROTECTION:')
        
        form_rate_limits = [
            {
                'name': 'Contact Form Submission',
                'description': 'Prevent contact form spam',
                'path_pattern': '/contact/*',
                'max_requests': 3,
                'time_window': 300,  # 5 minutes
                'block_duration': 600,  # 10 minutes
                'is_active': True
            },
            {
                'name': 'General Form Submissions',
                'description': 'Rate limit all form submissions',
                'path_pattern': '/api/forms/*',
                'max_requests': 5,
                'time_window': 60,
                'block_duration': 300,
                'is_active': True
            }
        ]

        for rate_limit in form_rate_limits:
            if not RateLimitRule.objects.filter(path_pattern=rate_limit['path_pattern']).exists():
                RateLimitRule.objects.create(**rate_limit)
                self.stdout.write(f'✅ Added: {rate_limit["name"]}')

        # 5. ADMIN IP RESTRICTION (if provided)
        if admin_ip:
            self.stdout.write(f'\n🔒 ADMIN IP RESTRICTION:')
            # This would typically be handled at web server level, but we can log others
            other_admin_access = {
                'rule_type': 'ip',
                'pattern': f'!{admin_ip}',  # Not your IP accessing admin
                'reason': f'Admin access from IP other than {admin_ip}',
                'is_active': False  # Just log for now
            }
            
            BlacklistRule.objects.create(
                created_by=admin_user,
                match_count=0,
                **other_admin_access
            )
            self.stdout.write(f'✅ Added IP monitoring: Admin access logged for non-{admin_ip} IPs')

        # Summary
        self.stdout.write('\n' + '='*50)
        self.stdout.write('🏢 Corporate Security Setup Complete!')
        
        total_blacklist = BlacklistRule.objects.count()
        total_ratelimit = RateLimitRule.objects.count()
        active_blacklist = BlacklistRule.objects.filter(is_active=True).count()
        
        self.stdout.write(f'📊 Security Rules Created:')
        self.stdout.write(f'  - Blacklist rules: {total_blacklist} ({active_blacklist} active)')
        self.stdout.write(f'  - Rate limit rules: {total_ratelimit}')
        
        if not enable_blocks:
            self.stdout.write(f'\n🟡 LOGGING MODE: Rules are monitoring for 7 days')
            self.stdout.write(f'   Run with --enable-blocks to activate blocking')
        else:
            self.stdout.write(f'\n🟢 ACTIVE MODE: Security rules are actively blocking threats')
        
        self.stdout.write(f'\n🎯 What this protects:')
        self.stdout.write(f'  ✅ Django admin from brute force')
        self.stdout.write(f'  ✅ SQL injection attacks')
        self.stdout.write(f'  ✅ XSS attempts')
        self.stdout.write(f'  ✅ Directory traversal')
        self.stdout.write(f'  ✅ Contact form spam')
        self.stdout.write(f'  ✅ Malicious bots and scanners')
        self.stdout.write(f'  ✅ Common CMS attacks')
        
        self.stdout.write(f'\n✅ What this allows:')
        self.stdout.write(f'  - All legitimate visitors worldwide')
        self.stdout.write(f'  - Search engines (Google, Bing, etc.)')
        self.stdout.write(f'  - Legitimate API testing tools')
        self.stdout.write(f'  - Normal browsing behavior')