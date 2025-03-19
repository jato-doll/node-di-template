import { container } from "tsyringe";

import { AppServer } from "../server";

// Register AppServer as singleton
container.registerSingleton(AppServer);
