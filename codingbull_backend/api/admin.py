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


