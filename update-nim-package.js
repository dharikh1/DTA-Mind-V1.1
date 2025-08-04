#!/usr/bin/env node

/**
 * Script to update the app to use dtamind-nim-container-manager
 * Run this after publishing the new package to npm
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Updating app to use dtamind-nim-container-manager...');

// Step 1: Update the import in the controller
const controllerPath = 'packages/server/src/controllers/nvidia-nim/index.ts';
const controllerContent = fs.readFileSync(controllerPath, 'utf8');

// Replace the import
const updatedContent = controllerContent.replace(
    /const \{ NimContainerManager \} = require\('flowise-nim-container-manager'\)/,
    "const { NimContainerManager } = require('dtamind-nim-container-manager')"
);

fs.writeFileSync(controllerPath, updatedContent);
console.log('✅ Updated controller import');

// Step 2: Update client_id in the controller
const clientIdUpdated = updatedContent.replace(
    /client_id: 'Flowise'/,
    "client_id: 'Dtamind'"
);

fs.writeFileSync(controllerPath, clientIdUpdated);
console.log('✅ Updated client_id to Dtamind');

// Step 3: Update package.json dependencies
const packageJsonPath = 'packages/server/package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Remove old dependency and add new one
delete packageJson.dependencies['flowise-nim-container-manager'];
packageJson.dependencies['dtamind-nim-container-manager'] = '^1.0.11';

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
console.log('✅ Updated package.json dependencies');

// Step 4: Update enable/disable scripts
const enableScriptPath = 'enable-external-packages.sh';
const disableScriptPath = 'disable-external-packages.sh';

if (fs.existsSync(enableScriptPath)) {
    let enableContent = fs.readFileSync(enableScriptPath, 'utf8');
    enableContent = enableContent.replace(
        /flowise-nim-container-manager/g,
        'dtamind-nim-container-manager'
    );
    fs.writeFileSync(enableScriptPath, enableContent);
    console.log('✅ Updated enable script');
}

if (fs.existsSync(disableScriptPath)) {
    let disableContent = fs.readFileSync(disableScriptPath, 'utf8');
    disableContent = disableContent.replace(
        /flowise-nim-container-manager/g,
        'dtamind-nim-container-manager'
    );
    fs.writeFileSync(disableScriptPath, disableContent);
    console.log('✅ Updated disable script');
}

// Step 5: Install the new package
try {
    console.log('📦 Installing dtamind-nim-container-manager...');
    execSync('npm install dtamind-nim-container-manager', { stdio: 'inherit' });
    console.log('✅ Installed new package');
} catch (error) {
    console.log('⚠️  Package not found yet. Please install manually after publishing:');
    console.log('   npm install dtamind-nim-container-manager');
}

// Step 6: Remove old package
try {
    console.log('🗑️  Removing old package...');
    execSync('npm uninstall flowise-nim-container-manager', { stdio: 'inherit' });
    console.log('✅ Removed old package');
} catch (error) {
    console.log('⚠️  Old package not found or already removed');
}

console.log('\n🎉 Update complete!');
console.log('\n📋 Next steps:');
console.log('1. Publish dtamind-nim-container-manager to npm');
console.log('2. Run: npm install dtamind-nim-container-manager');
console.log('3. Test the NVIDIA NIM functionality');
console.log('4. Verify all container management features work');

console.log('\n🔍 Files updated:');
console.log(`- ${controllerPath}`);
console.log(`- ${packageJsonPath}`);
console.log('- enable-external-packages.sh');
console.log('- disable-external-packages.sh'); 