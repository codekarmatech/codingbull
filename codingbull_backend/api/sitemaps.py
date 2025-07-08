from django.contrib.sitemaps import Sitemap
from .models import BlogPost, Service, Project
from django.urls import reverse

class BlogPostSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return BlogPost.objects.filter(published=True)

    def lastmod(self, obj):
        return obj.updated_date

class ServiceSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.7

    def items(self):
        return Service.objects.all()

    def lastmod(self, obj):
        return obj.updated_date

class ProjectSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.6

    def items(self):
        return Project.objects.all()

class StaticViewSitemap(Sitemap):
    priority = 0.5
    changefreq = 'daily'
    protocol = 'https'  # Force HTTPS in production
    i18n = True

    def items(self):
        return [
            'home',
            'services',
            'projects',
            'contact',
            'blog_list'
        ]

    def location(self, item):
        return reverse(item)

    def lastmod(self, item):
        # Use site's last deployment date as proxy for static pages
        from django.conf import settings
        return getattr(settings, 'SITE_LAST_UPDATED', None)