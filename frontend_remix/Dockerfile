FROM node:22.14.0-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application code
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:22.14.0-alpine AS production

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Copy built assets and package files
COPY --from=builder /app/build /app/build
COPY --from=builder /app/public /app/public
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

# Install only production dependencies
RUN npm ci --only=production

# Expose the port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]