import { MigrationInterface, QueryRunner } from "typeorm";

export class Walashee1763234209395 implements MigrationInterface {
    name = 'Walashee1763234209395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`team_invitation_requests\` DROP FOREIGN KEY \`FK_6e564e9f7aadca5eed7d01c63a3\``);
        await queryRunner.query(`DROP INDEX \`REL_6e564e9f7aadca5eed7d01c63a\` ON \`team_invitation_requests\``);
        await queryRunner.query(`ALTER TABLE \`user_emails\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`countries\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_phones\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`access_tokens\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_passports\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`locations\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacts\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`companies\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`teams\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`team_invitations\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`team_invitation_requests\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`password_reset_codes\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`verification_codes\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`fcm_tokens\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`team_invitation_requests\` ADD CONSTRAINT \`FK_6e564e9f7aadca5eed7d01c63a3\` FOREIGN KEY (\`invitationId\`) REFERENCES \`team_invitations\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`team_invitation_requests\` DROP FOREIGN KEY \`FK_6e564e9f7aadca5eed7d01c63a3\``);
        await queryRunner.query(`ALTER TABLE \`fcm_tokens\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`verification_codes\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`password_reset_codes\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`team_invitation_requests\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`team_invitations\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`teams\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`companies\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`contacts\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`locations\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`addresses\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_passports\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_identities\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`access_tokens\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_phones\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`countries\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_emails\` CHANGE \`deletedAt\` \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_6e564e9f7aadca5eed7d01c63a\` ON \`team_invitation_requests\` (\`invitationId\`)`);
        await queryRunner.query(`ALTER TABLE \`team_invitation_requests\` ADD CONSTRAINT \`FK_6e564e9f7aadca5eed7d01c63a3\` FOREIGN KEY (\`invitationId\`) REFERENCES \`team_invitations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
