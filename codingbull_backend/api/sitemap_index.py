from django.conf import settings
from django.http import HttpResponse
from datetime import datetime
import xml.etree.ElementTree as ET
from .sitemaps import BlogPostSitemap, ServiceSitemap, ProjectSitemap, StaticViewSitemap, ImageSitemap, NewsSitemap

class SitemapIndex:
    """
    Sitemap index management for organizing multiple sitemaps
    according to sitemaps.org protocol
    """

    def __init__(self):
        self.sitemaps = {
            'static': StaticViewSitemap,
            'blog': BlogPostSitemap,
            'services': ServiceSitemap,
            'projects': ProjectSitemap,
            'images': ImageSitemap,
            'news': NewsSitemap,
        }

    def get_sitemap_info(self, sitemap_name, sitemap_class):
        """Get information about a specific sitemap"""
        try:
            sitemap_instance = sitemap_class()
            items = sitemap_instance.items()

            # Get the most recent lastmod date
            lastmod = None
            if items:
                if hasattr(sitemap_instance, 'lastmod'):
                    lastmods = []
                    for item in items[:10]:  # Check first 10 items for performance
                        item_lastmod = sitemap_instance.lastmod(item)
                        if item_lastmod:
                            lastmods.append(item_lastmod)

                    if lastmods:
                        lastmod = max(lastmods)

            return {
                'name': sitemap_name,
                'url': f'https://{getattr(settings, "SITEMAP_DOMAIN", "codingbullz.com")}/sitemap-{sitemap_name}.xml',
                'lastmod': lastmod or datetime.now(),
                'item_count': len(items) if items else 0,
            }
        except Exception as e:
            return {
                'name': sitemap_name,
                'url': f'https://{getattr(settings, "SITEMAP_DOMAIN", "codingbullz.com")}/sitemap-{sitemap_name}.xml',
                'lastmod': datetime.now(),
                'item_count': 0,
                'error': str(e),
            }

    def get_sitemap_index_data(self):
        """Get data for all sitemaps in the index"""
        sitemap_data = []

        for name, sitemap_class in self.sitemaps.items():
            # Skip news sitemap if no recent articles
            if name == 'news':
                try:
                    news_sitemap = sitemap_class()
                    news_items = news_sitemap.items()
                    if not news_items:
                        continue
                except:
                    continue

            # Skip image sitemap if no images
            if name == 'images':
                try:
                    image_sitemap = sitemap_class()
                    image_items = image_sitemap.items()
                    if not image_items:
                        continue
                except:
                    continue

            info = self.get_sitemap_info(name, sitemap_class)
            if info['item_count'] > 0:
                sitemap_data.append(info)

        # Sort by priority (static first, then by item count)
        priority_order = ['static', 'blog', 'services', 'projects', 'images', 'news']
        sitemap_data.sort(key=lambda x: (
            priority_order.index(x['name']) if x['name'] in priority_order else 999,
            -x['item_count']
        ))

        return sitemap_data

    def generate_sitemap_index_xml(self):
        """Generate sitemap index XML"""
        sitemap_data = self.get_sitemap_index_data()

        # Create XML structure
        root = ET.Element('sitemapindex')
        root.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

        for sitemap_info in sitemap_data:
            sitemap_elem = ET.SubElement(root, 'sitemap')

            # Add location
            loc_elem = ET.SubElement(sitemap_elem, 'loc')
            loc_elem.text = sitemap_info['url']

            # Add lastmod
            if sitemap_info['lastmod']:
                lastmod_elem = ET.SubElement(sitemap_elem, 'lastmod')
                if isinstance(sitemap_info['lastmod'], datetime):
                    lastmod_elem.text = sitemap_info['lastmod'].strftime('%Y-%m-%d')
                else:
                    lastmod_elem.text = str(sitemap_info['lastmod'])

        # Convert to string
        xml_str = ET.tostring(root, encoding='unicode')
        return f'<?xml version="1.0" encoding="UTF-8"?>\n{xml_str}'

    def generate_sitemap_index_response(self):
        """Generate HTTP response for sitemap index"""
        xml_content = self.generate_sitemap_index_xml()
        return HttpResponse(xml_content, content_type='application/xml')

    def get_statistics(self):
        """Get statistics about all sitemaps"""
        sitemap_data = self.get_sitemap_index_data()

        stats = {
            'total_sitemaps': len(sitemap_data),
            'total_urls': sum(info['item_count'] for info in sitemap_data),
            'sitemaps': sitemap_data,
            'last_updated': max(info['lastmod'] for info in sitemap_data) if sitemap_data else datetime.now(),
        }

        return stats

    def validate_sitemap_index(self):
        """Validate sitemap index structure and content"""
        errors = []
        warnings = []

        try:
            sitemap_data = self.get_sitemap_index_data()

            # Check if we have any sitemaps
            if not sitemap_data:
                errors.append("No sitemaps found for index")
                return errors, warnings

            # Check URL limits
            total_urls = sum(info['item_count'] for info in sitemap_data)
            if total_urls > 50000:
                warnings.append(f"Total URLs ({total_urls}) exceeds recommended limit of 50,000")

            # Check individual sitemaps
            for info in sitemap_data:
                if info['item_count'] > 50000:
                    warnings.append(f"Sitemap {info['name']} has {info['item_count']} URLs (exceeds 50,000 limit)")

                if 'error' in info:
                    errors.append(f"Error in sitemap {info['name']}: {info['error']}")

                # Check URL accessibility (basic format check)
                if not info['url'].startswith(('http://', 'https://')):
                    errors.append(f"Invalid URL format for sitemap {info['name']}: {info['url']}")

            # Check XML structure
            try:
                xml_content = self.generate_sitemap_index_xml()
                ET.fromstring(xml_content)
            except ET.ParseError as e:
                errors.append(f"XML parsing error: {e}")

        except Exception as e:
            errors.append(f"Validation error: {e}")

        return errors, warnings

    def get_sitemap_by_name(self, name):
        """Get a specific sitemap by name"""
        if name not in self.sitemaps:
            return None

        return self.sitemaps[name]

    def is_sitemap_enabled(self, name):
        """Check if a sitemap is enabled and has content"""
        if name not in self.sitemaps:
            return False

        try:
            sitemap_class = self.sitemaps[name]
            sitemap_instance = sitemap_class()
            items = sitemap_instance.items()
            return len(items) > 0 if items else False
        except:
            return False

    def get_sitemap_urls_count(self, name):
        """Get the number of URLs in a specific sitemap"""
        if name not in self.sitemaps:
            return 0

        try:
            sitemap_class = self.sitemaps[name]
            sitemap_instance = sitemap_class()
            items = sitemap_instance.items()
            return len(items) if items else 0
        except:
            return 0

    def cleanup_empty_sitemaps(self):
        """Remove empty sitemaps from the index"""
        active_sitemaps = {}

        for name, sitemap_class in self.sitemaps.items():
            if self.is_sitemap_enabled(name):
                active_sitemaps[name] = sitemap_class

        self.sitemaps = active_sitemaps
        return len(active_sitemaps)

    def generate_sitemap_health_report(self):
        """Generate a health report for all sitemaps"""
        report = {
            'timestamp': datetime.now(),
            'overall_status': 'healthy',
            'sitemaps': {},
            'summary': {
                'total_sitemaps': 0,
                'active_sitemaps': 0,
                'total_urls': 0,
                'errors': 0,
                'warnings': 0,
            }
        }

        errors, warnings = self.validate_sitemap_index()

        for name, sitemap_class in self.sitemaps.items():
            sitemap_info = self.get_sitemap_info(name, sitemap_class)

            status = 'healthy'
            if 'error' in sitemap_info:
                status = 'error'
                report['overall_status'] = 'error'
            elif sitemap_info['item_count'] == 0:
                status = 'empty'
            elif sitemap_info['item_count'] > 45000:
                status = 'warning'

            report['sitemaps'][name] = {
                'status': status,
                'url_count': sitemap_info['item_count'],
                'last_modified': sitemap_info['lastmod'],
                'url': sitemap_info['url'],
                'error': sitemap_info.get('error'),
            }

            report['summary']['total_sitemaps'] += 1
            if sitemap_info['item_count'] > 0:
                report['summary']['active_sitemaps'] += 1
            report['summary']['total_urls'] += sitemap_info['item_count']

        report['summary']['errors'] = len(errors)
        report['summary']['warnings'] = len(warnings)
        report['errors'] = errors
        report['warnings'] = warnings

        if errors:
            report['overall_status'] = 'error'
        elif warnings:
            report['overall_status'] = 'warning'

        return report
