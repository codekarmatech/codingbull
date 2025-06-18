#!/usr/bin/env python
"""
Database Migration Script: SQLite to PostgreSQL
Migrates CodingBull data from SQLite3 to PostgreSQL for production deployment
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime

# Add the project directory to Python path
sys.path.append(str(Path(__file__).parent))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'codingbull_api.settings')

import django
django.setup()

from django.core.management import execute_from_command_line
from django.db import connections
from django.core.management.commands.dumpdata import Command as DumpDataCommand
from django.core.management.commands.loaddata import Command as LoadDataCommand

def check_postgresql_connection():
    """Check if PostgreSQL database is accessible"""
    try:
        # Test PostgreSQL connection
        os.environ['DJANGO_ENV'] = 'production'
        from django.conf import settings
        
        # Force reload settings with production environment
        django.setup()
        
        db_conn = connections['default']
        db_conn.ensure_connection()
        print("✓ PostgreSQL connection successful")
        return True
    except Exception as e:
        print(f"✗ PostgreSQL connection failed: {e}")
        return False

def backup_sqlite_data():
    """Create a backup of SQLite data"""
    print("📦 Creating SQLite data backup...")
    
    backup_file = f"sqlite_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    try:
        # Set to development to use SQLite
        os.environ['DJANGO_ENV'] = 'development'
        django.setup()
        
        # Export all data except contenttypes and auth.permission
        execute_from_command_line([
            'manage.py', 'dumpdata',
            '--exclude=contenttypes',
            '--exclude=auth.permission',
            '--exclude=sessions.session',
            '--indent=2',
            '--output', backup_file
        ])
        
        print(f"✓ SQLite data backed up to: {backup_file}")
        return backup_file
    except Exception as e:
        print(f"✗ SQLite backup failed: {e}")
        return None

def setup_postgresql_schema():
    """Set up PostgreSQL database schema"""
    print("🔧 Setting up PostgreSQL schema...")
    
    try:
        # Set to production to use PostgreSQL
        os.environ['DJANGO_ENV'] = 'production'
        django.setup()
        
        # Run migrations
        execute_from_command_line(['manage.py', 'migrate', '--run-syncdb'])
        
        print("✓ PostgreSQL schema created successfully")
        return True
    except Exception as e:
        print(f"✗ PostgreSQL schema setup failed: {e}")
        return False

def migrate_data(backup_file):
    """Migrate data from SQLite backup to PostgreSQL"""
    print("🚀 Migrating data to PostgreSQL...")
    
    try:
        # Ensure we're using PostgreSQL
        os.environ['DJANGO_ENV'] = 'production'
        django.setup()
        
        # Load data into PostgreSQL
        execute_from_command_line(['manage.py', 'loaddata', backup_file])
        
        print("✓ Data migration completed successfully")
        return True
    except Exception as e:
        print(f"✗ Data migration failed: {e}")
        return False

def verify_migration():
    """Verify that migration was successful"""
    print("🔍 Verifying migration...")
    
    try:
        os.environ['DJANGO_ENV'] = 'production'
        django.setup()
        
        from api.models import BlogPost, Project, Service, ContactInquiry, Testimonial
        
        # Count records in PostgreSQL
        blog_count = BlogPost.objects.count()
        project_count = Project.objects.count()
        service_count = Service.objects.count()
        inquiry_count = ContactInquiry.objects.count()
        testimonial_count = Testimonial.objects.count()
        
        print(f"✓ Migration verification:")
        print(f"  - Blog Posts: {blog_count}")
        print(f"  - Projects: {project_count}")
        print(f"  - Services: {service_count}")
        print(f"  - Contact Inquiries: {inquiry_count}")
        print(f"  - Testimonials: {testimonial_count}")
        
        return True
    except Exception as e:
        print(f"✗ Migration verification failed: {e}")
        return False

def main():
    """Main migration process"""
    print("🔄 CodingBull Database Migration: SQLite → PostgreSQL")
    print("=" * 60)
    
    # Step 1: Check PostgreSQL connection
    if not check_postgresql_connection():
        print("\n❌ Migration aborted: Cannot connect to PostgreSQL")
        print("Please ensure PostgreSQL is running and credentials are correct")
        return 1
    
    # Step 2: Backup SQLite data
    backup_file = backup_sqlite_data()
    if not backup_file:
        print("\n❌ Migration aborted: SQLite backup failed")
        return 1
    
    # Step 3: Set up PostgreSQL schema
    if not setup_postgresql_schema():
        print("\n❌ Migration aborted: PostgreSQL schema setup failed")
        return 1
    
    # Step 4: Migrate data
    if not migrate_data(backup_file):
        print("\n❌ Migration aborted: Data migration failed")
        return 1
    
    # Step 5: Verify migration
    if not verify_migration():
        print("\n⚠️ Migration completed but verification failed")
        print("Please manually verify the data in PostgreSQL")
        return 1
    
    print("\n🎉 Database migration completed successfully!")
    print(f"📁 SQLite backup saved as: {backup_file}")
    print("🔧 Update your production environment to use PostgreSQL")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
