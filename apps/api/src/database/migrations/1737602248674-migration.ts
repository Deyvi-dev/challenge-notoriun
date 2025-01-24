import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737602248674 implements MigrationInterface {
  name = 'Migration1737602248674';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying NOT NULL, "cnpj" character varying, "cep" character varying, "state" character varying, "city" character varying, "neighborhood" character varying, "address" character varying, "number" character varying, "complement" character varying, "latitude" character varying, "longitude" character varying, "emailVerified" boolean NOT NULL DEFAULT false, "verificationCode" character varying, "verificationCodeExpiresAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
