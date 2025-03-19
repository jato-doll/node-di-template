import { container } from "tsyringe";
import { AppDataSource, Inject } from "./constants.config";

import { AppServer } from "../server";

container.register(Inject.DATASOURCE, {
    useValue: AppDataSource,
});

// Register AppServer as singleton
container.registerSingleton(AppServer);
