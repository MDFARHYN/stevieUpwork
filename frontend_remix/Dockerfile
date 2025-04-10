# Use an official Node.js runtime as the base image
FROM node:18-slim

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --production

# Copy the rest of the Remix project
COPY . .

# Build the Remix app
RUN npm run build

# Expose the port Remix will run on
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]