import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export class AuthMiddleware {
  public static requireAuth(req: Request, res: Response, next: NextFunction): Response | void {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing bearer token" });
    }

    try {
      const token = authHeader.slice(7);
      const payload = jwt.verify(token, config.JWT_ACCESS_SECRET);
      (req as Request & { user?: unknown }).user = payload;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
}
