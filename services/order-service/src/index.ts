import { AppDataSource } from "./db/data-source";
import { OrderServiceApp } from "./app";
import { config } from "./config";
import logger from "./utils/logger";

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations();
    const app = new OrderServiceApp().setup();
    app.listen(config.ORDER_SERVICE_PORT, () => {
      logger.info({ port: config.ORDER_SERVICE_PORT }, "Order service started");
    });
  })
  .catch((err) => {
    logger.error({ err }, "Failed to initialize order service");
    process.exit(1);
  });
