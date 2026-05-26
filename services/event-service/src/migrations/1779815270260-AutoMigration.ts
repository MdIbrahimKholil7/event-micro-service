import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1779815270260 implements MigrationInterface {
    name = 'AutoMigration1779815270260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "reserved_seats" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "events" ADD "sold_seats" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "total_seats" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "available_seats" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "available_seats" SET DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "total_seats" SET DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "sold_seats"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "reserved_seats"`);
    }

}
