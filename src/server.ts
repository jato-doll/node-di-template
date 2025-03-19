import { ClassConstructor } from "class-transformer";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import { container, singleton } from "tsyringe";

import { AppEnv, Decorate, DEFAULT_PATH } from "./configs/constants.config";
import { ControllerRoute } from "./utils/decorators/http-request.decorator";
import { Logger } from "./configs/logger.config";
import ErrorHandler from "./utils/middlewares/error.middleware";
import RequestLogger from "./utils/middlewares/req.middleware";
import ResponseLogger from "./utils/middlewares/res.middleware";

@singleton()
export class AppServer {
    private app: Application;

    private controllers: ClassConstructor<any>[] = [];

    constructor() {
        this.app = express();
    }

    /**
     * Get application server instance for testing
     *
     * @returns Application server instance
     */
    getApplication(): Application {
        return this.app;
    }

    async InitializeAppServer(
        controllers: ClassConstructor<any>[] = [],
    ): Promise<void> {
        try {
            // define controllers
            this.controllers = controllers;

            return this.pluginMiddlewares();
        } catch (error) {
            Logger.Error(String(error));
            process.exit(1);
        }
    }

    private pluginMiddlewares(): Promise<void> {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(RequestLogger);
        this.app.use(ResponseLogger);

        return this.registerControllers();
    }

    private registerControllers(): Promise<void> {
        // Register all controllers
        this.controllers.forEach((controller: any) => {
            // Register container
            container.registerSingleton(controller);

            const controllerPaht = Reflect.getMetadata(
                Decorate.CONTROLLER_ROUTE_PATH,
                controller,
            );

            // Register routes
            const instance: any = container.resolve(controller);
            const prototype = Object.getPrototypeOf(instance);

            Object.getOwnPropertyNames(prototype).forEach((methodName) => {
                const route: ControllerRoute = Reflect.getMetadata(
                    Decorate.HTTP_ROUTE_PATH,
                    prototype,
                    methodName,
                );

                if (route) {
                    // custom controller path
                    let path = controllerPaht
                        ? `/${controllerPaht}/${route.path}`
                        : `/${route.path}`;

                    // add DEFAULT_PATH of the API service if set
                    if (DEFAULT_PATH) {
                        path = DEFAULT_PATH + path;
                    }

                    Logger.Success(
                        `Registering route: [${route.method.toUpperCase()}] ${path}`,
                    );

                    // add router and method each path
                    this.app[route.method](
                        path.toLowerCase(),
                        (req, res, next) => {
                            instance[route.name](req, res, next);
                        },
                    );
                }
            });
        });

        return this.handleErrorExceptions();
    }

    /**
     * Handle Error Exceptions
     * after all middlewares and controllers are registered
     */
    private handleErrorExceptions(): Promise<void> {
        // Setup error handler to controllers
        this.app.use(ErrorHandler);

        return this.startServer();
    }

    private async startServer(): Promise<void> {
        // Skip server start for test environment
        if (process.env.NODE_ENV === "test") {
            return;
        }

        // Start app server
        this.app.listen(AppEnv.PORT, () => {
            const runningMessage =
                process.env.NODE_ENV === "localhost"
                    ? `Server is running on http://localhost:${AppEnv.PORT + DEFAULT_PATH}/`
                    : `Server is running on ${process.env.NODE_ENV} stage`;
            Logger.Log(runningMessage);
        });
    }
}
