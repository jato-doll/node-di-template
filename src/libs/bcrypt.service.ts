import bcrypt from "bcrypt";

import { Service } from "../utils/decorators/app-registry.decorator";

@Service()
export class BcryptLibService {
    hashPassword(password: string, rounds: number = 12) {
        return bcrypt.hash(password, rounds);
    }

    comparePassword(password: string, hashedPass: string) {
        return bcrypt.compare(password, hashedPass);
    }
}
