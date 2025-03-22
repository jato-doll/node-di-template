import { Controller } from "../../utils/decorators/app-registry.decorator";
import {
    Get,
    AuthGuard,
    Patch,
    ValidateRequest,
    TransformResponse,
} from "../../utils/decorators/http-request.decorator";
import { TAuthRequest } from "../../utils/validate.util";
import { UserService } from "./user.service";
import { UserInfoResult } from "./user.transform";
import { UpdateUserData } from "./user.validate";

@Controller("Users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @AuthGuard("JWT")
    @TransformResponse(UserInfoResult)
    @Get("Me")
    userMe(req: TAuthRequest) {
        return req.user;
    }

    @AuthGuard("JWT")
    @TransformResponse(UserInfoResult)
    @ValidateRequest(UpdateUserData)
    @Patch("Me")
    updateMe(data: UpdateUserData) {
        return this.userService.updateUser(data);
    }
}
