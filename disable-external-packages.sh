#!/bin/bash

echo "�� Disabling external packages..."

# 1. Disable @flowiseai/nodevm in utils.ts
sed -i '' 's/import { NodeVM } from '\''@flowiseai\/nodevm'\''/\/\/ import { NodeVM } from '\''@flowiseai\/nodevm'\''/g' packages/components/src/utils.ts

# 2. Disable executeJavaScriptCode function
sed -i '' 's/export const executeJavaScriptCode = async (/\/\/ export const executeJavaScriptCode = async (/g' packages/components/src/utils.ts

# 3. Disable dtamind-nim-container-manager in nvidia-nim controller
sed -i '' 's/const { NimContainerManager } = require('\''dtamind-nim-container-manager'\'')/\/\/ const { NimContainerManager } = require('\''dtamind-nim-container-manager'\'')/g' packages/server/src/controllers/nvidia-nim/index.ts

# 4. Disable all NimContainerManager function calls
sed -i '' 's/await NimContainerManager\./\/\/ await NimContainerManager\./g' packages/server/src/controllers/nvidia-nim/index.ts

# 5. Disable flowise-react-json-view imports (if any)
find packages/ui/src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/import.*flowise-react-json-view/\/\/ &/g'

echo "✅ External packages disabled!"
echo "📦 Rebuilding components..."
cd packages/components && pnpm run build

echo "📦 Rebuilding server..."
cd ../server && pnpm run build

echo "🚀 Starting app without external packages..."
cd ../../ && pnpm run dev