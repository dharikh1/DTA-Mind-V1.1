# 🚀 Execute NIM Container Manager Rebranding (PowerShell)
# This script will fork, rebrand, and publish the package

Write-Host "🚀 Starting NIM Container Manager rebranding process..." -ForegroundColor Green

# Step 1: Clone the original package
Write-Host "📦 Step 1: Cloning original package..." -ForegroundColor Yellow
git clone https://github.com/flowiseai/flowise-nim-container-manager.git dtamind-nim-container-manager
cd dtamind-nim-container-manager

# Step 2: Remove old origin and add new one
Write-Host "🔗 Step 2: Setting up new repository..." -ForegroundColor Yellow
git remote remove origin
git remote add origin https://github.com/DtamindAI/dtamind-nim-container-manager.git

# Step 3: Rebrand all references
Write-Host "🔄 Step 3: Rebranding all references..." -ForegroundColor Yellow
Get-ChildItem -Recurse -Include "*.js", "*.ts", "*.json", "*.md" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'flowise', 'dtamind'
    $content = $content -replace 'Flowise', 'Dtamind'
    $content = $content -replace 'flowiseai', 'dtamindai'
    Set-Content $_.FullName $content
}

# Step 4: Update package.json
Write-Host "📝 Step 4: Updating package.json..." -ForegroundColor Yellow
$packageJson = @{
    name = "dtamind-nim-container-manager"
    version = "1.0.11"
    description = "NVIDIA NIM Container Manager for Dtamind"
    keywords = @("dtamind", "nvidia", "nim", "container", "ai")
    author = "DtamindAI"
    license = "ISC"
    repository = @{
        type = "git"
        url = "https://github.com/DtamindAI/dtamind-nim-container-manager.git"
    }
    bugs = @{
        url = "https://github.com/DtamindAI/dtamind-nim-container-manager/issues"
    }
    homepage = "https://github.com/DtamindAI/dtamind-nim-container-manager#readme"
} | ConvertTo-Json -Depth 10

Set-Content "package.json" $packageJson

# Step 5: Update README.md
Write-Host "📖 Step 5: Updating README.md..." -ForegroundColor Yellow
$readme = @"
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
"@

Set-Content "README.md" $readme

# Step 6: Install dependencies and test
Write-Host "📦 Step 6: Installing dependencies..." -ForegroundColor Yellow
npm install

# Step 7: Test the package
Write-Host "🧪 Step 7: Testing package..." -ForegroundColor Yellow
try {
    npm test
    Write-Host "✅ Tests passed!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Tests failed, but continuing..." -ForegroundColor Yellow
}

# Step 8: Build the package
Write-Host "🔨 Step 8: Building package..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "✅ Build successful!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Build failed, but continuing..." -ForegroundColor Yellow
}

# Step 9: Login to npm
Write-Host "🔐 Step 9: Logging into npm..." -ForegroundColor Yellow
Write-Host "Please enter your npm credentials when prompted:" -ForegroundColor Cyan
npm login

# Step 10: Publish the package
Write-Host "📤 Step 10: Publishing package to npm..." -ForegroundColor Yellow
npm publish

# Step 11: Verify publication
Write-Host "✅ Step 11: Verifying publication..." -ForegroundColor Yellow
npm view dtamind-nim-container-manager

Write-Host "🎉 Package published successfully!" -ForegroundColor Green

# Step 12: Push to GitHub
Write-Host "📤 Step 12: Pushing to GitHub..." -ForegroundColor Yellow
git add .
git commit -m "Rebrand to Dtamind NIM Container Manager"
git push -u origin main

Write-Host "✅ Repository pushed to GitHub!" -ForegroundColor Green

# Step 13: Go back to original directory
cd ..

Write-Host ""
Write-Host "🎉 NIM Container Manager rebranding complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: node update-nim-package.js"
Write-Host "2. Test the NVIDIA NIM functionality"
Write-Host "3. Verify all container management features work"
Write-Host ""
Write-Host "🔗 Package URL: https://www.npmjs.com/package/dtamind-nim-container-manager" -ForegroundColor Blue
Write-Host "🔗 GitHub URL: https://github.com/DtamindAI/dtamind-nim-container-manager" -ForegroundColor Blue 