#!/bin/bash

# DTA-Mind Docker Build Script
# This script builds the production Docker image

set -e

# Configuration
IMAGE_NAME="dtamind"
TAG="latest"
REGISTRY=""
FULL_IMAGE_NAME="${REGISTRY}${IMAGE_NAME}:${TAG}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 DTA-Mind Docker Build Script${NC}"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Clean up old images
echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -f

# Build the image
echo -e "${BLUE}🔨 Building Docker image: ${FULL_IMAGE_NAME}${NC}"
echo "This may take several minutes..."

docker build \
    --tag "${FULL_IMAGE_NAME}" \
    --file Dockerfile \
    .

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully!${NC}"
    
    # Show image info
    echo -e "${BLUE}📊 Image Information:${NC}"
    docker images "${FULL_IMAGE_NAME}"
    
    echo -e "${GREEN}🚀 Ready to deploy!${NC}"
    echo ""
    echo -e "${YELLOW}To run the container:${NC}"
    echo "  docker run -p 3000:3000 ${FULL_IMAGE_NAME}"
    echo ""
    echo -e "${YELLOW}Or use Docker Compose:${NC}"
    echo "  docker-compose up -d"
    echo ""
    echo -e "${YELLOW}To push to registry (if configured):${NC}"
    echo "  docker push ${FULL_IMAGE_NAME}"
    
else
    echo -e "${RED}❌ Docker build failed!${NC}"
    exit 1
fi
