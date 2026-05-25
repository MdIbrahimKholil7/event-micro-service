FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
COPY services/api-gateway/package*.json ./services/api-gateway/
RUN npm install

FROM deps AS build
COPY tsconfig.base.json ./
COPY services/api-gateway ./services/api-gateway
RUN npm run build -w services/api-gateway

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/services/api-gateway/dist ./services/api-gateway/dist
COPY services/api-gateway/package.json ./services/api-gateway/package.json
EXPOSE 3000
CMD ["node", "services/api-gateway/dist/index.js"]
