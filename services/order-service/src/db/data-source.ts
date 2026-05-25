import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "../config";
import { OrderEntity } from "../entities/order.entity";

const isTsRuntime = __filename.endsWith(".ts");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.ORDER_DB_HOST,
  port: config.ORDER_DB_PORT,
  username: config.ORDER_DB_USER,
  password: config.ORDER_DB_PASSWORD,
  database: config.ORDER_DB_NAME,
  entities: [OrderEntity],
  migrations: [isTsRuntime ? "src/migrations/*.ts" : "dist/migrations/*.js"],
  synchronize: false,
  logging: false
});
