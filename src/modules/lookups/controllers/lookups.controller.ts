import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { LookupsService } from '../services/lookups.service';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { Roles } from 'src/common/decorators';
import { ERoleType } from 'src/common/enum';

@Controller('lookups')
export class LookupsController {
	constructor(private lookupsService: LookupsService) {}

	@Get('countries')
	async getCountries() {
		return await this.lookupsService.getCountries();
	}
}
