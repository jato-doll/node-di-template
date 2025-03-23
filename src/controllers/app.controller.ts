import { Controller } from "../utils/decorators/app-registry.decorator";
import { Get } from "../utils/decorators/http-request.decorator";

import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHealthCheck() {
        return { message: "OK" };
    }

    @Get("Favicon.ico")
    favicon() {
        return null;
    }

    @Get("Healthz")
    healthCheck() {
        return this.appService.getHealthCheck();
    }
}
