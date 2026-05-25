import { Router } from "express";
import { AppDataSource } from "../db/data-source";

export const healthRouter = Router();

healthRouter.get("/health", async (_req, res) => {
  await AppDataSource.query("SELECT 1");
  res.json({ service: "event-service", status: "ok", timestamp: new Date().toISOString() });
});
