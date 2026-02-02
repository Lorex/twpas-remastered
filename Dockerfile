# TWPAS Mock Server Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production 2>/dev/null || npm install --only=production 2>/dev/null || true

# Copy mock app
COPY mock-app/ ./mock-app/

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start server
CMD ["node", "mock-app/server.js"]
