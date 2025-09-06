import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBaseEntityRelations1757180371184 implements MigrationInterface {
    name = 'UpdateBaseEntityRelations1757180371184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "project" ADD "updatedById" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedById" uuid`);
        await queryRunner.query(`ALTER TABLE "task" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "task" ADD "updatedById" uuid`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_678acfe7017fe8a25fe7cae5f18" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_dfdad0cd83b31ccb2204f3dc688" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_45c0d39d1f9ceeb56942db93cc5" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_db5173f7d27aa8a98a9fe6113df" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_c4e89b2a663dddc89aaedb46ed8" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_c4e89b2a663dddc89aaedb46ed8"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_db5173f7d27aa8a98a9fe6113df"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_45c0d39d1f9ceeb56942db93cc5"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_dfdad0cd83b31ccb2204f3dc688"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_678acfe7017fe8a25fe7cae5f18"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "updatedById"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedById"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "updatedById"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "createdBy" character varying(299) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdBy" character varying(299) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD "createdBy" character varying(299) NOT NULL`);
    }

}
