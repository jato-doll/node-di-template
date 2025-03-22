import { Repository } from "typeorm";
import { RegisterData } from "./auth.validate";
import { User } from "../../entities/user.entity";
import { CustomRepository } from "../../utils/decorators/app-registry.decorator";

@CustomRepository(User)
export class AuthRepository extends Repository<User> {
    findUserId(userId: number) {
        return this.findOneBy({ id: userId });
    }

    findUserEmail(email: string) {
        return this.findOneBy({ email });
    }

    registerUser(data: RegisterData) {
        const user = this.create(data);
        return this.save(user);
    }
}
