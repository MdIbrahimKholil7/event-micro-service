import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "../config";
import { PaymentEntity } from "../entities/payment.entity";

const isTsRuntime = __filename.endsWith(".ts");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.PAYMENT_DB_HOST,
  port: config.PAYMENT_DB_PORT,
  username: config.PAYMENT_DB_USER,
  password: config.PAYMENT_DB_PASSWORD,
  database: config.PAYMENT_DB_NAME,
  entities: [PaymentEntity],
  migrations: [isTsRuntime ? "src/migrations/*.ts" : "dist/migrations/*.js"],
  synchronize: false,
  logging: false
});
