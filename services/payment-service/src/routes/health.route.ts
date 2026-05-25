import { Router } from "express";
import { AppDataSource } from "../db/data-source";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  await AppDataSource.query("SELECT 1");
  res.json({ service: "payment-service", status: "ok", timestamp: new Date().toISOString() });
});
