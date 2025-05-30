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
from api import views

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
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
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
    path('', include(legacy_router.urls)),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
