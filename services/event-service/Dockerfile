FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
COPY services/event-service/package*.json ./services/event-service/
RUN npm install

FROM deps AS build
COPY tsconfig.base.json ./
COPY services/event-service ./services/event-service
RUN npm run build -w services/event-service

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/services/event-service/dist ./services/event-service/dist
COPY services/event-service/package.json ./services/event-service/package.json
EXPOSE 3002
CMD ["node", "services/event-service/dist/index.js"]
