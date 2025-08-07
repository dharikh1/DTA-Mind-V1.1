# Development Guide

## 🚀 Development Environment Setup

This guide will help you set up a development environment to test your changes before building them into the main application.

## 📋 Prerequisites

- Node.js >= 18.15.0
- pnpm >= 9
- Git

## 🛠️ Development Scripts

### 1. **UI Development Only** (Port 8080)
```bash
# Run only the UI in development mode on port 8080
pnpm dev:ui
```
- **URL**: http://localhost:8080
- **Features**: Hot reload, fast refresh, development tools
- **Use case**: When you only need to test UI changes

### 2. **Server Development Only**
```bash
# Run only the server in development mode
pnpm dev:server
```
- **URL**: http://localhost:3000
- **Features**: Auto-restart on file changes, nodemon
- **Use case**: When you only need to test server changes

### 3. **Full Development Environment** (Recommended)
```bash
# Run both UI and server in development mode
pnpm dev:full
```
- **UI URL**: http://localhost:8080
- **Server URL**: http://localhost:3000
- **Features**: Both services running simultaneously
- **Use case**: When you need to test full application functionality

## 🎯 Development Workflow

### Step 1: Start Development Environment
```bash
# Start the full development environment
pnpm dev:full
```

### Step 2: Make Your Changes
- Edit files in `packages/ui/src/` for UI changes
- Edit files in `packages/server/src/` for server changes
- Changes will automatically reload in the browser

### Step 3: Test Your Changes
- **UI Changes**: Visit http://localhost:8080
- **API Changes**: Test against http://localhost:3000/api
- **Full Integration**: Test complete workflows

### Step 4: Build for Production
```bash
# When satisfied with changes, build for production
pnpm build
```

## 🔧 Configuration Files

### UI Development Configuration
- **File**: `packages/ui/.env.development`
- **Port**: 8080
- **API URL**: http://localhost:3000

### Server Development Configuration
- **File**: `packages/server/.env`
- **Port**: 3000
- **Database**: Supabase (configured)

## 🎨 UI Development Features

- **Hot Reload**: Changes reflect immediately in browser
- **Fast Refresh**: React components update without losing state
- **Development Tools**: React DevTools, Redux DevTools
- **Error Overlay**: Clear error messages in browser
- **Source Maps**: Debug original source code

## 🔄 Server Development Features

- **Auto-restart**: Server restarts on file changes
- **Nodemon**: Watches for TypeScript changes
- **Live Logging**: Real-time console output
- **Error Handling**: Detailed error messages

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8080
npx kill-port 8080

# Kill process on port 3000
npx kill-port 3000
```

### Build Issues
```bash
# Clean and rebuild
pnpm clean
pnpm build
```

### Database Connection Issues
- Check `packages/server/.env` configuration
- Verify Supabase credentials
- Ensure database is accessible

## 📝 Best Practices

1. **Always test in development first** before building
2. **Use the full development environment** for integration testing
3. **Check both UI and server logs** for errors
4. **Test all affected functionality** before committing
5. **Use browser dev tools** for debugging UI issues

## 🎯 Quick Commands Reference

```bash
# Development
pnpm dev:ui          # UI only (port 8080)
pnpm dev:server      # Server only (port 3000)
pnpm dev:full        # Both UI and server

# Production
pnpm build           # Build for production
pnpm start           # Start production server

# Utilities
pnpm clean           # Clean build artifacts
pnpm nuke            # Clean everything (nuclear option)
```
