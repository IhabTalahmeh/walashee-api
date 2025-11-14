import { MigrationInterface, QueryRunner } from "typeorm";

export class Walashee1763160369320 implements MigrationInterface {
    name = 'Walashee1763160369320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_emails\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`status\` enum ('verified', 'not_verified') NOT NULL DEFAULT 'not_verified', \`userId\` varchar(36) NULL, UNIQUE INDEX \`IDX_6594597afde633cfeab9a806e4\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`countries\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`iso\` varchar(10) NULL, \`iso3\` varchar(10) NULL, \`name\` varchar(128) NULL, \`nameAR\` varchar(128) NULL, \`phoneCode\` varchar(255) NULL, INDEX \`IDX_b2d7006793e8697ab3ae2deff1\` (\`id\`), UNIQUE INDEX \`IDX_a1c0d005a87cc318b4ddda4d92\` (\`iso\`), UNIQUE INDEX \`IDX_b29f9172f8b660e7834000c424\` (\`iso3\`), UNIQUE INDEX \`IDX_fa1376321185575cf2226b1491\` (\`name\`), UNIQUE INDEX \`IDX_89013841cd2e687e3d807d34f2\` (\`nameAR\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_phones\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`phoneCode\` varchar(255) NOT NULL, \`number\` varchar(255) NOT NULL, \`status\` enum ('verified', 'not_verified') NOT NULL DEFAULT 'not_verified', \`isPrimary\` tinyint NOT NULL DEFAULT 0, \`fullPhoneNumber\` varchar(255) NOT NULL, \`countryId\` varchar(36) NULL, \`userId\` varchar(36) NULL, UNIQUE INDEX \`IDX_2bd47d427af92e3a3b53eaf0f5\` (\`fullPhoneNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`access_tokens\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`blacklisted\` tinyint NOT NULL DEFAULT 0, \`expired\` tinyint NOT NULL DEFAULT 0, \`userId\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NOT NULL, INDEX \`IDX_65140f59763ff994a025248816\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_identities\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`identificationType\` enum ('id', 'passport') NOT NULL, \`idNumber\` varchar(255) NOT NULL, \`passportNumber\` varchar(255) NULL, \`firstName\` varchar(255) NOT NULL, \`fatherName\` varchar(255) NOT NULL, \`grandfatherName\` varchar(255) NOT NULL, \`familyName\` varchar(255) NOT NULL, \`motherName\` varchar(255) NOT NULL, \`dateOfBirth\` date NOT NULL, \`placeOfBirth\` varchar(255) NOT NULL, \`gender\` enum ('male', 'female') NOT NULL, \`placeOfIssue\` varchar(255) NOT NULL, \`dateOfIssue\` date NOT NULL, \`dateOfEnd\` date NOT NULL, INDEX \`IDX_e23bff04e9c3e7b785e442b262\` (\`id\`), UNIQUE INDEX \`IDX_fca15455bce6d35321c65b64c5\` (\`idNumber\`), UNIQUE INDEX \`IDX_3ff2dd1d856f5706a053fc2d78\` (\`passportNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_passports\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`fullName\` varchar(255) NOT NULL, \`nationality\` varchar(255) NOT NULL, \`motherName\` varchar(255) NOT NULL, \`gender\` varchar(255) NOT NULL, \`dateOfBirth\` datetime NOT NULL, \`placeOfBirth\` varchar(255) NOT NULL, \`idNumber\` varchar(255) NOT NULL, \`passportNumber\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`dateOfIssue\` datetime NOT NULL, \`dateOfExpiry\` datetime NOT NULL, \`issuingAuthority\` varchar(255) NOT NULL, \`countryCode\` varchar(255) NOT NULL, INDEX \`IDX_cf6e94661c4437ead20d039dbb\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`addresses\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`address1\` varchar(255) NOT NULL, \`address2\` varchar(255) NULL, \`city\` varchar(255) NULL, \`street\` varchar(255) NULL, \`postalCode\` varchar(255) NULL, INDEX \`IDX_745d8f43d3af10ab8247465e45\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`locations\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`latitude\` decimal(9,6) NOT NULL, \`longitude\` decimal(9,6) NOT NULL, INDEX \`IDX_7cc1c9e3853b94816c094825e7\` (\`id\`), INDEX \`IDX_f81075bcc6ed548247c1a33347\` (\`latitude\`, \`longitude\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`contacts\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`website\` varchar(255) NULL, \`countryId\` varchar(36) NOT NULL, INDEX \`IDX_b99cd40cfd66a99f1571f4f72e\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`companies\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`nameAR\` varchar(255) NOT NULL, \`nameEN\` varchar(255) NOT NULL, \`info\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`type\` enum ('team_invitation') NOT NULL, \`titleAr\` varchar(500) NOT NULL, \`titleEn\` varchar(500) NOT NULL, \`messageAr\` text NULL, \`messageEn\` text NULL, \`event\` varchar(100) NULL, \`screen\` varchar(100) NULL, \`params\` json NULL, \`deeplink\` varchar(255) NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`userId\` varchar(36) NULL, INDEX \`IDX_692a909ee0fa9383e7859f9b40\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teams\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`avatar\` varchar(255) NULL, \`ownerId\` varchar(36) NOT NULL, INDEX \`IDX_7e5523774a38b08a6236d32240\` (\`id\`), UNIQUE INDEX \`REL_b5ebe13256317503931ecabb55\` (\`ownerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`team_invitations\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`as\` enum ('agent', 'driver', 'store_manager') NOT NULL, \`status\` enum ('pending', 'accepted', 'in_review') NOT NULL, \`inviterId\` varchar(36) NOT NULL, \`inviteeId\` varchar(36) NOT NULL, \`teamId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`team_invitation_requests\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(36) NOT NULL, \`fullName\` varchar(255) NOT NULL, \`dateOfBirth\` date NULL, \`docNumber\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`doc\` varchar(255) NOT NULL, \`invitationId\` varchar(36) NULL, INDEX \`IDX_aaaf41febfc3d56b2672d13428\` (\`id\`), UNIQUE INDEX \`REL_6e564e9f7aadca5eed7d01c63a\` (\`invitationId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`password_reset_codes\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`expiresAt\` datetime NOT NULL, \`userId\` varchar(36) NULL, INDEX \`IDX_f3a88f7bc4536c53f2b277a0b5\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`fullName\` varchar(255) NULL, \`dateOfBirth\` date NULL, \`gender\` enum ('male', 'female') NULL, \`role\` enum ('admin', 'customer', 'agent', 'delivery_company', 'driver', 'supplier', 'store_manager') NOT NULL DEFAULT 'customer', \`useAs\` enum ('admin', 'customer', 'agent', 'delivery_company', 'driver', 'supplier', 'store_manager') NOT NULL DEFAULT 'customer', \`avatar\` varchar(255) NULL, \`languageCode\` enum ('ar', 'en') NOT NULL DEFAULT 'en', \`verified\` tinyint NOT NULL DEFAULT 0, INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`verification_codes\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`type\` enum ('email', 'mobile') NOT NULL, \`purpose\` enum ('account', 'login') NOT NULL, \`expiresAt\` datetime NOT NULL, \`emailId\` varchar(36) NULL, \`phoneId\` varchar(36) NULL, INDEX \`IDX_18741b6b8bf1680dbf5057421d\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`fcm_tokens\` (\`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`id\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, INDEX \`IDX_0802a779d616597e9330bb9a7c\` (\`id\`), UNIQUE INDEX \`IDX_642d4f7ba5c6e019c2d8f5332a\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_emails\` ADD CONSTRAINT \`FK_569342223a28f006d9bf897c7c9\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_phones\` ADD CONSTRAINT \`FK_c2c05a0a39c003b81b5be1e3673\` FOREIGN KEY (\`countryId\`) REFERENCES \`countries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_phones\` ADD CONSTRAINT \`FK_4615e35b764e3aa70adfaad6d2f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contacts\` ADD CONSTRAINT \`FK_37c7a529302085865a7167a053e\` FOREIGN KEY (\`countryId\`) REFERENCES \`countries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD CONSTRAINT \`FK_692a909ee0fa9383e7859f9b406\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`teams\` ADD CONSTRAINT \`FK_b5ebe13256317503931ecabb556\` FOREIGN KEY (\`ownerId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`team_invitations\` ADD CONSTRAINT \`FK_37ab0591f414697320ed921915c\` FOREIGN KEY (\`inviterId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`team_invitations\` ADD CONSTRAINT \`FK_460a518a4d370488a7b3ad3e23f\` FOREIGN KEY (\`inviteeId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`team_invitations\` ADD CONSTRAINT \`FK_51467b016e4b6bc51f2d2f080a8\` FOREIGN KEY (\`teamId\`) REFERENCES \`teams\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`team_invitation_requests\` ADD CONSTRAINT \`FK_6e564e9f7aadca5eed7d01c63a3\` FOREIGN KEY (\`invitationId\`) REFERENCES \`team_invitations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`password_reset_codes\` ADD CONSTRAINT \`FK_9c30b1d4c6199fd152c128dbd37\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`verification_codes\` ADD CONSTRAINT \`FK_f0a55af8dd9a1596b253b28af68\` FOREIGN KEY (\`emailId\`) REFERENCES \`user_emails\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`verification_codes\` ADD CONSTRAINT \`FK_d86c16728b320188b3040d6f5b8\` FOREIGN KEY (\`phoneId\`) REFERENCES \`user_phones\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`verification_codes\` DROP FOREIGN KEY \`FK_d86c16728b320188b3040d6f5b8\``);
        await queryRunner.query(`ALTER TABLE \`verification_codes\` DROP FOREIGN KEY \`FK_f0a55af8dd9a1596b253b28af68\``);
        await queryRunner.query(`ALTER TABLE \`password_reset_codes\` DROP FOREIGN KEY \`FK_9c30b1d4c6199fd152c128dbd37\``);
        await queryRunner.query(`ALTER TABLE \`team_invitation_requests\` DROP FOREIGN KEY \`FK_6e564e9f7aadca5eed7d01c63a3\``);
        await queryRunner.query(`ALTER TABLE \`team_invitations\` DROP FOREIGN KEY \`FK_51467b016e4b6bc51f2d2f080a8\``);
        await queryRunner.query(`ALTER TABLE \`team_invitations\` DROP FOREIGN KEY \`FK_460a518a4d370488a7b3ad3e23f\``);
        await queryRunner.query(`ALTER TABLE \`team_invitations\` DROP FOREIGN KEY \`FK_37ab0591f414697320ed921915c\``);
        await queryRunner.query(`ALTER TABLE \`teams\` DROP FOREIGN KEY \`FK_b5ebe13256317503931ecabb556\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_692a909ee0fa9383e7859f9b406\``);
        await queryRunner.query(`ALTER TABLE \`contacts\` DROP FOREIGN KEY \`FK_37c7a529302085865a7167a053e\``);
        await queryRunner.query(`ALTER TABLE \`user_phones\` DROP FOREIGN KEY \`FK_4615e35b764e3aa70adfaad6d2f\``);
        await queryRunner.query(`ALTER TABLE \`user_phones\` DROP FOREIGN KEY \`FK_c2c05a0a39c003b81b5be1e3673\``);
        await queryRunner.query(`ALTER TABLE \`user_emails\` DROP FOREIGN KEY \`FK_569342223a28f006d9bf897c7c9\``);
        await queryRunner.query(`DROP INDEX \`IDX_642d4f7ba5c6e019c2d8f5332a\` ON \`fcm_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_0802a779d616597e9330bb9a7c\` ON \`fcm_tokens\``);
        await queryRunner.query(`DROP TABLE \`fcm_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_18741b6b8bf1680dbf5057421d\` ON \`verification_codes\``);
        await queryRunner.query(`DROP TABLE \`verification_codes\``);
        await queryRunner.query(`DROP INDEX \`IDX_a3ffb1c0c8416b9fc6f907b743\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_f3a88f7bc4536c53f2b277a0b5\` ON \`password_reset_codes\``);
        await queryRunner.query(`DROP TABLE \`password_reset_codes\``);
        await queryRunner.query(`DROP INDEX \`REL_6e564e9f7aadca5eed7d01c63a\` ON \`team_invitation_requests\``);
        await queryRunner.query(`DROP INDEX \`IDX_aaaf41febfc3d56b2672d13428\` ON \`team_invitation_requests\``);
        await queryRunner.query(`DROP TABLE \`team_invitation_requests\``);
        await queryRunner.query(`DROP TABLE \`team_invitations\``);
        await queryRunner.query(`DROP INDEX \`REL_b5ebe13256317503931ecabb55\` ON \`teams\``);
        await queryRunner.query(`DROP INDEX \`IDX_7e5523774a38b08a6236d32240\` ON \`teams\``);
        await queryRunner.query(`DROP TABLE \`teams\``);
        await queryRunner.query(`DROP INDEX \`IDX_692a909ee0fa9383e7859f9b40\` ON \`notifications\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
        await queryRunner.query(`DROP TABLE \`companies\``);
        await queryRunner.query(`DROP INDEX \`IDX_b99cd40cfd66a99f1571f4f72e\` ON \`contacts\``);
        await queryRunner.query(`DROP TABLE \`contacts\``);
        await queryRunner.query(`DROP INDEX \`IDX_f81075bcc6ed548247c1a33347\` ON \`locations\``);
        await queryRunner.query(`DROP INDEX \`IDX_7cc1c9e3853b94816c094825e7\` ON \`locations\``);
        await queryRunner.query(`DROP TABLE \`locations\``);
        await queryRunner.query(`DROP INDEX \`IDX_745d8f43d3af10ab8247465e45\` ON \`addresses\``);
        await queryRunner.query(`DROP TABLE \`addresses\``);
        await queryRunner.query(`DROP INDEX \`IDX_cf6e94661c4437ead20d039dbb\` ON \`user_passports\``);
        await queryRunner.query(`DROP TABLE \`user_passports\``);
        await queryRunner.query(`DROP INDEX \`IDX_3ff2dd1d856f5706a053fc2d78\` ON \`user_identities\``);
        await queryRunner.query(`DROP INDEX \`IDX_fca15455bce6d35321c65b64c5\` ON \`user_identities\``);
        await queryRunner.query(`DROP INDEX \`IDX_e23bff04e9c3e7b785e442b262\` ON \`user_identities\``);
        await queryRunner.query(`DROP TABLE \`user_identities\``);
        await queryRunner.query(`DROP INDEX \`IDX_65140f59763ff994a025248816\` ON \`access_tokens\``);
        await queryRunner.query(`DROP TABLE \`access_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_2bd47d427af92e3a3b53eaf0f5\` ON \`user_phones\``);
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
