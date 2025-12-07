import { MigrationInterface, QueryRunner } from "typeorm";

export class Time1765117778418 implements MigrationInterface {
    name = 'Time1765117778418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isverified"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isverified" boolean NOT NULL DEFAULT false`);
    }

}
