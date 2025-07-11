#!/usr/bin/env python3
"""
Automated Sitemap Generation Script for CodingBull
This script can be run as a cron job to automatically update sitemaps
"""

import os
import sys
import django
import logging
from datetime import datetime
from pathlib import Path

# Add the Django project to the Python path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'codingbull_api.settings')
django.setup()

from django.core.management import call_command
from django.conf import settings
from django.core.mail import send_mail
from api.sitemap_index import SitemapIndex
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(BASE_DIR / 'logs' / 'sitemap_update.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class SitemapUpdateManager:
    """Manager for automated sitemap updates"""

    def __init__(self):
        self.base_dir = BASE_DIR
        self.log_file = self.base_dir / 'logs' / 'sitemap_update.log'
        self.report_file = self.base_dir / 'logs' / f'sitemap_report_{datetime.now().strftime("%Y%m%d")}.json'
        self.sitemap_index = SitemapIndex()

        # Ensure log directory exists
        self.log_file.parent.mkdir(exist_ok=True)

    def run_update(self):
        """Run the complete sitemap update process"""
        logger.info("Starting automated sitemap update...")

        update_report = {
            'timestamp': datetime.now().isoformat(),
            'environment': getattr(settings, 'ENVIRONMENT', 'unknown'),
            'domain': getattr(settings, 'SITEMAP_DOMAIN', 'unknown'),
            'steps': [],
            'errors': [],
            'warnings': [],
            'success': False
        }

        try:
            # Step 1: Generate sitemaps
            self.generate_sitemaps(update_report)

            # Step 2: Sync with frontend
            self.sync_with_frontend(update_report)

            # Step 3: Validate sitemaps
            self.validate_sitemaps(update_report)

            # Step 4: Monitor health
            self.monitor_health(update_report)

            # Step 5: Cleanup old files
            self.cleanup_old_files(update_report)

            update_report['success'] = len(update_report['errors']) == 0

            # Save report
            self.save_report(update_report)

            # Send notifications if needed
            self.send_notifications(update_report)

            logger.info("Sitemap update completed successfully")

        except Exception as e:
            update_report['errors'].append(f"Critical error: {str(e)}")
            update_report['success'] = False
            logger.error(f"Sitemap update failed: {e}")
            self.save_report(update_report)
            self.send_error_notification(update_report)

        return update_report

    def generate_sitemaps(self, report):
        """Generate fresh sitemaps"""
        logger.info("Generating sitemaps...")

        try:
            # Generate main sitemap
            call_command('generate_sitemap', '--validate', verbosity=0)
            report['steps'].append('generate_main_sitemap')

            # Sync sitemaps
            call_command('sync_sitemap', verbosity=0)
            report['steps'].append('sync_sitemaps')

            logger.info("Sitemaps generated successfully")

        except Exception as e:
            error_msg = f"Error generating sitemaps: {str(e)}"
            report['errors'].append(error_msg)
            logger.error(error_msg)

    def sync_with_frontend(self, report):
        """Sync sitemaps with frontend static files"""
        logger.info("Syncing with frontend...")

        try:
            # Find frontend directory
            frontend_paths = [
                self.base_dir.parent / 'codingbull-website' / 'public',
                self.base_dir.parent / 'frontend' / 'public',
                self.base_dir.parent / 'website' / 'public',
            ]

            frontend_dir = None
            for path in frontend_paths:
                if path.exists():
                    frontend_dir = path
                    break

            if frontend_dir:
                # Copy sitemap to frontend
                backend_sitemap = self.base_dir / 'sitemap.xml'
                frontend_sitemap = frontend_dir / 'sitemap.xml'

                if backend_sitemap.exists():
                    import shutil
                    shutil.copy2(backend_sitemap, frontend_sitemap)
                    report['steps'].append('sync_frontend_sitemap')
                    logger.info(f"Sitemap synced to frontend: {frontend_sitemap}")
                else:
                    report['warnings'].append("Backend sitemap not found for sync")
            else:
                report['warnings'].append("Frontend directory not found")

        except Exception as e:
            error_msg = f"Error syncing with frontend: {str(e)}"
            report['errors'].append(error_msg)
            logger.error(error_msg)

    def validate_sitemaps(self, report):
        """Validate sitemap structure and content"""
        logger.info("Validating sitemaps...")

        try:
            # Validate using Django command
            call_command('generate_sitemap', '--validate', verbosity=0)

            # Additional validation using SitemapIndex
            errors, warnings = self.sitemap_index.validate_sitemap_index()

            if errors:
                report['errors'].extend(errors)
            if warnings:
                report['warnings'].extend(warnings)

            report['steps'].append('validate_sitemaps')
            logger.info("Sitemap validation completed")

        except Exception as e:
            error_msg = f"Error validating sitemaps: {str(e)}"
            report['errors'].append(error_msg)
            logger.error(error_msg)

    def monitor_health(self, report):
        """Monitor sitemap health"""
        logger.info("Monitoring sitemap health...")

        try:
            # Generate health report
            health_report = self.sitemap_index.generate_sitemap_health_report()

            # Check for critical issues
            if health_report['overall_status'] == 'error':
                report['errors'].append("Sitemap health check failed")
            elif health_report['overall_status'] == 'warning':
                report['warnings'].append("Sitemap health check has warnings")

            # Store health metrics
            report['health_metrics'] = {
                'total_sitemaps': health_report['summary']['total_sitemaps'],
                'active_sitemaps': health_report['summary']['active_sitemaps'],
                'total_urls': health_report['summary']['total_urls'],
                'overall_status': health_report['overall_status']
            }

            report['steps'].append('monitor_health')
            logger.info("Health monitoring completed")

        except Exception as e:
            error_msg = f"Error monitoring health: {str(e)}"
            report['errors'].append(error_msg)
            logger.error(error_msg)

    def cleanup_old_files(self, report):
        """Clean up old log and report files"""
        logger.info("Cleaning up old files...")

        try:
            logs_dir = self.base_dir / 'logs'
            if logs_dir.exists():
                from datetime import timedelta
                cutoff_date = datetime.now() - timedelta(days=30)

                cleaned_files = 0
                for file_path in logs_dir.glob('sitemap_report_*.json'):
                    if file_path.stat().st_mtime < cutoff_date.timestamp():
                        file_path.unlink()
                        cleaned_files += 1

                if cleaned_files > 0:
                    logger.info(f"Cleaned up {cleaned_files} old report files")

                report['steps'].append('cleanup_old_files')
                report['cleaned_files'] = cleaned_files

        except Exception as e:
            error_msg = f"Error cleaning up files: {str(e)}"
            report['warnings'].append(error_msg)
            logger.warning(error_msg)

    def save_report(self, report):
        """Save update report to file"""
        try:
            with open(self.report_file, 'w') as f:
                json.dump(report, f, indent=2, default=str)
            logger.info(f"Update report saved to {self.report_file}")
        except Exception as e:
            logger.error(f"Error saving report: {e}")

    def send_notifications(self, report):
        """Send notifications based on report results"""
        if not getattr(settings, 'EMAIL_HOST', None):
            return

        # Send notification only if there are errors or significant changes
        should_notify = (
            len(report['errors']) > 0 or
            len(report['warnings']) > 5 or
            report.get('health_metrics', {}).get('total_urls', 0) == 0
        )

        if should_notify:
            self.send_status_notification(report)

    def send_status_notification(self, report):
        """Send status notification email"""
        try:
            subject = f"Sitemap Update Report - {getattr(settings, 'SITEMAP_DOMAIN', 'CodingBull')}"

            status = "SUCCESS" if report['success'] else "FAILED"
            message = f"""
Automated Sitemap Update Report

Status: {status}
Timestamp: {report['timestamp']}
Environment: {report['environment']}
Domain: {report['domain']}

Steps Completed: {len(report['steps'])}
{chr(10).join(f'- {step}' for step in report['steps'])}

Errors: {len(report['errors'])}
{chr(10).join(f'- {error}' for error in report['errors'])}

Warnings: {len(report['warnings'])}
{chr(10).join(f'- {warning}' for warning in report['warnings'][:5])}
"""

            if 'health_metrics' in report:
                metrics = report['health_metrics']
                message += f"""
Health Metrics:
- Total Sitemaps: {metrics['total_sitemaps']}
- Active Sitemaps: {metrics['active_sitemaps']}
- Total URLs: {metrics['total_urls']}
- Overall Status: {metrics['overall_status']}
"""

            admin_emails = [email for name, email in getattr(settings, 'ADMINS', [])]
            if admin_emails:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    admin_emails,
                    fail_silently=False,
                )
                logger.info(f"Status notification sent to {len(admin_emails)} administrators")

        except Exception as e:
            logger.error(f"Error sending status notification: {e}")

    def send_error_notification(self, report):
        """Send error notification email"""
        try:
            subject = f"CRITICAL: Sitemap Update Failed - {getattr(settings, 'SITEMAP_DOMAIN', 'CodingBull')}"

            message = f"""
CRITICAL ERROR: Automated Sitemap Update Failed

Timestamp: {report['timestamp']}
Environment: {report['environment']}
Domain: {report['domain']}

Errors:
{chr(10).join(f'- {error}' for error in report['errors'])}

Please investigate and resolve these issues immediately.
"""

            admin_emails = [email for name, email in getattr(settings, 'ADMINS', [])]
            if admin_emails:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    admin_emails,
                    fail_silently=False,
                )
                logger.info(f"Error notification sent to {len(admin_emails)} administrators")

        except Exception as e:
            logger.error(f"Error sending error notification: {e}")

def main():
    """Main function for script execution"""
    manager = SitemapUpdateManager()
    report = manager.run_update()

    # Exit with appropriate code
    sys.exit(0 if report['success'] else 1)

if __name__ == '__main__':
    main()
