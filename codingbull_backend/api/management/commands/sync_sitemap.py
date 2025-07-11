from django.core.management.base import BaseCommand
from django.contrib.sitemaps import views
from django.test import RequestFactory
from django.conf import settings
from api.sitemaps import BlogPostSitemap, ServiceSitemap, ProjectSitemap, StaticViewSitemap
import os
import shutil
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Sync sitemap between Django backend and frontend static files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force sync even if files are identical',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without actually syncing',
        )
        parser.add_argument(
            '--output-path',
            type=str,
            help='Custom output path for frontend sitemap',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting sitemap sync...'))

        # Generate fresh sitemap content
        sitemap_content = self.generate_sitemap()

        # Determine output paths
        frontend_path = options.get('output_path') or self.get_frontend_sitemap_path()
        backend_path = self.get_backend_sitemap_path()

        # Sync to frontend
        if frontend_path:
            self.sync_to_frontend(sitemap_content, frontend_path, options)

        # Update backend static sitemap
        self.sync_to_backend(sitemap_content, backend_path, options)

        # Display sync results
        self.display_sync_results(sitemap_content)

        self.stdout.write(self.style.SUCCESS('Sitemap sync completed!'))

    def generate_sitemap(self):
        """Generate fresh sitemap XML content"""
        try:
            factory = RequestFactory()
            request = factory.get('/sitemap.xml')
            request.META['HTTP_HOST'] = getattr(settings, 'SITEMAP_DOMAIN', 'codingbullz.com')
            request.META['SERVER_NAME'] = getattr(settings, 'SITEMAP_DOMAIN', 'codingbullz.com')
            request.META['SERVER_PORT'] = '443' if getattr(settings, 'SITEMAP_USE_HTTPS', True) else '80'
            request.is_secure = lambda: getattr(settings, 'SITEMAP_USE_HTTPS', True)

            sitemaps = {
                'blog_posts': BlogPostSitemap,
                'services': ServiceSitemap,
                'projects': ProjectSitemap,
                'static': StaticViewSitemap,
            }

            response = views.sitemap(request, sitemaps)
            return response.content.decode('utf-8')
        except Exception as e:
            # If database connection fails, generate a basic sitemap
            self.stdout.write(
                self.style.WARNING(f'Database connection failed: {e}')
            )
            self.stdout.write(
                self.style.WARNING('Generating basic sitemap without database content')
            )
            return self.generate_basic_sitemap()

    def get_frontend_sitemap_path(self):
        """Get the path to the frontend sitemap file"""
        base_dir = getattr(settings, 'BASE_DIR', '')

        # Try to find the frontend directory
        possible_paths = [
            os.path.join(base_dir, '..', 'codingbull-website', 'public', 'sitemap.xml'),
            os.path.join(base_dir, '..', 'frontend', 'public', 'sitemap.xml'),
            os.path.join(base_dir, '..', 'website', 'public', 'sitemap.xml'),
        ]

        for path in possible_paths:
            abs_path = os.path.abspath(path)
            if os.path.exists(os.path.dirname(abs_path)):
                return abs_path

        self.stdout.write(
            self.style.WARNING('Frontend sitemap directory not found')
        )
        return None

    def get_backend_sitemap_path(self):
        """Get the path to the backend sitemap file"""
        base_dir = getattr(settings, 'BASE_DIR', '')
        return os.path.join(base_dir, 'sitemap.xml')

    def sync_to_frontend(self, sitemap_content, frontend_path, options):
        """Sync sitemap to frontend static files"""
        if not sitemap_content:
            self.stdout.write(
                self.style.ERROR('No sitemap content to sync')
            )
            return

        try:
            # Check if file exists and compare content
            needs_update = True
            if os.path.exists(frontend_path) and not options['force']:
                with open(frontend_path, 'r', encoding='utf-8') as f:
                    existing_content = f.read()

                if existing_content.strip() == sitemap_content.strip():
                    needs_update = False
                    self.stdout.write(
                        self.style.SUCCESS('Frontend sitemap is already up to date')
                    )

            if needs_update:
                if options['dry_run']:
                    self.stdout.write(
                        self.style.WARNING(f'[DRY RUN] Would update frontend sitemap: {frontend_path}')
                    )
                else:
                    # Ensure directory exists
                    os.makedirs(os.path.dirname(frontend_path), exist_ok=True)

                    # Write new content
                    with open(frontend_path, 'w', encoding='utf-8') as f:
                        f.write(sitemap_content)

                    self.stdout.write(
                        self.style.SUCCESS(f'Frontend sitemap updated: {frontend_path}')
                    )

                    # Log the update
                    logger.info(f'Frontend sitemap synced to {frontend_path}')

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error syncing to frontend: {e}')
            )

    def sync_to_backend(self, sitemap_content, backend_path, options):
        """Sync sitemap to backend static files"""
        if not sitemap_content:
            return

        try:
            # Check if file exists and compare content
            needs_update = True
            if os.path.exists(backend_path) and not options['force']:
                with open(backend_path, 'r', encoding='utf-8') as f:
                    existing_content = f.read()

                if existing_content.strip() == sitemap_content.strip():
                    needs_update = False
                    self.stdout.write(
                        self.style.SUCCESS('Backend sitemap is already up to date')
                    )

            if needs_update:
                if options['dry_run']:
                    self.stdout.write(
                        self.style.WARNING(f'[DRY RUN] Would update backend sitemap: {backend_path}')
                    )
                else:
                    # Write new content
                    with open(backend_path, 'w', encoding='utf-8') as f:
                        f.write(sitemap_content)

                    self.stdout.write(
                        self.style.SUCCESS(f'Backend sitemap updated: {backend_path}')
                    )

                    # Log the update
                    logger.info(f'Backend sitemap synced to {backend_path}')

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error syncing to backend: {e}')
            )

    def display_sync_results(self, sitemap_content):
        """Display sync results and statistics"""
        if not sitemap_content:
            return

        self.stdout.write(self.style.SUCCESS('\n=== Sync Results ==='))

        try:
            import xml.etree.ElementTree as ET
            root = ET.fromstring(sitemap_content)
            ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'

            # Count URLs
            url_count = len(root.findall(f'{{{ns}}}url'))

            # Count by type
            static_count = 0
            blog_count = 0
            service_count = 0
            project_count = 0

            for url_elem in root.findall(f'{{{ns}}}url'):
                loc = url_elem.find(f'{{{ns}}}loc')
                if loc is not None and loc.text:
                    url = loc.text
                    if '/blog/' in url:
                        blog_count += 1
                    elif '/services/' in url:
                        service_count += 1
                    elif '/our-projects/' in url:
                        project_count += 1
                    else:
                        static_count += 1

            self.stdout.write(f'Total URLs synced: {url_count}')
            self.stdout.write(f'  - Static pages: {static_count}')
            self.stdout.write(f'  - Blog posts: {blog_count}')
            self.stdout.write(f'  - Services: {service_count}')
            self.stdout.write(f'  - Projects: {project_count}')

            # File size
            size_kb = len(sitemap_content.encode('utf-8')) / 1024
            self.stdout.write(f'Sitemap size: {size_kb:.2f} KB')

            # Timestamp
            self.stdout.write(f'Sync timestamp: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')

        except Exception as e:
            self.stdout.write(
                self.style.WARNING(f'Could not parse sitemap for statistics: {e}')
            )

    def validate_sitemap_structure(self, content):
        """Quick validation of sitemap structure"""
        try:
            import xml.etree.ElementTree as ET
            root = ET.fromstring(content)

            # Check namespace
            expected_ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
            if root.tag != f'{{{expected_ns}}}urlset':
                return False, f'Invalid namespace. Expected: {expected_ns}'

            # Check for URLs
            urls = root.findall(f'{{{expected_ns}}}url')
            if len(urls) == 0:
                return False, 'No URLs found in sitemap'

            return True, f'Valid sitemap with {len(urls)} URLs'

        except Exception as e:
            return False, f'XML parsing error: {e}'

    def generate_basic_sitemap(self):
        """Generate basic sitemap when database is not available"""
        domain = getattr(settings, 'SITEMAP_DOMAIN', 'codingbullz.com')
        protocol = 'https' if getattr(settings, 'SITEMAP_USE_HTTPS', True) else 'http'
        base_url = f'{protocol}://{domain}'

        # Basic static pages
        static_pages = [
            {'url': '/', 'priority': '1.0', 'changefreq': 'daily'},
            {'url': '/about', 'priority': '0.8', 'changefreq': 'weekly'},
            {'url': '/services', 'priority': '0.9', 'changefreq': 'weekly'},
            {'url': '/our-projects', 'priority': '0.8', 'changefreq': 'weekly'},
            {'url': '/blog', 'priority': '0.8', 'changefreq': 'daily'},
            {'url': '/contact', 'priority': '0.7', 'changefreq': 'monthly'},
            {'url': '/privacy-policy', 'priority': '0.3', 'changefreq': 'yearly'},
            {'url': '/terms-of-service', 'priority': '0.3', 'changefreq': 'yearly'},
            {'url': '/cookie-policy', 'priority': '0.3', 'changefreq': 'yearly'},
        ]

        # Generate XML
        xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

        for page in static_pages:
            xml_content += '  <url>\n'
            xml_content += f'    <loc>{base_url}{page["url"]}</loc>\n'
            xml_content += f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>\n'
            xml_content += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
            xml_content += f'    <priority>{page["priority"]}</priority>\n'
            xml_content += '  </url>\n'

        xml_content += '</urlset>'
        return xml_content
