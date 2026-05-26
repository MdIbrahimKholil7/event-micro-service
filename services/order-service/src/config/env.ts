import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

const candidatePaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), "../../../.env")
];
const envPath = candidatePaths.find((p) => fs.existsSync(p));
if (envPath) dotenv.config({ path: envPath });

const localOverridePaths = [
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), "services/order-service/.env.local")
];
const localEnvPath = localOverridePaths.find((p) => fs.existsSync(p));
if (localEnvPath) dotenv.config({ path: localEnvPath, override: true });

export const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  ORDER_SERVICE_PORT: z.coerce.number().default(3003),
  ORDER_DB_HOST: z.string(),
  ORDER_DB_PORT: z.coerce.number().default(5432),
  ORDER_DB_NAME: z.string(),
  ORDER_DB_USER: z.string(),
  ORDER_DB_PASSWORD: z.string(),
  KAFKA_BROKER: z.string().default("kafka:9092")
});

const parsedConfig = envSchema.parse(process.env);
const isRunningInDocker = fs.existsSync("/.dockerenv");
const resolvedOrderDbHost =
  !isRunningInDocker && parsedConfig.ORDER_DB_HOST === "postgres-order"
    ? "localhost"
    : parsedConfig.ORDER_DB_HOST;
const resolvedOrderDbPort =
  !isRunningInDocker && parsedConfig.ORDER_DB_HOST === "postgres-order" && parsedConfig.ORDER_DB_PORT === 5432
    ? 5435
    : parsedConfig.ORDER_DB_PORT;

export const config = {
  ...parsedConfig,
  ORDER_DB_HOST: resolvedOrderDbHost,
  ORDER_DB_PORT: resolvedOrderDbPort
};
