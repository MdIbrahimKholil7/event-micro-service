# Event Ticketing Microservices Foundation

## Included Services
- `api-gateway` (Express): gateway routing, auth guard, rate limiting, correlation ID, structured logs.
- `auth-service` (Express + Drizzle ORM): registration/login/refresh/logout, PostgreSQL, SQL migrations.
- `event-service` (Express + TypeORM): event CRUD, PostgreSQL, migration-based schema.

## Infrastructure in Docker Compose
- Kafka + Zookeeper
- Redis
- PostgreSQL for auth service
- PostgreSQL for event service
- Kafka UI

## Quick Start
1. Copy env:
   - `Copy-Item .env.example .env`
2. Install dependencies:
   - `npm install`
3. Start stack:
   - `npm run dev:up`
4. Health checks:
   - `http://localhost:3000/health`
   - `http://localhost:3001/health`
   - `http://localhost:3002/health`

## ORM Commands
- Generate migration metadata/sql:
  - `npm run db:generate -- auth`
  - `npm run db:generate -- event`
- Run migrations:
  - `npm run db:migrate -- auth`
  - `npm run db:migrate -- event`

## Database Backup / Restore
- Download DB dump:
  - `npm run db:download -- auth ./backups/auth.sql`
  - `npm run db:download -- event ./backups/event.sql`
- Restore DB dump:
  - `npm run db:restore -- auth ./backups/auth.sql`
  - `npm run db:restore -- event ./backups/event.sql`

## Notes
- Each service has its own Dockerfile.
- Compose uses service-level health checks and dependency ordering.
- Event route in gateway is protected by JWT bearer verification.
