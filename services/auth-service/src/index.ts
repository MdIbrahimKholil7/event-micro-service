import path from "node:path";
import fs from "node:fs/promises";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { authPool, db } from "./db/client";
import { AuthServiceApp } from "./app";
import { config } from "./config";
import logger from "./utils/logger";

const start = async () => {
  const migrationsFolder = path.resolve(__dirname, "../drizzle");
  try {
    await migrate(db, { migrationsFolder });
  } catch (error) {
    const err = error as Error;
    if (!err.message.includes("meta/_journal.json")) {
      throw error;
    }

    logger.warn(
      { migrationsFolder },
      "Drizzle journal missing in runtime image. Falling back to bootstrap SQL."
    );
    const bootstrapSqlPath = path.resolve(migrationsFolder, "0000_initial.sql");
    const bootstrapSql = await fs.readFile(bootstrapSqlPath, "utf8");
    await authPool.query(bootstrapSql);
  }

  const app = new AuthServiceApp().setup();
  app.listen(config.AUTH_SERVICE_PORT, () => {
    logger.info({ port: config.AUTH_SERVICE_PORT }, "Auth service started");
  });
};

start().catch(async (err) => {
  logger.error({ err }, "Failed to initialize auth service");
  await authPool.end();
  process.exit(1);
});
