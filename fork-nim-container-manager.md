# 🚀 Fork & Rebrand: flowise-nim-container-manager → dtamind-nim-container-manager

## 📋 **Step-by-Step Process**

### **Phase 1: Fork the Original Package**

```bash
# 1. Clone the original repository
git clone https://github.com/flowiseai/flowise-nim-container-manager.git
cd flowise-nim-container-manager

# 2. Create new repository on GitHub/GitLab
# Name: dtamind-nim-container-manager
# Description: NVIDIA NIM Container Manager for Dtamind

# 3. Change remote origin
git remote remove origin
git remote add origin https://github.com/DtamindAI/dtamind-nim-container-manager.git
```

### **Phase 2: Rebrand the Package**

```bash
# 4. Update package.json
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
```

### **Phase 3: Update Code References**

```bash
# 5. Find and replace all "flowise" references
find . -type f -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.md" | xargs sed -i 's/flowise/dtamind/g'
find . -type f -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.md" | xargs sed -i 's/Flowise/Dtamind/g'
find . -type f -name "*.js" -o -name "*.ts" -o -name "*.json" -o -name "*.md" | xargs sed -i 's/flowiseai/dtamindai/g'
```

### **Phase 4: Update Client ID**

```javascript
// 6. Update the client_id in the code
const data = {
    client_id: 'Dtamind', // Changed from 'Flowise'
    pdi: '0x1234567890abcdeg',
    access_policy_name: 'nim-dev'
}
```

### **Phase 5: Update Documentation**

```markdown
# 7. Update README.md
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
```

### **Phase 6: Test the Package**

```bash
# 8. Install dependencies and test
npm install
npm test

# 9. Build the package
npm run build
```

### **Phase 7: Publish to npm**

```bash
# 10. Login to npm
npm login

# 11. Publish the package
npm publish

# 12. Verify publication
npm view dtamind-nim-container-manager
```

### **Phase 8: Update Your App**

```javascript
// 13. Update your app to use the new package
// In packages/server/src/controllers/nvidia-nim/index.ts

// Change this:
const { NimContainerManager } = require('flowise-nim-container-manager')

// To this:
const { NimContainerManager } = require('dtamind-nim-container-manager')
```

```bash
# 14. Update package.json dependencies
npm uninstall flowise-nim-container-manager
npm install dtamind-nim-container-manager
```

## 🎯 **Package Details to Maintain**

- **Version**: 1.0.11 (start with same version)
- **License**: ISC (keep original license)
- **Size**: ~13.8 MB
- **Dependencies**: Keep all original dependencies
- **API**: Maintain exact same API interface

## ⚠️ **Important Considerations**

### **1. License Compliance**
- Check if ISC license allows forking
- Maintain original license terms
- Credit original authors if required

### **2. API Compatibility**
- Keep exact same function signatures
- Don't break existing functionality
- Maintain backward compatibility

### **3. Version Management**
- Start with same version (1.0.11)
- Increment version for your changes
- Follow semantic versioning

### **4. Documentation**
- Update all references to Dtamind
- Keep technical documentation intact
- Update examples and usage

## 🚀 **Quick Commands**

```bash
# Complete rebranding in one go
git clone https://github.com/flowiseai/flowise-nim-container-manager.git dtamind-nim-container-manager
cd dtamind-nim-container-manager
find . -type f -exec sed -i 's/flowise/dtamind/g' {} \;
find . -type f -exec sed -i 's/Flowise/Dtamind/g' {} \;
find . -type f -exec sed -i 's/flowiseai/dtamindai/g' {} \;
npm install
npm test
npm publish
```

## 📝 **Post-Publication Checklist**

- [ ] Package published to npm
- [ ] GitHub repository created
- [ ] Documentation updated
- [ ] Tests passing
- [ ] App updated to use new package
- [ ] Old package removed from dependencies

## 🎉 **Success Criteria**

✅ Package available as `dtamind-nim-container-manager` on npm  
✅ All "flowise" references changed to "dtamind"  
✅ Client ID updated to "Dtamind"  
✅ App successfully uses new package  
✅ No breaking changes to functionality  

---

**Estimated Time**: 2-4 hours  
**Risk Level**: Low (straightforward rebranding)  
**Dependencies**: Original package functionality preserved 