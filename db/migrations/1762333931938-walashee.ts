import { MigrationInterface, QueryRunner } from "typeorm";

export class Walashee1762333931938 implements MigrationInterface {
    name = 'Walashee1762333931938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_identities\` ADD \`identificationType\` enum ('id', 'passport') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` ADD \`passportNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` ADD UNIQUE INDEX \`IDX_3ff2dd1d856f5706a053fc2d78\` (\`passportNumber\`)`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` ADD \`familyName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` ADD \`dateOfEnd\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_emails\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`countries\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_phones\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`password_reset_codes\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_passports\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` ADD UNIQUE INDEX \`IDX_fca15455bce6d35321c65b64c5\` (\`idNumber\`)`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` DROP COLUMN \`dateOfBirth\``);
        await queryRunner.query(`ALTER TABLE \`user_identities\` ADD \`dateOfBirth\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` DROP COLUMN \`gender\``);
        await queryRunner.query(`ALTER TABLE \`user_identities\` ADD \`gender\` enum ('male', 'female') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` DROP COLUMN \`dateOfIssue\``);
        await queryRunner.query(`ALTER TABLE \`user_identities\` ADD \`dateOfIssue\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`access_tokens\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`locations\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`companies\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacts\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`verification_codes\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`verification_codes\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacts\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`companies\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`locations\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`access_tokens\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` DROP COLUMN \`dateOfIssue\``);
        await queryRunner.query(`ALTER TABLE \`user_identities\` ADD \`dateOfIssue\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` DROP COLUMN \`gender\``);
        await queryRunner.query(`ALTER TABLE \`user_identities\` ADD \`gender\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` DROP COLUMN \`dateOfBirth\``);
        await queryRunner.query(`ALTER TABLE \`user_identities\` ADD \`dateOfBirth\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` DROP INDEX \`IDX_fca15455bce6d35321c65b64c5\``);
        await queryRunner.query(`ALTER TABLE \`user_identities\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_passports\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`password_reset_codes\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_phones\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`countries\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_emails\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` DROP COLUMN \`dateOfEnd\``);
        await queryRunner.query(`ALTER TABLE \`user_identities\` DROP COLUMN \`familyName\``);
        await queryRunner.query(`ALTER TABLE \`user_identities\` DROP INDEX \`IDX_3ff2dd1d856f5706a053fc2d78\``);
        await queryRunner.query(`ALTER TABLE \`user_identities\` DROP COLUMN \`passportNumber\``);
        await queryRunner.query(`ALTER TABLE \`user_identities\` DROP COLUMN \`identificationType\``);
    }

}
