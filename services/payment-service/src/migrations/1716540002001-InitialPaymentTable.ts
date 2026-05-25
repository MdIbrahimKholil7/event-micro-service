import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialPaymentTable1716540002001 implements MigrationInterface {
  name = "InitialPaymentTable1716540002001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id varchar(100) NOT NULL,
        amount numeric(12,2) NOT NULL,
        currency varchar(10) NOT NULL DEFAULT 'USD',
        status varchar(20) NOT NULL DEFAULT 'PENDING',
        provider varchar(50) NOT NULL DEFAULT 'mock',
        transaction_ref varchar(100),
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS payments");
  }
}
