"""
Custom Admin Views for Error Tracking Dashboard
"""

from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count, Q, Avg, Max, Sum
from django.utils import timezone
from datetime import timedelta
from .models import (
    ErrorLog, PerformanceLog, UserSession, BlogPost, Project, Service, 
    Testimonial, ContactInquiry, Category, SecurityLog, IPAddress, 
    SecurityAlert, BlacklistRule, RateLimitRule, UserAgent
)
import json


@staff_member_required
def admin_dashboard_overview(request):
    """
    Comprehensive admin dashboard overview with all key metrics
    """
    now = timezone.now()
    last_24h = now - timedelta(hours=24)
    last_7d = now - timedelta(days=7)
    last_30d = now - timedelta(days=30)
    
    # Content Statistics
    content_stats = {
        'blog_posts': BlogPost.objects.count(),
        'projects': Project.objects.count(),
        'services': Service.objects.count(),
        'testimonials': Testimonial.objects.count(),
        'categories': Category.objects.count(),
        'contact_inquiries': ContactInquiry.objects.count(),
        'new_inquiries_24h': ContactInquiry.objects.filter(created_at__gte=last_24h).count(),
    }
    
    # Security Statistics
    security_stats = {
        'total_security_logs': SecurityLog.objects.count(),
        'security_logs_24h': SecurityLog.objects.filter(timestamp__gte=last_24h).count(),
        'suspicious_activities': SecurityLog.objects.filter(is_suspicious=True).count(),
        'blocked_requests': SecurityLog.objects.filter(blocked=True).count(),
        'critical_alerts': SecurityAlert.objects.filter(severity='critical', is_acknowledged=False).count(),
        'total_ip_addresses': IPAddress.objects.count(),
        'blacklisted_ips': IPAddress.objects.filter(is_blacklisted=True).count(),
        'active_blacklist_rules': BlacklistRule.objects.filter(is_active=True).count(),
        'active_rate_limit_rules': RateLimitRule.objects.filter(is_active=True).count(),
    }
    
    # Error & Performance Statistics
    error_stats = {
        'total_errors': ErrorLog.objects.count(),
        'errors_24h': ErrorLog.objects.filter(timestamp__gte=last_24h).count(),
        'critical_errors': ErrorLog.objects.filter(severity='critical', is_resolved=False).count(),
        'unresolved_errors': ErrorLog.objects.filter(is_resolved=False).count(),
        'avg_page_load_time': PerformanceLog.objects.filter(
            metric_type='page_load', timestamp__gte=last_7d
        ).aggregate(avg_duration=Avg('duration'))['avg_duration'] or 0,
        'total_sessions': UserSession.objects.count(),
        'sessions_24h': UserSession.objects.filter(start_time__gte=last_24h).count(),
    }
    
    # Recent Activity
    recent_activity = {
        'recent_blog_posts': BlogPost.objects.order_by('-published_date')[:5],
        'recent_projects': Project.objects.order_by('-id')[:5],
        'recent_inquiries': ContactInquiry.objects.order_by('-created_at')[:5],
        'recent_critical_errors': ErrorLog.objects.filter(
            severity='critical'
        ).order_by('-timestamp')[:5],
        'recent_security_alerts': SecurityAlert.objects.filter(
            is_acknowledged=False
        ).order_by('-created_at')[:5],
    }
    
    # Top Statistics
    top_stats = {
        'top_error_types': ErrorLog.objects.values('error_type').annotate(
            count=Count('id')
        ).order_by('-count')[:5],
        'top_affected_urls': ErrorLog.objects.values('url').annotate(
            error_count=Count('id')
        ).order_by('-error_count')[:5],
        'top_suspicious_ips': IPAddress.objects.filter(
            suspicious_requests__gt=0
        ).order_by('-suspicious_requests')[:5],
    }
    
    context = {
        'title': 'Admin Dashboard Overview',
        'content_stats': content_stats,
        'security_stats': security_stats,
        'error_stats': error_stats,
        'recent_activity': recent_activity,
        'top_stats': top_stats,
    }
    
    return render(request, 'admin/dashboard_overview.html', context)


@staff_member_required
def error_tracking_dashboard(request):
    """
    Custom admin dashboard for error tracking analytics
    """
    # Time ranges
    now = timezone.now()
    last_24h = now - timedelta(hours=24)
    last_7d = now - timedelta(days=7)
    last_30d = now - timedelta(days=30)
    
    # Error Statistics
    total_errors = ErrorLog.objects.count()
    errors_24h = ErrorLog.objects.filter(timestamp__gte=last_24h).count()
    errors_7d = ErrorLog.objects.filter(timestamp__gte=last_7d).count()
    errors_30d = ErrorLog.objects.filter(timestamp__gte=last_30d).count()
    
    unresolved_errors = ErrorLog.objects.filter(is_resolved=False).count()
    critical_errors = ErrorLog.objects.filter(severity='critical', is_resolved=False).count()
    
    # Error Types Breakdown
    error_types = ErrorLog.objects.values('error_type').annotate(
        count=Count('id')
    ).order_by('-count')[:10]
    
    # Severity Breakdown
    severity_breakdown = ErrorLog.objects.values('severity').annotate(
        count=Count('id')
    ).order_by('-count')
    
    # Most Affected URLs
    affected_urls = ErrorLog.objects.values('url').annotate(
        error_count=Count('id'),
        unique_users=Count('user_id', distinct=True)
    ).order_by('-error_count')[:10]
    
    # Browser/OS Statistics
    browser_stats = {}
    for error in ErrorLog.objects.exclude(browser_info__isnull=True):
        if error.browser_info:
            browser = error.browser_info.get('browser', 'Unknown')
            os = error.browser_info.get('os', 'Unknown')
            key = f"{browser} on {os}"
            browser_stats[key] = browser_stats.get(key, 0) + 1
    
    browser_stats = sorted(browser_stats.items(), key=lambda x: x[1], reverse=True)[:10]
    
    # Performance Statistics
    avg_page_load = PerformanceLog.objects.filter(
        metric_type='page_load',
        timestamp__gte=last_7d
    ).aggregate(avg_duration=Avg('duration'))['avg_duration'] or 0
    
    slow_pages = PerformanceLog.objects.filter(
        metric_type='page_load',
        duration__gt=3000,  # > 3 seconds
        timestamp__gte=last_7d
    ).values('url').annotate(
        avg_duration=Avg('duration'),
        count=Count('*')
    ).order_by('-avg_duration')[:10]
    
    # User Session Statistics
    total_sessions = UserSession.objects.count()
    sessions_24h = UserSession.objects.filter(start_time__gte=last_24h).count()
    avg_session_duration = UserSession.objects.aggregate(
        avg_duration=Avg('duration')
    )['avg_duration'] or 0
    
    sessions_with_errors = UserSession.objects.filter(errors_encountered__gt=0).count()
    error_rate = (sessions_with_errors / total_sessions * 100) if total_sessions > 0 else 0
    
    # Recent Critical Errors
    recent_critical_errors = ErrorLog.objects.filter(
        severity='critical',
        timestamp__gte=last_24h
    ).order_by('-timestamp')[:10]
    
    # Error Trends (last 7 days)
    error_trends = []
    for i in range(7):
        date = now - timedelta(days=i)
        start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        
        daily_errors = ErrorLog.objects.filter(
            timestamp__gte=start_of_day,
            timestamp__lt=end_of_day
        ).count()
        
        error_trends.append({
            'date': start_of_day.strftime('%Y-%m-%d'),
            'errors': daily_errors
        })
    
    error_trends.reverse()  # Show oldest to newest
    
    # Top Error Messages
    top_error_messages = ErrorLog.objects.values('message').annotate(
        count=Count('id'),
        latest_occurrence=Max('timestamp')
    ).order_by('-count')[:10]
    
    context = {
        'title': 'Error Tracking Dashboard',
        'total_errors': total_errors,
        'errors_24h': errors_24h,
        'errors_7d': errors_7d,
        'errors_30d': errors_30d,
        'unresolved_errors': unresolved_errors,
        'critical_errors': critical_errors,
        'error_types': error_types,
        'severity_breakdown': severity_breakdown,
        'affected_urls': affected_urls,
        'browser_stats': browser_stats,
        'avg_page_load': round(avg_page_load, 2),
        'slow_pages': slow_pages,
        'total_sessions': total_sessions,
        'sessions_24h': sessions_24h,
        'avg_session_duration': round(avg_session_duration / 60, 2) if avg_session_duration else 0,  # Convert to minutes
        'error_rate': round(error_rate, 2),
        'recent_critical_errors': recent_critical_errors,
        'error_trends': error_trends,
        'top_error_messages': top_error_messages,
        'error_trends_json': json.dumps(error_trends),
    }
    
    return render(request, 'admin/error_tracking_dashboard.html', context)


@staff_member_required
def error_detail_view(request, error_id):
    """
    Detailed view for a specific error
    """
    try:
        error: ErrorLog = ErrorLog.objects.get(id=error_id)
        
        # Find similar errors
        similar_errors = ErrorLog.objects.filter(
            message=error.message,
            error_type=error.error_type
        ).exclude(id=error.pk).order_by('-timestamp')[:5]
        
        # Get user session if available
        user_session = None
        if error.session_id:
            try:
                user_session = UserSession.objects.get(session_id=error.session_id)
            except UserSession.DoesNotExist:
                pass
        
        context = {
            'title': f'Error Detail - {error.error_type}',
            'error': error,
            'similar_errors': similar_errors,
            'user_session': user_session,
        }
        
        return render(request, 'admin/error_detail.html', context)
        
    except ErrorLog.DoesNotExist:
        from django.http import Http404
        raise Http404("Error not found")


@staff_member_required
def performance_dashboard(request):
    """
    Performance monitoring dashboard
    """
    now = timezone.now()
    last_24h = now - timedelta(hours=24)
    last_7d = now - timedelta(days=7)
    
    # Performance metrics
    avg_page_load_24h = PerformanceLog.objects.filter(
        metric_type='page_load',
        timestamp__gte=last_24h
    ).aggregate(avg_duration=Avg('duration'))['avg_duration'] or 0
    
    avg_api_response_24h = PerformanceLog.objects.filter(
        metric_type='api_call',
        timestamp__gte=last_24h
    ).aggregate(avg_duration=Avg('duration'))['avg_duration'] or 0
    
    # Slowest pages
    slowest_pages = PerformanceLog.objects.filter(
        metric_type='page_load',
        timestamp__gte=last_7d
    ).values('url').annotate(
        avg_duration=Avg('duration'),
        count=Count('*')
    ).order_by('-avg_duration')[:15]
    
    # Performance trends
    performance_trends = []
    for i in range(7):
        date = now - timedelta(days=i)
        start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        
        daily_avg = PerformanceLog.objects.filter(
            metric_type='page_load',
            timestamp__gte=start_of_day,
            timestamp__lt=end_of_day
        ).aggregate(avg_duration=Avg('duration'))['avg_duration'] or 0
        
        performance_trends.append({
            'date': start_of_day.strftime('%Y-%m-%d'),
            'avg_load_time': round(daily_avg, 2)
        })
    
    performance_trends.reverse()
    
    context = {
        'title': 'Performance Dashboard',
        'avg_page_load_24h': round(avg_page_load_24h, 2),
        'avg_api_response_24h': round(avg_api_response_24h, 2),
        'slowest_pages': slowest_pages,
        'performance_trends': performance_trends,
        'performance_trends_json': json.dumps(performance_trends),
    }
    
    return render(request, 'admin/performance_dashboard.html', context)