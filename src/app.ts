import "reflect-metadata";
import "./configs/di-container.config"; // include dotenv config

import { container } from "tsyringe";
import { AppServer } from "./server";

// Import all controllers
import { AppController } from "./controllers/app.controller";
import { AuthController } from "./controllers/auth/auth.controller";
import { UserController } from "./controllers/users/user.controller";

// Resolve App Server instance from container
const server = container.resolve(AppServer);
// Initialize the app server
server.InitializeAppServer([AppController, AuthController, UserController]);
