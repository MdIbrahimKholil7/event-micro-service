import "reflect-metadata";
import { DataSource } from "typeorm";
import { EventEntity } from "../entities/event.entity";
import { config } from "../config";

const isTsRuntime = __filename.endsWith(".ts");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.EVENT_DB_HOST,
  port: config.EVENT_DB_PORT,
  username: config.EVENT_DB_USER,
  password: config.EVENT_DB_PASSWORD,
  database: config.EVENT_DB_NAME,
  entities: [EventEntity],
  migrations: [isTsRuntime ? "src/migrations/*.ts" : "dist/migrations/*.js"],
  synchronize: false,
  logging: false
});
