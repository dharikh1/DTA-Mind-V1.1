#!/bin/bash

# DTA Mind Docker Setup Script
echo "🐳 Setting up DTA Mind with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is already in use. Please stop the service using port 3000 first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"
echo "🚀 Starting DTA Mind..."

# Build and start the containers
docker-compose up -d --build

# Wait a moment for the container to start
echo "⏳ Waiting for the application to start..."
sleep 10

# Check if the application is running
if curl -f http://localhost:3000/api/v1/ping >/dev/null 2>&1; then
    echo "✅ DTA Mind is running successfully!"
    echo "🌐 Open your browser and go to: http://localhost:3000"
    echo ""
    echo "📝 Default credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop app: docker-compose down"
    echo "   Restart: docker-compose restart"
else
    echo "❌ Application failed to start. Check logs with: docker-compose logs -f"
    exit 1
fi 