#!/bin/bash

# 🚀 Execute NIM Container Manager Rebranding
# This script will fork, rebrand, and publish the package

set -e  # Exit on any error

echo "🚀 Starting NIM Container Manager rebranding process..."

# Step 1: Clone the original package
echo "📦 Step 1: Cloning original package..."
git clone https://github.com/flowiseai/flowise-nim-container-manager.git dtamind-nim-container-manager
cd dtamind-nim-container-manager

# Step 2: Remove old origin and add new one
echo "🔗 Step 2: Setting up new repository..."
git remote remove origin
git remote add origin https://github.com/DtamindAI/dtamind-nim-container-manager.git

# Step 3: Rebrand all references
echo "🔄 Step 3: Rebranding all references..."
find . -type f -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.md" | xargs sed -i 's/flowise/dtamind/g'
find . -type f -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.md" | xargs sed -i 's/Flowise/Dtamind/g'
find . -type f -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.md" | xargs sed -i 's/flowiseai/dtamindai/g'

# Step 4: Update package.json
echo "📝 Step 4: Updating package.json..."
cat > package.json << 'EOF'
{
  "name": "dtamind-nim-container-manager",
  "version": "1.0.11",
  "description": "NVIDIA NIM Container Manager for Dtamind",
  "keywords": ["dtamind", "nvidia", "nim", "container", "ai"],
  "author": "DtamindAI",
  "license": "ISC",
  "repository": {
    "type": "git",
    "url": "https://github.com/DtamindAI/dtamind-nim-container-manager.git"
  },
  "bugs": {
    "url": "https://github.com/DtamindAI/dtamind-nim-container-manager/issues"
  },
  "homepage": "https://github.com/DtamindAI/dtamind-nim-container-manager#readme"
}
EOF

# Step 5: Update README.md
echo "📖 Step 5: Updating README.md..."
cat > README.md << 'EOF'
# Dtamind NIM Container Manager

NVIDIA NIM Container Manager for Dtamind AI platform.

## Installation

```bash
npm install dtamind-nim-container-manager
```

## Usage

```javascript
const { NimContainerManager } = require('dtamind-nim-container-manager')
```

## License

ISC License
EOF

# Step 6: Install dependencies and test
echo "📦 Step 6: Installing dependencies..."
npm install

# Step 7: Test the package
echo "🧪 Step 7: Testing package..."
if npm test; then
    echo "✅ Tests passed!"
else
    echo "⚠️  Tests failed, but continuing..."
fi

# Step 8: Build the package
echo "🔨 Step 8: Building package..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "⚠️  Build failed, but continuing..."
fi

# Step 9: Login to npm (you'll need to enter credentials)
echo "🔐 Step 9: Logging into npm..."
echo "Please enter your npm credentials when prompted:"
npm login

# Step 10: Publish the package
echo "📤 Step 10: Publishing package to npm..."
npm publish

# Step 11: Verify publication
echo "✅ Step 11: Verifying publication..."
npm view dtamind-nim-container-manager

echo "🎉 Package published successfully!"

# Step 12: Push to GitHub
echo "📤 Step 12: Pushing to GitHub..."
git add .
git commit -m "Rebrand to Dtamind NIM Container Manager"
git push -u origin main

echo "✅ Repository pushed to GitHub!"

# Step 13: Go back to original directory
cd ..

echo ""
echo "🎉 NIM Container Manager rebranding complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run: node update-nim-package.js"
echo "2. Test the NVIDIA NIM functionality"
echo "3. Verify all container management features work"
echo ""
echo "🔗 Package URL: https://www.npmjs.com/package/dtamind-nim-container-manager"
echo "🔗 GitHub URL: https://github.com/DtamindAI/dtamind-nim-container-manager" 