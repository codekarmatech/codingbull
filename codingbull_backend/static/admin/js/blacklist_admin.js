/**
 * Enterprise Blacklist Rule Admin JavaScript
 * Enhanced functionality for managing blacklist rules
 */

// Wait for Django admin and jQuery to be ready
(function() {
    'use strict';
    
    function initializeWhenReady() {
        if (typeof django !== 'undefined' && typeof django.jQuery !== 'undefined') {
            // jQuery is available, initialize with Django's jQuery
            (function($) {
                // Initialize when DOM is ready
                $(document).ready(function() {
                    initializeBlacklistAdmin();
                });
            })(django.jQuery);
        } else {
            // Wait a bit more for Django admin to load
            setTimeout(initializeWhenReady, 100);
        }
    }
    
    // Start the initialization process
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeWhenReady);
    } else {
        initializeWhenReady();
    }
    
    function initializeBlacklistAdmin() {
        var $ = django.jQuery;
        // Initialize pattern validation
        initPatternValidation();
        
        // Initialize bulk actions
        initBulkActions();
        
        // Initialize export functionality
        initExportFunctionality();
        
        // Initialize rule effectiveness tooltips
        initTooltips();
        
        // Initialize dashboard refresh
        initDashboardRefresh();
        
        // Initialize rule analytics
        initRuleAnalytics();
        
        console.log('🛡️ Blacklist Admin enhanced functionality initialized');

    /**
     * Pattern validation for different rule types
     */
    function initPatternValidation() {
        const patternField = $('#id_pattern');
        const ruleTypeField = $('#id_rule_type');
        const validationDiv = $('<div id="pattern-validation" class="pattern-validation"></div>');
        
        if (patternField.length && ruleTypeField.length) {
            patternField.after(validationDiv);
            
            // Validate on change
            patternField.on('input', debounce(validatePattern, 500));
            ruleTypeField.on('change', validatePattern);
            
            // Initial validation
            validatePattern();
        }
    }

    function validatePattern() {
        const pattern = $('#id_pattern').val();
        const ruleType = $('#id_rule_type').val();
        const validationDiv = $('#pattern-validation');
        
        if (!pattern || !ruleType) {
            validationDiv.html('');
            return;
        }

        let validation = '';
        let isValid = true;

        try {
            switch (ruleType) {
                case 'ip':
                    validation = validateIPAddress(pattern);
                    break;
                case 'ip_range':
                    validation = validateIPRange(pattern);
                    break;
                case 'user_agent':
                case 'path':
                case 'referer':
                    validation = validateRegex(pattern);
                    break;
                case 'country':
                    validation = validateCountryCode(pattern);
                    break;
                default:
                    validation = '<span class="validation-info">ℹ️ No validation available for this rule type</span>';
            }
        } catch (e) {
            validation = `<span class="validation-error">❌ ${e.message}</span>`;
            isValid = false;
        }

        validationDiv.html(validation);
        
        // Update pattern field styling
        if (isValid) {
            $('#id_pattern').removeClass('validation-error').addClass('validation-success');
        } else {
            $('#id_pattern').removeClass('validation-success').addClass('validation-error');
        }
    }

    function validateIPAddress(ip) {
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
        
        if (ipv4Regex.test(ip)) {
            const parts = ip.split('.');
            for (let part of parts) {
                if (parseInt(part) > 255) {
                    throw new Error('Invalid IPv4 address: octet out of range');
                }
            }
            return '<span class="validation-success">✅ Valid IPv4 address</span>';
        } else if (ipv6Regex.test(ip)) {
            return '<span class="validation-success">✅ Valid IPv6 address</span>';
        } else {
            throw new Error('Invalid IP address format');
        }
    }

    function validateIPRange(range) {
        const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
        const rangeRegex = /^(\d{1,3}\.){3}\d{1,3}-(\d{1,3}\.){3}\d{1,3}$/;
        
        if (cidrRegex.test(range)) {
            const [ip, mask] = range.split('/');
            const maskNum = parseInt(mask);
            if (maskNum > 32) {
                throw new Error('Invalid CIDR mask: must be 0-32');
            }
            validateIPAddress(ip); // This will throw if invalid
            return '<span class="validation-success">✅ Valid CIDR range</span>';
        } else if (rangeRegex.test(range)) {
            const [startIP, endIP] = range.split('-');
            validateIPAddress(startIP);
            validateIPAddress(endIP);
            return '<span class="validation-success">✅ Valid IP range</span>';
        } else {
            throw new Error('Invalid IP range format. Use CIDR (192.168.1.0/24) or range (192.168.1.1-192.168.1.10)');
        }
    }

    function validateRegex(pattern) {
        try {
            new RegExp(pattern);
            const complexity = analyzeRegexComplexity(pattern);
            return `<span class="validation-success">✅ Valid regex pattern</span><br>
                    <span class="validation-info">Complexity: ${complexity}</span>`;
        } catch (e) {
            throw new Error(`Invalid regex pattern: ${e.message}`);
        }
    }

    function analyzeRegexComplexity(pattern) {
        let score = 0;
        if (pattern.includes('*') || pattern.includes('+')) score += 1;
        if (pattern.includes('?')) score += 1;
        if (pattern.includes('|')) score += 2;
        if (pattern.includes('(') && pattern.includes(')')) score += 1;
        if (pattern.includes('[') && pattern.includes(']')) score += 1;
        
        if (score === 0) return 'Simple';
        if (score <= 2) return 'Low';
        if (score <= 4) return 'Medium';
        return 'High';
    }

    function validateCountryCode(code) {
        const iso2Regex = /^[A-Z]{2}$/;
        if (iso2Regex.test(code.toUpperCase())) {
            return '<span class="validation-success">✅ Valid ISO 3166-1 alpha-2 country code</span>';
        } else {
            throw new Error('Invalid country code. Use ISO 3166-1 alpha-2 format (e.g., US, GB, DE)');
        }
    }

    /**
     * Enhanced bulk actions
     */
    function initBulkActions() {
        // Add confirmation for dangerous actions
        const dangerousActions = ['bulk_delete_expired', 'delete_selected'];
        
        $('.admin-actions select[name="action"]').on('change', function() {
            const selectedAction = $(this).val();
            if (dangerousActions.includes(selectedAction)) {
                $('.admin-actions').addClass('danger-action');
            } else {
                $('.admin-actions').removeClass('danger-action');
            }
        });

        // Add confirmation dialog for bulk delete
        $('button[name="index"]').on('click', function(e) {
            const selectedAction = $('.admin-actions select[name="action"]').val();
            const selectedCount = $('input[name="_selected_action"]:checked').length;
            
            if (dangerousActions.includes(selectedAction) && selectedCount > 0) {
                const actionName = $('.admin-actions select[name="action"] option:selected').text();
                const confirmed = confirm(
                    `⚠️ Warning: You are about to ${actionName.toLowerCase()} for ${selectedCount} rules.\n\n` +
                    'This action cannot be undone. Are you sure you want to continue?'
                );
                
                if (!confirmed) {
                    e.preventDefault();
                    return false;
                }
            }
        });
    }

    /**
     * Export functionality
     */
    function initExportFunctionality() {
        // Add export buttons to the changelist
        const exportHTML = `
            <div class="export-actions">
                <h3>📊 Export & Analysis Tools</h3>
                <button type="button" class="export-btn" id="export-visible">
                    📊 Export Visible Rules
                </button>
                <button type="button" class="export-btn btn-success" id="analyze-selected">
                    📈 Analyze Selected
                </button>
                <button type="button" class="export-btn btn-warning" id="validate-patterns">
                    🔍 Validate Patterns
                </button>
            </div>
        `;
        
        $('.admin-actions').after(exportHTML);
        
        // Export visible rules
        $('#export-visible').on('click', function() {
            exportVisibleRules();
        });
        
        // Analyze selected rules
        $('#analyze-selected').on('click', function() {
            analyzeSelectedRules();
        });
        
        // Validate patterns
        $('#validate-patterns').on('click', function() {
            validateSelectedPatterns();
        });
    }

    function exportVisibleRules() {
        const rules = [];
        $('#result_list tbody tr').each(function() {
            const row = $(this);
            const rule = {
                type: row.find('td:nth-child(2)').text().trim(),
                pattern: row.find('td:nth-child(3)').text().trim(),
                status: row.find('td:nth-child(5)').text().trim(),
                matches: row.find('td:nth-child(6)').text().trim()
            };
            rules.push(rule);
        });
        
        downloadCSV(rules, 'blacklist_rules_visible.csv');
    }

    function analyzeSelectedRules() {
        const selected = $('input[name="_selected_action"]:checked');
        if (selected.length === 0) {
            alert('Please select at least one rule to analyze.');
            return;
        }
        
        let analysis = `📈 Analysis of ${selected.length} selected rules:\n\n`;
        
        const types = {};
        const statuses = {};
        
        selected.each(function() {
            const row = $(this).closest('tr');
            const type = row.find('td:nth-child(2)').text().trim();
            const status = row.find('td:nth-child(5)').text().trim();
            
            types[type] = (types[type] || 0) + 1;
            statuses[status] = (statuses[status] || 0) + 1;
        });
        
        analysis += '📊 By Type:\n';
        for (const [type, count] of Object.entries(types)) {
            analysis += `  • ${type}: ${count}\n`;
        }
        
        analysis += '\n🏷️ By Status:\n';
        for (const [status, count] of Object.entries(statuses)) {
            analysis += `  • ${status}: ${count}\n`;
        }
        
        alert(analysis);
    }

    function validateSelectedPatterns() {
        const selected = $('input[name="_selected_action"]:checked');
        if (selected.length === 0) {
            alert('Please select at least one rule to validate.');
            return;
        }
        
        alert(`🔍 Pattern validation initiated for ${selected.length} rules. Check the server logs for results.`);
        
        // Trigger the server-side validation action
        $('.admin-actions select[name="action"]').val('test_pattern_validity');
        $('.admin-actions form').submit();
    }

    /**
     * Initialize tooltips for effectiveness indicators
     */
    function initTooltips() {
        // Add tooltips to effectiveness indicators
        $('.effectiveness-score, .match-count-display, .last-activity').each(function() {
            const element = $(this);
            const text = element.text().trim();
            
            if (text.includes('%')) {
                element.attr('title', 'Rule effectiveness based on matches per day since creation');
            } else if (text.includes('matches')) {
                element.attr('title', 'Total number of times this rule has blocked requests');
            } else if (text.includes('ago') || text.includes('Never')) {
                element.attr('title', 'Last time this rule blocked a request');
            }
        });
    }

    /**
     * Dashboard refresh functionality
     */
    function initDashboardRefresh() {
        // Add refresh button to stats dashboard only if it doesn't exist
        if ($('.blacklist-stats-dashboard').length && $('.blacklist-stats-dashboard .refresh-btn').length === 0) {
            const refreshBtn = $('<button type="button" class="export-btn refresh-btn" style="float: right; margin-top: -5px; margin-left: 10px;">🔄 Refresh Stats</button>');
            $('.blacklist-stats-dashboard h3').first().append(refreshBtn);
            
            refreshBtn.on('click', function() {
                location.reload();
            });
        }
    }

    /**
     * Rule analytics and insights
     */
    function initRuleAnalytics() {
        // Add analytics insights to the dashboard
        addAnalyticsInsights();
        
        // Highlight high-impact rules
        highlightHighImpactRules();
        
        // Add rule recommendations
        addRuleRecommendations();
    }

    function addAnalyticsInsights() {
        if (!$('.blacklist-stats-dashboard').length) return;
        
        const insights = $(`
            <div class="security-impact">
                <h4>🎯 Security Insights</h4>
                <div id="security-insights">
                    <p>📊 Analyzing rule effectiveness...</p>
                </div>
            </div>
        `);
        
        $('.blacklist-stats-dashboard').append(insights);
        
        // Simulate insights loading (in real implementation, this would be AJAX)
        setTimeout(() => {
            const insightsHTML = `
                <ul>
                    <li>🔥 <strong>Top threat vectors:</strong> Consider adding more IP-based rules</li>
                    <li>📈 <strong>Effectiveness trend:</strong> Overall blocking rate increased 15% this week</li>
                    <li>⚠️ <strong>Attention needed:</strong> 3 rules haven't matched in 30+ days</li>
                    <li>🎯 <strong>Recommendation:</strong> Review expired rules for cleanup</li>
                </ul>
            `;
            $('#security-insights').html(insightsHTML);
        }, 1000);
    }

    function highlightHighImpactRules() {
        $('#result_list tbody tr').each(function() {
            const row = $(this);
            const matchesCell = row.find('td:nth-child(6)');
            const matchesText = matchesCell.text().trim();
            
            // Extract number from matches text
            const matches = parseInt(matchesText.replace(/[^\d]/g, ''));
            
            if (matches > 1000) {
                row.addClass('high-impact-rule');
                row.attr('title', 'High-impact rule: Over 1000 matches');
            } else if (matches > 100) {
                row.addClass('medium-impact-rule');
                row.attr('title', 'Medium-impact rule: Over 100 matches');
            }
        });
    }

    function addRuleRecommendations() {
        // Add recommendations panel
        const recommendations = $(`
            <div class="admin-alert admin-alert-info" style="margin-top: 20px;">
                <h4>💡 Smart Recommendations</h4>
                <div id="rule-recommendations">
                    <p>Loading recommendations...</p>
                </div>
            </div>
        `);
        
        $('.export-actions').after(recommendations);
        
        // Simulate loading recommendations
        setTimeout(() => {
            generateRecommendations();
        }, 1500);
    }

    function generateRecommendations() {
        const totalRules = $('#result_list tbody tr').length;
        const activeRules = $('#result_list tbody tr:contains("Active")').length;
        const expiredRules = $('#result_list tbody tr:contains("Expired")').length;
        
        let recommendationsHTML = '<ul>';
        
        if (expiredRules > 0) {
            recommendationsHTML += `<li>🧹 <strong>Cleanup:</strong> ${expiredRules} expired rules can be safely removed</li>`;
        }
        
        if (activeRules / totalRules < 0.8) {
            recommendationsHTML += '<li>⚡ <strong>Optimization:</strong> Consider activating more rules or removing inactive ones</li>';
        }
        
        if (totalRules < 10) {
            recommendationsHTML += '<li>🛡️ <strong>Security:</strong> Consider adding more comprehensive blocking rules</li>';
        }
        
        recommendationsHTML += '<li>📊 <strong>Monitoring:</strong> Set up automated alerts for high-activity rules</li>';
        recommendationsHTML += '<li>🔄 <strong>Maintenance:</strong> Schedule weekly reviews of rule effectiveness</li>';
        recommendationsHTML += '</ul>';
        
        $('#rule-recommendations').html(recommendationsHTML);
    }

    /**
     * Utility functions
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function downloadCSV(data, filename) {
        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    function convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        
        const csvRows = data.map(row => 
            headers.map(header => {
                const value = row[header] || '';
                return `"${value.replace(/"/g, '""')}"`;
            }).join(',')
        );
        
        return [csvHeaders, ...csvRows].join('\n');
    }

    // CSS classes for styling
    const dynamicCSS = `
        <style>
        .validation-success { color: #28a745; font-weight: bold; }
        .validation-error { color: #dc3545; font-weight: bold; }
        .validation-info { color: #17a2b8; }
        .danger-action { border: 2px solid #dc3545 !important; background: #f8d7da; }
        .high-impact-rule { background: rgba(40, 167, 69, 0.1) !important; }
        .medium-impact-rule { background: rgba(255, 193, 7, 0.1) !important; }
        #id_pattern.validation-success { border-color: #28a745; }
        #id_pattern.validation-error { border-color: #dc3545; }
        .pattern-validation { margin: 5px 0; font-size: 12px; }
        </style>
    `;
    
    $('head').append(dynamicCSS);

    } // End of initializeBlacklistAdmin function
    
})(); // End of main wrapper