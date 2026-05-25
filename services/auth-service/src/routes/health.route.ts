import { Router } from "express";
import { authPool } from "../db/client";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  await authPool.query("SELECT 1");
  res.json({ service: "auth-service", status: "ok", timestamp: new Date().toISOString() });
});
