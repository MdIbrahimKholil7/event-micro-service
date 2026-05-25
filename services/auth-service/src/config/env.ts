import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

const rootCandidatePaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), "../../../.env")
];

const rootEnvPath = rootCandidatePaths.find((p) => fs.existsSync(p));
if (rootEnvPath) {
  dotenv.config({ path: rootEnvPath });
}

const localOverridePaths = [
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), "services/auth-service/.env.local")
];

const localEnvPath = localOverridePaths.find((p) => fs.existsSync(p));
if (localEnvPath) {
  dotenv.config({ path: localEnvPath, override: true });
}

export const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  AUTH_SERVICE_PORT: z.coerce.number().default(3001),
  AUTH_DB_HOST: z.string(),
  AUTH_DB_PORT: z.coerce.number().default(5432),
  AUTH_DB_NAME: z.string(),
  AUTH_DB_USER: z.string(),
  AUTH_DB_PASSWORD: z.string(),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("7d"),
  BCRYPT_ROUNDS: z.coerce.number().default(12)
});

export const config = envSchema.parse(process.env);
const isRunningInDocker = fs.existsSync("/.dockerenv");
const resolvedDbHost =
  !isRunningInDocker && config.AUTH_DB_HOST === "postgres-auth" ? "localhost" : config.AUTH_DB_HOST;
const resolvedDbPort =
  !isRunningInDocker && config.AUTH_DB_HOST === "postgres-auth" && config.AUTH_DB_PORT === 5432
    ? 5433
    : config.AUTH_DB_PORT;

export const authDbUrl = `postgres://${config.AUTH_DB_USER}:${config.AUTH_DB_PASSWORD}@${resolvedDbHost}:${resolvedDbPort}/${config.AUTH_DB_NAME}`;
