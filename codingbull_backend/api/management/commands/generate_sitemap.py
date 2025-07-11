from django.core.management.base import BaseCommand
from django.contrib.sitemaps import views
from django.http import HttpRequest
from django.conf import settings
from django.test import RequestFactory
from api.sitemaps import BlogPostSitemap, ServiceSitemap, ProjectSitemap, StaticViewSitemap
import xml.etree.ElementTree as ET
from urllib.parse import urljoin
import requests
import sys
from datetime import datetime


class Command(BaseCommand):
    help = 'Generate and validate sitemap for CodingBull website'

    def add_arguments(self, parser):
        parser.add_argument(
            '--validate',
            action='store_true',
            help='Validate sitemap XML structure',
        )
        parser.add_argument(
            '--test-urls',
            action='store_true',
            help='Test all URLs in sitemap for accessibility',
        )
        parser.add_argument(
            '--output-file',
            type=str,
            help='Output sitemap to file',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting sitemap generation...'))

        # Generate sitemap
        sitemap_content = self.generate_sitemap()

        if options['output_file']:
            with open(options['output_file'], 'w', encoding='utf-8') as f:
                f.write(sitemap_content)
            self.stdout.write(
                self.style.SUCCESS(f'Sitemap saved to {options["output_file"]}')
            )

        # Validate XML structure
        if options['validate']:
            self.validate_sitemap(sitemap_content)

        # Test URLs
        if options['test_urls']:
            self.test_urls(sitemap_content)

        # Display statistics
        self.display_statistics(sitemap_content)

        self.stdout.write(self.style.SUCCESS('Sitemap generation completed!'))

    def generate_sitemap(self):
        """Generate sitemap XML content"""
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

    def validate_sitemap(self, content):
        """Validate sitemap XML structure"""
        self.stdout.write('Validating sitemap XML structure...')

        try:
            root = ET.fromstring(content)

            # Check namespace
            expected_ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
            if root.tag != f'{{{expected_ns}}}urlset':
                self.stdout.write(
                    self.style.ERROR(f'Invalid namespace. Expected: {expected_ns}')
                )
                return False

            # Check URLs
            url_count = 0
            for url_elem in root.findall(f'{{{expected_ns}}}url'):
                url_count += 1

                # Check required elements
                loc = url_elem.find(f'{{{expected_ns}}}loc')
                if loc is None or not loc.text:
                    self.stdout.write(
                        self.style.ERROR(f'URL {url_count}: Missing or empty <loc> element')
                    )
                    continue

                # Check optional elements
                lastmod = url_elem.find(f'{{{expected_ns}}}lastmod')
                changefreq = url_elem.find(f'{{{expected_ns}}}changefreq')
                priority = url_elem.find(f'{{{expected_ns}}}priority')

                # Validate changefreq values
                if changefreq is not None:
                    valid_changefreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
                    if changefreq.text not in valid_changefreqs:
                        self.stdout.write(
                            self.style.WARNING(f'URL {url_count}: Invalid changefreq value: {changefreq.text}')
                        )

                # Validate priority values
                if priority is not None:
                    try:
                        priority_val = float(priority.text)
                        if not (0.0 <= priority_val <= 1.0):
                            self.stdout.write(
                                self.style.WARNING(f'URL {url_count}: Priority should be between 0.0 and 1.0: {priority_val}')
                            )
                    except ValueError:
                        self.stdout.write(
                            self.style.WARNING(f'URL {url_count}: Invalid priority value: {priority.text}')
                        )

            if url_count == 0:
                self.stdout.write(self.style.ERROR('No URLs found in sitemap'))
                return False

            self.stdout.write(
                self.style.SUCCESS(f'Sitemap validation passed! Found {url_count} URLs.')
            )
            return True

        except ET.ParseError as e:
            self.stdout.write(
                self.style.ERROR(f'XML parsing error: {e}')
            )
            return False

    def test_urls(self, content):
        """Test all URLs in sitemap for accessibility"""
        self.stdout.write('Testing URLs for accessibility...')

        try:
            root = ET.fromstring(content)
            ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'

            tested_urls = 0
            successful_urls = 0
            failed_urls = []

            for url_elem in root.findall(f'{{{ns}}}url'):
                loc = url_elem.find(f'{{{ns}}}loc')
                if loc is not None and loc.text:
                    url = loc.text
                    tested_urls += 1

                    try:
                        # Test URL with timeout
                        response = requests.head(url, timeout=10, allow_redirects=True)
                        if response.status_code == 200:
                            successful_urls += 1
                            self.stdout.write(f'✓ {url} - Status: {response.status_code}')
                        else:
                            failed_urls.append((url, response.status_code))
                            self.stdout.write(
                                self.style.WARNING(f'⚠ {url} - Status: {response.status_code}')
                            )
                    except requests.RequestException as e:
                        failed_urls.append((url, str(e)))
                        self.stdout.write(
                            self.style.ERROR(f'✗ {url} - Error: {e}')
                        )

            # Summary
            self.stdout.write(f'\nURL Testing Summary:')
            self.stdout.write(f'Total URLs tested: {tested_urls}')
            self.stdout.write(f'Successful: {successful_urls}')
            self.stdout.write(f'Failed: {len(failed_urls)}')

            if failed_urls:
                self.stdout.write(self.style.WARNING('\nFailed URLs:'))
                for url, error in failed_urls:
                    self.stdout.write(f'  - {url}: {error}')

        except ET.ParseError as e:
            self.stdout.write(
                self.style.ERROR(f'XML parsing error: {e}')
            )

    def display_statistics(self, content):
        """Display sitemap statistics"""
        self.stdout.write(self.style.SUCCESS('\n=== Sitemap Statistics ==='))

        try:
            root = ET.fromstring(content)
            ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'

            # Count URLs by type
            static_urls = 0
            blog_urls = 0
            service_urls = 0
            project_urls = 0

            for url_elem in root.findall(f'{{{ns}}}url'):
                loc = url_elem.find(f'{{{ns}}}loc')
                if loc is not None and loc.text:
                    url = loc.text

                    if '/blog/' in url:
                        blog_urls += 1
                    elif '/services/' in url:
                        service_urls += 1
                    elif '/our-projects/' in url:
                        project_urls += 1
                    else:
                        static_urls += 1

            total_urls = static_urls + blog_urls + service_urls + project_urls

            self.stdout.write(f'Total URLs: {total_urls}')
            self.stdout.write(f'Static pages: {static_urls}')
            self.stdout.write(f'Blog posts: {blog_urls}')
            self.stdout.write(f'Services: {service_urls}')
            self.stdout.write(f'Projects: {project_urls}')

            # Check sitemap size
            size_kb = len(content.encode('utf-8')) / 1024
            self.stdout.write(f'Sitemap size: {size_kb:.2f} KB')

            # Check limits
            if total_urls > 50000:
                self.stdout.write(
                    self.style.WARNING(f'Warning: Sitemap exceeds 50,000 URL limit')
                )

            if size_kb > 10 * 1024:  # 10MB limit
                self.stdout.write(
                    self.style.WARNING(f'Warning: Sitemap exceeds 10MB size limit')
                )

        except ET.ParseError as e:
            self.stdout.write(
                self.style.ERROR(f'XML parsing error: {e}')
            )

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

    def get_domain(self):
        """Get domain based on environment"""
        if getattr(settings, 'ENVIRONMENT', 'development') == 'production':
            return 'codingbullz.com'
        return 'localhost:8000'
