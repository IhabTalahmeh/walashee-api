import type { UUID } from "crypto";

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UtilityService } from 'src/common/services/utility.service';
import { IAccessTokenPayload } from 'src/common/types';
import { ERoleType } from 'src/common/enum/role-type.enum';

@Injectable()
export class AccessTokenGeneratorService {
	constructor(
		private config: ConfigService,
		private jwt: JwtService,
		private utility: UtilityService,
	) {}

	async generateAccessToken(userId: UUID, role: ERoleType) {
		const payload: IAccessTokenPayload = {
			iat: Date.now(),
			jti: this.utility.generateUUID(),
			iss: this.config.get('jwt.issuer') as `${string}-${string}-${string}-${string}-${string}`,
			sub: userId,
			role,
		};

		const token = await this.jwt.signAsync(payload);

		// The refresh token is a random string value,
		// used only when the access token is refreshed,
		// to verify that the same client requested such refresh.
		const refresh = await this.utility.generateRandomString(128);

		return {
			id: payload.jti,
			token,
			refresh,
		};
	}
}
