import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrationsusers1772075449478 implements MigrationInterface {
    name = 'Migrationsusers1772075449478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roadmaps" RENAME COLUMN "userid" TO "authorId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "authorId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roadmaps" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "roadmaps" ADD "authorId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "roadmaps" ADD CONSTRAINT "FK_780081ac67112cbac86a2078d62" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_b455b2f078b9a28bda8e7b3696a" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_b455b2f078b9a28bda8e7b3696a"`);
        await queryRunner.query(`ALTER TABLE "roadmaps" DROP CONSTRAINT "FK_780081ac67112cbac86a2078d62"`);
        await queryRunner.query(`ALTER TABLE "roadmaps" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "roadmaps" ADD "authorId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "authorId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "roadmaps" RENAME COLUMN "authorId" TO "userid"`);
    }

}
