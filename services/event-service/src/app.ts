import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { eventRouter } from "./routes/event.route";
import { healthRouter } from "./routes/health.route";
import logger from "./utils/logger";

export class EventServiceApp {
  public readonly app = express();

  public setup(): express.Application {
    this.app.use(pinoHttp({ logger }));
    this.app.use(helmet());
    this.app.use(express.json({ limit: "1mb" }));

    this.app.use("/", healthRouter);
    this.app.use("/", eventRouter);

    this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      logger.error({ err }, "Unhandled event-service error");
      res.status(500).json({ message: "Internal server error" });
    });

    return this.app;
  }
}
