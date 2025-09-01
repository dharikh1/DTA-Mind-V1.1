# DTA-Mind Docker Deployment Guide

## 🐳 Overview

This guide covers deploying DTA-Mind using Docker for production environments. The Docker setup includes both frontend and backend in a single optimized container.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM available
- 10GB+ disk space

## 🚀 Quick Start

### 1. Build the Docker Image

```bash
# Using the build script (recommended)
./docker-build.sh

# Or manually
docker build --target production -t dtamind:latest .
```

### 2. Run with Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### 3. Access the Application

- **URL**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/v1/health

## 🔧 Configuration

### Environment Variables

Copy the environment template and customize:

```bash
cp env.production.template .env
# Edit .env with your configuration
```

### Key Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_TYPE` | `sqlite` | Database type (sqlite, postgres, mysql) |
| `DATABASE_PATH` | `/app/data` | Database file path (SQLite) |
| `PORT` | `3000` | Application port |
| `NODE_ENV` | `production` | Node.js environment |
| `DEBUG` | `false` | Enable debug mode |

### Database Options

#### SQLite (Default)
```yaml
environment:
  - DATABASE_TYPE=sqlite
  - DATABASE_PATH=/app/data
```

#### PostgreSQL
```yaml
environment:
  - DATABASE_TYPE=postgres
  - DATABASE_HOST=postgres
  - DATABASE_PORT=5432
  - DATABASE_USER=dtamind
  - DATABASE_PASSWORD=dtamind_password
  - DATABASE_NAME=dtamind
```

## 📦 Docker Compose Services

### Main Application
- **Service**: `dtamind`
- **Port**: 3000
- **Image**: Built from Dockerfile
- **Volumes**: `dtamind_data:/app/data`

### Optional Services

#### Redis (Session Storage)
Uncomment in `docker-compose.yml`:
```yaml
redis:
  image: redis:7-alpine
  container_name: dtamind-redis
  restart: unless-stopped
  command: redis-server --appendonly yes
  volumes:
    - redis_data:/data
  networks:
    - dtamind-network
```

#### PostgreSQL (Database)
Uncomment in `docker-compose.yml`:
```yaml
postgres:
  image: postgres:15-alpine
  container_name: dtamind-postgres
  restart: unless-stopped
  environment:
    - POSTGRES_DB=dtamind
    - POSTGRES_USER=dtamind
    - POSTGRES_PASSWORD=dtamind_password
  volumes:
    - postgres_data:/var/lib/postgresql/data
  networks:
    - dtamind-network
```

## 🔍 Monitoring & Health Checks

### Health Check
The container includes a health check that monitors the application:
```bash
# Check container health
docker ps

# View health check logs
docker inspect dtamind-production | grep -A 10 Health
```

### Logs
```bash
# View application logs
docker-compose logs -f dtamind

# View specific service logs
docker logs dtamind-production
```

## 🛠️ Management Commands

### Container Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View running containers
docker-compose ps
```

### Data Management
```bash
# Backup data
docker run --rm -v dtamind_data:/data -v $(pwd):/backup alpine tar czf /backup/dtamind-backup.tar.gz -C /data .

# Restore data
docker run --rm -v dtamind_data:/data -v $(pwd):/backup alpine tar xzf /backup/dtamind-backup.tar.gz -C /data
```

### Image Management
```bash
# Build new image
./docker-build.sh

# Remove old images
docker image prune -f

# View image details
docker images dtamind
```

## 🔒 Security Considerations

### Production Security
1. **Change default secrets** in environment variables
2. **Use HTTPS** with reverse proxy (nginx/traefik)
3. **Restrict network access** with firewalls
4. **Regular security updates** for base images
5. **Monitor logs** for suspicious activity

### Environment Variables Security
```bash
# Generate secure secrets
openssl rand -hex 32  # For JWT_SECRET
openssl rand -hex 32  # For ENCRYPTION_KEY
```

## 📊 Performance Optimization

### Resource Limits
Add to `docker-compose.yml`:
```yaml
services:
  dtamind:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'
```

### Volume Optimization
```yaml
volumes:
  dtamind_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /path/to/persistent/storage
```

## 🚨 Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check logs
docker-compose logs dtamind

# Check container status
docker-compose ps

# Verify environment variables
docker-compose config
```

#### Database Issues
```bash
# Check database connectivity
docker exec dtamind-production node -e "console.log('Database check')"

# Reset database (WARNING: Data loss)
docker-compose down -v
docker-compose up -d
```

#### Port Conflicts
```bash
# Check port usage
lsof -i :3000

# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Debug Mode
Enable debug mode for troubleshooting:
```yaml
environment:
  - DEBUG=true
  - LOG_LEVEL=debug
```

## 🔄 Updates & Maintenance

### Updating the Application
```bash
# Pull latest code
git pull

# Rebuild image
./docker-build.sh

# Update running containers
docker-compose down
docker-compose up -d
```

### Backup Strategy
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker run --rm -v dtamind_data:/data -v $(pwd):/backup alpine tar czf /backup/dtamind-backup-${DATE}.tar.gz -C /data .
echo "Backup created: dtamind-backup-${DATE}.tar.gz"
EOF
chmod +x backup.sh
```

## 📞 Support

For issues and support:
- Check the logs: `docker-compose logs -f`
- Verify configuration: `docker-compose config`
- Review this documentation
- Check GitHub issues

---

**Happy Deploying! 🚀**
