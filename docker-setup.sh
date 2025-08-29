#!/bin/bash

# DTA Mind Docker Setup Script
# This script helps you deploy DTA Mind using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available. Please install Docker Compose and try again."
        exit 1
    fi
    print_success "Docker Compose is available"
}

# Function to build and start production environment
start_production() {
    print_status "Starting DTA Mind in production mode..."
    
    # Build the production image
    print_status "Building production Docker image..."
    docker-compose build --no-cache
    
    # Start the services
    print_status "Starting production services..."
    docker-compose up -d
    
    print_success "DTA Mind is starting up!"
    print_status "Backend API: http://localhost:3000"
    print_status "Frontend (via Nginx): http://localhost"
    print_status "Health check: http://localhost/health"
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check health
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_success "DTA Mind is running successfully!"
    else
        print_warning "Services may still be starting up. Check logs with: docker-compose logs -f"
    fi
}

# Function to start development environment
start_development() {
    print_status "Starting DTA Mind in development mode..."
    
    # Build the development image
    print_status "Building development Docker image..."
    docker-compose -f docker-compose.dev.yml build --no-cache
    
    # Start the development services
    print_status "Starting development services..."
    docker-compose -f docker-compose.dev.yml up -d
    
    print_success "DTA Mind development environment is starting up!"
    print_status "Backend API: http://localhost:3000"
    print_status "Frontend: http://localhost:8080"
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 15
    
    # Check health
    if curl -f http://localhost:3000/api/v1/health > /dev/null 2>&1; then
        print_success "DTA Mind development environment is running successfully!"
    else
        print_warning "Services may still be starting up. Check logs with: docker-compose -f docker-compose.dev.yml logs -f"
    fi
}

# Function to stop services
stop_services() {
    print_status "Stopping DTA Mind services..."
    
    # Stop production services
    docker-compose down 2>/dev/null || true
    
    # Stop development services
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    
    print_success "All services stopped"
}

# Function to show logs
show_logs() {
    local service=${1:-"all"}
    
    if [ "$service" = "all" ]; then
        print_status "Showing logs for all services..."
        docker-compose logs -f
    else
        print_status "Showing logs for $service service..."
        docker-compose logs -f "$service"
    fi
}

# Function to clean up
cleanup() {
    print_status "Cleaning up Docker resources..."
    
    # Stop and remove containers
    docker-compose down -v 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
    
    # Remove images
    docker rmi dtamind-dtamind:latest 2>/dev/null || true
    docker rmi dtamind-dtamind-dev:latest 2>/dev/null || true
    
    # Remove volumes
    docker volume rm dtamind_dtamind-storage 2>/dev/null || true
    docker volume rm dtamind_dtamind-uploads 2>/dev/null || true
    docker volume rm dtamind_dtamind-dev-storage 2>/dev/null || true
    docker volume rm dtamind_dtamind-dev-uploads 2>/dev/null || true
    
    print_success "Cleanup completed"
}

# Function to show status
show_status() {
    print_status "DTA Mind Docker Status:"
    echo ""
    
    # Production services
    echo "Production Services:"
    docker-compose ps 2>/dev/null || echo "  No production services running"
    echo ""
    
    # Development services
    echo "Development Services:"
    docker-compose -f docker-compose.dev.yml ps 2>/dev/null || echo "  No development services running"
    echo ""
    
    # Docker images
    echo "Docker Images:"
    docker images | grep dtamind || echo "  No DTA Mind images found"
}

# Function to show help
show_help() {
    echo "DTA Mind Docker Setup Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  prod          Start production environment"
    echo "  dev           Start development environment"
    echo "  stop          Stop all services"
    echo "  logs [SERVICE] Show logs (default: all services)"
    echo "  status        Show current status"
    echo "  cleanup       Clean up all Docker resources"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 prod       # Start production environment"
    echo "  $0 dev        # Start development environment"
    echo "  $0 logs       # Show all logs"
    echo "  $0 logs dtamind # Show logs for specific service"
}

# Main script logic
main() {
    # Check prerequisites
    check_docker
    check_docker_compose
    
    case "${1:-help}" in
        "prod"|"production")
            start_production
            ;;
        "dev"|"development")
            start_development
            ;;
        "stop")
            stop_services
            ;;
        "logs")
            show_logs "$2"
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"--help"|"-h"|"")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
