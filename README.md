# DTA Mind

A powerful AI workflow automation platform built with Node.js and React.

## 🚀 Quick Start

### Option 1: Docker (Recommended)

The easiest way to run DTA Mind is using Docker:

```bash
# Clone the repository
git clone https://github.com/yourusername/DTA-Mind-01.git
cd DTA-Mind-01

# Run with Docker Compose
docker-compose up -d

# Access the application
# Open http://localhost:3000 in your browser
```

**Docker Features:**
- ✅ **One-command setup**: `docker-compose up -d`
- ✅ **Automatic restarts**: Container restarts if it crashes
- ✅ **Health checks**: Monitors application health
- ✅ **Persistent data**: Your data survives container restarts
- ✅ **Production ready**: Optimized for production use

### Option 2: Local Development

If you prefer to run locally:

```bash
# 1. Install dependencies
pnpm install

# 2. Build the application
pnpm build

# 3. Start the server
pnpm start

# 4. Access at http://localhost:3000
```

## 🔐 Authentication

The app requires authentication to access models and create flows:

1. **Register a new account** through the web interface
2. **Login** with your credentials
3. **Access models** and create your AI workflows

**Default Admin Credentials** (for Docker):
- Username: `admin`
- Password: `admin123`

## 🐳 Docker Commands

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild and start
docker-compose up -d --build

# Remove all data (WARNING: This will delete your data)
docker-compose down -v
```

## 📁 Project Structure

```
DTA-Mind-01/
├── packages/
│   ├── server/          # Backend API server
│   ├── ui/             # React frontend
│   ├── components/     # AI components and nodes
│   └── api-documentation/ # API documentation
├── docker-compose.yml  # Docker configuration
├── Dockerfile         # Docker image definition
└── README.md         # This file
```

## 🔧 Configuration

### Environment Variables

Key environment variables you can customize:

```bash
# Authentication
DTAMIND_USERNAME=admin
DTAMIND_PASSWORD=admin123

# Database
DATABASE_TYPE=sqlite
DATABASE_PATH=/app/packages/server/.dtamind/database.sqlite

# Security (Change these in production!)
JWT_AUTH_TOKEN_SECRET=your-secret-key-change-this
JWT_REFRESH_TOKEN_SECRET=your-refresh-secret-key-change-this
EXPRESS_SESSION_SECRET=your-session-secret-change-this
TOKEN_HASH_SECRET=your-token-hash-secret-change-this
```

### Customizing Docker

To customize the Docker setup, edit `docker-compose.yml`:

```yaml
environment:
  - DTAMIND_USERNAME=your-username
  - DTAMIND_PASSWORD=your-password
  - JWT_AUTH_TOKEN_SECRET=your-secret-key
```

## 🛠️ Development

### Prerequisites

- Node.js 20+
- pnpm
- Docker (for Docker deployment)

### Local Development Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development server
pnpm start

# Run tests
pnpm test
```

## 📊 Monitoring

The application includes health checks and monitoring:

- **Health Check**: `http://localhost:3000/api/v1/ping`
- **Logs**: Check Docker logs with `docker-compose logs -f`
- **Database**: SQLite database stored in Docker volume

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the logs: `docker-compose logs -f`
2. Ensure port 3000 is available
3. Verify Docker is running
4. Check the health endpoint: `http://localhost:3000/api/v1/ping`

---

**Note**: The app requires authentication. Register a new account through the web interface to access models and create flows. 
