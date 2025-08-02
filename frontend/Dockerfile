# Dockerfile cho React Frontend

# Stage 1: Build React app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build ứng dụng
RUN npm run build

# Stage 2: Serve với Nginx
FROM nginx:alpine

# Copy built app từ builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]