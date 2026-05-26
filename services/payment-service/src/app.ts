import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware";
import { healthRouter } from "./routes/health.route";
import { paymentRouter } from "./routes/payment.route";
import logger from "./utils/logger";

export class PaymentServiceApp {
  public readonly app = express();

  public setup(): express.Application {
    this.app.use(pinoHttp({ logger }));
    this.app.use(helmet());
    this.app.use(express.json({ limit: "1mb" }));

    this.app.use("/health", healthRouter);
    this.app.use("/", paymentRouter);
    this.app.use(notFoundMiddleware);

    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      errorMiddleware(err, req, res, next);
    });

    return this.app;
  }
}
