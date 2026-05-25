import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialOrderTable1716540001001 implements MigrationInterface {
  name = "InitialOrderTable1716540001001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id varchar(100) NOT NULL,
        event_id varchar(100) NOT NULL,
        seat_count integer NOT NULL,
        total_amount numeric(12,2) NOT NULL,
        currency varchar(10) NOT NULL DEFAULT 'USD',
        status varchar(20) NOT NULL DEFAULT 'PENDING',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS orders");
  }
}
