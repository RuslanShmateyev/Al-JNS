# -----------------------------
# Stage 0: Prune workspace for web (минимизация контекста)
# -----------------------------
FROM node:22-alpine AS prune

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Копируем манифесты для prun'а
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json

# Копируем исходники — нужно для зависимостей в графе
COPY . .

# Создаем pruned workspace только для web и его зависимостей
RUN pnpm dlx turbo prune web --docker

# -----------------------------
# Stage 1: Build в pruned workspace
# -----------------------------
FROM node:22-alpine AS build

WORKDIR /workspace
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Копируем pruned lockfile + deps
COPY --from=prune /workspace/out/json/ .
COPY --from=prune /workspace/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

# Копируем pruned исходники
COPY --from=prune /workspace/out/full/ .

# Копируем базовые tsconfig файлы (они не включаются в turbo prune)
COPY tsconfig.base.json tsconfig.backend.json tsconfig.package.json ./

# ⚠️ ВАЖНО: сначала билдим локальные пакеты в правильном порядке
# Сначала utils (не зависит ни от чего), потом contracts (зависит от utils)
RUN pnpm --filter "@al-jns/contracts" build

# Потом билдим сам фронтенд
WORKDIR /workspace/apps/web
RUN pnpm build

# -----------------------------
# Stage 2: Runtime (Nginx)
# -----------------------------
FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

RUN apk update && apk upgrade && rm -rf /etc/nginx/conf.d/*

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/web/dist ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
