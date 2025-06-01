from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
import json

from .models import (
    Category, BlogPost, Project, Service, ContactInquiry, Testimonial,
    SecurityLog, IPAddress, UserAgent, RateLimitRule, BlacklistRule, 
    SecurityAlert, RateLimitTracker
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
        'ip_address', 'reputation_score_badge', 'country', 'total_requests', 
        'suspicious_requests', 'blocked_requests', 'suspicious_ratio_display',
        'is_blacklisted', 'is_whitelisted', 'last_seen'
    ]
    list_filter = [
        'is_blacklisted', 'is_whitelisted', 'country', 'reputation_score',
        ('last_seen', admin.DateFieldListFilter),
        ('first_seen', admin.DateFieldListFilter),
    ]
    search_fields = ['ip_address', 'country', 'city', 'organization', 'isp']
    readonly_fields = [
        'first_seen', 'last_seen', 'total_requests', 'suspicious_requests', 
        'blocked_requests', 'suspicious_ratio_display', 'reputation_score'
    ]
    actions = ['blacklist_ips', 'whitelist_ips', 'update_reputation']
    
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
                'suspicious_requests', 'blocked_requests', 'suspicious_ratio_display'
            ),
            'classes': ('collapse',)
        }),
    )
    
    @admin.display(description='Reputation', ordering='reputation_score')
    def reputation_score_badge(self, obj):
        if obj.reputation_score >= 80:
            color = 'green'
        elif obj.reputation_score >= 50:
            color = 'orange'
        else:
            color = 'red'
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.reputation_score
        )
    
    @admin.display(description='Suspicious %')
    def suspicious_ratio_display(self, obj):
        ratio = obj.suspicious_ratio
        if ratio > 50:
            color = 'red'
        elif ratio > 25:
            color = 'orange'
        else:
            color = 'green'
        
        return format_html(
            '<span style="color: {};">{:.1f}%</span>',
            color, ratio
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
        'rule_type', 'pattern_short', 'reason', 'is_active', 
        'match_count', 'last_matched', 'expires_at'
    ]
    list_filter = [
        'rule_type', 'is_active', 'created_at',
        ('expires_at', admin.DateFieldListFilter),
        ('last_matched', admin.DateFieldListFilter),
    ]
    search_fields = ['pattern', 'reason']
    readonly_fields = ['created_at', 'updated_at', 'match_count', 'last_matched']
    
    fieldsets = (
        ('Rule Configuration', {
            'fields': ('rule_type', 'pattern', 'reason', 'is_active', 'expires_at')
        }),
        ('Statistics', {
            'fields': ('match_count', 'last_matched'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    @admin.display(description='Pattern', ordering='pattern')
    def pattern_short(self, obj):
        if len(obj.pattern) > 50:
            return obj.pattern[:47] + '...'
        return obj.pattern
    
    def save_model(self, request, obj, form, change):
        if not change:  # Creating new object
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


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

admin.site.site_header = "CodingBull Security Monitoring"
admin.site.site_title = "Security Admin"
admin.site.index_title = "Security Monitoring Dashboard"
