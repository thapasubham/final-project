import { MigrationInterface, QueryRunner } from "typeorm";

export class Time1765117179308 implements MigrationInterface {
    name = 'Time1765117179308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."permission_name_enum" AS ENUM('edit', 'view', 'delete', 'admin:view', 'admin:add', 'admin:edit', 'admin:delete')`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "name" "public"."permission_name_enum" NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying(20) NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" bigint NOT NULL, "firstname" character varying(30) NOT NULL, "lastname" character varying(30) NOT NULL, "email" character varying(30) NOT NULL, "password" character varying NOT NULL DEFAULT 'password123', "phoneNumber" character varying(10) NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "isverified" boolean NOT NULL DEFAULT false, "role_id" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `);
        await queryRunner.query(`CREATE TABLE "role_permission_permission" ("roleId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_601804d828ecf7c301022770fad" PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_be73ed38a02ea01cef07836835" ON "role_permission_permission" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1fff5824ba3354f53d4fae760c" ON "role_permission_permission" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permission_permission" ADD CONSTRAINT "FK_be73ed38a02ea01cef07836835e" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permission_permission" ADD CONSTRAINT "FK_1fff5824ba3354f53d4fae760c3" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permission_permission" DROP CONSTRAINT "FK_1fff5824ba3354f53d4fae760c3"`);
        await queryRunner.query(`ALTER TABLE "role_permission_permission" DROP CONSTRAINT "FK_be73ed38a02ea01cef07836835e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1fff5824ba3354f53d4fae760c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be73ed38a02ea01cef07836835"`);
        await queryRunner.query(`DROP TABLE "role_permission_permission"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cace4a159ff9f2512dd4237376"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TYPE "public"."permission_name_enum"`);
    }

}
