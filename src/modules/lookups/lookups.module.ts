import { Module } from '@nestjs/common';
import { LookupsController } from './controllers/lookups.controller';
import { LookupsService } from './services/lookups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/typeorm/entities';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Country,
		]),
	],
	controllers: [LookupsController],
	providers: [LookupsService],
})
export class LookupsModule {}
