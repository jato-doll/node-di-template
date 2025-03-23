import { Repository } from "typeorm";
import { User } from "../../entities/user.entity";
import {
    InjectEntityRepo,
    Service,
} from "../../utils/decorators/app-registry.decorator";
import { UpdateUserData } from "./user.validate";
import { HttpError } from "../../utils/http-error.util";

@Service()
export class UserService {
    constructor(
        @InjectEntityRepo(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async updateUser({ name, email, user }: UpdateUserData) {
        if (email) {
            const someUser = await this.userRepo.findOneBy({ email });

            if (someUser?.email && someUser.email !== user.email) {
                throw HttpError.BadRequest("Email already exist");
            }
        }

        return this.userRepo.save({
            ...user,
            email: email || user.email,
            name: name || user.name,
        });
    }
}
