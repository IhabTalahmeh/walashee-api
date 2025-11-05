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

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepo: Repository<User>,
		private entityLookupService: EntityLookupService,
		private _config: ConfigService,
		private utility: UtilityService,
	) { }

	async updateProfile(
		userId: UUID,
		dto: UpdateProfileDto,
	) {
		let user = await this.entityLookupService.findUserById(userId);

		if (!user) {
			throw new NotFoundException();
		}

		await this.usersRepo.update(userId, dto);

		user = await this.entityLookupService.findUserById(userId);

		return instanceToPlain(user);
	}

}
