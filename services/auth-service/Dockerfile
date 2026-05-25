FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
COPY services/auth-service/package*.json ./services/auth-service/
RUN npm install

FROM deps AS build
COPY tsconfig.base.json ./
COPY services/auth-service ./services/auth-service
RUN npm run build -w services/auth-service

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/services/auth-service/dist ./services/auth-service/dist
COPY services/auth-service/drizzle ./services/auth-service/drizzle
COPY services/auth-service/package.json ./services/auth-service/package.json
EXPOSE 3001
CMD ["node", "services/auth-service/dist/index.js"]
