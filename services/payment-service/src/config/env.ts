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
  path.resolve(process.cwd(), "services/payment-service/.env.local")
];
const localEnvPath = localOverridePaths.find((p) => fs.existsSync(p));
if (localEnvPath) dotenv.config({ path: localEnvPath, override: true });

export const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PAYMENT_SERVICE_PORT: z.coerce.number().default(3004),
  PAYMENT_DB_HOST: z.string(),
  PAYMENT_DB_PORT: z.coerce.number().default(5432),
  PAYMENT_DB_NAME: z.string(),
  PAYMENT_DB_USER: z.string(),
  PAYMENT_DB_PASSWORD: z.string(),
  KAFKA_BROKER: z.string().default("kafka:9092")
});

const parsedConfig = envSchema.parse(process.env);
const isRunningInDocker = fs.existsSync("/.dockerenv");
const resolvedPaymentDbHost =
  !isRunningInDocker && parsedConfig.PAYMENT_DB_HOST === "postgres-payment"
    ? "localhost"
    : parsedConfig.PAYMENT_DB_HOST;
const resolvedPaymentDbPort =
  !isRunningInDocker && parsedConfig.PAYMENT_DB_HOST === "postgres-payment" && parsedConfig.PAYMENT_DB_PORT === 5432
    ? 5436
    : parsedConfig.PAYMENT_DB_PORT;

export const config = {
  ...parsedConfig,
  PAYMENT_DB_HOST: resolvedPaymentDbHost,
  PAYMENT_DB_PORT: resolvedPaymentDbPort
};
