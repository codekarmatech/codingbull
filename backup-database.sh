#!/bin/bash
# Database Backup Script for CodingBull on Hostinger VPS
# Run this script regularly via cron for automated backups

set -e

# Configuration
DB_NAME="bulldb"
DB_USER="bulldb"
BACKUP_DIR="/home/codingbull/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/codingbull_backup_$DATE.sql"
RETENTION_DAYS=30

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
print_status "Creating database backup..."
pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_FILE

# Compress backup
print_status "Compressing backup..."
gzip $BACKUP_FILE

# Update backup file name
BACKUP_FILE="$BACKUP_FILE.gz"

# Check if backup was created successfully
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    print_status "Backup created successfully: $BACKUP_FILE ($BACKUP_SIZE)"
else
    print_error "Backup failed!"
    exit 1
fi

# Clean up old backups
print_status "Cleaning up old backups (older than $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "codingbull_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# List recent backups
print_status "Recent backups:"
ls -lh $BACKUP_DIR/codingbull_backup_*.sql.gz | tail -5

print_status "Backup completed successfully!"

# Optional: Upload to cloud storage (uncomment and configure as needed)
# print_status "Uploading to cloud storage..."
# aws s3 cp $BACKUP_FILE s3://your-backup-bucket/database-backups/
# print_status "Backup uploaded to cloud storage"
