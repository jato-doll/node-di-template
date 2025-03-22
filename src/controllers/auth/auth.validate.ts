import { Expose } from "class-transformer";
import {
    IsAlphanumeric,
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
} from "class-validator";

export class RegisterData {
    @IsNotEmpty()
    @IsString()
    @Expose()
    name!: string;

    @IsEmail()
    @Expose()
    email!: string;

    @IsAlphanumeric()
    @Length(8, 12)
    @Expose()
    password!: string;
}

export class LoginData {
    @IsEmail()
    @Expose()
    email!: string

    @IsAlphanumeric()
    @Length(8, 12)
    @Expose()
    password!: string
}