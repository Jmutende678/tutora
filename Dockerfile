FROM node:20-alpine

WORKDIR /app

# Copy the entire project
COPY . .

# Install dependencies in the admin portal directory
WORKDIR /app/tutora-admin-portal
RUN npm ci

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
