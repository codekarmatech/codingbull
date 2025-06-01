import logging
import time
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponseForbidden
from django.conf import settings

logger = logging.getLogger(__name__)

class SecurityLoggingMiddleware(MiddlewareMixin):
    """
    Production-ready security middleware to monitor and log suspicious requests
    """
    
    # Known legitimate paths for your application
    LEGITIMATE_PATHS = [
        '/api/v1/',
        '/admin/',
        '/static/',
        '/media/',
        '/favicon.ico',
        '/robots.txt',
        '/sitemap.xml',
    ]
    
    # Suspicious paths that indicate potential attacks or misconfigurations
    SUSPICIOUS_PATHS = [
        '/v1/models',           # OpenAI API endpoints
        '/api/v1/models',
        '/models',
        '/openai',
        '/gpt',
        '/claude',
        '/anthropic',
        '/.env',                # Environment files
        '/.git',                # Git repositories
        '/wp-admin',            # WordPress admin
        '/wp-login.php',
        '/phpmyadmin',          # Database admin tools
        '/adminer',
        '/xmlrpc.php',          # WordPress XML-RPC
        '/config.php',          # Config files
        '/backup',              # Backup directories
        '/uploads',
        '/shell',               # Web shells
        '/cmd',
        '/eval',
        '/api/graphql',         # GraphQL endpoints (if not used)
        '/graphql',
    ]
    
    # Known legitimate user agents (add your frontend, mobile apps, etc.)
    LEGITIMATE_USER_AGENTS = [
        'Mozilla/',             # Browsers
        'Chrome/',
        'Safari/',
        'Firefox/',
        'Edge/',
        'axios/',               # Your frontend API calls
        'fetch/',
        'node-fetch/',
        'python-requests/',     # If you have Python scripts
        'curl/',                # Development/testing
        'Postman',              # API testing
    ]
    
    def process_request(self, request):
        """Process incoming requests and log suspicious activity"""
        
        # Get request information
        request_info = self._get_request_info(request)
        
        # Check for suspicious activity
        is_suspicious = self._is_suspicious_request(request, request_info)
        
        if is_suspicious:
            # Log the suspicious request
            self._log_suspicious_request(request_info)
            
            # In production, you might want to block certain requests
            if self._should_block_request(request):
                logger.warning(f"BLOCKED suspicious request: {request_info['path']} from {request_info['remote_addr']}")
                return HttpResponseForbidden("Access denied")
        
        # Log all requests in debug mode
        if settings.DEBUG:
            self._log_request(request_info, is_suspicious)
        
        return None
    
    def _get_request_info(self, request):
        """Extract detailed request information"""
        return {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'method': request.method,
            'path': request.path,
            'remote_addr': self._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', 'Unknown'),
            'referer': request.META.get('HTTP_REFERER', 'None'),
            'host': request.META.get('HTTP_HOST', 'Unknown'),
            'x_forwarded_for': request.META.get('HTTP_X_FORWARDED_FOR', 'None'),
            'x_real_ip': request.META.get('HTTP_X_REAL_IP', 'None'),
            'content_type': request.META.get('CONTENT_TYPE', 'None'),
            'query_string': request.META.get('QUERY_STRING', ''),
        }
    
    def _is_suspicious_request(self, request, request_info):
        """Determine if a request is suspicious"""
        
        # Check for suspicious paths
        if any(suspicious_path in request_info['path'].lower() 
               for suspicious_path in self.SUSPICIOUS_PATHS):
            return True
        
        # Check for unknown user agents (potential bots/scrapers)
        user_agent = request_info['user_agent'].lower()
        if not any(legitimate_ua.lower() in user_agent 
                  for legitimate_ua in self.LEGITIMATE_USER_AGENTS):
            # Only flag as suspicious if it's not accessing legitimate paths
            if not any(legit_path in request_info['path'] 
                      for legit_path in self.LEGITIMATE_PATHS):
                return True
        
        # Check for requests to non-existent endpoints that might be probing
        if (request_info['path'] not in ['/'] and 
            not any(legit_path in request_info['path'] 
                   for legit_path in self.LEGITIMATE_PATHS)):
            return True
        
        return False
    
    def _should_block_request(self, request):
        """Determine if a request should be blocked"""
        # Block requests to sensitive paths
        dangerous_paths = [
            '/.env',
            '/.git',
            '/config.php',
            '/wp-admin',
            '/phpmyadmin',
            '/shell',
            '/cmd',
            '/eval',
        ]
        
        return any(dangerous_path in request.path.lower() 
                  for dangerous_path in dangerous_paths)
    
    def _log_suspicious_request(self, request_info):
        """Log suspicious requests with detailed information"""
        print(f"🚨 SUSPICIOUS REQUEST DETECTED:")
        print(f"   Time: {request_info['timestamp']}")
        print(f"   Method: {request_info['method']}")
        print(f"   Path: {request_info['path']}")
        print(f"   IP: {request_info['remote_addr']}")
        print(f"   User-Agent: {request_info['user_agent']}")
        print(f"   Referer: {request_info['referer']}")
        print(f"   Host: {request_info['host']}")
        print(f"   X-Forwarded-For: {request_info['x_forwarded_for']}")
        print(f"   Content-Type: {request_info['content_type']}")
        if request_info['query_string']:
            print(f"   Query: {request_info['query_string']}")
        print("=" * 80)
        
        # Also log to Django logger for production
        logger.warning(
            f"Suspicious request: {request_info['method']} {request_info['path']} "
            f"from {request_info['remote_addr']} "
            f"User-Agent: {request_info['user_agent']}"
        )
    
    def _log_request(self, request_info, is_suspicious):
        """Log all requests in debug mode"""
        status = "SUSPICIOUS" if is_suspicious else "NORMAL"
        print(f"[{status}] {request_info['method']} {request_info['path']} - {request_info['remote_addr']}")
    
    def _get_client_ip(self, request):
        """Get the real client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip