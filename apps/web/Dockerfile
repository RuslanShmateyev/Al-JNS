# apps/web/Dockerfile
FROM node:22-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

# Copy root configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files
COPY apps/api/package.json apps/api/
COPY apps/bot/package.json apps/bot/
COPY apps/web/package.json apps/web/
COPY packages/contracts/package.json packages/contracts/

# Install all workspace dependencies
RUN pnpm install

# Copy the rest of the source code
COPY . .

# Build shared contracts and the web application
RUN pnpm --filter @al-jns/contracts run build
RUN pnpm --filter web run build

# Production Stage
FROM nginx:alpine

# Copy built React files into nginx html directory
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
