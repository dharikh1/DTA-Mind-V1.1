# 🐳 Docker Setup Guide for DTA Mind

This guide will help you run DTA Mind using Docker - the easiest way to get started!

## 🚀 Quick Start (One Command)

### For Linux/Mac:
```bash
chmod +x docker-setup.sh
./docker-setup.sh
```

### For Windows:
```powershell
.\docker-setup.ps1
```

## 📋 Manual Docker Setup

If you prefer to run Docker commands manually:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/DTA-Mind-01.git
cd DTA-Mind-01
```

### 2. Start with Docker Compose
```bash
docker-compose up -d
```

### 3. Access the Application
Open your browser and go to: **http://localhost:3000**

## 🔐 Default Credentials

When using Docker, the default credentials are:
- **Username**: `admin`
- **Password**: `admin123`

## 📊 Useful Docker Commands

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild and start
docker-compose up -d --build

# Check container status
docker-compose ps

# Access container shell
docker-compose exec dtamind sh

# Remove all data (WARNING: This will delete your data)
docker-compose down -v
```

## 🔧 Configuration

### Environment Variables

You can customize the application by editing the `docker-compose.yml` file:

```yaml
environment:
  - DTAMIND_USERNAME=your-username
  - DTAMIND_PASSWORD=your-password
  - JWT_AUTH_TOKEN_SECRET=your-secret-key
  - DATABASE_TYPE=sqlite
  - PORT=3000
```

### Persistent Data

Your data is stored in Docker volumes:
- **Database**: `dtamind_data` volume
- **Logs**: `dtamind_logs` volume

This means your data survives container restarts and updates.

## 🏥 Health Checks

The application includes automatic health checks:
- **Health Endpoint**: `http://localhost:3000/api/v1/ping`
- **Docker Health Check**: Monitors container health automatically

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Stop the conflicting service, then run:
docker-compose up -d
```

### Container Won't Start
Check the logs:
```bash
docker-compose logs -f
```

### Permission Issues (Linux/Mac)
If you get permission errors:
```bash
sudo chmod +x docker-setup.sh
./docker-setup.sh
```

### Docker Not Running
Make sure Docker Desktop is running before executing any Docker commands.

## 📁 Project Structure

```
DTA-Mind-01/
├── docker-compose.yml    # Docker configuration
├── Dockerfile           # Docker image definition
├── .dockerignore        # Files to exclude from Docker build
├── docker-setup.sh      # Linux/Mac setup script
├── docker-setup.ps1     # Windows setup script
└── README.md           # Main documentation
```

## 🔒 Security Notes

For production use, make sure to:
1. Change default passwords
2. Update JWT secrets
3. Use HTTPS
4. Configure proper firewall rules
5. Regularly update the Docker image

## 🆘 Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify Docker is running
3. Ensure port 3000 is available
4. Check the health endpoint: `http://localhost:3000/api/v1/ping`

---

**Happy Dockerizing! 🐳** 