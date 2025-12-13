import { MigrationInterface, QueryRunner } from "typeorm";

export class Time1765535265221 implements MigrationInterface {
    name = 'Time1765535265221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "stripePaymentId" character varying NOT NULL, "status" character varying NOT NULL, "amount" numeric NOT NULL, "userId" integer NOT NULL, "fontId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_9d536da2ba30a7be861813a1e54" FOREIGN KEY ("fontId") REFERENCES "font"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_9d536da2ba30a7be861813a1e54"`);
        await queryRunner.query(`DROP TABLE "payment"`);
    }

}
