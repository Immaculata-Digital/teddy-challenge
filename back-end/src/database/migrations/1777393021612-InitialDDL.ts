import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDDL1777393021612 implements MigrationInterface {
    name = 'InitialDDL1777393021612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "seqid" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" uuid, "full_name" character varying(200) NOT NULL, "email" character varying(254) NOT NULL, "password_hash" character varying(72) NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_5f5a72440db7181443b25492b62" PRIMARY KEY ("uuid", "seqid"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "seqid" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" uuid, "name" character varying(100) NOT NULL, "salary" numeric(15,2) NOT NULL, "company_value" numeric(15,2) NOT NULL, CONSTRAINT "PK_0fc75ceab3d78e299769ba01c52" PRIMARY KEY ("uuid", "seqid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
