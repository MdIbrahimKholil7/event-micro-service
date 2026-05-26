import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error";
import logger from "../utils/logger";

export const notFoundMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpError(404, "Route not found"));
};

export const errorMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    logger.warn({ statusCode: err.statusCode, message: err.message, details: err.details }, "Handled payment-service error");
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {})
    });
  }

  logger.error({ err }, "Unhandled payment-service error");
  return res.status(500).json({ message: "Internal server error" });
};

