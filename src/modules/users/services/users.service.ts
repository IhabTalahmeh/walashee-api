import { UUID } from 'crypto';
import { extname } from 'path';
import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERoleType } from '../../../common/enum';
import { User } from '../../../typeorm/entities';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UtilityService } from 'src/common/services/utility.service';
import { EntityLookupService } from 'src/modules/entity-lookup/services/entity-lookup.service';
import { instanceToPlain } from 'class-transformer';
import { AWSHelper } from 'src/common/services/aws-helper.service';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepo: Repository<User>,
		private entityLookupService: EntityLookupService,
		private _config: ConfigService,
		private utility: UtilityService,
		private awsHelper: AWSHelper,
	) { }

	async updateProfile(
		userId: UUID,
		file: Buffer | null,
		dto: UpdateProfileDto,
	) {
		let user = await this.entityLookupService.findUserById(userId);
		const avatar = file ? `${Date.now()}.jpg` : undefined;

		if (!user) {
			throw new NotFoundException();
		}

		console.log(file, avatar);

		if (file && avatar) {
			await this.awsHelper.uploadAvatar(`users/${user.id}/avatar`, file, avatar)
		}

		console.log('dto', dto);

		await this.usersRepo.update(userId, { ...dto, avatar });

		user = await this.entityLookupService.findUserById(userId);

		console.log('avatar')

		return instanceToPlain(user);
	}

}
