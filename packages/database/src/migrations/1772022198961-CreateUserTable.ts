import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1772022198961 implements MigrationInterface {
    name = 'CreateUserTable1772022198961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
