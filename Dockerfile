# Use Node.js 20 Alpine for smaller image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY tutora-admin-portal/package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy the rest of the admin portal
COPY tutora-admin-portal/ ./

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy package files and install only production dependencies
COPY tutora-admin-portal/package*.json ./
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.js ./next.config.js

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
