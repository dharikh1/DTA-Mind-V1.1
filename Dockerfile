# DTA Mind - AI Chatflow Builder
# Single-stage Docker build for production

FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/components/package.json ./packages/components/
COPY packages/ui/package.json ./packages/ui/
COPY packages/server/package.json ./packages/server/
COPY packages/api-documentation/package.json ./packages/api-documentation/

# Install all dependencies (including dev dependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build all packages
RUN pnpm run build

# Remove dev dependencies and keep only production
RUN pnpm prune --prod

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
