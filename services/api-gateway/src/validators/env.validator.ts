import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  API_GATEWAY_PORT: z.coerce.number().default(3000),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(120),
  JWT_ACCESS_SECRET: z.string().min(16),
  DEFAULT_TIMEOUT: z.coerce.number().default(5000),
  AUTH_SERVICE_URL: z.string().url(),
  EVENT_SERVICE_URL: z.string().url(),
  ACCOUNTS_SERVICE_URL: z.string().url().optional(),
  TRANSACTION_SERVICE_URL: z.string().url().optional()
});

export type EnvConfig = z.infer<typeof envSchema>;
