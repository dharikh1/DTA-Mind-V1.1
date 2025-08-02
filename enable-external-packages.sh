#!/bin/bash

echo "🔧 Enabling external packages..."

# 1. Enable @flowiseai/nodevm in utils.ts
sed -i '' 's/\/\/ import { NodeVM } from '\''@flowiseai\/nodevm'\''/import { NodeVM } from '\''@flowiseai\/nodevm'\''/g' packages/components/src/utils.ts

# 2. Enable executeJavaScriptCode function
sed -i '' 's/\/\/ export const executeJavaScriptCode = async (/export const executeJavaScriptCode = async (/g' packages/components/src/utils.ts

# 3. Enable flowise-nim-container-manager in nvidia-nim controller
sed -i '' 's/\/\/ const { NimContainerManager } = require('\''flowise-nim-container-manager'\'')/const { NimContainerManager } = require('\''flowise-nim-container-manager'\'')/g' packages/server/src/controllers/nvidia-nim/index.ts

# 4. Enable all NimContainerManager function calls
sed -i '' 's/\/\/ await NimContainerManager\./await NimContainerManager\./g' packages/server/src/controllers/nvidia-nim/index.ts

# 5. Enable flowise-react-json-view imports (if any)
find packages/ui/src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/\/\/ import.*flowise-react-json-view/import &/g'

echo "✅ External packages enabled!"
echo "📦 Rebuilding components..."
cd packages/components && pnpm run build

echo "📦 Rebuilding server..."
cd ../server && pnpm run build

echo "🚀 Starting app with external packages..."
cd ../../ && pnpm run dev