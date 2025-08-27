# Stage 1: Build stage
FROM node:20-alpine AS build

USER root

# Install build dependencies
RUN apk add --no-cache build-base cairo-dev pango-dev python3 make g++ git

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./
COPY packages/server/package.json ./packages/server/
COPY packages/ui/package.json ./packages/ui/
COPY packages/components/package.json ./packages/components/

# Install all dependencies using workspace
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application using workspace
RUN pnpm build

# Stage 2: Runtime stage
FROM node:20-alpine

# Install runtime dependencies
RUN apk add --no-cache chromium git python3 py3-pip make g++ build-base cairo-dev pango-dev curl

# Set the environment variable for Puppeteer to find Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set working directory
WORKDIR /app

# Copy built application from build stage
COPY --from=build /app/packages/server/dist ./packages/server/dist
COPY --from=build /app/packages/ui/dist ./packages/ui/dist
COPY --from=build /app/packages/components/dist ./packages/components/dist
COPY --from=build /app/packages/server/package.json ./packages/server/
COPY --from=build /app/packages/ui/package.json ./packages/ui/
COPY --from=build /app/packages/components/package.json ./packages/components/
COPY --from=build /app/package.json ./

# Install only production dependencies
RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile

# Expose port
EXPOSE 3000

# Start the application using the built source
CMD ["node", "packages/server/dist/index.js"]
