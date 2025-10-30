import {
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { ERoleType } from '../enum/role-type.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		return super.canActivate(context);
	}

	handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
	
		if (err || !user) {
			throw new UnauthorizedException();
		}

		const targets = [context.getHandler(), context.getClass()];

		const requiredRoles = this.reflector.getAllAndOverride<ERoleType[]>(
			ROLES_KEY,
			targets,
		);

		if (requiredRoles?.length) {
			const isAuthorized = requiredRoles.some(
				(role) => user?.role === role,
			);

			if (!isAuthorized) {
				throw new UnauthorizedException();
			}
		}

		return user;
	}
}
