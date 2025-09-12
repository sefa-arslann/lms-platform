#!/bin/bash

# Script to replace hardcoded localhost URLs with environment variables
# Usage: ./update-urls.sh YOUR_VPS_IP

set -e

VPS_IP=${1:-"YOUR_VPS_IP"}

echo "🔄 Updating hardcoded URLs to use environment variables..."

# Function to replace URLs in a file
replace_urls() {
    local file=$1
    local api_url="process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'"
    local ws_url="process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'"
    
    if [ -f "$file" ]; then
        echo "Updating $file..."
        
        # Replace hardcoded API URLs
        sed -i "s|http://localhost:3001|${api_url}|g" "$file"
        sed -i "s|'http://localhost:3001'|${api_url}|g" "$file"
        sed -i "s|\"http://localhost:3001\"|${api_url}|g" "$file"
        
        # Replace hardcoded WebSocket URLs
        sed -i "s|ws://localhost:3001|${ws_url}|g" "$file"
        sed -i "s|'ws://localhost:3001'|${ws_url}|g" "$file"
        sed -i "s|\"ws://localhost:3001\"|${ws_url}|g" "$file"
        
        echo "✅ Updated $file"
    else
        echo "⚠️  File not found: $file"
    fi
}

# Update all relevant files
echo "📁 Updating web app files..."

# Main page files
replace_urls "apps/web/src/app/page.tsx"
replace_urls "apps/web/src/app/cart/page.tsx"
replace_urls "apps/web/src/app/courses/page.tsx"
replace_urls "apps/web/src/app/courses/[id]/page.tsx"
replace_urls "apps/web/src/app/courses/[id]/learn/page.tsx"
replace_urls "apps/web/src/app/payment/page.tsx"

# Admin pages
replace_urls "apps/web/src/app/admin/page.tsx"
replace_urls "apps/web/src/app/admin/devices/page.tsx"
replace_urls "apps/web/src/app/admin/reports/page.tsx"
replace_urls "apps/web/src/app/admin/orders/page.tsx"
replace_urls "apps/web/src/app/admin/users/page.tsx"
replace_urls "apps/web/src/app/admin/courses/page.tsx"
replace_urls "apps/web/src/app/admin/messages/page.tsx"

# Other pages
replace_urls "apps/web/src/app/profile/page.tsx"
replace_urls "apps/web/src/app/messages/page.tsx"

# Components
replace_urls "apps/web/src/components/Header.tsx"

# Contexts
replace_urls "apps/web/src/contexts/AuthContext.tsx"

# Utils
replace_urls "apps/web/src/utils/api.ts"
replace_urls "apps/web/src/utils/api/orders.ts"

echo "🔧 Updating API configuration..."

# Update CORS settings in main.ts
if [ -f "apps/api/src/main.ts" ]; then
    echo "Updating CORS settings..."
    sed -i "s|'http://YOUR_VPS_IP:3002'|process.env.WEB_URL|g" "apps/api/src/main.ts"
    sed -i "s|'http://YOUR_VPS_IP:3000'|process.env.WEB_URL|g" "apps/api/src/main.ts"
    echo "✅ Updated CORS settings"
fi

echo "📝 Creating environment variable helper..."

# Create a helper file for environment variables
cat > apps/web/src/utils/env.ts << 'EOF'
// Environment configuration helper
export const getApiUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }
  // Client-side
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

export const getWsUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
  }
  // Client-side
  return process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
};

export const getWebUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side
    return process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3002';
  }
  // Client-side
  return process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3002';
};
EOF

echo "✅ Created environment helper"

echo "🎉 URL update completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update your VPS IP in all .env.production files"
echo "2. Test the application locally"
echo "3. Deploy to VPS using ./deploy-to-vps.sh"
echo ""
echo "🔍 Files updated:"
echo "- All React components now use environment variables"
echo "- API configuration updated"
echo "- CORS settings made dynamic"
echo "- Environment helper created"
