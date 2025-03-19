import * as dotenv from "dotenv";

dotenv.config();

/**
 * API Default Path
 */

export const DEFAULT_PATH = "/Log-Service";

/**
 * Application Environments
 */

export const AppEnv = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: Number(process.env.PORT) || 3000,
};

/**
 * Application Symbols
 */

export const Decorate = {
    CONTROLLER_ROUTE_PATH: Symbol.for("CONTROLLER_ROUTE_PATH"),
    HTTP_ROUTE_PATH: Symbol.for("HTTP_ROUTE_PATH"),
    CLASS_TRANSFORMER: Symbol.for("CLASS_TRANSFORMER"),
};
