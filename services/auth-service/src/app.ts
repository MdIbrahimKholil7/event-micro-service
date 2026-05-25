import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { authRouter } from "./routes/auth.route";
import { healthRouter } from "./routes/health.route";
import logger from "./utils/logger";

export class AuthServiceApp {
  public readonly app = express();

  public setup(): express.Application {
    this.app.use(pinoHttp({ logger }));
    this.app.use(helmet());
    this.app.use(express.json({ limit: "1mb" }));

    this.app.use("/health", healthRouter);
    this.app.use("/auth", authRouter);
    
    //404 route handler
    this.app.use((_req, res) => {
      res.status(404).json({ message: "Route Not found" });
    }); 
    // Global error handler to catch any unhandled errors and log them
    this.app.use((err: Error & { code?: string; status?: number; type?: string }, _req: Request, res: Response, _next: NextFunction) => {
      if (err.code === "ECONNABORTED" || err.status === 400 || err.type === "request.aborted") {
        logger.warn({ err }, "Client aborted request before body was fully received");
        return res.status(400).json({ message: "Request body was not fully sent" });
      }

      logger.error({ err }, "Unhandled auth-service error");
      res.status(500).json({ message: "Internal server error" });
    });

    return this.app;
  }
}
