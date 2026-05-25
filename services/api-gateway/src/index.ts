import { ApiGatewayApp } from "./app";
import { config } from "./config";
import logger from "./utils/logger";

const app = new ApiGatewayApp().setup();

app.listen(config.API_GATEWAY_PORT, () => {
  logger.info("API Gateway started", { port: config.API_GATEWAY_PORT });
});
