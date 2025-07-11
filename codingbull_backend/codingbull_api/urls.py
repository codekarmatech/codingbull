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
from django.test import RequestFactory

from django.contrib.sitemaps.views import sitemap
from django.views.generic import TemplateView
from django.http import HttpResponse
from rest_framework import routers
from api import views, admin_views
from api.sitemaps import BlogPostSitemap, ServiceSitemap, ProjectSitemap, StaticViewSitemap, ImageSitemap, NewsSitemap
from api.sitemap_index import SitemapIndex

# Sitemap configuration
sitemaps = {
    'blog_posts': BlogPostSitemap,
    'services': ServiceSitemap,
    'projects': ProjectSitemap,
    'static': StaticViewSitemap,
}

# Individual sitemaps for sitemap index
individual_sitemaps = {
    'static': StaticViewSitemap,
    'blog': BlogPostSitemap,
    'services': ServiceSitemap,
    'projects': ProjectSitemap,
    'images': ImageSitemap,
    'news': NewsSitemap,
}

# React app serving view
class ReactAppView(TemplateView):
    template_name = 'index.html'

# Robots.txt view
def robots_txt(request):
    """Generate robots.txt dynamically"""
    lines = [
        "User-agent: *",
        "Disallow: /admin/",
        "Disallow: /api/",
        "Disallow: /static/admin/",
        "Disallow: /django-admin/",
        "Allow: /static/frontend/",
        "Crawl-delay: 1",
        "",
        f"Sitemap: {request.build_absolute_uri('/sitemap.xml')}",
        f"Sitemap: {request.build_absolute_uri('/sitemap-index.xml')}",
    ]
    return HttpResponse('\n'.join(lines), content_type='text/plain')

def sitemap_index_view(request):
    """Sitemap index view"""
    sitemap_index = SitemapIndex()
    return sitemap_index.generate_sitemap_index_response()

def individual_sitemap_view(request, sitemap_name):
    """Individual sitemap view"""
    if sitemap_name not in individual_sitemaps:
        return HttpResponse("Sitemap not found", status=404)

    sitemap_class = individual_sitemaps[sitemap_name]

    # Use the existing sitemap view with proper request handling
    single_sitemap = {sitemap_name: sitemap_class}
    response = sitemap(request, single_sitemap)
    return response

# Function to register common routes to avoid duplication
def register_common_routes(router):
    """Register common API routes to a router"""
    router.register(r'categories', views.CategoryViewSet)
    router.register(r'blogs', views.BlogPostViewSet)
    router.register(r'projects', views.ProjectViewSet)
    router.register(r'services', views.ServiceViewSet, basename='service')
    router.register(r'contact', views.ContactInquiryViewSet, basename='contact')
    router.register(r'testimonials', views.TestimonialViewSet)

# Create the main router for API v1
router = routers.DefaultRouter()
register_common_routes(router)

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

    # SEO and sitemap endpoints
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('sitemap-index.xml', sitemap_index_view, name='sitemap_index'),
    path('sitemap-<str:sitemap_name>.xml', individual_sitemap_view, name='individual_sitemap'),
    path('robots.txt', robots_txt, name='robots_txt'),

    # React app routes (catch-all for frontend routing)
    path('', ReactAppView.as_view(), name='home'),
    path('about/', ReactAppView.as_view(), name='about'),
    path('services/', ReactAppView.as_view(), name='services'),
    path('services/<slug:slug>/', ReactAppView.as_view(), name='service_detail'),
    path('our-projects/', ReactAppView.as_view(), name='projects'),
    path('our-projects/<int:id>/', ReactAppView.as_view(), name='project_detail'),
    path('blog/', ReactAppView.as_view(), name='blog_list'),
    path('blog/<slug:slug>/', ReactAppView.as_view(), name='blog_detail'),
    path('contact/', ReactAppView.as_view(), name='contact'),
    path('privacy-policy/', ReactAppView.as_view(), name='privacy_policy'),
    path('terms-of-service/', ReactAppView.as_view(), name='terms_of_service'),
    path('cookie-policy/', ReactAppView.as_view(), name='cookie_policy'),
]

# Create a separate router for backward compatibility
legacy_router = routers.DefaultRouter()
register_common_routes(legacy_router)

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
    # In development, serve media files directly with CORS support
    from django.views.static import serve
    from django.http import HttpResponse
    from django.views.decorators.csrf import csrf_exempt

    @csrf_exempt
    def cors_media_serve(request, path):
        """Serve media files with minimal CORS headers for Chrome compatibility"""
        if request.method == 'OPTIONS':
            # Handle preflight requests with minimal headers
            response = HttpResponse()
            origin = request.META.get('HTTP_ORIGIN', '')
            if 'localhost' in origin or '127.0.0.1' in origin:
                response['Access-Control-Allow-Origin'] = origin
                response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
                response['Access-Control-Allow-Headers'] = '*'
                response['Access-Control-Allow-Credentials'] = 'true'
                response['Access-Control-Max-Age'] = '86400'
            return response
        else:
            # Serve the actual file with minimal processing
            file_response = serve(request, path, document_root=settings.MEDIA_ROOT)

            # Add minimal CORS headers directly to file response
            origin = request.META.get('HTTP_ORIGIN', '')
            if 'localhost' in origin or '127.0.0.1' in origin:
                file_response['Access-Control-Allow-Origin'] = origin
                file_response['Access-Control-Allow-Credentials'] = 'true'

            return file_response

    # Add CORS-enabled media serving
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', cors_media_serve),
    ]
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
