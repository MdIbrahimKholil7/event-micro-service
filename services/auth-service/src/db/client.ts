import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { authDbUrl } from "../config";

export const authPool = new Pool({ connectionString: authDbUrl });
export const db = drizzle(authPool);
