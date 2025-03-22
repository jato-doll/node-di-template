import { Expose } from "class-transformer";

export class UserInfoResult {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    email!: string;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;
}