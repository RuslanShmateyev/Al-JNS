# -----------------------------
# Stage 0: Prune workspace for api (minimize context)
# -----------------------------
FROM node:22-alpine AS prune

WORKDIR /workspace

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Copy workspace manifests for pruning/cache
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/bot/package.json apps/bot/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/database/package.json packages/database/package.json

# Copy source (needed for accurate prune graph)
COPY . .

# Create a pruned workspace containing only api and its deps
RUN pnpm dlx turbo prune bot --docker

# -----------------------------
# Stage 1: Install and build in pruned workspace
# -----------------------------
FROM node:22-alpine AS build

WORKDIR /workspace
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Copy pruned dependency graph and lockfile, install deps
COPY --from=prune /workspace/out/json/ .
COPY --from=prune /workspace/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Copy pruned full sources and build
COPY --from=prune /workspace/out/full/ .

# Копируем базовые tsconfig файлы (они не включаются в turbo prune)
COPY tsconfig.base.json tsconfig.backend.json tsconfig.package.json ./

# Build all packages present in the pruned workspace (api + its deps)
RUN pnpm -r build

# -----------------------------
# Stage 2: Runtime image (install prod deps)
# -----------------------------
FROM node:22-alpine
#RUN apk update && apk upgrade

WORKDIR /app
ENV NODE_ENV=prod
# Enable global webcrypto for Node 18
### THIS IS NOT REQUIRED FOR NODE:22 ### ENV NODE_OPTIONS=--experimental-global-webcrypto

# Install pnpm in runtime image
RUN npm i -g pnpm@10.24.0

# Copy everything from build stage including node_modules
COPY --from=build /workspace/apps ./apps
COPY --from=build /workspace/packages ./packages
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/package.json ./package.json
COPY --from=build /workspace/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=build /workspace/pnpm-lock.yaml ./pnpm-lock.yaml

EXPOSE 3001

# Start the application
CMD ["node", "apps/bot/dist/main.js"]
