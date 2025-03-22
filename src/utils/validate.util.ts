import { Expose, Transform } from "class-transformer";
import { User } from "../entities/user.entity";
import { Request } from "express";

export type TAuthRequest = Request & { user: User };

export class AuthRequest {
    @Transform(({ obj }) => obj.user)
    @Expose()
    user!: User;
}
