import { AppDataSource } from "./db/data-source";
import { EventServiceApp } from "./app";
import { config } from "./config";
import { connectEventKafka, disconnectEventKafka, ensureEventTopics } from "./kafka/client";
import { startEventConsumers } from "./kafka/consumer";
import logger from "./utils/logger";

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations();
    await ensureEventTopics();
    await connectEventKafka();
    await startEventConsumers();

    const app = new EventServiceApp().setup();
    app.listen(config.EVENT_SERVICE_PORT, () => {
      logger.info({ port: config.EVENT_SERVICE_PORT }, "Event service started");
    });
  })
  .catch(async (err) => {
    logger.error({ err }, "Failed to initialize event service");
    await disconnectEventKafka().catch(() => undefined);
    process.exit(1);
  });
