import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedNativeRelations1754775369504 implements MigrationInterface {
    name = 'AddedNativeRelations1754775369504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_members" ("projectId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_326b2a901eb18ac24eabc9b0581" PRIMARY KEY ("projectId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d19892d8f03928e5bfc7313780" ON "project_members" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_08d1346ff91abba68e5a637cfd" ON "project_members" ("userId") `);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "projectId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "assigneeId"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "assigneeId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "ownerId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_7384988f7eeb777e44802a0baca" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_members" ADD CONSTRAINT "FK_d19892d8f03928e5bfc7313780c" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_members" ADD CONSTRAINT "FK_08d1346ff91abba68e5a637cfdb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_members" DROP CONSTRAINT "FK_08d1346ff91abba68e5a637cfdb"`);
        await queryRunner.query(`ALTER TABLE "project_members" DROP CONSTRAINT "FK_d19892d8f03928e5bfc7313780c"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_7384988f7eeb777e44802a0baca"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "project" ADD "ownerId" character varying(300) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "assigneeId"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "assigneeId" character varying(300) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "projectId" character varying(300) NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08d1346ff91abba68e5a637cfd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d19892d8f03928e5bfc7313780"`);
        await queryRunner.query(`DROP TABLE "project_members"`);
    }

}
