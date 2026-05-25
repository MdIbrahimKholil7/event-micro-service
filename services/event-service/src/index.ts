import { AppDataSource } from "./db/data-source";
import { EventServiceApp } from "./app";
import { config } from "./config";
import logger from "./utils/logger";

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations();
    const app = new EventServiceApp().setup();
    app.listen(config.EVENT_SERVICE_PORT, () => {
      logger.info({ port: config.EVENT_SERVICE_PORT }, "Event service started");
    });
  })
  .catch((err) => {
    logger.error({ err }, "Failed to initialize event service");
    process.exit(1);
  });
