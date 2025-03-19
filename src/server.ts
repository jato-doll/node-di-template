import { ClassConstructor } from "class-transformer";
import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import { container, inject, singleton } from "tsyringe";
import { DataSource } from "typeorm";

import {
    AppEnv,
    Decorate,
    DEFAULT_PATH,
    Inject,
} from "./configs/constants.config";
import { ControllerRoute } from "./utils/decorators/http-request.decorator";
import { Logger } from "./utils/logger.util";
import ErrorHandler from "./configs/middlewares/error.middleware";
import RequestLogger from "./configs/middlewares/req.middleware";
import ResponseLogger from "./configs/middlewares/res.middleware";

@singleton()
export class AppServer {
    private app: Application;

    private controllers: ClassConstructor<any>[] = [];

    constructor(@inject(Inject.DATASOURCE) private dataSource: DataSource) {
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
            
            // initialize database connection
            await this.dataSource.initialize();
            // run database migrations
            await this.dataSource.runMigrations();

            return this.pluginMiddlewares();
        } catch (error) {
            Logger.Error(String(error));
            process.exit(1);
        }
    }

    private pluginMiddlewares(): Promise<void> {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(RequestLogger);
        this.app.use(ResponseLogger);

        return this.registerControllers();
    }

    private registerControllers(): Promise<void> {
        // Register all controllers
        this.controllers?.forEach((controller: any) => {
            // Register container
            container.registerSingleton(controller);

            const controllerPaht = Reflect.getMetadata(
                Decorate.Controller.PATH,
                controller,
            );

            const repositories: any[] = Reflect.getMetadata(
                Decorate.Controller.REPOSITORIES,
                controller,
            );

            const entities: any[] = Reflect.getMetadata(
                Decorate.Controller.ENTITIES,
                controller,
            );

            // register all entity repositories
            if (repositories?.length) {
                repositories.forEach(({ repo, entity }) => {
                    // register Repository if not registered
                    if (!container.isRegistered(repo.name)) {
                        const repoMethods = this.extractRepositoryMethods(
                            repo,
                            entity,
                        );

                        container.register(repo.name, {
                            useValue: this.dataSource
                                .getRepository(entity)
                                .extend(repoMethods),
                        });
                    }
                });
            }

            // register all entities
            if (entities?.length) {
                entities.forEach((entity) => {
                    // register Entity if not registered
                    if (!container.isRegistered(entity.name)) {
                        container.register(entity.name, {
                            useValue: this.dataSource.getRepository(entity),
                        });
                    }
                });
            }

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
                    const path = controllerPaht
                        ? `/${controllerPaht}/${route.path}`.replace(
                              /(\/\/)/g,
                              "/",
                          )
                        : `/${route.path}`;

                    Logger.Success(
                        `Register HTTP [${route.method.toUpperCase()}]${path}`,
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
                    ? `Server is running on http://localhost:${
                          AppEnv.PORT + DEFAULT_PATH
                      }/`
                    : `Server is running on ${process.env.NODE_ENV} stage`;
            Logger.Log(runningMessage);
        });
    }

    /**
     * A helper function to extract repository methods
     * @param repo entity repository
     * @param entity class entity
     * @returns object of repository medhods
     */
    private extractRepositoryMethods(repo: any, entity: any): any {
        const methods = Object.getOwnPropertyNames(repo.prototype).filter(
            (methodName) => methodName !== "constructor",
        );

        return methods.reduce((obj, methodName) => {
            obj[methodName] = repo.prototype[methodName].bind(
                // bind entity repository help each method can use this keyword properly
                this.dataSource.getRepository(entity),
            );
            return obj;
        }, {} as any);
    }
}
