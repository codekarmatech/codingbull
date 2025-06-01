#!/usr/bin/env python
"""
Test script to demonstrate the security monitoring system
"""

import requests
import time
import random

# Base URL for testing
BASE_URL = "http://127.0.0.1:8000"

def test_normal_requests():
    """Test normal legitimate requests"""
    print("🟢 Testing normal requests...")
    
    normal_requests = [
        "/api/v1/blog-posts/",
        "/api/v1/projects/",
        "/api/v1/services/",
        "/",
        "/admin/",
    ]
    
    for path in normal_requests:
        try:
            response = requests.get(f"{BASE_URL}{path}", timeout=5)
            print(f"  ✓ {path} -> {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"  ✗ {path} -> Error: {e}")
        time.sleep(0.5)

def test_suspicious_requests():
    """Test suspicious requests that should be flagged"""
    print("\n🟡 Testing suspicious requests...")
    
    suspicious_requests = [
        "/wp-admin/",
        "/wp-login.php",
        "/.env",
        "/.git/",
        "/phpmyadmin/",
        "/xmlrpc.php",
        "/shell.php",
        "/cmd.php",
        "/eval.php",
        "/v1/models",
        "/api/v1/models",
    ]
    
    for path in suspicious_requests:
        try:
            response = requests.get(f"{BASE_URL}{path}", timeout=5)
            print(f"  ⚠️  {path} -> {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"  ✗ {path} -> Error: {e}")
        time.sleep(0.5)

def test_malicious_user_agents():
    """Test requests with malicious user agents"""
    print("\n🔴 Testing malicious user agents...")
    
    malicious_user_agents = [
        "sqlmap/1.0",
        "nikto/2.1.6",
        "nmap scripting engine",
        "masscan/1.0",
        "Acunetix Web Vulnerability Scanner",
        "Burp Suite Professional",
        "w3af.org",
        "dirb 2.22",
        "gobuster/3.0",
        "THC-Hydra",
    ]
    
    for ua in malicious_user_agents:
        try:
            headers = {"User-Agent": ua}
            response = requests.get(f"{BASE_URL}/api/v1/blog-posts/", headers=headers, timeout=5)
            print(f"  🚫 {ua[:30]}... -> {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"  ✗ {ua[:30]}... -> Error: {e}")
        time.sleep(0.5)

def test_rate_limiting():
    """Test rate limiting functionality"""
    print("\n⏱️  Testing rate limiting...")
    
    print("  Sending rapid requests to trigger rate limiting...")
    for i in range(15):
        try:
            response = requests.get(f"{BASE_URL}/api/v1/blog-posts/", timeout=5)
            print(f"  Request {i+1}: {response.status_code}")
            if response.status_code == 429:
                print("  🚫 Rate limit triggered!")
                break
        except requests.exceptions.RequestException as e:
            print(f"  ✗ Request {i+1}: Error: {e}")
        time.sleep(0.1)

def test_sql_injection_patterns():
    """Test SQL injection patterns in query parameters"""
    print("\n💉 Testing SQL injection patterns...")
    
    sql_patterns = [
        "?id=1' OR '1'='1",
        "?search='; DROP TABLE users; --",
        "?filter=1 UNION SELECT * FROM users",
        "?q=<script>alert('xss')</script>",
        "?data=javascript:alert(1)",
    ]
    
    for pattern in sql_patterns:
        try:
            response = requests.get(f"{BASE_URL}/api/v1/blog-posts/{pattern}", timeout=5)
            print(f"  ⚠️  {pattern[:30]}... -> {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"  ✗ {pattern[:30]}... -> Error: {e}")
        time.sleep(0.5)

def main():
    print("🔒 CodingBull Security Monitoring System Test")
    print("=" * 50)
    
    print("Starting security tests...")
    print("Make sure the Django server is running on http://127.0.0.1:8000")
    print()
    
    try:
        # Test if server is running
        response = requests.get(f"{BASE_URL}/", timeout=5)
        print(f"✓ Server is running (Status: {response.status_code})")
    except requests.exceptions.RequestException:
        print("✗ Server is not running. Please start the Django server first.")
        print("Run: python manage.py runserver")
        return
    
    print()
    
    # Run all tests
    test_normal_requests()
    test_suspicious_requests()
    test_malicious_user_agents()
    test_rate_limiting()
    test_sql_injection_patterns()
    
    print("\n" + "=" * 50)
    print("🎯 Test completed!")
    print("\nCheck the Django admin interface to see:")
    print("1. Security logs with risk analysis")
    print("2. IP addresses and their reputation scores")
    print("3. User agent analysis")
    print("4. Security alerts generated")
    print("5. Rate limiting trackers")
    print("\nAdmin URL: http://127.0.0.1:8000/admin/")

if __name__ == "__main__":
    main()