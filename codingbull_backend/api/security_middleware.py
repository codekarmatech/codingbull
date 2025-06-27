"""
Enhanced Security Monitoring Middleware
Comprehensive security middleware with database logging, rate limiting, and threat detection
"""

import logging
import time
import hashlib
import re
import json
from datetime import timedelta
from typing import Dict, List, Optional, Tuple, Any

from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponseForbidden, JsonResponse
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.core.cache import cache
from django.contrib.auth.models import User

from .models import (
    SecurityLog, IPAddress, UserAgent, RateLimitRule, 
    BlacklistRule, SecurityAlert, RateLimitTracker
)

logger = logging.getLogger(__name__)


class SecurityAnalyzer:
    """Security analysis engine for threat detection and risk scoring"""
    
    # Suspicious path patterns
    SUSPICIOUS_PATHS = [
        r'/v1/models',           # OpenAI API endpoints
        r'/api/v1/models',
        r'/models',
        r'/openai',
        r'/gpt',
        r'/claude',
        r'/anthropic',
        r'/\.env',               # Environment files
        r'/\.git',               # Git repositories
        r'/wp-admin',            # WordPress admin
        r'/wp-login\.php',
        r'/phpmyadmin',          # Database admin tools
        r'/adminer',
        r'/xmlrpc\.php',         # WordPress XML-RPC
        r'/config\.php',         # Config files
        r'/backup',              # Backup directories
        r'/uploads',
        r'/shell',               # Web shells
        r'/cmd',
        r'/eval',
        r'/api/graphql',         # GraphQL endpoints (if not used)
        r'/graphql',
        r'/\.well-known',        # Well-known URIs (some legitimate, some not)
        r'/robots\.txt',         # Sometimes probed maliciously
        r'/sitemap\.xml',
        r'/favicon\.ico',
    ]
    
    # Legitimate paths for the application
    LEGITIMATE_PATHS = [
        r'^/api/v1/',
        r'^/admin/',
        r'^/static/',
        r'^/media/',
        r'^/$',                  # Root path
        r'^/favicon\.ico$',
        r'^/robots\.txt$',
        r'^/sitemap\.xml$',
    ]
    
    # Known bot user agents (legitimate)
    LEGITIMATE_BOTS = [
        r'googlebot',
        r'bingbot',
        r'slurp',               # Yahoo
        r'duckduckbot',
        r'baiduspider',
        r'yandexbot',
        r'facebookexternalhit',
        r'twitterbot',
        r'linkedinbot',
        r'whatsapp',
        r'telegrambot',
    ]
    
    # Suspicious user agent patterns
    SUSPICIOUS_USER_AGENTS = [
        r'sqlmap',
        r'nikto',
        r'nmap',
        r'masscan',
        r'zap',                 # OWASP ZAP
        r'burp',                # Burp Suite
        r'acunetix',
        r'nessus',
        r'openvas',
        r'w3af',
        r'skipfish',
        r'dirb',
        r'dirbuster',
        r'gobuster',
        r'ffuf',
        r'wfuzz',
        r'hydra',
        r'medusa',
        r'john',                # John the Ripper
        r'hashcat',
        r'metasploit',
        r'exploit',
        r'payload',
        r'shell',
        r'backdoor',
        r'webshell',
        r'<script',             # XSS attempts in UA
        r'javascript:',
        r'eval\(',
        r'base64',
        r'wget',
        r'curl.*-o',            # Suspicious curl usage
        r'python.*requests',    # Automated scripts
        r'bot.*scan',
        r'scan.*bot',
    ]
    
    @classmethod
    def analyze_request(cls, request_info: Dict[str, Any]) -> Tuple[bool, int, List[str]]:
        """
        Analyze request and return (is_suspicious, risk_score, threat_indicators)
        """
        is_suspicious = False
        risk_score = 0
        threat_indicators = []
        
        # Analyze path
        path_suspicious, path_score, path_indicators = cls._analyze_path(request_info['path'])
        if path_suspicious:
            is_suspicious = True
            risk_score += path_score
            threat_indicators.extend(path_indicators)
        
        # Analyze user agent
        ua_suspicious, ua_score, ua_indicators = cls._analyze_user_agent(request_info['user_agent'])
        if ua_suspicious:
            is_suspicious = True
            risk_score += ua_score
            threat_indicators.extend(ua_indicators)
        
        # Analyze request method and content
        method_suspicious, method_score, method_indicators = cls._analyze_method(
            request_info['method'], request_info.get('content_type', '')
        )
        if method_suspicious:
            is_suspicious = True
            risk_score += method_score
            threat_indicators.extend(method_indicators)
        
        # Analyze query parameters
        query_suspicious, query_score, query_indicators = cls._analyze_query_string(
            request_info.get('query_string', '')
        )
        if query_suspicious:
            is_suspicious = True
            risk_score += query_score
            threat_indicators.extend(query_indicators)
        
        # Analyze headers
        header_suspicious, header_score, header_indicators = cls._analyze_headers(request_info)
        if header_suspicious:
            is_suspicious = True
            risk_score += header_score
            threat_indicators.extend(header_indicators)
        
        # Cap risk score at 100
        risk_score = min(risk_score, 100)
        
        return is_suspicious, risk_score, threat_indicators
    
    @classmethod
    def _analyze_path(cls, path: str) -> Tuple[bool, int, List[str]]:
        """Analyze URL path for suspicious patterns"""
        indicators = []
        score = 0
        
        # Check for suspicious paths
        for pattern in cls.SUSPICIOUS_PATHS:
            if re.search(pattern, path, re.IGNORECASE):
                indicators.append(f"Suspicious path pattern: {pattern}")
                score += 25
        
        # Check if path is not in legitimate paths
        is_legitimate = any(re.match(pattern, path, re.IGNORECASE) for pattern in cls.LEGITIMATE_PATHS)
        if not is_legitimate and path != '/':
            indicators.append("Path not in legitimate paths")
            score += 10
        
        # Check for path traversal attempts
        if '../' in path or '..\\' in path:
            indicators.append("Path traversal attempt")
            score += 30
        
        # Check for encoded characters that might be evasion attempts
        if '%' in path and any(encoded in path.lower() for encoded in ['%2e', '%2f', '%5c']):
            indicators.append("URL encoding evasion attempt")
            score += 20
        
        # Check for SQL injection patterns in path
        sql_patterns = [r'union.*select', r'drop.*table', r'insert.*into', r'delete.*from']
        for pattern in sql_patterns:
            if re.search(pattern, path, re.IGNORECASE):
                indicators.append(f"SQL injection pattern in path: {pattern}")
                score += 35
        
        return len(indicators) > 0, score, indicators
    
    @classmethod
    def _analyze_user_agent(cls, user_agent: str) -> Tuple[bool, int, List[str]]:
        """Analyze user agent for suspicious patterns"""
        indicators = []
        score = 0
        
        if not user_agent or user_agent.lower() in ['', 'unknown', '-']:
            indicators.append("Empty or missing user agent")
            score += 15
            return True, score, indicators
        
        # Check for suspicious user agent patterns
        for pattern in cls.SUSPICIOUS_USER_AGENTS:
            if re.search(pattern, user_agent, re.IGNORECASE):
                indicators.append(f"Suspicious user agent pattern: {pattern}")
                score += 30
        
        # Check if it's a legitimate bot
        is_legitimate_bot = any(re.search(pattern, user_agent, re.IGNORECASE) 
                               for pattern in cls.LEGITIMATE_BOTS)
        
        # Check for very short user agents (often bots)
        if len(user_agent) < 10 and not is_legitimate_bot:
            indicators.append("Unusually short user agent")
            score += 10
        
        # Check for script-like user agents
        script_patterns = [r'python', r'perl', r'ruby', r'java', r'go-http', r'libwww']
        for pattern in script_patterns:
            if re.search(pattern, user_agent, re.IGNORECASE) and not is_legitimate_bot:
                indicators.append(f"Script-like user agent: {pattern}")
                score += 15
        
        return len(indicators) > 0, score, indicators
    
    @classmethod
    def _analyze_method(cls, method: str, content_type: str) -> Tuple[bool, int, List[str]]:
        """Analyze HTTP method and content type"""
        indicators = []
        score = 0
        
        # Unusual methods
        if method in ['TRACE', 'CONNECT', 'PATCH']:
            indicators.append(f"Unusual HTTP method: {method}")
            score += 10
        
        # Check for suspicious content types
        suspicious_content_types = [
            'application/x-www-form-urlencoded',  # Sometimes used in attacks
            'text/xml',                           # XXE attacks
            'application/xml',
        ]
        
        if content_type and any(ct in content_type.lower() for ct in suspicious_content_types):
            if method in ['POST', 'PUT', 'PATCH']:
                indicators.append(f"Potentially suspicious content type: {content_type}")
                score += 5
        
        return len(indicators) > 0, score, indicators
    
    @classmethod
    def _analyze_query_string(cls, query_string: str) -> Tuple[bool, int, List[str]]:
        """Analyze query parameters for suspicious patterns"""
        indicators = []
        score = 0
        
        if not query_string:
            return False, 0, []
        
        # Check for SQL injection patterns
        sql_patterns = [
            r'union.*select', r'drop.*table', r'insert.*into', r'delete.*from',
            r'exec.*\(', r'script.*alert', r'javascript:', r'<script',
            r'onload=', r'onerror=', r'onclick='
        ]
        
        for pattern in sql_patterns:
            if re.search(pattern, query_string, re.IGNORECASE):
                indicators.append(f"Injection pattern in query: {pattern}")
                score += 25
        
        # Check for excessive parameter length (potential buffer overflow)
        if len(query_string) > 2000:
            indicators.append("Excessively long query string")
            score += 15
        
        # Check for base64 encoded content (sometimes used to hide payloads)
        if 'base64' in query_string.lower() or len(query_string) > 100:
            # Simple base64 detection
            import base64
            try:
                # Try to decode parts that look like base64
                parts = query_string.split('&')
                for part in parts:
                    if '=' in part:
                        value = part.split('=', 1)[1]
                        if len(value) > 20 and value.replace('+', '').replace('/', '').replace('=', '').isalnum():
                            try:
                                decoded = base64.b64decode(value).decode('utf-8', errors='ignore')
                                if any(pattern in decoded.lower() for pattern in ['script', 'eval', 'exec']):
                                    indicators.append("Suspicious base64 encoded content")
                                    score += 20
                                    break
                            except:
                                pass
            except:
                pass
        
        return len(indicators) > 0, score, indicators
    
    @classmethod
    def _analyze_headers(cls, request_info: Dict[str, Any]) -> Tuple[bool, int, List[str]]:
        """Analyze request headers for suspicious patterns"""
        indicators = []
        score = 0
        
        # Check referer header
        referer = request_info.get('referer', '')
        if referer and referer != 'None':
            # Check for suspicious referer patterns
            suspicious_referer_patterns = [
                r'\.tk$', r'\.ml$', r'\.ga$', r'\.cf$',  # Suspicious TLDs
                r'bit\.ly', r'tinyurl', r'goo\.gl',      # URL shorteners
                r'localhost', r'127\.0\.0\.1',          # Local references
            ]
            
            for pattern in suspicious_referer_patterns:
                if re.search(pattern, referer, re.IGNORECASE):
                    indicators.append(f"Suspicious referer pattern: {pattern}")
                    score += 10
        
        # Check for missing expected headers
        if not request_info.get('host'):
            indicators.append("Missing Host header")
            score += 15
        
        return len(indicators) > 0, score, indicators
    
    @classmethod
    def get_risk_level(cls, risk_score: int) -> str:
        """Convert risk score to risk level"""
        if risk_score >= 70:
            return 'critical'
        elif risk_score >= 40:
            return 'high'
        elif risk_score >= 20:
            return 'medium'
        else:
            return 'low'


class UserAgentParser:
    """Parse and classify user agents"""
    
    @classmethod
    def parse_user_agent(cls, user_agent_string: str) -> Dict[str, Any]:
        """Parse user agent string and return structured data"""
        if not user_agent_string:
            return {
                'browser': None,
                'browser_version': None,
                'os': None,
                'os_version': None,
                'device_type': 'unknown',
                'is_bot': False,
                'is_mobile': False,
            }
        
        ua_lower = user_agent_string.lower()
        
        # Detect bots
        bot_patterns = [
            r'bot', r'crawler', r'spider', r'scraper', r'fetcher',
            r'googlebot', r'bingbot', r'slurp', r'duckduckbot',
            r'facebookexternalhit', r'twitterbot', r'linkedinbot'
        ]
        is_bot = any(re.search(pattern, ua_lower) for pattern in bot_patterns)
        
        # Detect mobile
        mobile_patterns = [r'mobile', r'android', r'iphone', r'ipad', r'tablet']
        is_mobile = any(re.search(pattern, ua_lower) for pattern in mobile_patterns)
        
        # Parse browser
        browser = None
        browser_version = None
        
        browser_patterns = [
            (r'chrome/(\d+)', 'Chrome'),
            (r'firefox/(\d+)', 'Firefox'),
            (r'safari/(\d+)', 'Safari'),
            (r'edge/(\d+)', 'Edge'),
            (r'opera/(\d+)', 'Opera'),
        ]
        
        for pattern, name in browser_patterns:
            match = re.search(pattern, ua_lower)
            if match:
                browser = name
                browser_version = match.group(1)
                break
        
        # Parse OS
        os_name = None
        os_version = None
        
        os_patterns = [
            (r'windows nt (\d+\.\d+)', 'Windows'),
            (r'mac os x (\d+[._]\d+)', 'macOS'),
            (r'linux', 'Linux'),
            (r'android (\d+)', 'Android'),
            (r'ios (\d+)', 'iOS'),
        ]
        
        for pattern, name in os_patterns:
            match = re.search(pattern, ua_lower)
            if match:
                os_name = name
                if len(match.groups()) > 0:
                    os_version = match.group(1).replace('_', '.')
                break
        
        # Determine device type
        device_type = 'unknown'
        if is_bot:
            device_type = 'bot'
        elif 'tablet' in ua_lower or 'ipad' in ua_lower:
            device_type = 'tablet'
        elif is_mobile:
            device_type = 'mobile'
        elif browser:
            device_type = 'desktop'
        
        return {
            'browser': browser,
            'browser_version': browser_version,
            'os': os_name,
            'os_version': os_version,
            'device_type': device_type,
            'is_bot': is_bot,
            'is_mobile': is_mobile,
        }


class RateLimiter:
    """Rate limiting functionality"""
    
    @classmethod
    def check_rate_limit(cls, identifier: str, request_info: Dict[str, Any]) -> Tuple[bool, Optional[RateLimitRule]]:
        """
        Check if request should be rate limited
        Returns (should_block, matched_rule)
        """
        # Get active rate limit rules
        rules = RateLimitRule.objects.filter(is_active=True).order_by('priority')
        
        for rule in rules:
            if rule.matches_path(request_info['path']):
                # Check if this rule applies to this request type
                if not cls._rule_applies_to_request(rule, request_info):
                    continue
                
                # Check rate limit for this rule
                if cls._check_rule_limit(identifier, rule):
                    return True, rule
        
        return False, None
    
    @classmethod
    def _rule_applies_to_request(cls, rule: RateLimitRule, request_info: Dict[str, Any]) -> bool:
        """Check if rule applies to this type of request"""
        if rule.applies_to == 'all':
            return True
        elif rule.applies_to == 'authenticated':
            return request_info.get('user') is not None
        elif rule.applies_to == 'anonymous':
            return request_info.get('user') is None
        elif rule.applies_to == 'ip':
            return True  # IP-based rules always apply
        
        return False
    
    @classmethod
    def _check_rule_limit(cls, identifier: str, rule: RateLimitRule) -> bool:
        """Check if identifier has exceeded rate limit for this rule"""
        now = timezone.now()
        
        # Get or create tracker
        tracker, created = RateLimitTracker.objects.get_or_create(
            identifier=identifier,
            rule=rule,
            defaults={
                'request_count': 0,
                'window_start': now,
                'is_blocked': False,
            }
        )
        
        # Check if currently blocked
        if tracker.is_currently_blocked:
            return True
        
        # Check if we need to reset the window
        window_end = tracker.window_start + timedelta(seconds=rule.time_window)
        if now > window_end:
            # Reset window
            tracker.request_count = 0
            tracker.window_start = now
            tracker.is_blocked = False
            tracker.blocked_until = None
        
        # Increment counter
        tracker.request_count += 1
        tracker.last_request = now
        
        # Check if limit exceeded
        if tracker.request_count > rule.max_requests:
            tracker.is_blocked = True
            tracker.blocked_until = now + timedelta(seconds=rule.block_duration)
            tracker.save()
            return True
        
        tracker.save()
        return False


class EnhancedSecurityMiddleware(MiddlewareMixin):
    """
    Enhanced security middleware with comprehensive monitoring and protection
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        super().__init__(get_response)
    
    def process_request(self, request):
        """Process incoming request with comprehensive security analysis"""
        start_time = time.time()
        
        # Extract request information
        request_info = self._extract_request_info(request)
        
        # Check blacklist rules first
        if self._check_blacklist_rules(request_info):
            self._log_blocked_request(request_info, "Blacklist match")
            return HttpResponseForbidden("Access denied")
        
        # Skip rate limiting for localhost/development requests
        is_rate_limited = False
        rate_rule = None
        identifier = self._get_rate_limit_identifier(request, request_info)
        
        if self._is_localhost_request(request_info):
            # Log that rate limiting is being skipped for localhost
            logger.debug(f"Rate limiting skipped for localhost request from {request_info['remote_addr']}")
        else:
            # Check rate limiting
            is_rate_limited, rate_rule = RateLimiter.check_rate_limit(identifier, request_info)
        
        if is_rate_limited and rate_rule is not None:
            rule_name = rate_rule.name
            block_duration = rate_rule.block_duration
            
            self._log_blocked_request(request_info, f"Rate limit exceeded: {rule_name}")
            self._create_security_alert(
                'rate_limit',
                'warning',
                f"Rate limit exceeded for {identifier}",
                f"Rule: {rule_name}, Path: {request_info['path']}",
                request_info
            )
            return JsonResponse({
                'error': 'Rate limit exceeded',
                'retry_after': block_duration
            }, status=429)
        elif is_rate_limited:
            # Fallback case if rate_rule is None but is_rate_limited is True
            self._log_blocked_request(request_info, "Rate limit exceeded: Unknown rule")
            self._create_security_alert(
                'rate_limit',
                'warning',
                f"Rate limit exceeded for {identifier}",
                f"Path: {request_info['path']}",
                request_info
            )
            return JsonResponse({
                'error': 'Rate limit exceeded',
                'retry_after': 300  # Default 5 minutes
            }, status=429)
        
        # Perform security analysis
        is_suspicious, risk_score, threat_indicators = SecurityAnalyzer.analyze_request(request_info)
        
        # Store analysis results in request for later use
        request._security_analysis = {
            'is_suspicious': is_suspicious,
            'risk_score': risk_score,
            'threat_indicators': threat_indicators,
            'start_time': start_time,
        }
        
        # Block high-risk requests
        if risk_score >= 80:
            self._log_blocked_request(request_info, f"High risk score: {risk_score}")
            self._create_security_alert(
                'high_risk_request',
                'error',
                f"High risk request blocked (Score: {risk_score})",
                f"Path: {request_info['path']}, Indicators: {', '.join(threat_indicators)}",
                request_info
            )
            return HttpResponseForbidden("Access denied")
        
        return None
    
    def process_response(self, request, response):
        """Process response and log security information"""
        # Calculate response time
        analysis = getattr(request, '_security_analysis', {})
        start_time = analysis.get('start_time', time.time())
        response_time = (time.time() - start_time) * 1000  # Convert to milliseconds
        
        # Extract request information
        request_info = self._extract_request_info(request)
        request_info['response_status'] = response.status_code
        request_info['response_time'] = response_time
        
        # Log the request asynchronously
        self._log_security_request(request_info, analysis)
        
        return response
    
    def _extract_request_info(self, request) -> Dict[str, Any]:
        """Extract comprehensive request information"""
        return {
            'timestamp': timezone.now(),
            'method': request.method,
            'path': request.path,
            'query_string': request.META.get('QUERY_STRING', ''),
            'remote_addr': self._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'referer': request.META.get('HTTP_REFERER', ''),
            'host': request.META.get('HTTP_HOST', ''),
            'content_type': request.META.get('CONTENT_TYPE', ''),
            'x_forwarded_for': request.META.get('HTTP_X_FORWARDED_FOR', ''),
            'x_real_ip': request.META.get('HTTP_X_REAL_IP', ''),
            'x_forwarded_proto': request.META.get('HTTP_X_FORWARDED_PROTO', ''),
            'user': request.user if hasattr(request, 'user') and request.user.is_authenticated else None,
            'session_key': request.session.session_key if hasattr(request, 'session') else None,
        }
    
    def _get_client_ip(self, request) -> str:
        """Get the real client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '127.0.0.1')
        return ip
    
    def _is_localhost_request(self, request_info: Dict[str, Any]) -> bool:
        """Check if request is from localhost/development environment"""
        # Get security settings
        security_settings = getattr(settings, 'SECURITY_MIDDLEWARE_SETTINGS', {})
        
        # Check if localhost rate limiting is disabled
        if not security_settings.get('DISABLE_RATE_LIMITING_FOR_LOCALHOST', True):
            return False
        
        remote_addr = request_info['remote_addr']
        
        # Get localhost IPs from settings
        localhost_ips = security_settings.get('LOCALHOST_IPS', ['127.0.0.1', '::1', 'localhost'])
        if remote_addr in localhost_ips:
            return True
            
        # Get local network ranges from settings
        local_ranges = security_settings.get('LOCAL_NETWORK_RANGES', ['192.168.', '10.', '172.'])
        if any(remote_addr.startswith(prefix) for prefix in local_ranges):
            return True
            
        # Check if running in DEBUG mode (if enabled in settings)
        if security_settings.get('RESPECT_DEBUG_MODE', True) and getattr(settings, 'DEBUG', False):
            return True
            
        return False
    
    def _get_rate_limit_identifier(self, request, request_info: Dict[str, Any]) -> str:
        """Get identifier for rate limiting (IP or user)"""
        if request_info['user']:
            return f"user:{request_info['user'].id}"
        else:
            return f"ip:{request_info['remote_addr']}"
    
    def _check_blacklist_rules(self, request_info: Dict[str, Any]) -> bool:
        """Check if request matches any blacklist rules"""
        # Skip blacklist checking for localhost admin access in development
        if self._is_localhost_request(request_info) and request_info['path'].startswith('/admin/'):
            logger.debug(f"Blacklist check skipped for localhost admin access: {request_info['path']}")
            return False
        
        rules = BlacklistRule.objects.filter(is_active=True)
        
        for rule in rules:
            value = None
            
            if rule.rule_type == 'ip':
                value = request_info['remote_addr']
            elif rule.rule_type == 'ip_range':
                value = request_info['remote_addr']
            elif rule.rule_type == 'user_agent':
                value = request_info['user_agent']
            elif rule.rule_type == 'path':
                value = request_info['path']
            elif rule.rule_type == 'referer':
                value = request_info['referer']
            # Note: country checking would require geolocation lookup
            
            if value and rule.matches(value):
                # Additional check: Skip admin path rules for localhost in development
                if (rule.rule_type == 'path' and 
                    self._is_localhost_request(request_info) and 
                    request_info['path'].startswith('/admin/')):
                    logger.debug(f"Admin path blacklist rule skipped for localhost: {rule.pattern}")
                    continue
                
                rule.record_match()
                return True
        
        return False
    
    def _log_security_request(self, request_info: Dict[str, Any], analysis: Dict[str, Any]):
        """Log security request to database (asynchronously)"""
        try:
            # Get or create IP address record
            ip_obj, ip_created = IPAddress.objects.get_or_create(
                ip_address=request_info['remote_addr'],
                defaults={'reputation_score': 50}
            )
            
            # Update IP statistics
            ip_obj.total_requests += 1
            if analysis.get('is_suspicious', False):
                ip_obj.suspicious_requests += 1
            ip_obj.save(update_fields=['total_requests', 'suspicious_requests', 'last_seen'])
            
            # Get or create user agent record
            user_agent_string = request_info['user_agent']
            if user_agent_string:
                ua_hash = hashlib.sha256(user_agent_string.encode('utf-8')).hexdigest()
                ua_obj, ua_created = UserAgent.objects.get_or_create(
                    user_agent_hash=ua_hash,
                    defaults={
                        'user_agent_string': user_agent_string,
                        **UserAgentParser.parse_user_agent(user_agent_string)
                    }
                )
                
                # Update user agent statistics
                ua_obj.request_count += 1
                ua_obj.save(update_fields=['request_count', 'last_seen'])
            else:
                # Create a default user agent for empty strings
                ua_obj, ua_created = UserAgent.objects.get_or_create(
                    user_agent_hash='empty',
                    defaults={
                        'user_agent_string': '',
                        'device_type': 'unknown',
                        'is_bot': False,
                        'is_mobile': False,
                    }
                )
            
            # Create security log entry
            risk_score = analysis.get('risk_score', 0)
            SecurityLog.objects.create(
                ip_address=ip_obj,
                user_agent=ua_obj,
                method=request_info['method'],
                path=request_info['path'],
                query_string=request_info['query_string'],
                referer=request_info['referer'],
                host=request_info['host'],
                content_type=request_info['content_type'],
                is_suspicious=analysis.get('is_suspicious', False),
                risk_level=SecurityAnalyzer.get_risk_level(risk_score),
                risk_score=risk_score,
                user=request_info['user'],
                session_key=request_info['session_key'],
                response_status=request_info.get('response_status'),
                response_time=request_info.get('response_time'),
                blocked=False,
                x_forwarded_for=request_info['x_forwarded_for'],
                x_real_ip=request_info['x_real_ip'],
                x_forwarded_proto=request_info['x_forwarded_proto'],
                threat_indicators=analysis.get('threat_indicators', []),
            )
            
            # Update IP reputation if needed
            if analysis.get('is_suspicious', False):
                ip_obj.update_reputation()
            
            # Create alerts for high-risk requests
            if risk_score >= 60:
                self._create_security_alert(
                    'suspicious_activity',
                    'warning' if risk_score < 80 else 'error',
                    f"Suspicious activity detected (Score: {risk_score})",
                    f"Path: {request_info['path']}, IP: {request_info['remote_addr']}",
                    request_info
                )
        
        except Exception as e:
            logger.error(f"Error logging security request: {e}")
    
    def _log_blocked_request(self, request_info: Dict[str, Any], reason: str):
        """Log blocked request"""
        try:
            # Get or create IP address record
            ip_obj, _ = IPAddress.objects.get_or_create(
                ip_address=request_info['remote_addr'],
                defaults={'reputation_score': 50}
            )
            
            # Update blocked requests counter
            ip_obj.blocked_requests += 1
            ip_obj.total_requests += 1
            ip_obj.suspicious_requests += 1
            ip_obj.save(update_fields=['blocked_requests', 'total_requests', 'suspicious_requests', 'last_seen'])
            
            # Update reputation
            ip_obj.update_reputation()
            
            logger.warning(f"BLOCKED REQUEST: {reason} - {request_info['method']} {request_info['path']} from {request_info['remote_addr']}")
        
        except Exception as e:
            logger.error(f"Error logging blocked request: {e}")
    
    def _create_security_alert(self, alert_type: str, severity: str, title: str, description: str, request_info: Dict[str, Any]):
        """Create security alert"""
        try:
            ip_obj = IPAddress.objects.filter(ip_address=request_info['remote_addr']).first()
            
            SecurityAlert.objects.create(
                alert_type=alert_type,
                severity=severity,
                title=title,
                description=description,
                ip_address=ip_obj,
                additional_data={
                    'path': request_info['path'],
                    'method': request_info['method'],
                    'user_agent': request_info['user_agent'],
                    'referer': request_info['referer'],
                }
            )
        
        except Exception as e:
            logger.error(f"Error creating security alert: {e}")