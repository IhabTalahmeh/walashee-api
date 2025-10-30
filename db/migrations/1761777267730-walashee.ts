import { MigrationInterface, QueryRunner } from "typeorm";

export class Walashee1761777267730 implements MigrationInterface {
    name = 'Walashee1761777267730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_emails\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`status\` enum ('verified', 'not_verified') NOT NULL DEFAULT 'not_verified', \`userId\` varchar(36) NULL, UNIQUE INDEX \`IDX_6594597afde633cfeab9a806e4\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`countries\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`iso\` varchar(10) NULL, \`iso3\` varchar(10) NULL, \`name\` varchar(128) NULL, \`nameAR\` varchar(128) NULL, \`phoneCode\` varchar(255) NULL, INDEX \`IDX_b2d7006793e8697ab3ae2deff1\` (\`id\`), UNIQUE INDEX \`IDX_a1c0d005a87cc318b4ddda4d92\` (\`iso\`), UNIQUE INDEX \`IDX_b29f9172f8b660e7834000c424\` (\`iso3\`), UNIQUE INDEX \`IDX_fa1376321185575cf2226b1491\` (\`name\`), UNIQUE INDEX \`IDX_89013841cd2e687e3d807d34f2\` (\`nameAR\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_phones\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`status\` enum ('verified', 'not_verified') NOT NULL DEFAULT 'not_verified', \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL DEFAULT '', \`gender\` enum ('male', 'female') NOT NULL, \`role\` enum ('admin', 'trader', 'driver', 'customer') NOT NULL DEFAULT 'customer', \`avatar\` varchar(255) NULL, \`languageCode\` enum ('ar', 'en') NOT NULL DEFAULT 'en', INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_passports\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`fullName\` varchar(255) NOT NULL, \`nationality\` varchar(255) NOT NULL, \`motherName\` varchar(255) NOT NULL, \`gender\` varchar(255) NOT NULL, \`dateOfBirth\` datetime NOT NULL, \`placeOfBirth\` varchar(255) NOT NULL, \`idNumber\` varchar(255) NOT NULL, \`passportNumber\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`dateOfIssue\` datetime NOT NULL, \`dateOfExpiry\` datetime NOT NULL, \`issuingAuthority\` varchar(255) NOT NULL, \`countryCode\` varchar(255) NOT NULL, INDEX \`IDX_cf6e94661c4437ead20d039dbb\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_identities\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`idNumber\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`fatherName\` varchar(255) NOT NULL, \`grandfatherName\` varchar(255) NOT NULL, \`motherName\` varchar(255) NOT NULL, \`dateOfBirth\` datetime NOT NULL, \`placeOfBirth\` varchar(255) NOT NULL, \`gender\` varchar(255) NOT NULL, \`placeOfIssue\` varchar(255) NOT NULL, \`dateOfIssue\` datetime NOT NULL, INDEX \`IDX_e23bff04e9c3e7b785e442b262\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`access_tokens\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`blacklisted\` tinyint NOT NULL DEFAULT 0, \`expired\` tinyint NOT NULL DEFAULT 0, \`userId\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NOT NULL, INDEX \`IDX_65140f59763ff994a025248816\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`locations\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`latitude\` decimal(9,6) NOT NULL, \`longitude\` decimal(9,6) NOT NULL, INDEX \`IDX_7cc1c9e3853b94816c094825e7\` (\`id\`), INDEX \`IDX_f81075bcc6ed548247c1a33347\` (\`latitude\`, \`longitude\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`contacts\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`website\` varchar(255) NULL, \`countryId\` varchar(36) NOT NULL, INDEX \`IDX_b99cd40cfd66a99f1571f4f72e\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`companies\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`nameAR\` varchar(255) NOT NULL, \`nameEN\` varchar(255) NOT NULL, \`info\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`addresses\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`address1\` varchar(255) NOT NULL, \`address2\` varchar(255) NULL, \`city\` varchar(255) NULL, \`street\` varchar(255) NULL, \`postalCode\` varchar(255) NULL, INDEX \`IDX_745d8f43d3af10ab8247465e45\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`verification_codes\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`type\` enum ('email', 'mobile') NOT NULL, \`expiresAt\` datetime NOT NULL, \`emailId\` varchar(36) NULL, \`phoneId\` varchar(36) NULL, INDEX \`IDX_18741b6b8bf1680dbf5057421d\` (\`id\`), UNIQUE INDEX \`REL_f0a55af8dd9a1596b253b28af6\` (\`emailId\`), UNIQUE INDEX \`REL_d86c16728b320188b3040d6f5b\` (\`phoneId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`password_reset_codes\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`expiresAt\` datetime NOT NULL, \`userId\` varchar(36) NULL, INDEX \`IDX_f3a88f7bc4536c53f2b277a0b5\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_emails\` ADD CONSTRAINT \`FK_569342223a28f006d9bf897c7c9\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_phones\` ADD CONSTRAINT \`FK_4615e35b764e3aa70adfaad6d2f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contacts\` ADD CONSTRAINT \`FK_37c7a529302085865a7167a053e\` FOREIGN KEY (\`countryId\`) REFERENCES \`countries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`verification_codes\` ADD CONSTRAINT \`FK_f0a55af8dd9a1596b253b28af68\` FOREIGN KEY (\`emailId\`) REFERENCES \`user_emails\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`verification_codes\` ADD CONSTRAINT \`FK_d86c16728b320188b3040d6f5b8\` FOREIGN KEY (\`phoneId\`) REFERENCES \`user_phones\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`password_reset_codes\` ADD CONSTRAINT \`FK_9c30b1d4c6199fd152c128dbd37\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`password_reset_codes\` DROP FOREIGN KEY \`FK_9c30b1d4c6199fd152c128dbd37\``);
        await queryRunner.query(`ALTER TABLE \`verification_codes\` DROP FOREIGN KEY \`FK_d86c16728b320188b3040d6f5b8\``);
        await queryRunner.query(`ALTER TABLE \`verification_codes\` DROP FOREIGN KEY \`FK_f0a55af8dd9a1596b253b28af68\``);
        await queryRunner.query(`ALTER TABLE \`contacts\` DROP FOREIGN KEY \`FK_37c7a529302085865a7167a053e\``);
        await queryRunner.query(`ALTER TABLE \`user_phones\` DROP FOREIGN KEY \`FK_4615e35b764e3aa70adfaad6d2f\``);
        await queryRunner.query(`ALTER TABLE \`user_emails\` DROP FOREIGN KEY \`FK_569342223a28f006d9bf897c7c9\``);
        await queryRunner.query(`DROP INDEX \`IDX_f3a88f7bc4536c53f2b277a0b5\` ON \`password_reset_codes\``);
        await queryRunner.query(`DROP TABLE \`password_reset_codes\``);
        await queryRunner.query(`DROP INDEX \`REL_d86c16728b320188b3040d6f5b\` ON \`verification_codes\``);
        await queryRunner.query(`DROP INDEX \`REL_f0a55af8dd9a1596b253b28af6\` ON \`verification_codes\``);
        await queryRunner.query(`DROP INDEX \`IDX_18741b6b8bf1680dbf5057421d\` ON \`verification_codes\``);
        await queryRunner.query(`DROP TABLE \`verification_codes\``);
        await queryRunner.query(`DROP INDEX \`IDX_745d8f43d3af10ab8247465e45\` ON \`addresses\``);
        await queryRunner.query(`DROP TABLE \`addresses\``);
        await queryRunner.query(`DROP TABLE \`companies\``);
        await queryRunner.query(`DROP INDEX \`IDX_b99cd40cfd66a99f1571f4f72e\` ON \`contacts\``);
        await queryRunner.query(`DROP TABLE \`contacts\``);
        await queryRunner.query(`DROP INDEX \`IDX_f81075bcc6ed548247c1a33347\` ON \`locations\``);
        await queryRunner.query(`DROP INDEX \`IDX_7cc1c9e3853b94816c094825e7\` ON \`locations\``);
        await queryRunner.query(`DROP TABLE \`locations\``);
        await queryRunner.query(`DROP INDEX \`IDX_65140f59763ff994a025248816\` ON \`access_tokens\``);
        await queryRunner.query(`DROP TABLE \`access_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_e23bff04e9c3e7b785e442b262\` ON \`user_identities\``);
        await queryRunner.query(`DROP TABLE \`user_identities\``);
        await queryRunner.query(`DROP INDEX \`IDX_cf6e94661c4437ead20d039dbb\` ON \`user_passports\``);
        await queryRunner.query(`DROP TABLE \`user_passports\``);
        await queryRunner.query(`DROP INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`user_phones\``);
        await queryRunner.query(`DROP INDEX \`IDX_89013841cd2e687e3d807d34f2\` ON \`countries\``);
        await queryRunner.query(`DROP INDEX \`IDX_fa1376321185575cf2226b1491\` ON \`countries\``);
        await queryRunner.query(`DROP INDEX \`IDX_b29f9172f8b660e7834000c424\` ON \`countries\``);
        await queryRunner.query(`DROP INDEX \`IDX_a1c0d005a87cc318b4ddda4d92\` ON \`countries\``);
        await queryRunner.query(`DROP INDEX \`IDX_b2d7006793e8697ab3ae2deff1\` ON \`countries\``);
        await queryRunner.query(`DROP TABLE \`countries\``);
        await queryRunner.query(`DROP INDEX \`IDX_6594597afde633cfeab9a806e4\` ON \`user_emails\``);
        await queryRunner.query(`DROP TABLE \`user_emails\``);
    }

}
