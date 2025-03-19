import { Service } from "../utils/decorators/app-registry.decorator";

@Service()
export class AppService {
    constructor() {}

    getHealthCheck() {
        return { message: "OK" };
    }
}
