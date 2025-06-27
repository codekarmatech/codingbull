from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.db.models import Count, Q, F, Sum
from django.db import models
from django.utils import timezone
from datetime import timedelta
import json
import re
import ipaddress

from .models import (
    Category, BlogPost, Project, Service, ContactInquiry, Testimonial,
    SecurityLog, IPAddress, UserAgent, RateLimitRule, BlacklistRule, 
    SecurityAlert, RateLimitTracker, ErrorLog, PerformanceLog, UserSession
)

# ============================================================================
# EXISTING MODELS ADMIN
# ============================================================================

admin.site.register(Category)
admin.site.register(BlogPost)
admin.site.register(Project)
admin.site.register(Service)
admin.site.register(Testimonial)

@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ['subject', 'name', 'email', 'phone', 'inquiry_type', 'created_at']
    list_filter = ['inquiry_type', 'created_at']
    search_fields = ['name', 'email', 'phone', 'subject', 'message']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Inquiry Details', {
            'fields': ('subject', 'message', 'inquiry_type')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


# ============================================================================
# SECURITY MONITORING ADMIN
# ============================================================================

@admin.register(IPAddress)
class IPAddressAdmin(admin.ModelAdmin):
    list_display = [
        'ip_address', 'country', 'reputation_score', 'total_requests',
        'suspicious_requests', 'blocked_requests', 'is_blacklisted',
        'is_whitelisted', 'last_seen'
    ]
    list_filter = [
        'is_blacklisted', 'is_whitelisted', 'country', 'reputation_score',
        ('last_seen', admin.DateFieldListFilter),
        ('first_seen', admin.DateFieldListFilter),
    ]
    search_fields = ['ip_address', 'country', 'city', 'organization', 'isp']
    readonly_fields = [
        'first_seen', 'last_seen', 'total_requests', 'suspicious_requests',
        'blocked_requests', 'suspicious_ratio', 'reputation_score'
    ]
    actions = ['blacklist_ips', 'whitelist_ips', 'update_reputation']
    list_per_page = 25
    
    fieldsets = (
        ('IP Information', {
            'fields': ('ip_address', 'reputation_score', 'notes')
        }),
        ('Geolocation', {
            'fields': ('country', 'country_code', 'city', 'region', 'organization', 'isp'),
            'classes': ('collapse',)
        }),
        ('Security Status', {
            'fields': ('is_blacklisted', 'is_whitelisted', 'created_by')
        }),
        ('Statistics', {
            'fields': (
                'first_seen', 'last_seen', 'total_requests',
                'suspicious_requests', 'blocked_requests', 'suspicious_ratio'
            ),
            'classes': ('collapse',)
        }),
    )

    @admin.action(description="Blacklist selected IPs")
    def blacklist_ips(self, request, queryset):
        updated = queryset.update(is_blacklisted=True, created_by=request.user)
        self.message_user(request, f'{updated} IP addresses blacklisted.')
    
    @admin.action(description="Whitelist selected IPs")
    def whitelist_ips(self, request, queryset):
        updated = queryset.update(is_whitelisted=True, created_by=request.user)
        self.message_user(request, f'{updated} IP addresses whitelisted.')
    
    @admin.action(description="Update reputation scores")
    def update_reputation(self, request, queryset):
        for ip in queryset:
            ip.update_reputation()
        self.message_user(request, f'Reputation updated for {queryset.count()} IP addresses.')


@admin.register(UserAgent)
class UserAgentAdmin(admin.ModelAdmin):
    list_display = [
        'browser_display', 'os_display', 'device_type', 'is_bot', 
        'is_suspicious', 'request_count', 'last_seen'
    ]
    list_filter = [
        'device_type', 'is_bot', 'is_suspicious', 'is_mobile',
        ('last_seen', admin.DateFieldListFilter),
    ]
    search_fields = ['user_agent_string', 'browser', 'os']
    readonly_fields = [
        'user_agent_hash', 'first_seen', 'last_seen', 'request_count'
    ]
    actions = ['mark_as_suspicious', 'mark_as_safe']
    
    @admin.display(description='Browser', ordering='browser')
    def browser_display(self, obj):
        if obj.browser and obj.browser_version:
            return f"{obj.browser} {obj.browser_version}"
        return obj.browser or 'Unknown'
    
    @admin.display(description='Operating System', ordering='os')
    def os_display(self, obj):
        if obj.os and obj.os_version:
            return f"{obj.os} {obj.os_version}"
        return obj.os or 'Unknown'
    
    @admin.action(description="Mark as suspicious")
    def mark_as_suspicious(self, request, queryset):
        updated = queryset.update(is_suspicious=True)
        self.message_user(request, f'{updated} user agents marked as suspicious.')
    
    @admin.action(description="Mark as safe")
    def mark_as_safe(self, request, queryset):
        updated = queryset.update(is_suspicious=False)
        self.message_user(request, f'{updated} user agents marked as safe.')


@admin.register(SecurityLog)
class SecurityLogAdmin(admin.ModelAdmin):
    list_display = [
        'timestamp', 'method', 'path_short', 'ip_link', 'risk_level_badge',
        'is_suspicious', 'blocked', 'response_status', 'response_time_display'
    ]
    list_filter = [
        'method', 'risk_level', 'is_suspicious', 'blocked', 'response_status',
        ('timestamp', admin.DateFieldListFilter),
        'ip_address__country',
        'user_agent__device_type',
    ]
    search_fields = [
        'path', 'ip_address__ip_address', 'user_agent__user_agent_string',
        'host', 'referer'
    ]
    readonly_fields = [
        'timestamp', 'ip_address', 'user_agent', 'method', 'path', 
        'query_string', 'referer', 'host', 'content_type', 'user',
        'session_key', 'response_status', 'response_time', 'blocked',
        'x_forwarded_for', 'x_real_ip', 'x_forwarded_proto',
        'threat_indicators_display', 'matched_rules_display'
    ]
    date_hierarchy = 'timestamp'
    
    fieldsets = (
        ('Request Information', {
            'fields': (
                'timestamp', 'method', 'path', 'query_string', 'host',
                'content_type', 'referer'
            )
        }),
        ('Client Information', {
            'fields': ('ip_address', 'user_agent', 'user', 'session_key')
        }),
        ('Security Analysis', {
            'fields': (
                'is_suspicious', 'risk_level', 'risk_score', 'blocked',
                'threat_indicators_display', 'matched_rules_display'
            )
        }),
        ('Response Information', {
            'fields': ('response_status', 'response_time'),
            'classes': ('collapse',)
        }),
        ('Headers', {
            'fields': ('x_forwarded_for', 'x_real_ip', 'x_forwarded_proto'),
            'classes': ('collapse',)
        }),
    )
    
    @admin.display(description='Path', ordering='path')
    def path_short(self, obj):
        if len(obj.path) > 50:
            return obj.path[:47] + '...'
        return obj.path
    
    @admin.display(description='IP Address', ordering='ip_address__ip_address')
    def ip_link(self, obj):
        url = reverse('admin:api_ipaddress_change', args=[obj.ip_address.pk])
        return format_html('<a href="{}">{}</a>', url, obj.ip_address.ip_address)
    
    @admin.display(description='Risk Level', ordering='risk_level')
    def risk_level_badge(self, obj):
        colors = {
            'low': 'green',
            'medium': 'orange', 
            'high': 'red',
            'critical': 'darkred'
        }
        color = colors.get(obj.risk_level, 'gray')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.get_risk_level_display()
        )
    
    @admin.display(description='Response Time', ordering='response_time')
    def response_time_display(self, obj):
        if obj.response_time:
            return f"{obj.response_time:.1f}ms"
        return '-'
    
    @admin.display(description='Threat Indicators')
    def threat_indicators_display(self, obj):
        if obj.threat_indicators:
            return format_html('<br>'.join(obj.threat_indicators))
        return 'None'
    
    @admin.display(description='Matched Rules')
    def matched_rules_display(self, obj):
        if obj.matched_rules:
            return format_html('<br>'.join(obj.matched_rules))
        return 'None'


@admin.register(RateLimitRule)
class RateLimitRuleAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'path_pattern', 'max_requests', 'time_window', 
        'block_duration', 'applies_to', 'is_active', 'priority'
    ]
    list_filter = ['is_active', 'applies_to', 'created_at']
    search_fields = ['name', 'path_pattern', 'description']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Rule Information', {
            'fields': ('name', 'description', 'is_active', 'priority')
        }),
        ('Rate Limiting Configuration', {
            'fields': (
                'path_pattern', 'max_requests', 'time_window', 
                'block_duration', 'applies_to'
            )
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:  # Creating new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(BlacklistRule)
class BlacklistRuleAdmin(admin.ModelAdmin):
    list_display = [
        'rule_type_badge', 'pattern_display', 'reason_short', 'status_badge',
        'effectiveness_score', 'match_count_display', 'last_activity', 'expiry_status'
    ]
    list_filter = [
        'rule_type', 'is_active',
        ('created_at', admin.DateFieldListFilter),
        ('expires_at', admin.DateFieldListFilter),
        ('last_matched', admin.DateFieldListFilter),
        'created_by',
    ]
    search_fields = ['pattern', 'reason', 'created_by__username', 'created_by__email']
    readonly_fields = [
        'created_at', 'updated_at', 'match_count', 'last_matched',
        'effectiveness_display', 'pattern_validation_status'
    ]
    actions = [
        'activate_rules', 'deactivate_rules', 'extend_expiry',
        'test_pattern_validity', 'bulk_update_reason', 'export_rules_csv',
        'create_rule_backup', 'analyze_rule_performance', 'bulk_delete_expired'
    ]
    list_per_page = 50
    list_max_show_all = 200
    date_hierarchy = 'created_at'
    ordering = ['-created_at', '-match_count']
    list_select_related = ['created_by']
    
    # Enhanced form configuration
    save_on_top = True

    fieldsets = (
        ('🛡️ Rule Configuration', {
            'fields': (
                'rule_type', 'pattern', 'pattern_validation_status',
                'reason', 'is_active', 'expires_at'
            ),
            'description': 'Configure the blacklist rule pattern and behavior'
        }),
        ('📊 Performance & Statistics', {
            'fields': ('match_count', 'last_matched', 'effectiveness_display'),
            'classes': ('collapse',),
            'description': 'View rule effectiveness and usage statistics'
        }),
        ('👤 Management Information', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',),
            'description': 'Administrative metadata and tracking'
        }),
    )

    @admin.display(description='🏷️ Rule Type', ordering='rule_type')
    def rule_type_badge(self, obj):
        type_colors = {
            'ip': '#007bff',           # Blue for IP
            'ip_range': '#6f42c1',    # Purple for IP Range
            'user_agent': '#fd7e14',  # Orange for User Agent
            'path': '#28a745',        # Green for Path
            'country': '#dc3545',     # Red for Country
            'referer': '#17a2b8',     # Teal for Referer
        }
        type_icons = {
            'ip': '🌐',
            'ip_range': '🌍',
            'user_agent': '🤖',
            'path': '🛣️',
            'country': '🏳️',
            'referer': '🔗',
        }

        color = type_colors.get(obj.rule_type, '#6c757d')
        icon = type_icons.get(obj.rule_type, '📋')
        display_name = obj.get_rule_type_display()

        return format_html(
            '<div style="background: {}; color: white; padding: 4px 8px; border-radius: 6px; '
            'text-align: center; font-weight: bold; font-size: 11px; min-width: 80px;">'
            '{} {}</div>',
            color, icon, display_name
        )

    @admin.display(description='🎯 Pattern', ordering='pattern')
    def pattern_display(self, obj):
        pattern = obj.pattern
        if len(pattern) > 40:
            pattern = pattern[:37] + '...'

        # Add visual indicators for regex patterns
        is_regex = obj.rule_type in ['user_agent', 'path', 'referer']
        regex_indicator = '<small style="color: #4a9eff;">📝 regex</small><br>' if is_regex else ''

        return format_html(
            '<div style="font-family: monospace; font-size: 12px;">'
            '{}<strong>{}</strong></div>',
            regex_indicator, pattern
        )

    @admin.display(description='📝 Reason')
    def reason_short(self, obj):
        reason = obj.reason
        if len(reason) > 30:
            reason = reason[:27] + '...'
        return format_html('<span title="{}">{}</span>', obj.reason, reason)

    @admin.display(description='⚡ Status', ordering='is_active')
    def status_badge(self, obj):
        if not obj.is_active:
            return format_html(
                '<div style="background: #6c757d; color: white; padding: 3px 8px; '
                'border-radius: 4px; text-align: center; font-size: 11px;">'
                '⏸️ INACTIVE</div>'
            )
        elif obj.is_expired:
            return format_html(
                '<div style="background: #ffc107; color: #212529; padding: 3px 8px; '
                'border-radius: 4px; text-align: center; font-size: 11px; font-weight: bold;">'
                '⏰ EXPIRED</div>'
            )
        else:
            return format_html(
                '<div style="background: #28a745; color: white; padding: 3px 8px; '
                'border-radius: 4px; text-align: center; font-size: 11px; font-weight: bold;">'
                '✅ ACTIVE</div>'
            )

    @admin.display(description='🎯 Effectiveness')
    def effectiveness_score(self, obj):
        # Calculate effectiveness based on match count and age
        if obj.created_at:
            days_since_created = (timezone.now() - obj.created_at).days or 1
        else:
            days_since_created = 1
        effectiveness = min(100, (obj.match_count / days_since_created) * 10)

        if effectiveness >= 80:
            color, icon = '#28a745', '🔥'  # High effectiveness
        elif effectiveness >= 50:
            color, icon = '#ffc107', '⚡'  # Medium effectiveness
        elif effectiveness >= 20:
            color, icon = '#fd7e14', '📊'  # Low effectiveness
        else:
            color, icon = '#6c757d', '💤'  # Very low effectiveness

        return format_html(
            '<div style="color: {}; font-weight: bold; text-align: center;">'
            '{} {}%</div>',
            color, icon, int(effectiveness)
        )

    @admin.display(description='🎯 Matches', ordering='match_count')
    def match_count_display(self, obj):
        if obj.match_count == 0:
            return format_html('<span style="color: #6c757d;">0 matches</span>')
        elif obj.match_count < 10:
            return format_html('<span style="color: #28a745; font-weight: bold;">{}</span>', obj.match_count)
        elif obj.match_count < 100:
            return format_html('<span style="color: #ffc107; font-weight: bold;">{}</span>', obj.match_count)
        else:
            return format_html('<span style="color: #dc3545; font-weight: bold;">{}</span>', obj.match_count)

    @admin.display(description='⏰ Last Activity', ordering='last_matched')
    def last_activity(self, obj):
        if not obj.last_matched:
            return format_html('<span style="color: #6c757d;">Never matched</span>')

        time_diff = timezone.now() - obj.last_matched
        if time_diff.days == 0:
            if time_diff.seconds < 3600:
                return format_html('<span style="color: #28a745; font-weight: bold;">{}m ago</span>',
                                 time_diff.seconds // 60)
            else:
                return format_html('<span style="color: #28a745; font-weight: bold;">{}h ago</span>',
                                 time_diff.seconds // 3600)
        elif time_diff.days < 7:
            return format_html('<span style="color: #ffc107;">{} days ago</span>', time_diff.days)
        else:
            return format_html('<span style="color: #6c757d;">{}</span>',
                             obj.last_matched.strftime('%Y-%m-%d'))

    @admin.display(description='⏳ Expiry', ordering='expires_at')
    def expiry_status(self, obj):
        if not obj.expires_at:
            return format_html('<span style="color: #6c757d;">No expiry</span>')

        time_until_expiry = obj.expires_at - timezone.now()
        if time_until_expiry.total_seconds() <= 0:
            return format_html('<span style="color: #dc3545; font-weight: bold;">⚠️ EXPIRED</span>')
        elif time_until_expiry.days <= 1:
            return format_html('<span style="color: #ffc107; font-weight: bold;">⚠️ {}h left</span>',
                             int(time_until_expiry.total_seconds() // 3600))
        elif time_until_expiry.days <= 7:
            return format_html('<span style="color: #fd7e14;">{} days left</span>', time_until_expiry.days)
        else:
            return format_html('<span style="color: #28a745;">{}</span>',
                             obj.expires_at.strftime('%Y-%m-%d'))

    @admin.display(description='📊 Rule Effectiveness Analysis')
    def effectiveness_display(self, obj):
        if obj.created_at:
            days_active = (timezone.now() - obj.created_at).days or 1
        else:
            days_active = 1
        matches_per_day = obj.match_count / days_active

        analysis = []
        analysis.append("📅 Active for: {} days".format(days_active))
        analysis.append("🎯 Total matches: {}".format(obj.match_count))
        analysis.append("📊 Avg matches/day: {}".format(round(matches_per_day, 2)))

        if obj.last_matched:
            days_since_match = (timezone.now() - obj.last_matched).days
            analysis.append("⏰ Last match: {} days ago".format(days_since_match))
        else:
            analysis.append("⏰ Never matched")

        # Effectiveness rating
        if matches_per_day >= 1:
            rating = "🔥 Highly Effective"
        elif matches_per_day >= 0.1:
            rating = "⚡ Moderately Effective"
        elif obj.match_count > 0:
            rating = "📊 Low Activity"
        else:
            rating = "💤 No Activity"

        analysis.append("📈 Rating: {}".format(rating))

        return format_html('<br>'.join(analysis))

    @admin.display(description='✅ Pattern Validation')
    def pattern_validation_status(self, obj):
        """Validate pattern syntax for regex-based rules"""
        if obj.rule_type in ['user_agent', 'path', 'referer']:
            try:
                re.compile(obj.pattern)
                return format_html('<span style="color: #28a745;">✅ Valid regex pattern</span>')
            except re.error as e:
                return format_html('<span style="color: #dc3545;">❌ Invalid regex: {}</span>', str(e))
        elif obj.rule_type == 'ip_range':
            try:
                ipaddress.ip_network(obj.pattern, strict=False)
                return format_html('<span style="color: #28a745;">✅ Valid IP range</span>')
            except ValueError as e:
                return format_html('<span style="color: #dc3545;">❌ Invalid IP range: {}</span>', str(e))
        else:
            return format_html('<span style="color: #6c757d;">ℹ️ No validation needed</span>')

    @admin.display(description='🔒 Security Impact Analysis')
    def security_impact_analysis(self, obj):
        """Provide comprehensive security impact analysis"""
        analysis = []
        
        # Rule effectiveness analysis
        if obj.created_at:
            days_active = (timezone.now() - obj.created_at).days or 1
        else:
            days_active = 1
        if obj.match_count > 0:
            matches_per_day = obj.match_count / days_active
            analysis.append("🎯 Activity Level: {} matches/day".format(round(matches_per_day, 2)))
            
            # Threat level assessment
            if matches_per_day >= 10:
                threat_level = "🚨 High-Volume Threat"
                color = "#dc3545"
            elif matches_per_day >= 1:
                threat_level = "⚠️ Active Threat"
                color = "#fd7e14"
            elif matches_per_day >= 0.1:
                threat_level = "📊 Low-Level Threat"
                color = "#ffc107"
            else:
                threat_level = "💤 Minimal Activity"
                color = "#6c757d"
            
            analysis.append('<span style="color: {}; font-weight: bold;">{}</span>'.format(color, threat_level))
        else:
            analysis.append("💤 No security incidents detected")
        
        # Rule scope analysis
        if obj.rule_type == 'ip':
            analysis.append("🌐 Scope: Single IP address")
        elif obj.rule_type == 'ip_range':
            analysis.append("🌍 Scope: IP address range")
        elif obj.rule_type == 'country':
            analysis.append("🏳️ Scope: Country-wide blocking")
        elif obj.rule_type == 'user_agent':
            analysis.append("🤖 Scope: User agent pattern")
        elif obj.rule_type == 'path':
            analysis.append("🛣️ Scope: URL path pattern")
        elif obj.rule_type == 'referer':
            analysis.append("🔗 Scope: Referer pattern")
        
        # Expiry analysis
        if obj.expires_at:
            if obj.is_expired:
                analysis.append('<span style="color: #dc3545;">⚠️ Rule expired - needs review</span>')
            else:
                days_left = (obj.expires_at - timezone.now()).days
                if days_left <= 7:
                    analysis.append('<span style="color: #ffc107;">⏰ Expires in {} days</span>'.format(days_left))
                else:
                    analysis.append("⏰ Expires: {}".format(obj.expires_at.strftime('%Y-%m-%d')))
        else:
            analysis.append("∞ Permanent rule")
        
        return format_html('<br>'.join(analysis))

    # Admin Actions
    @admin.action(description="🟢 Activate selected rules")
    def activate_rules(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, '✅ {} blacklist rules activated.'.format(updated))

    @admin.action(description="🔴 Deactivate selected rules")
    def deactivate_rules(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, '⏸️ {} blacklist rules deactivated.'.format(updated))

    @admin.action(description="⏰ Extend expiry by 30 days")
    def extend_expiry(self, request, queryset):
        from datetime import timedelta
        new_expiry = timezone.now() + timedelta(days=30)
        updated = 0
        for rule in queryset:
            if rule.expires_at:
                rule.expires_at = max(rule.expires_at, timezone.now()) + timedelta(days=30)
            else:
                rule.expires_at = new_expiry
            rule.save(update_fields=['expires_at'])
            updated += 1
        self.message_user(request, '⏰ Extended expiry for {} rules by 30 days.'.format(updated))

    @admin.action(description="🔍 Test pattern validity")
    def test_pattern_validity(self, request, queryset):
        valid_count = 0
        invalid_count = 0
        invalid_rules = []

        for rule in queryset:
            try:
                if rule.rule_type in ['user_agent', 'path', 'referer']:
                    re.compile(rule.pattern)
                elif rule.rule_type == 'ip_range':
                    ipaddress.ip_network(rule.pattern, strict=False)
                valid_count += 1
            except (re.error, ValueError) as e:
                invalid_count += 1
                invalid_rules.append("{}: {}... - {}".format(rule.get_rule_type_display(), rule.pattern[:30], str(e)))

        message = '✅ {} valid patterns, ❌ {} invalid patterns.'.format(valid_count, invalid_count)
        if invalid_rules:
            message += ' Invalid rules: {}'.format("; ".join(invalid_rules[:3]))
            if len(invalid_rules) > 3:
                message += ' and {} more...'.format(len(invalid_rules) - 3)

        if invalid_count > 0:
            self.message_user(request, message, level='WARNING')
        else:
            self.message_user(request, message)

    @admin.action(description="📝 Bulk update reason")
    def bulk_update_reason(self, request, queryset):
        # This would typically open a form, but for simplicity, we'll add a prefix
        updated = queryset.count()  # Just count for display
        self.message_user(
            request,
            '📝 Selected {} rules for bulk reason update. Edit individual rules to update reasons.'.format(updated),
            level='INFO'
        )

    @admin.action(description="📊 Export rules to CSV")
    def export_rules_csv(self, request, queryset):
        """Export selected rules to CSV format"""
        import csv
        from django.http import HttpResponse
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="blacklist_rules_{}.csv"'.format(
            timezone.now().strftime('%Y%m%d_%H%M%S')
        )
        
        writer = csv.writer(response)
        writer.writerow([
            'Rule Type', 'Pattern', 'Reason', 'Is Active', 'Created At', 
            'Expires At', 'Match Count', 'Last Matched', 'Created By'
        ])
        
        for rule in queryset.select_related('created_by'):
            writer.writerow([
                rule.get_rule_type_display(),
                rule.pattern,
                rule.reason,
                'Yes' if rule.is_active else 'No',
                rule.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                rule.expires_at.strftime('%Y-%m-%d %H:%M:%S') if rule.expires_at else 'Never',
                rule.match_count,
                rule.last_matched.strftime('%Y-%m-%d %H:%M:%S') if rule.last_matched else 'Never',
                rule.created_by.username if rule.created_by else 'System'
            ])
        
        self.message_user(request, '📊 Exported {} rules to CSV.'.format(queryset.count()))
        return response

    @admin.action(description="💾 Create rule backup")
    def create_rule_backup(self, request, queryset):
        """Create a JSON backup of selected rules"""
        from django.http import HttpResponse
        from django.core import serializers
        
        response = HttpResponse(content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename="blacklist_rules_backup_{}.json"'.format(
            timezone.now().strftime('%Y%m%d_%H%M%S')
        )
        
        # Serialize the queryset to JSON
        serialized_data = serializers.serialize('json', queryset, 
                                              fields=('rule_type', 'pattern', 'reason', 'is_active', 
                                                     'expires_at', 'created_at', 'match_count', 'last_matched'))
        
        response.write(serialized_data)
        self.message_user(request, '💾 Created backup of {} rules.'.format(queryset.count()))
        return response

    @admin.action(description="📈 Analyze rule performance")
    def analyze_rule_performance(self, request, queryset):
        """Analyze performance of selected rules"""
        total_rules = queryset.count()
        active_rules = queryset.filter(is_active=True).count()
        expired_rules = queryset.filter(expires_at__lt=timezone.now()).count()
        never_matched = queryset.filter(match_count=0).count()
        high_activity = queryset.filter(match_count__gte=100).count()
        
        # Calculate average effectiveness
        total_matches = sum(rule.match_count for rule in queryset)
        total_days = sum((timezone.now() - rule.created_at).days or 1 for rule in queryset)
        avg_effectiveness = (total_matches / total_days) if total_days > 0 else 0
        
        message = (
            '📈 Performance Analysis for {} rules: '
            '✅ {} active, ❌ {} expired, '
            '💤 {} never matched, 🔥 {} high-activity. '
            'Average effectiveness: {} matches/day per rule.'
        ).format(
            total_rules, active_rules, expired_rules, 
            never_matched, high_activity, round(avg_effectiveness, 2)
        )
        
        self.message_user(request, message, level='INFO')

    @admin.action(description="🗑️ Bulk delete expired rules")
    def bulk_delete_expired(self, request, queryset):
        """Delete expired rules that haven't been active"""
        expired_rules = queryset.filter(
            expires_at__lt=timezone.now(),
            match_count=0  # Only delete rules that never matched
        )
        
        count = expired_rules.count()
        if count > 0:
            expired_rules.delete()
            self.message_user(request, '🗑️ Deleted {} expired rules with no activity.'.format(count))
        else:
            self.message_user(request, 'ℹ️ No expired rules with zero activity found.', level='INFO')

    def get_queryset(self, request):
        """Optimize queryset with select_related for better performance"""
        return super().get_queryset(request).select_related('created_by')

    def changelist_view(self, request, extra_context=None):
        """Add summary statistics to the changelist view"""
        if extra_context is None:
            extra_context = {}

        # Get statistics
        queryset = self.get_queryset(request)
        total_rules = queryset.count()
        active_rules = queryset.filter(is_active=True).count()
        expired_rules = queryset.filter(
            expires_at__lt=timezone.now(),
            is_active=True
        ).count()

        # Rules by type
        from .models import BlacklistRule
        rule_types = {}
        for rule_type, display_name in BlacklistRule.RULE_TYPES:
            count = queryset.filter(rule_type=rule_type).count()
            rule_types[display_name] = count

        # Recent activity
        recent_matches = queryset.filter(
            last_matched__gte=timezone.now() - timedelta(days=7)
        ).count()

        # Most effective rules (top 5 by match count)
        top_rules = queryset.filter(match_count__gt=0).order_by('-match_count')[:5]

        extra_context['blacklist_stats'] = {  # type: ignore
            'total_rules': total_rules,
            'active_rules': active_rules,
            'expired_rules': expired_rules,
            'rule_types': rule_types,
            'recent_matches': recent_matches,
            'top_rules': top_rules,
        }

        return super().changelist_view(request, extra_context)

    def save_model(self, request, obj, form, change):
        """Enhanced save with validation and audit logging"""
        if not change:  # Creating new object
            obj.created_by = request.user
            
            # Log rule creation
            self.message_user(
                request,
                '✅ Created new {} blacklist rule: {}'.format(
                    obj.get_rule_type_display().lower(),
                    obj.pattern[:50] + ('...' if len(obj.pattern) > 50 else '')
                ),
                level='INFO'
            )
        else:
            # Log rule modification
            self.message_user(
                request,
                '📝 Updated {} blacklist rule: {}'.format(
                    obj.get_rule_type_display().lower(),
                    obj.pattern[:50] + ('...' if len(obj.pattern) > 50 else '')
                ),
                level='INFO'
            )
        
        super().save_model(request, obj, form, change)

    def delete_model(self, request, obj):
        """Enhanced delete with audit logging"""
        rule_info = '{}: {}'.format(obj.get_rule_type_display(), obj.pattern[:50])
        super().delete_model(request, obj)
        
        self.message_user(
            request,
            '🗑️ Deleted blacklist rule: {}'.format(rule_info),
            level='WARNING'
        )

    def delete_queryset(self, request, queryset):
        """Enhanced bulk delete with audit logging"""
        count = queryset.count()
        rule_types = {}
        
        # Count by type for logging
        for rule in queryset:
            rule_type = rule.get_rule_type_display()
            rule_types[rule_type] = rule_types.get(rule_type, 0) + 1
        
        super().delete_queryset(request, queryset)
        
        type_summary = ', '.join(['{}: {}'.format(k, v) for k, v in rule_types.items()])
        self.message_user(
            request,
            '🗑️ Bulk deleted {} blacklist rules ({}). Security posture may be affected.'.format(
                count, type_summary
            ),
            level='WARNING'
        )

    def get_readonly_fields(self, request, obj=None):
        """Dynamic readonly fields based on user permissions"""
        # Ensure we only work with string field names
        readonly = [field for field in self.readonly_fields if isinstance(field, str)]
        
        # Make certain fields readonly for non-superusers
        if not request.user.is_superuser:
            readonly.extend(['created_by'])
            
        # Make critical fields readonly after creation for safety
        if obj and obj.pk:
            if obj.match_count > 100:  # High-impact rules
                readonly.extend(['rule_type', 'pattern'])
                
        return readonly


    def has_delete_permission(self, request, obj=None):
        """Enhanced delete permissions for enterprise security"""
        if not super().has_delete_permission(request, obj):
            return False
            
        # Prevent deletion of high-impact rules by non-superusers
        if obj and obj.match_count > 1000 and not request.user.is_superuser:
            return False
            
        return True

    def response_add(self, request, obj, post_url_continue=None):
        """Enhanced response after adding with validation recommendations"""
        response = super().response_add(request, obj, post_url_continue)
        
        # Provide recommendations for new rules
        if obj.rule_type in ['user_agent', 'path', 'referer']:
            self.message_user(
                request,
                'ℹ️ Tip: Test your regex pattern with sample data to ensure it works as expected.',
                level='INFO'
            )
        elif obj.rule_type == 'ip_range':
            self.message_user(
                request,
                'ℹ️ Tip: IP range rules can have broad impact. Monitor effectiveness regularly.',
                level='INFO'
            )
            
        return response

    class Media:
        css = {
            'all': ('admin/css/blacklist_admin.css',)
        }
        js = ('admin/js/blacklist_admin.js',)


@admin.register(SecurityAlert)
class SecurityAlertAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'alert_type', 'severity_badge', 'ip_link', 
        'is_acknowledged', 'created_at'
    ]
    list_filter = [
        'alert_type', 'severity', 'is_acknowledged',
        ('created_at', admin.DateFieldListFilter),
        'ip_address__country',
    ]
    search_fields = ['title', 'description', 'ip_address__ip_address']
    readonly_fields = [
        'created_at', 'security_log', 'additional_data_display'
    ]
    actions = ['acknowledge_alerts']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Alert Information', {
            'fields': ('alert_type', 'severity', 'title', 'description')
        }),
        ('Related Objects', {
            'fields': ('security_log', 'ip_address')
        }),
        ('Status', {
            'fields': (
                'is_acknowledged', 'acknowledged_by', 'acknowledged_at'
            )
        }),
        ('Additional Data', {
            'fields': ('additional_data_display',),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    @admin.display(description='Severity', ordering='severity')
    def severity_badge(self, obj):
        colors = {
            'info': 'blue',
            'warning': 'orange',
            'error': 'red',
            'critical': 'darkred'
        }
        color = colors.get(obj.severity, 'gray')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.get_severity_display()
        )
    
    @admin.display(description='IP Address')
    def ip_link(self, obj):
        if obj.ip_address:
            url = reverse('admin:api_ipaddress_change', args=[obj.ip_address.pk])
            return format_html('<a href="{}">{}</a>', url, obj.ip_address.ip_address)
        return '-'
    
    @admin.display(description='Additional Data')
    def additional_data_display(self, obj):
        if obj.additional_data:
            return format_html('<pre>{}</pre>', json.dumps(obj.additional_data, indent=2))
        return 'None'
    
    @admin.action(description="Acknowledge selected alerts")
    def acknowledge_alerts(self, request, queryset):
        updated = 0
        for alert in queryset.filter(is_acknowledged=False):
            alert.acknowledge(request.user)
            updated += 1
        self.message_user(request, f'{updated} alerts acknowledged.')


@admin.register(RateLimitTracker)
class RateLimitTrackerAdmin(admin.ModelAdmin):
    list_display = [
        'identifier', 'rule', 'request_count', 'max_requests',
        'is_blocked', 'blocked_until', 'window_start'
    ]
    list_filter = [
        'is_blocked', 'rule__name',
        ('window_start', admin.DateFieldListFilter),
        ('blocked_until', admin.DateFieldListFilter),
    ]
    search_fields = ['identifier', 'rule__name']
    readonly_fields = [
        'window_start', 'last_request', 'max_requests'
    ]
    
    @admin.display(description='Max Requests')
    def max_requests(self, obj):
        return obj.rule.max_requests


# ============================================================================
# ADMIN SITE CUSTOMIZATION
# ============================================================================

admin.site.site_header = "CodingBull Admin Dashboard"
admin.site.site_title = "CodingBull Admin"
admin.site.index_title = "CodingBull Management Dashboard"


# ============================================================================
# ERROR TRACKING ADMIN
# ============================================================================

@admin.register(ErrorLog)
class ErrorLogAdmin(admin.ModelAdmin):
    list_display = [
        'timestamp', 'error_type', 'severity', 'message_preview', 
        'url_preview', 'user_id', 'browser_info_preview', 'is_resolved'
    ]
    list_filter = [
        'error_type', 'severity', 'is_resolved', 'timestamp',
        ('timestamp', admin.DateFieldListFilter)
    ]
    search_fields = ['message', 'url', 'user_id', 'session_id']
    readonly_fields = [
        'timestamp', 'first_seen', 'last_seen', 'formatted_stack_trace',
        'formatted_breadcrumbs', 'formatted_browser_info', 'formatted_extra_data'
    ]
    fieldsets = (
        ('Error Information', {
            'fields': ('timestamp', 'error_type', 'severity', 'message', 'count')
        }),
        ('Technical Details', {
            'fields': ('formatted_stack_trace', 'component_stack'),
            'classes': ('collapse',)
        }),
        ('Context', {
            'fields': ('url', 'user_agent', 'formatted_browser_info'),
            'classes': ('collapse',)
        }),
        ('User Information', {
            'fields': ('user_id', 'session_id'),
        }),
        ('Performance Data', {
            'fields': ('page_load_time', 'memory_usage'),
            'classes': ('collapse',)
        }),
        ('User Journey', {
            'fields': ('formatted_breadcrumbs',),
            'classes': ('collapse',)
        }),
        ('Additional Data', {
            'fields': ('formatted_extra_data',),
            'classes': ('collapse',)
        }),
        ('Tracking', {
            'fields': ('first_seen', 'last_seen', 'is_resolved', 'resolved_at', 'resolved_by'),
        }),
    )
    ordering = ['-timestamp']
    date_hierarchy = 'timestamp'
    actions = ['mark_as_resolved', 'mark_as_unresolved']

    @admin.display(description='Message')
    def message_preview(self, obj):
        return obj.message[:100] + '...' if len(obj.message) > 100 else obj.message

    @admin.display(description='URL')
    def url_preview(self, obj):
        if obj.url:
            return format_html('<a href="{}" target="_blank">{}</a>', 
                             obj.url, obj.url[:50] + '...' if len(obj.url) > 50 else obj.url)
        return '-'

    @admin.display(description='Browser/OS')
    def browser_info_preview(self, obj):
        if obj.browser_info:
            browser = obj.browser_info.get('browser', 'Unknown')
            os = obj.browser_info.get('os', 'Unknown')
            device = obj.browser_info.get('device', 'Unknown')
            return f"{browser} on {os} ({device})"
        return '-'


    @admin.display(description='Stack Trace')
    def formatted_stack_trace(self, obj):
        if obj.stack_trace:
            return format_html('<pre style="white-space: pre-wrap; max-height: 300px; overflow-y: auto;">{}</pre>', 
                             obj.stack_trace)
        return 'No stack trace available'


    @admin.display(description='User Journey (Last 10 actions)')
    def formatted_breadcrumbs(self, obj):
        if obj.breadcrumbs:
            html = '<div style="max-height: 300px; overflow-y: auto;">'
            for i, breadcrumb in enumerate(obj.breadcrumbs[-10:]):  # Show last 10
                timestamp = breadcrumb.get('timestamp', 'Unknown time')
                action = breadcrumb.get('message', 'Unknown action')
                breadcrumb_type = breadcrumb.get('type', 'unknown')
                
                # Escape HTML in the dynamic content to prevent XSS
                from django.utils.html import escape
                timestamp = escape(str(timestamp))
                action = escape(str(action))
                breadcrumb_type = escape(str(breadcrumb_type))
                
                html += f'<div style="margin-bottom: 8px; padding: 8px; background: #f8f9fa; border-left: 3px solid #007cba;">'
                html += f'<strong>{timestamp}</strong><br>'
                html += f'<span style="color: #666;">[{breadcrumb_type}]</span> {action}'
                if breadcrumb.get('data'):
                    import json
                    try:
                        # If data is a dict, format it nicely
                        if isinstance(breadcrumb["data"], dict):
                            data = json.dumps(breadcrumb["data"], indent=2)
                        else:
                            data = str(breadcrumb["data"])
                        data = escape(data)
                        html += f'<br><small style="color: #999; white-space: pre-wrap;">{data}</small>'
                    except Exception:
                        # Fallback for any formatting issues
                        data = escape(str(breadcrumb["data"]))
                        html += f'<br><small style="color: #999;">{data}</small>'
                html += '</div>'
            html += '</div>'
            return mark_safe(html)
        return 'No breadcrumbs available'

    @admin.display(description='Browser Information')
    def formatted_browser_info(self, obj):
        if obj.browser_info:
            return format_html('<pre>{}</pre>', json.dumps(obj.browser_info, indent=2))
        return 'No browser info available'

    @admin.display(description='Additional Data')
    def formatted_extra_data(self, obj):
        if obj.extra_data:
            return format_html('<pre>{}</pre>', json.dumps(obj.extra_data, indent=2))
        return 'No additional data'

    @admin.action(description='Mark selected errors as resolved')
    def mark_as_resolved(self, request, queryset):
        updated = queryset.update(
            is_resolved=True, 
            resolved_at=timezone.now(),
            resolved_by=request.user.username
        )
        self.message_user(request, f'{updated} errors marked as resolved.')

    @admin.action(description='Mark selected errors as unresolved')
    def mark_as_unresolved(self, request, queryset):
        updated = queryset.update(
            is_resolved=False, 
            resolved_at=None,
            resolved_by=None
        )
        self.message_user(request, f'{updated} errors marked as unresolved.')


@admin.register(PerformanceLog)
class PerformanceLogAdmin(admin.ModelAdmin):
    list_display = [
        'timestamp', 'metric_type', 'duration_ms', 'url_preview', 
        'user_id', 'session_id'
    ]
    list_filter = [
        'metric_type', 'timestamp',
        ('timestamp', admin.DateFieldListFilter)
    ]
    search_fields = ['url', 'user_id', 'session_id']
    readonly_fields = ['timestamp', 'formatted_metrics']
    fieldsets = (
        ('Performance Metric', {
            'fields': ('timestamp', 'metric_type', 'duration', 'url')
        }),
        ('User Context', {
            'fields': ('user_id', 'session_id', 'user_agent'),
            'classes': ('collapse',)
        }),
        ('Additional Metrics', {
            'fields': ('formatted_metrics',),
            'classes': ('collapse',)
        }),
    )
    ordering = ['-timestamp']
    date_hierarchy = 'timestamp'

    @admin.display(description='Duration')
    def duration_ms(self, obj):
        return f"{obj.duration} ms"

    @admin.display(description='URL')
    def url_preview(self, obj):
        if obj.url:
            return format_html('<a href="{}" target="_blank">{}</a>', 
                             obj.url, obj.url[:50] + '...' if len(obj.url) > 50 else obj.url)
        return '-'

    @admin.display(description='Additional Metrics')
    def formatted_metrics(self, obj):
        if obj.metrics:
            return format_html('<pre>{}</pre>', json.dumps(obj.metrics, indent=2))
        return 'No additional metrics'


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = [
        'session_id_preview', 'user_id', 'start_time', 'duration_minutes',
        'page_views', 'errors_encountered', 'browser_preview', 'country'
    ]
    list_filter = [
        'start_time', 'country',
        ('start_time', admin.DateFieldListFilter)
    ]
    search_fields = ['session_id', 'user_id', 'ip_address', 'country', 'city']
    readonly_fields = [
        'start_time', 'last_activity', 'duration_display', 
        'formatted_browser_info'
    ]
    fieldsets = (
        ('Session Information', {
            'fields': ('session_id', 'user_id', 'start_time', 'last_activity', 'duration_display')
        }),
        ('Activity', {
            'fields': ('page_views', 'errors_encountered'),
        }),
        ('Technical Details', {
            'fields': ('user_agent', 'formatted_browser_info'),
            'classes': ('collapse',)
        }),
        ('Location', {
            'fields': ('ip_address', 'country', 'city'),
            'classes': ('collapse',)
        }),
    )
    ordering = ['-start_time']
    date_hierarchy = 'start_time'

    @admin.display(description='Session ID')
    def session_id_preview(self, obj):
        return obj.session_id[:20] + '...' if len(obj.session_id) > 20 else obj.session_id

    @admin.display(description='Duration')
    def duration_minutes(self, obj):
        return f"{obj.duration // 60} min" if obj.duration else "0 min"

    @admin.display(description='Session Duration')
    def duration_display(self, obj):
        if obj.duration:
            hours = obj.duration // 3600
            minutes = (obj.duration % 3600) // 60
            seconds = obj.duration % 60
            return f"{hours}h {minutes}m {seconds}s"
        return "0s"

    @admin.display(description='Browser/OS')
    def browser_preview(self, obj):
        if obj.browser_info:
            browser = obj.browser_info.get('browser', 'Unknown')
            os = obj.browser_info.get('os', 'Unknown')
            return f"{browser} / {os}"
        return '-'

    @admin.display(description='Browser Information')
    def formatted_browser_info(self, obj):
        if obj.browser_info:
            return format_html('<pre>{}</pre>', json.dumps(obj.browser_info, indent=2))
        return 'No browser info available'


