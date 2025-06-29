#!/bin/bash

# WordMemory Force Refresh Script
# Clears browser cache and forces reload of new design

echo "🔄 Force refreshing WordMemory with latest changes..."

# Stop current server
echo "1️⃣ Stopping current server..."
./scripts/stop-server.sh

# Clear Next.js cache
echo "2️⃣ Clearing Next.js cache..."
rm -rf .next

# Clear node modules cache (optional, only if needed)
if [ "$1" = "--full" ]; then
    echo "3️⃣ Full refresh: clearing node_modules..."
    rm -rf node_modules
    npm install
fi

# Rebuild application
echo "4️⃣ Building fresh version..."
npm run build

# Start server with fresh cache
echo "5️⃣ Starting fresh server..."
./scripts/start-persistent.sh

echo ""
echo "✅ Force refresh complete!"
echo "📱 Open: http://localhost:3000"
echo "💡 In your browser:"
echo "   - Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)"
echo "   - Or open Developer Tools (F12) → Network tab → check 'Disable cache'"
echo ""
echo "🎨 You should now see the beautiful glassy design with:"
echo "   ✨ Floating word bubbles"
echo "   🌈 Gradient backgrounds"
echo "   🪟 Glass card effects"
echo "   ⚡ Smooth animations"