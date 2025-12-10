import { MigrationInterface, QueryRunner } from "typeorm";

export class Time1765360013890 implements MigrationInterface {
    name = 'Time1765360013890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."permission_name_enum" RENAME TO "permission_name_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."permission_name_enum" AS ENUM('edit', 'view', 'delete', 'admin:view', 'admin:add', 'admin:edit', 'admin:delete', 'font:upload')`);
        await queryRunner.query(`ALTER TABLE "permission" ALTER COLUMN "name" TYPE "public"."permission_name_enum" USING "name"::"text"::"public"."permission_name_enum"`);
        await queryRunner.query(`DROP TYPE "public"."permission_name_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."permission_name_enum_old" AS ENUM('edit', 'view', 'delete', 'admin:view', 'admin:add', 'admin:edit', 'admin:delete')`);
        await queryRunner.query(`ALTER TABLE "permission" ALTER COLUMN "name" TYPE "public"."permission_name_enum_old" USING "name"::"text"::"public"."permission_name_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."permission_name_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."permission_name_enum_old" RENAME TO "permission_name_enum"`);
    }

}
