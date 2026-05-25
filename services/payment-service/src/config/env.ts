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

export const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PAYMENT_SERVICE_PORT: z.coerce.number().default(3004),
  PAYMENT_DB_HOST: z.string(),
  PAYMENT_DB_PORT: z.coerce.number().default(5432),
  PAYMENT_DB_NAME: z.string(),
  PAYMENT_DB_USER: z.string(),
  PAYMENT_DB_PASSWORD: z.string()
});

export const config = envSchema.parse(process.env);
