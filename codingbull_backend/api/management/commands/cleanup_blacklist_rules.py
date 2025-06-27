from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import BlacklistRule
from datetime import datetime, timedelta
from django.utils import timezone
import re

class Command(BaseCommand):
    help = 'Clean up duplicate and problematic blacklist rules'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be changed without making changes',
        )
        parser.add_argument(
            '--verbose',
            action='store_true',
            help='Show verbose output',
        )

    def handle(self, *args, **options):
        dry_run = options.get('dry_run', False)
        verbose = options.get('verbose', False)
        
        self.stdout.write("🧹 Analyzing blacklist rules for cleanup...")
        self.stdout.write("=" * 60)
        
        # Track changes
        duplicates_removed = 0
        dead_rules_removed = 0
        problematic_removed = 0
        rules_merged = 0
        
        # 1. Find and handle duplicate user agent rules
        self.stdout.write("\n🔍 Checking for duplicate user agent rules...")
        
        duplicate_patterns = [
            # sqlmap duplicates
            {'patterns': ['sqlmap', '^sqlmap.*', '.*sqlmap.*'], 'keep_pattern': '(?i)sqlmap', 'reason': 'SQLMap injection tool (consolidated)'},
            # nikto duplicates  
            {'patterns': ['nikto', '^Nikto.*', '.*nikto.*'], 'keep_pattern': '(?i)nikto', 'reason': 'Nikto vulnerability scanner (consolidated)'},
            # masscan duplicates
            {'patterns': ['masscan', '.*masscan.*'], 'keep_pattern': '(?i)masscan', 'reason': 'Masscan port scanner (consolidated)'},
        ]
        
        for dup_group in duplicate_patterns:
            rules_to_remove = []
            keep_rule = None
            total_matches = 0
            
            for pattern in dup_group['patterns']:
                rules = BlacklistRule.objects.filter(
                    rule_type='user_agent', 
                    pattern=pattern,
                    is_active=True
                )
                for rule in rules:
                    total_matches += rule.match_count
                    if keep_rule is None:
                        keep_rule = rule
                    else:
                        rules_to_remove.append(rule)
            
            if rules_to_remove and keep_rule:
                self.stdout.write(f"  📋 Found {len(rules_to_remove) + 1} duplicate rules for pattern group")
                
                if not dry_run:
                    # Update the keep rule with consolidated info
                    keep_rule.pattern = dup_group['keep_pattern']
                    keep_rule.reason = dup_group['reason']
                    keep_rule.match_count = total_matches
                    keep_rule.save()
                    
                    # Remove duplicates
                    for rule in rules_to_remove:
                        self.stdout.write(f"    ❌ Removing duplicate: {rule.pattern}")
                        rule.delete()
                        duplicates_removed += 1
                else:
                    self.stdout.write(f"    🔄 Would consolidate to: {dup_group['keep_pattern']}")
                    for rule in rules_to_remove:
                        self.stdout.write(f"    ❌ Would remove: {rule.pattern}")

        # 2. Handle duplicate path rules
        self.stdout.write("\n🔍 Checking for duplicate path rules...")
        
        path_duplicates = [
            # .env access rules
            {
                'patterns': ['/\\.env', '/\\.env$'],
                'keep_pattern': r'^/\.env$',
                'reason': 'Environment file access attempt (consolidated)'
            },
            # .git access rules  
            {
                'patterns': ['/\\.git', '/\\.git/config$'],
                'keep_pattern': r'^/\.git(/.*)?$',  
                'reason': 'Git repository access attempt (consolidated)'
            },
            # WordPress login duplicates
            {
                'patterns': ['/wp-login\\.php', '/wp-login\\.php.*log=.*&pwd=.*'],
                'keep_pattern': r'^/wp-login\.php',
                'reason': 'WordPress login attack attempt (consolidated)'
            }
        ]
        
        for dup_group in path_duplicates:
            rules_to_remove = []
            keep_rule = None
            total_matches = 0
            
            for pattern in dup_group['patterns']:
                rules = BlacklistRule.objects.filter(
                    rule_type='path',
                    pattern=pattern,
                    is_active=True
                )
                for rule in rules:
                    total_matches += rule.match_count
                    if keep_rule is None or rule.match_count > keep_rule.match_count:
                        if keep_rule:
                            rules_to_remove.append(keep_rule)
                        keep_rule = rule
                    else:
                        rules_to_remove.append(rule)
            
            if rules_to_remove and keep_rule:
                self.stdout.write(f"  📋 Found {len(rules_to_remove) + 1} duplicate path rules")
                
                if not dry_run:
                    keep_rule.pattern = dup_group['keep_pattern']
                    keep_rule.reason = dup_group['reason']
                    keep_rule.match_count = total_matches
                    keep_rule.save()
                    
                    for rule in rules_to_remove:
                        self.stdout.write(f"    ❌ Removing duplicate: {rule.pattern}")
                        rule.delete()
                        duplicates_removed += 1
                else:
                    self.stdout.write(f"    🔄 Would consolidate to: {dup_group['keep_pattern']}")

        # 3. Remove dead rules (0 matches and very old)
        self.stdout.write("\n🔍 Checking for dead rules (0 matches)...")
        
        dead_rules = BlacklistRule.objects.filter(
            is_active=True,
            match_count=0,
            created_at__lt=timezone.now() - timedelta(days=7)  # At least a week old
        )
        
        for rule in dead_rules:
            self.stdout.write(f"  💀 Dead rule: {rule.rule_type}:{rule.pattern}")
            if not dry_run:
                rule.is_active = False  # Deactivate instead of delete
                rule.save()
                dead_rules_removed += 1

        # 4. Fix overly broad rules
        self.stdout.write("\n🔍 Checking for overly broad rules...")
        
        broad_rules = [
            # Too broad user agent patterns
            {
                'rule_type': 'user_agent',
                'old_pattern': '.*(bot|crawler|spider|scraper).*',
                'new_pattern': r'(?i)(bot|crawler|spider|scraper)(?!.*(googlebot|bingbot|facebookexternalhit|twitterbot|linkedinbot))',
                'reason': 'Malicious bots (excluding legitimate crawlers)'
            },
            {
                'rule_type': 'user_agent', 
                'old_pattern': '.*(curl|wget|python-urllib|Go-http-client).*',
                'new_pattern': r'(?i)(curl|wget)(?!/[\d.]+\s+\(compatible)',  # More specific pattern
                'reason': 'Suspicious automated tools (refined)'
            }
        ]
        
        for broad_rule in broad_rules:
            rule = BlacklistRule.objects.filter(
                rule_type=broad_rule['rule_type'],
                pattern=broad_rule['old_pattern'],
                is_active=True
            ).first()
            
            if rule:
                self.stdout.write(f"  🎯 Refining broad rule: {rule.pattern}")
                if not dry_run:
                    rule.pattern = broad_rule['new_pattern']
                    rule.reason = broad_rule['reason']
                    rule.save()
                    problematic_removed += 1
                else:
                    self.stdout.write(f"    🔄 Would change to: {broad_rule['new_pattern']}")

        # 5. Handle remaining duplicates and problematic rules
        self.stdout.write("\n🔍 Checking remaining duplicates and problematic rules...")
        
        # Directory traversal duplicates
        traversal_rules = BlacklistRule.objects.filter(
            rule_type='path',
            is_active=True,
            pattern__in=['.*\\.\\./.*', '.*\\.\\./\\.\\./.*(']
        )
        
        if traversal_rules.count() > 1:
            # Keep the more specific one (multi-level traversal)
            keep_rule = traversal_rules.filter(pattern='.*\\.\\./\\.\\./.*(').first()
            if keep_rule:
                remove_rules = traversal_rules.exclude(id=keep_rule.pk)
                for rule in remove_rules:
                    self.stdout.write(f"  ❌ Removing less specific traversal rule: {rule.pattern}")
                    if not dry_run:
                        rule.delete()
                        duplicates_removed += 1
        
        # phpMyAdmin duplicates
        phpmyadmin_rules = BlacklistRule.objects.filter(
            rule_type='path',
            is_active=True,
            pattern__in=['.*/phpmyadmin/.*', '/phpmyadmin/index\\.php.*']
        )
        
        if phpmyadmin_rules.count() > 1:
            # Keep the more specific one 
            keep_rule = phpmyadmin_rules.filter(pattern='/phpmyadmin/index\\.php.*').first()
            if keep_rule:
                remove_rules = phpmyadmin_rules.exclude(id=keep_rule.pk)
                for rule in remove_rules:
                    self.stdout.write(f"  ❌ Removing broad phpMyAdmin rule: {rule.pattern}")
                    if not dry_run:
                        rule.delete()
                        duplicates_removed += 1
        
        # Remove problematic country blocking rules (too broad for development)
        if not dry_run:
            problematic_countries = BlacklistRule.objects.filter(
                rule_type='country',
                is_active=True,
                pattern__in=['CN', 'RU']  # These are too broad and may block legitimate traffic
            )
            
            for rule in problematic_countries:
                self.stdout.write(f"  ⚠️  Deactivating broad country rule: {rule.pattern}")
                rule.is_active = False
                rule.save()
                problematic_removed += 1
        
        # Clean up old inactive rules completely
        if not dry_run:
            old_inactive = BlacklistRule.objects.filter(
                is_active=False,
                created_at__lt=timezone.now() - timedelta(days=30)
            )
            
            old_count = old_inactive.count()
            if old_count > 0:
                self.stdout.write(f"  🗑️  Removing {old_count} old inactive rules...")
                old_inactive.delete()

        # Summary
        self.stdout.write("\n" + "=" * 60)
        if dry_run:
            self.stdout.write("🧪 DRY RUN - No changes made")
        else:
            self.stdout.write("🧹 Blacklist Cleanup Completed!")
        
        self.stdout.write(f"📊 Summary:")
        self.stdout.write(f"  - Duplicates removed: {duplicates_removed}")
        self.stdout.write(f"  - Dead rules deactivated: {dead_rules_removed}")
        self.stdout.write(f"  - Broad rules refined: {problematic_removed}")
        
        # Final count
        final_count = BlacklistRule.objects.filter(is_active=True).count()
        self.stdout.write(f"  - Total active rules now: {final_count}")
        
        self.stdout.write("\n🎯 Recommendations:")
        self.stdout.write("  1. Monitor rule effectiveness over the next week")
        self.stdout.write("  2. Review any rules with very high match counts")
        self.stdout.write("  3. Consider adding rate limiting instead of hard blocks for some patterns")