import { Expose, Transform } from "class-transformer";

export class LoginResult {
    @Transform(({ obj }) => obj.result)
    @Expose()
    accessToken!: string;
}
