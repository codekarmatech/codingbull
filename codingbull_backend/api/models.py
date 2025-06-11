from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import ipaddress
import re

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    content = models.TextField()
    excerpt = models.TextField(max_length=300, blank=True)
    author = models.CharField(max_length=100)
    published_date = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='blog_posts')
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    tags = models.JSONField(default=list, blank=True, null=True)

    def __str__(self):
        return self.title

class Project(models.Model):
    title = models.CharField(max_length=200)
    client_name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    description = models.TextField()
    challenge = models.TextField()
    solution = models.TextField()
    outcome = models.TextField()
    tech_used = models.JSONField()
    stats = models.JSONField()
    client_logo = models.ImageField(upload_to='project_logos/', blank=True, null=True)
    project_image = models.ImageField(upload_to='project_images/', blank=True, null=True)
    testimonial_quote = models.TextField(blank=True)
    testimonial_author = models.CharField(max_length=100, blank=True)
    author_title = models.CharField(max_length=100, blank=True)
    author_company = models.CharField(max_length=100, blank=True)
    def __str__(self):
        return self.title

class Service(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    summary = models.CharField(max_length=300)
    description = models.TextField()
    long_description = models.TextField(blank=True, help_text="Detailed description for service page")
    icon = models.ImageField(upload_to='service_icons/', blank=True, null=True)
    icon_emoji = models.CharField(max_length=10, blank=True, help_text="Emoji icon for the service")
    image_url = models.URLField(blank=True, help_text="Hero image URL for service page")
    features = models.JSONField(default=list, blank=True, help_text="Simple list of feature strings for services listing page")
    detailed_features = models.JSONField(default=list, blank=True, help_text="Detailed features with icon, title, description for service detail page")
    process_steps = models.JSONField(default=list, blank=True, help_text="Process steps for the service")
    technologies = models.JSONField(default=list, blank=True, help_text="Technologies used for this service")
    faqs = models.JSONField(default=list, blank=True, help_text="Frequently asked questions")
    related_services = models.JSONField(default=list, blank=True, help_text="Related services slugs")

    def __str__(self):
        return self.name

class ContactInquiry(models.Model):
    INQUIRY_TYPE_CHOICES = [
        ('general', 'General Inquiry'),
        ('newsletter', 'Newsletter Subscription'),
    ]
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    inquiry_type = models.CharField(max_length=20, choices=INQUIRY_TYPE_CHOICES, default='general')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subject} - {self.email}"

class Testimonial(models.Model):
    quote = models.TextField()
    author = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    image = models.ImageField(upload_to='project_logos/', blank=True, null=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='testimonials')

    def __str__(self):
        return f"{self.author} - {self.company}"


# ============================================================================
# SECURITY MONITORING MODELS
# ============================================================================

class IPAddress(models.Model):
    """Model to track IP addresses and their reputation"""
    
    ip_address = models.GenericIPAddressField(unique=True, db_index=True)
    is_blacklisted = models.BooleanField(default=False, db_index=True)
    is_whitelisted = models.BooleanField(default=False, db_index=True)
    
    # Geolocation data
    country = models.CharField(max_length=100, blank=True, null=True)
    country_code = models.CharField(max_length=2, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    organization = models.CharField(max_length=200, blank=True, null=True)
    isp = models.CharField(max_length=200, blank=True, null=True)
    
    # Tracking data
    first_seen = models.DateTimeField(auto_now_add=True, db_index=True)
    last_seen = models.DateTimeField(auto_now=True, db_index=True)
    total_requests = models.PositiveIntegerField(default=0)
    suspicious_requests = models.PositiveIntegerField(default=0)
    blocked_requests = models.PositiveIntegerField(default=0)
    
    # Reputation scoring (0-100, where 0 is most suspicious)
    reputation_score = models.PositiveIntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # Admin notes
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        verbose_name = "IP Address"
        verbose_name_plural = "IP Addresses"
        ordering = ['-last_seen']
        indexes = [
            models.Index(fields=['reputation_score']),
            models.Index(fields=['total_requests']),
            models.Index(fields=['suspicious_requests']),
        ]
    
    def __str__(self):
        return f"{self.ip_address} (Score: {self.reputation_score})"
    
    @property
    def is_ipv6(self):
        """Check if IP is IPv6"""
        try:
            return ipaddress.ip_address(self.ip_address).version == 6
        except ValueError:
            return False
    
    @property
    def suspicious_ratio(self):
        """Calculate ratio of suspicious to total requests"""
        if self.total_requests == 0:
            return 0
        return (self.suspicious_requests / self.total_requests) * 100
    
    def update_reputation(self):
        """Update reputation score based on activity"""
        base_score = 50
        
        # Reduce score for high suspicious ratio
        if self.suspicious_ratio > 50:
            base_score -= 30
        elif self.suspicious_ratio > 25:
            base_score -= 15
        elif self.suspicious_ratio > 10:
            base_score -= 5
        
        # Reduce score for high request volume (potential bot)
        if self.total_requests > 10000:
            base_score -= 20
        elif self.total_requests > 1000:
            base_score -= 10
        
        # Manual overrides
        if self.is_whitelisted:
            base_score = 100
        elif self.is_blacklisted:
            base_score = 0
        
        self.reputation_score = max(0, min(100, base_score))
        self.save(update_fields=['reputation_score'])


class UserAgent(models.Model):
    """Model to track and analyze user agents"""
    
    DEVICE_TYPES = [
        ('desktop', 'Desktop'),
        ('mobile', 'Mobile'),
        ('tablet', 'Tablet'),
        ('bot', 'Bot'),
        ('unknown', 'Unknown'),
    ]
    
    user_agent_string = models.TextField(unique=True, db_index=True)
    user_agent_hash = models.CharField(max_length=64, unique=True, db_index=True)
    
    # Parsed information
    browser = models.CharField(max_length=100, blank=True, null=True)
    browser_version = models.CharField(max_length=50, blank=True, null=True)
    os = models.CharField(max_length=100, blank=True, null=True)
    os_version = models.CharField(max_length=50, blank=True, null=True)
    device_type = models.CharField(max_length=20, choices=DEVICE_TYPES, default='unknown')
    
    # Classification flags
    is_bot = models.BooleanField(default=False, db_index=True)
    is_suspicious = models.BooleanField(default=False, db_index=True)
    is_mobile = models.BooleanField(default=False)
    
    # Tracking data
    first_seen = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(auto_now=True)
    request_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        verbose_name = "User Agent"
        verbose_name_plural = "User Agents"
        ordering = ['-last_seen']
        indexes = [
            models.Index(fields=['device_type']),
            models.Index(fields=['request_count']),
        ]
    
    def __str__(self):
        return f"{self.browser or 'Unknown'} - {self.os or 'Unknown'} ({self.request_count} requests)"
    
    def save(self, *args, **kwargs):
        if not self.user_agent_hash:
            import hashlib
            self.user_agent_hash = hashlib.sha256(
                self.user_agent_string.encode('utf-8')
            ).hexdigest()
        super().save(*args, **kwargs)


class SecurityLog(models.Model):
    """Comprehensive security logging model"""
    
    RISK_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    HTTP_METHODS = [
        ('GET', 'GET'),
        ('POST', 'POST'),
        ('PUT', 'PUT'),
        ('PATCH', 'PATCH'),
        ('DELETE', 'DELETE'),
        ('HEAD', 'HEAD'),
        ('OPTIONS', 'OPTIONS'),
        ('TRACE', 'TRACE'),
    ]
    
    # Request identification
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    ip_address = models.ForeignKey(IPAddress, on_delete=models.CASCADE, related_name='security_logs')
    user_agent = models.ForeignKey(UserAgent, on_delete=models.CASCADE, related_name='security_logs')
    
    # Request details
    method = models.CharField(max_length=10, choices=HTTP_METHODS, db_index=True)
    path = models.TextField(db_index=True)
    query_string = models.TextField(blank=True, null=True)
    referer = models.TextField(blank=True, null=True)
    host = models.CharField(max_length=255, blank=True, null=True)
    content_type = models.CharField(max_length=100, blank=True, null=True)
    
    # Security analysis
    is_suspicious = models.BooleanField(default=False, db_index=True)
    risk_level = models.CharField(max_length=10, choices=RISK_LEVELS, default='low', db_index=True)
    risk_score = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # User context
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    session_key = models.CharField(max_length=40, blank=True, null=True)
    
    # Response details
    response_status = models.PositiveIntegerField(null=True, blank=True)
    response_time = models.FloatField(null=True, blank=True, help_text="Response time in milliseconds")
    blocked = models.BooleanField(default=False, db_index=True)
    
    # Additional headers and metadata
    x_forwarded_for = models.TextField(blank=True, null=True)
    x_real_ip = models.GenericIPAddressField(blank=True, null=True)
    x_forwarded_proto = models.CharField(max_length=10, blank=True, null=True)
    
    # Analysis flags
    matched_rules = models.JSONField(default=list, blank=True)
    threat_indicators = models.JSONField(default=list, blank=True)
    
    class Meta:
        verbose_name = "Security Log"
        verbose_name_plural = "Security Logs"
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['timestamp', 'is_suspicious']),
            models.Index(fields=['risk_level', 'timestamp']),
            models.Index(fields=['blocked', 'timestamp']),
            models.Index(fields=['path']),
        ]
    
    def get_risk_level_display(self) -> str:
        """Get the human-readable display value for risk_level"""
        return dict(self.RISK_LEVELS).get(self.risk_level, self.risk_level)
    
    def __str__(self):
        return f"{self.method} {self.path} - {self.ip_address.ip_address} ({self.get_risk_level_display()})"
    
    @property
    def is_authenticated_request(self):
        """Check if request was from authenticated user"""
        return self.user is not None


class RateLimitRule(models.Model):
    """Rate limiting rules configuration"""
    
    APPLIES_TO_CHOICES = [
        ('all', 'All Users'),
        ('authenticated', 'Authenticated Users'),
        ('anonymous', 'Anonymous Users'),
        ('ip', 'Per IP Address'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    
    # Rule configuration
    path_pattern = models.CharField(
        max_length=500,
        help_text="Regex pattern for URL paths (e.g., ^/api/v1/.*)"
    )
    max_requests = models.PositiveIntegerField(help_text="Maximum requests allowed")
    time_window = models.PositiveIntegerField(help_text="Time window in seconds")
    block_duration = models.PositiveIntegerField(
        default=300,
        help_text="Block duration in seconds after limit exceeded"
    )
    
    # Rule scope
    applies_to = models.CharField(max_length=20, choices=APPLIES_TO_CHOICES, default='all')
    
    # Rule status
    is_active = models.BooleanField(default=True, db_index=True)
    priority = models.PositiveIntegerField(default=100, help_text="Lower numbers = higher priority")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        verbose_name = "Rate Limit Rule"
        verbose_name_plural = "Rate Limit Rules"
        ordering = ['priority', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.max_requests}/{self.time_window}s)"
    
    def matches_path(self, path):
        """Check if this rule applies to the given path"""
        try:
            return bool(re.match(self.path_pattern, path))
        except re.error:
            return False


class BlacklistRule(models.Model):
    """Blacklist rules for blocking requests"""
    
    RULE_TYPES = [
        ('ip', 'IP Address'),
        ('ip_range', 'IP Range'),
        ('user_agent', 'User Agent'),
        ('path', 'URL Path'),
        ('country', 'Country'),
        ('referer', 'Referer'),
    ]
    
    rule_type = models.CharField(max_length=20, choices=RULE_TYPES, db_index=True)
    pattern = models.TextField(help_text="Pattern to match (supports regex for some types)")
    reason = models.CharField(max_length=200)
    
    # Rule status
    is_active = models.BooleanField(default=True, db_index=True)
    expires_at = models.DateTimeField(null=True, blank=True, help_text="Optional expiration time")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Statistics
    match_count = models.PositiveIntegerField(default=0)
    last_matched = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Blacklist Rule"
        verbose_name_plural = "Blacklist Rules"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['rule_type', 'is_active']),
            models.Index(fields=['expires_at']),
        ]
    
    def get_rule_type_display(self) -> str:
        """Get the human-readable display value for rule_type"""
        return dict(self.RULE_TYPES).get(self.rule_type, self.rule_type)
    
    def __str__(self):
        return f"{self.get_rule_type_display()}: {self.pattern[:50]}"
    
    @property
    def is_expired(self):
        """Check if rule has expired"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    def matches(self, value):
        """Check if the given value matches this rule"""
        if not self.is_active or self.is_expired:
            return False
        
        try:
            if self.rule_type in ['user_agent', 'path', 'referer']:
                return bool(re.search(self.pattern, value, re.IGNORECASE))
            elif self.rule_type == 'ip':
                return value == self.pattern
            elif self.rule_type == 'ip_range':
                try:
                    network = ipaddress.ip_network(self.pattern, strict=False)
                    return ipaddress.ip_address(value) in network
                except ValueError:
                    return False
            elif self.rule_type == 'country':
                return value.upper() == self.pattern.upper()
            else:
                return value == self.pattern
        except (re.error, ValueError):
            return False
    
    def record_match(self):
        """Record that this rule was matched"""
        self.match_count += 1
        self.last_matched = timezone.now()
        self.save(update_fields=['match_count', 'last_matched'])


class SecurityAlert(models.Model):
    """Security alerts for monitoring critical events"""
    
    ALERT_TYPES = [
        ('rate_limit', 'Rate Limit Exceeded'),
        ('suspicious_activity', 'Suspicious Activity'),
        ('blacklist_match', 'Blacklist Match'),
        ('high_risk_request', 'High Risk Request'),
        ('attack_pattern', 'Attack Pattern Detected'),
        ('system_error', 'System Error'),
    ]
    
    SEVERITY_LEVELS = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('critical', 'Critical'),
    ]
    
    alert_type = models.CharField(max_length=30, choices=ALERT_TYPES, db_index=True)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS, default='warning', db_index=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Related objects
    security_log = models.ForeignKey(SecurityLog, on_delete=models.CASCADE, null=True, blank=True)
    ip_address = models.ForeignKey(IPAddress, on_delete=models.CASCADE, null=True, blank=True)
    
    # Alert status
    is_acknowledged = models.BooleanField(default=False, db_index=True)
    acknowledged_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    additional_data = models.JSONField(default=dict, blank=True)
    
    class Meta:
        verbose_name = "Security Alert"
        verbose_name_plural = "Security Alerts"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['severity', 'is_acknowledged']),
            models.Index(fields=['alert_type', 'created_at']),
        ]
    
    def get_severity_display(self) -> str:
        """Get the human-readable display value for severity"""
        return dict(self.SEVERITY_LEVELS).get(self.severity, self.severity)
    
    def __str__(self):
        return f"{self.get_severity_display()}: {self.title}"
    
    def acknowledge(self, user):
        """Mark alert as acknowledged"""
        self.is_acknowledged = True
        self.acknowledged_by = user
        self.acknowledged_at = timezone.now()
        self.save(update_fields=['is_acknowledged', 'acknowledged_by', 'acknowledged_at'])


class RateLimitTracker(models.Model):
    """Track rate limiting counters"""
    
    identifier = models.CharField(max_length=255, db_index=True)  # IP or user ID
    rule = models.ForeignKey(RateLimitRule, on_delete=models.CASCADE)
    request_count = models.PositiveIntegerField(default=0)
    window_start = models.DateTimeField(auto_now_add=True)
    last_request = models.DateTimeField(auto_now=True)
    is_blocked = models.BooleanField(default=False)
    blocked_until = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = "Rate Limit Tracker"
        verbose_name_plural = "Rate Limit Trackers"
        unique_together = ['identifier', 'rule']
        indexes = [
            models.Index(fields=['identifier', 'is_blocked']),
            models.Index(fields=['blocked_until']),
        ]
    
    def __str__(self):
        return f"{self.identifier} - {self.rule.name} ({self.request_count}/{self.rule.max_requests})"
    
    @property
    def is_currently_blocked(self):
        """Check if currently blocked"""
        if not self.is_blocked:
            return False
        if self.blocked_until and timezone.now() > self.blocked_until:
            # Block has expired, reset
            self.is_blocked = False
            self.blocked_until = None
            self.save(update_fields=['is_blocked', 'blocked_until'])
            return False
        return True


# Custom Error Tracking Models
class ErrorLog(models.Model):
    """Frontend error tracking model"""
    
    ERROR_TYPES = [
        ('javascript', 'JavaScript Error'),
        ('api', 'API Error'),
        ('network', 'Network Error'),
        ('render', 'Render Error'),
        ('performance', 'Performance Issue'),
    ]
    
    SEVERITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    # Basic info
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    error_type = models.CharField(max_length=20, choices=ERROR_TYPES, db_index=True)
    severity = models.CharField(max_length=10, choices=SEVERITY_LEVELS, default='medium', db_index=True)
    
    # Error details
    message = models.TextField()
    stack_trace = models.TextField(blank=True, null=True)
    component_stack = models.TextField(blank=True, null=True)
    
    # Context
    url = models.URLField(max_length=500)
    user_agent = models.TextField()
    browser_info = models.JSONField(default=dict, blank=True)  # Browser, OS, device info
    
    # User context
    user_id = models.CharField(max_length=100, blank=True, null=True)  # Anonymous ID
    session_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Performance data
    page_load_time = models.PositiveIntegerField(null=True, blank=True)  # milliseconds
    memory_usage = models.PositiveIntegerField(null=True, blank=True)  # MB
    
    # Breadcrumbs (user actions leading to error)
    breadcrumbs = models.JSONField(default=list, blank=True)
    
    # Additional context
    extra_data = models.JSONField(default=dict, blank=True)
    
    # Tracking
    count = models.PositiveIntegerField(default=1)  # How many times this error occurred
    first_seen = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(auto_now=True)
    
    # Status
    is_resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['error_type', 'severity']),
            models.Index(fields=['url', 'timestamp']),
            models.Index(fields=['is_resolved', 'severity']),
        ]
    
    def __str__(self):
        return f"{self.error_type}: {self.message[:50]}..."


class PerformanceLog(models.Model):
    """Performance monitoring model"""
    
    METRIC_TYPES = [
        ('page_load', 'Page Load'),
        ('api_call', 'API Call'),
        ('component_render', 'Component Render'),
        ('user_interaction', 'User Interaction'),
    ]
    
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    metric_type = models.CharField(max_length=20, choices=METRIC_TYPES, db_index=True)
    
    # Performance metrics
    duration = models.PositiveIntegerField()  # milliseconds
    url = models.URLField(max_length=500)
    
    # Context
    user_agent = models.TextField()
    user_id = models.CharField(max_length=100, blank=True, null=True)
    session_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Additional metrics
    metrics = models.JSONField(default=dict, blank=True)  # Custom metrics
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['metric_type', 'timestamp']),
            models.Index(fields=['url', 'timestamp']),
        ]


class UserSession(models.Model):
    """Track user sessions for impact analysis"""
    
    session_id = models.CharField(max_length=100, unique=True, db_index=True)
    user_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Session info
    start_time = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    duration = models.PositiveIntegerField(default=0)  # seconds
    
    # Browser/Device info
    user_agent = models.TextField()
    browser_info = models.JSONField(default=dict, blank=True)
    
    # Activity tracking
    page_views = models.PositiveIntegerField(default=0)
    errors_encountered = models.PositiveIntegerField(default=0)
    
    # Geographic info (optional)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        ordering = ['-start_time']
