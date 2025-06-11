"""
Custom admin context processor to provide dashboard statistics
"""

from django.utils import timezone
from datetime import timedelta
from .models import (
    BlogPost, Project, Service, ContactInquiry, ErrorLog, SecurityLog,
    SecurityAlert, IPAddress
)


def admin_dashboard_context(request):
    """
    Add dashboard statistics to admin context
    """
    if not request.path.startswith('/admin/'):
        return {}
    
    try:
        now = timezone.now()
        last_24h = now - timedelta(hours=24)
        
        context = {
            'blog_count': BlogPost.objects.count(),
            'project_count': Project.objects.count(),
            'service_count': Service.objects.count(),
            'inquiry_count': ContactInquiry.objects.filter(created_at__gte=last_24h).count(),
            'error_count': ErrorLog.objects.filter(is_resolved=False).count(),
            'security_count': SecurityLog.objects.filter(timestamp__gte=last_24h, is_suspicious=True).count(),
        }
        
        return context
    except Exception:
        # Return empty context if there's any error (e.g., during migrations)
        return {
            'blog_count': 0,
            'project_count': 0,
            'service_count': 0,
            'inquiry_count': 0,
            'error_count': 0,
            'security_count': 0,
        }