import { AppDataSource } from "./db/data-source";
import { PaymentServiceApp } from "./app";
import { config } from "./config";
import logger from "./utils/logger";

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations();
    const app = new PaymentServiceApp().setup();
    app.listen(config.PAYMENT_SERVICE_PORT, () => {
      logger.info({ port: config.PAYMENT_SERVICE_PORT }, "Payment service started");
    });
  })
  .catch((err) => {
    logger.error({ err }, "Failed to initialize payment service");
    process.exit(1);
  });
