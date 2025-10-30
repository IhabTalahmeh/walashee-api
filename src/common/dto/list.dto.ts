import { IsNumber, IsOptional } from '@nestjs/class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

export class ListDto {
	@ApiPropertyOptional({ type: Number, default: 1 })
	@Type(() => Number)
	@IsOptional()
	@IsNumber()
	page = 1;

	@ApiPropertyOptional({ type: Number, default: 10 })
	@Type(() => Number)
	@IsOptional()
	@IsNumber()
	size = 10;
}
