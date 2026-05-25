import crypto from "node:crypto";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { config } from "./config";
import { healthRouter } from "./routes/health.route";
import logger from "./utils/logger";
import { proxyServices } from "./utils/service-proxy";

export class ApiGatewayApp {
  public readonly app = express();

  public setup(): express.Application {
    this.setupCoreMiddlewares();
    this.setupRoutes();
    this.setupErrorHandler();
    return this.app;
  }

  private setupCoreMiddlewares(): void {
    this.app.use((req, res, next) => {
      const correlationId = (req.headers["x-correlation-id"] as string) || crypto.randomUUID();
      const start = Date.now();
      (req as Request & { correlationId?: string }).correlationId = correlationId;
      res.setHeader("x-correlation-id", correlationId);

      res.on("finish", () => {
        logger.info("HTTP request", {
          correlationId,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          durationMs: Date.now() - start
        });
      });

      next();
    });

    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json({ limit: "1mb" }));
    this.app.use(
      rateLimit({
        windowMs: config.RATE_LIMIT_WINDOW_MS,
        limit: config.RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false
      })
    );
  }

  private setupRoutes(): void {
    this.app.use("/", healthRouter);
    proxyServices(this.app);
  }

  private setupErrorHandler(): void {
    this.app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
      logger.error("Unhandled gateway error", {
        error: err.message,
        stack: err.stack,
        correlationId: (req as Request & { correlationId?: string }).correlationId
      });
      res.status(500).json({ message: "Internal server error" });
    });
  }
}
