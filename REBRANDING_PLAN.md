# 🎯 Rebranding Plan: Flowise → Dtamind

## 📊 **Phase 1: Planning Analysis**

### 🔍 **Scope Assessment:**
- **Total files to modify:** 731+ occurrences
- **File types affected:** JSON, JS, TS, MD, YML, YAML, JSX, TSX
- **Estimated effort:** High complexity, requires careful coordination

---

## 📋 **Detailed Change Categories**

### 1. **Package Configuration Files** (Critical Priority)
**Files to modify:**
- `package.json` (root)
- `packages/server/package.json`
- `packages/components/package.json`
- `packages/ui/package.json`
- `packages/api-documentation/package.json`
- `pnpm-lock.yaml`

**Changes needed:**
- Package names: `flowise` → `dtamind`
- Package dependencies: `flowise-components` → `dtamind-components`
- Package references: `flowise-ui` → `dtamind-ui`
- Package descriptions and metadata

### 2. **Application Identity** (Critical Priority)
**Files to modify:**
- `packages/server/src/errors/internalFlowiseError.ts`
- `packages/server/src/Interface.Metrics.ts`
- `packages/ui/src/store/constant.js`
- `packages/ui/src/utils/genericHelper.js`

**Changes needed:**
- Error class names: `InternalFlowiseError` → `InternalDtamindError`
- Constants: `FLOWISE_CREDENTIAL_ID` → `DTAMIND_CREDENTIAL_ID`
- Metrics interfaces: `FLOWISE_METRIC_COUNTERS` → `DTAMIND_METRIC_COUNTERS`

### 3. **Configuration Files** (High Priority)
**Files to modify:**
- `docker/docker-compose.yml`
- `docker/docker-compose-queue-source.yml`
- `docker/docker-compose-queue-prebuilt.yml`
- `docker/worker/docker-compose.yml`
- `metrics/prometheus/prometheus.config.yml`
- `packages/api-documentation/src/configs/swagger.config.ts`

**Changes needed:**
- Container names: `flowise` → `dtamind`
- Image names: `flowiseai/flowise` → `dtamindai/dtamind`
- Environment variables: `FLOWISE_*` → `DTAMIND_*`
- Service names and network configurations

### 4. **Documentation Files** (Medium Priority)
**Files to modify:**
- `SECURITY.md`
- `CONTRIBUTING.md`
- `ENV_SETUP.md`
- `README.md`
- `i18n/README-ZH.md`
- `i18n/CONTRIBUTING-ZH.md`
- `packages/ui/README.md`

**Changes needed:**
- GitHub repository links
- Documentation URLs
- Company references
- Setup instructions
- Branding references

### 5. **Source Code Files** (High Priority)
**Files to modify:**
- All TypeScript/JavaScript files in `packages/server/src/`
- All JavaScript/JSX files in `packages/ui/src/`
- All component files in `packages/components/`

**Changes needed:**
- Import statements
- Class names and variables
- Comments and documentation
- Error messages
- API endpoints

### 6. **Marketplace Templates** (Medium Priority)
**Files to modify:**
- All JSON files in `packages/server/marketplaces/`

**Changes needed:**
- Company name references in examples
- Documentation links
- Sample data and prompts
- Template descriptions

---

## ⚠️ **Critical Dependencies & Risks**

### 🔗 **External Dependencies:**
- `@flowiseai/nodevm` - External package
- `flowise-embed` - External package
- `flowise-nim-container-manager` - External package
- `flowise-react-json-view` - External package

### 🚨 **High-Risk Areas:**
1. **Database Paths:** `.flowise` → `.dtamind`
2. **Docker Images:** Need to rebuild all containers
3. **Environment Variables:** All `FLOWISE_*` variables
4. **API Endpoints:** May break existing integrations
5. **Package Dependencies:** External packages may not be available

### 🔄 **Breaking Changes:**
- All existing deployments will break
- Database connections may fail
- Docker containers need rebuilding
- External integrations need updates

---

## 🛠️ **Implementation Strategy**

### **Phase 1: Preparation** (1-2 days)
1. **Backup everything**
2. **Create new Docker images**
3. **Set up new package names**
4. **Prepare database migration**

### **Phase 2: Core Changes** (2-3 days)
1. **Update package.json files**
2. **Modify application constants**
3. **Update configuration files**
4. **Change source code references**

### **Phase 3: Documentation** (1-2 days)
1. **Update all documentation**
2. **Modify README files**
3. **Update marketplace templates**
4. **Fix external links**

### **Phase 4: Testing** (2-3 days)
1. **Rebuild and test all components**
2. **Verify database connections**
3. **Test all functionality**
4. **Validate Docker deployments**

### **Phase 5: Deployment** (1 day)
1. **Update Docker configurations**
2. **Deploy with new branding**
3. **Update external references**

---

## 📝 **Detailed File List**

### **Critical Files (Must Change):**
```
package.json
packages/server/package.json
packages/components/package.json
packages/ui/package.json
packages/api-documentation/package.json
packages/server/src/errors/internalFlowiseError.ts
packages/server/src/Interface.Metrics.ts
packages/ui/src/store/constant.js
docker/docker-compose.yml
docker/docker-compose-queue-source.yml
docker/docker-compose-queue-prebuilt.yml
docker/worker/docker-compose.yml
```

### **High Priority Files:**
```
packages/server/src/services/*.ts
packages/server/src/enterprise/services/*.ts
packages/ui/src/**/*.js
packages/ui/src/**/*.jsx
packages/components/**/*.ts
```

### **Medium Priority Files:**
```
packages/server/marketplaces/**/*.json
packages/api-documentation/src/configs/swagger.config.ts
metrics/prometheus/prometheus.config.yml
```

### **Documentation Files:**
```
SECURITY.md
CONTRIBUTING.md
ENV_SETUP.md
README.md
i18n/README-ZH.md
i18n/CONTRIBUTING-ZH.md
packages/ui/README.md
```

---

## 🎯 **Alternative Approach (Recommended)**

Instead of changing everything, consider:

### **Option A: Partial Rebranding**
- Keep internal technical names as "flowise"
- Change only user-facing branding to "dtamind"
- Update UI elements and documentation
- Keep technical infrastructure stable

### **Option B: Gradual Migration**
- Start with UI branding changes
- Gradually update technical components
- Maintain backward compatibility
- Test each change thoroughly

---

## ⏱️ **Estimated Timeline**

**Full Rebranding:** 8-12 days
**Partial Rebranding:** 3-5 days
**Gradual Migration:** 2-4 weeks

---

## 💰 **Resource Requirements**

- **Developer time:** 8-12 days full-time
- **Testing environment:** Separate staging setup
- **Docker resources:** New image builds
- **Database migration:** Backup and restore procedures

---

## 🚀 **Next Steps**

1. **Choose approach:** Full rebranding vs. Partial rebranding
2. **Set up staging environment**
3. **Create backup strategy**
4. **Begin with Phase 1 changes**
5. **Test each phase thoroughly**

---

*This plan provides a comprehensive roadmap for rebranding from "flowise" to "dtamind". The complexity and risk level is high, requiring careful planning and execution.* 