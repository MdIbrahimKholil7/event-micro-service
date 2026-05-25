import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AuthRepository } from "../repositories/auth.repository";

type AuthRole = "user" | "organizer" | "admin";

export class AuthService {
  private readonly repo = new AuthRepository();
  private readonly accessTokenTtl = config.JWT_ACCESS_TTL as jwt.SignOptions["expiresIn"];
  private readonly refreshTokenTtl = config.JWT_REFRESH_TTL as jwt.SignOptions["expiresIn"];

  public async register(payload: { email: string; password: string; role?: AuthRole }) {
    const passwordHash = await bcrypt.hash(payload.password, config.BCRYPT_ROUNDS);
      console.log("Registering user with email:", payload.email); // Debug log
    const created = await this.repo.createUser({
      email: payload.email.toLowerCase(),
      passwordHash,
      role: payload.role ?? "user"
    });

    return created;
  }

  public async login(payload: { email: string; password: string }) {
    const user = await this.repo.findUserByEmail(payload.email.toLowerCase());

    if (!user || !user.isActive) {
      return null;
    }

    const ok = await bcrypt.compare(payload.password, user.passwordHash);
    if (!ok) {
      return null;
    }

    const accessToken = jwt.sign({ sub: user.id, email: user.email, role: user.role }, config.JWT_ACCESS_SECRET, {
      expiresIn: this.accessTokenTtl
    });
    const refreshToken = jwt.sign({ sub: user.id }, config.JWT_REFRESH_SECRET, { expiresIn: this.refreshTokenTtl });

    await this.repo.saveRefreshToken(refreshToken, user.id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    return { accessToken, refreshToken };
  }

  public async refreshAccessToken(refreshToken: string) {
    try {
      jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
    } catch {
      await this.repo.deleteRefreshToken(refreshToken);
      return null;
    }

    const saved = await this.repo.findValidRefreshToken(refreshToken);
    if (!saved) {
      return null;
    }

    const user = await this.repo.findUserById(saved.userId);
    if (!user || !user.isActive) {
      return null;
    }

    const accessToken = jwt.sign({ sub: user.id, email: user.email, role: user.role }, config.JWT_ACCESS_SECRET, {
      expiresIn: this.accessTokenTtl
    });

    return { accessToken };
  }

  public async logout(refreshToken: string) {
    await this.repo.deleteRefreshToken(refreshToken);
  }
}
