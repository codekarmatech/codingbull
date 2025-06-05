# Environment Configuration

This document explains how to set up environment variables for the CodingBull backend.

## Setup Instructions

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Generate a new Django secret key:**
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

3. **Update the .env file with your values:**
   - Replace `DJANGO_SECRET_KEY` with the generated secret key
   - Update domain names in `DJANGO_ALLOWED_HOSTS` and CORS settings
   - Configure other settings as needed for your environment

## Environment Variables

### Required Variables

- `DJANGO_SECRET_KEY`: Django secret key (required for security)
- `DJANGO_ENV`: Environment type (`development` or `production`)
- `DJANGO_DEBUG`: Debug mode (`True` or `False`)

### Optional Variables

- `DJANGO_ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `CORS_ALLOWED_ORIGINS_PRODUCTION`: Production CORS origins
- `CORS_ALLOWED_ORIGINS_DEVELOPMENT`: Development CORS origins
- `SECURE_SSL_REDIRECT`: Force HTTPS redirect (`True` or `False`)
- `SESSION_COOKIE_SECURE`: Secure session cookies (`True` or `False`)
- `CSRF_COOKIE_SECURE`: Secure CSRF cookies (`True` or `False`)

## Security Notes

- **Never commit the .env file to version control**
- The .env file is already included in .gitignore
- Generate a unique secret key for each environment
- Use strong, random secret keys in production
- Enable SSL settings only when HTTPS is properly configured

## Development vs Production

### Development Settings
- `DJANGO_ENV=development`
- `DJANGO_DEBUG=True`
- `CORS_ALLOW_ALL_ORIGINS=True` (automatically set)
- SSL settings disabled

### Production Settings
- `DJANGO_ENV=production`
- `DJANGO_DEBUG=False` (automatically set)
- Restricted CORS origins
- Enhanced security headers
- SSL settings configurable via environment variables

## Installation

Make sure to install the required dependencies:

```bash
pip install -r requirements.txt
```

This includes `python-dotenv` which is required for loading environment variables.