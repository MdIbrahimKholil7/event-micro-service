import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { envSchema } from "../validators/env.validator";

const candidatePaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../../.env"),
  path.resolve(process.cwd(), "../../../.env"),
  path.resolve(__dirname, "../../../../.env")
];

const envPath = candidatePaths.find((p) => fs.existsSync(p));
if (envPath) {
  dotenv.config({ path: envPath });
}

export const config = envSchema.parse(process.env);
