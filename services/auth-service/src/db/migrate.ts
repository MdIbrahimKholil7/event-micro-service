import { migrate } from "drizzle-orm/node-postgres/migrator";
import { authPool, db } from "./client";

const run = async () => {
  await migrate(db, { migrationsFolder: "./drizzle" });
  await authPool.end();
};

run().catch(async (err) => {
  console.error("Auth migration failed", err);
  await authPool.end();
  process.exit(1);
});
