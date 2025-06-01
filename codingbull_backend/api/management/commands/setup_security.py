"""
Management command to set up initial security rules and configuration
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import RateLimitRule, BlacklistRule


class Command(BaseCommand):
    help = 'Set up initial security rules and configuration'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Reset existing rules before creating new ones',
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write('Resetting existing security rules...')
            RateLimitRule.objects.all().delete()
            BlacklistRule.objects.all().delete()

        self.stdout.write('Setting up initial security rules...')

        # Get or create admin user for rule creation
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@codingbull.com',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(f'Created admin user: admin/admin123')

        # Create rate limiting rules
        rate_limit_rules = [
            {
                'name': 'API General Rate Limit',
                'description': 'General rate limiting for API endpoints',
                'path_pattern': r'^/api/.*',
                'max_requests': 100,
                'time_window': 300,  # 5 minutes
                'block_duration': 600,  # 10 minutes
                'applies_to': 'ip',
                'priority': 100,
            },
            {
                'name': 'Admin Rate Limit',
                'description': 'Rate limiting for admin interface',
                'path_pattern': r'^/admin/.*',
                'max_requests': 50,
                'time_window': 300,  # 5 minutes
                'block_duration': 900,  # 15 minutes
                'applies_to': 'ip',
                'priority': 50,
            },
            {
                'name': 'Authentication Rate Limit',
                'description': 'Rate limiting for authentication endpoints',
                'path_pattern': r'.*(login|auth|signin).*',
                'max_requests': 10,
                'time_window': 300,  # 5 minutes
                'block_duration': 1800,  # 30 minutes
                'applies_to': 'ip',
                'priority': 10,
            },
            {
                'name': 'Contact Form Rate Limit',
                'description': 'Rate limiting for contact form submissions',
                'path_pattern': r'^/api/v1/contact.*',
                'max_requests': 5,
                'time_window': 3600,  # 1 hour
                'block_duration': 3600,  # 1 hour
                'applies_to': 'ip',
                'priority': 20,
            },
        ]

        for rule_data in rate_limit_rules:
            rule, created = RateLimitRule.objects.get_or_create(
                name=rule_data['name'],
                defaults={
                    **rule_data,
                    'created_by': admin_user,
                }
            )
            if created:
                self.stdout.write(f'✓ Created rate limit rule: {rule.name}')
            else:
                self.stdout.write(f'- Rate limit rule already exists: {rule.name}')

        # Create blacklist rules
        blacklist_rules = [
            {
                'rule_type': 'user_agent',
                'pattern': r'sqlmap',
                'reason': 'SQL injection tool',
            },
            {
                'rule_type': 'user_agent',
                'pattern': r'nikto',
                'reason': 'Web vulnerability scanner',
            },
            {
                'rule_type': 'user_agent',
                'pattern': r'nmap',
                'reason': 'Network scanner',
            },
            {
                'rule_type': 'user_agent',
                'pattern': r'masscan',
                'reason': 'Port scanner',
            },
            {
                'rule_type': 'user_agent',
                'pattern': r'acunetix',
                'reason': 'Web vulnerability scanner',
            },
            {
                'rule_type': 'user_agent',
                'pattern': r'burp',
                'reason': 'Web application security testing tool',
            },
            {
                'rule_type': 'user_agent',
                'pattern': r'w3af',
                'reason': 'Web application attack and audit framework',
            },
            {
                'rule_type': 'user_agent',
                'pattern': r'dirb',
                'reason': 'Directory brute forcer',
            },
            {
                'rule_type': 'user_agent',
                'pattern': r'gobuster',
                'reason': 'Directory/file brute forcer',
            },
            {
                'rule_type': 'user_agent',
                'pattern': r'hydra',
                'reason': 'Password cracking tool',
            },
            {
                'rule_type': 'path',
                'pattern': r'/\.env',
                'reason': 'Attempting to access environment files',
            },
            {
                'rule_type': 'path',
                'pattern': r'/\.git',
                'reason': 'Attempting to access git repository',
            },
            {
                'rule_type': 'path',
                'pattern': r'/wp-admin',
                'reason': 'WordPress admin access attempt',
            },
            {
                'rule_type': 'path',
                'pattern': r'/wp-login\.php',
                'reason': 'WordPress login attempt',
            },
            {
                'rule_type': 'path',
                'pattern': r'/phpmyadmin',
                'reason': 'Database admin tool access attempt',
            },
            {
                'rule_type': 'path',
                'pattern': r'/xmlrpc\.php',
                'reason': 'WordPress XML-RPC attack attempt',
            },
            {
                'rule_type': 'path',
                'pattern': r'/shell',
                'reason': 'Web shell access attempt',
            },
            {
                'rule_type': 'path',
                'pattern': r'/cmd',
                'reason': 'Command execution attempt',
            },
            {
                'rule_type': 'path',
                'pattern': r'/eval',
                'reason': 'Code evaluation attempt',
            },
            {
                'rule_type': 'path',
                'pattern': r'/v1/models',
                'reason': 'OpenAI API endpoint probe',
            },
            {
                'rule_type': 'path',
                'pattern': r'/api/v1/models',
                'reason': 'OpenAI API endpoint probe',
            },
        ]

        for rule_data in blacklist_rules:
            rule, created = BlacklistRule.objects.get_or_create(
                rule_type=rule_data['rule_type'],
                pattern=rule_data['pattern'],
                defaults={
                    **rule_data,
                    'created_by': admin_user,
                }
            )
            if created:
                self.stdout.write(f'✓ Created blacklist rule: {rule.get_rule_type_display()} - {rule.pattern}')
            else:
                self.stdout.write(f'- Blacklist rule already exists: {rule.get_rule_type_display()} - {rule.pattern}')

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSecurity setup completed!\n'
                f'Created {RateLimitRule.objects.count()} rate limit rules\n'
                f'Created {BlacklistRule.objects.count()} blacklist rules\n\n'
                f'You can now:\n'
                f'1. Access the admin interface at /admin/\n'
                f'2. Monitor security logs in real-time\n'
                f'3. Manage IP addresses and their reputation\n'
                f'4. Configure additional security rules\n'
                f'5. View security alerts and analytics\n'
            )
        )