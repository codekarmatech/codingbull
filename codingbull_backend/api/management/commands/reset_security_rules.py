from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import BlacklistRule, RateLimitRule
from datetime import datetime
import json

class Command(BaseCommand):
    help = 'Reset all security rules and start fresh'

    def add_arguments(self, parser):
        parser.add_argument(
            '--backup',
            action='store_true',
            help='Backup existing rules before deletion',
        )
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm deletion of all rules',
        )

    def handle(self, *args, **options):
        if not options.get('confirm'):
            self.stdout.write(
                self.style.WARNING(
                    '⚠️  This will DELETE ALL security rules!\n'
                    'Use --confirm to proceed\n'
                    'Use --backup to save existing rules first'
                )
            )
            return

        self.stdout.write('🧹 Resetting all security rules...')
        self.stdout.write('='*50)

        # Backup if requested
        if options.get('backup'):
            self.backup_rules()

        # Count existing rules
        blacklist_count = BlacklistRule.objects.count()
        ratelimit_count = RateLimitRule.objects.count()

        self.stdout.write(f'📊 Current rules:')
        self.stdout.write(f'  - Blacklist rules: {blacklist_count}')
        self.stdout.write(f'  - Rate limit rules: {ratelimit_count}')

        # Delete all rules
        if blacklist_count > 0:
            BlacklistRule.objects.all().delete()
            self.stdout.write(f'🗑️  Deleted {blacklist_count} blacklist rules')

        if ratelimit_count > 0:
            RateLimitRule.objects.all().delete()
            self.stdout.write(f'🗑️  Deleted {ratelimit_count} rate limit rules')

        # Verify cleanup
        remaining_blacklist = BlacklistRule.objects.count()
        remaining_ratelimit = RateLimitRule.objects.count()

        self.stdout.write('\n' + '='*50)
        self.stdout.write('✅ Security rules reset completed!')
        self.stdout.write(f'📊 Remaining rules:')
        self.stdout.write(f'  - Blacklist rules: {remaining_blacklist}')
        self.stdout.write(f'  - Rate limit rules: {remaining_ratelimit}')

        if remaining_blacklist == 0 and remaining_ratelimit == 0:
            self.stdout.write(
                self.style.SUCCESS(
                    '\n🎉 All security rules have been cleared!'
                    '\nYou can now start fresh with only the rules you need.'
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f'\n⚠️  Warning: {remaining_blacklist + remaining_ratelimit} rules still remain!'
                )
            )

    def backup_rules(self):
        """Backup existing rules to a JSON file"""
        backup_data = {
            'backup_date': datetime.now().isoformat(),
            'blacklist_rules': [],
            'ratelimit_rules': []
        }

        # Backup blacklist rules
        for rule in BlacklistRule.objects.all():
            backup_data['blacklist_rules'].append({
                'rule_type': rule.rule_type,
                'pattern': rule.pattern,
                'reason': rule.reason,
                'is_active': rule.is_active,
                'match_count': rule.match_count,
                'created_at': rule.created_at.isoformat() if rule.created_at else None,
                'last_matched': rule.last_matched.isoformat() if rule.last_matched else None,
                'created_by': rule.created_by.username if rule.created_by else None
            })

        # Backup rate limit rules
        for rule in RateLimitRule.objects.all():
            backup_data['ratelimit_rules'].append({
                'name': rule.name,
                'description': rule.description,
                'path_pattern': rule.path_pattern,
                'max_requests': rule.max_requests,
                'time_window': rule.time_window,
                'block_duration': rule.block_duration,
                'is_active': rule.is_active,
                'created_at': rule.created_at.isoformat() if rule.created_at else None
            })

        # Save backup file
        backup_filename = f'security_rules_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        with open(backup_filename, 'w') as f:
            json.dump(backup_data, f, indent=2)

        self.stdout.write(f'💾 Backup saved to: {backup_filename}')
        self.stdout.write(f'   - {len(backup_data["blacklist_rules"])} blacklist rules')
        self.stdout.write(f'   - {len(backup_data["ratelimit_rules"])} rate limit rules')