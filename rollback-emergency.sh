#!/bin/bash

echo "🚨 EMERGENCY ROLLBACK: DTA Mind Rebranding"
echo "=========================================="
echo ""

echo "⚠️  WARNING: This will completely undo all rebranding changes!"
echo ""

read -p "Are you sure you want to rollback? Type 'YES' to confirm: " confirm

if [ "$confirm" != "YES" ]; then
    echo "❌ Rollback cancelled"
    exit 1
fi

echo ""
echo "🔄 Starting emergency rollback..."

# Switch to backup branch
echo "📦 Switching to backup branch..."
git checkout backup-before-rebranding

# Delete rebranding branch
echo "🗑️  Deleting rebranding branch..."
git branch -D dtamind-rebranding

# Create new rebranding branch from backup
echo "🆕 Creating new rebranding branch from backup..."
git checkout -b dtamind-rebranding
git reset --hard backup-before-rebranding

# Clean install dependencies
echo "🧹 Cleaning and reinstalling dependencies..."
rm -rf node_modules pnpm-lock.yaml
pnpm install

echo ""
echo "✅ Emergency rollback completed!"
echo "📁 Current branch: dtamind-rebranding (restored from backup)"
echo "🔧 Dependencies reinstalled"
echo ""
echo "🚀 You can now restart the rebranding process or continue development"
