"""
URL configuration for codingbull_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from rest_framework import routers
from api import views, admin_views

# Create the main router for API v1
router = routers.DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'blogs', views.BlogPostViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'services', views.ServiceViewSet, basename='service')
router.register(r'contact', views.ContactInquiryViewSet, basename='contact')
router.register(r'testimonials', views.TestimonialViewSet)

# Main URL patterns
urlpatterns = [
    # Admin dashboard views (must come before admin/ to avoid conflicts)
    path('admin/dashboard-overview/', admin_views.admin_dashboard_overview, name='admin-dashboard-overview'),
    path('admin/error-tracking-dashboard/', admin_views.error_tracking_dashboard, name='error-tracking-dashboard'),
    path('admin/performance-dashboard/', admin_views.performance_dashboard, name='performance-dashboard'),
    path('admin/error-detail/<int:error_id>/', admin_views.error_detail_view, name='error-detail'),
    
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
    path('api/v1/technologies/', views.technologies_list, name='technologies-list'),
    # Error tracking endpoints
    path('api/v1/error-tracking/error/', views.track_error, name='track-error'),
    path('api/v1/error-tracking/performance/', views.track_performance, name='track-performance'),
    path('api/v1/error-tracking/session/', views.track_session, name='track-session'),
    path('api/v1/error-tracking/session-update/', views.update_session, name='update-session'),
]

# Create a separate router for backward compatibility
legacy_router = routers.DefaultRouter()
legacy_router.register(r'categories', views.CategoryViewSet)
legacy_router.register(r'blogs', views.BlogPostViewSet)
legacy_router.register(r'projects', views.ProjectViewSet)
legacy_router.register(r'services', views.ServiceViewSet, basename='service')
legacy_router.register(r'contact', views.ContactInquiryViewSet, basename='contact')
legacy_router.register(r'testimonials', views.TestimonialViewSet)

# Add legacy URL patterns for backward compatibility
urlpatterns += [
    path('api/', include(legacy_router.urls)),
    path('api/technologies/', views.technologies_list, name='technologies-list-legacy'),
    path('', include(legacy_router.urls)),
    path('technologies/', views.technologies_list, name='technologies-list-root'),
    
    # Legacy error tracking endpoints (without /api/v1 prefix)
    path('error-tracking/error/', views.track_error, name='track-error-legacy'),
    path('error-tracking/performance/', views.track_performance, name='track-performance-legacy'),
    path('error-tracking/session/', views.track_session, name='track-session-legacy'),
    path('error-tracking/session-update/', views.update_session, name='update-session-legacy'),
]

# Serve media files based on environment
if settings.DEBUG or settings.ENVIRONMENT == 'development':
    # In development, serve media files directly
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
elif settings.ENVIRONMENT == 'production' and hasattr(settings, 'SECURE_MEDIA_SERVING') and settings.SECURE_MEDIA_SERVING:
    # In production, provide fallback media serving with security headers
    from django.views.static import serve
    from django.urls import re_path
    from django.views.decorators.cache import cache_control
    from django.views.decorators.http import require_GET
    
    @cache_control(max_age=3600)
    @require_GET
    def secure_media_serve(request, path):
        response = serve(request, path, document_root=settings.MEDIA_ROOT)
        # Add security headers for media files
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        return response
    
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', secure_media_serve),
    ]
