#!/bin/bash
# Script to check if console.log statements are properly wrapped

cd codingbull-website/src

echo "Checking console.log statements in frontend code..."
echo "=================================================="

# Find all console.log statements and check their context
grep -rn "console\.log" . --exclude-dir=node_modules 2>/dev/null | while IFS=: read -r file line_num content; do
    echo ""
    echo "File: $file, Line: $line_num"
    echo "Content: $content"
    
    # Get 5 lines before and after for context
    context=$(sed -n "$((line_num-5)),$((line_num+5))p" "$file" 2>/dev/null)
    
    # Check if any of the context lines contain development checks
    if echo "$context" | grep -q -E "(DEBUG_MODE|isDevelopment|config\.features\.enableDebugMode|config\.isDevelopment|process\.env\.NODE_ENV.*development)"; then
        echo "✅ PROPERLY WRAPPED (development check found in context)"
    elif echo "$content" | grep -q -E "(// to log results|removed console.log for production)"; then
        echo "✅ COMMENTED/REMOVED (comment indicates it's handled)"
    else
        echo "❌ UNWRAPPED (no development check found)"
        echo "Context:"
        echo "$context"
    fi
done
