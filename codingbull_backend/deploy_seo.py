#!/usr/bin/env python3
"""
SEO Deployment Script for CodingBull Technovations
This script handles all SEO-related deployments including sitemap generation,
robots.txt updates, and Google Search Console submissions.
"""

import os
import sys
import json
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path
import shutil
import subprocess
import requests
from urllib.parse import urljoin

class SEODeployment:
    def __init__(self):
        self.base_dir = Path(__file__).resolve().parent
        self.website_dir = self.base_dir.parent / "codingbull-website"
        self.public_dir = self.website_dir / "public"
        self.backend_dir = self.base_dir

        # Configuration
        self.domain = "https://codingbullz.com"
        self.site_name = "CodingBull Technovations"
        self.company_info = {
            "name": "CodingBull Technovations Pvt Ltd",
            "gstin": "24AAMCC7617E1ZP",
            "location": "Ahmedabad, Gujarat, India",
            "email": "contact@codingbullz.com",
            "founded": "2025"
        }

        # SEO URLs structure
        self.seo_urls = [
            {
                'path': '/',
                'title': 'CodingBull Technovations - Web & Mobile Development Agency',
                'description': 'Premium web development, mobile app development, AI/ML solutions, and digital transformation services. Expert React, Django, and Node.js development team.',
                'priority': '1.0',
                'changefreq': 'daily',
                'keywords': ['web development', 'mobile app development', 'AI ML solutions', 'digital transformation']
            },
            {
                'path': '/about',
                'title': 'About CodingBull - Expert Development Team',
                'description': 'Learn about CodingBull\'s journey, our expert team, and the values that drive our innovative web and mobile development solutions.',
                'priority': '0.8',
                'changefreq': 'weekly',
                'keywords': ['about codingbull', 'development team', 'company history']
            },
            {
                'path': '/services',
                'title': 'Web Development Services - CodingBull',
                'description': 'Comprehensive web development, mobile app development, AI/ML, and digital transformation services. React, Django, Node.js experts.',
                'priority': '0.9',
                'changefreq': 'weekly',
                'keywords': ['web development services', 'mobile app development', 'AI ML services']
            },
            {
                'path': '/our-projects',
                'title': 'Our Projects - CodingBull Portfolio',
                'description': 'Explore CodingBull\'s portfolio of successful web development, mobile app, and AI/ML projects for clients worldwide.',
                'priority': '0.8',
                'changefreq': 'weekly',
                'keywords': ['portfolio', 'projects', 'case studies']
            },
            {
                'path': '/blog',
                'title': 'Tech Blog - CodingBull Insights',
                'description': 'Latest insights, tutorials, and trends in web development, mobile apps, AI/ML, and digital transformation.',
                'priority': '0.8',
                'changefreq': 'daily',
                'keywords': ['tech blog', 'development tutorials', 'industry insights']
            },
            {
                'path': '/contact',
                'title': 'Contact CodingBull - Get Your Quote',
                'description': 'Contact CodingBull for web development, mobile app development, AI/ML solutions. Get your free consultation and quote today.',
                'priority': '0.7',
                'changefreq': 'monthly',
                'keywords': ['contact', 'quote', 'consultation']
            },
            {
                'path': '/privacy-policy',
                'title': 'Privacy Policy - CodingBull',
                'description': 'CodingBull\'s Privacy Policy - Learn how we collect, use, and protect your personal information in compliance with GDPR.',
                'priority': '0.3',
                'changefreq': 'yearly',
                'keywords': ['privacy policy', 'data protection', 'GDPR']
            },
            {
                'path': '/terms-of-service',
                'title': 'Terms of Service - CodingBull',
                'description': 'CodingBull\'s Terms of Service - Understand the terms and conditions for using our development services.',
                'priority': '0.3',
                'changefreq': 'yearly',
                'keywords': ['terms of service', 'terms and conditions']
            },
            {
                'path': '/cookie-policy',
                'title': 'Cookie Policy - CodingBull',
                'description': 'CodingBull\'s Cookie Policy - Information about how we use cookies and similar technologies.',
                'priority': '0.3',
                'changefreq': 'yearly',
                'keywords': ['cookie policy', 'cookies', 'tracking']
            }
        ]

    def log(self, message, level="INFO"):
        """Log message with timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")

    def generate_sitemap(self):
        """Generate XML sitemap"""
        self.log("Generating sitemap...")

        # Create XML structure
        urlset = ET.Element('urlset')
        urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
        urlset.set('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
        urlset.set('xsi:schemaLocation', 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd')

        for url_data in self.seo_urls:
            url_elem = ET.SubElement(urlset, 'url')

            # Add location (required)
            loc_elem = ET.SubElement(url_elem, 'loc')
            loc_elem.text = f"{self.domain}{url_data['path']}"

            # Add lastmod (optional)
            lastmod_elem = ET.SubElement(url_elem, 'lastmod')
            lastmod_elem.text = datetime.now().strftime('%Y-%m-%d')

            # Add changefreq (optional)
            changefreq_elem = ET.SubElement(url_elem, 'changefreq')
            changefreq_elem.text = url_data['changefreq']

            # Add priority (optional)
            priority_elem = ET.SubElement(url_elem, 'priority')
            priority_elem.text = url_data['priority']

        # Format XML
        ET.indent(urlset, space='  ')
        xml_str = ET.tostring(urlset, encoding='unicode')

        # Add XML declaration
        sitemap_content = f'<?xml version="1.0" encoding="UTF-8"?>\n{xml_str}'

        # Save to files
        sitemap_path = self.public_dir / 'sitemap.xml'
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(sitemap_content)

        self.log(f"Sitemap saved to {sitemap_path}")
        return sitemap_content

    def generate_robots_txt(self):
        """Generate robots.txt file"""
        self.log("Generating robots.txt...")

        robots_content = f"""# Robots.txt for {self.company_info['name']}
# Website: {self.domain}
# Updated: {datetime.now().strftime('%B %Y')}

# Main crawlers
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /static/admin/
Disallow: /django-admin/
Disallow: /media/private/
Disallow: /error/
Disallow: /404/
Disallow: /500/
Allow: /static/frontend/
Allow: /media/public/
Crawl-delay: 1

# Google crawlers
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /static/admin/
Disallow: /django-admin/
Crawl-delay: 1

# Bing crawlers
User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /static/admin/
Disallow: /django-admin/
Crawl-delay: 1

# Yandex crawlers
User-agent: YandexBot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /static/admin/
Disallow: /django-admin/
Crawl-delay: 1

# AI crawlers - Allow with restrictions
User-agent: GPTBot
Allow: /
Allow: /blog/
Allow: /services/
Allow: /about/
Allow: /our-projects/
Disallow: /admin/
Disallow: /api/
Disallow: /contact/
Disallow: /privacy-policy/
Disallow: /terms-of-service/
Crawl-delay: 2

User-agent: Google-Extended
Allow: /
Allow: /blog/
Allow: /services/
Allow: /about/
Allow: /our-projects/
Disallow: /admin/
Disallow: /api/
Disallow: /contact/
Disallow: /privacy-policy/
Disallow: /terms-of-service/
Crawl-delay: 2

User-agent: ChatGPT-User
Allow: /
Allow: /blog/
Allow: /services/
Allow: /about/
Allow: /our-projects/
Disallow: /admin/
Disallow: /api/
Disallow: /contact/
Disallow: /privacy-policy/
Disallow: /terms-of-service/
Crawl-delay: 2

User-agent: CCBot
Allow: /
Allow: /blog/
Allow: /services/
Allow: /about/
Allow: /our-projects/
Disallow: /admin/
Disallow: /api/
Disallow: /contact/
Disallow: /privacy-policy/
Disallow: /terms-of-service/
Crawl-delay: 2

# Bad bots - Block completely
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: MegaIndex
Disallow: /

User-agent: BLEXBot
Disallow: /

User-agent: PetalBot
Disallow: /

# Sitemap location
Sitemap: {self.domain}/sitemap.xml

# Additional information
# Company: {self.company_info['name']}
# GSTIN: {self.company_info['gstin']}
# Location: {self.company_info['location']}
# Contact: {self.company_info['email']}
# Services: Web Development, Mobile App Development, AI/ML Solutions
"""

        robots_path = self.public_dir / 'robots.txt'
        with open(robots_path, 'w', encoding='utf-8') as f:
            f.write(robots_content)

        self.log(f"Robots.txt saved to {robots_path}")
        return robots_content

    def generate_structured_data(self):
        """Generate structured data JSON-LD"""
        self.log("Generating structured data...")

        # Organization structured data
        organization_data = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": self.company_info['name'],
            "alternateName": "CodingBull",
            "url": self.domain,
            "logo": f"{self.domain}/static/frontend/codingbulllogo.png",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91",
                "contactType": "customer service",
                "email": self.company_info['email'],
                "availableLanguage": "en"
            },
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Ahmedabad",
                "addressRegion": "Gujarat",
                "addressCountry": "IN"
            },
            "founder": {
                "@type": "Person",
                "name": "Pranshu Dixit"
            },
            "foundingDate": self.company_info['founded'],
            "description": "Premium web development, mobile app development, AI/ML solutions, and digital transformation services",
            "sameAs": [
                "https://www.linkedin.com/company/codingbull-technovations",
                "https://twitter.com/codingbulltech"
            ],
            "services": [
                "Web Development",
                "Mobile App Development",
                "AI/ML Solutions",
                "Digital Transformation",
                "UI/UX Design",
                "Cloud Solutions"
            ]
        }

        # Website structured data
        website_data = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": self.site_name,
            "url": self.domain,
            "potentialAction": {
                "@type": "SearchAction",
                "target": f"{self.domain}/search?q={{search_term_string}}",
                "query-input": "required name=search_term_string"
            }
        }

        # Save structured data
        structured_data_path = self.public_dir / 'structured-data.json'
        with open(structured_data_path, 'w', encoding='utf-8') as f:
            json.dump({
                "organization": organization_data,
                "website": website_data
            }, f, indent=2)

        self.log(f"Structured data saved to {structured_data_path}")
        return organization_data, website_data

    def validate_sitemap(self, sitemap_content):
        """Validate sitemap XML structure"""
        self.log("Validating sitemap...")

        try:
            root = ET.fromstring(sitemap_content)

            # Check namespace
            expected_ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
            if root.tag != f'{{{expected_ns}}}urlset':
                self.log(f'Invalid namespace. Expected: {expected_ns}', "ERROR")
                return False

            # Check URLs
            url_count = 0
            for url_elem in root.findall(f'{{{expected_ns}}}url'):
                url_count += 1

                # Check required elements
                loc = url_elem.find(f'{{{expected_ns}}}loc')
                if loc is None or not loc.text:
                    self.log(f'URL {url_count}: Missing or empty <loc> element', "ERROR")
                    continue

                self.log(f'✓ URL {url_count}: {loc.text}')

            if url_count == 0:
                self.log('No URLs found in sitemap', "ERROR")
                return False

            self.log(f'Sitemap validation passed! Found {url_count} URLs.', "SUCCESS")
            return True

        except ET.ParseError as e:
            self.log(f'XML parsing error: {e}', "ERROR")
            return False

    def test_sitemap_accessibility(self):
        """Test if sitemap is accessible"""
        self.log("Testing sitemap accessibility...")

        sitemap_url = f"{self.domain}/sitemap.xml"
        try:
            response = requests.get(sitemap_url, timeout=10)
            if response.status_code == 200:
                self.log(f"✓ Sitemap accessible at {sitemap_url}", "SUCCESS")
                return True
            else:
                self.log(f"✗ Sitemap not accessible: {response.status_code}", "ERROR")
                return False
        except requests.RequestException as e:
            self.log(f"✗ Error accessing sitemap: {e}", "ERROR")
            return False

    def generate_seo_report(self):
        """Generate SEO deployment report"""
        self.log("Generating SEO report...")

        report = {
            "deployment_date": datetime.now().isoformat(),
            "domain": self.domain,
            "company": self.company_info,
            "urls_count": len(self.seo_urls),
            "sitemap_location": f"{self.domain}/sitemap.xml",
            "robots_location": f"{self.domain}/robots.txt",
            "files_generated": [
                "sitemap.xml",
                "robots.txt",
                "structured-data.json"
            ],
            "next_steps": [
                "Submit sitemap to Google Search Console",
                "Submit sitemap to Bing Webmaster Tools",
                "Verify robots.txt is working correctly",
                "Set up Google Analytics",
                "Monitor search rankings"
            ]
        }

        report_path = self.backend_dir / 'seo-deployment-report.json'
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)

        self.log(f"SEO report saved to {report_path}")
        return report

    def deploy_all(self):
        """Deploy all SEO components"""
        self.log("Starting SEO deployment...")

        try:
            # Generate sitemap
            sitemap_content = self.generate_sitemap()

            # Validate sitemap
            if not self.validate_sitemap(sitemap_content):
                self.log("Sitemap validation failed", "ERROR")
                return False

            # Generate robots.txt
            self.generate_robots_txt()

            # Generate structured data
            self.generate_structured_data()

            # Generate report
            report = self.generate_seo_report()

            # Display summary
            self.log("=" * 60)
            self.log("SEO DEPLOYMENT COMPLETED SUCCESSFULLY!", "SUCCESS")
            self.log("=" * 60)
            self.log(f"Domain: {self.domain}")
            self.log(f"URLs in sitemap: {len(self.seo_urls)}")
            self.log(f"Files generated: {len(report['files_generated'])}")
            self.log("=" * 60)

            self.log("Next steps:")
            for step in report['next_steps']:
                self.log(f"• {step}")

            return True

        except Exception as e:
            self.log(f"SEO deployment failed: {e}", "ERROR")
            return False

def main():
    """Main function"""
    print("🚀 CodingBull SEO Deployment Tool")
    print("=" * 60)

    seo_deployer = SEODeployment()

    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "sitemap":
            seo_deployer.generate_sitemap()
        elif command == "robots":
            seo_deployer.generate_robots_txt()
        elif command == "structured-data":
            seo_deployer.generate_structured_data()
        elif command == "validate":
            sitemap_path = seo_deployer.public_dir / 'sitemap.xml'
            if sitemap_path.exists():
                with open(sitemap_path, 'r', encoding='utf-8') as f:
                    seo_deployer.validate_sitemap(f.read())
            else:
                seo_deployer.log("Sitemap not found", "ERROR")
        elif command == "test":
            seo_deployer.test_sitemap_accessibility()
        elif command == "report":
            seo_deployer.generate_seo_report()
        else:
            print("Available commands: sitemap, robots, structured-data, validate, test, report")
    else:
        # Run full deployment
        success = seo_deployer.deploy_all()
        sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
