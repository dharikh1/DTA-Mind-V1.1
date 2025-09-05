# Production Dockerfile for DTA-Mind
FROM node:20-alpine

# Install pnpm and build dependencies
RUN apk add --no-cache python3 make g++ && \
    npm install -g pnpm@latest

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/server/package.json ./packages/server/
COPY packages/components/package.json ./packages/components/
COPY packages/api-documentation/package.json ./packages/api-documentation/
COPY packages/ui/package.json ./packages/ui/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the entire project
COPY . .

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S dtamind -u 1001

# Create data directory and logs directory
RUN mkdir -p /app/data /app/packages/server/logs && chown -R dtamind:nodejs /app/data /app/packages/server/logs

# Switch to non-root user
USER dtamind

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application (will build on first run)
CMD ["pnpm", "start"]
