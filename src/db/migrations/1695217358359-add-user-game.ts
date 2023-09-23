import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserGame1695217358359 implements MigrationInterface {
  name = 'AddUserGame1695217358359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_game" ("id" SERIAL NOT NULL, "rating" integer, "status" integer NOT NULL DEFAULT '0', "userId" bigint, "gameId" bigint, CONSTRAINT "PK_4ad0dcdcd6b1d348407ae324fd0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_game" ADD CONSTRAINT "FK_1786ddc11e6e542cd0cd1998b8d" FOREIGN KEY ("userId") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_game" ADD CONSTRAINT "FK_efca7c34243bd941b730135e2c0" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_game" DROP CONSTRAINT "FK_efca7c34243bd941b730135e2c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_game" DROP CONSTRAINT "FK_1786ddc11e6e542cd0cd1998b8d"`,
    );
    await queryRunner.query(`DROP TABLE "user_game"`);
  }
}
