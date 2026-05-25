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

export const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  EVENT_SERVICE_PORT: z.coerce.number().default(3002),
  EVENT_DB_HOST: z.string(),
  EVENT_DB_PORT: z.coerce.number().default(5432),
  EVENT_DB_NAME: z.string(),
  EVENT_DB_USER: z.string(),
  EVENT_DB_PASSWORD: z.string()
});

export const config = envSchema.parse(process.env);
