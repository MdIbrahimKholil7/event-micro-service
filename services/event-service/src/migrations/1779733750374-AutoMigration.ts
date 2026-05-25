import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1779733750374 implements MigrationInterface {
    name = 'AutoMigration1779733750374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "total_seats" integer NOT NULL DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE "events" ADD "available_seats" integer NOT NULL DEFAULT '100'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "available_seats"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "total_seats"`);
    }

}
