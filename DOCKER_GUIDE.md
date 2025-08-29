# DTA Mind Docker Guide

This guide explains how to deploy and run DTA Mind using Docker.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose available
- At least 4GB RAM available for Docker

### Production Deployment
```bash
# Start production environment
./docker-setup.sh prod

# Or manually
docker-compose up -d
```

### Development Environment
```bash
# Start development environment
./docker-setup.sh dev

# Or manually
docker-compose -f docker-compose.dev.yml up -d
```

## 📁 Docker Files Structure

```
DTA-Mind-03/
├── Dockerfile                 # Production multi-stage build
├── Dockerfile.dev            # Development environment
├── docker-compose.yml        # Production services
├── docker-compose.dev.yml    # Development services
├── nginx.conf               # Nginx reverse proxy config
├── .dockerignore            # Files to exclude from build
├── docker-setup.sh          # Automated setup script
└── DOCKER_GUIDE.md          # This guide
```

## 🏗️ Architecture

### Production Environment
- **DTA Mind App**: Node.js application with SQLite database
- **Nginx**: Reverse proxy with rate limiting and security headers
- **Volumes**: Persistent storage for database and uploads

### Development Environment
- **DTA Mind Dev**: Development container with hot reloading
- **Volume Mounts**: Live code synchronization
- **Port Mapping**: Direct access to backend (3000) and frontend (8080)

## 🔧 Configuration

### Environment Variables
```bash
NODE_ENV=production          # Environment mode
PORT=3000                    # Backend port
DATABASE_TYPE=sqlite         # Database type
DATABASE_PATH=/app/storage/database.sqlite
```

### Ports
- **Production**: Backend (3000), Frontend (80/443 via Nginx)
- **Development**: Backend (3000), Frontend (8080)

## 📊 Health Checks

### Application Health
```bash
# Production
curl http://localhost/health

# Development
curl http://localhost:3000/api/v1/health
```

### Docker Health Status
```bash
# Check service status
./docker-setup.sh status

# View logs
./docker-setup.sh logs
```

## 🛠️ Management Commands

### Using the Setup Script
```bash
./docker-setup.sh prod      # Start production
./docker-setup.sh dev       # Start development
./docker-setup.sh stop      # Stop all services
./docker-setup.sh status    # Show status
./docker-setup.sh logs      # Show logs
./docker-setup.sh cleanup   # Clean up everything
```

### Manual Docker Commands
```bash
# Production
docker-compose up -d
docker-compose down
docker-compose logs -f

# Development
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml logs -f
```

## 🔒 Security Features

### Nginx Security Headers
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### Rate Limiting
- API endpoints: 10 requests/second
- Login endpoint: 5 requests/minute

### Non-root User
- Application runs as `dtamind` user (UID 1001)
- No privileged operations

## 📈 Performance Optimizations

### Multi-stage Build
- Separate build and runtime stages
- Optimized production image size
- Development tools excluded from production

### Nginx Optimizations
- Gzip compression enabled
- Static asset caching (1 year)
- Keep-alive connections (32)

### Volume Management
- Persistent storage for database
- Separate volumes for uploads
- Named volumes for easy backup

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :80

# Stop conflicting services
./docker-setup.sh stop
```

#### Build Failures
```bash
# Clean build
docker-compose build --no-cache

# Check logs
docker-compose logs build
```

#### Database Issues
```bash
# Check database volume
docker volume ls | grep dtamind

# Reset database (WARNING: data loss)
docker volume rm dtamind_dtamind-storage
```

### Logs and Debugging
```bash
# Application logs
./docker-setup.sh logs dtamind

# Nginx logs
docker-compose logs dtamind-nginx

# All logs
./docker-setup.sh logs
```

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Stop services
./docker-setup.sh stop

# Pull latest code
git pull origin main

# Rebuild and restart
./docker-setup.sh prod
```

### Backup and Restore
```bash
# Backup volumes
docker run --rm -v dtamind_dtamind-storage:/data -v $(pwd):/backup alpine tar czf /backup/dtamind-backup-$(date +%Y%m%d).tar.gz -C /data .

# Restore volumes
docker run --rm -v dtamind_dtamind-storage:/data -v $(pwd):/backup alpine tar xzf /backup/backup-file.tar.gz -C /data
```

## 🌐 Production Deployment

### SSL/HTTPS Setup
1. Add SSL certificates to `./ssl/` directory
2. Update `nginx.conf` with SSL configuration
3. Update `docker-compose.yml` to mount SSL directory

### Load Balancer Integration
- Nginx can be placed behind a load balancer
- Health check endpoint: `/health`
- Rate limiting configured for API endpoints

### Monitoring
- Docker health checks enabled
- Nginx access and error logs
- Application logs via Docker logs

## 📚 Additional Resources

### Docker Commands Reference
```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View images
docker images

# View volumes
docker volume ls

# View networks
docker network ls
```

### Useful Docker Compose Commands
```bash
# Scale services
docker-compose up -d --scale dtamind=3

# View service dependencies
docker-compose config

# Execute commands in running containers
docker-compose exec dtamind sh
```

## 🆘 Support

If you encounter issues:

1. Check the logs: `./docker-setup.sh logs`
2. Verify Docker is running: `docker info`
3. Check system resources: `docker stats`
4. Review this guide for common solutions

For additional help, check the main project documentation or create an issue in the project repository. 