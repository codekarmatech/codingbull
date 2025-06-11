"""
Security Headers Middleware
Adds comprehensive security headers to all responses
"""

from django.utils.deprecation import MiddlewareMixin
from django.conf import settings


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Middleware to add security headers to all responses
    """
    
    def process_response(self, request, response):
        """Add security headers to response"""

        # Skip security headers for media files - let MediaSecurityMiddleware handle them
        if request.path.startswith('/media/'):
            return response

        # Content Security Policy (CSP)
        csp_directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https: blob:",
            "connect-src 'self' https://www.google-analytics.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests"
        ]
        
        # Only add CSP in production or if explicitly enabled
        if getattr(settings, 'ENVIRONMENT', 'development') == 'production':
            response['Content-Security-Policy'] = '; '.join(csp_directives)
        
        # X-Content-Type-Options
        response['X-Content-Type-Options'] = 'nosniff'
        
        # X-Frame-Options (already set in Django settings, but ensure it's there)
        if 'X-Frame-Options' not in response:
            response['X-Frame-Options'] = 'DENY'
        
        # X-XSS-Protection (legacy, but still useful for older browsers)
        response['X-XSS-Protection'] = '1; mode=block'
        
        # Referrer Policy
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Permissions Policy (formerly Feature Policy)
        permissions_policy = [
            "geolocation=()",
            "microphone=()",
            "camera=()",
            "payment=()",
            "usb=()",
            "magnetometer=()",
            "gyroscope=()",
            "speaker=()",
            "vibrate=()",
            "fullscreen=(self)",
            "sync-xhr=()"
        ]
        response['Permissions-Policy'] = ', '.join(permissions_policy)
        
        # Environment-aware Cross-Origin policies
        environment = getattr(settings, 'ENVIRONMENT', 'development')

        if environment == 'development':
            # Development: More permissive for easier development
            # Don't set Cross-Origin-Embedder-Policy in development to avoid CORS issues
            response['Cross-Origin-Opener-Policy'] = 'unsafe-none'
            # For non-media resources, be more permissive in development
            response['Cross-Origin-Resource-Policy'] = 'cross-origin'
        else:
            # Production: Strict security
            response['Cross-Origin-Embedder-Policy'] = 'require-corp'
            response['Cross-Origin-Opener-Policy'] = 'same-origin'
            # For non-media resources in production, use same-origin
            response['Cross-Origin-Resource-Policy'] = 'same-origin'
        
        # Server header removal (security through obscurity)
        if 'Server' in response:
            del response['Server']
        
        # Add custom security header to identify our security measures
        response['X-Security-Framework'] = 'CodingBull-Security-v1.0'
        
        return response


class APISecurityHeadersMiddleware(MiddlewareMixin):
    """
    Specific security headers for API endpoints
    """
    
    def process_response(self, request, response):
        """Add API-specific security headers"""
        
        # Only apply to API endpoints
        if not request.path.startswith('/api/'):
            return response
        
        # Cache Control for API responses
        response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        
        # API-specific headers
        response['X-API-Version'] = 'v1.0'
        response['X-Rate-Limit-Policy'] = 'Enforced'
        
        # Ensure JSON content type for API responses
        if request.path.startswith('/api/') and response.get('Content-Type', '').startswith('application/json'):
            response['X-Content-Type-Options'] = 'nosniff'
        
        return response


class MediaSecurityMiddleware(MiddlewareMixin):
    """
    Security middleware for media files with Chrome-compatible CORS support
    """

    def process_response(self, request, response):
        """Add security headers for media files"""

        # Only apply to media files
        if not request.path.startswith('/media/'):
            return response

        # Environment-aware security headers for media files
        from django.conf import settings

        environment = getattr(settings, 'ENVIRONMENT', 'development')

        if environment == 'development':
            # Development: Remove problematic headers for Chrome compatibility
            problematic_headers = [
                'Cross-Origin-Embedder-Policy',
                'Cross-Origin-Opener-Policy',
                'X-Frame-Options',
                'Referrer-Policy',
                'Permissions-Policy',
                'X-XSS-Protection',
                'X-Security-Framework'
            ]

            for header in problematic_headers:
                if header in response:
                    del response[header]

            # Set Cross-Origin-Resource-Policy to cross-origin for media files in development
            response['Cross-Origin-Resource-Policy'] = 'cross-origin'

            # Set essential CORS headers for media files
            origin = request.META.get('HTTP_ORIGIN')
            if origin and ('localhost' in origin or '127.0.0.1' in origin):
                response['Access-Control-Allow-Origin'] = origin
                response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
                response['Access-Control-Allow-Headers'] = '*'
                response['Access-Control-Allow-Credentials'] = 'true'
                response['Access-Control-Max-Age'] = '86400'

            # Very minimal headers for development - avoid X-Content-Type-Options for media
            response['Cache-Control'] = 'public, max-age=3600'

        else:
            # Production: Stricter security but still CORS-compatible
            response['X-Frame-Options'] = 'SAMEORIGIN'
            response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
            response['X-Content-Type-Options'] = 'nosniff'
            response['Cache-Control'] = 'public, max-age=3600'
            
            # Set Cross-Origin-Resource-Policy to cross-origin for media files in production
            response['Cross-Origin-Resource-Policy'] = 'cross-origin'

            # Production CORS for your domain
            allowed_origins = ['https://codingbullz.com', 'https://www.codingbullz.com']
            origin = request.META.get('HTTP_ORIGIN')
            if origin in allowed_origins:
                response['Access-Control-Allow-Origin'] = origin
                response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
                response['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept'
                response['Access-Control-Allow-Credentials'] = 'true'

        # Add debugging headers
        response['X-Media-CORS-Debug'] = f'env={environment},origin={request.META.get("HTTP_ORIGIN", "none")}'

        return response
