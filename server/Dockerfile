FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Expose the server port
EXPOSE 10000

# Start the server
CMD ["node", "server.js"]
