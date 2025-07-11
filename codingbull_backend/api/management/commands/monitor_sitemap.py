from django.core.management.base import BaseCommand
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from api.sitemap_index import SitemapIndex
from api.sitemaps import BlogPostSitemap, ServiceSitemap, ProjectSitemap, StaticViewSitemap
import requests
import json
import logging
from datetime import datetime, timedelta
import os

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Monitor sitemap health and send alerts for issues'

    def add_arguments(self, parser):
        parser.add_argument(
            '--check-urls',
            action='store_true',
            help='Check if all URLs in sitemaps are accessible',
        )
        parser.add_argument(
            '--send-alerts',
            action='store_true',
            help='Send email alerts for critical issues',
        )
        parser.add_argument(
            '--save-report',
            action='store_true',
            help='Save monitoring report to file',
        )
        parser.add_argument(
            '--output-file',
            type=str,
            help='Output file for monitoring report',
        )
        parser.add_argument(
            '--alert-threshold',
            type=int,
            default=80,
            help='Alert threshold percentage for URL accessibility',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting sitemap health monitoring...'))

        # Initialize sitemap index
        sitemap_index = SitemapIndex()

        # Generate health report
        health_report = self.generate_comprehensive_health_report(sitemap_index, options)

        # Check URL accessibility if requested
        if options['check_urls']:
            url_report = self.check_url_accessibility(sitemap_index, options)
            health_report['url_accessibility'] = url_report

        # Display results
        self.display_health_report(health_report)

        # Send alerts if requested
        if options['send_alerts']:
            self.send_alerts_if_needed(health_report, options)

        # Save report if requested
        if options['save_report']:
            self.save_monitoring_report(health_report, options)

        self.stdout.write(self.style.SUCCESS('Sitemap health monitoring completed!'))

    def generate_comprehensive_health_report(self, sitemap_index, options):
        """Generate comprehensive health report"""
        report = sitemap_index.generate_sitemap_health_report()

        # Add additional monitoring data
        report['monitoring'] = {
            'check_timestamp': timezone.now(),
            'environment': getattr(settings, 'ENVIRONMENT', 'unknown'),
            'domain': getattr(settings, 'SITEMAP_DOMAIN', 'unknown'),
            'checks_performed': [],
        }

        # Check sitemap size limits
        self.check_size_limits(report, sitemap_index)

        # Check lastmod dates
        self.check_lastmod_dates(report, sitemap_index)

        # Check XML structure
        self.check_xml_structure(report, sitemap_index)

        # Check robots.txt integration
        self.check_robots_txt_integration(report)

        report['monitoring']['checks_performed'].extend([
            'size_limits',
            'lastmod_dates',
            'xml_structure',
            'robots_txt_integration'
        ])

        return report

    def check_size_limits(self, report, sitemap_index):
        """Check if sitemaps exceed size limits"""
        size_issues = []

        for name, sitemap_data in report['sitemaps'].items():
            url_count = sitemap_data['url_count']

            # Check URL count limits
            if url_count > 50000:
                size_issues.append({
                    'sitemap': name,
                    'issue': 'url_count_exceeded',
                    'count': url_count,
                    'limit': 50000,
                    'severity': 'critical'
                })
            elif url_count > 45000:
                size_issues.append({
                    'sitemap': name,
                    'issue': 'url_count_warning',
                    'count': url_count,
                    'limit': 50000,
                    'severity': 'warning'
                })

        report['size_issues'] = size_issues

    def check_lastmod_dates(self, report, sitemap_index):
        """Check if lastmod dates are recent and valid"""
        lastmod_issues = []
        cutoff_date = timezone.now() - timedelta(days=30)

        for name, sitemap_data in report['sitemaps'].items():
            last_modified = sitemap_data.get('last_modified')

            if last_modified:
                if isinstance(last_modified, str):
                    try:
                        last_modified = datetime.fromisoformat(last_modified.replace('Z', '+00:00'))
                    except:
                        lastmod_issues.append({
                            'sitemap': name,
                            'issue': 'invalid_lastmod_format',
                            'value': last_modified,
                            'severity': 'warning'
                        })
                        continue

                # Check if lastmod is too old (for dynamic content)
                if name in ['blog', 'news'] and last_modified < cutoff_date:
                    lastmod_issues.append({
                        'sitemap': name,
                        'issue': 'stale_lastmod',
                        'last_modified': last_modified,
                        'cutoff_date': cutoff_date,
                        'severity': 'warning'
                    })

        report['lastmod_issues'] = lastmod_issues

    def check_xml_structure(self, report, sitemap_index):
        """Check XML structure validity"""
        xml_issues = []

        try:
            # Check sitemap index XML
            xml_content = sitemap_index.generate_sitemap_index_xml()
            self.validate_xml_structure(xml_content, 'sitemap_index')

            # Check individual sitemaps
            for name, sitemap_class in sitemap_index.sitemaps.items():
                try:
                    sitemap_instance = sitemap_class()
                    # This would require generating the sitemap XML
                    # For now, we'll just check if the sitemap can be instantiated
                    items = sitemap_instance.items()
                except Exception as e:
                    xml_issues.append({
                        'sitemap': name,
                        'issue': 'sitemap_generation_error',
                        'error': str(e),
                        'severity': 'critical'
                    })

        except Exception as e:
            xml_issues.append({
                'sitemap': 'sitemap_index',
                'issue': 'xml_structure_error',
                'error': str(e),
                'severity': 'critical'
            })

        report['xml_issues'] = xml_issues

    def validate_xml_structure(self, xml_content, sitemap_type):
        """Validate XML structure"""
        import xml.etree.ElementTree as ET
        try:
            root = ET.fromstring(xml_content)
            return True
        except ET.ParseError as e:
            raise Exception(f"XML parsing error in {sitemap_type}: {e}")

    def check_robots_txt_integration(self, report):
        """Check if sitemap is properly referenced in robots.txt"""
        robots_issues = []

        try:
            domain = getattr(settings, 'SITEMAP_DOMAIN', 'codingbullz.com')
            robots_url = f"https://{domain}/robots.txt"

            response = requests.get(robots_url, timeout=10)
            if response.status_code == 200:
                robots_content = response.text.lower()
                sitemap_url = f"https://{domain}/sitemap.xml"

                if sitemap_url.lower() not in robots_content:
                    robots_issues.append({
                        'issue': 'sitemap_not_in_robots',
                        'robots_url': robots_url,
                        'expected_sitemap_url': sitemap_url,
                        'severity': 'warning'
                    })
            else:
                robots_issues.append({
                    'issue': 'robots_txt_not_accessible',
                    'robots_url': robots_url,
                    'status_code': response.status_code,
                    'severity': 'warning'
                })

        except Exception as e:
            robots_issues.append({
                'issue': 'robots_txt_check_error',
                'error': str(e),
                'severity': 'warning'
            })

        report['robots_issues'] = robots_issues

    def check_url_accessibility(self, sitemap_index, options):
        """Check if URLs in sitemaps are accessible"""
        self.stdout.write('Checking URL accessibility...')

        url_report = {
            'total_urls_checked': 0,
            'successful_urls': 0,
            'failed_urls': 0,
            'accessibility_percentage': 0,
            'failed_url_details': [],
            'sitemap_accessibility': {},
        }

        for name, sitemap_class in sitemap_index.sitemaps.items():
            sitemap_report = self.check_sitemap_url_accessibility(name, sitemap_class)
            url_report['sitemap_accessibility'][name] = sitemap_report

            url_report['total_urls_checked'] += sitemap_report['total_checked']
            url_report['successful_urls'] += sitemap_report['successful']
            url_report['failed_urls'] += sitemap_report['failed']
            url_report['failed_url_details'].extend(sitemap_report['failed_details'])

        # Calculate overall accessibility percentage
        if url_report['total_urls_checked'] > 0:
            url_report['accessibility_percentage'] = (
                url_report['successful_urls'] / url_report['total_urls_checked']
            ) * 100

        return url_report

    def check_sitemap_url_accessibility(self, sitemap_name, sitemap_class):
        """Check accessibility of URLs in a specific sitemap"""
        sitemap_report = {
            'total_checked': 0,
            'successful': 0,
            'failed': 0,
            'failed_details': [],
            'accessibility_percentage': 0,
        }

        try:
            sitemap_instance = sitemap_class()
            items = sitemap_instance.items()

            # Limit to first 50 URLs for performance
            items_to_check = items[:50] if items else []

            for item in items_to_check:
                try:
                    # Get URL from sitemap
                    if hasattr(sitemap_instance, 'location'):
                        url_path = sitemap_instance.location(item)
                    else:
                        continue

                    # Construct full URL
                    domain = getattr(settings, 'SITEMAP_DOMAIN', 'codingbullz.com')
                    protocol = 'https' if getattr(settings, 'SITEMAP_USE_HTTPS', True) else 'http'
                    full_url = f"{protocol}://{domain}{url_path}"

                    # Check URL accessibility
                    response = requests.head(full_url, timeout=10, allow_redirects=True)
                    sitemap_report['total_checked'] += 1

                    if response.status_code == 200:
                        sitemap_report['successful'] += 1
                    else:
                        sitemap_report['failed'] += 1
                        sitemap_report['failed_details'].append({
                            'url': full_url,
                            'status_code': response.status_code,
                            'sitemap': sitemap_name,
                        })

                except Exception as e:
                    sitemap_report['total_checked'] += 1
                    sitemap_report['failed'] += 1
                    sitemap_report['failed_details'].append({
                        'url': full_url if 'full_url' in locals() else 'unknown',
                        'error': str(e),
                        'sitemap': sitemap_name,
                    })

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error checking sitemap {sitemap_name}: {e}')
            )

        # Calculate accessibility percentage
        if sitemap_report['total_checked'] > 0:
            sitemap_report['accessibility_percentage'] = (
                sitemap_report['successful'] / sitemap_report['total_checked']
            ) * 100

        return sitemap_report

    def display_health_report(self, report):
        """Display health report in terminal"""
        self.stdout.write(self.style.SUCCESS('\n=== Sitemap Health Report ==='))

        # Overall status
        status_style = self.style.SUCCESS if report['overall_status'] == 'healthy' else self.style.ERROR
        self.stdout.write(f"Overall Status: {status_style(report['overall_status'])}")

        # Summary
        summary = report['summary']
        self.stdout.write(f"\nSummary:")
        self.stdout.write(f"  Total Sitemaps: {summary['total_sitemaps']}")
        self.stdout.write(f"  Active Sitemaps: {summary['active_sitemaps']}")
        self.stdout.write(f"  Total URLs: {summary['total_urls']}")
        self.stdout.write(f"  Errors: {summary['errors']}")
        self.stdout.write(f"  Warnings: {summary['warnings']}")

        # Individual sitemap status
        self.stdout.write(f"\nSitemap Details:")
        for name, data in report['sitemaps'].items():
            status_indicator = "✓" if data['status'] == 'healthy' else "⚠" if data['status'] == 'warning' else "✗"
            self.stdout.write(f"  {status_indicator} {name}: {data['url_count']} URLs")

        # Issues
        if report.get('errors'):
            self.stdout.write(self.style.ERROR(f"\nErrors:"))
            for error in report['errors']:
                self.stdout.write(f"  - {error}")

        if report.get('warnings'):
            self.stdout.write(self.style.WARNING(f"\nWarnings:"))
            for warning in report['warnings']:
                self.stdout.write(f"  - {warning}")

        # URL accessibility report
        if 'url_accessibility' in report:
            url_report = report['url_accessibility']
            self.stdout.write(f"\nURL Accessibility:")
            self.stdout.write(f"  Total URLs Checked: {url_report['total_urls_checked']}")
            self.stdout.write(f"  Successful: {url_report['successful_urls']}")
            self.stdout.write(f"  Failed: {url_report['failed_urls']}")
            self.stdout.write(f"  Accessibility: {url_report['accessibility_percentage']:.1f}%")

    def send_alerts_if_needed(self, report, options):
        """Send email alerts for critical issues"""
        if not getattr(settings, 'EMAIL_HOST', None):
            self.stdout.write(self.style.WARNING('Email not configured, skipping alerts'))
            return

        critical_issues = []
        warning_issues = []

        # Check for critical issues
        if report['overall_status'] == 'error':
            critical_issues.extend(report.get('errors', []))

        if report['summary']['errors'] > 0:
            critical_issues.append(f"Found {report['summary']['errors']} errors in sitemaps")

        # Check URL accessibility
        if 'url_accessibility' in report:
            accessibility = report['url_accessibility']['accessibility_percentage']
            threshold = options['alert_threshold']

            if accessibility < threshold:
                critical_issues.append(
                    f"URL accessibility ({accessibility:.1f}%) below threshold ({threshold}%)"
                )

        # Send alerts if needed
        if critical_issues or warning_issues:
            self.send_alert_email(critical_issues, warning_issues, report)

    def send_alert_email(self, critical_issues, warning_issues, report):
        """Send alert email"""
        subject = f"Sitemap Health Alert - {getattr(settings, 'SITEMAP_DOMAIN', 'CodingBull')}"

        message = f"""
Sitemap Health Monitoring Alert

Timestamp: {report['monitoring']['check_timestamp']}
Environment: {report['monitoring']['environment']}
Domain: {report['monitoring']['domain']}

Overall Status: {report['overall_status']}

Summary:
- Total Sitemaps: {report['summary']['total_sitemaps']}
- Active Sitemaps: {report['summary']['active_sitemaps']}
- Total URLs: {report['summary']['total_urls']}
- Errors: {report['summary']['errors']}
- Warnings: {report['summary']['warnings']}
"""

        if critical_issues:
            message += f"\nCRITICAL ISSUES:\n"
            for issue in critical_issues:
                message += f"- {issue}\n"

        if warning_issues:
            message += f"\nWARNING ISSUES:\n"
            for issue in warning_issues:
                message += f"- {issue}\n"

        # Get admin emails
        admin_emails = [email for name, email in getattr(settings, 'ADMINS', [])]

        if admin_emails:
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    admin_emails,
                    fail_silently=False,
                )
                self.stdout.write(self.style.SUCCESS(f'Alert email sent to {len(admin_emails)} administrators'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed to send alert email: {e}'))

    def save_monitoring_report(self, report, options):
        """Save monitoring report to file"""
        output_file = options.get('output_file') or f'sitemap_health_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'

        try:
            # Convert datetime objects to strings for JSON serialization
            report_copy = self.serialize_report_for_json(report)

            with open(output_file, 'w') as f:
                json.dump(report_copy, f, indent=2, default=str)

            self.stdout.write(self.style.SUCCESS(f'Monitoring report saved to {output_file}'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to save monitoring report: {e}'))

    def serialize_report_for_json(self, report):
        """Convert datetime objects to strings for JSON serialization"""
        def convert_datetime(obj):
            if isinstance(obj, datetime):
                return obj.isoformat()
            elif isinstance(obj, dict):
                return {k: convert_datetime(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [convert_datetime(item) for item in obj]
            else:
                return obj

        return convert_datetime(report)
