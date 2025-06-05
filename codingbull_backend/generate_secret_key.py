#!/usr/bin/env python
"""
Script to generate a new Django secret key.
Run this script to generate a secure secret key for your Django application.
"""

from django.core.management.utils import get_random_secret_key

if __name__ == "__main__":
    secret_key = get_random_secret_key()
    print("Generated Django Secret Key:")
    print(secret_key)
    print("\nCopy this key to your .env file as DJANGO_SECRET_KEY")
    print("Example:")
    print(f"DJANGO_SECRET_KEY={secret_key}")