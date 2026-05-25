import { Router } from "express";
import { AuthService } from "../services/auth.service";
import { loginSchema, refreshSchema, registerSchema } from "../validators/auth.validator";

const authService = new AuthService();
export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  console.log("Received registration request with body:", req.body); // Debug log
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.flatten() });
  }

  try {
    const created = await authService.register(parsed.data);
    return res.status(201).json(created);
  } catch {
    return res.status(409).json({ message: "Email already exists" });
  }
});

authRouter.post("/login", async (req, res) => {
  console.log("Received login request with body:", req.body); // Debug log
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.flatten() });
  }

  const tokens = await authService.login(parsed.data);
  if (!tokens) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json(tokens);
});

authRouter.post("/refresh", async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.flatten() });
  }

  const token = await authService.refreshAccessToken(parsed.data.refreshToken);
  if (!token) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  return res.json(token);
});

authRouter.post("/logout", async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (parsed.success) {
    await authService.logout(parsed.data.refreshToken);
  }
  return res.status(204).send();
});
