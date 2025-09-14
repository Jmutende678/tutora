FROM node:20-alpine

WORKDIR /app

# Copy root package.json first
COPY package*.json ./

# Install root dependencies (this will run postinstall)
RUN npm ci

# Set working directory to admin portal
WORKDIR /app/tutora-admin-portal

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
