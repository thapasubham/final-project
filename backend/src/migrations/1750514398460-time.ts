import { MigrationInterface, QueryRunner } from "typeorm";

export class Time1750514398460 implements MigrationInterface {
    name = 'Time1750514398460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "font" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "fileName" character varying NOT NULL, CONSTRAINT "UQ_62eaa70573ceb48cbbc6a1f8f71" UNIQUE ("name"), CONSTRAINT "PK_3467693ce075493cfbab9f6f8be" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "font"`);
    }

}
