import { Controller, Get } from '@nestjs/common';
import { LookupsService } from '../services/lookups.service';

@Controller('lookups')
export class LookupsController {
	constructor(private lookupsService: LookupsService) { }

	@Get('countries')
	async getCountries() {
		return await this.lookupsService.getCountries();
	}

	@Get('/genders')
	async getGenders() {
		return await this.lookupsService.getGenders();
	}
}
