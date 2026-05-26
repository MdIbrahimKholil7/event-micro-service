import { AppDataSource } from "./db/data-source";
import { PaymentServiceApp } from "./app";
import { config } from "./config";
import { connectPaymentKafka, disconnectPaymentKafka, ensurePaymentTopics } from "./kafka/client";
import { startPaymentConsumers } from "./kafka/consumer";
import logger from "./utils/logger";

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations();
    await ensurePaymentTopics();
    await connectPaymentKafka();
    await startPaymentConsumers();

    const app = new PaymentServiceApp().setup();
    app.listen(config.PAYMENT_SERVICE_PORT, () => {
      logger.info({ port: config.PAYMENT_SERVICE_PORT }, "Payment service started");
    });
  })
  .catch(async (err) => {
    logger.error({ err }, "Failed to initialize payment service");
    await disconnectPaymentKafka().catch(() => undefined);
    process.exit(1);
  });
