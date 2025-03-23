import { BcryptLibService } from "../../libs/bcrypt.service";
import { JWTLibService } from "../../libs/jwt.service";
import {
    InjectCustomRepo,
    InjectLibService,
    Service,
} from "../../utils/decorators/app-registry.decorator";
import { HttpError } from "../../utils/http-error.util";
import { AuthRepository } from "./auth.repository";
import { LoginData, RegisterData } from "./auth.validate";

@Service()
export class AuthService {
    constructor(
        @InjectCustomRepo(AuthRepository)
        private readonly authRepo: AuthRepository,

        // inject library services
        @InjectLibService(JWTLibService)
        private readonly jwtLib: JWTLibService,
        @InjectLibService(BcryptLibService)
        private readonly bcryptLib: BcryptLibService,
    ) {}

    async register({ name, email, password }: RegisterData) {
        let user = await this.authRepo.findUserEmail(email);
        if (user) {
            throw HttpError.BadRequest("Email already exists");
        }

        const hashedPass = await this.bcryptLib.hashPassword(password);

        await this.authRepo.registerUser({
            password: hashedPass,
            email,
            name,
        });
    }

    async login({ email, password }: LoginData) {
        let user = await this.authRepo.findUserEmail(email);
        if (!user) {
            throw HttpError.NotFound("Email not found");
        }

        const isPassValid = await this.bcryptLib.comparePassword(
            password,
            user.password,
        );
        if (!isPassValid) {
            throw HttpError.Unauthorized("Invalid password");
        }

        return this.jwtLib.signToken(
            { userId: user.id },
            {
                expiresIn: "1h",
            },
        );
    }
}
