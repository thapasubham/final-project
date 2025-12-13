import { MigrationInterface, QueryRunner } from "typeorm";

export class Time1765619515213 implements MigrationInterface {
    name = 'Time1765619515213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_font" ("id" SERIAL NOT NULL, "purchasedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "fontId" integer, CONSTRAINT "PK_c4c2142c44a06ae9de478a0f241" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "font" ADD "created_by" integer`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_9d536da2ba30a7be861813a1e54"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "fontId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "font" ADD CONSTRAINT "FK_5cce694c148591cae62f8ebb7ec" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_font" ADD CONSTRAINT "FK_a5cc0e2d0f056a194b62b4ba205" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_font" ADD CONSTRAINT "FK_3f0181efbeb5873fc02ffd9d104" FOREIGN KEY ("fontId") REFERENCES "font"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_9d536da2ba30a7be861813a1e54" FOREIGN KEY ("fontId") REFERENCES "font"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_9d536da2ba30a7be861813a1e54"`);
        await queryRunner.query(`ALTER TABLE "user_font" DROP CONSTRAINT "FK_3f0181efbeb5873fc02ffd9d104"`);
        await queryRunner.query(`ALTER TABLE "user_font" DROP CONSTRAINT "FK_a5cc0e2d0f056a194b62b4ba205"`);
        await queryRunner.query(`ALTER TABLE "font" DROP CONSTRAINT "FK_5cce694c148591cae62f8ebb7ec"`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "fontId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_9d536da2ba30a7be861813a1e54" FOREIGN KEY ("fontId") REFERENCES "font"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "font" DROP COLUMN "created_by"`);
        await queryRunner.query(`DROP TABLE "user_font"`);
    }

}
