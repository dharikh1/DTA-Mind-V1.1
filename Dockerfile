# Use Node.js 18
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@latest

# Copy workspace configuration files
COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy package.json files for all packages
COPY packages/server/package*.json ./packages/server/
COPY packages/components/package*.json ./packages/components/
COPY packages/ui/package*.json ./packages/ui/

# Install all dependencies at workspace level
RUN pnpm install --frozen-lockfile=false

# Copy the entire project (including pre-built files)
COPY . .

# Create logs directory and set permissions
RUN mkdir -p /app/packages/server/logs && \
    mkdir -p /app/packages/server/.dtamind && \
    mkdir -p /app/packages/server/.dtamind/logs

# Expose port
EXPOSE 3000

# Set environment variables
ENV HOME=/app/packages/server
ENV DTAMIND_USER_HOME=/app/packages/server
ENV NODE_ENV=production
ENV PORT=3000

# Set the working directory to the server package
WORKDIR /app/packages/server
RUN pnpm build
# Start the server directly
CMD ["node", "dist/index.js"]
