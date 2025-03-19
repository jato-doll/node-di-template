import { injectable, singleton } from "tsyringe";

import { Decorate } from "../../configs/constants.config";

/**
 * determine a app's Controller decorator
 *
 * @param path controller's route path
 */
export function Controller(path?: string): ClassDecorator {
    return (target: any) => {
        // Set default controller path
        if (path) {
            Reflect.defineMetadata(
                Decorate.CONTROLLER_ROUTE_PATH,
                path,
                target,
            );
        }

        singleton()(target); // Make the class injectable once
    };
}

/**
 * determine a Service decorator
 * @param type type of service specify `Event` when declare service for event listeners
 */
export function Service(/** type?: "Event" */): any {
    return function (target: any): any {
        // Make the class injectable
        injectable()(target);

        // if (type === 'Event') {
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
    };
}
