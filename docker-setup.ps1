# DTA Mind Docker Setup Script for Windows
Write-Host "🐳 Setting up DTA Mind with Docker..." -ForegroundColor Green

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Host "✅ Docker is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "Visit: https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is available
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose is available" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not available. Please install Docker Compose." -ForegroundColor Red
    Write-Host "Visit: https://docs.docker.com/compose/install/" -ForegroundColor Yellow
    exit 1
}

# Check if port 3000 is available
$portCheck = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($portCheck) {
    Write-Host "⚠️  Port 3000 is already in use. Please stop the service using port 3000 first." -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Starting DTA Mind..." -ForegroundColor Green

# Build and start the containers
docker-compose up -d --build

# Wait a moment for the container to start
Write-Host "⏳ Waiting for the application to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if the application is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/v1/ping" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ DTA Mind is running successfully!" -ForegroundColor Green
        Write-Host "🌐 Open your browser and go to: http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 Default credentials:" -ForegroundColor White
        Write-Host "   Username: admin" -ForegroundColor Gray
        Write-Host "   Password: admin123" -ForegroundColor Gray
        Write-Host ""
        Write-Host "📋 Useful commands:" -ForegroundColor White
        Write-Host "   View logs: docker-compose logs -f" -ForegroundColor Gray
        Write-Host "   Stop app: docker-compose down" -ForegroundColor Gray
        Write-Host "   Restart: docker-compose restart" -ForegroundColor Gray
    } else {
        throw "Application not responding"
    }
} catch {
    Write-Host "❌ Application failed to start. Check logs with: docker-compose logs -f" -ForegroundColor Red
    exit 1
} 