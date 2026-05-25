import { and, eq, gt } from "drizzle-orm";
import { db } from "../db/client";
import { refreshTokens, users } from "../db/schema";

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  role: "user" | "organizer" | "admin";
}

export class AuthRepository {
  public async createUser(input: CreateUserInput) {
    const [created] = await db
      .insert(users)
      .values(input)
      .returning({ id: users.id, email: users.email, role: users.role, createdAt: users.createdAt });

    return created;
  }

  public async findUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user ?? null;
  }

  public async findUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user ?? null;
  }

  public async saveRefreshToken(token: string, userId: string, expiresAt: Date) {
    await db.insert(refreshTokens).values({ token, userId, expiresAt });
  }

  public async findValidRefreshToken(token: string) {
    const [saved] = await db
      .select()
      .from(refreshTokens)
      .where(and(eq(refreshTokens.token, token), gt(refreshTokens.expiresAt, new Date())))
      .limit(1);

    return saved ?? null;
  }

  public async deleteRefreshToken(token: string) {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
  }
}
