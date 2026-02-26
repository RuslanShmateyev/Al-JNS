import { MigrationInterface, QueryRunner } from "typeorm";

export class TelegramId1772080442591 implements MigrationInterface {
    name = 'TelegramId1772080442591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "telegramId" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_df18d17f84763558ac84192c754" UNIQUE ("telegramId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_df18d17f84763558ac84192c754"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "telegramId"`);
    }

}
