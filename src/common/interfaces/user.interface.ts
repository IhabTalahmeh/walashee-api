import { UUID } from "crypto";

export class IUser {
    id: UUID;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    password?: string;
}