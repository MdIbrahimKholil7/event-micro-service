import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json({ service: "api-gateway", status: "ok", timestamp: new Date().toISOString() });
});
