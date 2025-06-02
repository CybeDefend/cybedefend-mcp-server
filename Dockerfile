# Dockerfile
# -------- 1° stage : build ---------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Dépendances (on ignore les scripts pour éviter le prepare)
COPY package*.json ./
RUN npm ci --ignore-scripts          # ← prépare sans lancer "prepare"

# 2. Code source + build
COPY . .
RUN npm run build

# -------- 2° stage : runtime ------------------------------------
FROM node:20-alpine

WORKDIR /app

# Dépendances de prod uniquement
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# JS compilé
COPY --from=builder /app/dist ./dist

ENTRYPOINT ["node", "dist/index.js"]
