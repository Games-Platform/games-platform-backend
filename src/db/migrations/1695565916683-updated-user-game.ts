import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedUserGame1695565916683 implements MigrationInterface {
  name = 'UpdatedUserGame1695565916683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game" ADD "released" character varying DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "released"`);
  }
}
