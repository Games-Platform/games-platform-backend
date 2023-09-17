import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1694977604205 implements MigrationInterface {
  name = 'Init1694977604205';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game" ("id" BIGSERIAL NOT NULL, "game_id" character varying NOT NULL DEFAULT '', "background_image" character varying NOT NULL DEFAULT '', "metacritic" integer NOT NULL DEFAULT '0', "name" character varying NOT NULL DEFAULT '', "games_platform_rating" integer NOT NULL DEFAULT '0', "rating_votes" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("user_id" BIGSERIAL NOT NULL, "username" character varying NOT NULL DEFAULT '', "email_address" character varying NOT NULL DEFAULT '', "password" character varying DEFAULT '', CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "game"`);
  }
}
