#!/usr/bin/env python
"""
Development server startup script with admin access verification
"""

import os
import sys
import subprocess
import time
import threading
import requests
from urllib.parse import urljoin

def test_admin_access():
    """Test admin access after server starts"""
    time.sleep(3)  # Wait for server to start
    
    base_url = "http://127.0.0.1:8000"
    test_urls = ["/admin/", "/admin/api/blacklistrule/"]
    
    print("\n🔍 Testing admin access...")
    
    for url in test_urls:
        try:
            response = requests.get(urljoin(base_url, url), timeout=5)
            if response.status_code in [200, 302]:  # 302 = redirect to login
                print(f"✅ {url} - Accessible (Status: {response.status_code})")
            elif response.status_code == 403:
                print(f"❌ {url} - BLOCKED (Status: {response.status_code})")
            else:
                print(f"⚠️  {url} - Status: {response.status_code}")
        except Exception as e:
            print(f"💥 {url} - Error: {e}")
    
    print("\n🌐 Admin URL: http://127.0.0.1:8000/admin/")
    print("👤 Username: admin")
    print("🔑 Password: admin123")

def main():
    print("🚀 Starting Django development server...")
    print("📍 Admin panel: http://127.0.0.1:8000/admin/")
    print("=" * 50)
    
    # Start admin access test in background
    test_thread = threading.Thread(target=test_admin_access)
    test_thread.daemon = True
    test_thread.start()
    
    # Start Django server
    try:
        subprocess.run([
            sys.executable, "manage.py", "runserver", "127.0.0.1:8000"
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start server: {e}")

if __name__ == "__main__":
    # Change to the directory containing manage.py
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()