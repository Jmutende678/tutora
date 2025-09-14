# Use Node.js 20 Alpine for smaller image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY tutora-admin-portal/package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code and public assets
COPY tutora-admin-portal/src ./src
COPY tutora-admin-portal/public ./public
COPY tutora-admin-portal/next.config.js ./next.config.js
COPY tutora-admin-portal/tailwind.config.js ./tailwind.config.js
COPY tutora-admin-portal/postcss.config.js ./postcss.config.js
COPY tutora-admin-portal/tsconfig.json ./tsconfig.json
COPY tutora-admin-portal/.eslintrc.json ./.eslintrc.json

# Build the application with build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV SKIP_ENV_VALIDATION=1
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
