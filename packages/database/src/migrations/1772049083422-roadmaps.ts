import { MigrationInterface, QueryRunner } from "typeorm";

export class Roadmaps1772049083422 implements MigrationInterface {
    name = 'Roadmaps1772049083422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roadmaps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "nodes" character varying NOT NULL, "userid" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9b0d527f9c64d15405c21e7ca54" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "roadmaps"`);
    }

}
