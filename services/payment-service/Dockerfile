FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
COPY services/payment-service/package*.json ./services/payment-service/
RUN npm install

FROM deps AS build
COPY tsconfig.base.json ./
COPY services/payment-service ./services/payment-service
RUN npm run build -w services/payment-service

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/services/payment-service/dist ./services/payment-service/dist
COPY services/payment-service/package.json ./services/payment-service/package.json
EXPOSE 3004
CMD ["node", "services/payment-service/dist/index.js"]
