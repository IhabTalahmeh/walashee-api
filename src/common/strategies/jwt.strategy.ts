import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { AccessToken } from '../../typeorm/entities';

import { IAccessTokenPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private configService: ConfigService,

		@InjectRepository(AccessToken)
		private accessTokensRepository: Repository<AccessToken>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			algorithms: 'HS512',
			audience: configService.get('jwt.audience'),
			issuer: configService.get('jwt.issuer'),
			secretOrKey: configService.get('jwt.secret'),
		});
	}

	async validate(payload: IAccessTokenPayload) {
		// Check for expired/blacklisted tokens.
		const now = Date.now();
		const exp: any = payload.exp;

		const record: any = await this.accessTokensRepository.findOne({
			where: { id: payload.jti },
		});

		if (now > exp && record && !record.expired) {
			record.expired = true;
			await this.accessTokensRepository.save(record);

			throw new UnauthorizedException();
		}

		if (record.expired || record.blacklisted) {
			throw new UnauthorizedException();
		}

		return payload;
	}
}
