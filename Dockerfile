FROM node:18-alpine

WORKDIR /app

# Install dependencies for Prisma CLI
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy application files
COPY . .

# Create necessary directories
RUN mkdir -p uploads logs

# Set permissions for uploads directory
RUN chmod 755 uploads logs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
