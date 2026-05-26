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
  path.resolve(process.cwd(), "services/event-service/.env.local")
];
const localEnvPath = localOverridePaths.find((p) => fs.existsSync(p));
if (localEnvPath) {
  dotenv.config({ path: localEnvPath, override: true });
}

export const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  EVENT_SERVICE_PORT: z.coerce.number().default(3002),
  EVENT_DB_HOST: z.string(),
  EVENT_DB_PORT: z.coerce.number().default(5432),
  EVENT_DB_NAME: z.string(),
  EVENT_DB_USER: z.string(),
  EVENT_DB_PASSWORD: z.string(),
  KAFKA_BROKER: z.string().default("kafka:9092")
});

const parsedConfig = envSchema.parse(process.env);
const isRunningInDocker = fs.existsSync("/.dockerenv");
const resolvedEventDbHost =
  !isRunningInDocker && parsedConfig.EVENT_DB_HOST === "postgres-event"
    ? "localhost"
    : parsedConfig.EVENT_DB_HOST;
const resolvedEventDbPort =
  !isRunningInDocker && parsedConfig.EVENT_DB_HOST === "postgres-event" && parsedConfig.EVENT_DB_PORT === 5432
    ? 5434
    : parsedConfig.EVENT_DB_PORT;

export const config = {
  ...parsedConfig,
  EVENT_DB_HOST: resolvedEventDbHost,
  EVENT_DB_PORT: resolvedEventDbPort
};
