# Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY . .

RUN npm ci --omit dev && npm run build \
    && npm prune --omit=dev

ENTRYPOINT ["node", "dist/index.js"]