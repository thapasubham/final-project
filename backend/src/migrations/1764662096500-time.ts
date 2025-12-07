import { MigrationInterface, QueryRunner } from "typeorm";

export class Time1764662096500 implements MigrationInterface {
    name = 'Time1764662096500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "font" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "fileName" character varying NOT NULL, CONSTRAINT "UQ_62eaa70573ceb48cbbc6a1f8f71" UNIQUE ("name"), CONSTRAINT "PK_3467693ce075493cfbab9f6f8be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "language" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_7df7d1e250ea2a416f078a631fb" UNIQUE ("name"), CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "font_langs_language" ("fontId" integer NOT NULL, "languageId" integer NOT NULL, CONSTRAINT "PK_67782485d1e26cc9210cad9d63e" PRIMARY KEY ("fontId", "languageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_284e407f9e25319f1813b8a019" ON "font_langs_language" ("fontId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3004464eef189fd0928d1aaeea" ON "font_langs_language" ("languageId") `);
        await queryRunner.query(`ALTER TABLE "font_langs_language" ADD CONSTRAINT "FK_284e407f9e25319f1813b8a019e" FOREIGN KEY ("fontId") REFERENCES "font"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "font_langs_language" ADD CONSTRAINT "FK_3004464eef189fd0928d1aaeea0" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "font_langs_language" DROP CONSTRAINT "FK_3004464eef189fd0928d1aaeea0"`);
        await queryRunner.query(`ALTER TABLE "font_langs_language" DROP CONSTRAINT "FK_284e407f9e25319f1813b8a019e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3004464eef189fd0928d1aaeea"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_284e407f9e25319f1813b8a019"`);
        await queryRunner.query(`DROP TABLE "font_langs_language"`);
        await queryRunner.query(`DROP TABLE "language"`);
        await queryRunner.query(`DROP TABLE "font"`);
    }

}
