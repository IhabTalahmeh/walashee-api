import type { UUID } from "crypto";
import { ERoleType } from '../enum/role-type.enum';


export interface IAccessTokenPayload {
	iat: number;
	jti: UUID;
	iss: UUID;
	sub: UUID;
	role: ERoleType;
	audience?: string;
	exp?: number;
}
