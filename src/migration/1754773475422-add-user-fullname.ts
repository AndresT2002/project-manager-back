import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFullname1754773475422 implements MigrationInterface {
    name = 'AddUserFullname1754773475422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "fullName" character varying(300) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "fullName"`);
    }

}
