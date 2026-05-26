import { AppDataSource } from "./db/data-source";
import { OrderServiceApp } from "./app";
import { config } from "./config";
import { connectOrderKafka, disconnectOrderKafka, ensureOrderTopics } from "./kafka/client";
import { startOrderConsumers } from "./kafka/consumer";
import logger from "./utils/logger";

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations();
    await ensureOrderTopics();
    await connectOrderKafka();
    await startOrderConsumers();

    const app = new OrderServiceApp().setup();
    app.listen(config.ORDER_SERVICE_PORT, () => {
      logger.info({ port: config.ORDER_SERVICE_PORT }, "Order service started");
    });
  })
  .catch(async (err) => {
    logger.error({ err }, "Failed to initialize order service");
    await disconnectOrderKafka().catch(() => undefined);
    process.exit(1);
  });
