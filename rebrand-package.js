const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting package rebranding process...');

// Configuration
const sourcePackage = 'flowise-components';
const targetPackage = 'dtamind-components';
const targetVersion = '3.0.4';

async function rebrandPackage() {
    try {
        // Step 1: Download the package
        console.log(`📦 Downloading ${sourcePackage}...`);
        execSync(`npm pack ${sourcePackage}`, { stdio: 'inherit' });
        
        // Find the downloaded tarball
        const files = fs.readdirSync('.');
        const tarball = files.find(file => file.startsWith('flowise-components-') && file.endsWith('.tgz'));
        
        if (!tarball) {
            throw new Error('Could not find downloaded tarball');
        }
        
        // Step 2: Extract the package
        console.log('📂 Extracting package...');
        execSync(`tar -xzf ${tarball}`, { stdio: 'inherit' });
        
        // Step 3: Navigate to extracted directory
        const extractedDir = `package`;
        if (!fs.existsSync(extractedDir)) {
            throw new Error('Extracted directory not found');
        }
        
        // Step 4: Update package.json
        console.log('📝 Updating package.json...');
        const packageJsonPath = path.join(extractedDir, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        // Update package.json fields
        packageJson.name = targetPackage;
        packageJson.version = targetVersion;
        packageJson.description = 'Apps integration for Dtamind. Contain Nodes and Credentials.';
        packageJson.keywords = ['dtamind', 'ai', 'components', 'nodes', 'credentials'];
        packageJson.homepage = 'https://dtamindai.com';
        packageJson.repository = {
            type: 'git',
            url: 'https://github.com/DtamindAI/Dtamind.git'
        };
        packageJson.bugs = {
            url: 'https://github.com/DtamindAI/Dtamind/issues'
        };
        packageJson.author = 'DtamindAI';
        packageJson.license = 'Apache-2.0';
        
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        
        // Step 5: Update README.md
        console.log('📖 Updating README.md...');
        const readmePath = path.join(extractedDir, 'README.md');
        if (fs.existsSync(readmePath)) {
            let readme = fs.readFileSync(readmePath, 'utf8');
            
            // Replace all occurrences
            readme = readme.replace(/flowise-components/g, 'dtamind-components');
            readme = readme.replace(/Flowise Components/g, 'Dtamind Components');
            readme = readme.replace(/Apps integration for Flowise/g, 'Apps integration for Dtamind');
            readme = readme.replace(/flowiseai\.com/g, 'dtamindai.com');
            readme = readme.replace(/Flowise/g, 'Dtamind');
            readme = readme.replace(/flowise/g, 'dtamind');
            
            fs.writeFileSync(readmePath, readme);
        }
        
        // Step 6: Update all TypeScript/JavaScript files
        console.log('🔧 Updating source files...');
        updateSourceFiles(extractedDir);
        
        // Step 7: Create new directory for rebranded package
        const newDir = `dtamind-components-${targetVersion}`;
        if (fs.existsSync(newDir)) {
            fs.rmSync(newDir, { recursive: true, force: true });
        }
        fs.renameSync(extractedDir, newDir);
        
        // Step 8: Create tarball
        console.log('📦 Creating new tarball...');
        execSync(`tar -czf ${targetPackage}-${targetVersion}.tgz ${newDir}`, { stdio: 'inherit' });
        
        // Step 9: Cleanup
        console.log('🧹 Cleaning up...');
        fs.rmSync(newDir, { recursive: true, force: true });
        fs.unlinkSync(tarball);
        
        console.log('✅ Package rebranding completed!');
        console.log(`📦 New package: ${targetPackage}-${targetVersion}.tgz`);
        console.log('');
        console.log('📋 Next steps:');
        console.log('1. npm login');
        console.log('2. npm publish');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

function updateSourceFiles(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
            updateSourceFiles(fullPath);
        } else if (file.name.endsWith('.ts') || file.name.endsWith('.js') || file.name.endsWith('.json')) {
            try {
                let content = fs.readFileSync(fullPath, 'utf8');
                
                // Replace imports and references
                content = content.replace(/from ['"]flowise-components['"]/g, "from 'dtamind-components'");
                content = content.replace(/import ['"]flowise-components['"]/g, "import 'dtamind-components'");
                content = content.replace(/require\(['"]flowise-components['"]\)/g, "require('dtamind-components')");
                content = content.replace(/flowise-components/g, 'dtamind-components');
                content = content.replace(/Flowise/g, 'Dtamind');
                content = content.replace(/flowise/g, 'dtamind');
                
                fs.writeFileSync(fullPath, content);
            } catch (error) {
                // Skip files that can't be read as text
            }
        }
    }
}

// Run the rebranding process
rebrandPackage(); 