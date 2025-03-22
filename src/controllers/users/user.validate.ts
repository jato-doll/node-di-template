import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, IsEmail, IsOptional } from "class-validator";
import { AuthRequest } from "../../utils/validate.util";

export class UpdateUserData extends AuthRequest {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Expose()
    name!: string;

    @IsOptional()
    @IsEmail()
    @Expose()
    email!: string;
}
