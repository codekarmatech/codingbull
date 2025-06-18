#!/usr/bin/env python3
"""
Database Status Checker
Verifies current database configuration and migration status
"""

import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
sys.path.append(str(Path(__file__).parent))

def check_environment_config():
    """Check current environment configuration"""
    print("🔍 Environment Configuration Check")
    print("=" * 50)
    
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv('.env')
    
    env = os.environ.get('DJANGO_ENV', 'development')
    database_url = os.environ.get('DATABASE_URL', 'Not set')
    
    print(f"Current Environment: {env}")
    print(f"DATABASE_URL: {database_url}")
    print(f"DB_NAME: {os.environ.get('DB_NAME', 'Not set')}")
    print(f"DB_USER: {os.environ.get('DB_USER', 'Not set')}")
    print(f"DB_HOST: {os.environ.get('DB_HOST', 'Not set')}")
    print(f"DB_PORT: {os.environ.get('DB_PORT', 'Not set')}")
    
    return env, database_url

def check_current_database():
    """Check which database Django is currently using"""
    print("\n🗄️ Current Database Configuration")
    print("=" * 50)
    
    # Setup Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'codingbull_api.settings')
    django.setup()
    
    from django.db import connection
    
    engine = connection.settings_dict['ENGINE']
    name = connection.settings_dict['NAME']
    
    print(f"Database Engine: {engine}")
    print(f"Database Name: {name}")
    
    if 'postgresql' in engine:
        print(f"Database User: {connection.settings_dict.get('USER', 'N/A')}")
        print(f"Database Host: {connection.settings_dict.get('HOST', 'N/A')}")
        print(f"Database Port: {connection.settings_dict.get('PORT', 'N/A')}")
        db_type = "PostgreSQL"
    elif 'sqlite' in engine:
        db_type = "SQLite"
    else:
        db_type = "Unknown"
    
    print(f"Database Type: {db_type}")
    
    return db_type, connection

def test_database_connection(db_type, connection):
    """Test database connection and verify data"""
    print(f"\n🔌 Testing {db_type} Connection")
    print("=" * 50)
    
    try:
        with connection.cursor() as cursor:
            if db_type == "PostgreSQL":
                cursor.execute('SELECT version()')
                version = cursor.fetchone()[0]
                print(f"✅ PostgreSQL Connection: SUCCESS")
                print(f"Version: {version[:80]}...")
            elif db_type == "SQLite":
                cursor.execute('SELECT sqlite_version()')
                version = cursor.fetchone()[0]
                print(f"✅ SQLite Connection: SUCCESS")
                print(f"Version: {version}")
            
            # Check data
            print(f"\n📊 Data Verification in {db_type}:")
            
            try:
                cursor.execute('SELECT COUNT(*) FROM api_blogpost')
                blog_count = cursor.fetchone()[0]
                print(f"Blog Posts: {blog_count}")
            except:
                print("Blog Posts: Table not found")
            
            try:
                cursor.execute('SELECT COUNT(*) FROM api_project')
                project_count = cursor.fetchone()[0]
                print(f"Projects: {project_count}")
            except:
                print("Projects: Table not found")
            
            try:
                cursor.execute('SELECT COUNT(*) FROM api_service')
                service_count = cursor.fetchone()[0]
                print(f"Services: {service_count}")
            except:
                print("Services: Table not found")
                
            try:
                cursor.execute('SELECT COUNT(*) FROM api_contactinquiry')
                inquiry_count = cursor.fetchone()[0]
                print(f"Contact Inquiries: {inquiry_count}")
            except:
                print("Contact Inquiries: Table not found")
                
            try:
                cursor.execute('SELECT COUNT(*) FROM api_testimonial')
                testimonial_count = cursor.fetchone()[0]
                print(f"Testimonials: {testimonial_count}")
            except:
                print("Testimonials: Table not found")
                
    except Exception as e:
        print(f"❌ {db_type} Connection: FAILED")
        print(f"Error: {e}")

def check_migration_files():
    """Check if migration was successful"""
    print(f"\n📁 Migration Files Check")
    print("=" * 50)
    
    # Check for SQLite backup
    backup_files = list(Path('.').glob('sqlite_backup_*.json'))
    if backup_files:
        latest_backup = max(backup_files, key=lambda x: x.stat().st_mtime)
        print(f"✅ SQLite Backup Found: {latest_backup}")
        print(f"Backup Size: {latest_backup.stat().st_size / 1024:.1f} KB")
    else:
        print("❌ No SQLite backup files found")
    
    # Check if SQLite file still exists
    sqlite_file = Path('db.sqlite3')
    if sqlite_file.exists():
        print(f"✅ SQLite File: {sqlite_file} ({sqlite_file.stat().st_size / 1024:.1f} KB)")
    else:
        print("❌ SQLite file not found")

def main():
    """Main function to run all checks"""
    print("🔍 CodingBull Database Status Check")
    print("=" * 60)
    
    try:
        # Check environment configuration
        env, database_url = check_environment_config()
        
        # Check current database
        db_type, connection = check_current_database()
        
        # Test connection
        test_database_connection(db_type, connection)
        
        # Check migration files
        check_migration_files()
        
        print(f"\n🎯 Summary")
        print("=" * 50)
        print(f"Environment: {env}")
        print(f"Active Database: {db_type}")
        
        if env == 'development' and db_type == 'SQLite':
            print("✅ Expected: Development environment using SQLite")
            print("💡 To use PostgreSQL, set DJANGO_ENV=production")
        elif env == 'production' and db_type == 'PostgreSQL':
            print("✅ Expected: Production environment using PostgreSQL")
        else:
            print("⚠️ Unexpected configuration")
            
    except Exception as e:
        print(f"❌ Error during database check: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
