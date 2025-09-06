import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectStatus1757189880117 implements MigrationInterface {
    name = 'AddProjectStatus1757189880117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."project_status_enum" AS ENUM('open', 'finished', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "project" ADD "status" "public"."project_status_enum" NOT NULL DEFAULT 'open'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."project_status_enum"`);
    }

}
