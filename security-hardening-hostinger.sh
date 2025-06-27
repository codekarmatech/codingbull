#!/bin/bash
# CodingBull Enterprise Security Hardening Script for Hostinger VPS
# Replaces external security dependencies with native Ubuntu security measures
# Enterprise-grade security configuration for production deployment

set -e
set -u
set -o pipefail

echo "🔒 CodingBull Enterprise Security Hardening for Hostinger VPS"
echo "=============================================================="
echo "🛡️  Implementing enterprise-grade security measures"
echo "📅 Security hardening date: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Security logging
SECURITY_LOG="/var/log/codingbull-security.log"

# Enhanced logging functions
print_security() {
    echo -e "${PURPLE}[SECURITY]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - SECURITY: $1" >> $SECURITY_LOG
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - SUCCESS: $1" >> $SECURITY_LOG
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - WARNING: $1" >> $SECURITY_LOG
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ERROR: $1" >> $SECURITY_LOG
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This security hardening script must be run as root"
        exit 1
    fi
}

# Create security log directory
setup_security_logging() {
    print_security "Setting up enterprise security logging..."
    
    mkdir -p /var/log/codingbull
    touch $SECURITY_LOG
    chmod 640 $SECURITY_LOG
    chown root:adm $SECURITY_LOG
    
    print_success "Security logging configured"
}

# Update system packages
update_system() {
    print_security "Updating system packages for security patches..."
    
    apt update
    apt upgrade -y
    apt autoremove -y
    apt autoclean
    
    print_success "System packages updated"
}

# Configure UFW firewall
configure_firewall() {
    print_security "Configuring enterprise firewall with UFW..."
    
    # Install UFW if not present
    apt install -y ufw
    
    # Reset UFW to defaults
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (be careful with this)
    ufw allow ssh
    
    # Allow HTTP and HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Allow specific ports for our application
    ufw allow 8000/tcp comment 'Django development'
    
    # Rate limiting for SSH
    ufw limit ssh comment 'Rate limit SSH connections'
    
    # Enable UFW
    ufw --force enable
    
    print_success "Enterprise firewall configured"
}

# Install and configure Fail2Ban
configure_fail2ban() {
    print_security "Installing and configuring Fail2Ban for intrusion prevention..."
    
    apt install -y fail2ban
    
    # Create custom jail configuration
    cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
# Ban time: 1 hour
bantime = 3600
# Find time: 10 minutes
findtime = 600
# Max retry: 3 attempts
maxretry = 3
# Backend
backend = auto

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
bantime = 3600

[django-auth]
enabled = true
filter = django-auth
port = http,https
logpath = /home/codingbull/codingbull/logs/django.log
maxretry = 3
bantime = 3600
EOF

    # Create Django authentication filter
    cat > /etc/fail2ban/filter.d/django-auth.conf << EOF
[Definition]
failregex = ^.*\[.*\] WARNING.*Invalid login attempt.*from <HOST>.*$
            ^.*\[.*\] WARNING.*Authentication failed.*from <HOST>.*$
ignoreregex =
EOF

    # Restart and enable Fail2Ban
    systemctl restart fail2ban
    systemctl enable fail2ban
    
    print_success "Fail2Ban configured for intrusion prevention"
}

# Configure automatic security updates
configure_auto_updates() {
    print_security "Configuring automatic security updates..."
    
    apt install -y unattended-upgrades apt-listchanges
    
    # Configure unattended upgrades
    cat > /etc/apt/apt.conf.d/50unattended-upgrades << EOF
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}-security";
    "\${distro_id}ESMApps:\${distro_codename}-apps-security";
    "\${distro_id}ESM:\${distro_codename}-infra-security";
};

Unattended-Upgrade::Package-Blacklist {
};

Unattended-Upgrade::DevRelease "false";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Automatic-Reboot-Time "02:00";
EOF

    # Enable automatic updates
    cat > /etc/apt/apt.conf.d/20auto-upgrades << EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF

    print_success "Automatic security updates configured"
}

# Secure shared memory
secure_shared_memory() {
    print_security "Securing shared memory..."
    
    # Add to fstab if not already present
    if ! grep -q "tmpfs /run/shm tmpfs defaults,noexec,nosuid 0 0" /etc/fstab; then
        echo "tmpfs /run/shm tmpfs defaults,noexec,nosuid 0 0" >> /etc/fstab
    fi
    
    print_success "Shared memory secured"
}

# Configure log rotation
configure_log_rotation() {
    print_security "Configuring enterprise log rotation..."
    
    # CodingBull application logs
    cat > /etc/logrotate.d/codingbull << EOF
/home/codingbull/codingbull/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 codingbull codingbull
    postrotate
        systemctl reload codingbull-gunicorn
    endscript
}

/var/log/codingbull-*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 640 root adm
}
EOF

    print_success "Log rotation configured"
}

# Set secure file permissions
set_secure_permissions() {
    print_security "Setting secure file permissions..."
    
    # Application directory permissions
    chown -R codingbull:codingbull /home/codingbull/codingbull
    chmod -R 755 /home/codingbull/codingbull
    
    # Secure environment files
    chmod 600 /home/codingbull/codingbull/codingbull_backend/.env*
    
    # Secure log directory
    mkdir -p /home/codingbull/codingbull/logs
    chown codingbull:codingbull /home/codingbull/codingbull/logs
    chmod 755 /home/codingbull/codingbull/logs
    
    print_success "Secure file permissions set"
}

# Main security hardening process
main() {
    print_security "Starting enterprise security hardening for Hostinger VPS..."
    
    check_root
    setup_security_logging
    update_system
    configure_firewall
    configure_fail2ban
    configure_auto_updates
    secure_shared_memory
    configure_log_rotation
    set_secure_permissions
    
    echo ""
    print_success "🎉 Enterprise security hardening completed!"
    print_security "Security measures implemented:"
    echo "  ✅ UFW firewall configured with rate limiting"
    echo "  ✅ Fail2Ban intrusion prevention active"
    echo "  ✅ Automatic security updates enabled"
    echo "  ✅ Shared memory secured"
    echo "  ✅ Log rotation configured"
    echo "  ✅ Secure file permissions set"
    echo ""
    print_status "Security status commands:"
    echo "  • Check firewall: sudo ufw status verbose"
    echo "  • Check Fail2Ban: sudo fail2ban-client status"
    echo "  • View security log: sudo tail -f $SECURITY_LOG"
    echo "  • Check banned IPs: sudo fail2ban-client status sshd"
    echo ""
    print_security "Enterprise security hardening completed successfully"
}

# Handle command line arguments
case "${1:-main}" in
    "firewall")
        check_root
        setup_security_logging
        configure_firewall
        ;;
    "fail2ban")
        check_root
        setup_security_logging
        configure_fail2ban
        ;;
    "updates")
        check_root
        setup_security_logging
        configure_auto_updates
        ;;
    "permissions")
        check_root
        setup_security_logging
        set_secure_permissions
        ;;
    "main"|*)
        main
        ;;
esac
