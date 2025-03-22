import { Controller } from "../../utils/decorators/app-registry.decorator";
import {
    Post,
    TransformResponse,
    ValidateRequest,
} from "../../utils/decorators/http-request.decorator";
import { AuthService } from "./auth.service";
import { LoginResult } from "./auth.transform";
import { LoginData, RegisterData } from "./auth.validate";

@Controller("Auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ValidateRequest(RegisterData)
    @Post("Register")
    register(data: RegisterData) {
        return this.authService.register(data);
    }

    @TransformResponse(LoginResult)
    @ValidateRequest(LoginData)
    @Post("Login")
    login(data: LoginData) {
        return this.authService.login(data);
    }
}
