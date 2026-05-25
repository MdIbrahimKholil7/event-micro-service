import { createLogger, format, transports } from "winston";
import { config } from "../config";

const logger = createLogger({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  format:
    config.NODE_ENV === "production"
      ? format.combine(format.timestamp(), format.errors({ stack: true }), format.json())
      : format.combine(
          format.colorize(),
          format.timestamp(),
          format.errors({ stack: true }),
          format.printf(({ timestamp, level, message, ...meta }) => {
            const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
            return `${timestamp} ${level}: ${message}${rest}`;
          })
        ),
  transports: [new transports.Console()]
});

export default logger;
