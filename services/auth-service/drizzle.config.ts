import type { Config } from "drizzle-kit";
import { authDbUrl } from "./src/env";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: authDbUrl }
} satisfies Config;
