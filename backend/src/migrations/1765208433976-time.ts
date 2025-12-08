import { MigrationInterface, QueryRunner } from "typeorm";

export class Time1765208433976 implements MigrationInterface {
  name = "Time1765208433976";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "font" ADD "price" numeric NOT NULL DEFAULT '5'`
    );
    await queryRunner.query(`
        UPDATE "font" SET "price" = 5 WHERE "price" IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "font" DROP COLUMN "price"`);
  }
}
