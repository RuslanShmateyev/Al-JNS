# apps/api/Dockerfile
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
COPY packages/database/package.json packages/database/

# Install all workspace dependencies
RUN pnpm install

# Copy the rest of the source code
COPY . .

# Build shared contracts, database client, and the api application
RUN pnpm --filter @al-jns/contracts run build
RUN pnpm --filter @al-jns/database run db:generate
RUN pnpm --filter api run build

# Production Stage
FROM node:22-alpine AS runner

WORKDIR /app

# Copy necessary files from the builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/contracts/package.json ./packages/contracts/package.json
COPY --from=builder /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# Navigate to the API workspace directory
WORKDIR /app/apps/api

# Standard NestJS port
EXPOSE 3000

CMD ["node", "dist/main"]
