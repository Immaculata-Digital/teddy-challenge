import { MigrationInterface, QueryRunner } from "typeorm";

export class AddViewsToClient1777405278952 implements MigrationInterface {
    name = 'AddViewsToClient1777405278952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" ADD "views" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "views"`);
    }

}
