import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialEventTable1716540000001 implements MigrationInterface {
  name = "InitialEventTable1716540000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title varchar(255) NOT NULL,
        description text,
        location varchar(255) NOT NULL,
        starts_at timestamptz NOT NULL,
        ends_at timestamptz NOT NULL,
        organizer_id varchar(100) NOT NULL,
        published boolean NOT NULL DEFAULT false,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE IF EXISTS events");
  }
}
