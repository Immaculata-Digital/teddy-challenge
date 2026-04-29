import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditLogs1777405300000 implements MigrationInterface {
    name = 'CreateAuditLogs1777405300000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "audit_logs" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "action" character varying NOT NULL, "entity_name" character varying NOT NULL, "entity_uuid" uuid, "before_data" jsonb, "after_data" jsonb, "user_uuid" uuid, "ip" character varying, "origin" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_audit_logs_uuid" PRIMARY KEY ("uuid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    }
}
