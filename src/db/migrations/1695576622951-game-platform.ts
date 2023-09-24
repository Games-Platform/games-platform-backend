import { MigrationInterface, QueryRunner } from 'typeorm';

export class GamePlatform1695576622951 implements MigrationInterface {
  name = 'GamePlatform1695576622951';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game_platform" ("id" SERIAL NOT NULL, "platform" character varying, CONSTRAINT "PK_dd6046a3ad8469784c0ac5d0b8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game_game_platforms_game_platform" ("gameId" bigint NOT NULL, "gamePlatformId" integer NOT NULL, CONSTRAINT "PK_54f8543109c189df6c649cc486e" PRIMARY KEY ("gameId", "gamePlatformId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b86184a76aeb24b9b4be76f79e" ON "game_game_platforms_game_platform" ("gameId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c84936cc7c09c71797e62b265b" ON "game_game_platforms_game_platform" ("gamePlatformId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "game_game_platforms_game_platform" ADD CONSTRAINT "FK_b86184a76aeb24b9b4be76f79e8" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_game_platforms_game_platform" ADD CONSTRAINT "FK_c84936cc7c09c71797e62b265be" FOREIGN KEY ("gamePlatformId") REFERENCES "game_platform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game_game_platforms_game_platform" DROP CONSTRAINT "FK_c84936cc7c09c71797e62b265be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_game_platforms_game_platform" DROP CONSTRAINT "FK_b86184a76aeb24b9b4be76f79e8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c84936cc7c09c71797e62b265b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b86184a76aeb24b9b4be76f79e"`,
    );
    await queryRunner.query(`DROP TABLE "game_game_platforms_game_platform"`);
    await queryRunner.query(`DROP TABLE "game_platform"`);
  }
}
