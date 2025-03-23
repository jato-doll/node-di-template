import * as dotenv from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";

dotenv.config();

/**
 * ********************************
 *         App Environment
 * ********************************
 */

export const AppEnv = {
    PORT: Number(process.env.PORT) || 3000,
    JWT_SECRET: process.env.JWT_SECRET as string,
    Database: {
        HOST: process.env.MYSQL_HOST,
        PORT: Number(process.env.MYSQL_PORT),
        USERNAME: process.env.MYSQL_USERNAME,
        PASSWORD: process.env.MYSQL_PASSWORD,
        DATABASE: process.env.MYSQL_DATABASE,
    },
};

/**
 * ********************************
 *          App Constants
 * ********************************
 */

export const DEFAULT_PATH = "/api/v1";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: AppEnv.Database.HOST,
    port: AppEnv.Database.PORT,
    username: AppEnv.Database.USERNAME,
    password: AppEnv.Database.PASSWORD,
    database: AppEnv.Database.DATABASE,
    entities: [
        join(__dirname, "../entities/*.entity.ts"),
        join(__dirname, "../entities/*.entity.js"),
    ],
    /**
     * !!! NOTE !!!
     *  Require build app before run migration command. The typeorm migration
     *  can't see orm.config.ts file. Thus JUST build the app first!
     */
    migrations: [join(__dirname, "../migrations/*.js")],
    migrationsRun: false,
    logging: false,
    synchronize: false,
});

/**
 * ********************************
 *          App Symbol
 * ********************************
 */

export const Inject = {
    DATASOURCE: Symbol.for("datasource"),
};

export const Decorate = {
    HTTP_ROUTE_PATH: Symbol.for("HTTP_ROUTE_PATH"),
    Controller: {
        ENTITIES: Symbol.for("CONTROLLER_ENTITIES"),
        LIBRARIES: Symbol.for("CONTROLLER_LIBRARIES"),
        PATH: Symbol.for("CONTROLLER_PATH"),
        REPOSITORIES: Symbol.for("CONTROLLER_REPOSITORIES"),
    },
    Service: {
        ENTITIES: Symbol.for("SERVICE_ENTITIES"),
        LIBRARIES: Symbol.for("SERVICE_LIBRARIES"),
        REPOSITORIES: Symbol.for("SERVICE_REPOSITORIES"),
    },
    CLASS_TRANSFORMER: Symbol.for("CLASS_TRANSFORMER"),
    JWT_AUTHENTICATION: Symbol.for("JWT_AUTHENTICATION"),
};
