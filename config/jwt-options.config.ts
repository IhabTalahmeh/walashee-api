import { JwtModuleAsyncOptions } from "@nestjs/jwt";
import jwtConfig from "./jwt.config";


export const jwtOptions: JwtModuleAsyncOptions = {
	useFactory: () => {
		const config = jwtConfig();

		return {
			secret: config.secret,
			signOptions: {
				audience: config.audience,
				algorithm: 'HS512',
				expiresIn: config.expiresIn as any,
			}
		};
	},
};