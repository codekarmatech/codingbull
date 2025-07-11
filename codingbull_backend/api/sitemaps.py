from django.contrib.sitemaps import Sitemap
from django.conf import settings
from datetime import datetime
from .models import BlogPost, Service, Project

class BlogPostSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    protocol = 'https'

    def items(self):
        return BlogPost.objects.filter(published=True).order_by('-updated_date')

    def lastmod(self, obj):
        return obj.updated_date

    def location(self, obj):
        return f'/blog/{obj.slug}'

    def get_urls(self, page=1, site=None, protocol=None):
        """Override to add image information to blog post URLs"""
        urls = super().get_urls(page=page, site=site, protocol=protocol)

        for url_info in urls:
            obj = url_info.get('item')
            if obj and hasattr(obj, 'image') and obj.image:
                # Add image information for better SEO
                url_info['images'] = [{
                    'loc': f"https://{getattr(settings, 'SITEMAP_DOMAIN', 'codingbullz.com')}{obj.image.url}",
                    'title': obj.title,
                    'caption': obj.excerpt[:100] if obj.excerpt else obj.title,
                }]

        return urls

class ServiceSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.7
    protocol = 'https'

    def items(self):
        return Service.objects.all().order_by('-updated_date')

    def lastmod(self, obj):
        return obj.updated_date

    def location(self, obj):
        return f'/services/{obj.slug}'

class ProjectSitemap(Sitemap):
    changefreq = "monthly"
    priority = 0.6
    protocol = 'https'

    def items(self):
        return Project.objects.all().order_by('-updated_date')

    def lastmod(self, obj):
        return obj.updated_date if hasattr(obj, 'updated_date') else datetime.now()

    def location(self, obj):
        return f'/our-projects/{obj.id}'

class StaticViewSitemap(Sitemap):
    priority = 0.9
    changefreq = 'daily'
    protocol = 'https'

    def items(self):
        return [
            {'url': '/', 'priority': 1.0, 'changefreq': 'daily'},
            {'url': '/about', 'priority': 0.8, 'changefreq': 'weekly'},
            {'url': '/services', 'priority': 0.9, 'changefreq': 'weekly'},
            {'url': '/our-projects', 'priority': 0.8, 'changefreq': 'weekly'},
            {'url': '/blog', 'priority': 0.8, 'changefreq': 'daily'},
            {'url': '/contact', 'priority': 0.7, 'changefreq': 'monthly'},
            {'url': '/privacy-policy', 'priority': 0.3, 'changefreq': 'yearly'},
            {'url': '/terms-of-service', 'priority': 0.3, 'changefreq': 'yearly'},
            {'url': '/cookie-policy', 'priority': 0.3, 'changefreq': 'yearly'},
        ]

    def location(self, item):
        return item['url']

    def priority(self, item):
        return item.get('priority', 0.5)

    def changefreq(self, item):
        return item.get('changefreq', 'monthly')

    def lastmod(self, item):
        # Return current date for static pages
        return datetime.now()

class ImageSitemap(Sitemap):
    """Dedicated image sitemap for better SEO"""
    changefreq = "weekly"
    priority = 0.5
    protocol = 'https'

    def items(self):
        """Return all items that have images"""
        items = []

        # Add blog post images
        for blog_post in BlogPost.objects.filter(published=True, image__isnull=False):
            items.append({
                'type': 'blog',
                'object': blog_post,
                'image_url': blog_post.image.url,
                'title': blog_post.title,
                'caption': blog_post.excerpt[:100] if blog_post.excerpt else blog_post.title,
                'location': f'/blog/{blog_post.slug}',
            })

        # Add service images
        for service in Service.objects.filter(icon__isnull=False):
            items.append({
                'type': 'service',
                'object': service,
                'image_url': service.icon.url,
                'title': service.name,
                'caption': service.summary[:100] if service.summary else service.name,
                'location': f'/services/{service.slug}',
            })

        # Add project images
        for project in Project.objects.filter(project_image__isnull=False):
            items.append({
                'type': 'project',
                'object': project,
                'image_url': project.project_image.url,
                'title': project.title,
                'caption': project.description[:100] if project.description else project.title,
                'location': f'/our-projects/{project.id}',
            })

        # Add project logos
        for project in Project.objects.filter(client_logo__isnull=False):
            items.append({
                'type': 'project_logo',
                'object': project,
                'image_url': project.client_logo.url,
                'title': f"{project.client_name} Logo",
                'caption': f"Logo for {project.client_name} - {project.title}",
                'location': f'/our-projects/{project.id}',
            })

        return items

    def location(self, item):
        return item['location']

    def lastmod(self, item):
        obj = item['object']
        if hasattr(obj, 'updated_date'):
            return obj.updated_date
        elif hasattr(obj, 'published_date'):
            return obj.published_date
        return datetime.now()

    def get_urls(self, page=1, site=None, protocol=None):
        """Override to add image-specific XML structure"""
        urls = super().get_urls(page=page, site=site, protocol=protocol)

        for url_info in urls:
            item = url_info.get('item')
            if item:
                # Add image information
                url_info['images'] = [{
                    'loc': f"https://{getattr(settings, 'SITEMAP_DOMAIN', 'codingbullz.com')}{item['image_url']}",
                    'title': item['title'],
                    'caption': item['caption'],
                }]

        return urls

class NewsSitemap(Sitemap):
    """News sitemap for recent blog posts"""
    changefreq = "hourly"
    priority = 0.9
    protocol = 'https'

    def items(self):
        """Return recent blog posts (last 2 days for news sitemap)"""
        from datetime import timedelta
        cutoff_date = datetime.now() - timedelta(days=2)
        return BlogPost.objects.filter(
            published=True,
            published_date__gte=cutoff_date
        ).order_by('-published_date')

    def lastmod(self, obj):
        return obj.updated_date

    def location(self, obj):
        return f'/blog/{obj.slug}'

    def get_urls(self, page=1, site=None, protocol=None):
        """Override to add news-specific XML structure"""
        urls = super().get_urls(page=page, site=site, protocol=protocol)

        for url_info in urls:
            obj = url_info.get('item')
            if obj:
                # Add news-specific information
                url_info['news'] = {
                    'publication_name': 'CodingBull',
                    'publication_language': 'en',
                    'publication_date': obj.published_date.strftime('%Y-%m-%d'),
                    'title': obj.title,
                    'keywords': ', '.join(obj.tags) if obj.tags else '',
                }

        return urls
