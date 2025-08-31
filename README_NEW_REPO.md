# DTA Mind v1.0.0 🚀

**Complete UI Overhaul with AgentCanvas as Default Page**

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://hub.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-Workspace-orange?logo=pnpm)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

---

## 🎉 What's New in v1.0.0

### ✨ **Major Features**
- **🎯 AgentCanvas as Default**: Streamlined workflow with AgentCanvas as the landing page
- **🧭 Enhanced Navigation**: Persistent menu bar across all pages with improved navigation
- **🎨 Modern UI/UX**: Complete visual overhaul with better styling and animations
- **📦 Left Panel**: Permanent "Add Nodes" panel with collapsible functionality
- **💾 Enhanced Save**: Fully functional save system with proper validation
- **⭐ Sparkle Integration**: Moved sparkle icon to menu bar with agentflow generation

### 🚀 **New Menu Structure**
- **Workflow** (AgentCanvas)
- **Agents**
- **Credentials**
- **API Keys**
- **Document Stores**
- **Templates**
- **Schedule**
- **Assistants**

---

## 🛠️ Quick Start

### 🐳 **Docker Deployment (Recommended)**
```bash
# Clone the repository
git clone https://github.com/dharikh1/DTA-Mind-V1.0.git
cd DTA-Mind-V1.0

# Run with Docker Compose
docker-compose -f docker-compose.simple.yml up

# Or run directly
docker run -p 3000:3000 -p 8080:8080 dtamind:v1.0.0
```

### 🔧 **Local Development**
```bash
# Clone the repository
git clone https://github.com/dharikh1/DTA-Mind-V1.0.git
cd DTA-Mind-V1.0

# Install dependencies
pnpm install

# Start development server
pnpm dev:full

# Access the application
# Frontend: http://localhost:8080
# Backend: http://localhost:3000
```

---

## 📋 System Requirements

- **Node.js**: >=18.15.0 <19.0.0 || ^20
- **pnpm**: Latest version
- **Docker**: 20.10+ (for containerized deployment)
- **Browser**: Modern browsers with ES6 support

---

## 🎯 Key Features

### 🎨 **UI/UX Improvements**
- **Persistent Menu Bar**: Menu appears on all pages with consistent navigation
- **Left Panel**: Collapsible "Add Nodes" panel with smooth animations
- **Enhanced Styling**: Modern design with better spacing and hover effects
- **Responsive Design**: Works seamlessly across different screen sizes

### 🔧 **Technical Enhancements**
- **Improved Save Functionality**: Proper validation and error handling
- **Better State Management**: Enhanced navigation and component state
- **Code Quality**: Fixed JSX syntax errors and improved error handling
- **Performance**: Optimized rendering and reduced layout shifts

### 🚀 **Workflow Improvements**
- **Streamlined Navigation**: Removed chatbot page, focused on agent workflows
- **Better User Experience**: AgentCanvas as default focuses on agent creation
- **Enhanced Productivity**: Permanent access to node library
- **Consistent Interface**: Menu bar available on all pages

---

## 📦 Installation Options

### Option 1: Docker Image (594MB)
```bash
# Download the pre-built Docker image
wget https://github.com/dharikh1/DTA-Mind-V1.0/releases/download/v1.0.0/dtamind-v1.0.0.tar.gz

# Load the image
docker load -i dtamind-v1.0.0.tar.gz

# Run the container
docker run -p 3000:3000 -p 8080:8080 dtamind:v1.0.0
```

### Option 2: Source Code
```bash
# Clone and build from source
git clone https://github.com/dharikh1/DTA-Mind-V1.0.git
cd DTA-Mind-V1.0
pnpm install
pnpm run build
```

---

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_TYPE=sqlite
DATABASE_PATH=./storage/database.sqlite

# Server
PORT=3000
NODE_ENV=production

# UI
VITE_API_URL=http://localhost:3000
```

### Docker Configuration
```yaml
# docker-compose.yml
version: '3.8'
services:
  dtamind:
    image: dtamind:v1.0.0
    ports:
      - "3000:3000"
      - "8080:8080"
    volumes:
      - ./storage:/app/storage
    environment:
      - NODE_ENV=production
```

---

## 🚀 Deployment

### Production Deployment
```bash
# Using Docker Compose
docker-compose -f docker-compose.simple.yml up -d

# Using Docker directly
docker run -d \
  --name dtamind \
  -p 3000:3000 \
  -p 8080:8080 \
  -v $(pwd)/storage:/app/storage \
  dtamind:v1.0.0
```

### Development Setup
```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev:full

# Run tests
pnpm test

# Build for production
pnpm run build
```

---

## 📁 Project Structure

```
DTA-Mind-V1.0/
├── packages/
│   ├── ui/                 # Frontend React application
│   ├── server/             # Backend Node.js server
│   ├── components/         # Shared UI components
│   └── api-documentation/  # API documentation
├── storage/                # Database and file storage
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Production Docker image
└── README.md              # This file
```

---

## 🔄 Migration Guide

### From Previous Versions
- **No database migrations required**
- **UI changes are backward compatible**
- **Existing agents and workflows remain intact**
- **New features are additive**

### Breaking Changes
- **Chatbot page removed** from navigation
- **Configuration menu reorganized** into individual sections

---

## 🐛 Known Issues

- **Docker build**: Production build may fail due to missing dependencies
- **Solution**: Use `docker-compose.simple.yml` for reliable deployment
- **Development**: Development mode recommended for local testing

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

- **GitHub Issues**: [Report a bug](https://github.com/dharikh1/DTA-Mind-V1.0/issues)
- **Documentation**: See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed setup
- **Docker Guide**: See [DOCKER_GUIDE.md](DOCKER_GUIDE.md) for deployment options

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 Acknowledgments

Thank you to all contributors and users who provided feedback during the development of this release. Your input helped shape the improved user experience and enhanced functionality.

---

## 🏷️ Release Information

- **Version**: v1.0.0
- **Release Date**: August 30, 2025
- **Docker Image**: `dtamind:v1.0.0`
- **Size**: 594MB (compressed)

---

*DTA Mind v1.0.0 - Empowering AI Agent Development* 🚀

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/dharikh1/DTA-Mind-V1.0?style=social)](https://github.com/dharikh1/DTA-Mind-V1.0/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/dharikh1/DTA-Mind-V1.0?style=social)](https://github.com/dharikh1/DTA-Mind-V1.0/network)
[![GitHub issues](https://img.shields.io/github/issues/dharikh1/DTA-Mind-V1.0)](https://github.com/dharikh1/DTA-Mind-V1.0/issues)

</div>
