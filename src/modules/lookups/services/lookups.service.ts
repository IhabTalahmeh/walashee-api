import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import * as https from 'https';
import { GENDERS } from 'src/common/constants/constants';
import { toTitleCase } from 'src/common/utils/utils';

@Injectable()
export class LookupsService {
	constructor(
		@InjectRepository(Country)
		private countriesRepository: Repository<Country>,

	) { }

	async getCountries() {
		const data = await this.countriesRepository.find();
		return { data };
	}

	async getGenders() {
		return GENDERS;
	}

	async getLocation(ip: any) {
		try {
			const response = await new Promise((resolve, reject) => {
				https
					.get(`https://freeipapi.com/api/json/${ip}`, (resp) => {
						let data = '';
						resp.on('data', (chunk) => {
							data += chunk;
						});
						resp.on('end', () => {
							try {
								const parsedData = JSON.parse(data);
								resolve(parsedData);
							} catch (e) {
								reject(e);
							}
						});
					})
					.on('error', (err) => {
						reject(err);
					});
			});
			return response;
		} catch (error) {
			console.error('Failed to fetch IP information:', error);
			throw new Error('Failed to fetch IP information');
		}
	}

	// async updateCountries(countries: any[]) {
	// 	for (const country of countries) {
	// 		await this.countriesRepository.update(
	// 			{ id: country.id },
	// 			{ arabic_name: country.arabic_name },
	// 		);
	// 	}
	// 	return 'finished';
	// }
}
