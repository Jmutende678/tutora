# Use Node.js 20 Alpine for smaller image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy only the admin portal directory
COPY tutora-admin-portal/package*.json ./
RUN npm ci --only=production

# Copy the rest of the admin portal
COPY tutora-admin-portal/ ./

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
