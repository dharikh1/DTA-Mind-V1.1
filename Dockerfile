# DTA Mind - AI Chatflow Builder
# Multi-stage Docker build for production

# Stage 1: Build components package
FROM node:20-alpine AS components-builder
WORKDIR /app/components
COPY packages/components/package*.json ./
RUN npm ci --only=production
COPY packages/components/ ./
RUN npm run build

# Stage 2: Build UI package
FROM node:20-alpine AS ui-builder
WORKDIR /app/ui
COPY packages/ui/package*.json ./
RUN npm ci
COPY packages/ui/ ./
RUN npm run build

# Stage 3: Build server package
FROM node:20-alpine AS server-builder
WORKDIR /app/server
COPY packages/server/package*.json ./
RUN npm ci --only=production
COPY packages/server/ ./
COPY --from=components-builder /app/components/dist ./node_modules/dtamind-components
RUN npm run build

# Stage 4: Production runtime
FROM node:20-alpine AS production
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built packages
COPY --from=components-builder /app/components/dist ./packages/components/dist
COPY --from=ui-builder /app/ui/dist ./packages/ui/dist
COPY --from=server-builder /app/server/dist ./packages/server/dist

# Copy server package files
COPY --from=server-builder /app/server/package*.json ./packages/server/
COPY --from=server-builder /app/server/bin ./packages/server/bin

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S dtamind -u 1001

# Change ownership
RUN chown -R dtamind:nodejs /app
USER dtamind

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/v1/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "packages/server/dist/index.js"]
