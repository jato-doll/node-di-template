import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    InjectCustomRepo,
    Service,
} from "../../utils/decorators/app-registry.decorator";
import { HttpError } from "../../utils/http-error.config";
import { AuthRepository } from "./auth.repository";
import { LoginData, RegisterData } from "./auth.validate";
import { AppEnv } from "../../configs/constants.config";

@Service()
export class AuthService {
    constructor(
        @InjectCustomRepo(AuthRepository)
        private readonly authRepo: AuthRepository,
    ) {}

    async register({ name, email, password }: RegisterData) {
        let user = await this.authRepo.findUserEmail(email);
        if (user) {
            throw HttpError.BadRequest("Email already exists");
        }

        const hashedPass = await bcrypt.hash(password, 12);

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

        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            throw HttpError.Unauthorized("Invalid password");
        }

        return jwt.sign({ userId: user.id }, AppEnv.JWT_SECRET, {
            expiresIn: "1h",
        });
    }
}
