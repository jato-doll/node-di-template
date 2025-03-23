import { inject, injectable, singleton } from "tsyringe";
import { Decorate } from "../../configs/constants.config";

// Define a class constructure key
const CLASS_CONSTRUCTURE_KEY = "design:paramtypes";

/**
 * determine a app's Controller decorator
 *
 * @param path controller's route path
 */
export function Controller(path?: string): ClassDecorator {
    return (target: any) => {
        // Set default controller path
        if (path) {
            Reflect.defineMetadata(Decorate.Controller.PATH, path, target);
        }

        singleton()(target); // Make the class injectable once

        const metadataKeys = Reflect.getMetadataKeys(target);

        metadataKeys.forEach((key: string) => {
            if (key === CLASS_CONSTRUCTURE_KEY) {
                const services = Reflect.getMetadata(key, target);

                if (services?.length > 0) {
                    const controllerRepositories: any = [];
                    const controllerEntities: any = [];
                    const controllerLibraries: any = [];

                    services.forEach((service: any) => {
                        // get injected repositories each service
                        const repositories = Reflect.getMetadata(
                            Decorate.Service.REPOSITORIES,
                            service,
                        );

                        // set repositories from service if exists
                        if (repositories?.length) {
                            controllerRepositories.push(...repositories);
                        }

                        // get injected entities each service
                        const entities = Reflect.getMetadata(
                            Decorate.Service.ENTITIES,
                            service,
                        );

                        // set entities from service if exists
                        if (entities?.length) {
                            controllerEntities.push(...entities);
                        }

                        // get library services from service if exists
                        const libraries = Reflect.getMetadata(
                            Decorate.Service.LIBRARIES,
                            service,
                        );

                        // set libraries from service if exists
                        if (libraries?.length) {
                            controllerLibraries.push(...libraries);
                        }
                    });

                    // set controller repositories to metadata key
                    Reflect.defineMetadata(
                        Decorate.Controller.REPOSITORIES,
                        controllerRepositories,
                        target,
                    );

                    // set controller entities to metadata key
                    Reflect.defineMetadata(
                        Decorate.Controller.ENTITIES,
                        controllerEntities,
                        target,
                    );

                    // set controller libraries to metadata key
                    Reflect.defineMetadata(
                        Decorate.Controller.LIBRARIES,
                        controllerLibraries,
                        target,
                    );
                }
            }
        });
    };
}

/**
 * determine a Service decorator
 */
export function Service(/** type?: string */): any {
    return function (target: any): any {
        // Make the class injectable
        injectable()(target);

        // if (type === "Event") {
        //     const listeners = (target.prototype as any)._eventListeners || [];

        //     /**
        //      * This implementation required the following config
        //      * @see {@link ./src/configs/event.config.ts}
        //      */
        //     target.prototype.InitEventListener = function () {
        //         for (const { eventName, handler } of listeners) {
        //             this.on(eventName, this[handler].bind(this));
        //         }
        //     };
        // }

        // make all injected items in service was register
        const metadataKeys = Reflect.getMetadataKeys(target);
        if (metadataKeys?.includes(CLASS_CONSTRUCTURE_KEY)) {
            const serviceParams = Reflect.getMetadata(
                CLASS_CONSTRUCTURE_KEY,
                target,
            );
            if (serviceParams?.length) {
                serviceParams.forEach((param: any) => {
                    if (typeof param === "function") {
                        let repositories = Reflect.getMetadata(
                            Decorate.Service.REPOSITORIES,
                            param,
                        );
                        // set injected service constructure into current service
                        if (repositories) {
                            Reflect.defineMetadata(
                                Decorate.Service.REPOSITORIES,
                                repositories,
                                target,
                            );
                        }
                    }
                });
            }
        }
    };
}

/**
 * A decorator for custom repository class
 * @param entity class entity for this repository by
 * add decorator `@CustomRepository(Entity)` above of the following code
 * ```
 * export class CustomRepository extends Repository<User> {}
 * ```
 */
export function CustomRepository(entity: any): ClassDecorator {
    return function (target: any) {
        Reflect.defineMetadata(Decorate.Service.ENTITIES, entity, target);
    };
}

/**
 * A decorator for inject custom repository
 * @param repo a custom repository that decorated by `@CustomRepository(Entity)`
 */
export function InjectCustomRepo(repo: Function): ParameterDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol | undefined,
        parameterIndex: number,
    ) {
        let repositories = Reflect.getMetadata(
            Decorate.Service.REPOSITORIES,
            target,
        );

        const entity = Reflect.getMetadata(Decorate.Service.ENTITIES, repo);

        repositories = repositories
            ? [...repositories, { repo, entity }]
            : [{ repo, entity }];
        Reflect.defineMetadata(
            Decorate.Service.REPOSITORIES,
            repositories,
            target,
        );

        inject(repo.name)(target, propertyKey, parameterIndex);
    };
}

/**
 * A decorator for inject entity as a repository
 * @param entity class entity for this injection
 * example
 * ```
 * class AService {
 * constructor(@InjectEntityRepo(Entity)
 * private entityRepo: Repository<Entity>) { }
 * }
 * ```
 */
export function InjectEntityRepo(entity: any): ParameterDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol | undefined,
        parameterIndex: number,
    ) {
        let entities = Reflect.getMetadata(Decorate.Service.ENTITIES, target);

        entities = entities ? [...entities, entity] : [entity];
        Reflect.defineMetadata(Decorate.Service.ENTITIES, entities, target);

        inject(entity.name)(target, propertyKey, parameterIndex);
    };
}

/**
 * A decorator for inject library service
 * @param libService custom library service
 */
export function InjectLibService(service: any) {
    return function (
        target: Object,
        propertyKey: string | symbol | undefined,
        parameterIndex: number,
    ) {
        let libServices = Reflect.getMetadata(
            Decorate.Service.LIBRARIES,
            target,
        );

        libServices = libServices ? [...libServices, service] : [service];
        Reflect.defineMetadata(Decorate.Service.LIBRARIES, libServices, target);

        inject(service.name)(target, propertyKey, parameterIndex);
    };
}
