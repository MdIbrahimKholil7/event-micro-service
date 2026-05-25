FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
COPY services/order-service/package*.json ./services/order-service/
RUN npm install

FROM deps AS build
COPY tsconfig.base.json ./
COPY services/order-service ./services/order-service
RUN npm run build -w services/order-service

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/services/order-service/dist ./services/order-service/dist
COPY services/order-service/package.json ./services/order-service/package.json
EXPOSE 3003
CMD ["node", "services/order-service/dist/index.js"]
