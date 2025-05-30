FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist ./dist
COPY .env .env
EXPOSE 4001
CMD ["node", "-r", "dotenv/config", "dist/server.js"]
