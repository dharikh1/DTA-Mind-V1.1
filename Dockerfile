# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@latest

# Copy package files first for better caching
COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy package.json files for all packages
COPY packages/server/package*.json ./packages/server/
COPY packages/components/package*.json ./packages/components/
COPY packages/ui/package*.json ./packages/ui/
COPY packages/api-documentation/package*.json ./packages/api-documentation/

# Copy lockfile
COPY pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Build the application with increased memory
RUN NODE_OPTIONS="--max-old-space-size=8192" pnpm build

# Create necessary directories
RUN mkdir -p /app/packages/server/logs && \
    mkdir -p /app/packages/server/.dtamind && \
    mkdir -p /app/packages/server/.dtamind/logs

# Set environment variables
ENV HOME=/app/packages/server
ENV DTAMIND_USER_HOME=/app/packages/server
ENV NODE_ENV=production
ENV PORT=3000
ENV DTAMIND_USERNAME=admin
ENV DTAMIND_PASSWORD=admin123

# Expose port
EXPOSE 3000

# Set the working directory to the server package
WORKDIR /app/packages/server

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/v1/ping', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/index.js"]
